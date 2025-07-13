import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChiliPocket",
  description: "ChiliPocket website",
  icons: {
    icon: "/chili-pocket.png",
    shortcut: "/chili-pocket.png",
    apple: "/chili-pocket.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
