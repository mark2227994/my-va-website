const navToggle = document.querySelector(".nav-toggle");
const navMobile = document.querySelector(".nav-mobile");
const navLinks = document.querySelectorAll(".nav-mobile a, .nav-links a");
const themeToggle = document.getElementById("themeToggle");
const nav = document.querySelector(".nav");
const stickyCta = document.getElementById("stickyCta");
const menuBackdrop = document.getElementById("menuBackdrop");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const calendlyUrl = "https://calendly.com/kelvinmark-va/30min";
const enableAutoPopups = false;

const openMenu = () => {
  document.body.classList.add("menu-open");
  navMobile.classList.add("open");
  menuBackdrop.classList.add("visible");
  navToggle.setAttribute("aria-expanded", "true");
};

const closeMenu = () => {
  navMobile.classList.remove("open");
  menuBackdrop.classList.remove("visible");
  document.body.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
};

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

menuBackdrop.addEventListener("click", closeMenu);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) {
    closeMenu();
  }
});

const updateNav = () => {
  nav.classList.toggle("nav-scrolled", window.scrollY > 20);
  if (stickyCta) {
    stickyCta.classList.toggle("visible", window.scrollY > 420);
  }
  const progress = document.getElementById("scrollProgress");
  if (progress) {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const value = total > 0 ? (window.scrollY / total) * 100 : 0;
    progress.style.width = `${value}%`;
  }
};

updateNav();
window.addEventListener("scroll", updateNav);

const setTheme = (mode) => {
  document.body.classList.toggle("theme-light", mode === "light");
  localStorage.setItem("theme", mode);
  themeToggle.textContent = mode === "light" ? "Dark" : "Light";
};

const savedTheme = localStorage.getItem("theme");
setTheme(savedTheme || "dark");

themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.contains("theme-light");
  setTheme(isLight ? "dark" : "light");
});

const revealItems = document.querySelectorAll(".section .glass, .section-title, .hero-content, .hero-card, .card, .portfolio-card");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item, index) => {
  item.classList.add("reveal");
  item.style.transitionDelay = `${index * 0.028}s`;
  observer.observe(item);
});

const counters = document.querySelectorAll(".counter");
const rings = document.querySelectorAll(".ring");
const animateCounter = (counter) => {
  const target = Number(counter.dataset.target);
  let value = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const tick = () => {
    value += step;
    if (value >= target) {
      counter.textContent = target;
      return;
    }
    counter.textContent = value;
    requestAnimationFrame(tick);
  };
  tick();
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const ringObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      const ring = entry.target;
      const progress = Number(ring.dataset.progress) || 0;
      const circle = ring.querySelector(".ring-progress");
      if (circle) {
        const circumference = 314;
        const offset = circumference - (progress / 100) * circumference;
        circle.style.strokeDashoffset = `${offset}`;
      }
      ringObserver.unobserve(ring);
    });
  },
  { threshold: 0.6 }
);

rings.forEach((ring) => ringObserver.observe(ring));

const form = document.querySelector(".form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  form.reset();
  const button = form.querySelector("button");
  const originalText = button.textContent;
  button.textContent = "Sent — Kelvin will reply soon";
  button.disabled = true;
  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, 2800);
});

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

const createParticles = () => {
  const count = Math.min(130, Math.floor(window.innerWidth / 7));
  particles = Array.from({ length: count }).map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.6 + 0.6,
    speed: Math.random() * 0.5 + 0.2,
    alpha: Math.random() * 0.5 + 0.2
  }));
};

