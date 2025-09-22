import React from "react";
import { Link, useNavigate  } from "react-router-dom";
import { useWastra } from "../context/WastraContext";

const Footer: React.FC = () => {
  const { user } = useWastra();
  const navigate = useNavigate();

  const handleLaunchApp = () => {
    if (user) {
      navigate("/detection-page"); 
    } else {
      navigate("/login"); 
    }
  };
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-h3 font-bold text-white mb-4">Citra Wastra</h3>
          <p className="text-sm leading-relaxed max-w-sm">
            Preserving Indonesia’s batik heritage through AI-powered recognition
            and cultural storytelling.
          </p>
        </div>

        <div>
          <h4 className="text-body-lg font-semibold text-white mb-4">
            Navigation
          </h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="hover:text-white transition"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition">
                About
              </Link>
            </li>
            <li>
              <button onClick={handleLaunchApp} className="hover:text-white transition">
                Try the App
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-body-lg font-semibold text-white mb-4">
            Contact Us
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              Email:{" "}
              <a
                href="mailto:info@citrawastra.com"
                className="hover:text-white transition"
              >
                info@citrawastra.com
              </a>
            </li>
            <li>
              Phone:{" "}
              <a
                href="tel:+621234567890"
                className="hover:text-white transition"
              >
                +62 812-2724-5907
              </a>
            </li>
            <li>Location: Purwokerto, Indonesia</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Citra Wastra. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
