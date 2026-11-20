
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required."],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters."],
      maxlength: [60, "Name cannot exceed 60 characters."],
    },

    email: {
      type: String,
      required: [true, "Email address is required."],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [150, "Email cannot exceed 150 characters."],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address.",
      ],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required."],
      trim: true,
      validate: {
        validator: function (value) {
          const digits = value.replace(/\D/g, "");

          return (
            /^\+?[0-9\s()-]+$/.test(value) &&
            digits.length >= 7 &&
            digits.length <= 15
          );
        },
        message: "Phone number must contain 7 to 15 digits.",
      },
    },

    course: {
      type: String,
      required: [true, "Course is required."],
      trim: true,
      minlength: [2, "Course must contain at least 2 characters."],
      maxlength: [80, "Course cannot exceed 80 characters."],
    },

    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
