
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Database connection
const connectDB = require("./config/db");

// Student routes
const studentRoutes = require("./routes/studentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main route
app.get("/", (req, res) => {
  res.send("Student Management System API is running!");
});

// Student API routes
app.use("/api/students", studentRoutes);

// Start server after database connection
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
