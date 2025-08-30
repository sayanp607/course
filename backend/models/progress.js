const pool = require('../config/db');

// Mark video as completed for a user in a course
async function completeVideo(userId, courseId, videoId) {
  console.log('completeVideo called with:', { userId, courseId, videoId });
  await pool.query(
    'INSERT INTO user_progress (user_id, course_id, video_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
    [userId, courseId, videoId]
  );
}

// Undo video completion
async function undoVideo(userId, courseId, videoId) {
  console.log('undoVideo called with:', { userId, courseId, videoId });
  await pool.query(
    'DELETE FROM user_progress WHERE user_id = $1 AND course_id = $2 AND video_id = $3',
    [userId, courseId, videoId]
  );
}

// Get completed videos for a user in a course
async function getCompletedVideos(userId, courseId) {
  const result = await pool.query(
    'SELECT video_id FROM user_progress WHERE user_id = $1 AND course_id = $2',
    [userId, courseId]
  );
  return result.rows.map(row => row.video_id);
}

module.exports = { completeVideo, undoVideo, getCompletedVideos };
