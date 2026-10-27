/**
 * Cellforge Scroll-Synchronized Animations (GSAP + ScrollTrigger)
 *
 * Scenario:
 * 1. Portal Intro (#intro-portal):
 *    - Starts with "Cellforge" centered on screen.
 *    - As the user scrolls, "Cellforge" grows to a threshold size (~2.1x).
 *    - Once it crosses the threshold size (scrolling down or up), it NEVER stops mid-zoom
 *      where rasterized/pixelated text could be seen: it automatically completes the pass-through
 *      of the letter 'o' and snaps the scroll past the portal transition zone.
 *    - After passing through 'o', "Forging a Brighter Tomorrow" responds to scroll and grows
 *      smoothly up to 50% of the screen width (50vw), then unpins and scrolls down into the ADERIS® cuts.
 * 2. Flagship Showcase (#flagship):
 *    - Scroll-synced reveal of ADERIS® main cut + sequential lit-up of the 4 core pillars.
 * 3. Lineup Showcase (#lineup):
 *    - Sticky split showcase syncing the 4 ADERIS® product cuts (Original, HA, PN, PN-HA) and ambient theme glow.
 * 4. Craftsmanship Bento (#craftsmanship):
 *    - Sequential scroll-synced stagger reveal of the 5 package detail cuts.
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
     STAGE 1: Portal Intro Timeline with No-Stop Auto Pass-Through
     ======================================================================== */
  if (portalSection && portalWord && portalSlogan) {
    // State flag: whether "Cellforge" has burst through the 'o' portal
    let hasPassedPortal = false;
    let isAutoScrolling = false;
    let scrollStopTimer = null;

    // Thresholds in the pinned ScrollTrigger progress (0.0 -> 1.0):
    // - 0.00 ~ 0.14: "Cellforge" scales gently from 1.0x -> 2.1x (always crisp vector text)
    // - > 0.14 (scrolling down): Auto-flies through 'o' (2.1x -> 80x & fades out) and snaps scroll to >= 0.36
    // - < 0.34 (scrolling up):   Auto-flies back to 1.0x and snaps scroll to 0.0
    // - 0.36 ~ 0.90: "Forging a Brighter Tomorrow" scales in response to scroll from tiny up to 50vw (scale 1.0)
    // - 0.90 ~ 1.00: Brief hold at 50vw, then unpins and scrolls down into ADERIS® sections
    const DOWN_TRIGGER = 0.14;
    const UP_TRIGGER = 0.34;
    const SLOGAN_START = 0.36;

    function flyThroughPortalDown() {
      if (hasPassedPortal) return;
      hasPassedPortal = true;

      gsap.killTweensOf([portalWord, portalHint]);
      gsap.to(portalHint, { opacity: 0, y: -16, duration: 0.2, overwrite: true });
      gsap.to(portalWord, {
        scale: 80,
        opacity: 0,
        duration: 0.38,
        ease: "power3.in",
        overwrite: true,
      });
    }

    function flyBackPortalUp() {
      if (!hasPassedPortal) return;
      hasPassedPortal = false;

      gsap.killTweensOf([portalWord, portalHint, portalSlogan]);
      gsap.to(portalSlogan, {
        opacity: 0,
        scale: 0.08,
        duration: 0.22,
        ease: "power2.in",
        overwrite: true,
      });
      gsap.fromTo(
        portalWord,
        { scale: 18, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.36,
          ease: "power3.out",
          overwrite: true,
          clearProps: "scale",
        }
      );
      gsap.to(portalHint, { opacity: 1, y: 0, duration: 0.3, delay: 0.1, overwrite: true });
    }

    function snapScrollToProgress(st, targetProgress) {
      if (isAutoScrolling) return;
      isAutoScrolling = true;
      const targetY = st.start + (st.end - st.start) * targetProgress;

      const scrollProxy = { y: window.scrollY };
      gsap.to(scrollProxy, {
        y: targetY,
        duration: 0.38,
        ease: "power2.out",
        overwrite: true,
        onUpdate: () => window.scrollTo(0, scrollProxy.y),
        onComplete: () => {
          isAutoScrolling = false;
        },
      });
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

        // 1. Before passing the portal (0.00 ~ DOWN_TRIGGER): gentle crisp scale 1.0 -> 2.1
        if (!hasPassedPortal && p <= DOWN_TRIGGER) {
          const t = p / DOWN_TRIGGER; // 0 -> 1
          const currentScale = 1 + t * 1.1; // 1.0 -> 2.1
          gsap.set(portalWord, { scale: currentScale, opacity: 1 });
          gsap.set(portalHint, { opacity: 1 - t, y: -12 * t });
          gsap.set(portalSlogan, { opacity: 0, scale: 0.08 });
        }

        // 2. Crossing DOWN_TRIGGER going down -> burst through 'o' & auto-advance past transition zone
        if (!hasPassedPortal && p > DOWN_TRIGGER && dir >= 0) {
          flyThroughPortalDown();
          if (p < SLOGAN_START) {
            snapScrollToProgress(self, SLOGAN_START + 0.02);
          }
        }

        // 3. Crossing UP_TRIGGER going up -> fly back to crisp Cellforge at top (0.0)
        if (hasPassedPortal && p < UP_TRIGGER && dir < 0) {
          flyBackPortalUp();
          if (p > 0.01) {
            snapScrollToProgress(self, 0);
          }
        }

        // 4. Safety net: if user stops scrolling anywhere in the transition zone (0.04 < p < SLOGAN_START),
        //    never allow the scroll to rest mid-zoom.
        clearTimeout(scrollStopTimer);
        if (p > 0.04 && p < SLOGAN_START && !isAutoScrolling) {
          scrollStopTimer = setTimeout(() => {
            if (self.progress > 0.04 && self.progress < SLOGAN_START) {
              if (self.direction >= 0) {
                flyThroughPortalDown();
                snapScrollToProgress(self, SLOGAN_START + 0.02);
              } else {
                flyBackPortalUp();
                snapScrollToProgress(self, 0);
              }
            }
          }, 60);
        }

        // 5. After passing through 'o' (SLOGAN_START -> 0.88):
        //    "Forging a Brighter Tomorrow" responds smoothly to scroll and grows to 50% viewport width (scale: 1)
        if (hasPassedPortal && p >= UP_TRIGGER) {
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
        if (!hasPassedPortal) {
          flyThroughPortalDown();
        }
        gsap.set(portalSlogan, { scale: 1, opacity: 1 });
      },
      onLeaveBack: () => {
        if (hasPassedPortal) {
          flyBackPortalUp();
        }
        gsap.set(portalWord, { scale: 1, opacity: 1, clearProps: "scale" });
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
