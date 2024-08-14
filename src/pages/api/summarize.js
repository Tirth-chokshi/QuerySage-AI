import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';

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

      try {
        // Read file content
        const fileContent = await fs.readFile(file.filepath);
        
        // Create a Blob from the file content
        const blob = new Blob([fileContent], { type: file.mimetype });
        
        formData.append('file', blob, file.originalFilename);

        const response = await fetch('https://backendcsv.onrender.com/summarize', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        console.error('Error', error);
        res.status(500).json({ error: 'Error processing request: ' + error.message });
      } finally {
        // Clean up the temp file
        await fs.unlink(file.filepath).catch(console.error);
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}