/**
 * ================================================================
 *   منصة سند التعليمية — Main JS 2026
 *   Cart + AI Assistant Advanced + Utils
 * ================================================================
 */
'use strict';

const CART_KEY = 'sanad_cart_v3';
const WA_NUMBER = '966533940866';

/* ==================== CART CORE ==================== */
function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(id, name, price, emoji = '📚') {
  const cart = loadCart();
  if (cart.find(i => i.id === id)) {
    showToast('السلة تحتوي هذه الخدمة بالفعل ✅', 'info');
    highlightCartBtn();
    return;
  }
  cart.push({ id, name, price, emoji, addedAt: Date.now() });
  saveCart(cart);
  refreshCartUI();
  showToast(`🛒 أُضيفت "${name}" إلى السلة`);
  pulseBadge();
  markBtnAdded(id, name, price);
  openCartMoment();
}

function removeFromCart(id) {
  const cart = loadCart().filter(i => i.id !== id);
  saveCart(cart);
  refreshCartUI();
  restoreBtnState(id);
  showToast('تمت الإزالة من السلة', 'info');
}

function getCartTotal() {
  return loadCart().reduce((s, i) => s + (i.price || 0), 0);
}

/* ==================== CART UI ==================== */
function refreshCartUI() {
  const cart = loadCart();
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.textContent = cart.length;
    badge.style.display = cart.length ? 'flex' : 'none';
  }
  const tot = document.getElementById('cart-total');
  if (tot) {
    const total = getCartTotal();
    tot.textContent = total > 0 ? total + ' ريال' : 'يُحدَّد عبر واتساب';
  }
  renderCartItems();
}

function renderCartItems() {
  const cart = loadCart();
  const body = document.getElementById('cart-body');
  if (!body) return;

  if (!cart.length) {
    body.innerHTML = `
      <div class="cart-empty-state">
        <div class="cart-empty-icon">🛒</div>
        <p style="font-weight:800;margin-bottom:6px;color:var(--text-dark);">السلة فارغة!</p>
        <p style="font-size:13px;color:var(--text-muted);">أضف خدمات من القائمة للبدء</p>
        <a href="specializations.html" class="btn btn-primary btn-sm" style="margin-top:16px;">
          <i class="fas fa-layer-group"></i> استعرض التخصصات
        </a>
      </div>`;
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-item" id="ci-${item.id}">
      <div class="ci-icon">${item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">${item.price > 0 ? item.price + ' ريال' : 'يُحدَّد لاحقًا'}</div>
      </div>
      <button class="ci-remove" onclick="removeFromCart('${item.id}')" title="إزالة">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  `).join('');
}

function toggleCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (!drawer) return;
  const isOpen = drawer.classList.contains('open');
  drawer.classList.toggle('open', !isOpen);
  if (overlay) overlay.classList.toggle('open', !isOpen);
}

function openCartMoment() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (!drawer || drawer.classList.contains('open')) return;
  drawer.classList.add('open');
  if (overlay) overlay.classList.add('open');
  setTimeout(() => {
    if (!drawer.matches(':hover')) {
      drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
    }
  }, 3800);
}

function highlightCartBtn() {
  const btn = document.querySelector('.cart-trigger');
  if (!btn) return;
  btn.style.transform = 'scale(1.1)';
  setTimeout(() => { btn.style.transform = ''; }, 400);
}

function pulseBadge() {
  const b = document.getElementById('cart-count');
  if (!b) return;
  b.classList.add('pop');
  setTimeout(() => b.classList.remove('pop'), 400);
}

function markBtnAdded(id, name, price) {
  // Support both naming conventions: btn-{id} and btn-{id} with dots replaced
  const btn = document.getElementById('btn-' + id) ||
              document.querySelector(`[data-item-id="${id}"]`);
  if (!btn) return;
  btn.classList.add('added');
  const priceTxt = price > 0 ? ' — ' + price + ' ريال' : '';
  btn.innerHTML = `<i class="fas fa-check-circle"></i> في السلة${priceTxt}`;
  btn.disabled = false; // keep clickable so user can see it's in cart
}

function restoreBtnState(id) {
  const btn = document.getElementById('btn-' + id) ||
              document.querySelector(`[data-item-id="${id}"]`);
  if (!btn) return;
  btn.classList.remove('added');
  btn.innerHTML = `<i class="fas fa-cart-plus"></i> أضف للسلة`;
}

function restoreAllCartBtns() {
  loadCart().forEach(item => markBtnAdded(item.id, item.name, item.price));
}

function goToCheckout() {
  if (!loadCart().length) {
    showToast('السلة فارغة! أضف خدمة أولًا', 'error');
    return;
  }
  window.location.href = 'checkout.html';
}

/* ==================== TOAST ==================== */
function showToast(msg, type = 'success') {
  let stack = document.getElementById('toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.id = 'toast-stack';
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
  const t = document.createElement('div');
  t.className = `toast ${type !== 'success' ? type : ''}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  t.innerHTML = `${icons[type] || ''} ${msg}`;
  stack.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

/* ==================== COPY TEXT ==================== */
function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✅ تم النسخ';
    btn.style.background = 'var(--success)';
    btn.style.color = 'white';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; }, 2000);
    showToast('تم نسخ النص ✅');
  }).catch(() => {
    try {
      const el = Object.assign(document.createElement('textarea'), { value: text });
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      el.remove();
      showToast('تم نسخ النص ✅');
    } catch(e) { showToast('تعذر النسخ', 'error'); }
  });
}

