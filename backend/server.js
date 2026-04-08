const express = require('express');

require('dotenv').config();

const notesRoutes = require('./routes/notesRoutes');

const app = express();

const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173', // for local development
    'https://notes-app-pzlr.vercel.app', // your vercel frontend
  ],
  credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('backend is running');
});

app.use('/api', notesRoutes);

const PORT = process.env.port || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});