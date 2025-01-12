import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import React from "react";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <section id="about" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">About QuerySage</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">
                Empowering Data Discovery
              </h3>
              <p className="text-gray-400 leading-relaxed">
                QuerySage is your intelligent companion for database exploration
                and query optimization. We combine cutting-edge AI technology
                with intuitive design to make database interactions more
                efficient and accessible than ever before.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-400">
                    Smart query suggestions powered by AI
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-400">
                    Natural language to SQL conversion
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-400">
                    Advanced query optimization techniques
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-white/10 rounded-lg p-8 text-white">
                <h4 className="text-xl font-semibold mb-4">Our Mission</h4>
                <p className="leading-relaxed">
                  To democratize database access and make data exploration
                  intuitive for everyone, from beginners to experienced
                  developers. We believe in the power of AI to transform how we
                  interact with databases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutUs;
