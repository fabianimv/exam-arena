/* =========================================================================
   data/databricks-genai/exam.js — Databricks Certified Generative AI Engineer Associate
   50 preguntas en los 5 dominios oficiales con explicación por opción errónea (WHY)
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["databricks-genai"] = {
  "id": "databricks-genai",
  "appId": "databricks-genai",
  "provider": "Databricks",
  "badge": "Databricks · GenAI Eng",
  "icon": "🧱",
  "color": "#ff3621",
  "featured": true,
  "title": "Databricks · Generative AI Engineer Associate",
  "subtitle": "Mosaic AI Vector Search, Model Serving, RAG, MLflow Evaluation y Unity Catalog Governance",
  "passingScore": 70,
  "domains": {
    "1": "Diseño de Aplicaciones GenAI (14 %)",
    "2": "Desarrollo de Aplicaciones y Chunking (14 %)",
    "3": "Preparación de Datos y Vector Search (30 %)",
    "4": "Despliegue con Mosaic AI Model Serving (22 %)",
    "5": "Evaluación con MLflow y Gobernanza (20 %)"
  },
  "shortDomains": {
    "1": "Diseño",
    "2": "RAG & Chains",
    "3": "Vector Search",
    "4": "Model Serving",
    "5": "MLflow & UC"
  },
  "topics": [
    {
      "id": "dbg-t-1-1",
      "d": 1,
      "title": "1.1 · Arquitecturas GenAI: RAG vs Fine-Tuning vs Pre-training vs Prompt Engineering",
      "html": "<table class=\"keytable\">\n<tr><th>Enfoque Arquitectónico</th><th>Cuándo elegirlo</th><th>Frescura del dato & Citas</th><th>Coste & Latencia</th></tr>\n<tr><td><b>Prompt Engineering / Few-Shot</b></td><td>Tareas de razonamiento general, clasificación rápida o extracción sobre textos cortos que caben en el contexto inmediato.</td><td>Estática según fecha de corte del modelo base; sin citas automáticas de bases de datos externas.</td><td>Coste bajo por llamada; latencia mínima sin infraestructura dedicada.</td></tr>\n<tr><td><b>RAG (Retrieval-Augmented Generation)</b></td><td>Respuestas fundamentadas sobre bases de conocimiento cambiantes, manuales corporativos, políticas internas o datos privados.</td><td>Datos actualizados en tiempo real mediante sincronización con Delta Lake; citas textuales precisas y auditables.</td><td>Coste moderado (Vector Search + LLM); latencia gobernada por el retrieval (~15-50 ms) más la inferencia.</td></tr>\n<tr><td><b>Fine-Tuning (PEFT / LoRA / Full)</b></td><td>Adaptación de tono/estilo, seguimiento de sintaxis propietaria, tareas especializadas de clasificación o tareas de salida estructurada.</td><td>Los pesos congelan el conocimiento; no garantiza exactitud factual ni citas dinámicas sin un componente RAG adicional.</td><td>Coste elevado de entrenamiento; inferencia requiere cómputo dedicado en Model Serving.</td></tr>\n<tr><td><b>Pre-training / Continued Pre-training</b></td><td>Creación de modelos de dominio altamente especializado (biomédico, legal ultra-específico) o idiomas con baja representación.</td><td>Conocimiento embebido en los parámetros del modelo; requiere repetición periódica muy costosa para actualizarse.</td><td>Coste financiero y de cómputo extremadamente alto (cientos de GPUs A100/H100 durante semanas).</td></tr>\n</table>"
    },
    {
      "id": "dbg-t-1-2",
      "d": 1,
      "title": "1.2 · Selección de Modelos Fundacionales, Embeddings y Patrones de Orquestación",
      "html": "<table class=\"keytable\">\n<tr><th>Componente</th><th>Opciones en Databricks</th><th>Criterios de Elección</th></tr>\n<tr><td><b>Foundation Models (LLMs)</b></td><td>DBRX, Llama-3 (8B, 70B), Mistral/Mixtral, APIs externas (OpenAI GPT-4, Anthropic Claude vía AI Gateway).</td><td>Trade-off entre calidad de razonamiento, latencia p95, tamaño de ventana de contexto (8k a 128k+) y soberanía/privacidad de datos.</td></tr>\n<tr><td><b>Modelos de Embeddings</b></td><td>BGE-large-en, BGE-multilingual, GTE-large, text-embedding-ada-002, endpoints de embeddings personalizados.</td><td>Dimensión del vector (384, 768, 1024, 1536), longitud máxima de secuencia de entrada y soporte multilingüe nativo.</td></tr>\n<tr><td><b>Orquestación de Cadenas</b></td><td>LangChain, LlamaIndex, MLflow PyFunc / ResponsesAgent nativo de Databricks.</td><td>Complejidad del flujo conversacional, soporte de herramientas (Tool Calling), modularidad y facilidad de empaquetado en MLflow.</td></tr>\n<tr><td><b>Almacén Vectorial</b></td><td>Mosaic AI Vector Search (Delta Sync Index vs Direct Vector Access).</td><td>Integración nativa con Unity Catalog, gobernanza de datos, seguridad a nivel de fila y sincronización automática vía Change Data Feed.</td></tr>\n</table>"
    },
    {
      "id": "dbg-t-2-1",
      "d": 2,
      "title": "2.1 · Chunking y Tokenización: Estrategias, Overlap y Ventanas de Contexto",
      "html": "<table class=\"keytable\">\n<tr><th>Estrategia de Chunking</th><th>Mecanismo</th><th>Casos de Uso Ideales</th><th>Riesgo / Desventaja</th></tr>\n<tr><td><b>Fixed-size Chunking</b></td><td>Corta el texto cada N caracteres o tokens sin analizar estructura lingüística.</td><td>Prototipado rápido y textos planos sin jerarquías ni párrafos definidos.</td><td>Corta palabras o frases por la mitad; pierde contexto semántico en las fronteras de corte.</td></tr>\n<tr><td><b>Recursive Character Chunking</b></td><td>Intenta dividir por delimitadores jerárquicos (`\n\n`, `\n`, ` `, `\"\"`) hasta alcanzar el tamaño objetivo.</td><td>Documentos en prosa, manuales de usuario, artículos extensos y documentación técnica general.</td><td>Puede generar fragmentos de tamaño irregular si los párrafos son extremadamente largos.</td></tr>\n<tr><td><b>Document-specific (Markdown / HTML)</b></td><td>Divide respetando encabezados H1, H2, H3, tags HTML o bloques de código delimitados.</td><td>Archivos README, especificaciones Markdown, documentación de APIs y páginas web estructuradas.</td><td>Requiere analizadores sintácticos específicos y esquemas de documentos consistentes.</td></tr>\n<tr><td><b>Semantic Chunking</b></td><td>Calcula la distancia entre embeddings de oraciones consecutivas y corta cuando la similitud cae abruptamente.</td><td>Textos con cambios temáticos sutiles donde los saltos de párrafo no reflejan cambios semánticos.</td><td>Alto coste computacional durante la fase de preparación al requerir vectorizar cada oración previa.</td></tr>\n<tr><td><b>Chunk Overlap (Solapamiento)</b></td><td>Comparte entre el 10 % y 20 % del texto de frontera entre dos chunks adyacentes consecutivos.</td><td>Imprescindible en casi todas las estrategias de chunking para evitar la fragmentación de hechos clave.</td><td>Incrementa ligeramente el volumen total de tokens indexados y almacenados en Vector Search.</td></tr>\n</table>"
    },
    {
      "id": "dbg-t-2-2",
      "d": 2,
      "title": "2.2 · Técnicas Avanzadas de RAG: Re-ranking, HyDE, RRF y Multi-turn Chains",
      "html": "<table class=\"keytable\">\n<tr><th>Técnica Avanzada</th><th>Cómo Funciona</th><th>Problema que Resuelve</th></tr>\n<tr><td><b>Cross-Encoder Re-ranking</b></td><td>Un modelo (e.g. BGE-reranker) procesa la consulta y el fragmento juntos evaluando atención cruzada completa sobre los top-N candidatos.</td><td>Elimina falsos positivos del bi-encoder inicial recuperando los mejores K fragmentos con precisión muy superior.</td></tr>\n<tr><td><b>HyDE (Hypothetical Document Embeddings)</b></td><td>Un LLM genera un documento hipotético ideal a partir de la consulta del usuario; luego se busca en Vector Search usando el embedding de dicho documento.</td><td>Brecha léxica y semántica cuando la consulta es corta o abstracta y no comparte vocabulario con los textos indexados.</td></tr>\n<tr><td><b>Reciprocal Rank Fusion (RRF)</b></td><td>Combina y normaliza las posiciones ordenadas de múltiples recuperadores (e.g. denso + disperso) con la fórmula `RRF_Score = sum(1 / (60 + rank))`.</td><td>Discrepancia entre escalas de similitud vectorial y puntuaciones BM25 al fusionar resultados de búsqueda híbrida.</td></tr>\n<tr><td><b>Context Reordering (Lost in the Middle)</b></td><td>Reordena los chunks recuperados colocando los de mayor relevancia al principio y al final del contexto del prompt.</td><td>Mitiga el sesgo posicional de los LLMs que tienden a ignorar información ubicada en el medio de la ventana de contexto.</td></tr>\n</table>"
    },
    {
      "id": "dbg-t-3-1",
      "d": 3,
      "title": "3.1 · Mosaic AI Vector Search: Delta Sync Index vs Direct Vector Access",
      "html": "<table class=\"keytable\">\n<tr><th>Tipo de Índice</th><th>Fuente de Datos</th><th>Cálculo de Embeddings</th><th>Mantenimiento & Casos de Uso</th></tr>\n<tr><td><b>Delta Sync: Managed Embeddings</b></td><td>Tabla Delta registrada en Unity Catalog.</td><td>Databricks gestiona la vectorización automática usando un endpoint de Model Serving.</td><td>Ideal para flujos serverless sin pipeline de inferencia externo; sincronización automática vía CDF.</td></tr>\n<tr><td><b>Delta Sync: Self-managed Embeddings</b></td><td>Tabla Delta registrada en Unity Catalog con columna `ARRAY<FLOAT>`.</td><td>El usuario calcula previamente los embeddings (e.g. en un job Spark o DLT) y los escribe en Delta.</td><td>Control total sobre el modelo de embeddings, pipelines personalizados o embeddings precalculados en batch.</td></tr>\n<tr><td><b>Direct Vector Access Index</b></td><td>Sin tabla Delta subyacente obligatoria.</td><td>El usuario envía directamente vectores y metadatos mediante llamadas REST API (`upsert_data`).</td><td>Aplicaciones externas que requieren insertar o actualizar vectores en tiempo real sin pasar por Delta Lake.</td></tr>\n<tr><td><b>Sync Mode: Continuous vs Triggered</b></td><td>Aplica a índices Delta Sync.</td><td><b>Continuous</b> mantiene streaming continuo (baja latencia); <b>Triggered</b> corre en micro-batch programado.</td><td>Continuous minimiza retraso de indexación pero tiene mayor coste; Triggered optimiza costes para cargas batch.</td></tr>\n</table>"
    },
    {
      "id": "dbg-t-3-2",
      "d": 3,
      "title": "3.2 · Búsqueda Híbrida (Dense + BM25), Filtros de Metadatos y Change Data Feed",
      "html": "<table class=\"keytable\">\n<tr><th>Capacidad Técnica</th><th>Detalle de Implementación</th><th>Clave de Examen</th></tr>\n<tr><td><b>Hybrid Search</b></td><td>Combina similitud de vectores densos (semántica profunda) con búsqueda de texto disperso BM25 (palabras clave exactas).</td><td>Indispensable cuando las consultas contienen códigos de error, números de pieza, SKUs o nombres propios junto con lenguaje natural.</td></tr>\n<tr><td><b>Metadata Filtering (`filters_json`)</b></td><td>Pre-filtrado de vectores evaluando condiciones SQL sobre columnas indexadas (`country = 'ES'`, `category IN (...)`).</td><td>Pre-filtrado reduce el espacio de búsqueda en memoria; columnas no indexadas obligan a un post-filtrado lento en Delta.</td></tr>\n<tr><td><b>Change Data Feed (CDF)</b></td><td>`delta.enableChangeDataFeed = true` en la tabla Delta de origen.</td><td>Requisito obligatorio para Delta Sync Index; permite capturar INSERT, UPDATE y DELETE de forma incremental.</td></tr>\n<tr><td><b>Primary Key Requirement</b></td><td>La tabla Delta origen debe tener una `PRIMARY KEY` definida y no nula.</td><td>Obligatorio para que Vector Search pueda identificar unívocamente cada vector y aplicar actualizaciones y borrados.</td></tr>\n</table>"
    },
    {
      "id": "dbg-t-4-1",
      "d": 4,
      "title": "4.1 · Mosaic AI Model Serving: Provisioned Throughput, Serverless y External Models",
      "html": "<table class=\"keytable\">\n<tr><th>Modalidad de Serving</th><th>Mecanismo de Facturación</th><th>Garantía de Rendimiento</th><th>Cuándo Utilizarla</th></tr>\n<tr><td><b>Pay-per-token (Foundation Models)</b></td><td>Pago exacto por tokens de entrada y tokens de salida generados.</td><td>Capacidad compartida; sujeto a límites de tasa (rate limits) bajo alta concurrencia.</td><td>Cargas de trabajo exploratorias, desarrollo, entornos no productivos o tráfico muy variable y esporádico.</td></tr>\n<tr><td><b>Provisioned Throughput</b></td><td>Tarifa fija por hora por Unidad de Modelo (Model Unit / MU) reservada.</td><td>Concurrencia dedicada garantizada; latencia determinista sin bloqueos por rate limit externo.</td><td>Aplicaciones de producción en tiempo real con tráfico continuo, SLA estricto y alto volumen de peticiones.</td></tr>\n<tr><td><b>External Models (AI Gateway)</b></td><td>Facturación por el proveedor externo (OpenAI, Anthropic) o unificada.</td><td>Gobernada por el proveedor externo; Databricks añade caching, guardrails, fallback y auditoría unificada.</td><td>Empresas que combinan modelos propietarios de OpenAI/Anthropic con modelos open source bajo una sola API.</td></tr>\n<tr><td><b>Custom Models (MLflow PyFunc)</b></td><td>Instancias de cómputo serverless escalables (CPU/GPU) según concurrencia.</td><td>Escalado automático hasta cero (`scale_to_zero`); latencia sujeta a cold starts si está configurado en 0.</td><td>Despliegue de cadenas RAG empaquetadas, clasificadores de Scikit-Learn o modelos fine-tuneados propios.</td></tr>\n</table>"
    },
    {
      "id": "dbg-t-4-2",
      "d": 4,
      "title": "4.2 · AI Gateway: Guardrails, Rate Limiting, Redacción PII y Enrutamiento Fallback",
      "html": "<table class=\"keytable\">\n<tr><th>Característica de AI Gateway</th><th>Función Principal</th><th>Impacto en Arquitectura y Seguridad</th></tr>\n<tr><td><b>Guardrails de Seguridad</b></td><td>Detección y redacción de datos personales (PII) y filtros de toxicidad y jailbreak en prompts y respuestas.</td><td>Evita que información confidencial llegue a proveedores externos y bloquea ataques de inyección de prompt.</td></tr>\n<tr><td><b>Rate Limiting</b></td><td>Establece cuotas máximas de peticiones por minuto (RPM) y tokens por minuto (TPM) por usuario o equipo.</td><td>Previene consumos descontrolados, protege contra ataques DoS y controla los costes operativos de inferencia.</td></tr>\n<tr><td><b>Fallback Routing</b></td><td>Enruta automáticamente a un modelo secundario si el primario devuelve códigos de error 429, 500 o 503.</td><td>Maximiza la resiliencia y disponibilidad del sistema ante interrupciones de proveedores externos.</td></tr>\n<tr><td><b>Auditoría y Atribución de Costes</b></td><td>Registra cada llamada con su identificador de usuario y tokens consumidos.</td><td>Facilita el reparto interno de costes (chargeback) entre departamentos corporativos.</td></tr>\n</table>"
    },
    {
      "id": "dbg-t-5-1",
      "d": 5,
      "title": "5.1 · MLflow GenAI Evaluation: LLM-as-a-Judge, Faithfulness, Relevance y Tracing",
      "html": "<table class=\"keytable\">\n<tr><th>Métrica / Herramienta</th><th>Qué Mide / Propósito</th><th>Cálculo / Rúbrica en `mlflow.evaluate()`</th></tr>\n<tr><td><b>Faithfulness (Groundedness)</b></td><td>Detecta alucinaciones evaluando si las afirmaciones de la respuesta provienen del contexto recuperado.</td><td>LLM-as-a-judge analiza cada afirmación de la respuesta frente a los fragmentos de contexto aportados.</td></tr>\n<tr><td><b>Answer Relevance</b></td><td>Evalúa si la respuesta generada responde directamente a la consulta del usuario.</td><td>LLM-as-a-judge califica la relevancia y concisión de la respuesta con respecto al prompt inicial.</td></tr>\n<tr><td><b>Context Precision & Recall</b></td><td><b>Precision:</b> fragmentos útiles ordenados arriba. <b>Recall:</b> toda la información requerida fue recuperada.</td><td>Evalúa la calidad del retriever; Context Recall suele requerir una respuesta de referencia (ground truth).</td></tr>\n<tr><td><b>MLflow Tracing (`mlflow.trace`)</b></td><td>Observabilidad en tiempo de ejecución: árbol de spans con latencias, tokens y llamadas intermedias.</td><td>Instrumentación con OpenTelemetry para auditar cada paso (retrieval, prompt formatting, LLM call).</td></tr>\n</table>"
    },
    {
      "id": "dbg-t-5-2",
      "d": 5,
      "title": "5.2 · Gobernanza con Unity Catalog: Inference Tables, Review App y Linaje End-to-End",
      "html": "<table class=\"keytable\">\n<tr><th>Componente de Gobernanza</th><th>Rol en el Ciclo de Vida GenAI</th><th>Beneficio Operativo y Cumplimiento</th></tr>\n<tr><td><b>Inference Tables</b></td><td>Captura asíncrona de peticiones entrantes, respuestas generadas, latencias y metadatos en tablas Delta.</td><td>Permite monitoreo continuo con Lakehouse Monitoring, auditoría de cumplimiento y detección de data drift.</td></tr>\n<tr><td><b>Review App (Agent Evaluation)</b></td><td>Interfaz web para que expertos de negocio prueben agentes y proporcionen feedback humano (thumbs up/down).</td><td>Genera datasets de evaluación de referencia (golden datasets) curados directamente por humanos.</td></tr>\n<tr><td><b>Unity Catalog End-to-End Lineage</b></td><td>Grafo visual que conecta tablas Delta origen, índices vectoriales, modelos registrados y endpoints de serving.</td><td>Auditoría regulatoria inmediata ante solicitudes de derecho al olvido (RGPD) o cambios en fuentes de datos.</td></tr>\n<tr><td><b>Control de Acceso Granular</b></td><td>Permisos `USE CATALOG`, `USE SCHEMA`, `SELECT` y filtros de fila/columna en tablas e índices vectoriales.</td><td>Garantiza que los usuarios sólo puedan recuperar información para la cual tienen autorización formal en Unity Catalog.</td></tr>\n</table>"
    }
  ],
  "questions": [
    {
      "id": "dbg-01",
      "d": 1,
      "t": "RAG vs Fine-Tuning",
      "q": "Una aseguradora multinacional requiere implementar un asistente conversacional para sus peritos que consulte condiciones de pólizas y normativas internas que se actualizan cada dos semanas. Las respuestas deben citar textualmente la cláusula de origen para fines de auditoría legal. ¿Qué enfoque arquitectónico es el más adecuado y por qué?",
      "o": [
        "Implementar RAG con `Mosaic AI Vector Search`, permitiendo sincronizar cambios en Delta Lake sin reentrenar y garantizando citas y trazabilidad legal.",
        "Realizar Fine-Tuning de un modelo de código abierto con LoRA en Databricks para memorizar los textos de pólizas dentro de los pesos neuronales.",
        "Ejecutar Continued Pre-training de un modelo Llama-3 en clústeres GPU con millones de pólizas para que adquiera conocimiento normativo estático.",
        "Aplicar Prompt Engineering básico con Few-Shot incrustando el manual completo de 60.000 páginas en el system prompt de cada llamada a la API."
      ],
      "a": 0,
      "e": "RAG es la arquitectura idónea cuando la base de conocimiento cambia frecuentemente (cada dos semanas) y se exige trazabilidad y citas exactas hacia las fuentes originales. Fine-Tuning y Pre-training congelan la información en los pesos neuronales (knowledge cutoff) y son propensos a alucinaciones sin ofrecer citas directas auditables."
    },
    {
      "id": "dbg-02",
      "d": 1,
      "t": "Selección de Modelos",
      "q": "Una plataforma de comercio electrónico necesita procesar 2 millones de consultas diarias de clasificación de intención de compra con un SLA estricto de latencia p95 < 60 ms y presupuesto controlado. La tarea consiste únicamente en categorizar el texto en una de 12 clases predefinidas. ¿Qué estrategia de modelo ofrece el mejor equilibrio entre coste, latencia y rendimiento?",
      "o": [
        "Desplegar un modelo fundacional de 70B parámetros en Foundation Model APIs con facturación pay-per-token para aprovechar su capacidad de razonamiento general.",
        "Entrenar y desplegar un modelo clasificador pequeño (SLM / encoder como DeBERTa o RoBERTa) optimizado mediante fine-tuning en `Mosaic AI Model Serving`.",
        "Construir un flujo RAG multi-etapa con Vector Search que recupere ejemplos de clasificaciones previas para alimentar un modelo gigante en cada inferencia.",
        "Configurar un agente multi-paso con LangChain y tres llamadas recursivas a modelos externos mediante `AI Gateway` para verificar la coherencia lógica."
      ],
      "a": 1,
      "e": "Para tareas de clasificación pura sobre un conjunto cerrado de clases con altísimo volumen (2M peticiones/día) y latencia ultra-baja (<60 ms), un modelo clasificador pequeño (SLM/encoder) fine-tuneado y servido en Model Serving es infinitamente más rápido, económico y determinista que invocar LLMs generativos masivos o arquitecturas RAG."
    },
    {
      "id": "dbg-03",
      "d": 1,
      "t": "Modelos de Embeddings",
      "q": "Al diseñar una canalización RAG sobre documentación técnica y contractual redactada indistintamente en español, portugués e inglés, un arquitecto debe seleccionar el modelo de embeddings para el índice de `Mosaic AI Vector Search`. ¿Qué conjunto de criterios técnicos debe priorizarse?",
      "o": [
        "Seleccionar exclusivamente el modelo con la mayor dimensión vectorial posible (ej. 4096) asumiendo que mayor dimensionalidad compensa la falta de datos multilingües.",
        "Utilizar la última capa oculta de un modelo generativo autorregresivo gigante como DBRX extrayendo tensores brutos durante cada consulta interactiva de búsqueda.",
        "Evaluar el soporte multilingüe, la ventana de tokens (ej. 512 u 8192) y el trade-off entre dimensión vectorial, latencia y precisión.",
        "Escoger un modelo entrenado únicamente en inglés y anteponer un servicio de traducción automática en tiempo real previo a cada cálculo de embedding vectorial."
      ],
      "a": 2,
      "e": "La selección del modelo de embeddings debe sopesar el soporte multilingüe nativo (para alinear representaciones semánticas en español, portugués e inglés en el mismo espacio vectorial), la longitud máxima de tokens admitida por fragmento, y la dimensionalidad del vector que impacta directamente en el consumo de memoria, latencia de búsqueda y precisión."
    },
    {
      "id": "dbg-04",
      "d": 1,
      "t": "RAG vs Extended Context",
      "q": "Un equipo debate entre utilizar una ventana de contexto extendida (ej. 1M tokens) enviando toda la biblioteca técnica en cada prompt frente a implementar una arquitectura RAG con `Mosaic AI Vector Search`. ¿En qué escenario Vector Search es rotundamente superior a Context Augmented Generation (CAG)?",
      "o": [
        "Cuando el corpus completo no supera los 10.000 tokens en total y se consulta únicamente una vez por semana por un único usuario en un entorno de desarrollo local.",
        "Cuando la tarea requiere comparar el estilo narrativo completo de dos novelas literarias de 70.000 palabras en una sola pasada de análisis estructural global.",
        "Cuando se requiere un modelo sin conexión a bases de datos ni redes corporativas operando exclusivamente en memoria volátil de una estación de trabajo.",
        "Cuando el volumen documental alcanza gigabytes o terabytes, el tráfico de consultas concurrentes es alto y se busca optimizar latencia y coste por token."
      ],
      "a": 3,
      "e": "Cuando el volumen documental es masivo (GB o TB) y el tráfico es continuo, enviar cientos de miles de tokens en cada petición resulta económicamente inviable y genera latencias de segundos o minutos. Vector Search recupera selectivamente sólo los fragmentos pertinentes (unos pocos miles de tokens), minimizando coste y tiempo de procesamiento."
    },
    {
      "id": "dbg-05",
      "d": 1,
      "t": "Seguridad y Guardrails",
      "q": "Una entidad bancaria desplegará un asistente RAG interno con acceso a estados financieros confidenciales. Durante el análisis de amenazas, se identifican riesgos de inyección indirecta de prompts y fugas de datos hacia empleados no autorizados. ¿Qué DOS medidas arquitectónicas deben implementarse en Databricks? (Elige 2 respuestas)",
      "o": [
        "Configurar guardrails en `AI Gateway` para detectar patrones de jailbreak, evaluar toxicidad y redactar información de identificación personal (PII).",
        "Aplicar controles de acceso a nivel de fila y columna en `Unity Catalog` sobre las tablas Delta fuente y los índices de `Mosaic AI Vector Search`.",
        "Desactivar por completo el registro de auditoría en las `Inference Tables` para evitar que los auditores examinen los textos maliciosos de los atacantes.",
        "Elevar la temperatura de muestreo del modelo a 1.0 en `Mosaic AI Model Serving` para que las respuestas ante ataques sean estocásticas e inconsistentes."
      ],
      "a": [
        0,
        1
      ],
      "e": "La combinación de guardrails en `AI Gateway` (para interceptar ataques de prompt injection, lenguaje malicioso y redactar PII antes y después de la inferencia) junto con el gobierno granular de `Unity Catalog` (filtros de fila/columna y permisos `SELECT` sobre tablas Delta e índices vectoriales) establece una defensa en profundidad robusta para aplicaciones GenAI corporativas."
    },
    {
      "id": "dbg-06",
      "d": 1,
      "t": "Costes de Model Serving",
      "q": "Un equipo de ingeniería proyecta un tráfico constante y predecible de 160 peticiones por segundo durante las 24 horas del día para un modelo Llama-3-70B en producción. Al evaluar las modalidades de `Mosaic AI Model Serving`, ¿por qué la modalidad `Provisioned Throughput` es la opción más adecuada frente a `Pay-per-token`?",
      "o": [
        "Porque reserva unidades dedicadas de cómputo (Model Units) garantizando concurrencia, latencia determinista y coste menor ante alto tráfico.",
        "Porque la modalidad `Pay-per-token` no admite modelos con más de 7 mil millones de parámetros y sólo funciona con modelos pequeños de clasificación en Spark.",
        "Porque la modalidad `Provisioned Throughput` exime al equipo de pasar por las políticas de gobierno, autenticación granular y linaje estricto de `Unity Catalog`.",
        "Porque `Provisioned Throughput` reentrena continuamente los pesos neuronales del modelo con cada lote de peticiones entrantes sin ningún coste adicional de infraestructura."
      ],
      "a": 0,
      "e": "`Provisioned Throughput` aprovisiona capacidad de procesamiento dedicada (medida en Model Units), lo que previene errores de saturación (HTTP 429) por concurrencia compartida, ofrece latencia estable y predecible, y resulta económicamente mucho más rentable que `Pay-per-token` cuando el volumen de peticiones es sostenido y elevado."
    },
    {
      "id": "dbg-07",
      "d": 1,
      "t": "Residencia de Datos y Cumplimiento",
      "q": "Un hospital universitario debe procesar historiales clínicos altamente sensibles cumpliendo normativas estrictas de soberanía de datos que prohíben que los textos clínicos salgan del perímetro cloud gestionado de la empresa o se envíen a APIs de terceros. ¿Qué arquitectura en Databricks cumple con este requerimiento?",
      "o": [
        "Configurar `AI Gateway` para redirigir las peticiones hacia la API pública multitenant de un proveedor SaaS externo en otra región geográfica no regulada.",
        "Desplegar un modelo fundacional abierto (ej. Llama-3 o Mistral) en `Mosaic AI Model Serving` ejecutándose dentro del plano de datos del cliente sin salida a internet.",
        "Transmitir los historiales clínicos cifrados en Base64 en el cuerpo del prompt hacia un servicio web público sin acuerdos formales de confidencialidad médica.",
        "Almacenar los historiales en un bucket público de almacenamiento sin Unity Catalog y permitir consultas vectoriales abiertas desde cualquier IP pública de internet."
      ],
      "a": 1,
      "e": "Desplegar modelos open source en `Mosaic AI Model Serving` garantiza que los pesos y la inferencia se ejecuten dentro del entorno gestionado de Databricks (data plane / control plane corporativo), cumpliendo con las políticas de soberanía y privacidad sin enviar datos de pacientes a proveedores SaaS externos."
    },
    {
      "id": "dbg-08",
      "d": 2,
      "t": "Estrategias de Chunking",
      "q": "Un ingeniero de datos procesa especificaciones técnicas de maquinaria estructuradas en Markdown con secciones jerárquicas (#, ##, ###) y tablas detalladas. Al aplicar fragmentación por tamaño fijo, las tablas y subtítulos quedan partidos por la mitad, degradando la calidad de las respuestas en RAG. ¿Qué técnica de chunking resuelve este problema?",
      "o": [
        "Utilizar un `CharacterTextSplitter` con límite rígido de 256 caracteres y solapamiento nulo para forzar cortes estrictamente uniformes en cualquier tipo de texto técnico.",
        "Convertir todo el documento a una única línea continua de texto plano eliminando saltos de línea y formateo antes de generar un único vector para el archivo completo.",
        "Aplicar un `RecursiveCharacterTextSplitter` configurado con separadores jerárquicos de Markdown (`\\n## `, `\\n### `, `\\n\\n`, `\\n`, ` `).",
        "Generar un único chunk masivo de 120.000 palabras por manual técnico y omitir por completo cualquier proceso de segmentación o partición estructural del contenido."
      ],
      "a": 2,
      "e": "`RecursiveCharacterTextSplitter` (o MarkdownHeaderTextSplitter) respeta la jerarquía del documento intentando dividir primero por delimitadores mayores (encabezados de sección Markdown, párrafos) antes de fragmentar por líneas o palabras. Esto mantiene intactas las secciones lógicas, títulos y tablas dentro del mismo bloque contextual."
    },
    {
      "id": "dbg-09",
      "d": 2,
      "t": "Chunk Overlap",
      "q": "En un sistema RAG sobre contratos comerciales, se observa que cuando una cláusula indemnizatoria relevante coincide exactamente con el límite de corte entre dos fragmentos, el LLM emite respuestas incompletas o alucinadas. Al inspeccionar la configuración del divisor de texto, se detecta `chunk_size = 512` y `chunk_overlap = 0`. ¿Cuál es la corrección recomendada?",
      "o": [
        "Reducir el `chunk_size` a 32 tokens manteniendo `chunk_overlap = 0` para generar fragmentos atómicos que aíslen cada palabra clave por separado.",
        "Eliminar los fragmentos pares de la base de datos conservando únicamente los fragmentos impares para evitar redundancias de lectura en el índice.",
        "Incrementar el tamaño del chunk a 80.000 tokens sin overlap forzando al modelo de embeddings a ignorar el 90 % del texto por truncamiento.",
        "Configurar un `chunk_overlap` de entre el 10 % y 20 % del tamaño del fragmento (ej. 50 a 100 tokens) para asegurar continuidad en las fronteras."
      ],
      "a": 3,
      "e": "Configurar un solapamiento (overlap) de entre el 10 % y 20 % del tamaño del chunk asegura que las oraciones o cláusulas ubicadas en los extremos divisorios no pierdan su significado contextual, ya que quedan capturadas íntegramente en al menos uno de los dos fragmentos vecinos."
    },
    {
      "id": "dbg-10",
      "d": 2,
      "t": "Re-ranking con Cross-Encoder",
      "q": "Un buscador RAG empresarial utiliza un bi-encoder para recuperar los 50 fragmentos más similares en `Mosaic AI Vector Search`. Sin embargo, con frecuencia fragmentos irrelevantes que contienen palabras coincidentes pero significado opuesto desplazan a las respuestas correctas. ¿Qué patrón de recuperación en dos fases soluciona esta deficiencia?",
      "o": [
        "Incorporar una segunda fase de re-ranking con un cross-encoder (ej. `BGE-reranker`) sobre los top-50 para reordenar y seleccionar los 5 mejores chunks.",
        "Reemplazar el índice de Vector Search por una consulta relacional estándar en SQL utilizando el operador de coincidencia de patrones `WHERE columna_texto LIKE '%query%'`.",
        "Ejecutar un segundo bi-encoder idéntico al primero con los mismos pesos vectoriales y promediar aritméticamente todas las distancias euclidianas calculadas previamente.",
        "Invertir el orden posicional de los 50 fragmentos recuperados para que los fragmentos de menor similitud bi-encoder aparezcan en la cima del prompt de contexto entregado."
      ],
      "a": 0,
      "e": "El patrón de dos fases (Two-Stage Retrieval) combina la velocidad y escalabilidad de un bi-encoder (para filtrar millones de vectores y quedarse con los top-50 candidatos) con la alta precisión semántica de un cross-encoder (que evalúa la atención cruzada profunda entre consulta y fragmento para reordenar y seleccionar los top-5 finales con mínima latencia añadida)."
    },
    {
      "id": "dbg-11",
      "d": 2,
      "t": "HyDE (Hypothetical Document Embeddings)",
      "q": "Los empleados de una empresa formulan consultas muy breves y abstractas como '¿vacaciones por matrimonio?', mientras que los reglamentos laborales internos describen los beneficios utilizando términos jurídicos como 'permisos retribuidos extraordinarios por nupcias'. ¿Qué técnica de recuperación resuelve esta discrepancia léxica?",
      "o": [
        "Concatenar la consulta del usuario directamente en una sentencia SQL sin sanitizar para buscar coincidencias literales de caracteres en Delta Lake.",
        "`HyDE` (Hypothetical Document Embeddings), generando primero un documento hipotético con un LLM y buscando vectores con su embedding.",
        "Eliminar todas las vocales de la consulta del usuario para comprimir el texto antes de pasarlo al endpoint de embeddings de Databricks.",
        "Aplicar clasificación Zero-Shot con un clasificador determinista y descartar por completo el texto de la consulta original del empleado."
      ],
      "a": 1,
      "e": "`HyDE` utiliza un LLM para generar un documento hipotético de respuesta a partir de la pregunta del usuario. Aunque el documento hipotético contenga datos factuales no verificados, su vocabulario y estructura semántica se asemejan mucho más a los documentos reales indexados en Vector Search que la breve pregunta inicial, logrando un retrieval mucho más certero."
    },
    {
      "id": "dbg-12",
      "d": 2,
      "t": "Registro en MLflow",
      "q": "Un desarrollador de IA crea una cadena conversacional RAG en Databricks combinando LangChain con `Mosaic AI Vector Search`. Para registrar y desplegar adecuadamente la cadena en `Mosaic AI Model Serving`, ¿qué DOS prácticas son obligatorias según el estándar de MLflow? (Elige 2 respuestas)",
      "o": [
        "Registrar el modelo con `mlflow.langchain.log_model()` especificando el entorno de dependencias (`pip_requirements` o `conda_env`) y artefactos.",
        "Declarar explícitamente una firma de modelo (`model signature`) en MLflow que defina el esquema de tipos de entrada y salida esperados.",
        "Guardar el modelo exportando los archivos `.pkl` de Python en un directorio temporal `/tmp` del nodo driver del clúster interactivo.",
        "Hardcodear los tokens de acceso personal (PAT) del desarrollador en el código fuente de la cadena para agilizar la autenticación con Vector Search."
      ],
      "a": [
        0,
        1
      ],
      "e": "Para que un modelo de LangChain sea desplegable de forma reproducible en `Mosaic AI Model Serving`, debe registrarse con `mlflow.langchain.log_model()` indicando claramente sus dependencias de librerías, y contar con una firma (`signature`) que defina formalmente la estructura de entrada (ej. campo `query` o lista de `messages`) y salida, permitiendo validaciones automáticas de esquema."
    },
    {
      "id": "dbg-13",
      "d": 2,
      "t": "Tool Calling y Salidas Estructuradas",
      "q": "Un asistente virtual de soporte debe consultar el estado de envíos o cancelar pedidos invocando APIs corporativas existentes. Al utilizar un modelo fundacional en Databricks con capacidad de Function Calling (Tool Calling), ¿cómo deben definirse las herramientas y procesarse las peticiones del modelo?",
      "o": [
        "Incrustar ejecutables binarios de Windows dentro del cuerpo del prompt para que el contenedor de Model Serving los ejecute directamente en su sistema operativo base.",
        "Solicitar al LLM que genere código SQL arbitrario de eliminación de tablas y ejecutarlo automáticamente con rol de superusuario en el catálogo central de Unity Catalog.",
        "Declarar las herramientas mediante schemas JSON formales con nombre, descripción detallada y parámetros tipados, ejecutando la función al recibir `tool_calls` del modelo.",
        "Desactivar el parser de JSON del modelo y forzarlo a responder únicamente con texto libre sin ningún tipo de delimitación de argumentos ni esquemas computacionales."
      ],
      "a": 2,
      "e": "Tool Calling requiere proporcionar al LLM un catálogo de herramientas descritas en formato JSON Schema (especificando tipos, campos obligatorios y descripciones claras). Cuando el LLM decide que necesita invocar una herramienta, genera un payload JSON estructurado con el nombre de la función y los argumentos que el código de la aplicación cliente ejecuta de forma controlada."
    },
    {
      "id": "dbg-14",
      "d": 2,
      "t": "Context Window y Lost in the Middle",
      "q": "Al evaluar un pipeline RAG que inyecta 25 fragmentos recuperados en el prompt de un LLM, se evidencia que el modelo responde con precisión si la respuesta está en el primer o último fragmento, pero ignora sistemáticamente la información ubicada en los fragmentos 11 a 15 (efecto 'Lost in the Middle'). ¿Qué técnica de ordenación de contexto mitiga este fenómeno?",
      "o": [
        "Duplicar todos los fragmentos centrales 8 veces de forma consecutiva para saturar artificialmente la memoria del modelo durante la inferencia en tiempo de ejecución.",
        "Truncar arbitrariamente el contexto eliminando el 90 % de los fragmentos recuperados dejando únicamente 2 oraciones para todo el documento técnico analizado.",
        "Reentrenar los pesos del transformador mediante fine-tuning para anular por completo la atención posicional de las capas de multi-head attention del modelo.",
        "Reordenar los fragmentos recuperados situando los de mayor relevancia en los extremos (al principio y al final) y los de menor relevancia al centro."
      ],
      "a": 3,
      "e": "Los transformadores sufren del sesgo de atención en forma de U ('Lost in the Middle'): prestan mayor atención a la información situada al inicio y al final del contexto del prompt. Reordenar los fragmentos para que los documentos con mayor puntuación de similitud queden ubicados en el encabezado y en el cierre del bloque de contexto maximiza la probabilidad de que el LLM los considere."
    },
    {
      "id": "dbg-15",
      "d": 3,
      "t": "Delta Sync vs Direct Access",
      "q": "Un equipo de analistas gestiona una base de conocimiento de 8 millones de artículos almacenada en una tabla Delta de Unity Catalog sujeta a constantes inserciones, modificaciones y bajas por parte de pipelines ETL en streaming. Desean que el índice vectorial se mantenga sincronizado automáticamente sin desarrollar código de reconciliación manual. ¿Qué tipo de índice de `Mosaic AI Vector Search` debe utilizarse?",
      "o": [
        "`Delta Sync Index`, que rastrea automáticamente las operaciones de la tabla Delta de origen aprovechando Change Data Feed (CDF).",
        "`Direct Vector Access Index`, enviando llamadas REST manuales fila por fila desde scripts periódicos programados en cron de Linux.",
        "Una tabla externa en Elasticsearch alojada fuera del perímetro de gobernanza de Unity Catalog sin sincronización de permisos.",
        "Un escaneo exhaustivo de tabla completa en Apache Spark calculando distancias euclidianas en memoria distribuida ante cada consulta individual."
      ],
      "a": 0,
      "e": "`Delta Sync Index` se vincula directamente a una tabla Delta gobernada en Unity Catalog y consume su Change Data Feed (CDF) para procesar de forma automática, continua o por micro-batch, cualquier inserción, actualización o eliminación de registros, manteniendo el índice vectorial al día sin intervención manual."
    },
    {
      "id": "dbg-16",
      "d": 3,
      "t": "Managed vs Self-managed Embeddings",
      "q": "Al configurar un `Delta Sync Index` en `Mosaic AI Vector Search`, el ingeniero debe elegir entre la modalidad `Managed Embeddings` y `Self-managed Embeddings`. ¿Cuál es la diferencia operativa fundamental entre ambas opciones?",
      "o": [
        "En `Self-managed Embeddings`, Databricks asume automáticamente toda la infraestructura y no permite que el usuario use modelos de embedding propios ni personalizados.",
        "En `Managed Embeddings`, Databricks calcula y actualiza los embeddings desde una columna de texto con un endpoint; en `Self-managed`, el usuario provee los vectores.",
        "`Managed Embeddings` sólo admite tablas almacenadas en formato CSV plano, mientras que `Self-managed` requiere bases de datos relacionales externas montadas por JDBC.",
        "En `Self-managed Embeddings`, el índice no admite búsquedas por similitud vectorial y sólo ejecuta filtros deterministas basados en expresiones regulares de texto."
      ],
      "a": 1,
      "e": "En `Managed Embeddings`, Databricks se encarga de llamar a un endpoint de Model Serving (modelo de embeddings) para generar y mantener los vectores a partir de la columna de texto especificada. En `Self-managed Embeddings`, el usuario es responsable de calcular la columna de vectores (tipo `ARRAY<FLOAT>`) antes de que los datos lleguen al índice de Vector Search."
    },
    {
      "id": "dbg-17",
      "d": 3,
      "t": "Requisitos de Delta Sync Index",
      "q": "Un ingeniero intenta crear un `Delta Sync Index` sobre una tabla Delta en Unity Catalog, pero la interfaz de Databricks arroja un error de validación impidiendo completar la operación. Al revisar la configuración de la tabla, ¿cuáles son los DOS requisitos estructurales obligatorios que la tabla origen debe cumplir?",
      "o": [
        "Tener un tamaño total inferior a 10 megabytes y estar particionada obligatoriamente por día y hora en el sistema de almacenamiento de archivos de la nube corporativa.",
        "Estar registrada en el metastore legacy de Hive y tener desactivadas todas las propiedades de transacciones ACID y control de versiones de Delta Lake.",
        "Tener habilitada la propiedad `delta.enableChangeDataFeed = true` y contar con una clave primaria (`PRIMARY KEY`) explícita y no nula.",
        "Contener exclusivamente columnas numéricas sin admitir ningún campo de tipo texto ni identificadores alfanuméricos dentro de la estructura de la tabla."
      ],
      "a": 2,
      "e": "Para que un `Delta Sync Index` pueda sincronizar cambios de forma incremental y consistente, la tabla Delta origen en Unity Catalog debe tener habilitado el Change Data Feed (`delta.enableChangeDataFeed = true`) y poseer una `PRIMARY KEY` definida, lo que permite al motor rastrear qué vector exacto insertar, actualizar o eliminar."
    },
    {
      "id": "dbg-18",
      "d": 3,
      "t": "Sync Mode: Continuous vs Triggered",
      "q": "Una aplicación financiera de trading algorítmico requiere que las noticias corporativas ingresadas en una tabla Delta queden disponibles para búsqueda semántica en Vector Search con una latencia inferior a 60 segundos tras su inserción. Al configurar el `Delta Sync Index`, ¿qué modo de sincronización debe seleccionarse y cuál es su contrapartida?",
      "o": [
        "Modo `Triggered`, que apaga la infraestructura de indexación inmediatamente pero genera latencias de sincronización de varios días entre actualizaciones de la tabla.",
        "Modo `Manual Snapshot`, que exige que un analista presione un botón en la interfaz gráfica de Databricks para cada noticia individual que se registre en el sistema.",
        "Modo `Read-Only`, que congela la tabla Delta e impide la entrada de nuevas noticias para garantizar que no existan discrepancias entre el almacenamiento y el vector.",
        "Modo `Continuous`, que ejecuta un pipeline de streaming continuo manteniendo el índice al día en tiempo casi real pero con un mayor coste de cómputo."
      ],
      "a": 3,
      "e": "El modo `Continuous` mantiene un pipeline de streaming activo que procesa inmediatamente los eventos del Change Data Feed, logrando latencias de actualización de segundos, ideal para aplicaciones en tiempo real. Su contrapartida es un coste continuo de infraestructura frente al modo `Triggered`, que procesa cambios en lotes periódicos y apaga los recursos al terminar."
    },
    {
      "id": "dbg-19",
      "d": 3,
      "t": "Hybrid Search",
      "q": "Un catálogo de repuestos de aviación recibe consultas de mantenimiento que combinan descripciones en lenguaje natural ('falla de junta tórica en válvula hidráulica') con números de serie y códigos exactos ('MS28775-224'). Los usuarios reportan que las búsquedas vectoriales puras a menudo confunden el código de pieza con otros similares. ¿Qué capacidad de `Mosaic AI Vector Search` resuelve esta limitación?",
      "o": [
        "`Hybrid Search`, combinando búsqueda vectorial densa con búsqueda léxica dispersa (BM25 / full-text) y fusionando los resultados de forma ponderada.",
        "Reducir las dimensiones de los embeddings a 4 valores para que los números de serie se codifiquen mediante coordenadas espaciales simples.",
        "Eliminar los códigos de serie y números de pieza de la base de datos documental para evitar que interfieran con la similitud semántica.",
        "Utilizar búsqueda KNN exacta realizando un cálculo de producto punto sobre todos los registros en un único hilo de CPU."
      ],
      "a": 0,
      "e": "`Hybrid Search` combina lo mejor de dos mundos: la búsqueda vectorial densa (que captura la semántica profunda de frases como 'falla de junta tórica') junto con la búsqueda dispersa BM25 / texto completo (que empareja con exactitud absoluta códigos alfanuméricos como 'MS28775-224'), combinando ambas puntuaciones para devolver el orden óptimo."
    },
    {
      "id": "dbg-20",
      "d": 3,
      "t": "Filtros de Metadatos",
      "q": "Una firma jurídica internacional gestiona jurisprudencia de múltiples jurisdicciones. Al consultar el índice de `Mosaic AI Vector Search`, la aplicación debe restringir las respuestas exclusivamente a documentos donde la columna `jurisdiction` sea 'España' y el campo `year` sea mayor o igual a 2021. ¿Cómo debe implementarse este filtro en la llamada de búsqueda?",
      "o": [
        "Recuperar los 100.000 vectores más cercanos en el cliente web y realizar un filtrado en memoria utilizando una lista por comprensión de Python en el servidor web.",
        "Pasar la condición estructurada mediante el parámetro `filters_json` en la API de búsqueda vectorial para realizar un pre-filtrado optimizado en el índice.",
        "Crear un clúster Spark independiente para cada consulta individual y ejecutar una reindexación completa de los documentos correspondientes a esos criterios temporales.",
        "Añadir el texto 'España 2021' 50 veces al final de la consulta del usuario esperando que el modelo vectorial interprete la restricción temporal automáticamente."
      ],
      "a": 1,
      "e": "`Mosaic AI Vector Search` admite el parámetro `filters_json` en su API de consulta (`similarity_search`), permitiendo aplicar filtros booleanos y relacionales sobre las columnas de metadatos indexadas. Este pre-filtrado reduce el espacio de búsqueda vectorial en memoria antes de computar vecinos más cercanos, garantizando baja latencia y exactitud."
    },
    {
      "id": "dbg-21",
      "d": 3,
      "t": "Sizing de Endpoints de Vector Search",
      "q": "Un equipo de arquitectura planifica un endpoint de `Mosaic AI Vector Search` para una base de conocimiento de 30 millones de vectores con una demanda esperada de 400 consultas por segundo (QPS). ¿Qué aspecto de dimensionamiento y escalado debe tenerse en cuenta para asegurar la disponibilidad del servicio?",
      "o": [
        "Los endpoints de Vector Search son exclusivamente estáticos y limitados a un máximo estricto de 50.000 vectores por catálogo en cualquier workspace de Databricks.",
        "Los índices vectoriales se ejecutan íntegramente dentro del navegador web de los usuarios mediante WebAssembly sin consumir cómputo en la nube de Databricks.",
        "Seleccionar el tipo de endpoint adecuado considerando la capacidad en millones de vectores y el escalado de unidades para tolerar los picos de QPS requeridos.",
        "El servicio sólo puede escalar si se reinicia manualmente el metastore de Unity Catalog durante una ventana de mantenimiento semanal programada por el administrador."
      ],
      "a": 2,
      "e": "Los endpoints de `Mosaic AI Vector Search` disponen de tipos y capacidades específicas (orientadas a volumen de vectores en memoria y rendimiento de throughput). Dimensionar adecuadamente el endpoint y permitir el auto-escalado de capacidad es fundamental para soportar 30M de vectores y picos de 400 QPS con latencias sub-segundo estables."
    },
    {
      "id": "dbg-22",
      "d": 3,
      "t": "Gobernanza y Permisos en Unity Catalog",
      "q": "Una aplicación web externa autenticada mediante una Service Principal necesita ejecutar consultas de búsqueda semántica sobre un índice de `Mosaic AI Vector Search` registrado en Unity Catalog. ¿Cuáles son los privilegios mínimos requeridos que deben otorgarse a dicha Service Principal?",
      "o": [
        "Otorgar el rol de `ACCOUNT ADMIN` a nivel de cuenta cloud para que la aplicación tenga acceso total a la facturación y gestión global de usuarios de Databricks.",
        "Asignar permisos de escritura destructiva `MODIFY` y privilegios `CREATE TABLE` en todos los esquemas del catálogo corporativo de datos de la empresa.",
        "Desactivar Unity Catalog en el workspace para que la autenticación sea totalmente anónima y no requiera ningún tipo de credencial ni validación de seguridad.",
        "Conceder `USE CATALOG` en el catálogo, `USE SCHEMA` en el esquema, y privilegio `SELECT` sobre el índice vectorial y la tabla Delta asociada."
      ],
      "a": 3,
      "e": "Bajo el modelo de seguridad de Unity Catalog, para leer o consultar cualquier objeto (incluyendo tablas e índices vectoriales) se requiere la jerarquía de permisos de lectura: `USE CATALOG` en el catálogo contenedor, `USE SCHEMA` en el esquema, y `SELECT` sobre el índice de Vector Search y su tabla Delta de origen."
    },
    {
      "id": "dbg-23",
      "d": 3,
      "t": "Cumplimiento RGPD y Borrado en Delta Sync",
      "q": "En cumplimiento del derecho al olvido (RGPD), un cliente solicita la supresión de sus registros. Un analista ejecuta `DELETE FROM clientes_docs WHERE cliente_id = 'C-8842'` en la tabla Delta conectada a un `Delta Sync Index`. ¿Qué DOS elementos garantizan que los vectores asociados desaparezcan de los resultados de búsqueda de Vector Search? (Elige 2 respuestas)",
      "o": [
        "Que la tabla Delta tenga activado el Change Data Feed (CDF), registrando el evento de eliminación para su propagación al índice.",
        "Que el pipeline de sincronización del índice procese los cambios (de forma continua o en la próxima ejecución programada del modo triggered).",
        "Que se destruya y se vuelva a aprovisionar el endpoint completo de Vector Search cada vez que se ejecute una sentencia de borrado en Delta Lake.",
        "Que se invoque inmediatamente un comando `VACUUM` con retención de cero horas sobre la tabla antes de que el sincronizador de vectores lea los logs."
      ],
      "a": [
        0,
        1
      ],
      "e": "En un `Delta Sync Index`, los borrados en la tabla Delta origen se capturan a través del Change Data Feed (CDF), donde la fila eliminada se marca como `_change_type = 'delete'`. Cuando el pipeline del índice procesa dicho cambio (continuo o triggered), localiza el vector mediante la clave primaria y lo suprime del índice vectorial sin requerir recrear el endpoint."
    },
    {
      "id": "dbg-24",
      "d": 3,
      "t": "Métricas de Distancia Vectorial",
      "q": "Al definir un índice de búsqueda en `Mosaic AI Vector Search` con embeddings que han sido rigurosamente normalizados a norma unitaria (L2 = 1.0), el equipo debate si configurar `Cosine Similarity` o `Dot Product` como métrica de similitud. ¿Cuál es la relación matemática y de rendimiento entre ambas métricas?",
      "o": [
        "Con vectores normalizados, el producto punto es idéntico a la similitud coseno y resulta más eficiente al omitir el cálculo de normas.",
        "El producto punto sólo puede calcularse si los vectores contienen valores enteros positivos entre 0 y 255 y no admite números en coma flotante de precisión simple.",
        "La similitud coseno invierte la polaridad geométrica de las distancias euclidianas produciendo únicamente valores imaginarios complejos en espacios multidimensionales.",
        "El producto punto exige que los vectores sean ortogonales entre sí antes de iniciar la búsqueda y genera divisiones por cero en vectores paralelos orientados al origen."
      ],
      "a": 0,
      "e": "La fórmula de la similitud coseno es `dot(u, v) / (||u|| * ||v||)`. Cuando los vectores están previamente normalizados a norma unitaria (`||u|| = ||v|| = 1`), el denominador es 1 y la expresión se simplifica exactamente a `dot(u, v)`. Computar el producto punto puro ahorra el cálculo en tiempo real de las normas euclidianas, acelerando las búsquedas."
    },
    {
      "id": "dbg-25",
      "d": 3,
      "t": "Optimización Delta para Vector Search",
      "q": "Una tabla Delta con 200 millones de filas experimenta lecturas lentas y alto consumo de I/O cuando el motor de `Delta Sync Index` consulta los registros modificados. ¿Qué comando de optimización física de Delta Lake debe ejecutarse sobre la tabla para compactar archivos pequeños y optimizar la lectura por clave primaria?",
      "o": [
        "Ejecutar `DROP TABLE` seguido de una recreación en formato de texto plano TSV sin índices ni metadatos en un disco local conectado al nodo conductor del clúster.",
        "Ejecutar `OPTIMIZE table_name ZORDER BY (primary_key_col)` (o habilitar Liquid Clustering) para organizar físicamente los datos en archivos Parquet optimizados.",
        "Deshabilitar las transacciones ACID y convertir la tabla Delta a una colección desestructurada de documentos JSON sin particiones ni control de concurrencia.",
        "Dividir la tabla en 200 millones de archivos individuales de 50 bytes para forzar un paralelismo masivo en el sistema de almacenamiento distribuido en la nube."
      ],
      "a": 1,
      "e": "El comando `OPTIMIZE` compacta los archivos pequeños de Delta Lake en archivos Parquet más grandes (~1 GB) y la cláusula `ZORDER BY` (o el moderno `Liquid Clustering`) organiza físicamente los datos co-localizando valores similares de las columnas seleccionadas. Esto minimiza drásticamente la cantidad de datos leídos por el sincronizador de Vector Search."
    },
    {
      "id": "dbg-26",
      "d": 3,
      "t": "Columna Fuente en Managed Embeddings",
      "q": "Al configurar un `Delta Sync Index` con `Managed Embeddings` en `Mosaic AI Vector Search`, ¿cuál es el requisito formal que debe cumplir la columna que contiene el texto de origen a vectorizar (`source_text`) en la tabla Delta?",
      "o": [
        "Debe ser de tipo `BINARY` conteniendo la serialización Pickle de objetos de Python generados en el nodo driver del clúster durante la ingesta de datos.",
        "Debe contener una matriz bidimensional de enteros de 64 bits con valores hash generados por un algoritmo criptográfico SHA-512 sin información de texto plano.",
        "Debe ser de tipo `STRING`, no admitir valores nulos en las filas a indexar y almacenar el contenido textual a vectorizar.",
        "Debe nombrarse obligatoriamente `raw_unstructured_text_payload` o de lo contrario el esquema de Unity Catalog rechazará la creación del índice vectorial."
      ],
      "a": 2,
      "e": "En la modalidad `Managed Embeddings`, la columna fuente debe ser estrictamente de tipo `STRING` y contener texto legible no nulo. Databricks toma el contenido de esta columna y lo envía al endpoint de embeddings configurado para generar y persistir automáticamente la representación vectorial en el índice."
    },
    {
      "id": "dbg-27",
      "d": 3,
      "t": "Evolución de Metadatos en Vector Search",
      "q": "Un equipo de datos añade una nueva columna de metadatos llamada `department_code` a la tabla Delta origen de un `Delta Sync Index` en producción. Desean que los desarrolladores puedan filtrar búsquedas por este nuevo atributo. ¿Cómo se incorpora esta nueva columna al índice vectorial?",
      "o": [
        "Es imposible añadir columnas a un índice existente y la única alternativa es borrar el metastore corporativo de Unity Catalog y crearlo desde cero de forma manual.",
        "La tabla Delta se bloquea de forma permanente y ya no permite inserciones de nuevas filas hasta que se desmonte y vuelva a montar el almacenamiento cloud subyacente.",
        "Se debe exportar la tabla completa a una base de datos NoSQL externa para reconstruir manualmente los índices invertidos en la infraestructura de otro proveedor.",
        "Se actualiza la especificación del índice vectorial en Vector Search para incluir la nueva columna en la lista de sincronización de metadatos."
      ],
      "a": 3,
      "e": "Los índices de `Mosaic AI Vector Search` permiten actualizar su definición para incluir nuevas columnas de la tabla Delta origen como columnas adicionales de sincronización de metadatos. Tras actualizar la especificación, el pipeline de sincronización propaga los nuevos atributos sin requerir recrear el metastore ni interrumpir la tabla origen."
    },
    {
      "id": "dbg-28",
      "d": 3,
      "t": "Latencia y Pre-filtrado de Metadatos",
      "q": "Durante una auditoría de rendimiento de un índice de `Mosaic AI Vector Search`, el equipo observa que la latencia media salta de 18 ms a 340 ms al aplicar un filtro sobre el campo `cost_center`. Al investigar la definición del índice, se descubre que `cost_center` no fue incluida en las columnas sincronizadas del índice. ¿A qué se debe esta degradación?",
      "o": [
        "Al no estar indexada en memoria del endpoint, el motor debe realizar un post-filtrado leyendo datos de la tabla Delta tras la búsqueda vectorial.",
        "A que el endpoint de Vector Search se apaga automáticamente y se reinicia en frío cada vez que detecta un nombre de columna desconocido en la consulta enviada.",
        "A que el protocolo HTTP/2 no soporta el envío de filtros estructurados en JSON cuando los nombres de las claves de búsqueda superan los 8 caracteres de longitud.",
        "A que las consultas sobre atributos no indexados se reenvían por correo electrónico a un administrador de sistemas para su resolución manual asistida."
      ],
      "a": 0,
      "e": "Cuando un filtro se aplica sobre columnas que están incluidas en el índice vectorial, el motor realiza un pre-filtrado ultrarrápido directamente en memoria durante el cálculo de vecinos más cercanos. Si la columna no está indexada en el endpoint, el sistema debe recuperar muchos más candidatos y hacer un post-filtrado accediendo a la tabla Delta subyacente, disparando la latencia de consulta."
    },
    {
      "id": "dbg-29",
      "d": 3,
      "t": "Troubleshooting de Sincronización FAILED",
      "q": "El pipeline de un `Delta Sync Index` con `Managed Embeddings` entra en estado `FAILED` interrumpiendo la actualización del índice. En la pestaña de diagnóstico del Vector Search Manager, se visualiza el error: `Model Serving endpoint 'bge-large-serving' unavailable or returned HTTP 500`. ¿Cuál es la causa raíz y la acción correctiva inmediata?",
      "o": [
        "La tabla Delta origen superó los 1.000 registros y Unity Catalog bloqueó la sincronización por exceder la cuota comunitaria gratuita asignada a la suscripción del cliente.",
        "El endpoint de Model Serving que genera los embeddings para el índice falló o fue modificado; debe restaurarse dicho endpoint y reiniciar la sincronización.",
        "El usuario que creó el índice cerró su navegador web, interrumpiendo la ejecución del proceso batch en segundo plano de Databricks que actualizaba las tablas.",
        "Se debe cambiar el dialecto SQL de Databricks a Transact-SQL y recrear todas las tablas en una base de datos relacional local montada en disco duro tradicional."
      ],
      "a": 1,
      "e": "En `Managed Embeddings`, el pipeline de sincronización invoca continuamente el endpoint de Model Serving para computar los vectores de las filas nuevas o modificadas. Si ese endpoint de embeddings se detiene, se elimina, o devuelve errores HTTP 500 por sobrecarga, el pipeline de Vector Search no puede calcular los embeddings y pasa a estado `FAILED`. La solución es verificar y estabilizar el endpoint de serving."
    },
    {
      "id": "dbg-30",
      "d": 4,
      "t": "Tipos de Modelos en Model Serving",
      "q": "Una empresa de software empresarial necesita desplegar en producción tres componentes de inferencia: un LLM de código abierto (Mistral-7B), una cadena RAG personalizada construida con LangChain y empaquetada con MLflow, y el modelo GPT-4o de OpenAI. ¿Cómo cubre `Mosaic AI Model Serving` estas tres necesidades?",
      "o": [
        "Model Serving solo admite modelos tradicionales de regresión logística y no tiene capacidades para servir modelos generativos ni APIs externas de proveedores terceros.",
        "Exige compilar los tres modelos en código binario C++ nativo y desplegarlos en clústeres Kubernetes independientes autogestionados por el equipo de infraestructura.",
        "Provee Foundation Model APIs para Mistral-7B, soporte de Custom Models (MLflow PyFunc) para la cadena RAG, y External Models para gobernar GPT-4o.",
        "Obliga a convertir todos los modelos a formato ONNX y ejecutarlos exclusivamente dentro de consultas SQL batch programadas en Databricks SQL Serverless."
      ],
      "a": 2,
      "e": "`Mosaic AI Model Serving` es una plataforma integral que admite: 1) Foundation Model APIs (modelos abiertos como Llama-3, Mistral, DBRX listos para usar serverless), 2) Custom Models (modelos propios o cadenas LangChain/LlamaIndex registradas con MLflow PyFunc), y 3) External Models (modelos propietarios externos como OpenAI o Anthropic bajo una API unificada y gobernada con AI Gateway)."
    },
    {
      "id": "dbg-31",
      "d": 4,
      "t": "Provisioned Throughput vs Pay-per-token",
      "q": "Una aplicación bancaria de asistencia financiera experimenta picos imprevistos de 500 solicitudes por segundo en un endpoint de Foundation Model. Al utilizar la modalidad `Pay-per-token`, los clientes reciben frecuentes errores `HTTP 429 Too Many Requests` debido a los límites de concurrencia compartida de la plataforma. ¿Qué cambio arquitectónico garantiza capacidad dedicada y elimina estos bloqueos?",
      "o": [
        "Reducir el timeout de la aplicación a 5 milisegundos para que las peticiones se descarten de inmediato antes de que el servidor web de serving comience a procesarlas.",
        "Desplegar el modelo en un notebook interactivo de Databricks y compartir la URL pública del clúster interactivo con todos los usuarios finales de la organización.",
        "Implementar un bucle infinito de reintentos síncronos en el cliente sin backoff exponencial hasta saturar completamente las conexiones de la red corporativa.",
        "Migrar el endpoint a `Provisioned Throughput`, asignando las Unidades de Modelo (Model Units) necesarias para absorber el tráfico pico con capacidad dedicada garantizada."
      ],
      "a": 3,
      "e": "La modalidad `Provisioned Throughput` reserva infraestructura de cómputo dedicada (Model Units) para el endpoint del cliente. Al contar con recursos garantizados y no compartidos con otros inquilinos del workspace, se eliminan los errores HTTP 429 causados por límites de tasa compartidos y se asegura una latencia predecible bajo alto volumen de tráfico."
    },
    {
      "id": "dbg-32",
      "d": 4,
      "t": "Seguridad de External Models",
      "q": "Al configurar un endpoint de `External Models` en `Mosaic AI Model Serving` para consultar modelos de Anthropic Claude o Azure OpenAI, ¿cuál es la mejor práctica de seguridad de Databricks para almacenar y suministrar las claves de API privadas requeridas por el proveedor?",
      "o": [
        "Almacenar las claves en Databricks Secrets (o secretos de Unity Catalog) y referenciar la ruta del secreto en la configuración del endpoint.",
        "Escribir la clave de API en texto plano dentro de una celda comentada en un notebook interactivo visible para todos los desarrolladores de la organización.",
        "Crear un archivo `.txt` con la clave en la raíz de DBFS (`/dbfs/api_keys.txt`) otorgando permisos de lectura pública a cualquier usuario del workspace corporativo.",
        "Pasar la clave de API como un parámetro de texto en la cabecera del prompt del usuario final en cada llamada HTTP interactiva enviada desde el navegador."
      ],
      "a": 0,
      "e": "Para proteger credenciales de acceso a proveedores externos, Databricks exige almacenar las claves en Databricks Secrets o secretos integrados en Unity Catalog. Al configurar el endpoint de `External Models`, se referencia el secreto mediante `{{secrets/scope/key}}`, permitiendo que el servicio de inferencia acceda a la clave de forma segura sin exponerla en texto plano ni en los logs."
    },
    {
      "id": "dbg-33",
      "d": 4,
      "t": "Arquitectura de AI Gateway",
      "q": "Una multinacional implementa `Mosaic AI Gateway` como punto de entrada unificado para todas las aplicaciones y microservicios que consumen modelos de lenguaje en la organización. ¿Cuál es el principal valor arquitectónico de esta solución frente al acceso directo a APIs de proveedores?",
      "o": [
        "Actúa como un compilador en tiempo real que traduce automáticamente código antiguo de Scala a Python 3 durante la fase de inferencia de modelos en la nube.",
        "Centraliza gobernanza, auditoría, políticas de guardrails, control de costes, rate limiting y resiliencia sin modificar el código de los clientes.",
        "Sustituye por completo al catálogo de datos de Unity Catalog y elimina las restricciones de permisos sobre todas las tablas Delta registradas en el Lakehouse.",
        "Desactiva las conexiones a internet del workspace forzando a que los modelos se ejecuten en cintas magnéticas de copia de seguridad fuera de línea."
      ],
      "a": 1,
      "e": "`Mosaic AI Gateway` desacopla las aplicaciones consumidoras de los proveedores subyacentes de modelos de IA, actuando como un intermediario inteligente gestionado que aplica de manera uniforme auditoría de consultas, control de gastos, límites de tasa (rate limiting), filtros de seguridad (guardrails) y enrutamiento con conmutación por error (fallback), simplificando la gobernanza corporativa."
    },
    {
      "id": "dbg-34",
      "d": 4,
      "t": "Guardrails en AI Gateway",
      "q": "Un departamento de atención al ciudadano despliega un asistente conversacional. Por motivos regulatorios, el sistema debe garantizar que ningún número de tarjeta bancaria, documento nacional de identidad o dato médico sensible se envíe a modelos externos, y además debe rechazar mensajes con contenido ofensivo. ¿Qué funcionalidad de `AI Gateway` automatiza este requerimiento?",
      "o": [
        "Activar la compresión gzip en la capa de transporte HTTP para reducir el tamaño del payload JSON en un 40 % sin alterar el contenido textual transmitido.",
        "Configurar reglas manuales de cortafuegos de red iptables en el sistema operativo del nodo conductor de un clúster Spark interactivo de desarrollo.",
        "Habilitar Guardrails en `AI Gateway`, configurando filtros para detección y redacción de PII y políticas de moderación de toxicidad.",
        "Solicitar a los usuarios que firmen un documento en papel prometiendo no escribir datos personales en la ventana del navegador web al usar el asistente."
      ],
      "a": 2,
      "e": "Los `Guardrails` de `Mosaic AI Gateway` permiten definir políticas automáticas de seguridad que analizan las peticiones y respuestas en tiempo real. Pueden detectar y enmascarar automáticamente información de identificación personal (PII como números de tarjeta, DNI o teléfonos) y bloquear mensajes que superen umbrales de toxicidad, garantizando el cumplimiento normativo sin código adicional."
    },
    {
      "id": "dbg-35",
      "d": 4,
      "t": "Políticas de Rate Limiting",
      "q": "Para evitar que una aplicación defectuosa en bucle infinito o un usuario malintencionado agoten la cuota de gasto mensual en un endpoint servido a través de `AI Gateway`, ¿cuáles DOS políticas de límite de tasa (`Rate Limits`) se pueden configurar a nivel de endpoint o token? (Elige 2 respuestas)",
      "o": [
        "Límite de peticiones por minuto (Requests Per Minute - RPM) para restringir el número total de llamadas a la API en una ventana temporal.",
        "Límite de tokens por minuto (Tokens Per Minute - TPM) para controlar el volumen total de entrada y salida procesado por el modelo.",
        "Límite de caracteres por función en los scripts de Python del repositorio de control de versiones Git del equipo.",
        "Límite de temperatura estocástica forzando a que ningún modelo pueda utilizar valores de temperatura superiores a 0.01."
      ],
      "a": [
        0,
        1
      ],
      "e": "`AI Gateway` permite configurar cuotas de límite de tasa basadas en: 1) Requests Per Minute (RPM), controlando la frecuencia de solicitudes para prevenir saturación de conexiones, y 2) Tokens Per Minute (TPM), restringiendo el volumen masivo de tokens procesados para mantener el presupuesto financiero bajo control estricto."
    },
    {
      "id": "dbg-36",
      "d": 4,
      "t": "Fallback Routing en AI Gateway",
      "q": "Una aplicación médica de triaje de emergencias utiliza un endpoint de `External Models` que invoca una API externa de última generación como modelo primario. Si el proveedor externo experimenta una degradación de servicio y comienza a responder con errores `HTTP 503` o `HTTP 429`, la aplicación debe conmutar inmediatamente a un modelo secundario sin intervención manual. ¿Qué mecanismo de `AI Gateway` implementa este comportamiento?",
      "o": [
        "Replicar todo el código de la aplicación cliente en 10 servidores físicos diferentes conectados en anillo de fibra óptica para balancear peticiones HTTP.",
        "Desconectar el balanceador de carga del sistema para que los clientes acumulen peticiones en una cola de espera indefinida en el servidor de aplicaciones.",
        "Enviar una alerta por buscapersonas al equipo de guardia nocturna para que editen la variable de entorno del cliente en los servidores de producción.",
        "`Fallback Routing`, configurando una ruta de respaldo priorizada a la que redirigir el tráfico automáticamente ante fallos del modelo primario."
      ],
      "a": 3,
      "e": "`Fallback Routing` en `AI Gateway` permite configurar una lista ordenada de modelos alternativos. Si el endpoint primario falla o devuelve errores de sobrecarga o indisponibilidad (ej. HTTP 429, 500 o 503), Gateway intercepta el error de forma transparente y reenvía la petición al modelo de respaldo definido, asegurando una alta disponibilidad ininterrumpida para servicios críticos."
    },
    {
      "id": "dbg-37",
      "d": 4,
      "t": "Streaming con Server-Sent Events (SSE)",
      "q": "En una interfaz web de asistente conversacional construida sobre `Mosaic AI Model Serving`, los usuarios se quejan de que la pantalla permanece en blanco durante 5 segundos y luego aparece el párrafo completo de golpe. Para mejorar drásticamente la percepción de fluidez y el Time To First Token (TTFT), ¿qué parámetro de inferencia debe activarse en el endpoint y en el cliente?",
      "o": [
        "Activar la generación en streaming mediante Server-Sent Events enviando el parámetro `stream=True` en la petición a la API de serving para recibir tokens continuos.",
        "Aumentar el tamaño del batch a 64 peticiones agrupadas para que el servidor acumule múltiples preguntas antes de generar cualquier texto de respuesta.",
        "Desactivar las unidades de procesamiento gráfico (GPU) del endpoint para que la inferencia se ejecute en un único hilo de CPU de bajo consumo energético.",
        "Empaquetar la respuesta del modelo en un archivo comprimido RAR protegido con clave criptográfica antes de transferirla al cliente web por HTTP."
      ],
      "a": 0,
      "e": "Configurar `stream=True` permite al endpoint de `Mosaic AI Model Serving` transmitir los tokens generados de forma progresiva a través de una conexión persistente utilizando Server-Sent Events (SSE). El cliente puede ir renderizando cada palabra o token en la pantalla a medida que se produce, reduciendo el Time To First Token percibido a unos pocos milisegundos."
    },
    {
      "id": "dbg-38",
      "d": 4,
      "t": "Despliegue de Modelos Personalizados con MLflow",
      "q": "Al desplegar una cadena RAG personalizada construida con `MLflow PyFunc` en `Mosaic AI Model Serving`, el endpoint falla durante la fase de inicialización con el error `ModuleNotFoundError: No module named 'langchain_community'`. ¿Cómo debe solucionar el ingeniero este problema para garantizar un entorno reproducible?",
      "o": [
        "Instalar la librería en la computadora portátil del desarrollador y reiniciar la sesión de trabajo local de VS Code esperando que se sincronice en la nube.",
        "Declarar explícitamente `langchain_community` en el parámetro `pip_requirements` o `conda_env` al invocar `mlflow.pyfunc.log_model()`.",
        "Conectar por SSH al contenedor de serving de Databricks y ejecutar manualmente `sudo apt-get install python3-langchain` en la línea de comandos del host.",
        "Eliminar todas las referencias a librerías externas y reescribir la cadena completa en código ensamblador sin dependencias de paquetes de terceros."
      ],
      "a": 1,
      "e": "Cuando `Mosaic AI Model Serving` despliega un modelo empaquetado con MLflow, aprovisiona un contenedor limpio donde instala las dependencias declaradas en el artefacto del modelo. Especificar las dependencias exactas en `pip_requirements` (o `conda_env`) durante la llamada `log_model()` garantiza que el contenedor de inferencia instale todas las librerías necesarias de forma automática y aislada."
    },
    {
      "id": "dbg-39",
      "d": 4,
      "t": "Autoscaling y Scale to Zero",
      "q": "Un departamento de innovación dispone de 12 modelos experimentales fine-tuneados para pruebas ocasionales de I+D. Cada modelo se consulta un promedio de dos veces por semana. Para optimizar el presupuesto y evitar pagar por infraestructura GPU ocia las 24 horas del día, ¿qué configuración de autoscaling debe aplicarse en los endpoints de `Mosaic AI Model Serving`?",
      "o": [
        "Fijar la concurrencia mínima en 4 instancias dedicadas permanentes para asegurar que nunca se produzca un arranque en frío bajo ninguna circunstancia operativa.",
        "Eliminar y volver a entrenar los 12 modelos cada noche mediante un script automatizado para liberar memoria en el clúster interactivo de la organización.",
        "Configurar `Scale to Zero`, estableciendo el tamaño mínimo de cómputo en 0 unidades para apagar los recursos en periodos de inactividad.",
        "Apagar la conexión de red del workspace de Databricks fuera del horario laboral de lunes a viernes interrumpiendo todas las tareas de la empresa."
      ],
      "a": 2,
      "e": "`Scale to Zero` permite que los endpoints de `Mosaic AI Model Serving` desaprovisionen automáticamente sus recursos de cómputo tras un periodo de inactividad, reduciendo el coste de ejecución a exactamente cero cuando no hay tráfico. Al recibir una nueva petición, el servicio realiza un cold start aprovisionando los recursos automáticamente."
    },
    {
      "id": "dbg-40",
      "d": 4,
      "t": "Traffic Splitting y Despliegues Canary",
      "q": "Se ha desarrollado una nueva versión (v2) de una cadena RAG con un prompt optimizado y un índice vectorial más reciente. Para evaluar su estabilidad en producción sin poner en riesgo la experiencia de todos los usuarios, el equipo desea dirigir el 90 % de las peticiones a la versión probada v1 y el 10 % a la versión candidata v2. ¿Cómo se implementa este patrón en `Mosaic AI Model Serving`?",
      "o": [
        "Publicar dos URLs distintas en un canal público de Slack y pedir amablemente a los clientes que el 10 % de ellos elija la segunda opción de forma manual.",
        "Configurar un script en Bash que reinicie aleatoriamente el servidor web cada 10 peticiones para alternar de versión en cada caída controlada del servicio.",
        "Desactivar el endpoint durante una hora al día para forzar a los usuarios a probar la versión experimental bajo presión en sus entornos de trabajo.",
        "Configurar `Traffic Splitting` en el endpoint de serving, asignando un peso de tráfico del 90 % a la entidad v1 y 10 % a la versión v2."
      ],
      "a": 3,
      "e": "`Mosaic AI Model Serving` soporta despliegues de múltiples entidades servidas dentro de un mismo endpoint con enrutamiento ponderado (`Traffic Splitting`). Esto permite implementar despliegues tipo Canary o pruebas A/B gestionando porcentajes de tráfico (ej. 90/10) detrás de una única URL estable de endpoint, supervisando el comportamiento de la nueva versión con riesgo mínimo."
    },
    {
      "id": "dbg-41",
      "d": 5,
      "t": "MLflow GenAI Evaluation con LLM-as-a-Judge",
      "q": "Un equipo de IA debe evaluar el rendimiento de un asistente conversacional sobre un conjunto de 5.000 preguntas complejas de clientes reales. El equipo no dispone de respuestas ideales de referencia escritas por humanos (ground truth) para la mayoría de las preguntas. ¿Qué enfoque metodológico habilitado en `mlflow.evaluate()` permite realizar esta evaluación rigurosa a escala?",
      "o": [
        "Utilizar `LLM-as-a-Judge`, empleando un modelo evaluador de alta capacidad que aplique rúbricas formales de calidad sobre las salidas generadas.",
        "Comparar las respuestas generadas contando únicamente el número de consonantes y asignando mayor puntuación a los textos más extensos del reporte analítico.",
        "Asignar una calificación fija de 5 estrellas a todas las respuestas asumiendo que los modelos de lenguaje modernos no cometen errores factuales jamás.",
        "Evaluar el modelo midiendo la temperatura en grados Celsius de los procesadores del centro de datos durante la inferencia intensiva de las preguntas."
      ],
      "a": 0,
      "e": "Cuando no se dispone de un ground truth exhaustivo, `mlflow.evaluate()` soporta el paradigma `LLM-as-a-Judge`. En este esquema, un modelo de alta capacidad (como GPT-4 o DBRX) evalúa las respuestas generadas contra rúbricas estructuradas para métricas como `faithfulness`, `answer_relevance` y `toxicity`, permitiendo validar miles de casos con alta correlación con el juicio humano."
    },
    {
      "id": "dbg-42",
      "d": 5,
      "t": "Métrica de Faithfulness (Groundedness)",
      "q": "Al ejecutar una batería de evaluación con `mlflow.evaluate()` sobre una canalización RAG, el reporte arroja una puntuación deficiente en la métrica de `Faithfulness` (Fidelidad o Groundedness). ¿Qué falla específica en el comportamiento del sistema refleja esta métrica?",
      "o": [
        "Indica que el usuario formuló preguntas con faltas de ortografía o en un idioma no reconocido por el sistema de autenticación del portal de usuarios.",
        "Indica que la respuesta contiene afirmaciones factuales no respaldadas por los fragmentos de contexto recuperados (alucinaciones del modelo).",
        "Indica que la conexión de red entre el endpoint de serving y el metastore de Unity Catalog tardó más de 500 ms en completarse con éxito.",
        "Indica que el tamaño del archivo binario del modelo registrado en MLflow excede el espacio en disco asignado al workspace corporativo del cliente."
      ],
      "a": 1,
      "e": "La métrica `Faithfulness` mide en qué grado las afirmaciones presentes en la respuesta generada se derivan directamente de la información contenida en el contexto recuperado. Una puntuación baja de fidelidad es el indicador directo de que el modelo está alucinando información no fundamentada en los documentos aportados."
    },
    {
      "id": "dbg-43",
      "d": 5,
      "t": "Métrica de Answer Relevance",
      "q": "Durante la evaluación de un agente conversacional con `mlflow.evaluate()`, se observa el siguiente comportamiento: para la pregunta '¿Cómo restablezco mi contraseña?', el modelo responde con un texto impecable de tres páginas explicando detalladamente la historia del cifrado RSA y la biografía de Alan Turing. ¿Qué combinación de métricas reflejará este problema?",
      "o": [
        "`Faithfulness` muy baja y `Answer Relevance` muy alta, porque el texto inventa la biografía de Alan Turing sin consultar el contexto documental provisto.",
        "Ambas métricas arrojarán un valor perfecto de 1.0 porque el texto generado es gramaticalmente elegante y carece de errores sintácticos en su redacción.",
        "`Faithfulness` alta (si la historia estaba en el contexto), pero `Answer Relevance` muy baja al omitir por completo la respuesta a la duda concreta formulada.",
        "`Context Recall` perfecto y `Faithfulness` nula porque el usuario no ingresó un token de sesión válido en la cabecera HTTP de la petición web enviada."
      ],
      "a": 2,
      "e": "`Answer Relevance` evalúa si la respuesta generada atiende de manera directa y pertinente a la intención de la pregunta planteada por el usuario. Si el modelo proporciona información perfectamente verídica y fundamentada en los documentos (alta `Faithfulness`), pero que no responde en absoluto a la duda del usuario (cómo cambiar la contraseña), `Answer Relevance` se desploma."
    },
    {
      "id": "dbg-44",
      "d": 5,
      "t": "Context Precision vs Context Recall",
      "q": "Un ingeniero evalúa exclusivamente el componente de recuperación (retriever) de un sistema RAG utilizando `mlflow.evaluate()`. ¿Cuál es la distinción técnica fundamental entre las métricas `Context Precision` y `Context Recall`?",
      "o": [
        "`Context Precision` mide el número total de palabras recuperadas; `Context Recall` mide el tiempo en milisegundos del endpoint de Vector Search en responder.",
        "`Context Precision` se calcula únicamente para modelos de visión artificial; `Context Recall` se aplica exclusivamente a señales de audio de alta frecuencia.",
        "Ambas métricas son matemáticamente idénticas y el nombre depende de si el workspace de Databricks está configurado en inglés o en español en la consola.",
        "`Context Precision` evalúa si los fragmentos útiles están ordenados arriba; `Context Recall` mide si se recuperó toda la información requerida."
      ],
      "a": 3,
      "e": "En la evaluación del retriever: `Context Precision` evalúa la calidad del ranking, penalizando que fragmentos irrelevantes aparezcan en las primeras posiciones antes que los fragmentos útiles. `Context Recall` evalúa la exhaustividad, midiendo si el conjunto total de fragmentos recuperados contiene todos los hechos necesarios (comparados contra una respuesta de referencia o ground truth) para responder la consulta."
    },
    {
      "id": "dbg-45",
      "d": 5,
      "t": "Mosaic AI Agent Review App",
      "q": "En el marco de la gobernanza de aplicaciones GenAI en Databricks, se despliega la `Mosaic AI Agent Evaluation Review App`. ¿Cuáles DOS capacidades fundamentales aporta esta aplicación para la validación y curación del comportamiento del modelo por parte de expertos de negocio? (Elige 2 respuestas)",
      "o": [
        "Ofrecer una interfaz gráfica interactiva para que revisores humanos prueben el agente, califiquen respuestas (thumbs up/down) y editen correcciones.",
        "Almacenar sistemáticamente el feedback y las correcciones de los revisores en tablas Delta de Unity Catalog para enriquecer datasets de referencia.",
        "Modificar en caliente los pesos binarios de las capas de atención del modelo en la memoria GPU de los nodos de inferencia.",
        "Desconectar automáticamente de la red corporativa a los revisores que emitan calificaciones desfavorables sobre las respuestas del agente."
      ],
      "a": [
        0,
        1
      ],
      "e": "La `Review App` de Mosaic AI Agent Evaluation proporciona una interfaz web intuitiva para que expertos humanos (médicos, peritos, analistas) interactúen con la cadena RAG o agente, califiquen la calidad de las respuestas y aporten correcciones textuales. Todo este feedback se registra automáticamente en tablas Delta gestionadas en Unity Catalog, facilitando la construcción de golden datasets para evaluación continua."
    },
    {
      "id": "dbg-46",
      "d": 5,
      "t": "MLflow Tracing para Observabilidad",
      "q": "Un equipo de ingeniería investiga una degradación intermitente de latencia en una cadena RAG compuesta que invoca un retriever vectorial y una API externa de validación de crédito. Al instrumentar la aplicación con `MLflow Tracing` (`mlflow.trace`), ¿qué información visual y diagnóstica obtienen en la UI de MLflow?",
      "o": [
        "Un árbol jerárquico de spans que desglosa la latencia, entradas, salidas, prompts y consumo de tokens de cada paso de la cadena.",
        "El volcado hexadecimal de los registros de la memoria caché de nivel 1 de los procesadores del servidor de base de datos relacional central.",
        "Una lista con los números de teléfono personales y claves de acceso de los usuarios que consultaron el sistema durante la última semana de pruebas.",
        "Un diagrama estático que oculta los tiempos de respuesta y reemplaza las trazas de ejecución por números aleatorios sin utilidad analítica."
      ],
      "a": 0,
      "e": "`MLflow Tracing` (basado en estándares de OpenTelemetry) captura una traza jerárquica de la ejecución del modelo o agente. En la interfaz de MLflow se visualiza un gráfico en cascada (waterfall) de spans donde se puede examinar el tiempo exacto consumido por la búsqueda en Vector Search, el formateo del prompt, las llamadas intermedias a herramientas y la llamada final al LLM con su desglose de tokens de entrada y salida."
    },
    {
      "id": "dbg-47",
      "d": 5,
      "t": "Inference Tables en Model Serving",
      "q": "Para satisfacer las exigencias de auditoría regulatoria de IA y monitoreo de deriva en producción, un arquitecto activa las `Inference Tables` en un endpoint de `Mosaic AI Model Serving`. ¿Cómo opera este mecanismo y dónde se persisten los datos capturados?",
      "o": [
        "Envía copias de seguridad de las peticiones en archivos CSV comprimidos a una cuenta de correo electrónico externa mediante protocolo SMTP tradicional.",
        "Registra de forma asíncrona las solicitudes entrantes, respuestas generadas, latencias y metadatos en una tabla Delta gestionada en Unity Catalog.",
        "Sobrescribe el contenido de la tabla de inferencias cada 60 segundos borrando el historial previo para no consumir espacio en disco en la cuenta cloud.",
        "Bloquea la ejecución del endpoint hasta que un administrador revise y apruebe manualmente cada petición entrante en una consola de comandos local."
      ],
      "a": 1,
      "e": "Las `Inference Tables` capturan de manera totalmente transparente, asíncrona y sin penalizar la latencia del endpoint, cada payload de petición recibido, la respuesta generada por el modelo, los códigos de estado, latencias y metadatos asociados. Esta información se persiste directamente en una tabla Delta en Unity Catalog, habilitando auditorías, monitoreo con Lakehouse Monitoring y reentrenamientos."
    },
    {
      "id": "dbg-48",
      "d": 5,
      "t": "Linaje End-to-End en Unity Catalog",
      "q": "Durante una auditoría externa de cumplimiento del RGPD, se exige demostrar qué datos exactos de entrenamiento o indexación se utilizaron para generar una respuesta controvertida producida por un asistente conversacional. ¿Cómo permite `Unity Catalog` verificar esta trazabilidad?",
      "o": [
        "Obligando a los científicos de datos a imprimir en papel el historial de comandos de Git y presentarlo ante un notario público para certificación oficial.",
        "El linaje de Unity Catalog sólo admite tablas relacionales tradicionales y carece de soporte para modelos de lenguaje o índices vectoriales de IA.",
        "Conectando el linaje entre tablas Delta fuente, índices de Vector Search, modelos registrados en MLflow e Inference Tables del endpoint.",
        "Eliminando de forma irreversible todos los registros del workspace para que los auditores no encuentren discrepancias de información en los sistemas."
      ],
      "a": 2,
      "e": "`Unity Catalog` ofrece linaje de datos de extremo a extremo (End-to-End Lineage). Permite rastrear visual y programáticamente la relación de dependencia completa: desde las tablas Delta de origen donde residían los documentos, pasando por el pipeline de sincronización del `Delta Sync Index`, el artefacto del modelo registrado en el catálogo de modelos, hasta el endpoint de serving y sus `Inference Tables` asociadas."
    },
    {
      "id": "dbg-49",
      "d": 5,
      "t": "Métricas Personalizadas con make_genai_metric",
      "q": "Una compañía de telecomunicaciones desea evaluar si las respuestas de su asistente virtual cumplen con la directiva corporativa de 'mantener un tono profesional, empático y evitar tecnicismos incomprensibles para el usuario final'. ¿Cómo se define esta métrica cualitativa en `mlflow.evaluate()`?",
      "o": [
        "Escribiendo un script en Bash que cuente cuántas veces aparece la palabra 'gracias' en la salida de texto generada por el endpoint del asistente.",
        "Modificando la memoria BIOS de los servidores de la nube para alterar el comportamiento probabilístico de los números aleatorios generados en runtime.",
        "Configurando un cortafuegos que bloquee cualquier paquete HTTP de respuesta que contenga más de 50 palabras en total en la respuesta entregada.",
        "Utilizando `mlflow.metrics.genai.make_genai_metric()`, especificando nombre, criterios de evaluación, escala y ejemplos para el LLM juez."
      ],
      "a": 3,
      "e": "`mlflow.metrics.genai.make_genai_metric()` permite crear métricas personalizadas evaluadas por un LLM juez. El desarrollador define el nombre de la métrica, la rúbrica con los criterios detallados de evaluación (ej. empatía, profesionalismo, ausencia de jerga excesiva), la escala de puntuación (ej. 1 a 5) y ejemplos de calibración con pocas muestras (few-shot), permitiendo evaluar aspectos cualitativos de forma consistente."
    },
    {
      "id": "dbg-50",
      "d": 5,
      "t": "Lakehouse Monitoring sobre Inference Tables",
      "q": "Un equipo de operaciones de IA mantiene un asistente RAG en producción y desea supervisar continuamente la deriva de conceptos (concept drift), variaciones en la longitud de las respuestas y anomalías en las tasas de error a lo largo de las semanas sin programar pipelines ETL manuales. ¿Qué solución nativa de Databricks se integra con las `Inference Tables` para este fin?",
      "o": [
        "Un script en lenguaje AWK ejecutándose en un bucle continuo en la terminal de la laptop personal de uno de los ingenieros del equipo de operaciones.",
        "Desactivar por completo las tablas de inferencias para evitar el consumo de espacio de almacenamiento en el catálogo corporativo de Unity Catalog.",
        "Instalar un servidor Apache Tomcat independiente que reciba capturas de pantalla de los teléfonos móviles de los clientes que utilizan la aplicación.",
        "`Databricks Lakehouse Monitoring`, configurando un monitor de calidad sobre la tabla Delta de inferencias para generar métricas y alertas."
      ],
      "a": 3,
      "e": "`Databricks Lakehouse Monitoring` se integra de forma directa con las `Inference Tables` de Model Serving. Al asociar un monitor a la tabla Delta de inferencias, Databricks calcula automáticamente estadísticas agregadas temporales, métricas de deriva en entradas y salidas, variaciones en latencias y tasas de error, publicando tableros de control y disparando alertas ante anomalías sin requerir código ETL manual."
    }
  ],
  "why": {
    "dbg-01": [
      null,
      "`Fine-Tuning` ajusta el estilo, tono o sintaxis del modelo pero no garantiza exactitud factual ante datos dinámicos, introduce alucinaciones y no proporciona citas textuales directas auditables.",
      "`Continued Pre-training` es extremadamente costoso computacionalmente, requiere semanas de cálculo en clústeres GPU y congela los datos en los pesos, resultando inviable para normativas que cambian quincenalmente.",
      "`Prompt Engineering` simple es inviable porque un manual de 60.000 páginas desborda con creces la ventana de contexto de los modelos actuales y generaría un coste por token y una latencia inasumibles."
    ],
    "dbg-02": [
      "Usar un LLM gigante de 70B para clasificación simple sobre 12 clases genera una latencia sustancialmente superior a 60 ms y un coste financiero desproporcionado ante 2 millones de peticiones diarias.",
      null,
      "RAG multi-etapa añade latencia de búsqueda vectorial (~20-40 ms) e inferencia generativa (~200-500 ms), incumpliendo holgadamente el SLA de 60 ms y encareciendo la solución.",
      "Un agente multi-paso con llamadas recursivas añade múltiples viajes de red sobre la API, elevando la latencia por encima de varios segundos por solicitud de clasificación."
    ],
    "dbg-03": [
      "Una mayor dimensión vectorial no implica mejor rendimiento semántico si el modelo no fue entrenado con datos multilingües, e incrementa innecesariamente el consumo de memoria y la latencia del índice.",
      "Los LLMs autorregresivos generativos no están entrenados para producir representaciones de similitud densa comparativa como los encoders dedicados (e.g. BGE), y su inferencia es lenta y costosa.",
      null,
      "La traducción automática en tiempo de ejecución añade latencia adicional considerable, introduce posibles errores de traducción léxica y eleva los costes operativos de la solución."
    ],
    "dbg-04": [
      "Para un corpus minúsculo de 10.000 tokens con consultas muy esporádicas, cargar el texto completo directamente en el prompt es más simple y no justifica la infraestructura de Vector Search.",
      "El análisis estilístico holístico de dos novelas completas requiere procesar el texto entero de forma global, caso de uso idóneo para ventanas de contexto largas y no para RAG por fragmentos.",
      "La ausencia de almacenamiento y conectividad imposibilita el uso de arquitecturas basadas en la nube y no representa un escenario favorable para Vector Search en Databricks.",
      null
    ],
    "dbg-05": [
      null,
      null,
      "Desactivar las `Inference Tables` destruye la trazabilidad y la observabilidad del sistema, impidiendo auditorías de seguridad y monitoreo forense de incidentes.",
      "Aumentar la temperatura a 1.0 no protege contra prompt injection y provoca que el modelo sea mucho más propenso a alucinaciones e inconsistencias operativas."
    ],
    "dbg-06": [
      null,
      "`Pay-per-token` (Foundation Model APIs) sí ofrece soporte para modelos grandes como Llama-3-70B y DBRX; su limitación en alto tráfico reside en los costes por token y límites de tasa compartidos.",
      "`Provisioned Throughput` se gobierna estrictamente bajo `Unity Catalog` al igual que el resto de componentes de Model Serving; no elude la seguridad empresarial.",
      "Ningún modo de serving reentrena los pesos del modelo durante la inferencia; el servicio es estrictamente de evaluación y generación de respuestas en tiempo real."
    ],
    "dbg-07": [
      "Enviar datos a un proveedor SaaS externo multitenant en otra región vulnera frontalmente los requerimientos de residencia de datos y normativas sanitarias estrictas.",
      null,
      "Cifrar en Base64 no es un mecanismo de anonimización ni seguridad; el texto puede ser decodificado inmediatamente y sigue transitando hacia servicios externos no autorizados.",
      "Publicar datos de salud en buckets abiertos sin control de acceso en Unity Catalog constituye una brecha de seguridad grave y violación legal de normativas como HIPAA o RGPD."
    ],
    "dbg-08": [
      "Un `CharacterTextSplitter` rígido sin considerar la sintaxis agrava el problema al cortar arbitrariamente tablas y oraciones en puntos ciegos a los 256 caracteres.",
      "Eliminar los saltos de línea y la estructura de Markdown destruye la coherencia de las tablas y títulos técnicos, dificultando la comprensión semántica del modelo.",
      null,
      "Un chunk de 120.000 palabras desborda la capacidad de la mayoría de modelos de embeddings (típicamente 512 u 8192 tokens) y destruye la granularidad del retrieval semántico."
    ],
    "dbg-09": [
      "Un tamaño de 32 tokens es excesivamente diminuto, destruye la sintaxis de las cláusulas contractuales e impide que el modelo extraiga contexto jurídico coherente.",
      "Eliminar fragmentos alternos provoca la pérdida catastrófica del 50 % de la información documental disponible en el sistema.",
      "Ampliar el chunk a 80.000 tokens supera el límite de contexto de la inmensa mayoría de modelos de embeddings, provocando truncamiento forzado y pérdida de datos.",
      null
    ],
    "dbg-10": [
      null,
      "Una consulta `LIKE '%query%'` realiza un escaneo de texto estricto sin comprensión semántica, omitiendo sinónimos y sin capacidad de clasificar por relevancia contextual.",
      "Ejecutar un bi-encoder idéntico produce exactamente las mismas puntuaciones y no añade nueva capacidad discriminatoria ni atención cruzada.",
      "Invertir el orden sitúa los fragmentos menos relevantes en las posiciones preferentes del prompt, deteriorando gravemente la calidad de la respuesta del LLM."
    ],
    "dbg-11": [
      "Concatenar en SQL sin sanitizar expone a inyección SQL y una búsqueda literal fracasará al no compartir las palabras exactas ('matrimonio' vs 'nupcias').",
      null,
      "Eliminar vocales corrompe la semántica del lenguaje y destruye la capacidad del modelo de embeddings para mapear el significado del texto.",
      "Descartar la consulta original e imponer una etiqueta estática impide buscar la especificidad de la pregunta del empleado en la base documental."
    ],
    "dbg-12": [
      null,
      null,
      "Exportar archivos `.pkl` en `/tmp` no registra el modelo en Unity Catalog ni gestiona dependencias, haciendo imposible su despliegue reproducible en Model Serving.",
      "Incrustar tokens de acceso en el código fuente vulnera las políticas básicas de seguridad y expone credenciales; debe usarse la identidad gestionada del endpoint o Databricks Secrets."
    ],
    "dbg-13": [
      "Enviar binarios ejecutables en el prompt es imposible en la API de los LLMs y representaría una vulnerabilidad de ejecución remota de código aberrante.",
      "Permitir la generación y ejecución no controlada de SQL destructivo por parte de un LLM viola todos los principios de seguridad y pondría en riesgo la base de datos.",
      null,
      "Forzar texto libre sin estructuración impide que el sistema interprete de manera determinista cuándo invocar las herramientas y con qué parámetros exactos."
    ],
    "dbg-14": [
      "Duplicar fragmentos centrales desperdicia presupuesto de tokens, incrementa costes de inferencia y puede inducir alucinaciones o redundancias en la respuesta.",
      "Eliminar el 90 % de los fragmentos priva al modelo de la información necesaria para responder consultas complejas que requieren múltiples fuentes.",
      "Modificar los pesos de atención posicional no es una práctica viable para usuarios de Foundation Model APIs ni resuelve el sesgo inherente de la arquitectura Transformer.",
      null
    ],
    "dbg-15": [
      null,
      "`Direct Vector Access Index` requiere que la aplicación cliente gestione la ingesta, eliminación y cálculo de vectores mediante llamadas explícitas a la API REST, perdiendo la automatización con Delta Lake.",
      "Elasticsearch fuera de Unity Catalog pierde la integración nativa con el catálogo, los controles de acceso y el linaje de datos de Databricks.",
      "Un escaneo distribuido completo en Spark para cada consulta interactiva tarda minutos o decenas de segundos, siendo totalmente inviable para aplicaciones conversacionales en tiempo real."
    ],
    "dbg-16": [
      "Es en `Managed Embeddings` donde Databricks gestiona la infraestructura de vectorización; en `Self-managed` es el usuario quien controla y calcula los embeddings.",
      null,
      "`Managed Embeddings` opera exclusivamente sobre tablas Delta en Unity Catalog, no sobre archivos CSV planos desprovistos de Change Data Feed.",
      "`Self-managed Embeddings` sí realiza búsquedas vectoriales por similitud; la diferencia radica únicamente en quién realiza el cálculo del vector."
    ],
    "dbg-17": [
      "Delta Sync Index soporta millones de registros y cientos de gigabytes; no existe una restricción de tamaño inferior a 10 MB ni obligación de particionar por hora.",
      "Delta Sync Index requiere Unity Catalog; no funciona con el metastore heredado de Hive ni admite tablas con ACID deshabilitado.",
      null,
      "La tabla debe contener campos de texto para poder vectorizarlos (en Managed) o columnas vectoriales junto con metadatos; no puede ser sólo numérica."
    ],
    "dbg-18": [
      "El modo `Triggered` se programa típicamente en intervalos (ej. cada hora o día) para minimizar costes en cargas batch, no satisfaciendo el SLA de 60 segundos.",
      "Un proceso manual es inviable para flujos algorítmicos automatizados y no existe como modo formal de producción para SLAs de segundos.",
      "El modo `Read-Only` bloquearía la inserción de nuevas noticias, invalidando el propósito funcional del sistema financiero.",
      null
    ],
    "dbg-19": [
      null,
      "Reducir los embeddings a 4 dimensiones destruye la capacidad representativa del espacio vectorial y genera colisiones masivas entre conceptos dispares.",
      "Eliminar los números de pieza priva al sistema de la información crítica de identificación de repuestos que los técnicos necesitan imperiosamente.",
      "KNN exacto con producto punto en CPU no resuelve la discrepancia de representación de códigos alfanuméricos en embeddings continuos y es extremadamente lento."
    ],
    "dbg-20": [
      "Recuperar 100.000 resultados en el cliente genera una enorme sobrecarga de red, satura la memoria del servidor de aplicaciones y penaliza la latencia.",
      null,
      "Crear un clúster Spark y reindexar para cada búsqueda individual tardaría decenas de minutos y generaría un coste económico demencial.",
      "Añadir texto al prompt no garantiza que el retriever excluya documentos de otros países o años; es una técnica frágil e ineficaz para filtros estrictos."
    ],
    "dbg-21": [
      "Vector Search admite decenas de millones de vectores en entornos de producción empresariales; no existe un límite rígido de 50.000 vectores.",
      "El almacenamiento e indexación vectorial HNSW se ejecutan en infraestructura gestionada serverless de Databricks, no en el navegador del cliente.",
      null,
      "El escalado de endpoints de Vector Search se realiza en caliente sin necesidad de reiniciar Unity Catalog ni programar ventanas de mantenimiento que interrumpan el servicio."
    ],
    "dbg-22": [
      "`ACCOUNT ADMIN` vulnera el principio de privilegio mínimo al conceder control sobre usuarios, facturación y gobernanza global innecesariamente.",
      "`MODIFY` y `CREATE TABLE` otorgan permisos de modificación y creación destructiva de datos, innecesarios y peligrosos para una aplicación que sólo lee.",
      "Desactivar Unity Catalog elimina la seguridad de la empresa, expone datos sensibles y no es una práctica admitida ni recomendada en Databricks.",
      null
    ],
    "dbg-23": [
      null,
      null,
      "Recrear el endpoint completo ante cada borrado provocaría caídas de servicio inaceptables y tiempos de espera de decenas de minutos innecesarios.",
      "Ejecutar `VACUUM` prematuramente antes de que el pipeline procese el CDF podría purgar archivos de datos requeridos por la sincronización, causando inconsistencias."
    ],
    "dbg-24": [
      null,
      "El producto punto opera de forma nativa sobre números en coma flotante (`float32`, `float64`); no está restringido a enteros de 8 bits.",
      "La similitud coseno acota los valores reales entre -1 y 1; no produce números complejos imaginarios en ningún cálculo vectorial.",
      "El producto punto es máximo para vectores paralelos en la misma dirección y cero para vectores ortogonales; no exige ortogonalidad previa."
    ],
    "dbg-25": [
      "Borrar la tabla destruye la información corporativa y el formato TSV no cuenta con transacciones, CDF ni optimización para Vector Search.",
      null,
      "Desactivar ACID corrompe la fiabilidad de los datos y desactiva las capacidades de Delta Lake requeridas por Vector Search.",
      "Tener 200 millones de archivos minúsculos provoca el clásico problema de 'small files', saturando el metastore y ralentizando drásticamente la I/O."
    ],
    "dbg-26": [
      "El endpoint de embeddings procesa texto legible, no objetos binarios serializados con Pickle, los cuales representan además un grave riesgo de seguridad.",
      "Una matriz de hashes criptográficos SHA-512 no tiene significado semántico para un modelo de lenguaje de embeddings.",
      null,
      "El nombre de la columna es completamente configurable por el usuario durante la creación del índice; no existe ninguna restricción de nomenclatura fija."
    ],
    "dbg-27": [
      "No es necesario ni admisible borrar el metastore de Unity Catalog; la definición del índice vectorial puede modificarse o sincronizarse ordenadamente.",
      "Añadir columnas a una tabla Delta es una operación estándar de evolución de esquema que no bloquea la tabla ni corrompe el almacenamiento.",
      "No se requiere migrar a soluciones NoSQL externas; Vector Search soporta nativamente metadatos y filtros avanzados dentro del Lakehouse.",
      null
    ],
    "dbg-28": [
      null,
      "El endpoint no se reinicia ni se apaga ante consultas con filtros no indexados; la degradación es puramente de I/O por post-filtrado diferido.",
      "HTTP/2 y JSON manejan cadenas de texto de cualquier longitud habitual sin ninguna limitación arbitraria a 8 caracteres.",
      "Las consultas se ejecutan de manera automatizada en el motor de Vector Search; no interviene ningún proceso de correo ni resolución manual."
    ],
    "dbg-29": [
      "No existe un límite de 1.000 registros en Vector Search de Databricks; el error documenta explícitamente una falla en el endpoint de serving de embeddings.",
      null,
      "Las sincronizaciones se ejecutan en clústeres serverless desacoplados de la sesión web del usuario; cerrar el navegador no detiene el pipeline.",
      "Databricks opera sobre Spark SQL y Delta Lake; no utiliza Transact-SQL ni bases de datos locales para la sincronización vectorial."
    ],
    "dbg-30": [
      "Model Serving está ampliamente optimizado para GenAI, soportando LLMs de última generación, modelos multimodales, agentes y APIs externas.",
      "No se requiere compilar en C++ ni gestionar Kubernetes; Model Serving es un servicio totalmente administrado serverless en Databricks.",
      null,
      "Model Serving provee endpoints de inferencia REST en tiempo real y streaming de baja latencia; no está restringido a ejecuciones batch en SQL."
    ],
    "dbg-31": [
      "Reducir el timeout a 5 ms provocaría que prácticamente el 100 % de las peticiones fallen sin llegar a completarse, destruyendo la usabilidad.",
      "Un notebook interactivo no es un entorno de producción, carece de autoscaling, no ofrece SLAs de serving y no soporta 500 peticiones por segundo.",
      "Reintentos infinitos sin backoff generan una tormenta de peticiones (retry storm) que empeora la saturación del sistema y agrava los errores 429.",
      null
    ],
    "dbg-32": [
      null,
      "Incrustar claves de API en celdas de notebooks expone las credenciales a fugas de seguridad accidentales, control de versiones y accesos no autorizados.",
      "Subir claves a DBFS con lectura pública constituye una vulnerabilidad crítica que permite a cualquier usuario del workspace sustraer las credenciales.",
      "Pasar la clave en el prompt expone la credencial en logs de inferencia, interfaces de chat y vectores, violando cualquier estándar de seguridad."
    ],
    "dbg-33": [
      "AI Gateway gestiona el tráfico de inferencia y gobernanza de modelos de IA; no es un transpilador ni compilador de lenguajes de programación.",
      null,
      "AI Gateway se apoya e integra profundamente con Unity Catalog para la seguridad y auditoría; no lo reemplaza ni elimina sus controles de acceso.",
      "No desconecta el acceso a internet ni utiliza cintas magnéticas; es un servicio en la nube de alta disponibilidad y baja latencia."
    ],
    "dbg-34": [
      "La compresión gzip reduce el consumo de ancho de banda en la red pero no analiza el contenido semántico ni anonimiza datos personales.",
      "Reglas de iptables filtran paquetes a nivel de capa de red IP/TCP; son totalmente ciegas a la información PII contenida en payloads de lenguaje natural.",
      null,
      "Depender de promesas de usuarios es una medida puramente administrativa que no ofrece ninguna garantía técnica ni cumple con normativas de protección de datos."
    ],
    "dbg-35": [
      null,
      null,
      "La longitud de los scripts en repositorios Git no tiene relación con el tráfico de inferencia en tiempo real ni con los límites de tasa de los endpoints.",
      "La temperatura es un hiperparámetro de muestreo probabilístico del modelo, no un mecanismo de límite de tasa para control de consumo de recursos."
    ],
    "dbg-36": [
      "Replicar servidores de aplicación no soluciona el problema de fondo si la API externa subyacente a la que todos consultan está caída.",
      "Detener el balanceador bloquea por completo la aplicación médica, provocando la denegación total de servicio en un entorno de emergencias.",
      "Depender de alertas humanas para editar código introduce minutos o cuartos de hora de retraso inaceptables para un sistema de triaje médico.",
      null
    ],
    "dbg-37": [
      null,
      "Agrupar peticiones en batch incrementa la latencia individual de cada usuario al tener que esperar a que se acumulen 64 consultas para iniciar el procesamiento.",
      "Ejecutar inferencia de LLMs en un único hilo de CPU ralentizaría la velocidad de generación de tokens de forma dramática, empeorando el problema.",
      "Comprimir la respuesta en un archivo RAR requeriría esperar a que la generación termine por completo para luego comprimir y descomprimir, añadiendo más retraso."
    ],
    "dbg-38": [
      "Instalar librerías en la máquina local no afecta en absoluto a los contenedores serverless que se ejecutan en la nube de Databricks.",
      null,
      "Los contenedores de Model Serving son serverless y gestionados; no ofrecen acceso SSH interactivo ni privilegios de superusuario root para el usuario.",
      "Reescribir frameworks de IA en ensamblador es inviable y absurdo; las librerías estándar se integran limpiamente mediante la gestión de entornos de MLflow."
    ],
    "dbg-39": [
      "Mantener 4 instancias fijas para 12 modelos escasamente consultados generaría un gasto económico exorbitante por recursos totalmente ociosos.",
      "Reentrenar modelos desde cero es extremadamente costoso en tiempo y cómputo GPU; los artefactos ya entrenados deben conservarse en Unity Catalog.",
      null,
      "Desconectar la red del workspace interrumpiría otros procesos ETL y de producción críticos no relacionados con los modelos de I+D."
    ],
    "dbg-40": [
      "Depender de la disciplina manual de los usuarios no es un mecanismo técnico de control de tráfico y no funciona para llamadas de aplicaciones o APIs.",
      "Reiniciar servidores degrada el servicio, genera errores de conexión en los clientes y no reparte el tráfico de forma probabilística controlada.",
      "Apagar el servicio interrumpe la disponibilidad corporativa e impacta negativamente a los usuarios en lugar de realizar una transición progresiva.",
      null
    ],
    "dbg-41": [
      null,
      "Contar caracteres o consonantes no evalúa en absoluto el significado, la veracidad factual ni la relevancia de una respuesta ante una pregunta.",
      "Asumir que no hay errores ignora el fenómeno de las alucinaciones, la pérdida de relevancia y los errores de comprensión inherentes a los LLMs.",
      "La temperatura física del hardware no refleja la calidad lingüística ni la corrección de las salidas producidas por el modelo."
    ],
    "dbg-42": [
      "La métrica evalúa la relación entre la respuesta generada y los documentos de contexto; no juzga la ortografía de la consulta del usuario.",
      null,
      "Las latencias de red se miden en milisegundos mediante tracing o monitoreo de red, no a través de la métrica semántica de fidelidad.",
      "El tamaño de archivo de los pesos es una propiedad de almacenamiento estático que nada tiene que ver con la fidelidad semántica de la respuesta."
    ],
    "dbg-43": [
      "La fidelidad puede ser alta si la historia de RSA estaba presente en los fragmentos de contexto; el fallo principal y evidente es la falta de relevancia.",
      "La elegancia sintáctica no compensa la falta de pertinencia; Answer Relevance penaliza severamente desviar el tema de la consulta.",
      null,
      "Context Recall evalúa si el retriever recuperó toda la información necesaria; la validez de los tokens de sesión no afecta al cálculo de métricas de MLflow."
    ],
    "dbg-44": [
      "Precision y Recall no miden recuentos brutos de palabras ni latencias en milisegundos; son métricas formales de relevancia de recuperación.",
      "Estas métricas son estándares en evaluación de sistemas de recuperación de información (IR) y RAG en lenguaje natural, no exclusivas de visión o audio.",
      "Son conceptos claramente diferenciados en la literatura de IR y en MLflow; no son sinónimos ni dependen de la configuración de idioma del workspace.",
      null
    ],
    "dbg-45": [
      null,
      null,
      "La Review App captura feedback humano sobre la aplicación; no realiza operaciones destructivas ni altera los pesos de la red neuronal en caliente.",
      "Bloquear o penalizar a los evaluadores que reportan fallos destruiría el proceso de mejora continua y es una afirmación descabellada."
    ],
    "dbg-46": [
      null,
      "MLflow Tracing opera a nivel de lógica de aplicación y llamadas de software; no interactúa con registros de bajo nivel de memoria caché de hardware L1.",
      "Tracing registra los payloads de inferencia para observabilidad; no sustrae datos privados ni números de teléfono de los dispositivos de los usuarios.",
      "El propósito de Tracing es precisamente transparentar la ejecución temporal y diagnóstica exacta, no ocultar la información con números aleatorios."
    ],
    "dbg-47": [
      "Inference Tables no utiliza correo electrónico ni protocolos SMTP externos; persiste los datos de forma nativa y segura en tablas Delta del Lakehouse.",
      null,
      "Las tablas Delta conservan el historial transaccional completo para auditoría y análisis temporal; no se sobrescriben ni borran cada 60 segundos.",
      "El registro es estrictamente asíncrono y no bloquea el flujo de inferencia en tiempo real; no requiere aprobaciones humanas por petición."
    ],
    "dbg-48": [
      "Imprimir código en papel no es un mecanismo de auditoría técnica en la nube y no demuestra el linaje real de los datos consumidos en producción.",
      "Unity Catalog extiende su motor de linaje de forma nativa a modelos de MLflow, volúmenes, índices de Vector Search y endpoints de serving.",
      null,
      "Destruir la información constituiría una obstrucción a la auditoría, una violación legal grave y la pérdida de datos corporativos críticos."
    ],
    "dbg-49": [
      "Contar la palabra 'gracias' es una heurística extremadamente simplista que no evalúa la empatía genuina, la claridad ni el tono profesional del mensaje.",
      "Modificar la BIOS del hardware es imposible en entornos cloud gestionados y no tiene ningún impacto en la semántica del lenguaje natural.",
      "Bloquear paquetes por longitud de palabras impide que el asistente proporcione explicaciones completas y no evalúa la calidad cualitativa del tono.",
      null
    ],
    "dbg-50": [
      "Un script local en una máquina personal es una solución precaria, no escalable y carente de alta disponibilidad para monitoreo empresarial continuo.",
      "Desactivar las tablas de inferencias elimina toda la visibilidad operativa y hace imposible la monitorización de deriva y calidad en producción.",
      "Capturas de pantalla en un servidor Tomcat no estructuran métricas de deriva de datos ni permiten supervisión analítica de los modelos en producción.",
      null
    ]
  },
  "glossary": [
    {
      "term": "Mosaic AI Vector Search",
      "cat": "Vector Search",
      "d": 3,
      "def": "Motor de base de datos vectorial serverless en Databricks integrado con Unity Catalog que ofrece búsqueda de vecinos más cercanos (ANN) y búsqueda híbrida."
    },
    {
      "term": "Delta Sync Index",
      "cat": "Vector Search",
      "d": 3,
      "def": "Índice de Vector Search que sincroniza automáticamente vectores y metadatos desde una tabla Delta de Unity Catalog usando Change Data Feed (CDF)."
    },
    {
      "term": "Direct Vector Access Index",
      "cat": "Vector Search",
      "d": 3,
      "def": "Índice de Vector Search donde los vectores y metadatos se insertan, actualizan o eliminan directamente mediante llamadas a la API REST sin tabla Delta vinculada."
    },
    {
      "term": "Change Data Feed (CDF)",
      "cat": "Data Preparation",
      "d": 3,
      "def": "Característica de Delta Lake que registra cambios fila por fila (inserciones, actualizaciones, borrados) para procesamiento incremental por streaming o batch."
    },
    {
      "term": "Hybrid Search",
      "cat": "Vector Search",
      "d": 3,
      "def": "Técnica de búsqueda que combina similitud vectorial densa (semántica) con búsqueda léxica dispersa (BM25 / full-text) usando Reciprocal Rank Fusion."
    },
    {
      "term": "Mosaic AI Model Serving",
      "cat": "Model Serving",
      "d": 4,
      "def": "Plataforma serverless de baja latencia para desplegar LLMs fundacionales, modelos MLflow personalizados y APIs de modelos externos con escalado automático."
    },
    {
      "term": "AI Gateway",
      "cat": "Governance & Serving",
      "d": 4,
      "def": "Capa de gestión centralizada en Model Serving que proporciona guardrails de seguridad, límites de tasa, enrutamiento con fallback y seguimiento de costes."
    },
    {
      "term": "Provisioned Throughput",
      "cat": "Model Serving",
      "d": 4,
      "def": "Modo de despliegue en Model Serving con capacidad de cómputo reservada (Model Units) que garantiza latencia determinista y concurrencia sin límites de tasa."
    },
    {
      "term": "Pay-per-token",
      "cat": "Model Serving",
      "d": 4,
      "def": "Modalidad de consumo en Foundation Model APIs donde se factura exclusivamente por el volumen de tokens de entrada y tokens de salida procesados."
    },
    {
      "term": "External Models",
      "cat": "Model Serving",
      "d": 4,
      "def": "Funcionalidad de Model Serving que permite exponer y gobernar modelos de proveedores externos (OpenAI, Anthropic, Cohere) a través de una API unificada."
    },
    {
      "term": "Guardrails (AI Gateway)",
      "cat": "Security & Guardrails",
      "d": 4,
      "def": "Filtros configurables en AI Gateway para detección y redacción automática de PII (información sensible), análisis de toxicidad y prevención de jailbreaks."
    },
    {
      "term": "Rate Limiting",
      "cat": "Model Serving",
      "d": 4,
      "def": "Políticas en AI Gateway que restringen el número de peticiones por minuto (RPM) o tokens por minuto (TPM) por usuario, equipo o clave de API."
    },
    {
      "term": "Fallback Routing",
      "cat": "Model Serving",
      "d": 4,
      "def": "Mecanismo de alta disponibilidad en AI Gateway que conmuta automáticamente a un modelo de respaldo si el endpoint principal devuelve errores 429 o 5xx."
    },
    {
      "term": "Inference Tables",
      "cat": "Governance & Auditing",
      "d": 5,
      "def": "Registro automático y asíncrono de solicitudes entrantes, respuestas del modelo y métricas en una tabla Delta de Unity Catalog para auditoría y monitoreo."
    },
    {
      "term": "mlflow.evaluate()",
      "cat": "Evaluation",
      "d": 5,
      "def": "Función de MLflow para evaluar modelos y cadenas GenAI calculando métricas clásicas, estadísticas y basadas en LLM-as-a-judge sobre datasets de evaluación."
    },
    {
      "term": "LLM-as-a-Judge",
      "cat": "Evaluation",
      "d": 5,
      "def": "Patrón donde un modelo de lenguaje de alta capacidad evalúa la calidad, relevancia y corrección de las respuestas generadas por otro modelo siguiendo rúbricas formales."
    },
    {
      "term": "Faithfulness (Groundedness)",
      "cat": "Evaluation",
      "d": 5,
      "def": "Métrica de evaluación GenAI que cuantifica si todas las afirmaciones factuales de la respuesta se fundamentan estrictamente en el contexto recuperado (anti-alucinación)."
    },
    {
      "term": "Answer Relevance",
      "cat": "Evaluation",
      "d": 5,
      "def": "Métrica de evaluación que califica si la respuesta generada responde de forma pertinente y directa a la pregunta del usuario, independientemente del contexto."
    },
    {
      "term": "Context Precision",
      "cat": "Evaluation",
      "d": 5,
      "def": "Métrica del componente de recuperación (retriever) que mide si los fragmentos de contexto más relevantes aparecen en las posiciones superiores del ranking devuelto."
    },
    {
      "term": "Context Recall",
      "cat": "Evaluation",
      "d": 5,
      "def": "Métrica del retriever que evalúa si los fragmentos recuperados contienen toda la información necesaria para responder adecuadamente a la consulta formulada."
    },
    {
      "term": "MLflow Tracing",
      "cat": "Observability",
      "d": 5,
      "def": "Herramienta de observabilidad basada en OpenTelemetry que captura spans jerárquicos, latencias, prompts y llamadas a herramientas en cadenas y agentes GenAI."
    },
    {
      "term": "Review App",
      "cat": "Evaluation",
      "d": 5,
      "def": "Aplicación interactiva de Mosaic AI Agent Evaluation que permite a expertos de negocio calificar respuestas generadas, registrar feedback y refinar datasets de prueba."
    },
    {
      "term": "Unity Catalog",
      "cat": "Governance",
      "d": 1,
      "def": "Plano unificado de gobernanza en Databricks para datos, modelos, funciones, volúmenes e índices vectoriales con control de acceso granular y linaje."
    },
    {
      "term": "Recursive Character Chunking",
      "cat": "Data Preparation",
      "d": 2,
      "def": "Algoritmo de división de texto que divide recursivamente por una lista jerárquica de delimitadores (párrafos, saltos de línea, espacios) para preservar la coherencia semántica."
    },
    {
      "term": "Cross-Encoder Re-ranking",
      "cat": "RAG & Chains",
      "d": 2,
      "def": "Modelo que evalúa conjuntamente la consulta y cada documento candidato asignando un score de relevancia preciso, utilizado como segunda fase tras el bi-encoder."
    }
  ]
};
})(window);
