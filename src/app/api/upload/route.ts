import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif", "image/svg+xml"];
const MAX_SIZE_MB = 5;

function deleteUploadedFile(fileUrl: string | null | undefined) {
  try {
    if (!fileUrl || typeof fileUrl !== "string") return;
    // Only delete files inside /uploads/ to prevent deleting static assets
    if (!fileUrl.startsWith("/uploads/")) return;

    const filename = path.basename(fileUrl);
    if (!filename || filename.includes("..")) return;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const filepath = path.join(uploadsDir, filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  } catch (err) {
    console.error("Failed to delete old image:", err);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const oldUrl = formData.get("oldUrl") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: JPG, PNG, GIF, WebP, AVIF, SVG` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `File too large. Max size: ${MAX_SIZE_MB}MB` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure /public/uploads exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // If an old image was provided and it was in /uploads/, delete it
    if (oldUrl) {
      deleteUploadedFile(oldUrl);
    }

    // Unique filename: timestamp + random slug + original extension
    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    const slug = Math.random().toString(36).slice(2, 9);
    const filename = `${Date.now()}-${slug}${ext}`;
    const filepath = path.join(uploadsDir, filename);

    fs.writeFileSync(filepath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    let urlToDelete = "";
    const { searchParams } = new URL(request.url);
    const queryUrl = searchParams.get("url");
    if (queryUrl) {
      urlToDelete = queryUrl;
    } else {
      const body = await request.json().catch(() => ({}));
      urlToDelete = body?.url ?? "";
    }

    if (!urlToDelete) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    deleteUploadedFile(urlToDelete);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

