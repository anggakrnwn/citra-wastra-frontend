import React from "react";
import { useNavigate } from "react-router-dom";

const CallToAction: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-amber-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 className="text-h2 font-bold mb-4">
          Ready to Discover Your Batik’s Story?
        </h2>
        <p className="text-body-lg mb-8 max-w-2xl mx-auto">
          Upload your batik image now and let Citra Wastra reveal its origin,
          pattern, and cultural significance.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/app")}
            className="bg-white text-amber-700 px-6 py-3 rounded-md font-semibold text-body hover:bg-gray-100 transition"
          >
            Try the App →
          </button>
          <button
            onClick={() => navigate("/app")}
            className="bg-amber-700 text-white px-6 py-3 rounded-md font-semibold text-body hover:bg-amber-800 transition"
          >
            Upload Your Batik
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
