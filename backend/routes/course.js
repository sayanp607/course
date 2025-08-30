const express = require('express');
const router = express.Router();
const { addCourse, listCourses } = require('../controllers/courseController');

router.post('/', addCourse); // Admin only
router.get('/', listCourses);

module.exports = router;
