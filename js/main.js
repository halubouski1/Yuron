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

    window.__lenis = lenis;

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

    // Systems slider
    if (document.querySelector(".systems__slider")) {
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

      window.addEventListener("resize", () => {
        const pad = getContainerPad();
        systemsSwiper.params.slidesOffsetBefore = pad;
        systemsSwiper.params.slidesOffsetAfter = pad;
        systemsSwiper.update();
      });
    }

    // Process slider
    if (document.querySelector(".process__slider")) {
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

    // Before & After slider
    if (document.querySelector(".before-after__slider") && !document.querySelector(".before-after__slider").classList.contains("swiper-initialized")) {
      new Swiper(".before-after__slider", {
        slidesPerView: "auto",
        spaceBetween: 20,
        grabCursor: true,
        noSwiping: true,
        noSwipingSelector: "img-comparison-slider",
        breakpoints: {
          0: { spaceBetween: 6 },
          561: { spaceBetween: 20 },
        },
        navigation: {
          nextEl: ".before-after__btn--next",
          prevEl: ".before-after__btn--prev",
        },
        pagination: {
          el: ".before-after__pagination",
          type: "bullets",
          clickable: true,
        },
      });
    }

    // Reviews slider
    if (document.querySelector(".reviews__slider")) {
      new Swiper(".reviews__slider", {
        slidesPerView: "auto",
        spaceBetween: 12,
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

    // Benefits slider
    if (document.querySelector(".benefits__slider")) {
      new Swiper(".benefits__slider", {
        slidesPerView: "auto",
        spaceBetween: 12,
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
  // Screening cards — inline "read more / read less" at end of line 3
  // ---------------------------------------------------------------
  document.querySelectorAll(".screening__card-desc").forEach((desc) => {
    const fullHTML = desc.innerHTML.trim();
    const fullText = desc.textContent.trim();
    const cardWidth = desc.getBoundingClientRect().width;

    function makeClone() {
      const c = desc.cloneNode(false);
      Object.assign(c.style, {
        position: "fixed", top: "-9999px", left: "0",
        visibility: "hidden", width: cardWidth + "px",
        flex: "none", height: "auto", maxHeight: "none", overflow: "visible",
      });
      document.body.appendChild(c);
      return c;
    }

    // Measure natural height to check if text overflows 3 lines
    const probe = makeClone();
    probe.textContent = fullText;
    const lineH = parseFloat(getComputedStyle(probe).lineHeight) ||
                  parseFloat(getComputedStyle(probe).fontSize) * 1.2;
    const maxH = lineH * 3;
    const overflows = probe.scrollHeight > maxH + 2;
    document.body.removeChild(probe);

    if (!overflows) return;

    // Binary search: find how many chars fit in 3 lines alongside "... read more"
    const ruler = makeClone();
    let lo = 0, hi = fullText.length;
    while (lo < hi - 1) {
      const mid = Math.floor((lo + hi) / 2);
      ruler.textContent = fullText.slice(0, mid) + "... read more";
      ruler.scrollHeight <= maxH + 2 ? (lo = mid) : (hi = mid);
    }
    document.body.removeChild(ruler);
    const truncLen = lo;

    // Walk DOM nodes and truncate at maxChars text characters, preserving HTML tags
    function truncateHTML(maxChars) {
      const temp = document.createElement("p");
      temp.innerHTML = fullHTML;
      let remaining = maxChars;
      function walk(node) {
        if (remaining <= 0) { node.parentNode.removeChild(node); return; }
        if (node.nodeType === 3) {
          if (node.textContent.length > remaining) {
            node.textContent = node.textContent.slice(0, remaining);
            remaining = 0;
          } else {
            remaining -= node.textContent.length;
          }
        } else {
          Array.from(node.childNodes).forEach(walk);
        }
      }
      Array.from(temp.childNodes).forEach(walk);
      return temp.innerHTML;
    }

    let expanded = false;

    function buildLink(label) {
      const a = document.createElement("a");
      a.href = "#";
      a.className = "screening__card-more";
      a.textContent = label;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        expanded = !expanded;
        render();
      });
      return a;
    }

    function render() {
      if (expanded) {
        desc.innerHTML = fullHTML;
        desc.append(" ", buildLink("read less"));
      } else {
        desc.innerHTML = truncateHTML(truncLen);
        desc.append("... ", buildLink("read more"));
      }
    }

    render();
  });

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

  // ---------------------------------------------------------------
  // Services mega-menu (full-screen overlay)
  // Opened from any [data-services-open] trigger (the header "Services"
  // link); closed via [data-services-close] or Escape. Big buttons and
  // category rows are accordions toggled via [data-accordion-toggle].
  // ---------------------------------------------------------------
  const servicesMenu = document.querySelector(".services-menu");
  if (servicesMenu) {
    const setServicesState = (isOpen) => {
      document.body.classList.toggle("services-open", isOpen);
      servicesMenu.setAttribute("aria-hidden", String(!isOpen));
    };

    document.querySelectorAll("[data-services-open]").forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        setServicesState(true);
      });
    });

    document.querySelectorAll("[data-services-close]").forEach((closer) => {
      closer.addEventListener("click", () => setServicesState(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setServicesState(false);
      }
    });

    // Accordion: each toggle reveals the panel that immediately follows it.
    servicesMenu.querySelectorAll("[data-accordion-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const isExpanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!isExpanded));
        const panel = btn.nextElementSibling;
        if (panel) {
          panel.hidden = isExpanded;
        }
      });
    });
  }
});
