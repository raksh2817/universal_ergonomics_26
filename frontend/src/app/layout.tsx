import type { Metadata } from "next";
import "@/styles/globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: {
    default: "Universal Ergonomics | Premium Office Chairs - Bangalore",
    template: "%s | Universal Ergonomics",
  },
  description:
    "Factory-direct office chairs with free 48-hour delivery and on-site assembly in Bangalore. Executive, ergonomic, gaming, and bulk B2B chairs.",
  keywords: [
    "office chairs bangalore",
    "ergonomic chairs india",
    "buy office chair online",
    "bulk office furniture",
    "gaming chair bangalore",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
