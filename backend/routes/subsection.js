const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { addSubsection, addVideoToSubsection, addTextToSubsection, getSubsections } = require('../controllers/subsectionController');

router.post('/', addSubsection); // Admin only
router.post('/video', upload.single('pdf'), addVideoToSubsection); // Admin only, PDF optional
router.post('/text', addTextToSubsection); // Admin only
router.get('/:courseId', getSubsections);

module.exports = router;
