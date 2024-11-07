import React, { useState, useEffect, useCallback, memo } from 'react';
import axios from 'axios';
import ConfirmationModal from './ConfirmationModal.tsx'; // Assuming you have a confirmation modal component

const DoctorList = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '', location: '' });
  const [doctorToDelete, setDoctorToDelete] = useState<number | null>(null);
  const [doctorToEdit, setDoctorToEdit] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch doctors from backend once on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch doctors data
  const fetchDoctors = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  }, []);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  // Add a new doctor
  const addDoctor = async () => {
    if (newDoctor.name && newDoctor.specialty && newDoctor.location) {
      try {
        const response = await axios.post('http://localhost:5000/api/doctors', newDoctor);
        setDoctors((prevDoctors) => [...prevDoctors, response.data]);
        setNewDoctor({ name: '', specialty: '', location: '' });
        setIsModalOpen(false); // Close the modal after adding
      } catch (error) {
        console.error('Error adding doctor:', error);
      }
    } else {
      alert('Please fill out all fields');
    }
  };

  // Edit an existing doctor
  const handleEdit = async () => {
    if (doctorToEdit && doctorToEdit.name && doctorToEdit.specialty && doctorToEdit.location) {
      try {
        const response = await axios.put(`http://localhost:5000/api/doctors/${doctorToEdit.id}`, doctorToEdit);
        const updatedDoctors = doctors.map((doctor) =>
          doctor.id === doctorToEdit.id ? response.data : doctor
        );
        setDoctors(updatedDoctors);
        setDoctorToEdit(null);
        setIsModalOpen(false); // Close the modal after editing
      } catch (error) {
        console.error('Error editing doctor:', error);
      }
    } else {
      alert('Please fill out all fields');
    }
  };

  // Delete a doctor
  const deleteDoctor = async () => {
    if (doctorToDelete === null) return;

    // Optimistically remove the doctor from the UI
    const updatedDoctors = doctors.filter((doctor) => doctor.id !== doctorToDelete);
    setDoctors(updatedDoctors);

    try {
      const response = await axios.delete(`http://localhost:5000/api/doctors/${doctorToDelete}`);
      if (response.status === 200) {
        setDoctorToDelete(null);
        alert('Doctor deleted successfully!');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setDoctors((prevDoctors) => [...prevDoctors, { id: doctorToDelete }]);
      setDoctorToDelete(null);
      alert('Failed to delete the doctor. Please try again.');
    }
  };

  // Pagination logic: Slice doctors array based on currentPage
  const totalDoctors = doctors.length;
  const totalPages = Math.ceil(totalDoctors / rowsPerPage);
  const indexOfLastDoctor = currentPage * rowsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - rowsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)} className="py-2 px-4 bg-teal-400 text-gray-900 rounded-md mb-4">
        Add Doctor
      </button>

      {/* Modal for adding or editing doctor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-semibold text-teal-400 mb-4">
              {doctorToEdit ? 'Edit Doctor' : 'Add New Doctor'}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={doctorToEdit ? doctorToEdit.name : newDoctor.name}
                onChange={(e) => doctorToEdit ? setDoctorToEdit({ ...doctorToEdit, name: e.target.value }) : handleInputChange(e)}
                className="w-full p-2 bg-gray-700 text-gray-100 rounded-md"
                placeholder="Doctor's Name"
              />
              <input
                type="text"
                name="specialty"
                value={doctorToEdit ? doctorToEdit.specialty : newDoctor.specialty}
                onChange={(e) => doctorToEdit ? setDoctorToEdit({ ...doctorToEdit, specialty: e.target.value }) : handleInputChange(e)}
                className="w-full p-2 bg-gray-700 text-gray-100 rounded-md"
                placeholder="Specialty"
              />
              <input
                type="text"
                name="location"
                value={doctorToEdit ? doctorToEdit.location : newDoctor.location}
                onChange={(e) => doctorToEdit ? setDoctorToEdit({ ...doctorToEdit, location: e.target.value }) : handleInputChange(e)}
                className="w-full p-2 bg-gray-700 text-gray-100 rounded-md"
                placeholder="Location"
              />
              <div className="mt-4 text-right">
                <button onClick={doctorToEdit ? handleEdit : addDoctor} className="py-2 px-4 bg-teal-400 text-gray-900 rounded-md">
                  {doctorToEdit ? 'Save Changes' : 'Add Doctor'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for deleting doctor */}
      {doctorToDelete !== null && (
        <ConfirmationModal
          isOpen={true}
          onConfirm={deleteDoctor}
          onCancel={() => setDoctorToDelete(null)}
        />
      )}

      {/* Doctor List */}
      <ul>
        {currentDoctors.length > 0 ? (
          currentDoctors.map((doctor) => (
            <li key={doctor.id} className="py-2 px-4 bg-gray-700 mb-2 rounded-md">
              <div className="flex justify-between">
                <div>
                  <strong>{doctor.name}</strong>
                  <p>{doctor.specialty}</p>
                  <p>{doctor.location}</p>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setDoctorToEdit(doctor);
                      setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDoctorToDelete(doctor.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="py-2 px-4 text-gray-500">No doctors available.</li>
        )}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="py-2 px-4 bg-gray-600 text-white rounded-md mr-2"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="py-2 px-4 text-gray-100">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="py-2 px-4 bg-gray-600 text-white rounded-md ml-2"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default memo(DoctorList);
