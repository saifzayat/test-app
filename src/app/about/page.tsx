"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaDownload,
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaGraduationCap,
  FaBriefcase,
  FaMapMarkerAlt,
  FaBolt,
  FaLaptopCode,
  FaPaintBrush,
  FaArrowRight,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import PageAnimation from "../components/PageAnimation";

interface Stat {
  label: string;
  value: string;
  href?: string;
}

interface AboutData {
  title: string;
  bio: string;
  photoUrl: string;
  stats: Stat[];
}

const getStatIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes("phone") || l.includes("mobile"))
    return <FaPhone className="text-xs" />;
  if (l.includes("whatsapp")) return <FaWhatsapp className="text-xs" />;
  if (l.includes("mail")) return <FaEnvelope className="text-xs" />;
  if (l.includes("degree") || l.includes("education") || l.includes("study"))
    return <FaGraduationCap className="text-xs" />;
  if (l.includes("experience") || l.includes("year"))
    return <FaBriefcase className="text-xs" />;
  if (l.includes("address") || l.includes("location") || l.includes("city"))
    return <FaMapMarkerAlt className="text-xs" />;
  return <FaLaptopCode className="text-xs" />;
};

const pillars = [
  {
    icon: <FaLaptopCode className="text-xl text-[#f6c14c]" />,
    title: "Modern Tech Stack",
    desc: "Crafting scalable, high-performance web applications using React, Next.js, and TypeScript.",
  },
  {
    icon: <FaBolt className="text-xl text-[#f6c14c]" />,
    title: "Smooth Interactions",
    desc: "Designing dynamic, fluid animations and responsive interfaces with Framer Motion.",
  },
  {
    icon: <FaPaintBrush className="text-xl text-[#f6c14c]" />,
    title: "Pixel-Perfect UX",
    desc: "Obsessing over typography, luxury aesthetics, and accessibility across every device screen.",
  },
];