/* ==================== SCROLL ANIMATIONS ==================== */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ==================== COUNTER ANIMATION ==================== */
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const text = el.dataset.target || el.textContent;
      const match = text.match(/\d+/);
      if (!match) return;
      const target = parseInt(match[0]);
      const prefix = text.replace(/[\d,+%]+.*/, '');
      const suffix = text.slice(text.search(/\d/) + match[0].length);
      const dur = 1800;
      const start = performance.now();
      const animate = t => {
        const p = Math.min((t - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.floor(ease * target) + suffix;
        if (p < 1) requestAnimationFrame(animate);
        else el.textContent = text;
      };
      requestAnimationFrame(animate);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.s-num').forEach(el => obs.observe(el));
}

/* ==================== MOBILE NAV ==================== */
function toggleMobileNav() {
  const nav = document.getElementById('mobile-nav');
  const icon = document.getElementById('mobile-icon');
  const overlay = document.getElementById('mobile-nav-overlay');
  if (!nav) return;
  const isOpen = nav.classList.contains('open');
  nav.classList.toggle('open', !isOpen);
  if (overlay) overlay.classList.toggle('open', !isOpen);
  if (icon) {
    icon.className = isOpen ? 'fas fa-bars' : 'fas fa-times';
  }
  // Prevent body scroll when nav is open
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

/* ==================== HEADER SCROLL ==================== */
function initHeaderScroll() {
  const h = document.querySelector('.site-header');
  if (!h) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) h.classList.add('scrolled');
    else h.classList.remove('scrolled');
  }, { passive: true });
}

/* ==================== SMOOTH SCROLL ==================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ==================== KSU VARIANTS ==================== */
const ksuVariants = {};
function selectVariant(btn, itemId, price, label) {
  btn.closest('.price-variants').querySelectorAll('.pv-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  ksuVariants[itemId] = { price, label };
}
function addToCartKSU(id, defLabel, defPrice, emoji) {
  const v = ksuVariants[id];
  addToCart(id, v ? v.label : defLabel, v ? v.price : defPrice, emoji);
}

/* ==================== ESCAPE KEY ==================== */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer?.classList.contains('open')) {
      drawer.classList.remove('open');
      overlay?.classList.remove('open');
    }
    closeAIChat();
  }
});

/* ==================== AI ASSISTANT ADVANCED ==================== */
const AI_NAME = 'سند الذكي 🤖';
let aiOpen = false;
let aiTyping = false;

