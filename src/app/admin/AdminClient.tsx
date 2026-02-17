"use client";

import { useEffect, useMemo, useState } from "react";

type Category = "REFURB" | "ACCESSORY";
type Status = "IN_STOCK" | "OUT_OF_STOCK";
type Condition = "NEW" | "GOOD" | "FAIR";
type StorageType = "SSD" | "HDD";

type Product = {
  id: string;
  category: Category;
  name: string;
  brand: string | null;
  model: string | null;
  condition: Condition | null;
  warrantyDays: number | null;
  featured: boolean;
  cpu: string | null;
  ramGb: number | null;
  storageGb: number | null;
  storageType: StorageType | null;
  screenInches: number | null;
  os: string | null;
  accessoryType: string | null;
  compatibility: string | null;
  quantity: number;
  notes: string | null;
  imageUrl: string | null;
  priceCents: number;
  status: Status;
  updatedAt: string;
};

function formatPrice(cents: number) {
  if (!Number.isFinite(cents)) return "";
  return `R ${(cents / 100).toFixed(0)}`;
}

function toInputPrice(cents: number) {
  if (!Number.isFinite(cents)) return "";
  return String(Math.round(cents / 100));
}

function toInputInt(n: number | null) {
  if (n === null) return "";
  if (!Number.isFinite(n)) return "";
  return String(Math.trunc(n));
}

function toInputFloat(n: number | null) {
  if (n === null) return "";
  if (!Number.isFinite(n)) return "";
  return String(n);
}

