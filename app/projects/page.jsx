import React from "react";
import Image from "next/image";

export default function Projects() {
    return (
        <div className="container mx-auto p-4 sm:p-8 md:grid-cols-[260px_1fr] gap-8 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <div className="space-y-6">
                    <p className="text-foreground/70 text-lg sm:text-xl max-w-2xl mb-8 tracking-[-.01em]">
                        Here are some of the projects I&apos;ve worked on. Feel
                        free to explore and reach out if you have any questions
                        or feedback!
                    </p>
                    <section className="space-y-6 mt-8 md:mt-0 card p-6">
                        <h3 className="text-4xl md:text-6xl font-bold text white">
                            Projects
                        </h3>
                        <div className="space-y-4">
                            <Image
                                className="w: auto h: auto"
                                src="/466858.jpg"
                                alt="Logo"
                                width={100}
                                height={100}
                            />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
