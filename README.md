# SmartCare AI Healthcare Management System

SmartCare is an AI-powered healthcare management platform built using the MERN stack. The system streamlines healthcare operations by providing dedicated portals for patients, doctors, and administrators. It offers appointment scheduling, medical record management, prescription handling, AI-assisted symptom analysis, emergency alerts, and healthcare analytics through a modern and responsive web interface.

## Features

### Patient Portal

* Secure registration and login
* Book and manage appointments
* View medical history and prescriptions
* Access healthcare reports
* Receive notifications and alerts

### Doctor Portal

* Manage appointments and patient records
* Create and update prescriptions
* Review patient medical history
* Monitor upcoming consultations

### Admin Portal

* Manage users, doctors, and patients
* Monitor healthcare operations
* Access analytics and reports
* Control system-wide settings

### AI Symptom Checker

* Analyze user-reported symptoms
* Provide preliminary health recommendations
* Assist patients before consultation

### Appointment Management

* Schedule appointments
* Update appointment status
* Track upcoming and completed consultations

### Medical Record Management

* Maintain patient health records
* Store prescriptions and treatment history
* Secure data access based on user roles

### Notifications & Emergency Alerts

* Real-time appointment notifications
* Emergency healthcare alerts
* Important system updates

### PDF Report Generation

* Download prescriptions
* Generate medical reports
* Maintain digital healthcare records

### Analytics Dashboard

* Appointment statistics
* Patient activity insights
* Healthcare performance monitoring

## Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Bootstrap / Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JWT Authentication
* Role-Based Access Control (RBAC)
* Password Hashing with bcrypt

## Project Structure

```
SmartCare/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.js
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   └── server.js
│
├── README.md
└── package.json
```

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd SmartCare
```

### Install Dependencies

Frontend:

```bash
cd client
npm install
```

Backend:

```bash
cd server
npm install
```

### Configure Environment Variables

Create a `.env` file inside the server directory:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run the Application

Backend:

```bash
npm run server
```

Frontend:

```bash
npm start
```

## Future Enhancements

* Video Consultation
* AI-Powered Disease Prediction
* Payment Gateway Integration
* Email and SMS Notifications
* Electronic Health Records (EHR)
* Mobile Application Support

## Author

**Preksha Jain**

Built as a full-stack MERN project to modernize healthcare management through secure, scalable, and AI-assisted digital solutions.
