"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { useState } from "react";

export default function ContactForm() {
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(null);

    async function submit(e) {
        e.preventDefault();
        setStatus("Sending…");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message, website: "" }), // website = honeypot
            });

            let data = {};
            try {
                data = await res.json();
            } catch (err) {
                // Non-JSON response
                console.error("Failed to parse response JSON", err);
            }

            if (!res.ok) setStatus(data.error || "Error");
            else {
                setStatus("Sent!");
                setMessage("");
                setName("");
                setEmail("");
            }
        } catch (err) {
            console.error("Contact form submission failed", err);
            setStatus("Error");
        }
    }

    return (
        <section className="relative min-h-screen grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Image
                src="/outlook.jpg"
                alt="Background"
                fill
                className="absolute inset-0 object-cover w-full h-full z-0 opacity-10"
                priority
            />
            <div className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start relative z-10">
                <div className="min-h-screen bg-background/80 text-foreground rounded-xl p-8 shadow-lg">
                    <section className="flex flex-col items-center gap-4 sm:items-start">
                        <h1 className="text-4xl font-bold md:text-6xl text-white mb-4">
                            Ping me,
                        </h1>
                        <Image
                            src="/card_logo.png"
                            alt="Logo"
                            width={500}
                            height={500}
                        />
                    </section>
                    <br />
                    <p className="text-foreground/70 text-lg sm:text-xl max-w-2xl mb-8 tracking-[-.01em]">
                        to collaborate, or just to say hello! I&apos;m always
                        open to connecting with fellow developers and
                        enthusiasts.
                    </p>
                    <section>
                        <form onSubmit={submit} className="space-y-3 max-w-xl">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name (optional)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded border px-3 py-2"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email (optional)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded border px-3 py-2"
                            />
                            {/* Honeypot – hide with CSS, not type="hidden" so bots see it */}
                            <div className="sr-only" aria-hidden="true">
                                <label>
                                    Website
                                    <input
                                        name="website"
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />
                                </label>
                            </div>
                            <textarea
                                required
                                maxLength={280}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Say hi (280 chars max, no links)…"
                                className="w-full rounded border px-3 py-2"
                            />
                            <button
                                type="submit"
                                disabled={!message || message.length > 280}
                                className="rounded px-4 py-2 bg-black text-white enabled:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Send
                            </button>
                            {status && <p className="text-sm">{status}</p>}
                        </form>
                    </section>
                </div>
            </div>
        </section>
    );
}
