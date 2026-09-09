import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const dataFilePath = path.join(process.cwd(), "public", "portfolioData.json");

function extractUploadUrls(obj: unknown): string[] {
  const urls: string[] = [];
  const str = JSON.stringify(obj);
  const matches = str.match(/\/uploads\/[a-zA-Z0-9._-]+/g);
  if (matches) {
    for (const url of matches) {
      if (!urls.includes(url)) urls.push(url);
    }
  }
  return urls;
}

export async function GET() {
  try {
    const raw = fs.readFileSync(dataFilePath, "utf8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Failed to read portfolio data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if any previously uploaded images were removed/changed in the new portfolio data
    if (fs.existsSync(dataFilePath)) {
      try {
        const oldData = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
        const oldUploads = extractUploadUrls(oldData);
        const newUploads = extractUploadUrls(body);

        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        for (const oldUrl of oldUploads) {
          if (!newUploads.includes(oldUrl)) {
            const filename = path.basename(oldUrl);
            if (filename && !filename.includes("..")) {
              const filepath = path.join(uploadsDir, filename);
              if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error cleaning up orphaned images on save:", err);
      }
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save portfolio data" }, { status: 500 });
  }
}

