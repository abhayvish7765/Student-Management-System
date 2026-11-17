
const express = require("express");
const router = express.Router();

const {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  searchStudents,
} = require("../controllers/studentController");

// Add a student
router.post("/add", addStudent);

// Search students
router.get("/search", searchStudents);

// Get all students
router.get("/", getStudents);

// Update a student
router.put("/:id", updateStudent);

// Delete a student
router.delete("/:id", deleteStudent);

module.exports = router;
