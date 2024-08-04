"use server";

import dbConnect from "@/lib/dbConnect";
import User from "@/lib/model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function saveChatHistory(messages) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    console.error("No session found when trying to save chat history");
    return { success: false, error: "You must be signed in to save chat history." };
  }

  const userEmail = session.user.email;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.error(`User not found for email: ${userEmail}`);
      return { success: false, error: "User not found" };
    }

    user.chats.push({ messages });
    await user.save();

    return { success: true };
  } catch (error) {
    console.error("Error saving chat history:", error);
    return { success: false, error: error.message };
  }
}