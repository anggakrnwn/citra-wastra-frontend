import React, { useState } from "react";
import flowImage from "../assets/images/wastraproses.png";
import kamera from "../assets/icons/camera.svg";
import insight from "../assets/icons/insight.svg";
import lokasi from "../assets/icons/lokasi.svg";
import catatan from "../assets/icons/catatan.svg";

const prosesList = [
  {
    title: "Capture or Upload",
    desc: "Take a photo of the batik using your camera or upload one from your device’s gallery.",
    icon: <img src={kamera} alt="kamera" className="text-amber-600 w-8 h-8" />,
  },
  {
    title: "Pattern Recognition",
    desc: "The AI analyzes the batik’s motifs using machine learning to identify shapes, colors, and unique characteristics.",
    icon: <img src={insight} alt="insight" className="text-amber-600 w-8 h-8" />,
  },
  {
    title: "Origin Identification",
    desc: "The system matches the analysis results with its database to determine the batik’s region of origin and motif type.",
    icon: <img src={lokasi} alt="lokasi" className="text-amber-600 w-8 h-8" />,
  },
  {
    title: "Cultural Insight",
    desc: "Receive detailed information about the history, philosophy, and cultural meaning behind the detected batik motif.",
    icon: <img src={catatan} alt="budaya" className="text-amber-600 w-8 h-8" />,
  },
];

const WastraProses: React.FC = () => {
  const [active, setActive] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setActive(active === index ? null : index);
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-h2 font-bold text-gray-800 mb-6">
            Uncover the Story Behind Every Batik
          </h2>
          <p className="text-body-lg text-gray-600 mb-8">
            With Citra Wastra, every piece of batik is more than just a pattern.
            Our technology helps you recognize its motifs, trace its regional
            origin, and reveal the cultural meaning woven into its design all in
            just seconds.
          </p>

          <div className="space-y-4">
            {prosesList.map((item, i) => {
              const isActive = active === i;
              return (
                <div key={i} className="border border-gray-200 rounded-lg">
                  <button
                    className="w-full flex justify-between items-center p-4 cursor-pointer hover:border-amber-600 transition"
                    onClick={() => toggleItem(i)}
                    aria-expanded={isActive}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <h3 className="font-semibold text-subheading text-gray-800">
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-lg">{isActive ? "−" : "+"}</span>
                  </button>
                  {isActive && (
                    <p className="px-4 pb-4 text-body text-gray-600">{item.desc}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src={flowImage}
            alt="Citra Wastra Process Flow"
            className="max-w-xs md:max-w-md"
          />
        </div>
      </div>
    </section>
  );
};

export default WastraProses;
