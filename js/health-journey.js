document.addEventListener("DOMContentLoaded", () => {
  const journey = document.querySelector(".journey");
  const itemsWrap = document.querySelector(".journey__items");
  const items = document.querySelectorAll(".journey__item");

  if (!journey || !itemsWrap || !items.length) {
    return;
  }

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const updateJourneyProgress = () => {
    const wrapRect = itemsWrap.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const startLine = viewportHeight * 0.58;
    const progressDistance = wrapRect.height - viewportHeight * 0.18;
    const progress = clamp((startLine - wrapRect.top) / progressDistance, 0, 1);

    journey.style.setProperty("--journey-progress", progress.toFixed(4));

    items.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const isActive = itemRect.top < viewportHeight * 0.58 || index === 0;
      item.classList.toggle("is-active", isActive);
    });
  };

  updateJourneyProgress();

  window.addEventListener("scroll", updateJourneyProgress, { passive: true });
  window.addEventListener("resize", updateJourneyProgress);

  if (window.__lenis) {
    window.__lenis.on("scroll", updateJourneyProgress);
  }
});
