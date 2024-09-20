import { IncomingForm } from 'formidable';
import fs from 'fs';

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
        console.error('Error parsing form:', err);
        res.status(500).json({ error: 'Error parsing form data' });
        return;
      }

      try {
        const file = files.file[0];
        const question = fields.question[0];
        
        const formData = new FormData();
        formData.append('file', new Blob([fs.readFileSync(file.filepath)]), file.originalFilename);
        formData.append('question', question);

        const response = await fetch('http://localhost:8000/chat', {
          // const response = await fetch('https://backendcsv.onrender.com/chat', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Backend HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Error processing request' });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
