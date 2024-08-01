const Course = require("../models/CourseModel");

exports.createCourse = async (req, res) => {
  try {
    const { name, code, coveredAreas, timeDuration, level } = req.body;

    if (!(name && code && coveredAreas && timeDuration && level)) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const courseExists = await Course.findOne({ code });
    if (courseExists) {
      return res.status(400).json({ error: "Course already exists" });
    }
    const course = await Course.create({
      name,
      code,
      coveredAreas,
      timeDuration,
      level,
    });

    res.status(201).json({
      success: "Course Created SUccessfull",
      course,
    });
  } catch (error) {
    res.status(400).json({
      err: err.message
    });
  }
};


exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({})
            .sort([["name", "asc"]])
            .exec();
        res.json(courses);
    } catch (err) {
        console.log(err);
        //res.status(400).send("Fetch Failed");
        res.status(400).json({
            err: err.message
        });
    }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .exec();

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(400).json({
      err: err.message
    });
  }
};


exports.updateCourse = async (req, res) => {
  try {
    const { name, code, coveredAreas, timeDuration, level } = req.body;
    
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        name,
        code,
        coveredAreas,
        timeDuration,
        level,
      },
      { new: true }
    ).exec();

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course updated successfully", updatedCourse });

  } catch (error) {
    res.status(400).json({
      err: err.message
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id).exec();

    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course deleted successfully", deletedCourse });

  } catch (err) {
    res.status(400).json({
      err: err.message
    });
  }
};

