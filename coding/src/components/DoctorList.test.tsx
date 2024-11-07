import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import DoctorList from './DoctorList';
import axiosMock from 'axios-mock-adapter';

// Mock the axios instance
const mockAxios = new axiosMock(axios);

// Sample doctors data
const doctorsData = [
  { id: 1, name: 'Dr. John Doe', specialty: 'Cardiology', location: 'New York' },
  { id: 2, name: 'Dr. Jane Smith', specialty: 'Neurology', location: 'Los Angeles' },
];

const newDoctor = { name: 'Dr. Alice Brown', specialty: 'Dermatology', location: 'Chicago' };
const updatedDoctor = { id: 1, name: 'Dr. John Updated', specialty: 'Cardiology', location: 'New York' };

describe('DoctorList Component', () => {
  // Reset mocks after each test
  afterEach(() => {
    mockAxios.reset();
  });

  // Test 1: Render doctor list and display doctors
  test('renders doctor list and displays doctors', async () => {
    mockAxios.onGet('http://localhost:5000/api/doctors').reply(200, doctorsData);

    render(<DoctorList />);

    await waitFor(() => {
      expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    });
  });

  // Test 2: Displays error when fetching doctors fails
  test('displays error when fetching doctors fails', async () => {
    mockAxios.onGet('http://localhost:5000/api/doctors').reply(500);

    render(<DoctorList />);

    await waitFor(() => {
      expect(screen.getByText('No doctors available.')).toBeInTheDocument();
    });
  });

  // Test 3: Handles add doctor functionality
  test('handles add doctor functionality', async () => {
    const response = { ...newDoctor, id: 3 };
    mockAxios.onPost('http://localhost:5000/api/doctors').reply(200, response);

    render(<DoctorList />);

    fireEvent.click(screen.getByText('Add Doctor'));

    fireEvent.change(screen.getByPlaceholderText("Doctor's Name"), { target: { value: newDoctor.name } });
    fireEvent.change(screen.getByPlaceholderText('Specialty'), { target: { value: newDoctor.specialty } });
    fireEvent.change(screen.getByPlaceholderText('Location'), { target: { value: newDoctor.location } });

    fireEvent.click(screen.getByText('Add Doctor'));

    await waitFor(() => {
      expect(screen.getByText(newDoctor.name)).toBeInTheDocument();
    });
  });

  // Test 4: Handles edit doctor functionality
  test('handles edit doctor functionality', async () => {
    mockAxios.onGet('http://localhost:5000/api/doctors').reply(200, [doctorsData[0]]);
    mockAxios.onPut('http://localhost:5000/api/doctors/1').reply(200, updatedDoctor);

    render(<DoctorList />);

    await waitFor(() => {
      expect(screen.getByText(doctorsData[0].name)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit'));

    fireEvent.change(screen.getByPlaceholderText("Doctor's Name"), { target: { value: updatedDoctor.name } });
    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(screen.getByText(updatedDoctor.name)).toBeInTheDocument();
    });
  });

  // Test 5: Handles delete doctor functionality
  test('handles delete doctor functionality', async () => {
    mockAxios.onGet('http://localhost:5000/api/doctors').reply(200, [doctorsData[0]]);
    mockAxios.onDelete('http://localhost:5000/api/doctors/1').reply(200);

    render(<DoctorList />);

    await waitFor(() => {
      expect(screen.getByText(doctorsData[0].name)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(screen.queryByText(doctorsData[0].name)).not.toBeInTheDocument();
    });
  });

  // Test 6: Pagination works correctly
  test('pagination works correctly', async () => {
    const paginatedDoctors = Array.from({ length: 25 }, (_, index) => ({
      id: index + 1,
      name: `Dr. Doctor ${index + 1}`,
      specialty: 'Specialty',
      location: 'Location',
    }));

    mockAxios.onGet('http://localhost:5000/api/doctors').reply(200, paginatedDoctors);

    render(<DoctorList />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Doctor 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(screen.getByText('Dr. Doctor 11')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Previous'));

    await waitFor(() => {
      expect(screen.getByText('Dr. Doctor 1')).toBeInTheDocument();
    });
  });
});
