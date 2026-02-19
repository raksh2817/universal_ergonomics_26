import type { Metadata } from "next";
import "@/styles/globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: {
    default: "Universal Ergonomics | Premium Ergonomic Seating",
    template: "%s | Universal Ergonomics",
  },
  description:
    "Premium ergonomic office chairs. Factory-direct pricing with free delivery and on-site assembly. Executive, ergonomic, gaming, and wholesale chairs.",
  keywords: [
    "ergonomic chairs",
    "office chairs",
    "gaming chairs",
    "wholesale furniture",
    "premium seating",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-[#111318] antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
