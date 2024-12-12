"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  User,
  LogOut,
  Search,
  Bell,
  Database,
  FileSpreadsheet,
  FileJson,
  MessageSquare,
} from "lucide-react";
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
import { signOut } from "next-auth/react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import logo from "@/components/logo.svg";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation"
import { ModeToggle } from "@/components/ModeToggle";


export default function DashboardPage() {
  const { data: session, status } = useSession();
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
    {
      id: 1,
      title: "Database Query Analysis",
      date: "2024-09-19",
      preview: "Analyzed user engagement trends...",
    },
    {
      id: 2,
      title: "CSV Data Exploration",
      date: "2024-09-18",
      preview: "Explored sales data from Q3...",
    },
    {
      id: 3,
      title: "JSON Structure Review",
      date: "2024-09-17",
      preview: "Reviewed API response structure...",
    },
    {
      id: 4,
      title: "Performance Optimization",
      date: "2024-09-16",
      preview: "Optimized database queries for...",
    },
    {
      id: 5,
      title: "Data Visualization",
      date: "2024-09-15",
      preview: "Created charts for monthly sales...",
    },
    // Add more items to see scrolling effect
  ];

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="border-b border-border/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center mr-8">
                <Image
                  src={logo}
                  alt="QuerySage AI Logo"
                  width={40}
                  height={40}
                  className="transition-transform duration-300 hover:scale-110"
                />
                <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                  QuerySage AI
                </span>
              </Link>
              <NavigationMenu>
                <NavigationMenuList>
                  {navItems.map((item) => (
                    <NavigationMenuItem key={item.name}>
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                          {item.name}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                  <NavigationMenuItem>
                    <ModeToggle/>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative hover:bg-blue-500/10">
                <Bell size={20} />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full">
                  3
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full hover:bg-blue-500/10"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user.image}
                        alt={session.user.name || "User"}
                      />
                      <AvatarFallback>
                        {session.user.name ? session.user.name.charAt(0) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-sm" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:bg-blue-500/10">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="hover:bg-blue-500/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <div className="flex-1 flex overflow-hidden bg-background">
          <main className="flex-1 overflow-y-auto p-6 relative">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-3xl pointer-events-none"></div>
            
            <div className="relative">
              <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                Welcome to QuerySage AI
              </h1>
              <p className="text-xl mb-8 text-muted-foreground">
                Interact with your data seamlessly. Choose a service to get started:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature) => (
                  <Link href={feature.href} key={feature.name}>
                    <Card className="group transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer border border-border/50 bg-background/50 backdrop-blur-sm hover:border-blue-500/50">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <feature.icon className="mr-2 group-hover:text-blue-500 transition-colors" size={24} />
                          <span className="group-hover:text-blue-500 transition-colors">{feature.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
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
            </div>
          </main>

          {/* Chat History Sidebar (Right Side) */}
          <aside className="w-72 border-l border-border/10 bg-background/50 backdrop-blur-sm">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4 px-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                Recent Chats
              </h2>
              <ScrollArea className="h-[calc(100vh-150px)]">
                {chatHistory.map((chat) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    className="w-full justify-start mb-2 overflow-hidden text-left hover:bg-blue-500/10 transition-colors"
                  >
                    <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate font-medium">{chat.title}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {chat.preview}
                      </span>
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
