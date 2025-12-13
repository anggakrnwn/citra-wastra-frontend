import React from "react";
import { useNavigate } from "react-router-dom";
import accuracy from "../assets/icons/accuracy.png";
import motif from "../assets/icons/motif.png";
import report from "../assets/icons/report.png";
import global from "../assets/icons/global.png";
import batik1 from "../assets/images/batik-preview1.jpeg";
import batik2 from "../assets/images/batik-preview2.jpeg";
import batik3 from "../assets/images/batik-preview3.jpeg";
import batik4 from "../assets/images/batik-preview4.jpeg";

const features = [
  {
    icon: accuracy,
    title: "Trusted Accuracy",
    description:
      "Our AI model provides reliable pattern recognition with industry-leading precision.",
  },
  {
    icon: motif,
    title: "Comprehensive Pattern Library",
    description:
      "Identify batik, tenun, songket, and other traditional textile patterns in one platform.",
  },
  {
    icon: report,
    title: "AI-Powered Identification",
    description:
      "Identify and explore traditional textile patterns using AI technology.",
  },
  {
    icon: global,
    title: "Cross-Platform Access",
    description:
      "Available on all devices with seamless cloud synchronization.",
  },
];

const delayClasses = ["delay-0", "delay-200", "delay-400", "delay-600"];

const DetectionIntro: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = false;

  const handleLetsDetect = () => {
    if (!isLoggedIn) navigate("/login");
    else navigate("/deteksi-motif");
  };

  return (
    <section className="relative bg-white dark:bg-gray-900 py-10 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      
        <div className="animate-slide-in-left">
          <h1 className="text-display font-extrabold text-gray-900 dark:text-white leading-tight">
            Preserving Cultural Heritage Through Patterns
          </h1>
          <p className="mt-6 max-w-md text-body-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Our intelligent system helps researchers, artisans, and enthusiasts
            identify and understand the rich history behind Indonesian textile
            patterns, ensuring our cultural heritage thrives.
          </p>
          <button
            onClick={handleLetsDetect}
            className="mt-8 bg-amber-600 dark:bg-amber-700 hover:bg-amber-700 dark:hover:bg-amber-600 text-white px-6 py-3 rounded-md font-semibold transition"
          >
            Let's Detect →
          </button>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          {[batik1, batik4, batik3, batik2].map((src, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-xl shadow-md opacity-0 animate-slide-in-up ${delayClasses[i]}`}
            >
              <img
                src={src}
                alt={`Batik pattern ${i + 1}`}
                className="w-full h-40 md:h-48 lg:h-56 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {features.map((f, index) => (
          <div
            key={index}
            className="text-center p-6 hover:shadow-lg transition-shadow rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <img src={f.icon} alt={f.title} className="w-8 h-8 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-3">
              {f.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DetectionIntro;
