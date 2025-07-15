import React from "react";
import Image from "next/image";

export default function Projects() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <div className="min-h-screen bg-background text-foreground">
                    <section className="flex flex-col items-center sm:items-start gap-4">
                        <div>
                            <Image
                                className="w: auto h: auto"
                                src="/466858.jpg"
                                alt="Logo"
                                width={100}
                                height={100}
                            />
                            <h1 className="text-4xl md:text-6xl font-bold text white">Projects</h1>
                        </div>
                    </section>
                    <p className="text-foreground/70 text-lg sm:text-xl max-w-2xl mb-8 tracking-[-.01em]">
                        Here are some of the projects I've worked on. Feel free to explore and reach out if you have any questions or feedback!
                    </p>
                </div>
            </main>
        </div>
    );
}