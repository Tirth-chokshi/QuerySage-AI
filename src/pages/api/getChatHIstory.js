import dbConnect from '@/lib/dbConnect';
import Message from '@/models/Message';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { chatId } = req.query;

    try {
      await dbConnect();

      const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

      res.status(200).json(messages);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while fetching chat history.', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
