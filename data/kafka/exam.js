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
      "Desplegar un quórum dedicado e independiente de 3 o 5 nodos configurados con **process.roles=controller** y configurar los 100 brokers con **process.roles=broker**, evitando mezclar roles en los mismos nodos.",
      "Configurar los 100 nodos en modo combinado con **process.roles=broker,controller** para distribuir la carga del log de metadatos entre todos los servidores del clúster de forma homogénea.",
      "Configurar un único nodo con **process.roles=controller** y 99 nodos con **process.roles=broker**, ya que KRaft no requiere consenso distribuido para gestionar la partición de metadatos interna.",
      "Desplegar un número par de controladores (exactamente 4 nodos) con **process.roles=controller** para optimizar la paridad de votos en caso de partición de red entre dos centros de datos."
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
      "No, porque los consumidores solo pueden leer mensajes con offset estrictamente inferior al High Watermark (HW), y el HW no avanza hasta que todas las réplicas del ISR hayan confirmado la replicación del mensaje.",
      "Sí, porque al tener **isolation.level=read_uncommitted**, el consumidor ignora el High Watermark y lee directamente hasta el Log End Offset (LEO) del líder.",
      "Sí, siempre que el productor haya enviado el mensaje con **acks=0** o **acks=1** en su configuración de cliente.",
      "No, porque en Kafka los consumidores únicamente leen de las réplicas follower que se encuentren en la misma zona de disponibilidad (AZ)."
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
      "El líder expulsa a la réplica follower del conjunto de réplicas en sincronía (ISR) notificando al controlador para actualizar los metadatos de la partición.",
      "El líder frena inmediatamente todas las escrituras entrantes de los productores y entra en modo de solo lectura hasta que el follower termine la pausa de GC.",
      "El líder marca la partición completa como **Offline** y rechaza peticiones tanto de productores como de consumidores.",
      "El líder transfiere automáticamente el liderazgo de la partición al follower rezagado para permitirle sincronizar su log local."
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
      "Los productores recibirán una excepción **NotEnoughReplicasException** y sus escrituras serán rechazadas; los consumidores podrán seguir leyendo los mensajes previamente confirmados hasta el High Watermark.",
      "Tanto las operaciones de escritura de los productores como las operaciones de lectura de los consumidores fallarán con **NotEnoughReplicasException**.",
      "Los productores podrán continuar escribiendo con normalidad porque el líder sigue vivo y operativo, pero el líder degradará automáticamente su nivel de confirmación a **acks=1**.",
      "El líder activará automáticamente un nuevo broker provisional para clonar la réplica en menos de 5 segundos sin arrojar excepciones a las aplicaciones."
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
      "La partición se declara en estado **Offline** y no atiende lecturas ni escrituras hasta que vuelva a estar en línea al menos una de las réplicas que pertenecían al ISR original.",
      "El controlador promueve automáticamente a la réplica fuera del ISR a líder para restaurar el servicio, truncando los 5.000 offsets faltantes.",
      "El controlador crea inmediatamente una nueva partición vacía con el mismo identificador y redirige el tráfico de productores a ella.",
      "Kafka transfiere el liderazgo de la partición a un nodo controller de KRaft para que actúe como réplica provisional."
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
      "Se pierden permanentemente los 5.000 mensajes que estaban confirmados en el antiguo líder y, si el antiguo líder vuelve a encenderse, truncará su log al High Watermark del nuevo líder, desincronizando los offsets históricos.",
      "Los mensajes se conservan intactos en una partición oculta de backup de KRaft y se reinsertan automáticamente cuando el antiguo líder vuelva a operar.",
      "Los consumidores recibirán una excepción **CorruptRecordException** irrecuperable y deberán borrar sus bases de datos locales.",
      "El nuevo líder rechaza procesar escrituras con clave (key != null) hasta que se ejecute manualmente una compactación forzada con **kafka-log-dirs.sh**."
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
      "Consulta el archivo de índice disperso **.index** mediante búsqueda binaria en memoria (PageCache) para encontrar la posición física en bytes más cercana al offset y luego lee secuencialmente una mínima cantidad de registros.",
      "Ejecuta una consulta SQL en una base de datos SQLite interna embebida en cada broker que indexa el hash MD5 de cada mensaje.",
      "Lee el archivo **.timeindex** completo desde el inicio para calcular matemáticamente la posición mediante una regla de tres con el timestamp del mensaje.",
      "Descomprime todos los bloques del archivo **.log** en el heap de la JVM y busca el offset mediante un árbol balanceado B-Tree en memoria."
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
      "Porque las políticas de retención de Kafka solo se aplican a los segmentos cerrados (inactivos); mientras el segmento activo no supere **segment.bytes** o **segment.ms**, no se cierra ni se purga ningún mensaje que resida en él.",
      "Porque Kafka requiere que el consumidor de auditoría envíe un comando explícito de confirmación de purga antes de poder borrar segmentos.",
      "Porque la retención por tiempo en Kafka solo funciona si el tópico tiene habilitada simultáneamente la compactación de logs (**cleanup.policy=compact**).",
      "Porque el broker detecta que el espacio libre en disco es superior al 50 % y deshabilita automáticamente el hilo de purga de logs para ahorrar ciclos de CPU."
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
      "Deben permanecer operativos al menos 3 controladores (mayoría simple del quórum: (5/2) + 1), tolerando la caída de hasta 2 controladores simultáneos.",
      "Deben permanecer operativos los 5 controladores de forma estricta; cualquier caída individual detiene el quórum de metadatos por seguridad.",
      "Basta con que permanezcan operativos 2 controladores si se activa el parámetro de quórum flexible **raft.election.timeout.ms=1000**.",
      "Deben permanecer operativos al menos 4 controladores, ya que Raft exige una mayoría calificada del 80 % para operaciones de escritura en el log @metadata."
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
      "Configurar el parámetro **broker.rack** en cada broker con el identificador de la zona (ej. us-east-1a), permitiendo que el asignador de réplicas de Kafka distribuya las particiones a través de diferentes racks físicos/lógicos.",
      "Crear tres listeners independientes en el broker, uno por cada zona de disponibilidad, con la propiedad **advertised.listeners** apuntando al DNS de la subred.",
      "Configurar el parámetro **replica.selector.class** con el valor por defecto y dejar que el particionador de los clientes distribuya los mensajes por AZ.",
      "Establecer la propiedad de tópico **min.insync.replicas=3** y activar la replicación asíncrona entre VPCs mediante un plugin de red CNI."
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
      "Solo 8 pods procesarán datos alcanzando un máximo de 24.000 eventos/s (los otros 12 pods quedarán ociosos); se debe aumentar el número de particiones del tópico a un mínimo de 20 para permitir que los 20 pods consuman en paralelo.",
      "Los 20 pods procesarán 3.000 eventos/s cada uno alcanzando los 60.000 eventos/s requeridos, ya que Kafka multiplexa múltiples consumidores sobre la misma partición usando hilos virtuales.",
      "El clúster entrará en un error de **IllegalStateException** porque Kafka no permite que un Consumer Group tenga más miembros que el número de particiones del tópico.",
      "El throughput será de 60.000 eventos/s pero con duplicados masivos, ya que 12 pods leerán las mismas particiones de forma redundante."
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
      "Utiliza la syscall **sendfile()**, que transfiere los datos directamente desde el PageCache del kernel al buffer del socket de la tarjeta de red (NIC) mediante DMA, sin copiar los datos al espacio de usuario de la JVM.",
      "Utiliza la llamada **mmap()** combinada con **read()** y **write()**, copiando los bloques de bytes en un buffer DirectByteBuffer gestionado por el Garbage Collector de Java.",
      "Utiliza la librería de compresión **libzstd** del kernel para empaquetar los bloques en memoria física evitando la tabla de páginas virtuales de Linux.",
      "Ejecuta una llamada ioctl sobre los discos NVMe para delegar la transmisión de paquetes TCP/IP directamente al firmware del SSD sin pasar por el stack de red del kernel."
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
      "Transferencias: **acks=all** (-1) junto con **retries=Integer.MAX_VALUE**; Métricas web: **acks=0**.",
      "Transferencias: **acks=1**; Métricas web: **acks=all** (-1) con **retries=0**.",
      "Transferencias: **acks=0**; Métricas web: **acks=1** con compresión zstd.",
      "Transferencias: **acks=2**; Métricas web: **acks=-1** con **linger.ms=0**."
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
      "El broker utiliza el identificador único del productor (Producer ID o PID) y el número de secuencia monotónicamente creciente (Sequence Number) asignado a cada mensaje para detectar que ya fue persistido y devolver un ACK exitoso sin duplicar el registro en el log.",
      "El broker calcula el hash SHA-256 del contenido del payload y consulta una base de datos Redis en memoria para verificar si el hash ya existe.",
      "El broker descarta automáticamente cualquier mensaje que llegue con una marca de tiempo idéntica al último mensaje recibido en la partición.",
      "El broker fuerza al productor a abrir una transacción de base de datos relacional con nivel de aislamiento Serializable."
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
      "Porque el broker almacena los últimos 5 números de secuencia en memoria por cada PID y partición; si un lote con número de secuencia superior llega antes debido a un reintento del lote anterior, el broker rechaza el lote desordenado con OutOfOrderSequenceException forzando al productor a preservar el orden estricto.",
      "Porque Kafka suspende la conexión TCP y encola físicamente los paquetes en el socket del cliente hasta recibir el ACK de la petición previa.",
      "Porque el particionador asigna automáticamente cada una de las 5 peticiones a una partición física diferente del clúster.",
      "Porque el protocolo KRaft reordena automáticamente los mensajes en el quórum de metadatos antes de enviarlos a los brokers."
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
      "Coordina un protocolo Two-Phase Commit (2PC) registrando el estado de la transacción en el tópico interno **__transaction_state** y escribiendo marcadores de control (COMMIT o ABORT) en las particiones de datos de los tópicos participantes.",
      "Bloquea todas las particiones del clúster para impedir que otros productores escriban mientras dure la transacción.",
      "Mantiene los datos en la memoria RAM del broker y solo escribe en el disco cuando la aplicación cliente llama al método close().",
      "Genera un token OAuth 2.0 efímero para autorizar cada mensaje individual en el listener SSL."
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
      "Leerá los 100 mensajes que pertenecían a la transacción abortada como si fueran mensajes válidos ordinarios, ya que **read_uncommitted** lee todos los mensajes hasta el High Watermark sin filtrar transacciones abortadas.",
      "Filtrará los mensajes abortados de forma transparente porque el broker los elimina físicamente del disco de inmediato al recibir el marcador de control ABORT.",
      "Se detendrá arrojando una excepción **TransactionAbortedException** obligando a reiniciar el proceso.",
      "Recibirá los 100 mensajes con el payload reemplazado por bytes nulos (Tombstones)."
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
      "Se transmitirá exactamente después de 10 milisegundos, ya que al no llenarse el buffer de 32 KB, el temporizador de **linger.ms** expira y fuerza el envío del lote acumulado.",
      "Se transmitirá instantáneamente en 0 milisegundos, ya que el primer mensaje de cualquier sesión nunca se retiene en el RecordAccumulator.",
      "Quedará bloqueado indefinidamente en la memoria del cliente hasta que la aplicación envíe suficientes mensajes para completar los 32 KB.",
      "Se enviará transcurrido el tiempo definido en **request.timeout.ms** (por defecto 30 segundos)."
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
      "La compresión se ejecuta en el cliente productor en memoria y la descompresión en el cliente consumidor; los brokers almacenan y reenvían los datos comprimidos tal cual sin descomprimirlos, ahorrando CPU en el broker y optimizando el ancho de banda de red.",
      "La compresión la ejecuta el broker líder al recibir el mensaje y la descompresión la realiza el broker antes de enviar los datos al consumidor.",
      "La compresión se ejecuta en la tarjeta de red del broker mediante aceleración de hardware TCP Offload Engine.",
      "El productor comprime los datos, pero el broker está obligado a descomprimir y volver a comprimir cada mensaje para indexar el offset en el archivo .index."
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
      "Agrupa mensajes consecutivos sin clave en la misma partición hasta llenar el **batch.size** o alcanzar **linger.ms**, y solo entonces rota hacia la siguiente partición, reduciendo la latencia y maximizando el tamaño de los lotes.",
      "Asigna todos los mensajes con clave null permanentemente a la partición 0 del tópico para evitar fragmentación de disco.",
      "Genera una clave aleatoria UUID v4 para cada mensaje en memoria antes de calcular la función hash Murmur2.",
      "Descarta el uso de memoria en el cliente y envía los mensajes directamente al broker mediante llamadas HTTP/2 concurrentes."
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
      "El byte 0 es el Magic Byte (0x00) que identifica el protocolo de Confluent, y los siguientes 4 bytes representan el Schema ID (en este caso el ID entero 42 en formato Big-Endian) registrado en Schema Registry.",
      "Son 5 bytes de paridad CRC32 calculados por el productor para verificar la integridad del mensaje ante corrupción de memoria RAM.",
      "Es el identificador del broker líder (Broker ID) seguido del número de partición física en la que se almacenó el registro.",
      "Es un timestamp UNIX truncado a 40 bits que indica el momento exacto en el que el registro fue serializado."
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
      "Se deben actualizar y desplegar primero todos los **Consumidores** con el nuevo esquema, y posteriormente desplegar los **Productores**.",
      "Se deben desplegar primero los **Productores** para que comiencen a emitir el nuevo campo, y semanas después actualizar los **Consumidores**.",
      "Tanto Productores como Consumidores deben detenerse simultáneamente, purgar el tópico completo y reiniciar todos los servicios al mismo segundo.",
      "No se puede desplegar sin cambiar el modo de compatibilidad a **NONE**, ya que BACKWARD prohíbe terminantemente añadir nuevos campos a un esquema."
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
      "Configurar el modo de compatibilidad **FULL** (o **FULL_TRANSITIVE**), que exige que los esquemas sean simultáneamente compatibles hacia atrás (Backward) y hacia adelante (Forward).",
      "Configurar el modo **FORWARD**, ya que este modo permite por definición el despliegue de consumidores en cualquier instante de tiempo.",
      "Configurar el modo **NONE** en todos los subjects para deshabilitar las validaciones y permitir cualquier cambio en el payload.",
      "Configurar el modo **BACKWARD_TRANSITIVE** con el parámetro **allow.any.order=true** en el archivo schema-registry.properties."
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
      "Los mensajes futuros para un mismo **user_id** pueden asignarse a una partición física distinta a la que se asignaban anteriormente (ya que **hash(key) % 24 != hash(key) % 12**), rompiendo la garantía de orden estricto de eventos para ese usuario.",
      "Kafka redistribuye automáticamente todos los mensajes históricos de las primeras 12 particiones a las 24 particiones en tiempo real sin impacto.",
      "Todos los productores fallarán con **SerializationException** hasta que se reinicien para refrescar los metadatos de particionado.",
      "El orden por usuario se mantiene intacto porque Kafka guarda una tabla de correspondencia clave-partición en el archivo meta.properties."
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
      "En **billing-app**, cada una de las 4 instancias recibe exactamente 3 particiones; en **fraud-app**, cada una de las 12 instancias recibe exactamente 1 partición; ambos grupos reciben el 100 % de los mensajes del tópico de forma totalmente independiente.",
      "Los mensajes se reparten entre las 16 instancias totales de ambos grupos de forma aleatoria, por lo que cada mensaje es procesado por un solo servicio.",
      "En **billing-app** 8 particiones quedan sin consumir porque el número de instancias no coincide exactamente con el número de particiones del tópico.",
      "En **fraud-app**, solo 4 instancias pueden procesar datos para mantener paridad con el grupo de facturación y evitar contención en el broker."
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
      "Comenzará a leer desde el offset más antiguo disponible en cada una de las particiones (el inicio absoluto del log no purgado por la retención), procesando todo el historial existente.",
      "Comenzará a leer únicamente los mensajes nuevos que se publiquen a partir del milisegundo exacto en que la aplicación envía su primer FetchRequest.",
      "Arrojará inmediatamente una excepción **NoOffsetForPartitionException** requiriendo que un administrador configure los offsets con la herramienta CLI.",
      "Comenzará a leer desde el High Watermark actual ignorando los mensajes históricos para optimizar la memoria RAM del consumidor."
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
      "El consumidor volverá a leer desde el último offset confirmado antes de la llamada a poll() (hace más de 3 segundos), por lo que reprocesará los 40 pedidos ya guardados en la base de datos (generando duplicados si la base de datos no es idempotente), además de los 60 pedidos restantes.",
      "Los 60 pedidos no procesados se perderán para siempre porque Kafka confirma automáticamente los 100 mensajes en el instante en que salen de poll().",
      "Kafka revertirá automáticamente las 40 inserciones en la base de datos externa utilizando una transacción XA distribuida.",
      "El broker detectará que 40 mensajes fueron leídos y avanzará el offset de la partición a 40 para evitar reprocesamiento."
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
      "Porque si el commit del offset 200 falla transitoriamente pero una llamada posterior logra confirmar exitosamente el offset 300, un reintento tardío del commit del offset 200 sobrescribiría el offset 300 en **__consumer_offsets**, provocando un retroceso de offset y reprocesamiento masivo de datos.",
      "Porque **commitAsync()** bloquea el hilo de ejecución principal durante los reintentos, destruyendo la ventaja de concurrencia asíncrona.",
      "Porque Kafka prohíbe el uso de callbacks en operaciones de commit por motivos de seguridad en los permisos de usuario.",
      "Porque los brokers de Kafka rechazan cualquier commit asíncrono que no venga firmado por un certificado digital mTLS."
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
      "El consumidor superará el tiempo límite de **max.poll.interval.ms** sin llamar a **poll()**, por lo que el cliente se declarará a sí mismo zombie y abandonará el grupo, provocando un rebalanceo destructivo continuo (Rebalance Storm) y dejando los mensajes sin committear.",
      "El hilo de heartbeat del consumidor mantendrá la sesión activa en el broker sin ningún inconveniente, esperando pacientemente los 400 segundos hasta el próximo poll().",
      "El broker desconectará la conexión TCP del cliente tras 60 segundos arrojando un error **LeaderNotAvailableException**.",
      "Kafka dividirá automáticamente el lote restante y lo transferirá a otro broker mediante el protocolo Zero-Copy."
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
      "**session.timeout.ms** es el tiempo que el Group Coordinator espera sin recibir latidos antes de dar por muerto a un consumidor y disparar un rebalanceo; **heartbeat.interval.ms** es la cadencia con la que el hilo de fondo envía latidos y debe ser como máximo **1/3** de **session.timeout.ms**.",
      "**session.timeout.ms** controla el tiempo máximo de procesamiento de un batch en el hilo principal y debe ser siempre el triple de **heartbeat.interval.ms**.",
      "**heartbeat.interval.ms** es el tiempo que el broker tarda en enviar mensajes al cliente y debe ser exactamente igual a **session.timeout.ms**.",
      "Ambos parámetros son obsoletos desde Kafka 2.4 y han sido reemplazados completamente por la métrica de **consumer.lag**."
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
      "En lugar de revocar todas las particiones de todos los consumidores de golpe paralizando el procesamiento, el rebalanceo cooperativo solo revoca y transfiere las particiones específicas que deben cambiar de dueño en una segunda fase, permitiendo que el resto continúe consumiendo sin interrupción.",
      "Elimina por completo el concepto de rebalanceo asignando todas las particiones del clúster a una dirección IP flotante compartida.",
      "Obliga a que todos los mensajes de todas las particiones se consuman estrictamente en orden cronológico absoluto usando un mutex distribuido.",
      "Transfiere la coordinación del Consumer Group desde el broker de Kafka hacia una instancia de Redis Sentinel."
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
      "Asigna un identificador estático único e inmutable a cada pod; cuando un pod se reinicia durante el despliegue, el Group Coordinator reconoce su identidad y reserva sus particiones sin disparar ningún rebalanceo durante el periodo de **session.timeout.ms**.",
      "Convierte a los pods en réplicas de solo lectura que leen directamente desde el PageCache del nodo de Kubernetes sin registrarse en Kafka.",
      "Hace que Kubernetes congele las peticiones HTTP externas hasta que todos los 20 pods estén completamente sincronizados en el offset cero.",
      "Guarda el estado de las particiones en un volumen persistente NFS compartido para que cualquier pod tome cualquier partición sin avisar a Kafka."
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
      "Invocar **commitSync(Map<TopicPartition, OffsetAndMetadata>)** pasando explícitamente el TopicPartition correspondiente y el siguiente offset a procesar (**offsetActual + 1**) tras completar cada unidad de trabajo.",
      "Invocar **seekToBeginning()** inmediatamente antes de cada llamada al método save() del repositorio de base de datos.",
      "Activar **enable.auto.commit=true** con un intervalo de **auto.commit.interval.ms=1**.",
      "Llamar al método **pause()** sobre todas las particiones y enviar un mensaje Tombstone al tópico __consumer_offsets."
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
      "En el método **onPartitionsRevoked()**, volcar los datos pendientes del buffer de las particiones revocadas hacia la base de datos y ejecutar un **commitSync()** de los offsets antes de que el coordinador transfiera las particiones a otro miembro.",
      "En el método **onPartitionsAssigned()**, vaciar todos los registros del log del broker llamando a un método de truncado administrativo.",
      "En el método **onPartitionsLost()**, reintentar indefinidamente la reconexión TCP bloqueando el hilo de ejecución mediante un bucle while(true).",
      "Registrar un listener vacío sin código para deshabilitar las notificaciones de rebalanceo del broker."
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
      "Invocar el método **assign(Collections.singleton(new TopicPartition(\"security-logs\", 3)))** en lugar del método **subscribe()**, asignando estáticamente la partición deseada.",
      "Invocar **subscribe()** pasando una expresión regular que filtre únicamente la partición 3 con un group.id fijado en null.",
      "Establecer la propiedad de configuración **group.id=\"\"** (string vacío) y llamar a **poll()** normalmente.",
      "Modificar las ACLs del tópico para prohibir las operaciones de JoinGroup y SyncGroup al usuario del proceso forense."
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
      "Calcula la partición objetivo en el tópico **__consumer_offsets** con la fórmula **Math.abs(group.id.hashCode()) % offsets.topic.num.partitions** (por defecto 50); el broker que sea el líder de esa partición de **__consumer_offsets** es el Group Coordinator.",
      "Consulta la tabla de hash distribuida en el quórum de KRaft que asigna aleatoriamente un broker en cada llamada a poll().",
      "El Group Coordinator es siempre y de forma fija el broker con el identificador numérico más bajo (**broker.id=0**).",
      "El coordinador es elegido por el cliente consumidor seleccionando el broker con menor tiempo de ping de red ICMP."
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
      "Porque el modo Standalone se ejecuta en un único proceso de sistema operativo sin tolerancia a fallos (SPOF); si el proceso colapsa, todas las tareas se detienen sin posibilidad de auto-recuperación ni escalabilidad horizontal.",
      "Porque el modo Standalone no admite conectores de tipo Source, funcionando exclusivamente con conectores de tipo Sink.",
      "Porque el modo Standalone cifra obligatoriamente todos los mensajes con claves RSA de 4096 bits ralentizando el rendimiento.",
      "Porque el modo Standalone no permite conectarse a clústeres de Kafka que utilicen el quórum de KRaft."
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
      "Porque exige una partición única con política de compactación para garantizar una vista consistente con ordenamiento lineal total y cronológico estricto de todas las configuraciones de conectores en todos los workers del clúster.",
      "Porque Kafka Connect no admite balanceo de carga en tópicos que utilicen serializadores de texto JSON o Avro.",
      "Porque el broker líder de Kafka solo permite que el usuario del sistema connect-user escriba en la partición 0 de cualquier tópico interno.",
      "Porque tener más de una partición provocaría un bloqueo mutuo (deadlock) en la memoria del kernel de Linux al aplicar Zero-Copy."
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
      "Una Single Message Transform (SMT) utilizando la transformación **org.apache.kafka.connect.transforms.MaskField$Value** para reemplazar los dígitos de la tarjeta por una máscara o valor nulo antes de que el mensaje sea publicado en Kafka.",
      "Un nuevo listener de red en el broker configurado con **ssl.client.auth=required** y cifrado AES-GCM.",
      "Una regla de compatibilidad **FORWARD** en Confluent Schema Registry configurada para rechazar campos de tipo string.",
      "Un interceptor en el consumidor downstream que filtre los mensajes después de haber sido confirmados en disco."
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
      "Establecer **errors.tolerance=all**, definir **errors.deadletterqueue.topic.name=opensearch-dlq** y habilitar **errors.deadletterqueue.context.headers.enable=true** para registrar la causa del fallo en las cabeceras.",
      "Establecer **errors.tolerance=none** y aumentar **max.poll.interval.ms** a 600.000 ms en las propiedades del worker.",
      "Cambiar el deserializador del tópico a **ByteArrayDeserializer** y activar el parámetro **unclean.leader.election.enable=true**.",
      "Configurar una réplica standby de Kafka Connect con **connect.recovery.mode=auto-skip**."
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
      "El **Converter** traduce entre el formato binario de bytes almacenado en Kafka y el modelo de datos interno de Connect (**Connect Data API**); la **SMT** manipula la estructura o los campos del registro mientras este ya se encuentra en la memoria del worker.",
      "El **Converter** solo se ejecuta en conectores Sink, mientras que las **SMTs** solo son compatibles con conectores Source.",
      "El **Converter** realiza el enrutamiento de red entre los brokers, mientras que la **SMT** gestiona la retención y purga de segmentos en disco.",
      "Son términos sinónimos que pueden utilizarse indistintamente en el archivo connect-distributed.properties."
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
      "Los clics deben modelarse como un **KStream** (flujo de hechos continuos e independientes); las actualizaciones de perfil deben modelarse como una **KTable** (vista materializada del último estado por clave).",
      "Los clics deben modelarse como una **KTable** con retención de 1 hora; las actualizaciones de perfil deben modelarse como un **GlobalKTable** sin clave.",
      "Ambas fuentes deben modelarse obligatoriamente como **KStream**, ya que Kafka Streams no soporta semántica de actualización en memoria.",
      "Los clics deben modelarse como un **SessionWindow** y las actualizaciones de perfil como un **TumblingWindow** de 5 segundos."
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
      "Se violará el requisito obligatorio de co-particionado (**co-partitioning**), provocando resultados incompletos o una **TopologyException**; la solución es asegurar que ambos tópicos tengan exactamente el mismo número de particiones (12 particiones) o forzar un re-particionado del stream.",
      "Kafka Streams creará 3 réplicas virtuales del tópico customers en memoria RAM automáticamente sin ninguna configuración adicional ni penalización de I/O.",
      "El join funcionará perfectamente porque Kafka Streams ignora el número de particiones siempre que las claves coincidan en tipo de dato.",
      "El clúster de Kafka truncará las 12 particiones de orders a 4 particiones en el primer rebalanceo del grupo de streams."
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
      "Modelar el tópico de códigos postales como una **GlobalKTable**, la cual replica todas las particiones del tópico en el almacenamiento local de cada instancia de la aplicación, permitiendo joins por cualquier campo sin importar el particionado del stream.",
      "Utilizar un **SessionWindow** asimétrico con un buffer de memoria de 2 GB.",
      "Convertir el stream de transacciones en un **KGroupedStream** con particionamiento aleatorio por timestamp.",
      "Invocar el método **peek()** para guardar los códigos postales en un archivo temporal en /tmp/kafka."
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
      "El estado se guarda localmente en una base de datos embebida **RocksDB** respaldada por un **Changelog Topic interno compactado** en Kafka; configurando **num.standby.replicas=1** (o superior), otras instancias mantienen una réplica en caliente lista para asumir el control de inmediato sin esperar a reconstruir el estado.",
      "El estado se almacena exclusivamente en la memoria Heap de Java; ante una caída, Kafka Streams recupera los objetos leyendo el archivo core dump del sistema operativo.",
      "Kafka Streams escribe el estado directamente en una base de datos Cassandra externa mediante transacciones distribuidas XA.",
      "Se debe deshabilitar RocksDB y usar exclusivamente tablas volátiles en memoria configurando **state.store.type=none**."
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
      "Una ventana fija sin solapamiento (**Tumbling Window**) de 15 minutos de duración (**TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(15)))**.",
      "Una ventana con solapamiento (**Hopping Window**) con tamaño de 15 minutos y avance de 1 minuto.",
      "Una ventana basada en inactividad (**Session Window**) con gap de 15 minutos.",
      "Una ventana deslizante continua (**Sliding Window**) basada en la diferencia temporal entre eventos consecutivos."
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
      "El dashboard web requiere una **Push Query** (utilizando la cláusula **EMIT CHANGES** para mantener una suscripción abierta que emite eventos futuros de forma continua); el servicio telefónico requiere una **Pull Query** (consulta tipo request/response que devuelve el estado materializado actual de una tabla).",
      "Ambas necesidades deben resolverse exclusivamente mediante **Pull Queries** ejecutadas en un bucle polling HTTP cada 100 milisegundos.",
      "El dashboard requiere una **Pull Query** con retención de 30 días y el servicio telefónico una **Push Query** sin filtros WHERE.",
      "ksqlDB solo soporta consultas tipo batch ejecutadas mediante scripts de shell programados en cron."
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
      "Porque ksqlDB necesita saber qué campo del mensaje actúa como la clave primaria del registro de Kafka para evitar tener que re-particionar el tópico completo a través de la red al ejecutar la agregación o el join.",
      "Porque si no se define la clave, ksqlDB destruye todos los mensajes del tópico original en la primera ejecución.",
      "Porque los esquemas de Avro prohíben la lectura de campos sin clave mediante el protocolo HTTP REST.",
      "Porque ksqlDB no admite sentencias GROUP BY sobre campos que tengan tipo de dato numérico (BIGINT o INT)."
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
      "**SASL/SCRAM** (SCRAM-SHA-256 o SCRAM-SHA-512), el cual almacena las credenciales con salting y hashing criptográfico en los metadatos de Kafka (KRaft o ZK) y permite la creación y rotación dinámica de usuarios en caliente mediante la CLI **kafka-configs.sh**.",
      "**mTLS** (Mutual TLS), ya que no requiere almacenar claves privadas ni certificados en el cliente.",
      "**SASL/PLAIN** sin TLS, porque cifra las contraseñas en el kernel del broker mediante curvas elípticas.",
      "**Kerberos (SASL/GSSAPI)**, porque no necesita un servidor KDC centralizado para validar tickets."
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
      "El **Keystore** contiene la clave privada y el certificado digital propio del cliente para presentarse y demostrar su identidad ante el broker; el **Truststore** contiene los certificados de las Autoridades Certificadoras (CA) de confianza para verificar que el certificado presentado por el broker es legítimo.",
      "El **Keystore** contiene las contraseñas en texto claro de los tópicos; el **Truststore** contiene las reglas de autorización ACL del clúster.",
      "El **Truststore** cifra los mensajes en el disco del broker; el **Keystore** cifra el canal de red TCP entre ambos extremos.",
      "Ambos archivos cumplen exactamente la misma función y pueden intercambiarse o fusionarse sin ninguna configuración adicional."
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
      "Permisos de operación **Write** y **Describe** sobre el recurso **Topic:orders**, y permisos de operación **Write** y **Describe** sobre el recurso **TransactionalId:tx-order-01**.",
      "Permisos de operación **All** sobre el recurso **Cluster** y permisos de operación **Read** sobre el tópico **orders**.",
      "Únicamente permiso de operación **Write** sobre el recurso **Cluster**, ya que los permisos de tópico se heredan automáticamente.",
      "Permisos de operación **Read**, **Write** y **Delete** sobre el tópico interno **__transaction_state**."
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
      "El acceso será denegado inmediatamente con una **TopicAuthorizationException**, porque en el modelo de seguridad de Kafka las reglas de **DENY tienen precedencia absoluta** sobre cualquier regla de ALLOW coincidente.",
      "El acceso será permitido porque la regla de ALLOW especifica una IP exacta que es más granular que el comodín (*) de la regla de DENY.",
      "El acceso será permitido porque la regla 1 fue registrada en los metadatos antes que la regla 2.",
      "El clúster entrará en pánico y reiniciará el broker por inconsistencia de metadatos de autorización."
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
      "El Log Cleaner divide la partición en el **Tail** (segmentos limpios ya compactados) y el **Head** (segmentos sucios pendientes de compactar); construye un mapa de offsets recientes en RAM y purga los registros antiguos con claves repetidas en el Tail, mientras que el **segmento activo nunca es compactado**.",
      "El Log Cleaner compacta continuamente el segmento activo en tiempo real a medida que cada mensaje individual entra por el socket de red.",
      "El Log Cleaner fusiona todos los segmentos de la partición en un único archivo comprimido en formato tar.gz cada medianoche.",
      "La compactación requiere detener el broker y ejecutar un script de mantenimiento sin conexión (offline compaction)."
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
      "Porque debe garantizar que los consumidores que leen a un ritmo más lento (o que están temporalmente fuera de línea) tengan tiempo suficiente para observar el Tombstone y procesar la eliminación en sus bases de datos o cachés locales antes de que desaparezca del log.",
      "Porque el sistema de archivos ext4 de Linux no permite borrar archivos que contengan valores nulos hasta que se ejecute fsck.",
      "Porque el protocolo KRaft necesita 24 horas para sincronizar los marcadores de borrado con los controladores standby.",
      "Porque el broker reintenta reenviar el payload original al productor durante 24 horas por si se trató de un borrado accidental."
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
      "Significa que 18 particiones tienen una o más réplicas follower que se han desfasado del líder y han sido expulsadas del ISR; las causas típicas incluyen un broker caído, saturación severa de red o discos excesivamente lentos en un nodo.",
      "Significa que 18 particiones se han borrado accidentalmente del sistema de archivos del broker.",
      "Significa que 18 consumidores han superado el parámetro max.poll.interval.ms y están generando un rebalanceo.",
      "Significa que 18 productores están enviando mensajes con acks=0 saturando los sockets de red."
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
      "El valor saludable debe ser **exactamente 1**; si es **0**, no hay ningún controlador activo y las operaciones administrativas (creación de tópicos, rebalanceo de réplicas) están bloqueadas; si es **> 1** (en ZooKeeper), indica una situación catastrófica de Split-Brain.",
      "El valor debe ser igual al número total de brokers (ej. 10 si hay 10 brokers) para asegurar que todos participen en el control.",
      "El valor debe ser 0 en condiciones normales, activándose en 1 únicamente cuando ocurre una caída de broker.",
      "El valor debe coincidir con el número de particiones del tópico interno @metadata."
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
      "Los hilos de procesamiento de peticiones (**num.io.threads**) del broker están saturados al 94 % de su capacidad procesando I/O de disco o peticiones de clientes; el broker está al borde del colapso por saturación de recursos.",
      "El broker está completamente ocioso y apagará los hilos de red para ahorrar energía en el centro de datos.",
      "Los consumidores están cometiendo errores de autenticación SSL en el 94 % de las conexiones.",
      "El recolector de basura de la JVM ha finalizado el 94 % de los ciclos de recolección de memoria joven."
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
      "Separa la computación del almacenamiento descargando automáticamente los segmentos cerrados antiguos hacia almacenamiento de objetos masivo y económico (S3, GCS, Azure Blob), conservando solo los segmentos activos recientes en discos locales rápidos; al reasignar particiones, solo se copian los datos locales calientes, reduciendo el tiempo de migración de semanas a minutos.",
      "Comprime los datos históricos utilizando algoritmos de deduplicación cuántica en la memoria RAM del controlador KRaft.",
      "Mueve los mensajes antiguos a cintas magnéticas físicas controladas por robots de centros de datos.",
      "Convierte los tópicos antiguos en vistas SQL de solo lectura en un clúster de Apache Spark externo."
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
      "Porque Kafka depende de forma intensiva del **PageCache del kernel de Linux** para almacenar en caché los segmentos de log y ejecutar transferencias Zero-Copy con sendfile(); un heap de 60 GB provocaría pausas gigantescas de Garbage Collection y privaría al sistema operativo de RAM para el PageCache, forzando a que las lecturas toquen constantemente los discos físicos.",
      "Porque la JVM de Java no es capaz de direccionar más de 32 GB de memoria bajo arquitecturas de 64 bits.",
      "Porque Kafka almacena todos los índices y registros en el espacio de intercambio Swap de Linux por diseño.",
      "Porque KRaft exige que el heap del broker sea exactamente igual a la mitad de los hilos de CPU del servidor."
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
      "Se configura **SASL/OAUTHBEARER**; los clientes obtienen un token JWT del proveedor OpenID Connect (IdP) y lo presentan al broker; el broker valida la firma criptográfica usando las claves públicas del IdP (JWKS) y monitoriza la expiración del token para forzar la re-autenticación o cierre de sesión.",
      "Se configura **SASL/PLAIN** con un script que consulta la API de Okta cada 5 milisegundos mediante webhooks.",
      "Se utiliza una regla de compatibilidad en Schema Registry que convalida el encabezado Authorization de cada registro.",
      "Se configuran ACLs con el prefijo Bearer en la herramienta kafka-acls.sh para simular OAuth."
    ],
    "a": 0,
    "e": "**SASL/OAUTHBEARER** es el estándar de Kafka para federación de identidades mediante OAuth 2.0 y OpenID Connect. El cliente solicita un token firmado (JWT) a su Authorization Server / IdP y se autentica contra el broker presentando dicho token. El broker valida el token contra el endpoint JWKS del IdP. Además, el broker rastrea el tiempo de expiración (**exp**) del JWT: al vencer el token, Kafka exige una re-autenticación automática o desconecta al cliente si este no renueva su credencial."
  }
],
    why: {
  "q-1": [
    "",
    "Mezclar roles (broker,controller) en 100 nodos degrada severamente el consenso Raft por contención de I/O de disco y pausas de GC causadas por el tráfico masivo de datos de los brokers.",
    "Tener un único controlador introduce un punto único de fallo (SPOF) absoluto: si ese nodo cae, el clúster queda totalmente incapacitado para coordinar particiones o atender metadatos.",
    "Los sistemas basados en quórum como Raft exigen un número impar de nodos (3 o 5); un número par como 4 no incrementa la tolerancia a fallos frente a 3 nodos y empeora la resolución de empates (split-brain)."
  ],
  "q-2": [
    "",
    "El nivel **isolation.level=read_uncommitted** no permite leer más allá del High Watermark; solo permite leer mensajes de transacciones no committeadas que ya hayan alcanzado el HW.",
    "La configuración de **acks** del productor no modifica la regla del consumidor: ningún mensaje es visible para los consumidores antes de ser replicado en el ISR hasta el High Watermark.",
    "Por defecto, los consumidores leen del líder de la partición independientemente de la AZ, salvo que se active explícitamente **replica.selector.class** y Rack-Aware Fetching."
  ],
  "q-3": [
    "",
    "El líder no detiene las escrituras de los productores si aún se cumple **min.insync.replicas**; simplemente continúa aceptando tráfico con el ISR restante.",
    "Una partición solo entra en estado Offline si no queda ningún líder disponible o no se puede elegir un nuevo líder tras una caída del broker líder.",
    "Un líder jamás cede el liderazgo a una réplica rezagada que no está respondiendo a las peticiones de sincronización; eso destruiría la consistencia del log."
  ],
  "q-4": [
    "",
    "Los consumidores no se bloquean: pueden continuar leyendo con total normalidad todos los registros previamente confirmados hasta el último High Watermark.",
    "Kafka nunca degrada silenciosamente una configuración estricta como **acks=all** a **acks=1**; violar las garantías de durabilidad pactadas está estrictamente prohibido por diseño.",
    "Kafka no crea brokers al vuelo en 5 segundos sin intervención externa ni auto-escalado de infraestructura; arroja una excepción limpia al cliente productor."
  ],
  "q-5": [
    "",
    "Con **unclean.leader.election.enable=false**, el controlador tiene estrictamente prohibido elegir réplicas fuera del ISR como líder para evitar la pérdida silenciosa de datos.",
    "Kafka no inventa particiones vacías para enmascarar la indisponibilidad de datos históricos confirmados.",
    "Los nodos controller de KRaft gestionan metadatos del clúster; no alojan particiones de datos de usuario ni actúan como réplicas de datos de tópicos ordinarios."
  ],
  "q-6": [
    "",
    "KRaft no mantiene particiones secretas de backup de mensajes perdidos; los mensajes no replicados en el nuevo líder se truncan y desaparecen para siempre del log.",
    "Los consumidores no reciben **CorruptRecordException**; simplemente leen el nuevo log truncado sin saber que faltan transacciones históricas intermedias.",
    "El nuevo líder acepta escrituras inmediatamente sin exigir compactación manual ni herramientas auxiliares."
  ],
  "q-7": [
    "",
    "Kafka no utiliza SQLite ni bases de datos relacionales embebidas para indexar mensajes; su diseño se basa puramente en archivos planos en el sistema de archivos.",
    "El archivo **.timeindex** se utiliza para búsquedas temporales (timestamps), no para resolver peticiones estándar por offset numérico.",
    "Descomprimir gigabytes de logs en el heap de la JVM destruiría el rendimiento del broker por saturación de memoria y pausas catastróficas de Garbage Collection."
  ],
  "q-8": [
    "",
    "La retención en Kafka es un proceso completamente autónomo del broker que no requiere confirmación ni comandos de borrado por parte de los consumidores.",
    "La retención por tiempo (**retention.ms**) funciona tanto en tópicos con política **delete** como en modo híbrido **compact,delete**.",
    "El broker no suspende las tareas de retención basándose en el porcentaje de espacio libre en disco; sigue estrictamente los umbrales configurados."
  ],
  "q-9": [
    "",
    "Raft no exige que el 100 % de los nodos estén activos; está diseñado precisamente para tolerar fallos manteniendo el quórum de mayoría.",
    "Un quórum de 5 nodos con solo 2 nodos vivos no puede operar porque 2 no representa una mayoría estricta de 5 (se requieren 3).",
    "Raft utiliza la regla de mayoría simple (más del 50 % de votos), no una mayoría calificada del 80 % ni requiere 4 de 5 nodos para confirmar escrituras en @metadata."
  ],
  "q-10": [
    "",
    "Múltiples listeners resuelven la conectividad de red y el enrutamiento de clientes, pero no informan al asignador de particiones de Kafka sobre la topología física de racks.",
    "El particionador de los clientes determina a qué partición va un mensaje según su clave, no en qué brokers físicos residen las réplicas de esa partición.",
    "El parámetro **min.insync.replicas** define el número mínimo de confirmaciones requeridas, pero no controla en qué servidores o zonas se ubican las réplicas."
  ],
  "q-11": [
    "",
    "Kafka no permite que dos consumidores del mismo grupo procesen en paralelo la misma partición; cada partición se asigna a una sola instancia dentro del grupo.",
    "Tener más consumidores que particiones no arroja ninguna excepción; es un estado perfectamente legal donde los miembros sobrantes quedan en modo standby.",
    "Los pods adicionales no leen de forma redundante ni generan duplicados; simplemente no reciben ninguna partición asignada por el Group Coordinator."
  ],
  "q-12": [
    "",
    "El uso de **mmap()** con **read()** y **write()** fuerza la copia de los datos al espacio de usuario, perdiendo las ventajas del bypass de kernel que ofrece Zero-Copy.",
    "Kafka no usa librerías de compresión del kernel en el broker para transferir paquetes por la red; los mensajes se transmiten comprimidos tal como los envió el productor.",
    "Los discos NVMe no procesan paquetes TCP/IP de forma autónoma sin pasar por el stack de red del kernel del sistema operativo."
  ],
  "q-13": [
    "",
    "Configurar **acks=1** en transferencias bancarias expone al sistema a pérdida de datos si el líder colapsa antes de replicar a los followers.",
    "Configurar **acks=0** en un sistema financiero significa que el productor no espera ninguna confirmación, tolerando pérdida masiva ante caídas.",
    "No existe el valor numérico **acks=2** en el protocolo de Kafka; los valores válidos de confirmación son únicamente 0, 1 y all (o -1)."
  ],
  "q-14": [
    "",
    "Kafka no utiliza Redis ni cálculos de hash SHA-256 en memoria para deduplicar mensajes de productores; utiliza PIDs y Sequence Numbers nativos del protocolo.",
    "El broker no descarta mensajes por tener timestamps repetidos; múltiples eventos legítimos pueden ocurrir en el mismo milisegundo.",
    "El protocolo de Kafka no interactúa ni depende de niveles de aislamiento de bases de datos relacionales como Serializable para la idempotencia de red."
  ],
  "q-15": [
    "",
    "Kafka no bloquea la conexión TCP esperando ACKs individuales cuando **max.in.flight.requests > 1**; procesa peticiones en pipeline asíncrono.",
    "El particionador selecciona la partición en base a la clave del mensaje, no en función del número de peticiones en vuelo concurrentes.",
    "El quórum de KRaft coordina los metadatos del clúster, no reordena los mensajes de datos en vuelo que envían los productores hacia los brokers."
  ],
  "q-16": [
    "",
    "El Transaction Coordinator no bloquea el clúster entero ni congela a otros productores; las transacciones en Kafka son concurrentes y no bloqueantes a nivel de partición.",
    "Los mensajes transaccionales se escriben inmediatamente en el commit log de disco del broker; no se mantienen flotando exclusivamente en la memoria RAM.",
    "El Transaction Coordinator no emite tokens OAuth para autorizar mensajes; gestiona el estado y marcadores atómicos del Two-Phase Commit."
  ],
  "q-17": [
    "",
    "El broker no borra físicamente del disco los mensajes abortados de inmediato; simplemente escribe un marcador ABORT al final de la partición.",
    "El consumidor no lanza **TransactionAbortedException**; en modo **read_uncommitted** simplemente devuelve todos los mensajes sin distinguir si fueron abortados.",
    "El payload de los mensajes abortados permanece intacto en disco; no se convierte en Tombstones con valor null."
  ],
  "q-18": [
    "",
    "El primer mensaje no se envía en 0 ms si **linger.ms > 0** y no se ha llenado el batch; el productor espera deliberadamente a ver si llegan más registros.",
    "El mensaje nunca se queda bloqueado indefinidamente; el propósito de **linger.ms** es precisamente forzar la transmisión una vez cumplido el límite de tiempo.",
    "El parámetro **request.timeout.ms** mide el tiempo máximo de espera de respuesta del broker tras enviar el paquete por red, no el tiempo de buffering local."
  ],
  "q-19": [
    "",
    "El broker no ejecuta la compresión ni la descompresión en el flujo regular de datos; hacerlo saturaría la CPU del servidor con miles de clientes.",
    "La compresión es una función a nivel de aplicación en la JVM/SDK de Kafka, no una característica delegada a aceleradores de hardware de red TCP.",
    "El broker no necesita descomprimir el log para indexar offsets; calcula el offset relativo basándose en el número de registros declarados en la cabecera del lote."
  ],
  "q-20": [
    "",
    "El Sticky Partitioner no envía todos los mensajes a la partición 0 permanentemente; va rotando de partición a medida que llena lotes sucesivos.",
    "El cliente no genera UUIDs falsos para particionar; la clave sigue siendo null y la lógica de rotación de lotes se encarga del reparto equilibrado.",
    "El Sticky Partitioner utiliza buffers estándar en memoria y conexiones TCP con el protocolo nativo de Kafka, no llamadas HTTP/2 independientes."
  ],
  "q-21": [
    "",
    "Los primeros 5 bytes no corresponden a un checksum CRC32; son el Magic Byte de protocolo y el Schema ID que referencia a Schema Registry.",
    "El broker ID y la partición no se insertan en el payload del mensaje; residen en las cabeceras a nivel de protocolo de red de Kafka.",
    "El timestamp del mensaje tiene su propio campo dedicado en la cabecera del registro de Kafka según KIP-32, no en los primeros 5 bytes del payload."
  ],
  "q-22": [
    "",
    "Actualizar primero los productores en modo BACKWARD provoca que los consumidores antiguos fallen con **SerializationException** al encontrar campos nuevos que no conocen.",
    "Detener todo el clúster y purgar datos no es una estrategia de producción tolerada y destruye el desacoplamiento que ofrece Kafka.",
    "El modo BACKWARD sí permite añadir campos nuevos, siempre y cuando estos campos tengan definido un valor por defecto (**default**)."
  ],
  "q-23": [
    "",
    "El modo FORWARD solo permite desplegar productores primero y consumidores después; no ofrece compatibilidad bidireccional simétrica.",
    "El modo NONE desactiva por completo la validación de compatibilidad, provocando fallos impredecibles en tiempo de ejecución por esquemas corruptos.",
    "No existe un parámetro llamado **allow.any.order=true** en la configuración de Schema Registry; el comportamiento lo define el modo de compatibilidad del subject."
  ],
  "q-24": [
    "",
    "Kafka nunca redistribuye ni mueve mensajes históricos existentes cuando se añaden nuevas particiones; los datos viejos permanecen en sus particiones originales.",
    "Los productores no arrojan **SerializationException**; simplemente refrescan sus metadatos de particiones y continúan calculando el hash con el nuevo divisor.",
    "Kafka no almacena un índice histórico de claves en el archivo meta.properties; el enrutamiento es puramente una función matemática de hashing en el cliente."
  ],
  "q-25": [
    "",
    "Los mensajes no se dividen entre ambos grupos: cada grupo con distinto **group.id** recibe su propia copia completa e independiente de todos los mensajes (Pub/Sub).",
    "Tener 4 consumidores para 12 particiones no deja particiones sin consumir; cada consumidor recibe 3 particiones asignadas.",
    "Las instancias del grupo fraud-app no se limitan a 4; el número de consumidores activos útiles de un grupo está determinado únicamente por las particiones del tópico (12)."
  ],
  "q-26": [
    "",
    "La opción descrita corresponde a **auto.offset.reset=latest**, que solo lee mensajes producidos después del inicio del consumidor.",
    "**NoOffsetForPartitionException** solo se arroja cuando **auto.offset.reset=none** y no existe un offset registrado para el grupo.",
    "El consumidor no ignora el historial por memoria RAM; procesa secuencialmente leyendo del disco o del PageCache según el offset configurado."
  ],
  "q-27": [
    "",
    "Los mensajes no se pierden en este escenario porque el auto-commit aún no había ocurrido; los offsets no se habían avanzado en el broker.",
    "Kafka no coordina transacciones XA distribuidas con motores de bases de datos externas de forma automática.",
    "El broker no adivina cuántos registros procesó la aplicación localmente; solo avanza el offset cuando recibe una petición explícita de commit."
  ],
  "q-28": [
    "",
    "**commitAsync()** es estrictamente no bloqueante; los reintentos en su callback no detienen el hilo principal pero sí corrompen la coherencia de los offsets.",
    "Kafka soporta perfectamente callbacks en operaciones asíncronas de su SDK; el peligro radica en la inversión del orden cronológico de commits concurrentes.",
    "Los commits asíncronos no requieren validaciones de certificados mTLS adicionales más allá de la autenticación estándar de la sesión."
  ],
  "q-29": [
    "",
    "El hilo de heartbeats mantiene la conectividad de red, pero Kafka separa la liveness de procesamiento: si no se llama a **poll()** antes de **max.poll.interval.ms**, el cliente se expulsa a sí mismo.",
    "El broker no cierra la conexión TCP a los 60 segundos por lentitud del consumidor; es el propio cliente el que detecta el vencimiento y se desconecta.",
    "Kafka no divide batches ni reasigna fragmentos de lotes ya transmitidos a un consumidor mediante Zero-Copy."
  ],
  "q-30": [
    "",
    "**session.timeout.ms** no controla el tiempo de procesamiento del lote; esa responsabilidad recae exclusivamente en **max.poll.interval.ms**.",
    "**heartbeat.interval.ms** es un temporizador del cliente hacia el broker, no del broker hacia el cliente, y nunca debe ser igual a session.timeout.ms.",
    "Estos parámetros siguen siendo totalmente vigentes y fundamentales en todas las versiones modernas de Apache Kafka y Confluent Platform."
  ],
  "q-31": [
    "",
    "El protocolo cooperativo no elimina los rebalanceos ni usa IPs compartidas; sigue coordinando la asignación de particiones a nivel de miembros del grupo.",
    "Kafka Streams y los consumidores no utilizan mutexes globales distribuidos para ordenar todas las particiones del clúster entre sí.",
    "La coordinación de grupos en Kafka se ejecuta nativamente en los brokers mediante el Group Coordinator, sin intermediación de Redis."
  ],
  "q-32": [
    "",
    "Static Membership no convierte a los pods en réplicas de solo lectura de Kubernetes ni cambia la forma en que el consumidor lee de Kafka.",
    "Kubernetes no congela el tráfico HTTP externo basándose en offsets de Kafka al desplegar pods con Static Membership.",
    "El estado del grupo se coordina a través del broker de Kafka, no mediante carpetas compartidas en volúmenes NFS."
  ],
  "q-33": [
    "",
    "**seekToBeginning()** reinicia la lectura al inicio del log de la partición, lo que generaría un bucle infinito de reprocesamiento.",
    "Configurar **auto.commit.interval.ms=1** no garantiza atomicidad por registro y degrada severamente el rendimiento con peticiones continuas a red.",
    "Pausar particiones con **pause()** detiene temporalmente la entrega de mensajes en el siguiente poll(), pero no realiza ningún commit de offsets."
  ],
  "q-34": [
    "",
    "El método **onPartitionsAssigned()** notifica qué particiones se han recibido; truncar el log del broker destruiría los datos de todos los clientes.",
    "**onPartitionsLost()** se invoca cuando las particiones ya se perdieron de forma irrecuperable; un bucle infinito colapsaría la aplicación.",
    "Dejar un listener vacío no deshabilita los rebalanceos del clúster; solo impide que la aplicación limpie su estado y guarde offsets a tiempo."
  ],
  "q-35": [
    "",
    "El método **subscribe()** con regex no admite un **group.id** nulo y siempre activa el protocolo dinámico de Consumer Groups.",
    "Configurar un **group.id** vacío o nulo en un consumidor que utiliza **subscribe()** arroja una excepción de configuración inválida.",
    "Bloquear permisos de JoinGroup con ACLs impediría el funcionamiento de la aplicación en lugar de permitirle leer particiones de forma estática."
  ],
  "q-36": [
    "",
    "El Group Coordinator no se asigna aleatoriamente en cada llamada a poll(); es un broker fijo determinado determinísticamente por el hash del group.id.",
    "El coordinador no es necesariamente el broker 0; en un clúster con decenas de brokers, los coordinadores se reparten entre todos los nodos.",
    "El cliente no escoge su coordinador por ping ICMP; consulta los metadatos del clúster enviando una petición **FindCoordinatorRequest**."
  ],
  "q-37": [
    "",
    "El modo Standalone sí admite conectores tanto Source como Sink; su incapacidad radica en la falta de alta disponibilidad, tolerancia a fallos y escalabilidad.",
    "Kafka Connect no fuerza el cifrado RSA en modo Standalone; el cifrado depende de la configuración de red TLS del listener.",
    "El modo Standalone es compatible a nivel de cliente con clústeres KRaft, pero no es apto para producción por ser un punto único de fallo (SPOF)."
  ],
  "q-38": [
    "",
    "Kafka Connect soporta nativamente serializadores JSON, Avro y Protobuf independientemente del número de particiones de sus tópicos de datos.",
    "Los permisos de escritura de los tópicos se controlan mediante ACLs estándar, no por el número de partición física.",
    "Tener múltiples particiones no genera un bloqueo en el kernel de Linux por Zero-Copy; el impedimento es la pérdida de orden total de configuraciones."
  ],
  "q-39": [
    "",
    "Cifrar el canal con TLS protege los datos en tránsito frente a intercepciones en la red, pero el dato confidencial seguiría escribiéndose sin enmascarar en el disco de Kafka.",
    "Schema Registry valida la compatibilidad y tipos de datos del esquema, no enmascara activamente contenidos de campos confidenciales.",
    "Filtrar en el consumidor downstream es una violación grave de PCI-DSS, ya que el número de tarjeta ya habría quedado almacenado en el log de Kafka de forma insegura."
  ],
  "q-40": [
    "",
    "**errors.tolerance=none** es la configuración por defecto que detiene la tarea ante el primer error; no permite continuar el procesamiento ni desviar registros a la DLQ.",
    "Cambiar a ByteArrayDeserializer no corrige un JSON inválido al indexar en OpenSearch y unclean leader election no guarda relación con errores de datos en Connect.",
    "No existe un parámetro llamado **connect.recovery.mode=auto-skip** en el framework oficial de Apache Kafka Connect."
  ],
  "q-41": [
    "",
    "Tanto los Converters como las SMTs operan en ambos tipos de conectores (Source y Sink) en diferentes etapas del ciclo de vida del registro.",
    "El enrutamiento de red y la gestión de segmentos en disco son responsabilidades del protocolo TCP y del broker de Kafka, no de los componentes de Connect.",
    "No son sinónimos: el Converter maneja la serialización/deserialización binaria, mientras que la SMT aplica lógica de transformación sobre la estructura de datos."
  ],
  "q-42": [
    "",
    "Modelar millones de clics como una KTable causaría que cada clic sobrescriba los clics previos del mismo usuario, perdiendo el historial completo de eventos.",
    "Kafka Streams soporta plenamente semántica de actualización de estado mediante KTable y State Stores locales.",
    "Las ventanas temporales (Session y Tumbling) son operaciones de agregación con estado, no abstracciones básicas para modelar flujos de entrada continuos."
  ],
  "q-43": [
    "",
    "Kafka Streams no triplica réplicas mágicamente en memoria sin consumir recursos; exige co-particionado físico o fuerza un costoso paso de re-partición.",
    "Kafka Streams no ignora las particiones: las particiones determinan la asignación de StreamTasks a los hilos de ejecución locales.",
    "El clúster de Kafka no trunca particiones existentes de un tópico de datos durante un rebalanceo de Kafka Streams."
  ],
  "q-44": [
    "",
    "Las ventanas de sesión no sustituyen el modelo de tablas de referencia y aumentar el buffer no resuelve el desacoplamiento de particiones.",
    "Agrupar con **KGroupedStream** con particionamiento aleatorio destruiría la correlación por clave necesaria para el join.",
    "El método **peek()** es una función auxiliar de depuración sin efectos secundarios; no almacena tablas en el sistema de archivos /tmp."
  ],
  "q-45": [
    "",
    "El estado no reside únicamente en el heap de Java; almacenar grandes estados en el heap generaría pausas inmanejables de Garbage Collection.",
    "Kafka Streams no requiere ni utiliza bases de datos externas como Cassandra para persistir el estado de sus topologías.",
    "Deshabilitar los state stores impediría ejecutar operaciones agregadas con ventana o joins que requieran mantener estado histórico."
  ],
  "q-46": [
    "",
    "Una Hopping Window avanza con solapamiento, por lo que un mismo evento pertenecería a múltiples ventanas consecutivas.",
    "Una Session Window se define por periodos dinámicos de inactividad, no por bloques de tiempo rígidos de 15 minutos en el reloj.",
    "Una Sliding Window se calcula en base a la distancia relativa en milisegundos entre pares de eventos, no en bloques fijos discretos."
  ],
  "q-47": [
    "",
    "Hacer polling HTTP intensivo con Pull Queries cada 100 ms genera sobrecarga masiva y contradice el modelo reactivo de streaming que ofrece ksqlDB.",
    "Las Push Queries no se usan para consultas puntuales request/response como el saldo telefónico, sino para flujos reactivos continuos.",
    "ksqlDB está diseñado específicamente para streaming en tiempo real y procesamiento continuo de eventos, no únicamente para procesos batch por cron."
  ],
  "q-48": [
    "",
    "ksqlDB nunca borra ni destruye los datos del tópico subyacente de Kafka si no se define la clave; simplemente los lee sin asignación de clave primaria.",
    "Schema Registry y Avro soportan perfectamente mensajes que no tengan clave definida (key=null).",
    "ksqlDB admite agregaciones GROUP BY sobre cualquier tipo de dato válido (incluyendo BIGINT, INT, VARCHAR)."
  ],
  "q-49": [
    "",
    "mTLS exige generar, distribuir y renovar certificados digitales y claves privadas X.509 en cada máquina cliente, lo cual no es una gestión de contraseñas dinámicas nativas en Kafka.",
    "SASL/PLAIN transmite contraseñas en texto claro; no utiliza curvas elípticas en el kernel y es inseguro si no se encapsula dentro de TLS.",
    "Kerberos (SASL/GSSAPI) requiere obligatoriamente una infraestructura compleja de KDC (Key Distribution Center) y Active Directory."
  ],
  "q-50": [
    "",
    "Ni el Keystore ni el Truststore almacenan contraseñas de tópicos ni reglas de autorización de ACLs; su propósito es estrictamente criptográfico para TLS.",
    "El Truststore no cifra el disco del broker; el cifrado en reposo lo gestiona el sistema operativo o plugins de almacenamiento, no el truststore de Java.",
    "No son intercambiables: el Keystore guarda claves privadas secretas que nunca deben compartirse; el Truststore contiene certificados públicos de confianza de CAs."
  ],
  "q-51": [
    "",
    "Conceder permisos All sobre Cluster y Read sobre Topic viola gravemente el principio de menor privilegio y da facultades administrativas innecesarias al productor.",
    "Los permisos de escritura de tópicos no se heredan mágicamente de permisos sobre el recurso Cluster; deben declararse explícitamente.",
    "Los clientes jamás deben tener permisos directos sobre el tópico interno **__transaction_state**; ese tópico lo gestiona únicamente el Transaction Coordinator."
  ],
  "q-52": [
    "",
    "En Kafka, la granularidad de la IP de host no anula un DENY; cualquier coincidencia con un DENY bloquea el acceso de forma inapelable.",
    "El orden temporal en que se registran las ACLs no influye en la evaluación; el authorizer agrupa y evalúa DENY antes que cualquier ALLOW.",
    "Tener reglas simultáneas de ALLOW y DENY es común en producción y está completamente contemplado por el authorizer de Kafka; no causa ningún reinicio ni pánico."
  ],
  "q-53": [
    "",
    "El Log Cleaner nunca compacta el segmento activo en tiempo real; el segmento activo es append-only puro para mantener baja latencia de escritura.",
    "Kafka no comprime los segmentos en archivos tar.gz ni cambia la estructura de los archivos .log y .index durante la compactación.",
    "La compactación de logs es un proceso continuo que se ejecuta en segundo plano en caliente sin requerir detener el broker ni mantenimiento offline."
  ],
  "q-54": [
    "",
    "El sistema de archivos ext4 no tiene ninguna limitación respecto a escribir valores nulos; la retención es una regla lógica de la arquitectura de Kafka.",
    "KRaft no requiere 24 horas para sincronizar metadatos; el retraso existe exclusivamente para proteger a los consumidores de datos downstream.",
    "Kafka no intenta reenviar payloads eliminados al productor; los mensajes se tratan como unidireccionales desde el cliente hacia el broker."
  ],
  "q-55": [
    "",
    "UnderReplicatedPartitions no significa que las particiones hayan sido borradas del disco; las particiones existen pero han perdido copias en el ISR.",
    "La lentitud de los consumidores se refleja en la métrica de **consumer lag**, no en las particiones sub-replicadas de los brokers.",
    "Los productores con acks=0 no afectan directamente al conjunto del ISR salvo si saturan tanto la red que impiden los fetch requests de los followers."
  ],
  "q-56": [
    "",
    "Tener un controlador por cada broker significaría una anarquía sin consenso; en todo momento debe haber exactamente 1 único líder del quórum.",
    "El controlador debe estar permanentemente activo para atender metadatos y cambios de partición, no solo cuando un broker se cae.",
    "El número de controladores no tiene ninguna relación con las particiones del tópico interno @metadata."
  ],
  "q-57": [
    "",
    "Una caída en el porcentaje de tiempo ocioso significa saturación extrema, no que el broker esté inactivo o apagando hilos.",
    "Los errores de autenticación SSL se reflejan en métricas de conexiones fallidas, no en la utilización de los hilos de I/O de atención de peticiones.",
    "La métrica RequestHandlerAvgIdlePercent mide hilos de atención de peticiones del broker, no las estadísticas del recolector de basura de la JVM."
  ],
  "q-58": [
    "",
    "Tiered Storage no utiliza compresión cuántica ni almacena datos en la RAM del controlador; utiliza almacenamiento de objetos estándar en la nube.",
    "No se basa en cintas magnéticas físicas operadas por robots, sino en servicios de Cloud Object Storage accesibles mediante APIs REST seguras.",
    "No convierte los tópicos en vistas de Apache Spark; Kafka continúa sirviendo las lecturas transparentemente a través de la misma API de consumidor."
  ],
  "q-59": [
    "",
    "La JVM de 64 bits puede direccionar terabytes de memoria RAM; el problema de asignar 60 GB es la ineficiencia de GC y la privación del PageCache.",
    "Kafka nunca utiliza el espacio Swap de disco; de hecho, en producción se recomienda encarecidamente deshabilitar o minimizar la swap (vm.swappiness=1).",
    "El tamaño del heap de la JVM no está vinculado matemáticamente con el número de núcleos de CPU de la máquina."
  ],
  "q-60": [
    "",
    "SASL/PLAIN no soporta tokens JWT ni validación de firmas criptográficas con JWKS de proveedores OpenID Connect.",
    "Schema Registry valida esquemas de datos del cuerpo del mensaje, no credenciales de autenticación a nivel de conexión de transporte.",
    "Las ACLs gestionan autorización una vez que el cliente ya está autenticado; no sustituyen el mecanismo de autenticación SASL/OAUTHBEARER."
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
