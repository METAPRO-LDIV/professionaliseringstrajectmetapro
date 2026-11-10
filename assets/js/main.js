/* assets/js/main.js */

/* 1) Solution toggle (quiz) */
(function () {
  const showBtn = document.getElementById("showSolutionBtn");
  const hideBtn = document.getElementById("hideSolutionBtn");
  const solution = document.getElementById("solution");

  if (!showBtn || !hideBtn || !solution) return;

  function showSolution() {
    solution.hidden = false;
    showBtn.setAttribute("aria-expanded", "true");
    showBtn.hidden = true;
    hideBtn.hidden = false;
    solution.setAttribute("tabindex", "-1");
    solution.focus({ preventScroll: false });
  }

  function hideSolution() {
    solution.hidden = true;
    showBtn.setAttribute("aria-expanded", "false");
    showBtn.hidden = false;
    hideBtn.hidden = true;
    showBtn.focus();
  }

  showBtn.addEventListener("click", showSolution);
  hideBtn.addEventListener("click", hideSolution);
})();

document.addEventListener("DOMContentLoaded", () => {

  /* 2) Under construction — ONLY if overlay exists on this page */
  const overlay = document.getElementById("under-construction");
  if (overlay) {

    const unlockPage = () => {
      document.body.classList.remove("is-locked");
      overlay.style.display = "none";
    };

    const lockPage = () => {
      document.body.classList.add("is-locked");
      overlay.style.display = "grid";
    };

    const params = new URLSearchParams(window.location.search);
    const preview = params.get("preview");

    // default locked, unless preview=1
    if (preview === "1") unlockPage();
    else lockPage();

    // Admin hotkey: CTRL + ALT + P
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.altKey && !e.shiftKey && (e.key || "").toLowerCase() === "p") {
        e.preventDefault();
        e.stopPropagation();
        unlockPage();
      }
    });
  }

  /* 3) Active nav link */
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".navlink").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path) a.classList.add("active");
  });

  /* 4) WWWH scroll-spy pills (index) */
  const sections = ["wat", "waarom", "wanneer", "hoe"]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const pills = Array.from(document.querySelectorAll(".pillrow a.pill"));
  if (sections.length && pills.length) {
    const byId = new Map(pills.map(a => [a.getAttribute("href").replace("#",""), a]));
    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      pills.forEach(a => a.classList.remove("active"));
      const active = byId.get(visible.target.id);
      if (active) active.classList.add("active");
    }, { threshold: [0.2, 0.35, 0.5, 0.65] });

    sections.forEach(s => io.observe(s));
  }

  /* 5) Micro audio toggle (week pages) */
  const btn = document.querySelector("[data-audio-toggle]");
  const audio = document.querySelector("#reflectie-audio");
  const panel = document.querySelector("#reflectie-panel");

  if (btn && audio && panel) {
    btn.addEventListener("click", () => {
      const isHidden = panel.hasAttribute("hidden");
      if (isHidden) {
        panel.removeAttribute("hidden");
        btn.setAttribute("aria-expanded", "true");
        audio.play().catch(() => {});
      } else {
        panel.setAttribute("hidden", "");
        btn.setAttribute("aria-expanded", "false");
        audio.pause();
      }
    });
  }
});
