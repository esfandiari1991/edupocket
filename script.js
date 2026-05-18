(() => {
  "use strict";

  const onReady = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  };

  onReady(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    initRotatingText(prefersReducedMotion);
    initMobileMenu();
    initReveals(prefersReducedMotion);
    initNavigationState();
    initAnchorScrolling();
    initWaitlistForm();
  });

  function initRotatingText(prefersReducedMotion) {
    const rotatingText = document.getElementById("rotating-text");
    if (!rotatingText) return;

    const words = [
      "teachers",
      "language learners",
      "IELTS candidates",
      "TOEFL students",
      "PTE learners",
      "TÖMER candidates",
      "speaking learners",
      "academic writers",
      "study-abroad students",
      "language learners in Iran",
      "learners in China",
      "learners in Taiwan",
      "learners in Canada",
      "learners in Estonia",
      "learners in England",
    ];

    let index = 0;
    rotatingText.textContent = words[index];

    if (prefersReducedMotion) return;

    window.setInterval(() => {
      rotatingText.classList.add("is-changing");

      window.setTimeout(() => {
        index = (index + 1) % words.length;
        rotatingText.textContent = words[index];
        rotatingText.classList.remove("is-changing");
      }, 220);
    }, 2400);
  }

  function initMobileMenu() {
    const toggle = document.getElementById("mobile-menu-toggle");
    const menu = document.getElementById("mobile-menu");
    const nav = document.querySelector("[data-nav]");

    if (!toggle || !menu || !nav) return;

    const setMenu = (isOpen) => {
      toggle.classList.toggle("is-open", isOpen);
      menu.classList.toggle("is-open", isOpen);
      document.body.classList.toggle("menu-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    };

    toggle.addEventListener("click", () => {
      setMenu(!menu.classList.contains("is-open"));
    });

    menu.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (link) setMenu(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!menu.classList.contains("is-open")) return;
      if (nav.contains(event.target)) return;
      setMenu(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 960 && menu.classList.contains("is-open")) {
        setMenu(false);
      }
    });
  }

  function initReveals(prefersReducedMotion) {
    const revealElements = Array.from(document.querySelectorAll(".reveal"));
    if (!revealElements.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -80px 0px",
        threshold: 0.12,
      },
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  function initNavigationState() {
    const nav = document.querySelector("[data-nav]");
    const links = Array.from(document.querySelectorAll("[data-nav-link]")).filter((link) => {
      return link.getAttribute("href")?.startsWith("#");
    });
    const sections = Array.from(document.querySelectorAll("[data-section][id]"));

    const setActiveLink = (id) => {
      links.forEach((link) => {
        const linkId = link.getAttribute("href")?.slice(1);
        link.classList.toggle("is-active", Boolean(id && linkId === id));
      });
    };

    const update = () => {
      if (nav) {
        nav.classList.toggle("is-scrolled", window.scrollY > 12);
      }

      let currentId = "top";
      const offset = 150;

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY + offset >= sectionTop) {
          currentId = section.id;
        }
      });

      if (!links.some((link) => link.getAttribute("href") === `#${currentId}`)) {
        const nearestPrevious = [...sections]
          .reverse()
          .find((section) => {
            const top = section.getBoundingClientRect().top + window.scrollY;
            return window.scrollY + offset >= top && links.some((link) => link.getAttribute("href") === `#${section.id}`);
          });

        currentId = nearestPrevious?.id || currentId;
      }

      setActiveLink(currentId);
    };

    let ticking = false;
    const requestUpdate = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  }

  function initAnchorScrolling() {
    const internalLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
    if (!internalLinks.length) return;

    internalLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });

        if (history.pushState) {
          history.pushState(null, "", href);
        }
      });
    });
  }

  function initWaitlistForm() {
    const form = document.getElementById("waitlist-form");
    const emailInput = document.getElementById("waitlist-email");
    const message = document.getElementById("waitlist-message");

    if (!form || !emailInput || !message) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = emailInput.value.trim();
      if (!emailInput.checkValidity() || !email) {
        message.textContent = "Please enter a valid email address.";
        message.classList.remove("is-success");
        message.classList.add("is-error");
        emailInput.focus();
        return;
      }

      const subject = encodeURIComponent("eduPocket waitlist request");
      const body = encodeURIComponent(`Please add me to the eduPocket waitlist.\n\nEmail: ${email}`);

      message.textContent = "Opening your email app now.";
      message.classList.remove("is-error");
      message.classList.add("is-success");

      window.location.href = `mailto:aliesfandiari@outlook.com?subject=${subject}&body=${body}`;
    });
  }
})();
