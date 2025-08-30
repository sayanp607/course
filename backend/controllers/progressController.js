const { completeVideo, undoVideo, getCompletedVideos } = require('../models/progress');

// Mark video as completed
async function markComplete(req, res) {
  const { userId, courseId, videoId } = req.body;
  console.log('markComplete called with:', { userId, courseId, videoId });
  try {
    await completeVideo(userId, courseId, videoId);
    console.log('Video marked complete successfully');
    res.json({ success: true });
  } catch (err) {
    console.error('Error in markComplete:', err);
    res.status(500).json({ error: 'Could not mark complete.' });
  }
}

// Undo video completion
async function undoComplete(req, res) {
  const { userId, courseId, videoId } = req.body;
  try {
    await undoVideo(userId, courseId, videoId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Could not undo complete.' });
  }
}

// Get completed videos for user in course
async function getProgress(req, res) {
  const { userId, courseId } = req.query;
  try {
    const completed = await getCompletedVideos(userId, courseId);
    res.json({ completed });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch progress.' });
  }
}

module.exports = { markComplete, undoComplete, getProgress };
