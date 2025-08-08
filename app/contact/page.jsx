import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Contact() {
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
                        <Image src="/LOGO_YAYSA.png" alt="Logo" width={500} height={500} />
                    </section>
                    <br />
                    <p className="text-foreground/70 text-lg sm:text-xl max-w-2xl mb-8 tracking-[-.01em]">
                        to collaborate, or just to say hello! I&apos;m always open
                        to connecting with fellow developers and enthusiasts.
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
                                className="p-2 text-white transition-colors rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-background">
                                Send
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </section>
    );
}
