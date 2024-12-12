"use client"

import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}

      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-3xl"></div>
        <div className="relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Make Database Interactions Effortless
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              QuerySage converts your natural language questions into SQL queries. Whether you&apos;re new to SQL or just want a simpler way to interact with your database, we&apos;ve got you covered.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105">
                Get Started Free
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                Watch Demo ▶
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Database Logos Section */}
      <section className="py-16 relative overflow-hidden border-t border-b border-border/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-2">
            Works with Your Favorite Databases
          </h2>
          <p className="text-muted-foreground text-center">
            Seamlessly connect with all major databases
          </p>
        </div>
        
        {/* Animated logos container */}
        <div className="relative">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10"></div>
          
        </div>
        <div>
          
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "1M+", label: "Queries Generated" },
              { value: "99.9%", label: "Accuracy Rate" },
              { value: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-3xl font-bold text-blue-500 mb-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">Why Choose QuerySage?</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">Experience the future of database interactions with our powerful features</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Enterprise Ready",
              description: "Perfect for large enterprise databases with no size limits. Built for scale.",
              icon: "🏢"
            },
            {
              title: "100% Secure",
              description: "Your data and credentials are never stored. Bank-grade encryption.",
              icon: "🔒"
            },
            {
              title: "Free & Open Source",
              description: "Built with the belief that AI should empower humanity. Forever free.",
              icon: "🌟"
            }
          ].map((feature, index) => (
            <div key={index} className="p-8 rounded-xl bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm hover:from-white/10 hover:to-white/[0.05] transition-all duration-300 border border-white/10">
              <div className="text-5xl mb-6 transform hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full"></div>
        <div className="relative">
          <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">Get started in three simple steps</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Login",
                description: "Create an account or sign in securely to get started with QuerySage"
              },
              {
                step: "2",
                title: "Connect Database",
                description: "Enter your database credentials securely using our encrypted connection"
              },
              {
                step: "3",
                title: "Start Chatting",
                description: "Ask questions in natural language and get instant SQL queries"
              }
            ].map((step, index) => (
              <div key={index} className="relative group">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center text-2xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-center leading-relaxed">{step.description}</p>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-3xl"></div>
        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Ready to Transform Your Database Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of developers and analysts who are making database interactions effortless with QuerySage.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105">
              Get Started Free
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}