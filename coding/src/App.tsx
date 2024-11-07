import React, { useState } from 'react';
import AmbulanceList from './components/AmbulanceList.tsx';
import DoctorList from './components/DoctorList.tsx';

const App = () => {
  const [view, setView] = useState<'ambulance' | 'doctor' | null>(null);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center">
      <div className="w-full max-w-3xl flex justify-between items-center mt-10 mb-4 px-6">
        <h1 className="text-4xl font-bold text-teal-400">Emergency Services</h1>
        
        {/* Back Button */}
        {view && (
          <button
            onClick={() => setView(null)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300 transform hover:scale-105 shadow-md"
          >
            Back
          </button>
        )}
      </div>

      {/* Quote Section */}
      {!view && (
        <p className="text-lg font-light italic text-gray-400 mb-10 px-6 text-center">
          "In times of emergency, heroes aren't born; they respond."
        </p>
      )}

      {/* Button Selection */}
      {!view ? (
        <div className="flex space-x-4">
          <button
            onClick={() => setView('ambulance')}
            className="px-6 py-3 text-lg font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105"
          >
            Ambulances
          </button>
          <button
            onClick={() => setView('doctor')}
            className="px-6 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105"
          >
            Doctors
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl mt-8">
          {view === 'ambulance' && <AmbulanceList />}
          {view === 'doctor' && <DoctorList />}
        </div>
      )}
    </div>
  );
};

export default App;
