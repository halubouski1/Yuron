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
  // Systems slider — native CSS overflow scroll + drag-to-scroll.
  // Initial scrollLeft is set to half-card + half-gap so the layout opens
  // with: half-card-cropped + 2 full + half-card-cropped. Native scroll
  // handles bounds, so drag works to both ends without any clamp issues.
  // ---------------------------------------------------------------
  const systemsSlider = document.querySelector(".systems__slider");
  if (systemsSlider) {
    const track = systemsSlider.querySelector(".systems__track");
    const firstCard = systemsSlider.querySelector(".systems-card");

    const setInitialScroll = () => {
      // Open at the start of the scroll content so the left container
      // padding is visible alongside cards 1, 2, 3.
      systemsSlider.scrollLeft = 0;
    };

    setInitialScroll();
    window.addEventListener("load", setInitialScroll);

    // Mouse drag-to-scroll
    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    systemsSlider.addEventListener("mousedown", (e) => {
      isDown = true;
      systemsSlider.classList.add("is-dragging");
      startX = e.pageX;
      startScrollLeft = systemsSlider.scrollLeft;
    });

    const endDrag = () => {
      isDown = false;
      systemsSlider.classList.remove("is-dragging");
    };
    systemsSlider.addEventListener("mouseup", endDrag);
    systemsSlider.addEventListener("mouseleave", endDrag);

    systemsSlider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const dx = e.pageX - startX;
      systemsSlider.scrollLeft = startScrollLeft - dx;
    });
  }

  // ---------------------------------------------------------------
  // Process slider
  // ---------------------------------------------------------------
  if (typeof Swiper !== "undefined") {
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
