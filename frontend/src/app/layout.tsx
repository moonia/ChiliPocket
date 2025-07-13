"use client";

import type { Metadata } from "next";
import "./globals.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";

// export const metadata: Metadata = {
//   title: "ChiliPocket",
//   description: "ChiliPocket website",
//   icons: {
//     icon: "/chili-pocket.png",
//     shortcut: "/chili-pocket.png",
//     apple: "/chili-pocket.png",
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThirdwebProvider activeChain={Sepolia}>
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}
