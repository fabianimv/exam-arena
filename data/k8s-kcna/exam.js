/* =========================================================================
   data/k8s-kcna/exam.js — CNCF · Kubernetes & Cloud Native Associate (KCNA)
   50 escenarios reales de Kubernetes, Contenedores OCI, Observabilidad y GitOps
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["k8s-kcna"] = {
  "id": "k8s-kcna",
  "appId": "k8s-kcna",
  "provider": "CNCF / Kubernetes",
  "badge": "CNCF · KCNA",
  "icon": "☸️",
  "color": "#326ce5",
  "featured": false,
  "title": "CNCF · Kubernetes & Cloud Native Associate (KCNA)",
  "subtitle": "Arquitectura K8s, Scheduling, Contenedores OCI, Observabilidad, GitOps y Service Mesh",
  "passingScore": 75,
  "domains": {
    "1": "Fundamentos de Kubernetes (46 %)",
    "2": "Orquestación de Contenedores (22 %)",
    "3": "Arquitectura Cloud Native (16 %)",
    "4": "Observabilidad Cloud Native (8 %)",
    "5": "Entrega de Aplicaciones y GitOps (8 %)"
  },
  "shortDomains": {
    "1": "K8s Core",
    "2": "Orquestación",
    "3": "Cloud Native",
    "4": "Observabilidad",
    "5": "GitOps & CI/CD"
  },
  "topics": [
    {
      "id": "kcna-t-1-1",
      "d": 1,
      "title": "1.1 · Arquitectura de Kubernetes: Control Plane y Nodos Worker",
      "html": "\n<h4>El cerebro del clúster: Arquitectura del Control Plane</h4>\n<p>El <b>Control Plane</b> gestiona el estado global del clúster de Kubernetes, detecta y responde a eventos (como crear réplicas cuando un pod falla) y toma decisiones de agendamiento. Sus componentes clave son:</p>\n<table class=\"keytable\">\n<tr><th>Componente</th><th>Rol y Función Principal</th><th>Interacción Clave</th></tr>\n<tr><td><b><code>kube-apiserver</code></b></td><td>Puerta de entrada y API REST central del clúster; valida y configura datos para pods, servicios y controladores.</td><td>Es el <b>único</b> componente que se comunica directamente con <code>etcd</code>. Todos los demás componentes dialogan a través de él.</td></tr>\n<tr><td><b><code>etcd</code></b></td><td>Almacén clave-valor distribuido, consistente y de alta disponibilidad basado en el algoritmo de consenso <b>Raft</b>.</td><td>Guarda todo el estado del clúster. Requiere un número impar de nodos (3 o 5) para mantener quórum <code>(N/2)+1</code>.</td></tr>\n<tr><td><b><code>kube-scheduler</code></b></td><td>Asigna pods recién creados sin nodo asignado a nodos viables y saludables.</td><td>Evalúa requisitos mediante dos fases: <b>Filtrado (Predicates)</b> para descartar nodos no viables y <b>Priorización (Priorities/Scoring)</b> para puntuar los restantes.</td></tr>\n<tr><td><b><code>kube-controller-manager</code></b></td><td>Ejecuta los bucles de control continuos que reconcilian el estado actual con el estado deseado.</td><td>Agrupa múltiples controladores: Node Controller, Deployment Controller, ReplicaSet Controller, ServiceAccount Controller.</td></tr>\n<tr><td><b><code>cloud-controller-manager</code></b></td><td>Integra la lógica específica del proveedor cloud (AWS, Azure, GCP) separándola del núcleo de Kubernetes.</td><td>Gestiona balanceadores de carga externos (<code>LoadBalancer</code>), rutas de red cloud y ciclos de vida de instancias/nodos.</td></tr>\n</table>\n\n<h4>Ejecución en los Nodos Worker</h4>\n<p>Los nodos worker ejecutan las cargas de trabajo reales del usuario en contenedores agrupados en Pods:</p>\n<table class=\"keytable\">\n<tr><th>Componente</th><th>Rol y Función Principal</th></tr>\n<tr><td><b><code>kubelet</code></b></td><td>Agente principal que corre en cada nodo. Recibe especificaciones de Pods (<code>PodSpecs</code>) desde el apiserver y asegura que los contenedores estén corriendo y saludables interactuando con el runtime vía <b>CRI</b>.</td></tr>\n<tr><td><b><code>kube-proxy</code></b></td><td>Proxy de red que mantiene las reglas de reenvío de tráfico en cada nodo (usando <code>iptables</code> o <code>IPVS</code>), implementando la abstracción de <b>Service</b> y balanceo interno.</td></tr>\n<tr><td><b>Container Runtime (CRI)</b></td><td>Software encargado de descargar imágenes y ejecutar contenedores (por ejemplo, <code>containerd</code> o <code>CRI-O</code>), implementando la especificación OCI (Open Container Initiative).</td></tr>\n</table>\n<div class=\"tip\"><b>Clave para KCNA:</b> Ningún componente ni usuario escribe jamás en <code>etcd</code> de forma directa excepto <code>kube-apiserver</code>. Si el apiserver está caído, los pods existentes continúan ejecutándose en los nodos, pero no se pueden realizar cambios declarativos ni consultar el clúster.</div>\n"
    },
    {
      "id": "kcna-t-1-2",
      "d": 1,
      "title": "1.2 · Primitivas y Cargas de Trabajo Core de Kubernetes",
      "html": "\n<h4>Jerarquía de Objetos y Cargas de Trabajo</h4>\n<p>Kubernetes proporciona abstracciones declarativas diseñadas para diferentes patrones de computación:</p>\n<table class=\"keytable\">\n<tr><th>Objeto</th><th>Propósito y Patrón de Uso</th><th>Comportamiento ante Fallo</th></tr>\n<tr><td><b><code>Pod</code></b></td><td>Unidad atómica mínima de despliegue. Agrupa uno o más contenedores que comparten almacenamiento, red (misma dirección IP y <code>localhost</code>) e IPC.</td><td>Es efímero. Si muere o el nodo falla, el pod no se recrea por sí solo; requiere un controlador.</td></tr>\n<tr><td><b><code>ReplicaSet</code></b></td><td>Mantiene un número estable y garantizado de réplicas de pods idénticos en ejecución en todo momento mediante selectores.</td><td>Crea nuevos pods o elimina sobrantes para coincidir exactamente con el campo <code>spec.replicas</code>.</td></tr>\n<tr><td><b><code>Deployment</code></b></td><td>Controlador declarativo de nivel superior que gestiona ReplicaSets. Soporta <b>Rolling Updates</b>, pausar despliegues y <b>Rollbacks</b> automáticos.</td><td>Ideal para aplicaciones web y APIs sin estado (<i>stateless</i>). Nunca se crean ReplicaSets directamente.</td></tr>\n<tr><td><b><code>StatefulSet</code></b></td><td>Para aplicaciones con estado (bases de datos, Kafka) que necesitan identidades ordinales estables (<code>app-0</code>, <code>app-1</code>), DNS predecible y almacenamiento persistente dedicado (<code>volumeClaimTemplates</code>).</td><td>Orden estricto de despliegue, escalado y terminación secuencial (de mayor a menor índice).</td></tr>\n<tr><td><b><code>DaemonSet</code></b></td><td>Garantiza que una copia del pod se ejecute en <b>todos</b> (o un subconjunto específico) de los nodos del clúster.</td><td>Ideal para agentes de infraestructura: recolectores de logs (Fluentd), métricas (node-exporter) o proxies CNI.</td></tr>\n<tr><td><b><code>Job</code> / <code>CronJob</code></b></td><td><code>Job</code> ejecuta pods hasta que un número específico de tareas finaliza con éxito (batch). <code>CronJob</code> añade programación basada en tiempo (formato crontab).</td><td>Termina el pod en <code>Completed</code> sin reiniciarlo indefinidamente (<code>restartPolicy: OnFailure</code> o <code>Never</code>).</td></tr>\n</table>\n\n<h4>Desacoplamiento de Configuración: ConfigMaps y Secrets</h4>\n<p>Para respetar los principios de la <i>12-Factor App</i>, el código y la configuración deben estar estrictamente separados:</p>\n<ul>\n<li><b><code>ConfigMap</code>:</b> Almacena configuraciones en texto plano (variables de entorno, archivos de configuración o argumentos de CLI) desacoplados de la imagen del contenedor.</li>\n<li><b><code>Secret</code>:</b> Almacena datos confidenciales (contraseñas, tokens OAuth, llaves SSH). Por defecto se almacenan codificados en base64 en la API y pueden cifrarse en reposo (<i>encryption at rest</i>) en <code>etcd</code>.</li>\n<li><b><code>Namespace</code>:</b> Partición lógica de un clúster físico para aislar entornos (dev, staging, prod), equipos o proyectos, aplicando límites de recursos (<code>ResourceQuota</code>) y permisos con RBAC.</li>\n</ul>\n<div class=\"tip\"><b>Pregunta típica KCNA:</b> Un <code>Namespace</code> no proporciona aislamiento de red ni de kernel por sí solo. Para aislar el tráfico entre namespaces se requieren <code>NetworkPolicies</code>.</div>\n"
    },
    {
      "id": "kcna-t-2-1",
      "d": 2,
      "title": "2.1 · Ciclo de Vida de Pods, Scheduling y Gestión de Recursos",
      "html": "\n<h4>Requests vs. Limits y Clases de Calidad de Servicio (QoS)</h4>\n<p>El planificador (<code>kube-scheduler</code>) y el kernel de Linux (vía cgroups) gestionan los recursos de CPU y memoria de los contenedores:</p>\n<table class=\"keytable\">\n<tr><th>Directiva</th><th>Uso Principal</th><th>Efecto de Exceder el Límite</th></tr>\n<tr><td><b><code>resources.requests</code></b></td><td>Utilizado exclusivamente por <code>kube-scheduler</code> para calcular si un nodo tiene capacidad suficiente para albergar el pod.</td><td>Garantiza un piso mínimo reservado para el contenedor en el nodo.</td></tr>\n<tr><td><b><code>resources.limits</code></b></td><td>Límite superior rígido enforcing por el kernel mediante cgroups.</td><td>En <b>CPU</b> causa estrangulamiento (<i>CFS Throttling</i>); en <b>Memoria</b> provoca terminación inmediata por el kernel: <code>OOMKilled (Exit Code 137)</code>.</td></tr>\n</table>\n\n<h4>Clases de QoS (Quality of Service) y Prioridad de Desalojo (Eviction)</h4>\n<ol>\n<li><b><code>Guaranteed</code>:</b> Tanto CPU como memoria tienen <code>requests</code> y <code>limits</code> definidos y son <b>exactamente iguales</b> para todos los contenedores. Son los últimos en ser desalojados ante saturación del nodo.</li>\n<li><b><code>Burstable</code>:</b> Al menos un contenedor tiene <code>requests</code> o <code>limits</code> configurados pero no cumplen la condición estricta de Guaranteed.</li>\n<li><b><code>BestEffort</code>:</b> Ningún contenedor define ni requests ni limits. Son los primeros en ser eliminados cuando el nodo sufre presión de memoria o disco.</li>\n</ol>\n\n<h4>Sondas de Salud del Kubelet (Health Probes)</h4>\n<table class=\"keytable\">\n<tr><th>Sonda</th><th>Comportamiento ante Fallo</th><th>Caso de Uso Recomendado</th></tr>\n<tr><td><b><code>startupProbe</code></b></td><td>Inhabilita temporalmente a liveness y readiness mientras la aplicación arranca. Si supera los reintentos, el kubelet reinicia el pod.</td><td>Servicios heredados o pesados que tardan minutos en arrancar, evitando bucles de reinicio prematuros.</td></tr>\n<tr><td><b><code>readinessProbe</code></b></td><td>Si falla, el Pod <b>no se reinicia</b>, pero su IP es retirada inmediatamente de los Endpoints del Service.</td><td>Indica si el contenedor está listo para recibir tráfico de usuarios (p. ej. calentamiento de caché o conexión a DB establecida).</td></tr>\n<tr><td><b><code>livenessProbe</code></b></td><td>Si falla consecutivamente, el <code>kubelet</code> mata el contenedor y aplica la <code>restartPolicy</code> del Pod.</td><td>Detectar deadlocks o fallos internos irrecuperables donde el proceso sigue vivo pero no puede progresar.</td></tr>\n</table>\n<div class=\"tip\"><b>Regla de oro:</b> Nunca uses una <code>livenessProbe</code> para verificar una base de datos externa. Si la DB sufre latencia, Kubernetes matará todos tus pods a la vez, causando una tormenta de reinicios en cascada.</div>\n"
    },
    {
      "id": "kcna-t-2-2",
      "d": 2,
      "title": "2.2 · Redes y Almacenamiento Persistente en Kubernetes",
      "html": "\n<h4>El Modelo de Redes de Kubernetes y el CNI</h4>\n<p>Kubernetes impone un modelo de red plano y fundamental: <b>cada Pod tiene su propia dirección IP única y enrutable</b> dentro del clúster. Dos pods pueden comunicarse directamente por IP sin necesidad de NAT. Esta abstracción la implementa un plugin <b>CNI (Container Network Interface)</b> como Calico, Flannel o Cilium.</p>\n\n<h4>Tipos de Servicios (<code>Service</code>)</h4>\n<table class=\"keytable\">\n<tr><th>Tipo</th><th>Alcance y Funcionamiento</th><th>Caso de Uso Principal</th></tr>\n<tr><td><b><code>ClusterIP</code></b> (Por defecto)</td><td>Asigna una IP virtual interna estable accesible únicamente desde dentro del clúster.</td><td>Comunicación interna entre microservicios (backend, base de datos, colas).</td></tr>\n<tr><td><b><code>NodePort</code></b></td><td>Abre un puerto estático (rango por defecto <code>30000-32767</code>) en la IP de <b>cada nodo worker</b> del clúster.</td><td>Acceso externo básico de desarrollo o integración con balanceadores preexistentes.</td></tr>\n<tr><td><b><code>LoadBalancer</code></b></td><td>Crea un <code>NodePort</code> internamente e interactúa con el proveedor cloud para provisionar un balanceador de carga público/privado con IP externa.</td><td>Exposición directa de servicios críticos hacia Internet en entornos de nube gestionada.</td></tr>\n<tr><td><b><code>ExternalName</code></b></td><td>Mapea el servicio a un nombre DNS externo (registro CNAME), sin balanceo ni IPs proxy.</td><td>Conectar pods con servicios externos (p. ej. RDS, CloudSQL o APIs de terceros).</td></tr>\n</table>\n\n<h4>Seguridad de Red con NetworkPolicy</h4>\n<p>Por defecto, la red de Kubernetes es <b>no aislada</b>: cualquier pod puede comunicarse con cualquier otro pod en cualquier namespace. Un recurso <b><code>NetworkPolicy</code></b> permite definir reglas de filtrado en capa 3 y 4 (IP, puertos, selectores de Pod y Namespace). Al aplicar una política a un pod, este entra en modo <i>default-deny</i> para el tráfico no explícitamente autorizado.</p>\n\n<h4>Almacenamiento Persistente: CSI, PV, PVC y StorageClass</h4>\n<ul>\n<li><b><code>CSI (Container Storage Interface)</code>:</b> Estándar abierto que permite a proveedores de almacenamiento integrar sus drivers en Kubernetes sin tocar el código fuente del proyecto.</li>\n<li><b><code>StorageClass</code>:</b> Define el aprovisionador de almacenamiento y parámetros para aprovisionamiento dinámico de volúmenes.</li>\n<li><b><code>PersistentVolume (PV)</code>:</b> Recurso de almacenamiento en el clúster aprovisionado por un administrador o dinámicamente mediante StorageClass.</li>\n<li><b><code>PersistentVolumeClaim (PVC)</code>:</b> Solicitud de almacenamiento realizada por un desarrollador especificando tamaño y modo de acceso:\n  <ul>\n    <li><b><code>ReadWriteOnce (RWO)</code>:</b> Montable en modo lectura/escritura por un único nodo a la vez (discos de bloques).</li>\n    <li><b><code>ReadOnlyMany (ROX)</code>:</b> Montable en modo solo lectura por múltiples nodos concurrentemente.</li>\n    <li><b><code>ReadWriteMany (RWX)</code>:</b> Montable en modo lectura/escritura por múltiples nodos simultáneamente (sistemas de archivos compartidos como NFS o CephFS).</li>\n  </ul>\n</li>\n</ul>\n"
    },
    {
      "id": "kcna-t-3-1",
      "d": 3,
      "title": "3.1 · Principios de Arquitectura Cloud Native y Ecosistema CNCF",
      "html": "\n<h4>¿Qué es Cloud Native según la CNCF?</h4>\n<p>La <b>Cloud Native Computing Foundation (CNCF)</b> define las tecnologías <i>Cloud Native</i> como aquellas que capacitan a las organizaciones para construir y ejecutar aplicaciones escalables en entornos modernos y dinámicos como nubes públicas, privadas e híbridas. Sus características esenciales son:</p>\n<ul>\n<li><b>Contenedores:</b> Empaquetado autocontenido y reproducible de la aplicación con todas sus dependencias.</li>\n<li><b>Mallas de Servicios (Service Meshes):</b> Gestión inteligente y segura de la comunicación entre servicios.</li>\n<li><b>Microservicios:</b> Servicios pequeños, autónomos y desacoplados que se despliegan de forma independiente.</li>\n<li><b>Infraestructura Inmutable:</b> Los servidores y contenedores nunca se modifican en producción; se destruyen y reemplazan por nuevas versiones.</li>\n<li><b>APIs Declarativas:</b> El operador declara el estado deseado y el sistema automatizado se encarga de reconciliar el estado real.</li>\n</ul>\n\n<h4>Etapas de Madurez de los Proyectos en CNCF</h4>\n<p>La CNCF organiza sus proyectos en tres niveles de graduación según su adopción comunitaria, gobernanza y madurez en producción:</p>\n<table class=\"keytable\">\n<tr><th>Nivel</th><th>Criterios de Madurez</th><th>Ejemplos de Proyectos</th></tr>\n<tr><td><b>Sandbox</b></td><td>Proyectos en fase inicial, experimentales o de investigación con potencial prometedor. Requisitos de adopción mínimos.</td><td>KEDA (anteriormente), OpenFeature, Telepresence.</td></tr>\n<tr><td><b>Incubating</b></td><td>Proyectos con uso demostrado en producción, gobernanza activa y sólida base de colaboradores.</td><td>Cilium (previo a graduación), gRPC, Dapr, Notary.</td></tr>\n<tr><td><b>Graduated</b></td><td>Máximo nivel de madurez técnica, seguridad auditada, amplia adopción en entornos de misión crítica y gobernanza neutral demostrada.</td><td><b>Kubernetes, Prometheus, Envoy, Helm, containerd, CoreDNS, Jaeger, Fluentd, OpenTelemetry</b>.</td></tr>\n</table>\n<div class=\"tip\"><b>Consejo de examen KCNA:</b> Identifica con claridad qué proyectos son <i>Graduated</i>. Preguntas habituales consultan si proyectos fundamentales como Kubernetes, Prometheus, Envoy, Helm o containerd han alcanzado el estado de graduación oficial de la CNCF.</div>\n"
    },
    {
      "id": "kcna-t-3-2",
      "d": 3,
      "title": "3.2 · Service Mesh, Seguridad, RBAC y Gateway API",
      "html": "\n<h4>Service Mesh: Desacoplando la Red de la Lógica de Aplicación</h4>\n<p>Un <b>Service Mesh</b> es una capa de infraestructura dedicada que facilita la comunicación de servicio a servicio (tráfico <i>Este-Oeste</i>) de manera segura, rápida y observable. Se divide en dos planos:</p>\n<ul>\n<li><b>Data Plane (Plano de Datos):</b> Proxies sidecar ligeros (comúnmente <b>Envoy</b>) inyectados junto a cada contenedor de aplicación. Interceptan todo el tráfico de entrada y salida sin alterar el código de la app.</li>\n<li><b>Control Plane (Plano de Control):</b> Gestiona y distribuye la configuración a los proxies (p. ej. <b>Istio</b> o <b>Linkerd</b>), emitiendo certificados mTLS y políticas de enrutamiento.</li>\n</ul>\n<table class=\"keytable\">\n<tr><th>Capacidad</th><th>Beneficio Inmediato</th></tr>\n<tr><td><b>Mutual TLS (mTLS)</b></td><td>Cifrado punto a punto en tránsito y autenticación criptográfica mutua de identidades de servicio sin cambiar código.</td></tr>\n<tr><td><b>Resiliencia de Tráfico</b></td><td>Reintentos automáticos, timeouts, circuit breaking y limitación de tasa (rate limiting).</td></tr>\n<tr><td><b>Observabilidad Homogénea</b></td><td>Generación uniforme de métricas doradas (RPS, latencia, errores) y trazas distribuidas para todos los microservicios.</td></tr>\n</table>\n\n<h4>Control de Acceso Basado en Roles (RBAC)</h4>\n<p>En Kubernetes, toda solicitud se autentica y luego se autoriza mediante <b>RBAC</b>. Los componentes son:</p>\n<ul>\n<li><b><code>Role</code> vs. <code>ClusterRole</code>:</b> Un <code>Role</code> define permisos dentro de un <b>namespace específico</b> (ej. leer pods en <i>default</i>). Un <code>ClusterRole</code> define permisos a nivel de todo el clúster (ej. listar nodos, o leer pods en todos los namespaces).</li>\n<li><b><code>RoleBinding</code> vs. <code>ClusterRoleBinding</code>:</b> Vincula un Role o ClusterRole a un sujeto (usuario, grupo o <code>ServiceAccount</code>).</li>\n<li><b><code>ServiceAccount</code>:</b> Proporciona una identidad gestionada para los procesos que corren dentro de los Pods para interactuar con el <code>kube-apiserver</code>.</li>\n</ul>\n\n<h4>Evolución: De Ingress a la Gateway API</h4>\n<p>El recurso <code>Ingress</code> tradicional sufría de falta de expresividad y sobrecarga de anotaciones propietarias. La <b>Gateway API</b> es su sucesora moderna, orientada a roles:</p>\n<ul>\n<li><b><code>GatewayClass</code>:</b> Gestionado por el administrador de infraestructura (define el controlador).</li>\n<li><b><code>Gateway</code>:</b> Gestionado por el operador de clúster/red (define puertos y certificados TLS).</li>\n<li><b><code>HTTPRoute</code> / <code>GRPCRoute</code>:</b> Gestionado por el desarrollador de la aplicación (define reglas de reenvío y filtros).</li>\n</ul>\n"
    },
    {
      "id": "kcna-t-4-1",
      "d": 4,
      "title": "4.1 · Los Tres Pilares de la Observabilidad Cloud Native",
      "html": "\n<h4>Métricas, Logs y Trazas Distribuidas</h4>\n<p>La <b>Observabilidad</b> es la capacidad de inferir los estados internos de un sistema complejo a partir del análisis de sus salidas externas de telemetría:</p>\n<table class=\"keytable\">\n<tr><th>Pilar</th><th>Naturaleza del Dato</th><th>Propósito Principal</th><th>Tecnologías CNCF</th></tr>\n<tr><td><b>Métricas</b></td><td>Valores numéricos medidos a intervalos regulares (contadores, medidores, histogramas). Muy eficientes en almacenamiento.</td><td>Detección de anomalías, alertas en tiempo real, tableros de rendimiento y cálculo de SLOs.</td><td><b>Prometheus</b>, Thanos, Cortex.</td></tr>\n<tr><td><b>Logs</b></td><td>Registros textuales discretos con timestamp generados por eventos o errores de la aplicación.</td><td>Investigación forense profunda de fallos y auditoría de comportamiento específico.</td><td><b>Fluentd</b>, Fluent Bit, Grafana Loki.</td></tr>\n<tr><td><b>Trazas (Tracing)</b></td><td>Representación del ciclo de vida completo de una solicitud que atraviesa múltiples microservicios (compuesta por <i>Spans</i> con contexto temporal y causal).</td><td>Identificación precisa de cuellos de botella de latencia y dependencias lentas o rotas.</td><td><b>Jaeger</b>, <b>OpenTelemetry</b>.</td></tr>\n</table>\n\n<h4>OpenTelemetry (OTel): El Estándar Unificado</h4>\n<p><b>OpenTelemetry</b> es un proyecto <i>Graduated</i> de la CNCF nacido de la fusión de <i>OpenTracing</i> y <i>OpenCensus</i>. Proporciona una colección unificada de APIs, SDKs y herramientas para generar y exportar métricas, logs y trazas de forma agnóstica respecto al backend de observabilidad.</p>\n<ul>\n<li><b>OTel Collector:</b> Proxy de telemetría de alto rendimiento que recibe datos mediante el protocolo <b>OTLP</b> (OpenTelemetry Protocol), los procesa (filtra, enriquece, muestrea) y los exporta a backends como Prometheus, Jaeger o Datadog.</li>\n</ul>\n<div class=\"tip\"><b>Clave KCNA:</b> OpenTelemetry estandariza la instrumentación y recolección de telemetría, pero no proporciona almacenamiento ni visualización propios. Para almacenar y consultar métricas y trazas se conecta a backends como Prometheus o Jaeger.</div>\n"
    },
    {
      "id": "kcna-t-4-2",
      "d": 4,
      "title": "4.2 · Monitoreo de Clúster, Telemetría con Prometheus y Alertmanager",
      "html": "\n<h4>Arquitectura de Prometheus</h4>\n<p><b>Prometheus</b> es el estándar <i>de facto</i> para la monitorización de sistemas nativos de la nube. Sus características estructurales son:</p>\n<ul>\n<li><b>Modelo Pull (Scraping):</b> Prometheus sondea activamente los endpoints HTTP (habitualmente <code>/metrics</code>) de los destinos a intervalos configurados, en lugar de esperar que los servicios envíen los datos.</li>\n<li><b>Time-Series Database (TSDB):</b> Almacena los datos en disco como series temporales compuestas por un identificador de métrica, etiquetas (<i>key-value labels</i>) y valores flotantes con timestamp.</li>\n<li><b>PromQL:</b> Potente lenguaje funcional de consulta para agregar, filtrar y calcular derivadas y tasas sobre las métricas (p. ej. <code>rate(http_requests_total[5m])</code>).</li>\n</ul>\n\n<h4>Componentes del Ecosistema de Monitoreo</h4>\n<table class=\"keytable\">\n<tr><th>Componente</th><th>Rol en la Plataforma</th></tr>\n<tr><td><b><code>cAdvisor</code></b></td><td>Daemon embebido directamente en el <code>kubelet</code> que recopila y expone métricas de uso de CPU, memoria, red y disco de los contenedores en ejecución en cada nodo.</td></tr>\n<tr><td><b><code>node-exporter</code></b></td><td>Agente que se despliega como <code>DaemonSet</code> para recolectar métricas a nivel del sistema operativo y hardware del host (kernel, CPU, swap, filesystem).</td></tr>\n<tr><td><b><code>metrics-server</code></b></td><td>Componente ligero en memoria que agrega métricas básicas de uso para la CLI (<code>kubectl top</code>) y para el autoescalado de pods (<b>HPA</b>). No persiste datos históricos.</td></tr>\n<tr><td><b><code>Alertmanager</code></b></td><td>Servicio que recibe alertas disparadas por las reglas de Prometheus, se encarga de deduplicarlas, agruparlas por servicio/severidad y enviarlas a receptores (Slack, PagerDuty, Email).</td></tr>\n</table>\n\n<h4>Conceptos SRE: SLI, SLO y Error Budgets</h4>\n<ul>\n<li><b>SLI (Service Level Indicator):</b> Métrica cuantitativa del servicio en tiempo real (ej. tasa de éxito de solicitudes HTTP).</li>\n<li><b>SLO (Service Level Objective):</b> Objetivo interno acordado para el SLI durante un periodo (ej. 99.9% de éxito en 30 días).</li>\n<li><b>Error Budget:</b> El margen permitido de fallo <code>(100% - SLO)</code>. Si el presupuesto se agota, se congelan los despliegues para priorizar la estabilidad.</li>\n</ul>\n"
    },
    {
      "id": "kcna-t-5-1",
      "d": 5,
      "title": "5.1 · Principios de GitOps y Despliegue Continuo Declarativo",
      "html": "\n<h4>¿Qué es GitOps?</h4>\n<p><b>GitOps</b> es un modelo operativo para aplicaciones nativas de la nube que utiliza <b>Git como la única fuente de verdad (Single Source of Truth)</b> para la infraestructura declarativa y las aplicaciones. La iniciativa <b>OpenGitOps</b> de la CNCF establece cuatro principios fundamentales:</p>\n<ol>\n<li><b>Declarativo:</b> Todo el estado del sistema deseado debe estar expresado de forma declarativa (manifiestos YAML, Kustomize, Helm).</li>\n<li><b>Versionado e Inmutable:</b> El estado deseado se almacena en Git, permitiendo auditoría completa, historial de cambios y capacidad instantánea de rollback.</li>\n<li><b>Obtenido Automáticamente (Pull):</b> Los agentes de software en el clúster obtienen activamente el estado deseado desde Git (modelo <i>Pull</i>), en lugar de que un pipeline de CI externo ejecute <code>kubectl apply</code> con credenciales administrativas (modelo <i>Push</i>).</li>\n<li><b>Reconciliación Continua:</b> El agente compara permanentemente el estado real del clúster con el estado en Git. Si detecta divergencia (<i>Drift</i>), reconcilia el sistema automáticamente (<i>Self-Healing</i>).</li>\n</ol>\n\n<h4>Modelo Push vs. Modelo Pull en Despliegue Continuo</h4>\n<table class=\"keytable\">\n<tr><th>Criterio</th><th>CI/CD Tradicional (Modelo Push)</th><th>GitOps (Modelo Pull - ArgoCD / Flux)</th></tr>\n<tr><td><b>Acceso al Clúster</b></td><td>El servidor de CI (Jenkins, GitHub Actions) debe tener credenciales de administrador (kubeconfig) del clúster, creando un riesgo de seguridad crítico.</td><td>El operador (<b>ArgoCD / Flux</b>) se ejecuta <b>dentro</b> del clúster y tira de Git solo con permisos de lectura. No se exponen credenciales fuera.</td></tr>\n<tr><td><b>Detección de Deriva (Drift)</b></td><td>Si alguien modifica un recurso manualmente con <code>kubectl edit</code>, el pipeline de CI no se entera hasta el próximo despliegue.</td><td>El operador detecta la alteración manual en cuestión de segundos y la sobrescribe para restaurar el estado de Git.</td></tr>\n<tr><td><b>Auditoría y Rollback</b></td><td>Los rollbacks requieren re-ejecutar pipelines complejos o scripts manuales.</td><td>Un rollback se realiza simplemente ejecutando <code>git revert</code> en el repositorio Git.</td></tr>\n</table>\n<div class=\"tip\"><b>Proyectos Graduados CNCF en GitOps:</b> Tanto <b>Argo CD</b> como <b>Flux</b> son proyectos <i>Graduated</i> de la CNCF que implementan el patrón GitOps en Kubernetes.</div>\n"
    },
    {
      "id": "kcna-t-5-2",
      "d": 5,
      "title": "5.2 · Empaquetado y Estrategias Modernas de Entrega de Aplicaciones",
      "html": "\n<h4>Gestión de Paquetes y Templating: Helm vs. Kustomize</h4>\n<p>La gestión de manifiestos complejos en múltiples entornos (dev, QA, prod) se aborda con dos herramientas principales en el ecosistema CNCF:</p>\n<table class=\"keytable\">\n<tr><th>Característica</th><th>Helm (El gestor de paquetes de K8s)</th><th>Kustomize (Personalización sin plantillas)</th></tr>\n<tr><td><b>Enfoque</b></td><td>Utiliza un motor de plantillas Go (<i>Go Templates</i>) y archivos <code>values.yaml</code> para generar manifiestos dinámicos.</td><td>Enfoque sin plantillas (<i>template-free</i>); utiliza capas base (<i>bases</i>) y sobreescrituras declarativas (<i>overlays</i>).</td></tr>\n<tr><td><b>Estructura</b></td><td>Agrupado en <b>Charts</b> con <code>Chart.yaml</code>, <code>templates/</code> y dependencias versionadas en repositorios OCI.</td><td>Utiliza un archivo <code>kustomization.yaml</code> que define parches y recursos. Integrado de forma nativa en <code>kubectl</code> (<code>kubectl apply -k</code>).</td></tr>\n<tr><td><b>Gestión de Versiones</b></td><td>Mantiene historial de <i>releases</i> en el clúster (almacenadas como Secrets), permitiendo <code>helm rollback</code>.</td><td>No mantiene estado interno en el clúster; delega el versionado puramente a Git.</td></tr>\n</table>\n\n<h4>Estrategias de Despliegue de Aplicaciones</h4>\n<table class=\"keytable\">\n<tr><th>Estrategia</th><th>Cómo Funciona</th><th>Ventajas y Desventajas</th></tr>\n<tr><td><b>Recreate</b></td><td>Destruye todas las réplicas existentes (v1) antes de crear las nuevas réplicas (v2).</td><td>Sencillo y sin problemas de concurrencia de versiones en DB, pero causa <b>tiempo de inactividad (downtime)</b>.</td></tr>\n<tr><td><b>Rolling Update</b></td><td>Reemplaza gradualmente pods v1 por pods v2 controlando <code>maxSurge</code> y <code>maxUnavailable</code>.</td><td>Estrategia por defecto de Kubernetes. Cero downtime, pero requiere que v1 y v2 coexistan y soporten el mismo esquema de datos.</td></tr>\n<tr><td><b>Blue/Green</b></td><td>Despliega el entorno nuevo completo (Green) en paralelo al actual (Blue). Cuando Green está validado, el Service o Ingress cambia el selector instantáneamente.</td><td>Cero downtime y rollback instantáneo conmutando el selector. Duplica el consumo de recursos de infraestructura durante el corte.</td></tr>\n<tr><td><b>Canary</b></td><td>Envía un pequeño porcentaje de tráfico real (p. ej. 5% o 10%) a la versión nueva (Canary) mientras el 90% sigue en v1. Si las métricas son óptimas, se promueve gradualmente.</td><td>Minimiza el radio de impacto de bugs ante usuarios reales. Requiere un Ingress Controller avanzado, Service Mesh o herramientas como <b>Argo Rollouts</b> o <b>Flagger</b>.</td></tr>\n</table>\n"
    }
  ],
  "questions": [
    {
      "id": "kcna-01",
      "d": 1,
      "t": "Arquitectura del Control Plane",
      "q": "Durante una auditoría de seguridad en la arquitectura de un clúster de Kubernetes, el equipo de ciberseguridad necesita identificar cuál es el único componente del Control Plane que expone la API REST pública, autentica y autoriza las peticiones y se comunica de manera directa y exclusiva con el almacén de datos persistente `etcd`. ¿Qué componente cumple esta función?",
      "o": [
        "`kube-scheduler`, ya que evalúa los requisitos de recursos de cómputo y calcula el nodo adecuado para los pods.",
        "`kube-controller-manager`, ya que centraliza los bucles de control continuos que reconcilian el estado deseado.",
        "`kube-apiserver`, ya que expone los endpoints REST, valida manifiestos y es el único cliente directo de `etcd`.",
        "`kubelet`, ya que reside en los nodos worker reportando la salud de los contenedores hacia el almacenamiento central."
      ],
      "a": 2,
      "e": "El `kube-apiserver` es la puerta de enlace central de Kubernetes. Es el único componente del clúster que interactúa directamente con `etcd`; todos los demás clientes (controladores, planificador, kubelet y usuarios mediante `kubectl`) se comunican obligatoriamente a través de su API REST."
    },
    {
      "id": "kcna-02",
      "d": 1,
      "t": "Almacén de Estado etcd",
      "q": "Un arquitecto de infraestructura está diseñando la topología de alta disponibilidad para el almacén de estado `etcd` en un clúster de Kubernetes de producción. ¿Por qué es fundamental desplegar un número impar de miembros (por ejemplo, 3 o 5 instancias) en el clúster de `etcd`?",
      "o": [
        "Para permitir que el algoritmo de consenso Raft determine la mayoría estricta `(N/2)+1` y tolere particiones de red sin sufrir split-brain.",
        "Para duplicar la velocidad de escritura secuencial mediante particionado hash y balanceo simétrico de transacciones entre nodos activos y pasivos.",
        "Para asegurar que el `kube-apiserver` pueda alternar certificados TLS independientes en cada zona de disponibilidad de la nube.",
        "Para evitar que la base de datos requiera compactación periódica de revisiones históricas en almacenamiento de bloques SSD."
      ],
      "a": 0,
      "e": "`etcd` utiliza el algoritmo de consenso distribuido Raft, que requiere una mayoría estricta (quórum) de `(N/2)+1` miembros para confirmar escrituras y elegir un líder. Un número impar maximiza la tolerancia a fallos: un clúster de 3 nodos tolera la pérdida de 1 nodo (quórum 2), mientras que 4 nodos también toleran solo 1 fallo (quórum 3) consumiendo recursos extra innecesarios."
    },
    {
      "id": "kcna-03",
      "d": 1,
      "t": "Agendamiento con kube-scheduler",
      "q": "Se ha desplegado un Pod de inferencia de machine learning que solicita 4 GPUs dedicadas y 32 GiB de memoria RAM. Al revisar el estado del despliegue, el Pod permanece en estado `Pending`. ¿Qué componente del Control Plane es el encargado de evaluar los filtros de viabilidad y puntuar los nodos para asignar este Pod?",
      "o": [
        "`kube-scheduler`, ya que filtra los nodos viables mediante predicates y puntúa los candidatos para seleccionar el nodo definitivo.",
        "`kube-controller-manager`, ya que supervisa que las réplicas solicitadas existan y crea nuevos nodos si la cuota no es suficiente.",
        "`kubelet`, ya que inspecciona los controladores de hardware en el sistema operativo del host antes de aceptar nuevas cargas de trabajo.",
        "`cloud-controller-manager`, ya que aprovisiona automáticamente instancias con GPU en la infraestructura del proveedor cloud."
      ],
      "a": 0,
      "e": "El `kube-scheduler` supervisa los pods recién creados que no tienen un nodo asignado (`nodeName` vacío). Ejecuta un proceso de dos pasos: primero el filtrado (Filtering/Predicates), donde descarta nodos que no cumplen los recursos o taints; y luego la priorización (Scoring/Priorities), donde asigna una puntuación a los nodos viables restantes para elegir el mejor."
    },
    {
      "id": "kcna-04",
      "d": 1,
      "t": "Bucle de Reconciliación",
      "q": "En el modelo operativo de Kubernetes, la configuración se expresa de forma declarativa. ¿Cuál es la responsabilidad principal del componente `kube-controller-manager` en relación con este paradigma declarativo?",
      "o": [
        "Compilar los manifiestos YAML en imágenes binarias para que el runtime de contenedores las ejecute en cada nodo worker sin necesidad de interpretar texto.",
        "Ejecutar bucles continuos de control que comparan el estado actual del clúster con el estado deseado y aplican correcciones continuas.",
        "Validar criptográficamente los tokens JWT emitidos para los usuarios administradores que ejecutan comandos administrativos frecuentes con `kubectl`.",
        "Establecer túneles de red overlay mediante encapsulación VXLAN entre todos los nodos que integran el clúster."
      ],
      "a": 1,
      "e": "El `kube-controller-manager` ejecuta bucles de control continuos (reconciliation loops). En cada iteración, compara el estado deseado declarado en los objetos de Kubernetes con el estado real observado en el clúster y realiza las acciones necesarias (como crear o destruir pods) para que ambos coincidan."
    },
    {
      "id": "kcna-05",
      "d": 1,
      "t": "Cloud Controller Manager",
      "q": "Una empresa migra sus clústeres de Kubernetes auto-gestionados hacia una infraestructura de nube pública. ¿Cuál es el propósito del binario `cloud-controller-manager` introducido en la arquitectura moderna de Kubernetes?",
      "o": [
        "Reemplazar completamente al `kubelet` en los nodos para permitir la ejecución de microservicios sin necesidad de sistema operativo.",
        "Monitorear la saturación de memoria de los pods y enviar alertas automáticas hacia los tableros de facturación mensual y analítica del proveedor.",
        "Gestionar el aprovisionamiento de clústeres elásticos mediante plantillas de Terraform incrustadas en el firmware de los hipervisores bare-metal.",
        "Desacoplar la lógica dependiente del proveedor cloud (balanceadores de carga, rutas e instancias de nodos) del código central de Kubernetes."
      ],
      "a": 3,
      "e": "El `cloud-controller-manager` permite que los proveedores de nube (AWS, Azure, Google Cloud, OpenStack, etc.) integren sus plataformas con Kubernetes sin acoplar código propietario dentro del repositorio principal de Kubernetes. Gestiona controladores específicos de nodos, rutas de red y balanceadores de carga de tipo `LoadBalancer`."
    },
    {
      "id": "kcna-06",
      "d": 1,
      "t": "Agente Kubelet de Nodo",
      "q": "En cada nodo worker de un clúster de Kubernetes se ejecuta un proceso esencial que actúa como el agente principal del sistema. ¿Cuál es la responsabilidad principal del `kubelet` en la operación cotidiana del nodo?",
      "o": [
        "Distribuir el tráfico HTTP balanceando las peticiones externas entre los pods según la política de round-robin definida en las tablas de enrutamiento.",
        "Consultar directamente la base de datos `etcd` para sincronizar los cambios de red y aplicar políticas de aislamiento perimetral.",
        "Recibir especificaciones de Pods (`PodSpecs`) del `kube-apiserver`, interactuar con el runtime vía CRI y vigilar su estado de salud.",
        "Ejecutar el proceso de compilación de código fuente cuando un desarrollador sube un nuevo commit a un repositorio Git conectado."
      ],
      "a": 2,
      "e": "El `kubelet` es el agente primario de nodo. Recibe `PodSpecs` (principalmente del `kube-apiserver`, o de archivos locales en static pods), interactúa con el runtime de contenedores mediante la interfaz CRI para crear y detener contenedores, y ejecuta sondas de salud (liveness, readiness, startup) reportando el estado del nodo y los pods al apiserver."
    },
    {
      "id": "kcna-07",
      "d": 1,
      "t": "Enrutamiento con kube-proxy",
      "q": "Un desarrollador consulta cómo las peticiones dirigidas a una IP virtual de tipo `ClusterIP` llegan a los pods de backend correctos dentro de un nodo worker. ¿Qué componente de red implementa esta abstracción programando reglas de reenvío en el sistema operativo del nodo?",
      "o": [
        "`kube-proxy`, ya que programa reglas en `iptables` o `IPVS` en cada nodo para reenviar el tráfico dirigido a Services hacia los Pods.",
        "`CoreDNS`, ya que traduce paquetes TCP a nivel de capa de enlace físico mediante tablas de conmutación ARP en los switches de red física del centro de datos.",
        "`containerd`, ya que encapsula las tramas Ethernet en encabezados TLS antes de transmitirlas a la tarjeta de interfaz física.",
        "`kube-scheduler`, ya que actualiza las tablas de rutas estáticas del kernel cada vez que un nuevo contenedor cambia de estado."
      ],
      "a": 0,
      "e": "`kube-proxy` es el componente de red que se ejecuta en cada nodo worker. Monitorea los objetos `Service` y `Endpoints` (o `EndpointSlices`) a través del apiserver y programa reglas de filtrado y reenvío NAT en el kernel de Linux (usando modos `iptables` o `IPVS`) para traducir las IPs virtuales de los servicios a las IPs reales de los pods."
    },
    {
      "id": "kcna-08",
      "d": 1,
      "t": "Alta Disponibilidad en Control Plane",
      "q": "¿Cuáles DOS componentes del Control Plane de Kubernetes utilizan un mecanismo de elección de líder (Leader Election) basado en Leases para operar en modo activo-pasivo y evitar que múltiples instancias tomen decisiones contradictorias simultáneamente? (Selecciona dos)",
      "o": [
        "`kube-scheduler`",
        "`kube-apiserver`",
        "`kube-controller-manager`",
        "`kubelet`"
      ],
      "a": [
        0,
        2
      ],
      "e": "Tanto `kube-scheduler` como `kube-controller-manager` implementan elección de líder (usando objetos `Lease` en Kubernetes). Aunque se desplieguen múltiples réplicas en nodos de control plane para alta disponibilidad, solo una instancia actúa como líder activa para evitar que dos planificadores asignen el mismo pod o que dos controladores dupliquen réplicas. En cambio, `kube-apiserver` es activo-activo sin líder (todas las instancias atienden tráfico en paralelo tras un balanceador)."
    },
    {
      "id": "kcna-09",
      "d": 1,
      "t": "CRI y Runtime de Contenedores",
      "q": "Históricamente, Kubernetes contenía código específico para comunicarse con Docker. Para desacoplar la orquestación del motor de ejecución, la CNCF promovió una especificación estándar basada en gRPC. ¿Cómo se denomina esta interfaz que permite usar runtimes como `containerd` o `CRI-O`?",
      "o": [
        "`CNI (Container Network Interface)`, que gestiona las direcciones IP y el enrutamiento de paquetes entre contenedores en el clúster a través de túneles de red.",
        "`CSI (Container Storage Interface)`, que define la interoperabilidad para adjuntar y montar volúmenes persistentes.",
        "`OCI (Open Container Initiative)`, que define exclusivamente el formato de archivo tarball de los manifiestos Helm.",
        "`CRI (Container Runtime Interface)`, que estandariza la comunicación gRPC entre el `kubelet` y los runtimes de contenedores."
      ],
      "a": 3,
      "e": "La `CRI` (Container Runtime Interface) es la API estándar de gRPC introducida en Kubernetes para que el `kubelet` pueda interactuar con cualquier runtime de contenedores compatible (como `containerd` o `CRI-O`) sin necesidad de incorporar código específico de cada motor dentro del proyecto de Kubernetes."
    },
    {
      "id": "kcna-10",
      "d": 1,
      "t": "Anatomía del Pod",
      "q": "Un desarrollador configura un Pod multi-contenedor que contiene una aplicación web y un contenedor auxiliar (sidecar) para procesar logs. ¿Cuál de las siguientes afirmaciones describe con precisión el entorno compartido por los contenedores dentro de este mismo Pod?",
      "o": [
        "Cada contenedor recibe una dirección IP pública independiente y se comunican entre sí exclusivamente a través del Ingress del clúster mediante certificados TLS.",
        "Comparten el mismo Network namespace (misma dirección IP y comunicación por `localhost`), así como volúmenes de almacenamiento montados.",
        "Se ejecutan en nodos worker físicamente distintos para garantizar alta disponibilidad ante la pérdida imprevista de un servidor.",
        "Comparten obligatoriamente el mismo sistema de archivos raíz de solo lectura y el mismo espacio de usuarios sin aislamiento de procesos."
      ],
      "a": 1,
      "e": "Un `Pod` es la unidad mínima en Kubernetes. Todos los contenedores que forman parte de un mismo Pod se agendan siempre en el mismo nodo worker y comparten namespaces del kernel de Linux: Network namespace (comparten la misma IP del pod y pueden comunicarse por `localhost` en distintos puertos), IPC namespace, y pueden compartir volúmenes declarados en el pod."
    },
    {
      "id": "kcna-11",
      "d": 1,
      "t": "Deployments y ReplicaSets",
      "q": "Un equipo de ingeniería de software necesita actualizar una aplicación web en producción sin tiempo de inactividad, con la capacidad de realizar rollbacks automáticos si aumentan los errores. ¿Por qué se utiliza un objeto `Deployment` en lugar de crear directamente un `ReplicaSet`?",
      "o": [
        "Porque los ReplicaSets no admiten pods con más de un contenedor ni permiten montar secretos inyectados desde variables de entorno.",
        "Porque los Deployments ejecutan automáticamente análisis de vulnerabilidades estáticas de código antes de iniciar el ciclo de vida del pod.",
        "Porque el `Deployment` gestiona de forma declarativa el ciclo de vida de múltiples ReplicaSets, permitiendo rolling updates y rollbacks.",
        "Porque el `ReplicaSet` ha sido marcado como obsoleto en la versión 1.25 de Kubernetes y ya no puede ser procesado por el API Server."
      ],
      "a": 2,
      "e": "Un `Deployment` es un controlador declarativo de nivel superior que gestiona `ReplicaSets`. Al realizar una actualización de versión (`RollingUpdate`), el Deployment crea un nuevo ReplicaSet con la nueva imagen y va escalando gradualmente el nuevo mientras desescala el anterior. Si algo falla, permite revertir (`kubectl rollout undo`) al ReplicaSet anterior de forma instantánea."
    },
    {
      "id": "kcna-12",
      "d": 1,
      "t": "Controlador DaemonSet",
      "q": "Se necesita recolectar los archivos de log de cada servidor físico del clúster enviándolos a un clúster central de Elasticsearch. Para ello, se requiere que exactamente una réplica del agente Fluentd se ejecute en cada uno de los nodos worker del clúster. ¿Qué primitiva de carga de trabajo es la idónea para este requerimiento?",
      "o": [
        "`DaemonSet`, ya que garantiza que una copia del Pod se ejecute automáticamente en todos los nodos (o los seleccionados) del clúster.",
        "`StatefulSet`, ya que asigna una dirección IP estática fija y un volumen persistente exclusivo numerado para cada réplica en ejecución.",
        "`Job`, ya que ejecuta los contenedores en segundo plano hasta que se alcanza el código de finalización exitosa en la tarea batch.",
        "`Deployment`, ya que recalcula aleatoriamente la ubicación de los agentes en cada reinicio del servicio para evitar cuellos de botella."
      ],
      "a": 0,
      "e": "Un `DaemonSet` asegura que todos (o una selección basada en node selectors/taints) los nodos ejecuten una copia de un Pod. A medida que se agregan nuevos nodos al clúster, el DaemonSet crea automáticamente el Pod en ellos; cuando los nodos se destruyen, los pods son eliminados. Casos típicos: recolección de logs (Fluentd), métricas de nodo (node-exporter) o agentes CNI."
    },
    {
      "id": "kcna-13",
      "d": 1,
      "t": "Controlador StatefulSet",
      "q": "Un equipo de datos necesita desplegar un clúster de Apache ZooKeeper en Kubernetes. La aplicación requiere que cada instancia mantenga un nombre de host DNS estable y predecible a lo largo de reinicios (`zk-0`, `zk-1`, `zk-2`) y conserve su propio almacenamiento de disco persistente dedicado. ¿Qué recurso de Kubernetes deben emplear?",
      "o": [
        "`DaemonSet`, ya que proporciona nombres de host derivados del nombre del nodo worker sobre el cual se ha iniciado el contenedor.",
        "`Deployment`, ya que permite asociar un único volumen compartido NFS de lectura concurrente para todas las réplicas activas del clúster sin colisiones de bloqueo.",
        "`CronJob`, ya que reinicia periódicamente las instancias asignando nuevos identificadores correlativos al terminar el tiempo de ejecución.",
        "`StatefulSet`, ya que ofrece identidades de red ordinales estables, terminación ordenada y volúmenes dedicados vía `volumeClaimTemplates`."
      ],
      "a": 3,
      "e": "Un `StatefulSet` es el controlador diseñado para cargas con estado que necesitan identidades de red fijas y predecibles (índices ordinales `nombre-0`, `nombre-1`), orden secuencial de despliegue y actualización, y almacenamiento persistente dedicado para cada réplica mediante `volumeClaimTemplates` (el volumen de `zk-0` no se reasigna a `zk-1` al reiniciar)."
    },
    {
      "id": "kcna-14",
      "d": 1,
      "t": "Cargas Batch: Job vs CronJob",
      "q": "Una aplicación financiera debe ejecutar una conciliación contable todas las noches a las 02:00 AM UTC. El proceso dura aproximadamente 20 minutos, procesa transacciones pendientes y debe terminar liberando los recursos de cómputo tras finalizar exitosamente. ¿Qué recurso es el más apropiado para modelar este requerimiento?",
      "o": [
        "`Deployment`, configurando `replicas: 1` y una sonda `livenessProbe` que mate el contenedor al terminar la conciliación de datos para forzar la liberación de memoria.",
        "`CronJob`, ya que crea objetos `Job` de forma recurrente según una expresión temporal tipo crontab, terminando al completarse la tarea.",
        "`DaemonSet`, ya que asegura que la tarea financiera se ejecute en todos los nodos worker sin interferir con las cargas de producción.",
        "`StatefulSet`, ya que garantiza que el proceso conserve el mismo identificador de red durante la ejecución de los cálculos contables."
      ],
      "a": 1,
      "e": "Un `CronJob` gestiona la ejecución periódica basada en tiempo de tareas batch. En cada intervalo especificado por la sintaxis de cron (ej. `0 2 * * *`), crea un objeto `Job`. El `Job` crea uno o más pods que se ejecutan hasta que completan su trabajo con éxito (`Completed`) y luego se detienen, sin consumir CPU/memoria residual."
    },
    {
      "id": "kcna-15",
      "d": 1,
      "t": "Aislamiento con Namespaces",
      "q": "Una organización comparte un clúster de Kubernetes grande entre tres equipos de desarrollo distintos. Quieren organizar los recursos de forma lógica para evitar colisiones de nombres y aplicar límites de cuotas de cómputo (`ResourceQuota`). ¿Qué primitiva de Kubernetes proporciona este tipo de partición lógica?",
      "o": [
        "`NodeSelector`, ya que particiona físicamente los núcleos de CPU del host asignándolos a los diferentes equipos mediante hipervisor.",
        "`ClusterRole`, ya que divide el tráfico de red de los microservicios en diferentes subredes virtuales con cifrado de hardware.",
        "`Namespace`, ya que ofrece una partición lógica dentro del clúster para aislar nombres, cuotas y políticas de control de acceso.",
        "`StorageClass`, ya que segmenta los discos de almacenamiento de los contenedores garantizando aislamiento criptográfico por usuario."
      ],
      "a": 2,
      "e": "Los `Namespaces` proporcionan un mecanismo para aislar grupos de recursos dentro de un mismo clúster físico. Permiten que diferentes equipos o proyectos utilicen los mismos nombres de recursos sin colisiones, apliquen políticas de autorización mediante RBAC y establezcan límites de consumo de CPU, memoria y recuento de objetos mediante `ResourceQuota`."
    },
    {
      "id": "kcna-16",
      "d": 1,
      "t": "Resolución DNS entre Namespaces",
      "q": "El pod de frontend ubicado en el namespace `production` necesita invocar mediante HTTP la API de facturación expuesta por el servicio `billing-svc` que reside en el namespace `finance`. Asumiendo el dominio por defecto del clúster (`cluster.local`), ¿cuál es el FQDN (Fully Qualified Domain Name) correcto para conectarse?",
      "o": [
        "`billing-svc.production.pod.cluster.local`, ya que las consultas entre pods siempre resuelven dentro del namespace originario.",
        "`finance.billing-svc.k8s.internal`, ya que los nombres de los servicios siguen el formato de subdominio invertido del proveedor cloud.",
        "`http://billing-svc:8080/finance`, ya que Kubernetes utiliza rutas relativas en el protocolo HTTP en lugar de registros DNS estándar.",
        "`billing-svc.finance.svc.cluster.local`, siguiendo el formato estándar de nombres DNS de servicios entre diferentes namespaces."
      ],
      "a": 3,
      "e": "CoreDNS en Kubernetes resuelve los servicios utilizando la convención estándar FQDN: `<nombre-servicio>.<namespace>.svc.<dominio-cluster>`. En este caso, para acceder al servicio `billing-svc` en el namespace `finance`, el nombre completo resoluble desde cualquier namespace es `billing-svc.finance.svc.cluster.local`."
    },
    {
      "id": "kcna-17",
      "d": 1,
      "t": "Inyección de Configuración",
      "q": "¿Cuáles DOS objetos de Kubernetes se utilizan habitualmente para inyectar configuración desacoplada dentro de los contenedores (a través de variables de entorno o archivos montados como volúmenes), diferenciándose principalmente por la sensibilidad de la información almacenada? (Selecciona dos)",
      "o": [
        "`PersistentVolumeClaim`",
        "`ConfigMap`",
        "`NetworkPolicy`",
        "`Secret`"
      ],
      "a": [
        1,
        3
      ],
      "e": "`ConfigMap` y `Secret` son los dos objetos centrales de Kubernetes para separar la configuración del código de la aplicación. `ConfigMap` almacena pares clave-valor y archivos en texto plano para configuraciones no confidenciales, mientras que `Secret` almacena datos confidenciales (claves API, contraseñas, certificados) codificados en base64 en la API y con soporte de cifrado en reposo en `etcd`."
    },
    {
      "id": "kcna-18",
      "d": 1,
      "t": "Static Pods",
      "q": "Al inicializar un clúster de Kubernetes con `kubeadm`, los componentes esenciales del Control Plane (como `kube-apiserver`, `etcd` y `kube-scheduler`) se inician como Pods. Sin embargo, no hay un scheduler activo en ese momento para agendarlos. ¿Cómo se ejecutan estos componentes en el nodo de control?",
      "o": [
        "Como `Static Pods`, gestionados directamente por el `kubelet` al leer manifiestos YAML en el directorio local `/etc/kubernetes/manifests`.",
        "Como contenedores de Docker Swarm que se ejecutan en una máquina virtual temporal hasta que el clúster alcanza el estado Ready y el scheduler toma el control del sistema.",
        "Mediante un script de inicio en `/etc/rc.local` que simula las respuestas del apiserver mediante un archivo JSON estático en memoria.",
        "A través de un controlador externo de Terraform que envía comandos SSH para compilar el código de Kubernetes en el nodo."
      ],
      "a": 0,
      "e": "Los `Static Pods` son gestionados directamente por el daemon `kubelet` en un nodo específico, sin intervención del `kube-apiserver` ni del `kube-scheduler`. El kubelet supervisa periódicamente un directorio local del host (por defecto `/etc/kubernetes/manifests`) y crea los pods allí declarados. `kubeadm` utiliza este mecanismo para el bootstrap del propio Control Plane."
    },
    {
      "id": "kcna-19",
      "d": 1,
      "t": "Contenedores Init (initContainers)",
      "q": "Una aplicación web necesita verificar que el servidor de base de datos esté aceptando conexiones y descargar un archivo de configuración desde un bucket S3 antes de iniciar su proceso principal. ¿Qué primitiva de Kubernetes permite ejecutar estas tareas preparatorias de forma secuencial y bloqueante?",
      "o": [
        "`Ephemeral Containers`, ya que se ejecutan temporalmente para recolectar volcados de memoria cuando un pod entra en CrashLoopBackOff.",
        "`Sidecar Containers`, ya que se inician simultáneamente con la app principal y corren indefinidamente compartiendo el mismo ciclo de vida.",
        "`initContainers`, ya que se ejecutan secuencialmente antes de arrancar los contenedores de aplicación y deben terminar con éxito.",
        "`Pause Containers`, ya que retienen el tráfico de red hasta que el usuario ejecuta manualmente una señal de confirmación por la API."
      ],
      "a": 2,
      "e": "Los `initContainers` son contenedores especializados que se ejecutan antes de que inicien los contenedores principales de la aplicación en un Pod. Siempre se ejecutan de forma secuencial: cada uno debe finalizar exitosamente (`exit code 0`) antes de que comience el siguiente. Si un initContainer falla, Kubernetes reinicia el pod hasta que se complete satisfactoriamente."
    },
    {
      "id": "kcna-20",
      "d": 1,
      "t": "Fases del Ciclo de Vida del Pod",
      "q": "Al consultar un Pod con el comando `kubectl get pods`, un operador observa el campo `STATUS`. ¿Cuál de los siguientes estados corresponde a una fase oficial de alto nivel del ciclo de vida del objeto `Pod` según la especificación de Kubernetes?",
      "o": [
        "`CrashLoopBackOff`, que indica que el contenedor ha alcanzado el límite máximo de memoria permitido por su clase de calidad de servicio y es terminado por el kernel.",
        "`Pending`, que indica que el Pod ha sido aceptado por el clúster pero uno o más de sus contenedores aún no han sido programados o creados.",
        "`ImagePullBackOff`, que indica que el registro de imágenes ha revocado el token de autenticación del desarrollador que desplegó la app.",
        "`Terminating`, que indica que el kubelet ha recibido una petición de evacuación forzada inmediata sin respetar periodos de gracia."
      ],
      "a": 1,
      "e": "Las fases oficiales del ciclo de vida de un Pod (campo `status.phase`) son: `Pending`, `Running`, `Succeeded`, `Failed` y `Unknown`. En cambio, `CrashLoopBackOff` o `ImagePullBackOff` son estados detallados del contenedor (`waiting.reason`), y `Terminating` es un estado visual de la CLI durante la eliminación, pero no una fase formal del objeto."
    },
    {
      "id": "kcna-21",
      "d": 1,
      "t": "Labels y Selectors",
      "q": "En Kubernetes, los objetos no se vinculan entre sí mediante referencias estáticas rígidas, sino mediante un acoplamiento débil basado en metadatos clave-valor. ¿Cómo se denomina el mecanismo utilizado por un `Service` para identificar dinámicamente qué pods deben recibir su tráfico?",
      "o": [
        "`Annotations`, ya que almacenan información no identificativa consumida por herramientas externas de monitoreo e integración continua.",
        "`ClusterIP`, ya que asocia automáticamente todos los pods que se encuentren dentro del mismo bloque CIDR de la subred del nodo worker.",
        "`ResourceVersion`, ya que conecta los controladores con los pods que poseen el mismo número de secuencia criptográfico en `etcd`.",
        "`Labels` y `Label Selectors`, ya que el Service consulta y empareja las etiquetas declaradas en la plantilla de los Pods activos."
      ],
      "a": 3,
      "e": "Las `Labels` (etiquetas) son pares clave-valor asociados a los objetos de Kubernetes. Los controladores y servicios utilizan `Label Selectors` para consultar y agrupar recursos de forma desacoplada. Por ejemplo, un Service con `selector: { app: backend }` dirigirá el tráfico a todos los Pods que contengan la etiqueta `app: backend`."
    },
    {
      "id": "kcna-22",
      "d": 1,
      "t": "Metadatos y Annotations",
      "q": "Un equipo de SRE desea adjuntar información en manifiestos de Kubernetes con el hash del commit de Git, la dirección de correo del equipo responsable y directivas de configuración para un Ingress Controller externo. No necesitan filtrar pods mediante estos datos. ¿Qué campo de metadatos deben usar?",
      "o": [
        "`annotations`, ya que permite almacenar metadatos arbitrarios extensos no estructurados que no se utilizan para seleccionar objetos.",
        "`labels`, ya que las etiquetas son el único campo de metadatos admitido por la especificación OpenAPI de los esquemas de Kubernetes.",
        "`finalizers`, ya que notifican a los controladores externos que deben registrar el commit en Git antes de autorizar la creación del pod.",
        "`ownerReferences`, ya que vinculan las credenciales del desarrollador de Git con la cuenta de servicio administrativa del clúster."
      ],
      "a": 0,
      "e": "Las `annotations` (anotaciones) permiten adjuntar metadatos arbitrarios en formato clave-valor a los objetos de Kubernetes. A diferencia de las `labels`, las annotations no se utilizan para identificar ni seleccionar objetos mediante consultas eficientes; están pensadas para ser leídas por herramientas externas, bibliotecas, controladores especializados (como Ingress) o para propósitos de auditoría."
    },
    {
      "id": "kcna-23",
      "d": 1,
      "t": "Terminación Graceful de Pods",
      "q": "Cuando se solicita la eliminación de un Pod (por ejemplo, durante un escalado hacia abajo o un despliegue), Kubernetes ejecuta un proceso ordenado de terminación. ¿Cuál es la secuencia estándar de señales y tiempos que el `kubelet` aplica a los procesos del contenedor?",
      "o": [
        "Envía `SIGKILL` inmediatamente al contenedor y luego espera 30 segundos para confirmar que el disco haya sido desacoplado del host de forma segura por el kernel.",
        "Envía una señal `SIGSTOP` para congelar la memoria del contenedor y luego exporta un volcado de diagnóstico al apiserver.",
        "Envía `SIGTERM`, espera el tiempo definido en `terminationGracePeriodSeconds` (30s por defecto) y si no ha salido, envía `SIGKILL`.",
        "Elimina las interfaces de red del pod y espera indefinidamente hasta que todos los hilos del proceso finalicen de forma natural."
      ],
      "a": 2,
      "e": "El proceso de terminación graceful de un Pod sigue este orden: 1) El pod pasa a estado Terminating y se retira de los Endpoints de los servicios; 2) Se ejecuta el hook `preStop` si está configurado; 3) El `kubelet` envía la señal `SIGTERM` al proceso principal (PID 1); 4) Espera el tiempo de gracia (`terminationGracePeriodSeconds`, por defecto 30 segundos); 5) Si el proceso aún no ha terminado, envía `SIGKILL` para forzar su apagado inmediato."
    },
    {
      "id": "kcna-24",
      "d": 2,
      "t": "Gestión de Recursos: Requests vs Limits",
      "q": "Un ingeniero configura los recursos de CPU y memoria de un contenedor dentro de un Pod. ¿Cuál es la diferencia fundamental entre el comportamiento de `resources.requests` y `resources.limits` en Kubernetes?",
      "o": [
        "`requests` define el consumo máximo de memoria antes de reiniciar el nodo, mientras que `limits` se usa para calcular el coste mensual en la nube.",
        "`requests` restringe el número de peticiones HTTP por segundo que puede atender el contenedor, mientras que `limits` restringe el ancho de banda de red.",
        "`requests` es utilizado exclusivamente por el kernel de Linux para aplicar throttling de CPU, mientras que `limits` es usado por el scheduler para agendar.",
        "`requests` es la cantidad garantizada que usa el scheduler para ubicar el pod, mientras que `limits` es el tope rígido que imponen los cgroups."
      ],
      "a": 3,
      "e": "`resources.requests` representa la cantidad mínima garantizada de CPU y memoria que el contenedor necesita; el `kube-scheduler` lo utiliza para encontrar un nodo con suficiente capacidad disponible. En cambio, `resources.limits` es el límite superior rígido enforced por los cgroups del kernel de Linux: superar el límite de CPU causa throttling (estrangulamiento CFS), mientras que superar el límite de memoria provoca la terminación inmediata por el OOM Killer (`OOMKilled`)."
    },
    {
      "id": "kcna-25",
      "d": 2,
      "t": "Clases de Calidad de Servicio (QoS)",
      "q": "Un nodo worker se queda sin memoria RAM disponible y el kernel entra en presión severa de recursos. El `kubelet` debe comenzar a desalojar (evict) pods para mantener la estabilidad del sistema operativo. ¿Qué clase de QoS (Quality of Service) será la primera en ser seleccionada para desalojo?",
      "o": [
        "`Guaranteed`, ya que sus réplicas pueden ser recreadas de forma instantánea por el scheduler en otros nodos del clúster.",
        "`BestEffort`, ya que no define ningún valor de `requests` ni de `limits`, siendo la clase con menor prioridad de retención.",
        "`Burstable`, ya que ha consumido más memoria del promedio asignado históricamente por las directivas de cuota del namespace.",
        "`CriticalSystem`, ya que Kubernetes prioriza las aplicaciones de usuario sobre los demonios internos del sistema operativo."
      ],
      "a": 1,
      "e": "Kubernetes clasifica automáticamente cada Pod en una clase de QoS: 1) `Guaranteed` (requests = limits para CPU y memoria en todos los contenedores); 2) `Burstable` (al menos un request o limit definido); 3) `BestEffort` (ningún contenedor define ni requests ni limits). Ante presión de memoria (MemoryPressure), los pods `BestEffort` son los primeros en ser expulsados y terminados, seguidos por `Burstable` que excedan sus requests, y finalmente `Guaranteed`."
    },
    {
      "id": "kcna-26",
      "d": 2,
      "t": "Taints y Tolerations",
      "q": "Un clúster dispone de 3 nodos worker equipados con hardware de aceleración GPU de alto coste. El administrador de la plataforma desea asegurar que ningún Pod ordinario sea programado en estos nodos, a menos que el desarrollador declare explícitamente que su Pod puede tolerar esa restricción. ¿Qué mecanismo debe implementarse?",
      "o": [
        "Aplicar un `Taint` en los nodos con GPUs y configurar una `Toleration` correspondiente en los Pods que requieran ejecutarse en ellos.",
        "Configurar una `NetworkPolicy` de tipo DenyAll en el namespace donde se encuentran registrados los servidores físicos con GPU.",
        "Crear un `ClusterRole` con verbos de solo lectura asignado a la cuenta de servicio predeterminada del controlador de réplicas en cada una de las zonas de disponibilidad.",
        "Definir un `LimitRange` con valor cero en el campo de memoria compartida para todos los nodos que no tengan aceleración de hardware."
      ],
      "a": 0,
      "e": "Los `Taints` (manchas) y `Tolerations` (tolerancias) trabajan en conjunto para asegurar que los pods no sean asignados a nodos inapropiados. Un Taint se aplica a un nodo (`kubectl taint nodes nodo1 gpu=true:NoSchedule`) y actúa como repulsión: el `kube-scheduler` no agendará ningún pod en ese nodo a menos que el pod contenga una `Toleration` coincidente."
    },
    {
      "id": "kcna-27",
      "d": 2,
      "t": "Afinidad de Nodos (NodeAffinity)",
      "q": "Un equipo de ingeniería necesita que sus pods se ejecuten preferentemente en nodos que tengan la etiqueta `topology.kubernetes.io/zone=us-east-1a`, pero si no hay capacidad disponible en esa zona, aceptan que se agenden en cualquier otra zona sin quedarse en estado Pending. ¿Qué configuración de afinidad deben declarar?",
      "o": [
        "`nodeSelector: { zone: us-east-1a }`, ya que `nodeSelector` conmuta automáticamente a otras zonas disponibles ante fallos de capacidad en los servidores del rack.",
        "`requiredDuringSchedulingIgnoredDuringExecution`, ya que representa una regla estricta e inquebrantable de cumplimiento obligatorio.",
        "`preferredDuringSchedulingIgnoredDuringExecution`, ya que define una afinidad suave (soft) que prioriza pero no bloquea el agendamiento.",
        "`podAntiAffinity` con `topologyKey` configurado a nivel de sistema operativo para forzar el despliegue en hipervisores distintos."
      ],
      "a": 2,
      "e": "`NodeAffinity` ofrece dos tipos de reglas: `requiredDuringSchedulingIgnoredDuringExecution` (afinidad dura o hard rule, obligatoria para que el pod sea agendado; si no se cumple, queda Pending) y `preferredDuringSchedulingIgnoredDuringExecution` (afinidad suave o soft rule, donde el scheduler intenta satisfacer la preferencia otorgando mayor puntuación a esos nodos, pero si no están disponibles, agendará el pod en otro nodo viable)."
    },
    {
      "id": "kcna-28",
      "d": 2,
      "t": "Sondas de Salud del Kubelet",
      "q": "¿Cuáles DOS afirmaciones describen correctamente la diferencia fundamental entre una `livenessProbe` y una `readinessProbe` ejecutadas por el `kubelet` en un Pod? (Selecciona dos)",
      "o": [
        "Si una `livenessProbe` falla consecutivamente, el kubelet reinicia el contenedor afectado según la política `restartPolicy`.",
        "Si una `livenessProbe` falla, el pod es migrado inmediatamente a otro nodo worker mediante un comando de live migration.",
        "Si una `readinessProbe` falla, el kubelet destruye permanentemente el volumen de almacenamiento persistente del contenedor.",
        "Si una `readinessProbe` falla, el Pod no se reinicia, pero su dirección IP se retira de los Endpoints de todos los Services asociados."
      ],
      "a": [
        0,
        3
      ],
      "e": "`livenessProbe` y `readinessProbe` tienen consecuencias operativas muy distintas: La `livenessProbe` determina si la aplicación está viva; si falla, el `kubelet` mata el contenedor y lo reinicia. La `readinessProbe` determina si la aplicación está lista para recibir tráfico; si falla, el pod **no se reinicia**, pero se excluye temporalmente de los endpoints de los servicios para que ningún usuario reciba errores mientras el servicio se recupera o inicializa."
    },
    {
      "id": "kcna-29",
      "d": 2,
      "t": "Sonda de Inicio (startupProbe)",
      "q": "Un microservicio heredado desarrollado en Java tarda habitualmente entre 90 y 120 segundos en cargar cachés y dependencias durante su inicialización. En despliegues anteriores, la `livenessProbe` configurada a los 30 segundos mataba el contenedor reiteradamente, provocando un ciclo continuo de reinicios (`CrashLoopBackOff`). ¿Qué solución nativa de Kubernetes resuelve este problema de manera óptima?",
      "o": [
        "Incrementar el límite de memoria del contenedor a 64 GiB para forzar que la máquina virtual Java desactive la compilación Just-In-Time y reserve espacio en el heap de memoria.",
        "Configurar una `startupProbe` con un tiempo de gracia suficiente, ya que desactiva las comprobaciones de liveness y readiness hasta que responde con éxito.",
        "Eliminar todas las sondas de salud del manifiesto y delegar la monitorización a un cron de Linux ejecutado en el sistema operativo del nodo que reinicie el pod al detectar fallos.",
        "Configurar la directiva `restartPolicy: Never` en el Deployment para impedir que el kubelet intente reiniciar la aplicación ante fallos de sonda."
      ],
      "a": 1,
      "e": "La `startupProbe` fue introducida específicamente para resolver el problema de arranque lento de aplicaciones. Mientras la `startupProbe` no haya respondido exitosamente por primera vez, las comprobaciones de `livenessProbe` y `readinessProbe` quedan completamente deshabilitadas. Esto permite conceder un margen generoso de arranque (ej. `failureThreshold: 30`, `periodSeconds: 10` = hasta 300s) sin sacrificar la reactividad rápida de la liveness probe una vez que el servicio ya está en régimen normal."
    },
    {
      "id": "kcna-30",
      "d": 2,
      "t": "Horizontal Pod Autoscaler (HPA)",
      "q": "Una tienda de comercio electrónico experimenta picos variables de tráfico durante promociones comerciales. Para responder automáticamente a estos incrementos de demanda, configuran un objeto `HorizontalPodAutoscaler` (HPA). ¿Cuál es el comportamiento operativo estándar del HPA ante un aumento continuado de la carga?",
      "o": [
        "Aumenta la cantidad de vCPUs físicas y tarjetas de red asignadas a las máquinas virtuales de los nodos worker mediante hot-plugging.",
        "Incrementa los valores de `resources.limits` de CPU del contenedor en caliente sin necesidad de reiniciar el proceso de la aplicación.",
        "Ajusta dinámicamente el número de réplicas de pods en el Deployment o ReplicaSet objetivo basándose en las métricas observadas.",
        "Convierte automáticamente el `Deployment` en un `DaemonSet` para asegurar que todas las instancias del clúster atiendan tráfico."
      ],
      "a": 2,
      "e": "El `HorizontalPodAutoscaler` (HPA) implementa escalabilidad horizontal (escalado hacia afuera o hacia adentro): incrementa o reduce el número de réplicas de pods (`spec.replicas`) de un Deployment, ReplicaSet o StatefulSet para mantener la métrica observada (uso de CPU, memoria o métricas personalizadas de Prometheus) cercana al objetivo configurado por el operador."
    },
    {
      "id": "kcna-31",
      "d": 2,
      "t": "Almacenamiento: PV, PVC y StorageClass",
      "q": "Un desarrollador necesita solicitar 100 GiB de almacenamiento persistente para su base de datos sin necesidad de conocer los detalles de infraestructura del almacenamiento subyacente del proveedor de nube. ¿Cuál es el flujo declarativo estándar en Kubernetes para aprovisionar este almacenamiento de forma desacoplada y dinámica?",
      "o": [
        "El desarrollador crea un `PersistentVolumeClaim` (PVC) que hace referencia a una `StorageClass`, la cual invoca al driver CSI para crear el `PersistentVolume` (PV).",
        "El desarrollador ejecuta un script en el contenedor que formatea directamente un dispositivo SCSI en el sistema operativo del host worker asignando permisos de root al bloque.",
        "El administrador del clúster debe conectarse por SSH al nodo de la base de datos para crear manualmente una partición ext4 en el disco local y editar el archivo /etc/fstab.",
        "El desarrollador define un volumen de tipo `emptyDir` con retención indefinida configurado en la raíz de su imagen de contenedor."
      ],
      "a": 0,
      "e": "El modelo de almacenamiento de Kubernetes separa roles: el desarrollador solicita recursos declarando un `PersistentVolumeClaim` (PVC) con la capacidad y modo de acceso requeridos, indicando una `StorageClass`. La `StorageClass` define el aprovisionador (driver CSI de nube, ej. EBS, Azure Disk, GPD), que interactúa automáticamente con la API de almacenamiento para aprovisionar un disco físico y crear el objeto `PersistentVolume` (PV) enlazado al PVC."
    },
    {
      "id": "kcna-32",
      "d": 2,
      "t": "Modos de Acceso de Volúmenes",
      "q": "Se despliega una aplicación de procesamiento de imágenes con 5 réplicas distribuidas en diferentes nodos worker. Todas las réplicas deben leer y escribir concurrentemente archivos en el mismo volumen de almacenamiento compartido en red. ¿Qué modo de acceso (accessMode) debe soportar el `PersistentVolume` asignado?",
      "o": [
        "`ReadWriteOnce` (RWO), ya que permite el montaje en modo lectura y escritura por múltiples nodos simultáneos siempre que compartan el mismo namespace.",
        "`ReadOnlyMany` (ROX), ya que ofrece la máxima tasa de transferencia de datos en operaciones concurrentes de entrada y salida a disco.",
        "`ReadWriteOncePod` (RWOP), ya que garantiza que múltiples pods en el mismo clúster puedan compartir el socket de red del driver de almacenamiento.",
        "`ReadWriteMany` (RWX), ya que permite que el volumen sea montado en modo lectura/escritura simultáneamente por múltiples nodos worker."
      ],
      "a": 3,
      "e": "Los modos de acceso de un PersistentVolume en Kubernetes son: 1) `ReadWriteOnce` (RWO): el volumen puede ser montado como lectura/escritura por un único nodo; 2) `ReadOnlyMany` (ROX): puede ser montado como solo lectura por múltiples nodos; 3) `ReadWriteMany` (RWX): puede ser montado como lectura/escritura por múltiples nodos concurrentemente (típico de sistemas de archivos de red como NFS, AWS EFS, Azure Files o CephFS)."
    },
    {
      "id": "kcna-33",
      "d": 2,
      "t": "Tipos de Service en Kubernetes",
      "q": "Una empresa desea exponer un microservicio interno de procesamiento contable para que solo pueda ser invocado por otros microservicios que residen dentro del mismo clúster de Kubernetes, garantizando que no sea accesible desde el exterior. ¿Qué tipo de `Service` debe configurarse?",
      "o": [
        "`LoadBalancer`, ya que restringe automáticamente el tráfico entrante a las direcciones IP privadas de los desarrolladores conectados por VPN.",
        "`ClusterIP`, ya que asigna una dirección IP virtual interna accesible exclusivamente desde el interior del clúster de Kubernetes.",
        "`NodePort`, ya que expone un puerto estático accesible únicamente en la dirección de bucle local `127.0.0.1` de los nodos maestros.",
        "`ExternalName`, ya que redirige el tráfico hacia un balanceador de carga público gestionado por la pasarela de pagos internacional."
      ],
      "a": 1,
      "e": "`ClusterIP` es el tipo de `Service` por defecto en Kubernetes. Asigna una dirección IP virtual estable y enrutable exclusivamente desde el interior del clúster. Es la opción ideal y recomendada para la comunicación interna entre microservicios (backends, bases de datos, APIs privadas) que no deben exponerse al exterior."
    },
    {
      "id": "kcna-34",
      "d": 2,
      "t": "Seguridad de Red con NetworkPolicy",
      "q": "Por defecto, la red de Kubernetes permite que cualquier Pod se comunique con cualquier otro Pod en el clúster. Para cumplir con normativas de seguridad bancaria, se requiere aislar los pods de bases de datos para que solo acepten tráfico en el puerto 5432 proveniente de pods con la etiqueta `app: payment-api`. ¿Qué mecanismo y requisito se necesitan?",
      "o": [
        "Crear un `ClusterRoleBinding` que revoque los privilegios de conexión TCP a nivel del protocolo de autenticación del API Server.",
        "Configurar un archivo `/etc/hosts` estático dentro de la imagen del contenedor de base de datos bloqueando los rangos CIDR del clúster.",
        "Definir una `NetworkPolicy` con reglas de Ingress específicas y asegurarse de contar con un plugin CNI que soporte la especificación.",
        "Modificar las banderas del `kubelet` en cada nodo para deshabilitar el enrutamiento de paquetes entre diferentes namespaces."
      ],
      "a": 2,
      "e": "Una `NetworkPolicy` es el recurso nativo de Kubernetes para controlar el flujo de tráfico en capa 3 y 4 (IPs, puertos y selectores de Pod/Namespace). Al aplicar una NetworkPolicy a un conjunto de pods, estos pasan a estar aislados (default deny para lo no explícitamente permitido). Es indispensable contar con un plugin `CNI` que soporte NetworkPolicies (como Calico, Cilium o Weave Net), ya que proveedores básicos como Flannel ignoran estas reglas."
    },
    {
      "id": "kcna-35",
      "d": 3,
      "t": "Principios Cloud Native (CNCF)",
      "q": "De acuerdo con la definición oficial de la Cloud Native Computing Foundation (CNCF), ¿cuál es el propósito primordial de adoptar tecnologías nativas de la nube como contenedores, service meshes y APIs declarativas?",
      "o": [
        "Permitir a las organizaciones construir y ejecutar aplicaciones escalables en entornos dinámicos, tolerantes a fallos y con cambios predecibles.",
        "Eliminar por completo el uso de sistemas operativos en los servidores mediante emulación directa de instrucciones en microcódigo dentro de los procesadores del hardware.",
        "Obligar a que todas las aplicaciones empresariales migren a un modelo monolítico centralizado para simplificar la auditoría contable y consolidar todas las bases de datos en un host.",
        "Garantizar que ninguna carga de trabajo pueda ejecutarse fuera de centros de datos privados para evitar costos de transferencia cloud."
      ],
      "a": 0,
      "e": "La CNCF define Cloud Native como el conjunto de tecnologías que permiten construir y ejecutar aplicaciones escalables en entornos dinámicos (nubes públicas, privadas e híbridas) mediante contenedores, mallas de servicios, microservicios, infraestructura inmutable y APIs declarativas, facilitando sistemas resilientes, manejables, observables y con capacidad de cambios frecuentes y predecibles con mínimo esfuerzo."
    },
    {
      "id": "kcna-36",
      "d": 3,
      "t": "Metodología 12-Factor App",
      "q": "Un equipo de desarrollo está refactorizando un servicio para que cumpla con las mejores prácticas de la metodología `12-Factor App` recomendada para aplicaciones en Kubernetes. ¿Cuál de las siguientes decisiones de diseño representa una aplicación fiel de estos principios?",
      "o": [
        "Incrustar las contraseñas de las bases de datos de producción dentro del código fuente de la aplicación para evitar peticiones de red.",
        "Almacenar el estado de las sesiones de los usuarios en archivos locales del disco duro del contenedor para maximizar la velocidad de acceso y evitar llamadas a cachés externas.",
        "Escribir los logs directamente en particiones de disco de bloques sin formato para evitar la sobrecarga del demonio del sistema operativo y reducir el consumo de ciclos de CPU.",
        "Almacenar la configuración en variables de entorno inyectadas, ejecutar procesos sin estado y enviar los logs a stdout como flujo de eventos."
      ],
      "a": 3,
      "e": "La metodología `12-Factor App` establece principios fundamentales para aplicaciones cloud native: Factor III (Configuración): separar estrictamente la configuración del código mediante variables de entorno; Factor VI (Procesos): ejecutar la aplicación como uno o más procesos sin estado (stateless) que comparten nada (share-nothing); Factor XI (Logs): tratar los logs como flujos continuos de eventos dirigidos a la salida estándar (`stdout`/`stderr`), delegando su recolección a la plataforma."
    },
    {
      "id": "kcna-37",
      "d": 3,
      "t": "Niveles de Madurez de Proyectos CNCF",
      "q": "La CNCF clasifica sus proyectos en tres niveles de graduación: `Sandbox`, `Incubating` y `Graduated`. ¿Cuál es el criterio fundamental que distingue a un proyecto en nivel `Graduated` (como Kubernetes, Prometheus o Envoy)?",
      "o": [
        "Haber sido adquirido en su totalidad por una empresa multinacional que financie en exclusiva a todos sus programadores activos.",
        "Demostrar máxima madurez técnica, amplia adopción en entornos de producción a gran escala, seguridad auditada y gobernanza neutral sólida.",
        "Ser un proyecto de desarrollo experimental reciente sin usuarios en producción pero con una arquitectura conceptualmente innovadora.",
        "Haber reemplazado por completo a todas las demás herramientas de software libre existentes en la misma categoría tecnológica de la industria."
      ],
      "a": 1,
      "e": "Los proyectos `Graduated` en la CNCF representan el máximo nivel de madurez. Para alcanzar este estado, un proyecto debe cumplir criterios rigurosos: adopción masiva y documentada en entornos de producción de misión crítica por múltiples organizaciones, procesos de gobernanza transparentes, saludables y neutrales, compromisos de diversidad de contribuidores y haber superado una auditoría formal e independiente de seguridad."
    },
    {
      "id": "kcna-38",
      "d": 3,
      "t": "Arquitectura de Service Mesh",
      "q": "¿Cuáles DOS capacidades fundamentales aporta una arquitectura de `Service Mesh` (como Istio o Linkerd) mediante el despliegue de proxies sidecar (como Envoy) en el tráfico este-oeste entre microservicios? (Selecciona dos)",
      "o": [
        "Reemplazo total de la capa de almacenamiento persistente mediante bases de datos embebidas en los sockets del kernel.",
        "Cifrado y autenticación mutua automática en tránsito (`mTLS`) entre microservicios sin necesidad de modificar el código de la aplicación.",
        "Generación uniforme de telemetría, métricas doradas (RPS, latencia, errores) y propagación de trazas distribuidas para todo el tráfico interno.",
        "Aceleración por hardware de consultas SQL complejas mediante reescritura estática de índices en el motor de base de datos relacional."
      ],
      "a": [
        1,
        2
      ],
      "e": "Un `Service Mesh` gestiona la comunicación de servicio a servicio (tráfico este-oeste) inyectando proxies sidecar ligeros (habitualmente Envoy). Sus dos grandes aportes son: 1) Seguridad: autenticación criptográfica de identidad y cifrado automático de extremo a extremo mediante `mTLS` transparente; 2) Observabilidad homogénea: recopila métricas doradas de red (latencia p99, tasa de éxito, throughput) y propaga encabezados de trazas sin requerir que los desarrolladores instrumenten cada cliente HTTP en su código."
    },
    {
      "id": "kcna-39",
      "d": 3,
      "t": "Control de Acceso con RBAC",
      "q": "Un administrador de Kubernetes necesita otorgar permisos al equipo de soporte para que puedan consultar los logs y listar pods únicamente dentro del namespace `staging`, garantizando que no puedan ver ni modificar recursos en ningún otro namespace ni a nivel de clúster. ¿Qué combinación de objetos RBAC debe aplicar?",
      "o": [
        "Un `ClusterRole` con verbos wildcard `*` asociado a través de un `ClusterRoleBinding` a nivel de toda la organización para asegurar visibilidad completa de soporte.",
        "Una `NetworkPolicy` de tipo Ingress combinada con un objeto `LimitRange` configurado con permisos de lectura en la subred y cuotas de consumo en el espacio de nombres.",
        "Un `Role` definido con permisos sobre pods en el namespace `staging`, vinculado a los usuarios mediante un `RoleBinding` en ese mismo namespace.",
        "Un `ServiceAccount` configurado con privilegios administrativos de root dentro del archivo local `/etc/sudoers` de los nodos worker."
      ],
      "a": 2,
      "e": "En RBAC de Kubernetes: un `Role` define permisos que tienen alcance exclusivo dentro de un **namespace específico**. Para otorgar esos permisos a un usuario, grupo o ServiceAccount dentro de ese mismo namespace, se utiliza un `RoleBinding`. Si se utilizara un `ClusterRole` con un `ClusterRoleBinding`, los permisos se extenderían a todo el clúster, violando el principio de mínimo privilegio."
    },
    {
      "id": "kcna-40",
      "d": 3,
      "t": "Identidades de Pod con ServiceAccount",
      "q": "Un microservicio desplegado en Kubernetes necesita consultar periódicamente la API de Kubernetes para listar el estado de otros pods en su namespace. ¿Cómo debe autenticarse este proceso ante el `kube-apiserver` de acuerdo con las buenas prácticas de seguridad de Kubernetes?",
      "o": [
        "Asignando una `ServiceAccount` dedicada al Pod, la cual inyecta automáticamente un token JWT proyectado que el cliente HTTP utiliza como credencial Bearer.",
        "Compartiendo el certificado administrativo del usuario `kubernetes-admin` dentro de una variable de entorno en texto plano en el manifiesto para simplificar las pruebas.",
        "Deshabilitando el módulo de autorización en el archivo de configuración del `kube-apiserver` para permitir consultas anónimas en la red interna del clúster de cómputo.",
        "Configurando una regla en el cortafuegos perimetral que asuma que todo el tráfico proveniente de la dirección IP del pod es de confianza."
      ],
      "a": 0,
      "e": "Una `ServiceAccount` proporciona una identidad gestionada a los procesos que se ejecutan dentro de los Pods. Al asociar una ServiceAccount al Pod (`spec.serviceAccountName`), Kubernetes monta de forma segura un token de autenticación (JWT criptográfico) como un volumen proyectado en `/var/run/secrets/kubernetes.io/serviceaccount/token`. El SDK de la aplicación lee este token y lo envía como cabecera `Authorization: Bearer <token>` al `kube-apiserver`."
    },
    {
      "id": "kcna-41",
      "d": 3,
      "t": "Gateway API vs Ingress",
      "q": "A medida que los clústeres de Kubernetes crecieron en complejidad, el recurso tradicional `Ingress` mostró limitaciones de expresividad, dependiendo excesivamente de anotaciones propietarias específicas de cada controlador. ¿Cuál es la principal ventaja arquitectónica que introduce la moderna `Gateway API` de la CNCF?",
      "o": [
        "Obliga a que todos los servicios del clúster se comuniquen exclusivamente mediante sockets UDP sin cifrado para reducir la latencia en las conexiones de alta concurrencia.",
        "Fusiona todas las capas de red en un único archivo binario monolítico administrado exclusivamente por el equipo de seguridad corporativa para evitar divergencias de configuración.",
        "Elimina la necesidad de utilizar direcciones IP públicas al enrutar todo el tráfico entrante a través de puertos serie de consola física instalados en cada rack del centro de datos.",
        "Estructura el enrutamiento mediante recursos orientados a roles (`GatewayClass`, `Gateway`, `HTTPRoute`), permitiendo separación de responsabilidades y portabilidad."
      ],
      "a": 3,
      "e": "La `Gateway API` es la evolución oficial de Ingress en Kubernetes. Su gran ventaja arquitectónica es su diseño orientado a roles (Role-Oriented Design): 1) `GatewayClass` (administrador de infraestructura cloud); 2) `Gateway` (operador de clúster que define listeners y TLS); 3) `HTTPRoute` / `GRPCRoute` (desarrollador de la aplicación que define rutas y redirecciones). Además, estandariza funciones avanzadas como división de tráfico ponderada, filtros de cabeceras y soporte nativo de gRPC sin anotaciones propietarias."
    },
    {
      "id": "kcna-42",
      "d": 3,
      "t": "Control de Admisión y Políticas",
      "q": "El equipo de gobierno de seguridad requiere garantizar que ningún contenedor pueda ejecutarse como usuario `root` (`privileged: true`) ni descargar imágenes con la etiqueta `:latest` en el clúster. ¿Qué mecanismo nativo de Kubernetes y del ecosistema CNCF permite interceptar y validar manifiestos antes de persistirlos en `etcd`?",
      "o": [
        "`kube-proxy` mediante inspección profunda de paquetes con inspección heurística de firmas de código en la capa de transporte TCP para bloquear conexiones no deseadas.",
        "`Admission Controllers` (controladores de admisión mutadores y validadores) integrados con motores de políticas como `OPA / Gatekeeper` o `Kyverno`.",
        "El planificador `kube-scheduler`, asignando puntuación negativa a los pods que no incluyan un certificado de firma digital corporativo emitido por la autoridad de certificación.",
        "Un script en Bash ejecutado localmente en los equipos portátiles de los desarrolladores antes de enviar el comando `git push`."
      ],
      "a": 1,
      "e": "Los `Admission Controllers` (Controladores de Admisión) son interceptores en el `kube-apiserver` que evalúan las solicitudes justo después de ser autenticadas y autorizadas, pero antes de que el objeto sea almacenado en `etcd`. Mediante `ValidatingAdmissionWebhooks`, herramientas del ecosistema CNCF como `OPA/Gatekeeper` o `Kyverno` inspeccionan el contenido del manifiesto y rechazan la creación de pods que violen políticas de seguridad (como correr como root o usar imágenes `:latest`)."
    },
    {
      "id": "kcna-43",
      "d": 4,
      "t": "Los Tres Pilares de la Observabilidad",
      "q": "En el paradigma de observabilidad de sistemas distribuidos y arquitecturas nativas de la nube, se describen con frecuencia los denominados «Tres Pilares de la Observabilidad». ¿Cuáles son estos tres tipos fundamentales de señales de telemetría y su valor característico?",
      "o": [
        "CPU, Memoria y Almacenamiento en disco, que miden exclusivamente el rendimiento del hardware físico en el centro de datos y alertan sobre fallos mecánicos en los servidores.",
        "Autenticación, Autorización y Auditoría, que garantizan el cumplimiento de las políticas de seguridad perimetral del cortafuegos y el registro de acceso de usuarios corporativos.",
        "Métricas (agregados numéricos para tendencias), Logs (eventos textuales detallados con timestamp) y Trazas (recorrido y latencia distribuida de peticiones).",
        "Despliegues, Pruebas unitarias e Integración continua, que aseguran que el código cumpla con los estándares de calidad del repositorio."
      ],
      "a": 2,
      "e": "Los Tres Pilares de la Observabilidad son: 1) `Métricas`: datos numéricos agregables y eficientes para medir tendencias, calcular SLIs y disparar alertas en tiempo real; 2) `Logs`: registros de eventos textuales con marca de tiempo para entender qué ocurrió exactamente en un momento puntual; 3) `Trazas`: representan el recorrido completo de una petición a través de múltiples microservicios (mediante Spans), permitiendo identificar cuellos de botella de latencia."
    },
    {
      "id": "kcna-44",
      "d": 4,
      "t": "Arquitectura de Prometheus",
      "q": "Prometheus es el proyecto de monitorización y alertas graduado por excelencia en la CNCF. ¿Cuál de las siguientes afirmaciones describe con precisión el modelo de recolección de datos y la arquitectura central de Prometheus?",
      "o": [
        "Utiliza un modelo basado en `pull` sondeando activamente endpoints HTTP `/metrics`, almacena series temporales en su TSDB local y consulta datos con `PromQL`.",
        "Requiere que todos los microservicios envíen eventos de telemetría mediante llamadas síncronas hacia una base de datos relacional PostgreSQL externa con esquemas relacionales normalizados.",
        "Opera exclusivamente como un agente pasivo que intercepta paquetes en la interfaz de red Ethernet de los switches físicos sin consumir CPU ni requerir agentes en los nodos worker.",
        "Descarga automáticamente los archivos de configuración de los pods para compilar binarios de auditoría en memoria flash durante el arranque."
      ],
      "a": 0,
      "e": "Prometheus utiliza un modelo de recolección basado en sondeo activo (`pull model` / scraping): a intervalos regulares (scrape interval), Prometheus consulta por HTTP el endpoint de métricas (habitualmente `/metrics`) expuesto por cada destino configurado. Guarda estos datos en su base de datos de series temporales (`TSDB`) optimizada en disco y ofrece el potente lenguaje `PromQL` para consultar métricas y evaluar reglas de alerta."
    },
    {
      "id": "kcna-45",
      "d": 4,
      "t": "Ecosistema OpenTelemetry (OTel)",
      "q": "Una organización utiliza múltiples lenguajes de programación (Go, Java, Python, Node.js) y desea instrumentar sus microservicios de manera neutral para no quedar cautiva de un proveedor específico de observabilidad (vendor lock-in). ¿Cuál es el rol de `OpenTelemetry` (OTel) en este escenario?",
      "o": [
        "Reemplazar por completo el sistema operativo de los nodos para unificar los controladores de red en un único estándar binario de Linux optimizado para arquitecturas distribuidas.",
        "Proveer una base de datos distribuida relacional con soporte transaccional ACID diseñada específicamente para competir con clústeres MySQL en almacenamiento de datos transaccionales.",
        "Ejecutar automáticamente pruebas de carga de estrés simulando millones de usuarios concurrentes en los entornos de producción.",
        "Proveer un conjunto estándar de APIs, SDKs y herramientas (junto al OTel Collector) para generar y exportar métricas, logs y trazas de forma agnóstica."
      ],
      "a": 3,
      "e": "OpenTelemetry (OTel), proyecto `Graduated` de la CNCF, proporciona un estándar unificado y agnóstico a proveedores para la observabilidad. Ofrece APIs y SDKs en múltiples lenguajes para instrumentar código de forma homogénea, define el protocolo abierto `OTLP` y provee el `OTel Collector`, un componente intermediario que recibe, procesa y exporta telemetría (métricas, trazas y logs) hacia cualquier backend de análisis compatible (Prometheus, Jaeger, Datadog, etc.)."
    },
    {
      "id": "kcna-46",
      "d": 4,
      "t": "Monitoreo del Clúster y Alertmanager",
      "q": "En una infraestructura de Kubernetes, ¿cuál es la función de `cAdvisor` en la cadena de telemetría de monitorización y cómo colabora con `Prometheus Alertmanager` ante situaciones de degradación del servicio?",
      "o": [
        "`cAdvisor` gestiona el cifrado de las comunicaciones HTTPS en el Ingress, mientras que Alertmanager reinicia los contenedores que sufren latencia de red prolongada en sus conexiones.",
        "`cAdvisor` recopila métricas de uso de CPU y memoria de los contenedores desde el kubelet, y Alertmanager gestiona, agrupa y enruta las alertas disparadas por Prometheus.",
        "`cAdvisor` ejecuta periódicamente backups de la base de datos `etcd` en disco, y Alertmanager revierte los despliegues fallidos en el clúster enviando comandos automáticos al apiserver.",
        "`cAdvisor` calcula los costos de facturación de las máquinas virtuales, mientras que Alertmanager envía correos exclusivamente al equipo de finanzas corporativas."
      ],
      "a": 1,
      "e": "`cAdvisor` (Container Advisor) es un servicio embebido de forma nativa en el binario del `kubelet` que recopila, agrega y expone métricas de rendimiento y uso de recursos (CPU, memoria, disco y red) de todos los contenedores en ejecución en ese nodo. Prometheus hace scraping a estas métricas y, si una regla de alerta se cumple, envía la notificación a `Alertmanager`, que se encarga de deduplicar, agrupar y enrutar las alertas hacia Slack, PagerDuty o correo."
    },
    {
      "id": "kcna-47",
      "d": 5,
      "t": "Principios Fundamentales de GitOps",
      "q": "Un equipo de ingeniería de plataformas adopta la metodología `GitOps` para gestionar la infraestructura y las aplicaciones de sus clústeres de producción. ¿Cuál es el postulado central que define el funcionamiento de GitOps?",
      "o": [
        "Los desarrolladores deben conectarse por consola interactiva a cada nodo worker para compilar los cambios directamente en el entorno productivo sin necesidad de pruebas automatizadas.",
        "Las modificaciones en producción se realizan enviando peticiones manuales no versionadas a través del panel de control web del proveedor de nube para acelerar los tiempos de despliegue.",
        "El repositorio Git es la única fuente de verdad (Single Source of Truth) donde se declara el estado deseado, el cual es reconciliado continuamente por un agente en el clúster.",
        "Toda la infraestructura debe configurarse utilizando scripts en ensamblador almacenados en el sector de arranque de los discos rígidos."
      ],
      "a": 2,
      "e": "El núcleo de `GitOps` consiste en utilizar Git como la única fuente de verdad (Single Source of Truth) para todo el sistema. Toda la configuración y los manifiestos de las aplicaciones se almacenan de forma declarativa y versionada en repositorios Git. Un operador automatizado que corre dentro del clúster (como ArgoCD o Flux) compara continuamente el estado de Git con el estado del clúster y sincroniza las desviaciones (drift) de forma automática."
    },
    {
      "id": "kcna-48",
      "d": 5,
      "t": "Empaquetado: Helm vs Kustomize",
      "q": "Una organización necesita estandarizar la entrega de aplicaciones en sus clústeres. Al evaluar herramientas del ecosistema CNCF, comparan `Helm` con `Kustomize`. ¿Cuál es la diferencia metodológica principal entre estas dos soluciones?",
      "o": [
        "`Helm` es un compilador binario para el kernel de Linux en servidores físicos, mientras que `Kustomize` es una base de datos clave-valor distribuida como `etcd` para almacenar configuraciones.",
        "`Helm` solo admite despliegues en nubes privadas sin conexión a Internet, mientras que `Kustomize` requiere acceso root obligatorio al hardware del host para montar sistemas de archivos.",
        "`Helm` gestiona exclusivamente certificados de seguridad TLS en el Ingress, mientras que `Kustomize` monitoriza el consumo de CPU de los pods calculando el escalado automático de réplicas.",
        "`Helm` utiliza plantillas Go con `values.yaml`, mientras que `Kustomize` compone manifiestos declarativos mediante capas (bases y overlays) sin plantillas."
      ],
      "a": 3,
      "e": "`Helm` es el gestor de paquetes de Kubernetes; utiliza plantillas de Go (`templates/`) combinadas con archivos de variables (`values.yaml`) para generar manifiestos parametrizados, gestionando versiones de release y rollbacks en el clúster. En cambio, `Kustomize` es una herramienta sin plantillas (`template-free`) que utiliza un enfoque de composición declarativa mediante capas base (`bases`) y modificaciones específicas por entorno (`overlays`), y viene integrada nativamente en `kubectl` (`kubectl apply -k`)."
    },
    {
      "id": "kcna-49",
      "d": 5,
      "t": "Principios OpenGitOps",
      "q": "¿Cuáles DOS características corresponden a los principios oficiales de `OpenGitOps` promovidos por la CNCF para el despliegue moderno de aplicaciones nativas de la nube? (Selecciona dos)",
      "o": [
        "El estado deseado del sistema se describe de forma completamente declarativa y se almacena en un sistema versionado e inmutable como Git.",
        "Los agentes de software que residen dentro del clúster obtienen automáticamente (modelo Pull) el estado deseado desde la fuente de verdad.",
        "Los despliegues se ejecutan obligatoriamente mediante scripts imperativos en Bash invocados manualmente por un operador de guardia.",
        "El clúster autoriza a cualquier herramienta externa de CI a sobrescribir configuraciones en caliente sin guardar registro en el historial de commits."
      ],
      "a": [
        0,
        1
      ],
      "e": "Los cuatro principios fundamentales de `OpenGitOps` (CNCF) son: 1) `Declarativo`: el sistema se describe mediante declaraciones; 2) `Versionado e Inmutable`: el estado deseado se almacena de forma inmutable y con historial (en Git); 3) `Obtenido Automáticamente`: agentes de software en el clúster extraen (pull) el estado deseado; 4) `Reconciliado Continuamente`: software automatizado supervisa y reconcilia permanentemente cualquier divergencia entre el estado deseado y el estado real."
    },
    {
      "id": "kcna-50",
      "d": 5,
      "t": "Estrategias de Despliegue Cloud Native",
      "q": "Un equipo de comercio electrónico desea desplegar una versión experimental del motor de recomendaciones. Quieren enviar únicamente el 10% del tráfico de usuarios reales a la nueva versión para evaluar la tasa de errores y la latencia antes de extenderla a toda la plataforma. ¿Qué estrategia de despliegue deben utilizar?",
      "o": [
        "`Canary Deployment` (Despliegue Canario), ya que permite enrutar un porcentaje controlado y progresivo del tráfico real hacia la nueva versión.",
        "`Recreate`, ya que apaga simultáneamente todas las réplicas antiguas antes de encender las nuevas para evitar incompatibilidad de esquemas.",
        "`Blue/Green`, ya que conmuta instantáneamente el 100% de todo el tráfico de usuarios desde el entorno azul hacia el entorno verde sin coexistencia.",
        "`RollingUpdate` estándar sin balanceador, ya que divide automáticamente las transacciones bancarias entre los dos servidores más antiguos del rack."
      ],
      "a": 0,
      "e": "Un `Canary Deployment` (despliegue canario) introduce una nueva versión de software enviándole únicamente una pequeña fracción de tráfico productivo real (ej. 10%), mientras el 90% restante sigue siendo atendido por la versión estable v1. Esto permite validar métricas de telemetría, errores y rendimiento con usuarios reales minimizando drásticamente el radio de impacto ante fallos. Si las métricas son satisfactorias, se incrementa progresivamente el tráfico hasta reemplazar v1 por completo."
    }
  ],
  "why": {
    "kcna-01": [
      "El `kube-scheduler` no expone la API REST ni accede directamente a `etcd`; consulta pods sin asignar y actualiza asignaciones a través del `kube-apiserver`.",
      "El `kube-controller-manager` ejecuta los bucles de control internos (como ReplicaSet o NodeController), pero no almacena datos ni interactúa con `etcd` directamente.",
      null,
      "El `kubelet` es un agente que corre en los nodos worker, no en el Control Plane, y jamás se comunica directamente con `etcd`."
    ],
    "kcna-02": [
      null,
      "`etcd` no realiza particionado (sharding) ni balanceo de escrituras; todas las operaciones de escritura pasan obligatoriamente por el nodo líder de Raft.",
      "El número impar de nodos responde a la matemática del quórum de consenso en Raft, sin relación con los certificados TLS del apiserver.",
      "La compactación periódica de revisiones históricas en `etcd` es necesaria independientemente de si el número de miembros es par o impar."
    ],
    "kcna-03": [
      null,
      "El `kube-controller-manager` gestiona el ciclo de vida de réplicas y recursos, pero no decide en qué nodo específico se ejecuta cada Pod.",
      "El `kubelet` ejecuta y monitorea los pods una vez que ya han sido asignados a su nodo específico por el scheduler; no agenda pods globalmente.",
      "El `cloud-controller-manager` integra servicios de nube (como balanceadores o rutas), pero no toma decisiones de agendamiento de pods individuales."
    ],
    "kcna-04": [
      "Kubernetes no compila archivos YAML en binarios; las imágenes son construidas previamente por motores OCI y los YAML son definiciones de recursos analizadas por la API.",
      null,
      "La validación de tokens y certificados de autenticación es responsabilidad del `kube-apiserver`, no del controller manager.",
      "La configuración de redes overlay y encapsulación de paquetes es responsabilidad del plugin CNI, no del controller manager."
    ],
    "kcna-05": [
      "El `cloud-controller-manager` no reemplaza al `kubelet`; el kubelet sigue siendo el agente indispensable en cada nodo worker.",
      "El monitoreo de recursos y la facturación son gestionados por herramientas de telemetría y APIs del proveedor, no por este componente.",
      "La creación de clústeres con Terraform o IaC es externa a Kubernetes y no forma parte del `cloud-controller-manager`.",
      null
    ],
    "kcna-06": [
      "El balanceo de tráfico de red en los nodos es responsabilidad de `kube-proxy` o de un Service Mesh / Ingress Controller, no del `kubelet`.",
      "El `kubelet` nunca se comunica directamente con `etcd`; cualquier consulta o reporte de estado se realiza a través del `kube-apiserver`.",
      null,
      "El `kubelet` no compila código fuente; únicamente ejecuta imágenes de contenedores previamente construidas y publicadas en un registry."
    ],
    "kcna-07": [
      null,
      "`CoreDNS` es el servidor DNS interno del clúster que resuelve nombres a IPs, pero no programa reglas en el kernel ni enruta paquetes a nivel de transporte.",
      "`containerd` es un runtime de contenedores que gestiona imágenes y namespaces de procesos, no el enrutamiento de Services de Kubernetes.",
      "El `kube-scheduler` agrupa pods en nodos en la fase de scheduling, pero no tiene relación con el enrutamiento de tráfico ni tablas del kernel."
    ],
    "kcna-08": [
      null,
      "`kube-apiserver` no utiliza elección de líder activo-pasivo; es totalmente sin estado (stateless) y opera en modo activo-activo balanceado.",
      null,
      "El `kubelet` es un agente que corre en cada nodo worker de manera independiente para gestionar sus propios contenedores locales, no participa en leader election del control plane."
    ],
    "kcna-09": [
      "La `CNI` (Container Network Interface) se enfoca en la conectividad y configuración de interfaces de red de los contenedores, no en su ejecución.",
      "La `CSI` (Container Storage Interface) se encarga de aprovisionar y montar volúmenes de almacenamiento, no del ciclo de vida de los contenedores.",
      "La `OCI` (Open Container Initiative) define especificaciones de formato de imagen y runtime de bajo nivel (como `runc`), no el formato de Helm.",
      null
    ],
    "kcna-10": [
      "Los contenedores dentro de un mismo Pod comparten la misma dirección IP; no reciben direcciones IP independientes ni necesitan Ingress para comunicarse entre sí.",
      null,
      "Todos los contenedores de un mismo Pod se ejecutan obligatoriamente en el mismo nodo físico/virtual; un Pod nunca se fragmenta entre múltiples nodos.",
      "Cada contenedor mantiene su propio sistema de archivos raíz derivado de su imagen de contenedor; solo comparten los volúmenes explícitamente montados."
    ],
    "kcna-11": [
      "Los `ReplicaSets` admiten exactamente la misma plantilla de Pod (`PodTemplateSpec`) que los Deployments, incluyendo múltiples contenedores y secrets.",
      "Los Deployments no realizan análisis estático de vulnerabilidades de código fuente; esa es una tarea de los pipelines de CI/CD.",
      null,
      "Los `ReplicaSets` siguen siendo componentes oficiales y fundamentales en Kubernetes; son los controladores que los Deployments usan internamente."
    ],
    "kcna-12": [
      null,
      "Un `StatefulSet` se usa para cargas con estado (como bases de datos distribuidas) que requieren orden y persistencia, no para ejecutar un agente por nodo.",
      "Un `Job` se utiliza para tareas finitas que corren hasta completarse; los agentes de logs deben ejecutarse de forma continua como demonios.",
      "Un `Deployment` distribuye pods buscando equilibrar capacidad, pudiendo colocar múltiples réplicas en un nodo y cero en otro, sin garantizar uno por nodo."
    ],
    "kcna-13": [
      "Un `DaemonSet` no garantiza nombres ordinales estables ni plantillas de volumen dedicadas por réplica; ejecuta un pod por nodo para agentes.",
      "Un `Deployment` trata a sus réplicas como reemplazables e intercambiables con nombres aleatorios (ej. `app-5df4c9-xk7pz`), lo cual rompe clústeres como ZooKeeper.",
      "Un `CronJob` ejecuta tareas programadas puntuales y no mantiene servicios continuos ni identidades ordinales estables.",
      null
    ],
    "kcna-14": [
      "Un `Deployment` está diseñado para servicios continuos; si el contenedor termina con código 0, el Deployment lo considerará un fallo y lo reiniciará.",
      null,
      "Un `DaemonSet` ejecutaría el proceso en cada uno de los nodos del clúster a la vez, duplicando la conciliación contable y causando inconsistencias.",
      "Un `StatefulSet` mantiene servicios continuos con estado y no está concebido para procesos batch que deben finalizar y apagarse."
    ],
    "kcna-15": [
      "`NodeSelector` es una técnica de agendamiento para dirigir pods a nodos con etiquetas específicas, no un mecanismo de partición lógica del clúster.",
      "Un `ClusterRole` es un objeto de RBAC que define permisos sobre recursos globales, no una partición de objetos ni cuotas de clúster.",
      null,
      "`StorageClass` define los tipos y aprovisionadores de volúmenes de almacenamiento persistente, sin proveer aislamiento de nombres de recursos."
    ],
    "kcna-16": [
      "El FQDN propuesto apunta al namespace `production` y utiliza el sufijo de pod (`.pod.`), en lugar de apuntar a `finance` con el sufijo `.svc.`.",
      "Kubernetes no utiliza la convención de subdominio invertido ni `.k8s.internal` como estándar por defecto de CoreDNS.",
      "Una URL HTTP no es un nombre de host DNS de resolución en capa de transporte; la resolución de red requiere el FQDN estándar del servicio.",
      null
    ],
    "kcna-17": [
      "Un `PersistentVolumeClaim` es una solicitud de almacenamiento de bloques o archivos persistentes en disco, no un almacén de parámetros de configuración.",
      null,
      "Una `NetworkPolicy` define reglas de filtrado de tráfico de red a nivel de firewall de capa 3/4, sin relación con la configuración de la app.",
      null
    ],
    "kcna-18": [
      null,
      "Kubernetes no depende de Docker Swarm para su arranque; el propio `kubelet` es capaz de arrancar pods de forma autónoma.",
      "Los componentes del plano de control no son scripts simulados, sino los binarios reales de Kubernetes ejecutándose como Static Pods.",
      "Terraform puede aprovisionar la máquina virtual, pero la orquestación del bootstrap de los pods en el nodo la realiza el `kubelet`."
    ],
    "kcna-19": [
      "Los `Ephemeral Containers` se usan para depuración interactiva en caliente en pods ya en ejecución con `kubectl debug`, no para preparación de inicio.",
      "Los `Sidecar Containers` corren en paralelo durante toda la vida de la aplicación, mientras que las tareas de preparación deben finalizar antes de iniciar la app.",
      null,
      "El contenedor `pause` reserva los namespaces de red e IPC del Pod en el kernel, pero no ejecuta tareas de inicialización ni scripts de usuario."
    ],
    "kcna-20": [
      "`CrashLoopBackOff` es un estado de contenedor (`waiting.reason`) que indica fallos reiterados en el proceso, no una fase oficial del Pod.",
      null,
      "`ImagePullBackOff` es un motivo de espera del contenedor ante la imposibilidad de descargar la imagen, no una fase del ciclo de vida del Pod.",
      "`Terminating` es una indicación que muestra `kubectl` mientras espera el periodo de gracia de borrado, pero no es una fase oficial del Pod."
    ],
    "kcna-21": [
      "Las `Annotations` se utilizan para adjuntar metadatos arbitrarios no consultables mediante selectores eficientes por parte de controladores o servicios.",
      "`ClusterIP` es la dirección IP virtual asignada al servicio, pero no es el mecanismo que busca o identifica los pods de backend.",
      "`ResourceVersion` es una marca interna de control de concurrencia optimista utilizada por `etcd` y el apiserver, sin relación con el balanceo.",
      null
    ],
    "kcna-22": [
      null,
      "Las `labels` están diseñadas para identificación y selección de objetos; para metadatos descriptivos o configuraciones de plugins se usan `annotations`.",
      "Los `finalizers` son cadenas que bloquean la eliminación de un recurso hasta que se completen tareas de limpieza pre-borrado.",
      "`ownerReferences` establecen relaciones padre-hijo entre objetos para la recolección de basura (ej. un Deployment como dueño de un ReplicaSet)."
    ],
    "kcna-23": [
      "`SIGKILL` no se envía al inicio; enviar `SIGKILL` inmediatamente abortaría conexiones en vuelo de forma abrupta sin permitir limpieza graceful.",
      "Kubernetes no envía `SIGSTOP` para congelar procesos ni realiza volcados de memoria durante la terminación habitual de pods.",
      null,
      "El `kubelet` no espera indefinidamente; el tiempo de espera está estrictamente acotado por `terminationGracePeriodSeconds` antes del `SIGKILL`."
    ],
    "kcna-24": [
      "`requests` no reinicia nodos y `limits` no es una directiva de facturación en la nube, sino una configuración de aislamiento en el kernel.",
      "`requests` y `limits` gestionan recursos de cómputo (CPU y memoria), no tasas de solicitudes HTTP de capa de aplicación ni ancho de banda de red.",
      "La relación es inversa: `requests` es usado por el scheduler para ubicar el pod en un nodo, mientras que `limits` es usado por cgroups para throttling o OOM.",
      null
    ],
    "kcna-25": [
      "Los pods con QoS `Guaranteed` son los más protegidos del sistema y los últimos en ser considerados para desalojo ante saturación de memoria.",
      null,
      "Los pods `Burstable` tienen mayor prioridad que los `BestEffort`; solo son expulsados si no quedan pods `BestEffort` en el nodo.",
      "`CriticalSystem` no es una clase estándar de QoS de pods ordinarios, y los procesos del sistema tienen mayor prioridad que las apps de usuario."
    ],
    "kcna-26": [
      null,
      "Una `NetworkPolicy` filtra tráfico de red entre pods en capa 3/4, pero no tiene ninguna influencia en las decisiones de agendamiento de nodos del scheduler.",
      "Un `ClusterRole` controla permisos de autenticación y autorización sobre la API de Kubernetes, no la colocación física de cargas en nodos.",
      "Un `LimitRange` establece mínimos y máximos de recursos por pod dentro de un namespace, no controla la asignación de nodos especializados."
    ],
    "kcna-27": [
      "`nodeSelector` es un mecanismo estricto de coincidencia exacta; si ningún nodo cumple con la etiqueta especificada, el pod permanece en `Pending`.",
      "`requiredDuringScheduling...` es una condición dura e ineludible; si no hay espacio en `us-east-1a`, el pod fallará en agendarse.",
      null,
      "`podAntiAffinity` aleja pods entre sí, no hacia nodos específicos; además se solicita una preferencia positiva hacia la zona `us-east-1a`."
    ],
    "kcna-28": [
      null,
      "Kubernetes no realiza migración en caliente (live migration) de pods entre nodos al fallar una sonda; el `kubelet` local simplemente reinicia el contenedor.",
      "El fallo de una `readinessProbe` jamás destruye los datos ni los volúmenes persistentes asociados al Pod.",
      null
    ],
    "kcna-29": [
      "Aumentar la memoria a 64 GiB no soluciona el tiempo de carga de dependencias ni evita que la liveness probe falle por timeout prematuro.",
      null,
      "Eliminar las sondas de salud deja a la aplicación sin supervisión automatizada de fallos y deadlocks en producción, lo cual es un antipatrón grave.",
      "`restartPolicy: Never` no es una opción válida para la plantilla de un `Deployment` (los Deployments exigen obligatoriamente `restartPolicy: Always`)."
    ],
    "kcna-30": [
      "El HPA no agrega hardware físico ni reconfigura máquinas virtuales; esa función corresponde al `Cluster Autoscaler` o a `Karpenter` a nivel de nodos.",
      "El escalado vertical de recursos (modificar requests/limits) lo gestiona el `VerticalPodAutoscaler` (VPA), no el HPA.",
      null,
      "El HPA no modifica la clase del controlador ni transforma Deployments en DaemonSets; únicamente modifica el contador de réplicas."
    ],
    "kcna-31": [
      null,
      "Los contenedores en Kubernetes corren aislados y no deben formatear directamente dispositivos SCSI de bajo nivel del sistema operativo anfitrión.",
      "El aprovisionamiento manual vía SSH rompe el modelo declarativo y automatizado de la arquitectura cloud native de Kubernetes.",
      "Un volumen `emptyDir` es efímero y se destruye por completo cuando el Pod es eliminado o finaliza, por lo que no es apto para bases de datos persistentes."
    ],
    "kcna-32": [
      "`ReadWriteOnce` (RWO) solo puede ser montado por **un único nodo a la vez**; si los pods residen en nodos distintos, no podrán montar el volumen.",
      "`ReadOnlyMany` (ROX) solo permite operaciones de **lectura**; las réplicas no podrán escribir ni guardar los archivos procesados.",
      "`ReadWriteOncePod` (RWOP) restringe el montaje a un único Pod en todo el clúster, impidiendo el uso concurrente por 5 réplicas.",
      null
    ],
    "kcna-33": [
      "`LoadBalancer` aprovisiona un balanceador de carga externo en el proveedor cloud con una IP pública o de red externa, exponiendo el servicio innecesariamente.",
      null,
      "`NodePort` abre un puerto accesible públicamente en la IP de cada nodo worker del clúster (rango 30000-32767), permitiendo acceso exterior no deseado.",
      "`ExternalName` mapea el servicio a un nombre DNS externo mediante CNAME sin balancear pods locales internos."
    ],
    "kcna-34": [
      "`ClusterRoleBinding` regula permisos sobre la API de Kubernetes (operaciones CRUD con kubectl), no filtra paquetes de red entre pods.",
      "Editar `/etc/hosts` en la imagen no bloquea conexiones de red entrantes a nivel de socket ni es mantenible en un entorno dinámico.",
      null,
      "El `kubelet` no gestiona el filtrado de paquetes de red de los pods; esa responsabilidad pertenece a las reglas programadas por el plugin CNI."
    ],
    "kcna-35": [
      null,
      "Cloud Native no elimina los sistemas operativos ni emula microcódigo; se basa en sistemas operativos modernos (principalmente Linux) y aislamiento de contenedores.",
      "El paradigma Cloud Native promueve microservicios desacoplados y sistemas modulares, exactamente lo contrario de arquitecturas monolíticas centralizadas.",
      "Las tecnologías Cloud Native están concebidas para operar en entornos híbridos y multi-cloud con portabilidad abierta, no para restringir cargas a centros privados."
    ],
    "kcna-36": [
      "Incrustar credenciales en el código fuente viola el Factor III (Configuración) y representa una vulnerabilidad de seguridad grave en el control de versiones.",
      "Guardar estado en el disco local viola el Factor VI (Procesos sin estado); los contenedores son efímeros y cualquier estado local se pierde al recrear el Pod.",
      "Escribir directamente en discos sin formato viola el Factor XI (Logs); las aplicaciones 12-Factor deben emitir logs a `stdout` sin gestionar archivos de registro.",
      null
    ],
    "kcna-37": [
      "La CNCF exige estrictamente la neutralidad de proveedores (vendor-neutral); ningún proyecto Graduated puede ser propiedad exclusiva de una sola empresa privada.",
      null,
      "Los proyectos en fase experimental temprana sin adopción en producción corresponden a la categoría `Sandbox`, no a la de `Graduated`.",
      "La CNCF no exige que un proyecto elimine a sus competidores; de hecho, múltiples proyectos graduados e incubados coexisten sanamente en el ecosistema."
    ],
    "kcna-38": [
      "Un Service Mesh gestiona capas de transporte y red en capa 7, no reemplaza el almacenamiento persistente ni las bases de datos de Kubernetes.",
      null,
      null,
      "Los proxies de red de un Service Mesh no analizan ni optimizan consultas SQL de bases de datos relacionales; operan sobre protocolos de red como HTTP, gRPC o TCP."
    ],
    "kcna-39": [
      "Un `ClusterRole` vinculado mediante `ClusterRoleBinding` otorgaría permisos sobre todos los namespaces del clúster, violando la restricción de aislar a `staging`.",
      "Una `NetworkPolicy` controla el flujo de tráfico de red IP entre pods, no gestiona autorizaciones sobre la API de Kubernetes ni comandos `kubectl`.",
      null,
      "Los permisos de Kubernetes se gestionan en la API mediante RBAC, no editando archivos locales `/etc/sudoers` del sistema operativo Linux de los nodos."
    ],
    "kcna-40": [
      null,
      "Incrustar el certificado de `kubernetes-admin` en una variable de entorno otorga acceso de superusuario ilimitado al contenedor, lo cual es un fallo crítico de seguridad.",
      "Deshabilitar la autorización en el API Server abriría el clúster a accesos anónimos sin autenticación, comprometiendo completamente la seguridad del sistema.",
      "Confiar ciegamente en direcciones IP de pods es extremadamente inseguro debido a la naturaleza dinámica, reutilizable y efímera de las IPs en Kubernetes."
    ],
    "kcna-41": [
      "La Gateway API soporta protocolos estándar seguros (HTTP, HTTPS, TLS, gRPC), no fuerza el uso de UDP sin cifrado.",
      "La Gateway API hace exactamente lo opuesto a un diseño monolítico: desacopla la configuración en recursos independientes para cada rol operativo.",
      "La Gateway API no utiliza puertos serie ni prescinde de redes TCP/IP modernas; enruta tráfico de red estándar con alta expresividad en capa 7.",
      null
    ],
    "kcna-42": [
      "`kube-proxy` programa reglas de reenvío de paquetes de red en los nodos; no tiene visibilidad ni capacidad de analizar manifiestos en la API.",
      null,
      "El `kube-scheduler` se encarga de ubicar pods en nodos basándose en recursos y afinidad, no de validar políticas de cumplimiento de seguridad en la admisión.",
      "Los scripts en equipos locales (como hooks de pre-commit) pueden ser evitados o desactivados por los desarrolladores; la seguridad debe ser enforced por el clúster."
    ],
    "kcna-43": [
      "CPU, memoria y disco son recursos físicos de infraestructura que pueden medirse mediante métricas, pero no constituyen los 3 pilares de la observabilidad.",
      "Autenticación, autorización y auditoría (las tres A) corresponden al dominio de la seguridad de la información y control de acceso, no de la observabilidad.",
      null,
      "Despliegues y pruebas continuas corresponden al ciclo de vida del desarrollo de software (CI/CD), no a las señales de telemetría en tiempo de ejecución."
    ],
    "kcna-44": [
      null,
      "Prometheus no utiliza un modelo push hacia bases de datos relacionales SQL; su diseño central es pull sobre una base de datos de series temporales (TSDB).",
      "Prometheus no es un sniffer pasivo de interfaces de red física; es una aplicación de capa de aplicación que hace scraping HTTP explícito.",
      "Prometheus no compila código ni modifica binarios; su función está estrictamente enfocada en la recolección, almacenamiento y consulta de métricas."
    ],
    "kcna-45": [
      "OpenTelemetry no es un sistema operativo ni compite con el kernel de Linux; es un marco de observabilidad de capa de aplicación.",
      "OpenTelemetry no incluye una base de datos relacional transaccional; delega el almacenamiento en backends dedicados de observabilidad.",
      "Las pruebas de carga y estrés se realizan con herramientas especializadas (como k6 o Locust), no forman parte del alcance de OpenTelemetry.",
      null
    ],
    "kcna-46": [
      "`cAdvisor` no gestiona certificados TLS y `Alertmanager` no reinicia contenedores; Alertmanager es exclusivamente un sistema de gestión y enrutamiento de alertas.",
      null,
      "Los backups de `etcd` los gestionan herramientas de administración de datos (como `etcdctl` o Velero), no `cAdvisor`.",
      "`cAdvisor` recolecta métricas técnicas de recursos de contenedores en el host, no es una herramienta de tarificación financiera cloud."
    ],
    "kcna-47": [
      "Conectarse por SSH a nodos en producción para modificar configuraciones manualmente es exactamente la antítesis de la inmutabilidad y de GitOps.",
      "Los cambios manuales mediante consolas web crean desincronización no auditada (drift) y violan el principio de versión única en Git.",
      null,
      "GitOps utiliza manifiestos declarativos legibles por humanos (YAML, Kustomize, Helm) almacenados en repositorios de control de versiones, no código en ensamblador."
    ],
    "kcna-48": [
      "Ni Helm ni Kustomize compilan código de kernel ni son bases de datos; ambas son herramientas de gestión y empaquetado de manifiestos declarativos de Kubernetes.",
      "Helm opera en cualquier entorno de Kubernetes (público o privado) y Kustomize no requiere privilegios de root ni interactúa directamente con el hardware.",
      "La gestión de TLS y la monitorización de recursos son tareas de cert-manager y Prometheus respectivamente, no el propósito de Helm ni de Kustomize.",
      null
    ],
    "kcna-49": [
      null,
      null,
      "Los scripts imperativos ejecutados manualmente contradicen radicalmente el principio declarativo y automatizado de GitOps.",
      "Permitir cambios externos sin registrarlos en Git crea divergencia oculta (drift) y destruye a Git como fuente única y auditable de la verdad."
    ],
    "kcna-50": [
      null,
      "La estrategia `Recreate` destruye todas las réplicas v1 a la vez, causando tiempo de inactividad (downtime) y afectando al 100% de los usuarios.",
      "`Blue/Green` conmuta de golpe el **100% del tráfico** hacia el nuevo entorno una vez validado; no divide el tráfico en porcentajes progresivos (90/10).",
      "`RollingUpdate` estándar sustituye réplicas pod a pod pero sin control fino porcentual de tráfico basado en pesos de capa 7."
    ]
  },
  "glossary": [
    {
      "term": "kube-apiserver",
      "cat": "Control Plane",
      "d": 1,
      "def": "Componente central del Control Plane que expone la API REST de Kubernetes; autentica, autoriza, valida y muta solicitudes y es el único proceso con acceso directo a etcd."
    },
    {
      "term": "etcd",
      "cat": "Control Plane",
      "d": 1,
      "def": "Almacén clave-valor distribuido y consistente basado en el algoritmo de consenso Raft que almacena la totalidad del estado declarativo y en tiempo real del clúster."
    },
    {
      "term": "kube-scheduler",
      "cat": "Control Plane",
      "d": 1,
      "def": "Componente del plano de control que detecta pods sin nodo asignado y selecciona el nodo más adecuado mediante fases secuenciales de filtrado (predicates) y priorización (scoring)."
    },
    {
      "term": "kube-controller-manager",
      "cat": "Control Plane",
      "d": 1,
      "def": "Binario que empaqueta y ejecuta los bucles de control centrales de Kubernetes (Node Lifecycle, ReplicaSet, Endpoints, ServiceAccount) para reconciliar el estado real con el deseado."
    },
    {
      "term": "cloud-controller-manager",
      "cat": "Control Plane",
      "d": 1,
      "def": "Componente que desacopla la lógica específica del proveedor de nube (rutas de red, instancias de nodos y aprovisionamiento de balanceadores externos) del núcleo de Kubernetes."
    },
    {
      "term": "kubelet",
      "cat": "Worker Node",
      "d": 1,
      "def": "Agente primario que se ejecuta en cada nodo worker; interpreta PodSpecs recibidos del apiserver, gestiona el ciclo de vida de los contenedores mediante CRI y reporta su estado de salud."
    },
    {
      "term": "kube-proxy",
      "cat": "Worker Node",
      "d": 1,
      "def": "Proceso de red en cada nodo que programa reglas en iptables o IPVS para implementar la abstracción virtual de Service y permitir el enrutamiento de tráfico hacia los pods adecuados."
    },
    {
      "term": "CRI (Container Runtime Interface)",
      "cat": "Runtime",
      "d": 1,
      "def": "Estándar de interfaz gRPC que permite al kubelet interoperar con múltiples motores de ejecución de contenedores (como containerd o CRI-O) sin recompilar el código fuente de Kubernetes."
    },
    {
      "term": "Pod",
      "cat": "Workloads",
      "d": 1,
      "def": "Unidad de cómputo más pequeña y básica desplegable en Kubernetes; encapsula uno o más contenedores estrechamente acoplados que comparten almacenamiento, dirección IP y localhost."
    },
    {
      "term": "DaemonSet",
      "cat": "Workloads",
      "d": 1,
      "def": "Controlador que garantiza que una copia de un pod se ejecute en todos los nodos (o en un subconjunto filtrado por selectores), típico para agentes de telemetría, logs o proxies CNI."
    },
    {
      "term": "StatefulSet",
      "cat": "Workloads",
      "d": 1,
      "def": "Controlador de cargas de trabajo diseñado para aplicaciones con estado que requieren identidades de red ordinales fijas (ej. app-0), persistencia dedicada y orden estricto de despliegue."
    },
    {
      "term": "ConfigMap y Secret",
      "cat": "Configuración",
      "d": 1,
      "def": "Primitivas para inyectar configuraciones desacopladas del contenedor; ConfigMap almacena texto plano y variables, mientras que Secret guarda credenciales y datos sensibles cifrables en reposo."
    },
    {
      "term": "QoS Classes (Guaranteed, Burstable, BestEffort)",
      "cat": "Recursos",
      "d": 2,
      "def": "Clasificación asignada por Kubernetes a cada Pod según la presencia y equivalencia de sus requests y limits de CPU y memoria; determina la prioridad de desalojo (eviction) ante saturación."
    },
    {
      "term": "Taints y Tolerations",
      "cat": "Scheduling",
      "d": 2,
      "def": "Mecanismo de repulsión de nodos: un Taint aplicado a un nodo impide que pods sin una Toleration coincidente puedan ser programados o permanecer ejecutándose en él."
    },
    {
      "term": "Liveness y Readiness Probes",
      "cat": "Ciclo de Vida",
      "d": 2,
      "def": "Sondas del kubelet; Liveness reinicia el contenedor si entra en deadlock, mientras que Readiness remueve el pod de los endpoints del Service si aún no puede atender tráfico de usuarios."
    },
    {
      "term": "CNI (Container Network Interface)",
      "cat": "Networking",
      "d": 2,
      "def": "Especificación estándar de la CNCF para configurar interfaces de red en contenedores Linux, garantizando el modelo plano de Kubernetes donde cada Pod tiene una IP única."
    },
    {
      "term": "CSI y StorageClass",
      "cat": "Almacenamiento",
      "d": 2,
      "def": "CSI desacopla los plugins de almacenamiento del código de K8s, y StorageClass define el aprovisionador y los parámetros necesarios para crear volúmenes persistentes (PV) de forma dinámica."
    },
    {
      "term": "NetworkPolicy",
      "cat": "Seguridad de Red",
      "d": 2,
      "def": "Recurso de Kubernetes que especifica cómo grupos de pods pueden comunicarse entre sí y con otros endpoints de red en capa 3 y 4 mediante reglas declarativas de Ingress y Egress."
    },
    {
      "term": "HPA (Horizontal Pod Autoscaler)",
      "cat": "Escalabilidad",
      "d": 2,
      "def": "Controlador que ajusta automáticamente el número de réplicas de un Deployment o ReplicaSet en función de la utilización observada de CPU, memoria o métricas personalizadas."
    },
    {
      "term": "CNCF Graduation Levels",
      "cat": "Ecosistema CNCF",
      "d": 3,
      "def": "Niveles de madurez de proyectos en la CNCF: Sandbox (fase experimental temprana), Incubating (adopción real y gobernanza sólida) y Graduated (máxima madurez técnica y seguridad auditada)."
    },
    {
      "term": "Service Mesh y mTLS",
      "cat": "Arquitectura",
      "d": 3,
      "def": "Capa de infraestructura dedicada con proxies sidecar (ej. Envoy) que gestiona tráfico este-oeste, aplicando cifrado mutuo (mTLS), control de tráfico y telemetría sin modificar el código."
    },
    {
      "term": "RBAC (Role-Based Access Control)",
      "cat": "Seguridad",
      "d": 3,
      "def": "Modelo de control de acceso que regula permisos sobre la API de Kubernetes mediante Roles (alcance de namespace), ClusterRoles (alcance global) y sus correspondientes vinculaciones (Bindings)."
    },
    {
      "term": "Gateway API",
      "cat": "Networking",
      "d": 3,
      "def": "Evolución de Ingress con una arquitectura orientada a roles (GatewayClass para infra, Gateway para operadores y HTTPRoute para desarrolladores) con soporte nativo avanzado de capa 7."
    },
    {
      "term": "Prometheus y PromQL",
      "cat": "Observabilidad",
      "d": 4,
      "def": "Sistema de monitorización de series temporales basado en recolección por pull HTTP, acompañado del lenguaje PromQL para consultas, alertas y cálculo de SLIs y SLOs."
    },
    {
      "term": "OpenGitOps",
      "cat": "GitOps",
      "d": 5,
      "def": "Conjunto de principios abiertos de la CNCF que definen GitOps: estado deseado declarativo, versionado e inmutable en Git, obtenido por agentes pull y reconciliado de forma continua."
    }
  ]
};
})(window);
