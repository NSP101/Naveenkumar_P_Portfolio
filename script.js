'use strict';

/* ============================================================
   PARTICLE CANVAS
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -999, y: -999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function rand(min, max) { return Math.random() * (max - min) + min; }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = rand(0, W);
      this.y    = rand(0, H);
      this.r    = rand(0.6, 2);
      this.vx   = rand(-0.3, 0.3);
      this.vy   = rand(-0.3, 0.3);
      this.alpha= rand(0.15, 0.55);
      this.color= Math.random() > 0.6 ? '177,151,252' : Math.random() > 0.5 ? '124,109,250' : '34,211,238';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Mouse repel
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.x += (dx / dist) * force * 2;
        this.y += (dy / dist) * force * 2;
      }
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  // Create particles
  const COUNT = Math.min(120, Math.floor(W * H / 14000));
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  // Draw connections
  function drawConnections() {
    const MAX_DIST = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,109,250,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });
})();

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animateFollower() {
    fx += (mx - fx) * 0.1;
    fy += (my - fy) * 0.1;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  })();
})();

/* ============================================================
   NAVBAR
   ============================================================ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActive();
  };

  function updateActive() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.dataset.section === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ============================================================
   HAMBURGER
   ============================================================ */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const navbar    = document.getElementById('navbar');
  if (!hamburger || !navLinks || !navbar) return;

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  navLinks.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
})();

/* ============================================================
   TYPED ROLE ANIMATION
   ============================================================ */
(function initTyped() {
  const el = document.getElementById('typedRole');
  if (!el) return;

  const roles = [
    'Software Engineer',
    'Backend Developer',
    'LLM Agent Builder',
    'API Architect',
    'Full Stack Dev',
  ];

  let ri = 0, ci = 0, deleting = false, paused = false;

  function tick() {
    if (paused) return;
    const word = roles[ri];
    if (!deleting) {
      el.textContent = word.slice(0, ci + 1);
      ci++;
      if (ci === word.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; tick(); }, 1900);
        return;
      }
      setTimeout(tick, 75);
    } else {
      el.textContent = word.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
        paused = true;
        setTimeout(() => { paused = false; tick(); }, 350);
        return;
      }
      setTimeout(tick, 40);
    }
  }
  setTimeout(tick, 900);
})();

/* ============================================================
   LIVE CODE CARD TYPING
   ============================================================ */
(function initCodeCard() {
  const output = document.getElementById('codeOutput');
  if (!output) return;

  const lines = [
    { text: 'const ',     cls: 'ck' },
    { text: 'engineer',   cls: 'cv' },
    { text: ' = {',       cls: '' },
    { text: '\n  name',   cls: 'cp' },
    { text: ': ',         cls: '' },
    { text: '"Naveenkumar P"', cls: 'cs' },
    { text: ',',          cls: '' },
    { text: '\n  role',   cls: 'cp' },
    { text: ': ',         cls: '' },
    { text: '"Software Engineer"', cls: 'cs' },
    { text: ',',          cls: '' },
    { text: '\n  experience', cls: 'cp' },
    { text: ': ',         cls: '' },
    { text: '"1+ years"', cls: 'cs' },
    { text: ',',          cls: '' },
    { text: '\n  focus',  cls: 'cp' },
    { text: ': [',        cls: '' },
    { text: '\n    ',     cls: '' },
    { text: '"Backend Dev"',     cls: 'cs' },
    { text: ',',          cls: '' },
    { text: '\n    ',     cls: '' },
    { text: '"LLM / AI Agents"', cls: 'cs' },
    { text: ',',          cls: '' },
    { text: '\n    ',     cls: '' },
    { text: '"REST APIs"',       cls: 'cs' },
    { text: ',',          cls: '' },
    { text: '\n  ],',     cls: '' },
    { text: '\n  status', cls: 'cp' },
    { text: ': ',         cls: '' },
    { text: '"building cool stuff"', cls: 'cs' },
    { text: ',',          cls: '' },
    { text: '\n};',       cls: '' },
  ];

  let html = '';
  let tokenIdx = 0;
  let charIdx  = 0;
  let started  = false;

  function typeNext() {
    if (tokenIdx >= lines.length) return;

    const token = lines[tokenIdx];
    const char  = token.text[charIdx];

    if (char === '\n') {
      html += '\n';
    } else {
      const open  = token.cls ? `<span class="${token.cls}">` : '';
      const close = token.cls ? '</span>' : '';
      html += open + escapeHtml(char) + close;
    }

    output.innerHTML = html + '<span class="cc">▌</span>';

    charIdx++;
    if (charIdx >= token.text.length) {
      tokenIdx++;
      charIdx = 0;
    }

    if (tokenIdx < lines.length) {
      setTimeout(typeNext, char === '\n' ? 60 : 35);
    } else {
      output.innerHTML = html;
    }
  }

  function escapeHtml(c) {
    return c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : c;
  }

  // Start when card enters view
  const card = document.getElementById('codeCard');
  if (!card) return;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      setTimeout(typeNext, 500);
      obs.disconnect();
    }
  }, { threshold: 0.4 });
  obs.observe(card);
})();

/* ============================================================
   STAT COUNTERS
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  let done = false;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !done) {
      done = true;
      counters.forEach(el => {
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const dur    = 1400;
        const start  = performance.now();

        function update(now) {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (t < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      });
      obs.disconnect();
    }
  }, { threshold: 0.6 });

  const hero = document.getElementById('hero');
  if (hero) obs.observe(hero);
})();

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
(function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  // Stagger siblings
  const parents = new Set(Array.from(els).map(e => e.parentElement));
  parents.forEach(p => {
    p.querySelectorAll('[data-reveal]').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  // Reveal items already in viewport immediately
  els.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) el.classList.add('revealed');
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => { if (!el.classList.contains('revealed')) obs.observe(el); });
})();

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ============================================================
   READING PROGRESS BAR
   ============================================================ */
(function initProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position:fixed; top:0; left:0; height:3px; width:0%;
    background:linear-gradient(90deg,#7c6dfa,#b197fc,#e879f9);
    z-index:9999; transition:width 0.08s linear;
    box-shadow:0 0 12px rgba(124,109,250,0.8);
    pointer-events:none;
  `;
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ============================================================
   CARD 3D TILT
   ============================================================ */
(function initTilt() {
  const cards = document.querySelectorAll(
    '.project-card-inner, .timeline-card, .skill-category, .trophy-card, .stat-card'
  );
  const MAX = 5;

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.05s ease, border-color 0.3s, box-shadow 0.3s';
    });
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      card.style.transform = `perspective(900px) rotateX(${-dy * MAX}deg) rotateY(${dx * MAX}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s ease, border-color 0.3s, box-shadow 0.3s';
      card.style.transform  = '';
    });
  });
})();

/* ============================================================
   COPY EMAIL TOAST
   ============================================================ */
(function initCopyEmail() {
  document.querySelectorAll('a[href="mailto:nk4496330@gmail.com"]').forEach(link => {
    link.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText('nk4496330@gmail.com').then(() => toast('📋 Email copied!')).catch(()=>{});
      }
    });
  });
})();

function toast(msg) {
  document.querySelector('.nk-toast')?.remove();
  const t = document.createElement('div');
  t.className = 'nk-toast';
  t.textContent = msg;
  t.style.cssText = `
    position:fixed; bottom:2rem; left:50%;
    transform:translateX(-50%) translateY(16px);
    background:#12121e;
    border:1px solid rgba(124,109,250,0.4);
    color:#f1f0ff; padding:12px 26px;
    border-radius:100px; font-size:0.875rem; font-weight:500;
    font-family:'Inter',sans-serif;
    z-index:99999;
    box-shadow:0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(124,109,250,0.2);
    opacity:0; transition:opacity 0.3s ease, transform 0.3s ease;
    pointer-events:none;
  `;
  document.body.appendChild(t);
  requestAnimationFrame(() => {
    t.style.opacity   = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    t.style.opacity   = '0';
    t.style.transform = 'translateX(-50%) translateY(16px)';
    setTimeout(() => t.remove(), 300);
  }, 2500);
}

/* ============================================================
   SKILL TAG RIPPLE
   ============================================================ */
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('click', function(e) {
    const r = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute; width:80px; height:80px; border-radius:50%;
      background:rgba(124,109,250,0.35);
      transform:translate(-50%,-50%) scale(0);
      left:${e.clientX - r.left}px; top:${e.clientY - r.top}px;
      pointer-events:none;
      transition:transform 0.5s ease,opacity 0.5s ease;
      opacity:1;
    `;
    this.style.position = 'relative';
    this.style.overflow  = 'hidden';
    this.appendChild(ripple);
    requestAnimationFrame(() => {
      ripple.style.transform = 'translate(-50%,-50%) scale(4)';
      ripple.style.opacity   = '0';
    });
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ============================================================
   HERO NAME GLITCH on hover
   ============================================================ */
(function initGlitch() {
  const name = document.getElementById('heroName');
  if (!name) return;
  const original = name.textContent;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let interval;

  name.addEventListener('mouseenter', () => {
    let iteration = 0;
    clearInterval(interval);
    interval = setInterval(() => {
      name.textContent = original.split('').map((c, i) => {
        if (i < iteration) return original[i];
        if (c === ' ') return ' ';
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      if (iteration >= original.length) clearInterval(interval);
      iteration += 0.5;
    }, 35);
  });

  name.addEventListener('mouseleave', () => {
    clearInterval(interval);
    name.textContent = original;
  });
})();

/* ============================================================
   SECTION URL TRACKING
   ============================================================ */
(function initSectionTrack() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) history.replaceState(null, '', `#${e.target.id}`);
    });
  }, { threshold: 0.45 });
  document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
})();

/* ============================================================
   CERTIFICATE LIGHTBOX
   ============================================================ */
function openCertModal(imgSrc, title, issuer) {
  const modal   = document.getElementById('certModal');
  const img     = document.getElementById('certModalImg');
  const titleEl = document.getElementById('certModalTitle');
  const issuerEl= document.getElementById('certModalIssuer');
  if (!modal) return;

  img.src        = imgSrc;
  img.alt        = title;
  titleEl.textContent  = title;
  issuerEl.textContent = 'Issued by: ' + issuer;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  const modal = document.getElementById('certModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCertModal();
});

/* ============================================================
   AI ASSISTANT WIDGET
   ============================================================ */
(function initAIWidget() {
  const btn       = document.getElementById('aiWidgetBtn');
  const panel     = document.getElementById('aiChatPanel');
  const closeBtn  = document.getElementById('aiChatClose');
  const input     = document.getElementById('aiInput');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) input?.focus();
  });

  closeBtn?.addEventListener('click', () => panel.classList.remove('open'));

  // Send on Enter
  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendAIMessage();
  });
})();

