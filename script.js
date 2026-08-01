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
    // Let taps on real controls (buttons, links, inputs) inside the handle
    // behave normally instead of being hijacked into a drag gesture.
    if (e.target.closest('button, a, input, textarea, select')) return;

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
   ARTICLES — paper page turner
   ========================================================== */
const ARTICLES = [
  {
    tag: 'AI Reasoning',
    title: 'Is Claude Opus 5 Moving Beyond Pattern Matching?',
    excerpt: 'A look at the ARC-AGI research showing how Claude Opus 5 represented a puzzle using symbolic mathematical abstractions—and what that could mean for AI reasoning.',
    readTime: '4 min read',
    link: 'https://medium.com/@oneone11165/is-claude-opus-5-moving-beyond-pattern-matching-5281618b5080'
  },
  {
    tag: 'Deep Learning',
    title: 'From Idea to Code: Making a Neural Network Actually Learn XOR (with Just NumPy)',
    excerpt: 'A hands-on walkthrough of building a neural network from scratch in NumPy to solve the classic XOR problem while understanding forward propagation and backpropagation.',
    readTime: '6 min read',
    link: 'https://medium.com/@oneone11165/from-idea-to-code-making-a-neural-network-actually-learn-xor-with-just-numpy-e6ba094caa51'
  },
  {
    tag: 'Machine Learning',
    title: 'One Model to Rule Them All? Not in Machine Learning',
    excerpt: 'Why there is no universally best machine learning model, and how choosing the right algorithm depends on data, objectives, and real-world constraints.',
    readTime: '5 min read',
    link: 'https://medium.com/@oneone11165/one-model-to-rule-them-all-not-in-machine-learning-9507f08bd2b3'
  },
  {
    tag: 'Deep Learning',
    title: 'Neural Networks Aren’t That Mysterious—They’re Just Stacked Linear Regressions (Until They’re Not)',
    excerpt: 'An intuitive explanation of how neural networks evolve from simple linear models into powerful nonlinear function approximators.',
    readTime: '7 min read',
    link: 'https://medium.com/@oneone11165/neural-networks-arent-that-mysterious-they-re-just-stacked-linear-regressions-until-they-re-63169c58cf72'
  }
];

