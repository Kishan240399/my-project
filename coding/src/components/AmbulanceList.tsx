import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';
import ConfirmationModal from './ConfirmationModal.tsx'; // Import the modal component

const AmbulanceList = () => {
  const [ambulances, setAmbulances] = useState<any[]>([]);
  const [newAmbulance, setNewAmbulance] = useState({ name: '', description: '', location: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ambulanceToDelete, setAmbulanceToDelete] = useState<number | null>(null);
  const [ambulanceToEdit, setAmbulanceToEdit] = useState<any | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Set the number of items per page

  // Fetch ambulances from backend once on component mount
  useEffect(() => {
    fetchAmbulances();
  }, []);

  // Fetch ambulances data
  const fetchAmbulances = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ambulances');
      setAmbulances(response.data);
    } catch (error) {
      console.error('Error fetching ambulances:', error);
    }
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAmbulance({ ...newAmbulance, [name]: value });
  };

  // Add a new ambulance
  const addAmbulance = async () => {
    if (newAmbulance.name && newAmbulance.description && newAmbulance.location) {
      try {
        const response = await axios.post('http://localhost:5000/api/ambulances', newAmbulance);
        setAmbulances((prevAmbulances) => [...prevAmbulances, response.data]);
        setNewAmbulance({ name: '', description: '', location: '' });
        setIsModalOpen(false); // Close the modal after adding
      } catch (error) {
        console.error('Error adding ambulance:', error);
      }
    } else {
      alert('Please fill out all fields');
    }
  };

  // Edit an existing ambulance
  const handleEdit = async () => {
    if (ambulanceToEdit && ambulanceToEdit.name && ambulanceToEdit.description && ambulanceToEdit.location) {
      try {
        const response = await axios.put(`http://localhost:5000/api/ambulances/${ambulanceToEdit.id}`, ambulanceToEdit);
        const updatedAmbulances = ambulances.map((ambulance) => 
          ambulance.id === ambulanceToEdit.id ? response.data : ambulance
        );
        setAmbulances(updatedAmbulances);
        setAmbulanceToEdit(null);
        setIsModalOpen(false); // Close the modal after editing
      } catch (error) {
        console.error('Error editing ambulance:', error);
      }
    } else {
      alert('Please fill out all fields');
    }
  };

  // Delete an ambulance
  const deleteAmbulance = async () => {
    if (!ambulanceToDelete) return;

    // Optimistically remove the ambulance from the UI
    const updatedAmbulances = ambulances.filter((ambulance) => ambulance.id !== ambulanceToDelete);
    setAmbulances(updatedAmbulances);

    try {
      const response = await axios.delete(`http://localhost:5000/api/ambulances/${ambulanceToDelete}`);
      if (response.status === 200) {
        // If the delete was successful, clear the ambulanceToDelete state
        setAmbulanceToDelete(null); 
        alert('Ambulance deleted successfully!');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting ambulance:', error);
      // If the delete failed, revert the state to show the ambulance again
      setAmbulances((prevAmbulances) => [...prevAmbulances, { id: ambulanceToDelete }]); 
      setAmbulanceToDelete(null); // Reset delete state
      alert('Failed to delete the ambulance. Please try again.');
    }
  };

  // Pagination logic: Slice ambulances array based on currentPage
  const totalAmbulances = ambulances.length;
  const totalPages = Math.ceil(totalAmbulances / rowsPerPage);
  const indexOfLastAmbulance = currentPage * rowsPerPage;
  const indexOfFirstAmbulance = indexOfLastAmbulance - rowsPerPage;
  const currentAmbulances = ambulances.slice(indexOfFirstAmbulance, indexOfLastAmbulance);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)} className="py-2 px-4 bg-teal-400 text-gray-900 rounded-md mb-4">
        Add Ambulance
      </button>

      {/* Modal for adding or editing ambulance */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-semibold text-teal-400 mb-4">{ambulanceToEdit ? 'Edit Ambulance' : 'Add New Ambulance'}</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={ambulanceToEdit ? ambulanceToEdit.name : newAmbulance.name}
                onChange={(e) => ambulanceToEdit ? setAmbulanceToEdit({ ...ambulanceToEdit, name: e.target.value }) : handleInputChange(e)}
                className="w-full p-2 bg-gray-700 text-gray-100 rounded-md"
                placeholder="Ambulance Name"
              />
              <input
                type="text"
                name="description"
                value={ambulanceToEdit ? ambulanceToEdit.description : newAmbulance.description}
                onChange={(e) => ambulanceToEdit ? setAmbulanceToEdit({ ...ambulanceToEdit, description: e.target.value }) : handleInputChange(e)}
                className="w-full p-2 bg-gray-700 text-gray-100 rounded-md"
                placeholder="Ambulance Description"
              />
              <input
                type="text"
                name="location"
                value={ambulanceToEdit ? ambulanceToEdit.location : newAmbulance.location}
                onChange={(e) => ambulanceToEdit ? setAmbulanceToEdit({ ...ambulanceToEdit, location: e.target.value }) : handleInputChange(e)}
                className="w-full p-2 bg-gray-700 text-gray-100 rounded-md"
                placeholder="Location"
              />
              <div className="mt-4 text-right">
                <button onClick={ambulanceToEdit ? handleEdit : addAmbulance} className="py-2 px-4 bg-teal-400 text-gray-900 rounded-md">
                  {ambulanceToEdit ? 'Save Changes' : 'Add Ambulance'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for deleting ambulance */}
      {ambulanceToDelete !== null && (
        <ConfirmationModal
          isOpen={true}
          onConfirm={deleteAmbulance}
          onCancel={() => setAmbulanceToDelete(null)}
        />
      )}

      {/* Ambulance List */}
      <ul>
        {currentAmbulances.length > 0 ? (
          currentAmbulances.map((ambulance) => (
            <li key={ambulance.id} className="py-2 px-4 bg-gray-700 mb-2 rounded-md">
              <div className="flex justify-between">
                <div>
                  <strong>{ambulance.name}</strong>
                  <p>{ambulance.description}</p>
                  <p>{ambulance.location}</p>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setAmbulanceToEdit(ambulance);
                      setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setAmbulanceToDelete(ambulance.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="py-2 px-4 text-gray-500">No ambulances available.</li>
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

export default memo(AmbulanceList);