// ---- HUMAN-STYLE RESPONSE ENGINE ----
// Multiple reply variants per topic so it never sounds like a bot reading a list.
// pick() randomly selects one variant each time.

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const NK_RESPONSES = {

  greet: [
    `hey! what's up 👋 I'm Naveen. ask me anything — skills, projects, how to reach me, whatever you want to know.`,
    `hey there! good to see you here 😄 I'm Naveen. feel free to ask me anything about my work or background.`,
    `yo! 👋 Naveen here. what do you want to know about me?`,
    `hi! thanks for stopping by. I'm Naveen — software engineer, AI builder, backend nerd. what can I tell you?`,
  ],

  who: [
    `so I'm Naveen — software engineer based out of Tamil Nadu. been doing backend dev and AI stuff for about a year now at Avasoft.\n\nthe thing I'm most proud of? I built an autonomous LLM agent that literally writes code, validates it, and pushes Git commits on its own. that project pretty much defines what I love doing.\n\nif you want specifics just ask — projects, skills, experience, whatever 🙂`,
    `I'm a software engineer who's really into the intersection of AI and backend systems. currently at Avasoft building LLM workflows and REST APIs.\n\ndone my B.Tech from VIT in CS (IoT specialization) and spent the last year shipping real production features.\n\nwhat do you want to dig into?`,
    `Naveen here 👋 I build backend systems and AI-powered applications. my biggest thing right now is LLM engineering — building agents that can think, generate code, and automate dev workflows.\n\nI'm from Dharmapuri, Tamil Nadu, studied at VIT, and currently work at Avasoft. anything specific you'd like to know?`,
  ],

  skills: [
    `okay so my main stack is Node.js, Java, Python on the backend — that's where I spend most of my time. REST API design is something I genuinely enjoy.\n\nthe AI side is where it gets interesting for me though — LLM API integration, prompt engineering, building agents that actually do useful things autonomously.\n\nfor cloud I work with GCP, Docker, Kubernetes, Jenkins in production. MySQL and SQLite for databases, React on the frontend when needed.\n\nwhat area are you curious about specifically?`,
    `honestly the skill I'm most excited about right now is LLM engineering — integrating language model APIs, engineering prompts, and building autonomous workflows. that's where I've been putting a lot of my energy.\n\nbut the foundation is solid backend — Java, JavaScript, Node.js, SQL, REST APIs. I've shipped production code with all of these at Avasoft.\n\ncloud-wise: GCP, Docker, Kubernetes, CI/CD with Jenkins and GitHub Actions. testing with Postman, JUnit, Playwright.\n\nanything you want to go deeper on?`,
    `my stack:\n\n**Backend** — Node.js, Express.js, Java, Spring Boot, REST APIs. this is my comfort zone.\n**AI/LLM** — prompt engineering, LLM API integration, building agents and automation workflows. my favourite stuff.\n**Cloud** — GCP, Docker, Kubernetes, Jenkins, CI/CD.\n**Databases** — MySQL, SQLite, BigQuery, Snowflake.\n**Frontend** — React, HTML, CSS when needed.\n\nI've used all of these in real projects, not just tutorials 😄`,
  ],

  projects: [
    `my favourite one — and honestly the most fun I've had coding — is the **autonomous LLM software engineering agent**. you give it a dev task, it generates code, validates it, corrects errors, then commits and opens a pull request on its own. basically a junior dev that never sleeps 😄 built it with Node.js and LLM APIs.\n\nthen there's the **Finance Dashboard** — a complete full-stack system with JWT auth, three user roles (Admin/Analyst/Viewer), financial records CRUD, analytics APIs, React frontend with charts. it's live — check it at **finance-dashboard-api-3zya.vercel.app** 🚀\n\nand a **data analytics pipeline** for COVID-19 and layoffs data — Python, Pandas, MySQL, Snowflake, Power BI.\n\nwant details on any of these?`,
    `three projects worth mentioning:\n\n🤖 **LLM Agent** — autonomously takes dev tasks, writes and validates code, automates Git commits and PRs.\n\n📊 **Finance Dashboard** — full-stack app with JWT auth, role-based access control (3 roles), REST APIs, Swagger docs, React + Recharts frontend. **live demo:** finance-dashboard-api-3zya.vercel.app\n\n📈 **Analytics Pipeline** — COVID + layoffs datasets, Python/Pandas, Snowflake via Snowpipe, Power BI dashboards.\n\nwhich one interests you most?`,
    `the one I always talk about first is the **LLM agent** — processes dev tasks, generates code via LLM APIs, validates, and automates the whole Git workflow.\n\nthe **Finance Dashboard** is also pretty solid — it's a production-grade system with JWT authentication, three role levels (Admin, Analyst, Viewer), financial records with filtering/sorting/pagination, dashboard analytics APIs, and a React frontend with charts and CSV export. you can try it live at **finance-dashboard-api-3zya.vercel.app** or check the Swagger docs at **finance-dashboard-api-g0ja.onrender.com/api-docs**`,
  ],

  finance: [
    `the Finance Dashboard is one of my more complete projects 💪\n\n**what it does:**\n- JWT authentication with 3 role levels: Admin, Analyst, Viewer\n- each role has different access to financial data and analytics\n- financial records CRUD with filtering, sorting, pagination\n- dashboard analytics: summaries, category totals, monthly/weekly trends\n- soft delete for users and transactions\n- React frontend with Recharts, toast notifications, CSV export\n- Swagger API documentation\n\n**stack:** Node.js + Express + SQLite + JWT + React (Vite) + Recharts\n\n🌐 **Live Demo:** finance-dashboard-api-3zya.vercel.app\n📚 **API Docs:** finance-dashboard-api-g0ja.onrender.com/api-docs`,
    `the finance dashboard is a full production-style system — not just a demo project.\n\nit has **role-based access control** with three user types:\n- **Admin** — full access, user management, all data\n- **Analyst** — analytics and reporting access\n- **Viewer** — read-only financial records\n\nbuilt with Node.js/Express backend, SQLite database, JWT auth, and a React frontend using Vite and Recharts for charts.\n\nyou can try it live right now → **finance-dashboard-api-3zya.vercel.app**\n\ntest credentials: admin@test.com / Admin@123`,
  ],

  experience: [
    `currently at **Avasoft** as a software engineer — been there since Dec 2025. working on backend features using Java, Node.js, SQL, REST APIs. also building LLM-assisted tooling which is the part I enjoy most. day to day involves API design, Postman testing, and deployment workflows with Docker, Kubernetes, GCP.\n\nbefore that I did two internships — frontend dev at OROM (Oct 2022 to Jan 2023) building dashboards with HTML/CSS/JS, and a Google Cloud virtual internship (Oct–Dec 2023) where I worked hands-on with GCP, BigQuery, and Python.\n\nanything specific about any of these?`,
    `I've been working at Avasoft since December 2025 as a software engineer. real production work — backend APIs, LLM workflows, testing, deployments. it's an Agile team and I work across the full SDLC from design to deployment support.\n\nI also did internships at OROM (frontend) and Google Cloud (cloud computing) before joining full-time. the Google Cloud one was really useful for understanding BigQuery and cloud data workflows.\n\nwant to know more about any of the roles?`,
  ],

  contact: [
    `best way to reach me is email — **nk4496330@gmail.com**. I check it regularly.\n\nalso on:\n📱 **WhatsApp:** +91 93428 11231 → wa.me/919342811231\n🔗 **LinkedIn:** linkedin.com/in/naveenkumar-palaniyappan-99a16b250\n🐙 **GitHub:** github.com/NSP101\n\ndon't be a stranger 😄`,
    `you can hit me up at **nk4496330@gmail.com** — that's the fastest.\n\nor **WhatsApp** me directly: **+91 93428 11231** (wa.me/919342811231)\n\nLinkedIn: **linkedin.com/in/naveenkumar-palaniyappan-99a16b250**\nGitHub: **github.com/NSP101**\n\nbased in Dharmapuri, Tamil Nadu — open to remote and relocation 🙂`,
    `📧 **Email:** nk4496330@gmail.com\n📱 **WhatsApp:** +91 93428 11231\n🔗 **LinkedIn:** naveenkumar-palaniyappan-99a16b250\n🐙 **GitHub:** NSP101\n📞 **Phone:** +91 93428 11231\n\nI'm actively looking for opportunities — genuinely happy to hear from anyone 👋`,
  ],

  education: [
    `did my B.Tech in Computer Science from **VIT** (Vellore Institute of Technology) — IoT specialization, graduated 2025.\n\nVIT's a solid school and the CS program gave me a strong foundation. got the STARS Merit Scholarship there which I'm pretty proud of.\n\nalso was District Topper in secondary education and an NMMS Scholar — so academics have always been something I take seriously alongside the practical stuff.`,
    `B.Tech CS from **VIT** (2021–2025), IoT specialization. honestly the IoT track pushed me toward embedded systems thinking which later connected naturally to AI and automation work.\n\nawards-wise: STARS Merit Scholarship at VIT, District Topper in secondary school, NMMS Scholar. not bad 😄\n\nwant to know about certifications too?`,
  ],

  certs: [
    `got a few certs I'm proud of:\n\n🛡️ **Certified Ethical Hacker** — European Academy. cybersecurity fundamentals, really enjoyed this one.\n🔐 **Ethical Hacking Essentials** — EC-Council\n🐛 **Android Bug Bounty** — EC-Council. hands-on vulnerability hunting.\n☁️ **Google Cloud Computing** — the Google Cloud virtual internship cert.\n\nyou can actually see the certificate images on this page if you scroll to the Achievements section!`,
    `the ones I have: Certified Ethical Hacker (European Academy), Ethical Hacking Essentials and Android Bug Bounty (both EC-Council), and Google Cloud Computing.\n\nthe ethical hacking certs came from genuine interest in security — I think understanding how systems can be attacked makes you a better builder.\n\nscroll to the Achievements section to see the actual certificates 📜`,
  ],

  hire: [
    `yes! actively looking 😄 open to backend engineering, AI/LLM development, or full-stack roles. remote or on-site, I'm flexible.\n\nbest way to reach me: **nk4496330@gmail.com** or LinkedIn. would love to have a conversation.`,
    `I'm open to work right now! if you're hiring for backend, AI/LLM, or full-stack — I'd love to chat.\n\ndrop me an email at **nk4496330@gmail.com** or connect on LinkedIn. always up for a good opportunity 🚀`,
    `actively looking for new roles — backend engineering and AI/LLM development are my sweet spots but I'm open to full-stack too.\n\nhit me up: **nk4496330@gmail.com** 👋`,
  ],

  llm: [
    `LLM work is honestly what I'm most excited about right now. I've integrated LLM APIs into real workflows — not just chatbots, but systems that generate code, validate it, and take actions autonomously.\n\nthe autonomous agent project is the best example: it takes a dev task, figures out what code to write, runs it through a validation loop, corrects errors, and commits to Git. all on its own.\n\nprompt engineering is a big part of making that work reliably — getting the model to output structured, usable code consistently is genuinely tricky.`,
    `the LLM engineering side of my work is what I'm most passionate about. built an autonomous agent that handles the full dev loop — task understanding, code generation, validation, Git automation.\n\nI work with LLM APIs directly, engineer prompts for specific tasks, and build the surrounding validation/retry logic that makes agents actually reliable rather than just impressive demos.\n\nit's the kind of work where software engineering and AI really come together 🤖`,
  ],

  default: [
    `hmm not sure exactly what you're asking — could you rephrase? I can talk about my skills, projects, work experience, education, or how to contact me 🙂`,
    `I didn't quite catch that — what do you want to know? I can tell you about my tech stack, projects I've built, my experience, or how to get in touch.`,
    `not sure I understood that one! try asking about my skills, projects, experience, or drop me a contact question 😄`,
  ],
};

function getAIResponse(msg) {
  const m = msg.toLowerCase().trim();

  // ---- Personal / identity questions ----
  if (m.match(/\b(what.?s your (full )?name|your name|who are you|what do (i|we) call you|what should i call you|what is your (full )?name|full name)\b/))
    return `my full name is **Naveenkumar P** — Naveen for short 😄`;

  if (m.match(/\b(where are you from|where do you live|location|city|state|country|based)\b/))
    return `I'm from **Dharmapuri, Tamil Nadu, India** 📍 — open to remote roles and relocation though.`;

  if (m.match(/\b(how old|age|dob|date of birth|born)\b/))
    return `I was born on **27th July 2004** — 21 years old 😄`;

  if (m.match(/\b(language|speak|mother tongue|native|tamil|english|communication|multilingual)\b/))
    return `my mother tongue is **Tamil** and I'm fluent in **English** too — written and spoken both 🙂`;

  if (m.match(/\b(what do you do|your job|your work|what is your role|job title|designation)\b/))
    return `I'm a **Software Engineer** at Avasoft — working on backend systems, REST APIs, and LLM-powered automation tools.`;

  if (m.match(/\b(college|university|vit|school|studied|degree|qualification|b\.?tech)\b/))
    return pick(NK_RESPONSES.education);

  if (m.match(/\b(naveen|naveenkumar|nk|who is|introduce yourself|tell me about yourself|about you)\b/))
    return pick(NK_RESPONSES.who);

  // ---- Greetings ----
  if (m.match(/\b(hi|hello|hey|sup|yo|hiya|howdy|what.?s up|good morning|good afternoon|good evening)\b/))
    return pick(NK_RESPONSES.greet);

  // ---- Intent-based ----
  if (m.match(/\b(hire|available|looking|opportunity|open to work|job|position|role|recruit|vacancy)\b/))
    return pick(NK_RESPONSES.hire);
  if (m.match(/\b(llm|ai agent|gpt|language model|prompt|genai|autonomous|openai|chatgpt|gemini)\b/))
    return pick(NK_RESPONSES.llm);
  if (m.match(/skill|tech stack|your stack|languages|frameworks|tools|what do you know|java|python|node\.?js|react|backend|frontend|proficient|expertise/))
    return pick(NK_RESPONSES.skills);
  if (m.match(/project|what have you built|what did you build|your work|agent|analytics|side project/))
    return pick(NK_RESPONSES.projects);
  if (m.match(/\b(finance|finance dashboard|finance project|money|banking|fintech|jwt|rbac|role.based)\b/))
    return pick(NK_RESPONSES.finance);
  if (m.match(/\b(experience|work history|avasoft|intern|orom|google|worked at|career)\b/))
    return pick(NK_RESPONSES.experience);
  if (m.match(/\b(contact|email|phone|reach|linkedin|github|connect|dm|message|call|whatsapp|wa\.me|chat)\b/))
    return pick(NK_RESPONSES.contact);
  if (m.match(/\b(education|study|vit|degree|college|university|scholarship|topper|academic)\b/))
    return pick(NK_RESPONSES.education);
  if (m.match(/certif|certification|certified|ethical hack|bug bounty|ec.council|cloud cert/))
    return pick(NK_RESPONSES.certs);

  // ---- Fun / misc ----
  if (m.match(/\b(hobby|hobbies|free time|fun|interest|outside work|passion)\b/))
    return `outside of work I'm mostly exploring AI tooling, contributing to side projects, and occasionally breaking things to see how they work 😄 the curiosity never really switches off.`;

  if (m.match(/\b(favourite|favorite|prefer|best language|best tech|love|enjoy)\b/))
    return `honestly? **Node.js** for shipping fast and **Python** when it's AI/data work. and the LLM engineering side — that's where I have the most fun right now 🤖`;

  if (m.match(/\b(salary|pay|compensation|ctc|package|lpa|current ctc|expected)\b/))
    return `my current CTC is **6 LPA**. for expected — depends on the role and what's on the table. happy to discuss over email at **nk4496330@gmail.com** 😄`;

  if (m.match(/\b(thank|thanks|thankyou|appreciate|awesome|great|cool|nice|wow)\b/))
    return `glad I could help! 😄 anything else you want to know?`;

  if (m.match(/\b(bye|goodbye|cya|see you|later|take care)\b/))
    return `take care! 👋 feel free to come back anytime — or just email me at **nk4496330@gmail.com** 🙂`;

  return pick(NK_RESPONSES.default);
}

function appendMsg(text, role) {
  const messages = document.getElementById('aiChatMessages');
  if (!messages) return;
  const div = document.createElement('div');
  div.className = `ai-msg ai-msg-${role}`;
  // Simple markdown-like bold
  const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  div.innerHTML = `<div class="ai-msg-bubble">${formatted}</div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

function showTyping() {
  const messages = document.getElementById('aiChatMessages');
  if (!messages) return null;
  const div = document.createElement('div');
  div.className = 'ai-msg ai-msg-bot ai-typing';
  div.innerHTML = `<div class="ai-msg-bubble"><span></span><span></span><span></span></div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

function sendAIMessage() {
  const input = document.getElementById('aiInput');
  const quick = document.getElementById('aiQuickBtns');
  if (!input) return;
  const msg = input.value.trim();
  if (!msg) return;

  appendMsg(msg, 'user');
  input.value = '';
  if (quick) quick.style.display = 'none';

  const typing = showTyping();
  // variable delay — feels more like someone actually thinking & typing
  const words = msg.split(' ').length;
  const delay = 700 + words * 80 + Math.random() * 400;

  setTimeout(() => {
    typing?.remove();
    appendMsg(getAIResponse(msg), 'bot');
  }, delay);
}

function askAI(topic) {
  const input = document.getElementById('aiInput');
  const panel = document.getElementById('aiChatPanel');
  const quick = document.getElementById('aiQuickBtns');
  if (!panel.classList.contains('open')) panel.classList.add('open');
  const topicMap = {
    skills:     'what is your tech stack?',
    projects:   'what projects have you built?',
    experience: 'tell me about your work experience',
    contact:    'how can I reach you?',
    education:  'where did you study?',
    certifications: 'what certifications do you have?',
  };
  if (input) input.value = topicMap[topic] || topic;
  sendAIMessage();
}

/* ============================================================
   FEATURE #7 — DARK / LIGHT THEME TOGGLE
   ============================================================ */
(function initThemeToggle() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  if (!btn) return;

  const saved = localStorage.getItem('nk-theme') || 'dark';
  if (saved === 'light') applyLight();

  btn.addEventListener('click', () => {
    if (document.body.classList.contains('light-theme')) {
      document.body.classList.remove('light-theme');
      icon.className = 'fas fa-sun';
      localStorage.setItem('nk-theme', 'dark');
    } else {
      applyLight();
    }
  });

  function applyLight() {
    document.body.classList.add('light-theme');
    icon.className = 'fas fa-moon';
    localStorage.setItem('nk-theme', 'light');
  }
})();

