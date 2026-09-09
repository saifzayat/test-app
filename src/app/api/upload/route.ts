import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/svg+xml",
];
const MAX_SIZE_MB = 5;

function deleteUploadedFile(fileUrl: string | null | undefined) {
  try {
    if (!fileUrl || typeof fileUrl !== "string") return;
    if (!fileUrl.startsWith("/uploads/")) return;

    const filename = path.basename(fileUrl);
    if (!filename || filename.includes("..")) return;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const filepath = path.join(uploadsDir, filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  } catch (err) {
    console.warn("Notice: could not delete old uploaded image (expected on read-only environments):", err);
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

    // Try saving to public/uploads (local development)
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      if (oldUrl) {
        deleteUploadedFile(oldUrl);
      }

      const ext = path.extname(file.name).toLowerCase() || ".jpg";
      const slug = Math.random().toString(36).slice(2, 9);
      const filename = `${Date.now()}-${slug}${ext}`;
      const filepath = path.join(uploadsDir, filename);

      fs.writeFileSync(filepath, buffer);

      return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (fsErr) {
      console.warn("Filesystem is read-only, falling back to data URL for uploaded image:", fsErr);

      // On read-only serverless platforms like Vercel, convert to inline Data URL
      if (file.size <= 2.5 * 1024 * 1024) {
        const base64 = buffer.toString("base64");
        const dataUrl = `data:${file.type};base64,${base64}`;
        return NextResponse.json({ url: dataUrl });
      }

      return NextResponse.json(
        {
          error:
            "Vercel filesystem is read-only. For files > 2.5MB, please paste an external image URL (e.g. from Cloudinary, Imgur, or GitHub).",
        },
        { status: 400 }
      );
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
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
