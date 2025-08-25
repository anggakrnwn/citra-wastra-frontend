import React from "react";
import { motion } from "framer-motion";
import profileangga from "../assets/images/profile.png";
import { Github, Linkedin  } from "lucide-react";

const blobAnimationStyles = `
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
`;

const BlobBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
  </div>
);

const AboutText = () => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="space-y-6"
  >
    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
      <span className="text-amber-700">CitraWastra</span>
    </h2>
    <div className="w-24 h-1 bg-amber-700 mb-6"></div>
    <p className="text-gray-700 text-lg leading-relaxed">
      <span className="font-semibold text-amber-700">CitraWastra</span> is a digital 
      platform that leverages AI to preserve and promote Indonesia's traditional 
      textile heritage. By combining advanced image recognition with cultural 
      knowledge, the platform provides an engaging way to identify and explore 
      diverse wastra motifs.
    </p>
    <p className="text-gray-700 text-lg leading-relaxed">
      Our mission is to make Indonesia's textile traditions more accessible, 
      recognizable, and celebrated both locally and globally. Through modern 
      technology, we aim to safeguard cultural heritage while offering interactive 
      learning experiences for everyone.
    </p>
  </motion.div>
);

const TeamProfile = () => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="flex flex-col items-center"
  >
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="w-36 h-36 mb-4 relative"
    >
      <img
        src={profileangga}
        alt="Angga Kurniawan"
        className="w-full h-full rounded-full object-cover border-4 border-amber-700 shadow-lg"
      />
    </motion.div>

    <h4 className="font-bold text-xl text-gray-900 mb-1">Angga Kurniawan</h4>
    <p className="text-amber-700 font-medium mb-4">Fullstack Developer</p>

    {/* Social Icons */}
    <div className="flex gap-4">
      <a
        href="https://github.com/anggakrnwn"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-700 hover:text-amber-700 transition-colors"
      >
        <Github size={24} />
      </a>
      <a
        href="https://www.linkedin.com/in/anggakrnwn/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-700 hover:text-amber-700 transition-colors"
      >
        <Linkedin   size={24} />
      </a>
    </div>
  </motion.div>
);

const About: React.FC = () => {
  return (
    <section className="relative bg-white overflow-hidden py-16">
      <BlobBackground />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        <AboutText />
        <TeamProfile />
      </div>

      <style>{blobAnimationStyles}</style>
    </section>
  );
};

export default About;