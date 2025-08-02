"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import particleOptions from "@/utils/particlesUtils";

export default function ParticleBackground({
    id = "tsparticles",
    options = particleOptions,
}) {
    const [engineLoaded, setEngineLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initEngine = async () => {
            try {
                await initParticlesEngine(async (engine) => {
                    await loadSlim(engine);
                });
                setEngineLoaded(true);
            } catch (err) {
                console.error("Failed to load particles engine:", err);
                setError(err);
            }
        };

        initEngine();
    }, []);

    if (error) {
        console.warn(
            "Particles failed to load, continuing without particle background"
        );
        return null;
    }

    return engineLoaded ? <Particles id={id} options={options} /> : null;
}
