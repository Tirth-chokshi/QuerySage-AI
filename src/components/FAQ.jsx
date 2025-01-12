"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is QuerySage AI?",
    answer:
      "QuerySage AI is an advanced natural language to SQL query converter that helps you interact with your databases using plain English. It supports multiple database systems and provides accurate, efficient query generation.",
  },
  {
    question: "Which databases does QuerySage AI support?",
    answer:
      "QuerySage AI supports major database systems including MySQL, PostgreSQL, MongoDB, Oracle, and more. Our platform is constantly expanding to include more database integrations.",
  },
  {
    question: "How accurate are the generated queries?",
    answer:
      "QuerySage AI uses state-of-the-art AI models and maintains high accuracy through continuous learning and validation. Our system also provides query previews and explanations to ensure transparency and accuracy.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, security is our top priority. We implement enterprise-grade security measures, including encryption, secure authentication, and strict data access controls. We never store your actual data or queries.",
  },
  {
    question: "Do I need technical expertise to use QuerySage AI?",
    answer:
      "No technical expertise is required! QuerySage AI is designed to be user-friendly and accessible to everyone, from business analysts to developers. Simply describe what you need in plain English.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "We offer comprehensive support including documentation, tutorials, and dedicated customer service. Enterprise customers also get access to priority support and custom training sessions.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Frequently Asked Questions
          </span>
        </h2>
        <p className="text-muted-foreground">
          Find answers to common questions about QuerySage AI
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left group">
                <motion.div
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                  className="flex-1"
                >
                  {faq.question}
                </motion.div>
              </AccordionTrigger>
              <AccordionContent>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {faq.answer}
                </motion.div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
