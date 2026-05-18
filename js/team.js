// Yuron Clinic — team.js

document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector(".text-reveal__text");
  if (!el) return;

  // Split into word spans, preserving <br> tags
  const raw = el.innerHTML.trim();
  const segments = raw.split(/\s*<br\s*\/?>\s*/i);
  el.innerHTML = segments
    .map((seg) =>
      seg
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => `<span class="text-reveal__word">${w}</span>`)
        .join(" ")
    )
    .join("<br> ");

  const words = Array.from(el.querySelectorAll(".text-reveal__word"));

  function update() {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;

    // 0 → section enters view from bottom, 1 → section fully scrolled past
    const progress = Math.max(0, Math.min(1, (vh * 0.85 - rect.top) / (rect.height + vh * 0.5)));

    const fillCount = Math.round(progress * words.length);
    words.forEach((w, i) => {
      w.classList.toggle("text-reveal__word--filled", i < fillCount);
    });
  }

  // Use Lenis scroll event if available, otherwise native
  if (window.__lenis) {
    window.__lenis.on("scroll", update);
  } else {
    window.addEventListener("scroll", update, { passive: true });
  }
  update();
});
