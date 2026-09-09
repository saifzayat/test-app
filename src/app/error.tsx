"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaExclamationTriangle, FaRedo, FaHome } from "react-icons/fa";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] bg-[#000] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-8 max-w-md text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
          style={{
            background: "linear-gradient(135deg,#f6c14c22,#b2892f11)",
            border: "2px solid #f6c14c44",
            boxShadow: "0 0 40px rgba(246,193,76,0.15)",
            color: "#f6c14c",
          }}
        >
          <FaExclamationTriangle />
        </motion.div>

        {/* Text */}
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold gold-text">Something went wrong</h1>
          {error.message && (
            <p className="text-gray-500 font-sans text-sm leading-relaxed bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-4 py-3 break-words">
              {error.message}
            </p>
          )}
          {error.digest && (
            <p className="text-gray-600 font-sans text-xs">
              Error ID:{" "}
              <span className="text-gray-400 font-mono">{error.digest}</span>
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap justify-center">
          <motion.button
            onClick={reset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold font-sans text-black"
            style={{
              background: "linear-gradient(90deg,#f6c14c,#fceabb,#b2892f)",
              boxShadow: "0 0 20px rgba(246,193,76,0.25)",
            }}
          >
            <FaRedo className="text-sm" /> Try Again
          </motion.button>

          <Link href="/">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-sans text-sm cursor-pointer border border-[#2a2a2a] text-gray-400 hover:border-[#f6c14c55] hover:text-[#f6c14c] transition-all"
            >
              <FaHome /> Back to Home
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
