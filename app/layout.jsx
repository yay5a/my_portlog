import React from "react";
import Nav from "@/components/Nav";
import Particles from "@/components/Particles";
import "./globals.css";
import { SiGithub } from "react-icons/si";
import { SiLinkedin } from "react-icons/si";
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
                    <section className="py-8 text-center">
                        <p className="mt-8 text-lg">
                            You can also find me on these other platforms:
                        </p>
                        <ul className="list-disc font-mono mt-4 space-y-2 inline-block text-left">
                            <li>
                                <a
                                    href="https://github.com/yay5a"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    <SiGithub />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.linkedin.com/in/mohammed-bhimjee"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    <SiLinkedin />
                                </a>
                            </li>
                        </ul>
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
