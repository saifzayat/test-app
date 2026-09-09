"use client";
import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import PageAnimation from "../components/PageAnimation";
import Image from "next/image";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  image?: string;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: "easeOut" as const },
  }),
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((d) => {
        if (d.projects) setProjects(d.projects);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <PageAnimation>
      <div className="flex flex-col p-8 lg:p-14 gap-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-3"
        >
          <h1 className="text-4xl gold-text text-center lg:text-left">
            Projects
          </h1>
          <p className="text-gray-400 font-sans font-light text-center lg:text-left max-w-lg">
            A showcase of the things I&apos;ve built — from side projects to
            client work.
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-72 rounded-lg bg-[#111] animate-pulse"
                style={{ border: "1px solid #222" }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative flex flex-col rounded-lg overflow-hidden bg-[#0d0d0d] transition-all duration-300"
                style={{
                  border: "1px solid #2a2a2a",
                  boxShadow: "0 0 0 0 rgba(246,193,76,0)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 25px rgba(246,193,76,0.15)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#f6c14c55";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 0 0 rgba(246,193,76,0)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#2a2a2a";
                }}
              >
                {/* Image / Gradient placeholder */}
                <div className="relative w-full h-44 overflow-hidden">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg,#1a1200 0%,#2d1f00 40%,#0a0a0a 100%)",
                      }}
                    >
                      <span
                        className="text-6xl font-bold select-none"
                        style={{
                          background:
                            "linear-gradient(90deg,#f6c14c33,#b2892f33)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          fontFamily: "Cinzel Decorative, serif",
                        }}
                      >
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Overlay links */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-5">
                    {project.liveUrl && project.liveUrl !== "#" && (
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-sans font-semibold text-black transition-all"
                        style={{
                          background: "linear-gradient(90deg,#f6c14c,#b2892f)",
                        }}
                      >
                        <FaExternalLinkAlt /> Live
                      </Link>
                    )}
                    {project.githubUrl && (
                      <Link
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-sans font-semibold text-[#f6c14c] border border-[#f6c14c] hover:bg-[#f6c14c10] transition-all"
                      >
                        <FaGithub /> Code
                      </Link>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3 p-5 flex-1">
                  <h2
                    className="text-lg font-bold"
                    style={{
                      background: "linear-gradient(90deg,#f6c14c,#fceabb)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontFamily: "Cinzel Decorative, serif",
                    }}
                  >
                    {project.title}
                  </h2>
                  <p className="text-gray-400 font-sans text-sm leading-relaxed flex-1">
                    {project.description}
                  </p>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.tags.map((tag, tagIdx) => (
                      <span
                        key={`${tag}-${tagIdx}`}
                        className="px-2 py-0.5 rounded text-xs font-sans text-[#f6c14c] border"
                        style={{
                          borderColor: "#f6c14c44",
                          background: "#f6c14c0d",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && projects.length === 0 && (
          <p className="text-gray-500 font-sans text-center py-20">
            No projects yet. Add some in the{" "}
            <Link href="/admin" className="text-[#f6c14c] underline">
              admin editor
            </Link>
            .
          </p>
        )}
      </div>
    </PageAnimation>
  );
}
