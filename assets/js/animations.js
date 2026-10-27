/**
 * Cellforge Scroll-Synchronized Animations (GSAP + ScrollTrigger)
 */

(function () {
  "use strict";

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const portalSection = document.getElementById("intro-portal");
  const portalWord = document.getElementById("portal-word");
  const portalO = document.getElementById("portal-o");
  const portalHint = document.getElementById("portal-scroll-hint");
  const portalSlogan = document.getElementById("portal-slogan");
  const portalAmbient = document.getElementById("portal-ambient");

  /**
   * Compute the exact center of the letter 'o' hole relative to #portal-word
   * so that scaling #portal-word flies the camera straight through the inside of 'o'.
   */
  function updatePortalTransformOrigin() {
    if (!portalWord || !portalO) return;

    const prevTransform = portalWord.style.transform;
    portalWord.style.transform = "none";

    const wordRect = portalWord.getBoundingClientRect();
    const oRect = portalO.getBoundingClientRect();

    const originX = oRect.left - wordRect.left + oRect.width * 0.5;
    const originY = oRect.top - wordRect.top + oRect.height * 0.54;

    portalWord.style.transformOrigin = `${originX}px ${originY}px`;
    portalWord.style.transform = prevTransform;
  }

  updatePortalTransformOrigin();
  window.addEventListener("resize", () => {
    updatePortalTransformOrigin();
    ScrollTrigger.refresh();
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      updatePortalTransformOrigin();
      ScrollTrigger.refresh();
    });
  }

  /* ========================================================================
     STAGE 1: Portal Intro Timeline (Strict One-Way State Machine)
     ======================================================================== */
  if (portalSection && portalWord && portalSlogan) {
    // States:
    // "START"   -> At top landing, "Cellforge" at scale 1.0 (or growing 1.0 -> 2.0 while scrolling down)
    // "PASSED"  -> Passed through 'o', "Forging a Brighter Tomorrow" active
    // "RETURNING" -> Scrolling back up to top; locked at scale 1.0 once settled so it never bounces
    let portalState = "START";
    let isTweeningPortal = false;
    let isAutoScrolling = false;
    let scrollStopTimer = null;

    const DOWN_TRIGGER = 0.12;
    const UP_TRIGGER = 0.34;
    const SLOGAN_START = 0.36;

    function snapScrollToProgress(st, targetProgress) {
      isAutoScrolling = true;
      const targetY = st.start + (st.end - st.start) * targetProgress;

      const scrollProxy = { y: window.scrollY };
      gsap.killTweensOf(scrollProxy);
      gsap.to(scrollProxy, {
        y: targetY,
        duration: 0.36,
        ease: "power2.out",
        overwrite: true,
        onUpdate: () => window.scrollTo(0, scrollProxy.y),
        onComplete: () => {
          isAutoScrolling = false;
        },
      });
    }

    function flyThroughPortalDown(st) {
      if (portalState === "PASSED") return;
      portalState = "PASSED";
      isTweeningPortal = true;

      gsap.killTweensOf([portalWord, portalHint]);
      gsap.to(portalHint, { opacity: 0, y: -16, duration: 0.18, overwrite: true });
      gsap.to(portalWord, {
        scale: 80,
        opacity: 0,
        duration: 0.36,
        ease: "power3.in",
        overwrite: true,
        onComplete: () => {
          isTweeningPortal = false;
        },
      });

      if (st && st.progress < SLOGAN_START) {
        snapScrollToProgress(st, SLOGAN_START + 0.02);
      }
    }

    function flyBackPortalUp(st) {
      if (portalState !== "PASSED") return;
      // Set state to RETURNING so downward scrub (1.0 -> 2.0) does NOT fight or bounce while scrolling up
      portalState = "RETURNING";
      isTweeningPortal = true;

      gsap.killTweensOf([portalWord, portalHint, portalSlogan]);
      gsap.to(portalSlogan, {
        opacity: 0,
        scale: 0.08,
        duration: 0.2,
        ease: "power2.in",
        overwrite: true,
      });

      gsap.fromTo(
        portalWord,
        { scale: 8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.34,
          ease: "power3.out",
          overwrite: true,
          onComplete: () => {
            isTweeningPortal = false;
            gsap.set(portalWord, { scale: 1, opacity: 1 });
          },
        }
      );

      gsap.to(portalHint, { opacity: 1, y: 0, duration: 0.28, delay: 0.08, overwrite: true });

      if (st && st.progress > 0.01) {
        snapScrollToProgress(st, 0);
      }
    }

    ScrollTrigger.create({
      trigger: portalSection,
      start: "top top",
      end: "+=260%",
      pin: true,
      anticipatePin: 1,
      onRefresh: updatePortalTransformOrigin,
      onUpdate: (self) => {
        const p = self.progress;
        const dir = self.direction; // 1 = down, -1 = up

        // Reset from RETURNING to START once back near the top or when user starts scrolling down again
        if (portalState === "RETURNING" && (p <= 0.01 || (dir > 0 && !isTweeningPortal && !isAutoScrolling))) {
          portalState = "START";
        }

        // 1. Only scrub-scale "Cellforge" (1.0 -> 2.0) when in START state and scrolling DOWN
        if (portalState === "START" && !isTweeningPortal && p <= DOWN_TRIGGER) {
          if (dir > 0) {
            const t = p / DOWN_TRIGGER;
            const currentScale = 1 + t * 1.0; // 1.0 -> 2.0
            gsap.set(portalWord, { scale: currentScale, opacity: 1 });
            gsap.set(portalHint, { opacity: 1 - t, y: -12 * t });
          } else if (p <= 0.01) {
            gsap.set(portalWord, { scale: 1, opacity: 1 });
            gsap.set(portalHint, { opacity: 1, y: 0 });
          }
          gsap.set(portalSlogan, { opacity: 0, scale: 0.08 });
        }

        // 2. Crossing DOWN_TRIGGER going down -> burst through 'o'
        if (portalState !== "PASSED" && p > DOWN_TRIGGER && dir > 0) {
          flyThroughPortalDown(self);
        }

        // 3. Crossing UP_TRIGGER going up -> smoothly return to 1.0x at top without bouncing
        if (portalState === "PASSED" && p < UP_TRIGGER && dir < 0) {
          flyBackPortalUp(self);
        }

        // 4. Safety net if user stops mid-zone (0.03 < p < SLOGAN_START)
        clearTimeout(scrollStopTimer);
        if (p > 0.03 && p < SLOGAN_START && !isAutoScrolling && !isTweeningPortal) {
          scrollStopTimer = setTimeout(() => {
            if (self.progress > 0.03 && self.progress < SLOGAN_START) {
              if (self.direction >= 0 && portalState === "START") {
                flyThroughPortalDown(self);
              } else {
                portalState = "PASSED";
                flyBackPortalUp(self);
              }
            }
          }, 60);
        }

        // 5. Slogan phase (SLOGAN_START -> 0.88): grows smoothly up to 50% viewport width (scale: 1)
        if (portalState === "PASSED" && p >= UP_TRIGGER) {
          const sloganProgress = gsap.utils.clamp(0, 1, (p - SLOGAN_START) / (0.88 - SLOGAN_START));
          const eased = gsap.parseEase("power2.out")(sloganProgress);
          const sloganScale = 0.12 + eased * 0.88; // 0.12 -> 1.00 (50vw)
          const sloganOpacity = gsap.utils.clamp(0, 1, sloganProgress * 1.6);

          gsap.set(portalSlogan, {
            scale: sloganScale,
            opacity: sloganOpacity,
          });

          if (portalAmbient) {
            gsap.set(portalAmbient, {
              scale: 0.75 + eased * 0.6,
              opacity: 0.35 + eased * 0.5,
            });
          }
        }
      },
      onLeave: () => {
        if (portalState !== "PASSED") {
          flyThroughPortalDown(null);
        }
        gsap.set(portalSlogan, { scale: 1, opacity: 1 });
      },
      onLeaveBack: () => {
        portalState = "START";
        isTweeningPortal = false;
        gsap.killTweensOf([portalWord, portalSlogan]);
        gsap.set(portalWord, { scale: 1, opacity: 1 });
        gsap.set(portalSlogan, { scale: 0.08, opacity: 0 });
      },
    });
  }

  /* ========================================================================
     COMMON: Section Header Scroll Reveals
     ======================================================================== */
  gsap.utils.toArray("[data-scroll-reveal]").forEach((headerEl) => {
    gsap.fromTo(
      headerEl,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headerEl,
          start: "top 85%",
          end: "top 55%",
          scrub: 0.5,
        },
      }
    );
  });

  /* ========================================================================
     STAGE 2: Flagship ADERIS® Main Visual & 4 Pillars Lit-up
     ======================================================================== */
  const flagshipCard = document.getElementById("flagship-visual-card");
  const flagshipImg = document.getElementById("flagship-img");

  if (flagshipCard && flagshipImg) {
    gsap.fromTo(
      flagshipCard,
      { opacity: 0, y: 60, scale: 0.94 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: flagshipCard,
          start: "top 85%",
          end: "top 35%",
          scrub: 0.6,
        },
      }
    );

    gsap.fromTo(
      flagshipImg,
      { scale: 1.1 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: flagshipCard,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  }

  const pillars = gsap.utils.toArray("[data-pillar]");
  pillars.forEach((pillar, idx) => {
    gsap.fromTo(
      pillar,
      { opacity: 0.2, y: 32 },
      {
        opacity: 1,
        y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: pillar,
          start: `top ${88 - idx * 3}%`,
          end: "top 60%",
          scrub: 0.5,
          onEnter: () => pillar.classList.add("is-lit"),
          onLeaveBack: () => pillar.classList.remove("is-lit"),
        },
      }
    );
  });

  /* ========================================================================
     STAGE 3: Sequential Product Lineup (Sticky Split Sync)
     ======================================================================== */
  const previewStage = document.getElementById("lineup-preview-stage");
  const stageBadge = document.getElementById("lineup-stage-badge");
  const lineupFrames = gsap.utils.toArray("[data-lineup-frame]");
  const lineupSteps = gsap.utils.toArray("[data-lineup-step]");

  function activateLineupIndex(activeIndex) {
    lineupFrames.forEach((frame, idx) => {
      frame.classList.toggle("is-active", idx === activeIndex);
    });
    lineupSteps.forEach((step, idx) => {
      step.classList.toggle("is-active", idx === activeIndex);
    });

    const activeStep = lineupSteps[activeIndex];
    if (activeStep && previewStage) {
      const theme = activeStep.getAttribute("data-theme") || "gold";
      const badge = activeStep.getAttribute("data-badge") || "";
      previewStage.setAttribute("data-theme", theme);
      if (stageBadge) {
        stageBadge.textContent = badge;
      }
    }
  }

  lineupSteps.forEach((step, idx) => {
    ScrollTrigger.create({
      trigger: step,
      start: "top 58%",
      end: "bottom 42%",
      onEnter: () => activateLineupIndex(idx),
      onEnterBack: () => activateLineupIndex(idx),
    });
  });

  /* ========================================================================
     STAGE 4: Craftsmanship 5 Detail Cuts Sequential Reveal
     ======================================================================== */
  const craftCards = gsap.utils.toArray("[data-craft-card]");
  craftCards.forEach((card) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 56, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          end: "top 58%",
          scrub: 0.5,
        },
      }
    );
  });
})();
