import React from "react";
import Nav from "@/components/Nav";
import Particles from "@/components/Particles";
import "./globals.css";
import SocialLinks from "./components/SocialLinks";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
    title: "Yaysa's Portfolio-log",
    description:
        "Yaysa's Portfolio-log - A showcase of my work and skills as a developer.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="antialiased">
                <Particles />
                <Nav />
                {children}
                <SpeedInsights />
                <Analytics />
                <footer>
                    {/* Social Links Section */}
                    <section
                        aria-labelledby="connect-heading"
                        className="mt-16 mb-10 flex flex-col items-center gap-10"
                    >
                        <div className="mt-10 pt-6 border-t border-slate-700/60">
                            <SocialLinks />
                        </div>
                    </section>
                    <div className="container py-4 mx-auto text-center">
                        <p className="text-sm text-foreground/70">
                            © {new Date().getFullYear()} Yaysa&apos;s
                            Portfolio-log. All rights reserved.
                        </p>
                    </div>
                </footer>
            </body>
        </html>
    );
}
