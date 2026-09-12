import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  isKvConfigured,
  getPortfolioFromKV,
  setPortfolioInKV,
} from "@/lib/kv";

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
    // 1. Try reading from KV if configured
    if (isKvConfigured) {
      const kvData = await getPortfolioFromKV();
      if (kvData) {
        return NextResponse.json(kvData);
      }
    }

    // 2. Fall back to reading from local JSON file
    if (fs.existsSync(dataFilePath)) {
      const raw = fs.readFileSync(dataFilePath, "utf8");
      return NextResponse.json(JSON.parse(raw));
    }

    return NextResponse.json(
      { error: "No portfolio data found" },
      { status: 404 }
    );
  } catch (err) {
    console.error("GET /api/portfolio error:", err);
    return NextResponse.json(
      { error: "Failed to read portfolio data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let savedToKv = false;

    // 1. Save to KV if configured (Required for Vercel production)
    if (isKvConfigured) {
      try {
        await setPortfolioInKV(body);
        savedToKv = true;
      } catch (kvErr) {
        console.error("Failed to save to KV:", kvErr);
      }
    }

    // 2. Attempt to save to local file system (Works in local development)
    let savedToFs = false;
    try {
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
        } catch (cleanErr) {
          console.warn("Notice: could not clean up orphaned uploads:", cleanErr);
        }
      }

      fs.writeFileSync(dataFilePath, JSON.stringify(body, null, 2), "utf8");
      savedToFs = true;
    } catch (fsErr) {
      console.warn(
        "Notice: Could not write to local filesystem (expected on read-only environments like Vercel):",
        fsErr
      );
    }

    // If neither KV nor FileSystem succeeded, return an informative error
    if (!savedToKv && !savedToFs) {
      return NextResponse.json(
        {
          error:
            "Cannot write to read-only filesystem. Please configure Vercel KV / Upstash Redis environment variables (KV_REST_API_URL and KV_REST_API_TOKEN).",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      storage: savedToKv ? "kv" : "local_file",
    });
  } catch (err: unknown) {
    console.error("POST /api/portfolio error:", err);
    const msg =
      err instanceof Error ? err.message : "Failed to save portfolio data";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
