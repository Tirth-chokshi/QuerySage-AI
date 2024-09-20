"use client"
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, User, LogOut, Search, Bell, Database, FileSpreadsheet, FileJson, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from 'next/image';
import logo from '@/components/logo.svg';
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Docs", href: "/docs" },
  ];

  const features = [
    { name: "Interact with Database", href: "/chat", icon: Database },
    { name: "Analyze CSV Files", href: "/csvtest", icon: FileSpreadsheet },
    { name: "Interact with JSON", href: "/json", icon: FileJson },
  ];

  // Dummy chat history data
  const chatHistory = [
    { id: 1, title: "Database Query Analysis", date: "2024-09-19", preview: "Analyzed user engagement trends..." },
    { id: 2, title: "CSV Data Exploration", date: "2024-09-18", preview: "Explored sales data from Q3..." },
    { id: 3, title: "JSON Structure Review", date: "2024-09-17", preview: "Reviewed API response structure..." },
    { id: 4, title: "Performance Optimization", date: "2024-09-16", preview: "Optimized database queries for..." },
    { id: 5, title: "Data Visualization", date: "2024-09-15", preview: "Created charts for monthly sales..." },
    // Add more items to see scrolling effect
  ];

  const { data: session, status } = useSession()
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>User not authenticated</p>;
  }

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <Link href="/" className="flex items-center mr-6">
                <Image src={logo} alt="QuerySage AI Logo" width={40} height={40} className="transition-transform duration-300 hover:scale-110" />
                <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">QuerySage AI</span>
              </Link>
              <NavigationMenu>
                <NavigationMenuList>
                  {navItems.map((item) => (
                    <NavigationMenuItem key={item.name}>
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                          {item.name}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">3</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image} alt={session.user.name || "User"} />
                      <AvatarFallback>{session.user.name ? session.user.name.charAt(0) : "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Welcome to QuerySage AI</h1>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
              Interact with your data seamlessly. Choose a service to get started:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Link href={feature.href} key={feature.name}>
                  <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <feature.icon className="mr-2" size={24} />
                        {feature.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.name === "Interact with Database"
                          ? "Chat with your database, run queries, and gain insights."
                          : feature.name === "Analyze CSV Files"
                            ? "Upload and analyze CSV files with AI-powered tools."
                            : "Explore and manipulate JSON data effortlessly."}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </main>

          {/* Chat History Sidebar (Right Side) */}
          <aside className="w-64 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Recent Chats</h2>
              <ScrollArea className="h-[calc(100vh-150px)]">
                {chatHistory.map((chat) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    className="w-full justify-start mb-2 overflow-hidden text-left"
                  >
                    <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate font-medium">{chat.title}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{chat.preview}</span>
                    </div>
                  </Button>
                ))}
              </ScrollArea>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}