const AI_KNOWLEDGE = {
  greetings: ['مرحبا', 'هلا', 'السلام', 'صباح', 'مساء', 'اهلا', 'هاي', 'هاى', 'كيف حالك', 'ازيك'],
  help: ['مساعدة', 'ساعدني', 'كيف', 'ما هو', 'وش', 'ايش', 'ما هي', 'اعرف'],
  services: ['خدمات', 'ايش تقدمون', 'ماذا تقدمون', 'الخدمات', 'عندكم', 'تقدرون'],
  health: ['صحي', 'طبي', 'تمريض', 'nursing', 'صحة', 'طب', 'صيدلة', 'علاج', 'care plan', 'case study', 'logbook', 'اشعة', 'مختبر'],
  cs: ['برمجة', 'كمبيوتر', 'حاسب', 'java', 'python', 'html', 'بايثون', 'تطبيق', 'موقع', 'database', 'sql', 'كود', 'مشروع برمجة', 'c++', 'c#'],
  science: ['علمي', 'فيزياء', 'كيمياء', 'احياء', 'رياضيات', 'احصاء', 'تفاضل', 'جبر'],
  business: ['اداري', 'محاسبة', 'ادارة', 'اقتصاد', 'محاسبي', 'تسويق', 'موارد', 'mis', 'قانون', 'تجاري'],
  ksu: ['كاو', 'ksu', 'الملك سعود', 'ca', 'مشاريع ksu', 'اكسل', 'وورد', 'ريد', 'access', 'مشاريع جامعة', 'المشتركة'],
  price: ['سعر', 'كم', 'تكلفة', 'غالي', 'رخيص', 'بكم', 'أسعار', 'ميزانية'],
  order: ['طلب', 'اطلب', 'كيف اطلب', 'شراء', 'ارسل', 'احتاج', 'اريد طلب'],
  payment: ['دفع', 'تحويل', 'انماء', 'بنك', 'ايبان', 'حساب', 'دفعة'],
  contact: ['تواصل', 'واتساب', 'تيليجرام', 'رقم', 'اتصل', 'رسالة'],
  preparatory: ['تحضيري', 'انتقالي', 'سنة اولى', 'مستوى اول', 'مشترك'],
  english: ['انجليزي', 'لغة انجليزية', 'english', 'essay', 'grammar', 'ترجمة', 'translation'],
  school: ['مدرسة', 'ثانوية', 'متوسطة', 'ابتدائية', 'طالب مدرسة'],
  tools: ['ادوات', 'مجانية', 'pdf', 'gpa', 'معدل', 'حاسبة', 'مؤقت', 'qr'],
  nav: ['انتقل', 'اذهب', 'افتح', 'وين', 'اين', 'رابط', 'صفحة'],
};

