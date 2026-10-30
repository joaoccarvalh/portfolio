// ── Inclinação das polaroids (data-tilt) ──
document.querySelectorAll("[data-tilt]").forEach((el) => {
  el.style.setProperty("--tilt", `${el.dataset.tilt}deg`);
});

// ── Reveal ao rolar ──
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ── Menu: borda ao rolar e abrir/fechar no celular ──
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav__toggle");
window.addEventListener("scroll", () => nav.classList.toggle("is-scrolled", window.scrollY > 10), { passive: true });
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open);
});
document.querySelectorAll(".nav__links a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// ── Abas do "O que eu faço" ──
const tabs = document.querySelectorAll(".tab");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.remove("is-active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");

    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("is-active"));
    const panel = document.getElementById(`panel-${tab.dataset.tab}`);
    panel.classList.add("is-active");
    panel.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  });
});

// ── Foto do "Sobre" que vira vídeo ──
document.querySelectorAll("[data-hover-video]").forEach((box) => {
  const video = box.querySelector("video");
  const play = () => { video.play().then(() => box.classList.add("is-playing")).catch(() => {}); };
  const stop = () => { box.classList.remove("is-playing"); video.pause(); };

  if (window.matchMedia("(hover: hover)").matches) {
    box.addEventListener("mouseenter", play);
    box.addEventListener("mouseleave", stop);
  } else {
    // no celular, roda sozinho quando aparece na tela
    new IntersectionObserver(([e]) => (e.isIntersecting ? play() : stop()), { threshold: 0.6 }).observe(box);
  }
});

// ── Modal de vídeo (arquivos próprios e reels do Instagram) ──
const modal = document.getElementById("modal");
const modalBody = modal.querySelector(".modal__body");
const modalIg = modal.querySelector(".modal__ig");
let lastFocus = null;

function openModal(content, igUrl) {
  lastFocus = document.activeElement;
  modalBody.replaceChildren(content);
  modalIg.hidden = !igUrl;
  if (igUrl) modalIg.href = igUrl;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal__close").focus();
}

function closeModal() {
  modal.hidden = true;
  modalBody.replaceChildren();
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}

document.querySelectorAll("[data-video]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const v = document.createElement("video");
    v.src = btn.dataset.video;
    v.controls = true;
    v.autoplay = true;
    v.playsInline = true;
    openModal(v);
  });
});

document.querySelectorAll("[data-reel]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.reel;
    const frame = document.createElement("iframe");
    frame.src = `https://www.instagram.com/reel/${id}/embed`;
    frame.title = btn.getAttribute("aria-label");
    frame.allow = "autoplay; encrypted-media";
    frame.loading = "lazy";
    openModal(frame, `https://www.instagram.com/reel/${id}/`);
  });
});

modal.querySelector(".modal__close").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

// ── Galeria do Percursos ──
document.querySelectorAll("[data-galeria]").forEach((gal) => {
  const track = gal.querySelector(".galeria__track");
  const count = gal.querySelector(".galeria__count");
  const total = track.children.length;
  const current = () => Math.round(track.scrollLeft / track.clientWidth);
  const go = (dir) => {
    const next = (current() + dir + total) % total;
    track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
  };
  gal.querySelector(".galeria__btn--prev").addEventListener("click", () => go(-1));
  gal.querySelector(".galeria__btn--next").addEventListener("click", () => go(1));
  track.addEventListener("scroll", () => { count.textContent = `${current() + 1} / ${total}`; }, { passive: true });
});

// ── Ver mais registros ──
const verMais = document.querySelector("[data-ver-mais]");
verMais.addEventListener("click", () => {
  const sec = document.getElementById("coberturas");
  const open = sec.classList.toggle("is-expanded");
  verMais.setAttribute("aria-expanded", open);
  verMais.textContent = open ? "ver menos −" : "ver mais registros +";
  sec.querySelectorAll(".frame--extra, .clq-item--extra").forEach((el) => el.classList.add("is-visible"));
});
