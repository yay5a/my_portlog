'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function LogoCard({ className = "" }) {
    return (
        <>


            {/* Logo */}
            <div className="p-2 flex items-center justify-center">
                <div
                    className="rounded-full w-[80px] h-[120px] flex items-center justify-center pl-[2px] transition-all duration-300 hover:scale-105"
                    style={{
                        background: 'radial-gradient(ellipse at center, #0a1436 40%, #162447 80%, #1a233a 100%)',
                        boxShadow: '0 4px 32px 12px rgba(0,0,0,0.18)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 12px 4px rgba(192,192,192,0.35), 0 0 32px 8px rgba(0,0,0,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 32px 12px rgba(0,0,0,0.18)'}
                >
                    <Link href="/">
                        <img src="/logo-v1.3.jpg" alt="Portfolio Logo" className="h-[100px] w-[80px]" />
                    </Link>
                </div>
            </div >




        </>
    );
}
