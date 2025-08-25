import React from "react";
import kaca from "../assets/icons/kaca.svg";
import jam from "../assets/icons/jam.svg";
import bumi from "../assets/icons/bumi.svg";
import budaya from "../assets/icons/budaya.svg";

const benefitsList = [
  {
    icon: <img src={kaca} alt="kamera" className="text-amber-600 w-8 h-8" />,
    title: "Accurate Recognition",
    desc: "Advanced AI technology ensures high accuracy in identifying batik patterns and origins.",
  },
  {
    icon: <img src={jam} alt="kamera" className="text-amber-600 w-8 h-8" />,
    title: "Fast & Efficient",
    desc: "Get instant results in seconds without complicated steps or manual searching.",
  },
  {
    icon: <img src={bumi} alt="kamera" className="text-amber-600 w-8 h-8" />,
    title: "Accessible Anywhere",
    desc: "Use Citra Wastra from any device, anywhere in the world.",
  },
  {
    icon: <img src={budaya} alt="kamera" className="text-amber-600 w-8 h-8" />,
    title: "Cultural Preservation",
    desc: "Helping to preserve and promote Indonesia's cultural heritage in the digital era.",
  },
];

const BenefitsSection: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-h2 font-bold text-gray-800 mb-4">
          Why Choose <span className="text-amber-700">Citra Wastra?</span>
        </h2>
        <p className="text-body-lg text-gray-600 max-w-2xl mx-auto mb-12">
          Discover the key reasons why users trust Citra Wastra to explore and
          preserve the beauty of Indonesian batik.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefitsList.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-h3 md:text-xl font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-body text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
