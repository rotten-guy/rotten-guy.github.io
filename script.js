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
    { label: "keybr", hint: "training · typing", url: "https://www.keybr.com/profile/752ae7r" },
    { label: "Monkeytype", hint: "training · typing", url: "https://monkeytype.com/profile/rotten_guy" },
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

/* ───── training: live stats from the profile repository ───── */
(() => {
  const DATA = "https://raw.githubusercontent.com/rotten-guy/rotten-guy/main/assets/training.json";
  // the demo loops over these, at my real speed; each one ends with its own punchline
  const PHRASES = [
    ["i use arch btw", "0 typos · nobody asked"],
    ["sudo pacman -Syu", "312 packages · pray for the reboot"],
    ["ping -c 1 8.8.8.8", "64 bytes · the internet still exists"],
  ];
  const set = (sel, value) => $$(sel).forEach((el) => { el.textContent = value; });
  const hours = (min) => { const m = Math.round(min); return m >= 60 ? `${Math.floor(m / 60)}h${String(m % 60).padStart(2, "0")}` : `${m} min`; };
  const iso = (d) => d.toISOString().slice(0, 10);

  // Lily58 geometry, same as the keymap pictures of the dotfiles
  const STAGGER = [0.5, 0.38, 0.12, 0, 0.12, 0.25], WIDTH = 2 * 7.2 + 2.6;
  const BASE = ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "`", "Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "-",
    "Shift", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Ctrl", "Z", "X", "C", "V", "B", "[", "]", "N", "M", ",", ".", "/", "Shift",
    "Alt", "Super", "LOWER", "Space", "Enter", "RAISE", "Bksp", "Super"];
  const positions = () => {
    const left = (c, r) => [c, STAGGER[c] + r, 0];
    const mirror = ([x, y, rot]) => [WIDTH - x - 1, y, -rot];
    const pos = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 6; c++) pos.push(left(c, r));
      for (let c = 0; c < 6; c++) pos.push(mirror(left(5 - c, r)));
    }
    for (let c = 0; c < 6; c++) pos.push(left(c, 3));
    pos.push([6.05, 2.75, 0], mirror([6.05, 2.75, 0]));
    for (let c = 0; c < 6; c++) pos.push(mirror(left(5 - c, 3)));
    const thumbs = [[2.5, 4.1, 0], [3.5, 4.12, 0], [4.5, 4.3, 0], [5.8, 4.3, 30]];
    return pos.concat(thumbs, thumbs.slice().reverse().map(mirror));
  };

  const keys = new Map();   // label (upper case) → <g>
  (() => {
    const svg = $("#rig-keys"), U = 40, NS = "http://www.w3.org/2000/svg";
    svg.setAttribute("viewBox", `0 0 ${WIDTH * U} ${5.9 * U}`);
    positions().forEach(([x, y, rot], i) => {
      const big = i >= 50 && rot !== 0, w = 0.9 * U, h = (big ? 1.4 : 0.9) * U;
      const px = (x + 0.05) * U, py = (y + 0.05) * U;
      const g = document.createElementNS(NS, "g");
      g.setAttribute("class", "k" + (i >= 50 ? " thumb" : ""));
      if (rot) g.setAttribute("transform", `rotate(${rot} ${px + w / 2} ${py + h / 2})`);
      const rect = document.createElementNS(NS, "rect");
      Object.entries({ x: px, y: py, width: w, height: h, rx: 7 }).forEach(([k, v]) => rect.setAttribute(k, v));
      const label = document.createElementNS(NS, "text");
      Object.entries({ x: px + w / 2, y: py + h / 2 + 4, "text-anchor": "middle" }).forEach(([k, v]) => label.setAttribute(k, v));
      label.textContent = BASE[i];
      label.setAttribute("class", BASE[i].length > 2 ? "small" : "");
      g.append(rect, label);
      svg.append(g);
      if (!keys.has(BASE[i].toUpperCase())) keys.set(BASE[i].toUpperCase(), g);
    });
  })();

  const press = (ch) => {
    const hit = (name) => {
      const g = keys.get(name);
      if (!g) return;
      g.classList.add("down");
      setTimeout(() => g.classList.remove("down"), 110);
    };
    if (ch === " ") return hit("SPACE");
    if (ch.length > 1) return hit(ch.toUpperCase());        // a key name: Ctrl, Bksp…
    if (/[A-Z]/.test(ch)) hit("SHIFT");
    hit(ch.toUpperCase());
  };

  let wpm = 60, timer = null, demo = true, phrase = 0, erased = 0;
  const typed = $("#rig-typed"), gag = $("#rig-gag");
  const wait = (ms) => new Promise((done) => { timer = setTimeout(done, ms); });
  // types a phrase, shows its punchline, then erases it like a human would:
  // Ctrl + A then Backspace, or Backspace held down (one phrase each)
  const loop = async () => {
    clearTimeout(timer);
    const run = ++loop.run;
    const alive = () => demo && run === loop.run;
    const step = 60000 / (wpm * 5);
    while (alive()) {
      const [line, punchline] = PHRASES[phrase];
      const selectAll = erased++ % 2 === 0;   // alternate the two ways to erase
      phrase = (phrase + 1) % PHRASES.length;
      typed.textContent = "";
      gag.textContent = punchline;
      await wait(700);
      for (const ch of line) {
        if (!alive()) return;
        press(ch);
        typed.textContent += ch;
        await wait(step);
      }
      gag.classList.add("show");
      await wait(2600);
      if (!alive()) return;
      gag.classList.remove("show");
      if (selectAll) {
        press("Ctrl"); press("a");
        typed.classList.add("selected");
        await wait(450);
        press("Bksp");
        typed.classList.remove("selected");
        typed.textContent = "";
      } else {
        while (typed.textContent && alive()) {
          press("Bksp");
          typed.textContent = typed.textContent.slice(0, -1);
          await wait(45);
        }
      }
    }
  };
  loop.run = 0;
  $("#rig-mine").addEventListener("click", (e) => {
    demo = !demo;
    e.target.textContent = demo ? "type something yourself" : "back to the demo";
    gag.classList.remove("show");
    typed.classList.remove("selected");
    typed.textContent = "";
    loop.run++;
    if (demo) loop();
  });
  addEventListener("keydown", (e) => {
    if (demo || e.ctrlKey || e.metaKey || e.altKey || e.target.matches("input, textarea")) return;
    if (e.key === "Backspace") { typed.textContent = typed.textContent.slice(0, -1); press("Bksp"); }
    else if (e.key.length === 1) { typed.textContent = (typed.textContent + e.key).slice(-40); press(e.key); }
    else return;
    e.stopPropagation();
  }, true);

  // typing log: one square per day, from the first lesson (at least 12 months)
  const drawLog = (data) => {
    const days = {};
    Object.entries(data.keybr?.days || {}).forEach(([d, v]) => { days[d] = { min: v.minutes, lessons: v.lessons, tests: 0 }; });
    Object.entries(data.monkeytype?.days || {}).forEach(([d, n]) => { days[d] = { ...(days[d] || { min: 0, lessons: 0 }), tests: n }; });
    const today = new Date(new Date().toISOString().slice(0, 10));
    let start = new Date(today); start.setUTCDate(start.getUTCDate() - 364);
    const first = Object.keys(days).sort()[0];
    if (first && new Date(first) < start) start = new Date(first);
    start.setUTCDate(start.getUTCDate() - start.getUTCDay());
    const grid = $("#tlog-grid"), tip = $("#tlog-tip"), detail = $("#tlog-detail");
    const level = (d) => { const t = d ? d.min + d.tests * 0.75 : 0; return t <= 0 ? 0 : t < 5 ? 1 : t < 12 ? 2 : t < 25 ? 3 : 4; };
    const describe = (date, d) => {
      const when = new Date(date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
      if (!d) return `${when}: no typing, the keyboard was resting`;
      const parts = [];
      if (d.min) parts.push(`${hours(d.min)} on keybr (${d.lessons} lessons)`);
      if (d.tests) parts.push(`${d.tests} Monkeytype test${d.tests > 1 ? "s" : ""}`);
      return `${when}: ${parts.join(" · ")}`;
    };
    grid.innerHTML = "";
    for (let d = new Date(start); d <= today; d.setUTCDate(d.getUTCDate() + 1)) {
      const date = iso(d), cell = document.createElement("button");
      cell.type = "button";
      cell.className = `l${level(days[date])}`;
      cell.dataset.date = date;
      cell.setAttribute("aria-label", describe(date, days[date]));
      grid.append(cell);
    }
    const showTip = (cell) => {
      tip.textContent = cell.getAttribute("aria-label");
      tip.hidden = false;
      const box = cell.getBoundingClientRect(), host = tip.parentElement.getBoundingClientRect();
      tip.style.left = `${Math.min(Math.max(box.left - host.left + 8, 120), host.width - 120)}px`;
      tip.style.top = `${box.top - host.top - 10}px`;
    };
    grid.addEventListener("mouseover", (e) => { if (e.target.dataset.date) showTip(e.target); });
    grid.addEventListener("mouseleave", () => { tip.hidden = true; });
    grid.addEventListener("click", (e) => {
      if (!e.target.dataset.date) return;
      $$("#tlog-grid .sel").forEach((c) => c.classList.remove("sel"));
      e.target.classList.add("sel");
      detail.textContent = e.target.getAttribute("aria-label");
    });
    const scroller = $(".tlog-scroll");
    requestAnimationFrame(() => { scroller.scrollLeft = scroller.scrollWidth; });  // newest days first in view
    const total = Object.values(days).reduce((s, d) => s + d.min, 0);
    set('[data-ty="days"]', `${Object.keys(days).length} days · ${hours(total)}`);
    return days;
  };

  const streak = (days) => {
    let n = 0;
    const d = new Date(new Date().toISOString().slice(0, 10));
    if (!days[iso(d)]) d.setUTCDate(d.getUTCDate() - 1);
    while (days[iso(d)]) { n++; d.setUTCDate(d.getUTCDate() - 1); }
    return n;
  };

  fetch(DATA, { cache: "no-cache" })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((data) => {
      const kb = data.keybr || {}, mt = data.monkeytype || {}, rm = data.rootme;
      const pb = mt.pb || {}, mode = ["60", "30", "15"].find((m) => pb[m]);
      wpm = mode ? pb[mode].wpm : kb.wpm_avg || 60;
      const best = Math.max(kb.wpm_best || 0, ...Object.values(pb).map((v) => v.wpm));
      set('[data-ty="avg"]', Math.round(kb.wpm_avg || 0));
      set('[data-ty="best"]', Math.round(best));
      set('[data-ty="time"]', hours((kb.minutes || 0) + (mt.minutes || 0)));
      set('[data-ty="speed"]', `${Math.round(wpm)} wpm`);
      set('[data-ty="speed2"]', `${Math.round(wpm)} WPM`);
      set('[data-ty="source"]', mode ? `Monkeytype ${mode} s record` : "keybr average");
      const days = drawLog(data);
      const s = streak(days);
      set('[data-ty="streak"]', s ? `${s} day${s > 1 ? "s" : ""}` : "starts again today");
      if (rm) {
        set('[data-rm="score"]', rm.score);
        set('[data-rm="solved"]', rm.solved);
        set('[data-rm="position"]', `#${rm.position}`);
        set('[data-rm="status"]', rm.recent?.[0] ? `last: ${rm.recent[0].title}` : "first flag soon");
        if (rm.rank) set('[data-rm="rank"]', rm.rank);
      } else {
        set('[data-rm="score"]', "0");
        set('[data-rm="solved"]', "0");
        set('[data-rm="position"]', "soon");
      }
      if (!reducedMotion) loop(); else typed.textContent = PHRASES[0][0];
    })
    .catch(() => {
      $("#training").classList.add("offline");
      typed.textContent = PHRASES[0][0];
    });
})();
