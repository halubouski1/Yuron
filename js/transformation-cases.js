document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".before-after__slider")) {
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

  if (document.querySelector(".reviews-showcase__slider")) {
    new Swiper(".reviews-showcase__slider", {
      slidesPerView: "auto",
      spaceBetween: 16,
      grabCursor: true,
      breakpoints: {
        0: { spaceBetween: 6 },
        561: { spaceBetween: 12 },
      },
    });
  }

  if (document.querySelector(".stories__slider")) {
    new Swiper(".stories__slider", {
      slidesPerView: "auto",
      spaceBetween: 16,
      grabCursor: true,
      breakpoints: {
        0: { spaceBetween: 6 },
        561: { spaceBetween: 12 },
      },
      navigation: {
        nextEl: ".stories__btn--next",
        prevEl: ".stories__btn--prev",
      },
      pagination: {
        el: ".stories__pagination",
        type: "bullets",
        clickable: true,
      },
    });
  }

  const modal = document.getElementById("stories-modal");
  if (modal) {
    const modalVideo = modal.querySelector(".stories-modal__video");
    const closeBtn = modal.querySelector(".stories-modal__close");

    function openModal(src) {
      modalVideo.src = src;
      modal.classList.add("stories-modal--active");
      modal.setAttribute("aria-hidden", "false");
      modalVideo.play();
    }

    function closeModal() {
      modal.classList.remove("stories-modal--active");
      modal.setAttribute("aria-hidden", "true");
      modalVideo.pause();
      modalVideo.src = "";
    }

    document.querySelectorAll(".stories-card").forEach((card) => {
      card.addEventListener("click", () => {
        const src = card.querySelector(".stories-card__play").dataset.src;
        openModal(src);
      });
    });

    closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }
});
