const pool = require('../config/db');

// Create a new course
async function createCourse(name, description) {
  const result = await pool.query(
    'INSERT INTO courses (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return result.rows[0];
}

// Get all courses
async function getAllCourses() {
  const result = await pool.query('SELECT * FROM courses');
  return result.rows;
}

module.exports = { createCourse, getAllCourses };
