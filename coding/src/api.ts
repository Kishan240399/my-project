// src/api.ts

export const fetchAmbulances = async (page: number, limit: number) => {
    try {
      const response = await fetch(`http://localhost:5000/ambulances?page=${page}&limit=${limit}`);
      return response.json();
    } catch (error) {
      throw new Error('Failed to fetch ambulances');
    }
  };
  
  export const fetchDoctors = async (page: number, limit: number) => {
    try {
      const response = await fetch(`http://localhost:5000/doctors?page=${page}&limit=${limit}`);
      return response.json();
    } catch (error) {
      throw new Error('Failed to fetch doctors');
    }
  };
  
  export const fetchAmbulanceCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/ambulances/count');
      return response.json();
    } catch (error) {
      throw new Error('Failed to fetch ambulance count');
    }
  };
  
  export const fetchDoctorCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/doctors/count');
      return response.json();
    } catch (error) {
      throw new Error('Failed to fetch doctor count');
    }
  };
  