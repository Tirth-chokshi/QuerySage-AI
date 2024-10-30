import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const Metadata = {
  title: "QuerySage-AI",
  description: "Created with 💓",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
      <SessionWrapper>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