function initArticlePaper() {
  const stage = document.getElementById('paperStage');
  const dotsEl = document.getElementById('paperDots');
  const prevBtn = document.getElementById('paperPrev');
  const nextBtn = document.getElementById('paperNext');
  const wrap = document.getElementById('paperWrap');
  if (!stage) return;

  let current = 0;
  let autoTimer = null;
  let isAnimating = false;
  const AUTO_MS = 5500;

  dotsEl.innerHTML = ARTICLES.map((_, i) =>
    `<span class="paper-dot ${i === 0 ? 'active' : ''}" data-i="${i}"></span>`
  ).join('');
  const dotEls = Array.from(dotsEl.querySelectorAll('.paper-dot'));

  function pageHtml(article, num) {
    const words = article.excerpt.split(' ');
    const mid = Math.ceil(words.length / 2);
    const colA = words.slice(0, mid).join(' ');
    const colB = words.slice(mid).join(' ');
    const firstLetter = article.title.charAt(0);
    const restTitle = article.title.slice(1);

    return `
      <article class="paper-page">
        <div class="paper-masthead">
          <span class="paper-issue">ARTICLES — ISSUE ${String(num + 1).padStart(2, '0')}</span>
          <span class="paper-tag">${article.tag}</span>
        </div>
        <h3 class="paper-title"><span class="paper-dropcap">${firstLetter}</span>${restTitle}</h3>
        <div class="paper-byline">By Anagha R S · ${article.readTime}</div>
        <div class="paper-columns">
          <p>${colA}</p>
          <p>${colB}</p>
        </div>
        <div class="paper-footer">
          <span class="paper-pagenum">${String(num + 1).padStart(2, '0')} / ${String(ARTICLES.length).padStart(2, '0')}</span>
          <a href="${article.link}" target="_blank" rel="noopener" class="paper-continue">Continue reading →</a>
        </div>
      </article>`;
  }

  function currentPageEl() {
    return stage.querySelector('.paper-page');
  }

  function renderInitial() {
    stage.innerHTML = pageHtml(ARTICLES[current], current);
    dotEls.forEach((d, i) => d.classList.toggle('active', i === current));
    attachDrag(currentPageEl());
  }

  /* dir: 1 = next (old page exits left, new enters from right), -1 = prev */
  function transitionTo(newIndex, dir) {
    if (isAnimating) return;
    isAnimating = true;

    const outgoing = currentPageEl();
    current = ((newIndex % ARTICLES.length) + ARTICLES.length) % ARTICLES.length;

    const incoming = document.createElement('div');
    incoming.innerHTML = pageHtml(ARTICLES[current], current);
    const page = incoming.firstElementChild;
    page.style.transform = `translateX(${dir > 0 ? 100 : -100}%)`;
    page.style.transition = 'none';
    stage.appendChild(page);

    requestAnimationFrame(() => {
      page.style.transition = 'transform 0.42s cubic-bezier(.22,1,.36,1)';
      page.style.transform = 'translateX(0)';

      if (outgoing) {
        outgoing.style.transition = 'transform 0.42s cubic-bezier(.22,1,.36,1), opacity 0.42s ease';
        outgoing.style.transform = `translateX(${dir > 0 ? -100 : 100}%)`;
        outgoing.style.opacity = '0';
      }
    });

    setTimeout(() => {
      if (outgoing) outgoing.remove();
      isAnimating = false;
      attachDrag(page);
    }, 440);

    dotEls.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { transitionTo(current + 1, 1); }
  function prevPage() { transitionTo(current - 1, -1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, AUTO_MS);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  prevBtn.addEventListener('click', () => { prevPage(); startAuto(); });
  nextBtn.addEventListener('click', () => { next(); startAuto(); });
  dotEls.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = Number(dot.dataset.i);
      if (target === current) return;
      transitionTo(target, target > current ? 1 : -1);
      startAuto();
    });
  });

  /* ---- live drag-follow swipe ---- */
  let startX = 0, dx = 0, dragging = false;

  function attachDrag(page) {
    if (!page) return;

    function onDown(e) {
      if (isAnimating) return;
      dragging = true;
      dx = 0;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      page.classList.add('dragging');
      page.style.transition = 'none';
      stopAuto();
    }

    function onMove(e) {
      if (!dragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      dx = x - startX;
      const rot = dx / 22;
      page.style.transform = `translateX(${dx}px) rotateY(${rot}deg)`;
      page.style.transformOrigin = dx < 0 ? 'right center' : 'left center';
    }

    function onUp() {
      if (!dragging) return;
      dragging = false;
      page.classList.remove('dragging');

      const stageWidth = stage.offsetWidth || 1;
      const threshold = Math.min(120, stageWidth * 0.22);

      if (Math.abs(dx) > threshold) {
        dx < 0 ? next() : prevPage();
      } else {
        page.style.transition = 'transform 0.32s cubic-bezier(.22,1,.36,1)';
        page.style.transform = 'translateX(0) rotateY(0deg)';
      }
      startAuto();
    }

    page.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    page.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
  }

  wrap.addEventListener('mouseenter', stopAuto);
  wrap.addEventListener('mouseleave', startAuto);

  renderInitial();
  startAuto();
}

initArticlePaper();

/* ==========================================================
   WORK — DATA
   Add an `image` (or `video`) path once you have a screenshot;
   until then the project automatically renders in the compact grid.

   `chatReply` is what the AI assistant says about the project — written
   separately from `desc` (the copy shown on the project card) so the
   chatbot never just parrots the card back to the visitor.
   ========================================================== */
