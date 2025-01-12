import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.svg" alt="Logo" width={32} height={32} />
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-600">
                QuerySage AI
              </span>
            </Link>
          </div>

          <div className="flex space-x-6 mt-6 md:mt-0">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="/#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex space-x-4 mt-6 md:mt-0">
            <Link href="https://github.com/Tirth-chokshi/QuerySage-AI" aria-label="GitHub">
              <Github className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
            <Link href="https://x.com/tirth_chokshi_" aria-label="Twitter">
              <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
            <Link href="https://www.linkedin.com/in/tirth-chokshi-6170ba259/" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
            <Link href="mailto:chokshitirth4@gmail.com" aria-label="Email">
              <Mail className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} QuerySage AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}