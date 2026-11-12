/* =========================================================================
   assets/js/visuals-aws.js — Visual Aids Pack for AWS SAA-C03
   Exam: AWS Certified Solutions Architect - Associate (SAA-C03)
   Dark Slate Palette (#0f172a container, #1e293b cards, vibrant SVG semantics)
   ========================================================================= */

window.EXAM_VISUALS = window.EXAM_VISUALS || {};

window.EXAM_VISUALS['aws-saa-c03'] = {
  questions: {},
  topics: {},
  patterns: [
    /* -------------------------------------------------------------------------
       1. VPC NETWORKING: NAT Gateway vs Gateway Endpoints vs PrivateLink
       ------------------------------------------------------------------------- */
    {
      match: /vpc|subnet|nat gateway|internet gateway|gateway endpoint|interface endpoint|privatelink|transit gateway|direct connect|vpn|macsec|route table/i,
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
  <!-- Internet Gateway -->
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
  <!-- EC2 to NAT Gateway -->
  <path d="M 100 142 L 100 78 L 205 78" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#arrow-amber)"/>
  <!-- NAT to IGW -->
  <line x1="405" y1="78" x2="447" y2="78" stroke="#fbbf24" stroke-width="1.5" marker-end="url(#arrow-amber)"/>
  <!-- IGW to Internet -->
  <line x1="550" y1="78" x2="562" y2="78" stroke="#f87171" stroke-width="1.5"/>

  <!-- EC2 to Gateway Endpoint to S3 -->
  <line x1="165" y1="156" x2="180" y2="156" stroke="#34d399" stroke-width="1.5"/>
  <line x1="410" y1="156" x2="447" y2="156" stroke="#34d399" stroke-width="2" marker-end="url(#arrow-green)"/>

  <!-- EC2 to Interface Endpoint to Services -->
  <line x1="165" y1="194" x2="180" y2="194" stroke="#c084fc" stroke-width="1.5"/>
  <line x1="410" y1="194" x2="447" y2="194" stroke="#c084fc" stroke-width="1.5" marker-end="url(#arrow-purple)"/>
</svg>`,
      caption: 'Un `Gateway VPC Endpoint` redirige el tráfico a `S3` y `DynamoDB` gratis mediante tablas de rutas sin atravesar el `NAT Gateway`, eliminando costes por GB transferido.',
      captionEn: 'A `Gateway VPC Endpoint` routes `S3` and `DynamoDB` traffic for free via route tables without traversing the `NAT Gateway`, eliminating per-GB processing fees.'
    },

    /* -------------------------------------------------------------------------
       2. IAM SECURITY & EVALUATION: AssumeRole, ExternalId & Multi-Layer Policies
       ------------------------------------------------------------------------- */
    {
      match: /iam|assume-role|assumerole|sts|externalid|scp|organizations|bucket policy|block public access|object lock|kms|cloudhsm|secrets manager|parameter store|waf|shield|guardduty|macie/i,
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

  <!-- Left: Cross-Account Trust Flow -->
  <rect x="15" y="15" width="310" height="210" rx="8" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>
  <text x="28" y="35" fill="#818cf8" font-size="11" font-weight="700">Cross-Account AssumeRole + ExternalId</text>

  <!-- Auditor / 3rd Party Account -->
  <rect x="25" y="50" width="130" height="70" rx="6" fill="#1e293b" stroke="#94a3b8" stroke-width="1"/>
  <text x="35" y="68" fill="#e2e8f0" font-size="10" font-weight="700">Cuenta Auditora</text>
  <text x="35" y="82" fill="#94a3b8" font-size="8.5">ID: 9999-9999-9999</text>
  <text x="35" y="96" fill="#38bdf8" font-size="8.5">sts:AssumeRole</text>
  <text x="35" y="110" fill="#fbbf24" font-size="8">ExtId: 'AuditOrg-X'</text>

  <!-- STS Engine -->
  <rect x="185" y="50" width="130" height="70" rx="6" fill="#1e1b4b" stroke="#c084fc" stroke-width="1.2"/>
  <text x="195" y="68" fill="#f5f3ff" font-size="10.5" font-weight="700">AWS STS Service</text>
  <text x="195" y="82" fill="#c4b5fd" font-size="8.5">Valida Trust Policy:</text>
  <text x="195" y="96" fill="#a7f3d0" font-size="8">✓ Principal: Cuenta 9999</text>
  <text x="195" y="110" fill="#a7f3d0" font-size="8">✓ sts:ExternalId Match</text>

  <path d="M 155 85 L 177 85" fill="none" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow-sec-cyan)"/>

  <!-- Target Resource Access Banner -->
  <rect x="25" y="132" width="290" height="82" rx="6" fill="#132338" stroke="#34d399" stroke-width="1"/>
  <text x="35" y="150" fill="#34d399" font-size="10" font-weight="700">Credenciales Temporales Emitidas (15m - 12h)</text>
  <text x="35" y="166" fill="#e2e8f0" font-size="8.5">AccessKeyId (ASIA...) · SecretAccessKey · SessionToken</text>
  <text x="35" y="182" fill="#94a3b8" font-size="8">Previene el problema del "Confused Deputy" en plataformas multi-tenant</text>
  <text x="35" y="198" fill="#67e8f9" font-size="8.5">✓ Permisos limitados por ReadOnlyAccess / Target Account Role</text>

  <!-- Right: Policy Evaluation Waterfall -->
  <rect x="340" y="15" width="325" height="210" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.2"/>
  <text x="355" y="35" fill="#f8fafc" font-size="11" font-weight="700">Lógica de Evaluación de Políticas en AWS</text>

  <!-- Step 1: SCP -->
  <rect x="352" y="48" width="190" height="34" rx="5" fill="#1e293b" stroke="#818cf8" stroke-width="1"/>
  <text x="362" y="63" fill="#e0e7ff" font-size="9.5" font-weight="600">1. Organizations SCP</text>
  <text x="362" y="75" fill="#94a3b8" font-size="8">Fija barreras máximas (Guardrail)</text>

  <!-- Step 2: IAM Identity Policy -->
  <rect x="352" y="88" width="190" height="34" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
  <text x="362" y="103" fill="#e0f2fe" font-size="9.5" font-weight="600">2. IAM Identity Policy</text>
  <text x="362" y="115" fill="#94a3b8" font-size="8">Roles / Grupos / Usuarios</text>

  <!-- Step 3: Resource Policy -->
  <rect x="352" y="128" width="190" height="34" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="1"/>
  <text x="362" y="143" fill="#fef3c7" font-size="9.5" font-weight="600">3. Resource Policy (S3 / KMS)</text>
  <text x="362" y="155" fill="#94a3b8" font-size="8">Bucket Policy / KMS Key Policy</text>

  <!-- Explicit Deny Interceptor -->
  <rect x="552" y="48" width="103" height="114" rx="5" fill="#3b151e" stroke="#f87171" stroke-width="1.2"/>
  <text x="560" y="70" fill="#fca5a5" font-size="9.5" font-weight="700">¿Explicit DENY?</text>
  <text x="560" y="88" fill="#f87171" font-size="8">En SCP, IAM o</text>
  <text x="560" y="102" fill="#f87171" font-size="8">Bucket Policy</text>
  <rect x="560" y="118" width="87" height="30" rx="4" fill="#7f1d1d"/>
  <text x="572" y="137" fill="#fee2e2" font-size="10" font-weight="800">DENY TOTAL</text>

  <!-- Final Allow Box -->
  <rect x="352" y="172" width="303" height="42" rx="5" fill="#064e3b" stroke="#34d399" stroke-width="1.2"/>
  <text x="364" y="190" fill="#a7f3d0" font-size="10" font-weight="700">DECISIÓN: ALLOW Únicamente si...</text>
  <text x="364" y="204" fill="#ecfdf5" font-size="8.5">Existe al menos 1 Explicit Allow Y ningún Explicit Deny en toda la cadena</text>
</svg>`,
      caption: '`sts:AssumeRole` con `ExternalId` evita el problema del "confused deputy" en auditorías externas. Un `Explicit Deny` en cualquier capa (SCP, IAM o Bucket Policy) invalida todo acceso.',
      captionEn: '`sts:AssumeRole` with `ExternalId` prevents confused deputy attacks in 3rd-party audits. An `Explicit Deny` at any layer (SCP, IAM, or Bucket Policy) overrides all allows.'
    },

    /* -------------------------------------------------------------------------
       3. DATABASE HA & SCALING: RDS Multi-AZ vs Read Replicas vs Aurora Global
       ------------------------------------------------------------------------- */
    {
      match: /rds|multi-az|read replica|aurora|dynamodb|dax|elasticache|redis|rds proxy|serverless|database|failover/i,
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

  <!-- Panel 1: Multi-AZ -->
  <rect x="15" y="15" width="205" height="210" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
  <rect x="25" y="23" width="90" height="18" rx="3" fill="#1e293b"/>
  <text x="30" y="36" fill="#38bdf8" font-size="9.5" font-weight="700">RDS Multi-AZ (HA)</text>

  <!-- Primary Instance -->
  <rect x="25" y="48" width="185" height="52" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
  <text x="35" y="66" fill="#f8fafc" font-size="10.5" font-weight="700">Primary DB (AZ-A)</text>
  <text x="35" y="80" fill="#34d399" font-size="8.5">● Active: Read + Write</text>
  <text x="35" y="93" fill="#94a3b8" font-size="8">Synchronous EBS Replication</text>

  <!-- Sync Arrow down -->
  <line x1="117" y1="102" x2="117" y2="123" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow-db-cyan)"/>
  <text x="123" y="116" fill="#38bdf8" font-size="7.5" font-weight="600">Sync (RPO=0)</text>

  <!-- Standby Instance -->
  <rect x="25" y="126" width="185" height="52" rx="5" fill="#1e293b" stroke="#fbbf24" stroke-width="1"/>
  <text x="35" y="144" fill="#fbbf24" font-size="10.5" font-weight="700">Standby DB (AZ-B)</text>
  <text x="35" y="158" fill="#f87171" font-size="8.5">✕ Standby: NO ACEPTA LECTURAS</text>
  <text x="35" y="171" fill="#94a3b8" font-size="8">Failover automático DNS (RTO 60s)</text>

  <rect x="25" y="185" width="185" height="32" rx="4" fill="#1e293b"/>
  <text x="32" y="198" fill="#cbd5e1" font-size="8">Objetivo: Resiliencia ante caídas de AZ.</text>
  <text x="32" y="210" fill="#94a3b8" font-size="7.5">No escala consultas de lectura.</text>

  <!-- Panel 2: Read Replicas -->
  <rect x="235" y="15" width="205" height="210" rx="8" fill="#0f172a" stroke="#34d399" stroke-width="1.2"/>
  <rect x="245" y="23" width="115" height="18" rx="3" fill="#1e293b"/>
  <text x="250" y="36" fill="#34d399" font-size="9.5" font-weight="700">Read Replicas (Escala)</text>

  <!-- Primary -->
  <rect x="245" y="48" width="185" height="45" rx="5" fill="#1e293b" stroke="#34d399" stroke-width="1"/>
  <text x="255" y="65" fill="#f8fafc" font-size="10.5" font-weight="700">Primary DB</text>
  <text x="255" y="80" fill="#34d399" font-size="8.5">Read / Write · Genera binlogs</text>

  <!-- Async Arrow down -->
  <line x1="285" y1="95" x2="285" y2="120" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#arrow-db-amber)"/>
  <line x1="390" y1="95" x2="390" y2="120" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#arrow-db-amber)"/>
  <text x="305" y="112" fill="#fbbf24" font-size="7.5">Async Replication</text>

  <!-- Read Replicas Box -->
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

  <!-- Panel 3: Aurora Global DB -->
  <rect x="455" y="15" width="210" height="210" rx="8" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>
  <rect x="465" y="23" width="130" height="18" rx="3" fill="#1e293b"/>
  <text x="470" y="36" fill="#818cf8" font-size="9.5" font-weight="700">Aurora Global Database</text>

  <!-- Region 1 Primary -->
  <rect x="465" y="48" width="190" height="46" rx="5" fill="#1e1b4b" stroke="#818cf8" stroke-width="1"/>
  <text x="475" y="65" fill="#f8fafc" font-size="10" font-weight="700">Primary Region (us-east-1)</text>
  <text x="475" y="80" fill="#a5b4fc" font-size="8.5">1 Master R/W + hasta 15 Replicas</text>

  <!-- Cross Region SAN Replication -->
  <line x1="560" y1="96" x2="560" y2="120" stroke="#818cf8" stroke-width="2" marker-end="url(#arrow-db-cyan)"/>
  <text x="475" y="112" fill="#818cf8" font-size="8" font-weight="600">Storage Replication (&lt; 1 seg lag)</text>

  <!-- Region 2 Secondary -->
  <rect x="465" y="124" width="190" height="46" rx="5" fill="#1e293b" stroke="#818cf8" stroke-width="1"/>
  <text x="475" y="141" fill="#c7d2fe" font-size="10" font-weight="700">Secondary Region (eu-west-1)</text>
  <text x="475" y="156" fill="#94a3b8" font-size="8.5">Hasta 16 Replicas · Promoción RTO &lt; 1m</text>

  <rect x="465" y="177" width="190" height="40" rx="4" fill="#1e293b"/>
  <text x="472" y="191" fill="#c7d2fe" font-size="8">Capa de almacenamiento desacoplada.</text>
  <text x="472" y="203" fill="#a5b4fc" font-size="7.5">Sin impacto de réplica en el cómputo primario.</text>
</svg>`,
      caption: '`RDS Multi-AZ` garantiza alta disponibilidad mediante replicación síncrona y failover automático (la réplica standby no acepta lecturas). Las `Read Replicas` escalan lecturas de forma asíncrona.',
      captionEn: '`RDS Multi-AZ` delivers high availability via synchronous replication and automatic failover (standby cannot take reads). `Read Replicas` scale queries asynchronously.'
    },

    /* -------------------------------------------------------------------------
       4. DECOUPLED MESSAGING: SQS FIFO/Standard, SNS Fan-Out & Dead-Letter Queue
       ------------------------------------------------------------------------- */
    {
      match: /sqs|sns|kinesis|firehose|eventbridge|dlq|dead-letter|visibility timeout|fifo|decoupl|fan-out|lambda|step functions/i,
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

  <!-- Producer Box -->
  <rect x="15" y="70" width="95" height="60" rx="6" fill="#1e293b" stroke="#f97316" stroke-width="1.2"/>
  <text x="23" y="93" fill="#fed7aa" font-size="10" font-weight="700">Productor</text>
  <text x="23" y="108" fill="#94a3b8" font-size="8">Microservicio</text>
  <text x="23" y="120" fill="#38bdf8" font-size="8">1 Publish Event</text>

  <!-- Fan-Out to SNS -->
  <line x1="110" y1="100" x2="135" y2="100" stroke="#f97316" stroke-width="1.5" marker-end="url(#arrow-msg-orange)"/>

  <!-- SNS Topic -->
  <rect x="140" y="55" width="115" height="90" rx="8" fill="#2d150b" stroke="#f97316" stroke-width="1.5"/>
  <text x="148" y="78" fill="#fed7aa" font-size="11" font-weight="800">Amazon SNS</text>
  <text x="148" y="94" fill="#fb923c" font-size="9" font-weight="600">Topic: orders-tx</text>
  <text x="148" y="112" fill="#cbd5e1" font-size="8">Patrón Fan-Out</text>
  <text x="148" y="126" fill="#94a3b8" font-size="7.5">1-to-N Decoupling</text>

  <!-- Fan Out Lines -->
  <!-- Top: SQS FIFO -->
  <path d="M 255 75 L 285 75 L 285 40 L 310 40" fill="none" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow-msg-cyan)"/>
  <!-- Middle: SQS Standard -->
  <line x1="255" y1="100" x2="310" y2="100" stroke="#34d399" stroke-width="1.5" marker-end="url(#arrow-msg-green)"/>
  <!-- Lower: EventBridge / Kinesis -->
  <path d="M 255 125 L 285 125 L 285 180 L 310 180" fill="none" stroke="#818cf8" stroke-width="1.5"/>

  <!-- Top Queue: SQS FIFO -->
  <rect x="315" y="18" width="175" height="50" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="1.2"/>
  <text x="325" y="35" fill="#38bdf8" font-size="10.5" font-weight="700">SQS FIFO (orders.fifo)</text>
  <text x="325" y="49" fill="#93c5fd" font-size="8">MessageGroupId · DeduplicationId</text>
  <text x="325" y="60" fill="#cbd5e1" font-size="7.5">Orden estricto · Exactly-Once (300 msg/s)</text>

  <!-- Top Worker -->
  <rect x="520" y="18" width="145" height="50" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>
  <text x="530" y="36" fill="#f8fafc" font-size="10" font-weight="700">Worker Pagos</text>
  <text x="530" y="52" fill="#94a3b8" font-size="8">Procesamiento Secuencial</text>

  <line x1="490" y1="43" x2="515" y2="43" stroke="#38bdf8" stroke-width="1.2" marker-end="url(#arrow-msg-cyan)"/>

  <!-- Middle Queue: SQS Standard with Visibility & ASG -->
  <rect x="315" y="78" width="175" height="60" rx="5" fill="#1e293b" stroke="#34d399" stroke-width="1.2"/>
  <text x="325" y="96" fill="#34d399" font-size="10.5" font-weight="700">SQS Standard Queue</text>
  <text x="325" y="110" fill="#a7f3d0" font-size="8">Throughput Ilimitado · At-least-once</text>
  <text x="325" y="123" fill="#cbd5e1" font-size="7.5">Visibility Timeout (30s – 12h, aj. 45m)</text>

  <!-- ASG Worker Fleet -->
  <rect x="520" y="78" width="145" height="60" rx="5" fill="#0f172a" stroke="#34d399" stroke-width="1"/>
  <text x="530" y="96" fill="#f8fafc" font-size="10" font-weight="700">Auto Scaling EC2 / ECS</text>
  <text x="530" y="110" fill="#86efac" font-size="8">Escala por Backlog:</text>
  <text x="530" y="123" fill="#94a3b8" font-size="7.5">ApproximateNumberOfMessages</text>

  <line x1="490" y1="108" x2="515" y2="108" stroke="#34d399" stroke-width="1.2" marker-end="url(#arrow-msg-green)"/>

  <!-- Failed messages to DLQ -->
  <path d="M 402 138 L 402 158" fill="none" stroke="#f87171" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#arrow-msg-red)"/>
  <text x="408" y="152" fill="#f87171" font-size="7.5">maxReceiveCount</text>

  <!-- Dead-Letter Queue (DLQ) -->
  <rect x="315" y="162" width="175" height="58" rx="5" fill="#3b151e" stroke="#f87171" stroke-width="1.2"/>
  <text x="325" y="180" fill="#fca5a5" font-size="10.5" font-weight="700">Dead-Letter Queue (DLQ)</text>
  <text x="325" y="195" fill="#f87171" font-size="8">Aísla mensajes venenosos / bugs</text>
  <text x="325" y="208" fill="#fee2e2" font-size="7.5">CloudWatch Alarm + Redrive Policy</text>

  <!-- SQS Analysis / Alert -->
  <rect x="520" y="162" width="145" height="58" rx="5" fill="#1e293b" stroke="#f87171" stroke-width="1"/>
  <text x="530" y="180" fill="#fca5a5" font-size="9.5" font-weight="700">Soporte y Debugging</text>
  <text x="530" y="195" fill="#94a3b8" font-size="8">Análisis sin frenar la cola</text>
  <text x="530" y="208" fill="#67e8f9" font-size="7.5">DLQ Redrive a Source Queue</text>

  <line x1="490" y1="190" x2="515" y2="190" stroke="#f87171" stroke-width="1.2" marker-end="url(#arrow-msg-red)"/>
</svg>`,
      caption: '`SNS Fan-Out` distribuye eventos a colas `FIFO` (para orden estricto) y `Standard` (throughput masivo). Un `DLQ` captura mensajes fallidos tras superar `maxReceiveCount` sin detener el flujo.',
      captionEn: '`SNS Fan-Out` fans out events to `FIFO` (strict ordering) and `Standard` queues (infinite throughput). A `DLQ` isolates poisonous messages exceeding `maxReceiveCount` without halting traffic.'
    },

    /* -------------------------------------------------------------------------
       5. AMAZON S3 STORAGE CLASSES: Lifecycle Waterfall & Retrieval SLAs
       ------------------------------------------------------------------------- */
    {
      match: /s3|glacier|deep archive|intelligent-tiering|standard-ia|one zone-ia|lifecycle|transfer acceleration|cloudfront|oac|ebs|efs|fsx|storage gateway|datasync/i,
      badge: 'S3 Lifecycle & Storage Tiers',
      title: 'Amazon S3: Cascada del Ciclo de Vida, Costes por GB y SLAs de Recuperación',
      titleEn: 'Amazon S3: Lifecycle Waterfall, Storage Costs & Retrieval SLAs',
      svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow-s3-cyan" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 6 3, 0 6" fill="#38bdf8"/>
    </marker>
  </defs>

  <!-- Waterfall Pipeline Header Timeline -->
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

  <!-- Tier 1: Standard -->
  <rect x="15" y="48" width="120" height="135" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.2"/>
  <text x="24" y="66" fill="#38bdf8" font-size="10" font-weight="800">S3 Standard</text>
  <text x="24" y="82" fill="#f8fafc" font-size="11" font-weight="700">$0.023/GB</text>
  <text x="24" y="98" fill="#34d399" font-size="8.5">SLA: Milisegundos</text>
  <text x="24" y="113" fill="#cbd5e1" font-size="8">Sin min. días</text>
  <text x="24" y="128" fill="#94a3b8" font-size="8">≥3 AZs (11 9s)</text>
  <rect x="22" y="142" width="106" height="30" rx="3" fill="#0f172a"/>
  <text x="26" y="156" fill="#94a3b8" font-size="7.5">Uso: Datos activos,</text>
  <text x="26" y="167" fill="#cbd5e1" font-size="7.5">sitios web, analítica</text>

  <!-- Tier 2: Intelligent-Tiering -->
  <rect x="145" y="48" width="125" height="135" rx="6" fill="#132338" stroke="#38bdf8" stroke-width="1.2"/>
  <text x="153" y="66" fill="#38bdf8" font-size="10" font-weight="800">Intelligent-Tiering</text>
  <text x="153" y="82" fill="#f8fafc" font-size="10.5" font-weight="700">Auto-Scaling Tiers</text>
  <text x="153" y="98" fill="#34d399" font-size="8.5">Sin costes retriev.</text>
  <text x="153" y="113" fill="#cbd5e1" font-size="8">Frequent / Infreq.</text>
  <text x="153" y="128" fill="#94a3b8" font-size="8">Tarifa monitor/obj</text>
  <rect x="150" y="142" width="115" height="30" rx="3" fill="#0f172a"/>
  <text x="154" y="156" fill="#94a3b8" font-size="7.5">Uso: Patrón de acceso</text>
  <text x="154" y="167" fill="#38bdf8" font-size="7.5">desconocido o variable</text>

  <!-- Tier 3: Standard-IA -->
  <rect x="280" y="48" width="120" height="135" rx="6" fill="#1e293b" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="288" y="66" fill="#fbbf24" font-size="10" font-weight="800">Standard-IA</text>
  <text x="288" y="82" fill="#f8fafc" font-size="11" font-weight="700">$0.0125/GB</text>
  <text x="288" y="98" fill="#34d399" font-size="8.5">SLA: Milisegundos</text>
  <text x="288" y="113" fill="#fca5a5" font-size="8">Min. 30 días</text>
  <text x="288" y="128" fill="#fbbf24" font-size="8">Cobro por retrieval</text>
  <rect x="285" y="142" width="110" height="30" rx="3" fill="#0f172a"/>
  <text x="290" y="156" fill="#94a3b8" font-size="7.5">Uso: Backups mes,</text>
  <text x="290" y="167" fill="#cbd5e1" font-size="7.5">acceso esporádico</text>

  <!-- Tier 4: Glacier Flexible -->
  <rect x="410" y="48" width="125" height="135" rx="6" fill="#1e1b4b" stroke="#818cf8" stroke-width="1.2"/>
  <text x="418" y="66" fill="#a5b4fc" font-size="10" font-weight="800">Glacier Flexible</text>
  <text x="418" y="82" fill="#f8fafc" font-size="11" font-weight="700">$0.0036/GB</text>
  <text x="418" y="98" fill="#f59e0b" font-size="8.5">SLA: 1-5m / 3-5h</text>
  <text x="418" y="113" fill="#fca5a5" font-size="8">Min. 90 días</text>
  <text x="418" y="128" fill="#c7d2fe" font-size="8">Expedited / Standard</text>
  <rect x="415" y="142" width="115" height="30" rx="3" fill="#0f172a"/>
  <text x="420" y="156" fill="#94a3b8" font-size="7.5">Uso: Archivo anual,</text>
  <text x="420" y="167" fill="#cbd5e1" font-size="7.5">compliance legal</text>

  <!-- Tier 5: Glacier Deep Archive -->
  <rect x="545" y="48" width="120" height="135" rx="6" fill="#2e1065" stroke="#a855f7" stroke-width="1.5"/>
  <text x="553" y="66" fill="#e9d5ff" font-size="10" font-weight="800">Deep Archive</text>
  <text x="553" y="82" fill="#34d399" font-size="11" font-weight="800">$0.00099/GB</text>
  <text x="553" y="98" fill="#fca5a5" font-size="8.5">SLA: 12h / 48h</text>
  <text x="553" y="113" fill="#fca5a5" font-size="8">Min. 180 días</text>
  <text x="553" y="128" fill="#d8b4fe" font-size="8">¡Coste más bajo!</text>
  <rect x="550" y="142" width="110" height="30" rx="3" fill="#0f172a"/>
  <text x="555" y="156" fill="#94a3b8" font-size="7.5">Uso: Retención 7-10a,</text>
  <text x="555" y="167" fill="#cbd5e1" font-size="7.5">reemplazo de cintas</text>

  <!-- Bottom Transition Rule Banner -->
  <rect x="15" y="192" width="650" height="35" rx="5" fill="#0f172a" stroke="#334155" stroke-width="1"/>
  <text x="25" y="213" fill="#38bdf8" font-size="9" font-weight="700">Regla S3 Lifecycle:</text>
  <text x="135" y="213" fill="#cbd5e1" font-size="8.5">Objetos en Standard pasan a Standard-IA a los 30d, a Glacier a los 90d, a Deep Archive a los 180d y se expiran al año.</text>
</svg>`,
      caption: '`S3 Lifecycle Rules` automatizan la transición de datos fríos hacia `Standard-IA`, `Glacier Flexible` (SLA de 1 a 5 horas) y `Glacier Deep Archive` ($0.00099/GB con SLA de 12 horas).',
      captionEn: '`S3 Lifecycle Rules` automate transitioning cold objects to `Standard-IA`, `Glacier Flexible` (1 to 5 hr SLA), and `Glacier Deep Archive` ($0.00099/GB with 12 hr retrieval SLA).'
    },

    /* -------------------------------------------------------------------------
       6. LOAD BALANCING, EDGE & COMPUTE PURCHASING MODELS
       ------------------------------------------------------------------------- */
    {
      match: /alb|nlb|application load balancer|network load balancer|global accelerator|route 53|spot|reserved instance|savings plan|ec2|auto scaling|ecs|fargate|eks/i,
      badge: 'Edge Networking & Compute Optimization',
      title: 'ALB vs NLB vs CloudFront vs Global Accelerator y Modelo de Costes EC2',
      titleEn: 'ALB vs NLB vs CloudFront vs Global Accelerator & EC2 Cost Models',
      svg: `<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <!-- Left Side: Routing & Edge Matrix -->
  <rect x="15" y="15" width="355" height="210" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
  <text x="25" y="34" fill="#38bdf8" font-size="11" font-weight="700">Matriz: Edge Routing y Balanceo de Carga</text>

  <!-- CloudFront -->
  <rect x="25" y="44" width="160" height="74" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
  <text x="33" y="60" fill="#38bdf8" font-size="10" font-weight="700">CloudFront (L7 CDN)</text>
  <text x="33" y="74" fill="#94a3b8" font-size="8">Caché en 600+ Edge Pops</text>
  <text x="33" y="87" fill="#cbd5e1" font-size="8">HTTP/S, OAC para S3</text>
  <text x="33" y="100" fill="#34d399" font-size="8">Protección DDoS con Shield</text>

  <!-- Global Accelerator -->
  <rect x="195" y="44" width="165" height="74" rx="5" fill="#1e293b" stroke="#818cf8" stroke-width="1"/>
  <text x="203" y="60" fill="#818cf8" font-size="10" font-weight="700">Global Accelerator (L4)</text>
  <text x="203" y="74" fill="#94a3b8" font-size="8">2 IPs Anycast Estáticas</text>
  <text x="203" y="87" fill="#cbd5e1" font-size="8">TCP / UDP (VoIP, Gaming)</text>
  <text x="203" y="100" fill="#c7d2fe" font-size="8">Enruta por troncal AWS</text>

  <!-- ALB -->
  <rect x="25" y="126" width="160" height="88" rx="5" fill="#1e293b" stroke="#34d399" stroke-width="1"/>
  <text x="33" y="142" fill="#34d399" font-size="10" font-weight="700">ALB (Layer 7 HTTP)</text>
  <text x="33" y="156" fill="#94a3b8" font-size="8">Rutas por Path y Host</text>
  <text x="33" y="169" fill="#cbd5e1" font-size="8">Target Groups, WebSockets</text>
  <text x="33" y="182" fill="#94a3b8" font-size="8">Integración WAF directa</text>
  <text x="33" y="196" fill="#67e8f9" font-size="7.5">IP dinámica por AZ</text>

  <!-- NLB -->
  <rect x="195" y="126" width="165" height="88" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="1"/>
  <text x="203" y="142" fill="#f59e0b" font-size="10" font-weight="700">NLB (Layer 4 TCP/UDP)</text>
  <text x="203" y="156" fill="#94a3b8" font-size="8">Latencia de microsegundos</text>
  <text x="203" y="169" fill="#cbd5e1" font-size="8">Millones de req / seg</text>
  <text x="203" y="182" fill="#fbbf24" font-size="8">IP Elástica Estática por AZ</text>
  <text x="203" y="196" fill="#fed7aa" font-size="7.5">Soporta PrivateLink Endpoints</text>

  <!-- Right Side: EC2 Cost Models Waterfall -->
  <rect x="385" y="15" width="280" height="210" rx="8" fill="#0f172a" stroke="#34d399" stroke-width="1.2"/>
  <text x="398" y="34" fill="#34d399" font-size="11" font-weight="700">Modelos de Pago EC2 &amp; Ahorro</text>

  <!-- On-Demand Bar -->
  <rect x="398" y="46" width="250" height="34" rx="4" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
  <rect x="398" y="46" width="250" height="34" rx="4" fill="#475569" opacity="0.3"/>
  <text x="408" y="60" fill="#f8fafc" font-size="9.5" font-weight="700">On-Demand (Tarifa Base)</text>
  <text x="408" y="73" fill="#cbd5e1" font-size="8">Cero compromiso · Cargas cortas o impredecibles</text>
  <text x="615" y="66" fill="#94a3b8" font-size="9" font-weight="700">100%</text>

  <!-- Compute Savings Plans Bar -->
  <rect x="398" y="88" width="250" height="38" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
  <rect x="398" y="88" width="160" height="38" rx="4" fill="#0284c7" opacity="0.4"/>
  <text x="408" y="103" fill="#38bdf8" font-size="9.5" font-weight="700">Compute Savings Plans (1–3a)</text>
  <text x="408" y="117" fill="#cbd5e1" font-size="8">Hasta 66% ahorro · Flexible (EC2, Fargate, Lambda)</text>
  <text x="612" y="108" fill="#38bdf8" font-size="9" font-weight="700">-66%</text>

  <!-- EC2 Instance Savings Plans Bar -->
  <rect x="398" y="134" width="250" height="38" rx="4" fill="#1e293b" stroke="#818cf8" stroke-width="1"/>
  <rect x="398" y="134" width="135" height="38" rx="4" fill="#4f46e5" opacity="0.4"/>
  <text x="408" y="149" fill="#818cf8" font-size="9.5" font-weight="700">Instance Savings / Standard RI</text>
  <text x="408" y="163" fill="#cbd5e1" font-size="8">Hasta 72% ahorro · Atado a familia y región</text>
  <text x="612" y="154" fill="#818cf8" font-size="9" font-weight="700">-72%</text>

  <!-- Spot Instances Bar -->
  <rect x="398" y="180" width="250" height="36" rx="4" fill="#1e293b" stroke="#34d399" stroke-width="1.2"/>
  <rect x="398" y="180" width="75" height="36" rx="4" fill="#059669" opacity="0.5"/>
  <text x="408" y="195" fill="#34d399" font-size="9.5" font-weight="700">Spot Instances (Capacidad Ociosa)</text>
  <text x="408" y="208" fill="#a7f3d0" font-size="8">Hasta 90% ahorro · Batch, HPC (Aviso 2 min)</text>
  <text x="612" y="200" fill="#34d399" font-size="9" font-weight="700">-90%</text>
</svg>`,
      caption: '`CloudFront` cachea contenido L7 en el Edge mientras que `Global Accelerator` enruta tráfico L4 por IPs Anycast fijas. Para cómputo, `Spot` ofrece hasta un 90% de descuento y `Savings Plans` hasta un 66–72% flexible.',
      captionEn: '`CloudFront` caches L7 content at Edge locations, whereas `Global Accelerator` routes L4 traffic over fixed Anycast IPs. For compute, `Spot` provides up to 90% savings and `Savings Plans` up to 66–72%.'
    }
  ]
};
