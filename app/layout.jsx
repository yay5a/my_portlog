import React from "react";
import Nav from "@/components/Nav";
import Particles from "@/components/Particles";
import "./globals.css";

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
                <footer>
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
