import { IncomingForm } from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        res.status(500).json({ error: 'Error parsing form data' });
        return;
      }

      try {
        const file = files.file[0];
        const goal = fields.goal[0];

        const formData = new FormData();
        formData.append('file', fs.createReadStream(file.filepath), {
          filename: file.originalFilename,
          contentType: file.mimetype,
        });
        formData.append('goal', goal);

        // const response = await fetch('http://localhost:8000/visualize', {
          const response = await fetch('https://backendcsv.onrender.com/visualize', {
          method: 'POST',
          body: formData,
          headers: formData.getHeaders(),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('FastAPI error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.buffer();
        const base64Image = data.toString('base64');
        res.status(200).json({ image: base64Image });
      } catch (error) {
        console.error('Error in visualize API route:', error);
        res.status(500).json({ error: 'Error processing request', details: error.message });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}