/* ============================================================
   FEATURE #8 — FOCUS WIDGET ROTATOR
   ============================================================ */
(function initFocusWidget() {
  const el = document.getElementById('focusValue');
  if (!el) return;
  const items = [
    'Autonomous LLM Engineering Agent',
    'Node.js REST API Design',
    'Prompt Engineering Workflows',
    'Cloud-native Backend Systems',
    'AI-powered Code Validation',
  ];
  let i = 0;
  setInterval(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-6px)';
    setTimeout(() => {
      i = (i + 1) % items.length;
      el.textContent = items[i];
      el.style.transition = 'opacity 0.4s, transform 0.4s';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 350);
  }, 3200);
})();

/* ============================================================
   FEATURE #1 — AI TERMINAL
   ============================================================ */
(function initTerminal() {
  const input  = document.getElementById('termInput');
  const body   = document.getElementById('termBody');
  if (!input || !body) return;

  const COMMANDS = {
    '--help':     { out: `Available commands:\n  --skills      List technical skills\n  --projects    Show projects\n  --experience  Work history\n  --contact     Get contact info\n  --clear       Clear terminal`, cls:'term-info' },
    '--skills':   { out: `Languages    : Java · JavaScript · Python · SQL · C · C++\nAI/GenAI     : LLM APIs · Prompt Engineering · AI Agents\nBackend      : Node.js · Express.js · REST APIs · Spring Boot\nCloud/DevOps : GCP · Docker · Kubernetes · Jenkins · CI/CD\nDatabases    : MySQL · SQLite · BigQuery · Snowflake`, cls:'term-out' },
    '--projects': { out: `[1] Autonomous LLM Software Engineering Agent\n    → Node.js · LLM APIs · Git automation\n[2] Finance Dashboard (LIVE)\n    → React · Node.js · Express · SQLite · JWT · Swagger\n    → https://finance-dashboard-api-3zya.vercel.app\n[3] COVID-19 / Layoffs Analytics\n    → Python · Pandas · Snowflake · Power BI`, cls:'term-out' },
    '--experience':{ out:`[Avasoft]        Software Engineer     Dec 2025 – Aug 2026\n[OROM]          Frontend Dev Intern   Oct 2022 – Jan 2023\n[Google Cloud]  Cloud Virtual Intern  Oct 2023 – Dec 2023`, cls:'term-out' },
    '--contact':  { out: `Email    : nk4496330@gmail.com\nPhone    : +91 93428 11231\nLinkedIn : linkedin.com/in/naveenkumar-palaniyappan-99a16b250\nGitHub   : github.com/NSP101`, cls:'term-out' },
    '--clear':    null,
  };

  // Boot message
  appendTermLine('term-info', 'Welcome to naveen-cli v1.0 — type --help to get started');

  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const cmd = input.value.trim().toLowerCase();
    input.value = '';
    if (!cmd) return;

    appendTermLine('term-cmd', `naveen@portfolio:~$ ${cmd}`);

    if (cmd === '--clear') { body.innerHTML = ''; return; }

    const match = COMMANDS[cmd];
    if (match) {
      match.out.split('\n').forEach(line => appendTermLine(match.cls, line));
    } else {
      appendTermLine('term-err', `command not found: ${cmd} — try --help`);
    }

    body.scrollTop = body.scrollHeight;
  });

  // Tab autocomplete
  input.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const partial = input.value.trim();
    const match = Object.keys(COMMANDS).find(k => k.startsWith(partial));
    if (match) input.value = match;
  });

  function appendTermLine(cls, text) {
    const div = document.createElement('div');
    div.className = `term-line ${cls}`;
    div.textContent = text;
    body.appendChild(div);
  }
})();

/* ============================================================
   FEATURE #2 — SKILL RADAR CHART
   ============================================================ */
(function initRadar() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const skills = [
    { label: 'AI / GenAI',   value: 0.88, color: '#b197fc' },
    { label: 'Backend',      value: 0.90, color: '#22d3ee' },
    { label: 'Cloud/DevOps', value: 0.78, color: '#f87171' },
    { label: 'Databases',    value: 0.80, color: '#10b981' },
    { label: 'Frontend',     value: 0.68, color: '#fb923c' },
    { label: 'Testing',      value: 0.82, color: '#fbbf24' },
  ];

  const N      = skills.length;
  const CX     = canvas.width  / 2;
  const CY     = canvas.height / 2;
  const RADIUS = Math.min(CX, CY) * 0.72;
  const LEVELS = 5;

  function angleFor(i) { return (Math.PI * 2 * i / N) - Math.PI / 2; }
  function point(i, r) {
    const a = angleFor(i);
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
  }

  let animProgress = 0;
  let rafId;

  function draw(progress) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid rings
    for (let l = 1; l <= LEVELS; l++) {
      const r = RADIUS * (l / LEVELS);
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const p = point(i, r);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(124,109,250,${0.06 + l * 0.03})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Axis lines
    for (let i = 0; i < N; i++) {
      const p = point(i, RADIUS);
      ctx.beginPath();
      ctx.moveTo(CX, CY);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = 'rgba(124,109,250,0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Filled skill area
    ctx.beginPath();
    skills.forEach((s, i) => {
      const r = RADIUS * s.value * progress;
      const p = point(i, r);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fillStyle   = 'rgba(124,109,250,0.12)';
    ctx.strokeStyle = 'rgba(177,151,252,0.8)';
    ctx.lineWidth   = 2;
    ctx.fill();
    ctx.stroke();

    // Skill dots
    skills.forEach((s, i) => {
      const r = RADIUS * s.value * progress;
      const p = point(i, r);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur  = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  function animate() {
    animProgress += 0.025;
    if (animProgress > 1) { animProgress = 1; draw(1); return; }
    draw(animProgress);
    rafId = requestAnimationFrame(animate);
  }

  // Pulse every 4s
  function startPulse() {
    setInterval(() => {
      animProgress = 0.6;
      cancelAnimationFrame(rafId);
      animate();
    }, 4000);
  }

  const wrap = document.querySelector('.radar-wrap');
  const obs  = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animate();
      setTimeout(startPulse, 1500);
      obs.disconnect();
    }
  }, { threshold: 0.3 });
  if (wrap) obs.observe(wrap);
})();

/* ============================================================
   FEATURE #5 — TECH STACK TOOLTIP
   ============================================================ */
(function initStackTooltip() {
  const tooltip   = document.getElementById('stackTooltip');
  const nodesWrap = document.getElementById('stackNodes');
  if (!tooltip || !nodesWrap) return;

  document.querySelectorAll('.project-card[data-stack]').forEach(card => {
    let hideTimer;

    card.addEventListener('mouseenter', e => {
      clearTimeout(hideTimer);
      const stack = JSON.parse(card.dataset.stack || '[]');
      nodesWrap.innerHTML = '';
      stack.forEach((tech, i) => {
        const span = document.createElement('span');
        span.className = 'stack-node';
        span.textContent = tech;
        span.style.animationDelay = `${i * 0.05}s`;
        nodesWrap.appendChild(span);
      });
      positionTooltip(e);
      tooltip.classList.add('visible');
    });

    card.addEventListener('mousemove', positionTooltip);

    card.addEventListener('mouseleave', () => {
      hideTimer = setTimeout(() => tooltip.classList.remove('visible'), 200);
    });
  });

  function positionTooltip(e) {
    const x = e.clientX + 16;
    const y = e.clientY - 20;
    const tw = tooltip.offsetWidth  || 260;
    const th = tooltip.offsetHeight || 100;
    tooltip.style.left = (x + tw > window.innerWidth  ? e.clientX - tw - 16 : x) + 'px';
    tooltip.style.top  = (y + th > window.innerHeight ? e.clientY - th - 16 : y) + 'px';
  }
})();

/* ============================================================
   FEATURE #6 — CODE SNIPPET ROTATOR
   (replaces the static code card with cycling project snippets)
   ============================================================ */
(function initSnippetRotator() {
  // The existing initCodeCard already types the engineer object.
  // This adds a tab switcher below the code card to cycle snippets.
  const codeCard = document.getElementById('codeCard');
  if (!codeCard) return;

  const snippets = [
    {
      label: 'naveen.js',
      lang:  'JS',
      lines: 12,
      tokens: [
        ['ck','const '],['cv','engineer'],'',['cs',' = {'],'\n',
        ['  ','  '],['cp','name'],['',': '],['cs','"Naveenkumar P"'],['',','],'\n',
        ['  ','  '],['cp','role'],['',': '],['cs','"Software Engineer"'],['',','],'\n',
        ['  ','  '],['cp','focus'],['',': '],['cs','"LLM + Backend"'],['',','],'\n',
        ['  ','  '],['cp','status'],['',': '],['cs','"building cool stuff"'],['',','],'\n',
        ['','}'],['cc',' // open to work 🚀'],'\n',
      ]
    },
    {
      label: 'llm-agent.js',
      lang:  'JS',
      lines: 10,
      tokens: [
        ['ck','async function '],['cv','runAgent'],['','(task) {'],'\n',
        ['  ','  '],['ck','const '],['cv','code'],['',
          ' = await '],['cv','llm'],['','.generate(task);'],'\n',
        ['  ','  '],['ck','const '],['cv','result'],['',
          ' = await '],['cv','validate'],['','(code);'],'\n',
        ['  ','  '],['ck','if '],['','(result.ok) {'],'\n',
        ['    ','    '],['ck','await '],['cv','git'],['','.commitAndPR(code);'],'\n',
        ['  ','  '],['','} '],['ck','else'],['',
          ' runAgent(task); '],['cc','// retry'],'\n',
        ['','}'],'\n',
      ]
    },
    {
      label: 'api.js',
      lang:  'JS',
      lines: 9,
      tokens: [
        ['cv','app'],['','.'],['cv','post'],['','('],['cs','"/api/data"'],['',', '],
        ['ck','async '],['','(req, res) => {'],'\n',
        ['  ','  '],['ck','try '],['','{'],'\n',
        ['    ','    '],['ck','const '],['cv','data'],['',
          ' = await '],['cv','db'],['','.query(req.body);'],'\n',
        ['    ','    '],['cv','res'],['','.json({ success: '],
        ['ck','true'],['',', data });'],'\n',
        ['  ','  '],['','} '],['ck','catch'],['','(e) {'],'\n',
        ['    ','    '],['cv','res'],['','.status('],['cs','500'],['',').json({ error: e.message });'],'\n',
        ['  ','  '],['','}'],'\n',['','}'],['',');'],'\n',
      ]
    },
  ];

  // Build tab bar
  const tabBar = document.createElement('div');
  tabBar.className = 'snippet-tabs';
  snippets.forEach((s, i) => {
    const t = document.createElement('button');
    t.className = 'snippet-tab' + (i === 0 ? ' active' : '');
    t.textContent = s.label;
    t.onclick = () => switchSnippet(i);
    tabBar.appendChild(t);
  });
  codeCard.insertBefore(tabBar, codeCard.querySelector('.code-body'));

  let currentIdx = 0;
  let autoTimer  = setInterval(() => switchSnippet((currentIdx + 1) % snippets.length), 6000);

  function switchSnippet(idx) {
    clearInterval(autoTimer);
    currentIdx = idx;
    autoTimer  = setInterval(() => switchSnippet((currentIdx + 1) % snippets.length), 6000);

    const s = snippets[idx];
    // Update filename & badge
    const fn = codeCard.querySelector('.code-filename');
    if (fn) fn.innerHTML = `<i class="fas fa-file-code"></i> ${s.label}`;
    const badge = codeCard.querySelector('.code-badge');
    if (badge) badge.textContent = s.lang;
    const linesEl = codeCard.querySelector('.code-lines');
    if (linesEl) linesEl.textContent = `${s.lines} lines`;

    // Update line numbers
    const lnWrap = codeCard.querySelector('.line-numbers');
    if (lnWrap) {
      lnWrap.innerHTML = '';
      for (let i = 1; i <= s.lines; i++) {
        const sp = document.createElement('span');
        sp.textContent = i;
        lnWrap.appendChild(sp);
      }
    }

    // Type new snippet
    const output = document.getElementById('codeOutput');
    if (!output) return;
    output.innerHTML = '';
    let html = '';
    let ti = 0;

    function typeToken() {
      if (ti >= s.tokens.length) { output.innerHTML = html; return; }
      const tok = s.tokens[ti++];
      if (tok === '\n') { html += '\n'; }
      else if (typeof tok === 'string') { html += escHtml(tok); }
      else {
        const [cls, text] = tok;
        html += cls
          ? `<span class="${cls}">${escHtml(text)}</span>`
          : escHtml(text);
      }
      output.innerHTML = html + '<span class="cc">▌</span>';
      setTimeout(typeToken, 28);
    }

    tabBar.querySelectorAll('.snippet-tab').forEach((t, i) => t.classList.toggle('active', i === idx));
    typeToken();
  }

  function escHtml(c) {
    return c.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
})();

/* ============================================================
   FEATURE #3 — DYNAMIC AI CHAT FOLLOW-UP SUGGESTIONS
   ============================================================ */
(function upgradeAIChat() {
  // Patch the existing sendAIMessage / askAI to add follow-up buttons
  const FOLLOW_UPS = {
    skills:     ['projects','experience','contact'],
    projects:   ['skills','experience','contact'],
    experience: ['skills','projects','education'],
    contact:    ['projects','skills','experience'],
    education:  ['skills','certifications','contact'],
    certifications: ['skills','experience','contact'],
  };

  const LABELS = {
    skills:'🛠 Skills', projects:'🚀 Projects', experience:'💼 Experience',
    contact:'📬 Contact', education:'🎓 Education', certifications:'📜 Certs',
  };

  // Override the global askAI to inject follow-ups after bot response
  const _originalAskAI = window.askAI;
  window.askAI = function(topic) {
    _originalAskAI && _originalAskAI(topic);
    // After the bot responds (delay matches the typing delay)
    setTimeout(() => injectFollowUps(topic), 1600);
  };

  function injectFollowUps(topic) {
    const msgs = document.getElementById('aiChatMessages');
    if (!msgs) return;
    const existing = msgs.querySelector('.ai-followup-row');
    if (existing) existing.remove();

    const related = FOLLOW_UPS[topic] || ['skills','projects','contact'];
    const row = document.createElement('div');
    row.className = 'ai-followup-row';

    const label = document.createElement('p');
    label.className = 'ai-followup-label';
    label.textContent = 'You might also ask:';
    row.appendChild(label);

    const btns = document.createElement('div');
    btns.className = 'ai-followup-btns';
    related.forEach(t => {
      const b = document.createElement('button');
      b.textContent = LABELS[t] || t;
      b.onclick = () => window.askAI(t);
      btns.appendChild(b);
    });
    row.appendChild(btns);
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  // Also add follow-ups to the free-text send
  const _origSend = window.sendAIMessage;
  window.sendAIMessage = function() {
    const input = document.getElementById('aiInput');
    const msg   = input ? input.value.trim().toLowerCase() : '';
    _origSend && _origSend();

    // Detect topic from free text
    let detected = null;
    if (msg.match(/skill|tech|java|python|node/)) detected = 'skills';
    else if (msg.match(/project|build|agent/))    detected = 'projects';
    else if (msg.match(/experience|job|work/))    detected = 'experience';
    else if (msg.match(/contact|email|reach/))    detected = 'contact';
    else if (msg.match(/cert|hack/))              detected = 'certifications';

    if (detected) setTimeout(() => injectFollowUps(detected), 1600);
  };
})();

/* Inject follow-up CSS */
(function addFollowUpCSS() {
  const style = document.createElement('style');
  style.textContent = `
    .ai-followup-row { padding: 0 0 0.5rem; }
    .ai-followup-label {
      font-size: 0.68rem; color: var(--text3);
      margin-bottom: 0.4rem; padding-left: 2px;
    }
    .ai-followup-btns { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .ai-followup-btns button {
      font-size: 0.7rem; font-weight: 600;
      padding: 4px 12px; border-radius: 100px;
      background: rgba(34,211,238,0.08);
      border: 1px solid rgba(34,211,238,0.2);
      color: var(--cyan); cursor: pointer;
      font-family: var(--font); transition: 0.2s;
    }
    .ai-followup-btns button:hover {
      background: rgba(34,211,238,0.16);
      transform: translateY(-1px);
    }
    .snippet-tabs {
      display: flex; gap: 2px; padding: 0 14px 0;
      background: rgba(255,255,255,0.02);
      border-bottom: 1px solid rgba(124,109,250,0.12);
      overflow-x: auto;
    }
    .snippet-tab {
      font-family: var(--mono); font-size: 0.72rem;
      padding: 7px 14px; border: none;
      background: transparent; color: var(--text3);
      cursor: pointer; transition: 0.2s;
      border-bottom: 2px solid transparent;
      white-space: nowrap;
    }
    .snippet-tab:hover { color: var(--text2); }
    .snippet-tab.active { color: var(--accent2); border-bottom-color: var(--accent); }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   18 NEW FEATURES — JAVASCRIPT
   ============================================================ */

/* ---- #5 NEURAL NETWORK BACKGROUND ---- */
(function initNeural() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class NNode {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(124,109,250,0.6)';
      ctx.fill();
    }
  }

  const COUNT = Math.min(60, Math.floor(W * H / 20000));
  for (let i = 0; i < COUNT; i++) nodes.push(new NNode());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 160) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(124,109,250,${(1 - d/160) * 0.25})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    nodes.forEach(n => { n.update(); n.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ---- #9 VISITOR COUNTER ---- */
(function initVisitorCounter() {
  const el = document.getElementById('visitorCount');
  if (!el) return;
  const key   = 'nk-visits';
  const count = (parseInt(localStorage.getItem(key) || '0') + 1);
  localStorage.setItem(key, count);
  // Animate count up
  let n = 0;
  const target = count;
  const step   = Math.ceil(target / 30);
  const timer  = setInterval(() => {
    n = Math.min(n + step, target);
    el.textContent = n;
    if (n >= target) clearInterval(timer);
  }, 40);
})();

/* ---- #10 LIVE CLOCK ---- */
(function initLiveClock() {
  const timeEl   = document.getElementById('clockTime');
  const statusEl = document.getElementById('clockStatus');
  if (!timeEl) return;

  function update() {
    const now = new Date();
    // IST = UTC+5:30 — use toLocaleString with explicit timezone
    const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const h   = String(ist.getHours()).padStart(2,'0');
    const m   = String(ist.getMinutes()).padStart(2,'0');
    const s   = String(ist.getSeconds()).padStart(2,'0');
    timeEl.textContent = `${h}:${m}:${s}`;

    // Available 9am–9pm IST
    const hour = ist.getHours();
    if (statusEl) {
      if (hour >= 9 && hour < 21) {
        statusEl.textContent = '● Available';
        statusEl.className   = 'clock-status available';
      } else {
        statusEl.textContent = '● Away';
        statusEl.className   = 'clock-status away';
      }
    }
  }
  update();
  setInterval(update, 1000);
})();

/* ---- #18 OPEN TO WORK BADGE ---- */
// Already in HTML, just ensure it pulses — CSS handles it.

/* ---- #16 EXIT INTENT POPUP ---- */
(function initExitIntent() {
  const popup    = document.getElementById('exitPopup');
  const closeBtn = document.getElementById('exitPopupClose');
  const copyBtn  = document.getElementById('exitCopyBtn');
  if (!popup) return;

  let shown = false;
  const dismissed = sessionStorage.getItem('nk-exit-shown');
  if (dismissed) return;

  document.addEventListener('mouseleave', e => {
    if (e.clientY < 40 && !shown) {
      shown = true;
      popup.classList.add('show');
      sessionStorage.setItem('nk-exit-shown', '1');
    }
  });

  closeBtn?.addEventListener('click', () => popup.classList.remove('show'));
  popup.addEventListener('click', e => { if (e.target === popup) popup.classList.remove('show'); });

  copyBtn?.addEventListener('click', () => {
    navigator.clipboard?.writeText('nk4496330@gmail.com').then(() => {
      copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      copyBtn.style.background = 'linear-gradient(135deg, #10b981, #22d3ee)';
      launchConfetti();
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
        copyBtn.style.background = '';
      }, 2000);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') popup.classList.remove('show');
  });
})();

/* ---- #17 CONFETTI ---- */
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx     = canvas.getContext('2d');
  const pieces  = [];
  const COLORS  = ['#7c6dfa','#b197fc','#e879f9','#10b981','#22d3ee','#fbbf24','#f87171'];

  for (let i = 0; i < 120; i++) {
    pieces.push({
      x:  Math.random() * canvas.width,
      y:  -10 - Math.random() * 200,
      w:  6 + Math.random() * 8,
      h:  10 + Math.random() * 6,
      r:  Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 5,
      vy: 3 + Math.random() * 5,
      vr: (Math.random() - 0.5) * 0.2,
      c:  COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1,
    });
  }

  let frame;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    pieces.forEach(p => {
      p.x  += p.vx; p.y += p.vy; p.r += p.vr;
      p.vy += 0.15; // gravity
      if (p.y > canvas.height) p.alpha -= 0.05;
      if (p.alpha <= 0) return;
      alive = true;
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    if (alive) frame = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  cancelAnimationFrame(frame);
  draw();
}

// Launch confetti on email copy in contact section too
(function patchEmailCopy() {
  document.querySelectorAll('a[href="mailto:nk4496330@gmail.com"]').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(launchConfetti, 400);
    });
  });
})();

/* ---- #8 MATRIX RAIN EASTER EGG ---- */
(function initMatrixEgg() {
  const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','m'];
  let pos = 0;

  document.addEventListener('keydown', e => {
    if (e.key === SEQ[pos]) {
      pos++;
      if (pos === SEQ.length) {
        pos = 0;
        triggerMatrix();
      }
    } else {
      pos = 0;
    }
  });

  function triggerMatrix() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `position:fixed;inset:0;z-index:9800;pointer-events:none;`;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx  = canvas.getContext('2d');
    const cols = Math.floor(canvas.width / 16);
    const drops= Array(cols).fill(1);
    const CHARS= 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01AI</>{}[]';

    let frames = 0;
    const timer = setInterval(() => {
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff41';
      ctx.font      = '14px monospace';
      drops.forEach((y, i) => {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(ch, i * 16, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      if (++frames > 180) {
        clearInterval(timer);
        canvas.style.transition = 'opacity 1s';
        canvas.style.opacity = '0';
        setTimeout(() => canvas.remove(), 1000);
      }
    }, 33);

    toast('🟩 Matrix mode activated! (↑↑↓↓←→M)');
  }
})();

/* ---- #12 PAGE TRANSITIONS ---- */
(function initPageTransitions() {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      // We already have smooth scroll — just add a brief flash
      overlay.style.transition = 'transform 0.15s ease';
      overlay.style.transformOrigin = 'left';
      overlay.style.transform = 'scaleX(1)';
      setTimeout(() => {
        overlay.style.transformOrigin = 'right';
        overlay.style.transform = 'scaleX(0)';
      }, 150);
    });
  });
})();

/* ---- #13 MAGNETIC BUTTONS ---- */
(function initMagneticButtons() {
  document.querySelectorAll('.btn, .social-pill, .contact-social-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s var(--ease)';
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease';
    });
  });
})();

/* ---- #15 COPY SECTION LINK ---- */
(function initSectionCopyLinks() {
  document.querySelectorAll('.section-title').forEach(title => {
    const section = title.closest('section');
    if (!section || !section.id) return;
    const btn = document.createElement('button');
    btn.className = 'copy-section-link';
    btn.innerHTML = '<i class="fas fa-link"></i>';
    btn.title = 'Copy link to this section';
    btn.setAttribute('aria-label', 'Copy link');
    btn.addEventListener('click', () => {
      const url = `${location.origin}${location.pathname}#${section.id}`;
      navigator.clipboard?.writeText(url).then(() => {
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.color = 'var(--green)';
        setTimeout(() => {
          btn.innerHTML = '<i class="fas fa-link"></i>';
          btn.style.color = '';
        }, 1800);
        toast('🔗 Section link copied!');
      });
    });
    title.appendChild(btn);
  });
})();

