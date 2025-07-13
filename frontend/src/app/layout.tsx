"use client";

import "./globals.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";

const chilizSpicyTestnet = {
  chainId: 88882,
  name: "Chiliz Spicy Testnet",
  chain: "Chiliz",
  shortName: "CHZ",
  slug: "chiliz-spicy-testnet",
  nativeCurrency: {
    name: "CHZ",
    symbol: "CHZ",
    decimals: 18,
  },
  rpc: [process.env.NEXT_PUBLIC_CHILIZ_RPC_URL || ""],
  explorers: [
    {
      name: "Chiliz Spicy Explorer",
      url: "https://spicy-explorer.chiliz.com",
      standard: "EIP3091",
    },
  ],
  testnet: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThirdwebProvider 
          activeChain={chilizSpicyTestnet}
          clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
        >
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}