const AI_RESPONSES = {
  greeting: {
    text: 'أهلًا وسهلًا! 👋 أنا **سند الذكي** — مساعدك الأكاديمي المتخصص في منصة سند التعليمية.\n\nأستطيع مساعدتك في: استعراض الخدمات، الأسعار، طريقة الطلب، والتنقل بين صفحات الموقع.\n\nبماذا أخدمك اليوم؟',
    chips: ['🔎 استعرض الخدمات', '🎓 مشاريع KSU', '💰 أسعار الخدمات', '📋 كيف أطلب؟']
  },
  services: {
    text: 'نقدم خدمات أكاديمية متكاملة لجميع التخصصات 📚:\n\n💊 **المسار الصحي والطبي** — تمريض، طب، صيدلة\n💻 **البرمجة والحاسب** — Java, Python, مواقع\n🔬 **المسار العلمي** — رياضيات، فيزياء، كيمياء\n💼 **الإداري والمحاسبي** — محاسبة، إدارة، اقتصاد\n✍️ **التحضيري** — السنة الأولى\n🇬🇧 **الإنجليزية** — مقالات، grammar\n🏫 **طلاب المدارس** — جميع المراحل',
    chips: ['💊 المسار الصحي', '💻 البرمجة', '💼 الإداري', '🎓 مشاريع KSU'],
    navLinks: [{ text: '📚 عرض جميع التخصصات', href: 'specializations.html' }]
  },
  health: {
    text: '💊 **خدمات المسار الصحي والطبي:**\n\n✅ حل الواجبات والاختبارات\n✅ كتابة الأبحاث (Proposal/Research)\n✅ تكاليف جميع المواد\n✅ Nursing Care Plan + Case Study\n✅ تصميم PowerPoint احترافي\n✅ Logbook & Comprehensive Assessment\n✅ Case Study Presentation\n✅ Medical Reports & Summaries',
    chips: ['💰 الأسعار', '📋 اطلب الآن', '🔍 خدمات أخرى'],
    navLinks: [{ text: '💊 صفحة المسار الصحي', href: 'health.html' }]
  },
  cs: {
    text: '💻 **خدمات البرمجة والحاسب:**\n\n✅ مشاريع كاملة (مواقع، تطبيقات)\n✅ Java, C#, C++, Python, Swift\n✅ HTML, CSS, JavaScript, PHP, .NET\n✅ قواعد البيانات (SQL, MySQL, Oracle)\n✅ هياكل البيانات والخوارزميات\n✅ تحليل وتصميم النظم (UML)\n✅ Word, Excel, Access, PowerPoint',
    chips: ['💰 الأسعار', '📋 اطلب الآن', '🔍 خدمات أخرى'],
    navLinks: [{ text: '💻 صفحة البرمجة والحاسب', href: 'cs.html' }]
  },
  science: {
    text: '🔬 **خدمات المسار العلمي:**\n\n✅ حل مسائل الرياضيات والفيزياء\n✅ تقارير الكيمياء والأحياء\n✅ الإحصاء والتحليل العلمي\n✅ أبحاث علمية موثقة\n✅ Lab Reports & Experiments\n✅ عروض تقديمية علمية',
    chips: ['💰 الأسعار', '📋 اطلب الآن', '🔍 خدمات أخرى'],
    navLinks: [{ text: '🔬 صفحة المسار العلمي', href: 'science.html' }]
  },
  business: {
    text: '💼 **خدمات الإداري والمحاسبي:**\n\n✅ مشاريع ومبادئ المحاسبة\n✅ الإدارة وأساسياتها\n✅ التسويق وبحوث السوق\n✅ القانون التجاري والأعمال\n✅ الاقتصاد الجزئي والكلي\n✅ نظم المعلومات الإدارية\n✅ تقارير وحالات دراسية',
    chips: ['💰 الأسعار', '📋 اطلب الآن', '🔍 خدمات أخرى'],
    navLinks: [{ text: '💼 صفحة الإداري والمحاسبي', href: 'business.html' }]
  },
  ksu: {
    text: '🎓 **مشاريع جامعة الملك سعود المشتركة:**\n\n🇬🇧 مشروع CA الإنجليزي — **120 ريال**\n📑 التكليف البحثي APA — **50 ريال**\n🎨 عرض PowerPoint — **75 ريال**\n🧠 خريطة ذهنية — **35-50 ريال**\n📄 مشروع Word — **750 ريال**\n📊 مشروع Excel — **100 ريال**\n🗃️ قاعدة بيانات Access — **80 ريال**\n🏆 مشروع الريد — **200 ريال**\n\n⚡ تسليم خلال 4-48 ساعة!',
    chips: ['📋 اطلب KSU الآن', '💳 طريقة الدفع', '🔍 خدمات أخرى'],
    navLinks: [{ text: '🎓 صفحة مشاريع KSU', href: 'ksu.html' }]
  },
  price: {
    text: '💰 **معلومات الأسعار:**\n\n✅ **أسعار KSU** محددة مسبقًا في صفحة المشاريع\n\n📋 **الخدمات العامة** تُسعَّر عبر واتساب بناءً على:\n• طبيعة المطلوب وحجمه\n• موعد التسليم المطلوب\n• التخصص والمادة\n\n💡 الأسعار تنافسية ومناسبة للطلاب 😊',
    chips: ['🎓 أسعار KSU المحددة', '💬 تواصل للتسعير', '📋 كيف أطلب؟']
  },
  order: {
    text: '📋 **خطوات الطلب بسهولة:**\n\n1️⃣ أضف الخدمة للسلة 🛒\n2️⃣ اضغط "إتمام الطلب"\n3️⃣ أدخل بياناتك الدراسية\n4️⃣ حوّل المبلغ لبنك الإنماء 🏦\n5️⃣ أرفق إيصال التحويل 📎\n6️⃣ تُرسَل تفاصيل طلبك لواتسابنا تلقائيًا ✅\n\n⚡ فريقنا يبدأ العمل فورًا!',
    chips: ['🛒 إتمام الطلب الآن', '🏦 بيانات البنك', '💬 تواصل معنا']
  },
  payment: {
    text: '🏦 **بيانات التحويل البنكي:**\n\n• البنك: **بنك الإنماء**\n• الاسم: **مؤسسة كريتيفا جلوبال ات**\n• رقم الحساب: **68206067557000**\n• الآيبان: **SA4905000068206067557000**\n\n📎 بعد التحويل أرفق صورة الإيصال عند إتمام الطلب',
    chips: ['🛒 إتمام الطلب', '💬 تواصل معنا']
  },
  contact: {
    text: '📞 **تواصل معنا مباشرة:**\n\n💬 واتساب: **+966 53 394 0866**\n📢 تيليجرام: **@Helping_KSU**\n\n🟢 متاحون على مدار الساعة 24/7\n⚡ متوسط الرد أقل من 30 دقيقة',
    chips: ['📱 واتساب الآن', '💰 الأسعار', '📋 كيف أطلب؟']
  },
  tools: {
    text: '🧰 **الأدوات المجانية المتاحة:**\n\n🖼️ تحويل الصور إلى PDF\n🌍 ترجمة النصوص والملفات\n📊 حاسبة المعدل GPA\n⏳ مؤقت بومودورو للمذاكرة\n📝 عداد الكلمات\n🔗 صانع QR Code\n\n✅ تعمل مجاناً بدون تسجيل!',
    chips: ['🧰 فتح الأدوات', '📚 الخدمات الأكاديمية'],
    navLinks: [{ text: '🧰 صفحة الأدوات المجانية', href: 'tools.html' }]
  },
  nav: {
    text: 'يمكنني توجيهك لأي صفحة في الموقع 🗺️\n\nاختر الصفحة التي تريد الانتقال إليها:',
    chips: ['🏠 الرئيسية', '📚 التخصصات', '🎓 مشاريع KSU', '🧰 الأدوات المجانية', '🛒 إتمام الطلب']
  },
  default: {
    text: 'عذرًا، لم أتمكن من فهم سؤالك تمامًا 😅\n\nيمكنني مساعدتك في هذه المواضيع:',
    chips: ['📚 استعرض الخدمات', '💰 الأسعار', '📋 كيف أطلب؟', '💬 تواصل معنا', '🧰 الأدوات المجانية']
  }
};

