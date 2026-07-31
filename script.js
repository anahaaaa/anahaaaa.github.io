/* ============ DRAGGABLE CHAT WIDGET ============ */
function makeDraggable(handle, target, { onClick } = {}) {
  let dragging = false;
  let moved = false;
  let startX, startY, startLeft, startTop;

  function toLeftTop(el) {
    const rect = el.getBoundingClientRect();
    el.style.left = rect.left + 'px';
    el.style.top = rect.top + 'px';
    el.style.right = 'auto';
    el.style.bottom = 'auto';
  }

  function onDown(e) {
    const point = e.touches ? e.touches[0] : e;
    dragging = true;
    moved = false;
    toLeftTop(target);
    startX = point.clientX;
    startY = point.clientY;
    startLeft = parseFloat(target.style.left);
    startTop = parseFloat(target.style.top);
    handle.classList.add('dragging');
    e.preventDefault();
  }

  function onMove(e) {
    if (!dragging) return;
    const point = e.touches ? e.touches[0] : e;
    const dx = point.clientX - startX;
    const dy = point.clientY - startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;

    let newLeft = startLeft + dx;
    let newTop = startTop + dy;

    const maxLeft = window.innerWidth - target.offsetWidth - 8;
    const maxTop = window.innerHeight - target.offsetHeight - 8;
    newLeft = Math.min(Math.max(8, newLeft), Math.max(8, maxLeft));
    newTop = Math.min(Math.max(8, newTop), Math.max(8, maxTop));

    target.style.left = newLeft + 'px';
    target.style.top = newTop + 'px';
  }

  function onUp() {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('dragging');
    if (!moved && onClick) onClick();
  }

  handle.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  handle.addEventListener('touchstart', onDown, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onUp);
}

/* ============ THEME TOGGLE ============ */
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
}
applyTheme('dark');

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ============ DYNAMIC CURSOR (dot + trailing ring) ============ */
(function initCustomCursor() {
  const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!supportsFinePointer || reducedMotion) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  document.body.classList.add('custom-cursor');

  const HOVER_SELECTOR = [
    'a', 'button', 'input',
    '.card-link', '.feature-card', '.feature-arrow', '.feature-dot',
    '.proj-grid-card', '.stack-orb',
    '.stack-dropdown-btn', '.stack-dropdown-list li',
    '.tab-list-item',
    '.log-row-main', '.tech-badge', '.bot-launcher-wrap',
    '.bot-chip', '#botSend'
  ].join(', ');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    document.body.classList.add('cursor-active');
  });

  document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
  document.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));

  document.addEventListener('mousedown', () => ring.classList.add('cursor-press'));
  document.addEventListener('mouseup', () => ring.classList.remove('cursor-press'));

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(HOVER_SELECTOR)) {
      dot.classList.add('cursor-hover');
      ring.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    const stillInside = e.target.closest(HOVER_SELECTOR);
    const movingInto = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(HOVER_SELECTOR);
    if (stillInside && !movingInto) {
      dot.classList.remove('cursor-hover');
      ring.classList.remove('cursor-hover');
    }
  });

  function tick() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* ==========================================================
   EDUCATION & EXPERIENCE — tabbed sidebar panels
   ========================================================== */
const EDUCATION_ITEMS = [
  {
    tabLabel: 'M.Tech',
    titlePlain: 'M.Tech, CS & Engineering — ',
    titleAccent: 'Data Science & AI',
    date: 'AUG 2024 – APR 2026',
    meta: 'Cochin University of Science and Technology (CUSAT), Kochi, Kerala · GPA 8.8/10',
    points: []
  },
  {
    tabLabel: 'B.Tech',
    titlePlain: 'B.Tech, ',
    titleAccent: 'Computer Science & Engineering',
    date: 'NOV 2020 – JUN 2024',
    meta: 'Government Engineering College, Idukki, Kerala · GPA 8.04/10',
    points: []
  }
];

const EXPERIENCE_ITEMS = [
  {
    tabLabel: 'IIT Madras',
    titlePlain: 'AI/ML Research Intern @ ',
    titleAccent: 'IIT Madras',
    date: 'DEC 2025 – MAY 2026',
    meta: '',
    points: [
      "Worked on the research project \"Identification of Optimal Signal Representation for Bearing Fault Diagnosis Using Transfer Learning.\"",
      "Investigated optimal vibration signal representations for bearing fault diagnosis.",
      "Developed deep learning models for bearing fault classification using PyTorch.",
      "Evaluated transfer learning performance across multiple industrial bearing datasets."
    ]
  }
];

function initTabPanel({ items, listId, detailId }) {
  const listEl = document.getElementById(listId);
  const detailEl = document.getElementById(detailId);
  if (!listEl || !detailEl) return;

  listEl.innerHTML = items.map((item, i) =>
    `<div class="tab-list-item ${i === 0 ? 'active' : ''}" data-i="${i}">${item.tabLabel}</div>`
  ).join('');

  function renderDetail(item) {
    detailEl.classList.remove('tab-detail');
    void detailEl.offsetWidth;
    detailEl.classList.add('tab-detail');

    detailEl.innerHTML = `
      <h3 class="tab-detail-title">${item.titlePlain}<span class="accent">${item.titleAccent}</span></h3>
      <span class="tab-detail-date">${item.date}</span>
      ${item.meta ? `<p class="tab-detail-meta">${item.meta}</p>` : ''}
      ${item.points.length ? `
        <ul class="tab-detail-points">
          ${item.points.map(p => `<li>${p}</li>`).join('')}
        </ul>` : ''}
    `;
  }

  listEl.querySelectorAll('.tab-list-item').forEach(tab => {
    tab.addEventListener('click', () => {
      listEl.querySelectorAll('.tab-list-item').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderDetail(items[Number(tab.dataset.i)]);
    });
  });

  renderDetail(items[0]);
}

initTabPanel({ items: EDUCATION_ITEMS, listId: 'eduTabList', detailId: 'eduDetail' });
initTabPanel({ items: EXPERIENCE_ITEMS, listId: 'expTabList', detailId: 'expDetail' });



