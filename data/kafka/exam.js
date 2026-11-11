/* =========================================================================
   data/kafka/exam.js — Apache Kafka & Confluent (CCDAK / Administración)
   60 escenarios reales de producción y examen CCDAK con explicación por opción errónea (WHY)
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["kafka-confluent"] = {
    id: "kafka-confluent",
    appId: "kafka-confluent",
    provider: "Apache Kafka & Confluent",
    badge: "Kafka & Confluent",
    icon: "🌀",
    color: "#ff6600",
    title: "Apache Kafka & Confluent (CCDAK / Administración)",
    subtitle: "Arquitectura de clusters y KRaft, Producers e Idempotencia/EOS, Consumer Groups y Rebalanceo Cooperativo, Schema Registry, Kafka Connect, Kafka Streams/ksqlDB y Seguridad/Operaciones.",
    passingScore: 75,
    domains: {
      1: "Arquitectura de Kafka, Particiones, Replicación y KRaft",
      2: "Producers, Garantías de Entrega, Serialización y Schema Registry",
      3: "Consumers, Consumer Groups, Gestión de Offsets y Rebalanceo",
      4: "Ecosistema Confluent: Kafka Connect, Kafka Streams y ksqlDB",
      5: "Seguridad (SASL/mTLS/ACLs), Monitoreo, Compactación y Rendimiento"
    },
    shortDomains: {
      1: "Arquitectura & KRaft",
      2: "Producers & Schemas",
      3: "Consumers & Offsets",
      4: "Connect, Streams & ksqlDB",
      5: "Seguridad & Operaciones"
    },
    topics: [
  {
    "id": "t-1-1",
    "d": 1,
    "title": "1.1 · Arquitectura de Clúster, Particiones, ISR, High Watermark y KRaft",
    "html": "\n<h4>Anatomía de una Partición: Commit Log Inmutable</h4>\n<p>En Apache Kafka, un <b>tópico</b> se subdivide en una o más <b>particiones</b>. Cada partición es una secuencia ordenada e inmutable de registros estructurada como un <i>append-only commit log</i>. Cada mensaje dentro de una partición recibe un identificador secuencial unívoco denominado <b>offset</b>.</p>\n<ul>\n  <li><b>Log End Offset (LEO):</b> Es el offset del próximo mensaje que se escribirá en el log de una réplica (marca el final del log en esa réplica).</li>\n  <li><b>High Watermark (HW):</b> Es el offset del último mensaje que ha sido replicado exitosamente en <b>todas las réplicas en sincronía (ISR)</b>. Los consumidores <i>únicamente</i> pueden leer registros con offset inferior al HW, evitando lecturas sucias (dirty reads) de datos no asegurados.</li>\n</ul>\n\n<h4>Roles de Réplica y el In-Sync Replicas (ISR)</h4>\n<table class=\"keytable\">\n<tr><th>Componente / Métrica</th><th>Función Técnica</th><th>Criterio de Fallo / Desincronización</th></tr>\n<tr><td><b>Leader Replica</b></td><td>Atiende todas las lecturas y escrituras de los clientes (salvo lecturas de réplicas follower configuradas con <code>rack.id</code>).</td><td>Si el broker líder colapsa, el Controller elige un nuevo líder entre los miembros del ISR.</td></tr>\n<tr><td><b>Follower Replica</b></td><td>Actúa como un consumidor interno: envía peticiones <code>FetchRequest</code> periódicas al líder para copiar nuevos mensajes en su log local.</td><td>No atiende escrituras; replica pasivamente.</td></tr>\n<tr><td><b>ISR (In-Sync Replicas)</b></td><td>Subconjunto de réplicas que se mantienen al día con el líder según <code>replica.lag.time.max.ms</code> (por defecto 30 000 ms).</td><td>Si una réplica no envía un fetch válido o no avanza su LEO antes de agotarse este timeout, es expulsada del ISR.</td></tr>\n</table>\n\n<h4>Evolución Arquitectónica: De Apache ZooKeeper a KRaft (KIP-500)</h4>\n<p>Tradicionalmente, Kafka dependía de ZooKeeper para la elección del controlador, el registro de brokers y la gestión de tópicos. Con <b>KRaft (Kafka Raft Metadata Mode)</b>, la gestión de metadatos se unifica dentro del propio Kafka:</p>\n<ul>\n  <li><b>Quórum de Controladores:</b> Un conjunto impar de nodos (típicamente 3 o 5) ejecutan el protocolo de consenso Raft gestionando la partición de metadatos interna <code>@metadata</code>.</li>\n  <li><b>process.roles:</b> Cada nodo se configura como <code>broker</code>, <code>controller</code> o modo combinado <code>broker,controller</code>.</li>\n  <li><b>Failover Instantáneo:</b> El controlador activo replica el log de metadatos a los controladores en standby en memoria RAM; al caer el líder, la elección y recuperación toman milisegundos en lugar de minutos (eliminando el cuello de botella de escanear miles de znodes en ZK).</li>\n</ul>\n<div class=\"tip\"><b>Regla de Producción KRaft:</b> En entornos de producción de gran escala, separa siempre los roles: mantén 3 nodos dedicados exclusivamente con <code>process.roles=controller</code> y el resto como <code>process.roles=broker</code>. Mezclar roles en producción expone a los controladores a pausas de GC o saturación de I/O provocadas por el tráfico de datos de los brokers.</div>\n"
  },
  {
    "id": "t-1-2",
    "d": 1,
    "title": "1.2 · Resiliencia de Particiones: acks, min.insync.replicas y Unclean Leader Election",
    "html": "\n<h4>La Ecuación de Durabilidad y Disponibilidad</h4>\n<p>La resiliencia en Kafka se define mediante la interacción entre la configuración del productor (<code>acks</code>) y las políticas del broker/tópico (<code>replication.factor</code> y <code>min.insync.replicas</code>):</p>\n<table class=\"keytable\">\n<tr><th>replication.factor</th><th>min.insync.replicas</th><th>acks (Productor)</th><th>Brokers que pueden caer sin parar escrituras</th><th>Garantía de Durabilidad</th></tr>\n<tr><td>3</td><td>2</td><td>all (-1)</td><td>1 broker caído</td><td><b>Óptima (Estándar Enterprise):</b> Cero pérdida de datos garantizada y alta disponibilidad.</td></tr>\n<tr><td>3</td><td>3</td><td>all (-1)</td><td>0 brokers caídos</td><td><b>Frágil:</b> Cualquier reinicio o fallo de 1 solo broker bloquea todas las escrituras con <code>NotEnoughReplicasException</code>.</td></tr>\n<tr><td>3</td><td>1</td><td>1</td><td>2 brokers caídos</td><td><b>Riesgo Alto:</b> Si el líder confirma la escritura y cae antes de que los followers repliquen, el mensaje se pierde.</td></tr>\n<tr><td>3</td><td>2</td><td>0</td><td>N/A</td><td><b>Sin garantías:</b> El productor no espera ACK. Pérdida masiva en caso de caída de red o broker.</td></tr>\n</table>\n\n<h4>Elección de Líder Limpia vs. Sucia (Unclean Leader Election)</h4>\n<p>¿Qué sucede si el líder cae y <b>ninguna réplica del ISR está disponible</b> (por ejemplo, tras una caída simultánea de 2 de 3 nodos)?</p>\n<ul>\n  <li><b>unclean.leader.election.enable = false (Recomendado):</b> La partición entra en estado <code>Offline</code> (no disponible para lecturas ni escrituras) hasta que una de las réplicas del ISR original vuelva a estar en línea. <b>Se prioriza la consistencia sobre la disponibilidad: cero pérdida de datos.</b></li>\n  <li><b>unclean.leader.election.enable = true:</b> Una réplica rezagada fuera del ISR es promovida a líder. <b>Se prioriza la disponibilidad a costa de pérdida irrevocable de datos</b>: los mensajes que estaban en el líder anterior pero no en la réplica promovida se truncan y se destruyen permanentemente, causando inconsistencias severas de offsets.</li>\n</ul>\n\n<h4>Segmentos de Log y Ficheros de Índice</h4>\n<p>Cada partición se almacena en el sistema de archivos del broker dividida en <b>segmentos</b>:</p>\n<ul>\n  <li><code>.log</code>: Almacena los registros serializados reales en disco secuencial.</li>\n  <li><code>.index</code>: Índice disperso (sparse index) que mapea el <i>offset lógico</i> a la <i>posición física en bytes</i> dentro del archivo <code>.log</code>.</li>\n  <li><code>.timeindex</code>: Mapea marcas temporales (timestamp) al offset correspondiente para búsquedas eficientes por fecha.</li>\n  <li><b>Segment Roll:</b> Se crea un nuevo segmento cuando el segmento activo supera <code>segment.bytes</code> (por defecto 1 GB) o <code>segment.ms</code> (por defecto 7 días). La retención (por tiempo o tamaño) solo evalúa segmentos cerrados (no activos).</li>\n</ul>\n<div class=\"tip\"><b>Cuidado con segment.ms:</b> Si tienes un tópico con retención de 3 días (<code>retention.ms=259200000</code>) pero el tráfico es muy bajo y <code>segment.ms</code> tiene el valor por defecto de 7 días, los mensajes antiguos de hace 6 días NO se borrarán porque siguen residiendo en el segmento activo. Ajusta <code>segment.ms</code> al mismo orden que <code>retention.ms</code> en tópicos de bajo volumen.</div>\n"
  },
  {
    "id": "t-2-1",
    "d": 2,
    "title": "2.1 · Producers: Garantías de Entrega, Idempotencia y Transacciones EOS",
    "html": "\n<h4>Garantías de Entrega y Niveles de Confirmación (acks)</h4>\n<table class=\"keytable\">\n<tr><th>acks</th><th>Confirmación requerida</th><th>Latencia</th><th>Riesgo de Pérdida</th><th>Caso de Uso Recomendado</th></tr>\n<tr><td><b>0</b></td><td>Ninguna; el productor asume éxito en cuanto coloca los bytes en el socket de red.</td><td>Mínima (&lt; 1 ms)</td><td>Extremo (si el broker cae o hay fallo de red, se pierde el lote).</td><td>Métricas descartables de alta frecuencia, clics no críticos.</td></tr>\n<tr><td><b>1</b></td><td>El broker líder escribe en su log local y responde ACK de inmediato.</td><td>Baja</td><td>Moderado (si el líder confirma y cae antes de que los followers repliquen).</td><td>Logs de aplicación estándar donde una pérdida mínima es tolerable.</td></tr>\n<tr><td><b>all / -1</b></td><td>El líder escribe en su log y espera que todas las réplicas en el <b>ISR</b> actual confirmen la escritura.</td><td>Media</td><td>Nulo (siempre que <code>min.insync.replicas &gt;= 2</code>).</td><td>Finanzas, pagos, inventario, auditoría y sistemas core.</td></tr>\n</table>\n\n<h4>El Productor Idempotente (KIP-98)</h4>\n<p>Al reintentar el envío por un timeout de red donde el broker sí guardó el mensaje pero la respuesta se perdió, un productor tradicional produce duplicados. Con <code>enable.idempotence = true</code>:</p>\n<ol>\n  <li>El broker asigna al productor un <b>Producer ID (PID)</b> único de 64 bits durante el handshake inicial.</li>\n  <li>Por cada lote y partición, el productor incrementa un <b>Sequence Number</b> entero monotónicamente creciente (0, 1, 2...).</li>\n  <li>El broker almacena en memoria los últimos 5 números de secuencia confirmados por partición: si recibe un mensaje con un Sequence Number ya persistido, lo confirma sin duplicarlo en el log. Si llega un gap (p. ej. llega 4 cuando esperaba 2), rechaza el lote con <code>OutOfOrderSequenceException</code>.</li>\n</ol>\n<p><b>Requisitos obligatorios:</b> <code>acks = all</code>, <code>retries &gt; 0</code>, y <code>max.in.flight.requests.per.connection &lt;= 5</code>.</p>\n\n<h4>Semántica Exactly-Once (EOS) y Transacciones Atómicas</h4>\n<p>Las transacciones de Kafka permiten coordinar escrituras atómicas en múltiples particiones y tópicos, junto con el commit de los offsets consumidos (patrón <i>consume-transform-produce</i>):</p>\n<ul>\n  <li><b>transactional.id:</b> Identificador persistente asignado por el usuario al productor para sobrevivir a reinicios.</li>\n  <li><b>Transaction Coordinator:</b> Broker responsable de gestionar el estado de la transacción en el tópico interno <code>__transaction_state</code> mediante un protocolo Two-Phase Commit (2PC).</li>\n  <li><b>Control Markers:</b> Mensajes especiales de control (<code>COMMIT</code> o <code>ABORT</code>) escritos en las particiones de datos.</li>\n  <li><b>Consumidor: isolation.level = read_committed:</b> El consumidor retiene los mensajes hasta el <b>Last Stable Offset (LSO)</b>; oculta los mensajes abortados y solo entrega registros de transacciones exitosamente committeadas.</li>\n</ul>\n<div class=\"tip\"><b>Mito del max.in.flight:</b> Históricamente se requería <code>max.in.flight.requests.per.connection=1</code> para evitar desorden en reintentos. Con <code>enable.idempotence=true</code>, Kafka admite con total seguridad hasta <code>5</code> peticiones en vuelo manteniendo el orden estricto de mensajes, ya que el broker valida los Sequence Numbers concurrentes.</div>\n"
  },
  {
    "id": "t-2-2",
    "d": 2,
    "title": "2.2 · Producers: Batching, Compresión, Particionado y Schema Registry",
    "html": "\n<h4>Mecánica Interna de Batching y Compresión</h4>\n<p>El productor de Kafka no envía cada mensaje de inmediato. Utiliza un buffer interno (<code>RecordAccumulator</code>) estructurado por partición:</p>\n<table class=\"keytable\">\n<tr><th>Parámetro</th><th>Valor por defecto</th><th>Impacto en Throughput vs. Latencia</th></tr>\n<tr><td><b>batch.size</b></td><td>16 384 bytes (16 KB)</td><td>Tamaño máximo en bytes de cada lote por partición. Subirlo a 64 KB o 128 KB maximiza el throughput en cargas altas.</td></tr>\n<tr><td><b>linger.ms</b></td><td>0 ms</td><td>Tiempo máximo que el productor espera antes de enviar un lote no lleno. Ponerlo en 5–20 ms permite acumular muchos más mensajes por batch, multiplicando el throughput drásticamente con una latencia imperceptible.</td></tr>\n<tr><td><b>compression.type</b></td><td>none (usar lz4 / zstd)</td><td>La compresión se realiza en el cliente productor. Reduce ancho de banda WAN y uso de disco en el broker. <code>lz4</code> ofrece la mejor relación CPU/rendimiento; <code>zstd</code> máxima compresión para payloads grandes.</td></tr>\n</table>\n\n<h4>Estrategias de Particionado</h4>\n<ul>\n  <li><b>Con Clave (Key != null):</b> Kafka aplica una función de hashing (por defecto <code>murmur2(key) % num_partitions</code>). Garantiza que todos los mensajes con la misma clave vayan estrictamente a la <b>misma partición</b> (orden absoluto por entidad/cliente).</li>\n  <li><b>Sin Clave (Key == null):</b> En versiones modernas se usa el <b>Sticky Partitioner (KIP-480)</b>, que concentra registros consecutivos en la misma partición hasta llenar el <code>batch.size</code> o alcanzar <code>linger.ms</code> antes de rotar a la siguiente, evitando micro-lotes ineficientes.</li>\n</ul>\n\n<h4>Confluent Schema Registry: Wire Format y Modos de Compatibilidad</h4>\n<p>Schema Registry desacopla a productores y consumidores validando esquemas (Avro, Protobuf, JSON Schema) de forma centralizada. En cada mensaje publicado, el serializador inyecta una cabecera binaria de <b>5 bytes</b> denominada <b>Confluent Wire Format</b>:</p>\n<ul>\n  <li><b>Byte 0 (Magic Byte):</b> Siempre <code>0x00</code> (identifica el protocolo Confluent).</li>\n  <li><b>Bytes 1–4 (Schema ID):</b> Número entero de 4 bytes en formato Big-Endian que referencia el ID único del esquema registrado en Schema Registry.</li>\n  <li><b>Bytes 5+ (Payload):</b> Datos binarios del mensaje serializados con el esquema correspondiente.</li>\n</ul>\n<table class=\"keytable\">\n<tr><th>Modo de Compatibilidad</th><th>Qué permite el cambio de esquema</th><th>Regla de Despliegue Obligatoria</th></tr>\n<tr><td><b>BACKWARD (Por defecto)</b></td><td>Consumidores con esquema nuevo pueden leer datos generados con el esquema anterior (p. ej. añadir campos opcionales con default o eliminar campos).</td><td><b>Actualizar Consumidores primero</b>, Productores después.</td></tr>\n<tr><td><b>FORWARD</b></td><td>Consumidores con esquema antiguo pueden leer datos producidos con el esquema nuevo (p. ej. añadir nuevos campos o eliminar campos con default).</td><td><b>Actualizar Productores primero</b>, Consumidores después.</td></tr>\n<tr><td><b>FULL</b></td><td>Combina BACKWARD y FORWARD: nuevo lee antiguo y antiguo lee nuevo. Solo se permiten cambios 100 % simétricos.</td><td><b>Cualquier orden</b> (despliegue desacoplado seguro).</td></tr>\n<tr><td><b>Variantes TRANSITIVE</b></td><td>Aplica las reglas no solo respecto a la versión inmediata anterior, sino respecto a <b>todas las versiones históricas registradas</b>.</td><td>Obligatorio en arquitecturas con retención infinita de datos.</td></tr>\n</table>\n<div class=\"tip\"><b>Error clásico de serialización:</b> Si un consumidor genérico intenta leer un tópico gobernado por Schema Registry usando un deserializador de JSON crudo o String, fallará inmediatamente con errores de caracteres ilegales o corrupción de datos debido a los primeros 5 bytes binarios (Magic Byte + Schema ID).</div>\n"
  },
  {
    "id": "t-3-1",
    "d": 3,
    "title": "3.1 · Consumers: Consumer Groups, Asignación de Particiones y Offsets",
    "html": "\n<h4>El Modelo de Consumer Group y Escalabilidad Horizontal</h4>\n<p>Un <b>Consumer Group</b> permite dividir el trabajo de procesamiento entre múltiples instancias compartiendo el mismo <code>group.id</code>:</p>\n<ul>\n  <li><b>Regla de Oro:</b> Cada partición es consumida en un momento dado por <b>a lo sumo una instancia</b> de ese grupo.</li>\n  <li><b>Paralelismo Máximo:</b> El número máximo de consumidores activos que procesan datos es exactamente igual al <b>número de particiones del tópico</b>. Si tienes un tópico con 8 particiones y levantas 12 instancias de consumidor en el mismo grupo, 4 de ellas quedarán completamente ociosas (idle).</li>\n  <li><b>Múltiples Grupos (Pub/Sub):</b> Si dos aplicaciones usan <code>group.id</code> distintos (p. ej. <code>billing-service</code> y <code>fraud-service</code>), ambas reciben la totalidad de los mensajes de forma independiente.</li>\n</ul>\n\n<h4>Gestión de Offsets: Tópico Interno __consumer_offsets</h4>\n<p>El progreso del consumidor se persiste en el tópico interno <code>__consumer_offsets</code> (50 particiones, política <code>cleanup.policy=compact</code>). El Group Coordinator responsable de un grupo se determina con la fórmula:</p>\n<pre><code>partition = Math.abs(group.id.hashCode()) % 50</code></pre>\n<p>El broker líder de esa partición de <code>__consumer_offsets</code> actúa como el <b>Group Coordinator</b> para ese grupo.</p>\n\n<h4>Estrategias de Commit: Riesgos de Duplicación vs. Pérdida de Datos</h4>\n<table class=\"keytable\">\n<tr><th>Estrategia</th><th>Configuración / Método</th><th>Momento del Commit</th><th>Garantía / Riesgo Principal</th></tr>\n<tr><td><b>Auto-commit</b></td><td><code>enable.auto.commit = true</code><br><code>auto.commit.interval.ms = 5000</code></td><td>Automático en la siguiente llamada a <code>poll()</code> si transcurrió el intervalo.</td><td><b>Riesgo de duplicados o pérdida:</b> Si la app procesa parte del lote y cae, los no procesados se pierden si se committeó, o se duplican si no.</td></tr>\n<tr><td><b>Manual Síncrono</b></td><td><code>commitSync()</code></td><td>Bloquea el hilo del consumidor hasta recibir ACK de <code>__consumer_offsets</code>.</td><td><b>At-Least-Once seguro:</b> Reintenta automáticamente en fallos transitorios. Penaliza throughput si se llama por registro.</td></tr>\n<tr><td><b>Manual Asíncrono</b></td><td><code>commitAsync(callback)</code></td><td>No bloqueante; envía la petición de commit y continúa inmediatamente.</td><td><b>Alto Throughput:</b> <i>Nunca reintenta</i> en caso de error para evitar que un commit viejo sobrescriba uno más reciente ya confirmado.</td></tr>\n</table>\n\n<h4>Comportamiento ante Partición Nueva: auto.offset.reset</h4>\n<table class=\"keytable\">\n<tr><th>Valor</th><th>Comportamiento</th></tr>\n<tr><td><b>earliest</b></td><td>Comienza a leer desde el offset más antiguo disponible en la partición (útil para reprocesamiento o carga inicial).</td></tr>\n<tr><td><b>latest (default)</b></td><td>Comienza a leer únicamente los mensajes nuevos que lleguen a partir del momento de suscripción.</td></tr>\n<tr><td><b>none</b></td><td>Lanza <code>NoOffsetForPartitionException</code> si no existe un offset previo confirmado para ese grupo en esa partición.</td></tr>\n</table>\n<div class=\"tip\"><b>Patrón Profesional de Commit:</b> Usa <code>commitAsync()</code> durante el ciclo regular de procesamiento para mantener alto rendimiento, y ejecuta un <code>commitSync()</code> en un bloque <code>finally</code> al cerrar el consumidor o en los callbacks de <code>ConsumerRebalanceListener</code> para asegurar el último offset antes de ceder la partición.</div>\n"
  },
  {
    "id": "t-3-2",
    "d": 3,
    "title": "3.2 · Consumers: Liveness, Timeouts y Rebalanceo Cooperativo",
    "html": "\n<h4>Liveness y Detección de Fallos en Clientes Consumidores</h4>\n<p>El cliente consumidor de Kafka separa la detección de fallos de proceso de la lentitud de procesamiento de datos en dos hilos independientes:</p>\n<table class=\"keytable\">\n<tr><th>Parámetro</th><th>Hilo Responsable</th><th>Propósito</th><th>Qué ocurre al superarse</th></tr>\n<tr><td><b>session.timeout.ms</b><br>(Default: 45s)</td><td>Heartbeat Thread (fondo)</td><td>Detecta caídas físicas del nodo, congelamiento de JVM o pérdida de conectividad de red con el Group Coordinator.</td><td>El coordinador declara muerto al consumidor e inicia un rebalanceo para reasignar sus particiones.</td></tr>\n<tr><td><b>heartbeat.interval.ms</b><br>(Default: 3s)</td><td>Heartbeat Thread (fondo)</td><td>Frecuencia con la que el hilo de fondo envía latidos de presencia al broker.</td><td>Debe configurarse como máximo a <b>1/3 de <code>session.timeout.ms</code></b>.</td></tr>\n<tr><td><b>max.poll.interval.ms</b><br>(Default: 300s / 5m)</td><td>Main Processing Thread</td><td>Tiempo máximo permitido entre dos llamadas consecutivas a <code>poll()</code>.</td><td>Si el procesamiento del lote en el hilo principal tarda más de este tiempo, el cliente <b>se auto-expulsa del grupo</b> provocando un rebalanceo destructivo.</td></tr>\n<tr><td><b>max.poll.records</b><br>(Default: 500)</td><td>Main Processing Thread</td><td>Cantidad máxima de registros devueltos por una única llamada a <code>poll()</code>.</td><td>Herramienta primaria para evitar exceder <code>max.poll.interval.ms</code> cuando las llamadas a DB/APIs tardan tiempo por registro.</td></tr>\n</table>\n\n<h4>Protocolos de Rebalanceo: Eager vs. Cooperative Sticky</h4>\n<table class=\"keytable\">\n<tr><th>Característica</th><th>Rebalanceo Eager (Tradicional)</th><th>Rebalanceo Cooperativo Incremental (KIP-429)</th></tr>\n<tr><td><b>Mecanismo</b></td><td><b>Stop-The-World:</b> Todos los consumidores del grupo renuncian a todas sus particiones asignadas simultáneamente y dejan de procesar datos mientras se reasignan.</td><td><b>Incremental:</b> Solo se revocan y migran las particiones específicas que necesitan cambiar de dueño. El resto de consumidores continúan procesando sin pausa.</td></tr>\n<tr><td><b>Asignadores</b></td><td><code>RangeAssignor</code>, <code>RoundRobinAssignor</code>, <code>StickyAssignor</code>.</td><td><code>CooperativeStickyAssignor</code> (estándar moderno recomendado).</td></tr>\n<tr><td><b>Impacto en Latencia</b></td><td>Picos masivos de latencia y pausas de ingesta durante despliegues continuos.</td><td>Fluido y transparente: mínimo impacto en la continuidad del procesamiento.</td></tr>\n</table>\n\n<h4>Static Membership (KIP-345) y Despliegues en Kubernetes</h4>\n<p>En Kubernetes, un <i>rolling update</i> reinicia los pods uno a uno. Con membresía dinámica tradicional, cada pod reiniciado provoca <b>dos rebalanceos globales</b> (uno al apagarse y otro al reincorporarse).</p>\n<ul>\n  <li>Configurando <code>group.instance.id = \"pod-id-fijo\"</code>, el consumidor se convierte en un <b>miembro estático</b>.</li>\n  <li>Cuando el pod se reinicia, el Group Coordinator mantiene sus particiones reservadas sin lanzar ningún rebalanceo durante el periodo de gracia fijado por <code>session.timeout.ms</code>.</li>\n</ul>\n<div class=\"tip\"><b>Diagnóstico de Rebalance Storm:</b> Si ves que un consumidor se desconecta y reconecta en bucle infinito arrojando <code>CommitFailedException</code>, casi nunca es problema de red: el problema es que el procesamiento de un lote tardó más de <code>max.poll.interval.ms</code>. Solución: reduce <code>max.poll.records</code> (p. ej. a 50 o 100) o incrementa <code>max.poll.interval.ms</code>.</div>\n"
  },
  {
    "id": "t-4-1",
    "d": 4,
    "title": "4.1 · Kafka Connect: Arquitectura, Tópicos Internos, SMTs y Dead Letter Queues",
    "html": "\n<h4>Arquitectura: Standalone vs. Distributed</h4>\n<p><b>Kafka Connect</b> es el framework escalable para integrar Kafka con sistemas externos (Bases de datos relacionales, Elasticsearch, S3, Snowflake, MongoDB):</p>\n<ul>\n  <li><b>Standalone Mode:</b> Un único proceso local para desarrollo o pruebas. No tolera fallos de nodo ni escala horizontalmente. Guarda configuraciones y offsets en ficheros de disco local.</li>\n  <li><b>Distributed Mode (Obligatorio en Producción):</b> Clúster de múltiples <i>Workers</i> coordinados mediante el protocolo de Consumer Groups de Kafka. Las tareas (Tasks) se distribuyen automáticamente entre los workers del clúster con auto-rebalanceo ante caídas.</li>\n</ul>\n\n<h4>Tópicos Internos en Kafka Connect Distributed</h4>\n<table class=\"keytable\">\n<tr><th>Tópico Interno</th><th>Particiones</th><th>cleanup.policy</th><th>Propósito Crítico</th></tr>\n<tr><td><code>config.storage.topic</code></td><td><b>Estrictamente 1</b></td><td><code>compact</code></td><td>Almacena las configuraciones de conectores. Requiere exactamente 1 partición para garantizar un orden lineal estricto en todos los workers.</td></tr>\n<tr><td><code>offset.storage.topic</code></td><td>Múltiples (ej. 25–50)</td><td><code>compact</code></td><td>Registra los offsets de lectura de los Source Connectors en el sistema de origen.</td></tr>\n<tr><td><code>status.storage.topic</code></td><td>Múltiples (ej. 5)</td><td><code>compact</code></td><td>Registra el estado en tiempo real (<code>RUNNING</code>, <code>PAUSED</code>, <code>FAILED</code>) de conectores y tareas.</td></tr>\n</table>\n\n<h4>Single Message Transforms (SMTs)</h4>\n<p>Las SMTs modifican registros individuales en memoria sobre la marcha (in-flight) antes de escribir en Kafka (Source) o antes de entregar al destino (Sink):</p>\n<ul>\n  <li>Modificación de campos: <code>org.apache.kafka.connect.transforms.InsertField</code> (inyecta timestamps, metadata de partición o estáticos).</li>\n  <li>Enrutamiento dinámico: <code>RegexRouter</code> (modifica el nombre del tópico de destino según regex).</li>\n  <li>Seguridad / Privacidad: <code>MaskField</code> (enmascara números de tarjeta o datos PII sustituyéndolos por hashes o nulos).</li>\n  <li>Transformación de claves: <code>ValueToKey</code> (extrae un campo del payload JSON/Avro y lo convierte en la clave del mensaje de Kafka).</li>\n</ul>\n\n<h4>Manejo de Errores y Dead Letter Queue (DLQ) en Sink Connectors</h4>\n<p>Cuando un registro inválido o corrupto (<i>poison pill</i>) llega a un Sink Connector, la configuración por defecto (<code>errors.tolerance = none</code>) causa el fallo y detención inmediata de la tarea (<code>FAILED</code>).</p>\n<table class=\"keytable\">\n<tr><th>Parámetro</th><th>Valor Recomendado</th><th>Efecto</th></tr>\n<tr><td><code>errors.tolerance</code></td><td><code>all</code></td><td>Continúa procesando registros subsiguientes sin detener la tarea ante fallos de deserialización o conversión.</td></tr>\n<tr><td><code>errors.deadletterqueue.topic.name</code></td><td><code>dlq-my-sink-topic</code></td><td>Publica automáticamente los mensajes corruptos en el tópico de Dead Letter Queue especificado.</td></tr>\n<tr><td><code>errors.deadletterqueue.context.headers.enable</code></td><td><code>true</code></td><td>Inyecta cabeceras de depuración en el mensaje DLQ con la excepción, el código de error, el tópico original y el offset fallido.</td></tr>\n</table>\n<div class=\"tip\"><b>Limitación Fundamental de la DLQ:</b> Las Dead Letter Queues en Kafka Connect <b>solo existen para Sink Connectors</b>. Un Source Connector que falle al leer de su origen (p. ej. JDBC corrupto) no puede enviar registros a una DLQ de Connect porque el fallo ocurre antes de que el registro sea un objeto Kafka válido.</div>\n"
  },
  {
    "id": "t-4-2",
    "d": 4,
    "title": "4.2 · Kafka Streams y ksqlDB: Dualidad Stream-Table, Co-partitioning y Joins",
    "html": "\n<h4>Dualidad Stream-Table (KStream vs. KTable vs. GlobalKTable)</h4>\n<table class=\"keytable\">\n<tr><th>Abstracción</th><th>Semántica de Datos</th><th>Modelo Mental</th><th>Comportamiento ante Clave Duplicada</th></tr>\n<tr><td><b>KStream</b></td><td>Flujo continuo de eventos independientes e inmutables.</td><td>Insert Stream (hechos históricos, logs, clics).</td><td>Cada registro se procesa como un evento nuevo independiente.</td></tr>\n<tr><td><b>KTable</b></td><td>Vista materializada del estado actual por clave primaria.</td><td>Changelog (UPSERT).</td><td>Un nuevo registro con la misma clave sobrescribe el valor previo (un registro con valor <code>null</code> actúa como DELETE / Tombstone).</td></tr>\n<tr><td><b>GlobalKTable</b></td><td>Copia completa del dataset en <b>todas las instancias de la app</b>.</td><td>Lookup Cache local completa (p. ej. catálogo de códigos postales).</td><td>Almacena todas las particiones del tópico en cada nodo. No requiere co-partitioning en joins con KStream.</td></tr>\n</table>\n\n<h4>El Requisito Obligatorio de Co-partitioning</h4>\n<p>Para realizar un join entre dos <code>KStream</code> o entre un <code>KStream</code> y una <code>KTable</code>, ambos tópicos de entrada deben estar <b>co-particionados</b>:</p>\n<ol>\n  <li>Tener exactamente el <b>mismo número de particiones</b>.</li>\n  <li>Utilizar la <b>misma estrategia de particionado y la misma clave</b> (mismo serializador / hashing).</li>\n</ol>\n<p>Si las condiciones no se cumplen, Kafka Streams falla con <code>TopologyException</code> o fuerza internamente un paso de <code>repartition</code> escribiendo y volviendo a leer del clúster, con una importante penalización de I/O y latencia.</p>\n\n<h4>State Stores Persistentes: RocksDB y Changelog Topics</h4>\n<p>Las operaciones con estado (agregaciones como <code>count()</code>, <code>aggregate()</code>, ventanas o joins) utilizan un almacenamiento local off-heap con <b>RocksDB</b>:</p>\n<ul>\n  <li><b>Resiliencia ante Fallos:</b> Cada State Store local de RocksDB está respaldado en Kafka por un <b>Changelog Topic interno</b> con <code>cleanup.policy=compact</code>.</li>\n  <li><b>Failover Ultra-Rápido:</b> Configurando <code>num.standby.replicas = 1</code> (o más), otras instancias de la aplicación mantienen una copia local en caliente (warm standby) leyendo continuamente el changelog. Si la instancia principal cae, el standby toma el control en segundos sin esperar a reconstruir RocksDB desde cero.</li>\n</ul>\n\n<h4>Tipos de Ventanas Temporales</h4>\n<ul>\n  <li><b>Tumbling Windows:</b> Ventanas de tamaño fijo no solapadas contiguas (ej. de 10:00 a 10:05, de 10:05 a 10:10).</li>\n  <li><b>Hopping Windows:</b> Ventanas de tamaño fijo con avance periódico que se solapan (ej. duración de 5 min con salto cada 1 min).</li>\n  <li><b>Sliding Windows:</b> Basadas en la diferencia temporal exacta entre dos registros individuales (típicamente usadas en joins de streams).</li>\n  <li><b>Session Windows:</b> Basadas en periodos de actividad separados por intervalos de inactividad (<i>inactivity gap</i>).</li>\n</ul>\n\n<h4>ksqlDB: Push Queries vs. Pull Queries</h4>\n<ul>\n  <li><b>Push Queries (<code>EMIT CHANGES</code>):</b> Suscripción en tiempo real continua. La consulta se mantiene abierta y emite cada nuevo evento tan pronto como se produce.</li>\n  <li><b>Pull Queries:</b> Consulta síncrona tipo <i>request/response</i> (similar a un <code>SELECT ... WHERE ROWKEY = 'X'</code> clásico) que lee el estado actual materializado en la tabla local sin esperar cambios futuros.</li>\n</ul>\n<div class=\"tip\"><b>Sintonización de Memoria RocksDB:</b> RocksDB almacena sus memtables y block caches <b>fuera del Heap de la JVM (Off-Heap)</b>. Si asignas un contenedor de 8 GB con un heap de JVM de 7 GB y múltiples KTables con estado, el proceso sufrirá un OOMKilled de Linux (Exit Code 137). Reserva al menos un 40-50 % de la RAM del contenedor para RocksDB.</div>\n"
  },
  {
    "id": "t-5-1",
    "d": 5,
    "title": "5.1 · Seguridad: Autenticación (mTLS, SASL), Cifrado y Autorización con ACLs",
    "html": "\n<h4>Planos de Seguridad en Apache Kafka</h4>\n<p>La seguridad integral en un clúster de Kafka contempla tres dimensiones complementarias:</p>\n<table class=\"keytable\">\n<tr><th>Dimensión</th><th>Mecanismo Principal</th><th>Configuración Broker / Cliente</th></tr>\n<tr><td><b>Cifrado en Tránsito</b></td><td>TLS / SSL</td><td>Cifra los paquetes de red entre productores, consumidores, brokers y componentes Confluent.</td></tr>\n<tr><td><b>Autenticación</b></td><td>mTLS (Mutual TLS / SSL)<br>SASL (SCRAM, OAUTH, GSSAPI/Kerberos)</td><td>Verifica la identidad criptográfica del cliente o usuario (determina el <i>KafkaPrincipal</i>).</td></tr>\n<tr><td><b>Autorización</b></td><td>Access Control Lists (ACLs)</td><td>Define qué operaciones (Read, Write, Create, Describe) puede ejecutar un <i>Principal</i> sobre qué recurso.</td></tr>\n</table>\n\n<h4>Protocolos SASL en Producción</h4>\n<table class=\"keytable\">\n<tr><th>Mecanismo SASL</th><th>Criptografía / Características</th><th>Caso de Uso Habitual</th></tr>\n<tr><td><b>SASL/SCRAM</b><br>(SCRAM-SHA-256 / 512)</td><td>Intercambio de claves seguro con salting y hashing criptográfico en varias iteraciones. Las credenciales se almacenan dinámicamente en KRaft o ZooKeeper sin reiniciar brokers.</td><td>Estándar de facto moderno para autenticación por usuario/contraseña sin infraestructura externa pesada.</td></tr>\n<tr><td><b>SASL/OAUTHBEARER</b></td><td>Tokens JWT emitidos por un servidor OpenID Connect / OAuth 2.0 externo (Okta, Keycloak, Azure AD).</td><td>Arquitecturas cloud-native y SSO corporativo con rotación federada de tokens de corta duración.</td></tr>\n<tr><td><b>SASL/GSSAPI (Kerberos)</b></td><td>Tickets Kerberos respaldados por Active Directory o MIT Kerberos.</td><td>Grandes corporaciones y bancos con infraestructura Kerberos heredada.</td></tr>\n<tr><td><b>SASL/PLAIN</b></td><td>Contraseña en texto claro sin hash.</td><td><b>Peligroso:</b> Solo admisible si se encapsula obligatoriamente sobre canales cifrados con TLS (<code>SASL_SSL</code>).</td></tr>\n</table>\n\n<h4>Autorización mediante ACLs: Reglas y Estructura</h4>\n<p>Las ACLs de Kafka son evaluadas por el autorizador del broker (<code>org.apache.kafka.metadata.authorizer.StandardAuthorizer</code> en KRaft):</p>\n<pre><code>Principal P is [Allowed / Denied] Operation O from Host H on Resource R</code></pre>\n<ul>\n  <li><b>Deny Precedence:</b> Si un cliente coincide con una regla de <code>DENY</code> y una regla de <code>ALLOW</code> simultáneamente, <b>la regla de DENY siempre tiene precedencia absoluta</b>.</li>\n  <li><b>Denegación por Defecto:</b> Con <code>allow.everyone.if.no.acl.found = false</code>, cualquier petición sobre un recurso sin una regla explícita de <code>ALLOW</code> es rechazada de inmediato con <code>TopicAuthorizationException</code> o <code>ClusterAuthorizationException</code>.</li>\n  <li><b>Permisos Mínimos para Productor:</b> Operación <code>Write</code> y <code>Describe</code> sobre el <code>Topic</code>. Si usa transacciones o idempotencia, requiere además <code>Write</code> y <code>Describe</code> sobre el <code>TransactionalId</code>.</li>\n  <li><b>Permisos Mínimos para Consumidor:</b> Operación <code>Read</code> y <code>Describe</code> sobre el <code>Topic</code>, y operación <code>Read</code> sobre el <code>Group</code> correspondiente.</li>\n</ul>\n<div class=\"tip\"><b>Configuración mTLS (Keystore vs. Truststore):</b> El <b>Keystore</b> contiene la clave privada del cliente y su propio certificado firmado (para presentarse al broker). El <b>Truststore</b> contiene los certificados de las Autoridades Certificadoras (CA) de confianza para validar que el certificado presentado por el broker es legítimo.</div>\n"
  },
  {
    "id": "t-5-2",
    "d": 5,
    "title": "5.2 · Operaciones: Log Compaction, Tiered Storage y Métricas JMX Críticas",
    "html": "\n<h4>Log Compaction: Ciclo de Vida y Limpieza</h4>\n<p>Con <code>cleanup.policy = compact</code>, Kafka garantiza retener al menos el último valor conocido para cada clave dentro de una partición (ideal para tablas de dimensión, configuraciones o changelogs):</p>\n<ul>\n  <li><b>Head vs. Tail:</b> El <i>Tail</i> contiene segmentos ya procesados y compactados (Clean). El <i>Head</i> contiene los registros nuevos no compactados (Dirty). Los hilos de <i>Log Cleaner</i> leen el Head y construyen un mapa de offsets recientes en RAM (SkimpyOffsetMap) para purgar registros obsoletos en el Tail.</li>\n  <li><b>Segmento Activo:</b> El segmento activo (donde se escribe actualmente) <b>nunca es compactado</b>, sin importar cuántos mensajes duplicados reciba.</li>\n  <li><b>Tombstones (Borrado):</b> Para eliminar una clave, el productor escribe un registro con esa clave y <b>valor null</b>. El broker retiene el tombstone durante <code>delete.retention.ms</code> (default 24h) para asegurar que los consumidores lentos observen la eliminación antes de purgarlo del disco.</li>\n</ul>\n\n<h4>Tiered Storage (Confluent / KIP-405)</h4>\n<p>Resuelve el dilema entre capacidad de almacenamiento y costo en arquitecturas con retención de meses o años:</p>\n<ul>\n  <li><b>Hot Storage (Local NVMe/SSD):</b> Almacena los segmentos activos y recientes para atender lecturas en tiempo real con latencia de sub-milisegundo.</li>\n  <li><b>Cold Storage (Object Storage: S3, GCS, Azure Blob):</b> Los segmentos cerrados se suben automáticamente a almacenamiento de objetos masivo y económico.</li>\n  <li><b>Reasignación Rápida de Particiones:</b> Al migrar particiones entre brokers, solo se transfieren los pocos segmentos locales calientes; el almacenamiento histórico no se copia entre nodos.</li>\n</ul>\n\n<h4>Métricas JMX Críticas en Producción</h4>\n<table class=\"keytable\">\n<tr><th>Métrica JMX</th><th>Valor Ideal</th><th>Interpretación de Alerta</th></tr>\n<tr><td><code>UnderReplicatedPartitions</code></td><td><b>0</b></td><td>Indica que una o más réplicas del ISR no siguen el ritmo del líder. Pérdida inminente de redundancia ante fallos.</td></tr>\n<tr><td><code>OfflinePartitionsCount</code></td><td><b>0</b></td><td><b>P1 Crítico:</b> Partición sin ningún líder disponible. Fallan todas las operaciones de lectura y escritura.</td></tr>\n<tr><td><code>ActiveControllerCount</code></td><td><b>1</b></td><td>Exactamente 1 en todo el clúster. Si es 0, no hay controlador activo (metadatos congelados). Si es &gt; 1 en ZooKeeper, hay Split-Brain.</td></tr>\n<tr><td><code>RequestHandlerAvgIdlePercent</code></td><td><b>&gt; 0.30 (30 %)</b></td><td>Porcentaje de tiempo ocioso de los hilos de red/request. Si cae por debajo del 20 %, los brokers están saturados de CPU o disco.</td></tr>\n<tr><td><code>Consumer Lag</code></td><td>Cercano a 0</td><td>Distancia entre el LEO del log y el offset committeado por el grupo. Un crecimiento constante alerta de consumidores colapsados.</td></tr>\n</table>\n<div class=\"tip\"><b>Sintonización del Heap en Brokers:</b> El broker de Kafka está diseñado para confiar en el <b>PageCache del Kernel de Linux</b>. No asignes más de 8 a 12 GB de RAM al Heap de la JVM (<code>-Xms8g -Xmx8g</code>). Dejar 40–50 GB de RAM libres en el nodo para el PageCache permite a Kafka servir lecturas de los consumidores directamente desde RAM sin tocar el disco físico gracias a la llamada al sistema <code>sendfile</code> (Zero-Copy).</div>\n"
  }
],
    questions: [
      {
        "id": "q-1",
        "d": 1,
        "t": "KRaft y Quórum de Metadatos",
        "q": "Tu organización está migrando un clúster de Apache Kafka de 100 brokers desde ZooKeeper hacia KRaft (Kafka Raft Metadata Mode). Durante la fase de diseño para producción, el equipo de arquitectura debate la topología de los nodos y los roles a configurar mediante **process.roles**. ¿Cuál es la recomendación oficial de arquitectura para un clúster de este tamaño?",
        "o": [
          "Desplegar un quórum dedicado e independiente de 3 o 5 nodos con `process.roles=controller` y configurar los 100 brokers con `process.roles=broker`, aislando roles.",
          "Configurar los 100 nodos en modo combinado con `process.roles=broker,controller` para distribuir el consenso del log `@metadata` entre todos los servidores del clúster de forma homogénea.",
          "Configurar un único nodo con `process.roles=controller` y 99 nodos con `process.roles=broker`, asumiendo que KRaft delega la tolerancia a fallos de metadatos en el almacenamiento local.",
          "Desplegar un número par de 4 controladores dedicados con `process.roles=controller` y 100 brokers, para equilibrar la votación del quórum equitativamente entre dos zonas de disponibilidad."
        ],
        "a": 0,
        "e": "En entornos de producción de mediana y gran escala, mezclar los roles de broker y controller en los mismos nodos (**process.roles=broker,controller**) expone al quórum de metadatos a interferencias severas de I/O de disco, saturación de ancho de banda y pausas de Garbage Collection provocadas por el tráfico de datos de los clientes. La recomendación oficial es aislar 3 o 5 nodos dedicados con **process.roles=controller** ejecutando el consenso Raft sobre el tópico interno **@metadata**, mientras el resto opera como brokers puros."
      },
      {
        "id": "q-2",
        "d": 1,
        "t": "High Watermark y LEO",
        "q": "Un productor envía un mensaje a la partición 0 de un tópico con **replication.factor=3** y **min.insync.replicas=2**. El broker líder de la partición escribe el mensaje en su log local, actualizando su Log End Offset (LEO) de 104 a 105. Sin embargo, las dos réplicas follower que forman parte del ISR aún no han enviado su siguiente petición de fetch para copiar este registro. Un consumidor configurado con **isolation.level=read_uncommitted** realiza una llamada a **poll()**. ¿Podrá este consumidor leer el mensaje con offset 104?",
        "o": [
          "No, porque ningún consumidor puede leer por encima del High Watermark (HW), y el HW solo avanza cuando las réplicas del ISR confirman la replicación del registro.",
          "Sí, porque con `isolation.level=read_uncommitted` el consumidor lee directamente hasta el Log End Offset (LEO) del líder sin esperar la replicación de los followers.",
          "Sí, siempre que el productor haya configurado `acks=1` o `acks=0`, lo cual autoriza al broker líder a exponer el mensaje de inmediato en la llamada a `poll()` del cliente.",
          "No, porque con `min.insync.replicas=2` las lecturas se redirigen obligatoriamente a una réplica follower del ISR hasta que el líder complete la sincronización local."
        ],
        "a": 0,
        "e": "El High Watermark (HW) representa el offset del último registro que ha sido replicado en todas las réplicas pertenecientes al ISR. En Apache Kafka, ningún consumidor (incluso configurado con **isolation.level=read_uncommitted**) puede leer más allá del HW. Esto previene lecturas sucias (dirty reads): si el líder fallara antes de que los followers repliquen el offset 104, el nuevo líder elegido no contendría dicho offset, por lo que ningún cliente debe haberlo visto jamás."
      },
      {
        "id": "q-3",
        "d": 1,
        "t": "In-Sync Replicas y replica.lag.time.max.ms",
        "q": "En un clúster de Kafka con **replica.lag.time.max.ms=30000** (30 segundos), un broker follower que aloja una réplica de una partición crítica sufre una pausa prolongada de Garbage Collection (Stop-The-World) provocada por un heap mal dimensionado. La pausa dura 42 segundos, tiempo durante el cual el follower no envía ninguna petición FetchRequest al líder. ¿Qué acción ejecuta el broker líder transcurridos los 30 segundos?",
        "o": [
          "El líder expulsa a la réplica follower del conjunto de réplicas en sincronía (ISR), notificando al controlador para actualizar los metadatos de la partición.",
          "El líder marca la partición como degradada y rechaza escrituras con `NotEnoughReplicasException`, aunque el resto de réplicas en el ISR sigan respondiendo a las peticiones.",
          "El líder declara la partición en estado `Offline` y rechaza peticiones tanto de productores como de consumidores hasta completar la reconexión del broker y restaurar el quórum.",
          "El líder transfiere de forma preventiva el liderazgo de la partición al siguiente follower para intentar restablecer la comunicación con el quórum KRaft."
        ],
        "a": 0,
        "e": "El parámetro **replica.lag.time.max.ms** define el tiempo máximo que una réplica follower puede tardar en enviar una petición de fetch y mantenerse al día con el LEO del líder. Si transcurre ese tiempo sin actividad de sincronización, el líder detecta la anomalía y remueve al follower del ISR actualizando el estado de la partición en el quórum de metadatos (KRaft o ZK), permitiendo que las escrituras continúen normalmente si se cumple **min.insync.replicas**."
      },
      {
        "id": "q-4",
        "d": 1,
        "t": "min.insync.replicas y Disponibilidad",
        "q": "Un tópico de pagos críticos en producción está configurado con **replication.factor=3** y **min.insync.replicas=2**. Todos los productores envían transacciones con **acks=all** (-1). Durante una caída de red en un centro de datos, se desconectan simultáneamente 2 de los 3 brokers que alojan las réplicas de la partición 0, quedando únicamente el broker líder en el ISR (tamaño del ISR = 1). ¿Qué comportamiento observarán los productores y los consumidores sobre la partición 0?",
        "o": [
          "Los productores recibirán una excepción `NotEnoughReplicasException` y sus escrituras se rechazarán; los consumidores podrán seguir leyendo los mensajes confirmados hasta el High Watermark.",
          "Tanto las operaciones de escritura de los productores como las operaciones de lectura de los consumidores fallarán de inmediato con `NotEnoughReplicasException` hasta restaurar el ISR.",
          "Los productores continuarán escribiendo con éxito porque el líder degrada de forma transparente el nivel a `acks=1`, pero las lecturas de los consumidores quedarán pausadas.",
          "Los productores quedarán bloqueados en el cliente hasta que expire `delivery.timeout.ms`, mientras que los consumidores recibirán un error `OffsetOutOfRangeException` continuo."
        ],
        "a": 0,
        "e": "Cuando un productor envía con **acks=all** y el tamaño del ISR actual es menor que **min.insync.replicas** (en este caso 1 < 2), el broker líder rechaza la escritura con **NotEnoughReplicasException** (o **NotEnoughReplicasAfterAppendException**) para evitar comprometer la durabilidad pactada. Sin embargo, los consumidores no se ven bloqueados: pueden continuar leyendo todos los datos históricos que ya habían alcanzado el High Watermark antes del incidente."
      },
      {
        "id": "q-5",
        "d": 1,
        "t": "Unclean Leader Election",
        "q": "Un clúster de Kafka tiene configurado a nivel global **unclean.leader.election.enable=false**. Para una partición con **replication.factor=3**, el broker líder cae repentinamente y, al mismo tiempo, el único follower que formaba parte del ISR sufre una avería de hardware irreparable. El tercer broker del clúster aloja una réplica que estaba fuera del ISR debido a un desfase de 5.000 offsets. ¿Qué ocurre con la partición en este escenario?",
        "o": [
          "La partición se declara en estado `Offline` y rechaza lecturas y escrituras hasta que vuelva a estar en línea al menos una de las réplicas que formaban parte del ISR original.",
          "El controlador promueve a la réplica fuera del ISR como nuevo líder para garantizar disponibilidad, truncando permanentemente los 5.000 offsets que no fueron replicados.",
          "El controlador reasigna dinámicamente la partición a otro broker disponible del clúster y solicita a los productores retransmitir los últimos 5.000 registros mediante idempotencia.",
          "La partición continúa operativa en modo de solo lectura atendida por la réplica rezagada, bloqueando únicamente nuevas escrituras de los productores hasta recuperar el ISR."
        ],
        "a": 0,
        "e": "Con **unclean.leader.election.enable=false**, Kafka prioriza estrictamente la consistencia y la durabilidad de los datos sobre la disponibilidad. Si no queda ninguna réplica viva dentro del ISR, ninguna réplica rezagada (fuera del ISR) puede ser elegida como nuevo líder. Como consecuencia, la partición entra en estado **Offline** (rechazando lecturas y escrituras) hasta que al menos un miembro del ISR original se recupere, garantizando que jamás se pierdan datos confirmados."
      },
      {
        "id": "q-6",
        "d": 1,
        "t": "Impacto de Unclean Leader Election forzada",
        "q": "En el escenario anterior, la dirección del negocio exige que el servicio vuelva a operar de inmediato cueste lo que cueste y ordena al administrador ejecutar un comando dinámico para establecer **unclean.leader.election.enable=true** en el tópico. La réplica rezagada (con 5.000 offsets de retraso) es elegida como nuevo líder. ¿Qué consecuencia irreversible de integridad de datos se produce inmediatamente?",
        "o": [
          "Se pierden de forma permanente los 5.000 registros no replicados y, si el líder previo se recupera, truncará su log a la época del nuevo líder, descartando esos datos.",
          "Los 5.000 registros faltantes se mueven al tópico de Dead Letter Queue (`__dead_letter`) del clúster para que los consumidores los reprocesen manualmente tras el incidente.",
          "El nuevo líder entra en modo de solo lectura para preservar la consistencia hasta que un administrador ejecute `kafka-leader-election.sh` para forzar la resincronización.",
          "Los consumidores conectados recibirán inmediatamente un error fatal `OffsetOutOfRangeException` y se desconectarán del grupo al detectar saltos en la numeración del log de la partición."
        ],
        "a": 0,
        "e": "Activar **unclean.leader.election.enable=true** permite que una réplica fuera del ISR se convierta en líder para restaurar la disponibilidad. Sin embargo, todos los registros confirmados que residían en el líder original y que nunca llegaron a esta réplica rezagada se pierden de forma permanente. Cuando el antiguo líder se reinicia, detecta que el nuevo líder tiene una época de líder superior y trunca su propio log para igualar al nuevo líder, destruyendo los datos que previamente habían sido confirmados como exitosos."
      },
      {
        "id": "q-7",
        "d": 1,
        "t": "Segmentos de Log y Ficheros de Índice",
        "q": "Un broker de Kafka almacena 2 TB de registros en el directorio de datos de una partición de alto volumen. Un consumidor solicita leer a partir del offset lógico 450.210. ¿Cómo localiza el broker la posición física exacta del registro en el disco sin verse obligado a escanear linealmente gigabytes de datos en el archivo **.log**?",
        "o": [
          "Consulta el archivo de índice disperso `.index` en memoria mediante búsqueda binaria para ubicar la posición física en bytes más cercana y avanza secuencialmente en el archivo.",
          "Consulta el archivo `.timeindex` para resolver el offset a través del timestamp y salta al desplazamiento físico indicado en el encabezado de compresión del segmento de datos.",
          "Recorre el archivo de metadatos `leader-epoch-checkpoint` de la partición para determinar el byte offset exacto correspondiente al inicio del lote de registros.",
          "Usa un filtro de Bloom cargado en el PageCache para verificar la existencia del offset y recupera el puntero de archivo desde el registro de control de la partición."
        ],
        "a": 0,
        "e": "Kafka divide las particiones en segmentos y asocia a cada archivo de datos **.log** un archivo de índice disperso **.index**. Este archivo mapea offsets relativos a posiciones físicas en bytes (file pointers) dentro del archivo **.log**. Gracias a que el índice está ordenado y reside en el PageCache de Linux, el broker ejecuta una búsqueda binaria O(log N) para saltar al byte más próximo y luego recorre secuencialmente apenas unos pocos registros hasta el offset exacto, logrando lecturas ultra-eficientes."
      },
      {
        "id": "q-8",
        "d": 1,
        "t": "Segment Roll y Políticas de Retención",
        "q": "Un tópico de auditoría tiene configurada una retención por tiempo de 7 días (**retention.ms=604800000**). Sin embargo, al inspeccionar el almacenamiento del broker, el equipo de SRE descubre mensajes que tienen más de 16 días de antigüedad en el disco. Al revisar la configuración de segmentos, observan que **segment.bytes=1073741824** (1 GB) y **segment.ms=1814400000** (21 días), y el archivo **.log** actual apenas pesa 250 MB. ¿Por qué no se han eliminado los mensajes antiguos?",
        "o": [
          "Porque la retención solo evalúa segmentos cerrados; mientras el segmento activo no alcance `segment.bytes` ni `segment.ms`, no se rota y ningún mensaje dentro de él puede ser purgado.",
          "Porque el parámetro `retention.check.interval.ms` del broker tiene precedencia sobre `retention.ms`, retrasando la limpieza hasta que el log alcance el límite global de tamaño en disco.",
          "Porque la purga por tiempo requiere que los consumidores del grupo confirmen todos los offsets del segmento antes de que el hilo `LogCleaner` proceda a su eliminación física de disco.",
          "Porque cuando coexisten políticas de retención, `segment.ms` actúa como valor mínimo obligatorio de permanencia en disco antes de habilitar el borrado por `retention.ms`."
        ],
        "a": 0,
        "e": "En Kafka, el segmento activo (aquel en el que se están escribiendo los nuevos mensajes) nunca se elimina ni se compacta, independientemente de la antigüedad de los registros que contenga. Las políticas de retención (tanto por tiempo con **retention.ms** como por tamaño con **retention.bytes**) solo se evalúan y aplican sobre segmentos cerrados (inactivos). Para tópicos con bajo ritmo de publicación, es crucial ajustar **segment.ms** a un valor menor o igual a **retention.ms** para forzar el roll del segmento y permitir la purga oportuna."
      },
      {
        "id": "q-9",
        "d": 1,
        "t": "Quórum de Controladores KRaft y Tolerancia a Fallos",
        "q": "En una arquitectura KRaft para un entorno financiero regulado, se despliegan **5 nodos dedicados** con el rol de controladores (**process.roles=controller**). Basándote en el algoritmo de consenso Raft utilizado por KRaft, ¿cuál es el número mínimo de controladores que deben permanecer en línea y operativos para que el quórum pueda elegir un líder de metadatos y procesar cambios en el clúster (como creación de tópicos o reasignación de particiones)?",
        "o": [
          "Al menos 3 controladores (mayoría simple de (5/2) + 1), permitiendo tolerar la caída simultánea de hasta 2 nodos sin perder disponibilidad de metadatos.",
          "Al menos 4 controladores, ya que el protocolo Raft de KRaft exige una supermayoría de dos tercios de votos para autorizar cambios en el log `@metadata`.",
          "Al menos 2 controladores, siempre que el líder actual permanezca activo y se mantenga sincronizada la réplica observadora en la misma zona de red.",
          "Los 5 controladores de forma estricta, debido a que cualquier partición de red en el quórum bloquea preventivamente las escrituras en el clúster."
        ],
        "a": 0,
        "e": "KRaft se basa en el algoritmo de consenso distribuido Raft. Para un quórum de N nodos, el número de nodos activos requeridos para formar mayoría (quórum) es **floor(N/2) + 1**. Para N = 5, se requiere que al menos 3 controladores estén en línea y comunicados entre sí. Por lo tanto, el sistema puede tolerar la caída simultánea de hasta **(N - 1) / 2 = 2** controladores sin perder la capacidad de realizar cambios en los metadatos del clúster."
      },
      {
        "id": "q-10",
        "d": 1,
        "t": "Rack Awareness y Distribución de Réplicas",
        "q": "Estás desplegando un clúster de Kafka en AWS a través de 3 Zonas de Disponibilidad (us-east-1a, us-east-1b, us-east-1c). Quieres asegurarte de que para cualquier tópico con **replication.factor=3**, ninguna partición tenga más de una réplica ubicada en la misma Zona de Disponibilidad, garantizando que la caída total de una AZ no provoque pérdida de datos ni indisponibilidad. ¿Qué configuración debe definirse en cada broker?",
        "o": [
          "Configurar `broker.rack` en cada broker con el identificador de su zona, permitiendo que el asignador de réplicas distribuya las particiones entre zonas distintas.",
          "Configurar `replica.selector.class` con `RackAwareReplicaSelector` en cada broker para que las réplicas se repartan dinámicamente según la topología de red de las zonas.",
          "Definir `advertised.listeners` con el sufijo DNS de cada zona de disponibilidad y habilitar `zookeeper.rack.enable=true` en la configuración global de todos los brokers del clúster.",
          "Establecer `min.insync.replicas=3` a nivel global para forzar que el quórum de réplicas requiera la confirmación obligatoria de brokers en distintas zonas."
        ],
        "a": 0,
        "e": "La propiedad **broker.rack** habilita el mecanismo de Rack Awareness en Apache Kafka. Al indicar a qué rack o zona de disponibilidad pertenece cada broker, el algoritmo de asignación de réplicas distribuye automáticamente las réplicas de cada partición entre distintos racks lógicos. De este modo, para **replication.factor=3** repartido en 3 AZs distintas, se garantiza que cada réplica resida en una AZ diferente, protegiendo al clúster contra caídas completas de un datacenter o AZ."
      },
      {
        "id": "q-11",
        "d": 1,
        "t": "Particionado y Capacidad de Paralelismo",
        "q": "Una plataforma de streaming de video necesita procesar una tasa sostenida de **60.000 eventos por segundo**. Se ha medido rigurosamente que cada instancia de microservicio consumidor puede procesar de forma estable un máximo de **3.000 eventos por segundo**. El tópico fue creado originalmente con **8 particiones**. El equipo de operaciones despliega un deployment en Kubernetes con **20 pods** del mismo Consumer Group. ¿Cuál será el throughput real alcanzado y cómo debe resolverse el cuello de botella?",
        "o": [
          "Solo 8 pods procesarán datos (24.000 eps en total) quedando 12 pods ociosos; se deben ampliar las particiones del tópico al menos a 20 para permitir el consumo simultáneo en paralelo.",
          "Los 20 pods consumirán en paralelo alcanzando 60.000 eps, ya que Kafka asigna múltiples consumidores a cada partición si pertenecen al mismo grupo de despliegue en el clúster.",
          "El Consumer Group fallará con una excepción `IllegalStateException` en el broker, ya que Kafka prohíbe tener más miembros activos que particiones en el tópico.",
          "Se alcanzarán 60.000 eps pero con duplicación masiva de eventos, ya que los 12 pods sobrantes leerán en modo concurrente las particiones ya asignadas."
        ],
        "a": 0,
        "e": "Una regla fundamental del protocolo de Consumer Groups en Apache Kafka es que cada partición de un tópico es asignada a **a lo sumo un consumidor** dentro de un mismo grupo. Por tanto, con 8 particiones, como máximo 8 instancias pueden procesar datos en paralelo (8 × 3.000 = 24.000 eps); las 12 instancias restantes permanecen ociosas en espera pasiva. Para alcanzar los 60.000 eps, el tópico debe escalarse a al menos 20 particiones (20 × 3.000 = 60.000 eps)."
      },
      {
        "id": "q-12",
        "d": 1,
        "t": "Zero-Copy y Rendimiento de I/O en Linux",
        "q": "Una de las razones primordiales por las cuales un broker de Apache Kafka puede entregar millones de mensajes por segundo con un consumo de CPU excepcionalmente bajo es el uso de la técnica **Zero-Copy**. ¿Cómo opera esta optimización a nivel del sistema operativo y qué llamada al sistema de Linux utiliza el broker para transferir datos desde los segmentos de log hacia los sockets de red de los consumidores?",
        "o": [
          "Utiliza la syscall `sendfile()`, que transfiere datos del PageCache del kernel al socket de red mediante DMA, sin copiarlos al espacio de usuario de la JVM.",
          "Utiliza `mmap()` junto con buffers off-heap de Java NIO, permitiendo que la JVM transfiera bloques de datos desde el disco a la interfaz de red sin cambios de contexto.",
          "Utiliza la syscall `splice()` para conectar descriptores de archivo a través de pipes del kernel, obligando a descomprimir los lotes en memoria intermedia antes de transmitirlos por el socket.",
          "Utiliza `epoll()` con llamadas `readv()` y `writev()` vectorizadas, delegando la serialización directa de bytes en el hardware de la controladora de red."
        ],
        "a": 0,
        "e": "En arquitecturas tradicionales, leer de disco y enviar por red requiere 4 cambios de contexto y 4 copias de datos (disco -> kernel buffer -> user space JVM -> socket buffer -> NIC). Con la llamada al sistema **sendfile()** de Linux (Zero-Copy), los datos se transfieren por DMA directamente desde el PageCache del kernel al socket de red de la interfaz física, sin cruzar jamás la frontera al espacio de usuario de la JVM. Esto elimina el uso innecesario de memoria en el heap y libera ciclos de CPU."
      },
      {
        "id": "q-13",
        "d": 2,
        "t": "Garantías de Durabilidad en Productores",
        "q": "Una plataforma bancaria procesa transferencias monetarias de alto valor y simultáneamente recopila métricas de clics de navegación web. El equipo de desarrollo debe configurar dos productores de Kafka independientes. Para las transferencias bancarias no se tolera la pérdida de un solo evento bajo ninguna circunstancia; para las métricas web se busca la mínima latencia posible y se tolera pérdida ocasional. ¿Cuáles son las configuraciones de **acks** recomendadas para cada caso?",
        "o": [
          "Transferencias: `acks=all` (-1) con reintentos activos; Métricas web: `acks=0` en modo fire-and-forget.",
          "Transferencias: `acks=1` con reintentos infinitos; Métricas web: `acks=all` con `delivery.timeout.ms=0`.",
          "Transferencias: `acks=all` con `retries=0`; Métricas web: `acks=1` con compresión `snappy` obligatoria.",
          "Transferencias: `acks=2` con quórum de réplicas; Métricas web: `acks=-1` con buffer de envío deshabilitado."
        ],
        "a": 0,
        "e": "Para transacciones bancarias críticas donde la pérdida de datos es inaceptable, la configuración mandatoria es **acks=all** (o -1), obligando al broker líder a esperar la confirmación de todas las réplicas en el ISR antes de responder ACK al productor, combinada con reintentos prácticamente infinitos (**retries=Integer.MAX_VALUE** o **delivery.timeout.ms** alto). Para métricas descartables donde prima la mínima latencia y el máximo throughput, **acks=0** envía los paquetes en modo fire-and-forget sin esperar confirmación alguna."
      },
      {
        "id": "q-14",
        "d": 2,
        "t": "Idempotencia de Productor (KIP-98)",
        "q": "Un productor envía un mensaje crítico al broker. El broker persiste el mensaje en disco exitosamente, pero una micro-interrupción de red impide que la respuesta de ACK llegue de regreso al productor. Al expirar el timeout, el productor reintenta automáticamente el envío del mismo mensaje. Si el productor tiene configurado **enable.idempotence=true**, ¿cómo evita el broker registrar un mensaje duplicado?",
        "o": [
          "El broker valida el Producer ID (PID) y el Sequence Number asignado por el productor; si ya fueron persistidos, confirma el ACK sin duplicar el registro en el log local de la partición.",
          "El broker calcula una suma de verificación CRC32 del payload y descarta el mensaje entrante si coincide con algún registro almacenado en el índice de la partición.",
          "El broker rechaza el mensaje duplicado comparando el offset asignado por el cliente con el High Watermark actual de la partición antes de escribirlo en disco.",
          "El broker delega la detección en el quórum KRaft, que mantiene una tabla temporal en memoria con los hashes de las transacciones procesadas en los últimos 60 segundos."
        ],
        "a": 0,
        "e": "Con **enable.idempotence=true**, el broker asigna a cada productor un Producer ID (PID) único durante el inicio. Por cada partición, el productor mantiene un número de secuencia entero monotónico por mensaje o lote. El broker guarda en memoria los últimos números de secuencia procesados: si recibe un mensaje con un PID y Sequence Number que ya tiene registrado, reconoce que se trata de un reintento por fallo de red, devuelve ACK al productor y descarta escribir el duplicado en el commit log."
      },
      {
        "id": "q-15",
        "d": 2,
        "t": "Ordenamiento y max.in.flight.requests con Idempotencia",
        "q": "Tradicionalmente, para garantizar que los mensajes no se desordenen en caso de reintentos por fallo de red, los ingenieros de Kafka debían configurar **max.in.flight.requests.per.connection=1**, lo que penalizaba severamente el throughput. ¿Por qué en versiones modernas de Apache Kafka con **enable.idempotence=true** es posible configurar **max.in.flight.requests.per.connection** hasta **5** manteniendo una estricta garantía de orden?",
        "o": [
          "Porque el broker rastrea hasta 5 números de secuencia por PID y partición; si un lote se desordena por reintentos, lo rechaza con `OutOfOrderSequenceException` preservando el orden.",
          "Porque el cliente suspende la transmisión en el socket TCP y almacena en buffer las peticiones siguientes hasta recibir la confirmación de la petición más antigua enviada en el pipeline.",
          "Porque el broker bufferiza las peticiones entrantes en una cola de prioridad basada en el timestamp de creación del registro antes de persistirlas secuencialmente en el log de la partición.",
          "Porque el protocolo de red de KRaft intercepta los lotes en tránsito y reasigna dinámicamente los offsets lógicos en el quórum de controladores antes del guardado físico."
        ],
        "a": 0,
        "e": "Con idempotencia habilitada, el broker rastrea hasta 5 peticiones en vuelo por partición validando los números de secuencia. Si el lote 0 sufre un fallo transitorio de red y se reintenta mientras el lote 1 ya está en tránsito, el broker no aceptará el lote 1 hasta que el lote 0 haya sido persistido secuencialmente (o arrojará **OutOfOrderSequenceException** si se produce un salto inesperado), garantizando el orden perfecto de llegada sin reducir el paralelismo de red a 1."
      },
      {
        "id": "q-16",
        "d": 2,
        "t": "Transacciones EOS y transactional.id",
        "q": "Una aplicación de procesamiento financiero implementa el patrón **consume-transform-produce** para transferir saldo entre dos cuentas representadas en diferentes tópicos. Para garantizar semántica Exactly-Once (EOS), el desarrollador inicializa el productor con un **transactional.id** estático y delimita el procesamiento con **beginTransaction()** y **commitTransaction()**. ¿Cuál es el rol del componente **Transaction Coordinator** en el broker durante este flujo?",
        "o": [
          "Ejecuta un Two-Phase Commit registrando el estado en `__transaction_state` y escribiendo marcadores de control atómicos (COMMIT/ABORT) en las particiones de datos.",
          "Bloquea temporalmente el acceso de lectura en las particiones participantes para evitar que otros consumidores lean registros incompletos durante el procesamiento.",
          "Retiene los mensajes transaccionales en un buffer off-heap en el broker hasta recibir el commit final, evitando escrituras previas en los segmentos de disco.",
          "Supervisa los números de secuencia del productor y descarta automáticamente duplicados en el log `@metadata` sin intervenir en las particiones de usuario."
        ],
        "a": 0,
        "e": "El Transaction Coordinator (un broker asignado en función del hash del **transactional.id**) lidera una partición del tópico interno **__transaction_state**. Gestiona el ciclo de vida de la transacción mediante un protocolo Two-Phase Commit distribuido: registra las particiones involucradas, anota el estado inicial (Ongoing), y al recibir el commit, escribe marcadores de control atómicos (**Control Markers: COMMIT/ABORT**) en las particiones de destino antes de marcar la transacción como Complete."
      },
      {
        "id": "q-17",
        "d": 2,
        "t": "Nivel de Aislamiento en Consumidores (read_committed)",
        "q": "Una transacción en un productor incluye 100 mensajes en el tópico **transactions**. A mitad del proceso, una llamada a un servicio externo falla y la aplicación ejecuta **abortTransaction()**, lo que provoca que el Transaction Coordinator escriba un marcador de control **ABORT** en la partición. Un consumidor que está leyendo de este tópico tiene configurado **isolation.level=read_uncommitted**. ¿Qué observará este consumidor?",
        "o": [
          "Leerá los 100 mensajes de la transacción abortada con normalidad, ya que `read_uncommitted` entrega todos los registros hasta el High Watermark sin filtrar transacciones.",
          "Omitirá de forma transparente los 100 mensajes abortados, ya que el broker los elimina físicamente del segmento de log tan pronto como procesa el marcador ABORT recibido.",
          "Recibirá una excepción `TransactionAbortedException` en la llamada a `poll()` y deberá restablecer su offset manualmente al inicio de la transacción.",
          "Recibirá los 100 registros con su clave original pero con el payload sustituido por un valor nulo (`tombstone`), requiriendo validación en la aplicación."
        ],
        "a": 0,
        "e": "Por defecto, los consumidores operan con **isolation.level=read_uncommitted**, lo que significa que leen todos los mensajes que han alcanzado el High Watermark, ignorando si pertenecen a transacciones abiertas, committeadas o abortadas. Para ignorar mensajes abortados y procesar únicamente datos de transacciones exitosamente finalizadas, los consumidores deben configurarse estrictamente con **isolation.level=read_committed**."
      },
      {
        "id": "q-18",
        "d": 2,
        "t": "Mecánica de Batching: linger.ms y batch.size",
        "q": "Un microservicio productor publica eventos con una configuración de **batch.size=32768** (32 KB) y **linger.ms=10**. La aplicación envía un primer mensaje de 500 bytes hacia la partición 2 y luego se queda inactiva sin producir ningún otro evento. ¿En qué momento se transmitirá físicamente ese mensaje a través de la red hacia el broker?",
        "o": [
          "Se transmitirá al expirar el temporizador de 10 ms de `linger.ms`, ya que el mensaje no llena el buffer de 32 KB y el productor espera por más eventos.",
          "Inmediatamente en 0 ms, porque el primer registro enviado hacia una partición vacía ignora `linger.ms` para minimizar la latencia de arranque del cliente.",
          "Quedará retenido indefinidamente en el acumulador del cliente hasta que la aplicación publique suficientes eventos para completar el umbral de `batch.size`.",
          "Se transmitirá cuando transcurra el tiempo de `delivery.timeout.ms` (por defecto 120 segundos), momento en el cual el lote se descarga por timeout de entrega."
        ],
        "a": 0,
        "e": "El productor de Kafka envía un lote de registros por partición cuando se cumple cualquiera de dos condiciones (lo que ocurra primero): el tamaño acumulado alcanza **batch.size**, o transcurre el tiempo especificado en **linger.ms**. Como el mensaje de 500 bytes no alcanza los 32 KB, el productor retiene el mensaje esperando acumular más datos hasta que el temporizador de **linger.ms** (10 ms) expira, disparando el envío inmediato del lote."
      },
      {
        "id": "q-19",
        "d": 2,
        "t": "Compresión de Mensajes en el Productor",
        "q": "Una arquitectura de ingesta de logs en la nube genera mensajes JSON con un tamaño promedio de 80 KB. Se configura en el productor **compression.type=lz4**. Al monitorear la infraestructura, ¿en qué componente se ejecuta el cómputo de compresión y descompresión de los datos, y qué impacto tiene en los brokers?",
        "o": [
          "La compresión ocurre en el productor y la descompresión en el consumidor; los brokers almacenan y reenvían los lotes sin descomprimir, minimizando el consumo de CPU y red en el clúster.",
          "El productor envía los datos en texto plano y el broker líder realiza la compresión LZ4 al escribir en disco, mientras que los followers replican sin volver a comprimir.",
          "El productor comprime el mensaje, pero el broker líder debe descomprimir cada lote para validar las claves y recalcular el offset relativo en el archivo `.index`.",
          "La compresión se ejecuta en la controladora de red del broker mediante aceleración TCP Offload, transmitiendo los bloques comprimidos sin intervención de la JVM."
        ],
        "a": 0,
        "e": "En Kafka, la compresión es de extremo a extremo: el cliente productor comprime el lote de registros completo en memoria antes de transmitirlo por el socket de red, y el cliente consumidor lo descomprime al leerlo. El broker simplemente almacena los bytes comprimidos directamente en el log de disco y los transmite a los consumidores usando **sendfile()** sin descomprimirlos, preservando la CPU del broker (salvo que se configuren esquemas o transformaciones incompatibles entre tópicos)."
      },
      {
        "id": "q-20",
        "d": 2,
        "t": "Sticky Partitioner (KIP-480)",
        "q": "Una aplicación publica eventos de sensores que no tienen una clave de negocio definida, por lo que todos los mensajes se envían con **key=null** hacia un tópico con 16 particiones. En versiones anteriores de Kafka, el particionador por defecto distribuía los mensajes uno a uno en round-robin registro a registro, produciendo micro-lotes ineficientes. ¿Cómo resuelve este problema el **Sticky Partitioner**?",
        "o": [
          "Agrupa mensajes sucesivos sin clave en una misma partición hasta llenar `batch.size` o cumplir `linger.ms`, rotando luego a otra partición para maximizar el batching.",
          "Asigna de forma fija todos los mensajes con clave nula a la primera partición del tópico para evitar fragmentación en el almacenamiento PageCache de los diferentes brokers.",
          "Genera un UUID v4 sintético en memoria para cada registro sin clave y aplica el hash Murmur2, garantizando una dispersión estadística homogénea e instantánea.",
          "Distribuye los mensajes en round-robin a nivel de conexión TCP, enviando un único registro por paquete de red hacia el broker que tenga menor latencia observada en las peticiones previas."
        ],
        "a": 0,
        "e": "El Sticky Partitioner (introducido en KIP-480) mejora radicalmente el rendimiento de mensajes sin clave (**key=null**). En lugar de dispersar cada mensaje individual a una partición distinta en round-robin puro (lo que creaba batches diminutos de 1 mensaje con alta sobrecarga de red), el Sticky Partitioner se adhiere (sticks) a una partición específica hasta que el lote se llena o vence **linger.ms**, logrando lotes más densos y reduciendo sustancialmente la latencia de extremo a extremo."
      },
      {
        "id": "q-21",
        "d": 2,
        "t": "Confluent Schema Registry Wire Format",
        "q": "Un servicio legacy intenta consumir mensajes de un tópico gobernado por Confluent Schema Registry utilizando un deserializador genérico de texto plano (**StringDeserializer**). La aplicación falla inmediatamente con caracteres extraños al inicio de cada mensaje. Al examinar el payload binario crudo con un visor hexadecimal, los ingenieros ven los primeros bytes: **[0x00, 0x00, 0x00, 0x00, 0x2A]**. ¿Qué representan exactamente estos 5 bytes según el Confluent Wire Format?",
        "o": [
          "El primer byte es el Magic Byte (0x00) de Confluent y los 4 bytes siguientes corresponden al Schema ID (el entero 42 en formato Big-Endian) registrado en Schema Registry.",
          "Los 5 bytes representan un checksum CRC32 extendido utilizado por el cliente para verificar la integridad de la cabecera del mensaje ante posibles fallos de red en el socket.",
          "Corresponden al identificador numérico del broker líder seguido del índice relativo de partición física asignado durante el envío por el particionador del cliente en el protocolo de red.",
          "Indican una marca temporal UNIX truncada a 40 bits que define el instante exacto de creación del registro antes de aplicarle la compresión configurada en el cliente."
        ],
        "a": 0,
        "e": "El estándar de serialización de Confluent Schema Registry (para Avro, Protobuf y JSON Schema) antepone exactamente 5 bytes de metadatos al payload serializado: el Byte 0 es el **Magic Byte (0x00)** que identifica el protocolo de Schema Registry, y los Bytes 1 al 4 corresponden al **Schema ID** expresado como un entero de 4 bytes en orden Big-Endian. Cualquier deserializador estándar que ignore esta cabecera fallará al interpretar los primeros 5 bytes como parte de los datos."
      },
      {
        "id": "q-22",
        "d": 2,
        "t": "Compatibilidad BACKWARD en Schema Registry",
        "q": "En una arquitectura orientada a eventos, un tópico utiliza un esquema Avro con la política de compatibilidad por defecto: **BACKWARD**. El equipo del servicio de pedidos desea actualizar el esquema agregando un nuevo campo opcional con un valor por defecto (**default**). Siguiendo las reglas estrictas de compatibilidad BACKWARD, ¿cuál debe ser el orden de despliegue en producción para evitar fallos?",
        "o": [
          "Se deben actualizar y desplegar primero todos los consumidores con el nuevo esquema, y posteriormente actualizar y desplegar los productores.",
          "Se deben desplegar primero los productores para que emitan el nuevo campo, y posteriormente actualizar los consumidores cuando el esquema esté activo.",
          "Deben desplegarse productores y consumidores simultáneamente en una ventana de mantenimiento, purgando previamente los datos pendientes del tópico.",
          "Debe cambiarse primero el modo a `FORWARD` en Schema Registry, ya que `BACKWARD` prohíbe añadir nuevos campos aunque definan valores por defecto."
        ],
        "a": 0,
        "e": "La compatibilidad **BACKWARD** garantiza que los consumidores que utilizan el nuevo esquema puedan procesar correctamente los datos generados con esquemas anteriores. Por lo tanto, el orden mandatorio de despliegue exige **actualizar primero a los consumidores** (estos podrán seguir leyendo los mensajes viejos que los productores aún emiten, aplicando el valor por defecto al campo nuevo) y, una vez que todos los consumidores soporten el nuevo esquema, **actualizar a los productores**."
      },
      {
        "id": "q-23",
        "d": 2,
        "t": "Compatibilidad FULL en Schema Registry",
        "q": "Una organización global cuenta con decenas de equipos autónomos que despliegan microservicios de forma continua e independiente (CI/CD). La gerencia de arquitectura exige una política en Confluent Schema Registry que garantice que cualquier equipo pueda desplegar productores o consumidores en **cualquier orden**, asegurando que los consumidores nuevos lean mensajes de productores viejos y los consumidores viejos lean mensajes de productores nuevos. ¿Qué modo de compatibilidad debe configurarse?",
        "o": [
          "Configurar el modo de compatibilidad `FULL` (o `FULL_TRANSITIVE`), que garantiza simultáneamente compatibilidad hacia atrás (`BACKWARD`) y hacia adelante (`FORWARD`) en las versiones.",
          "Configurar el modo `FORWARD_TRANSITIVE`, ya que permite que los consumidores antiguos procesen sin interrupciones los eventos generados por nuevos esquemas futuros.",
          "Configurar el modo `BACKWARD_TRANSITIVE` y habilitar la propiedad `allow.schema.evolution=true` en el archivo de configuración de Confluent Schema Registry.",
          "Configurar el modo de validación `NONE` a nivel de subject, delegando la compatibilidad en la capacidad de los deserializadores Avro para ignorar campos desconocidos."
        ],
        "a": 0,
        "e": "El modo de compatibilidad **FULL** (y su variante **FULL_TRANSITIVE**) combina las garantías de BACKWARD y FORWARD. Esto significa que un consumidor con un esquema nuevo puede leer datos producidos con esquemas antiguos, y un consumidor con un esquema antiguo puede leer datos producidos con el esquema nuevo. Esta simetría total desacopla por completo el ciclo de despliegue, permitiendo actualizar productores o consumidores en cualquier orden sin riesgo de incompatibilidad."
      },
      {
        "id": "q-24",
        "d": 2,
        "t": "Ruptura de Enrutamiento al Modificar Particiones",
        "q": "Un tópico de pagos está particionado por la clave **user_id** utilizando el particionador por defecto de Kafka (**murmur2**). Originalmente el tópico tenía **12 particiones**. Debido a un aumento del tráfico, un operador ejecuta el comando **kafka-topics.sh --alter** para incrementar las particiones a **24**. ¿Qué consecuencia inmediata sufre la aplicación respecto al orden de procesamiento por usuario?",
        "o": [
          "Los mensajes futuros para un mismo `user_id` pueden asignarse a una partición distinta (al cambiar la fórmula `hash(key) % N`), rompiendo el orden estricto por usuario.",
          "Kafka redistribuirá de forma automática los mensajes históricos de las 12 particiones originales entre las 24 particiones para rebalancear el almacenamiento local.",
          "Los productores fallarán con una excepción fatal `TopicAuthorizationException` al detectar que los metadatos locales de particiones no coinciden con los del clúster.",
          "El orden por usuario se preserva porque Kafka mantiene un mapa histórico de claves en el archivo `meta.properties` para enrutar los mismos usuarios a las particiones previas."
        ],
        "a": 0,
        "e": "El particionador por defecto asigna las particiones calculando **murmur2(key) % total_partitions**. Si el número total de particiones cambia (de 12 a 24), el resultado del módulo matemático cambia para la gran mayoría de las claves. A partir de ese instante, nuevos eventos para el usuario 'user-123' se escribirán en una partición distinta a donde están sus eventos históricos, rompiendo la garantía de orden secuencial por clave. Por ello, nunca se debe alterar el número de particiones de un tópico con clave sin planificar una migración."
      },
      {
        "id": "q-25",
        "d": 3,
        "t": "Topología de Consumer Groups y Particionamiento",
        "q": "Un tópico de eventos de facturación tiene **12 particiones**. Existen dos sistemas downstream independientes que consumen de este tópico: el servicio de facturación (**group.id=billing-app**) que cuenta con **4 instancias** activas, y el servicio de fraude en tiempo real (**group.id=fraud-app**) que cuenta con **12 instancias** activas. ¿Cómo asigna Kafka las particiones a los miembros de cada grupo?",
        "o": [
          "En `billing-app` cada instancia recibe 3 particiones y en `fraud-app` cada instancia recibe 1 partición; ambos grupos procesan de forma independiente todos los eventos.",
          "Las 12 particiones se dividen entre las 16 instancias totales de ambos grupos mediante round-robin global, procesando cada mensaje una sola instancia en el clúster.",
          "En `billing-app` 8 particiones quedan huérfanas sin procesar debido a que Kafka exige que el número de consumidores del grupo iguale el número de particiones del tópico.",
          "En `fraud-app` solo 4 instancias reciben particiones para mantener sincronía con el grupo de facturación y evitar asimetrías de consumo en los brokers líderes."
        ],
        "a": 0,
        "e": "El modelo de Consumer Groups de Apache Kafka desacopla completamente los grupos entre sí: cada grupo con un **group.id** diferente actúa como un suscriptor pub/sub independiente y recibe la totalidad de los datos del tópico. Dentro de cada grupo, el coordinador reparte las particiones equitativamente: en **billing-app** 12 particiones / 4 consumidores = 3 particiones por consumidor; en **fraud-app** 12 particiones / 12 consumidores = 1 partición por consumidor."
      },
      {
        "id": "q-26",
        "d": 3,
        "t": "Comportamiento de auto.offset.reset",
        "q": "Un equipo de ciencia de datos despliega una nueva aplicación analítica con un identificador de grupo nunca antes utilizado (**group.id=analytics-v1**) para consumir de un tópico con 10 millones de eventos acumulados durante el último año. El cliente se inicializa con la configuración **auto.offset.reset=earliest**. ¿Desde qué posición comenzará a leer la aplicación en su primer arranque?",
        "o": [
          "Desde el offset más antiguo disponible en cada partición (el inicio del log conservado según las reglas de retención), procesando todo el historial acumulado.",
          "Desde el High Watermark actual de cada partición, consumiendo únicamente los nuevos mensajes producidos con posterioridad al inicio de la sesión del cliente en el clúster.",
          "Fallará de inmediato con una excepción `NoOffsetForPartitionException` al no encontrar offsets confirmados previamente en el tópico `__consumer_offsets`.",
          "Desde la marca temporal correspondiente a hace 24 horas en cada partición, aplicando la ventana de desplazamiento por defecto para grupos analíticos nuevos configurada en el broker líder."
        ],
        "a": 0,
        "e": "La propiedad **auto.offset.reset** define la política a seguir cuando no existe un offset previamente comprometido en el tópico **__consumer_offsets** para ese grupo (o cuando el offset guardado ha sido eliminado por expirar la retención). Con **auto.offset.reset=earliest**, el consumidor se posiciona en el offset más bajo disponible en cada partición (el inicio del commit log), permitiendo procesar todo el historial existente de datos."
      },
      {
        "id": "q-27",
        "d": 3,
        "t": "Riesgos del Commit Automático (enable.auto.commit)",
        "q": "Un consumidor procesa pedidos en una base de datos relacional con **enable.auto.commit=true** y **auto.commit.interval.ms=5000** (5 segundos). Durante una ejecución, el consumidor extrae 100 mensajes en una llamada a **poll()**. Logra persistir 40 pedidos en la base de datos tras 3 segundos de procesamiento, pero en ese instante se produce un fallo catastrófico en el nodo (Kernel Panic) que apaga el proceso sin ejecutar ningún bloque finally. ¿Qué ocurrirá cuando el pod se reinicie y vuelva a unirse al grupo?",
        "o": [
          "Reprocesará los 40 pedidos ya insertados además de los 60 restantes, ya que el fallo ocurrió antes de vencer los 5 segundos de auto-commit y ningún offset fue confirmado.",
          "Perderá de forma permanente los 60 pedidos no procesados, dado que el consumidor confirma de manera inmediata el lote completo en el broker al retornar del método `poll()`.",
          "Retomará el procesamiento exactamente a partir del pedido 41, debido a que el broker monitoriza el flujo TCP del cliente e infiere qué registros fueron extraídos por la JVM.",
          "El grupo entrará en bloqueo por `CommitFailedException` continuo, debido a que Kafka detecta transacciones inconsistentes entre la base de datos externa y el broker."
        ],
        "a": 0,
        "e": "Con **enable.auto.commit=true**, los offsets solo se comprometen periódicamente durante las llamadas a **poll()** si ha transcurrido el intervalo de 5 segundos. Como el crash ocurrió a los 3 segundos, ningún commit fue enviado por los 100 registros leídos. Al reiniciarse, el consumidor recupera el último offset confirmado en el broker y vuelve a solicitar los mismos 100 mensajes, provocando el reprocesamiento duplicado de los 40 pedidos ya guardados (semántica At-Least-Once no idempotente)."
      },
      {
        "id": "q-28",
        "d": 3,
        "t": "commitSync vs. commitAsync y Reintentos",
        "q": "Un desarrollador de Kafka busca maximizar el throughput reemplazando **commitSync()** por **commitAsync()**. Para evitar pérdida de datos, decide implementar un callback en **commitAsync()** que, en caso de recibir un error transitorio de red, ejecuta inmediatamente un nuevo reintento del commit con ese mismo offset fallido. ¿Por qué este patrón de reintentos en **commitAsync()** se considera un grave antipatrón en producción?",
        "o": [
          "Si el commit del offset 200 falla pero uno posterior confirma el 300, un reintento tardío del 200 sobrescribiría el 300 en `__consumer_offsets`, provocando un retroceso y reprocesamiento masivo.",
          "Porque los reintentos ejecutados dentro del callback de `commitAsync()` bloquean el hilo principal de la aplicación cliente, anulando las ventajas de concurrencia asíncrona.",
          "Porque el broker rechaza peticiones asíncronas de commit si provienen del mismo hilo cliente sin haber recibido antes una confirmación previa de sincronización.",
          "Porque el protocolo de Kafka prohíbe el uso de callbacks en operaciones de consumidor cuando la propiedad `enable.auto.commit` se encuentra configurada en falso."
        ],
        "a": 0,
        "e": "**commitAsync()** no reintenta deliberadamente por diseño arquitectónico. Considera la secuencia: la petición para confirmar el offset 200 falla por un parpadeo de red, pero 50 ms después una nueva petición para confirmar el offset 300 tiene éxito. Si el callback reintenta el commit del offset 200 después de que el offset 300 ya fue persistido, el broker sobrescribirá el progreso con 200, provocando que si el consumidor se reinicia vuelva a reprocesar todo desde 200 en adelante."
      },
      {
        "id": "q-29",
        "d": 3,
        "t": "max.poll.interval.ms y Rebalance Storms",
        "q": "Un consumidor extrae lotes con la configuración por defecto de **max.poll.records=500**. Cada mensaje requiere una llamada HTTP a un servicio legacy de calificación crediticia que tarda en promedio 200 ms por registro (un total de 100 segundos para el lote completo). El parámetro **max.poll.interval.ms** está configurado en su valor por defecto de 300.000 ms (5 minutos). En una campaña de marketing, el servicio legacy se degrada y pasa a tardar 800 ms por registro (400 segundos para procesar el lote). ¿Qué síntoma crítico observará el equipo en el consumidor?",
        "o": [
          "El consumidor excede `max.poll.interval.ms` sin llamar a `poll()`, por lo que el coordinador lo declara muerto y lanza un rebalanceo continuo (Rebalance Storm).",
          "El hilo de heartbeat mantendrá la sesión activa en el broker sin inconvenientes, esperando pacientemente los 400 segundos hasta la siguiente invocación de `poll()`.",
          "El broker cerrará la conexión TCP del cliente tras 60 segundos arrojando un error no recuperable `DisconnectException` y forzará la expulsión del pod en Kubernetes.",
          "El coordinador del grupo reducirá dinámicamente el valor de `max.poll.records` a la mitad y continuará asignando lotes reducidos para evitar caídas de latencia."
        ],
        "a": 0,
        "e": "El parámetro **max.poll.interval.ms** define el tiempo máximo que el hilo principal de procesamiento puede tardar entre dos invocaciones sucesivas de **poll()**. Aunque el hilo de fondo (Heartbeat Thread) continúe enviando latidos al broker, si el procesamiento del lote supera este límite, el cliente asume que está bloqueado o en deadlock y abandona el grupo deliberadamente. El coordinador inicia un rebalanceo asignando las particiones a otro consumidor, que también se bloqueará, generando una tormenta de rebalanceos continua."
      },
      {
        "id": "q-30",
        "d": 3,
        "t": "session.timeout.ms vs. heartbeat.interval.ms",
        "q": "En la configuración de un cliente consumidor de Kafka, ¿cuál es la diferencia de responsabilidades y la relación matemática recomendada entre **session.timeout.ms** y **heartbeat.interval.ms**?",
        "o": [
          "`session.timeout.ms` marca el tiempo sin latidos para declarar muerto al cliente; `heartbeat.interval.ms` es la cadencia de latidos y debe fijarse en `≤ 1/3` del timeout.",
          "El parámetro `session.timeout.ms` controla el tiempo máximo de procesamiento de un lote en el hilo principal y debe ser siempre el triple de `heartbeat.interval.ms`.",
          "El intervalo `heartbeat.interval.ms` fija la frecuencia con que el broker envía sondeos al cliente y debe coincidir exactamente con el valor de `session.timeout.ms`.",
          "Ambos parámetros definen el intervalo de expiración de las credenciales SASL y deben configurarse con una relación matemática de paridad estricta de uno a uno en el cliente."
        ],
        "a": 0,
        "e": "**session.timeout.ms** es el umbral de detección de fallos de nodo o pérdida de red en el Group Coordinator. Por su parte, **heartbeat.interval.ms** determina con qué frecuencia el hilo de heartbeat de fondo envía señales de vida al coordinador. La recomendación oficial es configurar **heartbeat.interval.ms** en como máximo **un tercio (1/3)** de **session.timeout.ms** (por ejemplo, 3 s frente a 10 s o 45 s) para tolerar pérdidas transitorias de paquetes de red sin disparar rebalanceos prematuros."
      },
      {
        "id": "q-31",
        "d": 3,
        "t": "Rebalanceo Cooperativo Incremental (KIP-429)",
        "q": "Una empresa experimenta caídas periódicas de rendimiento en sus consumidores cada vez que un nuevo pod se suma al Consumer Group debido a la política tradicional de rebalanceo Eager (Stop-The-World). El equipo decide actualizar su asignador a **CooperativeStickyAssignor**. ¿Cómo transforma este protocolo el comportamiento del rebalanceo?",
        "o": [
          "En lugar de revocar todas las particiones en masa paralizando el grupo, solo revoca y transfiere en una segunda fase las particiones que deban cambiar de dueño sin pausar el resto.",
          "Mantiene las asignaciones activas indefinidamente y traslada la resolución de conflictos al quórum KRaft, eliminando las pausas de rebalanceo mediante réplicas provisionales del grupo.",
          "Permite que múltiples consumidores compartan en paralelo la misma partición física mientras dura la asignación, sincronizando el avance de offsets mediante un bloqueo distribuido en el clúster.",
          "Delega la asignación de particiones exclusivamente en el consumidor líder, quien redistribuye dinámicamente las particiones sin consultar ni notificar al Group Coordinator."
        ],
        "a": 0,
        "e": "El protocolo tradicional Eager requería que todos los miembros del grupo renunciaran a todas sus particiones asignadas (pausa Stop-The-World) mientras el líder del grupo calculaba el nuevo reparto. Con **CooperativeStickyAssignor** (KIP-429), el rebalanceo es incremental: los consumidores conservan sus particiones actuales y continúan procesando datos; únicamente se revocan y migran aquellas particiones específicas que deben reasignarse para equilibrar la carga, eliminando los picos de latencia en despliegues."
      },
      {
        "id": "q-32",
        "d": 3,
        "t": "Static Membership con group.instance.id (KIP-345)",
        "q": "Un conjunto de 20 consumidores de Kafka se ejecuta en Kubernetes. Cada vez que se realiza un despliegue por Rolling Update, los pods se destruyen y recrean uno por uno, provocando 40 rebalanceos globales sucesivos que saturan el clúster. ¿Cómo permite la función de **Static Membership** mediante la propiedad **group.instance.id** mitigar este problema?",
        "o": [
          "Asigna un identificador estático a cada pod; si el pod se reinicia antes de expirar `session.timeout.ms`, el coordinador conserva sus particiones sin lanzar un rebalanceo.",
          "Guarda el estado de asignación en un volumen persistente compartido (PVC), permitiendo que el pod nuevo monte las particiones locales sin registrarse nuevamente en el clúster Kafka.",
          "Indica al Group Coordinator que ignore la desconexión y retenga los mensajes de esas particiones en un buffer temporal del broker hasta vencer `max.poll.interval.ms`.",
          "Permite al pod sucesor usurpar inmediatamente las credenciales del pod previo mediante un token efímero SASL, manteniendo abierta la conexión TCP a través del Ingress del clúster de Kubernetes."
        ],
        "a": 0,
        "e": "Con Static Membership (KIP-345), cada consumidor define un **group.instance.id** persistente (por ejemplo, el nombre del StatefulSet de Kubernetes: **consumer-pod-0**). Cuando un pod se reinicia, el coordinador no lanza un rebalanceo inmediato al perder el socket TCP; en su lugar, espera pacientemente durante **session.timeout.ms**. Si el pod vuelve a conectarse con el mismo **group.instance.id** antes de que expire dicho tiempo, retoma exactamente sus mismas particiones asignadas sin que ningún otro consumidor sufra interrupción alguna."
      },
      {
        "id": "q-33",
        "d": 3,
        "t": "Commit Manual por Partición con OffsetAndMetadata",
        "q": "Un microservicio procesa eventos complejos y desea asegurar semántica At-Least-Once estricta a nivel de registro sin esperar a terminar un lote completo de 500 mensajes devuelto por **poll()**. Si ocurre un fallo en el registro 150 de la partición 2, la aplicación desea que los offsets de los registros ya procesados en la partición 1 y en los primeros 149 de la partición 2 queden asegurados en el broker. ¿Qué técnica de la API del consumidor debe utilizarse?",
        "o": [
          "Invocar `commitSync(Map<TopicPartition, OffsetAndMetadata>)` indicando la partición y el siguiente offset (`offsetActual + 1`) tras completar cada unidad de trabajo procesada con éxito.",
          "Invocar `seek(TopicPartition, offset)` tras procesar cada mensaje para actualizar de forma síncrona el offset confirmado en el tópico interno `__consumer_offsets` del broker.",
          "Configurar `enable.auto.commit=true` con `auto.commit.interval.ms=1`, delegando en el hilo secundario la persistencia en tiempo real de cada mensaje confirmado.",
          "Llamar al método `pause()` sobre la partición activa y ejecutar `commitAsync()` sin argumentos para forzar al broker a deducir el progreso granular del consumidor."
        ],
        "a": 0,
        "e": "Para un control granular de offsets, Kafka permite invocar **commitSync(offsetsMap)** o **commitAsync(offsetsMap)** pasando un mapa que vincula cada **TopicPartition** con un objeto **OffsetAndMetadata**. Es una regla crítica recordar que el offset comprometido debe ser siempre el **siguiente offset que se espera leer** (es decir, el offset del último registro procesado con éxito + 1). De este modo, ante un fallo o rebalanceo, el consumidor retomará exactamente en el registro no procesado."
      },
      {
        "id": "q-34",
        "d": 3,
        "t": "ConsumerRebalanceListener y Gestión de Estado",
        "q": "Una aplicación utiliza un buffer en memoria para acumular agregaciones de métricas por partición antes de volcarlas a una base de datos Time-Series. Para evitar pérdida de datos o duplicados cuando se produce un rebalanceo del Consumer Group, ¿qué implementación del **ConsumerRebalanceListener** debe programarse?",
        "o": [
          "En `onPartitionsRevoked()`, volcar los datos pendientes del buffer hacia la base de datos y confirmar de forma síncrona los offsets con `commitSync()` antes de ceder las particiones.",
          "En `onPartitionsAssigned()`, purgar el buffer local y ejecutar `seekToEnd()` en las particiones recibidas para sincronizar la lectura con los datos más recientes generados en el broker.",
          "En `onPartitionsLost()`, forzar un volcado de emergencia del buffer a la base de datos y ejecutar `commitSync()` para garantizar la persistencia antes de reiniciar el cliente en el grupo.",
          "En `onPartitionsRevoked()`, transmitir el buffer en memoria al nuevo consumidor asignado mediante una llamada gRPC directa antes de completar el rebalanceo en el clúster."
        ],
        "a": 0,
        "e": "La interfaz **ConsumerRebalanceListener** expone los métodos **onPartitionsRevoked** y **onPartitionsAssigned**. El método **onPartitionsRevoked()** se invoca justo antes de que el consumidor pierda la propiedad de sus particiones asignadas. Es el momento crítico obligatorio para volcar cualquier estado o acumulador en memoria a un almacenamiento persistente y comprometer de forma síncrona (**commitSync**) los offsets procesados, asegurando que el nuevo dueño de la partición comience desde el punto exacto."
      },
      {
        "id": "q-35",
        "d": 3,
        "t": "Asignación Manual con assign() vs. subscribe()",
        "q": "Un proceso de auditoría forense debe leer periódicamente y de forma exclusiva los datos contenidos en la partición 3 del tópico **security-logs**, sin participar en el protocolo dinámico de Consumer Groups, sin registrarse en **__consumer_offsets** y sin disparar jamás rebalanceos a otras instancias. ¿Cómo debe configurarse el consumidor?",
        "o": [
          "Invocar el método `assign()` indicando manualmente el objeto `TopicPartition(\"security-logs\", 3)` en lugar de emplear el método de suscripción dinámica `subscribe()`.",
          "Invocar `subscribe()` con una expresión regular que coincida con la partición 3 y omitir la propiedad obligatoria `group.id` en la configuración de inicialización del cliente.",
          "Configurar `group.id=\"\"` (cadena vacía) y deshabilitar `enable.auto.commit`, utilizando el método ordinario `subscribe()` para recibir únicamente la partición 3.",
          "Denegar mediante ACLs los permisos de `JoinGroup` y `SyncGroup` al usuario de auditoría, forzando al broker a entregar la partición 3 en modo de lectura directa sin registrar offsets en el clúster."
        ],
        "a": 0,
        "e": "En la API de Kafka Consumer existen dos modos de suscripción mutuamente excluyentes: **subscribe()** (suscripción dinámica con Consumer Groups, balanceo automático de particiones y detección de fallos) y **assign()** (asignación estática y manual de particiones específicas). Al utilizar **assign()**, el consumidor no utiliza el Group Coordinator, no participa en rebalanceos y procesa exclusivamente las particiones indicadas de forma manual."
      },
      {
        "id": "q-36",
        "d": 3,
        "t": "Tópico Interno __consumer_offsets y Group Coordinator",
        "q": "Un ingeniero de soporte necesita diagnosticar un problema de coordinación de un Consumer Group con **group.id=\"payment-processor\"**. Para identificar exactamente cuál de los 30 brokers del clúster está actuando como el **Group Coordinator** de ese grupo, ¿qué cálculo interno realiza el protocolo de Kafka?",
        "o": [
          "Calcula `Math.abs(group.id.hashCode()) % partitions` en el tópico `__consumer_offsets`; el broker líder de dicha partición actúa formalmente como su Group Coordinator en el clúster.",
          "Consulta el quórum KRaft, el cual selecciona dinámicamente un broker disponible y registra la afinidad de ese grupo en la partición interna `@metadata` compartida del clúster.",
          "Asigna siempre de forma estática al broker con el identificador numérico más bajo (`broker.id=0`), concentrando todas las funciones de coordinación en el nodo raíz.",
          "El cliente consumidor evalúa la latencia de red contra todos los brokers y selecciona como coordinador al nodo que responda con menor tiempo en el handshake TCP."
        ],
        "a": 0,
        "e": "En Kafka, el tópico interno **__consumer_offsets** tiene por defecto **50 particiones** con política de compactación. Para determinar qué partición aloja los commits de un determinado grupo, se calcula el hash del **group.id** en módulo con el total de particiones (**abs(hashCode) % 50**). El broker líder de esa partición de **__consumer_offsets** asume automáticamente el rol de **Group Coordinator** para todos los miembros de ese grupo."
      },
      {
        "id": "q-37",
        "d": 4,
        "t": "Kafka Connect: Standalone vs. Distributed",
        "q": "Un equipo de ingeniería de datos diseña un pipeline de producción para capturar cambios (CDC con Debezium) desde 15 bases de datos PostgreSQL hacia Apache Kafka. Un ingeniero propone desplegar Kafka Connect en modo **Standalone** para simplificar la configuración inicial sin crear tópicos internos. ¿Por qué el modo Standalone es inaceptable para este entorno empresarial?",
        "o": [
          "Se ejecuta en un único proceso sin tolerancia a fallos ni escalabilidad horizontal; ante una caída, todas las tareas se detienen sin mecanismo de auto-recuperación.",
          "El modo Standalone no admite conectores de tipo Source como Debezium, quedando restringido exclusivamente a la ingesta inversa mediante conectores de tipo Sink.",
          "No admite integración con Confluent Schema Registry ni formatos binarios como Avro o Protobuf, forzando la conversión obligatoria de los eventos a texto plano sin tipar.",
          "Exige que las bases de datos externas compartan el mismo segmento de red local con el worker y prohíbe el uso de autenticación de clientes mediante protocolos SASL."
        ],
        "a": 0,
        "e": "El modo Standalone de Kafka Connect está pensado únicamente para pruebas locales y desarrollo. Se ejecuta en un proceso único, guarda los offsets y configuraciones en archivos planos locales en disco y no ofrece alta disponibilidad ni escalabilidad. En cambio, el modo **Distributed** forma un clúster de múltiples workers coordinados por el protocolo de grupos de Kafka, distribuye las tareas (Tasks) de forma balanceada y, si un worker cae, reasigna automáticamente sus tareas a los nodos supervivientes."
      },
      {
        "id": "q-38",
        "d": 4,
        "t": "Tópicos Internos de Kafka Connect",
        "q": "Al inicializar un clúster de Kafka Connect en modo distribuido, un administrador crea manualmente los tópicos internos. Por error, crea el tópico **config.storage.topic** con **3 particiones** en lugar de **1 partición**. Al arrancar los workers de Connect, el clúster falla y se niega a iniciar. ¿Por qué el tópico de configuraciones de Connect exige estrictamente tener **exactamente 1 partición**?",
        "o": [
          "Exige una única partición compactada para garantizar una vista coherente con orden lineal total y cronológico estricto de las configuraciones en todos los workers del clúster.",
          "Porque los workers de Connect utilizan internamente un consumidor no concurrente que arroja `IllegalArgumentException` si el tópico interno tiene más de un segmento físico activo.",
          "Porque el protocolo de rebalanceo de Connect exige que todas las tareas lean el log de configuración mediante `seekToBeginning()` en la partición 0 exclusivamente.",
          "Porque distribuir configuraciones en múltiples particiones deshabilitaría automáticamente la compactación de logs (`cleanup.policy=compact`) en el broker líder de cada una de las particiones."
        ],
        "a": 0,
        "e": "El tópico **config.storage.topic** almacena las configuraciones de todos los conectores y tareas del clúster de Connect con política de compactación (**cleanup.policy=compact**). Exige estrictamente **1 sola partición** para que todos los workers lean exactamente la misma secuencia ordenada de eventos de configuración. Si tuviera múltiples particiones, diferentes workers podrían observar actualizaciones de configuración en distinto orden relativo, rompiendo la coherencia distribuida del clúster."
      },
      {
        "id": "q-39",
        "d": 4,
        "t": "Single Message Transforms (SMTs)",
        "q": "Un conector Source JDBC extrae registros de una tabla de clientes que contiene una columna con datos personales sensibles denominada **credit_card_number**. La normativa de cumplimiento (PCI-DSS) prohíbe que los números de tarjeta sin enmascarar toquen los tópicos de Kafka. ¿Qué componente nativo y declarativo de Kafka Connect debe configurarse en el conector sin necesidad de programar un microservicio intermedio?",
        "o": [
          "Una Single Message Transform (SMT) con `MaskField$Value` en el conector para enmascarar o anular los dígitos sensibles antes de que el mensaje sea publicado en el broker.",
          "Un convertidor de payload configurado con cifrado AES-256 en el worker de Connect para proteger el cuerpo del registro mediante claves gestionadas dinámicamente en un KMS externo.",
          "Una regla de compatibilidad en Schema Registry que valide el esquema y descarte automáticamente cualquier registro que contenga números de tarjeta en texto plano.",
          "Un Consumer Interceptor downstream que identifique el patrón numérico de la tarjeta de crédito y enmascare los dígitos antes de entregarlo a la capa de aplicación."
        ],
        "a": 0,
        "e": "Las Single Message Transforms (SMTs) son transformaciones ligeras en memoria que se ejecutan directamente en los workers de Kafka Connect sobre cada registro individual. Para conectores Source, la transformación se aplica después de leer del sistema de origen y antes de escribir en Kafka. Utilizando la transformación estándar **MaskField$Value**, el conector enmascara el campo confidencial en vuelo, garantizando que el dato sensible jamás se persista en el commit log de Kafka."
      },
      {
        "id": "q-40",
        "d": 4,
        "t": "Dead Letter Queue (DLQ) en Sink Connectors",
        "q": "Un conector Sink de Kafka Connect transfiere eventos desde un tópico hacia un clúster de OpenSearch. De forma imprevista, una aplicación publica un mensaje con un JSON corrupto y malformado (Poison Pill). La tarea del conector falla inmediatamente y pasa a estado **FAILED**, deteniendo el consumo de la partición. ¿Cómo debe configurarse el conector para enviar automáticamente los registros inválidos a un tópico de aislamiento sin detener el flujo de datos?",
        "o": [
          "Configurar `errors.tolerance=all`, definir `errors.deadletterqueue.topic.name=opensearch-dlq` y habilitar cabeceras de contexto para registrar el motivo del error.",
          "Establecer `errors.tolerance=none` y configurar `errors.retry.timeout=-1` para forzar al conector a reintentar indefinidamente sin arrojar excepciones fatales.",
          "Configurar `errors.deadletterqueue.topic.name=opensearch-dlq` manteniendo el valor por defecto de `errors.tolerance=none` para no perder ningún registro corrupto.",
          "Cambiar el convertidor a `ByteArrayConverter` en el worker y activar `auto.offset.reset=latest` para omitir de forma automática los lotes de registros no conformes."
        ],
        "a": 0,
        "e": "Por defecto, Kafka Connect detiene las tareas ante el primer error (**errors.tolerance=none**). Al configurar **errors.tolerance=all**, el conector tolera registros defectuosos y continúa procesando el resto. Combinado con **errors.deadletterqueue.topic.name**, cualquier registro que falle en la deserialización o transformación se desvía de forma automática al tópico de DLQ indicado. Activar las cabeceras de contexto (**context.headers.enable=true**) añade metadata invaluable sobre el error, el tópico y el offset original."
      },
      {
        "id": "q-41",
        "d": 4,
        "t": "Converters vs. Transforms en Kafka Connect",
        "q": "En la arquitectura de Kafka Connect, ¿cuál es la diferencia fundamental de propósito entre un **Converter** (como **AvroConverter** o **JsonConverter**) y una **Single Message Transform (SMT)**?",
        "o": [
          "El Converter traduce entre el formato de bytes en Kafka y la Connect Data API en memoria; la SMT modifica campos, cabeceras o la estructura del registro en tránsito de forma síncrona.",
          "El Converter solo puede utilizarse en tareas Source para serializar eventos, mientras que las SMTs operan exclusivamente en tareas Sink para filtrar registros corruptos.",
          "El Converter gestiona la compresión y descompresión de red de los lotes, mientras que la SMT determina a qué broker físico se transmiten las peticiones de replicación.",
          "El Converter valida la compatibilidad de esquemas en Schema Registry, mientras que la SMT es responsable de confirmar los offsets leídos en el tópico interno de estado."
        ],
        "a": 0,
        "e": "Kafka almacena únicamente arrays de bytes planos (byte[]). El **Converter** tiene la misión exclusiva de serializar y deserializar: convierte bytes de Kafka en el modelo de objetos tipado de Kafka Connect (**ConnectRecord**) o viceversa. Por otro lado, las **SMTs** operan en memoria sobre ese **ConnectRecord** ya deserializado, permitiendo modificar campos, filtrar datos, cambiar claves o renombrar tópicos de destino de forma dinámica."
      },
      {
        "id": "q-42",
        "d": 4,
        "t": "Kafka Streams: KStream vs. KTable",
        "q": "Una plataforma de comercio electrónico construye un sistema analítico con la librería Kafka Streams. Tienen dos fuentes de datos: una cola ininterrumpida de clics de usuarios en la web (cada clic es un evento independiente) y un flujo de actualizaciones de perfiles de usuario (donde cada mensaje representa la dirección y país actualizados de un usuario identificado por su ID). ¿Qué abstracción de Kafka Streams debe utilizarse para modelar cada caso?",
        "o": [
          "Los clics se modelan como un `KStream` (flujo de hechos independientes); las actualizaciones de perfil como una `KTable` (vista del estado más reciente por clave).",
          "Los clics se modelan como una `KTable` con retención por tiempo; las actualizaciones de perfil como un `GlobalKTable` sin clave para optimizar el consumo de memoria local.",
          "Ambas fuentes deben modelarse obligatoriamente como `KStream`, delegando en una llamada a `transformValues()` la actualización manual del estado en memoria.",
          "Los clics se modelan como un `SessionWindow` de 1 minuto y los perfiles como un `TimeWindows` de 24 horas, ya que Kafka Streams no soporta tablas sin ventana en topologías de agregación."
        ],
        "a": 0,
        "e": "La dualidad Stream-Table es el núcleo conceptual de Kafka Streams. Un **KStream** representa un flujo inmutable de inserciones (hechos o eventos históricos como clics, transacciones o lecturas de sensores), donde cada registro se añade sin sobreescribir los anteriores. Una **KTable** representa un changelog o tabla materializada: cada registro es un UPSERT sobre la clave primaria, donde un nuevo valor reemplaza al anterior (y un valor nulo representa un DELETE)."
      },
      {
        "id": "q-43",
        "d": 4,
        "t": "Requisito de Co-partitioning en Joins de Kafka Streams",
        "q": "Una aplicación de Kafka Streams realiza un join interno entre un KStream (**orders**) y una KTable (**customers**). Ambos flujos utilizan el **customer_id** como clave y el mismo serializador. Sin embargo, el tópico **orders** tiene **12 particiones** y el tópico **customers** tiene **4 particiones**. Al iniciar la topología, ¿qué problema ocurrirá y cuál es la solución técnica requerida?",
        "o": [
          "Falta de co-particionado (co-partitioning), lo que causa una `TopologyException`; la solución es recrear o re-particionar ambos tópicos con el mismo número de particiones.",
          "Kafka Streams multiplexará en memoria las 4 particiones de la tabla sobre las 12 particiones del stream de pedidos sin requerir cambios de infraestructura física ni re-particionado.",
          "El join fallará con `SerializationException` al diferir la época del log de metadatos, requiriendo activar `auto.offset.reset=earliest` en la configuración de Streams.",
          "El clúster reducirá automáticamente las particiones de orders a 4 mediante rebalanceo del grupo de streams para igualar la cardinalidad de la tabla de clientes."
        ],
        "a": 0,
        "e": "Para que un join entre streams y tables funcione correctamente de forma local y paralela en Kafka Streams, ambos tópicos deben estar **co-particionados**: deben tener estrictamente el **mismo número de particiones** y la **misma función de particionamiento por clave**. Si tienen diferente número de particiones (12 frente a 4), los registros con la misma clave terminarán en tareas de procesamiento asignadas a diferentes instancias físicas, impidiendo que el join encuentre las coincidencias locales."
      },
      {
        "id": "q-44",
        "d": 4,
        "t": "GlobalKTable y Joins sin Co-partitioning",
        "q": "Necesitas enriquecer un KStream masivo de transacciones bancarias (50 particiones) con una tabla de referencia pequeña de códigos postales y sucursales (5 particiones). Deseas evitar el coste y la complejidad de re-particionar el stream masivo de transacciones. ¿Qué abstracción de Kafka Streams permite realizar este join directamente sin requerir que ambos tópicos estén co-particionados?",
        "o": [
          "Modelar la tabla de referencia como una `GlobalKTable`, la cual replica todas sus particiones en cada instancia local de la aplicación permitiendo joins sin co-particionado.",
          "Modelar la tabla como un `KTable` estándar habilitando el parámetro `streams.join.broadcast=true` en la configuración de la topología para omitir el requisito de co-particionado.",
          "Agrupar el stream mediante `repartition(Repartitioner.with(...))` delegando en RocksDB la distribución dinámica de las claves secundarias en tiempo de ejecución.",
          "Utilizar una ventana deslizante (`SlidingWindows`) sobre el `KStream` para almacenar los códigos postales en un búfer circular en memoria compartida por los hilos."
        ],
        "a": 0,
        "e": "Una **GlobalKTable** lee y almacena **la totalidad de las particiones** del tópico de referencia en el State Store local de **todas las instancias** de la aplicación. Gracias a esto, cualquier tarea que procese un registro del KStream puede buscar información en la GlobalKTable de forma local e instantánea, sin importar cómo esté particionado el stream de entrada y sin exigir co-particionado. El trade-off es que el dataset de la GlobalKTable debe ser lo suficientemente pequeño para caber en el disco de cada nodo."
      },
      {
        "id": "q-45",
        "d": 4,
        "t": "State Stores de RocksDB y Changelog Topics",
        "q": "Una topología de Kafka Streams calcula una ventana de agregación con estado (Stateful Processing). El equipo necesita garantizar alta resiliencia y un tiempo de recuperación mínimo (RTO) ante la caída de una de las instancias de la aplicación en producción. ¿Cómo persiste Kafka Streams el estado local y qué configuración acelera drásticamente el failover?",
        "o": [
          "Persiste localmente en `RocksDB` respaldado por un `changelog topic` compactado en Kafka; configurar `num.standby.replicas ≥ 1` mantiene réplicas en caliente listas para failover.",
          "Almacena el estado en la memoria Heap de Java con checkpoints periódicos a un bucket S3; configurar `state.cleanup.delay.ms=0` fuerza la reconstrucción instantánea del State Store.",
          "Escribe cada actualización de estado directamente en una base de datos externa como Cassandra, configurando `processing.guarantee=exactly_once_v2` para la sincronización.",
          "Utiliza tablas volátiles en memoria con `state.store.type=in_memory`, configurando `replication.factor=3` en el broker para transferir el estado por Zero-Copy al fallar."
        ],
        "a": 0,
        "e": "Kafka Streams utiliza por defecto **RocksDB** como almacenamiento local persistente off-heap para sus State Stores. Para tolerar fallos, cada mutación de estado se envía en paralelo a un **Changelog Topic interno** en Kafka con política de compactación. Si una instancia cae, otra instancia puede reconstruir el estado leyendo este changelog. Para lograr failover casi instantáneo (RTO de segundos), se configura **num.standby.replicas**, lo que hace que réplicas standby mantengan su RocksDB local sincronizado en caliente."
      },
      {
        "id": "q-46",
        "d": 4,
        "t": "Ventanas Temporales: Tumbling vs. Hopping vs. Sliding",
        "q": "Un sistema de monitorización industrial debe calcular el consumo energético promedio de una fábrica **cada 15 minutos en bloques independientes y no solapados** (ej. de 08:00 a 08:15, de 08:15 a 08:30). Ningún evento debe pertenecer a más de una ventana temporal. ¿Qué tipo de ventana de Kafka Streams debe seleccionarse?",
        "o": [
          "Una ventana temporal fija contigua sin solapamiento (`Tumbling Window`) de 15 minutos definida mediante `TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(15))`. ",
          "Una ventana temporal con solapamiento periódico (`Hopping Window`) de 15 minutos de duración con un intervalo de avance o salto configurado en 1 minuto continuo.",
          "Una ventana basada en periodos variables de inactividad (`Session Window`) configurando un intervalo de corte o gap de inactividad de 15 minutos exactos.",
          "Una ventana deslizante continua (`Sliding Window`) calculada en base a la distancia temporal máxima de 15 minutos entre registros consecutivos en el log."
        ],
        "a": 0,
        "e": "Las **Tumbling Windows** son ventanas de tiempo de tamaño fijo, contiguas y que **no se solapan** jamás. Cada registro individual pertenece a una única ventana en función de su marca de tiempo (timestamp). Por el contrario, las Hopping Windows se solapan periódicamente según su intervalo de avance, y las Session Windows dependen de periodos variables de inactividad de los usuarios."
      },
      {
        "id": "q-47",
        "d": 4,
        "t": "ksqlDB: Push Queries vs. Pull Queries",
        "q": "Un equipo de desarrollo implementa una solución de monitorización de fraude con **ksqlDB**. En un dashboard web en tiempo real necesitan mostrar alertas instantáneas a medida que ocurren nuevas transacciones sospechosas, mientras que en un servicio de atención telefónica necesitan consultar el saldo actual de un usuario bajo demanda cuando el cliente llama. ¿Qué tipo de consultas ksqlDB corresponden a cada necesidad?",
        "o": [
          "El dashboard requiere una `Push Query` (con `EMIT CHANGES` para emitir eventos continuos); el servicio telefónico requiere una `Pull Query` (consulta puntual síncrona a la tabla).",
          "El dashboard requiere una `Pull Query` con polling HTTP cada segundo sobre la tabla; el servicio telefónico requiere una `Push Query` con suscripción persistente en websocket.",
          "Ambas necesidades deben resolverse exclusivamente mediante `Pull Queries` síncronas contra la KTable materializada para evitar saturación de memoria en el servidor ksqlDB.",
          "Ambas necesidades deben resolverse mediante `Push Queries` continuas en streaming, delegando en el frontend telefónico el filtrado del saldo del cliente en memoria local."
        ],
        "a": 0,
        "e": "ksqlDB define dos paradigmas de consulta: las **Push Queries** (definidas con la cláusula **EMIT CHANGES**) son suscripciones reactivas de streaming que se mantienen permanentemente abiertas, enviando cada nuevo evento a medida que llega; son ideales para dashboards en tiempo real y alertas. Las **Pull Queries** funcionan como las consultas SQL tradicionales: son puntuales, síncronas y leen el estado actual materializado en una tabla de ksqlDB para una clave dada."
      },
      {
        "id": "q-48",
        "d": 4,
        "t": "ksqlDB: Definición de Claves y Agregaciones",
        "q": "Al crear un STREAM en ksqlDB a partir de un tópico de Kafka existente utilizando la sentencia **CREATE STREAM orders_stream (...) WITH (KAFKA_TOPIC='orders', VALUE_FORMAT='AVRO');**, ¿por qué es fundamental definir explícitamente la propiedad **KEY = 'order_id'** si se planea ejecutar posteriormente una cláusula **GROUP BY order_id** o realizar joins con otras tablas?",
        "o": [
          "Para indicar que el tópico ya está particionado por ese campo en Kafka, evitando generar un paso intermedio de re-particionado por red al hacer joins o agrupaciones en la topología.",
          "Porque ksqlDB rechaza sentencias `CREATE STREAM` si no se define una clave primaria explícita que coincida con el nombre del schema en Confluent Schema Registry corporativo.",
          "Porque de no definir la clave, ksqlDB trunca los registros en el broker y sobreescribe el payload del tópico original durante la primera ejecución de la consulta.",
          "Porque los formatos de serialización binaria como Avro exigen que la clave y el valor compartan el mismo Subject en Schema Registry para autorizar agrupaciones."
        ],
        "a": 0,
        "e": "En ksqlDB y Kafka Streams, las operaciones de agregación (**GROUP BY**) y los joins requieren que los mensajes estén particionados por la clave correspondiente. Al especificar **KEY = 'campo'**, ksqlDB reconoce que el tópico ya está particionado por esa clave en Kafka. Si no se define o si se agrupa por un campo distinto a la clave actual, ksqlDB se verá forzado a generar internamente un tópico intermedio de re-particionado (**repartition topic**), duplicando el tráfico de red y el uso de almacenamiento."
      },
      {
        "id": "q-49",
        "d": 5,
        "t": "Autenticación: mTLS vs. SASL/SCRAM",
        "q": "Un banco digital debe autenticar a miles de microservicios clientes y usuarios administradores contra su clúster de Kafka. Para las aplicaciones que residen en nubes públicas prefieren gestión de credenciales con rotación dinámica de contraseñas almacenadas de forma nativa en Kafka sin depender de certificados emitidos para cada cliente. ¿Qué mecanismo de autenticación de Kafka cumple con este requerimiento?",
        "o": [
          "`SASL/SCRAM` (SCRAM-SHA-256 o SCRAM-SHA-512), que almacena hashes salados en metadatos de Kafka y permite crear y rotar credenciales en caliente con `kafka-configs.sh`.",
          "`mTLS` (Mutual TLS), ya que gestiona los pares de claves públicas directamente en los metadatos del quórum KRaft sin requerir renovación periódica de certificados de cliente.",
          "`SASL/PLAIN` sobre un canal no cifrado, ya que almacena las contraseñas en memoria de los brokers y delega la rotación en el comando administrativo `kafka-acls.sh`.",
          "`Kerberos (SASL/GSSAPI)`, porque almacena los tickets de usuario de forma descentralizada en el almacenamiento local de cada broker evitando servidores externos como Active Directory o KDC."
        ],
        "a": 0,
        "e": "**SASL/SCRAM** (Salted Challenge Response Authentication Mechanism) es el estándar nativo para autenticación segura basada en credenciales en Kafka. Permite definir usuarios y contraseñas salteadas/hasheadas (SHA-256 / SHA-512) que se almacenan directamente en los metadatos de Kafka. Permite crear, modificar y revocar usuarios en tiempo de ejecución sin reiniciar brokers (**kafka-configs.sh**), evitando la complejidad de gestionar PKI y certificados X.509 individuales para cada cliente."
      },
      {
        "id": "q-50",
        "d": 5,
        "t": "Configuración de Keystore y Truststore en mTLS",
        "q": "Al configurar la autenticación mutua TLS (**mTLS**) en un cliente de Kafka en Java, el desarrollador especifica dos almacenes de certificados: **ssl.keystore.location** y **ssl.truststore.location**. ¿Cuál es la función técnica exacta de cada uno de estos almacenes?",
        "o": [
          "El `Keystore` contiene la clave privada y el certificado del cliente para autenticarse ante el broker; el `Truststore` contiene los certificados CA para validar al broker.",
          "El `Keystore` contiene los certificados públicos de los brokers del clúster; el `Truststore` almacena las credenciales SASL y las listas de control de acceso (ACLs) del sistema.",
          "El `Truststore` cifra los registros en el almacenamiento en disco del broker; el `Keystore` se encarga de descifrar el tráfico de red en los sockets de los clientes.",
          "Ambos archivos contienen exactamente la misma estructura de certificados X.509 y pueden apuntar al mismo archivo sin comprometer la seguridad de las claves privadas."
        ],
        "a": 0,
        "e": "En la infraestructura de clave pública (PKI) utilizada por Java y Kafka para mTLS: el **Keystore** aloja la identidad propia del cliente (su clave privada secreta y el certificado público correspondiente firmado por una CA). El **Truststore** almacena exclusivamente los certificados públicos de las CAs en las que el cliente confía. Cuando el broker le entrega su certificado TLS durante el handshake, el cliente usa el Truststore para validar la firma de la CA del broker."
      },
      {
        "id": "q-51",
        "d": 5,
        "t": "Autorización con ACLs y Principio de Menor Privilegio",
        "q": "Un nuevo microservicio productor (**Principal: User:order-service**) debe publicar mensajes de forma transaccional (utilizando transacciones EOS y **transactional.id=\"tx-order-01\"**) en el tópico **orders**. ¿Cuáles son los permisos mínimos indispensables que un administrador debe otorgar mediante **kafka-acls.sh** siguiendo el principio de menor privilegio?",
        "o": [
          "Permisos de operación `Write` y `Describe` sobre el recurso `Topic:orders`, junto con permisos de `Write` y `Describe` sobre el recurso `TransactionalId:tx-order-01` en el clúster.",
          "Permisos de operación `All` sobre el recurso `Cluster`, acompañados de permisos de operación `Read` y `Write` sobre el recurso `Topic:orders` en las particiones de datos del clúster.",
          "Permisos de operación `Write` exclusivamente sobre el recurso `Cluster`, ya que los privilegios sobre tópicos y transacciones se heredan automáticamente en el broker para productores.",
          "Permisos de operación `Read` y `Write` sobre el tópico interno `__transaction_state`, complementados con permisos de operación `Describe` sobre el recurso `Topic:orders`."
        ],
        "a": 0,
        "e": "Para que un productor transaccional pueda operar bajo el principio de menor privilegio, requiere permisos de **Write** y **Describe** sobre el tópico de datos (**Topic:orders**) para enviar mensajes y consultar sus metadatos de partición. Adicionalmente, al usar transacciones, el Transaction Coordinator valida que el Principal tenga permisos de **Write** y **Describe** sobre el recurso **TransactionalId** configurado (**tx-order-01**). Nunca se deben conceder permisos directos a clientes sobre los tópicos internos como **__transaction_state**."
      },
      {
        "id": "q-52",
        "d": 5,
        "t": "Precedencia de Deny y allow.everyone.if.no.acl.found",
        "q": "En un clúster con ACLs habilitadas y **allow.everyone.if.no.acl.found=false**, el administrador configura las siguientes dos reglas para el usuario **User:analyst** sobre el tópico **reports**:\n1. ALLOW Operation Read from Host 192.168.1.50\n2. DENY Operation Read from Host *\nEl usuario intenta leer del tópico desde la máquina con IP 192.168.1.50. ¿Qué resultado obtendrá y por qué?",
        "o": [
          "El acceso será denegado con `TopicAuthorizationException`, ya que en las políticas de seguridad de Kafka las reglas `DENY` tienen precedencia estricta sobre cualquier `ALLOW`.",
          "El acceso será concedido con éxito debido a que la regla `ALLOW` define una dirección IP de host más específica que el comodín genérico (`*`) presente en la regla `DENY` evaluada.",
          "El acceso será permitido porque las reglas de autorización se evalúan en orden cronológico de inserción y la regla 1 fue registrada con anterioridad en los metadatos.",
          "La conexión TCP quedará suspendida en el broker hasta que un administrador elimine la ambigüedad en las reglas mediante la herramienta de línea de comandos `kafka-acls.sh` ejecutada en el quórum."
        ],
        "a": 0,
        "e": "El algoritmo de evaluación de ACLs en Apache Kafka sigue una jerarquía estricta: si existe **cualquier regla explícita de DENY** que coincida con el usuario, host y operación, **el acceso es bloqueado de inmediato** (Deny Precedence), sin importar que existan reglas de ALLOW específicas. Si no hay un DENY coincidente, se evalúan las reglas de ALLOW. Si no coincide ninguna regla de ALLOW y **allow.everyone.if.no.acl.found=false**, el acceso se deniega por defecto."
      },
      {
        "id": "q-53",
        "d": 5,
        "t": "Mecánica de Log Compaction: Head vs. Tail",
        "q": "Un tópico de configuraciones globales tiene configurada la política de limpieza **cleanup.policy=compact**. ¿Cómo opera internamente el proceso de compactación de logs (**Log Cleaner**) en el broker y cuál es el tratamiento del segmento de log activo?",
        "o": [
          "Evalúa los segmentos cerrados purgando registros antiguos con claves repetidas mediante un mapa de offsets en memoria; el segmento activo se mantiene intacto sin compactar para no degradar I/O.",
          "Compacta en tiempo real tanto los segmentos cerrados como el segmento activo de escritura a medida que cada mensaje individual es persistido en el buffer del PageCache del kernel.",
          "Detiene periódicamente las escrituras de los productores para fusionar todos los segmentos de la partición en un único archivo comprimido en caliente mediante zstandard.",
          "Requiere deshabilitar el tráfico y ejecutar una tarea administrativa offline mediante `kafka-log-dirs.sh` para reconstruir los índices de clave en el directorio local."
        ],
        "a": 0,
        "e": "Durante la compactación de logs, la partición se divide lógicamente en el **Tail** (segmentos cerrados donde ya se purgaron versiones previas de claves) y el **Head** (segmentos cerrados con registros nuevos aún no procesados por el limpiador). Los hilos de Log Cleaner construyen una tabla de hash en memoria (SkimpyOffsetMap) con las últimas claves del Head y reescriben los segmentos del Tail eliminando registros obsoletos. Es una regla universal que **el segmento activo nunca se compacta** para no interferir con las escrituras en curso."
      },
      {
        "id": "q-54",
        "d": 5,
        "t": "Tombstones y delete.retention.ms",
        "q": "En una tabla de usuarios respaldada por un tópico compactado (**cleanup.policy=compact**), un servicio elimina un usuario publicando un registro con la clave **user-884** y el **payload=null** (un registro de eliminación denominado **Tombstone**). ¿Por qué Kafka no elimina físicamente este registro de inmediato durante la siguiente ronda de compactación y espera el tiempo configurado en **delete.retention.ms** (por defecto 24 horas)?",
        "o": [
          "Para garantizar que los consumidores más lentos o temporalmente fuera de línea lean el Tombstone y propaguen la eliminación en sus sistemas locales antes de ser purgado.",
          "Porque los sistemas de archivos Linux bloquean el truncado físico de bloques de disco que contengan valores nulos hasta ejecutar una verificación síncrona con `fsck` en el servidor.",
          "Porque el quórum KRaft requiere 24 horas para propagar la anulación de la clave entre los controladores de metadatos antes de confirmar el borrado físico del bloque.",
          "Porque el broker líder intenta recuperar el payload original comunicándose con los productores registrados por si el borrado de la clave fue una acción accidental durante el mantenimiento."
        ],
        "a": 0,
        "e": "Un Tombstone es un marcador explícito que indica a los consumidores que la clave ha sido eliminada. Si Kafka eliminara el Tombstone inmediatamente durante una ronda de compactación antes de que un consumidor rezagado o caído alcance ese offset, dicho consumidor nunca se enteraría de la eliminación y conservaría el registro antiguo en su base de datos para siempre. El parámetro **delete.retention.ms** garantiza una ventana de tiempo suficiente para que todos los consumidores downstream procesen el borrado."
      },
      {
        "id": "q-55",
        "d": 5,
        "t": "Métrica JMX: UnderReplicatedPartitions",
        "q": "Durante una guardia de soporte en producción, una alerta de Prometheus notifica que la métrica de JMX **kafka.server:type=ReplicaManager,name=UnderReplicatedPartitions** ha aumentado de 0 a **18** en el clúster. ¿Cuál es el significado técnico de esta alerta y cuáles son sus causas operativas más habituales?",
        "o": [
          "Indica 18 particiones con réplicas fuera del ISR debido a retraso frente al líder; ocurre típicamente por caídas de brokers, saturación de ancho de banda o I/O en discos.",
          "Indica que 18 particiones fueron eliminadas del sistema de archivos local del broker y requieren restauración manual desde copias de seguridad en almacenamiento de objetos.",
          "Indica que 18 consumidores del grupo excedieron el valor de `max.poll.interval.ms`, provocando que el broker marque sus particiones asignadas como sub-replicadas.",
          "Indica que 18 productores están publicando lotes con `acks=0` a una tasa superior al ancho de banda del socket de red, descartando mensajes en el RecordAccumulator."
        ],
        "a": 0,
        "e": "**UnderReplicatedPartitions** es la métrica de salud más crítica de un clúster de Kafka. Un valor mayor que 0 indica que para una o más particiones, el número de réplicas en el ISR actual es inferior al **replication.factor** configurado. Esto ocurre comúnmente cuando un broker se apaga, pierde conectividad de red, sufre pausas masivas de Garbage Collection o experimenta cuellos de botella de I/O en disco que le impiden seguir el ritmo del líder."
      },
      {
        "id": "q-56",
        "d": 5,
        "t": "Métrica JMX: ActiveControllerCount",
        "q": "En un panel de observabilidad de un clúster de Apache Kafka, un ingeniero de SRE revisa la métrica **kafka.controller:type=KafkaController,name=ActiveControllerCount**. ¿Cuál es el único valor saludable que debe exhibir esta métrica a nivel global en el clúster, y qué indican valores anómalos de 0 o mayores a 1?",
        "o": [
          "Debe ser exactamente 1 a nivel global; un valor de 0 indica ausencia de controlador activo bloqueando metadatos, mientras que un valor > 1 señala una condición de Split-Brain.",
          "Debe igualar el número total de brokers en el clúster para asegurar que todos los nodos participen activamente como controladores en un esquema de metadatos multimaestro del quórum.",
          "Debe permanecer en 0 de manera continua durante operación normal, elevándose a 1 solo de forma transitoria cuando se ejecuta una reelección planificada de particiones.",
          "Debe coincidir estrictamente con el número de réplicas del tópico interno `@metadata` (típicamente 3 o 5) para reflejar la totalidad de miembros votantes del quórum de controladores de KRaft."
        ],
        "a": 0,
        "e": "En todo clúster de Apache Kafka, debe existir en todo momento **exactamente un único controlador activo** (**ActiveControllerCount = 1** agregado en todo el clúster; cada broker reporta 0, excepto el líder que reporta 1). Si la suma da 0, significa que no hay controlador elegido (los metadatos están congelados). Si da mayor que 1 en entornos ZooKeeper heredados, denota un estado de Split-Brain donde dos brokers creen ser el controlador simultáneamente, amenazando la integridad del clúster."
      },
      {
        "id": "q-57",
        "d": 5,
        "t": "Métrica JMX: RequestHandlerAvgIdlePercent",
        "q": "El dashboard de Grafana de un broker muestra que la métrica **kafka.server:type=KafkaRequestHandlerPool,name=RequestHandlerAvgIdlePercent** ha caído sostenidamente al **0.06** (6 % de tiempo ocioso). Al mismo tiempo, los productores reportan incrementos masivos en la latencia de confirmación. ¿Qué diagnóstico técnico representa esta métrica?",
        "o": [
          "Los hilos de procesamiento de peticiones (`num.io.threads`) están saturados al 94 % de su capacidad en I/O o cálculo, dejando al broker al borde del colapso operativo.",
          "El broker detecta una carga inferior al 6 % y suspende temporalmente los hilos de red (`num.network.threads`) para reducir el uso de CPU en el nodo del centro de datos.",
          "Los clientes consumidores están sufriendo fallos de autenticación SASL en el 94 % de las conexiones entrantes, saturando la cola de sockets de red del broker del clúster.",
          "El recolector de basura (Garbage Collector) de la JVM está reteniendo el 94 % del heap disponible, provocando pausas Stop-The-World continuas en los hilos de la aplicación."
        ],
        "a": 0,
        "e": "**RequestHandlerAvgIdlePercent** mide el porcentaje promedio de tiempo que los hilos de atención de peticiones (configurados con **num.io.threads**) permanecen ociosos esperando trabajo. Un valor saludable se sitúa por encima del 30 % - 40 % (0.3 - 0.4). Una caída al 6 % (0.06) significa que los hilos pasan el 94 % del tiempo ocupados, lo que indica saturación crítica de disco o CPU en el broker, provocando que las peticiones entrantes se encolen en la cola de red y disparando la latencia."
      },
      {
        "id": "q-58",
        "d": 5,
        "t": "Tiered Storage en Confluent Platform (KIP-405)",
        "q": "Una multinacional retiene datos de eventos financieros durante 5 años por motivos regulatorios. Tradicionalmente, esto requería añadir continuamente discos SSD/NVMe a los brokers, encareciendo los costos y provocando que la reasignación de particiones durara semanas. ¿Cómo resuelve **Tiered Storage** (Almacenamiento por Niveles) este cuello de botella arquitectónico?",
        "o": [
          "Mueve los segmentos cerrados antiguos a almacenamiento de objetos económico (S3/GCS) y conserva solo datos calientes en disco local; la reasignación solo transfiere datos locales calientes.",
          "Aplica deduplicación en memoria RAM y comprime segmentos históricos en volúmenes EBS fríos, transfiriendo los bloques en segundo plano mediante `kafka-reassign-partitions.sh` en red.",
          "Convierte los segmentos antiguos en tablas Iceberg en almacenamiento de objetos, delegando las lecturas históricas de los consumidores en un motor de consulta Presto externo.",
          "Archiva los logs históricos en un clúster secundario mediante MirrorMaker 2 en modo asíncrono, eliminando las particiones locales una vez replicadas en el data lake corporativo."
        ],
        "a": 0,
        "e": "Tiered Storage (KIP-405) desacopla el cómputo del almacenamiento en Kafka. Los datos recientes (\"calientes\") se retienen en almacenamiento local NVMe/SSD en el broker para lecturas en tiempo real de bajísima latencia. Los segmentos cerrados se envían de forma asíncrona a almacenamiento en la nube de objetos (S3, GCS), ofreciendo retención prácticamente infinita a bajo coste. Además, cuando una partición se migra de broker, solo se copian los pocos datos locales calientes, haciendo los rebalanceos casi instantáneos."
      },
      {
        "id": "q-59",
        "d": 5,
        "t": "Dimensionamiento del Heap de JVM y Linux PageCache",
        "q": "Un ingeniero junior propone configurar el Heap de la JVM de un broker de Kafka en **60 GB** en un servidor que cuenta con 64 GB de RAM física, argumentando que \"más memoria para Java siempre mejora el rendimiento\". ¿Por qué un arquitecto senior de Kafka rechaza enfáticamente esta propuesta?",
        "o": [
          "Kafka delega el almacenamiento en el `PageCache` de Linux para ejecutar Zero-Copy; un heap de 60 GB priva de RAM al kernel y provoca pausas masivas de Garbage Collection en la JVM.",
          "Porque la JVM en sistemas de 64 bits deshabilita la compresión de punteros (Compressed OOPs) por encima de 32 GB, lo que penaliza la memoria y bloquea la asignación de buffers off-heap.",
          "Porque la arquitectura de Kafka almacena todos los archivos de índices dispersos en el espacio de intercambio Swap de Linux, requiriendo dejar libre al menos el 80 % de la RAM física.",
          "Porque el protocolo de KRaft exige normativamente que el tamaño del heap en cada broker sea estrictamente proporcional al número de hilos de procesamiento (`num.network.threads`)."
        ],
        "a": 0,
        "e": "A diferencia de otros sistemas de datos en Java, Apache Kafka fue diseñado para no almacenar datos de mensajes en el heap de la JVM. Un heap modesto (típicamente de 6 a 10 GB) es más que suficiente para los objetos internos del broker, evitando pausas de Stop-The-World de Garbage Collection. Toda la memoria RAM restante del servidor debe dejarse libre para que el kernel de Linux la utilice automáticamente como **PageCache**, lo que permite atender peticiones de fetch de los consumidores a velocidad de RAM sin lecturas a disco físico."
      },
      {
        "id": "q-60",
        "d": 5,
        "t": "Integración de Seguridad con SASL/OAUTHBEARER",
        "q": "Una empresa adopta una arquitectura Zero-Trust y decide integrar la autenticación de todos sus clientes de Kafka con su proveedor de identidad corporativo (Okta / Azure AD / Keycloak) utilizando tokens JWT. ¿Qué protocolo nativo de Kafka se utiliza y cómo se garantiza que los clientes con tokens expirados sean desconectados?",
        "o": [
          "Se utiliza `SASL/OAUTHBEARER`; el broker valida la firma JWT del IdP mediante claves JWKS y monitoriza el atributo de expiración `exp` para forzar la re-autenticación del cliente.",
          "Se utiliza `SASL/SCRAM` federado; el broker consulta en tiempo real el endpoint Introspect de Okta mediante webhooks y revoca la sesión TCP en el instante en que caduca el token.",
          "Se utiliza `SASL/GSSAPI` con un módulo PAM personalizado que traduce tokens JWT a tickets Kerberos, delegando en el demonio del sistema operativo el cierre de los sockets inactivos.",
          "Se configuran ACLs dinámicas con el prefijo Bearer en `kafka-acls.sh`, delegando la validación de la vigencia del token en un conector interceptor de Confluent Schema Registry."
        ],
        "a": 0,
        "e": "**SASL/OAUTHBEARER** es el estándar de Kafka para federación de identidades mediante OAuth 2.0 y OpenID Connect. El cliente solicita un token firmado (JWT) a su Authorization Server / IdP y se autentica contra el broker presentando dicho token. El broker valida el token contra el endpoint JWKS del IdP. Además, el broker rastrea el tiempo de expiración (**exp**) del JWT: al vencer el token, Kafka exige una re-autenticación automática o desconecta al cliente si este no renueva su credencial."
      }
    ],
    why: {
      "q-1": [
        null,
        "Mezclar roles (`broker,controller`) en 100 nodos degrada el consenso Raft por contención de I/O y pausas de GC debidas al tráfico masivo de datos de los brokers.",
        "Un único controlador introduce un punto único de fallo (SPOF); si cae, el clúster queda incapaz de coordinar particiones o atender cambios de metadatos.",
        "Los quórums Raft requieren un número impar de nodos (3 o 5); un número par como 4 no incrementa la tolerancia a fallos frente a 3 y dificulta resolver empates."
      ],
      "q-2": [
        null,
        "`isolation.level=read_uncommitted` solo permite leer registros de transacciones no abortadas que ya alcanzaron el High Watermark; nunca permite leer por encima del HW hasta el LEO.",
        "La configuración de `acks` del productor no altera la regla del consumidor: ningún mensaje es visible antes de ser replicado en el ISR hasta el High Watermark.",
        "Los consumidores leen del líder por defecto y el parámetro `min.insync.replicas` aplica a escrituras del productor con `acks=all`, no redirige lecturas obligatoriamente a followers."
      ],
      "q-3": [
        null,
        "El líder solo rechaza escrituras con `NotEnoughReplicasException` si el tamaño del ISR cae por debajo de `min.insync.replicas`; de lo contrario sigue aceptando tráfico.",
        "Una partición solo queda `Offline` si cae su broker líder y no hay réplicas elegibles para sucederlo, no por la expulsión de un follower del ISR.",
        "El líder no cede voluntariamente su rol a un nodo que no responde; la reelección de líder solo ocurre ante la caída del propio líder."
      ],
      "q-4": [
        null,
        "Los consumidores no se bloquean con `NotEnoughReplicasException`; esta excepción solo afecta a las escrituras con `acks=all` cuando el ISR es menor que `min.insync.replicas`.",
        "Kafka jamás degrada silenciosamente `acks=all` a `acks=1` para evitar violar las garantías de durabilidad contratadas por el productor.",
        "`NotEnoughReplicasException` se devuelve inmediatamente al productor al intentar escribir, y los consumidores pueden seguir consumiendo hasta el High Watermark sin errores de offset."
      ],
      "q-5": [
        null,
        "Con `unclean.leader.election.enable=false`, el controlador tiene estrictamente prohibido elegir réplicas fuera del ISR para evitar pérdida silenciosa de datos.",
        "Kafka no puede reasignar datos inexistentes a otro broker ni solicitar al productor retransmitir datos arbitrarios ya confirmados por un líder caído.",
        "Una partición sin réplicas disponibles en el ISR entra en estado `Offline` total; no queda en modo solo lectura en réplicas fuera del ISR."
      ],
      "q-6": [
        null,
        "Kafka no desvía automáticamente registros faltantes a un tópico de Dead Letter Queue ante una elección sucia; los datos simplemente se pierden.",
        "El nuevo líder acepta lecturas y escrituras de inmediato; no entra en modo de solo lectura ni espera una reconciliación manual.",
        "Los consumidores no reciben `OffsetOutOfRangeException` por la elección; continuarán leyendo desde el nuevo High Watermark sin detectar la omisión de los offsets perdidos."
      ],
      "q-7": [
        null,
        "El archivo `.timeindex` mapea marcas de tiempo con offsets lógicos para búsquedas temporales, no para resolver peticiones directas de lectura por offset.",
        "El archivo `leader-epoch-checkpoint` mapea épocas de líder con sus offsets de inicio para reconciliación entre réplicas, no para indexar registros individuales.",
        "Kafka no utiliza filtros de Bloom para búsquedas por offset en disco; se apoya directamente en el archivo de índice disperso `.index` y búsqueda binaria."
      ],
      "q-8": [
        null,
        "`retention.check.interval.ms` solo define la frecuencia periódica del hilo evaluador (por defecto 5 minutos); no posterga el borrado en función del tamaño del log.",
        "La retención de Kafka es independiente del progreso de los consumidores; no espera a que los offsets sean confirmados en `__consumer_offsets` para purgar segmentos inactivos.",
        "`segment.ms` determina cuándo se rota un segmento activo por tiempo, no actúa como período de gracia ni bloquea la purga de segmentos ya cerrados."
      ],
      "q-9": [
        null,
        "Raft utiliza una mayoría simple (más del 50 % de los votos del quórum: 3 de 5), no una supermayoría de dos tercios.",
        "Un quórum de 5 nodos con 2 nodos vivos no puede procesar metadatos porque 2 no constituye mayoría estricta frente al quórum total de 5.",
        "El quórum Raft está diseñado específicamente para tolerar caídas de minorías; con 5 nodos tolera hasta 2 caídas sin detener las operaciones de metadatos."
      ],
      "q-10": [
        null,
        "`RackAwareReplicaSelector` permite a los consumidores leer de la réplica más cercana (Follower Fetching), pero no controla cómo se asignan las réplicas a los brokers.",
        "`advertised.listeners` gestiona la conectividad y resolución de red para los clientes, y el parámetro `zookeeper.rack.enable` no existe en Apache Kafka.",
        "`min.insync.replicas` fija el número mínimo de réplicas que deben confirmar escrituras con `acks=all`, pero no influye en la colocación física de las particiones."
      ],
      "q-11": [
        null,
        "Kafka no permite que dos miembros de un mismo Consumer Group lean en paralelo de la misma partición; cada partición se asigna a lo sumo a un consumidor.",
        "Tener más consumidores que particiones es válido; los consumidores adicionales simplemente permanecen en estado inactivo (idle) como reserva.",
        "Los pods en exceso no generan duplicados; el coordinador no les asigna ninguna partición, manteniéndolos en espera pasiva."
      ],
      "q-12": [
        null,
        "`mmap()` evita algunas copias pero aún involucra interacción con el espacio de usuario; `sendfile()` ejecuta la transferencia completa dentro del kernel vía DMA.",
        "`splice()` conecta descriptores vía pipes pero no es el mecanismo estándar de Kafka para transferir segmentos de log a sockets de clientes, ni descomprime lotes.",
        "`readv()` y `writev()` ejecutan I/O dispersa pasando por el espacio de usuario, requiriendo copias entre buffers del kernel y la aplicación."
      ],
      "q-13": [
        null,
        "Con `acks=1` se pueden perder datos si el líder falla antes de replicar a los followers; y `acks=all` en métricas web añade latencia innecesaria.",
        "Configurar `retries=0` en transferencias expone a pérdidas ante cualquier error de red transitorio; y `acks=1` en métricas no ofrece la menor latencia posible.",
        "El valor `acks=2` no existe en el protocolo de Kafka (solo 0, 1 o all/-1), y `acks=-1` contradice el requisito de baja latencia para métricas."
      ],
      "q-14": [
        null,
        "Kafka no usa sumas CRC32 del payload para deduplicación semántica; el CRC solo valida integridad física contra corrupción de datos en tránsito o disco.",
        "Los offsets son asignados exclusivamente por el broker líder al escribir en el log, nunca por el cliente productor.",
        "La idempotencia se gestiona en cada broker para sus particiones mediante PID y secuencias; no interviene el quórum KRaft ni se usan tablas de hashes."
      ],
      "q-15": [
        null,
        "El productor no frena el socket TCP de forma síncrona; envía hasta 5 peticiones concurrentes en pipeline confiando en la validación de secuencia del broker.",
        "El broker no reordena por timestamp del registro; persiste estrictamente en base a los números de secuencia contiguos asignados por el productor.",
        "El quórum KRaft solo gestiona metadatos del clúster; los datos de usuario son transmitidos directamente entre clientes y brokers sin pasar por KRaft."
      ],
      "q-16": [
        null,
        "Kafka no adquiere bloqueos de lectura en las particiones durante las transacciones; el aislamiento se resuelve en los consumidores según `isolation.level`.",
        "Los mensajes transaccionales se escriben inmediatamente en los segmentos de disco; su validez se define mediante marcadores de control COMMIT/ABORT.",
        "La deduplicación básica por secuencia la hace cada broker en sus réplicas locales; el Transaction Coordinator gestiona el ciclo 2PC en `__transaction_state`."
      ],
      "q-17": [
        null,
        "El broker no elimina físicamente los mensajes abortados al recibir el marcador; permanecen en el log hasta que la retención habitual de segmentos los depure.",
        "El consumidor con `read_uncommitted` no arroja excepciones ante transacciones abortadas; simplemente entrega los registros como mensajes corrientes.",
        "Kafka no reemplaza los mensajes abortados con tombstones; el contenido original permanece intacto en disco junto al marcador de control."
      ],
      "q-18": [
        null,
        "El productor no envía en 0 ms si `linger.ms > 0`; espera deliberadamente el intervalo configurado para intentar acumular más registros en el lote.",
        "Los mensajes no se retienen indefinidamente; `linger.ms` asegura un límite máximo de espera para enviar el lote aunque no alcance `batch.size`.",
        "`delivery.timeout.ms` es el tiempo máximo total para confirmar el mensaje (incluyendo reintentos); el envío físico inicial se activa por `linger.ms` o `batch.size`."
      ],
      "q-19": [
        null,
        "La compresión configurada en el productor la ejecuta el propio cliente, no el broker líder al escribir en disco.",
        "El broker no necesita descomprimir el lote para indexar; los metadatos de offsets y tamaños se leen directamente de la cabecera del lote (RecordBatch).",
        "Kafka implementa compresión a nivel de aplicación en la JVM/SDK; no utiliza aceleración TCP Offload en la tarjeta de red para comprimir mensajes."
      ],
      "q-20": [
        null,
        "El Sticky Partitioner no concentra todo en la partición 0; rota de partición cada vez que se completa un lote para repartir la carga uniformemente.",
        "El productor no genera UUIDs falsos para mensajes sin clave; preserva la clave null y utiliza lógica de adhesión (stickiness) por lote.",
        "El Sticky Partitioner busca exactamente lo contrario a enviar un registro por paquete; maximiza el tamaño de los lotes para reducir la sobrecarga de red."
      ],
      "q-21": [
        null,
        "Esos 5 bytes no son un checksum CRC32; corresponden al Magic Byte (0x00) y al identificador de esquema asignado por Confluent Schema Registry.",
        "El broker ID y la partición residen en las cabeceras del protocolo de red de Kafka, nunca como prefijo binario dentro del payload del registro.",
        "El timestamp del registro se almacena en los metadatos nativos del RecordBatch de Kafka, no como un prefijo de 5 bytes dentro del cuerpo del mensaje."
      ],
      "q-22": [
        null,
        "En modo `BACKWARD`, si se actualizan primero los productores, los consumidores antiguos fallarán porque no saben deserializar el nuevo campo.",
        "La compatibilidad evolutiva de esquemas en Kafka está diseñada precisamente para evitar paradas simultáneas de mantenimiento y purgas de tópicos.",
        "`BACKWARD` permite perfectamente añadir campos nuevos siempre que tengan un valor `default`; no se requiere cambiar la política a `FORWARD`."
      ],
      "q-23": [
        null,
        "`FORWARD` solo garantiza que consumidores antiguos puedan leer datos de productores nuevos, pero no asegura que consumidores nuevos lean datos de productores antiguos.",
        "`BACKWARD_TRANSITIVE` requiere actualizar consumidores antes que productores, y la propiedad `allow.schema.evolution` no existe en Schema Registry.",
        "El modo `NONE` desactiva toda comprobación de compatibilidad en el registro de esquemas, exponiendo a fallos impredecibles en tiempo de ejecución."
      ],
      "q-24": [
        null,
        "Kafka nunca redistribuye registros históricos al añadir particiones; los mensajes antiguos permanecen intactos en sus particiones originales.",
        "Los productores no arrojan excepciones de autorización; simplemente refrescan los metadatos del tópico y aplican el nuevo número de particiones al hash.",
        "Kafka no mantiene tablas de mapeo de claves en `meta.properties`; la partición se calcula matemáticamente en el cliente con la fórmula de hashing."
      ],
      "q-25": [
        null,
        "Los Consumer Groups son independientes (modelo Pub/Sub); cada grupo recibe su propia copia completa de los datos de las 12 particiones.",
        "Un grupo con menos instancias que particiones asigna varias particiones a cada instancia (12 / 4 = 3); ninguna partición queda huérfana.",
        "La asignación de un grupo no afecta a otros grupos; en `fraud-app` las 12 instancias reciben 1 partición cada una sin limitarse a 4."
      ],
      "q-26": [
        null,
        "Leer solo los mensajes producidos después del inicio del consumidor corresponde al comportamiento de `auto.offset.reset=latest`, no de `earliest`.",
        "`NoOffsetForPartitionException` se arroja únicamente si se configura `auto.offset.reset=none` y no existen offsets previos guardados.",
        "`auto.offset.reset` no calcula ventanas de 24 horas; los valores estándar válidos son `earliest`, `latest` o `none`."
      ],
      "q-27": [
        null,
        "Con `enable.auto.commit=true`, la confirmación se dispara periódicamente en la llamada a `poll()`; no confirma los mensajes en el instante en que se reciben.",
        "El broker no sabe cuántos registros ha procesado la aplicación localmente; solo actualiza los offsets cuando recibe una petición explícita de commit.",
        "Kafka no valida el estado de bases de datos externas; `CommitFailedException` ocurre por rebalanceos o timeouts en el protocolo de miembros del grupo."
      ],
      "q-28": [
        null,
        "`commitAsync()` no bloquea el hilo principal; el problema es puramente lógico por inversión del orden de offsets confirmados en reintentos fuera de secuencia.",
        "El broker procesa peticiones de OffsetCommit según van llegando; no valida dependencias síncronas entre commits asíncronos previos.",
        "La API de Kafka permite utilizar callbacks con `commitAsync()` perfectamente; el riesgo radica en la lógica incorrecta de reintentos manuales desordenados."
      ],
      "q-29": [
        null,
        "Aunque el hilo de heartbeats siga vivo, no llamar a `poll()` dentro de `max.poll.interval.ms` hace que el cliente abandone el grupo activamente por considerarse bloqueado.",
        "El broker no corta el socket TCP por lentitud en el procesamiento; es el cliente quien decide abandonar el grupo al superar el timeout local de poll.",
        "Kafka no ajusta automáticamente el tamaño de los lotes (`max.poll.records`) en caliente; esa configuración es estática en el cliente."
      ],
      "q-30": [
        null,
        "El tiempo máximo de procesamiento del hilo principal lo controla `max.poll.interval.ms`, mientras que `session.timeout.ms` detecta caídas de conectividad o del proceso.",
        "Los heartbeats los envía el cliente hacia el Group Coordinator, nunca a la inversa, y el intervalo debe ser sensiblemente inferior (1/3) a la sesión.",
        "Estos parámetros regulan la membresía y detección de fallos en Consumer Groups, no la expiración ni renovación de credenciales SASL."
      ],
      "q-31": [
        null,
        "El protocolo cooperativo no delega la asignación en KRaft ni crea réplicas provisionales; coordina la cesión de particiones en dos fases consecutivas.",
        "Kafka prohíbe que múltiples miembros del mismo grupo consuman la misma partición simultáneamente; el protocolo cooperativo respeta esta regla fundamental.",
        "Aunque el líder calcula el reparto en el protocolo de asignación, el Group Coordinator siempre orquesta y confirma las fases de unión y sincronización."
      ],
      "q-32": [
        null,
        "Static Membership se gestiona a nivel de protocolo Kafka con el broker; no depende de almacenar asignaciones en volúmenes persistentes PVC de Kubernetes.",
        "El coordinador espera durante `session.timeout.ms`, no `max.poll.interval.ms`, y no almacena mensajes en buffers temporales especiales durante la ausencia.",
        "Static Membership no gestiona tokens de red ni reutiliza sockets TCP mediante Ingress; el cliente reabre una sesión reconociéndose por su `group.instance.id`."
      ],
      "q-33": [
        null,
        "`seek()` solo reposiciona el puntero local de lectura del consumidor en memoria para la siguiente llamada a `poll()`; no persiste ni confirma offsets en el broker.",
        "`auto.commit.interval.ms=1` no asegura atomicidad por registro y satura el clúster de peticiones de red sin garantizar qué mensaje exacto fue procesado.",
        "`commitAsync()` sin parámetros confirma el último offset devuelto por `poll()`, no el registro intermedio que la aplicación esté procesando en ese instante."
      ],
      "q-34": [
        null,
        "`onPartitionsAssigned()` se invoca cuando ya se asignaron las particiones; vaciar el buffer ahí pierde los datos de las particiones revocadas previamente.",
        "`onPartitionsLost()` indica que las particiones ya fueron reclamadas por otro consumidor; hacer commit ahí fallará inevitablemente con `CommitFailedException`.",
        "Kafka no admite canalizaciones directas gRPC entre consumidores para transferir buffers de memoria; el estado debe persistirse y committearse en el broker."
      ],
      "q-35": [
        null,
        "`subscribe()` activa el protocolo coordinado de grupos dinámicos y requiere obligatoriamente un `group.id` válido; no permite omitirlo ni aislar particiones con regex.",
        "Usar `subscribe()` con `group.id` vacío o nulo arroja una excepción de configuración (`InvalidGroupIdException`), impidiendo el inicio del consumidor.",
        "Denegar permisos de coordinación mediante ACLs impedirá que la aplicación arranque, en lugar de concederle acceso directo o aislar una partición específica."
      ],
      "q-36": [
        null,
        "El Group Coordinator se calcula de forma determinista mediante el hash del `group.id`; no se asigna aleatoriamente en KRaft ni en `@metadata`.",
        "El coordinador no es el broker 0; las particiones de `__consumer_offsets` se reparten entre todos los brokers para distribuir la carga equitativamente.",
        "El cliente no elige el coordinador por latencia de red; solicita la identidad del coordinador al clúster mediante una petición `FindCoordinatorRequest`."
      ],
      "q-37": [
        null,
        "El modo Standalone admite conectores de tipo Source y Sink; su grave limitación es la ausencia de tolerancia a fallos, balanceo y alta disponibilidad.",
        "El modo Standalone soporta convertidores de Schema Registry como Avro; la restricción inaceptable en producción es ser un punto único de fallo (SPOF).",
        "Kafka Connect Standalone se comunica por TCP estándar y admite mecanismos SASL; su inviabilidad radica en la falta de resiliencia y escalabilidad."
      ],
      "q-38": [
        null,
        "El impedimento no es un error de segmentos en el consumidor, sino la imposibilidad de garantizar orden lineal total de configuraciones con múltiples particiones.",
        "Connect no limita sus lecturas a la partición 0 por diseño de rebalanceo; requiere 1 partición para que todos los workers vean exactamente las mismas actualizaciones en orden.",
        "La compactación de logs funciona independientemente del número de particiones; el requisito de 1 partición responde a la necesidad de orden global consistente."
      ],
      "q-39": [
        null,
        "Cifrar con un convertidor genérico no enmascara selectivamente el campo antes de escribirlo en el log de Kafka como exige PCI-DSS; una SMT aplica la transformación al vuelo.",
        "Schema Registry valida la estructura y compatibilidad de tipos del esquema, pero no inspecciona ni anonimiza los datos contenidos dentro de los campos.",
        "Filtrar en el consumidor downstream es inaceptable para PCI-DSS porque el número de tarjeta ya habría quedado almacenado en texto sin enmascarar en los discos del broker."
      ],
      "q-40": [
        null,
        "`errors.tolerance=none` detiene la tarea inmediatamente ante cualquier error; no desvía mensajes a la DLQ ni permite continuar el consumo.",
        "Si `errors.tolerance` permanece en `none`, la tarea falla ante el primer registro corrupto y la DLQ nunca llega a utilizarse.",
        "Cambiar el convertidor a bytes no resuelve la indexación errónea en OpenSearch ni envía los registros erróneos a una cola de mensajes no entregados."
      ],
      "q-41": [
        null,
        "Tanto los Converters como las SMTs pueden aplicarse tanto en conectores Source como Sink en distintas etapas del pipeline de Connect.",
        "La compresión y el enrutamiento de red son gestionados por el cliente productor/consumidor subyacente y los brokers, no por los componentes de Connect.",
        "La compatibilidad la verifica el Schema Registry y el commit de offsets lo realiza el framework de Connect; la SMT transforma registros individuales."
      ],
      "q-42": [
        null,
        "Modelar clics continuos en una `KTable` sobrescribiría los clics anteriores del mismo usuario perdiendo eventos; y una `GlobalKTable` requiere clave.",
        "Kafka Streams provee la abstracción `KTable` precisamente para representar vistas mutables de estado por clave sin necesidad de agregaciones manuales.",
        "Las ventanas temporales se aplican sobre operaciones de agregación, no para modelar entidades básicas de entrada continua como flujos o tablas changelog."
      ],
      "q-43": [
        null,
        "Kafka Streams no multiplexa particiones asimétricas en joins locales; exige rigurosamente que ambos tópicos tengan el mismo número de particiones.",
        "El fallo por distinto particionado es de topología (`TopologyException`), no de serialización, y no se resuelve con `auto.offset.reset`.",
        "Kafka no puede reducir ni trunca particiones de tópicos de datos existentes en caliente; el co-particionado debe planificarse o forzarse en el flujo."
      ],
      "q-44": [
        null,
        "Una `KTable` estándar siempre exige co-particionado; el parámetro ficticio `streams.join.broadcast` no existe en la API de Kafka Streams.",
        "Re-particionar el stream masivo de 50 particiones añade sobrecarga de red y almacenamiento, que es exactamente lo que el enunciado pide evitar usando `GlobalKTable`.",
        "Las ventanas deslizantes (`SlidingWindows`) sirven para agregaciones temporales entre dos streams, no para enriquecer flujos contra tablas de referencia."
      ],
      "q-45": [
        null,
        "Almacenar grandes estados en el Heap saturaría la memoria con pausas de GC, y Kafka Streams no respalda State Stores en buckets S3 de forma nativa.",
        "Kafka Streams utiliza RocksDB embebido y changelog topics internos; no escribe transacciones síncronas contra bases de datos externas como Cassandra.",
        "`in_memory` pierde todo el estado al caer la instancia y obligaría a reconstruirlo desde cero desde el changelog, aumentando drásticamente el RTO."
      ],
      "q-46": [
        null,
        "Las `Hopping Windows` avanzan con solapamiento periódico, haciendo que los eventos pertenezcan simultáneamente a múltiples ventanas adyacentes.",
        "Las `Session Windows` no tienen longitud fija de 15 minutos; se abren y cierran dinámicamente según la inactividad entre eventos del mismo emisor.",
        "Las `Sliding Windows` se evalúan continuamente en base a diferencias temporales relativas entre pares de eventos, no en bloques fijos discretos."
      ],
      "q-47": [
        null,
        "El dashboard en tiempo real se beneficia de `Push Queries` reactivas con `EMIT CHANGES`; hacer polling con `Pull Queries` introduce sobrecarga y latencia.",
        "Las `Pull Queries` no ofrecen actualización reactiva continua para el dashboard; este modelo requeriría peticiones repetitivas ineficientes.",
        "El servicio telefónico requiere consultar puntualmente el saldo actual bajo demanda (request/response); una `Push Query` continua sería innecesaria e ineficiente."
      ],
      "q-48": [
        null,
        "ksqlDB permite crear streams sin definir `KEY`; la clave se define para optimizar topologías y evitar re-particionados innecesarios en la red.",
        "ksqlDB es solo una capa de procesamiento; nunca trunca ni destruye datos de los tópicos subyacentes de Kafka al omitir la clave.",
        "Avro y Schema Registry gestionan esquemas independientes para clave y valor (`-key` y `-value`); no exigen campos compuestos únicos para agrupar."
      ],
      "q-49": [
        null,
        "mTLS requiere generar y distribuir certificados y claves privadas X.509 a cada cliente; no utiliza contraseñas almacenadas nativamente en Kafka.",
        "SASL/PLAIN transmite contraseñas en texto claro requiriendo TLS, y no almacena credenciales dinámicas con salting en los metadatos de Kafka.",
        "Kerberos requiere una infraestructura centralizada compleja de KDC (Key Distribution Center), no almacena credenciales dinámicas nativas en Kafka."
      ],
      "q-50": [
        null,
        "El Keystore contiene las credenciales propias (clave privada y certificado) del cliente; el Truststore valida autoridades CA, no contiene ACLs ni contraseñas SASL.",
        "Keystore y Truststore son componentes de autenticación y cifrado en tránsito TLS; no gestionan el cifrado en reposo en el disco de los brokers.",
        "No deben confundirse ni fusionarse: el Keystore guarda la clave privada secreta del cliente, mientras que el Truststore contiene certificados públicos de confianza (CA)."
      ],
      "q-51": [
        null,
        "Conceder `All` sobre `Cluster` viola el principio de menor privilegio al otorgar permisos administrativos innecesarios para producir transaccionalmente.",
        "Los permisos sobre tópicos y transacciones no se heredan mágicamente de `Cluster`; deben asignarse explícitamente sobre el tópico y el `TransactionalId`.",
        "Los clientes nunca deben tener acceso directo al tópico interno `__transaction_state`; ese tópico lo gestiona exclusivamente el Transaction Coordinator."
      ],
      "q-52": [
        null,
        "En Kafka no hay especificidad por IP: una coincidencia con una regla `DENY` anula cualquier regla `ALLOW`, independientemente de que el host sea comodín.",
        "El orden en que se registraron las ACLs no influye; el authorizer agrupa y evalúa primero las denegaciones antes que cualquier concesión.",
        "Las reglas de autorización no bloquean handshakes TCP por ambigüedad; el authorizer resuelve determinísticamente denegando el acceso de inmediato."
      ],
      "q-53": [
        null,
        "El segmento activo nunca es compactado por el Log Cleaner; se mantiene append-only puro para no degradar la latencia de escrituras entrantes.",
        "Kafka no detiene a los productores ni consolida particiones completas en un único archivo comprimido; limpia segmentos inactivos en segundo plano.",
        "La compactación de logs se ejecuta en caliente y de manera continua en segundo plano mediante hilos cleaner; no requiere mantenimiento offline."
      ],
      "q-54": [
        null,
        "El sistema de archivos ext4 o XFS no tiene restricciones sobre escribir registros con payload nulo; la retención de tombstones es una regla lógica de Kafka.",
        "KRaft no tarda 24 horas en sincronizar metadatos; la retención del tombstone protege el procesamiento de los consumidores de datos downstream.",
        "Kafka no reintenta recuperar datos eliminados contactando productores; los registros publicados son inmutables y de flujo estrictamente unidireccional."
      ],
      "q-55": [
        null,
        "`UnderReplicatedPartitions` no mide pérdida de particiones en disco; mide particiones cuyo número actual de réplicas en sincronía (ISR) es menor que su `replication.factor`.",
        "El retraso de los consumidores se monitoriza con la métrica de `consumer lag`, no afecta a las particiones sub-replicadas del broker.",
        "La configuración de `acks=0` en productores no determina si las réplicas followers se mantienen en sincronía dentro del ISR de la partición."
      ],
      "q-56": [
        null,
        "En Kafka solo debe haber exactamente un controlador activo líder en todo el clúster; un modelo multimaestro con múltiples líderes no existe en KRaft ni ZooKeeper.",
        "El valor saludable en régimen normal es 1, no 0; un valor de 0 significa que ningún broker ejerce el liderazgo de metadatos, impidiendo cambios administrativos.",
        "La métrica `ActiveControllerCount` mide el líder activo (exactamente 1), no el número total de nodos o votantes que conforman el quórum de controladores."
      ],
      "q-57": [
        null,
        "La métrica mide porcentaje de tiempo ocioso (idle); un 6 % de idle significa una saturación crítica del 94 %, no una baja carga de trabajo.",
        "Los fallos de autenticación se reflejan en métricas de errores de conexión SASL/SSL, no en la utilización del pool de hilos de atención de peticiones (`num.io.threads`).",
        "La métrica monitorea directamente los hilos de `KafkaRequestHandlerPool`, no las pausas de recolección de basura ni la memoria del heap de la JVM."
      ],
      "q-58": [
        null,
        "Tiered Storage descarga segmentos a Cloud Object Storage (S3, GCS, Azure Blob), no se basa en volúmenes EBS fríos ni deduplicación en memoria RAM.",
        "Tiered Storage mantiene los datos accesibles de forma transparente para los clientes de Kafka mediante la API estándar; no requiere tablas Iceberg ni motores externos.",
        "MirrorMaker 2 replica entre clústeres independientes, pero no es Tiered Storage (que desacopla el almacenamiento nativo en un único clúster)."
      ],
      "q-59": [
        null,
        "Aunque se pierda la compresión de punteros (Compressed OOPs) pasando de 32 GB, la razón primordial por la que Kafka usa heaps pequeños (6-10 GB) es maximizar el PageCache del SO y evitar pausas de GC.",
        "Kafka no utiliza el espacio Swap de Linux; al contrario, la swap debe desactivarse o minimizarse (`vm.swappiness=1`) para evitar caídas severas de rendimiento.",
        "KRaft no establece restricciones de heap basadas en hilos de red; los brokers se dimensionan para dejar la mayor parte de la RAM al PageCache del sistema operativo."
      ],
      "q-60": [
        null,
        "SASL/SCRAM no se federa con endpoints de introspección JWT vía webhooks; el estándar nativo de Kafka para tokens JWT es SASL/OAUTHBEARER.",
        "SASL/GSSAPI está diseñado para autenticación Kerberos corporativa, no para federación directa con tokens OpenID Connect/OAuth 2.0.",
        "Las ACLs gestionan autorización, no autenticación ni validación de tokens JWT, y Schema Registry no interviene en la seguridad a nivel de transporte TCP."
      ]
    },
    glossary: [
  {
    "term": "ISR (In-Sync Replicas)",
    "cat": "Arquitectura & KRaft",
    "d": 1,
    "def": "Subconjunto de réplicas de una partición que se encuentran activas y al día con el líder, según el umbral temporal de sincronización.",
    "tip": "Monitorea continuamente que UnderReplicatedPartitions sea 0; si una réplica no envía FetchRequest antes de replica.lag.time.max.ms, es expulsada del ISR."
  },
  {
    "term": "High Watermark (HW)",
    "cat": "Arquitectura & KRaft",
    "d": 1,
    "def": "Offset del último registro que ha sido replicado exitosamente en todas las réplicas del ISR de una partición.",
    "tip": "Los consumidores nunca pueden leer más allá del High Watermark, garantizando que jamás lean datos que pudieran perderse ante un failover del líder."
  },
  {
    "term": "Log End Offset (LEO)",
    "cat": "Arquitectura & KRaft",
    "d": 1,
    "def": "Offset del próximo mensaje que se escribirá en el log local de una réplica específica de una partición.",
    "tip": "El desfase entre el LEO del líder y el LEO de un seguidor determina el lag de replicación de esa réplica."
  },
  {
    "term": "KRaft (Kafka Raft Metadata Mode)",
    "cat": "Arquitectura & KRaft",
    "d": 1,
    "def": "Mecanismo de consenso interno basado en Raft que reemplaza a Apache ZooKeeper para la gestión de metadatos y elección de controlador.",
    "tip": "En producción a gran escala, aísla siempre 3 o 5 nodos con process.roles=controller dedicados sin mezclar el rol broker."
  },
  {
    "term": "Controller Quorum",
    "cat": "Arquitectura & KRaft",
    "d": 1,
    "def": "Conjunto de nodos dedicados que ejecutan el protocolo Raft y mantienen el log de metadatos @metadata replicado en memoria.",
    "tip": "Para tolerar F fallos simultáneos se requieren 2F + 1 controladores; 3 toleran 1 fallo, 5 toleran 2 fallos."
  },
  {
    "term": "broker.rack",
    "cat": "Arquitectura & KRaft",
    "d": 1,
    "def": "Configuración del broker que identifica el rack físico o la Zona de Disponibilidad (AZ) en entornos cloud.",
    "tip": "Esencial en AWS/GCP/Azure para que Kafka distribuya las réplicas de una partición en diferentes zonas garantizando alta disponibilidad ante caídas de datacenter."
  },
  {
    "term": "Unclean Leader Election",
    "cat": "Arquitectura & KRaft",
    "d": 1,
    "def": "Elección como nuevo líder de una réplica desincronizada (fuera del ISR) cuando todas las réplicas del ISR han colapsado.",
    "tip": "Mantén unclean.leader.election.enable=false en sistemas financieros para evitar pérdida de datos y desajustes de offsets."
  },
  {
    "term": "Zero-Copy (sendfile)",
    "cat": "Arquitectura & KRaft",
    "d": 1,
    "def": "Técnica del kernel de Linux que transfiere datos desde el PageCache directamente al socket de red por DMA sin cruzar a la memoria de la JVM.",
    "tip": "Kafka depende fuertemente de Zero-Copy; no asignes un Heap de Java excesivo para dejar RAM libre al Linux PageCache."
  },
  {
    "term": "acks=all (-1)",
    "cat": "Producers & Schemas",
    "d": 2,
    "def": "Configuración del productor que exige confirmación del líder y de todas las réplicas en el ISR antes de dar por exitoso el envío.",
    "tip": "Combínalo siempre con min.insync.replicas=2 y replication.factor=3 para máxima durabilidad sin pérdida de datos."
  },
  {
    "term": "min.insync.replicas",
    "cat": "Producers & Schemas",
    "d": 2,
    "def": "Número mínimo de réplicas en el ISR requeridas para aceptar una escritura cuando el productor envía con acks=all.",
    "tip": "Si el tamaño del ISR cae por debajo de este valor, el broker líder rechaza las escrituras con NotEnoughReplicasException."
  },
  {
    "term": "Idempotent Producer",
    "cat": "Producers & Schemas",
    "d": 2,
    "def": "Modo del productor que previene la inserción de mensajes duplicados en el commit log ante reintentos de red.",
    "tip": "Se activa con enable.idempotence=true; asigna un Producer ID (PID) y un Sequence Number que el broker valida en memoria."
  },
  {
    "term": "max.in.flight.requests.per.connection",
    "cat": "Producers & Schemas",
    "d": 2,
    "def": "Cantidad máxima de peticiones no confirmadas que el cliente puede enviar a través de una misma conexión TCP al broker.",
    "tip": "Con enable.idempotence=true, se puede configurar hasta 5 manteniendo garantías estrictas de orden de llegada."
  },
  {
    "term": "transactional.id",
    "cat": "Producers & Schemas",
    "d": 2,
    "def": "Identificador unívoco y persistente asignado a un productor para habilitar transacciones Exactly-Once (EOS) entre reinicios.",
    "tip": "El Transaction Coordinator mapea el transactional.id a una partición del tópico interno __transaction_state."
  },
  {
    "term": "read_committed",
    "cat": "Producers & Schemas",
    "d": 2,
    "def": "Nivel de aislamiento del consumidor que filtra mensajes de transacciones abortadas y solo entrega mensajes committeados.",
    "tip": "El consumidor retiene los mensajes hasta el Last Stable Offset (LSO) para ocultar escrituras de transacciones que aún están abiertas."
  },
  {
    "term": "linger.ms",
    "cat": "Producers & Schemas",
    "d": 2,
    "def": "Tiempo máximo en milisegundos que el productor retiene un lote en el RecordAccumulator antes de transmitirlo por red.",
    "tip": "Aumentar linger.ms de 0 a 10–20 ms permite formar lotes más densos, multiplicando el throughput con latencia casi imperceptible."
  },
  {
    "term": "batch.size",
    "cat": "Producers & Schemas",
    "d": 2,
    "def": "Tamaño máximo en bytes reservado para cada lote de mensajes acumulados por partición en la memoria del productor.",
    "tip": "El valor por defecto es 16 KB (16384 bytes); en sistemas de alto volumen se recomienda elevarlo a 64 KB o 128 KB."
  },
  {
    "term": "Sticky Partitioner",
    "cat": "Producers & Schemas",
    "d": 2,
    "def": "Estrategia de particionado que agrupa registros con clave null en la misma partición hasta llenar el lote o agotar linger.ms.",
    "tip": "Introducido en KIP-480, elimina la sobrecarga del round-robin registro a registro y reduce drásticamente la latencia en mensajes sin clave."
  },
  {
    "term": "Confluent Wire Format",
    "cat": "Producers & Schemas",
    "d": 2,
    "def": "Formato binario de 5 bytes antepuestos al payload serializado por Confluent Schema Registry (Byte 0: Magic Byte 0x00, Bytes 1-4: Schema ID).",
    "tip": "Cualquier deserializador genérico que intente leer el payload sin contemplar estos 5 bytes fallará con errores de caracteres ilegales."
  },
  {
    "term": "BACKWARD Compatibility",
    "cat": "Producers & Schemas",
    "d": 2,
    "def": "Modo de compatibilidad de Schema Registry donde los consumidores con esquema nuevo pueden procesar datos generados con esquemas anteriores.",
    "tip": "Regla de oro de despliegue: actualiza primero a los Consumidores y posteriormente a los Productores."
  },
  {
    "term": "FULL Compatibility",
    "cat": "Producers & Schemas",
    "d": 2,
    "def": "Modo de compatibilidad simétrico donde esquemas nuevos y antiguos pueden leer datos generados por cualquier versión.",
    "tip": "Permite a los equipos de desarrollo desplegar productores o consumidores en cualquier orden de forma totalmente desacoplada."
  },
  {
    "term": "Consumer Group",
    "cat": "Consumers & Offsets",
    "d": 3,
    "def": "Conjunto coordinado de instancias consumidoras que comparten un mismo group.id para repartirse el consumo de particiones de un tópico.",
    "tip": "El número de particiones del tópico establece el límite estricto de consumidores concurrentes activos dentro del mismo grupo."
  },
  {
    "term": "Group Coordinator",
    "cat": "Consumers & Offsets",
    "d": 3,
    "def": "Broker de Kafka designado para gestionar la membresía, los heartbeats, los rebalanceos y los commits de offsets de un Consumer Group.",
    "tip": "Se determina mediante la fórmula: broker líder de la partición abs(hashCode(group.id)) % 50 del tópico __consumer_offsets."
  },
  {
    "term": "auto.offset.reset",
    "cat": "Consumers & Offsets",
    "d": 3,
    "def": "Política que adopta el consumidor cuando no existe un offset previo confirmado en el clúster o el offset almacenado expiró.",
    "tip": "Usa 'earliest' para procesar todo el histórico desde el inicio del log, y 'latest' para leer solo nuevos eventos entrantes."
  },
  {
    "term": "commitSync vs. commitAsync",
    "cat": "Consumers & Offsets",
    "d": 3,
    "def": "Métodos de confirmación manual de offsets en el consumidor: síncrono bloqueante con reintentos vs. asíncrono no bloqueante sin reintentos.",
    "tip": "Usa commitAsync durante el bucle principal y asegura el último commit con commitSync al cerrar o en onPartitionsRevoked."
  },
  {
    "term": "max.poll.interval.ms",
    "cat": "Consumers & Offsets",
    "d": 3,
    "def": "Tiempo máximo permitido entre llamadas consecutivas a poll() antes de que el consumidor se auto-expulse del grupo.",
    "tip": "Si el procesamiento de un batch supera este tiempo, reduce max.poll.records o incrementa max.poll.interval.ms para evitar Rebalance Storms."
  },
  {
    "term": "session.timeout.ms",
    "cat": "Consumers & Offsets",
    "d": 3,
    "def": "Tiempo máximo que el coordinador espera sin recibir señales de heartbeat antes de considerar muerto a un consumidor.",
    "tip": "El parámetro heartbeat.interval.ms debe configurarse siempre como máximo a un tercio (1/3) de session.timeout.ms."
  },
  {
    "term": "CooperativeStickyAssignor",
    "cat": "Consumers & Offsets",
    "d": 3,
    "def": "Protocolo de rebalanceo incremental (KIP-429) que solo revoca y transfiere las particiones que cambian de dueño, sin pausar el resto.",
    "tip": "Reemplaza al antiguo rebalanceo Eager (Stop-The-World), eliminando las caídas de throughput durante despliegues y auto-escalado."
  },
  {
    "term": "Static Membership (group.instance.id)",
    "cat": "Consumers & Offsets",
    "d": 3,
    "def": "Mecanismo que asigna un ID persistente a un consumidor para sobrevivir a reinicios breves sin disparar rebalanceos.",
    "tip": "Ideal para despliegues Rolling Update en Kubernetes vinculando group.instance.id al nombre de host del StatefulSet."
  },
  {
    "term": "Kafka Connect Distributed",
    "cat": "Connect, Streams & ksqlDB",
    "d": 4,
    "def": "Clúster escalable y tolerante a fallos de workers de Kafka Connect que gestionan conectores Source y Sink de forma distribuida.",
    "tip": "Utiliza tres tópicos internos compactados (configs, offsets, status); config.storage.topic debe tener estrictamente 1 partición."
  },
  {
    "term": "Single Message Transform (SMT)",
    "cat": "Connect, Streams & ksqlDB",
    "d": 4,
    "def": "Transformación ligera en memoria que modifica campos, enmascara datos o enruta tópicos sobre registros individuales en Connect.",
    "tip": "Se configuran declarativamente en el conector (ej. InsertField, MaskField, RegexRouter) sin escribir microservicios adicionales."
  },
  {
    "term": "Dead Letter Queue (DLQ)",
    "cat": "Connect, Streams & ksqlDB",
    "d": 4,
    "def": "Tópico de aislamiento donde los conectores Sink desvían automáticamente registros inválidos o corruptos (Poison Pills).",
    "tip": "Se habilita con errors.tolerance=all y errors.deadletterqueue.topic.name; solo es aplicable a conectores Sink, no a Source."
  },
  {
    "term": "Dualidad KStream vs. KTable",
    "cat": "Connect, Streams & ksqlDB",
    "d": 4,
    "def": "Paradigma de Kafka Streams: KStream representa hechos inmutables continuos (INSERT); KTable representa el estado actual por clave (UPSERT).",
    "tip": "Un KStream se puede agregar para formar una KTable, y el changelog de una KTable se puede emitir como un KStream."
  },
  {
    "term": "GlobalKTable",
    "cat": "Connect, Streams & ksqlDB",
    "d": 4,
    "def": "Abstracción de Kafka Streams que almacena la totalidad de los datos de un tópico en la memoria/disco local de todas las instancias de la app.",
    "tip": "Permite realizar joins con KStreams sin requerir co-particionado, ideal para tablas de búsqueda pequeñas o catálogos estáticos."
  },
  {
    "term": "Co-partitioning",
    "cat": "Connect, Streams & ksqlDB",
    "d": 4,
    "def": "Requisito estricto en joins de Kafka Streams: ambos tópicos deben tener idéntico número de particiones y la misma función hash por clave.",
    "tip": "Si no están co-particionados, Kafka Streams lanza TopologyException o fuerza un costoso re-particionado intermedio a través del clúster."
  },
  {
    "term": "RocksDB State Store",
    "cat": "Connect, Streams & ksqlDB",
    "d": 4,
    "def": "Base de datos clave-valor embebida off-heap utilizada por Kafka Streams para persistir el estado de ventanas y agregaciones.",
    "tip": "Está respaldada por un changelog topic compactado en Kafka; usa num.standby.replicas para failovers instantáneos sin reconstrucción lenta."
  },
  {
    "term": "Tombstone (Log Compaction)",
    "cat": "Seguridad & Operaciones",
    "d": 5,
    "def": "Registro con una clave existente y payload nulo (value=null) que indica la eliminación lógica de esa clave en un tópico compactado.",
    "tip": "Kafka conserva los tombstones durante delete.retention.ms (default 24h) para que los consumidores lentos procesen el borrado."
  },
  {
    "term": "UnderReplicatedPartitions",
    "cat": "Seguridad & Operaciones",
    "d": 5,
    "def": "Métrica JMX fundamental que indica el número de particiones cuyo tamaño de ISR actual es inferior al replication.factor.",
    "tip": "Debe ser estrictamente 0 en condiciones normales; cualquier valor positivo indica brokers caídos, saturación de disco o lag de red."
  },
  {
    "term": "Tiered Storage (KIP-405)",
    "cat": "Seguridad & Operaciones",
    "d": 5,
    "def": "Arquitectura que separa computación de almacenamiento descargando segmentos cerrados a Object Storage (S3/GCS/Azure Blob).",
    "tip": "Permite retención ilimitada a bajo costo y reduce los tiempos de rebalanceo de particiones de semanas a minutos."
  }
]
  };
})(window);
