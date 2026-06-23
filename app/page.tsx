export const dynamic = "force-dynamic";

import Link from "next/link";
import { ConnectWallet } from "@/components/ConnectWallet";

interface Feature {
  title: string;
  desc: string;
  href: string;
}

const FEATURES: Feature[] = [
  { title: "Deploy", desc: "Launch a new B20 token in seconds.", href: "/deploy" },
  { title: "Track", desc: "Monitor supply, holders, and stats.", href: "/tracker" },
  { title: "Mint / Burn", desc: "Manage token supply with roles.", href: "/mint" },
  { title: "Transfer", desc: "Send tokens, batch with smart wallet.", href: "/transfer" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#07080d] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.08)]">
        <span className="font-bold text-lg">WatchB20</span>
        <ConnectWallet />
      </nav>

      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Launch a B20 Token on Base
        </h1>
        <p className="mt-5 text-lg text-[rgba(200,196,188,0.6)]">
          Deploy, track, mint, and transfer — no contract writing required.
        </p>
        <Link
          href="/deploy"
          className="inline-block mt-8 wb-btn wb-btn-primary text-base px-6"
        >
          Launch Your Token
        </Link>
      </section>

      <section className="px-6 pb-24 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="wb-card p-6 transition hover:border-[#3b82f6]"
          >
            <h3 className="text-xl font-semibold text-[#3b82f6]">{f.title}</h3>
            <p className="mt-2 text-sm text-[rgba(200,196,188,0.6)]">{f.desc}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
