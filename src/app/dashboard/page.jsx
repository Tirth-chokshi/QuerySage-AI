"use client"

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, User, LogOut, Search, Bell, Database, FileSpreadsheet, FileJson } from "lucide-react";
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
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const { data: session, status } = useSession()
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>User not authenticated</p>;
  }

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-10 ">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image src={logo} alt="QuerySage AI Logo" width={40} height={40} className="transition-transform duration-300 hover:scale-110" />
              {/* <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">QuerySage AI</span> */}
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
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

            {/* Search Bar */}
            <div className="hidden md:flex items-center space-x-4 flex-1 justify-center">
              <form className="relative w-full max-w-lg">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              </form>
            </div>

            {/* User Menu and Notifications */}
            <div className="hidden md:flex items-center space-x-4 ">
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">3</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    {session.user && (
                      <Avatar className="h-8 w-8 transition-transform duration-300 hover:scale-110">
                        <AvatarImage src={session.user.image} alt={session.user.name || "User"} />
                        <AvatarFallback>{session.user.name ? session.user.name.charAt(0) : "U"}</AvatarFallback>
                      </Avatar>
                    )}
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

            {/* Mobile Menu Button */}
            <div className="md:hidden ">
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                {isMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 animate-in slide-in-from-top-5">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-white transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-4">
                <Button className="w-full" variant="outline">
                  Log out
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <main className="pt-24 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">Welcome to QuerySage AI</h1>
        <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
          Interact with your data seamlessly. Choose a feature to get started:
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
    </div>
  );
}