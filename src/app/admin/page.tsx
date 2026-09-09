"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebook,
  FaTiktok,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaPlus,
  FaTrash,
  FaSave,
  FaCog,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUpload,
  FaImage,
  FaFilePdf,
  FaDownload,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

/* ─── Types ──────────────────────────────────────────────── */
interface Social {
  name: string;
  icon: string;
  href: string;
}
interface Stat {
  label: string;
  value: string;
  href?: string;
}
interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  image?: string;
}
interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
}
interface PortfolioData {
  cvUrl: string;
  hero: { name: string; title: string; tagline: string; socials: Social[] };
  about: { title: string; bio: string; photoUrl: string; stats: Stat[] };
  projects: Project[];
  experience: Experience[];
  contact: { email: string; phone: string; whatsapp: string; address: string };
}

/* ─── Shared Styles ─────────────────────────────────────── */
const inputCls =
  "w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white font-sans text-sm placeholder-gray-600 outline-none transition-all focus:border-[#f6c14c66] focus:shadow-[0_0_12px_rgba(246,193,76,0.15)]";
const textareaCls = inputCls + " resize-none";
const labelCls = "text-xs text-gray-500 uppercase tracking-wider font-sans";
const goldBtnCls =
  "px-4 py-2 rounded-lg font-bold font-sans text-black text-sm transition-all hover:shadow-[0_0_20px_rgba(246,193,76,0.4)] hover:scale-105 active:scale-95 disabled:opacity-50";
const ghostBtnCls =
  "px-3 py-1.5 rounded-lg font-sans text-sm border border-[#2a2a2a] text-gray-400 hover:border-[#f6c14c55] hover:text-[#f6c14c] transition-all";
const TABS = ["Hero", "About", "Projects", "Experience", "Contact"];
const ICON_OPTIONS = [
  "FaFacebook",
  "FaTiktok",
  "FaLinkedin",
  "FaGithub",
  "FaInstagram",
];
const uid = () => Math.random().toString(36).slice(2, 9);

/* ─── Image Uploader ────────────────────────────────────── */
function ImageUploader({
  value,
  onChange,
  label = "Image",
  inputId,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  inputId?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    setUploadError("");
    const fd = new FormData();
    fd.append("file", file);
    if (value) {
      fd.append("oldUrl", value);
    }
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setUploadError(msg);
    }
    setUploading(false);
  };

  const remove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value && value.startsWith("/uploads/")) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: value }),
        });
      } catch {}
    }
    onChange("");
  };

  const handleFile = (file: File | undefined) => {
    if (file) upload(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className={labelCls}>{label}</label>

      {/* Drop zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        className="relative flex flex-col items-center justify-center gap-2 rounded-lg cursor-pointer transition-all duration-200"
        style={{
          minHeight: 80,
          border: `2px dashed ${dragOver ? "#f6c14c" : "#2a2a2a"}`,
          background: dragOver ? "#f6c14c0a" : "#0d0d0d",
          boxShadow: dragOver ? "0 0 16px rgba(246,193,76,0.15)" : undefined,
        }}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 border-[#f6c14c] border-t-transparent animate-spin" />
            <span className="text-xs font-sans text-gray-500">Uploading…</span>
          </div>
        ) : value ? (
          <div className="flex items-center gap-4 w-full px-4 py-2">
            <Image
              src={value}
              alt="preview"
              width={100}
              height={100}
              className="object-cover rounded border border-[#2a2a2a]"
            />

            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <span className="text-xs text-gray-500 truncate font-sans">
                {value}
              </span>
              <span className="text-xs text-[#f6c14c] font-sans">
                Click or drag to replace
              </span>
            </div>

            <button
              type="button"
              onClick={remove}
              title="Delete image"
              className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors shrink-0"
            >
              <FaTrash className="text-sm" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 py-3">
            <FaImage className="text-2xl text-gray-600" />
            <span className="text-xs font-sans text-gray-500">
              Click to upload or drag & drop
            </span>
            <span className="text-xs font-sans text-gray-600">
              JPG, PNG, WebP, GIF · Max 5 MB
            </span>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        id={inputId}
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {/* Manual URL fallback */}
      <div className="flex items-center gap-2">
        <FaUpload className="text-gray-600 text-xs shrink-0" />
        <input
          className={inputCls + " text-xs"}
          placeholder="…or paste an image URL"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {uploadError && (
        <p className="text-red-400 font-sans text-xs">{uploadError}</p>
      )}
    </div>
  );
}

