const pool = require('../config/db');

// Add a video to a subsection, with optional text_above, text_below, and pdf_url
async function addVideo(subsectionId, title, url, duration, textAbove = null, textBelow = null, pdfUrl = null) {
  const result = await pool.query(
    'INSERT INTO videos (subsection_id, title, url, duration, text_above, text_below, pdf_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [subsectionId, title, url, duration, textAbove, textBelow, pdfUrl]
  );
  return result.rows[0];
}

// Get all videos for a subsection, including text_above and text_below
async function getVideosBySubsection(subsectionId) {
  const result = await pool.query(
    'SELECT * FROM videos WHERE subsection_id = $1',
    [subsectionId]
  );
  return result.rows;
}

module.exports = { addVideo, getVideosBySubsection };