/* ==========================================================
   ARTICLES — draggable card deck
   Replace tag/title/excerpt/link with your real Medium posts.
   ========================================================== */
const ARTICLES = [
  {
    tag: 'ML Systems',
    title: 'Diagnosing Bearing Faults with 1D ResNets',
    excerpt: 'How a custom ResNet1D pushed past 99% accuracy on the CWRU benchmark, and what actually moved the needle: representation choice over architecture size.',
    readTime: '6 min read',
    link: 'https://medium.com/@YOUR_MEDIUM'
  },
  {
    tag: 'Backend',
    title: 'Semantic Search Without the Overkill',
    excerpt: 'Wiring Qdrant into a FastAPI service for candidate retrieval, and the tradeoffs that mattered more than picking the "best" vector DB.',
    readTime: '5 min read',
    link: 'https://medium.com/@YOUR_MEDIUM'
  },
  {
    tag: 'RAG',
    title: 'RAG Pipelines That Survive Real Documents',
    excerpt: 'Chunking strategies, sliding windows, and the token-limit failure modes that only show up once you feed a pipeline a 50-page PDF.',
    readTime: '7 min read',
    link: 'https://medium.com/@YOUR_MEDIUM'
  },
  {
    tag: 'Open Source',
    title: 'Testing CLI Tools Nobody Else Will Test',
    excerpt: 'Notes from building Pytest coverage for an MCP command-line tool, and why CLI testing gets skipped even on projects that care about quality.',
    readTime: '4 min read',
    link: 'https://medium.com/@YOUR_MEDIUM'
  }
];

