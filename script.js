const CONFIG = {
  nameA: "P",
  nameB: "J",
  startDate: "2024-07-30",
};

const DEVICE = detectDevice();
document.documentElement.dataset.device = DEVICE;

const GALLERY_IMAGES = {
  pc: [
    { src: 'gallery/images/pc_images/43dafc29aef11539c215a6dda1fc4876.jpg', caption: 'A quiet frame, kept just for us', tall: true },
    { src: 'gallery/images/pc_images/735798ab746a5240773dca877373df20.jpg', caption: 'The nights we didn\u2019t want to end' },
    { src: 'gallery/images/pc_images/f0cc9c8e9d77bfb7da5e488583f78e29.jpg', caption: 'Quiet, and completely at peace', wide: true },
  ],
  mobile: [
    { src: 'gallery/images/android_images/moonlit-blossom.jpg', caption: 'Under a sky that stood still, just for us', tall: true },
    { src: 'gallery/images/android_images/dawn-blossom.jpg', caption: 'Every morning, a small beginning' },
    { src: 'gallery/images/android_images/firefly-meadow.jpg', caption: 'The nights we didn\u2019t want to end' },
    { src: 'gallery/images/android_images/swan-light.jpg', caption: 'Quiet, and completely at peace', wide: true },
  ],
};

const MEMORY_ENTRIES = [
  { folder: 'New Folder', images: ['memories/New Folder/first story.jpg'], caption: 'Your first story \u2014 about black holes. I love cosmology, and that\u2019s the point you first took my attention.' },
  { folder: 'New Folder 1', images: ['memories/New Folder 1/memories2.jpg'], caption: 'First intro of you \u2014 the first time I asked about you.' },
  { folder: 'New Folder 2', images: ['memories/New Folder 2/IMG_20260729_105241_064.jpg'], caption: 'Your mehndi \u2014 the first time you showed me your hands, freshly painted.' },
  { folder: 'Funny moments', images: ['memories/Funny moments/funny.jpg', 'memories/Funny moments/funny1.jpg'], caption: null },
];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function detectDevice() {
  const ua = navigator.userAgent || '';
  const isMobileUA = /Android|iPhone|iPad|iPod|Mobile|webOS/i.test(ua);
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.innerWidth <= 900;
  return (isMobileUA || (isCoarse && narrow)) ? 'mobile' : 'desktop';
}

function encodePath(p) {
  return p.split('/').map(encodeURIComponent).join('/');
}

function probeImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Looks for files named 1.jpg, 2.jpg, 3.png ... inside `folder` and returns
// whichever ones actually exist, in order. Lets photos be added just by
// dropping renamed files into the folder — no code changes needed.
async function findNumberedImages(folder, max = 24, exts = ['jpg', 'jpeg', 'png', 'webp']) {
  const perIndex = await Promise.all(
    Array.from({ length: max }, (_, idx) => {
      const i = idx + 1;
      return Promise.all(exts.map((ext) => probeImage(encodePath(`${folder}/${i}.${ext}`))))
        .then((results) => results.find(Boolean) || null);
    })
  );
  return perIndex.filter(Boolean);
}

// Looks for a single file named e.g. "top.jpg" / "top.png" inside `folder`.
async function findNamedImage(folder, name, exts = ['jpg', 'jpeg', 'png', 'webp']) {
  const results = await Promise.all(exts.map((ext) => probeImage(encodePath(`${folder}/${name}.${ext}`))));
  return results.find(Boolean) || null;
}

function preloadImages(sources) {
  return Promise.all(
    sources.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(img);
          img.src = src;
        })
    )
  );
}

