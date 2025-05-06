"use client";
import { useState } from "react";
import { usePathname } from "next/navigation"; // Import usePathname hook
import Image from "next/image";
import Link from "next/link";
import img from "../../assets/logoNoBG.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); // Get the current path

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className="relative bg-[#000] px-4 py-2 z-50 border-b-2 shadow-[0_6px_12px_-1px_rgba(212,167,61,0.4)]"
      style={{
        borderColor: "transparent",
        borderImage: "linear-gradient(90deg, #f6c14c, #fceabb, #b2892f)",
        borderImageSlice: 1,
      }}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center w-full relative z-50">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image
              src={img}
              alt="logo"
              width={60}
              height={60}
              priority
              style={{ objectFit: "cover" }}
            />
          </Link>
          <h1 className="text-2xl gold-text">SZ Web</h1>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 items-center pr-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`gold-text-hover ${
                  pathname === link.href ? "gold-text-hovered" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white gold-text text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>
      {/* Mobile Menu - Render Only When Open */}
      {isMenuOpen && (
        <ul className="flex flex-col gap-4 bg-[#000] px-4 py-4 absolute top-full left-0 w-full z-40 animate-menuOpen origin-top">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`gold-text-hover ${
                  pathname === link.href ? "gold-text-hovered" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
