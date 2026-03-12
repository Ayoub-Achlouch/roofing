/* ============================================================
   PROROOFLELITE — PREMIUM ROOFING WEBSITE JAVASCRIPT
   ============================================================ */

'use strict';

// ============================================================
// PRELOADER
// ============================================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hidden');
    // Start hero animations after load
    animateHeroEntrance();
  }, 1400);
});

// ============================================================
// NAVBAR — scroll behavior + mobile toggle
// ============================================================
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Scroll: add 'scrolled' class after 60px
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    toggleFloatingCTA();
    toggleBackToTop();
  }, { passive: true });

  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('mobile-open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('mobile-open');
    });
  });

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const link = navLinks.querySelector(`a[href="#${section.id}"]`);
      if (!link) return;
      if (section.offsetTop <= scrollY && section.offsetTop + section.offsetHeight > scrollY) {
        navLinks.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { passive: true });
})();

// ============================================================
// FLOATING CTA + BACK TO TOP
// ============================================================
function toggleFloatingCTA() {
  const el = document.getElementById('floatingCta');
  el.classList.toggle('visible', window.scrollY > 400);
}

function toggleBackToTop() {
  const el = document.getElementById('backToTop');
  el.classList.toggle('visible', window.scrollY > 700);
}

document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// SCROLL REVEAL — IntersectionObserver
// ============================================================
(function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.reveal-up, .service-card, .portfolio-card, .review-card, .benefit-item, .contact-card, .city-item, .big-stat-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Number(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Helper: add visible state
  document.addEventListener('visibleAdded', (e) => {
    e.target.style.opacity = '1';
    e.target.style.transform = 'translateY(0)';
  });
})();

// Override to actually apply visible styles
const styleObserver = new MutationObserver(mutations => {
  mutations.forEach(m => {
    if (m.type === 'attributes' && m.attributeName === 'class') {
      const el = m.target;
      if (el.classList.contains('visible')) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    }
  });
});
document.querySelectorAll('.reveal-up, .service-card, .portfolio-card, .benefit-item, .contact-card, .big-stat-card').forEach(el => {
  styleObserver.observe(el, { attributes: true });
});


// ============================================================
// HERO ENTRANCE ANIMATION
// ============================================================
function animateHeroEntrance() {
  const items = document.querySelectorAll('.hero-content .reveal-up');
  items.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 100 + i * 150);
  });
}

// ============================================================
// ANIMATED COUNTERS
// ============================================================
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(update);
}

// Observe stat elements
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('[data-target], .counter[data-target]');
      counters.forEach(c => animateCounter(c));
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

// Hero stats
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);

// Why-us stats
const whyStats = document.querySelector('.why-us-stats');
if (whyStats) {
  // Add data-target to counters
  whyStats.querySelectorAll('.counter').forEach(el => {
    // Already have data-target in HTML
  });
  statObserver.observe(whyStats);
}

