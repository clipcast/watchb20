"use client";

import { MintForm } from "@/components/mint/MintForm";
import { BurnForm } from "@/components/mint/BurnForm";

export default function MintPage({
  params,
}: {
  params: { address: string };
}) {
  const address = params.address as `0x${string}`;

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "2rem" }}>
      <h1>Mint / Burn</h1>
      <p style={{ fontFamily: "monospace", opacity: 0.7 }}>{address}</p>
      <MintForm address={address} />
      <BurnForm address={address} />
    </main>
  );
}
