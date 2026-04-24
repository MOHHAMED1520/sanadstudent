/**
 * ================================================================
 *   منصة سند التعليمية — Components 2026
 *   Header + Footer + Cart + AI Assistant
 * ================================================================
 */

function renderHeader(activePage = '') {
  const isActive = (page) => activePage === page ? 'class="active"' : '';
  return `
  <div id="page-progress"></div>
  <header class="site-header" id="site-header">
    <div class="header-announcement">
      <span class="announcement-inner">
        🌟 منصة سند التعليمية 2026 — دعم أكاديمي متكامل لجميع الجامعات والمدارس &nbsp;|&nbsp; 🎓 مشاريع KSU بأسعار محددة &nbsp;|&nbsp; 🧰 أدوات مجانية للطلاب &nbsp;|&nbsp; ⚡ تسليم سريع وجودة مضمونة &nbsp;|&nbsp; 💬 دعم 24/7 عبر واتساب &nbsp;|&nbsp; +5000 طالب استفاد 🚀
      </span>
    </div>
    <div class="header-main">
      <a href="index.html" class="logo-wrap" title="منصة سند التعليمية">
        <div class="logo-icon">📚</div>
        <div class="logo-text">
          <span class="l-name">سند التعليمية</span>
          <span class="l-sub">أكاديميتك الرقمية المتكاملة 🎓</span>
        </div>
      </a>

      <nav class="main-nav" id="main-nav">
        <a href="index.html" ${isActive('home')}>🏠 الرئيسية</a>

        <div class="nav-dropdown">
          <a href="specializations.html" ${isActive('spec')}>📚 التخصصات</a>
          <div class="dropdown-menu">
            <a href="health.html"><span class="d-icon">💊</span> المسار الصحي والطبي</a>
            <a href="cs.html"><span class="d-icon">💻</span> البرمجة والحاسب</a>
            <a href="science.html"><span class="d-icon">🔬</span> المسار العلمي</a>
            <a href="business.html"><span class="d-icon">💼</span> الإداري والمحاسبي</a>
            <a href="preparatory.html"><span class="d-icon">✍️</span> التحضيري والمدارس</a>
          </div>
        </div>

        <a href="ksu.html" ${isActive('ksu')}>🎓 مشاريع KSU</a>
        <a href="tools.html" ${isActive('tools')}>🧰 أدوات مجانية</a>
        <a href="index.html#how">⚙️ كيف نعمل؟</a>
        <a href="index.html#contact">📞 تواصل معنا</a>
      </nav>

      <div class="header-actions">
        <button class="cart-trigger" onclick="toggleCart()" title="سلة الخدمات">
          <i class="fas fa-shopping-cart"></i>
          <span class="d-none d-sm-inline">سلة الخدمات</span>
          <span class="cart-badge" id="cart-count" style="display:none">0</span>
        </button>
        <button class="mobile-menu-btn" onclick="toggleMobileNav()" aria-label="القائمة" id="mobile-menu-btn">
          <i class="fas fa-bars" id="mobile-icon"></i>
        </button>
      </div>
    </div>

    <nav class="mobile-nav" id="mobile-nav">
      <div class="nav-section-title">الرئيسية</div>
      <a href="index.html" onclick="toggleMobileNav()" ${isActive('home')}><span>🏠</span> الرئيسية</a>
      <a href="index.html#how" onclick="toggleMobileNav()"><span>⚙️</span> كيف نعمل؟</a>
      <div class="sep"></div>
      <div class="nav-section-title">التخصصات</div>
      <a href="specializations.html" onclick="toggleMobileNav()" ${isActive('spec')}><span>📚</span> جميع التخصصات</a>
      <a href="health.html" onclick="toggleMobileNav()"><span>💊</span> المسار الصحي والطبي</a>
      <a href="cs.html" onclick="toggleMobileNav()"><span>💻</span> البرمجة والحاسب</a>
      <a href="science.html" onclick="toggleMobileNav()"><span>🔬</span> المسار العلمي</a>
      <a href="business.html" onclick="toggleMobileNav()"><span>💼</span> الإداري والمحاسبي</a>
      <a href="preparatory.html" onclick="toggleMobileNav()"><span>✍️</span> التحضيري والمدارس</a>
      <div class="sep"></div>
      <div class="nav-section-title">خدمات وأدوات</div>
      <a href="ksu.html" onclick="toggleMobileNav()" ${isActive('ksu')}><span>🎓</span> مشاريع جامعة الملك سعود</a>
      <a href="tools.html" onclick="toggleMobileNav()" ${isActive('tools')}><span>🧰</span> أدوات مجانية</a>
      <div class="sep"></div>
      <div class="nav-section-title">تواصل</div>
      <a href="checkout.html" onclick="toggleMobileNav()"><span>🛒</span> إتمام الطلب</a>
      <a href="index.html#contact" onclick="toggleMobileNav()"><span>📞</span> تواصل معنا</a>
      <a href="https://wa.me/966533940866" target="_blank"><span>💬</span> واتساب مباشر</a>
    </nav>
  </header>`;
}