// ============================================================
// THREE.JS — 3D HERO BACKGROUND
// ============================================================
(function initThreeJS() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 2, 6);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x223344, 0.8);
  scene.add(ambientLight);

  const goldLight = new THREE.PointLight(0xc8902a, 2.5, 20);
  goldLight.position.set(3, 4, 3);
  scene.add(goldLight);

  const blueLight = new THREE.PointLight(0x1a4060, 1.5, 15);
  blueLight.position.set(-4, 2, -2);
  scene.add(blueLight);

  // ── Build a stylized house ──
  const houseGroup = new THREE.Group();

  // House body
  const bodyGeo = new THREE.BoxGeometry(2.4, 1.8, 2);
  const bodyMat = new THREE.MeshPhongMaterial({
    color: 0x1a2a3a,
    shininess: 20,
    transparent: true,
    opacity: 0.85,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0;
  houseGroup.add(body);

  // Roof (left slope)
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-1.5, 0);
  roofShape.lineTo(0, 1.1);
  roofShape.lineTo(1.5, 0);
  roofShape.closePath();

  const roofExtrudeSettings = { depth: 2.2, bevelEnabled: false };
  const roofGeo = new THREE.ExtrudeGeometry(roofShape, roofExtrudeSettings);
  const roofMat = new THREE.MeshPhongMaterial({
    color: 0xc8902a,
    shininess: 60,
    transparent: true,
    opacity: 0.9,
  });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(-1.5, 0.9, -1.1);
  roof.rotation.x = 0;
  houseGroup.add(roof);

  // Chimney
  const chimGeo = new THREE.BoxGeometry(0.3, 0.9, 0.3);
  const chimMat = new THREE.MeshPhongMaterial({ color: 0x8b6040, shininess: 10 });
  const chimney = new THREE.Mesh(chimGeo, chimMat);
  chimney.position.set(0.6, 1.7, 0.3);
  houseGroup.add(chimney);

  // Windows (emissive glow)
  const winGeo = new THREE.BoxGeometry(0.4, 0.45, 0.05);
  const winMat = new THREE.MeshPhongMaterial({ color: 0xd4a058, emissive: 0xc8902a, emissiveIntensity: 0.4, shininess: 100 });
  [-0.65, 0.65].forEach(x => {
    const win = new THREE.Mesh(winGeo, winMat);
    win.position.set(x, 0.1, 1.02);
    houseGroup.add(win);
  });

  // Door
  const doorGeo = new THREE.BoxGeometry(0.35, 0.65, 0.05);
  const doorMat = new THREE.MeshPhongMaterial({ color: 0xc8902a, shininess: 40 });
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(0, -0.47, 1.02);
  houseGroup.add(door);

  // Ground plane (subtle)
  const groundGeo = new THREE.CircleGeometry(4, 64);
  const groundMat = new THREE.MeshPhongMaterial({
    color: 0x0f1e2d,
    transparent: true,
    opacity: 0.4,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.9;
  scene.add(ground);

  houseGroup.position.set(2, -0.3, 0);
  houseGroup.rotation.y = -0.4;
  scene.add(houseGroup);

  // ── Floating particles ──
  const particleCount = 120;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3]     = (Math.random() - 0.5) * 20;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    particleSizes[i] = Math.random() * 3 + 1;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0xc8902a,
    size: 0.04,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation loop
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.012;

    // Gentle house float + rotation
    houseGroup.position.y = -0.3 + Math.sin(t * 0.7) * 0.08;
    houseGroup.rotation.y = -0.4 + Math.sin(t * 0.4) * 0.06 + mouseX * 0.08;

    // Camera parallax
    camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 0.2 + 2 - camera.position.y) * 0.04;
    camera.lookAt(0, 0.5, 0);

    // Particles drift
    particles.rotation.y = t * 0.015;
    particles.rotation.x = t * 0.008;

    // Gold light pulse
    goldLight.intensity = 2 + Math.sin(t * 1.5) * 0.5;

    renderer.render(scene, camera);
  }
  animate();
})();

// ============================================================
// BEFORE / AFTER SLIDER
// ============================================================
(function initBeforeAfter() {
  const container = document.getElementById('baSlider1');
  const handle    = document.getElementById('baHandle1');
  if (!container || !handle) return;

  let isDragging = false;

  function setPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let pct = (clientX - rect.left) / rect.width;
    pct = Math.max(0.05, Math.min(0.95, pct));

    const after = container.querySelector('.ba-after');
    const handleEl = container.querySelector('.ba-handle');

    after.style.clipPath = `inset(0 ${(1 - pct) * 100}% 0 0)`;
    handleEl.style.left = `${pct * 100}%`;
  }

  // Mouse events
  handle.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mouseup',   () => isDragging = false);
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setPosition(e.clientX);
  });

  // Touch events
  handle.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); }, { passive: false });
  window.addEventListener('touchend',   () => isDragging = false);
  window.addEventListener('touchmove',  (e) => {
    if (!isDragging) return;
    setPosition(e.touches[0].clientX);
  }, { passive: true });

  // Click on container
  container.addEventListener('click', (e) => setPosition(e.clientX));
})();

