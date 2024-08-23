"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Land() {
  return (
    (<div className="flex flex-col min-h-screen">
      <header
        className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <Link 
          href="#"
          className="flex items-center gap-2 font-bold text-xl"
          prefetch={false}>
          <DatabaseIcon className="w-6 h-6" />
          Data Dashboard
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          <Link href="#" className="hover:underline" prefetch={false}>
            Dashboard
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Features
          </Link>
          <Button variant="outline">Sign In</Button>
        </nav>
        <Button className="md:hidden">
          <MenuIcon className="w-6 h-6" />
        </Button>
      </header>
      <main className="flex-1">
        <section
          className="bg-primary text-primary-foreground py-16 px-6 md:py-24 md:px-10 flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold mb-4 md:text-5xl">Unlock the Power of Your Data</h1>
          <p className="text-lg mb-8 max-w-[700px] md:text-xl">
            QuerySage is a revolutionary tool that bridges the gap between non-SQL users and databases. Connect to your
            data sources and interact with them using natural language.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button className="w-full sm:w-auto">Try QuerySage</Button>
            <Link
              href="#"
              className="inline-flex items-center gap-2 hover:underline"
              prefetch={false}>
              Learn More
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </section>
        <section id="features" className="py-12 px-6 md:py-20 md:px-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center md:text-4xl">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <DatabaseIcon className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Connect to Any Data Source</h3>
                  <p className="text-muted-foreground">
                    QuerySage supports a wide range of data sources, including PostgreSQL, MySQL, MongoDB, SQLite, and
                    CSV files.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <SlidersVerticalIcon className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Intuitive Natural Language Querying</h3>
                  <p className="text-muted-foreground">
                    Use natural language to interact with your data sources and generate reports, infographics, and
                    analytics.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <PieChartIcon className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Powerful Data Visualization</h3>
                  <p className="text-muted-foreground">
                    QuerySage provides a range of data visualization tools to help you make sense of your data.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <ShieldIcon className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Secure and Compliant</h3>
                  <p className="text-muted-foreground">
                    QuerySage is designed with security and compliance in mind, ensuring your data is safe and
                    protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer
        className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <div className="text-sm">&copy; 2024 QuerySage. All rights reserved.</div>
        <nav className="hidden md:flex items-center gap-4">
          <Link href="#" className="hover:underline" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>)
  );
}

function ArrowRightIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>)
  );
}


function DatabaseIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>)
  );
}


function MenuIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>)
  );
}


function PieChartIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>)
  );
}


function ShieldIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path
        d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>)
  );
}


function SlidersVerticalIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <line x1="4" x2="4" y1="21" y2="14" />
      <line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" />
      <line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" />
      <line x1="20" x2="20" y1="12" y2="3" />
      <line x1="2" x2="6" y1="14" y2="14" />
      <line x1="10" x2="14" y1="8" y2="8" />
      <line x1="18" x2="22" y1="16" y2="16" />
    </svg>)
  );
}