/* ---- #6 SKILL CONSTELLATION ---- */
(function initConstellation() {
  const canvas = document.getElementById('constellationCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const STARS = [
    { label:'Node.js',      x:.12, y:.5,  color:'#68a063', size:9,  group:'backend' },
    { label:'Express.js',   x:.22, y:.3,  color:'#68a063', size:7,  group:'backend' },
    { label:'REST APIs',    x:.22, y:.7,  color:'#68a063', size:8,  group:'backend' },
    { label:'Java',         x:.35, y:.2,  color:'#e76f00', size:8,  group:'lang' },
    { label:'Python',       x:.35, y:.8,  color:'#ffd242', size:8,  group:'lang' },
    { label:'JavaScript',   x:.3,  y:.5,  color:'#f7df1e', size:9,  group:'lang' },
    { label:'LLM APIs',     x:.5,  y:.15, color:'#b197fc', size:10, group:'ai' },
    { label:'AI Agents',    x:.5,  y:.5,  color:'#e879f9', size:12, group:'ai' },
    { label:'Prompt Eng.',  x:.5,  y:.85, color:'#b197fc', size:9,  group:'ai' },
    { label:'GCP',          x:.65, y:.25, color:'#4285f4', size:8,  group:'cloud' },
    { label:'Docker',       x:.65, y:.5,  color:'#2496ed', size:8,  group:'cloud' },
    { label:'Kubernetes',   x:.65, y:.75, color:'#326ce5', size:7,  group:'cloud' },
    { label:'MySQL',        x:.78, y:.35, color:'#10b981', size:7,  group:'db' },
    { label:'Snowflake',    x:.78, y:.65, color:'#29b5e8', size:7,  group:'db' },
    { label:'React',        x:.88, y:.5,  color:'#61dafb', size:7,  group:'frontend' },
  ];

  const CONNECTIONS = [
    [0,1],[0,2],[1,2],[1,3],[2,4],[3,5],[4,5],[5,0],
    [6,7],[7,8],[6,8],[5,7],[3,6],
    [9,10],[10,11],[9,11],[3,9],[5,10],
    [12,13],[10,12],[11,13],[7,12],
    [14,12],[14,9],
  ];

  let W, H, hovered = null, animProg = 0, started = false;

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }
  resize();

  function px(star) { return { x: star.x * W, y: star.y * H }; }

  function draw(prog) {
    ctx.clearRect(0, 0, W, H);

    // Connections
    CONNECTIONS.forEach(([a, b]) => {
      const pa = px(STARS[a]), pb = px(STARS[b]);
      const isHighlighted = hovered !== null && (a === hovered || b === hovered);
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.strokeStyle = isHighlighted
        ? `rgba(177,151,252,${0.5 * prog})`
        : `rgba(124,109,250,${0.12 * prog})`;
      ctx.lineWidth = isHighlighted ? 1.5 : 0.8;
      ctx.stroke();
    });

    // Stars
    STARS.forEach((s, i) => {
      const { x, y } = px(s);
      const isHov = i === hovered;
      const r = (isHov ? s.size * 1.6 : s.size) * prog;

      // Glow
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
      grad.addColorStop(0, s.color + (isHov ? 'cc' : '66'));
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(x, y, r * 3, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = isHov ? '#fff' : s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur  = isHov ? 20 : 8;
      ctx.fill();
      ctx.shadowBlur  = 0;

      // Label on hover
      if (isHov) {
        ctx.font      = `bold 12px Inter, sans-serif`;
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(s.label, x, y - r - 8);
      }
    });
  }

  // Animate in
  function animate() {
    if (animProg < 1) { animProg += 0.03; requestAnimationFrame(animate); }
    else animProg = 1;
    draw(animProg);
  }

  // Hover detection
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    hovered = null;
    STARS.forEach((s, i) => {
      const { x, y } = px(s);
      if (Math.hypot(mx - x, my - y) < s.size * 2) hovered = i;
    });
    draw(animProg);
  });
  canvas.addEventListener('mouseleave', () => { hovered = null; draw(animProg); });

  window.addEventListener('resize', () => { resize(); draw(animProg); });

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true; animate(); obs.disconnect();
    }
  }, { threshold: 0.2 });
  obs.observe(canvas);
})();

