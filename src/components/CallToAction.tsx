import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useWastra } from "../context/WastraContext";

const statsCards = [
  {
    title: "Accuracy",
    value: "80%",
    subtitle: "detection accuracy",
  },
  {
    title: "Speed",
    value: "< 3s",
    subtitle: "per detection",
  },
  {
    title: "Target",
    value: "99%",
    subtitle: "accuracy goal",
  },
  {
    title: "This Month",
    value: "50+",
    subtitle: "model predictions",
  },
];


interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  delay: number;
  floatDelay: number;
  direction: 'left' | 'right';
  rotate: number;
  xOffset: number;
  yOffset: number;
  zIndex: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  delay, 
  floatDelay, 
  direction, 
  rotate, 
  xOffset, 
  yOffset,
  zIndex 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        x: xOffset,
        y: yOffset,
        rotate: rotate,
        transition: { duration: 0.5, delay }
      }).then(() => {
        controls.start({
          y: [yOffset, yOffset - 10, yOffset],
          transition: {
            duration: 3,
            repeat: Infinity,
            delay: floatDelay,
            ease: "easeInOut",
          }
        });
      });
    }
  }, [isInView, controls, delay, floatDelay, rotate, xOffset, yOffset]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: direction === 'left' ? -30 + xOffset : 30 + xOffset, y: 20 + yOffset, rotate: 0 }}
      animate={controls}
      style={{ zIndex }}
      className={`absolute bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 shadow-lg w-40 ${zIndex === 1 ? 'blur-[1px]' : ''}`}
    >
      <div className="text-amber-700 dark:text-amber-500">
        <div className="text-xs font-semibold mb-1">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</div>
      </div>
    </motion.div>
  );
};

const CallToAction: React.FC = () => {
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
    <section className="relative bg-amber-600 dark:bg-amber-700 py-16 md:py-24 overflow-hidden transition-colors">
      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Ready to Discover Your Batik's Story?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-95">
            Upload your batik image and let Citra Wastra reveal its origin, 
            pattern, and cultural significance in seconds.
          </p>
          
          {/* Container untuk button dan cards yang sejajar */}
          <div className="relative flex items-center justify-center">
            {/* Floating Stats Cards */}
            <div className="absolute inset-0 pointer-events-none hidden lg:flex items-center justify-between w-full">
              {/* Cards di sisi kiri - 2 cards bertumpuk */}
              <div className="absolute left-0" style={{ width: '170px', height: '200px' }}>
                <StatCard
                  title={statsCards[0].title}
                  value={statsCards[0].value}
                  subtitle={statsCards[0].subtitle}
                  delay={0.3}
                  floatDelay={0.5}
                  direction="left"
                  rotate={-12}
                  xOffset={15}
                  yOffset={25}
                  zIndex={2}
                />
                <StatCard
                  title={statsCards[1].title}
                  value={statsCards[1].value}
                  subtitle={statsCards[1].subtitle}
                  delay={0.5}
                  floatDelay={0.8}
                  direction="left"
                  rotate={-8}
                  xOffset={0}
                  yOffset={0}
                  zIndex={1}
                />
              </div>

              {/* Cards di sisi kanan - 2 cards bertumpuk */}
              <div className="absolute right-0" style={{ width: '170px', height: '200px' }}>
                <StatCard
                  title={statsCards[2].title}
                  value={statsCards[2].value}
                  subtitle={statsCards[2].subtitle}
                  delay={0.4}
                  floatDelay={0.3}
                  direction="right"
                  rotate={12}
                  xOffset={-15}
                  yOffset={25}
                  zIndex={2}
                />
                <StatCard
                  title={statsCards[3].title}
                  value={statsCards[3].value}
                  subtitle={statsCards[3].subtitle}
                  delay={0.6}
                  floatDelay={1}
                  direction="right"
                  rotate={8}
                  xOffset={0}
                  yOffset={0}
                  zIndex={1}
                />
              </div>
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLaunchApp}
              className="relative z-10 bg-white text-amber-700 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg"
            >
              Start Detecting
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
