/* =========================================================================
   data/databricks-de/exam.js — Databricks Certified Data Engineer Associate
   50 preguntas de escenario realista, 10 topics, 25 términos de glosario y WHY por opción.
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["databricks-de"] = {
  "id": "databricks-de",
  "appId": "databricks-de",
  "provider": "Databricks",
  "badge": "Databricks · Data Eng",
  "icon": "🧱",
  "color": "#e02424",
  "featured": true,
  "title": "Databricks · Data Engineer Associate",
  "subtitle": "Lakehouse, Delta Lake, Medallion Architecture, Auto Loader, Workflows y Unity Catalog",
  "passingScore": 70,
  "domains": {
    "1": "Databricks Lakehouse Platform (24 %)",
    "2": "ELT con Spark SQL y Python (29 %)",
    "3": "Procesamiento Incremental y DLT (22 %)",
    "4": "Pipelines en Producción y Workflows (16 %)",
    "5": "Gobernanza de Datos con Unity Catalog (9 %)"
  },
  "shortDomains": {
    "1": "Lakehouse & Delta",
    "2": "ELT & Spark",
    "3": "Streaming & DLT",
    "4": "Workflows",
    "5": "Unity Catalog"
  },
  "topics": [
    {
      "id": "dbd-t-1-1",
      "d": 1,
      "title": "1.1 · Arquitectura Lakehouse y Modelo Medallion (Bronze, Silver, Gold)",
      "html": "\n<h4>Fundamentos del Lakehouse: Convergencia de Data Lake y Data Warehouse</h4>\n<p>El paradigma <b>Databricks Lakehouse</b> elimina los silos de datos tradicionales unificando la escalabilidad y bajo coste del almacenamiento de objetos en la nube (AWS S3, Azure ADLS Gen2, GCP Cloud Storage) con las garantías de confiabilidad, rendimiento y gobernanza de un Data Warehouse corporativo. Se fundamenta en formatos abiertos como <b>Apache Parquet</b> combinados con una capa de metadatos transaccional ACID provista por <b>Delta Lake</b>.</p>\n<ul>\n  <li><b>Separación de cómputo y almacenamiento:</b> Permite escalar la infraestructura de cálculo de forma elástica e independiente del volumen de datos almacenado, aprovisionando clústeres efímeros según la demanda.</li>\n  <li><b>Almacenamiento abierto y estándar:</b> Evita el bloqueo de proveedor (vendor lock-in) al guardar los datos físicos en ficheros Parquet estandarizados accesibles mediante múltiples motores.</li>\n  <li><b>Soporte unificado de cargas de trabajo:</b> Facilita sobre una única copia física de los datos la ejecución simultánea de Business Intelligence (BI), SQL analítico, streaming en tiempo real y Machine Learning.</li>\n</ul>\n\n<h4>La Arquitectura Medallion (Bronze &rarr; Silver &rarr; Gold)</h4>\n<p>El diseño Medallion estructura el refinamiento progresivo de los datos a lo largo de tres capas lógicas para asegurar calidad y gobierno desde la ingesta hasta el consumo analítico:</p>\n<table class=\"keytable\">\n<tr><th>Capa</th><th>Propósito Técnico</th><th>Transformaciones Clave</th><th>Consumidores Principales</th></tr>\n<tr><td><b>Bronze (Raw)</b></td><td>Zona de aterrizaje append-only de datos en bruto procedentes de sistemas fuente (APIs, logs, bases de datos OLTP).</td><td>Conservación del formato original o JSON crudo, añadido de metadatos de ingestión (<code>_rescued_data</code>, timestamp de carga, fichero origen).</td><td>Data Engineers, pipelines de re-procesamiento y auditoría técnica.</td></tr>\n<tr><td><b>Silver (Curada)</b></td><td>Vista empresarial limpia, conformada y estandarizada; punto único de verdad de las entidades de negocio.</td><td>Filtrado de nulos críticos, deduplicación, tipado estricto, enriquecimientos con joins de referencia y normalización.</td><td>Data Engineers, Data Scientists para exploración y feature engineering.</td></tr>\n<tr><td><b>Gold (Negocio)</b></td><td>Capa de consumo analítico de alto rendimiento con datos agregados y modelados según las necesidades de negocio.</td><td>Agregaciones temporales, métricas de KPI, esquemas dimensionales (estrella / copo de nieve) y tablas de hechos.</td><td>Analistas de BI, dashboards ejecutivos, aplicaciones operacionales y modelos ML en producción.</td></tr>\n</table>\n\n<div class=\"tip\"><b>Buenas Prácticas en Capa Bronze:</b> Nunca apliques transformaciones de limpieza de negocio ni filtrado de columnas en la capa Bronze. El objetivo primordial de Bronze es actuar como réplica fiel e inmutable del origen para permitir reprocesar todo el histórico ante cambios de lógica sin requerir extraer nuevamente los datos de los sistemas transaccionales.</div>\n"
    },
    {
      "id": "dbd-t-1-2",
      "d": 1,
      "title": "1.2 · Delta Lake Internals: ACID, _delta_log, Time Travel, VACUUM y Liquid Clustering",
      "html": "\n<h4>Anatomía Interna de Delta Lake: El Registro de Transacciones (_delta_log)</h4>\n<p>Delta Lake implementa transacciones ACID sobre almacenamiento de objetos mediante un registro de transacciones ordenado y determinista ubicado en el subdirectorio <code>_delta_log/</code> en la raíz de cada tabla:</p>\n<ul>\n  <li><b>Ficheros de Commit JSON:</b> Cada operación (insert, update, delete) genera un fichero secuencial JSON atómico (<code>000000.json</code>, <code>000001.json</code>) que contiene acciones de adición (<code>add</code>) y eliminación lógica (<code>remove</code>) de ficheros Parquet, junto con estadísticas de columnas (mínimos, máximos, conteo de nulos).</li>\n  <li><b>Checkpoints Parquet:</b> Cada 10 transacciones (por defecto), Delta Lake compacta el estado acumulado en un fichero <code>.checkpoint.parquet</code> (ej. <code>000010.checkpoint.parquet</code>), evitando escanear miles de ficheros JSON para reconstruir el estado actual.</li>\n  <li><b>Control de Concurrencia Optimista (OCC):</b> Los escritores asumen que no habrá colisiones; si dos transacciones modifican los mismos ficheros simultáneamente, Delta verifica si los conflictos son reconciliables o falla la segunda con <code>ConcurrentModificationException</code> para garantizar serializabilidad.</li>\n</ul>\n\n<h4>Time Travel y Restauración Histórica</h4>\n<p>Gracias al registro inmutable de commits, Delta Lake permite consultar versiones previas de la tabla sin duplicar físicamente los ficheros subyacentes:</p>\n<ul>\n  <li><b>Sintaxis SQL:</b> <code>SELECT * FROM tabla VERSION AS OF 15;</code> o <code>SELECT * FROM tabla TIMESTAMP AS OF '2024-01-15 10:00:00';</code>.</li>\n  <li><b>Restauración:</b> <code>RESTORE TABLE tabla TO VERSION AS OF 12;</code> crea un nuevo commit que devuelve la tabla al estado exacto de dicha versión.</li>\n</ul>\n\n<h4>Mantenimiento Físico: OPTIMIZE, Liquid Clustering y VACUUM</h4>\n<table class=\"keytable\">\n<tr><th>Comando / Técnica</th><th>Función y Mecanismo Interno</th><th>Impacto Operacional</th></tr>\n<tr><td><b>OPTIMIZE (Bin-packing)</b></td><td>Compacta colecciones de ficheros pequeños en ficheros uniformes de ~1 GB mediante operaciones atómicas de reescritura.</td><td>Acelera drásticamente las lecturas al reducir el sobrecoste de apertura de ficheros en el almacenamiento de nube.</td></tr>\n<tr><td><b>Liquid Clustering (CLUSTER BY)</b></td><td>Reemplaza el particionamiento físico rígido y <code>Z-ORDER</code>. Organiza los datos de forma multidimensional y dinámica según columnas de consulta habituales.</td><td>Evita problemas de particionamiento excesivo (over-partitioning) y permite modificar las claves de ordenación sin reescribir toda la tabla.</td></tr>\n<tr><td><b>VACUUM</b></td><td>Elimina físicamente del almacenamiento los ficheros Parquet que fueron marcados como eliminados (<code>remove</code>) y superan el umbral de retención.</td><td>Libera espacio en disco. Su retención por defecto es de <b>7 días</b>; ejecutarlo con retención cero rompe el Time Travel y arriesga corromper lecturas concurrentes activas.</td></tr>\n</table>\n\n<div class=\"tip\"><b>Peligro de VACUUM con retención reducida:</b> La propiedad <code>spark.databricks.delta.vacuum.retentionCheck.enabled = false</code> permite ejecutar <code>VACUUM</code> con menos de 168 horas (7 días). En entornos productivos está fuertemente desaconsejado, ya que cualquier consulta de larga duración que esté leyendo ficheros Parquet antiguos fallará si estos son purgados mientras la consulta sigue en ejecución.</div>\n"
    },
    {
      "id": "dbd-t-2-1",
      "d": 2,
      "title": "2.1 · Ingestión y Extracción con Spark SQL, Funciones de Orden Superior y JSON",
      "html": "\n<h4>Lectura Directa de Archivos e Ingestión con Spark SQL</h4>\n<p>Spark SQL permite interactuar directamente con ficheros almacenados en almacenamiento de nube mediante sintaxis ANSI SQL o la API DataFrame:</p>\n<ul>\n  <li><b>Consultas directas a ficheros:</b> <code>SELECT * FROM parquet.`/ruta/directorio/`</code> o <code>SELECT * FROM json.`/ruta/logs/`</code>.</li>\n  <li><b>Comando COPY INTO:</b> Instrucción SQL declarativa e idempotente recomendada para ingesta por lotes de millones de ficheros nuevos en tablas Delta existentes:\n    <pre><code>COPY INTO delta.`/ruta/delta_table`\nFROM `/ruta/landing/`\nFILEFORMAT = CSV\nFORMAT_OPTIONS ('header' = 'true', 'inferSchema' = 'true')\nCOPY_OPTIONS ('mergeSchema' = 'true');</code></pre>\n  </li>\n</ul>\n\n<h4>Tratamiento de Datos Semiestructurados y Parsing de JSON</h4>\n<p>En pipelines modernos, los eventos aterrizan como cadenas JSON sin tipar. Spark SQL ofrece funciones nativas optimizadas:</p>\n<ul>\n  <li><b>from_json(col, schema):</b> Deserializa una columna de texto JSON a una estructura fuertemente tipada (<code>STRUCT</code> o <code>ARRAY</code>) según el esquema provisto.</li>\n  <li><b>to_json(col):</b> Convierte una estructura compleja (<code>STRUCT</code> o <code>MAP</code>) en una cadena JSON estandarizada.</li>\n  <li><b>schema_of_json(json_str):</b> Infiere automáticamente la firma del esquema a partir de una muestra representativa de texto JSON.</li>\n  <li><b>Operadores de navegación:</b> Acceso a atributos mediante notación punto (<code>cliente.direccion.ciudad</code>) o el operador dos puntos (<code>payload:id::int</code>).</li>\n</ul>\n\n<h4>Funciones de Orden Superior (Higher-Order Functions) en Arrays</h4>\n<p>Permiten manipular colecciones y arrays anidados directamente en SQL sin recurrir a costosas operaciones de desanidado (<code>explode</code>) seguidas de agrupaciones:</p>\n<table class=\"keytable\">\n<tr><th>Función</th><th>Firma / Ejemplo</th><th>Propósito</th></tr>\n<tr><td><b>TRANSFORM</b></td><td><code>TRANSFORM(items, i -> i.precio * 1.21)</code></td><td>Aplica una expresión de transformación elemento a elemento, devolviendo un nuevo array transformado.</td></tr>\n<tr><td><b>FILTER</b></td><td><code>FILTER(transacciones, t -> t.monto &gt; 100)</code></td><td>Filtra los elementos del array conservando solo aquellos que cumplen el predicado booleano.</td></tr>\n<tr><td><b>EXISTS</b></td><td><code>EXISTS(etiquetas, tag -> tag = 'urgente')</code></td><td>Evalúa si al menos un elemento del array satisface la condición booleana (devuelve true/false).</td></tr>\n<tr><td><b>AGGREGATE</b></td><td><code>AGGREGATE(lineas, 0.0, (acc, x) -> acc + x.subtotal)</code></td><td>Reduce el array a un único valor acumulado mediante una función acumuladora y valor inicial.</td></tr>\n</table>\n\n<div class=\"tip\"><b>Rendimiento de Higher-Order Functions:</b> El uso de <code>TRANSFORM</code> y <code>FILTER</code> es drásticamente más eficiente que descomponer un array con <code>explode()</code> y volver a agregarlo con <code>collect_list()</code>, ya que evita barajados masivos de datos (shuffles) a través de la red del clúster.</div>\n"
    },
    {
      "id": "dbd-t-2-2",
      "d": 2,
      "title": "2.2 · Manipulación Avanzada, Deduplicación, MERGE INTO y Funciones de Ventana",
      "html": "\n<h4>Deduplicación de Datos en Pipelines ELT</h4>\n<p>La ingesta desde orígenes distribuidos a menudo produce registros duplicados debido a reintentos de red con semántica at-least-once. Existen dos enfoques principales de deduplicación:</p>\n<ul>\n  <li><b>dropDuplicates([cols]):</b> Método rápido en la API DataFrame de PySpark que conserva una fila arbitraria para cada clave única identificada.</li>\n  <li><b>Deduplicación con Ventana (Window Function):</b> Enfoque determinista mediante SQL cuando se requiere conservar el registro más reciente según una marca de tiempo:\n    <pre><code>WITH clasificados AS (\n  SELECT *,\n    ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY updated_at DESC) AS ranking\n  FROM raw_eventos\n)\nSELECT * EXCEPT(ranking) FROM clasificados WHERE ranking = 1;</code></pre>\n  </li>\n</ul>\n\n<h4>Upserts Atómicos con MERGE INTO</h4>\n<p>Delta Lake proporciona soporte nativo completo para operaciones atómicas de <code>MERGE INTO</code>, combinando inserciones, actualizaciones y borrados en una única transacción ACID:</p>\n<pre><code>MERGE INTO target_silver AS t\nUSING source_updates AS s\nON t.pedido_id = s.pedido_id\nWHEN MATCHED AND s.es_cancelado = true THEN\n  DELETE\nWHEN MATCHED THEN\n  UPDATE SET t.estado = s.estado, t.monto = s.monto, t.fecha_actualizacion = current_timestamp()\nWHEN NOT MATCHED THEN\n  INSERT (pedido_id, estado, monto, fecha_creacion, fecha_actualizacion)\n  VALUES (s.pedido_id, s.estado, s.monto, s.fecha_evento, current_timestamp());</code></pre>\n\n<h4>Tipos de UDFs (User-Defined Functions) y Rendimiento</h4>\n<table class=\"keytable\">\n<tr><th>Tipo de UDF</th><th>Lenguaje / Entorno</th><th>Rendimiento</th><th>Caso de Uso Óptimo</th></tr>\n<tr><td><b>SQL UDF</b></td><td>ANSI SQL nativo</td><td><b>Máximo</b>: Optimizada por Catalyst y acelerada por el motor Photon.</td><td>Lógica de negocio estándar, cálculos matemáticos, transformaciones de cadenas.</td></tr>\n<tr><td><b>Pandas UDF (Vectorized)</b></td><td>Python + PyArrow</td><td><b>Alto</b>: Procesa lotes completos en memoria columnar mediante Apache Arrow.</td><td>Transformaciones estadísticas complejas, inferencia de modelos ML en lotes.</td></tr>\n<tr><td><b>Python UDF Estándar</b></td><td>Python puro (row-by-row)</td><td><b>Bajo</b>: Incurre en sobrecoste masivo de serialización IPC/Py4J entre JVM y el runtime Python.</td><td>Desaconsejada salvo para librerías legacy sin soporte columnar.</td></tr>\n</table>\n\n<div class=\"tip\"><b>Tablas Administradas vs Externas:</b> Al ejecutar <code>DROP TABLE</code> sobre una tabla <b>Managed</b> (administrada), Databricks elimina tanto la definición de metadatos en el catálogo como los archivos Parquet físicos subyacentes. En una tabla <b>External</b> (definida con cláusula <code>LOCATION</code>), <code>DROP TABLE</code> solo elimina los metadatos, preservando íntegros los ficheros de datos en el almacenamiento de nube.</div>\n"
    },
    {
      "id": "dbd-t-3-1",
      "d": 3,
      "title": "3.1 · Structured Streaming, Auto Loader (cloudFiles) y Checkpointing",
      "html": "\n<h4>El Paradigma de Structured Streaming</h4>\n<p>Spark Structured Streaming procesa flujos continuos tratando las fuentes de datos como <b>tablas ilimitadas (unbounded tables)</b> sobre las que se añaden nuevos registros continuamente. El motor divide internamente el procesamiento en micro-lotes de baja latencia o streaming continuo.</p>\n\n<h4>Modos de Salida (Output Modes)</h4>\n<table class=\"keytable\">\n<tr><th>Output Mode</th><th>Comportamiento en cada Trigger</th><th>Restricciones y Casos de Uso</th></tr>\n<tr><td><b>Append</b> (por defecto)</td><td>Solo se emiten al sink los registros nuevos que han llegado en el micro-lote actual.</td><td>Requerido para pipelines ELT incrementales. En consultas con agregaciones temporales exige definir una marca de agua (Watermark).</td></tr>\n<tr><td><b>Complete</b></td><td>Se reescribe y emite la totalidad de la tabla de resultados acumulada en cada micro-lote.</td><td>Obligatorio para agregaciones sin ventana o métricas de conteo global; no compatible con sinks append-only directos.</td></tr>\n<tr><td><b>Update</b></td><td>Solo se escriben en el sumidero aquellas filas cuyo estado agregado ha sido modificado respecto al trigger previo.</td><td>Ideal para mantener tablas de estado vivas o actualizar dashboards externos.</td></tr>\n</table>\n\n<h4>Auto Loader (format(\"cloudFiles\")): Ingestión Incremental Escalable</h4>\n<p><b>Auto Loader</b> es la tecnología propietaria de Databricks para detectar e ingerir de forma incremental millones de nuevos archivos depositados en el almacenamiento de objetos de la nube:</p>\n<ul>\n  <li><b>Modo Directory Listing:</b> Escanea periódicamente el directorio; óptimo para rutas con menos de 1 millón de ficheros y volumen moderado.</li>\n  <li><b>Modo File Notification:</b> Utiliza servicios de cola y eventos en la nube (AWS SNS/SQS, Azure Event Grid, GCP Pub/Sub) para recibir avisos de nuevos ficheros sin escanear carpetas masivas.</li>\n  <li><b>Inferencia y Evolución de Esquemas:</b>\n    <pre><code>spark.readStream.format(\"cloudFiles\")\n  .option(\"cloudFiles.format\", \"json\")\n  .option(\"cloudFiles.schemaLocation\", \"/checkpoints/schema_dir\")\n  .option(\"cloudFiles.schemaEvolutionMode\", \"addNewColumns\")\n  .load(\"/mnt/raw_landing/\")</code></pre>\n  </li>\n  <li><b>Columna _rescued_data:</b> Captura cualquier columna inesperada, dato corrupto o tipo incompatible en un campo JSON estructurado sin romper la ingesta ni descartar registros.</li>\n</ul>\n\n<h4>Checkpointing y Marcas de Agua (Watermarks)</h4>\n<ul>\n  <li><b>checkpointLocation:</b> Directorio persistente obligatorio en almacenamiento de nube donde el motor guarda el log de offsets leídos, commits y estado de agregaciones. Asegura recuperación ante caídas y semántica <b>exactly-once</b>.</li>\n  <li><b>withWatermark(col, delayThreshold):</b> Establece el umbral temporal máximo admisible para eventos retrasados (ej. <code>withWatermark(\"event_time\", \"10 minutes\")</code>). Permite al motor descartar datos antiguos y purgar el State Store en memoria para prevenir fugas de RAM (OOM).</li>\n</ul>\n"
    },
    {
      "id": "dbd-t-3-2",
      "d": 3,
      "title": "3.2 · Delta Live Tables (DLT): Expectativas, Materialized Views y Streaming Tables",
      "html": "\n<h4>Arquitectura Declarativa de Delta Live Tables (DLT)</h4>\n<p><b>Delta Live Tables (DLT)</b> es el marco de trabajo declarativo de Databricks para construir y orquestar canalizaciones de datos fiables en SQL o Python. El desarrollador define las transformaciones deseadas y DLT se encarga automáticamente de inferir el grafo de dependencias (DAG), gestionar la infraestructura de clústeres, implementar checkpoints y capturar métricas de calidad.</p>\n\n<h4>Datasets en DLT: Streaming Tables vs Materialized Views</h4>\n<table class=\"keytable\">\n<tr><th>Tipo de Objeto</th><th>Sintaxis Declarativa (SQL)</th><th>Mecanismo de Procesamiento</th><th>Caso de Uso Recomendado</th></tr>\n<tr><td><b>Streaming Table</b></td><td><code>CREATE OR REFRESH STREAMING TABLE silver_events AS SELECT * FROM STREAM(raw_source)</code></td><td>Procesamiento estrictamente incremental (append-only); solo procesa datos que nunca antes han sido leídos.</td><td>Ingesta cruda desde Auto Loader, mensajes de colas Kafka, eventos temporales de alto volumen.</td></tr>\n<tr><td><b>Materialized View</b></td><td><code>CREATE OR REFRESH MATERIALIZED VIEW gold_kpis AS SELECT date, sum(total) FROM silver_events GROUP BY date</code></td><td>Calcula y persiste los resultados según el estado más reciente de las tablas fuente, gestionando actualizaciones automáticamente.</td><td>Agregaciones de negocio complejas, deduplicaciones, uniones dimensionales (joins) y capa Gold.</td></tr>\n</table>\n\n<h4>Expectativas de Calidad de Datos (Data Quality Expectations)</h4>\n<p>DLT permite definir restricciones de integridad declarativas aplicadas en vuelo durante la ejecución de los pipelines:</p>\n<table class=\"keytable\">\n<tr><th>Cláusula de Expectativa</th><th>Acción ante Registro Inválido</th><th>Comportamiento del Pipeline</th></tr>\n<tr><td><code>CONSTRAINT v_email EXPECT (email IS NOT NULL)</code></td><td>Conserva el registro en la tabla destino y emite una alerta métrica en el Event Log.</td><td>El pipeline continúa sin interrupción; ideal para monitorización preventiva de calidad.</td></tr>\n<tr><td><code>EXPECT (edad &gt;= 18) ON VIOLATION DROP ROW</code></td><td>Descarta la fila inválida de la tabla destino, registrando el conteo de filas eliminadas.</td><td>El pipeline continúa; garantiza que solo datos conformes avancen a capas Silver/Gold.</td></tr>\n<tr><td><code>EXPECT (id IS NOT NULL) ON VIOLATION FAIL UPDATE</code></td><td>Detiene de inmediato la ejecución y marca el pipeline en estado de error fatal.</td><td>Interrumpe el trabajo de inmediato; obligatorio para claves primarias o datos críticos financieros.</td></tr>\n</table>\n\n<div class=\"tip\"><b>Modo Triggered vs Continuous en DLT:</b> En modo <b>Continuous</b>, los clústeres permanecen activos para procesar datos con latencia de segundos. En modo <b>Triggered</b>, el pipeline procesa todos los datos pendientes acumulados y se detiene, optimizando sustancialmente el consumo de DBUs en ingestas horarias o diarias.</div>\n"
    },
    {
      "id": "dbd-t-4-1",
      "d": 4,
      "title": "4.1 · Databricks Workflows: Tipos de Clúster, Orquestación de Tareas y Alertas",
      "html": "\n<h4>Databricks Workflows: Orquestación Integral de Tareas (Multi-Task Jobs)</h4>\n<p><b>Databricks Workflows</b> es el orquestador nativo totalmente administrado que permite construir flujos de trabajo basados en grafos acíclicos dirigidos (DAG). Soporta tareas heterogéneas incluyendo Notebooks, scripts Python, consultas SQL/dashboards, pipelines DLT y modelos dbt.</p>\n\n<h4>Tipos de Cómputo para Workflows: Job Clusters vs All-Purpose Clusters</h4>\n<table class=\"keytable\">\n<tr><th>Característica</th><th>Job Cluster (Automated)</th><th>All-Purpose Cluster (Interactivo)</th></tr>\n<tr><td><b>Ciclo de Vida</b></td><td>Efímero: Databricks aprovisiona el clúster al iniciar el job y lo destruye inmediatamente al finalizar la ejecución.</td><td>Persistente: Se mantiene en ejecución o en espera según la política de apagado automático (auto-termination).</td></tr>\n<tr><td><b>Coste de DBU</b></td><td><b>Tarifa reducida (~50 % a 60 % de ahorro)</b> frente a los clústeres All-Purpose.</td><td>Tarifa estándar completa de computación interactiva.</td></tr>\n<tr><td><b>Aislamiento</b></td><td>Aislamiento total de recursos y bibliotecas; previene interferencias entre trabajos concurrentes.</td><td>Compartido entre múltiples usuarios o notebooks en desarrollo.</td></tr>\n<tr><td><b>Recomendación</b></td><td><b>Estándar mandatorio para cargas de producción y jobs programados.</b></td><td>Uso exclusivo para desarrollo interactivo y análisis exploratorio.</td></tr>\n</table>\n\n<h4>Paso de Parámetros entre Tareas con TaskValues</h4>\n<p>Databricks permite transferir metadatos y valores dinámicos entre nodos de un DAG mediante la utilidad <code>taskValues</code>:</p>\n<ul>\n  <li><b>Emisor (Tarea upstream):</b> <code>dbutils.jobs.taskValues.set(key = \"batch_count\", value = 14500)</code></li>\n  <li><b>Receptor (Tarea downstream):</b> <code>total = dbutils.jobs.taskValues.get(taskKey = \"tarea_ingesta\", key = \"batch_count\", default = 0)</code></li>\n</ul>\n\n<h4>Resiliencia: Reparación de Trabajos (Repair and Rerun)</h4>\n<p>Cuando un job multi-tarea falla en una de sus ramas intermedias, la funcionalidad <b>Repair and Rerun</b> permite re-ejecutar exclusivamente las tareas fallidas y sus dependencias aguas abajo, sin volver a gastar cómputo en tareas que ya concluyeron exitosamente en la corrida previa.</p>\n\n<div class=\"tip\"><b>Políticas de Reintento y Alertas:</b> Cada tarea en un Workflow permite configurar reintentos automáticos (<code>retries</code>) con intervalos mínimos de espera (<code>min_retry_interval_millis</code>) y notificaciones dirigidas por evento (éxito, fallo, duración excedida) enviadas a correos electrónicos o webhooks corporativos (Slack, PagerDuty).</div>\n"
    },
    {
      "id": "dbd-t-4-2",
      "d": 4,
      "title": "4.2 · Ciclo de Vida: Repos Git, CI/CD, Cluster Policies y Gobernanza de Costes",
      "html": "\n<h4>Integración con Control de Versiones: Databricks Repos</h4>\n<p><b>Databricks Repos</b> proporciona integración bidireccional de nivel empresarial con los principales proveedores Git (GitHub, GitLab, Bitbucket, Azure DevOps). Permite a los equipos de ingeniería:</p>\n<ul>\n  <li>Organizar el código en ramas de desarrollo (feature branches) y realizar operaciones de commit, push, pull y merge directamente desde el espacio de trabajo.</li>\n  <li>Importar y estructurar código modular en paquetes Python puros (<code>.py</code>) reutilizables mediante sentencias estándar <code>import</code> dentro de los notebooks.</li>\n  <li>Asegurar que los jobs productivos se ejecuten apuntando a ramas estables protegidas (ej. <code>main</code> o tags de release).</li>\n</ul>\n\n<h4>Automatización CI/CD con Databricks Asset Bundles (DABs)</h4>\n<p><b>Databricks Asset Bundles (DABs)</b> permite gestionar proyectos de datos como infraestructura como código (IaC). Mediante ficheros declarativos YAML (<code>databricks.yml</code>), los desarrolladores definen pipelines DLT, Workflows, permisos y configuraciones, desplegándolos programáticamente a través de entornos de desarrollo, pruebas y producción con la CLI de Databricks.</p>\n\n<h4>Políticas de Clúster (Cluster Policies) y Control de Costes</h4>\n<p>Las Cluster Policies imponen reglas estrictas sobre qué tipo de recursos pueden ser aprovisionados por los ingenieros de datos en el workspace:</p>\n<ul>\n  <li><b>Limitación de Tipos de Instancia:</b> Restringe las familias de máquinas virtuales permitidas (ej. prohibir GPUs costosas en notebooks analíticos).</li>\n  <li><b>Auto-Terminación Forzada:</b> Obliga a configurar un tiempo máximo de inactividad (ej. 20 minutos) para apagar clústeres olvidados automáticamente.</li>\n  <li><b>Etiquetado Mandatorio (Custom Tags):</b> Obliga a asignar etiquetas como <code>CostCenter</code>, <code>Project</code> o <code>Owner</code> en cada clúster para desglosar la facturación en la nube.</li>\n</ul>\n\n<h4>El Motor Photon: Aceleración Vectorizada en C++</h4>\n<p><b>Photon</b> es el motor de ejecución nativo desarrollado en C++ integrado en el runtime de Databricks que sustituye el motor de ejecución de la JVM por procesamiento vectorizado SIMD moderno. Aunque tiene un recargo por DBU, Photon reduce drásticamente los tiempos de procesamiento de consultas SQL pesadas, scans y joins, logrando frecuentemente un coste total de propiedad (TCO) menor.</p>\n"
    },
    {
      "id": "dbd-t-5-1",
      "d": 5,
      "title": "5.1 · Unity Catalog: Espacio de Nombres de 3 Niveles, Metastore y External Locations",
      "html": "\n<h4>Arquitectura Centralizada de Unity Catalog</h4>\n<p><b>Unity Catalog</b> es la solución integral de gobernanza de Databricks para datos e inteligencia artificial. A diferencia de las soluciones tradicionales basadas en Hive Metastore local por clúster, Unity Catalog opera a nivel de cuenta y provee:</p>\n<ul>\n  <li><b>Metastore Regional Unificado:</b> Un único almacén de metadatos centralizado por región geográfica que se vincula a múltiples workspaces de Databricks, facilitando el gobierno compartido.</li>\n  <li><b>Espacio de Nombres de 3 Niveles (Three-Level Namespace):</b> La resolución de cualquier objeto de datos sigue la jerarquía canónica:\n    <br/><code>&lt;catalogo&gt;.&lt;esquema&gt;.&lt;objeto&gt;</code> (ejemplo: <code>corp_prod.finanzas.facturacion</code>).</li>\n</ul>\n\n<h4>Objetos Securizables y Almacenamiento Seguro</h4>\n<table class=\"keytable\">\n<tr><th>Objeto Securizable</th><th>Definición y Rol Arquitectónico</th><th>Gobernanza y Permisos</th></tr>\n<tr><td><b>Storage Credential</b></td><td>Encapsula una identidad administrada de la nube (AWS IAM Role, Azure Managed Identity o GCP Service Account) con permisos de lectura/escritura en almacenamiento de objetos.</td><td>Solo los administradores del Metastore pueden crearlas; evita exponer llaves secretas o tokens a los usuarios.</td></tr>\n<tr><td><b>External Location</b></td><td>Asocia una <code>Storage Credential</code> específica con un prefijo URL de almacenamiento de nube (ej. <code>s3://mi-bucket-datalake/silver/</code>).</td><td>Permite otorgar privilegios como <code>CREATE EXTERNAL TABLE</code> o <code>READ FILES</code> a ingenieros sin darles acceso IAM directo.</td></tr>\n<tr><td><b>Managed Storage</b></td><td>Ubicación de almacenamiento raíz asignada a nivel de catálogo o esquema donde se guardan automáticamente las tablas administradas.</td><td>Al borrar una Managed Table con <code>DROP TABLE</code>, Unity Catalog purga automáticamente los ficheros físicos del bucket.</td></tr>\n<tr><td><b>Volumes</b></td><td>Objeto de Unity Catalog diseñado para gobernar ficheros no estructurados o semiestructurados (PDFs, imágenes, CSVs crudos, checkpoints).</td><td>Disponibles como <b>Managed Volumes</b> o <b>External Volumes</b>, accesibles vía rutas POSIX en <code>/Volumes/catalogo/esquema/volumen/</code>.</td></tr>\n</table>\n\n<div class=\"tip\"><b>Resolución de Objetos sin Prefijo Completo:</b> Si no se especifica el nombre de 3 niveles, Databricks recurre al catálogo y esquema activos en la sesión actual configurados mediante <code>USE CATALOG catalogo;</code> y <code>USE SCHEMA esquema;</code>.</div>\n"
    },
    {
      "id": "dbd-t-5-2",
      "d": 5,
      "title": "5.2 · Gobernanza en Unity Catalog: Permisos GRANT, Dynamic Views, Filtros y Linaje",
      "html": "\n<h4>Control de Acceso Declarativo (ANSI SQL RBAC)</h4>\n<p>Unity Catalog implementa un modelo de privilegios estándar ANSI SQL administrado mediante sentencias declarativas de otorgamiento y revocación de permisos sobre identidades centralizadas a nivel de cuenta (usuarios y grupos):</p>\n<pre><code>GRANT USAGE ON CATALOG corp_prod TO `analistas_bi`;\nGRANT USAGE ON SCHEMA corp_prod.ventas TO `analistas_bi`;\nGRANT SELECT ON TABLE corp_prod.ventas.resumen_anual TO `analistas_bi`;</code></pre>\n<p><i>Regla fundamental de herencia:</i> Para acceder a cualquier tabla, un usuario requiere el privilegio <code>USAGE</code> en todos los niveles superiores de la jerarquía (tanto en el catálogo como en el esquema correspondiente).</p>\n\n<h4>Seguridad Granular: Row Filters y Column Masks</h4>\n<p>Unity Catalog permite implementar políticas de seguridad a nivel de fila y enmascaramiento dinámico de columnas sin necesidad de duplicar tablas físicas:</p>\n<ul>\n  <li><b>Row Filters (Filtros de Fila):</b> Funciones SQL que evalúan si la sesión actual puede visualizar una fila determinada:\n    <pre><code>CREATE FUNCTION region_filter(region STRING)\nRETURN IF(IS_ACCOUNT_GROUP_MEMBER('admin_global') OR region = 'EMEA', true, false);\n\nALTER TABLE corp_prod.ventas.pedidos\nSET ROW FILTER region_filter ON (region);</code></pre>\n  </li>\n  <li><b>Column Masks (Máscaras de Columna):</b> Ofuscan datos sensibles (PII, tarjetas de crédito) para grupos no autorizados:\n    <pre><code>CREATE FUNCTION mask_tarjeta(numero STRING)\nRETURN IF(IS_ACCOUNT_GROUP_MEMBER('auditoria_financiera'), numero, CONCAT('****-****-****-', RIGHT(numero, 4)));\n\nALTER TABLE corp_prod.finanzas.pagos\nALTER COLUMN tarjeta_credito SET MASK mask_tarjeta;</code></pre>\n  </li>\n  <li><b>Dynamic Views (Vistas Dinámicas):</b> Método tradicional mediante funciones integradas como <code>current_user()</code> o <code>is_account_group_member()</code> dentro de la cláusula <code>WHERE</code> de una vista estándar.</li>\n</ul>\n\n<h4>Linaje de Datos Automatizado (Automated Lineage)</h4>\n<p>Unity Catalog registra automáticamente el <b>linaje de datos a nivel de tabla y columna</b> en tiempo de ejecución para cualquier consulta ejecutada en Databricks, sin necesidad de librerías adicionales ni instrumentación en el código. Facilita auditorías de cumplimiento normativo (GDPR/CCPA) y análisis visual de impacto ante cambios de esquema.</p>\n"
    }
  ],
  "questions": [
    {
      "id": "dbd-01",
      "d": 1,
      "t": "Arquitectura Lakehouse vs Data Lake/Data Warehouse",
      "q": "Tu organización financiera almacena terabytes de transacciones en un Data Lake de objetos en la nube (formato Parquet). El equipo de análisis se queja de lecturas inconsistentes cuando los pipelines de ingesta actualizan datos concurrentemente. Además, la auditoría exige eliminar registros por derecho al olvido (GDPR), lo que obliga a reescribir particiones completas manualmente. ¿Qué ventaja técnica fundamental aporta migrar estas tablas a `Delta Lake` en el Lakehouse para resolver ambos problemas?",
      "o": [
        "Añade un registro transaccional ACID (`_delta_log`) que garantiza aislamiento serializable en lecturas concurrentes y habilita sentencias `DELETE` a nivel de fila.",
        "Convierte el almacenamiento de objetos en un cluster transaccional HDFS privado con bloqueos distribuidos síncronos gestionados por un servicio Apache ZooKeeper externo de alta disponibilidad.",
        "Duplica automáticamente todos los archivos en un clúster dedicado de Data Warehouse relacional para procesar consultas analíticas sin interactuar con el Data Lake abierto.",
        "Delega el control de concurrencia y los borrados en índices secundarios creados dentro de la memoria RAM del nodo driver de Databricks durante cada sesión interactiva."
      ],
      "a": 0,
      "e": "Delta Lake soluciona la falta de transacciones del Data Lake tradicional mediante su registro de transacciones ACID (`_delta_log`). Este log garantiza lecturas consistentes mediante Control de Concurrencia Optimista (OCC) y aislamiento de instantáneas (snapshot isolation), permitiendo ejecutar operaciones `DELETE`, `UPDATE` y `MERGE INTO` a nivel de registro sin reescribir manualmente particiones enteras.",
      "why": [
        null,
        "Delta Lake opera sobre almacenamiento de objetos estándar en la nube (S3, ADLS, GCS); no requiere clústeres HDFS ni coordinación mediante Apache ZooKeeper.",
        "La arquitectura Lakehouse procesa los datos directamente en el Data Lake abierto; no duplica los datos en un Data Warehouse propietario externo.",
        "El registro transaccional reside en almacenamiento persistente (`_delta_log`), no en la memoria volátil del nodo driver."
      ]
    },
    {
      "id": "dbd-02",
      "d": 1,
      "t": "Arquitectura Medallion: Capa Bronze",
      "q": "Un ingeniero de datos diseña el pipeline de ingestión para millones de eventos JSON generados por sensores IoT. Algunos sensores envían campos adicionales inesperados debido a actualizaciones de firmware, y otros presentan cargas malformadas. ¿Cuál es el diseño recomendado para la tabla de la capa `Bronze` en una arquitectura Medallion?",
      "o": [
        "Filtrar y descartar de inmediato cualquier registro que no coincida exactamente con el esquema predefinido para mantener la integridad de la base de datos.",
        "Ingerir los datos en modo append-only en su formato nativo o esquema amplio, capturando campos nuevos o malformados en `_rescued_data` para auditoría.",
        "Normalizar las entidades aplicando desanidado completo de arrays y deduplicación exhaustiva por sensor antes de persistir los registros en el almacenamiento de objetos.",
        "Ejecutar transformaciones de limpieza y agregación horaria en el micro-batch para escribir directamente tablas de hechos dimensionales en formato Gold precalculado."
      ],
      "a": 1,
      "e": "La capa Bronze debe actuar como una réplica histórica fiel y auditable del origen de datos (append-only). En Databricks, la mejor práctica es ingerir los datos en su formato original o esquema flexible utilizando la columna `_rescued_data` de Auto Loader para preservar campos imprevistos o registros corruptos, permitiendo re-procesar los datos ante cualquier fallo de validación posterior.",
      "why": [
        "Descartar datos en la capa Bronze destruye la trazabilidad histórica y hace imposible recuperar información si la discrepancia de esquema era válida.",
        null,
        "La normalización, desanidado y deduplicación son transformaciones propias de la capa Silver, no de la capa de ingestión cruda Bronze.",
        "Las agregaciones horarias y modelos dimensionales pertenecen a la capa Gold; aplicarlas en la ingesta inicial omite las fases de refinamiento y auditoría."
      ]
    },
    {
      "id": "dbd-03",
      "d": 1,
      "t": "Arquitectura Medallion: Capa Silver",
      "q": "En tu plataforma Lakehouse, la capa `Bronze` contiene eventos sin procesar de múltiples fuentes transaccionales. El equipo de datos necesita alimentar modelos predictivos y analistas de negocio con una visión unificada de los clientes. ¿Qué conjunto de operaciones caracteriza adecuadamente el paso de la capa `Bronze` a la capa `Silver`?",
      "o": [
        "Construir exclusivamente tablas de agregación final con métricas de KPI mensuales precalculadas optimizadas para herramientas de visualización ejecutiva en dashboards.",
        "Replicar idénticamente los ficheros crudos sin validar tipos de datos para mantener un espejo exacto del sistema de archivos origen del proveedor de almacenamiento.",
        "Limpiar registros, tipar estrictamente columnas, resolver nulos, deduplicar claves y enriquecer los datos conformando una vista corporativa limpia.",
        "Aplicar anonimización destructiva eliminando todas las claves primarias para restringir el acceso a cualquier usuario que no sea administrador de clúster corporativo."
      ],
      "a": 2,
      "e": "La capa Silver (curada) es el punto de verdad corporativo del Lakehouse. Transforma los datos crudos de Bronze validando tipos de datos, eliminando duplicados mediante claves de negocio, resolviendo valores nulos críticos, aplicando enriquecimientos con tablas maestras y estructurando entidades limpias sobre las cuales construir la analítica y el machine learning.",
      "why": [
        "Las métricas y KPIs agregados finales corresponden a la capa Gold; la capa Silver mantiene el grano detallado de las entidades de negocio.",
        "Un espejo idéntico sin validaciones representa la propia capa Bronze, sin aportar el filtrado y limpieza característicos de Silver.",
        null,
        "La anonimización destructiva de claves primarias destruye la integridad referencial requerida en Silver; la seguridad se implementa con máscaras y filtros en Unity Catalog."
      ]
    },
    {
      "id": "dbd-04",
      "d": 1,
      "t": "Arquitectura Medallion: Capa Gold",
      "q": "El departamento de finanzas requiere un panel de control en Power BI para consultar las ventas totales diarias por región y categoría de producto, con tiempos de respuesta inferiores a un segundo. ¿Cómo debe implementarse este caso de uso en la capa `Gold` del Lakehouse?",
      "o": [
        "Configurar una conexión directa en streaming continuo hacia los ficheros JSON en bruto de la capa Bronze para reflejar ventas con latencia de milisegundos en tiempo real.",
        "Proveer una tabla externa sobre ficheros de texto CSV comprimidos sin optimizar para reducir el coste de almacenamiento en disco en la nube pública.",
        "Generar tablas agregadas de negocio, modelos dimensionales en estrella o vistas materializadas optimizadas con `OPTIMIZE` y clustering para consultas analíticas.",
        "Consumir vistas dinámicas no cacheadas que ejecuten joins complejos de 15 tablas crudas y agregaciones en tiempo real cada vez que el usuario abra el reporte en la herramienta de BI."
      ],
      "a": 2,
      "e": "La capa Gold está diseñada para el consumo analítico de alto rendimiento. En ella se almacenan modelos de datos optimizados para el negocio (esquemas en estrella/copo de nieve, tablas de hechos y dimensiones pre-agregadas), compactadas con `OPTIMIZE` y organizadas para minimizar escaneos de datos, garantizando respuestas subsegundo en dashboards y reportes.",
      "why": [
        "Consultar ficheros JSON crudos de Bronze en tiempo real generaría una carga masiva y latencias inaceptables para un dashboard de BI concurrente.",
        "Los ficheros CSV sin optimizar carecen de estadísticas de salto de datos (`data skipping`), resultando en lecturas lentas y sobrecoste de cómputo.",
        null,
        "Ejecutar joins de 15 tablas crudas en cada consulta genera latencias muy elevadas y desperdicia recursos frente a una tabla Gold precalculada."
      ]
    },
    {
      "id": "dbd-05",
      "d": 1,
      "t": "Delta Lake Internals: _delta_log y Concurrencia",
      "q": "Dos procesos de Spark escriben simultáneamente sobre la misma tabla Delta. El Proceso A actualiza registros de clientes de la región 'Norte' y el Proceso B inserta nuevas compras de la región 'Sur'. ¿Cómo coordina `Delta Lake` estas escrituras concurrentes sin provocar bloqueos pesados ni lecturas inconsistentes?",
      "o": [
        "Utiliza Control de Concurrencia Optimista (OCC) verificando el registro de transacciones `_delta_log`; al no colisionar en los mismos ficheros, valida ambos commits.",
        "Bloquea la tabla entera mediante un semáforo distribuido en memoria, pausando el Proceso B hasta que el Proceso A termine su commit y libere el hilo de ejecución.",
        "Escribe los datos de ambos procesos en ficheros Parquet temporales y delega la resolución de conflictos en un cron nocturno de reconciliación asíncrona de base de datos.",
        "Rechaza sistemáticamente cualquier escritura concurrente lanzando una excepción `TableAlreadyLockedException` al detectar dos jobs activos en el clúster de cómputo."
      ],
      "a": 0,
      "e": "Delta Lake utiliza Control de Concurrencia Optimista (OCC). Cada transacción graba sus operaciones asumiendo que no habrá conflictos. Antes de realizar el commit atómico en el `_delta_log` (mediante operaciones atómicas como `put-if-absent`), Delta comprueba si otra transacción ha modificado los mismos archivos. Como el Proceso A y el Proceso B operan sobre regiones y ficheros distintos, ambos commits se confirman exitosamente sin bloqueos globales.",
      "why": [
        null,
        "Delta Lake no utiliza bloqueos pesados de tabla completa (pessimistic locking); su modelo OCC permite escrituras concurrentes si no hay conflicto de archivos.",
        "Delta Lake garantiza consistencia transaccional inmediata en cada commit; no difiere la consistencia a procesos nocturnos asíncronos.",
        "Delta no rechaza sistemáticamente transacciones concurrentes; solo aborta si existe un conflicto real de modificación sobre los mismos ficheros de datos."
      ]
    },
    {
      "id": "dbd-06",
      "d": 1,
      "t": "Delta Lake: Time Travel y Recuperación",
      "q": "Durante una actualización manual en producción, un analista ejecuta accidentalmente un `UPDATE` sin cláusula `WHERE`, corrompiendo la columna de precios en toda la tabla `ventas_silver`. La tabla tiene historial transaccional intacto desde hace 30 días. ¿Cuál es la forma más rápida y segura de restaurar la tabla al estado exacto previo al error?",
      "o": [
        "Restaurar la tabla de forma atómica ejecutando `RESTORE TABLE ventas_silver TO VERSION AS OF <version_previa>;`.",
        "Descargar el último backup manual de la base de datos desde un archivo zip y sobreescribir la carpeta del bucket de almacenamiento mediante comandos bash de terminal.",
        "Crear un nuevo clúster de Databricks y ejecutar una re-ingesta completa de todos los archivos históricos desde el sistema origen relacional de la compañía.",
        "Ejecutar un comando `ROLLBACK TRANSACTION;` estándar de base de datos relacional asumiendo que la sesión interactiva sigue abierta en el notebook actual."
      ],
      "a": 0,
      "e": "Delta Lake cuenta con la sentencia `RESTORE TABLE <tabla> TO VERSION AS OF <version>` o `TIMESTAMP AS OF <timestamp>`. Esta instrucción genera un nuevo commit en el `_delta_log` que apunta a los ficheros Parquet válidos de la versión previa, revirtiendo la corrupción de manera instantánea y atómica sin re-ingestar datos ni mover ficheros físicos.",
      "why": [
        null,
        "Sobreescribir ficheros manualmente en el bucket corrompe el registro transaccional `_delta_log` y puede generar inconsistencias severas en el catálogo.",
        "Re-ingestar todo el histórico toma horas o días de cómputo innecesario, mientras que `RESTORE TABLE` completa en pocos segundos mediante metadatos.",
        "Spark SQL y Delta Lake no utilizan transacciones de sesión basadas en `ROLLBACK TRANSACTION`; las transacciones se confirman de forma atómica en cada comando."
      ]
    },
    {
      "id": "dbd-07",
      "d": 1,
      "t": "Delta Lake: Compactación con OPTIMIZE",
      "q": "Un pipeline de streaming escribe miles de pequeños archivos Parquet (de ~500 KB cada uno) por hora en una tabla Delta de pedidos. Como consecuencia, las consultas analíticas tardan varios minutos debido a la sobrecarga de listar y abrir ficheros en el almacenamiento de objetos. ¿Qué acción de mantenimiento resuelve este problema de pequeños archivos?",
      "o": [
        "Ejecutar el comando `VACUUM pedidos RETAIN 0 HOURS;` para purgar de inmediato todos los archivos de tamaño inferior a 1 MB del almacenamiento de objetos de la nube.",
        "Ejecutar el comando `OPTIMIZE pedidos;` para compactar automáticamente las colecciones de archivos pequeños en archivos mayores de aproximadamente 1 GB.",
        "Re-particionar físicamente el directorio en el sistema operativo mediante un script en Python dividiendo el total de filas entre 100 carpetas del sistema de ficheros.",
        "Cambiar el formato de almacenamiento de Delta a CSV plano para evitar el empaquetado columnar de metadatos en las lecturas de los analistas de negocio de la empresa."
      ],
      "a": 1,
      "e": "El comando `OPTIMIZE` realiza una compactación automática (bin-packing) reuniendo colecciones de ficheros pequeños en archivos Parquet más grandes y eficientes (de hasta ~1 GB). Esto reduce drásticamente las llamadas de metadatos al almacenamiento de objetos (S3/ADLS/GCS) y acelera la lectura de las consultas analíticas.",
      "why": [
        "`VACUUM` no compacta archivos; purga ficheros lógicamente eliminados. Ejecutarlo con retención cero además puede corromper transacciones en vuelo.",
        null,
        "Manipular manualmente los archivos en el almacenamiento altera la estructura física sin actualizar el `_delta_log`, corrompiendo la tabla Delta.",
        "Migrar a CSV empeoraría drásticamente el rendimiento al perder el formato columnar, la compresión Snappy y las estadísticas de data skipping."
      ]
    },
    {
      "id": "dbd-08",
      "d": 1,
      "t": "Optimización Física: Liquid Clustering vs Z-ORDER",
      "q": "Tu equipo gestiona una tabla Delta de 50 TB con consultas frecuentes filtradas concurrentemente por `cliente_id` (alta cardinalidad) y `fecha_pedido` (serie temporal). Históricamente se utilizó particionamiento tradicional por fecha, pero esto generaba problemas de sobre-particionado y desbalanceo de datos (data skew). ¿Qué dos afirmaciones sobre las técnicas modernas de organización física en Delta Lake son correctas? (Elige 2 respuestas)",
      "o": [
        "`Liquid Clustering` (`CLUSTER BY (cliente_id, fecha_pedido)`) simplifica el diseño físico al permitir clustering multidimensional flexible sin sobre-particionar.",
        "`Z-ORDER BY` permite modificar dinámicamente las claves de ordenación sin necesidad de reescribir ni reordenar los ficheros existentes en la tabla.",
        "`Liquid Clustering` soporta evolución de claves de clustering a lo largo del tiempo sin requerir redefinir ni reescribir toda la tabla históricamente.",
        "El particionamiento físico clásico por columnas de alta cardinalidad como `cliente_id` es la práctica oficial recomendada por Databricks para tablas grandes."
      ],
      "a": [
        0,
        2
      ],
      "e": "`Liquid Clustering` (`CLUSTER BY`) es la tecnología de optimización física recomendada en Databricks. A diferencia del particionamiento estricto por directorios, no sufre de particionamiento excesivo ni de skew, y permite evolucionar las columnas de clustering sin tener que reescribir el historial de la tabla. En contraste, `Z-ORDER` requiere re-ejecutar `OPTIMIZE ZORDER BY` explícitamente y no adapta sus claves de forma incremental.",
      "why": [
        null,
        "`Z-ORDER` no adapta dinámicamente sus claves; requiere re-ejecutar manualmente el comando `OPTIMIZE ... ZORDER BY` para reorganizar los datos.",
        null,
        "Particionar físicamente por columnas de alta cardinalidad genera millones de micro-carpetas (over-partitioning), degradando severamente el rendimiento."
      ]
    },
    {
      "id": "dbd-09",
      "d": 1,
      "t": "Mantenimiento con VACUUM y Retención",
      "q": "Un ingeniero de datos ejecuta periódicamente el comando `VACUUM` sobre una tabla Delta para liberar espacio en el almacenamiento de objetos. Un desarrollador sugiere ejecutar `SET spark.databricks.delta.vacuum.retentionCheck.enabled = false; VACUUM ventas RETAIN 0 HOURS;` después de cada micro-batch para mantener el bucket completamente limpio. ¿Por qué esta práctica representa un grave riesgo en producción?",
      "o": [
        "Porque borra permanentemente ficheros antiguos que podrían estar siendo leídos por consultas concurrentes activas y destruye la capacidad de Time Travel.",
        "Porque desactiva permanentemente el motor Photon en el clúster, forzando la compilación en modo interpretado no vectorizado de todas las consultas SQL posteriores en el catálogo.",
        "Porque provoca que Unity Catalog revoque automáticamente los privilegios `SELECT` de todos los grupos de usuarios sobre la tabla afectada en la base de datos.",
        "Porque sobreescribe el esquema de la tabla transformando todas las columnas numéricas en tipos binarios no serializables en los ficheros Parquet subyacentes."
      ],
      "a": 0,
      "e": "Delta Lake mantiene los ficheros marcados como eliminados (tombstoned) durante el periodo de retención de seguridad (por defecto 7 días o 168 horas). Si se desactiva el safety check y se purgan archivos con retención cero (`RETAIN 0 HOURS`), cualquier consulta analítica en ejecución que esté leyendo ficheros de versiones previas fallará de inmediato con errores de fichero no encontrado (`FileNotFoundException`), además de impedir el uso de Time Travel.",
      "why": [
        null,
        "`VACUUM` es una operación de mantenimiento en disco; no afecta al motor de ejecución Photon ni a la configuración del compilador de consultas.",
        "Los privilegios de Unity Catalog se gestionan en el metastore; la purga física de archivos de datos no altera los permisos RBAC asignados.",
        "`VACUUM` solo borra ficheros no referenciados físicamente; no modifica el esquema lógico de las columnas ni sus tipos de datos."
      ]
    },
    {
      "id": "dbd-10",
      "d": 1,
      "t": "Managed vs External Tables",
      "q": "Un equipo de infraestructura necesita definir una tabla en Databricks llamada `telemetria_nodos`. Quieren asegurarse de que si un usuario con permisos ejecuta accidentalmente `DROP TABLE telemetria_nodos;`, los archivos de datos en el bucket de S3 o ADLS Gen2 permanezcan completamente intactos. ¿Cómo debe declararse esta tabla?",
      "o": [
        "Como una tabla administrada (`Managed Table`) dentro del catálogo principal sin especificar ninguna cláusula de ubicación externa en el comando de creación.",
        "Como una tabla temporal global (`GLOBAL TEMP VIEW`) dentro de la base de datos del sistema para que resida permanentemente en almacenamiento volátil de clúster.",
        "Como una tabla externa (`External Table`) especificando explícitamente una ruta de almacenamiento con la cláusula `LOCATION 's3://bucket/ruta/'`.",
        "Como una vista estándar (`VIEW`) basada en una consulta `SELECT * FROM parquet` con almacenamiento gestionado en el metastore central de la región corporativa."
      ],
      "a": 2,
      "e": "En Databricks y Unity Catalog, las tablas creadas con la cláusula `LOCATION` son tablas externas (`External Tables`). Cuando se ejecuta `DROP TABLE` sobre una tabla externa, únicamente se eliminan los metadatos y el registro en el catálogo, pero los archivos físicos de datos en el almacenamiento de objetos permanecen completamente intactos.",
      "why": [
        "En una `Managed Table`, el comando `DROP TABLE` elimina tanto los metadatos como los archivos físicos de datos en el bucket.",
        "Una `GLOBAL TEMP VIEW` desaparece al terminar la aplicación/clúster de Spark y no persiste datos de manera duradera en el catálogo.",
        null,
        "Una vista no almacena datos por sí misma; la necesidad planteada es crear una tabla persistente con protección de los ficheros físicos subyacentes."
      ]
    },
    {
      "id": "dbd-11",
      "d": 1,
      "t": "Checkpoints de Metadatos en Delta Lake",
      "q": "Una tabla Delta ha registrado más de 20 000 transacciones de escritura a lo largo de seis meses. Un nuevo ingeniero se pregunta por qué las consultas no se degradan linealmente con el paso del tiempo al tener que leer decenas de miles de ficheros `.json` en el directorio `_delta_log/`. ¿Qué mecanismo interno evita esta degradación?",
      "o": [
        "El compilador Catalyst guarda una copia binaria fija de los metadatos en el disco duro local de cada máquina virtual worker del clúster de cómputo.",
        "Delta Lake genera automáticamente un fichero `.checkpoint.parquet` cada 10 transacciones, compactando el estado acumulado de la tabla hasta ese punto.",
        "Databricks ejecuta un proceso que elimina todos los ficheros JSON anteriores al último commit cada medianoche de forma irreversible en almacenamiento.",
        "Las lecturas ignoran el directorio `_delta_log` y leen los datos haciendo un escaneo directo de los ficheros Parquet mediante llamadas POSIX al bucket de nube."
      ],
      "a": 1,
      "e": "Cada 10 commits (por defecto), Delta Lake genera un archivo de checkpoint compactado en formato Parquet (ej. `000010.checkpoint.parquet`, `000020.checkpoint.parquet`). Al consultar la tabla, el motor solo necesita leer el último checkpoint Parquet y los pocos archivos JSON posteriores a este, reconstruyendo el estado completo de la tabla en memoria de forma casi instantánea.",
      "why": [
        "Los workers no persisten metadatos maestros en sus discos locales; el estado se deriva dinámicamente del `_delta_log` en almacenamiento de objetos.",
        null,
        "Delta Lake no borra los JSON anteriores arbitrariamente; los conserva para posibilitar el Time Travel según la retención de log configurada.",
        "Escanear directamente los ficheros sin consultar el `_delta_log` ignoraría los registros de transacciones, leyendo datos corruptos o eliminados."
      ]
    },
    {
      "id": "dbd-12",
      "d": 1,
      "t": "Cómputo: Motor de Ejecución Photon",
      "q": "Tu empresa procesa pipelines diarios con consultas Spark SQL muy pesadas que contienen múltiples agregaciones, filtros y uniones sobre cientos de millones de filas. Buscas reducir los tiempos de ejecución de las consultas sin modificar el código SQL ni cambiar la infraestructura de clústeres. ¿Qué componente de Databricks proporciona aceleración nativa vectorizada para este propósito?",
      "o": [
        "El motor `Photon`, un ejecutor nativo desarrollado en C++ que procesa consultas vectorizadas de forma paralela sustituyendo el runtime JVM de Spark.",
        "El servicio `Serverless SQL Warehouse` configurado exclusivamente con instancias de GPU para compilar consultas relacionales mediante núcleos CUDA.",
        "La extensión `Koalas` que convierte automáticamente todas las consultas SQL en operaciones de cálculo secuencial en una única máquina mediante Pandas.",
        "El módulo `GraphX` que transforma las tablas relacionales en grafos distribuidos en memoria para resolver filtros como caminos conexos en clúster."
      ],
      "a": 0,
      "e": "`Photon` es el motor de ejecución nativo de Databricks escrito desde cero en C++. Sustituye el motor de ejecución tradicional basado en JVM de Apache Spark por un motor columnar vectorizado que aprovecha el paralelismo a nivel de instrucción (SIMD) del hardware moderno, acelerando notablemente las cargas de trabajo SQL y DataFrame sin requerir cambios en el código de las consultas.",
      "why": [
        null,
        "Los SQL Warehouses utilizan CPU y pueden usar Photon; no requieren hardware de GPU ni compilación mediante CUDA para SQL relacional.",
        "Koalas es una API compatible con Pandas en PySpark; no acelera consultas SQL complejas ni reemplaza el motor de ejecución distribuido.",
        "GraphX es una librería para computación de grafos; no es un motor de aceleración para consultas relacionales o pipelines ELT estándar."
      ]
    },
    {
      "id": "dbd-13",
      "d": 2,
      "t": "Spark SQL: Consulta Directa a Archivos",
      "q": "Un analista de datos necesita inspeccionar rápidamente el contenido de varios archivos Parquet recién descargados en la ruta `dbfs:/mnt/landing/pedidos/` sin crear una tabla formal en el metastore ni registrar metadatos persistentes. ¿Qué sintaxis ANSI SQL de Databricks permite consultar estos archivos directamente?",
      "o": [
        "Ejecutar `OPEN FILE 'dbfs:/mnt/landing/pedidos/' FORMAT PARQUET;` para cargar el contenido en la consola interactiva del workspace de desarrollo.",
        "Ejecutar `SELECT * FROM parquet.`dbfs:/mnt/landing/pedidos/`;` utilizando la notación de formato y comillas invertidas alrededor de la ruta.",
        "Ejecutar `IMPORT TABLE pedidos FROM 'dbfs:/mnt/landing/pedidos/' TYPE PARQUET;` para instanciar un puntero volátil en memoria compartida.",
        "Ejecutar `READ_PARQUET('dbfs:/mnt/landing/pedidos/')` como una función escalar dentro de una cláusula `WHERE` en una sesión interactiva de Python."
      ],
      "a": 1,
      "e": "Spark SQL soporta consultas directas sobre ficheros almacenados en sistemas de archivos o buckets mediante la sintaxis `SELECT * FROM <formato>.`<ruta>``. Esto permite explorar datos en formatos Parquet, JSON, CSV, Delta o texto sin necesidad de registrar previamente tablas en el catálogo.",
      "why": [
        "La sentencia `OPEN FILE` no existe en la sintaxis de Spark SQL ni en el estándar ANSI SQL de Databricks.",
        null,
        "El comando `IMPORT TABLE` no es una sintaxis válida para consultar ficheros de forma ad-hoc en Spark SQL.",
        "`READ_PARQUET` no es una función escalar de Spark SQL para invocar en cláusulas WHERE; se usa notación de tabla directa o la API DataFrame."
      ]
    },
    {
      "id": "dbd-14",
      "d": 2,
      "t": "Ingestión Idempotente con COPY INTO",
      "q": "Un pipeline diario recibe miles de ficheros CSV en un bucket de nube y debe cargarlos en una tabla Delta de destino. Si el pipeline falla a mitad de ejecución y se reintenta, no deben insertarse registros duplicados de los ficheros que ya fueron procesados exitosamente. ¿Qué comando SQL declarativo ofrece esta garantía de carga incremental e idempotente?",
      "o": [
        "Utilizar `INSERT INTO delta_destino SELECT * FROM csv.`ruta/`;` confiando en que el optimizador Catalyst descarte ficheros leídos previamente.",
        "Ejecutar un script en bash con `rsync` que mueva los archivos procesados a una carpeta temporal antes de invocar un comando `LOAD DATA INPATH` en el metastore.",
        "Utilizar el comando `COPY INTO delta_destino FROM 'ruta/' FILEFORMAT = CSV FORMAT_OPTIONS ('header'='true');` que registra los ficheros ya cargados.",
        "Ejecutar `CREATE OR REPLACE TABLE delta_destino AS SELECT * FROM csv.`ruta/`;` para sobreescribir la tabla en cada ejecución diaria del pipeline."
      ],
      "a": 2,
      "e": "El comando `COPY INTO` es una instrucción SQL declarativa e idempotente diseñada para cargar ficheros nuevos de forma incremental en tablas Delta. Registra internamente los archivos ya procesados en los metadatos de la tabla; si se re-ejecuta sobre la misma carpeta, omite de forma automática los ficheros ya cargados sin duplicar datos.",
      "why": [
        "`INSERT INTO ... SELECT` inserta ciegamente todos los registros devueltos por la consulta, duplicando datos si se reintenta tras un fallo parcial.",
        "Mover archivos mediante bash es frágil, propenso a errores de concurrencia y no proporciona transaccionalidad ACID en la base de datos.",
        null,
        "`CREATE OR REPLACE TABLE` destruye los datos históricos previos en cada ejecución, impidiendo acumular datos históricos de forma incremental."
      ]
    },
    {
      "id": "dbd-15",
      "d": 2,
      "t": "Datos Semiestructurados: from_json",
      "q": "Una tabla de eventos en la capa Bronze almacena en la columna `payload_str` cadenas de texto con objetos JSON que contienen campos anidados: `{\"usuario_id\": 102, \"detalles\": {\"ip\": \"192.168.1.1\", \"accion\": \"login\"}}`. Quieres extraer el campo `ip` como una columna estructurada en la capa Silver. ¿Cuál es el método adecuado y de mejor rendimiento?",
      "o": [
        "Aplicar una expresión regular con `regexp_extract()` sobre la cadena de texto para buscar patrones de caracteres alfanuméricos entre comillas en la columna.",
        "Escribir una función personalizada UDF en Python puro que invoque la librería estándar `json.loads()` fila por fila en cada ejecutor distribuido del clúster.",
        "Dividir la cadena por comas y llaves utilizando `split()` y obtener el elemento en la posición estática mediante índices de array en la proyección final.",
        "Definir el esquema con `STRUCT` y deserializar la columna mediante `from_json(payload_str, 'STRUCT<usuario_id: INT, detalles: STRUCT<ip: STRING, accion: STRING>>')`."
      ],
      "a": 3,
      "e": "`from_json()` es la función nativa optimizada de Spark SQL para transformar cadenas JSON en tipos estructurados (`STRUCT` o `ARRAY`). Al proveer un esquema explícito o inferido con `schema_of_json()`, el motor Catalyst y Photon compilan la deserialización a código nativo de alta eficiencia, permitiendo acceder a los campos anidados mediante notación de puntos (`col.detalles.ip`).",
      "why": [
        "Las expresiones regulares con `regexp_extract` son lentas, frágiles ante cambios menores en el formato del JSON y propensas a errores de parsing.",
        "Una UDF de Python fila por fila sufre de una penalización severa de rendimiento por serialización IPC entre la JVM y el intérprete Python.",
        "Usar `split()` asume un orden posicional estricto en el JSON, lo cual falla tan pronto los campos cambian de orden o contienen comas internas.",
        null
      ]
    },
    {
      "id": "dbd-16",
      "d": 2,
      "t": "Funciones de Orden Superior: TRANSFORM",
      "q": "Tienes una tabla con la columna `precios_base` de tipo `ARRAY<DOUBLE>`. Necesitas aplicar un impuesto del 16 % a cada elemento del array, generando una nueva columna `precios_con_impuesto` de tipo `ARRAY<DOUBLE>` con los importes resultantes. ¿Qué función de orden superior de Spark SQL realiza esta transformación sin necesidad de desanidar el array?",
      "o": [
        "`TRANSFORM(precios_base, p -> round(p * 1.16, 2))` para aplicar la función lambda a cada elemento del array directamente en memoria.",
        "`FILTER(precios_base, p -> p * 1.16)` para multiplicar cada valor y devolver el conjunto transformado en una colección nueva en el catálogo.",
        "`EXPLODE_TRANSFORM(precios_base, p -> p * 1.16)` para desanidar temporalmente los elementos y reconstruir la lista automáticamente mediante un recolector interno.",
        "`MAP_VALUES(precios_base, p -> p * 1.16)` para iterar sobre los índices numéricos del array y actualizar los registros subyacentes en disco."
      ],
      "a": 0,
      "e": "La función de orden superior `TRANSFORM(array, element -> expression)` evalúa una expresión o función lambda sobre cada elemento de un array y devuelve un nuevo array con los resultados transformados. Esto evita el coste computacional de descomponer el array con `explode()` y luego reagruparlo con `collect_list()`.",
      "why": [
        null,
        "`FILTER` solo evalúa predicados booleanos para incluir o descartar elementos; no transforma los valores de los elementos del array.",
        "`EXPLODE_TRANSFORM` no existe en la especificación de Spark SQL ni en Databricks.",
        "`MAP_VALUES` opera sobre tipos de datos de mapa clave-valor (`MAP<K, V>`), no sobre arrays primitivos (`ARRAY<T>`)."
      ]
    },
    {
      "id": "dbd-17",
      "d": 2,
      "t": "Funciones de Orden Superior: FILTER y EXISTS",
      "q": "En una tabla de comercio electrónico, cada pedido tiene una columna `articulos` de tipo `ARRAY<STRUCT<nombre: STRING, categoria: STRING, precio: DOUBLE>>`. Quieres filtrar la tabla para seleccionar únicamente aquellos pedidos donde exista al menos un artículo de la categoría 'Electrónica' con un precio superior a 500 dólares. ¿Qué condición SQL en la cláusula `WHERE` resuelve el requerimiento de forma óptima?",
      "o": [
        "`WHERE articulos.categoria = 'Electrónica' AND articulos.precio > 500` invocando directamente campos del array como si fueran columnas escalares en la tabla.",
        "`WHERE EXISTS(articulos, a -> a.categoria = 'Electrónica' AND a.precio > 500)` utilizando la función de orden superior booleana.",
        "`WHERE ARRAY_CONTAINS(articulos.categoria, 'Electrónica') AND MAX(articulos.precio) > 500` combinando funciones de array y agregación en el WHERE de la consulta.",
        "`WHERE COUNT_IF(articulos, a -> a.categoria = 'Electrónica') >= 1` para contar las coincidencias en el array en tiempo de escaneo de disco del clúster."
      ],
      "a": 1,
      "e": "La función de orden superior `EXISTS(expr, x -> boolean_expression)` devuelve `true` si al menos un elemento del array cumple la condición booleana definida por la función lambda. Es la solución más limpia y eficiente en Spark SQL para verificar predicados sobre arrays complejos sin requerir `explode()`.",
      "why": [
        "No es posible acceder directamente a campos de un `ARRAY<STRUCT>` mediante notación escalar sin desanidar o usar funciones de orden superior.",
        null,
        "`ARRAY_CONTAINS` solo evalúa igualdad de elementos literales simples y no permite evaluar múltiples condiciones correlacionadas con predicados de precio.",
        "`COUNT_IF` es una función de agregación sobre columnas de una tabla, no una función de orden superior para arrays anidados."
      ]
    },
    {
      "id": "dbd-18",
      "d": 2,
      "t": "Deduplicación en Spark SQL",
      "q": "Un pipeline de ingesta procesa eventos de carritos de compra que contienen duplicados debido a reintentos en la red móvil. Los eventos tienen columnas `sesion_id`, `producto_id`, `cantidad` y `timestamp_evento`. Se requiere eliminar duplicados conservando exclusivamente el evento con la marca temporal más reciente para cada par (`sesion_id`, `producto_id`). ¿Qué dos técnicas en Spark SQL y DataFrames son correctas para lograrlo? (Elige 2 respuestas)",
      "o": [
        "Invocar `df.dropDuplicates([\"sesion_id\", \"producto_id\"])` tras ordenar previamente el DataFrame completo mediante `df.sort(\"timestamp_evento\")`.",
        "Calcular `ROW_NUMBER() OVER (PARTITION BY sesion_id, producto_id ORDER BY timestamp_evento DESC)` en una CTE y filtrar `WHERE row_num = 1`.",
        "Utilizar la cláusula `GROUP BY sesion_id, producto_id` seleccionando directamente `FIRST(cantidad)` sin definir un criterio de ordenamiento explícito.",
        "Utilizar `QUALIFY ROW_NUMBER() OVER (PARTITION BY sesion_id, producto_id ORDER BY timestamp_evento DESC) = 1` directamente en la consulta SQL."
      ],
      "a": [
        1,
        3
      ],
      "e": "Para conservar el registro más reciente de forma determinista, se utiliza la función de ventana `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY timestamp DESC)`. En Databricks y Spark SQL, esto puede resolverse mediante una expresión de tabla común (CTE) filtrando `row_num = 1` o de forma directa y elegante utilizando la cláusula `QUALIFY ROW_NUMBER() ... = 1`.",
      "why": [
        "`dropDuplicates` no garantiza conservar la fila más reciente tras un sort distribuido, ya que las particiones internas pueden alterar el orden de partición.",
        null,
        "`FIRST(cantidad)` sin ordenamiento es no determinista y puede devolver cualquier valor arbitrario en ejecuciones sucesivas.",
        null
      ]
    },
    {
      "id": "dbd-19",
      "d": 2,
      "t": "Operaciones Atómicas: MERGE INTO",
      "q": "Tienes una tabla Delta llamada `clientes_silver` y un lote de actualizaciones en la tabla temporal `updates_bronze`. Deseas actualizar el campo `email` y `direccion` de los clientes existentes y agregar los nuevos clientes que no existan previamente. ¿Qué instrucción SQL implementa este patrón de upsert atómico de manera correcta?",
      "o": [
        "Ejecutar un `UPDATE` masivo seguido de un `INSERT INTO clientes_silver SELECT * FROM updates_bronze WHERE id NOT IN (SELECT id FROM clientes_silver)` en dos transacciones separadas.",
        "Sobreescribir la partición completa utilizando la cláusula `INSERT OVERWRITE clientes_silver SELECT * FROM updates_bronze` en una única transacción de catálogo.",
        "`MERGE INTO clientes_silver AS t USING updates_bronze AS s ON t.id = s.id WHEN MATCHED THEN UPDATE SET t.email=s.email, t.direccion=s.direccion WHEN NOT MATCHED THEN INSERT *;`",
        "Crear una vista temporal combinada con `UNION ALL` y ejecutar un comando de compactación física con `OPTIMIZE clientes_silver ZORDER BY (id)` en el bucket."
      ],
      "a": 2,
      "e": "La sentencia `MERGE INTO` de Delta Lake permite realizar operaciones coordinadas de tipo Upsert (actualizaciones e inserciones) en una sola transacción atómica ACID. Evalúa la condición de coincidencia (`ON t.id = s.id`) y ejecuta las ramas `WHEN MATCHED` para actualizar filas existentes y `WHEN NOT MATCHED` para insertar nuevos registros.",
      "why": [
        "Ejecutar `UPDATE` seguido de `INSERT` son dos transacciones independientes que pueden generar condiciones de carrera y escaneos de tabla redundantes.",
        "`INSERT OVERWRITE` sobreescribe los datos existentes, borrando a todos los clientes que no estén presentes en el lote de actualizaciones actual.",
        null,
        "`UNION ALL` más `OPTIMIZE` simplemente acumula duplicados en la tabla sin actualizar registros ni reconciliar versiones de clientes."
      ]
    },
    {
      "id": "dbd-20",
      "d": 2,
      "t": "MERGE INTO con Eliminación Condicional",
      "q": "Un sistema de inventario envía registros de cambios en el catálogo. La tabla de origen `novedades_stock` incluye una columna `operacion` con valores 'UPDATE', 'INSERT' o 'DELETE'. Necesitas sincronizar la tabla Delta `stock_actual`. Si la operación es 'DELETE' y el producto coincide, debe eliminarse de la tabla destino. ¿Cómo se expresa esta lógica dentro de un comando `MERGE INTO`?",
      "o": [
        "Añadir una cláusula `WHEN MATCHED AND s.operacion = 'DELETE' THEN DROP ROW` en la primera condición de la sentencia MERGE de la consulta SQL.",
        "Crear un trigger externo de base de datos que capture los eventos de borrado y ejecute llamadas a la API REST de Databricks para su procesamiento.",
        "Ejecutar un procedimiento almacenado en Python que extraiga los IDs con 'DELETE' y ejecute un bucle `for` lanzando sentencias `DELETE FROM` individuales en clúster.",
        "Configurar la cláusula `WHEN MATCHED AND s.operacion = 'DELETE' THEN DELETE` antes de la cláusula de actualización estándar."
      ],
      "a": 3,
      "e": "Delta Lake admite múltiples cláusulas `WHEN MATCHED` evaluadas en orden de declaración. Para manejar borrados condicionales, se declara primero `WHEN MATCHED AND s.operacion = 'DELETE' THEN DELETE`, y posteriormente `WHEN MATCHED THEN UPDATE SET ...`. De esta forma, las filas marcadas para eliminación se purgan lógicamente de la tabla en la misma transacción atómica.",
      "why": [
        "La sintaxis `DROP ROW` no existe en la sentencia `MERGE INTO` de SQL estándar ni en Delta Lake (se utiliza la palabra clave `DELETE`).",
        "Databricks no soporta triggers tradicionales de base de datos OLTP y las llamadas REST añadirían una latencia inasumible al pipeline de datos.",
        "Un bucle secuencial en Python lanzando sentencias `DELETE` individuales genera miles de commits innecesarios en el `_delta_log` y degrada el clúster.",
        null
      ]
    },
    {
      "id": "dbd-21",
      "d": 2,
      "t": "Rendimiento de UDFs: SQL vs Python vs Pandas",
      "q": "Un ingeniero de datos necesita calcular una métrica financiera personalizada sobre 100 millones de filas. Puede implementar la función como una SQL UDF nativa, como una Python UDF estándar (`@udf`) o como una Pandas UDF vectorizada (`@pandas_udf`). Si el cálculo se puede expresar en expresiones matemáticas estándar, ¿cuál es la opción más eficiente?",
      "o": [
        "La `SQL UDF` nativa, porque Catalyst y el motor Photon la compilan directamente a código de máquina vectorizado sin sobrecarga de serialización.",
        "La `Python UDF` estándar, porque el recolector de basura de CPython gestiona la memoria de cada fila de forma más eficiente que la JVM de Spark.",
        "La `Pandas UDF`, porque siempre es más rápida que cualquier función nativa de SQL al ejecutarse en micro-lotes vectorizados de la librería NumPy en memoria.",
        "No hay diferencia de rendimiento medible entre las tres alternativas debido a que Catalyst optimiza todo el código a bytecode Java idéntico en el compilador."
      ],
      "a": 0,
      "e": "Las `SQL UDFs` nativas son las más eficientes en Databricks porque están totalmente integradas en el optimizador Catalyst y en el motor de ejecución vectorizado `Photon`. No sufren la sobrecarga de serialización IPC (intercambio entre JVM y el runtime de Python) que afecta a las Python UDFs estándar, y superan a las Pandas UDFs al evitar conversiones intermedias.",
      "why": [
        null,
        "Las Python UDFs estándar sufren un sobrecoste extremo de serialización fila por fila (Py4J/IPC), siendo la alternativa más lenta en Spark.",
        "Aunque las Pandas UDFs son mucho más rápidas que las Python UDFs estándar, siguen incurriendo en costes de serialización Arrow frente a una SQL UDF nativa.",
        "Catalyst no puede optimizar dentro del intérprete de Python en una Python UDF estándar; la diferencia de rendimiento suele ser de 10x a 100x."
      ]
    },
    {
      "id": "dbd-22",
      "d": 2,
      "t": "Manejo de Fechas y Marcas Temporales",
      "q": "En un reporte de facturación se requiere truncar la columna `timestamp_transaccion` (tipo TIMESTAMP) al primer día del mes correspondiente a las 00:00:00 para realizar agregaciones mensuales. ¿Cuál es la función recomendada en Spark SQL para realizar este truncamiento temporal?",
      "o": [
        "`DATE_FORMAT(timestamp_transaccion, 'yyyy-MM')` para convertir la marca temporal en una cadena de texto y luego filtrarla alfabéticamente en la consulta.",
        "`DATE_TRUNC('month', timestamp_transaccion)` que devuelve el timestamp ajustado al inicio de la unidad temporal indicada preservando el tipo.",
        "`TRUNCATE_TIME(timestamp_transaccion, '30 days')` calculando una resta fija de 30 días sobre la marca temporal en cada registro evaluado por el motor.",
        "`TO_MONTH_START(timestamp_transaccion)` que redondea matemáticamente el número de época Unix al múltiplo de segundos mensual más cercano en ejecución."
      ],
      "a": 1,
      "e": "La función `date_trunc(unit, timestamp)` de Spark SQL trunca una marca de tiempo a la unidad especificada (ej. `'month'`, `'year'`, `'day'`, `'hour'`), devolviendo un valor de tipo `TIMESTAMP` en el inicio exacto del periodo. Esto preserva el tipo de dato nativo para comparaciones y ordenaciones eficientes sin convertir a cadenas de texto.",
      "why": [
        "`date_format()` convierte el timestamp a `STRING`, lo cual degrada el rendimiento de índices, comparaciones temporales y operaciones de salto de datos.",
        null,
        "La función `TRUNCATE_TIME` no existe en la especificación de Spark SQL ni en Databricks.",
        "`TO_MONTH_START` no es una función de Spark SQL; los meses tienen duraciones variables (28-31 días) que no pueden calcularse con múltiplos fijos."
      ]
    },
    {
      "id": "dbd-23",
      "d": 2,
      "t": "Estructuras Anidadas: Acceso a Campos STRUCT",
      "q": "Tienes una columna `cliente` de tipo `STRUCT<nombre: STRING, direccion: STRUCT<ciudad: STRING, codigo_postal: INT>>`. Deseas proyectar la ciudad del cliente en una consulta SQL. ¿Qué sintaxis es válida para acceder al campo anidado `ciudad` en Databricks SQL?",
      "o": [
        "`SELECT cliente->direccion->ciudad FROM ventas;` utilizando operadores de puntero tipo flecha similares a lenguajes basados en C++.",
        "`SELECT EXTRACT_FIELD(cliente, 'direccion.ciudad') FROM ventas;` invocando una función auxiliar de inspección de metadatos de columnas del sistema.",
        "`SELECT cliente.direccion.ciudad FROM ventas;` utilizando la notación estándar de navegación por puntos sobre estructuras anidadas.",
        "`SELECT cliente['direccion']['ciudad']::string FROM ventas;` forzando el casteo de mapa clave-valor sobre estructuras de tupla en memoria distribuida."
      ],
      "a": 2,
      "e": "En Spark SQL y Databricks SQL, los campos dentro de un tipo de datos `STRUCT` se acceden de forma natural mediante la notación de puntos: `nombre_columna.campo.subcampo`. Esta sintaxis es intuitiva, conforme al estándar ANSI SQL y altamente optimizada por el motor de ejecución.",
      "why": [
        "El operador de flecha `->` se utiliza en funciones lambda (Higher-Order Functions), no para acceder a atributos de una estructura `STRUCT`.",
        "La función `EXTRACT_FIELD` no forma parte de la biblioteca de funciones integradas de Spark SQL.",
        null,
        "La indexación por corchetes con strings (`col['clave']`) se reserva para tipos `MAP`, no para atributos fuertemente tipados de un `STRUCT`."
      ]
    },
    {
      "id": "dbd-24",
      "d": 2,
      "t": "Desanidado de Arrays: explode vs posexplode",
      "q": "Una tabla contiene pedidos con una columna `items` de tipo `ARRAY<STRING>`. Algunos pedidos no contienen ningún artículo (`items` es un array vacío o `NULL`). Necesitas aplanar el array de manera que cada artículo ocupe su propia fila, pero sin perder aquellos pedidos que no tienen artículos (deben figurar con valor `NULL`). ¿Qué función SQL debe utilizarse?",
      "o": [
        "`SELECT pedido_id, explode(items) FROM pedidos;` confiando en que el motor mantenga automáticamente las filas con arrays nulos o vacíos en el resultado.",
        "`SELECT pedido_id, posexplode(items) FROM pedidos;` para generar tanto la posición entera como el valor correspondiente del elemento en cada fila.",
        "`SELECT pedido_id, unnest_all(items) FROM pedidos;` invocando la función estándar de aplanamiento dimensional de bases de datos PostgreSQL en clúster.",
        "`SELECT pedido_id, explode_outer(items) FROM pedidos;` para asegurar la conservación de las filas padre con arrays nulos o vacíos en el resultado."
      ],
      "a": 3,
      "e": "`explode_outer(col)` es la variante de `explode()` que preserva las filas cuyo array es `NULL` o está vacío (`size = 0`). A diferencia de `explode()`, que descarta silenciosamente estas filas (comportamiento análogo a un `INNER JOIN`), `explode_outer()` emite una fila con valor `NULL` para la columna aplanada (comportamiento análogo a un `LEFT OUTER JOIN`).",
      "why": [
        "`explode()` descarta automáticamente cualquier fila donde el array sea nulo o esté vacío, perdiendo los pedidos sin artículos.",
        "`posexplode()` añade una columna de índice de posición pero también descarta las filas vacías o nulas como `explode()` estándar.",
        "`unnest_all()` no es una función de Spark SQL en Databricks.",
        null
      ]
    },
    {
      "id": "dbd-25",
      "d": 2,
      "t": "Tipos de Vistas: Standard vs Temp vs Global Temp",
      "q": "Un ingeniero de datos crea una vista para un análisis temporal en un notebook interactivo: `CREATE TEMPORARY VIEW vista_temporal AS SELECT * FROM datos_raw;`. Posteriormente, otro colega intenta consultar `vista_temporal` desde otro clúster y recibe un error de tabla no encontrada. ¿Cuál es el motivo de este comportamiento?",
      "o": [
        "Las vistas temporales (`TEMPORARY VIEW`) tienen un ámbito estrictamente ligado a la sesión de Spark actual y no son visibles desde otros clústeres ni sesiones.",
        "El usuario que creó la vista no ejecutó el comando `GRANT SELECT ON VIEW vista_temporal TO PUBLIC;` en el metastore central corporativo de la cuenta.",
        "Las vistas temporales solo pueden consultar tablas en formato Parquet y fallan si los datos subyacentes se encuentran en formato Delta Lake en producción.",
        "El segundo colega no activó la propiedad `spark.sql.globalTempViews.crossClusterEnabled = true` en la configuración avanzada de su clúster de cómputo."
      ],
      "a": 0,
      "e": "En Apache Spark y Databricks, una `TEMPORARY VIEW` existe únicamente dentro del ámbito de la sesión de Spark (`SparkSession`) en la que fue declarada. No se registra en ningún catálogo persistente ni metastore, y se destruye automáticamente al terminar la sesión o apagar el clúster. No es accesible desde otros clústeres ni desde otras sesiones concurrentes.",
      "why": [
        null,
        "Las vistas temporales no se registran en Unity Catalog ni Hive Metastore; por tanto, no admiten sentencias `GRANT` de control de acceso.",
        "Las vistas temporales pueden consultar cualquier formato compatible con Spark, incluyendo Delta, Parquet, CSV y JSON sin ninguna restricción.",
        "No existe dicha propiedad de configuración de Spark; el aislamiento de sesión es intrínseco al ciclo de vida de una vista temporal."
      ]
    },
    {
      "id": "dbd-26",
      "d": 2,
      "t": "Funciones de Ventana: RANK vs DENSE_RANK",
      "q": "En una competición de ventas, dos empleados empatan en el primer puesto con 100 ventas cada uno, y el siguiente empleado tiene 90 ventas. Quieres que el empleado con 90 ventas figure en la posición 2 del ranking sin dejar huecos en la numeración. ¿Qué función de ventana analítica debe utilizarse en la consulta SQL?",
      "o": [
        "`ROW_NUMBER() OVER (ORDER BY ventas DESC)` para asignar números correlativos independientes de los empates en los valores de venta evaluados por la consulta.",
        "`DENSE_RANK() OVER (ORDER BY ventas DESC)` para asignar el mismo rango a los valores empatados sin generar saltos en la numeración posterior.",
        "`RANK() OVER (ORDER BY ventas DESC)` para calcular las posiciones dejando el hueco correspondiente al número de competidores empatados en la tabla.",
        "`PERCENT_RANK() OVER (ORDER BY ventas DESC)` para expresar la posición relativa de cada empleado como un porcentaje sobre el total de la plantilla evaluada."
      ],
      "a": 1,
      "e": "`DENSE_RANK()` asigna el mismo rango a valores idénticos en la cláusula `ORDER BY` y continúa con el número entero inmediatamente siguiente (1, 1, 2...). En contraste, `RANK()` dejaría un hueco (1, 1, 3...), y `ROW_NUMBER()` asignaría valores secuenciales únicos y arbitrarios a los empatados (1, 2, 3).",
      "why": [
        "`ROW_NUMBER()` rompería el empate asignando a uno la posición 1 y al otro la posición 2 de forma arbitraria y no determinista.",
        null,
        "`RANK()` dejaría un hueco tras el empate doble, asignando la posición 3 al siguiente empleado en lugar de la posición 2 requerida.",
        "`PERCENT_RANK()` calcula una fracción decimal relativa entre 0 y 1, no un número de posición entero ordinal de ranking."
      ]
    },
    {
      "id": "dbd-27",
      "d": 2,
      "t": "Agregaciones Multidimensionales: ROLLUP y CUBE",
      "q": "El equipo de analistas de negocio requiere un reporte de ventas que incluya subtotales acumulados jerárquicos: primero el total general de la empresa, luego los subtotales por año, y dentro de cada año los subtotales por mes y región. ¿Qué cláusula de agregación SQL resuelve esta jerarquía sin recurrir a múltiples sentencias `UNION ALL`?",
      "o": [
        "`GROUP BY region, mes, anio WITH RECURSIVE` para calcular iterativamente los acumulados mediante una expresión común de grafo en memoria.",
        "`GROUP BY CUBE (anio, mes, region)` para calcular exhaustivamente todas las $2^3 = 8$ combinaciones posibles de dimensiones sin importar jerarquía.",
        "`GROUP BY ROLLUP (anio, mes, region)` para generar los subtotales agregados en orden estrictamente jerárquico de izquierda a derecha.",
        "`GROUP BY anio, mes, region ORDER BY TOTALS DESC` forzando la inyección de filas calculadas sintéticamente en la etapa de ordenación final en clúster."
      ],
      "a": 2,
      "e": "`GROUP BY ROLLUP (a, b, c)` genera agregaciones jerárquicas progresivas considerando el orden de las columnas declaradas: `(a, b, c)`, `(a, b)`, `(a)` y el gran total general `()`. Es la cláusula óptima para generar reportes con subtotales estructurados jerárquicamente (ej. año &rarr; mes &rarr; región) en una sola pasada de agregación.",
      "why": [
        "`WITH RECURSIVE` se usa para consultas recursivas en grafos o árboles jerárquicos de registros; no es una cláusula para subtotales en `GROUP BY`.",
        "`CUBE` genera todas las combinaciones posibles de dimensiones, produciendo subtotales no jerárquicos innecesarios y aumentando el coste computacional.",
        null,
        "`ORDER BY TOTALS` no es una cláusula válida en Spark SQL para sintetizar filas de subtotales agregados."
      ]
    },
    {
      "id": "dbd-28",
      "d": 3,
      "t": "Structured Streaming: Modelo de Tabla Ilimitada",
      "q": "Un ingeniero de datos nuevo en Apache Spark asume que un flujo de Structured Streaming requiere reescribir la lógica de consultas de forma diferente a un procesamiento por lotes (batch). ¿Cuál es el concepto arquitectónico fundamental de Structured Streaming que unifica ambos paradigmas?",
      "o": [
        "Convierte el flujo de eventos en archivos CSV individuales en disco que se procesan mediante un script de polling en el sistema operativo del nodo driver.",
        "Ejecuta un servicio REST síncrono que almacena cada evento en una base de datos relacional externa antes de notificar a los suscriptores del catálogo.",
        "Transforma todos los datos en grafos dirigidos no cíclicos en memoria RAM gestionados por hilos independientes de CPython en el driver del clúster.",
        "Trata el flujo de datos continuo como una tabla ilimitada (unbounded table) sobre la que cada nuevo lote añade registros en modo append."
      ],
      "a": 3,
      "e": "El modelo conceptual de Spark Structured Streaming trata el flujo de datos continuo como una tabla ilimitada (*unbounded table*) que crece continuamente a medida que llegan nuevos datos. Esto permite expresar consultas de streaming utilizando exactamente las mismas APIs y optimizaciones Catalyst que en consultas por lotes (batch).",
      "why": [
        "Structured Streaming no genera archivos CSV temporales para polling; procesa micro-lotes en memoria o continuo directamente hacia sumideros Delta.",
        "Structured Streaming no depende de servicios REST síncronos ni bases de datos relacionales intermedias para coordinar la ingesta distribuida.",
        "El cómputo de Spark se basa en RDDs y DataFrames distribuidos en ejecutores JVM, no en grafos gestionados por CPython en el driver.",
        null
      ]
    },
    {
      "id": "dbd-29",
      "d": 3,
      "t": "Structured Streaming: Modos de Salida (Output Modes)",
      "q": "Un pipeline de streaming lee eventos de clics continuos y escribe directamente en una tabla Delta de la capa Silver en modo incremental sin realizar agregaciones ni agrupaciones. ¿Qué modo de salida (`outputMode`) debe configurarse en el `DataStreamWriter`?",
      "o": [
        "`outputMode(\"append\")` para emitir exclusivamente los nuevos registros procesados en cada micro-lote hacia la tabla Delta de destino.",
        "`outputMode(\"complete\")` para sobreescribir la tabla completa con el historial consolidado de eventos en cada micro-lote de streaming ejecutado.",
        "`outputMode(\"update\")` para recalcular el hash de cada fila e insertar únicamente registros que no existan previamente en el almacenamiento de objetos.",
        "`outputMode(\"snapshot\")` para volcar una copia estática de la memoria del nodo driver en formato binario hacia el catálogo corporativo de datos."
      ],
      "a": 0,
      "e": "El modo de salida `append` (por defecto en Structured Streaming) emite únicamente las filas nuevas procesadas en el micro-lote actual hacia el sumidero (sink). En consultas sin agregaciones, es el único modo soportado para tablas Delta incrementales, asegurando una escritura continua y atómica de nuevos registros.",
      "why": [
        null,
        "`complete` reescribe toda la tabla en cada trigger y solo está permitido en consultas con agregaciones; fallaría en una ingesta simple sin agrupaciones.",
        "`update` emite filas modificadas y en streaming sin agregaciones tiene un comportamiento equivalente a append, pero no calcula hashes de fila.",
        "`snapshot` no existe como modo de salida en Apache Spark Structured Streaming ni en Databricks."
      ]
    },
    {
      "id": "dbd-30",
      "d": 3,
      "t": "Structured Streaming: Checkpointing y Tolerancia a Fallos",
      "q": "Un trabajo de Structured Streaming crítico se detiene inesperadamente debido a una interrupción temporal de red con el almacenamiento de nube. Al reiniciar el clúster, el trabajo se reanuda automáticamente sin duplicar eventos ni perder registros pendientes. ¿Qué componente técnico hace posible esta recuperación con garantías `exactly-once`?",
      "o": [
        "El registro de transacciones de la base de datos relacional SQLite embebida en el disco local efímero del nodo driver de Databricks.",
        "El directorio de checkpoint (`checkpointLocation`) que persiste de forma duradera los logs de offsets leídos, commits y estado del streaming.",
        "La política de auto-reinicio del clúster que vuelve a solicitar todos los eventos históricos desde el timestamp de inicio original del origen transaccional.",
        "El mecanismo de replicación inter-nodo de Apache ZooKeeper configurado en los nodos trabajadores del clúster de cómputo del workspace corporativo."
      ],
      "a": 1,
      "e": "El directorio `checkpointLocation` es el pilar de la tolerancia a fallos en Structured Streaming. Almacena de forma duradera en almacenamiento de objetos (S3/ADLS/GCS) los registros de offsets leídos (`offsets/`), los commits confirmados (`commits/`) y el estado de agregaciones. Esto permite al motor reiniciar exactamente donde se interrumpió garantizando semántica *exactly-once*.",
      "why": [
        "Spark no utiliza SQLite en el driver para guardar checkpoints; el disco efímero del driver se destruye al reiniciar el clúster.",
        null,
        "Re-solicitar todo el histórico desde el inicio violaría la semántica exactly-once y generaría duplicados masivos en los sumideros.",
        "Databricks y Spark Structured Streaming no utilizan Apache ZooKeeper para la gestión de checkpoints ni para la coordinación de offsets."
      ]
    },
    {
      "id": "dbd-31",
      "d": 3,
      "t": "Auto Loader: Directory Listing vs File Notification",
      "q": "Tu empresa ingiere diariamente 500 000 archivos nuevos en un bucket S3 que ya acumula más de 10 millones de ficheros históricos. El pipeline actual que utiliza `spark.read` estándar tarda más de una hora solo en listar el contenido del bucket antes de comenzar a procesar. ¿Qué configuración de `Auto Loader` resuelve este cuello de botella?",
      "o": [
        "Configurar `cloudFiles.useIncrementalListing = false` para forzar un escaneo secuencial en un único hilo maestro en el nodo driver del clúster de cómputo.",
        "Utilizar `COPY INTO` con la opción de forzar re-indexación de carpetas de almacenamiento mediante llamadas POSIX al sistema de ficheros distribuido.",
        "Habilitar el modo de notificación de archivos (`cloudFiles.useNotifications = true`) utilizando colas de eventos (SNS/SQS) para recibir avisos.",
        "Dividir el bucket en 1 000 sub-carpetas y lanzar un clúster de 1 000 nodos ejecutando un comando `ls -R` en paralelo mediante scripts de bash en Linux."
      ],
      "a": 2,
      "e": "Auto Loader (`cloudFiles`) ofrece el modo **File Notification** (`cloudFiles.useNotifications = true`), que configura automáticamente servicios de eventos en la nube (AWS SNS/SQS, Azure Event Grid, GCP Pub/Sub). En lugar de listar directorios con millones de ficheros (lo cual es lento y costoso en APIs de almacenamiento), Auto Loader lee los avisos directamente de la cola de mensajes, detectando archivos nuevos al instante.",
      "why": [
        "Desactivar el listado incremental forzaría escaneos completos del bucket, empeorando el problema de rendimiento en lugar de resolverlo.",
        "`COPY INTO` en buckets con decenas de millones de archivos también sufre de latencias elevadas en el listado de archivos frente a colas de eventos.",
        null,
        "Lanzar 1 000 nodos para ejecutar comandos `ls` genera costes prohibitivos y llamadas excesivas que provocan throttling en la API de S3."
      ]
    },
    {
      "id": "dbd-32",
      "d": 3,
      "t": "Auto Loader: Evolución de Esquemas y _rescued_data",
      "q": "Un pipeline con Auto Loader (`format(\"cloudFiles\")`) procesa ficheros JSON de terceros. El proveedor suele añadir campos nuevos sin previo aviso y, en ocasiones, envía registros corruptos donde un campo numérico contiene texto. ¿Qué dos mecanismos de Auto Loader permiten gestionar esta situación sin fallar el pipeline ni perder datos? (Elige 2 respuestas)",
      "o": [
        "Configurar `cloudFiles.schemaEvolutionMode = 'addNewColumns'` para que Auto Loader agregue dinámicamente nuevas columnas al esquema de la tabla.",
        "Establecer `cloudFiles.enforceStrictTypes = true` para forzar que los registros con datos de tipo incorrecto se conviertan a cero de forma silenciosa.",
        "Utilizar `cloudFiles.dropMalformed = true` para eliminar de inmediato del almacenamiento los ficheros que contengan cualquier discrepancia de parsing.",
        "Aprovechar la columna `_rescued_data`, que captura automáticamente cualquier columna inesperada o dato corrupto en formato JSON sin romper la ingesta."
      ],
      "a": [
        0,
        3
      ],
      "e": "Auto Loader proporciona capacidades avanzadas de manejo de esquemas: 1) `cloudFiles.schemaEvolutionMode = 'addNewColumns'` amplía automáticamente el esquema de la tabla destino cuando detecta columnas nuevas en los archivos de entrada. 2) La columna especial `_rescued_data` captura cualquier campo que no coincida con el esquema esperado o que contenga valores malformados, asegurando que no se pierdan datos y permitiendo auditar anomalías posteriormente.",
      "why": [
        null,
        "`cloudFiles.enforceStrictTypes` no es una opción válida de Auto Loader y convertir silenciosamente a cero provocaría corrupción no detectable en datos numéricos.",
        "Auto Loader no descarta ficheros silenciosamente; su diseño prioriza la no pérdida de datos rescatando anomalías en `_rescued_data`.",
        null
      ]
    },
    {
      "id": "dbd-33",
      "d": 3,
      "t": "Structured Streaming: Triggers y Trigger.AvailableNow",
      "q": "Un equipo necesita ejecutar un pipeline de ingesta incremental en streaming una sola vez por noche. Quieren que procese todos los datos que hayan llegado durante el día dividiéndolos eficientemente en múltiples micro-lotes para no saturar la memoria del clúster, y que luego el clúster se apague automáticamente. ¿Qué disparador (`Trigger`) es la mejor práctica recomendada por Databricks?",
      "o": [
        "`trigger(continuous = '10 seconds')` para mantener el clúster encendido permanentemente en espera pasiva de nuevos registros en el bucket de nube.",
        "`trigger(processingTime = '1 hour')` para obligar al motor a pausar la ejecución exactamente durante 60 minutos antes de procesar el lote en curso.",
        "`trigger(once = true)` porque es la directiva que procesa todo en un único micro-lote masivo forzando el consumo total de la memoria RAM del driver.",
        "`trigger(availableNow = true)` para procesar incrementalmente todos los datos disponibles en micro-lotes eficientes y terminar el stream."
      ],
      "a": 3,
      "e": "`Trigger.AvailableNow` (o `availableNow = true`) es el disparador recomendado por Databricks para procesamiento incremental por lotes. A diferencia de `Trigger.Once` (que procesaba todo en un único micro-lote masivo pudiendo causar errores de OutOfMemory), `AvailableNow` procesa todos los datos pendientes acumulados dividiéndolos en múltiples micro-lotes de tamaño óptimo según los límites configurados, y termina la ejecución limpiamente.",
      "why": [
        "`continuous` mantiene el clúster encendido 24/7 con consumo continuo de DBUs, contradiciendo el requisito de ejecución nocturna y apagado.",
        "`processingTime = '1 hour'` ejecuta el stream en bucle infinito cada hora sin apagar el clúster al procesar los datos del día.",
        "`Trigger.Once` está en desuso frente a `Trigger.AvailableNow` porque procesaba todos los datos pendientes en un solo micro-lote descontrolado.",
        null
      ]
    },
    {
      "id": "dbd-34",
      "d": 3,
      "t": "Structured Streaming: Watermarking y Eventos Tardíos",
      "q": "Una consulta de streaming realiza agregaciones en ventanas temporales de 10 minutos (`window(timestamp, '10 minutes')`) para contar pedidos. Si no se configura un límite de tiempo de espera para eventos tardíos, el State Store en memoria crecerá indefinidamente hasta agotar la RAM del clúster (OOM). ¿Qué método de la API DataFrame resuelve este problema definiendo el umbral de descarte de datos tardíos?",
      "o": [
        "`withWatermark(\"timestamp\", \"20 minutes\")` que define el umbral temporal a partir del cual los eventos antiguos son descartados y el estado liberado.",
        "`dropOldEvents(delay = \"20 minutes\")` que elimina físicamente los registros retrasados del sistema de almacenamiento de objetos antes de leerlos.",
        "`setTimeToLive(\"timestamp\", 1200)` para marcar una caducidad de estilo Redis sobre cada clave individual en los nodos trabajadores del clúster corporativo.",
        "`filter(timestamp > current_timestamp() - interval 20 minutes)` aplicado estáticamente en la cláusula de proyección de la consulta inicial en streaming."
      ],
      "a": 0,
      "e": "El mecanismo de **Watermarking** (`withWatermark(timeColumn, delayThreshold)`) le indica al motor de Structured Streaming cuánto retraso temporal debe tolerar para eventos desordenados. Cuando la marca de agua avanza, el motor descarta cualquier evento que llegue con una marca de tiempo anterior al umbral y purga de forma segura el estado intermedio de la memoria, previniendo caídas por OutOfMemory (OOM).",
      "why": [
        null,
        "`dropOldEvents` no existe en la API de Apache Spark Structured Streaming ni en Databricks.",
        "`setTimeToLive` no es una función de Spark; Structured Streaming gestiona su estado mediante State Stores (HDFS o RocksDB) gobernados por watermarks.",
        "Usar `current_timestamp()` en streaming no es determinista y no permite al motor deducir cuándo cerrar y emitir ventanas de agregación pasadas."
      ]
    },
    {
      "id": "dbd-35",
      "d": 3,
      "t": "Delta Live Tables: Streaming Tables",
      "q": "En un pipeline de Delta Live Tables (DLT) definido en SQL, necesitas crear una tabla en la capa Bronze que ingiera continuamente nuevos ficheros de registro desde un directorio en la nube usando Auto Loader. ¿Qué sintaxis declarativa de DLT define adecuadamente esta tabla como un dataset de ingesta estrictamente incremental?",
      "o": [
        "`CREATE MATERIALIZED VIEW raw_logs AS SELECT * FROM cloud_files('/mnt/raw/', 'json');` para refrescar la tabla entera periódicamente en cada ejecución.",
        "`CREATE OR REFRESH STREAMING TABLE raw_logs AS SELECT * FROM STREAM read_files('/mnt/raw/', format => 'json');`",
        "`CREATE TEMPORARY TABLE raw_logs AS SELECT * FROM STREAMING_READ('/mnt/raw/') WITH OPTIONS ('mode'='incremental') en el catálogo de metadatos.",
        "`CREATE EXTERNAL DELTA TABLE raw_logs LOCATION '/mnt/raw/' AS SELECT * FROM json.`/mnt/raw/` WHERE _is_new = true en el metastore central corporativo.`"
      ],
      "a": 1,
      "e": "En Delta Live Tables con SQL, las tablas diseñadas para ingestión y procesamiento puramente incremental (append-only) se definen con la sintaxis `CREATE OR REFRESH STREAMING TABLE <nombre> AS SELECT * FROM STREAM <fuente>`. La palabra clave `STREAM` le indica a DLT que debe consumir la fuente como un flujo continuo incremental.",
      "why": [
        "Una `MATERIALIZED VIEW` recalcula su contenido ante cambios en las fuentes, no está diseñada para ingestión incremental continua append-only.",
        null,
        "La sintaxis `STREAMING_READ` y `CREATE TEMPORARY TABLE` no forman parte del framework declarativo de Delta Live Tables.",
        "`CREATE EXTERNAL DELTA TABLE` con un filtro artificial `_is_new` no utiliza las capacidades de streaming ni el tracking transaccional de DLT."
      ]
    },
    {
      "id": "dbd-36",
      "d": 3,
      "t": "Delta Live Tables: Materialized Views vs Streaming Tables",
      "q": "Estás diseñando la capa Gold en un pipeline de Delta Live Tables. La tabla de destino requiere calcular el importe total acumulado y el número de transacciones por cliente a partir de la tabla Silver, realizando agregaciones complejas y requiriendo consistencia completa ante actualizaciones históricas de datos. ¿Por qué se debe elegir una `Materialized View` en lugar de una `Streaming Table`?",
      "o": [
        "Porque las Materialized Views no consumen unidades DBU de cómputo en Databricks al ser procesadas enteramente dentro del metastore de la región.",
        "Porque las Streaming Tables tienen prohibido por especificación ejecutar cualquier cláusula `WHERE` o aplicar transformaciones de filtrado lógico.",
        "Porque las Materialized Views recalculan y mantienen el estado agregado coherente ante modificaciones y borrados en las fuentes de datos.",
        "Porque las Streaming Tables solo pueden almacenar un máximo de 10 000 registros antes de requerir un comando manual de compactación física en disco."
      ],
      "a": 2,
      "e": "En Delta Live Tables, las `Materialized Views` están diseñadas específicamente para transformaciones complejas, uniones (joins) y agregaciones en capas Silver/Gold. Cuando los datos de origen sufren modificaciones, inserciones o eliminaciones, DLT recalcula y sincroniza el estado de la Materialized View para reflejar el estado actual exacto del negocio, mientras que las `Streaming Tables` están restringidas a flujos incrementales de solo adición (*append-only*).",
      "why": [
        "Las Materialized Views consumen cómputo de clúster estándar facturado en DBUs al ejecutar las consultas de transformación.",
        "Las Streaming Tables pueden aplicar perfectamente cláusulas `WHERE`, transformaciones y proyecciones siempre que la fuente sea incremental.",
        null,
        "Las Streaming Tables son completamente escalables a miles de millones de filas; no tienen ningún límite arbitrario de 10 000 registros."
      ]
    },
    {
      "id": "dbd-37",
      "d": 3,
      "t": "DLT: Expectativas de Calidad (DROP ROW)",
      "q": "En una canalización de Delta Live Tables (DLT), el equipo de calidad de datos estipula la siguiente regla: los registros con un `cliente_id` nulo o una `edad` menor a 18 años deben ser descartados silenciosamente sin detener la ejecución del pipeline, registrando el número de registros omitidos en las métricas de DLT. ¿Qué cláusula de expectativa cumple este requisito?",
      "o": [
        "`CONSTRAINT regla_edad CHECK (cliente_id IS NOT NULL AND edad >= 18) ON ERROR SKIP RECORD en el catálogo corporativo de metadatos.`",
        "`EXPECT (cliente_id IS NOT NULL AND edad >= 18) ON VIOLATION ABORT PIPELINE con notificación inmediata al equipo de operaciones de guardia.`",
        "`EXPECT (cliente_id IS NOT NULL AND edad >= 18) ON INVALID DISCARD INTO DLQ aislando filas no conformes en una tabla secundaria de auditoría.`",
        "`CONSTRAINT clientes_validos EXPECT (cliente_id IS NOT NULL AND edad >= 18) ON VIOLATION DROP ROW`"
      ],
      "a": 3,
      "e": "Delta Live Tables proporciona la cláusula `ON VIOLATION DROP ROW` dentro de la definición de expectativas (`CONSTRAINT ... EXPECT ... ON VIOLATION DROP ROW`). Esta acción filtra y descarta de forma automática cualquier fila que no satisfaga la condición booleana, permitiendo que las filas válidas continúen hacia la tabla destino y registrando las métricas de filas descartadas en el Event Log de DLT.",
      "why": [
        "La sintaxis `CHECK ... ON ERROR SKIP RECORD` no existe en la especificación declarativa de Delta Live Tables.",
        "`ON VIOLATION ABORT PIPELINE` no es una cláusula válida; para abortar la ejecución se utiliza `ON VIOLATION FAIL UPDATE`.",
        "`ON INVALID DISCARD INTO DLQ` no es sintaxis de DLT; el aislamiento de registros en colas de mensajes se implementa con patrones de bifurcación de tablas.",
        null
      ]
    },
    {
      "id": "dbd-38",
      "d": 3,
      "t": "DLT: Expectativas de Calidad (FAIL UPDATE vs Warn)",
      "q": "Un pipeline regulatorio de conciliación bancaria en Delta Live Tables no puede tolerar bajo ninguna circunstancia que la columna `monto_transferencia` sea negativa o nula. Si un solo registro viola esta condición, todo el pipeline debe detenerse de inmediato y marcar la ejecución en estado de error para alertar a los ingenieros. ¿Qué expectativa de DLT garantiza este comportamiento?",
      "o": [
        "`CONSTRAINT monto_positivo EXPECT (monto_transferencia > 0) ON VIOLATION FAIL UPDATE`",
        "`EXPECT (monto_transferencia > 0) ON VIOLATION DROP ROW descartando silenciosamente la fila para continuar el procesamiento sin errores.`",
        "`CONSTRAINT monto_positivo EXPECT (monto_transferencia > 0) emitiendo únicamente una advertencia en el registro de métricas de calidad del sistema.`",
        "`EXPECT (monto_transferencia > 0) ON ANOMALY RAISE CRITICAL ALERT deteniendo el servicio de red del clúster de cómputo de la cuenta corporativa.`"
      ],
      "a": 0,
      "e": "La acción `ON VIOLATION FAIL UPDATE` es la directiva más estricta en las expectativas de Delta Live Tables. Si cualquier fila procesada incumple la condición booleana (`monto_transferencia > 0`), DLT aborta inmediatamente la actualización del pipeline, previene la persistencia de datos corruptos y marca la ejecución del job en estado fallido para activar alertas de guardia.",
      "why": [
        null,
        "`ON VIOLATION DROP ROW` descartaría la fila y continuaría la ejecución exitosamente, lo cual viola el requisito regulatorio estricto.",
        "Omitir la cláusula `ON VIOLATION` (expectativa por defecto) solo emite una advertencia en los logs pero conserva el registro y continúa el pipeline.",
        "`ON ANOMALY RAISE CRITICAL ALERT` no es una sintaxis reconocida por el compilador declarativo de Delta Live Tables."
      ]
    },
    {
      "id": "dbd-39",
      "d": 4,
      "t": "Databricks Workflows: Cómputo Job vs All-Purpose",
      "q": "El equipo de ingeniería de datos ejecuta una serie de pipelines diarios programados mediante Databricks Workflows. Actualmente, todas las tareas están configuradas para ejecutarse sobre un clúster interactivo existente ('All-Purpose Cluster') que permanece encendido todo el día. El director de TI solicita reducir la factura mensual de DBUs y aislar las ejecuciones. ¿Qué cambio arquitectónico debe aplicarse?",
      "o": [
        "Configurar los notebooks para que se ejecuten en clústeres locales en las estaciones de trabajo de los desarrolladores mediante túneles SSH.",
        "Configurar las tareas del Workflow para que utilicen 'Job Clusters' (clústeres automatizados efímeros) creados y destruidos en cada ejecución.",
        "Aumentar el número de workers del clúster interactivo actual para que las tareas terminen en menos minutos y reduzcan el uso global.",
        "Migrar los trabajos a una máquina virtual standalone sin Apache Spark utilizando scripts de Python estándar ejecutados con crontab."
      ],
      "a": 1,
      "e": "Los `Job Clusters` (clústeres automatizados para trabajos) son la práctica mandatoria para cargas de producción en Databricks Workflows. Databricks los crea al inicio del trabajo y los destruye inmediatamente al finalizar, garantizando aislamiento total de recursos y facturando a una tarifa DBU significativamente reducida (~50-60 % de descuento respecto a los All-Purpose Clusters interactivos).",
      "why": [
        "Ejecutar cargas corporativas mediante túneles SSH en portátiles personales rompe la seguridad, escalabilidad y disponibilidad del Lakehouse.",
        null,
        "Aumentar los workers de un clúster interactivo All-Purpose que permanece activo todo el día incrementa drásticamente los costes de DBU.",
        "Eliminar Apache Spark impide procesar grandes volúmenes distribuidos y descarta las ventajas de gobernanza y optimización de Databricks."
      ]
    },
    {
      "id": "dbd-40",
      "d": 4,
      "t": "Workflows: Orquestación y TaskValues",
      "q": "Tienes un Workflow con dos tareas: la Tarea A procesa un lote de ventas y calcula el número total de registros anómalos detectados; la Tarea B necesita leer ese conteo numérico para decidir si genera un reporte ejecutivo o envía un correo de alerta. ¿Cómo se comunican estos parámetros dinámicos entre tareas de un DAG en Databricks Workflows?",
      "o": [
        "Escribir el valor en un archivo temporal en `/tmp` del sistema operativo local del nodo worker y leerlo desde la Tarea B mediante comandos shell.",
        "Crear una cola de mensajes en memoria compartida mediante variables de entorno del sistema operativo exportadas en el clúster interactivo.",
        "Utilizar la utilidad de tareas `dbutils.jobs.taskValues.set()` en la Tarea A y `dbutils.jobs.taskValues.get()` en la Tarea B.",
        "Sobreescribir el código fuente del notebook de la Tarea B mediante una llamada a la API REST de Databricks antes de que inicie su ejecución."
      ],
      "a": 2,
      "e": "`taskValues` es la funcionalidad integrada de Databricks Workflows para pasar pequeños valores y metadatos entre tareas dependientes de un mismo DAG. La tarea emisora invoca `dbutils.jobs.taskValues.set(key, value)` y la tarea receptora downstream recupera el valor mediante `dbutils.jobs.taskValues.get(taskKey, key)` sin requerir tablas intermedias ni almacenamiento externo.",
      "why": [
        "El directorio `/tmp` local es efímero y reside en nodos distintos que pueden destruirse entre tareas, impidiendo compartir datos.",
        "Las variables de entorno del sistema operativo no se propagan entre clústeres distintos ni entre tareas desacopladas de un Workflow.",
        null,
        "Modificar el código fuente de los notebooks mediante la API REST durante la ejecución en curso es una práctica insegura y desaconsejada."
      ]
    },
    {
      "id": "dbd-41",
      "d": 4,
      "t": "Workflows: Recuperación con Repair and Rerun",
      "q": "Un trabajo de Databricks Workflows compuesto por un grafo DAG de 6 tareas encadenadas se ejecuta durante la noche. Las tres primeras tareas (ingesta, validación y filtrado) se completan exitosamente tras dos horas de cómputo, pero la cuarta tarea falla debido a un error de conexión transitorio con un servicio de geolocalización. Tras corregir la incidencia en el servicio externo, ¿cuál es la forma más eficiente de relanzar el trabajo?",
      "o": [
        "Borrar el historial de ejecuciones del job en la interfaz de usuario de Databricks y programar un nuevo trigger inmediato para toda la canalización.",
        "Clonar el Workflow completo creando una copia duplicada en el espacio de trabajo que contenga únicamente las tareas restantes del grafo.",
        "Re-ejecutar el trabajo desde el inicio con el botón 'Run now', permitiendo que las tres tareas iniciales vuelvan a consumir dos horas de cómputo.",
        "Utilizar la funcionalidad 'Repair and Rerun' en la corrida fallida para re-ejecutar exclusivamente la tarea 4 y sus tareas dependientes aguas abajo."
      ],
      "a": 3,
      "e": "La característica **Repair and Rerun** (Reparar y re-ejecutar) de Databricks Workflows permite relanzar una ejecución fallida procesando únicamente las tareas que fallaron y aquellas que dependen de ellas aguas abajo en el DAG. Respeta y conserva los resultados exitosos de las tareas previas, ahorrando horas de cómputo y costes innecesarios de DBU.",
      "why": [
        "Borrar el historial elimina la trazabilidad de auditoría y no resuelve la necesidad de reanudar el procesamiento del flujo.",
        "Clonar manualmente el Workflow para cada fallo es ineficiente, genera desorden en el workspace y complica el mantenimiento.",
        "Re-ejecutar el trabajo completo desde cero desperdicia dos horas de cómputo y costes en tareas que ya finalizaron exitosamente.",
        null
      ]
    },
    {
      "id": "dbd-42",
      "d": 4,
      "t": "Políticas de Clúster (Cluster Policies)",
      "q": "El departamento financiero de tu empresa detecta sobrecostes en la factura de la nube debido a que algunos desarrolladores olvidan apagar sus clústeres interactivos durante los fines de semana y aprovisionan instancias con GPUs para tareas que solo requieren SQL básico. ¿Qué dos medidas implementadas mediante `Cluster Policies` resuelven estos problemas de gobernanza de costes? (Elige 2 respuestas)",
      "o": [
        "Desactivar por completo el servicio de Unity Catalog en todo el workspace para que nadie pueda aprovisionar máquinas virtuales.",
        "Imponer un valor máximo obligatorio en `autotermination_minutes` (ej. 20 minutos) para forzar el apagado automático tras inactividad.",
        "Restringir las familias de instancias permitidas en `node_type_id`, bloqueando la selección de tipos de máquinas de GPU o de coste excesivo.",
        "Configurar un script en bash que mate aleatoriamente procesos Java en el driver cada vez que el uso de memoria supere el 50 por ciento."
      ],
      "a": [
        1,
        2
      ],
      "e": "Las **Cluster Policies** (Políticas de Clúster) son la herramienta central de gobernanza de cómputo y FinOps en Databricks. Permiten a los administradores: 1) Forzar una regla de auto-terminación (`autotermination_minutes`) que apague clústeres inactivos tras un tiempo predefinido. 2) Limitar las familias de instancias permitidas (`node_type_id`), impidiendo el aprovisionamiento de tipos costosos como GPUs salvo en proyectos autorizados.",
      "why": [
        "Unity Catalog es el motor de gobernanza de datos y no tiene relación con forzar el apagado de máquinas virtuales.",
        null,
        null,
        "Matar procesos Java de forma aleatoria causaría fallos catastróficos e inconsistencias en lugar de implementar una política de costes ordenada."
      ]
    },
    {
      "id": "dbd-43",
      "d": 4,
      "t": "Control de Versiones: Databricks Repos",
      "q": "Un equipo de 10 ingenieros de datos necesita colaborar en un mismo repositorio de código que contiene notebooks y módulos en ficheros `.py`. Desean trabajar con flujos de Git estándar (crear ramas de desarrollo, pull requests y pruebas antes de fusionar a la rama `main`) y asegurar que los jobs de producción ejecuten código versionado estable. ¿Qué solución nativa de Databricks proporciona esta integración?",
      "o": [
        "Exportar manualmente cada notebook a un fichero comprimido `.dbc` al final de la jornada y enviarlo por correo electrónico al líder técnico de datos.",
        "Copiar el código de los notebooks en una tabla Delta común en la capa Bronze y sincronizar versiones mediante sentencias `MERGE INTO` concurrentes.",
        "Instalar un servidor local de Git en el nodo driver del clúster interactivo ejecutando un servicio daemon mediante comandos de terminal de Linux.",
        "Utilizar `Databricks Repos`, conectando el workspace con proveedores Git remotos para gestionar ramas, commits y control de versiones a nivel de usuario."
      ],
      "a": 3,
      "e": "`Databricks Repos` integra el entorno de Databricks con proveedores Git externos (GitHub, GitLab, Azure DevOps, Bitbucket). Permite a los desarrolladores trabajar en ramas individuales, sincronizar cambios con `git pull` y `git push`, importar módulos `.py` modulares y configurar trabajos productivos de Workflows para que apunten a tags o ramas de release estables.",
      "why": [
        "Exportar manualmente ficheros `.dbc` por correo no provee control de versiones, dificulta el merge y es susceptible a fallos humanos graves.",
        "Guardar código fuente dentro de tablas Delta como cadenas de texto no es un sistema de control de versiones y no soporta flujos Git.",
        "Instalar un servidor Git en el driver no es escalable, carece de alta disponibilidad y se destruye al reiniciar el clúster interactivo.",
        null
      ]
    },
    {
      "id": "dbd-44",
      "d": 4,
      "t": "Monitoreo y Alertas en Workflows",
      "q": "Un pipeline multi-tarea de conciliación bancaria programado en Databricks Workflows es crítico para la apertura del mercado bursátil. Si el trabajo falla o su duración se extiende más allá de 45 minutos (SLA de negocio), el equipo de operaciones SRE debe recibir una notificación de alta prioridad en su canal de incidentes. ¿Cómo se configura este monitoreo en Databricks Workflows?",
      "o": [
        "Crear un notebook interactivo en un bucle `while True` que consulte la API REST de Databricks cada 5 segundos y envíe alertas de red por socket.",
        "Configurar notificaciones del job en la interfaz de Workflows, asociando un destino Webhook o correo para eventos de fallo y umbrales de SLA de duración.",
        "Inspeccionar visualmente la consola de Databricks cada mañana a las 06:00 AM refrescando manualmente la página en un navegador web.",
        "Modificar el kernel de Linux en las máquinas virtuales worker para emitir señales SNMP hacia una pasarela de monitorización local en la intranet."
      ],
      "a": 1,
      "e": "Databricks Workflows incluye soporte nativo para **Alertas y Notificaciones**. Permite configurar reglas de notificación ante eventos del job (inicio, éxito, fallo) y umbrales de SLA de tiempo de ejecución (ej. alertar si la duración supera 45 minutos). Las notificaciones se despachan automáticamente a direcciones de correo electrónico o destinos de sistema como Webhooks (Slack, PagerDuty, MS Teams).",
      "why": [
        "Un bucle infinito en un notebook consume un clúster entero de forma innecesaria y añade fragilidad operativa frente a las alertas nativas del job.",
        null,
        "La inspección manual no es escalable, no proporciona alertas en tiempo real y no garantiza el cumplimiento de SLAs críticos.",
        "Modificar el kernel de Linux en nodos efímeros es impracticable, viola la arquitectura administrada y se pierde en cada recreación del clúster."
      ]
    },
    {
      "id": "dbd-45",
      "d": 4,
      "t": "CI/CD con Databricks Asset Bundles (DABs)",
      "q": "Tu organización adopta prácticas de DevOps para datos y requiere que todos los pipelines de Delta Live Tables, trabajos de Workflows y permisos asociados se definan como código (IaC), se testen automáticamente en pipelines de GitHub Actions y se desplieguen programáticamente en entornos de desarrollo, staging y producción. ¿Qué herramienta oficial de Databricks está diseñada específicamente para este flujo?",
      "o": [
        "El comando interactivo `dbfs cp` integrado en el cliente de terminal de Linux para transferir notebooks de una carpeta a otra en el metastore.",
        "Un script en bash que genere capturas de pantalla de la interfaz gráfica y las envíe a los administradores del workspace para aprobación manual.",
        "`Databricks Asset Bundles (DABs)`, que permite gestionar proyectos como código declarativo mediante ficheros YAML y la CLI de Databricks.",
        "El gestor de paquetes `pip` para compilar todo el workspace corporativo como una distribución wheel binaria cerrada de Python puro."
      ],
      "a": 2,
      "e": "`Databricks Asset Bundles (DABs)` es el marco oficial de Databricks para implementar CI/CD e Infraestructura como Código (IaC). Permite definir estructuras completas de proyectos (pipelines DLT, jobs, permisos, cómputo) en ficheros declarativos YAML (`databricks.yml`), validarlos con `databricks bundle validate` y desplegarlos en múltiples entornos con `databricks bundle deploy` a través de herramientas CI/CD como GitHub Actions o GitLab CI.",
      "why": [
        "`dbfs cp` solo copia ficheros al almacenamiento; no define pipelines declarativos, jobs, dependencias ni infraestructura como código.",
        "Las capturas de pantalla y aprobaciones manuales son el opuesto de la automatización CI/CD recomendada por las prácticas modernas de DevOps.",
        null,
        "`pip` y wheels compilan librerías de código Python, pero no orquestan jobs, pipelines DLT ni infraestructura en los workspaces de Databricks."
      ]
    },
    {
      "id": "dbd-46",
      "d": 4,
      "t": "Optimización de Cómputo: Autoscaling y Spot Instances",
      "q": "Un pipeline de procesamiento ETL diario experimenta fluctuaciones de volumen extremas: los lunes procesa 100 millones de registros debido a la acumulación del fin de semana, pero de martes a viernes solo procesa 10 millones. Si se aprovisiona un clúster estático grande, se desperdicia presupuesto durante la semana; si se aprovisiona uno pequeño, el pipeline de los lunes incumple el SLA. ¿Qué configuración de clúster equilibra coste y rendimiento?",
      "o": [
        "Aprovisionar un clúster estático con 100 nodos dedicados fijos y dejarlo encendido permanentemente para garantizar capacidad en el peor caso posible.",
        "Ejecutar el pipeline en el nodo driver exclusivamente desactivando todos los nodos trabajadores para evitar el coste de red inter-nodo de Spark.",
        "Contratar una reserva fija de instancias de cómputo en la nube por 3 años para el clúster interactivo independientemente del uso real registrado.",
        "Habilitar el autoescalado de clúster (`Autoscaling`) con un rango de workers (ej. 2 a 20) y utilizar instancias Spot para los workers secundarios."
      ],
      "a": 3,
      "e": "El **autoescalado de clústeres** (`Autoscaling`) permite a Databricks añadir dinámicamente nodos trabajadores cuando la carga de trabajo y el número de etapas de Spark lo requieren (ej. el pico del lunes) y reducirlos cuando la demanda desciende. Combinarlo con **instancias Spot** para los workers (manteniendo el nodo driver en instancia bajo demanda) reduce drásticamente el coste de infraestructura en la nube.",
      "why": [
        "Un clúster estático masivo encendido continuamente genera un desperdicio presupuestario inaceptable durante los días de baja demanda.",
        "Ejecutar todo en el driver elimina el paralelismo distribuido de Spark y provoca fallos catastróficos por falta de memoria (OutOfMemory).",
        "Las reservas fijas a 3 años para cargas elásticas con picos puntuales no aprovechan la elasticidad intrínseca de la nube y aumentan el TCO.",
        null
      ]
    },
    {
      "id": "dbd-47",
      "d": 5,
      "t": "Unity Catalog: Espacio de Nombres de 3 Niveles",
      "q": "Un ingeniero de datos en una corporación multinacional necesita referenciar de forma inequívoca la tabla de clientes ubicada en el dominio de ventas del entorno de producción gobernado por Unity Catalog. ¿Cuál es el formato canónico del espacio de nombres de tres niveles que debe utilizarse en las consultas SQL?",
      "o": [
        "`cluster.database.table` (por ejemplo, `etl_cluster_01.ventas.clientes`), identificando el clúster que procesa la consulta en tiempo real.",
        "`metastore.workspace.table` (por ejemplo, `global_ms.workspace_01.clientes`), identificando el metastore de región y el workspace local.",
        "`bucket.folder.table` (por ejemplo, `s3_lakehouse.ventas_curated.clientes`), identificando la ruta física del almacenamiento de objetos de la nube.",
        "`catalog.schema.table` (por ejemplo, `prod_corp.ventas.clientes`), identificando catálogo, esquema (base de datos) y tabla."
      ],
      "a": 3,
      "e": "Unity Catalog estandariza la resolución de objetos mediante un **espacio de nombres de 3 niveles** jerárquico: `<catalogo>.<esquema>.<tabla>` (o vista / volumen / modelo). El primer nivel (`catalog`) suele representar el entorno o dominio de negocio, el segundo (`schema` o base de datos) la agrupación lógica funcional, y el tercero (`table`) la entidad de datos concreta.",
      "why": [
        "Las tablas están completamente desacopladas de los clústeres de cómputo en Unity Catalog; no se nombran según el clúster que las ejecuta.",
        "El metastore y el workspace son niveles de infraestructura de gestión; no forman parte de la sintaxis SQL de consulta de datos.",
        "`bucket.folder.table` describe rutas de almacenamiento físico, mientras que Unity Catalog provee una abstracción lógica unificada de gobernanza.",
        null
      ]
    },
    {
      "id": "dbd-48",
      "d": 5,
      "t": "Unity Catalog: Credenciales y External Locations",
      "q": "El equipo de seguridad de la nube prohíbe terminantemente que los ingenieros de datos tengan acceso a claves de acceso de AWS IAM o conexiones con cadenas de texto secretas en los notebooks. Sin embargo, los ingenieros deben poder leer y escribir ficheros en la ruta `s3://empresa-datalake/silver/`. ¿Cómo resuelve Unity Catalog este requerimiento de acceso seguro?",
      "o": [
        "Configurar las credenciales de AWS en texto plano dentro de un fichero `.bashrc` en el nodo driver de cada máquina virtual del clúster interactivo.",
        "Pedir a los desarrolladores que soliciten un token temporal de STS cada mañana y lo peguen como comentario en la primera celda del notebook de trabajo.",
        "Crear una `Storage Credential` con un IAM Role administrado y asociarla a una `External Location` que gobierna la URL del bucket en Unity Catalog.",
        "Abrir el bucket de S3 con acceso público de lectura y escritura para el rango de direcciones IP públicas de la oficina de la empresa."
      ],
      "a": 2,
      "e": "Unity Catalog desacopla la autenticación de la nube mediante dos objetos securizables: 1) `Storage Credential`, que encapsula una identidad de nube administrada (IAM Role en AWS, Managed Identity en Azure, Service Account en GCP) configurada por administradores del metastore. 2) `External Location`, que combina esa credencial con una URL de almacenamiento (`s3://...`). Los usuarios reciben permisos SQL sobre la External Location sin ver ni manipular credenciales.",
      "why": [
        "Guardar claves de IAM en ficheros de texto en el driver viola todas las políticas de seguridad y expone credenciales a cualquier usuario del clúster.",
        "Pegar tokens manuales en notebooks es inseguro, propenso a fugas en Git y no cumple con la auditoría centralizada de Unity Catalog.",
        null,
        "Hacer un bucket público representa una brecha de seguridad gravísima y expone todos los datos corporativos confidenciales en internet."
      ]
    },
    {
      "id": "dbd-49",
      "d": 5,
      "t": "Unity Catalog: Seguridad Granular (Row Filters & Column Masks)",
      "q": "Una tabla contiene nóminas y salarios de empleados (`empleados_silver`). La dirección de recursos humanos exige que: 1) los analistas solo puedan visualizar los empleados pertenecientes a su propio país (`pais_id`); 2) el campo `salario` sea visible en texto claro para el grupo `rrhh_directivos`, pero aparezca como `NULL` o enmascarado para el resto de usuarios. ¿Qué dos mecanismos de Unity Catalog permiten cumplir estas directrices sin duplicar la tabla física? (Elige 2 respuestas)",
      "o": [
        "Aplicar un `Row Filter` en la tabla mediante una función SQL que verifique `is_account_group_member()` y filtre el campo `pais_id` dinámicamente.",
        "Aplicar un `Column Mask` sobre la columna `salario` mediante una función SQL que ofusque el valor para usuarios que no pertenezcan al grupo autorizado.",
        "Crear un clúster físico independiente para cada país y duplicar los archivos Parquet en 50 buckets de almacenamiento distintos en la nube pública.",
        "Ejecutar un script nocturno que reescriba la tabla eliminando permanentemente la columna salario de los ficheros del almacenamiento de objetos."
      ],
      "a": [
        0,
        1
      ],
      "e": "Unity Catalog proporciona control de acceso granular nativo sin duplicar datos: 1) **Row Filters**: funciones SQL que devuelven un booleano para restringir qué filas puede ver cada usuario según su membresía en grupos corporativos (`ROW FILTER`). 2) **Column Masks**: funciones SQL aplicadas a columnas individuales (`SET MASK`) que enmascaran o devuelven valores ofuscados condicionalmente.",
      "why": [
        null,
        null,
        "Crear clústeres separados y duplicar archivos en 50 buckets genera una pesadilla de mantenimiento, desincronización y sobrecostes masivos.",
        "Eliminar físicamente la columna salario destruye la información e impide que el departamento de recursos humanos consulte los datos legítimamente."
      ]
    },
    {
      "id": "dbd-50",
      "d": 5,
      "t": "Unity Catalog: Linaje de Datos Automatizado",
      "q": "El equipo de cumplimiento normativo solicita auditar cómo se calcula la métrica `ingreso_neto` en el reporte financiero anual y qué tablas de origen alimentan esa columna específica. ¿Cómo ayuda la funcionalidad de **Data Lineage** de Unity Catalog a responder esta auditoría sin necesidad de documentar manualmente el código?",
      "o": [
        "Obliga a los ingenieros a declarar manualmente cada transformación en una hoja de cálculo compartida antes de aprobar cualquier pull request de código.",
        "Instala un agente externo en cada ordenador de los desarrolladores para registrar las pulsaciones de teclado durante la edición de notebooks en el workspace.",
        "Ejecuta un analizador estático de código que envía el texto de los notebooks a un modelo de lenguaje de terceros para deducir las relaciones teóricas.",
        "Genera automáticamente diagramas de linaje a nivel de tabla y columna capturados en tiempo de ejecución durante las consultas ejecutadas en Databricks."
      ],
      "a": 3,
      "e": "Unity Catalog captura automáticamente el **linaje de datos (Data Lineage)** a nivel de tabla y columna en tiempo de ejecución para cualquier consulta SQL o DataFrame ejecutada en los clústeres del workspace. Esto permite a los auditores y administradores visualizar de forma gráfica en la interfaz de usuario el origen de los datos, las transformaciones intermedias y el destino de cada columna sin requerir instrumentación manual de código.",
      "why": [
        "La documentación manual en hojas de cálculo es propensa a quedar desactualizada de inmediato y no provee trazabilidad verificable en auditorías.",
        "Capturar pulsaciones de teclado en ordenadores de usuarios es una violación de privacidad y no proporciona linaje técnico de las tablas de datos.",
        "Unity Catalog no envía código a LLMs de terceros para adivinar el linaje; lo captura de forma determinista del plan de ejecución físico de Spark.",
        null
      ]
    }
  ],
  "why": {
    "dbd-01": [
      null,
      "Delta Lake opera sobre almacenamiento de objetos estándar en la nube (S3, ADLS, GCS); no requiere clústeres HDFS ni coordinación mediante Apache ZooKeeper.",
      "La arquitectura Lakehouse procesa los datos directamente en el Data Lake abierto; no duplica los datos en un Data Warehouse propietario externo.",
      "El registro transaccional reside en almacenamiento persistente (`_delta_log`), no en la memoria volátil del nodo driver."
    ],
    "dbd-02": [
      "Descartar datos en la capa Bronze destruye la trazabilidad histórica y hace imposible recuperar información si la discrepancia de esquema era válida.",
      null,
      "La normalización, desanidado y deduplicación son transformaciones propias de la capa Silver, no de la capa de ingestión cruda Bronze.",
      "Las agregaciones horarias y modelos dimensionales pertenecen a la capa Gold; aplicarlas en la ingesta inicial omite las fases de refinamiento y auditoría."
    ],
    "dbd-03": [
      "Las métricas y KPIs agregados finales corresponden a la capa Gold; la capa Silver mantiene el grano detallado de las entidades de negocio.",
      "Un espejo idéntico sin validaciones representa la propia capa Bronze, sin aportar el filtrado y limpieza característicos de Silver.",
      null,
      "La anonimización destructiva de claves primarias destruye la integridad referencial requerida en Silver; la seguridad se implementa con máscaras y filtros en Unity Catalog."
    ],
    "dbd-04": [
      "Consultar ficheros JSON crudos de Bronze en tiempo real generaría una carga masiva y latencias inaceptables para un dashboard de BI concurrente.",
      "Los ficheros CSV sin optimizar carecen de estadísticas de salto de datos (`data skipping`), resultando en lecturas lentas y sobrecoste de cómputo.",
      null,
      "Ejecutar joins de 15 tablas crudas en cada consulta genera latencias muy elevadas y desperdicia recursos frente a una tabla Gold precalculada."
    ],
    "dbd-05": [
      null,
      "Delta Lake no utiliza bloqueos pesados de tabla completa (pessimistic locking); su modelo OCC permite escrituras concurrentes si no hay conflicto de archivos.",
      "Delta Lake garantiza consistencia transaccional inmediata en cada commit; no difiere la consistencia a procesos nocturnos asíncronos.",
      "Delta no rechaza sistemáticamente transacciones concurrentes; solo aborta si existe un conflicto real de modificación sobre los mismos ficheros de datos."
    ],
    "dbd-06": [
      null,
      "Sobreescribir ficheros manualmente en el bucket corrompe el registro transaccional `_delta_log` y puede generar inconsistencias severas en el catálogo.",
      "Re-ingestar todo el histórico toma horas o días de cómputo innecesario, mientras que `RESTORE TABLE` completa en pocos segundos mediante metadatos.",
      "Spark SQL y Delta Lake no utilizan transacciones de sesión basadas en `ROLLBACK TRANSACTION`; las transacciones se confirman de forma atómica en cada comando."
    ],
    "dbd-07": [
      "`VACUUM` no compacta archivos; purga ficheros lógicamente eliminados. Ejecutarlo con retención cero además puede corromper transacciones en vuelo.",
      null,
      "Manipular manualmente los archivos en el almacenamiento altera la estructura física sin actualizar el `_delta_log`, corrompiendo la tabla Delta.",
      "Migrar a CSV empeoraría drásticamente el rendimiento al perder el formato columnar, la compresión Snappy y las estadísticas de data skipping."
    ],
    "dbd-08": [
      null,
      "`Z-ORDER` no adapta dinámicamente sus claves; requiere re-ejecutar manualmente el comando `OPTIMIZE ... ZORDER BY` para reorganizar los datos.",
      null,
      "Particionar físicamente por columnas de alta cardinalidad genera millones de micro-carpetas (over-partitioning), degradando severamente el rendimiento."
    ],
    "dbd-09": [
      null,
      "`VACUUM` es una operación de mantenimiento en disco; no afecta al motor de ejecución Photon ni a la configuración del compilador de consultas.",
      "Los privilegios de Unity Catalog se gestionan en el metastore; la purga física de archivos de datos no altera los permisos RBAC asignados.",
      "`VACUUM` solo borra ficheros no referenciados físicamente; no modifica el esquema lógico de las columnas ni sus tipos de datos."
    ],
    "dbd-10": [
      "En una `Managed Table`, el comando `DROP TABLE` elimina tanto los metadatos como los archivos físicos de datos en el bucket.",
      "Una `GLOBAL TEMP VIEW` desaparece al terminar la aplicación/clúster de Spark y no persiste datos de manera duradera en el catálogo.",
      null,
      "Una vista no almacena datos por sí misma; la necesidad planteada es crear una tabla persistente con protección de los ficheros físicos subyacentes."
    ],
    "dbd-11": [
      "Los workers no persisten metadatos maestros en sus discos locales; el estado se deriva dinámicamente del `_delta_log` en almacenamiento de objetos.",
      null,
      "Delta Lake no borra los JSON anteriores arbitrariamente; los conserva para posibilitar el Time Travel según la retención de log configurada.",
      "Escanear directamente los ficheros sin consultar el `_delta_log` ignoraría los registros de transacciones, leyendo datos corruptos o eliminados."
    ],
    "dbd-12": [
      null,
      "Los SQL Warehouses utilizan CPU y pueden usar Photon; no requieren hardware de GPU ni compilación mediante CUDA para SQL relacional.",
      "Koalas es una API compatible con Pandas en PySpark; no acelera consultas SQL complejas ni reemplaza el motor de ejecución distribuido.",
      "GraphX es una librería para computación de grafos; no es un motor de aceleración para consultas relacionales o pipelines ELT estándar."
    ],
    "dbd-13": [
      "La sentencia `OPEN FILE` no existe en la sintaxis de Spark SQL ni en el estándar ANSI SQL de Databricks.",
      null,
      "El comando `IMPORT TABLE` no es una sintaxis válida para consultar ficheros de forma ad-hoc en Spark SQL.",
      "`READ_PARQUET` no es una función escalar de Spark SQL para invocar en cláusulas WHERE; se usa notación de tabla directa o la API DataFrame."
    ],
    "dbd-14": [
      "`INSERT INTO ... SELECT` inserta ciegamente todos los registros devueltos por la consulta, duplicando datos si se reintenta tras un fallo parcial.",
      "Mover archivos mediante bash es frágil, propenso a errores de concurrencia y no proporciona transaccionalidad ACID en la base de datos.",
      null,
      "`CREATE OR REPLACE TABLE` destruye los datos históricos previos en cada ejecución, impidiendo acumular datos históricos de forma incremental."
    ],
    "dbd-15": [
      "Las expresiones regulares con `regexp_extract` son lentas, frágiles ante cambios menores en el formato del JSON y propensas a errores de parsing.",
      "Una UDF de Python fila por fila sufre de una penalización severa de rendimiento por serialización IPC entre la JVM y el intérprete Python.",
      "Usar `split()` asume un orden posicional estricto en el JSON, lo cual falla tan pronto los campos cambian de orden o contienen comas internas.",
      null
    ],
    "dbd-16": [
      null,
      "`FILTER` solo evalúa predicados booleanos para incluir o descartar elementos; no transforma los valores de los elementos del array.",
      "`EXPLODE_TRANSFORM` no existe en la especificación de Spark SQL ni en Databricks.",
      "`MAP_VALUES` opera sobre tipos de datos de mapa clave-valor (`MAP<K, V>`), no sobre arrays primitivos (`ARRAY<T>`)."
    ],
    "dbd-17": [
      "No es posible acceder directamente a campos de un `ARRAY<STRUCT>` mediante notación escalar sin desanidar o usar funciones de orden superior.",
      null,
      "`ARRAY_CONTAINS` solo evalúa igualdad de elementos literales simples y no permite evaluar múltiples condiciones correlacionadas con predicados de precio.",
      "`COUNT_IF` es una función de agregación sobre columnas de una tabla, no una función de orden superior para arrays anidados."
    ],
    "dbd-18": [
      "`dropDuplicates` no garantiza conservar la fila más reciente tras un sort distribuido, ya que las particiones internas pueden alterar el orden de partición.",
      null,
      "`FIRST(cantidad)` sin ordenamiento es no determinista y puede devolver cualquier valor arbitrario en ejecuciones sucesivas.",
      null
    ],
    "dbd-19": [
      "Ejecutar `UPDATE` seguido de `INSERT` son dos transacciones independientes que pueden generar condiciones de carrera y escaneos de tabla redundantes.",
      "`INSERT OVERWRITE` sobreescribe los datos existentes, borrando a todos los clientes que no estén presentes en el lote de actualizaciones actual.",
      null,
      "`UNION ALL` más `OPTIMIZE` simplemente acumula duplicados en la tabla sin actualizar registros ni reconciliar versiones de clientes."
    ],
    "dbd-20": [
      "La sintaxis `DROP ROW` no existe en la sentencia `MERGE INTO` de SQL estándar ni en Delta Lake (se utiliza la palabra clave `DELETE`).",
      "Databricks no soporta triggers tradicionales de base de datos OLTP y las llamadas REST añadirían una latencia inasumible al pipeline de datos.",
      "Un bucle secuencial en Python lanzando sentencias `DELETE` individuales genera miles de commits innecesarios en el `_delta_log` y degrada el clúster.",
      null
    ],
    "dbd-21": [
      null,
      "Las Python UDFs estándar sufren un sobrecoste extremo de serialización fila por fila (Py4J/IPC), siendo la alternativa más lenta en Spark.",
      "Aunque las Pandas UDFs son mucho más rápidas que las Python UDFs estándar, siguen incurriendo en costes de serialización Arrow frente a una SQL UDF nativa.",
      "Catalyst no puede optimizar dentro del intérprete de Python en una Python UDF estándar; la diferencia de rendimiento suele ser de 10x a 100x."
    ],
    "dbd-22": [
      "`date_format()` convierte el timestamp a `STRING`, lo cual degrada el rendimiento de índices, comparaciones temporales y operaciones de salto de datos.",
      null,
      "La función `TRUNCATE_TIME` no existe en la especificación de Spark SQL ni en Databricks.",
      "`TO_MONTH_START` no es una función de Spark SQL; los meses tienen duraciones variables (28-31 días) que no pueden calcularse con múltiplos fijos."
    ],
    "dbd-23": [
      "El operador de flecha `->` se utiliza en funciones lambda (Higher-Order Functions), no para acceder a atributos de una estructura `STRUCT`.",
      "La función `EXTRACT_FIELD` no forma parte de la biblioteca de funciones integradas de Spark SQL.",
      null,
      "La indexación por corchetes con strings (`col['clave']`) se reserva para tipos `MAP`, no para atributos fuertemente tipados de un `STRUCT`."
    ],
    "dbd-24": [
      "`explode()` descarta automáticamente cualquier fila donde el array sea nulo o esté vacío, perdiendo los pedidos sin artículos.",
      "`posexplode()` añade una columna de índice de posición pero también descarta las filas vacías o nulas como `explode()` estándar.",
      "`unnest_all()` no es una función de Spark SQL en Databricks.",
      null
    ],
    "dbd-25": [
      null,
      "Las vistas temporales no se registran en Unity Catalog ni Hive Metastore; por tanto, no admiten sentencias `GRANT` de control de acceso.",
      "Las vistas temporales pueden consultar cualquier formato compatible con Spark, incluyendo Delta, Parquet, CSV y JSON sin ninguna restricción.",
      "No existe dicha propiedad de configuración de Spark; el aislamiento de sesión es intrínseco al ciclo de vida de una vista temporal."
    ],
    "dbd-26": [
      "`ROW_NUMBER()` rompería el empate asignando a uno la posición 1 y al otro la posición 2 de forma arbitraria y no determinista.",
      null,
      "`RANK()` dejaría un hueco tras el empate doble, asignando la posición 3 al siguiente empleado en lugar de la posición 2 requerida.",
      "`PERCENT_RANK()` calcula una fracción decimal relativa entre 0 y 1, no un número de posición entero ordinal de ranking."
    ],
    "dbd-27": [
      "`WITH RECURSIVE` se usa para consultas recursivas en grafos o árboles jerárquicos de registros; no es una cláusula para subtotales en `GROUP BY`.",
      "`CUBE` genera todas las combinaciones posibles de dimensiones, produciendo subtotales no jerárquicos innecesarios y aumentando el coste computacional.",
      null,
      "`ORDER BY TOTALS` no es una cláusula válida en Spark SQL para sintetizar filas de subtotales agregados."
    ],
    "dbd-28": [
      "Structured Streaming no genera archivos CSV temporales para polling; procesa micro-lotes en memoria o continuo directamente hacia sumideros Delta.",
      "Structured Streaming no depende de servicios REST síncronos ni bases de datos relacionales intermedias para coordinar la ingesta distribuida.",
      "El cómputo de Spark se basa en RDDs y DataFrames distribuidos en ejecutores JVM, no en grafos gestionados por CPython en el driver.",
      null
    ],
    "dbd-29": [
      null,
      "`complete` reescribe toda la tabla en cada trigger y solo está permitido en consultas con agregaciones; fallaría en una ingesta simple sin agrupaciones.",
      "`update` emite filas modificadas y en streaming sin agregaciones tiene un comportamiento equivalente a append, pero no calcula hashes de fila.",
      "`snapshot` no existe como modo de salida en Apache Spark Structured Streaming ni en Databricks."
    ],
    "dbd-30": [
      "Spark no utiliza SQLite en el driver para guardar checkpoints; el disco efímero del driver se destruye al reiniciar el clúster.",
      null,
      "Re-solicitar todo el histórico desde el inicio violaría la semántica exactly-once y generaría duplicados masivos en los sumideros.",
      "Databricks y Spark Structured Streaming no utilizan Apache ZooKeeper para la gestión de checkpoints ni para la coordinación de offsets."
    ],
    "dbd-31": [
      "Desactivar el listado incremental forzaría escaneos completos del bucket, empeorando el problema de rendimiento en lugar de resolverlo.",
      "`COPY INTO` en buckets con decenas de millones de archivos también sufre de latencias elevadas en el listado de archivos frente a colas de eventos.",
      null,
      "Lanzar 1 000 nodos para ejecutar comandos `ls` genera costes prohibitivos y llamadas excesivas que provocan throttling en la API de S3."
    ],
    "dbd-32": [
      null,
      "`cloudFiles.enforceStrictTypes` no es una opción válida de Auto Loader y convertir silenciosamente a cero provocaría corrupción no detectable en datos numéricos.",
      "Auto Loader no descarta ficheros silenciosamente; su diseño prioriza la no pérdida de datos rescatando anomalías en `_rescued_data`.",
      null
    ],
    "dbd-33": [
      "`continuous` mantiene el clúster encendido 24/7 con consumo continuo de DBUs, contradiciendo el requisito de ejecución nocturna y apagado.",
      "`processingTime = '1 hour'` ejecuta el stream en bucle infinito cada hora sin apagar el clúster al procesar los datos del día.",
      "`Trigger.Once` está en desuso frente a `Trigger.AvailableNow` porque procesaba todos los datos pendientes en un solo micro-lote descontrolado.",
      null
    ],
    "dbd-34": [
      null,
      "`dropOldEvents` no existe en la API de Apache Spark Structured Streaming ni en Databricks.",
      "`setTimeToLive` no es una función de Spark; Structured Streaming gestiona su estado mediante State Stores (HDFS o RocksDB) gobernados por watermarks.",
      "Usar `current_timestamp()` en streaming no es determinista y no permite al motor deducir cuándo cerrar y emitir ventanas de agregación pasadas."
    ],
    "dbd-35": [
      "Una `MATERIALIZED VIEW` recalcula su contenido ante cambios en las fuentes, no está diseñada para ingestión incremental continua append-only.",
      null,
      "La sintaxis `STREAMING_READ` y `CREATE TEMPORARY TABLE` no forman parte del framework declarativo de Delta Live Tables.",
      "`CREATE EXTERNAL DELTA TABLE` con un filtro artificial `_is_new` no utiliza las capacidades de streaming ni el tracking transaccional de DLT."
    ],
    "dbd-36": [
      "Las Materialized Views consumen cómputo de clúster estándar facturado en DBUs al ejecutar las consultas de transformación.",
      "Las Streaming Tables pueden aplicar perfectamente cláusulas `WHERE`, transformaciones y proyecciones siempre que la fuente sea incremental.",
      null,
      "Las Streaming Tables son completamente escalables a miles de millones de filas; no tienen ningún límite arbitrario de 10 000 registros."
    ],
    "dbd-37": [
      "La sintaxis `CHECK ... ON ERROR SKIP RECORD` no existe en la especificación declarativa de Delta Live Tables.",
      "`ON VIOLATION ABORT PIPELINE` no es una cláusula válida; para abortar la ejecución se utiliza `ON VIOLATION FAIL UPDATE`.",
      "`ON INVALID DISCARD INTO DLQ` no es sintaxis de DLT; el aislamiento de registros en colas de mensajes se implementa con patrones de bifurcación de tablas.",
      null
    ],
    "dbd-38": [
      null,
      "`ON VIOLATION DROP ROW` descartaría la fila y continuaría la ejecución exitosamente, lo cual viola el requisito regulatorio estricto.",
      "Omitir la cláusula `ON VIOLATION` (expectativa por defecto) solo emite una advertencia en los logs pero conserva el registro y continúa el pipeline.",
      "`ON ANOMALY RAISE CRITICAL ALERT` no es una sintaxis reconocida por el compilador declarativo de Delta Live Tables."
    ],
    "dbd-39": [
      "Ejecutar cargas corporativas mediante túneles SSH en portátiles personales rompe la seguridad, escalabilidad y disponibilidad del Lakehouse.",
      null,
      "Aumentar los workers de un clúster interactivo All-Purpose que permanece activo todo el día incrementa drásticamente los costes de DBU.",
      "Eliminar Apache Spark impide procesar grandes volúmenes distribuidos y descarta las ventajas de gobernanza y optimización de Databricks."
    ],
    "dbd-40": [
      "El directorio `/tmp` local es efímero y reside en nodos distintos que pueden destruirse entre tareas, impidiendo compartir datos.",
      "Las variables de entorno del sistema operativo no se propagan entre clústeres distintos ni entre tareas desacopladas de un Workflow.",
      null,
      "Modificar el código fuente de los notebooks mediante la API REST durante la ejecución en curso es una práctica insegura y desaconsejada."
    ],
    "dbd-41": [
      "Borrar el historial elimina la trazabilidad de auditoría y no resuelve la necesidad de reanudar el procesamiento del flujo.",
      "Clonar manualmente el Workflow para cada fallo es ineficiente, genera desorden en el workspace y complica el mantenimiento.",
      "Re-ejecutar el trabajo completo desde cero desperdicia dos horas de cómputo y costes en tareas que ya finalizaron exitosamente.",
      null
    ],
    "dbd-42": [
      "Unity Catalog es el motor de gobernanza de datos y no tiene relación con forzar el apagado de máquinas virtuales.",
      null,
      null,
      "Matar procesos Java de forma aleatoria causaría fallos catastróficos e inconsistencias en lugar de implementar una política de costes ordenada."
    ],
    "dbd-43": [
      "Exportar manualmente ficheros `.dbc` por correo no provee control de versiones, dificulta el merge y es susceptible a fallos humanos graves.",
      "Guardar código fuente dentro de tablas Delta como cadenas de texto no es un sistema de control de versiones y no soporta flujos Git.",
      "Instalar un servidor Git en el driver no es escalable, carece de alta disponibilidad y se destruye al reiniciar el clúster interactivo.",
      null
    ],
    "dbd-44": [
      "Un bucle infinito en un notebook consume un clúster entero de forma innecesaria y añade fragilidad operativa frente a las alertas nativas del job.",
      null,
      "La inspección manual no es escalable, no proporciona alertas en tiempo real y no garantiza el cumplimiento de SLAs críticos.",
      "Modificar el kernel de Linux en nodos efímeros es impracticable, viola la arquitectura administrada y se pierde en cada recreación del clúster."
    ],
    "dbd-45": [
      "`dbfs cp` solo copia ficheros al almacenamiento; no define pipelines declarativos, jobs, dependencias ni infraestructura como código.",
      "Las capturas de pantalla y aprobaciones manuales son el opuesto de la automatización CI/CD recomendada por las prácticas modernas de DevOps.",
      null,
      "`pip` y wheels compilan librerías de código Python, pero no orquestan jobs, pipelines DLT ni infraestructura en los workspaces de Databricks."
    ],
    "dbd-46": [
      "Un clúster estático masivo encendido continuamente genera un desperdicio presupuestario inaceptable durante los días de baja demanda.",
      "Ejecutar todo en el driver elimina el paralelismo distribuido de Spark y provoca fallos catastróficos por falta de memoria (OutOfMemory).",
      "Las reservas fijas a 3 años para cargas elásticas con picos puntuales no aprovechan la elasticidad intrínseca de la nube y aumentan el TCO.",
      null
    ],
    "dbd-47": [
      "Las tablas están completamente desacopladas de los clústeres de cómputo en Unity Catalog; no se nombran según el clúster que las ejecuta.",
      "El metastore y el workspace son niveles de infraestructura de gestión; no forman parte de la sintaxis SQL de consulta de datos.",
      "`bucket.folder.table` describe rutas de almacenamiento físico, mientras que Unity Catalog provee una abstracción lógica unificada de gobernanza.",
      null
    ],
    "dbd-48": [
      "Guardar claves de IAM en ficheros de texto en el driver viola todas las políticas de seguridad y expone credenciales a cualquier usuario del clúster.",
      "Pegar tokens manuales en notebooks es inseguro, propenso a fugas en Git y no cumple con la auditoría centralizada de Unity Catalog.",
      null,
      "Hacer un bucket público representa una brecha de seguridad gravísima y expone todos los datos corporativos confidenciales en internet."
    ],
    "dbd-49": [
      null,
      null,
      "Crear clústeres separados y duplicar archivos en 50 buckets genera una pesadilla de mantenimiento, desincronización y sobrecostes masivos.",
      "Eliminar físicamente la columna salario destruye la información e impide que el departamento de recursos humanos consulte los datos legítimamente."
    ],
    "dbd-50": [
      "La documentación manual en hojas de cálculo es propensa a quedar desactualizada de inmediato y no provee trazabilidad verificable en auditorías.",
      "Capturar pulsaciones de teclado en ordenadores de usuarios es una violación de privacidad y no proporciona linaje técnico de las tablas de datos.",
      "Unity Catalog no envía código a LLMs de terceros para adivinar el linaje; lo captura de forma determinista del plan de ejecución físico de Spark.",
      null
    ]
  },
  "glossary": [
    {
      "term": "Delta Lake",
      "cat": "Lakehouse & Delta",
      "d": 1,
      "def": "Capa de almacenamiento abierta que aporta transacciones ACID, control de versiones (Time Travel) y metadatos escalables sobre Data Lakes basados en Apache Parquet.",
      "tip": "Garantiza serializabilidad y control de concurrencia optimista (OCC) directamente sobre almacenamiento de objetos en la nube."
    },
    {
      "term": "_delta_log",
      "cat": "Lakehouse & Delta",
      "d": 1,
      "def": "Directorio interno de metadatos de Delta Lake que almacena el commit log atómico en ficheros JSON y checkpoints compactados en formato Parquet cada 10 transacciones.",
      "tip": "Permite reconstruir el estado exacto de la tabla en memoria sin realizar costosos listados de ficheros en el bucket de nube."
    },
    {
      "term": "Medallion Architecture",
      "cat": "Lakehouse & Delta",
      "d": 1,
      "def": "Patrón de diseño arquitectónico en el Lakehouse estructurado en tres capas progresivas de calidad: Bronze (crudo), Silver (limpio y enriquecido) y Gold (agregado de negocio).",
      "tip": "Bronze siempre debe ser append-only y conservar los datos sin transformaciones destructivas de negocio para auditoría y reprocesamiento."
    },
    {
      "term": "Liquid Clustering",
      "cat": "Lakehouse & Delta",
      "d": 1,
      "def": "Mecanismo moderno de gestión física de datos en Delta Lake que sustituye el particionamiento físico rígido y Z-Order reorganizando los datos dinámicamente con CLUSTER BY.",
      "tip": "Evita el sobre-particionado y el sesgo de datos (skew), permitiendo redefinir las columnas de clustering sin tener que reescribir la tabla completa."
    },
    {
      "term": "OPTIMIZE & Z-ORDER",
      "cat": "Lakehouse & Delta",
      "d": 1,
      "def": "Comando de mantenimiento de Delta Lake que compacta ficheros pequeños (bin-packing de ~1 GB) y ordena multidimensionalmente los datos para salto de datos (data skipping).",
      "tip": "Z-ORDER solo es efectivo en columnas con alta cardinalidad comúnmente utilizadas en filtros WHERE; no debe aplicarse a columnas de muy baja cardinalidad."
    },
    {
      "term": "VACUUM",
      "cat": "Lakehouse & Delta",
      "d": 1,
      "def": "Comando de recolección de basura en Delta Lake que purga físicamente los ficheros Parquet marcados como eliminados que superan el periodo de retención configurado.",
      "tip": "El periodo de retención por defecto es de 7 días (168 horas); ejecutarlo con retención cero rompe el Time Travel y arriesga corromper lecturas concurrentes."
    },
    {
      "term": "Time Travel",
      "cat": "Lakehouse & Delta",
      "d": 1,
      "def": "Capacidad nativa de Delta Lake para consultar o restaurar instantáneas históricas de una tabla mediante números de versión o marcas temporales.",
      "tip": "Se invoca con VERSION AS OF o TIMESTAMP AS OF, y se revierte una tabla al estado anterior con RESTORE TABLE."
    },
    {
      "term": "Managed vs External Tables",
      "cat": "Lakehouse & Delta",
      "d": 1,
      "def": "Diferenciación de tablas en Databricks: Managed gestiona tanto metadatos como ficheros físicos; External almacena los datos en una ruta externa mediante la cláusula LOCATION.",
      "tip": "Al ejecutar DROP TABLE sobre una tabla Managed se borran los datos físicos del bucket; en una External Table los ficheros permanecen intactos."
    },
    {
      "term": "COPY INTO",
      "cat": "ELT & Spark",
      "d": 2,
      "def": "Instrucción SQL idempotente de Databricks que carga de forma incremental y por lotes nuevos ficheros desde almacenamiento de nube a una tabla Delta.",
      "tip": "Registra internamente los ficheros ya procesados, evitando duplicados en re-ejecuciones sin necesidad de mantener scripts de tracking manual."
    },
    {
      "term": "Higher-Order Functions",
      "cat": "ELT & Spark",
      "d": 2,
      "def": "Funciones de Spark SQL (TRANSFORM, FILTER, EXISTS, AGGREGATE) que operan directamente sobre colecciones y arrays anidados sin requerir descomponerlos.",
      "tip": "Evitan el uso de explode() y shuffles de red masivos, acelerando notablemente el rendimiento en el tratamiento de estructuras anidadas."
    },
    {
      "term": "from_json",
      "cat": "ELT & Spark",
      "d": 2,
      "def": "Función de Spark SQL que deserializa una columna de texto con formato JSON a una estructura fuertemente tipada (STRUCT o ARRAY) a partir de un esquema dado.",
      "tip": "Combínala con schema_of_json() para inferir dinámicamente esquemas de muestra sin escribirlos manualmente."
    },
    {
      "term": "MERGE INTO",
      "cat": "ELT & Spark",
      "d": 2,
      "def": "Sentencia SQL atómica que permite realizar operaciones coordinadas de inserción, actualización y borrado (Upsert) entre tablas de origen y destino en una sola transacción.",
      "tip": "Soporta cláusulas condicionales como WHEN MATCHED AND condicion THEN DELETE y WHEN NOT MATCHED THEN INSERT."
    },
    {
      "term": "Pandas UDF (Vectorized)",
      "cat": "ELT & Spark",
      "d": 2,
      "def": "Función definida por el usuario en Python que utiliza Apache Arrow para intercambiar lotes de datos en memoria columnar con el ejecutor Spark.",
      "tip": "Proporciona un rendimiento hasta 100 veces superior a las UDFs estándar de Python que procesan fila por fila con alto coste IPC."
    },
    {
      "term": "Auto Loader (cloudFiles)",
      "cat": "Streaming & DLT",
      "d": 3,
      "def": "Motor de ingestión incremental de Databricks para procesar millones de nuevos ficheros en almacenamiento de nube sin listar directorios enteros.",
      "tip": "Soporta modos Directory Listing y File Notification (SNS/SQS, Event Grid) con inferencia y evolución automática de esquemas."
    },
    {
      "term": "_rescued_data",
      "cat": "Streaming & DLT",
      "d": 3,
      "def": "Columna especial generada automáticamente por Auto Loader que almacena en formato JSON cualquier campo nuevo o incompatible con el esquema esperado.",
      "tip": "Evita la pérdida silenciosa de registros corruptos o inesperados, permitiendo que la ingestión continúe sin fallos fatales."
    },
    {
      "term": "Delta Live Tables (DLT)",
      "cat": "Streaming & DLT",
      "d": 3,
      "def": "Framework declarativo de Databricks para construir canalizaciones de datos fiables en SQL o Python con gestión automática de dependencias y calidad.",
      "tip": "Automatiza la orquestación, el mantenimiento de checkpoints, el escalado de clústeres y la captura de métricas en el Event Log."
    },
    {
      "term": "Streaming Table (DLT)",
      "cat": "Streaming & DLT",
      "d": 3,
      "def": "Tabla gestionada en Delta Live Tables diseñada para procesar flujos de datos continuos o crecientes de forma estrictamente incremental (append-only).",
      "tip": "Se declara con CREATE OR REFRESH STREAMING TABLE y lee de fuentes streaming con la función STREAM()."
    },
    {
      "term": "Materialized View (DLT)",
      "cat": "Streaming & DLT",
      "d": 3,
      "def": "Vista persistida en Delta Live Tables cuyos resultados se precalculan y refrescan automáticamente para reflejar el estado actual de las fuentes.",
      "tip": "Ideal para la capa Gold, agregaciones de negocio y joins complejos donde se requiere consistencia analítica completa."
    },
    {
      "term": "Data Quality Expectations",
      "cat": "Streaming & DLT",
      "d": 3,
      "def": "Restricciones declarativas de calidad de datos en DLT aplicadas en vuelo mediante EXPECT, ON VIOLATION DROP ROW y ON VIOLATION FAIL UPDATE.",
      "tip": "Permiten gobernar la integridad de datos definiendo si las filas no conformes generan advertencias, se descartan o abortan el pipeline."
    },
    {
      "term": "Watermarking (Structured Streaming)",
      "cat": "Streaming & DLT",
      "d": 3,
      "def": "Mecanismo en Structured Streaming para definir el límite temporal de retraso tolerable para eventos desordenados y purgar el State Store en memoria.",
      "tip": "Sin watermarking, las consultas con agregaciones en streaming en modo Append acumularían estado indefinidamente provocando errores OutOfMemory."
    },
    {
      "term": "Job Cluster (Automated)",
      "cat": "Workflows",
      "d": 4,
      "def": "Clúster efímero aprovisionado exclusivamente por Databricks Workflows para la ejecución de un trabajo y destruido al finalizar.",
      "tip": "Factura a una tarifa DBU sensiblemente menor (~50-60 % de ahorro) y garantiza aislamiento total en producción frente a clústeres All-Purpose."
    },
    {
      "term": "Repair and Rerun",
      "cat": "Workflows",
      "d": 4,
      "def": "Funcionalidad de Databricks Workflows que permite reanudar un trabajo multi-tarea ejecutando únicamente las tareas fallidas y sus dependencias aguas abajo.",
      "tip": "Evita el sobrecoste y retraso de recomputar tareas ascendentes que ya finalizaron exitosamente en la corrida previa."
    },
    {
      "term": "Cluster Policy",
      "cat": "Workflows",
      "d": 4,
      "def": "Conjunto de reglas administrativas que restringe los tipos de clúster, familias de instancias, auto-terminación y etiquetas permitidas a los usuarios.",
      "tip": "Esencial para el gobierno financiero (FinOps), impidiendo la creación accidental de clústeres sobredimensionados o sin apagado automático."
    },
    {
      "term": "Three-Level Namespace",
      "cat": "Unity Catalog",
      "d": 5,
      "def": "Estructura jerárquica canónica de resolución de objetos en Unity Catalog con el formato catalog.schema.table (o view / volume / model).",
      "tip": "Permite organizar los datos por dominios corporativos o entornos (dev/staging/prod) centralizados en un único metastore regional."
    },
    {
      "term": "Row Filters & Column Masks",
      "cat": "Unity Catalog",
      "d": 5,
      "def": "Funciones SQL de control de acceso granular en Unity Catalog que filtran filas o enmascaran columnas dinámicamente según la identidad del usuario.",
      "tip": "Evitan la proliferación de vistas redundantes para garantizar el cumplimiento de normativas de privacidad como GDPR y HIPAA."
    }
  ]
};
})(window);
