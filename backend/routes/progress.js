const express = require('express');
const router = express.Router();
const { markComplete, undoComplete, getProgress } = require('../controllers/progressController');

router.post('/complete', markComplete); // Mark video complete
router.post('/undo', undoComplete); // Undo video complete
router.get('/', getProgress); // Get completed videos for user in course

module.exports = router;
