"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageAnimation from "../components/PageAnimation";
import Link from "next/link";

interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((d) => {
        if (d.experience) setExperiences(d.experience);
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
            Experience
          </h1>
          <p className="text-gray-400 font-sans font-light text-center lg:text-left max-w-lg">
            My professional journey — the roles, companies, and skills that
            shaped me.
          </p>
        </motion.div>

        {/* Timeline */}
        {loading ? (
          <div className="flex flex-col gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 rounded-lg bg-[#111] animate-pulse"
                style={{ border: "1px solid #222" }}
              />
            ))}
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-px"
              style={{
                background:
                  "linear-gradient(180deg,#f6c14c 0%,#b2892f 50%,transparent 100%)",
              }}
            />

            <div className="flex flex-col gap-10">
              {experiences.map((exp, i) => {
                const isRight = i % 2 === 0;
                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: isRight ? 40 : -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                    className={`relative flex items-start gap-6 md:gap-0 ${
                      isRight ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Mobile/desktop dot */}
                    <div
                      className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full z-10 mt-1 shrink-0 ring-2 ring-black"
                      style={{
                        background: "linear-gradient(135deg,#f6c14c,#b2892f)",
                      }}
                    />

                    {/* Card — offset to right on mobile, alternating on desktop */}
                    <div
                      className={`ml-12 md:ml-0 w-full md:w-5/12 ${
                        isRight ? "md:mr-auto md:pr-10" : "md:ml-auto md:pl-10"
                      }`}
                    >
                      <div
                        className="rounded-lg p-6 bg-[#0d0d0d] flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
                        style={{
                          border: "1px solid #2a2a2a",
                          boxShadow: "0 0 20px rgba(246,193,76,0.05)",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.boxShadow =
                            "0 0 25px rgba(246,193,76,0.15)";
                          (e.currentTarget as HTMLElement).style.borderColor =
                            "#f6c14c55";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.boxShadow =
                            "0 0 20px rgba(246,193,76,0.05)";
                          (e.currentTarget as HTMLElement).style.borderColor =
                            "#2a2a2a";
                        }}
                      >
                        {/* Period badge */}
                        <span
                          className="self-start px-3 py-1 rounded-full text-xs font-sans font-semibold"
                          style={{
                            background:
                              "linear-gradient(90deg,#f6c14c22,#b2892f22)",
                            border: "1px solid #f6c14c44",
                            color: "#f6c14c",
                          }}
                        >
                          {exp.period}
                        </span>

                        <div>
                          <h2
                            className="text-lg font-bold"
                            style={{
                              background:
                                "linear-gradient(90deg,#f6c14c,#fceabb)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              fontFamily: "Cinzel Decorative, serif",
                            }}
                          >
                            {exp.role}
                          </h2>
                          <p className="text-[#b2892f] font-sans text-sm mt-0.5">
                            @ {exp.company}
                          </p>
                        </div>

                        <p className="text-gray-400 font-sans text-sm leading-relaxed">
                          {exp.description}
                        </p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill, skillIdx) => (
                            <span
                              key={`${skill}-${skillIdx}`}
                              className="px-2 py-0.5 rounded text-xs font-sans"
                              style={{
                                border: "1px solid #f6c14c44",
                                background: "#f6c14c0d",
                                color: "#f6c14c",
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && experiences.length === 0 && (
          <p className="text-gray-500 font-sans text-center py-20">
            No experience entries yet. Add some in the{" "}
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
