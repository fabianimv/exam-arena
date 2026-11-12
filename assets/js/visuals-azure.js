/* Visual Aids Pack — Microsoft Azure Administrator AZ-104 */
(function (window) {
  'use strict';

  window.EXAM_VISUALS = window.EXAM_VISUALS || {};

  /* Reusable SVG Definitions & Markers */
  var SVG_DEFS = '<defs>' +
    '<marker id="arr-az-cyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
      '<path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>' +
    '</marker>' +
    '<marker id="arr-az-indigo" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
      '<path d="M 0 1 L 10 5 L 0 9 z" fill="#818cf8"/>' +
    '</marker>' +
    '<marker id="arr-az-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
      '<path d="M 0 1 L 10 5 L 0 9 z" fill="#34d399"/>' +
    '</marker>' +
    '<marker id="arr-az-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
      '<path d="M 0 1 L 10 5 L 0 9 z" fill="#fbbf24"/>' +
    '</marker>' +
    '<marker id="arr-az-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
      '<path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444"/>' +
    '</marker>' +
  '</defs>';

  /* -------------------------------------------------------------------------
     Visual Aid 1: Azure Governance, RBAC, Policy & Resource Locks
     ------------------------------------------------------------------------- */
  var visualGovernance = {
    badge: 'Governance & RBAC',
    title: 'Jerarquía de Gobernanza, Ámbitos RBAC, Directivas de Azure y Bloqueos',
    titleEn: 'Azure Governance Hierarchy, RBAC Scopes, Azure Policies & Resource Locks',
    svg: '<svg viewBox="0 0 680 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
      SVG_DEFS +
      '<rect x="14" y="10" width="370" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#334155" stroke-width="1.2"/>' +
      '<text x="28" y="28" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" letter-spacing="0.08em">JERARQUÍA DE ÁMBITOS AZURE (HERENCIA ADITIVA)</text>' +
      '<line x1="38" y1="52" x2="38" y2="208" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3 3"/>' +
      '<circle cx="38" cy="52" r="3" fill="#38bdf8"/>' +
      '<circle cx="38" cy="106" r="3" fill="#818cf8"/>' +
      '<circle cx="38" cy="158" r="3" fill="#34d399"/>' +
      '<circle cx="38" cy="208" r="3" fill="#a78bfa"/>' +
      '<rect x="52" y="38" width="318" height="34" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>' +
      '<rect x="58" y="44" width="22" height="22" rx="4" fill="#0284c7" fill-opacity="0.3"/>' +
      '<text x="69" y="59" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">👑</text>' +
      '<text x="88" y="52" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">Root Management Group</text>' +
      '<text x="88" y="65" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="9.5">Ámbito raíz: gobierna todas las suscripciones del tenant</text>' +
      '<rect x="68" y="90" width="302" height="34" rx="6" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>' +
      '<rect x="74" y="96" width="22" height="22" rx="4" fill="#6366f1" fill-opacity="0.3"/>' +
      '<text x="85" y="111" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">💳</text>' +
      '<text x="104" y="104" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">Subscriptions (Prod / Dev / QA)</text>' +
      '<text x="104" y="117" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="9.5">Límite de facturación, cuotas de cómputo y confianza Entra</text>' +
      '<rect x="84" y="142" width="286" height="34" rx="6" fill="#0f172a" stroke="#34d399" stroke-width="1.2"/>' +
      '<rect x="90" y="148" width="22" height="22" rx="4" fill="#10b981" fill-opacity="0.3"/>' +
      '<text x="101" y="163" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">📁</text>' +
      '<text x="120" y="156" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">Resource Groups (rg-app-prod, rg-net)</text>' +
      '<text x="120" y="169" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="9.5">Contenedor de ciclo de vida e implementación conjunta</text>' +
      '<rect x="100" y="194" width="270" height="30" rx="6" fill="#0f172a" stroke="#a78bfa" stroke-width="1.2"/>' +
      '<text x="112" y="213" fill="#a78bfa" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="bold">⚙️ VMs · VNets · Disks · Storage</text>' +
      '<text x="280" y="213" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="9">Sin subrecursos</text>' +
      '<rect x="398" y="10" width="268" height="114" rx="8" fill="#1e293b" fill-opacity="0.6" stroke="#38bdf8" stroke-width="1.2"/>' +
      '<text x="412" y="27" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">AZURE POLICY · EFECTOS CLAVE</text>' +
      '<rect x="412" y="36" width="46" height="17" rx="3" fill="#ef4444" fill-opacity="0.25" stroke="#ef4444" stroke-width="1"/>' +
      '<text x="435" y="48" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" text-anchor="middle">Deny</text>' +
      '<text x="466" y="49" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="9">Bloquea creación si incumple la regla</text>' +
      '<rect x="412" y="57" width="46" height="17" rx="3" fill="#f59e0b" fill-opacity="0.25" stroke="#f59e0b" stroke-width="1"/>' +
      '<text x="435" y="69" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" text-anchor="middle">Audit</text>' +
      '<text x="466" y="70" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="9">Permite el recurso y crea evento en log</text>' +
      '<rect x="412" y="78" width="46" height="17" rx="3" fill="#0284c7" fill-opacity="0.25" stroke="#0284c7" stroke-width="1"/>' +
      '<text x="435" y="90" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" text-anchor="middle">Modify</text>' +
      '<text x="466" y="91" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="9">Agrega o reemplaza tags en ARM</text>' +
      '<rect x="412" y="99" width="46" height="17" rx="3" fill="#8b5cf6" fill-opacity="0.25" stroke="#8b5cf6" stroke-width="1"/>' +
      '<text x="435" y="111" fill="#c084fc" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="700" text-anchor="middle">DINE</text>' +
      '<text x="466" y="112" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="9">DeployIfNotExists: auto-remediación</text>' +
      '<rect x="398" y="132" width="268" height="98" rx="8" fill="#1e293b" fill-opacity="0.6" stroke="#f59e0b" stroke-width="1.2"/>' +
      '<text x="412" y="149" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">RESOURCE LOCKS (SUPERAN A OWNER)</text>' +
      '<rect x="412" y="158" width="92" height="28" rx="4" fill="#0f172a" stroke="#fbbf24" stroke-width="1"/>' +
      '<text x="420" y="172" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="700">🔒 CanNotDelete</text>' +
      '<text x="420" y="182" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Modificar ✅ | Borrar ❌</text>' +
      '<rect x="512" y="158" width="144" height="28" rx="4" fill="#0f172a" stroke="#ef4444" stroke-width="1"/>' +
      '<text x="520" y="172" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="700">🚫 ReadOnly</text>' +
      '<text x="520" y="182" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Modificar ❌ | Borrar ❌</text>' +
      '<text x="412" y="204" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="9">⚠️ Deben quitarse explícitamente antes de mutar el recurso</text>' +
      '<text x="412" y="218" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Los locks en RG o Subscripción se heredan a todo recurso hijo</text>' +
    '</svg>',
    caption: 'La jerarquía de gobernanza en Azure transmite permisos hacia abajo: los roles asignados por **RBAC** en niveles superiores (`Management Group`, `Subscription`) se heredan de manera aditiva e inalterable hacia los recursos (`Resource Group`, `Resource`). **Azure Policy** aplica directivas de cumplimiento preventivo o reactivo (`Deny`, `Audit`, `Modify`, `DeployIfNotExists`), mientras que los **Resource Locks** (`CanNotDelete` y `ReadOnly`) bloquean operaciones en el plano de control ARM prevaleciendo incluso sobre los privilegios del rol **Owner**.',
    captionEn: 'Azure governance hierarchy cascades permissions downward: **RBAC** roles assigned at upper levels (`Management Group`, `Subscription`) flow down additively to all contained child objects (`Resource Groups`, `Resources`). **Azure Policy** enforces compliance rules before or during provisioning (`Deny`, `Audit`, `Modify`, `DeployIfNotExists`), while **Resource Locks** (`CanNotDelete` and `ReadOnly`) restrict ARM control-plane operations, overriding even the highest **Owner** privileges.'
  };

  /* -------------------------------------------------------------------------
     Visual Aid 2: Entra ID, Conditional Access & Managed Identities
     ------------------------------------------------------------------------- */
  var visualEntra = {
    badge: 'Entra ID & Security',
    title: 'Arquitectura Entra ID: Pipeline de Conditional Access e Identidades Administradas',
    titleEn: 'Microsoft Entra ID: Conditional Access Pipeline & Managed Identity Architectures',
    svg: '<svg viewBox="0 0 680 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
      SVG_DEFS +
      '<rect x="14" y="10" width="410" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#334155" stroke-width="1.2"/>' +
      '<text x="26" y="28" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">CONDITIONAL ACCESS: SEÑAL → DECISIÓN → APLICACIÓN</text>' +
      '<rect x="24" y="38" width="112" height="182" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>' +
      '<rect x="32" y="46" width="96" height="20" rx="3" fill="#0284c7" fill-opacity="0.25"/>' +
      '<text x="80" y="60" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" text-anchor="middle">1. SEÑALES</text>' +
      '<text x="32" y="82" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600">👤 Identidad</text>' +
      '<text x="32" y="93" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Usuario, Rol, Guest B2B</text>' +
      '<text x="32" y="112" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600">📱 Dispositivo</text>' +
      '<text x="32" y="123" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Intune Compliant, Hybrid</text>' +
      '<text x="32" y="142" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600">🌐 Ubicación</text>' +
      '<text x="32" y="153" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">IP pública confiable / País</text>' +
      '<text x="32" y="172" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600">⚠️ Riesgo (P2)</text>' +
      '<text x="32" y="183" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Sign-in Risk & User Risk</text>' +
      '<text x="32" y="206" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">P1: Señales | P2: ML Risk</text>' +
      '<line x1="140" y1="126" x2="162" y2="126" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-az-cyan)"/>' +
      '<rect x="166" y="38" width="108" height="182" rx="6" fill="#0f172a" stroke="#fbbf24" stroke-width="1.2"/>' +
      '<rect x="172" y="46" width="96" height="20" rx="3" fill="#d97706" fill-opacity="0.25"/>' +
      '<text x="220" y="60" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" text-anchor="middle">2. DECISIÓN</text>' +
      '<circle cx="220" cy="98" r="22" fill="#1e293b" stroke="#fbbf24" stroke-width="1.5"/>' +
      '<text x="220" y="103" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="16" text-anchor="middle">⚡</text>' +
      '<text x="174" y="136" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600" text-anchor="middle">Motor de Directivas</text>' +
      '<text x="220" y="152" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" text-anchor="middle">Evaluación en tiempo real</text>' +
      '<text x="220" y="165" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" text-anchor="middle">de condiciones vs</text>' +
      '<text x="220" y="178" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" text-anchor="middle">requisitos de acceso</text>' +
      '<text x="220" y="206" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Zero Trust Engine</text>' +
      '<line x1="278" y1="126" x2="300" y2="126" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-az-cyan)"/>' +
      '<rect x="304" y="38" width="110" height="182" rx="6" fill="#0f172a" stroke="#34d399" stroke-width="1.2"/>' +
      '<rect x="312" y="46" width="94" height="20" rx="3" fill="#059669" fill-opacity="0.25"/>' +
      '<text x="359" y="60" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" text-anchor="middle">3. APLICACIÓN</text>' +
      '<rect x="312" y="74" width="94" height="26" rx="3" fill="#1e293b" stroke="#34d399" stroke-width="1"/>' +
      '<text x="359" y="86" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">🔐 Exigir MFA</text>' +
      '<text x="359" y="95" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Microsoft Authenticator</text>' +
      '<rect x="312" y="106" width="94" height="26" rx="3" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>' +
      '<text x="359" y="118" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">💻 Exigir Compliant</text>' +
      '<text x="359" y="127" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Cumplir políticas Intune</text>' +
      '<rect x="312" y="138" width="94" height="26" rx="3" fill="#1e293b" stroke="#a78bfa" stroke-width="1"/>' +
      '<text x="359" y="150" fill="#c084fc" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">🔑 Cambio de Clave</text>' +
      '<text x="359" y="159" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">SSPR por riesgo alto</text>' +
      '<rect x="312" y="170" width="94" height="24" rx="3" fill="#1e293b" stroke="#ef4444" stroke-width="1"/>' +
      '<text x="359" y="184" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">⛔ Bloquear Acceso</text>' +
      '<text x="359" y="206" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Grant vs Block</text>' +
      '<rect x="436" y="10" width="230" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#818cf8" stroke-width="1.2"/>' +
      '<text x="448" y="28" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">MANAGED IDENTITIES</text>' +
      '<rect x="446" y="38" width="210" height="74" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>' +
      '<rect x="454" y="44" width="115" height="16" rx="3" fill="#0284c7" fill-opacity="0.3"/>' +
      '<text x="458" y="56" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">System-Assigned</text>' +
      '<text x="454" y="73" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="9">🔗 Relación 1 a 1 con el recurso</text>' +
      '<text x="454" y="87" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Vida atada a la VM o App Service</text>' +
      '<text x="454" y="101" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Si se borra la VM → identidad se elimina</text>' +
      '<rect x="446" y="120" width="210" height="74" rx="6" fill="#0f172a" stroke="#a78bfa" stroke-width="1.2"/>' +
      '<rect x="454" y="126" width="105" height="16" rx="3" fill="#7c3aed" fill-opacity="0.3"/>' +
      '<text x="458" y="138" fill="#c084fc" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">User-Assigned</text>' +
      '<text x="454" y="155" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="9">👥 Relación 1 a N (Compartible)</text>' +
      '<text x="454" y="169" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Recurso independiente en ARM</text>' +
      '<text x="454" y="183" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Sobrevive a la eliminación de las VMs</text>' +
      '<rect x="446" y="200" width="210" height="22" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>' +
      '<text x="452" y="214" fill="#94a3b8" font-family="monospace" font-size="8">169.254.169.254/oauth2/token</text>' +
    '</svg>',
    caption: '**Conditional Access** actúa como plano de control Zero Trust en Entra ID: evalúa señales en tiempo real (identidad, estado de cumplimiento de Intune, ubicación IP y nivel de riesgo calculado por Entra ID Protection en licencias P2) para decidir si permitir el acceso, forzar **MFA**, exigir restablecimiento de contraseña vía **SSPR** o bloquear el intento. Por otro lado, las **Managed Identities** proporcionan identidad en Entra ID sin credenciales en código: **System-Assigned** vincula su ciclo de vida estrictamente al recurso (1:1), mientras que **User-Assigned** es un recurso ARM independiente compartible entre múltiples servicios (1:N).',
    captionEn: '**Conditional Access** functions as Entra ID’s Zero Trust policy engine: it analyzes real-time signals (user/group, Intune device compliance, named IP locations, and P2 identity protection risk) to decide whether to grant access, mandate **MFA**, prompt **SSPR** password reset, or block traffic outright. Concurrently, **Managed Identities** remove static credentials: **System-Assigned** shares a strict 1:1 lifecycle with the host resource, whereas **User-Assigned** operates as an independent ARM resource reusable across multiple workloads (1:N).'
  };

  /* -------------------------------------------------------------------------
     Visual Aid 3: Storage Redundancy & Access Tiers Lifecycle
     ------------------------------------------------------------------------- */
  var visualStorage = {
    badge: 'Storage & Lifecycle',
    title: 'Modelos de Redundancia de Storage y Transición de Niveles de Acceso',
    titleEn: 'Azure Storage Redundancy Options & Access Tier Lifecycle Policies',
    svg: '<svg viewBox="0 0 680 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
      SVG_DEFS +
      '<rect x="14" y="10" width="310" height="108" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#38bdf8" stroke-width="1.2"/>' +
      '<text x="26" y="26" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">REGIÓN PRIMARIA (COPIAS SÍNCRONAS)</text>' +
      '<rect x="24" y="34" width="140" height="74" rx="5" fill="#0f172a" stroke="#475569" stroke-width="1"/>' +
      '<text x="32" y="49" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700">LRS (Locally Redundant)</text>' +
      '<text x="32" y="63" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">3 copias en 1 Datacenter</text>' +
      '<text x="32" y="77" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Protege contra fallas de rack/disco</text>' +
      '<text x="32" y="93" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600">Durabilidad: 11 nueves</text>' +
      '<text x="32" y="103" fill="#ef4444" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Vulnerable a caída del DC</text>' +
      '<rect x="174" y="34" width="140" height="74" rx="5" fill="#0f172a" stroke="#34d399" stroke-width="1"/>' +
      '<text x="182" y="49" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700">ZRS (Zone-Redundant)</text>' +
      '<text x="182" y="63" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">3 copias en 3 AZs separadas</text>' +
      '<text x="182" y="77" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Tolerancia a caída de 1 DC entero</text>' +
      '<text x="182" y="93" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600">Durabilidad: 12 nueves</text>' +
      '<text x="182" y="103" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Replicación síncrona intra-región</text>' +
      '<line x1="324" y1="64" x2="352" y2="64" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arr-az-cyan)"/>' +
      '<text x="338" y="55" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="700" text-anchor="middle">ASINC</text>' +
      '<rect x="356" y="10" width="310" height="108" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#818cf8" stroke-width="1.2"/>' +
      '<text x="368" y="26" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">REGIÓN SECUNDARIA (PAR GEOGRÁFICO)</text>' +
      '<rect x="366" y="34" width="140" height="74" rx="5" fill="#0f172a" stroke="#818cf8" stroke-width="1"/>' +
      '<text x="374" y="49" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700">GRS / GZRS</text>' +
      '<text x="374" y="63" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">GRS: LRS primario + LRS sec</text>' +
      '<text x="374" y="77" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">GZRS: ZRS primario + LRS sec</text>' +
      '<text x="374" y="93" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600">Durabilidad: 16 nueves</text>' +
      '<text x="374" y="103" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Protege contra desastre regional</text>' +
      '<rect x="516" y="34" width="140" height="74" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>' +
      '<text x="524" y="49" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700">RA-GRS / RA-GZRS</text>' +
      '<text x="524" y="63" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="600">Lectura activa en sec</text>' +
      '<text x="524" y="77" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">Endpoint de solo lectura:</text>' +
      '<text x="524" y="89" fill="#94a3b8" font-family="monospace" font-size="7">*-secondary.blob...</text>' +
      '<text x="524" y="103" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Permite lecturas sin esperar failover</text>' +
      '<rect x="14" y="126" width="652" height="104" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#334155" stroke-width="1.2"/>' +
      '<text x="26" y="142" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" letter-spacing="0.08em">LIFECYCLE MANAGEMENT: POLÍTICAS DE TRANSICIÓN AUTOMÁTICA DE TIERS</text>' +
      '<rect x="24" y="150" width="140" height="70" rx="6" fill="#0f172a" stroke="#ef4444" stroke-width="1.2"/>' +
      '<text x="34" y="166" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">🔥 Hot Tier</text>' +
      '<text x="34" y="180" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Datos en uso frecuente</text>' +
      '<text x="34" y="193" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Menor costo por transacción</text>' +
      '<text x="34" y="206" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="8">Mayor costo de reposo (GB/mes)</text>' +
      '<line x1="166" y1="185" x2="182" y2="185" stroke="#818cf8" stroke-width="1.8" marker-end="url(#arr-az-indigo)"/>' +
      '<rect x="186" y="150" width="140" height="70" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>' +
      '<text x="196" y="166" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">❄️ Cool Tier</text>' +
      '<text x="196" y="180" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Poco acceso · Retención mín: 30d</text>' +
      '<text x="196" y="193" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Backups y datos de corto plazo</text>' +
      '<text x="196" y="206" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Penalidad si se borra antes de 30d</text>' +
      '<line x1="328" y1="185" x2="344" y2="185" stroke="#818cf8" stroke-width="1.8" marker-end="url(#arr-az-indigo)"/>' +
      '<rect x="348" y="150" width="140" height="70" rx="6" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>' +
      '<text x="358" y="166" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">🧊 Cold Tier</text>' +
      '<text x="358" y="180" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Muy poco acceso · Mín: 90d</text>' +
      '<text x="358" y="193" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Costo intermedio entre Cool y Arch</text>' +
      '<text x="358" y="206" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Acceso en línea sin rehidratación</text>' +
      '<line x1="490" y1="185" x2="506" y2="185" stroke="#818cf8" stroke-width="1.8" marker-end="url(#arr-az-indigo)"/>' +
      '<rect x="510" y="150" width="146" height="70" rx="6" fill="#0f172a" stroke="#a78bfa" stroke-width="1.2"/>' +
      '<text x="520" y="166" fill="#c084fc" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">📦 Archive Tier</text>' +
      '<text x="520" y="180" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Offline · Retención mín: 180d</text>' +
      '<text x="520" y="193" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Costo de reposo ultra bajo</text>' +
      '<text x="520" y="206" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="8">Rehidratar: Std (horas) / High (mins)</text>' +
    '</svg>',
    caption: 'Azure Storage ofrece múltiples opciones de redundancia según la tolerancia al desastre: **LRS** guarda 3 copias síncronas en un centro de datos (11 nueves de durabilidad), mientras que **ZRS** las distribuye en 3 Availability Zones independientes de la misma región (12 nueves). Para protección ante caídas regionales completas, **GRS** y **GZRS** replican asíncronamente a una región secundaria emparejada (16 nueves); habilitar **RA-GRS** / **RA-GZRS** añade acceso de lectura directo al endpoint secundario (`*-secondary.blob.core.windows.net`). Las directivas de **Lifecycle Management** permiten abaratar costos moviendo blobs automáticamente según su antigüedad: **Hot** (inmediato) → **Cool** (mínimo 30 días) → **Cold** (mínimo 90 días) → **Archive** (mínimo 180 días, desconectado, requiere proceso de rehidratación).',
    captionEn: 'Azure Storage delivers multiple durability options: **LRS** keeps 3 synchronous copies within 1 datacenter (11 nines), whereas **ZRS** disperses them across 3 availability zones in the same region (12 nines). For regional DR, **GRS** and **GZRS** asynchronously replicate data to a paired region (16 nines); choosing **RA-GRS** / **RA-GZRS** unlocks direct read access at the secondary DNS endpoint (`*-secondary.blob.core.windows.net`). **Lifecycle Management** automates cost optimization by demoting blobs over time: **Hot** → **Cool** (30-day min) → **Cold** (90-day min) → **Archive** (180-day min; offline, requires rehydration).'
  };

  /* -------------------------------------------------------------------------
     Visual Aid 4: Virtual Networking, Hub-Spoke & NSG Order
     ------------------------------------------------------------------------- */
  var visualNetworking = {
    badge: 'Networking & Security',
    title: 'Topología Hub-Spoke (Peering No Transitivo) y Orden de Evaluación NSG',
    titleEn: 'Hub-Spoke VNet Peering Non-Transitive Topology & NSG Evaluation Order',
    svg: '<svg viewBox="0 0 680 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
      SVG_DEFS +
      '<rect x="14" y="10" width="180" height="102" rx="6" fill="#1e293b" fill-opacity="0.6" stroke="#38bdf8" stroke-width="1.2"/>' +
      '<text x="24" y="26" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="700">SPOKE-1 VNET (10.1.0.0/16)</text>' +
      '<rect x="24" y="34" width="160" height="42" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>' +
      '<text x="32" y="49" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600">Subnet: 10.1.1.0/24</text>' +
      '<text x="32" y="64" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">💻 Frontend Web VMs (NIC NSG)</text>' +
      '<text x="24" y="94" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">Peered to Hub ✅</text>' +
      '<text x="24" y="104" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">UDR: 10.2.0.0/16 → Hub FW</text>' +
      '<line x1="194" y1="56" x2="238" y2="56" stroke="#38bdf8" stroke-width="2"/>' +
      '<text x="216" y="50" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" font-weight="700" text-anchor="middle">PEERING</text>' +
      '<rect x="240" y="8" width="200" height="106" rx="6" fill="#1e293b" stroke="#fbbf24" stroke-width="1.5"/>' +
      '<text x="250" y="24" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">HUB VNET (10.0.0.0/16)</text>' +
      '<rect x="248" y="32" width="184" height="34" rx="4" fill="#0f172a" stroke="#ef4444" stroke-width="1"/>' +
      '<text x="256" y="46" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">🔥 Azure Firewall / NVA</text>' +
      '<text x="256" y="58" fill="#cbd5e1" font-family="monospace" font-size="8">Private IP: 10.0.1.4</text>' +
      '<rect x="248" y="70" width="184" height="38" rx="4" fill="#0f172a" stroke="#818cf8" stroke-width="1"/>' +
      '<text x="256" y="84" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700">🌐 VPN / ExpressRoute Gateway</text>' +
      '<text x="256" y="98" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Gateway Transit activo para Spokes</text>' +
      '<line x1="440" y1="56" x2="484" y2="56" stroke="#38bdf8" stroke-width="2"/>' +
      '<text x="462" y="50" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" font-weight="700" text-anchor="middle">PEERING</text>' +
      '<rect x="486" y="10" width="180" height="102" rx="6" fill="#1e293b" fill-opacity="0.6" stroke="#818cf8" stroke-width="1.2"/>' +
      '<text x="496" y="26" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="700">SPOKE-2 VNET (10.2.0.0/16)</text>' +
      '<rect x="496" y="34" width="160" height="42" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>' +
      '<text x="504" y="49" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600">Subnet: 10.2.1.0/24</text>' +
      '<text x="504" y="64" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">🗄️ Backend SQL DBs (Private EP)</text>' +
      '<text x="496" y="94" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">Peered to Hub ✅</text>' +
      '<text x="496" y="104" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">NO transitivo con Spoke-1 sin NVA</text>' +
      '<path d="M 104 112 Q 340 134 576 112" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3 3"/>' +
      '<text x="340" y="126" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="700" text-anchor="middle">❌ Peering NO es transitivo entre Spoke-1 y Spoke-2 (Requiere UDR → NVA en Hub)</text>' +
      '<rect x="14" y="134" width="652" height="98" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#334155" stroke-width="1.2"/>' +
      '<text x="26" y="150" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" letter-spacing="0.08em">ORDEN DE EVALUACIÓN NSG (REGLAS 100-4096 · PRIMERA COINCIDENCIA GANA)</text>' +
      '<text x="26" y="172" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">INBOUND:</text>' +
      '<rect x="90" y="160" width="80" height="22" rx="3" fill="#0f172a" stroke="#475569" stroke-width="1"/>' +
      '<text x="130" y="174" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" text-anchor="middle">Internet / IP</text>' +
      '<line x1="172" y1="171" x2="194" y2="171" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arr-az-cyan)"/>' +
      '<rect x="198" y="160" width="150" height="22" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>' +
      '<text x="273" y="174" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">1° Subnet NSG (Evalúa 100..)</text>' +
      '<line x1="350" y1="171" x2="372" y2="171" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arr-az-cyan)"/>' +
      '<rect x="376" y="160" width="146" height="22" rx="3" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>' +
      '<text x="449" y="174" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">2° NIC NSG (Evalúa 100..)</text>' +
      '<line x1="524" y1="171" x2="546" y2="171" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arr-az-cyan)"/>' +
      '<rect x="550" y="160" width="104" height="22" rx="3" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-width="1"/>' +
      '<text x="602" y="174" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">💻 VM Destino</text>' +
      '<text x="26" y="206" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">OUTBOUND:</text>' +
      '<rect x="90" y="194" width="80" height="22" rx="3" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-width="1"/>' +
      '<text x="130" y="208" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">💻 VM Origen</text>' +
      '<line x1="172" y1="205" x2="194" y2="205" stroke="#fbbf24" stroke-width="1.5" marker-end="url(#arr-az-amber)"/>' +
      '<rect x="198" y="194" width="150" height="22" rx="3" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>' +
      '<text x="273" y="208" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">1° NIC NSG (Evalúa 100..)</text>' +
      '<line x1="350" y1="205" x2="372" y2="205" stroke="#fbbf24" stroke-width="1.5" marker-end="url(#arr-az-amber)"/>' +
      '<rect x="376" y="194" width="146" height="22" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>' +
      '<text x="449" y="208" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">2° Subnet NSG (Evalúa 100..)</text>' +
      '<line x1="524" y1="205" x2="546" y2="205" stroke="#fbbf24" stroke-width="1.5" marker-end="url(#arr-az-amber)"/>' +
      '<rect x="550" y="194" width="104" height="22" rx="3" fill="#0f172a" stroke="#475569" stroke-width="1"/>' +
      '<text x="602" y="208" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" text-anchor="middle">Internet / Red</text>' +
      '<text x="26" y="226" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Prioridades: 65000 (AllowVNetInBound), 65001 (AllowAzureLoadBalancerInBound), 65500 (DenyAllInBound)</text>' +
    '</svg>',
    caption: 'En topologías Azure **Hub-Spoke**, el emparejamiento **VNet Peering** conecta spokes a una red central con latencia intra-datacenter y cifrado transparente. Sin embargo, el peering **no es transitivo**: el tráfico entre `Spoke-1` y `Spoke-2` no fluye a través del Hub por defecto; se requiere una tabla de rutas personalizadas (**UDR**) con regla `0.0.0.0/0` o prefijo destino apuntando como *Next Hop* a la IP privada del firewall o NVA (`VirtualAppliance`) en el Hub. Respecto al filtrado por **NSG**, las reglas se procesan en orden de prioridad numérica ascendente (100 a 4096): en tráfico entrante (*Inbound*) se evalúa primero el NSG de la subred y luego el de la interfaz de red (NIC); en tráfico saliente (*Outbound*) el orden se invierte (NIC primero, Subnet después).',
    captionEn: 'In Azure **Hub-Spoke** topologies, **VNet Peering** interconnects VNets with line-rate low latency without internet gateways. Crucially, peering is **non-transitive**: packets between `Spoke-1` and `Spoke-2` will not cross the Hub automatically without a **User Defined Route (UDR)** designating the Hub firewall/NVA private IP as the *Next Hop* (`VirtualAppliance`). For **NSG** security filtering, rules process in ascending numerical priority (100 to 4096; first match wins): inbound traffic evaluates the subnet NSG first then the NIC NSG; outbound traffic traverses NIC NSG first followed by subnet NSG.'
  };

  /* -------------------------------------------------------------------------
     Visual Aid 5: Compute HA (Availability Sets vs AZs & VMSS)
     ------------------------------------------------------------------------- */
  var visualCompute = {
    badge: 'Compute & High Availability',
    title: 'Alta Disponibilidad en Cómputo: Availability Sets (FD/UD) vs Availability Zones y VMSS',
    titleEn: 'Compute High Availability: Availability Sets (FD/UD) vs Availability Zones & VMSS',
    svg: '<svg viewBox="0 0 680 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
      SVG_DEFS +
      '<rect x="14" y="10" width="310" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#38bdf8" stroke-width="1.2"/>' +
      '<rect x="24" y="18" width="140" height="18" rx="3" fill="#0284c7" fill-opacity="0.3"/>' +
      '<text x="28" y="31" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700">AVAILABILITY SET (99.95% SLA)</text>' +
      '<text x="174" y="31" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="9">1 Datacenter físico</text>' +
      '<text x="24" y="52" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">Fault Domains (FD 0..2) · Aislamiento Eléctrico/Red</text>' +
      '<rect x="24" y="58" width="88" height="66" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>' +
      '<text x="68" y="72" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">Rack FD 0</text>' +
      '<rect x="30" y="78" width="76" height="18" rx="2" fill="#1e293b" stroke="#38bdf8" stroke-width="0.8"/>' +
      '<text x="68" y="90" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">VM-1 (UD 0)</text>' +
      '<text x="68" y="114" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">PDU & Switch A</text>' +
      '<rect x="124" y="58" width="88" height="66" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>' +
      '<text x="168" y="72" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">Rack FD 1</text>' +
      '<rect x="130" y="78" width="76" height="18" rx="2" fill="#1e293b" stroke="#38bdf8" stroke-width="0.8"/>' +
      '<text x="168" y="90" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">VM-2 (UD 1)</text>' +
      '<text x="168" y="114" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">PDU & Switch B</text>' +
      '<rect x="224" y="58" width="88" height="66" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>' +
      '<text x="268" y="72" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">Rack FD 2</text>' +
      '<rect x="230" y="78" width="76" height="18" rx="2" fill="#1e293b" stroke="#38bdf8" stroke-width="0.8"/>' +
      '<text x="268" y="90" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">VM-3 (UD 2)</text>' +
      '<text x="268" y="114" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">PDU & Switch C</text>' +
      '<rect x="24" y="132" width="288" height="42" rx="4" fill="#0f172a" stroke="#818cf8" stroke-width="1"/>' +
      '<text x="32" y="146" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700">Update Domains (UD 0..UD 19) · Reinicios Escalonados</text>' +
      '<text x="32" y="159" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">Durante mantenimiento programado de Azure, solo reinicia 1 UD a la vez.</text>' +
      '<text x="32" y="169" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Máximo 3 FDs y hasta 20 UDs configurables.</text>' +
      '<text x="24" y="190" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="8">⚠️ No protege ante inundación o incendio del edificio</text>' +
      '<text x="24" y="202" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Las VMs deben crearse dentro del Availability Set (no agregable después)</text>' +
      '<text x="24" y="214" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Usar Managed Disks alinea automáticamente los discos con el FD de la VM</text>' +
      '<rect x="340" y="10" width="326" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#34d399" stroke-width="1.2"/>' +
      '<rect x="350" y="18" width="145" height="18" rx="3" fill="#059669" fill-opacity="0.3"/>' +
      '<text x="354" y="31" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700">AVAILABILITY ZONES (99.99% SLA)</text>' +
      '<text x="510" y="31" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="9">3 Datacenters independientes</text>' +
      '<rect x="350" y="44" width="96" height="88" rx="5" fill="#0f172a" stroke="#34d399" stroke-width="1"/>' +
      '<text x="398" y="58" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" text-anchor="middle">🏢 Zona 1</text>' +
      '<text x="398" y="70" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Energía A</text>' +
      '<text x="398" y="80" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Clima A · Red A</text>' +
      '<rect x="358" y="86" width="80" height="20" rx="3" fill="#1e293b" stroke="#34d399" stroke-width="0.8"/>' +
      '<text x="398" y="100" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">VMSS Instancia 1</text>' +
      '<text x="398" y="122" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Datacenter 1</text>' +
      '<rect x="454" y="44" width="96" height="88" rx="5" fill="#0f172a" stroke="#34d399" stroke-width="1"/>' +
      '<text x="502" y="58" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" text-anchor="middle">🏢 Zona 2</text>' +
      '<text x="502" y="70" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Energía B</text>' +
      '<text x="502" y="80" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Clima B · Red B</text>' +
      '<rect x="462" y="86" width="80" height="20" rx="3" fill="#1e293b" stroke="#34d399" stroke-width="0.8"/>' +
      '<text x="502" y="100" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">VMSS Instancia 2</text>' +
      '<text x="502" y="122" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Datacenter 2</text>' +
      '<rect x="558" y="44" width="96" height="88" rx="5" fill="#0f172a" stroke="#34d399" stroke-width="1"/>' +
      '<text x="606" y="58" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" text-anchor="middle">🏢 Zona 3</text>' +
      '<text x="606" y="70" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Energía C</text>' +
      '<text x="606" y="80" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Clima C · Red C</text>' +
      '<rect x="566" y="86" width="80" height="20" rx="3" fill="#1e293b" stroke="#34d399" stroke-width="0.8"/>' +
      '<text x="606" y="100" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">VMSS Instancia 3</text>' +
      '<text x="606" y="122" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Datacenter 3</text>' +
      '<text x="502" y="146" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="600" text-anchor="middle">⚡ Red perimetral de fibra óptica de alta velocidad (Latencia &lt; 2 ms)</text>' +
      '<rect x="350" y="154" width="304" height="66" rx="5" fill="#0f172a" stroke="#818cf8" stroke-width="1"/>' +
      '<text x="360" y="168" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">Virtual Machine Scale Sets (VMSS) & AKS</text>' +
      '<text x="360" y="181" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">Autoescalado elástico: agrega/quita instancias según CPU o métrica personalizada</text>' +
      '<text x="360" y="193" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Modo de orquestación Flexible vs Uniforme; soporte de Rolling Upgrades</text>' +
      '<text x="360" y="206" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Zone-Redundant: distribuye automáticamente las réplicas en Zonas 1, 2 y 3</text>' +
    '</svg>',
    caption: 'En Azure, los **Availability Sets** protegen cargas de trabajo dentro de un único centro de datos (99.95% SLA) distribuyendo las VMs en hasta 3 **Fault Domains** (racks independientes con alimentación y switches físicos propios) y hasta 20 **Update Domains** (grupos de reinicio secuencial durante parches planificados). En contraste, las **Availability Zones** elevan el SLA a 99.99% al ubicar los recursos en 3 centros de datos físicos separados dentro de la región con redes de ultra baja latencia (&lt;2ms). Los **VM Scale Sets (VMSS)** aprovechan esta arquitectura para autoescalar horizontalmente instancias idénticas con balanceo de carga zonal o multi-zona.',
    captionEn: 'Azure **Availability Sets** isolate VMs inside a single datacenter (99.95% SLA) across up to 3 **Fault Domains** (separate physical power and top-of-rack switches) and 20 **Update Domains** (rolling reboot groups for platform maintenance). Conversely, **Availability Zones** elevate resilience to 99.99% SLA by distributing VMs across 3 physically distinct datacenters in the region linked by round-trip latency &lt;2ms. **VM Scale Sets (VMSS)** leverage zone-redundancy for automatic elastic scaling with rolling updates.'
  };

  /* -------------------------------------------------------------------------
     Visual Aid 6: Monitoring, KQL & Backup/Site Recovery (ASR)
     ------------------------------------------------------------------------- */
  var visualMonitoring = {
    badge: 'Monitoring & Disaster Recovery',
    title: 'Pipeline de Telemetría (Azure Monitor, Log Analytics, KQL) y Resiliencia (Backup vs ASR)',
    titleEn: 'Telemetry Pipeline (Azure Monitor, Log Analytics, KQL) & Resilience (Backup vs ASR)',
    svg: '<svg viewBox="0 0 680 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
      SVG_DEFS +
      '<rect x="14" y="10" width="420" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#334155" stroke-width="1.2"/>' +
      '<text x="26" y="26" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">PIPELINE DE OBSERVABILIDAD AZURE MONITOR</text>' +
      '<rect x="22" y="34" width="100" height="186" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>' +
      '<text x="72" y="48" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" text-anchor="middle">FUENTES</text>' +
      '<rect x="28" y="56" width="88" height="34" rx="3" fill="#1e293b" stroke="#475569" stroke-width="0.8"/>' +
      '<text x="72" y="68" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="600" text-anchor="middle">Activity Log</text>' +
      '<text x="72" y="80" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">ARM Plano Control</text>' +
      '<rect x="28" y="96" width="88" height="34" rx="3" fill="#1e293b" stroke="#475569" stroke-width="0.8"/>' +
      '<text x="72" y="108" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="600" text-anchor="middle">Platform Metrics</text>' +
      '<text x="72" y="120" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">CPU, RAM, IOPS</text>' +
      '<rect x="28" y="136" width="88" height="36" rx="3" fill="#1e293b" stroke="#475569" stroke-width="0.8"/>' +
      '<text x="72" y="148" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="600" text-anchor="middle">AMA Agent / Logs</text>' +
      '<text x="72" y="160" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Guest OS, Syslog</text>' +
      '<text x="72" y="208" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Diagnostic Settings</text>' +
      '<line x1="124" y1="126" x2="142" y2="126" stroke="#38bdf8" stroke-width="1.8" marker-end="url(#arr-az-cyan)"/>' +
      '<rect x="146" y="34" width="138" height="186" rx="5" fill="#0f172a" stroke="#818cf8" stroke-width="1"/>' +
      '<text x="215" y="48" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" text-anchor="middle">ANÁLISIS &amp; KQL</text>' +
      '<rect x="152" y="56" width="126" height="42" rx="3" fill="#1e293b" stroke="#38bdf8" stroke-width="0.8"/>' +
      '<text x="215" y="70" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">Metrics Explorer</text>' +
      '<text x="215" y="82" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Tiempo real · Retención 93d</text>' +
      '<text x="215" y="92" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Consultas numéricas ligeras</text>' +
      '<rect x="152" y="104" width="126" height="74" rx="3" fill="#1e293b" stroke="#818cf8" stroke-width="0.8"/>' +
      '<text x="215" y="118" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">Log Analytics Workspace</text>' +
      '<text x="215" y="131" fill="#c084fc" font-family="monospace" font-size="7.5" text-anchor="middle">Kusto Query Language</text>' +
      '<text x="215" y="144" fill="#cbd5e1" font-family="monospace" font-size="7" text-anchor="middle">Heartbeat | summarize</text>' +
      '<text x="215" y="156" fill="#cbd5e1" font-family="monospace" font-size="7" text-anchor="middle">count() by bin(Time, 1h)</text>' +
      '<text x="215" y="170" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Azure Workbooks / Dashboards</text>' +
      '<text x="215" y="208" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Retención: 30 a 730 días</text>' +
      '<line x1="286" y1="126" x2="304" y2="126" stroke="#fbbf24" stroke-width="1.8" marker-end="url(#arr-az-amber)"/>' +
      '<rect x="308" y="34" width="116" height="186" rx="5" fill="#0f172a" stroke="#fbbf24" stroke-width="1"/>' +
      '<text x="366" y="48" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" text-anchor="middle">ALERTAS &amp; ACCIONES</text>' +
      '<rect x="314" y="56" width="104" height="30" rx="3" fill="#1e293b" stroke="#fbbf24" stroke-width="0.8"/>' +
      '<text x="366" y="69" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="700" text-anchor="middle">Alert Rules</text>' +
      '<text x="366" y="80" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Métrica / Log / Activity</text>' +
      '<line x1="366" y1="88" x2="366" y2="98" stroke="#fbbf24" stroke-width="1.2"/>' +
      '<rect x="314" y="100" width="104" height="110" rx="3" fill="#1e293b" stroke="#34d399" stroke-width="0.8"/>' +
      '<text x="366" y="113" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="700" text-anchor="middle">Action Groups</text>' +
      '<text x="320" y="129" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">📧 Email / SMS / Push</text>' +
      '<text x="320" y="145" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">⚡ Webhook / Logic App</text>' +
      '<text x="320" y="161" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">⚙️ Azure Automation</text>' +
      '<text x="320" y="177" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">🎫 ITSM (ServiceNow)</text>' +
      '<text x="366" y="199" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Auto-remediación inmediata</text>' +
      '<rect x="444" y="10" width="222" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#34d399" stroke-width="1.2"/>' +
      '<text x="456" y="26" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="700">RECOVERY SERVICES VAULT</text>' +
      '<rect x="452" y="36" width="206" height="82" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>' +
      '<rect x="460" y="42" width="90" height="16" rx="3" fill="#0284c7" fill-opacity="0.3"/>' +
      '<text x="464" y="54" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700">Azure Backup</text>' +
      '<text x="460" y="70" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="8">🛡️ Puntos de restauración históricos</text>' +
      '<text x="460" y="82" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Retención diaria, semanal, mensual, anual</text>' +
      '<text x="460" y="94" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Soporta VMs, SQL en VM, Azure Files, MARS</text>' +
      '<text x="460" y="108" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" font-weight="600">RPO: diario/horas | RTO: horas</text>' +
      '<rect x="452" y="126" width="206" height="94" rx="5" fill="#0f172a" stroke="#f87171" stroke-width="1.2"/>' +
      '<rect x="460" y="132" width="125" height="16" rx="3" fill="#dc2626" fill-opacity="0.25"/>' +
      '<text x="464" y="144" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700">Site Recovery (ASR)</text>' +
      '<text x="460" y="160" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="8">⚡ Replicación continua bloque a bloque</text>' +
      '<text x="460" y="172" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Orquestación de Disaster Recovery regional</text>' +
      '<text x="460" y="184" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Test Failover sin impacto en producción</text>' +
      '<text x="460" y="196" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" font-weight="700">RPO: segundos/minutos (&lt;15 min)</text>' +
      '<text x="460" y="208" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" font-weight="700">RTO: minutos (Failover casi instantáneo)</text>' +
    '</svg>',
    caption: '**Azure Monitor** estructura el ciclo de vida de observabilidad: recolecta el **Activity Log** (operaciones de suscripción y plano de control ARM), métricas de plataforma y registros recopilados por el **Azure Monitor Agent (AMA)** hacia **Metrics Explorer** y **Log Analytics Workspace**. Mediante consultas en lenguaje **KQL (Kusto Query Language)** se investigan anomalías y se configuran reglas de alerta vinculadas a **Action Groups** (correo, SMS, Logic Apps, runbooks de automatización). Para continuidad de negocio dentro del **Recovery Services Vault**, **Azure Backup** garantiza retención histórica a largo plazo con restauración granular, mientras que **Azure Site Recovery (ASR)** ejecuta replicación continua y conmutación por error ante desastres regionales con mínimo RTO y RPO.',
    captionEn: '**Azure Monitor** powers cloud telemetry by ingesting **Activity Logs** (subscription-level ARM mutations), platform metrics, and OS logs via **Azure Monitor Agent (AMA)** into **Metrics Explorer** and **Log Analytics Workspaces**. Analysts query high-volume logs with **KQL (Kusto Query Language)** and feed alert rules into automated **Action Groups** (Email, SMS, Webhooks, Runbooks). In parallel, the **Recovery Services Vault** handles data resilience: **Azure Backup** secures point-in-time retention copies, while **Azure Site Recovery (ASR)** streams block-level delta replication for ultra-low RTO/RPO regional disaster recovery.'
  };

  /* -------------------------------------------------------------------------
     Visual Aid 7: Azure Load Balancing Decision Matrix (L4 vs L7 / Regional vs Global)
     ------------------------------------------------------------------------- */
  var visualLoadBalancing = {
    badge: 'Load Balancing & Traffic',
    title: 'Matriz de Decisión de Balanceo de Carga en Azure (L4 vs L7 · Regional vs Global)',
    titleEn: 'Azure Load Balancing Decision Matrix (L4 vs L7 · Regional vs Global)',
    svg: '<svg viewBox="0 0 680 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
      SVG_DEFS +
      /* Top Left: Azure Load Balancer (Regional L4) */
      '<rect x="14" y="10" width="316" height="106" rx="7" fill="#1e293b" fill-opacity="0.5" stroke="#38bdf8" stroke-width="1.2"/>' +
      '<rect x="22" y="16" width="165" height="18" rx="3" fill="#0284c7" fill-opacity="0.3"/>' +
      '<text x="26" y="29" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="700">AZURE LOAD BALANCER (L4 · REGIONAL)</text>' +
      '<text x="22" y="48" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600">Tráfico TCP / UDP · Latencia Ultra Baja</text>' +
      '<text x="22" y="62" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">Standard SKU: Soporta Availability Zones y backend de hasta 1000 VMs</text>' +
      '<text x="22" y="75" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Health Probes: TCP, HTTP, HTTPS · Algoritmo hash de 5 tuplas</text>' +
      '<text x="22" y="89" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="600">Inbound NAT Rules: RDP/SSH directo a una VM específica</text>' +
      '<text x="22" y="102" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Público (Frontend IP pública) o Interno (IP privada en VNet)</text>' +
      /* Top Right: Application Gateway (Regional L7) */
      '<rect x="350" y="10" width="316" height="106" rx="7" fill="#1e293b" fill-opacity="0.5" stroke="#34d399" stroke-width="1.2"/>' +
      '<rect x="358" y="16" width="180" height="18" rx="3" fill="#059669" fill-opacity="0.3"/>' +
      '<text x="362" y="29" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="700">APPLICATION GATEWAY (L7 · REGIONAL)</text>' +
      '<text x="358" y="48" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600">Tráfico HTTP / HTTPS / WebSocket</text>' +
      '<text x="358" y="62" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">URL Path-based routing (/images/* vs /api/*) y multi-sitio</text>' +
      '<text x="358" y="75" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">SSL Termination / Re-encryption y afinidad de sesión basada en cookies</text>' +
      '<text x="358" y="89" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="600">WAF v2 Integrado: Reglas OWASP contra SQLi, XSS y bots</text>' +
      '<text x="358" y="102" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Requiere una subred dedicada sin otros recursos de cómputo</text>' +
      /* Bottom Left: Azure Traffic Manager (Global DNS) */
      '<rect x="14" y="124" width="316" height="106" rx="7" fill="#1e293b" fill-opacity="0.5" stroke="#fbbf24" stroke-width="1.2"/>' +
      '<rect x="22" y="130" width="165" height="18" rx="3" fill="#d97706" fill-opacity="0.3"/>' +
      '<text x="26" y="143" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="700">TRAFFIC MANAGER (DNS · GLOBAL)</text>' +
      '<text x="22" y="162" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600">Enrutamiento Basado en DNS Multi-Región</text>' +
      '<text x="22" y="176" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">Métodos: Priority (Activo/Pasivo), Performance (Latencia), Weighted, Geo</text>' +
      '<text x="22" y="189" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">NO pasa tráfico HTTP por intermediario (el cliente conecta directo a la IP)</text>' +
      '<text x="22" y="203" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="600">Monitoreo de estado por sondas HTTP/HTTPS hacia endpoints</text>' +
      '<text x="22" y="217" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Tiempo de failover sujeto al valor de TTL DNS configurado</text>' +
      /* Bottom Right: Azure Front Door (Global L7 Anycast) */
      '<rect x="350" y="124" width="316" height="106" rx="7" fill="#1e293b" fill-opacity="0.5" stroke="#a78bfa" stroke-width="1.2"/>' +
      '<rect x="358" y="130" width="180" height="18" rx="3" fill="#7c3aed" fill-opacity="0.3"/>' +
      '<text x="362" y="143" fill="#c084fc" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="700">AZURE FRONT DOOR (L7 ANYCAST · GLOBAL)</text>' +
      '<text x="358" y="162" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600">Proxy Inverso Global con Aceleración Edge</text>' +
      '<text x="358" y="176" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">Enrutamiento Anycast por la red troncal privada de Microsoft</text>' +
      '<text x="358" y="189" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Terminación SSL en el borde (Split-TCP), compresión y CDN estática</text>' +
      '<text x="358" y="203" fill="#c084fc" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="600">WAF perimetral global, mitigación DDoS y limitación de tasa (Rate Limit)</text>' +
      '<text x="358" y="217" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Soporta Private Link origin para conectar a backends privados en Azure</text>' +
    '</svg>',
    caption: 'Azure ofrece cuatro servicios de balanceo de carga según la capa OSI y el alcance geográfico: **Azure Load Balancer** opera en capa 4 (TCP/UDP, regional, ultra baja latencia) distribuyendo tráfico a través de reglas de balanceo e inbound NAT rules; **Application Gateway** opera en capa 7 (HTTP/HTTPS, regional) ofreciendo WAF v2, terminación SSL y enrutamiento por URL/cookies; **Azure Front Door** actúa como proxy inverso global Anycast de capa 7 con aceleración CDN y WAF perimetral; y **Traffic Manager** gestiona la distribución global en capa de transporte mediante resolución DNS (Priority, Weighted, Performance).',
    captionEn: 'Azure categorizes load balancers across the OSI stack and scope: **Azure Load Balancer** operates at Layer 4 (TCP/UDP, regional, ultra-low latency) with LB rules and inbound NAT; **Application Gateway** functions at Layer 7 (HTTP/HTTPS, regional) providing WAF v2, SSL termination, and cookie/URL routing; **Azure Front Door** serves as a global Layer 7 Anycast reverse proxy with CDN acceleration and edge WAF; and **Traffic Manager** routes global traffic at the DNS level across multi-region endpoints.'
  };

  /* -------------------------------------------------------------------------
     Visual Aid 8: Azure Storage Security (SAS Types & Private Endpoints)
     ------------------------------------------------------------------------- */
  var visualStorageSecurity = {
    badge: 'Storage Security & SAS',
    title: 'Seguridad en Storage: Tipos de SAS, Directivas de Acceso y Private Endpoints',
    titleEn: 'Azure Storage Security: SAS Types, Stored Access Policies & Private Endpoints',
    svg: '<svg viewBox="0 0 680 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
      SVG_DEFS +
      /* Left Column: SAS Tokens Hierarchy */
      '<rect x="14" y="10" width="326" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#334155" stroke-width="1.2"/>' +
      '<text x="26" y="26" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="700">SHARED ACCESS SIGNATURES (SAS)</text>' +
      /* User Delegation SAS */
      '<rect x="22" y="34" width="310" height="52" rx="5" fill="#0f172a" stroke="#34d399" stroke-width="1.2"/>' +
      '<text x="30" y="48" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="700">👑 User Delegation SAS (Máxima Seguridad)</text>' +
      '<text x="30" y="61" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Firmada con credenciales Microsoft Entra ID (OAuth 2.0)</text>' +
      '<text x="30" y="74" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">No expone las claves maestras de la cuenta · Vigencia máx 7 días</text>' +
      /* Service SAS vs Account SAS */
      '<rect x="22" y="92" width="310" height="60" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>' +
      '<text x="30" y="106" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="700">🔑 Service SAS vs Account SAS</text>' +
      '<text x="30" y="119" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Firmadas con la clave maestra de la cuenta (Key1 / Key2)</text>' +
      '<text x="30" y="132" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Account SAS: acceso a nivel de cuenta (Blobs, Files, Queues, Tables)</text>' +
      '<text x="30" y="144" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Service SAS: delimita acceso a 1 contenedor o recurso específico</text>' +
      /* Stored Access Policy */
      '<rect x="22" y="158" width="310" height="62" rx="5" fill="#0f172a" stroke="#fbbf24" stroke-width="1.2"/>' +
      '<text x="30" y="172" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="700">📋 Stored Access Policy (Revocación Inmediata)</text>' +
      '<text x="30" y="185" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Agrupa y controla permisos/tiempos de Service SAS en el servidor</text>' +
      '<text x="30" y="198" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="600">Permite revocar el token SAS sin regenerar las claves maestras</text>' +
      '<text x="30" y="210" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Máximo 5 políticas por contenedor / cola / tabla / recurso compartido</text>' +
      /* Right Column: Storage Network Firewall & Private Endpoint */
      '<rect x="350" y="10" width="316" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#818cf8" stroke-width="1.2"/>' +
      '<text x="362" y="26" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="700">AISLAMIENTO DE RED: PRIVATE ENDPOINT</text>' +
      /* VNet box with Private Endpoint */
      '<rect x="358" y="34" width="300" height="96" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>' +
      '<text x="368" y="48" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">Customer VNet (10.1.0.0/16) · Subnet (10.1.2.0/24)</text>' +
      '<rect x="368" y="56" width="130" height="26" rx="3" fill="#1e293b" stroke="#475569" stroke-width="0.8"/>' +
      '<text x="433" y="72" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="8" text-anchor="middle">💻 App Virtual Machine</text>' +
      '<line x1="500" y1="69" x2="520" y2="69" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arr-az-cyan)"/>' +
      '<rect x="524" y="56" width="136" height="34" rx="3" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-width="1"/>' +
      '<text x="592" y="69" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">Private Endpoint (NIC)</text>' +
      '<text x="592" y="82" fill="#cbd5e1" font-family="monospace" font-size="8" text-anchor="middle">IP: 10.1.2.5</text>' +
      '<text x="368" y="108" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">Azure Private DNS: privatelink.blob.core.windows.net → 10.1.2.5</text>' +
      '<text x="368" y="122" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Tráfico 100% dentro de la fibra troncal de Microsoft, sin salir a internet</text>' +
      /* Storage Firewall rules card */
      '<rect x="358" y="136" width="300" height="84" rx="6" fill="#0f172a" stroke="#ef4444" stroke-width="1"/>' +
      '<text x="368" y="152" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">Storage Firewall: Public Network Access</text>' +
      '<rect x="368" y="160" width="160" height="20" rx="3" fill="#ef4444" fill-opacity="0.25" stroke="#ef4444" stroke-width="0.8"/>' +
      '<text x="448" y="174" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="700" text-anchor="middle">⛔ Disabled (0.0.0.0/0 Deny)</text>' +
      '<text x="368" y="194" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">Acceso público totalmente bloqueado desde internet</text>' +
      '<text x="368" y="206" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="8">Solo peticiones por el Private Endpoint o IPs públicas permitidas</text>' +
    '</svg>',
    caption: 'Para proteger el almacenamiento en Azure, las firmas de acceso compartido (**SAS**) conceden acceso granular temporal delimitado por permisos (lectura/escritura), IP origen e intervalo de tiempo. La **User Delegation SAS** es la más recomendada al autenticarse mediante credenciales de Microsoft Entra ID sin exponer claves maestras; la **Service SAS** y la **Account SAS** usan las claves de la cuenta. Una **Stored Access Policy** permite revocar o modificar los límites de una Service SAS sin rotar las claves del storage. Para aislamiento de red, un **Private Endpoint** asigna una IP privada de la VNet (`10.x.x.x`) al recurso de storage mediante Azure Private Link, bloqueando totalmente el acceso público por internet.',
    captionEn: 'Azure Storage security leverages Shared Access Signatures (**SAS**) for time-bounded, scoped access (Read/Write, client IP ranges, time window). A **User Delegation SAS** is best practice as it is secured with Microsoft Entra ID credentials without revealing master account keys; **Service SAS** and **Account SAS** sign tokens using account keys. A **Stored Access Policy** enables instant revocation or modification of Service SAS parameters without rotating account access keys. For network perimeter defense, a **Private Endpoint** assigns an internal VNet IP (`10.x.x.x`) to blob storage via Azure Private Link, completely eliminating public exposure.'
  };

  /* -------------------------------------------------------------------------
     Visual Aid 9: App Service Deployment Slots & AKS Container Networking
     ------------------------------------------------------------------------- */
  var visualAppServiceAks = {
    badge: 'App Service & AKS Networking',
    title: 'App Service Deployment Slots (Zero Downtime) y Redes de AKS (Kubenet vs Azure CNI)',
    titleEn: 'App Service Deployment Slots (Zero Downtime) & AKS Networking (Kubenet vs Azure CNI)',
    svg: '<svg viewBox="0 0 680 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
      SVG_DEFS +
      /* Left Box: App Service Deployment Slots */
      '<rect x="14" y="10" width="326" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#38bdf8" stroke-width="1.2"/>' +
      '<text x="26" y="26" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="700">APP SERVICE: DEPLOYMENT SLOTS (SWAP)</text>' +
      /* Production Slot */
      '<rect x="22" y="34" width="310" height="54" rx="5" fill="#0f172a" stroke="#34d399" stroke-width="1.2"/>' +
      '<text x="32" y="48" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="700">🚀 Production Slot (En Producción · Tráfico 100%)</text>' +
      '<text x="32" y="61" fill="#cbd5e1" font-family="monospace" font-size="8">myapp.azurewebsites.net</text>' +
      '<text x="32" y="74" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Atiende a los usuarios finales con la IP virtual estable</text>' +
      /* Swap Center Action */
      '<rect x="90" y="93" width="170" height="24" rx="4" fill="#0284c7" fill-opacity="0.3" stroke="#38bdf8" stroke-width="1"/>' +
      '<text x="175" y="109" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" text-anchor="middle">🔄 Auto-Swap (Zero Downtime)</text>' +
      /* Staging Slot */
      '<rect x="22" y="122" width="310" height="54" rx="5" fill="#0f172a" stroke="#fbbf24" stroke-width="1.2"/>' +
      '<text x="32" y="136" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="700">🧪 Staging Slot (Pruebas / Pre-calentamiento)</text>' +
      '<text x="32" y="149" fill="#cbd5e1" font-family="monospace" font-size="8">myapp-staging.azurewebsites.net</text>' +
      '<text x="32" y="162" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Valida nueva versión antes del intercambio sin cortar servicio</text>' +
      /* Sticky settings note */
      '<rect x="22" y="182" width="310" height="40" rx="4" fill="#0f172a" stroke="#475569" stroke-width="0.8"/>' +
      '<text x="30" y="196" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="700">Slot Settings (Sticky Settings):</text>' +
      '<text x="30" y="208" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Las variables marcadas como slot setting no viajan con el código al hacer swap</text>' +
      /* Right Box: AKS Kubenet vs Azure CNI */
      '<rect x="350" y="10" width="316" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#34d399" stroke-width="1.2"/>' +
      '<text x="362" y="26" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="700">REDES DE AKS: KUBENET VS AZURE CNI</text>' +
      /* Kubenet Card */
      '<rect x="358" y="34" width="300" height="88" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>' +
      '<rect x="366" y="40" width="85" height="16" rx="3" fill="#0284c7" fill-opacity="0.3"/>' +
      '<text x="370" y="52" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700">Kubenet (Básico)</text>' +
      '<text x="366" y="70" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="8">🌐 Red de superposición (Overlay) privada</text>' +
      '<text x="366" y="82" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Pods reciben IPs privadas separadas; los nodos hacen NAT saliente</text>' +
      '<text x="366" y="94" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" font-weight="600">Ahorra espacio de direcciones IP en la VNet de Azure</text>' +
      '<text x="366" y="106" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Los pods no son alcanzables directamente por IP desde fuera del clúster</text>' +
      /* Azure CNI Card */
      '<rect x="358" y="128" width="300" height="94" rx="6" fill="#0f172a" stroke="#34d399" stroke-width="1"/>' +
      '<rect x="366" y="134" width="100" height="16" rx="3" fill="#059669" fill-opacity="0.3"/>' +
      '<text x="370" y="146" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700">Azure CNI (Avanzado)</text>' +
      '<text x="366" y="164" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="8">⚡ Red plana integrada directamente en la VNet</text>' +
      '<text x="366" y="176" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Cada pod recibe una dirección IP real y enrutable de la subred</text>' +
      '<text x="366" y="188" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" font-weight="600">Comunicación directa Pod-a-Pod y Pod-a-VNet sin traducción NAT</text>' +
      '<text x="366" y="200" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Requiere planificar una subred amplia (ej. 30 pods = 30 IPs/nodo)</text>' +
    '</svg>',
    caption: 'Los **Deployment Slots** de App Service (disponibles desde el nivel **Standard S1**) permiten probar nuevas versiones en un entorno de pruebas (*Staging*) y realizar un intercambio (**Swap**) hacia producción sin tiempo de inactividad ni pérdida de peticiones (el tráfico se redirige instantáneamente mientras se conservan las configuraciones dependientes del slot o *sticky settings*). En orquestación de contenedores con **AKS**, la red **Kubenet** utiliza direccionamiento overlay privado para pods con NAT saliente conservando espacio IP de la VNet, mientras que **Azure CNI** asigna una IP real de la subred a cada pod, ofreciendo comunicación directa de red pero exigiendo una planificación estricta del direccionamiento IP.',
    captionEn: 'Azure App Service **Deployment Slots** (available in **Standard S1** and higher) allow pre-warming and validating builds in a staging slot before performing a zero-downtime **Swap** to production (IPs remain stable while sticky slot settings persist). In **AKS** container networking, **Kubenet** employs an overlay network with NAT egress to conserve subnet address space, whereas **Azure CNI** provisions dedicated VNet IPs directly to each pod, granting native end-to-end routing at the cost of higher subnet IP consumption.'
  };

  /* -------------------------------------------------------------------------
     Visual Aid 10: Private Endpoint vs Service Endpoint
     ------------------------------------------------------------------------- */
  var visualPrivateEndpoint = {
    badge: 'Virtual Networks & Private Link',
    title: 'Comparativa de Conectividad Privada: Private Endpoint vs Service Endpoint',
    titleEn: 'Private Connectivity Comparison: Private Endpoint vs Service Endpoint',
    svg: '<svg viewBox="0 0 680 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
      SVG_DEFS +
      /* Top Half: Service Endpoint */
      '<rect x="14" y="10" width="652" height="104" rx="7" fill="#1e293b" fill-opacity="0.5" stroke="#38bdf8" stroke-width="1.2"/>' +
      '<rect x="24" y="16" width="140" height="18" rx="3" fill="#0284c7" fill-opacity="0.3"/>' +
      '<text x="28" y="29" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="700">SERVICE ENDPOINT</text>' +
      '<rect x="24" y="40" width="130" height="64" rx="4" fill="#0f172a" stroke="#475569" stroke-width="0.8"/>' +
      '<text x="32" y="56" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700">Customer VNet Subnet</text>' +
      '<text x="32" y="70" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">IP privada de la VM: 10.1.1.4</text>' +
      '<text x="32" y="84" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Habilita Service Endpoint</text>' +
      '<line x1="160" y1="72" x2="330" y2="72" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-az-cyan)"/>' +
      '<text x="245" y="64" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="700" text-anchor="middle">Troncal Privada de Azure</text>' +
      '<rect x="338" y="40" width="316" height="64" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="0.8"/>' +
      '<text x="348" y="56" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700">PaaS Service (Destino: IP Pública del Servicio)</text>' +
      '<text x="348" y="70" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">Tráfico seguro sin salir a internet, pero el destino sigue siendo la IP pública PaaS</text>' +
      '<text x="348" y="84" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">❌ No accesible desde on-premises a través de VPN Gateway o ExpressRoute</text>' +
      '<text x="348" y="96" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Se aplica a toda la subred para el servicio de Azure especificado</text>' +
      /* Bottom Half: Private Endpoint */
      '<rect x="14" y="122" width="652" height="108" rx="7" fill="#1e293b" fill-opacity="0.5" stroke="#34d399" stroke-width="1.2"/>' +
      '<rect x="24" y="128" width="220" height="18" rx="3" fill="#059669" fill-opacity="0.3"/>' +
      '<text x="28" y="141" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="700">PRIVATE ENDPOINT (AZURE PRIVATE LINK)</text>' +
      '<rect x="24" y="152" width="210" height="68" rx="4" fill="#0f172a" stroke="#34d399" stroke-width="1"/>' +
      '<text x="32" y="168" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700">Customer VNet Subnet (10.1.1.0/24)</text>' +
      '<text x="32" y="182" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">Inyecta una vNIC privada: IP 10.1.1.5</text>' +
      '<text x="32" y="196" fill="#f8fafc" font-family="monospace" font-size="7.5">privatelink.blob.core.windows.net → 10.1.1.5</text>' +
      '<line x1="240" y1="184" x2="330" y2="184" stroke="#34d399" stroke-width="2" marker-end="url(#arr-az-green)"/>' +
      '<text x="285" y="176" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="700" text-anchor="middle">Private Link</text>' +
      '<rect x="338" y="152" width="316" height="68" rx="4" fill="#0f172a" stroke="#34d399" stroke-width="0.8"/>' +
      '<text x="348" y="168" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700">PaaS Service (Acceso Público Deshabilitado: 0.0.0.0/0 Deny)</text>' +
      '<text x="348" y="182" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">El servicio PaaS no expone ninguna IP pública a internet</text>' +
      '<text x="348" y="196" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" font-weight="700">✅ 100% Accesible desde on-premises vía VPN / ExpressRoute</text>' +
      '<text x="348" y="208" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Protege contra filtración de datos (data exfiltration) hacia otras cuentas</text>' +
    '</svg>',
    caption: 'Un **Service Endpoint** extiende la identidad de la subred al servicio PaaS de Azure a través de la red troncal de Microsoft, pero el destino sigue siendo la IP pública del servicio y no admite acceso desde on-premises. Por el contrario, un **Private Endpoint** (basado en **Azure Private Link**) crea una interfaz de red virtual (NIC) con una IP privada interna (`10.x.x.x`) dentro de la subred del cliente: permite deshabilitar por completo el acceso público a internet en el servicio PaaS, resolver nombres mediante **Azure Private DNS Zones** (`privatelink.blob.core.windows.net`) y comunicarse de forma segura a través de **VPN Gateway** o **ExpressRoute** desde la red local.',
    captionEn: 'A **Service Endpoint** extends subnet identity to Azure PaaS services across the Microsoft backbone, but the service retains its public IP and is inaccessible from on-premises over VPN/ExpressRoute. In contrast, a **Private Endpoint** (powered by **Azure Private Link**) provisions a private virtual network interface (NIC) with a local IP (`10.x.x.x`) inside your subnet: it allows completely turning off public internet access on the PaaS resource, integrates with **Azure Private DNS Zones** (`privatelink.*`), and enables seamless on-premises hybrid routing.'
  };

  /* -------------------------------------------------------------------------
     Visual Aid 11: Azure VM Managed Disks & Performance Tiers
     ------------------------------------------------------------------------- */
  var visualDisks = {
    badge: 'VM Storage & Performance',
    title: 'Tipos de Managed Disks, Opciones de Caché de Host y Rendimiento de E/S',
    titleEn: 'Azure Managed Disk Types, Host Caching Options & I/O Performance',
    svg: '<svg viewBox="0 0 680 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
      SVG_DEFS +
      /* 4 Disk Tiers Grid */
      '<rect x="14" y="10" width="435" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#334155" stroke-width="1.2"/>' +
      '<text x="24" y="26" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="700">CATEGORÍAS DE MANAGED DISKS (ALMACENAMIENTO DE VM)</text>' +
      /* Standard HDD */
      '<rect x="22" y="34" width="98" height="186" rx="5" fill="#0f172a" stroke="#64748b" stroke-width="1"/>' +
      '<text x="71" y="49" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">Standard HDD</text>' +
      '<text x="71" y="63" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Magnético</text>' +
      '<rect x="28" y="72" width="86" height="42" rx="3" fill="#1e293b"/>' +
      '<text x="71" y="86" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Hasta 2,000 IOPS</text>' +
      '<text x="71" y="99" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">500 MB/s</text>' +
      '<text x="71" y="132" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Casos de uso:</text>' +
      '<text x="71" y="146" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Respaldos</text>' +
      '<text x="71" y="158" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Servidores de</text>' +
      '<text x="71" y="170" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">prueba o archivo</text>' +
      '<text x="71" y="206" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Menor costo</text>' +
      /* Standard SSD */
      '<rect x="126" y="34" width="98" height="186" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>' +
      '<text x="175" y="49" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">Standard SSD</text>' +
      '<text x="175" y="63" fill="#0284c7" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Estado Sólido</text>' +
      '<rect x="132" y="72" width="86" height="42" rx="3" fill="#1e293b"/>' +
      '<text x="175" y="86" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Hasta 6,000 IOPS</text>' +
      '<text x="175" y="99" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">750 MB/s</text>' +
      '<text x="175" y="132" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Casos de uso:</text>' +
      '<text x="175" y="146" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Web servers</text>' +
      '<text x="175" y="158" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Cargas ligeras</text>' +
      '<text x="175" y="170" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Dev / Test</text>' +
      '<text x="175" y="206" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Costo / Rendimiento</text>' +
      /* Premium SSD */
      '<rect x="230" y="34" width="104" height="186" rx="5" fill="#0f172a" stroke="#fbbf24" stroke-width="1.2"/>' +
      '<text x="282" y="49" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">Premium SSD v1/v2</text>' +
      '<text x="282" y="63" fill="#d97706" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Alto Rendimiento</text>' +
      '<rect x="236" y="72" width="92" height="42" rx="3" fill="#1e293b"/>' +
      '<text x="282" y="86" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Hasta 80,000 IOPS</text>' +
      '<text x="282" y="99" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">1,200 MB/s</text>' +
      '<text x="282" y="132" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Casos de uso:</text>' +
      '<text x="282" y="146" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Bases de datos SQL</text>' +
      '<text x="282" y="158" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Producción crítica</text>' +
      '<text x="282" y="170" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">SLA VM 99.9%+</text>' +
      '<text x="282" y="206" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Bursting dinámico</text>' +
      /* Ultra Disk */
      '<rect x="340" y="34" width="102" height="186" rx="5" fill="#0f172a" stroke="#f87171" stroke-width="1.2"/>' +
      '<text x="391" y="49" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">Ultra Disk</text>' +
      '<text x="391" y="63" fill="#ef4444" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Sub-milisegundo</text>' +
      '<rect x="346" y="72" width="90" height="42" rx="3" fill="#1e293b"/>' +
      '<text x="391" y="86" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">400,000 IOPS</text>' +
      '<text x="391" y="99" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">10,000 MB/s</text>' +
      '<text x="391" y="132" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Casos de uso:</text>' +
      '<text x="391" y="146" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">SAP HANA, Oracle</text>' +
      '<text x="391" y="158" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Ajuste de IOPS sin</text>' +
      '<text x="391" y="170" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">reiniciar la VM</text>' +
      '<text x="391" y="206" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Máxima potencia</text>' +
      /* Right Box: Host Caching Strategy */
      '<rect x="458" y="10" width="208" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#818cf8" stroke-width="1.2"/>' +
      '<text x="468" y="26" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="700">HOST CACHING (MEMORIA)</text>' +
      /* ReadOnly */
      '<rect x="466" y="34" width="192" height="56" rx="5" fill="#0f172a" stroke="#34d399" stroke-width="1"/>' +
      '<text x="474" y="48" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">ReadOnly Caching</text>' +
      '<text x="474" y="61" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Acelera lecturas desde SSD/RAM del host</text>' +
      '<text x="474" y="74" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" font-weight="600">Ideal para archivos de datos SQL (.mdf)</text>' +
      /* ReadWrite */
      '<rect x="466" y="96" width="192" height="56" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>' +
      '<text x="474" y="110" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">ReadWrite Caching</text>' +
      '<text x="474" y="123" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Por defecto en el disco de SO de la VM</text>' +
      '<text x="474" y="136" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Lecturas y escrituras cacheadas</text>' +
      /* None */
      '<rect x="466" y="158" width="192" height="62" rx="5" fill="#0f172a" stroke="#f87171" stroke-width="1"/>' +
      '<text x="474" y="172" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">None (Sin Caché)</text>' +
      '<text x="474" y="185" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Escribe directo al disco sin buffer intermedio</text>' +
      '<text x="474" y="198" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" font-weight="700">Obligatorio para SQL Log (.ldf)</text>' +
      '<text x="474" y="210" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7">Evita corrupción o pérdida de transacciones</text>' +
    '</svg>',
    caption: 'Azure ofrece cuatro categorías de discos administrados según demanda de rendimiento: **Ultra Disk** (latencia submilisegundo, IOPS y rendimiento configurables dinámicamente sin reiniciar), **Premium SSD v2/v1** (cargas de producción de alto rendimiento y bases de datos transaccionales), **Standard SSD** (cargas web y pruebas de desarrollo) y **Standard HDD** (respaldos e instancias de bajo acceso). El almacenamiento en caché del host (**Host Caching**) optimiza el rendimiento: **ReadOnly** acelera lecturas frecuentes (recomendado para ficheros de datos SQL), **ReadWrite** es el valor por defecto para discos del sistema operativo, y **None** debe seleccionarse para discos de registro transaccional (**SQL Log** / `ldf`).',
    captionEn: 'Azure Managed Disks span four performance tiers: **Ultra Disk** (sub-millisecond latency, dynamically tunable IOPS and throughput without VM reboot), **Premium SSD v2/v1** (high-performance production workloads and relational databases), **Standard SSD** (web servers and dev/test), and **Standard HDD** (cold tier backups). **Host Caching** further tunes I/O latency: **ReadOnly** caches frequent reads (ideal for SQL data files), **ReadWrite** is standard for OS drives, and **None** is critical for write-sensitive database transaction log files.'
  };

  /* -------------------------------------------------------------------------
     Visual Aid 12: Azure Bastion & Network Watcher Diagnostics
     ------------------------------------------------------------------------- */
  var visualBastionDiagnostics = {
    badge: 'Security & Network Diagnostics',
    title: 'Acceso Seguro con Azure Bastion y Herramientas de Diagnóstico de Network Watcher',
    titleEn: 'Azure Bastion Secure Access Architecture & Network Watcher Diagnostics',
    svg: '<svg viewBox="0 0 680 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
      SVG_DEFS +
      /* Left Box: Azure Bastion */
      '<rect x="14" y="10" width="316" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#38bdf8" stroke-width="1.2"/>' +
      '<rect x="24" y="16" width="140" height="18" rx="3" fill="#0284c7" fill-opacity="0.3"/>' +
      '<text x="28" y="29" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="700">AZURE BASTION (RDP / SSH)</text>' +
      /* Browser User */
      '<rect x="24" y="40" width="85" height="46" rx="4" fill="#0f172a" stroke="#475569" stroke-width="0.8"/>' +
      '<text x="66" y="56" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" text-anchor="middle">💻 Navegador</text>' +
      '<text x="66" y="70" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">HTTPS 443 TLS</text>' +
      '<line x1="112" y1="63" x2="138" y2="63" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arr-az-cyan)"/>' +
      /* Bastion Subnet */
      '<rect x="142" y="40" width="176" height="52" rx="4" fill="#0284c7" fill-opacity="0.2" stroke="#38bdf8" stroke-width="1"/>' +
      '<text x="230" y="55" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">AzureBastionSubnet</text>' +
      '<text x="230" y="68" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Nombre reservado obligatorio</text>' +
      '<text x="230" y="80" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Prefijo mínimo: /26 (/27 no válido)</text>' +
      '<line x1="230" y1="94" x2="230" y2="114" stroke="#34d399" stroke-width="1.5" marker-end="url(#arr-az-green)"/>' +
      /* Target VM */
      '<rect x="24" y="118" width="294" height="48" rx="4" fill="#0f172a" stroke="#34d399" stroke-width="1.2"/>' +
      '<text x="34" y="134" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">VM Destino en Subred de Cómputo</text>' +
      '<text x="34" y="147" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="8">✅ Sin IP pública · Puertos 22/3389 cerrados hacia internet</text>' +
      '<text x="34" y="158" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Solo permite tráfico privado originado en AzureBastionSubnet</text>' +
      /* Bastion summary */
      '<rect x="24" y="172" width="294" height="48" rx="4" fill="#0f172a" stroke="#475569" stroke-width="0.8"/>' +
      '<text x="34" y="186" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="700">Solución de problemas si la VM no responde:</text>' +
      '<text x="34" y="198" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">1. Serial Console (acceso a consola de rescate sin red)</text>' +
      '<text x="34" y="210" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">2. Boot Diagnostics (captura de pantalla y registros de kernel)</text>' +
      /* Right Box: Network Watcher Diagnostic Toolkit */
      '<rect x="340" y="10" width="326" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#34d399" stroke-width="1.2"/>' +
      '<text x="350" y="26" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="700">HERRAMIENTAS DE NETWORK WATCHER</text>' +
      /* Tool 1: IP Flow Verify */
      '<rect x="348" y="34" width="308" height="34" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>' +
      '<text x="356" y="47" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700">1. IP Flow Verify (Reglas NSG)</text>' +
      '<text x="356" y="60" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Comprueba si un paquete (5 tuplas) es permitido o bloqueado por un NSG</text>' +
      /* Tool 2: Next Hop */
      '<rect x="348" y="72" width="308" height="34" rx="4" fill="#0f172a" stroke="#818cf8" stroke-width="1"/>' +
      '<text x="356" y="85" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700">2. Next Hop (Rutas UDR)</text>' +
      '<text x="356" y="98" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Determina si el siguiente salto es VirtualAppliance, VNetPeering o Internet</text>' +
      /* Tool 3: Connection Monitor */
      '<rect x="348" y="110" width="308" height="34" rx="4" fill="#0f172a" stroke="#fbbf24" stroke-width="1"/>' +
      '<text x="356" y="123" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700">3. Connection Monitor (Salud Extremo a Extremo)</text>' +
      '<text x="356" y="136" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Monitorea continuamente la latencia de red, pérdida de paquetes y saltos</text>' +
      /* Tool 4: Packet Capture */
      '<rect x="348" y="148" width="308" height="34" rx="4" fill="#0f172a" stroke="#34d399" stroke-width="1"/>' +
      '<text x="356" y="161" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700">4. Packet Capture (Captura de Tráfico Real)</text>' +
      '<text x="356" y="174" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Genera archivos .cap directamente en la NIC de la VM para Wireshark</text>' +
      /* Tool 5: NSG Flow Logs */
      '<rect x="348" y="186" width="308" height="36" rx="4" fill="#0f172a" stroke="#a78bfa" stroke-width="1"/>' +
      '<text x="356" y="199" fill="#c084fc" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700">5. NSG Flow Logs &amp; Traffic Analytics</text>' +
      '<text x="356" y="213" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Registra flujos IP aceptados/denegados hacia Storage y Log Analytics</text>' +
    '</svg>',
    caption: '**Azure Bastion** proporciona conectividad RDP y SSH segura sobre HTTPS (puerto 443) directamente a través del portal de Azure, sin necesidad de asignar IPs públicas a las máquinas virtuales ni abrir puertos 3389 o 22 a internet; requiere una subred dedicada denominada obligatoriamente `AzureBastionSubnet` (mínimo prefijo `/26`). Para la solución de incidencias de red, **Network Watcher** incluye herramientas especializadas: **IP Flow Verify** comprueba si una regla NSG permite o bloquea un paquete concreto, **Next Hop** valida tablas de rutas (UDR), **Connection Monitor** supervisa la latencia y pérdida de paquetes de extremo a extremo, y **Packet Capture** registra tráfico a nivel de trama.',
    captionEn: '**Azure Bastion** provides frictionless browser-based RDP and SSH sessions over TLS (port 443) within the Azure portal, removing the need for VM public IPs or open inbound management ports (3389/22); it requires a dedicated subnet explicitly named `AzureBastionSubnet` with at least a `/26` CIDR. For network troubleshooting, **Network Watcher** supplies critical diagnostics: **IP Flow Verify** tests whether an NSG rule permits or drops a flow, **Next Hop** verifies route resolution, **Connection Monitor** tracks continuous hop-by-hop latency and loss, and **Packet Capture** captures raw network traces directly from VM interfaces.'
  };

  /* -------------------------------------------------------------------------
     Registry Population
     ------------------------------------------------------------------------- */
  window.EXAM_VISUALS['az-104'] = {
    questions: {},
    topics: {
      'az-t-1': visualGovernance,
      'az-t-2': visualStorage,
      'az-t-3': visualCompute,
      'az-t-4': visualNetworking,
      'az-t-5': visualMonitoring
    },
    patterns: [
      /* Specific Architecture & Feature Patterns */
      {
        match: /load balancer|application gateway|traffic manager|front door|backend pool|health probe|nat rule/i,
        badge: visualLoadBalancing.badge,
        title: visualLoadBalancing.title,
        titleEn: visualLoadBalancing.titleEn,
        svg: visualLoadBalancing.svg,
        caption: visualLoadBalancing.caption,
        captionEn: visualLoadBalancing.captionEn
      },
      {
        match: /sas|shared access signature|access key|encryption|cmk|key vault|stored access policy/i,
        badge: visualStorageSecurity.badge,
        title: visualStorageSecurity.title,
        titleEn: visualStorageSecurity.titleEn,
        svg: visualStorageSecurity.svg,
        caption: visualStorageSecurity.caption,
        captionEn: visualStorageSecurity.captionEn
      },
      {
        match: /private endpoint|service endpoint|private link|private dns|privatelink/i,
        badge: visualPrivateEndpoint.badge,
        title: visualPrivateEndpoint.title,
        titleEn: visualPrivateEndpoint.titleEn,
        svg: visualPrivateEndpoint.svg,
        caption: visualPrivateEndpoint.caption,
        captionEn: visualPrivateEndpoint.captionEn
      },
      {
        match: /deployment slot|swap|app service plan|kubenet|azure cni/i,
        badge: visualAppServiceAks.badge,
        title: visualAppServiceAks.title,
        titleEn: visualAppServiceAks.titleEn,
        svg: visualAppServiceAks.svg,
        caption: visualAppServiceAks.caption,
        captionEn: visualAppServiceAks.captionEn
      },
      {
        match: /disk|ultra disk|premium ssd|standard ssd|standard hdd|iops|throughput|bursting|host caching/i,
        badge: visualDisks.badge,
        title: visualDisks.title,
        titleEn: visualDisks.titleEn,
        svg: visualDisks.svg,
        caption: visualDisks.caption,
        captionEn: visualDisks.captionEn
      },
      {
        match: /bastion|network watcher|ip flow verify|packet capture|connection monitor|serial console|boot diagnostics|nsg flow logs/i,
        badge: visualBastionDiagnostics.badge,
        title: visualBastionDiagnostics.title,
        titleEn: visualBastionDiagnostics.titleEn,
        svg: visualBastionDiagnostics.svg,
        caption: visualBastionDiagnostics.caption,
        captionEn: visualBastionDiagnostics.captionEn
      },

      /* Core Domain Architecture Patterns */
      {
        match: /management group|subscription|resource group|rbac|policy|deployifnotexists|modify|append|audit|deny|lock|canotdelete|cannotdelete|readonly/i,
        badge: visualGovernance.badge,
        title: visualGovernance.title,
        titleEn: visualGovernance.titleEn,
        svg: visualGovernance.svg,
        caption: visualGovernance.caption,
        captionEn: visualGovernance.captionEn
      },
      {
        match: /entra|azure ad|active directory|tenant|b2b|guest|sspr|conditional access|mfa|managed identity|dynamic group|administrative unit|pim/i,
        badge: visualEntra.badge,
        title: visualEntra.title,
        titleEn: visualEntra.titleEn,
        svg: visualEntra.svg,
        caption: visualEntra.caption,
        captionEn: visualEntra.captionEn
      },
      {
        match: /lrs|zrs|grs|gzrs|ra-grs|ra-gzrs|redundan|hot|cool|cold|archive|rehydrat|blob|azcopy|azure files|immutable|file sync/i,
        badge: visualStorage.badge,
        title: visualStorage.title,
        titleEn: visualStorage.titleEn,
        svg: visualStorage.svg,
        caption: visualStorage.caption,
        captionEn: visualStorage.captionEn
      },
      {
        match: /vnet|subnet|peering|nsg|asg|firewall|waf|udr|route table|forced tunneling|dns|expressroute|vpn/i,
        badge: visualNetworking.badge,
        title: visualNetworking.title,
        titleEn: visualNetworking.titleEn,
        svg: visualNetworking.svg,
        caption: visualNetworking.caption,
        captionEn: visualNetworking.captionEn
      },
      {
        match: /virtual machine|\bvm\b|availability set|fault domain|update domain|availability zone|vmss|scale set|aks|kubernetes|aci|container|app service|arm template|bicep/i,
        badge: visualCompute.badge,
        title: visualCompute.title,
        titleEn: visualCompute.titleEn,
        svg: visualCompute.svg,
        caption: visualCompute.caption,
        captionEn: visualCompute.captionEn
      },
      {
        match: /monitor|log analytics|kql|kusto|activity log|diagnostic|action group|alert|backup|recovery services vault|site recovery|asr|rto|rpo|mars|workbooks/i,
        badge: visualMonitoring.badge,
        title: visualMonitoring.title,
        titleEn: visualMonitoring.titleEn,
        svg: visualMonitoring.svg,
        caption: visualMonitoring.caption,
        captionEn: visualMonitoring.captionEn
      },

      /* Catch-All Domain Fallbacks (Guarantees 100% Coverage) */
      {
        match: /identities|governance|identity|role|user|group|tenant/i,
        badge: visualGovernance.badge,
        title: visualGovernance.title,
        titleEn: visualGovernance.titleEn,
        svg: visualGovernance.svg,
        caption: visualGovernance.caption,
        captionEn: visualGovernance.captionEn
      },
      {
        match: /storage|account|blob|file|share|tier/i,
        badge: visualStorage.badge,
        title: visualStorage.title,
        titleEn: visualStorage.titleEn,
        svg: visualStorage.svg,
        caption: visualStorage.caption,
        captionEn: visualStorage.captionEn
      },
      {
        match: /compute|vm|scale|instance|template/i,
        badge: visualCompute.badge,
        title: visualCompute.title,
        titleEn: visualCompute.titleEn,
        svg: visualCompute.svg,
        caption: visualCompute.caption,
        captionEn: visualCompute.captionEn
      },
      {
        match: /network|peering|traffic|routing|gateway|ip/i,
        badge: visualNetworking.badge,
        title: visualNetworking.title,
        titleEn: visualNetworking.titleEn,
        svg: visualNetworking.svg,
        caption: visualNetworking.caption,
        captionEn: visualNetworking.captionEn
      },
      {
        match: /monitor|backup|recovery|alert|log/i,
        badge: visualMonitoring.badge,
        title: visualMonitoring.title,
        titleEn: visualMonitoring.titleEn,
        svg: visualMonitoring.svg,
        caption: visualMonitoring.caption,
        captionEn: visualMonitoring.captionEn
      }
    ]
  };
})(window);
