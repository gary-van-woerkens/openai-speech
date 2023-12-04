import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import "./globals.css";

const openSans = Open_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "OpenAI Speech",
  description: "Make ChatGPT raise its voice!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${openSans.variable}`}>{children}</body>
    </html>
  );
}
