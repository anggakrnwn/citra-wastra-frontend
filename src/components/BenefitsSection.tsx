import React from "react";
import { motion } from "framer-motion";
import kaca from "../assets/icons/kaca.svg";
import jam from "../assets/icons/jam.svg";
import bumi from "../assets/icons/bumi.svg";
import budaya from "../assets/icons/budaya.svg";

const benefitsList = [
  {
    icon: kaca,
    title: "Accurate Recognition",
    desc: "Advanced AI technology ensures high accuracy in identifying batik patterns and origins.",
  },
  {
    icon: jam,
    title: "Fast & Efficient",
    desc: "Get instant results in seconds without complicated steps.",
  },
  {
    icon: bumi,
    title: "Accessible Anywhere",
    desc: "Use Citra Wastra from any device, anywhere in the world.",
  },
  {
    icon: budaya,
    title: "Cultural Preservation",
    desc: "Helping to preserve Indonesia's cultural heritage in the digital era.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const BenefitsSection: React.FC = () => {
  return (
    <section className="bg-white dark:bg-gray-900 py-16 md:py-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Citra Wastra?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover why users trust Citra Wastra to explore and preserve Indonesian batik.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {benefitsList.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-600 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                  <img src={item.icon} alt="" className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
