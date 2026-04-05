const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
  getSubjects,
  getNotesBySubject,
  uploadNote,
  getAllNotes,
  deleteNote,
} = require('../controllers/notesController');

const upload = multer({ dest: 'uploads/' });

router.get('/subjects', getSubjects);
router.get('/notes/:subject', getNotesBySubject);
router.get('/all-notes', getAllNotes);
router.post('/upload-note', upload.single('file'), uploadNote);
router.delete('/notes/:id', deleteNote);

module.exports = router;