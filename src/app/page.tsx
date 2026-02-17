import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen text-white">
      <header className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-cyan-200/80">Malamulele</div>
            <div className="text-2xl font-extrabold tracking-tight">Mr Tech</div>
            <div className="mt-1 text-sm text-white/70">
              Opposite Traffic Department • Red container
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-bold"
              href="/stock"
            >
              View stock
            </a>
            <a
              className="rounded-xl bg-white px-4 py-2 font-bold text-black"
              href="tel:0648440825"
            >
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
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-14">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/92 via-slate-950/70 to-slate-950/92" />
            <div className="absolute -inset-20 bg-gradient-to-tr from-cyan-400/18 via-violet-500/12 to-emerald-400/10 blur-3xl" />
            <div className="absolute inset-0 opacity-35 [mask-image:radial-gradient(600px_320px_at_30%_0%,black,transparent)]">
              <Image
                src="/circuit-bg.svg"
                alt=""
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-black/30 px-3 py-1 text-xs font-extrabold text-cyan-100/90">
                Repairs • Refurbished • Accessories
              </div>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight">
                Laptop & PC repair specialists in Malamulele.
              </h1>
              <p className="mt-3 text-white/70">
                Diagnostics, Windows installation, upgrades (SSD/RAM), virus removal, and quality refurbished computers.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link className="rounded-xl bg-white px-4 py-3 font-bold text-black" href="/stock">
                  See available stock
                </Link>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-sm font-bold text-cyan-200/80">Fast diagnostics</div>
                  <div className="mt-1 text-sm text-white/70">Know the problem before you pay.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-sm font-bold text-violet-200/80">Upgrades</div>
                  <div className="mt-1 text-sm text-white/70">SSD + RAM to boost speed.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-sm font-bold text-emerald-200/80">Refurbished deals</div>
                  <div className="mt-1 text-sm text-white/70">Work, school, and home PCs.</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-tr from-cyan-400/20 via-violet-500/15 to-emerald-400/15 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20">
                <Image
                  src="/laptop_troubleshoot.jpg"
                  alt="Laptop troubleshooting"
                  width={1000}
                  height={700}
                  sizes="(max-width: 1024px) 100vw, 420px"
                  quality={60}
                  priority
                  className="h-72 w-full object-cover opacity-95"
                />
                <div className="p-4">
                  <div className="text-sm font-bold text-white/80">Workshop</div>
                  <div className="mt-1 text-sm text-white/70">
                    Bring your laptop or desktop for checks, repairs, and upgrades.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-lg font-extrabold">Repair services</div>
              <div className="mt-2 text-sm text-white/70">
                Troubleshooting, installations, upgrades, and hardware repairs.
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-lg font-extrabold">Refurbished deals</div>
              <div className="mt-2 text-sm text-white/70">
                Reliable PCs & laptops for work, school, and home.
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-lg font-extrabold">Accessories</div>
              <div className="mt-2 text-sm text-white/70">
                Chargers, keyboards, mice, cables, storage, and more.
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-xl font-extrabold">Location</div>
            <div className="mt-2 text-white/70">
              Malamulele, opposite the Traffic Department, in the red container.
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-xl font-extrabold">Contact</div>
            <div className="mt-2 text-white/70">Phone: 0648440825</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a className="rounded-xl bg-white px-4 py-2 font-bold text-black" href="tel:0648440825">
                Call
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
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-cyan-200/80">Workshop</div>
              <div className="text-2xl font-extrabold tracking-tight">Laptop repair gallery</div>
              <div className="mt-1 text-sm text-white/70">
                A quick look at the kind of work we do: diagnostics, upgrades, and repairs.
              </div>
            </div>
            <Link className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-bold" href="/stock">
              See stock
            </Link>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
              <Image
                src="/laptop_repair.jpg"
                alt="Laptop repair"
                width={1200}
                height={800}
                sizes="(max-width: 768px) 100vw, 33vw"
                quality={55}
                className="h-56 w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
              <Image
                src="/laptop_troubleshoot.jpg"
                alt="Laptop troubleshooting"
                width={1200}
                height={800}
                sizes="(max-width: 768px) 100vw, 33vw"
                quality={55}
                className="h-56 w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
              <Image
                src="/broken_screen.jpg"
                alt="Broken screen repair"
                width={1200}
                height={800}
                sizes="(max-width: 768px) 100vw, 33vw"
                quality={60}
                className="h-56 w-full object-cover"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
