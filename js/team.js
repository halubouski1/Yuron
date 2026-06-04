// Yuron Clinic — team.js

// ---- Team Member Popup ----

document.addEventListener('DOMContentLoaded', () => {
  const popupMarkup = `
    <div class="team-popup" id="team-popup" aria-hidden="true">
      <div class="team-popup__overlay" data-team-popup-close></div>
      <div class="team-popup__panel" role="dialog" aria-modal="true">
        <button class="team-popup__close" type="button" aria-label="Close" data-team-popup-close>
          <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24.1211 2.12132L2.12109 24.1213M2.12109 2.12132L24.1211 24.1213" stroke="#282828" stroke-width="3" stroke-linecap="square" stroke-linejoin="round" />
          </svg>
        </button>
        <div class="team-popup__scroll"></div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', popupMarkup);

  const popup = document.querySelector('#team-popup');
  const scroll = popup.querySelector('.team-popup__scroll');
  const triggers = document.querySelectorAll('[data-member]');
  const closeEls = popup.querySelectorAll('[data-team-popup-close]');

  const openPopup = (memberId) => {
    const source = document.getElementById(memberId);
    if (!source) return;
    scroll.innerHTML = source.innerHTML;
    scroll.scrollTop = 0;
    popup.setAttribute('aria-hidden', 'false');
    popup.classList.add('is-open');
    document.body.classList.add('team-popup-open');
    if (window.__lenis) window.__lenis.stop();
  };

  const closePopup = () => {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('team-popup-open');
    if (window.__lenis) window.__lenis.start();
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openPopup(trigger.dataset.member);
    });
  });

  closeEls.forEach(el => el.addEventListener('click', closePopup));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('is-open')) closePopup();
  });
});

// ---- Text Reveal ----

document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector(".text-reveal__text");
  if (!el) return;

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
    const progress = Math.max(0, Math.min(1, (vh * 0.85 - rect.top) / (rect.height + vh * 0.5)));
    const fillCount = Math.round(progress * words.length);
    words.forEach((w, i) => {
      w.classList.toggle("text-reveal__word--filled", i < fillCount);
    });
  }

  if (window.__lenis) {
    window.__lenis.on("scroll", update);
  } else {
    window.addEventListener("scroll", update, { passive: true });
  }
  update();
});
