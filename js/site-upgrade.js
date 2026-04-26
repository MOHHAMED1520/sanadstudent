/**
 * ================================================================
 *   منصة سند التعليمية — Site Upgrade JS 2026
 *   Floating Actions (RIGHT: share/fav/top | LEFT: AI/WhatsApp via main.js)
 *   Homepage Sections: Specs Promo, Tools Teaser
 * ================================================================
 */

(() => {
  'use strict';

  /* ==================== STORAGE ==================== */
  function safeGet(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
  }
  function safeSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
  }

  /* ==================== FAVORITES DRAWER ==================== */
  const FAV_KEY = 'sanad_fav_2026';

  function getFavs() {
    return safeGet(FAV_KEY) || [];
  }
  function saveFavs(favs) {
    safeSet(FAV_KEY, favs);
  }

  function openFavoritesDrawer() {
    let overlay = document.getElementById('fav-overlay');
    let drawer  = document.getElementById('fav-drawer');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'fav-overlay';
      overlay.className = 'favorites-overlay';
      overlay.onclick = closeFavoritesDrawer;
      document.body.appendChild(overlay);
    }
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'fav-drawer';
      drawer.className = 'favorites-drawer';
      document.body.appendChild(drawer);
    }

    renderFavDrawer(drawer);
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeFavoritesDrawer() {
    document.getElementById('fav-overlay')?.classList.remove('open');
    document.getElementById('fav-drawer')?.classList.remove('open');
    document.body.style.overflow = '';
  }
  window.closeFavoritesDrawer = closeFavoritesDrawer;

  function renderFavDrawer(drawer) {
    const favs = getFavs();
    drawer.innerHTML = `
      <div class="favorites-header">
        <h3><i class="fas fa-heart"></i> المفضلة</h3>
        <div class="favorites-close" onclick="closeFavoritesDrawer()"><i class="fas fa-times"></i></div>
      </div>
      <div class="favorites-body">
        ${favs.length === 0
          ? `<div class="fav-empty"><i class="fas fa-heart-broken"></i><p>لا توجد عناصر في المفضلة بعد</p><p style="font-size:0.78rem;margin-top:6px">اضغط على ❤️ بجانب أي خدمة لإضافتها</p></div>`
          : favs.map(f => `
            <div class="fav-item">
              <div class="fav-item-icon">${f.emoji || '⭐'}</div>
              <div class="fav-item-info">
                <div class="fav-item-name">${f.name}</div>
                <div class="fav-item-price">${f.price} ريال</div>
              </div>
              <div class="fav-item-remove" onclick="removeFav('${f.id}')" title="حذف من المفضلة">
                <i class="fas fa-times"></i>
              </div>
            </div>
          `).join('')
        }
      </div>
      ${favs.length > 0 ? `
        <div class="favorites-footer">
          <button class="btn-add-all" onclick="addAllFavsToCart()">
            <i class="fas fa-shopping-cart"></i> إضافة الكل لطلباتي
          </button>
        </div>
      ` : ''}
    `;
  }

  window.removeFav = function(id) {
    const favs = getFavs().filter(f => f.id !== id);
    saveFavs(favs);
    const drawer = document.getElementById('fav-drawer');
    if (drawer) renderFavDrawer(drawer);
    if (window.showToast) window.showToast('تمت إزالة العنصر من المفضلة');
  };

  window.addAllFavsToCart = function() {
    getFavs().forEach(f => {
      if (window.addToCart) window.addToCart(f.id, f.name, f.price, f.emoji);
    });
    closeFavoritesDrawer();
  };

  /* ==================== FLOATING ACTIONS — RIGHT SIDE ==================== */
  /* يمين الصفحة: مشاركة | مفضلة | أعلى الصفحة */
  function injectFloatingActionsRight() {
    if (document.querySelector('.site-floating-actions-right')) return;

    const wrap = document.createElement('div');
    wrap.className = 'site-floating-actions-right';

    // Share button
    const shareBtn = document.createElement('button');
    shareBtn.className = 'site-floating-btn share';
    shareBtn.title = 'مشاركة الصفحة';
    shareBtn.setAttribute('aria-label', 'مشاركة');
    shareBtn.innerHTML = '<i class="fas fa-share-nodes"></i>';
    shareBtn.onclick = () => window.shareCurrentPage && window.shareCurrentPage();

    // Favorites button
    const favBtn = document.createElement('button');
    favBtn.className = 'site-floating-btn fav';
    favBtn.title = 'المفضلة';
    favBtn.setAttribute('aria-label', 'المفضلة');
    favBtn.innerHTML = '<i class="fas fa-heart"></i>';
    favBtn.onclick = openFavoritesDrawer;

    // Back to top button
    const topBtn = document.createElement('button');
    topBtn.className = 'site-floating-btn top';
    topBtn.title = 'أعلى الصفحة';
    topBtn.setAttribute('aria-label', 'العودة للأعلى');
    topBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    topBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    wrap.appendChild(shareBtn);
    wrap.appendChild(favBtn);
    wrap.appendChild(topBtn);
    document.body.appendChild(wrap);
  }

  /* ==================== HOMEPAGE: SPECIALIZATIONS PROMO ==================== */
  const SPECS_DATA = [
    { name: 'علوم الحاسب', icon: '💻', count: '12+ خدمة', color: '#1e3a8a' },
    { name: 'هندسة البرمجيات', icon: '⚙️', count: '10+ خدمة', color: '#7c3aed' },
    { name: 'نظم المعلومات', icon: '🗃️', count: '8+ خدمة', color: '#0891b2' },
    { name: 'إدارة الأعمال', icon: '📈', count: '9+ خدمة', color: '#059669' },
    { name: 'هندسة الحاسب', icon: '🔧', count: '7+ خدمة', color: '#d97706' },
    { name: 'الأمن السيبراني', icon: '🛡️', count: '6+ خدمة', color: '#dc2626' },
    { name: 'الذكاء الاصطناعي', icon: '🤖', count: '8+ خدمة', color: '#7c3aed' },
    { name: 'الشبكات والاتصالات', icon: '🌐', count: '5+ خدمة', color: '#0284c7' },
  ];

  function injectSpecializationsPromo() {
    const target = document.getElementById('specs-promo-section');
    if (!target || target.dataset.injected) return;
    target.dataset.injected = '1';

    target.innerHTML = `
      <div class="container">
        <div class="text-center" style="margin-bottom:0">
          <div class="section-chip"><i class="fas fa-graduation-cap"></i> التخصصات</div>
          <h2 class="section-title">خدمات لكل تخصص جامعي</h2>
          <p class="section-subtitle text-center">ندعم طلاب جميع التخصصات بخدمات أكاديمية متخصصة</p>
        </div>
        <div class="specs-promo-grid">
          ${SPECS_DATA.map(s => `
            <a href="specializations.html" class="spec-promo-card">
              <span class="spec-promo-icon">${s.icon}</span>
              <div class="spec-promo-name" style="color:${s.color}">${s.name}</div>
              <div class="spec-promo-count">${s.count}</div>
            </a>
          `).join('')}
        </div>
        <div style="text-align:center;margin-top:32px">
          <a href="specializations.html" class="btn-outline">
            <i class="fas fa-graduation-cap"></i>
            عرض جميع التخصصات
          </a>
        </div>
      </div>
    `;
  }

  /* ==================== HOMEPAGE: TOOLS TEASER ==================== */
  const TOOLS_DATA = [
    { icon: '📊', name: 'حاسبة GPA', desc: 'احسب معدلك التراكمي بدقة عالية', link: 'tools.html#gpa' },
    { icon: '🖼️', name: 'تحويل صور → PDF', desc: 'حوّل صورك إلى PDF في ثوانٍ', link: 'tools.html#pdf' },
    { icon: '📚', name: 'توليد المراجع APA', desc: 'أنشئ مراجع بصيغة APA تلقائياً', link: 'tools.html#cite' },
    { icon: '🔄', name: 'محول الدرجات', desc: 'حوّل بين النسب والنقاط والحروف', link: 'tools.html#convert' },
  ];

  function injectToolsTeaser() {
    const target = document.getElementById('tools-teaser-section');
    if (!target || target.dataset.injected) return;
    target.dataset.injected = '1';

    target.innerHTML = `
      <div class="container">
        <div class="text-center" style="margin-bottom:0">
          <div class="section-chip"><i class="fas fa-tools"></i> الأدوات المجانية</div>
          <h2 class="section-title">أدوات أكاديمية مجانية</h2>
          <p class="section-subtitle text-center">مجموعة أدوات مجانية تساعدك في دراستك — بدون تسجيل أو دفع</p>
        </div>
        <div class="tools-teaser-grid">
          ${TOOLS_DATA.map(t => `
            <a href="${t.link}" class="tool-teaser-card" style="text-decoration:none">
              <div class="tool-icon">${t.icon}</div>
              <h4>${t.name}</h4>
              <p>${t.desc}</p>
            </a>
          `).join('')}
        </div>
        <div style="text-align:center;margin-top:32px">
          <a href="tools.html" class="btn-primary" style="display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:var(--grad-primary);color:white;border-radius:14px;font-weight:700;text-decoration:none">
            <i class="fas fa-tools"></i>
            استخدام جميع الأدوات مجاناً
          </a>
        </div>
      </div>
    `;
  }

  /* ==================== HOMEPAGE: WHY SANAD SECTION ==================== */
  function injectWhySanad() {
    const target = document.getElementById('why-sanad-section');
    if (!target || target.dataset.injected) return;
    target.dataset.injected = '1';

    const features = [
      { icon: '⚡', title: 'تسليم سريع', desc: 'نلتزم بالمواعيد المحددة. معظم الطلبات تُسلَّم خلال 24-72 ساعة.' },
      { icon: '✅', title: 'جودة مضمونة', desc: 'تعديلات مجانية غير محدودة حتى تصل لرضاك التام.' },
      { icon: '🔒', title: 'سرية تامة', desc: 'بياناتك وطلباتك محمية بالكامل ولا تُشارَك مع أحد.' },
      { icon: '💰', title: 'أسعار تنافسية', desc: 'أفضل الأسعار في السوق مع جودة لا تُضاهى.' },
      { icon: '🎓', title: 'خبراء أكاديميون', desc: 'فريق من المتخصصين في مجالاتهم مع خبرة أكاديمية واسعة.' },
      { icon: '📱', title: 'دعم مستمر', desc: 'متواجدون يومياً من 8 صباحاً حتى منتصف الليل.' },
    ];

    target.innerHTML = `
      <div class="container">
        <div class="text-center">
          <div class="section-chip"><i class="fas fa-graduation-cap"></i> لماذا سند؟</div>
          <h2 class="section-title">أكاديمية متكاملة في مكان واحد</h2>
          <p class="section-subtitle text-center">كل ما يحتاجه الطالب من خدمات أكاديمية وأدوات مجانية وتواصل سريع</p>
        </div>
        <div class="features-grid" style="margin-top:40px">
          ${features.map(f => `
            <div class="feature-card">
              <div class="feature-icon">${f.icon}</div>
              <div class="feature-title">${f.title}</div>
              <div class="feature-desc">${f.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* ==================== HOMEPAGE: STATS SECTION ==================== */
  function injectStats() {
    const target = document.getElementById('stats-section');
    if (!target || target.dataset.injected) return;
    target.dataset.injected = '1';

    target.innerHTML = `
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item"><span class="stat-number">+500</span><div class="stat-label">طلب مكتمل</div></div>
          <div class="stat-item"><span class="stat-number">+200</span><div class="stat-label">طالب راضٍ</div></div>
          <div class="stat-item"><span class="stat-number">+20</span><div class="stat-label">تخصص جامعي</div></div>
          <div class="stat-item"><span class="stat-number">98%</span><div class="stat-label">نسبة الرضا</div></div>
        </div>
      </div>
    `;
  }

  /* ==================== HOMEPAGE: TESTIMONIALS ==================== */
  function injectTestimonials() {
    const target = document.getElementById('testimonials-section');
    if (!target || target.dataset.injected) return;
    target.dataset.injected = '1';

    const testimonials = [
      { name: 'أحمد الشمري', role: 'طالب علوم حاسب - KSU', stars: 5, text: 'الخدمة ممتازة جداً! قدمت مشروع التخرج في الوقت المحدد وبجودة فائقة. أنصح الجميع بمنصة سند.' },
      { name: 'سارة المحمدي', role: 'طالبة نظم معلومات', stars: 5, text: 'ساعدتني في إعداد بحث الماجستير بشكل احترافي. التواصل كان سريعاً والنتيجة فوق التوقعات.' },
      { name: 'خالد العتيبي', role: 'طالب هندسة برمجيات', stars: 5, text: 'استخدمت حاسبة GPA وأدوات التحويل، رائعة جداً ومجانية! والخدمات الأكاديمية ممتازة.' },
      { name: 'نورة السعيد', role: 'طالبة إدارة أعمال', stars: 5, text: 'سرعة في التسليم وجودة عالية في التقارير. المنصة وفّرت عليّ الكثير من الوقت والجهد.' },
      { name: 'محمد البقمي', role: 'طالب أمن سيبراني', stars: 5, text: 'تجربة رائعة من البداية للنهاية. الفريق متعاون ومحترف والنتائج ممتازة دائماً.' },
      { name: 'ريم الدوسري', role: 'طالبة علوم حاسب', stars: 5, text: 'أفضل منصة أكاديمية تعاملت معها. الأسعار مناسبة والجودة عالية جداً. شكراً سند!' },
    ];

    target.innerHTML = `
      <div class="container">
        <div class="text-center">
          <div class="section-chip"><i class="fas fa-star"></i> آراء الطلاب</div>
          <h2 class="section-title">ماذا يقول طلابنا؟</h2>
          <p class="section-subtitle text-center">آلاف الطلاب وثقوا بنا وعادوا مراراً</p>
        </div>
        <div class="testimonials-grid">
          ${testimonials.map(t => `
            <div class="testimonial-card">
              <div class="testimonial-stars">${'★'.repeat(t.stars)}</div>
              <p class="testimonial-text">"${t.text}"</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar">${t.name.charAt(0)}</div>
                <div>
                  <div class="testimonial-name">${t.name}</div>
                  <div class="testimonial-role">${t.role}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* ==================== HOMEPAGE: CTA SECTION ==================== */
  function injectCTA() {
    const target = document.getElementById('cta-section');
    if (!target || target.dataset.injected) return;
    target.dataset.injected = '1';

    target.innerHTML = `
      <div class="container">
        <h2>جاهز لتحقيق أفضل النتائج؟ 🚀</h2>
        <p>انضم لآلاف الطلاب الذين وثقوا بمنصة سند التعليمية</p>
        <div class="cta-btns">
          <a href="https://wa.me/966533940866" target="_blank" class="btn-primary" style="text-decoration:none">
            <i class="fab fa-whatsapp"></i> تواصل عبر واتساب
          </a>
          <a href="tools.html" class="btn-secondary" style="text-decoration:none">
            <i class="fas fa-tools"></i> الأدوات المجانية
          </a>
        </div>
      </div>
    `;
  }

  /* ==================== FAQ SECTION ==================== */
  function injectFAQ() {
    const target = document.getElementById('faq-section');
    if (!target || target.dataset.injected) return;
    target.dataset.injected = '1';

    const faqs = [
      { q: 'متى تظهر بيانات الحساب الخاص بي؟', a: 'يتم التواصل معك عبر واتساب فور استلام طلبك وتأكيده. عادةً خلال أقل من 30 دقيقة.' },
      { q: 'هل الأدوات المجانية تعمل بدون اتصال؟', a: 'معظم الأدوات تعمل بالكامل في المتصفح وبعضها يحتاج اتصال بالإنترنت للمزامنة.' },
      { q: 'هل يمكنني طلب مراجعة بعد التسليم؟', a: 'نعم، نقدم تعديلات مجانية غير محدودة حتى تكون راضياً تماماً عن العمل المقدم.' },
      { q: 'ما هي طرق الدفع المتاحة؟', a: 'نقبل التحويل البنكي، STC Pay، وبعض المنصات الإلكترونية الأخرى. سيوضح الفريق الخيارات عند الطلب.' },
      { q: 'هل تحافظون على سرية بياناتي؟', a: 'نعم، بالتأكيد. بياناتك وطلباتك محمية بالكامل ولا تُشارك مع أي طرف ثالث.' },
    ];

    target.innerHTML = `
      <div class="container">
        <div class="text-center">
          <div class="section-chip"><i class="fas fa-question-circle"></i> الأسئلة الشائعة</div>
          <h2 class="section-title">أسئلة يسألها الطلاب</h2>
        </div>
        <div style="max-width:700px;margin:40px auto 0">
          <div class="faq-list">
            ${faqs.map((f, i) => `
              <div class="faq-item ${i === 0 ? 'open' : ''}">
                <button class="faq-trigger" type="button"><span>${f.q}</span></button>
                <div class="faq-body"><p>${f.a}</p></div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Init FAQ accordion after injection
    setTimeout(() => {
      target.querySelectorAll('.faq-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = btn.closest('.faq-item');
          const wasOpen = item?.classList.contains('open');
          target.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
          if (!wasOpen) item?.classList.add('open');
        });
      });
    }, 50);
  }

  /* ==================== INIT ==================== */
  function init() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const isHome = page === 'index.html' || page === '';

    // Always inject right-side floating actions
    injectFloatingActionsRight();

    if (isHome) {
      injectSpecializationsPromo();
      injectToolsTeaser();
      injectWhySanad();
      injectStats();
      injectTestimonials();
      injectCTA();
      injectFAQ();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
