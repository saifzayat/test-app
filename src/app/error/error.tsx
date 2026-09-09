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
    console.error("[Error]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] bg-[#000] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 max-w-md w-full text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ rotate: -15, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, delay: 0.1 }}
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
          style={{
            background: "linear-gradient(135deg,#f6c14c22,#b2892f11)",
            border: "2px solid #f6c14c44",
            boxShadow: "0 0 30px rgba(246,193,76,0.15)",
            color: "#f6c14c",
          }}
        >
          <FaExclamationTriangle />
        </motion.div>

        {/* Heading */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl gold-text">Oops! Something went wrong</h2>
          <p className="text-gray-400 font-sans text-sm">
            An unexpected error occurred. You can try again or return home.
          </p>
        </div>

        {/* Error details */}
        {error.message && (
          <div
            className="w-full rounded-lg px-4 py-3 text-left bg-[#0d0d0d]"
            style={{ border: "1px solid #1e1e1e" }}
          >
            <p className="text-xs text-gray-600 uppercase tracking-wider font-sans mb-1">
              Error Details
            </p>
            <p className="text-xs text-gray-400 font-mono break-words leading-relaxed">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-600 font-mono mt-1">
                ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 flex-wrap justify-center">
          <motion.button
            onClick={reset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold font-sans text-black text-sm"
            style={{
              background: "linear-gradient(90deg,#f6c14c,#fceabb,#b2892f)",
              boxShadow: "0 0 20px rgba(246,193,76,0.25)",
            }}
          >
            <FaRedo className="text-xs" /> Try Again
          </motion.button>

          <Link href="/">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full font-sans text-sm cursor-pointer border border-[#2a2a2a] text-gray-400 hover:border-[#f6c14c55] hover:text-[#f6c14c] transition-all"
            >
              <FaHome className="text-xs" /> Back to Home
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
