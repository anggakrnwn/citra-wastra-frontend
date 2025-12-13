import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import hero1 from "../assets/images/hero1.jpeg";
import hero2 from "../assets/images/hero2.jpeg";
import { useWastra } from "../context/WastraContext"; 

const images = [
  { src: hero1, alt: "Batik Pattern 1" },
  { src: hero2, alt: "Batik Pattern 2" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useWastra();

  const handleLaunchApp = () => {
    if (user) {
      navigate("/detection-page"); 
    } else {
      navigate("/login"); 
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-24 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              Preserving Tradition with{" "}
              <span className="text-amber-600 dark:text-amber-500">Citra Wastra</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg"
            >
              Discover the origin, pattern, and cultural meaning of Indonesian batik 
              through advanced AI technology.
            </motion.p>

            <motion.div variants={itemVariants} className="pt-2">
              <button
                onClick={handleLaunchApp}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold text-base md:text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Get Started
              </button>
            </motion.div>
          </motion.div>

          {/* Images */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col gap-4 h-full justify-between"
          >
            {images.map((img, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group flex-1"
              >
                <div className="relative w-full h-full min-h-[180px] max-h-[200px]">
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
