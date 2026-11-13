/* =========================================================================
   assets/js/i18n.js — Exam Arena · Módulo de Internacionalización (ES / EN)
   Formateo de texto, diccionario UI, detección/persistencia y traducción
   ========================================================================= */
(function (w, d) {
  'use strict';

  var STORAGE_LANG_KEY = 'exam-arena-lang';
  var CACHE_KEY = 'exam-arena-tr-en-v3';

  /* ---------- 1. Formateo y escape de texto ---------- */

  /**
   * Escapa caracteres HTML especiales (&, <, >, ", ').
   * @param {string} s
   * @returns {string}
   */
  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  var METRIC_REGEX = /\b((?:HTTP\s+)?[1-5]\d\d\s+(?:Bad Gateway|Gateway Timeout|Service Unavailable|Too Many Requests|Internal Server Error)|HTTP\s+[1-5]\d\d|p90|p95|p99(?:\.9)?|RTO|RPO|SLO|SLA|SLI|OOMKilled|CrashLoopBackOff|Pending|ImagePullBackOff|ErrImagePull)\b/g;

  /**
   * Resalta tokens técnicos y métricas fuera de tags HTML.
   * @param {string} text
   * @returns {string}
   */
  function highlightMetrics(text) {
    if (!text) return '';
    return text.replace(/(<[^>]+>)|([^<]+)/g, function (m, tag, textPart) {
      if (tag) return tag;
      return textPart.replace(METRIC_REGEX, '<span class="hl-metric">$1</span>');
    });
  }

  /**
   * Escapa HTML y convierte backticks `codigo` y negritas markdown **texto**
   * en <strong class="hl-term">$1</strong> sin mostrar las comillas invertidas.
   * Además, resalta automáticamente métricas y códigos de estado con <span class="hl-metric">.
   * @param {string} s
   * @returns {string}
   */
  function fmt(s) {
    if (s == null) return '';
    var out = esc(s);
    out = out.replace(/`([^`]+)`/g, '<strong class="hl-term">$1</strong>');
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong class="hl-term">$1</strong>');
    out = highlightMetrics(out);
    return out;
  }

  /**
   * Elimina comillas invertidas `codigo` y negritas **texto** dejando solo el texto plano.
   * Ideal para atributos, elementos <option> o textos para StudyTrackerView.
   * @param {string} s
   * @returns {string}
   */
  function stripTicks(s) {
    if (s == null) return '';
    return String(s)
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1');
  }

  /* ---------- 2. Detección y persistencia de idioma ---------- */

  /**
   * Obtiene el idioma activo ('es' o 'en').
   * Prioridad: localStorage > detección de navegador > 'es'.
   * @returns {'es'|'en'}
   */
  function getLang() {
    try {
      if (w.localStorage) {
        var saved = w.localStorage.getItem(STORAGE_LANG_KEY);
        if (saved === 'es' || saved === 'en') return saved;
      }
    } catch (e) {}

    try {
      var nav = w.navigator;
      if (nav) {
        var langs = nav.languages;
        if (langs && langs.length) {
          for (var i = 0; i < langs.length; i++) {
            var l = (langs[i] || '').toLowerCase();
            if (l.indexOf('en') === 0) return 'en';
            if (l.indexOf('es') === 0) return 'es';
          }
        }
        var single = (nav.language || nav.userLanguage || '').toLowerCase();
        if (single.indexOf('en') === 0) return 'en';
      }
    } catch (e) {}

    return 'es';
  }

  /**
   * Establece el idioma ('es' o 'en'), persiste en localStorage,
   * actualiza document.documentElement.lang y dispara el evento 'exam-arena-lang-change'.
   * @param {'es'|'en'} lang
   * @returns {'es'|'en'}
   */
  function setLang(lang) {
    var target = (lang === 'en') ? 'en' : 'es';
    try {
      if (w.localStorage) {
        w.localStorage.setItem(STORAGE_LANG_KEY, target);
      }
    } catch (e) {}

    if (d && d.documentElement) {
      d.documentElement.lang = target;
    }

    if (w && typeof w.dispatchEvent === 'function') {
      try {
        w.dispatchEvent(new CustomEvent('exam-arena-lang-change', { detail: { lang: target } }));
      } catch (err) {
        if (d && d.createEvent) {
          var evt = d.createEvent('CustomEvent');
          evt.initCustomEvent('exam-arena-lang-change', false, false, { lang: target });
          w.dispatchEvent(evt);
        }
      }
    }
    return target;
  }

  /**
   * Alterna entre 'es' y 'en'.
   * @returns {'es'|'en'}
   */
  function toggleLang() {
    return setLang(getLang() === 'es' ? 'en' : 'es');
  }

  /* ---------- 3. Diccionario de UI ---------- */

  var DICTIONARY = {
    es: {
      // Navegación
      tab_examenes: 'Exámenes',
      tab_temas: 'Temas',
      tab_prueba: 'Prueba',
      tab_progreso: 'Progreso',
      tab_glosario: 'Glosario',

      // Header y Sync
      theme_to_light: 'Cambiar a tema claro',
      theme_to_dark: 'Cambiar a tema oscuro',
      lang_toggle_title: 'Cambiar idioma (ES/EN)',
      sync_connect: 'Nube',
      sync_connected: 'Sincronizado',
      sync_syncing: 'Sincronizando…',

      // Hub (Catálogo)
      hub_title: 'Simulador General de Exámenes Cloud & SRE',
      hub_desc: 'Elige un proveedor o certificación. Cada pregunta se corrige al instante explicando <b>por qué tu opción elegida es incorrecta</b> y <b>por qué la respuesta correcta es la adecuada</b>. Todo tu avance se guarda localmente en este navegador con <code>@fabianimv/study-tracker</code> y puede sincronizarse en la nube.',
      kpi_total_q: 'Preguntas en 13 simuladores',
      featured_badge: '✨ Destacado · Nuevo',
      kpi_seen: 'Preguntas vistas',
      kpi_mastery: 'Dominio global estimado',
      kpi_sessions: 'Sesiones completadas',
      stat_questions: 'Preguntas ({n} dom.)',
      stat_seen: 'Vistas',
      stat_mastery: 'Dominio ({n} ses.)',
      btn_practice: 'Practicar prueba',
      btn_topics: 'Temas ({n})',
      btn_progress: 'Progreso',

      // Temas
      topics_intro: 'Lee el resumen de cada dominio y luego ponlo a prueba en la pestaña <b>Prueba</b>.',
      btn_expand_all: 'Expandir todos los temas',
      btn_collapse_all: 'Contraer todos los temas',
      domain_label: 'Dominio',
      extra_label: 'Extra',

      // Configuración de la Prueba (Setup)
      setup_title: 'Nueva prueba · {badge}',
      setup_desc: 'Responde cada escenario. Al confirmar tu respuesta verás al instante si acertaste; si te equivocas, se mostrará por qué tu opción está mal y cuál es la opción correcta con su fundamento.',
      label_domain: 'Dominio',
      all_domains: 'Todos los dominios ({n} preguntas)',
      domain_opt: 'Dominio {k} · {name} — {n} preg.',
      label_size: 'Número de preguntas',
      size_all: 'Todas ({n})',
      label_which: 'Qué preguntas',
      which_all: 'Todas las preguntas',
      which_new: 'Solo las que nunca he respondido',
      which_failed: 'Solo las que fallé la última vez',
      setup_meta: 'Hay <b>{pool}</b> preguntas disponibles en esta selección. Nota de aprobación de referencia: <b>{pass} %</b>. Tus respuestas se guardan en tiempo real con <code>@fabianimv/study-tracker</code>.',
      btn_start: 'Comenzar prueba',

      // Durante la Prueba
      q_of: 'Pregunta <b>{i}</b> de {n}',
      scenario_label: 'Escenario / Contexto',
      ask_label: 'Pregunta clave',
      correct_count: 'Correctas:',
      btn_quit: 'Terminar',
      pick_multi: 'Elige {n} respuestas.',
      pick_one: 'Elige una respuesta.',
      kb_hint: 'Atajos: teclas <kbd>A</kbd>–<kbd>D</kbd> o <kbd>1</kbd>–<kbd>4</kbd> para marcar · <kbd>Enter</kbd> para responder / avanzar',
      btn_answer: 'Responder',
      btn_next: 'Siguiente pregunta →',
      btn_see_result: 'Ver resultado',
      fb_correct: '✔ Correcto',
      fb_incorrect: '✘ Incorrecto',
      fb_your_answer: 'Tu respuesta',
      fb_why_wrong: 'Por qué está mal',
      fb_default_wrong: 'No es la opción que resuelve el escenario planteado.',
      fb_right_answer: 'Respuesta correcta',
      fb_why_right: 'Por qué',

      // Resultados
      res_title: 'Resultado · {badge}',
      res_summary: '{ok} correctas de {done} respondidas (umbral de referencia: {pass} %).',
      btn_retry_wrong: 'Repetir las {n} falladas',
      btn_new_test: 'Nueva prueba',
      res_saved: 'Resultado guardado en <code>{appId}</code>.',
      res_view_progress: 'Ver tu progreso',
      res_review_title: 'Repaso de lo que fallaste',

      // Glosario
      glossary_search: 'Buscar término o categoría en {badge}…',
      glossary_all: 'Todas ({n})',
      glossary_empty: 'Sin resultados.',
      glossary_tip: 'Tip:',

      // Auxiliares y footer
      footer_text: 'Simulador de estudio y entrenamiento de incidentes SRE · Código en <a href="https://github.com/fabianimv/exam-arena" target="_blank" rel="noopener">GitHub</a> · Progreso impulsado por <a href="https://github.com/fabianimv/study-tracker" target="_blank" rel="noopener">@fabianimv/study-tracker</a>.',
      progress_not_available: 'Progreso no disponible',
      progress_not_available_desc: 'No se pudo cargar <code>@fabianimv/study-tracker</code> desde el CDN. Revisa tu conexión a internet y recarga la página.'
    },

    en: {
      // Navigation
      tab_examenes: 'Exams',
      tab_temas: 'Topics',
      tab_prueba: 'Quiz',
      tab_progreso: 'Progress',
      tab_glosario: 'Glossary',

      // Header & Sync
      theme_to_light: 'Switch to light theme',
      theme_to_dark: 'Switch to dark theme',
      lang_toggle_title: 'Switch language (ES/EN)',
      sync_connect: 'Cloud Sync',
      sync_connected: 'Synced',
      sync_syncing: 'Syncing…',

      // Hub (Catalog)
      hub_title: 'Cloud & SRE Multi-Provider Exam Simulator',
      hub_desc: 'Choose a provider or certification. Each question is graded instantly explaining <b>why your chosen option is incorrect</b> and <b>why the correct answer is appropriate</b>. All your progress is stored locally in this browser with <code>@fabianimv/study-tracker</code> and can be synced to the cloud.',
      kpi_total_q: 'Questions in 13 simulators',
      featured_badge: '✨ Featured · New',
      kpi_seen: 'Questions seen',
      kpi_mastery: 'Estimated global mastery',
      kpi_sessions: 'Completed sessions',
      stat_questions: 'Questions ({n} dom.)',
      stat_seen: 'Seen',
      stat_mastery: 'Mastery ({n} sess.)',
      btn_practice: 'Practice quiz',
      btn_topics: 'Topics ({n})',
      btn_progress: 'Progress',

      // Topics
      topics_intro: 'Read each domain summary and test your knowledge in the <b>Quiz</b> tab.',
      btn_expand_all: 'Expand all topics',
      btn_collapse_all: 'Collapse all topics',
      domain_label: 'Domain',
      extra_label: 'Extra',

      // Quiz Setup
      setup_title: 'New Quiz · {badge}',
      setup_desc: 'Answer each scenario. Upon submitting your answer you will immediately see whether you were correct; if you missed, it shows why your option is incorrect and which option is correct with its rationale.',
      label_domain: 'Domain',
      all_domains: 'All domains ({n} questions)',
      domain_opt: 'Domain {k} · {name} — {n} q.',
      label_size: 'Number of questions',
      size_all: 'All ({n})',
      label_which: 'Question filter',
      which_all: 'All questions',
      which_new: 'Only unanswered questions',
      which_failed: 'Only previously missed questions',
      setup_meta: 'There are <b>{pool}</b> questions available in this selection. Reference passing score: <b>{pass}%</b>. Your answers are saved in real time with <code>@fabianimv/study-tracker</code>.',
      btn_start: 'Start quiz',

      // During Quiz
      q_of: 'Question <b>{i}</b> of {n}',
      scenario_label: 'Scenario Context',
      ask_label: 'Key Question',
      correct_count: 'Correct:',
      btn_quit: 'Finish',
      pick_multi: 'Choose {n} answers.',
      pick_one: 'Choose one answer.',
      kb_hint: 'Shortcuts: keys <kbd>A</kbd>–<kbd>D</kbd> or <kbd>1</kbd>–<kbd>4</kbd> to select · <kbd>Enter</kbd> to submit / continue',
      btn_answer: 'Submit answer',
      btn_next: 'Next question →',
      btn_see_result: 'See results',
      fb_correct: '✔ Correct',
      fb_incorrect: '✘ Incorrect',
      fb_your_answer: 'Your answer',
      fb_why_wrong: 'Why it is incorrect',
      fb_default_wrong: 'This option does not resolve the scenario described.',
      fb_right_answer: 'Correct answer',
      fb_why_right: 'Why it is correct',

      // Results
      res_title: 'Results · {badge}',
      res_summary: '{ok} correct out of {done} answered (reference threshold: {pass}%).',
      btn_retry_wrong: 'Retry {n} missed questions',
      btn_new_test: 'New quiz',
      res_saved: 'Result saved in <code>{appId}</code>.',
      res_view_progress: 'View your progress',
      res_review_title: 'Review missed questions',

      // Glossary
      glossary_search: 'Search term or category in {badge}…',
      glossary_all: 'All ({n})',
      glossary_empty: 'No results found.',
      glossary_tip: 'Tip:',

      // Auxiliaries & Footer
      footer_text: 'Study simulator and SRE incident training · Code on <a href="https://github.com/fabianimv/exam-arena" target="_blank" rel="noopener">GitHub</a> · Progress powered by <a href="https://github.com/fabianimv/study-tracker" target="_blank" rel="noopener">@fabianimv/study-tracker</a>.',
      progress_not_available: 'Progress not available',
      progress_not_available_desc: 'Could not load <code>@fabianimv/study-tracker</code> from CDN. Check your internet connection and reload the page.'
    }
  };

  /**
   * Obtiene la traducción de una clave de UI con interpolación de variables.
   * @param {string} key
   * @param {Object} [vars]
   * @param {'es'|'en'} [langOverride]
   * @returns {string}
   */
  function t(key, vars, langOverride) {
    var lang = langOverride || getLang();
    var dict = DICTIONARY[lang] || DICTIONARY.es;
    var str = dict[key];
    if (str === undefined && DICTIONARY.es) {
      str = DICTIONARY.es[key];
    }
    if (str === undefined) {
      str = key;
    }
    if (vars && typeof vars === 'object') {
      return str.replace(/\{([a-zA-Z0-9_]+)\}/g, function (match, name) {
        return (name in vars && vars[name] != null) ? vars[name] : match;
      });
    }
    return str;
  }

  /**
   * Genera el diccionario completo de textos para StudyTrackerView en el idioma actual o indicado.
   * @param {string} [badge]
   * @param {'es'|'en'} [langOverride]
   * @returns {Object}
   */
  function progressTexts(badge, langOverride) {
    var lang = langOverride || getLang();
    if (lang === 'en') {
      return {
        title: badge ? ('Progress · ' + badge) : 'Your progress',
        week: 'Week', month: 'Month',
        thisWeek: 'this week', thisMonth: 'this month',
        prevWeek: 'previous week', prevMonth: 'previous month',
        empty: 'No saved answers for this exam yet. Take a quiz and your progress will appear here.',
        notPersistent: 'This browser does not allow saving data (e.g. private browsing mode). Your progress will be lost when closing the page.',
        mastery: 'Estimated mastery',
        masteryHelp: 'Of the questions you have seen on this exam, what percentage you got right the last time you answered them.',
        accuracy: 'Accuracy',
        seen: 'Questions seen',
        answered: 'Answered',
        noChange: 'no change',
        noPrev: 'no previous data',
        byTopic: 'By domain',
        topic: 'Domain', change: 'Change', seenShort: 'Seen',
        trend: 'Accuracy by', overall: 'Overall',
        history: 'Quiz history',
        completed: 'Completed', stopped: 'Finished early', open: 'Open',
        of: 'of', answeredOf: 'answered',
        yourAnswer: 'Your answer', correctAnswer: 'Correct',
        data: 'Your data',
        dataHelp: 'All data is stored locally in this browser per provider/exam. Export a JSON backup to save or transfer to another device.',
        exportBtn: 'Export backup', importBtn: 'Import backup', clearBtn: 'Clear all',
        confirmClear: 'Clear all history for this exam? This cannot be undone.',
        imported: 'Imported {n} new answers.',
        importError: 'Could not import: ',
        pts: 'pts', points: 'answers', weekOf: 'Week of', inProgress: 'in progress',
        liveNote: 'Hollow dot indicates current period in progress: it may still change.'
      };
    }

    return {
      title: badge ? ('Progreso · ' + badge) : 'Tu progreso',
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
  }

  /* ---------- 4. Traducción Dinámica con Caché (ES -> EN) ---------- */

  var memCache = {};
  var cacheLoaded = false;

  function loadCache() {
    if (cacheLoaded) return;
    try {
      if (w.localStorage) {
        var raw = w.localStorage.getItem(CACHE_KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            memCache = parsed;
          }
        }
      }
    } catch (e) {}
    cacheLoaded = true;
  }

  function saveCache() {
    try {
      if (w.localStorage) {
        w.localStorage.setItem(CACHE_KEY, JSON.stringify(memCache));
      }
    } catch (e) {}
  }

  function clearCache() {
    memCache = {};
    try {
      if (w.localStorage) {
        w.localStorage.removeItem(CACHE_KEY);
      }
    } catch (e) {}
  }

  /**
   * Devuelve la traducción en caché si existe, o el string original.
   * @param {string} str
   * @returns {string}
   */
  function getCachedTranslation(str) {
    if (typeof str !== 'string' || !str) return str;
    loadCache();
    if (memCache && typeof memCache[str] === 'string') {
      return memCache[str];
    }
    return str;
  }

  /**
   * Realiza una petición GET segura compatible con fetch y XMLHttpRequest.
   */
  function httpGet(url, done) {
    if (typeof fetch === 'function') {
      fetch(url)
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function (data) { done(null, data); })
        .catch(function (err) { done(err); });
    } else if (typeof XMLHttpRequest !== 'undefined') {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                var json = JSON.parse(xhr.responseText);
                done(null, json);
              } catch (e) {
                done(e);
              }
            } else {
              done(new Error('HTTP ' + xhr.status));
            }
          }
        };
        xhr.onerror = function (e) { done(e || new Error('Network error')); };
        xhr.send();
      } catch (err) {
        done(err);
      }
    } else {
      done(new Error('No HTTP transport available'));
    }
  }

  /**
   * Extrae el texto traducido completo desde la respuesta de Google Translate GTX.
   */
  function extractTranslation(data) {
    if (!Array.isArray(data) || !Array.isArray(data[0])) return null;
    var out = '';
    for (var i = 0; i < data[0].length; i++) {
      if (data[0][i] && typeof data[0][i][0] === 'string') {
        out += data[0][i][0];
      }
    }
    return out;
  }

  /**
   * Traduce un lote de cadenas al inglés con caché local.
   * Si todos los textos están en caché, llama al callback de forma síncrona.
   * Si la red falla, devuelve los textos originales sin arrojar errores.
   * @param {string[]} stringsArray
   * @param {function(string[]): void} callback
   */
  function translateBatch(stringsArray, callback) {
    if (!Array.isArray(stringsArray)) {
      stringsArray = stringsArray != null ? [String(stringsArray)] : [];
    }

    if (stringsArray.length === 0 || getLang() !== 'en') {
      var copy = stringsArray.slice();
      if (typeof callback === 'function') callback(copy);
      return copy;
    }

    loadCache();

    var missing = [];
    var missingSet = {};
    for (var i = 0; i < stringsArray.length; i++) {
      var s = stringsArray[i];
      if (typeof s === 'string' && s.trim().length > 0 && memCache[s] === undefined) {
        if (!missingSet[s]) {
          missingSet[s] = true;
          missing.push(s);
        }
      }
    }

    // Si todo está en caché, responder sincrónicamente
    if (missing.length === 0) {
      var cachedRes = stringsArray.map(function (str) {
        return (typeof str === 'string' && memCache[str] !== undefined) ? memCache[str] : str;
      });
      if (typeof callback === 'function') callback(cachedRes);
      return cachedRes;
    }

    // Dividir en bloques de hasta ~3200 caracteres codificados
    var DELIM = '\n ||| \n';
    var chunks = [];
    var curChunk = [];
    var curLen = 0;

    for (var m = 0; m < missing.length; m++) {
      var item = missing[m];
      var encLen = encodeURIComponent(item).length + DELIM.length;
      if (curChunk.length > 0 && (curLen + encLen > 3200)) {
        chunks.push(curChunk);
        curChunk = [item];
        curLen = encLen;
      } else {
        curChunk.push(item);
        curLen += encLen;
      }
    }
    if (curChunk.length > 0) chunks.push(curChunk);

    var pending = chunks.length;

    function finish() {
      saveCache();
      var finalMapped = stringsArray.map(function (str) {
        return (typeof str === 'string' && memCache[str] !== undefined) ? memCache[str] : str;
      });
      if (typeof callback === 'function') callback(finalMapped);
    }

    function processChunk(chunk) {
      var query = chunk.join(DELIM);
      var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q=' + encodeURIComponent(query);

      httpGet(url, function (err, data) {
        if (!err && data) {
          var translated = extractTranslation(data);
          if (typeof translated === 'string') {
            if (chunk.length === 1) {
              memCache[chunk[0]] = translated.trim();
            } else {
              var parts = translated.split(/\s*\|\|\|\s*/);
              if (parts.length === chunk.length) {
                for (var p = 0; p < chunk.length; p++) {
                  memCache[chunk[p]] = parts[p].trim();
                }
              } else {
                var altParts = translated.split(/[\r\n]+\s*\|\|\|\s*[\r\n]+/);
                if (altParts.length === chunk.length) {
                  for (var a = 0; a < chunk.length; a++) {
                    memCache[chunk[a]] = altParts[a].trim();
                  }
                } else {
                  // Respaldo sin romper
                  for (var f = 0; f < chunk.length; f++) {
                    if (!memCache[chunk[f]]) {
                      memCache[chunk[f]] = chunk[f];
                    }
                  }
                }
              }
            }
          }
        }
        pending--;
        if (pending === 0) finish();
      });
    }

    for (var c = 0; c < chunks.length; c++) {
      processChunk(chunks[c]);
    }
  }

  /**
   * Traduce un único texto al inglés si getLang() === 'en'.
   * @param {string} str
   * @param {function(string): void} [callback]
   * @returns {string} (devuelve el texto original o traducción en caché si está disponible de inmediato)
   */
  function translateText(str, callback) {
    if (typeof str !== 'string' || !str.trim() || getLang() !== 'en') {
      if (typeof callback === 'function') callback(str);
      return str;
    }
    loadCache();
    if (memCache[str] !== undefined) {
      if (typeof callback === 'function') callback(memCache[str]);
      return memCache[str];
    }
    translateBatch([str], function (res) {
      if (typeof callback === 'function') callback(res && res[0] != null ? res[0] : str);
    });
    return str;
  }

  /**
   * Traduce un objeto de pregunta y su lista asociada de 'why' (explicaciones por error).
   * @param {Object} q
   * @param {string[]|function} [whyArrayOrCb]
   * @param {function(Object, string[]): void} [cb]
   */
  function translateQuestion(q, whyArrayOrCb, cb) {
    var whyArray = whyArrayOrCb;
    var callback = cb;
    if (typeof whyArrayOrCb === 'function') {
      callback = whyArrayOrCb;
      whyArray = null;
    }

    if (!q || getLang() !== 'en') {
      if (typeof callback === 'function') callback(q, whyArray);
      return;
    }

    var list = [];
    function add(val) {
      if (typeof val === 'string' && val.length > 0) {
        list.push(val);
        return list.length - 1;
      }
      return -1;
    }

    var tIdx = add(q.t);
    var qIdx = add(q.q);
    var oIndices = (q.o || []).map(function (opt) { return add(opt); });
    var eIdx = add(q.e);
    var whyIndices = (whyArray || []).map(function (wItem) { return add(wItem); });

    translateBatch(list, function (translated) {
      var cloneQ = Object.assign({}, q);
      if (tIdx !== -1) cloneQ.t = translated[tIdx];
      if (qIdx !== -1) cloneQ.q = translated[qIdx];
      if (q.o) {
        cloneQ.o = oIndices.map(function (idx, i) {
          return idx !== -1 ? translated[idx] : q.o[i];
        });
      }
      if (eIdx !== -1) cloneQ.e = translated[eIdx];

      var cloneWhy = whyArray ? whyIndices.map(function (idx, i) {
        return idx !== -1 ? translated[idx] : whyArray[i];
      }) : null;

      if (typeof callback === 'function') {
        callback(cloneQ, cloneWhy);
      }
    });
  }

  /* ---------- Inicialización en el DOM ---------- */
  if (d && d.documentElement) {
    try {
      d.documentElement.lang = getLang();
    } catch (e) {}
  }

  /* ---------- Exportar API ---------- */
  var ExamI18n = {
    esc: esc,
    fmt: fmt,
    stripTicks: stripTicks,
    getLang: getLang,
    setLang: setLang,
    toggleLang: toggleLang,
    t: t,
    progressTexts: progressTexts,
    translateBatch: translateBatch,
    translateText: translateText,
    translateQuestion: translateQuestion,
    getCachedTranslation: getCachedTranslation,
    clearCache: clearCache,
    DICTIONARY: DICTIONARY
  };

  w.ExamI18n = ExamI18n;

})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : null);
