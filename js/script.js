// ============================================================
// WEB AUDIO — Cinematic ambient music
// ============================================================
// ---- AUDIO FILE ----
const bgAudio = new Audio('https://files.catbox.moe/7nmb93.mp3');
bgAudio.loop = true;
bgAudio.volume = 0.3;

let musicPlaying = false,
  audioStarted = false;

function startMusic() {
  if (audioStarted) return;
  audioStarted = true;
  bgAudio.play().catch(() => {});
  musicPlaying = true;
  updateMusicIcon();
}

function boostMusic() {
  const fadeIn = setInterval(() => {
    if (bgAudio.volume < 0.85) {
      bgAudio.volume = Math.min(0.85, bgAudio.volume + 0.04);
    } else {
      clearInterval(fadeIn);
    }
  }, 80);
}

function toggleMusic() {
  if (musicPlaying) {
    bgAudio.pause();
    musicPlaying = false;
  } else {
    bgAudio.play().catch(() => {});
    musicPlaying = true;
  }
  updateMusicIcon();
}

function updateMusicIcon() {
  document.getElementById("music-icon-play").style.display = musicPlaying ? "none" : "block";
  document.getElementById("music-icon-pause").style.display = musicPlaying ? "block" : "none";
}

document.getElementById("music-btn").addEventListener("click", toggleMusic);

// ============================================================
// SCENE 1 — TYPEWRITER
// ============================================================
const PIN_CORRECT = "0705";
let pinInput = "";
let pinLocked = false;

const lines = [
  "alloooo....😝",
  "akhirnyaa.. hari yang paling kamu tunggu tunggu tiba juga yaa..",
  "selamat ulang tahun sayangnyaa akuuu...",
  "jujur, bukan cuma kamu yang nunggu moment ini,",
  "aku jugaa, senenggg bangett tiap tanggal 7 mei..",
  "tau ngga kenapaa?",
  "sebab ini tentang kamuu..",
  "seseorang yang tanpa sadar, ngerubah banyak hal di hidup aku..",
  "aku ga jago ngerangkai kalimat yang indah..",
  "atau kata kata yang sosweet..",
  "jadi aku ngomong seadanya aja yaa..",
  "akuu seneng kamu adaa,",
  "aku seneng bisa kenal kamu,",
  "bahkan sampai bisa deket kamuu..",
  "seneng bisa ada di hidup kamu..",
  "meski mungkin cuma sebagian kecil.",
  "kadang.. kamu tuh ga sadar..",
  "kalo kamu tuh ngaruhh bangettt ke hidup akuu, mood akuu, dan juga di setiap hariiku,",
  "hal hal kecil dari kamu aja udah cukup buat bikin semuanya jadi kerasa beda dan lebih berarti..",
  "jadiii hari inii..",
  "gausa ribet yaa..",
  "gausah mikir jauh jauh duluu..",
  "gaperlu berlari terlalu cepat hanya untuk sampai dengan cepat..",
  "cukup nikmatin hari ini dengan cara kamu sendiri..",
  "happy birthday yaa sayaanggkuu..",
  "semoga pelan pelan banyak hal baik yang datang ke kamu,",
  "dan..",
  "semoga aku akan selalu disitu..",
  "di hati kamu yang rapuh itu..",
  "pelan-pelan aja yaaa...",
  "nggak semua hal harus kamu jalanin sendiri..",
  "aku disini kokk, bakal terus ada buat kamuu..",
  "sekali lagii",
  "selamat ulang tahun yaa sayanggg.",
];

const container = document.getElementById("typing-container");
const domLines = [];

lines.forEach((text, i) => {
  const el = document.createElement("div");
  el.className = "typed-line" + (i === lines.length - 1 ? " last-line" : "");
  el.dataset.text = text;
  container.appendChild(el);
  domLines.push(el);
});

let currentLine = 0;
let charIndex = 0;
let typingTimer = null;
let lineTimer = null;
let sceneTransitioning = false;

const CHAR_SPEED = 62;
const LINE_PAUSE = 900;

function getLineDelay(text) {
  if (text.length < 8) return 1800;
  if (text.length < 16) return 1300;
  return LINE_PAUSE;
}

