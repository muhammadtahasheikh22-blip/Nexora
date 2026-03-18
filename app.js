/* ============================================
   NEXORA – Main Application JavaScript
   Version 1.0
   ============================================ */

'use strict';

// ============================================================
// THEME MANAGEMENT
// ============================================================
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('nexora-theme') || 'dark';
    this.apply(saved);
    document.getElementById('themeToggle').addEventListener('click', () => this.toggle());
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexora-theme', theme);
    const icon = document.querySelector('.theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.apply(current === 'dark' ? 'light' : 'dark');
  }
};

// ============================================================
// HEADER SCROLL
// ============================================================
const HeaderManager = {
  init() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
      header.style.background = window.scrollY > 50
        ? (document.documentElement.getAttribute('data-theme') === 'dark'
            ? 'rgba(10,10,15,0.98)'
            : 'rgba(245,244,255,0.98)')
        : '';
    }, { passive: true });

    // Mobile hamburger
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    if (hamburger && nav) {
      hamburger.addEventListener('click', () => {
        nav.classList.toggle('open');
        hamburger.classList.toggle('active');
      });
    }
  }
};

// ============================================================
// SEARCH
// ============================================================
const TOOLS_LIST = [
  { name: 'Word Counter', icon: '📝', url: 'tools/word-counter.html', cat: 'text' },
  { name: 'Case Converter', icon: '🔤', url: 'tools/case-converter.html', cat: 'text' },
  { name: 'Text to Speech', icon: '🔊', url: 'tools/text-to-speech.html', cat: 'text' },
  { name: 'Grammar Checker', icon: '🔍', url: '#', cat: 'text' },
  { name: 'Plagiarism Checker', icon: '🕵️', url: '#', cat: 'text' },
  { name: 'Image Compressor', icon: '🖼️', url: 'tools/image-compressor.html', cat: 'image' },
  { name: 'Image Resizer', icon: '📐', url: '#', cat: 'image' },
  { name: 'JPG to PNG Converter', icon: '🔄', url: '#', cat: 'image' },
  { name: 'Background Remover', icon: '🗑️', url: '#', cat: 'image' },
  { name: 'Image to PDF', icon: '📑', url: '#', cat: 'image' },
  { name: 'PDF to Word', icon: '📄', url: '#', cat: 'pdf' },
  { name: 'PDF Compressor', icon: '🗜️', url: '#', cat: 'pdf' },
  { name: 'Merge PDF', icon: '🔗', url: '#', cat: 'pdf' },
  { name: 'Split PDF', icon: '✂️', url: '#', cat: 'pdf' },
  { name: 'BMI Calculator', icon: '⚖️', url: 'tools/bmi-calculator.html', cat: 'calc' },
  { name: 'Age Calculator', icon: '🎂', url: '#', cat: 'calc' },
  { name: 'Currency Converter', icon: '💱', url: '#', cat: 'calc' },
  { name: 'Password Generator', icon: '🔐', url: 'tools/password-generator.html', cat: 'calc' },
  { name: 'Percentage Calculator', icon: '%', url: '#', cat: 'calc' },
  { name: 'Meta Tag Generator', icon: '🏷️', url: '#', cat: 'seo' },
  { name: 'QR Code Generator', icon: '📲', url: 'tools/qr-generator.html', cat: 'seo' },
  { name: 'SEO Word Counter', icon: '📊', url: '#', cat: 'seo' },
  { name: 'Typing Speed Test', icon: '⌨️', url: 'typing.html', cat: 'typing' },
];

const SearchManager = {
  init() {
    const input = document.getElementById('heroSearch');
    const suggestions = document.getElementById('searchSuggestions');
    if (!input || !suggestions) return;

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!q) { suggestions.classList.remove('show'); return; }
      const results = TOOLS_LIST.filter(t => t.name.toLowerCase().includes(q)).slice(0, 6);
      if (!results.length) { suggestions.classList.remove('show'); return; }
      suggestions.innerHTML = results.map(t =>
        `<div class="sugg-item" onclick="window.location.href='${t.url}'">
          <span>${t.icon}</span>
          <span>${t.name}</span>
        </div>`
      ).join('');
      suggestions.classList.add('show');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-bar-wrap')) {
        suggestions.classList.remove('show');
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }
};

function handleSearch() {
  const input = document.getElementById('heroSearch');
  const q = input.value.trim().toLowerCase();
  if (!q) return;
  const found = TOOLS_LIST.find(t => t.name.toLowerCase().includes(q));
  if (found && found.url !== '#') {
    window.location.href = found.url;
  } else {
    showToast('Tool not found. Showing all tools below.');
    document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
  }
}

