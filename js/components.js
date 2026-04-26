/**
 * ================================================================
 *   منصة سند التعليمية — Components 2026
 *   Header + Footer auto-render
 * ================================================================
 */

function renderHeader() {
  return `
  <header class="site-header" id="site-header">
    <div class="container">
      <div class="header-inner">

        <a href="index.html" class="logo-wrap" aria-label="سند - الرئيسية">
          <img src="images/logo.svg" alt="شعار منصة سند التعليمية" width="52" height="52">
          <div class="logo-text">
            <span class="logo-name">سند</span>
            <span class="logo-sub">المنصة التعليمية</span>
          </div>
        </a>

        <nav class="nav-menu" aria-label="التنقل الرئيسي">
          <a href="index.html" id="nav-home"><i class="fas fa-home"></i> الرئيسية</a>
          <a href="index.html#services" id="nav-services"><i class="fas fa-briefcase"></i> الخدمات</a>
          <a href="specializations.html" id="nav-specs"><i class="fas fa-graduation-cap"></i> التخصصات</a>
          <a href="tools.html" id="nav-tools"><i class="fas fa-tools"></i> الأدوات</a>
        </nav>

        <div class="header-actions">
          <button class="btn-cart cart-trigger" id="cart-btn" aria-label="عربة الطلبات">
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-text">طلباتي</span>
            <span class="cart-badge" id="cart-badge">0</span>
          </button>
          <button class="btn-hamburger" id="hamburger-btn" aria-label="القائمة" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile Overlay -->
    <div class="mobile-overlay" id="mobile-overlay"></div>

    <!-- Mobile Nav -->
    <nav class="mobile-nav" id="mobile-nav" aria-label="القائمة الجوالة">
      <button class="mobile-nav-close" id="mobile-nav-close" aria-label="إغلاق"><i class="fas fa-times"></i></button>
      <div class="nav-section-title">الرئيسية</div>
      <a href="index.html"><i class="fas fa-home"></i> الرئيسية</a>
      <a href="index.html#services"><i class="fas fa-briefcase"></i> الخدمات الأكاديمية</a>
      <div class="nav-section-title">الصفحات</div>
      <a href="specializations.html"><i class="fas fa-graduation-cap"></i> التخصصات</a>
      <a href="tools.html"><i class="fas fa-tools"></i> الأدوات المجانية</a>
      <div class="nav-section-title">تواصل معنا</div>
      <a href="https://wa.me/966533940866" target="_blank" rel="noopener"><i class="fab fa-whatsapp" style="color:#25D366"></i> واتساب</a>
      <a href="https://t.me/Helping_KSU/2697" target="_blank" rel="noopener"><i class="fab fa-telegram" style="color:#0088cc"></i> تيليجرام</a>
    </nav>
  </header>
  `;
}

