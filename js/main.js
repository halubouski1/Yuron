// Yuron Clinic — main.js

document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------------------------------------------
  // Lenis smooth scroll
  // Hijacks vertical scroll on the page; horizontal scroll containers
  // (e.g. .systems__slider) are opted out via [data-lenis-prevent].
  // ---------------------------------------------------------------
  let lenis = null;
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // ---------------------------------------------------------------
  // AOS (animate on scroll) — section reveal animations
  // ---------------------------------------------------------------
  if (typeof AOS !== "undefined") {
    AOS.init({
      once: true,
      duration: 800,
      easing: "ease-out-cubic",
      offset: 80,
      anchorPlacement: "top-bottom",
    });

    // Lenis hijacks scroll, so notify AOS on every Lenis scroll tick.
    if (lenis) {
      lenis.on("scroll", () => AOS.refresh());
    }

    // Also refresh after fonts/images load (heights may shift).
    window.addEventListener("load", () => AOS.refresh());
  }

  // ---------------------------------------------------------------
  // Mobile offcanvas menu
  // ---------------------------------------------------------------
  const burgerBtn = document.querySelector(".header__burger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const menuCloseItems = document.querySelectorAll("[data-menu-close]");

  function setMenuState(isOpen) {
    document.body.classList.toggle("menu-open", isOpen);

    if (burgerBtn) {
      burgerBtn.setAttribute("aria-expanded", String(isOpen));
    }

    if (mobileMenu) {
      mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    }
  }

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener("click", () => setMenuState(true));

    menuCloseItems.forEach((item) => {
      item.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuState(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) {
        setMenuState(false);
      }
    });
  }

  // ---------------------------------------------------------------
  // Sliders (Swiper)
  // ---------------------------------------------------------------
  if (typeof Swiper !== "undefined") {
    // Read --container-pad from CSS so Swiper's offsets stay in sync with
    // the .container padding across breakpoints.
    const getContainerPad = () =>
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--container-pad"
        )
      ) || 50;

    // Systems slider — same layout as before (3 cards visible inside the
    // padded area, drag scrolls through all 6).
    const systemsSwiper = new Swiper(".systems__slider", {
      slidesPerView: "auto",
      spaceBetween: 16,
      slidesOffsetBefore: getContainerPad(),
      slidesOffsetAfter: getContainerPad(),
      grabCursor: true,
      loop: true,
      speed: 6000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
    });

    // Keep offsets in sync with --container-pad on resize.
    window.addEventListener("resize", () => {
      const pad = getContainerPad();
      systemsSwiper.params.slidesOffsetBefore = pad;
      systemsSwiper.params.slidesOffsetAfter = pad;
      systemsSwiper.update();
    });

    // Process slider
    new Swiper(".process__slider", {
      slidesPerView: "auto",
      spaceBetween: 10,
      grabCursor: true,
      loop: true,
      speed: 6000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
    });
  }

  // ---------------------------------------------------------------
  // FAQ accordion
  // ---------------------------------------------------------------
  if (typeof Accordion !== "undefined" && document.querySelector(".faq__list")) {
    new Accordion(".faq__list", {
      duration: 300,
      showMultiple: false,
    });
  }

  // ---------------------------------------------------------------
  // Footer "back to top" (uses Lenis when available)
  // ---------------------------------------------------------------
  const toTopBtn = document.querySelector(".footer__to-top");
  if (toTopBtn) {
    toTopBtn.addEventListener("click", () => {
      if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
});
