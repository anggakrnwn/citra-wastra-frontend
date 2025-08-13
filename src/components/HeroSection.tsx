import React from "react";
import { useNavigate } from "react-router-dom";
import hero1 from "../assets/images/hero1.jpeg";
import hero2 from "../assets/images/hero2.jpeg";
import hero3 from "../assets/images/hero3.jpeg";
import hero4 from "../assets/images/hero4.jpeg";
import star1 from "../assets/icons/starwastra1.png";
import star2 from "../assets/icons/starwastra2.png";

interface ImageItem {
  src: string;
  alt: string;
}

const images: ImageItem[] = [
  { src: hero1, alt: "Batik Pattern 1" },
  { src: hero2, alt: "Batik Pattern 2" },
  { src: hero3, alt: "Batik Pattern 3" },
  { src: hero4, alt: "Batik Pattern 4" },
];

const delayClasses = ["delay-0", "delay-200", "delay-400", "delay-600"];

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-white flex items-center justify-center pt-8 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex space-x-2 mb-6">
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i} className="w-4 h-4 rounded-full bg-amber-600" />
            ))}
          </div>

          <div className="animate-slide-in-left">
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
              Preserving Tradition with{" "}
              <span className="text-amber-700 underline">Citra Wastra</span>
            </h1>

            <p className="mt-6 max-w-md text-gray-600 text-lg leading-relaxed">
              <strong>Citra Wastra</strong> uses advanced machine learning to
              identify the origin and pattern of traditional Indonesian batik,
              making cultural heritage more accessible, recognizable, and
              preserved in the digital era.
            </p>
          </div>

          <button
            onClick={() => navigate("/app")}
            className="mt-8 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-semibold transition"
            aria-label="Launch Citra Wastra App"
          >
            Launch App →
          </button>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className={`relative opacity-0 animate-slide-in-up ${delayClasses[i]}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="rounded-lg object-cover w-full h-40 md:h-48 lg:h-56"
              />

              {i === 0 && (
                <>
                  <img
                    src={star1}
                    alt=""
                    aria-hidden="true"
                    className="absolute top-2 left-2 w-6 h-6 animate-float select-none pointer-events-none"
                  />
                  <img
                    src={star2}
                    alt=""
                    aria-hidden="true"
                    className="absolute top-10 left-8 w-5 h-5 animate-float delay-200 select-none pointer-events-none"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-amber-600 rounded-full animate-bounce"></div>
    </section>
  );
};

export default HeroSection;