function typeLine(lineIdx) {
  if (lineIdx >= lines.length || sceneTransitioning) return;
  currentLine = lineIdx;
  charIndex = 0;
  const el = domLines[lineIdx];
  const text = lines[lineIdx];

  domLines.forEach((l, i) => {
    if (i < lineIdx) l.classList.add("dim");
    if (i < lineIdx) l.classList.remove("blink-cursor");
  });

  el.classList.add("visible", "blink-cursor");
  el.textContent = "";

  el.scrollIntoView({ behavior: "smooth", block: "center" });

  typingTimer = setInterval(() => {
    if (charIndex < text.length) {
      el.textContent = text.slice(0, charIndex + 1);
      charIndex++;
    } else {
      clearInterval(typingTimer);
      el.classList.remove("blink-cursor");

      if (lineIdx === lines.length - 1) {
        lineTimer = setTimeout(() => showPinArea(), 2200);
      } else {
        lineTimer = setTimeout(() => typeLine(lineIdx + 1), getLineDelay(text));
      }
    }
  }, CHAR_SPEED);
}

// Typewriter belum jalan — tunggu klik pertama
document.getElementById("first-overlay").addEventListener(
  "click",
  () => {
    const overlay = document.getElementById("first-overlay");
    overlay.classList.add("hide");
    setTimeout(() => {
      overlay.style.display = "none";
      startMusic();
      typeLine(0);
    }, 800);
  },
  { once: true },
);

// ============================================================
// TRANSITION S1 → S2
// ============================================================
function showPinArea() {
  const btnArea = document.getElementById("reveal-btn-area");
  btnArea.classList.remove("hidden");
  setTimeout(() => btnArea.classList.add("show"), 50);
  const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (isMobile) setTimeout(() => showNumpad(), 400);
  document.getElementById("reveal-btn").addEventListener(
    "click",
    () => {
      // fade out paper
      document.getElementById("paper").style.transition = "opacity 0.5s ease";
      document.getElementById("paper").style.opacity = "0";

    setTimeout(() => {
  const pinOverlay = document.getElementById('pin-overlay');
  pinOverlay.style.display = 'flex';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    pinOverlay.classList.add('show');
  }));
  document.addEventListener('keydown', onPinKeydown);
  showNumpad();
}, 500);
    },
    { once: true },
  );
}

function onPinKeydown(e) {
  if (pinLocked) return;

  if (e.key >= "0" && e.key <= "9" && pinInput.length < 4) {
    pinInput += e.key;
    updatePinBoxes();
    if (pinInput.length === 4) validatePin();
  }

  if (e.key === "Backspace" && pinInput.length > 0) {
    pinInput = pinInput.slice(0, -1);
    updatePinBoxes();
    clearPinError();
  }
}

// Touch/click number input untuk mobile
function initPinTouch() {
  document.addEventListener("click", onPinClick);
}

function onPinClick(e) {
  if (pinLocked) return;
  if (!document.getElementById("pin-area").classList.contains("show")) return;
  // ignore klik di luar paper
  if (e.target.closest("#scene2")) return;
}

// Virtual numpad — muncul otomatis di mobile
function showNumpad() {
  const existing = document.getElementById('numpad');
  if (existing) return;

  const numpad = document.createElement('div');
  numpad.id = 'numpad';
  const keys = ['1','2','3','4','5','6','7','8','9','←','0','✓'];
  keys.forEach(k => {
    const btn = document.createElement('button');
    btn.className = 'numpad-key';
    btn.textContent = k;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (pinLocked) return;
      if (k === '←') {
        if (pinInput.length > 0) {
          pinInput = pinInput.slice(0, -1);
          updatePinBoxes();
          clearPinError();
        }
      } else if (k === '✓') {
        if (pinInput.length === 4) validatePin();
      } else {
        if (pinInput.length < 4) {
          pinInput += k;
          updatePinBoxes();
          if (pinInput.length === 4) validatePin();
        }
      }
    });
    numpad.appendChild(btn);
  });
  document.getElementById('pin-card').appendChild(numpad);
}

function updatePinBoxes() {
  const boxes = document.querySelectorAll(".pin-box");
  boxes.forEach((box, i) => {
    if (i < pinInput.length) {
      box.textContent = "•";
      box.classList.add("filled");
      box.classList.remove("active");
    } else if (i === pinInput.length) {
      box.textContent = "";
      box.classList.remove("filled");
      box.classList.add("active");
    } else {
      box.textContent = "";
      box.classList.remove("filled", "active");
    }
  });
}

