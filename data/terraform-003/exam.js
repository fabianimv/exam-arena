/* =========================================================================
   data/terraform-003/exam.js — HashiCorp Certified Terraform Associate (003)
   50 preguntas en los 6 dominios oficiales con explicación por opción errónea (WHY)
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["terraform-003"] = {
  "id": "terraform-003",
  "appId": "terraform-003",
  "provider": "HashiCorp",
  "badge": "Terraform · 003",
  "icon": "🟪",
  "color": "#7b42bc",
  "featured": false,
  "title": "HashiCorp · Terraform Associate (003)",
  "subtitle": "IaC, HCL, State Management, Locking, Modules, Workspaces, Drift y HCP Terraform",
  "passingScore": 70,
  "domains": {
    "1": "Conceptos de IaC y Terraform Core (15 %)",
    "2": "Workflow Básico: Init, Plan, Apply, Destroy (20 %)",
    "3": "Gestión de Estado y Remote Backends (20 %)",
    "4": "Módulos, Workspaces y Reutilización (20 %)",
    "5": "HCL, Variables, Funciones y Expresiones (15 %)",
    "6": "HCP Terraform, Sentinel y Seguridad (10 %)"
  },
  "shortDomains": {
    "1": "IaC Core",
    "2": "Workflow CLI",
    "3": "State & Locks",
    "4": "Modules",
    "5": "HCL & Vars",
    "6": "HCP & Policy"
  },
  "topics": [
    {
      "id": "tf-t-1-1",
      "d": 1,
      "title": "1.1 · Fundamentos de IaC, Enfoque Declarativo vs. Imperativo e Idempotencia",
      "html": "<h4>Infraestructura como Código (IaC) y el Paradigma Declarativo</h4>\n<p>La Infraestructura como Código (IaC) permite provisionar, configurar y gobernar recursos informáticos mediante definiciones legibles por máquina en archivos versionables, en lugar de configuraciones manuales en consolas web o scripts ad-hoc.</p>\n<table class=\"keytable\">\n<tr><th>Paradigma</th><th>Mecanismo Operativo</th><th>Ejemplo en IaC / Herramienta</th><th>Comportamiento ante Cambios</th></tr>\n<tr><td><b>Declarativo</b></td><td>El ingeniero define el <b>estado final deseado</b>. El motor calcula las diferencias (delta) entre el estado real y el deseado.</td><td><b>Terraform (HCL)</b>, Kubernetes manifests, AWS CloudFormation.</td><td>Si se cambia el tamaño de una VM de <code>t3.micro</code> a <code>t3.large</code>, el motor determina si aplica un resize o un reemplazo sin pasos intermedios manuales.</td></tr>\n<tr><td><b>Imperativo</b></td><td>El ingeniero define la <b>secuencia exacta de comandos</b> paso a paso que deben ejecutarse para alcanzar el objetivo.</td><td>Bash scripts, AWS CLI, Python boto3 procedural.</td><td>Para actualizar una VM, el script debe verificar si existe, consultar su estado, detenerla, modificarla e iniciarla explícitamente.</td></tr>\n</table>\n\n<h4>El Principio de Idempotencia</h4>\n<p>Una operación es <b>idempotente</b> si ejecutarla múltiples veces consecutivas produce exactamente el mismo resultado final en el sistema sin efectos secundarios no deseados:</p>\n<ul>\n  <li><b>Ejecución 1:</b> Si el recurso no existe, Terraform lo crea.</li>\n  <li><b>Ejecución 2 (sin cambios de código):</b> Terraform detecta que el estado real coincide al 100 % con el código y reporta: <code>No changes. Your infrastructure matches the configuration.</code></li>\n  <li><b>Infraestructura Inmutable:</b> En lugar de parchar servidores en caliente (drift mutable), Terraform promueve reemplazar instancias desactualizadas por versiones nuevas pre-empaquetadas (AMIs con Packer).</li>\n</ul>\n<div class=\"tip\"><b>Clave de Examen 003:</b> Terraform es estrictamente <b>declarativo</b> e <b>idempotente</b>. La responsabilidad de traducir el qué en el cómo recae enteramente en el plugin del proveedor correspondiente.</div>"
    },
    {
      "id": "tf-t-1-2",
      "d": 1,
      "title": "1.2 · Arquitectura Terraform Core, Proveedores (Plugins) y Ciclo de Vida RPC",
      "html": "<h4>Separación Arquitectónica: Terraform Core vs. Plugins</h4>\n<p>Terraform utiliza una arquitectura modular basada en microprocesos desacoplados que se comunican mediante llamadas a procedimiento remoto sobre sockets gRPC:</p>\n<table class=\"keytable\">\n<tr><th>Componente</th><th>Responsabilidades Principales</th><th>Distribución / Binario</th></tr>\n<tr><td><b>Terraform Core</b></td><td>Lectura e interpretación de archivos HCL, construcción del Grafo Acíclico Dirigido (DAG), gestión del archivo de estado (<code>terraform.tfstate</code>), cálculo de diferencias (diff) y orquestación de llamadas RPC.</td><td>Binario estático compilado en Go (<code>terraform</code>). Totalmente independiente de la nube o proveedor.</td></tr>\n<tr><td><b>Provider Plugins</b></td><td>Traducción de operaciones abstractas (Create, Read, Update, Delete) en llamadas reales a las APIs de los proveedores (AWS SDK, Azure ARM, Google Cloud API, Kubernetes API).</td><td>Binarios descargados dinámicamente en <code>.terraform/providers/</code> desde el Terraform Registry durante <code>terraform init</code>.</td></tr>\n</table>\n\n<h4>El Archivo de Bloqueo de Proveedores (.terraform.lock.hcl)</h4>\n<p>Introducido en Terraform 0.14, el <b>Dependency Lock File</b> garantiza la reproducibilidad absoluta de los despliegues entre desarrolladores y pipelines de CI/CD:</p>\n<ul>\n  <li>Registra la versión exacta seleccionada del proveedor y los <b>hashes criptográficos SHA-256</b> de sus paquetes binarios multiplataforma (<code>h1:</code> schemes).</li>\n  <li><b>Regla de Versionado:</b> <code>~> 5.0</code> permite versiones compatibles como <code>5.1</code> o <code>5.40</code>, pero bloquea <code>6.0</code> (major breaking changes).</li>\n  <li><b>Buenas Prácticas en Git:</b> El archivo <code>.terraform.lock.hcl</code> <b>debe incluirse en el control de versiones (Git)</b>, mientras que la carpeta <code>.terraform/</code> debe ignorarse en <code>.gitignore</code>.</li>\n</ul>\n<div class=\"tip\"><b>Pregunta Frecuente:</b> Si un proveedor no se encuentra instalado en la máquina, ¿qué comando debe ejecutarse? Siempre <code>terraform init</code>. Core no descarga plugins en <code>plan</code> o <code>apply</code>.</div>"
    },
    {
      "id": "tf-t-2-1",
      "d": 2,
      "title": "2.1 · Workflow CLI: Init, Plan, Apply, Destroy y Modos de Ejecución (-refresh-only, -target)",
      "html": "<h4>El Ciclo de Vida Esencial del CLI de Terraform</h4>\n<p>El flujo estándar de trabajo con Terraform se compone de cuatro pasos fundamentales que garantizan un desarrollo colaborativo, seguro y determinista:</p>\n<table class=\"keytable\">\n<tr><th>Fase / Comando</th><th>Acciones que Ejecuta</th><th>Efectos en Estado e Infraestructura</th></tr>\n<tr><td><code>terraform init</code></td><td>Configura el backend de estado, descarga los módulos referenciados y obtiene los binarios de proveedores requeridos registrándolos en el lock file.</td><td>Crea el directorio local <code>.terraform/</code> y <code>.terraform.lock.hcl</code>. No contacta la nube para leer ni crear recursos.</td></tr>\n<tr><td><code>terraform plan</code></td><td>Ejecuta un refresh implícito (lee la nube), compara con <code>main.tf</code> y calcula el plan de ejecución predictivo (<code>+ create, ~ update, - destroy</code>).</td><td>Lectura pura en la nube. Con <code>-out=tfplan</code> genera un archivo binario inmutable garantizado para el despliegue.</td></tr>\n<tr><td><code>terraform apply</code></td><td>Solicita confirmación manual interactiva (salvo <code>-auto-approve</code> o si recibe un plan guardado), invoca las APIs de los proveedores y actualiza el estado.</td><td>Crea, modifica o destruye recursos reales en el proveedor cloud y persiste la nueva versión en <code>terraform.tfstate</code>.</td></tr>\n<tr><td><code>terraform destroy</code></td><td>Calcula el plan inverso de destrucción siguiendo el DAG en sentido contrario y solicita confirmación antes de purgar los recursos.</td><td>Equivalente a <code>terraform apply -destroy</code>. Elimina toda la infraestructura gestionada en la configuración.</td></tr>\n</table>\n\n<h4>Modos de Ejecución Especiales</h4>\n<ul>\n  <li><b>-refresh-only (Terraform 0.15+):</b> Inspecciona la infraestructura real y actualiza el estado para reflejar el drift (cambios externos) sin proponer modificaciones en la nube. Sustituye de forma segura al comando legado <code>terraform refresh</code>.</li>\n  <li><b>-target=resource.name:</b> Aísla la ejecución a un único recurso o módulo. Es un <b>antipatrón para uso regular</b>; debe reservarse únicamente para recuperaciones de desastres o dependencias circulares complejas, ya que puede dejar el estado desincronizado.</li>\n</ul>\n<div class=\"tip\"><b>CI/CD Best Practice:</b> En pipelines automatizados, separa siempre <code>terraform plan -out=tfplan</code> en la etapa de pull request de <code>terraform apply tfplan</code> en la etapa de merge a producción. Esto garantiza que lo aprobado sea exactamente lo ejecutado sin condiciones de carrera.</div>"
    },
    {
      "id": "tf-t-2-2",
      "d": 2,
      "title": "2.2 · Inspección y Formato: validate, fmt, graph, console y Troubleshooting (TF_LOG)",
      "html": "<h4>Herramientas de Análisis Estático, Formato e Inspección</h4>\n<p>Terraform provee comandos locales rápidos que permiten verificar la sanidad del código antes de invocar las APIs remotas:</p>\n<table class=\"keytable\">\n<tr><th>Comando</th><th>Alcance / Validación Realizada</th><th>¿Requiere Acceso a la Red / APIs Cloud?</th></tr>\n<tr><td><code>terraform validate</code></td><td>Verifica sintaxis HCL2, tipos de datos en variables, argumentos requeridos en recursos y consistencia entre bloques locales.</td><td><b>No.</b> Solo requiere que <code>terraform init</code> haya descargado los esquemas de los proveedores previamente.</td></tr>\n<tr><td><code>terraform fmt</code></td><td>Aplica el estilo canónico de espaciado, indentación y alineación de HashiCorp a todos los archivos <code>.tf</code>.</td><td><b>No.</b> Con el flag <code>-check</code> devuelve exit code 1 si hay archivos mal formateados (ideal para linter en CI).</td></tr>\n<tr><td><code>terraform console</code></td><td>Consola interactiva REPL para evaluar expresiones HCL, funciones integradas (<code>cidrsubnet</code>, <code>jsonencode</code>) y consultar valores de estado en vivo.</td><td>Solo lectura local sobre el estado cargado. No permite invocar mutaciones.</td></tr>\n<tr><td><code>terraform graph</code></td><td>Genera una representación visual en formato DOT del Grafo Acíclico Dirigido (DAG) de dependencias entre recursos y proveedores.</td><td>Permite diagnosticar orden de ejecución y paralelismo pasándolo a Graphviz: <code>terraform graph | dot -Tpng > graph.png</code>.</td></tr>\n</table>\n\n<h4>Troubleshooting Avanzado: Variables de Entorno de Logging</h4>\n<p>Cuando un comando falla con errores opacos de la API o problemas de autenticación, se habilita el logging detallado del core y proveedores:</p>\n<ul>\n  <li><code>TF_LOG=TRACE</code>: Nivel máximo de detalle; muestra cabeceras HTTP, payloads JSON completos de las llamadas REST a las APIs del proveedor.</li>\n  <li>Niveles disponibles (de menor a mayor verbosidad): <code>OFF</code>, <code>ERROR</code>, <code>WARN</code>, <code>INFO</code>, <code>DEBUG</code>, <code>TRACE</code>.</li>\n  <li><code>TF_LOG_PATH=terraform.log</code>: Redirige los logs del CLI a un archivo en disco, evitando saturar la salida estándar del terminal.</li>\n</ul>\n<div class=\"tip\"><b>Diferencia Crítica de Examen:</b> <code>terraform validate</code> <b>no detecta</b> si un nombre de bucket de S3 ya existe en AWS o si tus credenciales de nube expiraron; para detectar eso se requiere <code>terraform plan</code>.</div>"
    },
    {
      "id": "tf-t-3-1",
      "d": 3,
      "title": "3.1 · Anatomía del Estado (terraform.tfstate), Bloqueos (State Locking) y Remote Backends",
      "html": "<h4>El Rol Fundamental de terraform.tfstate</h4>\n<p>Terraform necesita un mecanismo para correlacionar la configuración declarativa escrita en HCL con las entidades físicas reales en la infraestructura cloud. Ese mecanismo es el archivo <b>JSON de estado</b> (<code>terraform.tfstate</code>):</p>\n<ul>\n  <li><b>Mapeo de Identificadores:</b> Asocia el identificador lógico de HCL (p. ej. <code>aws_instance.web</code>) con el ID unívoco de la nube (p. ej. <code>i-04a1bc239f88</code>).</li>\n  <li><b>Caché de Rendimiento:</b> Almacena atributos y dependencias para no consultar todas las APIs en cada evaluación de grafo.</li>\n  <li><b>Metadatos:</b> Guarda punteros a versiones de providers y punteros a dependencias entre módulos.</li>\n</ul>\n\n<h4>Remote Backends y Bloqueo de Estado (State Locking)</h4>\n<table class=\"keytable\">\n<tr><th>Backend</th><th>Almacenamiento del Estado</th><th>Mecanismo de State Locking</th><th>Soporte de Cifrado en Reposo</th></tr>\n<tr><td><b>local (default)</b></td><td>Archivo <code>terraform.tfstate</code> en el disco local de la máquina.</td><td>Locks a nivel de sistema operativo en el archivo local.</td><td>Depende del cifrado de disco del host. Inadecuado para equipos.</td></tr>\n<tr><td><b>s3 (AWS)</b></td><td>Objetos en Amazon S3 Bucket versionado.</td><td>Tabla de <b>Amazon DynamoDB</b> con clave primaria <code>LockID</code> (tipo String).</td><td>SSE-S3 / SSE-KMS con políticas IAM de mínimo privilegio.</td></tr>\n<tr><td><b>azurerm (Azure)</b></td><td>Blob en Azure Blob Storage (Storage Account).</td><td>Mecanismo nativo de <b>Blob Lease</b> de Azure Storage.</td><td>Cifrado del lado del servicio de Azure Storage con RBAC.</td></tr>\n<tr><td><b>gcs (Google)</b></td><td>Bucket en Google Cloud Storage.</td><td>Bloqueo nativo integrado en la API de GCS mediante preconditions.</td><td>Cifrado por defecto con Google-managed o CMEK.</td></tr>\n<tr><td><b>remote / cloud</b></td><td>HCP Terraform / Terraform Enterprise.</td><td>Bloqueo transaccional automático gestionado en plataforma.</td><td>Cifrado en reposo y tránsito con control de acceso RBAC estricto.</td></tr>\n</table>\n<div class=\"tip\"><b>¿Qué es un Lock huérfano?</b> Si un pipeline de CI falla abruptamente (p. ej. runner asesinado por OOM), el lock puede quedar retenido. Se libera de forma controlada mediante <code>terraform force-unlock &lt;LOCK-ID&gt;</code> tras verificar que ningún proceso está activo.</div>"
    },
    {
      "id": "tf-t-3-2",
      "d": 3,
      "title": "3.2 · Manipulación Avanzada de Estado: import, state rm, state mv y Bloques moved",
      "html": "<h4>Operaciones Seguras y Refactorización del Estado</h4>\n<p>El archivo de estado nunca debe editarse manualmente con un editor de texto (riesgo de corrupción de JSON o checksum inválido). Terraform provee comandos de manipulación atómica:</p>\n<table class=\"keytable\">\n<tr><th>Operación / Comando</th><th>Propósito Técnico</th><th>Impacto en la Nube Real</th></tr>\n<tr><td><code>terraform import &lt;addr&gt; &lt;id&gt;</code></td><td>Vincula un recurso preexistente en la nube al estado de Terraform bajo una dirección HCL dada.</td><td><b>Cero impacto destructivo.</b> Solo lee el recurso de la nube y lo escribe en <code>terraform.tfstate</code>.</td></tr>\n<tr><td><code>import { to = ... id = ... }</code></td><td>Sintaxis declarativa de importación (Terraform 1.5+). Permite versionar la importación y generar código HCL con <code>-generate-config-out</code>.</td><td><b>Cero impacto destructivo.</b> Se ejecuta de forma predecible durante el flujo normal de <code>terraform apply</code>.</td></tr>\n<tr><td><code>terraform state rm &lt;addr&gt;</code></td><td>Elimina un recurso del archivo de estado sin destruirlo en la nube.</td><td>El recurso físico <b>continúa existiendo en la nube</b>; Terraform simplemente deja de gestionarlo.</td></tr>\n<tr><td><code>terraform state mv &lt;src&gt; &lt;dst&gt;</code></td><td>Renombra un recurso o lo traslada de un módulo a otro dentro del archivo de estado.</td><td>Evita que Terraform destruya el recurso viejo y cree uno nuevo al cambiar su nombre en el código.</td></tr>\n<tr><td><code>moved { from = ... to = ... }</code></td><td>Bloque declarativo en HCL (Terraform 1.1+) para registrar migraciones de nombres o módulos en el código fuente versionado.</td><td><b>Excelente para refactorizaciones:</b> Cualquier usuario o CI/CD que ejecute <code>apply</code> actualiza el estado automáticamente sin recrear nada.</td></tr>\n</table>\n\n<h4>Inspección Rápida del Estado</h4>\n<ul>\n  <li><code>terraform state list</code>: Lista todas las direcciones de recursos gestionados en el estado actual (ej. <code>aws_vpc.main</code>, <code>module.vpc.aws_subnet.public[0]</code>).</li>\n  <li><code>terraform state show &lt;addr&gt;</code>: Muestra todos los atributos almacenados para un recurso específico en formato HCL legible.</li>\n</ul>\n<div class=\"tip\"><b>Pregunta Clave:</b> Quieres dejar de gestionar una base de datos RDS con Terraform pero mantenerla intacta en producción. ¿Qué comando usas? <code>terraform state rm aws_db_instance.prod</code>. Nunca <code>terraform destroy</code>.</div>"
    },
    {
      "id": "tf-t-4-1",
      "d": 4,
      "title": "4.1 · Módulos: Estructura Estándar, Fuentes (Registry, Git, Local) y Variables/Outputs",
      "html": "<h4>Estructura Estándar de Módulos en Terraform</h4>\n<p>Un módulo es un contenedor de recursos agrupados para encapsular lógica de infraestructura, promover la reutilización y aplicar estándares de ingeniería:</p>\n<ul>\n  <li><b>Root Module:</b> El directorio de trabajo principal donde se ejecutan los comandos del CLI de Terraform.</li>\n  <li><b>Child Module:</b> Cualquier módulo invocado dentro de otro módulo mediante un bloque <code>module \"nombre\" { ... }</code>.</li>\n  <li><b>Estructura canónica recomendada:</b>\n    <ul>\n      <li><code>main.tf</code>: Definición de recursos y lógica principal del módulo.</li>\n      <li><code>variables.tf</code>: Declaración de variables de entrada (inputs) con tipos y descripciones.</li>\n      <li><code>outputs.tf</code>: Declaración de valores expuestos para que el módulo padre pueda consumirlos.</li>\n      <li><code>README.md</code> y <code>LICENSE</code>: Documentación obligatoria para publicación en Registries.</li>\n    </ul>\n  </li>\n</ul>\n\n<h4>Fuentes de Módulos (Source Types)</h4>\n<table class=\"keytable\">\n<tr><th>Tipo de Fuente</th><th>Ejemplo de Sintaxis en HCL</th><th>Regla de Versionado / Inicialización</th></tr>\n<tr><td><b>Terraform Registry</b></td><td><code>source = \"terraform-aws-modules/vpc/aws\"</code><br><code>version = \"~> 5.0\"</code></td><td>Soporta el argumento <code>version</code> con restricciones semánticas (SemVer). Requiere <code>terraform init</code>.</td></tr>\n<tr><td><b>Ruta Local</b></td><td><code>source = \"./modules/security-groups\"</code></td><td>No soporta argumento <code>version</code>. Siempre lee directamente del sistema de archivos local en disco.</td></tr>\n<tr><td><b>Git Repository</b></td><td><code>source = \"git::https://example.com/vpc.git?ref=v2.1.0\"</code></td><td>Permite anclar a ramas, tags o commits específicos con el parámetro <code>?ref=</code>.</td></tr>\n<tr><td><b>S3 / GCS Bucket</b></td><td><code>source = \"s3::https://s3.amazonaws.com/my-tf-modules/vpc.zip\"</code></td><td>Descarga y descomprime paquetes versionados de módulos desde almacenamiento de objetos.</td></tr>\n</table>\n\n<h4>Flujo de Datos: Inputs y Outputs</h4>\n<p>Los módulos hijos actúan como cajas negras: el módulo padre pasa valores mediante <b>inputs</b> (argumentos del bloque <code>module</code>) y consume los resultados generados invocando la sintaxis <code>module.&lt;MODULE_NAME&gt;.&lt;OUTPUT_NAME&gt;</code>.</p>\n<div class=\"tip\"><b>Regla Estricta:</b> Un módulo padre <b>no puede acceder directamente</b> a los atributos internos de un recurso dentro de un módulo hijo (ej. <code>aws_subnet.public.id</code>). El módulo hijo debe exponerlo explícitamente en su <code>outputs.tf</code>.</div>"
    },
    {
      "id": "tf-t-4-2",
      "d": 4,
      "title": "4.2 · Terraform Workspaces: Gestión Multi-Ambiente (CLI vs HCP Terraform)",
      "html": "<h4>Workspaces en el CLI de Terraform (Open Source)</h4>\n<p>Los Workspaces del CLI permiten asociar múltiples archivos de estado independientes al mismo directorio de código HCL local:</p>\n<table class=\"keytable\">\n<tr><th>Comando</th><th>Acción Realizada</th></tr>\n<tr><td><code>terraform workspace list</code></td><td>Muestra los workspaces existentes en el backend (el activo aparece marcado con un asterisco <code>*</code>).</td></tr>\n<tr><td><code>terraform workspace new dev</code></td><td>Crea un nuevo workspace llamado <code>dev</code> y conmuta inmediatamente hacia él.</td></tr>\n<tr><td><code>terraform workspace select prod</code></td><td>Cambia el contexto de ejecución al workspace existente <code>prod</code>.</td></tr>\n<tr><td><code>terraform workspace show</code></td><td>Imprime el nombre del workspace actualmente activo en la sesión del terminal.</td></tr>\n</table>\n\n<h4>Aislamiento del Estado y Variable Interpolada</h4>\n<ul>\n  <li><b>Estado Aislado:</b> En local se almacena en <code>terraform.tfstate.d/&lt;workspace_name&gt;/terraform.tfstate</code>. En S3 se ubica bajo el prefijo <code>env:/&lt;workspace_name&gt;/...</code>.</li>\n  <li><b>Interpolación:</b> La expresión <code>terraform.workspace</code> devuelve el nombre del workspace actual en tiempo de ejecución (ej. <code>env = terraform.workspace</code>).</li>\n</ul>\n\n<h4>Limitaciones de los Workspaces de CLI vs. HCP Terraform Workspaces</h4>\n<table class=\"keytable\">\n<tr><th>Criterio</th><th>CLI Workspaces (OSS)</th><th>HCP Terraform Workspaces</th></tr>\n<tr><td><b>Código HCL</b></td><td>Mismo código para todos los workspaces.</td><td>Puede asociarse a diferentes ramas (<code>dev</code> vs <code>main</code>) o repositorios.</td></tr>\n<tr><td><b>Variables y Credenciales</b></td><td>Comparten los mismos archivos <code>.tfvars</code> a menos que se pasen por flag manual.</td><td>Variables de entorno y de Terraform segregadas de forma nativa con RBAC y valores sensibles.</td></tr>\n<tr><td><b>Permisos / Seguridad</b></td><td>Mismo acceso a nivel de nube para quien ejecute el CLI.</td><td>Permisos granulares: quién puede planificar vs quién puede aprobar en producción.</td></tr>\n</table>\n<div class=\"tip\"><b>Consejo de Arquitectura en Producción:</b> Para ambientes con diferencias estructurales críticas (ej. Dev con 1 AZ y Prod con Multi-AZ y direct connect) o cuentas de nube distintas, se recomienda <b>directorios separados</b> o <b>HCP Workspaces</b> en lugar de CLI workspaces.</div>"
    },
    {
      "id": "tf-t-5-1",
      "d": 5,
      "title": "5.1 · HCL: Tipos de Datos, Precedencia de Variables, Outputs y Atributo sensitive",
      "html": "<h4>Tipos de Datos en HashiCorp Configuration Language (HCL2)</h4>\n<p>Terraform cuenta con un sistema de tipos estático y expresivo dividido en tipos primitivos y complejos:</p>\n<table class=\"keytable\">\n<tr><th>Categoría</th><th>Tipos de Datos</th><th>Ejemplo en HCL</th></tr>\n<tr><td><b>Primitivos</b></td><td><code>string</code>, <code>number</code>, <code>bool</code></td><td><code>\"us-east-1\"</code>, <code>443</code>, <code>true</code></td></tr>\n<tr><td><b>Colecciones (Homogéneas)</b></td><td><code>list(&lt;type&gt;)</code>, <code>set(&lt;type&gt;)</code>, <code>map(&lt;type&gt;)</code></td><td><code>[\"a\", \"b\"]</code>, <code>tomap({\"env\" = \"prod\"})</code></td></tr>\n<tr><td><b>Estructurales (Heterogéneas)</b></td><td><code>tuple([...])</code>, <code>object({...})</code></td><td><code>object({ name = string, port = number })</code></td></tr>\n</table>\n\n<h4>Jerarquía Estricta de Precedencia de Variables (De Mayor a Menor)</h4>\n<p>Si el mismo nombre de variable se define en múltiples fuentes, Terraform resuelve el valor siguiendo este orden inequívoco:</p>\n<ol>\n  <li><b>Flags de línea de comandos CLI:</b> <code>-var</code> o <code>-var-file</code> (Prioridad Máxima).</li>\n  <li><b>Archivos *.auto.tfvars o *.auto.tfvars.json:</b> Evaluados en orden alfabético de nombre de archivo.</li>\n  <li><b>Archivo terraform.tfvars.json:</b> Definiciones JSON estáticas estándar.</li>\n  <li><b>Archivo terraform.tfvars:</b> El archivo de variables por defecto más común.</li>\n  <li><b>Variables de entorno del sistema:</b> Con el prefijo <code>TF_VAR_&lt;variable_name&gt;</code> (ej. <code>TF_VAR_region=\"eu-west-1\"</code>).</li>\n  <li><b>Valor por defecto:</b> Argumento <code>default = ...</code> en la declaración de <code>variable</code> (Prioridad Mínima).</li>\n</ol>\n\n<h4>El Atributo sensitive = true</h4>\n<ul>\n  <li>Se puede declarar en variables de entrada y en bloques de <code>output</code>.</li>\n  <li><b>Efecto en Consola:</b> Enmascara el valor en las salidas de <code>plan</code>, <code>apply</code> y <code>output</code> mostrando <code>(sensitive value)</code>.</li>\n  <li><b>Advertencia de Seguridad Crucial:</b> El atributo <code>sensitive</code> <b>NO cifra el valor</b> en el archivo <code>terraform.tfstate</code>; el valor sigue almacenado en texto plano dentro del JSON de estado.</li>\n</ul>\n<div class=\"tip\"><b>Regla Mnemotécnica de Precedencia:</b> El CLI manda sobre los archivos <code>auto</code>, estos sobre <code>terraform.tfvars</code>, este sobre <code>TF_VAR_*</code> y finalmente el <code>default</code> en el código.</div>"
    },
    {
      "id": "tf-t-5-2",
      "d": 5,
      "title": "5.2 · Expresiones Dinámicas: count vs for_each, dynamic blocks, splat y Funciones Nativas",
      "html": "<h4>count vs. for_each: Estabilidad de Identificadores</h4>\n<p>Para crear múltiples instancias de un recurso o módulo, HCL ofrece dos meta-argumentos con implicaciones operativas radicalmente distintas:</p>\n<table class=\"keytable\">\n<tr><th>Meta-argumento</th><th>Tipo de Entrada Requerido</th><th>Indexación en el Estado</th><th>Comportamiento al Eliminar un Elemento Intermedio</th></tr>\n<tr><td><b>count</b></td><td>Número entero (o <code>length(lista)</code>).</td><td>Índice numérico basado en cero: <code>aws_subnet.sub[0]</code>, <code>[1]</code>, <code>[2]</code>.</td><td><b>Peligro de reconstrucción en cascada:</b> Si eliminas el índice <code>[1]</code> de una lista de 3, el antiguo <code>[2]</code> se convierte en <code>[1]</code>; Terraform destruye y recrea los recursos desplazados.</td></tr>\n<tr><td><b>for_each</b></td><td><code>map</code> o <code>set(string)</code>.</td><td>Clave semántica unívoca: <code>aws_subnet.sub[\"public-a\"]</code>, <code>[\"public-b\"]</code>.</td><td><b>100 % Estable:</b> Si eliminas la clave <code>\"public-a\"</code>, únicamente ese recurso es destruido. El resto permanece inalterado.</td></tr>\n</table>\n\n<h4>Bloques Dinámicos (dynamic blocks)</h4>\n<p>Permiten generar bloques anidados repetitivos (como reglas <code>ingress</code> en security groups o tags) a partir de listas o mapas sin duplicar código:</p>\n<pre><code>dynamic \"ingress\" {\n  for_each = var.service_ports\n  content {\n    from_port = ingress.value\n    to_port   = ingress.value\n    protocol  = \"tcp\"\n  }\n}</code></pre>\n\n<h4>Expresiones Splat ([*]) y Funciones Clave</h4>\n<ul>\n  <li><b>Splat ([*]):</b> Obtiene una lista con un atributo de todas las instancias creadas con <code>count</code>: <code>aws_instance.server[*].id</code>.</li>\n  <li><b>Funciones Built-in:</b> Terraform incluye funciones puras como <code>lookup(map, key, default)</code>, <code>flatten(list)</code>, <code>merge(map1, map2)</code>, <code>can(expr)</code> y <code>try(expr1, expr2)</code>. Terraform no permite definir funciones personalizadas en HCL.</li>\n</ul>\n<div class=\"tip\"><b>Mejor Práctica Oficial:</b> Para colecciones de recursos donde el orden puede variar o los elementos pueden ser eliminados en el futuro, utiliza siempre <code>for_each</code> en lugar de <code>count</code>.</div>"
    },
    {
      "id": "tf-t-6-1",
      "d": 6,
      "title": "6.1 · HCP Terraform y Terraform Enterprise: Remote Runs, VCS Triggers y Private Registry",
      "html": "<h4>Evolución: De Terraform CLI Local a Plataforma Gestionada</h4>\n<p>HCP Terraform (anteriormente Terraform Cloud) es la plataforma SaaS gestionada de HashiCorp para colaboración de equipos en IaC, mientras que Terraform Enterprise es la versión autogestionada (self-hosted / on-premise):</p>\n<table class=\"keytable\">\n<tr><th>Capacidad</th><th>Terraform CLI (Open Source)</th><th>HCP Terraform / Terraform Enterprise</th></tr>\n<tr><td><b>Entorno de Ejecución</b></td><td>Máquina local del desarrollador o runner genérico en Jenkins / GitHub Actions.</td><td>Contenedores aislados y reproducibles en la infraestructura cloud de HashiCorp (o agentes privados).</td></tr>\n<tr><td><b>Integración VCS</b></td><td>Manual mediante scripts de pipeline.</td><td>Nativa: ejecuta <code>plan</code> automáticamente en Pull Requests y espera aprobación en merges a rama principal.</td></tr>\n<tr><td><b>Gestión de Variables</b></td><td>Archivos locales <code>.tfvars</code> o variables de entorno del host.</td><td>Workspaces con variables segregadas, categorizadas en Terraform vs HCL vs Env y protegidas como <i>Write-Only</i>.</td></tr>\n<tr><td><b>Private Module Registry</b></td><td>Repositorios Git privados con URLs personalizadas.</td><td>Registro privado integrado con versionado semántico, visor de documentación interactivo y catálogos de autoservicio.</td></tr>\n</table>\n\n<h4>Flujos de Ejecución (Run Execution Modes)</h4>\n<ul>\n  <li><b>VCS-driven:</b> Disparado automáticamente por commits o pull requests en el repositorio (GitHub, GitLab, Bitbucket).</li>\n  <li><b>CLI-driven:</b> El desarrollador ejecuta <code>terraform plan</code> o <code>apply</code> en su terminal local, pero el cómputo y las llamadas a la API de la nube ocurren remotamente en HCP Terraform.</li>\n  <li><b>API-driven:</b> Orquestado programáticamente desde pipelines externos o plataformas de autoservicio mediante la API REST de HCP Terraform.</li>\n</ul>\n<div class=\"tip\"><b>Speculative Plans:</b> En pull requests de GitHub, HCP Terraform genera planes especulativos que muestran el impacto del cambio sin alterar el estado ni adquirir el state lock de producción.</div>"
    },
    {
      "id": "tf-t-6-2",
      "d": 6,
      "title": "6.2 · Gobernanza y Seguridad: Policy as Code con Sentinel / OPA y Gestión de Secretos",
      "html": "<h4>Gobernanza con Policy as Code: HashiCorp Sentinel y OPA</h4>\n<p>Sentinel es el motor de gobernanza embebido en HCP Terraform y Terraform Enterprise que evalúa políticas lógicas entre la fase de <code>plan</code> y la fase de <code>apply</code>:</p>\n<table class=\"keytable\">\n<tr><th>Nivel de Cumplimiento (Enforcement Level)</th><th>Comportamiento en la Ejecución</th><th>¿Quién Puede Superarlo (Override)?</th></tr>\n<tr><td><b>Advisory</b></td><td>Emite una advertencia informativa en el log si la regla falla, pero <b>permite continuar el apply</b> sin interrupción.</td><td>Nadie requerido; no detiene la ejecución.</td></tr>\n<tr><td><b>Soft Mandatory</b></td><td>Bloquea la ejecución en caso de fallo, pero <b>permite que un administrador autorizado anule el bloqueo</b> y proceda con el apply.</td><td>Usuarios con permisos de <i>Policy Override</i> en la organización.</td></tr>\n<tr><td><b>Hard Mandatory</b></td><td>Bloquea de forma estricta y absoluta el despliegue. <b>Bajo ninguna circunstancia</b> se puede anular el bloqueo.</td><td>Nadie. Requiere corregir el código HCL o modificar la política.</td></tr>\n</table>\n\n<h4>Seguridad de Credenciales: Dynamic Provider Credentials con OIDC</h4>\n<p>Almacenar claves secretas de larga duración (como <code>AWS_SECRET_ACCESS_KEY</code>) en variables de entorno representa un vector de ataque crítico:</p>\n<ul>\n  <li>HCP Terraform actúa como un proveedor de identidad OIDC de confianza (OpenID Connect).</li>\n  <li>Al iniciar un run, intercambia un token criptográfico temporal con el proveedor cloud (AWS IAM, Azure AD, GCP Workload Identity).</li>\n  <li>La nube emite credenciales temporales de corta duración (STS tokens) que expiran en cuanto finaliza la ejecución, eliminando por completo los secretos estáticos.</li>\n</ul>\n<div class=\"tip\"><b>Momento de Evaluación de Políticas:</b> Las políticas de Sentinel se evalúan <b>después de que el plan ha sido calculado</b> pero <b>estrictamente antes de que se ejecute el apply</b>.</div>"
    }
  ],
  "questions": [
    {
      "id": "tf-01",
      "d": 1,
      "t": "Declarativo vs. Imperativo en IaC",
      "q": "Un equipo de operaciones migra de scripts en Bash a Terraform. Necesitan actualizar el tipo de instancia de 20 máquinas virtuales de `t3.micro` a `t3.medium`. ¿Cuál es la principal ventaja técnica del modelo declarativo de Terraform frente al script imperativo en esta operación?",
      "o": [
        "El script imperativo detecta de forma automática todo el delta de atributos en la nube sin requerir consultar previamente el inventario de máquinas virtuales activas en el cluster.",
        "Terraform solo requiere modificar el atributo en HCL; el motor calcula el estado deseado contra el real y aplica únicamente la mutación necesaria.",
        "El script imperativo garantiza que si una máquina falla a mitad de ejecución, se reviertan todas las instancias al tipo de cómputo original.",
        "Terraform compila el código HCL en scripts procedurales de shell que se ejecutan secuencialmente mediante SSH en los servidores de destino."
      ],
      "a": 1,
      "e": "En el paradigma declarativo, el desarrollador especifica el estado final esperado (`instance_type = \"t3.medium\"`) sin programar la secuencia de pasos de transición. Terraform compara el estado deseado con el estado real almacenado y ejecuta únicamente las llamadas a la API necesarias para ajustar el atributo."
    },
    {
      "id": "tf-02",
      "d": 1,
      "t": "Principio de Idempotencia en IaC",
      "q": "Un ingeniero ejecuta `terraform apply` sobre un entorno de producción y todos los recursos se crean exitosamente. Inmediatamente después, sin modificar ningún archivo `.tf` ni alterar la infraestructura en la consola cloud, ejecuta `terraform apply` por segunda vez. ¿Qué resultado técnico se produce?",
      "o": [
        "Terraform recrea preventivamente aquellos recursos cuyo proveedor no soporte comprobaciones criptográficas de integridad durante la fase de refresco inicial del estado.",
        "Terraform genera un error de conflicto de nombres en la nube y bloquea el archivo de estado hasta ejecutar un comando de desbloqueo.",
        "Terraform reporta cero cambios porque el estado deseado en el código coincide con el estado real de la nube, preservando la infraestructura intacta.",
        "Terraform ejecuta nuevamente las llamadas POST de creación delegando en la API del proveedor la responsabilidad de ignorar recursos duplicados."
      ],
      "a": 2,
      "e": "La idempotencia garantiza que ejecutar la misma configuración repetidamente produce el mismo resultado sin efectos secundarios. Al no haber discrepancias entre el código HCL, el archivo de estado y la nube real, Terraform determina que el delta es nulo y no ejecuta ninguna acción."
    },
    {
      "id": "tf-03",
      "d": 1,
      "t": "Terraform Core vs. Provider Plugins",
      "q": "Durante la resolución de un incidente de aprovisionamiento, el equipo analiza la arquitectura interna de Terraform. ¿Qué responsabilidad corresponde exclusivamente a **Terraform Core** y NO a los **Provider Plugins**?",
      "o": [
        "Interpretar la configuración HCL, construir el Grafo Acíclico Dirigido (DAG) de dependencias y gestionar el archivo de estado.",
        "Autenticarse de forma directa contra los endpoints de las APIs del proveedor cloud y gestionar el refresco de tokens OAuth o claves temporales de sesión IAM.",
        "Definir el esquema de atributos de cada recurso cloud y traducir operaciones CRUD en peticiones HTTP/REST específicas.",
        "Determinar qué parámetros de red o cómputo son compatibles entre regiones geográficas de un proveedor específico."
      ],
      "a": 0,
      "e": "Terraform Core es el binario agnóstico de la nube responsable de parsear archivos HCL, evaluar expresiones, construir el grafo de dependencias (DAG) y administrar el archivo de estado (`terraform.tfstate`). Los Provider Plugins se encargan de la comunicación con las APIs específicas de cada plataforma."
    },
    {
      "id": "tf-04",
      "d": 1,
      "t": "Dependency Lock File (.terraform.lock.hcl)",
      "q": "Un desarrollador agrega un nuevo proveedor en su código con la restricción `version = \"~> 5.0\"`. Tras ejecutar `terraform init`, nota que se creó el archivo `.terraform.lock.hcl`. ¿Cuál es el propósito fundamental de este archivo y qué buena práctica debe seguir el equipo con respecto a Git?",
      "o": [
        "Almacenar temporalmente los binarios compilados del proveedor en formato base64; debe añadirse a `.gitignore` para no inflar el repositorio.",
        "Guardar las credenciales de autenticación cifradas del proveedor; debe ser excluido estrictamente de cualquier sistema de control de versiones.",
        "Registrar los bloqueos transaccionales del backend remoto para evitar ejecuciones concurrentes; debe compartirse solo entre entornos de desarrollo.",
        "Registrar la versión exacta y los hashes criptográficos de los plugins de proveedores utilizados; debe incluirse en el repositorio de Git."
      ],
      "a": 3,
      "e": "El archivo `.terraform.lock.hcl` bloquea las versiones de los proveedores y registra sus checksums criptográficos multiplataforma. Debe guardarse en Git para garantizar que todos los miembros del equipo y los runners de CI/CD descarguen exactamente las mismas versiones verificadas de los plugins."
    },
    {
      "id": "tf-05",
      "d": 1,
      "t": "Infraestructura Inmutable vs. Mutable",
      "q": "Una empresa busca reducir la desviación de configuración (configuration drift) y errores durante despliegues frecuentes. La arquitectura adopta el principio de **infraestructura inmutable** con Terraform y Packer. ¿Qué patrón describe correctamente este enfoque?",
      "o": [
        "Aplicar parches de software y actualizar paquetes en caliente en los servidores existentes mediante provisioners de Terraform en cada commit.",
        "Construir imágenes de máquina completas (AMIs) con Packer y usar Terraform para reemplazar servidores existentes por nuevas instancias.",
        "Configurar agentes de configuración dinámica como Chef o Puppet dentro de las instancias para alterar archivos de sistema en ejecución.",
        "Bloquear las APIs de modificación de la nube para impedir que Terraform aplique cambios posteriores a la creación inicial de las máquinas."
      ],
      "a": 1,
      "e": "La infraestructura inmutable promueve no modificar servidores en producción. En su lugar, cualquier cambio de software o configuración se empaqueta en una nueva imagen base (p. ej. AMI con Packer) y Terraform destruye las instancias antiguas reemplazándolas por instancias nuevas con la imagen actualizada."
    },
    {
      "id": "tf-06",
      "d": 1,
      "t": "Gestión de Dependencias y depends_on",
      "q": "Terraform construye automáticamente dependencias implícitas basadas en referencias de atributos entre recursos en el DAG. Sin embargo, existen escenarios donde se debe recurrir al meta-argumento `depends_on`. ¿En qué DOS situaciones es estrictamente necesario definir `depends_on`? (Elige 2 respuestas)",
      "o": [
        "Cuando un recurso necesita permisos de un rol IAM o política asociada, pero su bloque no referencia ningún atributo directo de dicha política.",
        "Cuando dos subredes en la misma VPC se crean en Zonas de Disponibilidad diferentes y Terraform requiere serializar su creación por seguridad.",
        "Cuando una aplicación en cómputo requiere que un cluster de base de datos esté listo, pero la configuración no pasa strings de conexión entre ambos.",
        "Cuando se asigna una dirección IP pública estática a una instancia EC2 referenciando directamente `aws_eip.ip.public_ip` en la instancia."
      ],
      "a": [
        0,
        2
      ],
      "e": "Las dependencias implícitas se crean cuando un recurso lee un atributo de otro (ej. `subnet_id = aws_subnet.main.id`). Si no existe tal referencia pero hay un orden obligatorio a nivel de servicio (como una política IAM adjunta a un rol antes de aprovisionar un cluster, o una BD requerida por una app sin enlace de atributos), se debe usar `depends_on`."
    },
    {
      "id": "tf-07",
      "d": 1,
      "t": "Fallo Parcial durante terraform apply",
      "q": "Durante la ejecución de un plan que incluye 15 recursos, el proveedor cloud sufre un timeout en el recurso número 8 y `terraform apply` termina abruptamente con un código de error. ¿Qué ocurre con los 7 recursos creados antes del fallo?",
      "o": [
        "Permanecen en la nube y sus identificadores están guardados en el estado; el recurso fallido queda marcado para remediación en el próximo apply.",
        "Terraform ejecuta un procedimiento de rollback automático inmediato destruyendo los 7 recursos previos para preservar la consistencia atómica del plan de infraestructura.",
        "El archivo de estado se corrompe y revierte a su versión inicial, provocando que los 7 recursos queden huérfanos sin posibilidad de gestión.",
        "Los recursos quedan en la nube pero Terraform los elimina de su grafo interno requiriendo ejecutar `terraform import` obligatoriamente."
      ],
      "a": 0,
      "e": "Terraform actualiza el archivo de estado de forma incremental y transaccional a medida que cada recurso se crea. Si ocurre un fallo en mitad de un apply, los recursos creados con éxito ya están registrados en el estado. En la siguiente ejecución, Terraform reanudará el plan intentando crear o reparar los recursos pendientes."
    },
    {
      "id": "tf-08",
      "d": 1,
      "t": "Detección de Drift de Infraestructura",
      "q": "Un administrador modifica manualmente el tamaño de un disco EBS desde la consola web de AWS para resolver una alerta urgente de espacio. Al día siguiente, el equipo de desarrollo ejecuta `terraform plan`. ¿Cómo maneja Terraform esta discrepancia conocida como **drift**?",
      "o": [
        "Terraform ignora el cambio manual y sobreescribe inmediatamente el disco en la nube sin notificar al operador en la salida del comando.",
        "Terraform aborta inmediatamente el comando informando de violación de integridad y exige sincronizar manualmente el archivo de estado con un editor JSON antes de continuar.",
        "Terraform consulta el estado real en la nube durante la fase de lectura, detecta la diferencia respecto al código HCL y propone alinear el recurso.",
        "Terraform actualiza automáticamente el código fuente en los archivos `.tf` locales para reflejar el nuevo tamaño de disco sin intervención."
      ],
      "a": 2,
      "e": "Por defecto, `terraform plan` realiza un refresco automático leyendo el estado real de los recursos en la nube mediante las APIs. Al comparar la realidad con el archivo HCL, detecta la discrepancia (drift) y genera un plan para restaurar o actualizar el atributo según lo declarado en el código."
    },
    {
      "id": "tf-09",
      "d": 2,
      "t": "Alcance del comando terraform init",
      "q": "Un nuevo ingeniero descarga un repositorio con código de Terraform que utiliza proveedores de AWS y Azure, además de módulos públicos del Terraform Registry. ¿Cuáles son las acciones exactas que realiza `terraform init` en el directorio de trabajo?",
      "o": [
        "Verifica exhaustivamente las credenciales IAM en la nube, valida la cuota de suscripción y despliega de inmediato los recursos de red definidos en los módulos remotos.",
        "Compila los archivos `.tf` a lenguaje binario intermedio y adquiere un bloqueo exclusivo permanente en el backend remoto.",
        "Ejecuta una comprobación sintáctica del código y compara la configuración con los recursos desplegados en los proveedores cloud.",
        "Inicializa el backend de estado, descarga los plugins de proveedores requeridos y descarga el código fuente de los módulos hijos."
      ],
      "a": 3,
      "e": "`terraform init` prepara el directorio de trabajo local. Configura el backend (local o remoto), descarga los plugins de providers a `.terraform/providers/`, crea o actualiza `.terraform.lock.hcl` y descarga los módulos hijos a `.terraform/modules/`. No valida credenciales en la nube ni lee recursos remotos."
    },
    {
      "id": "tf-10",
      "d": 2,
      "t": "Uso de terraform init -upgrade",
      "q": "El equipo mantiene un proyecto con proveedores declarados con la restricción `version = \"~> 5.10\"`. Se ha publicado la versión `5.25.0` en el Registry, pero al ejecutar `terraform init`, el CLI sigue utilizando la versión `5.10.1` registrada en `.terraform.lock.hcl`. ¿Qué comando debe ejecutarse para actualizar los proveedores dentro de la restricción permitida?",
      "o": [
        "Ejecutar el comando `terraform get -update` para forzar la reevaluación completa de los esquemas de proveedores y recompilar el árbol de dependencias en el proyecto.",
        "Ejecutar `terraform init -upgrade` para actualizar los proveedores y módulos a la versión más reciente permitida por las restricciones.",
        "Ejecutar `terraform refresh` para forzar a Terraform Core a consultar las versiones publicadas en el registro remoto oficial.",
        "Borrar manualmente la carpeta `.git` y ejecutar `terraform validate` para liberar la versión fijada en el entorno local."
      ],
      "a": 1,
      "e": "El comando `terraform init -upgrade` consulta el registro de proveedores y módulos, descargando la versión más reciente que satisfaga las restricciones de versión especificadas en la configuración y actualizando en consecuencia el archivo `.terraform.lock.hcl`."
    },
    {
      "id": "tf-11",
      "d": 2,
      "t": "Archivos de Plan Guardados (-out=tfplan)",
      "q": "En una arquitectura de CI/CD para producción, el pipeline genera un plan con `terraform plan -out=tfplan` en la fase de Pull Request y luego ejecuta `terraform apply tfplan` tras la aprobación de la jefatura técnica. ¿Qué garantía técnica proporciona este enfoque frente a ejecutar un `terraform apply` interactivo directo?",
      "o": [
        "Garantiza que se apliquen con exactitud matemática los cambios revisados en el PR sin verse afectados por drift ocurrido entre el plan y el apply.",
        "Acelera sustancialmente la ejecución porque omite la comunicación con los plugins de proveedores delegando todas las peticiones en la memoria caché del navegador web.",
        "Permite editar manualmente los parámetros del plan binario `tfplan` con un procesador de texto antes de autorizar el despliegue.",
        "Elimina la necesidad de autenticarse contra el proveedor cloud ya que el archivo `tfplan` incorpora credenciales temporales firmadas."
      ],
      "a": 0,
      "e": "Al aplicar un archivo de plan previamente guardado (`terraform apply tfplan`), Terraform ejecuta estrictamente las acciones calculadas en el momento en que se generó el plan. No realiza un nuevo refresco ni recalcula el grafo, evitando que cambios externos concurrentes (drift) alteren las modificaciones que fueron aprobadas."
    },
    {
      "id": "tf-12",
      "d": 2,
      "t": "terraform plan -refresh-only",
      "q": "Un ingeniero sospecha que alguien modificó manualmente las etiquetas y grupos de seguridad de varias instancias EC2 desde la consola web de AWS. Desea actualizar el archivo de estado para reflejar la realidad de la nube sin introducir cambios en los recursos físicos. ¿Qué comando oficial debe ejecutar?",
      "o": [
        "Ejecutar `terraform apply -target=aws_instance.all` para forzar la reescritura de los identificadores de recursos en el backend remoto.",
        "Ejecutar `terraform import` sobre todas las instancias para sobrescribir los atributos en conflicto sin requerir confirmación.",
        "Ejecutar `terraform plan -refresh-only` para inspeccionar el drift y, tras verificar los cambios, aplicarlo para actualizar el estado.",
        "Ejecutar `terraform state rm` sobre los recursos afectados para que Terraform vuelva a descubrirlos en la siguiente inicialización."
      ],
      "a": 2,
      "e": "El modo `terraform plan -refresh-only` consulta las APIs del proveedor cloud para detectar cualquier discrepancia (drift) y propone actualizar exclusivamente el archivo de estado para alinearlo con la realidad. Si el operador aprueba el resultado mediante `terraform apply -refresh-only`, el estado se actualiza sin modificar ningún recurso en la nube."
    },
    {
      "id": "tf-13",
      "d": 2,
      "t": "Riesgos del Meta-argumento / Flag -target",
      "q": "Un desarrollador con prisas necesita aplicar urgentemente un cambio en una base de datos y ejecuta `terraform apply -target=aws_db_instance.primary`. ¿Por qué la documentación oficial de HashiCorp desaconseja rotundamente el uso de `-target` en flujos de trabajo rutinarios?",
      "o": [
        "Porque invalida de forma definitiva el archivo `.terraform.lock.hcl` obligando a reinstalar los plugins en cada máquina del equipo.",
        "Porque destruye automáticamente todos los recursos que no hayan sido incluidos en el parámetro `-target` para mantener la paridad.",
        "Porque deshabilita el cifrado de datos en reposo dentro del archivo de estado y cancela el mecanismo de exclusión mutua de DynamoDB.",
        "Porque rompe la integridad del DAG pudiendo dejar dependencias desactualizadas o causar fallos posteriores en el despliegue global."
      ],
      "a": 3,
      "e": "El uso de `-target` aísla un subconjunto del grafo de dependencias ignorando el resto. Esto puede provocar que recursos dependientes queden en estados inconsistentes, ocultar cambios pendientes necesarios o crear drift en el estado global. Solo debe emplearse en circunstancias excepcionales de rescate o resolución de dependencias rotas."
    },
    {
      "id": "tf-14",
      "d": 2,
      "t": "Destrucción Controlada de Infraestructura",
      "q": "Al finalizar una prueba de concepto en un entorno efímero, el equipo necesita desmantelar toda la infraestructura creada por la configuración. Antes de proceder a la eliminación física, desean revisar detenidamente qué componentes serán purgados. ¿Qué combinación de comandos permite previsualizar y ejecutar la destrucción de forma segura?",
      "o": [
        "Ejecutar el comando `terraform state rm *` para purgar completamente el inventario y luego apagar manualmente las instancias desde la consola web del proveedor cloud.",
        "Ejecutar `terraform plan -destroy` para previsualizar los recursos a eliminar y luego `terraform destroy` para confirmar la acción.",
        "Ejecutar `terraform validate -destroy` para auditar dependencias y posteriormente `terraform clean` para purgar los objetos.",
        "Ejecutar `terraform apply -refresh=false` seleccionando la opción de borrado interactivo en el prompt de la consola del CLI."
      ],
      "a": 1,
      "e": "`terraform plan -destroy` genera un plan especulativo que muestra exactamente qué recursos serán eliminados (marcados con `-`). Posteriormente, `terraform destroy` (equivalente a `terraform apply -destroy`) solicita confirmación interactiva antes de eliminar los recursos físicos en el proveedor."
    },
    {
      "id": "tf-15",
      "d": 2,
      "t": "Alcance de terraform validate",
      "q": "Un pipeline de integración continua ejecuta `terraform validate` en cada pull request para comprobar la calidad del código. ¿Qué tipo de error es capaz de detectar `terraform validate` de forma garantizada?",
      "o": [
        "Un bloque de recurso que omite un argumento obligatorio o que asigna un valor de tipo string a un parámetro de tipo number.",
        "Un nombre de bucket de S3 que ya está siendo utilizado por otra cuenta de AWS a nivel global en la infraestructura de Amazon.",
        "Una clave de acceso expirada o falta de permisos en la política IAM asignada al rol del runner de integración continua.",
        "La no disponibilidad temporal del servicio de cómputo en la zona de disponibilidad configurada en la región seleccionada."
      ],
      "a": 0,
      "e": "`terraform validate` opera en modo estrictamente local sobre la sintaxis HCL, los esquemas de proveedores previamente descargados y la consistencia interna de tipos y argumentos requeridos. No contacta APIs externas, por lo que no puede verificar credenciales, colisión de nombres globales ni cuotas de recursos."
    },
    {
      "id": "tf-16",
      "d": 2,
      "t": "Formato Canónico con terraform fmt en CI",
      "q": "Se desea implementar un paso en el pipeline de CI para verificar que todos los archivos `.tf` cumplan con las directrices oficiales de estilo de HashiCorp, fallando el build si algún archivo no está formateado pero sin modificar los archivos en el workspace. ¿Qué DOS flags de `terraform fmt` son apropiados para este fin? (Elige 2 respuestas)",
      "o": [
        "El flag `-write=true` para guardar los cambios automáticamente en el repositorio remoto durante la ejecución del job.",
        "El flag `-check` para retornar un código de salida distinto de cero (exit code 1) si se detectan archivos mal formateados.",
        "El flag `-fix-syntax` para corregir discrepancias de indentación y errores lógicos de nombres de variables en el código.",
        "El flag `-diff` para mostrar las diferencias de formato en estilo unified diff en la salida estándar de la consola del pipeline."
      ],
      "a": [
        1,
        3
      ],
      "e": "En pipelines de CI/CD, `terraform fmt -check` verifica si los archivos cumplen con el estilo canónico devolviendo exit code 1 si encuentra discrepancias (lo que detiene el pipeline). Combinado con `-diff`, imprime exactamente qué líneas necesitan corrección en formato diff sin modificar los archivos locales."
    },
    {
      "id": "tf-17",
      "d": 2,
      "t": "Troubleshooting con TF_LOG y TF_LOG_PATH",
      "q": "Al ejecutar `terraform apply`, una llamada a la API de Azure devuelve un error genérico `500 InternalServerError` sin detalles en la salida estándar. El ingeniero necesita examinar las cabeceras HTTP y el payload JSON exacto de la petición enviada por el proveedor. ¿Qué configuración de entorno debe aplicar?",
      "o": [
        "Definir `TF_DEBUG=1` y redirigir el buffer de salida mediante `terraform apply --verbose-payload=all`.",
        "Establecer `TF_LOG=ERROR` en el terminal para filtrar mensajes secundarios y mostrar únicamente los payloads fallidos del socket.",
        "Configurar la variable de entorno `TF_LOG=TRACE` y opcionalmente `TF_LOG_PATH=terraform.log` para capturar todo el tráfico.",
        "Añadir el argumento `log_level = \"verbose\"` dentro del bloque `provider \"azurerm\"` en el archivo de configuración HCL principal."
      ],
      "a": 2,
      "e": "`TF_LOG` controla el nivel de detalle de registro en Terraform Core y plugins. El nivel `TRACE` es el más verboso e incluye peticiones y respuestas HTTP completas. `TF_LOG_PATH` define la ruta del archivo de texto donde se persisten estos logs para su análisis detallado."
    },
    {
      "id": "tf-18",
      "d": 2,
      "t": "Consola Interactiva terraform console",
      "q": "Un ingeniero desea verificar el resultado de una función de manipulación de red `cidrsubnet(\"10.0.0.0/16\", 8, 2)` antes de utilizarla en la creación de subredes de producción. ¿Cuál es el método más rápido y seguro que ofrece Terraform para esta evaluación?",
      "o": [
        "Ejecutar `terraform plan -target=network` y revisar detenidamente las anotaciones de cálculo en la previsualización del grafo de dependencias.",
        "Escribir un script en Python invocando el SDK del proveedor para calcular el rango de IPs y contrastarlo con el estado.",
        "Declarar una variable temporal con la función en el bloque `default` y ejecutar `terraform validate` en la consola.",
        "Ejecutar el comando `terraform console` e introducir directamente la expresión para ver su evaluación interactiva en vivo."
      ],
      "a": 3,
      "e": "`terraform console` provee un entorno interactivo tipo REPL (Read-Eval-Print Loop) que permite evaluar cualquier expresión, función integrada de HCL (como `cidrsubnet`, `merge`, `jsonencode`) y consultar valores de recursos en el estado sin aplicar cambios en la infraestructura."
    },
    {
      "id": "tf-19",
      "d": 3,
      "t": "Propósito del Archivo de Estado (terraform.tfstate)",
      "q": "Un equipo de infraestructura debate si es imprescindible conservar el archivo `terraform.tfstate` o si Terraform podría consultar dinámicamente las APIs de la nube en cada ejecución sin necesidad de persistir un estado local. ¿Cuál es una de las funciones irremplazables que cumple el archivo de estado?",
      "o": [
        "Mapear los nombres de recursos lógicos en HCL con los identificadores físicos reales de la nube y registrar dependencias entre ellos.",
        "Almacenar el historial de commits y credenciales de autenticación para permitir rollbacks automáticos a versiones previas del código.",
        "Compilar el código HCL en plantillas CloudFormation o ARM antes de enviarlo a los hipervisores de los proveedores de nube pública.",
        "Garantizar que los proveedores de red apliquen políticas de firewall de capa 7 antes de que las máquinas virtuales inicien el arranque."
      ],
      "a": 0,
      "e": "El archivo de estado almacena la asociación unívoca entre las declaraciones abstractas en HCL (`aws_instance.app`) y los IDs físicos reales en el proveedor (`i-0a1234bc5678`), además de metadatos de dependencias, orden de destrucción y caché de atributos que no son consultables directamente por API."
    },
    {
      "id": "tf-20",
      "d": 3,
      "t": "State Locking y Concurrencia",
      "q": "Dos ingenieros ejecutan simultáneamente `terraform apply` sobre el mismo directorio y backend remoto en Amazon S3. ¿Qué mecanismo evita que ambas ejecuciones colisionen y corrompan el archivo de estado?",
      "o": [
        "La sincronización de commits de Git que cancela automáticamente la ejecución del pipeline con menor antigüedad en la rama.",
        "El cifrado asimétrico SSE-KMS que rechaza peticiones simultáneas provenientes de diferentes direcciones IP en la misma VPC.",
        "El bloqueo de estado (State Locking) mediante una tabla de DynamoDB que concede un bloqueo exclusivo a la primera ejecución activa.",
        "Un balanceador de carga interno de AWS que encola las peticiones CLI y las procesa en serie según el orden de llegada al puerto 443."
      ],
      "a": 2,
      "e": "El backend `s3` de Terraform se integra con Amazon DynamoDB para implementar State Locking. Cuando una operación adquiere el bloqueo (escribiendo un registro con `LockID`), cualquier otra ejecución concurrente es rechazada inmediatamente con un error de lock activo hasta que la primera finalice."
    },
    {
      "id": "tf-21",
      "d": 3,
      "t": "Migración a Remote Backend",
      "q": "Un proyecto inició con estado local (`local backend`). El equipo decide migrar a un backend remoto en Amazon S3 con DynamoDB para habilitar trabajo colaborativo. Tras configurar el bloque `terraform { backend \"s3\" { ... } }`, ¿qué comando debe ejecutarse para transferir de forma segura el estado existente a la nube?",
      "o": [
        "Subir manualmente el archivo `terraform.tfstate` mediante la consola web de S3 y luego ejecutar `terraform refresh` en la terminal.",
        "Ejecutar `terraform init -migrate-state` y confirmar interactivamente la copia del estado local al nuevo backend remoto.",
        "Ejecutar `terraform apply -backend-config=\"s3\"` para sobrescribir la configuración remota con la versión local actual.",
        "Ejecutar `terraform state push s3://mybucket/terraform.tfstate` para forzar la sincronización sin validar la tabla de bloqueos."
      ],
      "a": 1,
      "e": "`terraform init -migrate-state` detecta el cambio en la definición del bloque `backend`, solicita confirmación interactiva para copiar el estado existente al nuevo almacenamiento remoto y actualiza las referencias locales sin riesgo de pérdida de datos."
    },
    {
      "id": "tf-22",
      "d": 3,
      "t": "El comando terraform refresh",
      "q": "¿Qué acción técnica concreta realiza el comando `terraform refresh` (y la fase equivalente de refresco implícito dentro de `terraform plan` y `terraform apply`)?",
      "o": [
        "Recargar todas las variables de entorno locales del sistema operativo y actualizar los binarios de proveedores instalados a la versión más reciente disponible.",
        "Verificar la validez de los certificados TLS del endpoint del proveedor cloud y renovarlos en caso de que vayan a caducar.",
        "Revertir la infraestructura física en la nube para obligarla a coincidir exactamente con lo definido en los archivos `.tf` locales.",
        "Consultar el estado de los recursos gestionados mediante las APIs del proveedor y actualizar el archivo de estado con los datos reales."
      ],
      "a": 3,
      "e": "`terraform refresh` lee el estado actual de los recursos en la nube mediante las APIs de los proveedores y actualiza el archivo de estado para reflejar cualquier cambio externo (drift). No modifica recursos en la nube ni altera el código HCL."
    },
    {
      "id": "tf-23",
      "d": 3,
      "t": "Importación Declarativa de Recursos (import block)",
      "q": "En Terraform 1.5+, la compañía desea incorporar un balanceador de carga ALB creado manualmente a la configuración versionada en Git sin interrumpir el tráfico. ¿Cuál es el método moderno y declarativo recomendado por HashiCorp?",
      "o": [
        "Definir un bloque `import { to = aws_lb.main id = \"arn:aws:...\" }` y opcionalmente generar el código con `-generate-config-out`.",
        "Ejecutar `terraform apply -import=aws_lb.main` pasando el ARN en las variables de entorno de la sesión del terminal.",
        "Crear un recurso vacío en HCL y ejecutar `terraform refresh` para que Terraform autocomplete los parámetros de red automáticamente.",
        "Eliminar el balanceador en la consola cloud y permitir que Terraform lo reconstruya desde cero con una nueva dirección lógica."
      ],
      "a": 0,
      "e": "Terraform 1.5 introdujo los bloques declarativos `import { to = <RESOURCE_ADDR> id = \"<CLOUD_ID>\" }`. Combinado con `terraform plan -generate-config-out=generated.tf`, Terraform genera automáticamente el código HCL correspondiente y planifica la importación de manera versionable y predecible."
    },
    {
      "id": "tf-24",
      "d": 3,
      "t": "Comando terraform state rm",
      "q": "Una empresa decide externalizar la gestión de una base de datos MySQL crítica a un equipo de DBAs que la administrará de forma manual. Desean retirar la base de datos de Terraform para que futuros comandos `terraform destroy` o `apply` no la modifiquen ni destruyan, pero la base de datos física debe permanecer intacta y operativa. ¿Qué comando resuelve este requerimiento?",
      "o": [
        "Ejecutar `terraform destroy -target=aws_db_instance.db` asegurándose de no confirmar el prompt interactivo en la consola.",
        "Ejecutar `terraform state rm aws_db_instance.db` para eliminarla del archivo de estado conservando el recurso físico en AWS.",
        "Añadir el atributo `lifecycle { prevent_destroy = false }` y borrar el bloque de código de la base de datos en `main.tf`.",
        "Modificar el estado manualmente eliminando la sección JSON del recurso con un editor de texto plano y recalculando el hash MD5."
      ],
      "a": 1,
      "e": "`terraform state rm <resource_address>` elimina el recurso del archivo de estado de Terraform sin invocar la API del proveedor cloud para borrarlo. Como consecuencia, el recurso físico continúa existiendo en la nube, pero Terraform deja de rastrearlo y gestionarlo."
    },
    {
      "id": "tf-25",
      "d": 3,
      "t": "Refactorización con el Bloque moved",
      "q": "Durante una refactorización de código en Terraform 1.1+, el equipo traslada un recurso individual `aws_sqs_queue.orders` hacia un módulo reutilizable `module.billing.aws_sqs_queue.orders`. Desean que al hacer merge a la rama principal, el pipeline no intente destruir la cola existente ni crear una nueva. ¿Qué solución declarativa debe incluirse en el código?",
      "o": [
        "Ejecutar un script imperativo con `terraform state rm` y posterior `terraform import` en el pipeline de despliegue continuo.",
        "Configurar `lifecycle { create_before_destroy = true }` dentro del módulo hijo para forzar la coexistencia de ambas colas de mensajes.",
        "Incluir un bloque `moved { from = aws_sqs_queue.orders to = module.billing.aws_sqs_queue.orders }` en la configuración HCL.",
        "Renombrar el identificador en HCL y pasar el flag `-force-state-rewrite` durante la ejecución del siguiente comando `apply`."
      ],
      "a": 2,
      "e": "El bloque `moved` permite documentar refactorizaciones de nombres o traslados entre módulos directamente en el código HCL. Al ejecutar `terraform plan` o `apply`, Terraform reconoce el cambio de dirección lógica y actualiza el estado automáticamente sin destruir ni recrear el recurso físico en la nube."
    },
    {
      "id": "tf-26",
      "d": 3,
      "t": "Liberación de Bloqueos con force-unlock",
      "q": "Durante la ejecución de un pipeline de despliegue en GitLab CI, el runner se apaga repentinamente por un corte de energía en el datacenter mientras ejecutaba `terraform apply`. Las ejecuciones posteriores fallan indicando que el estado está bloqueado con un `Lock Info Info: ID: 5c91a0...`. Tras verificar que el proceso anterior terminó por completo, ¿cómo debe proceder el operador?",
      "o": [
        "Eliminar definitivamente el archivo `terraform.tfstate` del bucket S3 y recrear toda la infraestructura de la empresa desde cero con `terraform apply`.",
        "Esperar 24 horas hasta que la tabla de DynamoDB purgue automáticamente el registro del bloqueo por tiempo de expiración.",
        "Modificar el identificador de workspace en el código para eludir la comprobación de concurrencia en las siguientes ejecuciones.",
        "Ejecutar `terraform force-unlock 5c91a0...` para liberar manualmente el bloqueo retenido tras confirmar que no hay procesos activos."
      ],
      "a": 3,
      "e": "Si un proceso se interrumpe de forma anormal, el bloqueo de estado puede quedar retenido en el backend. Una vez verificado que ningún otro operador o pipeline está ejecutando cambios, se utiliza `terraform force-unlock <LOCK-ID>` para remover manualmente el bloqueo y restaurar la operatividad."
    },
    {
      "id": "tf-27",
      "d": 3,
      "t": "Seguridad del Estado y Datos Sensibles",
      "q": "Un ingeniero genera una contraseña aleatoria mediante el recurso `resource \"random_password\" \"db\" { length = 16 }` y la pasa al argumento `password` de un recurso `aws_db_instance`. ¿Dónde queda almacenada esa contraseña en texto claro y qué medida de seguridad mitiga el riesgo?",
      "o": [
        "Queda en texto claro en `terraform.tfstate`; el riesgo se mitiga protegiendo el backend remoto con cifrado (KMS) y permisos RBAC estrictos.",
        "Queda cifrada automáticamente con la clave pública de HashiCorp en el estado; no requiere medidas adicionales en el almacenamiento.",
        "Terraform elimina los valores de contraseñas del archivo de estado y solo los conserva en la memoria volátil durante la ejecución de apply.",
        "Queda registrada exclusivamente en el archivo `.terraform.lock.hcl` protegido mediante firmas HMAC del proveedor del sistema operativo."
      ],
      "a": 0,
      "e": "Cualquier valor generado o consumido por un recurso queda registrado en texto plano en el archivo `terraform.tfstate`, incluso si las variables u outputs tienen el atributo `sensitive = true`. Por ello, es imperativo almacenar el estado en un backend remoto seguro con cifrado en reposo (SSE-KMS) y acceso restringido."
    },
    {
      "id": "tf-28",
      "d": 3,
      "t": "Comandos de Inspección del Estado",
      "q": "Un auditor de seguridad necesita inspeccionar la configuración actual y los identificadores de recursos gestionados por Terraform en un entorno productivo, garantizando que sus comandos NO realicen modificaciones ni lecturas activas en la nube. ¿Cuáles DOS comandos cumplen este criterio de forma segura? (Elige 2 respuestas)",
      "o": [
        "Ejecutar `terraform state list` para obtener el listado completo de direcciones de recursos registrados en el estado actual.",
        "Ejecutar `terraform plan -refresh=true` para forzar la actualización de atributos de red con la información más reciente de la nube.",
        "Ejecutar `terraform state show <resource_address>` para visualizar en detalle todos los atributos y metadatos de un recurso específico.",
        "Ejecutar `terraform apply -auto-approve` en modo solo lectura para contrastar los parámetros criptográficos del cluster."
      ],
      "a": [
        0,
        2
      ],
      "e": "`terraform state list` y `terraform state show` son comandos de inspección pura que operan exclusivamente sobre los datos persistidos en el archivo de estado local o remoto, sin enviar solicitudes de modificación a la nube ni realizar consultas activas a las APIs externas."
    },
    {
      "id": "tf-29",
      "d": 4,
      "t": "Estructura Estándar de Módulos",
      "q": "El equipo de arquitectura de plataforma diseña un módulo de Terraform para que sea consumido por múltiples proyectos de la organización. Según las mejores prácticas oficiales de HashiCorp, ¿cuál es la estructura de archivos mínima y canónica recomendada?",
      "o": [
        "Un único archivo `deploy.tf` que contenga toda la lógica, variables, proveedores y scripts de automatización empaquetados en un tarball.",
        "Tres archivos fundamentales: `main.tf` (recursos principales), `variables.tf` (inputs declarados) y `outputs.tf` (valores expuestos).",
        "Un archivo `terraform.hcl` maestro acompañado de subdirectorios por cada entorno denominados `dev/`, `stage/` y `production/`.",
        "Un archivo binario precompilado generado por `terraform package` acompañado de un archivo de manifiesto en formato XML de metadatos."
      ],
      "a": 1,
      "e": "La convención estándar de HashiCorp para módulos estipula: `main.tf` para la definición de recursos, `variables.tf` para las variables de entrada requeridas u opcionales, `outputs.tf` para los valores que el módulo devuelve al llamador, y opcionalmente `README.md` y `LICENSE`."
    },
    {
      "id": "tf-30",
      "d": 4,
      "t": "Fuentes de Módulos (module source)",
      "q": "Se desea invocar un módulo de red alojado en un repositorio Git privado asegurando que los despliegues de producción siempre utilicen exactamente la versión etiquetada `v2.4.1`. ¿Cuál es la sintaxis correcta para declarar esta fuente en el bloque `module`?",
      "o": [
        "`source = \"git::https://example.com/network.git\"` definiendo `version = \"v2.4.1\"` en el argumento inferior del bloque.",
        "`source = \"./network\"` configurando la variable de entorno `TF_MODULE_GIT_TAG=\"v2.4.1\"` en el sistema operativo del host.",
        "`source = \"git::https://example.com/network.git?ref=v2.4.1\"` utilizando el parámetro de consulta `?ref=` en la URL del repositorio.",
        "`source = \"registry::https://example.com/network.git#v2.4.1\"` invocando el protocolo de emulación de paquetes binarios de Git."
      ],
      "a": 2,
      "e": "Cuando se consumen módulos directamente desde repositorios Git, el argumento `version` de HCL no es soportado (solo aplica a Terraform Registries). En su lugar, se debe especificar la rama, tag o commit hash utilizando el sufijo de consulta `?ref=<tag>` al final de la URL del repositorio."
    },
    {
      "id": "tf-31",
      "d": 4,
      "t": "Comunicación entre Módulos y Outputs",
      "q": "Un módulo raíz invoca un módulo hijo llamado `vpc` que crea varias subredes. En el módulo raíz, un recurso `aws_instance.app` necesita utilizar el ID de la subred pública generada en el módulo hijo. ¿Cómo debe implementarse este flujo de datos en HCL?",
      "o": [
        "El módulo raíz puede leer directamente `module.vpc.aws_subnet.public.id` sin necesidad de que el módulo hijo declare outputs.",
        "El módulo hijo debe escribir el ID en una variable de entorno del sistema operativo para que el módulo raíz la lea con `env()`.",
        "El módulo raíz debe consultar la base de datos de estado global utilizando la función no estándar `state_lookup(\"vpc_subnet\")`.",
        "El módulo hijo debe exponer el valor en su archivo `outputs.tf` y el módulo raíz lo referencia como `module.vpc.subnet_id`."
      ],
      "a": 3,
      "e": "Los módulos encapsulan sus recursos internos. Un módulo invocador no puede acceder directamente a los recursos del módulo hijo; este último debe definir explícitamente un bloque `output \"subnet_id\" { value = aws_subnet.public.id }`, permitiendo al padre consumirlo mediante `module.vpc.subnet_id`."
    },
    {
      "id": "tf-32",
      "d": 4,
      "t": "Workspaces en el CLI de Terraform",
      "q": "Un desarrollador utiliza los workspaces del CLI de Terraform para alternar entre los entornos `dev` y `prod` sobre la misma carpeta de código. Necesita que el nombre del bucket de almacenamiento incluya el nombre del workspace actual. ¿Cómo se referencia dinámicamente este valor en HCL?",
      "o": [
        "Utilizando la expresión reservada `${terraform.workspace}` dentro del string de interpolación en el atributo correspondiente.",
        "Invocando la función integrada `workspace()` pasando como argumento el identificador del backend configurado en el bloque principal.",
        "Leyendo la variable de entorno del sistema operativo mediante la interpolación `${var.TERRAFORM_WORKSPACE_NAME}`.",
        "Habilitando el flag `-dynamic-workspace-interpolate` en el comando `terraform init` antes de generar el plan de ejecución."
      ],
      "a": 0,
      "e": "Terraform expone el nombre del workspace actualmente seleccionado a través de la variable especial reservada `terraform.workspace`. Puede utilizarse en expresiones HCL, por ejemplo: `bucket = \"empresa-datos-${terraform.workspace}\"`."
    },
    {
      "id": "tf-33",
      "d": 4,
      "t": "Limitaciones Críticas de CLI Workspaces",
      "q": "Una organización bancaria gestiona dos entornos: `Desarrollo` (desplegado en una cuenta AWS no productiva con 1 AZ y sin cifrado dedicado) y `Producción` (en una cuenta AWS auditada, Multi-AZ, con Direct Connect y claves KMS dedicadas). ¿Por qué la documentación oficial de HashiCorp desaconseja usar **CLI Workspaces** para este escenario?",
      "o": [
        "Porque los CLI Workspaces no permiten ejecutar `terraform plan` de forma estable si la cantidad total de recursos supera los 50 objetos en el inventario del estado.",
        "Porque los CLI Workspaces comparten el mismo código HCL y backend, haciendo inseguro y complejo gestionar credenciales y topologías distintas.",
        "Porque el comando `terraform workspace select` destruye automáticamente los recursos del entorno previo antes de conmutar al nuevo.",
        "Porque los backends remotos en Amazon S3 y Azure Blob Storage prohíben por diseño el almacenamiento de múltiples archivos de estado."
      ],
      "a": 1,
      "e": "Los CLI workspaces comparten exactamente el mismo código base y la misma configuración de backend. Para entornos con diferencias topológicas críticas, cuentas de nube separadas o controles de acceso estrictos, se recomienda utilizar directorios independientes o HCP Terraform Workspaces con credenciales y variables segregadas."
    },
    {
      "id": "tf-34",
      "d": 4,
      "t": "Lifecycle: create_before_destroy",
      "q": "Se actualiza una regla en un grupo de seguridad de AWS que requiere reemplazo forzoso del recurso. Por defecto, Terraform destruye el recurso existente antes de crear el nuevo, lo cual provocaría una caída temporal del tráfico (downtime). ¿Qué directiva del meta-bloque `lifecycle` revierte este orden para evitar la interrupción?",
      "o": [
        "Configurar la directiva `lifecycle { zero_downtime = true }` para delegar la transición de alta disponibilidad en el plano de control del proveedor cloud.",
        "Configurar `lifecycle { prevent_destroy = true }` para forzar al proveedor a modificar el grupo de seguridad en caliente.",
        "Configurar `lifecycle { create_before_destroy = true }` para aprovisionar el nuevo recurso antes de dar de baja el existente.",
        "Configurar `lifecycle { ignore_changes = [rules] }` para ocultar la discrepancia durante la fase de cálculo del plan."
      ],
      "a": 2,
      "e": "El argumento `create_before_destroy = true` dentro del bloque `lifecycle` altera el comportamiento predeterminado de Terraform ante reemplazos: primero crea el nuevo recurso, actualiza las dependencias asociadas y solo cuando está operativo, destruye el recurso antiguo, garantizando continuidad de servicio."
    },
    {
      "id": "tf-35",
      "d": 4,
      "t": "Lifecycle: prevent_destroy",
      "q": "Un equipo desea proteger una base de datos de producción contra eliminaciones catastróficas accidentales. Añaden `lifecycle { prevent_destroy = true }` a su bloque `aws_db_instance`. ¿Qué efecto técnico se produce si un ingeniero ejecuta accidentalmente `terraform destroy` sobre este proyecto?",
      "o": [
        "Terraform solicita una clave de autorización administrativa enviada de forma segura al teléfono móvil del propietario del proyecto antes de destruir.",
        "Terraform destruye todos los recursos excepto la base de datos, reasignándole una dirección IP pública temporal de mantenimiento.",
        "Terraform procede con la destrucción pero crea un snapshot de respaldo en frío en un bucket de almacenamiento secundario.",
        "Terraform detiene el comando en la fase de plan con un error explícito, impidiendo la destrucción de la base de datos y del resto del plan."
      ],
      "a": 3,
      "e": "`prevent_destroy = true` actúa como una salvaguarda a nivel de plan. Si cualquier plan (incluyendo `terraform destroy` o un cambio que fuerce el reemplazo del recurso) implica destruir un recurso protegido con esta directiva, Terraform aborta inmediatamente la ejecución con un error antes de realizar cambios."
    },
    {
      "id": "tf-36",
      "d": 4,
      "t": "Lifecycle: ignore_changes",
      "q": "Un grupo de autoscaling en Azure (Virtual Machine Scale Set) tiene su capacidad gestionada dinámicamente por un servicio de métricas externo según la demanda. Cada vez que el equipo ejecuta `terraform apply`, Terraform detecta drift e intenta restablecer el número de instancias al valor estático de HCL. ¿Cómo se instruye a Terraform para que ignore modificaciones externas en ese atributo?",
      "o": [
        "Añadir el bloque `lifecycle { ignore_changes = [instances_count] }` dentro de la definición del recurso en el archivo HCL.",
        "Definir el atributo como `instances_count = null` para que Terraform deshabilite la reconciliación en ese bloque de código.",
        "Ejecutar `terraform apply -skip-attribute=instances_count` en todas las ejecuciones automatizadas del pipeline de despliegue.",
        "Marcar la variable correspondiente con `sensitive = true` para que el motor omita la comparación de diferencias en el plan."
      ],
      "a": 0,
      "e": "`lifecycle { ignore_changes = [ <ATTRIBUTE_NAMES> ] }` indica a Terraform que ignore las diferencias entre el código y el estado real para los atributos especificados. Es ideal para parámetros gestionados por procesos dinámicos externos como autoscaling o etiquetas automáticas de seguridad."
    },
    {
      "id": "tf-37",
      "d": 4,
      "t": "Paso de Múltiples Proveedores a Módulos (providers map)",
      "q": "Una empresa despliega una arquitectura multirregión donde un módulo necesita aprovisionar recursos simultáneamente en `us-east-1` (default) y `us-west-2` (secundario). ¿Cómo se pasan explícitamente múltiples configuraciones del mismo proveedor desde el módulo raíz al módulo hijo?",
      "o": [
        "Duplicar el bloque `module` en dos directorios locales completamente distintos configurando una variable de región geográfica diferente en cada uno.",
        "Declarar un alias en el provider del módulo raíz y pasarlo al módulo hijo mediante el argumento `providers = { aws.west = aws.west }`.",
        "Definir la variable de entorno `AWS_REGION_LIST=\"us-east-1,us-west-2\"` antes de ejecutar la inicialización de módulos en el CLI.",
        "Invocar la función `provider_override()` dentro de los bloques de recursos del módulo hijo para alternar la sesión en runtime."
      ],
      "a": 1,
      "e": "Para pasar configuraciones alternativas de proveedores (identificadas con `alias`) a un módulo hijo, se define el meta-argumento `providers` dentro de la llamada al módulo: `providers = { aws.alias_en_hijo = aws.alias_en_padre }`. El módulo hijo debe declarar los aliases esperados en su bloque `configuration_aliases`."
    },
    {
      "id": "tf-38",
      "d": 4,
      "t": "Descarga y Versionado de Módulos",
      "q": "Al trabajar con módulos en Terraform, el equipo analiza los mecanismos de descarga en el directorio oculto `.terraform/modules` y el control de versiones. ¿Cuáles DOS afirmaciones sobre el versionado de módulos son técnicamente correctas? (Elige 2 respuestas)",
      "o": [
        "Los módulos referenciados con rutas relativas locales (`./modules/vpc`) soportan restricciones de versión mediante el argumento `version`.",
        "El argumento `version` en un bloque `module` solo es compatible cuando la fuente proviene de un Terraform Registry (público o privado).",
        "Terraform descarga los módulos remotos durante `terraform init` y los almacena en el directorio local `.terraform/modules`.",
        "Modificar el código dentro de `.terraform/modules/` es la práctica oficial para actualizar módulos de terceros sin alterar el upstream."
      ],
      "a": [
        1,
        2
      ],
      "e": "El argumento `version` solo se puede utilizar con fuentes provenientes de Terraform Registries. Además, Terraform descarga los módulos remotos durante `terraform init` y los coloca en `.terraform/modules/`. Los módulos locales no admiten el argumento `version` y nunca deben modificarse los archivos dentro de `.terraform/`."
    },
    {
      "id": "tf-39",
      "d": 5,
      "t": "Jerarquía de Precedencia de Variables",
      "q": "El valor de la variable `db_port` se define en múltiples ubicaciones simultáneamente: en `terraform.tfvars` (`db_port = 3306`), como variable de entorno `TF_VAR_db_port=5432`, en un archivo `prod.auto.tfvars` (`db_port = 8443`) y en la línea de comandos mediante el flag `-var=\"db_port=9000\"`. ¿Cuál valor tendrá prioridad absoluta durante la ejecución de Terraform?",
      "o": [
        "El valor `8443` definido en el archivo `prod.auto.tfvars` porque los archivos con sufijo `auto` anulan la consola por seguridad.",
        "El valor `5432` definido en la variable de entorno `TF_VAR_db_port` porque el sistema operativo tiene prioridad sobre los archivos locales.",
        "El valor `9000` pasado mediante el flag de línea de comandos `-var` porque los argumentos directos del CLI ostentan la máxima precedencia.",
        "El valor `3306` definido en `terraform.tfvars` porque es el archivo estándar de definición de variables reconocido por HashiCorp."
      ],
      "a": 2,
      "e": "El orden oficial de precedencia de variables en Terraform (de mayor a menor) es: 1) Flags CLI `-var` o `-var-file`, 2) Archivos `*.auto.tfvars` o `*.auto.tfvars.json`, 3) Archivo `terraform.tfvars.json`, 4) Archivo `terraform.tfvars`, 5) Variables de entorno `TF_VAR_*`, y 6) El valor `default` en la declaración de la variable."
    },
    {
      "id": "tf-40",
      "d": 5,
      "t": "Tipos de Datos Complejos en HCL",
      "q": "Un desarrollador necesita declarar una variable de entrada para representar la configuración de un cluster web, la cual debe admitir pares clave-valor donde los tipos de datos internos son heterogéneos: un string para el nombre, un entero para el puerto y un booleano para SSL. ¿Qué tipo de dato estructural de HCL debe especificarse?",
      "o": [
        "`map(any)` permitiendo que el motor de Terraform convierta dinámicamente todos los valores internos en cadenas de texto codificadas en base64.",
        "`list(object)` forzando a que todos los atributos internos del elemento se conviertan al tipo con mayor huella de memoria.",
        "`tuple([string, number, bool])` requiriendo que los datos se accedan obligatoriamente mediante claves alfanuméricas de mapa.",
        "`object({ name = string, port = number, ssl_enabled = bool })` definiendo de forma exacta los nombres de atributos y sus tipos específicos."
      ],
      "a": 3,
      "e": "En HCL, un `map` exige que todos sus elementos sean del mismo tipo (homogéneo). Cuando se necesita una estructura con claves fijas y valores de tipos dispares (string, number, bool), el tipo de dato estructural correcto es `object({...})`. Una `tuple` también es heterogénea pero se indexa por posición secuencial, no por claves con nombre."
    },
    {
      "id": "tf-41",
      "d": 5,
      "t": "El Atributo sensitive = true",
      "q": "Se declara una variable de entrada para un token de API de terceros con `sensitive = true` y se referencia en un recurso. ¿Cuál es el comportamiento garantizado de Terraform respecto a este valor y qué precaución técnica debe mantenerse?",
      "o": [
        "El valor se enmascara como `(sensitive value)` en los logs del terminal, pero permanece visible en texto claro en `terraform.tfstate`.",
        "Terraform cifra el valor con el algoritmo AES-256 en el archivo de estado y exige una contraseña maestra para descifrarlo en cada ejecución del CLI.",
        "El valor se destruye de la memoria inmediatamente después de la llamada API y no queda registrado en ningún archivo del disco.",
        "El valor se envía únicamente a través de túneles VPN dedicados bloqueando cualquier intento de ejecución desde redes públicas."
      ],
      "a": 0,
      "e": "El atributo `sensitive = true` previene que Terraform imprima el valor sensible en la consola durante los comandos `plan`, `apply` o al invocar `terraform output`. Sin embargo, HashiCorp advierte explícitamente que el valor **sigue existiendo en texto claro dentro del archivo de estado** (`terraform.tfstate`), por lo que el estado debe protegerse con cifrado y RBAC."
    },
    {
      "id": "tf-42",
      "d": 5,
      "t": "count vs. for_each y Desplazamiento de Índices",
      "q": "Un equipo utilizó `count = length(var.subnet_cidrs)` con una lista de subredes `[\"10.0.1.0/24\", \"10.0.2.0/24\", \"10.0.3.0/24\"]` (índices 0, 1, 2). En una actualización, deciden eliminar la subred intermedia `\"10.0.2.0/24\"`. ¿Por qué ocurre una recreación destructiva no deseada y cómo se soluciona?",
      "o": [
        "La API cloud del proveedor rechaza listas con saltos numéricos; se soluciona ejecutando un script de reindexación en Bash antes de compilar el plan.",
        "El proveedor bloquea la subred en estado pendiente; se soluciona ejecutando `terraform refresh` para reconciliar las rutas.",
        "Al eliminar el índice 1, el elemento 2 se convierte en el nuevo índice 1, forzando la destrucción y recreación de subredes; se soluciona con `for_each`.",
        "Terraform destruye todos los recursos del módulo al alterar la longitud de un bucle `count`; se soluciona duplicando el código a mano."
      ],
      "a": 2,
      "e": "Con `count`, los recursos se indexan numéricamente (`aws_subnet.sub[0]`, `[1]`, `[2]`). Si se elimina el elemento intermedio, los elementos subsecuentes sufren un desplazamiento de índice (el índice 2 pasa a ser 1), provocando que Terraform modifique o destruya y recree los recursos desplazados. La solución es usar `for_each` con un mapa o conjunto, asociando cada recurso a una clave semántica estable."
    },
    {
      "id": "tf-43",
      "d": 5,
      "t": "Bloques Dinámicos (dynamic blocks)",
      "q": "Se necesita generar múltiples reglas de entrada `ingress` dentro de un recurso de grupo de seguridad (`aws_security_group`), donde el número de puertos a abrir varía según el entorno a partir de una lista de variables. ¿Cuál es la construcción HCL correcta para generar estos bloques repetitivos sin duplicar código?",
      "o": [
        "Utilizar una macro de preprocesador C `#include` dentro de un archivo de cabecera que se inserte en el archivo `main.tf`.",
        "Duplicar el bloque `resource` tantas veces como puertos existan utilizando el meta-argumento `split_resource` de HCL2.",
        "Escribir un script externo en Python que renderice una plantilla Jinja2 antes de cada ejecución del pipeline de integración continua.",
        "Declarar un bloque `dynamic \"ingress\"` con un argumento `for_each` y definir los atributos del puerto dentro del bloque `content`."
      ],
      "a": 3,
      "e": "Los bloques dinámicos (`dynamic \"<block_type>\" { for_each = ... content { ... } }`) permiten construir bloques anidados repetitivos dentro de recursos o fuentes de datos a partir de una lista, conjunto o mapa en HCL, accediendo a los valores mediante `<block_type>.value`."
    },
    {
      "id": "tf-44",
      "d": 5,
      "t": "Funciones Nativas de HCL: lookup, try y can",
      "q": "En una configuración HCL, se consulta un mapa de configuraciones que puede no contener una clave específica según el entorno. El desarrollador necesita obtener el valor de la clave si existe, o un valor de fallback predeterminado si no está presente, evitando que Terraform lance un error de evaluación. ¿Qué función nativa resuelve este caso?",
      "o": [
        "La función `default(map, key, fallback)` que suprime los errores de lectura asignando cero a las variables ausentes.",
        "La función `lookup(map, key, default)` que busca una clave en un mapa y devuelve el valor por defecto si no se encuentra.",
        "La función `find_or_create(map, key)` que inserta automáticamente la clave en el archivo de estado con valor nulo.",
        "La función `coalesce_key(map, key)` que fusiona los diccionarios de variables locales con las variables globales del sistema."
      ],
      "a": 1,
      "e": "`lookup(map, key, default)` busca una clave dentro de un mapa. Si la clave existe, devuelve su valor; si no existe, devuelve el valor especificado en el tercer argumento `default` sin interrumpir la ejecución con errores de clave inexistente."
    },
    {
      "id": "tf-45",
      "d": 5,
      "t": "Expresiones Splat y Comprensión for",
      "q": "Un módulo crea un cluster de 5 servidores web mediante `count = 5`. En el módulo raíz, se necesita obtener una lista con todas las direcciones IP privadas de los servidores generados para configurarlas en un balanceador. ¿Cuál es la sintaxis más concisa utilizando expresiones Splat?",
      "o": [
        "`aws_instance.web[*].private_ip` aprovechando el operador Splat para proyectar el atributo en una lista de valores.",
        "`aws_instance.web.all.private_ip` invocando la propiedad colectiva del motor de recursos compartidos de Terraform Core.",
        "`[for i in 0..5 : aws_instance.web[i].private_ip]` asumiendo que el índice final se autoincrementa de forma no inclusiva.",
        "`get_list(aws_instance.web, \"private_ip\")` llamando a la función de introspección del archivo de estado de Terraform."
      ],
      "a": 0,
      "e": "El operador Splat (`[*]`) permite capturar un atributo específico de una colección de recursos creados con `count` y devolverlos como una lista ordenada: `aws_instance.web[*].private_ip`. Es equivalente a `[for s in aws_instance.web : s.private_ip]`, pero más conciso."
    },
    {
      "id": "tf-46",
      "d": 5,
      "t": "Validaciones Personalizadas en Variables",
      "q": "Un equipo de arquitectura desea asegurar que los ingenieros solo desplieguen infraestructura en una de las tres regiones aprobadas corporativamente: `us-east-1`, `us-west-2` o `eu-west-1`. Quieren que Terraform detenga la ejecución inmediatamente durante la validación temprana si se introduce otra región. ¿Cómo se implementa esta restricción en HCL?",
      "o": [
        "Configurando una regla en el archivo `.terraform.lock.hcl` con el hash criptográfico de las regiones autorizadas por la organización.",
        "Añadiendo una cláusula `assert(region in [\"us-east-1\", ...])` en la cabecera del archivo de proveedores de Terraform.",
        "Definiendo un bloque `validation { condition = contains([...], var.region) error_message = \"...\" }` dentro del bloque de la variable.",
        "Instalando un plugin de pre-commit que intercepte las llamadas al teclado antes de que se ejecute el binario de Terraform."
      ],
      "a": 2,
      "e": "Terraform permite añadir uno o más bloques `validation` dentro de una declaración de `variable`. Debe incluir un argumento `condition` que devuelva un booleano y un argumento `error_message` que se imprime si la condición evalúa a `false`, bloqueando la ejecución tempranamente."
    },
    {
      "id": "tf-47",
      "d": 6,
      "t": "HCP Terraform: Ejecución Remota y Speculative Plans",
      "q": "Una organización adopta HCP Terraform (anteriormente Terraform Cloud) e integra sus repositorios de GitHub mediante un workspace conectado al VCS. Un desarrollador abre un Pull Request modificando recursos de red. ¿Qué tipo de ejecución lanza automáticamente HCP Terraform sobre ese Pull Request y cuál es su impacto?",
      "o": [
        "Un plan productivo automático que adquiere el bloqueo exclusivo del archivo de estado e inicia el aprovisionamiento inmediato en la nube real.",
        "Un Speculative Plan (plan especulativo) que muestra el diff esperado sin modificar el estado ni adquirir el bloqueo de producción.",
        "Un análisis sintáctico local que descarga el estado a la máquina del desarrollador para evaluar el coste estimado de la solución.",
        "Una ejecución de prueba en un cluster efímero que crea y destruye los recursos en una cuenta de AWS de sandbox temporal."
      ],
      "a": 1,
      "e": "En flujos basados en VCS en HCP Terraform, abrir o actualizar un Pull Request dispara automáticamente un **Speculative Plan**. Este plan es de solo lectura: muestra a los revisores exactamente qué cambios se aplicarían si el PR fuese aceptado, sin modificar el estado real de producción ni bloquear el workspace."
    },
    {
      "id": "tf-48",
      "d": 6,
      "t": "Policy as Code con Sentinel: Niveles de Severidad",
      "q": "En HCP Terraform se configura una política de Sentinel para verificar que ninguna instancia EC2 supere el tamaño `m5.large` por motivos de presupuesto. La política se configura con el nivel de cumplimiento **Soft Mandatory**. Durante la ejecución de un plan urgente para un evento de marketing masivo, la política falla porque el equipo requiere una `m5.2xlarge`. ¿Qué permite este nivel de cumplimiento?",
      "o": [
        "La ejecución continúa sin interrupción porque el nivel Soft Mandatory actúa únicamente como un mensaje informativo en los logs del run.",
        "El sistema cancela definitivamente el plan y destruye de inmediato el workspace obligando a reconstruir la infraestructura desde una plantilla base corporativa.",
        "Cualquier desarrollador del proyecto puede hacer clic en omitir la regla sin necesidad de credenciales administrativas especiales.",
        "La ejecución se bloquea preventivamente, pero un usuario con privilegios administrativos de política puede anular el fallo (override) y autorizar el apply."
      ],
      "a": 3,
      "e": "Sentinel en HCP Terraform tiene tres niveles de cumplimiento: `Advisory` (advertencia que nunca detiene el apply), `Soft Mandatory` (bloquea la ejecución pero permite que un administrador autorizado aplique un override manual) y `Hard Mandatory` (bloqueo estricto que bajo ninguna circunstancia puede anularse)."
    },
    {
      "id": "tf-49",
      "d": 6,
      "t": "HCP Workspaces vs. CLI Workspaces",
      "q": "Un arquitecto debe justificar ante la dirección de seguridad la adopción de HCP Terraform Workspaces en lugar de utilizar los CLI Workspaces de código abierto. ¿Cuál es una diferencia fundamental de arquitectura y seguridad entre ambos modelos?",
      "o": [
        "HCP Workspaces aíslan estados, variables sensibles (write-only), RBAC y ramas de Git de forma independiente por cada espacio de trabajo.",
        "Los CLI Workspaces cifran automáticamente el código HCL en los repositorios locales mientras que HCP almacena todo el código en texto plano accesible.",
        "HCP Workspaces eliminan el archivo de estado delegando la persistencia en las bases de datos transaccionales de los hipervisores.",
        "Los CLI Workspaces permiten ejecución paralela de múltiples comandos apply concurrentes sobre el mismo recurso sin bloqueos."
      ],
      "a": 0,
      "e": "A diferencia de los CLI workspaces (que son solo carpetas de estado aisladas sobre un único código y conjunto de variables locales), los HCP Terraform Workspaces son entidades completas que encapsulan su propio archivo de estado, historial de ejecuciones, variables de entorno y de Terraform protegidas, permisos RBAC y vinculación a ramas específicas de VCS."
    },
    {
      "id": "tf-50",
      "d": 6,
      "t": "Dynamic Provider Credentials con OIDC",
      "q": "Para cumplir con una estricta normativa de seguridad, una empresa debe eliminar todas las claves de acceso estáticas de larga duración (`AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY`) de sus pipelines de HCP Terraform. ¿Cuáles DOS beneficios técnicos ofrece la implementación de **Dynamic Provider Credentials** mediante OIDC en este escenario? (Elige 2 respuestas)",
      "o": [
        "Genera credenciales de corta duración con rotación automática mediante el intercambio criptográfico de un token JWT firmado por HCP.",
        "Permite que los desarrolladores accedan a la consola web de AWS sin necesidad de disponer de cuentas en el proveedor de identidad corporativo.",
        "Reduce la superficie de ataque y el riesgo de filtración de secretos al no almacenar credenciales permanentes en variables del workspace.",
        "Aumenta las cuotas de red y cómputo asignadas por defecto por el proveedor cloud al detectar una federación validada por HashiCorp."
      ],
      "a": [
        0,
        2
      ],
      "e": "Dynamic Provider Credentials permite que HCP Terraform actúe como un Identity Provider (IdP) OIDC. Al iniciar una ejecución, HCP emite un token JWT firmado que AWS STS intercambia por credenciales temporales (con duración de minutos). Esto elimina el almacenamiento de claves estáticas de larga duración en variables y mitiga drásticamente el riesgo de filtración de credenciales."
    }
  ],
  "why": {
    "tf-01": [
      "Los scripts imperativos no calculan deltas automáticamente; requieren lógica programática manual para consultar el estado actual de cada recurso antes de actuar.",
      null,
      "Los scripts imperativos tradicionales carecen de transaccionalidad nativa; si fallan a mitad de ejecución dejan la infraestructura en un estado parcialmente modificado.",
      "Terraform no genera scripts de shell ni interactúa vía SSH por defecto; se comunica directamente con las APIs de los proveedores mediante llamadas REST/gRPC."
    ],
    "tf-02": [
      "Terraform no recrea recursos existentes si sus atributos coinciden; la comprobación se realiza cotejando el estado actual con el código en el DAG.",
      "No se genera ningún conflicto ni error de nombres; el motor de Terraform reconoce que los recursos ya existen y están bajo su gestión.",
      null,
      "Terraform no envía llamadas POST de creación ciegas a los proveedores; solo envía llamadas de mutación cuando detecta diferencias en el plan."
    ],
    "tf-03": [
      null,
      "La autenticación y gestión de credenciales frente a las APIs remotas es responsabilidad directa del Provider Plugin correspondiente.",
      "La definición de esquemas de recursos y la traducción a llamadas REST pertenece al plugin del proveedor, no a Terraform Core.",
      "Las reglas de compatibilidad regional y validación de parámetros de servicios en la nube son gobernadas por el plugin del proveedor."
    ],
    "tf-04": [
      "El lock file no contiene binarios en base64; almacena metadatos de versiones y hashes SHA-256 en formato HCL legible.",
      "El lock file jamás contiene credenciales de autenticación ni secretos; únicamente registra restricciones y checksums de proveedores.",
      "Los bloqueos transaccionales de ejecución concurrente son manejados por el Remote Backend (State Locking), no por el archivo de dependencias de proveedores.",
      null
    ],
    "tf-05": [
      "Actualizar software en caliente en servidores existentes es la definición de infraestructura mutable, la cual propicia desviaciones de configuración.",
      null,
      "El uso de herramientas de gestión de configuración para modificar instancias activas corresponde al modelo mutable tradicional.",
      "La inmutabilidad no implica congelar la infraestructura sin actualizaciones, sino implementar cambios mediante reemplazo total de componentes."
    ],
    "tf-06": [
      null,
      "Terraform crea subredes independientes en paralelo de forma predeterminada; forzar serialización sin dependencias funcionales es innecesario.",
      null,
      "Referenciar `aws_eip.ip.public_ip` ya genera una dependencia implícita automática en el grafo, haciendo redundante el uso de `depends_on`."
    ],
    "tf-07": [
      null,
      "Terraform no implementa rollbacks automáticos en fallos de apply; conserva los recursos completados y actualiza el estado en tiempo real.",
      "El estado no se corrompe; el mecanismo de persistencia atómica guarda cada recurso confirmado de inmediato en el backend.",
      "Los recursos creados no quedan huérfanos ni se requiere importación manual; ya están formalmente registrados en el estado."
    ],
    "tf-08": [
      "Terraform nunca sobreescribe recursos en `plan`; el comando `plan` es estrictamente de solo lectura y únicamente proyecta cambios futuros.",
      "Terraform no se bloquea ni exige editar manualmente el JSON de estado; está diseñado para conciliar discrepancias de forma declarativa.",
      null,
      "Terraform nunca modifica los archivos `.tf` de código fuente del desarrollador de forma automática al detectar drift en la infraestructura."
    ],
    "tf-09": [
      "El comando `init` no valida credenciales IAM con llamadas a las APIs de la nube ni aprovisiona recursos de infraestructura.",
      "Terraform no compila HCL a binarios intermedios ni adquiere bloqueos de estado permanentes durante la inicialización de módulos.",
      "La comprobación sintáctica es tarea de `terraform validate` y la comparación con la nube corresponde a `terraform plan`.",
      null
    ],
    "tf-10": [
      "`terraform get -update` solo actualiza módulos locales o remotos ya inicializados, pero no actualiza los plugins de proveedores.",
      null,
      "`terraform refresh` consulta la infraestructura real en la nube para actualizar el estado; no gestiona versiones de plugins ni módulos.",
      "Borrar el directorio `.git` destruiría el historial de versiones del proyecto y no afecta la lógica de descarga de proveedores de Terraform."
    ],
    "tf-11": [
      null,
      "Terraform sigue utilizando los plugins de proveedores para comunicarse con las APIs cloud; no existe ninguna relación con caché de navegadores.",
      "El archivo `tfplan` es un archivo binario estructurado; modificarlo directamente corrompe su checksum criptográfico e invalida la ejecución.",
      "El archivo de plan no incorpora credenciales de nube; el entorno donde se ejecuta el `apply` debe disponer de permisos y credenciales válidas."
    ],
    "tf-12": [
      "El flag `-target` sigue intentando alinear la infraestructura física con el código `.tf`, pudiendo revertir cambios o recrear recursos.",
      "`terraform import` se utiliza para recursos no gestionados previamente por Terraform; no está diseñado para actualizar drift de recursos existentes.",
      null,
      "`terraform state rm` elimina los recursos del estado provocando que Terraform deje de rastrearlos, lo que empeoraría la discrepancia."
    ],
    "tf-13": [
      "El flag `-target` no altera ni invalida el archivo de bloqueo de dependencias de proveedores `.terraform.lock.hcl`.",
      "Terraform no destruye los recursos no especificados; simplemente los excluye del plan de ejecución para esa invocación puntual.",
      "El cifrado y el mecanismo de state locking del backend remoto siguen funcionando exactamente igual con o sin `-target`.",
      null
    ],
    "tf-14": [
      "`terraform state rm` solo borra registros del estado pero deja los recursos activos en la nube consumiendo costes operativos.",
      null,
      "No existen los comandos ni flags `terraform validate -destroy` ni `terraform clean` en el CLI oficial de Terraform.",
      "El flag `-refresh=false` solo omite la consulta de estado en la nube; no inicia un proceso de destrucción ni ofrece borrado interactivo."
    ],
    "tf-15": [
      null,
      "La colisión global de nombres de buckets S3 solo se detecta al consultar la API de AWS durante el plan o al intentar crearlo en apply.",
      "Las credenciales y permisos IAM no son evaluados por `validate`; el comando se ejecuta con éxito incluso sin credenciales de nube.",
      "La disponibilidad de zonas y cuotas de cómputo requiere llamadas activas a las APIs del proveedor, fuera del alcance de `validate`."
    ],
    "tf-16": [
      "El flag `-write=true` sobreescribiría los archivos en disco en lugar de actuar en modo verificación estricta para validación de PRs.",
      null,
      "El flag `-fix-syntax` no existe en Terraform; `terraform fmt` solo ajusta indentación y espaciado, no corrige lógica ni sintaxis rota.",
      null
    ],
    "tf-17": [
      "La variable `TF_DEBUG` y el flag `--verbose-payload` no existen en la especificación del CLI de Terraform.",
      "`TF_LOG=ERROR` únicamente registraría eventos de error críticos, ocultando las peticiones HTTP y payloads que solo aparecen en `TRACE`.",
      null,
      "El nivel de registro de Terraform no se configura como argumento HCL dentro del bloque `provider`; se gestiona vía variables de entorno."
    ],
    "tf-18": [
      "`terraform plan -target` requiere tener recursos declarados y realiza lecturas de red contra el proveedor, siendo mucho más lento.",
      "El SDK de Python puede tener implementaciones de cálculo de subredes ligeramente distintas a la función matemática nativa de HCL.",
      "Las funciones HCL complejas no siempre pueden evaluarse en el argumento `default` estático de una variable y `validate` no imprime resultados.",
      null
    ],
    "tf-19": [
      null,
      "El estado de Terraform no guarda historial de commits ni gestiona credenciales de autenticación; esa es función de Git y de variables de entorno.",
      "Terraform no convierte HCL en plantillas de CloudFormation ni ARM; utiliza sus propios plugins para llamar a las APIs REST del proveedor.",
      "Las políticas de firewall y seguridad de red son implementadas por los recursos de red del proveedor, no por el archivo de estado de Terraform."
    ],
    "tf-20": [
      "Git no interviene en la ejecución del CLI de Terraform ni coordina la concurrencia sobre los recursos en la nube.",
      "El cifrado SSE-KMS protege los datos en reposo, pero no implementa lógica de exclusión mutua ni control de concurrencia de procesos.",
      null,
      "No interviene ningún balanceador de carga; el cliente Terraform se comunica directamente con las APIs de S3 y DynamoDB desde el CLI."
    ],
    "tf-21": [
      "Subir el archivo manualmente a S3 ignora la sincronización de metadatos locales y puede provocar discrepancias o pérdida del historial.",
      null,
      "El comando `terraform apply` no acepta el flag `-backend-config`; la configuración del backend se inicializa exclusivamente con `init`.",
      "`terraform state push` es un comando de bajo nivel que no gestiona la transición de configuración de backend de forma guiada ni segura."
    ],
    "tf-22": [
      "El refresco no actualiza variables de entorno ni plugins de proveedores; esas tareas corresponden al sistema operativo y a `init -upgrade`.",
      "Terraform no gestiona ni renueva certificados TLS de los endpoints públicos de las APIs de los proveedores cloud.",
      "El refresco nunca modifica la infraestructura en la nube; es una operación de lectura en el proveedor y escritura en el estado.",
      null
    ],
    "tf-23": [
      null,
      "El flag `-import` no existe en `terraform apply`; la importación histórica se ejecutaba con `terraform import <addr> <id>` vía CLI.",
      "`terraform refresh` solo actualiza recursos que ya están registrados en el estado; no descubre ni importa recursos no vinculados.",
      "Destruir el balanceador causaría una interrupción total del servicio de producción, violando el requisito de no afectar el tráfico."
    ],
    "tf-24": [
      "`terraform destroy -target` eliminaría físicamente la base de datos en AWS en cuanto se complete la operación, causando pérdida de servicio.",
      null,
      "Borrar el bloque en `main.tf` sin hacer `state rm` provocaría que en el siguiente `terraform apply` Terraform destruya la base de datos en AWS.",
      "Editar el archivo de estado manualmente es peligroso, propenso a errores de formato y desaconsejado formalmente por HashiCorp."
    ],
    "tf-25": [
      "Un script de `state rm` e `import` es imperativo, engorroso de coordinar entre múltiples desarrolladores y no queda registrado en Git.",
      "`create_before_destroy` no resuelve el renombramiento de identificadores; seguiría intentando crear una cola duplicada con el mismo nombre.",
      null,
      "El flag `-force-state-rewrite` no existe en Terraform; el mecanismo oficial y recomendado es el bloque declarativo `moved`."
    ],
    "tf-26": [
      "Borrar el archivo de estado de S3 destruiría el registro de toda la infraestructura, causando inconsistencias graves y orfandad de recursos.",
      "DynamoDB no libera los bloqueos de Terraform automáticamente por expiración; el lock persiste hasta su liberación explícita.",
      "Cambiar de workspace crearía un entorno nuevo y vacío, desconectando el código del estado real de la infraestructura existente.",
      null
    ],
    "tf-27": [
      null,
      "El archivo de estado no aplica cifrado nativo asimétrico por defecto a campos individuales; es un documento JSON en texto estructurado.",
      "Terraform debe persistir todos los atributos de los recursos en el estado para poder comparar drift y gestionar dependencias en el futuro.",
      "El archivo `.terraform.lock.hcl` solo guarda versiones y checksums de plugins de proveedores; nunca almacena datos de recursos ni contraseñas."
    ],
    "tf-28": [
      null,
      "`terraform plan -refresh=true` realiza consultas activas a las APIs de la nube, violando la restricción de evitar lecturas en la nube.",
      null,
      "`terraform apply -auto-approve` intenta aplicar cambios directamente en la nube sin confirmación; no es un comando de solo lectura."
    ],
    "tf-29": [
      "Agrupar todo en un único archivo `deploy.tf` dificulta la legibilidad, mantenibilidad y rompe las convenciones estándar de módulos de Terraform.",
      null,
      "Tener subdirectorios de ambientes dentro del propio módulo acopla la lógica reusable con la configuración de entornos específicos.",
      "Terraform no utiliza archivos binarios compilados ni manifiestos XML para la distribución y empaquetado de módulos en su ecosistema."
    ],
    "tf-30": [
      "El argumento `version` en bloques de módulo solo es compatible con fuentes del Terraform Registry, no con repositorios Git genéricos.",
      "Rutas locales (`./network`) no leen de repositorios Git remotos ni reconocen variables de entorno arbitrarias para versionado.",
      null,
      "El esquema `registry::` con `#` no es una sintaxis válida de fuentes de módulos en Terraform; el prefijo estándar es `git::` con `?ref=`."
    ],
    "tf-31": [
      "Terraform prohíbe el acceso directo a los recursos internos de un módulo hijo; solo permite acceder a los valores exportados como outputs.",
      "HCL no utiliza variables de entorno del sistema operativo para intercambiar datos entre módulos durante la resolución del grafo.",
      "No existe la función `state_lookup()` en HCL; el flujo de datos entre módulos se modela de forma limpia y declarativa mediante outputs.",
      null
    ],
    "tf-32": [
      null,
      "No existe una función `workspace()` en HCL; la referencia oficial es el identificador de contexto de lenguaje `terraform.workspace`.",
      "No se accede como variable ordinaria `var.TERRAFORM_WORKSPACE_NAME`; pertenece al objeto global del motor `terraform`.",
      "No existe ningún flag `-dynamic-workspace-interpolate` en la especificación del CLI de Terraform."
    ],
    "tf-33": [
      "Los CLI workspaces no tienen ningún límite arbitrario de 50 recursos; la restricción radica en su modelo de seguridad y topología.",
      null,
      "`terraform workspace select` solo cambia el puntero del archivo de estado activo; jamás destruye recursos físicos en la nube.",
      "Los backends como S3 soportan perfectamente múltiples workspaces creando prefijos en el bucket como `env:/<workspace_name>/`."
    ],
    "tf-34": [
      "El argumento `zero_downtime` no existe en la sintaxis de HCL ni en los bloques de ciclo de vida de recursos de Terraform.",
      "`prevent_destroy` bloquea el plan si requiere destrucción, pero no revierte el orden de creación y destrucción de recursos.",
      null,
      "`ignore_changes` omite la detección de modificaciones en atributos específicos, impidiendo que el cambio se aplique en la nube."
    ],
    "tf-35": [
      "Terraform CLI no cuenta con mecanismos de validación telefónica o autenticación multifactor interactiva en tiempo de ejecución de destroy.",
      "Terraform no destruye el resto de recursos parcialmente; el error de `prevent_destroy` bloquea la totalidad del plan de destrucción.",
      "La directiva `prevent_destroy` no genera snapshots de respaldo automáticos; su función exclusiva es rechazar la orden de eliminación.",
      null
    ],
    "tf-36": [
      null,
      "Asignar `null` a un argumento numérico obligatorio en un recurso suele provocar un error de validación de esquema en el proveedor.",
      "No existe el flag `-skip-attribute` en el CLI de Terraform; la supresión de cambios en atributos se define en el bloque `lifecycle`.",
      "`sensitive = true` solo enmascara valores en la salida visual del terminal; no altera la lógica de detección de drift ni evita actualizaciones."
    ],
    "tf-37": [
      "Duplicar directorios enteros introduce redundancia masiva de código y dificulta el mantenimiento uniforme de la infraestructura.",
      null,
      "Las variables de entorno no pueden configurar alias concurrentes de proveedores en Terraform para distribución multirregión en un mismo plan.",
      "No existe la función `provider_override()` en HCL; la asignación de proveedores es declarativa mediante bloques y aliases formales."
    ],
    "tf-38": [
      "Los módulos con rutas locales no admiten el argumento `version`; reflejan directamente el estado de los archivos en el disco del host.",
      null,
      null,
      "Editar archivos en `.terraform/modules/` es un antipatrón peligroso; cualquier nuevo `terraform init` sobrescribe los cambios sin aviso."
    ],
    "tf-39": [
      "Los archivos `*.auto.tfvars` tienen alta prioridad y se cargan automáticamente, pero son superados por los flags explícitos pasados en el CLI.",
      "Las variables de entorno `TF_VAR_*` tienen menor precedencia que los archivos `.tfvars` y que los flags pasados por la línea de comandos.",
      null,
      "El archivo `terraform.tfvars` tiene una precedencia intermedia; es superado tanto por los archivos `auto.tfvars` como por el CLI."
    ],
    "tf-40": [
      "Un `map` requiere homogeneidad de tipos; si se mezclan números y strings, HCL intentará forzar todos los valores al tipo más genérico (string).",
      "Una lista de objetos es una colección de múltiples instancias, mientras que aquí se requiere tipar un único objeto estructural de configuración.",
      "Una `tuple` es una secuencia indexada numéricamente por posición fija (0, 1, 2); no asigna nombres de atributos a sus elementos.",
      null
    ],
    "tf-41": [
      null,
      "Terraform no cifra de forma selectiva atributos sensibles con contraseñas maestras dentro del JSON de estado; el JSON es texto plano.",
      "Terraform debe registrar los valores en el estado para poder detectar drift y evaluar cambios futuros; el valor no se destruye de disco.",
      "El atributo `sensitive` no controla la ruta de red ni exige túneles VPN; es una directiva exclusiva de presentación y enmascaramiento."
    ],
    "tf-42": [
      "La API del proveedor no evalúa índices de HCL; el problema proviene enteramente del modelo de indexación posicional de Terraform.",
      "El bloqueo no se debe a la API cloud ni se soluciona con `refresh`; el diff lo genera el motor de HCL al comparar las direcciones por índice.",
      null,
      "Terraform no destruye todos los recursos del módulo; solo destruye y recrea los recursos cuyos índices numéricos hayan cambiado de posición."
    ],
    "tf-43": [
      "Terraform y HCL no admiten macros de preprocesador C ni directivas `#include`; su diseño es nativo y declarativo.",
      "No existe el meta-argumento `split_resource` en Terraform; duplicar bloques de recursos genera código verboso y difícil de mantener.",
      "Aunque las plantillas Jinja2 pueden usarse externamente, no son la solución nativa de Terraform; `dynamic` resuelve esto de forma estándar.",
      null
    ],
    "tf-44": [
      "La función `default()` no existe en HCL; el valor por defecto de un mapa se gestiona mediante `lookup()` o la expresión `try()`.",
      null,
      "No existe la función `find_or_create()` en HCL; las funciones de Terraform son funciones puras que nunca modifican el estado ni insertan datos.",
      "No existe la función `coalesce_key()` en HCL; para combinar mapas se utiliza `merge()` y para seleccionar valores no nulos se usa `coalesce()`."
    ],
    "tf-45": [
      null,
      "No existe la propiedad `.all` en recursos de Terraform; intentar acceder de este modo genera un error de atributo no definido.",
      "El bucle `0..5` intentaría acceder a 6 elementos (índices 0, 1, 2, 3, 4, 5) cuando con `count = 5` solo existen los índices del 0 al 4.",
      "No existe la función `get_list()` en HCL; la proyección de atributos se realiza mediante Splat o comprensiones `for`."
    ],
    "tf-46": [
      "El archivo `.terraform.lock.hcl` solo gestiona versiones y checksums de plugins de proveedores; no evalúa reglas de negocio sobre variables.",
      "No existe la sintaxis `assert` en bloques de proveedor; las validaciones de variables se definen dentro de su propio bloque en `variables.tf`.",
      null,
      "Los hooks de pre-commit son herramientas externas al CLI de Terraform; no forman parte del lenguaje HCL ni garantizan validación en CI/CD."
    ],
    "tf-47": [
      "HCP Terraform no ejecuta un apply automático en Pull Requests; los cambios solo se aplican cuando el PR se aprueba y se mergea a la rama principal.",
      null,
      "HCP Terraform ejecuta el plan en sus propios contenedores remotos en la nube; jamás descarga el archivo de estado a estaciones locales en este flujo.",
      "Los planes especulativos no aprovisionan recursos en la nube real; son simulaciones basadas en la lectura de APIs y cálculo de diffs."
    ],
    "tf-48": [
      "El nivel que actúa únicamente como mensaje informativo sin detener el apply es `Advisory`, no `Soft Mandatory`.",
      "Sentinel nunca destruye workspaces ni infraestructura ante un fallo de política; únicamente bloquea la transición hacia el apply.",
      "En `Soft Mandatory`, los usuarios estándar no pueden anular el bloqueo; se requieren roles con permisos explícitos de Policy Override en la organización.",
      null
    ],
    "tf-49": [
      null,
      "Los CLI workspaces no cifran el código HCL local; el código fuente reside en texto ordinario en el disco y repositorios del cliente.",
      "HCP Terraform sigue utilizando el archivo de estado; lo almacena de forma gestionada, cifrada y con control transaccional estricto.",
      "La ejecución paralela concurrente sin bloqueos provocaría corrupción de datos; el bloqueo exclusivo es una necesidad fundamental de seguridad."
    ],
    "tf-50": [
      null,
      "OIDC en HCP Terraform autentica exclusivamente las ejecuciones de Terraform con la API cloud; no reemplaza el acceso SSO de usuarios humanos.",
      null,
      "La autenticación federada OIDC no incrementa las cuotas de servicio de la nube; solo autentica de forma segura las llamadas a las APIs."
    ]
  },
  "glossary": [
    {
      "term": "Idempotencia",
      "cat": "IaC Core",
      "d": 1,
      "def": "Propiedad que garantiza que aplicar una configuración múltiples veces produce idéntico estado final en la infraestructura sin efectos no deseados.",
      "tip": "Si ejecutas `terraform apply` sin cambios de código ni drift, Terraform concluye con cero cambios y exit code 0."
    },
    {
      "term": "Enfoque Declarativo",
      "cat": "IaC Core",
      "d": 1,
      "def": "Paradigma de IaC donde se describe el estado final deseado de la infraestructura en HCL, delegando al motor el cálculo de las acciones de transición.",
      "tip": "A diferencia de scripts imperativos (Bash, Python), Terraform se encarga del qué en lugar del cómo."
    },
    {
      "term": "Terraform Core",
      "cat": "IaC Core",
      "d": 1,
      "def": "Binario estático compilado en Go responsable de procesar la configuración HCL, construir el DAG de dependencias y gestionar el archivo de estado.",
      "tip": "Core es agnóstico a cualquier nube; delega la comunicación con APIs remotas a los plugins de proveedores mediante gRPC."
    },
    {
      "term": "Provider Plugin",
      "cat": "IaC Core",
      "d": 1,
      "def": "Binario ejecutable independiente que traduce llamadas abstractas de Terraform Core en peticiones HTTP/REST reales contra APIs de proveedores.",
      "tip": "Se descargan automáticamente durante `terraform init` y se almacenan localmente en el directorio oculto `.terraform/providers/`."
    },
    {
      "term": "Grafo de Dependencias (DAG)",
      "cat": "IaC Core",
      "d": 1,
      "def": "Grafo Acíclico Dirigido generado por Terraform Core para modelar las relaciones de precedencia entre recursos y maximizar la creación en paralelo.",
      "tip": "Puedes inspeccionarlo visualmente exportándolo con `terraform graph | dot -Tsvg > graph.svg`."
    },
    {
      "term": "terraform init",
      "cat": "Workflow CLI",
      "d": 2,
      "def": "Comando inicial que inicializa el backend, descarga los plugins de proveedores necesarios y descarga los módulos hijos referenciados.",
      "tip": "Debe ejecutarse obligatoriamente tras clonar un repositorio, cambiar de backend o añadir un nuevo proveedor o módulo."
    },
    {
      "term": "Execution Plan (tfplan)",
      "cat": "Workflow CLI",
      "d": 2,
      "def": "Representación predictiva calculada por `terraform plan` que detalla los recursos que serán creados, actualizados o destruidos en la nube.",
      "tip": "En pipelines de CI/CD, guarda el plan con `-out=tfplan` y aplícalo con `terraform apply tfplan` para evitar discrepancias por drift."
    },
    {
      "term": "terraform plan -refresh-only",
      "cat": "Workflow CLI",
      "d": 2,
      "def": "Modo de ejecución que consulta la infraestructura en la nube para actualizar el estado local según el drift sin proponer cambios a los recursos.",
      "tip": "Sustituye de forma segura al comando deprecado `terraform refresh`, mostrando una confirmación antes de modificar el estado."
    },
    {
      "term": "terraform validate",
      "cat": "Workflow CLI",
      "d": 2,
      "def": "Comando de análisis estático local que comprueba la sintaxis HCL2, consistencia de tipos y existencia de argumentos obligatorios en los bloques.",
      "tip": "No contacta a las APIs de la nube ni valida credenciales ni cuotas; solo requiere que `init` haya descargado los esquemas de providers."
    },
    {
      "term": "TF_LOG y TF_LOG_PATH",
      "cat": "Workflow CLI",
      "d": 2,
      "def": "Variables de entorno para activar el registro de depuración del CLI (niveles: TRACE, DEBUG, INFO, WARN, ERROR) y redirigir la salida a un archivo.",
      "tip": "`TF_LOG=TRACE` muestra las solicitudes y respuestas HTTP REST completas intercambiadas con las APIs de la nube."
    },
    {
      "term": "terraform.tfstate",
      "cat": "State & Locks",
      "d": 3,
      "def": "Archivo JSON central que vincula los recursos declarados en el código HCL con sus identificadores y metadatos reales en la infraestructura cloud.",
      "tip": "Nunca debe editarse a mano; su alteración incorrecta corrompe checksums y puede provocar la destrucción accidental de recursos."
    },
    {
      "term": "State Locking",
      "cat": "State & Locks",
      "d": 3,
      "def": "Mecanismo de exclusión mutua que impide que múltiples usuarios o pipelines modifiquen el mismo estado concurrentemente provocando corrupción.",
      "tip": "Backends como S3 requieren una tabla DynamoDB con clave `LockID`; Azure Storage usa Blob Leases y GCS utiliza preconditions nativas."
    },
    {
      "term": "Remote Backend (S3 + DynamoDB)",
      "cat": "State & Locks",
      "d": 3,
      "def": "Configuración en HCL que almacena el archivo de estado de forma compartida en un bucket S3 cifrado con soporte de bloqueo transaccional vía DynamoDB.",
      "tip": "Para migrar de local a remoto, ejecuta `terraform init -migrate-state` respondiendo `yes` a la solicitud de transferencia."
    },
    {
      "term": "terraform import",
      "cat": "State & Locks",
      "d": 3,
      "def": "Mecanismo para incorporar infraestructura preexistente no creada con Terraform al archivo de estado sin destruirla ni modificarla en la nube.",
      "tip": "En Terraform 1.5+ se prefiere el bloque declarativo `import { to = ... id = ... }` junto con el flag `-generate-config-out`."
    },
    {
      "term": "Bloque moved",
      "cat": "State & Locks",
      "d": 3,
      "def": "Declaración en HCL (`moved { from = ... to = ... }`) introducida en Terraform 1.1 que registra refactorizaciones de nombres de recursos o módulos.",
      "tip": "Permite renombrar recursos o extraerlos a módulos en Git sin que Terraform intente destruir el recurso existente para crear uno nuevo."
    },
    {
      "term": "Root Module vs Child Module",
      "cat": "Modules",
      "d": 4,
      "def": "El Root Module es el directorio de trabajo donde se ejecutan los comandos CLI; un Child Module es cualquier módulo invocado desde otro bloque HCL.",
      "tip": "Los recursos dentro de un Child Module están encapsulados; el módulo padre solo puede interactuar a través de variables de entrada y outputs."
    },
    {
      "term": "Terraform Registry",
      "cat": "Modules",
      "d": 4,
      "def": "Repositorio central público (registry.terraform.io) y privado de módulos y proveedores mantenido por HashiCorp y la comunidad open source.",
      "tip": "Los módulos publicados en el Registry público deben tener repositorios públicos en GitHub con nombres con el formato `terraform-<PROVIDER>-<NAME>`."
    },
    {
      "term": "CLI Workspaces",
      "cat": "Modules",
      "d": 4,
      "def": "Funcionalidad del CLI que permite mantener múltiples archivos de estado aislados sobre el mismo directorio de código HCL usando `terraform.workspace`.",
      "tip": "Apropiado para variaciones simples de parámetros; no se recomienda para ambientes con diferencias topológicas o de credenciales críticas."
    },
    {
      "term": "create_before_destroy",
      "cat": "Modules",
      "d": 4,
      "def": "Argumento de meta-bloque `lifecycle` que invierte el orden estándar de reemplazo, aprovisionando primero el nuevo recurso antes de liquidar el antiguo.",
      "tip": "Esencial para actualizaciones de cero downtime en balanceadores de carga, certificados SSL o grupos de escalado automático."
    },
    {
      "term": "prevent_destroy",
      "cat": "Modules",
      "d": 4,
      "def": "Salvaguarda de meta-bloque `lifecycle` que rechaza cualquier plan de Terraform que implique la eliminación de un recurso crítico.",
      "tip": "Evita catástrofes en bases de datos de producción; debe removerse explícitamente del HCL antes de poder ejecutar una destrucción intencional."
    },
    {
      "term": "Precedencia de Variables",
      "cat": "HCL & Vars",
      "d": 5,
      "def": "Orden jerárquico estricto en el que Terraform evalúa variables: flags CLI > `*.auto.tfvars` > `terraform.tfvars` > `TF_VAR_*` > `default`.",
      "tip": "Los valores pasados explícitamente en el terminal con `-var` o `-var-file` tienen prioridad absoluta sobre cualquier archivo en disco."
    },
    {
      "term": "Atributo sensitive",
      "cat": "HCL & Vars",
      "d": 5,
      "def": "Parámetro booleano (`sensitive = true`) en variables y outputs que oculta valores en la salida del terminal para evitar filtración accidental en logs.",
      "tip": "¡Cuidado!: El valor permanece completamente visible en texto claro dentro del archivo `terraform.tfstate`."
    },
    {
      "term": "count vs for_each",
      "cat": "HCL & Vars",
      "d": 5,
      "def": "`count` indexa recursos numéricamente (`[0]`), mientras que `for_each` utiliza claves de mapa o set (`[\"item\"]`), evitando reemplazos en cadena.",
      "tip": "Si se elimina un elemento intermedio de una lista en `count`, Terraform recrea los elementos subsecuentes. Con `for_each`, solo se destruye el elemento borrado."
    },
    {
      "term": "HCP Terraform (Remote Runs)",
      "cat": "HCP & Policy",
      "d": 6,
      "def": "Plataforma SaaS que ejecuta los workflows de Terraform en contenedores administrados remotos, desacoplando la ejecución de las estaciones locales.",
      "tip": "Permite integración nativa con VCS para lanzar planes especulativos automáticos en cada Pull Request de GitHub o GitLab."
    },
    {
      "term": "Sentinel Policy as Code",
      "cat": "HCP & Policy",
      "d": 6,
      "def": "Framework de gobernanza de HashiCorp que valida reglas de negocio, seguridad y costes sobre el plan antes de permitir la ejecución del apply.",
      "tip": "Tiene tres niveles de severidad: `Advisory` (advertencia), `Soft Mandatory` (bloqueo con anulación de admin) y `Hard Mandatory` (bloqueo estricto)."
    }
  ]
};
})(window);
