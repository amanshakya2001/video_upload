const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Route to check if the server is running
app.get('/', (req, res) => {
  res.send('Server is running properly!');
});

// Route to handle video chunk upload
app.post('/upload', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.body.fileName);
  const chunkIndex = parseInt(req.body.chunkIndex);
  const totalChunks = parseInt(req.body.totalChunks);

  // Append the chunk to the file
  const chunk = req.files.file.data;
  fs.appendFileSync(filePath, chunk);

  // If it's the last chunk, respond with a success message
  if (chunkIndex + 1 === totalChunks) {
    res.send({ status: 'complete' });
  } else {
    res.send({ status: 'chunk received' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
