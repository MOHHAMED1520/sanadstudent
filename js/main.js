/**
 * ================================================================
 *   منصة سند التعليمية — Main JS 2026
 *   Cart, AI Assistant, Toast, Modal
 * ================================================================
 */

'use strict';

const CART_KEY = 'sanad_cart_2026';
const FAV_KEY  = 'sanad_fav_2026';

/* ==================== CART ==================== */
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function addToCart(id, name, price, emoji = '📦') {
  const cart = getCart();
  if (cart.find(i => i.id === id)) {
    showToast('هذه الخدمة موجودة بالفعل في طلباتك', 'info');
    return;
  }
  cart.push({ id, name, price, emoji, addedAt: Date.now() });
  saveCart(cart);
  refreshCartUI();
  showToast(`تمت إضافة "${name}" إلى طلباتك ✓`, 'success');
}
function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
  refreshCartUI();
  renderCartItems();
}
function refreshCartUI() {
  const cart = getCart();
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = cart.length;
    badge.style.display = cart.length > 0 ? 'flex' : 'none';
  }
}
function renderCartItems() {
  const body = document.getElementById('cart-body-items');
  if (!body) return;
  const cart = getCart();
  if (cart.length === 0) {
    body.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-cart"></i><p>لا توجد طلبات بعد</p><p style="font-size:0.8rem;color:var(--text-light);margin-top:8px">أضف خدمات لترى طلباتك هنا</p></div>`;
    updateCartTotal();
    return;
  }
  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-icon">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.price} ريال</div>
      </div>
      <div class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="حذف"><i class="fas fa-trash-alt"></i></div>
    </div>
  `).join('');
  updateCartTotal();
}
function updateCartTotal() {
  const totalEl = document.getElementById('cart-total-amount');
  if (!totalEl) return;
  const total = getCart().reduce((sum, i) => sum + (parseFloat(i.price) || 0), 0);
  totalEl.textContent = total.toFixed(0) + ' ريال';
}

/* Cart Drawer */
function openCart() {
  document.getElementById('cart-drawer')?.classList.add('open');
  document.getElementById('cart-overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCartItems();
}
function closeCart() {
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('cart-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ==================== FAVORITES ==================== */
function getFavs() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch { return []; }
}
function saveFavs(favs) { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); }
function toggleFav(id, name, price, emoji = '⭐') {
  const favs = getFavs();
  const idx = favs.findIndex(f => f.id === id);
  if (idx > -1) {
    favs.splice(idx, 1);
    saveFavs(favs);
    showToast(`تمت إزالة "${name}" من المفضلة`);
  } else {
    favs.push({ id, name, price, emoji, addedAt: Date.now() });
    saveFavs(favs);
    showToast(`تمت إضافة "${name}" إلى المفضلة ❤️`);
  }
}
function isFav(id) { return getFavs().some(f => f.id === id); }

/* ==================== TOAST ==================== */
function showToast(msg, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = `toast${type === 'error' ? ' error' : type === 'info' ? ' info' : ''}`;
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  t.innerHTML = `<span>${icon}</span> ${msg}`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3100);
}

/* ==================== SHARE ==================== */
window.shareCurrentPage = function() {
  const url = window.location.href;
  const text = '🎓 منصة سند التعليمية — أفضل منصة أكاديمية للطلاب';
  if (navigator.share) {
    navigator.share({ title: 'منصة سند', text, url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => showToast('تم نسخ رابط الصفحة ✓'));
  }
};

/* ==================== SUCCESS MODAL ==================== */
window.showSuccessModal = function(waUrl) {
  const overlay = document.getElementById('success-modal-overlay');
  if (overlay) {
    overlay.classList.add('open');
    document.getElementById('success-wa-btn')?.setAttribute('href', waUrl);
  }
};
function closeSuccessModal() {
  document.getElementById('success-modal-overlay')?.classList.remove('open');
}

/* ==================== AI KNOWLEDGE BASE ==================== */
const AI_KNOWLEDGE = {
  pricing: ['سعر','تكلفة','كم','ريال','اسعار','رسوم','سعر الخدمة'],
  projects: ['مشروع','تخرج','برمجة','تطبيق','موقع','نظام','قاعدة بيانات','جافا','بايثون','php','flutter'],
  reports: ['تقرير','بحث','مقال','مراجع','apa','ايباي','مصادر','توثيق','هارفارد'],
  gpa: ['gpa','معدل','درجة','حساب','نقطة','مادة','ساعة'],
  tools: ['أداة','أدوات','مجاني','مجانية','pdf','تحويل','مساعدة'],
  specs: ['تخصص','قسم','كلية','هندسة','علوم','حاسب','ادارة','نظم معلومات'],
  whatsapp: ['واتساب','تواصل','اتصل','رقم','تلفون'],
  delivery: ['وقت','توصيل','متى','كم يوم','مدة','سرعة'],
  guarantee: ['ضمان','رجعه','راجع','خطأ','مشكلة','جودة','معدل مضمون'],
  ksu: ['كاو','جامعة الملك سعود','ksu','سعود'],
  greeting: ['مرحبا','هلا','السلام','صباح','مساء','اهلا','هي'],
};

function detectIntent(text) {
  const t = text.toLowerCase();
  for (const [intent, keywords] of Object.entries(AI_KNOWLEDGE)) {
    if (keywords.some(k => t.includes(k))) return intent;
  }
  return 'default';
}

const AI_RESPONSES = {
  greeting: [
    'أهلاً وسهلاً! 👋 أنا مساعد سند الذكي. كيف يمكنني مساعدتك اليوم؟\n\nيمكنني مساعدتك في:\n• الأسعار والخدمات\n• المشاريع والتقارير\n• الأدوات المجانية\n• التخصصات الجامعية',
    'مرحباً بك في منصة سند! 🎓 أنا هنا لمساعدتك. ما الذي تبحث عنه؟'
  ],
  pricing: [
    '💰 أسعارنا تنافسية وتبدأ من:\n\n• التقارير والبحوث: من 50 ريال\n• المشاريع البرمجية: من 200 ريال\n• مشاريع التخرج: من 500 ريال\n• الترجمة: من 30 ريال\n\nللحصول على سعر دقيق، تواصل معنا عبر واتساب مع تفاصيل طلبك.',
  ],
  projects: [
    '💻 نقدم مشاريع برمجية متكاملة:\n\n• تطبيقات الجوال (Flutter, React Native)\n• مواقع الويب (HTML/CSS/JS, PHP, Python)\n• أنظمة إدارة قواعد البيانات\n• الذكاء الاصطناعي والتعلم الآلي\n• مشاريع التخرج الجامعية\n\nالتسليم خلال 3-14 يوم حسب حجم المشروع. هل تريد التواصل مع فريقنا؟',
  ],
  reports: [
    '📝 خدمات التقارير والبحوث:\n\n• كتابة وتنسيق التقارير الجامعية\n• إعداد البحوث بتوثيق APA / Harvard\n• ترجمة وتدقيق المحتوى\n• إعداد العروض التقديمية (PPT)\n• تحرير وتدقيق رسائل الماجستير\n\nجودة عالية وتسليم في الوقت المحدد ✓',
  ],
  gpa: [
    '📊 يمكنك استخدام حاسبة GPA المجانية في صفحة الأدوات!\n\nكيفية الاستخدام:\n1. اذهب إلى صفحة الأدوات\n2. أدخل اسم المادة والساعات والدرجة\n3. اضغط "احسب" للحصول على المعدل فوراً\n\nهل تريد الانتقال إلى صفحة الأدوات؟',
  ],
  tools: [
    '🛠️ أدواتنا المجانية تشمل:\n\n• حاسبة GPA الدقيقة\n• تحويل الصور إلى PDF\n• توليد المراجع APA\n• محول الدرجات (GPA ↔ نسبة)\n• أداة التحقق من السرقة الأدبية\n• مولد الخطط الدراسية\n\nجميعها مجانية 100% بدون تسجيل!',
  ],
  specs: [
    '🎓 ندرس تخصصات متعددة:\n\n• علوم الحاسب والبرمجة\n• هندسة البرمجيات\n• نظم المعلومات الإدارية\n• إدارة الأعمال\n• هندسة الحاسب والشبكات\n• الأمن السيبراني\n• والمزيد...\n\nزر صفحة التخصصات لمشاهدة جميع الخدمات لكل تخصص.',
  ],
  whatsapp: [
    '📱 يمكنك التواصل معنا مباشرة:\n\n• واتساب: +966 533 940 866\n• تيليجرام: @Helping_KSU\n\nأوقات الرد: يومياً من 8 صباحاً - 12 منتصف الليل\nمتوسط وقت الرد: أقل من 30 دقيقة ⚡',
  ],
  delivery: [
    '⏱️ مواعيد التسليم المعتادة:\n\n• التقارير والبحوث: 24-72 ساعة\n• العروض التقديمية: 24-48 ساعة\n• المشاريع البرمجية الصغيرة: 3-5 أيام\n• مشاريع التخرج: 7-21 يوم\n• الترجمة: 24 ساعة\n\nنستطيع الإسراع عند الطوارئ مع إشعار مسبق.',
  ],
  guarantee: [
    '✅ ضماناتنا لك:\n\n• تعديلات مجانية غير محدودة\n• استرداد كامل إذا لم تكن راضياً\n• مراجعة قبل التسليم النهائي\n• سرية تامة لبياناتك\n• دعم مستمر بعد التسليم\n\nرضاك هو أولويتنا 💪',
  ],
  ksu: [
    '🏫 خدمات جامعة الملك سعود (KSU):\n\n• مشاريع CS 424, CS 484, CS 485\n• تقارير وبحوث جميع الأقسام\n• نماذج وأوراق الامتحانات السابقة\n• المساعدة في Blackboard\n• شرح المواد الصعبة\n\nهل تدرس في KSU؟ أخبرنا بتخصصك!',
  ],
  default: [
    'شكراً لسؤالك! 😊 دعني أساعدك.\n\nيمكنني الإجابة عن:\n• 💰 الأسعار والخدمات\n• 💻 المشاريع البرمجية\n• 📝 التقارير والبحوث\n• 🛠️ الأدوات المجانية\n• 🎓 التخصصات الجامعية\n\nأو تواصل مباشرة مع فريقنا عبر واتساب للمساعدة الفورية.',
    'أفهم استفساركم 👍 للمساعدة الدقيقة، تواصل معنا عبر واتساب أو استخدم الأدوات المجانية في الموقع.',
  ]
};

function getAIResponse(intent) {
  const responses = AI_RESPONSES[intent] || AI_RESPONSES.default;
  return responses[Math.floor(Math.random() * responses.length)];
}

/* ==================== AI CHAT ==================== */
let aiTyping = false;

function addAIMessage(data, isUser = false) {
  const msgs = document.getElementById('ai-messages');
  if (!msgs) return;

  const msg = document.createElement('div');
  msg.className = `ai-message ${isUser ? 'user-msg' : ''}`;

  const avatar = `<div class="ai-msg-avatar">${isUser ? '👤' : '🤖'}</div>`;

  let bubbleContent = (data.text || '').replace(/\n/g, '<br>');

  // Add action buttons for certain intents
  if (!isUser && data.intent) {
    if (data.intent === 'whatsapp' || data.intent === 'pricing' || data.intent === 'projects') {
      bubbleContent += `<br><button class="ai-action-btn wa" onclick="window.open('https://wa.me/966533940866','_blank')"><i class="fab fa-whatsapp"></i> تواصل الآن</button>`;
    }
    if (data.intent === 'gpa' || data.intent === 'tools') {
      bubbleContent += `<br><button class="ai-action-btn" onclick="location.href='tools.html'"><i class="fas fa-tools"></i> اذهب للأدوات</button>`;
    }
    if (data.intent === 'specs') {
      bubbleContent += `<br><button class="ai-action-btn" onclick="location.href='specializations.html'"><i class="fas fa-graduation-cap"></i> التخصصات</button>`;
    }
  }

  msg.innerHTML = `
    ${avatar}
    <div class="ai-msg-bubble">${bubbleContent}</div>
  `;
  msgs.appendChild(msg);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTypingIndicator() {
  const msgs = document.getElementById('ai-messages');
  if (!msgs) return;
  const t = document.createElement('div');
  t.className = 'ai-message';
  t.id = 'ai-typing-ind';
  t.innerHTML = `
    <div class="ai-msg-avatar">🤖</div>
    <div class="ai-msg-bubble"><div class="ai-typing-dots"><span></span><span></span><span></span></div></div>
  `;
  msgs.appendChild(t);
  msgs.scrollTop = msgs.scrollHeight;
}
function removeTypingIndicator() {
  document.getElementById('ai-typing-ind')?.remove();
}

function sendAIMessage(text) {
  if (!text?.trim() || aiTyping) return;
  const input = document.getElementById('ai-input');
  if (input) input.value = '';

  addAIMessage({ text }, true);
  aiTyping = true;
  showTypingIndicator();

  setTimeout(() => {
    removeTypingIndicator();
    aiTyping = false;
    const intent = detectIntent(text);
    const response = getAIResponse(intent);
    addAIMessage({ text: response, intent });

    // Navigation actions
    const navMap = {
      tools: 'tools.html',
      gpa: 'tools.html',
      specs: 'specializations.html',
    };
    if (navMap[intent]) {
      // Don't auto-navigate, buttons handle it
    }
  }, 900 + Math.random() * 600);
}

function handleAIChip(chip) {
  sendAIMessage(chip);
}
function handleAIKeyDown(e) {
  if (e.key === 'Enter') {
    const val = document.getElementById('ai-input')?.value;
    if (val?.trim()) sendAIMessage(val);
  }
}

/* ==================== INJECT WIDGETS ==================== */
function injectAIWidget() {
  if (document.getElementById('ai-assistant-btn')) return;

  // AI Button
  const btn = document.createElement('button');
  btn.id = 'ai-assistant-btn';
  btn.className = 'ai-assistant-btn';
  btn.setAttribute('aria-label', 'المساعد الذكي');
  btn.innerHTML = `<i class="fas fa-robot"></i><span class="ai-label">مساعد سند الذكي</span>`;
  btn.onclick = toggleAIPanel;
  document.body.appendChild(btn);

  // AI Panel
  const panel = document.createElement('div');
  panel.id = 'ai-panel';
  panel.className = 'ai-panel';
  panel.innerHTML = `
    <div class="ai-panel-header">
      <div class="ai-panel-avatar"><i class="fas fa-robot"></i></div>
      <div class="ai-panel-info">
        <div class="ai-panel-name">مساعد سند الذكي</div>
        <div class="ai-panel-status">متصل الآن</div>
      </div>
      <div class="ai-panel-close" onclick="closeAIPanel()" title="إغلاق"><i class="fas fa-times"></i></div>
    </div>
    <div class="ai-messages" id="ai-messages"></div>
    <div class="ai-quick-chips">
      <span class="ai-chip" onclick="handleAIChip('ما هي أسعاركم؟')">💰 الأسعار</span>
      <span class="ai-chip" onclick="handleAIChip('أريد مشروع تخرج')">💻 مشروع تخرج</span>
      <span class="ai-chip" onclick="handleAIChip('كيف أحسب معدلي GPA؟')">📊 حاسبة GPA</span>
      <span class="ai-chip" onclick="handleAIChip('ما هي ضماناتكم؟')">✅ الضمانات</span>
      <span class="ai-chip" onclick="handleAIChip('كيف أتواصل معكم؟')">📱 تواصل</span>
      <span class="ai-chip" onclick="handleAIChip('ما مدة التسليم؟')">⏱️ التسليم</span>
    </div>
    <div class="ai-input-area">
      <input id="ai-input" class="ai-input" type="text" placeholder="اكتب سؤالك هنا..." onkeydown="handleAIKeyDown(event)">
      <button class="ai-send" onclick="sendAIMessage(document.getElementById('ai-input').value)" aria-label="إرسال">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  `;
  document.body.appendChild(panel);

  // Welcome message
  setTimeout(() => {
    addAIMessage({ text: 'مرحباً! 👋 أنا مساعد سند الذكي.\n\nيمكنني مساعدتك في الأسعار، المشاريع، التقارير، الأدوات المجانية، وأكثر!\n\nماذا تحتاج؟' });
  }, 400);
}

function injectCartDrawer() {
  if (document.getElementById('cart-drawer')) return;

  const overlay = document.createElement('div');
  overlay.id = 'cart-overlay';
  overlay.className = 'cart-overlay';
  overlay.onclick = closeCart;
  document.body.appendChild(overlay);

  const drawer = document.createElement('div');
  drawer.id = 'cart-drawer';
  drawer.className = 'cart-drawer';
  drawer.innerHTML = `
    <div class="cart-header">
      <h3><i class="fas fa-shopping-cart"></i> طلباتي</h3>
      <div class="cart-close" onclick="closeCart()"><i class="fas fa-times"></i></div>
    </div>
    <div class="cart-body" id="cart-body-items">
      <div class="cart-empty">
        <i class="fas fa-shopping-cart"></i>
        <p>لا توجد طلبات بعد</p>
        <p style="font-size:0.8rem;color:var(--text-light);margin-top:8px">أضف خدمات لترى طلباتك هنا</p>
      </div>
    </div>
    <div class="cart-footer">
      <div class="cart-total">
        <span>المجموع:</span>
        <span id="cart-total-amount">0 ريال</span>
      </div>
      <button class="btn-checkout" onclick="checkoutCart()">
        <i class="fab fa-whatsapp"></i> إتمام الطلب عبر واتساب
      </button>
    </div>
  `;
  document.body.appendChild(drawer);
}

function injectSuccessModal() {
  if (document.getElementById('success-modal-overlay')) return;
  const el = document.createElement('div');
  el.id = 'success-modal-overlay';
  el.className = 'success-modal-overlay';
  el.innerHTML = `
    <div class="success-modal">
      <div class="success-check"><i class="fas fa-check"></i></div>
      <h3>تمت إضافة الخدمة! 🎉</h3>
      <p>تمت إضافة الخدمة إلى طلباتك بنجاح.<br>يمكنك إتمام الطلب عبر واتساب الآن.</p>
      <div class="success-modal-btns">
        <a id="success-wa-btn" href="https://wa.me/966533940866" target="_blank" class="btn-primary" style="text-decoration:none">
          <i class="fab fa-whatsapp"></i> إتمام الطلب
        </a>
        <button onclick="closeSuccessModal()" class="btn-secondary" style="color:var(--text);background:var(--border-light)">
          متابعة التسفح
        </button>
      </div>
      <button class="modal-close-x" onclick="closeSuccessModal()"><i class="fas fa-times"></i></button>
    </div>
  `;
  el.addEventListener('click', e => { if (e.target === el) closeSuccessModal(); });
  document.body.appendChild(el);
}

function injectWAFloat() {
  if (document.getElementById('wa-float')) return;
  const a = document.createElement('a');
  a.id = 'wa-float';
  a.className = 'wa-float';
  a.href = 'https://wa.me/966533940866';
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.setAttribute('aria-label', 'تواصل على واتساب');
  a.title = 'تواصل على واتساب';
  a.innerHTML = '<i class="fab fa-whatsapp"></i>';
  document.body.appendChild(a);
}

function toggleAIPanel() {
  const panel = document.getElementById('ai-panel');
  if (panel) {
    panel.classList.toggle('open');
  }
}
window.closeAIPanel = function() {
  document.getElementById('ai-panel')?.classList.remove('open');
};

/* ==================== CHECKOUT ==================== */
window.checkoutCart = function() {
  const cart = getCart();
  if (!cart.length) { showToast('لا توجد طلبات في السلة', 'error'); return; }

  const items = cart.map(i => `• ${i.name} — ${i.price} ريال`).join('\n');
  const total = cart.reduce((s, i) => s + (parseFloat(i.price) || 0), 0);
  const msg = encodeURIComponent(
    `🎓 طلب جديد من منصة سند التعليمية\n\n${items}\n\n📌 المجموع: ${total} ريال\n\nأرجو التواصل لإتمام الطلب 🙏`
  );
  window.open(`https://wa.me/966533940866?text=${msg}`, '_blank');
  closeCart();
};