(async function init() {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  document.body.classList.add('intro-active');

  const galleryData = DEVICE === 'mobile' ? GALLERY_IMAGES.mobile : GALLERY_IMAGES.pc;
  const galleryPaths = galleryData.map((g) => g.src);
  const images = await preloadImages(galleryPaths);

  applyConfig();
  buildGalleryGrid();
  buildMemoriesGrid();
  buildShowcaseImages();
  initGalleryLightbox();
  hidePreloader();
  initIntroHeart();
  initSmoothScroll();
  initCursorGlow();
  initAmbientParticles();
  initHeroSequence(images);
  initBloom();
  initTimelineReveal();
  initGalleryParallax();
  initMilestoneCounters();
  initLetterReveal();
  initWishesReveal();
  initCountdown();
  initShowcaseParallax();
  initMagneticButtons();
  initForeverCanvas();
  loadForeverGallery();
  initPetals();
  initNavScrollState();
  initFlightVideo();
  initPhotoFrameCaptions();
  loadFrameSectionImages();
  initOptionalVideo();

  ScrollTrigger.refresh();
})();

function applyConfig() {
  const monogram = `${CONFIG.nameA} \u2726 ${CONFIG.nameB}`;
  document.querySelectorAll('[data-monogram]').forEach((el) => (el.textContent = monogram));
}

function hidePreloader() {
  const el = document.getElementById('preloader');
  requestAnimationFrame(() => {
    setTimeout(() => el.classList.add('hidden'), 250);
  });
}