function renderFooter() {
  return `
  <footer class="site-footer" id="site-footer">
    <div class="container">
      <div class="footer-grid">

        <div class="footer-brand">
          <div class="footer-logo-wrap">
            <img src="images/logo.svg" alt="شعار منصة سند التعليمية" width="44" height="44">
            <div class="footer-logo-text">
              <div class="footer-brand-name">منصة سند التعليمية</div>
              <div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">المنصة الأكاديمية الأولى</div>
            </div>
          </div>
          <p class="footer-brand-desc">
            منصة أكاديمية متكاملة تقدم خدمات المشاريع والتقارير والبحوث للطلاب، 
            مع أدوات مجانية وتخصصات متنوعة تشمل جميع أقسام الجامعة.
          </p>
          <div class="footer-socials">
            <a href="https://wa.me/966533940866" target="_blank" class="social-icon wa" title="واتساب" aria-label="واتساب">
              <i class="fab fa-whatsapp"></i>
            </a>
            <a href="https://t.me/Helping_KSU/2697" target="_blank" class="social-icon tg" title="تيليجرام" aria-label="تيليجرام">
              <i class="fab fa-telegram"></i>
            </a>
            <a href="tools.html" class="social-icon" title="الأدوات" aria-label="الأدوات المجانية"
               style="background:linear-gradient(135deg,#2563eb,#1e3a8a)">
              <i class="fas fa-tools"></i>
            </a>
            <a href="specializations.html" class="social-icon" title="التخصصات" aria-label="التخصصات"
               style="background:linear-gradient(135deg,#f4b942,#e8a020);color:#1e3a8a">
              <i class="fas fa-graduation-cap"></i>
            </a>
          </div>
          <div style="margin-top:20px;padding:14px;background:rgba(244,185,66,0.08);border-radius:12px;border:1px solid rgba(244,185,66,0.15);">
            <div style="color:var(--accent);font-weight:700;font-size:0.85rem;margin-bottom:6px;">
              <i class="fas fa-phone-alt"></i> تواصل مباشر
            </div>
            <a href="https://wa.me/966533940866" style="color:rgba(255,255,255,0.8);font-size:0.82rem;">
              +966 533 940 866
            </a>
          </div>
        </div>

        <div class="footer-col">
          <h4><i class="fas fa-briefcase"></i> الخدمات</h4>
          <div class="footer-links">
            <a href="index.html#tab-ksu"><i class="fas fa-chevron-left"></i> خدمات جامعة الملك سعود</a>
            <a href="index.html#tab-general"><i class="fas fa-chevron-left"></i> خدمات الجامعات العامة</a>
            <a href="index.html#tab-projects"><i class="fas fa-chevron-left"></i> المشاريع البرمجية</a>
            <a href="index.html#tab-extras"><i class="fas fa-chevron-left"></i> خدمات إضافية</a>
          </div>
        </div>

        <div class="footer-col">
          <h4><i class="fas fa-graduation-cap"></i> التخصصات</h4>
          <div class="footer-links">
            <a href="specializations.html"><i class="fas fa-chevron-left"></i> علوم الحاسب</a>
            <a href="specializations.html"><i class="fas fa-chevron-left"></i> هندسة البرمجيات</a>
            <a href="specializations.html"><i class="fas fa-chevron-left"></i> نظم المعلومات</a>
            <a href="specializations.html"><i class="fas fa-chevron-left"></i> إدارة الأعمال</a>
            <a href="specializations.html"><i class="fas fa-chevron-left"></i> جميع التخصصات</a>
          </div>
        </div>

        <div class="footer-col">
          <h4><i class="fas fa-tools"></i> الأدوات</h4>
          <div class="footer-links">
            <a href="tools.html#gpa"><i class="fas fa-chevron-left"></i> حاسبة GPA</a>
            <a href="tools.html#pdf"><i class="fas fa-chevron-left"></i> تحويل الصور لـ PDF</a>
            <a href="tools.html#cite"><i class="fas fa-chevron-left"></i> توليد المراجع</a>
            <a href="tools.html#text"><i class="fas fa-chevron-left"></i> أدوات النصوص</a>
            <a href="tools.html"><i class="fas fa-chevron-left"></i> جميع الأدوات</a>
          </div>
        </div>

      </div>
    </div>

    <div class="footer-bottom">
      <div class="container" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;width:100%;">
        <span>© 2026 منصة سند التعليمية — جميع الحقوق محفوظة</span>
        <span>
          صُنع بـ <span style="color:var(--accent)">❤</span> للطلاب العرب
        </span>
      </div>
    </div>
  </footer>
  `;
}

// Auto-render header & footer
window.addEventListener('DOMContentLoaded', () => {
  const hPh = document.getElementById('header-placeholder');
  if (hPh) {
    hPh.outerHTML = renderHeader();
    setActiveNav();
    initMobileNav();
  }

  const fPh = document.getElementById('footer-placeholder');
  if (fPh) {
    fPh.outerHTML = renderFooter();
  }
});

function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const navMap = {
    'index.html': 'nav-home',
    '': 'nav-home',
    'specializations.html': 'nav-specs',
    'tools.html': 'nav-tools'
  };
  const activeId = navMap[page];
  if (activeId) {
    document.getElementById(activeId)?.classList.add('active');
  }
}

function initMobileNav() {
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const overlay = document.getElementById('mobile-overlay');
  const closeBtn = document.getElementById('mobile-nav-close');

  function openNav() {
    mobileNav?.classList.add('open');
    overlay?.classList.add('active');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    mobileNav?.classList.remove('open');
    overlay?.classList.remove('active');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openNav);
  overlay?.addEventListener('click', closeNav);
  closeBtn?.addEventListener('click', closeNav);
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
}
