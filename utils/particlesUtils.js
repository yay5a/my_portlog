const particleOptions = {
    autoPlay: true,
    background: {
        color: {
            value: "transparent",
        },
        image: "",
        position: "",
        repeat: "",
        size: "",
        opacity: 1,
    },
    backgroundMask: {
        composite: "destination-out",
        cover: {
            opacity: 1,
            color: {
                value: "",
            },
        },
        enable: false,
    },
    clear: true,
    defaultThemes: {},
    delay: 0,
    fullScreen: {
        enable: true,
        zIndex: -1,
    },
    detectRetina: true,
    duration: 0,
    fpsLimit: 60,
    interactivity: {
        detectsOn: "window",
        events: {
            onClick: {
                enable: false,
                mode: [],
            },
            onDiv: {
                selectors: [],
                enable: false,
                mode: [],
                type: "circle",
            },
            onHover: {
                enable: true,
                mode: "repulse",
                parallax: {
                    enable: true,
                    force: 15,
                    smooth: 10,
                },
            },
            resize: {
                delay: 0.5,
                enable: true,
            },
        },
        modes: {
            trail: {
                delay: 0.005,
                pauseOnStop: true,
                quantity: 5,
                particles: {
                    color: {
                        value: "#ff0000",
                        animation: {
                            enable: true,
                            speed: 400,
                            sync: true,
                        },
                    },
                    collisions: {
                        enable: false,
                    },
                    links: {
                        enable: false,
                    },
                    move: {
                        outModes: {
                            default: "destroy",
                        },
                        speed: 2,
                    },
                    size: {
                        value: {
                            min: 1,
                            max: 5,
                        },
                        animation: {
                            enable: true,
                            speed: 5,
                            sync: true,
                            startValue: "min",
                            destroy: "max",
                        },
                    },
                },
            },
            attract: {
                distance: 200,
                duration: 0.4,
                easing: "ease-out-quad",
                factor: 1,
                maxSpeed: 50,
                speed: 1,
            },
            bounce: {
                distance: 200,
            },
            bubble: {
                distance: 200,
                duration: 0.4,
                mix: false,
                divs: {
                    distance: 200,
                    duration: 0.4,
                    mix: false,
                    selectors: [],
                },
            },
            connect: {
                distance: 80,
                links: {
                    opacity: 0.5,
                },
                radius: 60,
            },
            grab: {
                distance: 100,
                links: {
                    blink: false,
                    consent: false,
                    opacity: 1,
                },
            },
            push: {
                default: true,
                groups: [],
                quantity: 4,
            },
            remove: {
                quantity: 2,
            },
            repulse: {
                distance: 200,
                duration: 0.4,
                factor: 100,
                speed: 1,
                maxSpeed: 50,
                easing: "ease-out-quad",
                divs: {
                    distance: 200,
                    duration: 0.4,
                    factor: 100,
                    speed: 1,
                    maxSpeed: 50,
                    easing: "ease-out-quad",
                    selectors: [],
                },
            },
            slow: {
                factor: 3,
                radius: 200,
            },
            particle: {
                replaceCursor: false,
                pauseOnStop: false,
                stopDelay: 0,
            },
            light: {
                area: {
                    gradient: {
                        start: {
                            value: "#ffffff",
                        },
                        stop: {
                            value: "#000000",
                        },
                    },
                    radius: 1000,
                },
                shadow: {
                    color: {
                        value: "#000000",
                    },
                    length: 2000,
                },
            },
        },
    },
    manualParticles: [],
    particles: {
        bounce: {
            horizontal: {
                value: 1,
            },
            vertical: {
                value: 1,
            },
        },
        collisions: {
            absorb: {
                speed: 2,
            },
            bounce: {
                horizontal: {
                    value: 1,
                },
                vertical: {
                    value: 1,
                },
            },
            enable: false,
            maxSpeed: 50,
            mode: "bounce",
            overlap: {
                enable: true,
                retries: 0,
            },
        },
        color: {
            value: "#3ca5d3",
            animation: {
                h: {
                    count: 0,
                    enable: true,
                    speed: 1,
                    decay: 0,
                    delay: 0,
                    sync: true,
                    offset: 0,
                },
                s: {
                    count: 0,
                    enable: false,
                    speed: 1,
                    decay: 0,
                    delay: 0,
                    sync: true,
                    offset: 0,
                },
                l: {
                    count: 0,
                    enable: false,
                    speed: 1,
                    decay: 0,
                    delay: 0,
                    sync: true,
                    offset: 0,
                },
            },
        },
        effect: {
            close: true,
            fill: true,
            options: {},
            type: [],
        },
        groups: {},
        move: {
            angle: {
                offset: 0,
                value: 90,
            },
            attract: {
                distance: 200,
                enable: false,
                rotate: {
                    x: 3000,
                    y: 3000,
                },
            },
            center: {
                x: 50,
                y: 50,
                mode: "percent",
                radius: 0,
            },
            decay: 0,
            distance: {},
            direction: "none",
            drift: 0,
            enable: true,
            gravity: {
                acceleration: 9.81,
                enable: false,
                inverse: false,
                maxSpeed: 50,
            },
            path: {
                clamp: true,
                delay: {
                    value: 0,
                },
                enable: false,
                options: {},
            },
            outModes: {
                default: "out",
                bottom: "out",
                left: "out",
                right: "out",
                top: "out",
            },
            random: false,
            size: true,
            speed: 1,
            spin: {
                acceleration: 0,
                enable: false,
            },
            straight: false,
            trail: {
                enable: false,
                length: 10,
                fill: {},
            },
            vibrate: false,
            warp: false,
        },
        number: {
            density: {
                enable: false,
                width: 1920,
                height: 1080,
            },
            limit: {
                mode: "delete",
                value: 0,
            },
            value: 50,
        },
        opacity: {
            value: 1,
            animation: {
                count: 0,
                enable: true,
                speed: 0.5,
                decay: 0,
                delay: 0,
                sync: false,
                mode: "auto",
                startValue: "random",
                destroy: "none",
            },
        },
        reduceDuplicates: false,
        shadow: {
            blur: 0,
            color: {
                value: "#000",
            },
            enable: false,
            offset: {
                x: 0,
                y: 0,
            },
        },
        shape: {
            close: true,
            fill: true,
            options: {},
            type: "circle",
        },
        size: {
            value: 1,
            animation: {
                count: 0,
                enable: true,
                speed: 3,
                decay: 0,
                delay: 0,
                sync: false,
                mode: "auto",
                startValue: "random",
                destroy: "none",
            },
        },
        stroke: {
            width: 0,
        },
        zIndex: {
            value: 0,
            opacityRate: 1,
            sizeRate: 1,
            velocityRate: 1,
        },
        destroy: {
            bounds: {},
            mode: "none",
            split: {
                count: 1,
                factor: {
                    value: 3,
                },
                rate: {
                    value: {
                        min: 4,
                        max: 9,
                    },
                },
                sizeOffset: true,
                particles: {},
            },
        },
        roll: {
            darken: {
                enable: false,
                value: 0,
            },
            enable: false,
            enlighten: {
                enable: false,
                value: 0,
            },
            mode: "vertical",
            speed: 25,
        },
        tilt: {
            value: 0,
            animation: {
                enable: false,
                speed: 0,
                decay: 0,
                sync: false,
            },
            direction: "clockwise",
            enable: false,
        },
        twinkle: {
            lines: {
                enable: false,
                frequency: 0.05,
                opacity: 1,
            },
            particles: {
                enable: false,
                frequency: 0.05,
                opacity: 1,
            },
        },
        wobble: {
            distance: 5,
            enable: false,
            speed: {
                angle: 50,
                move: 10,
            },
        },
        life: {
            count: 0,
            delay: {
                value: 0,
                sync: false,
            },
            duration: {
                value: 0,
                sync: false,
            },
        },
        rotate: {
            value: 0,
            animation: {
                enable: false,
                speed: 0,
                decay: 0,
                sync: false,
            },
            direction: "clockwise",
            path: false,
        },
        orbit: {
            animation: {
                count: 0,
                enable: false,
                speed: 1,
                decay: 0,
                delay: 0,
                sync: false,
            },
            enable: false,
            opacity: 1,
            rotation: {
                value: 45,
            },
            width: 1,
        },
        links: {
            blink: false,
            color: {
                value: "random",
            },
            consent: false,
            distance: 333,
            enable: true,
            frequency: 1,
            opacity: 1,
            shadow: {
                blur: false,
                color: {
                    value: "#000",
                },
                enable: false,
            },
            triangles: {
                enable: false,
                frequency: 1,
                color: {
                    value: "#2497f0",
                },
                opacity: 1,
            },
            width: 1,
            warp: false,
        },
        repulse: {
            value: 0,
            enabled: false,
            distance: 1,
            duration: 1,
            factor: 1,
            speed: 1,
        },
    },
    pauseOnBlur: false,
    pauseOnOutsideViewport: false,
    responsive: [],
    smooth: false,
    style: {},
    themes: [],
    zLayers: 100,
    emitters: [],
    motion: {
        disable: true,
        reduce: {
            factor: 4,
            value: false,
        },
    },
};

// Export the particle options for use in other components
export default particleOptions;
