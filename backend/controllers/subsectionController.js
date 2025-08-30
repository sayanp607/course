const { createSubsection, getSubsectionsByCourse } = require('../models/subsection');
const { addVideo, getVideosBySubsection } = require('../models/video');
const { addTextContent, getTextContentBySubsection } = require('../models/textContent');

// Add subsection (admin only)
async function addSubsection(req, res) {
  const { courseId, title, type } = req.body;
  try {
    const subsection = await createSubsection(courseId, title, type);
    res.status(201).json({ subsection });
  } catch (err) {
    res.status(400).json({ error: 'Could not create subsection.' });
  }
}

// Add video to subsection
async function addVideoToSubsection(req, res) {
  const { subsectionId, title, url, duration, textAbove, textBelow } = req.body;
  let pdfUrl = null;
  try {
    // If a PDF file is uploaded, save local file path
    if (req.file) {
      pdfUrl = `/uploads/${req.file.filename}`;
    }
    const video = await addVideo(subsectionId, title, url, duration, textAbove, textBelow, pdfUrl);
    res.status(201).json({ video });
  } catch (err) {
    console.error('Add video error:', err);
    res.status(400).json({ error: 'Could not add video.' });
  }
}

// Add text to subsection
async function addTextToSubsection(req, res) {
  const { subsectionId, content } = req.body;
  try {
    const text = await addTextContent(subsectionId, content);
    res.status(201).json({ text });
  } catch (err) {
    res.status(400).json({ error: 'Could not add text.' });
  }
}

// Get all subsections for a course (with videos and text)
async function getSubsections(req, res) {
  const { courseId } = req.params;
  const subsections = await getSubsectionsByCourse(courseId);
  for (const subsection of subsections) {
    subsection.videos = await getVideosBySubsection(subsection.id);
    subsection.texts = await getTextContentBySubsection(subsection.id);
  }
  res.json({ subsections });
}

module.exports = { addSubsection, addVideoToSubsection, addTextToSubsection, getSubsections };