async function api<T>(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = (isJson
    ? ((await res.json().catch(() => null)) as T)
    : ((await res.text().catch(() => "")) as unknown as T));

  if (!res.ok) {
    const jsonMessage =
      isJson && typeof (data as { error?: unknown } | null)?.error === "string"
        ? String((data as { error?: unknown }).error)
        : null;
    const message = jsonMessage ?? `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      window.location.reload();
    } catch {
      setError("Wrong password");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-xl font-bold">Admin login</h1>
      <p className="mt-1 text-sm text-white/70">Enter the admin password to manage stock.</p>

      <form className="mt-5 space-y-3" onSubmit={onSubmit}>
        <input
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          autoFocus
        />
        {error ? <div className="text-sm text-red-300">{error}</div> : null}
        <button
          className="w-full rounded-xl bg-white px-4 py-3 font-bold text-black disabled:opacity-60"
          disabled={busy}
          type="submit"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");
  const [uploadBusy, setUploadBusy] = useState(false);
  const [draft, setDraft] = useState({
    category: "REFURB" as Category,
    name: "",
    brand: "",
    model: "",
    condition: "GOOD" as Condition,
    warrantyDays: "",
    featured: false,
    cpu: "",
    ramGb: "",
    storageGb: "",
    storageType: "SSD" as StorageType,
    screenInches: "",
    os: "",
    accessoryType: "",
    compatibility: "",
    quantity: "1",
    notes: "",
    imageUrl: "",
    price: "",
    status: "IN_STOCK" as Status,
  });

  async function uploadDraftImage(file: File) {
    setUploadBusy(true);
    setCreateError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; url: string }
        | { ok: false; error?: string }
        | null;
      if (!res.ok || !data || data.ok !== true) {
        throw new Error(data && "error" in data && typeof data.error === "string" ? data.error : "Upload failed");
      }
      setDraft((d) => ({ ...d, imageUrl: data.url }));
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploadBusy(false);
    }
  }

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    let list = products;
    if (categoryFilter !== "ALL") list = list.filter((p) => p.category === categoryFilter);
    if (statusFilter !== "ALL") list = list.filter((p) => p.status === statusFilter);
    if (!q) return list;
    return list.filter((p) =>
      `${p.name} ${p.brand ?? ""} ${p.model ?? ""} ${p.cpu ?? ""} ${p.os ?? ""} ${p.notes ?? ""} ${p.accessoryType ?? ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [products, filter, categoryFilter, statusFilter]);

  async function load() {
    setBusy(true);
    setLoadError(null);
    try {
      const data = await api<{ ok: true; products: Product[] }>("/api/admin/products");
      setProducts(data.products);
    } catch (e) {
      setProducts([]);
      setLoadError(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function createProduct() {
    setBusy(true);
    setCreateError(null);
    try {
      await api("/api/admin/products", {
        method: "POST",
        body: JSON.stringify({
          ...draft,
          notes: draft.notes || null,
          imageUrl: draft.imageUrl || null,
          brand: draft.brand || null,
          model: draft.model || null,
          warrantyDays: draft.warrantyDays || null,
          cpu: draft.cpu || null,
          ramGb: draft.ramGb || null,
          storageGb: draft.storageGb || null,
          screenInches: draft.screenInches || null,
          os: draft.os || null,
          accessoryType: draft.accessoryType || null,
          compatibility: draft.compatibility || null,
          quantity: draft.quantity || 1,
        }),
      });
      setDraft({
        category: "REFURB",
        name: "",
        brand: "",
        model: "",
        condition: "GOOD",
        warrantyDays: "",
        featured: false,
        cpu: "",
        ramGb: "",
        storageGb: "",
        storageType: "SSD",
        screenInches: "",
        os: "",
        accessoryType: "",
        compatibility: "",
        quantity: "1",
        notes: "",
        imageUrl: "",
        price: "",
        status: "IN_STOCK",
      });
      await load();
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : "Failed to add item");
    } finally {
      setBusy(false);
    }
  }

  async function updateProduct(id: string, patch: Partial<Product> & { price?: string }) {
    setBusy(true);
    try {
      await api(`/api/admin/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(patch),
      });
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this item?")) return;
    setBusy(true);
    try {
      await api(`/api/admin/products/${id}`, { method: "DELETE" });
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    try {
      await api("/api/admin/logout", { method: "POST" });
      window.location.reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Stock admin</h1>
          <p className="mt-1 text-sm text-white/70">Add and update refurbished PCs/laptops and accessories.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-bold"
            onClick={() => void load()}
            disabled={busy}
            type="button"
          >
            Refresh
          </button>
          <button
            className="rounded-xl bg-white px-4 py-2 font-bold text-black"
            onClick={() => void logout()}
            disabled={busy}
            type="button"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_380px]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Current items</h2>
            <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-[160px_160px_280px]">
              <select
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as Category | "ALL")}
              >
                <option value="ALL">All categories</option>
                <option value="REFURB">Refurbished</option>
                <option value="ACCESSORY">Accessories</option>
              </select>
              <select
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Status | "ALL")}
              >
                <option value="ALL">All status</option>
                <option value="IN_STOCK">In stock</option>
                <option value="OUT_OF_STOCK">Out of stock</option>
              </select>
              <input
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 outline-none"
                placeholder="Search..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>

          {loadError ? (
            <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
              {loadError}
            </div>
          ) : null}

          <div className="mt-4 space-y-3">
            {filtered.map((p) => (
              <div key={p.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-white/60">
                      {p.category} • {p.status}{p.featured ? " • Featured" : ""}
                    </div>
                    <div className="text-lg font-extrabold">{p.name}</div>
                    {p.notes ? <div className="mt-1 text-sm text-white/70">{p.notes}</div> : null}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold">{formatPrice(p.priceCents)}</div>
                    <div className="text-xs text-white/50">Updated {new Date(p.updatedAt).toLocaleString()}</div>
                  </div>
                </div>

                {p.imageUrl ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                    <div
                      className="aspect-[16/9] w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${p.imageUrl})` }}
                    />
                  </div>
                ) : null}

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold"
                    onClick={() => void updateProduct(p.id, { status: "IN_STOCK" })}
                    disabled={busy}
                    type="button"
                  >
                    Mark in stock
                  </button>
                  <button
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold"
                    onClick={() => void updateProduct(p.id, { status: "OUT_OF_STOCK" })}
                    disabled={busy}
                    type="button"
                  >
                    Mark out of stock
                  </button>
                  <button
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold"
                    onClick={() => void updateProduct(p.id, { featured: !p.featured })}
                    disabled={busy}
                    type="button"
                  >
                    {p.featured ? "Unfeature" : "Feature"}
                  </button>
                </div>

                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <label className="grid gap-1 text-sm">
                    <span className="text-white/70">Status</span>
                    <select
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                      value={p.status}
                      onChange={(e) => void updateProduct(p.id, { status: e.target.value as Status })}
                      disabled={busy}
                    >
                      <option value="IN_STOCK">In stock</option>
                      <option value="OUT_OF_STOCK">Out of stock</option>
                    </select>
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="text-white/70">Price (R)</span>
                    <input
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                      defaultValue={toInputPrice(p.priceCents)}
                      onBlur={(e) => void updateProduct(p.id, { price: e.target.value })}
                      disabled={busy}
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="text-white/70">Quantity</span>
                    <input
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                      defaultValue={String(p.quantity ?? 1)}
                      onBlur={(e) => void updateProduct(p.id, { quantity: e.target.value })}
                      disabled={busy}
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="text-white/70">Warranty (days)</span>
                    <input
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                      defaultValue={toInputInt(p.warrantyDays)}
                      onBlur={(e) => void updateProduct(p.id, { warrantyDays: e.target.value })}
                      disabled={busy}
                      placeholder="e.g. 30"
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="text-white/70">Brand</span>
                    <input
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                      defaultValue={p.brand ?? ""}
                      onBlur={(e) => void updateProduct(p.id, { brand: e.target.value })}
                      disabled={busy}
                      placeholder="e.g. Dell"
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="text-white/70">Model</span>
                    <input
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                      defaultValue={p.model ?? ""}
                      onBlur={(e) => void updateProduct(p.id, { model: e.target.value })}
                      disabled={busy}
                      placeholder="e.g. Latitude 5480"
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="text-white/70">Condition</span>
                    <select
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                      defaultValue={p.condition ?? ""}
                      onChange={(e) => void updateProduct(p.id, { condition: (e.target.value || null) as Condition | null })}
                      disabled={busy}
                    >
                      <option value="">Not set</option>
                      <option value="NEW">New</option>
                      <option value="GOOD">Good</option>
                      <option value="FAIR">Fair</option>
                    </select>
                  </label>

                  <label className="grid gap-1 text-sm md:col-span-2">
                    <span className="text-white/70">CPU</span>
                    <input
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                      defaultValue={p.cpu ?? ""}
                      onBlur={(e) => void updateProduct(p.id, { cpu: e.target.value })}
                      disabled={busy}
                      placeholder="e.g. i5-7300U"
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="text-white/70">RAM (GB)</span>
                    <input
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                      defaultValue={toInputInt(p.ramGb)}
                      onBlur={(e) => void updateProduct(p.id, { ramGb: e.target.value })}
                      disabled={busy}
                      placeholder="e.g. 8"
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="text-white/70">Storage (GB)</span>
                    <input
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                      defaultValue={toInputInt(p.storageGb)}
                      onBlur={(e) => void updateProduct(p.id, { storageGb: e.target.value })}
                      disabled={busy}
                      placeholder="e.g. 256"
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="text-white/70">Storage type</span>
                    <select
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                      defaultValue={p.storageType ?? ""}
                      onChange={(e) => void updateProduct(p.id, { storageType: (e.target.value || null) as StorageType | null })}
                      disabled={busy}
                    >
                      <option value="">Not set</option>
                      <option value="SSD">SSD</option>
                      <option value="HDD">HDD</option>
                    </select>
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="text-white/70">Screen (inches)</span>
                    <input
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                      defaultValue={toInputFloat(p.screenInches)}
                      onBlur={(e) => void updateProduct(p.id, { screenInches: e.target.value })}
                      disabled={busy}
                      placeholder="e.g. 14"
                    />
                  </label>

                  <label className="grid gap-1 text-sm md:col-span-2">
                    <span className="text-white/70">OS</span>
                    <input
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                      defaultValue={p.os ?? ""}
                      onBlur={(e) => void updateProduct(p.id, { os: e.target.value })}
                      disabled={busy}
                      placeholder="e.g. Windows 11 Pro"
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="text-white/70">Accessory type</span>
                    <input
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                      defaultValue={p.accessoryType ?? ""}
                      onBlur={(e) => void updateProduct(p.id, { accessoryType: e.target.value })}
                      disabled={busy}
                      placeholder="e.g. Mouse"
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="text-white/70">Compatibility</span>
                    <input
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                      defaultValue={p.compatibility ?? ""}
                      onBlur={(e) => void updateProduct(p.id, { compatibility: e.target.value })}
                      disabled={busy}
                      placeholder="e.g. USB-C / Universal"
                    />
                  </label>

                  <label className="grid gap-1 text-sm md:col-span-2">
                    <span className="text-white/70">Image URL</span>
                    <input
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                      defaultValue={p.imageUrl ?? ""}
                      onBlur={(e) => void updateProduct(p.id, { imageUrl: e.target.value })}
                      disabled={busy}
                      placeholder="https://..."
                    />
                  </label>

                  <label className="grid gap-1 text-sm md:col-span-2">
                    <span className="text-white/70">Notes</span>
                    <input
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                      defaultValue={p.notes ?? ""}
                      onBlur={(e) => void updateProduct(p.id, { notes: e.target.value })}
                      disabled={busy}
                      placeholder="Specs, condition, warranty, etc"
                    />
                  </label>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 font-bold text-red-200"
                    onClick={() => void deleteProduct(p.id)}
                    disabled={busy}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-white/70">
                No items yet.
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg font-bold">Add new item</h2>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Category</span>
              <select
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                value={draft.category}
                onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value as Category }))}
              >
                <option value="REFURB">Refurbished</option>
                <option value="ACCESSORY">Accessory</option>
              </select>
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Name</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none"
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="e.g. Dell Latitude 5480"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Price (R)</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none"
                value={draft.price}
                onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                placeholder="e.g. 3500"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Status</span>
              <select
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                value={draft.status}
                onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as Status }))}
              >
                <option value="IN_STOCK">In stock</option>
                <option value="OUT_OF_STOCK">Out of stock</option>
              </select>
            </label>

            <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm">
              <span className="text-white/70">Featured</span>
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => setDraft((d) => ({ ...d, featured: e.target.checked }))}
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Brand (optional)</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none"
                value={draft.brand}
                onChange={(e) => setDraft((d) => ({ ...d, brand: e.target.value }))}
                placeholder="e.g. Dell"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Model (optional)</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none"
                value={draft.model}
                onChange={(e) => setDraft((d) => ({ ...d, model: e.target.value }))}
                placeholder="e.g. Latitude 5480"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Condition</span>
              <select
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                value={draft.condition}
                onChange={(e) => setDraft((d) => ({ ...d, condition: e.target.value as Condition }))}
              >
                <option value="NEW">New</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
              </select>
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Warranty (days)</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none"
                value={draft.warrantyDays}
                onChange={(e) => setDraft((d) => ({ ...d, warrantyDays: e.target.value }))}
                placeholder="e.g. 30"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Quantity</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none"
                value={draft.quantity}
                onChange={(e) => setDraft((d) => ({ ...d, quantity: e.target.value }))}
                placeholder="e.g. 1"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">CPU (optional)</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none"
                value={draft.cpu}
                onChange={(e) => setDraft((d) => ({ ...d, cpu: e.target.value }))}
                placeholder="e.g. i5-7300U"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">RAM (GB)</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none"
                value={draft.ramGb}
                onChange={(e) => setDraft((d) => ({ ...d, ramGb: e.target.value }))}
                placeholder="e.g. 8"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Storage (GB)</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none"
                value={draft.storageGb}
                onChange={(e) => setDraft((d) => ({ ...d, storageGb: e.target.value }))}
                placeholder="e.g. 256"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Storage type</span>
              <select
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                value={draft.storageType}
                onChange={(e) => setDraft((d) => ({ ...d, storageType: e.target.value as StorageType }))}
              >
                <option value="SSD">SSD</option>
                <option value="HDD">HDD</option>
              </select>
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Screen (inches)</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none"
                value={draft.screenInches}
                onChange={(e) => setDraft((d) => ({ ...d, screenInches: e.target.value }))}
                placeholder="e.g. 14"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">OS (optional)</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none"
                value={draft.os}
                onChange={(e) => setDraft((d) => ({ ...d, os: e.target.value }))}
                placeholder="e.g. Windows 11 Pro"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Accessory type (optional)</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none"
                value={draft.accessoryType}
                onChange={(e) => setDraft((d) => ({ ...d, accessoryType: e.target.value }))}
                placeholder="e.g. Mouse"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Compatibility (optional)</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none"
                value={draft.compatibility}
                onChange={(e) => setDraft((d) => ({ ...d, compatibility: e.target.value }))}
                placeholder="e.g. USB-C / Universal"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Image URL (optional)</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none"
                value={draft.imageUrl}
                onChange={(e) => setDraft((d) => ({ ...d, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-white/70">Upload image from device (optional)</span>
              <input
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={uploadBusy || busy}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  void uploadDraftImage(f);
                }}
              />
              <div className="text-xs text-white/60">Uploads to this site and fills the Image URL automatically.</div>
            </label>

            {draft.imageUrl.trim() ? (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                <div
                  className="aspect-[16/9] w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${draft.imageUrl.trim()})` }}
                />
              </div>
            ) : null}

            {createError ? (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {createError}
              </div>
            ) : null}

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Notes (optional)</span>
              <textarea
                className="min-h-24 rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none"
                value={draft.notes}
                onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                placeholder="Specs, condition, included charger, etc"
              />
            </label>

            <button
              className="rounded-xl bg-white px-4 py-3 font-bold text-black disabled:opacity-60"
              onClick={() => void createProduct()}
              disabled={busy || !draft.name.trim() || !draft.price.trim()}
              type="button"
            >
              Add item
            </button>

            <div className="text-xs text-white/60">
              Tip: Use an image URL from Facebook, Google Drive direct link, or an image hosting service.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
