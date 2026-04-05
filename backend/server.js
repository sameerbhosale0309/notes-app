const express = require('express');
const cors = require('cors');
require('dotenv').config();

const notesRoutes = require('./routes/notesRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('backend is running');
});

app.use('/api', notesRoutes);

const PORT = process.env.port || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});