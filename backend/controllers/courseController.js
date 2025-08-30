const { createCourse, getAllCourses } = require('../models/course');

// Create a new course (admin only)
async function addCourse(req, res) {
  const { name, description } = req.body;
  try {
    const course = await createCourse(name, description);
    res.status(201).json({ course });
  } catch (err) {
    res.status(400).json({ error: 'Could not create course.' });
  }
}

// Get all courses
async function listCourses(req, res) {
  const courses = await getAllCourses();
  res.json({ courses });
}

module.exports = { addCourse, listCourses };
