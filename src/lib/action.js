"use server";

import dbConnect from "@/lib/dbConnect";
import Chat from "@/models/Chat";
import User from "@/models/User";

export const chatCreate = async (req, res) => {
    const { userId, chatName, dbType } = req.body
    dbConnect()
    const user = await User.findById(userId)
    const newChat = new Chat({
        userId,
        chatName,
        dbType,
    })
    await newChat.save()
    const chat = await Chat.find()
    res.status(201).json(chat)
}

export const getUserChat = async(req,res) =>{
    dbConnect()
    try{
        const {userId} = req.params
        const chat = await Chat.find({ userId})
        res.status(200).json(chat)
    }
    catch(error){
        res.status(404).json({message: error.message})
    }
}