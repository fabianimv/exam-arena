/* =========================================================================
   data/anthropic-associate/exam.js — Anthropic Claude Certified Associate (CCAO-F)
   55 preguntas de juicio laboral y empresarial en los 7 dominios oficiales
   Explicación por opción errónea (WHY), rúbricas, workflows y prompt chaining.
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["claude-associate"] = {
  "id": "claude-associate",
  "appId": "claude-associate",
  "provider": "Anthropic",
  "badge": "Claude · Associate (CCAO-F)",
  "icon": "✨",
  "color": "#e07a5f",
  "featured": true,
  "title": "Anthropic · Claude Certified Associate (CCAO-F)",
  "subtitle": "Evaluación de Salidas, Integración en Workflows, Gobernanza, Projects y Prompt Chaining",
  "passingScore": 72,
  "domains": {
    "1": "Evaluación y Validación de Salidas (21 %)",
    "2": "Integración en Workflows de Negocio (16 %)",
    "3": "Gobernanza e IA Responsable (16 %)",
    "4": "Prompting y Ejecución de Tareas (14 %)",
    "5": "Selección de Producto y Superficies (12 %)",
    "6": "Configuración y Troubleshooting (11 %)",
    "7": "Estructuración Avanzada y Prompt Chaining (10 %)"
  },
  "shortDomains": {
    "1": "Validación",
    "2": "Workflows",
    "3": "Gobernanza",
    "4": "Prompting",
    "5": "Claude Products",
    "6": "Troubleshooting",
    "7": "Prompt Chaining"
  },
  "topics": [
    {
      "id": "ccao-t-1",
      "d": 1,
      "title": "1.1 · Evaluación y Validación de Salidas (Rúbricas, Verificación Factual y Ground Truth)",
      "html": "<table class=\"keytable\">\n<tr><th>Dimensión de Evaluación</th><th>Criterio de Validación en el Entorno Laboral</th><th>Riesgo de Omisión</th></tr>\n<tr><td><b>Exactitud Factual (Ground Truth)</b></td><td>Cotejo estricto de cifras, fechas, normas y citas contra las fuentes primarias de la empresa (balances, contratos, políticas).</td><td>Propagación de alucinaciones elocuentes y datos erróneos en documentos ejecutivos.</td></tr>\n<tr><td><b>Rúbricas Predefinidas</b></td><td>Definición previa de criterios objetivos de aceptación (escala 1-5 o binaria) antes de inspeccionar las salidas generadas.</td><td>Sesgo de confirmación y evaluación subjetiva basada en la mera fluidez del texto.</td></tr>\n<tr><td><b>Golden Datasets</b></td><td>Conjunto fijo y representativo de casos de prueba con respuestas humanas de referencia para comparar versiones de prompts.</td><td>Pruebas ad-hoc inconsistentes que impiden medir regresiones o mejoras reales.</td></tr>\n<tr><td><b>Consistencia de Formato</b></td><td>Verificación de tablas, campos requeridos, delimitadores y estructura de presentación solicitada en el prompt.</td><td>Salidas incompatibles con flujos operativos posteriores o reportes directivos.</td></tr>\n</table>\n<p class=\"mt-2\"><b>Regla de Oro:</b> La fluidez lingüística no equivale a veracidad. Un texto bien articulado y formal puede contener alucinaciones críticas; la validación humana contra fuentes primarias (ground truth) es obligatoria antes de emitir decisiones de negocio.</p>"
    },
    {
      "id": "ccao-t-2",
      "d": 2,
      "title": "2.1 · Integración en Workflows de Negocio (Human-in-the-Loop, Handoffs y Triaje)",
      "html": "<table class=\"keytable\">\n<tr><th>Patrón Operativo</th><th>Cuándo Aplicarlo con Claude</th><th>Responsabilidad Humana</th></tr>\n<tr><td><b>Human-in-the-Loop (HITL) Obligatorio</b></td><td>Decisiones de alto impacto: denegación de crédito, diagnósticos médicos, sanciones laborales, comunicados de crisis.</td><td>Revisión sustancial y firma autorizada; la IA nunca debe ser el decisor final automatizado.</td></tr>\n<tr><td><b>Handoff Operativo (Traspaso)</b></td><td>Triaje y redacción de borradores en soporte al cliente, ventas y operaciones comerciales.</td><td>Personalizar la comunicación con datos verificados del caso antes del envío formal al cliente.</td></tr>\n<tr><td><b>Extracción y Cotejo Asistido</b></td><td>Detección de discrepancias en contratos de compras frente a plantillas estándar de la organización.</td><td>Validación jurídica de las cláusulas observadas antes de proceder a la firma.</td></tr>\n<tr><td><b>Protocolos de Doble Firma</b></td><td>Propuestas comerciales y presupuestos de alto valor elaborados con asistencia de IA.</td><td>Certificación formal de que cada precio, margen y plazo ha sido verificado contra tarifas vigentes.</td></tr>\n</table>\n<p class=\"mt-2\"><b>Principio de Responsabilidad:</b> La IA acelera la síntesis y elaboración de borradores, pero la responsabilidad civil, legal y comercial ante terceros recae siempre en los profesionales de la organización.</p>"
    },
    {
      "id": "ccao-t-3",
      "d": 3,
      "title": "3.1 · Gobernanza e IA Responsable (AUP de Anthropic, Privacidad y Redacción de PII)",
      "html": "<table class=\"keytable\">\n<tr><th>Ámbito de Gobernanza</th><th>Directriz Clave de Cumplimiento</th><th>Mecanismo de Control</th></tr>\n<tr><td><b>Política de Uso Aceptable (AUP)</b></td><td>Prohibición taxativa de armas, ciberataques a infraestructura crítica, desinformación electoral y asesoramiento regulado sin supervisión.</td><td>Filtros de seguridad nativos de Anthropic y auditorías internas de casos de uso.</td></tr>\n<tr><td><b>Redacción de PII (Datos Sensibles)</b></td><td>Sustitución de nombres, DNI, tarjetas de crédito, salarios y domicilios por identificadores sintéticos antes del prompt.</td><td>Protocolos de anonimización previa y filtros perimetrales de prevención de fuga de datos (DLP).</td></tr>\n<tr><td><b>Claude for Work (Zero Training)</b></td><td>En planes Team y Enterprise, Anthropic garantiza que los datos, prompts y documentos no se usan para entrenar modelos.</td><td>Acuerdo corporativo formal y Data Processing Addendum (DPA) conforme a RGPD.</td></tr>\n<tr><td><b>Sobreconfianza (Over-reliance)</b></td><td>Tendencia de los empleados a asumir que las salidas son infalibles por sonar coherentes y persuasivas.</td><td>Capacitación continua, rúbricas obligatorias y verificación activa de fuentes.</td></tr>\n</table>\n<p class=\"mt-2\"><b>Aislamiento Corporativo:</b> Prohíbe subir secretos comerciales o código propietario a cuentas gratuitas o personales de consumo. Utiliza siempre entornos empresariales con SSO y políticas de retención controladas.</p>"
    },
    {
      "id": "ccao-t-4",
      "d": 4,
      "title": "4.1 · Prompting Estratégico y Ejecución de Tareas (Estructura, Contexto y Delimitadores)",
      "html": "<table class=\"keytable\">\n<tr><th>Componente del Prompt</th><th>Función Práctica</th><th>Ejemplo de Implementación</th></tr>\n<tr><td><b>Rol (System Prompt)</b></td><td>Enmarca la perspectiva, nivel de experiencia y tono profesional requerido.</td><td><i>\"Actúa como auditor financiero sénior especializado en riesgos de tesorería...\"</i></td></tr>\n<tr><td><b>Delimitadores XML</b></td><td>Separan nítidamente las instrucciones de negocio de los datos brutos a procesar.</td><td>Uso de etiquetas como <code>&lt;contexto&gt;</code>, <code>&lt;documento&gt;</code> e <code>&lt;instrucciones&gt;</code>.</td></tr>\n<tr><td><b>Few-Shot Prompting</b></td><td>Proporciona 2 o 3 ejemplos reales aprobados para fijar el tono y estructura sin ambigüedades.</td><td>Pares de entrada/salida representativos de la voz y formato institucional de la empresa.</td></tr>\n<tr><td><b>Restricciones Negativas</b></td><td>Fija límites explícitos para evitar divagaciones, suposiciones o adiciones inventadas.</td><td><i>\"No agregues compromisos no especificados en el texto; responde 'No consta' si falta el dato.\"</i></td></tr>\n<tr><td><b>Razonamiento Previo</b></td><td>Pide al modelo pensar paso a paso antes de emitir la conclusión final.</td><td><i>\"Analiza primero las cláusulas clave y luego emite la recomendación de riesgo.\"</i></td></tr>\n</table>"
    },
    {
      "id": "ccao-t-5",
      "d": 5,
      "title": "5.1 · Selección de Producto y Superficies (Claude Projects, Artifacts y Planes)",
      "html": "<table class=\"keytable\">\n<tr><th>Superficie / Característica</th><th>Cuándo es la Elección Correcta</th><th>Cuándo NO Usarla</th></tr>\n<tr><td><b>Claude Projects</b></td><td>Colaboración de equipo con memoria documental persistente (políticas, catálogos) e instrucciones compartidas.</td><td>Consultas puntuales, aisladas o ad-hoc que no requieren contexto histórico ni documentos comunes.</td></tr>\n<tr><td><b>Artifacts</b></td><td>Entregables sustanciales reutilizables: documentos extensos, diagramas SVG interactivos, tablas complejas y componentes de código.</td><td>Respuestas conversacionales breves, confirmaciones o intercambios de texto de menos de 10 líneas.</td></tr>\n<tr><td><b>Chat Estándar</b></td><td>Consultas rápidas, lluvia de ideas inicial y exploraciones efímeras sin persistencia documental.</td><td>Trabajo recurrente en equipo que exige cargar los mismos 10 manuales en cada turno de chat.</td></tr>\n<tr><td><b>Claude Team / Enterprise</b></td><td>Organizaciones que requieren SSO, consola administrativa, facturación central y garantía formal de no entrenamiento.</td><td>Uso puramente personal o recreativo sin datos de empresa ni requerimientos de privacidad.</td></tr>\n</table>"
    },
    {
      "id": "ccao-t-6",
      "d": 6,
      "title": "6.1 · Configuración y Troubleshooting (Context Drift, Límites de Turno y Documentación)",
      "html": "<table class=\"keytable\">\n<tr><th>Problema Operativo</th><th>Causa Subyacente</th><th>Solución Recomendada</th></tr>\n<tr><td><b>Deriva de Contexto (Context Drift)</b></td><td>Chats excesivamente largos (+30 turnos) donde el modelo pierde atención a directrices tempranas.</td><td>Abrir un nuevo chat enfocado resumiendo los acuerdos clave y cerrando hilos obsoletos.</td></tr>\n<tr><td><b>Alucinación Factual</b></td><td>Ausencia de contexto documental explícito o permiso implícito para que el modelo invente.</td><td>Anclar al documento con instrucción: <i>\"Básate solo en el texto adjunto; si no figura, indica 'No consta'.\"</i></td></tr>\n<tr><td><b>Salida Truncada</b></td><td>Se alcanzó el límite máximo de tokens de salida para un turno de conversación.</td><td>Enviar el comando <i>\"Continúa exactamente donde te quedaste\"</i> o pedir estructuración por secciones.</td></tr>\n<tr><td><b>Contradicciones en Projects</b></td><td>Archivos obsoletos o versiones en conflicto cargados en la base de conocimiento del proyecto.</td><td>Auditar y purgar los documentos del Project reteniendo únicamente la versión vigente aprobada.</td></tr>\n</table>"
    },
    {
      "id": "ccao-t-7",
      "d": 7,
      "title": "7.1 · Estructuración Avanzada y Prompt Chaining (Descomposición Modular vs Mega-Prompt)",
      "html": "<table class=\"keytable\">\n<tr><th>Fase de la Cadena</th><th>Objetivo Operativo</th><th>Punto de Control de Calidad</th></tr>\n<tr><td><b>Paso 1: Extracción</b></td><td>Aislar hechos, datos numéricos o cláusulas clave del documento extenso de origen.</td><td>Validar que no se omitieron filas de tablas ni se mezclaron unidades de medida.</td></tr>\n<tr><td><b>Paso 2: Análisis y Cruce</b></td><td>Comparar los datos extraídos contra políticas de riesgo, umbrales o directrices internas.</td><td>Verificar la lógica analítica antes de generar redacción persuasiva o conclusiones.</td></tr>\n<tr><td><b>Paso 3: Redacción Final</b></td><td>Sintetizar las conclusiones en el formato ejecutivo final (Artifact, tabla o memorando).</td><td>Revisión humana de estilo, tono y cumplimiento de restricciones del entregable final.</td></tr>\n<tr><td><b>Fallo del Mega-Prompt</b></td><td>Intentar que el modelo extraiga, analice, pondere y redacte 20 páginas en una sola instrucción.</td><td>El modelo omite detalles intermedios, diluye restricciones y satura el límite de generación.</td></tr>\n</table>\n<p class=\"mt-2\"><b>Mejor Práctica:</b> El encadenamiento de prompts (Prompt Chaining) permite inspeccionar y corregir salidas intermedias antes de propagar errores a fases posteriores, logrando resultados de calidad institucional.</p>"
    }
  ],
  "questions": [
    {
      "id": "ccao-01",
      "d": 1,
      "t": "Rúbricas de Calidad y Criterios Previos",
      "q": "Un equipo comercial utiliza Claude para redactar resúmenes ejecutivos destinados a clientes clave. Antes de revisar los primeros borradores generados por el modelo, ¿cuál es la mejor práctica metodológica recomendada para evaluar objetivamente la calidad del texto y evitar sesgos cognitivos?",
      "o": [
        "Definir una rúbrica formal con criterios objetivos (precisión factual, tono y límites de extensión) antes de leer los borradores.",
        "Leer primero varios borradores de forma abierta para identificar intuitivamente cuál suena más elocuente y adoptar ese estilo.",
        "Configurar la salida en un esquema JSON técnico para que un validador automatizado revise la sintaxis sin necesidad de intervención humana.",
        "Pedirle a Claude en un segundo prompt que califique sus propias respuestas del 1 al 10 y aceptar únicamente aquellas con puntaje perfecto."
      ],
      "a": 0,
      "e": "Definir una rúbrica objetiva de evaluación antes de interactuar con el modelo previene el sesgo de confirmación y evita confundir la mera fluidez del texto con calidad de negocio."
    },
    {
      "id": "ccao-02",
      "d": 1,
      "t": "Verificación Factual contra Fuentes Primarias",
      "q": "Al validar un informe financiero redactado por Claude a partir de un balance en formato PDF, un analista nota que dos cifras de la tabla resumen difieren de las del balance original. ¿Cuál es la conducta profesional y operativa adecuada en este escenario?",
      "o": [
        "Asumir que Claude aplicó un ajuste contable inteligente por inflación o estacionalidad no declarado en el documento original.",
        "Cotejar directamente cada cifra contra los estados financieros oficiales de origen antes de aprobar y circular el informe.",
        "Preguntarle a Claude en el mismo chat si sus cálculos son verdaderos y dar por buenas las cifras si contesta afirmativamente.",
        "Modificar el balance original para alinearlo con las conclusiones más favorables y optimistas presentadas en la tabla de Claude."
      ],
      "a": 1,
      "e": "La exactitud factual requiere contrastar siempre los datos generados con la fuente primaria (ground truth). Nunca debe asumirse que una discrepancia numérica es un ajuste contable válido."
    },
    {
      "id": "ccao-03",
      "d": 1,
      "t": "Evaluación con Golden Datasets",
      "q": "El área de operaciones desea comparar el rendimiento de tres versiones distintas de prompts para clasificar tickets de soporte técnico de clientes. ¿Qué herramienta o enfoque metodológico proporciona la evaluación comparativa más fiable y repetible?",
      "o": [
        "Probar cada versión del prompt con dos o tres casos hipotéticos inventados en el momento dentro de una sesión de chat efímera.",
        "Seleccionar automáticamente la versión del prompt que genere las respuestas más largas y con mayor riqueza de términos técnicos.",
        "Evaluar cada versión de prompt contra un conjunto de prueba fijo (`Golden Dataset`) con respuestas humanas validadas previamente.",
        "Solicitar a un usuario novato que escoja de manera subjetiva cuál de las tres versiones de prompt redacta con un estilo más agradable."
      ],
      "a": 2,
      "e": "Un `Golden Dataset` con ejemplos reales curados y respuestas humanas de referencia permite medir la precisión y comparar cambios de prompts de forma estandarizada y científica."
    },
    {
      "id": "ccao-04",
      "d": 1,
      "t": "Anclaje Factual y Prevención de Excepciones",
      "q": "Una tienda minorista en línea utiliza Claude para responder dudas sobre devoluciones de productos. ¿Qué instrucción en el prompt minimiza el riesgo de que el modelo invente excepciones comerciales favorables al cliente que no están contempladas en las políticas?",
      "o": [
        "Instruir a Claude a ser comprensivo y autorizar devoluciones extraordinarias siempre que el comprador exprese frustración evidente.",
        "Permitir que el modelo complete lagunas de la política basándose en las prácticas habituales del comercio electrónico global.",
        "Ampliar el límite de tokens de salida para que el asistente sugiera posibles acuerdos legales alternativos fuera del reglamento interno.",
        "Adjuntar la política oficial e instruir a Claude a responder basándose solo en ella y declarar si una consulta excede sus límites."
      ],
      "a": 3,
      "e": "El anclaje estricto en el texto adjunto junto con una instrucción explícita de declarar cuándo una consulta queda fuera de la política evita alucinaciones y concesiones no autorizadas."
    },
    {
      "id": "ccao-05",
      "d": 1,
      "t": "Detección y Mitigación de Alucinaciones",
      "q": "Al auditar un memorando jurídico redactado con Claude, un abogado descubre que el texto cita un artículo de ley inexistente con absoluta convicción retórica. ¿Cómo se tipifica técnicamente este fenómeno y cuál es la salvaguarda obligatoria en el flujo de trabajo?",
      "o": [
        "Alucinación factual; se mitiga exigiendo citas textuales verificables contra normas oficiales y revisión humana obligatoria.",
        "Deriva de contexto; se corrige duplicando el número de documentos jurídicos subidos al hilo para que el modelo tenga más opciones.",
        "Violación de derechos de autor; se soluciona solicitando a los tribunales una autorización para el uso comercial de textos legislativos.",
        "Desfase de tokens; se resuelve eliminando los saltos de línea en el prompt para obligar al modelo a ceñirse al código penal vigente."
      ],
      "a": 0,
      "e": "Una alucinación ocurre cuando el modelo genera información falsa con apariencia de certeza. En ámbitos regulados, exigir citas textuales y validación humana por expertos es imprescindible."
    },
    {
      "id": "ccao-06",
      "d": 1,
      "t": "Criterios Esenciales en Rúbricas de Recursos Humanos",
      "q": "Un comité de calidad diseña una rúbrica formal para evaluar las respuestas generadas por Claude en un portal interno de consultas laborales para colaboradores. ¿Cuáles DOS dimensiones deben ponderarse prioritariamente para asegurar rigor y cumplimiento? (Selecciona 2)",
      "o": [
        "Exactitud factual y anclaje verificable en los convenios colectivos y políticas laborales vigentes de la empresa.",
        "Cumplimiento riguroso de directrices de tono corporativo profesional y respeto a las normas de privacidad del personal.",
        "Extensión obligatoria de cada respuesta para asegurar que siempre supere un mínimo de cuatro párrafos detallados.",
        "Uso predominante de terminología legal compleja para proyectar la máxima autoridad formal frente a los empleados."
      ],
      "a": [
        0,
        1
      ],
      "e": "La exactitud factual y el tono profesional respetuoso con la privacidad son los pilares fundamentales en consultas de recursos humanos; la longitud forzada y la jerga excesiva son contraproducentes."
    },
    {
      "id": "ccao-07",
      "d": 1,
      "t": "Estandarización de Tono Mediante Few-Shot",
      "q": "Un supervisor de atención al cliente nota que Claude responde con un estilo muy informal a clientes de banca minorista y con excesiva frialdad a clientes de banca privada. ¿Cuál es la forma más eficaz y duradera de estandarizar el tono comunicativo?",
      "o": [
        "Redactar advertencias en mayúsculas amenazando al modelo con penalizaciones de rendimiento si altera el estilo entre turnos.",
        "Incorporar en el prompt base dos o tres ejemplos concretos (`Few-Shot`) del tono empático y formal esperado para cada segmento.",
        "Instruir a los clientes para que adapten sus preguntas al modelo redactándolas con una estructura fija de cincuenta palabras.",
        "Reescribir a mano cada respuesta de Claude antes de enviarla sin documentar ni modificar las directrices del prompt original."
      ],
      "a": 1,
      "e": "El uso de ejemplos demostrativos (few-shot prompting) es la técnica más efectiva para fijar el tono, la formalidad y la estructura comunicativa en escenarios empresariales."
    },
    {
      "id": "ccao-08",
      "d": 1,
      "t": "Riesgo de Fluidez Lingüística en Contratos",
      "q": "Al auditar la calidad de los resúmenes de contratos comerciales generados por Claude, ¿por qué constituye una práctica negligente confiar exclusivamente en la fluidez de la redacción como indicador de exactitud?",
      "o": [
        "Un texto con estilo pulido y sintaxis perfecta demuestra que el modelo consultó registros públicos en tiempo real.",
        "Los modelos lingüísticos generan prosa impecable únicamente cuando todas las premisas analizadas son 100 % correctas.",
        "La fluidez y convicción gramatical pueden enmascarar la omisión accidental de cláusulas críticas de indemnización o plazos.",
        "La excesiva fluidez estilística activa de inmediato cortafuegos de seguridad en Anthropic que cancelan la cuenta corporativa."
      ],
      "a": 2,
      "e": "La coherencia sintáctica no garantiza la integridad factual. Un resumen bien escrito puede sonar impecable mientras omite penalizaciones o cláusulas de vencimiento críticas."
    },
    {
      "id": "ccao-09",
      "d": 1,
      "t": "Rol del Revisor Humano en Propuestas Comerciales",
      "q": "Un equipo de ventas utiliza Claude para acelerar la redacción de propuestas comerciales personalizadas para licitaciones públicas. ¿Cuál es el rol insustituible del revisor humano en este flujo de trabajo (`Human-in-the-Loop`)?",
      "o": [
        "Supervisar el ritmo de aparición de tokens en la pantalla para comprobar la latencia de la red durante la generación del texto.",
        "Reemplazar sistemáticamente todos los sustantivos por sinónimos manuales para eliminar cualquier huella reconocible de la IA.",
        "Desactivar los controles del cortafuegos corporativo para permitir que Claude descargue datos confidenciales del cliente de internet.",
        "Validar los precios, plazos de entrega y compromisos contractuales antes de la presentación formal vinculante de la oferta."
      ],
      "a": 3,
      "e": "En propuestas vinculantes, el revisor humano garantiza que los compromisos de precio, plazos y condiciones legales sean viables y cumplan con las capacidades de la empresa."
    },
    {
      "id": "ccao-10",
      "d": 1,
      "t": "Métricas Objetivas de Clasificación de Quejas",
      "q": "En un proyecto de automatización asistida para clasificar quejas de clientes por nivel de severidad (Baja, Media, Alta, Crítica), ¿qué métrica objetiva permite evaluar la calidad del modelo sin depender de impresiones personales?",
      "o": [
        "La tasa de concordancia exacta (exact match) frente a un lote de quejas previamente etiquetadas por especialistas del área.",
        "La velocidad promedio a la que el revisor humano consigue leer y aprobar los resúmenes clasificados en la interfaz de usuario del sistema.",
        "El número total de adjetivos positivos que el modelo añade en su análisis para suavizar el malestar del cliente.",
        "La cantidad de caracteres y párrafos explicativos que Claude proporciona para defender cada clasificación de severidad."
      ],
      "a": 0,
      "e": "La concordancia exacta contra una muestra etiquetada por expertos humanos (ground truth) es la métrica estándar para medir objetivamente la precisión de una tarea de clasificación."
    },
    {
      "id": "ccao-11",
      "d": 1,
      "t": "Diagnóstico de Fallos en Tablas Complejas",
      "q": "Al evaluar un prompt para extraer datos clave de facturas de proveedores, Claude extrae con precisión facturas sencillas, pero omite líneas enteras en facturas con tablas complejas de múltiples páginas. ¿Cuál es el procedimiento metodológico correcto?",
      "o": [
        "Exigir a todos los proveedores del mercado que abandonen las tablas y envíen únicamente documentos de texto plano lineal.",
        "Examinar los casos fallidos, enriquecer el prompt con ejemplos estructurados de tablas complejas y revalidar con el dataset de prueba.",
        "Aceptar un 30 % de omisiones en las tablas asumiendo que los modelos de lenguaje no están preparados para el mundo laboral.",
        "Borrar el dataset de prueba original y evaluar el prompt únicamente con facturas sencillas para certificar una tasa de éxito del 100 %."
      ],
      "a": 1,
      "e": "El ciclo iterativo de calidad en IA consiste en analizar los errores, proveer ejemplos de las estructuras complejas en el prompt (few-shot) y volver a medir contra el dataset de prueba."
    },
    {
      "id": "ccao-12",
      "d": 1,
      "t": "Propósito Estratégico de las Rúbricas de Evaluación",
      "q": "¿Cuál es la principal ventaja organizativa de diseñar y documentar una rúbrica de evaluación antes de desplegar un asistente basado en Claude en un área de negocio?",
      "o": [
        "Reducir automáticamente el consumo de tokens y asegurar un descuento en la tarifa mensual de suscripción a la plataforma.",
        "Eliminar totalmente la necesidad de auditorías futuras al garantizar que el modelo responderá siempre sin fallos.",
        "Establecer un estándar transparente y consensuado para determinar si las respuestas cumplen los requisitos de calidad esperados.",
        "Forzar al modelo a responder con idéntica cantidad de palabras independientemente de la complejidad de la consulta planteada."
      ],
      "a": 2,
      "e": "Una rúbrica previa alinea las expectativas de negocio, proporciona criterios medibles para auditorías y define con claridad qué constituye una respuesta aceptable para la empresa."
    },
    {
      "id": "ccao-13",
      "d": 2,
      "t": "Triaje Asistido de Reclamaciones Médicas",
      "q": "Una aseguradora de salud desea reducir el tiempo de tramitación de reclamaciones de reembolso médico. ¿Qué arquitectura de flujo de trabajo combina de forma óptima rapidez operativa y seguridad para los asegurados?",
      "o": [
        "Configurar a Claude para que liquide y ordene las transferencias bancarias de forma autónoma sin ninguna revisión humana.",
        "Exigir que un médico transcriba manualmente cada recibo para que Claude únicamente redacte un correo electrónico de bienvenida genérico.",
        "Delegar en Claude el rechazo definitivo de reclamaciones dudosas impidiendo que el asegurado pueda apelar la decisión con un operador.",
        "Utilizar Claude para extraer datos y clasificar la reclamación, dejando la aprobación del reembolso a un liquidador humano calificado."
      ],
      "a": 3,
      "e": "El patrón recomendado utiliza Claude para agilizar la extracción de datos y el triaje, reservando la autorización financiera y la decisión final a profesionales humanos."
    },
    {
      "id": "ccao-14",
      "d": 2,
      "t": "Protocolo de Handoff en Soporte al Cliente",
      "q": "Un representante de servicio al cliente utiliza Claude para redactar borradores de respuesta a quejas complejas de usuarios insatisfechos. ¿Qué acción garantiza un traspaso operativo (`handoff`) seguro y empático?",
      "o": [
        "El representante lee el borrador, valida los datos del caso, ajusta el mensaje con empatía genuina y asume la firma de la respuesta.",
        "El representante programa un script que reenvía inmediatamente a los clientes el primer borrador generado por Claude sin lectura previa alguna.",
        "El representante indica al cliente que ingrese directamente a la plataforma de Claude para debatir sus desacuerdos contractuales.",
        "El representante elimina las referencias al problema del cliente para evitar que este responda solicitando aclaraciones adicionales."
      ],
      "a": 0,
      "e": "Un handoff responsable exige que el agente humano valide los datos, ajuste el tono a las circunstancias particulares del cliente y se responsabilice formalmente del mensaje."
    },
    {
      "id": "ccao-15",
      "d": 2,
      "t": "Revisión Asistida de Contratos con Proveedores",
      "q": "El departamento de compras recibe borradores de contratos de diversos proveedores internacionales. ¿Cuál es la forma más productiva y segura de integrar a Claude en el flujo de revisión de estos documentos?",
      "o": [
        "Prescindir del equipo legal y firmar digitalmente los contratos siempre que Claude no emita ninguna alerta de peligro en el chat.",
        "Usar a Claude para cotejar el contrato contra las políticas estándar de la empresa y generar una lista de discrepancias para los abogados.",
        "Subir los contratos a redes sociales abiertas para que usuarios externos comprueben si las cláusulas son comunes en otros países.",
        "Pedir a Claude que reescriba el contrato suprimiendo todas las cláusulas de arbitraje y límites de responsabilidad sin consultar al área jurídica."
      ],
      "a": 1,
      "e": "Claude destaca como asistente de lectura crítica, identificando divergencias frente a las plantillas corporativas para que los abogados enfoquen su tiempo en los puntos de riesgo."
    },
    {
      "id": "ccao-16",
      "d": 2,
      "t": "Integridad en Informes Financieros para Inversores",
      "q": "Una firma de asesoría patrimonial elabora resúmenes trimestrales para inversores institucionales. ¿Cómo debe articularse el flujo de trabajo para garantizar la total veracidad de las proyecciones y análisis generados?",
      "o": [
        "Permitir que Claude formule predicciones macroeconómicas basándose en foros financieros no verificados de internet.",
        "Omitir la sección de advertencias de riesgo en el documento final si Claude sugiere un horizonte de rendimiento extraordinariamente favorable.",
        "Suministrar datos auditados al modelo, generar el análisis narrativo preliminar y validar cada ratio y afirmación con el equipo financiero.",
        "Publicar los resúmenes inmediatamente en el portal de inversores antes de la revisión interna para ser los primeros del mercado en divulgar datos."
      ],
      "a": 2,
      "e": "El rigor financiero exige aportar información validada como contexto, utilizar el modelo para redactar el análisis cualitativo y someter el resultado al control del equipo contable."
    },
    {
      "id": "ccao-17",
      "d": 2,
      "t": "Gobernanza en Selección de Personal",
      "q": "El equipo de atracción de talento utiliza Claude para resumir transcripciones de entrevistas laborales a candidatos. ¿Qué directriz de gobernanza debe cumplirse obligatoriamente en este proceso de selección?",
      "o": [
        "Configurar un filtro algorítmico que descarte automáticamente al candidato si su transcripción oral tiene una puntuación de sentimiento baja o negativa.",
        "Emplear al modelo para inferir la edad, género u origen cultural del candidato y equilibrar las cuotas de contratación interna.",
        "Compartir los audios completos de los candidatos con empresas competidoras para crear listas negras de postulantes en el sector.",
        "Utilizar los resúmenes como material de apoyo informativo, reservando la decisión de avance en el proceso al juicio de los evaluadores humanos."
      ],
      "a": 3,
      "e": "La IA en reclutamiento debe actuar solo como soporte documental. Las decisiones sobre selección, descarte o contratación deben ser tomadas por personas para prevenir discriminación y sesgos."
    },
    {
      "id": "ccao-18",
      "d": 2,
      "t": "Puntos de Control Obligatorios Human-in-the-Loop",
      "q": "¿En cuáles DOS de las siguientes situaciones laborales resulta estrictamente obligatorio aplicar un punto de control y aprobación humana (`Human-in-the-Loop`) antes de emitir la salida generada con Claude? (Selecciona 2)",
      "o": [
        "Emisión formal de una comunicación que notifica la denegación de una hipoteca o la cancelación de un contrato de seguro.",
        "Publicación de un comunicado de prensa de emergencia ante un incidente de ciberseguridad con compromiso de datos confidenciales.",
        "Corrección gramatical de un memorando interno informal sobre el cambio de sala para la reunión de sincronización de los martes.",
        "Generación de una lista preliminar de nombres creativos para una campaña interna de voluntariado ambiental corporativo."
      ],
      "a": [
        0,
        1
      ],
      "e": "Las decisiones de impacto financiero o legal directo sobre personas (créditos) y las comunicaciones públicas de crisis exigen supervisión y aprobación humana obligatoria."
    },
    {
      "id": "ccao-19",
      "d": 2,
      "t": "Consistencia de Contenidos con Claude Projects",
      "q": "Un departamento de marketing con ocho redactores produce artículos corporativos para el blog de la empresa. Para lograr que todas las publicaciones mantengan una voz de marca coherente sin importar quién formule el prompt, ¿cuál es la mejor práctica?",
      "o": [
        "Centralizar la guía de estilo, el perfil de la audiencia y artículos aprobados en un `Claude Project` compartido por todo el equipo.",
        "Pedir a cada redactor que use cuentas gratuitas individuales y que cada uno aplique libremente su propio criterio de estilo personal sin directrices comunes.",
        "Instruir a los redactores para que no proporcionen contexto de la empresa con el fin de fomentar la máxima diversidad de opiniones.",
        "Prohibir el uso de ejemplos en los prompts para evitar que el modelo repita giros lingüísticos previamente utilizados."
      ],
      "a": 0,
      "e": "Un `Claude Project` permite compartir una base documental de referencia (Project Knowledge) e instrucciones conjuntas, asegurando consistencia de estilo y tono entre todos los redactores."
    },
    {
      "id": "ccao-20",
      "d": 2,
      "t": "Prevención de Sobreconfianza en Cotizaciones",
      "q": "El director comercial de una empresa industrial detecta que varios ejecutivos de cuenta copian cotizaciones generadas por Claude y las envían a clientes sin revisar los precios unitarios ni los descuentos. ¿Qué medida operativa debe implementarse para atajar este problema?",
      "o": [
        "Cerrar inmediatamente el acceso a cualquier herramienta de inteligencia artificial en toda la empresa y sancionar económicamente a todo el equipo de ventas.",
        "Establecer un protocolo formal de verificación donde el vendedor deba marcar una casilla de control certificando la exactitud de cada cifra.",
        "Instalar un bot que apruebe automáticamente todas las cotizaciones siempre que el total supere los diez mil euros.",
        "Ocultar las tarifas oficiales a los vendedores para que dependan exclusivamente de la memoria intrínseca del modelo de IA."
      ],
      "a": 1,
      "e": "Imponer un paso de verificación explícita con firma o confirmación responsable refuerza el rol de control humano e impide la copia automática de datos sin validar."
    },
    {
      "id": "ccao-21",
      "d": 2,
      "t": "Valor del Triaje Asistido en Mesa de Ayuda",
      "q": "En el centro de atención a usuarios de una corporación se implementa Claude para generar propuestas de solución a incidentes de software. ¿Qué ventaja esencial aporta este modelo frente a la resolución 100 % desatendida sin humanos?",
      "o": [
        "Permite prescindir por completo de técnicos especializados en nivel 1 y transferir toda la nómina de soporte a gastos operativos de cómputo en la nube corporativa.",
        "Garantiza matemáticamente que los servidores principales no requerirán parches de seguridad ni mantenimientos programados.",
        "Acelera la búsqueda de diagnósticos preliminares manteniendo el criterio del analista humano para validar la solución antes de aplicarla.",
        "Hace posible reiniciar servidores centrales de producción de forma instantánea sin necesidad de validar credenciales de acceso."
      ],
      "a": 2,
      "e": "El enfoque colaborativo aprovecha la rapidez de Claude para estructurar la solución y deja en manos del técnico la verificación antes de ejecutar cambios en sistemas."
    },
    {
      "id": "ccao-22",
      "d": 3,
      "t": "Anonimización y Redacción de PII",
      "q": "Un analista de recursos humanos desea usar Claude para resumir una planilla salarial que incluye nombres completos, números de documento de identidad y sueldos. Según los principios de privacidad corporativa y gobernanza de datos, ¿qué paso previo es indispensable?",
      "o": [
        "Subir el archivo original directamente en un chat privado asumiendo que las cuentas individuales no están sujetas a normas internas.",
        "Pedirle a Claude en el prompt que mantenga en secreto la información salarial y que prometa borrarla de su memoria tras responder.",
        "Compartir el enlace público del chat con otros analistas para que verifiquen si los datos personales resultan fácilmente reconocibles.",
        "Anonimizar la planilla reemplazando nombres y documentos por códigos sintéticos (Empleado 1, Empleado 2) antes de cargar el texto."
      ],
      "a": 3,
      "e": "Antes de transferir información a cualquier modelo de lenguaje, la información personal identificable (PII) debe anonimizarse o reemplazarse por datos sintéticos para cumplir las regulaciones de privacidad."
    },
    {
      "id": "ccao-23",
      "d": 3,
      "t": "Política de Uso Aceptable (AUP) de Anthropic",
      "q": "Un consultor de seguridad informática solicita a Claude instrucciones paso a paso para vulnerar un sistema de control industrial (SCADA) de una planta de tratamiento de agua potable. ¿Por qué el modelo rechaza responder a esta solicitud?",
      "o": [
        "Incurre en una violación directa de la Política de Uso Aceptable (`AUP`) de Anthropic, que prohíbe facilitar ciberataques a infraestructura crítica.",
        "Claude carece de conceptos teóricos sobre redes SCADA y sistemas industriales debido a que solo fue entrenado con literatura clásica.",
        "La consulta sobrepasa el límite estándar de tokens de contexto disponible para cuentas profesionales en el entorno de chat.",
        "Se requiere una autorización notarial emitida por el ministerio de industria para desbloquear respuestas sobre redes de saneamiento."
      ],
      "a": 0,
      "e": "La Política de Uso Aceptable (AUP) de Anthropic prohíbe taxativamente la provisión de instrucciones operativas para ciberataques y vulneración de infraestructuras críticas."
    },
    {
      "id": "ccao-24",
      "d": 3,
      "t": "Privacidad y Entrenamiento en Planes Corporativos",
      "q": "Al adoptar Claude for Work en planes empresariales (Team o Enterprise), ¿cuál es el compromiso formal de Anthropic respecto al entrenamiento de sus modelos de inteligencia artificial con los datos del cliente?",
      "o": [
        "Anthropic añade automáticamente todos los documentos corporativos subidos al corpus de entrenamiento de sus próximos modelos comerciales.",
        "Anthropic garantiza que no entrena sus modelos fundamentales con los datos, documentos ni prompts cargados por clientes corporativos.",
        "Los datos se ceden de forma anónima a universidades aliadas para investigaciones sociológicas sobre hábitos de redacción en oficinas.",
        "Únicamente los documentos escritos en inglés quedan excluidos del entrenamiento, mientras que otros idiomas se aprovechan libremente."
      ],
      "a": 1,
      "e": "En las ediciones de negocio (Team y Enterprise), Anthropic establece por contrato que no utiliza las entradas ni los documentos del cliente para entrenar o ajustar sus modelos."
    },
    {
      "id": "ccao-25",
      "d": 3,
      "t": "Directrices en Asesoramiento Financiero",
      "q": "Un banco comercial analiza la posibilidad de incorporar a Claude en su banca en línea para orientar a clientes sobre opciones de inversión y créditos hipotecarios. ¿Qué principio de IA responsable debe regir esta iniciativa?",
      "o": [
        "Promocionar al modelo públicamente como un asesor financiero certificado capaz de tomar decisiones de inversión autónomas y vinculantes en nombre del cliente minorista.",
        "Garantizar contractualmente a los clientes que las proyecciones financieras calculadas por Claude cuentan con una rentabilidad 100 % asegurada.",
        "Establecer claramente que las respuestas son meramente orientativas y que cualquier decisión formal exige la validación de un asesor humano habilitado.",
        "Eliminar cualquier mención de riesgos macroeconómicos de las respuestas para incentivar la contratación inmediata de préstamos bancarios."
      ],
      "a": 2,
      "e": "En sectores regulados como el financiero, la IA debe funcionar como asistente informativo orientativo, dejando en claro que las decisiones vinculantes exigen asesores certificados."
    },
    {
      "id": "ccao-26",
      "d": 3,
      "t": "Usos Prohibidos según la Política de Uso Aceptable",
      "q": "De acuerdo con la Política de Uso Aceptable (`Acceptable Use Policy`) de Anthropic, ¿cuáles DOS de las siguientes actividades están terminantemente prohibidas en la plataforma? (Selecciona 2)",
      "o": [
        "Diseño o facilitación de armas biológicas, químicas, radiológicas o material para ciberataques maliciosos.",
        "Generación coordinada de contenidos para campañas encubiertas de desinformación electoral o manipulación de votos.",
        "Elaboración de tablas comparativas de costes de software libre para apoyar decisiones de compras internas.",
        "Traducción de manuales de prevención de riesgos laborales del español al inglés para personal de obras."
      ],
      "a": [
        0,
        1
      ],
      "e": "La AUP de Anthropic prohíbe estrictamente la proliferación de armamento y ciberataques, así como la interferencia electoral mediante desinformación coordinada."
    },
    {
      "id": "ccao-27",
      "d": 3,
      "t": "Gobernanza Clínica en Salud",
      "q": "Un centro hospitalario planea utilizar Claude para redactar borradores de guías explicativas sobre el autocuidado en pacientes diagnosticados con hipertensión. ¿Cuál es el requisito ético y operativo fundamental antes de distribuir el material?",
      "o": [
        "Permitir que los pacientes utilicen el modelo para ajustar sus dosis diarias de medicamentos sin necesidad de acudir a consulta médica.",
        "Ocultar que los borradores contaron con asistencia de IA para evitar que el comité de bioética solicite una revisión del documento.",
        "Distribuir inmediatamente las guías impresas siempre que el diseño tipográfico y los colores coincidan con el manual del hospital.",
        "Someter todo el contenido clínico redactado a la revisión formal y aprobación expresa de especialistas médicos titulados."
      ],
      "a": 3,
      "e": "Cualquier información médica destinada a pacientes debe ser validada rigurosamente por personal de la salud colegiado para prevenir errores y desinformación sanitaria."
    },
    {
      "id": "ccao-28",
      "d": 3,
      "t": "Riesgo de Sobreconfianza (Over-reliance)",
      "q": "¿Qué describe con mayor precisión el fenómeno de sobreconfianza (`over-reliance`) en el despliegue de modelos de inteligencia artificial en organizaciones empresariales?",
      "o": [
        "La tendencia psicológica de los empleados a aceptar como verdaderas las salidas del modelo sin someterlas a verificación crítica.",
        "La sobrecarga técnica de las redes locales provocada por enviar demasiados archivos PDF pesados simultáneamente a través del navegador web corporativo.",
        "La preferencia de los directores por contratar analistas de datos en lugar de capacitar al personal existente en ofimática.",
        "El error técnico consistente en utilizar contraseñas de red idénticas para el acceso a la plataforma corporativa de IA."
      ],
      "a": 0,
      "e": "La sobreconfianza (over-reliance) ocurre cuando los usuarios dejan de verificar las salidas porque la IA escribe de forma elocuente y persuasiva, provocando errores en el negocio."
    },
    {
      "id": "ccao-29",
      "d": 3,
      "t": "Políticas de Uso de IA para Contratistas",
      "q": "Una empresa de ingeniería contrata consultores externos para colaborar en el diseño de un nuevo motor. ¿Qué cláusula de seguridad debe estipularse obligatoriamente en la política de uso de herramientas de IA generativa para estos profesionales?",
      "o": [
        "Exigir que utilicen exclusivamente versiones de prueba gratuitas de consumo para evitar incurrir en gastos adicionales en la facturación del proyecto contratado.",
        "Prohibir expresamente la introducción de planos, código fuente propietario o secretos industriales en cuentas personales no gestionadas.",
        "Obligar a los contratistas a traducir todas las especificaciones al francés antes de realizar cualquier consulta conceptual a la IA.",
        "Imponer el borrado diario del historial del navegador sin mantener ningún registro de los entregables que fueron asistidos por IA."
      ],
      "a": 1,
      "e": "Para proteger la propiedad intelectual, los contratos deben prohibir subir activos propietarios a cuentas personales donde los datos no gocen de garantías empresariales de privacidad."
    },
    {
      "id": "ccao-30",
      "d": 3,
      "t": "Cumplimiento Regulatorio y Acuerdos DPA",
      "q": "Una corporación europea sujeta al Reglamento General de Protección de Datos (RGPD) evalúa el uso de Claude entre sus empleados para tareas de gestión comercial. ¿Qué medida jurídica y operativa respalda el tratamiento legal de los datos?",
      "o": [
        "Instalar una extensión no verificada en los navegadores que prometa bloquear la dirección IP de la empresa frente a Anthropic.",
        "Indicar en el contrato laboral que los propios empleados son personalmente responsables ante los tribunales de cualquier tratamiento de datos que realicen con herramientas de IA.",
        "Suscribir un Acuerdo de Procesamiento de Datos (`DPA`) y canalizar el uso a través de cuentas corporativas administradas con control de accesos.",
        "Limitar las consultas a días festivos para que las autoridades de protección de datos no puedan inspeccionar el tráfico en días hábiles."
      ],
      "a": 2,
      "e": "Bajo el RGPD, las organizaciones deben suscribir un Data Processing Addendum (DPA) con el proveedor y utilizar cuentas de empresa administradas para garantizar el tratamiento lícito."
    },
    {
      "id": "ccao-31",
      "d": 4,
      "t": "Estructura de un Prompt Empresarial",
      "q": "Un gestor de proyectos busca redactar un prompt integral para resumir las minutas de reuniones de dirección de forma consistente semana tras semana. ¿Cuál de las siguientes estructuras contiene todos los componentes metodológicos esenciales?",
      "o": [
        "Escribir una única frase solicitando un resumen agradable y conciso para que el modelo decida con total autonomía la extensión.",
        "Pegar veinte páginas completas de transcripciones mezcladas con instrucciones informales sin emplear ningún tipo de delimitador, categoría ni encabezado funcional.",
        "Redactar una lista desordenada de adjetivos en inglés solicitando excelencia analítica sin definir el formato final esperado.",
        "Definir el rol (`System Prompt`), el contexto operativo, la tarea delimitada con etiquetas, ejemplos de formato y restricciones explícitas."
      ],
      "a": 3,
      "e": "Un prompt robusto para tareas repetitivas de negocio combina rol, contexto, instrucciones claras delimitadas, ejemplos concretos (few-shot) y guardrails negativos."
    },
    {
      "id": "ccao-32",
      "d": 4,
      "t": "Uso de Delimitadores XML en Prompts Extensos",
      "q": "Al diseñar un prompt extenso que incluye normativas de la empresa, casos de ejemplo y el texto de un contrato que debe auditarse, ¿cuál es el beneficio técnico de emplear delimitadores tipo XML (como `<contexto>` o `<contrato>`)?",
      "o": [
        "Ayudan a Claude a diferenciar con claridad qué partes son directrices operativas y cuáles son datos de entrada que deben procesarse.",
        "Compilan el prompt en código binario de máquina acelerando la velocidad de descarga del texto generado a través de conexiones de banda ancha lentas.",
        "Son exigidos por el navegador web para poder mostrar el texto en modo de pantalla completa sin alterar la tipografía del sistema.",
        "Convierten automáticamente el documento en una base de datos relacional dentro de los servidores centrales de Anthropic."
      ],
      "a": 0,
      "e": "Las etiquetas XML estructuran visual y lógicamente el prompt para los modelos de la familia Claude, separando instrucciones de datos brutos y reduciendo ambigüedades."
    },
    {
      "id": "ccao-33",
      "d": 4,
      "t": "Aplicación de Few-Shot Prompting",
      "q": "El equipo editorial de una publicación corporativa necesita que Claude redacte comunicados de prensa siguiendo con rigor la sobriedad y estructura periodística de la empresa. ¿Qué técnica de prompting asegura el resultado más fiel al estilo?",
      "o": [
        "Escribir todo el prompt en letras mayúsculas enfatizando que la reputación de la empresa depende de este comunicado de prensa.",
        "Incluir en el prompt dos comunicados de prensa reales aprobados anteriormente para ilustrar la estructura y el registro formal esperado.",
        "Instruir al modelo para que sea lo más creativo posible y sorprenda a los lectores con metáforas poéticas inesperadas.",
        "Solicitar a Claude que imite el estilo de novelistas del siglo XIX para otorgar un tono más distinguido y clásico a la nota."
      ],
      "a": 1,
      "e": "Proveer ejemplos reales (few-shot prompting) ancla el estilo, el vocabulario y la disposición de la información de manera mucho más efectiva que meras descripciones abstractas."
    },
    {
      "id": "ccao-34",
      "d": 4,
      "t": "Restricciones Negativas y Prevención de Supuestos",
      "q": "Un analista de operaciones le pide a Claude que extraiga los plazos de entrega y responsables de un correo de seguimiento de proyecto. Al responder, Claude añade fechas supuestas que no constaban en el mensaje original. ¿Cómo debe corregirse el prompt?",
      "o": [
        "Pedirle que imagine e infiera plazos de entrega lógicos en caso de no figurar en el correo original para que el cronograma del proyecto no quede con fechas vacías.",
        "Incrementar en diez mil el número de tokens permitidos para que el modelo justifique con mayor amplitud las fechas inventadas.",
        "Incorporar una restricción explícita: 'Extrae solo fechas mencionadas en el texto; si un hito no tiene fecha, indica expresamente No especificada'.",
        "Eliminar el correo original del prompt y solicitarle a Claude que elabore un cronograma generalista para cualquier tipo de empresa."
      ],
      "a": 2,
      "e": "Las restricciones negativas explícitas indican al modelo exactamente qué hacer ante la ausencia de información (anotar 'No especificada'), previniendo conjeturas infundadas."
    },
    {
      "id": "ccao-35",
      "d": 4,
      "t": "Elementos Clave para Reducir Ambigüedad",
      "q": "¿Cuáles DOS prácticas de formulación de prompts son altamente recomendadas para evitar respuestas ambiguas o genéricas en tareas de análisis empresarial? (Selecciona 2)",
      "o": [
        "Definir el formato de salida con precisión (por ejemplo, tabla comparativa de tres columnas con métricas específicas).",
        "Especificar la audiencia de destino y el nivel técnico requerido (por ejemplo, comité de auditoría no familiarizado con TI).",
        "Evitar incluir restricciones de longitud para que el modelo redacte sin límites hasta donde estime necesario.",
        "Pedirle al modelo que exprese sentimientos de entusiasmo y optimismo desmedido en cada conclusión técnica emitida."
      ],
      "a": [
        0,
        1
      ],
      "e": "Especificar con claridad el formato de entrega y el perfil del destinatario reduce drásticamente la ambigüedad y adapta el mensaje a las necesidades de negocio."
    },
    {
      "id": "ccao-36",
      "d": 4,
      "t": "Razonamiento Previo para Auditoría Humana",
      "q": "En el análisis de incidentes de seguridad de la información, se instruye a Claude con la directriz: 'Antes de emitir el veredicto final sobre la severidad, explica tu razonamiento paso a paso evaluando cada vector de ataque'. ¿Qué ventaja operativa aporta este enfoque?",
      "o": [
        "Permite a Claude conectarse de forma remota y en tiempo real con agencias de ciberdefensa gubernamentales para validar la veracidad de cada deducción técnica formulada.",
        "Garantiza que la respuesta generada sea exactamente idéntica sin importar cuántas veces se formule la pregunta en el chat.",
        "Es un atajo técnico documentado para duplicar la cuota mensual de almacenamiento disponible en la cuenta del usuario.",
        "Favorece un análisis lógico más riguroso por parte del modelo y permite a los auditores humanos verificar la coherencia de las deducciones."
      ],
      "a": 3,
      "e": "Solicitar que el modelo desglose su razonamiento (chain-of-thought) antes de la conclusión final mejora la solidez lógica de las deducciones y facilita la auditoría humana del resultado."
    },
    {
      "id": "ccao-37",
      "d": 4,
      "t": "Estructuración y Ubicación de Restricciones",
      "q": "Un redactor técnico observa que Claude olvida con frecuencia una instrucción negativa sobre no usar anglicismos cuando esta se ubica en el centro de un documento de referencia de tres mil palabras. ¿Cuál es el ajuste de estructuración más adecuado?",
      "o": [
        "Reubicar la restricción al final del prompt o agruparla en una sección destacada bajo una etiqueta clara de directrices.",
        "Repetir la misma restricción cincuenta veces consecutivas en mayúsculas a lo largo de cada párrafo del documento.",
        "Traducir la restricción al código binario o hexadecimal para que adquiera mayor relevancia en los mecanismos de atención del modelo.",
        "Aceptar que los modelos de lenguaje son incapaces de recordar directrices negativas cuando se procesan textos de más de mil palabras."
      ],
      "a": 0,
      "e": "Colocar las directrices clave al final del prompt o en una sección claramente delimitada explota el efecto de recencia en la atención del modelo, maximizando el cumplimiento de restricciones."
    },
    {
      "id": "ccao-38",
      "d": 4,
      "t": "Calibración del Nivel de Complejidad",
      "q": "Al solicitar a Claude la síntesis de un reporte de arquitectura en la nube destinado a directores financieros no técnicos, ¿qué indicación en el prompt orienta mejor el grado de profundidad requerido?",
      "o": [
        "Exigir que todo el informe se redacte utilizando únicamente vocabulario infantil muy básico y elemental para garantizar que ningún lector tenga la menor duda conceptual.",
        "Instruir a Claude para que traduzca el impacto tecnológico a términos de costos, plazos y riesgos de negocio, definiendo la jerga indispensable.",
        "Ordenar el uso exclusivo de siglas y diagramas de circuitos electrónicos para proyectar una imagen de vanguardia técnica.",
        "Pedir que asuma que los directores financieros dominan la configuración de clústeres Kubernetes y omitir toda explicación de conceptos."
      ],
      "a": 1,
      "e": "Dirigir un informe técnico a una audiencia de negocios exige vincular la tecnología con impactos financieros y riesgos, explicando la terminología técnica indispensable sin caer en un tono condescendiente."
    },
    {
      "id": "ccao-39",
      "d": 5,
      "t": "Selección de Superficie: Claude Projects",
      "q": "El equipo de soporte de una empresa de software comparte periódicamente manuales de producto, guías de errores y políticas de reembolso para resolver consultas de usuarios. ¿Qué entorno de Claude es el idóneo para organizar este flujo de trabajo?",
      "o": [
        "Utilizar un chat estándar individual donde cada agente de soporte deba volver a subir manualmente los quince manuales cada vez que comience una nueva consulta de clientes.",
        "Desarrollar una aplicación personalizada desde cero consumiendo la API de Anthropic aunque el equipo no cuente con programadores.",
        "Configurar un `Claude Project`, ya que permite almacenar documentación de referencia persistente e instrucciones conjuntas para el equipo.",
        "Descargar los archivos del modelo en discos duros locales para operar sin acceso a internet en las oficinas comerciales."
      ],
      "a": 2,
      "e": "`Claude Projects` está diseñado específicamente para equipos que necesitan compartir bases documentales permanentes (Project Knowledge) e instrucciones de trabajo en un entorno sin código."
    },
    {
      "id": "ccao-40",
      "d": 5,
      "t": "Ventajas del Uso de Artifacts",
      "q": "Un consultor de estrategia necesita que Claude redacte una propuesta de transformación digital de treinta páginas que requerirá múltiples rondas de edición y perfeccionamiento. ¿Por qué es muy conveniente que el resultado se genere en un `Artifact`?",
      "o": [
        "Los `Artifacts` impiden que otros miembros del departamento puedan editar o copiar el texto si no cuentan con una clave criptográfica de descifrado especial asignada.",
        "El uso de `Artifacts` multiplica la velocidad de la conexión a internet del usuario mientras descarga el archivo a su equipo local.",
        "Los `Artifacts` otorgan de manera automática validez jurídica vinculante al documento ante las autoridades regulatorias del país.",
        "Permite aislar y visualizar el documento sustancial en un panel lateral dedicado, facilitando su lectura, versionado y edición iterativa."
      ],
      "a": 3,
      "e": "Los `Artifacts` separan los contenidos sustanciales y extensos del flujo conversacional, ofreciendo un panel lateral para inspeccionar, copiar, iterar y versionar el documento con total comodidad."
    },
    {
      "id": "ccao-41",
      "d": 5,
      "t": "Consultas Ad-hoc en Chat Estándar",
      "q": "Un analista júnior necesita conocer rápidamente la definición y origen etimológico de un término financiero para comprender un artículo de prensa, sin involucrar datos de clientes ni políticas de la empresa. ¿Qué superficie de Claude es la más eficiente?",
      "o": [
        "Un chat estándar individual en Claude, por tratarse de una consulta puntual y efímera que no requiere contexto documental persistente.",
        "Crear un nuevo `Claude Project` corporativo formal e invitar a los directores de diez áreas distintas para archivar y documentar la definición aislada del término.",
        "Contratar una consultora externa para que desarrolle un conector de software con la API de Anthropic para resolver la duda léxica.",
        "Configurar un servidor dedicado en la nube para procesar consultas de vocabulario mediante scripts en Python."
      ],
      "a": 0,
      "e": "Para dudas ad-hoc, rápidas y no recurrentes, el chat estándar es la opción más directa y ligera, evitando la sobrecarga de crear proyectos o integraciones innecesarias."
    },
    {
      "id": "ccao-42",
      "d": 5,
      "t": "Casos de Uso Idóneos para Artifacts",
      "q": "¿En cuáles DOS de las siguientes situaciones laborales resulta altamente ventajoso que Claude genere su respuesta como un `Artifact` en la ventana lateral? (Selecciona 2)",
      "o": [
        "Desarrollo de un diagrama interactivo o código SVG que el equipo desea visualizar, probar y refinar iterativamente.",
        "Creación de una guía operativa extensa y estructurada de varias páginas destinada a ser exportada y compartida con el equipo.",
        "Respuesta corta de cortesía en el chat confirmando la recepción de un archivo con el texto: 'Entendido, gracias'.",
        "Aclaración de una sola línea explicando el significado de una sigla corporativa muy común durante una conversación rápida."
      ],
      "a": [
        0,
        1
      ],
      "e": "Los `Artifacts` están concebidos para contenidos sustanciales, reutilizables o interactivos (código, diagramas SVG, documentos extensos); no para respuestas conversacionales breves."
    },
    {
      "id": "ccao-43",
      "d": 5,
      "t": "Gobernanza y Planes Empresariales",
      "q": "Una empresa de sesenta colaboradores necesita desplegar Claude asegurando autenticación centralizada (Single Sign-On o SSO), facturación única consolidada y controles de acceso por departamentos. ¿Qué modalidad de servicio satisface estos requerimientos?",
      "o": [
        "Solicitar a cada colaborador que cree una cuenta gratuita personal utilizando sus cuentas de correo electrónico particulares.",
        "Suscribir planes corporativos como `Claude Team` o `Claude Enterprise`, equipados con consola administrativa y gobernanza centralizada.",
        "Comprar sesenta suscripciones individuales de `Claude Pro` y reembolsar el coste mensual a través de liquidaciones de gastos de viaje.",
        "Instalar extensiones de terceros en los navegadores para compartir una única contraseña de acceso entre todos los empleados."
      ],
      "a": 1,
      "e": "Los planes `Claude Team` y `Claude Enterprise` están dotados de consola de administración, provisión de identidades vía SSO, facturación centralizada y garantías formales de privacidad."
    },
    {
      "id": "ccao-44",
      "d": 5,
      "t": "Instrucciones de Proyecto vs Base de Conocimiento",
      "q": "Dentro de un `Claude Project`, ¿cuál es la diferencia conceptual y operativa entre las 'Instrucciones del Proyecto' (`Project Instructions`) y los 'Archivos de Conocimiento' (`Project Knowledge`)?",
      "o": [
        "Las instrucciones solo pueden ser redactadas por Anthropic, mientras que los archivos son documentos públicos visibles en internet.",
        "No existe ninguna distinción operativa; ambos módulos cumplen exactamente la misma función en el procesamiento del contexto.",
        "Las instrucciones pautan el rol, tono y reglas permanentes de respuesta; los archivos proporcionan la información factual de consulta.",
        "Los archivos fijan los precios de suscripción de los miembros y las instrucciones guardan las contraseñas de red de la empresa."
      ],
      "a": 2,
      "e": "Las `Project Instructions` definen cómo debe comportarse Claude (rol, estilo, directrices), mientras que el `Project Knowledge` almacena la documentación sustantiva que nutre sus respuestas."
    },
    {
      "id": "ccao-45",
      "d": 6,
      "t": "Deriva de Contexto en Hilos Extensos",
      "q": "En una conversación de trabajo muy prolongada con más de cuarenta intercambios, un usuario nota que Claude empieza a desatender instrucciones dadas al inicio y confunde detalles de temas ya cerrados. ¿Qué fenómeno técnico ocurre y cuál es la solución operativa recomendada?",
      "o": [
        "Infección por virus en el equipo informático local; se soluciona formateando el disco duro y reinstalando el sistema operativo.",
        "Bloqueo definitivo de la cuenta por actividad sospechosa; se resuelve esperando una semana completa sin realizar ninguna consulta.",
        "Agotamiento irreversible del servidor principal; se remedia enviando el mismo mensaje diez veces consecutivas en mayúsculas.",
        "Deriva de contexto (`Context Drift`); se resuelve abriendo un nuevo chat enfocado y resumiendo los acuerdos clave acumulados."
      ],
      "a": 3,
      "e": "El `Context Drift` sucede cuando la acumulación de mensajes en un chat diluye la atención del modelo hacia las instrucciones iniciales; la solución es abrir un nuevo chat con un resumen limpio."
    },
    {
      "id": "ccao-46",
      "d": 6,
      "t": "Contradicciones en la Base de Conocimiento",
      "q": "Al consultar sobre el procedimiento de vacaciones en un `Claude Project`, el modelo ofrece respuestas contradictorias, citando a veces 20 días y otras veces 25 días para el mismo tipo de contrato. Tras revisar los archivos cargados, ¿cuál es la causa más probable y cómo debe subsanarse?",
      "o": [
        "Existen dos versiones del manual de beneficios cargadas (una antigua y otra actualizada); se debe eliminar el archivo obsoleto del Project.",
        "Claude carece totalmente de capacidad técnica para procesar archivos binarios en formato PDF y confunde de forma sistemática los números al extraer el texto plano.",
        "Es indispensable que todos los documentos del Project tengan exactamente la misma cantidad de páginas para evitar contradicciones.",
        "Los colaboradores deben formular sus preguntas en verso o rima para que el modelo identifique cuál archivo tiene prioridad legal."
      ],
      "a": 0,
      "e": "Tener versiones divergentes u obsoletas de una política en el `Project Knowledge` confunde al modelo; la buena práctica exige auditar y depurar los archivos manteniendo solo la versión vigente."
    },
    {
      "id": "ccao-47",
      "d": 6,
      "t": "Gestión de Salidas Truncadas por Límite de Tokens",
      "q": "Durante la generación de un análisis comparativo extenso sobre quince competidores, Claude se detiene de forma repentina en la mitad de un párrafo sin completar la tabla. ¿Cuál es el motivo técnico habitual de este comportamiento y cómo se reanuda la tarea?",
      "o": [
        "Anthropic canceló y suspendió el acceso del usuario a la plataforma por haber formulado una pregunta analítica excesivamente compleja para el procesador en la nube.",
        "Se alcanzó el límite máximo de tokens de salida para un solo turno; basta con escribir 'continúa' para que el modelo prosiga el texto.",
        "El modelo detectó una infracción de derechos de autor en el nombre de uno de los competidores y congeló la pantalla.",
        "Se produjo un fallo irrecuperable en la red global de telecomunicaciones que destruyó todo el historial de la conversación previa."
      ],
      "a": 1,
      "e": "Cada turno de respuesta tiene un límite prefijado de tokens de salida. Si la respuesta lo alcanza, la generación se corta limpiamente; enviar un mensaje pidiendo 'continúa' permite completar la tarea."
    },
    {
      "id": "ccao-48",
      "d": 6,
      "t": "Prevención de Respuestas con Información Externa en Projects",
      "q": "En un `Claude Project` creado para responder consultas sobre pólizas de seguro de vida, se detecta que el modelo en ocasiones responde con coberturas estándar de otros países que no forman parte de los contratos de la compañía. ¿Qué ajuste en las instrucciones del proyecto erradica este problema?",
      "o": [
        "Subir al proyecto enlaces a foros de seguros de internet para que el modelo verifique cuáles pólizas son más populares.",
        "Prohibir que los empleados formulen preguntas que contengan números o porcentajes para evitar que el modelo busque datos externos.",
        "Instruir expresamente: 'Responde exclusivamente con base en las pólizas cargadas en el proyecto; si un dato no figura en ellas, declara que no consta'.",
        "Eliminar todas las pólizas del proyecto y solicitar al modelo que memorice los términos aseguradores mediante un prompt único."
      ],
      "a": 2,
      "e": "Instruir explícitamente a Claude para que restrinja sus respuestas a los documentos del proyecto e indicar qué responder cuando falte información previene alucinaciones con datos externos."
    },
    {
      "id": "ccao-49",
      "d": 6,
      "t": "Límites de Carga de Archivos en Sesiones Web",
      "q": "Un analista intenta subir un archivo de video grabado de dos gigabytes a una sesión de chat en Claude para que transcriba la reunión y extraiga acuerdos. La plataforma rechaza la subida inmediatamente. ¿Cuál es el motivo operativo y la mejor alternativa de trabajo?",
      "o": [
        "La plataforma solo permite subir archivos a usuarios que cuenten con autorización expresa del comité ético de las Naciones Unidas.",
        "El usuario debe cambiar la extensión del archivo de video a '.txt' para engañar a los sistemas de verificación de la interfaz.",
        "Se debe fragmentar el video en cuatrocientos archivos de cinco megabytes e intentar subirlos todos juntos en el mismo mensaje.",
        "El archivo excede los límites de tamaño y tipos admitidos; debe extraerse la transcripción en texto plano y cargarla en la sesión."
      ],
      "a": 3,
      "e": "Claude está optimizado para procesar texto y documentos (PDF, texto, código, imágenes). Para reuniones grabadas, debe utilizarse una transcripción en texto plano, que es ligera y eficiente."
    },
    {
      "id": "ccao-50",
      "d": 6,
      "t": "Jerarquía de Instrucciones Personalizadas vs Prompts de Tarea",
      "q": "Un consultor tiene configuradas instrucciones personalizadas en su perfil global para que Claude siempre conteste con listas de viñetas breves. Sin embargo, para una tarea concreta necesita redactar una carta formal de disculpa en párrafos continuos. ¿Cuál es la forma más limpia de proceder?",
      "o": [
        "Indicar en el prompt de la tarea: 'Para esta tarea en particular, ignora el formato de viñetas habitual y redacta la carta en párrafos continuos y formales'.",
        "Eliminar definitivamente la cuenta de usuario corporativa en el servidor y solicitar una nueva dirección de correo electrónico al departamento de infraestructura de TI.",
        "Esperar a que transcurra el fin de semana para que las instrucciones personalizadas caduquen de manera automática en el servidor.",
        "Desinstalar el navegador web y acceder desde una tableta portátil para que el sistema no reconozca las preferencias del usuario."
      ],
      "a": 0,
      "e": "Las directrices explícitas dadas en el prompt de la tarea (`user prompt`) tienen prioridad operativa para sobreescribir temporalmente las preferencias generales del perfil sin necesidad de borrarlas."
    },
    {
      "id": "ccao-51",
      "d": 7,
      "t": "Descomposición Modular vs Falla del Mega-Prompt",
      "q": "Un equipo de consultoría debe elaborar un plan estratégico de cincuenta páginas analizando balances, encuestas y normativas. ¿Por qué enviar un único 'mega-prompt' solicitando redactar todo el informe en un solo turno produce resultados insatisfactorios?",
      "o": [
        "El modelo activa automáticamente un cobro extraordinario de penalización financiera cada vez que un prompt supera las quinientas palabras.",
        "El modelo tiende a omitir detalles críticos, condensar en exceso las secciones y perder coherencia al intentar cumplir múltiples metas a la vez.",
        "Los términos del servicio de Anthropic prohíben estrictamente analizar balances financieros y encuestas de mercado en una misma cuenta.",
        "El navegador web del usuario se reinicia por falta de memoria RAM al intentar recibir más de dos párrafos de texto simultáneamente."
      ],
      "a": 1,
      "e": "Los 'mega-prompts' saturan la capacidad de planificación del modelo, provocando resúmenes superficiales, omisiones de directrices secundarias y saturación del límite de tokens por turno."
    },
    {
      "id": "ccao-52",
      "d": 7,
      "t": "Secuencia Lógica en Prompt Chaining de Contratos",
      "q": "Al implementar una cadena de prompts (`Prompt Chaining`) para auditar un contrato de arrendamiento complejo y proponer modificaciones, ¿cuál es la secuencia metodológica más eficaz para garantizar calidad y control de riesgos?",
      "o": [
        "Paso 1: Redactar de inmediato las modificaciones finales -> Paso 2: Consultar al modelo qué opinaba en general del contrato -> Paso 3: Extraer las cláusulas originales.",
        "Paso 1: Solicitar un poema alegórico sobre el inmueble -> Paso 2: Imprimir el documento -> Paso 3: Traducir las firmas a tres idiomas.",
        "Paso 1: Extraer cláusulas de riesgo en una tabla -> Paso 2: Comparar con la política de la empresa -> Paso 3: Redactar contrapropuestas de redacción.",
        "Paso 1: Firmar digitalmente el acuerdo -> Paso 2: Solicitar a Claude que busque errores graves -> Paso 3: Notificar la rescisión a la contraparte."
      ],
      "a": 2,
      "e": "Una cadena efectiva progresa de lo concreto y analítico a la síntesis: primero extrae los datos objetivos, luego los evalúa contra las políticas internas y finalmente redacta las cláusulas alternativas."
    },
    {
      "id": "ccao-53",
      "d": 7,
      "t": "Inspección Intermedia en Cadenas de Prompts",
      "q": "En un flujo de trabajo que utiliza encadenamiento de prompts (`Prompt Chaining`), ¿qué beneficio operativo crucial aporta revisar y validar los resultados intermedios de cada fase antes de disparar el siguiente paso?",
      "o": [
        "Otorga un crédito de descuento del cincuenta por ciento en la factura mensual de servicios en la nube de la compañía.",
        "Elimina la necesidad de que los usuarios conozcan la materia del negocio, volviendo al equipo de trabajo completamente infalible.",
        "Permite que los pasos subsiguientes se ejecuten instantáneamente sin consumir tiempo de cómputo en los servidores de la plataforma.",
        "Permite detectar y corregir errores o alucinaciones tempranamente, evitando que se propaguen y amplifiquen en las fases posteriores."
      ],
      "a": 3,
      "e": "Validar las salidas intermedias en un flujo encadenado actúa como un punto de control de calidad (gatekeeper), impidiendo que un error en la extracción contamine el análisis y el informe final."
    },
    {
      "id": "ccao-54",
      "d": 7,
      "t": "Tratamiento de Fallos en Fases Intermedias",
      "q": "Un equipo diseña una cadena de tres prompts para generar casos de éxito: Paso 1: Extraer métricas de la entrevista con el cliente -> Paso 2: Estructurar el caso (Desafío, Solución, Resultado) -> Paso 3: Pulir la voz de marca. Si el Paso 2 produce una estructura deficiente y desordenada, ¿cuál es la acción correcta?",
      "o": [
        "Refinar el prompt del Paso 2 proporcionando una plantilla estructural clara y repetir esa fase antes de pasar al pulido de estilo del Paso 3.",
        "Continuar directamente con el Paso 3 asumiendo erróneamente que la fase de pulido de estilo corregirá de forma automática los problemas estructurales previos.",
        "Descartar todo el proyecto de casos de éxito y dictaminar que los modelos de lenguaje no sirven para tareas de comunicación comercial.",
        "Repetir el Paso 1 cargando diez transcripciones de clientes adicionales que no guardan relación con el caso en cuestión."
      ],
      "a": 0,
      "e": "Si una fase intermedia falla, debe corregirse el prompt de esa fase específica con pautas y plantillas claras antes de continuar. Avanzar con una base defectuosa solo amplifica los fallos de redacción."
    },
    {
      "id": "ccao-55",
      "d": 7,
      "t": "Ventajas Competitivas de la Descomposición Modular",
      "q": "¿Cuál es la principal ventaja de descomponer un análisis complejo en una cadena secuencial de prompts frente al intento de resolverlo en una única instrucción extensa?",
      "o": [
        "La instrucción única desbloquea módulos secretos de procesamiento cuántico en los servidores de Anthropic que no operan en cadenas.",
        "La descomposición modular aísla cada subtarea, permitiendo mayor profundidad de análisis, trazabilidad de datos y control de calidad.",
        "La cadena modular no requiere que los usuarios comprendan los pasos del problema, ya que el modelo deduce el plan de negocio automáticamente.",
        "La instrucción única garantiza de forma matemática e irrefutable que no existirán alucinaciones factuales en ninguna de las secciones producidas."
      ],
      "a": 1,
      "e": "La modularidad permite que el modelo concentre su capacidad de atención en una subtarea concreta a la vez (extracción, comparación, redacción), mejorando la calidad y facilitando el control humano."
    }
  ],
  "why": {
    "ccao-01": [
      null,
      "Evaluar de forma intuitiva sin criterios predefinidos induce a calificar positivamente la elocuencia superficial mientras se ignoran omisiones críticas de información.",
      "Validar únicamente la sintaxis de un JSON verifica el formato del archivo pero no comprueba la exactitud factual, el tono ni la idoneidad comercial del contenido.",
      "Los modelos lingüísticos tienden a sobrestimar la calidad de sus propias salidas al autoevaluarse sin una rúbrica externa vinculante y supervisión humana."
    ],
    "ccao-02": [
      "Claude es un modelo de lenguaje y no realiza ajustes contables tácitos ni cálculos normativos independientes sin instrucciones explícitas.",
      null,
      "Pedir confirmación al modelo suele provocar que este justifique su respuesta previa con convicción aparente en lugar de detectar el error numérico de fondo.",
      "Alterar los registros contables primarios para hacerlos coincidir con una salida errónea de IA constituye una grave infracción ética y regulatoria."
    ],
    "ccao-03": [
      "Probar dos o tres casos improvisados carece de representatividad estadística y no detecta casos borde ni regresiones en la clasificación.",
      "La longitud y complejidad del texto no reflejan precisión operativa; de hecho, respuestas excesivamente extensas entorpecen la resolución rápida de tickets.",
      null,
      "El criterio estético subjetivo de un único usuario no mide la exactitud de la categorización técnica ni el cumplimiento de las políticas del servicio."
    ],
    "ccao-04": [
      "Pedir que conceda excepciones comerciales por empatía faculta al modelo a asumir compromisos económicos que la empresa no está dispuesta a solventar.",
      "Permitir que use conocimiento externo difuso para rellenar vacíos normativos provoca promesas falsas incompatibles con los términos del negocio.",
      "Aumentar la longitud de salida sin acotar las fuentes de verdad multiplica el riesgo de que Claude divague y elabore compromisos regulatorios inválidos.",
      null
    ],
    "ccao-05": [
      null,
      "La deriva de contexto es la pérdida de atención a instrucciones tempranas en hilos largos; agregar más documentos jurídicos satura la atención y empeora las alucinaciones.",
      "Citar un artículo inexistente no es una infracción de copyright, sino un error de generación sintética que no involucra licencias judiciales.",
      "Los saltos de línea mejoran la legibilidad del prompt; eliminarlos no tiene ningún impacto técnico positivo en la veracidad de las referencias legales."
    ],
    "ccao-06": [
      null,
      null,
      "Exigir una longitud mínima arbitraria induce respuestas artificialmente densas que dificultan la comprensión rápida de las normas laborales por parte del empleado.",
      "El exceso de jerga técnica entorpece la claridad comunicativa y puede generar confusión o desconfianza en asuntos delicados de relaciones laborales."
    ],
    "ccao-07": [
      "Amenazar al modelo o escribir en mayúsculas no ofrece orientación estilística concreta y resulta ineficaz para modular el registro lingüístico.",
      null,
      "Exigir a los clientes que sigan un formato rígido traslada la fricción al usuario externo y arruina la experiencia de servicio al cliente.",
      "Corregir manualmente sin actualizar el prompt perpetúa la ineficiencia operativa y no resuelve la causa raíz de la variabilidad del estilo."
    ],
    "ccao-08": [
      "La fluidez es una propiedad del modelo de lenguaje y no constituye prueba alguna de consulta a registros externos o bases oficiales.",
      "Los modelos avanzados pueden redactar textos falsos o incompletos con la misma elegancia gramatical que los textos verdaderos.",
      null,
      "Anthropic no penaliza la fluidez textual; es una característica intrínseca del modelo y no tiene relación con bloqueos de seguridad."
    ],
    "ccao-09": [
      "Observar el flujo de tokens no aporta valor de negocio ni asegura que el contenido de la propuesta cumpla los requisitos de la licitación.",
      "Reemplazar sustantivos de forma arbitraria consume tiempo innecesario y suele deteriorar la precisión técnica del documento comercial.",
      "Desactivar cortafuegos vulnera la seguridad informática y además Claude no navega libremente por la red corporativa del cliente.",
      null
    ],
    "ccao-10": [
      null,
      "La velocidad de lectura del revisor evalúa la agilidad del usuario humano, pero no demuestra si la severidad asignada por la IA fue correcta.",
      "Incorporar adjetivos aduladores no mejora la clasificación técnica y distorsiona el análisis objetivo del problema reportado por el cliente.",
      "Respuestas más largas y verbosas no implican mayor precisión diagnóstica; frecuentemente solo introducen ruido en la categorización."
    ],
    "ccao-11": [
      "Obligar a terceros externos a cambiar su formato de facturación resulta inviable operativamente y traslada un problema interno a los proveedores.",
      null,
      "Aceptar altas tasas de omisión en facturación genera pérdidas contables graves y desaprovecha la capacidad de optimizar el prompt.",
      "Evaluar solo casos fáciles falsea los indicadores de desempeño y oculta vulnerabilidades críticas antes del despliegue en producción."
    ],
    "ccao-12": [
      "Las rúbricas son documentos organizativos humanos y no tienen relación técnica directa con el precio ni con la facturación de tokens.",
      "Ninguna rúbrica exime del monitoreo periódico, ya que los procesos de negocio y las consultas evolucionan con el tiempo.",
      null,
      "Las rúbricas buscan calidad y exactitud conceptual, no limitar artificialmente la longitud natural que requiere explicar un tema."
    ],
    "ccao-13": [
      "Emitir desembolsos de forma 100 % autónoma sin supervisión humana expone a la compañía a fraudes y pagos indebidos por alucinaciones.",
      "Obligar a un médico a transcribir datos a mano desperdicia tiempo profesional de alto costo en tareas que la IA puede acelerar.",
      "Automatizar rechazos sin posibilidad de revisión humana vulnera los derechos del consumidor y la normativa del sector asegurador.",
      null
    ],
    "ccao-14": [
      null,
      "Enviar salidas de IA sin verificación humana previa puede transmitir compromisos erróneos o respuestas desatinadas en situaciones de conflicto.",
      "Transferir al cliente directamente a un chatbot no resuelve el caso y degrada drásticamente la percepción del servicio al cliente.",
      "Omitir deliberadamente los puntos de fricción genera frustración en el usuario y suele provocar la escalada de la queja a entes regulatorios."
    ],
    "ccao-15": [
      "Sustituir a los abogados corporativos por un modelo de lenguaje compromete legalmente a la empresa ante cláusulas lesivas no detectadas.",
      null,
      "Publicar contratos comerciales en foros públicos constituye una grave violación de los acuerdos de confidencialidad y secretos de negocio.",
      "Modificar unilateralmente cláusulas sustanciales sin asesoramiento legal genera vicios de consentimiento y riesgos procesales mayores."
    ],
    "ccao-16": [
      "Basar informes de inversión en rumores de internet vulnera las leyes del mercado de valores y arruina la reputación fiduciaria de la firma.",
      "Omitir factores de riesgo viola las obligaciones de divulgación legal y expone a la entidad a sanciones por parte de la comisión de valores.",
      null,
      "Priorizar la inmediatez sobre la verificación documental en informes fiduciarios genera riesgos regulatorios y de responsabilidad patrimonial."
    ],
    "ccao-17": [
      "El análisis automatizado de sentimiento en entrevistas orales penaliza a postulantes tímidos o en idiomas secundarios, generando discriminación injusta.",
      "Inferir categorías protegidas (edad, origen, género) para condicionar la selección laboral es ilegal y vulnera las normas laborales antidiscriminación.",
      "Compartir datos de postulantes con competidores viola la legislación de protección de datos (RGPD) y las leyes de libre competencia.",
      null
    ],
    "ccao-18": [
      null,
      null,
      "Un correo operativo sobre un cambio de sala es una tarea de bajo riesgo que no genera consecuencias legales ni financieras graves si tiene un desliz menor.",
      "Una lluvia de ideas interna sobre nombres de campañas es un ejercicio creativo inocuo donde no se comprometen derechos ni recursos críticos."
    ],
    "ccao-19": [
      null,
      "Tener cuentas aisladas sin directrices comunes genera dispersión en la imagen corporativa y dificulta el control de calidad de la marca.",
      "Omitir el contexto corporativo provoca respuestas genéricas desalineadas con la identidad de marca y los objetivos comerciales de la empresa.",
      "Prohibir ejemplos elimina una de las técnicas más potentes de alineación de estilo (few-shot) y aumenta la variabilidad indeseada."
    ],
    "ccao-20": [
      "Prohibir la tecnología de forma reactiva elimina los beneficios de productividad en lugar de educar al equipo en un uso riguroso y responsable.",
      null,
      "Un bot con aprobación automática por umbral monetario amplifica el riesgo financiero en lugar de garantizar la exactitud de los precios unitarios.",
      "Ocultar las listas de precios oficiales al personal de ventas impide el cotejo contra fuentes de verdad y propicia errores económicos graves."
    ],
    "ccao-21": [
      "La asistencia de IA mejora la productividad de los analistas pero no reemplaza el conocimiento técnico necesario para resolver incidentes complejos.",
      "Un modelo de lenguaje genera texto y sugerencias técnicas; no interviene en la estabilidad física de los servidores ni en el parchado del sistema operativo.",
      null,
      "Las acciones de remediación en producción requieren autorización y autenticación rigurosa para evitar caídas catastróficas del servicio."
    ],
    "ccao-22": [
      "Las cuentas individuales en la nube siguen enviando datos a servidores externos; ignorar las políticas de privacidad constituye una infracción disciplinaria y legal.",
      "Los modelos lingüísticos no poseen voluntad ética ni capacidad contractual de guardar secretos mediante una instrucción conversacional.",
      "Compartir enlaces públicos con datos salariales amplifica la exposición de información confidencial y agrava la brecha de seguridad.",
      null
    ],
    "ccao-23": [
      null,
      "Claude posee amplio conocimiento técnico sobre redes industriales; el rechazo obedece a salvaguardas éticas y de seguridad, no a ignorancia conceptual.",
      "La extensión de la consulta es mínima y no tiene relación con el límite de tokens de la ventana de contexto.",
      "Anthropic no comercializa ni autoriza excepciones para ataques a infraestructuras críticas mediante trámites notariales."
    ],
    "ccao-24": [
      "Anthropic no utiliza datos de planes corporativos para entrenar modelos públicos; la privacidad y el aislamiento de datos están garantizados por contrato.",
      null,
      "Los acuerdos de procesamiento de datos corporativos prohíben la cesión no autorizada de información a instituciones académicas u otros terceros.",
      "La política de no entrenamiento en cuentas empresariales aplica universalmente a todos los datos sin distinción del idioma utilizado."
    ],
    "ccao-25": [
      "Presentar una IA como asesor legal o financiero certificado viola los marcos normativos bancarios y de protección al consumidor financiero.",
      "Las inversiones conllevan riesgos de mercado y ninguna tecnología puede garantizar rentabilidades futuras sin incurrir en fraude.",
      null,
      "Ocultar los riesgos asociados a productos financieros vulnera las directrices de transparencia y los códigos de conducta del sector financiero."
    ],
    "ccao-26": [
      null,
      null,
      "Comparar costes de software para una decisión de compras es una actividad empresarial perfectamente legítima y respaldada.",
      "Traducir manuales de seguridad ocupacional apoya la prevención de riesgos y representa un caso de uso ordinario y positivo."
    ],
    "ccao-27": [
      "Delegar el ajuste farmacológico en un modelo de lenguaje sin supervisión médica pone en riesgo la vida de los pacientes y viola la ley sanitaria.",
      "Ocultar el uso de IA al comité ético quebranta las políticas de transparencia institucional y elude los controles indispensables de seguridad clínica.",
      "La calidad visual y los colores corporativos no certifican la exactitud médica ni la idoneidad terapéutica de las recomendaciones para pacientes.",
      null
    ],
    "ccao-28": [
      null,
      "La sobrecarga del ancho de banda es un problema de red de telecomunicaciones que no guarda relación con el sesgo cognitivo de sobreconfianza.",
      "Las decisiones de contratación de personal forman parte de la gestión de talento y no definen el concepto de sobreconfianza en las respuestas del modelo.",
      "La reutilización de contraseñas es una mala práctica de ciberseguridad, no un fenómeno de complacencia frente a las salidas de la IA."
    ],
    "ccao-29": [
      "Fomentar el uso de cuentas gratuitas agrava el riesgo, ya que esas versiones de consumo no cuentan con las protecciones de datos de planes de empresa.",
      null,
      "Exigir una traducción previa a un idioma específico no aporta seguridad y entorpece innecesariamente los flujos técnicos del proyecto.",
      "Eliminar historiales sin trazabilidad impide auditar la procedencia del trabajo y verificar el cumplimiento de las normas de propiedad intelectual."
    ],
    "ccao-30": [
      "Las extensiones de navegador no oficiales representan un riesgo grave de seguridad y no suplen las garantías contractuales del RGPD.",
      "Trasladar la responsabilidad legal exclusivamente a los trabajadores es nulo de pleno derecho bajo la normativa de protección de datos europea.",
      null,
      "La legislación de protección de datos opera de manera permanente las 24 horas del año, sin excepciones por días festivos o fines de semana."
    ],
    "ccao-31": [
      "Una instrucción abierta de una sola frase genera salidas impredecibles con profundidad variable que rara vez satisfacen a un comité de dirección.",
      "Mezclar datos e instrucciones sin estructura confunde la atención del modelo y propicia la omisión de acuerdos clave de la reunión.",
      "Una lista de adjetivos abstractos no proporciona pautas operativas sobre qué secciones o decisiones deben extraerse de la minuta.",
      null
    ],
    "ccao-32": [
      null,
      "Las etiquetas XML son texto plano que interpreta el modelo; no realizan compilación binaria ni alteran la tasa de transferencia de red.",
      "El navegador no requiere etiquetas XML para cambiar al modo de pantalla completa; es un estándar de estructuración de prompts, no de CSS/HTML.",
      "El modelo de lenguaje procesa texto en contexto y no crea bases de datos SQL relacionales a partir de marcas XML en el prompt."
    ],
    "ccao-33": [
      "El uso de mayúsculas no aporta claridad técnica ni ejemplos concretos sobre cómo debe estructurarse el comunicado de prensa.",
      null,
      "Fomentar la creatividad abierta en comunicados corporativos genera textos extravagantes que chocan con la sobriedad exigida por la dirección.",
      "Imitar estilos literarios decimonónicos introduce expresiones anacrónicas que perjudican la legibilidad y la profesionalidad del comunicado."
    ],
    "ccao-34": [
      "Autorizar al modelo a inventar fechas cuando falten datos perpetúa el error y genera calendarios de trabajo irreales en el proyecto.",
      "Aumentar el límite de tokens permite respuestas más largas pero no corrige la propensión a inventar datos no presentes en el correo.",
      null,
      "Eliminar el correo de origen suprime el contexto de trabajo y hace que el cronograma carezca de relación con el proyecto en curso."
    ],
    "ccao-35": [
      null,
      null,
      "Omitir pautas de extensión suele dar lugar a respuestas farragosas y dispersas que consumen tiempo excesivo de lectura a los directivos.",
      "Introducir emociones artificiosas resta rigor a los informes técnicos y desvirtúa la imparcialidad del análisis empresarial."
    ],
    "ccao-36": [
      "Claude razona a partir del texto y sus pesos internos; no establece conexiones externas secretas con agencias gubernamentales de defensa.",
      "Los modelos de lenguaje poseen naturaleza probabilística; pedir razonamiento paso a paso no elimina la variabilidad natural del texto.",
      "La formulación del prompt no modifica las cuotas de almacenamiento de la suscripción, que están reguladas por el plan contratado.",
      null
    ],
    "ccao-37": [
      null,
      "Repetir de forma obsesiva una frase degrada la coherencia del prompt y consume tokens de contexto de manera innecesaria e ineficiente.",
      "El modelo procesa lenguaje natural; codificar instrucciones en binario o hexadecimal dificulta la interpretación y provoca errores.",
      "Los modelos avanzados pueden procesar decenas de miles de palabras y respetar restricciones si estas se estructuran y ubican adecuadamente."
    ],
    "ccao-38": [
      "Emplear un lenguaje infantil resulta irrespetuoso en un entorno corporativo y devalúa la seriedad del análisis financiero presentado.",
      null,
      "Saturar el informe de siglas crípticas impide que los directivos comprendan la viabilidad del proyecto y bloquea la toma de decisiones.",
      "Asumir conocimientos de ingeniería en perfiles de finanzas provoca desinformación y evaluaciones erróneas sobre el presupuesto del proyecto."
    ],
    "ccao-39": [
      "Subir manuales en cada chat individual genera pérdidas de tiempo, consumo redundante de tokens y riesgos de usar versiones obsoletas.",
      "Crear una plataforma propia con la API requiere desarrollo de software y mantenimiento continuo, resultando desproporcionado e innecesario.",
      null,
      "Los modelos avanzados de Claude operan como servicios en la nube de Anthropic y no se descargan para ejecución local sin conexión."
    ],
    "ccao-40": [
      "Los `Artifacts` no son mecanismos de cifrado restrictivo; su propósito es mejorar la visualización y edición en la interfaz de usuario.",
      "La generación de un `Artifact` no altera el ancho de banda físico de la conexión de telecomunicaciones del usuario.",
      "Un `Artifact` es una herramienta de visualización de software y no sustituye la firma legal ni los trámites notariales de una propuesta.",
      null
    ],
    "ccao-41": [
      null,
      "Crear un proyecto e invitar a directivos para una duda de vocabulario puntual genera burocracia innecesaria y desordena el espacio de trabajo.",
      "Contratar desarrolladores para consultar un término léxico es un gasto injustificado frente a la inmediatez de la interfaz web existente.",
      "Aprovisionar infraestructura en la nube para una consulta lingüística puntual constituye un desperdicio de recursos técnicos y financieros."
    ],
    "ccao-42": [
      null,
      null,
      "Un mensaje de confirmación de dos palabras debe mantenerse en el flujo conversacional habitual; crear un Artifact para ello resulta innecesario.",
      "Una aclaración de una sola línea no requiere un panel lateral dedicado de visualización y encaja perfectamente en el cuerpo del chat."
    ],
    "ccao-43": [
      "Las cuentas personales carecen de administración centralizada, impiden aplicar políticas de retención y comprometen la seguridad corporativa.",
      null,
      "Gestionar licencias individuales mediante reembolsos no ofrece consola unificada, ni SSO, ni garantías contractuales de protección de datos de equipo.",
      "Compartir una única cuenta entre decenas de empleados vulnera los términos de servicio, anula la trazabilidad y debilita la seguridad de accesos."
    ],
    "ccao-44": [
      "Las instrucciones son configuradas libremente por los administradores del proyecto de la empresa; no son un campo exclusivo de Anthropic.",
      "Confundir ambos elementos desordena el proyecto: mezclar políticas de tono con manuales de producto perjudica la precisión del modelo.",
      null,
      "Ninguno de los dos módulos gestiona pagos ni claves; su propósito es estructurar el comportamiento y el conocimiento del asistente."
    ],
    "ccao-45": [
      "El fenómeno de pérdida de foco en un chat es una propiedad de la atención del modelo en la nube y no guarda relación con virus locales.",
      "No existe ningún bloqueo de cuenta; la sesión simplemente ha acumulado demasiada información previa dispersa en la ventana de contexto.",
      "Reiterar el mensaje en el mismo hilo largo agrava la saturación de tokens y no ayuda al modelo a recuperar las directrices olvidadas.",
      null
    ],
    "ccao-46": [
      null,
      "Claude procesa documentos en formato PDF con alta precisión; el error no es de formato, sino de contenido contradictorio en los archivos cargados.",
      "El número de páginas por documento es irrelevante; lo que genera contradicciones es la discordancia en los datos normativos que contienen.",
      "Redactar preguntas en verso no otorga jerarquía documental y entorpece la comunicación profesional en la plataforma."
    ],
    "ccao-47": [
      "La plataforma no sanciona ni cancela cuentas por solicitar análisis detallados de múltiples competidores en el chat.",
      null,
      "Las menciones comerciales en análisis competitivos no activan congelamientos automáticos por infracción de copyright.",
      "El corte abrupto es un límite ordinario de longitud de generación por turno y no implica pérdidas de datos ni caídas de red."
    ],
    "ccao-48": [
      "Agregar enlaces a foros externos introduce más ruido e incrementa la probabilidad de que el modelo cite coberturas no vigentes.",
      "Los números y porcentajes son consustanciales a las pólizas de seguros; prohibirlos imposibilita el trabajo operativo del equipo.",
      null,
      "Borrar los documentos priva a Claude de su base de conocimiento (ground truth), obligándolo a recurrir a conocimiento general y especular."
    ],
    "ccao-49": [
      "Anthropic gestiona sus límites técnicos de archivo de forma directa en su plataforma sin intermediación de organismos internacionales.",
      "Cambiar la extensión no convierte un video binario en texto legible; el archivo seguirá siendo incompatible y provocará error.",
      "Subir cientos de fragmentos binarios bloquea la interfaz web y no permite al modelo procesar el contenido audiovisual eficientemente.",
      null
    ],
    "ccao-50": [
      null,
      "Eliminar la cuenta destruye el historial, los proyectos y las configuraciones de la empresa de forma totalmente innecesaria.",
      "Las instrucciones personalizadas de perfil son permanentes y no tienen fecha de caducidad automática los fines de semana.",
      "Las instrucciones están asociadas al perfil en la nube del usuario, por lo que cambiar de dispositivo no elimina la configuración de formato."
    ],
    "ccao-51": [
      "Anthropic no aplica multas financieras por longitud de prompts; la facturación se rige por el consumo de tokens según el plan contratado.",
      null,
      "Combinar fuentes de información diversas es una práctica habitual en tareas de análisis y no vulnera los términos de servicio.",
      "Los navegadores modernos gestionan flujos de texto sin inconvenientes; el cuello de botella es la capacidad cognitiva del modelo en un solo turno."
    ],
    "ccao-52": [
      "Redactar modificaciones antes de extraer y comprender las cláusulas de origen invierte la lógica analítica y propicia errores jurídicos.",
      "Generar poemas o traducciones ornamentales desvía el flujo de trabajo y no aporta ningún valor al análisis de riesgos del contrato.",
      null,
      "Firmar el contrato antes de analizar los riesgos compromete legalmente a la empresa y hace inútil cualquier auditoría posterior."
    ],
    "ccao-53": [
      "Revisar salidas intermedias es una buena práctica de ingeniería de prompts de los usuarios, no un programa de fidelización comercial con descuentos.",
      "El conocimiento del dominio de negocio por parte del revisor sigue siendo indispensable para juzgar si la salida intermedia es correcta.",
      "Cada paso de la cadena requiere procesamiento computacional independiente; las revisiones humanas no anulan el tiempo de inferencia del modelo.",
      null
    ],
    "ccao-54": [
      null,
      "La fase de pulido de estilo mejora la redacción pero no repara una estructura de contenidos desordenada o carente de lógica narrativa.",
      "Abandonar el proyecto ante una falla de estructura en una fase intermedia es prematuro; basta con ajustar las directrices del paso fallido.",
      "Agregar transcripciones inconexas en el Paso 1 introduce ruido y no soluciona el problema de estructuración del Paso 2."
    ],
    "ccao-55": [
      "Los modelos de Anthropic utilizan la misma infraestructura de procesamiento estándar sin módulos cuánticos secretos para prompts extensos.",
      null,
      "Diseñar una cadena eficaz exige comprender profundamente el flujo de negocio para definir qué entradas y salidas requiere cada etapa.",
      "Ningún prompt único garantiza ausencia de alucinaciones; de hecho, concentrar múltiples metas en una sola instrucción eleva el riesgo de error."
    ]
  },
  "glossary": [
    {
      "term": "Claude Projects",
      "cat": "Superficies Claude",
      "d": 5,
      "def": "Espacios colaborativos de trabajo en Claude que permiten almacenar hasta cientos de miles de palabras en documentación de referencia (Project Knowledge) e instrucciones personalizadas compartidas entre miembros del equipo."
    },
    {
      "term": "Artifacts",
      "cat": "Superficies Claude",
      "d": 5,
      "def": "Ventana lateral interactiva en la interfaz de Claude donde se generan y visualizan contenidos sustanciales y reutilizables, como documentos de texto extensos, diagramas SVG, componentes web y código, facilitando su iteración y versionado."
    },
    {
      "term": "Acceptable Use Policy (AUP)",
      "cat": "Gobernanza",
      "d": 3,
      "def": "Política formal de Anthropic que prohíbe el uso de sus modelos para actividades nocivas, incluyendo desarrollo de armas, desinformación electoral, ciberataques contra infraestructura crítica y asesoría legal o médica vinculante sin supervisión calificada."
    },
    {
      "term": "Hallucination (Alucinación)",
      "cat": "Validación",
      "d": 1,
      "def": "Generación de afirmaciones, hechos, cifras o citas falsas presentadas con alta elocuencia y aparente certeza técnica por parte del modelo lingüístico, mitigable mediante anclaje en documentos y validación humana."
    },
    {
      "term": "Prompt Chaining",
      "cat": "Prompt Chaining",
      "d": 7,
      "def": "Patrón metodológico que descompone una tarea empresarial compleja en una secuencia de pasos modulares, donde la salida validada de un prompt sirve como entrada contextual del siguiente."
    },
    {
      "term": "PII Redaction (Anonimización de PII)",
      "cat": "Gobernanza",
      "d": 3,
      "def": "Proceso previo de identificar y sustituir datos personales identificables (nombres, números de identificación, direcciones, datos bancarios) por marcadores de posición o datos sintéticos antes de enviarlos al modelo."
    },
    {
      "term": "Human-in-the-Loop (HITL)",
      "cat": "Workflows",
      "d": 2,
      "def": "Diseño operativo donde un profesional humano capacitado debe revisar, validar y autorizar activamente las salidas o recomendaciones generadas por la IA antes de su publicación o ejecución en el negocio."
    },
    {
      "term": "Context Drift (Deriva de Contexto)",
      "cat": "Troubleshooting",
      "d": 6,
      "def": "Degradación en la adherencia a instrucciones iniciales que ocurre en sesiones de chat prolongadas, provocada por la acumulación de mensajes intermedios que diluyen la atención del modelo."
    },
    {
      "term": "Project Knowledge Base",
      "cat": "Superficies Claude",
      "d": 5,
      "def": "Repositorio de documentos internos (PDFs, hojas de cálculo, manuales de texto) cargados en un `Claude Project` para que el modelo responda anclado en la información corporativa específica de la organización."
    },
    {
      "term": "Custom Instructions",
      "cat": "Troubleshooting",
      "d": 6,
      "def": "Directrices globales o por proyecto que definen el rol, tono, estilo de redacción y preferencias de formato que Claude debe adoptar de manera predeterminada en todas sus interacciones."
    },
    {
      "term": "Golden Evaluation Dataset",
      "cat": "Validación",
      "d": 1,
      "def": "Conjunto curado y estandarizado de preguntas y casos reales con respuestas de referencia verificadas por expertos humanos, utilizado para medir y comparar objetivamente la efectividad de distintas versiones de prompts."
    },
    {
      "term": "Rubric Evaluation (Rúbricas de Evaluación)",
      "cat": "Validación",
      "d": 1,
      "def": "Marco estructurado de criterios explícitos (exactitud factual, tono, cumplimiento de restricciones, formato) definido con anterioridad a las pruebas para calificar objetivamente la calidad de las respuestas generadas."
    },
    {
      "term": "Few-Shot Prompting",
      "cat": "Prompting",
      "d": 4,
      "def": "Técnica de ingeniería de prompts consistente en incluir dos o más ejemplos representativos de pares entrada-salida dentro del prompt para guiar con alta precisión el formato, estilo y profundidad deseados."
    },
    {
      "term": "Zero-Shot Prompting",
      "cat": "Prompting",
      "d": 4,
      "def": "Solicitud directa al modelo sin proporcionar ejemplos previos de la tarea, confiando en las instrucciones explícitas y el conocimiento intrínseco del modelo para producir el resultado esperado."
    },
    {
      "term": "Claude Team & Enterprise",
      "cat": "Superficies Claude",
      "d": 5,
      "def": "Planes empresariales de Anthropic que ofrecen consola de administración centralizada, autenticación única (SSO), facturación consolidada, mayores límites de uso y garantías contractuales de no entrenamiento sobre los datos del cliente."
    },
    {
      "term": "Claude Pro",
      "cat": "Superficies Claude",
      "d": 5,
      "def": "Suscripción individual de pago orientada a usuarios profesionales que otorga límites de uso ampliados frente al plan gratuito y acceso prioritario a los modelos más avanzados de la familia Claude."
    },
    {
      "term": "Context Window (Ventana de Contexto)",
      "cat": "Troubleshooting",
      "d": 6,
      "def": "Capacidad máxima en tokens que Claude puede procesar simultáneamente en una interacción (hasta 200.000 tokens en modelos Claude 3/3.5), abarcando historial de conversación, documentos y prompt actual."
    },
    {
      "term": "Grounding (Anclaje Factual)",
      "cat": "Validación",
      "d": 1,
      "def": "Práctica de fundamentar las respuestas del modelo estrictamente en documentos de referencia suministrados, instruyéndolo a citar extractos y a manifestar explícitamente cuándo la información no consta en el texto."
    },
    {
      "term": "Delimitadores XML",
      "cat": "Prompting",
      "d": 4,
      "def": "Etiquetas de marcado tipo XML (como `<contexto>`, `<instrucciones>`, `<ejemplo>`) empleadas para estructurar los componentes del prompt, facilitando que Claude distinga directrices operativas de datos brutos."
    },
    {
      "term": "Guardrails de Salida",
      "cat": "Gobernanza",
      "d": 3,
      "def": "Reglas y restricciones negativas programadas en el prompt (o verificadas en post-procesamiento) diseñadas para impedir que el modelo emita contenidos lesivos, consejos no autorizados o datos protegidos."
    },
    {
      "term": "Over-reliance (Sobreconfianza)",
      "cat": "Gobernanza",
      "d": 3,
      "def": "Riesgo cognitivo y operativo en el que los colaboradores de una empresa aceptan de forma acrítica las respuestas de la IA sin comprobar su veracidad, deslumbrados por la fluidez y coherencia del texto."
    },
    {
      "term": "Handoff Operativo",
      "cat": "Workflows",
      "d": 2,
      "def": "Punto de transferencia estructurado en un flujo de trabajo donde el borrador o triaje generado por Claude pasa a manos de un empleado para su personalización, verificación de datos y firma definitiva."
    },
    {
      "term": "System Prompt",
      "cat": "Prompting",
      "d": 4,
      "def": "Conjunto de directrices primarias que configuran la personalidad, rol profesional, límites éticos y reglas permanentes de conducta del modelo a lo largo de toda una sesión o proyecto."
    },
    {
      "term": "Data Retention Policy",
      "cat": "Gobernanza",
      "d": 3,
      "def": "Política que estipula el periodo de tiempo durante el cual los proveedores de IA almacenan registros de consultas antes de su eliminación segura, aspecto crítico para el cumplimiento del RGPD y estándares SOC 2."
    },
    {
      "term": "Temperature & Determinism",
      "cat": "Troubleshooting",
      "d": 6,
      "def": "Naturaleza estocástica inherente a los modelos de lenguaje que genera variabilidad natural entre respuestas sucesivas; en tareas de negocio se controla mediante prompts fuertemente acotados y rúbricas fijas."
    }
  ]
};
})(window);