/* ─── CV Uploader ───────────────────────────────────────── */
function CvUploader({
  cvUrl,
  onChange,
}: {
  cvUrl: string;
  onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/cv", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
    setUploading(false);
  };

  const remove = async () => {
    setRemoving(true);
    await fetch("/api/cv", { method: "DELETE" });
    onChange("");
    setRemoving(false);
  };

  const filename = cvUrl ? cvUrl.split("/").pop() : "";

  return (
    <div className="flex flex-col gap-2">
      <label className={labelCls}>CV / Resume</label>

      {/* Current file */}
      {cvUrl ? (
        <div
          className="flex items-center gap-4 p-4 rounded-lg bg-[#111]"
          style={{ border: "1px solid #2a2a2a" }}
        >
          <FaFilePdf className="text-3xl text-[#f6c14c] shrink-0" />
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="font-sans text-sm text-white truncate">
              {filename}
            </span>
            <Link
              href={cvUrl}
              download
              className="text-xs text-[#f6c14c] hover:text-[#fff8dc] flex items-center gap-1 transition-colors"
            >
              <FaDownload className="text-xs" /> Download to verify
            </Link>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => fileRef.current?.click()}
              className={ghostBtnCls + " text-xs"}
            >
              Replace
            </button>
            <button
              onClick={remove}
              disabled={removing}
              className="px-3 py-1.5 rounded-lg text-sm border border-red-900 text-red-500 hover:bg-red-950 transition-all disabled:opacity-50"
            >
              {removing ? "…" : <FaTrash />}
            </button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            upload(e.dataTransfer.files[0]);
          }}
          className="flex flex-col items-center justify-center gap-2 rounded-lg cursor-pointer transition-all duration-200 py-6"
          style={{
            border: `2px dashed ${dragOver ? "#f6c14c" : "#2a2a2a"}`,
            background: dragOver ? "#f6c14c0a" : "#0d0d0d",
            boxShadow: dragOver ? "0 0 16px rgba(246,193,76,0.15)" : undefined,
          }}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-[#f6c14c] border-t-transparent animate-spin" />
              <span className="text-xs font-sans text-gray-500">
                Uploading…
              </span>
            </div>
          ) : (
            <>
              <FaFilePdf className="text-3xl text-gray-600" />
              <span className="text-xs font-sans text-gray-500">
                Click to upload or drag & drop
              </span>
              <span className="text-xs font-sans text-gray-600">
                PDF, DOC, DOCX · Max 10 MB
              </span>
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        id="admin-cv-upload"
        ref={fileRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
        }}
      />

      {error && <p className="text-red-400 font-sans text-xs">{error}</p>}
    </div>
  );
}

/* ─── Icon Preview ──────────────────────────────────────── */
const iconMap: Record<string, React.ReactElement> = {
  FaFacebook: <FaFacebook />,
  FaTiktok: <FaTiktok />,
  FaLinkedin: <FaLinkedin />,
  FaGithub: <FaGithub />,
  FaInstagram: <FaInstagram />,
};

