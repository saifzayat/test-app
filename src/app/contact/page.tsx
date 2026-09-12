"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaMapMarkerAlt,
} from "react-icons/fa";
import PageAnimation from "../components/PageAnimation";
import Link from "next/link";

const POPULAR_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "yahoo.com",
  "icloud.com",
  "hotmail.com",
];

interface ContactData {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
}

const inputClass =
  "w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white font-sans text-sm placeholder-gray-600 outline-none transition-all duration-200 focus:border-[#f6c14c66] focus:shadow-[0_0_12px_rgba(246,193,76,0.15)]";

export default function Contact() {
  const [contact, setContact] = useState<ContactData>({
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [fallbackMailto, setFallbackMailto] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [selectedDomainIdx, setSelectedDomainIdx] = useState(-1);

  // Parse email for @ domain auto-suggestions
  const atIndex = form.email.indexOf("@");
  const hasAt = atIndex !== -1 && atIndex === form.email.lastIndexOf("@");
  const username = hasAt ? form.email.slice(0, atIndex) : "";
  const domainQuery = hasAt ? form.email.slice(atIndex + 1).toLowerCase() : "";

  const domainSuggestions =
    hasAt && username.trim().length > 0
      ? POPULAR_DOMAINS.filter(
          (d) => d.startsWith(domainQuery) && d !== domainQuery
        )
      : [];

  const showSuggestions = emailFocused && domainSuggestions.length > 0;

  const applyDomain = (domain: string) => {
    setForm((prev) => ({ ...prev, email: `${username}@${domain}` }));
    setEmailFocused(false);
    setSelectedDomainIdx(-1);
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedDomainIdx((prev) =>
        prev < domainSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedDomainIdx((prev) =>
        prev > 0 ? prev - 1 : domainSuggestions.length - 1
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      if (selectedDomainIdx >= 0 && selectedDomainIdx < domainSuggestions.length) {
        e.preventDefault();
        applyDomain(domainSuggestions[selectedDomainIdx]);
      } else if (domainSuggestions.length > 0 && e.key === "Tab") {
        e.preventDefault();
        applyDomain(domainSuggestions[0]);
      }
    } else if (e.key === "Escape") {
      setEmailFocused(false);
    }
  };

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((d) => d.contact && setContact(d.contact))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSent(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send message. Please try again.");
        if (data.fallbackMailto) {
          setFallbackMailto(data.fallbackMailto);
        }
        return;
      }

      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 6000);
    } catch {
      setError("Network error. Please try again or reach out via direct email.");
    } finally {
      setSubmitting(false);
    }
  };

  const infoCards = [
    {
      icon: <FaEnvelope />,
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: <FaPhone />,
      label: "Phone",
      value: contact.phone,
      href: `tel:${contact.phone}`,
    },
    {
      icon: <FaWhatsapp />,
      label: "WhatsApp",
      value: contact.whatsapp,
      href: `https://wa.me/${contact.whatsapp?.replace(/\D/g, "")}`,
    },
    {
      icon: <FaMapMarkerAlt />,
      label: "Address",
      value: contact.address,
      href: undefined,
    },
  ];

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
            Contact Me
          </h1>
          <p className="text-gray-400 font-sans font-light text-center lg:text-left max-w-lg">
            Have a project in mind or just want to say hi? I&apos;d love to hear
            from you.
          </p>
        </motion.div>

        <div className="flex flex-wrap lg:flex-nowrap gap-10">
          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full lg:w-7/12 flex flex-col gap-4"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="relative w-full">
                <input
                  id="contact-email"
                  type="email"
                  placeholder="Your Email"
                  required
                  autoComplete="off"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setSelectedDomainIdx(-1);
                  }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => {
                    setTimeout(() => setEmailFocused(false), 150);
                  }}
                  onKeyDown={handleEmailKeyDown}
                  className={inputClass}
                />

                {/* Popular Email Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && (
                    <motion.ul
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.9)] overflow-hidden font-sans backdrop-blur-xl"
                    >
                      <div className="px-3 py-1.5 border-b border-[#1f1f1f] flex items-center justify-between text-[11px] text-gray-500 font-medium uppercase tracking-wider bg-[#111]">
                        <span>Suggested Domains</span>
                        <span className="text-[10px] text-gray-600 font-mono">
                          Tab/↵ to select
                        </span>
                      </div>
                      {domainSuggestions.map((domain, index) => (
                        <li
                          key={domain}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyDomain(domain);
                          }}
                          onMouseEnter={() => setSelectedDomainIdx(index)}
                          className={`flex items-center justify-between px-3.5 py-2.5 text-xs cursor-pointer transition-colors ${
                            selectedDomainIdx === index
                              ? "bg-[#f6c14c18] text-[#f6c14c]"
                              : "text-gray-300 hover:bg-[#161616] hover:text-white"
                          }`}
                        >
                          <span className="truncate">
                            <span className="text-gray-500">{username}@</span>
                            <span className="font-semibold text-white">
                              {domain}
                            </span>
                          </span>
                          <span className="text-[10px] text-[#f6c14c] font-mono opacity-80">
                            @{domain}
                          </span>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <input
              id="contact-subject"
              type="text"
              placeholder="Subject"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className={inputClass}
            />
            <textarea
              id="contact-message"
              placeholder="Your Message"
              required
              rows={7}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={inputClass}
              style={{ resize: "none" }}
            />

            {sent && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-sans text-center py-3 rounded-lg"
                style={{
                  background: "linear-gradient(90deg,#f6c14c22,#b2892f22)",
                  border: "1px solid #f6c14c55",
                  color: "#f6c14c",
                }}
              >
                ✓ Message sent! I&apos;ll get back to you soon.
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-sans py-3 px-4 rounded-lg flex flex-col gap-2 bg-red-950/40 border border-red-500/40 text-red-300"
              >
                <span className="leading-relaxed">{error}</span>
                {fallbackMailto && (
                  <a
                    href={fallbackMailto}
                    className="self-start text-xs font-semibold text-[#f6c14c] underline hover:text-[#fff8dc] transition-colors"
                  >
                    Click here to open and send directly via your email client →
                  </a>
                )}
              </motion.div>
            )}

            <button
              id="contact-submit"
              type="submit"
              disabled={submitting}
              className="relative py-3 px-8 rounded-lg font-bold font-sans text-black transition-all duration-300 disabled:opacity-60 hover:shadow-[0_0_25px_rgba(246,193,76,0.4)] hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(90deg,#f6c14c,#fceabb,#b2892f)",
              }}
            >
              {submitting ? "Sending…" : "Send Message"}
            </button>
          </motion.form>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-5/12 flex flex-col gap-4"
          >
            {infoCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-4 p-4 rounded-lg bg-[#0d0d0d] transition-all duration-300 hover:-translate-y-0.5"
                style={{ border: "1px solid #2a2a2a" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#f6c14c55";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 20px rgba(246,193,76,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#2a2a2a";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div
                  className="text-xl shrink-0 w-10 h-10 flex items-center justify-center rounded-full"
                  style={{
                    background: "linear-gradient(135deg,#f6c14c22,#b2892f22)",
                    border: "1px solid #f6c14c33",
                    color: "#f6c14c",
                  }}
                >
                  {card.icon}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs text-gray-500 font-sans uppercase tracking-wider">
                    {card.label}
                  </span>
                  {card.href ? (
                    <Link
                      href={card.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#f6c14c] font-sans text-sm hover:text-[#fff8dc] transition-colors truncate"
                    >
                      {card.value}
                    </Link>
                  ) : (
                    <span className="text-gray-300 font-sans text-sm truncate">
                      {card.value}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </PageAnimation>
  );
}