/* ==================== BACK TO TOP ==================== */
function injectBackToTop() {
  if (document.getElementById('back-to-top')) return;
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.title = 'العودة للأعلى';
  btn.setAttribute('aria-label', 'العودة للأعلى');
  btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(btn);
}

/* ==================== SCROLL EVENTS ==================== */
window.addEventListener('scroll', () => {
  const top = document.getElementById('back-to-top');
  if (top) {
    if (window.scrollY > 400) top.classList.add('visible');
    else top.classList.remove('visible');
  }
}, { passive: true });

/* ==================== CART TRIGGER ==================== */
function initCartTrigger() {
  document.addEventListener('click', e => {
    if (e.target.closest('.cart-trigger')) {
      openCart();
    }
  });
}

/* ==================== INIT ==================== */
document.addEventListener('DOMContentLoaded', () => {
  injectCartDrawer();
  injectSuccessModal();
  injectAIWidget();
  injectWAFloat();
  injectBackToTop();
  initCartTrigger();
  refreshCartUI();

  // FAQ accordion
  document.querySelectorAll('.faq-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item?.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item?.classList.add('open');
    });
  });
});

/* ==================== EXPOSE GLOBALS ==================== */
window.addToCart = addToCart;
window.toggleFav = toggleFav;
window.isFav = isFav;
window.showToast = showToast;
window.openCart = openCart;
window.closeCart = closeCart;
window.closeSuccessModal = closeSuccessModal;
window.sendAIMessage = sendAIMessage;
window.handleAIChip = handleAIChip;
window.handleAIKeyDown = handleAIKeyDown;