function initArticleDeck() {
  const deckEl = document.getElementById('articleDeck');
  const dotsEl = document.getElementById('deckDots');
  const prevBtn = document.getElementById('deckPrev');
  const nextBtn = document.getElementById('deckNext');
  if (!deckEl) return;

  let order = ARTICLES.map((_, i) => i);
  const cardEls = ARTICLES.map((a, i) => {
    const card = document.createElement('article');
    card.className = 'article-card';
    card.dataset.i = i;
    card.innerHTML = `
      <span class="article-card-tag">${a.tag}</span>
      <h3>${a.title}</h3>
      <p>${a.excerpt}</p>
      <div class="article-card-meta">
        <span>${a.readTime}</span>
        <a href="${a.link}" target="_blank" rel="noopener">Read on Medium →</a>
      </div>`;
    deckEl.appendChild(card);
    return card;
  });

  dotsEl.innerHTML = ARTICLES.map((_, i) =>
    `<span class="deck-dot" data-i="${i}"></span>`
  ).join('');
  const dotEls = Array.from(dotsEl.querySelectorAll('.deck-dot'));

  function layout() {
    order.forEach((articleIndex, pos) => {
      const card = cardEls[articleIndex];
      card.style.zIndex = ARTICLES.length - pos;
      card.style.opacity = pos > 3 ? 0 : (1 - pos * 0.18);
      card.style.pointerEvents = pos === 0 ? 'auto' : 'none';

      const dir = pos % 2 === 0 ? 1 : -1;
      const rot = pos === 0 ? 0 : dir * Math.min(pos, 3) * 2.4;
      const tx = pos === 0 ? 0 : dir * pos * 4;
      const ty = pos * 10;
      const scale = 1 - Math.min(pos, 4) * 0.045;

      card.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${scale})`;
    });
    dotEls.forEach((d, i) => d.classList.toggle('active', order[0] === i));
  }

  function rotate(steps) {
    const n = order.length;
    steps = ((steps % n) + n) % n;
    order = order.slice(steps).concat(order.slice(0, steps));
    layout();
  }

  prevBtn.addEventListener('click', () => rotate(-1));
  nextBtn.addEventListener('click', () => rotate(1));
  dotEls.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = Number(dot.dataset.i);
      rotate(order.indexOf(target));
    });
  });

  /* drag/swipe on the front card only */
  cardEls.forEach(card => {
    let startX = 0, dx = 0, dragging = false;

    function onDown(e) {
      const articleIndex = Number(card.dataset.i);
      if (order[0] !== articleIndex) return;
      dragging = true;
      dx = 0;
      startX = (e.touches ? e.touches[0].clientX : e.clientX);
      card.classList.add('dragging');
    }

    function onMove(e) {
      if (!dragging) return;
      const x = (e.touches ? e.touches[0].clientX : e.clientX);
      dx = x - startX;
      card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
    }

    function onUp() {
      if (!dragging) return;
      dragging = false;
      card.classList.remove('dragging');
      if (Math.abs(dx) > 90) {
        const flyDir = dx > 0 ? 1 : -1;
        card.style.transition = 'transform 0.35s ease, opacity 0.35s ease';
        card.style.transform = `translateX(${flyDir * 500}px) rotate(${flyDir * 24}deg)`;
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.transition = '';
          card.style.opacity = '';
          rotate(1);
        }, 350);
      } else {
        layout();
      }
    }

    card.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    card.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
  });

  layout();
}

initArticleDeck();
/* ==========================================================
   WORK — DATA
   Add an `image` (or `video`) path once you have a screenshot;
   until then the project automatically renders in the compact grid.
   ========================================================== */
const WORK_ITEMS = [
  {
    key: 'talenthire',
    name: 'Talent-Hire AI',
    desc: 'An AI-powered interview platform that conducts personalized technical interviews by analyzing a candidate\'s resume and the target job role. It generates role-specific questions, evaluates responses, and provides structured feedback to assist recruiters in making informed hiring decisions.',
    tech: 'FastAPI · PostgreSQL · Qdrant · OpenAI · Docker',
    image: 'assets/images/TalenthireAI.png',
    github: 'https://github.com/anahaaaa/Talent-Hire-AI',
    demo: 'https://github.com/anahaaaa/Talent-Hire-AI'
  },
  {
    key: 'osscopilot',
    name: 'OSS Copilot (in progress)',
    desc: 'An AI-powered GitHub assistant that helps developers understand open-source repositories by answering questions about the codebase using Retrieval-Augmented Generation (RAG). It indexes repository code and documentation, enabling contextual code explanations and intelligent developer assistance.',
    tech: 'React · FastAPI · PostgreSQL · SQLAlchemy',
    image: 'assets/images/OSSCopilot.png',
    github: 'https://github.com/anahaaaa/OSS-Copilot',
    demo: 'https://oss-copilot-usou-qnv6pi1b9-anahaaaas-projects.vercel.app/'
  },
  {
    key: 'legalsummarizer',
    name: 'Legal Document Summarizer',
    desc: 'An NLP summarization pipeline built on BART that processes 50-page PDFs in under 10 seconds, using sliding-window chunking to work around token limits. Exposed as a FastAPI endpoint accepting PDF, DOCX, and plain text input.',
    tech: 'Hugging Face · FastAPI · PyPDF2 · Python',
    image: '',
    github: '#'
  },
  {
    key: 'routellm',
    name: 'RouteLLM (Coming Soon)',
    desc: 'A unified gateway for routing, managing, and observing requests across multiple Large Language Model providers. Designed with intelligent model routing, fallback strategies, caching, usage analytics, and centralized API management.',
    tech: 'FastAPI · PostgreSQL · Redis · Docker · OpenAI · Anthropic · Gemini',
    image: '',
    github: '#'
  },
  {
  key: 'smarthome',
  name: 'Time-Aware Future Activity Prediction (M.Tech Thesis)',
  desc: `An intelligent smart home automation framework that predicts a resident's next activity and its expected occurrence time using a multi-task deep learning approach. The system learns temporal patterns from IoT sensor data to enable proactive and context-aware home automation.`,
  tech: 'Python · PyTorch · Multi-Task Learning · Deep Learning · Time Series · Smart Home IoT',
  github: 'https://github.com/anahaaaa/Time-Aware-Future-Activity-Prediction-A-Multi-Task-Learning-Approach-for-Smart-Home-Automation',
  image: '',

},
{
  key: 'movie-recommender',
  name: 'Movie Recommender System',
  desc: `A content-based movie recommendation system that suggests similar movies by analyzing metadata using cosine similarity. Built with Streamlit and integrated with the TMDB API to display movie posters through an interactive web interface.`,
  tech: 'Python · Streamlit · Scikit-Learn · Pandas · NumPy · TMDB API',
  github: 'https://github.com/anahaaaa/Movie-Recommender-System',
  demo: 'https://movie-recommendation-system-hff2fxndxynu2kmuretsyk.streamlit.app/',
  image: 'assets/images/movierec.png',
},
{
  key: 'iot-attendance',
  name: 'IoT Biometric Attendance System',
  desc: `A cloud-connected biometric attendance system that uses fingerprint authentication for secure, real-time attendance tracking. The system integrates an ESP8266-based IoT device with AWS IoT Core, MQTT, and a web dashboard for centralized attendance management.`,
  tech: 'ESP8266 · Arduino · AWS IoT Core · MQTT · MySQL · C++ · IoT',
  github: 'https://github.com/anahaaaa/iot-biometric-attendance-system',
  image: '',

}

  
];

const FEATURED = WORK_ITEMS.filter(p => p.image || p.video);
const GRID_ONLY = WORK_ITEMS.filter(p => !p.image && !p.video);

/* ============ WORK — FEATURED CAROUSEL ============ */
const featureOuter = document.getElementById('featureOuter');
const featureCard = document.getElementById('featureCard');
const featureDots = document.getElementById('featureDots');
const featPrev = document.getElementById('featPrev');
const featNext = document.getElementById('featNext');
const projGrid = document.getElementById('projGrid');

let featIndex = 0;

function githubSvg() {
  return `<svg viewBox="0 0 16 16" width="15" height="15"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>`;
}

function renderFeatured() {
  if (!featureOuter) return;

  if (!FEATURED.length) {
    featureOuter.style.display = 'none';
    return;
  }

  const p = FEATURED[featIndex];
  const mediaTag = p.video
    ? `<video src="${p.video}" autoplay muted loop playsinline></video>`
    : `<img src="${p.image}" alt="${p.name} screenshot"
         onerror="this.closest('.feature-card').classList.add('no-media')">`;

  featureCard.classList.remove('no-media');
featureCard.innerHTML = `
<div class="feature-layout">

    <div class="feature-left">

        <div class="feature-image">

            ${mediaTag}

            <a href="${p.demo}"
               target="_blank"
               class="live-demo-btn">

                <svg viewBox="0 0 24 24">
                    <path fill="currentColor"
                    d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"/>
                    <path fill="currentColor"
                    d="M5 5h6v2H7v10h10v-4h2v6H5z"/>
                </svg>

                Live Demo

            </a>

        </div>

    </div>

    <div class="feature-right">

        <h3 class="feature-card-title">${p.name}</h3>

        <p class="feature-card-desc">
            ${p.desc}
        </p>

        <div class="feature-card-tech">
            ${p.tech}
        </div>

        <div class="feature-card-links">

            <a href="${p.github}"
               class="card-link github"
               target="_blank">
                ${githubSvg()}
                GitHub
            </a>

            <button class="card-link ask"
                    data-project="${p.key}">
                Ask AI
            </button>

        </div>

    </div>

</div>
`;

  featureDots.innerHTML = FEATURED.map((_, i) =>
    `<span class="feature-dot ${i === featIndex ? 'active' : ''}" data-i="${i}"></span>`
  ).join('');

  bindFeatureEvents();
}

function bindFeatureEvents() {
  featureDots.querySelectorAll('.feature-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      featIndex = Number(dot.dataset.i);
      renderFeatured();
    });
  });

}

if (featPrev && featNext) {
  featPrev.addEventListener('click', () => {
    featIndex = (featIndex - 1 + FEATURED.length) % FEATURED.length;
    renderFeatured();
  });
  featNext.addEventListener('click', () => {
    featIndex = (featIndex + 1) % FEATURED.length;
    renderFeatured();
  });
}

