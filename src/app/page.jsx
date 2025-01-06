"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import Marquee from "@/components/ui/marquee";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Footer from "@/components/footer";
import { BackgroundLines } from "@/components/ui/background-lines";
import IntegratedFeatures from "@/components/IntegratedSection";

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

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      // redirect("/dashboard");
    }
  }, [status]);

  return (
      <div className="min-h-screen bg-background text-foreground overflow-hidden">
        <Navbar />
        
        {/* Hero Section */}
        <BackgroundLines>
          <section className="relative min-h-[90vh] px-4 flex items-center justify-center">
            <motion.div
              className="relative w-full max-w-7xl mx-auto py-12 md:py-20"
              initial="initial"
              animate="animate"
              variants={fadeIn}
            >
              <div className="text-center space-y-6">
                <motion.span 
                  className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium"
                  variants={fadeIn}
                >
                  Revolutionizing Database Interactions
                </motion.span>
                
                <motion.h1 
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                  variants={fadeIn}
                >
                  Make Your Database Interaction
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    {/* Powered by AI. */}
                    Effortless.
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground"
                  variants={fadeIn}
                >
                  Transform how you interact with databases using natural language. 
                  Get instant insights, generate queries, and explore data effortlessly.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
                  variants={fadeIn}
                >
                  <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300">
                    Start Free Trial
                  </button>
                  <button className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300">
                    Watch Demo
                  </button>
                </motion.div>
              </div>
            </motion.div>
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
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-background to-transparent z-10" />
  
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
        <IntegratedFeatures/>


        {/* Features Grid Section - New Addition */}
        <div className="max-w-7xl mx-auto px-4 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                // icon: <Icons.sparkles className="h-8 w-8 text-blue-400" />,
                title: "Natural Language Queries",
                description: "Write queries in plain English and get instant results"
              },
              {
                // icon: <Icons.shield className="h-8 w-8 text-blue-400" />,
                title: "Enterprise Security",
                description: "Bank-grade encryption and security measures"
              },
              {
                // icon: <Icons.lightning className="h-8 w-8 text-blue-400" />,
                title: "Real-time Analysis",
                description: "Get insights and visualizations in milliseconds"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
  
        {/* CTA Section */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-3xl" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Ready to Transform Your Database Experience?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-10 max-w-2xl mx-auto">
              Join thousands of developers and analysts who are making database
              interactions effortless with QuerySage.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
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