/* ---- #1 AI RESUME ANALYZER (chat upgrade) ---- */
// Extends the existing chatbot to detect JD keywords and match Naveen's skills
(function initResumeAnalyzer() {
  const MY_SKILLS = ['java','javascript','python','sql','node','express','react',
    'rest api','spring boot','docker','kubernetes','gcp','mysql','sqlite',
    'bigquery','snowflake','git','jenkins','postman','jira','linux',
    'llm','prompt engineering','ai agent','agile','ci/cd','playwright'];

  const origResponse = window.getAIResponse;
  window.getAIResponse = function(msg) {
    // Detect if it looks like a JD paste (long text with keywords)
    if (msg.length > 80) {
      const lower = msg.toLowerCase();
      const matches = MY_SKILLS.filter(s => lower.includes(s));
      if (matches.length >= 3) {
        const pct = Math.round((matches.length / MY_SKILLS.length) * 100);
        return `nice — I scanned that against my skills 🔍\n\n**Match: ~${pct}%**\n\nSkills I have that match:\n${matches.map(s => `✅ ${s}`).join('\n')}\n\nwant me to explain how I've used any of these in real projects?`;
      }
    }
    return origResponse ? origResponse(msg) : '';
  };
})();

/* ---- #2 SENTIMENT-AWARE CHAT ---- */
(function initSentimentChat() {
  const origResp = window.getAIResponse;
  window.getAIResponse = function(msg) {
    const m = msg.toLowerCase();
    // Detect negative/challenging questions
    const negative = m.match(/\b(no experience|only|just|weak|bad|lack|don't have|no x|missing|too junior|not enough)\b/);
    const base = origResp ? origResp(msg) : '';
    if (negative) {
      return `fair question 👍 everyone starts somewhere — I've been deliberate about building real, production-grade experience rather than just tutorials.\n\n${base}`;
    }
    return base;
  };
})();

/* ============================================================
   14 NEW FEATURES — JS ROUND 2
   ============================================================ */

/* ---- #6 COLOR PALETTE SWITCHER ---- */
(function initPalette() {
  document.querySelectorAll('.palette-dot').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.palette-dot').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const p = btn.dataset.palette;
      document.body.classList.remove('palette-ocean','palette-forest','palette-sunset');
      if (p !== 'purple') document.body.classList.add(`palette-${p}`);
      localStorage.setItem('nk-palette', p);
    });
  });
  // Restore saved palette
  const saved = localStorage.getItem('nk-palette');
  if (saved && saved !== 'purple') {
    document.body.classList.add(`palette-${saved}`);
    document.querySelectorAll('.palette-dot').forEach(b => {
      b.classList.toggle('active', b.dataset.palette === saved);
    });
  }
})();

/* ---- #14 READING TIME + PROGRESS ---- */
(function initReadingTime() {
  const bar = document.getElementById('readingProgressInner');
  const txt = document.getElementById('readingTimeText');

  // Count words in page text
  const words = document.body.innerText.split(/\s+/).length;
  const mins  = Math.max(1, Math.round(words / 200));
  if (txt) txt.textContent = `~${mins} min read`;

  // Reuse the progress bar (already positioned fixed top)
  if (bar) {
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  }
})();

/* ---- #5 TL;DR SUMMARY MODAL ---- */
function openSummary() {
  const modal = document.getElementById('summaryModal');
  const body  = document.getElementById('summaryBody');
  if (!modal || !body) return;

  const lines = [
    { icon: 'fas fa-user', text: '<strong>Naveenkumar P</strong> — Software Engineer with 1+ year at Avasoft, building backend systems and LLM-powered tools.' },
    { icon: 'fas fa-robot', text: 'Built an <strong>autonomous LLM agent</strong> that writes code, validates it, and automates Git commits and PRs end-to-end.' },
    { icon: 'fas fa-server', text: 'Core stack: <strong>Node.js · Java · Python · REST APIs · GCP · Docker · Kubernetes</strong>' },
    { icon: 'fas fa-graduation-cap', text: 'B.Tech CS from <strong>VIT</strong> (2021–2025) · STARS Merit Scholar · District Topper · NMMS Scholar' },
    { icon: 'fas fa-envelope', text: 'Open to work — reach him at <strong>nk4496330@gmail.com</strong> or LinkedIn.' },
  ];

  body.innerHTML = '';
  modal.classList.add('open');

  lines.forEach((l, i) => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = 'summary-line';
      div.style.animationDelay = `${i * 0.1}s`;
      div.innerHTML = `<i class="${l.icon}"></i><span>${l.text}</span>`;
      body.appendChild(div);
    }, i * 180);
  });
}

document.getElementById('summaryClose')?.addEventListener('click', () => {
  document.getElementById('summaryModal')?.classList.remove('open');
});
document.getElementById('summaryModal')?.addEventListener('click', e => {
  if (e.target === document.getElementById('summaryModal'))
    document.getElementById('summaryModal').classList.remove('open');
});

/* ---- #2 COMMAND PALETTE ---- */
(function initCmdPalette() {
  const palette = document.getElementById('cmdPalette');
  const input   = document.getElementById('cmdInput');
  const results = document.getElementById('cmdResults');
  if (!palette || !input || !results) return;

  const COMMANDS = [
    { icon:'fas fa-user',        title:'About Naveen',          desc:'Go to the About section',       action:() => scrollTo('#about'),      section:'About' },
    { icon:'fas fa-code',        title:'Skills & Tech Stack',   desc:'View all technical skills',     action:() => scrollTo('#skills'),     section:'Skills' },
    { icon:'fas fa-briefcase',   title:'Work Experience',       desc:'Avasoft, OROM, Google Cloud',   action:() => scrollTo('#experience'), section:'Experience' },
    { icon:'fas fa-rocket',      title:'Projects',              desc:'LLM Agent, Dashboard, Analytics',action:() => scrollTo('#projects'),  section:'Projects' },
    { icon:'fas fa-trophy',      title:'Achievements',          desc:'Education, awards, certs',      action:() => scrollTo('#achievements'),section:'Achievements' },
    { icon:'fas fa-envelope',    title:'Contact Naveen',        desc:'Email, phone, LinkedIn',        action:() => scrollTo('#contact'),    section:'Contact' },
    { icon:'fas fa-robot',       title:'TL;DR Summary',        desc:'AI-generated 5-line summary',   action:() => openSummary(),           section:'AI' },
    { icon:'fas fa-envelope',    title:'Copy Email',            desc:'nk4496330@gmail.com',           action:() => navigator.clipboard?.writeText('nk4496330@gmail.com').then(() => toast('📋 Email copied!')), section:'Contact' },
    { icon:'fab fa-github',      title:'Open GitHub',           desc:'github.com/NSP101',             action:() => window.open('https://github.com/NSP101','_blank'), section:'Links' },
    { icon:'fab fa-linkedin',    title:'Open LinkedIn',         desc:'Connect on LinkedIn',           action:() => window.open('https://www.linkedin.com/in/naveenkumar-palaniyappan-99a16b250','_blank'), section:'Links' },
    { icon:'fas fa-sun',         title:'Toggle Theme',          desc:'Switch dark / light mode',      action:() => document.getElementById('themeToggle')?.click(), section:'Settings' },
    { icon:'fas fa-keyboard',    title:'Keyboard Shortcuts',    desc:'Show all shortcuts',            action:() => document.getElementById('shortcutsModal')?.classList.add('open'), section:'Help' },
    { icon:'fas fa-share-alt',   title:'Share Portfolio',       desc:'Copy portfolio link',           action:() => sharePortfolio(),        section:'Share' },
    { icon:'fab fa-whatsapp',    title:'WhatsApp Naveen',        desc:'+91 93428 11231',               action:() => window.open('https://wa.me/919342811231','_blank'), section:'Contact' },
  ];

  function scrollTo(id) {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
    close();
  }

  function open() { palette.classList.add('open'); input.focus(); render(''); }
  function close(){ palette.classList.remove('open'); input.value = ''; }

  function render(q) {
    const filtered = q
      ? COMMANDS.filter(c => (c.title + c.desc + c.section).toLowerCase().includes(q.toLowerCase()))
      : COMMANDS;
    results.innerHTML = '';
    filtered.forEach((cmd, i) => {
      const div = document.createElement('div');
      div.className = 'cmd-result-item';
      div.innerHTML = `
        <div class="cmd-result-icon"><i class="${cmd.icon}"></i></div>
        <div>
          <div class="cmd-result-title">${cmd.title}</div>
          <div class="cmd-result-desc">${cmd.desc}</div>
        </div>
        <span class="cmd-result-section">${cmd.section}</span>`;
      div.addEventListener('click', () => { cmd.action(); close(); });
      results.appendChild(div);
    });
  }

  input.addEventListener('input', e => render(e.target.value));

  // Keyboard nav inside palette
  input.addEventListener('keydown', e => {
    const items = results.querySelectorAll('.cmd-result-item');
    const active = results.querySelector('.cmd-result-item.active');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = active ? (active.nextElementSibling || items[0]) : items[0];
      active?.classList.remove('active');
      next?.classList.add('active');
      next?.scrollIntoView({ block:'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = active ? (active.previousElementSibling || items[items.length-1]) : items[items.length-1];
      active?.classList.remove('active');
      prev?.classList.add('active');
      prev?.scrollIntoView({ block:'nearest' });
    } else if (e.key === 'Enter') {
      const cmd = active
        ? COMMANDS.find(c => c.title === active.querySelector('.cmd-result-title')?.textContent)
        : null;
      if (cmd) { cmd.action(); close(); }
    } else if (e.key === 'Escape') { close(); }
  });

  // Ctrl+K global
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); palette.classList.contains('open') ? close() : open(); }
    if (e.key === 'Escape') close();
  });

  palette.addEventListener('click', e => { if (e.target === palette) close(); });
})();

/* ---- #13 KEYBOARD SHORTCUTS MODAL ---- */
(function initShortcutsModal() {
  const modal = document.getElementById('shortcutsModal');
  if (!modal) return;
  document.getElementById('shortcutsClose')?.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    // ? key
    if (e.key === '?') modal.classList.add('open');
    // T = toggle theme
    if (e.key === 't' || e.key === 'T') document.getElementById('themeToggle')?.click();
    // 1-6 jump to sections
    const sectionMap = { '1':'#hero','2':'#about','3':'#skills','4':'#experience','5':'#projects','6':'#achievements' };
    if (sectionMap[e.key]) {
      const el = document.querySelector(sectionMap[e.key]);
      el?.scrollIntoView({ behavior:'smooth', block:'start' });
    }
  });
})();

/* ---- #12 SHARE BUTTON ---- */
function sharePortfolio() {
  const url   = window.location.href;
  const title = 'Naveenkumar P — Software Engineer Portfolio';
  const text  = 'Check out Naveen\'s portfolio — Software Engineer & LLM Builder';
  if (navigator.share) {
    navigator.share({ title, text, url }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(url).then(() => toast('🔗 Portfolio link copied!'));
  }
}
document.getElementById('shareFab')?.addEventListener('click', sharePortfolio);

/* ---- #9 NEURAL PULSE TYPING INDICATOR ---- */
// Override showTyping to use neural pulse instead of plain dots
const _origShowTyping = window.showTyping;
window.showTyping = function() {
  const messages = document.getElementById('aiChatMessages');
  if (!messages) return null;
  const div = document.createElement('div');
  div.className = 'ai-msg ai-msg-bot ai-typing';
  div.innerHTML = `<div class="ai-msg-bubble">
    <div class="neural-pulse">
      <div class="np-ring"></div>
      <div class="np-ring"></div>
      <div class="np-ring"></div>
    </div>
  </div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
};

/* ---- #10 SKILL HEAT BARS ANIMATE ---- */
(function initHeatBars() {
  const wrap = document.querySelector('.skill-heat-wrap');
  if (!wrap) return;
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    wrap.querySelectorAll('.heat-fill').forEach(bar => {
      bar.style.width = bar.dataset.pct + '%';
    });
    obs.disconnect();
  }, { threshold: 0.3 });
  obs.observe(wrap);
})();

/* ---- #8 PROJECT TIMELINE ANIMATE ---- */
(function initProjTimeline() {
  const wrap = document.querySelector('.proj-timeline-wrap');
  if (!wrap) return;
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    wrap.querySelectorAll('.proj-tl-item').forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      setTimeout(() => {
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, i * 220);
    });
    obs.disconnect();
  }, { threshold: 0.2 });
  obs.observe(wrap);
})();

/* ---- #4 SKILL GAP ADVISOR (chat upgrade) ---- */
(function initSkillGapAdvisor() {
  const ROLE_SKILLS = {
    'ml engineer':     ['python','tensorflow','pytorch','scikit-learn','statistics'],
    'devops':          ['docker','kubernetes','jenkins','terraform','ansible','aws'],
    'fullstack':       ['react','node.js','sql','rest apis','git','css'],
    'backend':         ['node.js','java','sql','rest apis','docker','postgresql'],
    'frontend':        ['react','typescript','css','html','webpack','figma'],
    'data engineer':   ['python','sql','spark','airflow','bigquery','snowflake'],
    'cloud architect': ['gcp','aws','kubernetes','terraform','docker','networking'],
  };
  const MY_HAS = ['java','javascript','python','sql','node.js','express','react',
    'rest apis','docker','kubernetes','gcp','mysql','sqlite','bigquery','snowflake',
    'git','jenkins','css','html'];

  const orig = window.getAIResponse;
  window.getAIResponse = function(msg) {
    const m = msg.toLowerCase();
    for (const [role, needed] of Object.entries(ROLE_SKILLS)) {
      if (m.includes(role)) {
        const have    = needed.filter(s => MY_HAS.includes(s));
        const missing = needed.filter(s => !MY_HAS.includes(s));
        const pct = Math.round((have.length / needed.length) * 100);
        return `for a **${role}** role — here's the gap analysis:\n\n✅ **Already have (${have.length}/${needed.length}):** ${have.join(', ')}\n\n📚 **Would need to add:** ${missing.length ? missing.join(', ') : 'nothing major!'}\n\n**Match: ${pct}%** — ${pct >= 70 ? 'strong fit 💪' : 'some learning needed but definitely buildable 🚀'}`;
      }
    }
    return orig ? orig(msg) : '';
  };
})();

