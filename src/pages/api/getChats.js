import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from '@/lib/dbConnect';
import Chat from '@/models/Chat';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      await dbConnect();

      // createChat stores the user's email as userId
      const chats = await Chat.find({ userId: session.user.email }).sort({ createdAt: 1 });

      res.status(200).json({
        chats: chats.map(chat => ({ id: chat._id.toString(), name: chat.chatName, dbType: chat.dbType })),
      });
    } catch (error) {
      console.error('Error fetching chats:', error);
      res.status(500).json({ error: 'An error occurred while fetching chats.', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
