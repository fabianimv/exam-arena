/* =========================================================================
   data/aws/exam.js — AWS Certified Solutions Architect - Associate (SAA-C03)
   44 preguntas en los 4 dominios oficiales con explicación por opción errónea (WHY)
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["aws-saa-c03"] = {
    id: "aws-saa-c03",
    appId: "aws-saa-c03",
    provider: "Amazon Web Services",
    badge: "AWS · SAA-C03",
    icon: "🟧",
    color: "#e67e22",
    title: "AWS · Solutions Architect Associate (SAA-C03)",
    subtitle: "Diseño de arquitecturas seguras, resilientes, de alto rendimiento y optimizadas en costos en AWS.",
    passingScore: 72,
    domains: {
      1: "Design Secure Architectures (30 %)",
      2: "Design Resilient Architectures (26 %)",
      3: "Design High-Performing Architectures (24 %)",
      4: "Design Cost-Optimized Architectures (20 %)"
    },
    shortDomains: {
      1: "Security",
      2: "Resilience",
      3: "Performance",
      4: "Cost Optimization"
    },
    topics: [
  {
    "id": "aws-t-1",
    "d": 1,
    "title": "1.1 · Design Secure Architectures (IAM, KMS/CloudHSM, WAF, VPC Security)",
    "html": "<table class=\"keytable\">\n<tr><th>Servicio</th><th>Cuándo es la respuesta correcta en SAA-C03</th></tr>\n<tr><td><b>IAM Roles & Instance Profiles</b></td><td>Otorgar permisos temporales rotados automáticamente a EC2, ECS o Lambda sin guardar credenciales en disco ni variables.</td></tr>\n<tr><td><b>Secrets Manager vs Parameter Store</b></td><td><b>Secrets Manager</b> rota automáticamente contraseñas con integración nativa RDS/Redshift/DocumentDB; <b>Parameter Store</b> guarda configuración jerárquica.</td></tr>\n<tr><td><b>KMS vs CloudHSM</b></td><td><b>KMS</b> es gestionado y multi-tenant; <b>CloudHSM</b> provee hardware HSM dedicado single-tenant bajo tu control exclusivo (FIPS 140-2 Nivel 3).</td></tr>\n<tr><td><b>AWS WAF vs Shield vs GuardDuty</b></td><td><b>WAF</b> filtra HTTP/HTTPS (SQLi, XSS) en ALB/CloudFront/API Gateway; <b>Shield</b> protege contra DDoS; <b>GuardDuty</b> detecta amenazas analizando CloudTrail, VPC Flow Logs y DNS.</td></tr>\n</table>"
  },
  {
    "id": "aws-t-2",
    "d": 2,
    "title": "2.1 · Design Resilient Architectures (Multi-AZ, SQS/SNS, Aurora, Route 53, DR)",
    "html": "<table class=\"keytable\">\n<tr><th>Patrón / Servicio</th><th>Clave de examen</th></tr>\n<tr><td><b>RDS Multi-AZ vs Read Replicas</b></td><td><b>Multi-AZ</b> es para alta disponibilidad (replicación síncrona y failover automático sin pérdida de datos); <b>Read Replicas</b> son asíncronas para escalar lecturas.</td></tr>\n<tr><td><b>SQS vs SNS vs EventBridge</b></td><td><b>SQS</b> desacopla mediante cola pull (con FIFO para orden estricto y deduplicación); <b>SNS</b> hace fan-out pub/sub a múltiples destinos; <b>EventBridge</b> filtra y enruta eventos JSON por reglas.</td></tr>\n<tr><td><b>Estrategias DR (RPO/RTO)</b></td><td>De menor a mayor costo y velocidad: <b>Backup & Restore</b> (horas) → <b>Pilot Light</b> (núcleo mínimo apagado/mínimo) → <b>Warm Standby</b> (escalado reducido activo) → <b>Multi-Site Active-Active</b> (segundos/cero).</td></tr>\n</table>"
  },
  {
    "id": "aws-t-3",
    "d": 3,
    "title": "3.1 · Design High-Performing Architectures (EBS, EFS, ElastiCache, CloudFront, Global Accelerator)",
    "html": "<table class=\"keytable\">\n<tr><th>Servicio</th><th>Cuándo elegirlo</th></tr>\n<tr><td><b>EBS vs EFS vs FSx for Lustre</b></td><td><b>EBS</b>: bloque para 1 instancia en 1 AZ; <b>EFS</b>: sistema de archivos NFS compartido Linux multi-AZ; <b>FSx for Lustre</b>: cómputo HPC de alto rendimiento integrado con S3.</td></tr>\n<tr><td><b>ElastiCache Redis vs Memcached</b></td><td><b>Redis</b> si necesitas persistencia, replicación Multi-AZ con failover, pub/sub o estructuras ordenadas (leaderboards); <b>Memcached</b> para caché simple multihilo sin persistencia.</td></tr>\n<tr><td><b>CloudFront vs Global Accelerator</b></td><td><b>CloudFront</b> cachea contenido HTTP/HTTPS estático y dinámico en Edge Locations; <b>Global Accelerator</b> optimiza la ruta TCP/UDP usando IPs estáticas Anycast sobre la red troncal de AWS.</td></tr>\n</table>"
  },
  {
    "id": "aws-t-4",
    "d": 4,
    "title": "4.1 · Design Cost-Optimized Architectures (S3 Tiers, EC2 Pricing, Compute Optimizer)",
    "html": "<table class=\"keytable\">\n<tr><th>Opción</th><th>Optimización de costos en SAA-C03</th></tr>\n<tr><td><b>S3 Storage Classes</b></td><td><b>S3 Intelligent-Tiering</b> para patrones de acceso desconocidos o cambiantes sin cargos de recuperación; <b>Standard-IA / One Zone-IA</b> para acceso infrecuente conocido (>30 días); <b>Glacier Flexible / Deep Archive</b> para archivo de largo plazo.</td></tr>\n<tr><td><b>EC2 Pricing Models</b></td><td><b>Spot Instances</b> (hasta 90 % descuento) para cargas tolerantes a interrupciones (batch, stateless); <b>Savings Plans / Reserved Instances</b> (1–3 años) para uso base constante; <b>On-Demand</b> para picos impredecibles que no pueden interrumpirse.</td></tr>\n<tr><td><b>Gateway VPC Endpoints</b></td><td>Los Gateway Endpoints para <b>S3 y DynamoDB</b> son <b>gratuitos</b> y evitan pagar cargos de procesamiento por GB en el NAT Gateway.</td></tr>\n</table>"
  }
],
    questions: [
  {
    "id": "aws-001",
    "d": 1,
    "t": "Design Secure Architectures",
    "q": "A company stores sensitive customer PII in S3. A security audit requires that all access to the bucket is restricted to a specific IAM role used by the application, and that no other principal — including the bucket owner's AWS account root — can access the data. Which approach provides the MOST restrictive access control?",
    "o": [
      "Apply an S3 bucket policy with a Deny for all principals except the application IAM role",
      "Enable S3 Block Public Access and attach an IAM policy to the application role",
      "Use S3 ACLs to restrict access to the application role only",
      "Enable S3 Object Lock in compliance mode and attach an IAM role"
    ],
    "a": 0,
    "e": "An S3 bucket policy with an explicit Deny (`aws:PrincipalArn` condition) overrides any identity-based policy, including the root account. This is the only mechanism that can restrict even the account owner. Block Public Access prevents anonymous/public access but doesn't restrict authenticated IAM principals. ACLs are legacy, coarse-grained, and cannot target IAM roles. Object Lock prevents deletion/overwrite of objects but doesn't control read access."
  },
  {
    "id": "aws-002",
    "d": 1,
    "t": "Design Secure Architectures",
    "q": "A developer accidentally committed AWS access keys to a public GitHub repository. The keys belong to an IAM user with AdministratorAccess. What is the FIRST action the security team should take?",
    "o": [
      "Delete the IAM user immediately",
      "Rotate the access keys and update all services using them",
      "Deactivate (disable) the exposed access keys immediately",
      "Enable MFA on the IAM user account"
    ],
    "a": 2,
    "e": "The immediate priority is stopping any unauthorized use of the leaked credentials. Disabling (deactivating) the keys blocks all API calls using those credentials within seconds, without breaking the IAM user or requiring knowledge of which services use the keys. Deletion is a valid next step but takes more investigation. Rotation creates new keys but the old ones remain valid until deleted. MFA helps future logins but doesn't invalidate existing access keys."
  },
  {
    "id": "aws-003",
    "d": 1,
    "t": "Design Secure Architectures",
    "q": "An application running on EC2 needs to access DynamoDB and S3 without storing credentials on the instance. What is the RECOMMENDED approach?",
    "o": [
      "Store credentials in environment variables on the EC2 instance",
      "Attach an IAM role to the EC2 instance with the required permissions",
      "Use AWS Secrets Manager to store and retrieve credentials at startup",
      "Embed credentials in the application's configuration file encrypted with KMS"
    ],
    "a": 1,
    "e": "IAM roles for EC2 instances provide temporary, automatically rotated credentials via the instance metadata service (IMDS). The application uses the AWS SDK which automatically retrieves these credentials — no credential management required. Environment variables and config files require manual rotation and risk exposure. Secrets Manager is ideal for third-party credentials (database passwords, API keys) but is unnecessary overhead when IAM roles can grant the same permissions natively."
  },
  {
    "id": "aws-004",
    "d": 1,
    "t": "Design Secure Architectures",
    "q": "A company needs to store database passwords and API keys for a multi-tier application. The security policy requires automatic rotation every 30 days and integration with RDS. Which service should they use?",
    "o": [
      "AWS Systems Manager Parameter Store (Standard)",
      "AWS Systems Manager Parameter Store (Advanced) with SecureString",
      "AWS Secrets Manager",
      "AWS KMS with custom key rotation"
    ],
    "a": 2,
    "e": "AWS Secrets Manager is purpose-built for secrets that need automatic rotation, and has native integration with RDS, Redshift, and DocumentDB to rotate credentials without application downtime. Parameter Store (even Advanced/SecureString) requires custom Lambda functions for rotation and lacks the native RDS integration. KMS manages encryption keys, not application secrets — it's a complementary service, not a replacement."
  },
  {
    "id": "aws-005",
    "d": 1,
    "t": "Design Secure Architectures",
    "q": "A web application uses Amazon Cognito for authentication. The app needs to allow users to sign in with Google and then access AWS resources directly from the browser (S3 upload, DynamoDB queries). Which Cognito component provides temporary AWS credentials to authenticated users?",
    "o": [
      "Cognito User Pools — they issue JWT tokens that can be exchanged for AWS credentials",
      "Cognito Identity Pools — they federate identities and provide temporary IAM credentials",
      "Cognito User Pools with a resource server that issues scoped tokens",
      "Cognito Sync — it synchronizes user data and grants resource access"
    ],
    "a": 1,
    "e": "Cognito Identity Pools (Federated Identities) take an authenticated identity (from User Pools, Google, Facebook, SAML, etc.) and call STS AssumeRoleWithWebIdentity to return temporary AWS credentials. These credentials are scoped to an IAM role. User Pools handle authentication (sign-up, sign-in, MFA) and issue JWT tokens — but JWTs alone cannot authorize AWS API calls. You typically use both: User Pools for auth, Identity Pools to exchange the JWT for IAM credentials."
  },
  {
    "id": "aws-006",
    "d": 1,
    "t": "Design Secure Architectures",
    "q": "A financial services company must encrypt data at rest using hardware security modules (HSMs) that they control exclusively. AWS must have NO access to the encryption keys. Which solution meets this requirement?",
    "o": [
      "AWS KMS with customer-managed keys (CMK)",
      "AWS KMS with AWS-managed keys",
      "AWS CloudHSM with customer-managed keys",
      "S3 server-side encryption with SSE-S3"
    ],
    "a": 2,
    "e": "CloudHSM provisions dedicated HSM hardware in your VPC that only you control. You manage all keys — AWS has no access to the key material. KMS (even CMK) is a managed service where AWS operates the underlying HSMs and has administrative access to the infrastructure (though not to your specific key material under the shared responsibility model). For true single-tenant HSM control with zero AWS key access, CloudHSM is the answer. SSE-S3 uses AWS-managed keys entirely."
  },
  {
    "id": "aws-007",
    "d": 1,
    "t": "Design Secure Architectures",
    "q": "An e-commerce site is experiencing SQL injection and cross-site scripting (XSS) attacks targeting the web application layer. The security team wants to block these attacks with MINIMAL changes to the application code. Which AWS service should they deploy?",
    "o": [
      "AWS Shield Advanced — it provides L7 DDoS protection",
      "AWS WAF — it inspects HTTP/HTTPS requests and blocks based on rules",
      "Security Groups — configure to block malicious IP ranges",
      "Amazon Inspector — it scans for vulnerabilities in the application"
    ],
    "a": 1,
    "e": "AWS WAF (Web Application Firewall) operates at Layer 7 and uses managed rule groups (including AWS Managed Rules for SQL injection and XSS) to inspect and block malicious HTTP/HTTPS requests before they reach the application. No code changes needed — deploy WAF in front of ALB, CloudFront, or API Gateway. Shield Advanced protects against volumetric DDoS (L3/L4) but doesn't inspect application-layer payloads. Security Groups operate at L4 (IP/port) and can't parse HTTP body content. Inspector scans EC2/containers for vulnerabilities but doesn't provide runtime request filtering."
  },
  {
    "id": "aws-008",
    "d": 1,
    "t": "Design Secure Architectures",
    "q": "A company has a VPC with public and private subnets. EC2 instances in the private subnet need to communicate with the internet (for software updates) but must NOT be reachable from the internet. Additionally, they need to block specific IP ranges from reaching instances in the public subnet. Which combination of services should be used?",
    "o": [
      "NAT Gateway for outbound; Security Groups for IP blocking",
      "NAT Gateway for outbound; Network ACLs for IP blocking",
      "Internet Gateway with Elastic IP for outbound; Security Groups for IP blocking",
      "NAT Instance for outbound; Network ACLs for IP blocking"
    ],
    "a": 1,
    "e": "NAT Gateway enables outbound internet access for private subnet instances without allowing inbound connections — it's stateful NAT. Network ACLs (NACLs) are stateless, subnet-level firewalls that can block specific IP ranges (both inbound and outbound) and apply to all instances in the subnet. Security Groups are stateful and operate at the instance level — they don't support Deny rules (only Allow), so you can't explicitly block an IP range with Security Groups. NACLs support explicit Deny rules, making them the right tool for IP range blocking."
  },
  {
    "id": "aws-009",
    "d": 1,
    "t": "Design Secure Architectures",
    "q": "A company uses AWS Organizations with multiple accounts. They want to ensure no account can disable AWS CloudTrail logging, regardless of account-level IAM policies. What is the MOST effective control?",
    "o": [
      "Create an IAM policy in each account that denies cloudtrail:StopLogging",
      "Use an SCP (Service Control Policy) at the Organization root to deny cloudtrail:StopLogging",
      "Enable CloudTrail with log file validation and MFA delete",
      "Use AWS Config to detect and auto-remediate CloudTrail disablement"
    ],
    "a": 1,
    "e": "Service Control Policies (SCPs) attached to the organization root apply to ALL accounts in the organization (except the management account) and act as permission guardrails — even account administrators cannot override them. An SCP denying cloudtrail:StopLogging means no identity in any member account can stop logging, regardless of their IAM permissions. Account-level IAM policies only affect users/roles in that account and account admins can remove them. AWS Config detects violations after the fact — CloudTrail could be stopped for a window of time before remediation."
  },
  {
    "id": "aws-010",
    "d": 1,
    "t": "Design Secure Architectures",
    "q": "A company must ensure that data transferred between their on-premises data center and AWS is encrypted in transit and that the connection is dedicated (not shared with other AWS customers). Which connectivity option should they use?",
    "o": [
      "AWS Site-to-Site VPN over the public internet",
      "AWS Direct Connect (without encryption)",
      "AWS Direct Connect with MACsec or a VPN over Direct Connect",
      "VPC Endpoint with PrivateLink"
    ],
    "a": 2,
    "e": "Direct Connect provides a dedicated, private physical connection (not shared internet) to AWS — but by itself Direct Connect traffic is NOT encrypted. For both dedicated AND encrypted, you need either: (1) MACsec encryption on the Direct Connect link (Layer 2 encryption), or (2) IPsec VPN tunnel over Direct Connect (using a Virtual Private Gateway). Site-to-Site VPN encrypts traffic but uses the shared public internet, not a dedicated connection. VPC Endpoints/PrivateLink are for private connectivity to AWS services within AWS — they don't connect on-premises networks."
  },
  {
    "id": "aws-011",
    "d": 1,
    "t": "Design Secure Architectures",
    "q": "An application uses S3 to store user-uploaded files. The security team discovers that the S3 bucket has been inadvertently made public. Which setting provides a single, account-level guardrail to prevent ANY S3 bucket in the account from becoming public, even if someone sets a bucket policy allowing public access?",
    "o": [
      "S3 Object Ownership set to Bucket owner enforced",
      "S3 Block Public Access at the account level",
      "An SCP denying s3:PutBucketPolicy",
      "S3 Versioning with MFA delete enabled"
    ],
    "a": 1,
    "e": "S3 Block Public Access (account level) is a single toggle that overrides any bucket-level ACL or policy that would grant public access. Even if a developer misconfigures a bucket policy, Block Public Access vetoes it. This is the intended use of the setting — an account-wide guardrail. Object Ownership prevents ACL-based access but doesn't block public bucket policies. An SCP blocking s3:PutBucketPolicy would also block all legitimate bucket policies. Versioning + MFA delete protects against deletion, not public exposure."
  },
  {
    "id": "aws-012",
    "d": 1,
    "t": "Design Secure Architectures",
    "q": "A company runs a multi-account AWS environment. A central security team needs to aggregate and analyze security findings from GuardDuty, Security Hub, and Inspector across all accounts without giving the security team access to each member account. What is the RECOMMENDED architecture?",
    "o": [
      "Create cross-account IAM roles in each member account for the security team",
      "Use AWS Organizations to designate a Security Hub delegated administrator account that aggregates findings",
      "Export all findings to S3 in each account and process them centrally with Athena",
      "Install a third-party SIEM agent on EC2 in each account"
    ],
    "a": 1,
    "e": "AWS Security Hub supports a delegated administrator account via AWS Organizations. When configured, Security Hub automatically aggregates findings from GuardDuty, Inspector, Macie, and other services across all member accounts into the central security account — no individual account access needed. Cross-account IAM roles require management of N roles and direct account access. S3 export works but has high operational overhead and latency. A third-party SIEM adds cost and complexity unnecessarily when native AWS tooling handles this pattern."
  },
  {
    "id": "aws-013",
    "d": 2,
    "t": "Design Resilient Architectures",
    "q": "A company runs a critical RDS MySQL database. They need the database to automatically failover to a standby within 60–120 seconds if the primary fails, with no data loss. Which RDS feature should they use?",
    "o": [
      "RDS Read Replica in a different AZ",
      "RDS Multi-AZ deployment with synchronous replication",
      "RDS automated backups with point-in-time recovery",
      "Aurora Global Database with a secondary region"
    ],
    "a": 1,
    "e": "RDS Multi-AZ maintains a synchronous standby replica in a different AZ. Synchronous replication means every write is committed on the standby before acknowledging — zero data loss (RPO=0). Failover is automatic and typically completes in 60–120 seconds. Read Replicas use asynchronous replication (potential data loss) and are not for automatic failover. Automated backups enable point-in-time recovery but require manual restore (high RTO). Aurora Global Database is for cross-region disaster recovery, not single-region HA."
  },
  {
    "id": "aws-014",
    "d": 2,
    "t": "Design Resilient Architectures",
    "q": "An application uses SQS to decouple components. The processing service must ensure that each message is processed EXACTLY ONCE and that messages are processed in the EXACT ORDER they are received. Which SQS queue type should be used?",
    "o": [
      "Standard SQS queue with a visibility timeout",
      "SQS FIFO queue",
      "Standard SQS queue with message deduplication enabled",
      "SQS FIFO queue with content-based deduplication"
    ],
    "a": 3,
    "e": "FIFO queues guarantee ordering (first-in, first-out) and exactly-once processing within a 5-minute deduplication window. Content-based deduplication uses a SHA-256 hash of the message body to automatically detect and discard duplicates without requiring the sender to generate a deduplication ID. Standard queues offer at-least-once delivery (duplicates possible) and best-effort ordering (not strict). Option A (Standard + visibility timeout) prevents concurrent processing but doesn't guarantee ordering or exactly-once. Option C doesn't exist — Standard queues don't have a deduplication feature."
  },
  {
    "id": "aws-015",
    "d": 2,
    "t": "Design Resilient Architectures",
    "q": "A company's e-commerce website must remain available during a Regional AWS failure. They have an RTO of 1 hour and RPO of 15 minutes. Which disaster recovery strategy is MOST appropriate?",
    "o": [
      "Backup and Restore — replicate backups to another region and restore when needed",
      "Pilot Light — replicate data continuously but keep minimal resources running in the DR region",
      "Warm Standby — maintain a scaled-down but fully functional version in the DR region",
      "Active-Active Multi-Region — run full workloads in multiple regions simultaneously"
    ],
    "a": 2,
    "e": "Warm Standby keeps a scaled-down but fully functional environment in the DR region, continuously receiving data replication. RTO is 10–30 minutes (scale up resources) and RPO is near-zero. Backup and Restore has RTO of hours (restore time) — doesn't meet the 1-hour RTO. Pilot Light keeps only the core data replicated with no running servers — RTO is 30–60 minutes (provision servers), which is borderline but less reliable than Warm Standby. Active-Active meets the RTO/RPO but costs 2x because full production capacity runs in both regions — overengineered for the given requirements."
  },
  {
    "id": "aws-016",
    "d": 2,
    "t": "Design Resilient Architectures",
    "q": "A company needs to distribute traffic across EC2 instances and requires support for both HTTP/HTTPS (Layer 7 routing by path and host) AND TCP/UDP (Layer 4) traffic on the same load balancer endpoint. Which load balancer type should they use?",
    "o": [
      "Application Load Balancer (ALB)",
      "Network Load Balancer (NLB)",
      "Classic Load Balancer (CLB)",
      "Neither — use Route 53 with health checks instead"
    ],
    "a": 1,
    "e": "This is a tricky question. NLB operates at Layer 4 (TCP/UDP/TLS) with ultra-low latency and static IP addresses. While ALB handles HTTP/HTTPS routing (Layer 7), it cannot handle raw TCP/UDP. However, you CAN put an ALB behind an NLB — but the question asks for one load balancer. If the requirement is strictly both L7 HTTP routing AND raw TCP/UDP on the same endpoint, the architecture would use NLB fronting an ALB. For this scenario, NLB is the foundational choice. CLB is legacy and supports both layers but lacks modern features like path-based routing. Route 53 doesn't load-balance at the request level."
  },
  {
    "id": "aws-017",
    "d": 2,
    "t": "Design Resilient Architectures",
    "q": "A microservices application publishes events to multiple downstream services (email, analytics, audit log). Adding a new service should not require changes to the publisher. Which messaging pattern provides the LEAST operational overhead to add new subscribers?",
    "o": [
      "SQS standard queue — the publisher sends to one queue, consumers poll it",
      "SNS topic with SQS subscriptions (fan-out pattern)",
      "Amazon Kinesis Data Streams — all consumers read from the same stream",
      "EventBridge with a custom event bus"
    ],
    "a": 1,
    "e": "The SNS fan-out pattern is the canonical answer: the publisher sends one message to an SNS topic, and SNS fans it out to all subscribers (SQS queues, Lambda functions, HTTP endpoints, email). Adding a new subscriber means creating a new SQS queue and subscribing it to the topic — zero changes to the publisher. SQS standard queue allows only one consumer to process each message (not fan-out). Kinesis supports multiple consumers but is designed for ordered streaming data, not event fan-out, and has higher operational overhead. EventBridge is also valid for this pattern but SNS+SQS fan-out is the more classic and tested answer."
  },
  {
    "id": "aws-018",
    "d": 2,
    "t": "Design Resilient Architectures",
    "q": "A web application uses Route 53 for DNS. During a regional outage, the company wants traffic to automatically shift to a healthy secondary region. The health check should be based on whether the application endpoint returns a 200 OK response. Which Route 53 routing policy should they use?",
    "o": [
      "Weighted routing with a 90/10 split between primary and secondary",
      "Latency-based routing targeting the two regions",
      "Failover routing with a health check on the primary endpoint",
      "Geolocation routing targeting the user's country"
    ],
    "a": 2,
    "e": "Route 53 Failover routing is designed exactly for this use case: designate one record as Primary and one as Secondary. Route 53 monitors the primary with a health check; if it fails, Route 53 automatically returns the secondary record. Weighted routing splits traffic by percentage but doesn't fail over automatically — if the primary is down, its percentage of requests still fail. Latency-based routing routes to the lowest-latency region but doesn't automatically remove an unhealthy region. Geolocation routing is based on user location, not endpoint health."
  },
  {
    "id": "aws-019",
    "d": 2,
    "t": "Design Resilient Architectures",
    "q": "A company is designing a global application using Aurora. They need read replicas in multiple regions to serve local users with low latency AND automatic failover to another region if the primary region fails. Which Aurora feature meets BOTH requirements?",
    "o": [
      "Aurora Multi-AZ — provides replicas across multiple AZs within one region",
      "Aurora Global Database — provides cross-region read replicas with sub-second replication lag and managed failover",
      "Aurora with cross-region read replicas (standard replication)",
      "RDS Multi-AZ with cross-region automated backup restore"
    ],
    "a": 1,
    "e": "Aurora Global Database uses dedicated replication infrastructure (not the database engine) to achieve sub-second cross-region replication with typically <1s lag. It supports up to 5 secondary regions with up to 16 read replicas per region. For DR, a secondary region can be promoted to primary in <1 minute. Aurora Multi-AZ is single-region only. Standard Aurora cross-region read replicas use the MySQL/PostgreSQL binary log replication (higher latency, more replication lag, slower failover than Global Database). RDS Multi-AZ can't serve cross-region reads."
  },
  {
    "id": "aws-020",
    "d": 2,
    "t": "Design Resilient Architectures",
    "q": "An Auto Scaling group launches EC2 instances behind an ALB. During a deployment, the team wants to add new instances with the new version before terminating old instances, ensuring zero downtime and the ability to quickly roll back. Which deployment strategy should they use?",
    "o": [
      "Rolling update — replace old instances gradually in batches",
      "Blue/Green deployment — create a new ASG (green) and switch ALB traffic",
      "In-place update — update the existing instances one at a time",
      "Canary deployment — send 1% of traffic to new instances to test"
    ],
    "a": 1,
    "e": "Blue/Green deployment creates a completely separate 'green' environment with the new version. Both environments run simultaneously, and you switch the ALB target group from blue to green. Rollback is instant — switch back to the blue target group. Zero downtime is guaranteed because new instances are fully healthy and registered before any traffic shifts. Rolling updates reduce instances incrementally — if the new version is bad, you must roll forward again (slower rollback). In-place updates are the same as rolling. Canary is good for gradual rollout but doesn't provide instant rollback to a parallel environment."
  },
  {
    "id": "aws-021",
    "d": 2,
    "t": "Design Resilient Architectures",
    "q": "A company processes financial transactions using SQS. Some messages fail processing and need to be isolated for debugging without blocking the main queue. What is the RECOMMENDED approach?",
    "o": [
      "Delete failed messages and write them to an S3 bucket for later analysis",
      "Configure a Dead-Letter Queue (DLQ) to receive messages after maxReceiveCount failures",
      "Increase the visibility timeout so failed messages stay invisible longer",
      "Use SQS FIFO to prevent failed messages from blocking subsequent messages"
    ],
    "a": 1,
    "e": "A Dead-Letter Queue automatically receives messages that fail processing after exceeding the maxReceiveCount threshold. This isolates problematic messages for debugging without blocking healthy messages. Deleting messages loses data permanently. Increasing visibility timeout delays reprocessing but eventually the message re-appears and will keep failing, causing processing loops. FIFO queues guarantee ordering but don't prevent failed messages from blocking — in fact, in a FIFO queue without a DLQ, a failing message blocks all subsequent messages in the same message group."
  },
  {
    "id": "aws-022",
    "d": 2,
    "t": "Design Resilient Architectures",
    "q": "An application serves users globally. The architecture must remain operational even if a full AWS Region becomes unavailable, with an RPO near zero. The application uses DynamoDB. Which architecture achieves this?",
    "o": [
      "DynamoDB with Point-in-Time Recovery (PITR) enabled",
      "DynamoDB Global Tables with multi-region, multi-master replication",
      "DynamoDB with cross-region backups restored on failure",
      "DynamoDB Streams with a Lambda function that replicates writes to another region"
    ],
    "a": 1,
    "e": "DynamoDB Global Tables provides multi-region, multi-active (multi-master) replication. All regions can accept reads AND writes simultaneously, with sub-second replication. If a region fails, Route 53 or the app can redirect to another region instantly — RPO approaches zero. PITR is backup/restore with RPO equal to the time since last recovery point. Cross-region backups require manual restore (high RTO, RPO not near zero). DynamoDB Streams + Lambda is a DIY replication approach with operational overhead and potential replication lag; Global Tables is the managed version of this pattern."
  },
  {
    "id": "aws-023",
    "d": 3,
    "t": "Design High-Performing Architectures",
    "q": "A data analytics application runs complex in-memory calculations on datasets up to 2TB in RAM. The EC2 instance must have the highest possible memory-to-vCPU ratio. Which EC2 instance family should they choose?",
    "o": [
      "C7g (Compute Optimized) — highest vCPU count",
      "R7i (Memory Optimized) — high memory-to-vCPU ratio",
      "P4d (Accelerated Computing) — GPUs for ML workloads",
      "I4i (Storage Optimized) — high NVMe SSD throughput"
    ],
    "a": 1,
    "e": "Memory Optimized instances (R-family, X-family, z1d) are designed for workloads requiring large amounts of RAM. The R7i provides up to 768 GiB RAM with high memory-to-vCPU ratios, ideal for in-memory analytics, in-memory databases, and real-time processing of large datasets. Compute Optimized (C-family) maximizes vCPU count, not memory. Accelerated Computing (P/G/Inf) adds GPU/FPGA for ML/rendering — overkill and wrong fit for RAM-intensive analytics. Storage Optimized (I/D/H families) maximizes local NVMe or HDD throughput for I/O-intensive workloads."
  },
  {
    "id": "aws-024",
    "d": 3,
    "t": "Design High-Performing Architectures",
    "q": "A database application requires consistent, low-latency disk I/O with a minimum of 64,000 IOPS and the ability to dynamically adjust IOPS without downtime. Which EBS volume type should they use?",
    "o": [
      "gp3 (General Purpose SSD) — up to 16,000 IOPS",
      "gp2 (General Purpose SSD) — IOPS scales with volume size",
      "io2 Block Express — up to 256,000 IOPS with independent IOPS/throughput adjustment",
      "st1 (Throughput Optimized HDD) — high sequential throughput"
    ],
    "a": 2,
    "e": "io2 Block Express supports up to 256,000 IOPS per volume with sub-millisecond latency, and IOPS and throughput can be independently provisioned and modified without downtime. It's designed for I/O-intensive databases like Oracle, SQL Server, and SAP HANA. gp3 caps at 16,000 IOPS — insufficient for 64,000 IOPS requirement. gp2 scales IOPS with volume size (3 IOPS/GiB) and is even more limited (max 16,000 IOPS). st1 is a magnetic HDD designed for sequential, high-throughput workloads (Hadoop, log processing) — poor for random I/O patterns like databases."
  },
  {
    "id": "aws-025",
    "d": 3,
    "t": "Design High-Performing Architectures",
    "q": "A read-heavy web application experiences high latency on RDS MySQL queries for frequently accessed, infrequently updated data. The team wants to reduce database load with MINIMAL code changes. Which solution provides the BEST read performance improvement?",
    "o": [
      "Add RDS Read Replicas and update the application to route reads to replicas",
      "Enable RDS Performance Insights to identify slow queries",
      "Deploy ElastiCache for Redis as a caching layer in front of RDS",
      "Increase RDS instance class to a larger instance type"
    ],
    "a": 2,
    "e": "ElastiCache for Redis caches query results in memory (sub-millisecond latency) — frequently accessed data is served from cache without hitting the database at all. This dramatically reduces both latency and RDS load. The 'minimal code changes' caveat means connection string changes + cache-aside logic. Read Replicas distribute read load but queries still hit the database (millisecond latency vs sub-millisecond cache). Performance Insights is a diagnostic tool, not a performance fix. Scaling the instance improves throughput but data must still be fetched from disk — doesn't achieve cache-level latency."
  },
  {
    "id": "aws-026",
    "d": 3,
    "t": "Design High-Performing Architectures",
    "q": "A media company serves static assets (images, videos, JS/CSS) globally. Users in Asia report high latency when downloading content stored in S3 (us-east-1). What is the MOST effective solution to reduce latency for Asian users with MINIMAL operational overhead?",
    "o": [
      "Move the S3 bucket to the ap-southeast-1 region",
      "Enable S3 Transfer Acceleration on the bucket",
      "Deploy CloudFront with the S3 bucket as origin",
      "Create S3 buckets in each region and use Route 53 geolocation routing"
    ],
    "a": 2,
    "e": "CloudFront is a CDN with 400+ edge locations globally. Content is cached at the nearest edge location to the user — subsequent requests are served from the edge with sub-10ms latency. Moving the bucket closer helps users in that region but hurts others. S3 Transfer Acceleration speeds up uploads to S3 (not downloads), using CloudFront edge locations to accelerate data transfer TO S3. Multi-region S3 with Route 53 is operationally complex (requires managing multiple buckets, sync between regions) and has high overhead compared to CloudFront."
  },
  {
    "id": "aws-027",
    "d": 3,
    "t": "Design High-Performing Architectures",
    "q": "A gaming application needs a database that can handle millions of requests per second with single-digit millisecond latency. The data model is simple key-value lookups and the dataset fits in memory. Which AWS service is MOST suitable?",
    "o": [
      "Amazon RDS Aurora — scales to millions of reads with read replicas",
      "Amazon DynamoDB with DAX — microsecond latency for read-heavy workloads",
      "Amazon ElastiCache for Redis — in-memory key-value store with sub-millisecond latency",
      "Amazon Redshift — columnar database optimized for analytical queries"
    ],
    "a": 1,
    "e": "DynamoDB with DAX (DynamoDB Accelerator) is purpose-built for this pattern. DynamoDB scales to any throughput and DAX is a fully managed, in-memory cache for DynamoDB that provides microsecond latency for read-heavy workloads, with automatic cache invalidation. ElastiCache Redis is a general-purpose in-memory store but requires you to manage cache invalidation and consistency with the backing store — more operational overhead. Aurora requires schema design and doesn't reach millions of RPS easily. Redshift is OLAP/analytics — completely wrong for key-value gaming workloads."
  },
  {
    "id": "aws-028",
    "d": 3,
    "t": "Design High-Performing Architectures",
    "q": "A company needs to ingest and process a continuous stream of IoT sensor data (10,000 events/second) and store it for real-time analytics. They want to replay the stream for up to 7 days. Which service should they use?",
    "o": [
      "Amazon SQS FIFO — ordered queue for IoT events",
      "Amazon SNS — pub/sub messaging for real-time delivery",
      "Amazon Kinesis Data Streams — real-time streaming with configurable retention",
      "Amazon MQ — managed message broker for streaming"
    ],
    "a": 2,
    "e": "Kinesis Data Streams is designed for high-throughput, real-time data streaming. It supports data retention from 1 to 365 days (configurable), enabling replay of historical data. Multiple consumers can independently read from the same stream at different positions. SQS messages are deleted after processing (no replay). SNS delivers messages to subscribers at the time of publish — no retention or replay capability. Amazon MQ is for migrating existing applications using standard protocols (AMQP, MQTT) — not designed for high-throughput streaming analytics."
  },
  {
    "id": "aws-029",
    "d": 3,
    "t": "Design High-Performing Architectures",
    "q": "A shared file system needs to be simultaneously mounted on hundreds of EC2 Linux instances across multiple AZs. The workload is HPC (High Performance Computing) with parallel read/write operations. Which AWS storage service should they use?",
    "o": [
      "Amazon EFS (Elastic File System) — managed NFS for Linux instances",
      "Amazon FSx for Windows File Server — SMB protocol for Windows",
      "Amazon FSx for Lustre — high-performance parallel file system for HPC",
      "Amazon EBS Multi-Attach — attach one EBS volume to multiple instances"
    ],
    "a": 2,
    "e": "FSx for Lustre is a managed implementation of the Lustre parallel file system, purpose-built for HPC, ML training, and data analytics. It delivers sub-millisecond latency and hundreds of GB/s of throughput with millions of IOPS. It can also be linked directly to S3. EFS is a good general-purpose NFS solution (supports concurrent Linux mounts) but has lower performance than Lustre for HPC parallel workloads. FSx for Windows uses SMB protocol — incompatible with Linux HPC workloads. EBS Multi-Attach (io1/io2 only) is limited to a single AZ and up to 16 instances — not suitable for hundreds of instances across AZs."
  },
  {
    "id": "aws-030",
    "d": 3,
    "t": "Design High-Performing Architectures",
    "q": "An application stores user session data in S3. Hot data (accessed within 30 days) needs millisecond access, data accessed between 30-90 days needs lower-cost storage, and data older than 90 days should be archived cheaply with retrieval within 12 hours. What S3 lifecycle policy achieves LOWEST storage cost?",
    "o": [
      "S3 Standard → S3 Standard-IA (30 days) → S3 Glacier Flexible Retrieval (90 days)",
      "S3 Standard → S3 Intelligent-Tiering → S3 Glacier Deep Archive (90 days)",
      "S3 Standard → S3 One Zone-IA (30 days) → S3 Glacier Deep Archive (90 days)",
      "S3 Standard → S3 Standard-IA (30 days) → S3 Glacier Deep Archive (90 days)"
    ],
    "a": 0,
    "e": "S3 Standard → Standard-IA (at 30 days) → Glacier Flexible Retrieval (at 90 days) matches the requirements. Glacier Flexible Retrieval offers retrieval within 1-12 hours — meeting the '12-hour retrieval' requirement. Glacier Deep Archive is cheaper but retrieval takes up to 48 hours — exceeds the 12-hour SLA. Standard-IA at 30 days reduces cost for infrequently accessed data. One Zone-IA is cheaper than Standard-IA but stores data in only one AZ — acceptable for session data but riskier. Intelligent-Tiering has a per-object monitoring fee that may not be cost-effective for small objects."
  },
  {
    "id": "aws-031",
    "d": 3,
    "t": "Design High-Performing Architectures",
    "q": "A DynamoDB table experiences hot partitions because most reads target items with the same partition key. The access pattern is read-heavy with a 95% cache hit rate expected. Which solution reduces hot partition load with MINIMUM code changes?",
    "o": [
      "Switch to a composite sort key to distribute writes across partitions",
      "Enable DynamoDB Accelerator (DAX) to cache reads transparently",
      "Use DynamoDB Streams to replicate hot data to ElastiCache",
      "Implement application-level caching with an in-memory HashMap"
    ],
    "a": 1,
    "e": "DAX is API-compatible with DynamoDB — you just point the SDK to the DAX cluster endpoint instead of the DynamoDB endpoint. DAX caches item-level reads and query results, serving 95%+ reads from cache and virtually eliminating hot partition reads. Minimum code change: one endpoint URL change. Changing the partition key requires table redesign and data migration. DynamoDB Streams + ElastiCache requires building and maintaining a custom sync pipeline. Application-level HashMap has no persistence, no cluster support, and inconsistency problems — more code, not less."
  },
  {
    "id": "aws-032",
    "d": 4,
    "t": "Design Cost-Optimized Architectures",
    "q": "A company runs a batch processing workload on EC2 every night from 11 PM to 5 AM. The job can tolerate interruptions and automatically checkpoints progress. Which EC2 pricing model provides the LOWEST cost?",
    "o": [
      "On-Demand Instances — pay per hour with no commitment",
      "Reserved Instances (1-year, No Upfront) — committed pricing for steady workloads",
      "Spot Instances — bid on spare EC2 capacity at up to 90% discount",
      "Dedicated Hosts — predictable pricing for compliance requirements"
    ],
    "a": 2,
    "e": "Spot Instances are up to 90% cheaper than On-Demand. They can be interrupted with 2-minute notice, but since the workload tolerates interruptions and checkpoints progress, interruptions are recoverable. The fixed 11 PM–5 AM schedule and fault-tolerance make this ideal for Spot. On-Demand has no discount. Reserved Instances (1-year commitment) are best for steady 24/7 workloads — paying for reserved capacity that's idle 18 hours/day wastes money. Dedicated Hosts are most expensive and needed only for per-socket/per-core licensing or compliance, not cost optimization."
  },
  {
    "id": "aws-033",
    "d": 4,
    "t": "Design Cost-Optimized Architectures",
    "q": "A company has EC2 instances running 24/7 for a production web application that will run for at least 3 years. They want to MAXIMIZE cost savings. Which pricing model should they use?",
    "o": [
      "On-Demand Instances — maximum flexibility",
      "Spot Instances — lowest cost for interruptible workloads",
      "Reserved Instances (3-year, All Upfront) — maximum discount for long-term commitment",
      "Savings Plans (Compute) — flexible commitment with significant discounts"
    ],
    "a": 2,
    "e": "3-year All Upfront Reserved Instances provide the maximum possible discount (up to 72% off On-Demand) for a committed, steady-state workload. All Upfront pays the entire cost at the start for the deepest discount. Compute Savings Plans provide flexibility across instance families, regions, and OS (useful if instance needs may change) but offer slightly less discount than RIs. Spot Instances are not for production workloads that must run 24/7 without interruption. On-Demand has no discount."
  },
  {
    "id": "aws-034",
    "d": 4,
    "t": "Design Cost-Optimized Architectures",
    "q": "A startup has a REST API with unpredictable traffic — some days almost no requests, other days thousands per second. The API logic is stateless. They want MINIMUM cost while handling any traffic volume. Which architecture is MOST cost-effective?",
    "o": [
      "EC2 t3.micro On-Demand instances with Auto Scaling",
      "EC2 Reserved Instances behind an ALB",
      "AWS Lambda with API Gateway",
      "ECS Fargate with an ALB"
    ],
    "a": 2,
    "e": "Lambda + API Gateway is ideal for variable, spiky workloads. Lambda charges only when code executes (per-millisecond billing) with a free tier of 1 million requests/month. When traffic is near-zero, costs are near-zero. It scales automatically from 0 to thousands of concurrent executions. EC2 t3.micro runs 24/7 even during idle periods — you pay for uptime, not usage. Reserved EC2 requires a commitment — wasteful for unpredictable traffic. ECS Fargate is also serverless containers but has minimum task duration charges and is more expensive than Lambda for intermittent workloads."
  },
  {
    "id": "aws-035",
    "d": 4,
    "t": "Design Cost-Optimized Architectures",
    "q": "A company stores 500TB of log files in S3 Standard. Analysis shows 90% of logs are never accessed after 30 days and are kept only for compliance (7-year retention, occasional audit retrieval within 48 hours). Which action provides the GREATEST cost reduction?",
    "o": [
      "Enable S3 Intelligent-Tiering for automatic cost optimization",
      "Move logs to S3 Standard-IA after 30 days",
      "Move logs to S3 Glacier Deep Archive after 30 days",
      "Enable S3 Versioning to avoid accidental deletion costs"
    ],
    "a": 2,
    "e": "S3 Glacier Deep Archive is the cheapest AWS storage class (~$0.00099/GB/month vs $0.023/GB for Standard — ~95% cheaper). For compliance data that's accessed rarely with 48-hour acceptable retrieval time, it's the optimal choice. With 500TB, the monthly savings are ~$11,000. Intelligent-Tiering optimizes cost automatically but adds per-object monitoring fees and doesn't reach Glacier Deep Archive pricing. Standard-IA is cheaper than Standard but far more expensive than Glacier. S3 Versioning adds cost by retaining old versions — opposite of cost optimization."
  },
  {
    "id": "aws-036",
    "d": 4,
    "t": "Design Cost-Optimized Architectures",
    "q": "Instances in a private subnet use a NAT Gateway to access the internet. The team discovers 80% of the NAT Gateway traffic is going to an S3 bucket in the same region, costing hundreds of dollars monthly in NAT data processing fees. What is the MOST cost-effective fix?",
    "o": [
      "Move the EC2 instances to a public subnet to eliminate NAT Gateway charges",
      "Create a VPC Gateway Endpoint for S3 — traffic routes through the VPC network, not NAT",
      "Enable S3 Transfer Acceleration to reduce data transfer costs",
      "Compress data before sending to S3 to reduce transfer volume"
    ],
    "a": 1,
    "e": "VPC Gateway Endpoints for S3 (and DynamoDB) are free — no hourly charge and no per-GB data processing fee. Traffic from private subnet instances to S3 routes through the AWS private network via the endpoint, completely bypassing the NAT Gateway. NAT Gateway charges $0.045/GB of data processed — for high-volume S3 access this is significant. Moving to public subnets exposes instances directly to the internet — bad for security. S3 Transfer Acceleration speeds up uploads from the internet TO S3 — irrelevant here. Compression helps but doesn't eliminate the NAT cost structure."
  },
  {
    "id": "aws-037",
    "d": 4,
    "t": "Design Cost-Optimized Architectures",
    "q": "A company runs diverse EC2 workloads across multiple instance families and regions. They want to reduce EC2 costs without committing to specific instance types. They expect compute needs to evolve over the next year. Which pricing model offers the BEST flexibility vs. savings trade-off?",
    "o": [
      "Standard Reserved Instances — locked to a specific instance type and region",
      "Convertible Reserved Instances — can exchange for different instance types",
      "EC2 Instance Savings Plans — apply to specific instance family in a region",
      "Compute Savings Plans — apply to any EC2, Lambda, and Fargate usage"
    ],
    "a": 3,
    "e": "Compute Savings Plans provide up to 66% savings and apply to ANY EC2 instance regardless of family, size, region, OS, or tenancy — plus Lambda and Fargate. This is maximum flexibility for evolving workloads. EC2 Instance Savings Plans offer slightly higher discounts (up to 72%) but are locked to a specific instance family in a region. Standard RIs lock to a specific instance type/region/OS/tenancy. Convertible RIs allow exchanges but still require region commitment and have lower discounts than Savings Plans when considering the flexibility they offer."
  },
  {
    "id": "aws-038",
    "d": 4,
    "t": "Design Cost-Optimized Architectures",
    "q": "A company's AWS bill shows unexpectedly high costs. The team suspects underutilized EC2 instances and over-provisioned EBS volumes. Which AWS service automatically analyzes usage patterns and provides SPECIFIC rightsizing recommendations?",
    "o": [
      "AWS Cost Explorer — shows cost trends and forecasts",
      "AWS Trusted Advisor — provides best practice checks",
      "AWS Compute Optimizer — uses ML to recommend optimal resource configurations",
      "AWS Budgets — creates cost alerts and forecasts"
    ],
    "a": 2,
    "e": "AWS Compute Optimizer uses machine learning to analyze CloudWatch utilization metrics and recommends optimal EC2 instance types, Auto Scaling group configurations, EBS volumes, Lambda memory settings, and ECS on Fargate sizing. It provides specific 'change to X' recommendations with estimated savings. Cost Explorer shows spending trends but doesn't recommend specific resource changes. Trusted Advisor has basic rightsizing checks but Compute Optimizer provides deeper ML-based recommendations. AWS Budgets alerts you when you exceed thresholds but doesn't analyze or recommend changes."
  },
  {
    "id": "aws-039",
    "d": 4,
    "t": "Design Cost-Optimized Architectures",
    "q": "A development environment runs EC2 instances only during business hours (8 AM – 6 PM, Monday–Friday). Currently instances run 24/7. What is the SIMPLEST and MOST cost-effective solution to stop instances outside business hours?",
    "o": [
      "Use EC2 Auto Scaling with scheduled scaling actions to stop/start instances",
      "Create Lambda functions triggered by EventBridge Scheduler to stop/start instances",
      "Tag instances and use AWS Instance Scheduler (from AWS Solutions Library)",
      "Manually stop instances each evening and start them each morning"
    ],
    "a": 1,
    "e": "Lambda + EventBridge Scheduler (or EventBridge cron rules) is a simple, serverless, zero-cost solution: two EventBridge rules (start at 8 AM Mon-Fri, stop at 6 PM Mon-Fri) trigger Lambda functions that call the EC2 start/stop API. Running costs: essentially $0. Auto Scaling with scheduled actions works but is designed for scaling running fleets, not stopping all instances — and requires maintaining a launch template. AWS Instance Scheduler is more feature-rich (cost tracking, multiple timezones) but adds deployment overhead for a simple use case. Manual operation is unreliable and doesn't save consistently."
  },
  {
    "id": "aws-040",
    "d": 4,
    "t": "Design Cost-Optimized Architectures",
    "q": "A company uses an Aurora RDS cluster for a dev/test environment that only needs to run during testing (4 hours per day on average, unpredictably scheduled). They want minimum cost for this database. Which Aurora feature should they use?",
    "o": [
      "Aurora Serverless v2 — automatically scales capacity but runs continuously",
      "Aurora Serverless v1 — pauses when idle and resumes on connection",
      "Standard Aurora with the smallest available instance class (db.t3.medium)",
      "RDS Multi-AZ with the stop/start feature on a schedule"
    ],
    "a": 1,
    "e": "Aurora Serverless v1 (now Aurora Serverless v2 also supports pausing in some configurations, but v1's pause/resume is the classic exam answer) can be configured to pause after a period of inactivity. When paused, you pay only for storage — zero ACU (Aurora Capacity Unit) charges. When a connection arrives, it resumes in 25–30 seconds. For dev/test with 4 unpredictable hours/day, this dramatically reduces cost vs. continuous running. Aurora Serverless v2 scales smoothly but in current exam context doesn't pause to zero. Standard Aurora with small instance runs 24/7. RDS stop/start is limited to 7 days before auto-resuming."
  },
  {
    "id": "aws-041",
    "d": 1,
    "t": "Design Secure Architectures",
    "q": "A company wants to grant a third-party auditing firm access to their AWS account to review resources. The auditor should have read-only access and must authenticate using their OWN AWS account credentials (not a new IAM user in your account). Which approach follows AWS best practices?",
    "o": [
      "Create an IAM user for the auditor in your AWS account with ReadOnlyAccess policy",
      "Share your AWS root account credentials with the auditor temporarily",
      "Create an IAM role with ReadOnlyAccess and a trust policy allowing the auditor's AWS account to assume it",
      "Create an IAM user and issue temporary session credentials using AWS STS"
    ],
    "a": 2,
    "e": "Cross-account IAM roles are the AWS best practice for granting third-party access. You create an IAM role in YOUR account with ReadOnlyAccess, and the trust policy specifies the auditor's AWS account ID (and optionally a specific IAM user/role within it). The auditor assumes the role from their own account using STS AssumeRole — they use their own credentials, and the access is time-limited. Never share root credentials — violates security best practices fundamentally. Creating an IAM user requires managing long-term credentials. STS GetSessionToken is for your own users with MFA — not cross-account federation."
  },
  {
    "id": "aws-042",
    "d": 2,
    "t": "Design Resilient Architectures",
    "q": "A company processes orders through an SQS queue. Processing sometimes takes 45 minutes. Other consumers are receiving the same messages before the first consumer finishes, causing duplicate processing. What setting should be adjusted?",
    "o": [
      "Increase the message retention period to 7 days",
      "Increase the visibility timeout to at least 45 minutes",
      "Enable long polling on the queue",
      "Switch to a FIFO queue to prevent concurrent processing"
    ],
    "a": 1,
    "e": "Visibility timeout is the period during which SQS hides a message from other consumers after one consumer retrieves it. If processing takes 45 minutes but the visibility timeout is shorter (default: 30 seconds), the message becomes visible again before processing completes, allowing another consumer to pick it up — causing the duplicate processing. Setting the visibility timeout to ≥45 minutes (or extending it dynamically during processing) prevents this. Message retention period controls how long unprocessed messages stay in the queue — unrelated to duplication. Long polling reduces empty receive calls. FIFO ordering doesn't prevent re-delivery of the same message."
  },
  {
    "id": "aws-043",
    "d": 3,
    "t": "Design High-Performing Architectures",
    "q": "A machine learning training job on EC2 requires massive parallel floating-point computations across thousands of cores. The instances must communicate with each other with the LOWEST possible network latency between nodes. Which EC2 feature enables the lowest inter-instance latency?",
    "o": [
      "Enhanced Networking (ENA) — high bandwidth, low latency network interface",
      "Placement Groups (Cluster type) — packs instances close together in one AZ",
      "Elastic Fabric Adapter (EFA) — OS-bypass networking for HPC and ML",
      "EC2 Dedicated Hosts — dedicated physical servers"
    ],
    "a": 2,
    "e": "Elastic Fabric Adapter (EFA) enables OS-bypass networking — the MPI (Message Passing Interface) application communicates directly with the network hardware, bypassing the OS kernel. This eliminates kernel processing latency, enabling microsecond latencies and high inter-instance bandwidth for tightly-coupled HPC and distributed ML training. EFA is typically combined with a Cluster Placement Group. Enhanced Networking (ENA) significantly improves bandwidth and latency over standard networking but still uses the OS network stack. Cluster Placement Groups reduce physical network distance between instances but don't provide OS-bypass. Dedicated Hosts are for licensing/compliance."
  },
  {
    "id": "aws-044",
    "d": 4,
    "t": "Design Cost-Optimized Architectures",
    "q": "A company is evaluating two architectures for a new microservice: (A) EC2 t3.large instances (On-Demand) running 24/7, or (B) Lambda functions. The service handles 2 million requests/month averaging 200ms each. AWS Lambda free tier is 1 million requests + 400,000 GB-seconds/month. Which is MOST cost-effective?",
    "o": [
      "Architecture A — EC2 is always cheaper for services running all month",
      "Architecture B — Lambda charges only for actual compute time used",
      "Both cost the same — AWS prices them equivalently",
      "Architecture A — EC2 Reserved Instances would be cheapest with 1-year commitment"
    ],
    "a": 1,
    "e": "2M requests × 200ms = 400,000 seconds of compute. With 128MB memory Lambda: 400,000 GB-seconds × 0.0000166667 = ~$6.67/month + 2M requests × $0.0000002 = $0.40 = ~$7/month (after free tier). A t3.large On-Demand costs ~$60/month. Lambda is ~8x cheaper for this intermittent workload. EC2 Reserved Instances would reduce to ~$35/month (1-year) — still 5x more expensive. The key insight: Lambda excels when compute time is a small fraction of wall-clock time. EC2 becomes cost-competitive when requests arrive continuously (high utilization), but for 2M requests at 200ms, actual compute time is a tiny fraction of 30 days."
  }
],
    why: {
  "aws-001": [
    null,
    "Block Public Access prevents anonymous/public access but doesn't restrict authenticated IAM principals.",
    "This is the only mechanism that can restrict even the account owner.",
    "Block Public Access prevents anonymous/public access but doesn't restrict authenticated IAM principals."
  ],
  "aws-002": [
    "Disabling (deactivating) the keys blocks all API calls using those credentials within seconds, without breaking the IAM user or requiring knowledge of which services use the keys.",
    "Disabling (deactivating) the keys blocks all API calls using those credentials within seconds, without breaking the IAM user or requiring knowledge of which services use the keys.",
    null,
    "Disabling (deactivating) the keys blocks all API calls using those credentials within seconds, without breaking the IAM user or requiring knowledge of which services use the keys."
  ],
  "aws-003": [
    "The application uses the AWS SDK which automatically retrieves these credentials — no credential management required.",
    null,
    "The application uses the AWS SDK which automatically retrieves these credentials — no credential management required.",
    "The application uses the AWS SDK which automatically retrieves these credentials — no credential management required."
  ],
  "aws-004": [
    "Parameter Store (even Advanced/SecureString) requires custom Lambda functions for rotation and lacks the native RDS integration.",
    "Parameter Store (even Advanced/SecureString) requires custom Lambda functions for rotation and lacks the native RDS integration.",
    null,
    "Parameter Store (even Advanced/SecureString) requires custom Lambda functions for rotation and lacks the native RDS integration."
  ],
  "aws-005": [
    "These credentials are scoped to an IAM role.",
    null,
    "These credentials are scoped to an IAM role.",
    "User Pools handle authentication (sign-up, sign-in, MFA) and issue JWT tokens — but JWTs alone cannot authorize AWS API calls."
  ],
  "aws-006": [
    "You manage all keys — AWS has no access to the key material.",
    "You manage all keys — AWS has no access to the key material.",
    null,
    "SSE-S3 uses AWS-managed keys entirely."
  ],
  "aws-007": [
    "Shield Advanced protects against volumetric DDoS (L3/L4) but doesn't inspect application-layer payloads.",
    null,
    "Security Groups operate at L4 (IP/port) and can't parse HTTP body content.",
    "Shield Advanced protects against volumetric DDoS (L3/L4) but doesn't inspect application-layer payloads."
  ],
  "aws-008": [
    "Network ACLs (NACLs) are stateless, subnet-level firewalls that can block specific IP ranges (both inbound and outbound) and apply to all instances in the subnet.",
    null,
    "Network ACLs (NACLs) are stateless, subnet-level firewalls that can block specific IP ranges (both inbound and outbound) and apply to all instances in the subnet.",
    "Network ACLs (NACLs) are stateless, subnet-level firewalls that can block specific IP ranges (both inbound and outbound) and apply to all instances in the subnet."
  ],
  "aws-009": [
    "An SCP denying cloudtrail:StopLogging means no identity in any member account can stop logging, regardless of their IAM permissions.",
    null,
    "An SCP denying cloudtrail:StopLogging means no identity in any member account can stop logging, regardless of their IAM permissions.",
    "An SCP denying cloudtrail:StopLogging means no identity in any member account can stop logging, regardless of their IAM permissions."
  ],
  "aws-010": [
    "For both dedicated AND encrypted, you need either: (1) MACsec encryption on the Direct Connect link (Layer 2 encryption), or (2) IPsec VPN tunnel over Direct Connect (using a Virtual Private Gateway).",
    "For both dedicated AND encrypted, you need either: (1) MACsec encryption on the Direct Connect link (Layer 2 encryption), or (2) IPsec VPN tunnel over Direct Connect (using a Virtual Private Gateway).",
    null,
    "VPC Endpoints/PrivateLink are for private connectivity to AWS services within AWS — they don't connect on-premises networks."
  ],
  "aws-011": [
    "Even if a developer misconfigures a bucket policy, Block Public Access vetoes it.",
    null,
    "An SCP blocking s3:PutBucketPolicy would also block all legitimate bucket policies.",
    "Versioning + MFA delete protects against deletion, not public exposure."
  ],
  "aws-012": [
    "When configured, Security Hub automatically aggregates findings from GuardDuty, Inspector, Macie, and other services across all member accounts into the central security account — no individual account access needed.",
    null,
    "When configured, Security Hub automatically aggregates findings from GuardDuty, Inspector, Macie, and other services across all member accounts into the central security account — no individual account access needed.",
    "When configured, Security Hub automatically aggregates findings from GuardDuty, Inspector, Macie, and other services across all member accounts into the central security account — no individual account access needed."
  ],
  "aws-013": [
    "Read Replicas use asynchronous replication (potential data loss) and are not for automatic failover.",
    null,
    "Automated backups enable point-in-time recovery but require manual restore (high RTO).",
    "Aurora Global Database is for cross-region disaster recovery, not single-region HA."
  ],
  "aws-014": [
    "Standard queues offer at-least-once delivery (duplicates possible) and best-effort ordering (not strict).",
    "Incorrecto: \"SQS FIFO queue\" no es la arquitectura recomendada para este escenario. FIFO queues guarantee ordering (first-in, first-out) and exactly-once processing within a 5-minute deduplication window. Content-based deduplication uses a SHA-256 hash of the message body to automatically detect and discard duplicates without requiring the sender to generate a deduplication ID. Standard queues offer at-least-once delivery (duplicates possible) and best-effort ordering (not strict). Option A (Standard + visibility timeout) prevents concurrent processing but doesn't guarantee ordering or exactly-once. Option C doesn't exist — Standard queues don't have a deduplication feature.",
    "Content-based deduplication uses a SHA-256 hash of the message body to automatically detect and discard duplicates without requiring the sender to generate a deduplication ID.",
    null
  ],
  "aws-015": [
    "Backup and Restore has RTO of hours (restore time) — doesn't meet the 1-hour RTO.",
    "RTO is 10–30 minutes (scale up resources) and RPO is near-zero.",
    null,
    "Active-Active meets the RTO/RPO but costs 2x because full production capacity runs in both regions — overengineered for the given requirements."
  ],
  "aws-016": [
    "While ALB handles HTTP/HTTPS routing (Layer 7), it cannot handle raw TCP/UDP.",
    null,
    "However, you CAN put an ALB behind an NLB — but the question asks for one load balancer.",
    "If the requirement is strictly both L7 HTTP routing AND raw TCP/UDP on the same endpoint, the architecture would use NLB fronting an ALB."
  ],
  "aws-017": [
    "Adding a new subscriber means creating a new SQS queue and subscribing it to the topic — zero changes to the publisher.",
    null,
    "Kinesis supports multiple consumers but is designed for ordered streaming data, not event fan-out, and has higher operational overhead.",
    "Kinesis supports multiple consumers but is designed for ordered streaming data, not event fan-out, and has higher operational overhead."
  ],
  "aws-018": [
    "Route 53 monitors the primary with a health check; if it fails, Route 53 automatically returns the secondary record.",
    "Weighted routing splits traffic by percentage but doesn't fail over automatically — if the primary is down, its percentage of requests still fail.",
    null,
    "Weighted routing splits traffic by percentage but doesn't fail over automatically — if the primary is down, its percentage of requests still fail."
  ],
  "aws-019": [
    "It supports up to 5 secondary regions with up to 16 read replicas per region.",
    null,
    "It supports up to 5 secondary regions with up to 16 read replicas per region.",
    "It supports up to 5 secondary regions with up to 16 read replicas per region."
  ],
  "aws-020": [
    "Zero downtime is guaranteed because new instances are fully healthy and registered before any traffic shifts.",
    null,
    "Zero downtime is guaranteed because new instances are fully healthy and registered before any traffic shifts.",
    "Zero downtime is guaranteed because new instances are fully healthy and registered before any traffic shifts."
  ],
  "aws-021": [
    "This isolates problematic messages for debugging without blocking healthy messages.",
    null,
    "This isolates problematic messages for debugging without blocking healthy messages.",
    "This isolates problematic messages for debugging without blocking healthy messages."
  ],
  "aws-022": [
    "PITR is backup/restore with RPO equal to the time since last recovery point.",
    null,
    "If a region fails, Route 53 or the app can redirect to another region instantly — RPO approaches zero.",
    "All regions can accept reads AND writes simultaneously, with sub-second replication."
  ],
  "aws-023": [
    "The R7i provides up to 768 GiB RAM with high memory-to-vCPU ratios, ideal for in-memory analytics, in-memory databases, and real-time processing of large datasets.",
    null,
    "Accelerated Computing (P/G/Inf) adds GPU/FPGA for ML/rendering — overkill and wrong fit for RAM-intensive analytics.",
    "The R7i provides up to 768 GiB RAM with high memory-to-vCPU ratios, ideal for in-memory analytics, in-memory databases, and real-time processing of large datasets."
  ],
  "aws-024": [
    "gp3 caps at 16,000 IOPS — insufficient for 64,000 IOPS requirement.",
    "gp3 caps at 16,000 IOPS — insufficient for 64,000 IOPS requirement.",
    null,
    "st1 is a magnetic HDD designed for sequential, high-throughput workloads (Hadoop, log processing) — poor for random I/O patterns like databases."
  ],
  "aws-025": [
    "This dramatically reduces both latency and RDS load.",
    "This dramatically reduces both latency and RDS load.",
    null,
    "This dramatically reduces both latency and RDS load."
  ],
  "aws-026": [
    "Moving the bucket closer helps users in that region but hurts others.",
    "Moving the bucket closer helps users in that region but hurts others.",
    null,
    "Moving the bucket closer helps users in that region but hurts others."
  ],
  "aws-027": [
    "DynamoDB scales to any throughput and DAX is a fully managed, in-memory cache for DynamoDB that provides microsecond latency for read-heavy workloads, with automatic cache invalidation.",
    null,
    "DynamoDB scales to any throughput and DAX is a fully managed, in-memory cache for DynamoDB that provides microsecond latency for read-heavy workloads, with automatic cache invalidation.",
    "Redshift is OLAP/analytics — completely wrong for key-value gaming workloads."
  ],
  "aws-028": [
    "SQS messages are deleted after processing (no replay).",
    "SNS delivers messages to subscribers at the time of publish — no retention or replay capability.",
    null,
    "Amazon MQ is for migrating existing applications using standard protocols (AMQP, MQTT) — not designed for high-throughput streaming analytics."
  ],
  "aws-029": [
    "EFS is a good general-purpose NFS solution (supports concurrent Linux mounts) but has lower performance than Lustre for HPC parallel workloads.",
    "FSx for Windows uses SMB protocol — incompatible with Linux HPC workloads.",
    null,
    "EBS Multi-Attach (io1/io2 only) is limited to a single AZ and up to 16 instances — not suitable for hundreds of instances across AZs."
  ],
  "aws-030": [
    null,
    "Glacier Flexible Retrieval offers retrieval within 1-12 hours — meeting the '12-hour retrieval' requirement.",
    "Glacier Flexible Retrieval offers retrieval within 1-12 hours — meeting the '12-hour retrieval' requirement.",
    "Glacier Flexible Retrieval offers retrieval within 1-12 hours — meeting the '12-hour retrieval' requirement."
  ],
  "aws-031": [
    "Changing the partition key requires table redesign and data migration.",
    null,
    "DAX caches item-level reads and query results, serving 95%+ reads from cache and virtually eliminating hot partition reads.",
    "DAX caches item-level reads and query results, serving 95%+ reads from cache and virtually eliminating hot partition reads."
  ],
  "aws-032": [
    "On-Demand has no discount.",
    "Reserved Instances (1-year commitment) are best for steady 24/7 workloads — paying for reserved capacity that's idle 18 hours/day wastes money.",
    null,
    "Dedicated Hosts are most expensive and needed only for per-socket/per-core licensing or compliance, not cost optimization."
  ],
  "aws-033": [
    "Compute Savings Plans provide flexibility across instance families, regions, and OS (useful if instance needs may change) but offer slightly less discount than RIs.",
    "All Upfront pays the entire cost at the start for the deepest discount.",
    null,
    "Compute Savings Plans provide flexibility across instance families, regions, and OS (useful if instance needs may change) but offer slightly less discount than RIs."
  ],
  "aws-034": [
    "EC2 t3.micro runs 24/7 even during idle periods — you pay for uptime, not usage.",
    "EC2 t3.micro runs 24/7 even during idle periods — you pay for uptime, not usage.",
    null,
    "ECS Fargate is also serverless containers but has minimum task duration charges and is more expensive than Lambda for intermittent workloads."
  ],
  "aws-035": [
    "Intelligent-Tiering optimizes cost automatically but adds per-object monitoring fees and doesn't reach Glacier Deep Archive pricing.",
    "Standard-IA is cheaper than Standard but far more expensive than Glacier.",
    null,
    "S3 Versioning adds cost by retaining old versions — opposite of cost optimization."
  ],
  "aws-036": [
    "Traffic from private subnet instances to S3 routes through the AWS private network via the endpoint, completely bypassing the NAT Gateway.",
    null,
    "NAT Gateway charges $0.045/GB of data processed — for high-volume S3 access this is significant.",
    "NAT Gateway charges $0.045/GB of data processed — for high-volume S3 access this is significant."
  ],
  "aws-037": [
    "EC2 Instance Savings Plans offer slightly higher discounts (up to 72%) but are locked to a specific instance family in a region.",
    "EC2 Instance Savings Plans offer slightly higher discounts (up to 72%) but are locked to a specific instance family in a region.",
    "EC2 Instance Savings Plans offer slightly higher discounts (up to 72%) but are locked to a specific instance family in a region.",
    null
  ],
  "aws-038": [
    "Cost Explorer shows spending trends but doesn't recommend specific resource changes.",
    "It provides specific 'change to X' recommendations with estimated savings.",
    null,
    "Cost Explorer shows spending trends but doesn't recommend specific resource changes."
  ],
  "aws-039": [
    "Auto Scaling with scheduled actions works but is designed for scaling running fleets, not stopping all instances — and requires maintaining a launch template.",
    null,
    "Auto Scaling with scheduled actions works but is designed for scaling running fleets, not stopping all instances — and requires maintaining a launch template.",
    "Auto Scaling with scheduled actions works but is designed for scaling running fleets, not stopping all instances — and requires maintaining a launch template."
  ],
  "aws-040": [
    "When paused, you pay only for storage — zero ACU (Aurora Capacity Unit) charges.",
    null,
    "When paused, you pay only for storage — zero ACU (Aurora Capacity Unit) charges.",
    "RDS stop/start is limited to 7 days before auto-resuming."
  ],
  "aws-041": [
    "You create an IAM role in YOUR account with ReadOnlyAccess, and the trust policy specifies the auditor's AWS account ID (and optionally a specific IAM user/role within it).",
    "You create an IAM role in YOUR account with ReadOnlyAccess, and the trust policy specifies the auditor's AWS account ID (and optionally a specific IAM user/role within it).",
    null,
    "You create an IAM role in YOUR account with ReadOnlyAccess, and the trust policy specifies the auditor's AWS account ID (and optionally a specific IAM user/role within it)."
  ],
  "aws-042": [
    "If processing takes 45 minutes but the visibility timeout is shorter (default: 30 seconds), the message becomes visible again before processing completes, allowing another consumer to pick it up — causing the duplicate processing.",
    null,
    "Message retention period controls how long unprocessed messages stay in the queue — unrelated to duplication.",
    "If processing takes 45 minutes but the visibility timeout is shorter (default: 30 seconds), the message becomes visible again before processing completes, allowing another consumer to pick it up — causing the duplicate processing."
  ],
  "aws-043": [
    "This eliminates kernel processing latency, enabling microsecond latencies and high inter-instance bandwidth for tightly-coupled HPC and distributed ML training.",
    "EFA is typically combined with a Cluster Placement Group.",
    null,
    "Cluster Placement Groups reduce physical network distance between instances but don't provide OS-bypass."
  ],
  "aws-044": [
    "With 128MB memory Lambda: 400,000 GB-seconds × 0.0000166667 = ~$6.67/month + 2M requests × $0.0000002 = $0.40 = ~$7/month (after free tier).",
    null,
    "EC2 becomes cost-competitive when requests arrive continuously (high utilization), but for 2M requests at 200ms, actual compute time is a tiny fraction of 30 days.",
    "EC2 Reserved Instances would reduce to ~$35/month (1-year) — still 5x more expensive."
  ]
},
    glossary: [
  {
    "term": "Cognito User Pools vs Identity Pools",
    "cat": "Security",
    "d": 1,
    "def": "User Pools gestiona autenticación (sign-in y JWT); Identity Pools intercambia esa identidad por credenciales IAM temporales vía STS para acceder directo a servicios AWS."
  },
  {
    "term": "Gateway VPC Endpoint",
    "cat": "Networking & Cost",
    "d": 4,
    "def": "Endpoint gratuito en la tabla de rutas del VPC para conectar a S3 y DynamoDB de forma privada sin pasar ni pagar por NAT Gateway."
  },
  {
    "term": "S3 Object Lock",
    "cat": "Storage & Security",
    "d": 1,
    "def": "Impide borrar o sobrescribir objetos en S3 bajo modelo WORM (modo Governance o modo Compliance inmutable incluso para root)."
  },
  {
    "term": "Aurora Global Database",
    "cat": "Databases",
    "d": 2,
    "def": "Base de datos distribuida entre múltiples regiones con replicación basada en almacenamiento (< 1s de lag) y RPO/RTO mínimos."
  },
  {
    "term": "AWS Global Accelerator",
    "cat": "Networking",
    "d": 3,
    "def": "Servicio de red que proporciona 2 direcciones IP estáticas Anycast y encamina tráfico TCP/UDP por la red privada global de AWS."
  },
  {
    "term": "S3 Intelligent-Tiering",
    "cat": "Cost Optimization",
    "d": 4,
    "def": "Clase de almacenamiento de S3 que mueve objetos automáticamente entre niveles frecuentes e infrecuentes según su uso sin costos de recuperación."
  }
]
  };
})(window);
