/* =========================================================================
   assets/js/visuals-aws.js — Visual Aids Pack for AWS SAA-C03
   Exam: AWS Certified Solutions Architect - Associate (SAA-C03)
   Dark Slate Palette (#0f172a container, #1e293b cards, vibrant SVG semantics)
   ========================================================================= */

window.EXAM_VISUALS = window.EXAM_VISUALS || {};

(function () {
  /* -------------------------------------------------------------------------
     REUSABLE SVG VISUAL DEFINITIONS (viewBox="0 0 680 240")
     ------------------------------------------------------------------------- */

  // 1. VPC Endpoints vs NAT Gateway & PrivateLink
  var VISUAL_VPC_ENDPOINTS = {
    badge: 'VPC Networking & PrivateLink',
    title: 'VPC Endpoints vs NAT Gateway: Conectividad Privada y Optimización de Costes',
    titleEn: 'VPC Endpoints vs NAT Gateway: Private Connectivity & Cost Optimization',
    svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow-cyan" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
      <polygon points="0 0, 7 3.5, 0 7" fill="#38bdf8"/>
    </marker>
    <marker id="arrow-green" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
      <polygon points="0 0, 7 3.5, 0 7" fill="#34d399"/>
    </marker>
    <marker id="arrow-amber" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
      <polygon points="0 0, 7 3.5, 0 7" fill="#fbbf24"/>
    </marker>
    <marker id="arrow-purple" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
      <polygon points="0 0, 7 3.5, 0 7" fill="#c084fc"/>
    </marker>
  </defs>

  <!-- VPC Container -->
  <rect x="15" y="15" width="415" height="210" rx="10" fill="#0b1329" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="5 4"/>
  <text x="30" y="34" fill="#38bdf8" font-size="11" font-weight="700" letter-spacing="0.5">VPC: 10.0.0.0/16</text>

  <!-- Public Subnet -->
  <rect x="25" y="44" width="395" height="66" rx="6" fill="#131e36" stroke="#475569" stroke-width="1"/>
  <text x="35" y="60" fill="#94a3b8" font-size="10" font-weight="600">Public Subnet (10.0.1.0/24)</text>

  <!-- NAT Gateway Box -->
  <rect x="210" y="55" width="195" height="46" rx="5" fill="#1e293b" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="220" y="73" fill="#f8fafc" font-size="11" font-weight="700">NAT Gateway</text>
  <text x="220" y="90" fill="#fbbf24" font-size="9.5">Coste: $0.045/h + $0.045/GB proc.</text>

  <!-- Private Subnet -->
  <rect x="25" y="118" width="395" height="98" rx="6" fill="#111827" stroke="#334155" stroke-width="1"/>
  <text x="35" y="134" fill="#64748b" font-size="10" font-weight="600">Private Subnet (10.0.2.0/24)</text>

  <!-- Private EC2 Instance -->
  <rect x="35" y="142" width="130" height="64" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.2"/>
  <text x="45" y="162" fill="#38bdf8" font-size="11" font-weight="700">EC2 Instance</text>
  <text x="45" y="179" fill="#94a3b8" font-size="9.5">No Public IP</text>
  <text x="45" y="194" fill="#cbd5e1" font-size="9">Route Table Decision</text>

  <!-- Gateway Endpoint inside Subnet/VPC -->
  <rect x="185" y="140" width="225" height="32" rx="5" fill="#064e3b" stroke="#34d399" stroke-width="1.2"/>
  <text x="195" y="156" fill="#34d399" font-size="10.5" font-weight="700">Gateway VPC Endpoint</text>
  <text x="195" y="166" fill="#a7f3d0" font-size="8.5">pl-63a5400a (S3/DynamoDB) · RUTA GRATIS ($0.00)</text>

  <!-- Interface Endpoint (PrivateLink) inside Subnet -->
  <rect x="185" y="178" width="225" height="32" rx="5" fill="#2e1065" stroke="#c084fc" stroke-width="1.2"/>
  <text x="195" y="194" fill="#e9d5ff" font-size="10.5" font-weight="700">Interface Endpoint (PrivateLink)</text>
  <text x="195" y="204" fill="#d8b4fe" font-size="8.5">ENI Privada (SQS, SSM, Secrets Mgr, SaaS)</text>

  <!-- External AWS & Internet Side -->
  <rect x="455" y="55" width="95" height="46" rx="5" fill="#1e293b" stroke="#f87171" stroke-width="1.2"/>
  <text x="465" y="75" fill="#fca5a5" font-size="11" font-weight="700">IGW</text>
  <text x="465" y="90" fill="#94a3b8" font-size="9">Internet GW</text>

  <rect x="568" y="55" width="98" height="46" rx="5" fill="#371b22" stroke="#f87171" stroke-width="1.2"/>
  <text x="578" y="73" fill="#f87171" font-size="10.5" font-weight="700">Internet</text>
  <text x="578" y="90" fill="#fca5a5" font-size="8.5">S3 / APIs públicas</text>

  <!-- Amazon S3 / DynamoDB Target -->
  <rect x="455" y="136" width="210" height="40" rx="6" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
  <text x="470" y="155" fill="#f0fdf4" font-size="11.5" font-weight="700">Amazon S3 / DynamoDB</text>
  <text x="470" y="169" fill="#86efac" font-size="9">Tráfico 100% en AWS Backbone · Sin NAT Fees</text>

  <!-- AWS Services via PrivateLink -->
  <rect x="455" y="180" width="210" height="36" rx="6" fill="#1e1b4b" stroke="#c084fc" stroke-width="1.2"/>
  <text x="470" y="197" fill="#f5f3ff" font-size="11" font-weight="700">Servicios AWS / PrivateLink</text>
  <text x="470" y="210" fill="#c4b5fd" font-size="8.5">Kinesis, CloudWatch, KMS, Endpoint Services</text>

  <!-- Connecting Arrows -->
  <path d="M 100 142 L 100 78 L 205 78" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#arrow-amber)"/>
  <line x1="405" y1="78" x2="447" y2="78" stroke="#fbbf24" stroke-width="1.5" marker-end="url(#arrow-amber)"/>
  <line x1="550" y1="78" x2="562" y2="78" stroke="#f87171" stroke-width="1.5"/>

  <line x1="165" y1="156" x2="180" y2="156" stroke="#34d399" stroke-width="1.5"/>
  <line x1="410" y1="156" x2="447" y2="156" stroke="#34d399" stroke-width="2" marker-end="url(#arrow-green)"/>

  <line x1="165" y1="194" x2="180" y2="194" stroke="#c084fc" stroke-width="1.5"/>
  <line x1="410" y1="194" x2="447" y2="194" stroke="#c084fc" stroke-width="1.5" marker-end="url(#arrow-purple)"/>
</svg>`,
    caption: 'Un `Gateway VPC Endpoint` redirige el tráfico a `S3` y `DynamoDB` gratis mediante tablas de rutas sin atravesar el `NAT Gateway`, eliminando costes por GB transferido.',
    captionEn: 'A `Gateway VPC Endpoint` routes `S3` and `DynamoDB` traffic for free via route tables without traversing the `NAT Gateway`, eliminating per-GB processing fees.'
  };

  // 2. IAM AssumeRole, ExternalId & Multi-Layer Policy Evaluation
  var VISUAL_IAM_SECURITY = {
    badge: 'IAM & Cloud Security',
    title: 'sts:AssumeRole con ExternalId y Evaluación Jerárquica de Políticas',
    titleEn: 'sts:AssumeRole with ExternalId & Multi-Layer Policy Evaluation',
    svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow-sec-green" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
      <polygon points="0 0, 7 3.5, 0 7" fill="#34d399"/>
    </marker>
    <marker id="arrow-sec-cyan" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
      <polygon points="0 0, 7 3.5, 0 7" fill="#38bdf8"/>
    </marker>
    <marker id="arrow-sec-purple" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
      <polygon points="0 0, 7 3.5, 0 7" fill="#c084fc"/>
    </marker>
  </defs>

  <rect x="15" y="15" width="310" height="210" rx="8" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>
  <text x="28" y="35" fill="#818cf8" font-size="11" font-weight="700">Cross-Account AssumeRole + ExternalId</text>

  <rect x="25" y="50" width="130" height="70" rx="6" fill="#1e293b" stroke="#94a3b8" stroke-width="1"/>
  <text x="35" y="68" fill="#e2e8f0" font-size="10" font-weight="700">Cuenta Auditora</text>
  <text x="35" y="82" fill="#94a3b8" font-size="8.5">ID: 9999-9999-9999</text>
  <text x="35" y="96" fill="#38bdf8" font-size="8.5">sts:AssumeRole</text>
  <text x="35" y="110" fill="#fbbf24" font-size="8">ExtId: 'AuditOrg-X'</text>

  <rect x="185" y="50" width="130" height="70" rx="6" fill="#1e1b4b" stroke="#c084fc" stroke-width="1.2"/>
  <text x="195" y="68" fill="#f5f3ff" font-size="10.5" font-weight="700">AWS STS Service</text>
  <text x="195" y="82" fill="#c4b5fd" font-size="8.5">Valida Trust Policy:</text>
  <text x="195" y="96" fill="#a7f3d0" font-size="8">✓ Principal: Cuenta 9999</text>
  <text x="195" y="110" fill="#a7f3d0" font-size="8">✓ sts:ExternalId Match</text>

  <path d="M 155 85 L 177 85" fill="none" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow-sec-cyan)"/>

  <rect x="25" y="132" width="290" height="82" rx="6" fill="#132338" stroke="#34d399" stroke-width="1"/>
  <text x="35" y="150" fill="#34d399" font-size="10" font-weight="700">Credenciales Temporales Emitidas (15m - 12h)</text>
  <text x="35" y="166" fill="#e2e8f0" font-size="8.5">AccessKeyId (ASIA...) · SecretAccessKey · SessionToken</text>
  <text x="35" y="182" fill="#94a3b8" font-size="8">Previene el problema del "Confused Deputy" en plataformas multi-tenant</text>
  <text x="35" y="198" fill="#67e8f9" font-size="8.5">✓ Permisos limitados por ReadOnlyAccess / Target Account Role</text>

  <rect x="340" y="15" width="325" height="210" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.2"/>
  <text x="355" y="35" fill="#f8fafc" font-size="11" font-weight="700">Lógica de Evaluación de Políticas en AWS</text>

  <rect x="352" y="48" width="190" height="34" rx="5" fill="#1e293b" stroke="#818cf8" stroke-width="1"/>
  <text x="362" y="63" fill="#e0e7ff" font-size="9.5" font-weight="600">1. Organizations SCP</text>
  <text x="362" y="75" fill="#94a3b8" font-size="8">Fija barreras máximas (Guardrail)</text>

  <rect x="352" y="88" width="190" height="34" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
  <text x="362" y="103" fill="#e0f2fe" font-size="9.5" font-weight="600">2. IAM Identity Policy</text>
  <text x="362" y="115" fill="#94a3b8" font-size="8">Roles / Grupos / Usuarios</text>

  <rect x="352" y="128" width="190" height="34" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="1"/>
  <text x="362" y="143" fill="#fef3c7" font-size="9.5" font-weight="600">3. Resource Policy (S3 / KMS)</text>
  <text x="362" y="155" fill="#94a3b8" font-size="8">Bucket Policy / KMS Key Policy</text>

  <rect x="552" y="48" width="103" height="114" rx="5" fill="#3b151e" stroke="#f87171" stroke-width="1.2"/>
  <text x="560" y="70" fill="#fca5a5" font-size="9.5" font-weight="700">¿Explicit DENY?</text>
  <text x="560" y="88" fill="#f87171" font-size="8">En SCP, IAM o</text>
  <text x="560" y="102" fill="#f87171" font-size="8">Bucket Policy</text>
  <rect x="560" y="118" width="87" height="30" rx="4" fill="#7f1d1d"/>
  <text x="572" y="137" fill="#fee2e2" font-size="10" font-weight="800">DENY TOTAL</text>

  <rect x="352" y="172" width="303" height="42" rx="5" fill="#064e3b" stroke="#34d399" stroke-width="1.2"/>
  <text x="364" y="190" fill="#a7f3d0" font-size="10" font-weight="700">DECISIÓN: ALLOW Únicamente si...</text>
  <text x="364" y="204" fill="#ecfdf5" font-size="8.5">Existe al menos 1 Explicit Allow Y ningún Explicit Deny en toda la cadena</text>
</svg>`,
    caption: '`sts:AssumeRole` con `ExternalId` evita el problema del "confused deputy" en auditorías externas. Un `Explicit Deny` en cualquier capa (SCP, IAM o Bucket Policy) invalida todo acceso.',
    captionEn: '`sts:AssumeRole` with `ExternalId` prevents confused deputy attacks in 3rd-party audits. An `Explicit Deny` at any layer (SCP, IAM, or Bucket Policy) overrides all allows.'
  };

  // 3. Database HA: RDS Multi-AZ vs Read Replicas vs Aurora Global
  var VISUAL_DATABASE_HA = {
    badge: 'Database HA & Scaling',
    title: 'RDS Multi-AZ vs Read Replicas vs Aurora Global Database',
    titleEn: 'RDS Multi-AZ vs Read Replicas vs Aurora Global Database',
    svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow-db-cyan" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 6 3, 0 6" fill="#38bdf8"/>
    </marker>
    <marker id="arrow-db-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 6 3, 0 6" fill="#34d399"/>
    </marker>
    <marker id="arrow-db-amber" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 6 3, 0 6" fill="#fbbf24"/>
    </marker>
  </defs>

  <rect x="15" y="15" width="205" height="210" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
  <rect x="25" y="23" width="90" height="18" rx="3" fill="#1e293b"/>
  <text x="30" y="36" fill="#38bdf8" font-size="9.5" font-weight="700">RDS Multi-AZ (HA)</text>

  <rect x="25" y="48" width="185" height="52" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
  <text x="35" y="66" fill="#f8fafc" font-size="10.5" font-weight="700">Primary DB (AZ-A)</text>
  <text x="35" y="80" fill="#34d399" font-size="8.5">● Active: Read + Write</text>
  <text x="35" y="93" fill="#94a3b8" font-size="8">Synchronous EBS Replication</text>

  <line x1="117" y1="102" x2="117" y2="123" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow-db-cyan)"/>
  <text x="123" y="116" fill="#38bdf8" font-size="7.5" font-weight="600">Sync (RPO=0)</text>

  <rect x="25" y="126" width="185" height="52" rx="5" fill="#1e293b" stroke="#fbbf24" stroke-width="1"/>
  <text x="35" y="144" fill="#fbbf24" font-size="10.5" font-weight="700">Standby DB (AZ-B)</text>
  <text x="35" y="158" fill="#f87171" font-size="8.5">✕ Standby: NO ACEPTA LECTURAS</text>
  <text x="35" y="171" fill="#94a3b8" font-size="8">Failover automático DNS (RTO 60s)</text>

  <rect x="25" y="185" width="185" height="32" rx="4" fill="#1e293b"/>
  <text x="32" y="198" fill="#cbd5e1" font-size="8">Objetivo: Resiliencia ante caídas de AZ.</text>
  <text x="32" y="210" fill="#94a3b8" font-size="7.5">No escala consultas de lectura.</text>

  <rect x="235" y="15" width="205" height="210" rx="8" fill="#0f172a" stroke="#34d399" stroke-width="1.2"/>
  <rect x="245" y="23" width="115" height="18" rx="3" fill="#1e293b"/>
  <text x="250" y="36" fill="#34d399" font-size="9.5" font-weight="700">Read Replicas (Escala)</text>

  <rect x="245" y="48" width="185" height="45" rx="5" fill="#1e293b" stroke="#34d399" stroke-width="1"/>
  <text x="255" y="65" fill="#f8fafc" font-size="10.5" font-weight="700">Primary DB</text>
  <text x="255" y="80" fill="#34d399" font-size="8.5">Read / Write · Genera binlogs</text>

  <line x1="285" y1="95" x2="285" y2="120" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#arrow-db-amber)"/>
  <line x1="390" y1="95" x2="390" y2="120" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#arrow-db-amber)"/>
  <text x="305" y="112" fill="#fbbf24" font-size="7.5">Async Replication</text>

  <rect x="245" y="124" width="88" height="54" rx="5" fill="#1e293b" stroke="#34d399" stroke-width="1"/>
  <text x="252" y="142" fill="#34d399" font-size="9.5" font-weight="700">Replica 1</text>
  <text x="252" y="156" fill="#a7f3d0" font-size="8">Solo Lectura</text>
  <text x="252" y="169" fill="#94a3b8" font-size="7.5">AZ-A / AZ-B</text>

  <rect x="342" y="124" width="88" height="54" rx="5" fill="#1e293b" stroke="#34d399" stroke-width="1"/>
  <text x="349" y="142" fill="#34d399" font-size="9.5" font-weight="700">Replica 2</text>
  <text x="349" y="156" fill="#a7f3d0" font-size="8">Cross-Region</text>
  <text x="349" y="169" fill="#94a3b8" font-size="7.5">Opcional</text>

  <rect x="245" y="185" width="185" height="32" rx="4" fill="#1e293b"/>
  <text x="252" y="198" fill="#cbd5e1" font-size="8">Objetivo: Descargar lecturas SELECT.</text>
  <text x="252" y="210" fill="#94a3b8" font-size="7.5">Eventual consistency (Lag de réplica).</text>

  <rect x="455" y="15" width="210" height="210" rx="8" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>
  <rect x="465" y="23" width="130" height="18" rx="3" fill="#1e293b"/>
  <text x="470" y="36" fill="#818cf8" font-size="9.5" font-weight="700">Aurora Global Database</text>

  <rect x="465" y="48" width="190" height="46" rx="5" fill="#1e1b4b" stroke="#818cf8" stroke-width="1"/>
  <text x="475" y="65" fill="#f8fafc" font-size="10" font-weight="700">Primary Region (us-east-1)</text>
  <text x="475" y="80" fill="#a5b4fc" font-size="8.5">1 Master R/W + hasta 15 Replicas</text>

  <line x1="560" y1="96" x2="560" y2="120" stroke="#818cf8" stroke-width="2" marker-end="url(#arrow-db-cyan)"/>
  <text x="475" y="112" fill="#818cf8" font-size="8" font-weight="600">Storage Replication (&lt; 1 seg lag)</text>

  <rect x="465" y="124" width="190" height="46" rx="5" fill="#1e293b" stroke="#818cf8" stroke-width="1"/>
  <text x="475" y="141" fill="#c7d2fe" font-size="10" font-weight="700">Secondary Region (eu-west-1)</text>
  <text x="475" y="156" fill="#94a3b8" font-size="8.5">Hasta 16 Replicas · Promoción RTO &lt; 1m</text>

  <rect x="465" y="177" width="190" height="40" rx="4" fill="#1e293b"/>
  <text x="472" y="191" fill="#c7d2fe" font-size="8">Capa de almacenamiento desacoplada.</text>
  <text x="472" y="203" fill="#a5b4fc" font-size="7.5">Sin impacto de réplica en el cómputo primario.</text>
</svg>`,
    caption: '`RDS Multi-AZ` garantiza alta disponibilidad mediante replicación síncrona y failover automático (la réplica standby no acepta lecturas). Las `Read Replicas` escalan lecturas de forma asíncrona.',
    captionEn: '`RDS Multi-AZ` delivers high availability via synchronous replication and automatic failover (standby cannot take reads). `Read Replicas` scale queries asynchronously.'
  };

  // 4. Decoupled Messaging: SNS Fan-Out + SQS FIFO/Standard + DLQ
  var VISUAL_DECOUPLED_MSG = {
    badge: 'Decoupled Messaging',
    title: 'SNS Fan-Out con SQS FIFO, Standard, Backlog Scaling y Dead-Letter Queue',
    titleEn: 'SNS Fan-Out with SQS FIFO, Standard, Backlog Scaling & Dead-Letter Queue',
    svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow-msg-orange" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 6 3, 0 6" fill="#f97316"/>
    </marker>
    <marker id="arrow-msg-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 6 3, 0 6" fill="#f87171"/>
    </marker>
    <marker id="arrow-msg-cyan" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 6 3, 0 6" fill="#38bdf8"/>
    </marker>
    <marker id="arrow-msg-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 6 3, 0 6" fill="#34d399"/>
    </marker>
  </defs>

  <rect x="15" y="70" width="95" height="60" rx="6" fill="#1e293b" stroke="#f97316" stroke-width="1.2"/>
  <text x="23" y="93" fill="#fed7aa" font-size="10" font-weight="700">Productor</text>
  <text x="23" y="108" fill="#94a3b8" font-size="8">Microservicio</text>
  <text x="23" y="120" fill="#38bdf8" font-size="8">1 Publish Event</text>

  <line x1="110" y1="100" x2="135" y2="100" stroke="#f97316" stroke-width="1.5" marker-end="url(#arrow-msg-orange)"/>

  <rect x="140" y="55" width="115" height="90" rx="8" fill="#2d150b" stroke="#f97316" stroke-width="1.5"/>
  <text x="148" y="78" fill="#fed7aa" font-size="11" font-weight="800">Amazon SNS</text>
  <text x="148" y="94" fill="#fb923c" font-size="9" font-weight="600">Topic: orders-tx</text>
  <text x="148" y="112" fill="#cbd5e1" font-size="8">Patrón Fan-Out</text>
  <text x="148" y="126" fill="#94a3b8" font-size="7.5">1-to-N Decoupling</text>

  <path d="M 255 75 L 285 75 L 285 40 L 310 40" fill="none" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow-msg-cyan)"/>
  <line x1="255" y1="100" x2="310" y2="100" stroke="#34d399" stroke-width="1.5" marker-end="url(#arrow-msg-green)"/>
  <path d="M 255 125 L 285 125 L 285 180 L 310 180" fill="none" stroke="#818cf8" stroke-width="1.5"/>

  <rect x="315" y="18" width="175" height="50" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="1.2"/>
  <text x="325" y="35" fill="#38bdf8" font-size="10.5" font-weight="700">SQS FIFO (orders.fifo)</text>
  <text x="325" y="49" fill="#93c5fd" font-size="8">MessageGroupId · DeduplicationId</text>
  <text x="325" y="60" fill="#cbd5e1" font-size="7.5">Orden estricto · Exactly-Once (300 msg/s)</text>

  <rect x="520" y="18" width="145" height="50" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>
  <text x="530" y="36" fill="#f8fafc" font-size="10" font-weight="700">Worker Pagos</text>
  <text x="530" y="52" fill="#94a3b8" font-size="8">Procesamiento Secuencial</text>

  <line x1="490" y1="43" x2="515" y2="43" stroke="#38bdf8" stroke-width="1.2" marker-end="url(#arrow-msg-cyan)"/>

  <rect x="315" y="78" width="175" height="60" rx="5" fill="#1e293b" stroke="#34d399" stroke-width="1.2"/>
  <text x="325" y="96" fill="#34d399" font-size="10.5" font-weight="700">SQS Standard Queue</text>
  <text x="325" y="110" fill="#a7f3d0" font-size="8">Throughput Ilimitado · At-least-once</text>
  <text x="325" y="123" fill="#cbd5e1" font-size="7.5">Visibility Timeout (30s – 12h, aj. 45m)</text>

  <rect x="520" y="78" width="145" height="60" rx="5" fill="#0f172a" stroke="#34d399" stroke-width="1"/>
  <text x="530" y="96" fill="#f8fafc" font-size="10" font-weight="700">Auto Scaling EC2 / ECS</text>
  <text x="530" y="110" fill="#86efac" font-size="8">Escala por Backlog:</text>
  <text x="530" y="123" fill="#94a3b8" font-size="7.5">ApproximateNumberOfMessages</text>

  <line x1="490" y1="108" x2="515" y2="108" stroke="#34d399" stroke-width="1.2" marker-end="url(#arrow-msg-green)"/>

  <path d="M 402 138 L 402 158" fill="none" stroke="#f87171" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#arrow-msg-red)"/>
  <text x="408" y="152" fill="#f87171" font-size="7.5">maxReceiveCount</text>

  <rect x="315" y="162" width="175" height="58" rx="5" fill="#3b151e" stroke="#f87171" stroke-width="1.2"/>
  <text x="325" y="180" fill="#fca5a5" font-size="10.5" font-weight="700">Dead-Letter Queue (DLQ)</text>
  <text x="325" y="195" fill="#f87171" font-size="8">Aísla mensajes venenosos / bugs</text>
  <text x="325" y="208" fill="#fee2e2" font-size="7.5">CloudWatch Alarm + Redrive Policy</text>

  <rect x="520" y="162" width="145" height="58" rx="5" fill="#1e293b" stroke="#f87171" stroke-width="1"/>
  <text x="530" y="180" fill="#fca5a5" font-size="9.5" font-weight="700">Soporte y Debugging</text>
  <text x="530" y="195" fill="#94a3b8" font-size="8">Análisis sin frenar la cola</text>
  <text x="530" y="208" fill="#67e8f9" font-size="7.5">DLQ Redrive a Source Queue</text>

  <line x1="490" y1="190" x2="515" y2="190" stroke="#f87171" stroke-width="1.2" marker-end="url(#arrow-msg-red)"/>
</svg>`,
    caption: '`SNS Fan-Out` distribuye eventos a colas `FIFO` (para orden estricto) y `Standard` (throughput masivo). Un `DLQ` captura mensajes fallidos tras superar `maxReceiveCount` sin detener el flujo.',
    captionEn: '`SNS Fan-Out` fans out events to `FIFO` (strict ordering) and `Standard` queues (infinite throughput). A `DLQ` isolates poisonous messages exceeding `maxReceiveCount` without halting traffic.'
  };

  // 5. Amazon S3 Storage Classes Waterfall & Retrieval SLAs
  var VISUAL_S3_WATERFALL = {
    badge: 'S3 Lifecycle & Storage Tiers',
    title: 'Amazon S3: Cascada del Ciclo de Vida, Costes por GB y SLAs de Recuperación',
    titleEn: 'Amazon S3: Lifecycle Waterfall, Storage Costs & Retrieval SLAs',
    svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <line x1="30" y1="36" x2="650" y2="36" stroke="#475569" stroke-width="2"/>
  <circle cx="50" cy="36" r="4" fill="#38bdf8"/>
  <circle cx="180" cy="36" r="4" fill="#38bdf8"/>
  <circle cx="320" cy="36" r="4" fill="#fbbf24"/>
  <circle cx="460" cy="36" r="4" fill="#818cf8"/>
  <circle cx="590" cy="36" r="4" fill="#a855f7"/>

  <text x="50" y="24" fill="#38bdf8" font-size="9" font-weight="700" text-anchor="middle">Día 0 (Ingesta)</text>
  <text x="180" y="24" fill="#38bdf8" font-size="9" font-weight="700" text-anchor="middle">Patrón variable</text>
  <text x="320" y="24" fill="#fbbf24" font-size="9" font-weight="700" text-anchor="middle">Día 30+</text>
  <text x="460" y="24" fill="#818cf8" font-size="9" font-weight="700" text-anchor="middle">Día 90+</text>
  <text x="590" y="24" fill="#a855f7" font-size="9" font-weight="700" text-anchor="middle">Día 180+</text>

  <rect x="15" y="48" width="120" height="135" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.2"/>
  <text x="24" y="66" fill="#38bdf8" font-size="10" font-weight="800">S3 Standard</text>
  <text x="24" y="82" fill="#f8fafc" font-size="11" font-weight="700">$0.023/GB</text>
  <text x="24" y="98" fill="#34d399" font-size="8.5">SLA: Milisegundos</text>
  <text x="24" y="113" fill="#cbd5e1" font-size="8">Sin min. días</text>
  <text x="24" y="128" fill="#94a3b8" font-size="8">≥3 AZs (11 9s)</text>
  <rect x="22" y="142" width="106" height="30" rx="3" fill="#0f172a"/>
  <text x="26" y="156" fill="#94a3b8" font-size="7.5">Uso: Datos activos,</text>
  <text x="26" y="167" fill="#cbd5e1" font-size="7.5">sitios web, analítica</text>

  <rect x="145" y="48" width="125" height="135" rx="6" fill="#132338" stroke="#38bdf8" stroke-width="1.2"/>
  <text x="153" y="66" fill="#38bdf8" font-size="10" font-weight="800">Intelligent-Tiering</text>
  <text x="153" y="82" fill="#f8fafc" font-size="10.5" font-weight="700">Auto-Scaling Tiers</text>
  <text x="153" y="98" fill="#34d399" font-size="8.5">Sin costes retriev.</text>
  <text x="153" y="113" fill="#cbd5e1" font-size="8">Frequent / Infreq.</text>
  <text x="153" y="128" fill="#94a3b8" font-size="8">Tarifa monitor/obj</text>
  <rect x="150" y="142" width="115" height="30" rx="3" fill="#0f172a"/>
  <text x="154" y="156" fill="#94a3b8" font-size="7.5">Uso: Patrón de acceso</text>
  <text x="154" y="167" fill="#38bdf8" font-size="7.5">desconocido o variable</text>

  <rect x="280" y="48" width="120" height="135" rx="6" fill="#1e293b" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="288" y="66" fill="#fbbf24" font-size="10" font-weight="800">Standard-IA</text>
  <text x="288" y="82" fill="#f8fafc" font-size="11" font-weight="700">$0.0125/GB</text>
  <text x="288" y="98" fill="#34d399" font-size="8.5">SLA: Milisegundos</text>
  <text x="288" y="113" fill="#fca5a5" font-size="8">Min. 30 días</text>
  <text x="288" y="128" fill="#fbbf24" font-size="8">Cobro por retrieval</text>
  <rect x="285" y="142" width="110" height="30" rx="3" fill="#0f172a"/>
  <text x="290" y="156" fill="#94a3b8" font-size="7.5">Uso: Backups mes,</text>
  <text x="290" y="167" fill="#cbd5e1" font-size="7.5">acceso esporádico</text>

  <rect x="410" y="48" width="125" height="135" rx="6" fill="#1e1b4b" stroke="#818cf8" stroke-width="1.2"/>
  <text x="418" y="66" fill="#a5b4fc" font-size="10" font-weight="800">Glacier Flexible</text>
  <text x="418" y="82" fill="#f8fafc" font-size="11" font-weight="700">$0.0036/GB</text>
  <text x="418" y="98" fill="#f59e0b" font-size="8.5">SLA: 1-5m / 3-5h</text>
  <text x="418" y="113" fill="#fca5a5" font-size="8">Min. 90 días</text>
  <text x="418" y="128" fill="#c7d2fe" font-size="8">Expedited / Standard</text>
  <rect x="415" y="142" width="115" height="30" rx="3" fill="#0f172a"/>
  <text x="420" y="156" fill="#94a3b8" font-size="7.5">Uso: Archivo anual,</text>
  <text x="420" y="167" fill="#cbd5e1" font-size="7.5">compliance legal</text>

  <rect x="545" y="48" width="120" height="135" rx="6" fill="#2e1065" stroke="#a855f7" stroke-width="1.5"/>
  <text x="553" y="66" fill="#e9d5ff" font-size="10" font-weight="800">Deep Archive</text>
  <text x="553" y="82" fill="#34d399" font-size="11" font-weight="800">$0.00099/GB</text>
  <text x="553" y="98" fill="#fca5a5" font-size="8.5">SLA: 12h / 48h</text>
  <text x="553" y="113" fill="#fca5a5" font-size="8">Min. 180 días</text>
  <text x="553" y="128" fill="#d8b4fe" font-size="8">¡Coste más bajo!</text>
  <rect x="550" y="142" width="110" height="30" rx="3" fill="#0f172a"/>
  <text x="555" y="156" fill="#94a3b8" font-size="7.5">Uso: Retención 7-10a,</text>
  <text x="555" y="167" fill="#cbd5e1" font-size="7.5">reemplazo de cintas</text>

  <rect x="15" y="192" width="650" height="35" rx="5" fill="#0f172a" stroke="#334155" stroke-width="1"/>
  <text x="25" y="213" fill="#38bdf8" font-size="9" font-weight="700">Regla S3 Lifecycle:</text>
  <text x="135" y="213" fill="#cbd5e1" font-size="8.5">Objetos en Standard pasan a Standard-IA a los 30d, a Glacier a los 90d, a Deep Archive a los 180d y se expiran al año.</text>
</svg>`,
    caption: '`S3 Lifecycle Rules` automatizan la transición de datos fríos hacia `Standard-IA`, `Glacier Flexible` (SLA de 1 a 5 horas) y `Glacier Deep Archive` ($0.00099/GB con SLA de 12 horas).',
    captionEn: '`S3 Lifecycle Rules` automate transitioning cold objects to `Standard-IA`, `Glacier Flexible` (1 to 5 hr SLA), and `Glacier Deep Archive` ($0.00099/GB with 12 hr retrieval SLA).'
  };

  // 6. Load Balancing, Global Edge & EC2 Compute Cost Savings
  var VISUAL_EDGE_COMPUTE = {
    badge: 'Edge Networking & Compute Optimization',
    title: 'ALB vs NLB vs CloudFront vs Global Accelerator y Modelo de Costes EC2',
    titleEn: 'ALB vs NLB vs CloudFront vs Global Accelerator & EC2 Cost Models',
    svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <rect x="15" y="15" width="355" height="210" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
  <text x="25" y="34" fill="#38bdf8" font-size="11" font-weight="700">Matriz: Edge Routing y Balanceo de Carga</text>

  <rect x="25" y="44" width="160" height="74" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
  <text x="33" y="60" fill="#38bdf8" font-size="10" font-weight="700">CloudFront (L7 CDN)</text>
  <text x="33" y="74" fill="#94a3b8" font-size="8">Caché en 600+ Edge Pops</text>
  <text x="33" y="87" fill="#cbd5e1" font-size="8">HTTP/S, OAC para S3</text>
  <text x="33" y="100" fill="#34d399" font-size="8">Protección DDoS con Shield</text>

  <rect x="195" y="44" width="165" height="74" rx="5" fill="#1e293b" stroke="#818cf8" stroke-width="1"/>
  <text x="203" y="60" fill="#818cf8" font-size="10" font-weight="700">Global Accelerator (L4)</text>
  <text x="203" y="74" fill="#94a3b8" font-size="8">2 IPs Anycast Estáticas</text>
  <text x="203" y="87" fill="#cbd5e1" font-size="8">TCP / UDP (VoIP, Gaming)</text>
  <text x="203" y="100" fill="#c7d2fe" font-size="8">Enruta por troncal AWS</text>

  <rect x="25" y="126" width="160" height="88" rx="5" fill="#1e293b" stroke="#34d399" stroke-width="1"/>
  <text x="33" y="142" fill="#34d399" font-size="10" font-weight="700">ALB (Layer 7 HTTP)</text>
  <text x="33" y="156" fill="#94a3b8" font-size="8">Rutas por Path y Host</text>
  <text x="33" y="169" fill="#cbd5e1" font-size="8">Target Groups, WebSockets</text>
  <text x="33" y="182" fill="#94a3b8" font-size="8">Integración WAF directa</text>
  <text x="33" y="196" fill="#67e8f9" font-size="7.5">IP dinámica por AZ</text>

  <rect x="195" y="126" width="165" height="88" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="1"/>
  <text x="203" y="142" fill="#f59e0b" font-size="10" font-weight="700">NLB (Layer 4 TCP/UDP)</text>
  <text x="203" y="156" fill="#94a3b8" font-size="8">Latencia de microsegundos</text>
  <text x="203" y="169" fill="#cbd5e1" font-size="8">Millones de req / seg</text>
  <text x="203" y="182" fill="#fbbf24" font-size="8">IP Elástica Estática por AZ</text>
  <text x="203" y="196" fill="#fed7aa" font-size="7.5">Soporta PrivateLink Endpoints</text>

  <rect x="385" y="15" width="280" height="210" rx="8" fill="#0f172a" stroke="#34d399" stroke-width="1.2"/>
  <text x="398" y="34" fill="#34d399" font-size="11" font-weight="700">Modelos de Pago EC2 &amp; Ahorro</text>

  <rect x="398" y="46" width="250" height="34" rx="4" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
  <rect x="398" y="46" width="250" height="34" rx="4" fill="#475569" opacity="0.3"/>
  <text x="408" y="60" fill="#f8fafc" font-size="9.5" font-weight="700">On-Demand (Tarifa Base)</text>
  <text x="408" y="73" fill="#cbd5e1" font-size="8">Cero compromiso · Cargas cortas o impredecibles</text>
  <text x="615" y="66" fill="#94a3b8" font-size="9" font-weight="700">100%</text>

  <rect x="398" y="88" width="250" height="38" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
  <rect x="398" y="88" width="160" height="38" rx="4" fill="#0284c7" opacity="0.4"/>
  <text x="408" y="103" fill="#38bdf8" font-size="9.5" font-weight="700">Compute Savings Plans (1–3a)</text>
  <text x="408" y="117" fill="#cbd5e1" font-size="8">Hasta 66% ahorro · Flexible (EC2, Fargate, Lambda)</text>
  <text x="612" y="108" fill="#38bdf8" font-size="9" font-weight="700">-66%</text>

  <rect x="398" y="134" width="250" height="38" rx="4" fill="#1e293b" stroke="#818cf8" stroke-width="1"/>
  <rect x="398" y="134" width="135" height="38" rx="4" fill="#4f46e5" opacity="0.4"/>
  <text x="408" y="149" fill="#818cf8" font-size="9.5" font-weight="700">Instance Savings / Standard RI</text>
  <text x="408" y="163" fill="#cbd5e1" font-size="8">Hasta 72% ahorro · Atado a familia y región</text>
  <text x="612" y="154" fill="#818cf8" font-size="9" font-weight="700">-72%</text>

  <rect x="398" y="180" width="250" height="36" rx="4" fill="#1e293b" stroke="#34d399" stroke-width="1.2"/>
  <rect x="398" y="180" width="75" height="36" rx="4" fill="#059669" opacity="0.5"/>
  <text x="408" y="195" fill="#34d399" font-size="9.5" font-weight="700">Spot Instances (Capacidad Ociosa)</text>
  <text x="408" y="208" fill="#a7f3d0" font-size="8">Hasta 90% ahorro · Batch, HPC (Aviso 2 min)</text>
  <text x="612" y="200" fill="#34d399" font-size="9" font-weight="700">-90%</text>
</svg>`,
    caption: '`CloudFront` cachea contenido L7 en el Edge mientras que `Global Accelerator` enruta tráfico L4 por IPs Anycast fijas. Para cómputo, `Spot` ofrece hasta un 90% de descuento y `Savings Plans` hasta un 66–72% flexible.',
    captionEn: '`CloudFront` caches L7 content at Edge locations, whereas `Global Accelerator` routes L4 traffic over fixed Anycast IPs. For compute, `Spot` provides up to 90% savings and `Savings Plans` up to 66–72%.'
  };

  // 7. Storage Architectures: Block vs File (EBS vs EFS vs FSx)
  var VISUAL_STORAGE_TYPES = {
    badge: 'Storage Architectures: Block vs File',
    title: 'Amazon EBS vs EFS vs FSx: Comparativa de Bloque, Archivos y Rendimiento HPC',
    titleEn: 'Amazon EBS vs EFS vs FSx: Block, Distributed Files & HPC Storage Comparison',
    svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <rect x="15" y="15" width="205" height="210" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
  <rect x="25" y="25" width="105" height="20" rx="4" fill="#1e293b"/>
  <text x="32" y="39" fill="#38bdf8" font-size="10" font-weight="700">Amazon EBS (Bloque)</text>

  <rect x="25" y="52" width="185" height="48" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="35" y="70" fill="#f8fafc" font-size="10.5" font-weight="700">gp3 (Propósito General)</text>
  <text x="35" y="84" fill="#38bdf8" font-size="8.5">3.000 IOPS base · 125 MB/s</text>
  <text x="35" y="94" fill="#94a3b8" font-size="7.5">Escala IOPS sin ampliar disco</text>

  <rect x="25" y="106" width="185" height="48" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="35" y="124" fill="#34d399" font-size="10.5" font-weight="700">io2 Block Express</text>
  <text x="35" y="138" fill="#a7f3d0" font-size="8.5">Hasta 256.000 IOPS · Sub-ms</text>
  <text x="35" y="148" fill="#94a3b8" font-size="7.5">io2 Multi-Attach (hasta 16 EC2 en 1 AZ)</text>

  <rect x="25" y="160" width="185" height="55" rx="5" fill="#132338" stroke="#38bdf8" stroke-width="1"/>
  <text x="33" y="177" fill="#38bdf8" font-size="9" font-weight="700">Ámbito: 1 Sola Zona (AZ)</text>
  <text x="33" y="191" fill="#cbd5e1" font-size="8">Atado a 1 EC2 (salvo Multi-Attach).</text>
  <text x="33" y="203" fill="#94a3b8" font-size="7.5">Snapshots automáticos guardados en S3.</text>

  <rect x="235" y="15" width="205" height="210" rx="8" fill="#0f172a" stroke="#34d399" stroke-width="1.2"/>
  <rect x="245" y="25" width="115" height="20" rx="4" fill="#1e293b"/>
  <text x="252" y="39" fill="#34d399" font-size="10" font-weight="700">Amazon EFS (NFS POSIX)</text>

  <rect x="245" y="52" width="185" height="48" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="255" y="70" fill="#f8fafc" font-size="10.5" font-weight="700">NFSv4 para Linux</text>
  <text x="255" y="84" fill="#34d399" font-size="8.5">Montaje simultáneo en 100s EC2</text>
  <text x="255" y="94" fill="#94a3b8" font-size="7.5">Integración nativa con ECS y Lambda</text>

  <rect x="245" y="106" width="185" height="48" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="255" y="124" fill="#fbbf24" font-size="10.5" font-weight="700">Capacidad Elástica</text>
  <text x="255" y="138" fill="#fed7aa" font-size="8.5">Crece y decrece automáticamente</text>
  <text x="255" y="148" fill="#94a3b8" font-size="7.5">EFS Infrequent Access (EFS-IA) tiering</text>

  <rect x="245" y="160" width="185" height="55" rx="5" fill="#064e3b" stroke="#34d399" stroke-width="1"/>
  <text x="253" y="177" fill="#34d399" font-size="9" font-weight="700">Ámbito: Multi-AZ Regional</text>
  <text x="253" y="191" fill="#cbd5e1" font-size="8">Resistente a la caída total de 1 AZ.</text>
  <text x="253" y="203" fill="#94a3b8" font-size="7.5">Soporta Bursting o Provisioned Throughput.</text>

  <rect x="455" y="15" width="210" height="210" rx="8" fill="#0f172a" stroke="#c084fc" stroke-width="1.2"/>
  <rect x="465" y="25" width="135" height="20" rx="4" fill="#1e293b"/>
  <text x="472" y="39" fill="#c084fc" font-size="10" font-weight="700">Amazon FSx (Especializado)</text>

  <rect x="465" y="52" width="190" height="48" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="475" y="70" fill="#38bdf8" font-size="10.5" font-weight="700">FSx for Windows File Server</text>
  <text x="475" y="84" fill="#cbd5e1" font-size="8.5">Nativo NTFS, SMB y Microsoft AD</text>
  <text x="475" y="94" fill="#94a3b8" font-size="7.5">Single-AZ o Multi-AZ para Windows</text>

  <rect x="465" y="106" width="190" height="48" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="475" y="124" fill="#f87171" font-size="10.5" font-weight="700">FSx for Lustre (HPC / ML)</text>
  <text x="475" y="138" fill="#fca5a5" font-size="8.5">Millones de IOPS · Latencia sub-ms</text>
  <text x="475" y="148" fill="#94a3b8" font-size="7.5">Vinculado directamente a buckets S3</text>

  <rect x="465" y="160" width="190" height="55" rx="5" fill="#2e1065" stroke="#c084fc" stroke-width="1"/>
  <text x="473" y="177" fill="#c084fc" font-size="9" font-weight="700">Ámbito: Máximo Rendimiento</text>
  <text x="473" y="191" fill="#cbd5e1" font-size="8">Lustre procesa petabytes S3 sin demora.</text>
  <text x="473" y="203" fill="#94a3b8" font-size="7.5">También disponible FSx for NetApp ONTAP.</text>
</svg>`,
    caption: '`EBS` entrega almacenamiento en bloque atado a 1 AZ; `EFS` ofrece sistema de archivos compartido `NFS` multi-AZ para Linux; `FSx for Windows` integra `SMB/AD` y `FSx for Lustre` acelera cómputo HPC/ML sobre `S3`.',
    captionEn: '`EBS` delivers low-latency single-AZ block storage; `EFS` provides multi-AZ POSIX `NFS` for Linux; `FSx for Windows` supports `SMB/AD`, and `FSx for Lustre` supercharges HPC/ML pipelines over `S3`.'
  };

  // 8. Hybrid Cloud Migration & Storage (Storage Gateway, DataSync, Snowball)
  var VISUAL_HYBRID_MIGRATION = {
    badge: 'Hybrid Cloud & Migration',
    title: 'AWS Hybrid Storage: Storage Gateway, DataSync y Familia Snowball',
    titleEn: 'AWS Hybrid Storage: Storage Gateway, DataSync & Snowball Edge Family',
    svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow-migr-cyan" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 6 3, 0 6" fill="#38bdf8"/>
    </marker>
    <marker id="arrow-migr-amber" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 6 3, 0 6" fill="#fbbf24"/>
    </marker>
  </defs>

  <rect x="15" y="15" width="200" height="210" rx="8" fill="#111827" stroke="#475569" stroke-width="1.2"/>
  <text x="25" y="35" fill="#f8fafc" font-size="11" font-weight="700">On-Premises Data Center</text>

  <rect x="25" y="48" width="180" height="48" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="33" y="65" fill="#38bdf8" font-size="9.5" font-weight="700">Storage Gateway Appliance</text>
  <text x="33" y="78" fill="#cbd5e1" font-size="8">S3 File GW (NFS/SMB) a S3</text>
  <text x="33" y="89" fill="#94a3b8" font-size="7.5">Volume GW (iSCSI) / Tape GW (VTL)</text>

  <rect x="25" y="104" width="180" height="48" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="33" y="121" fill="#34d399" font-size="9.5" font-weight="700">AWS DataSync Agent</text>
  <text x="33" y="134" fill="#cbd5e1" font-size="8">Transferencia acelerada red</text>
  <text x="33" y="145" fill="#a7f3d0" font-size="7.5">Hasta 10x más rápido que scripts rsync</text>

  <rect x="25" y="160" width="180" height="54" rx="5" fill="#1e293b" stroke="#fbbf24"/>
  <text x="33" y="177" fill="#fbbf24" font-size="9.5" font-weight="700">Snowball Edge Físico</text>
  <text x="33" y="191" fill="#fed7aa" font-size="8">80 TB a 210 TB por dispositivo</text>
  <text x="33" y="203" fill="#94a3b8" font-size="7.5">Migración petabytes sin saturar WAN</text>

  <line x1="215" y1="72" x2="280" y2="72" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow-migr-cyan)"/>
  <line x1="215" y1="128" x2="280" y2="128" stroke="#34d399" stroke-width="1.5" marker-end="url(#arrow-migr-cyan)"/>
  <path d="M 215 187 L 245 187 L 245 187 L 280 187" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#arrow-migr-amber)"/>

  <rect x="285" y="15" width="145" height="210" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.2"/>
  <text x="295" y="35" fill="#94a3b8" font-size="10.5" font-weight="700">Medio de Transporte</text>

  <rect x="293" y="48" width="129" height="48" rx="4" fill="#1e293b"/>
  <text x="301" y="66" fill="#38bdf8" font-size="8.5" font-weight="600">Internet / VPN / DX</text>
  <text x="301" y="79" fill="#94a3b8" font-size="7.5">Caché local en disco</text>
  <text x="301" y="90" fill="#cbd5e1" font-size="7.5">Sincronización continua</text>

  <rect x="293" y="104" width="129" height="48" rx="4" fill="#1e293b"/>
  <text x="301" y="122" fill="#34d399" font-size="8.5" font-weight="600">Protocolo DataSync</text>
  <text x="301" y="135" fill="#94a3b8" font-size="7.5">Cifrado TLS en vuelo</text>
  <text x="301" y="146" fill="#cbd5e1" font-size="7.5">Chequeo de integridad</text>

  <rect x="293" y="160" width="129" height="54" rx="4" fill="#1e293b"/>
  <text x="301" y="177" fill="#fbbf24" font-size="8.5" font-weight="600">Envío Físico (UPS)</text>
  <text x="301" y="191" fill="#94a3b8" font-size="7.5">Dispositivo blindado</text>
  <text x="301" y="203" fill="#cbd5e1" font-size="7.5">Cifrado 256-bit KMS</text>

  <line x1="430" y1="72" x2="480" y2="72" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow-migr-cyan)"/>
  <line x1="430" y1="128" x2="480" y2="128" stroke="#34d399" stroke-width="1.5" marker-end="url(#arrow-migr-cyan)"/>
  <line x1="430" y1="187" x2="480" y2="187" stroke="#fbbf24" stroke-width="1.5" marker-end="url(#arrow-migr-amber)"/>

  <rect x="485" y="15" width="180" height="210" rx="8" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>
  <text x="495" y="35" fill="#818cf8" font-size="11" font-weight="700">Destino AWS Cloud</text>

  <rect x="495" y="48" width="160" height="48" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="503" y="66" fill="#38bdf8" font-size="9.5" font-weight="700">Amazon S3 &amp; EBS</text>
  <text x="503" y="79" fill="#cbd5e1" font-size="8">Acceso nativo a objetos</text>
  <text x="503" y="90" fill="#94a3b8" font-size="7.5">Snapshots directos a EBS</text>

  <rect x="495" y="104" width="160" height="48" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="503" y="122" fill="#34d399" font-size="9.5" font-weight="700">S3 / EFS / FSx</text>
  <text x="503" y="135" fill="#cbd5e1" font-size="8">Migración masiva programada</text>
  <text x="503" y="146" fill="#94a3b8" font-size="7.5">Preserva metadatos POSIX</text>

  <rect x="495" y="160" width="160" height="54" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="503" y="177" fill="#fbbf24" font-size="9.5" font-weight="700">S3 Data Lake Ingestion</text>
  <text x="503" y="191" fill="#cbd5e1" font-size="8">Carga directa a buckets S3</text>
  <text x="503" y="203" fill="#34d399" font-size="7.5">Snowball Edge Compute (EC2)</text>
</svg>`,
    caption: '`AWS Storage Gateway` entrega acceso híbrido local (SMB/NFS/iSCSI) respaldado por `S3`. `AWS DataSync` acelera transferencias online por red hasta 10x y `Snowball Edge` traslada petabytes físicamente.',
    captionEn: '`AWS Storage Gateway` bridges on-prem workloads with `S3` via SMB/NFS/iSCSI. `AWS DataSync` accelerates online network transfers up to 10x, and `Snowball Edge` physically migrates petabytes.'
  };

  // 9. Disaster Recovery Strategies Spectrum & Route 53 DNS Failover
  var VISUAL_DISASTER_RECOVERY = {
    badge: 'Disaster Recovery & Route 53',
    title: 'Estrategias de Disaster Recovery (RPO / RTO) y DNS Failover con Route 53',
    titleEn: 'Disaster Recovery Strategies (RPO / RTO) & Route 53 DNS Failover',
    svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow-dr-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 6 3, 0 6" fill="#f87171"/>
    </marker>
    <marker id="arrow-dr-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 6 3, 0 6" fill="#34d399"/>
    </marker>
  </defs>

  <rect x="15" y="15" width="650" height="98" rx="8" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>
  <text x="25" y="32" fill="#818cf8" font-size="10.5" font-weight="700">Espectro de Recuperación ante Desastres (DR): Coste vs Tiempo de Recuperación</text>

  <rect x="25" y="42" width="145" height="62" rx="4" fill="#1e293b" stroke="#334155"/>
  <text x="32" y="58" fill="#38bdf8" font-size="9.5" font-weight="700">1. Backup &amp; Restore</text>
  <text x="32" y="71" fill="#94a3b8" font-size="8">RPO: Horas · RTO: 24h+</text>
  <text x="32" y="84" fill="#34d399" font-size="7.5">Coste: $ (Mínimo)</text>
  <text x="32" y="96" fill="#cbd5e1" font-size="7.5">Copias periódicas S3/Glacier</text>

  <rect x="180" y="42" width="150" height="62" rx="4" fill="#1e293b" stroke="#334155"/>
  <text x="187" y="58" fill="#fbbf24" font-size="9.5" font-weight="700">2. Pilot Light</text>
  <text x="187" y="71" fill="#cbd5e1" font-size="8">RPO: Minutos · RTO: Horas</text>
  <text x="187" y="84" fill="#fbbf24" font-size="7.5">Coste: $$</text>
  <text x="187" y="96" fill="#94a3b8" font-size="7.5">Base de datos replicada, app off</text>

  <rect x="340" y="42" width="155" height="62" rx="4" fill="#1e293b" stroke="#334155"/>
  <text x="347" y="58" fill="#fb923c" font-size="9.5" font-weight="700">3. Warm Standby</text>
  <text x="347" y="71" fill="#cbd5e1" font-size="8">RPO: Segundos · RTO: Minutos</text>
  <text x="347" y="84" fill="#f97316" font-size="7.5">Coste: $$$</text>
  <text x="347" y="96" fill="#94a3b8" font-size="7.5">Flota mínima siempre activa en DR</text>

  <rect x="505" y="42" width="150" height="62" rx="4" fill="#2d1217" stroke="#f87171"/>
  <text x="512" y="58" fill="#fca5a5" font-size="9.5" font-weight="700">4. Multi-Site Active-Active</text>
  <text x="512" y="71" fill="#fca5a5" font-size="8">RPO: ~0 · RTO: Cero / Segundos</text>
  <text x="512" y="84" fill="#f87171" font-size="7.5">Coste: $$$$ (Máximo)</text>
  <text x="512" y="96" fill="#cbd5e1" font-size="7.5">Tráfico balanceado continuo</text>

  <rect x="15" y="122" width="650" height="106" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
  <text x="25" y="139" fill="#38bdf8" font-size="10.5" font-weight="700">Route 53 DNS Failover Routing con Health Checks</text>

  <rect x="25" y="150" width="115" height="65" rx="5" fill="#1e293b" stroke="#94a3b8"/>
  <text x="33" y="169" fill="#f8fafc" font-size="9.5" font-weight="700">DNS Client</text>
  <text x="33" y="184" fill="#38bdf8" font-size="8.5">app.empresa.com</text>
  <text x="33" y="198" fill="#94a3b8" font-size="8">Route 53 Query</text>

  <line x1="140" y1="182" x2="190" y2="182" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow-dr-green)"/>

  <rect x="195" y="150" width="150" height="65" rx="5" fill="#1e1b4b" stroke="#818cf8"/>
  <text x="205" y="168" fill="#c7d2fe" font-size="10" font-weight="700">Route 53 Resolver</text>
  <text x="205" y="182" fill="#34d399" font-size="8">Failover Routing Policy</text>
  <text x="205" y="195" fill="#94a3b8" font-size="7.5">Health Check: 3 failures</text>
  <text x="205" y="206" fill="#fbbf24" font-size="7.5">Evalúa Target Health</text>

  <rect x="390" y="145" width="125" height="35" rx="4" fill="#3b151e" stroke="#f87171"/>
  <text x="398" y="159" fill="#fca5a5" font-size="9" font-weight="700">Región A (Primaria)</text>
  <text x="398" y="172" fill="#f87171" font-size="8">✕ Health Check Unhealthy</text>

  <rect x="390" y="185" width="125" height="38" rx="4" fill="#064e3b" stroke="#34d399"/>
  <text x="398" y="199" fill="#34d399" font-size="9" font-weight="700">Región B (Secundaria)</text>
  <text x="398" y="212" fill="#a7f3d0" font-size="8">✓ Conmutación DNS activa</text>

  <line x1="345" y1="170" x2="385" y2="162" stroke="#f87171" stroke-width="1.5" stroke-dasharray="3 3"/>
  <line x1="345" y1="190" x2="385" y2="200" stroke="#34d399" stroke-width="2" marker-end="url(#arrow-dr-green)"/>

  <rect x="530" y="145" width="125" height="78" rx="4" fill="#1e293b" stroke="#334155"/>
  <text x="536" y="162" fill="#38bdf8" font-size="8.5" font-weight="700">TTL y Failover</text>
  <text x="536" y="175" fill="#cbd5e1" font-size="7.5">Bajar TTL a 60 seg.</text>
  <text x="536" y="188" fill="#94a3b8" font-size="7.5">Failover automático</text>
  <text x="536" y="201" fill="#34d399" font-size="7.5">Sin intervención manual</text>
  <text x="536" y="213" fill="#cbd5e1" font-size="7.5">RTO de segundos</text>
</svg>`,
    caption: 'De menor a mayor velocidad: `Backup & Restore` → `Pilot Light` → `Warm Standby` → `Multi-Site Active-Active`. En modo Active-Passive, `Route 53` conmuta automáticamente ante fallos del Health Check.',
    captionEn: 'DR spectrum: `Backup & Restore` → `Pilot Light` → `Warm Standby` → `Multi-Site Active-Active`. Under Active-Passive failover, `Route 53` switches traffic instantly upon unhealthy checks.'
  };

  // 10. Amazon DynamoDB: Partitions, Sort Keys & DAX In-Memory Cache
  var VISUAL_DYNAMODB_DAX = {
    badge: 'DynamoDB & DAX In-Memory',
    title: 'Amazon DynamoDB: Claves de Partición, Prevención de Hot Spots y Caché DAX',
    titleEn: 'Amazon DynamoDB: Partition Keys, Hot Spot Mitigation & DAX Caching',
    svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow-dyn-cyan" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 6 3, 0 6" fill="#38bdf8"/>
    </marker>
    <marker id="arrow-dyn-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 6 3, 0 6" fill="#34d399"/>
    </marker>
  </defs>

  <rect x="15" y="15" width="315" height="210" rx="8" fill="#0f172a" stroke="#f97316" stroke-width="1.2"/>
  <text x="25" y="34" fill="#f97316" font-size="11" font-weight="700">Arquitectura de Particionado en DynamoDB</text>

  <rect x="25" y="44" width="295" height="34" rx="4" fill="#1e293b" stroke="#334155"/>
  <text x="35" y="58" fill="#38bdf8" font-size="9" font-weight="700">Primary Key = Partition Key (Hash) [+ Sort Key (Range)]</text>
  <text x="35" y="70" fill="#94a3b8" font-size="8">Función Hash interna asigna el ítem a una partición SSD física</text>

  <rect x="25" y="86" width="90" height="60" rx="4" fill="#1e293b" stroke="#38bdf8"/>
  <text x="32" y="103" fill="#38bdf8" font-size="9" font-weight="700">Partición 1</text>
  <text x="32" y="117" fill="#cbd5e1" font-size="7.5">Users A-H</text>
  <text x="32" y="130" fill="#34d399" font-size="7.5">1.000 WCU / 3.000 RCU</text>
  <text x="32" y="141" fill="#94a3b8" font-size="7">Max 10 GB</text>

  <rect x="127" y="86" width="90" height="60" rx="4" fill="#1e293b" stroke="#38bdf8"/>
  <text x="134" y="103" fill="#38bdf8" font-size="9" font-weight="700">Partición 2</text>
  <text x="134" y="117" fill="#cbd5e1" font-size="7.5">Users I-P</text>
  <text x="134" y="130" fill="#34d399" font-size="7.5">1.000 WCU / 3.000 RCU</text>
  <text x="134" y="141" fill="#94a3b8" font-size="7">Max 10 GB</text>

  <rect x="230" y="86" width="90" height="60" rx="4" fill="#1e293b" stroke="#38bdf8"/>
  <text x="237" y="103" fill="#38bdf8" font-size="9" font-weight="700">Partición 3</text>
  <text x="237" y="117" fill="#cbd5e1" font-size="7.5">Users Q-Z</text>
  <text x="237" y="130" fill="#34d399" font-size="7.5">1.000 WCU / 3.000 RCU</text>
  <text x="237" y="141" fill="#94a3b8" font-size="7">Max 10 GB</text>

  <rect x="25" y="152" width="295" height="65" rx="4" fill="#2d150b" stroke="#f97316"/>
  <text x="33" y="169" fill="#fca5a5" font-size="9" font-weight="700">Solución a Hot Partitions (Throttling 400):</text>
  <text x="33" y="183" fill="#cbd5e1" font-size="8">• Usa claves con alta cardinalidad (User_ID, UUID aleatorio).</text>
  <text x="33" y="196" fill="#cbd5e1" font-size="8">• Añade prefijos/sufijos con hash o timestamp ("salting").</text>
  <text x="33" y="209" fill="#34d399" font-size="8">• Despliega DAX para absorber ráfagas masivas de lectura.</text>

  <rect x="345" y="15" width="320" height="210" rx="8" fill="#0f172a" stroke="#34d399" stroke-width="1.2"/>
  <text x="355" y="34" fill="#34d399" font-size="11" font-weight="700">Amazon DAX (DynamoDB Accelerator)</text>

  <rect x="355" y="48" width="95" height="52" rx="5" fill="#1e293b" stroke="#94a3b8"/>
  <text x="363" y="68" fill="#f8fafc" font-size="10" font-weight="700">App Client</text>
  <text x="363" y="83" fill="#94a3b8" font-size="8">DAX SDK Nativo</text>
  <text x="363" y="94" fill="#cbd5e1" font-size="7.5">Compatible con API</text>

  <rect x="480" y="48" width="175" height="80" rx="6" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
  <text x="490" y="68" fill="#a7f3d0" font-size="10.5" font-weight="800">DAX In-Memory Cluster</text>
  <text x="490" y="84" fill="#ecfdf5" font-size="9" font-weight="700">Latencia de microsegundos (&lt; 1 ms)</text>
  <text x="490" y="99" fill="#6ee7b7" font-size="8">Item Cache + Query Cache</text>
  <text x="490" y="112" fill="#d1fae5" font-size="7.5">Caché read-through / write-through</text>

  <line x1="450" y1="74" x2="475" y2="74" stroke="#34d399" stroke-width="2" marker-end="url(#arrow-dyn-green)"/>
  <text x="453" y="66" fill="#34d399" font-size="7.5">Read</text>

  <rect x="355" y="145" width="300" height="70" rx="6" fill="#1e1b4b" stroke="#818cf8"/>
  <text x="365" y="165" fill="#c7d2fe" font-size="10" font-weight="700">DynamoDB Table (Almacenamiento Persistente)</text>
  <text x="365" y="180" fill="#cbd5e1" font-size="8.5">Latencia de milisegundos de un solo dígito (~5-10 ms)</text>
  <text x="365" y="195" fill="#94a3b8" font-size="8">Si hay Cache Miss en DAX, recupera de la tabla y puebla la memoria.</text>
  <text x="365" y="208" fill="#38bdf8" font-size="8">Reduce el consumo de RCUs hasta en 10x ante lecturas repetitivas.</text>

  <path d="M 567 128 L 567 142" fill="none" stroke="#818cf8" stroke-width="1.5" marker-end="url(#arrow-dyn-cyan)"/>
  <text x="573" y="137" fill="#818cf8" font-size="7.5">Cache Miss</text>
</svg>`,
    caption: '`DynamoDB` distribuye datos por el Hash del Partition Key. Para evitar `Hot Partitions` se aplican claves de alta cardinalidad. `DAX` provee caché en memoria bajando la latencia de milisegundos a microsegundos.',
    captionEn: '`DynamoDB` distributes data via Partition Key hashes. High-cardinality keys avoid hot partition throttling. `DAX` adds an in-memory cache dropping latency from milliseconds to microseconds.'
  };

  // 11. Perimeter Defense: WAF, Shield, GuardDuty & CloudHSM
  var VISUAL_PERIMETER_DEFENSE = {
    badge: 'Perimeter & Threat Intelligence',
    title: 'AWS Perimeter Defense: WAF, Shield Advanced, GuardDuty y CloudHSM',
    titleEn: 'AWS Perimeter Defense: WAF, Shield Advanced, GuardDuty & CloudHSM',
    svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <rect x="15" y="15" width="205" height="210" rx="8" fill="#0f172a" stroke="#f87171" stroke-width="1.2"/>
  <text x="25" y="34" fill="#f87171" font-size="11" font-weight="700">1. Filtrado de Entrada (L7 / L3-4)</text>

  <rect x="25" y="46" width="185" height="52" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="33" y="64" fill="#fca5a5" font-size="10" font-weight="700">AWS WAF (Layer 7)</text>
  <text x="33" y="78" fill="#cbd5e1" font-size="8">Bloquea SQLi, XSS y Bot Spiders</text>
  <text x="33" y="90" fill="#94a3b8" font-size="7.5">Managed Rules en CloudFront/ALB</text>

  <rect x="25" y="104" width="185" height="52" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="33" y="122" fill="#fb923c" font-size="10" font-weight="700">AWS Shield (DDoS)</text>
  <text x="33" y="136" fill="#cbd5e1" font-size="8">Standard: Gratis en L3/L4 (SYN floods)</text>
  <text x="33" y="148" fill="#fbbf24" font-size="7.5">Advanced: 24/7 SRT + Cost Protection</text>

  <rect x="25" y="162" width="185" height="53" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="33" y="179" fill="#38bdf8" font-size="9" font-weight="700">Security Groups vs NACL</text>
  <text x="33" y="193" fill="#94a3b8" font-size="8">SG: Stateful a nivel instancia EC2</text>
  <text x="33" y="205" fill="#cbd5e1" font-size="7.5">NACL: Stateless a nivel subred (Deny CIDR)</text>

  <rect x="235" y="15" width="205" height="210" rx="8" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>
  <text x="245" y="34" fill="#818cf8" font-size="11" font-weight="700">2. Detección Inteligente (ML)</text>

  <rect x="245" y="46" width="185" height="108" rx="5" fill="#1e1b4b" stroke="#818cf8" stroke-width="1.2"/>
  <text x="255" y="66" fill="#c7d2fe" font-size="10.5" font-weight="700">Amazon GuardDuty</text>
  <text x="255" y="82" fill="#34d399" font-size="8">Análisis de Amenazas Sin Agentes:</text>
  <text x="255" y="96" fill="#cbd5e1" font-size="7.5">• VPC Flow Logs (IPs maliciosas / C&amp;C)</text>
  <text x="255" y="108" fill="#cbd5e1" font-size="7.5">• DNS Query Logs (Exfiltración de datos)</text>
  <text x="255" y="120" fill="#cbd5e1" font-size="7.5">• AWS CloudTrail Events &amp; S3 Logs</text>
  <text x="255" y="134" fill="#fca5a5" font-size="8">Detección de minería crypto y accesos raros</text>

  <rect x="245" y="162" width="185" height="53" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="255" y="179" fill="#38bdf8" font-size="9.5" font-weight="700">Security Hub &amp; Detective</text>
  <text x="255" y="193" fill="#cbd5e1" font-size="8">Agrega hallazgos CIS y PCI-DSS</text>
  <text x="255" y="205" fill="#94a3b8" font-size="7.5">Análisis forense de causas raíz</text>

  <rect x="455" y="15" width="210" height="210" rx="8" fill="#0f172a" stroke="#34d399" stroke-width="1.2"/>
  <text x="465" y="34" fill="#34d399" font-size="11" font-weight="700">3. Hardware Criptográfico (HSM)</text>

  <rect x="465" y="46" width="190" height="74" rx="5" fill="#1e293b" stroke="#38bdf8"/>
  <text x="475" y="65" fill="#38bdf8" font-size="10" font-weight="700">AWS KMS (Multi-Tenant)</text>
  <text x="475" y="79" fill="#94a3b8" font-size="8">Gestionado totalmente por AWS</text>
  <text x="475" y="92" fill="#cbd5e1" font-size="8">Customer Managed Keys (CMK)</text>
  <text x="475" y="105" fill="#a7f3d0" font-size="7.5">Rotación anual · FIPS 140-2 Nivel 2/3</text>

  <rect x="465" y="126" width="190" height="88" rx="5" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
  <text x="475" y="145" fill="#34d399" font-size="10" font-weight="800">AWS CloudHSM (Single-Tenant)</text>
  <text x="475" y="161" fill="#ecfdf5" font-size="8.5">Hardware HSM Dedicado y Exclusivo</text>
  <text x="475" y="175" fill="#f8fafc" font-size="8">AWS NO TIENE ACCESO a las llaves</text>
  <text x="475" y="189" fill="#a7f3d0" font-size="7.5">Control criptográfico exclusivo del cliente</text>
  <text x="475" y="202" fill="#fbbf24" font-size="7.5">Cumple FIPS 140-2 Nivel 3 obligatorio</text>
</svg>`,
    caption: '`AWS WAF` bloquea ataques web en L7, `Shield` mitiga DDoS, `GuardDuty` analiza sin agentes los flujos de VPC/DNS y `CloudHSM` proporciona hardware criptográfico dedicado single-tenant bajo control exclusivo.',
    captionEn: '`AWS WAF` filters L7 exploits, `Shield` mitigates DDoS, `GuardDuty` performs agentless ML analysis over VPC/DNS logs, and `CloudHSM` delivers dedicated single-tenant hardware with exclusive customer control.'
  };

  // 12. EC2 High Performance & Network Acceleration: Placement Groups & EFA
  var VISUAL_HPC_PLACEMENT = {
    badge: 'High Performance Compute & EFA',
    title: 'EC2 Placement Groups (Cluster vs Spread) y Aceleración de Red con EFA',
    titleEn: 'EC2 Placement Groups (Cluster vs Spread) & Network Acceleration with EFA',
    svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <rect x="15" y="15" width="205" height="110" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
  <text x="25" y="34" fill="#38bdf8" font-size="10.5" font-weight="700">Cluster Placement Group</text>
  <rect x="25" y="44" width="185" height="42" rx="4" fill="#132338" stroke="#38bdf8" stroke-dasharray="3 3"/>
  <text x="33" y="60" fill="#f8fafc" font-size="8.5" font-weight="600">Mismo Rack Físico en 1 AZ</text>
  <text x="33" y="73" fill="#34d399" font-size="8">Latencia mínima · Hasta 100 Gbps</text>
  <text x="25" y="102" fill="#94a3b8" font-size="7.5">Ideal para: HPC, MPI y machine learning</text>
  <text x="25" y="114" fill="#fbbf24" font-size="7.5">Riesgo: Caída de rack afecta al cluster</text>

  <rect x="235" y="15" width="205" height="110" rx="8" fill="#0f172a" stroke="#34d399" stroke-width="1.2"/>
  <text x="245" y="34" fill="#34d399" font-size="10.5" font-weight="700">Spread Placement Group</text>
  <rect x="245" y="44" width="185" height="42" rx="4" fill="#064e3b" stroke="#34d399" stroke-dasharray="3 3"/>
  <text x="253" y="60" fill="#f8fafc" font-size="8.5" font-weight="600">Racks y Fuentes de Poder Aisladas</text>
  <text x="253" y="73" fill="#34d399" font-size="8">Máx. 7 instancias por AZ</text>
  <text x="245" y="102" fill="#94a3b8" font-size="7.5">Ideal para: Workloads críticos de alta resiliencia</text>
  <text x="245" y="114" fill="#a7f3d0" font-size="7.5">Beneficio: Falla de hardware no propaga caída</text>

  <rect x="455" y="15" width="210" height="110" rx="8" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>
  <text x="465" y="34" fill="#818cf8" font-size="10.5" font-weight="700">Partition Placement Group</text>
  <rect x="465" y="44" width="190" height="42" rx="4" fill="#1e1b4b" stroke="#818cf8" stroke-dasharray="3 3"/>
  <text x="473" y="60" fill="#f8fafc" font-size="8.5" font-weight="600">Particiones Lógicas de Hardware</text>
  <text x="473" y="73" fill="#cbd5e1" font-size="8">Cientos de instancias aisladas</text>
  <text x="465" y="102" fill="#94a3b8" font-size="7.5">Ideal para: Hadoop, Cassandra y Kafka</text>
  <text x="465" y="114" fill="#818cf8" font-size="7.5">Particiones no comparten racks entre sí</text>

  <rect x="15" y="132" width="650" height="95" rx="8" fill="#0f172a" stroke="#64748b" stroke-width="1.2"/>
  <text x="25" y="150" fill="#f8fafc" font-size="10.5" font-weight="700">Pila de Red: Elastic Network Adapter (ENA) vs Elastic Fabric Adapter (EFA)</text>

  <rect x="25" y="158" width="305" height="60" rx="5" fill="#1e293b" stroke="#38bdf8"/>
  <text x="35" y="174" fill="#38bdf8" font-size="9.5" font-weight="700">ENA (Elastic Network Adapter)</text>
  <text x="35" y="188" fill="#cbd5e1" font-size="8">• Pasa por el stack de red y kernel TCP/IP de Linux</text>
  <text x="35" y="200" fill="#94a3b8" font-size="8">• Adecuado para aplicaciones estándar y web (hasta 100 Gbps)</text>
  <text x="35" y="211" fill="#f87171" font-size="7.5">• Añade sobrecarga de interrupciones de sistema operativo</text>

  <rect x="345" y="158" width="310" height="60" rx="5" fill="#1e1b4b" stroke="#818cf8" stroke-width="1.2"/>
  <text x="355" y="174" fill="#818cf8" font-size="9.5" font-weight="700">EFA (Elastic Fabric Adapter - OS Bypass)</text>
  <text x="355" y="188" fill="#a7f3d0" font-size="8">• Bypass del kernel Linux usando Libfabric / MPI</text>
  <text x="355" y="200" fill="#f8fafc" font-size="8">• Latencia ultra-baja y jitter casi cero entre nodos GPU/CPU</text>
  <text x="355" y="211" fill="#38bdf8" font-size="7.5">• Requerido para ML distribuido masivo y dinámica molecular</text>
</svg>`,
    caption: '`Cluster Placement Groups` empaquetan instancias en el mismo rack para baja latencia. `EFA` permite hacer bypass del kernel Linux para comunicación MPI ultrarrápida en trabajos de Machine Learning.',
    captionEn: '`Cluster Placement Groups` co-locate instances in the same rack for minimum latency. `EFA` bypasses the Linux kernel for ultra-fast MPI communication in distributed ML jobs.'
  };

  // 13. Serverless & Cost Optimization Automation: Compute Optimizer & Scheduler
  var VISUAL_COST_AUTOMATION = {
    badge: 'Cost Optimization & Automation',
    title: 'Automatización de Costes: Compute Optimizer, EventBridge Scheduler y Aurora Serverless',
    titleEn: 'Cost Optimization & Automation: Compute Optimizer, EventBridge & Aurora Serverless',
    svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <rect x="15" y="15" width="205" height="210" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
  <text x="25" y="34" fill="#38bdf8" font-size="10.5" font-weight="700">AWS Compute Optimizer</text>

  <rect x="25" y="46" width="185" height="50" rx="4" fill="#1e293b" stroke="#334155"/>
  <text x="33" y="64" fill="#f8fafc" font-size="9.5" font-weight="600">Análisis con Machine Learning</text>
  <text x="33" y="78" fill="#cbd5e1" font-size="8">Histórico 14+ días de CloudWatch</text>
  <text x="33" y="89" fill="#94a3b8" font-size="7.5">CPU, Memoria, Disco IOPS y Red</text>

  <rect x="25" y="102" width="185" height="50" rx="4" fill="#132338" stroke="#38bdf8"/>
  <text x="33" y="119" fill="#38bdf8" font-size="9" font-weight="700">Rightsizing Específico</text>
  <text x="33" y="132" fill="#cbd5e1" font-size="8">Detecta instancias sobre-dimensionadas</text>
  <text x="33" y="144" fill="#34d399" font-size="7.5">Recomienda cambio (ej. m5.2xlarge -> m6g.xlarge)</text>

  <rect x="25" y="158" width="185" height="57" rx="4" fill="#1e293b" stroke="#334155"/>
  <text x="33" y="175" fill="#f8fafc" font-size="8.5" font-weight="600">Soporta:</text>
  <text x="33" y="188" fill="#cbd5e1" font-size="8">• EC2 Instances &amp; Auto Scaling</text>
  <text x="33" y="200" fill="#cbd5e1" font-size="8">• EBS Volumes &amp; Funciones Lambda</text>
  <text x="33" y="210" fill="#94a3b8" font-size="7">Ahorro medio: 25% a 40% del coste mensual</text>

  <rect x="235" y="15" width="205" height="210" rx="8" fill="#0f172a" stroke="#34d399" stroke-width="1.2"/>
  <text x="245" y="34" fill="#34d399" font-size="10.5" font-weight="700">Horarios Dev / Test (SSM / Cron)</text>

  <rect x="245" y="46" width="185" height="48" rx="4" fill="#1e293b" stroke="#334155"/>
  <text x="253" y="64" fill="#34d399" font-size="9.5" font-weight="700">EventBridge Scheduler</text>
  <text x="253" y="78" fill="#cbd5e1" font-size="8">Cron: L-V 8 AM (Start) / 6 PM (Stop)</text>
  <text x="253" y="89" fill="#94a3b8" font-size="7.5">Dispara función Lambda o AWS Systems Mgr</text>

  <rect x="245" y="100" width="185" height="50" rx="4" fill="#064e3b" stroke="#34d399"/>
  <text x="253" y="118" fill="#a7f3d0" font-size="9.5" font-weight="700">¡Ahorro de hasta un 70%!</text>
  <text x="253" y="132" fill="#ecfdf5" font-size="8">168 horas semanales 24/7 -> 50h de uso</text>
  <text x="253" y="143" fill="#cbd5e1" font-size="7.5">No pagas cómputo durante noches ni findes</text>

  <rect x="245" y="158" width="185" height="57" rx="4" fill="#1e293b" stroke="#334155"/>
  <text x="253" y="175" fill="#fbbf24" font-size="8.5" font-weight="600">Consideraciones:</text>
  <text x="253" y="188" fill="#cbd5e1" font-size="8">• El disco EBS sigue facturándose</text>
  <text x="253" y="200" fill="#cbd5e1" font-size="8">• La IP pública dinámica cambia al iniciar</text>
  <text x="253" y="210" fill="#94a3b8" font-size="7">Usa Elastic IP o DNS si se requiere IP fija</text>

  <rect x="455" y="15" width="210" height="210" rx="8" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>
  <text x="465" y="34" fill="#818cf8" font-size="10.5" font-weight="700">Aurora Serverless v1 vs v2</text>

  <rect x="465" y="46" width="190" height="74" rx="4" fill="#1e1b4b" stroke="#818cf8"/>
  <text x="473" y="64" fill="#c7d2fe" font-size="9.5" font-weight="700">Serverless v1 (Auto-Pause a 0)</text>
  <text x="473" y="78" fill="#34d399" font-size="8">Pausa a 0 ACU si no hay conexiones</text>
  <text x="473" y="90" fill="#cbd5e1" font-size="8">Ideal para Dev/Test de 4h al día</text>
  <text x="473" y="103" fill="#fbbf24" font-size="7.5">Warm-up de 30 segundos al reactivarse</text>

  <rect x="465" y="126" width="190" height="89" rx="4" fill="#1e293b" stroke="#38bdf8"/>
  <text x="473" y="144" fill="#38bdf8" font-size="9.5" font-weight="700">Serverless v2 (Producción)</text>
  <text x="473" y="158" fill="#a7f3d0" font-size="8">Escala instantánea en incrementos 0.5 ACU</text>
  <text x="473" y="171" fill="#cbd5e1" font-size="8">Mínimo 0.5 ACU (no pausa totalmente)</text>
  <text x="473" y="184" fill="#cbd5e1" font-size="8">Multi-AZ y Read Replicas completas</text>
  <text x="473" y="198" fill="#94a3b8" font-size="7.5">Para producción con picos imprevistos</text>
</svg>`,
    caption: '`AWS Compute Optimizer` analiza métricas de CloudWatch con ML para sugerir rightsizing. `EventBridge Scheduler` apaga instancias dev fuera de horario y `Aurora Serverless v1` se pausa a 0 en inactividad.',
    captionEn: '`AWS Compute Optimizer` uses ML on CloudWatch data to prescribe rightsizing. `EventBridge Scheduler` stops dev machines off-hours, and `Aurora Serverless v1` auto-pauses compute to zero when idle.'
  };

  // 14. AWS Well-Architected Framework: 6 Pillars (Global Fallback)
  var VISUAL_WELL_ARCHITECTED = {
    badge: 'AWS Well-Architected Framework',
    title: 'AWS Well-Architected Framework: Los 6 Pilares de la Arquitectura Cloud',
    titleEn: 'AWS Well-Architected Framework: The 6 Pillars of Cloud Architecture',
    svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <rect x="15" y="15" width="650" height="210" rx="10" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>
  <text x="30" y="36" fill="#818cf8" font-size="12" font-weight="700">Los 6 Pilares de AWS Well-Architected Framework</text>

  <rect x="25" y="50" width="195" height="74" rx="5" fill="#1e293b" stroke="#f87171"/>
  <text x="35" y="68" fill="#fca5a5" font-size="10" font-weight="700">1. Seguridad (Security)</text>
  <text x="35" y="82" fill="#cbd5e1" font-size="8">Principio de menor privilegio (IAM)</text>
  <text x="35" y="94" fill="#94a3b8" font-size="7.5">Cifrado en tránsito y en reposo (KMS)</text>
  <text x="35" y="106" fill="#a7f3d0" font-size="7.5">Trazabilidad completa con CloudTrail</text>

  <rect x="235" y="50" width="195" height="74" rx="5" fill="#1e293b" stroke="#38bdf8"/>
  <text x="245" y="68" fill="#38bdf8" font-size="10" font-weight="700">2. Fiabilidad (Reliability)</text>
  <text x="245" y="82" fill="#cbd5e1" font-size="8">Diseño para el fallo (Multi-AZ / Multi-Region)</text>
  <text x="245" y="94" fill="#94a3b8" font-size="7.5">Desacoplamiento con colas SQS/SNS</text>
  <text x="245" y="106" fill="#38bdf8" font-size="7.5">Recuperación automática de fallos</text>

  <rect x="445" y="50" width="205" height="74" rx="5" fill="#1e293b" stroke="#34d399"/>
  <text x="455" y="68" fill="#34d399" font-size="10" font-weight="700">3. Rendimiento (Performance)</text>
  <text x="455" y="82" fill="#cbd5e1" font-size="8">Selección de tecnologías adecuadas</text>
  <text x="455" y="94" fill="#94a3b8" font-size="7.5">Caché con ElastiCache, DAX y CloudFront</text>
  <text x="455" y="106" fill="#a7f3d0" font-size="7.5">Almacenamiento por IOPS y latencia</text>

  <rect x="25" y="134" width="195" height="78" rx="5" fill="#1e293b" stroke="#fbbf24"/>
  <text x="35" y="152" fill="#fbbf24" font-size="10" font-weight="700">4. Costes (Cost Optimization)</text>
  <text x="35" y="166" fill="#cbd5e1" font-size="8">Adopta modelos de consumo flexibles</text>
  <text x="35" y="178" fill="#94a3b8" font-size="7.5">Savings Plans, Spot y Serverless</text>
  <text x="35" y="190" fill="#fbbf24" font-size="7.5">S3 Lifecycle a Glacier Deep Archive</text>
  <text x="35" y="201" fill="#cbd5e1" font-size="7">Compute Optimizer para rightsizing</text>

  <rect x="235" y="134" width="195" height="78" rx="5" fill="#1e293b" stroke="#818cf8"/>
  <text x="245" y="152" fill="#818cf8" font-size="10" font-weight="700">5. Excelencia Operativa</text>
  <text x="245" y="166" fill="#cbd5e1" font-size="8">Infraestructura como código (CloudFormation)</text>
  <text x="245" y="178" fill="#94a3b8" font-size="7.5">Métricas y alarmas en CloudWatch</text>
  <text x="245" y="190" fill="#c7d2fe" font-size="7.5">Automatización de cambios continuos</text>
  <text x="245" y="201" fill="#cbd5e1" font-size="7">Aprende de todos los incidentes</text>

  <rect x="445" y="134" width="205" height="78" rx="5" fill="#1e293b" stroke="#22c55e"/>
  <text x="455" y="152" fill="#22c55e" font-size="10" font-weight="700">6. Sostenibilidad (Sustainability)</text>
  <text x="455" y="166" fill="#cbd5e1" font-size="8">Maximiza la utilización del hardware</text>
  <text x="455" y="178" fill="#94a3b8" font-size="7.5">Migra a procesadores AWS Graviton (ARM)</text>
  <text x="455" y="190" fill="#86efac" font-size="7.5">Retira recursos ociosos o sin uso</text>
  <text x="455" y="201" fill="#cbd5e1" font-size="7">Reduce la huella de carbono global</text>
</svg>`,
    caption: 'El `AWS Well-Architected Framework` define las directrices esenciales para diseñar soluciones resilientes, seguras, de alto rendimiento y optimizadas en costos sobre la nube.',
    captionEn: 'The `AWS Well-Architected Framework` establishes the foundational design principles across security, reliability, performance, cost optimization, operational excellence, and sustainability.'
  };

  /* -------------------------------------------------------------------------
     PACK CONFIGURATION
     ------------------------------------------------------------------------- */
  window.EXAM_VISUALS['aws-saa-c03'] = {
    // Dedicated per-question mappings for absolute pedagogical precision
    questions: {
      'aws-001': VISUAL_IAM_SECURITY,
      'aws-002': VISUAL_IAM_SECURITY,
      'aws-003': VISUAL_IAM_SECURITY,
      'aws-004': VISUAL_IAM_SECURITY,
      'aws-005': VISUAL_IAM_SECURITY,
      'aws-006': VISUAL_PERIMETER_DEFENSE,
      'aws-007': VISUAL_PERIMETER_DEFENSE,
      'aws-008': VISUAL_VPC_ENDPOINTS,
      'aws-009': VISUAL_IAM_SECURITY,
      'aws-010': VISUAL_VPC_ENDPOINTS,
      'aws-011': VISUAL_IAM_SECURITY,
      'aws-012': VISUAL_PERIMETER_DEFENSE,
      'aws-013': VISUAL_DATABASE_HA,
      'aws-014': VISUAL_DECOUPLED_MSG,
      'aws-015': VISUAL_DISASTER_RECOVERY,
      'aws-016': VISUAL_EDGE_COMPUTE,
      'aws-017': VISUAL_DECOUPLED_MSG,
      'aws-018': VISUAL_DISASTER_RECOVERY,
      'aws-019': VISUAL_DATABASE_HA,
      'aws-020': VISUAL_EDGE_COMPUTE,
      'aws-021': VISUAL_DECOUPLED_MSG,
      'aws-022': VISUAL_DYNAMODB_DAX,
      'aws-023': VISUAL_EDGE_COMPUTE,
      'aws-024': VISUAL_STORAGE_TYPES,
      'aws-025': VISUAL_DATABASE_HA,
      'aws-026': VISUAL_EDGE_COMPUTE,
      'aws-027': VISUAL_DYNAMODB_DAX,
      'aws-028': VISUAL_DECOUPLED_MSG,
      'aws-029': VISUAL_STORAGE_TYPES,
      'aws-030': VISUAL_S3_WATERFALL,
      'aws-031': VISUAL_DYNAMODB_DAX,
      'aws-032': VISUAL_EDGE_COMPUTE,
      'aws-033': VISUAL_EDGE_COMPUTE,
      'aws-034': VISUAL_COST_AUTOMATION,
      'aws-035': VISUAL_S3_WATERFALL,
      'aws-036': VISUAL_VPC_ENDPOINTS,
      'aws-037': VISUAL_EDGE_COMPUTE,
      'aws-038': VISUAL_COST_AUTOMATION,
      'aws-039': VISUAL_COST_AUTOMATION,
      'aws-040': VISUAL_COST_AUTOMATION,
      'aws-041': VISUAL_IAM_SECURITY,
      'aws-042': VISUAL_DECOUPLED_MSG,
      'aws-043': VISUAL_HPC_PLACEMENT,
      'aws-044': VISUAL_COST_AUTOMATION
    },

    // Detailed topic overview visual cards
    topics: {
      'aws-t-1': {
        badge: 'Domain 1 · Security Architectures',
        title: 'Dominio 1: Arquitecturas Seguras (IAM, Perímetro WAF/Shield y Cifrado KMS)',
        titleEn: 'Domain 1: Secure Architectures (IAM, WAF/Shield Perimeter & KMS Encryption)',
        svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <rect x="15" y="15" width="205" height="210" rx="8" fill="#111c35" stroke="#38bdf8" stroke-width="1.2"/>
  <text x="25" y="36" fill="#38bdf8" font-size="11" font-weight="700">1. Identidad y Acceso (IAM)</text>
  <rect x="25" y="48" width="185" height="48" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="35" y="65" fill="#f8fafc" font-size="10" font-weight="700">IAM Roles &amp; Profiles</text>
  <text x="35" y="80" fill="#94a3b8" font-size="8.5">Sin credenciales estáticas en EC2/Lambda</text>
  <rect x="25" y="104" width="185" height="52" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="35" y="122" fill="#818cf8" font-size="10" font-weight="700">AssumeRole + ExternalId</text>
  <text x="35" y="136" fill="#cbd5e1" font-size="8">Acceso cross-account para auditorías</text>
  <text x="35" y="148" fill="#34d399" font-size="8">Previene Confused Deputy</text>
  <rect x="25" y="164" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="35" y="182" fill="#fbbf24" font-size="10" font-weight="700">Secrets Manager vs SSM</text>
  <text x="35" y="196" fill="#94a3b8" font-size="8">Rotación automática de RDS (SM)</text>
  <text x="35" y="207" fill="#cbd5e1" font-size="7.5">Parámetros jerárquicos clave-valor (SSM)</text>

  <rect x="235" y="15" width="210" height="210" rx="8" fill="#18132d" stroke="#c084fc" stroke-width="1.2"/>
  <text x="245" y="36" fill="#c084fc" font-size="11" font-weight="700">2. Perímetro y Protección</text>
  <rect x="245" y="48" width="190" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="255" y="66" fill="#f87171" font-size="10" font-weight="700">AWS WAF (Layer 7)</text>
  <text x="255" y="80" fill="#cbd5e1" font-size="8">Filtra SQLi, XSS, rate-limiting HTTP</text>
  <text x="255" y="91" fill="#94a3b8" font-size="7.5">Asociado a CloudFront, ALB, API GW</text>
  <rect x="245" y="106" width="190" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="255" y="124" fill="#fb923c" font-size="10" font-weight="700">Shield &amp; GuardDuty</text>
  <text x="255" y="138" fill="#cbd5e1" font-size="8">Shield: Mitigación DDoS L3/L4/L7</text>
  <text x="255" y="149" fill="#94a3b8" font-size="7.5">GuardDuty: Detección ML (Flow, DNS, Trail)</text>
  <rect x="245" y="164" width="190" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="255" y="182" fill="#38bdf8" font-size="10" font-weight="700">VPC Security Groups &amp; NACLs</text>
  <text x="255" y="196" fill="#94a3b8" font-size="8">SG: Stateful a nivel de instancia</text>
  <text x="255" y="207" fill="#cbd5e1" font-size="7.5">NACL: Stateless a nivel de subred (Deny rules)</text>

  <rect x="460" y="15" width="205" height="210" rx="8" fill="#0f2622" stroke="#34d399" stroke-width="1.2"/>
  <text x="470" y="36" fill="#34d399" font-size="11" font-weight="700">3. Cifrado y Políticas</text>
  <rect x="470" y="48" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="480" y="66" fill="#34d399" font-size="10" font-weight="700">AWS KMS vs CloudHSM</text>
  <text x="480" y="80" fill="#cbd5e1" font-size="8">KMS: Multi-tenant gestionado</text>
  <text x="480" y="91" fill="#fca5a5" font-size="7.5">CloudHSM: Hardware dedicado FIPS L3</text>
  <rect x="470" y="106" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="480" y="124" fill="#f87171" font-size="10" font-weight="700">S3 Bucket Policies &amp; SCP</text>
  <text x="480" y="138" fill="#cbd5e1" font-size="8">SCP: Guardrail organizacional</text>
  <text x="480" y="149" fill="#f87171" font-size="7.5">Explicit Deny supera cualquier Allow</text>
  <rect x="470" y="164" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="480" y="182" fill="#38bdf8" font-size="10" font-weight="700">Direct Connect + MACsec</text>
  <text x="480" y="196" fill="#94a3b8" font-size="8">Cifrado de capa 2 en DX punto a punto</text>
  <text x="480" y="207" fill="#cbd5e1" font-size="7.5">O túnel IPsec VPN sobre conexión DX</text>
</svg>`,
        caption: 'El Dominio 1 evalúa la seguridad en capas: `IAM Roles` temporales, guardrails con `SCP`, prevención de ataques web con `WAF`, detección continua con `GuardDuty` y cifrado gestionado con `KMS` o dedicado con `CloudHSM`.',
        captionEn: 'Domain 1 validates layered security: temporary `IAM Roles`, organizational guardrails via `SCP`, perimeter threat defense via `WAF`, continuous analysis with `GuardDuty`, and `KMS` or `CloudHSM` encryption.'
      },

      'aws-t-2': {
        badge: 'Domain 2 · Resilient Architectures',
        title: 'Dominio 2: Arquitecturas Resilientes (Multi-AZ, Desacoplamiento y Estrategias DR)',
        titleEn: 'Domain 2: Resilient Architectures (Multi-AZ, Decoupled Queues & DR Strategies)',
        svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <rect x="15" y="15" width="205" height="210" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
  <text x="25" y="36" fill="#38bdf8" font-size="11" font-weight="700">Alta Disponibilidad Base</text>
  <rect x="25" y="48" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="35" y="66" fill="#38bdf8" font-size="10" font-weight="700">RDS Multi-AZ Failover</text>
  <text x="35" y="80" fill="#94a3b8" font-size="8.5">Sync replication, RTO &lt; 2 min</text>
  <text x="35" y="91" fill="#34d399" font-size="8">RPO = 0 (Sin pérdida de datos)</text>
  <rect x="25" y="106" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="35" y="124" fill="#818cf8" font-size="10" font-weight="700">Aurora Multi-AZ Storage</text>
  <text x="35" y="138" fill="#cbd5e1" font-size="8">6 copias en 3 AZs independientes</text>
  <text x="35" y="149" fill="#94a3b8" font-size="7.5">Tolerancia a pérdida de 2 copias sin parar</text>
  <rect x="25" y="164" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="35" y="182" fill="#34d399" font-size="10" font-weight="700">DynamoDB Global Tables</text>
  <text x="35" y="196" fill="#cbd5e1" font-size="8">Multi-Master Active-Active global</text>
  <text x="35" y="207" fill="#94a3b8" font-size="7.5">Replicación multi-región automática</text>

  <rect x="235" y="15" width="210" height="210" rx="8" fill="#1f1a14" stroke="#f97316" stroke-width="1.2"/>
  <text x="245" y="36" fill="#f97316" font-size="11" font-weight="700">Desacoplamiento Asíncrono</text>
  <rect x="245" y="48" width="190" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="255" y="66" fill="#f97316" font-size="10" font-weight="700">SQS Standard vs FIFO</text>
  <text x="255" y="80" fill="#cbd5e1" font-size="8">FIFO: Orden y deduplicación exacta</text>
  <text x="255" y="91" fill="#94a3b8" font-size="7.5">Standard: Throughput casi ilimitado</text>
  <rect x="245" y="106" width="190" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="255" y="124" fill="#fbbf24" font-size="10" font-weight="700">Dead-Letter Queue (DLQ)</text>
  <text x="255" y="138" fill="#cbd5e1" font-size="8">Aísla mensajes tras maxReceiveCount</text>
  <text x="255" y="149" fill="#f87171" font-size="7.5">Evita saturar la cola de procesamiento</text>
  <rect x="245" y="164" width="190" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="255" y="182" fill="#38bdf8" font-size="10" font-weight="700">SNS Fan-Out &amp; EventBridge</text>
  <text x="255" y="196" fill="#cbd5e1" font-size="8">1 publicación -> múltiples suscriptores</text>
  <text x="255" y="207" fill="#94a3b8" font-size="7.5">EventBridge: Enrutamiento JSON y filtros</text>

  <rect x="460" y="15" width="205" height="210" rx="8" fill="#2d1217" stroke="#f87171" stroke-width="1.2"/>
  <text x="470" y="36" fill="#f87171" font-size="11" font-weight="700">Estrategias de DR y DNS</text>
  <rect x="470" y="48" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="480" y="66" fill="#34d399" font-size="10" font-weight="700">Backup &amp; Restore (Horas)</text>
  <text x="480" y="80" fill="#94a3b8" font-size="8">Menor coste, mayor RPO / RTO</text>
  <rect x="470" y="106" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="480" y="124" fill="#fbbf24" font-size="10" font-weight="700">Pilot Light / Warm Standby</text>
  <text x="480" y="138" fill="#cbd5e1" font-size="8">Datos vivos, flota reducida o apagada</text>
  <text x="480" y="149" fill="#94a3b8" font-size="7.5">RTO de minutos mediante autoescala</text>
  <rect x="470" y="164" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="480" y="182" fill="#38bdf8" font-size="10" font-weight="700">Route 53 DNS Failover</text>
  <text x="480" y="196" fill="#cbd5e1" font-size="8">Health checks de endpoint y conmutación</text>
  <text x="480" y="207" fill="#34d399" font-size="7.5">Active-Passive y Active-Active multi-región</text>
</svg>`,
        caption: 'El Dominio 2 cubre arquitecturas tolerantes a fallos: `RDS Multi-AZ` para RPO=0, colas `SQS + DLQ` para desacoplar picos y estrategias de Disaster Recovery con failover automático en `Route 53`.',
        captionEn: 'Domain 2 covers fault-tolerant designs: `RDS Multi-AZ` for zero data loss, `SQS + DLQ` decoupling for traffic spikes, and disaster recovery strategies backed by `Route 53` failover routing.'
      },

      'aws-t-3': {
        badge: 'Domain 3 · High Performance',
        title: 'Dominio 3: Arquitecturas de Alto Rendimiento (EBS, EFS, ElastiCache, Red y CDN)',
        titleEn: 'Domain 3: High Performance Architectures (EBS, EFS, ElastiCache, Networking & CDN)',
        svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <rect x="15" y="15" width="205" height="210" rx="8" fill="#0f172a" stroke="#34d399" stroke-width="1.2"/>
  <text x="25" y="36" fill="#34d399" font-size="11" font-weight="700">Almacenamiento de Rendimiento</text>
  <rect x="25" y="48" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="35" y="66" fill="#38bdf8" font-size="10" font-weight="700">EBS io2 Block Express</text>
  <text x="35" y="80" fill="#94a3b8" font-size="8.5">Hasta 256.000 IOPS · Latencia sub-ms</text>
  <text x="35" y="91" fill="#34d399" font-size="8">Multi-Attach en la misma AZ</text>
  <rect x="25" y="106" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="35" y="124" fill="#34d399" font-size="10" font-weight="700">Amazon EFS (POSIX NFS)</text>
  <text x="35" y="138" fill="#cbd5e1" font-size="8">Montaje concurrente en cientos de EC2</text>
  <text x="35" y="149" fill="#94a3b8" font-size="7.5">Multi-AZ para Linux y contenedores ECS</text>
  <rect x="25" y="164" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="35" y="182" fill="#c084fc" font-size="10" font-weight="700">FSx for Lustre</text>
  <text x="35" y="196" fill="#cbd5e1" font-size="8">HPC, Machine Learning y Big Data</text>
  <text x="35" y="207" fill="#38bdf8" font-size="7.5">Integración directa de lectura/escritura en S3</text>

  <rect x="235" y="15" width="210" height="210" rx="8" fill="#132338" stroke="#38bdf8" stroke-width="1.2"/>
  <text x="245" y="36" fill="#38bdf8" font-size="11" font-weight="700">Caché en Memoria y DB</text>
  <rect x="245" y="48" width="190" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="255" y="66" fill="#f87171" font-size="10" font-weight="700">ElastiCache Redis</text>
  <text x="255" y="80" fill="#cbd5e1" font-size="8">Persistencia, réplica Multi-AZ y failover</text>
  <text x="255" y="91" fill="#94a3b8" font-size="7.5">Leaderboards y estructuras de datos</text>
  <rect x="245" y="106" width="190" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="255" y="124" fill="#38bdf8" font-size="10" font-weight="700">DynamoDB DAX</text>
  <text x="255" y="138" fill="#cbd5e1" font-size="8">Caché in-memory dedicada</text>
  <text x="255" y="149" fill="#34d399" font-size="7.5">Microsegundos de respuesta en lecturas</text>
  <rect x="245" y="164" width="190" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="255" y="182" fill="#fbbf24" font-size="10" font-weight="700">Kinesis Data Streams</text>
  <text x="255" y="196" fill="#cbd5e1" font-size="8">Ingesta streaming en tiempo real por Shards</text>
  <text x="255" y="207" fill="#94a3b8" font-size="7.5">Replay de datos y múltiples consumidores</text>

  <rect x="460" y="15" width="205" height="210" rx="8" fill="#1e1b4b" stroke="#818cf8" stroke-width="1.2"/>
  <text x="470" y="36" fill="#818cf8" font-size="11" font-weight="700">Aceleración de Red y Edge</text>
  <rect x="470" y="48" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="480" y="66" fill="#38bdf8" font-size="10" font-weight="700">CloudFront (L7 CDN)</text>
  <text x="480" y="80" fill="#cbd5e1" font-size="8">Caché estático/dinámico mundial</text>
  <text x="480" y="91" fill="#94a3b8" font-size="7.5">Origin Access Control (OAC) seguro</text>
  <rect x="470" y="106" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="480" y="124" fill="#818cf8" font-size="10" font-weight="700">Global Accelerator (L4)</text>
  <text x="480" y="138" fill="#cbd5e1" font-size="8">2 Anycast IPs sobre la red troncal AWS</text>
  <text x="480" y="149" fill="#94a3b8" font-size="7.5">Optimiza TCP/UDP y conmutación ultra-rápida</text>
  <rect x="470" y="164" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="480" y="182" fill="#34d399" font-size="10" font-weight="700">EFA &amp; Cluster Placement</text>
  <text x="480" y="196" fill="#cbd5e1" font-size="8">Bypass del kernel Linux para MPI y ML</text>
  <text x="480" y="207" fill="#38bdf8" font-size="7.5">Agrupación física en racks de baja latencia</text>
</svg>`,
        caption: 'El Dominio 3 se centra en maximizar el throughput y minimizar la latencia: `io2 Block Express` para bases de datos críticas, `EFS` para sistemas de archivos compartidos Linux, `DAX` para lecturas en microsegundos y `CloudFront` en el borde.',
        captionEn: 'Domain 3 focuses on maximizing throughput and minimizing latency: `io2 Block Express` for I/O-intensive databases, `EFS` for POSIX Linux sharing, `DAX` for microsecond reads, and `CloudFront` at the Edge.'
      },

      'aws-t-4': {
        badge: 'Domain 4 · Cost Optimization',
        title: 'Dominio 4: Arquitecturas Optimizadas en Costes (S3 Lifecycle, EC2 Pricing y Compute Optimizer)',
        titleEn: 'Domain 4: Cost-Optimized Architectures (S3 Lifecycle, EC2 Pricing & Compute Optimizer)',
        svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <rect x="15" y="15" width="205" height="210" rx="8" fill="#0f172a" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="25" y="36" fill="#fbbf24" font-size="11" font-weight="700">Niveles de Almacenamiento S3</text>
  <rect x="25" y="48" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="35" y="66" fill="#38bdf8" font-size="10" font-weight="700">S3 Standard vs IA</text>
  <text x="35" y="80" fill="#94a3b8" font-size="8.5">Standard ($0.023) -> IA ($0.0125)</text>
  <text x="35" y="91" fill="#fbbf24" font-size="8">Mínimo 30 días de retención en IA</text>
  <rect x="25" y="106" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="35" y="124" fill="#818cf8" font-size="10" font-weight="700">Glacier Deep Archive</text>
  <text x="35" y="138" fill="#34d399" font-size="8">$0.00099/GB (¡El más barato!)</text>
  <text x="35" y="149" fill="#94a3b8" font-size="7.5">SLA de recuperación: 12h a 48h</text>
  <rect x="25" y="164" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="35" y="182" fill="#34d399" font-size="10" font-weight="700">S3 Intelligent-Tiering</text>
  <text x="35" y="196" fill="#cbd5e1" font-size="8">Mueve objetos automáticamente</text>
  <text x="35" y="207" fill="#38bdf8" font-size="7.5">Ideal para patrones desconocidos sin retrieval fees</text>

  <rect x="235" y="15" width="210" height="210" rx="8" fill="#0f2622" stroke="#34d399" stroke-width="1.2"/>
  <text x="245" y="36" fill="#34d399" font-size="11" font-weight="700">Modelos de Compra Cómputo</text>
  <rect x="245" y="48" width="190" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="255" y="66" fill="#38bdf8" font-size="10" font-weight="700">Compute Savings Plans</text>
  <text x="255" y="80" fill="#cbd5e1" font-size="8">Hasta 66% de ahorro vs On-Demand</text>
  <text x="255" y="91" fill="#34d399" font-size="7.5">Aplica a EC2, Fargate y Lambda</text>
  <rect x="245" y="106" width="190" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="255" y="124" fill="#34d399" font-size="10" font-weight="700">Spot Instances (Capacidad Ociosa)</text>
  <text x="255" y="138" fill="#cbd5e1" font-size="8">Hasta 90% de descuento</text>
  <text x="255" y="149" fill="#fbbf24" font-size="7.5">Para batch jobs tolerantes a interrupción</text>
  <rect x="245" y="164" width="190" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="255" y="182" fill="#818cf8" font-size="10" font-weight="700">Serverless (Lambda &amp; Fargate)</text>
  <text x="255" y="196" fill="#cbd5e1" font-size="8">Pagas por ms de ejecución exacta</text>
  <text x="255" y="207" fill="#34d399" font-size="7.5">Cero coste cuando el tráfico cae a cero</text>

  <rect x="460" y="15" width="205" height="210" rx="8" fill="#1e1834" stroke="#c084fc" stroke-width="1.2"/>
  <text x="470" y="36" fill="#c084fc" font-size="11" font-weight="700">Optimización y Red</text>
  <rect x="470" y="48" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="480" y="66" fill="#38bdf8" font-size="10" font-weight="700">Gateway VPC Endpoint S3</text>
  <text x="480" y="80" fill="#34d399" font-size="8.5">¡100% GRATIS!</text>
  <text x="480" y="91" fill="#cbd5e1" font-size="7.5">Elimina costes de NAT Gateway ($0.045/GB)</text>
  <rect x="470" y="106" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="480" y="124" fill="#c084fc" font-size="10" font-weight="700">AWS Compute Optimizer</text>
  <text x="480" y="138" fill="#cbd5e1" font-size="8">Analiza patrones ML de CloudWatch</text>
  <text x="480" y="149" fill="#94a3b8" font-size="7.5">Recomienda rightsizing de EC2 y EBS</text>
  <rect x="470" y="164" width="185" height="50" rx="5" fill="#1e293b" stroke="#334155"/>
  <text x="480" y="182" fill="#fb923c" font-size="10" font-weight="700">Aurora Serverless v1 / v2</text>
  <text x="480" y="196" fill="#cbd5e1" font-size="8">v1 se pausa a 0 en inactividad (Dev)</text>
  <text x="480" y="207" fill="#38bdf8" font-size="7.5">EventBridge Scheduler apaga EC2 de noche</text>
</svg>`,
        caption: 'El Dominio 4 premia arquitecturas de mínimo coste: sustituir NAT Gateway por `Gateway Endpoints`, automatizar ciclos de vida a `Deep Archive`, reservar cómputo con `Savings Plans` y pausar dev/test con `EventBridge Scheduler`.',
        captionEn: 'Domain 4 tests cost-efficiency: replacing NAT Gateways with free `Gateway Endpoints`, archiving cold data to `Deep Archive`, using `Savings Plans`, and auto-stopping dev instances with `EventBridge Scheduler`.'
      }
    },

    // Comprehensive regex patterns for search & fallback matching
    patterns: [
      /* 1. Placement Groups & Network Acceleration */
      Object.assign({ match: /placement group|cluster placement|spread placement|partition placement|\befa\b|elastic fabric adapter/i }, VISUAL_HPC_PLACEMENT),

      /* 2. Hybrid Storage & Migration */
      Object.assign({ match: /storage gateway|datasync|snowball|migration|tape gateway|volume gateway|file gateway/i }, VISUAL_HYBRID_MIGRATION),

      /* 3. Block vs Distributed File Systems */
      Object.assign({ match: /ebs|gp2|gp3|io1|io2|efs|\bfsx\b|lustre|\bnfs\b|\bsmb\b|block express/i }, VISUAL_STORAGE_TYPES),

      /* 4. DynamoDB & DAX In-Memory */
      Object.assign({ match: /dynamodb|\bdax\b|partition key|sort key|hot partition|\bwcu\b|\brcu\b/i }, VISUAL_DYNAMODB_DAX),

      /* 5. Perimeter & Threat Intelligence */
      Object.assign({ match: /\bwaf\b|shield|guardduty|cloudhsm|security hub|sqli|ddos|fips 140-2/i }, VISUAL_PERIMETER_DEFENSE),

      /* 6. Disaster Recovery & Route 53 */
      Object.assign({ match: /disaster recovery|pilot light|warm standby|failover routing|route 53|health check/i }, VISUAL_DISASTER_RECOVERY),

      /* 7. Cost Automation, Scheduler & Aurora Serverless */
      Object.assign({ match: /compute optimizer|rightsizing|scheduler|serverless v1|serverless v2|eventbridge scheduler|business hours/i }, VISUAL_COST_AUTOMATION),

      /* 8. Decoupled Messaging & DLQ */
      Object.assign({ match: /sqs|sns|\bkinesis\b|firehose|eventbridge|\bdlq\b|dead-letter|visibility timeout|\bfifo\b|fan-out/i }, VISUAL_DECOUPLED_MSG),

      /* 9. S3 Storage Classes Waterfall & Lifecycle */
      Object.assign({ match: /glacier|deep archive|intelligent-tiering|standard-ia|one zone-ia|lifecycle|s3/i }, VISUAL_S3_WATERFALL),

      /* 10. Database High Availability & Aurora Global */
      Object.assign({ match: /multi-az|read replica|aurora|\brds\b|failover/i }, VISUAL_DATABASE_HA),

      /* 11. VPC Networking & Private Connectivity */
      Object.assign({ match: /vpc|subnet|nat gateway|internet gateway|gateway endpoint|interface endpoint|privatelink|transit gateway|direct connect|macsec|route table/i }, VISUAL_VPC_ENDPOINTS),

      /* 12. IAM Security & AssumeRole */
      Object.assign({ match: /iam|assume-role|assumerole|\bsts\b|externalid|scp|organizations|bucket policy|block public access|object lock|secrets manager|parameter store/i }, VISUAL_IAM_SECURITY),

      /* 13. Load Balancing, Edge & Compute Pricing */
      Object.assign({ match: /alb|nlb|application load balancer|network load balancer|global accelerator|savings plan|spot|reserved instance|ec2|auto scaling|ecs|fargate|eks/i }, VISUAL_EDGE_COMPUTE),

      /* 14. Global Fallback: Well-Architected Framework */
      Object.assign({ match: /aws|cloud|solution|architect|well-architected|framework|reliability|security|performance|cost/i }, VISUAL_WELL_ARCHITECTED)
    ]
  };
})();