function validatePin() {
  if (pinInput === PIN_CORRECT) {
    pinLocked = true;
    document.removeEventListener("keydown", onPinKeydown);

    // flash sukses dulu baru pindah scene
    document.querySelectorAll(".pin-box").forEach((b) => {
      b.style.background = "linear-gradient(135deg, #b7e4c7, #74c69d)";
      b.style.borderColor = "#2d6a4f";
      b.style.transform = "scale(1.12)";
    });

    setTimeout(() => goToScene2(), 800);
  } else {
    pinLocked = true;
    const boxes = document.getElementById("pin-boxes");
    const error = document.getElementById("pin-error");
    boxes.classList.add("shake");
    error.textContent = "tetot salahh 🙈";
    setTimeout(() => {
      boxes.classList.remove("shake");
      pinInput = "";
      pinLocked = false;
      updatePinBoxes();
      clearPinError();
    }, 1200);
  }
}

function clearPinError() {
  document.getElementById("pin-error").textContent = "";
}

function goToScene2() {
  sceneTransitioning = true;

  const overlay = document.getElementById("transition-overlay");
  overlay.classList.add("active");

  setTimeout(() => {
    document.getElementById("scene1").classList.add("hidden");
    document.getElementById("scene2").classList.remove("hidden");
    overlay.style.transition = "opacity 1.2s ease";
    overlay.classList.remove("active");
    initScene2();
  }, 700);
}

// ============================================================
// SCENE 2 — INIT
// ============================================================
function initScene2() {
  boostMusic();

  initCanvas();
  document.addEventListener("mousemove", onMouseMove);

  // nama muncul setelah burst sedikit settle
  // shockwave saat burst
setTimeout(() => {
  const sw = document.createElement('div');
  sw.className = 'shockwave';
  document.getElementById('scene2').appendChild(sw);
  setTimeout(() => sw.remove(), 1000);
}, 100);

// watermark tahun
setTimeout(() => {
  document.getElementById('year-watermark').classList.add('show');
}, 400);

// nama
setTimeout(() => {
  document.getElementById('name-hbd').classList.add('show');
  document.getElementById('name-main').classList.add('pop');
}, 800);

// tanggal
setTimeout(() => {
  document.getElementById('name-date').classList.add('show');
}, 1000);

  setTimeout(() => document.getElementById("music-btn").classList.add("show"), 1200);

  // burst awal
  setTimeout(() => {
    for (let i = 0; i < 8; i++) setTimeout(() => launchFirework(), i * 120);
    spawnConfettiBurst(250);
  }, 100);

  // kembang api terus
  setInterval(() => {
    if (Math.random() < 0.7) launchFirework();
  }, 800);

  // confetti terus tapi lebih jarang
  setInterval(() => {
    if (document.getElementById("scene2").classList.contains("hidden")) return;
    spawnConfettiBurst(6);
  }, 700);
}

// ============================================================
// CANVAS FX — Fireworks + Confetti + Cursor trail
// ============================================================
const canvas = document.getElementById("fx-canvas");
const ctx2 = canvas.getContext("2d");

let W, H;
function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const particles = [];
const confetti = [];
const trails = [];

const GREEN_GOLD = ["#2d6a4f", "#40916c", "#52b788", "#74c69d", "#f4c542", "#c9a227", "#e9c46a", "#ffd166", "#c0392b", "#e74c3c", "#e8b4b8", "#1e2a1e", "#3d5a3e"];

function rndColor() {
  return GREEN_GOLD[Math.floor(Math.random() * GREEN_GOLD.length)];
}
function rnd(a, b) {
  return a + Math.random() * (b - a);
}

// ---- FIREWORK ----
function launchFirework() {
  const x = rnd(W * 0.15, W * 0.85);
  const y = rnd(H * 0.08, H * 0.55);
  const count = Math.floor(rnd(55, 90));
  const color = rndColor();
  const color2 = rndColor();

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const speed = rnd(2.5, 7.5);
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      size: rnd(1.5, 3.5),
      color: Math.random() < 0.6 ? color : color2,
      decay: rnd(0.013, 0.022),
      gravity: 0.06,
      trail: [],
    });
  }
}