function detectIntent(text) {
  const t = text.toLowerCase().trim();
  // Check chips/special
  if (t.includes('استعرض الخدمات') || t.includes('الخدمات')) return 'services';
  if (t.includes('مشاريع ksu') || t.includes('ksu')) return 'ksu';
  if (t.includes('الأسعار') || t.includes('أسعار')) return 'price';
  if (t.includes('كيف أطلب') || t.includes('إتمام الطلب')) return 'order';
  if (t.includes('واتساب الآن') || t.includes('تواصل معنا')) return 'contact';
  if (t.includes('بيانات البنك') || t.includes('الدفع')) return 'payment';
  if (t.includes('الأدوات') || t.includes('أدوات')) return 'tools';

  for (const [intent, keywords] of Object.entries(AI_KNOWLEDGE)) {
    if (keywords.some(k => t.includes(k))) return intent;
  }
  return 'default';
}

function getAIResponse(text) {
  const intent = detectIntent(text);
  const map = {
    greetings: 'greeting', help: 'services', services: 'services',
    health: 'health', cs: 'cs', science: 'science',
    business: 'business', ksu: 'ksu', price: 'price',
    order: 'order', payment: 'payment', contact: 'contact',
    preparatory: 'services', english: 'services', school: 'services',
    tools: 'tools', nav: 'nav', default: 'default'
  };
  return AI_RESPONSES[map[intent] || 'default'];
}

function openAIChat() {
  const win = document.getElementById('ai-chat-window');
  if (!win) return;
  aiOpen = true;
  win.classList.add('open');
  if (!win.dataset.welcomed) {
    win.dataset.welcomed = '1';
    setTimeout(() => addAIMessage(AI_RESPONSES.greeting, false), 500);
  }
  // Focus input
  setTimeout(() => document.getElementById('ai-input')?.focus(), 400);
}

