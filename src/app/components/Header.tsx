"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaCog } from "react-icons/fa";
import img from "../../assets/logoNoBG.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/experience", label: "Experience" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className="relative bg-[#000] px-4 py-2 z-50 border-b-2 shadow-[0_6px_12px_-1px_rgba(212,167,61,0.4)]"
      style={{
        borderColor: "transparent",
        borderImage: "linear-gradient(90deg,#f6c14c,#fceabb,#b2892f)",
        borderImageSlice: 1,
      }}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center w-full relative z-50">
        {/* Logo */}
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
        <ul className="hidden md:flex gap-6 items-center pr-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`gold-text-hover ${pathname === link.href ? "gold-text-hovered" : ""}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {/* Admin icon */}
          <li>
            <Link
              href="/admin"
              title="Admin Editor"
              className={`gold-text-hover flex items-center ${pathname === "/admin" ? "gold-text-hovered" : ""}`}
            >
              <FaCog className="text-xl" />
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white gold-text text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <ul className="flex flex-col gap-4 bg-[#000] px-4 py-4 absolute top-full left-0 w-full z-40 animate-menuOpen origin-top border-t border-[#1e1e1e]">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`gold-text-hover ${pathname === link.href ? "gold-text-hovered" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/admin"
              className={`gold-text-hover flex items-center gap-2 ${pathname === "/admin" ? "gold-text-hovered" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <FaCog /> Admin Editor
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
