import React from "react";
import { motion } from "framer-motion";
import { Linkedin, Mail, Github } from "lucide-react";
import profileangga from "../assets/images/profile.png";

const About: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center py-16 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About <span className="text-amber-600">CitraWastra</span>
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </motion.div>

        {/* Content */}
        <div className="space-y-10 text-gray-700 text-lg leading-relaxed">
          <motion.p
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center"
          >
            <span className="font-semibold text-amber-600">CitraWastra</span>{" "}
            is a digital platform that leverages AI to preserve and promote
            Indonesia's traditional textile heritage. By combining advanced
            image recognition with cultural knowledge, the platform provides
            an engaging way to identify and explore diverse wastra motifs.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-center"
          >
            Our mission is to make Indonesia's textile traditions more
            accessible, recognizable, and celebrated — both locally and globally.
            Through modern technology, we aim to safeguard cultural heritage
            while offering interactive learning experiences for everyone.
          </motion.p>

          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="border-l-4 border-amber-500 pl-6 py-4 bg-amber-50 rounded-r-lg italic text-gray-800 text-lg text-center mx-auto max-w-2xl"
          >
            "We want to preserve heritage, empower communities, and share
            Indonesia's story through textiles."
          </motion.blockquote>

          {/* Team - Simplified without card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">The Team</h3>
            <p className="text-gray-600 mb-8">Passionate people behind CitraWastra</p>
            
            {/* Foto Profil */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative mb-6 mx-auto w-36 h-36"
            >
              <img
                src={profileangga}
                alt="Angga Kurniawan"
                className="w-full h-full rounded-full object-cover border-4 border-amber-400 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </motion.div>
            
            {/* Nama dan Posisi */}
            <h4 className="font-bold text-xl text-gray-900 mb-1">Angga Kurniawan</h4>
            <p className="text-amber-600 font-medium mb-4">Fullstack Developer</p>
            
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Responsible for backend, frontend, API integration, and deployment.
            </p>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-4">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://www.linkedin.com/in/anggakrnwn"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-100 text-amber-700 p-2 rounded-full hover:bg-amber-200 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={18} />
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="mailto:anggakrnwn@example.com"
                className="bg-amber-100 text-amber-700 p-2 rounded-full hover:bg-amber-200 transition-colors"
                aria-label="Send Email"
              >
                <Mail size={18} />
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://github.com/anggakrnwn"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-100 text-amber-700 p-2 rounded-full hover:bg-amber-200 transition-colors"
                aria-label="GitHub Profile"
              >
                <Github size={18} />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default About;