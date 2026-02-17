import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

type CreateProductBody = {
  category?: "REFURB" | "ACCESSORY";
  name?: unknown;
  brand?: unknown;
  model?: unknown;
  condition?: "NEW" | "GOOD" | "FAIR";
  warrantyDays?: unknown;
  featured?: unknown;
  cpu?: unknown;
  ramGb?: unknown;
  storageGb?: unknown;
  storageType?: "SSD" | "HDD";
  screenInches?: unknown;
  os?: unknown;
  accessoryType?: unknown;
  compatibility?: unknown;
  quantity?: unknown;
  notes?: unknown;
  imageUrl?: unknown;
  price?: unknown;
  status?: "IN_STOCK" | "OUT_OF_STOCK";
};

function parsePriceToCents(value: unknown) {
  if (typeof value === "number") return Math.round(value * 100);
  const s = String(value ?? "").trim();
  if (!s) return 0;
  const cleaned = s.replace(/[^0-9.]/g, "");
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

function parseOptionalInt(value: unknown) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const n = typeof value === "number" ? value : Number(String(value).trim());
  if (!Number.isFinite(n)) return undefined;
  return Math.trunc(n);
}

function parseOptionalFloat(value: unknown) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const n = typeof value === "number" ? value : Number(String(value).trim());
  if (!Number.isFinite(n)) return undefined;
  return n;
}

function parseOptionalBool(value: unknown) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === "boolean") return value;
  const s = String(value).trim().toLowerCase();
  if (s === "true") return true;
  if (s === "false") return false;
  return undefined;
}

export async function GET() {
  const isAdmin = await requireAdmin();
  if (!isAdmin) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: [{ updatedAt: "desc" }],
    });
    return NextResponse.json({ ok: true, products });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load products";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = (await req.json().catch(() => null)) as CreateProductBody | null;
  if (!body?.name || !body?.category) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }

  if (body.category !== "REFURB" && body.category !== "ACCESSORY") {
    return NextResponse.json({ ok: false, error: "Invalid category" }, { status: 400 });
  }

  if (body.status && body.status !== "IN_STOCK" && body.status !== "OUT_OF_STOCK") {
    return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
  }

  if (body.condition && body.condition !== "NEW" && body.condition !== "GOOD" && body.condition !== "FAIR") {
    return NextResponse.json({ ok: false, error: "Invalid condition" }, { status: 400 });
  }

  if (body.storageType && body.storageType !== "SSD" && body.storageType !== "HDD") {
    return NextResponse.json({ ok: false, error: "Invalid storage type" }, { status: 400 });
  }

  const warrantyDays = parseOptionalInt(body.warrantyDays) ?? null;
  if (warrantyDays !== null && warrantyDays < 0) {
    return NextResponse.json({ ok: false, error: "Invalid warrantyDays" }, { status: 400 });
  }

  const quantity = parseOptionalInt(body.quantity);
  if (quantity !== undefined && quantity !== null && quantity < 0) {
    return NextResponse.json({ ok: false, error: "Invalid quantity" }, { status: 400 });
  }

  const ramGb = parseOptionalInt(body.ramGb);
  if (ramGb !== undefined && ramGb !== null && ramGb < 0) {
    return NextResponse.json({ ok: false, error: "Invalid ramGb" }, { status: 400 });
  }

  const storageGb = parseOptionalInt(body.storageGb);
  if (storageGb !== undefined && storageGb !== null && storageGb < 0) {
    return NextResponse.json({ ok: false, error: "Invalid storageGb" }, { status: 400 });
  }

  const screenInches = parseOptionalFloat(body.screenInches);
  if (screenInches !== undefined && screenInches !== null && screenInches < 0) {
    return NextResponse.json({ ok: false, error: "Invalid screenInches" }, { status: 400 });
  }

  const featured = parseOptionalBool(body.featured);

  try {
    const created = await prisma.product.create({
      data: {
        category: body.category,
        name: String(body.name),
        brand: body.brand ? String(body.brand) : null,
        model: body.model ? String(body.model) : null,
        condition: body.condition ?? null,
        warrantyDays,
        featured: featured ?? false,
        cpu: body.cpu ? String(body.cpu) : null,
        ramGb: ramGb ?? null,
        storageGb: storageGb ?? null,
        storageType: body.storageType ?? null,
        screenInches: screenInches ?? null,
        os: body.os ? String(body.os) : null,
        accessoryType: body.accessoryType ? String(body.accessoryType) : null,
        compatibility: body.compatibility ? String(body.compatibility) : null,
        quantity: quantity ?? 1,
        notes: body.notes ? String(body.notes) : null,
        imageUrl: body.imageUrl ? String(body.imageUrl) : null,
        priceCents: parsePriceToCents(body.price),
        status: body.status ?? "IN_STOCK",
      },
    });

    return NextResponse.json({ ok: true, product: created });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create product";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