function renderFooter() {
  return `
  <footer class="site-footer">
    <div class="footer-grid">
      <div class="footer-brand-col">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <div style="width:52px;height:52px;background:linear-gradient(135deg,#f4b942,#e8a320);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;">📚</div>
          <div>
            <div style="font-size:18px;font-weight:900;color:#f4b942;line-height:1.2;">منصة سند التعليمية</div>
            <div style="font-size:11.5px;color:rgba(255,255,255,0.55);">أكاديميتك الرقمية المتكاملة</div>
          </div>
        </div>
        <p>شريكك الأكاديمي الموثوق في المملكة العربية السعودية. خدمات أكاديمية مطورة لجميع الجامعات والمدارس، تجربة طلب سهلة وأدوات مجانية يومية.</p>
        <div class="footer-socials">
          <a href="https://wa.me/966533940866" target="_blank" class="social-icon wa" title="واتساب"><i class="fab fa-whatsapp"></i></a>
          <a href="https://t.me/Helping_KSU/2697" target="_blank" class="social-icon tg" title="تيليجرام"><i class="fab fa-telegram"></i></a>
          <a href="tools.html" class="social-icon" title="الأدوات" style="background:linear-gradient(135deg,#2563eb,#1d4ed8);"><i class="fas fa-screwdriver-wrench"></i></a>
        </div>
        <div style="margin-top:20px;padding:16px;background:rgba(244,185,66,0.1);border-radius:14px;border:1px solid rgba(244,185,66,0.2);">
          <div style="font-size:11px;color:#f4b942;font-weight:800;margin-bottom:6px;display:flex;align-items:center;gap:6px;"><i class="fas fa-shield-alt"></i> ضمان الجودة</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.7;">جميع خدماتنا مضمونة 100% وتُسلَّم في الوقت المحدد بأعلى معايير الجودة الأكاديمية.</div>
        </div>
      </div>

      <div>
        <div class="footer-col-title">🔗 روابط سريعة</div>
        <ul class="footer-links">
          <li><a href="index.html"><i class="fas fa-home"></i> الرئيسية</a></li>
          <li><a href="specializations.html"><i class="fas fa-layer-group"></i> التخصصات</a></li>
          <li><a href="ksu.html"><i class="fas fa-university"></i> مشاريع KSU</a></li>
          <li><a href="tools.html"><i class="fas fa-screwdriver-wrench"></i> أدوات مجانية</a></li>
          <li><a href="checkout.html"><i class="fas fa-shopping-cart"></i> إتمام الطلب</a></li>
          <li><a href="index.html#how"><i class="fas fa-info-circle"></i> كيف نعمل؟</a></li>
        </ul>
      </div>

      <div>
        <div class="footer-col-title">📚 الأقسام الأكاديمية</div>
        <ul class="footer-links">
          <li><a href="health.html"><span style="margin-left:4px;">💊</span> المسار الصحي</a></li>
          <li><a href="cs.html"><span style="margin-left:4px;">💻</span> البرمجة والحاسب</a></li>
          <li><a href="science.html"><span style="margin-left:4px;">🔬</span> المسار العلمي</a></li>
          <li><a href="business.html"><span style="margin-left:4px;">💼</span> الإداري والمحاسبي</a></li>
          <li><a href="preparatory.html"><span style="margin-left:4px;">✍️</span> التحضيري والمدارس</a></li>
          <li><a href="preparatory.html#english"><span style="margin-left:4px;">🇬🇧</span> اللغة الإنجليزية</a></li>
        </ul>
      </div>

      <div>
        <div class="footer-col-title">📞 تواصل معنا</div>
        <ul class="footer-links">
          <li><a href="https://wa.me/966533940866" target="_blank"><i class="fab fa-whatsapp" style="color:#25d366;"></i> واتساب: +966 53 394 0866</a></li>
          <li><a href="https://t.me/Helping_KSU/2697" target="_blank"><i class="fab fa-telegram" style="color:#229ed9;"></i> قناة تيليجرام</a></li>
          <li><a href="javascript:void(0)" onclick="window.shareCurrentPage && window.shareCurrentPage()"><i class="fas fa-share-alt"></i> مشاركة الموقع</a></li>
        </ul>
        <div style="margin-top:16px;padding:16px;background:rgba(255,255,255,0.06);border-radius:12px;border:1px solid rgba(255,255,255,0.1);">
          <div style="font-size:12px;color:#f4b942;font-weight:800;margin-bottom:8px;"><i class="fas fa-clock"></i> أوقات الدعم</div>
          <div style="font-size:12.5px;color:rgba(255,255,255,0.7);line-height:1.8;">
            <div>🟢 واتساب: 24/7</div>
            <div>📱 تيليجرام: 24/7</div>
            <div>⚡ متوسط الرد: &lt; 30 دقيقة</div>
          </div>
        </div>
      </div>
    </div>

    <div style="max-width:1280px;margin:0 auto 24px;padding:20px 0;border-top:1px solid rgba(255,255,255,0.06);">
      <div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;align-items:center;">
        <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:rgba(255,255,255,0.5);">
          <i class="fas fa-shield-alt" style="color:#10b981;"></i> جودة مضمونة
        </div>
        <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:rgba(255,255,255,0.5);">
          <i class="fas fa-lock" style="color:#3b82f6;"></i> خصوصية تامة
        </div>
        <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:rgba(255,255,255,0.5);">
          <i class="fas fa-bolt" style="color:#f4b942;"></i> تسليم سريع
        </div>
        <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:rgba(255,255,255,0.5);">
          <i class="fas fa-headset" style="color:#a78bfa;"></i> دعم 24/7
        </div>
        <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:rgba(255,255,255,0.5);">
          <i class="fas fa-users" style="color:#f472b6;"></i> +5000 طالب موثوق
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      © 2026 منصة سند التعليمية — جميع الحقوق محفوظة 🇸🇦 | أكاديمية رقمية متكاملة للطلاب في المملكة
    </div>
  </footer>`;
}

