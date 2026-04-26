(() => {
  'use strict';

  const FAVORITES_KEY = 'sanad_favorites_v2';
  const RECENT_KEY = 'sanad_recent_v1';
  const WA_FALLBACK = typeof WA_NUMBER !== 'undefined' ? WA_NUMBER : '966533940866';
  const BANK_INFO = {
    bank: 'بنك الإنماء',
    beneficiary: 'مؤسسة كريتيفا جلوبال ات',
    account: '68206067557000',
    iban: 'SA4905000068206067557000'
  };

  function safeLoad(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function safeSave(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      /* ignore */
    }
  }

  function normalizeText(text) {
    return (text || '')
      .toString()
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function escapeHtml(text) {
    return (text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function parsePrice(text) {
    const match = (text || '').replace(/,/g, '').match(/(\d+)/);
    return match ? Number(match[1]) : 0;
  }

  function getCartPricingState(cart) {
    const items = Array.isArray(cart) ? cart : [];
    const fixedItems = items.filter(item => Number(item.price) > 0);
    const quoteItems = items.filter(item => !Number(item.price));
    const totalFixed = fixedItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
    return {
      hasFixed: fixedItems.length > 0,
      hasQuote: quoteItems.length > 0,
      totalFixed,
      allFixed: fixedItems.length > 0 && quoteItems.length === 0,
      fixedItems,
      quoteItems
    };
  }

  function showInlineToast(message, type) {
    if (typeof window.showToast === 'function') {
      window.showToast(message, type || 'success');
      return;
    }
    window.alert(message);
  }

  async function copyTextValue(text) {
    try {
      await navigator.clipboard.writeText(text);
      showInlineToast('تم النسخ بنجاح ✅');
      return true;
    } catch (err) {
      try {
        const area = document.createElement('textarea');
        area.value = text;
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        area.remove();
        showInlineToast('تم النسخ بنجاح ✅');
        return true;
      } catch (fallbackErr) {
        showInlineToast('تعذر النسخ التلقائي', 'error');
        return false;
      }
    }
  }

  window.shareCurrentPage = async function(url, title) {
    const shareUrl = url || window.location.href;
    const shareTitle = title || document.title || 'منصة سند التعليمية';
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl, text: shareTitle });
        return;
      } catch (err) {
        /* user cancelled */
      }
    }
    await copyTextValue(shareUrl);
  };

  function shareToWhatsApp(url, title) {
    const text = encodeURIComponent(`${title}\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  function shareToTelegram(url, title) {
    const text = encodeURIComponent(title);
    const shareUrl = encodeURIComponent(url);
    window.open(`https://t.me/share/url?url=${shareUrl}&text=${text}`, '_blank');
  }

  function getFavorites() {
    return safeLoad(FAVORITES_KEY, []);
  }

  function saveFavorites(list) {
    safeSave(FAVORITES_KEY, list.slice(0, 80));
  }

  function isFavorite(id) {
    return getFavorites().some(item => item.id === id);
  }

  function toggleFavorite(data) {
    const current = getFavorites();
    const exists = current.find(item => item.id === data.id);
    let next;
    if (exists) {
      next = current.filter(item => item.id !== data.id);
      showInlineToast('تمت إزالة الخدمة من المفضلة 💔', 'info');
    } else {
      next = [data, ...current].slice(0, 80);
      showInlineToast('تمت إضافة الخدمة للمفضلة ❤️');
    }
    saveFavorites(next);
    renderFavoritesDrawer();
    syncFavoriteButtons();
  }

  function syncFavoriteButtons() {
    const favIds = new Set(getFavorites().map(item => item.id));
    document.querySelectorAll('[data-fav-id]').forEach(btn => {
      const active = favIds.has(btn.dataset.favId);
      btn.classList.toggle('is-fav', active);
      const label = active ? 'في المفضلة' : 'أضف للمفضلة';
      btn.innerHTML = `<i class="fas fa-heart"></i> ${label}`;
    });
  }

  function saveRecentPage() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    if (!path || path === 'checkout.html') return;
    const current = safeLoad(RECENT_KEY, []);
    const page = {
      path,
      title: document.title.replace(/\s*\|.*$/, '').trim(),
      subtitle: document.querySelector('meta[name="description"]')?.content || 'صفحة من منصة سند التعليمية',
      time: Date.now()
    };
    const filtered = current.filter(item => item.path !== path);
    safeSave(RECENT_KEY, [page, ...filtered].slice(0, 6));
  }

  function illustrationForText(text) {
    const t = normalizeText(text);
    if (/nursing|طب|تمريض|صيدلة|care|medical|health|case study/.test(t)) return 'images/illustrations/medical.svg';
    if (/python|java|برمج|حاسب|code|sql|html|css|web|api|database/.test(t)) return 'images/illustrations/coding.svg';
    if (/رياضيات|فيزياء|كيمياء|أحياء|science|statistics|إحصاء/.test(t)) return 'images/illustrations/science.svg';
    if (/محاسبة|إدارة|business|finance|marketing|اقتصاد|law|mis/.test(t)) return 'images/illustrations/business.svg';
    if (/essay|english|ترجمة|grammar|writing|لغة/.test(t)) return 'images/illustrations/english.svg';
    if (/powerpoint|عرض|خريطة|mind map|visual|presentation/.test(t)) return 'images/illustrations/presentation.svg';
    if (/school|مدارس|ثانوي|تحضيري|prep/.test(t)) return 'images/illustrations/school.svg';
    if (/word|pdf|access|excel|office|ملخص|report/.test(t)) return 'images/illustrations/writing.svg';
    return 'images/illustrations/general.svg';
  }

  function deriveFeatures(title, desc, tagsText) {
    const text = normalizeText(`${title} ${desc} ${tagsText}`);
    const features = [];
    if (/proposal|research|بحث|report|essay|literature/.test(text)) {
      features.push('صياغة أكاديمية وتوثيق منظم');
    }
    if (/powerpoint|عرض|mind|visual|design|canva/.test(text)) {
      features.push('تصميم بصري احترافي وجاهز للتسليم');
    }
    if (/python|java|code|برمج|sql|database|mvc|web/.test(text)) {
      features.push('تنظيم الملفات والأكواد بشكل واضح');
    }
    if (/nursing|care|تمريض|medical|case study|assessment/.test(text)) {
      features.push('مراعاة المصطلحات والمتطلبات التخصصية');
    }
    if (/math|رياضيات|فيزياء|كيمياء|statistics|إحصاء/.test(text)) {
      features.push('حل مرتب وشرح مختصر عند الحاجة');
    }
    if (/account|محاسبة|finance|economics|marketing|mis/.test(text)) {
      features.push('تحليل منظم مع جداول أو نقاط واضحة');
    }
    features.push('مراجعة أولية قبل التسليم');
    features.push('متابعة سريعة عبر واتساب');
    return [...new Set(features)].slice(0, 3);
  }

  function collectCardData(card) {
    const title = card.querySelector('.svc-title, .kp-card-name, .spec-card-title')?.textContent?.trim() || 'خدمة';
    const desc = card.querySelector('.svc-desc, .kp-desc, .spec-card-desc')?.textContent?.trim() || '';
    const tags = Array.from(card.querySelectorAll('.svc-tag, .kp-includes li')).map(tag => tag.textContent.trim()).join(' ');
    const priceText = card.querySelector('.svc-price, .kp-card-price, .spec-services-count')?.textContent?.trim() || '';
    const price = parsePrice(priceText);
    const emoji = card.querySelector('.svc-card-emoji-box, .kp-card-icon, .spec-card-icon')?.textContent?.trim() || '📚';
    const id = card.id || `svc-${normalizeText(title).replace(/[^\u0600-\u06ff\w]+/g, '-').replace(/-+/g, '-')}`;
    const link = card.tagName === 'A' ? card.getAttribute('href') : `${window.location.pathname.split('/').pop() || 'index.html'}#${id}`;
    const image = illustrationForText(`${title} ${desc} ${tags}`);
    return {
      id,
      title,
      desc,
      tags,
      price,
      emoji,
      link,
      image,
      page: window.location.pathname.split('/').pop() || 'index.html'
    };
  }

  function createMiniButton(className, iconClass, label, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className;
    btn.innerHTML = `<i class="${iconClass}"></i> ${label}`;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function addActionRow(card, data, type) {
    const className = type === 'kp' ? 'kp-actions-row' : 'svc-actions-row';
    const buttonClass = type === 'kp' ? 'kp-mini-action' : 'svc-mini-action';
    if (card.querySelector(`.${className}`)) return;

    const row = document.createElement('div');
    row.className = className;

    const favBtn = createMiniButton(buttonClass, 'fas fa-heart', isFavorite(data.id) ? 'في المفضلة' : 'أضف للمفضلة', () => toggleFavorite(data));
    favBtn.dataset.favId = data.id;
    if (isFavorite(data.id)) favBtn.classList.add('is-fav');

    const shareBtn = createMiniButton(buttonClass, 'fas fa-share-nodes', 'مشاركة', () => shareToWhatsApp(`${window.location.origin || ''}${data.link}`, `${data.title} - منصة سند التعليمية`));

    row.appendChild(favBtn);
    row.appendChild(shareBtn);

    const target = card.querySelector('.add-cart-btn, .kp-add-btn');
    if (target && target.parentElement) {
      target.parentElement.insertBefore(row, target);
    }
  }

  function enhanceServiceCards() {
    document.querySelectorAll('.svc-card').forEach(card => {
      if (card.dataset.upgraded === '1') return;
      card.dataset.upgraded = '1';
      card.classList.add('upgraded-service');

      const data = collectCardData(card);
      const emojiBox = card.querySelector('.svc-card-emoji-box');
      if (emojiBox && !emojiBox.querySelector('.svc-visual')) {
        const emoji = escapeHtml(data.emoji || '📚');
        const priceLabel = data.price > 0 ? `${data.price} ريال` : 'تسعير مرن';
        emojiBox.classList.add('has-illustration');
        emojiBox.innerHTML = `
          <img class="svc-visual" src="${data.image}" alt="${escapeHtml(data.title)}">
          <span class="svc-emoji-badge">${emoji}</span>
          <div class="svc-visual-overlay">
            <span>نسخة مطورة للخدمة</span>
            <span>${priceLabel}</span>
          </div>`;
      }

      const desc = card.querySelector('.svc-desc');
      const tagsText = Array.from(card.querySelectorAll('.svc-tag')).map(tag => tag.textContent.trim()).join(' ');
      if (desc && !card.querySelector('.svc-feature-list')) {
        const list = document.createElement('div');
        list.className = 'svc-feature-list';
        deriveFeatures(data.title, data.desc, tagsText).forEach(item => {
          const row = document.createElement('div');
          row.className = 'svc-feature-item';
          row.innerHTML = `<i class="fas fa-circle-check"></i><span>${escapeHtml(item)}</span>`;
          list.appendChild(row);
        });
        desc.insertAdjacentElement('afterend', list);
      }

      card.dataset.searchTokens = normalizeText(`${data.title} ${data.desc} ${data.tags} ${card.textContent}`);
      card.dataset.priceState = data.price > 0 ? 'fixed' : 'quote';
      addActionRow(card, data, 'svc');
    });
  }

  function enhanceKsuCards() {
    document.querySelectorAll('.kp-card').forEach(card => {
      if (card.dataset.upgraded === '1') return;
      card.dataset.upgraded = '1';
      card.classList.add('upgraded-service');
      const data = collectCardData(card);
      card.dataset.searchTokens = normalizeText(`${data.title} ${data.desc} ${data.tags} ${card.textContent}`);
      card.dataset.priceState = data.price > 0 ? 'fixed' : 'quote';

      const addBtn = card.querySelector('.kp-add-btn');
      if (addBtn && !card.querySelector('.kp-benefits')) {
        const benefitRow = document.createElement('div');
        benefitRow.className = 'kp-benefits';
        ['سعر واضح', 'نموذج جاهز', 'مراجعة سريعة'].forEach(label => {
          const chip = document.createElement('span');
          chip.className = 'kp-benefit-chip';
          chip.textContent = label;
          benefitRow.appendChild(chip);
        });
        addBtn.parentElement.insertBefore(benefitRow, addBtn);
      }
      addActionRow(card, data, 'kp');
    });
  }

  function enhanceSpecializationCards() {
    document.querySelectorAll('.spec-card').forEach(card => {
      const data = collectCardData(card);
      card.dataset.searchTokens = normalizeText(`${data.title} ${data.desc} ${data.tags} ${card.textContent}`);
      card.dataset.priceState = /سعر|أسعار|ريال|محدد/.test(card.textContent) ? 'fixed' : 'quote';
    });
  }

  function installToolbar(grid, type) {
    if (!grid || grid.dataset.toolbar === '1') return;
    const selector = type === 'spec' ? '.spec-card' : (type === 'ksu' ? '.kp-card' : '.svc-card');
    const cards = Array.from(grid.querySelectorAll(selector));
    if (!cards.length) return;
    grid.dataset.toolbar = '1';

    const toolbar = document.createElement('div');
    toolbar.className = 'smart-toolbar';
    toolbar.dataset.filter = 'all';
    toolbar.innerHTML = `
      <div class="smart-toolbar-row" style="margin-bottom:14px;">
        <div class="smart-toolbar-title">${type === 'spec' ? 'ابحث عن تخصصك المناسب' : 'فلترة سريعة للوصول للخدمة المطلوبة'}</div>
        <div class="toolbar-count">${cards.length} نتيجة</div>
      </div>
      <div class="smart-toolbar-row">
        <div class="smart-search">
          <i class="fas fa-search"></i>
          <input type="search" placeholder="${type === 'spec' ? 'ابحث عن تخصص، كلية أو نوع خدمة...' : 'ابحث عن خدمة، مادة، مشروع أو كلمة مفتاحية...'}">
        </div>
        <div class="filter-chips">
          <button type="button" class="filter-chip active" data-filter="all">الكل</button>
          <button type="button" class="filter-chip" data-filter="fixed">سعر محدد</button>
          <button type="button" class="filter-chip" data-filter="quote">تسعير عبر واتساب</button>
          <button type="button" class="filter-chip" data-filter="fast">أسرع تنفيذ</button>
        </div>
      </div>`;
    grid.parentElement.insertBefore(toolbar, grid);

    const searchInput = toolbar.querySelector('input');
    const countNode = toolbar.querySelector('.toolbar-count');
    const chips = toolbar.querySelectorAll('.filter-chip');

    function applyFilter() {
      const query = normalizeText(searchInput.value);
      const filter = toolbar.dataset.filter;
      let visible = 0;

      cards.forEach(card => {
        const haystack = card.dataset.searchTokens || normalizeText(card.textContent);
        const priceState = card.dataset.priceState || (parsePrice(card.textContent) > 0 ? 'fixed' : 'quote');
        const fastText = normalizeText(card.textContent);
        let matched = !query || haystack.includes(query);

        if (matched && filter === 'fixed') matched = priceState === 'fixed';
        if (matched && filter === 'quote') matched = priceState === 'quote';
        if (matched && filter === 'fast') matched = /6-12|12-24|24 ساعة|سريع|same day|عاجل/.test(fastText);

        card.classList.toggle('hidden-by-filter', !matched);
        if (matched) visible += 1;
      });

      countNode.textContent = `${visible} نتيجة`;
    }

    searchInput.addEventListener('input', applyFilter);
    chips.forEach(chip => chip.addEventListener('click', () => {
      chips.forEach(item => item.classList.remove('active'));
      chip.classList.add('active');
      toolbar.dataset.filter = chip.dataset.filter;
      applyFilter();
    }));
  }

  function renderFavoritesDrawer() {
    let overlay = document.querySelector('.fav-overlay');
    let drawer = document.querySelector('.fav-drawer');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'fav-overlay';
      overlay.addEventListener('click', closeFavoritesDrawer);
      document.body.appendChild(overlay);
    }

    if (!drawer) {
      drawer = document.createElement('aside');
      drawer.className = 'fav-drawer';
      drawer.innerHTML = `
        <div class="fav-head">
          <h3><i class="fas fa-heart"></i> المفضلة</h3>
          <button type="button" class="fav-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="fav-body"></div>`;
      drawer.querySelector('.fav-close').addEventListener('click', closeFavoritesDrawer);
      document.body.appendChild(drawer);
    }

    const body = drawer.querySelector('.fav-body');
    const favorites = getFavorites();

    if (!favorites.length) {
      body.innerHTML = `
        <div class="fav-empty">
          <div class="icon">💖</div>
          <strong>لا توجد خدمات محفوظة بعد</strong>
          <span>أضف أي خدمة للمفضلة لتظهر هنا وتعود لها بسرعة.</span>
        </div>`;
      return;
    }

    body.innerHTML = favorites.map(item => `
      <div class="fav-item">
        <div class="fav-item-media"><img src="${item.image}" alt="${escapeHtml(item.title)}"></div>
        <div>
          <div class="fav-item-title">${escapeHtml(item.title)}</div>
          <div class="fav-item-sub">${item.price > 0 ? item.price + ' ريال' : 'يتم التسعير عبر واتساب'}</div>
        </div>
        <div class="fav-item-actions">
          <a class="fav-mini-btn" href="${item.link}">فتح</a>
          <button type="button" class="fav-mini-btn alt" data-remove-id="${item.id}">حذف</button>
        </div>
      </div>`).join('');

    body.querySelectorAll('[data-remove-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        saveFavorites(getFavorites().filter(item => item.id !== btn.dataset.removeId));
        renderFavoritesDrawer();
        syncFavoriteButtons();
      });
    });
  }

  function openFavoritesDrawer() {
    renderFavoritesDrawer();
    document.querySelector('.fav-overlay')?.classList.add('open');
    document.querySelector('.fav-drawer')?.classList.add('open');
  }

  function closeFavoritesDrawer() {
    document.querySelector('.fav-overlay')?.classList.remove('open');
    document.querySelector('.fav-drawer')?.classList.remove('open');
  }

  function injectFloatingActions() {
    if (document.querySelector('.site-floating-actions-right')) return;

    /* ── RIGHT SIDE: مشاركة | مفضلة | أعلى الصفحة ── */
    const rightWrap = document.createElement('div');
    rightWrap.className = 'site-floating-actions site-floating-actions-right';

    const shareBtn = createMiniButton('site-floating-btn share', 'fas fa-share-nodes', '', () => window.shareCurrentPage());
    const favBtn   = createMiniButton('site-floating-btn fav',   'fas fa-heart',       '', openFavoritesDrawer);
    const topBtn   = createMiniButton('site-floating-btn top',   'fas fa-arrow-up',    '', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    shareBtn.title = 'مشاركة';
    favBtn.title   = 'المفضلة';
    topBtn.title   = 'أعلى الصفحة';

    rightWrap.appendChild(shareBtn);
    rightWrap.appendChild(favBtn);
    rightWrap.appendChild(topBtn);
    document.body.appendChild(rightWrap);
  }

  function injectHomeSections() {
    const hero = document.querySelector('.hero');
    const featuresBar = document.querySelector('.features-bar');
    const footerPlaceholder = document.querySelector('#footer-placeholder');
    if (!hero || !featuresBar || document.querySelector('#upgrade-home-features')) return;

    const featuresSection = `
      <section class="upgrade-section" id="upgrade-home-features">
        <div class="upgrade-wrap">
          <div class="section-header reveal visible">
            <div class="section-chip">🚀 تحديثات المتجر</div>
            <h2 class="section-title">تجربة أسرع وأكثر سلاسة للطالب</h2>
            <p class="section-subtitle">أضفنا تحسينات عملية تجعل الوصول للخدمة والطلب والمشاركة أسهل من أي وقت.</p>
          </div>
          <div class="upgrade-grid">
            <div class="upgrade-card reveal visible"><div class="icon">🔎</div><h3>بحث ذكي داخل الخدمات</h3><p>فلترة فورية حسب نوع الخدمة أو المادة أو الكلمات المفتاحية للوصول السريع للطلب المناسب.</p></div>
            <div class="upgrade-card reveal visible"><div class="icon">❤️</div><h3>مفضلة وخدمات محفوظة</h3><p>يمكن للطالب حفظ أكثر الخدمات التي تهمه والرجوع لها مباشرةً لاحقًا بدون بحث من جديد.</p></div>
            <div class="upgrade-card reveal visible"><div class="icon">📤</div><h3>أزرار مشاركة للموقع</h3><p>مشاركة سريعة عبر واتساب أو نسخ الرابط أو تيليجرام لمساعدة انتشار المتجر بشكل أسرع.</p></div>
            <div class="upgrade-card reveal visible"><div class="icon">🏷️</div><h3>تسعير أوضح أثناء الطلب</h3><p>إظهار بيانات التحويل فقط عند وجود سعر محدد، مع رسالة واتساب جاهزة تتضمن بيانات التحويل عند الحاجة.</p></div>
          </div>
        </div>
      </section>
      <section class="upgrade-section" style="padding-top:0;">
        <div class="upgrade-wrap">
          <div class="section-header reveal visible">
            <div class="section-chip">🧰 أدوات مجانية</div>
            <h2 class="section-title">أدوات مجانية تجذب الطلاب وتخدمهم يوميًا</h2>
            <p class="section-subtitle">مجموعة أدوات مجانية داخل الموقع لزيادة الفائدة والانتشار وتحويل الزيارة إلى تفاعل فعلي.</p>
          </div>
          <div class="tools-teaser-grid">
            <div class="tools-teaser-card"><div class="tool-icon">🖼️</div><h4>تحويل الصور إلى PDF</h4><p>ارفع صورك وحوّلها فورًا إلى ملف PDF مرتب ومناسب للتسليم.</p><a class="mini-link" href="tools.html">فتح الأداة ←</a></div>
            <div class="tools-teaser-card"><div class="tool-icon">🌍</div><h4>ترجمة النصوص والملفات النصية</h4><p>ترجمة سريعة للنصوص وملفات TXT/CSV/JSON مع تنزيل الناتج بسهولة.</p><a class="mini-link" href="tools.html#translator">فتح الأداة ←</a></div>
            <div class="tools-teaser-card"><div class="tool-icon">📊</div><h4>حاسبة المعدل GPA</h4><p>أضف المواد والساعات والدرجات واحسب معدلك بشكل فوري ومنظم.</p><a class="mini-link" href="tools.html#gpa">فتح الأداة ←</a></div>
            <div class="tools-teaser-card"><div class="tool-icon">⏳</div><h4>مؤقت بومودورو للمذاكرة</h4><p>جلسات تركيز واستراحة تساعد الطالب على تنظيم وقته أثناء الدراسة.</p><a class="mini-link" href="tools.html#pomodoro">فتح الأداة ←</a></div>
          </div>
          <div style="text-align:center;margin-top:22px;"><a href="tools.html" class="btn btn-primary btn-lg"><i class="fas fa-screwdriver-wrench"></i> استعرض جميع الأدوات المجانية</a></div>
        </div>
      </section>`;

    featuresBar.insertAdjacentHTML('afterend', featuresSection);

    if (footerPlaceholder && !document.querySelector('#upgrade-home-faq')) {
      footerPlaceholder.insertAdjacentHTML('beforebegin', `
        <section class="upgrade-section" id="upgrade-home-faq">
          <div class="upgrade-wrap">
            <div class="section-header reveal visible">
              <div class="section-chip">❓ أسئلة شائعة</div>
              <h2 class="section-title">إجابات سريعة قبل البدء</h2>
              <p class="section-subtitle">كل ما يحتاج الطالب معرفته قبل إرسال الطلب أو استخدام الأدوات المجانية.</p>
            </div>
            <div class="faq-list">
              <div class="faq-item open"><button class="faq-trigger" type="button"><span>متى تظهر بيانات الحساب البنكي؟</span><i class="fas fa-chevron-down"></i></button><div class="faq-content">تظهر بيانات التحويل في صفحة الدفع عندما تكون الخدمات ذات سعر محدد، أما الخدمات التي تحتاج تسعير فسيتم إخفاؤها من الصفحة مع إضافتها داخل رسالة واتساب الجاهزة حتى يتم الاتفاق أولًا.</div></div>
              <div class="faq-item"><button class="faq-trigger" type="button"><span>هل الأدوات المجانية تعمل بدون تسجيل؟</span><i class="fas fa-chevron-down"></i></button><div class="faq-content">نعم، الأدوات المجانية داخل الموقع مصممة لتعمل مباشرة من المتصفح مثل تحويل الصور إلى PDF، عداد الكلمات، المترجم النصي، حاسبة المعدل، وصانع QR.</div></div>
              <div class="faq-item"><button class="faq-trigger" type="button"><span>هل أستطيع مشاركة الخدمة أو الصفحة مع زملائي؟</span><i class="fas fa-chevron-down"></i></button><div class="faq-content">أكيد، تمت إضافة أزرار مشاركة للموقع والخدمات عبر واتساب ونسخ الرابط، بالإضافة إلى زر عائم سريع للمشاركة من أي صفحة.</div></div>
              <div class="faq-item"><button class="faq-trigger" type="button"><span>ما الجديد في تجربة المتجر؟</span><i class="fas fa-chevron-down"></i></button><div class="faq-content">أصبح بإمكانك البحث الذكي داخل الخدمات، حفظ المفضلة، استخدام أدوات مجانية، معرفة حالة التسعير بوضوح، والتعامل مع رسائل واتساب أكثر اكتمالًا واحترافية.</div></div>
            </div>
            <div class="share-strip">
              <div>
                <h3>ساعد في انتشار المتجر</h3>
                <p>شارك الموقع مع زملائك في الجامعة أو القروبات، وخليهم يستفيدوا من الخدمات والأدوات المجانية.</p>
              </div>
              <div class="share-strip-actions">
                <button type="button" class="btn-share" data-share-kind="whatsapp"><i class="fab fa-whatsapp"></i> واتساب</button>
                <button type="button" class="btn-share" data-share-kind="telegram"><i class="fab fa-telegram"></i> تيليجرام</button>
                <button type="button" class="btn-share" data-share-kind="copy"><i class="fas fa-link"></i> نسخ الرابط</button>
              </div>
            </div>
            <div id="recent-placeholder"></div>
          </div>
        </section>`);
    }
  }

  function injectRecentSection() {
    const holder = document.querySelector('#recent-placeholder');
    if (!holder) return;
    const recent = safeLoad(RECENT_KEY, []).filter(item => item.path !== (window.location.pathname.split('/').pop() || 'index.html')).slice(0, 3);
    if (!recent.length) return;
    holder.innerHTML = `
      <div class="section-header reveal visible" style="margin-top:26px;">
        <div class="section-chip">🕘 آخر ما تصفحته</div>
        <h2 class="section-title">ارجع لأهم الصفحات بسرعة</h2>
        <p class="section-subtitle">آخر الصفحات التي تصفحتها داخل المتجر.</p>
      </div>
      <div class="recent-grid">
        ${recent.map(item => `
          <div class="recent-card">
            <small>صفحة محفوظة محليًا</small>
            <strong>${escapeHtml(item.title)}</strong>
            <div style="font-size:12px;color:var(--text-muted);line-height:1.8;margin-bottom:10px;">${escapeHtml(item.subtitle)}</div>
            <a href="${item.path}">افتح الصفحة ←</a>
          </div>`).join('')}
      </div>`;
  }

  function injectSpecializationsPromo() {
    const footerPlaceholder = document.querySelector('#footer-placeholder');
    const specPage = document.querySelector('.spec-grid');
    if (!footerPlaceholder || !specPage || document.querySelector('#special-tools-promo')) return;
    footerPlaceholder.insertAdjacentHTML('beforebegin', `
      <section class="upgrade-section" id="special-tools-promo" style="padding-top:0;">
        <div class="upgrade-wrap">
          <div class="share-strip">
            <div>
              <h3>خدمات + أدوات مجانية في مكان واحد</h3>
              <p>أضفنا قسم أدوات مجانية داخل المتجر مثل تحويل الصور إلى PDF، ترجمة الملفات النصية، عداد الكلمات، حاسبة GPA، ومؤقت للمذاكرة.</p>
            </div>
            <div class="share-strip-actions">
              <a href="tools.html" class="btn-share" style="text-decoration:none;"><i class="fas fa-screwdriver-wrench"></i> افتح الأدوات</a>
              <button type="button" class="btn-share" data-share-kind="copy"><i class="fas fa-link"></i> نسخ رابط المتجر</button>
            </div>
          </div>
        </div>
      </section>`);
  }

  function bindSharedButtons() {
    document.querySelectorAll('.faq-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        item?.classList.toggle('open');
      });
    });

    document.querySelectorAll('[data-share-kind]').forEach(btn => {
      btn.addEventListener('click', () => {
        const kind = btn.dataset.shareKind;
        const url = window.location.href;
        const title = document.title.replace(/\s*\|.*$/, '').trim();
        if (kind === 'whatsapp') shareToWhatsApp(url, title);
        if (kind === 'telegram') shareToTelegram(url, title);
        if (kind === 'copy') copyTextValue(url);
      });
    });
  }

  function installCheckoutUpgrade() {
    if (!document.querySelector('.checkout-page-wrapper') || window.__checkoutUpgradeInstalled) return;
    window.__checkoutUpgradeInstalled = true;

    const cards = Array.from(document.querySelectorAll('.co-card'));
    const bankCard = cards.find(card => /إتمام الدفع/.test(card.querySelector('h3')?.textContent || ''));
    const receiptCard = cards.find(card => /إيصال التحويل/.test(card.querySelector('h3')?.textContent || ''));
    const submitCard = document.querySelector('.submit-wa-btn')?.closest('.co-card');
    const totalBox = document.getElementById('order-total-box');

    let stateNotice = document.getElementById('quote-state-box');
    if (!stateNotice && submitCard) {
      stateNotice = document.createElement('div');
      stateNotice.id = 'quote-state-box';
      submitCard.querySelector('.co-card-body')?.insertBefore(stateNotice, submitCard.querySelector('.co-card-body').firstChild);
    }

    let summaryNote = document.getElementById('summary-note-box');
    if (!summaryNote && totalBox?.parentElement) {
      summaryNote = document.createElement('div');
      summaryNote.id = 'summary-note-box';
      summaryNote.className = 'summary-note-box';
      totalBox.parentElement.appendChild(summaryNote);
    }

    function refreshPaymentVisibility() {
      const cart = typeof window.loadCart === 'function' ? window.loadCart() : [];
      const state = getCartPricingState(cart);
      const totalLabel = document.getElementById('order-total-amount');
      if (totalLabel) {
        if (state.allFixed) totalLabel.textContent = `${state.totalFixed} ريال`;
        else if (state.hasFixed && state.hasQuote) totalLabel.textContent = `${state.totalFixed} ريال + خدمات تحتاج تسعير`;
        else totalLabel.textContent = 'يُحدَّد عبر واتساب';
      }

      if (state.allFixed) {
        bankCard && (bankCard.style.display = 'block');
        receiptCard && (receiptCard.style.display = 'block');
        if (stateNotice) {
          stateNotice.className = 'quote-state-box fixed';
          stateNotice.innerHTML = `<i class="fas fa-circle-check"></i><div><strong>الخدمات الحالية بسعر محدد.</strong><br>يمكنك التحويل مباشرة بمبلغ <strong>${state.totalFixed} ريال</strong> ثم إرفاق الإيصال، كما ستظهر بيانات الحساب أيضًا داخل رسالة واتساب الجاهزة.</div>`;
        }
        if (summaryNote) {
          summaryNote.innerHTML = 'ملحوظة: بما أن كل الخدمات الحالية محددة السعر، فستظهر بيانات التحويل داخل الصفحة وكذلك داخل رسالة واتساب النهائية.';
        }
      } else {
        bankCard && (bankCard.style.display = 'none');
        receiptCard && (receiptCard.style.display = 'none');
        if (stateNotice) {
          stateNotice.className = 'quote-state-box quote';
          stateNotice.innerHTML = `<i class="fas fa-circle-info"></i><div><strong>السلة تحتوي خدمات تحتاج تسعير أولًا.</strong><br>لذلك تم إخفاء الحساب البنكي من الصفحة حتى يتم اعتماد السعر النهائي. ستجد بيانات التحويل مضافة داخل رسالة واتساب الجاهزة لسهولة الرجوع لها بعد الاتفاق.</div><div class="message-preview-chip"><i class="fas fa-comment-dots"></i> الرسالة الجاهزة تتضمن بيانات التحويل</div>`;
        }
        if (summaryNote) {
          summaryNote.innerHTML = 'إذا كانت بعض الخدمات تحتاج تسعير، فسيظهر السعر النهائي بعد مراجعة الطلب عبر واتساب ثم يتم التحويل بعد التأكيد.';
        }
      }
    }

    const originalSummary = window.renderCheckoutSummary;
    if (typeof originalSummary === 'function') {
      window.renderCheckoutSummary = function() {
        originalSummary();
        refreshPaymentVisibility();
      };
    }

    const originalRemove = window.removeFromCart;
    if (typeof originalRemove === 'function') {
      window.removeFromCart = function(id) {
        originalRemove(id);
        if (typeof window.renderCheckoutSummary === 'function') window.renderCheckoutSummary();
        refreshPaymentVisibility();
      };
    }

    function buildWhatsAppMessage() {
      const name = document.getElementById('client-name')?.value.trim() || '';
      const phone = document.getElementById('client-phone')?.value.trim() || '';
      const email = document.getElementById('client-email')?.value.trim() || '';
      const details = document.getElementById('order-details')?.value.trim() || '';
      const university = document.getElementById('university')?.value.trim() || '';
      const specialization = document.getElementById('specialization')?.value.trim() || '';
      const serviceType = document.getElementById('service-type')?.value || '';
      const deliveryDate = document.getElementById('delivery-date')?.value || '';
      const priority = document.getElementById('priority')?.value || 'normal';
      const fileInput = document.getElementById('receipt-file');
      const hasFile = !!(fileInput?.files && fileInput.files.length > 0);

      const required = [
        { el: document.getElementById('client-name'), val: name },
        { el: document.getElementById('client-phone'), val: phone },
        { el: document.getElementById('client-email'), val: email },
        { el: document.getElementById('order-details'), val: details }
      ];

      let valid = true;
      required.forEach(field => {
        field.el?.classList.remove('error');
        if (!field.val) {
          valid = false;
          field.el?.classList.add('error');
        }
      });

      if (!valid) {
        showInlineToast('❗ يرجى ملء جميع الحقول المطلوبة', 'error');
        document.querySelector('.form-control-co.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return null;
      }

      const cart = typeof window.loadCart === 'function' ? window.loadCart() : [];
      const state = getCartPricingState(cart);
      const priorityMap = { normal: 'عادي', fast: 'سريع (24 ساعة)', urgent: 'عاجل جدًا' };
      const totalText = state.allFixed
        ? `${state.totalFixed} ريال`
        : (state.hasFixed ? `${state.totalFixed} ريال + خدمات تحتاج تسعير` : 'يُحدَّد بعد مراجعة الطلب');
      const dateText = deliveryDate ? new Date(deliveryDate).toLocaleDateString('ar-SA') : 'غير محدد';
      const reference = `SN-${String(Date.now()).slice(-6)}`;

      let cartLines = '';
      if (cart.length) {
        cart.forEach((item, idx) => {
          const priceText = Number(item.price) > 0 ? `${item.price} ريال` : 'يحتاج تسعير';
          cartLines += `${idx + 1}. ${item.emoji || '📚'} ${item.name} — ${priceText}\n`;
        });
      } else {
        cartLines = '1. تم توضيح الخدمة داخل التفاصيل فقط\n';
      }

      const paymentStateLine = state.allFixed
        ? '✅ السعر محدد ويمكن التحويل مباشرة'
        : '⚠️ توجد خدمات تحتاج تسعير — لا يتم التحويل إلا بعد اعتماد السعر النهائي';

      const receiptLine = state.allFixed
        ? (hasFile ? '📎 إيصال التحويل: تم تجهيزه وسيتم إرساله بعد هذه الرسالة' : '⚠️ إيصال التحويل: لم يتم إرفاقه بعد')
        : '💬 التحويل مؤجل لحين اعتماد السعر النهائي';

      const message = `🎓 *طلب جديد — منصة سند التعليمية*\n━━━━━━━━━━━━━━━━━━━━━━\n🧾 *رقم الطلب:* ${reference}\n👤 *الاسم:* ${name}\n📱 *واتساب:* ${phone}\n📧 *البريد:* ${email}${university ? `\n🏛️ *الجامعة:* ${university}` : ''}${specialization ? `\n📚 *التخصص:* ${specialization}` : ''}\n━━━━━━━━━━━━━━━━━━━━━━\n🛒 *الخدمات المطلوبة:*\n${cartLines}💰 *إجمالي الطلب الحالي:* ${totalText}\n📌 *حالة التسعير:* ${paymentStateLine}\n━━━━━━━━━━━━━━━━━━━━━━\n🔧 *نوع الخدمة:* ${serviceType || 'غير محدد'}\n📅 *تاريخ التسليم:* ${dateText}\n⚡ *الأولوية:* ${priorityMap[priority] || 'عادي'}\n━━━━━━━━━━━━━━━━━━━━━━\n📝 *تفاصيل الطلب:*\n${details}\n━━━━━━━━━━━━━━━━━━━━━━\n🏦 *بيانات التحويل البنكي:*\n• البنك: ${BANK_INFO.bank}\n• اسم المستفيد: ${BANK_INFO.beneficiary}\n• رقم الحساب: ${BANK_INFO.account}\n• الآيبان: ${BANK_INFO.iban}\n━━━━━━━━━━━━━━━━━━━━━━\n${receiptLine}\n✅ أرجو تأكيد الاستلام ومراجعتي بالسعر النهائي أو بدء التنفيذ حسب حالة الطلب. شكرًا 🙏`;

      return `https://wa.me/${WA_FALLBACK}?text=${encodeURIComponent(message)}`;
    }

    window.submitOrder = function() {
      const waUrl = buildWhatsAppMessage();
      if (!waUrl) return;
      if (typeof window.showSuccessModal === 'function') {
        window.showSuccessModal(waUrl);
        return;
      }
      window.open(waUrl, '_blank');
    };

    refreshPaymentVisibility();
  }

  function init() {
    saveRecentPage();
    injectFloatingActions();
    renderFavoritesDrawer();
    enhanceServiceCards();
    enhanceKsuCards();
    enhanceSpecializationCards();

    document.querySelectorAll('.services-grid').forEach(grid => installToolbar(grid, grid.closest('#tab-ksu') ? 'ksu' : 'services'));
    document.querySelectorAll('.ksu-projects-grid').forEach(grid => installToolbar(grid, 'ksu'));
    document.querySelectorAll('.spec-grid').forEach(grid => installToolbar(grid, 'spec'));

    injectHomeSections();
    injectSpecializationsPromo();
    injectRecentSection();
    bindSharedButtons();
    syncFavoriteButtons();
    installCheckoutUpgrade();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
