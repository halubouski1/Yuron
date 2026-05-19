document.addEventListener("DOMContentLoaded", () => {
  const popupMarkup = `
    <div class="contact-popup" id="contact-popup" aria-hidden="true">
      <div class="contact-popup__dialog" role="dialog" aria-modal="true" aria-labelledby="contact-popup-title">
        <div class="contact-popup__media">
          <img class="contact-popup__img" src="assets/img/contact-us.png" alt="">
          <button class="contact-popup__close-media" type="button" aria-label="Close contact form" data-contact-popup-close>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.8">
                <rect width="31.4441" height="2.24601" transform="matrix(0.709595 -0.70461 0.709595 0.70461 0.09375 22.4189)" fill="#FFF9F3" />
                <rect width="31.4441" height="2.24601" transform="matrix(0.709595 0.70461 -0.709595 0.70461 1.59375 0)" fill="#FFF9F3" />
              </g>
            </svg>
          </button>
        </div>

        <div class="contact-popup__panel">
          <button class="contact-popup__close" type="button" aria-label="Close contact form" data-contact-popup-close>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.8">
                <rect width="31.4441" height="2.24601" transform="matrix(0.709595 -0.70461 0.709595 0.70461 0.09375 22.4189)" fill="currentColor" />
                <rect width="31.4441" height="2.24601" transform="matrix(0.709595 0.70461 -0.709595 0.70461 1.59375 0)" fill="currentColor" />
              </g>
            </svg>
          </button>

          <h2 class="contact-popup__title" id="contact-popup-title">Contact us</h2>

          <form class="contact-popup__form">
            <div class="form-wrapper">
            <label class="contact-popup__field">
              <span class="contact-popup__label">Full name</span>
              <input class="contact-popup__input" type="text" name="name" placeholder="Your first name" autocomplete="name" required>
            </label>

            <label class="contact-popup__field">
              <span class="contact-popup__label">Phone number</span>
              <input class="contact-popup__input" type="tel" name="phone" placeholder="Your phone number" autocomplete="tel" required>
            </label>
            </div>

            <button class="contact-popup__submit" type="submit">
              <span>Submit</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3346 2.66602V7.33268C13.3346 8.03993 13.0537 8.7182 12.5536 9.2183C12.0535 9.7184 11.3752 9.99935 10.668 9.99935H2.66797" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M6.0013 6.66602L2.66797 9.99935L6.0013 13.3327" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </form>

          <div class="contact-popup__socials">
            <a class="contact-popup__social" href="https://t.me" target="_blank" rel="noopener">
              telegram
              <span class="contact-popup__social-icon" aria-hidden="true">
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10.5" cy="10.5" r="10.5" fill="#282828"/>
                <path d="M12.0027 9.707L7.69919 14.0105L6.99219 13.3035L11.2952 9H7.50269V8H13.0027V13.5H12.0027V9.707Z" fill="#FFF9F3"/>
                </svg>
              </span>
            </a>
            <a class="contact-popup__social" href="https://wa.me" target="_blank" rel="noopener">
              whatsapp
              <span class="contact-popup__social-icon" aria-hidden="true">
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10.5" cy="10.5" r="10.5" fill="#282828"/>
                <path d="M12.0027 9.707L7.69919 14.0105L6.99219 13.3035L11.2952 9H7.50269V8H13.0027V13.5H12.0027V9.707Z" fill="#FFF9F3"/>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", popupMarkup);

  const popup = document.querySelector("#contact-popup");
  const dialog = popup.querySelector(".contact-popup__dialog");
  const form = popup.querySelector(".contact-popup__form");
  const firstInput = popup.querySelector(".contact-popup__input");
  const openLinks = document.querySelectorAll('a[href="#consultation"]');
  const closeButtons = popup.querySelectorAll("[data-contact-popup-close]");

  const openPopup = () => {
    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");
    document.body.classList.add("contact-popup-open");

    if (window.__lenis) {
      window.__lenis.stop();
    }

    window.setTimeout(() => firstInput.focus(), 120);
  };

  const closePopup = () => {
    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");
    document.body.classList.remove("contact-popup-open");

    if (window.__lenis) {
      window.__lenis.start();
    }
  };

  openLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openPopup();
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closePopup);
  });

  popup.addEventListener("click", (event) => {
    if (!dialog.contains(event.target)) {
      closePopup();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && popup.classList.contains("is-open")) {
      closePopup();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.reset();
    closePopup();
  });
});
