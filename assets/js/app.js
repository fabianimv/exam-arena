/* =========================================================================
   assets/js/app.js — Motor Multi-Provider (SRE, GCP, Azure, AWS)
   Basado en el flujo de corrección inmediata y por opción de gcp-ai-leader-quiz
   e integrado con @fabianimv/study-tracker.
   ========================================================================= */
(function (w, d) {
  'use strict';

  var EXAM_ORDER = ['sre-incidents', 'gcp-genai-leader', 'az-104', 'aws-saa-c03'];
  var LETTERS = 'ABCDEF';
  var view = d.getElementById('view');
  var picker = d.getElementById('exam-picker');

  var currentExamId = 'sre-incidents';
  var currentTab = 'examenes';

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

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function initPicker() {
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

  function examBannerHtml(ex) {
    return '<div class="exam-banner">' +
      '<div><span class="badge">' + ex.icon + ' ' + esc(ex.provider) + '</span>' +
      '<h1>' + esc(ex.title) + '</h1>' +
      '<p class="muted small">' + esc(ex.subtitle) + '</p></div>' +
      '</div>';
  }

  function domainKeys(ex) {
    return Object.keys(ex.domains).map(function (k) { return parseInt(k, 10); });
  }

  function domainSelect(ex, id, value) {
    return '<select id="' + id + '"><option value="0">Todos los dominios (' + ex.questions.length + ' preguntas)</option>' +
      domainKeys(ex).map(function (k) {
        var count = ex.questions.filter(function (q) { return q.d === k; }).length;
        return '<option value="' + k + '"' + (value === k ? ' selected' : '') + '>Dominio ' + k + ' · ' + esc(ex.domains[k]) + ' — ' + count + ' preg.</option>';
      }).join('') + '</select>';
  }

  /* ---------- Catálogo de Exámenes (Hub) ---------- */
  function showHub() {
    var totalQ = 0;
    var totalSeen = 0;
    var cards = EXAM_ORDER.filter(function (id) { return w.EXAMS && w.EXAMS[id]; }).map(function (id) {
      var ex = w.EXAMS[id];
      var tr = getTracker(ex.appId);
      var m = tr.mastery ? tr.mastery() : { seen: 0, mastery: null };
      var sessions = tr.getSessions ? tr.getSessions().length : 0;
      totalQ += ex.questions.length;
      totalSeen += (m.seen || 0);
      var masteryTxt = m.mastery != null ? m.mastery + ' %' : '—';
      var isCurrent = id === currentExamId;

      return '<div class="hub-card' + (isCurrent ? ' current' : '') + '">' +
        '<div>' +
          '<span class="badge">' + ex.icon + ' ' + esc(ex.provider) + '</span>' +
          '<h3>' + esc(ex.title) + '</h3>' +
          '<p class="muted small">' + esc(ex.subtitle) + '</p>' +
        '</div>' +
        '<div>' +
          '<div class="hub-stats">' +
            '<div class="hub-stat"><b>' + ex.questions.length + '</b><span>Preguntas (' + domainKeys(ex).length + ' dom.)</span></div>' +
            '<div class="hub-stat"><b>' + (m.seen || 0) + ' / ' + ex.questions.length + '</b><span>Vistas</span></div>' +
            '<div class="hub-stat"><b>' + masteryTxt + '</b><span>Dominio (' + sessions + ' ses.)</span></div>' +
          '</div>' +
          '<div class="hub-actions">' +
            '<button class="primary" data-go="' + esc(id) + '/prueba">Practicar prueba</button>' +
            '<button data-go="' + esc(id) + '/temas">Temas (' + ex.topics.length + ')</button>' +
            '<button data-go="' + esc(id) + '/progreso">Progreso</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    view.innerHTML =
      '<div class="card">' +
        '<h1>Simulador General de Exámenes e Incidentes SRE</h1>' +
        '<p class="muted" style="margin:.25rem 0 0">Elige un proveedor o certificación. Cada pregunta se corrige al instante explicando <b>por qué tu opción elegida es incorrecta</b> y <b>por qué la respuesta correcta es la adecuada</b>. Todo tu avance se guarda por separado en este navegador con <code>@fabianimv/study-tracker</code> (' + totalSeen + ' de ' + totalQ + ' preguntas practicadas en total).</p>' +
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
    var html = examBannerHtml(ex) +
      '<p class="muted">Lee el resumen de cada dominio y luego ponlo a prueba en la pestaña <b>Prueba</b>.</p>';
    domainKeys(ex).forEach(function (k) {
      var topics = ex.topics.filter(function (t) { return t.d === k && t.id.indexOf('t-5') !== 0; });
      if (topics.length) {
        html += '<h2>Dominio ' + k + ' · ' + esc(ex.domains[k]) + '</h2>' + topics.map(topicHtml).join('');
      }
    });
    var extra = ex.topics.filter(function (t) { return t.id.indexOf('t-5') === 0; });
    if (extra.length) html += '<h2>Extra</h2>' + extra.map(topicHtml).join('');
    view.innerHTML = html;
  }

  function topicHtml(t) {
    return '<details class="topic"><summary>' + esc(t.title) + '</summary><div class="body">' + t.html + '</div></details>';
  }

  /* ---------- Prueba ---------- */
  var SIZES = [10, 20, 30, 55];
  var T = { examId: null, domain: 0, size: 20, which: 'all', list: [], i: 0, ok: 0, results: [], session: null };
  var WHICH = {
    all: 'Todas las preguntas',
    'new': 'Solo las que nunca he respondido',
    failed: 'Solo las que fallé la última vez'
  };

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
    view.innerHTML =
      examBannerHtml(ex) +
      '<div class="card setup"><h2>Nueva prueba · ' + esc(ex.badge) + '</h2>' +
      '<p class="muted">Responde cada escenario. Al confirmar tu respuesta verás al instante si acertaste; si te equivocas, se mostrará por qué tu opción está mal y cuál es la opción correcta con su fundamento.</p>' +
      '<label>Dominio<br>' + domainSelect(ex, 'tdomain', T.domain) + '</label>' +
      '<label>Número de preguntas<br><select id="tsize">' +
        SIZES.map(function (n) { return '<option value="' + n + '"' + (T.size === n ? ' selected' : '') + '>' + n + '</option>'; }).join('') +
        '<option value="0"' + (T.size === 0 ? ' selected' : '') + '>Todas (' + pool + ')</option>' +
      '</select></label>' +
      '<label>Qué preguntas<br><select id="twhich">' +
        Object.keys(WHICH).map(function (k) { return '<option value="' + k + '"' + (T.which === k ? ' selected' : '') + '>' + WHICH[k] + '</option>'; }).join('') +
      '</select></label>' +
      '<p class="muted small">Hay <b>' + pool + '</b> preguntas disponibles en esta selección. Nota de aprobación de referencia: <b>' + (ex.passingScore || 70) + ' %</b>. Tus respuestas se guardan en tiempo real con <code>@fabianimv/study-tracker</code>.</p>' +
      '<button class="primary" id="tstart"' + (pool ? '' : ' disabled') + '>Comenzar prueba</button></div>';

    d.getElementById('tdomain').onchange = function () { T.domain = parseInt(this.value, 10); showSetup(); };
    d.getElementById('tsize').onchange = function () { T.size = parseInt(this.value, 10); };
    d.getElementById('twhich').onchange = function () { T.which = this.value; showSetup(); };
    d.getElementById('tstart').onclick = function () {
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

    view.innerHTML =
      '<div class="testbar"><span>' + ex.icon + ' <b>' + esc(ex.badge) + '</b> · Pregunta <b>' + (T.i + 1) + '</b> de ' + T.list.length + '</span>' +
      '<span>Correctas: <b id="tok">' + T.ok + '</b></span>' +
      '<button id="tquit" class="link">Terminar</button></div>' +
      '<div class="progress"><div style="width:' + pct + '%"></div></div>' +
      '<div class="card">' +
      '<div class="muted small">Dominio ' + q.d + ' · ' + esc(q.t) + '</div>' +
      '<p class="qtext">' + esc(q.q) + '</p>' +
      '<p class="muted small">' + (multi ? 'Elige ' + correct.length + ' respuestas.' : 'Elige una respuesta.') + '</p>' +
      '<div class="opts">' + order.map(function (idx, pos) {
        return '<button class="opt" data-i="' + idx + '"><span class="letter">' + LETTERS[pos] + '</span><span>' + esc(q.o[idx]) + '</span></button>';
      }).join('') + '</div>' +
      '<div id="feedback"><button class="primary" id="answer" disabled>Responder</button></div>' +
      '</div>';

    d.getElementById('tquit').onclick = showResults;
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
        answerBtn.disabled = picked.length !== correct.length;
      };
    });
    answerBtn.onclick = function () { reveal(ex, q, order, correct, picked); };
  }

  function reveal(ex, q, order, correct, picked) {
    var ok = picked.every(function (p) { return correct.indexOf(p) !== -1; });
    var why = (ex.why || {})[q.id] || [];
    var wrongPicked = picked.filter(function (p) { return correct.indexOf(p) === -1; });
    if (ok) T.ok++;
    T.results.push({ q: q, order: order, picked: picked, ok: ok });
    getTracker(ex.appId).recordAnswer(T.session, { question: q.id, topic: q.d, correct: ok, response: picked });

    view.querySelector('.opts').classList.add('locked');
    Array.prototype.forEach.call(view.querySelectorAll('.opt'), function (b) {
      var idx = parseInt(b.getAttribute('data-i'), 10);
      if (correct.indexOf(idx) !== -1) b.classList.add('right');
      else if (picked.indexOf(idx) !== -1) b.classList.add('wrong');
    });

    d.getElementById('feedback').innerHTML = feedbackHtml(q, order, correct, wrongPicked, why, ok) +
      '<button class="primary" id="next">' + (T.i + 1 < T.list.length ? 'Siguiente pregunta →' : 'Ver resultado') + '</button>';
    d.getElementById('tok').textContent = T.ok;
    d.getElementById('next').onclick = function () {
      T.i++;
      if (T.i < T.list.length) { showQuestion(); w.scrollTo(0, 0); } else showResults();
    };
  }

  function feedbackHtml(q, order, correct, wrongPicked, why, ok) {
    if (ok) {
      return '<div class="fb good"><div class="fb-title">✔ Correcto</div><p>' + esc(q.e) + '</p></div>';
    }
    return '<div class="fb bad"><div class="fb-title">✘ Incorrecto</div>' +
      wrongPicked.map(function (p) {
        return '<div class="fb-block"><div class="fb-label">Tu respuesta</div><p class="fb-opt">' + esc(optLabel(q, order, p)) + '</p>' +
          '<div class="fb-label">Por qué está mal</div><p>' + esc(why[p] || 'No es la opción que resuelve el escenario planteado.') + '</p></div>';
      }).join('') +
      '</div>' +
      '<div class="fb good"><div class="fb-label">Respuesta correcta</div>' +
      correct.slice().sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); }).map(function (c) {
        return '<p class="fb-opt">' + esc(optLabel(q, order, c)) + '</p>';
      }).join('') +
      '<div class="fb-label">Por qué</div><p>' + esc(q.e) + '</p></div>';
  }

  function showResults() {
    var ex = exam();
    endTest();
    var done = T.results.length;
    var pct = done ? Math.round(T.ok / done * 100) : 0;
    var pass = ex.passingScore || 70;
    var wrong = T.results.filter(function (r) { return !r.ok; });
    view.innerHTML =
      examBannerHtml(ex) +
      '<div class="card result"><h2>Resultado · ' + esc(ex.badge) + '</h2>' +
      '<div class="score ' + (pct >= pass ? 'good' : 'bad') + '">' + pct + ' %</div>' +
      '<p>' + T.ok + ' correctas de ' + done + ' respondidas (umbral de referencia: ' + pass + ' %).</p>' +
      (wrong.length ? '<button class="primary" id="retry">Repetir las ' + wrong.length + ' falladas</button> ' : '') +
      '<button id="newtest">Nueva prueba</button>' +
      '<p class="muted small">Resultado guardado en <code>' + esc(ex.appId) + '</code>. <a href="#' + esc(ex.id) + '/progreso">Ver tu progreso</a></p></div>' +
      (wrong.length ? '<h2>Repaso de lo que fallaste</h2>' + wrong.map(function (r) {
        var correct = [].concat(r.q.a);
        var why = (ex.why || {})[r.q.id] || [];
        return '<div class="card review"><div class="muted small">Dominio ' + r.q.d + ' · ' + esc(r.q.t) + '</div>' +
          '<p class="qtext">' + esc(r.q.q) + '</p>' +
          feedbackHtml(r.q, r.order, correct, r.picked.filter(function (p) { return correct.indexOf(p) === -1; }), why, false) +
          '</div>';
      }).join('') : '');
    var rt = d.getElementById('retry');
    if (rt) rt.onclick = function () { startTest(wrong.map(function (r) { return r.q; }), { retry: true }); };
    d.getElementById('newtest').onclick = showSetup;
    w.scrollTo(0, 0);
  }

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
        '<div class="card"><h2>Progreso no disponible</h2><p class="muted">No se pudo cargar <code>@fabianimv/study-tracker</code> desde el CDN. ' +
        'Revisa tu conexión a internet y recarga la página.</p></div>';
      return;
    }
    view.innerHTML = examBannerHtml(ex) + '<div id="st-mount"></div>';
    var mount = d.getElementById('st-mount');
    var qById = {};
    ex.questions.forEach(function (q) { qById[q.id] = q; });

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
        return q && { text: q.q, options: q.o, correct: [].concat(q.a) };
      },
      locale: 'es',
      texts: Object.assign({}, PROGRESS_TEXTS, { title: 'Progreso · ' + ex.badge }),
      fileName: 'progreso-' + ex.appId + '-' + new Date().toISOString().slice(0, 10) + '.json'
    });
  }

  /* ---------- Glosario ---------- */
  function showGlossary() {
    var ex = exam();
    view.innerHTML = examBannerHtml(ex) +
      '<input id="gsearch" type="search" placeholder="Buscar término o categoría en ' + esc(ex.badge) + '…"><div id="glist"></div>';
    var input = d.getElementById('gsearch');
    var all = (ex.glossary || []).slice().sort(function (a, b) { return a.term.localeCompare(b.term, 'es'); });
    function paint() {
      var s = input.value.trim().toLowerCase();
      d.getElementById('glist').innerHTML = all.filter(function (g) {
        return !s || (g.term + ' ' + (g.cat || '') + ' ' + g.def + ' ' + (g.tip || '')).toLowerCase().indexOf(s) !== -1;
      }).map(function (g) {
        return '<div class="gitem"><b>' + esc(g.term) + '</b>' +
          (g.cat ? ' <span class="muted small">· ' + esc(g.cat) + '</span>' : '') +
          '<p>' + esc(g.def) + '</p>' +
          (g.tip ? '<div class="gtip">💡 <b>Tip:</b> ' + esc(g.tip) + '</div>' : '') +
          '</div>';
      }).join('') || '<p class="muted">Sin resultados.</p>';
    }
    input.oninput = paint;
    paint();
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
    var raw = location.hash.slice(1);
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
    picker.value = currentExamId;

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

  initPicker();
  w.addEventListener('hashchange', syncFromHash);
  syncFromHash();
})(window, document);
