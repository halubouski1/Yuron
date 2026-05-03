// Yuron Clinic — main.js

document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------------------------------------------
  // Systems slider
  // ---------------------------------------------------------------
  if (typeof Swiper !== "undefined") {
    new Swiper(".systems__slider", {
      slidesPerView: "auto",
      spaceBetween: 16,
      initialSlide: 2,
      grabCursor: true,
      speed: 500,
      breakpoints: {
        0: { spaceBetween: 12 },
        768: { spaceBetween: 14 },
        1200: { spaceBetween: 16 },
      },
    });

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
