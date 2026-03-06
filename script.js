document.documentElement.classList.add("js");

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

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateStackCards() {
  if (window.innerWidth < 861) {
    stackCards.forEach((card) => {
      card.style.transform = "translate3d(0, 0, 0) scale(1)";
      card.style.filter = "brightness(1)";
    });
    return;
  }

  const rootStyles = getComputedStyle(document.documentElement);
  const headerHeight =
    Number.parseFloat(rootStyles.getPropertyValue("--header-height")) || 92;
  const stickyTop = headerHeight + 16;

  stackCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const progress = clamp(
      (stickyTop - rect.top) / (window.innerHeight * 0.72),
      0,
      1
    );
    const scale = 1 - progress * 0.085;
    const brightness = 1 - progress * 0.24;
    const translateY = progress * 28;

    card.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(6)})`;
    card.style.filter = `brightness(${brightness.toFixed(6)})`;
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
