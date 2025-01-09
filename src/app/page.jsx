"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import Navbar from "@/components/Navbar";
import Marquee from "@/components/ui/marquee";
import Footer from "@/components/footer";
import { BackgroundLines } from "@/components/ui/background-lines";
import IntegratedFeatures from "@/components/IntegratedSection";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";

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

const PrimaryButton = ({ children, className }) => (
  <button 
    className={cn(
      "group relative px-8 py-4 overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-600 before:to-purple-700 before:opacity-0 before:transition-opacity hover:before:opacity-100",
      className
    )}
  >
    <span className="relative z-10 flex items-center justify-center gap-2">
      {children}
      <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </span>
  </button>
);

const SecondaryButton = ({ children, className }) => (
  <button 
    className={cn(
      "group relative px-8 py-4 overflow-hidden rounded-lg border border-white/20 bg-white/5 backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-lg",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/10 before:to-purple-600/10 before:opacity-0 before:transition-opacity hover:before:opacity-100",
      className
    )}
  >
    <span className="relative z-10 flex items-center justify-center gap-2">
      {children}
      <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </span>
  </button>
);

const FeatureCard = ({ title, description }) => (
  <motion.div 
    className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500"
    whileHover={{ y: -5 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    <div className="relative z-10">
      <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  </motion.div>
);

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

      <BackgroundLines>
        <section className="relative min-h-[90vh] px-4 flex items-center justify-center">
          <motion.div
            className="relative w-full max-w-7xl mx-auto py-12 md:py-20"
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            <div className="text-center space-y-8">
              <motion.div 
                className="inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <span className="inline-block group rounded-full border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/10">
                  <AnimatedShinyText className="inline-flex items-center justify-center px-6 py-2 text-sm">
                    <span>✨ Revolutionizing Database Interactions</span>
                    <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </AnimatedShinyText>
                </span>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                variants={fadeIn}
              >
                Make Your Database Interaction
                <br />
                <span className="relative">
                  {/* <span className="absolute -inset-1 blur-xl bg-gradient-to-r from-blue-600/30 to-purple-600/30" /> */}
                  <span className="relative bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    Effortless.
                  </span>
                </span>
              </motion.h1>

              <motion.p
                className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300"
                variants={fadeIn}
              >
                No SQL needed, connect your database and{" "}
                <span className="relative">
                  {/* <span className="absolute -inset-1 blur-sm bg-gradient-to-r from-blue-600/30 to-purple-600/30" /> */}
                  <span className="relative bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent font-semibold">
                    chat
                  </span>
                </span>{" "}
                with your data
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
                variants={fadeIn}
              >
                <PrimaryButton>Start Free Trial</PrimaryButton>
                <SecondaryButton>Watch Demo</SecondaryButton>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </BackgroundLines>

      {/* Database Logos Section */}
      <section className="py-16 relative overflow-hidden border-t border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-3xl font-semibold text-center mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Works with Your Favorite Databases
          </h2>
          <p className="text-base text-gray-300 text-center">
            Seamlessly connect with all major databases
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

          <Marquee className="py-8" repeat={2}>
            {logos.map((logo, index) => (
              <motion.div 
                key={index} 
                className="mx-8"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={48}
                  height={48}
                  className="h-12 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              </motion.div>
            ))}
          </Marquee>
        </div>
      </section>

      <IntegratedFeatures />

      {/* Features Grid Section */}
      <div className="max-w-7xl mx-auto px-4 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Natural Language Queries",
              description: "Write queries in plain English and get instant results",
            },
            {
              title: "Enterprise Security",
              description: "Bank-grade encryption and security measures",
            },
            {
              title: "Real-time Analysis",
              description: "Get insights and visualizations in milliseconds",
            },
          ].map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-3xl" />
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Ready to Transform Your Database Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of developers and analysts who are making database
            interactions effortless with QuerySage.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <PrimaryButton className="w-full sm:w-auto">
              Get Started Free
            </PrimaryButton>
            <SecondaryButton className="w-full sm:w-auto">
              Schedule Demo
            </SecondaryButton>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}