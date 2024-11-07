// AmbulanceList.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AmbulanceList from './AmbulanceList';
import axios from 'axios';

// Mock axios to avoid actual API calls
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Sample ambulance data
const mockAmbulances = [
  { id: 1, name: 'Ambulance 1', description: 'Description 1', location: 'Location 1' },
  { id: 2, name: 'Ambulance 2', description: 'Description 2', location: 'Location 2' },
];

// Helper function to setup axios mock responses
const setupMocks = () => {
  mockedAxios.get.mockResolvedValue({ data: mockAmbulances });
  mockedAxios.post.mockResolvedValue({ data: { id: 3, name: 'Ambulance 3', description: 'Description 3', location: 'Location 3' } });
  mockedAxios.put.mockResolvedValue({ data: { id: 1, name: 'Updated Ambulance', description: 'Updated Description', location: 'Updated Location' } });
  mockedAxios.delete.mockResolvedValue({ status: 200 });
};

describe('AmbulanceList Component', () => {
  beforeEach(() => {
    setupMocks();
  });

  test('renders ambulance list correctly', async () => {
    render(<AmbulanceList />);
    await waitFor(() => screen.getByText('Ambulance 1'));
    expect(screen.getByText('Ambulance 1')).toBeInTheDocument();
    expect(screen.getByText('Ambulance 2')).toBeInTheDocument();
  });

  test('opens add ambulance modal when Add Ambulance button is clicked', () => {
    render(<AmbulanceList />);
    fireEvent.click(screen.getByText('Add Ambulance'));
    expect(screen.getByPlaceholderText('Ambulance Name')).toBeInTheDocument();
  });

  test('closes modal after adding an ambulance', async () => {
    render(<AmbulanceList />);
    fireEvent.click(screen.getByText('Add Ambulance'));

    // Fill out and submit the form
    fireEvent.change(screen.getByPlaceholderText('Ambulance Name'), { target: { value: 'Ambulance 3' } });
    fireEvent.change(screen.getByPlaceholderText('Ambulance Description'), { target: { value: 'Description 3' } });
    fireEvent.change(screen.getByPlaceholderText('Location'), { target: { value: 'Location 3' } });

    fireEvent.click(screen.getByText('Add Ambulance'));
    await waitFor(() => screen.getByText('Ambulance 3'));
    expect(screen.getByText('Ambulance 3')).toBeInTheDocument();
  });

  test('handles edit ambulance correctly', async () => {
    render(<AmbulanceList />);
    fireEvent.click(screen.getByText('Edit'));

    // Edit ambulance details
    fireEvent.change(screen.getByPlaceholderText('Ambulance Name'), { target: { value: 'Updated Ambulance' } });
    fireEvent.change(screen.getByPlaceholderText('Ambulance Description'), { target: { value: 'Updated Description' } });
    fireEvent.change(screen.getByPlaceholderText('Location'), { target: { value: 'Updated Location' } });

    fireEvent.click(screen.getByText('Save Changes'));
    await waitFor(() => screen.getByText('Updated Ambulance'));
    expect(screen.getByText('Updated Ambulance')).toBeInTheDocument();
  });

  test('handles delete ambulance correctly', async () => {
    render(<AmbulanceList />);
    fireEvent.click(screen.getAllByText('Delete')[0]);
    fireEvent.click(screen.getByText('Confirm'));
    await waitFor(() => expect(screen.queryByText('Ambulance 1')).not.toBeInTheDocument());
    expect(screen.queryByText('Ambulance 1')).not.toBeInTheDocument();
  });

  test('displays pagination correctly', async () => {
    render(<AmbulanceList />);
    await waitFor(() => screen.getByText('Ambulance 1'));
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('handles pagination correctly', async () => {
    render(<AmbulanceList />);
    await waitFor(() => screen.getByText('Ambulance 1'));
    fireEvent.click(screen.getByText('2'));
    expect(screen.getByText('Ambulance 2')).toBeInTheDocument();
  });
});