function initIntroHeart() {
  const intro = document.getElementById('intro');
  const canvas = document.getElementById('heart-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, DPR;

  function size() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = window.innerWidth * DPR;
    H = canvas.height = window.innerHeight * DPR;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }
  size();
  window.addEventListener('resize', debounce(size, 200));

  function heartPoint(t, scale) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x: x * scale, y: y * scale };
  }

  const N = prefersReducedMotion ? 0 : 220;
  const particles = [];
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    const scale = Math.min(window.innerWidth, window.innerHeight) * DPR * 0.013;
    const target = heartPoint(t, scale);
    particles.push({
      x: (Math.random() - 0.5) * W * 1.3,
      y: (Math.random() - 0.5) * H * 1.3,
      tx: target.x, ty: target.y,
      size: Math.random() * 2 + 0.6,
      hue: Math.random() > 0.5 ? '201,168,106' : '244,237,225',
    });
  }

  let start = null;
  let raf;
  function frame(ts) {
    if (!start) start = ts;
    const elapsed = ts - start;
    const progress = Math.min(1, elapsed / 3200);
    const ease = 1 - Math.pow(1 - progress, 3);

    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2 - H * 0.02;
    const pulse = 1 + Math.sin(elapsed / 420) * 0.02 * ease;

    particles.forEach((p) => {
      const px = cx + p.tx * ease * pulse;
      const py = cy + p.ty * ease * pulse;
      const curX = p.x + (px - p.x) * ease;
      const curY = p.y + (py - p.y) * ease;
      const r = p.size * DPR * (1 + ease);
      ctx.beginPath();
      ctx.arc(curX, curY, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue},${0.55 + 0.4 * ease})`;
      ctx.fill();
    });

    if (progress >= 1) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 220 * DPR);
      glow.addColorStop(0, `rgba(232,201,143,${0.14 + 0.05 * Math.sin(elapsed / 500)})`);
      glow.addColorStop(1, 'rgba(232,201,143,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(cx - 260 * DPR, cy - 260 * DPR, 520 * DPR, 520 * DPR);
      ctx.restore();
    }

    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  document.getElementById('enter-btn').addEventListener('click', function () {
    intro.classList.add('hidden');
    document.body.classList.remove('intro-active');
    cancelAnimationFrame(raf);
  }, { once: true });
}

// Reads an image's real natural dimensions and decides whether it should
// get a tall (portrait) tile, a wide (landscape) tile, or a default
// square-ish tile — based on the photo's actual shape, not a guess.
function classifyOrientation(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (!w || !h) return resolve({ tall: false, wide: false });
      const ratio = w / h;
      if (ratio >= 1.35) resolve({ tall: false, wide: true });
      else if (ratio <= 0.75) resolve({ tall: true, wide: false });
      else resolve({ tall: false, wide: false });
    };
    img.onerror = () => resolve({ tall: false, wide: false });
    img.src = src;
  });
}

async function buildGalleryGrid() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  // "Moments, held onto" only ever pulls from the moments/ folder —
  // never from pc_images / android_images — on both PC and Android.
  const deviceFolder = DEVICE === 'mobile' ? 'gallery/images/moments/android' : 'gallery/images/moments/pc';
  let moments = await findNumberedImages(deviceFolder);
  if (!moments.length) {
    // Back-compat: a flat, non-device-specific folder inside moments/ still works if present.
    moments = await findNumberedImages('gallery/images/moments');
  }

  const items = await Promise.all(
    moments.map(async (src) => {
      const { tall, wide } = await classifyOrientation(src);
      return { src, caption: '', tall, wide };
    })
  );

  grid.innerHTML = '';
  items.forEach((item, i) => {
    const figure = document.createElement('figure');
    figure.className = 'gallery-item glass-frame';
    if (item.tall) figure.classList.add('gallery-item--tall');
    if (item.wide) figure.classList.add('gallery-item--wide');
    figure.dataset.parallax = String(0.08 + (i % 3) * 0.06);
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.caption || 'A held-onto moment';
    img.loading = 'lazy';
    figure.appendChild(img);
    if (item.caption) {
      const caption = document.createElement('figcaption');
      caption.textContent = item.caption;
      figure.appendChild(caption);
    }
    grid.appendChild(figure);
  });

  if (!prefersReducedMotion) initGalleryParallax();
  ScrollTrigger.refresh();
}

function buildMemoriesGrid() {
  const grid = document.getElementById('memories-grid');
  if (!grid) return;
  grid.innerHTML = '';
  MEMORY_ENTRIES.forEach((entry) => {
    const card = document.createElement('div');
    card.className = entry.images.length > 1 ? 'memory-card memory-card--pair' : 'memory-card';
    entry.images.forEach((src) => {
      const img = document.createElement('img');
      img.src = encodePath(src);
      img.alt = entry.caption || entry.folder;
      img.loading = 'lazy';
      card.appendChild(img);
    });
    grid.appendChild(card);
  });
}

async function buildShowcaseImages() {
  const panels = Array.from(document.querySelectorAll('.showcase-img'));
  if (!panels.length) return;

  // "seen, remembered" / "you made the ordinary" panels only ever pull from
  // the forever/ folder — same images on PC and Android.
  const foreverImages = await findNumberedImages('forever/images', panels.length);

  panels.forEach((img, i) => {
    const src = foreverImages[i] || foreverImages[foreverImages.length - 1];
    if (src) img.src = src;
  });
}

function initFlightVideo() {
  const video = document.getElementById('flight-video');
  const section = document.getElementById('flight');
  if (!video || !section) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
  }, { threshold: 0.15 });
  obs.observe(section);
}

async function loadFrameSectionImages() {
  const folder = 'frame/where-it-all-began';
  const [top, bottom] = await Promise.all([
    findNamedImage(folder, 'top'),
    findNamedImage(folder, 'bottom'),
  ]);
  const topEl = document.querySelector('.photo-frame-slot--top img');
  const bottomEl = document.querySelector('.photo-frame-slot--bottom img');
  if (top && topEl) topEl.src = top;
  if (bottom && bottomEl) bottomEl.src = bottom;
}

function initPhotoFrameCaptions() {
  const slots = document.querySelectorAll('.photo-frame-slot');
  slots.forEach((slot) => {
    const caption = slot.querySelector('.photo-frame-caption');
    if (caption) caption.textContent = slot.dataset.caption || '';
  });

  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  if (!isCoarse) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, { threshold: 0.6 });
  slots.forEach((slot) => obs.observe(slot));
}

function initOptionalVideo() {
  const section = document.getElementById('ourvideo');
  const video = document.getElementById('our-video');
  if (!section || !video) return;
  const src = DEVICE === 'mobile' ? 'video/android/video.mp4' : 'video/pc/video.mp4';
  video.addEventListener('loadedmetadata', () => {
    section.hidden = false;
    ScrollTrigger.refresh();
  });
  video.addEventListener('error', () => { section.hidden = true; });
  video.src = src;
  video.load();
}

function initSmoothScroll() {
  if (prefersReducedMotion || typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { duration: 1.4 });
    });
  });
}

function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

  let raf = null;
  window.addEventListener('pointermove', (e) => {
    glow.classList.add('active');
    if (raf) return;
    raf = requestAnimationFrame(() => {
      gsap.to(glow, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power2.out' });
      raf = null;
    });
  });
  window.addEventListener('pointerleave', () => glow.classList.remove('active'));
}

function initAmbientParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w, h, particles;
  let running = true;

  const DENSITY = prefersReducedMotion ? 0 : 0.00009;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(w * h * DENSITY);
    particles = Array.from({ length: count }, makeParticle);
  }

  function makeParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      speedY: Math.random() * 0.12 + 0.03,
      driftX: Math.random() * 0.06 - 0.03,
      alpha: Math.random() * 0.4 + 0.15,
      hue: Math.random() > 0.5 ? '201,168,108' : '244,237,224',
    };
  }

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue},${p.alpha})`;
      ctx.fill();
      p.y -= p.speedY;
      p.x += p.driftX;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
    }
    requestAnimationFrame(draw);
  }

  document.addEventListener('visibilitychange', () => {
    running = document.visibilityState === 'visible';
    if (running) requestAnimationFrame(draw);
  });

  window.addEventListener('resize', debounce(resize, 200));
  resize();
  if (!prefersReducedMotion) draw();
}

