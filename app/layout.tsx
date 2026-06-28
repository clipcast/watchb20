import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WatchB20 | B20 Token Launcher on Base",
  description: "Deploy, track, mint, and transfer B20 tokens on Base",
  other: {
    "virtual-protocol-site-verification": "bf1a98520986ee21221195a0fe4a8232",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#07080d] text-white min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
