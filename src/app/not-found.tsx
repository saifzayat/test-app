"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaHome, FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-[#000] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-8 max-w-lg text-center"
      >
        {/* 404 number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative select-none"
        >
          <span
            className="text-[9rem] md:text-[12rem] font-bold leading-none"
            style={{
              background: "linear-gradient(135deg,#f6c14c 0%,#fceabb 40%,#b2892f 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "Cinzel Decorative, serif",
              filter: "drop-shadow(0 0 40px rgba(246,193,76,0.3))",
            }}
          >
            404
          </span>
          {/* Glow layer */}
          <span
            aria-hidden
            className="absolute inset-0 text-[9rem] md:text-[12rem] font-bold leading-none blur-2xl opacity-20 select-none"
            style={{
              background: "linear-gradient(135deg,#f6c14c,#b2892f)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "Cinzel Decorative, serif",
            }}
          >
            404
          </span>
        </motion.div>

        {/* Divider */}
        <div
          className="w-24 h-px"
          style={{ background: "linear-gradient(90deg,transparent,#f6c14c,transparent)" }}
        />

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-3"
        >
          <h1 className="text-2xl md:text-3xl gold-text">Page Not Found</h1>
          <p className="text-gray-400 font-sans font-light leading-relaxed max-w-sm">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex gap-3 flex-wrap justify-center"
        >
          <Link href="/">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-bold font-sans text-black cursor-pointer"
              style={{ background: "linear-gradient(90deg,#f6c14c,#fceabb,#b2892f)", boxShadow: "0 0 20px rgba(246,193,76,0.25)" }}
            >
              <FaHome /> Go Home
            </motion.span>
          </Link>

          <Link href="javascript:history.back()">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-sans text-sm cursor-pointer border border-[#2a2a2a] text-gray-400 hover:border-[#f6c14c55] hover:text-[#f6c14c] transition-all"
            >
              <FaArrowLeft /> Go Back
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
