// Yuron Clinic — main.js

document.addEventListener("DOMContentLoaded", () => {
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
  // Systems slider
  // ---------------------------------------------------------------
  if (typeof Swiper !== "undefined") {
    // Compute a negative offset equal to half a card + half a gap so the
    // slider opens with: half-card-cropped + 2 full + half-card-cropped.
    const systemsSlider = new Swiper(".systems__slider", {
      slidesPerView: "auto",
      spaceBetween: 16,
      grabCursor: true,
      speed: 500,
      breakpoints: {
        0: { spaceBetween: 12 },
        768: { spaceBetween: 14 },
        1200: { spaceBetween: 16 },
      },
    });

    function updateSystemsOffset() {
      const firstSlide = document.querySelector(
        ".systems__slider .systems-card"
      );
      if (!firstSlide || !systemsSlider) return;
      const gap = systemsSlider.params.spaceBetween || 0;
      const offset = -(firstSlide.offsetWidth + gap) / 2;
      systemsSlider.params.slidesOffsetBefore = offset;
      systemsSlider.update();
    }

    updateSystemsOffset();
    window.addEventListener("resize", updateSystemsOffset);

    // ---------------------------------------------------------------
    // Process slider
    // ---------------------------------------------------------------
    new Swiper(".process__slider", {
      slidesPerView: "auto",
      spaceBetween: 10,
      grabCursor: true,
      speed: 500,
    });
  }

  // ---------------------------------------------------------------
  // FAQ accordion
  // ---------------------------------------------------------------
  if (typeof Accordion !== "undefined") {
    new Accordion(".faq__list", {
      duration: 300,
      showMultiple: false,
    });
  }

  // ---------------------------------------------------------------
  // Footer "back to top"
  // ---------------------------------------------------------------
  const toTopBtn = document.querySelector(".footer__to-top");
  if (toTopBtn) {
    toTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