/* ---- #3 DIFFICULTY ESTIMATOR (chat upgrade) ---- */
(function initDifficultyEstimator() {
  const DIFFICULTY = {
    'llm agent': {
      score: 8,
      text: `building the LLM agent was genuinely hard — I'd say **8/10**.\n\nthe tricky parts:\n- getting the model to generate structured, runnable code consistently (prompt engineering took a lot of iteration)\n- the validation loop — detecting errors, reformatting the prompt, retrying without infinite loops\n- automating the Git workflow reliably across different repo states\n\nthe fun parts: seeing it actually commit real code on its own for the first time 🤖`,
    },
    'finance dashboard': {
      score: 6,
      text: `finance dashboard was a solid **7/10** — more complex than it looks.\n\nthe tricky parts:\n- getting JWT role-based access control right across 3 user types (Admin/Analyst/Viewer) with enforced permissions on every endpoint\n- designing the analytics APIs to be efficient with SQLite — monthly/weekly trends, category totals all in one clean response\n- soft delete logic so nothing is hard-deleted but still filtered correctly everywhere\n\nthe fun part: seeing the React frontend with Recharts pull live data from the API and render charts in real time 📊\n\nit's live at **finance-dashboard-api-3zya.vercel.app** if you want to check it out`,
    },
    'analytics': {
      score: 5,
      text: `the analytics project was around **5/10** — mostly data engineering challenge.\n\nSnowpipe ingestion had some quirks to figure out, and making Power BI dashboards actually meaningful (not just pretty) took more thought than I expected.`,
    },
  };

  const orig = window.getAIResponse;
  window.getAIResponse = function(msg) {
    const m = msg.toLowerCase();
    if (m.match(/hard|difficult|challenge|complex|tough|rating|score|10/)) {
      for (const [key, val] of Object.entries(DIFFICULTY)) {
        if (m.includes(key)) return val.text;
      }
      if (m.match(/project|build/)) return DIFFICULTY['llm agent'].text;
    }
    return orig ? orig(msg) : '';
  };
})();

/* ---- #11 PWA SERVICE WORKER REGISTER ---- */
(function initPWA() {
  if ('serviceWorker' in navigator) {
    // Register inline service worker for offline support
    const swCode = `
self.addEventListener('install', e => {
  e.waitUntil(caches.open('nk-v1').then(c => c.addAll(['./', './index.html', './style.css', './script.js', './image.png'])));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});`;
    const blob = new Blob([swCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);
    navigator.serviceWorker.register(swUrl).catch(() => {});
  }
})();

/* ============================================================
   15 NEW FEATURES — JS ROUND 3
   ============================================================ */

/* ---- #1 CHAT HISTORY PERSISTENCE ---- */
(function initChatHistory() {
  const KEY = 'nk-chat-history';
  const messages = document.getElementById('aiChatMessages');
  if (!messages) return;

  // Restore saved messages (skip the default greeting if history exists)
  const saved = (() => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch(e) { return []; } })();
  if (saved.length > 0) {
    // Clear default greeting
    messages.innerHTML = '';
    saved.forEach(({ text, role }) => appendMsg(text, role));
    // Hide quick buttons if history exists
    const quick = document.getElementById('aiQuickBtns');
    if (quick) quick.style.display = 'none';
  }

  // Patch appendMsg to also save
  const _orig = window.appendMsg;
  window.appendMsg = function(text, role) {
    const el = _orig(text, role);
    try {
      const hist = JSON.parse(localStorage.getItem(KEY) || '[]');
      hist.push({ text, role });
      // Keep last 30 messages only
      if (hist.length > 30) hist.splice(0, hist.length - 30);
      localStorage.setItem(KEY, JSON.stringify(hist));
    } catch(e) {}
    return el;
  };

  // Clear history on chat close (optional — keep for now as persist)
})();

/* ---- #2 STREAMING TEXT RESPONSE ---- */
// Override appendMsg for bot messages to stream characters
const _baseAppendMsg = window.appendMsg;
window.appendMsg = function(text, role) {
  if (role !== 'bot') return _baseAppendMsg(text, role);

  const messages = document.getElementById('aiChatMessages');
  if (!messages) return;

  const div = document.createElement('div');
  div.className = 'ai-msg ai-msg-bot';
  const bubble = document.createElement('div');
  bubble.className = 'ai-msg-bubble';
  div.appendChild(bubble);
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;

  // Stream characters
  const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  // Strip HTML to get text length for timing, then write HTML
  const plain = text.replace(/\*\*(.*?)\*\*/g, '$1');
  let i = 0;
  const chars = formatted.split('');
  const SPEED = 12; // ms per char

  function stream() {
    if (i < chars.length) {
      bubble.innerHTML = chars.slice(0, i + 1).join('') + '<span class="cc">▌</span>';
      i++;
      messages.scrollTop = messages.scrollHeight;
      setTimeout(stream, SPEED);
    } else {
      bubble.innerHTML = formatted;
    }
  }
  stream();

  // Also save to history
  try {
    const KEY = 'nk-chat-history';
    const hist = JSON.parse(localStorage.getItem(KEY) || '[]');
    hist.push({ text, role });
    if (hist.length > 30) hist.splice(0, hist.length - 30);
    localStorage.setItem(KEY, JSON.stringify(hist));
  } catch(e) {}

  return div;
};

/* ---- #3 MULTILINGUAL — Tamil detection ---- */
(function initTamilDetection() {
  const TAMIL_RESPONSES = {
    greet:   `வணக்கம்! 🙏 நான் நவீன். என்னைப் பற்றி எதாவது கேளுங்கள் — திறன்கள், திட்டங்கள், அல்லது தொடர்பு விவரங்கள்.`,
    skills:  `என்னுடைய முக்கிய திறன்கள்: Node.js, Java, Python, REST APIs, LLM Engineering, GCP, Docker. AI/GenAI பகுதியில் அதிக ஆர்வம் உள்ளது.`,
    contact: `என்னை தொடர்பு கொள்ள: 📧 nk4496330@gmail.com | 📱 +91 93428 11231 | WhatsApp: wa.me/919342811231`,
    default: `நீங்கள் தமிழில் கேட்கிறீர்கள்! என்னுடைய திறன்கள், திட்டங்கள் அல்லது அனுபவங்களைப் பற்றி கேளுங்கள் 😊`,
  };

  function isTamil(msg) {
    return /[\u0B80-\u0BFF]/.test(msg); // Tamil Unicode range
  }

  const orig = window.getAIResponse;
  window.getAIResponse = function(msg) {
    if (isTamil(msg)) {
      const m = msg.toLowerCase();
      if (m.includes('வணக்கம்') || m.includes('ஹலோ') || m.includes('வரவேற்கிறேன்'))
        return TAMIL_RESPONSES.greet;
      if (m.includes('திறன்') || m.includes('தொழில்நுட்பம்'))
        return TAMIL_RESPONSES.skills;
      if (m.includes('தொடர்பு') || m.includes('மின்னஞ்சல்'))
        return TAMIL_RESPONSES.contact;
      return TAMIL_RESPONSES.default;
    }
    return orig ? orig(msg) : '';
  };
})();

/* ---- #4 CHAT EXPORT ---- */
document.getElementById('aiExportBtn')?.addEventListener('click', () => {
  const messages = document.getElementById('aiChatMessages');
  if (!messages) return;

  const lines = [];
  lines.push('=== Chat with Naveenkumar P ===');
  lines.push(`Exported: ${new Date().toLocaleString()}`);
  lines.push('Portfolio: ' + window.location.href);
  lines.push('Contact: nk4496330@gmail.com | wa.me/919342811231');
  lines.push('');
  lines.push('---');

  messages.querySelectorAll('.ai-msg').forEach(msg => {
    const isBot  = msg.classList.contains('ai-msg-bot');
    const bubble = msg.querySelector('.ai-msg-bubble');
    if (!bubble) return;
    const text = bubble.innerText.replace(/▌/g, '').trim();
    if (text) lines.push(`${isBot ? 'Naveen' : 'Visitor'}: ${text}`);
  });

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = 'chat-with-naveen.txt';
  a.click();
  URL.revokeObjectURL(a.href);
  toast('💾 Chat exported!');
});

/* ---- #5 CONTEXT MEMORY ---- */
(function initContextMemory() {
  let lastTopic = null;

  const orig = window.getAIResponse;
  window.getAIResponse = function(msg) {
    const m = msg.toLowerCase();

    // Detect topic from this message
    if (m.match(/skill|tech|stack|java|python/))        lastTopic = 'skills';
    else if (m.match(/project|build|agent|dashboard/))  lastTopic = 'projects';
    else if (m.match(/finance/))                        lastTopic = 'finance';
    else if (m.match(/experience|avasoft|intern/))      lastTopic = 'experience';

    // Context-aware follow-up
    if (lastTopic && m.match(/\b(which|that|it|this|the same|hardest|best|most|difficult|explain more|tell more|more details?|elaborate)\b/)) {
      if (lastTopic === 'projects') return `sure — out of the three, the **LLM agent** was the most challenging (I'd say 8/10 difficulty). the finance dashboard was a solid 7/10 — mostly the RBAC design. the analytics pipeline was around 5/10, more data engineering than software complexity.\n\nwant me to go deeper on any of them?`;
      if (lastTopic === 'skills')   return `happy to elaborate! my strongest areas right now are **LLM/AI engineering** and **Node.js backend**. both are what I spend most of my time on at Avasoft and in personal projects.\n\nwant to know about a specific skill or area?`;
      if (lastTopic === 'finance')  return `the finance dashboard specifically — the hardest part was getting the **JWT role-based access control** watertight across all 3 roles (Admin/Analyst/Viewer) with enforced permissions on every endpoint. SQLite query optimization for the analytics APIs was also non-trivial.\n\nit's live at **finance-dashboard-api-3zya.vercel.app** if you want to explore it.`;
      if (lastTopic === 'experience') return `the most interesting part of my Avasoft experience was building **LLM-assisted dev tooling** — it's not typical for a backend role, but that's what I pushed for. it's directly connected to the autonomous agent project.\n\nwant to know more about a specific role?`;
    }

    return orig ? orig(msg) : '';
  };
})();

/* ---- #6 MOOD RING ---- */
(function initMoodRing() {
  const ring = document.getElementById('moodRing');
  if (!ring) return;

  const orig = window.getAIResponse;
  window.getAIResponse = function(msg) {
    const m = msg.toLowerCase();
    if (m.match(/skill|tech|stack|java|python|node|react/)) ring.className = 'mood-ring mood-tech';
    else if (m.match(/project|build|agent|finance/))        ring.className = 'mood-ring mood-project';
    else if (m.match(/hire|job|opportunity|open to work/))  ring.className = 'mood-ring mood-hire';
    else if (m.match(/contact|email|phone|whatsapp/))       ring.className = 'mood-ring mood-contact';
    else                                                     ring.className = 'mood-ring mood-default';
    return orig ? orig(msg) : '';
  };
})();

/* ---- #7 TEXT-TO-SPEECH ---- */
(function initTTS() {
  const btn = document.getElementById('aiTtsBtn');
  if (!btn || !window.speechSynthesis) return;

  let speaking = false;

  btn.addEventListener('click', () => {
    const messages = document.getElementById('aiChatMessages');
    if (!messages) return;

    // Get last bot message
    const botMsgs = messages.querySelectorAll('.ai-msg-bot .ai-msg-bubble');
    if (!botMsgs.length) return;
    const last = botMsgs[botMsgs.length - 1];
    const text = last.innerText.replace(/▌/g, '').trim();
    if (!text) return;

    if (speaking) {
      speechSynthesis.cancel();
      speaking = false;
      btn.classList.remove('active');
      return;
    }

    const utt   = new SpeechSynthesisUtterance(text);
    utt.rate    = 0.92;
    utt.pitch   = 1.05;
    utt.volume  = 0.9;
    // Try to find an English voice
    const voices = speechSynthesis.getVoices();
    const pref   = voices.find(v => v.lang === 'en-IN') || voices.find(v => v.lang.startsWith('en'));
    if (pref) utt.voice = pref;

    utt.onstart = () => { speaking = true; btn.classList.add('active'); };
    utt.onend   = () => { speaking = false; btn.classList.remove('active'); };
    utt.onerror = () => { speaking = false; btn.classList.remove('active'); };

    speechSynthesis.speak(utt);
  });
})();

/* ---- #8 GENERATIVE ART PROJECT CARDS ---- */
(function initGenArtCards() {
  const configs = [
    { sel: '.project-card.featured',            colors: ['#7c6dfa','#e879f9','#b197fc'], label: 'AI' },
    { sel: '.project-card:nth-of-type(2)',       colors: ['#10b981','#22d3ee','#34d399'], label: 'FS' },
    { sel: '.project-card:nth-of-type(3)',       colors: ['#fb923c','#fbbf24','#f87171'], label: 'DA' },
  ];

  configs.forEach(({ sel, colors }) => {
    const card = document.querySelector(sel);
    if (!card) return;
    const inner = card.querySelector('.project-card-inner');
    if (!inner) return;

    const canvas = document.createElement('canvas');
    canvas.width  = 300;
    canvas.height = 80;
    canvas.style.cssText = `position:absolute;top:0;left:0;right:0;width:100%;height:80px;opacity:0.07;pointer-events:none;z-index:0;border-radius:${getComputedStyle(inner).borderRadius} ${getComputedStyle(inner).borderRadius} 0 0;`;
    inner.style.position = 'relative';
    inner.insertBefore(canvas, inner.firstChild);

    const ctx = canvas.getContext('2d');
    const pts = Array.from({length:8}, () => ({
      x: Math.random() * 300, y: Math.random() * 80,
      vx:(Math.random()-.5)*0.4, vy:(Math.random()-.5)*0.4,
    }));

    function draw() {
      ctx.clearRect(0,0,300,80);
      for (let i=0;i<pts.length;i++) {
        for (let j=i+1;j<pts.length;j++) {
          const dx = pts[i].x-pts[j].x, dy = pts[i].y-pts[j].y;
          const d  = Math.sqrt(dx*dx+dy*dy);
          if (d<120) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x,pts[i].y);
            ctx.lineTo(pts[j].x,pts[j].y);
            ctx.strokeStyle = colors[0];
            ctx.lineWidth = (1-d/120)*2;
            ctx.stroke();
          }
        }
      }
      pts.forEach((p,i)=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>300) p.vx*=-1;
        if(p.y<0||p.y>80)  p.vy*=-1;
        ctx.beginPath();
        ctx.arc(p.x,p.y,3,0,Math.PI*2);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
      });
    }

    // Only animate when card is visible
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setInterval(draw, 50);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(card);
  });
})();

