import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const CV_DIR   = path.join(process.cwd(), "public", "cv");
const DATA_FILE = path.join(process.cwd(), "public", "portfolioData.json");

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE_MB = 10;

/* GET — return current CV URL from portfolioData.json */
export async function GET() {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return NextResponse.json({ cvUrl: data.cvUrl ?? "" });
  } catch {
    return NextResponse.json({ cvUrl: "" });
  }
}

/* POST — upload a new CV, replace old one, update portfolioData.json */
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

    // Ensure /public/cv exists, wipe any existing CV files
    if (!fs.existsSync(CV_DIR)) fs.mkdirSync(CV_DIR, { recursive: true });
    fs.readdirSync(CV_DIR).forEach((f) => fs.unlinkSync(path.join(CV_DIR, f)));

    // Save file with a sanitised name
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    fs.writeFileSync(path.join(CV_DIR, safeName), Buffer.from(await file.arrayBuffer()));

    const cvUrl = `/cv/${safeName}`;

    // Persist URL in portfolioData.json
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    data.cvUrl = cvUrl;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    return NextResponse.json({ url: cvUrl, filename: safeName });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

/* DELETE — remove the CV file and clear the URL */
export async function DELETE() {
  try {
    if (fs.existsSync(CV_DIR)) {
      fs.readdirSync(CV_DIR).forEach((f) => fs.unlinkSync(path.join(CV_DIR, f)));
    }
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    data.cvUrl = "";
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
