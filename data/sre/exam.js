/* =========================================================================
   data/sre/exam.js — SRE · Simulación de Incidentes y Producción
   60 escenarios reales de incidentes en producción con explicación por opción errónea (WHY)
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["sre-incidents"] = {
    id: "sre-incidents",
    appId: "sre-incidents",
    provider: "SRE & Production",
    badge: "SRE · Incident Sim",
    icon: "🚨",
    color: "#d93025",
    title: "SRE · Simulación de Incidentes en Producción",
    subtitle: "Escenarios reales de guardia: Triage, SLIs/SLOs, Kubernetes, Kafka, Prometheus/Thanos, Bases de Datos, DRP, DNS, TLS y GitOps.",
    passingScore: 75,
    domains: {
      1: "Triage, Incident Command y SLIs/SLOs (15 %)",
      2: "Kubernetes, Contenedores y Tráfico (25 %)",
      3: "Kafka, Mensajería y Sistemas Distribuidos (20 %)",
      4: "Observabilidad: Prometheus, Thanos, Grafana y Datadog (15 %)",
      5: "Bases de Datos, Storage, Caché y DRP (15 %)",
      6: "Redes, DNS, TLS, Seguridad y GitOps/IaC (10 %)"
    },
    shortDomains: {
      1: "Triage & SLOs",
      2: "Kubernetes",
      3: "Kafka & Distribuidos",
      4: "Observabilidad",
      5: "Datos, Caché & DRP",
      6: "DNS, TLS & GitOps"
    },
    topics: [
  {
    "id": "sre-t-1-1",
    "d": 1,
    "title": "1.1 · Comando de Incidentes (IC), Triage y Mitigación vs. Causa Raíz",
    "html": "\n<h4>La regla de oro en un incidente en producción</h4>\n<p>En respuesta a incidentes SRE, el objetivo primario es <b>restaurar el servicio y detener el impacto al usuario (mitigar)</b>, <em>no</em> encontrar ni programar la corrección definitiva de la causa raíz mientras el sistema sangra. Si un despliegue rompió producción hace 5 minutos, la respuesta correcta es <b>rollback</b> o <b>drenar tráfico</b>, no abrir el IDE a depurar línea por línea.</p>\n\n<h4>Roles en el comando de incidentes (ICS / Google SRE)</h4>\n<table class=\"keytable\">\n<tr><th>Rol</th><th>Responsabilidad principal</th><th>Error común que debe evitar</th></tr>\n<tr><td><b>Incident Commander (IC)</b></td><td>Coordina la respuesta, toma decisiones de alto nivel, asigna tareas y mantiene el foco en mitigar el impacto.</td><td>Ponerse a ejecutar comandos en la terminal y perder la visión global del incidente.</td></tr>\n<tr><td><b>Operations / Ops Lead</b></td><td>Ejecuta los cambios técnicos en producción (rollbacks, escalado, failover) coordinado con el IC.</td><td>Aplicar cambios en producción sin avisar en el canal del incidente (\"freelancing\").</td></tr>\n<tr><td><b>Communications Lead (Comms)</b></td><td>Actualiza la página de estado, informa a stakeholders y soporte cada N minutos acordados.</td><td>Dejar a dirección o clientes sin actualizaciones durante 1 hora porque \"seguimos investigando\".</td></tr>\n<tr><td><b>Scribe (Escriba)</b></td><td>Registra la línea de tiempo (timestamps, hipótesis descartadas, comandos ejecutados) para el postmortem.</td><td>Confiar en la memoria del equipo al día siguiente.</td></tr>\n</table>\n\n<h4>Metodologías de diagnóstico rápido: RED y USE</h4>\n<table class=\"keytable\">\n<tr><th>Método</th><th>Qué mide</th><th>Para qué sirve</th></tr>\n<tr><td><b>RED</b> (Request-driven)</td><td><b>R</b>ate (RPS), <b>E</b>rrors (tasa de error), <b>D</b>uration (latencia p50/p95/p99)</td><td>Microservicios, APIs HTTP/gRPC y puertas de enlace (orientado al usuario).</td></tr>\n<tr><td><b>USE</b> (Resource-driven)</td><td><b>U</b>tilization (% uso), <b>S</b>aturation (cola de espera), <b>E</b>rrors (errores de dispositivo)</td><td>Hardware, nodos, CPU, memoria, discos y red (orientado a infraestructura).</td></tr>\n</table>\n<div class=\"tip\"><b>Truco de incidente:</b> Ante un incidente desconocido, empieza de afuera hacia adentro con las <b>4 Señales Doradas (Golden Signals)</b>: Latencia, Tráfico, Errores y Saturación. Nunca mires el promedio de latencia: un fallo que afecta al 2 % de usuarios con timeouts de 30 s pasa desapercibido en el promedio, pero dispara el <b>p99</b>.</div>\n"
  },
  {
    "id": "sre-t-1-2",
    "d": 1,
    "title": "1.2 · SLIs, SLOs, Error Budgets y Alertas por Burn Rate",
    "html": "\n<h4>SLI vs. SLO vs. SLA</h4>\n<table class=\"keytable\">\n<tr><th>Concepto</th><th>Definición</th><th>Ejemplo práctico</th></tr>\n<tr><td><b>SLI (Indicator)</b></td><td>La métrica cuantitativa exacta que refleja la experiencia del usuario (normalmente proporción de eventos buenos sobre totales).</td><td>% de peticiones HTTP a <code>/checkout</code> con código ≠ 5xx que responden en &lt; 400 ms.</td></tr>\n<tr><td><b>SLO (Objective)</b></td><td>El objetivo interno de fiabilidad para un SLI en una ventana (p. ej. 28 o 30 días). Define el <b>Error Budget</b>.</td><td>99.9 % en 30 días (presupuesto de error: 43.2 minutos de caída al mes).</td></tr>\n<tr><td><b>SLA (Agreement)</b></td><td>Contrato legal externo con consecuencias financieras o créditos si se incumple. Siempre más laxo que el SLO interno.</td><td>99.5 % mensual; si baja, se devuelve un 10 % de la factura.</td></tr>\n</table>\n\n<h4>Alertas basadas en Burn Rate (Velocidad de quema)</h4>\n<p>Alertar simplemente cuando \"la tasa de error supera el 0.1 % durante 5 minutos\" genera ruido o detecta tarde incidentes graves. El <b>burn rate</b> mide a qué múltiplo de la velocidad sostenible estamos consumiendo el presupuesto de error mensual:</p>\n<ul>\n<li><b>Burn rate = 1</b>: consumiremos exactamente el 100 % del presupuesto de error en 30 días.</li>\n<li><b>Burn rate = 14.4</b>: consumiremos el <b>2 % del presupuesto mensual en solo 1 hora</b> (agota todo el mes en ~50 horas). Requiere <b>alerta de guardia (Page / P1)</b>.</li>\n<li><b>Multi-window, multi-burn-rate (Google SRE Workbook)</b>: combina una ventana larga (p. ej. 1 h) y una ventana corta (p. ej. 5 min) con condición <code>AND</code>. Así evitas que la alerta siga sonando horas después de que el incidente ya se mitigó (gracias a la ventana corta) y evitas falsos positivos por picos de 30 segundos (gracias a la ventana larga).</li>\n</ul>\n\n<h4>Cultura Blameless Postmortem (Sin culpa)</h4>\n<p>Un postmortem sin culpa asume que el ingeniero actuó con la mejor intención y la información disponible en ese momento. Si la conclusión de un incidente es \"Juan se equivocó al ejecutar un script\", el postmortem ha fracasado: la pregunta correcta es <b>por qué el sistema permitió que un comando manual sin validación, peer review ni dry-run tumbara producción</b>.</p>\n"
  },
  {
    "id": "sre-t-2-1",
    "d": 2,
    "title": "2.1 · Diagnóstico de Pods en Kubernetes: OOMKilled, Throttling y Probes",
    "html": "\n<h4>Estados críticos de un Pod y su significado real</h4>\n<table class=\"keytable\">\n<tr><th>Síntoma / Estado</th><th>Causa real en el kernel / kubelet</th><th>Acción correcta</th></tr>\n<tr><td><b>OOMKilled (Exit Code 137)</b></td><td>El cgroup del contenedor superó su <code>resources.limits.memory</code> (o el nodo sufrió OOM a nivel host) y el OOM Killer de Linux envió <code>SIGKILL (9)</code>.</td><td>Revisar fugas de memoria, ajustar el heap del runtime (p. ej. <code>-XX:MaxRAMPercentage</code> o <code>GOMEMLIMIT</code>) por debajo del límite del contenedor, o subir <code>limits.memory</code>.</td></tr>\n<tr><td><b>Latencia p99 alta con CPU al 40 % del límite</b></td><td><b>CPU CFS Throttling</b>: una app multihilo consume toda su cuota de CPU en los primeros milisegundos del periodo CFS de 100 ms y el kernel la congela el resto del ciclo.</td><td>Inspeccionar <code>container_cpu_cfs_throttled_periods_total</code>; subir o eliminar el límite rígido de CPU garantizando <code>requests.cpu</code> adecuado.</td></tr>\n<tr><td><b>CrashLoopBackOff en todos los pods a la vez</b></td><td>Suele ser una dependencia externa caída o una <b>livenessProbe</b> mal configurada que mata el contenedor cuando responde lento bajo carga o verifica una base de datos externa.</td><td><b>Jamás</b> conectes una <code>livenessProbe</code> a dependencias externas (DB, Redis, APIs). Usa <code>readinessProbe</code> para sacar el pod del Service sin reiniciarlo, y <code>startupProbe</code> para arranques lentos.</td></tr>\n<tr><td><b>Pending indefinido</b></td><td>El scheduler no encuentra nodo: falta de <code>requests</code> (CPU/Mem), afinidad de zona con PV (<code>VolumeNodeAffinityConflict</code>), Taints sin Tolerations o cuota agotada.</td><td>Ejecutar <code>kubectl describe pod</code> y leer la sección <code>Events</code> del scheduler.</td></tr>\n</table>\n\n<div class=\"tip\"><b>Regla de guardia:</b> Si una base de datos se ralentiza y tus microservicios tienen una <code>livenessProbe</code> que hace <code>SELECT 1</code> contra esa DB, Kubernetes reiniciará todos tus pods al mismo tiempo, provocando una cascada de reconexiones que tumbará aún más la base de datos. La <code>livenessProbe</code> solo debe comprobar que el proceso local no está en deadlock.</div>\n"
  },
  {
    "id": "sre-t-2-2",
    "d": 2,
    "title": "2.2 · Rolling Updates sin Downtime (Zero-Downtime), Ingress 502/504 y DNS en K8s",
    "html": "\n<h4>Por qué ocurren errores 502 Bad Gateway durante un despliegue en Kubernetes</h4>\n<p>Cuando Kubernetes elimina un pod durante un <i>rolling update</i>, ocurren dos flujos <b>en paralelo (asíncronos)</b>, no en secuencia:</p>\n<ol>\n<li>El <code>kubelet</code> del nodo envía <code>SIGTERM</code> al contenedor para que se apague.</li>\n<li>El controlador de Endpoints quita la IP del pod y avisa a <code>kube-proxy</code> / Ingress NGINX para que actualicen sus reglas.</li>\n</ol>\n<p>Si tu aplicación cierra su socket HTTP en el milisegundo 1 al recibir <code>SIGTERM</code>, pero Ingress NGINX tarda 2–5 segundos en enterarse de que ese Endpoint ya no existe, NGINX seguirá enviando peticiones al pod muerto → <b>502 Bad Gateway (Connection refused / reset by peer)</b>.</p>\n\n<h4>La solución completa para Zero-Downtime Deployments</h4>\n<ul>\n<li>Añadir un hook <code>lifecycle.preStop</code> (p. ej. <code>sleep 5</code> o <code>sleep 10</code>) antes de que el contenedor reciba <code>SIGTERM</code>, dando tiempo a que el Endpoint desaparezca de todos los balanceadores mientras la app sigue aceptando tráfico en vuelo.</li>\n<li>Implementar <b>Graceful Shutdown</b> en la aplicación al recibir <code>SIGTERM</code>: dejar de aceptar conexiones nuevas y terminar las peticiones en curso antes de salir.</li>\n<li>Asegurar que <code>terminationGracePeriodSeconds</code> sea mayor que la suma de <code>preStop</code> + el tiempo de drenado de peticiones.</li>\n</ul>\n\n<h4>El problema clásico de CoreDNS y <code>ndots:5</code></h4>\n<p>Por defecto en Kubernetes, <code>/etc/resolv.conf</code> tiene <code>ndots:5</code> y una lista de dominios de búsqueda (<code>&lt;ns&gt;.svc.cluster.local svc.cluster.local cluster.local</code>). Cualquier FQDN externo con menos de 5 puntos (como <code>api.stripe.com</code>, que tiene 2 puntos) genera primero <b>4 consultas DNS internas fallidas (A y AAAA = 8 paquetes)</b> antes de consultar el dominio real. En picos de tráfico esto satura CoreDNS y agota la tabla <code>nf_conntrack</code> UDP. Se mitiga con <b>NodeLocal DNSCache</b>, bajando <code>dnsConfig.options.ndots: \"2\"</code> o usando punto final en FQDNs externos (<code>api.stripe.com.</code>).</p>\n"
  },
  {
    "id": "sre-t-3-1",
    "d": 3,
    "title": "3.1 · Incidentes en Apache Kafka: Consumer Lag, Rebalance Storms e ISR",
    "html": "\n<h4>Diferencia crítica: <code>session.timeout.ms</code> vs. <code>max.poll.interval.ms</code></h4>\n<table class=\"keytable\">\n<tr><th>Parámetro</th><th>Qué controla</th><th>Qué pasa si se supera</th></tr>\n<tr><td><b>session.timeout.ms</b></td><td>Salud de red/proceso mediante el hilo de fondo (heartbeat thread).</td><td>El coordinador asume que el consumidor murió por red/crash y lanza un rebalanceo.</td></tr>\n<tr><td><b>max.poll.interval.ms</b></td><td>Tiempo máximo permitido entre dos llamadas sucesivas a <code>poll()</code> en el hilo de procesamiento.</td><td>Si un lote de mensajes tarda más de este límite en procesarse (p. ej. llamadas lentas a una API o DB), el consumidor es expulsado del grupo aunque siga enviando heartbeats → <b>Rebalance Storm</b> y reprocesamiento duplicado.</td></tr>\n</table>\n\n<h4>Durabilidad y disponibilidad de particiones</h4>\n<ul>\n<li><b>UnderReplicatedPartitions &gt; 0</b>: Uno o más seguidores van atrasados respecto al líder (red saturada, disco lento en un broker o broker caído). No hay pérdida de datos inmediata, pero el clúster pierde margen de tolerancia a fallos.</li>\n<li><b>OfflinePartitionsCount &gt; 0</b>: Emergencia crítica P1. La partición no tiene líder activo; tanto lecturas como escrituras en esa partición fallan.</li>\n<li><b>La ecuación de durabilidad</b>: Con <code>replication.factor = 3</code>, <code>min.insync.replicas = 2</code> y productores con <code>acks = all</code>, puedes perder 1 broker sin impacto ni pérdida de datos. Pero si configuras <code>min.insync.replicas = 3</code> con <code>replication.factor = 3</code>, la caída o reinicio de <b>un solo broker</b> bloqueará todas las escrituras con <code>NotEnoughReplicasException</code>.</li>\n</ul>\n\n<h4>Kafka Connect y el problema del Poison Pill</h4>\n<p>En un conector Sink de Kafka Connect, un solo mensaje corrupto o incompatible con el esquema (\"poison pill\") detendrá la tarea en estado <code>FAILED</code> en bucle infinito si se reinicia sin cambios. La mitigación limpia en emergencia es activar la tolerancia a errores (<code>errors.tolerance = all</code>) junto con una <b>Dead Letter Queue (DLQ)</b> (<code>errors.deadletterqueue.topic.name</code> y <code>errors.deadletterqueue.context.headers.enable = true</code>) para aislar los mensajes fallidos sin detener el pipeline.</p>\n"
  },
  {
    "id": "sre-t-3-2",
    "d": 3,
    "title": "3.2 · Resiliencia en Sistemas Distribuidos: Retry Storms, Backoff, Jitter y Load Shedding",
    "html": "\n<h4>Por qué los reintentos ingenuos convierten un hipo en una caída total</h4>\n<p>Si un servicio B sufre una degradación temporal de 5 segundos y sus 50 clientes A reintentan inmediatamente hasta 3 veces sin pausa cuando falla una llamada, la carga sobre B se <b>cuadruplica instantáneamente</b> (amplificación de tráfico). Cuando B intenta recuperarse, la avalancha de reintentos lo vuelve a tumbar: es una <b>tormenta de reintentos (Retry Storm)</b>.</p>\n\n<h4>Defensas obligatorias entre microservicios</h4>\n<table class=\"keytable\">\n<tr><th>Patrón</th><th>Cómo funciona</th><th>Cuándo actúa</th></tr>\n<tr><td><b>Exponential Backoff + Jitter</b></td><td>Aumenta exponencialmente la espera entre reintentos (1s, 2s, 4s...) y suma un desfase aleatorio (<b>jitter</b>) para desincronizar a los clientes.</td><td>Evita que miles de clientes reintenten exactamente en el mismo milisegundo.</td></tr>\n<tr><td><b>Retry Budget (Presupuesto de reintentos)</b></td><td>Limita los reintentos en el cliente a un máximo (p. ej. 10 % del tráfico total). Si falla todo el servicio, deja de reintentar.</td><td>Impide la amplificación masiva cuando la dependencia está completamente caída.</td></tr>\n<tr><td><b>Circuit Breaker</b></td><td>Abre el circuito en el cliente tras N fallos seguidos y falla rápido localmente durante una ventana antes de probar con una petición (half-open).</td><td>Protege al cliente de bloquear sus hilos esperando timeouts de una dependencia muerta.</td></tr>\n<tr><td><b>Load Shedding (Descarte de carga)</b></td><td>El servidor rechaza proactivamente peticiones con <code>HTTP 503</code> o <code>429</code> cuando su cola interna o latencia supera un umbral, priorizando tráfico crítico.</td><td>Evita que el servidor colapse al 100 % y permite que al menos las peticiones aceptadas terminen a tiempo.</td></tr>\n</table>\n"
  },
  {
    "id": "sre-t-4-1",
    "d": 4,
    "title": "4.1 · Prometheus y Thanos en Producción: Cardinalidad, PromQL y Compactación",
    "html": "\n<h4>El enemigo #1 de una TSDB: Explosión de Cardinalidad</h4>\n<p>En Prometheus, Thanos y Datadog, <b>cada combinación única de nombre de métrica + etiquetas (labels) crea una serie temporal independiente en RAM y en el índice</b>. Añadir una etiqueta con valores no acotados como <code>user_id</code>, <code>email</code>, <code>request_id</code>, <code>trace_id</code> o <code>ip_origen</code> multiplica las series por millones, causando <b>OOM en Prometheus</b> y consultas lentísimas.</p>\n<ul>\n<li><b>Regla:</b> Las etiquetas de métricas solo deben contener conjuntos finitos y pequeños (código de estado, método HTTP, nombre de servicio, zona). Los identificadores de alta cardinalidad pertenecen a los <b>logs</b> o a los <b>exemplars / trazas</b>.</li>\n<li><b>Diagnóstico rápido:</b> Consultar el endpoint <code>/api/v1/status/tsdb</code> de Prometheus o la interfaz de <i>TSDB Status</i> para identificar qué métrica y qué etiqueta concentran más series, y aplicar <code>metric_relabel_configs</code> con <code>action: labeldrop</code> mientras se corrige el código.</li>\n</ul>\n\n<h4>Trampas clásicas de PromQL en guardia</h4>\n<table class=\"keytable\">\n<tr><th>Consulta / Error</th><th>Por qué falla</th><th>Forma correcta</th></tr>\n<tr><td><code>rate(http_requests_total[30s])</code> con <code>scrape_interval: 30s</code></td><td><code>rate()</code> necesita <b>al menos 2 muestras</b> dentro de la ventana para calcular la pendiente. Con ventana igual al intervalo de scrape, a menudo encuentra solo 1 muestra y devuelve vacío.</td><td>Usar siempre una ventana de al menos <b>4× el <code>scrape_interval</code></b> (p. ej. <code>[2m]</code> o <code>[5m]</code>).</td></tr>\n<tr><td>Promediar percentiles: <code>avg(http_latency_p99)</code></td><td>Promediar percentiles entre instancias con distinto volumen de tráfico es matemáticamente inválido y oculta los nodos con más tráfico y peor latencia.</td><td>Exponer histogramas (<code>_bucket</code>) y agregar primero las tasas por bucket: <code>histogram_quantile(0.99, sum by (le) (rate(http_duration_seconds_bucket[5m])))</code>.</td></tr>\n</table>\n\n<h4>Arquitectura de Thanos</h4>\n<ul>\n<li><b>Thanos Sidecar / Receive</b>: Sube bloques TSDB de 2 horas a Object Storage y expone datos recientes en tiempo real por gRPC (StoreAPI).</li>\n<li><b>Thanos Store Gateway</b>: Consulta bloques históricos directamente desde el bucket de Object Storage (usa caché de índices en disco/memoria).</li>\n<li><b>Thanos Querier</b>: Deduplica series provenientes de pares de Prometheus en alta disponibilidad (usando las etiquetas de réplica como <code>replica=\"a\"</code> / <code>replica=\"b\"</code>) y unifica tiempo real + histórico.</li>\n<li><b>Thanos Compactor</b>: Componente <b>singleton</b> (nunca debe haber dos instancias corriendo sobre el mismo bucket a la vez) que compacta bloques y genera resoluciones de <i>downsampling</i> (5m y 1h).</li>\n</ul>\n"
  },
  {
    "id": "sre-t-5-1",
    "d": 5,
    "title": "5.1 · Bases de Datos, Connection Pooling, Caché Stampede y DRP (RPO/RTO)",
    "html": "\n<h4>Agotamiento de conexiones en Bases de Datos (Connection Exhaustion)</h4>\n<p>Cuando un clúster de Kubernetes escala de 20 a 150 pods durante un pico de tráfico y cada pod abre un pool de 20 conexiones a PostgreSQL/MySQL, la base de datos recibe 3.000 conexiones simultáneas. Supera <code>max_connections</code>, rechaza nuevas conexiones (<code>FATAL: sorry, too many clients already</code>) y consume toda su CPU/RAM cambiando de contexto entre procesos.</p>\n<ul>\n<li><b>Mitigación correcta:</b> Colocar un pooler transaccional como <b>PgBouncer</b> (en <code>pool_mode = transaction</code>) o ProxySQL delante de la base de datos, y dimensionar el pool de cada pod de forma conservadora.</li>\n</ul>\n\n<h4>Cache Stampede (Thundering Herd) en Redis</h4>\n<p>Si una clave muy consultada (p. ej. el catálogo de portada con 5.000 RPS) expira en Redis en el instante $T$, los 5.000 hilos concurrentes ven un <i>cache miss</i> simultáneo y lanzan la misma consulta pesada contra la base de datos a la vez, tumbándola.</p>\n<ul>\n<li><b>Mitigaciones:</b>\n  <ol>\n    <li><b>Singleflight / Request Coalescing (Mutex lock):</b> Solo 1 petición calcula el valor en la DB mientras las demás esperan ese mismo resultado o devuelven el valor ligeramente antiguo (<i>stale-while-revalidate</i>).</li>\n    <li><b>Jitter en el TTL:</b> Si cargas miles de claves en lote, añade un valor aleatorio al TTL (p. ej. 3600s ± 300s) para que no expiren todas en el mismo segundo.</li>\n  </ol>\n</li>\n</ul>\n\n<h4>DRP en Producción: RPO vs. RTO y Replicación</h4>\n<table class=\"keytable\">\n<tr><th>Métrica / Modo</th><th>Qué significa en un desastre</th><th>Impacto arquitectónico</th></tr>\n<tr><td><b>RPO (Recovery Point Objective)</b></td><td>Cuántos <b>datos (medidos en tiempo hacia atrás)</b> podemos permitirnos perder como máximo (p. ej. RPO = 5 min).</td><td>Depende de la frecuencia de backup o del lag de replicación entre sitios. RPO = 0 exige replicación síncrona.</td></tr>\n<tr><td><b>RTO (Recovery Time Objective)</b></td><td>Cuánto <b>tiempo de indisponibilidad</b> tardamos en volver a operar tras declarar el desastre (p. ej. RTO = 15 min).</td><td>Depende de la automatización del failover (DNS, promoción de réplica, escalado de capacidad en el sitio secundario).</td></tr>\n</table>\n<div class=\"tip\"><b>Cuidado en un failover de DRP:</b> Si haces failover automático a una réplica asíncrona que tenía 40 segundos de retraso de replicación, perderás esos 40 segundos de transacciones confirmadas, y si el antiguo primario vuelve a la vida creyendo que sigue siendo líder, tendrás <b>Split-Brain</b>. Usa siempre STONITH / fencing y verifica el lag antes de promover.</div>\n"
  },
  {
    "id": "sre-t-6-1",
    "d": 6,
    "title": "6.1 · DNS, Certificados TLS, Terraform State Drift y GitOps con ArgoCD",
    "html": "\n<h4>Por qué el tráfico sigue llegando al datacenter viejo después de cambiar el DNS</h4>\n<p>Durante un DRP o cambio de balanceador vía DNS, reducir el TTL 5 minutos antes del cambio no sirve si el TTL anterior era de <code>86400</code> (24 horas): los resolvers recursivos seguirán sirviendo el registro cacheado hasta que venza el TTL antiguo. Además, muchos clientes HTTP (Java JVM por defecto en configuraciones antiguas, pools de conexiones HTTP/1.1 keep-alive y HTTP/2) <b>resuelven el DNS una sola vez al abrir el socket y reutilizan la conexión TCP indefinidamente</b> sin volver a consultar el DNS hasta que el servidor cierra activamente las conexiones o expira <code>maxConnectionAge</code>.</p>\n\n<h4>Incidentes de Certificados TLS en Producción</h4>\n<ul>\n<li><b>Funciona en Chrome de escritorio, pero falla en clientes backend (cURL, Python, Java, Android) con <code>unable to get local issuer certificate</code>:</b> El servidor solo está enviando el certificado hoja (leaf certificate) y olvidó incluir la <b>cadena de certificados intermedios (fullchain)</b>. Los navegadores descargan el intermedio por su cuenta (AIA fetching), pero los clientes de API y SDKs no lo hacen.</li>\n</ul>\n\n<h4>GitOps (ArgoCD) y Terraform durante un Incidente</h4>\n<table class=\"keytable\">\n<tr><th>Situación en guardia</th><th>Qué ocurre si actúas mal</th><th>Procedimiento SRE correcto</th></tr>\n<tr><td>Aplicas un cambio urgente con <code>kubectl edit deployment</code> en un clúster gestionado por <b>ArgoCD con <code>selfHeal: true</code></b>.</td><td>En pocos segundos, ArgoCD detecta la deriva respecto a Git y <b>revierte automáticamente tu mitigación</b> de vuelta al estado roto.</td><td>Hacer el cambio mediante commit/revert en el repositorio GitOps (o deshabilitar temporalmente el <code>auto-sync</code> en ArgoCD mientras se mitiga y luego reflejarlo en Git).</td></tr>\n<tr><td>Un compañero borró o modificó manualmente un recurso en la nube y quieres arreglar otra cosa con <b>Terraform</b>.</td><td>Ejecutar <code>terraform apply -auto-approve</code> sin leer el plan puede destruir o recrear recursos críticos para forzar la convergencia.</td><td>Inspeccionar siempre <code>terraform plan</code>, usar <code>terraform state</code> / <code>import</code> o bloques <code>moved</code>/<code>import</code> para reconciliar el estado sin destruir infraestructura viva.</td></tr>\n</table>\n"
  }
],
    questions: [
  {
    "id": "sre-01",
    "d": 1,
    "t": "Respuesta a incidentes",
    "q": "Son las 03:15 AM. PagerDuty dispara una alerta P1: la tasa de errores 5xx en la API de pagos subió del 0.05 % al 18 % hace 6 minutos. En la línea de tiempo ves que a las 03:08 AM se desplegó la versión v2.14.0 del servicio de pagos. El desarrollador de guardia dice que cree saber qué línea de código falla y pide 25 minutos para preparar un fix y pasarlo por CI/CD. Como Incident Commander, ¿qué decisión tomas?",
    "o": [
      "Ordenar el rollback inmediato a la versión anterior estable (v2.13.x) para cortar el sangrado de errores y depurar el código después sin impacto al usuario.",
      "Darle los 25 minutos al desarrollador para que suba el fix hacia adelante (roll-forward) y evitar hacer dos despliegues.",
      "Escalar verticalmente los nodos de la base de datos de pagos mientras el desarrollador programa el parche.",
      "Silenciar la alerta en PagerDuty durante 30 minutos para que el equipo trabaje sin presión."
    ],
    "a": 0,
    "e": "En gestión de incidentes SRE, la prioridad absoluta es minimizar el MTTR mitigando el impacto al usuario de inmediato. Cuando un cambio recién desplegado correlaciona directamente con el inicio del incidente y el rollback es seguro, revertir restaura el servicio en minutos; investigar y compilar un fix en caliente prolonga innecesariamente la caída."
  },
  {
    "id": "sre-02",
    "d": 1,
    "t": "SLIs y Latencia",
    "q": "Los clientes VIP reportan lentitud extrema y timeouts al confirmar pedidos, pero el dashboard ejecutivo muestra que el \"Tiempo de respuesta promedio (avg)\" de la API se mantiene estable en 180 ms. ¿Qué métrica debes revisar e incorporar como SLI para capturar este problema real?",
    "o": [
      "Los percentiles de cola (p95, p99 y p99.9) calculados a partir de histogramas de duración de peticiones.",
      "El promedio móvil de uso de CPU de todos los nodos del clúster durante las últimas 24 horas.",
      "La mediana (p50) del tiempo de respuesta HTTP agregada por hora.",
      "El número total de peticiones exitosas acumuladas desde principios de mes."
    ],
    "a": 0,
    "e": "La media aritmética oculta los valores extremos (outliers): si el 97 % de las peticiones tardan 50 ms y el 3 % sufren timeouts de 10 segundos, el promedio sigue pareciendo saludable (~348 ms), pero miles de usuarios están sufriendo fallos. Los percentiles de cola (p95, p99) exponen exactamente la experiencia de los usuarios más afectados."
  },
  {
    "id": "sre-03",
    "d": 1,
    "t": "Alertas y Burn Rate",
    "q": "Tu servicio tiene un SLO de disponibilidad del 99.9 % mensual (presupuesto de error de 43.2 minutos en 30 días). Quieres configurar una alerta P1 que despierte al ingeniero de guardia solo cuando el ritmo de fallos amenace seriamente el presupuesto, y que deje de sonar apenas se mitigue el incidente. Según el Google SRE Workbook, ¿qué estrategia es la recomendada?",
    "o": [
      "Alerta multi-ventana y multi-burn-rate: exigir simultáneamente (AND) que el burn rate supere 14.4x tanto en la última 1 hora como en los últimos 5 minutos.",
      "Alertar cada vez que la tasa de error supere el 0.1 % durante una única ventana de 1 minuto.",
      "Alertar únicamente cuando ya se haya consumido el 100 % del presupuesto de error mensual.",
      "Usar una única ventana móvil de 6 horas con burn rate > 6x sin ventana corta de confirmación."
    ],
    "a": 0,
    "e": "El esquema multi-window multi-burn-rate combina una ventana larga (1h a 14.4x = consume el 2 % del presupuesto mensual) para asegurar que el incidente es significativo y no un hipo fugaz, con una ventana corta (5m a 14.4x) mediante AND para que la alerta se resuelva en pocos minutos en cuanto el incidente se corrige."
  },
  {
    "id": "sre-04",
    "d": 1,
    "t": "Comando de Incidentes",
    "q": "Durante un incidente mayor (SEV-1) con 12 ingenieros en la llamada, tres personas empiezan a ejecutar cambios simultáneos en distintos componentes de producción sin avisar, empeorando el diagnóstico. Como Incident Commander (IC), ¿cuál es tu responsabilidad inmediata?",
    "o": [
      "Establecer control explícito del canal: prohibir cambios no anunciados, centralizar toda acción en producción a través del Ops Lead previa autorización del IC, y asignar un Scribe para registrar cada paso.",
      "Abrir tú mismo tres terminales SSH para revertir manualmente lo que están haciendo los otros ingenieros sin decir nada.",
      "Expulsar a todos de la llamada y quedarte solo depurando el problema desde cero.",
      "Redactar el documento de postmortem completo antes de permitir que alguien toque producción."
    ],
    "a": 0,
    "e": "El Incident Commander coordina y mantiene una única fuente de verdad operativa. Cuando hay \"freelancing\" (ingenieros aplicando cambios por su cuenta), se contamina el estado del sistema y es imposible saber qué cambio causó qué efecto. Todas las acciones sobre producción deben anunciarse y aprobarse por el IC."
  },
  {
    "id": "sre-05",
    "d": 1,
    "t": "Postmortems sin culpa",
    "q": "Un ingeniero ejecutó un script de mantenimiento en la terminal equivocada y borró una tabla en producción porque los entornos de staging y producción compartían credenciales y el prompt de la consola era idéntico. En la reunión de postmortem, un gerente propone amonestar al ingeniero y cerrar el caso como \"error humano\". ¿Cuál es el enfoque correcto de un Blameless Postmortem?",
    "o": [
      "Tratar el error humano como el punto de partida de la investigación (no la causa raíz) y definir acciones correctivas de sistema: separar credenciales, exigir confirmación automática/IAM y colorear los prompts por entorno.",
      "Aceptar \"error humano\" como causa raíz y enviar un correo recordando a todo el equipo que \"tengan más cuidado la próxima vez\".",
      "Revocar el acceso de todos los ingenieros a todos los entornos, incluido desarrollo, de forma permanente.",
      "Ocultar el incidente en el informe mensual para no afectar las métricas del equipo."
    ],
    "a": 0,
    "e": "En la cultura SRE sin culpa (Blameless Postmortem), culpar a la persona o pedir \"tener más cuidado\" no previene que otro ingeniero caiga en la misma trampa mañana. La verdadera causa raíz es sistémica: ausencia de barreras técnicas (credenciales compartidas, falta de guardrails y prompts indistinguibles)."
  },
  {
    "id": "sre-06",
    "d": 1,
    "t": "Método USE vs RED",
    "q": "Un nodo bare-metal de base de datos presenta caídas de rendimiento intermitentes. El uso promedio de CPU es del 45 % y el uso de memoria es del 60 %, pero las consultas de disco tardan 10 veces más de lo normal. Aplicando el método USE (Utilization, Saturation, Errors), ¿qué dimensión e indicador te dará la pista definitiva?",
    "o": [
      "Saturación (Saturation) y Errores de dispositivo: revisar la longitud de la cola de E/S de disco (aqu-sz / await en iostat) y errores SMART/dmesg del controlador de almacenamiento.",
      "Únicamente la Utilización promedio de CPU en ventanas de 1 hora.",
      "La tasa de peticiones HTTP 404 en el frontend web.",
      "El número de líneas de código desplegadas en la última semana."
    ],
    "a": 0,
    "e": "El método USE de Brendan Gregg evalúa cada recurso físico por Utilización, Saturación (longitud de cola / tiempo esperando turno) y Errores. Un disco o array RAID con fallos de hardware o saturación de IOPS puede mostrar baja utilización de CPU pero una cola de espera (saturation) altísima y errores en el bus."
  },
  {
    "id": "sre-07",
    "d": 1,
    "t": "Política de Error Budget",
    "q": "Un microservicio crítico de checkout lleva 3 semanas consecutivas de incidentes y ha consumido el 115 % de su Error Budget mensual (su disponibilidad cayó al 99.78 % frente a un SLO del 99.9 %). El equipo de producto presiona para lanzar mañana una funcionalidad experimental grande. Según la política estándar de Error Budget en SRE, ¿qué debe ocurrir?",
    "o": [
      "Congelar los lanzamientos de nuevas funcionalidades (salvo parches de seguridad y correcciones de fiabilidad) y dedicar la capacidad de ingeniería a estabilizar el servicio hasta recuperar el presupuesto.",
      "Bajar inmediatamente el SLO del 99.9 % al 99.0 % a mitad de mes para que el indicador vuelva a ponerse en verde y lanzar la funcionalidad.",
      "Lanzar la funcionalidad experimental el viernes por la tarde sin pruebas adicionales para compensar el retraso.",
      "Borrar el historial de métricas del mes en Prometheus para reiniciar el contador de errores."
    ],
    "a": 0,
    "e": "El Error Budget convierte la tensión entre producto y operaciones en una regla objetiva acordada de antemano: mientras quede presupuesto, el equipo puede asumir riesgos y desplegar rápido; cuando el presupuesto se agota, se priorizan tareas de fiabilidad, resiliencia y postmortems antes de introducir más cambios riesgosos."
  },
  {
    "id": "sre-08",
    "d": 1,
    "t": "Diseño de alertas",
    "q": "El equipo de guardia recibe 90 alertas por noche de tipo \"CPU > 80 % durante 2 minutos en pod X\", pero ninguna de ellas coincide con degradación real para los usuarios. Cuando ocurre una caída real a las 04:00 AM, el ingeniero de guardia ignora la alerta pensando que es otro falso positivo. ¿Qué dos medidas de ingeniería SRE corrigen esta fatiga de alertas? (Elige 2 respuestas)",
    "o": [
      "Cambiar las alertas que despiertan a guardia (pages) para que se basen en síntomas visibles al usuario (SLIs de tasa de error y latencia / burn rate) en lugar de métricas de causa aisladas.",
      "Convertir las alertas de recursos sin impacto inmediato (como uso de CPU puntual en un pod autoescalable) en registros informativos o tickets de revisión diurna, eliminándolas de PagerDuty.",
      "Configurar un filtro en el teléfono del ingeniero para silenciar todas las notificaciones de PagerDuty permanentemente.",
      "Duplicar el número de alertas enviando un SMS por cada contenedor que supere el 50 % de CPU."
    ],
    "a": [
      0,
      1
    ],
    "e": "Para erradicar la fatiga de alertas, toda alerta que interrumpa el sueño (page) debe ser accionable, urgente y reflejar impacto real en el usuario (síntomas / SLO burn rate). Las señales de utilización de recursos que el sistema maneja solo (como un pod con CPU alta en un HPA) no deben despertar a un humano."
  },
  {
    "id": "sre-09",
    "d": 1,
    "t": "Comunicación en incidentes",
    "q": "Llevas 25 minutos gestionando una caída parcial del sistema de transferencias bancarias. Todavía no habéis confirmado la causa exacta, aunque ya estáis drenando tráfico hacia el sitio de contingencia. El acuerdo de gestión de incidentes exige actualizaciones cada 20 minutos. ¿Qué debe hacer el Communications Lead?",
    "o": [
      "Publicar puntualmente la actualización indicando el impacto conocido, las acciones de mitigación en curso (drenado a contingencia) y la hora exacta del próximo reporte, aunque aún no se conozca la causa raíz.",
      "Retrasar cualquier comunicación hasta que el incidente esté 100 % resuelto y se tenga el análisis forense definitivo.",
      "Publicar una especulación no verificada culpando al proveedor de red externo para calmar a los directivos.",
      "Cerrar el canal de comunicación para que nadie pregunte."
    ],
    "a": 0,
    "e": "En un incidente activo, el silencio genera incertidumbre y hace que ejecutivos y soporte interrumpan al equipo técnico buscando respuestas. Comunicar a tiempo qué se sabe, qué se está haciendo para mitigar y cuándo será el siguiente aviso mantiene la confianza sin necesidad de inventar una causa raíz prematura."
  },
  {
    "id": "sre-10",
    "d": 1,
    "t": "Toil y Automatización",
    "q": "Cada vez que un usuario de backoffice bloquea su cuenta en producción, un ingeniero SRE debe conectarse por VPN, abrir Rundeck o una consola SQL, verificar dos tablas y ejecutar un UPDATE manual. Esto ocurre 35 veces al día y consume 3 horas diarias del equipo. ¿Cómo clasifica SRE este trabajo y cuál es el objetivo?",
    "o": [
      "Es Toil (trabajo operativo manual, repetitivo, sin valor duradero y automatizable); debe automatizarse mediante un flujo self-service o API con auditoría para mantener el toil por debajo del 50 %.",
      "Es ingeniería estratégica de alto valor; debe asignarse a los arquitectos más senior de forma permanente.",
      "Es parte inevitable del presupuesto de error (Error Budget) y no se debe automatizar.",
      "Debe resolverse compartiendo la contraseña de root de la base de datos de producción con todos los usuarios finales."
    ],
    "a": 0,
    "e": "Google SRE define como Toil toda tarea manual, repetitiva, automatizable, táctica, sin valor duradero y que crece linealmente con el tráfico o usuarios. Eliminarlo mediante automatización segura y autoservicio libera tiempo para ingeniería real que mejora la plataforma."
  },
  {
    "id": "sre-11",
    "d": 2,
    "t": "OOMKilled vs Límites JVM/Go",
    "q": "Un microservicio en Java desplegado en Kubernetes se reinicia cada 20 minutos con estado `OOMKilled` (Exit Code 137). El manifiesto del Pod tiene `resources.requests.memory: 1Gi` y `resources.limits.memory: 2Gi`, y el contenedor arranca con `-Xmx2048m`. ¿Por qué el kernel mata el contenedor si el heap máximo se fijó en 2048 MB?",
    "o": [
      "Porque una JVM consume memoria adicional fuera del Heap (Metaspace, pilas de hilos, buffers directos NIO, GC y libc); con `-Xmx2048m` el proceso supera fácilmente los 2 GiB del cgroup. Hay que limitar el heap al ~70–75 % del límite (`-XX:MaxRAMPercentage=75.0`) o subir `limits.memory`.",
      "Porque el Exit Code 137 significa que falló la resolución DNS de CoreDNS, no la memoria.",
      "Porque Kubernetes suma `requests.memory` y `limits.memory` y mata el pod cuando llega a 1 GiB.",
      "Porque falta configurar `limits.cpu` al doble de la memoria."
    ],
    "a": 0,
    "e": "El límite de memoria de Kubernetes (`limits.memory`) se aplica al cgroup completo del contenedor (RSS + caché no reclamable). En Java (o Go/Node), el proceso usa Heap + Metaspace + Thread Stacks + Off-Heap/Direct Buffers + memoria nativa. Si el Heap por sí solo es igual a `limits.memory`, en cuanto alcance su tope el proceso total rebasará el cgroup y el OOM Killer de Linux enviará SIGKILL (128 + 9 = 137)."
  },
  {
    "id": "sre-12",
    "d": 2,
    "t": "CPU CFS Throttling",
    "q": "Una API en Go dentro de Kubernetes muestra picos de latencia p99 de 1.8 segundos, aunque el promedio de uso de CPU del contenedor es de solo 350m sobre un `limits.cpu: 1000m`. En Prometheus observas que `rate(container_cpu_cfs_throttled_periods_total[5m]) / rate(container_cpu_cfs_periods_total[5m])` supera el 65 %. ¿Qué está ocurriendo y cómo lo mitigas?",
    "o": [
      "El contenedor sufre CPU CFS Throttling: sus múltiples goroutines consumen la cuota de 100 ms en los primeros milisegundos de cada ventana cuando llega una ráfaga y el kernel congela el contenedor el resto del ciclo. Se mitiga aumentando o eliminando `limits.cpu` (manteniendo un `requests.cpu` bien dimensionado).",
      "El contenedor tiene una fuga de memoria y está haciendo swap a disco; hay que reducir `requests.cpu` a 50m.",
      "El nodo tiene el disco lleno; hay que borrar los logs de `/var/log/pods`.",
      "El scheduler de Kubernetes está moviendo el pod de nodo cada 100 milisegundos."
    ],
    "a": 0,
    "e": "El kernel Linux aplica `limits.cpu` mediante cuotas CFS en periodos de 100 ms. Un servicio con 8 hilos concurrentes que atiende una ráfaga consume 100 ms de tiempo de CPU acumulado en solo 12.5 ms de reloj real (8 × 12.5 ms = 100 ms) y queda congelado los otros 87.5 ms del ciclo, arruinando el p99 aunque el uso medio parezca bajo."
  },
  {
    "id": "sre-13",
    "d": 2,
    "t": "Liveness vs Readiness Probes",
    "q": "Durante un mantenimiento de 15 segundos en el clúster de Redis, los 80 pods de tu API principal entran simultáneamente en `CrashLoopBackOff`, provocando una caída total de 12 minutos incluso después de que Redis ya volvió a estar sano. Al revisar el Deployment ves que `livenessProbe` llama a `/healthz`, y ese endpoint hace un `PING` a Redis y un `SELECT 1` a PostgreSQL. ¿Cuál fue el error de diseño?",
    "o": [
      "Conectar la `livenessProbe` a dependencias externas: un fallo transitorio de Redis hizo que kubelet matara y reiniciara todos los pods a la vez. La `livenessProbe` solo debe verificar que el proceso local no esté colgado; las dependencias externas (si acaso) van en `readinessProbe`.",
      "Usar un timeout de `livenessProbe` mayor de 1 segundo; si se baja a 100 ms con `failureThreshold: 1`, los pods se recuperan sin caer.",
      "No haber configurado `restartPolicy: Never` en el Deployment de la API.",
      "Que Kubernetes no soporta más de 50 pods con sondas HTTP en un mismo namespace."
    ],
    "a": 0,
    "e": "Si una `livenessProbe` verifica dependencias externas (bases de datos, cachés, otros microservicios), cualquier latencia o corte breve en esa dependencia hará que kubelet mate todos tus pods simultáneamente, desatando una tormenta de arranque en frío y reconexiones. La `livenessProbe` solo debe comprobar la salud interna del propio proceso."
  },
  {
    "id": "sre-14",
    "d": 2,
    "t": "Errores 502 en Rolling Updates",
    "q": "Cada vez que despliegas una nueva versión de un microservicio detrás de Ingress NGINX, durante unos 15 segundos se registra un pico de errores `502 Bad Gateway` en las peticiones de los clientes, a pesar de que los nuevos pods pasan su `readinessProbe` antes de que se terminen los antiguos. ¿Por qué ocurre esto y cómo se logra un despliegue realmente Zero-Downtime?",
    "o": [
      "Al borrar un pod antiguo, la retirada del Endpoint en Ingress NGINX y el envío de SIGTERM al contenedor ocurren en paralelo; si la app cierra el puerto de inmediato al recibir SIGTERM, NGINX sigue enviándole tráfico durante unos segundos. Se soluciona con un hook `preStop: sleep 5..10` y apagado ordenado (Graceful Shutdown) en la app.",
      "Porque `RollingUpdate` apaga primero el 100 % de los pods viejos antes de crear el primero nuevo; hay que cambiar a estrategia `Recreate`.",
      "Porque Ingress NGINX reinicia todos los nodos worker de Kubernetes cada vez que cambia un Deployment.",
      "Porque las sondas `readinessProbe` solo funcionan si el Service es de tipo `NodePort`."
    ],
    "a": 0,
    "e": "En Kubernetes, cuando un Pod pasa a estado `Terminating`, el kubelet lanza `preStop` / `SIGTERM` al mismo tiempo que el EndpointSlice controller notifica a `kube-proxy` y al Ingress Controller. Como esa propagación por la red es asíncrona, añadir un pequeño `preStop` (`sleep 5` o `10`) permite que el pod deje de estar en el balanceador antes de dejar de aceptar conexiones TCP."
  },
  {
    "id": "sre-15",
    "d": 2,
    "t": "CoreDNS y ndots:5",
    "q": "Tus pods en Kubernetes hacen miles de llamadas por segundo a APIs externas como `api.mercadopago.com` y `hooks.slack.com`. Durante las horas punta, observas latencias de resolución DNS de hasta 5 segundos, CPU al 100 % en los pods de CoreDNS y mensajes `nf_conntrack: table full, dropping packet` en los nodos. ¿Qué mecanismo por defecto de Kubernetes multiplica por 5 las consultas DNS externas y cómo se mitiga?",
    "o": [
      "La opción `ndots:5` en `/etc/resolv.conf`: como `api.mercadopago.com` tiene solo 2 puntos (< 5), el resolver prueba antes los 4 dominios de búsqueda internos (`.namespace.svc.cluster.local`, etc.) en IPv4 e IPv6. Se mitiga desplegando `NodeLocal DNSCache`, bajando `ndots` a 2 en `dnsConfig` o añadiendo un punto final al FQDN.",
      "El kubelet borra la caché ARP de los nodos cada 100 milisegundos; se mitiga desactivando CoreDNS.",
      "Los Services `ClusterIP` hacen broadcast UDP a internet por cada petición HTTP.",
      "Kubernetes cifra todas las consultas DNS con RSA-4096 por defecto entre pod y CoreDNS."
    ],
    "a": 0,
    "e": "Con `ndots:5` (el valor por defecto en Kubernetes), cualquier nombre con menos de 5 puntos se trata primero como nombre relativo y se concatena con cada entrada `search` de `/etc/resolv.conf`, generando 8 paquetes DNS inútiles antes de consultar el nombre absoluto. `NodeLocal DNSCache` (con conexiones TCP hacia CoreDNS) o ajustar `ndots: 2` reduce drásticamente las consultas y las entradas `conntrack` UDP."
  },
  {
    "id": "sre-16",
    "d": 2,
    "t": "PodDisruptionBudget y Drenado de Nodos",
    "q": "Intentas actualizar la versión de Kubernetes de tus nodos worker. El comando `kubectl drain node-04 --ignore-daemonsets --delete-emptydir-data` lleva 40 minutos bloqueado reintentando expulsar el pod `ordenes-api-7f8b9-x2k` con el mensaje: `error when evicting pods: Cannot evict pod as it would violate the pod's disruption budget`. ¿Qué debes verificar?",
    "o": [
      "Revisar `kubectl get pdb`: es probable que el `PodDisruptionBudget` exija `minAvailable: 100%` (o `maxUnavailable: 0`), o que las otras réplicas del Deployment no estén `Ready`, dejando `ALLOWED DISRUPTIONS = 0`.",
      "Ejecutar `rm -rf /var/lib/kubelet` directamente por SSH en el nodo mientras sigue en producción sin drenar.",
      "Reiniciar el API Server de Kubernetes porque la API de Eviction solo funciona los fines de semana.",
      "Borrar el namespace `kube-system` para desbloquear el drenado."
    ],
    "a": 0,
    "e": "La API de Eviction respeta los `PodDisruptionBudgets` (PDB). Si un PDB se configuró erróneamente con `maxUnavailable: 0` (o `minAvailable` igual al número actual de réplicas sanas), `ALLOWED DISRUPTIONS` será `0` y `kubectl drain` nunca podrá desalojar ningún pod de ese servicio hasta que haya más réplicas `Ready` o se ajuste el PDB."
  },
  {
    "id": "sre-17",
    "d": 2,
    "t": "Pods en Pending y Afinidad de Volumen",
    "q": "Tras la caída de un nodo en la zona de disponibilidad `us-east-1a`, un pod con estado (que monta un `PersistentVolume` respaldado por un disco EBS gp3 zonal) se queda permanentemente en estado `Pending`. Al ejecutar `kubectl describe pod`, ves el evento: `0/12 nodes are available: 4 node(s) had volume node affinity conflict, 8 node(s) Insufficient cpu`. ¿Qué significa exactamente este diagnóstico?",
    "o": [
      "El volumen EBS está atado físicamente a `us-east-1a` (por eso los 4 nodos de otras zonas dan conflicto de afinidad de volumen), y en los 8 nodos que sí están en `us-east-1a` no queda CPU libre suficiente para cubrir el `requests.cpu` del pod.",
      "El disco EBS se corrompió y fue eliminado automáticamente por AWS.",
      "El contenedor tiene un error de sintaxis en su `Dockerfile` que impide que el scheduler lo asigne.",
      "El `limits.memory` del pod supera la memoria total sumada de los 12 nodos."
    ],
    "a": 0,
    "e": "El mensaje de `FailedScheduling` desglosa por qué se descartó cada uno de los 12 nodos del clúster: los discos en bloque zonales (EBS, GCP Zonal PD, Azure Managed Disk LRS) solo pueden montarse en nodos de su misma zona de disponibilidad (4 nodos descartados por estar en otra AZ), y los 8 nodos restantes de esa misma AZ no tienen capacidad libre para el `requests.cpu` solicitado."
  },
  {
    "id": "sre-18",
    "d": 2,
    "t": "HPA y Startup lento",
    "q": "Durante una campaña comercial, el tráfico sube un 300 %. El `HorizontalPodAutoscaler` (HPA) detecta CPU al 95 % y escala tu Deployment de 10 a 40 réplicas. Sin embargo, los nuevos pods tardan 90 segundos en inicializar cachés al arrancar, y durante ese arranque su CPU se pone al 100 %, haciendo que el HPA escale descontroladamente hasta el máximo de 100 réplicas antes de que los primeros estén listos, mientras `livenessProbe` empieza a matarlos a los 45 segundos. ¿Qué dos ajustes solucionan ambos problemas? (Elige 2 respuestas)",
    "o": [
      "Configurar una `startupProbe` con margen suficiente (p. ej. hasta 120s) para proteger el arranque lento sin que `livenessProbe` reinicie los pods antes de que terminen de inicializar.",
      "Ajustar la ventana de estabilización y políticas de escalado (`behavior.scaleUp`) del HPA y/o reducir el trabajo pesado síncrono en el arranque para no engañar al HPA con el pico de CPU de inicialización.",
      "Eliminar todas las sondas (`startupProbe`, `readinessProbe` y `livenessProbe`) para que reciban tráfico en el segundo 0 aunque no hayan arrancado.",
      "Fijar `minReplicas` y `maxReplicas` en 1 para desactivar el escalado en producción."
    ],
    "a": [
      0,
      1
    ],
    "e": "La `startupProbe` está diseñada específicamente para contenedores con inicialización lenta: mientras no tenga éxito, bloquea la ejecución de `livenessProbe` evitando muertes prematuras. Y configurar `behavior.scaleUp` en HPA v2 junto con optimizar el calentamiento evita el sobre-escalado reactivo causado por el consumo de CPU durante el bootstrap."
  },
  {
    "id": "sre-19",
    "d": 2,
    "t": "NetworkPolicies y Conectividad",
    "q": "Un equipo despliega por primera vez una `NetworkPolicy` en el namespace `pagos` para permitir que solo el servicio `checkout` pueda conectarse al puerto `8080` de `pagos-api` (política de tipo `Ingress`). Inmediatamente después, `pagos-api` sigue recibiendo peticiones de `checkout`, pero deja de poder conectarse a la base de datos RDS externa y deja de resolver nombres en CoreDNS. ¿Qué habría pasado si la política incluyera también `policyTypes: [\"Ingress\", \"Egress\"]` con `egress: []`?",
    "o": [
      "Al incluir `\"Egress\"` en `policyTypes` sin reglas de salida permitidas, se bloquea todo el tráfico saliente del pod (default deny egress), incluido el puerto 53 UDP/TCP hacia `kube-dns`/CoreDNS y el puerto de la base de datos. Hay que añadir reglas `egress` explícitas para DNS (53) y para el destino RDS.",
      "Las `NetworkPolicies` borran automáticamente las tablas de rutas del VPC de la nube.",
      "En Kubernetes, activar una `NetworkPolicy` de `Ingress` cambia los puertos del contenedor de TCP a SCTP.",
      "Las `NetworkPolicies` solo afectan al tráfico entre clústeres distintos y nunca aplican dentro del mismo clúster."
    ],
    "a": 0,
    "e": "En Kubernetes, en cuanto un Pod es seleccionado por una `NetworkPolicy` que declara `Egress` en `policyTypes`, todo tráfico saliente no autorizado explícitamente queda bloqueado (incluido el tráfico DNS al puerto 53 de `kube-system`). Olvidar permitir la salida a CoreDNS (UDP/TCP 53) es una de las causas más frecuentes de caída tras aplicar políticas Zero-Trust."
  },
  {
    "id": "sre-20",
    "d": 2,
    "t": "Certificados y Secrets en Pods",
    "q": "Actualizaste un `Secret` de Kubernetes que contiene una clave de API rotada. Los pods que montan ese `Secret` como volumen de archivos en `/etc/secrets/api-key` ven el archivo actualizado tras ~1 minuto, pero otro grupo de pods que lo consume mediante variables de entorno (`envFrom` / `valueFrom.secretKeyRef`) sigue usando la clave vieja y dando `401 Unauthorized`. ¿Por qué?",
    "o": [
      "Las variables de entorno de un proceso en Linux se inyectan únicamente al crear el contenedor y nunca se actualizan en caliente; para que tomen el nuevo valor del `Secret` es necesario hacer un rollout restart de los pods (`kubectl rollout restart deployment/...`).",
      "Porque los `Secrets` de Kubernetes solo se actualizan si se reinicia el nodo físico completo.",
      "Porque `envFrom` lee siempre desde GitHub y no desde `etcd`.",
      "Porque las variables de entorno tardan exactamente 24 horas en sincronizarse con el kubelet."
    ],
    "a": 0,
    "e": "Mientras que los `Secrets` y `ConfigMaps` montados como volúmenes (salvo que usen `subPath`) son actualizados periódicamente por el kubelet mediante enlaces simbólicos atómicos, las variables de entorno (`env` / `envFrom`) quedan fijas en la memoria del proceso al arrancar el contenedor. Requieren recrear los pods (`rollout restart` o usar un operador como Reloader)."
  },
  {
    "id": "sre-21",
    "d": 3,
    "t": "Kafka Rebalance Storms",
    "q": "En tu clúster de Kafka en producción, el grupo de consumidores `procesador-facturas` entra en un bucle continuo de rebalanceos (`PreparingRebalance` → `CompletingRebalance`) cada 5 minutos, el `consumer_lag` crece sin parar y se están generando facturas duplicadas. En los logs de los consumidores ves: `CommitFailedException: Offset commit cannot be completed since the consumer is not part of an active group for auto partition assignment; it is likely that the consumer was kicked out of the group`. Cada lote de 500 mensajes hace llamadas a un webservice externo que ahora responde en ~800 ms por mensaje. ¿Qué parámetro se ha superado y cómo lo mitigas?",
    "o": [
      "El procesamiento del lote (500 × 800 ms = 400 s) supera `max.poll.interval.ms` (300 s por defecto), por lo que el broker expulsa al consumidor del grupo antes de que pueda hacer commit. Se mitiga reduciendo `max.poll.records` (p. ej. a 50) y/o aumentando `max.poll.interval.ms`.",
      "Se ha llenado el disco de ZooKeeper; hay que borrar el tópico `__consumer_offsets` en caliente.",
      "El productor tiene configurado `acks=0`; cambiarlo a `acks=all` detiene los rebalanceos del consumidor.",
      "Subir `max.poll.records` de 500 a 5000 para leer diez veces más mensajes por cada `poll()`."
    ],
    "a": 0,
    "e": "Cuando el hilo principal del consumidor tarda más que `max.poll.interval.ms` entre dos llamadas a `poll()`, el Group Coordinator asume que el consumidor se quedó colgado, lo expulsa del grupo y reasigna sus particiones a otro consumidor (que vuelve a leer el mismo lote sin confirmar). Bajar `max.poll.records` hace que cada ciclo de `poll()` sea corto y predecible."
  },
  {
    "id": "sre-22",
    "d": 3,
    "t": "Kafka ISR y Disponibilidad",
    "q": "Un tópico crítico de transacciones en Kafka tiene `replication.factor = 3` y `min.insync.replicas = 3`. Los productores escriben con `acks = all`. A las 11:00 AM, el broker 2 se reinicia para aplicar un parche del kernel. Durante los 3 minutos que el broker 2 está apagado, todos los productores fallan al publicar con `NotEnoughReplicasException`. ¿Por qué ocurrió esto y cuál es la configuración recomendada para alta disponibilidad con durabilidad?",
    "o": [
      "Al exigir `min.insync.replicas = 3` en un tópico con 3 réplicas, la caída de un solo broker deja el ISR en 2 réplicas (< 3) y bloquea todas las escrituras con `acks = all`. Debe configurarse `replication.factor = 3` y `min.insync.replicas = 2`.",
      "Porque `acks = all` obliga a que los consumidores estén conectados al mismo tiempo que el productor; debe cambiarse a `acks = 0`.",
      "Porque Kafka necesita un número par de brokers (2 o 4) para elegir líder de partición.",
      "Porque `min.insync.replicas` controla el número de particiones y no el número de réplicas."
    ],
    "a": 0,
    "e": "Con `replication.factor = 3` y `acks = all`, fijar `min.insync.replicas = 2` garantiza que cada escritura quede confirmada en al menos 2 brokers distintos (cero pérdida de datos si cae un broker), al tiempo que tolera el mantenimiento o caída de 1 de los 3 brokers sin interrumpir las escrituras."
  },
  {
    "id": "sre-23",
    "d": 3,
    "t": "Kafka Connect Poison Pill",
    "q": "Un conector Sink de Kafka Connect que envía eventos a Elasticsearch lleva 20 minutos en estado `FAILED`. Cada vez que lo reinicias por la API REST (`POST /connectors/.../restart`), vuelve a caer a los 2 segundos en el mismo offset porque un productor publicó un JSON con un campo de fecha corrupto que falla al parsearse. Hay 400.000 mensajes legítimos esperando detrás. ¿Cuál es la forma correcta de destrabar la operación sin perder trazabilidad del mensaje corrupto?",
    "o": [
      "Actualizar la configuración del conector con `errors.tolerance = all`, configurar un tópico de Dead Letter Queue (`errors.deadletterqueue.topic.name`) con `errors.deadletterqueue.context.headers.enable = true` y reiniciar la tarea para que desvíe el mensaje inválido a la DLQ y procese los 400.000 restantes.",
      "Eliminar el tópico completo de producción con sus 400.000 mensajes y recrearlo desde cero.",
      "Programar un cronjob que ejecute `restart` cada segundo indefinidamente esperando que el JSON se arregle solo.",
      "Apagar el clúster de Elasticsearch para que el conector ignore el esquema."
    ],
    "a": 0,
    "e": "Un \"poison pill\" bloquea toda la partición (Head-of-Line blocking) si `errors.tolerance` está en `none` (valor por defecto). Habilitar `errors.tolerance = all` junto con una Dead Letter Queue (DLQ) y cabeceras de contexto envía automáticamente el registro defectuoso al tópico DLQ con el motivo exacto del fallo para inspección posterior, destrabando el flujo principal de inmediato."
  },
  {
    "id": "sre-24",
    "d": 3,
    "t": "Hot Partitions y Key Skew",
    "q": "Tu tópico `eventos-inventario` tiene 24 particiones y tu microservicio consumidor tiene 24 pods réplica. Sin embargo, durante el CyberDay ves que 23 pods están al 5 % de CPU con lag 0, mientras que 1 único pod está al 100 % de CPU y acumula 800.000 mensajes de lag en la partición 7. ¿Cuál es la causa y qué debes revisar?",
    "o": [
      "Existe un sesgo de clave de particionado (Hot Partition / Key Skew): el productor está usando como partition key un valor que se repite masivamente (p. ej. `store_id` de la tienda principal o `null` mal serializado como string `\"null\"`), concentrando casi todos los mensajes en la partición 7.",
      "Añadir 24 pods más al Deployment del consumidor solucionará el problema inmediatamente aunque el tópico tenga 24 particiones.",
      "La partición 7 tiene el disco físico roto y por eso recibe más mensajes del productor.",
      "En Kafka solo puede haber 1 consumidor activo por cada grupo de consumidores sin importar cuántas particiones existan."
    ],
    "a": 0,
    "e": "En Kafka, una partición solo puede ser consumida por como máximo un consumidor dentro del mismo Consumer Group (añadir más de 24 pods dejaría los pods extra ociosos). Cuando una sola partición concentra el lag y la carga, es porque la función hash de la clave del mensaje envía la mayoría de los eventos a esa partición. Requiere diseñar una clave más granular (compuesta) o sub-particionar el trabajo."
  },
  {
    "id": "sre-25",
    "d": 3,
    "t": "Tormenta de Reintentos (Retry Storm)",
    "q": "El servicio de catálogo sufrió un corte de red de 10 segundos. Aunque la red ya se recuperó por completo, el servicio sigue caído al 100 % de CPU recibiendo 5 veces su tráfico habitual porque los 40 microservicios clientes y la app móvil están reintentando inmediatamente cada petición fallida sin pausa en un bucle cerrado. ¿Qué combinación de mecanismos evita y corta esta tormenta de reintentos?",
    "o": [
      "Implementar Exponential Backoff con Jitter aleatorio en los clientes, limitar los reintentos mediante un Retry Budget (p. ej. máximo 10 % de reintentos extra), abrir Circuit Breakers y aplicar Load Shedding / Rate Limiting temporal en la entrada del servicio.",
      "Aumentar el número de reintentos inmediatos de 3 a 20 y bajar el timeout del cliente a 50 ms.",
      "Desactivar los balanceadores de carga para que los clientes se conecten por IP directa a un único pod.",
      "Hacer que el servidor espere 60 segundos antes de devolver cualquier error HTTP."
    ],
    "a": 0,
    "e": "Los reintentos inmediatos sincronizados provocan una falla metastásica (amplificación de carga). El Exponential Backoff espacia los intentos, el Jitter desincroniza las oleadas de clientes, el Retry Budget / Circuit Breaker frena los reintentos desde el origen cuando el fallo es generalizado, y el Load Shedding permite al servidor recuperarse descartando el exceso de tráfico."
  },
  {
    "id": "sre-26",
    "d": 3,
    "t": "Idempotencia en Pagos",
    "q": "Durante un pico de latencia, el gateway de pagos procesa correctamente un cargo en la tarjeta del cliente, pero la respuesta HTTP tarda 5.2 segundos y el cliente API corta la conexión a los 5.0 segundos por timeout. Al reintentar automáticamente la petición, se le cobra dos veces al cliente. ¿Cómo se diseña correctamente este flujo para que sea seguro reintentar?",
    "o": [
      "Exigir una clave de idempotencia única por operación (`Idempotency-Key`, generada por el cliente para esa intención de pago) que el servidor almacena atómicamente junto al resultado; si llega un reintento con la misma clave, devuelve el resultado previo sin volver a cobrar.",
      "Prohibir cualquier tipo de timeout en las llamadas de red y dejar los sockets abiertos indefinidamente.",
      "Usar peticiones `HTTP GET` sin parámetros para ejecutar los cobros bancarios.",
      "Confiar en que TCP garantiza que una petición HTTP nunca se ejecutará dos veces si la aplicación reintenta."
    ],
    "a": 0,
    "e": "En sistemas distribuidos, ante un timeout de red el cliente no puede distinguir si la petición falló antes de llegar al servidor o si se ejecutó con éxito y se perdió la respuesta. La única forma de lograr entrega exactamente-una-vez en efectos de negocio (como cobros) sobre reintentos at-least-once es hacer que el receptor sea idempotente mediante un `Idempotency-Key` único."
  },
  {
    "id": "sre-27",
    "d": 3,
    "t": "Timeouts en Cascada y Deadlines",
    "q": "El API Gateway tiene un timeout de 3 segundos hacia el servicio A. Sin embargo, el servicio A tiene configurado un timeout de 30 segundos hacia el servicio B y la base de datos. Cuando el servicio B se degrada, el API Gateway corta a los 3 segundos y devuelve 504 al usuario, pero el servicio A sigue ejecutando la consulta pesada durante otros 27 segundos y agota todos sus hilos de trabajo. ¿Qué patrón soluciona este desperdicio de recursos?",
    "o": [
      "Alinear los timeouts de forma estrictamente decreciente aguas abajo y propagar el contexto de cancelación / Deadline (p. ej. gRPC deadlines o `context.WithTimeout` en HTTP) para que, si el cliente ya abortó, se cancelen de inmediato las operaciones en curso.",
      "Subir el timeout del API Gateway a 10 minutos para que coincida con el peor caso posible.",
      "Quitar todos los timeouts en todos los servicios.",
      "Reiniciar la base de datos cada vez que un usuario cierre la pestaña del navegador."
    ],
    "a": 0,
    "e": "Trabajar en una petición cuyo cliente ya desconectó hace 20 segundos quema CPU, conexiones de base de datos y memoria para una respuesta que nadie va a leer (trabajo zombi). Propagar deadlines y señales de cancelación junto con timeouts más cortos en las capas internas que en las externas libera los recursos de inmediato."
  },
  {
    "id": "sre-28",
    "d": 3,
    "t": "Degradación Elegante (Graceful Degradation)",
    "q": "Durante el Black Friday, el microservicio de \"Recomendaciones personalizadas por IA\" en la página de detalle de producto empieza a fallar con errores 500 por saturación de GPUs. Debido a que el backend de e-commerce lo llama de forma síncrona y obligatoria, toda la página de producto devuelve error 500 y nadie puede comprar. ¿Qué cambio arquitectónico aplica el principio de Graceful Degradation?",
    "o": [
      "Tratar las recomendaciones como una dependencia no crítica con un timeout corto (p. ej. 150 ms) y un fallback automático (mostrar productos más vendidos en caché o esconder el carrusel de recomendaciones) para que el flujo principal de compra nunca se bloquee.",
      "Bloquear el acceso a toda la tienda online hasta que el clúster de GPUs de recomendaciones tenga 0 % de error.",
      "Hacer que el frontend reintente cargar la página entera cada 200 milisegundos cuando fallen las recomendaciones.",
      "Mover la base de datos de pedidos dentro del mismo contenedor de las GPUs de recomendaciones."
    ],
    "a": 0,
    "e": "En arquitectura resiliente, un componente secundario o enriquecedor (recomendaciones, reseñas, avatares) jamás debe ser un punto único de fallo (SPOF) para el camino crítico del negocio (buscar y pagar). Con un Circuit Breaker y un fallback degradado estático o vacío, el usuario puede seguir comprando sin enterarse del fallo interno."
  },
  {
    "id": "sre-29",
    "d": 3,
    "t": "Consistencia Eventual y Outbox Pattern",
    "q": "Un microservicio guarda un pedido en PostgreSQL (`COMMIT`) y en la línea siguiente publica un evento `PedidoCreado` en Kafka. Durante un microcorte de red hacia Kafka, el `COMMIT` en PostgreSQL tiene éxito pero la publicación en Kafka falla (o el pod muere justo entre ambas líneas), dejando pedidos cobrados en la base de datos que nunca se envían al almacén. ¿Qué patrón resuelve esta escritura dual (Dual Write)?",
    "o": [
      "El patrón Transactional Outbox: insertar el pedido y el registro del evento en una tabla `outbox` dentro de la misma transacción ACID de PostgreSQL, y usar un proceso asíncrono (CDC como Debezium o un poller con reintentos) para publicar desde `outbox` hacia Kafka.",
      "Invertir el orden: publicar primero en Kafka y luego hacer el INSERT en PostgreSQL sin transacciones.",
      "Usar `acks=0` en Kafka para que la llamada de red nunca lance excepciones.",
      "Desactivar las transacciones SQL (`autocommit=false` sin commit) en la base de datos."
    ],
    "a": 0,
    "e": "Escribir directamente en dos sistemas distintos (PostgreSQL y Kafka) sin un coordinador transaccional siempre sufre condiciones de carrera si el proceso cae entre el primer commit y el segundo. Con Transactional Outbox, la persistencia del estado y del evento por enviar es atómica en una sola base de datos local, garantizando entrega at-least-once hacia Kafka."
  },
  {
    "id": "sre-30",
    "d": 3,
    "t": "Colas acotadas y Backpressure",
    "q": "Un servicio ingesta eventos por HTTP y los mete en una cola en memoria (`chan` o `LinkedBlockingQueue` sin límite de tamaño) para que un pool de 4 hilos los escriba en disco. Cuando el disco se ralentiza durante 10 minutos, la cola en memoria crece hasta acumular 4 millones de objetos, el recolector de basura (GC) consume el 98 % de la CPU y el proceso muere por `OutOfMemoryError`, perdiendo los 4 millones de eventos en RAM. ¿Qué principio de diseño faltó?",
    "o": [
      "Colas acotadas (Bounded Queues) y contrapresión (Backpressure / Load Shedding): toda cola en memoria debe tener un límite estricto; al llenarse, el servicio debe aplicar backpressure o rechazar peticiones con `HTTP 429 / 503` para que el productor reintente o almacene en origen.",
      "Configurar la cola con capacidad infinita y desactivar el recolector de basura del lenguaje.",
      "Reducir el pool de escritura en disco de 4 hilos a 1 solo hilo.",
      "Capturar la excepción `OutOfMemoryError` con un `try/catch` vacío y seguir encolando en RAM."
    ],
    "a": 0,
    "e": "Una cola ilimitada en memoria no absorbe sobrecargas sostenidas: solo traslada el cuello de botella a la RAM hasta provocar un OOM catastrófico con pérdida de todo lo encolado. Acotar las colas y ejercer backpressure (o responder 429/503 rápido) mantiene el servicio vivo y predecible bajo saturación."
  },
  {
    "id": "sre-31",
    "d": 4,
    "t": "Explosión de Cardinalidad",
    "q": "Tu servidor de Prometheus en producción empieza a reiniciarse por `OOMKilled` cada hora tras el despliegue de una nueva versión del servicio `auth-api`. El consumo de RAM pasó de 6 GiB a 48 GiB y las consultas en Grafana dan timeout. Al consultar `/api/v1/status/tsdb` ves que la métrica `http_requests_total` pasó de 1.200 series a 4.800.000 series activas porque alguien añadió las etiquetas `user_id` y `session_token` al contador. ¿Cuál es la mitigación inmediata en Prometheus y la corrección definitiva?",
    "o": [
      "Aplicar de inmediato un `metric_relabel_configs` con `action: labeldrop` sobre `user_id` y `session_token` en el scrape job de Prometheus para frenar la creación de nuevas series, y eliminar esas etiquetas de alta cardinalidad del código de `auth-api` (llevando `user_id` a logs/trazas, nunca a labels de métricas).",
      "Subir el intervalo de scrape de 15 segundos a 20 segundos manteniendo las etiquetas `user_id` y `session_token`.",
      "Cambiar la métrica de tipo `Counter` a tipo `Histogram` conservando las etiquetas `user_id` y `session_token`.",
      "Instalar 10 instancias de Grafana delante del mismo servidor de Prometheus."
    ],
    "a": 0,
    "e": "Cada valor distinto de `user_id` × `session_token` crea una serie temporal nueva en el índice de la TSDB. Con `metric_relabel_configs` (`action: labeldrop`, `regex: \"(user_id|session_token)\"`) descartas esas etiquetas antes de que entren a la TSDB sin esperar un nuevo despliegue de la app, y luego limpias el código fuente."
  },
  {
    "id": "sre-32",
    "d": 4,
    "t": "PromQL rate() vs scrape_interval",
    "q": "El intervalo de recolección (`scrape_interval`) de tu Prometheus global es de `30s`. Un compañero crea un panel en Grafana y una alerta con la expresión `rate(http_requests_total[30s])`, pero el gráfico aparece lleno de huecos en blanco (\"No data\") y la alerta nunca evalúa correctamente. ¿Por qué falla esa consulta en PromQL?",
    "o": [
      "Porque `rate()` necesita al menos 2 muestras dentro de la ventana de rango para calcular la pendiente entre la primera y la última; con una ventana `[30s]` igual al `scrape_interval` de `30s`, solo cae 1 muestra (o 0 si hay leve jitter) y PromQL no puede calcular la tasa. La ventana debe ser al menos 4× el `scrape_interval` (p. ej. `[2m]` o `[5m]`).",
      "Porque `rate()` solo funciona con métricas de tipo `Gauge` y nunca con `Counter`.",
      "Porque en PromQL las ventanas de tiempo solo se pueden expresar en horas (`[1h]`).",
      "Porque `http_requests_total` necesita reiniciarse a 0 manualmente cada 30 segundos."
    ],
    "a": 0,
    "e": "En PromQL, `rate()` e `irate()` requieren como mínimo dos puntos dentro del selector de rango `[...]` para extrapolar la derivada por segundo. La buena práctica oficial de Prometheus es usar un rango de al menos `4 × scrape_interval` (con scrape de 30s, usar `[2m]` como mínimo) para ser resiliente a scrapes ligeramente retrasados o perdidos."
  },
  {
    "id": "sre-33",
    "d": 4,
    "t": "Agregación de Percentiles e Histogramas",
    "q": "Tienes 20 réplicas de una API. Cada réplica expone un `Summary` precalculado con su percentil 99 local (`http_response_time_p99`). Para ver el p99 global del servicio en Grafana, un ingeniero escribe `avg(http_response_time_p99)`. Durante un incidente en el que 2 réplicas reciben el 60 % del tráfico y tardan 5 segundos mientras las otras 18 están casi sin tráfico en 20 ms, el panel sigue mostrando ~518 ms. ¿Por qué es incorrecto y cómo debe calcularse en Prometheus?",
    "o": [
      "Promediar percentiles entre instancias es matemáticamente inválido porque ignora el volumen de peticiones de cada réplica y la distribución subyacente. Debe exponerse un `Histogram` (`_bucket`) y calcular `histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))`.",
      "Debe usarse `min(http_response_time_p99)` para quedarse siempre con la réplica más rápida.",
      "Basta con multiplicar el promedio por 0.99 en Grafana.",
      "En Prometheus es imposible calcular percentiles si hay más de 1 réplica del servicio."
    ],
    "a": 0,
    "e": "Los cuantiles/percentiles no son agregables ni promediables: el promedio de veinte p99 locales no tiene relación con el p99 global si el tráfico o la distribución varían entre pods. En cambio, los contadores de buckets de un histograma (`_bucket` con etiqueta `le`) sí se pueden sumar entre todas las réplicas con `sum by (le) (rate(...))` antes de aplicar `histogram_quantile()`."
  },
  {
    "id": "sre-34",
    "d": 4,
    "t": "Thanos Compactor Singleton",
    "q": "En tu plataforma de observabilidad con Thanos sobre S3/GCS, notas que las consultas de rangos largos (30 o 90 días) son cada vez más lentas y que el componente `thanos-compactor` falla constantemente con errores de bloques superpuestos (`overlapping blocks`) y corrupción de metadatos. Al revisar Kubernetes ves que alguien escaló el Deployment de `thanos-compactor` a `replicas: 3` por \"alta disponibilidad\". ¿Cuál es el problema?",
    "o": [
      "`Thanos Compactor` NO es horizontalmente escalable sobre los mismos bloques: debe ejecutarse como un único proceso singleton (`replicas: 1`) por bucket (o particionado por etiquetas externas disjuntas), ya que múltiples réplicas compactando el mismo almacenamiento de objetos generan condiciones de carrera y bloques superpuestos.",
      "`Thanos Compactor` requiere un mínimo de 5 réplicas impares para formar quórum Raft sobre S3.",
      "El downsampling de Thanos solo funciona si se borra el bucket de S3 todos los lunes.",
      "`Thanos Compactor` es el componente que recibe las consultas directas de Grafana en tiempo real."
    ],
    "a": 0,
    "e": "A diferencia de `Thanos Querier` o `Thanos Store Gateway` (que sí son stateless y escalables a múltiples réplicas), `Thanos Compactor` modifica y reemplaza bloques TSDB en el bucket de Object Storage. Ejecutar dos o más instancias sobre las mismas series al mismo tiempo corrompe el estado del bucket."
  },
  {
    "id": "sre-35",
    "d": 4,
    "t": "Thanos Deduplicación HA",
    "q": "Tienes dos servidores Prometheus idénticos (`prom-a` y `prom-b`) scrapeando los mismos pods en alta disponibilidad, cada uno con su `Thanos Sidecar` conectado a `Thanos Querier`. Sin embargo, al consultar en Grafana a través de `Thanos Querier`, ves cada serie duplicada o que los valores con `sum()` dan exactamente el doble de lo real. ¿Qué configuración falta?",
    "o": [
      "Definir una `external_labels` común de clúster y una etiqueta distintiva de réplica en cada Prometheus (p. ej. `replica: \"a\"` y `replica: \"b\"`), y pasar `--query.replica-label=replica` a `Thanos Querier` para que deduplique las series automáticamente.",
      "Apagar permanentemente `prom-b` porque Thanos no soporta más de un servidor Prometheus.",
      "Dividir todas las consultas de Grafana entre 2 manualmente en cada panel.",
      "Desinstalar `Thanos Sidecar` y conectar Grafana por SSH al disco de los nodos."
    ],
    "a": 0,
    "e": "Para que `Thanos Querier` fusione de forma transparente las muestras de un par HA de Prometheus sin duplicar resultados en `sum()`, ambos Prometheus deben compartir las mismas `external_labels` salvo por la etiqueta de réplica (como `replica=\"prom-a\"` / `replica=\"prom-b\"`), que se indica en `--query.replica-label`."
  },
  {
    "id": "sre-36",
    "d": 4,
    "t": "Correlación Métricas, Logs y Trazas",
    "q": "Durante una investigación de latencia p99, ves en Grafana que el bucket de > 2 segundos del histograma de Prometheus se dispara puntualmente, pero hay 5.000 peticiones por segundo en los logs y buscar a mano cuál fue la petición lenta tarda demasiado. ¿Qué dos prácticas de OpenTelemetry y Prometheus permiten saltar en un clic del pico en el gráfico a la traza y a los logs exactos de esa petición? (Elige 2 respuestas)",
    "o": [
      "Habilitar Exemplars en las métricas de histograma de Prometheus/OpenTelemetry adjuntando el `trace_id` de muestras representativas para saltar del gráfico de Grafana directamente a Tempo/Jaeger/Datadog APM.",
      "Inyectar automáticamente `trace_id` y `span_id` como campos estructurados en cada línea de log JSON emitida por la aplicación para filtrar todos los logs de esa petición.",
      "Añadir `trace_id` como etiqueta (label) normal en todas las métricas de Prometheus.",
      "Activar el nivel de log `TRACE` volcando todo el contenido de la base de datos por stdout en texto plano sin formato."
    ],
    "a": [
      0,
      1
    ],
    "e": "Los Exemplars permiten asociar un `trace_id` a un bucket de un histograma sin crear nuevas series temporales (evitando explosión de cardinalidad), y al incluir `trace_id` en los logs estructurados JSON puedes correlacionar Métrica → Traza distribuida → Logs exactos en segundos."
  },
  {
    "id": "sre-37",
    "d": 4,
    "t": "Ausencia de señal y Dead Man's Switch",
    "q": "Tu alerta en Prometheus para detectar fallos en el servicio de facturación es `rate(billing_errors_total[5m]) > 5`. A las 02:00 AM, el clúster donde corre `billing-service` pierde conectividad de red por completo (o todos los pods son eliminados por error). Como Prometheus ya no puede scrapear ningún pod, la métrica `billing_errors_total` desaparece y la expresión devuelve vector vacío, por lo que NO suena ninguna alerta. ¿Cómo se previene este punto ciego?",
    "o": [
      "Complementar las alertas de tasa de error con alertas sobre `up == 0` o `absent(up{job=\"billing-service\"}) == 1`, asegurar que el denominador de tráfico no haya caído a cero inesperadamente, y mantener una alerta \"Dead Man's Switch\" (`Watchdog`) para verificar que todo el pipeline de Alertmanager sigue vivo.",
      "Cambiar la condición de la alerta a `rate(billing_errors_total[5m]) < 0`.",
      "Confiar en que si una métrica no devuelve datos en PromQL, Prometheus dispara automáticamente todas las alertas.",
      "Desactivar Alertmanager y revisar Grafana manualmente cada 10 minutos las 24 horas."
    ],
    "a": 0,
    "e": "En PromQL, cuando una consulta devuelve un vector vacío (porque no hay series que coincidan en la ventana actual), la regla de alerta no se cumple y pasa a inactiva. Vigilar `up == 0` / `absent(...)` para cada job crítico y tener un `Watchdog` continuo garantiza que la desaparición total de un servicio o del propio sistema de monitoreo siempre genere alerta."
  },
  {
    "id": "sre-38",
    "d": 4,
    "t": "Contadores y Reinicios en PromQL",
    "q": "Un pod se reinicia y su contador en memoria `orders_processed_total` pasa de `15.400` a `0`, y un minuto después vale `120`. Un desarrollador teme que `rate(orders_processed_total[5m])` dé un número negativo gigante (`-15.280 / 300s`) y rompa las alertas. ¿Cómo se comporta realmente `rate()` e `increase()` en Prometheus ante un reinicio de contador?",
    "o": [
      "`rate()` e `increase()` detectan automáticamente cuando el valor de un `Counter` disminuye entre dos muestras sucesivas, asumen que hubo un reset a 0 y suman el nuevo valor al acumulado previo sin producir tasas negativas.",
      "`rate()` devuelve un valor negativo y detiene el servidor de Prometheus.",
      "Hay que usar `deriv()` en lugar de `rate()` para los contadores.",
      "Prometheus exige que la aplicación guarde el contador en PostgreSQL antes de cada scrape."
    ],
    "a": 0,
    "e": "El manejo automático de resets de contadores (counter reset detection) es una de las razones por las que existen `rate()` e `increase()` en PromQL: si la muestra $t_2$ es menor que $t_1$, PromQL interpreta que el proceso se reinició después de $t_1$ y compensa el cálculo para que la tasa sea siempre positiva. (Nota: por eso nunca debes usar `rate()` sobre un `Gauge` que sube y baja legítimamente)."
  },
  {
    "id": "sre-39",
    "d": 4,
    "t": "Logs estructurados y Costos de Ingestión",
    "q": "La factura mensual de tu plataforma de observabilidad (Datadog / Cloud Logging / Elasticsearch) se multiplicó por 6 este mes y el índice diario se saturó a mitad del día. Al auditar el tráfico ves que un único microservicio genera el 82 % del volumen porque dejó activo un middleware que registra el body completo de cada respuesta HTTP 200 (incluyendo catálogos JSON de 200 KB) en texto plano. ¿Cuál es la estrategia SRE correcta?",
    "o": [
      "Aplicar un filtro de exclusión / pipeline de descarte inmediato en el agente o colector para frenar la ingestión de esos payloads HTTP 200, corregir el código para emitir logs estructurados JSON sin volcar payloads masivos en peticiones exitosas, y configurar cuotas/alertas de volumen de ingestión por servicio.",
      "Desactivar todos los logs de errores (5xx y excepciones) de toda la empresa para ahorrar espacio y conservar los cuerpos HTTP 200.",
      "Dar de baja las métricas y trazas de producción para pagar solo los logs de 200 KB.",
      "Imprimir los logs en papel para no usar almacenamiento en la nube."
    ],
    "a": 0,
    "e": "En observabilidad moderna, los colectores (Datadog Agent, OpenTelemetry Collector, Vector, Fluent Bit) permiten filtrar o truncar campos gigantes en caliente sin esperar un despliegue, protegiendo el presupuesto y la cuota del índice. Las peticiones 200 OK de alto volumen se representan con métricas y muestreo de trazas (head/tail sampling), no volcando cuerpos de 200 KB por log."
  },
  {
    "id": "sre-40",
    "d": 4,
    "t": "Muestreo de Trazas (Tail-based vs Head-based Sampling)",
    "q": "Quieres capturar el 100 % de las trazas distribuidas de peticiones que terminan en error (HTTP 5xx) o cuya latencia total supera 1.5 segundos, pero solo el 1 % de las peticiones normales rápidas y exitosas para controlar costos. ¿Qué tipo de muestreo (sampling) necesitas en tu arquitectura de OpenTelemetry?",
    "o": [
      "Tail-based sampling (muestreo en la cola/final) en una capa de OpenTelemetry Collector, ya que la decisión de conservar o descartar la traza se toma después de conocer si algún span falló o cuánto tardó la petición completa.",
      "Head-based sampling probabilístico puro en el primer nodo al inicio de la petición.",
      "Desactivar la propagación del header W3C `traceparent` entre microservicios.",
      "Guardar únicamente el primer span del frontend y borrar todos los spans de backend."
    ],
    "a": 0,
    "e": "Con Head-based sampling la decisión de muestrear se toma en el milisegundo 0 cuando entra la petición, antes de saber si dará un error 500 en el último microservicio o si tardará 3 segundos. El Tail-based sampling retiene los spans de una traza en memoria unos segundos en el Collector y conserva el 100 % de las trazas anómalas (errores o alta latencia) descartando la mayoría de las rutinarias."
  },
  {
    "id": "sre-41",
    "d": 5,
    "t": "Agotamiento de Conexiones en PostgreSQL",
    "q": "Durante un evento de alto tráfico, el HPA escala tus microservicios de 15 a 120 pods. De repente, la base de datos PostgreSQL (configurada con `max_connections = 500`) empieza a rechazar conexiones con `FATAL: sorry, too many clients already`, la CPU de la DB sube al 100 % y toda la plataforma cae. Cada pod tenía configurado un pool de 10 conexiones (`120 × 10 = 1.200 > 500`). ¿Cuál es la solución arquitectónica recomendada en lugar de simplemente subir `max_connections` a 5.000 en PostgreSQL?",
    "o": [
      "Interponer un pooler de conexiones como PgBouncer (en modo `transaction` pooling) para multiplexar las miles de conexiones lógicas de los pods sobre un número pequeño y estable de conexiones físicas en PostgreSQL (p. ej. 100–200), y ajustar el tamaño del pool por pod.",
      "Subir `max_connections = 50000` en `postgresql.conf` sin añadir memoria ni pooler.",
      "Hacer que cada petición HTTP abra y cierre una conexión TCP/TLS nueva contra PostgreSQL sin usar ningún pool.",
      "Apagar el HPA y dejar un único pod atendiendo todo el tráfico de la compañía."
    ],
    "a": 0,
    "e": "En PostgreSQL, cada conexión física es un proceso del sistema operativo (`postgres` backend process) que consume varios megabytes de RAM y genera contención de locks/snapshots y cambios de contexto de CPU si hay miles activas. PgBouncer en modo transacción mantiene unas pocas conexiones reales calientes hacia PostgreSQL mientras acepta miles de clientes desde Kubernetes."
  },
  {
    "id": "sre-42",
    "d": 5,
    "t": "Cache Stampede en Redis",
    "q": "La portada de tu aplicación consulta una clave de Redis `home:featured_products` que tiene un TTL de 300 segundos y cuesta 2.5 segundos en calcularse mediante un JOIN pesado en la base de datos. Con 4.000 usuarios por segundo en la portada, cada 5 minutos exactos cuando la clave expira en Redis, 10.000 peticiones concurrentes sufren un cache miss simultáneo y lanzan las 10.000 consultas SQL pesadas a la vez, provocando picos del 100 % de CPU en la base de datos. ¿Cómo erradicas este Cache Stampede?",
    "o": [
      "Usar Request Coalescing / Singleflight (o un lock distribuido con stale-while-revalidate) para que solo un único trabajador recalcule el valor en la base de datos cuando está por expirar mientras el resto de peticiones espera ese resultado o recibe el valor cacheado previo.",
      "Bajar el TTL de Redis de 300 segundos a 1 segundo para que expire con más frecuencia.",
      "Ejecutar `FLUSHALL` en Redis cada 5 minutos mediante un cronjob.",
      "Eliminar los índices de las tablas involucradas en el JOIN de la base de datos."
    ],
    "a": 0,
    "e": "El fenómeno de Cache Stampede (Thundering Herd) ocurre cuando múltiples hilos intentan regenerar en paralelo la misma clave recién expirada. Con Singleflight / coalescencia de peticiones o refresco asíncrono antes de la expiración (stale-while-revalidate / early expiration probabilística), la base de datos solo recibe 1 consulta en lugar de 10.000."
  },
  {
    "id": "sre-43",
    "d": 5,
    "t": "Migraciones DDL y Bloqueos de Tabla",
    "q": "A las 12:30 PM (hora pico), un despliegue ejecuta una migración de esquema sobre la tabla `transacciones` (180 millones de filas) en PostgreSQL que intenta añadir una columna con una operación que requiere un `ACCESS EXCLUSIVE LOCK` prolongado. Aunque el `ALTER TABLE` queda esperando detrás de una consulta analítica de 10 minutos, inmediatamente todas las nuevas lecturas (`SELECT`) y escrituras (`INSERT`) de la aplicación quedan bloqueadas en fila y el sitio cae por completo. ¿Por qué se bloquearon hasta los `SELECT` y cómo se evita?",
    "o": [
      "En PostgreSQL, una sentencia DDL que solicita `ACCESS EXCLUSIVE LOCK` entra en la cola de locks; mientras espera a que termine la consulta analítica previa, bloquea a todas las consultas nuevas (`SELECT`, `INSERT`, `UPDATE`) que llegan detrás de ella en la cola. Debe configurarse siempre un `lock_timeout` corto (p. ej. `SET lock_timeout = '2s'`) para abortar el DDL rápido si no consigue el lock al instante y reintentar, además de usar patrones expand-and-contract.",
      "Porque en PostgreSQL cualquier `SELECT` bloquea toda la base de datos durante 1 hora por defecto.",
      "Porque las migraciones de base de datos solo pueden ejecutarse borrando primero los 180 millones de filas.",
      "Porque faltó ejecutar `VACUUM FULL` al mediodía junto con el `ALTER TABLE`."
    ],
    "a": 0,
    "e": "Es una de las caídas más clásicas en producción con PostgreSQL: aunque el `ALTER TABLE` aún no haya adquirido el `ACCESS EXCLUSIVE LOCK` porque espera a una transacción larga, su solicitud en la cola impide que pasen nuevos `ACCESS SHARE LOCK` (los simples `SELECT`). Fijar `SET lock_timeout = '2s'` antes de cualquier migración garantiza que, si no obtiene el lock en 2 segundos, el DDL falle limpiamente sin encolar a toda la aplicación."
  },
  {
    "id": "sre-44",
    "d": 5,
    "t": "DRP: RPO vs RTO y Failover Asíncrono",
    "q": "El negocio define para la base de datos principal un RPO (Recovery Point Objective) de 0 segundos (cero pérdida de transacciones confirmadas) y un RTO (Recovery Time Objective) de 10 minutos ante la caída de una zona de disponibilidad. Actualmente tienes una instancia primaria en la Zona A con replicación asíncrona hacia una réplica en la Zona B que en horas punta acumula 45 segundos de `replication_lag`. ¿Cumple tu arquitectura el objetivo y por qué?",
    "o": [
      "No cumple el RPO de 0 segundos: con replicación asíncrona y 45 segundos de lag, si la Zona A cae abruptamente y promueves la Zona B, se perderán hasta 45 segundos de transacciones ya confirmadas a los usuarios. Un RPO = 0 exige replicación síncrona (o quórum síncrono multi-AZ).",
      "Sí cumple el RPO = 0 porque el RTO de 10 minutos es mayor que los 45 segundos de lag.",
      "No cumple el RTO, pero sí garantiza RPO = 0 aunque el lag sea de 4 horas.",
      "Para lograr RPO = 0 basta con hacer un backup completo a cinta magnética una vez por semana."
    ],
    "a": 0,
    "e": "El RPO mide la pérdida máxima tolerable de datos en el tiempo hacia atrás desde el momento del fallo; el RTO mide cuánto tardas en restaurar el servicio hacia adelante. Si tu réplica va 45 segundos atrasada de forma asíncrona, promoverla tras la destrucción del primario implica perder esos 45 segundos de escrituras (RPO real = 45s > 0s)."
  },
  {
    "id": "sre-45",
    "d": 5,
    "t": "Split-Brain en Failover de Base de Datos",
    "q": "Un script casero de monitoreo hace ping desde la Zona B a la base de datos primaria en la Zona A. Durante una partición temporal de red entre ambas zonas (mientras ambas siguen recibiendo tráfico de diferentes balanceadores), el script no recibe respuesta al ping y promueve automáticamente la réplica de la Zona B a primaria sin aislar ni apagar el nodo de la Zona A. Durante 8 minutos, ambas instancias aceptan escrituras independientes con los mismos IDs autoincrementales. ¿Cómo se llama este incidente y cómo se previene?",
    "o": [
      "Se llama Split-Brain (cerebro dividido) y causa corrupción y divergencia severa de datos; se previene exigiendo consenso por quórum (mayoría estricta de nodos/testigos en >= 3 zonas) y mecanismos de Fencing / STONITH que garanticen que el antiguo líder dejó de aceptar escrituras antes de promover al nuevo.",
      "Se llama Sharding automático y mejora el rendimiento al doble sin ningún riesgo.",
      "Se llama Read Replica Lag y se arregla reiniciando el navegador del usuario.",
      "Se previene reduciendo el intervalo del ping del script casero de 5 segundos a 1 milisegundo."
    ],
    "a": 0,
    "e": "Un fallo de red desde un único punto de observación nunca distingue si el nodo primario murió o si solo se cortó el enlace entre ambos. Promover una réplica sin quórum (p. ej. etcd/Consul/Patroni con lease renovado por mayoría) ni fencing crea dos primarios activos (Split-Brain) cuyas escrituras conflictivas no pueden fusionarse automáticamente."
  },
  {
    "id": "sre-46",
    "d": 5,
    "t": "Consistencia Read-After-Write con Réplicas de Lectura",
    "q": "Para aliviar la carga del nodo primario de base de datos, modificas la API para que todos los `POST /perfil` escriban en el nodo primario y todos los `GET /perfil` lean desde las réplicas de lectura asíncronas. Inmediatamente los usuarios reportan que al guardar un cambio en su perfil y recargar la pantalla automática (100 ms después), ven sus datos antiguos como si no se hubieran guardado. ¿Qué fenómeno ocurre y cómo se resuelve sin renunciar a las réplicas?",
    "o": [
      "Violación de consistencia Read-your-own-writes (lectura tras escritura) debido al lag de replicación asíncrona (aunque sea de 200 ms). Se resuelve enrutando las lecturas del propio usuario que acaba de escribir hacia el nodo primario durante una ventana breve (sticky primary tras escritura) o esperando el LSN/GTID de la transacción.",
      "Las réplicas de lectura borran automáticamente los datos del nodo primario.",
      "El método HTTP `POST` no guarda datos en disco hasta pasadas 24 horas.",
      "Es obligatorio eliminar todas las réplicas de lectura y prohibir el escalado de lecturas."
    ],
    "a": 0,
    "e": "Incluso en un clúster sano, la replicación asíncrona tarda decenas o cientos de milisegundos. Si el navegador hace un `POST` seguido inmediatamente de un `GET`, el `GET` puede llegar a una réplica antes que el evento de replicación. Enrutar al primario las lecturas del usuario durante unos segundos tras un `POST/PUT` (o verificar la posición del log WAL/LSN) garantiza consistencia Read-after-write."
  },
  {
    "id": "sre-47",
    "d": 5,
    "t": "Backups no probados",
    "q": "Durante una revisión de preparación operativa (Production Readiness Review), un equipo afirma tener un DRP sólido porque un cronjob ejecuta `pg_dump` todas las noches y sube un archivo `.sql.gz` a un bucket de S3, pero nunca han ejecutado una restauración de prueba en los últimos 18 meses. Al inspeccionar el bucket descubres que los archivos de los últimos 4 meses pesan 20 bytes porque la contraseña del usuario de backup expiró y el script comprimía la salida vacía sin `set -euo pipefail`. ¿Qué lección fundamental de SRE ilustra esto?",
    "o": [
      "\"Un backup no existe hasta que has probado su restauración\": todo sistema de copias de seguridad requiere pruebas automatizadas y periódicas de restauración (Restore Drills), validación de tamaño/integridad y alertas si el job falla o genera artefactos vacíos.",
      "Que los backups deben guardarse únicamente en el disco local `/tmp` del mismo servidor de base de datos.",
      "Que la compresión gzip siempre borra el contenido de los archivos SQL.",
      "Que en la nube no es necesario hacer backups porque los usuarios nunca borran datos por error."
    ],
    "a": 0,
    "e": "En SRE es ley que la capacidad real de recuperación no es tu política de backups, sino tu proceso probado de restauración. Sin `set -euo pipefail` en scripts bash, sin métricas de éxito/tamaño y sin simulacros periódicos de restauración que verifiquen los datos y midan el RTO real, los backups suelen fallar silenciosamente justo cuando más se necesitan."
  },
  {
    "id": "sre-48",
    "d": 5,
    "t": "Saturación de IOPS y Burst Balance en Discos Cloud",
    "q": "Una base de datos en la nube funcionó perfectamente durante una prueba de carga de 20 minutos, pero tras 3 horas de tráfico sostenido en producción la latencia de lectura/escritura en disco salta de 2 ms a 85 ms y el rendimiento cae en picado sin que haya aumentado el tráfico en la última hora. El volumen de almacenamiento utiliza créditos de ráfaga (Burst Balance). ¿Qué ocurrió?",
    "o": [
      "El disco consumió durante las 3 horas una tasa de IOPS o throughput superior a su línea base garantizada (baseline), agotando al 0 % su reserva de créditos de ráfaga (Burst Balance); al agotarse, el proveedor cloud limita el disco estrictamente a su rendimiento base.",
      "Los discos SSD en la nube necesitan desfragmentarse manualmente cada 2 horas.",
      "El sistema operativo cambió el sistema de archivos de ext4 a FAT32 en caliente.",
      "Las pruebas de carga de 20 minutos siempre agotan los cables de fibra óptica físicos."
    ],
    "a": 0,
    "e": "Muchos volúmenes cloud (como gp2 en AWS o ciertos tiers estándar en Azure/GCP) acumulan créditos de IOPS cuando están ociosos y los gastan en picos. Una prueba corta de 20 minutos pasa con nota alta gracias a los créditos acumulados, pero el tráfico continuo de producción vacía el balde de créditos y desploma el rendimiento. Hay que vigilar la métrica de Burst Balance o usar volúmenes con IOPS aprovisionados constantes (p. ej. gp3/io2/Premium SSD)."
  },
  {
    "id": "sre-49",
    "d": 5,
    "t": "Consultas N+1 y Falta de Índices tras un Despliegue",
    "q": "Tras desplegar un nuevo endpoint `/api/v2/historial-compras`, el uso de CPU de la base de datos sube del 20 % al 99 % aunque el endpoint solo recibe 30 peticiones por segundo. En `pg_stat_statements` observas que la consulta `SELECT * FROM items_pedido WHERE pedido_id = $1` se ejecuta 6.000 veces por segundo haciendo `Seq Scan` (escaneo secuencial completo). ¿Qué dos problemas combinados están tumbando la base de datos? (Elige 2 respuestas)",
    "o": [
      "El código tiene un problema de consultas N+1 (por cada una de las 30 peticiones carga 200 pedidos e itera lanzando 1 consulta SQL por pedido = 6.000 QPS en lugar de un `WHERE pedido_id IN (...)` o `JOIN`).",
      "Falta un índice B-Tree sobre la clave foránea `items_pedido(pedido_id)`, obligando al motor a escanear toda la tabla en cada una de las 6.000 ejecuciones por segundo.",
      "El puerto TCP de PostgreSQL (5432) es demasiado bajo y limita la velocidad de la CPU.",
      "Usar consultas parametrizadas (`$1`) desactiva automáticamente todos los índices de la base de datos."
    ],
    "a": [
      0,
      1
    ],
    "e": "A diferencia de las claves primarias, muchos motores relacionales (incluido PostgreSQL) NO crean automáticamente un índice sobre la columna de una clave foránea (`FOREIGN KEY`). Si a la falta de índice en `pedido_id` (que causa un `Seq Scan`) le sumas un bucle N+1 en el ORM/código que multiplica por 200 las consultas por petición, 30 RPS bastan para saturar por completo todas las CPUs de la base de datos."
  },
  {
    "id": "sre-50",
    "d": 5,
    "t": "Desalojo de Claves en Redis (maxmemory-policy)",
    "q": "Usas el mismo clúster de Redis para dos propósitos mezclados: guardar sesiones de autenticación de usuarios y cachear respuestas temporales del catálogo. La memoria de Redis llega al 100 % de `maxmemory` y tienes configurada la política `maxmemory-policy noeviction` (o alternativamente `allkeys-lru`). Con `noeviction`, los nuevos inicios de sesión fallan con error `OOM command not allowed when used memory > maxmemory`; si cambias a `allkeys-lru`, se cierran sesiones activas de usuarios al azar. ¿Cuál es la solución correcta?",
    "o": [
      "Separar las cargas de trabajo (una instancia/clúster para estado de sesiones críticas con persistencia y dimensionamiento dedicado, y otra instancia para caché efímero con `allkeys-lru`), o como mínimo usar `volatile-lru` / `volatile-lfu` asegurando que todas las claves de caché tengan TTL explícito.",
      "Eliminar `maxmemory` para que el proceso de Redis crezca sin límite hasta que el OOM Killer del kernel lo mate.",
      "Guardar las sesiones de todos los usuarios en una única variable global sin expiración.",
      "Reiniciar Redis cada 10 minutos para vaciar la RAM."
    ],
    "a": 0,
    "e": "Mezclar datos de estado crítico (sesiones o colas de trabajos como Sidekiq/BullMQ) con caché de propósito general en la misma instancia de Redis es un antipatrón clásico: la caché llena la memoria y o bien bloquea las escrituras de sesiones (`noeviction`) o bien expulsa datos críticos (`allkeys-lru`). Deben aislarse en instancias separadas con políticas de desalojo acordes a cada rol."
  },
  {
    "id": "sre-51",
    "d": 6,
    "t": "ArgoCD Self-Heal durante un Incidente",
    "q": "Durante un incidente P1 a las 04:00 AM, descubres que una variable de entorno mal configurada en el Deployment `pagos-api` está causando el fallo. Para mitigar rápido, ejecutas `kubectl set env deployment/pagos-api FEATURE_X=false`. Los pods nuevos arrancan bien y el error desaparece, pero exactamente 45 segundos después los pods vuelven a recrearse solos con `FEATURE_X=true` y el incidente regresa. El clúster se gestiona con ArgoCD. ¿Qué pasó y cómo debes actuar?",
    "o": [
      "La aplicación en ArgoCD tiene activado `automated` sync con `selfHeal: true`, por lo que al detectar que el estado vivo del clúster difiere del repositorio Git, ArgoCD revierte tu cambio manual automáticamente. Debes hacer el cambio mediante commit/revert en el repositorio GitOps (o pausar `auto-sync` temporalmente mientras mitigas y luego subir el commit a Git).",
      "El kubelet tiene un virus que modifica los Deployments cada 45 segundos.",
      "Kubernetes nunca guarda los cambios hechos con `kubectl set env` si no se reinicia `etcd`.",
      "Debes desinstalar ArgoCD borrando todos los CustomResourceDefinitions (CRDs) del clúster en caliente."
    ],
    "a": 0,
    "e": "En un entorno GitOps con ArgoCD y `selfHeal: true`, Git es la única fuente de verdad deseada: cualquier cambio manual aplicado directamente con `kubectl` contra el API Server se considera deriva (drift) y es sobrescrito en el siguiente ciclo de reconciliación. Para que una mitigación sea duradera, debe aplicarse en Git (o desactivar el auto-sync durante la emergencia y sincronizar Git antes de reactivarlo)."
  },
  {
    "id": "sre-52",
    "d": 6,
    "t": "Certificados TLS y Cadena Intermedia Incompleta",
    "q": "Renovaste manualmente el certificado TLS en un balanceador para `api.tuempresa.com`. Al probarlo desde tu portátil con Chrome y Safari, el candado verde aparece sin errores. Sin embargo, apenas pasa a producción, los webhooks de socios externos, scripts en Python (`requests`), microservicios en Go/Java y dispositivos Android fallan masivamente con `SSLHandshakeException` / `SSL: CERTIFICATE_VERIFY_FAILED (unable to get local issuer certificate)`. ¿Cuál es la causa exacta?",
    "o": [
      "Configuraste en el balanceador únicamente el certificado hoja (leaf certificate) del dominio sin concatenar los certificados de la Autoridad Certificadora intermedia (`fullchain.pem`). Los navegadores de escritorio descargan el intermedio faltante por su cuenta (AIA fetching), pero los clientes HTTP de backend, cURL y móviles exigen que el servidor envíe la cadena completa.",
      "El puerto 443 solo funciona con navegadores web y nunca con clientes Python o Java.",
      "La clave privada RSA/ECDSA caduca cada vez que un cliente cURL se conecta.",
      "Debes pedir a todos tus clientes y socios que desactiven la verificación SSL (`verify=False` / `curl -k`) en producción."
    ],
    "a": 0,
    "e": "Es el incidente número uno tras renovar certificados TLS: los clientes estrictos (cURL, OpenSSL, JVM, Go, Python, Android) solo tienen en su almacén local las CAs raíz (Root CAs) y necesitan que el servidor presente el certificado del dominio seguido de los certificados intermedios (`fullchain`). Puedes verificarlo siempre con `openssl s_client -connect api.tuempresa.com:443 -servername api.tuempresa.com`."
  },
  {
    "id": "sre-53",
    "d": 6,
    "t": "DNS TTL y Conexiones Persistentes en Failover",
    "q": "Ejecutas un failover de DRP cambiando el registro DNS `A` / `CNAME` de tu API para que apunte de la Región Primaria a la Región Secundaria. El registro tenía un TTL previo de `3600` segundos (1 hora), aunque lo bajaste a `60` segundos justo en el momento del cambio. Además, varios microservicios internos siguen enviando tráfico a las IPs privadas del balanceador primario incluso 2 horas después. ¿Qué dos factores explican este comportamiento? (Elige 2 respuestas)",
    "o": [
      "Los servidores DNS recursivos que cachearon el registro antes del cambio respetarán el TTL antiguo de 3600 segundos hasta que expire; el TTL debe reducirse con antelación (al menos 1 TTL antes de una ventana planificada) o mantenerse bajo en registros sujetos a failover.",
      "Los pools de conexiones HTTP keep-alive / HTTP/2 y ciertos runtimes reutilizan las conexiones TCP ya abiertas hacia la IP antigua sin volver a consultar el DNS hasta que las conexiones se cierran o alcanzan un tiempo máximo de vida (`maxConnectionAge`).",
      "El protocolo DNS tarda por estándar internacional un mínimo obligatorio de 72 horas en actualizar cualquier registro.",
      "Los registros DNS `A` solo aceptan direcciones IPv6 cuando hay un incidente."
    ],
    "a": [
      0,
      1
    ],
    "e": "Cambiar el TTL en el instante del desastre no invalida las cachés que ya guardaron el registro con el TTL anterior de 1 hora. Y aún más importante: el DNS solo se consulta al establecer una conexión nueva; si los clientes mantienen sockets TCP persistentes abiertos (HTTP keep-alive o gRPC/HTTP2) contra un balanceador que sigue respondiendo a nivel de red, nunca volverán a resolver el nombre a menos que el servidor cierre las conexiones o exista un `MaxConnectionAge`."
  },
  {
    "id": "sre-54",
    "d": 6,
    "t": "Terraform State Drift en Emergencia",
    "q": "Hace dos semanas, durante una emergencia, un ingeniero modificó manualmente en la consola de AWS/GCP las reglas de un Firewall / Security Group y el tamaño de un grupo de nodos sin actualizar el código de Terraform. Hoy necesitas añadir una regla nueva con Terraform y al ejecutar `terraform plan` ves: `Plan: 1 to add, 3 to change, 2 to destroy` (incluyendo la destrucción y recreación de recursos críticos creados a mano). ¿Cuál es el procedimiento seguro?",
    "o": [
      "Detener el despliegue (`NO` aplicar el plan), analizar cada diferencia del `terraform plan`, reconciliar la deriva actualizando el código HCL e importando/sincronizando el estado (`terraform import` / bloques `import` / `terraform plan -refresh-only`) hasta que el plan muestre únicamente el cambio deseado sin destrucciones accidentales.",
      "Ejecutar `terraform apply -auto-approve` inmediatamente para que Terraform borre todo lo que no reconoce.",
      "Borrar el archivo `terraform.tfstate` del bucket remoto y volver a ejecutar `terraform apply` desde cero.",
      "Ejecutar `terraform destroy` en producción para limpiar la deriva."
    ],
    "a": 0,
    "e": "Cuando hay deriva de estado (State Drift) por cambios manuales (ClickOps), un `terraform apply` ciego revertirá los cambios de emergencia anteriores o destruirá recursos productivos. Primero se reconcilia el código HCL y el estado con la realidad en producción, y recién cuando el `plan` está limpio se aplica el nuevo cambio."
  },
  {
    "id": "sre-55",
    "d": 6,
    "t": "Agotamiento de Puertos SNAT (SNAT Port Exhaustion)",
    "q": "Tus 50 nodos de Kubernetes salen a internet a través de un único NAT Gateway con 1 sola dirección IP pública (que dispone de ~64.000 puertos efímeros por destino). Después de un cambio en un microservicio que llama a la API de un banco externo a 2.000 RPS, empiezan a fallar las conexiones salientes de todo el clúster con timeouts de conexión (`SYN` enviados sin respuesta / paquetes descartados en el NAT Gateway). Al revisar el código ves que el desarrollador instancia un cliente HTTP nuevo en cada petición sin reutilizar conexiones (`Connection: close`). ¿Cuál es la causa y la solución?",
    "o": [
      "Al abrir una conexión TCP nueva por petición y cerrarla, cada puerto SNAT queda retenido en estado `TIME_WAIT` / enfriamiento durante 60–120 segundos, agotando los 64.000 puertos efímeros de la IP pública hacia ese destino (SNAT Port Exhaustion). Se corrige reutilizando un único pool de clientes HTTP con Keep-Alive global en la app y añadiendo más IPs públicas al NAT Gateway.",
      "El protocolo HTTP no soporta más de 100 peticiones por minuto hacia un mismo dominio.",
      "El NAT Gateway cifra el tráfico con BGP y por eso bloquea los paquetes TCP SYN.",
      "Hay que cambiar el método de todas las peticiones de `POST` a `OPTIONS`."
    ],
    "a": 0,
    "e": "A 2.000 conexiones nuevas por segundo hacia la misma IP/puerto de destino, en apenas 32 segundos consumes los 64.512 puertos efímeros de una IP pública en el NAT Gateway porque las conexiones cerradas permanecen en espera antes de poder reciclar su tupla. Reutilizar sockets mediante un cliente HTTP singleton con pool Keep-Alive reduce el uso de puertos de 64.000 a unas pocas decenas."
  },
  {
    "id": "sre-56",
    "d": 6,
    "t": "Fuga de Credenciales y Rotación sin Downtime",
    "q": "El escáner de seguridad detecta que una llave de servicio (`API_SECRET_KEY`) de producción fue subida accidentalmente en un commit a un repositorio público hace 10 minutos. Sin embargo, si simplemente revocas la llave actual en el proveedor externo ahora mismo sin antes actualizar tus microservicios, dejarás fuera de servicio la integración en producción. ¿Cuál es el patrón estándar para rotar credenciales sin downtime y cómo actúas ante una exposición pública activa?",
    "o": [
      "Usar el patrón de doble credencial activa (Dual-Key / Overlapping Rotation): generar de inmediato una segunda llave válida, inyectarla en los servicios en producción (vía Secrets Manager / External Secrets + rollout), verificar que el tráfico ya usa la llave nueva e invalidar la llave filtrada en cuestión de minutos (o revocar de inmediato si ya se detecta abuso activo).",
      "Dejar la llave pública activa durante 6 meses hasta la próxima ventana de mantenimiento anual.",
      "Borrar el commit con `git push --force` y mantener exactamente la misma llave en producción pensando que nadie la vio.",
      "Enviar la nueva llave por un canal público de Slack para que los desarrolladores la copien."
    ],
    "a": 0,
    "e": "Reescribir el historial de Git (`push --force`) nunca desacredita un secreto expuesto: los bots raspan los eventos públicos de GitHub en segundos. La rotación debe ser inmediata, y diseñar los sistemas con soporte para dos llaves activas simultáneas (o rotación automatizada con Vault / Secrets Manager) permite reemplazar el secreto e invalidar el comprometido en minutos sin tumbar el servicio."
  },
  {
    "id": "sre-57",
    "d": 6,
    "t": "Bloqueo de Estado en Terraform (State Lock)",
    "q": "El pipeline de CI/CD de Terraform falló a mitad de un `terraform plan` porque el runner de GitHub Actions perdió energía abruptamente. Ahora cualquier nuevo intento de ejecutar Terraform falla con `Error acquiring the state lock` indicando el ID del bloqueo huérfano en DynamoDB / GCS. ¿Qué debes comprobar antes de liberar el bloqueo?",
    "o": [
      "Verificar primero al 100 % en el sistema de CI/CD y con el equipo que realmente no queda ningún proceso de Terraform en ejecución contra ese estado; solo una vez confirmado que el bloqueo es huérfano, ejecutar `terraform force-unlock <LOCK_ID>`.",
      "Pasar `-lock=false` en todos los comandos de `terraform apply` de producción de forma permanente.",
      "Borrar la tabla de DynamoDB o el bucket de GCS completo donde vive el estado.",
      "Cambiar los nombres de todos los recursos en los archivos `.tf`."
    ],
    "a": 0,
    "e": "El bloqueo de estado impide que dos ejecuciones concurrentes de Terraform escriban en `terraform.tfstate` a la vez y lo corrompan. Si un runner murió abruptamente y dejó el lock colgado, primero verificas que ningún job siga corriendo en segundo plano y luego usas `terraform force-unlock <ID>`. Nunca debes deshabilitar el bloqueo con `-lock=false` como práctica habitual."
  },
  {
    "id": "sre-58",
    "d": 6,
    "t": "MTU y Fragmentación en Túneles VPN / Overlay CNI",
    "q": "Conectaste tu clúster de Kubernetes (que usa una red overlay VXLAN/Geneve) con un centro de datos on-premise a través de una VPN IPSec. Las peticiones pequeñas (`ping`, `GET /health` de 100 bytes) funcionan en 5 ms sin perder ni un paquete, pero cualquier petición que devuelve un JSON grande (> 1.400 bytes) o un handshake TLS con certificados grandes se queda congelada infinitamente hasta dar timeout. ¿Cuál es el diagnóstico clásico de red?",
    "o": [
      "Problema de MTU y Path MTU Discovery (PMTUD Blackhole): la suma de cabeceras del overlay CNI (VXLAN = 50 bytes) más el túnel IPSec reduce el MTU efectivo por debajo de 1.500 bytes, y algún firewall intermedio está bloqueando los paquetes ICMP `Fragmentation Needed` (Type 3, Code 4). Se soluciona ajustando el MTU de la interfaz CNI/túnel y activando `TCP MSS Clamping`.",
      "El protocolo JSON es incompatible con túneles VPN IPSec.",
      "Los paquetes grandes viajan más lento por los cables y siempre superan el timeout de 60 segundos.",
      "El comando `ping` usa TCP puerto 80 mientras que HTTP usa ICMP."
    ],
    "a": 0,
    "e": "Cuando el ping y las respuestas diminutas pasan perfecto pero las transferencias grandes o handshakes TLS se cuelgan en silencio, es el síntoma inequívoco de un problema de MTU / TCP MSS: los paquetes grandes con el bit `DF` (Don't Fragment) superan el MTU del túnel encapsulado y se descartan sin que el origen se entere. Aplicar TCP MSS Clamping y ajustar el MTU del CNI resuelve el problema al instante."
  },
  {
    "id": "sre-59",
    "d": 6,
    "t": "Ataque o Pico de Tráfico en Caché CDN (Cache Bypass)",
    "q": "Tu sitio web soporta 50.000 RPS gracias a que Cloudflare / CloudFront responde el 96 % desde caché y tu origen solo recibe 2.000 RPS. De repente, el origen se desploma recibiendo 45.000 RPS porque una campaña de marketing envió enlaces con un parámetro único por usuario (`?utm_click_id=9f8a7b...`) y la CDN trata cada URL con query string distinto como una clave de caché diferente (`Cache Status: MISS`). ¿Cuál es la mitigación inmediata en el borde (Edge)?",
    "o": [
      "Configurar en la CDN una regla de normalización de Cache Key para ignorar los parámetros de seguimiento (`utm_*`, `fbclid`, `gclid`) al buscar en caché (o eliminarlos en el Edge), devolviendo la tasa de acierto de caché al 96 % en segundos sin tocar el backend.",
      "Apagar la CDN y apuntar el DNS público directamente a los servidores de origen.",
      "Pedir a los clientes por redes sociales que borren manualmente el parámetro de la URL antes de hacer clic.",
      "Multiplicar por 25 el tamaño del clúster de base de datos antes de mirar las cabeceras de la CDN."
    ],
    "a": 0,
    "e": "Cuando parámetros de tracking o timestamps aleatorios en la query string forman parte de la Cache Key de la CDN, cada visitante provoca un `Cache MISS` (Cache Busting accidental) y golpea directamente al origen. Ignorar esos query params en la Cache Key de la CDN mitiga el incidente en segundos desde el borde."
  },
  {
    "id": "sre-60",
    "d": 6,
    "t": "Agotamiento de IPs en Subred de Kubernetes",
    "q": "Durante una prueba de recuperación ante desastres, tu clúster de Kubernetes (que usa un CNI de IP nativa del VPC como AWS VPC CNI o Azure CNI) intenta escalar 200 pods nuevos. Los nodos tienen CPU y RAM de sobra, pero los pods se quedan en `ContainerCreating` con el error: `Failed to create pod sandbox: plugin type=\"aws-cni\" failed (add): add cmd: failed to assign an IP address to container`. ¿Qué recurso se agotó?",
    "o": [
      "Se agotaron las direcciones IPv4 disponibles en la subred (subnet CIDR) del VPC donde residen los nodos worker (o el límite de ENIs/IPs por nodo), ya que cada pod consume una IP real de la subred.",
      "Se agotó el espacio en disco del registro de imágenes Docker Hub.",
      "Los contenedores no tienen definida una etiqueta `app` en sus metadatos.",
      "El puerto 80 del contenedor ya está ocupado por otro pod en una subred diferente."
    ],
    "a": 0,
    "e": "Con plugins CNI que asignan IPs directamente del rango de la subred del VPC (AWS VPC CNI, Azure CNI, GKE VPC-native), una subred `/24` (251 IPs útiles) se queda sin direcciones rápidamente al escalar nodos y pods. El error ocurre en la fase `ContainerCreating` (después de que el scheduler ya eligió el nodo) cuando el plugin CNI pide una IP secundaria al VPC y la subred está llena."
  }
],
    why: {
  "sre-01": [
    null,
    "Esperar 25 minutos con un 18 % de fallos en pagos quema la mitad del presupuesto de error mensual cuando ya tienes una versión anterior probada lista para restaurar el servicio en 1 minuto.",
    "La línea de tiempo apunta directamente al despliegue de código a las 03:08 AM; escalar la base de datos a ciegas no corrige un bug de aplicación recién introducido.",
    "Silenciar una alerta P1 activa oculta el incidente sin reducir en absoluto el impacto que están sufriendo los usuarios."
  ],
  "sre-02": [
    null,
    "El uso promedio de CPU del nodo es una métrica de infraestructura (causa potencial), no un SLI de la latencia percibida por el usuario.",
    "La mediana (p50) ignora por definición a la mitad más lenta de las peticiones; puede estar en 80 ms mientras el 5 % de los usuarios sufre timeouts.",
    "Un contador acumulado de éxitos totales no mide la duración ni detecta degradaciones en la cola de distribución."
  ],
  "sre-03": [
    null,
    "Una ventana única de 1 minuto al 0.1 % se dispara por cualquier micro-corte o reinicio aislado, generando enorme fatiga de alertas por falsos positivos.",
    "Si alertas recién cuando el presupuesto llegó al 0 %, ya es demasiado tarde para reaccionar y proteger el SLO.",
    "Sin una ventana corta (p. ej. 5m) en condición AND, la ventana de 6 horas seguirá manteniendo la alerta activa durante horas después de que el incidente ya fue resuelto (mal tiempo de reset)."
  ],
  "sre-04": [
    null,
    "Si el Incident Commander se pone a tocar producción en silencio, abandona su rol de mando y añade un cuarto actor descoordinado al caos.",
    "Expulsar a los especialistas elimina la capacidad técnica necesaria para resolver el incidente; el problema no es la cantidad de expertos, sino la falta de coordinación centralizada.",
    "El postmortem se redacta después de mitigar y resolver el incidente; para eso está el Scribe tomando notas de la línea de tiempo en vivo."
  ],
  "sre-05": [
    null,
    "Cerrar un postmortem como \"error humano\" y pedir \"más cuidado\" garantiza que el incidente vuelva a ocurrir cuando otro ingeniero esté cansado o bajo presión.",
    "Quitar el acceso a todos los entornos detiene el trabajo de ingeniería; el objetivo es poner barreras técnicas y automatización segura en producción, no paralizar al equipo.",
    "Ocultar incidentes destruye la transparencia psicológica necesaria para aprender de los fallos y mejorar la fiabilidad."
  ],
  "sre-06": [
    null,
    "La CPU puede estar ociosa (esperando en I/O wait) precisamente porque el cuello de botella está en la saturación de la cola del disco.",
    "Los códigos 404 del frontend indican rutas no encontradas del cliente, no fallos de hardware ni saturación de almacenamiento en la base de datos.",
    "El volumen de código desplegado no mide utilización, saturación ni errores de un recurso físico según el método USE."
  ],
  "sre-07": [
    null,
    "Modificar el SLO cada vez que se incumple convierte el objetivo en una métrica de vanidad inútil y oculta que los usuarios están recibiendo un mal servicio.",
    "Desplegar cambios grandes sin pruebas cuando el presupuesto de error ya está agotado viola frontalmente el contrato de Error Budget y multiplica el riesgo de otra caída.",
    "Manipular o borrar datos de monitorización no mejora la experiencia del usuario ni corrige la inestabilidad del sistema."
  ],
  "sre-08": [
    null,
    null,
    "Bloquear PagerDuty en el móvil deja al servicio sin cobertura de guardia ante incidentes reales; hay que arreglar las reglas de alerta en el origen.",
    "Aumentar aún más la sensibilidad de las alertas de CPU empeorará el ruido y acelerará el síndrome de alerta ignorada (cry-wolf)."
  ],
  "sre-09": [
    null,
    "Incumplir la cadencia de comunicación acordada deja a clientes y dirección a ciegas y provoca que decenas de personas interrumpan al equipo técnico pidiendo estado.",
    "Culpar a terceros sin pruebas daña la credibilidad del equipo SRE y desvía la atención si el fallo resulta ser interno.",
    "Bloquear la comunicación con el resto de la organización impide que soporte y negocio activen sus planes de contingencia."
  ],
  "sre-10": [
    null,
    "Un procedimiento mecánico y repetitivo que se ejecuta 35 veces al día es la definición exacta de Toil, no de arquitectura estratégica.",
    "El Error Budget mide indisponibilidad del servicio frente al SLO, no horas humanas gastadas en tareas manuales repetitivas.",
    "Entregar credenciales privilegiadas de base de datos a usuarios finales sería una vulnerabilidad crítica de seguridad y gobernanza."
  ],
  "sre-11": [
    null,
    "Exit Code 137 siempre corresponde a 128 + 9 (SIGKILL), enviado casi siempre por el OOM Killer del kernel Linux, no a fallos de DNS.",
    "Kubernetes no suma requests y limits: `requests` se usa para reservar capacidad en el scheduler y `limits` es el tope máximo permitido en el cgroup.",
    "La CPU y la memoria se gestionan en subsistemas de cgroups distintos (`cpu` vs `memory`); subir la CPU no impide un `OOMKilled` por exceso de RAM."
  ],
  "sre-12": [
    null,
    "En Kubernetes estándar el swap está deshabilitado o restringido, y la métrica `container_cpu_cfs_throttled_periods_total` mide específicamente pausas de cuota de CPU, no memoria.",
    "La saturación de disco no incrementa los periodos de throttling del planificador CFS de CPU.",
    "Los pods en Kubernetes nunca migran en vivo de nodo cada 100 ms; una vez programado, un pod permanece en su nodo hasta que se elimina."
  ],
  "sre-13": [
    null,
    "Hacer la `livenessProbe` aún más agresiva (100 ms y fallo al primer intento) hará que cualquier pausa mínima de GC o red mate todos los pods instantáneamente.",
    "En un Deployment de Kubernetes solo se permite `restartPolicy: Always`; además, dejar los pods muertos sin reiniciar no evita que hayan sido matados por la sonda.",
    "Las sondas las ejecuta localmente el `kubelet` de cada nodo contra sus propios pods; no existe un límite de 50 pods por namespace."
  ],
  "sre-14": [
    null,
    "La estrategia `Recreate` mata todos los pods antiguos antes de levantar los nuevos, causando una caída del 100 % del servicio en cada despliegue.",
    "Cambiar un Deployment solo actualiza los pods y los Endpoints del servicio; jamás reinicia los nodos worker.",
    "Las `readinessProbes` funcionan con cualquier tipo de Service (`ClusterIP`, `NodePort`, `LoadBalancer`) y con los Ingress Controllers que leen `EndpointSlices`."
  ],
  "sre-15": [
    null,
    "El kubelet no borra la caché ARP cada 100 ms, y desactivar CoreDNS dejaría a todo el clúster sin resolución de nombres.",
    "Un Service `ClusterIP` es una IP virtual gestionada por reglas iptables/IPVS en cada nodo; no hace broadcast UDP a internet.",
    "El protocolo DNS estándar en el clúster viaja en texto plano sobre UDP/TCP puerto 53; no usa cifrado RSA-4096 por consulta."
  ],
  "sre-16": [
    null,
    "Destruir `/var/lib/kubelet` en un nodo con carga productiva activa rompe el nodo abruptamente sin reprogramar ordenadamente los pods.",
    "La API de Eviction funciona las 24 horas; el bloqueo es una protección deliberada porque desalojar el pod violaría el PDB configurado.",
    "Borrar `kube-system` destruiría los componentes críticos del plano de control y red de todo el clúster (CoreDNS, CNI, kube-proxy)."
  ],
  "sre-17": [
    null,
    "Si el volumen no existiera el error sería de montaje (`AttachVolume` / `MountVolume`), no un conflicto de afinidad zonal en el scheduler.",
    "El scheduler ni siquiera descarga ni inspecciona el `Dockerfile` durante la fase de asignación de nodo (`Scheduling`).",
    "El evento indica específicamente `Insufficient cpu` en 8 nodos y conflicto de afinidad de volumen en los otros 4, no falta de memoria."
  ],
  "sre-18": [
    null,
    null,
    "Quitar todas las sondas hace que el balanceador envíe peticiones de usuarios a pods que aún están arrancando, devolviendo errores 500/502 durante 90 segundos.",
    "Bloquear el servicio en 1 sola réplica durante una campaña con 300 % más de tráfico provocará la caída inmediata por sobrecarga."
  ],
  "sre-19": [
    null,
    "Las `NetworkPolicies` operan a nivel del plugin CNI de los pods (Calico, Cilium, etc.); no borran las tablas de rutas del VPC.",
    "Las `NetworkPolicies` filtran paquetes pero nunca cambian el protocolo de transporte de una aplicación de TCP a SCTP.",
    "Es justo al revés: las `NetworkPolicies` están diseñadas para controlar el tráfico de los pods dentro del clúster y sus salidas."
  ],
  "sre-20": [
    null,
    "No hace falta reiniciar el nodo físico; basta con recrear los pods del Deployment mediante un rolling restart sin downtime.",
    "`envFrom` lee el objeto `Secret` o `ConfigMap` almacenado en el API Server (`etcd`) en el momento de crear el contenedor, no desde GitHub.",
    "El proceso en Linux nunca recarga su bloque inicial de variables de entorno `environ` por sí solo, ni en 24 horas ni en un año."
  ],
  "sre-21": [
    null,
    "Borrar `__consumer_offsets` destruiría el progreso de lectura de todos los grupos de consumidores de todo el clúster de Kafka.",
    "`acks` es una propiedad exclusiva del productor; no controla los timeouts de sesión ni el ciclo de `poll()` de los consumidores.",
    "Subir `max.poll.records` a 5000 haría que cada lote tardara 4000 segundos (más de 1 hora), garantizando que el consumidor sea expulsado siempre."
  ],
  "sre-22": [
    null,
    "`acks = all` espera confirmación de las réplicas de los brokers en el ISR, nunca de los consumidores. Cambiar a `acks = 0` elimina toda garantía de durabilidad.",
    "Kafka usa un número impar de controladores (KRaft/ZooKeeper) para quórum y cualquier número de brokers; el fallo aquí es que `min.insync.replicas` igualaba a `replication.factor`.",
    "`min.insync.replicas` define cuántas réplicas de una misma partición deben estar sincronizadas para aceptar escrituras con `acks = all`."
  ],
  "sre-23": [
    null,
    "Borrar el tópico de producción eliminaría 400.000 eventos válidos de clientes por culpa de un único registro malformado.",
    "Como el error de parseo del JSON es determinista, reiniciar la tarea cada segundo fallará eternamente en el mismo offset sin avanzar.",
    "Apagar Elasticsearch dejaría fuera de servicio el motor de búsqueda y haría que el conector fallara por conexión rechazada."
  ],
  "sre-24": [
    null,
    "Como el tópico tiene 24 particiones, los 24 pods extra quedarían completamente inactivos (sin ninguna partición asignada), porque una partición no se divide entre dos consumidores del mismo grupo.",
    "Los productores de Kafka no eligen la partición según la salud del disco, sino aplicando el hash (murmur2) sobre la clave del mensaje.",
    "Dentro de un Consumer Group pueden trabajar en paralelo tantos consumidores activos como particiones tenga el tópico (en este caso, hasta 24)."
  ],
  "sre-25": [
    null,
    "Multiplicar por 20 los reintentos y reducir el timeout a 50 ms amplificará aún más el ataque de denegación de servicio autoinfligido.",
    "Saltarse los balanceadores y apuntar todos los clientes a un único pod destruirá ese pod instantáneamente.",
    "Retener artificialmente las conexiones durante 60 segundos agotará todos los sockets y descriptores de archivo del servidor."
  ],
  "sre-26": [
    null,
    "Dejar sockets abiertos sin timeout agota los hilos y conexiones del cliente ante cualquier caída de red.",
    "El verbo HTTP por sí solo no hace idempotente la lógica de negocio si tu código ejecuta un cargo nuevo cada vez que recibe la petición; además, los cobros no deben enviarse por `GET`.",
    "TCP evita duplicados de paquetes dentro de una misma conexión abierta, pero cuando la aplicación cierra el socket y abre una nueva conexión HTTP para reintentar, para TCP es una conversación completamente nueva."
  ],
  "sre-27": [
    null,
    "Un timeout de 10 minutos en el API Gateway retendría miles de conexiones abiertas ante cualquier degradación, tumbando también el propio Gateway.",
    "Eliminar los timeouts es un antipatrón crítico en producción: un único bloqueo aguas abajo colgaría todos los servicios indefinidamente.",
    "Reiniciar la base de datos tiraría abajo a todos los clientes del sistema en lugar de cancelar únicamente la consulta huérfana."
  ],
  "sre-28": [
    null,
    "Detener las ventas porque falló un carrusel accesorio de recomendaciones convierte un fallo menor en un incidente crítico de ingresos.",
    "Reintentar cargar toda la página cada 200 ms desde todos los navegadores multiplicaría por 5 la carga sobre toda la plataforma.",
    "Acoplar la base de datos transaccional de pedidos con el contenedor de inferencia en GPU rompería el aislamiento de recursos y la disponibilidad."
  ],
  "sre-29": [
    null,
    "Si publicas primero en Kafka y luego falla el INSERT en PostgreSQL (p. ej. por restricción de integridad o caída), el almacén despachará un pedido que no existe ni se cobró en la base de datos.",
    "`acks=0` solo oculta los errores de red perdiendo mensajes silenciosamente cuando el broker o la red fallan.",
    "Desactivar las transacciones SQL dejaría la propia base de datos relacional en estado inconsistente ante cualquier error intermedio."
  ],
  "sre-30": [
    null,
    "No existe la memoria RAM infinita; sin GC ni límite de cola el proceso agotará la memoria física en cuestión de segundos.",
    "Reducir los hilos de salida a 1 hará que el drenado a disco sea aún más lento y que la cola en memoria se llene más rápido.",
    "Cuando la JVM o el runtime lanza `OutOfMemoryError`, el heap ya está agotado; ignorarlo y seguir intentando alocar objetos volverá a fallar de inmediato."
  ],
  "sre-31": [
    null,
    "Un cambio de 15s a 20s en el intervalo de scrape no reduce el número de series temporales únicas (4.8 millones) que deben mantenerse en el índice y la memoria RAM.",
    "Convertir un `Counter` en un `Histogram` sería muchísimo peor: multiplicaría las 4.8 millones de series por el número de buckets (p. ej. ×12 = 57 millones de series).",
    "El cuello de botella y el `OOMKilled` ocurren en la base de datos de series temporales (Prometheus), no en el frontend de visualización (Grafana)."
  ],
  "sre-32": [
    null,
    "Es exactamente al revés: `rate()` está diseñado exclusivamente para métricas de tipo `Counter` (contadores que solo suben), nunca para `Gauge`.",
    "PromQL acepta cualquier unidad de tiempo (`s`, `m`, `h`, `d`, `w`, `y`); el problema es que `30s` es demasiado corto respecto al `scrape_interval` de `30s`.",
    "Los contadores de Prometheus jamás deben reiniciarse manualmente; crecen de forma monótona y `rate()` calcula la diferencia por segundo."
  ],
  "sre-33": [
    null,
    "Tomar el mínimo (`min`) mostraría la mejor réplica ociosa y ocultaría por completo las réplicas saturadas donde sufren los usuarios.",
    "Multiplicar un promedio por 0.99 es una operación aritmética sin ningún sentido estadístico.",
    "Prometheus calcula percentiles globales entre cientos de réplicas perfectamente siempre que se usen histogramas (`_bucket`) agregados por la etiqueta `le`."
  ],
  "sre-34": [
    null,
    "`Thanos Compactor` no usa consenso Raft; ejecutar varias réplicas sobre el mismo bucket corrompe los bloques por escrituras concurrentes.",
    "Borrar el bucket destruiría todo el historial de métricas de largo plazo de la organización.",
    "Las consultas de Grafana las atiende `Thanos Querier` (apoyándose en Sidecars y Store Gateways), nunca el Compactor."
  ],
  "sre-35": [
    null,
    "El objetivo central de Thanos es precisamente permitir pares de Prometheus en alta disponibilidad sin punto único de fallo.",
    "Dividir entre 2 en los paneles fallaría en cuanto uno de los dos Prometheus entre en mantenimiento (mostraría la mitad del tráfico real).",
    "`Thanos Sidecar` es el componente estándar que expone la StoreAPI por gRPC; Grafana nunca lee los archivos TSDB por SSH."
  ],
  "sre-36": [
    null,
    null,
    "Poner `trace_id` (que es único por cada petición) como label de Prometheus provocaría una explosión de cardinalidad inmediata y tumbaría la TSDB.",
    "Volcar toda la base de datos en texto plano por stdout saturaría el disco, la red y el colector de logs además de exponer datos sensibles."
  ],
  "sre-37": [
    null,
    "Una tasa calculada con `rate()` sobre un contador nunca es menor que cero.",
    "Cuando una expresión en PromQL devuelve un vector vacío (sin series), Prometheus NO dispara la alerta: por eso la ausencia de datos es silenciosa si no se vigila con `up == 0` o `absent()`.",
    "Vigilar pantallas a mano las 24 horas es el antipatrón opuesto a la ingeniería de confiabilidad automatizada."
  ],
  "sre-38": [
    null,
    "`rate()` jamás devuelve valores negativos ni detiene Prometheus; corrige internamente las caídas de valor como reinicios del contador.",
    "`deriv()` calcula la derivada por regresión lineal para métricas `Gauge` (como uso de disco) y sí daría negativo ante un reinicio; nunca debe usarse en `Counters`.",
    "Los contadores de Prometheus viven en memoria del proceso instrumentado y no requieren persistencia externa gracias a que `rate()` maneja sus reinicios."
  ],
  "sre-39": [
    null,
    "Eliminar los logs de errores 5xx y excepciones dejaría al equipo completamente ciego durante los incidentes reales.",
    "Las métricas y trazas son mucho más ligeras y económicas que volcar cuerpos JSON de 200 KB en cada petición exitosa.",
    "No es una medida técnica de gestión de observabilidad."
  ],
  "sre-40": [
    null,
    "El muestreo probabilístico al inicio (Head-based) al 1 % descartaría también el 99 % de los errores y de las peticiones lentas, porque al inicio aún no han ocurrido.",
    "Romper la propagación de `traceparent` partiría cada traza distribuida en fragmentos inconexos imposibles de seguir entre servicios.",
    "Si borras los spans de backend, pierdes precisamente la visibilidad de qué microservicio o consulta de base de datos causó la lentitud o el error."
  ],
  "sre-41": [
    null,
    "Fijar 50.000 conexiones directas en PostgreSQL agotará la memoria RAM en procesos del sistema operativo y hundirá el servidor por contención de locks y planificación.",
    "Abrir y cerrar una conexión TCP + TLS + autenticación PostgreSQL en cada petición HTTP añade decenas de milisegundos de latencia y satura la CPU del motor.",
    "Dejar 1 solo pod sin escalado hará que ese único pod colapse ante el tráfico del evento."
  ],
  "sre-42": [
    null,
    "Reducir el TTL a 1 segundo provocará una estampida contra la base de datos cada segundo en lugar de cada 5 minutos.",
    "`FLUSHALL` borra todas las claves de Redis a la vez, provocando una estampida masiva sobre absolutamente todas las consultas de la plataforma.",
    "Borrar los índices hará que el JOIN tarde minutos en lugar de 2.5 segundos, colapsando la base de datos de forma permanente."
  ],
  "sre-43": [
    null,
    "Los `SELECT` en PostgreSQL adquieren un `ACCESS SHARE LOCK` que no bloquea a otros `SELECT` ni `INSERT`; el bloqueo ocurre solo cuando un `ACCESS EXCLUSIVE LOCK` (DDL) se interpone en la cola de espera.",
    "Borrar los datos de producción para hacer un cambio de esquema es inaceptable.",
    "`VACUUM FULL` también toma un `ACCESS EXCLUSIVE LOCK` y reescribe toda la tabla en disco, lo que empeoraría drásticamente el bloqueo en hora pico."
  ],
  "sre-44": [
    null,
    "RPO y RTO son dimensiones independientes: aunque levantes el sitio secundario en 2 minutos (cumpliendo el RTO de 10m), los 45 segundos de datos que nunca llegaron por replicación asíncrona se habrán perdido.",
    "Con 4 horas de lag perderías 4 horas completas de transacciones al hacer failover, incumpliendo masivamente el RPO = 0.",
    "Un backup semanal tendría un RPO de hasta 7 días, no de 0 segundos."
  ],
  "sre-45": [
    null,
    "El sharding particiona rangos disjuntos por diseño; aquí dos nodos están escribiendo en el mismo rango sin coordinarse, corrompiendo las claves primarias.",
    "No es un simple retraso de lectura: ambos nodos están aceptando escrituras conflictivas que no se pueden reconciliar sin pérdida de datos.",
    "Bajar el intervalo del ping a 1 ms hará que cualquier micro-corte de red dispare el Split-Brain aún más rápido."
  ],
  "sre-46": [
    null,
    "Las réplicas de lectura solo reciben cambios desde el primario; nunca borran datos del primario.",
    "El `COMMIT` en el primario persiste en el WAL de inmediato; el retraso está en la propagación asíncrona hacia la réplica de lectura.",
    "No hace falta renunciar a las réplicas de lectura: la mayoría de las lecturas pueden seguir yendo a las réplicas y solo las lecturas inmediatas tras una escritura del mismo usuario van al primario."
  ],
  "sre-47": [
    null,
    "Guardar el backup en `/tmp` del mismo servidor no protege ante la pérdida del disco o instancia y además se borra al reiniciar.",
    "`gzip` comprime los bytes que recibe por `stdin`; un archivo `.gz` de 20 bytes es la cabecera de un flujo vacío porque `pg_dump` falló al autenticar.",
    "Los proveedores cloud garantizan la infraestructura física, pero el borrado accidental de datos o bugs de aplicación son responsabilidad del cliente (Shared Responsibility Model)."
  ],
  "sre-48": [
    null,
    "Los discos SSD no tienen cabezales mecánicos ni requieren desfragmentación cada 2 horas.",
    "Linux no convierte un sistema de archivos montado de ext4 a FAT32 por su cuenta.",
    "Los enlaces de fibra óptica no tienen \"créditos\" que se agoten a las 3 horas."
  ],
  "sre-49": [
    null,
    null,
    "El número de puerto TCP (5432) es un identificador lógico de capa de transporte y no tiene ningún impacto en el rendimiento de la CPU.",
    "Las consultas parametrizadas usan los índices con total normalidad y además permiten reutilizar planes de ejecución."
  ],
  "sre-50": [
    null,
    "Sin `maxmemory`, cuando Redis agote la memoria del nodo o contenedor, el OOM Killer matará el proceso de Redis entero perdiendo todas las sesiones y toda la caché de golpe.",
    "Una clave gigante sin expiración nunca libera memoria y terminaría llenando la instancia igualmente.",
    "Reiniciar Redis cada 10 minutos desconectaría a todos los usuarios activos de la plataforma 6 veces por hora."
  ],
  "sre-51": [
    null,
    "No es ningún malware: es el bucle de control declarativo estándar de ArgoCD cuando `selfHeal` está habilitado.",
    "`kubectl set env` guarda el cambio inmediatamente en `etcd`; el problema es que ArgoCD vuelve a aplicar el manifiesto que está en Git.",
    "Borrar los CRDs de ArgoCD en mitad de un incidente puede eliminar en cascada todas las aplicaciones desplegadas si no se tienen los finalizers controlados."
  ],
  "sre-52": [
    null,
    "El puerto 443 es estándar para cualquier cliente HTTPS (navegadores, APIs, SDKs, cURL).",
    "Las claves criptográficas no caducan por el número de conexiones cURL.",
    "Desactivar la validación de certificados TLS (`verify=False`) abre la puerta a ataques Man-in-the-Middle (MitM) y nunca es una solución aceptable en producción."
  ],
  "sre-53": [
    null,
    null,
    "El protocolo DNS no impone ningún mínimo de 72 horas; el tiempo de caché depende exclusivamente del valor numérico del TTL en segundos configurado en el registro.",
    "Los registros `A` son siempre para direcciones IPv4 (para IPv6 se usan registros `AAAA`), con o sin incidente."
  ],
  "sre-54": [
    null,
    "Aplicar un plan que dice `2 to destroy` sin revisarlo en producción borrará recursos activos causando una caída inmediata.",
    "Borrar el `tfstate` hace que Terraform olvide toda la infraestructura existente e intente crear todo duplicado o falle por colisión de nombres.",
    "`terraform destroy` eliminaría toda la infraestructura gestionada en producción."
  ],
  "sre-55": [
    null,
    "HTTP no tiene ningún límite de 100 peticiones por minuto por protocolo.",
    "BGP es un protocolo de enrutamiento entre sistemas autónomos, no un algoritmo de cifrado en el NAT Gateway.",
    "El verbo HTTP (`POST` vs `OPTIONS`) no cambia el hecho de que abrir un socket TCP nuevo por petición agota la tabla de puertos SNAT."
  ],
  "sre-56": [
    null,
    "Dejar una credencial de producción expuesta públicamente durante 6 meses garantiza que sea explotada por atacantes automatizados.",
    "Los bots monitorizan el firehose de commits públicos de GitHub en tiempo real; un `git push --force` posterior no borra las copias que ya capturaron.",
    "Distribuir secretos de producción en canales abiertos de chat vuelve a comprometer la credencial."
  ],
  "sre-57": [
    null,
    "Usar `-lock=false` desactiva la protección contra ejecuciones simultáneas y tarde o temprano corromperá el archivo `terraform.tfstate`.",
    "Borrar el bucket o la tabla de estado destruiría el estado de toda tu infraestructura.",
    "Renombrar recursos en los archivos `.tf` no libera un bloqueo activo en el backend remoto y además planificaría destruir y recrear todos los recursos."
  ],
  "sre-58": [
    null,
    "Los túneles IPSec transportan paquetes IP agnósticos al contenido (les da igual si dentro viaja JSON, XML o binario); la diferencia real es el tamaño del paquete.",
    "En una red de 5 ms de latencia, un paquete de 1.500 bytes tarda microsegundos adicionales en serializarse, nunca 60 segundos.",
    "`ping` usa paquetes ICMP Echo Request/Reply (que son pequeños por defecto, 56–64 bytes), no TCP puerto 80."
  ],
  "sre-59": [
    null,
    "Si el origen ya está colapsado con 45.000 RPS, quitar la CDN enviará el 100 % del tráfico directo al origen sin ninguna protección.",
    "No es viable ni efectivo pedir a millones de usuarios que editen URLs a mano.",
    "Escalar la base de datos por 25 toma tiempo, cuesta una fortuna y es innecesario cuando el contenido es estático/cacheable y se resuelve en 10 segundos normalizando la Cache Key en la CDN."
  ],
  "sre-60": [
    null,
    "El mensaje proviene del plugin de red `aws-cni` al intentar asignar una dirección IP al sandbox del pod, antes siquiera de descargar capas de imagen o llenar el disco.",
    "Las etiquetas de Kubernetes son opcionales para que el plugin CNI asigne una IP al pod.",
    "En Kubernetes cada pod tiene su propio namespace de red e IP propia, por lo que varios pods pueden escuchar en el puerto 80 sin colisionar entre sí."
  ]
},
    glossary: [
  {
    "term": "acks=all (Kafka)",
    "cat": "Kafka",
    "d": 3,
    "def": "Configuración del productor de Kafka que exige que el líder espere confirmación de todas las réplicas en sincronía (ISR) antes de dar por exitosa la escritura.",
    "tip": "Combínalo siempre con min.insync.replicas=2 y replication.factor=3 para durabilidad sin perder disponibilidad ante la caída de 1 broker."
  },
  {
    "term": "Amplificación de reintentos (Retry Storm)",
    "cat": "Sistemas Distribuidos",
    "d": 3,
    "def": "Cascada de fallos en la que múltiples clientes reintentan inmediatamente peticiones fallidas contra un servicio degradado, multiplicando su carga e impidiendo que se recupere.",
    "tip": "Se previene con Exponential Backoff + Jitter, presupuestos de reintentos (Retry Budget) y Circuit Breakers."
  },
  {
    "term": "Blameless Postmortem",
    "cat": "Incidentes",
    "d": 1,
    "def": "Análisis post-incidente centrado en entender las causas sistémicas, brechas de observabilidad y barreras de seguridad ausentes, sin culpar ni castigar al individuo que ejecutó la acción."
  },
  {
    "term": "Burn Rate (Velocidad de quema)",
    "cat": "SLOs",
    "d": 1,
    "def": "Velocidad relativa a la que un servicio consume su presupuesto de error (Error Budget). Un burn rate de 1 consume el presupuesto exacto en la ventana del SLO; un burn rate de 14.4 consume el 2 % del presupuesto mensual en 1 hora.",
    "tip": "Alerta a guardia (page) solo cuando el burn rate sea alto tanto en ventana larga (1h) como en ventana corta (5m)."
  },
  {
    "term": "Cache Stampede (Thundering Herd)",
    "cat": "Datos y Caché",
    "d": 5,
    "def": "Avalancha de consultas simultáneas a la base de datos cuando expira una clave muy solicitada en caché y cientos de hilos intentan recalcularla a la vez.",
    "tip": "Mitiga con Request Coalescing (Singleflight / lock), stale-while-revalidate o añadiendo jitter al TTL."
  },
  {
    "term": "Canary Deployment",
    "cat": "Despliegues",
    "d": 2,
    "def": "Estrategia de despliegue que encamina un porcentaje pequeño del tráfico real (p. ej. 1–5 %) a la nueva versión y compara sus SLIs (errores, latencia) antes de promoverla al 100 %."
  },
  {
    "term": "Cardinalidad (High Cardinality)",
    "cat": "Observabilidad",
    "d": 4,
    "def": "Número total de combinaciones únicas de valores de etiquetas (labels) en una métrica. Etiquetas con valores ilimitados (user_id, request_id, IP) disparan el consumo de RAM e índice en Prometheus/Datadog.",
    "tip": "Nunca pongas IDs de usuario, sesión o petición en labels de métricas; llévalos a logs o trazas."
  },
  {
    "term": "CFS Quota Throttling",
    "cat": "Kubernetes",
    "d": 2,
    "def": "Pausa forzosa impuesta por el Completely Fair Scheduler de Linux cuando los hilos de un contenedor agotan su cuota de CPU (limits.cpu) antes de que termine la ventana de 100 ms, disparando la latencia de cola p99."
  },
  {
    "term": "Circuit Breaker",
    "cat": "Sistemas Distribuidos",
    "d": 3,
    "def": "Patrón en el cliente que deja de invocar una dependencia remota cuando su tasa de fallo supera un umbral, devolviendo un error inmediato o fallback durante un tiempo de enfriamiento."
  },
  {
    "term": "conntrack (nf_conntrack)",
    "cat": "Redes y Linux",
    "d": 6,
    "def": "Tabla del kernel Linux que rastrea el estado de todas las conexiones de red activas para NAT y firewall. Si se llena, el kernel descarta paquetes nuevos silenciosamente (nf_conntrack: table full, dropping packet)."
  },
  {
    "term": "Consumer Lag (Kafka)",
    "cat": "Kafka",
    "d": 3,
    "def": "Diferencia entre el último offset producido en una partición (log-end-offset) y el último offset confirmado por el grupo de consumidores."
  },
  {
    "term": "CrashLoopBackOff",
    "cat": "Kubernetes",
    "d": 2,
    "def": "Estado en el que un contenedor falla repetidamente tras arrancar y el kubelet aplica una espera exponencial (10s, 20s, 40s… hasta 5 min) antes de volver a reiniciarlo."
  },
  {
    "term": "Dead Letter Queue (DLQ)",
    "cat": "Kafka",
    "d": 3,
    "def": "Cola o tópico secundario al que se desvían los mensajes que no pueden procesarse tras varios intentos (poison pills), permitiendo que el consumidor continúe avanzando."
  },
  {
    "term": "Error Budget (Presupuesto de error)",
    "cat": "SLOs",
    "d": 1,
    "def": "El margen de indisponibilidad o fallos permitido por el SLO (100 % − SLO). Mientras haya presupuesto, se prioriza velocidad de entrega; si se agota, se prioriza fiabilidad y corrección de deuda técnica."
  },
  {
    "term": "Exemplar",
    "cat": "Observabilidad",
    "d": 4,
    "def": "Referencia a una traza concreta (trace_id) adjunta a una muestra de métrica (p. ej. un bucket de histograma de latencia), que permite saltar de un pico en Grafana directamente a la traza lenta."
  },
  {
    "term": "Exponential Backoff + Jitter",
    "cat": "Sistemas Distribuidos",
    "d": 3,
    "def": "Algoritmo de reintento que multiplica el tiempo de espera tras cada fallo y le suma un valor aleatorio (jitter) para evitar que todos los clientes reintenten de forma sincronizada."
  },
  {
    "term": "Fullchain (Cadena TLS)",
    "cat": "Seguridad y Redes",
    "d": 6,
    "def": "Archivo de certificado que concatena el certificado del servidor (hoja) seguido de los certificados de las autoridades intermedias necesarios para que clientes estrictos (cURL, SDKs, JVM) validen la firma hasta la CA raíz."
  },
  {
    "term": "Golden Signals (4 Señales Doradas)",
    "cat": "Observabilidad",
    "d": 4,
    "def": "Las cuatro métricas esenciales definidas por Google SRE para vigilar cualquier sistema: Latencia (Latency), Tráfico (Traffic), Errores (Errors) y Saturación (Saturation)."
  },
  {
    "term": "Graceful Shutdown",
    "cat": "Kubernetes",
    "d": 2,
    "def": "Proceso ordenado al recibir SIGTERM en el que la aplicación deja de aceptar peticiones nuevas, termina de procesar las peticiones en vuelo y cierra conexiones antes de finalizar el proceso."
  },
  {
    "term": "Head-of-Line Blocking",
    "cat": "Redes y Sistemas",
    "d": 3,
    "def": "Fenómeno en el que un mensaje o petición lenta al principio de una cola o partición bloquea el procesamiento de todos los elementos que vienen detrás."
  },
  {
    "term": "histogram_quantile (PromQL)",
    "cat": "Observabilidad",
    "d": 4,
    "def": "Función de PromQL que estima un cuantil (p. ej. 0.95 o 0.99) a partir de los buckets acumulativos (_bucket) de un histograma de Prometheus."
  },
  {
    "term": "Hot Partition (Partición caliente)",
    "cat": "Kafka",
    "d": 3,
    "def": "Desbalance de carga en Kafka o bases de datos particionadas cuando una clave de particionado muy frecuente concentra la mayoría del tráfico en una sola partición y un único consumidor."
  },
  {
    "term": "Idempotencia",
    "cat": "Sistemas Distribuidos",
    "d": 3,
    "def": "Propiedad de una operación por la cual aplicarla una o varias veces produce exactamente el mismo estado final, imprescindible cuando hay reintentos o entrega at-least-once."
  },
  {
    "term": "Incident Commander (IC)",
    "cat": "Incidentes",
    "d": 1,
    "def": "Persona con la máxima autoridad de coordinación durante un incidente. Dirige la estrategia de mitigación y asigna tareas sin hundirse en la ejecución técnica directa."
  },
  {
    "term": "ISR (In-Sync Replicas)",
    "cat": "Kafka",
    "d": 3,
    "def": "Conjunto de réplicas de una partición de Kafka que están completamente al día con el líder dentro del umbral replica.lag.time.max.ms."
  },
  {
    "term": "Liveness Probe",
    "cat": "Kubernetes",
    "d": 2,
    "def": "Sonda de kubelet que determina si el contenedor está bloqueado (deadlock) y debe ser matado y reiniciado. Nunca debe depender de bases de datos ni servicios externos."
  },
  {
    "term": "Load Shedding",
    "cat": "Sistemas Distribuidos",
    "d": 3,
    "def": "Técnica defensiva en la que un servicio sobrecargado rechaza rápido parte del tráfico entrante para proteger su capacidad de responder a tiempo al resto de las peticiones."
  },
  {
    "term": "max.poll.interval.ms (Kafka)",
    "cat": "Kafka",
    "d": 3,
    "def": "Tiempo máximo que un consumidor de Kafka puede tardar en procesar un lote antes de volver a invocar poll(). Si se supera, el broker lo expulsa del grupo y reasigna sus particiones.",
    "tip": "Causa #1 de rebalanceos en bucle cuando el procesamiento de cada mensaje hace llamadas lentas."
  },
  {
    "term": "Método RED",
    "cat": "Observabilidad",
    "d": 1,
    "def": "Marco de monitorización para servicios orientado a peticiones: Rate (tasa de peticiones/s), Errors (errores/s) y Duration (distribución de latencia)."
  },
  {
    "term": "Método USE",
    "cat": "Observabilidad",
    "d": 1,
    "def": "Marco de monitorización para recursos de hardware/sistema: Utilization (% de tiempo ocupado), Saturation (trabajo en cola esperando) y Errors (errores de recurso)."
  },
  {
    "term": "MTBF / MTTR / MTTD",
    "cat": "Incidentes",
    "d": 1,
    "def": "Mean Time Between Failures (tiempo medio entre fallos), Mean Time To Detect (tiempo hasta detectar) y Mean Time To Recover/Restore (tiempo hasta restaurar el servicio)."
  },
  {
    "term": "ndots:5 (Kubernetes DNS)",
    "cat": "Kubernetes",
    "d": 2,
    "def": "Ajuste por defecto en /etc/resolv.conf de los pods que obliga a probar todos los sufijos de búsqueda del clúster antes de resolver cualquier nombre con menos de 5 puntos."
  },
  {
    "term": "NodeLocal DNSCache",
    "cat": "Kubernetes",
    "d": 2,
    "def": "DaemonSet en Kubernetes que ejecuta un agente de caché DNS en cada nodo para reducir la latencia de resolución DNS y evitar saturar CoreDNS y la tabla conntrack."
  },
  {
    "term": "OOMKilled (Exit Code 137)",
    "cat": "Kubernetes",
    "d": 2,
    "def": "Terminación forzosa de un contenedor con señal SIGKILL (128 + 9 = 137) porque su consumo de memoria RAM superó el límite definido en su cgroup o agotó la memoria del nodo."
  },
  {
    "term": "Outbox Pattern (Transactional Outbox)",
    "cat": "Sistemas Distribuidos",
    "d": 5,
    "def": "Patrón que garantiza consistencia entre una base de datos y Kafka guardando el evento en una tabla local dentro de la misma transacción SQL y publicándolo asíncronamente con CDC/Debezium o un relé."
  },
  {
    "term": "PgBouncer",
    "cat": "Datos y Caché",
    "d": 5,
    "def": "Pooler ligero de conexiones para PostgreSQL que multiplexa miles de conexiones de clientes de aplicación sobre unas pocas conexiones físicas hacia la base de datos."
  },
  {
    "term": "PodDisruptionBudget (PDB)",
    "cat": "Kubernetes",
    "d": 2,
    "def": "Objeto de Kubernetes que limita cuántos pods de una aplicación pueden estar caídos simultáneamente por interrupciones voluntarias (drenado de nodos, actualizaciones de clúster)."
  },
  {
    "term": "Poison Pill",
    "cat": "Kafka",
    "d": 3,
    "def": "Mensaje malformado o inesperado en una cola que provoca que el consumidor falle sistemáticamente cada vez que intenta deserializarlo o procesarlo."
  },
  {
    "term": "preStop Hook",
    "cat": "Kubernetes",
    "d": 2,
    "def": "Acción que el kubelet ejecuta dentro del contenedor justo antes de enviarle SIGTERM al eliminar el pod; clave para dar margen a que los balanceadores retiren el endpoint sin dar errores 502."
  },
  {
    "term": "rate() vs. irate() (PromQL)",
    "cat": "Observabilidad",
    "d": 4,
    "def": "rate() calcula la tasa media por segundo usando todas las muestras de la ventana temporal (ideal para alertas y tendencias); irate() usa solo las dos últimas muestras (reactiva pero volátil)."
  },
  {
    "term": "Readiness Probe",
    "cat": "Kubernetes",
    "d": 2,
    "def": "Sonda de kubelet que indica si un pod está listo para recibir tráfico. Si falla, el pod se retira de los Endpoints del Service pero NO se reinicia."
  },
  {
    "term": "RPO (Recovery Point Objective)",
    "cat": "DRP",
    "d": 5,
    "def": "Cantidad máxima de datos (medida en tiempo, p. ej. 5 minutos) que la organización acepta perder en caso de desastre."
  },
  {
    "term": "RTO (Recovery Time Objective)",
    "cat": "DRP",
    "d": 5,
    "def": "Tiempo máximo que puede transcurrir desde que ocurre un desastre hasta que el servicio vuelve a estar operativo."
  },
  {
    "term": "Self-Heal (ArgoCD)",
    "cat": "GitOps e IaC",
    "d": 6,
    "def": "Opción de sincronización automática de ArgoCD que revierte cualquier cambio manual hecho con kubectl en el clúster para forzar que coincida con el estado declarado en Git."
  },
  {
    "term": "SNAT Port Exhaustion",
    "cat": "Redes y Linux",
    "d": 6,
    "def": "Agotamiento de puertos efímeros de salida en un NAT Gateway o nodo cuando los pods abren miles de conexiones salientes nuevas sin reutilizarlas mediante pools keep-alive."
  },
  {
    "term": "Split-Brain",
    "cat": "Sistemas Distribuidos",
    "d": 5,
    "def": "Escenario catastrófico en el que dos nodos de un clúster pierden comunicación entre sí y ambos asumen simultáneamente el rol de primario, aceptando escrituras divergentes y corrompiendo los datos."
  },
  {
    "term": "Startup Probe",
    "cat": "Kubernetes",
    "d": 2,
    "def": "Sonda de Kubernetes que desactiva las comprobaciones de liveness y readiness hasta que la aplicación termina de arrancar por primera vez, evitando bucles de reinicio en servicios lentos de inicializar."
  },
  {
    "term": "Terraform State Drift",
    "cat": "GitOps e IaC",
    "d": 6,
    "def": "Divergencia entre la infraestructura real desplegada en el proveedor cloud y lo registrado en el archivo terraform.tfstate o el código HCL."
  },
  {
    "term": "Thanos Compactor",
    "cat": "Observabilidad",
    "d": 4,
    "def": "Componente singleton de Thanos que fusiona bloques TSDB en Object Storage, aplica retención y genera bloques de downsampling (5m y 1h). Nunca debe ejecutarse con más de 1 réplica sobre el mismo bucket."
  },
  {
    "term": "Toil (Trabajo operativo repetitivo)",
    "cat": "Incidentes",
    "d": 1,
    "def": "Trabajo manual, repetitivo, automatizable, táctico y sin valor duradero que escala linealmente con el tamaño del servicio. Google SRE recomienda mantenerlo por debajo del 50 % del tiempo del equipo."
  }
]
  };
})(window);