/* ═══════════════════════════════════════════════════════════
   LOGIN SCREEN
═══════════════════════════════════════════════════════════ */
function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!pin) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pin }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        setError(true);
        setTimeout(() => setError(false), 2000);
      }
    } catch {
      setError(true);
      setTimeout(() => setError(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm flex flex-col gap-6 p-8 rounded-2xl bg-[#0d0d0d]"
        style={{
          border: "1px solid #2a2a2a",
          boxShadow: "0 0 40px rgba(246,193,76,0.08)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
            style={{
              background: "linear-gradient(135deg,#f6c14c22,#b2892f22)",
              border: "1px solid #f6c14c44",
              color: "#f6c14c",
            }}
          >
            <FaLock />
          </div>
          <h1 className="text-2xl gold-text">Admin Editor</h1>
          <p className="text-gray-500 font-sans text-sm text-center">
            Enter your PIN to access the portfolio editor
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <input
              id="admin-pin"
              type={show ? "text" : "password"}
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handle()}
              className={inputCls + " pr-12"}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#f6c14c] transition-colors"
            >
              {show ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 font-sans text-xs text-center"
            >
              Incorrect PIN. Try again.
            </motion.p>
          )}
          <button
            id="admin-login-btn"
            onClick={handle}
            disabled={loading}
            className={goldBtnCls + " w-full py-3 disabled:opacity-60"}
            style={{
              background: "linear-gradient(90deg,#f6c14c,#fceabb,#b2892f)",
            }}
          >
            {loading ? "Verifying…" : "Unlock Editor"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO TAB
═══════════════════════════════════════════════════════════ */
function HeroTab({
  data,
  setData,
}: {
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
}) {
  const h = data.hero;
  const set = (k: keyof typeof h, v: string) =>
    setData({ ...data, hero: { ...h, [k]: v } });

  const setSocials = (socials: Social[]) =>
    setData({ ...data, hero: { ...h, socials } });
  const updateSocial = (i: number, k: keyof Social, v: string) => {
    const s = [...h.socials];
    s[i] = { ...s[i], [k]: v };
    setSocials(s);
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Hero Content">
        <Field label="Full Name">
          <input
            id="hero-name"
            className={inputCls}
            value={h.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>
        <Field label="Title / Role">
          <input
            id="hero-title"
            className={inputCls}
            value={h.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </Field>
        <Field label="Tagline">
          <input
            id="hero-tagline"
            className={inputCls}
            value={h.tagline}
            onChange={(e) => set("tagline", e.target.value)}
          />
        </Field>
      </SectionCard>

      <SectionCard
        title="Social Links"
        action={
          <button
            onClick={() =>
              setSocials([
                ...h.socials,
                { name: "", icon: "FaGithub", href: "" },
              ])
            }
            className={ghostBtnCls}
          >
            <span className="flex items-center gap-1">
              <FaPlus className="text-xs" /> Add Social
            </span>
          </button>
        }
      >
        {h.socials.map((s, i) => (
          <div
            key={i}
            className="flex gap-3 items-center p-3 rounded-lg bg-[#111] border border-[#1e1e1e]"
          >
            <span className="text-[#f6c14c] text-xl shrink-0">
              {iconMap[s.icon] ?? <FaGithub />}
            </span>
            <select
              className={inputCls + " max-w-[140px]"}
              value={s.icon}
              onChange={(e) => updateSocial(i, "icon", e.target.value)}
            >
              {ICON_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o.replace("Fa", "")}
                </option>
              ))}
            </select>
            <input
              className={inputCls}
              placeholder="Display name"
              value={s.name}
              onChange={(e) => updateSocial(i, "name", e.target.value)}
            />
            <input
              className={inputCls}
              placeholder="URL"
              value={s.href}
              onChange={(e) => updateSocial(i, "href", e.target.value)}
            />
            <button
              onClick={() => setSocials(h.socials.filter((_, j) => j !== i))}
              className="text-red-500 hover:text-red-400 transition-colors shrink-0"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ABOUT TAB
═══════════════════════════════════════════════════════════ */
function AboutTab({
  data,
  setData,
}: {
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
}) {
  const a = data.about;
  const set = (k: keyof typeof a, v: string) =>
    setData({ ...data, about: { ...a, [k]: v } });
  const setStats = (stats: Stat[]) =>
    setData({ ...data, about: { ...a, stats } });
  const updateStat = (i: number, k: keyof Stat, v: string) => {
    const s = [...a.stats];
    s[i] = { ...s[i], [k]: v };
    setStats(s);
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="About Content">
        <Field label="Section Title">
          <input
            id="about-title"
            className={inputCls}
            value={a.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </Field>
        <Field label="Bio">
          <textarea
            id="about-bio"
            className={textareaCls}
            rows={4}
            value={a.bio}
            onChange={(e) => set("bio", e.target.value)}
          />
        </Field>
        <ImageUploader
          inputId="about-photo-upload"
          label="Photo"
          value={a.photoUrl}
          onChange={(url) => set("photoUrl", url)}
        />
      </SectionCard>

      <SectionCard
        title="Info Stats"
        action={
          <button
            onClick={() => setStats([...a.stats, { label: "", value: "" }])}
            className={ghostBtnCls}
          >
            <span className="flex items-center gap-1">
              <FaPlus className="text-xs" /> Add Stat
            </span>
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {a.stats.map((s, i) => (
            <div
              key={i}
              className="flex gap-2 items-center p-3 rounded-lg bg-[#111] border border-[#1e1e1e]"
            >
              <input
                className={inputCls + " max-w-[120px]"}
                placeholder="Label"
                value={s.label}
                onChange={(e) => updateStat(i, "label", e.target.value)}
              />
              <input
                className={inputCls}
                placeholder="Value"
                value={s.value}
                onChange={(e) => updateStat(i, "value", e.target.value)}
              />
              <input
                className={inputCls}
                placeholder="Link (optional)"
                value={s.href ?? ""}
                onChange={(e) => updateStat(i, "href", e.target.value)}
              />
              <button
                onClick={() => setStats(a.stats.filter((_, j) => j !== i))}
                className="text-red-500 hover:text-red-400 shrink-0"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="CV / Resume">
        <CvUploader
          cvUrl={data.cvUrl ?? ""}
          onChange={(url) => setData({ ...data, cvUrl: url })}
        />
      </SectionCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROJECTS TAB
═══════════════════════════════════════════════════════════ */
function ProjectsTab({
  data,
  setData,
}: {
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
}) {
  const projects = data.projects;
  const setProjects = (p: Project[]) => setData({ ...data, projects: p });
  const updateProject = (i: number, k: keyof Project, v: string | string[]) => {
    const p = [...projects];
    p[i] = { ...p[i], [k]: v };
    setProjects(p);
  };
  const moveProject = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= projects.length) return;
    const p = [...projects];
    const [moved] = p.splice(index, 1);
    p.splice(target, 0, moved);
    setProjects(p);
  };
  const addProject = () =>
    setProjects([
      ...projects,
      {
        id: uid(),
        title: "",
        description: "",
        tags: [],
        liveUrl: "",
        githubUrl: "",
        image: "",
      },
    ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button onClick={addProject} className={ghostBtnCls}>
          <span className="flex items-center gap-1">
            <FaPlus className="text-xs" /> Add Project
          </span>
        </button>
      </div>
      {projects.map((p, i) => (
        <SectionCard
          key={p.id}
          title={`Project ${i + 1}: ${p.title || "Untitled"}`}
          action={
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-[#f6c14c] bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#2a2a2a] mr-1">
                #{i + 1}
              </span>
              <button
                type="button"
                onClick={() => moveProject(i, "up")}
                disabled={i === 0}
                title="Move Up"
                className="p-1.5 rounded bg-[#161616] border border-[#2a2a2a] text-gray-300 hover:text-[#f6c14c] hover:border-[#f6c14c55] disabled:opacity-25 disabled:cursor-not-allowed transition-all"
              >
                <FaArrowUp className="text-xs" />
              </button>
              <button
                type="button"
                onClick={() => moveProject(i, "down")}
                disabled={i === projects.length - 1}
                title="Move Down"
                className="p-1.5 rounded bg-[#161616] border border-[#2a2a2a] text-gray-300 hover:text-[#f6c14c] hover:border-[#f6c14c55] disabled:opacity-25 disabled:cursor-not-allowed transition-all"
              >
                <FaArrowDown className="text-xs" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (p.image && p.image.startsWith("/uploads/")) {
                    fetch("/api/upload", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ url: p.image }),
                    }).catch(() => {});
                  }
                  setProjects(projects.filter((_, j) => j !== i));
                }}
                title="Delete Project"
                className="p-1.5 rounded bg-[#161616] border border-[#2a2a2a] text-red-500 hover:text-red-400 hover:border-red-500/40 transition-all ml-1"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title">
              <input
                className={inputCls}
                value={p.title}
                onChange={(e) => updateProject(i, "title", e.target.value)}
              />
            </Field>
            <div className="md:col-span-2">
              <ImageUploader
                inputId={`project-img-${i}`}
                label="Project Image (optional)"
                value={p.image ?? ""}
                onChange={(url) => updateProject(i, "image", url)}
              />
            </div>
            <Field label="Live URL">
              <input
                className={inputCls}
                value={p.liveUrl}
                onChange={(e) => updateProject(i, "liveUrl", e.target.value)}
              />
            </Field>
            <Field label="GitHub URL">
              <input
                className={inputCls}
                value={p.githubUrl}
                onChange={(e) => updateProject(i, "githubUrl", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              className={textareaCls}
              rows={3}
              value={p.description}
              onChange={(e) => updateProject(i, "description", e.target.value)}
            />
          </Field>
          <Field label="Tags (comma-separated)">
            <input
              className={inputCls}
              value={p.tags.join(", ")}
              onChange={(e) =>
                updateProject(
                  i,
                  "tags",
                  e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                )
              }
            />
          </Field>
        </SectionCard>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPERIENCE TAB
═══════════════════════════════════════════════════════════ */
function ExperienceTab({
  data,
  setData,
}: {
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
}) {
  const exps = data.experience;
  const setExps = (e: Experience[]) => setData({ ...data, experience: e });
  const update = (i: number, k: keyof Experience, v: string | string[]) => {
    const e = [...exps];
    e[i] = { ...e[i], [k]: v };
    setExps(e);
  };
  const addExp = () =>
    setExps([
      ...exps,
      {
        id: uid(),
        role: "",
        company: "",
        period: "",
        description: "",
        skills: [],
      },
    ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button onClick={addExp} className={ghostBtnCls}>
          <span className="flex items-center gap-1">
            <FaPlus className="text-xs" /> Add Experience
          </span>
        </button>
      </div>
      {exps.map((exp, i) => (
        <SectionCard
          key={exp.id}
          title={`${exp.role || "Role"} @ ${exp.company || "Company"}`}
          action={
            <button
              onClick={() => setExps(exps.filter((_, j) => j !== i))}
              className="text-red-500 hover:text-red-400 transition-colors text-sm"
            >
              <FaTrash />
            </button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Role">
              <input
                className={inputCls}
                value={exp.role}
                onChange={(e) => update(i, "role", e.target.value)}
              />
            </Field>
            <Field label="Company">
              <input
                className={inputCls}
                value={exp.company}
                onChange={(e) => update(i, "company", e.target.value)}
              />
            </Field>
            <Field label="Period">
              <input
                className={inputCls}
                placeholder="2023 – Present"
                value={exp.period}
                onChange={(e) => update(i, "period", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              className={textareaCls}
              rows={3}
              value={exp.description}
              onChange={(e) => update(i, "description", e.target.value)}
            />
          </Field>
          <Field label="Skills (comma-separated)">
            <input
              className={inputCls}
              value={exp.skills.join(", ")}
              onChange={(e) =>
                update(
                  i,
                  "skills",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
            />
          </Field>
        </SectionCard>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONTACT TAB
═══════════════════════════════════════════════════════════ */
function ContactTab({
  data,
  setData,
}: {
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
}) {
  const c = data.contact;
  const set = (k: keyof typeof c, v: string) =>
    setData({ ...data, contact: { ...c, [k]: v } });
  return (
    <SectionCard title="Contact Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Email">
          <input
            id="ct-email"
            className={inputCls}
            value={c.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
        <Field label="Phone">
          <input
            id="ct-phone"
            className={inputCls}
            value={c.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
        <Field label="WhatsApp">
          <input
            id="ct-wa"
            className={inputCls}
            value={c.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
          />
        </Field>
        <Field label="Address">
          <input
            id="ct-addr"
            className={inputCls}
            value={c.address}
            onChange={(e) => set("address", e.target.value)}
          />
        </Field>
      </div>
    </SectionCard>
  );
}

/* ─── Small helper components ───────────────────────────── */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-6 flex flex-col gap-4 bg-[#0d0d0d]"
      style={{ border: "1px solid #1e1e1e" }}
    >
      <div className="flex items-center justify-between">
        <h3
          className="text-sm font-bold"
          style={{
            background: "linear-gradient(90deg,#f6c14c,#fceabb)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "Cinzel Decorative,serif",
          }}
        >
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN ADMIN PAGE
═══════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [tab, setTab] = useState(0);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth) return;
    setLoading(true);
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data.");
        setLoading(false);
      });
  }, [auth]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Save failed. Please try again.");
    }
    setSaving(false);
  };

  if (!auth) return <LoginScreen onSuccess={() => setAuth(true)} />;

  return (
    <div className="min-h-screen bg-[#000]">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-[#000] border-b border-[#1e1e1e] px-6 py-3 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <FaCog
            className="text-[#f6c14c] text-lg animate-spin"
            style={{ animationDuration: "6s" }}
          />
          <span className="gold-text text-lg">Portfolio Editor</span>
        </div>
        <div className="flex items-center gap-4">
          {error && (
            <span className="text-red-400 font-sans text-sm">{error}</span>
          )}
          {saved && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#f6c14c] font-sans text-sm"
            >
              ✓ Saved!
            </motion.span>
          )}
          <button
            id="admin-save-btn"
            onClick={handleSave}
            disabled={saving || loading || !data}
            className={goldBtnCls + " flex items-center gap-2"}
            style={{
              background: "linear-gradient(90deg,#f6c14c,#fceabb,#b2892f)",
            }}
          >
            <FaSave /> {saving ? "Saving…" : "Save Changes"}
          </button>
          <Link href="/" className={ghostBtnCls + " text-xs"}>
            ← Back to Site
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TABS.map((t, i) => (
            <button
              key={t}
              id={`admin-tab-${t.toLowerCase()}`}
              onClick={() => setTab(i)}
              className="px-5 py-2 rounded-full font-sans text-sm transition-all duration-200"
              style={
                tab === i
                  ? {
                      background: "linear-gradient(90deg,#f6c14c,#b2892f)",
                      color: "#000",
                      fontWeight: "700",
                    }
                  : {
                      border: "1px solid #2a2a2a",
                      color: "#888",
                      background: "transparent",
                    }
              }
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 rounded-xl bg-[#0d0d0d] animate-pulse border border-[#1e1e1e]"
              />
            ))}
          </div>
        )}

        {!loading && data && (
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tab === 0 && <HeroTab data={data} setData={setData} />}
              {tab === 1 && <AboutTab data={data} setData={setData} />}
              {tab === 2 && <ProjectsTab data={data} setData={setData} />}
              {tab === 3 && <ExperienceTab data={data} setData={setData} />}
              {tab === 4 && <ContactTab data={data} setData={setData} />}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Floating Save */}
        {data && !loading && (
          <div className="fixed bottom-8 right-8 z-50">
            <button
              id="admin-save-fab"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-bold font-sans text-black shadow-[0_0_30px_rgba(246,193,76,0.4)] transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
              style={{
                background: "linear-gradient(90deg,#f6c14c,#fceabb,#b2892f)",
              }}
            >
              <FaSave /> {saving ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
