import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

type UpdateProductBody = {
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

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const body = (await req.json().catch(() => null)) as UpdateProductBody | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  if (body.category && body.category !== "REFURB" && body.category !== "ACCESSORY") {
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

  const warrantyDays = parseOptionalInt(body.warrantyDays);
  if (warrantyDays !== undefined && warrantyDays !== null && warrantyDays < 0) {
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

  const priceCents = body.price === undefined ? undefined : parsePriceToCents(body.price);

  try {
    const prisma = getPrisma();
    const updated = await prisma.product.update({
      where: { id },
      data: {
        category: body.category,
        name: body.name !== undefined ? String(body.name) : undefined,
        brand:
          body.brand === undefined
            ? undefined
            : String(body.brand) === ""
              ? null
              : String(body.brand),
        model:
          body.model === undefined
            ? undefined
            : String(body.model) === ""
              ? null
              : String(body.model),
        condition: body.condition,
        warrantyDays,
        featured: featured === null ? undefined : featured,
        cpu:
          body.cpu === undefined
            ? undefined
            : String(body.cpu) === ""
              ? null
              : String(body.cpu),
        ramGb,
        storageGb,
        storageType: body.storageType,
        screenInches,
        os:
          body.os === undefined
            ? undefined
            : String(body.os) === ""
              ? null
              : String(body.os),
        accessoryType:
          body.accessoryType === undefined
            ? undefined
            : String(body.accessoryType) === ""
              ? null
              : String(body.accessoryType),
        compatibility:
          body.compatibility === undefined
            ? undefined
            : String(body.compatibility) === ""
              ? null
              : String(body.compatibility),
        quantity: quantity === null ? undefined : quantity,
        notes:
          body.notes === undefined
            ? undefined
            : String(body.notes) === ""
              ? null
              : String(body.notes),
        imageUrl:
          body.imageUrl === undefined
            ? undefined
            : String(body.imageUrl) === ""
              ? null
              : String(body.imageUrl),
        priceCents,
        status: body.status,
      },
    });

    return NextResponse.json({ ok: true, product: updated });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update product";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  try {
    const prisma = getPrisma();
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to delete product";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
