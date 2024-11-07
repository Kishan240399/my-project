Find Nearby Ambulances and Doctors
Overview
This application is designed to help users find nearby ambulance services and doctors. Built with a React.js frontend and a Node.js backend, it allows users to perform CRUD operations on ambulance and doctor records. The app supports pagination, and handles error, and empty states gracefully.

Features
Frontend:
React.js (Typescript)
Functional components
TypeScript
CSS-in-JS (styled-components)
Backend:
Node.js
In-memory JSON file for data storage
TypeScript
Additional:
Cloudinary for image handling
Quick Start Guide
How to Run the Project
Prerequisites
Node.js
npm or yarn
Setup
Clone the repository:
git clone https://github.com/kishanapirotan/my-project.git
cd coding (Frontend Folder)
npm i
npm start (to start frontend at localhost)
Navigate to (emergency-services-backend)
npm i
npm run start (server will start at port number 5000 of localhost)

Open your browser and navigate to http://localhost:3000.
Functionality
CRUD Operations
Create: Add new ambulances and doctors.
Read: View the list of ambulances and doctors.
Update: Edit existing ambulance and doctor records.
Delete: Remove ambulance and doctor records.
Pagination
Displays the first 10 records by default.
Supports pagination with 10 records per page.
Record Details
For each record, the following details are shown:

Name
Description
Location


Notes
The app uses an in-memory JSON file to store data.
Images are handled using Cloudinary.
Conclusion
This project demonstrates a simple yet effective way to manage ambulance and doctor records. It includes essential CRUD operations, pagination, and state handling, making it a practical solution for real-world applications.
