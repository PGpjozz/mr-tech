import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
  }

  const maxBytes = 6 * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { ok: false, error: "File too large (max 6MB)" },
      { status: 413 }
    );
  }

  const mime = file.type;
  const allowed = new Map<string, string>([
    ["image/jpeg", "jpg"],
    ["image/png", "png"],
    ["image/webp", "webp"],
  ]);
  const ext = allowed.get(mime);
  if (!ext) {
    return NextResponse.json(
      { ok: false, error: "Unsupported file type. Use JPG, PNG, or WEBP." },
      { status: 415 }
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const id = crypto.randomBytes(16).toString("hex");
  const filename = `${Date.now()}-${id}.${ext}`;

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, filename), bytes);

  return NextResponse.json({ ok: true, url: `/uploads/${filename}` });
}