const WORK_ITEMS = [
  {
    key: 'talenthire',
    name: 'Talent-Hire AI',
    desc: 'An AI-powered interview platform that conducts personalized technical interviews by analyzing a candidate\'s resume and the target job role. It generates role-specific questions, evaluates responses, and provides structured feedback to assist recruiters in making informed hiring decisions.',
    tech: 'FastAPI · PostgreSQL · Qdrant · OpenAI · Docker',
    chatReply: "Talent-Hire AI plays virtual interviewer. It reads a candidate's resume against the job it's hiring for, comes up with role-specific technical questions on the spot, scores the answers, and hands the recruiter a clean summary instead of a raw transcript.",
    image: 'assets/images/TalenthireAI.png',
    github: 'https://github.com/anahaaaa/Talent-Hire-AI',
    demo: 'https://github.com/anahaaaa/Talent-Hire-AI'
  },
  {
    key: 'osscopilot',
    name: 'OSS Copilot (in progress)',
    desc: 'An AI-powered GitHub assistant that helps developers understand open-source repositories by answering questions about the codebase using Retrieval-Augmented Generation (RAG). It indexes repository code and documentation, enabling contextual code explanations and intelligent developer assistance.',
    tech: 'React · FastAPI · PostgreSQL · SQLAlchemy',
    chatReply: "OSS Copilot is Anagha's answer to unfamiliar codebases being intimidating. It indexes a GitHub repo's code and docs, then lets you ask plain-English questions about how something works and get a grounded answer instead of guessing from the source.",
    image: 'assets/images/OSSCopilot.png',
    github: 'https://github.com/anahaaaa/OSS-Copilot',
    demo: 'https://oss-copilot-usou-qnv6pi1b9-anahaaaas-projects.vercel.app/'
  },
  {
    key: 'legalsummarizer',
    name: 'Legal Document Summarizer',
    desc: 'An NLP summarization pipeline built on BART that processes 50-page PDFs in under 10 seconds, using sliding-window chunking to work around token limits. Exposed as a FastAPI endpoint accepting PDF, DOCX, and plain text input.',
    tech: 'Hugging Face · FastAPI · PyPDF2 · Python',
    chatReply: "This one compresses lengthy legal paperwork down to something readable — a 50-page PDF gets summarized in under 10 seconds by splitting the text into overlapping windows so the model never runs into its token ceiling.",
    image: '',
    github: '#'
  },
  {
    key: 'routellm',
    name: 'RouteLLM (Coming Soon)',
    desc: 'A unified gateway for routing, managing, and observing requests across multiple Large Language Model providers. Designed with intelligent model routing, fallback strategies, caching, usage analytics, and centralized API management.',
    tech: 'FastAPI · PostgreSQL · Redis · Docker · OpenAI · Anthropic · Gemini',
    chatReply: "RouteLLM is basically a traffic cop for LLM APIs — one gateway in front of several providers that routes each request intelligently, falls back automatically if a provider is down, caches repeat calls, and keeps usage analytics in one place instead of scattered across dashboards.",
    image: '',
    github: '#'
  },
  {
    key: 'smarthome',
    name: 'Time-Aware Future Activity Prediction (M.Tech Thesis)',
    desc: `An intelligent smart home automation framework that predicts a resident's next activity and its expected occurrence time using a multi-task deep learning approach. The system learns temporal patterns from IoT sensor data to enable proactive and context-aware home automation.`,
    tech: 'Python · PyTorch · Multi-Task Learning · Deep Learning · Time Series · Smart Home IoT',
    chatReply: "For her M.Tech thesis, Anagha built a smart-home system that doesn't just react to sensors — it anticipates. It learns a resident's routines from IoT data and predicts both the next likely activity and roughly when it'll happen, so automation can kick in ahead of time rather than after the fact.",
    github: 'https://github.com/anahaaaa/Time-Aware-Future-Activity-Prediction-A-Multi-Task-Learning-Approach-for-Smart-Home-Automation',
    image: ''
  },
  {
    key: 'movie-recommender',
    name: 'Movie Recommender System',
    desc: `A content-based movie recommendation system that suggests similar movies by analyzing metadata using cosine similarity. Built with Streamlit and integrated with the TMDB API to display movie posters through an interactive web interface.`,
    tech: 'Python · Streamlit · Scikit-Learn · Pandas · NumPy · TMDB API',
    chatReply: "A lightweight movie recommender that compares films by their metadata rather than needing a big ratings history, so it still gives sensible suggestions even for a brand-new user. It's wrapped in a Streamlit app with posters pulled live from TMDB.",
    github: 'https://github.com/anahaaaa/Movie-Recommender-System',
    demo: 'https://movie-recommendation-system-hff2fxndxynu2kmuretsyk.streamlit.app/',
    image: 'assets/images/movierec.png'
  },
  {
    key: 'iot-attendance',
    name: 'IoT Biometric Attendance System',
    desc: `A cloud-connected biometric attendance system that uses fingerprint authentication for secure, real-time attendance tracking. The system integrates an ESP8266-based IoT device with AWS IoT Core, MQTT, and a web dashboard for centralized attendance management.`,
    tech: 'ESP8266 · Arduino · AWS IoT Core · MQTT · MySQL · C++ · IoT',
    chatReply: "A fingerprint-based attendance system built around a low-cost ESP8266 board. Every check-in gets pushed straight to the cloud over MQTT and logged centrally, so there's no manual register and no separate syncing step.",
    github: 'https://github.com/anahaaaa/iot-biometric-attendance-system',
    image: ''
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

function renderFeatured(animate = true) {
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

  const paint = () => {
    featureCard.classList.remove('no-media');
    featureCard.innerHTML = `
<div class="feature-layout">
    <div class="feature-left">
        <div class="feature-image">
            ${mediaTag}
            <a href="${p.demo}" target="_blank" class="live-demo-btn">
                <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"/>
                    <path fill="currentColor" d="M5 5h6v2H7v10h10v-4h2v6H5z"/>
                </svg>
                Live Demo
            </a>
        </div>
    </div>
    <div class="feature-right">
        <h3 class="feature-card-title">${p.name}</h3>
        <p class="feature-card-desc">${p.desc}</p>
        <div class="feature-card-tech">${p.tech}</div>
        <div class="feature-card-links">
            <a href="${p.github}" class="card-link github" target="_blank">${githubSvg()} GitHub</a>
            <button class="card-link ask" data-project="${p.key}">Ask AI</button>
        </div>
    </div>
</div>`;

    featureDots.innerHTML = FEATURED.map((_, i) =>
      `<span class="feature-dot ${i === featIndex ? 'active' : ''}" data-i="${i}"></span>`
    ).join('');

    bindFeatureEvents();

    if (animate) {
      requestAnimationFrame(() => featureCard.classList.remove('feature-fade'));
    }
  };

  if (animate) {
    featureCard.classList.add('feature-fade');
    setTimeout(paint, 180);
  } else {
    paint();
  }
}

/* ---- autoplay ---- */
let featureAutoplayTimer = null;
const FEATURE_AUTOPLAY_MS = 5000;

function startFeatureAutoplay() {
  stopFeatureAutoplay();
  if (FEATURED.length <= 1) return;
  featureAutoplayTimer = setInterval(() => {
    featIndex = (featIndex + 1) % FEATURED.length;
    renderFeatured();
  }, FEATURE_AUTOPLAY_MS);
}

function stopFeatureAutoplay() {
  if (featureAutoplayTimer) {
    clearInterval(featureAutoplayTimer);
    featureAutoplayTimer = null;
  }
}

if (featureOuter) {
  featureOuter.addEventListener('mouseenter', stopFeatureAutoplay);
  featureOuter.addEventListener('mouseleave', startFeatureAutoplay);
  featureOuter.addEventListener('touchstart', stopFeatureAutoplay, { passive: true });
  featureOuter.addEventListener('touchend', () => {
    setTimeout(startFeatureAutoplay, 4000);
  }, { passive: true });
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
startFeatureAutoplay();

/* ==========================================================
   OSS — diff viewer, grouped by repo, multi-PR aware */
const OSS_CONTRIBUTIONS = [
  {
    repo: 'arachnode',
    org: 'sharmavaibhav31',
    repoUrl: 'https://github.com/sharmavaibhav31/arachnode',
    desc: "Contributed to Arachnode's Aggregator Service by implementing centralized date normalization, ensuring consistent handling of timestamps across multiple sources.",
    prs: [
      { label: '#PR-62 Multi-Format Timestamp Support', link: 'https://github.com/sharmavaibhav31/arachnode/pull/62' }
    ]
  },
  {
    repo: 'PatchPilot',
    org: 'ionfwsrijan',
    repoUrl: 'https://github.com/ionfwsrijan/PatchPilot',
    desc: "Developed backend and machine learning enhancements for PatchPilot's security scanning and finding prioritization pipeline.",
    prs: [
      { label: '#PR-30 Findings Retrieval & Verification APIs', link: 'https://github.com/ionfwsrijan/PatchPilot/pull/30' },
      { label: '#PR-44 Severity Ranker Training Pipeline', link: 'https://github.com/ionfwsrijan/PatchPilot/pull/44' },
      { label: '#PR-65 Startup Ranker Loading & Scan Scoring', link: 'https://github.com/ionfwsrijan/PatchPilot/pull/65' }
    ]
  },
  {
    repo: 'iloveAgents',
    org: 'AditthyaSS',
    repoUrl: 'https://github.com/AditthyaSS/iloveAgents',
    desc: "Opened and implemented Issue #204: Added automatic timeout handling for stalled API requests, improving reliability across LLM providers.",
    prs: [
      { label: '#issue-204 Stalled API Request Handling', link: 'https://github.com/AditthyaSS/iloveAgents/issues/204', type: 'issue' },
      { label: '#PR-226 Stalled API Request Handling', link: 'https://github.com/AditthyaSS/iloveAgents/pull/226' }
    ]
  },
  {
    repo: 'kuberef',
    org: 'hudazaan',
    repoUrl: 'https://github.com/hudazaan/kuberef',
    desc: "Added support for scanning YAML manifests recursively across nested directory structures.",
    prs: [
      { label: '#PR-20 Recursive Manifest Scanning', link: 'https://github.com/hudazaan/kuberef/pull/20' }
    ]
  },
  {
    repo: 'Algo-Infinity-Verse',
    org: 'Eshajha19',
    repoUrl: 'https://github.com/Eshajha19/Algo-Infinity-Verse',
    desc: "Added an interactive Recursion Learning Page featuring concepts, visualizations, code examples, and practice exercises.",
    prs: [
      { label: '#PR-255 Recursion Learning Page', link: 'https://github.com/Eshajha19/Algo-Infinity-Verse/pull/255' }
    ]
  },
  {
    repo: 'localmind',
    org: 'imDarshanGK',
    repoUrl: 'https://github.com/imDarshanGK/localmind',
    desc: "Added a session cloning API endpoint for duplicating chat sessions and preserving conversation history.",
    prs: [
      { label: '#PR-380 Session Cloning Endpoint', link: 'https://github.com/imDarshanGK/localmind/pull/380' }
    ]
  },
  {
    repo: 'VYOM',
    org: 'Th-Shivam',
    repoUrl: 'https://github.com/Th-Shivam/VYOM',
    desc: "Opened and got assigned Issue #71 to build an LLM-based conversational memory summarization system using Groq.",
    prs: [
      { label: '#issue-71 LLM-Based Conversational Memory Summarization', link: 'https://github.com/Th-Shivam/VYOM/issues/71', type: 'issue' }
    ]
  },
  {
    repo: 'Waggle-mcp',
    org: 'Abhigyan-Shekhar',
    repoUrl: 'https://github.com/Abhigyan-Shekhar/Waggle-mcp',
    desc: "Added CLI help test coverage for distribution commands by validating help output and key flags for export, push, pull, and share workflows.",
    prs: [
      { label: '#PR-398 CLI Help Coverage for Distribution Commands', link: 'https://github.com/Abhigyan-Shekhar/Waggle-mcp/pull/398' }
    ]
  }
];

function initOssDiffs() {
  const listEl = document.getElementById('diffList');
  if (!listEl) return;

  const openState = {};
  OSS_CONTRIBUTIONS.forEach((r, i) => { openState[r.repo] = i === 0; });

  function renderRepo(repo) {
    const isOpen = openState[repo.repo];

    return `
      <div class="diff-repo ${isOpen ? 'open' : ''}" data-repo="${repo.repo}">
        <button class="diff-repo-toggle" data-repo="${repo.repo}">
          <span class="diff-repo-caret">›</span>
          <span class="diff-repo-name">${repo.org} / ${repo.repo}</span>
          <span class="diff-repo-count">${repo.prs.length} contribution${repo.prs.length > 1 ? 's' : ''}</span>
        </button>
        <div class="diff-repo-body">
          <div class="diff-repo-inner">
            <p class="diff-context">${repo.desc}</p>
            <div class="diff-pr-links">
              ${repo.prs.map(pr => `
                <a href="${pr.link}" target="_blank" rel="noopener"
                   class="diff-pr-link ${pr.type === 'issue' ? 'is-issue' : ''}">
                  ${pr.type === 'issue' ? '◇' : '✓'} ${pr.label} →
                </a>
              `).join('')}
            </div>
            <a href="${repo.repoUrl}" target="_blank" rel="noopener" class="diff-repo-external">View repository ↗</a>
          </div>
        </div>
      </div>`;
  }

  function renderAll() {
    listEl.innerHTML = OSS_CONTRIBUTIONS.map(renderRepo).join('');
    listEl.querySelectorAll('.diff-repo-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const repo = btn.dataset.repo;
        openState[repo] = !openState[repo];
        renderAll();
      });
    });
  }

  renderAll();
}

