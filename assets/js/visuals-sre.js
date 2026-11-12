/* Visual Aids Pack — SRE & Production Engineering (Tanda 1: Core Telemetry & Architecture) */
window.EXAM_VISUALS = window.EXAM_VISUALS || {};
window.EXAM_VISUALS['sre-incidents'] = {
  questions: {},
  topics: {},
  patterns: [
    /* 1. SLO & ERROR BUDGET BURN RATE MULTI-WINDOW */
    {
      match: /slo|sli|sla|error budget|burn rate|presupuesto de error/i,
      badge: 'SLO & Burn Rate',
      title: 'Alertas Multi-Window Multi-Burn-Rate y Consumo de Error Budget',
      titleEn: 'Multi-Window Multi-Burn-Rate Alerts & Error Budget Burn Down',
      svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sreGradBudget" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#34d399" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#34d399" stop-opacity="0.0"/>
    </linearGradient>
    <linearGradient id="sreGradBurn" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f87171" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#f87171" stop-opacity="0.0"/>
    </linearGradient>
    <filter id="sreGlowRed" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Left: Burn Rate Chart -->
  <g transform="translate(15, 15)">
    <!-- Chart Box -->
    <rect x="0" y="0" width="375" height="210" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <text x="18" y="24" fill="#f8fafc" font-size="12" font-weight="700">Consumo de Error Budget (Ventana 30 Días · SLO 99.9%)</text>
    <text x="18" y="40" fill="#94a3b8" font-size="10">SLI: 99.9% Req Exitosas &lt; 400ms · Presupuesto: 43.2 min</text>

    <!-- Chart Grid Lines -->
    <line x1="45" y1="55" x2="355" y2="55" stroke="#334155" stroke-dasharray="3,3"/>
    <text x="15" y="59" fill="#94a3b8" font-size="9" text-anchor="start">100%</text>

    <line x1="45" y1="95" x2="355" y2="95" stroke="#334155" stroke-dasharray="3,3"/>
    <text x="20" y="99" fill="#94a3b8" font-size="9" text-anchor="start">75%</text>

    <line x1="45" y1="135" x2="355" y2="135" stroke="#334155" stroke-dasharray="3,3"/>
    <text x="20" y="139" fill="#94a3b8" font-size="9" text-anchor="start">50%</text>

    <line x1="45" y1="175" x2="355" y2="175" stroke="#475569" stroke-width="1.2"/>
    <text x="24" y="179" fill="#f87171" font-size="9" font-weight="700" text-anchor="start">0%</text>

    <!-- Axes Labels -->
    <text x="45" y="195" fill="#64748b" font-size="9">Día 0</text>
    <text x="145" y="195" fill="#64748b" font-size="9">Día 10</text>
    <text x="240" y="195" fill="#64748b" font-size="9">Día 20</text>
    <text x="330" y="195" fill="#64748b" font-size="9">Día 30</text>

    <!-- Normal Burn Curve (1x) -->
    <path d="M 45 55 L 145 95 L 195 115 L 290 155 L 355 175" fill="none" stroke="#34d399" stroke-width="2" stroke-dasharray="4,2"/>
    <text x="280" y="145" fill="#34d399" font-size="9" font-weight="600">Ritmo 1x (Sostenible)</text>

    <!-- Fast Burn Incident (14.4x) Drop -->
    <path d="M 45 55 L 145 95 L 195 115 L 215 168 L 225 174" fill="none" stroke="#f87171" stroke-width="3"/>
    <polygon points="195,115 215,168 225,174 225,175 195,175" fill="url(#sreGradBurn)"/>

    <!-- Alert Indicator Point -->
    <circle cx="215" cy="168" r="6" fill="#ef4444" filter="url(#sreGlowRed)"/>
    <circle cx="215" cy="168" r="2.5" fill="#ffffff"/>

    <!-- Callout Box on Chart -->
    <rect x="225" y="98" width="128" height="42" rx="5" fill="#0f172a" stroke="#f87171" stroke-width="1.2"/>
    <text x="232" y="113" fill="#f87171" font-size="9.5" font-weight="800">🔥 14.4x Burn Rate!</text>
    <text x="232" y="126" fill="#f1f5f9" font-size="8.5">Quema 2% budget en 1h</text>
    <text x="232" y="136" fill="#cbd5e1" font-size="8">Agotaría 30d en ~50h</text>
  </g>

  <!-- Right: Multi-Window Multi-Burn-Rate Strategy -->
  <g transform="translate(405, 15)">
    <rect x="0" y="0" width="260" height="210" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <text x="14" y="24" fill="#38bdf8" font-size="11" font-weight="800">ALERTAS SRE (GOOGLE WORKBOOK)</text>

    <!-- Box 1: P1 Critical Page -->
    <rect x="12" y="36" width="236" height="52" rx="7" fill="#0f172a" stroke="#f87171" stroke-width="1.2"/>
    <text x="22" y="52" fill="#f87171" font-size="10.5" font-weight="800">🚨 P1 Pager (Burn Rate 14.4x · 2% en 1h)</text>
    <text x="22" y="66" fill="#cbd5e1" font-size="9">Ventana Larga: <b>1h (14.4x)</b></text>
    <text x="135" y="66" fill="#38bdf8" font-size="9">AND</text>
    <text x="165" y="66" fill="#cbd5e1" font-size="9">Corta: <b>5m (14.4x)</b></text>
    <text x="22" y="80" fill="#94a3b8" font-size="8.5">Acción: Despertar de guardia / Triage de emergencia</text>

    <!-- Box 2: P2 Ticket -->
    <rect x="12" y="96" width="236" height="52" rx="7" fill="#0f172a" stroke="#fbbf24" stroke-width="1.2"/>
    <text x="22" y="112" fill="#fbbf24" font-size="10.5" font-weight="800">⚠️ P2 Ticket (Burn Rate 6x · 5% en 6h)</text>
    <text x="22" y="126" fill="#cbd5e1" font-size="9">Ventana Larga: <b>6h (6x)</b></text>
    <text x="130" y="126" fill="#38bdf8" font-size="9">AND</text>
    <text x="160" y="126" fill="#cbd5e1" font-size="9">Corta: <b>30m (6x)</b></text>
    <text x="22" y="140" fill="#94a3b8" font-size="8.5">Acción: Ticket para horario laboral (Sin despertar)</text>

    <!-- Key Advantage Pill -->
    <rect x="12" y="156" width="236" height="42" rx="7" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1"/>
    <text x="22" y="172" fill="#38bdf8" font-size="9.5" font-weight="800">¿Por qué Multi-Window con AND?</text>
    <text x="22" y="187" fill="#e0f2fe" font-size="8.5">Evita alertas falsas por picos fugaces y corta la alerta</text>
    <text x="22" y="195" fill="#e0f2fe" font-size="8.5">inmediatamente cuando el incidente se mitiga.</text>
  </g>
</svg>`,
      caption: 'Estrategia multi-window multi-burn-rate (Google SRE): combina ventanas largas y cortas con condición `AND` para alertar velozmente ante incidentes severos sin generar fatiga de alertas ni seguir sonando tras mitigar el fallo.',
      captionEn: 'Multi-window multi-burn-rate alerting (Google SRE): combines long and short evaluation windows with an `AND` condition to page quickly on rapid budget drain while auto-resolving immediately once traffic stabilizes.'
    },

    /* 2. PROMETHEUS & THANOS / HIGH CARDINALITY */
    {
      match: /prometheus|thanos|promql|scrape|cardinalidad|cardinality|tsdb|grafan/i,
      badge: 'Prometheus & Thanos',
      title: 'Arquitectura Prometheus + Thanos y Riesgo de Alta Cardinalidad',
      titleEn: 'Prometheus + Thanos Pipeline & High Cardinality Explosions',
      svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="sreArrCyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8"/>
    </marker>
    <marker id="sreArrRed" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#f87171"/>
    </marker>
    <marker id="sreArrGreen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#34d399"/>
    </marker>
  </defs>

  <!-- Left: Pod Targets -->
  <g transform="translate(15, 20)">
    <rect x="0" y="0" width="105" height="200" rx="9" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <text x="12" y="24" fill="#38bdf8" font-size="11" font-weight="800">K8S PODS</text>
    <text x="12" y="38" fill="#94a3b8" font-size="9">Endpoints /metrics</text>

    <!-- Pod 1 -->
    <rect x="10" y="50" width="85" height="36" rx="6" fill="#0f172a" stroke="#475569"/>
    <text x="18" y="67" fill="#f8fafc" font-size="9.5" font-weight="700">order-api-pod</text>
    <text x="18" y="78" fill="#34d399" font-size="8">port: 9090 /metrics</text>

    <!-- Pod 2 -->
    <rect x="10" y="95" width="85" height="36" rx="6" fill="#0f172a" stroke="#475569"/>
    <text x="18" y="112" fill="#f8fafc" font-size="9.5" font-weight="700">pay-svc-pod</text>
    <text x="18" y="123" fill="#34d399" font-size="8">port: 8080 /metrics</text>

    <!-- Scrape Loop Indicator -->
    <rect x="10" y="145" width="85" height="42" rx="6" fill="#0c4a6e" stroke="#38bdf8"/>
    <text x="16" y="162" fill="#38bdf8" font-size="9" font-weight="800">Pull Scrape</text>
    <text x="16" y="176" fill="#e0f2fe" font-size="8">interval: 15s</text>
  </g>

  <!-- Arrow Scrape to Prometheus -->
  <line x1="120" y1="115" x2="148" y2="115" stroke="#38bdf8" stroke-width="2" marker-end="url(#sreArrCyan)"/>

  <!-- Prometheus Node -->
  <g transform="translate(152, 20)">
    <rect x="0" y="0" width="155" height="200" rx="9" fill="#1e293b" stroke="#f97316" stroke-width="1.8"/>
    <!-- Header with Prom Icon -->
    <rect x="0" y="0" width="155" height="32" rx="9" fill="#7c2d12"/>
    <text x="12" y="21" fill="#ffedd5" font-size="11" font-weight="800">🔥 PROMETHEUS HA</text>

    <!-- TSDB Head Block -->
    <rect x="10" y="42" width="135" height="44" rx="6" fill="#0f172a" stroke="#ea580c"/>
    <text x="18" y="58" fill="#fdba74" font-size="9.5" font-weight="700">TSDB Head Block</text>
    <text x="18" y="70" fill="#cbd5e1" font-size="8">RAM (In-memory 2h) + WAL</text>
    <text x="18" y="80" fill="#94a3b8" font-size="7.5">Series activas indexadas</text>

    <!-- TSDB 2h Blocks -->
    <rect x="10" y="94" width="135" height="38" rx="6" fill="#0f172a" stroke="#475569"/>
    <text x="18" y="110" fill="#f8fafc" font-size="9" font-weight="600">Bloques TSDB 2h</text>
    <text x="18" y="122" fill="#94a3b8" font-size="8">Chunks comprimidos en disco</text>

    <!-- Thanos Sidecar -->
    <rect x="10" y="142" width="135" height="46" rx="6" fill="#1e1b4b" stroke="#818cf8"/>
    <text x="18" y="158" fill="#c7d2fe" font-size="9.5" font-weight="800">Thanos Sidecar</text>
    <text x="18" y="171" fill="#e0e7ff" font-size="8">Sube bloques 2h a Object Storage</text>
    <text x="18" y="181" fill="#818cf8" font-size="7.5">Expone StoreAPI para Query</text>
  </g>

  <!-- Arrow Thanos Sidecar to Thanos Tier -->
  <line x1="307" y1="120" x2="333" y2="120" stroke="#818cf8" stroke-width="2" marker-end="url(#sreArrCyan)"/>

  <!-- Thanos Distributed Tier -->
  <g transform="translate(337, 20)">
    <rect x="0" y="0" width="150" height="200" rx="9" fill="#1e293b" stroke="#818cf8" stroke-width="1.5"/>
    <text x="12" y="24" fill="#a78bfa" font-size="11" font-weight="800">THANOS CLOUD TIER</text>

    <!-- Object Storage (S3 / GCS) -->
    <rect x="10" y="38" width="130" height="42" rx="6" fill="#0f172a" stroke="#475569"/>
    <text x="18" y="55" fill="#f8fafc" font-size="9.5" font-weight="700">🪣 Object Storage</text>
    <text x="18" y="68" fill="#94a3b8" font-size="8">S3 / GCS (Retención 1+ año)</text>

    <!-- Thanos Compactor -->
    <rect x="10" y="88" width="130" height="46" rx="6" fill="#0f172a" stroke="#818cf8"/>
    <text x="18" y="104" fill="#c7d2fe" font-size="9.5" font-weight="700">Thanos Compactor</text>
    <text x="18" y="116" fill="#cbd5e1" font-size="8">Downsampling (5m / 1h)</text>
    <text x="18" y="127" fill="#fbbf24" font-size="7.5">⚠️ SINGLETON (1 sola réplica)</text>

    <!-- Thanos Query -->
    <rect x="10" y="142" width="130" height="46" rx="6" fill="#0c4a6e" stroke="#38bdf8"/>
    <text x="18" y="158" fill="#38bdf8" font-size="9.5" font-weight="800">Thanos Query</text>
    <text x="18" y="171" fill="#e0f2fe" font-size="8">Deduplica réplicas Prom HA</text>
    <text x="18" y="181" fill="#34d399" font-size="7.5">PromQL federado hacia Grafana</text>
  </g>

  <!-- Right: High Cardinality Disaster Callout -->
  <g transform="translate(498, 20)">
    <rect x="0" y="0" width="168" height="200" rx="9" fill="#1e293b" stroke="#f87171" stroke-width="1.8"/>
    <rect x="0" y="0" width="168" height="30" rx="9" fill="#7f1d1d"/>
    <text x="12" y="20" fill="#fecaca" font-size="10.5" font-weight="800">💥 ALTA CARDINALIDAD</text>

    <text x="10" y="48" fill="#cbd5e1" font-size="9" font-weight="700">Ejemplo de explosión:</text>
    <rect x="8" y="55" width="152" height="40" rx="5" fill="#0f172a" stroke="#ef4444"/>
    <text x="14" y="70" fill="#f87171" font-size="8.5" font-family="monospace">http_requests_total{</text>
    <text x="20" y="82" fill="#fbbf24" font-size="8.5" font-family="monospace">user_id="&lt;uuid&gt;"} ❌</text>

    <text x="10" y="110" fill="#94a3b8" font-size="8.5">100k usuarios × 10 endpoints</text>
    <text x="10" y="122" fill="#f87171" font-size="9" font-weight="800">= 1,000,000 series activas!</text>

    <!-- Consequence Box -->
    <rect x="8" y="134" width="152" height="54" rx="5" fill="#450a0a" stroke="#f87171"/>
    <text x="14" y="150" fill="#fca5a5" font-size="8.5" font-weight="700">Consecuencia SRE:</text>
    <text x="14" y="163" fill="#fee2e2" font-size="8">• Memoria RAM de TSDB explota</text>
    <text x="14" y="173" fill="#fee2e2" font-size="8">• K8s OOMKilled (Exit Code 137)</text>
    <text x="14" y="183" fill="#fee2e2" font-size="8">• Pérdida total de telemetría</text>
  </g>
</svg>`,
      caption: 'Topología Prometheus + Thanos: Prometheus realiza scraping de pods en su bloque Head (RAM/WAL) y Thanos Sidecar sube los bloques de 2h a Object Storage. `Thanos Compactor` debe ejecutarse como singleton para evitar corrupción. Etiquetas de alta cardinalidad (ej. `user_id`) generan millones de series que tumban TSDB por OOM.',
      captionEn: 'Prometheus + Thanos topology: Prometheus scrapes pods into the Head block (RAM/WAL) while Thanos Sidecar uploads 2h blocks to Object Storage. `Thanos Compactor` must run strictly as a singleton to avoid split-brain compaction corruption. Unbounded cardinality labels (e.g. `user_id`) cause TSDB OOMKilled crashes.'
    },

    /* 3. INCIDENT COMMAND SYSTEM (ICS) & ON-CALL TOPOLOGY */
    {
      match: /incident commander|sev-1|sev-2|scribe|ops lead|postmortem|blameless|on-call/i,
      badge: 'Incident Command (ICS)',
      title: 'Estructura de Incident Command System (ICS) y Triage en Sev-1',
      titleEn: 'Incident Command System (ICS) Roles & Sev-1 Triage Topology',
      svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="sreArrSlate" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#94a3b8"/>
    </marker>
  </defs>

  <!-- Incident Commander (Top Central Node) -->
  <g transform="translate(195, 12)">
    <rect x="0" y="0" width="290" height="64" rx="10" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
    <rect x="0" y="0" width="290" height="24" rx="10" fill="#78350f"/>
    <text x="145" y="16" fill="#fef3c7" font-size="11" font-weight="800" text-anchor="middle">👑 INCIDENT COMMANDER (IC)</text>
    <text x="145" y="38" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">Máxima autoridad durante el Sev-1 / Sev-2</text>
    <text x="145" y="52" fill="#cbd5e1" font-size="8.5" text-anchor="middle">Orquesta y asigna roles · Mantiene foco en mitigar · <b>NO toca la terminal</b></text>
  </g>

  <!-- Connector Lines from IC to Sub-roles -->
  <line x1="260" y1="76" x2="115" y2="104" stroke="#94a3b8" stroke-width="1.8" marker-end="url(#sreArrSlate)"/>
  <line x1="340" y1="76" x2="340" y2="104" stroke="#94a3b8" stroke-width="1.8" marker-end="url(#sreArrSlate)"/>
  <line x1="420" y1="76" x2="565" y2="104" stroke="#94a3b8" stroke-width="1.8" marker-end="url(#sreArrSlate)"/>

  <!-- Left: Operations Lead -->
  <g transform="translate(20, 105)">
    <rect x="0" y="0" width="195" height="85" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
    <rect x="0" y="0" width="195" height="22" rx="8" fill="#0369a1"/>
    <text x="97" y="15" fill="#f0f9ff" font-size="10" font-weight="800" text-anchor="middle">🛠️ OPERATIONS / OPS LEAD</text>
    <text x="12" y="36" fill="#38bdf8" font-size="9" font-weight="700">Ejecuta cambios en producción</text>
    <text x="12" y="48" fill="#cbd5e1" font-size="8">• Aplica Rollbacks o escalado horizontal</text>
    <text x="12" y="59" fill="#cbd5e1" font-size="8">• Drena tráfico de zonas con fallos</text>
    <text x="12" y="70" fill="#cbd5e1" font-size="8">• Coordina con SMEs (DBA, K8s, Redes)</text>
    <text x="12" y="80" fill="#f87171" font-size="7.5" font-weight="700">PROHIBIDO "freelancing" sin avisar al IC</text>
  </g>

  <!-- Middle: Scribe / Documenter -->
  <g transform="translate(242, 105)">
    <rect x="0" y="0" width="195" height="85" rx="8" fill="#1e293b" stroke="#34d399" stroke-width="1.5"/>
    <rect x="0" y="0" width="195" height="22" rx="8" fill="#065f46"/>
    <text x="97" y="15" fill="#ecfdf5" font-size="10" font-weight="800" text-anchor="middle">📝 SCRIBE / ESCRIBA</text>
    <text x="12" y="36" fill="#34d399" font-size="9" font-weight="700">Línea de tiempo del incidente</text>
    <text x="12" y="48" fill="#cbd5e1" font-size="8">• Timestamps exactos de eventos y alertas</text>
    <text x="12" y="59" fill="#cbd5e1" font-size="8">• Hipótesis propuestas y descartadas</text>
    <text x="12" y="70" fill="#cbd5e1" font-size="8">• Comandos ejecutados y resultados</text>
    <text x="12" y="80" fill="#34d399" font-size="7.5" font-weight="700">Base para el Blameless Postmortem</text>
  </g>

  <!-- Right: Communications Lead -->
  <g transform="translate(465, 105)">
    <rect x="0" y="0" width="195" height="85" rx="8" fill="#1e293b" stroke="#a78bfa" stroke-width="1.5"/>
    <rect x="0" y="0" width="195" height="22" rx="8" fill="#5b21b6"/>
    <text x="97" y="15" fill="#f5f3ff" font-size="10" font-weight="800" text-anchor="middle">📢 COMMS LEAD</text>
    <text x="12" y="36" fill="#c4b5fd" font-size="9" font-weight="700">Voz hacia el exterior y directiva</text>
    <text x="12" y="48" fill="#cbd5e1" font-size="8">• Actualiza Status Page cada 20-30 min</text>
    <text x="12" y="59" fill="#cbd5e1" font-size="8">• Informa a soporte técnico y ventas</text>
    <text x="12" y="70" fill="#cbd5e1" font-size="8">• Protege al equipo técnico de interrupciones</text>
    <text x="12" y="80" fill="#cbd5e1" font-size="7.5">Comunica hechos, no especulaciones</text>
  </g>

  <!-- Bottom Banner: SRE Golden Principle -->
  <g transform="translate(20, 200)">
    <rect x="0" y="0" width="640" height="28" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.2"/>
    <text x="320" y="18" fill="#fbbf24" font-size="9.5" font-weight="700" text-anchor="middle">
      REGLA DE ORO SRE: 1º Mitigar y restaurar el servicio (Rollback / Failover) ➔ 2º Identificar causa raíz en el Postmortem sin culpa
    </text>
  </g>
</svg>`,
      caption: 'Incident Command System (ICS): el Incident Commander (IC) orquesta la respuesta y nunca ejecuta comandos directos. El Ops Lead ejecuta cambios autorizados, el Scribe registra la cronología exacta y el Comms Lead informa a clientes y directiva. Primero se mitiga el impacto al usuario; la causa raíz se depura después en el postmortem sin culpa.',
      captionEn: 'Incident Command System (ICS): the Incident Commander (IC) leads high-level response and never runs console commands directly. The Ops Lead executes authorized mitigation, the Scribe records the real-time log, and the Comms Lead briefs stakeholders. Mitigation comes first; root cause analysis follows in the blameless postmortem.'
    },

    /* 4. KUBERNETES POD MEMORY / JVM OOMKILLED VS CGROUP LIMIT */
    {
      match: /oomkilled|exit code 137|cgroup|-xmx|jvm|metaspace|requests\.memory|limits\.memory/i,
      badge: 'K8s Memory & OOM',
      title: 'Anatomía de Exit Code 137: cgroup Limits vs. Memoria JVM / Runtime',
      titleEn: 'Exit Code 137 Anatomy: cgroup Limits vs JVM / Runtime Memory',
      svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sreGradOOM" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#b91c1c"/>
    </linearGradient>
    <linearGradient id="sreGradSafe" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
  </defs>

  <!-- Container Limit Ceiling Bar Across Top -->
  <g transform="translate(20, 12)">
    <rect x="0" y="0" width="640" height="28" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.2"/>
    <text x="18" y="18" fill="#38bdf8" font-size="10" font-weight="800">K8S CGROUP CEILING:</text>
    <text x="175" y="18" fill="#f8fafc" font-size="10" font-family="monospace">resources.limits.memory: 2Gi (2048 MB)</text>
    <text x="490" y="18" fill="#fbbf24" font-size="9.5">OOM Killer Threshold (kernel)</text>
  </g>

  <!-- Left: Dangerous Setup (-Xmx = 100% of cgroup) -->
  <g transform="translate(20, 50)">
    <rect x="0" y="0" width="310" height="175" rx="8" fill="#1e293b" stroke="#f87171" stroke-width="1.5"/>
    <rect x="0" y="0" width="310" height="24" rx="8" fill="#7f1d1d"/>
    <text x="12" y="16" fill="#fee2e2" font-size="10" font-weight="800">❌ CONFIGURACIÓN PELIGROSA: -Xmx2048m</text>

    <!-- Stacked Memory Breakdown -->
    <text x="12" y="42" fill="#cbd5e1" font-size="9">Total real ocupado en cgroup por el proceso JVM:</text>

    <!-- Heap Bar -->
    <rect x="12" y="52" width="230" height="20" rx="3" fill="#ea580c"/>
    <text x="18" y="66" fill="#ffffff" font-size="8.5" font-weight="700">JVM Heap (-Xmx): 2048 MB (100% cgroup!)</text>

    <!-- Off-Heap Bar (Overflow!) -->
    <rect x="242" y="52" width="45" height="20" rx="3" fill="#ef4444"/>
    <text x="246" y="66" fill="#ffffff" font-size="8.5" font-weight="800">+350MB</text>

    <!-- Threshold Line -->
    <line x1="242" y1="46" x2="242" y2="82" stroke="#f87171" stroke-width="2.5" stroke-dasharray="3,2"/>
    <text x="195" y="44" fill="#f87171" font-size="8" font-weight="700">Límite 2048MB</text>

    <!-- Off-Heap Details -->
    <text x="12" y="88" fill="#94a3b8" font-size="8">Off-Heap no contabilizado por -Xmx:</text>
    <text x="12" y="100" fill="#cbd5e1" font-size="8">• Metaspace (~128MB) · Thread Stacks (~1MB x 200 = 200MB)</text>
    <text x="12" y="112" fill="#cbd5e1" font-size="8">• Direct ByteBuffers (Netty/NIO) · GC overhead</text>
    <text x="12" y="124" fill="#fca5a5" font-size="9" font-weight="700">Total Resident Set Size (RSS): ~2,400 MB</text>

    <!-- Kill Banner -->
    <rect x="8" y="132" width="294" height="35" rx="5" fill="#450a0a" stroke="#ef4444"/>
    <text x="16" y="146" fill="#fca5a5" font-size="9" font-weight="800">💀 KERNEL OOM KILLER ACTÚA:</text>
    <text x="16" y="159" fill="#fee2e2" font-size="8">Envía SIGKILL (9) ➔ Pod termina con <b>Exit Code 137</b> (128 + 9)</text>
  </g>

  <!-- Right: Recommended Safe Setup -->
  <g transform="translate(350, 50)">
    <rect x="0" y="0" width="310" height="175" rx="8" fill="#1e293b" stroke="#34d399" stroke-width="1.5"/>
    <rect x="0" y="0" width="310" height="24" rx="8" fill="#065f46"/>
    <text x="12" y="16" fill="#ecfdf5" font-size="10" font-weight="800">✅ PRÁCTICA RECOMENDADA: MaxRAMPercentage</text>

    <text x="12" y="42" fill="#cbd5e1" font-size="9">Cálculo dinámico respecto al límite del contenedor:</text>

    <!-- Stacked Safe Memory -->
    <!-- Heap 75% -->
    <rect x="12" y="52" width="170" height="20" rx="3" fill="#10b981"/>
    <text x="18" y="66" fill="#ffffff" font-size="8.5" font-weight="700">Heap (75%): 1536 MB</text>

    <!-- Off-Heap 20% -->
    <rect x="182" y="52" width="55" height="20" rx="3" fill="#06b6d4"/>
    <text x="186" y="66" fill="#ffffff" font-size="8" font-weight="700">Off-Heap</text>

    <!-- Headroom buffer -->
    <rect x="237" y="52" width="40" height="20" rx="3" fill="#334155"/>
    <text x="242" y="66" fill="#94a3b8" font-size="8">Buffer</text>

    <!-- Limit marker -->
    <line x1="277" y1="46" x2="277" y2="82" stroke="#38bdf8" stroke-width="2"/>
    <text x="248" y="44" fill="#38bdf8" font-size="8" font-weight="700">2048 MB</text>

    <!-- Flags Configuration Box -->
    <rect x="10" y="80" width="290" height="48" rx="5" fill="#0f172a" stroke="#334155"/>
    <text x="16" y="95" fill="#34d399" font-size="8.5" font-family="monospace">-XX:MaxRAMPercentage=75.0</text>
    <text x="16" y="108" fill="#38bdf8" font-size="8.5" font-family="monospace">-XX:+UseContainerSupport</text>
    <text x="16" y="121" fill="#cbd5e1" font-size="8">En Go: usar <span style="font-family:monospace;color:#38bdf8">GOMEMLIMIT=1800MiB</span></text>

    <!-- Success Banner -->
    <rect x="8" y="132" width="294" height="35" rx="5" fill="#064e3b" stroke="#10b981"/>
    <text x="16" y="146" fill="#a7f3d0" font-size="9" font-weight="800">🛡️ POD ESTABLE Y SIN OOMKILLED:</text>
    <text x="16" y="159" fill="#d1fae5" font-size="8">Colchón libre de 160MB evita que picos off-heap rocen el cgroup.</text>
  </g>
</svg>`,
      caption: 'Exit Code 137 en Kubernetes: el kernel de Linux envía SIGKILL (señal 9, código 128 + 9 = 137) cuando el consumo de memoria total (RSS) supera `limits.memory`. Configurar `-Xmx` igual al límite causa OOM inevitable por el espacio off-heap (Metaspace, thread stacks, NIO). Usa `-XX:MaxRAMPercentage=75.0` o `GOMEMLIMIT` para dejar margen seguro.',
      captionEn: 'Kubernetes Exit Code 137: the Linux kernel triggers an OOM kill via SIGKILL (signal 9 -> exit 128 + 9 = 137) when container RSS breaches `limits.memory`. Setting `-Xmx` equal to the container limit ignores off-heap allocations (Metaspace, native memory, thread stacks). Use `-XX:MaxRAMPercentage=75.0` or `GOMEMLIMIT` to reserve safety headroom.'
    },

    /* 5. K8S TRAFFIC, READINESS/LIVENESS PROBES & ROLLING UPDATES */
    {
      match: /liveness|readiness|startupprobe|rollingupdate|poddisruptionbudget|hpa|coredns|ndots|conntrack|ephemeral/i,
      badge: 'K8s Probes & Traffic',
      title: 'Ciclo de Tráfico en K8s: Readiness vs. Liveness Probes y Rolling Updates',
      titleEn: 'K8s Traffic Routing: Readiness vs Liveness Probes & Rolling Updates',
      svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="sreArrBlue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8"/>
    </marker>
  </defs>

  <!-- Left: Ingress & Service Controller -->
  <g transform="translate(15, 20)">
    <rect x="0" y="0" width="130" height="200" rx="9" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="12" y="24" fill="#38bdf8" font-size="11" font-weight="800">INGRESS / SERVICE</text>
    <text x="12" y="38" fill="#94a3b8" font-size="8.5">EndpointSlice Controller</text>

    <!-- Client Traffic Inflow -->
    <rect x="10" y="52" width="110" height="42" rx="6" fill="#0f172a" stroke="#475569"/>
    <text x="16" y="68" fill="#f8fafc" font-size="9" font-weight="700">Peticiones HTTP</text>
    <text x="16" y="82" fill="#34d399" font-size="8">Clientes externos</text>

    <!-- Routing decision -->
    <rect x="10" y="105" width="110" height="85" rx="6" fill="#0c4a6e" stroke="#0284c7"/>
    <text x="16" y="122" fill="#e0f2fe" font-size="8.5" font-weight="800">Regla de Enrutado:</text>
    <text x="16" y="136" fill="#cbd5e1" font-size="8">Solo envía tráfico a Pods</text>
    <text x="16" y="148" fill="#cbd5e1" font-size="8">en estado <b style="color:#34d399">Ready = True</b></text>
    <text x="16" y="164" fill="#fca5a5" font-size="7.5">Si Readiness falla:</text>
    <text x="16" y="176" fill="#fca5a5" font-size="7.5">Remueve IP del Endpoint</text>
  </g>

  <!-- Arrow from Service to Pods -->
  <line x1="145" y1="80" x2="175" y2="80" stroke="#34d399" stroke-width="2" marker-end="url(#sreArrBlue)"/>
  <line x1="145" y1="160" x2="175" y2="160" stroke="#f87171" stroke-width="2" stroke-dasharray="3,3"/>

  <!-- Center Top: Pod A (Readiness Probe Success / Failure Handling) -->
  <g transform="translate(180, 20)">
    <rect x="0" y="0" width="245" height="92" rx="8" fill="#1e293b" stroke="#34d399" stroke-width="1.5"/>
    <rect x="0" y="0" width="245" height="22" rx="8" fill="#065f46"/>
    <text x="12" y="15" fill="#ecfdf5" font-size="9.5" font-weight="800">POD A: readinessProbe (Control de Tráfico)</text>

    <text x="12" y="38" fill="#cbd5e1" font-size="8.5">Comprueba si la app puede recibir tráfico (warmup/DB).</text>
    <text x="12" y="52" fill="#34d399" font-size="8.5" font-weight="700">✔ Fallo en Readiness ➔ Acción: Drenado Limpio</text>
    <text x="12" y="65" fill="#cbd5e1" font-size="8">• El Pod <b>NO SE REINICIA</b>. Sigue vivo procesando requests.</text>
    <text x="12" y="78" fill="#cbd5e1" font-size="8">• Se retira del Service ➔ Cero errores 502 Bad Gateway.</text>
  </g>

  <!-- Center Bottom: Pod B (Liveness Probe Danger Zone) -->
  <g transform="translate(180, 122)">
    <rect x="0" y="0" width="245" height="98" rx="8" fill="#1e293b" stroke="#f87171" stroke-width="1.5"/>
    <rect x="0" y="0" width="245" height="22" rx="8" fill="#7f1d1d"/>
    <text x="12" y="15" fill="#fee2e2" font-size="9.5" font-weight="800">POD B: livenessProbe (Reinicio de Proceso)</text>

    <text x="12" y="38" fill="#cbd5e1" font-size="8.5">Comprueba si el hilo principal está en deadlock irremediable.</text>
    <text x="12" y="52" fill="#f87171" font-size="8.5" font-weight="700">❌ Fallo en Liveness ➔ Acción: SIGKILL / Reinicio</text>
    <text x="12" y="65" fill="#cbd5e1" font-size="8">• Kubelet mata y recrea el contenedor (CrashLoopBackOff).</text>
    <text x="12" y="78" fill="#fbbf24" font-size="8" font-weight="700">⚠️ PELIGRO: NUNCA conectes livenessProbe a DBs externas.</text>
    <text x="12" y="90" fill="#fca5a5" font-size="7.5">Si la DB se satura, todos los pods reinician a la vez en cascada!</text>
  </g>

  <!-- Right: Zero-Downtime Rolling Update Sequence -->
  <g transform="translate(440, 20)">
    <rect x="0" y="0" width="225" height="200" rx="9" fill="#1e293b" stroke="#818cf8" stroke-width="1.5"/>
    <text x="12" y="24" fill="#c7d2fe" font-size="10.5" font-weight="800">ZERO-DOWNTIME SHUTDOWN</text>

    <!-- Step 1 -->
    <rect x="8" y="34" width="209" height="34" rx="5" fill="#0f172a" stroke="#334155"/>
    <text x="14" y="47" fill="#38bdf8" font-size="8.5" font-weight="700">1. Evento Pod Deletion</text>
    <text x="14" y="59" fill="#94a3b8" font-size="7.5">Service remueve el pod de EndpointSlice</text>

    <!-- Step 2: preStop -->
    <rect x="8" y="72" width="209" height="42" rx="5" fill="#0f172a" stroke="#f59e0b"/>
    <text x="14" y="86" fill="#fbbf24" font-size="8.5" font-weight="700">2. preStop Hook: sleep 10-15s</text>
    <text x="14" y="98" fill="#cbd5e1" font-size="7.5">Permite propagar retiro a kube-proxy / iptables</text>
    <text x="14" y="108" fill="#94a3b8" font-size="7.5">Evita que lleguen paquetes al pod muerto</text>

    <!-- Step 3: SIGTERM -->
    <rect x="8" y="118" width="209" height="36" rx="5" fill="#0f172a" stroke="#34d399"/>
    <text x="14" y="132" fill="#34d399" font-size="8.5" font-weight="700">3. Envío de SIGTERM</text>
    <text x="14" y="145" fill="#cbd5e1" font-size="7.5">App finaliza requests en vuelo (draining)</text>

    <!-- Step 4: Grace Period -->
    <rect x="8" y="158" width="209" height="34" rx="5" fill="#0f172a" stroke="#f87171"/>
    <text x="14" y="172" fill="#f87171" font-size="8.5" font-weight="700">4. SIGKILL (tras 30s)</text>
    <text x="14" y="184" fill="#94a3b8" font-size="7.5">terminationGracePeriodSeconds expira</text>
  </g>
</svg>`,
      caption: 'Gestión de tráfico y ciclo de vida en Kubernetes: la `readinessProbe` retira el pod de los endpoints sin matarlo para evitar errores 502 bajo calentamiento o degradación. La `livenessProbe` solo debe evaluar deadlock interno (nunca DBs externas). Durante un RollingUpdate, el ciclo `preStop: sleep 10s` + SIGTERM garantiza drenado sin pérdida de peticiones.',
      captionEn: 'Kubernetes traffic management and lifecycle: `readinessProbe` drains pods from service endpoints without killing them to prevent 502 Bad Gateways. `livenessProbe` must check only internal deadlocks (never external databases). During RollingUpdates, combining `preStop: sleep 10s` with SIGTERM enables zero-downtime connection draining.'
    },

    /* 6. POSTGRESQL LOCK QUEUE & CONNECTION POOL SATURATION */
    {
      match: /postgresql|access exclusive lock|lock_timeout|pgbouncer|hikaricp|max_connections|vacuum|xid|split-brain|fencing|stonith/i,
      badge: 'PostgreSQL & Lock Queue',
      title: 'Cola de Bloqueos en PostgreSQL y Saturación de Connection Pooling',
      titleEn: 'PostgreSQL Lock Queue Stoppage & Connection Pool Exhaustion',
      svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="sreArrWarn" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#f87171"/>
    </marker>
  </defs>

  <!-- Left: Transaction Lock Queue Sequence -->
  <g transform="translate(15, 15)">
    <rect x="0" y="0" width="415" height="150" rx="9" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <text x="14" y="22" fill="#38bdf8" font-size="11" font-weight="800">COLA DE CANDADOS EN POSTGRESQL (pg_locks)</text>

    <!-- Tx 1: SELECT (Executing) -->
    <rect x="12" y="32" width="390" height="32" rx="5" fill="#0f172a" stroke="#34d399"/>
    <text x="20" y="47" fill="#34d399" font-size="9" font-weight="800">Tx 1: SELECT * FROM orders WHERE ... (Ejecutando - 45s)</text>
    <text x="20" y="58" fill="#cbd5e1" font-size="8">Mantiene: <b style="color:#a7f3d0">AccessShareLock</b> sobre la tabla orders</text>

    <!-- Tx 2: Migration ALTER TABLE (Waiting for Tx 1) -->
    <rect x="12" y="69" width="390" height="34" rx="5" fill="#450a0a" stroke="#f87171"/>
    <text x="20" y="84" fill="#f87171" font-size="9" font-weight="800">Tx 2 (Migración): ALTER TABLE orders ADD COLUMN status_code INT;</text>
    <text x="20" y="96" fill="#fecaca" font-size="8">Pide: <b style="color:#fca5a5">ACCESS EXCLUSIVE LOCK</b> ➔ ESPERA a que termine Tx 1</text>

    <!-- Tx 3, 4, 5: Fast SELECTs BLOCKED behind Tx 2 -->
    <rect x="12" y="108" width="390" height="32" rx="5" fill="#1e1b4b" stroke="#f59e0b"/>
    <text x="20" y="122" fill="#fbbf24" font-size="9" font-weight="800">Tx 3, 4 ... 200: SELECT * FROM orders WHERE id = $1 (Rápidos 2ms)</text>
    <text x="20" y="133" fill="#fef08a" font-size="8">BLOQUEADOS DETRÁS DE Tx 2 (Postgres prioriza la cola de espera FIFO)</text>
  </g>

  <!-- Right: Connection Pool Saturation -->
  <g transform="translate(442, 15)">
    <rect x="0" y="0" width="223" height="150" rx="9" fill="#1e293b" stroke="#f87171" stroke-width="1.8"/>
    <rect x="0" y="0" width="223" height="26" rx="9" fill="#7f1d1d"/>
    <text x="12" y="18" fill="#fee2e2" font-size="10.5" font-weight="800">💥 PgBouncer / HikariCP</text>

    <text x="12" y="44" fill="#cbd5e1" font-size="8.5">Conexiones del Pool a Postgres:</text>
    <!-- Pool Bar 100% Full -->
    <rect x="12" y="52" width="200" height="22" rx="4" fill="#b91c1c"/>
    <text x="18" y="67" fill="#ffffff" font-size="9" font-weight="800">100 / 100 CONEXIONES OCUPADAS</text>

    <text x="12" y="90" fill="#94a3b8" font-size="8">Estado de conexiones:</text>
    <text x="12" y="102" fill="#fca5a5" font-size="8">• 1 ejecutando SELECT largo</text>
    <text x="12" y="114" fill="#fca5a5" font-size="8">• 99 congeladas esperando candado</text>

    <rect x="10" y="122" width="204" height="22" rx="4" fill="#0f172a" stroke="#ef4444"/>
    <text x="16" y="137" fill="#ef4444" font-size="8.5" font-weight="800">504 Gateway Timeout / App Caída</text>
  </g>

  <!-- Bottom: SRE Circuit Breaker Solution -->
  <g transform="translate(15, 175)">
    <rect x="0" y="0" width="650" height="52" rx="8" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
    <text x="16" y="18" fill="#34d399" font-size="10" font-weight="800">🛡️ SOLUCIÓN SRE: lock_timeout Y MIGRACIONES RESILIENTES</text>
    <text x="16" y="32" fill="#ecfdf5" font-size="8.5" font-family="monospace">
      SET lock_timeout = '2s'; ALTER TABLE orders ADD COLUMN status_code INT;
    </text>
    <text x="16" y="44" fill="#a7f3d0" font-size="8">
      Si el ALTER TABLE no consigue el lock en 2s, aborta inmediatamente sin encolarse ni bloquear las miles de queries de producción.
    </text>
  </g>
</svg>`,
      caption: 'Bloqueos en PostgreSQL: una consulta `ALTER TABLE` solicita un `ACCESS EXCLUSIVE LOCK`. Aunque esté esperando a que un `SELECT` termine, PostgreSQL la coloca al frente de la cola de candados, bloqueando todo el tráfico entrante de lectura/escritura y saturando el pool de conexiones (PgBouncer/HikariCP). La mitigación es fijar `SET lock_timeout = "2s"`.',
      captionEn: 'PostgreSQL lock queuing: an `ALTER TABLE` request demands `ACCESS EXCLUSIVE LOCK`. While awaiting long-running active `SELECT` queries, Postgres places it in the lock queue, immediately blocking all subsequent reads and writes behind it and exhausting connection pools (PgBouncer/HikariCP). The safeguard is configuring `SET lock_timeout = "2s"`.'
    }
  ]
};
