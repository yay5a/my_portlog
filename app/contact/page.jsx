import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Contact() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <div className="min-h-screen bg-background text-foreground">
                    <section className="flex flex-col items-center gap-4 sm:items-start">
                        <div className="flex items-center gap-4">
                            <Image
                                className="w: auto h:"
                                src="/466858.jpg"
                                alt="Logo"
                                width={100}
                                height={100}
                            />
                            <h1 className="text-4xl font-bold md:text-6xl text white">
                                Ping me
                            </h1>
                        </div>
                    </section>
                    <br />
                    <p className="text-foreground/70 text-lg sm:text-xl max-w-2xl mb-8 tracking-[-.01em]">
                        to collaborate, or just to say hello! I&apos;m always
                        open to connecting with fellow developers and
                        enthusiasts.
                    </p>
                    <section>
                        <form>
                            <textarea
                                placeholder="Your message"
                                className="w-full h-32 p-2 mb-4 border rounded resize-none"
                            />
                            <button
                                type="submit"
                                send="message"
                                className="p-2 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-background">
                                Send
                            </button>
                        </form>
                    </section>
                    <section>
                        <p className="mt-8 text-lg">
                            You can also find me on these other platforms:
                        </p>
                        <ul className="list-disc pl-5 text-foreground/70 text-sm sm:text-base font-[family-name:var(--font-geist-mono)] mt-4  space-y-2">
                            <li>
                                <a
                                    href="https://github.com/Chartok"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.linkedin.com/in/mohammed-bhimjee"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    LinkedIn
                                </a>
                            </li>
                        </ul>
                    </section>
                    {/* <br />
                    <div>
                        <p className="text-sm text-foreground/70 sm:text-base">
                            If you haven&apos;t already, check out my{" "}
                            <Link
                                className="text-blue-500 hover:underline"
                                href="/app/blog">
                                blog
                            </Link>{" "}
                            for some shower thoughts and other musings.
                        </p>
                    </div> */}
                </div>
            </main>
        </div>
    );
}
