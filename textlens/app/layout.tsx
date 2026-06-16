import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TextLens — AI Text Summarizer",
  description:
    "Paste any text and get an AI summary, key points, and sentiment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