// ============================================================
// PORTFOLIO FILTER
// ============================================================
(function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const categories = card.dataset.category || '';
        const show = filter === 'all' || categories.includes(filter);

        if (show) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

// ============================================================
// COST ESTIMATOR
// ============================================================
(function initEstimator() {
  // Cost matrix: [min, max] in dollars
  // Format: costs[size][material][service]
  const costs = {
    small: {
      asphalt: { repair: [500,   1500],  replacement: [4000,  8000],  installation: [5000,  9000]  },
      metal:   { repair: [600,   2000],  replacement: [8000,  14000], installation: [9000,  15000] },
      tile:    { repair: [700,   2200],  replacement: [9000,  16000], installation: [10000, 18000] },
      flat:    { repair: [400,   1200],  replacement: [3500,  7000],  installation: [4000,  8000]  },
    },
    medium: {
      asphalt: { repair: [1000,  2500],  replacement: [7000,  13000], installation: [8000,  14000] },
      metal:   { repair: [1200,  3000],  replacement: [14000, 22000], installation: [15000, 24000] },
      tile:    { repair: [1400,  3500],  replacement: [16000, 26000], installation: [18000, 28000] },
      flat:    { repair: [800,   2000],  replacement: [6000,  10000], installation: [7000,  11000] },
    },
    large: {
      asphalt: { repair: [1500,  3500],  replacement: [11000, 18000], installation: [12000, 20000] },
      metal:   { repair: [2000,  4500],  replacement: [20000, 32000], installation: [22000, 35000] },
      tile:    { repair: [2200,  5000],  replacement: [24000, 38000], installation: [26000, 42000] },
      flat:    { repair: [1200,  3000],  replacement: [9000,  15000], installation: [10000, 17000] },
    },
    xlarge: {
      asphalt: { repair: [2000,  5000],  replacement: [16000, 26000], installation: [18000, 28000] },
      metal:   { repair: [3000,  6500],  replacement: [30000, 48000], installation: [32000, 52000] },
      tile:    { repair: [3500,  7500],  replacement: [36000, 56000], installation: [40000, 62000] },
      flat:    { repair: [1800,  4000],  replacement: [13000, 20000], installation: [14000, 22000] },
    },
  };

  let selections = { size: 'small', material: 'asphalt', service: 'repair' };

  // Option group click handlers
  ['sizeOptions', 'materialOptions', 'serviceOptions'].forEach(groupId => {
    const group = document.getElementById(groupId);
    if (!group) return;

    group.querySelectorAll('.est-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.est-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Map group id to selection key
        const key = groupId === 'sizeOptions' ? 'size' : groupId === 'materialOptions' ? 'material' : 'service';
        selections[key] = btn.dataset.value;
      });
    });
  });

  // Calculate button
  document.getElementById('calcBtn').addEventListener('click', () => {
    const range = costs[selections.size]?.[selections.material]?.[selections.service];
    if (!range) return;

    const [min, max] = range;
    document.getElementById('priceMin').textContent = '$' + min.toLocaleString();
    document.getElementById('priceMax').textContent = '$' + max.toLocaleString();

    document.querySelector('.result-placeholder').style.display = 'none';
    document.getElementById('resultOutput').style.display = 'block';

    // Animate result
    const output = document.getElementById('resultOutput');
    output.style.opacity = '0';
    output.style.transform = 'translateY(15px)';
    output.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    requestAnimationFrame(() => {
      output.style.opacity = '1';
      output.style.transform = 'translateY(0)';
    });
  });
})();

// ============================================================
// SWIPER — TESTIMONIALS
// ============================================================
(function initSwiper() {
  if (typeof Swiper === 'undefined') return;

  new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      640:  { slidesPerView: 1 },
      768:  { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
})();

// ============================================================
// QUOTE FORM VALIDATION
// ============================================================
(function initQuoteForm() {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  const validators = {
    fname:    v => v.trim().length >= 2 ? '' : 'Please enter your full name.',
    fphone:   v => /[\d\s\-\(\)]{7,}/.test(v) ? '' : 'Please enter a valid phone number.',
    femail:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.',
    faddress: v => v.trim().length >= 5 ? '' : 'Please enter your property address.',
    fservice: v => v !== '' ? '' : 'Please select a service.',
  };

  function validate(field) {
    const validator = validators[field.name];
    if (!validator) return true;
    const error = validator(field.value);
    const errorEl = field.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.textContent = error;
    field.classList.toggle('invalid', !!error);
    return !error;
  }

  // Live validation on blur
  Object.keys(validators).forEach(name => {
    const field = form.elements[name];
    if (field) {
      field.addEventListener('blur', () => validate(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('invalid')) validate(field);
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    Object.keys(validators).forEach(name => {
      const field = form.elements[name];
      if (field && !validate(field)) isValid = false;
    });

    if (!isValid) return;

    // Simulate form submission (replace with real endpoint)
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
    }, 1200);
  });
})();

// ============================================================
// SMOOTH SCROLL FOR ALL ANCHOR LINKS
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ============================================================
// CSS KEYFRAME INJECTION (fadeInUp for portfolio)
// ============================================================
(function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

// ============================================================
// SCROLL PROGRESS INDICATOR (optional thin bar)
// ============================================================
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #c8902a, #e8b050);
    z-index: 9999;
    width: 0%;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (window.scrollY / scrollable) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

// ============================================================
// PHONE NUMBER FORMATTING (optional UX helper)
// ============================================================
(function initPhoneFormat() {
  const phoneInput = document.getElementById('fphone');
  if (!phoneInput) return;

  phoneInput.addEventListener('input', () => {
    let v = phoneInput.value.replace(/\D/g, '').slice(0, 10);
    if (v.length >= 7) {
      v = `(${v.slice(0,3)}) ${v.slice(3,6)}-${v.slice(6)}`;
    } else if (v.length >= 4) {
      v = `(${v.slice(0,3)}) ${v.slice(3)}`;
    } else if (v.length > 0) {
      v = `(${v}`;
    }
    phoneInput.value = v;
  });
})();