// ---- CONFETTI ----
const SHAPES = ['rect', 'circle', 'line'];
function spawnConfettiBurst(count) {
  for (let i = 0; i < count; i++) {
    confetti.push({
      x: rnd(0, W),
      y: rnd(-60, -10),
      vx: rnd(-2, 2),
      vy: rnd(1.5, 4.5),
      size: rnd(5, 10),
      color: rndColor(),
      rot: rnd(0, Math.PI * 2),
      rotV: rnd(-0.08, 0.08),
      alpha: 1,
      wave: rnd(0, Math.PI * 2),
      waveSpeed: rnd(0.02, 0.06),
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)]
    });
  }
}

setInterval(() => {
  if (document.getElementById("scene2").classList.contains("hidden")) return;
  spawnConfettiBurst(8);
}, 600);

// ---- CURSOR TRAIL ----
let mouseX = -999,
  mouseY = -999;
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  const cur = document.getElementById("cursor");
  cur.style.left = e.clientX + "px";
  cur.style.top = e.clientY + "px";
  cur.style.zIndex = "9999";

  if (!document.getElementById("scene2").classList.contains("hidden")) {
    for (let i = 0; i < 3; i++) {
      trails.push({
        x: mouseX + rnd(-4, 4),
        y: mouseY + rnd(-4, 4),
        vx: rnd(-0.8, 0.8),
        vy: rnd(-1.5, -0.3),
        alpha: 0.85,
        size: rnd(2, 5),
        color: rndColor(),
        decay: 0.04,
      });
    }
  }
});

// ---- PARALLAX ----
let px = 0,
  py = 0;
function onMouseMove(e) {
  const cx = e.clientX - W / 2;
  const cy = e.clientY - H / 2;
  px = cx * 0.012;
  py = cy * 0.012;
  document.getElementById("parallax-layer").style.transform = `translate(${px}px, ${py}px)`;
}

// ---- ANIMATION LOOP ----
function animate() {
  requestAnimationFrame(animate);
  ctx2.clearRect(0, 0, W, H);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.trail.push({ x: p.x, y: p.y });
    if (p.trail.length > 5) p.trail.shift();

    p.trail.forEach((t, ti) => {
      ctx2.beginPath();
      ctx2.arc(t.x, t.y, p.size * (ti / p.trail.length) * 0.6, 0, Math.PI * 2);
      ctx2.fillStyle = p.color;
      ctx2.globalAlpha = p.alpha * (ti / p.trail.length) * 0.4;
      ctx2.fill();
    });

    ctx2.beginPath();
    ctx2.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx2.fillStyle = p.color;
    ctx2.globalAlpha = p.alpha;
    ctx2.fill();
    ctx2.globalAlpha = 1;

    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.985;
    p.alpha -= p.decay;
    if (p.alpha <= 0) particles.splice(i, 1);
  }

  for (let i = confetti.length - 1; i >= 0; i--) {
    const c = confetti[i];
    c.wave += c.waveSpeed;
    c.x += c.vx + Math.sin(c.wave) * 0.5;
    c.y += c.vy;
    c.rot += c.rotV;
    c.vy += 0.02;

    ctx2.save();
    ctx2.translate(c.x, c.y);
    ctx2.rotate(c.rot);
    ctx2.globalAlpha = c.alpha;
    ctx2.fillStyle = c.color;

    if (c.shape === "circle") {
      ctx2.beginPath();
      ctx2.arc(0, 0, c.size / 2, 0, Math.PI * 2);
      ctx2.fill();
    } else if (c.shape === "line") {
      ctx2.fillRect(-c.size / 2, -c.size / 6, c.size * 1.8, c.size / 3);
    } else {
      ctx2.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
    }

    ctx2.restore();
    ctx2.globalAlpha = 1;

    if (c.y > H + 20) confetti.splice(i, 1);
  }

  for (let i = trails.length - 1; i >= 0; i--) {
    const t = trails[i];
    ctx2.beginPath();
    ctx2.arc(t.x, t.y, t.size, 0, Math.PI * 2);
    ctx2.fillStyle = t.color;
    ctx2.globalAlpha = t.alpha;
    ctx2.fill();
    ctx2.globalAlpha = 1;
    t.x += t.vx;
    t.y += t.vy;
    t.alpha -= t.decay;
    if (t.alpha <= 0) trails.splice(i, 1);
  }
}

function initCanvas() {
  animate();
}
