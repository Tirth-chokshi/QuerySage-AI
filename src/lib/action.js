"use server";

import dbConnect from "@/lib/dbConnect";
import Chat from "@/models/Chat";

export const chatCreate = async (req, res) => {
    const { userId ,chatName ,dbType ,dbInfo ,createdAt ,lastActiveAt } = req.body
    try {
        dbConnect()
        const newChat = new Chat({
            userId ,chatName ,dbType ,dbInfo ,createdAt ,lastActiveAt
        })
        await newChat.save()
    } catch (err) {
        console.log(err)

    }
}