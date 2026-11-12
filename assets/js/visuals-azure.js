/* Visual Aids Pack — Microsoft Azure Administrator AZ-104 */
(function (window) {
  'use strict';

  window.EXAM_VISUALS = window.EXAM_VISUALS || {};

  window.EXAM_VISUALS['az-104'] = {
    questions: {},
    topics: {},
    patterns: [
      /* =========================================================================
         1. Azure Governance Hierarchy, RBAC Scope Inheritance, Policy & Locks
         ========================================================================= */
      {
        match: /management group|subscription|resource group|rbac|policy|deployifnotexists|modify|append|audit|deny|lock|canotdelete|cannotdelete|readonly/i,
        badge: 'Governance & RBAC',
        title: 'Jerarquía de Gobernanza, Ámbitos RBAC, Directivas de Azure y Bloqueos',
        titleEn: 'Azure Governance Hierarchy, RBAC Scopes, Azure Policies & Resource Locks',
        svg: '<svg viewBox="0 0 680 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
          '<defs>' +
            '<linearGradient id="az1-grad-root" x1="0%" y1="0%" x2="100%" y2="100%">' +
              '<stop offset="0%" stop-color="#0284c7" stop-opacity="0.35"/>' +
              '<stop offset="100%" stop-color="#0f172a" stop-opacity="0.85"/>' +
            '</linearGradient>' +
            '<marker id="arr-az-1" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
              '<path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>' +
            '</marker>' +
            '<marker id="arr-az-1-sub" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
              '<path d="M 0 1 L 10 5 L 0 9 z" fill="#818cf8"/>' +
            '</marker>' +
          '</defs>' +
          /* Left: Hierarchy Tree Container */
          '<rect x="14" y="10" width="370" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#334155" stroke-width="1.2"/>' +
          '<text x="28" y="28" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" letter-spacing="0.08em">JERARQUÍA DE ÁMBITOS AZURE (HERENCIA ADITIVA)</text>' +
          /* Vertical Inheritance Guide */
          '<line x1="38" y1="52" x2="38" y2="208" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3 3"/>' +
          '<circle cx="38" cy="52" r="3" fill="#38bdf8"/>' +
          '<circle cx="38" cy="106" r="3" fill="#818cf8"/>' +
          '<circle cx="38" cy="158" r="3" fill="#34d399"/>' +
          '<circle cx="38" cy="208" r="3" fill="#a78bfa"/>' +
          /* Level 1: Root Management Group */
          '<rect x="52" y="38" width="318" height="34" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>' +
          '<rect x="58" y="44" width="22" height="22" rx="4" fill="#0284c7" fill-opacity="0.3"/>' +
          '<text x="69" y="59" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">👑</text>' +
          '<text x="88" y="52" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">Root Management Group</text>' +
          '<text x="88" y="65" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="9.5">Ámbito raíz: gobierna todas las suscripciones del tenant</text>' +
          /* Level 2: Subscriptions */
          '<rect x="68" y="90" width="302" height="34" rx="6" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>' +
          '<rect x="74" y="96" width="22" height="22" rx="4" fill="#6366f1" fill-opacity="0.3"/>' +
          '<text x="85" y="111" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">💳</text>' +
          '<text x="104" y="104" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">Subscriptions (Prod / Dev / QA)</text>' +
          '<text x="104" y="117" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="9.5">Límite de facturación, cuotas de cómputo y confianza Entra</text>' +
          /* Level 3: Resource Groups */
          '<rect x="84" y="142" width="286" height="34" rx="6" fill="#0f172a" stroke="#34d399" stroke-width="1.2"/>' +
          '<rect x="90" y="148" width="22" height="22" rx="4" fill="#10b981" fill-opacity="0.3"/>' +
          '<text x="101" y="163" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">📁</text>' +
          '<text x="120" y="156" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">Resource Groups (rg-app-prod, rg-net)</text>' +
          '<text x="120" y="169" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="9.5">Contenedor de ciclo de vida e implementación conjunta</text>' +
          /* Level 4: Resources */
          '<rect x="100" y="194" width="270" height="30" rx="6" fill="#0f172a" stroke="#a78bfa" stroke-width="1.2"/>' +
          '<text x="112" y="213" fill="#a78bfa" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="bold">⚙️ VMs · VNets · Disks · Storage</text>' +
          '<text x="280" y="213" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="9">Sin subrecursos</text>' +
          /* Right Top: Azure Policy Box */
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
          /* Right Bottom: Resource Locks Box */
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
      },

      /* =========================================================================
         2. Microsoft Entra ID (Azure AD): Conditional Access & Managed Identities
         ========================================================================= */
      {
        match: /entra|azure ad|active directory|tenant|b2b|guest|sspr|conditional access|mfa|managed identity|dynamic group|administrative unit|pim/i,
        badge: 'Entra ID & Security',
        title: 'Arquitectura Entra ID: Pipeline de Conditional Access e Identidades Administradas',
        titleEn: 'Microsoft Entra ID: Conditional Access Pipeline & Managed Identity Architectures',
        svg: '<svg viewBox="0 0 680 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
          '<defs>' +
            '<marker id="arr-az-2" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
              '<path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>' +
            '</marker>' +
          '</defs>' +
          /* Left 3-step Pipeline: Conditional Access */
          '<rect x="14" y="10" width="410" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#334155" stroke-width="1.2"/>' +
          '<text x="26" y="28" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">CONDITIONAL ACCESS: SEÑAL → DECISIÓN → APLICACIÓN</text>' +
          /* Step 1: Signals */
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
          /* Arrow 1 to 2 */
          '<line x1="140" y1="126" x2="162" y2="126" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-az-2)"/>' +
          /* Step 2: Policy Decision */
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
          /* Arrow 2 to 3 */
          '<line x1="278" y1="126" x2="300" y2="126" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-az-2)"/>' +
          /* Step 3: Enforcement */
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
          /* Right Side: Managed Identities Comparison */
          '<rect x="436" y="10" width="230" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#818cf8" stroke-width="1.2"/>' +
          '<text x="448" y="28" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">MANAGED IDENTITIES</text>' +
          /* Card System-Assigned */
          '<rect x="446" y="38" width="210" height="74" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>' +
          '<rect x="454" y="44" width="115" height="16" rx="3" fill="#0284c7" fill-opacity="0.3"/>' +
          '<text x="458" y="56" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">System-Assigned</text>' +
          '<text x="454" y="73" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="9">🔗 Relación 1 a 1 con el recurso</text>' +
          '<text x="454" y="87" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Vida atada a la VM o App Service</text>' +
          '<text x="454" y="101" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Si se borra la VM → identidad se elimina</text>' +
          /* Card User-Assigned */
          '<rect x="446" y="120" width="210" height="74" rx="6" fill="#0f172a" stroke="#a78bfa" stroke-width="1.2"/>' +
          '<rect x="454" y="126" width="105" height="16" rx="3" fill="#7c3aed" fill-opacity="0.3"/>' +
          '<text x="458" y="138" fill="#c084fc" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">User-Assigned</text>' +
          '<text x="454" y="155" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="9">👥 Relación 1 a N (Compartible)</text>' +
          '<text x="454" y="169" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Recurso independiente en ARM</text>' +
          '<text x="454" y="183" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Sobrevive a la eliminación de las VMs</text>' +
          /* Bottom Token Endpoint */
          '<rect x="446" y="200" width="210" height="22" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>' +
          '<text x="452" y="214" fill="#94a3b8" font-family="monospace" font-size="8">169.254.169.254/oauth2/token</text>' +
        '</svg>',
        caption: '**Conditional Access** actúa como plano de control Zero Trust en Entra ID: evalúa señales en tiempo real (identidad, estado de cumplimiento de Intune, ubicación IP y nivel de riesgo calculado por Entra ID Protection en licencias P2) para decidir si permitir el acceso, forzar **MFA**, exigir restablecimiento de contraseña vía **SSPR** o bloquear el intento. Por otro lado, las **Managed Identities** proporcionan identidad en Entra ID sin credenciales en código: **System-Assigned** vincula su ciclo de vida estrictamente al recurso (1:1), mientras que **User-Assigned** es un recurso ARM independiente compartible entre múltiples servicios (1:N).',
        captionEn: '**Conditional Access** functions as Entra ID’s Zero Trust policy engine: it analyzes real-time signals (user/group, Intune device compliance, named IP locations, and P2 identity protection risk) to decide whether to grant access, mandate **MFA**, prompt **SSPR** password reset, or block traffic outright. Concurrently, **Managed Identities** remove static credentials: **System-Assigned** shares a strict 1:1 lifecycle with the host resource, whereas **User-Assigned** operates as an independent ARM resource reusable across multiple workloads (1:N).'
      },

      /* =========================================================================
         3. Azure Storage Redundancy (LRS/ZRS/GRS/GZRS) & Access Tiers
         ========================================================================= */
      {
        match: /lrs|zrs|grs|gzrs|ra-grs|ra-gzrs|redundan|hot|cool|cold|archive|rehydrat|blob|azcopy|sas|stored access policy|azure files|immutable/i,
        badge: 'Storage & Lifecycle',
        title: 'Modelos de Redundancia de Storage y Transición de Niveles de Acceso',
        titleEn: 'Azure Storage Redundancy Options & Access Tier Lifecycle Policies',
        svg: '<svg viewBox="0 0 680 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
          '<defs>' +
            '<marker id="arr-az-3" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
              '<path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>' +
            '</marker>' +
            '<marker id="arr-az-3-tier" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
              '<path d="M 0 1 L 10 5 L 0 9 z" fill="#818cf8"/>' +
            '</marker>' +
          '</defs>' +
          /* Top Half: Redundancy (Primary vs Secondary Paired Region) */
          /* Primary Region */
          '<rect x="14" y="10" width="310" height="108" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#38bdf8" stroke-width="1.2"/>' +
          '<text x="26" y="26" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">REGIÓN PRIMARIA (COPIAS SÍNCRONAS)</text>' +
          /* LRS Box */
          '<rect x="24" y="34" width="140" height="74" rx="5" fill="#0f172a" stroke="#475569" stroke-width="1"/>' +
          '<text x="32" y="49" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700">LRS (Locally Redundant)</text>' +
          '<text x="32" y="63" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">3 copias en 1 Datacenter</text>' +
          '<text x="32" y="77" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Protege contra fallas de rack/disco</text>' +
          '<text x="32" y="93" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600">Durabilidad: 11 nueves</text>' +
          '<text x="32" y="103" fill="#ef4444" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Vulnerable a caída del DC</text>' +
          /* ZRS Box */
          '<rect x="174" y="34" width="140" height="74" rx="5" fill="#0f172a" stroke="#34d399" stroke-width="1"/>' +
          '<text x="182" y="49" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700">ZRS (Zone-Redundant)</text>' +
          '<text x="182" y="63" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">3 copias en 3 AZs separadas</text>' +
          '<text x="182" y="77" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Tolerancia a caída de 1 DC entero</text>' +
          '<text x="182" y="93" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600">Durabilidad: 12 nueves</text>' +
          '<text x="182" y="103" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Replicación síncrona intra-región</text>' +
          /* Replication Link */
          '<line x1="324" y1="64" x2="352" y2="64" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arr-az-3)"/>' +
          '<text x="338" y="55" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="700" text-anchor="middle">ASINC</text>' +
          /* Secondary Region */
          '<rect x="356" y="10" width="310" height="108" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#818cf8" stroke-width="1.2"/>' +
          '<text x="368" y="26" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">REGIÓN SECUNDARIA (PAR GEOGRÁFICO)</text>' +
          /* GRS Box */
          '<rect x="366" y="34" width="140" height="74" rx="5" fill="#0f172a" stroke="#818cf8" stroke-width="1"/>' +
          '<text x="374" y="49" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700">GRS / GZRS</text>' +
          '<text x="374" y="63" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">GRS: LRS primario + LRS sec</text>' +
          '<text x="374" y="77" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">GZRS: ZRS primario + LRS sec</text>' +
          '<text x="374" y="93" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600">Durabilidad: 16 nueves</text>' +
          '<text x="374" y="103" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Protege contra desastre regional</text>' +
          /* RA-GRS Box */
          '<rect x="516" y="34" width="140" height="74" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>' +
          '<text x="524" y="49" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700">RA-GRS / RA-GZRS</text>' +
          '<text x="524" y="63" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="600">Lectura activa en sec</text>' +
          '<text x="524" y="77" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">Endpoint de solo lectura:</text>' +
          '<text x="524" y="89" fill="#94a3b8" font-family="monospace" font-size="7">*-secondary.blob...</text>' +
          '<text x="524" y="103" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Permite lecturas sin esperar failover</text>' +
          /* Bottom Half: Access Tiers Lifecycle Management */
          '<rect x="14" y="126" width="652" height="104" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#334155" stroke-width="1.2"/>' +
          '<text x="26" y="142" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" letter-spacing="0.08em">LIFECYCLE MANAGEMENT: POLÍTICAS DE TRANSICIÓN AUTOMÁTICA DE TIERS</text>' +
          /* Tier 1: Hot */
          '<rect x="24" y="150" width="140" height="70" rx="6" fill="#0f172a" stroke="#ef4444" stroke-width="1.2"/>' +
          '<text x="34" y="166" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">🔥 Hot Tier</text>' +
          '<text x="34" y="180" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Datos en uso frecuente</text>' +
          '<text x="34" y="193" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Menor costo por transacción</text>' +
          '<text x="34" y="206" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="8">Mayor costo de reposo (GB/mes)</text>' +
          /* Arrow Hot to Cool */
          '<line x1="166" y1="185" x2="182" y2="185" stroke="#818cf8" stroke-width="1.8" marker-end="url(#arr-az-3-tier)"/>' +
          /* Tier 2: Cool */
          '<rect x="186" y="150" width="140" height="70" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>' +
          '<text x="196" y="166" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">❄️ Cool Tier</text>' +
          '<text x="196" y="180" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Poco acceso · Retención mín: 30d</text>' +
          '<text x="196" y="193" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Backups y datos de corto plazo</text>' +
          '<text x="196" y="206" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Penalidad si se borra antes de 30d</text>' +
          /* Arrow Cool to Cold */
          '<line x1="328" y1="185" x2="344" y2="185" stroke="#818cf8" stroke-width="1.8" marker-end="url(#arr-az-3-tier)"/>' +
          /* Tier 3: Cold */
          '<rect x="348" y="150" width="140" height="70" rx="6" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>' +
          '<text x="358" y="166" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">🧊 Cold Tier</text>' +
          '<text x="358" y="180" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Muy poco acceso · Mín: 90d</text>' +
          '<text x="358" y="193" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Costo intermedio entre Cool y Arch</text>' +
          '<text x="358" y="206" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Acceso en línea sin rehidratación</text>' +
          /* Arrow Cold to Archive */
          '<line x1="490" y1="185" x2="506" y2="185" stroke="#818cf8" stroke-width="1.8" marker-end="url(#arr-az-3-tier)"/>' +
          /* Tier 4: Archive */
          '<rect x="510" y="150" width="146" height="70" rx="6" fill="#0f172a" stroke="#a78bfa" stroke-width="1.2"/>' +
          '<text x="520" y="166" fill="#c084fc" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">📦 Archive Tier</text>' +
          '<text x="520" y="180" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">Offline · Retención mín: 180d</text>' +
          '<text x="520" y="193" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8">Costo de reposo ultra bajo</text>' +
          '<text x="520" y="206" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="8">Rehidratar: Std (horas) / High (mins)</text>' +
        '</svg>',
        caption: 'Azure Storage ofrece múltiples opciones de redundancia según la tolerancia al desastre: **LRS** guarda 3 copias síncronas en un centro de datos (11 nueves de durabilidad), mientras que **ZRS** las distribuye en 3 Availability Zones independientes de la misma región (12 nueves). Para protección ante caídas regionales completas, **GRS** y **GZRS** replican asíncronamente a una región secundaria emparejada (16 nueves); habilitar **RA-GRS** / **RA-GZRS** añade acceso de lectura directo al endpoint secundario (`*-secondary.blob.core.windows.net`). Las directivas de **Lifecycle Management** permiten abaratar costos moviendo blobs automáticamente según su antigüedad: **Hot** (inmediato) → **Cool** (mínimo 30 días) → **Cold** (mínimo 90 días) → **Archive** (mínimo 180 días, desconectado, requiere proceso de rehidratación).',
        captionEn: 'Azure Storage delivers multiple durability options: **LRS** keeps 3 synchronous copies within 1 datacenter (11 nines), whereas **ZRS** disperses them across 3 availability zones in the same region (12 nines). For regional DR, **GRS** and **GZRS** asynchronously replicate data to a paired region (16 nines); choosing **RA-GRS** / **RA-GZRS** unlocks direct read access at the secondary DNS endpoint (`*-secondary.blob.core.windows.net`). **Lifecycle Management** automates cost optimization by demoting blobs over time: **Hot** → **Cool** (30-day min) → **Cold** (90-day min) → **Archive** (180-day min; offline, requires rehydration).'
      },

      /* =========================================================================
         4. Virtual Networking: VNet Peering & NSG Evaluation Order
         ========================================================================= */
      {
        match: /vnet|subnet|peering|nsg|asg|firewall|application gateway|waf|load balancer|bastion|udr|route table|forced tunneling|private endpoint|service endpoint|dns|expressroute|vpn/i,
        badge: 'Networking & Security',
        title: 'Topología Hub-Spoke (Peering No Transitivo) y Orden de Evaluación NSG',
        titleEn: 'Hub-Spoke VNet Peering Non-Transitive Topology & NSG Evaluation Order',
        svg: '<svg viewBox="0 0 680 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
          '<defs>' +
            '<marker id="arr-az-4" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
              '<path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>' +
            '</marker>' +
            '<marker id="arr-az-4-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
              '<path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444"/>' +
            '</marker>' +
          '</defs>' +
          /* Top Half: Hub-Spoke Topology */
          /* Spoke 1 */
          '<rect x="14" y="10" width="180" height="102" rx="6" fill="#1e293b" fill-opacity="0.6" stroke="#38bdf8" stroke-width="1.2"/>' +
          '<text x="24" y="26" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="700">SPOKE-1 VNET (10.1.0.0/16)</text>' +
          '<rect x="24" y="34" width="160" height="42" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>' +
          '<text x="32" y="49" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600">Subnet: 10.1.1.0/24</text>' +
          '<text x="32" y="64" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">💻 Frontend Web VMs (NIC NSG)</text>' +
          '<text x="24" y="94" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">Peered to Hub ✅</text>' +
          '<text x="24" y="104" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">UDR: 10.2.0.0/16 → Hub FW</text>' +
          /* Peering Line Spoke1 to Hub */
          '<line x1="194" y1="56" x2="238" y2="56" stroke="#38bdf8" stroke-width="2"/>' +
          '<text x="216" y="50" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" font-weight="700" text-anchor="middle">PEERING</text>' +
          /* Hub VNet */
          '<rect x="240" y="8" width="200" height="106" rx="6" fill="#1e293b" stroke="#fbbf24" stroke-width="1.5"/>' +
          '<text x="250" y="24" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">HUB VNET (10.0.0.0/16)</text>' +
          '<rect x="248" y="32" width="184" height="34" rx="4" fill="#0f172a" stroke="#ef4444" stroke-width="1"/>' +
          '<text x="256" y="46" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">🔥 Azure Firewall / NVA</text>' +
          '<text x="256" y="58" fill="#cbd5e1" font-family="monospace" font-size="8">Private IP: 10.0.1.4</text>' +
          '<rect x="248" y="70" width="184" height="38" rx="4" fill="#0f172a" stroke="#818cf8" stroke-width="1"/>' +
          '<text x="256" y="84" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700">🌐 VPN / ExpressRoute Gateway</text>' +
          '<text x="256" y="98" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Gateway Transit activo para Spokes</text>' +
          /* Peering Line Hub to Spoke2 */
          '<line x1="440" y1="56" x2="484" y2="56" stroke="#38bdf8" stroke-width="2"/>' +
          '<text x="462" y="50" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" font-weight="700" text-anchor="middle">PEERING</text>' +
          /* Spoke 2 */
          '<rect x="486" y="10" width="180" height="102" rx="6" fill="#1e293b" fill-opacity="0.6" stroke="#818cf8" stroke-width="1.2"/>' +
          '<text x="496" y="26" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="700">SPOKE-2 VNET (10.2.0.0/16)</text>' +
          '<rect x="496" y="34" width="160" height="42" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>' +
          '<text x="504" y="49" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600">Subnet: 10.2.1.0/24</text>' +
          '<text x="504" y="64" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5">🗄️ Backend SQL DBs (Private EP)</text>' +
          '<text x="496" y="94" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">Peered to Hub ✅</text>' +
          '<text x="496" y="104" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">NO transitivo con Spoke-1 sin NVA</text>' +
          /* Non-transitive indicator line */
          '<path d="M 104 112 Q 340 134 576 112" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3 3"/>' +
          '<text x="340" y="126" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="700" text-anchor="middle">❌ Peering NO es transitivo entre Spoke-1 y Spoke-2 (Requiere UDR → NVA en Hub)</text>' +
          /* Bottom Half: NSG Rule Processing Order */
          '<rect x="14" y="134" width="652" height="98" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#334155" stroke-width="1.2"/>' +
          '<text x="26" y="150" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" letter-spacing="0.08em">ORDEN DE EVALUACIÓN NSG (REGLAS 100-4096 · PRIMERA COINCIDENCIA GANA)</text>' +
          /* Inbound Flow */
          '<text x="26" y="172" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">INBOUND:</text>' +
          '<rect x="90" y="160" width="80" height="22" rx="3" fill="#0f172a" stroke="#475569" stroke-width="1"/>' +
          '<text x="130" y="174" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" text-anchor="middle">Internet / IP</text>' +
          '<line x1="172" y1="171" x2="194" y2="171" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arr-az-4)"/>' +
          '<rect x="198" y="160" width="150" height="22" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>' +
          '<text x="273" y="174" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">1° Subnet NSG (Evalúa 100..)</text>' +
          '<line x1="350" y1="171" x2="372" y2="171" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arr-az-4)"/>' +
          '<rect x="376" y="160" width="146" height="22" rx="3" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>' +
          '<text x="449" y="174" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">2° NIC NSG (Evalúa 100..)</text>' +
          '<line x1="524" y1="171" x2="546" y2="171" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arr-az-4)"/>' +
          '<rect x="550" y="160" width="104" height="22" rx="3" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-width="1"/>' +
          '<text x="602" y="174" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">💻 VM Destino</text>' +
          /* Outbound Flow */
          '<text x="26" y="206" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">OUTBOUND:</text>' +
          '<rect x="90" y="194" width="80" height="22" rx="3" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-width="1"/>' +
          '<text x="130" y="208" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">💻 VM Origen</text>' +
          '<line x1="172" y1="205" x2="194" y2="205" stroke="#fbbf24" stroke-width="1.5" marker-end="url(#arr-az-4)"/>' +
          '<rect x="198" y="194" width="150" height="22" rx="3" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>' +
          '<text x="273" y="208" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">1° NIC NSG (Evalúa 100..)</text>' +
          '<line x1="350" y1="205" x2="372" y2="205" stroke="#fbbf24" stroke-width="1.5" marker-end="url(#arr-az-4)"/>' +
          '<rect x="376" y="194" width="146" height="22" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>' +
          '<text x="449" y="208" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">2° Subnet NSG (Evalúa 100..)</text>' +
          '<line x1="524" y1="205" x2="546" y2="205" stroke="#fbbf24" stroke-width="1.5" marker-end="url(#arr-az-4)"/>' +
          '<rect x="550" y="194" width="104" height="22" rx="3" fill="#0f172a" stroke="#475569" stroke-width="1"/>' +
          '<text x="602" y="208" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" text-anchor="middle">Internet / Red</text>' +
          '<text x="26" y="226" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Prioridades: 65000 (AllowVNetInBound), 65001 (AllowAzureLoadBalancerInBound), 65500 (DenyAllInBound)</text>' +
        '</svg>',
        caption: 'En topologías Azure **Hub-Spoke**, el emparejamiento **VNet Peering** conecta spokes a una red central con latencia intra-datacenter y cifrado transparente. Sin embargo, el peering **no es transitivo**: el tráfico entre `Spoke-1` y `Spoke-2` no fluye a través del Hub por defecto; se requiere una tabla de rutas personalizadas (**UDR**) con regla `0.0.0.0/0` o prefijo destino apuntando como *Next Hop* a la IP privada del firewall o NVA (`VirtualAppliance`) en el Hub. Respecto al filtrado por **NSG**, las reglas se procesan en orden de prioridad numérica ascendente (100 a 4096): en tráfico entrante (*Inbound*) se evalúa primero el NSG de la subred y luego el de la interfaz de red (NIC); en tráfico saliente (*Outbound*) el orden se invierte (NIC primero, Subnet después).',
        captionEn: 'In Azure **Hub-Spoke** topologies, **VNet Peering** interconnects VNets with line-rate low latency without internet gateways. Crucially, peering is **non-transitive**: packets between `Spoke-1` and `Spoke-2` will not cross the Hub automatically without a **User Defined Route (UDR)** designating the Hub firewall/NVA private IP as the *Next Hop* (`VirtualAppliance`). For **NSG** security filtering, rules process in ascending numerical priority (100 to 4096; first match wins): inbound traffic evaluates the subnet NSG first then the NIC NSG; outbound traffic traverses NIC NSG first followed by subnet NSG.'
      },

      /* =========================================================================
         5. Compute HA: Availability Sets vs Availability Zones & VMSS
         ========================================================================= */
      {
        match: /virtual machine|\bvm\b|availability set|fault domain|update domain|availability zone|vmss|scale set|aks|kubernetes|aci|container|app service|deployment slot|arm template|bicep|disk/i,
        badge: 'Compute & High Availability',
        title: 'Alta Disponibilidad en Cómputo: Availability Sets (FD/UD) vs Availability Zones y VMSS',
        titleEn: 'Compute High Availability: Availability Sets (FD/UD) vs Availability Zones & VMSS',
        svg: '<svg viewBox="0 0 680 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
          '<defs>' +
            '<linearGradient id="az5-grad-fd" x1="0%" y1="0%" x2="0%" y2="100%">' +
              '<stop offset="0%" stop-color="#0284c7" stop-opacity="0.3"/>' +
              '<stop offset="100%" stop-color="#0f172a" stop-opacity="0.9"/>' +
            '</linearGradient>' +
            '<linearGradient id="az5-grad-az" x1="0%" y1="0%" x2="0%" y2="100%">' +
              '<stop offset="0%" stop-color="#059669" stop-opacity="0.3"/>' +
              '<stop offset="100%" stop-color="#0f172a" stop-opacity="0.9"/>' +
            '</linearGradient>' +
          '</defs>' +
          /* Left Box: Availability Set */
          '<rect x="14" y="10" width="310" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#38bdf8" stroke-width="1.2"/>' +
          '<rect x="24" y="18" width="140" height="18" rx="3" fill="#0284c7" fill-opacity="0.3"/>' +
          '<text x="28" y="31" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700">AVAILABILITY SET (99.95% SLA)</text>' +
          '<text x="174" y="31" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="9">1 Datacenter físico</text>' +
          /* Fault Domains (FD 0, FD 1, FD 2) */
          '<text x="24" y="52" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">Fault Domains (FD 0..2) · Aislamiento Eléctrico/Red</text>' +
          /* Rack 0 */
          '<rect x="24" y="58" width="88" height="66" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>' +
          '<text x="68" y="72" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">Rack FD 0</text>' +
          '<rect x="30" y="78" width="76" height="18" rx="2" fill="#1e293b" stroke="#38bdf8" stroke-width="0.8"/>' +
          '<text x="68" y="90" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">VM-1 (UD 0)</text>' +
          '<text x="68" y="114" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">PDU & Switch A</text>' +
          /* Rack 1 */
          '<rect x="124" y="58" width="88" height="66" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>' +
          '<text x="168" y="72" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">Rack FD 1</text>' +
          '<rect x="130" y="78" width="76" height="18" rx="2" fill="#1e293b" stroke="#38bdf8" stroke-width="0.8"/>' +
          '<text x="168" y="90" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">VM-2 (UD 1)</text>' +
          '<text x="168" y="114" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">PDU & Switch B</text>' +
          /* Rack 2 */
          '<rect x="224" y="58" width="88" height="66" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>' +
          '<text x="268" y="72" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">Rack FD 2</text>' +
          '<rect x="230" y="78" width="76" height="18" rx="2" fill="#1e293b" stroke="#38bdf8" stroke-width="0.8"/>' +
          '<text x="268" y="90" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">VM-3 (UD 2)</text>' +
          '<text x="268" y="114" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">PDU & Switch C</text>' +
          /* Update Domains Note */
          '<rect x="24" y="132" width="288" height="42" rx="4" fill="#0f172a" stroke="#818cf8" stroke-width="1"/>' +
          '<text x="32" y="146" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700">Update Domains (UD 0..UD 19) · Reinicios Escalonados</text>' +
          '<text x="32" y="159" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">Durante mantenimiento programado de Azure, solo reinicia 1 UD a la vez.</text>' +
          '<text x="32" y="169" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Máximo 3 FDs y hasta 20 UDs configurables.</text>' +
          /* Bottom AVSet summary */
          '<text x="24" y="190" fill="#f87171" font-family="system-ui, -apple-system, sans-serif" font-size="8">⚠️ No protege ante inundación o incendio del edificio</text>' +
          '<text x="24" y="202" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Las VMs deben crearse dentro del Availability Set (no agregable después)</text>' +
          '<text x="24" y="214" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Usar Managed Disks alinea automáticamente los discos con el FD de la VM</text>' +
          /* Right Box: Availability Zones & VMSS */
          '<rect x="340" y="10" width="326" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#34d399" stroke-width="1.2"/>' +
          '<rect x="350" y="18" width="145" height="18" rx="3" fill="#059669" fill-opacity="0.3"/>' +
          '<text x="354" y="31" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700">AVAILABILITY ZONES (99.99% SLA)</text>' +
          '<text x="510" y="31" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="9">3 Datacenters independientes</text>' +
          /* 3 Independent Zones */
          /* Zone 1 */
          '<rect x="350" y="44" width="96" height="88" rx="5" fill="#0f172a" stroke="#34d399" stroke-width="1"/>' +
          '<text x="398" y="58" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" text-anchor="middle">🏢 Zona 1</text>' +
          '<text x="398" y="70" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Energía A</text>' +
          '<text x="398" y="80" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Clima A · Red A</text>' +
          '<rect x="358" y="86" width="80" height="20" rx="3" fill="#1e293b" stroke="#34d399" stroke-width="0.8"/>' +
          '<text x="398" y="100" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">VMSS Instancia 1</text>' +
          '<text x="398" y="122" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Datacenter 1</text>' +
          /* Zone 2 */
          '<rect x="454" y="44" width="96" height="88" rx="5" fill="#0f172a" stroke="#34d399" stroke-width="1"/>' +
          '<text x="502" y="58" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" text-anchor="middle">🏢 Zona 2</text>' +
          '<text x="502" y="70" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Energía B</text>' +
          '<text x="502" y="80" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Clima B · Red B</text>' +
          '<rect x="462" y="86" width="80" height="20" rx="3" fill="#1e293b" stroke="#34d399" stroke-width="0.8"/>' +
          '<text x="502" y="100" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">VMSS Instancia 2</text>' +
          '<text x="502" y="122" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Datacenter 2</text>' +
          /* Zone 3 */
          '<rect x="558" y="44" width="96" height="88" rx="5" fill="#0f172a" stroke="#34d399" stroke-width="1"/>' +
          '<text x="606" y="58" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" text-anchor="middle">🏢 Zona 3</text>' +
          '<text x="606" y="70" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Energía C</text>' +
          '<text x="606" y="80" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">Clima C · Red C</text>' +
          '<rect x="566" y="86" width="80" height="20" rx="3" fill="#1e293b" stroke="#34d399" stroke-width="0.8"/>' +
          '<text x="606" y="100" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" text-anchor="middle">VMSS Instancia 3</text>' +
          '<text x="606" y="122" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="7" text-anchor="middle">Datacenter 3</text>' +
          /* Inter-zone Latency */
          '<text x="502" y="146" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="600" text-anchor="middle">⚡ Red perimetral de fibra óptica de alta velocidad (Latencia &lt; 2 ms)</text>' +
          /* VMSS Horizontal Scaling Card */
          '<rect x="350" y="154" width="304" height="66" rx="5" fill="#0f172a" stroke="#818cf8" stroke-width="1"/>' +
          '<text x="360" y="168" fill="#818cf8" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700">Virtual Machine Scale Sets (VMSS) & AKS</text>' +
          '<text x="360" y="181" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="8">Autoescalado elástico: agrega/quita instancias según CPU o métrica personalizada</text>' +
          '<text x="360" y="193" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Modo de orquestación Flexible vs Uniforme; soporte de Rolling Upgrades</text>' +
          '<text x="360" y="206" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Zone-Redundant: distribuye automáticamente las réplicas en Zonas 1, 2 y 3</text>' +
        '</svg>',
        caption: 'En Azure, los **Availability Sets** protegen cargas de trabajo dentro de un único centro de datos (99.95% SLA) distribuyendo las VMs en hasta 3 **Fault Domains** (racks independientes con alimentación y switches físicos propios) y hasta 20 **Update Domains** (grupos de reinicio secuencial durante parches planificados). En contraste, las **Availability Zones** elevan el SLA a 99.99% al ubicar los recursos en 3 centros de datos físicos separados dentro de la región con redes de ultra baja latencia (&lt;2ms). Los **VM Scale Sets (VMSS)** aprovechan esta arquitectura para autoescalar horizontalmente instancias idénticas con balanceo de carga zonal o multi-zona.',
        captionEn: 'Azure **Availability Sets** isolate VMs inside a single datacenter (99.95% SLA) across up to 3 **Fault Domains** (separate physical power and top-of-rack switches) and 20 **Update Domains** (rolling reboot groups for platform maintenance). Conversely, **Availability Zones** elevate resilience to 99.99% SLA by distributing VMs across 3 physically distinct datacenters in the region linked by round-trip latency &lt;2ms. **VM Scale Sets (VMSS)** leverage zone-redundancy for automatic elastic scaling with rolling updates.'
      },

      /* =========================================================================
         6. Azure Monitor, KQL, Alerts & Backup / Site Recovery (ASR)
         ========================================================================= */
      {
        match: /monitor|log analytics|kql|kusto|activity log|diagnostic|action group|alert|network watcher|backup|recovery services vault|site recovery|asr|rto|rpo|mars/i,
        badge: 'Monitoring & Disaster Recovery',
        title: 'Pipeline de Telemetría (Azure Monitor, Log Analytics, KQL) y Resiliencia (Backup vs ASR)',
        titleEn: 'Telemetry Pipeline (Azure Monitor, Log Analytics, KQL) & Resilience (Backup vs ASR)',
        svg: '<svg viewBox="0 0 680 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
          '<defs>' +
            '<marker id="arr-az-6" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
              '<path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>' +
            '</marker>' +
            '<marker id="arr-az-6-alert" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
              '<path d="M 0 1 L 10 5 L 0 9 z" fill="#fbbf24"/>' +
            '</marker>' +
          '</defs>' +
          /* Left: Azure Monitor Pipeline (Sources -> Processing -> Action Groups) */
          '<rect x="14" y="10" width="420" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#334155" stroke-width="1.2"/>' +
          '<text x="26" y="26" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700">PIPELINE DE OBSERVABILIDAD AZURE MONITOR</text>' +
          /* Sources */
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
          /* Arrow Sources -> Analytics */
          '<line x1="124" y1="126" x2="142" y2="126" stroke="#38bdf8" stroke-width="1.8" marker-end="url(#arr-az-6)"/>' +
          /* Processing / Stores */
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
          /* Arrow Analytics -> Alerts */
          '<line x1="286" y1="126" x2="304" y2="126" stroke="#fbbf24" stroke-width="1.8" marker-end="url(#arr-az-6-alert)"/>' +
          /* Alerts & Actions */
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
          /* Right: Backup vs Site Recovery */
          '<rect x="444" y="10" width="222" height="220" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#34d399" stroke-width="1.2"/>' +
          '<text x="456" y="26" fill="#34d399" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="700">RECOVERY SERVICES VAULT</text>' +
          /* Azure Backup Card */
          '<rect x="452" y="36" width="206" height="82" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>' +
          '<rect x="460" y="42" width="90" height="16" rx="3" fill="#0284c7" fill-opacity="0.3"/>' +
          '<text x="464" y="54" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="700">Azure Backup</text>' +
          '<text x="460" y="70" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="8">🛡️ Puntos de restauración históricos</text>' +
          '<text x="460" y="82" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Retención diaria, semanal, mensual, anual</text>' +
          '<text x="460" y="94" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5">Soporta VMs, SQL en VM, Azure Files, MARS</text>' +
          '<text x="460" y="108" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" font-weight="600">RPO: diario/horas | RTO: horas</text>' +
          /* Azure Site Recovery (ASR) Card */
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
      }
    ]
  };
})(window);