/* ============ WORK — COMPACT GRID (no-media projects) ============ */
function renderGrid() {
  if (!projGrid) return;

  projGrid.innerHTML = GRID_ONLY.map(p => `
    <article class="proj-grid-card" data-project="${p.key}">
      <div class="proj-grid-top">
        <svg class="proj-grid-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
        </svg>
      </div>
      <h3>${p.name}</h3>
      <p class="proj-grid-desc">${p.desc}</p>
      <span class="proj-grid-tech">${p.tech}</span>
      <div class="proj-grid-links">
        <a href="${p.github}" target="_blank" rel="noopener" class="card-link github">
          ${githubSvg()}
          <span>GitHub</span>
        </a>
        <button class="card-link ask" data-project="${p.key}">Ask AI</button>
      </div>
    </article>
  `).join('');


}

renderFeatured();
renderGrid();

/* ============ OSS — TERMINAL COMMIT LOG ============ */
const logRows = Array.from(document.querySelectorAll('.log-row'));

logRows.forEach(row => {
  row.style.setProperty('--i', row.dataset.i || 0);
  const main = row.querySelector('.log-row-main');
  main.addEventListener('click', () => row.classList.toggle('expanded'));
});

if ('IntersectionObserver' in window) {
  const logObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        logObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  logRows.forEach(row => logObserver.observe(row));
} else {
  logRows.forEach(row => row.classList.add('in-view'));
}

/* ==========================================================
   STACK — domain dropdown + ranked toolkit grid
   ========================================================== */
const STACK_DOMAINS = {
  backend: {
    label: 'Backend',
    icon: 'Ba',
    skills: [
      { name: 'FastAPI',      icon: 'Fa', slug: 'fastapi',     pct: 92 },
      { name: 'REST APIs',    icon: 'Re', slug: '',            pct: 90 },
      { name: 'PostgreSQL',   icon: 'Pg', slug: 'postgresql',  pct: 84 },
      { name: 'SQLAlchemy',   icon: 'Sa', slug: 'sqlalchemy',  pct: 78 },
      { name: 'Docker',       icon: 'Dk', slug: 'docker',      pct: 74 },
    ]
  },
  aiml: {
    label: 'AI / ML',
    icon: 'Ai',
    skills: [
      { name: 'PyTorch',                  icon: 'Pt', slug: 'pytorch',      pct: 90 },
      { name: 'RAG',                      icon: 'Rg', slug: '',             pct: 85 },
      { name: 'LangChain',                icon: 'Lc', slug: 'langchain',    pct: 80 },
      { name: 'Hugging Face Transformers',icon: 'Hf', slug: 'huggingface',  pct: 78 },
      { name: 'Qdrant',                   icon: 'Qd', slug: 'qdrant',       pct: 76 },
      { name: 'TensorFlow',               icon: 'Tf', slug: 'tensorflow',   pct: 68 },
      { name: 'Scikit-learn',             icon: 'Sk', slug: 'scikitlearn',  pct: 72 },
    ]
  },
  languages: {
    label: 'Languages',
    icon: 'La',
    skills: [
      { name: 'Python',     icon: 'Py', slug: 'python',     pct: 95 },
      { name: 'SQL',        icon: 'Sq', slug: '',           pct: 85 },
      { name: 'JavaScript', icon: 'Js', slug: 'javascript', pct: 75 },
      { name: 'Java',       icon: 'Jv', slug: 'openjdk',    pct: 68 },
      { name: 'Node.js',    icon: 'Nd', slug: 'nodedotjs',  pct: 65 },
      { name: 'C',          icon: 'C',  slug: '',           pct: 60 },
    ]
  },
  data: {
    label: 'Data & Signal',
    icon: 'Da',
    skills: [
      { name: 'NumPy',                    icon: 'Np', slug: 'numpy',   pct: 86 },
      { name: 'Pandas',                   icon: 'Pd', slug: 'pandas',  pct: 86 },
      { name: 'Time-Series Analysis',     icon: 'Ts', slug: '',        pct: 80 },
      { name: 'Matplotlib',               icon: 'Mp', slug: '',        pct: 76 },
      { name: 'FFT / Feature Extraction', icon: 'Fx', slug: '',        pct: 72 },
    ]
  },
  cloud: {
    label: 'Cloud & DevOps',
    icon: 'Cl',
    skills: [
      { name: 'Git',                       icon: 'Gt', slug: 'git',        pct: 90 },
      { name: 'GitHub',                    icon: 'Gh', slug: 'github',     pct: 90 },
      { name: 'Linux',                     icon: 'Lx', slug: 'linux',      pct: 78 },
      { name: 'AWS (EC2, S3, IoT Core)',   icon: 'Aw', slug: 'amazonaws',  pct: 68 },
    ]
  }
};

