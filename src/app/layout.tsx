import type { Metadata, Viewport } from "next";
import { DM_Sans, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EcoModern Living | Sustainable Solutions for Modern Living",
    template: "%s | EcoModern Living",
  },
  description:
    "AI-powered sustainable living platform — eco products, passive house guides, energy audits, and green home consulting.",
  metadataBase: new URL("https://ecomodernliving.ai"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}><body className="min-h-screen flex flex-col overflow-x-hidden">
      <AuthProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </AuthProvider>
    </body></html>
  );
}
