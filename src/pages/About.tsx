import React from "react";
import { motion } from "framer-motion";
import { Linkedin, Github } from "lucide-react";
import profileangga from "../assets/images/profile.png";
import aboutImg from "../assets/images/aboutimg.png";

const About: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-b from-amber-50 via-white to-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.img
            src={aboutImg}
            alt="Citra Wastra Illustration"
            className="hidden md:block w-full max-w-md mx-auto rounded-2xl shadow-lg"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          />

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-amber-700">
              About Citra Wastra
            </h1>
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-gray-700">
                <strong>Citra Wastra</strong> is a digital platform that leverages AI technology 
                to preserve and promote Indonesia's traditional textile heritage.
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                By combining advanced image recognition with cultural knowledge, the platform provides 
                an engaging way to identify and explore diverse wastra motifs.
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                We are committed to keeping Indonesia's cultural heritage alive and accessible 
                for future generations through modern technology.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Developer Section */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-amber-700 mb-10">
            Developer
          </h2>
          <div className="max-w-md mx-auto">
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img
                src={profileangga}
                alt="Angga Kurniawan"
                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-amber-700 mb-6"
              />
              <h3 className="font-bold text-2xl text-amber-700 mb-6">
                Angga Kurniawan
              </h3>
              <div className="flex items-center justify-center gap-4">
                <a
                  href="https://www.linkedin.com/in/anggakrnwn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:text-amber-800 transition"
                  aria-label="LinkedIn Angga Kurniawan"
                >
                  <Linkedin size={24} />
                </a>
                <a
                  href="https://github.com/anggakrnwn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:text-amber-800 transition"
                  aria-label="GitHub Angga Kurniawan"
                >
                  <Github size={24} />
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;