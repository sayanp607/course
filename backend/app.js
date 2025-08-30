const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course');
const subsectionRoutes = require('./routes/subsection');
const progressRoutes = require('./routes/progress');


const app = express();
app.use(cors({
  origin: [
    'https://course-eight-iota.vercel.app',
    'https://course-p795qqh8j-sayan-pauls-projects-8716183d.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
// Handle CORS preflight requests for all routes
app.options('*', cors());
app.use(bodyParser.json());
// Serve static files from uploads folder
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/subsections', subsectionRoutes);
app.use('/api/progress', progressRoutes);

app.get('/', (req, res) => {
  res.send('Course system backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
