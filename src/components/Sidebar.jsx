"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import {LucideSettings,LogOutIcon,HistoryIcon,MessageCirclePlusIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import Image from 'next/image';
import Link from 'next/link';
const logo = '/logo.svg';
export default function Sidebar() {
  return (
    <aside className="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
      <div className="border-b p-2">
      <Link href="/" className="flex items-center">
            <Image src={logo} alt="Logo" width={32} height={32} />
          </Link>
      </div>
      <TooltipProvider>
        <nav className="grid gap-1 p-2">
          <SidebarButton icon={<MessageCirclePlusIcon className="size-5" />} label="New Chat" />
          <SidebarButton icon={<HistoryIcon className="size-5" />} label="History" />
        </nav>
        <nav className="mt-auto grid gap-1 p-2">
          <SidebarButton icon={<LucideSettings className="size-5" />} label="Settings" />
          <SidebarButton icon={<LogOutIcon className="size-5" />} label="Logout" />
        </nav>
      </TooltipProvider>
    </aside>
  );
}

function SidebarButton({ icon, label }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg"
          aria-label={label}
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