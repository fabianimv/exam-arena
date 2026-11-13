/* =========================================================================
   assets/js/app.js — Motor Multi-Provider (SRE, GCP, Azure, AWS)
   Look & Feel moderno, atajos de teclado, filtro de glosario y métricas globales
   e integrado con @fabianimv/study-tracker, ExamI18n y ExamCloudSync.
   ========================================================================= */
(function (w, d) {
  'use strict';

  var EXAM_ORDER = [
    'claude-architect',
    'claude-developer',
    'claude-associate',
    'harness-engineering',
    'databricks-genai',
    'databricks-de',
    'nvidia-genl',
    'k8s-kcna',
    'terraform-003',
    'sre-incidents',
    'kafka-confluent',
    'gcp-genai-leader',
    'az-104',
    'aws-saa-c03'
  ];
  var LETTERS = 'ABCDEF';
  var view = d.getElementById('view');
  var picker = d.getElementById('exam-picker');

  var currentExamId = 'claude-architect';
  var currentTab = 'examenes';

  /* Inyección de ajuste tipográfico para tarjetas KPI */
  (function () {
    if (d.getElementById('arena-kpi-fix')) return;
    var st = d.createElement('style');
    st.id = 'arena-kpi-fix';
    st.textContent = '.kpi-card b { font-size: 1.5rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; line-height: 1.2; } .kpi-card span { font-size: 0.74rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); }';
    var headEl = d.head || d.documentElement;
    if (headEl && headEl.appendChild) headEl.appendChild(st);
  })();

  /* ---------- Formateo de Texto y Helpers de i18n ---------- */
  function esc(s) {
    if (s == null) return '';
    if (w.ExamI18n && w.ExamI18n.esc) return w.ExamI18n.esc(s);
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function certLogo(id, size, extraClass) {
    if (!id) return '';
    if (typeof w.getCertLogo === 'function') {
      try {
        return w.getCertLogo(id, { size: size, className: extraClass }) || '';
      } catch (err) {
        return '';
      }
    }
    return '';
  }

  var METRIC_REGEX = /\b((?:HTTP\s+)?[1-5]\d\d\s+(?:Bad Gateway|Gateway Timeout|Service Unavailable|Too Many Requests|Internal Server Error)|HTTP\s+[1-5]\d\d|p90|p95|p99(?:\.9)?|RTO|RPO|SLO|SLA|SLI|OOMKilled|CrashLoopBackOff|Pending|ImagePullBackOff|ErrImagePull)\b/g;

  function highlightMetrics(text) {
    if (!text) return '';
    return text.replace(/(<[^>]+>)|([^<]+)/g, function (m, tag, textPart) {
      if (tag) return tag;
      return textPart.replace(METRIC_REGEX, '<span class="hl-metric">$1</span>');
    });
  }

  function fmt(s) {
    if (s == null) return '';
    if (w.ExamI18n && w.ExamI18n.fmt) return w.ExamI18n.fmt(s);
    var out = esc(s)
      .replace(/`([^`]+)`/g, '<strong class="hl-term">$1</strong>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="hl-term">$1</strong>');
    return highlightMetrics(out);
  }

  function fmtQuestion(rawText) {
    if (!rawText) return '';
    var s = String(rawText).trim();

    var scenarioPart = '';
    var askPart = '';

    var qPos = s.lastIndexOf('¿');
    var qMark = s.lastIndexOf('?');

    if (qPos > 0) {
      var beforeQ = s.slice(0, qPos);
      var lastPeriod = Math.max(beforeQ.lastIndexOf('. '), beforeQ.lastIndexOf('.\n'), beforeQ.lastIndexOf('? '));
      if (lastPeriod !== -1 && (qPos - lastPeriod) < 60) {
        scenarioPart = s.slice(0, lastPeriod + 1).trim();
        askPart = s.slice(lastPeriod + 1).trim();
      } else {
        scenarioPart = s.slice(0, qPos).trim();
        askPart = s.slice(qPos).trim();
      }
    } else if (qPos === 0) {
      scenarioPart = '';
      askPart = s;
    } else if (qMark !== -1) {
      var beforeQMark = s.slice(0, qMark);
      var lastSep = Math.max(
        beforeQMark.lastIndexOf('. '),
        beforeQMark.lastIndexOf('.\n'),
        beforeQMark.lastIndexOf(':\n'),
        beforeQMark.lastIndexOf(': '),
        beforeQMark.lastIndexOf('? ')
      );
      if (lastSep !== -1 && lastSep > 15) {
        scenarioPart = s.slice(0, lastSep + 1).trim();
        askPart = s.slice(lastSep + 1).trim();
      } else {
        scenarioPart = '';
        askPart = s;
      }
    } else {
      var lastSep = Math.max(
        s.lastIndexOf('. '),
        s.lastIndexOf('.\n'),
        s.lastIndexOf(':\n'),
        s.lastIndexOf(': ')
      );
      if (lastSep !== -1 && lastSep > 25) {
        scenarioPart = s.slice(0, lastSep + 1).trim();
        askPart = s.slice(lastSep + 1).trim();
      } else {
        scenarioPart = '';
        askPart = s;
      }
    }

    if (!askPart) {
      askPart = scenarioPart || s;
      scenarioPart = '';
    }

    var scenarioLabel = t('scenario_label', 'Escenario / Contexto');
    var askLabel = t('ask_label', 'Pregunta clave');

    var askHtml = '<div class="q-ask">' +
      '<span class="q-ask-icon" aria-hidden="true">?</span>' +
      '<div class="q-ask-content">' +
        '<div class="q-ask-label">' + askLabel + '</div>' +
        '<div class="q-ask-text">' + fmt(askPart) + '</div>' +
      '</div>' +
    '</div>';

    if (scenarioPart) {
      return '<div class="q-scenario">' +
        '<div class="q-section-label"><span class="q-section-dot"></span><span>' + scenarioLabel + '</span></div>' +
        '<div class="q-scenario-body">' + fmt(scenarioPart) + '</div>' +
      '</div>' + askHtml;
    }

    return askHtml;
  }

  function stripTicks(s) {
    if (s == null) return '';
    if (w.ExamI18n && w.ExamI18n.stripTicks) return w.ExamI18n.stripTicks(s);
    return String(s)
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1');
  }

  function getLang() {
    if (w.ExamI18n && w.ExamI18n.getLang) return w.ExamI18n.getLang();
    return 'es';
  }

  function t(key, varsOrFallback, fallback) {
    var vars = (varsOrFallback && typeof varsOrFallback === 'object') ? varsOrFallback : null;
    var fb = typeof varsOrFallback === 'string' ? varsOrFallback : fallback;
    if (w.ExamI18n && w.ExamI18n.t) {
      var val = w.ExamI18n.t(key, vars);
      if (val !== key) return val;
    }
    if (vars && fb) {
      return fb.replace(/\{([a-zA-Z0-9_]+)\}/g, function (m, n) {
        return (n in vars && vars[n] != null) ? vars[n] : m;
      });
    }
    return fb || key;
  }

  /* ---------- Tema Claro / Oscuro ---------- */
  function getSavedTheme() {
    var theme = null;
    try {
      theme = localStorage.getItem('exam-arena-theme');
    } catch (e) {}
    if (theme === 'dark' || theme === 'light') return theme;
    return (w.matchMedia && w.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    d.documentElement.setAttribute('data-theme', theme);
    var toggleBtn = d.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
      var title = theme === 'dark' ? t('theme_to_light', 'Cambiar a modo claro') : t('theme_to_dark', 'Cambiar a modo oscuro');
      toggleBtn.setAttribute('aria-label', title);
      toggleBtn.title = title;
    }
  }

  function toggleTheme() {
    var current = d.documentElement.getAttribute('data-theme') || getSavedTheme();
    var next = current === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('exam-arena-theme', next);
    } catch (e) {}
    applyTheme(next);
  }

  function initTheme() {
    var theme = getSavedTheme();
    applyTheme(theme);
    var toggleBtn = d.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.onclick = toggleTheme;
    }
  }

  d.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest && e.target.closest('#theme-toggle');
    if (btn) {
      toggleTheme();
    }
  });

  // Instancias de StudyTracker cacheadas por appId
  var trackers = {};
  var noop = function () {};

  function getTracker(appId) {
    if (trackers[appId]) return trackers[appId];
    if (w.StudyTracker) {
      trackers[appId] = w.StudyTracker.create({ appId: appId });
    } else {
      trackers[appId] = {
        unavailable: true,
        startSession: function () { return null; },
        recordAnswer: noop,
        endSession: noop,
        questionStats: function () { return {}; },
        mastery: function () { return { seen: 0, mastered: 0, mastery: null, total: 0 }; },
        getSessions: function () { return []; }
      };
    }
    return trackers[appId];
  }

  function exam() {
    return (w.EXAMS || {})[currentExamId] || (w.EXAMS || {})[EXAM_ORDER[0]];
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function initPicker() {
    if (!picker) return;
    picker.innerHTML = EXAM_ORDER.filter(function (id) { return w.EXAMS && w.EXAMS[id]; }).map(function (id) {
      var ex = w.EXAMS[id];
      return '<option value="' + esc(id) + '">' + ex.icon + ' ' + esc(ex.badge) + ' (' + ex.questions.length + ')</option>';
    }).join('');
    picker.value = currentExamId;
    picker.onchange = function () {
      var nextExam = this.value;
      var targetTab = currentTab === 'examenes' ? 'prueba' : currentTab;
      navigate(nextExam, targetTab);
    };
  }
  var updateExamPicker = initPicker;

  function examBannerHtml(ex) {
    if (!ex) return '';
    var bannerLogo = certLogo(ex.id, 28, 'banner-cert-logo');
    var badgeIcon = certLogo(ex.id, 16, 'badge-cert-logo') || ex.icon;
    var logoBox = bannerLogo ? '<div class="banner-logo-box">' + bannerLogo + '</div>' : '';
    return '<div class="exam-banner">' +
      '<div class="exam-banner-head">' +
        logoBox +
        '<div class="exam-banner-text">' +
          '<span class="badge">' + badgeIcon + ' ' + esc(ex.provider) + '</span>' +
          '<h1>' + esc(ex.title) + '</h1>' +
          '<p class="muted small">' + esc(ex.subtitle) + '</p>' +
        '</div>' +
      '</div>' +
      '</div>';
  }

  function domainKeys(ex) {
    return Object.keys(ex.domains).map(function (k) { return parseInt(k, 10); });
  }

  function domainSelect(ex, id, value) {
    var allLabel = t('all_domains', { n: ex.questions.length }, 'Todos los dominios (' + ex.questions.length + ' preguntas)');
    return '<select id="' + id + '"><option value="0">' + allLabel + '</option>' +
      domainKeys(ex).map(function (k) {
        var count = ex.questions.filter(function (q) { return q.d === k; }).length;
        var dName = (ex.domains && ex.domains[k]) || '';
        var optLabelText = t('domain_opt', { k: k, name: dName, n: count }, 'Dominio ' + k + ' · ' + dName + ' — ' + count + ' preg.');
        return '<option value="' + k + '"' + (value === k ? ' selected' : '') + '>' + esc(optLabelText) + '</option>';
      }).join('') + '</select>';
  }

  /* ---------- Actualización de Textos de Navegación e Idioma ---------- */
  function updateNavLabels() {
    var lang = getLang();
    var tabMap = {
      examenes: t('tab_examenes', 'Exámenes'),
      temas: t('tab_temas', 'Temas'),
      prueba: t('tab_prueba', 'Prueba'),
      progreso: t('tab_progreso', 'Progreso'),
      glosario: t('tab_glosario', 'Glosario')
    };

    Array.prototype.forEach.call(d.querySelectorAll('#tabs button'), function (b) {
      var tabKey = b.getAttribute('data-tab');
      if (tabMap[tabKey]) {
        b.textContent = tabMap[tabKey];
      }
    });

    var langBtn = d.getElementById('lang-toggle');
    if (langBtn) {
      langBtn.textContent = lang.toUpperCase();
      var langTitle = t('lang_toggle_title', 'Cambiar idioma (ES/EN)');
      langBtn.title = langTitle;
      langBtn.setAttribute('aria-label', langTitle);
    }

    var theme = d.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(theme);
  }

  function initLang() {
    var langBtn = d.getElementById('lang-toggle');
    if (langBtn) {
      langBtn.onclick = function () {
        if (w.ExamI18n && w.ExamI18n.toggleLang) {
          w.ExamI18n.toggleLang();
        }
      };
    }

    w.addEventListener('exam-arena-lang-change', function () {
      updateNavLabels();
      // Re-renderizar la vista activa. Si está en mitad de una prueba activa,
      // actualiza la pregunta sin resetear el objeto T ni perder la sesión.
      if (currentTab === 'prueba' && T.list && T.list.length && T.session) {
        showQuestion();
      } else if (TABS[currentTab]) {
        TABS[currentTab]();
      }
    });

    updateNavLabels();
  }

  /* ---------- Catálogo de Exámenes (Hub) ---------- */
  function showHub() {
    var totalQ = 0;
    var totalSeen = 0;
    var totalMastered = 0;
    var totalSessions = 0;

    EXAM_ORDER.forEach(function (id) {
      if (!w.EXAMS || !w.EXAMS[id]) return;
      var ex = w.EXAMS[id];
      var tr = getTracker(ex.appId);
      var m = tr.mastery ? tr.mastery() : { seen: 0, mastered: 0 };
      totalQ += ex.questions.length;
      totalSeen += (m.seen || 0);
      var mastered = (m.mastered != null) ? m.mastered : (m.mastery != null ? Math.round((m.seen || 0) * m.mastery / 100) : 0);
      totalMastered += (mastered || 0);
      if (tr.getSessions) {
        totalSessions += tr.getSessions().length;
      }
    });

    var globalMastery = totalSeen ? Math.round(totalMastered / totalSeen * 100) + ' %' : '—';

    var cards = EXAM_ORDER.filter(function (id) { return w.EXAMS && w.EXAMS[id]; }).map(function (id) {
      var ex = w.EXAMS[id];
      var tr = getTracker(ex.appId);
      var m = tr.mastery ? tr.mastery() : { seen: 0, mastered: 0, mastery: null };
      var sessions = tr.getSessions ? tr.getSessions().length : 0;
      var masteryTxt = m.mastery != null ? m.mastery + ' %' : '—';
      var isCurrent = id === currentExamId;
      var covPct = Math.round(((m.seen || 0) / ex.questions.length) * 100);

      var domainChips = domainKeys(ex).map(function (k) {
        var name = (ex.shortDomains && ex.shortDomains[k]) || ex.domains[k] || (t('domain_label', 'Dominio') + ' ' + k);
        return '<span class="domain-chip">' + esc(name) + '</span>';
      }).join('');

      var featuredHtml = ex.featured ? '<span class="featured-pill">' + t('featured_badge', '✨ Featured') + '</span>' : '';
      var cardLogo = certLogo(id, 36, 'hub-cert-logo');
      var badgeLogo = certLogo(id, 15, 'badge-cert-logo') || ex.icon;
      var logoBoxHtml = cardLogo ? '<div class="hub-card-logo-box">' + cardLogo + '</div>' : '';

      return '<div class="hub-card' + (isCurrent ? ' current' : '') + (ex.featured ? ' is-featured' : '') + '" data-provider="' + esc(id) + '">' +
        '<div>' +
          '<div class="hub-card-top hub-card-head">' +
            logoBoxHtml +
            '<div class="hub-card-head-content">' +
              '<div class="hub-card-badges"><span class="badge">' + badgeLogo + ' ' + esc(ex.provider) + '</span>' + featuredHtml + '</div>' +
              '<h3>' + esc(ex.title) + '</h3>' +
            '</div>' +
          '</div>' +
          '<p class="muted small">' + esc(ex.subtitle) + '</p>' +
          '<div class="hub-domains">' + domainChips + '</div>' +
        '</div>' +
        '<div>' +
          '<div class="hub-cov" style="background:var(--surface-2);border-radius:var(--radius-pill);overflow:hidden"><div class="hub-cov-bar" style="width:' + covPct + '%;background:var(--accent-grad,var(--blue))"><div class="hub-cov-fill" style="width:100%"></div></div></div>' +
          '<div class="hub-stats">' +
            '<div class="hub-stat"><b>' + ex.questions.length + '</b><span>' + t('stat_questions', { n: domainKeys(ex).length }, 'Preguntas (' + domainKeys(ex).length + ' dom.)') + '</span></div>' +
            '<div class="hub-stat"><b>' + (m.seen || 0) + ' / ' + ex.questions.length + '</b><span>' + t('stat_seen', 'Vistas') + '</span></div>' +
            '<div class="hub-stat"><b>' + masteryTxt + '</b><span>' + t('stat_mastery', { n: sessions }, 'Dominio (' + sessions + ' ses.)') + '</span></div>' +
          '</div>' +
          '<div class="hub-actions">' +
            '<button class="primary" data-go="' + esc(id) + '/prueba">' + t('btn_practice', 'Practicar prueba') + '</button>' +
            '<button data-go="' + esc(id) + '/temas">' + t('btn_topics', { n: ex.topics.length }, 'Temas (' + ex.topics.length + ')') + '</button>' +
            '<button data-go="' + esc(id) + '/progreso">' + t('btn_progress', 'Progreso') + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    view.innerHTML =
      '<div class="card hub-hero">' +
        '<h1>' + t('hub_title', 'Simulador General de Exámenes Cloud & SRE') + '</h1>' +
        '<p class="muted">' + t('hub_desc', 'Elige un proveedor o certificación. Cada pregunta se corrige al instante explicando <b>por qué tu opción elegida es incorrecta</b> y <b>por qué la respuesta correcta es la adecuada</b>. Todo tu avance se guarda localmente en este navegador con <code>@fabianimv/study-tracker</code> y puede sincronizarse en la nube.') + '</p>' +
        '<div class="hub-kpis">' +
          '<div class="kpi-card"><b>' + totalQ + '</b><span>' + t('kpi_total_q', 'Preguntas en 13 simuladores') + '</span></div>' +
          '<div class="kpi-card"><b>' + totalSeen + ' / ' + totalQ + '</b><span>' + t('kpi_seen', 'Preguntas vistas') + '</span></div>' +
          '<div class="kpi-card"><b>' + globalMastery + '</b><span>' + t('kpi_mastery', 'Dominio global estimado') + '</span></div>' +
          '<div class="kpi-card"><b>' + totalSessions + '</b><span>' + t('kpi_sessions', 'Sesiones completadas') + '</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="hub-grid">' + cards + '</div>';

    Array.prototype.forEach.call(view.querySelectorAll('[data-go]'), function (btn) {
      btn.onclick = function () {
        var parts = btn.getAttribute('data-go').split('/');
        navigate(parts[0], parts[1]);
      };
    });
  }

  /* ---------- Temas ---------- */
  function showTopics() {
    var ex = exam();
    var isEn = getLang() === 'en';
    var html = examBannerHtml(ex) +
      '<div class="topics-toolbar" style="display:flex; justify-content:space-between; align-items:center; gap:1rem; margin-bottom:1rem; flex-wrap:wrap">' +
        '<p class="muted" style="margin:0">' + t('topics_intro', 'Lee el resumen de cada dominio y luego ponlo a prueba en la pestaña <b>Prueba</b>.') + '</p>' +
        '<button type="button" id="toggle-topics">' + t('btn_expand_all', 'Expandir todos los temas') + '</button>' +
      '</div>';

    domainKeys(ex).forEach(function (k) {
      var topics = ex.topics.filter(function (t) { return t.d === k && t.id.indexOf('t-5') !== 0; });
      if (topics.length) {
        html += '<h2 class="dom-header" data-d="' + k + '">' + t('domain_label', 'Dominio') + ' ' + k + ' · ' + esc(ex.domains[k]) + '</h2>' + topics.map(topicHtml).join('');
      }
    });

    var extra = ex.topics.filter(function (t) { return t.id.indexOf('t-5') === 0; });
    if (extra.length) html += '<h2>' + t('extra_label', 'Extra') + '</h2>' + extra.map(topicHtml).join('');

    view.innerHTML = html;

    var toggleBtn = d.getElementById('toggle-topics');
    if (toggleBtn) {
      function updateToggleText() {
        var topics = view.querySelectorAll('details.topic');
        if (!topics.length) return;
        var allOpen = Array.prototype.every.call(topics, function (det) { return det.open; });
        toggleBtn.textContent = allOpen ? t('btn_collapse_all', 'Contraer todos los temas') : t('btn_expand_all', 'Expandir todos los temas');
      }

      toggleBtn.onclick = function () {
        var topics = view.querySelectorAll('details.topic');
        if (!topics.length) return;
        var allOpen = Array.prototype.every.call(topics, function (det) { return det.open; });
        var targetState = !allOpen;
        Array.prototype.forEach.call(topics, function (det) {
          det.open = targetState;
        });
        toggleBtn.textContent = targetState ? t('btn_collapse_all', 'Contraer todos los temas') : t('btn_expand_all', 'Expandir todos los temas');
      };

      Array.prototype.forEach.call(view.querySelectorAll('details.topic'), function (det) {
        det.addEventListener('toggle', updateToggleText);
      });
    }

    // Traducción dinámica al español de títulos de dominios y temas visibles
    if (!isEn && w.ExamI18n && w.ExamI18n.translateBatch) {
      var summaries = view.querySelectorAll('details.topic > summary');
      var toTranslate = [];
      Array.prototype.forEach.call(summaries, function (s) {
        toTranslate.push(s.textContent);
      });
      if (toTranslate.length) {
        w.ExamI18n.translateBatch(toTranslate, function (translated) {
          Array.prototype.forEach.call(summaries, function (s, idx) {
            if (translated && translated[idx]) {
              s.innerHTML = fmt(translated[idx]);
            }
          });
        });
      }
    }
  }

  function resolveVisualAid(ex, item, isTopic) {
    if (!w.EXAM_VISUALS || !ex || !item) return null;
    var pack = w.EXAM_VISUALS[ex.id];
    if (!pack) return null;
    if (isTopic) {
      return (pack.topics && pack.topics[item.id]) || null;
    }
    return (pack.questions && pack.questions[item.id]) || null;
  }

  function visualAidHtml(ex, item, isTopic) {
    var v = resolveVisualAid(ex, item, isTopic);
    if (!v || !v.svg) return '';
    var isEn = getLang() === 'en';
    var title = (isEn && v.titleEn) ? v.titleEn : (v.title || (isEn ? 'Visual Architecture & Telemetry Aid' : 'Apoyo Visual · Arquitectura y Telemetría'));
    var caption = (isEn && v.captionEn) ? v.captionEn : (v.caption || '');
    var badge = v.badge || (isEn ? 'Visual Diagram' : 'Diagrama Visual');
    var eyebrow = isEn ? '📊 VISUAL AID' : '📊 APOYO VISUAL';
    return '<details class="q-visual-card" open>' +
      '<summary class="q-visual-header">' +
        '<div class="q-visual-title-wrap">' +
          '<span class="q-visual-eyebrow">' + eyebrow + '</span>' +
          '<span class="q-visual-badge">' + esc(badge) + '</span>' +
          '<strong class="q-visual-title">' + esc(title) + '</strong>' +
        '</div>' +
        '<span class="q-visual-toggle">' + (isEn ? 'Toggle chart' : 'Ver / ocultar') + '</span>' +
      '</summary>' +
      '<div class="q-visual-body">' +
        '<div class="q-visual-canvas">' + v.svg + '</div>' +
        (caption ? '<div class="q-visual-caption">' + fmt(caption) + '</div>' : '') +
      '</div>' +
    '</details>';
  }

  function topicHtml(tItem) {
    var ex = exam();
    return '<details class="topic"><summary>' + fmt(tItem.title) + '</summary><div class="body">' + visualAidHtml(ex, tItem, true) + tItem.html + '</div></details>';
  }

  /* ---------- Prueba ---------- */
  var SIZES = [10, 20, 30, 55];
  var T = { examId: null, domain: 0, size: 20, which: 'all', list: [], i: 0, ok: 0, results: [], session: null };
  var WHICH = {
    all: 'Todas las preguntas',
    'new': 'Solo las que nunca he respondido',
    failed: 'Solo las que fallé la última vez'
  };

  function getWhichLabel(key) {
    var map = {
      all: t('which_all', 'Todas las preguntas'),
      'new': t('which_new', 'Solo las que nunca he respondido'),
      failed: t('which_failed', 'Solo las que fallé la última vez')
    };
    return map[key] || WHICH[key] || key;
  }

  function setupPool() {
    var ex = exam();
    var tr = getTracker(ex.appId);
    var qs = T.which === 'all' ? null : tr.questionStats();
    return ex.questions.filter(function (q) {
      if (T.domain && q.d !== T.domain) return false;
      if (T.which === 'new') return !qs[q.id];
      if (T.which === 'failed') return qs[q.id] && qs[q.id].lastCorrect === false;
      return true;
    });
  }

  function showSetup() {
    var ex = exam();
    if (T.examId !== ex.id) {
      T.examId = ex.id;
      T.domain = 0;
    }
    var pool = setupPool().length;
    var pass = ex.passingScore || 70;

    view.innerHTML =
      examBannerHtml(ex) +
      '<div class="card setup"><h2>' + t('setup_title', { badge: esc(ex.badge) }, 'Nueva prueba · ' + esc(ex.badge)) + '</h2>' +
      '<p class="muted">' + t('setup_desc', 'Responde cada escenario. Al confirmar tu respuesta verás al instante si acertaste; si te equivocas, se mostrará por qué tu opción está mal y cuál es la opción correcta con su fundamento.') + '</p>' +
      '<label>' + t('label_domain', 'Dominio') + '<br>' + domainSelect(ex, 'tdomain', T.domain) + '</label>' +
      '<label>' + t('label_size', 'Número de preguntas') + '<br><select id="tsize">' +
        SIZES.map(function (n) { return '<option value="' + n + '"' + (T.size === n ? ' selected' : '') + '>' + n + '</option>'; }).join('') +
        '<option value="0"' + (T.size === 0 ? ' selected' : '') + '>' + t('size_all', { n: pool }, 'Todas (' + pool + ')') + '</option>' +
      '</select></label>' +
      '<label>' + t('label_which', 'Qué preguntas') + '<br><select id="twhich">' +
        Object.keys(WHICH).map(function (k) { return '<option value="' + k + '"' + (T.which === k ? ' selected' : '') + '>' + getWhichLabel(k) + '</option>'; }).join('') +
      '</select></label>' +
      '<p class="muted small">' + t('setup_meta', { pool: pool, pass: pass }, 'Hay <b>' + pool + '</b> preguntas disponibles en esta selección. Nota de aprobación de referencia: <b>' + pass + ' %</b>. Tus respuestas se guardan en tiempo real con <code>@fabianimv/study-tracker</code>.') + '</p>' +
      '<button class="primary" id="tstart"' + (pool ? '' : ' disabled') + '>' + t('btn_start', 'Comenzar prueba') + '</button></div>';

    var tdom = d.getElementById('tdomain');
    if (tdom) tdom.onchange = function () { T.domain = parseInt(this.value, 10); showSetup(); };
    var tsz = d.getElementById('tsize');
    if (tsz) tsz.onchange = function () { T.size = parseInt(this.value, 10); };
    var twh = d.getElementById('twhich');
    if (twh) twh.onchange = function () { T.which = this.value; showSetup(); };
    var tst = d.getElementById('tstart');
    if (tst) tst.onclick = function () {
      var list = shuffle(setupPool());
      startTest(T.size ? list.slice(0, T.size) : list, { domain: T.domain, which: T.which });
    };
  }

  function startTest(list, meta) {
    var ex = exam();
    var tr = getTracker(ex.appId);
    T.examId = ex.id;
    T.list = shuffle(list);
    T.i = 0;
    T.ok = 0;
    T.results = [];
    T.session = tr.startSession({ planned: T.list.length, meta: meta || {} });
    showQuestion();
  }

  function endTest() {
    if (!T.session || !T.examId) return;
    var ex = (w.EXAMS || {})[T.examId];
    if (ex) {
      var tr = getTracker(ex.appId);
      tr.endSession(T.session, T.results.length >= T.list.length ? 'completed' : 'stopped');
    }
    T.session = null;
  }

  function optLabel(q, order, idx) {
    return LETTERS[order.indexOf(idx)] + '. ' + q.o[idx];
  }

  function showQuestion() {
    var ex = exam();
    var q = T.list[T.i];
    var correct = [].concat(q.a);
    var order = shuffle(q.o.map(function (_, idx) { return idx; }));
    var multi = correct.length > 1;
    var picked = [];
    var pct = Math.round(T.i / T.list.length * 100);
    var isEn = getLang() === 'en';

    var qOfText = t('q_of', { i: T.i + 1, n: T.list.length }, 'Pregunta <b>' + (T.i + 1) + '</b> de ' + T.list.length);
    var correctCountText = t('correct_count', 'Correctas:');
    var quitText = t('btn_quit', 'Terminar');
    var pickText = multi ? t('pick_multi', { n: correct.length }, 'Elige ' + correct.length + ' respuestas.') : t('pick_one', 'Elige una respuesta.');
    var kbHint = t('kb_hint', 'Atajos: teclas <kbd>A</kbd>–<kbd>D</kbd> o <kbd>1</kbd>–<kbd>4</kbd> para marcar · <kbd>Enter</kbd> para responder / avanzar');
    var answerBtnText = t('btn_answer', 'Responder');

    var domainName = (ex.shortDomains && ex.shortDomains[q.d]) || (ex.domains && ex.domains[q.d]) || '';
    var domainLabelText = t('domain_label', 'Dominio') + ' ' + q.d + (domainName ? ' · ' + esc(domainName) : '');

    view.innerHTML =
      '<div class="testbar"><span>' + (certLogo(ex.id, 16, 'inline-cert-logo') || ex.icon) + ' <b>' + esc(ex.badge) + '</b> · ' + qOfText + '</span>' +
      '<span>' + correctCountText + ' <b id="tok">' + T.ok + '</b></span>' +
      '<button id="tquit" class="link">' + quitText + '</button></div>' +
      '<div class="progress"><div style="width:' + pct + '%"></div></div>' +
      '<div class="card q-card">' +
      '<div class="q-header">' +
        '<div class="q-header-left">' +
          '<span class="q-domain-badge"><span class="q-domain-dot"></span>' + domainLabelText + '</span>' +
          '<span class="q-topic-badge" id="q-topic-text">📌 ' + fmt(q.t) + '</span>' +
        '</div>' +
        '<span class="q-pick-badge">' + pickText + '</span>' +
      '</div>' +
      '<div class="qtext">' + fmtQuestion(q.q) + '</div>' +
      visualAidHtml(ex, q, false) +
      '<div class="kb-hint muted small">' + kbHint + '</div>' +
      '<div class="opts">' + order.map(function (idx, pos) {
        return '<button class="opt" data-i="' + idx + '"><span class="letter">' + LETTERS[pos] + '</span><span>' + fmt(q.o[idx]) + '</span></button>';
      }).join('') + '</div>' +
      '<div id="feedback"><button class="primary" id="answer" disabled>' + answerBtnText + '</button></div>' +
      '</div>';

    var tquit = d.getElementById('tquit');
    if (tquit) tquit.onclick = showResults;

    var answerBtn = d.getElementById('answer');
    Array.prototype.forEach.call(view.querySelectorAll('.opt'), function (b) {
      b.onclick = function () {
        if (view.querySelector('.opts.locked')) return;
        var idx = parseInt(b.getAttribute('data-i'), 10);
        if (!multi) {
          picked = [idx];
          Array.prototype.forEach.call(view.querySelectorAll('.opt'), function (o) { o.classList.toggle('sel', o === b); });
        } else {
          var at = picked.indexOf(idx);
          if (at === -1 && picked.length < correct.length) picked.push(idx);
          else if (at !== -1) picked.splice(at, 1);
          b.classList.toggle('sel', picked.indexOf(idx) !== -1);
        }
        if (answerBtn) answerBtn.disabled = picked.length !== correct.length;
      };
    });

    if (answerBtn) {
      answerBtn.onclick = function () {
        reveal(ex, q, order, correct, picked);
      };
    }

    // Traducción automática al español si el idioma seleccionado es 'es'
    if (!isEn && w.ExamI18n && w.ExamI18n.translateQuestion) {
      w.ExamI18n.translateQuestion(q, function (trQ) {
        if (!T.list || T.list[T.i] !== q) return; // Si la sesión cambió de pregunta, no sobreescribir
        var qtextEl = view.querySelector('.qtext');
        if (qtextEl && trQ.q) qtextEl.innerHTML = fmtQuestion(trQ.q);

        var topicEl = d.getElementById('q-topic-text');
        if (topicEl && trQ.t) topicEl.innerHTML = '📌 ' + fmt(trQ.t);

        var optBtns = view.querySelectorAll('.opt');
        Array.prototype.forEach.call(optBtns, function (btn) {
          var idx = parseInt(btn.getAttribute('data-i'), 10);
          var textSpan = btn.querySelector('span:last-child');
          if (textSpan && trQ.o && trQ.o[idx]) {
            textSpan.innerHTML = fmt(trQ.o[idx]);
          }
        });
      });
    }
  }

  function reveal(ex, q, order, correct, picked) {
    var ok = picked.every(function (p) { return correct.indexOf(p) !== -1; });
    var why = (ex.why || {})[q.id] || [];
    var wrongPicked = picked.filter(function (p) { return correct.indexOf(p) === -1; });
    if (ok) T.ok++;
    T.results.push({ q: q, order: order, picked: picked, ok: ok });
    getTracker(ex.appId).recordAnswer(T.session, { question: q.id, topic: q.d, correct: ok, response: picked });

    var optsContainer = view.querySelector('.opts');
    if (optsContainer) optsContainer.classList.add('locked');

    Array.prototype.forEach.call(view.querySelectorAll('.opt'), function (b) {
      var idx = parseInt(b.getAttribute('data-i'), 10);
      if (correct.indexOf(idx) !== -1) b.classList.add('right');
      else if (picked.indexOf(idx) !== -1) b.classList.add('wrong');
    });

    var fbEl = d.getElementById('feedback');
    var nextText = (T.i + 1 < T.list.length) ? t('btn_next', 'Siguiente pregunta →') : t('btn_see_result', 'Ver resultado');

    function renderFeedbackWith(renderQ, renderWhy) {
      if (!fbEl) return;
      fbEl.innerHTML = feedbackHtml(renderQ, order, correct, wrongPicked, renderWhy, ok) +
        '<button class="primary" id="next">' + nextText + '</button>';
      var nextBtn = d.getElementById('next');
      if (nextBtn) {
        nextBtn.onclick = function () {
          T.i++;
          if (T.i < T.list.length) { showQuestion(); w.scrollTo(0, 0); } else showResults();
        };
      }
    }

    renderFeedbackWith(q, why);

    var tok = d.getElementById('tok');
    if (tok) tok.textContent = T.ok;

    // Si está en español, traducir automáticamente la explicación y respuestas en el feedback
    if (getLang() === 'es' && w.ExamI18n && w.ExamI18n.translateQuestion) {
      w.ExamI18n.translateQuestion(q, why, function (trQ, trWhy) {
        renderFeedbackWith(trQ, trWhy || why);
      });
    }
  }

  function feedbackHtml(q, order, correct, wrongPicked, why, ok) {
    if (ok) {
      return '<div class="fb good"><div class="fb-title">' + t('fb_correct', '✔ Correcto') + '</div><p>' + fmt(q.e) + '</p></div>';
    }
    return '<div class="fb bad"><div class="fb-title">' + t('fb_incorrect', '✘ Incorrecto') + '</div>' +
      wrongPicked.map(function (p) {
        var whyText = (why && why[p]) || t('fb_default_wrong', 'No es la opción que resuelve el escenario planteado.');
        return '<div class="fb-block"><div class="fb-label">' + t('fb_your_answer', 'Tu respuesta') + '</div><p class="fb-opt">' + fmt(optLabel(q, order, p)) + '</p>' +
          '<div class="fb-label">' + t('fb_why_wrong', 'Por qué está mal') + '</div><p>' + fmt(whyText) + '</p></div>';
      }).join('') +
      '</div>' +
      '<div class="fb good"><div class="fb-label">' + t('fb_right_answer', 'Respuesta correcta') + '</div>' +
      correct.slice().sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); }).map(function (c) {
        return '<p class="fb-opt">' + fmt(optLabel(q, order, c)) + '</p>';
      }).join('') +
      '<div class="fb-label">' + t('fb_why_right', 'Por qué') + '</div><p>' + fmt(q.e) + '</p></div>';
  }

  function showResults() {
    var ex = exam();
    endTest();
    var done = T.results.length;
    var pct = done ? Math.round(T.ok / done * 100) : 0;
    var pass = ex.passingScore || 70;
    var wrong = T.results.filter(function (r) { return !r.ok; });
    var isEn = getLang() === 'en';

    var resTitle = t('res_title', { badge: esc(ex.badge) }, 'Resultado · ' + esc(ex.badge));
    var resSummary = t('res_summary', { ok: T.ok, done: done, pass: pass }, T.ok + ' correctas de ' + done + ' respondidas (umbral de referencia: ' + pass + ' %).');
    var retryText = t('btn_retry_wrong', { n: wrong.length }, 'Repetir las ' + wrong.length + ' falladas');
    var newTestText = t('btn_new_test', 'Nueva prueba');
    var resSavedText = t('res_saved', { appId: esc(ex.appId) }, 'Resultado guardado en <code>' + esc(ex.appId) + '</code>.');
    var resViewProgText = t('res_view_progress', 'Ver tu progreso');
    var reviewTitle = t('res_review_title', 'Repaso de lo que fallaste');

    view.innerHTML =
      examBannerHtml(ex) +
      '<div class="card result"><h2>' + resTitle + '</h2>' +
      '<div class="score ' + (pct >= pass ? 'good' : 'bad') + '">' + pct + ' %</div>' +
      '<p>' + resSummary + '</p>' +
      (wrong.length ? '<button class="primary" id="retry">' + retryText + '</button> ' : '') +
      '<button id="newtest">' + newTestText + '</button>' +
      '<p class="muted small">' + resSavedText + ' <a href="#' + esc(ex.id) + '/progreso">' + resViewProgText + '</a></p></div>' +
      (wrong.length ? '<h2>' + reviewTitle + '</h2><div id="wrong-review-list">' + wrong.map(function (r) {
        var correct = [].concat(r.q.a);
        var why = (ex.why || {})[r.q.id] || [];
        var domainName = (ex.shortDomains && ex.shortDomains[r.q.d]) || (ex.domains && ex.domains[r.q.d]) || '';
        var domainLabelText = t('domain_label', 'Dominio') + ' ' + r.q.d + (domainName ? ' · ' + esc(domainName) : '');
        return '<div class="card review q-card" data-qid="' + esc(r.q.id) + '">' +
          '<div class="q-header">' +
            '<div class="q-header-left">' +
              '<span class="q-domain-badge"><span class="q-domain-dot"></span>' + domainLabelText + '</span>' +
              '<span class="q-topic-badge">📌 ' + fmt(r.q.t) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="qtext">' + fmtQuestion(r.q.q) + '</div>' +
          visualAidHtml(ex, r.q, false) +
          feedbackHtml(r.q, r.order, correct, r.picked.filter(function (p) { return correct.indexOf(p) === -1; }), why, false) +
          '</div>';
      }).join('') + '</div>' : '');

    var rt = d.getElementById('retry');
    if (rt) rt.onclick = function () { startTest(wrong.map(function (r) { return r.q; }), { retry: true }); };
    var nt = d.getElementById('newtest');
    if (nt) nt.onclick = showSetup;
    w.scrollTo(0, 0);

    // Traducción dinámica de la revisión de preguntas falladas al español
    if (!isEn && wrong.length && w.ExamI18n && w.ExamI18n.translateQuestion) {
      wrong.forEach(function (r) {
        var why = (ex.why || {})[r.q.id] || [];
        w.ExamI18n.translateQuestion(r.q, why, function (trQ, trWhy) {
          var cardEl = view.querySelector('.card.review[data-qid="' + r.q.id + '"]');
          if (cardEl) {
            var correct = [].concat(trQ.a);
            var domainName = (ex.shortDomains && ex.shortDomains[trQ.d]) || (ex.domains && ex.domains[trQ.d]) || '';
            var domainLabelText = t('domain_label', 'Dominio') + ' ' + trQ.d + (domainName ? ' · ' + esc(domainName) : '');
            cardEl.innerHTML = '<div class="q-header">' +
              '<div class="q-header-left">' +
                '<span class="q-domain-badge"><span class="q-domain-dot"></span>' + domainLabelText + '</span>' +
                '<span class="q-topic-badge">📌 ' + fmt(trQ.t) + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="qtext">' + fmtQuestion(trQ.q) + '</div>' +
            feedbackHtml(trQ, r.order, correct, r.picked.filter(function (p) { return correct.indexOf(p) === -1; }), trWhy || why, false);
          }
        });
      });
    }
  }

  /* ---------- Atajos de Teclado (Prueba) ---------- */
  w.addEventListener('keydown', function (e) {
    if (currentTab !== 'prueba') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    var tag = d.activeElement ? d.activeElement.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'select' || tag === 'textarea' || (d.activeElement && d.activeElement.isContentEditable)) {
      return;
    }

    var nextBtn = d.getElementById('next');
    if (nextBtn) {
      if (e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        nextBtn.click();
      }
      return;
    }

    var unlockedOpts = view.querySelectorAll('.opts:not(.locked) .opt');
    if (unlockedOpts && unlockedOpts.length) {
      var k = e.key;
      var idx = -1;
      if (/^[1-6]$/.test(k)) {
        idx = parseInt(k, 10) - 1;
      } else if (/^[a-fA-F]$/.test(k)) {
        idx = k.toLowerCase().charCodeAt(0) - 97;
      }

      if (idx >= 0 && idx < unlockedOpts.length) {
        e.preventDefault();
        unlockedOpts[idx].click();
        return;
      }

      if (k === 'Enter') {
        var answerBtn = d.getElementById('answer');
        if (answerBtn && !answerBtn.disabled) {
          e.preventDefault();
          answerBtn.click();
        }
      }
    }
  });

  /* ---------- Progreso ---------- */
  var progressView = null;

  var PROGRESS_TEXTS = {
    title: 'Tu progreso',
    week: 'Semana', month: 'Mes',
    thisWeek: 'esta semana', thisMonth: 'este mes',
    prevWeek: 'la semana anterior', prevMonth: 'el mes anterior',
    empty: 'Aún no hay respuestas guardadas en este examen. Haz una prueba y tu avance aparecerá aquí.',
    notPersistent: 'Este navegador no permite guardar datos (por ejemplo, en modo privado). Tu progreso se perderá al cerrar la página.',
    mastery: 'Dominio estimado',
    masteryHelp: 'De las preguntas que has visto en este examen, cuántas acertaste la última vez que las respondiste.',
    accuracy: 'Acierto',
    seen: 'Preguntas vistas',
    answered: 'Respondidas',
    noChange: 'sin cambios',
    noPrev: 'sin datos previos',
    byTopic: 'Por dominio',
    topic: 'Dominio', change: 'Cambio', seenShort: 'Vistas',
    trend: 'Acierto por', overall: 'General',
    history: 'Historial de pruebas',
    completed: 'Completada', stopped: 'Terminada antes', open: 'Sin cerrar',
    of: 'de', answeredOf: 'respondidas',
    yourAnswer: 'Tu respuesta', correctAnswer: 'Correcta',
    data: 'Tus datos',
    dataHelp: 'Todo se guarda localmente en este navegador por cada proveedor/examen. Exporta una copia JSON para respaldo o para migrarla a otro dispositivo.',
    exportBtn: 'Exportar copia', importBtn: 'Importar copia', clearBtn: 'Borrar todo',
    confirmClear: '¿Borrar todo el historial de este examen? No se puede deshacer.',
    imported: 'Importadas {n} respuestas nuevas.',
    importError: 'No se pudo importar: ',
    pts: 'pts', points: 'respuestas', weekOf: 'Semana del', inProgress: 'en curso',
    liveNote: 'El punto hueco es el periodo en curso: aún puede cambiar.'
  };

  function showProgress() {
    var ex = exam();
    var tr = getTracker(ex.appId);
    if (tr.unavailable || !w.StudyTrackerView) {
      view.innerHTML = examBannerHtml(ex) +
        '<div class="card"><h2>' + t('progress_not_available', 'Progreso no disponible') + '</h2><p class="muted">' +
        t('progress_not_available_desc', 'No se pudo cargar <code>@fabianimv/study-tracker</code> desde el CDN. Revisa tu conexión a internet y recarga la página.') + '</p></div>';
      return;
    }
    view.innerHTML = examBannerHtml(ex) + '<div id="st-mount"></div>';
    var mount = d.getElementById('st-mount');
    var qById = {};
    ex.questions.forEach(function (q) { qById[q.id] = q; });

    var localizedTexts = (w.ExamI18n && w.ExamI18n.progressTexts)
      ? w.ExamI18n.progressTexts(ex.badge)
      : Object.assign({}, PROGRESS_TEXTS, { title: 'Progreso · ' + ex.badge });

    progressView = w.StudyTrackerView.render(mount, tr, {
      topics: domainKeys(ex).map(function (k) {
        return {
          id: k,
          label: 'D' + k + ' · ' + (ex.shortDomains[k] || ex.domains[k]),
          total: ex.questions.filter(function (q) { return q.d === k; }).length
        };
      }),
      getQuestion: function (id) {
        var q = qById[id];
        return q && {
          text: stripTicks(q.q),
          options: q.o.map(stripTicks),
          correct: [].concat(q.a)
        };
      },
      locale: getLang(),
      texts: localizedTexts,
      fileName: 'progreso-' + ex.appId + '-' + new Date().toISOString().slice(0, 10) + '.json'
    });
  }

  /* ---------- Glosario ---------- */
  function showGlossary() {
    var ex = exam();
    var isEn = getLang() === 'en';
    var all = (ex.glossary || []).slice().sort(function (a, b) { return a.term.localeCompare(b.term, 'es'); });

    // Extraer categorías únicas con conteo
    var catCounts = {};
    all.forEach(function (g) {
      if (g.cat) {
        catCounts[g.cat] = (catCounts[g.cat] || 0) + 1;
      }
    });
    var cats = Object.keys(catCounts).sort(function (a, b) { return a.localeCompare(b, 'es'); });
    var activeCat = '';

    var catButtonsHtml = '<button type="button" class="cat-pill active" data-cat="">' + t('glossary_all', { n: all.length }, 'Todas (' + all.length + ')') + '</button>' +
      cats.map(function (c) {
        return '<button type="button" class="cat-pill" data-cat="' + esc(c) + '">' + esc(c) + ' (' + catCounts[c] + ')</button>';
      }).join('');

    var searchPlaceholder = t('glossary_search', { badge: esc(ex.badge) }, 'Buscar término o categoría en ' + esc(ex.badge) + '…');

    view.innerHTML = examBannerHtml(ex) +
      '<input id="gsearch" type="search" placeholder="' + esc(searchPlaceholder) + '">' +
      '<div class="glossary-cats">' + catButtonsHtml + '</div>' +
      '<div id="glist"></div>';

    var input = d.getElementById('gsearch');

    function paint() {
      var s = input ? input.value.trim().toLowerCase() : '';
      var listEl = d.getElementById('glist');
      var filtered = all.filter(function (g) {
        var matchesText = !s || (g.term + ' ' + (g.cat || '') + ' ' + g.def + ' ' + (g.tip || '')).toLowerCase().indexOf(s) !== -1;
        var matchesCat = !activeCat || g.cat === activeCat;
        return matchesText && matchesCat;
      });

      var html = filtered.map(function (g) {
        return '<div class="gitem" data-term="' + esc(g.term) + '"><b>' + fmt(g.term) + '</b>' +
          (g.cat ? ' <span class="muted small">· ' + esc(g.cat) + '</span>' : '') +
          '<p class="gdef">' + fmt(g.def) + '</p>' +
          (g.tip ? '<div class="gtip">💡 <b>' + t('glossary_tip', 'Tip:') + '</b> <span class="gtip-text">' + fmt(g.tip) + '</span></div>' : '') +
          '</div>';
      }).join('') || '<p class="muted">' + t('glossary_empty', 'Sin resultados.') + '</p>';

      if (listEl) {
        listEl.innerHTML = html;
      }
    }

    Array.prototype.forEach.call(view.querySelectorAll('.cat-pill'), function (btn) {
      btn.onclick = function () {
        activeCat = btn.getAttribute('data-cat') || '';
        Array.prototype.forEach.call(view.querySelectorAll('.cat-pill'), function (b) {
          b.classList.toggle('active', (b.getAttribute('data-cat') || '') === activeCat);
        });
        paint();
      };
    });

    if (input) input.oninput = paint;
    paint();

    // Traducción dinámica al español para términos y definiciones del glosario
    if (!isEn && w.ExamI18n && w.ExamI18n.translateBatch) {
      var defEls = view.querySelectorAll('.gitem .gdef');
      var defTexts = [];
      Array.prototype.forEach.call(defEls, function (el) {
        defTexts.push(el.textContent);
      });
      if (defTexts.length) {
        w.ExamI18n.translateBatch(defTexts, function (translated) {
          Array.prototype.forEach.call(defEls, function (el, idx) {
            if (translated && translated[idx]) {
              el.innerHTML = fmt(translated[idx]);
            }
          });
        });
      }
    }
  }

  /* ---------- Enrutador (Hash) y Pestañas ---------- */
  var TABS = {
    examenes: showHub,
    temas: showTopics,
    prueba: showSetup,
    progreso: showProgress,
    glosario: showGlossary
  };

  function navigate(examId, tab) {
    if (tab === 'examenes') {
      location.hash = 'examenes';
    } else {
      location.hash = (examId || currentExamId) + '/' + (tab || 'prueba');
    }
  }

  function syncFromHash() {
    var raw = (location.hash || '').replace(/^#/, '');
    var nextExam = currentExamId;
    var nextTab = 'examenes';

    if (!raw || raw === 'examenes') {
      nextTab = 'examenes';
    } else if (raw.indexOf('/') !== -1) {
      var parts = raw.split('/');
      if (w.EXAMS && w.EXAMS[parts[0]]) nextExam = parts[0];
      nextTab = TABS[parts[1]] ? parts[1] : 'prueba';
    } else if (w.EXAMS && w.EXAMS[raw]) {
      nextExam = raw;
      nextTab = 'prueba';
    } else if (TABS[raw]) {
      nextTab = raw;
    }

    endTest();
    if (progressView) { progressView.destroy(); progressView = null; }

    currentExamId = nextExam;
    currentTab = nextTab;
    if (picker) picker.value = currentExamId;
    d.body.setAttribute('data-provider', currentExamId);

    Array.prototype.forEach.call(d.querySelectorAll('#tabs button'), function (b) {
      b.classList.toggle('active', b.getAttribute('data-tab') === currentTab);
    });

    TABS[currentTab]();
    w.scrollTo(0, 0);
  }

  Array.prototype.forEach.call(d.querySelectorAll('#tabs button'), function (b) {
    b.onclick = function () {
      var tab = b.getAttribute('data-tab');
      navigate(currentExamId, tab);
    };
  });

  /* ---------- Integración con ExamCloudSync ---------- */
  function initCloudSync() {
    // Inicializar los 4 trackers para que estén registrados en memoria
    EXAM_ORDER.forEach(function (id) {
      if (w.EXAMS && w.EXAMS[id]) {
        getTracker(w.EXAMS[id].appId);
      }
    });

    var onSyncMerge = function () {
      if (currentTab === 'examenes') {
        showHub();
      } else if (currentTab === 'progreso') {
        showProgress();
      }
    };

    if (w.ExamCloudSync) {
      if (typeof w.ExamCloudSync.registerTrackers === 'function') {
        w.ExamCloudSync.registerTrackers(trackers, onSyncMerge);
      }
      if (typeof w.ExamCloudSync.init === 'function') {
        try {
          w.ExamCloudSync.init({
            trackers: trackers,
            onSyncMerge: onSyncMerge
          });
        } catch (e) {}
      }
    }

    var syncBtn = d.getElementById('cloud-sync-btn');
    if (syncBtn) {
      syncBtn.onclick = function () {
        if (w.ExamCloudSync && typeof w.ExamCloudSync.openModal === 'function') {
          w.ExamCloudSync.openModal();
        }
      };
    }
  }

  /* ---------- Inicialización General ---------- */
  initTheme();
  initLang();
  initPicker();
  initCloudSync();
  w.addEventListener('hashchange', syncFromHash);
  syncFromHash();

})(window, document);
