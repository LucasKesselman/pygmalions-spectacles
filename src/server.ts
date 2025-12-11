import express from 'express';
import path from 'path';

// Define __filename and __dirname for ES Modules (import/export)
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;


// Tell Express to serve static content from the current directory (__dirname).
// This makes all files in subfolders (like 'src') available for the browser to request.
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`WOW! Server is running on http://localhost:${PORT}`);
  console.log(`Serving files from: ${__dirname}`);
});