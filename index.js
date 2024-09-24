const express = require('express');
const fileUpload = require('express-fileupload');  // express-fileupload को इंपोर्ट करें
const fs = require('fs');
const path = require('path');
const cors = require('cors');  // cors को इंपोर्ट करें
const app = express();

// CORS मिडलवेयर का उपयोग करें
app.use(cors());

// express-fileupload मिडलवेयर का उपयोग करें
app.use(fileUpload());

// स्टैटिक फ़ोल्डर को सर्व करने के लिए
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to check if the server is running
app.get('/', (req, res) => {
  res.send('Server is running properly!');
});

// Route to handle video chunk upload
app.post('/upload/', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const uploadsDir = path.join(__dirname, 'uploads');
  
  if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
  }

  const filePath = path.join(uploadsDir, req.body.fileName);
  console.log("filepath", filePath);
  
  const chunkIndex = parseInt(req.body.chunkIndex);
  console.log("chunkIndex", chunkIndex);
  
  const totalChunks = parseInt(req.body.totalChunks);
  console.log("Total Chunk", totalChunks);

  // Append the chunk to the file
  const chunk = req.files.file.data;
  console.log(chunk);
  fs.appendFileSync(filePath, chunk);

  // If it's the last chunk, respond with a success message and file URL
  if (chunkIndex + 1 === totalChunks) {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.body.fileName}`;
    res.send({ status: 'complete', fileUrl: fileUrl });
  } else {
    res.send({ status: 'chunk received' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
