import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

function formatPrice(cents: number) {
  return `R ${Math.round(cents / 100)}`;
}

export default async function StockPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });

  const refurb = products.filter((p: Product) => p.category === "REFURB");
  const accessories = products.filter((p: Product) => p.category === "ACCESSORY");

  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <h1 className="text-3xl font-extrabold">Stock</h1>
            <p className="mt-1 text-sm text-white/70">
              Updated items from Mr Tech. For prices and availability, call or WhatsApp.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-tr from-cyan-400/20 via-violet-500/15 to-emerald-400/15 blur-2xl" />
            <Image
              src="/tech-hero.svg"
              alt="Tech illustration"
              width={1200}
              height={900}
              className="relative w-full rounded-3xl border border-white/10 bg-black/20 p-2"
              priority={false}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link className="rounded-xl bg-white px-4 py-2 font-bold text-black" href="/">
            Home
          </Link>
          <a className="rounded-xl bg-white px-4 py-2 font-bold text-black" href="tel:0648440825">
            Call 0648440825
          </a>
          <a
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-bold"
            href="https://wa.me/27648440825"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </div>

        <div className="mt-8 grid gap-8">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-extrabold">Refurbished PCs & Laptops</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {refurb.map((p: Product) => (
                <article
                  key={p.id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  {p.imageUrl ? (
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      width={1200}
                      height={800}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      quality={60}
                      className="mb-3 h-40 w-full rounded-xl object-cover"
                    />
                  ) : null}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-extrabold">{p.name}</div>
                      {p.notes ? (
                        <div className="mt-1 text-sm text-white/70">{p.notes}</div>
                      ) : null}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-extrabold">{formatPrice(p.priceCents)}</div>
                      <div className="mt-1 text-xs text-white/60">
                        {p.status === "OUT_OF_STOCK" ? "Out of stock" : "In stock"}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
              {refurb.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-white/70">
                  No refurbished items yet.
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-extrabold">Accessories</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {accessories.map((p: Product) => (
                <article
                  key={p.id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  {p.imageUrl ? (
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      width={1200}
                      height={800}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      quality={60}
                      className="mb-3 h-40 w-full rounded-xl object-cover"
                    />
                  ) : null}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-extrabold">{p.name}</div>
                      {p.notes ? (
                        <div className="mt-1 text-sm text-white/70">{p.notes}</div>
                      ) : null}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-extrabold">{formatPrice(p.priceCents)}</div>
                      <div className="mt-1 text-xs text-white/60">
                        {p.status === "OUT_OF_STOCK" ? "Out of stock" : "In stock"}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
              {accessories.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-white/70">
                  No accessories yet.
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
