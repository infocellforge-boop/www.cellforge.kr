/**
 * Cellforge Scroll-Synchronized Animations (GSAP + ScrollTrigger)
 *
 * Scenario:
 * 1. Portal Intro (#intro-portal):
 *    - Starts with "Cellforge" centered on screen.
 *    - As the user scrolls, "Cellforge" zooms exponentially right through the center hole of the letter 'o'.
 *    - Emerging from inside the 'o', "Forging a Brighter Tomorrow" fades in and scales up until it occupies 50% of the screen width (50vw).
 *    - Then the pin releases and scrolls naturally down into the ADERIS® brand showcase.
 * 2. Flagship Showcase (#flagship):
 *    - Scroll-synced reveal of ADERIS® main cut + sequential lit-up of the 4 core pillars.
 * 3. Lineup Showcase (#lineup):
 *    - Sticky split showcase syncing the 4 ADERIS® product cuts (Original, HA, PN, PN-HA) and ambient theme glow with scroll position.
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
   * so that scaling #portal-word up to 85x flies the camera straight through the inside of 'o'.
   */
  function updatePortalTransformOrigin() {
    if (!portalWord || !portalO) return;

    // Temporarily reset transform to measure natural layout coordinates
    const prevTransform = portalWord.style.transform;
    portalWord.style.transform = "none";

    const wordRect = portalWord.getBoundingClientRect();
    const oRect = portalO.getBoundingClientRect();

    // Center of 'o' horizontally, and slightly below vertical midline (54%) for the optical hole of lowercase 'o'
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
     STAGE 1: Portal Intro Timeline (Pin & Scrub)
     ======================================================================== */
  if (portalSection && portalWord && portalSlogan) {
    const portalTl = gsap.timeline({
      scrollTrigger: {
        trigger: portalSection,
        start: "top top",
        end: "+=260%",
        pin: true,
        scrub: 0.65,
        anticipatePin: 1,
        onRefresh: updatePortalTransformOrigin,
      },
    });

    // 0.00 -> 0.12: Fade out scroll hint immediately as scrolling begins
    portalTl.to(
      portalHint,
      {
        opacity: 0,
        y: -16,
        duration: 0.12,
        ease: "power1.out",
      },
      0
    );

    // 0.00 -> 0.48: Zoom "Cellforge" exponentially through the hole of 'o'
    portalTl.to(
      portalWord,
      {
        scale: 85,
        duration: 0.48,
        ease: "power3.in",
      },
      0
    );

    // 0.34 -> 0.48: Fade out "Cellforge" as the camera passes completely through 'o'
    portalTl.to(
      portalWord,
      {
        opacity: 0,
        duration: 0.14,
        ease: "power2.inOut",
      },
      0.34
    );

    // 0.30 -> 0.84: Slogan emerges from inside 'o' (invisible & tiny) and scales up to 50% viewport width (scale: 1)
    portalTl.fromTo(
      portalSlogan,
      {
        opacity: 0,
        scale: 0.08,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.54,
        ease: "power2.out",
      },
      0.3
    );

    // Subtle ambient glow expansion synced with slogan growth
    if (portalAmbient) {
      portalTl.fromTo(
        portalAmbient,
        { scale: 0.7, opacity: 0.3 },
        { scale: 1.35, opacity: 0.85, duration: 0.6, ease: "sine.inOut" },
        0.25
      );
    }

    // 0.84 -> 1.00: Hold at 50% viewport size briefly before unpinning & scrolling down into products
    portalTl.to(
      portalSlogan,
      {
        scale: 1.03,
        duration: 0.16,
        ease: "none",
      },
      0.84
    );
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
