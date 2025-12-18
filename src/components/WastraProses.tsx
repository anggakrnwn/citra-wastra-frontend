import React from "react";
import { motion } from "framer-motion";
import flowImage from "../assets/images/wastraproses.png";
import kamera from "../assets/icons/camera.svg";
import insight from "../assets/icons/insight.svg";
import lokasi from "../assets/icons/lokasi.svg";
import catatan from "../assets/icons/catatan.svg";

const prosesList = [
  {
    title: "Capture or Upload",
    desc: "Take a photo of the batik using your camera or upload one from your device's gallery.",
    icon: kamera,
    label: "kamera",
  },
  {
    title: "Pattern Recognition",
    desc: "The AI analyzes the batik's motifs using machine learning to identify shapes, colors, and unique characteristics.",
    icon: insight,
    label: "insight",
  },
  {
    title: "Origin Identification",
    desc: "The system matches the analysis results with its database to determine the batik's region of origin and motif type.",
    icon: lokasi,
    label: "lokasi",
  },
  {
    title: "Cultural Insight",
    desc: "Receive detailed information about the history, philosophy, and cultural meaning behind the detected batik motif.",
    icon: catatan,
    label: "budaya",
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
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const WastraProses: React.FC = () => {
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            How It Works
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the origin, pattern, and cultural meaning of your batik in seconds
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Steps Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="space-y-6"
          >
            {prosesList.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex gap-5 bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-600 hover:shadow-md transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center shadow-sm">
                    <img 
                      src={item.icon} 
                      alt={item.label} 
                      className="w-7 h-7"
                    />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center"
          >
            <img
              src={flowImage}
              alt="Citra Wastra Process Flow"
              className="w-full max-w-md rounded-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WastraProses;
