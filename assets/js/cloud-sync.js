/* =============================================================================
   Cloud & SRE Exam Arena · assets/js/cloud-sync.js
   Persistencia en la nube (Supabase REST / RPC) e idempotencia por email
   Compatible con @fabianimv/study-tracker (SRE, GCP, Azure, AWS).
   ============================================================================= */

(function (window, document) {
  'use strict';

  /* ---------- 1. Configuración por defecto ---------- */
  // Si se configuran aquí, aplican automáticamente como respaldo cuando localStorage esté vacío.
  var DEFAULT_SUPABASE_URL = 'https://cvzcjrhxifecieeefdpq.supabase.co';
  var DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2emNqcmh4aWZlY2llZWVmZHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTUzNDYsImV4cCI6MjEwMDQ5MTM0Nn0.05a_l0G6rx-YbxZElo80k16lYb1YW2L0z7ZngpB1W78';

  var EXAM_IDS = [
    'claude-architect',
    'claude-developer',
    'claude-associate',
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

  // Claves en localStorage
  var STORAGE_KEYS = {
    EMAIL: 'exam-arena-user-email',
    URL: 'exam-arena-supabase-url',
    KEY: 'exam-arena-supabase-key',
    LAST_SYNC: 'exam-arena-last-sync'
  };

  /* ---------- 2. Script SQL embebido para copiar en 1 clic ---------- */
  var SUPABASE_SCHEMA_SQL = [
    '-- =============================================================================',
    '-- Cloud & SRE Exam Arena · Supabase Schema & Idempotent Cloud Sync',
    '-- Ejecuta este script en el SQL Editor de tu proyecto en https://supabase.com',
    '-- =============================================================================',
    '',
    'create table if not exists public.exam_arena_progress (',
    '  email text primary key check (char_length(trim(email)) >= 3),',
    '  data jsonb not null default \'{}\'::jsonb,',
    '  updated_at timestamptz not null default now()',
    ');',
    '',
    'alter table public.exam_arena_progress enable row level security;',
    '',
    'drop policy if exists "Allow public select on exam_arena_progress" on public.exam_arena_progress;',
    'drop policy if exists "Allow public insert on exam_arena_progress" on public.exam_arena_progress;',
    'drop policy if exists "Allow public update on exam_arena_progress" on public.exam_arena_progress;',
    'drop policy if exists "Allow public delete on exam_arena_progress" on public.exam_arena_progress;',
    '',
    'create policy "Allow public select on exam_arena_progress" on public.exam_arena_progress for select to anon, authenticated using (true);',
    'create policy "Allow public insert on exam_arena_progress" on public.exam_arena_progress for insert to anon, authenticated with check (true);',
    'create policy "Allow public update on exam_arena_progress" on public.exam_arena_progress for update to anon, authenticated using (true) with check (true);',
    'create policy "Allow public delete on exam_arena_progress" on public.exam_arena_progress for delete to anon, authenticated using (true);',
    '',
    'grant select, insert, update, delete on table public.exam_arena_progress to anon, authenticated;',
    '',
    'create or replace function public.sync_exam_progress(p_email text, p_client_data jsonb)',
    'returns jsonb',
    'language plpgsql',
    'security definer',
    'set search_path = public',
    'as $$',
    'declare',
    '  v_email text;',
    '  v_server_data jsonb;',
    '  v_app_keys text[];',
    '  app_id text;',
    '  v_srv_app jsonb;',
    '  v_cli_app jsonb;',
    '  v_merged_sessions jsonb;',
    '  v_merged_answers jsonb;',
    '  v_app_obj jsonb;',
    '  v_merged jsonb := \'{}\'::jsonb;',
    'begin',
    '  v_email := lower(trim(p_email));',
    '  if v_email is null or char_length(v_email) < 3 then',
    '    raise exception \'exam_arena: Dirección de correo inválida ("%")\', p_email;',
    '  end if;',
    '',
    '  if p_client_data is null or jsonb_typeof(p_client_data) <> \'object\' then',
    '    p_client_data := \'{}\'::jsonb;',
    '  end if;',
    '',
    '  select data into v_server_data',
    '  from public.exam_arena_progress',
    '  where email = v_email',
    '  for update;',
    '',
    '  if not found or v_server_data is null then',
    '    v_server_data := \'{}\'::jsonb;',
    '  end if;',
    '',
    '  select coalesce(array_agg(distinct k), array[]::text[])',
    '  into v_app_keys',
    '  from (',
    '    select jsonb_object_keys(v_server_data) as k',
    '    union',
    '    select jsonb_object_keys(p_client_data) as k',
    '  ) t;',
    '',
    '  if array_length(v_app_keys, 1) is not null then',
    '    foreach app_id in array v_app_keys loop',
    '      v_srv_app := coalesce(v_server_data->app_id, \'{}\'::jsonb);',
    '      v_cli_app := coalesce(p_client_data->app_id, \'{}\'::jsonb);',
    '',
    '      with all_sessions as (',
    '        select s from jsonb_array_elements(case when jsonb_typeof(v_srv_app->\'sessions\') = \'array\' then v_srv_app->\'sessions\' else \'[]\'::jsonb end) s',
    '        union all',
    '        select s from jsonb_array_elements(case when jsonb_typeof(v_cli_app->\'sessions\') = \'array\' then v_cli_app->\'sessions\' else \'[]\'::jsonb end) s',
    '      ),',
    '      ranked_sessions as (',
    '        select s,',
    '               row_number() over (',
    '                 partition by (s->>\'id\')',
    '                 order by',
    '                   case when s->>\'endedAt\' is not null and s->>\'endedAt\' <> \'null\' then 1 else 0 end desc,',
    '                   coalesce((s->>\'endedAt\')::numeric, 0) desc,',
    '                   coalesce((s->>\'startedAt\')::numeric, 0) desc',
    '               ) as rn',
    '        from all_sessions',
    '        where (s->>\'id\') is not null',
    '      )',
    '      select coalesce(jsonb_agg(s order by coalesce((s->>\'startedAt\')::numeric, 0) asc), \'[]\'::jsonb)',
    '      into v_merged_sessions',
    '      from ranked_sessions',
    '      where rn = 1;',
    '',
    '      with all_answers as (',
    '        select a from jsonb_array_elements(case when jsonb_typeof(v_srv_app->\'answers\') = \'array\' then v_srv_app->\'answers\' else \'[]\'::jsonb end) a',
    '        union all',
    '        select a from jsonb_array_elements(case when jsonb_typeof(v_cli_app->\'answers\') = \'array\' then v_cli_app->\'answers\' else \'[]\'::jsonb end) a',
    '      ),',
    '      ranked_answers as (',
    '        select a,',
    '               row_number() over (',
    '                 partition by coalesce(a->>\'session\', \'\') || \'|\' || coalesce(a->>\'question\', \'\') || \'|\' || coalesce(a->>\'at\', \'\')',
    '               ) as rn',
    '        from all_answers',
    '        where (a->>\'question\') is not null',
    '      )',
    '      select coalesce(jsonb_agg(a order by coalesce((a->>\'at\')::numeric, 0) asc), \'[]\'::jsonb)',
    '      into v_merged_answers',
    '      from ranked_answers',
    '      where rn = 1;',
    '',
    '      v_app_obj := jsonb_build_object(',
    '        \'schema\', coalesce((v_cli_app->>\'schema\')::int, (v_srv_app->>\'schema\')::int, 1),',
    '        \'appId\', coalesce(v_cli_app->>\'appId\', v_srv_app->>\'appId\', app_id),',
    '        \'sessions\', coalesce(v_merged_sessions, \'[]\'::jsonb),',
    '        \'answers\', coalesce(v_merged_answers, \'[]\'::jsonb)',
    '      );',
    '',
    '      v_merged := jsonb_set(v_merged, array[app_id], v_app_obj, true);',
    '    end loop;',
    '  end if;',
    '',
    '  insert into public.exam_arena_progress (email, data, updated_at)',
    '  values (v_email, v_merged, now())',
    '  on conflict (email) do update',
    '  set data = excluded.data,',
    '      updated_at = now();',
    '',
    '  return v_merged;',
    'end;',
    '$$;',
    '',
    'grant execute on function public.sync_exam_progress(text, jsonb) to anon, authenticated;'
  ].join('\n');

  /* ---------- 3. Estado interno ---------- */
  var registeredTrackers = {};
  var onRemoteDataMergedCallback = null;
  var currentStatus = 'unconfigured'; // 'unconfigured' | 'idle' | 'syncing' | 'synced' | 'error' | 'table_missing'
  var lastErrorMessage = '';
  var suppressAutoSync = false;
  var syncDebounceTimer = null;
  var isSyncInProgress = false;

  /* ---------- 4. Getters y Setters de credenciales ---------- */
  function normalizeEmail(email) {
    if (!email || typeof email !== 'string') return '';
    return email.trim().toLowerCase();
  }

  function getEmail() {
    try {
      return normalizeEmail(localStorage.getItem(STORAGE_KEYS.EMAIL) || '');
    } catch (e) {
      return '';
    }
  }

  function setEmail(email) {
    var clean = normalizeEmail(email);
    try {
      if (clean) {
        localStorage.setItem(STORAGE_KEYS.EMAIL, clean);
      } else {
        localStorage.removeItem(STORAGE_KEYS.EMAIL);
      }
    } catch (e) {}
    updateSyncButtonUI();
    return clean;
  }

  function getUrl() {
    var url = '';
    try {
      url = localStorage.getItem(STORAGE_KEYS.URL) || DEFAULT_SUPABASE_URL || '';
    } catch (e) {
      url = DEFAULT_SUPABASE_URL || '';
    }
    return String(url).trim().replace(/\/+$/, '');
  }

  function setUrl(url) {
    var clean = String(url || '').trim().replace(/\/+$/, '');
    try {
      if (clean) {
        localStorage.setItem(STORAGE_KEYS.URL, clean);
      } else {
        localStorage.removeItem(STORAGE_KEYS.URL);
      }
    } catch (e) {}
    return clean;
  }

  function getKey() {
    var key = '';
    try {
      key = localStorage.getItem(STORAGE_KEYS.KEY) || DEFAULT_SUPABASE_ANON_KEY || '';
    } catch (e) {
      key = DEFAULT_SUPABASE_ANON_KEY || '';
    }
    return String(key).trim();
  }

  function setKey(key) {
    var clean = String(key || '').trim();
    try {
      if (clean) {
        localStorage.setItem(STORAGE_KEYS.KEY, clean);
      } else {
        localStorage.removeItem(STORAGE_KEYS.KEY);
      }
    } catch (e) {}
    return clean;
  }

  function getLastSync() {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || null;
    } catch (e) {
      return null;
    }
  }

  function setLastSync(isoString) {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, isoString || new Date().toISOString());
    } catch (e) {}
  }

  function isConfigured() {
    return !!(getEmail() && getUrl() && getKey());
  }

  function disconnect() {
    try {
      localStorage.removeItem(STORAGE_KEYS.EMAIL);
      localStorage.removeItem(STORAGE_KEYS.URL);
      localStorage.removeItem(STORAGE_KEYS.KEY);
      localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
    } catch (e) {}
    currentStatus = 'unconfigured';
    lastErrorMessage = '';
    updateSyncButtonUI();
  }

  /* ---------- 5. Interceptación y Registro de StudyTrackers ---------- */
  function attachTrackerListener(appId, tracker) {
    if (!tracker || typeof tracker.onChange !== 'function') return;
    if (tracker.__examCloudSyncListening) return;
    tracker.__examCloudSyncListening = true;

    tracker.onChange(function () {
      if (suppressAutoSync) return;
      if (!isConfigured()) return;
      scheduleDebouncedSync(1200);
    });
  }

  function getTracker(appId) {
    if (registeredTrackers[appId]) return registeredTrackers[appId];
    if (window.StudyTracker && typeof window.StudyTracker.create === 'function') {
      var tr = window.StudyTracker.create({ appId: appId });
      registeredTrackers[appId] = tr;
      attachTrackerListener(appId, tr);
      return tr;
    }
    return null;
  }

  // Interceptar window.StudyTracker.create para registrar automáticamente instancias de app.js
  (function hookStudyTrackerCreate() {
    if (window.StudyTracker && typeof window.StudyTracker.create === 'function') {
      var origCreate = window.StudyTracker.create;
      if (!origCreate.__examCloudHooked) {
        window.StudyTracker.create = function (opts) {
          var tr = origCreate.apply(this, arguments);
          if (opts && opts.appId) {
            registeredTrackers[opts.appId] = tr;
            attachTrackerListener(opts.appId, tr);
          }
          return tr;
        };
        window.StudyTracker.create.__examCloudHooked = true;
      }
    }
  })();

  function registerTrackers(trackersMap, onRemoteDataMerged) {
    if (trackersMap && typeof trackersMap === 'object') {
      Object.keys(trackersMap).forEach(function (appId) {
        registeredTrackers[appId] = trackersMap[appId];
        attachTrackerListener(appId, trackersMap[appId]);
      });
    }
    if (typeof onRemoteDataMerged === 'function') {
      onRemoteDataMergedCallback = onRemoteDataMerged;
    }
  }

  /* ---------- 6. Estadísticas consolidadas ---------- */
  function getSyncStats() {
    var totalAnswers = 0;
    var totalSessions = 0;
    var breakdown = {};

    EXAM_IDS.forEach(function (appId) {
      var answersCount = 0;
      var sessionsCount = 0;
      var tr = registeredTrackers[appId];
      if (tr && typeof tr.exportData === 'function') {
        var d = tr.exportData();
        answersCount = (d && d.answers) ? d.answers.length : 0;
        sessionsCount = (d && d.sessions) ? d.sessions.length : 0;
      } else {
        try {
          var raw = localStorage.getItem('study-tracker:' + appId);
          if (raw) {
            var parsed = JSON.parse(raw);
            answersCount = (parsed && parsed.answers) ? parsed.answers.length : 0;
            sessionsCount = (parsed && parsed.sessions) ? parsed.sessions.length : 0;
          }
        } catch (e) {}
      }
      totalAnswers += answersCount;
      totalSessions += sessionsCount;
      breakdown[appId] = { answers: answersCount, sessions: sessionsCount };
    });

    return {
      totalAnswers: totalAnswers,
      totalSessions: totalSessions,
      breakdown: breakdown,
      lastSync: getLastSync()
    };
  }

  /* ---------- 7. Algoritmo de Fusión Idempotente en Cliente ---------- */
  /**
   * mergeAppData(localData, remoteData, appId)
   *
   * Idempotencia garantizada:
   * 1. sessions: se unifican por 'id'. Si la versión remota ya terminó (endedAt != null)
   *    y la local sigue abierta (endedAt == null), actualiza el localStorage de study-tracker:<appId>
   *    para cerrar la sesión también en este dispositivo.
   * 2. answers: delega a tracker.importData(remote, 'merge') que en @fabianimv/study-tracker
   *    deduplica exactamente por `session + '|' + question + '|' + at`.
   * Devuelve la cantidad de cambios nuevos introducidos (nuevas respuestas o sesiones actualizadas).
   */
  function mergeAppData(localData, remoteData, appId) {
    if (!remoteData || typeof remoteData !== 'object') return 0;
    if (!Array.isArray(remoteData.sessions) && !Array.isArray(remoteData.answers)) return 0;

    var tracker = getTracker(appId);
    var storeKey = 'study-tracker:' + appId;

    // 1. Obtener datos locales actuales si no fueron pasados
    if (!localData || !Array.isArray(localData.sessions) || !Array.isArray(localData.answers)) {
      if (tracker && typeof tracker.exportData === 'function') {
        try { localData = tracker.exportData(); } catch (e) { localData = null; }
      }
      if (!localData) {
        try {
          var rawLocal = localStorage.getItem(storeKey);
          localData = rawLocal ? JSON.parse(rawLocal) : { schema: 1, appId: appId, sessions: [], answers: [] };
        } catch (e) {
          localData = { schema: 1, appId: appId, sessions: [], answers: [] };
        }
      }
    }

    var localSessions = Array.isArray(localData.sessions) ? localData.sessions : [];
    var remoteSessions = Array.isArray(remoteData.sessions) ? remoteData.sessions : [];
    var sessionMap = {};
    var sessionsUpdated = false;

    localSessions.forEach(function (s) {
      if (s && s.id) {
        sessionMap[s.id] = Object.assign({}, s);
      }
    });

    // Unificación de sesiones por id:
    remoteSessions.forEach(function (rs) {
      if (!rs || !rs.id) return;
      var ls = sessionMap[rs.id];
      if (!ls) {
        sessionMap[rs.id] = Object.assign({}, rs);
        sessionsUpdated = true;
      } else {
        var remoteEnded = rs.endedAt != null && rs.endedAt !== 'null';
        var localEnded = ls.endedAt != null && ls.endedAt !== 'null';
        if ((remoteEnded && !localEnded) || (remoteEnded && localEnded && Number(rs.endedAt) > Number(ls.endedAt))) {
          ls.endedAt = rs.endedAt;
          if (rs.reason) ls.reason = rs.reason;
          if (rs.meta) ls.meta = Object.assign({}, ls.meta || {}, rs.meta);
          sessionsUpdated = true;
        }
      }
    });

    // Si hubo sesiones que se cerraron o agregaron remotamente, actualizar localStorage
    if (sessionsUpdated) {
      try {
        var rawNow = localStorage.getItem(storeKey);
        var cur = rawNow ? JSON.parse(rawNow) : { schema: 1, appId: appId, sessions: [], answers: [] };
        cur.sessions = Object.keys(sessionMap).map(function (k) { return sessionMap[k]; });
        localStorage.setItem(storeKey, JSON.stringify(cur));
      } catch (e) {
        console.warn('ExamCloudSync: error guardando sesiones unificadas en localStorage (' + appId + ')', e);
      }
    }

    // 2. Importar respuestas a través del tracker oficial (deduplica por session|question|at)
    var addedAnswers = 0;
    if (tracker && typeof tracker.importData === 'function') {
      try {
        var payloadToImport = {
          schema: 1,
          appId: appId,
          sessions: Object.keys(sessionMap).map(function (k) { return sessionMap[k]; }),
          answers: Array.isArray(remoteData.answers) ? remoteData.answers : []
        };
        addedAnswers = tracker.importData(payloadToImport, 'merge');
      } catch (e) {
        console.warn('ExamCloudSync: fallo tracker.importData en ' + appId + ':', e);
      }
    } else {
      // Fallback manual en caso de que StudyTracker no esté cargado en memoria
      try {
        var rawObj = localStorage.getItem(storeKey);
        var fallbackData = rawObj ? JSON.parse(rawObj) : { schema: 1, appId: appId, sessions: [], answers: [] };
        fallbackData.sessions = Object.keys(sessionMap).map(function (k) { return sessionMap[k]; });
        if (!Array.isArray(fallbackData.answers)) fallbackData.answers = [];

        var answerIndex = {};
        fallbackData.answers.forEach(function (a) {
          answerIndex[(a.session || '') + '|' + (a.question || '') + '|' + (a.at || '')] = 1;
        });

        if (Array.isArray(remoteData.answers)) {
          remoteData.answers.forEach(function (ra) {
            var k = (ra.session || '') + '|' + (ra.question || '') + '|' + (ra.at || '');
            if (!answerIndex[k]) {
              answerIndex[k] = 1;
              fallbackData.answers.push(ra);
              addedAnswers++;
            }
          });
        }
        localStorage.setItem(storeKey, JSON.stringify(fallbackData));
      } catch (err) {
        console.warn('ExamCloudSync: fallback manual falló para ' + appId, err);
      }
    }

    return addedAnswers + (sessionsUpdated ? 1 : 0);
  }

  /* ---------- 8. Sincronización Bidireccional (syncNow) ---------- */
  function syncNow(opts) {
    opts = opts || {};
    var email = getEmail();
    var url = getUrl();
    var key = getKey();

    if (!email || !url || !key) {
      currentStatus = 'unconfigured';
      lastErrorMessage = 'Configura tu correo y credenciales de Supabase para activar la sincronización.';
      updateSyncButtonUI();
      return Promise.resolve({ status: 'unconfigured', reason: lastErrorMessage });
    }

    if (isSyncInProgress) {
      return Promise.resolve({ status: 'in_progress', reason: 'Ya hay una sincronización en curso.' });
    }

    isSyncInProgress = true;
    currentStatus = 'syncing';
    lastErrorMessage = '';
    updateSyncButtonUI();

    // 1. Recolectar exportData() de todos los trackers
    var clientPayload = {};
    EXAM_IDS.forEach(function (appId) {
      var tr = getTracker(appId);
      if (tr && typeof tr.exportData === 'function') {
        try {
          clientPayload[appId] = tr.exportData();
        } catch (e) {
          clientPayload[appId] = { schema: 1, appId: appId, sessions: [], answers: [] };
        }
      } else {
        try {
          var raw = localStorage.getItem('study-tracker:' + appId);
          clientPayload[appId] = raw ? JSON.parse(raw) : { schema: 1, appId: appId, sessions: [], answers: [] };
        } catch (e) {
          clientPayload[appId] = { schema: 1, appId: appId, sessions: [], answers: [] };
        }
      }
    });

    var rpcUrl = url + '/rest/v1/rpc/sync_exam_progress';
    var headers = {
      'apikey': key,
      'Authorization': 'Bearer ' + key,
      'Content-Type': 'application/json'
    };

    // Intentar primero con la función RPC atómica
    return fetch(rpcUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        p_email: email,
        p_client_data: clientPayload
      })
    })
      .then(function (res) {
        if (res.ok) {
          return res.json().then(function (mergedData) {
            return { ok: true, source: 'rpc', data: mergedData };
          });
        }

        // Si la RPC devolvió 404 (o función inexistente), intentar fallback a tabla REST directa
        if (res.status === 404 || res.status === 400) {
          return res.text().then(function (txt) {
            var isMissingFunc = txt.indexOf('PGRST202') !== -1 || txt.indexOf('sync_exam_progress') !== -1 || res.status === 404;
            if (isMissingFunc) {
              return runRestTableFallback(url, key, email, clientPayload);
            }
            throw new Error('Supabase RPC Error (' + res.status + '): ' + txt);
          });
        }

        return res.text().then(function (txt) {
          throw new Error('Supabase RPC Error (' + res.status + '): ' + txt);
        });
      })
      .then(function (result) {
        var mergedData = result.data || {};
        var totalNewItems = 0;

        suppressAutoSync = true;
        try {
          EXAM_IDS.forEach(function (appId) {
            var remoteApp = mergedData[appId];
            if (!remoteApp) return;
            var changes = mergeAppData(clientPayload[appId], remoteApp, appId);
            if (changes > 0) totalNewItems += changes;
          });
        } finally {
          setTimeout(function () {
            suppressAutoSync = false;
          }, 600);
        }

        var nowIso = new Date().toISOString();
        setLastSync(nowIso);
        currentStatus = 'synced';
        lastErrorMessage = '';
        isSyncInProgress = false;
        updateSyncButtonUI();

        // Si llegaron datos nuevos de otro dispositivo, notificar y actualizar vistas seguras
        if (totalNewItems > 0) {
          if (typeof onRemoteDataMergedCallback === 'function') {
            try { onRemoteDataMergedCallback({ newAnswers: totalNewItems }); } catch (e) {}
          }
          try {
            window.dispatchEvent(new CustomEvent('exam-arena:cloud-synced', {
              detail: { newAnswers: totalNewItems, timestamp: nowIso }
            }));
          } catch (e) {}

          // Si el usuario está viendo el hub (#examenes) o progreso (#progreso), refrescar suavemente
          var hash = (window.location.hash || '').replace(/^#/, '');
          if (hash === 'examenes' || hash.indexOf('/progreso') !== -1) {
            try {
              window.dispatchEvent(new HashChangeEvent('hashchange'));
            } catch (e) {}
          }
        }

        return {
          status: 'synced',
          newItems: totalNewItems,
          lastSync: nowIso,
          source: result.source
        };
      })
      .catch(function (err) {
        isSyncInProgress = false;
        var msg = err && err.message ? err.message : String(err);

        if (msg.indexOf('exam_arena_progress') !== -1 || msg.indexOf('PGRST204') !== -1 || msg.indexOf('relation') !== -1) {
          currentStatus = 'table_missing';
          lastErrorMessage = 'La tabla exam_arena_progress no existe en Supabase. Abre la configuración y copia el script SQL para ejecutarlo en Supabase.';
        } else if (msg.indexOf('Failed to fetch') !== -1 || !navigator.onLine) {
          currentStatus = 'error';
          lastErrorMessage = 'Sin conexión a internet o la URL de Supabase es inaccesible.';
        } else if (msg.indexOf('JWT') !== -1 || msg.indexOf('API key') !== -1 || msg.indexOf('401') !== -1) {
          currentStatus = 'error';
          lastErrorMessage = 'Credenciales de Supabase no válidas (revisa tu Anon Key y URL). Detalle: ' + msg;
        } else {
          currentStatus = 'error';
          lastErrorMessage = msg;
        }

        updateSyncButtonUI();
        if (!opts.silent) {
          console.error('ExamCloudSync Error:', err);
        }
        return { status: currentStatus, error: lastErrorMessage };
      });
  }

  // Fallback REST directo en caso de que el usuario no haya creado la RPC
  function runRestTableFallback(url, key, email, localPayload) {
    var getUrlEndpoint = url + '/rest/v1/exam_arena_progress?email=eq.' + encodeURIComponent(email) + '&select=data';
    var headers = {
      'apikey': key,
      'Authorization': 'Bearer ' + key,
      'Content-Type': 'application/json'
    };

    return fetch(getUrlEndpoint, { headers: headers })
      .then(function (res) {
        if (!res.ok) {
          return res.text().then(function (t) {
            throw new Error('Supabase REST GET error (' + res.status + '): ' + t);
          });
        }
        return res.json();
      })
      .then(function (rows) {
        var remoteServerData = (rows && rows.length && rows[0].data) ? rows[0].data : {};
        var combinedPayload = {};

        // Fusión bidireccional en cliente
        EXAM_IDS.forEach(function (appId) {
          var loc = localPayload[appId] || { schema: 1, appId: appId, sessions: [], answers: [] };
          var rem = remoteServerData[appId] || { schema: 1, appId: appId, sessions: [], answers: [] };

          var sessionMap = {};
          (loc.sessions || []).forEach(function (s) { if (s && s.id) sessionMap[s.id] = Object.assign({}, s); });
          (rem.sessions || []).forEach(function (rs) {
            if (!rs || !rs.id) return;
            var ls = sessionMap[rs.id];
            if (!ls) {
              sessionMap[rs.id] = Object.assign({}, rs);
            } else {
              var rEnded = rs.endedAt != null && rs.endedAt !== 'null';
              var lEnded = ls.endedAt != null && ls.endedAt !== 'null';
              if ((rEnded && !lEnded) || (rEnded && lEnded && Number(rs.endedAt) > Number(ls.endedAt))) {
                ls.endedAt = rs.endedAt;
                if (rs.reason) ls.reason = rs.reason;
              }
            }
          });

          var answerMap = {};
          var combinedAnswers = [];
          (loc.answers || []).concat(rem.answers || []).forEach(function (a) {
            if (!a || !a.question) return;
            var k = (a.session || '') + '|' + (a.question || '') + '|' + (a.at || '');
            if (!answerMap[k]) {
              answerMap[k] = true;
              combinedAnswers.push(a);
            }
          });
          combinedAnswers.sort(function (a, b) { return (a.at || 0) - (b.at || 0); });

          combinedPayload[appId] = {
            schema: 1,
            appId: appId,
            sessions: Object.keys(sessionMap).map(function (k) { return sessionMap[k]; }),
            answers: combinedAnswers
          };
        });

        // Guardar el consolidado en Supabase con upsert (on_conflict=email)
        var postUrl = url + '/rest/v1/exam_arena_progress?on_conflict=email';
        return fetch(postUrl, {
          method: 'POST',
          headers: Object.assign({}, headers, {
            'Prefer': 'resolution=merge-duplicates,return=representation'
          }),
          body: JSON.stringify([{
            email: email,
            data: combinedPayload,
            updated_at: new Date().toISOString()
          }])
        }).then(function (postRes) {
          if (!postRes.ok) {
            return postRes.text().then(function (t) {
              throw new Error('Supabase REST Upsert error (' + postRes.status + '): ' + t);
            });
          }
          return { ok: true, source: 'rest_fallback', data: combinedPayload };
        });
      });
  }

  /* ---------- 9. Auto-Sync Reactivo ---------- */
  function scheduleDebouncedSync(delayMs) {
    if (syncDebounceTimer) clearTimeout(syncDebounceTimer);
    syncDebounceTimer = setTimeout(function () {
      if (isConfigured()) {
        syncNow({ silent: true }).catch(function (e) {
          console.warn('ExamCloudSync auto-sync error:', e);
        });
      }
    }, delayMs || 1200);
  }

  // Sincronizar automáticamente cuando el usuario regresa a la pestaña (cambio de dispositivo o pantalla)
  window.addEventListener('focus', function () {
    if (isConfigured()) {
      var last = getLastSync();
      var diffMs = last ? (Date.now() - new Date(last).getTime()) : Infinity;
      if (diffMs > 15000) { // No saturar si enfocó hace menos de 15 segundos
        syncNow({ silent: true });
      }
    }
  });

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && isConfigured()) {
      var last = getLastSync();
      var diffMs = last ? (Date.now() - new Date(last).getTime()) : Infinity;
      if (diffMs > 15000) {
        syncNow({ silent: true });
      }
    }
  });

  /* ---------- 10. Botón en Cabecera e Indicadores Visuales ---------- */
  function ensureHeaderButton() {
    var btn = document.getElementById('cloud-sync-btn');
    if (btn) {
      if (!btn.__examCloudBound) {
        btn.__examCloudBound = true;
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          openModal();
        });
      }
      updateSyncButtonUI();
      return btn;
    }

    var topActions = document.querySelector('.top-actions');
    var topHeader = document.querySelector('header.top');
    var container = topActions || topHeader;
    if (!container) return null;

    btn = document.createElement('button');
    btn.id = 'cloud-sync-btn';
    btn.className = 'sync-pill';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Sincronizar progreso en la nube');
    btn.title = 'Sincronizar progreso en la nube (Supabase)';
    btn.innerHTML = '☁️ <span id="cloud-sync-label">Sync</span>';

    var themeToggle = document.getElementById('theme-toggle');
    if (themeToggle && themeToggle.parentNode === container) {
      container.insertBefore(btn, themeToggle);
    } else {
      container.appendChild(btn);
    }

    btn.__examCloudBound = true;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });

    updateSyncButtonUI();
    return btn;
  }

  function updateSyncButtonUI() {
    var btn = document.getElementById('cloud-sync-btn');
    if (!btn) return;

    var label = document.getElementById('cloud-sync-label');
    var email = getEmail();
    var configured = isConfigured();

    btn.classList.remove('sync-ok', 'sync-busy', 'sync-err', 'synced', 'syncing', 'error', 'table_missing', 'unconfigured');

    if (!configured) {
      btn.classList.add('unconfigured');
      if (label) label.textContent = 'Sync';
      btn.title = '☁️ Nube: Sin configurar (haz clic para conectar tu correo)';
      return;
    }

    if (currentStatus === 'syncing') {
      btn.classList.add('sync-busy', 'syncing');
      if (label) label.textContent = 'Sync...';
      btn.title = '🔄 Sincronizando progreso con Supabase (' + email + ')...';
    } else if (currentStatus === 'synced') {
      btn.classList.add('sync-ok', 'synced');
      var last = getLastSync();
      var dateStr = '';
      if (last) {
        try {
          dateStr = new Date(last).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {}
      }
      if (label) label.textContent = 'Sync ✓';
      btn.title = '☁️✓ Sincronizado (' + email + (dateStr ? ' · ' + dateStr : '') + ')';
    } else if (currentStatus === 'table_missing') {
      btn.classList.add('sync-err', 'table_missing');
      if (label) label.textContent = 'Falta SQL';
      btn.title = '⚠️ Supabase: Falta crear la tabla exam_arena_progress (clic para copiar SQL)';
    } else if (currentStatus === 'error') {
      btn.classList.add('sync-err', 'error');
      if (label) label.textContent = 'Error';
      btn.title = '⚠️ Error de sincronización (' + (lastErrorMessage || 'Verifica la conexión') + ')';
    } else {
      if (label) label.textContent = 'Sync';
      btn.title = '☁️ Sincronización en la nube lista (' + email + ')';
    }
  }

  /* ---------- 11. Modal de Configuración y Estado ---------- */
  function copySqlToClipboard(btnEl) {
    var text = SUPABASE_SCHEMA_SQL;
    function showFeedback() {
      if (btnEl) {
        var orig = btnEl.innerHTML;
        btnEl.innerHTML = '✓ ¡SQL Copiado!';
        setTimeout(function () { btnEl.innerHTML = orig; }, 2500);
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showFeedback).catch(function () {
        fallbackCopy();
      });
    } else {
      fallbackCopy();
    }

    function fallbackCopy() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showFeedback();
      } catch (e) {}
      document.body.removeChild(ta);
    }
  }

  function openModal() {
    closeModal(); // Evitar modales duplicados

    var backdrop = document.createElement('div');
    backdrop.className = 'sync-modal-backdrop';
    backdrop.id = 'cloud-sync-modal-backdrop';

    var stats = getSyncStats();
    var email = getEmail();
    var url = getUrl();
    var key = getKey();
    var lastSync = getLastSync();
    var isExpanded = !url || !key; // Si faltan credenciales, mostrar desplegado por defecto

    var statusLabel = 'Sin configurar';
    var statusClass = '';
    if (isConfigured()) {
      if (currentStatus === 'synced') { statusLabel = 'Sincronizado'; statusClass = 'ok'; }
      else if (currentStatus === 'syncing') { statusLabel = 'Sincronizando...'; statusClass = ''; }
      else if (currentStatus === 'table_missing') { statusLabel = 'Falta tabla SQL en Supabase'; statusClass = 'err'; }
      else if (currentStatus === 'error') { statusLabel = 'Error de conexión'; statusClass = 'err'; }
    }

    var lastSyncText = 'Nunca';
    if (lastSync) {
      try {
        lastSyncText = new Date(lastSync).toLocaleString();
      } catch (e) {
        lastSyncText = lastSync;
      }
    }

    backdrop.innerHTML = [
      '<div class="sync-modal" role="dialog" aria-modal="true" aria-labelledby="cloud-sync-title">',
      '  <h2 id="cloud-sync-title">☁️ Sincronización en la Nube</h2>',
      '  <p class="sync-desc">Unifica y conserva tu progreso en tiempo real entre tu celular, computadora y cualquier navegador mediante Supabase.</p>',
      '',
      '  <div class="sync-status-box ' + statusClass + '">',
      '    <div><b>Estado:</b> ' + statusLabel + '</div>',
      '    <div><b>Última sincronización:</b> ' + lastSyncText + '</div>',
      '    <div><b>Respuestas totales:</b> ' + stats.totalAnswers + ' respuestas (' + stats.totalSessions + ' sesiones completadas)</div>',
      lastErrorMessage ? '    <div style="margin-top:0.35rem;color:var(--bad)">⚠️ ' + lastErrorMessage + '</div>' : '',
      '  </div>',
      '',
      '  <div class="sync-field">',
      '    <label for="cloud-input-email">Correo Electrónico / ID de Usuario</label>',
      '    <input type="email" id="cloud-input-email" placeholder="fabian@example.com" value="' + email + '" autocomplete="email" spellcheck="false">',
      '    <small style="color:var(--muted);font-size:0.78rem;display:block;margin-top:0.35rem">Usa el mismo correo en todos tus dispositivos para sincronizar automáticamente tus 4 exámenes (SRE, GCP, Azure, AWS).</small>',
      '  </div>',
      '',
      '  <div style="margin-bottom:0.75rem">',
      '    <button type="button" id="cloud-advanced-toggle" style="background:none;border:none;color:var(--blue);cursor:pointer;font-weight:600;font-size:0.84rem;padding:0;text-align:left;display:inline-flex;align-items:center;gap:0.35rem">',
      '      ' + (isExpanded ? '▼ Ocultar credenciales de Supabase' : '▶ Configurar URL y Clave de Supabase') + '',
      '    </button>',
      '  </div>',
      '',
      '  <div id="cloud-advanced-panel" style="display:' + (isExpanded ? 'block' : 'none') + ';margin-bottom:1rem;padding:1rem;border-radius:var(--radius-md);background:var(--surface-2);border:1px dashed var(--line)">',
      '    <div class="sync-field">',
      '      <label for="cloud-input-url">Supabase Project URL</label>',
      '      <input type="text" id="cloud-input-url" placeholder="https://xyzcompany.supabase.co" value="' + url + '" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">',
      '    </div>',
      '    <div class="sync-field">',
      '      <label for="cloud-input-key">Supabase Anon Public Key</label>',
      '      <input type="text" id="cloud-input-key" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." value="' + key + '" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" data-1p-ignore="true" data-lpignore="true" style="font-family:monospace;font-size:0.78rem">',
      '      <small style="color:var(--muted);font-size:0.76rem;display:block;margin-top:0.25rem">Clave pública anónima (anon key). Es 100% segura para GitHub Pages con Row Level Security.</small>',
      '    </div>',
      '    <div class="sql-copy-box" style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;flex-wrap:wrap">',
      '      <span>¿Nuevo proyecto Supabase? Copia el script SQL:</span>',
      '      <button type="button" id="cloud-btn-copy-sql" style="padding:0.4rem 0.8rem;font-size:0.8rem;cursor:pointer;border-radius:var(--radius-pill);border:1px solid var(--line);background:var(--card);color:var(--txt)">',
      '        📋 Copiar SQL de tabla/RPC',
      '      </button>',
      '    </div>',
      '  </div>',
      '',
      '  <div class="sync-actions">',
      email ? '    <button type="button" id="cloud-btn-disconnect" style="background:transparent;color:var(--bad);border:1px solid rgba(220,38,38,0.3);border-radius:var(--radius-pill);cursor:pointer;padding:0.55rem 1rem">Desconectar cuenta</button>' : '',
      '    <div style="flex:1"></div>',
      '    <button type="button" id="cloud-btn-cancel" style="background:var(--surface-2);color:var(--txt);border:1px solid var(--line);border-radius:var(--radius-pill);cursor:pointer;padding:0.55rem 1.1rem">Cerrar</button>',
      '    <button type="button" id="cloud-btn-save" class="primary" style="background:linear-gradient(135deg,var(--blue,#2563eb),#1d4ed8);color:#ffffff;border:none;border-radius:var(--radius-pill);cursor:pointer;padding:0.55rem 1.25rem;font-weight:600">Guardar y Sincronizar</button>',
      '  </div>',
      '</div>'
    ].join('\n');

    document.body.appendChild(backdrop);

    // Eventos del modal
    var btnCancel = backdrop.querySelector('#cloud-btn-cancel');
    var btnSave = backdrop.querySelector('#cloud-btn-save');
    var btnDisconnect = backdrop.querySelector('#cloud-btn-disconnect');
    var btnCopySql = backdrop.querySelector('#cloud-btn-copy-sql');
    var toggleAdv = backdrop.querySelector('#cloud-advanced-toggle');
    var advPanel = backdrop.querySelector('#cloud-advanced-panel');

    function close() {
      if (backdrop && backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
    }

    if (btnCancel) btnCancel.onclick = close;

    backdrop.onclick = function (e) {
      if (e.target === backdrop) close();
    };

    document.addEventListener('keydown', function onEsc(e) {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', onEsc);
      }
    });

    if (toggleAdv && advPanel) {
      toggleAdv.onclick = function () {
        var isHidden = advPanel.style.display === 'none';
        advPanel.style.display = isHidden ? 'block' : 'none';
        toggleAdv.innerHTML = isHidden ? '▼ Ocultar credenciales de Supabase' : '▶ Configurar URL y Clave de Supabase';
      };
    }

    if (btnCopySql) {
      btnCopySql.onclick = function () {
        copySqlToClipboard(btnCopySql);
      };
    }

    if (btnDisconnect) {
      btnDisconnect.onclick = function () {
        if (confirm('¿Desconectar la cuenta en la nube? Tu progreso local en este navegador no se borrará.')) {
          disconnect();
          close();
        }
      };
    }

    if (btnSave) {
      btnSave.onclick = function () {
        var inEmail = backdrop.querySelector('#cloud-input-email');
        var inUrl = backdrop.querySelector('#cloud-input-url');
        var inKey = backdrop.querySelector('#cloud-input-key');

        var newEmail = setEmail(inEmail ? inEmail.value : '');
        var rawUrl = inUrl ? String(inUrl.value || '').trim().replace(/\/+$/, '') : '';
        var rawKey = inKey ? String(inKey.value || '').trim() : '';
        var newUrl = setUrl(rawUrl === DEFAULT_SUPABASE_URL ? '' : rawUrl) || DEFAULT_SUPABASE_URL;
        var newKey = setKey(rawKey === DEFAULT_SUPABASE_ANON_KEY ? '' : rawKey) || DEFAULT_SUPABASE_ANON_KEY;

        if (!newEmail) {
          alert('Por favor ingresa un correo electrónico válido.');
          if (inEmail) inEmail.focus();
          return;
        }

        if (!newUrl || !newKey) {
          alert('Por favor completa la URL y Anon Key del proyecto Supabase.');
          if (advPanel) advPanel.style.display = 'block';
          if (inUrl && !newUrl) inUrl.focus();
          else if (inKey) inKey.focus();
          return;
        }

        btnSave.disabled = true;
        btnSave.innerHTML = '🔄 Sincronizando...';

        syncNow({ silent: false })
          .then(function (res) {
            btnSave.disabled = false;
            btnSave.innerHTML = 'Guardar y Sincronizar';
            if (res && res.status === 'synced') {
              close();
            } else {
              openModal();
            }
          })
          .catch(function () {
            btnSave.disabled = false;
            btnSave.innerHTML = 'Guardar y Sincronizar';
            openModal();
          });
      };
    }
  }

  function closeModal() {
    var existing = document.getElementById('cloud-sync-modal-backdrop');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }
  }

  /* ---------- 12. Inicialización Automática ---------- */
  function init() {
    ensureHeaderButton();

    // Precargar trackers de los 4 exámenes
    EXAM_IDS.forEach(function (appId) {
      getTracker(appId);
    });

    // Si ya está configurado, realizar pull inicial en segundo plano tras 1 segundo
    if (isConfigured()) {
      setTimeout(function () {
        syncNow({ silent: true }).catch(function () {});
      }, 1000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ---------- 13. Exposición Global ---------- */
  window.ExamCloudSync = {
    DEFAULT_SUPABASE_URL: DEFAULT_SUPABASE_URL,
    DEFAULT_SUPABASE_ANON_KEY: DEFAULT_SUPABASE_ANON_KEY,
    EXAM_IDS: EXAM_IDS,
    getEmail: getEmail,
    setEmail: setEmail,
    getUrl: getUrl,
    setUrl: setUrl,
    getKey: getKey,
    setKey: setKey,
    getLastSync: getLastSync,
    isConfigured: isConfigured,
    getStatus: function () { return currentStatus; },
    getSyncStats: getSyncStats,
    mergeAppData: mergeAppData,
    syncNow: syncNow,
    registerTrackers: registerTrackers,
    openModal: openModal,
    closeModal: closeModal,
    copySqlToClipboard: function () { copySqlToClipboard(null); },
    getSchemaSql: function () { return SUPABASE_SCHEMA_SQL; },
    init: init
  };

})(window, document);
