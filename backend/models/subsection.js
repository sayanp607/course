const pool = require('../config/db');

// Create a new subsection (type: 'text' or 'video')
async function createSubsection(courseId, title, type) {
  const result = await pool.query(
    'INSERT INTO subsections (course_id, title, type) VALUES ($1, $2, $3) RETURNING *',
    [courseId, title, type]
  );
  return result.rows[0];
}

// Get all subsections for a course
async function getSubsectionsByCourse(courseId) {
  const result = await pool.query(
    'SELECT * FROM subsections WHERE course_id = $1',
    [courseId]
  );
  return result.rows;
}

module.exports = { createSubsection, getSubsectionsByCourse };
