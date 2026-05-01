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
  }
});
