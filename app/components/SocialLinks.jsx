"use client";

import { FaGithub, FaLinkedin } from "react-icons/fa"; // React Icons (React icon library)

const LINKS = [
    {
        href: "https://github.com/yay5a",
        label: "GitHub",
        Icon: FaGithub,
    },
    {
        href: "https://www.linkedin.com/in/your-handle",
        label: "LinkedIn",
        Icon: FaLinkedin,
    },
];

export default function SocialLinks() {
    return (
        <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-slate-300">
                You can also find me on these other platforms:
            </p>

            <div className="flex gap-4">
                {LINKS.map(({ href, label, Icon }) => (
                    <a
                        key={label}
                        href={href}
                        aria-label={label}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/40 bg-slate-900/70
                       shadow-sm shadow-cyan-500/20 transition
                       hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-500/10"
                    >
                        <Icon className="text-lg text-cyan-200" />
                    </a>
                ))}
            </div>
        </div>
    );
}
