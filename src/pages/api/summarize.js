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
        console.error('Error', err);
        res.status(500).json({ error: 'Error parsing form data' });
        return;
      }

      const file = files.file[0];
      const formData = new FormData();
      formData.append('file', new Blob([fs.readFileSync(file.filepath)]), file.originalFilename);

      try {
        const response = await fetch('http://localhost:8000/summarize', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        console.error('Error', error);
        res.status(500).json({ error: 'Error processing request' });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}