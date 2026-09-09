import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  isKvConfigured,
  getPortfolioFromKV,
  setPortfolioInKV,
} from "@/lib/kv";

export const dynamic = "force-dynamic";

const CV_DIR = path.join(process.cwd(), "public", "cv");
const DATA_FILE = path.join(process.cwd(), "public", "portfolioData.json");

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE_MB = 10;

async function getPortfolioData(): Promise<Record<string, unknown>> {
  if (isKvConfigured) {
    const kvData = await getPortfolioFromKV();
    if (kvData && typeof kvData === "object") {
      return kvData as Record<string, unknown>;
    }
  }
  if (fs.existsSync(DATA_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    } catch {}
  }
  return {};
}

async function savePortfolioData(data: Record<string, unknown>) {
  if (isKvConfigured) {
    await setPortfolioInKV(data);
  }
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (fsErr) {
    console.warn("Notice: could not write to local filesystem (expected on Vercel):", fsErr);
  }
}

/* GET — return current CV URL */
export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json({ cvUrl: data.cvUrl ?? "" });
  } catch {
    return NextResponse.json({ cvUrl: "" });
  }
}

/* POST — upload a new CV, replace old one, update portfolio data */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, DOC, and DOCX are accepted." },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_SIZE_MB} MB.` },
        { status: 400 }
      );
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let cvUrl = `/cv/${safeName}`;

    // Try saving to local disk
    try {
      if (!fs.existsSync(CV_DIR)) fs.mkdirSync(CV_DIR, { recursive: true });
      fs.readdirSync(CV_DIR).forEach((f) => {
        try {
          fs.unlinkSync(path.join(CV_DIR, f));
        } catch {}
      });
      fs.writeFileSync(path.join(CV_DIR, safeName), buffer);
    } catch (fsErr) {
      console.warn("Filesystem read-only on Vercel for CV file:", fsErr);
      // For CVs under 3MB on read-only systems, convert to data URL so the download still works
      if (file.size <= 3 * 1024 * 1024) {
        cvUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
      }
    }

    // Persist URL in portfolio data (KV and/or local JSON)
    const data = await getPortfolioData();
    data.cvUrl = cvUrl;
    await savePortfolioData(data);

    return NextResponse.json({ url: cvUrl, filename: safeName });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/* DELETE — remove the CV file and clear the URL */
export async function DELETE() {
  try {
    try {
      if (fs.existsSync(CV_DIR)) {
        fs.readdirSync(CV_DIR).forEach((f) => fs.unlinkSync(path.join(CV_DIR, f)));
      }
    } catch {}

    const data = await getPortfolioData();
    data.cvUrl = "";
    await savePortfolioData(data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
