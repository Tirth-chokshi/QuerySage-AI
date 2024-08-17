"use client"
import React from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, History, MessageCirclePlus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
const handleLogout = () => {
  signOut({ callbackUrl: '/' });
};

const logo = '/logo.svg';

export default function Sidebar({onNewChat, chats, activeChatId, onChatSelect}) {
  return (
    <aside className="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
      <div className="border-b p-2">
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="Logo" width={32} height={32} />
        </Link>
      </div>
      <TooltipProvider>
      <nav className="grid gap-1 p-2">
        <SidebarButton
          icon={<MessageCirclePlus className="size-5" />}
          label="New Chat"
          onClick={onNewChat}
        />
          <SidebarButton icon={<History className="size-5" />} label="History" />
        </nav>
        <nav className="mt-auto grid gap-1 p-2">
          <SidebarButton icon={<Settings className="size-5" />} label="Settings" />
          <SidebarButton
            icon={<LogOut className="size-5" />}
            label="Logout"
            onClick={handleLogout}
          />
        </nav>
      </TooltipProvider>
    </aside>
  );
}

function SidebarButton({ icon, label, onClick }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg"
          aria-label={label}
          onClick={onClick}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={5}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}