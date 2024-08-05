import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from '@/lib/dbConnect';
import Chat from '@/models/Chat';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { chatName, dbType } = req.body;
    const userId = session.user.id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      await dbConnect();

      const newChat = new Chat({
        userId,
        chatName,
        dbType,
        createdAt: new Date(),
        lastActiveAt: new Date(),
      });

      await newChat.save();

      return res.status(201).json({ chatId: newChat._id });
    } catch (error) {
      console.error('Error creating chat:', error);
      return res.status(500).json({ error: 'An error occurred while creating the chat.', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
