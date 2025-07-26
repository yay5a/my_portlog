import React from "react";
import Nav from "@/components/Nav";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Yaysa's Holocron",
  description: "Yaysa's Holocron - A showcase of my work and skills as a developer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Nav />
        {children}
    <footer>
      <div className="container mx-auto py-4 text-center">
        <p className="text-sm text-foreground/70">
          © {new Date().getFullYear()} Yaysa's Holo-folio. All rights reserved.
        </p>
      </div>
    </footer>
      </body>
    </html>
  );
}