let heroProgress = 0;

function initHeroSequence(images) {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w, h;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render(heroProgress);
  }

  function drawCover(img, alpha, scale) {
    if (!img || !img.naturalWidth) return;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let dw, dh;
    if (imgRatio > canvasRatio) {
      dh = h * scale;
      dw = dh * imgRatio;
    } else {
      dw = w * scale;
      dh = dw / imgRatio;
    }
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.globalAlpha = 1;
  }

  function render(t) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0a0806';
    ctx.fillRect(0, 0, w, h);

    const revealStart = 0.16;
    const local = clamp((t - revealStart) / (1 - revealStart), 0, 1);
    const segments = Math.max(1, images.length - 1);
    const segF = local * segments;
    const segIndex = clamp(Math.floor(segF), 0, segments - 1);
    const segLocal = segF - segIndex;

    const imgA = images[segIndex];
    const imgB = images[segIndex + 1] || images[segIndex];

    const scale = 1.14 - local * 0.14;
    const imageOpacity = clamp((t - revealStart) / 0.26, 0, 1);

    if (imageOpacity > 0) {
      drawCover(imgA, imageOpacity * (1 - segLocal), scale);
      drawCover(imgB, imageOpacity * segLocal, scale);
    }

    ctx.fillStyle = `rgba(20,12,6,${0.32 * (1 - local * 0.4)})`;
    ctx.fillRect(0, 0, w, h);

    const lightStrength = clamp(t / 0.55, 0, 1) * (1 - clamp((t - 0.85) / 0.15, 0, 1));
    if (lightStrength > 0) {
      const grad = ctx.createRadialGradient(w / 2, h * 0.56, 0, w / 2, h * 0.56, Math.max(w, h) * 0.55);
      grad.addColorStop(0, `rgba(240,181,106,${0.32 * lightStrength})`);
      grad.addColorStop(0.5, `rgba(201,168,108,${0.12 * lightStrength})`);
      grad.addColorStop(1, 'rgba(201,168,108,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    if (t < 0.3) {
      const sparkleAlpha = (1 - t / 0.3);
      drawSparkles(t, sparkleAlpha);
    }
  }

  let sparkleField = null;
  function drawSparkles(t, alpha) {
    if (!sparkleField) {
      sparkleField = Array.from({ length: 60 }, () => ({
        x: Math.random(), y: Math.random(), r: Math.random() * 1.3 + 0.3, phase: Math.random() * Math.PI * 2,
      }));
    }
    ctx.save();
    for (const s of sparkleField) {
      const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(t * 40 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,201,143,${alpha * twinkle * 0.7})`;
      ctx.fill();
    }
    ctx.restore();
  }

  window.addEventListener('resize', debounce(resize, 200));
  resize();

  const stages = gsap.utils.toArray('.hero-stage');
  const stageRanges = [
    [0, 0.14],
    [0.12, 0.32],
    [0.34, 0.62],
    [0.66, 1.0],
  ];

  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.4,
    pin: '.hero-pin',
    onUpdate: (self) => {
      heroProgress = self.progress;
      render(heroProgress);
      updateBloom(heroProgress);

      stages.forEach((stage, i) => {
        const [start, end] = stageRanges[i];
        let o;
        if (heroProgress < start) o = 0;
        else if (heroProgress > end) o = i === stages.length - 1 ? 1 : 0;
        else {
          const mid = (start + end) / 2;
          const fadeIn = clamp((heroProgress - start) / ((end - start) * 0.35), 0, 1);
          const fadeOut = i === stages.length - 1 ? 1 : 1 - clamp((heroProgress - mid) / ((end - start) * 0.5), 0, 1);
          o = Math.min(fadeIn, fadeOut);
        }
        gsap.set(stage, { opacity: o, y: (1 - o) * 16 });
      });
    },
  });
}

let bloomPetals = [];

function initBloom() {
  const group = document.getElementById('bloom-group');
  const svg = document.getElementById('bloom-svg');

  function petalPath(radius, size) {
    return `M0,0 C ${-size * 0.4},${-radius * 0.22} ${-size * 0.36},${-radius * 0.82} 0,${-radius} C ${size * 0.36},${-radius * 0.82} ${size * 0.4},${-radius * 0.22} 0,0 Z`;
  }

  const rings = [
    { count: 6, radius: 46, size: 30, offset: 0 },
    { count: 8, radius: 82, size: 42, offset: 22.5 },
    { count: 10, radius: 120, size: 52, offset: 8 },
  ];

  rings.forEach((ring, ringIndex) => {
    for (let i = 0; i < ring.count; i++) {
      const angle = (360 / ring.count) * i + ring.offset;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', petalPath(ring.radius, ring.size));
      path.setAttribute('transform', `rotate(${angle})`);
      path.setAttribute('fill', ringIndex === 0 ? 'rgba(232,201,143,0.9)' : 'rgba(201,168,108,0.55)');
      path.setAttribute('fill-opacity', '0');
      group.appendChild(path);

      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;

      bloomPetals.push({ el: path, length, order: ringIndex * 10 + i });
    }
  });

  bloomPetals.sort((a, b) => a.order - b.order);
  window._bloomSvg = svg;
}

function updateBloom(t) {
  const svg = window._bloomSvg;
  if (!svg || !bloomPetals.length) return;

  const bloomStart = 0.34;
  const bloomEnd = 0.66;
  const fadeOutStart = 0.78;
  const fadeOutEnd = 0.92;

  let svgOpacity;
  if (t < bloomStart) svgOpacity = 0;
  else if (t < fadeOutStart) svgOpacity = 1;
  else svgOpacity = 1 - clamp((t - fadeOutStart) / (fadeOutEnd - fadeOutStart), 0, 1);

  svg.style.opacity = svgOpacity;
  if (svgOpacity === 0) return;

  const local = clamp((t - bloomStart) / (bloomEnd - bloomStart), 0, 1);
  const n = bloomPetals.length;

  bloomPetals.forEach((p, i) => {
    const petalStart = (i / n) * 0.7;
    const petalEnd = petalStart + 0.3;
    const draw = clamp((local - petalStart) / (petalEnd - petalStart), 0, 1);
    p.el.style.strokeDashoffset = p.length * (1 - draw);

    const fillIn = clamp((local - 0.6) / 0.4, 0, 1);
    p.el.setAttribute('fill-opacity', fillIn * 0.8);
  });

  const rotation = local >= 1 ? (t - bloomEnd) * 14 : 0;
  document.getElementById('bloom-group').setAttribute(
    'transform',
    `translate(200,200) rotate(${rotation})`
  );
}

function initTimelineReveal() {
  const items = gsap.utils.toArray('.timeline-item');
  items.forEach((item, i) => {
    gsap.to(item, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 82%' },
      delay: prefersReducedMotion ? 0 : i * 0.04,
    });
  });

  const line = document.querySelector('.timeline');
  const beforeLine = document.createElement('div');
  beforeLine.style.cssText = `position:absolute;left:27px;top:6px;width:1px;background:linear-gradient(to bottom, rgba(201,168,108,.6), rgba(201,168,108,.6));transform-origin:top;`;
  if (line) {
    line.style.position = 'relative';
    line.appendChild(beforeLine);
    gsap.fromTo(
      beforeLine,
      { height: 0 },
      {
        height: () => line.offsetHeight - 12,
        ease: 'none',
        scrollTrigger: { trigger: line, start: 'top 75%', end: 'bottom 85%', scrub: 0.6 },
      }
    );
  }
}

function initGalleryParallax() {
  if (prefersReducedMotion) return;
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax) || 0.1;
    gsap.to(el.querySelector('img'), {
      yPercent: speed * 40,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    });
  });

  gsap.utils.toArray('.gallery-item').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', delay: (i % 4) * 0.06,
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });
}

function initMilestoneCounters() {
  gsap.utils.toArray('.milestone-number[data-count-to]').forEach((el) => {
    const target = parseFloat(el.dataset.countTo);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => (el.textContent = Math.round(obj.val).toLocaleString()),
        });
      },
    });
  });
}

function initLetterReveal() {
  gsap.from('.letter-paper', {
    opacity: 0, y: 50, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.letter-paper', start: 'top 82%' },
  });
  gsap.from('.letter-body p', {
    opacity: 0, y: 14, duration: 0.8, stagger: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '.letter-body', start: 'top 78%' },
  });
}

function initWishesReveal() {
  gsap.from('.wish-card', {
    opacity: 0, y: 40, duration: 0.9, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '.wishes-grid', start: 'top 82%' },
  });
}

function initCountdown() {
  const start = new Date(CONFIG.startDate + 'T00:00:00');
  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    minutes: document.getElementById('cd-minutes'),
    seconds: document.getElementById('cd-seconds'),
  };

  function nextAnniversary(now) {
    const next = new Date(now);
    next.setHours(0, 0, 0, 0);
    next.setMonth(start.getMonth(), start.getDate());
    while (next <= now) next.setFullYear(next.getFullYear() + 1);
    return next;
  }

  function tick() {
    const now = new Date();
    const target = nextAnniversary(now);
    let diff = Math.max(0, target - now);

    const day = 1000 * 60 * 60 * 24;
    const days = Math.floor(diff / day);
    diff -= days * day;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * 1000 * 60;
    const seconds = Math.floor(diff / 1000);

    els.days.textContent = String(days).padStart(2, '0');
    els.hours.textContent = String(hours).padStart(2, '0');
    els.minutes.textContent = String(minutes).padStart(2, '0');
    els.seconds.textContent = String(seconds).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);

  gsap.from('.countdown-unit', {
    opacity: 0, y: 24, duration: 0.8, stagger: 0.08, ease: 'power3.out',
    scrollTrigger: { trigger: '#countdown-grid', start: 'top 85%' },
  });
}

function initShowcaseParallax() {
  if (prefersReducedMotion) return;
  gsap.utils.toArray('.showcase-panel').forEach((panel) => {
    const speed = parseFloat(panel.dataset.speed) || 1;
    gsap.to(panel.querySelector('img'), {
      yPercent: (speed - 1) * 20,
      ease: 'none',
      scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    });
    gsap.from(panel.querySelector('.showcase-overlay'), {
      opacity: 0, y: 30, duration: 1,
      scrollTrigger: { trigger: panel, start: 'top 60%' },
    });
  });
}

function initMagneticButtons() {
  if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.magnetic-btn').forEach((btn) => {
    const strength = 0.35;
    btn.addEventListener('pointermove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('pointerleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });

  const foreverBtn = document.getElementById('forever-btn');
  if (foreverBtn) {
    foreverBtn.addEventListener('click', () => {
      document.querySelector('#hero').scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }
}

function initForeverCanvas() {
  const canvas = document.getElementById('forever-canvas');
  const ctx = canvas.getContext('2d');
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w, h, particles;
  let visible = false;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: prefersReducedMotion ? 0 : 70 }, () => ({
      x: w / 2 + (Math.random() - 0.5) * w * 0.6,
      y: h / 2 + (Math.random() - 0.5) * h * 0.6,
      r: Math.random() * 1.6 + 0.4,
      a: Math.random() * 0.5 + 0.2,
      vy: -(Math.random() * 0.25 + 0.05),
      vx: (Math.random() - 0.5) * 0.1,
    }));
  }

  function draw() {
    if (!visible) { requestAnimationFrame(draw); return; }
    ctx.clearRect(0, 0, w, h);
    const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.5);
    grad.addColorStop(0, 'rgba(240,181,106,0.14)');
    grad.addColorStop(1, 'rgba(240,181,106,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,201,143,${p.a})`;
      ctx.fill();
      p.y += p.vy; p.x += p.vx;
      if (p.y < 0) p.y = h;
    }
    requestAnimationFrame(draw);
  }

  ScrollTrigger.create({
    trigger: '#forever',
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (visible = self.isActive),
  });

  window.addEventListener('resize', debounce(resize, 200));
  resize();
  draw();
}