function initStackSection() {
  const tabsEl = document.getElementById('stackTabs');
  const grid = document.getElementById('stackGrid');
  if (!tabsEl || !grid) return;

  Object.entries(STACK_DOMAINS).forEach(([key, domain]) => {
    const tab = document.createElement('button');
    tab.className = 'stack-tab';
    tab.dataset.key = key;
    tab.setAttribute('role', 'tab');
    tab.innerHTML = `
      <span class="stack-tab-icon">${domain.icon}</span>
      <span>${domain.label}</span>
      <span class="stack-tab-count">${domain.skills.length}</span>`;
    tab.addEventListener('click', () => selectDomain(key));
    tabsEl.appendChild(tab);
  });

  const RING_RADIUS = 32;
  const RING_CIRC = 2 * Math.PI * RING_RADIUS;

  function renderGridStack(key) {
    const domain = STACK_DOMAINS[key];
    const sorted = domain.skills.slice().sort((a, b) => b.pct - a.pct);
    grid.innerHTML = '';

    sorted.forEach((skill, i) => {
      const orb = document.createElement('div');
      orb.className = 'stack-orb';
      orb.style.setProperty('--d', `${i * 60}ms`);

      const iconMarkup = skill.slug
        ? `<img src="https://cdn.simpleicons.org/${skill.slug}" alt="${skill.name} logo" loading="lazy"
             onerror="this.remove()">
           <span class="stack-orb-fallback" style="display:none">${skill.icon}</span>`
        : `<span class="stack-orb-fallback">${skill.icon}</span>`;

      orb.innerHTML = `
        <div class="stack-orb-ring">
          <svg class="ring-svg" viewBox="0 0 72 72">
            <circle class="ring-track" cx="36" cy="36" r="${RING_RADIUS}"></circle>
            <circle class="ring-fill" cx="36" cy="36" r="${RING_RADIUS}"
              stroke-dasharray="${RING_CIRC}" stroke-dashoffset="${RING_CIRC}"></circle>
          </svg>
          <span class="stack-orb-icon">${iconMarkup}</span>
          <span class="stack-orb-pct">${skill.pct}%</span>
        </div>
        <span class="stack-orb-name">${skill.name}</span>`;

      grid.appendChild(orb);
    });

    grid.querySelectorAll('.stack-orb-icon').forEach(el => {
      const img = el.querySelector('img');
      const fallback = el.querySelector('.stack-orb-fallback');
      if (img && fallback) {
        img.addEventListener('error', () => { fallback.style.display = 'flex'; }, { once: true });
      }
    });

    requestAnimationFrame(() => {
      grid.querySelectorAll('.ring-fill').forEach((ring, i) => {
        const offset = RING_CIRC * (1 - sorted[i].pct / 100);
        ring.style.strokeDashoffset = offset;
      });
    });
  }

  function selectDomain(key) {
    tabsEl.querySelectorAll('.stack-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.key === key);
    });
    renderGridStack(key);
  }

  selectDomain('backend');
}

initStackSection();


/* ==========================================================
   CHATBOT — conversational
   ========================================================== */
const launcherWrap = document.getElementById('botLauncherWrap');
const terminal = document.getElementById('botTerminal');
const closeBtn = document.getElementById('botClose');
const helpBtn = document.getElementById('botHelp');
const output = document.getElementById('botOutput');
const input = document.getElementById('botInput');
const sendBtn = document.getElementById('botSend');
const chipsWrap = document.getElementById('botChips');

/* derive project knowledge from WORK_ITEMS defined above, single source of truth */
const PROJECTS = {};
WORK_ITEMS.forEach(p => {
  PROJECTS[p.key] = {
    name: p.name,
    stack: p.tech,
    detail: p.desc
  };
});

/* Only these show up by default in chat / rotation. Direct name lookup still
   works for every project in WORK_ITEMS regardless of this list. */
const FEATURED_CHAT_PROJECTS = ['talenthire', 'osscopilot', 'routellm'];

const DEFAULT_CHIPS = ['Projects', 'Tech stack', 'Experience', 'About Anagha', 'Contact info', 'Help'];

/* ---- rotation state for project chips ---- */
const PROJECT_PAGE_SIZE = 2;
let projectPage = 0;

function getProjectPageChips() {
  const keys = FEATURED_CHAT_PROJECTS.filter(k => PROJECTS[k]);
  const totalPages = Math.max(1, Math.ceil(keys.length / PROJECT_PAGE_SIZE));
  projectPage = projectPage % totalPages;

  const start = projectPage * PROJECT_PAGE_SIZE;
  const pageKeys = keys.slice(start, start + PROJECT_PAGE_SIZE);
  const chips = pageKeys.map(k => PROJECTS[k].name);

  if (totalPages > 1) chips.push('More projects ↻');
  chips.push('Tech stack');
  return chips;
}

function advanceProjectPage() {
  const keys = FEATURED_CHAT_PROJECTS.filter(k => PROJECTS[k]);
  const totalPages = Math.max(1, Math.ceil(keys.length / PROJECT_PAGE_SIZE));
  projectPage = (projectPage + 1) % totalPages;
}

function scrollToBottom() {
  output.scrollTop = output.scrollHeight;
}

function addMessage(text, sender = 'bot', html = null) {
  const row = document.createElement('div');
  row.className = 'msg-row ' + sender;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';

  if (sender === 'bot') {
    avatar.innerHTML = `<img src="assets/icons/avatar.png" alt="Anagha AI">`;
  } else {
    avatar.textContent = 'Y';
  }

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';

  if (html) {
    bubble.innerHTML = html;
  } else {
    bubble.textContent = text;
  }

  row.appendChild(avatar);
  row.appendChild(bubble);
  output.appendChild(row);
  scrollToBottom();

  return row;
}

function showTyping() {
  const row = document.createElement('div');
  row.className = 'msg-row bot typing';
  row.innerHTML = `
    <div class="msg-avatar"><img src="assets/icons/avatar.png" alt="Anagha AI"></div>
    <div class="msg-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
  `;
  output.appendChild(row);
  scrollToBottom();
  return row;
}

function renderChips(list) {
  chipsWrap.innerHTML = list.map(c => `<button class="bot-chip">${c}</button>`).join('');
  chipsWrap.querySelectorAll('.bot-chip').forEach(chip => {
    chip.addEventListener('click', () => sendUserMessage(chip.textContent));
  });
}

/* ---- natural-language project description instead of raw card HTML ---- */
function describeProject(key) {
  const p = PROJECTS[key];
  if (!p) return '';

  const techList = p.stack.split('·').map(t => t.trim()).filter(Boolean);
  const techSentence = techList.length
    ? `It's built with ${techList.slice(0, -1).join(', ')}${techList.length > 1 ? ' and ' + techList[techList.length - 1] : techList[0]}.`
    : '';

  return `${p.name}  ${p.detail} ${techSentence}`;
}

