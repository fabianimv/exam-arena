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
          "Ordenar el rollback inmediato a la versión estable (v2.13.x) para mitigar el impacto al usuario y posponer la depuración del código en caliente.",
          "Autorizar los 25 minutos para desplegar un hotfix hacia adelante (roll-forward) evitando gestionar dos despliegues consecutivos en producción.",
          "Desviar temporalmente las peticiones hacia una cola asíncrona de reintentos mientras el desarrollador compila y valida la corrección en staging.",
          "Reiniciar de forma escalonada todas las réplicas del servicio de pagos para comprobar si el fallo responde a una fuga transitoria de inicialización."
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
          "Percentiles de cola (p95, p99 y p99.9) derivados de histogramas de duración de peticiones en el balanceador.",
          "Mediana (p50) agregada de latencia combinada con la tasa global de solicitudes por segundo del microservicio.",
          "Promedio móvil ponderado del tiempo de respuesta agrupado por tipo de cliente sobre ventanas de cinco minutos.",
          "Tasa agregada de transacciones exitosas (`HTTP 2xx`) normalizada respecto al volumen total de tráfico horario."
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
          "Alerta multi-ventana y multi-burn-rate: exigir simultáneamente (AND) que el burn rate supere 14.4x en la última hora y en los últimos 5 minutos.",
          "Alerta de umbral estático de tasa de error: notificar si los fallos superan el 0.1 % de las peticiones en una ventana deslizante simple de 1 minuto.",
          "Alerta basada en agotamiento absoluto: disparar el aviso de guardia en cuanto el consumo acumulado mensual del presupuesto alcance el 100 %.",
          "Alerta de ventana única extendida: evaluar exclusivamente que el burn rate exceda 6x a lo largo de una ventana móvil continua de 6 horas."
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
          "Establecer control estricto del canal: frenar cambios no coordinados, canalizar toda acción operativa mediante el Ops Lead bajo tu aprobación y ordenar al Scribe registrar la bitácora.",
          "Delegar la conducción del incidente al especialista de mayor antigüedad y retirarte a una sala privada para inspeccionar de forma aislada las métricas de la base de datos.",
          "Revocar de forma preventiva las credenciales de despliegue de los asistentes y asumir tú mismo la ejecución directa de comandos correctivos en los servidores de producción.",
          "Permitir que cada ingeniero continúe ejecutando sus pruebas de forma paralela durante quince minutos para comprobar cuál de las tres hipótesis produce una mejora primero."
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
          "Tratar el error humano como síntoma inicial y priorizar defensas sistémicas: segregar credenciales por entorno, implementar confirmaciones en tooling y diferenciar prompts visuales.",
          "Clasificar la falta de atención individual como causa raíz e instaurar un flujo formal de aprobación manual por correo electrónico antes de ejecutar cualquier script administrativo en consola.",
          "Restringir temporalmente los accesos del ingeniero causante a modo de solo lectura mientras completa un plan de capacitación formal sobre buenas prácticas operativas en producción.",
          "Organizar una sesión departamental para analizar en detalle las equivocaciones individuales cometidas por el operador a fin de generar mayor conciencia y rigor en el equipo."
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
          "Saturación y Errores de almacenamiento: medir la cola de espera de E/S (`await` y `aqu-sz` en `iostat`) y comprobar fallos de hardware en `dmesg` o logs SMART.",
          "Utilización de disco por dispositivo: examinar el porcentaje estático de `%util` en `iostat` asumiendo que un valor inferior al 70 % descarta problemas en el bus.",
          "Saturación del subsistema de red: registrar los paquetes descartados (`rx_dropped`) y eventos de retransmisión TCP en las interfaces físicas conectadas al host.",
          "Utilización de memoria de paginación: verificar la tasa de fallos de página mayores (`pgmajfault`) y el tráfico de intercambio hacia particiones de swap activas."
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
          "Congelar despliegues de producto no críticos y reasignar el esfuerzo de ingeniería a mejoras de estabilidad y pruebas de resiliencia hasta restaurar el presupuesto.",
          "Ajustar temporalmente el objetivo de nivel de servicio (SLO) al 99.5 % durante el cierre de mes para regularizar el saldo negativo y autorizar el despliegue programado.",
          "Habilitar la funcionalidad experimental de inmediato para un 10 % del tráfico mediante un Feature Flag sin detener el ritmo de entrega de nuevas características.",
          "Emitir una excepción de negocio que permita el lanzamiento manteniendo las alertas silenciadas temporalmente hasta que concluya el periodo de prueba de la funcionalidad."
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
          "Fundamentar las alertas que generan guardias (pages) en síntomas percibidos por el usuario, como la tasa de fallos HTTP o burn rate de SLOs, en lugar de métricas de causa aislada.",
          "Degradar las alertas de saturación de recursos sin afectación directa a tickets o paneles de revisión diurna, evitando llamadas nocturnas ante fluctuaciones habituales del HPA.",
          "Elevar el umbral de activación de CPU al 95 % manteniendo el mecanismo de guardia nocturna por buscapersonas ante cualquier pico puntual registrado en los contenedores.",
          "Configurar un script automatizado que reinicie de forma inmediata cualquier pod que supere el 80 % de consumo sostenido para eludir la intervención manual del ingeniero."
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
          "Emitir la actualización en el plazo pautado comunicando el impacto identificado, las maniobras de mitigación en curso y el horario del siguiente informe, sin esperar a aislar la causa raíz.",
          "Postergar la comunicación hasta que concluya el drenado de tráfico hacia contingencia para no generar confusión en caso de que la maniobra técnica experimente contratiempos.",
          "Publicar de inmediato un informe técnico preliminar atribuyendo la anomalía a latencias del proveedor de red de telecomunicaciones para amortiguar la inquietud del negocio.",
          "Suspender los comunicados periódicos a la espera de coordinar una llamada de sincronización extraordinaria con los directores de operaciones y el área legal de la empresa."
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
          "Se define como Toil (tarea manual, repetitiva y sin valor perdurable); debe eliminarse creando una interfaz autoservicio o API auditada para conservar el toil global bajo el 50 %.",
          "Constituye soporte operativo estándar; la práctica recomendada es rotar la atención entre los ingenieros de guardia sin dedicar tiempo de desarrollo a automatizar tareas rutinarias.",
          "Representa deuda técnica de arquitectura; debe documentarse en el backlog general para ser abordada exclusivamente durante el rediseño integral de la plataforma de autenticación.",
          "Corresponde a gobernanza obligatoria; debe mantenerse como intervención manual humana para certificar que ningún proceso automatizado modifique registros de seguridad en producción."
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
          "La JVM requiere memoria nativa fuera del Heap (Metaspace, stacks de hilos y buffers NIO); con `-Xmx2048m` el RSS total excede los 2 GiB del cgroup. Debe fijarse `-XX:MaxRAMPercentage=75.0` o ampliar `limits.memory`.",
          "El planificador de Kubernetes desaloja el contenedor al rebasar `requests.memory: 1Gi` sostenidamente; debe igualarse `requests.memory` a 2 GiB para otorgar clase QoS `Guaranteed` sin modificar las banderas de la JVM.",
          "La recolección de basura `G1GC` genera fragmentación interna en el Heap; debe forzarse el recolector `ParallelGC` y configurar `-XX:MinRAMPercentage=80.0` para que el cgroup gestione la paginación hacia disco.",
          "El proceso agota los descriptores de archivos del contenedor al alcanzar el tope del Heap; debe incrementarse el parámetro `nofile` en la especificación de seguridad del pod manteniendo los 2048 MB de `-Xmx`."
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
          "Sufre CPU CFS Throttling: ráfagas en múltiples goroutines agotan la cuota asignada en fracciones de la ventana de 100 ms, congelando el proceso; se mitiga relajando o retirando `limits.cpu` con `requests.cpu` adecuado.",
          "Las pausas del recolector de basura de Go bloquean la ejecución en ráfagas de tráfico; se mitiga ajustando `GOGC=off` y fijando `GOMEMLIMIT=1500MiB` para evitar que el runtime detenga hilos durante la atención de peticiones.",
          "El pod compite con procesos ruidosos en el mismo nodo físico que degradan su cuota; se mitiga configurando `cpuManagerPolicy: static` en el kubelet para aislar cores exclusivos sin modificar los manifiestos de la aplicación.",
          "El periodo del planificador CFS de Linux es excesivamente prolongado; se mitiga reduciendo el parámetro global `cpu.cfs_period_us` a 10 ms en los nodos para fragmentar las ráfagas sin alterar `limits.cpu` en el deployment."
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
          "Vincular la `livenessProbe` a dependencias externas: el fallo de Redis provocó reinicios masivos de pods; la sonda de vida solo debe evaluar la salud del proceso local, reservando dependencias para la `readinessProbe`.",
          "Configurar un `failureThreshold` insuficiente en la `livenessProbe`: debió fijarse en 20 reintentos con `timeoutSeconds: 5` para tolerar caídas de Redis sin desacoplar las dependencias del endpoint de sondeo local.",
          "Omitir un patrón de circuit breaker dentro del endpoint `/healthz`: debió responder HTTP 200 forzado ante fallos externos transitorios manteniendo la comprobación de bases de datos centralizada en la misma sonda de vida.",
          "Utilizar comprobaciones HTTP en lugar de sondas TCP directas: un `tcpSocket` al puerto de la app hubiera evitado evaluar el endpoint de salud de dependencias sin necesidad de redefinir la arquitectura de sondas del pod."
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
          "La desconexión del endpoint en NGINX y el envío de `SIGTERM` ocurren en paralelo de forma asíncrona; si la app cierra el socket de inmediato, NGINX envía tráfico residual. Se mitiga con un hook `preStop: sleep` y apagado ordenado.",
          "La estrategia `RollingUpdate` mantiene conexiones persistentes en keepalive hacia los pods viejos; se mitiga reduciendo `keepalive_timeout` a 0 en el Ingress NGINX para forzar reconexiones TCP continuas en cada petición HTTP entrante.",
          "El planificador no espera a drenar las tablas de iptables antes de apagar pods; se mitiga configurando `maxUnavailable: 0` y `maxSurge: 50%` en el Deployment para que nunca se retiren pods antiguos sin duplicar capacidad total.",
          "El balanceador NGINX requiere invalidar la resolución interna de DNS; se mitiga forzando la directiva `resolver-validity: 1s` en la configuración global del controlador Ingress para sincronizar la lista de réplicas en tiempo real."
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
          "La directiva `ndots:5` en `/etc/resolv.conf` fuerza a resolver contra todos los search domains internos antes del dominio externo; se mitiga implementando `NodeLocal DNSCache`, reduciendo `ndots:2` o usando FQDNs absolutos con punto final.",
          "La falta de réplicas en CoreDNS satura el canal UDP de los workers; se mitiga configurando un `HorizontalPodAutoscaler` sobre CoreDNS guiado por peticiones por segundo y habilitando afinidad de sesión en el servicio `kube-dns`.",
          "La pérdida de paquetes por tablas conntrack saturadas se debe a colisiones de puertos UDP efímeros; se mitiga forzando a los pods a utilizar exclusivamente TCP para resolución de nombres mediante la opción `use-vc` en `dnsConfig`.",
          "El plugin `cache` de CoreDNS carece de tiempo de expiración suficiente; se mitiga incrementando el parámetro `ttl` a 3600 segundos en el bloque upstream del `Corefile` para retener las respuestas externas en memoria de nodo."
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
          "Revisar `kubectl get pdb`: un `PodDisruptionBudget` con `minAvailable: 100%` (o `maxUnavailable: 0`), o con réplicas secundarias no `Ready`, deja `ALLOWED DISRUPTIONS = 0` y veta el desalojo.",
          "Comprobar bloqueos en las interfaces de red CNI del nodo y forzar la expulsión ejecutando `kubectl drain --force --disable-eviction=true` asumiendo que existen sockets abiertos bloqueantes en el Pod.",
          "Verificar si existen volúmenes con afinidad zonal (`PersistentVolumeClaims`) atados al pod y forzar el reinicio del daemon `systemd` del kubelet para saltar la validación del scheduler.",
          "Revisar si los demás nodos del clúster contienen taints `NoSchedule` no toleradas y deshabilitar temporalmente el admission controller de mutación en el API Server del plano de control."
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
          "El volumen EBS es zonal y reside en `us-east-1a` (de ahí el conflicto de afinidad en los 4 nodos de otras zonas), y los 8 nodos de `us-east-1a` carecen de capacidad libre para cubrir el `requests.cpu` del pod.",
          "La especificación del Pod tiene una regla de `nodeAffinity` mal configurada hacia etiquetas obsoletas, mientras que los 8 nodos restantes se encuentran acaparados por pods con prioridad `system-node-critical`.",
          "El controlador CSI de AWS EBS perdió conectividad con la API regional de EC2, provocando que el scheduler interprete erróneamente los límites de volúmenes adjuntos en las instancias de zonas secundarias.",
          "El volumen EBS alcanzó el límite de ancho de banda IOPS garantizado en la zona original, por lo que el scheduler rechaza ubicar el contenedor en nodos que superen el 70 % de reserva acumulada de CPU."
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
          "Configurar una `startupProbe` con margen holgado (p. ej. 120s) para pausar la evaluación de `livenessProbe` hasta que concluya la inicialización intensiva en CPU del contenedor.",
          "Afinar la política `behavior.scaleUp` del HPA (con ventana de estabilización y tasa de aumento controlada) para evitar sobre-escalados inducidos por el pico de arranque del pod.",
          "Eliminar la comprobación de `readinessProbe` y elevar `initialDelaySeconds` en la `livenessProbe` a 180s para que el tráfico ingrese de inmediato sin esperar al calentamiento local.",
          "Configurar el HPA para que escale exclusivamente con base en la métrica de uso de memoria de nodo (`container_memory_working_set_bytes`) desactivando las señales de CPU del Deployment."
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
          "Al declarar `Egress` con `egress: []` se impone un default-deny estricto que bloquea todo el tráfico saliente, incluidos DNS (puerto 53) y RDS; se deben autorizar explícitamente ambas salidas en la sección `egress`.",
          "Una sección `egress: []` vacía permite todo el tráfico saliente por defecto según la especificación de Kubernetes; el bloqueo DNS respondería a una incompatibilidad con el driver CNI del clúster.",
          "El tráfico hacia servicios esenciales como `kube-dns` está exento por defecto en las políticas; el aislamiento solo restringiría IPs públicas externas pero mantendría la conexión hacia RDS en la VPC.",
          "La regla aislaría únicamente las comunicaciones salientes hacia otros pods dentro del mismo namespace `pagos`, dejando intactas las conexiones TCP destinadas a endpoints externos al clúster."
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
          "Las variables de entorno en Linux se asignan al iniciar el proceso y no mutan en caliente; para absorber la nueva clave del `Secret` es indispensable reiniciar los pods con `kubectl rollout restart deployment/...`.",
          "El kubelet sincroniza variables de entorno únicamente al completarse el intervalo de sondeo periódico de 15 minutos; basta con aguardar el ciclo del daemon del nodo sin necesidad de recrear los contenedores vivos.",
          "El `Secret` quedó bloqueado con la propiedad `immutable: true` en el API Server; es necesario recrear el objeto `Secret` completo en etcd para que los punteros de `secretKeyRef` se refresquen en el runtime.",
          "El proceso contenedor requiere una señal `SIGHUP` para releer su archivo `/proc/$PID/environ`; se soluciona enviando un comando `kill -1` al PID principal sin provocar un nuevo rollout del Deployment."
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
          "El lote tarda 400 s y supera `max.poll.interval.ms` (300 s), provocando la expulsión por el coordinador; se mitiga reduciendo `max.poll.records` (p. ej. a 50) y/o aumentando `max.poll.interval.ms`.",
          "El hilo de heartbeat se bloquea por la latencia del webservice externo excediendo `session.timeout.ms` (45 s); se mitiga reduciendo `heartbeat.interval.ms` a 1000 ms y triplicando el pool de brokers.",
          "El timeout de confirmación `default.api.timeout.ms` expira durante el commit; se mitiga desactivando `enable.auto.commit` y ejecutando `commitSync()` de forma síncrona tras procesar cada factura individual.",
          "El asignador `RangeAssignor` revoca todas las particiones en bloque; se mitiga migrando a `CooperativeStickyAssignor` sin alterar el volumen de mensajes devueltos por cada invocación del método `poll()`."
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
          "Con 3 réplicas, `min.insync.replicas = 3` exige que el 100 % del ISR confirme; si cae 1 broker quedan 2 y se veta la escritura. La arquitectura estándar es `replication.factor = 3` con `min.insync.replicas = 2`.",
          "El tópico perdió el quórum transaccional de réplicas sincronizadas; debe reconfigurarse temporalmente `min.insync.replicas = 1` con `acks = all` para continuar produciendo aunque solo sobreviva un broker en el clúster.",
          "El clúster no pudo reelegir líderes durante el reinicio; debe habilitarse `unclean.leader.election.enable = true` a nivel de broker para permitir que réplicas rezagadas asuman el liderazgo temporal.",
          "La configuración del productor colisionó con el broker; debe cambiarse el productor a `acks = 1` para que confirme exclusivamente en el broker líder ignorando el valor configurado de `min.insync.replicas`."
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
          "Configurar `errors.tolerance = all` con `errors.deadletterqueue.topic.name` y headers de contexto; reiniciar la tarea para desviar el mensaje corrupto a la DLQ sin frenar la ingesta de los 400.000 eventos.",
          "Avanzar manualmente el offset del grupo de Kafka Connect mediante `kafka-consumer-groups --shift-by 1` sobre la partición afectada para saltar el registro envenenado sin modificar la configuración del worker.",
          "Ajustar `errors.tolerance = all` con `errors.log.enable = true` sin definir DLQ, descartando los mensajes con errores de parseo directamente al log del contenedor para maximizar el throughput hacia Elasticsearch.",
          "Modificar el mapeo dinámico del índice en Elasticsearch a `\"dynamic\": true` para que acepte cualquier formato en el campo de fecha corrupto sin necesidad de desviar el flujo de mensajes hacia un tópico secundario."
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
          "Sesgo de clave (Key Skew / Hot Partition): el productor usa una clave de particionado hiperfrecuente (como el ID del almacén central o un string nulo) que la función hash asigna invariablemente a la partición 7.",
          "Escalar horizontalmente el Deployment consumidor de 24 a 48 réplicas para asociar múltiples pods concurrentes a la partición 7 mediante hilos de trabajo paralelos dentro del mismo grupo de consumidores de Kafka.",
          "Fallo en el protocolo de rebalanceo del broker coordinador que asignó incorrectamente múltiples particiones virtuales al pod de la partición 7; se mitiga forzando un reinicio ordenado de todo el clúster.",
          "Desalineación del algoritmo de compresión Snappy en el broker de la partición 7 que ralentiza la descompresión en el cliente; se soluciona migrando el formato de almacenamiento a `compression.type=producer`."
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
          "Exponential Backoff con Jitter aleatorio en clientes, Retry Budget (tope de 10 % de peticiones adicionales), Circuit Breakers para cortar llamadas ante fallos y Load Shedding / Rate Limiting preventivo en el servidor.",
          "Escalar réplicas reactivamente mediante un HPA agresivo con umbral de CPU al 40 % para absorber el caudal masivo de reintentos concurrentes sin rechazar conexiones ni aplicar contrapresión preventiva a los clientes.",
          "Configurar timeouts ultracortos de 200 ms en los clientes con reintentos lineales inmediatos y habilitar el encabezado `Retry-After: 1` en todas las respuestas de error del catálogo para amortiguar el tráfico.",
          "Configurar un proxy inverso con caché `stale-while-revalidate` que devuelva respuestas cacheadas viejas de catálogo, manteniendo a los clientes reintentando indefinidamente contra el balanceador de carga."
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
          "Exigir un token de idempotencia (`Idempotency-Key`) generado por el cliente y guardado de forma atómica en el servidor con el cobro; ante reintentos con la misma clave, retornar el resultado previo sin duplicar el cargo.",
          "Implementar un bloqueo distribuido en Redis basado en el identificador de usuario con expiración de 10 segundos, rechazando peticiones si el lock sigue activo mientras el procesador bancario responde.",
          "Exigir al cliente una consulta `GET /status` previa a cada reintento para comprobar si el cobro se registró, delegando en la lógica de polling del cliente la decisión de reenviar la solicitud de pago.",
          "Realizar una consulta `SELECT` sobre la base de datos de pagos filtrando por importe y timestamp reciente justo antes de enviar la transacción externa, abortando si detecta registros coincidentes."
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
          "Alinear timeouts en cascada decreciente aguas abajo y propagar Deadlines/contextos de cancelación (`context.Context` / gRPC deadlines); si el gateway corta la llamada, los servicios aguas abajo abortan el trabajo de inmediato.",
          "Elevar el timeout del API Gateway a 35 segundos para situarlo por encima del tiempo acumulado de los servicios dependientes, garantizando que el gateway nunca interrumpa peticiones activas de backend.",
          "Implementar un patrón Bulkhead aislando el pool de conexiones del servicio A hacia el servicio B, limitando los hilos asignados a la integración sin necesidad de sincronizar plazos ni propagar cancelaciones.",
          "Asincronizar la comunicación convirtiendo las llamadas HTTP en eventos mediante una cola intermedia con persistencia, respondiendo un ticket HTTP 202 al usuario para que consulte periódicamente el estado."
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
          "Tratar la recomendación como servicio accesorio con timeout estricto (150 ms) y fallback a caché de productos más vendidos u ocultar el widget, asegurando que la navegación y compra nunca se interrumpan.",
          "Añadir autoescalado urgente al clúster de GPUs elevando el timeout de llamada a 5 segundos en el backend, permitiendo que las peticiones esperen el tiempo necesario hasta que la inferencia de IA concluya.",
          "Implementar reintentos en segundo plano desde el frontend del navegador mediante WebSockets para refrescar el carrusel una vez que el servicio de recomendaciones se recupere, manteniendo el bloqueo en backend.",
          "Interponer una cola en memoria con reintentos infinitos dentro del backend de producto para garantizar que ninguna petición al modelo de recomendación se pierda durante los picos de saturación de GPU."
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
          "Patrón Transactional Outbox: escribir el pedido y el evento en la tabla `outbox` en la misma transacción ACID local; un proceso desacoplado (CDC o poller) retransmite los eventos hacia Kafka con garantías de entrega.",
          "Invertir la secuencia de ejecución: publicar en primer lugar el evento en el tópico de Kafka con confirmación completa de réplicas y consolidar luego la transacción ACID en PostgreSQL con manejo explícito de errores.",
          "Implementar un coordinador de transacciones distribuidas en dos fases (Two-Phase Commit / XA) entre el broker Kafka y el motor PostgreSQL para consolidar el commit simultáneo de ambos almacenes de datos.",
          "Envolver la invocación al productor Kafka en un bucle síncrono de reintentos intensivos dentro de la transacción de base de datos antes de ejecutar el `COMMIT` final de la compra en la tabla de pedidos."
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
          "Colas acotadas y contrapresión (Backpressure / Load Shedding): fijar capacidad máxima en la cola y responder `HTTP 429 / 503` al saturarse para frenar la entrada y forzar a los emisores a pausar o reintentar.",
          "Asignación dinámica de memoria: ampliar el Heap de la JVM al 90 % de la RAM física y duplicar el pool de hilos consumidores a 32 para acelerar el vaciado de la estructura en memoria antes de que ocurra OOM.",
          "Desborde a almacenamiento secundario: serializar temporalmente el exceso de eventos a archivos swap en el directorio `/tmp` local cuando la memoria supere el 80 %, evitando rechazar tráfico HTTP entrante.",
          "Colas basadas en referencias débiles (`WeakReference`): permitir que el recolector de basura purgue automáticamente objetos antiguos cuando la memoria alcance el límite crítico sin interrumpir la ingesta de datos."
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
          "Desplegar `metric_relabel_configs` con `action: labeldrop` en Prometheus para descartar `user_id` y `session_token` en la ingesta, eliminando luego esas etiquetas del código de la app para moverlas a logs o trazas.",
          "Reducir la retención de la base de datos con `--storage.tsdb.retention.time=2h` en Prometheus para purgar bloques antiguos en disco, manteniendo las etiquetas de usuario para no perder granularidad en Grafana.",
          "Configurar una regla de grabación (`recording rule`) que precalcule `sum by(status)` sobre la métrica original cada minuto, conservando las etiquetas de alta cardinalidad en el endpoint `/metrics` de la aplicación.",
          "Habilitar compresión de bloques en caliente y delegar la ingesta en un clúster de Thanos Receive mediante `remote_write`, permitiendo persistir las 4.8 millones de series activas sin alterar las etiquetas del contador."
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
          "`rate()` precisa al menos 2 muestras en la ventana para calcular la derivada; con `[30s]` y un intervalo de 30s solo cae 1 muestra (o 0 por jitter). La ventana mínima recomendada es 4× el scrape (p. ej. `[2m]`).",
          "Debe sustituirse `rate()` por la función `irate(http_requests_total[30s])`, ya que `irate()` calcula la tasa instantánea utilizando una única muestra sin requerir interpolación de muestras adicionales en el rango.",
          "Falta fijar la directiva `Min step: 30s` en las opciones de consulta del panel de Grafana para obligar a que el motor PromQL sincronice exactamente la resolución gráfica con el reloj del exportador de métricas.",
          "PromQL no puede extrapolar valores sin aplicar un modificador `offset 30s`, el cual compensa el retardo de scraping y alinea la ventana móvil con el último bloque consolidado de la base de datos TSDB."
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
          "Promediar percentiles es matemáticamente inválido porque distorsiona la distribución ponderada; debe usarse un `Histogram` y agregar con `histogram_quantile(0.99, sum(rate(http_response_time_seconds_bucket[5m])) by (le))`.",
          "Debe aplicarse una media ponderada multiplicando el p99 de cada pod por su volumen de peticiones: `sum(http_response_time_p99 * rate(http_requests_total[5m])) / sum(rate(http_requests_total[5m]))` manteniendo el `Summary`.",
          "El operador correcto sobre resúmenes precalculados es `max(http_response_time_p99)`, ya que refleja con precisión el peor percentil registrado por cualquier pod activo sin necesidad de migrar a histogramas.",
          "Debe utilizarse la función agregadora `quantile(0.99, http_response_time_p99)` en PromQL para calcular el percentil de percentiles sobre el vector instantáneo de réplicas en lugar de promediarlas aritméticamente."
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
          "El límite finito más alto del histograma era `le=\"10.0\"` (+Inf); ante valores mayores, `histogram_quantile()` interpola linealmente dentro del último bucket y reporta su borde (`10.0s`). Deben ajustarse los buckets al rango real.",
          "El parámetro global `scrape_timeout: 10s` abortó la recolección de las muestras más lentas; Prometheus trunca automáticamente cualquier valor de histograma que exceda el tiempo de sondeo configurado en el job.",
          "La expresión omitió el bucket infinito (`le=\"+Inf\"`) al calcular la suma en PromQL; la función `histogram_quantile()` asigna por defecto el valor del mayor bucket disponible cuando la suma total de muestras no coincide.",
          "La biblioteca de métricas del microservicio implementa un temporizador con corte en 10 segundos para mitigar contención en memoria, desviando peticiones más lentas a un contador de fallos independiente."
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
          "`group_by` (agrupa por etiquetas comunes como `cluster`), `group_wait` (espera inicial para acumular avisos del mismo incidente) y `group_interval` (espera antes de emitir tandas con nuevas alertas del grupo).",
          "`repeat_interval` extendido a 12 horas combinado con `resolve_timeout: 5m` para congelar las notificaciones de nuevos contenedores sin necesidad de definir criterios de agregación por etiquetas.",
          "`mute_time_intervals` configurado sobre el receptor de Slack para silenciar temporalmente los canales de comunicación durante la ejecución programada de despliegues en los entornos productivos.",
          "`inhibit_rules` globales que descarten cualquier alerta subsiguiente tras registrarse la primera notificación sin aplicar amortiguación en `group_wait` ni filtros de agregación en la ruta."
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
          "Activar Exemplars en los histogramas de Prometheus vinculando el `trace_id` a puntos de muestra, permitiendo saltar desde el panel en Grafana hacia el visor de trazas en Tempo o Jaeger.",
          "Inyectar de forma transparente `trace_id` y `span_id` como campos clave en los logs estructurados JSON de la app para correlacionar las trazas con los registros del servicio.",
          "Registrar el `trace_id` como una etiqueta (`label`) permanente en el contador de peticiones HTTP de Prometheus para filtrar métricas individuales por identificador de transacción.",
          "Configurar un script en cron que consulte la API de Jaeger buscando trazas lentas para volcar periódicamente sus identificadores en una tabla estática dentro de la base de datos operativa."
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
          "Añadir alertas sobre `up == 0` o `absent(up{job=\"billing-service\"}) == 1`, verificar caídas anómalas en el tráfico total y disponer de una alerta Watchdog para garantizar la operatividad de Alertmanager.",
          "Encadenar la expresión métrica con un vector escalar por defecto mediante `(rate(billing_errors_total[5m]) or on() vector(0)) > 5` para asegurar que la regla nunca retorne un resultado vacío durante fallos de red.",
          "Configurar la directiva `keep_firing_for: 30m` en la regla de Prometheus para retener de forma indefinida el último estado de fallo evaluado antes de la desconexión del exportador de métricas.",
          "Reducir el parámetro global `evaluation_interval` de 1 minuto a 5 segundos para que el motor de reglas detecte la pérdida de conexión antes de que las series sean declaradas obsoletas (stale)."
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
          "Detectan caídas de valor entre muestras sucesivas interpretándolas como un reinicio del contador a cero, sumando el nuevo valor al delta anterior para entregar siempre una tasa positiva y continua.",
          "Retornan un valor diferencial negativo transitorio que obliga a encapsular el cálculo en `clamp_min(rate(...), 0)` para prevenir descensos anómalos imprevistos en paneles y alertas basadas en umbrales estáticos.",
          "Descartan por completo la ventana de cálculo afectada retornando `NaN` hasta que el nuevo contador acumule un número de muestras superior al registrado previamente antes de reiniciarse.",
          "Exigen añadir la función `resets(orders_processed_total[5m])` dentro de la fórmula matemática para corregir manualmente la discontinuidad de la serie temporal ante reinicios imprevistos."
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
          "Filtrar de inmediato en el agente/colector el descarte de cuerpos HTTP 200, parchar el código para no volcar payloads masivos en respuestas exitosas y fijar cuotas y alertas de volumen de ingestión por servicio.",
          "Habilitar compresión de flujo en el daemon colector y desviar la totalidad de los logs masivos hacia un bucket frío de almacenamiento de objetos (S3/GCS), preservando el volcado detallado de payloads en el código.",
          "Ampliar la cuota de ingesta diaria en la plataforma de observabilidad negociando un tier corporativo superior y reducir el periodo de retención de índices calientes de 30 a 5 días para controlar el costo.",
          "Reconfigurar el pipeline de ingestión para transformar el body JSON en un hash criptográfico SHA-256 único, almacenando el valor procesado en el índice primario para permitir búsquedas forenses directas."
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
          "Tail-based sampling en el OpenTelemetry Collector, reteniendo spans en un buffer para decidir si conservar o descartar la traza completa tras verificar si hubo error o si la latencia rebasó 1.5 segundos.",
          "Head-based sampling probabilístico configurado al 1 % en el SDK del proxy de entrada, delegando en el span raíz la predicción del comportamiento y duración de las dependencias posteriores.",
          "Rate-limiting sampling local en cada microservicio fijando un tope de 50 trazas por segundo, asegurando un muestreo determinista en origen sin desplegar una capa intermedia de Collectors.",
          "Span-to-metrics sampling en el backend de observabilidad, convirtiendo los spans menores de 1.5s en métricas de agregación tras haber ingerido el 100 % del tráfico en la plataforma central."
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
          "Desplegar un pooler como PgBouncer en modo transacción para multiplexar conexiones lógicas sobre un pool acotado de procesos físicos (100–200) en PostgreSQL, ajustando el pool por réplica.",
          "Aumentar `max_connections = 2000` en `postgresql.conf` y escalar verticalmente la RAM de la instancia de base de datos para absorber el coste de memoria de los procesos dedicados de backend.",
          "Configurar un balanceador TCP de capa 4 (HAProxy) delante de la base de datos para encolar las solicitudes de conexión excedentes y repartirlas entre réplicas de lectura de forma balanceada.",
          "Reducir el tamaño del pool local a 3 conexiones por pod en el ORM de la aplicación y configurar un backoff exponencial de reintento de conexión para evitar exceder el límite global permitido."
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
          "Implementar Request Coalescing (Singleflight) o cerrojo distribuido con patrón `stale-while-revalidate`: solo un hilo recalcula el valor en la base de datos mientras el resto espera o lee el dato previo.",
          "Ampliar el TTL en Redis a 86400 segundos (24 horas) y programar una tarea cron nocturna que regenere la clave fuera del horario comercial, prescindiendo de sincronización en tiempo real.",
          "Derivar las 10.000 consultas concurrentes hacia una réplica de lectura exclusiva de PostgreSQL para aislar el impacto del cache miss sin modificar la lógica de expiración de claves.",
          "Inyectar cabeceras HTTP `Cache-Control: public, max-age=300` en la respuesta web para forzar a los navegadores de los clientes a almacenar el resultado localmente durante 5 minutos."
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
          "El DDL en espera de `ACCESS EXCLUSIVE LOCK` encola y bloquea todas las transacciones posteriores (`SELECT`, `INSERT`); se evita fijando un `lock_timeout` corto (p. ej. 2s) con reintentos y técnicas expand-and-contract.",
          "PostgreSQL eleva automáticamente el nivel de aislamiento a `SERIALIZABLE` durante cualquier operación `ALTER TABLE`; se evita ejecutando el cambio con la opción `SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED`.",
          "El motor de base de datos genera un volcado completo de la tabla a disco temporal para reorganizar las tuplas físicas; se evita ejecutando previamente un `VACUUM ANALYZE` para precargar el mapa de espacio libre.",
          "Las consultas `SELECT` quedan pausadas porque el planificador invalida la memoria compartida del catálogo del sistema; se evita ejecutando el script dentro de un bloque `BEGIN ... END` con nivel de bloqueo explícito `SHARE`."
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
          "Incumple el RPO = 0: con replicación asíncrona y 45s de lag, promover la réplica ante la caída de la Zona A pierde 45s de datos confirmados; un RPO de cero exige replicación síncrona o quórum multi-AZ.",
          "Satisface holgadamente ambos compromisos: el desfase de 45 segundos se ubica muy por debajo de la ventana de 10 minutos del RTO y el motor asíncrono garantiza durabilidad de datos al conmutar réplicas.",
          "Incumple el RTO de 10 minutos debido a la latencia de red entre zonas, pero satisface el RPO = 0 al persistir los registros de WAL de forma diferida en el almacenamiento redundante de la réplica.",
          "Satisface el RPO de cero segundos gracias a que el motor relacional bloquea los commits confirmados en el buffer del primario hasta que el nodo secundario emite el acuse de recibo de red."
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
          "Fallo de Split-Brain: se evita con quórum distribuido impar (p. ej. Patroni con etcd en 3 AZs), mecanismos de fencing (STONITH) para aislar el nodo antiguo y evitando scripts de failover sin consenso externo.",
          "Condición de Falla Bizantina: se previene configurando un umbral de reintentos ICMP de 60 segundos y complementando el script de conmutación con una consulta SQL de sondeo directo al puerto de la base de datos.",
          "Colisión de Réplicas Activas: se mitiga habilitando replicación multi-master bidireccional activa-activa para que ambas instancias fusionen automáticamente las modificaciones divergentes en segundo plano.",
          "Condición de Cascada en Cascada: se erradica configurando un balanceador DNS Anycast con comprobación de salud en capa 7 para conmutar las IPs públicas sin requerir coordinación entre nodos de datos."
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
          "Bajo MVCC, la transacción retiene el `xmin` más antiguo; `autovacuum` no puede reciclar tuplas muertas creadas tras ese punto para no violar el snapshot, generando bloat. Se mitiga con `statement_timeout`.",
          "La consulta analítica adquirió un `ACCESS EXCLUSIVE LOCK` que impidió la ejecución concurrente del proceso `autovacuum`; se subsana programando un `VACUUM FULL` diario inmediatamente después de la consulta.",
          "El parámetro `maintenance_work_mem` resultó insuficiente para almacenar los punteros de tuplas muertas en memoria, forzando a `autovacuum` a abortar la limpieza para evitar bloqueos del planificador.",
          "La consulta saturó el búfer de replicación lógica WAL, obligando al recolector a suspender el barrido de páginas de disco hasta que las réplicas confirmaran la recepción de todos los cambios transaccionales."
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
          "Primero `SELECT pg_cancel_backend(pid);` (envía `SIGINT` cancelando la consulta sin cortar el socket); si no cede, `SELECT pg_terminate_backend(pid);` (envía `SIGTERM` cerrando la conexión y el proceso).",
          "Primero invocar `SELECT pg_terminate_backend(pid);` para abortar la sesión del cliente; si la consulta permanece colgada, forzar la finalización con `kill -9 <PID>` sobre el proceso backend en el sistema operativo.",
          "Primero ejecutar `DISCARD ALL` apuntando al identificador de proceso para invalidar bloqueos; como último recurso invocar `VACUUM FULL` sobre las tablas bloqueadas para forzar la liberación de recursos.",
          "Primero invocar `pg_reload_conf()` con un `statement_timeout` reducido para forzar la caducidad; si persiste la retención, ejecutar un reinicio suave del servicio con `systemctl reload postgresql`."
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
          "Volúmenes gp2 usan créditos de ráfaga: acumulan saldo en reposo pero bajo carga continua agotan el bucket y caen al rendimiento base (3 IOPS/GiB); se soluciona migrando a gp3 (IOPS fijos garantizados) o io2.",
          "El planificador de E/S de Linux agotó la memoria asignada a dirty pages en el page cache del kernel, forzando escrituras síncronas bloqueantes a disco; se previene ajustando el parámetro `vm.dirty_ratio` a 5 %.",
          "El sistema de archivos de la base de datos agotó los inodos libres debido a la generación masiva de tablas temporales no indexadas; se soluciona ejecutando un redimensionamiento en línea del disco EBS gp2 en AWS.",
          "La memoria `shared_buffers` de PostgreSQL se saturó por la concurrencia continua, provocando fallos de caché que triplicaron las lecturas físicas en disco; se soluciona ampliando la RAM a 64 GiB en la instancia."
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
          "El código introduce un antipatrón de consulta N+1 en el ORM: para cada una de las 30 peticiones itera ejecutando 200 consultas SQL individuales en lugar de agrupar con `IN` o `JOIN`.",
          "Ausencia de índice B-Tree sobre la clave foránea `items_pedido(pedido_id)`, lo que fuerza al optimizador a realizar un escaneo secuencial íntegro (`Seq Scan`) en cada una de las 6.000 QPS.",
          "Las estadísticas del optimizador de consultas se encuentran desactualizadas en `pg_statistic`, provocando que el motor elija escaneo secuencial en lugar de utilizar el índice existente.",
          "El pool de conexiones de la aplicación carece de `statement_timeout`, acumulando transacciones en espera de bloqueo de fila en la tabla `items_pedido` que saturan la CPU por contención."
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
          "Segregar las cargas: una instancia para sesiones de autenticación sin desalojo destructivo y otra para caché con `allkeys-lru`, o aplicar `volatile-lru` garantizando TTL explícito en claves de catálogo.",
          "Establecer la directiva `maxmemory-policy allkeys-random` para repartir las expulsiones estadísticamente, asumiendo que la elevada proporción de claves de catálogo absorberá la gran mayoría de los desalojos.",
          "Activar persistencia en disco con `appendfsync everysec` (AOF) en la misma instancia para que las sesiones desalojadas por `allkeys-lru` se recarguen transparentemente desde disco ante cada petición.",
          "Migrar la instancia a una topología Redis Cluster de 3 maestros para distribuir el espacio de claves por hash slots, manteniendo la mezcla de sesiones y datos de caché bajo la política `noeviction`."
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
          "ArgoCD tiene `selfHeal: true` y revierte la divergencia con Git; debes aplicar la mitigación mediante commit en GitOps o pausar temporalmente el `auto-sync` en la Application mientras estabilizas el servicio.",
          "Un controlador de políticas de admisión (Kyverno/Gatekeeper) detectó mutación no autorizada del manifiesto y forzó el rollback del Deployment; se soluciona agregando una anotación de exención en los metadatos.",
          "El despliegue fue bloqueado por una condición de carrera con el Deployment Controller de Kubernetes; se mitiga ejecutando `kubectl rollout pause deployment/pagos-api` para congelar la sincronización de ArgoCD.",
          "La aplicación carece de permisos RBAC para actualizar variables de entorno en tiempo de ejecución; se soluciona modificando la directiva `SyncPolicy` en ArgoCD para desactivar la validación estricta de esquemas."
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
          "Instalaste solo el certificado hoja sin la cadena intermedia (`fullchain.pem`); los navegadores descargan el emisor faltante mediante AIA fetching, pero librerías como OpenSSL, Python y JVM exigen la cadena completa.",
          "El balanceador negoció forzosamente TLS 1.3 con algoritmos de curvas elípticas modernas, generando incompatibilidad con librerías HTTP legadas en Java y Python que demandan suites de cifrado RSA tradicionales.",
          "El certificado fue emitido únicamente con Common Name (CN) omitiendo la extensión `Subject Alternative Name` (SAN), la cual es obligatoria para la validación estricta en runtimes modernos de Go, Python y Android.",
          "La Autoridad Certificadora emisora utilizó un algoritmo de firma SHA-1 obsoleto, provocando que los almacenes de confianza de backend rechacen el handshake mientras los navegadores de escritorio toleran la conexión."
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
          "Los servidores DNS recursivos retienen el TTL de 3600s cacheado previamente; el TTL debe reducirse a 60s con al menos 24 a 48 horas de antelación para que el cambio de IP surta efecto inmediato en todos los clientes.",
          "Los clientes con conexiones TCP persistentes (HTTP Keep-Alive o gRPC) no consultan el DNS mientras el socket permanezca abierto; siguen despachando tráfico a la IP antigua salvo que se fuerce el reciclado de la conexión.",
          "Las tablas de enrutamiento BGP Anycast entre regiones de la nube tardan un mínimo de 120 minutos en propagar prefijos modificados, invalidando las actualizaciones en los servidores DNS autoritativos durante ese lapso.",
          "La especificación estándar de DNS veta TTLs inferiores a 300 segundos, obligando a los resolvers recursivos corporativos a elevar automáticamente la caché a 7200 segundos para protegerse de ataques de denegación."
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
          "Cold Start: programar un pod desde cero (scheduling, inicio de runtime y sondas) tarda segundos; si el SLO exige baja latencia, `minReplicas` debe ser al menos 1 o usar réplicas precalentadas en lugar de scale-to-zero.",
          "Fenómeno de Thundering Herd: la concentración repentina de solicitudes tras un periodo ocioso satura el pool de conexiones; se subsana configurando un Circuit Breaker con apertura veloz y reintentos en el Ingress.",
          "Latencia de Cluster Autoscaler: el retraso ocurre exclusivamente al aprovisionar nuevos nodos worker en el proveedor de nube; se resuelve fijando un pool de instancias con nodos de respaldo previamente encendidos.",
          "Inanición de conexiones TCP: el proxy Ingress congela el handshake TLS ante destinos sin endpoints activos; se mitiga reduciendo el parámetro `keepalive_timeout` a 1 segundo para forzar reconexiones continuas."
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
          "Falta de reserva N-1: las regiones operaban sin margen para absorber tráfico ajeno; el failover desbordó `us-east-1`. Se previene aprovisionando margen suficiente en cada región y aplicando Load Shedding en la superviviente.",
          "Fallo en la afinidad de sesiones de Route 53: las cookies pegajosas saturaron el balanceador regional de Virginia; se previene migrando a un algoritmo round-robin ponderado que ignore la procedencia geográfica de los clientes.",
          "Latencia de propagación de los health checks DNS: los chequeos continuaron declarando sana a la región caída durante 15 minutos; se evita reduciendo el intervalo de sondeo a 1 segundo mediante comprobaciones rápidas de Route 53.",
          "Divergencia en el esquema de bases de datos distribuidas: la replicación asíncrona entre regiones bloqueó las transacciones en Virginia; se evita forzando replicación multi-región síncrona bidireccional en todas las tablas."
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
          "Patrón Dual-Key: emitir de inmediato una segunda credencial, inyectarla en producción con rotación ordenada de pods, verificar el tráfico con la nueva llave y revocar la credencial filtrada (o revocar ya si hay abuso).",
          "Restringir la credencial comprometida en la consola del proveedor mediante una lista blanca de IPs NAT del clúster para anular el acceso externo, postergando la rotación de claves a la ventana mensual de mantenimiento.",
          "Revocar de forma instantánea la credencial en la pasarela de pagos asumiendo la caída temporal de cobros como un mal menor, e iniciar después el despliegue manual del nuevo secreto en todos los microservicios.",
          "Transformar el repositorio de GitHub a visibilidad privada de inmediato y purgar el commit con `git filter-repo`, manteniendo la credencial activa en producción al quedar eliminado el acceso público al código."
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
          "Confirmar que no existe ningún proceso de Terraform activo en runners o terminales contra ese backend; una vez asegurado que el bloqueo quedó huérfano, liberar con `terraform force-unlock <LOCK_ID>`.",
          "Eliminar el registro de bloqueo directamente desde la tabla de DynamoDB con `aws dynamodb delete-item` para liberar el pipeline sin aguardar confirmaciones manuales de ingenieros sobre tareas activas.",
          "Ejecutar `terraform refresh` indicando el ID del bloqueo huérfano para obligar a Terraform a sincronizar el estado remoto y limpiar las retenciones de concurrencia de forma desatendida.",
          "Exportar la variable de entorno `TF_CLI_ARGS=\"-lock=false\"` en el pipeline de CI/CD para ejecutar el plan de contingencia ignorando los bloqueos distribuidos de concurrencia en DynamoDB."
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
          "Agujero negro de PMTUD: el encapsulado VXLAN e IPSec reduce el MTU bajo 1.500 bytes y un firewall bloquea mensajes ICMP `Fragmentation Needed`; se mitiga reduciendo el MTU del CNI y activando `TCP MSS Clamping`.",
          "Enrutamiento asimétrico: el tráfico saliente viaja por el túnel IPSec pero las respuestas grandes son devueltas por el Internet Gateway público, donde los firewalls descartan los paquetes por falta de estado TCP.",
          "Agotamiento de la ventana TCP (TCP Window Scale): el router de la VPN carece de búfer para ráfagas mayores de 64 KB, descartando silenciosamente los segmentos que superan la ventana de congestión inicial.",
          "Fragmentación de paquetes UDP en DNS: las respuestas con certificados grandes requieren resolución DNS EDNS0 que excede 512 bytes, siendo bloqueadas por el equipo de seguridad de la red on-premise."
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
          "Normalizar la Cache Key en la CDN para ignorar parámetros de tracking (`utm_*`) o podar query strings en el Edge, restaurando la tasa de acierto en segundos sin alterar el backend ni perder datos analíticos.",
          "Emitir en la cabecera del origen `Cache-Control: public, s-maxage=3600` en todas las respuestas para forzar a la CDN a almacenar el contenido en memoria caché independientemente de las cadenas de consulta enviadas.",
          "Configurar una regla de Rate Limiting en el Edge que bloquee o presente un desafío Captcha a cualquier dirección IP que realice más de 10 solicitudes con parámetros `utm_*` por segundo para proteger el origen.",
          "Implementar una regla de reescritura en el NGINX de origen para eliminar los argumentos de consulta y devolver un redireccionamiento HTTP 301 al usuario hacia la URL limpia para que la CDN la cachee."
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
          "Agotamiento de direcciones IPv4 disponibles en la subred (bloque CIDR) de la VPC donde operan los nodos o límite de interfaces ENI/IPs secundarias por tipo de instancia EC2 para el plugin CNI.",
          "Agotamiento de inodos en el directorio de containerd (`/var/lib/containerd/io.containerd.runtime.v2.task`), impidiendo al plugin CNI generar el archivo de estado del namespace de red para el nuevo pod.",
          "Agotamiento de puertos efímeros de SNAT en el NAT Gateway de la VPC, lo que provoca timeout en las llamadas del plugin CNI al intentar validar conectividad con las APIs de metadatos de la nube.",
          "Alcanzado el límite máximo de cuota de Security Groups por interfaz de red elástica (ENI) en la cuenta de AWS, impidiendo al daemonset `aws-node` adjuntar interfaces de red adicionales al nodo worker."
        ],
        "a": 0,
        "e": "Con plugins CNI que asignan IPs directamente del rango de la subred del VPC (AWS VPC CNI, Azure CNI, GKE VPC-native), una subred `/24` (251 IPs útiles) se queda sin direcciones rápidamente al escalar nodos y pods. El error ocurre en la fase `ContainerCreating` (después de que el scheduler ya eligió el nodo) cuando el plugin CNI pide una IP secundaria al VPC y la subred está llena."
      }
    ],
    why: {
      "sre-01": [
        null,
        "Aceptar una ventana de 25 minutos con 18 % de fallos degrada críticamente la disponibilidad y quema el presupuesto de error existiendo una versión estable ya validada.",
        "Encolar pagos de forma asíncrona sin confirmación bancaria inmediata rompe la semántica de la API y genera acumulación masiva de transacciones pendientes.",
        "El incremento de errores correlaciona exactamente con el despliegue de las 03:08 AM; reiniciar réplicas con el mismo código defectuoso no resolverá el problema de fondo."
      ],
      "sre-02": [
        null,
        "La mediana (p50) solo refleja el centro de la distribución e ignora por completo a los usuarios situados en la cola de peticiones degradadas.",
        "Aunque se agrupe por segmento de clientes, calcular la media aritmética sigue enmascarando los valores atípicos y timeouts que sufren los usuarios lentos.",
        "Un contador de códigos de estado exitosos no mide la duración de las respuestas y pasa por alto peticiones que tardan decenas de segundos en responder."
      ],
      "sre-03": [
        null,
        "Una ventana aislada de 1 minuto al 0.1 % es propensa a falsos positivos por ráfagas o reinicios momentáneos, provocando severa fatiga de alertas.",
        "Alertar recién cuando el presupuesto se ha consumido por completo impide tomar medidas preventivas para proteger el SLO comprometido.",
        "Una ventana única prolongada sin confirmación en ventana corta mantiene la alerta activa durante horas tras resolver el incidente, elevando el tiempo de reset."
      ],
      "sre-04": [
        null,
        "El Incident Commander no debe abandonar la coordinación del grupo ni aislarse en tareas analíticas individuales, perdiendo la visión global del evento.",
        "El IC debe coordinar y delegar, no convertirse en un operador solitario que ejecuta comandos técnicos ni paralizar innecesariamente al equipo operativo.",
        "Permitir acciones concurrentes sin control invalida cualquier correlación causa-efecto y puede provocar fallos cruzados catastróficos en el sistema."
      ],
      "sre-05": [
        null,
        "Añadir aprobaciones manuales no elimina los fallos de diseño de fondo (como credenciales compartidas) y ralentiza innecesariamente las tareas operativas habituales.",
        "Sancionar o aislar al operador fomenta una cultura del miedo y no previene que otro compañero cometa exactamente el mismo fallo técnico en el futuro.",
        "Exponer individualmente a los profesionales destruye la seguridad psicológica y contradice el principio fundamental de un análisis retrospectivo sin culpa."
      ],
      "sre-06": [
        null,
        "En matrices RAID o discos SSD modernos, la métrica `%util` puede aproximarse al 100 % con cargas paralelas normales o parecer baja mientras la cola de peticiones (`await`) se satura.",
        "Aunque la red sea un recurso del método USE, el síntoma explícito del escenario es la degradación de consultas a nivel de almacenamiento local.",
        "Si la memoria libre se encuentra en el 60 %, el cuello de botella reportado reside en el rendimiento de disco y no en contención de memoria virtual o paginación."
      ],
      "sre-07": [
        null,
        "Modificar el SLO de manera reactiva para enmascarar un incumplimiento destruye la utilidad del Error Budget como mecanismo de equilibrio entre velocidad y fiabilidad.",
        "Introducir código nuevo complejo con el presupuesto ya agotado añade riesgo sobre un sistema inestable cuya disponibilidad ya se encuentra comprometida.",
        "Las excepciones operativas no sustituyen la disciplina del Error Budget; silenciar alertas agrava el impacto ante nuevos fallos en lugar de remediarlos."
      ],
      "sre-08": [
        null,
        null,
        "Aumentar ligeramente el porcentaje sobre la misma métrica de causa no resuelve el problema conceptual; sigue disparando guardias por consumo sin impacto real en el cliente.",
        "Reiniciar pods automáticamente ante cargas elevadas provoca interrupción innecesaria de conexiones activas y puede desencadenar tormentas de reinicios en cascada."
      ],
      "sre-09": [
        null,
        "Interrumpir la frecuencia periódica acordada genera incertidumbre institucional y provoca que los interesados interrumpan al equipo técnico demandando novedades.",
        "Emitir conjeturas no contrastadas compromete la credibilidad técnica y legal del equipo si el origen de la degradación termina perteneciendo a la propia infraestructura.",
        "Detener la difusión externa para esperar reuniones directivas aísla a soporte y a los clientes de las instrucciones operativas necesarias durante la contingencia."
      ],
      "sre-10": [
        null,
        "Rotar trabajo puramente manual no reduce la sobrecarga operativa del departamento; el principio SRE busca erradicar el toil mediante soluciones de ingeniería permanente.",
        "Posponer la automatización táctica a la espera de una reescritura futura perpetúa el desperdicio continuado de 3 horas diarias del equipo en tareas mecánicas.",
        "Las exigencias de gobernanza y auditoría se satisfacen mejor mediante herramientas automatizadas con control de acceso e historial criptográfico que con intervenciones manuales en SQL."
      ],
      "sre-11": [
        null,
        "Kubernetes no mata un pod por superar `requests.memory`; los límites cgroup forzados por el kernel corresponden estrictamente a `limits.memory`.",
        "Cambiar de algoritmo de GC no reduce el consumo nativo fuera del Heap (Metaspace, buffers, stacks) que provoca la transgresión del cgroup.",
        "Exit Code 137 (`SIGKILL`) por OOM indica agotamiento de memoria del cgroup, no saturación de descriptores de archivos (`nofile`)."
      ],
      "sre-12": [
        null,
        "La métrica observada mide pausas de cuota de kernel impuestas por CFS (`cpu.cfs_quota_us`), no tiempos de pausa del recolector de basura de Go.",
        "El throttling ocurre porque el propio contenedor agota su cuota permitida en ráfagas multi-hilo, no por interferencia de otros pods en cores compartidos.",
        "Alterar el periodo CFS a nivel de nodo no resuelve el desajuste si el contenedor continúa consumiendo más tiempo de CPU en ráfagas que la cuota asignada."
      ],
      "sre-13": [
        null,
        "Aumentar reintentos en `livenessProbe` mitiga caídas breves pero no soluciona el error arquitectónico; cualquier fallo prolongado de la BD reiniciará en cascada todos los pods.",
        "Enmascarar errores externos con HTTP 200 en `/healthz` anula la utilidad de la sonda en lugar de separar correctamente la vitalidad de la disponibilidad operativa.",
        "Cambiar a `tcpSocket` únicamente comprueba si el puerto responde, pero no resuelve la causa raíz de haber acoplado dependencias en la decisión de reinicio del pod."
      ],
      "sre-14": [
        null,
        "Desactivar keepalive incrementa la sobrecarga de conexiones SSL/TCP y no impide que peticiones en vuelo lleguen a un pod que ya cerró su proceso local.",
        "Ajustar `maxUnavailable: 0` no resuelve la condición de carrera entre la propagación del evento Endpoint a iptables/NGINX y el `SIGTERM` al pod.",
        "El controlador Ingress NGINX actualiza sus backends mediante la API de Endpoints de Kubernetes, no a través de consultas DNS de nombres de host."
      ],
      "sre-15": [
        null,
        "Escalar pods de CoreDNS centralizados no elimina el problema de origen: cada consulta externa sigue generando 5 o más consultas UDP inútiles que saturan conntrack en los nodos.",
        "Forzar TCP (`use-vc`) mitiga la pérdida de paquetes UDP pero agrava la latencia y la sobrecarga de conexiones contra CoreDNS si la búsqueda sigue probando todos los dominios internos.",
        "Ampliar el TTL en CoreDNS no ayuda si las búsquedas fallidas contra subdominios inexistentes (`api.mercadopago.com.default.svc.cluster.local`) devuelven NXDOMAIN sin cachear."
      ],
      "sre-16": [
        null,
        "El flag `--force` en `kubectl drain` ignora pods sin controller (como pods huérfanos), pero la API de desalojo sigue respetando estrictamente el `PodDisruptionBudget`.",
        "Reiniciar kubelet no evade las restricciones de la API de Eviction impuestas a nivel de control plane por el PDB configurado.",
        "El bloqueo reportado proviene de la comprobación del objeto PDB en el namespace de la app, no de taints en los nodos ni de admission controllers."
      ],
      "sre-17": [
        null,
        "El evento `volume node affinity conflict` no es una afinidad declarada en el pod, sino una restricción impuesta por el PersistentVolume al estar anclado a la zona `us-east-1a`.",
        "El mensaje refleja un conflicto de ubicación geográfica de almacenamiento y saturación de CPU, no una indisponibilidad de la API de EC2 ni un fallo en el driver CSI.",
        "El planificador evalúa disponibilidad física de zona y `requests.cpu` no asignado en los nodos; no mide límites de IOPS acumulados del disco para programar pods."
      ],
      "sre-18": [
        null,
        null,
        "Suprimir `readinessProbe` provoca que el tráfico de usuarios se envíe a pods que aún no terminaron de inicializar cachés, disparando errores HTTP 5xx.",
        "Ignorar la CPU y basar el HPA solo en memoria no previene que los pods sean eliminados por liveness ni resuelve la saturación de procesamiento ante el tráfico real."
      ],
      "sre-19": [
        null,
        "En Kubernetes, declarar `egress: []` significa denegar todo el tráfico saliente (lista vacía de reglas permitidas), no permitirlo todo (lo cual se expresa como `egress: [{}]`).",
        "Kubernetes no añade excepciones implícitas para `kube-dns`; si se activa el aislamiento de Egress, hay que permitir explícitamente el puerto 53 UDP/TCP hacia el DNS.",
        "Las políticas de Egress aplican a todo el tráfico que sale del pod, independientemente de si el destino es otro pod local o una base de datos externa fuera del clúster."
      ],
      "sre-20": [
        null,
        "El kubelet nunca actualiza variables de entorno de un contenedor ya en ejecución; estas permanecen inalterables en la memoria del proceso desde su arranque.",
        "Si el Secret se actualizó con éxito para los volúmenes, no es inmutable; la causa es la imposibilidad inherente de Linux de mutar variables de entorno en procesos vivos.",
        "Linux no actualiza el bloque de entorno de un proceso ante una señal `SIGHUP`; la única vía estándar en Kubernetes es reiniciar los pods del Deployment."
      ],
      "sre-21": [
        null,
        "En clientes Kafka modernos el heartbeat corre en un hilo independiente; las pausas por procesamiento lento disparan `max.poll.interval.ms`, no `session.timeout.ms`.",
        "Llamar a `commitSync()` tras cada mensaje bloquea el hilo consumidor elevando la latencia total y no evita rebasar `max.poll.interval.ms` si el lote de `poll()` sigue siendo grande.",
        "El asignador cooperativo suaviza la asignación incremental pero no impide que el coordinador declare muerto al consumidor si este excede `max.poll.interval.ms`."
      ],
      "sre-22": [
        null,
        "Fijar `min.insync.replicas = 1` arriesga pérdida irreversible de datos si el único broker superviviente sufre una falla antes de replicar a los nodos recuperados.",
        "Activar `unclean.leader.election` introduce pérdida de mensajes y corrupción de offsets al permitir que réplicas desincronizadas se conviertan en líderes.",
        "Si `min.insync.replicas` se mantiene en 3 y el ISR cae a 2, el broker rechazará la solicitud del productor con `NotEnoughReplicasException` sin importar el ajuste de `acks`."
      ],
      "sre-23": [
        null,
        "Mover offsets manualmente con `--shift-by` es riesgoso en producción, salta offsets a ciegas y destruye la trazabilidad del payload erróneo para su depuración posterior.",
        "Descartar eventos solo a logs sin DLQ hace que el mensaje corrupto se pierda para reprocesamiento y satura los archivos de registro sin garantías de auditoría.",
        "Si el serializador del conector falla al parsear el JSON antes de enviarlo por HTTP a Elasticsearch, alterar el mapping de Elasticsearch no previene la excepción local en Connect."
      ],
      "sre-24": [
        null,
        "En Kafka una partición solo puede ser consumida simultáneamente por 1 pod en el mismo grupo; añadir más pods dejará las nuevas réplicas inactivas (`idle`).",
        "El síntoma proviene de un volumen desproporcionado de datos producidos hacia esa partición concreta, no de un fallo de asignación por parte del Group Coordinator.",
        "El tipo de compresión no altera la distribución de mensajes entre particiones ni explica por qué la partición 7 concentra 800.000 mensajes frente a 0 en las otras."
      ],
      "sre-25": [
        null,
        "Escalar réplicas reactivamente durante una tormenta de reintentos traslada el colapso a las bases de datos subyacentes y no frena el ciclo de sincronización de reintentos en bucle.",
        "Reintentos lineales inmediatos sin backoff ni jitter concentran oleadas masivas de peticiones concurrentes (thundering herd) que impiden la recuperación del backend.",
        "Mantener reintentos sin Circuit Breaker ni Retry Budget continúa saturando la CPU del servidor con conexiones TCP y peticiones HTTP superfluas."
      ],
      "sre-26": [
        null,
        "Un lock temporal expira si el procesamiento tarda más de 10s; el reintento posterior encontraría el lock libre y ejecutaría un segundo cobro duplicado.",
        "Hacer check-then-act desde el cliente sin garantías de idempotencia en el servidor crea una condición de carrera si la confirmación de la primera petición llega después de la consulta.",
        "Comprobar con un `SELECT` antes de procesar no es atómico con la llamada al procesador bancario externo, sufriendo la misma condición de carrera ante peticiones concurrentes."
      ],
      "sre-27": [
        null,
        "Subir el timeout del gateway a 35 s traslada la lentitud al usuario final, satura las conexiones del proxy de borde y empeora la degradación global ante dependencias lentas.",
        "El Bulkhead aísla hilos pero no evita que las peticiones ya canceladas por el gateway sigan consumiendo CPU y sockets durante 27 segundos adicionales en el servicio B.",
        "Transformar un flujo síncrono crítico en polling asíncrono con colas añade enorme complejidad operacional y no resuelve la falta de propagación de límites de tiempo en APIs REST."
      ],
      "sre-28": [
        null,
        "Subir timeouts a 5s en componentes no críticos satura los pools de hilos de la app principal y propaga la lentitud a la compra de productos.",
        "Mantener el bloqueo en backend provoca errores 500 en la página principal impidiendo la venta de productos sin importar lo que intente el cliente por WebSocket.",
        "Encolar sin límite en memoria bajo saturación de GPU causa consumo desmedido de RAM y eventual OOM en el backend sin ofrecer una degradación elegante al comprador."
      ],
      "sre-29": [
        null,
        "Si la publicación en Kafka tiene éxito pero el `COMMIT` en PostgreSQL falla por conflicto de clave o caída de red, se publicará un evento de un pedido inexistente en la BD.",
        "Kafka no implementa de forma nativa el protocolo XA/2PC con PostgreSQL; forzar transacciones distribuidas introduce fragilidad extrema y bloqueos prolongados.",
        "Mantener una transacción SQL abierta mientras se reintenta por red hacia Kafka bloquea filas y conexiones en la base de datos, agravando la caída si Kafka no responde."
      ],
      "sre-30": [
        null,
        "Aumentar el Heap solo pospone el problema unos minutos ante un cuello de botella sostenido de disco y empeora los tiempos de pausa del GC cuando el heap gigante colapsa.",
        "Si el subsistema de disco ya se encuentra degradado o saturado, volcar más datos a `/tmp` agrava de inmediato la lentitud de E/S y agota el disco del nodo.",
        "Utilizar referencias débiles descarta datos arbitrariamente sin trazabilidad ni control, violando la integridad de la ingesta de eventos de negocio."
      ],
      "sre-31": [
        null,
        "Abreviar la retención en disco no alivia la memoria del bloque en caliente (`head block`); las series activas siguen cargadas en memoria provocando el `OOMKilled`.",
        "Las reglas de grabación evalúan series ya indexadas; si el scraping sigue ingiriendo 4.8 millones de series únicas, Prometheus colapsará igualmente por RAM.",
        "Enviar 4.8 millones de series por `remote_write` traslada el colapso de memoria y red a Thanos Receive sin subsanar la explosión de cardinalidad de raíz."
      ],
      "sre-32": [
        null,
        "`irate()` también requiere al menos 2 muestras bajo la ventana para calcular la tasa instantánea; con una ventana de 30s y scraping de 30s sigue sufriendo huecos por falta de datos.",
        "El parámetro `step` en Grafana define la distancia entre puntos del gráfico; no añade muestras dentro del rango `[30s]` de la función `rate()` en el servidor Prometheus.",
        "El modificador `offset` desplaza la ventana hacia el pasado; no resuelve la falta de muestras suficientes dentro de un rango idéntico al intervalo de recolección."
      ],
      "sre-33": [
        null,
        "Ponderar percentiles locales por volumen sigue siendo matemáticamente erróneo: los percentiles no se pueden promediar linealmente porque no son aditivos.",
        "`max()` toma el valor más alto entre instancias individuales pero no refleja el percentil 99 del conjunto global de peticiones atendidas por el clúster.",
        "Calcular `quantile()` sobre percentiles locales produce un sesgo estadístico severo; solo `histogram_quantile()` sobre buckets acumulados (`le`) es válido."
      ],
      "sre-34": [
        null,
        "El `scrape_timeout` rige la duración de la petición HTTP de scraping contra `/metrics`, no la magnitud de los tiempos de latencia registrados en las métricas de la app.",
        "Si se excluyera `+Inf`, la fórmula devolvería NaN o errores de conteo; el valor exacto de 10.0s surge de la interpolación al caer en el bucket finito superior `le=\"10.0\"`.",
        "Las librerías de instrumentación no truncan mediciones de duración; simplemente incrementan los contadores de los buckets correspondientes según la duración real."
      ],
      "sre-35": [
        null,
        "`repeat_interval` solo espacia el reenvío de alertas idénticas ya activas; no agrupa 45 alertas distintas disparadas simultáneamente en una sola notificación.",
        "Silenciar por calendario (`mute_time_intervals`) oculta incidentes legítimos durante despliegues en lugar de agruparlos inteligentemente cuando ocurren.",
        "Una regla de inhibición genérica sin jerarquía explícita silenciaría alertas críticas no relacionadas en lugar de agrupar ordenadamente las alertas del incidente."
      ],
      "sre-36": [
        null,
        null,
        "Añadir `trace_id` como etiqueta ordinaria en métricas dispara una explosión crítica de cardinalidad que saturará la memoria RAM de Prometheus en pocos minutos.",
        "Hacer polling por cron hacia el backend de trazas genera retrasos y desacopla la inspección visual en tiempo real ofrecida nativamente por la integración de Exemplars."
      ],
      "sre-37": [
        null,
        "Añadir `or vector(0)` devuelve un valor de 0 cuando la serie falta, por lo que la condición `> 5` seguirá siendo falsa y la alerta continuará sin dispararse ante una caída total.",
        "`keep_firing_for` solo mantiene activa una alerta que ya estaba sonando previamente; si el servicio cae de forma repentina sin errores previos, la regla jamás llegará a dispararse.",
        "Evaluar reglas con mayor frecuencia no genera datos si el scraping no responde; las series se marcarán como ausentes con mayor rapidez pero el vector continuará vacío."
      ],
      "sre-38": [
        null,
        "`rate()` ya gestiona los reinicios internamente de forma nativa; nunca produce números negativos ante la caída a cero de un contador monotónico.",
        "Prometheus no descarta la ventana ni emite NaN; calcula el incremento entre el punto de inicio y el nuevo valor asumiendo un reinicio desde cero.",
        "La función `resets()` solo contabiliza cuántos reinicios ocurrieron en el intervalo; no es necesario ni correcto incorporarla al cómputo habitual de `rate()`."
      ],
      "sre-39": [
        null,
        "Enviar payloads gigantes de peticiones exitosas a S3 sigue generando sobrecarga de CPU, ancho de banda y almacenamiento innecesario para datos redundantes.",
        "Aumentar cuotas y reducir días de retención encarece la factura y perjudica la retención histórica de eventos importantes sin solucionar el problema de diseño.",
        "Generar hashes sobre respuestas exitosas de 200 KB consume recursos de CPU en los colectores y satura el índice con datos criptográficos que carecen de valor operacional."
      ],
      "sre-40": [
        null,
        "Head-based sampling toma la decisión en el milisegundo inicial; con una tasa del 1 % descartará irreversiblemente el 99 % de las peticiones que luego fallen o tarden 2 segundos.",
        "Muestrear localmente por cuota fija en cada nodo no evalúa el resultado de la petición global y genera trazas fragmentadas si un servicio muestrea y el siguiente no.",
        "Ingerir el 100 % de los spans en el almacenamiento central antes de filtrar traslada todo el costo de transferencia e ingesta que precisamente se pretende evitar."
      ],
      "sre-41": [
        null,
        "Multiplicar procesos en PostgreSQL satura la CPU por cambios de contexto y contención de cerrojos internos en memoria compartida, degradando el rendimiento aunque sobre RAM.",
        "Un balanceador de nivel 4 no multiplexa transacciones; solo redirige sockets TCP completos y sigue abriendo una conexión física en PostgreSQL por cada conexión de cliente.",
        "Reducir el pool a 3 conexiones mitiga el rebase temporal pero introduce cuellos de botella de contención local en cada pod al aumentar el tráfico durante el pico del evento."
      ],
      "sre-42": [
        null,
        "Extender el TTL a 24 horas deja el catálogo desactualizado durante todo el día y la estampida masiva volverá a repetirse idéntica cuando la clave expire a las 24 horas.",
        "Lanzar 10.000 consultas pesadas de 2.5s a la vez colapsará igualmente la réplica de lectura por saturación de CPU y agotamiento de conexiones.",
        "El cacheado en el navegador no protege contra el Stampede generado por nuevos visitantes o usuarios concurrentes accediendo en el instante en que expira la clave central."
      ],
      "sre-43": [
        null,
        "En PostgreSQL, `READ UNCOMMITTED` se comporta idéntico a `READ COMMITTED` y no mitiga la cola de adquisición de locks que bloquea las consultas concurrentes.",
        "El bloqueo de lecturas se debe a la contención en la cola de locks de PostgreSQL, no a la sobreescritura de tuplas ni a la falta de espacio libre en páginas de disco.",
        "Un `ALTER TABLE` estructural siempre demanda `ACCESS EXCLUSIVE LOCK`; no es posible degradarlo a `SHARE LOCK` ni evita la cola de espera de cerrojos del catálogo."
      ],
      "sre-44": [
        null,
        "Confunde RTO (tiempo para recuperar el servicio) con RPO (pérdida máxima tolerable de datos); un lag de 45s en replicación asíncrona implica perder hasta 45s de transacciones.",
        "Si la Zona A colapsa físicamente, los WAL no transmitidos a la Zona B se pierden para siempre, violando de forma absoluta el compromiso de RPO = 0.",
        "Esperar el acuse de recibo de red en cada commit describe la replicación síncrona; la replicación asíncrona confirma localmente sin esperar a la réplica."
      ],
      "sre-45": [
        null,
        "Subir timeouts o usar SQL en un script de 2 nodos no resuelve la falta de quórum; ante una partición de red ocurrirá igualmente la doble promoción involuntaria.",
        "Replicación multi-master activa-activa ante particiones de red genera colisiones de claves primarias y corrupción severa de datos relacionales sin resolución determinista.",
        "Conmutar DNS no frena las escrituras concurrentes que los balanceadores internos siguen enviando al nodo original si este no ha sido cercado (fencing/STONITH)."
      ],
      "sre-46": [
        null,
        "Una consulta analítica `SELECT` adquiere un lock compartido `ACCESS SHARE`, el cual no bloquea a `autovacuum`; lo que bloquea la limpieza es el horizonte MVCC retenido por el snapshot.",
        "Una memoria `maintenance_work_mem` reducida solo incrementa el número de pasadas sobre el índice; no suspende ni invalida el barrido de tuplas muertas.",
        "El bloat descripto responde a la retención del horizonte de transacciones (`xmin`) por la consulta abierta en el primario, no a la saturación de ranuras de replicación WAL."
      ],
      "sre-47": [
        null,
        "Enviar `kill -9` (`SIGKILL`) a un proceso backend de PostgreSQL corrompe la memoria compartida (`shared memory`), obligando a todos los backends a reiniciarse e iniciar crash recovery.",
        "`DISCARD ALL` solo surte efecto dentro de la propia sesión local y `VACUUM FULL` intentará obtener `ACCESS EXCLUSIVE LOCK`, empeorando severamente los bloqueos de la base de datos.",
        "`pg_reload_conf()` y `systemctl reload` recargan configuraciones globales de archivos sin alterar el timeout de consultas que ya se encuentran activas en ejecución."
      ],
      "sre-48": [
        null,
        "La caída abrupta y la métrica `BurstBalance = 0 %` en CloudWatch confirman inequívocamente el agotamiento de créditos de E/S de EBS gp2, no un desajuste de memoria virtual del kernel.",
        "Quedarse sin inodos impide crear nuevos archivos en el sistema de archivos, pero no reduce los IOPS de transferencia de disco ni vacía el bucket de créditos de EBS.",
        "El síntoma clave es la degradación de latencia de hardware de disco vinculada directamente al agotamiento del saldo de ráfaga de AWS, no una configuración de buffers de PostgreSQL."
      ],
      "sre-49": [
        null,
        null,
        "En PostgreSQL las claves foráneas no crean índices automáticamente; la causa es la ausencia física del índice, no una estimación errónea de costos en estadísticas.",
        "El síntoma es un volumen masivo de lecturas concurrentes sin índice (6.000 QPS con Seq Scan), no una retención de bloqueos transaccionales por falta de timeout."
      ],
      "sre-50": [
        null,
        "El desalojo aleatorio (`allkeys-random`) expulsará inevitablemente claves de sesión activas de usuarios, provocando cierres de sesión repentinos e impredecibles.",
        "Redis es una base de datos puramente en memoria; el archivo AOF se usa para recuperación ante caídas del servidor y no recarga claves desalojadas bajo demanda.",
        "Aumentar particiones en Redis Cluster incrementa la capacidad total pero conserva el antipatrón de fondo: la caché volverá a llenar la RAM y bloqueará las escrituras de sesiones."
      ],
      "sre-51": [
        null,
        "Los admission controllers rechazan peticiones en el momento del envío a la API (`admission phase`), no esperan 45 segundos para revertir cambios ya persistidos.",
        "`kubectl rollout pause` pausa el despliegue de réplicas en Kubernetes, pero no impide que el reconciliador de ArgoCD sobreescriba el manifiesto del Deployment.",
        "El síntoma no es un error de permisos ni de validación de esquemas, sino la reconciliación continua del operador GitOps (`selfHeal`) contra la rama de Git."
      ],
      "sre-52": [
        null,
        "El error explícito `unable to get local issuer certificate` señala la falta del emisor intermedio en la cadena TLS, no una incompatibilidad en la versión del protocolo o suite.",
        "Si faltara el SAN el error reportado sería `hostname mismatch` o `SAN missing`, no una falla de resolución del emisor de la cadena (`local issuer certificate`).",
        "Las CAs públicas actuales no emiten certificados SHA-1 y el síntoma responde típicamente a omitir `fullchain.pem` en la configuración del balanceador."
      ],
      "sre-53": [
        null,
        null,
        "El failover por DNS cambia la resolución de nombres en clientes, no la propagación de rutas BGP de red entre regiones.",
        "No existe una restricción que eleve TTLs a 7200s; la retención de tráfico responde a la expiración natural del TTL de 1 hora previo y a sockets TCP abiertos."
      ],
      "sre-54": [
        null,
        "El síntoma no es un colapso por concurrencia masiva (Thundering Herd), sino el tiempo de arranque inherente de un pod cuando escala desde cero réplicas.",
        "Incluso con nodos ya encendidos, el arranque en frío del pod (programación, arranque del proceso y `readinessProbe`) tarda varios segundos en responder la primera llamada.",
        "El retraso no responde a la negociación TLS del Ingress, sino al tiempo que tarda el pod en inicializarse y registrarse como endpoint saludable en Kubernetes."
      ],
      "sre-55": [
        null,
        "La causa de la caída no es la afinidad de sesión, sino el desbordamiento masivo de peticiones sobre una región que no disponía de capacidad ociosa para asumir el tráfico global.",
        "Los health checks funcionaron (hicieron el failover a los 3 minutos); el problema fue que la región destino no pudo procesar el 100 % de la carga sumada y colapsó.",
        "Forzar replicación síncrona entre São Paulo y Virginia añadiría 120 ms de latencia por transacción y no protege contra la saturación de CPU por sobrecarga de peticiones."
      ],
      "sre-56": [
        null,
        "Muchas APIs de terceros no soportan filtrado por IP estática y mantener activa una clave con permisos de administración filtrada públicamente representa un riesgo corporativo intolerable.",
        "Revocar antes de preparar la llave alternativa tumba la pasarela de pagos en producción; el procedimiento seguro es crear primero la credencial secundaria y luego invalidar la expuesta.",
        "Hacer el repositorio privado no neutraliza el riesgo: los bots escanean GitHub en milisegundos y la clave debe considerarse irremediablemente comprometida desde el instante de su publicación."
      ],
      "sre-57": [
        null,
        "Borrar el ítem directamente de DynamoDB a ciegas sin verificar procesos concurrentes arriesga corrupción catastrófica del archivo de estado si otro runner continuaba aplicando cambios.",
        "`terraform refresh` no libera cerrojos de estado huérfanos; al contrario, fallará con el mismo error de adquisición de lock al intentar leer el backend.",
        "Desactivar el bloqueo con `-lock=false` permite que múltiples ejecuciones simultáneas de CI/CD sobreescriban el estado, causando inconsistencia irreversible en los recursos de la nube."
      ],
      "sre-58": [
        null,
        "Si existiera enrutamiento asimétrico con descarte por firewall con estado, las respuestas pequeñas (`GET /health`) tampoco recibirían paquetes de vuelta y fallarían igual.",
        "El síntoma clásico donde paquetes pequeños pasan y transferencias > 1.400 bytes o handshakes TLS se cuelgan responde inequívocamente a problemas de MTU/PMTUD, no a Window Scaling.",
        "La resolución DNS ya se completó antes de enviar la petición HTTP; el bloqueo ocurre en la transferencia de datos TCP al sobrepasar el MTU del enlace encapsulado."
      ],
      "sre-59": [
        null,
        "Si la CDN incluye el query string completo en la Cache Key, cada URL con un parámetro único seguirá considerándose un objeto distinto generando Cache MISS sin importar el `s-maxage`.",
        "Bloquear clientes legítimos que provienen de campañas de marketing mediante rate limiting o captchas destruye la conversión de negocio en lugar de optimizar la entrega de caché.",
        "Enviar un redirect 301 obliga a 45.000 usuarios concurrentes a realizar una segunda petición HTTP, manteniendo la saturación inicial sobre los servidores de origen."
      ],
      "sre-60": [
        null,
        "El error `failed to assign an IP address to container` emitido por el plugin CNI se refiere estrictamente a la asignación de direcciones IP en la VPC, no a espacio o inodos en containerd.",
        "El NAT Gateway traduce tráfico hacia internet; la asignación de IPs locales a contenedores ocurre a través de llamadas locales a la API de EC2 para reservar IPs en la subred privada.",
        "Si se alcanzara el límite de Security Groups el error describiría una falla en `AttachNetworkInterface`, no un fallo directo de agotamiento de IPs al crear el sandbox del pod."
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
