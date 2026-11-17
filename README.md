# 🎓 Student Management System

A full-stack **Student Management System** built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). This application allows administrators to efficiently manage student records through an interactive dashboard.

## 🚀 Features

- **Dashboard:** View total students, courses, and active records.
- **Add Students:** Register new students.
- **View Students:** Display all registered student records.
- **Edit Students:** Update existing student information.
- **Delete Students:** Remove student records.
- **Search Students:** Search by name, email, phone number, or course.
- **Course Directory:** View courses based on registered student records.
- **Settings:** Refresh student data.
- **Responsive UI:** Dashboard with sidebar navigation and responsive layout.
- **Database Integration:** Store and retrieve student records using MongoDB.

## 🛠️ Technologies Used

### Frontend
- React.js
- Axios
- HTML5
- CSS3
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- dotenv

## 📁 Project Structure

```text
student-management-system/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── studentController.js
│   ├── models/
│   │   └── Student.js
│   ├── routes/
│   │   └── studentRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/panditt76/Student-Management-System.git
```

### 2. Navigate to the Project

```bash
cd Student-Management-System
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the backend server:

```bash
node server.js
```

The backend will run at:

`http://localhost:5000`

### 4. Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at:

`http://localhost:5173`

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/students/add` | Add a student |
| GET | `/api/students` | Get all students |
| GET | `/api/students/search?query=value` | Search students |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

## 🗄️ Database

MongoDB is used to store student information.

Each student record includes:
- Name
- Email
- Phone Number
- Course
- Enrollment Date

## 👨‍💻 Author

**Abhay**

GitHub: [@abhayvish7765](https://github.com/panditt76)

## 📄 License

This project was developed as part of an internship learning project.