const drawParticles = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(120, 150, 255, ${p.alpha})`;
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    p.y -= p.speed;
    if (p.y < -10) {
      p.y = canvas.height + 10;
      p.x = Math.random() * canvas.width;
    }
  });
  requestAnimationFrame(drawParticles);
};

resizeCanvas();
createParticles();
drawParticles();

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

const heroCard = document.querySelector(".hero-card");
const heroSection = document.querySelector(".hero");

const handleParallax = (event) => {
  const rect = heroSection.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  heroCard.style.transform = `translate3d(${x * 10}px, ${y * 12}px, 0)`;
};

heroSection.addEventListener("mousemove", handleParallax);
heroSection.addEventListener("mouseleave", () => {
  heroCard.style.transform = "translate3d(0, 0, 0)";
});

const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
    });
    tabPanels.forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
    const panel = document.getElementById(button.dataset.tab);
    if (panel) {
      panel.classList.add("active");
    }
  });
});

const pricingPills = document.querySelectorAll(".toggle-pill");
const priceElements = document.querySelectorAll(".price");
const saveBadges = document.querySelectorAll(".price-save");

const updateSavingsBadges = (mode) => {
  if (!saveBadges.length) return;
  saveBadges.forEach((badge) => {
    const card = badge.closest(".price-card");
    const priceEl = card?.querySelector(".price");
    if (!priceEl) return;
    if (mode === "monthly") {
      const plan = card?.dataset.plan;
      const labels = {
        starter: "Momentum Plan",
        standard: "Founders’ Pick",
        premium: "Concierge Tier"
      };
      badge.textContent = labels[plan] || "Great Value";
      badge.classList.remove("hidden");
      return;
    }
    const monthly = Number(priceEl.dataset.monthly || 0);
    const target = Number(priceEl.dataset[mode] || 0);
    const months = mode === "quarterly" ? 3 : 12;
    const baseline = monthly * months;
    const savings = baseline > 0 ? Math.round(((baseline - target) / baseline) * 100) : 0;
    badge.textContent = `Save ${savings}%`;
    badge.classList.remove("hidden");
  });
};

const setPricingMode = (mode) => {
  priceElements.forEach((priceEl) => {
    const value = priceEl.dataset[mode];
    priceEl.classList.add("switching");
    setTimeout(() => {
      const suffix = mode === "monthly" ? "/mo" : mode === "quarterly" ? "/quarter" : "/year";
      priceEl.innerHTML = `$${value}<span>${suffix}</span>`;
      priceEl.classList.remove("switching");
    }, 180);
  });
  updateSavingsBadges(mode);
  localStorage.setItem("pricingMode", mode);
};

pricingPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    pricingPills.forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
    });
    pill.classList.add("active");
    pill.setAttribute("aria-selected", "true");
    setPricingMode(pill.dataset.mode);
  });
});

const savedPricing = localStorage.getItem("pricingMode");
if (savedPricing) {
  pricingPills.forEach((pill) => {
    const isActive = pill.dataset.mode === savedPricing;
    pill.classList.toggle("active", isActive);
    pill.setAttribute("aria-selected", String(isActive));
  });
  setPricingMode(savedPricing);
} else {
  updateSavingsBadges("monthly");
}

const setPlan = (planKey) => {
  if (roiPlan) {
    roiPlan.value = planKey;
    calculateRoi();
  }
  priceCards.forEach((card) => {
    card.classList.toggle("selected", card.dataset.plan === planKey);
  });
};

const highlightEl = (el) => {
  if (!el) return;
  el.classList.remove("pulse");
  void el.offsetWidth;
  el.classList.add("pulse");
};

const stickyHeadline = document.getElementById("stickyHeadline");
const stickySubhead = document.getElementById("stickySubhead");
const spotlight = document.getElementById("spotlight");
const surpriseCta = document.getElementById("surpriseCta");
const surpriseClose = document.getElementById("surpriseClose");
const spinCta = document.getElementById("spinCta");
const spinClose = document.getElementById("spinClose");
const spinButton = document.getElementById("spinButton");
const wheel = document.getElementById("wheel");
const spinResult = document.getElementById("spinResult");
const eggCta = document.getElementById("eggCta");
const eggClose = document.getElementById("eggClose");
const contactForm = document.querySelector(".form");
const messageField = document.querySelector(".form textarea");
const bookingSection = document.getElementById("booking");
const priceCards = document.querySelectorAll(".price-card");
const stickyVariants = [
  {
    headline: "Ready to reclaim your time?",
    subhead: "Let Kelvin build your premium support system."
  },
  {
    headline: "Founders: reclaim 10+ hours weekly.",
    subhead: "Get a concierge VA system built around your goals."
  },
  {
    headline: "Your executive support upgrade starts here.",
    subhead: "Book a private call and get a tailored plan."
  }
];

const applyStickyCopy = (variant) => {
  if (!stickyHeadline || !stickySubhead) {
    return;
  }
  stickyHeadline.textContent = variant.headline;
  stickySubhead.textContent = variant.subhead;
  stickyHeadline.classList.add("sticky-fade");
  stickySubhead.classList.add("sticky-fade");
  setTimeout(() => {
    stickyHeadline.classList.remove("sticky-fade");
    stickySubhead.classList.remove("sticky-fade");
  }, 400);
};

const isMobile = window.matchMedia("(max-width: 700px)").matches;

if (stickyHeadline && stickySubhead) {
  let variantIndex = Math.floor(Math.random() * stickyVariants.length);
  applyStickyCopy(stickyVariants[variantIndex]);
  setInterval(() => {
    variantIndex = (variantIndex + 1) % stickyVariants.length;
    applyStickyCopy(stickyVariants[variantIndex]);
  }, isMobile ? 5500 : 7000);
}

if (surpriseCta && surpriseClose) {
  const dismissed = localStorage.getItem("surpriseCtaDismissed") === "true";
  if (!dismissed && enableAutoPopups) {
    setTimeout(() => {
      surpriseCta.classList.add("visible");
      surpriseCta.setAttribute("aria-hidden", "false");
    }, 5200);
  }
  surpriseClose.addEventListener("click", () => {
    surpriseCta.classList.remove("visible");
    surpriseCta.setAttribute("aria-hidden", "true");
    localStorage.setItem("surpriseCtaDismissed", "true");
  });
}

if (spinCta && spinClose && spinButton && wheel && spinResult) {
  const dismissed = localStorage.getItem("spinCtaDismissed") === "true";
  if (!dismissed && enableAutoPopups) {
    setTimeout(() => {
      spinCta.classList.add("visible");
      spinCta.setAttribute("aria-hidden", "false");
    }, 8000);
  }
  spinClose.addEventListener("click", () => {
    spinCta.classList.remove("visible");
    spinCta.setAttribute("aria-hidden", "true");
    localStorage.setItem("spinCtaDismissed", "true");
  });

  let spinning = false;
  const rewards = [
    { label: "Bonus: VIP onboarding checklist", action: "vip_checklist" },
    { label: "Perk: Priority response lane", action: "priority_lane" },
    { label: "Reward: Concierge setup call", action: "concierge_call" },
    { label: "Bonus: Inbox detox sprint", action: "inbox_detox" }
  ];
  spinButton.addEventListener("click", () => {
    if (spinning) return;
    spinning = true;
    const spin = 1080 + Math.floor(Math.random() * 360);
    wheel.style.transform = `rotate(${spin}deg)`;
    setTimeout(() => {
      const reward = rewards[Math.floor(Math.random() * rewards.length)];
      spinResult.textContent = `${reward.label} • Applied`;
      if (reward.action === "vip_checklist") {
        if (messageField) {
          messageField.value = "Claiming the VIP onboarding checklist bonus from the spin offer.";
          highlightEl(contactForm);
        }
      }
      if (reward.action === "priority_lane") {
        setPlan("standard");
        if (messageField) {
          messageField.value = "Requesting Priority Response Lane from the spin offer.";
          highlightEl(contactForm);
        }
      }
      if (reward.action === "concierge_call") {
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
          highlightEl(bookingSection);
        }
      }
      if (reward.action === "inbox_detox") {
        setPlan("premium");
        if (messageField) {
          messageField.value = "Please book me for the Inbox Detox Sprint bonus.";
          highlightEl(contactForm);
        }
      }
      spinning = false;
    }, 2400);
  });
}

if (eggCta && eggClose) {
  const dismissed = localStorage.getItem("eggCtaDismissed") === "true";
  const revealEgg = () => {
    if (!dismissed && enableAutoPopups) {
      eggCta.classList.add("visible");
      eggCta.setAttribute("aria-hidden", "false");
    }
  };
  if (enableAutoPopups) {
    window.addEventListener("scroll", () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && window.scrollY / docHeight > 0.72) {
        revealEgg();
      }
    });
  }
  eggClose.addEventListener("click", () => {
    eggCta.classList.remove("visible");
    eggCta.setAttribute("aria-hidden", "true");
    localStorage.setItem("eggCtaDismissed", "true");
  });
}
if (spotlight && !prefersReducedMotion) {
  spotlight.style.opacity = "1";
  window.addEventListener("mousemove", (event) => {
    const x = event.clientX - 260;
    const y = event.clientY - 260;
    spotlight.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
}

const openCalendlyPopup = () => {
  window.open(calendlyUrl, "_blank", "noopener");
};


const roiHours = document.getElementById("roiHours");
const roiRate = document.getElementById("roiRate");
const roiWeeks = document.getElementById("roiWeeks");
const roiValue = document.getElementById("roiValue");
const roiCalc = document.getElementById("roiCalc");
const roiPlan = document.getElementById("roiPlan");
const roiNet = document.getElementById("roiNet");
const roiMeterFill = document.getElementById("roiMeterFill");
const roiConfidence = document.getElementById("roiConfidence");

const planPricing = {
  starter: { monthly: 200, quarterly: 528, yearly: 1920 },
  standard: { monthly: 480, quarterly: 1267, yearly: 4608 },
  premium: { monthly: 1000, quarterly: 2640, yearly: 9600 }
};

const formatCurrency = (value) => {
  return `$${value.toLocaleString("en-US")}`;
};

const calculateRoi = () => {
  if (!roiHours || !roiRate || !roiWeeks || !roiValue) {
    return;
  }
  const hours = Number(roiHours.value) || 0;
  const rate = Number(roiRate.value) || 0;
  const weeks = Number(roiWeeks.value) || 0;
  const total = Math.max(0, hours * rate * weeks);
  roiValue.textContent = formatCurrency(total);
  roiValue.classList.remove("roi-animate");
  void roiValue.offsetWidth;
  roiValue.classList.add("roi-animate");
  if (roiPlan && roiNet) {
    const mode = localStorage.getItem("pricingMode") || "monthly";
    const planKey = roiPlan.value;
    const planCost = planPricing[planKey]?.[mode] ?? 0;
    const net = Math.max(0, total - planCost);
    roiNet.textContent = `${formatCurrency(net)} net after plan cost`;
    roiNet.classList.remove("roi-animate");
    void roiNet.offsetWidth;
    roiNet.classList.add("roi-animate");
    if (roiMeterFill && roiConfidence) {
      const ratio = planCost > 0 ? net / planCost : 0;
      const percentage = Math.min(100, Math.max(0, ratio * 40 + 20));
      roiMeterFill.style.width = `${percentage}%`;
      const level = ratio >= 2 ? "High" : ratio >= 1 ? "Medium" : "Low";
      roiConfidence.textContent = level;
    }
  }
};

if (roiCalc) {
  roiCalc.addEventListener("click", calculateRoi);
  [roiHours, roiRate, roiWeeks, roiPlan].forEach((input) => {
    if (input) {
      input.addEventListener("input", calculateRoi);
      input.addEventListener("change", calculateRoi);
    }
  });
  calculateRoi();
}

const typingText = document.getElementById("typingText");
const queuePhrases = [
  "Drafting executive briefing...",
  "Optimizing inbox workflows...",
  "Coordinating VIP calendar...",
  "Preparing client onboarding pack...",
  "Synthesizing market insights..."
];

if (typingText && !prefersReducedMotion) {
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const typeLoop = () => {
    const phrase = queuePhrases[phraseIndex];
    if (!deleting) {
      charIndex += 1;
      typingText.textContent = phrase.slice(0, charIndex);
      if (charIndex >= phrase.length) {
        deleting = true;
        setTimeout(typeLoop, isMobile ? 650 : 900);
        return;
      }
    } else {
      charIndex -= 1;
      typingText.textContent = phrase.slice(0, charIndex);
      if (charIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % queuePhrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? (isMobile ? 28 : 35) : (isMobile ? 45 : 55));
  };

  typeLoop();
}
const utmParams = {
  utm_source: "website",
  utm_medium: "cta",
  utm_campaign: "kelvin_va_site"
};

const addUtmParams = (href) => {
  try {
    const url = new URL(href);
    Object.entries(utmParams).forEach(([key, value]) => {
      if (!url.searchParams.has(key)) {
        url.searchParams.set(key, value);
      }
    });
    return url.toString();
  } catch {
    return href;
  }
};

const ctaLinks = document.querySelectorAll("a.btn, .whatsapp, .sticky-cta a");
ctaLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) {
      return;
    }
    const updated = addUtmParams(href);
    if (updated !== href) {
      link.setAttribute("href", updated);
    }
  });
});

const trustNote = document.getElementById("trustNote");
const syncTrustNote = () => {
  if (!trustNote) return;
  if (window.innerWidth > 700) {
    trustNote.open = true;
  }
};

syncTrustNote();
window.addEventListener("resize", syncTrustNote);