function closeAIChat() {
  const win = document.getElementById('ai-chat-window');
  if (win) { win.classList.remove('open'); aiOpen = false; }
}

function toggleAIChat() {
  aiOpen ? closeAIChat() : openAIChat();
}

function addAIMessage(data, isUser = false) {
  const msgs = document.getElementById('ai-messages');
  if (!msgs) return;

  const div = document.createElement('div');
  div.className = `ai-msg ${isUser ? 'user' : ''}`;

  const avatar = `<div class="ai-msg-avatar">${isUser ? '👤' : '🤖'}</div>`;

  let bubbleContent = (data.text || '')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  if (!isUser) {
    if (data.navLinks && data.navLinks.length) {
      const links = data.navLinks.map(l => `<a href="${l.href}" class="ai-chip" style="background:var(--primary);color:white;border:none;">${l.text}</a>`).join('');
      bubbleContent += `<div class="q-chips" style="margin-top:10px;">${links}</div>`;
    }
    if (data.chips) {
      bubbleContent += `<div class="q-chips">${data.chips.map(c => `<span class="ai-chip" onclick="handleChipClick(this)">${c}</span>`).join('')}</div>`;
    }
  }

  div.innerHTML = avatar + `<div class="ai-bubble">${bubbleContent}</div>`;
  if (isUser) div.insertBefore(div.lastChild, div.firstChild);

  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTypingIndicator() {
  const msgs = document.getElementById('ai-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'ai-msg';
  div.id = 'ai-typing-indicator';
  div.innerHTML = `<div class="ai-msg-avatar">🤖</div><div class="ai-bubble"><div class="ai-typing"><span></span><span></span><span></span></div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTypingIndicator() {
  document.getElementById('ai-typing-indicator')?.remove();
}

function sendAIMessage(text) {
  if (!text || !text.trim() || aiTyping) return;
  const clean = text.trim();
  addAIMessage({ text: clean }, true);
  const input = document.getElementById('ai-input');
  if (input) input.value = '';
  aiTyping = true;
  showTypingIndicator();

  const delay = 800 + Math.random() * 600;
  setTimeout(() => {
    removeTypingIndicator();
    aiTyping = false;

    // Navigation actions
    const navMap = {
      '🏠 الرئيسية': 'index.html',
      'الرئيسية': 'index.html',
      '📚 التخصصات': 'specializations.html',
      '🎓 مشاريع KSU': 'ksu.html',
      '🧰 الأدوات المجانية': 'tools.html',
      '🛒 إتمام الطلب': 'checkout.html',
      'إتمام الطلب الآن': 'checkout.html',
      '🛒 إتمام الطلب الآن': 'checkout.html',
      '💊 المسار الصحي': 'health.html',
      '💻 البرمجة': 'cs.html',
      '💼 الإداري': 'business.html',
      '🧰 فتح الأدوات': 'tools.html',
    };

    if (navMap[clean]) {
      window.location.href = navMap[clean];
      return;
    }
    if (clean.includes('📱 واتساب الآن') || clean.includes('واتساب الآن')) {
      window.open(`https://wa.me/${WA_NUMBER}`, '_blank');
      return;
    }
    if (clean.includes('📋 اطلب KSU الآن') || clean.includes('📋 اطلب الآن')) {
      window.location.href = 'checkout.html';
      return;
    }

    addAIMessage(getAIResponse(clean));
  }, delay);
}

function handleChipClick(el) {
  const chip = (typeof el === 'string') ? el : (el.textContent || '').trim();
  sendAIMessage(chip);
}

function handleAIKeyDown(e) {
  if (e.key === 'Enter') {
    const val = document.getElementById('ai-input')?.value;
    if (val && val.trim()) sendAIMessage(val);
  }
}

/* ==================== INIT ==================== */
document.addEventListener('DOMContentLoaded', () => {
  refreshCartUI();
  restoreAllCartBtns();
  initReveal();
  initCounters();
  initSmoothScroll();
  injectAIWidget();
  injectCartDrawer();
  injectWAFloat();
});

