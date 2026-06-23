import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "watchb20 — B20 on Base",
  description: "Deploy, track, mint/burn & transfer B20 tokens on Base",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