async function loadForeverGallery() {
  const wrap = document.getElementById('forever-gallery');
  if (!wrap) return;
  const photos = await findNumberedImages('forever/images', 12);
  if (!photos.length) return;

  wrap.removeAttribute('aria-hidden');
  photos.forEach((src) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'A final memory';
    img.loading = 'lazy';
    img.style.setProperty('--tilt', `${(Math.random() * 10 - 5).toFixed(1)}deg`);
    wrap.appendChild(img);
  });

  if (!prefersReducedMotion) {
    gsap.from('.forever-gallery img', {
      opacity: 0, y: 24, duration: 0.9, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: '#forever', start: 'top 70%' },
    });
  }
  ScrollTrigger.refresh();
}

function initPetals() {
  if (prefersReducedMotion) return;

  function spawnPetal() {
    const petal = document.createElement('div');
    const size = Math.random() * 10 + 8;
    const startX = Math.random() * window.innerWidth;
    const hueChoices = ['#d9a7a0', '#e8c98f', '#c9a86c'];
    const color = hueChoices[Math.floor(Math.random() * hueChoices.length)];

    petal.className = 'petal';
    petal.style.left = startX + 'px';
    petal.style.width = size + 'px';
    petal.style.height = size * 1.2 + 'px';
    petal.style.borderRadius = '0% 70% 0% 70%';
    petal.style.background = color;
    document.body.appendChild(petal);

    const duration = Math.random() * 6 + 8;
    const drift = (Math.random() - 0.5) * 220;
    const rotation = Math.random() * 540 - 270;

    gsap.to(petal, {
      y: window.innerHeight + 60,
      x: `+=${drift}`,
      rotation,
      opacity: 0,
      duration,
      ease: 'sine.inOut',
      onComplete: () => petal.remove(),
    });
  }

  setInterval(() => {
    if (document.visibilityState === 'visible') spawnPetal();
  }, 3200);
}