/* ==================== INJECT WIDGETS ==================== */
function injectAIWidget() {
  if (document.getElementById('ai-assistant-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'ai-assistant-btn';
  btn.className = 'ai-assistant-btn';
  btn.setAttribute('aria-label', 'مساعد سند الذكي');
  btn.innerHTML = `🤖<span class="ai-pulse"></span><span class="ai-label">مساعد سند الذكي</span>`;
  btn.onclick = toggleAIChat;
  document.body.appendChild(btn);

  const win = document.createElement('div');
  win.id = 'ai-chat-window';
  win.className = 'ai-chat-window';
  win.innerHTML = `
    <div class="ai-chat-head">
      <div class="ai-avatar">🤖</div>
      <div class="ai-head-info">
        <div class="ai-name">${AI_NAME}</div>
        <div class="ai-status"><span class="ai-status-dot"></span> متاح الآن — يجيب فورًا</div>
      </div>
      <button class="ai-chat-close" onclick="closeAIChat()" title="إغلاق">✕</button>
    </div>
    <div class="ai-messages" id="ai-messages"></div>
    <div class="ai-nav-bar" style="padding:10px 14px 0;background:#f8f9ff;border-top:1px solid var(--border);display:flex;gap:6px;flex-wrap:wrap;">
      <button class="ai-nav-btn" onclick="sendAIMessage('📚 التخصصات')"><i class="fas fa-layer-group"></i> التخصصات</button>
      <button class="ai-nav-btn" onclick="sendAIMessage('🎓 مشاريع KSU')"><i class="fas fa-university"></i> KSU</button>
      <button class="ai-nav-btn" onclick="sendAIMessage('🧰 فتح الأدوات')"><i class="fas fa-tools"></i> الأدوات</button>
      <button class="ai-nav-btn" onclick="window.open('https://wa.me/${WA_NUMBER}','_blank')"><i class="fab fa-whatsapp" style="color:#25d366;"></i> واتساب</button>
    </div>
    <div class="ai-input-area">
      <input type="text" class="ai-input" id="ai-input"
        placeholder="اكتب سؤالك هنا…"
        onkeydown="handleAIKeyDown(event)"
        autocomplete="off" dir="rtl">
      <button class="ai-send-btn" onclick="sendAIMessage(document.getElementById('ai-input').value)" title="إرسال">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  `;
  document.body.appendChild(win);

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    const w = document.getElementById('ai-chat-window');
    const b = document.getElementById('ai-assistant-btn');
    if (w && aiOpen && !w.contains(e.target) && !b.contains(e.target)) {
      closeAIChat();
    }
  });
}

function injectCartDrawer() {
  if (document.getElementById('cart-drawer')) return;

  const overlay = document.createElement('div');
  overlay.id = 'cart-overlay';
  overlay.className = 'cart-overlay';
  overlay.onclick = toggleCart;
  document.body.appendChild(overlay);

  const drawer = document.createElement('div');
  drawer.id = 'cart-drawer';
  drawer.className = 'cart-drawer';
  drawer.innerHTML = `
    <div class="cart-head">
      <h3><i class="fas fa-shopping-cart"></i> سلة الخدمات</h3>
      <button class="cart-close-btn" onclick="toggleCart()" title="إغلاق">✕</button>
    </div>
    <div class="cart-body" id="cart-body"></div>
    <div class="cart-foot">
      <div class="cart-total-row">
        <span>المجموع الكلي:</span>
        <span class="cart-total-amount" id="cart-total">0 ريال</span>
      </div>
      <button class="cart-checkout-btn" onclick="goToCheckout()">
        <i class="fas fa-check-circle"></i> إتمام الطلب
      </button>
    </div>
  `;
  document.body.appendChild(drawer);
  renderCartItems();
}

function injectWAFloat() {
  if (document.getElementById('wa-float')) return;
  const a = document.createElement('a');
  a.id = 'wa-float';
  a.className = 'wa-float';
  a.href = `https://wa.me/${WA_NUMBER}`;
  a.target = '_blank';
  a.title = 'تواصل معنا على واتساب';
  a.setAttribute('aria-label', 'تواصل على واتساب');
  a.innerHTML = '<i class="fab fa-whatsapp"></i>';
  document.body.appendChild(a);
}
