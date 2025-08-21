"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function LogoCard({ className = "" }) {
	return (
		<>
			{/* Logo */}
			<div className="p-2 flex items-center justify-center">
				<div
					className="rounded-full w-[25%] h-[25%] flex items-center justify-center transition-all duration-300 hover:scale-105"
					style={{
						background:
							"radial-gradient(ellipse at center, #0a1436 40%, #162447 80%, #1a233a 100%)",
						boxShadow: "0 4px 32px 12px rgba(0,0,0,0.18)",
					}}
					onMouseEnter={(e) =>
						(e.currentTarget.style.boxShadow =
							"0 0 12px 4px rgba(192,192,192,0.35), 0 0 32px 8px rgba(0,0,0,0.18)")
					}
					onMouseLeave={(e) =>
						(e.currentTarget.style.boxShadow =
							"0 4px 32px 12px rgba(0,0,0,0.18)")
					}
				>
					<Link href="/contact">
						<img
							src="/ewewewewewewewe.png"
							alt="Portfolio Logo"
							className="w-[auto] h-[15%]"
						/>
					</Link>
				</div>
			</div>
		</>
	);
}