// Auto-render header & footer
window.addEventListener('DOMContentLoaded', () => {
  const hPh = document.getElementById('header-placeholder');
  if (hPh) {
    const page = hPh.dataset.page || '';
    hPh.outerHTML = renderHeader(page);
    initScrollProgress();
    initHeaderScroll();
    injectMobileNavOverlay();
  }
  const fPh = document.getElementById('footer-placeholder');
  if (fPh) {
    fPh.outerHTML = renderFooter();
  }
});

/* ---- Mobile nav overlay (close on outside click) ---- */
function injectMobileNavOverlay() {
  if (document.getElementById('mobile-nav-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'mobile-nav-overlay';
  overlay.className = 'mobile-nav-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.addEventListener('click', () => {
    if (typeof toggleMobileNav === 'function') toggleMobileNav();
  });
  document.body.appendChild(overlay);

  // Keep overlay visible-state in sync with mobile-nav
  const observer = new MutationObserver(() => {
    const nav = document.getElementById('mobile-nav');
    if (nav) overlay.classList.toggle('open', nav.classList.contains('open'));
  });
  const nav = document.getElementById('mobile-nav');
  if (nav) observer.observe(nav, { attributes: true, attributeFilter: ['class'] });
}

function initScrollProgress() {
  window.addEventListener('scroll', () => {
    const bar = document.getElementById('page-progress');
    if (!bar) return;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
}

function initHeaderScroll() {
  const header = document.querySelector('.site-header') || document.getElementById('site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}
