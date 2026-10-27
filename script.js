// rotten_portfolio · Nebula theme
// Plain JS, no dependencies: starfield, top-bar clock, workspaces, SUPER + K menu.

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ───── starfield ───── */
(() => {
  const canvas = $("#stars");
  const ctx = canvas.getContext("2d");
  let stars = [];
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round((innerWidth * innerHeight) / 5200);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.2 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.004,
      tint: Math.random() < 0.12 ? (Math.random() < 0.5 ? "0,240,255" : "230,0,255") : "220,228,255",
    }));
  };
  const draw = (t = 0) => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const s of stars) {
      const a = reducedMotion ? 0.7 : 0.35 + 0.65 * Math.abs(Math.sin(s.phase + t * s.speed * 0.06));
      ctx.fillStyle = `rgba(${s.tint},${a})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!reducedMotion) requestAnimationFrame(draw);
  };
  addEventListener("resize", () => { resize(); if (reducedMotion) draw(); });
  resize();
  draw();
})();

/* ───── clock (top bar + starship prompt) ───── */
(() => {
  const time = $("#clock-time"), date = $("#clock-date"), prompt = $("#prompt-time");
  const tick = () => {
    const now = new Date();
    const hms = now.toLocaleTimeString("en-GB");
    time.textContent = hms;
    prompt.textContent = hms;
    date.textContent = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  };
  tick();
  setInterval(tick, 1000);
})();

/* ───── typed commands in the hero terminal ───── */
(() => {
  const el = $("#typed");
  const commands = [
    "cat ~/projects/README.md",
    "hyprctl reload",
    "ssh rotten_guy@iut",
    "./save-all.sh",
    "west build -b nice_nano_v2",
    "git push origin main",
  ];
  if (reducedMotion) { el.textContent = commands[0]; return; }
  let i = 0, j = 0, deleting = false;
  const step = () => {
    const cmd = commands[i];
    if (!deleting) {
      el.textContent = cmd.slice(0, ++j);
      if (j === cmd.length) { deleting = true; return setTimeout(step, 1800); }
      return setTimeout(step, 55 + Math.random() * 70);
    }
    el.textContent = cmd.slice(0, --j);
    if (j === 0) { deleting = false; i = (i + 1) % commands.length; return setTimeout(step, 400); }
    setTimeout(step, 25);
  };
  setTimeout(step, 900);
})();

/* ───── workspaces: highlight the visible section, 1…5 to jump ───── */
const sections = $$("main > section[data-ws]");
(() => {
  const buttons = $$(".ws");
  const setActive = (ws) => buttons.forEach((b) => b.classList.toggle("active", b.dataset.ws === ws));
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) setActive(e.target.dataset.ws);
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => io.observe(s));
})();

/* ───── reveal on scroll ───── */
(() => {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => io.observe(el));
})();

/* ───── galleries ───── */
$$("[data-gallery]").forEach((gallery) => {
  const img = $(".shot img", gallery);
  $$(".gallery-tabs button", gallery).forEach((tab) => tab.addEventListener("click", () => {
    if (tab.classList.contains("active")) return;
    $$(".gallery-tabs button", gallery).forEach((t) => t.classList.toggle("active", t === tab));
    img.classList.add("swap");
    const next = new Image();
    next.onload = () => {
      img.src = tab.dataset.src;
      img.alt = tab.dataset.alt;
      img.removeAttribute("width");
      img.removeAttribute("height");
      requestAnimationFrame(() => img.classList.remove("swap"));
    };
    next.src = tab.dataset.src;
  }));
});

/* ───── lightbox ───── */
(() => {
  const box = $("#lightbox"), big = $("img", box);
  const close = () => { box.hidden = true; };
  $$("[data-zoom]").forEach((btn) => btn.addEventListener("click", () => {
    const img = $("img", btn);
    big.src = img.src;
    big.alt = img.alt;
    box.hidden = false;
  }));
  box.addEventListener("click", close);
  addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
})();

/* ───── SUPER + K menu (fuzzel-like) ───── */
const menu = (() => {
  const root = $("#menu"), input = $("#menu-input"), list = $("#menu-list");
  const items = [
    { label: "home", hint: "workspace 1", go: "#home" },
    { label: "projects", hint: "workspace 2", go: "#projects" },
    { label: "skills", hint: "workspace 3", go: "#skills" },
    { label: "history", hint: "workspace 4", go: "#history" },
    { label: "contact", hint: "workspace 5", go: "#contact" },
    { label: "rotten_dotfiles", hint: "repo · Hyprland rice", url: "https://github.com/rotten-guy/dotfiles" },
    { label: "rotten Lily58", hint: "repo · ZMK firmware", url: "https://github.com/rotten-guy/rotten_lily58_keymap_config" },
    { label: "ZMK dongle guide", hint: "write-up", url: "https://github.com/rotten-guy/dotfiles/blob/main/docs/zmk-dongle.md" },
    { label: "IKEv2 VPN on Arch", hint: "write-up", url: "https://github.com/rotten-guy/dotfiles/blob/main/docs/vpn-ikev2-eap.md" },
    { label: "Tablet as a monitor", hint: "write-up", url: "https://github.com/rotten-guy/dotfiles/blob/main/docs/tablet-screen.md" },
    { label: "GitHub profile", hint: "link", url: "https://github.com/rotten-guy" },
    { label: "Root-Me", hint: "training · security", url: "https://www.root-me.org/rotten-guy?lang=en" },
    { label: "LeetCode", hint: "training · algorithms", url: "https://leetcode.com/u/PoUrRiTuRe/" },
    { label: "source of this site", hint: "repo", url: "https://github.com/rotten-guy/rotten-guy.github.io" },
  ];
  let shown = items, sel = 0;
  const render = () => {
    list.innerHTML = "";
    shown.forEach((it, i) => {
      const li = document.createElement("li");
      li.setAttribute("role", "option");
      li.className = i === sel ? "sel" : "";
      li.innerHTML = `<span></span><small></small>`;
      li.firstChild.textContent = it.label;
      li.lastChild.textContent = it.hint;
      li.addEventListener("mouseenter", () => { sel = i; render(); });
      li.addEventListener("click", () => run(it));
      list.append(li);
    });
    list.children[sel]?.scrollIntoView({ block: "nearest" });
  };
  const filter = () => {
    const q = input.value.trim().toLowerCase();
    shown = items.filter((it) => `${it.label} ${it.hint}`.toLowerCase().includes(q));
    sel = 0;
    render();
  };
  const open = () => { root.hidden = false; input.value = ""; filter(); input.focus(); };
  const close = () => { root.hidden = true; };
  const run = (it) => {
    close();
    if (it.go) $(it.go).scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    else window.open(it.url, "_blank", "noopener");
  };
  input.addEventListener("input", filter);
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { sel = Math.min(sel + 1, shown.length - 1); render(); e.preventDefault(); }
    else if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); render(); e.preventDefault(); }
    else if (e.key === "Enter" && shown[sel]) run(shown[sel]);
    else if (e.key === "Escape") close();
  });
  root.addEventListener("click", (e) => { if (e.target === root) close(); });
  $("#open-menu").addEventListener("click", open);
  return { open, close, isOpen: () => !root.hidden };
})();

/* ───── global shortcuts ───── */
addEventListener("keydown", (e) => {
  if (e.target.matches("input, textarea")) return;
  if ((e.key === "k" || e.key === "K") && !e.altKey) {
    e.preventDefault();
    return menu.isOpen() ? menu.close() : menu.open();
  }
  if (menu.isOpen() || e.ctrlKey || e.metaKey || e.altKey) return;
  const n = Number(e.key);
  if (n >= 1 && n <= sections.length) {
    sections[n - 1].scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    return;
  }
  // typing a letter presses the matching skill keycaps
  if (/^[a-z]$/i.test(e.key)) {
    $$(".key").forEach((k) => {
      if (k.textContent.toLowerCase().startsWith(e.key.toLowerCase())) {
        k.classList.add("pressed");
        setTimeout(() => k.classList.remove("pressed"), 180);
      }
    });
  }
});
