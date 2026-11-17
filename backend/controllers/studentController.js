
const mongoose = require("mongoose");
const Student = require("../models/Student");

// Validate student information
const validateStudentData = ({ name, email, phone, course }) => {
  if (
    !name?.trim() ||
    !email?.trim() ||
    !phone?.trim() ||
    !course?.trim()
  ) {
    return "All fields are required.";
  }

  if (name.trim().length < 2 || name.trim().length > 60) {
    return "Name must be between 2 and 60 characters.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    return "Please enter a valid email address.";
  }

  const phoneDigits = phone.replace(/\D/g, "");

  if (
    !/^\+?[0-9\s()-]+$/.test(phone.trim()) ||
    phoneDigits.length < 7 ||
    phoneDigits.length > 15
  ) {
    return "Please enter a valid phone number with 7 to 15 digits.";
  }

  if (course.trim().length < 2 || course.trim().length > 80) {
    return "Course must be between 2 and 80 characters.";
  }

  return null;
};

// Handle common database errors
const handleError = (res, error, defaultMessage) => {
  if (error.code === 11000) {
    return res.status(409).json({
      message: "This email address is already registered.",
    });
  }

  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({
      message: error.message,
    });
  }

  console.error(defaultMessage, error);

  return res.status(500).json({
    message: defaultMessage,
  });
};

// Add a new student
const addStudent = async (req, res) => {
  try {
    const { name, email, phone, course } = req.body;

    const validationError = validateStudentData({
      name,
      email,
      phone,
      course,
    });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const student = new Student({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      course: course.trim(),
    });

    const savedStudent = await student.save();

    return res.status(201).json({
      message: "Student added successfully!",
      student: savedStudent,
    });
  } catch (error) {
    return handleError(res, error, "Failed to add student.");
  }
};

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Students retrieved successfully!",
      students,
    });
  } catch (error) {
    return handleError(res, error, "Failed to retrieve students.");
  }
};

// Update an existing student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid student ID.",
      });
    }

    const { name, email, phone, course } = req.body;

    const validationError = validateStudentData({
      name,
      email,
      phone,
      course,
    });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        course: course.trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    return res.status(200).json({
      message: "Student updated successfully!",
      student: updatedStudent,
    });
  } catch (error) {
    return handleError(res, error, "Failed to update student.");
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid student ID.",
      });
    }

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    return res.status(200).json({
      message: "Student deleted successfully!",
      student: deletedStudent,
    });
  } catch (error) {
    return handleError(res, error, "Failed to delete student.");
  }
};

// Search students by name, email, phone or course
const searchStudents = async (req, res) => {
  try {
    const query = req.query.query?.trim();

    if (!query) {
      return res.status(400).json({
        message: "Please provide a search query.",
      });
    }

    // Escape special regular expression characters
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const students = await Student.find({
      $or: [
        { name: { $regex: safeQuery, $options: "i" } },
        { email: { $regex: safeQuery, $options: "i" } },
        { phone: { $regex: safeQuery, $options: "i" } },
        { course: { $regex: safeQuery, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Search completed successfully!",
      students,
    });
  } catch (error) {
    return handleError(res, error, "Failed to search students.");
  }
};

module.exports = {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  searchStudents,
};
