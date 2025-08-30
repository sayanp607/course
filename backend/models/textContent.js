const pool = require('../config/db');

// Add text content to a subsection
async function addTextContent(subsectionId, content) {
  const result = await pool.query(
    'INSERT INTO text_contents (subsection_id, content) VALUES ($1, $2) RETURNING *',
    [subsectionId, content]
  );
  return result.rows[0];
}

// Get text content for a subsection
async function getTextContentBySubsection(subsectionId) {
  const result = await pool.query(
    'SELECT * FROM text_contents WHERE subsection_id = $1',
    [subsectionId]
  );
  return result.rows;
}

module.exports = { addTextContent, getTextContentBySubsection };
