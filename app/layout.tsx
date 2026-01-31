import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digibiz - Lean AI Consultant",
  description: "AI-powered Lean consulting platform for SMEs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

