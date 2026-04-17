import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "opsz"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nonno Franco — Ristorante Italiano",
  description:
    "Italienisches Restaurant in Ulm. Authentische italienische Küche mit frischen Zutaten und hausgemachter Pasta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>
        <div className="page-wrap">
          <Nav />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
