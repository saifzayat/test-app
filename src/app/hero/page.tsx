"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaTiktok,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaDownload,
} from "react-icons/fa";
import Image from "next/image";
import Me from "../../assets/logoNoBG.png";
import PageAnimation from "../components/PageAnimation";
import Link from "next/link";

const iconMap: Record<string, React.ReactElement> = {
  FaFacebook: <FaFacebook />,
  FaTiktok: <FaTiktok />,
  FaLinkedin: <FaLinkedin />,
  FaGithub: <FaGithub />,
  FaInstagram: <FaInstagram />,
};

interface Social {
  name: string;
  icon: string;
  href: string;
}

interface HeroData {
  name: string;
  title: string;
  tagline: string;
  socials: Social[];
}

export default function Hero() {
  const [hero, setHero] = useState<HeroData>({
    name: "Saif Shireef El-Zayat",
    title: "React Developer",
    tagline: "Building modern, responsive & dynamic web experiences",
    socials: [],
  });
  const [cvUrl, setCvUrl] = useState("");

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((d) => {
        if (d.hero) setHero(d.hero);
        if (d.cvUrl) setCvUrl(d.cvUrl);
      })
      .catch(() => {});
  }, []);

  return (
    <PageAnimation>
      {/* Background blur image */}
      <div
        className="absolute inset-0 bg-contain bg-right"
        style={{
          backgroundImage: `url(${Me.src})`,
          backgroundRepeat: "no-repeat",
          filter: "blur(10px)",
        }}
      />

      {/* Foreground */}
      <div className="relative z-10 flex flex-col justify-center lg:items-start p-10 gap-8 md:items-center md:h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col gap-4"
        >
          <h1 className="lg:text-5xl sm:text-3xl text-2xl gold-text leading-tight">
            {hero.name}
          </h1>
          <p className="text-xl md:text-2xl gold-text opacity-80">
            {hero.title}
          </p>
          <p className="text-sm md:text-base text-gray-300 max-w-md font-sans font-light">
            {hero.tagline}
          </p>
        </motion.div>

        {/* CV Download */}
        {cvUrl && (
          <motion.a
            href={cvUrl}
            download
            id="hero-cv-download"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 self-start px-6 py-3 rounded-full font-bold font-sans text-black"
            style={{
              background: "linear-gradient(90deg,#f6c14c,#fceabb,#b2892f)",
              boxShadow: "0 0 20px rgba(246,193,76,0.25)",
            }}
          >
            <FaDownload />
            Download CV
          </motion.a>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="flex gap-6 items-center"
        >
          {hero.socials.map((social) => (
            <Link
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              title={social.name}
              className="text-[#f6c14c] text-3xl hover:text-[#fff8dc] hover:scale-125 transition-all duration-300 cursor-pointer drop-shadow-[0_0_8px_rgba(246,193,76,0.6)]"
            >
              {iconMap[social.icon] ?? null}
            </Link>
          ))}
        </motion.div>
      </div>
    </PageAnimation>
  );
}
