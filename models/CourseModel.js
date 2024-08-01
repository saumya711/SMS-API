const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    coveredAreas: {
      type: [String],
      required: true,
    },
    timeDuration: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