/* ---- #9 SKILL PULSE ON CHAT MENTION ---- */
(function initSkillPulse() {
  const SKILL_MAP = {
    'node':       '.skill-tag:contains',
    'java':       'Java',
    'python':     'Python',
    'react':      'React',
    'docker':     'Docker',
    'kubernetes': 'Kubernetes',
    'gcp':        'GCP',
    'llm':        'LLM API Integration',
  };

  const orig = window.getAIResponse;
  window.getAIResponse = function(msg) {
    const m = msg.toLowerCase();
    // Find and pulse matching skill tags
    document.querySelectorAll('.skill-tag').forEach(tag => {
      const txt = tag.textContent.toLowerCase();
      const hit = Object.keys(SKILL_MAP).some(k => m.includes(k) && txt.includes(k));
      if (hit) {
        tag.style.transition = 'box-shadow 0.3s, border-color 0.3s, color 0.3s';
        tag.style.boxShadow  = '0 0 14px var(--accent)';
        tag.style.borderColor= 'var(--accent)';
        tag.style.color      = 'var(--text)';
        setTimeout(() => {
          tag.style.boxShadow  = '';
          tag.style.borderColor= '';
          tag.style.color      = '';
        }, 2500);
      }
    });
    return orig ? orig(msg) : '';
  };
})();

/* ---- #10 ADMIN ANALYTICS DASHBOARD ---- */
(function initAdminDashboard() {
  const modal    = document.getElementById('adminModal');
  const closeBtn = document.getElementById('adminClose');
  const grid     = document.getElementById('adminGrid');
  if (!modal || !grid) return;

  // Secret key combo: Ctrl+Shift+A
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      openAdmin();
    }
  });

  closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

  function openAdmin() {
    const visits   = parseInt(localStorage.getItem('nk-visits') || 1);
    const chatLog  = (() => { try { return JSON.parse(localStorage.getItem('nk-chat-history') || '[]'); } catch(e) { return []; } })();
    const chatMsgs = chatLog.filter(m => m.role === 'user').length;
    const palette  = localStorage.getItem('nk-palette') || 'purple';

    // Count topic frequency
    const topics = { skills:0, projects:0, experience:0, contact:0, finance:0, other:0 };
    chatLog.filter(m => m.role === 'user').forEach(m => {
      const t = m.text.toLowerCase();
      if (t.match(/skill|tech|java|python/))   topics.skills++;
      else if (t.match(/project|agent/))        topics.projects++;
      else if (t.match(/experience|avasoft/))   topics.experience++;
      else if (t.match(/contact|email|phone/))  topics.contact++;
      else if (t.match(/finance/))              topics.finance++;
      else                                       topics.other++;
    });

    grid.innerHTML = `
      <div class="admin-stat-card"><span class="admin-stat-num">${visits}</span><span class="admin-stat-label">Total Visits</span></div>
      <div class="admin-stat-card"><span class="admin-stat-num">${chatMsgs}</span><span class="admin-stat-label">Chat Messages</span></div>
      <div class="admin-stat-card"><span class="admin-stat-num">${palette}</span><span class="admin-stat-label">Active Theme</span></div>
      <div class="admin-stat-card"><span class="admin-stat-num">${chatLog.length}</span><span class="admin-stat-label">Total Messages</span></div>
    `;

    const maxVal = Math.max(...Object.values(topics), 1);
    const topicHTML = Object.entries(topics).map(([k,v]) => `
      <div class="admin-bar-item">
        <span class="admin-bar-label">${k}</span>
        <div class="admin-bar-track"><div class="admin-bar-fill" style="width:${(v/maxVal)*100}%"></div></div>
        <span style="font-size:0.7rem;color:var(--text3);font-family:var(--mono);margin-left:6px">${v}</span>
      </div>`).join('');

    grid.innerHTML += `<div class="admin-top-section" style="grid-column:1/-1"><h4>Top Questions by Topic</h4>${topicHTML}</div>`;
    modal.classList.add('open');
  }
})();

/* ---- #11 INTERVIEW SIMULATOR ---- */
(function initInterviewSimulator() {
  const modal    = document.getElementById('interviewModal');
  const closeBtn = document.getElementById('interviewClose');
  const exitBtn  = document.getElementById('interviewExit');
  const nextBtn  = document.getElementById('interviewNext');
  const body     = document.getElementById('interviewBody');
  const titleEl  = document.getElementById('interviewTitle');
  if (!modal) return;

  const QA = [
    { round:'System Design', q:'Explain the architecture of your autonomous LLM software engineering agent. How does the validation loop work?', a:'The agent follows a pipeline: task input → prompt engineering → LLM code generation → syntax/logic validation → if valid: Git commit + PR, if invalid: reformat prompt → retry (max 3 times). The validation uses static analysis and test running to catch errors before committing. Each retry includes the previous error context in the prompt so the model learns from its own mistakes within the session.' },
    { round:'Backend Design', q:'How did you implement role-based access control in the Finance Dashboard? Walk me through the middleware.', a:'JWT-based RBAC with three roles: admin, analyst, viewer. On login, the token payload includes the role. A middleware function checks the decoded role against a permissions map for each route. Admin gets full CRUD, analyst gets read + analytics, viewer gets read-only on transactions. Violations return 403. Soft delete is also role-gated — only admin can delete.' },
    { round:'LLM Engineering', q:'What prompt engineering strategies did you use to get reliable code generation from LLMs?', a:'Three main strategies: 1) Few-shot examples in the system prompt showing input task → expected code output format. 2) Structured output constraints — asking the model to return JSON with a "code" field, not free text. 3) Error-injection prompting — when validation fails, I include the error message and broken code in the next prompt, effectively teaching the model what went wrong. This dramatically improved retry success rates.' },
    { round:'Database', q:'Why did you choose SQLite for the Finance Dashboard instead of PostgreSQL or MySQL?', a:'For a portfolio project with predictable load and no concurrent heavy writes, SQLite is perfectly adequate and removes the operational overhead of running a database server. The Finance Dashboard is deployed on Render\'s free tier — SQLite keeps the stack simple and the latency low. In a production fintech context I would use PostgreSQL for better concurrency, transactions, and indexing on large datasets.' },
    { round:'Cloud & DevOps', q:'Walk me through your CI/CD experience at Avasoft. What does a typical deployment pipeline look like?', a:'At Avasoft the pipeline runs through Jenkins: code push triggers a pipeline that runs unit tests (JUnit), does a Docker build, pushes the image to a registry, then Kubernetes handles the rollout with rolling updates so there\'s zero downtime. GitHub Actions handles the lighter workflows like PR checks and linting. I worked on the deployment configs and release scripts but the core infrastructure was already set up when I joined.' },
    { round:'Problem Solving', q:'If the LLM agent generates incorrect code three times in a row, how would you handle that gracefully?', a:'After three failed retries, the agent should: 1) Log the task and all three failed attempts with their errors for human review. 2) Fall back to a "partial solution" mode — return the closest valid snippet with a clear comment marking it as unverified. 3) Notify the user that manual review is needed rather than silently failing. The key principle is fail loudly and informatively rather than quietly produce broken code.' },
  ];

  let idx = 0;

  window.startInterview = function() {
    idx = 0;
    modal.classList.add('open');
    showQuestion(idx);
    // Close chatbot
    document.getElementById('aiChatPanel')?.classList.remove('open');
  };

  function showQuestion(i) {
    const qa = QA[i % QA.length];
    if (titleEl) titleEl.textContent = qa.round + ' Round';
    body.innerHTML = `
      <div class="interview-badge">${i+1} / ${QA.length}</div>
      <div class="interview-q">Q: ${qa.q}</div>
      <div class="interview-a" id="iAnswer" style="opacity:0;transition:opacity 0.5s"></div>`;
    // Type answer after 1.5s
    setTimeout(() => {
      const ans = document.getElementById('iAnswer');
      if (ans) {
        ans.style.opacity = '1';
        const formatted = qa.a.replace(/\b(1\)|2\)|3\))/g, '<br>$1');
        ans.innerHTML = `<strong>Naveen's answer:</strong><br><br>${formatted}`;
      }
    }, 1500);
    if (nextBtn) nextBtn.textContent = (i + 1 >= QA.length) ? 'Restart' : 'Next Question';
    nextBtn?.querySelector('i') && (nextBtn.querySelector('i').className = (i+1>=QA.length)?'fas fa-redo':'fas fa-arrow-right');
  }

  nextBtn?.addEventListener('click', () => { idx = (idx+1) % QA.length; showQuestion(idx); });
  closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
  exitBtn?.addEventListener('click',  () => modal.classList.remove('open'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
})();

/* ---- #12 PERSONALIZED GREETING ---- */
(function initPersonalizedGreeting() {
  const KEY = 'nk-visitor-name';
  const saved = localStorage.getItem(KEY);
  const greetEl = document.getElementById('greetMsg');

  if (saved && greetEl) {
    greetEl.textContent = `hey ${saved}! 👋 welcome back. ask me anything — projects, skills, experience, how to reach me.`;
    return;
  }

  // Ask for name after first open
  const btn = document.getElementById('aiWidgetBtn');
  let asked = false;

  btn?.addEventListener('click', () => {
    if (asked || saved) return;
    const panel = document.getElementById('aiChatPanel');
    if (!panel?.classList.contains('open')) return;
    asked = true;

    setTimeout(() => {
      appendMsg(`by the way — what's your name? I'll remember it 😊`, 'bot');
      // Listen for next user message as the name
      const orig = window.sendAIMessage;
      let nameCapture = true;
      window.sendAIMessage = function() {
        if (nameCapture) {
          const input = document.getElementById('aiInput');
          const val   = input?.value?.trim();
          if (val && val.length < 30 && !val.includes('?') && !val.toLowerCase().match(/^(hi|hello|hey|skip|no|never mind)/)) {
            nameCapture = false;
            const name = val.charAt(0).toUpperCase() + val.slice(1);
            localStorage.setItem(KEY, name);
            appendMsg(val, 'user');
            if (input) input.value = '';
            setTimeout(() => appendMsg(`nice to meet you, ${name}! 👋 what do you want to know?`, 'bot'), 700);
            window.sendAIMessage = orig;
            return;
          }
          nameCapture = false;
          window.sendAIMessage = orig;
        }
        orig && orig();
      };
    }, 2200);
  });
})();

/* ---- #13 API STATUS CHECKER ---- */
(function initAPIStatus() {
  const dot  = document.getElementById('apiStatusDot');
  const text = document.getElementById('apiStatusText');
  const widget = document.getElementById('apiStatusWidget');
  if (!dot || !text) return;

  // Only show near projects section
  const projectsSec = document.getElementById('projects');
  if (projectsSec) {
    const obs = new IntersectionObserver(entries => {
      widget.style.opacity = entries[0].isIntersecting ? '1' : '0';
    }, { threshold: 0.2 });
    obs.observe(projectsSec);
    widget.style.opacity = '0';
    widget.style.transition = 'opacity 0.4s';
  }

  dot.className = 'api-status-dot checking';
  text.textContent = 'Checking demo...';

  // Fetch with timeout
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  fetch('https://finance-dashboard-api-g0ja.onrender.com/api-docs', {
    method: 'HEAD', mode: 'no-cors', signal: controller.signal
  })
  .then(() => {
    clearTimeout(timer);
    dot.className = 'api-status-dot up';
    text.textContent = 'Finance Demo: Live ✓';
  })
  .catch(() => {
    dot.className = 'api-status-dot down';
    text.textContent = 'Finance Demo: Offline';
  });
})();

/* ---- #14 CODE DIFF VIEWER ---- */
(function initCodeDiff() {
  const before = document.getElementById('diffBefore');
  const after  = document.getElementById('diffAfter');
  if (!before || !after) return;

  const BEFORE_LINES = [
    { type:'ctx',    text:'function processTask(task) {' },
    { type:'remove', text:'  const code = llm.generate(task)' },
    { type:'remove', text:'  git.commit(code)  // no validation!' },
    { type:'ctx',    text:'}' },
  ];
  const AFTER_LINES = [
    { type:'ctx', text:'async function processTask(task) {' },
    { type:'add', text:'  const code = await llm.generate(task);' },
    { type:'add', text:'  const ok = await validate(code);' },
    { type:'add', text:'  if (ok) await git.commitAndPR(code);' },
    { type:'add', text:'  else return retry(task); // safe ✓' },
    { type:'ctx', text:'}' },
  ];

  function renderDiff(el, lines) {
    el.innerHTML = '';
    lines.forEach((l, i) => {
      setTimeout(() => {
        const span = document.createElement('span');
        span.className = `diff-line-${l.type}`;
        span.textContent = l.text + '\n';
        el.appendChild(span);
      }, i * 180);
    });
  }

  const wrap = document.getElementById('codeDiffWrap');
  if (!wrap) return;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      renderDiff(before, BEFORE_LINES);
      setTimeout(() => renderDiff(after, AFTER_LINES), 400);
      obs.disconnect();
    }
  }, { threshold: 0.5 });
  obs.observe(wrap);
})();

/* ---- #15 TECH STACK COMPATIBILITY CHECKER ---- */
(function initStackChecker() {
  const MY_STACK = ['node','nodejs','express','java','python','react','sql','mysql','sqlite',
    'gcp','docker','kubernetes','git','jenkins','postman','llm','rest','api','javascript'];

  const orig = window.getAIResponse;
  window.getAIResponse = function(msg) {
    const m = msg.toLowerCase();
    if (m.match(/\b(my stack|i use|i know|i work with|we use|our stack|compatible|overlap|match|work together)\b/)) {
      const mentioned = MY_STACK.filter(s => m.includes(s));
      if (mentioned.length >= 2) {
        const pct = Math.round((mentioned.length / MY_STACK.length) * 100);
        const extra = MY_STACK.filter(s => !mentioned.includes(s)).slice(0,4).join(', ');
        return `nice stack! here's the overlap:\n\n✅ **We both use:** ${mentioned.join(', ')}\n📊 **Overlap: ~${pct}%**\n\n${pct >= 50 ? `we could definitely build something together 🚀 I'd bring ${extra} to the table.` : `different strengths — that's actually great for a team. I'd complement your stack with ${extra}.`}\n\nwant to chat about what we could build together? → **nk4496330@gmail.com**`;
      }
    }
    return orig ? orig(msg) : '';
  };
})();

/* ============================================================
   18 MORE FEATURES — JS ROUND 4
   ============================================================ */

