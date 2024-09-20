import { IncomingForm } from 'formidable';
import { createReadStream } from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new IncomingForm({
      // maxFileSize: 100 * 1024 * 1024, // 100MB limit
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error', err);
        res.status(500).json({ error: 'Error parsing form data' });
        return;
      }

      const file = files.file[0];
      const formData = new FormData();

      try {
        // Create a read stream from the file
        const fileStream = createReadStream(file.filepath);
        
        // Append the file stream to formData
        formData.append('file', fileStream, {
          filename: file.originalFilename,
          contentType: file.mimetype,
        });
        // const response = await fetch('http://localhost:8000/summarize', {
          const response = await fetch('https://backendcsv.onrender.com/summarize', {
          method: 'POST',
          body: formData,
          headers: formData.getHeaders(),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        console.error('Error', error);  
        res.status(500).json({ error: 'Error processing request: ' + error.message });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}