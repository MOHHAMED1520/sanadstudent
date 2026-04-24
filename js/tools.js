(() => {
  'use strict';

  const state = {
    imageFiles: [],
    pomodoro: {
      minutes: 25,
      secondsLeft: 25 * 60,
      timer: null,
      running: false
    }
  };

  function $(selector) {
    return document.querySelector(selector);
  }

  function $all(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  function showMessage(selector, text, type) {
    const box = $(selector);
    if (!box) return;
    box.style.background = type === 'error' ? '#7f1d1d' : '#0f1729';
    box.textContent = text;
  }

  function setupToolNavigation() {
    const navButtons = $all('[data-tool-nav]');
    const blocks = $all('[data-tool-block]');

    function openTool(id) {
      navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.toolNav === id));
      blocks.forEach(block => block.classList.toggle('active', block.dataset.toolBlock === id));
      if (history.replaceState) history.replaceState(null, '', `#${id}`);
    }

    navButtons.forEach(btn => btn.addEventListener('click', () => openTool(btn.dataset.toolNav)));
    const hash = location.hash.replace('#', '');
    openTool(hash || navButtons[0]?.dataset.toolNav || 'pdf');
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function readFileText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file, 'utf-8');
    });
  }

  function setupImageToPdf() {
    const input = $('#pdf-images');
    const dropzone = $('#pdf-dropzone');
    const preview = $('#pdf-preview');
    const convertBtn = $('#convert-pdf-btn');

    function updatePreview() {
      if (!preview) return;
      if (!state.imageFiles.length) {
        preview.innerHTML = '';
        return;
      }
      preview.innerHTML = state.imageFiles.map(file => `
        <div class="tool-preview-item">
          <img class="tool-preview-thumb" src="${URL.createObjectURL(file)}" alt="${file.name}">
          <div>
            <div style="font-weight:800;color:var(--text-dark);font-size:13px;">${file.name}</div>
            <div style="font-size:11.5px;color:var(--text-muted);">${Math.round(file.size / 1024)} KB</div>
          </div>
          <button type="button" class="tool-btn ghost" data-remove-image="${file.name}">حذف</button>
        </div>`).join('');

      preview.querySelectorAll('[data-remove-image]').forEach(btn => {
        btn.addEventListener('click', () => {
          state.imageFiles = state.imageFiles.filter(file => file.name !== btn.dataset.removeImage);
          updatePreview();
        });
      });
    }

    function addFiles(files) {
      const images = Array.from(files || []).filter(file => file.type.startsWith('image/'));
      state.imageFiles = [...state.imageFiles, ...images].slice(0, 30);
      updatePreview();
    }

    dropzone?.addEventListener('click', () => input?.click());
    input?.addEventListener('change', e => addFiles(e.target.files));
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone?.addEventListener(eventName, e => {
        e.preventDefault();
        dropzone.style.background = '#edf4ff';
      });
    });
    ['dragleave', 'drop'].forEach(eventName => {
      dropzone?.addEventListener(eventName, e => {
        e.preventDefault();
        dropzone.style.background = '';
      });
    });
    dropzone?.addEventListener('drop', e => addFiles(e.dataTransfer.files));

    convertBtn?.addEventListener('click', async () => {
      if (!state.imageFiles.length) {
        showMessage('#pdf-output', 'أضف صورة واحدة على الأقل أولًا.', 'error');
        return;
      }

      try {
        showMessage('#pdf-output', 'جارِ تجهيز ملف PDF...');
        const pdf = new window.jspdf.jsPDF({ unit: 'pt', format: 'a4' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        for (let index = 0; index < state.imageFiles.length; index += 1) {
          const file = state.imageFiles[index];
          const dataUrl = await fileToDataUrl(file);
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = dataUrl;
          });

          const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
          const targetWidth = img.width * ratio;
          const targetHeight = img.height * ratio;
          const x = (pageWidth - targetWidth) / 2;
          const y = (pageHeight - targetHeight) / 2;

          const format = file.type.includes('png') ? 'PNG' : 'JPEG';
          if (index > 0) pdf.addPage();
          pdf.addImage(dataUrl, format, x, y, targetWidth, targetHeight, undefined, 'FAST');
        }

        pdf.save('sanad-images-to-pdf.pdf');
        showMessage('#pdf-output', `تم إنشاء ملف PDF بنجاح من ${state.imageFiles.length} صورة ✅`);
      } catch (error) {
        showMessage('#pdf-output', 'حدث خطأ أثناء التحويل. جرّب صورًا أقل أو أحجامًا أصغر.', 'error');
      }
    });
  }

  function splitIntoChunks(text, size) {
    const chunks = [];
    let current = '';
    text.split(/(?<=[\.\!\?\n])/).forEach(part => {
      if ((current + part).length > size) {
        if (current) chunks.push(current);
        current = part;
      } else {
        current += part;
      }
    });
    if (current) chunks.push(current);
    return chunks.length ? chunks : [text];
  }

  async function translateChunk(text, source, target) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
    const response = await fetch(url);
    const data = await response.json();
    return data?.responseData?.translatedText || text;
  }

  function setupTranslator() {
    const textarea = $('#translator-input');
    const output = $('#translator-output');
    const fileInput = $('#translator-file');
    const translateBtn = $('#translate-btn');
    const downloadBtn = $('#download-translation-btn');

    fileInput?.addEventListener('change', async e => {
      const file = e.target.files?.[0];
      if (!file) return;
      const text = await readFileText(file);
      textarea.value = text;
      showMessage('#translator-output', `تم تحميل الملف ${file.name} ويمكنك الآن بدء الترجمة.`);
    });

    translateBtn?.addEventListener('click', async () => {
      const source = $('#translator-source')?.value || 'ar';
      const target = $('#translator-target')?.value || 'en';
      const text = textarea?.value.trim() || '';
      if (!text) {
        showMessage('#translator-output', 'أدخل نصًا أو ارفع ملفًا نصيًا أولًا.', 'error');
        return;
      }
      if (source === target) {
        output.textContent = text;
        showMessage('#translator-status', 'اللغة المصدر والهدف متطابقتان، لذلك تم عرض النص كما هو.');
        return;
      }

      try {
        showMessage('#translator-status', 'جارِ الترجمة... قد تستغرق عدة ثوانٍ بحسب طول النص.');
        const limited = text.slice(0, 6000);
        const chunks = splitIntoChunks(limited, 420);
        const translated = [];
        for (let i = 0; i < chunks.length; i += 1) {
          translated.push(await translateChunk(chunks[i], source, target));
        }
        output.textContent = translated.join(' ');
        showMessage('#translator-status', 'تمت الترجمة بنجاح ✅');
      } catch (error) {
        showMessage('#translator-status', 'تعذر الوصول لخدمة الترجمة حاليًا. حاول لاحقًا أو استخدم نصًا أقصر.', 'error');
      }
    });

    downloadBtn?.addEventListener('click', () => {
      const text = output.textContent.trim();
      if (!text) {
        showMessage('#translator-status', 'لا يوجد ناتج مترجم لتنزيله بعد.', 'error');
        return;
      }
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'translated-file.txt';
      a.click();
    });
  }

  function setupWordCounter() {
    const input = $('#counter-input');
    const fileInput = $('#counter-file');

    function updateMetrics(text) {
      const clean = (text || '').trim();
      const words = clean ? clean.split(/\s+/).filter(Boolean).length : 0;
      const chars = clean.length;
      const charsNoSpaces = clean.replace(/\s+/g, '').length;
      const paragraphs = clean ? clean.split(/\n+/).filter(Boolean).length : 0;
      const pages = words ? (words / 250).toFixed(1) : '0.0';
      $('#metric-words').textContent = words;
      $('#metric-chars').textContent = chars;
      $('#metric-no-spaces').textContent = charsNoSpaces;
      $('#metric-paragraphs').textContent = paragraphs;
      $('#metric-pages').textContent = pages;
    }

    input?.addEventListener('input', () => updateMetrics(input.value));
    fileInput?.addEventListener('change', async e => {
      const file = e.target.files?.[0];
      if (!file) return;
      input.value = await readFileText(file);
      updateMetrics(input.value);
    });
    updateMetrics('');
  }

  function createGradeOptions(selected) {
    const grades = {
      'A+': 5,
      'A': 4.75,
      'B+': 4.5,
      'B': 4,
      'C+': 3.5,
      'C': 3,
      'D+': 2.5,
      'D': 2,
      'F': 1
    };
    return Object.entries(grades).map(([label, value]) => `
      <option value="${value}" ${String(selected) === String(value) ? 'selected' : ''}>${label}</option>`).join('');
  }

  function setupGpaCalculator() {
    const rows = $('#gpa-rows');
    const addRowBtn = $('#add-gpa-row');
    const calcBtn = $('#calc-gpa-btn');

    function addRow(course, hours, grade) {
      const row = document.createElement('div');
      row.className = 'gpa-row';
      row.innerHTML = `
        <input class="tool-input" type="text" placeholder="اسم المادة" value="${course || ''}">
        <input class="tool-input" type="number" min="1" max="10" placeholder="الساعات" value="${hours || ''}">
        <select class="tool-select">${createGradeOptions(grade || 4.75)}</select>
        <button type="button" class="tool-btn ghost">حذف</button>`;
      row.querySelector('button').addEventListener('click', () => row.remove());
      rows.appendChild(row);
    }

    addRow('مهارات الاتصال', 3, 4.75);
    addRow('رياضيات عامة', 4, 4.5);
    addRow('حاسب آلي', 2, 5);

    addRowBtn?.addEventListener('click', () => addRow('', '', 4.75));
    calcBtn?.addEventListener('click', () => {
      const items = $all('.gpa-row').map(row => {
        const inputs = row.querySelectorAll('input, select');
        return {
          hours: Number(inputs[1].value || 0),
          grade: Number(inputs[2].value || 0)
        };
      }).filter(item => item.hours > 0 && item.grade > 0);

      const totalHours = items.reduce((sum, item) => sum + item.hours, 0);
      const totalPoints = items.reduce((sum, item) => sum + item.hours * item.grade, 0);
      const gpa = totalHours ? (totalPoints / totalHours).toFixed(2) : '0.00';
      $('#gpa-result').textContent = gpa;
      $('#gpa-hours').textContent = totalHours;
      $('#gpa-points').textContent = totalPoints.toFixed(2);
    });
  }

  function setupQrGenerator() {
    const input = $('#qr-input');
    const generateBtn = $('#generate-qr-btn');
    const preview = $('#qr-preview');
    const downloadBtn = $('#download-qr-btn');

    function generate() {
      const text = input?.value.trim() || '';
      if (!text) {
        showMessage('#qr-status', 'أدخل رابطًا أو نصًا لإنشاء QR.', 'error');
        return;
      }
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(text)}`;
      preview.innerHTML = `<img src="${url}" alt="QR Code"><div style="font-weight:800;color:var(--text-dark);margin-bottom:6px;">تم إنشاء الكود بنجاح</div><div style="font-size:12px;color:var(--text-muted);">يمكنك تنزيله أو مشاركته الآن.</div>`;
      downloadBtn.dataset.qrUrl = url;
      showMessage('#qr-status', 'QR جاهز ✅');
    }

    generateBtn?.addEventListener('click', generate);
    downloadBtn?.addEventListener('click', () => {
      const url = downloadBtn.dataset.qrUrl;
      if (!url) {
        showMessage('#qr-status', 'أنشئ QR أولًا قبل التنزيل.', 'error');
        return;
      }
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sanad-qr.png';
      a.target = '_blank';
      a.click();
    });
  }

  function renderPomodoro() {
    const { minutes, secondsLeft } = state.pomodoro;
    const totalSeconds = minutes * 60;
    const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 360;
    $('#pomo-clock')?.style.setProperty('background', `conic-gradient(#2563eb ${progress}deg, #dbeafe ${progress}deg)`);
    const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const secs = String(secondsLeft % 60).padStart(2, '0');
    $('#pomo-time').textContent = `${mins}:${secs}`;
  }

  function setupPomodoro() {
    const startBtn = $('#pomo-start');
    const pauseBtn = $('#pomo-pause');
    const resetBtn = $('#pomo-reset');

    function setMinutes(minutes) {
      state.pomodoro.minutes = minutes;
      state.pomodoro.secondsLeft = minutes * 60;
      renderPomodoro();
    }

    $all('[data-pomo-minutes]').forEach(btn => {
      btn.addEventListener('click', () => setMinutes(Number(btn.dataset.pomoMinutes || 25)));
    });

    startBtn?.addEventListener('click', () => {
      if (state.pomodoro.running) return;
      state.pomodoro.running = true;
      state.pomodoro.timer = setInterval(() => {
        if (state.pomodoro.secondsLeft > 0) {
          state.pomodoro.secondsLeft -= 1;
          renderPomodoro();
        } else {
          clearInterval(state.pomodoro.timer);
          state.pomodoro.running = false;
          showMessage('#pomo-status', 'انتهت الجلسة 🎉 خذ استراحة قصيرة ثم ابدأ من جديد.');
        }
      }, 1000);
      showMessage('#pomo-status', 'بدأت جلسة التركيز. بالتوفيق!');
    });

    pauseBtn?.addEventListener('click', () => {
      clearInterval(state.pomodoro.timer);
      state.pomodoro.running = false;
      showMessage('#pomo-status', 'تم إيقاف المؤقت مؤقتًا.');
    });

    resetBtn?.addEventListener('click', () => {
      clearInterval(state.pomodoro.timer);
      state.pomodoro.running = false;
      setMinutes(state.pomodoro.minutes);
      showMessage('#pomo-status', 'تمت إعادة ضبط المؤقت.');
    });

    setMinutes(25);
  }

  function setupJsonFormatter() {
    const input = $('#json-input');
    const output = $('#json-output');

    $('#json-format-btn')?.addEventListener('click', () => {
      try {
        const parsed = JSON.parse(input.value);
        output.textContent = JSON.stringify(parsed, null, 2);
        showMessage('#json-status', 'تم تنسيق JSON بنجاح ✅');
      } catch (error) {
        showMessage('#json-status', 'صيغة JSON غير صحيحة. تأكد من الأقواس والفواصل.', 'error');
      }
    });

    $('#json-minify-btn')?.addEventListener('click', () => {
      try {
        const parsed = JSON.parse(input.value);
        output.textContent = JSON.stringify(parsed);
        showMessage('#json-status', 'تم ضغط JSON بنجاح ✅');
      } catch (error) {
        showMessage('#json-status', 'صيغة JSON غير صحيحة. تأكد من الأقواس والفواصل.', 'error');
      }
    });

    $('#json-copy-btn')?.addEventListener('click', async () => {
      const text = output.textContent.trim();
      if (!text) {
        showMessage('#json-status', 'لا يوجد ناتج لنسخه بعد.', 'error');
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        showMessage('#json-status', 'تم نسخ الناتج ✅');
      } catch (error) {
        showMessage('#json-status', 'تعذر النسخ التلقائي.', 'error');
      }
    });
  }

  function init() {
    setupToolNavigation();
    setupImageToPdf();
    setupTranslator();
    setupWordCounter();
    setupGpaCalculator();
    setupQrGenerator();
    setupPomodoro();
    setupJsonFormatter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
