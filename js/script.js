/**
 * ITZFIZZ Kinetic Scroll-Driven Hero Animation
 * Powered by GSAP 3 & ScrollTrigger
 */

const MOTION_CONFIG = {
    desktop: {
        carY: -200,
        carX: 20,
        carRotate: 3,
        carScale: 0.96,
        headlineY: -60,
        statsY: 60,
        pinDistance: "+=120%"
    },
    tablet: {
        carY: -150,
        carX: 10,
        carRotate: 2,
        carScale: 0.96,
        headlineY: -45,
        statsY: 45,
        pinDistance: "+=100%"
    },
    mobile: {
        carY: -100,
        carX: 0,
        carRotate: 0,
        carScale: 0.96,
        headlineY: -30,
        statsY: 30,
        pinDistance: "+=85%"
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    initLiveSpeedometer();
    initIntroAnimation();
    initScrollAnimations();
    initSectionReveals();
});

/**
 * Check if user requests reduced motion
 */
function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Initial Load Animation: Smooth staggered reveal of headline characters, car arrival, and stats
 */
function initIntroAnimation() {
    if (prefersReducedMotion()) {
        document.querySelectorAll(".stat-number").forEach(el => {
            el.textContent = el.getAttribute("data-target") + "%";
        });
        return;
    }

    const masterIntro = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Header & Top Metadata
    masterIntro
        .from(".site-header", { y: -30, opacity: 0, duration: 0.8 }, 0)
        .from(".hero-top-meta", { opacity: 0, y: -15, duration: 0.8 }, 0.15)
        .from("#heroEyebrow", { opacity: 0, y: 15, scale: 0.95, duration: 0.8 }, 0.25);

    // 2. Headline Character Stagger (Smooth letter-by-letter entrance)
    masterIntro
        .from(".char", {
            opacity: 0,
            y: 50,
            filter: "blur(10px)",
            duration: 1.0,
            stagger: 0.035,
            ease: "power4.out"
        }, 0.3)
        .from("#heroSubtitle", { opacity: 0, y: 20, duration: 0.8 }, 0.7);

    // 3. Vehicle Arrival (Smooth suspension settle into initial dock)
    masterIntro
        .from("#carInner", {
            opacity: 0,
            y: 70,
            scale: 0.85,
            duration: 1.3,
            ease: "power3.out"
        }, 0.4);

    // 4. Staggered Statistics Entrance & Animated Counter Rollup
    masterIntro
        .from(".stat-card", {
            opacity: 0,
            y: 35,
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
            onComplete: animateStatNumbers
        }, 0.6)
        .from("#scrollIndicator", { opacity: 0, y: 15, duration: 0.8 }, 1.0);
}

/**
 * Smooth Counter Animation from 0% to Target Percentage
 */
function animateStatNumbers() {
    const statElements = document.querySelectorAll(".stat-number");
    statElements.forEach(stat => {
        const targetVal = parseInt(stat.getAttribute("data-target"), 10) || 0;
        const countObj = { val: 0 };

        gsap.to(countObj, {
            val: targetVal,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: () => {
                stat.textContent = Math.round(countObj.val) + "%";
            }
        });
    });
}

/**
 * Scroll-Driven Interaction:
 * Pinned hero with fluid scrub for vehicle drive, headline parallax, and telemetry overlays
 */
function initScrollAnimations() {
    const mm = gsap.matchMedia();

    mm.add(
        {
            isDesktop: "(min-width: 1024px)",
            isTablet: "(min-width: 768px) and (max-width: 1023px)",
            isMobile: "(max-width: 767px)",
            reduceMotion: "(prefers-reduced-motion: reduce)"
        },
        (context) => {
            const { isDesktop, isTablet, reduceMotion } = context.conditions;
            if (reduceMotion) return;

            const config = isDesktop 
                ? MOTION_CONFIG.desktop 
                : isTablet 
                    ? MOTION_CONFIG.tablet 
                    : MOTION_CONFIG.mobile;

            // Master Hero Pin Timeline
            const scrollTimeline = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: "#hero",
                    start: "top top",
                    end: config.pinDistance,
                    scrub: 1.2, // Smooth bi-directional interpolation
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true
                }
            });

            // 1. Car drives smoothly forward along the road axis
            scrollTimeline.to(
                "#carVisual",
                {
                    y: config.carY,
                    x: config.carX,
                    rotate: config.carRotate,
                    scale: config.carScale,
                    duration: 0.75,
                    ease: "power1.inOut"
                },
                0
            );

            // 2. Parallax depth on headline typography
            scrollTimeline.to(
                ".hero-headline-wrap",
                {
                    y: config.headlineY,
                    scale: 0.96,
                    duration: 0.75,
                    ease: "power1.out"
                },
                0
            );

            // 3. Dynamic Telemetry HUD overlays reveal during cruise
            scrollTimeline
                .to("#telemetryHud", { opacity: 1, duration: 0.25, ease: "power2.out" }, 0.2)
                .to("#telemetryHud", { opacity: 0, duration: 0.2, ease: "power2.in" }, 0.65);

            // 4. Scroll indicator fades out
            scrollTimeline.to("#scrollIndicator", { opacity: 0, duration: 0.15 }, 0);

            // 5. Clean exit into engineering section
            scrollTimeline.to(
                ".hero-headline-wrap",
                {
                    opacity: 0.2,
                    duration: 0.3,
                    ease: "power2.in"
                },
                0.7
            );

            scrollTimeline.to(
                "#heroStats",
                {
                    y: config.statsY,
                    opacity: 0.15,
                    duration: 0.3,
                    ease: "power2.in"
                },
                0.7
            );
        }
    );
}

/**
 * Live Speedometer: Real-time velocity telemetry
 */
function initLiveSpeedometer() {
    const speedValEl = document.getElementById("speedValue");
    if (!speedValEl) return;

    let lastScrollY = window.scrollY;
    let lastTime = Date.now();
    let currentSpeed = 0;
    let targetSpeed = 0;

    window.addEventListener("scroll", () => {
        const now = Date.now();
        const deltaY = Math.abs(window.scrollY - lastScrollY);
        const deltaTime = Math.max(1, now - lastTime);

        // Velocity computation (px/ms scaled to simulated km/h)
        const rawVelocity = (deltaY / deltaTime) * 60;
        targetSpeed = Math.min(340, Math.max(0, Math.round(rawVelocity)));

        lastScrollY = window.scrollY;
        lastTime = now;
    }, { passive: true });

    function updateSpeedometer() {
        currentSpeed += (targetSpeed - currentSpeed) * 0.12;
        targetSpeed *= 0.92;

        const displaySpeed = Math.round(currentSpeed);
        const formatted = String(displaySpeed).padStart(3, "0");
        speedValEl.textContent = formatted;

        requestAnimationFrame(updateSpeedometer);
    }

    requestAnimationFrame(updateSpeedometer);
}

/**
 * Section Reveals for the Engineering & Features Section
 */
function initSectionReveals() {
    if (prefersReducedMotion()) return;

    gsap.from(".feature-card", {
        scrollTrigger: {
            trigger: "#featuresGrid",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
    });

    gsap.from(".telemetry-banner", {
        scrollTrigger: {
            trigger: "#telemetry",
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        scale: 0.96,
        y: 30,
        duration: 0.9,
        ease: "power3.out"
    });
}