initOssDiffs();

/* ==========================================================
   STACK — domain tabs + ranked toolkit grid (uses shared .tab-list-item)
   ========================================================== */
const STACK_DOMAINS = {
  languages: {
    label: 'Languages',
    icon: 'La',
    skills: [
      { name: 'Python',     icon: 'Py', slug: 'python',     pct: 95 },
      { name: 'SQL',        icon: 'Sq', slug: '',           pct: 85 },
      { name: 'Java',       icon: 'Jv', slug: 'openjdk',    pct: 78 },
      { name: 'JavaScript', icon: 'Js', slug: 'javascript', pct: 72 },
      { name: 'HTML5',      icon: 'Ht', slug: 'html5',      pct: 70 },
      { name: 'CSS3',       icon: 'Cs', slug: 'css3',       pct: 70 },
      { name: 'C',          icon: 'C',  slug: '',           pct: 60 },
      { name: 'Node.js',    icon: 'Nd', slug: 'nodedotjs',  pct: 55 },
    ]
  },
  backend: {
    label: 'Backend & Databases',
    icon: 'Ba',
    skills: [
      { name: 'FastAPI',      icon: 'Fa', slug: 'fastapi',     pct: 92 },
      { name: 'REST APIs',    icon: 'Re', slug: '',            pct: 90 },
      { name: 'PostgreSQL',   icon: 'Pg', slug: 'postgresql',  pct: 85 },
      { name: 'SQLAlchemy',   icon: 'Sa', slug: 'sqlalchemy',  pct: 78 },
      { name: 'SQLite',       icon: 'Sl', slug: 'sqlite',      pct: 72 },
      { name: 'Qdrant',       icon: 'Qd', slug: 'qdrant',      pct: 76 },
    ]
  },
  aiml: {
    label: 'AI / ML & LLMs',
    icon: 'Ai',
    skills: [
      { name: 'PyTorch',                   icon: 'Pt', slug: 'pytorch',      pct: 92 },
      { name: 'RAG',                       icon: 'Rg', slug: '',             pct: 88 },
      { name: 'LangChain',                 icon: 'Lc', slug: 'langchain',    pct: 82 },
      { name: 'Hugging Face Transformers', icon: 'Hf', slug: 'huggingface',  pct: 80 },
      { name: 'LLMs / NLP',                icon: 'Nl', slug: '',             pct: 85 },
      { name: 'TensorFlow',                icon: 'Tf', slug: 'tensorflow',   pct: 68 },
      { name: 'Scikit-learn',              icon: 'Sk', slug: 'scikitlearn',  pct: 72 },
      { name: 'LoRA / PEFT (Unsloth)',     icon: 'Lo', slug: '',             pct: 65 },
    ]
  },
  data: {
    label: 'Data & Signal Processing',
    icon: 'Da',
    skills: [
      { name: 'NumPy',                    icon: 'Np', slug: 'numpy',   pct: 86 },
      { name: 'Pandas',                   icon: 'Pd', slug: 'pandas',  pct: 86 },
      { name: 'Time-Series Analysis',     icon: 'Ts', slug: '',        pct: 80 },
      { name: 'Matplotlib',               icon: 'Mp', slug: '',        pct: 76 },
      { name: 'FFT / Feature Extraction', icon: 'Fx', slug: '',        pct: 74 },
    ]
  },
  cloud: {
    label: 'Cloud, DevOps & Practices',
    icon: 'Cl',
    skills: [
      { name: 'Git',                       icon: 'Gt', slug: 'git',        pct: 92 },
      { name: 'GitHub',                    icon: 'Gh', slug: 'github',     pct: 92 },
      { name: 'Docker',                    icon: 'Dk', slug: 'docker',     pct: 78 },
      { name: 'Linux',                     icon: 'Lx', slug: 'linux',      pct: 78 },
      { name: 'AWS (EC2, S3, IoT Core)',   icon: 'Aw', slug: 'amazonaws',  pct: 70 },
      { name: 'OOP / DSA / Agile',         icon: 'Sw', slug: '',          pct: 85 },
    ]
  }
};

