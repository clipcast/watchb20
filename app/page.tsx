import Link from "next/link";
import { ConnectWallet } from "@/components/ConnectWallet";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>watchb20</h1>
        <ConnectWallet />
      </header>
      <p>Deploy, track, mint/burn &amp; transfer B20 tokens on Base.</p>
      <nav style={{ display: "grid", gap: "0.75rem", marginTop: "2rem" }}>
        <Link href="/deploy">→ Deploy a new B20 token</Link>
        <Link href="/transfer">→ Transfer &amp; payment</Link>
      </nav>
    </main>
  );
}
