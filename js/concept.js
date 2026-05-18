document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.results');
  const head = document.querySelector('.results__head');
  if (!section || !head) return;

  function update() {
    if (window.innerWidth <= 1024) {
      head.classList.remove('results__head--fixed');
      return;
    }
    const rect = section.getBoundingClientRect();
    if (rect.top <= 0 && rect.bottom > 0) {
      head.classList.add('results__head--fixed');
    } else {
      head.classList.remove('results__head--fixed');
    }
  }

  if (window.__lenis) {
    window.__lenis.on('scroll', update);
  } else {
    window.addEventListener('scroll', update, { passive: true });
  }
  window.addEventListener('resize', update, { passive: true });
  update();
});
