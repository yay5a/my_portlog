import React from "react";
import Image from "next/image";

export default function Home() {
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
                            <h2 className="text-4xl md:text-4xl font-bold text white">
                                I am
                            </h2>
                            <h1 className="text-4xl md:text-6xl font-bold text white">
                                Yaysa
                            </h1>
                        </div>
                        <li className="mb-2 tracking-[-.01em]">
                        </li>
                        <li className="tracking-[-.01em]">
                        </li>
                    </section>
                </div>
            </main>
        </div>
    );
}