// ============================================================
// TOOLS FILTER
// ============================================================
function filterTools(cat) {
  const cards = document.querySelectorAll('.tool-card');
  const btns = document.querySelectorAll('.cat-btn');

  btns.forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  cards.forEach(card => {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// ============================================================
// LIVE COUNTER ANIMATION
// ============================================================
const StatsManager = {
  init() {
    this.animateCounter('liveCount', 12400, 12483, 30);
    this.animateCounter('statTools', 24800, 24891, 30);
    this.animateCounter('statUsers', 1200, 1247, 30);
    this.startLive();
  },

  animateCounter(id, start, end, duration) {
    const el = document.getElementById(id);
    if (!el) return;
    let current = start;
    const step = Math.ceil((end - start) / (duration / 16));
    const timer = setInterval(() => {
      current = Math.min(current + step, end);
      el.textContent = current.toLocaleString();
      if (current >= end) clearInterval(timer);
    }, 16);
  },

  startLive() {
    // Simulate live usage
    setInterval(() => {
      const el = document.getElementById('liveCount');
      if (!el) return;
      const current = parseInt(el.textContent.replace(/,/g, ''));
      el.textContent = (current + Math.floor(Math.random() * 3)).toLocaleString();
    }, 4000);

    setInterval(() => {
      const el = document.getElementById('statUsers');
      if (!el) return;
      const current = parseInt(el.textContent.replace(/,/g, ''));
      const delta = Math.floor(Math.random() * 10) - 4;
      el.textContent = Math.max(1000, current + delta).toLocaleString();
    }, 8000);
  }
};

// ============================================================
// CHALLENGE TIMER
// ============================================================
const ChallengeTimer = {
  init() {
    this.updateTimer();
    setInterval(() => this.updateTimer(), 1000);
  },

  updateTimer() {
    const el = document.getElementById('challengeTimer');
    if (!el) return;
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    let diff = Math.floor((midnight - now) / 1000);
    const h = Math.floor(diff / 3600);
    diff %= 3600;
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    el.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
};

// ============================================================
// AUTH MODAL
// ============================================================
const AuthModal = {
  init() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.open();
    });

    document.getElementById('authModal').addEventListener('click', (e) => {
      if (e.target.id === 'authModal') this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  },

  open() {
    document.getElementById('authModal').classList.add('show');
    document.body.style.overflow = 'hidden';
  },

  close() {
    document.getElementById('authModal').classList.remove('show');
    document.body.style.overflow = '';
  }
};

function closeModal() { AuthModal.close(); }

function switchTab(tab) {
  document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('signupForm').style.display = tab === 'signup' ? 'block' : 'none';
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ============================================================
// TYPING DEMO ANIMATION (homepage preview)
// ============================================================
const TypingDemo = {
  chars: null,
  index: 3,
  timer: null,

  init() {
    this.chars = document.querySelectorAll('.typed-char');
    if (!this.chars.length) return;
    this.timer = setInterval(() => this.animate(), 200);
  },

  animate() {
    if (!this.chars || this.index >= this.chars.length) {
      clearInterval(this.timer);
      return;
    }
    this.chars.forEach(c => c.classList.remove('active'));
    this.chars[this.index].classList.remove('active');
    this.chars[this.index].classList.add('correct');
    if (this.index + 1 < this.chars.length) {
      this.chars[this.index + 1].classList.add('active');
    }
    this.index++;

    // Update demo stats
    const wpm = Math.floor(this.index * 0.8);
    const el = document.getElementById('demoWpm');
    if (el) el.textContent = wpm;
  }
};

// ============================================================
// INTERSECTION OBSERVER – Animate elements on scroll
// ============================================================
const ScrollAnimator = {
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.6s ease both';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.tool-card, .pricing-card, .t-stat').forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }
};

// ============================================================
// POINTS SYSTEM (Local Storage based)
// ============================================================
const PointsSystem = {
  getPoints() {
    return parseInt(localStorage.getItem('nexora-points') || '0');
  },
  addPoints(amount, reason) {
    const current = this.getPoints();
    const newTotal = current + amount;
    localStorage.setItem('nexora-points', newTotal);
    if (reason) showToast(`+${amount} points! ${reason} 🎉`);
    return newTotal;
  },
  dailyLogin() {
    const lastLogin = localStorage.getItem('nexora-last-login');
    const today = new Date().toDateString();
    if (lastLogin !== today) {
      localStorage.setItem('nexora-last-login', today);
      this.addPoints(5, 'Daily login bonus');
    }
  }
};

// ============================================================
// RECENT TOOLS (Local Storage)
// ============================================================
const RecentTools = {
  add(toolName) {
    let recent = JSON.parse(localStorage.getItem('nexora-recent') || '[]');
    recent = [toolName, ...recent.filter(t => t !== toolName)].slice(0, 5);
    localStorage.setItem('nexora-recent', JSON.stringify(recent));
  },
  get() {
    return JSON.parse(localStorage.getItem('nexora-recent') || '[]');
  }
};

// ============================================================
// SMOOTH ANCHOR SCROLLING
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K = focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('heroSearch');
      if (searchInput) {
        searchInput.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    // Escape = close modal
    if (e.key === 'Escape') closeModal();
  });
}

// ============================================================
// INIT ALL
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  HeaderManager.init();
  SearchManager.init();
  StatsManager.init();
  ChallengeTimer.init();
  AuthModal.init();
  TypingDemo.init();
  ScrollAnimator.init();
  PointsSystem.dailyLogin();
  initSmoothScroll();
  initKeyboardShortcuts();

  // Tool card clicks = add to recent
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => {
      const toolName = card.querySelector('h3')?.textContent;
      if (toolName) RecentTools.add(toolName);
    });
  });
});
