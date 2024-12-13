"use client";

import { useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { signOut, useSession } from "next-auth/react"
import { MoonIcon, SunIcon, LogInIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet"
import { Menu } from "lucide-react";
import { ModeToggle } from "./ModeToggle"
import { HoverBorderGradient } from "./ui/hover-border-gradient"

const logo = "/logo.svg";

const Navbar = () => {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();

  const handleSignIn = useCallback(() => {
    window.location.href = "/login";
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false });
    window.location.href = "/";
  }, []);

  const navigation = [
    { name: "Features", href: "/#features" },
    { name: "Solutions", href: "/#solutions" },
    { name: "Testimonials", href: "/#testimonials" },
    { name: "FAQ", href: "/#faq" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 sm:h-16 items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2 sm:gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={logo} alt="Logo" width={28} height={28} priority className="w-7 h-7 sm:w-8 sm:h-8" />
            <span className="font-bold text-lg sm:text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-600">
              QuerySage AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary relative group px-3 py-2"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-600 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ModeToggle />
            <Button
              variant="ghost"
              onClick={handleSignIn}
              className="font-medium hidden lg:flex"
            >
              Sign in
            </Button>
            {status === "authenticated" ? (
              <Link href="/dashboard">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  as="button"
                  className="flex bg-gradient-to-r from-blue-500 to-purple-600 items-center space-x-2 text-sm"
                >
                  Dashboard
                </HoverBorderGradient>
              </Link>
            ) : (
              <Link href="/dashboard">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  as="button"
                  className="flex bg-gradient-to-r from-blue-500 to-purple-600 items-center space-x-2 text-sm"
                >
                  Get Started Free
                </HoverBorderGradient>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <Link href="/" className="flex items-center space-x-2 mb-4">
                  <Image src={logo} alt="Logo" width={24} height={24} />
                  <span className="font-bold">QuerySage AI</span>
                </Link>
                
                {/* Mobile Navigation */}
                <div className="flex flex-col space-y-1 mt-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium transition-colors hover:text-primary px-2 py-2 rounded-md hover:bg-accent"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <hr className="my-4 border-border/40" />

                {/* Mobile Actions */}
                <div className="space-y-3">
                  {/* Theme Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="w-full justify-start px-2"
                  >
                    <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="ml-2">{theme === "dark" ? "Light" : "Dark"} mode</span>
                  </Button>

                  {/* Sign In */}
                  <Button variant="ghost" className="w-full justify-start" onClick={handleSignIn}>
                    <LogInIcon className="h-5 w-5 mr-2" />
                    Sign in
                  </Button>

                  {/* Get Started */}
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity"
                  >
                    <Link href="/dashboard" className="w-full">
                      Get Started Free
                    </Link>
                  </Button>
                </div>

                {/* Additional Info */}
                {status === "authenticated" && (
                  <div className="mt-auto pt-4 border-t border-border/40">
                    <Button 
                      variant="ghost" 
                      onClick={handleSignOut}
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50/10"
                    >
                      Sign out
                    </Button>
                  </div>
                )} 
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;