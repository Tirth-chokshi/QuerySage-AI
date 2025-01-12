
import { Exo_2 } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import SessionWrapper from "@/components/SessionWrapper";

const exo2 = Exo_2({ 
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-exo2',
  display: 'swap',
});


export const metadata = {
  title: "QuerySage AI - Natural Language Database Queries",
  description:
    "Interact with your databases using natural language powered by AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          exo2.variable,
        )}
      >
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
