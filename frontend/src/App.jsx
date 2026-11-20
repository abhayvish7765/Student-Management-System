
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL =
  "https://student-management-systemd.onrender.com/api/students";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  course: "",
};

function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(emptyForm);

  const [activeSection, setActiveSection] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch students from the backend
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      setStudents(response.data.students || []);
    } catch (err) {
      setError(
        "Unable to load students. Please check the backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Sidebar navigation
  const handleNavigation = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
    setShowForm(false);
    setEditingId(null);
    setSearch("");
    setError("");

    if (section === "Dashboard" || section === "Students" || section === "Courses") {
      fetchStudents();
    }
  };

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Open form for adding a student
  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
    setError("");
  };

  // Open form for editing a student
  const handleEdit = (student) => {
    setEditingId(student._id);

    setFormData({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      course: student.course || "",
    });

    setShowForm(true);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Add or update student with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const course = formData.course.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = phone.replace(/\D/g, "");

    if (!name || !email || !phone || !course) {
      setError("Please fill in all fields.");
      return;
    }

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      setError("Phone number must contain between 7 and 15 digits.");
      return;
    }

    const cleanedData = {
      name,
      email,
      phone,
      course,
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, cleanedData);
      } else {
        await axios.post(`${API_URL}/add`, cleanedData);
      }

      setFormData(emptyForm);
      setEditingId(null);
      setShowForm(false);
      setSearch("");

      await fetchStudents();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editingId
            ? "Failed to update student."
            : "Failed to add student.")
      );
    }
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
  };

  // Delete student
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await axios.delete(`${API_URL}/${id}`);

      setSearch("");
      await fetchStudents();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete student."
      );
    }
  };

  // Search students
  const handleSearch = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      fetchStudents();
      return;
    }

    try {
      setError("");

      const response = await axios.get(`${API_URL}/search`, {
        params: {
          query: value.trim(),
        },
      });

      setStudents(response.data.students || []);
    } catch (err) {
      setError("Search failed. Please try again.");
    }
  };

  // Calculate course information
  const courses = [
    ...new Set(
      students
        .map((student) => student.course)
        .filter(Boolean)
    ),
  ];

  const courseCounts = courses.map((course) => ({
    name: course,
    count: students.filter(
      (student) => student.course === course
    ).length,
  }));

  const pageDescriptions = {
    Dashboard: "Welcome back! Here's your student overview.",
    Students: "Add, search, edit and manage student records.",
    Courses: "View the courses currently registered by students.",
    Settings: "Application information and data management.",
  };

  // Student directory
  const renderStudentDirectory = () => (
    <section className="student-section">
      <div className="section-header">
        <div>
          <h2>Student Directory</h2>
          <p>Manage and view all registered students.</p>
        </div>

        <button className="add-button" onClick={openAddForm}>
          + Add Student
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {showForm && (
        <form className="student-form" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Student" : "Add New Student"}</h3>

          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            maxLength={100}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            maxLength={150}
            required
          />

          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            maxLength={20}
            required
          />

          <input
            name="course"
            type="text"
            placeholder="Course"
            value={formData.course}
            onChange={handleChange}
            maxLength={100}
            required
          />

          <div className="form-actions">
            <button type="submit" className="add-button">
              {editingId ? "Update Student" : "Save Student"}
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <input
        className="search-input"
        placeholder="Search by name, email, phone or course..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>STUDENT NAME</th>
              <th>EMAIL</th>
              <th>PHONE</th>
              <th>COURSE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  Loading students...
                </td>
              </tr>
            ) : students.length > 0 ? (
              students.map((student) => (
                <tr key={student._id}>
                  <td data-label="Student Name">{student.name}</td>
                  <td data-label="Email">{student.email}</td>
                  <td data-label="Phone">{student.phone}</td>

                  <td data-label="Course">
                    <span className="course-badge">
                      {student.course}
                    </span>
                  </td>

                  <td data-label="Actions">
                    <div className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => handleDelete(student._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  return (
    <div className="app-container">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
      >
        <div className="sidebar-heading">
          <h2 className="logo">
            Student<span>Hub</span>
          </h2>

          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <p className="menu-label">MAIN MENU</p>

        {["Dashboard", "Students", "Courses", "Settings"].map(
          (section) => (
            <button
              key={section}
              type="button"
              className={`menu-item ${
                activeSection === section ? "active" : ""
              }`}
              onClick={() => handleNavigation(section)}
            >
              <span className="menu-icon">
                {{
                  Dashboard: "▦",
                  Students: "♙",
                  Courses: "▤",
                  Settings: "⚙",
                }[section]}
              </span>

              {section}
            </button>
          )
        )}

        <div className="sidebar-footer">
          <div className="avatar">S</div>
          <div>
            <strong>StudentHub</strong>
            <small>Management System</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>

            <div>
              <h2>{activeSection}</h2>
              <p>{pageDescriptions[activeSection]}</p>
            </div>
          </div>
        </header>

        {activeSection === "Dashboard" && (
          <>
            <section className="stats-grid">
              <div className="stat-card">
                <span>Total Students</span>
                <h1>{students.length}</h1>
                <small>Registered students</small>
              </div>

              <div className="stat-card">
                <span>Total Courses</span>
                <h1>{courses.length}</h1>
                <small>Unique courses</small>
              </div>

              <div className="stat-card">
                <span>Active Records</span>
                <h1>{students.length}</h1>
                <small>Current student records</small>
              </div>
            </section>

            {renderStudentDirectory()}
          </>
        )}

        {activeSection === "Students" && renderStudentDirectory()}

        {activeSection === "Courses" && (
          <section className="student-section">
            <div className="section-header">
              <div>
                <h2>Course Directory</h2>
                <p>Courses based on registered student records.</p>
              </div>
            </div>

            {loading ? (
              <p>Loading courses...</p>
            ) : courseCounts.length > 0 ? (
              <div className="stats-grid">
                {courseCounts.map((course) => (
                  <div className="stat-card" key={course.name}>
                    <span>COURSE</span>
                    <h2>{course.name}</h2>
                    <small>
                      {course.count} registered student
                      {course.count !== 1 ? "s" : ""}
                    </small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">
                No courses available yet. Add a student with a course
                to see it here.
              </p>
            )}
          </section>
        )}

        {activeSection === "Settings" && (
          <section className="student-section settings-section">
            <div className="section-header">
              <div>
                <h2>Application Settings</h2>
                <p>
                  Application information and student data management.
                </p>
              </div>
            </div>

            <div className="stat-card">
              <span>APPLICATION NAME</span>
              <h2>StudentHub</h2>
              <small>Student Management System</small>
            </div>

            <div className="stat-card">
              <span>TECHNOLOGY</span>
              <h2>MERN Stack</h2>
              <small>
                MongoDB, Express.js, React.js and Node.js
              </small>
            </div>

            <div className="stat-card">
              <span>DATABASE</span>
              <h2>MongoDB</h2>
              <small>
                Student records are managed through the backend API.
              </small>
            </div>

            <div className="stat-card">
              <span>DATA MANAGEMENT</span>
              <h2>Refresh Records</h2>
              <small>
                Fetch the latest student records from the database.
              </small>

              <button
                className="add-button"
                onClick={fetchStudents}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh Data"}
              </button>

              {error && <p className="error-message">{error}</p>}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