export default function About() {
  const [about, setAbout] = useState<AboutData>({
    title: "Front-End Developer",
    bio: "I'm a React developer with a passion for creating dynamic and responsive web applications. I love turning complex problems into elegant, intuitive interfaces.",
    photoUrl: "",
    stats: [],
  });
  const [cvUrl, setCvUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((d) => {
        if (d.about) setAbout(d.about);
        if (d.cvUrl) setCvUrl(d.cvUrl);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Auto-calculate years from 2023 for the "Experience" stat
  const getStatValue = (item: Stat): string => {
    if (item.label.toLowerCase() === "experience") {
      const years = new Date().getFullYear() - 2023;
      return `${years}+ Year${years !== 1 ? "s" : ""}`;
    }
    return item.value;
  };

  return (
    <PageAnimation>
      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16 flex flex-col gap-14">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center lg:items-start gap-3"
        >
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#f6c14c44] bg-[#f6c14c0f] text-[#f6c14c] text-xs font-sans font-medium tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f6c14c] animate-pulse" />
            Discover My Story
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold gold-text text-center lg:text-left">
            About Me
          </h1>
          <p className="text-gray-400 font-sans font-light text-center lg:text-left max-w-2xl text-sm lg:text-base leading-relaxed">
            Passionate about transforming creative ideas into high-impact,
            pixel-perfect digital products with state-of-the-art web
            technologies.
          </p>
        </motion.div>

        {/* Main Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Photo Card with Glow & Luxury Accents */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative group w-full max-w-sm">
              {/* Ambient Glow behind image */}
              <div
                className="absolute -inset-2 rounded-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-700 blur-xl pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(246,193,76,0.25), rgba(252,234,187,0.1), rgba(178,137,47,0.25))",
                }}
              />

              {/* Card Container */}
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative rounded-xl overflow-visible bg-[#0d0d0d] p-3 border border-[#262626] shadow-[0_10px_35px_rgba(0,0,0,0.8)] group-hover:border-[#f6c14c66] transition-colors duration-500"
              >
                {/* Decorative Corner Accents */}
                <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-[#f6c14c] pointer-events-none" />
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-[#f6c14c] pointer-events-none" />
                <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-[#f6c14c] pointer-events-none" />
                <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-[#f6c14c] pointer-events-none" />

                {/* Photo */}
                <div className="relative rounded-lg overflow-hidden aspect-[4/5] bg-[#141414]">
                  <Image
                    src={about.photoUrl}
                    alt="Saif El-Zayat"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Availability Badge */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0a0a0a]/95 backdrop-blur-md border border-[#f6c14c55] shadow-[0_4px_25px_rgba(246,193,76,0.25)] whitespace-nowrap">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f6c14c] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f6c14c]" />
                  </span>
                  <span className="text-xs font-sans font-semibold text-gray-200 tracking-wide">
                    Available for Opportunities
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Bio & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* Title & Underline */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-sans uppercase tracking-widest text-[#f6c14c] font-semibold">
                Professional Overview
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold gold-text">
                {about.title}
              </h2>
              <div className="w-20 h-0.5 rounded-full bg-gradient-to-r from-[#f6c14c] via-[#fceabb] to-transparent mt-1" />
            </div>

            {/* Bio Narrative */}
            <p className="font-sans font-light text-gray-300 text-base lg:text-lg leading-relaxed">
              {about.bio}
            </p>

            {/* Stats Dossier Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {about.stats.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.06 }}
                  whileHover={{ y: -2 }}
                  className="group flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0e0e0e] border border-[#222] hover:border-[#f6c14c55] hover:bg-[#121212] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(246,193,76,0.08)]"
                >
                  {/* Icon Circle */}
                  <div className="w-9 h-9 rounded-lg bg-[#f6c14c14] border border-[#f6c14c33] text-[#f6c14c] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#f6c14c24] transition-all duration-300">
                    {getStatIcon(item.label)}
                  </div>

                  {/* Details */}
                  <div className="flex flex-col min-w-0 font-sans">
                    <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">
                      {item.label}
                    </span>
                    {item.href ? (
                      <Link
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-gray-200 hover:text-[#f6c14c] truncate transition-colors"
                      >
                        {getStatValue(item)}
                      </Link>
                    ) : (
                      <span className="text-sm font-semibold text-gray-200 truncate">
                        {getStatValue(item)}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {cvUrl && (
                <motion.a
                  href={cvUrl}
                  download
                  id="about-cv-download"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-full font-bold font-sans text-black text-sm tracking-wide shadow-[0_0_20px_rgba(246,193,76,0.3)] hover:shadow-[0_0_28px_rgba(246,193,76,0.5)] transition-all duration-300 cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(90deg, #f6c14c, #fceabb, #b2892f)",
                  }}
                >
                  <FaDownload className="text-xs" />
                  Download CV
                </motion.a>
              )}

              <Link href="/contact">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-sans font-semibold text-sm text-[#f6c14c] border border-[#f6c14c55] bg-[#f6c14c0a] hover:bg-[#f6c14c1a] hover:border-[#f6c14c] transition-all duration-300 cursor-pointer"
                >
                  Get In Touch
                  <FaArrowRight className="text-xs" />
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Pillars / Core Strengths Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-6"
        >
          <div className="text-center mb-8 flex flex-col items-center gap-2">
            <span className="text-xs font-sans uppercase tracking-widest text-[#f6c14c] font-semibold">
              What I Bring to the Table
            </span>
            <h3 className="text-2xl lg:text-3xl font-bold gold-text">
              Core Expertise & Standards
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 + i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative rounded-2xl bg-[#0d0d0d] p-6 border border-[#222] hover:border-[#f6c14c55] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(246,193,76,0.1)] flex flex-col gap-4 overflow-hidden"
              >
                {/* Top glow accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f6c14c44] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="w-12 h-12 rounded-xl bg-[#f6c14c14] border border-[#f6c14c33] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#f6c14c22] transition-all duration-300">
                  {p.icon}
                </div>

                <div className="flex flex-col gap-2 font-sans">
                  <h4 className="text-lg font-bold text-white group-hover:text-[#f6c14c] transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-sm text-gray-400 font-light leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageAnimation>
  );
}
