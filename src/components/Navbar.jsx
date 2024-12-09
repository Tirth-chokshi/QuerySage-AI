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

import { Sheet, SheetTrigger, SheetContent } from './ui/sheet';
import { Menu } from 'lucide-react';

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
    { name: "Solutions", href: "/#solutions" },
    { name: "Testimonials", href: "/#testimonials" },
    { name: "FAQ", href: "/#faq" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={logo} alt="Logo" width={32} height={32} priority />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-600">
              QuerySage AI
            </span>
          </Link>

          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-600 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Theme"
            className="hidden lg:flex"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle Theme</span>
          </Button>

          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" onClick={handleSignIn} className="font-medium">
              Sign in
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-4">
                <Link href="/" className="flex items-center space-x-2 mb-4">
                  <Image src={logo} alt="Logo" width={24} height={24} />
                  <span className="font-bold">QuerySage AI</span>
                </Link>
                <hr className="border-border/40" />
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium transition-colors hover:text-primary px-2 py-1.5 rounded-md hover:bg-accent"
                  >
                    {item.name}
                  </Link>
                ))}
                <hr className="border-border/40" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="justify-start px-2"
                >
                  <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="ml-2">{theme === "dark" ? "Light" : "Dark"} mode</span>
                </Button>
                <Button variant="ghost" asChild className="justify-start">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity">
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;