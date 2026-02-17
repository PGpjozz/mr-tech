import { requireAdmin } from "@/lib/auth";
import { AdminProducts, LoginForm } from "./AdminClient";
import Link from "next/link";
import Image from "next/image";

export default async function AdminPage() {
  const isAdmin = await requireAdmin();

  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-cyan-200/80">Owner panel</div>
            <div className="text-2xl font-extrabold tracking-tight">Mr Tech Admin</div>
          </div>
          <Link className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-bold" href="/">
            Back to website
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
          <div>{isAdmin ? <AdminProducts /> : <LoginForm />}</div>

          <aside className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="absolute -inset-10 rounded-[40px] bg-gradient-to-tr from-cyan-400/20 via-violet-500/15 to-emerald-400/15 blur-2xl" />
            <Image
              src="/tech-hero.svg"
              alt="Tech illustration"
              width={1200}
              height={900}
              className="relative w-full rounded-2xl border border-white/10 bg-black/20 p-2"
            />
            <div className="relative mt-4 text-sm text-white/70">
              Add products, set “In stock / Out of stock”, and paste image links to make your stock page look professional.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