/* ---- intent matching: natural language instead of slash commands ---- */
function matchIntent(raw) {
  const t = raw.toLowerCase().trim();

  if (/^(hi|hey|hello|yo|sup)\b/.test(t)) {
    return {
      reply: "Hey! I'm Anagha's portfolio assistant. Ask me about her projects, tech stack, experience, or how to get in touch. Tap the ? icon anytime for a list of things you can ask.",
      chips: DEFAULT_CHIPS
    };
  }

  if (/^help$|what can (you|i) (do|ask)|commands|how (do i|can i) use/.test(t)) {
    return {
      reply: `Here's what I can help with:

- "Projects" — see what Anagha's been building recently
- Ask about a project by name (e.g. "Tell me about TalentHire") for a description and tech stack
- "Tech stack" — her tools across backend, AI/ML, languages, and cloud
- "Experience" — her internship and research background
- "About Anagha" — a quick intro
- "Contact info" — how to reach her directly

Just type naturally, no need for exact commands!`,
      chips: DEFAULT_CHIPS
    };
  }

  if (/more projects|more ↻|↻/.test(t)) {
    advanceProjectPage();
    return {
      reply: "Here are a few more:",
      chips: getProjectPageChips()
    };
  }

  const foundKey = Object.keys(PROJECTS).find(key => {
    const name = PROJECTS[key].name.toLowerCase();
    return t.includes(key.toLowerCase()) || name.split(' ').some(w => w.length > 3 && t.includes(w.toLowerCase()));
  });
  if (foundKey) {
    return {
      reply: describeProject(foundKey),
      chips: ['Another project', 'Tech stack', 'Contact info']
    };
  }

  if (/another project/.test(t)) {
    advanceProjectPage();
    return {
      reply: "Sure, here's another one:",
      chips: getProjectPageChips()
    };
  }

  if (/project|work|built|portfolio piece/.test(t)) {
    return {
      reply: "Here's what Anagha have been building lately — tap one to hear more:",
      chips: getProjectPageChips()
    };
  }

  if (/stack|tech|tools|languages|skills/.test(t)) {
    return {
      reply: `Languages: Python, SQL, JavaScript, Java, Node.js, C++, C
Backend: FastAPI, REST APIs, PostgreSQL, SQLAlchemy, Docker
AI/ML: PyTorch, RAG, LangChain, Hugging Face, Qdrant, TensorFlow, Scikit-Learn
Data/Apps: NumPy, Pandas, Matplotlib, Streamlit, Time-Series Analysis, FFT
IoT/Embedded: ESP8266, Arduino, MQTT, AWS IoT Core, MySQL
Cloud/Ops: Git, GitHub, AWS, Linux

(Check out the Tech Stack section for a ranked breakdown!)`,
      chips: DEFAULT_CHIPS
    };
  }

  if (/experience|intern|job|work history|iit/.test(t)) {
    return {
      reply: `Anagha gained research experience as an AI/ML Research Intern at IIT Madras, where she worked on bearing fault diagnosis using deep learning. Alongside this, she has built several AI and backend projects and actively contributes to open-source software.`,
      chips: DEFAULT_CHIPS
    };
  }

  if (/about|who (is|are) (you|anagha)|background/.test(t)) {
    return {
      reply: `Anagha is a recent M.Tech graduate in Data Science & AI with a strong interest in AI engineering and backend development. She enjoys building intelligent applications and scalable software using modern AI technologies. Currently, she's focused on developing AI-powered products, contributing to open-source projects, and preparing for opportunities in AI and software engineering.`,
      chips: DEFAULT_CHIPS
    };
  }

  if (/contact|email|reach|linkedin|github|hire|connect/.test(t)) {
    return {
      html: `You can reach Anagha here:<br><br>
        mail: <strong>anaghars11165@gmail.com</strong><br>`,
      chips: ['Projects', 'Tech stack']
    };
  }

  return {
    reply: "I'm not sure about that one — but I can tell you about Anagha's projects, tech stack, experience, or how to get in touch! Tap ? for a full list.",
    chips: DEFAULT_CHIPS
  };
}

function respondTo(raw) {
  const typingRow = showTyping();
  const delay = 500 + Math.random() * 500;

  setTimeout(() => {
    typingRow.remove();
    const result = matchIntent(raw);
    if (result.html) {
      addMessage('', 'bot', result.html);
    } else {
      addMessage(result.reply, 'bot');
    }
    renderChips(result.chips || DEFAULT_CHIPS);
  }, delay);
}

function sendUserMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  addMessage(trimmed, 'user');
  chipsWrap.innerHTML = '';
  respondTo(trimmed);
}

function bootMessage() {
  addMessage("Hi there! 👋 I'm Anagha's AI assistant. Ask me anything about her projects, tech stack, or experience — or tap ? for help.", 'bot');
  renderChips(DEFAULT_CHIPS);
}

/* shared helper — opens the chat pre-loaded with a natural-language question about a project */
function openBotWithProject(key) {
  const name = PROJECTS[key] ? PROJECTS[key].name : key;
  terminal.classList.remove('hidden');
  if (!output.children.length) bootMessage();
  sendUserMessage(`Tell me about ${name}`);
}

makeDraggable(launcherWrap, launcherWrap, {
  onClick: () => {
    terminal.classList.remove('hidden');
    if (!output.children.length) bootMessage();
    input.focus();
  }
});

const botHeader = document.querySelector('.bot-header');
makeDraggable(botHeader, terminal);

closeBtn.addEventListener('click', () => terminal.classList.add('hidden'));

if (helpBtn) {
  helpBtn.addEventListener('click', () => {
    terminal.classList.remove('hidden');
    if (!output.children.length) bootMessage();
    sendUserMessage('help');
  });
}

function submitInput() {
  sendUserMessage(input.value);
  input.value = '';
}

sendBtn.addEventListener('click', submitInput);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitInput();
});

/* "Ask AI" buttons on project cards -> natural question sent to the chat */
document.addEventListener('click', (e) => {
  const askBtn = e.target.closest('.card-link.ask');
  if (!askBtn) return;
  e.stopPropagation();
  openBotWithProject(askBtn.dataset.project);
});

/* ============ ASCII PORTRAIT (responsive) ============ */
const canvas = document.getElementById("asciiCanvas");
const ctx = canvas.getContext("2d");

function getAsciiColor() {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "#111111"
    : "#ffffff";
}

