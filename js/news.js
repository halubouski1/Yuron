// Yuron Clinic — news.js

document.addEventListener("DOMContentLoaded", () => {
  // ── SEO: pagination meta management ──────────────────────────────────────
  const SEO_BASE_URL   = "https://yuron.co.uk";
  const SEO_PAGE_PATH  = "/news.html";
  const SEO_BASE_TITLE = "Yuron Clinic — News";
  const SEO_BASE_DESC  = "Yuron Clinic — Latest news and updates on our regenerative aesthetics approach, clinical advancements, and upcoming events.";

  function updateSeoMeta(page) {
    const suffix = page > 1 ? ` - Page ${page}` : "";
    document.title = SEO_BASE_TITLE + suffix;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute("content", SEO_BASE_DESC + suffix);
    const canonEl = document.getElementById("seo-canonical");
    if (canonEl) {
      canonEl.setAttribute("href", page > 1
        ? `${SEO_BASE_URL}${SEO_PAGE_PATH}?page=${page}`
        : `${SEO_BASE_URL}${SEO_PAGE_PATH}`);
    }
  }

  function updateUrl(page, replace) {
    const url = page > 1 ? `${SEO_PAGE_PATH}?page=${page}` : SEO_PAGE_PATH;
    if (replace) history.replaceState({ page }, "", url);
    else         history.pushState({ page }, "", url);
  }
  // ─────────────────────────────────────────────────────────────────────────

  const grid = document.querySelector(".news__grid");
  const paginationEl = document.querySelector(".news-pagination");
  if (!grid) return;

  const allCards = Array.from(grid.querySelectorAll(".news-card"));
  const PER_PAGE = 8; // 2 featured + 6 regular

  let activeCategory = "";
  let activeRecency = "newest";

  // Read page number from URL so direct links and browser refresh restore the correct page
  const _urlParams = new URLSearchParams(window.location.search);
  let currentPage = Math.max(1, parseInt(_urlParams.get("page"), 10) || 1);

  // Restore state on browser back / forward
  window.addEventListener("popstate", (e) => {
    currentPage = (e.state && e.state.page) ? e.state.page : 1;
    render(false, false);
  });

  // ── Dropdown toggle ──────────────────────────────────────────────────────
  document.querySelectorAll(".news-filter").forEach((filter) => {
    filter.querySelector(".news-filter__btn").addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = filter.classList.contains("news-filter--open");
      closeAll();
      if (!isOpen) filter.classList.add("news-filter--open");
    });
  });
  document.addEventListener("click", closeAll);
  function closeAll() {
    document.querySelectorAll(".news-filter--open").forEach((f) =>
      f.classList.remove("news-filter--open")
    );
  }

  // ── Option selection ─────────────────────────────────────────────────────
  document.querySelectorAll("#filter-category .news-filter__option").forEach((opt) => {
    opt.addEventListener("click", () => {
      activeCategory = opt.dataset.value;
      setActive("#filter-category", opt);
      updateLabel("#filter-category", opt.textContent.trim(), "Category");
      currentPage = 1;
      render(false, true);
      closeAll();
    });
  });

  document.querySelectorAll("#filter-recency .news-filter__option").forEach((opt) => {
    opt.addEventListener("click", () => {
      activeRecency = opt.dataset.value;
      setActive("#filter-recency", opt);
      updateLabel("#filter-recency", opt.textContent.trim(), "By recency");
      currentPage = 1;
      render(false, true);
      closeAll();
    });
  });

  function setActive(sel, selected) {
    document.querySelectorAll(`${sel} .news-filter__option`).forEach((o) =>
      o.classList.remove("news-filter__option--active")
    );
    selected.classList.add("news-filter__option--active");
  }

  function updateLabel(sel, text, def) {
    document.querySelector(`${sel} .news-filter__label`).textContent =
      text === "All" || text === "Newest first" ? def : text;
  }

  // ── Core render ──────────────────────────────────────────────────────────
  // pushHistory: true = pushState (user navigation), false = replaceState (init / popstate)
  function render(scrollToTop = false, pushHistory = true) {
    // 1. Filter
    let filtered = allCards.filter((card) => {
      if (!activeCategory) return true;
      return card.dataset.categories.split(" ").includes(activeCategory);
    });

    // 2. Sort
    filtered.sort((a, b) => {
      const da = new Date(a.dataset.date);
      const db = new Date(b.dataset.date);
      return activeRecency === "oldest" ? da - db : db - da;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;

    // 3. Paginate
    const start = (currentPage - 1) * PER_PAGE;
    const pageCards = filtered.slice(start, start + PER_PAGE);

    // 4. Hide all, show page cards with featured class
    allCards.forEach((card) => {
      card.style.display = "none";
      card.classList.remove("news-card--featured");
    });

    pageCards.forEach((card, i) => {
      card.style.display = "";
      if (i < 2) card.classList.add("news-card--featured");
      grid.appendChild(card);

      card.classList.remove("news-card--animate");
      void card.offsetWidth; // force reflow so animation restarts
      card.style.animationDelay = `${i * 45}ms`;
      card.classList.add("news-card--animate");
    });

    // 5. Render pagination
    renderPagination(totalPages);

    // 6. SEO: sync <title>, <meta description>, <link rel="canonical"> and URL
    updateSeoMeta(currentPage);
    updateUrl(currentPage, !pushHistory);

    if (scrollToTop) {
      const target = document.querySelector(".news-filters") || grid.closest("section") || grid;
      setTimeout(() => {
        if (window.__lenis) {
          window.__lenis.scrollTo(target, { offset: -20 });
        } else {
          const y = target.getBoundingClientRect().top + window.scrollY - 20;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 0);
    }
  }

  // ── Pagination UI ────────────────────────────────────────────────────────
  function renderPagination(total) {
    if (!paginationEl) return;
    paginationEl.innerHTML = "";

    if (total <= 1) return;

    // Prev button
    paginationEl.appendChild(makeBtn(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.5 8.5L7.5 12.5L11.5 16.5" stroke="#9F9E9E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.5 8.5L12.5 12.5L16.5 16.5" stroke="#9F9E9E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`, () => { currentPage--; render(true, true); }, currentPage === 1));

    // Page numbers: always show first 3, last 3, and ±1 around current
    const pages = buildPageList(currentPage, total);

    pages.forEach((p) => {
      if (p === "…") {
        const el = document.createElement("span");
        el.className = "news-pagination__ellipsis";
        el.textContent = "...";
        paginationEl.appendChild(el);
      } else {
        const btn = document.createElement("button");
        btn.className = "news-pagination__page" + (p === currentPage ? " news-pagination__page--active" : "");
        btn.textContent = p;
        btn.addEventListener("click", () => { currentPage = p; render(true, true); });
        paginationEl.appendChild(btn);
      }
    });

    // Next button
    paginationEl.appendChild(makeBtn(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 16.5L11.5 12.5L7.5 8.5" stroke="#9F9E9E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.5 16.5L16.5 12.5L12.5 8.5" stroke="#9F9E9E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`, () => { currentPage++; render(true, true); }, currentPage === total));
  }

  function buildPageList(current, total) {
    const set = new Set();
    // First 3
    for (let i = 1; i <= Math.min(3, total); i++) set.add(i);
    // Around current
    for (let i = Math.max(1, current - 1); i <= Math.min(total, current + 1); i++) set.add(i);
    // Last 3
    for (let i = Math.max(1, total - 2); i <= total; i++) set.add(i);

    const sorted = Array.from(set).sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…");
      result.push(sorted[i]);
    }
    return result;
  }

  function makeBtn(svg, onClick, disabled) {
    const btn = document.createElement("button");
    btn.className = "news-pagination__btn";
    btn.innerHTML = svg;
    btn.disabled = disabled;
    if (!disabled) btn.addEventListener("click", onClick);
    return btn;
  }

  // ── Initial render ───────────────────────────────────────────────────────
  // false = replaceState: sets canonical history entry without adding to back stack
  render(false, false);
});
