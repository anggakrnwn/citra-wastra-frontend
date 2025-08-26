import React from "react";
import { motion } from "framer-motion";
import { Linkedin, Github } from "lucide-react";
import profileangga from "../assets/images/profile.png";
import profilerifqi from "../assets/images/rifqi.jpg";
import profileyovis from "../assets/images/yovis.jpg";
import aboutImg from "../assets/images/aboutimg.png";

interface TeamMember {
  name: string;
  role: string;
  img?: string;
  linkedin: string;
  github: string; 
}

const About: React.FC = () => {
  const team: TeamMember[] = [
    {
      name: "Angga Kurniawan",
      role: "Fullstack Developer",
      img: profileangga,
      linkedin: "https://www.linkedin.com/in/anggakrnwn",
      github: "https://github.com/anggakrnwn",
    },
    {
      name: "Rifqi Falih Ramadhan",
      role: "Machine Learning Engineer",
      img: profilerifqi,
      linkedin: "https://www.linkedin.com/in/rifqifalihramadhan",
      github: "https://github.com/rifqirama", 
    },
    {
      name: "Yovis Yudo Karsodo",
      role: "UI/UX Designer",
      img: profileyovis,
      linkedin: "https://www.linkedin.com/in/yovisyudokarsodo/",
      github: "https://github.com/Yovisyudo", 
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-amber-100 via-white to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.img
            src={aboutImg}
            alt="Ilustrasi Citra Wastra"
            className="hidden md:block w-full max-w-md mx-auto"
            initial={{ x: -80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          />

          <motion.div
            initial={{ x: 80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h1 className="text-4xl font-extrabold mb-4 text-amber-700">
              Citra Wastra
            </h1>
            <p className="text-lg leading-relaxed text-gray-700">
              <strong>Citra Wastra </strong>
              is a digital platform that leverages AI to preserve and promote
              Indonesia's traditional textile heritage. By combining advanced
              image recognition with cultural knowledge, the platform provides
              an engaging way to identify and explore diverse wastra motifs.
            </p>
          </motion.div>
        </div>

        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-amber-700 mb-4">
            Developer Team
          </h2>
          <p className="text-gray-600 mb-10">
            We collaborate to preserve culture through technology
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
              >
                <img
                  src={
                    member.img ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      member.name
                    )}&background=fcd34d&color=78350f`
                  }
                  alt={member.name}
                  className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-amber-700"
                />

                <div className="flex items-center justify-center gap-2 mt-4">
                  <h3 className="font-bold text-lg text-amber-700">
                    {member.name}
                  </h3>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 hover:text-amber-800 transition"
                    aria-label={`LinkedIn ${member.name}`}
                  >
                    <Linkedin size={20} />
                  </a>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 hover:text-amber-800 transition"
                    aria-label={`GitHub ${member.name}`}
                  >
                    <Github size={20} />
                  </a>
                </div>

                <p className="text-sm text-gray-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;