const asciiArt = `
                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                 
                                                                                                                                  :::  ..                                                                                                        
                                                                                                                    :-..-+*=:::-==+*==::.-=.                                                                                                     
                                                                                                               :::-+==-:::.........::--+**#*=.                                                                                                   
                                                                                                             .+*=-:::...................::--+*+-...                                                                                              
                                                                                                           .*+-..............................:=+#.::                                                                                             
                                                                                                         .==:...................................:=**+:                                                                                           
                                                                                                       :==:::.....................................-+*-.                                                                                          
                                                                                                      .=::..........................................-*+                                                                                          
                                                                                                    .=-:.............................................:=*=::                                                                                      
                                                                                                   =+::.....................:.::::::...................-*+:.                                                                                     
                                                                                                   *::................::::::::-----:::::................-*-.                                                                                     
                                                                                                 .-:................:::---========--:::::::::............-+-                                                                                     
                                                                                                 +:...............:::::--===++++++=====--:::::...........:+#:                                                                                    
                                                                                                *-:.............:::::--==+++++++++++++++===--::...........:+*:                                                                                   
                                                                                              -+=..............:::::-==++++++++++++++++++++++==-::.........:*+.                                                                                  
                                                                                              :*:............:::::--=++++++++++++++++++++++++++=-::.........+:+                                                                                  
                                                                                              --............:::::-==++++++++++++++++++++++++++++=-::........:+-                                                                                  
                                                                                             -+:...........:::::===+++++*******+++++++++++++++++==--:........==-:                                                                                
                                                                                            =*=.............::-==+++++++*********++++++++++++++++==--:.......-*+::                                                                               
                                                                                            #+:............:--==++++++++*********++++++++++++++++==--:.......:*++                                                                                
                                                                                           =#+:............-==+++++++++***************+++++++++++===--:......:+++-.                                                                              
                                                                                          :=*+:...........-==+++++++++****************++++++++++++===-:......:+*+ -.                                                                             
                                                                                         .=--*...........--=+++++++++*****************+++*++++++++====-:.....:**+  -                                                                             
                                                                                         =--.+:........::-=++++++*********************+++*++++++++====-:.....:**++ .-                                                                            
                                                                                        -.. #+.........:--=------=+++**********+++*****+***+*++++++====-......*#-* .:                                                                            
                                                                                       .: ..**......:.:----====-::..:::-==++*+*+++++++****++++++++++===-.....:++ -=  :                                                                           
                                                                                       -  ---=......::--==+++++++==-:::.::--+++++++++++++==-----::::--==:....-+.=-=- =                                                                           
                                                                                       -  :=+:......::=========-------------=+++++++++=-:::.:::::----::-:....-**.-=+ -                                                                           
                                                                                       . .+*+:......:-====-:::::-:::::::---=+++++++++=----------=======--....=*- : +-.                                                                           
                                                                                       =+#++-:.....:-====--:..:..:....::---==+++++++=---:::::::::----===:...:*++:= ==                                                                            
                                                                                      .-++**=:-....:===+=-...=+:....:=::--===++*+++=--::::.:......::---=:...:**=*:.+                                                                             
                                                                                       -+++*:.::...:+=++++=-::-=::::=+=-:++=+++*+++=---::=.:...:=-..:--=:...-+*+**.-                                                                             
                                                                                      :*****-:::...-==++++++=======---==+++++++++++=-=--==-::::+=-..:-==:..:=*****=                                                                              
                                                                                      --++-+::--...==++++++++++++++++++++++++++++++=========-----::-====:..:-**+**=                                                                              
                                                                                     - =***=::-::..-=++++++++++++++++++++++++++**++=====+++=============:...:+*=++==                                                                             
                                                                                     - =+**-:--::::-+++++****+++++++***+++++++***++++++++++++++++++++===:.-::-*+.=:=:                                                                            
                                                                                    -. -+*+::-=---:-++++++*****+********++++++***+++++++++++++++++++++==:::..-#*.= -=                                                                            
                                                                                    =. -*-=:.:=---=-+++++++**************+++++***+++=+++++++++++++++++==::-:.-***  . -                                                                           
                                                                                    == :-+=:..-==---=++++++**************+++++****++==++++++++++++++++==::-:.:+-+    :.                                                                          
                                                                                    == -:*-....=+==-=+++++++++++********++++++**+*+===+++++++++++++++==---:...++=-    -                                                                          
                                                                                   .. :=+*:....:+===-+++++++++++++++++++++=======-::-==+++++++++++++==---.....=+*=.   -                                                                          
                                                                                  ..   +*=......:==-:+++++++++++++++++++++++++==----====++++++++++====-=......=+**    -                                                                          
                                                                                      =#*::......:...+++++++++++++++++++++++++==----====++++++++++====-=......=+**    :                                                                          
                                                                                      =#+:...........-++++++++++++++++++++++++++=======+++++++++=====:::......=**+    :                                                                          
                                                                                .    .=*=:...........:++++++++++++++++++++++++++++======++++++======-.........-++#.                                                                              
                                                                                    .=*+-:............=++++++++++++++++++++++++++++++==============..........-=++.                                                                              
                                                                               .   ---+#:.............:++++++++++++=-::--:::::-::::::-=-===========:...........=+*:                                                                              
                                                                               :  :+ +**:..............:++++++++++++++=======------::::-==========-...........:+=**..                                                                            
                                                                               :  --=+#=:...............:+++++++++++++++=====-===----=============............:=*=+ :                                                                            
                                                                                :.:=++-=:.................=++++++++++++++==--------=============-..............=*==-.                                                                            
                                                                                 ::+*-*::..................-+++++++++++++====----==============:...............-*=+.+                                                                            
                                                                                 -= *:+:...................:==+++++++++++++++++++++==========-.................:++*-:-                                                                           
                                                                                 --:+--:...................:==-=+++++++++**++++++++++=======-..................:=**=-.:                                                                          
                                                                                .- :*+:.....................===--=+++++++++++++++++++====---:..................:-=+.+  .                                                                         
                                                                                =  ===:.....................=+==---=+++++++++++++++====-----:..................-:+*--. :                                                                         
                                                                                = .**:......................=++=------==+++++++++===--------:..................-=-**+=  -                                                                        
                                                                               :: =*+:......................-+++===----:--------------------:..................:+==*=-  ..                                                                       
                                                                             .:=  -*-.......................=++++=====----:--::::-----------:...................=+-+=.:  -                                                                       
                                                                               + =+*:.......................=+++++=====----------------------...................-+-+==-  :                                                                       
                                                                               =.=*=:......................-==++++++=====--------------------....................-++=-+: :                                                                       
                                                                              .+*#+::......................===++++++++=====------------------:...................:+=*==-..                                                                       
                                                                              =+**-.......................-===++++++++++=====------------------:..................-++*==*                                                                        
                                                                             :##*+.::..............:....:-===+++++++++++++=====-----------------:..................=**+:+                                                                        
                                                                             +#++::-..................:--====+++++++++++++++======-------------::..................:+#*===.                                                                      
                                                                           :+#**-.::...................:-===++++++++++++++++==========-------:....................::-+*=-:-:                                                                     
                                                                          .*#*+-.-:.....::...............::-=++++++++++++++++=========---::.........................:=+*+   .                                                                    
                                                                         .+**+-.:-::.........................:--==+++++=+++========--::..............................::::-:::..                                                                  
                                                                      ..:-=-::::::.................................:::::::::::::.........................................:::::::::.                                                              
                                                                  ..:::::::::::...................................................................................................::::.                                                          
                                                               ..::::................................................................................................................::::.                                                       
                                                             :::::......................................................................................................................::::                                                     
                                                           .-:.............................................................................................................................:::                                                   
                                                          ::.................................................................................................................................::                                                  
                                                        .::....................................................................................................................................:.                                                
                                                        :.......................................................................................................................................:.                                               
                                                       ::........................................................................................................................................:                                               
                                                      ::..........................................................................................................................................-                                              
                                                      :...........................................................................................................................................:.                                             
                                                     ::............................................................................................................................................-                                             
                                                     ::............................................................................................................................................:.                                            
                                                    .:.............................................................................................................................................::                                            
                                                    ::..............................................................................................................................................-                                            
                                                    :...............................................................................................................................................:.                                           
                                                   ::...............................................................................................................................................::                                           
                                                   ::................................................................................................................................................-                                           
                                                   ::................................................................................................................................................:.                                          
                                                  .:.................................................................................................................................................::                                          
                                                  ::..................................................................................................................................................-                                          
                                                  ::..................................................................................................................................................:                                          
                                                  :...................................................................................................................................................:.                                         
                                                 .:...................................................................................................................................................::                                         
                                                 ::....................................................................................................................................................:                                         
                                                 ::....................................................................................................................................................:                                         
                                                 :.............................................................................................................................. ......................:                                         
                                                 :.....................................................................................................................................................:.                                        
                                                .:..............................................................................................................................  .....................::                                        
                                                ::.............................................................................................................................. .......................:                                        
                                                :........................ ...................................................................................................... .......................:                                        
                                                :........................  ....................................................................................................   .......................-                                        
                                               .:..............................................................................................................................  .......................:.                                       
                                               .:..............................................................................................................................  .......................:.                                       
                                               ::..............................................................................................................................  .........................                                       
                                               :......................... .....................................................................................................   .......................:                                       
                                               :......................... .....................................................................................................   .......................:                                       
`;

