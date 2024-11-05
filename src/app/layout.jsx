import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import SessionWrapper from "@/components/SessionWrapper";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: 'QuerySage AI - Natural Language Database Queries',
  description: 'Interact with your databases using natural language powered by AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
      <SessionWrapper>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {/* <Footer/> */}
        </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