/* ---- #9 CINEMATIC INTRO ---- */
(function initCinematicIntro() {
  const intro  = document.getElementById('cinematicIntro');
  const tagEl  = document.getElementById('ciTagline');
  const skipEl = document.getElementById('ciSkip');
  if (!intro) return;

  const SHOWN_KEY = 'nk-intro-shown';
  if (sessionStorage.getItem(SHOWN_KEY)) {
    intro.style.display = 'none';
    return;
  }

  // Type tagline
  const tagline = 'Software Engineer · LLM Builder · Backend Dev';
  let i = 0;
  const typeTag = setInterval(() => {
    if (i < tagline.length) { tagEl.textContent = tagline.slice(0,++i) + '|'; }
    else { tagEl.textContent = tagline; clearInterval(typeTag); }
  }, 40);

  function dismiss() {
    intro.style.transition = 'opacity 0.5s';
    intro.style.opacity = '0';
    setTimeout(() => { intro.style.display = 'none'; }, 500);
    sessionStorage.setItem(SHOWN_KEY, '1');
  }

  // Auto-dismiss after 3s
  setTimeout(dismiss, 3000);
  skipEl?.addEventListener('click', dismiss);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') dismiss(); }, { once: true });
})();

/* ---- #14 TIME-BASED GREETING ---- */
(function initTimeGreeting() {
  const el = document.querySelector('.hero-greeting');
  if (!el) return;
  const hour = new Date(new Date().toLocaleString('en-US', { timeZone:'Asia/Kolkata' })).getHours();
  let greeting = "Hi there, I'm";
  if (hour >= 5  && hour < 12) greeting = "Good morning, I'm";
  if (hour >= 12 && hour < 17) greeting = "Good afternoon, I'm";
  if (hour >= 17 && hour < 21) greeting = "Good evening, I'm";
  if (hour >= 21 || hour < 5)  greeting = "Working late? Hi, I'm";
  el.textContent = greeting;
})();

/* ---- #10 CURSOR TRAIL ---- */
(function initCursorTrail() {
  const COLORS = ['#7c6dfa','#b197fc','#e879f9','#22d3ee'];
  let lastX = 0, lastY = 0, throttle = 0;

  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - throttle < 40) return;
    throttle = now;

    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    if (dist < 8) return;
    lastX = e.clientX; lastY = e.clientY;

    const spark = document.createElement('div');
    spark.className = 'cursor-spark';
    spark.style.left  = e.clientX + 'px';
    spark.style.top   = e.clientY + 'px';
    spark.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    spark.style.width  = spark.style.height = (3 + Math.random() * 4) + 'px';
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 500);
  });
})();

/* ---- #13 OFFLINE BANNER ---- */
(function initOfflineBanner() {
  const banner = document.getElementById('offlineBanner');
  if (!banner) return;
  window.addEventListener('offline', () => { banner.style.display = 'flex'; });
  window.addEventListener('online',  () => { banner.style.display = 'none';  });
})();

/* ---- #4 PROACTIVE PING ---- */
(function initProactivePing() {
  const ping = document.getElementById('proactivePing');
  if (!ping) return;

  let shown = sessionStorage.getItem('nk-ping-shown');
  if (shown) return;

  let idleTimer;
  function resetIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      const panel = document.getElementById('aiChatPanel');
      if (!panel?.classList.contains('open')) {
        ping.style.display = 'flex';
        sessionStorage.setItem('nk-ping-shown','1');
      }
    }, 30000); // 30 seconds idle
  }

  ['mousemove','scroll','keydown','click'].forEach(evt =>
    window.addEventListener(evt, resetIdle, { passive: true })
  );
  resetIdle();
})();

/* ---- #6 HEADING CHARACTER REVEAL ---- */
(function initHeadingReveal() {
  document.querySelectorAll('.section-title').forEach(title => {
    const text = title.childNodes;
    // Only process direct text, not buttons added by copy-link feature
    const btn  = title.querySelector('.copy-section-link');
    const raw  = title.textContent.replace(btn?.textContent || '', '').trim();
    if (!raw || raw.length > 40) return;

    // Replace text node with char spans
    let html = '';
    raw.split('').forEach((c, i) => {
      html += `<span class="char" style="transition-delay:${i*0.03}s">${c === ' ' ? '&nbsp;' : c}</span>`;
    });
    // Preserve copy-link button
    title.innerHTML = html;
    if (btn) title.appendChild(btn);

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        title.querySelectorAll('.char').forEach(c => c.classList.add('visible'));
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(title);
  });
})();

/* ---- #7 PROJECT CARD FLIP ---- */
(function initCardFlip() {
  const flipData = [
    {
      title: 'Autonomous LLM Agent',
      desc:  'An AI agent that generates, validates & commits code autonomously.',
      link:  'https://github.com/NSP101',
      linkLabel: 'GitHub',
      tech:  'Node.js · LLM APIs · Git',
    },
    {
      title: 'Finance Dashboard',
      desc:  'JWT-based RBAC, REST APIs, React + Recharts. Live on Vercel.',
      link:  'https://finance-dashboard-api-3zya.vercel.app',
      linkLabel: 'Live Demo',
      tech:  'Node.js · Express · SQLite · React',
    },
    {
      title: 'COVID-19 / Layoffs Analytics',
      desc:  'Data pipeline with Python, Snowflake ingestion & Power BI dashboards.',
      link:  'https://github.com/NSP101',
      linkLabel: 'GitHub',
      tech:  'Python · Pandas · Snowflake · Power BI',
    },
  ];

  document.querySelectorAll('.project-card').forEach((card, i) => {
    const inner = card.querySelector('.project-card-inner');
    if (!inner || !flipData[i]) return;

    const d = flipData[i];
    // Add hint
    const hint = document.createElement('p');
    hint.className = 'flip-hint';
    hint.textContent = 'double-click to flip';
    inner.appendChild(hint);

    // Create back face
    const back = document.createElement('div');
    back.className = 'project-card-back';
    back.innerHTML = `
      <h4 style="font-size:1rem;font-weight:700;color:var(--text)">${d.title}</h4>
      <p style="font-size:0.85rem;color:var(--text2);line-height:1.65;flex:1">${d.desc}</p>
      <p style="font-size:0.72rem;color:var(--text3);font-family:var(--mono)">${d.tech}</p>
      <a href="${d.link}" target="_blank" rel="noopener" class="btn btn-primary" style="font-size:0.8rem;padding:9px 20px;width:100%;justify-content:center">
        <i class="fas fa-external-link-alt"></i> ${d.linkLabel}
      </a>
      <p style="font-size:0.68rem;color:var(--text3);text-align:center;font-style:italic;margin-top:4px">double-click to flip back</p>
    `;
    inner.appendChild(back);
    inner.style.position = 'relative';

    card.addEventListener('dblclick', () => inner.classList.toggle('flipped'));
  });
})();

/* ---- #1 CHAT REACTION BUTTONS ---- */
(function initReactions() {
  const orig = window.appendMsg;
  window.appendMsg = function(text, role) {
    const el = orig(text, role);
    if (role !== 'bot' || !el) return el;

    const row = document.createElement('div');
    row.className = 'msg-reactions';

    const thumbUp = document.createElement('button');
    thumbUp.className = 'reaction-btn';
    thumbUp.textContent = '👍';
    thumbUp.title = 'Helpful';

    const thumbDown = document.createElement('button');
    thumbDown.className = 'reaction-btn';
    thumbDown.textContent = '👎';
    thumbDown.title = 'Rephrase';

    thumbUp.addEventListener('click', function() {
      thumbUp.classList.toggle('active');
      thumbDown.classList.remove('active');
    });

    thumbDown.addEventListener('click', function() {
      thumbDown.classList.add('active');
      thumbUp.classList.remove('active');
      // Auto-rephrase
      setTimeout(() => {
        window.appendMsg(`let me try that differently — ${text.split('.')[0]}. want me to explain further or ask something specific?`, 'bot');
      }, 600);
    });

    row.appendChild(thumbUp);
    row.appendChild(thumbDown);
    el.appendChild(row);
    return el;
  };
})();

/* ---- #2 SMART TYPING SUGGESTIONS ---- */
(function initTypingSuggestions() {
  const input   = document.getElementById('aiInput');
  const sugBox  = document.getElementById('aiSuggestions');
  if (!input || !sugBox) return;

  const SUGGESTIONS = [
    { icon:'fas fa-code',        text:'what are your skills?' },
    { icon:'fas fa-rocket',      text:'tell me about your projects' },
    { icon:'fas fa-briefcase',   text:'what is your work experience?' },
    { icon:'fas fa-envelope',    text:'how can I contact you?' },
    { icon:'fas fa-robot',       text:'tell me about the LLM agent' },
    { icon:'fas fa-chart-line',  text:'tell me about the finance dashboard' },
    { icon:'fas fa-user',        text:'tell me about yourself' },
    { icon:'fas fa-graduation-cap','text':'where did you study?' },
    { icon:'fas fa-dollar-sign', text:'what is your salary expectation?' },
    { icon:'fas fa-language',    text:'what languages do you speak?' },
  ];

  input.addEventListener('input', () => {
    const val = input.value.trim().toLowerCase();
    if (!val || val.length < 2) { sugBox.classList.remove('show'); return; }

    const filtered = SUGGESTIONS.filter(s => s.text.toLowerCase().includes(val)).slice(0, 3);
    if (!filtered.length) { sugBox.classList.remove('show'); return; }

    sugBox.innerHTML = filtered.map(s =>
      `<div class="ai-suggestion-item" data-val="${s.text}">
        <i class="${s.icon}"></i>${s.text}
      </div>`
    ).join('');

    sugBox.querySelectorAll('.ai-suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        input.value = item.dataset.val;
        sugBox.classList.remove('show');
        sendAIMessage();
      });
    });

    sugBox.classList.add('show');
  });

  // Hide on blur
  input.addEventListener('blur', () => setTimeout(() => sugBox.classList.remove('show'), 150));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') sugBox.classList.remove('show'); });
})();

/* ---- #3 CHAT CLEAR BUTTON ---- */
document.getElementById('aiClearBtn')?.addEventListener('click', () => {
  const messages = document.getElementById('aiChatMessages');
  if (!messages) return;
  if (!confirm('Clear chat history?')) return;
  messages.innerHTML = '<div class="ai-msg ai-msg-bot"><div class="ai-msg-bubble">hey 👋 I\'m Naveen. ask me anything — my projects, skills, experience, or how to get in touch.</div></div>';
  localStorage.removeItem('nk-chat-history');
  const quick = document.getElementById('aiQuickBtns');
  if (quick) quick.style.display = '';
  toast('🗑️ Chat cleared');
});

/* ---- #5 CHAT RATING ---- */
(function initChatRating() {
  const KEY = 'nk-chat-count';
  const RATING_KEY = 'nk-chat-rating';

  if (localStorage.getItem(RATING_KEY)) return; // already rated

  const origSend = window.sendAIMessage;
  window.sendAIMessage = function() {
    origSend && origSend();
    const count = parseInt(localStorage.getItem(KEY) || '0') + 1;
    localStorage.setItem(KEY, count);

    if (count === 5) showRatingPrompt();
  };

  function showRatingPrompt() {
    const panel = document.getElementById('aiChatPanel');
    if (!panel) return;

    const row = document.createElement('div');
    row.className = 'chat-rating-row';
    row.innerHTML = `
      <span class="chat-rating-label">How's this chat? ⭐</span>
      <div class="chat-stars">
        ${[1,2,3,4,5].map(n => `<span class="chat-star" data-rating="${n}">⭐</span>`).join('')}
      </div>
    `;
    panel.insertBefore(row, panel.querySelector('.ai-chat-input-row'));

    row.querySelectorAll('.chat-star').forEach(star => {
      star.addEventListener('click', () => {
        const rating = star.dataset.rating;
        localStorage.setItem(RATING_KEY, rating);
        row.innerHTML = `<span class="chat-rating-label">Thanks for the ${rating}⭐ rating! 😄</span>`;
        setTimeout(() => row.remove(), 2000);
        toast(`⭐ ${rating}/5 — thanks!`);
      });
      star.addEventListener('mouseenter', () => {
        const n = parseInt(star.dataset.rating);
        row.querySelectorAll('.chat-star').forEach((s,i) => s.classList.toggle('lit', i < n));
      });
    });
    row.addEventListener('mouseleave', () => row.querySelectorAll('.chat-star').forEach(s => s.classList.remove('lit')));
  }
})();

/* ---- #11 YOU MIGHT LIKE ---- */
(function initYouMightLike() {
  const map = [
    {
      sectionId: 'about',
      links: [
        { icon:'fas fa-code', label:'See my skills', href:'#skills' },
        { icon:'fas fa-rocket', label:'View projects', href:'#projects' },
      ]
    },
    {
      sectionId: 'skills',
      links: [
        { icon:'fas fa-briefcase', label:'My experience', href:'#experience' },
        { icon:'fas fa-trophy', label:'Achievements', href:'#achievements' },
      ]
    },
    {
      sectionId: 'experience',
      links: [
        { icon:'fas fa-rocket', label:'See projects', href:'#projects' },
        { icon:'fas fa-envelope', label:'Get in touch', href:'#contact' },
      ]
    },
    {
      sectionId: 'projects',
      links: [
        { icon:'fas fa-user', label:'About me', href:'#about' },
        { icon:'fas fa-envelope', label:'Let\'s connect', href:'#contact' },
      ]
    },
  ];

  map.forEach(({ sectionId, links }) => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const container = section.querySelector('.container');
    if (!container) return;

    const yml = document.createElement('div');
    yml.className = 'you-might-like';
    yml.innerHTML = `<span class="yml-label">✨ You might like</span>
      <div class="yml-chips">
        ${links.map(l => `<a href="${l.href}" class="yml-chip"><i class="${l.icon}"></i>${l.label}</a>`).join('')}
      </div>`;
    container.appendChild(yml);
  });
})();

/* ---- #15 HOT SKILL BADGE WITH FLICKER ---- */
(function initHotBadge() {
  document.querySelectorAll('.skill-tag.hot[data-hot]').forEach(tag => {
    const emoji = document.createElement('span');
    emoji.className = 'hot-emoji';
    emoji.textContent = tag.dataset.hot;
    tag.style.paddingRight = '18px';
    tag.appendChild(emoji);
    // Add tooltip
    tag.title = 'Trending skill in 2025 job market 🔥';
  });
})();

/* ---- #16 LINKEDIN PREVIEW TOGGLE ---- */
function toggleLinkedIn() {
  const card = document.getElementById('liPreviewCard');
  const btn  = document.getElementById('liPreviewTrigger');
  if (!card) return;
  const shown = card.style.display !== 'none';
  card.style.display = shown ? 'none' : 'block';
  if (btn) btn.innerHTML = shown
    ? '<i class="fab fa-linkedin"></i> Preview LinkedIn Activity'
    : '<i class="fas fa-chevron-up"></i> Hide';
}