const lines = asciiArt.replace(/^\n/, '').trimEnd().split("\n");
const artCols = Math.max(...lines.map(l => l.length));
const artRows = lines.length;

let particles = [];

function buildParticles() {
  particles = [];
  lines.forEach((line, row) => {
    [...line].forEach((char, col) => {
      if (char === " ") return;
      particles.push({ char, row, col, x: 0, y: 0, vx: 0, vy: 0, settled: false });
    });
  });
}
buildParticles();

let fontSize = 10;
const xSpacing = 5;
const ySpacing = 8;

function computeLayout() {
  const w = canvas.width;
  const h = canvas.height;

  const margin = 0.92;
  const scaleX = (w * margin) / (artCols * xSpacing);
  const scaleY = (h * margin) / (artRows * ySpacing);
  const scale = Math.max(0.35, Math.min(scaleX, scaleY, 1.6));

  const cellW = xSpacing * scale;
  const cellH = ySpacing * scale;
  fontSize = Math.max(5, 10 * scale);

  const portraitWidth = artCols * cellW;
  const portraitHeight = artRows * cellH;

  const startX = (w - portraitWidth) / 2;
  const startY = (h - portraitHeight) / 2;

    particles.forEach(p => {
    const homeX = startX + p.col * cellW;
    const homeY = startY + p.row * cellH;
    p.homeX = homeX;
    p.homeY = homeY;

    if (!p.settled) {
      // scatter from a random point around the canvas on first layout
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.max(canvas.width, canvas.height) * (0.5 + Math.random() * 0.5);
      p.x = homeX + Math.cos(angle) * radius;
      p.y = homeY + Math.sin(angle) * radius;
      p.settled = true;
    }
  });
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.round(rect.width));
  canvas.height = Math.max(1, Math.round(rect.height));
  computeLayout();
}

resize();

let resizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resize, 120);
});

const mouse = { x: -9999, y: -9999 };

canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

canvas.addEventListener("mouseleave", () => {
  mouse.x = -9999;
  mouse.y = -9999;
});

canvas.addEventListener("touchmove", e => {
  if (!e.touches.length) return;
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.touches[0].clientX - rect.left;
  mouse.y = e.touches[0].clientY - rect.top;
}, { passive: true });

canvas.addEventListener("touchend", () => {
  mouse.x = -9999;
  mouse.y = -9999;
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${fontSize}px monospace`;
  ctx.textBaseline = "top";
  ctx.fillStyle = getAsciiColor();

  particles.forEach(p => {
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 100) {
      const force = (100 - dist) / 100;
      p.vx += dx * force * 0.05;
      p.vy += dy * force * 0.05;
    }

    p.vx += (p.homeX - p.x) * 0.03;
    p.vy += (p.homeY - p.y) * 0.03;

    p.vx *= 0.88;
    p.vy *= 0.88;

    p.x += p.vx;
    p.y += p.vy;

    ctx.fillText(p.char, p.x, p.y);
  });

  requestAnimationFrame(animate);
}

animate();