function initStackSection() {
  const listEl = document.getElementById('stackTabList');
  const detailEl = document.getElementById('stackDetail');
  if (!listEl || !detailEl) return;

  const domainKeys = Object.keys(STACK_DOMAINS);

  listEl.innerHTML = domainKeys.map((key, i) => `
    <div class="tab-list-item ${i === 0 ? 'active' : ''}" data-key="${key}">
      ${STACK_DOMAINS[key].label}
    </div>
  `).join('');

  const RING_RADIUS = 32;
  const RING_CIRC = 2 * Math.PI * RING_RADIUS;

  function renderDomain(key) {
    const domain = STACK_DOMAINS[key];
    const sorted = domain.skills.slice().sort((a, b) => b.pct - a.pct);

    detailEl.classList.remove('tab-detail');
    void detailEl.offsetWidth;
    detailEl.classList.add('tab-detail');

    detailEl.innerHTML = `<div class="stack-grid" id="stackGrid"></div>`;
    const grid = detailEl.querySelector('#stackGrid');

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

  listEl.querySelectorAll('.tab-list-item').forEach(tab => {
    tab.addEventListener('click', () => {
      listEl.querySelectorAll('.tab-list-item').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderDomain(tab.dataset.key);
    });
  });

  renderDomain(domainKeys[0]);
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

/* derive project knowledge from WORK_ITEMS defined above — single source of truth */
const PROJECTS = {};
WORK_ITEMS.forEach(p => {
  PROJECTS[p.key] = {
    name: p.name,
    stack: p.tech,
    detail: p.desc,
    chatReply: p.chatReply || p.desc
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

/* ---- project reply for the chatbot ----
   Uses `chatReply` (written specifically for conversation) and renders the
   tech stack separately underneath, instead of folding everything into one
   dense paragraph the way the project card does. */
function describeProject(key) {
  const p = PROJECTS[key];
  if (!p) return '';

  const techList = p.stack.split('·').map(t => t.trim()).filter(Boolean);
  const techLine = techList.length ? techList.join(' • ') : '';

  return `<strong>${p.name}</strong><br>${p.chatReply}${
    techLine ? `<br><br><em>Stack</em><br>${techLine}` : ''
  }`;
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
      html: describeProject(foundKey),
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

/* If the launcher (or open chat window) has been dragged to a custom
   position, keep it inside the viewport when the screen size changes —
   e.g. rotating the phone, or resizing a desktop window — so it can
   never end up stuck off-screen. Elements that haven't been dragged yet
   have no inline left/top and are simply left alone, anchored to their
   default bottom-right CSS position. */
function clampToViewport(el) {
  if (!el || !el.style.left || !el.style.top) return;
  const maxLeft = Math.max(8, window.innerWidth - el.offsetWidth - 8);
  const maxTop = Math.max(8, window.innerHeight - el.offsetHeight - 8);
  const left = Math.min(Math.max(8, parseFloat(el.style.left)), maxLeft);
  const top = Math.min(Math.max(8, parseFloat(el.style.top)), maxTop);
  el.style.left = left + 'px';
  el.style.top = top + 'px';
}

let viewportClampTimer = null;
function scheduleViewportClamp() {
  clearTimeout(viewportClampTimer);
  viewportClampTimer = setTimeout(() => {
    clampToViewport(launcherWrap);
    clampToViewport(terminal);
  }, 150);
}
window.addEventListener('resize', scheduleViewportClamp);
window.addEventListener('orientationchange', () => setTimeout(scheduleViewportClamp, 250));

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
  if (!w || !h) return; // container not measurable yet (e.g. mid-layout) — skip and retry later

  const margin = 0.92;
  const scaleX = (w * margin) / (artCols * xSpacing);
  const scaleY = (h * margin) / (artRows * ySpacing);
  // Fit strictly to the container — no forced minimum scale, or short mobile
  // containers would render the art larger than the box and get clipped.
  const scale = Math.min(scaleX, scaleY, 1.6);

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
// Run again on the next couple of frames — on first paint the portrait's
// container can still be mid-layout (webfonts, mobile browser chrome not
// yet settled), so an early resize() can lock in a height that's taller
// than what the box ends up being, cropping the top of the art.
requestAnimationFrame(resize);
setTimeout(resize, 300);

let resizeTimer = null;
function scheduleResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resize, 120);
}

window.addEventListener("resize", scheduleResize);
window.addEventListener("orientationchange", () => setTimeout(resize, 250));

// visualViewport fires reliably when a mobile browser's address bar
// collapses/expands, which a plain window "resize" listener can miss.
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', scheduleResize);
}

// Also watch the portrait box itself directly, since its height is
// defined in vh/dvh and can change independently of the window firing
// a resize event.
if ('ResizeObserver' in window && canvas.parentElement) {
  const portraitObserver = new ResizeObserver(scheduleResize);
  portraitObserver.observe(canvas.parentElement);
}

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