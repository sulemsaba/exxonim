document.documentElement.classList.add("js");

const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");

function getTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme) {
  const activeTheme = theme === "dark" ? "dark" : "light";
  const isDark = activeTheme === "dark";

  document.documentElement.dataset.theme = activeTheme;

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme"
    );
  }

  if (themeLabel) {
    themeLabel.textContent = isDark ? "Dark" : "Light";
  }
}

applyTheme(getTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = getTheme() === "dark" ? "light" : "dark";

    applyTheme(nextTheme);

    try {
      localStorage.setItem("exxonim-theme", nextTheme);
      localStorage.removeItem("koro-theme");
    } catch (error) {
      // Ignore storage issues and keep the in-memory theme switch.
    }
  });
}

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealNodes = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

const deviceSlides = Array.from(document.querySelectorAll(".device-slide"));
let activeSlide = 0;

if (deviceSlides.length > 1) {
  window.setInterval(() => {
    deviceSlides[activeSlide].classList.remove("is-active");
    activeSlide = (activeSlide + 1) % deviceSlides.length;
    deviceSlides[activeSlide].classList.add("is-active");
  }, 2600);
}

const stackCards = Array.from(document.querySelectorAll("[data-stack-card]"));
const stackCardInners = stackCards.map((card) =>
  card.querySelector(".stack-card__inner")
);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateStackCards() {
  if (window.innerWidth < 861) {
    stackCardInners.forEach((inner) => {
      if (!inner) {
        return;
      }

      inner.style.transform = "none";
      inner.style.filter = "none";
    });

    return;
  }

  const rootStyles = getComputedStyle(document.documentElement);
  const headerHeight =
    Number.parseFloat(rootStyles.getPropertyValue("--header-height")) || 92;
  const viewportHeight = window.innerHeight;
  const travelDistance = Math.max(viewportHeight - headerHeight, 1);

  stackCards.forEach((card, index) => {
    const inner = stackCardInners[index];
    const nextCard = stackCards[index + 1];

    if (!inner) {
      return;
    }

    if (!nextCard) {
      inner.style.transform = "none";
      inner.style.filter = "none";
      return;
    }

    const nextRect = nextCard.getBoundingClientRect();
    const progress = clamp(
      (viewportHeight - nextRect.top) / travelDistance,
      0,
      1
    );
    const scale = 1 - progress * 0.048;
    const translateY = progress * 34;
    const brightness = 1 - progress * 0.08;

    inner.style.transform =
      `translate3d(0, ${translateY.toFixed(2)}px, 0) ` +
      `scale(${scale.toFixed(5)})`;
    inner.style.filter = `brightness(${brightness.toFixed(5)})`;
  });
}

let stackTicking = false;

function queueStackUpdate() {
  if (stackTicking) {
    return;
  }

  stackTicking = true;

  window.requestAnimationFrame(() => {
    updateStackCards();
    stackTicking = false;
  });
}

updateStackCards();
window.addEventListener("scroll", queueStackUpdate, { passive: true });
window.addEventListener("resize", updateStackCards);

const blogRail = document.querySelector("[data-blog-rail]");
const railPrev = document.querySelector("[data-rail-prev]");
const railNext = document.querySelector("[data-rail-next]");

function scrollBlogRail(direction) {
  if (!blogRail) {
    return;
  }

  const firstCard = blogRail.querySelector(".blog-card");
  const scrollAmount = firstCard
    ? firstCard.getBoundingClientRect().width + 20
    : 360;

  blogRail.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth",
  });
}

if (railPrev) {
  railPrev.addEventListener("click", () => scrollBlogRail(-1));
}

if (railNext) {
  railNext.addEventListener("click", () => scrollBlogRail(1));
}
