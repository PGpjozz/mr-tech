import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mr Tech | Laptop & Computer Repair | Malamulele",
  description:
    "Mr Tech: Laptop & computer repairs, refurbished PCs & laptops, and computer accessories in Malamulele (opposite Traffic Department, red container). Call 0648440825.",
  icons: {
    icon: "/Mr tech logo.jpg",
    apple: "/Mr tech logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const year = new Date().getFullYear();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3">
              <Link className="flex items-center gap-3" href="/">
                <Image
                  src="/Mr tech logo.jpg"
                  alt="Mr Tech logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-lg border border-white/10 bg-black/20 object-cover"
                  priority
                />
                <div className="leading-tight">
                  <div className="text-sm font-extrabold tracking-tight text-white">Mr Tech</div>
                  <div className="text-xs text-white/60">Laptop & Computer Repair</div>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <Link className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-black" href="/stock">
                  Stock
                </Link>
              </div>
            </div>
          </header>

          {children}

          <footer className="mt-14 border-t border-white/10 bg-black/20 text-white">
            <div className="mx-auto w-full max-w-6xl px-6 py-10">
              <div className="grid gap-8 md:grid-cols-[1.2fr_.8fr_.8fr]">
                <div>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/Mr tech logo.jpg"
                      alt="Mr Tech logo"
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-lg border border-white/10 bg-black/20 object-cover"
                    />
                    <div className="text-sm font-bold text-cyan-200/80">Mr Tech</div>
                  </div>
                  <div className="mt-2 text-2xl font-extrabold tracking-tight">
                    Laptop & Computer Repair
                  </div>
                  <div className="mt-2 text-sm text-white/70">
                    Malamulele, opposite Traffic Department, in the red container.
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
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

                <div>
                  <div className="text-sm font-extrabold text-white/80">Quick links</div>
                  <div className="mt-3 grid gap-2 text-sm">
                    <Link className="text-white/70 hover:text-white" href="/">
                      Home
                    </Link>
                    <Link className="text-white/70 hover:text-white" href="/stock">
                      Stock
                    </Link>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-extrabold text-white/80">What we do</div>
                  <div className="mt-3 grid gap-2 text-sm text-white/70">
                    <div>Diagnostics & troubleshooting</div>
                    <div>Windows install & software setup</div>
                    <div>SSD/RAM upgrades</div>
                    <div>Refurbished PCs & laptops</div>
                    <div>Computer accessories</div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/60">
                <div>© {year} Mr Tech. All rights reserved.</div>
                <div className="text-white/50">Developed by Pjozz Technologies</div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
