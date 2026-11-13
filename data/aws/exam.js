/* =========================================================================
   data/aws/exam.js — AWS · Solutions Architect Associate (SAA-C03) (English)
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["aws-saa-c03"] = {
    "id": "aws-saa-c03",
    "appId": "aws-saa-c03",
    "provider": "Amazon Web Services",
    "badge": "AWS · SAA-C03",
    "icon": "🟧",
    "color": "#e67e22",
    "title": "AWS · Solutions Architect Associate (SAA-C03)",
    "subtitle": "Design of secure, resilient, high-performing, and cost-optimized architectures on AWS.",
    "passingScore": 72,
    "domains": {
      "1": "Design Secure Architectures (30 %)",
      "2": "Design Resilient Architectures (26 %)",
      "3": "Design High-Performing Architectures (24 %)",
      "4": "Design Cost-Optimized Architectures (20 %)"
    },
    "shortDomains": {
      "1": "Security",
      "2": "Resilience",
      "3": "Performance",
      "4": "Cost Optimization"
    },
    "topics": [
      {
        "id": "aws-t-1",
        "d": 1,
        "title": "1.1 · Design Secure Architectures (IAM, KMS/CloudHSM, WAF, VPC Security)",
        "html": "<table class=\"keytable\">\n<tr><th>Service</th><th>When it is the correct answer in SAA-C03</th></tr>\n<tr><td><b>IAM Roles & Instance Profiles</b></td><td>Grant temporary, automatically rotated permissions to EC2, ECS, or Lambda without storing credentials on disk or in variables.</td></tr>\n<tr><td><b>Secrets Manager vs Parameter Store</b></td><td><b>Secrets Manager</b> automatically rotates passwords with native RDS/Redshift/DocumentDB integration; <b>Parameter Store</b> stores hierarchical configuration.</td></tr>\n<tr><td><b>KMS vs CloudHSM</b></td><td><b>KMS</b> is managed and multi-tenant; <b>CloudHSM</b> provides dedicated single-tenant HSM hardware under your exclusive control (FIPS 140-2 Level 3).</td></tr>\n<tr><td><b>AWS WAF vs Shield vs GuardDuty</b></td><td><b>WAF</b> filters HTTP/HTTPS (SQLi, XSS) on ALB/CloudFront/API Gateway; <b>Shield</b> protects against DDoS; <b>GuardDuty</b> detects threats by analyzing CloudTrail, VPC Flow Logs, and DNS.</td></tr>\n</table>"
      },
      {
        "id": "aws-t-2",
        "d": 2,
        "title": "2.1 · Design Resilient Architectures (Multi-AZ, SQS/SNS, Aurora, Route 53, DR)",
        "html": "<table class=\"keytable\">\n<tr><th>Pattern / Service</th><th>Exam key</th></tr>\n<tr><td><b>RDS Multi-AZ vs Read Replicas</b></td><td><b>Multi-AZ</b> is for high availability (synchronous replication and automatic failover with no data loss); <b>Read Replicas</b> are asynchronous and scale reads.</td></tr>\n<tr><td><b>SQS vs SNS vs EventBridge</b></td><td><b>SQS</b> decouples through a pull queue (with FIFO for strict ordering and deduplication); <b>SNS</b> does pub/sub fan-out to multiple destinations; <b>EventBridge</b> filters and routes JSON events by rules.</td></tr>\n<tr><td><b>DR Strategies (RPO/RTO)</b></td><td>From lowest to highest cost and speed: <b>Backup & Restore</b> (hours) → <b>Pilot Light</b> (minimal core off/minimal) → <b>Warm Standby</b> (reduced-scale active) → <b>Multi-Site Active-Active</b> (seconds/zero).</td></tr>\n</table>"
      },
      {
        "id": "aws-t-3",
        "d": 3,
        "title": "3.1 · Design High-Performing Architectures (EBS, EFS, ElastiCache, CloudFront, Global Accelerator)",
        "html": "<table class=\"keytable\">\n<tr><th>Service</th><th>When to choose it</th></tr>\n<tr><td><b>EBS vs EFS vs FSx for Lustre</b></td><td><b>EBS</b>: block storage for 1 instance in 1 AZ; <b>EFS</b>: shared multi-AZ Linux NFS file system; <b>FSx for Lustre</b>: high-performance HPC compute integrated with S3.</td></tr>\n<tr><td><b>ElastiCache Redis vs Memcached</b></td><td><b>Redis</b> if you need persistence, Multi-AZ replication with failover, pub/sub, or sorted structures (leaderboards); <b>Memcached</b> for simple multithreaded caching without persistence.</td></tr>\n<tr><td><b>CloudFront vs Global Accelerator</b></td><td><b>CloudFront</b> caches static and dynamic HTTP/HTTPS content at Edge Locations; <b>Global Accelerator</b> optimizes the TCP/UDP path using static Anycast IPs over the AWS backbone network.</td></tr>\n</table>"
      },
      {
        "id": "aws-t-4",
        "d": 4,
        "title": "4.1 · Design Cost-Optimized Architectures (S3 Tiers, EC2 Pricing, Compute Optimizer)",
        "html": "<table class=\"keytable\">\n<tr><th>Option</th><th>Cost optimization in SAA-C03</th></tr>\n<tr><td><b>S3 Storage Classes</b></td><td><b>S3 Intelligent-Tiering</b> for unknown or changing access patterns with no retrieval charges; <b>Standard-IA / One Zone-IA</b> for known infrequent access (>30 days); <b>Glacier Flexible / Deep Archive</b> for long-term archival.</td></tr>\n<tr><td><b>EC2 Pricing Models</b></td><td><b>Spot Instances</b> (up to 90% discount) for interruption-tolerant workloads (batch, stateless); <b>Savings Plans / Reserved Instances</b> (1–3 years) for constant baseline usage; <b>On-Demand</b> for unpredictable spikes that cannot be interrupted.</td></tr>\n<tr><td><b>Gateway VPC Endpoints</b></td><td>Gateway Endpoints for <b>S3 and DynamoDB</b> are <b>free</b> and avoid paying per-GB processing charges on the NAT Gateway.</td></tr>\n</table>"
      }
    ],
    "questions": [
      {
        "id": "aws-001",
        "d": 1,
        "t": "Design Secure Architectures",
        "q": "A company stores sensitive customer PII in S3. A security audit requires that all access to the bucket is restricted to a specific IAM role used by the application, and that no other principal — including the bucket owner's AWS account root — can access the data. Which approach provides the MOST restrictive access control?",
        "o": [
          "Attach an S3 bucket policy with an explicit Deny for all principals except the application IAM role",
          "Enable S3 Block Public Access settings and apply a restrictive IAM identity policy to the application role",
          "Configure S3 Object Lock in compliance mode with an IAM permissions boundary on all account identities",
          "Configure an S3 Access Point restricted to the VPC with an IAM session policy for the application role"
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
          "Delete the compromised IAM user and recreate all associated resources",
          "Generate a new key pair and update all running services before revoking the old one",
          "Deactivate (disable) the exposed access key pair immediately in the IAM console",
          "Attach an IAM policy requiring multi-factor authentication (MFA) for all CLI actions"
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
          "Store long-term IAM access keys in environment variables on the EC2 instance",
          "Attach an IAM role to the EC2 instance profile granting the required AWS permissions",
          "Retrieve temporary IAM credentials dynamically from AWS Secrets Manager on boot",
          "Embed encrypted IAM credentials in the application configuration file using KMS"
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
          "AWS Systems Manager Parameter Store Standard tier with automated CloudWatch Events",
          "AWS Systems Manager Parameter Store Advanced tier using SecureString parameters",
          "AWS Secrets Manager with built-in automated rotation configured for Amazon RDS",
          "AWS Key Management Service (AWS KMS) with yearly automated CMK key rotation"
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
          "Cognito User Pools — they manage user directories, authenticate federated users, and issue JWT tokens",
          "Cognito Identity Pools — they exchange federated tokens to issue temporary AWS IAM credentials",
          "Cognito User Pools with custom OAuth 2.0 resource server scopes and fine-grained access policies",
          "Cognito Sync store — it synchronizes offline user profiles and securely coordinates API credentials"
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
          "AWS KMS with customer managed keys (CMK) and restrictive IAM key policies",
          "AWS KMS using an external custom key store with AWS-managed encryption keys",
          "AWS CloudHSM cluster with dedicated single-tenant hardware security module appliances",
          "Amazon S3 server-side encryption using SSE-KMS and customer-managed keys"
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
          "AWS Shield Advanced deployed with automatic Layer 7 DDoS mitigation and 24/7 SRT team support",
          "AWS WAF deployed with AWS Managed Rules for SQLi and XSS inspection on the entry point",
          "Security Groups updated with strict stateful rules to deny known malicious CIDR blocks",
          "Amazon Inspector configured to perform automated continuous code vulnerability scanning"
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
          "NAT Gateway for outbound access; Security Groups with inbound rules for IP blocking",
          "NAT Gateway for outbound access; Network ACLs with explicit Deny rules for IP blocking",
          "Internet Gateway with Elastic IPs for outbound access; Security Groups for IP blocking",
          "NAT instance in the private subnet; Network ACLs on route tables for subnet blocking"
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
          "Attach an IAM permissions boundary across all member accounts to deny cloudtrail:StopLogging",
          "Apply an SCP at the Organization root with a Deny effect on cloudtrail:StopLogging",
          "Configure AWS CloudTrail log file validation combined with S3 MFA Delete on the central bucket",
          "Deploy an AWS Config conformance pack with Systems Manager runbooks to re-enable logging"
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
          "AWS Site-to-Site VPN configured with dual IPsec tunnels terminating on a Virtual Private Gateway",
          "AWS Direct Connect dedicated cross-connect using standard private VIFs without payload encryption",
          "AWS Direct Connect dedicated connection with native MACsec or an IPsec VPN over Direct Connect",
          "AWS PrivateLink interface endpoints connected through AWS Transit Gateway with transport encryption"
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
          "S3 Object Ownership configured with Bucket owner enforced across all existing account buckets",
          "S3 Block Public Access enabled at the AWS account level across all four settings",
          "A Service Control Policy (SCP) explicitly denying the s3:PutBucketPolicy action",
          "S3 Versioning enabled with Multi-Factor Authentication (MFA) Delete protection"
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
          "Provision cross-account IAM roles in each member account granting read access to the central team",
          "Designate a Security Hub delegated administrator account in AWS Organizations to aggregate findings",
          "Configure Amazon EventBridge rules in each account to forward finding events to a central S3 data lake",
          "Deploy third-party security agents on central EC2 instances that query member account CloudTrail trails"
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
          "RDS Read Replica in a secondary AZ with asynchronous replication",
          "RDS Multi-AZ deployment with synchronous physical replication",
          "RDS automated snapshots with automated point-in-time recovery",
          "Aurora Global Database configured with a remote standby region"
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
          "Standard SQS queue with an extended visibility timeout and dead-letter queue",
          "Standard SQS queue with client-side message deduplication IDs configured",
          "SQS FIFO queue with receive message wait time set to maximum long polling",
          "SQS FIFO queue with content-based deduplication enabled for exactly-once processing"
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
          "Backup and Restore — replicate periodic snapshots to the DR region and restore on failure",
          "Pilot Light — continuously replicate core data while keeping minimal core services idle",
          "Warm Standby — maintain a scaled-down but fully functional deployment in the DR region",
          "Active-Active Multi-Region — provision full production capacity simultaneously in both regions"
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
          "Application Load Balancer (ALB) with configured Layer 4 TCP listener rules",
          "Network Load Balancer (NLB) fronting an ALB target group for path routing",
          "Classic Load Balancer (CLB) configured with path-based routing policies",
          "AWS Global Accelerator terminating TCP and HTTP/HTTPS on Anycast IP endpoints"
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
          "A shared SQS queue where downstream services poll messages concurrently",
          "An SNS topic publishing messages to fan-out SQS queues for each service",
          "An Amazon Kinesis data stream read simultaneously by dedicated shard consumers",
          "Direct API Gateway HTTP endpoints triggered via custom webhooks per subscriber"
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
          "Weighted routing distributing 90% of traffic to the primary and 10% to secondary",
          "Latency-based routing evaluating real-time user network latency across both regions",
          "Failover routing with an active-passive configuration linked to an automated HTTP health check",
          "Geolocation routing directing DNS queries according to the geographic origin of users"
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
          "Aurora Multi-AZ deployment with reader instances distributed across availability zones",
          "Aurora Global Database with cross-region replication and managed planned failover",
          "Aurora cross-region read replicas configured with standard asynchronous MySQL binlog",
          "Amazon RDS Multi-Region read replicas with AWS Backup automated cross-region restore"
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
          "Rolling update — replace existing instances incrementally in configured batches",
          "Blue/Green deployment — deploy a new ASG and shift ALB target group traffic",
          "In-place deployment — stop and upgrade application packages on running instances",
          "Canary deployment — route an initial percentage of requests to evaluate metrics"
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
          "Delete poisoned messages immediately and log their identifiers to Amazon CloudWatch",
          "Configure a Dead-Letter Queue (DLQ) with a defined maxReceiveCount retry threshold",
          "Increase the queue visibility timeout to allow workers additional processing attempts",
          "Migrate the workload to an SQS FIFO queue to enforce sequential message handling"
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
          "DynamoDB with automated Point-in-Time Recovery (PITR) continuous backup",
          "DynamoDB Global Tables with multi-region active-active table replication",
          "DynamoDB cross-region on-demand backup restored into a secondary region",
          "DynamoDB Streams triggering AWS Lambda to replicate table write items"
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
          "C7g (Compute Optimized) family designed for intensive compute-bound tasks",
          "R7i (Memory Optimized) family providing high memory-to-vCPU ratios",
          "P4d (Accelerated Computing) family featuring high-performance GPUs",
          "I4i (Storage Optimized) family optimized for low-latency NVMe SSDs"
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
          "gp3 (General Purpose SSD) provisioned with maximum IOPS and throughput values",
          "gp2 (General Purpose SSD) provisioned at large capacity for baseline burst IOPS",
          "io2 Block Express provisioned with independent sub-millisecond IOPS settings",
          "st1 (Throughput Optimized HDD) provisioned for maximum sustained transfer rates"
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
          "Deploy RDS Read Replicas and modify the application connection pooling logic",
          "Enable RDS Performance Insights and optimize high-load SQL execution plans",
          "Deploy an Amazon ElastiCache for Redis cluster as an in-memory query cache",
          "Scale up the primary RDS DB instance class to a memory-optimized instance type"
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
          "Migrate the primary S3 bucket to an AWS Region located in Asia-Pacific",
          "Enable S3 Transfer Acceleration on the existing bucket in us-east-1",
          "Deploy an Amazon CloudFront distribution using the S3 bucket as origin",
          "Create replica S3 buckets in each region with Route 53 geolocation routing"
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
          "Amazon Aurora Serverless v2 configured with read replicas across multiple AZs",
          "Amazon DynamoDB with DynamoDB Accelerator (DAX) for sub-millisecond in-memory read caching",
          "Amazon ElastiCache for Memcached deployed with self-managed invalidation logic",
          "Amazon Redshift provisioned cluster optimized for high-concurrency key queries"
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
          "Amazon SQS FIFO queue with extended message retention configured for 7 days",
          "Amazon SNS topic configured with message filtering and SQS delivery endpoints",
          "Amazon Kinesis Data Streams with retention period configured up to 7 days",
          "Amazon MQ broker with high-throughput ActiveMQ clustered network of brokers"
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
          "Amazon Elastic File System (EFS) configured with General Purpose performance mode",
          "Amazon FSx for Windows File Server configured with SMB multi-channel protocol",
          "Amazon FSx for Lustre parallel distributed file system optimized for HPC loads",
          "Amazon EBS Multi-Attach configured on io2 Block Express provisioned volumes"
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
          "S3 Standard → S3 Standard-IA at 30 days → S3 Glacier Flexible Retrieval at 90 days",
          "S3 Standard → S3 Intelligent-Tiering at 30 days → S3 Glacier Deep Archive at 90 days",
          "S3 Standard → S3 One Zone-IA at 30 days → S3 Glacier Deep Archive at 90 days",
          "S3 Standard → S3 Standard-IA at 30 days → S3 Glacier Deep Archive at 90 days"
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
          "Migrate the primary partition key to a composite partition and sort key design",
          "Enable DynamoDB Accelerator (DAX) to serve repetitive read requests from in-memory cache",
          "Use DynamoDB Streams to replicate hot items into an Amazon ElastiCache cluster",
          "Implement in-memory local caching dictionaries on each application web instance"
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
          "On-Demand Instances — pay for compute seconds without commitment or risk",
          "Reserved Instances (1-year No Upfront) — discounted rate for baseline use",
          "Spot Instances — spare compute capacity with savings of up to 90 percent",
          "Dedicated Hosts — dedicated physical hardware for compliance and control"
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
          "On-Demand Instances — paying standard hourly rates without financial commitments",
          "Spot Instances — running spare instances with interruptions for low rates",
          "Standard Reserved Instances (3-year, All Upfront) for the maximum savings",
          "Compute Savings Plans (3-year, No Upfront) for flexible regional discounts"
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
          "Amazon EC2 On-Demand instances in an Auto Scaling group fronted by an ALB",
          "Amazon EC2 Reserved Instances behind an Application Load Balancer public endpoint",
          "AWS Lambda functions integrated with an Amazon API Gateway REST API endpoint",
          "Amazon ECS tasks running continuously on AWS Fargate behind an ALB listener"
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
          "Transition logs to S3 Intelligent-Tiering storage class automatically after 30 days",
          "Transition logs to S3 Standard-Infrequent Access (S3 Standard-IA) after 30 days",
          "Transition logs to S3 Glacier Deep Archive storage class for long-term compliance retention",
          "Enable S3 Object Versioning with lifecycle rules to delete noncurrent versions"
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
          "Move the private EC2 instances into a public subnet with Elastic IP addresses",
          "Provision a Gateway VPC Endpoint for S3 and update private route tables",
          "Deploy an Interface VPC Endpoint (AWS PrivateLink) powered by AWS Nitro",
          "Enable S3 Transfer Acceleration on the bucket to bypass VPC NAT routes"
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
          "Standard Reserved Instances with an upfront commitment to a specific instance type",
          "Convertible Reserved Instances requiring manual exchanges for different instances",
          "EC2 Instance Savings Plans locked to a specific instance family within a single region",
          "Compute Savings Plans automatically applicable across families, regions, and services"
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
          "AWS Cost Explorer — generates cost allocation reports and daily forecast graphs",
          "AWS Trusted Advisor — performs basic high-level checks against best practices",
          "AWS Compute Optimizer — uses machine learning to deliver rightsizing guidance",
          "AWS Budgets — tracks planned thresholds and triggers notifications upon breaches"
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
          "Configure EC2 Auto Scaling scheduled scaling actions to change desired capacity",
          "Trigger AWS Lambda functions via Amazon EventBridge Scheduler on a cron schedule",
          "Deploy the AWS Systems Manager Quick Setup Resource Scheduler state manager task",
          "Configure AWS CloudWatch alarms with EC2 stop actions based on business hours metric"
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
          "Aurora Serverless v2 — continuously scales compute capacity based on workload demand",
          "Aurora Serverless v1 — automatically pauses capacity during inactivity down to zero",
          "Standard Aurora MySQL cluster provisioned with minimum db.t3.medium instances 24/7",
          "Amazon RDS Multi-AZ database configured with automated scheduled daily stop and start"
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
          "Create an IAM user for the external auditor and assign a ReadOnlyAccess policy",
          "Attach an S3 bucket policy and KMS key policy granting the auditor's IAM principal",
          "Create an IAM role with ReadOnlyAccess and trust the external account with an ExternalId",
          "Generate temporary session credentials for the auditor using an STS GetSessionToken API call"
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
          "Extend the message retention period on the queue from 4 days to 14 days",
          "Increase the queue visibility timeout to at least 45 minutes duration",
          "Enable SQS long polling by setting ReceiveMessageWaitTimeSeconds to 20",
          "Migrate the workload to an SQS FIFO queue with deduplication enabled"
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
          "Elastic Network Adapter (ENA) delivering up to 100 Gbps network interfaces",
          "Cluster Placement Groups packing instances into low-latency proximity blocks",
          "Elastic Fabric Adapter (EFA) providing OS-bypass networking capabilities for MPI jobs",
          "Spread Placement Groups distributing instances across distinct rack hardware"
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
          "Architecture A — EC2 On-Demand provides lower fixed monthly baseline pricing for workloads",
          "Architecture B — Lambda charges only for active execution time and leverages free tier",
          "Architecture A — EC2 Spot Instances offer equivalent predictability with lower pricing",
          "Architecture A — EC2 Reserved Instances with a 1-year commitment offer the deepest savings"
        ],
        "a": 1,
        "e": "2M requests × 200ms = 400,000 seconds of compute. With 128MB memory Lambda: 400,000 GB-seconds × 0.0000166667 = ~$6.67/month + 2M requests × $0.0000002 = $0.40 = ~$7/month (after free tier). A t3.large On-Demand costs ~$60/month. Lambda is ~8x cheaper for this intermittent workload. EC2 Reserved Instances would reduce to ~$35/month (1-year) — still 5x more expensive. The key insight: Lambda excels when compute time is a small fraction of wall-clock time. EC2 becomes cost-competitive when requests arrive continuously (high utilization), but for 2M requests at 200ms, actual compute time is a tiny fraction of 30 days."
      }
    ],
    "why": {
      "aws-001": [
        null,
        "`S3 Block Public Access` only blocks public or anonymous requests; it does not restrict access by authenticated `IAM` identities or the `root` user.",
        "`S3 Object Lock` in compliance mode protects against overwriting or deleting objects (WORM), but does not restrict read access for other identities.",
        "A per-VPC `S3 Access Point` limits the network path, but does not override direct access to the bucket from other authorized credentials, nor does it block `root` without an explicit `Deny`."
      ],
      "aws-002": [
        "Deleting the `IAM` user immediately destroys dependencies and permissions before the risk is contained, and takes longer than deactivating the exposed key.",
        "Generating new keys and updating services before revoking the old one leaves the leaked key active and exploitable for the duration of the rollout.",
        null,
        "Requiring `MFA` for API calls through policies does not immediately invalidate the compromised static credentials unless they are deactivated first."
      ],
      "aws-003": [
        "Storing credentials in environment variables leaves static keys on the operating system and does not avoid local storage on the `EC2` instance.",
        null,
        "`AWS Secrets Manager` is meant for database credentials or external API credentials, but for AWS SDK calls the recommended practice is an `IAM role`.",
        "Encrypting credentials with `AWS KMS` in configuration files still requires storing keys on the instance and handling the initial decryption."
      ],
      "aws-004": [
        "`Parameter Store` Standard does not include native automatic rotation for `Amazon RDS`; it requires implementing and maintaining custom `Lambda` functions.",
        "`Parameter Store` Advanced supports larger parameters and expiration policies, but lacks native automatic rotation integrated with `RDS`.",
        null,
        "`AWS KMS` manages cryptographic keys and their annual rotation, but does not store or rotate application secrets such as database passwords."
      ],
      "aws-005": [
        "`Cognito User Pools` manages the user directory and issues `JWT` tokens (ID, Access, Refresh), but does not grant temporary `IAM` credentials for direct calls to AWS.",
        null,
        "Resource servers in `User Pools` define custom `OAuth 2.0` scopes for your own APIs, not `IAM` credentials for AWS services such as `S3` or `DynamoDB`.",
        "`Cognito Sync` synchronizes preferences and user profile data across client devices; it does not provide temporary `IAM` credentials for AWS."
      ],
      "aws-006": [
        "In `AWS KMS` (even with a CMK), AWS operates and administers the underlying multi-tenant HSMs, so there is no exclusive control of the physical hardware.",
        "AWS-managed keys in `AWS KMS` are fully under AWS's operational control, with no dedicated hardware isolation exclusive to the customer.",
        null,
        "`SSE-KMS` delegates cryptographic control to `AWS KMS`, where the HSM hardware is multi-tenant and managed by AWS, failing to meet the required exclusive control."
      ],
      "aws-007": [
        "`AWS Shield Advanced` protects against distributed denial-of-service (DDoS) attacks at the network and transport layers, but does not filter targeted attacks such as SQLi and XSS at Layer 7.",
        null,
        "`Security Groups` operate at Layer 4 (IP and ports) and cannot inspect the HTTP/HTTPS body or headers where SQLi and XSS reside.",
        "`Amazon Inspector` detects vulnerabilities and outdated packages on `EC2` instances or containers; it does not block malicious web traffic in real time."
      ],
      "aws-008": [
        "`Security Groups` are stateful and only support `Allow` rules; they do not allow defining explicit `Deny` rules to block IP ranges.",
        null,
        "Assigning `Elastic IPs` with an `Internet Gateway` to private instances would expose them to inbound connections from the internet, violating the required isolation.",
        "A `NAT` instance is a legacy solution with administrative overhead, and `Network ACLs` are associated with entire subnets, not with route tables."
      ],
      "aws-009": [
        "An IAM permissions boundary (`permissions boundary`) can be modified or detached by a local administrator with privileges in the member account.",
        null,
        "File validation and `MFA Delete` protect the integrity and deletion of logs in `S3`, but do not prevent an administrator from running `cloudtrail:StopLogging`.",
        "`AWS Config` detects and remediates reactively after the event, leaving a window of time with no audit logging."
      ],
      "aws-010": [
        "`Site-to-Site VPN` encrypts traffic through `IPsec` tunnels, but uses the public internet and does not provide a dedicated physical connection.",
        "`AWS Direct Connect` offers a dedicated, private physical connection, but by default does not encrypt traffic in transit.",
        null,
        "`AWS PrivateLink` connects VPCs to AWS services or SaaS; it does not establish a dedicated physical connection from on-premises data centers."
      ],
      "aws-011": [
        "`S3 Object Ownership` with `Bucket owner enforced` disables ACLs, but does not block bucket policies that grant public access.",
        null,
        "Blocking `s3:PutBucketPolicy` via `SCP` would prevent configuring legitimate and necessary policies on all buckets in the account.",
        "`S3 Versioning` with `MFA Delete` prevents accidental or malicious deletion of objects, but does not restrict public read access."
      ],
      "aws-012": [
        "Creating cross-account `IAM` roles in each account grants permissions in the member accounts and requires manual management without providing native aggregation.",
        null,
        "Forwarding events with `EventBridge` to an `S3` data lake requires building a custom ingestion and analysis pipeline instead of using the native AWS integration.",
        "Deploying agents on `EC2` adds operational overhead and licensing costs, and does not integrate natively with `GuardDuty` and `Inspector` findings."
      ],
      "aws-013": [
        "`RDS` read replicas use asynchronous replication (with risk of data loss) and do not support automatic failover for high availability.",
        null,
        "Snapshots and point-in-time recovery (`PITR`) require provisioning a new instance manually, which takes much longer than 120 seconds.",
        "`Aurora Global Database` is designed for disaster recovery across different Regions, not for local high availability with failover in seconds on RDS MySQL."
      ],
      "aws-014": [
        "`Standard` queues deliver messages at least once (with possible duplicates) and do not guarantee strict processing order.",
        "`Standard` queues do not support native deduplication attributes nor guarantee FIFO-order processing.",
        "Long polling optimizes polling cost and latency on `FIFO` queues, but deduplication must be configured to avoid reprocessing identical messages.",
        null
      ],
      "aws-015": [
        "`Backup and Restore` requires restoring infrastructure and databases from backups, with an RTO typically of several hours.",
        "`Pilot Light` keeps the data replicated but the services off; provisioning and starting the compute fleet within one hour may exceed the RTO or fail under high demand.",
        null,
        "`Active-Active Multi-Region` meets immediate RTO/RPO but doubles the full infrastructure costs, making it excessively expensive for a 1-hour RTO."
      ],
      "aws-016": [
        "`Application Load Balancer` operates exclusively at Layer 7 (HTTP/HTTPS/gRPC) and does not support Layer 4 listeners for raw TCP or UDP traffic.",
        null,
        "`Classic Load Balancer` supports basic L4 and L7 protocols, but lacks advanced Layer 7 path-based (`path`) and host-based routing.",
        "`AWS Global Accelerator` is a Layer 4 Anycast network routing service, not a load balancer with HTTP path-based routing rules."
      ],
      "aws-017": [
        "In a standard `SQS` queue each message is consumed by a single worker; it does not allow distributing an identical copy to multiple independent services.",
        null,
        "`Amazon Kinesis Data Streams` requires managing the number of shards, processing offsets manually, and has higher operational overhead for simple pub/sub.",
        "Point-to-point HTTP webhooks require the publisher to maintain and manage the list of receiving endpoints, adding operational overhead."
      ],
      "aws-018": [
        "`Weighted routing` distributes fixed percentages of traffic, so 90% of users would keep receiving errors if the primary Region fails.",
        "`Latency-based routing` directs requests to the nearest Region, but without a failover policy it does not automatically redirect all traffic during a Regional outage.",
        null,
        "`Geolocation routing` restricts traffic by the client's geographic location, ignoring the health status of the application endpoints."
      ],
      "aws-019": [
        "`Aurora Multi-AZ` provides local high availability and replicas across Availability Zones within a single Region, not replication across global Regions.",
        null,
        "Standard cross-Region `Aurora` replicas use engine binlog replication, which introduces higher replication latency and lacks managed failover.",
        "Restoring `RDS` backups across Regions requires provisioning new clusters manually, with recovery times incompatible with low latency."
      ],
      "aws-020": [
        "`Rolling update` temporarily reduces available capacity during batch replacement, and a rollback requires reverting the process batch by batch.",
        null,
        "An `in-place` deployment stops the services on the existing instances while updating the code, causing degradation or downtime.",
        "`Canary` sends a small percentage to test instances to validate errors, but does not provision a full parallel fleet before switching the load balancer."
      ],
      "aws-021": [
        "Deleting failed messages from the queue destroys the original payload (`payload`), preventing later debugging and reprocessing.",
        null,
        "Increasing the `visibility timeout` only delays the failed message's reappearance in the queue, causing infinite retry loops that do not isolate the error.",
        "In a `FIFO` queue without a DLQ, a failed message completely blocks all subsequent messages belonging to the same `MessageGroupId`."
      ],
      "aws-022": [
        "`PITR` protects against data corruption or accidental deletion, but requires restoring a new table manually with an RTO of minutes to hours.",
        null,
        "Restoring a backup in another Region is a manual process that can take hours and loses the data generated since the last snapshot.",
        "Using `DynamoDB Streams` and `Lambda` is a homegrown solution that introduces variable replication latency and high overhead compared to `Global Tables`."
      ],
      "aws-023": [
        "The `C` family (Compute Optimized) prioritizes compute power per vCPU and has a very low memory-to-vCPU ratio for workloads needing 2 TB of RAM.",
        null,
        "The `P` family (Accelerated Computing) is oriented toward machine learning and GPU rendering, at a very high cost that is unnecessary for in-RAM calculations.",
        "The `I` family (Storage Optimized) maximizes I/O performance on local NVMe disks, not RAM density per vCPU."
      ],
      "aws-024": [
        "`gp3` volumes have a maximum limit of 16,000 IOPS, insufficient for the 64,000 IOPS requirement.",
        "`gp2` volumes scale at 3 IOPS/GiB and have an absolute ceiling of 16,000 IOPS, without allowing IOPS to be provisioned independently of size.",
        null,
        "`st1` volumes are magnetic disks designed for massive sequential transfers (throughput) and cannot deliver thousands of random IOPS."
      ],
      "aws-025": [
        "Read replicas relieve load on the primary database, but reads still require relational database I/O with millisecond latencies instead of sub-millisecond.",
        "`Performance Insights` is a diagnostic tool for monitoring bottlenecks; it does not cache or accelerate queries by itself.",
        null,
        "Vertically scaling the instance adds CPU and RAM to the MySQL engine, but does not avoid the computational cost or latency of querying the relational engine on every request."
      ],
      "aws-026": [
        "Moving the bucket to Asia would improve latency for Asian users, but would severely degrade latency for users in the Americas and Europe.",
        "`S3 Transfer Acceleration` speeds up data uploads to S3 using Edge Locations, but does not optimize delivery or cache bulk downloads of static content.",
        null,
        "Replicating buckets across multiple Regions with `Route 53` routing requires complex bidirectional synchronization and raises costs and operational overhead."
      ],
      "aws-027": [
        "`Amazon Aurora` is a relational database designed for complex ACID transactions; reaching millions of key-value read RPS is significantly more costly and complex.",
        null,
        "`ElastiCache for Memcached` lacks durable persistence and requires the application to implement its own logic to synchronize and load data from a permanent store.",
        "`Amazon Redshift` is an OLAP analytical data warehouse optimized for complex aggregations over columns, not for millisecond key-value lookups."
      ],
      "aws-028": [
        "`Amazon SQS` deletes messages once they are processed by consumers; it does not allow rewinding or replaying (`replay`) the data stream for multiple analyses.",
        "`Amazon SNS` delivers messages immediately to subscribers and discards them if no destination is available; it does not store data for later re-reading.",
        null,
        "`Amazon MQ` is intended for migrating existing applications with protocols such as AMQP/MQTT and does not scale to massive streaming flows with replay like `Kinesis`."
      ],
      "aws-029": [
        "`Amazon EFS` is a general-purpose NFS system with higher latencies that does not support the massive parallel striping (`striping`) access that HPC workloads require.",
        "`FSx for Windows File Server` uses the SMB protocol designed for Windows workloads, not the parallel POSIX file system required by HPC on Linux.",
        null,
        "`EBS Multi-Attach` is limited to a single Availability Zone and up to 16 EC2 instances of the same family, so it does not scale to hundreds of multi-AZ nodes."
      ],
      "aws-030": [
        null,
        "`S3 Glacier Deep Archive` takes between 12 and 48 hours to retrieve objects, failing the maximum 12-hour SLA, and `Intelligent-Tiering` charges a per-object fee.",
        "`S3 Glacier Deep Archive` takes up to 48 hours to retrieve data, and `One Zone-IA` loses geographic redundancy because it resides in a single Availability Zone.",
        "`S3 Glacier Deep Archive` has standard retrieval times of 12 to 48 hours, which exceeds the 12-hour availability requirement."
      ],
      "aws-031": [
        "Changing the partition key structure requires recreating the table, migrating the existing data, and redesigning the access logic in the application.",
        null,
        "Using `DynamoDB Streams` with `ElastiCache` requires writing code to synchronize data, handle expirations, and manage cache connectivity failures.",
        "A local in-memory cache on the instances creates inconsistencies between servers, lacks persistence, and requires additional cache management code."
      ],
      "aws-032": [
        "`On-Demand` instances bill the full standard rate with no discounts, making them much more expensive for fault-tolerant processes.",
        "Reserved instances commit to continuous payment for 1 year (24/7), wasting money during the 18 hours per day when the batch job does not run.",
        null,
        "`Dedicated Hosts` allocate dedicated physical servers to meet per-socket licensing, making them the most expensive option and unnecessary for batch."
      ],
      "aws-033": [
        "`On-Demand` instances pay the full list price with no discount for prolonged use over 3 years.",
        "`Spot` instances can be interrupted with a 2-minute notice when AWS needs the capacity, which is unacceptable for 24/7 production.",
        null,
        "`Compute Savings Plans` offer flexibility to change family and Region, but their percentage discount is lower than that of 3-year All Upfront Standard RIs."
      ],
      "aws-034": [
        "`EC2` instances bill continuously for powered-on hours, accumulating unnecessary costs during days of near-zero traffic.",
        "Reserved instances commit to a fixed monthly payment 24/7 regardless of whether there is traffic, making them unsuitable for highly unpredictable demand.",
        null,
        "`ECS Fargate` charges per second with a minimum task time and requires keeping minimum tasks running to avoid outages during sudden spikes."
      ],
      "aws-035": [
        "`S3 Intelligent-Tiering` applies a monthly per-object monitoring fee that reduces savings on large volumes of logs that are never read again.",
        "`S3 Standard-IA` reduces costs compared to Standard, but its cost per GB is notably higher than that of `S3 Glacier Deep Archive` (~$0.0125 vs ~$0.00099).",
        null,
        "Enabling `S3 Versioning` retains additional object versions, which increases the total stored space and the bill instead of reducing it."
      ],
      "aws-036": [
        "Moving instances to a public subnet with public IPs violates security isolation and exposes private servers directly to the internet.",
        null,
        "Interface Endpoints (`AWS PrivateLink`) charge a fixed hourly fee plus per-GB processing costs, while Gateway VPC Endpoints for `S3` are completely free.",
        "`S3 Transfer Acceleration` speeds up uploads through CloudFront Edge Locations over the public internet; it does not reduce `NAT Gateway` processing charges."
      ],
      "aws-037": [
        "`Standard Reserved Instances` require fixing the instance type, size, operating system, and Region, with no flexibility at all for architecture changes.",
        "`Convertible RIs` allow changing the type, but apply only to `EC2` and require managing manual exchanges to adjust equivalent values.",
        "`EC2 Instance Savings Plans` require committing to a specific instance family in a given Region, losing flexibility if the family is changed.",
        null
      ],
      "aws-038": [
        "`AWS Cost Explorer` visualizes historical spending patterns and financial forecasts, but does not analyze detailed OS-level metrics or recommend exact configurations.",
        "`AWS Trusted Advisor` includes general cost optimization checks, but does not offer the deep machine learning analysis of `Compute Optimizer`.",
        null,
        "`AWS Budgets` defines spending thresholds and sends alerts when budget limits are exceeded; it does not analyze resource underutilization or suggest changes."
      ],
      "aws-039": [
        "`Auto Scaling` scheduled actions terminate and launch instances (incurring recreation), instead of stopping and resuming the existing instances with their state.",
        null,
        "`AWS Instance Scheduler` via Systems Manager or CloudFormation requires deploying and maintaining a solution with DynamoDB and complex permissions, with greater overhead.",
        "`CloudWatch` alarms with `EC2` actions stop instances based on metric thresholds (e.g., low CPU), but cannot turn them back on at a fixed time."
      ],
      "aws-040": [
        "`Aurora Serverless v2` scales instantly but maintains a continuous baseline minimum capacity (0.5 ACU), billing uninterrupted compute 24 hours a day.",
        null,
        "Provisioning fixed `db.t3.medium` instances bills continuously 24 hours a day even if the database is only used for 4 sporadic hours.",
        "`Amazon RDS Multi-AZ` does not support the temporary stop command (`Stop DB cluster`) and restarting after a stop takes several minutes, unsuitable for unpredictable schedules."
      ],
      "aws-041": [
        "Creating a local `IAM` user requires issuing static credentials in your account instead of letting the auditor use their own corporate credentials.",
        "Configuring resource-based policies grants access only to specific services (such as `S3` or `KMS`), not to a cross-cutting review of all the account's resources.",
        null,
        "The `sts:GetSessionToken` API only generates temporary credentials for existing `IAM` users in the same account, not for external identities from another account."
      ],
      "aws-042": [
        "The retention period defines how many days an undeleted message remains in the queue; it does not prevent other consumers from receiving messages that are being processed.",
        null,
        "Long polling (`ReceiveMessageWaitTimeSeconds`) optimizes consumption by waiting up to 20 seconds for messages to arrive, but does not hide messages that are already being processed.",
        "A `FIFO` queue guarantees ordering and deduplication on ingestion, but if the `visibility timeout` expires before the work completes, the message is redelivered to the consumer."
      ],
      "aws-043": [
        "`ENA` significantly improves bandwidth and traditional latency, but goes through the operating system's (kernel) network stack, adding overhead compared to EFA.",
        "`Cluster Placement Groups` physically bring instances closer together in the same AZ, but by themselves do not provide the OS-bypass network acceleration for MPI computations.",
        null,
        "`Spread Placement Groups` distribute instances across different racks and power infrastructures for high availability, increasing network latency between nodes."
      ],
      "aws-044": [
        "A `t3.large` On-Demand instance running 24/7 costs approximately $60/month, while 2 million short executions on `AWS Lambda` cost less than $10/month.",
        null,
        "`Spot` instances do not guarantee continuous availability for web services and still pay for full server hours instead of milliseconds of actual compute.",
        "A 1-year reserved instance reduces the cost of `EC2` to ~$35/month, but is still several times more expensive than the residual cost of `Lambda` after the free tier."
      ]
    },
    "glossary": [
      {
        "term": "Cognito User Pools vs Identity Pools",
        "cat": "Security",
        "d": 1,
        "def": "User Pools handles authentication (sign-in and JWT); Identity Pools exchanges that identity for temporary IAM credentials via STS to access AWS services directly."
      },
      {
        "term": "Gateway VPC Endpoint",
        "cat": "Networking & Cost",
        "d": 4,
        "def": "Free endpoint in the VPC route table to connect privately to S3 and DynamoDB without going through, or paying for, a NAT Gateway."
      },
      {
        "term": "S3 Object Lock",
        "cat": "Storage & Security",
        "d": 1,
        "def": "Prevents deleting or overwriting objects in S3 under a WORM model (Governance mode or Compliance mode, immutable even for root)."
      },
      {
        "term": "Aurora Global Database",
        "cat": "Databases",
        "d": 2,
        "def": "Database distributed across multiple Regions with storage-based replication (< 1s lag) and minimal RPO/RTO."
      },
      {
        "term": "AWS Global Accelerator",
        "cat": "Networking",
        "d": 3,
        "def": "Networking service that provides 2 static Anycast IP addresses and routes TCP/UDP traffic over the AWS global private network."
      },
      {
        "term": "S3 Intelligent-Tiering",
        "cat": "Cost Optimization",
        "d": 4,
        "def": "S3 storage class that automatically moves objects between frequent and infrequent access tiers based on usage, with no retrieval costs."
      }
    ]
  };
})(window);
