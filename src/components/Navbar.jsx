"use client";

import { useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { MoonIcon, SunIcon, LogInIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";



const logo = '/logo.svg';
const Navbar = () => {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const handleSignIn = useCallback(() => {
    window.location.href = '/login';
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false });
    window.location.href = '/';
  }, []);

  const navigation = [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ];


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center">

        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={logo} alt="Logo" width={32} height={32} />
            <span className="font-bold">QuerySage AI</span>
          </Link>
        </div>

        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="w-1/3 flex justify-end items-center space-x-2">

          <Button variant="outline" onClick={handleSignIn}>
            Log in
            <LogInIcon className='ml-2' />

          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <SunIcon className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle Theme</span>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;