function initNavScrollState() {
  const nav = document.querySelector('.site-nav');
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: '+=200',
    onLeave: () => nav && nav.classList.add('is-scrolled'),
    onEnterBack: () => nav && nav.classList.remove('is-scrolled'),
  });
}

function initGalleryLightbox() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  const overlay = document.createElement('div');
  overlay.id = 'lightbox-overlay';
  overlay.innerHTML = `
    <button type="button" id="lightbox-close" aria-label="Close">&times;</button>
    <div id="lightbox-stage">
      <img id="lightbox-img" alt="" draggable="false" />
    </div>
    <p id="lightbox-hint">pinch, scroll, or double-tap to zoom</p>
  `;
  document.body.appendChild(overlay);

  const stage = overlay.querySelector('#lightbox-stage');
  const img = overlay.querySelector('#lightbox-img');
  const closeBtn = overlay.querySelector('#lightbox-close');

  let scale = 1, originX = 0, originY = 0;
  let dragging = false, startX = 0, startY = 0;
  let lastPinchDist = null;

  function applyTransform() {
    img.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
    img.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
  }

  function resetZoom() {
    scale = 1; originX = 0; originY = 0;
    applyTransform();
  }

  function setZoom(next) {
    scale = clamp(next, 1, 4);
    if (scale === 1) { originX = 0; originY = 0; }
    applyTransform();
  }

  function open(src, alt) {
    img.src = src;
    img.alt = alt || 'A held-onto moment';
    resetZoom();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    resetZoom();
  }

  grid.addEventListener('click', (e) => {
    const target = e.target.closest('.gallery-item img');
    if (target) open(target.currentSrc || target.src, target.alt);
  });

  const memoriesGrid = document.getElementById('memories-grid');
  if (memoriesGrid) {
    memoriesGrid.addEventListener('click', (e) => {
      const target = e.target.closest('.memory-card img');
      if (target) open(target.currentSrc || target.src, target.alt);
    });
    memoriesGrid.style.cursor = 'zoom-in';
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) close();
  });

  // Desktop: scroll wheel to zoom
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    setZoom(scale + (e.deltaY > 0 ? -0.25 : 0.25));
  }, { passive: false });

  // Double-click / double-tap to toggle zoom
  img.addEventListener('dblclick', () => setZoom(scale > 1 ? 1 : 2.2));

  // Desktop: drag to pan when zoomed
  img.addEventListener('mousedown', (e) => {
    if (scale === 1) return;
    dragging = true;
    startX = e.clientX - originX;
    startY = e.clientY - originY;
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    originX = e.clientX - startX;
    originY = e.clientY - startY;
    applyTransform();
  });
  window.addEventListener('mouseup', () => { dragging = false; });

  // Mobile: pinch to zoom, one-finger drag to pan when zoomed
  function pinchDist(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  }

  let lastTapTime = 0;
  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      lastPinchDist = pinchDist(e.touches);
    } else if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapTime < 300) setZoom(scale > 1 ? 1 : 2.2);
      lastTapTime = now;
      if (scale > 1) {
        dragging = true;
        startX = e.touches[0].clientX - originX;
        startY = e.touches[0].clientY - originY;
      }
    }
  }, { passive: true });

  stage.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = pinchDist(e.touches);
      if (lastPinchDist) setZoom(scale + (dist - lastPinchDist) * 0.012);
      lastPinchDist = dist;
    } else if (e.touches.length === 1 && dragging) {
      e.preventDefault();
      originX = e.touches[0].clientX - startX;
      originY = e.touches[0].clientY - startY;
      applyTransform();
    }
  }, { passive: false });

  stage.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) lastPinchDist = null;
    if (e.touches.length === 0) dragging = false;
  });
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
