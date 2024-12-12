"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Marquee from "@/components/ui/marquee";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Footer from "@/components/footer";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { BackgroundLines } from "@/components/ui/background-lines";

const logos = [
  { src: "/logos/neonDB.png", alt: "Neon DB" },
  { src: "/logos/redis.png", alt: "Redis" },
  { src: "/logos/mssql.png", alt: "MSSQL" },
  { src: "/logos/snowflake.png", alt: "Snowflake" },
  { src: "/logos/oracle.png", alt: "Oracle" },
  { src: "/logos/mysql.png", alt: "MySQL" },
  { src: "/logos/pg.png", alt: "PostgreSQL" },
  { src: "/logos/mongoDB.png", alt: "MongoDB" },
  { src: "/logos/oracledb.png", alt: "Oracle DB" },
];

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <BackgroundLines>
        <section className="relative overflow-hidden min-h-[calc(100vh-64px)] px-4 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-3xl"></div>
          <div className="relative w-full max-w-7xl mx-auto py-12 md:py-20">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 px-4">
                Make Database Interactions Effortless
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
                No SQL needed, connect your database and{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                  chat
                </span>{" "}
                with your data
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
                <Link href={'/dashboard'} className="w-full sm:w-auto">
                  <HoverBorderGradient
                    containerClassName="rounded-full w-full sm:w-auto"
                    as="button"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 items-center space-x-2"
                  >
                    Get Started Free
                  </HoverBorderGradient>
                </Link>
                <HoverBorderGradient
                  containerClassName="rounded-full w-full sm:w-auto"
                  as="button"
                  className="w-full sm:w-auto items-center space-x-2"
                >
                  Watch Demo ▶
                </HoverBorderGradient>
              </div>
            </div>
          </div>
        </section>
      </BackgroundLines>

      {/* Database Logos Section */}
      <section className="py-12 sm:py-16 relative overflow-hidden border-t border-b border-border/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-2">
            Works with Your Favorite Databases
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground text-center">
            Seamlessly connect with all major databases
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-background to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-background to-transparent z-10"></div>

          <Marquee className="py-4 sm:py-6" repeat={2}>
            {logos.map((logo, index) => (
              <div key={index} className="mx-4 sm:mx-8">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={40}
                  height={40}
                  className="h-8 sm:h-12 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-8 text-center">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "1M+", label: "Queries Generated" },
              { value: "99.9%", label: "Accuracy Rate" },
              { value: "24/7", label: "Support" },
            ].map((stat, index) => (
              <div key={index} className="group p-4">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 sm:mb-4">
          Why Choose QuerySage?
        </h2>
        <p className="text-sm sm:text-base text-gray-400 text-center mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
          Experience the future of database interactions with our powerful features
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              title: "Enterprise Ready",
              description:
                "Perfect for large enterprise databases with no size limits. Built for scale.",
              icon: "🏢",
            },
            {
              title: "100% Secure",
              description:
                "Your data and credentials are never stored. Bank-grade encryption.",
              icon: "🔒",
            },
            {
              title: "Free & Open Source",
              description:
                "Built with the belief that AI should empower humanity. Forever free.",
              icon: "🥑",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 sm:p-8 rounded-xl bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm hover:from-white/10 hover:to-white/[0.05] transition-all duration-300 border border-white/10"
            >
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full"></div>
        <div className="relative">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-gray-400 text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                step: "1",
                title: "Login",
                description:
                  "Create an account or sign in securely to get started with QuerySage",
              },
              {
                step: "2",
                title: "Connect Database",
                description:
                  "Enter your database credentials securely using our encrypted connection",
              },
              {
                step: "3",
                title: "Start Chatting",
                description:
                  "Ask questions in natural language and get instant SQL queries",
              },
            ].map((step, index) => (
              <div key={index} className="relative group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center text-xl sm:text-2xl font-bold mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    {step.step}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">{step.title}</h3>
                  <p className="text-sm sm:text-base text-gray-400 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[40%] border-t-2 border-dashed border-blue-600/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-3xl"></div>
        <div className="relative">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Ready to Transform Your Database Experience?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-10 max-w-2xl mx-auto px-4">
            Join thousands of developers and analysts who are making database interactions effortless with QuerySage.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105">
              Get Started Free
            </button>
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}