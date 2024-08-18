import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';

export function RecentChats({ chats, activeChat, onChatSelect }) {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold mb-4">Recent Chats</h2>
        {chats.map((chat) => (
          <Button
            key={chat.id}
            variant={chat.id === activeChat?.id ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onChatSelect(chat)}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            <span className="truncate">{chat.name}</span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}