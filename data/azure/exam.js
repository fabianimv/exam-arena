/* =========================================================================
   data/azure/exam.js — Microsoft Azure Administrator (AZ-104)
   130 preguntas en 5 dominios con explicación por opción errónea (WHY)
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["az-104"] = {
    id: "az-104",
    appId: "az-104",
    provider: "Microsoft Azure",
    badge: "Azure · AZ-104",
    icon: "🔷",
    color: "#0078d4",
    title: "Microsoft Azure · Administrator (AZ-104)",
    subtitle: "Identidades y Gobernanza (Entra ID, RBAC, Policy), Almacenamiento, Cómputo (VMs, AKS, App Service), Redes y Monitoreo.",
    passingScore: 70,
    domains: {
      1: "Identities & Governance (20 %)",
      2: "Storage (15 %)",
      3: "Compute (20 %)",
      4: "Networking (25 %)",
      5: "Monitor & Backup (20 %)"
    },
    shortDomains: {
      1: "Identities",
      2: "Storage",
      3: "Compute",
      4: "Networking",
      5: "Monitor & Backup"
    },
    topics: [
  {
    "id": "az-t-1",
    "d": 1,
    "title": "1.1 · Identidades (Entra ID / Azure AD) y Gobernanza (RBAC, Policy, Locks)",
    "html": "<table class=\"keytable\">\n<tr><th>Componente</th><th>Propósito clave en el examen AZ-104</th><th>Diferencia crítica</th></tr>\n<tr><td><b>Entra ID Roles vs Azure RBAC</b></td><td>Entra ID gestiona identidades del directorio (Global Admin, User Admin); Azure RBAC gestiona recursos Azure en jerarquía Management Group → Subscription → Resource Group → Resource.</td><td><b>Owner</b> puede delegar permisos; <b>Contributor</b> gestiona todo salvo dar acceso; <b>User Access Admin</b> solo asigna roles.</td></tr>\n<tr><td><b>Azure Policy</b></td><td>Evalúa y fuerza el cumplimiento de propiedades de recursos (regiones permitidas, SKUs, etiquetas).</td><td>Efectos clave: <b>Deny</b> (bloquea), <b>Audit</b> (solo registra), <b>Modify</b> (añade/edita tags), <b>DeployIfNotExists</b>.</td></tr>\n<tr><td><b>Resource Locks</b></td><td><code>CanNotDelete</code> (permite modificar pero no borrar) y <code>ReadOnly</code> (bloquea cambios en el plano de control).</td><td>Los bloqueos prevalecen incluso sobre el rol <b>Owner</b> hasta que se retira explícitamente el lock.</td></tr>\n<tr><td><b>Conditional Access & PIM</b></td><td>Conditional Access exige MFA/dispositivo según señales (requiere P1); PIM otorga acceso privilegiado Just-In-Time (requiere P2).</td><td><b>B2B</b> invita socios como Guest a tu tenant; <b>B2C</b> es una plataforma CIAM para clientes externos.</td></tr>\n</table>"
  },
  {
    "id": "az-t-2",
    "d": 2,
    "title": "2.1 · Azure Storage: Redundancia, Tiers, SAS e Inmutabilidad",
    "html": "<table class=\"keytable\">\n<tr><th>Redundancia</th><th>Copias y alcance</th><th>Cuándo elegirla</th></tr>\n<tr><td><b>LRS</b></td><td>3 copias síncronas en un único datacenter.</td><td>Menor costo, sin tolerancia a caída de zona ni región.</td></tr>\n<tr><td><b>ZRS</b></td><td>3 copias síncronas repartidas en 3 Availability Zones de la misma región.</td><td>Alta disponibilidad ante la caída de un datacenter completo.</td></tr>\n<tr><td><b>GRS / GZRS</b></td><td>Replica asíncronamente a una región secundaria emparejada.</td><td>Recuperación ante desastres regionales (lectura secundaria directa solo con <b>RA-GRS / RA-GZRS</b>).</td></tr>\n</table>\n<div class=\"tip\"><b>Truco AZ-104:</b> Para revocar un token SAS sin rotar la clave de la cuenta de almacenamiento, vincúlalo siempre a una <b>Stored Access Policy</b>. Para acceso privado por IP interna de tu VNet sin salir a internet incluso con acceso público deshabilitado, usa <b>Private Endpoint</b>.</div>"
  },
  {
    "id": "az-t-3",
    "d": 3,
    "title": "3.1 · Compute: VMs, VMSS, App Service, ACI y AKS",
    "html": "<table class=\"keytable\">\n<tr><th>Servicio</th><th>Caso de uso en AZ-104</th><th>Puntos clave</th></tr>\n<tr><td><b>VM Scale Sets (VMSS)</b></td><td>Autoescalado horizontal de VMs idénticas y actualizaciones con <i>rolling upgrade policy</i>.</td><td>Combínalo con <b>Proximity Placement Groups</b> para mínima latencia física entre VMs.</td></tr>\n<tr><td><b>Azure Bastion</b></td><td>Acceso RDP/SSH por navegador sobre TLS sin IP pública en la VM ni abrir puertos 22/3389 a internet.</td><td>Si la VM no responde por red, usa <b>Serial Console y Boot Diagnostics</b>.</td></tr>\n<tr><td><b>App Service</b></td><td>PaaS web con <b>Deployment Slots</b> (disponibles desde el plan <b>Standard S1</b>) para pruebas en staging y swap sin downtime.</td><td>Usa <b>Managed Identity</b> para conectar a Azure SQL o Key Vault sin guardar secretos en código.</td></tr>\n<tr><td><b>ACI vs AKS</b></td><td><b>ACI</b> ejecuta contenedores bajo demanda sin gestionar nodos; <b>AKS</b> provee orquestación completa con Cluster Autoscaler y almacenamiento persistente.</td><td>Para trabajos HPC paralelos masivos por lotes de corta duración, usa <b>Azure Batch</b>.</td></tr>\n</table>"
  },
  {
    "id": "az-t-4",
    "d": 4,
    "title": "4.1 · Networking: VNets, Peering, NSG, Load Balancing y DNS Privado",
    "html": "<table class=\"keytable\">\n<tr><th>Balanceador</th><th>Capa y alcance</th><th>Cuándo usarlo</th></tr>\n<tr><td><b>Azure Load Balancer</b></td><td>Capa 4 (TCP/UDP), Regional.</td><td>Tráfico no HTTP o balanceo interno de ultra baja latencia.</td></tr>\n<tr><td><b>Application Gateway</b></td><td>Capa 7 (HTTP/HTTPS), Regional, soporta WAF y enrutamiento por URL/host.</td><td>Proteger aplicaciones web contra SQLi/XSS en una región.</td></tr>\n<tr><td><b>Traffic Manager vs Front Door</b></td><td><b>Traffic Manager</b> balancea por DNS global; <b>Front Door</b> es un proxy inverso Anycast global de capa 7 con CDN y WAF.</td><td>Para resolver zonas DNS privadas de Azure desde on-premises vía ExpressRoute, despliega <b>Azure DNS Private Resolver</b> con inbound endpoint.</td></tr>\n</table>"
  },
  {
    "id": "az-t-5",
    "d": 5,
    "title": "5.1 · Monitor & Backup: Alertas, Log Analytics (KQL), Recovery Services y ASR",
    "html": "<table class=\"keytable\">\n<tr><th>Herramienta</th><th>Qué registra o resuelve</th></tr>\n<tr><td><b>Activity Log</b></td><td>Operaciones del plano de control (quién creó, modificó o borró un recurso en ARM y cuándo).</td></tr>\n<tr><td><b>Log Analytics Workspace</b></td><td>Consultas avanzadas en <b>KQL</b> sobre logs de VMs, contenedores y seguridad; se visualizan en informes interactivos con <b>Azure Workbooks</b>.</td></tr>\n<tr><td><b>Azure Backup vs Site Recovery (ASR)</b></td><td><b>Azure Backup</b> restaura puntos de recuperación históricos desde un Recovery Services Vault; <b>ASR</b> replica continuamente VMs para hacer failover con mínimo RTO/RPO ante caída del sitio primario.</td></tr>\n</table>"
  }
],
    questions: [
  {
    "id": "az-001",
    "d": 1,
    "t": "Identities & Governance",
    "q": "Which Azure AD role grants full control over Azure AD and all Microsoft services that use Azure AD identities?",
    "o": [
      "User Administrator",
      "Global Administrator",
      "Privileged Role Administrator",
      "Security Administrator"
    ],
    "a": 1,
    "e": "Global Administrator has full control over Azure AD and all Microsoft 365/Azure services. It's the most powerful directory role."
  },
  {
    "id": "az-002",
    "d": 1,
    "t": "Identities & Governance",
    "q": "You need to allow a user to manage all resources in a subscription but NOT grant access to others. Which built-in role should you assign?",
    "o": [
      "Owner",
      "Contributor",
      "Reader",
      "User Access Administrator"
    ],
    "a": 1,
    "e": "Contributor can create and manage all resources but cannot grant RBAC access to others. Owner includes the ability to assign roles."
  },
  {
    "id": "az-003",
    "d": 1,
    "t": "Identities & Governance",
    "q": "Your company has 15 Azure subscriptions. You need to apply a consistent set of policies across ALL subscriptions. What is the BEST approach?",
    "o": [
      "Apply Azure Policy to each subscription individually",
      "Create a Management Group and apply policies at that level",
      "Use Azure Blueprints on each subscription",
      "Create a resource group spanning all subscriptions"
    ],
    "a": 1,
    "e": "Management Groups allow you to organize subscriptions hierarchically and apply policies, RBAC, and budgets at scale across multiple subscriptions."
  },
  {
    "id": "az-004",
    "d": 1,
    "t": "Identities & Governance",
    "q": "You want to block resource creation in any region other than East US and West Europe. Which Azure service enforces this?",
    "o": [
      "RBAC Deny assignment",
      "Azure Policy with Deny effect",
      "Azure Blueprints",
      "Resource Locks"
    ],
    "a": 1,
    "e": "Azure Policy with the Deny effect prevents non-compliant resource creation. The built-in policy 'Allowed locations' restricts deployments to specified regions."
  },
  {
    "id": "az-005",
    "d": 1,
    "t": "Identities & Governance",
    "q": "A company needs to prevent accidental deletion of a critical production resource group. What should they configure?",
    "o": [
      "Assign Reader role to all users",
      "Azure Policy with Audit effect",
      "Resource Lock of type CanNotDelete",
      "Enable soft delete on the resource group"
    ],
    "a": 2,
    "e": "CanNotDelete locks prevent deletion of a resource or resource group even by Owners. The resource can still be modified but not deleted."
  },
  {
    "id": "az-006",
    "d": 1,
    "t": "Identities & Governance",
    "q": "Which Azure AD feature allows MFA to be required ONLY when users sign in from outside the corporate network?",
    "o": [
      "MFA Server",
      "Conditional Access",
      "Identity Protection",
      "Privileged Identity Management (PIM)"
    ],
    "a": 1,
    "e": "Conditional Access evaluates signals (location, device, user risk) and applies access controls like MFA only when conditions are met. Requires Azure AD Premium P1."
  },
  {
    "id": "az-007",
    "d": 1,
    "t": "Identities & Governance",
    "q": "A Contributor on a resource group reports they cannot see a resource, even though no explicit deny assignment exists. What else could cause this?",
    "o": [
      "Contributor role doesn't include read permissions",
      "The resource is in a different subscription",
      "A Deny assignment at resource level overrides the Contributor role",
      "The resource was recently moved between resource groups"
    ],
    "a": 2,
    "e": "Deny assignments explicitly block access even when a permissive role (like Contributor) would otherwise allow it. They take precedence over allow roles."
  },
  {
    "id": "az-008",
    "d": 1,
    "t": "Identities & Governance",
    "q": "RBAC role assignments in Azure are inherited from _______ to _______ scopes.",
    "o": [
      "Resource → Resource Group → Subscription → Management Group",
      "Management Group → Subscription → Resource Group → Resource",
      "Subscription → Management Group → Resource Group → Resource",
      "Resource Group → Resource → Subscription → Management Group"
    ],
    "a": 1,
    "e": "RBAC assignments are inherited downward: Management Group → Subscription → Resource Group → Resource. A role assigned at a higher scope propagates to all child scopes."
  },
  {
    "id": "az-009",
    "d": 1,
    "t": "Identities & Governance",
    "q": "What is the purpose of Azure AD Privileged Identity Management (PIM)?",
    "o": [
      "Permanently assign admin roles to reduce ticket overhead",
      "Provide just-in-time privileged access with approval workflows and time limits",
      "Synchronize on-premises AD groups with Azure AD",
      "Audit all login activity and generate compliance reports"
    ],
    "a": 1,
    "e": "PIM provides time-limited, just-in-time privileged access to Azure AD and Azure resources, with optional approval workflows, reducing standing privilege exposure."
  },
  {
    "id": "az-010",
    "d": 1,
    "t": "Identities & Governance",
    "q": "Which Azure Policy effect AUTOMATICALLY adds a tag to resources that are missing it, without blocking the deployment?",
    "o": [
      "Deny",
      "Audit",
      "Append",
      "Modify"
    ],
    "a": 3,
    "e": "Modify effect can add, update, or remove tags on resources during creation or update, without blocking the operation. Append adds properties but cannot modify existing ones."
  },
  {
    "id": "az-011",
    "d": 1,
    "t": "Identities & Governance",
    "q": "Which Azure AD license tier is the MINIMUM required to use Conditional Access policies?",
    "o": [
      "Azure AD Free",
      "Azure AD Premium P1",
      "Azure AD Premium P2",
      "Microsoft 365 Business Basic"
    ],
    "a": 1,
    "e": "Conditional Access policies require Azure AD Premium P1 at minimum. P2 adds Identity Protection-based conditions (user/sign-in risk)."
  },
  {
    "id": "az-012",
    "d": 1,
    "t": "Identities & Governance",
    "q": "You apply a ReadOnly resource lock to a storage account. What is the effect?",
    "o": [
      "Users cannot read data stored in the account",
      "Users cannot write blobs but can read them",
      "Users cannot modify the storage account's configuration (e.g., SKU, replication)",
      "Users cannot delete blobs within the account"
    ],
    "a": 2,
    "e": "ReadOnly locks prevent changes to the resource's configuration (control plane). Data plane operations (reading/writing blobs) are not directly affected by the lock type."
  },
  {
    "id": "az-013",
    "d": 1,
    "t": "Identities & Governance",
    "q": "An Azure Policy assignment shows resources are 'Non-compliant'. The policy effect is 'Audit'. What happens to those resources?",
    "o": [
      "They are deleted immediately",
      "They are flagged in the compliance report but NOT modified or blocked",
      "A remediation task runs automatically",
      "They are moved to a quarantine resource group"
    ],
    "a": 1,
    "e": "The Audit effect only logs non-compliant resources in the Azure Policy compliance dashboard. It does not block, modify, or delete resources."
  },
  {
    "id": "az-014",
    "d": 1,
    "t": "Identities & Governance",
    "q": "You need to grant a user access to create and manage VMs in a specific resource group only. What is the MINIMUM scope for the role assignment?",
    "o": [
      "Management Group",
      "Subscription",
      "Resource Group",
      "Individual VM resources"
    ],
    "a": 2,
    "e": "Assigning the Contributor (or custom) role at the resource group scope limits the user's access to only that resource group, following the principle of least privilege."
  },
  {
    "id": "az-015",
    "d": 1,
    "t": "Identities & Governance",
    "q": "What is an Azure Blueprint used for?",
    "o": [
      "Monitor resource health across subscriptions",
      "Package RBAC, policies, resource groups, and ARM templates into a reusable definition for consistent environment setup",
      "Enforce tag policies across management groups",
      "Provide cost allocation reports across subscriptions"
    ],
    "a": 1,
    "e": "Azure Blueprints package governance artifacts (policies, RBAC, ARM templates, resource groups) into a single definition that can be applied repeatedly to create compliant environments."
  },
  {
    "id": "az-016",
    "d": 2,
    "t": "Storage",
    "q": "You need to store millions of images accessible via HTTP/HTTPS for a web application. Which Azure Storage service is MOST appropriate?",
    "o": [
      "Azure Files",
      "Azure Table Storage",
      "Azure Blob Storage",
      "Azure Queue Storage"
    ],
    "a": 2,
    "e": "Azure Blob Storage is designed for unstructured data (images, videos, documents) and natively exposes HTTP/HTTPS endpoints. It's the de facto choice for web-accessible object storage."
  },
  {
    "id": "az-017",
    "d": 2,
    "t": "Storage",
    "q": "What is the key difference between LRS and ZRS replication?",
    "o": [
      "LRS replicates to 3 availability zones; ZRS replicates to a paired region",
      "LRS replicates 3 copies within a single datacenter; ZRS replicates across 3 availability zones in the same region",
      "LRS is cheaper and less durable than ZRS",
      "ZRS is only available for premium storage accounts"
    ],
    "a": 1,
    "e": "LRS keeps 3 copies within one datacenter. ZRS replicates across 3 separate availability zones in the same region, protecting against single-datacenter failures while staying in-region."
  },
  {
    "id": "az-018",
    "d": 2,
    "t": "Storage",
    "q": "A third-party app needs to upload files to a blob container for exactly 48 hours without exposing your storage account key. What should you use?",
    "o": [
      "Storage Account Key rotated after 48 hours",
      "Shared Access Signature (SAS) token with 48-hour expiry",
      "Azure AD token with a Contributor role",
      "Access Control List (ACL) with time limit"
    ],
    "a": 1,
    "e": "SAS tokens provide time-limited, permission-scoped access to storage resources. They can be restricted to specific operations, containers, and time windows without exposing account keys."
  },
  {
    "id": "az-019",
    "d": 2,
    "t": "Storage",
    "q": "Which blob storage access tier is MOST cost-effective for data that is accessed once per year and stored for at least 180 days?",
    "o": [
      "Hot",
      "Cool",
      "Cold",
      "Archive"
    ],
    "a": 3,
    "e": "Archive tier has the lowest storage cost but the highest access cost and latency (data must be rehydrated, taking hours). It's designed for rarely accessed data kept long-term."
  },
  {
    "id": "az-020",
    "d": 2,
    "t": "Storage",
    "q": "You need to mount a file share simultaneously on a Windows Server VM and a Linux VM. Which Azure service supports this?",
    "o": [
      "Azure Blob Storage (NFS)",
      "Azure Files with SMB and NFS protocol support",
      "Azure Disk Storage with shared disk enabled",
      "Azure Table Storage"
    ],
    "a": 1,
    "e": "Azure Files supports both SMB (Windows) and NFS (Linux) protocols, enabling simultaneous mounting on different OS types. Azure Disks with shared disk are limited to specific use cases."
  },
  {
    "id": "az-021",
    "d": 2,
    "t": "Storage",
    "q": "Soft delete is enabled on a storage account with a 14-day retention period. A blob is accidentally deleted. What is TRUE?",
    "o": [
      "The blob is permanently deleted after 24 hours",
      "The blob can be restored within 14 days from the Azure portal or API",
      "The blob is automatically moved to the Archive tier",
      "The blob must be recovered from Azure Backup"
    ],
    "a": 1,
    "e": "Blob soft delete retains deleted blobs in a soft-deleted state for the retention period. They can be undeleted via the portal, CLI, or API within that window."
  },
  {
    "id": "az-022",
    "d": 2,
    "t": "Storage",
    "q": "Which storage account type is required to enable Azure Data Lake Storage Gen2 (hierarchical namespace)?",
    "o": [
      "BlobStorage account",
      "General-purpose v1 (GPv1)",
      "General-purpose v2 (GPv2) with hierarchical namespace enabled",
      "Premium FileStorage"
    ],
    "a": 2,
    "e": "ADLS Gen2 is built on GPv2 accounts. Enabling the hierarchical namespace during account creation adds directory and file-level POSIX ACLs on top of Blob Storage."
  },
  {
    "id": "az-023",
    "d": 2,
    "t": "Storage",
    "q": "Your company needs to migrate 200 TB of data from on-premises to Azure Blob Storage. The internet link is 100 Mbps shared. What is the BEST migration approach?",
    "o": [
      "AzCopy over the internet link",
      "Azure Data Factory with on-premises integration runtime",
      "Azure Data Box (physical device)",
      "Azure Storage Explorer with parallel transfers"
    ],
    "a": 2,
    "e": "200 TB over 100 Mbps would take weeks. Azure Data Box ships a physical appliance (80 TB capacity) to your location. You load data locally and ship it back to Microsoft for upload, bypassing network limitations."
  },
  {
    "id": "az-024",
    "d": 2,
    "t": "Storage",
    "q": "What is the purpose of Azure Storage lifecycle management policies?",
    "o": [
      "Replicate blobs between storage accounts automatically",
      "Automatically transition blobs between access tiers or delete them after specified days",
      "Monitor storage account performance metrics",
      "Enable geo-redundant replication on a schedule"
    ],
    "a": 1,
    "e": "Lifecycle policies automate tier transitions (Hot → Cool → Archive) and deletion based on blob age, last modified date, or last accessed date, optimizing storage costs."
  },
  {
    "id": "az-025",
    "d": 2,
    "t": "Storage",
    "q": "A storage account has a firewall configured to deny all public access. An Azure VM in the same VNet cannot access the storage account. What is the correct fix?",
    "o": [
      "Disable the storage account firewall entirely",
      "Add the VM's public IP to the firewall allowlist",
      "Add the VM's subnet to the storage account's allowed virtual networks",
      "Create a VPN Gateway between the VM's VNet and the storage account"
    ],
    "a": 2,
    "e": "Storage firewall 'service endpoints' or 'private endpoints' allow access from specific VNets/subnets. Adding the subnet to the allowed list enables private access without exposing a public IP."
  },
  {
    "id": "az-026",
    "d": 2,
    "t": "Storage",
    "q": "Which redundancy option protects against a complete Azure regional outage by replicating to a paired region AND across zones?",
    "o": [
      "ZRS",
      "GRS",
      "GZRS",
      "LRS"
    ],
    "a": 2,
    "e": "GZRS (Geo-Zone-Redundant Storage) combines ZRS (3 zones in primary region) with GRS (replication to a secondary paired region), providing the highest durability."
  },
  {
    "id": "az-027",
    "d": 2,
    "t": "Storage",
    "q": "A storage account key was accidentally committed to a public GitHub repository. What is the IMMEDIATE action to take?",
    "o": [
      "Delete the storage account and create a new one",
      "Rotate (regenerate) the compromised storage account key immediately",
      "Enable firewall rules to block all public access",
      "Change the storage account's replication type"
    ],
    "a": 1,
    "e": "Immediately rotate the compromised key to invalidate it. Azure storage accounts have two keys (key1 and key2) so you can rotate one while updating applications to use the other."
  },
  {
    "id": "az-028",
    "d": 2,
    "t": "Storage",
    "q": "Which Azure tool allows you to transfer data to/from Azure Blob Storage from the command line with high performance and support for AzCopy job resumption?",
    "o": [
      "Azure Storage Explorer",
      "AzCopy",
      "Azure CLI az storage blob copy",
      "Azure Data Factory"
    ],
    "a": 1,
    "e": "AzCopy is a command-line utility optimized for Azure Storage transfers with support for parallel transfers, job journaling (resume), and SAS tokens."
  },
  {
    "id": "az-029",
    "d": 3,
    "t": "Compute",
    "q": "You deploy two VMs that must remain available during planned Azure maintenance. What should you configure?",
    "o": [
      "Availability Zone",
      "Availability Set",
      "Azure Site Recovery",
      "VM Scale Set"
    ],
    "a": 1,
    "e": "Availability Sets distribute VMs across up to 3 fault domains and 20 update domains, ensuring at least one VM stays available during planned and unplanned outages."
  },
  {
    "id": "az-030",
    "d": 3,
    "t": "Compute",
    "q": "What is the key FUNCTIONAL difference between VM Scale Sets (VMSS) and Availability Sets?",
    "o": [
      "VMSS supports autoscaling; Availability Sets provide high availability only",
      "Availability Sets support autoscaling; VMSS provides static VM grouping",
      "VMSS is only available for Linux VMs",
      "Availability Sets can span multiple regions; VMSS cannot"
    ],
    "a": 0,
    "e": "VMSS adds autoscaling capabilities (scale out/in based on metrics or schedules) in addition to high availability. Availability Sets only provide HA distribution without scaling."
  },
  {
    "id": "az-031",
    "d": 3,
    "t": "Compute",
    "q": "You need to run a containerized batch job that executes once and terminates. Infrastructure management should be MINIMAL. Which service is MOST cost-effective?",
    "o": [
      "Azure Virtual Machines",
      "Azure Kubernetes Service (AKS)",
      "Azure Container Instances (ACI)",
      "Azure App Service"
    ],
    "a": 2,
    "e": "ACI provides serverless containers billed per second of execution. No cluster or server management required, making it ideal for short-lived, event-driven workloads."
  },
  {
    "id": "az-032",
    "d": 3,
    "t": "Compute",
    "q": "You need to deploy a web application without managing underlying infrastructure, with built-in autoscaling and deployment slots. Which Azure service should you use?",
    "o": [
      "Azure Virtual Machines",
      "Azure App Service",
      "Azure Container Instances",
      "Azure VM Scale Sets"
    ],
    "a": 1,
    "e": "Azure App Service is a fully managed PaaS for web apps. It includes built-in autoscaling, SSL, custom domains, deployment slots for blue/green deployments, and no OS/VM management."
  },
  {
    "id": "az-033",
    "d": 3,
    "t": "Compute",
    "q": "You need to connect to a Windows VM via RDP without exposing port 3389 to the internet. What is the RECOMMENDED solution?",
    "o": [
      "Configure a VPN Gateway and use VPN client",
      "Deploy Azure Bastion",
      "Use Just-in-Time (JIT) VM Access",
      "Configure an NSG rule to allow port 3389 from your IP only"
    ],
    "a": 1,
    "e": "Azure Bastion provides browser-based RDP/SSH over TLS (port 443) to VMs without any public IP on the VM or open RDP/SSH ports. JIT is also valid but Bastion is the cleaner solution."
  },
  {
    "id": "az-034",
    "d": 3,
    "t": "Compute",
    "q": "An AKS cluster needs to pull container images from a private Azure Container Registry (ACR) WITHOUT storing credentials as Kubernetes secrets. What is the RECOMMENDED approach?",
    "o": [
      "Create an imagePullSecret with ACR credentials",
      "Make the ACR registry public",
      "Attach the ACR to the AKS cluster using managed identity",
      "Use a service principal with password stored in a ConfigMap"
    ],
    "a": 2,
    "e": "Attaching ACR to AKS using managed identity is the recommended secretless approach. AKS uses its system-assigned or user-assigned managed identity to authenticate to ACR without storing credentials."
  },
  {
    "id": "az-035",
    "d": 3,
    "t": "Compute",
    "q": "What is the purpose of the Custom Script Extension on Azure VMs?",
    "o": [
      "Enable Azure Monitor agent automatically after deployment",
      "Run PowerShell or shell scripts on a VM after provisioning for configuration",
      "Create automated VM snapshots on a schedule",
      "Resize VM disks without downtime"
    ],
    "a": 1,
    "e": "Custom Script Extension downloads and executes scripts on VMs post-deployment. Commonly used for software installation, configuration, and post-provisioning setup tasks."
  },
  {
    "id": "az-036",
    "d": 3,
    "t": "Compute",
    "q": "Which Azure VM disk type provides the HIGHEST IOPS and LOWEST latency, suitable for mission-critical databases?",
    "o": [
      "Standard HDD",
      "Standard SSD",
      "Premium SSD",
      "Ultra Disk"
    ],
    "a": 3,
    "e": "Ultra Disk provides configurable IOPS (up to 160,000) and throughput with sub-millisecond latency. Ideal for IO-intensive workloads like SAP HANA, SQL Server, and Oracle."
  },
  {
    "id": "az-037",
    "d": 3,
    "t": "Compute",
    "q": "You decommission a VM but want to reuse its managed OS disk for a new VM later. What should you do?",
    "o": [
      "Deallocate the VM and leave it stopped",
      "Delete the VM resource while keeping the managed disk (uncheck 'Delete disk' option)",
      "Create a snapshot of the disk first, then delete everything",
      "Move the VM to a different resource group"
    ],
    "a": 1,
    "e": "When deleting a VM in Azure, you can choose to retain the managed disk. Uncheck the disk deletion option, and the disk remains as a standalone resource you can attach to another VM."
  },
  {
    "id": "az-038",
    "d": 3,
    "t": "Compute",
    "q": "What is the purpose of a Proximity Placement Group (PPG) in Azure?",
    "o": [
      "Group VMs across different regions for global load balancing",
      "Co-locate VMs in the same physical datacenter to minimize network latency between them",
      "Apply NSG rules consistently to multiple VMs",
      "Replicate VM configurations across availability zones"
    ],
    "a": 1,
    "e": "Proximity Placement Groups constrain VM placement to minimize inter-VM network latency by ensuring VMs are physically close. Critical for HPC and latency-sensitive clustered applications."
  },
  {
    "id": "az-039",
    "d": 3,
    "t": "Compute",
    "q": "You need to deploy an identical VM configuration consistently across 3 regions. What is the MOST efficient and repeatable approach?",
    "o": [
      "Manually configure each VM using the Azure portal",
      "Use ARM templates or Bicep for repeatable deployments",
      "Clone the VM from the first region using Azure Migrate",
      "Use Azure Site Recovery to replicate across regions"
    ],
    "a": 1,
    "e": "ARM templates and Bicep provide infrastructure-as-code for consistent, version-controlled, repeatable deployments across any region or environment."
  },
  {
    "id": "az-040",
    "d": 3,
    "t": "Compute",
    "q": "A VM's OS disk is running low on space. What is the supported way to resize an Azure managed disk?",
    "o": [
      "Resize from the Azure portal while the VM is running (online resize for data disks)",
      "Deallocate the VM, resize the disk, then start the VM",
      "Create a new disk, copy data, and attach it",
      "Increase the disk size via disk striping"
    ],
    "a": 0,
    "e": "Azure supports online resize for data disks (without VM restart). OS disks typically require VM deallocation for resize. Only expansion is supported — managed disks cannot be shrunk."
  },
  {
    "id": "az-041",
    "d": 3,
    "t": "Compute",
    "q": "Azure Spot VMs are BEST suited for which type of workloads?",
    "o": [
      "Production web applications with SLA requirements",
      "Fault-tolerant, interruptible batch processing or stateless workloads",
      "Mission-critical databases requiring 99.9% uptime",
      "Active Directory domain controllers"
    ],
    "a": 1,
    "e": "Spot VMs use spare Azure capacity at up to 90% discount but can be evicted with 30-second notice when capacity is needed. Only suitable for fault-tolerant, checkpointed, or stateless workloads."
  },
  {
    "id": "az-042",
    "d": 3,
    "t": "Compute",
    "q": "What does the 'Deallocated' state of an Azure VM mean, and what are the billing implications?",
    "o": [
      "VM is running but paused; full compute charges apply",
      "VM is stopped and compute resources released; no compute charges, storage charges apply",
      "VM is deleted; no charges of any kind",
      "VM is in maintenance mode; partial compute charges apply"
    ],
    "a": 1,
    "e": "Deallocated VMs release their compute resources (CPU, RAM) back to Azure. You only pay for storage (OS disk, data disks) and any attached public IPs. This is different from 'Stopped' which still incurs compute charges."
  },
  {
    "id": "az-043",
    "d": 3,
    "t": "Compute",
    "q": "Which Azure container orchestration service is FULLY MANAGED, where Microsoft handles the control plane?",
    "o": [
      "Self-managed Kubernetes on Azure VMs",
      "Azure Container Instances",
      "Azure Kubernetes Service (AKS)",
      "Azure Red Hat OpenShift"
    ],
    "a": 2,
    "e": "AKS is a managed Kubernetes service where Azure manages the Kubernetes control plane (API server, etcd) at no charge. You only pay for the agent (worker) nodes."
  },
  {
    "id": "az-044",
    "d": 4,
    "t": "Networking",
    "q": "Two VNets in the same region need to communicate privately with low latency. What is the SIMPLEST solution?",
    "o": [
      "Site-to-Site VPN between the two VNets",
      "VNet Peering",
      "ExpressRoute",
      "Azure Relay"
    ],
    "a": 1,
    "e": "VNet Peering connects VNets through the Azure backbone with low latency and high bandwidth. No gateways or public internet required. VNet Global Peering works across regions."
  },
  {
    "id": "az-045",
    "d": 4,
    "t": "Networking",
    "q": "How are NSG rules evaluated when traffic hits a network interface or subnet?",
    "o": [
      "From highest priority number to lowest; first match wins",
      "From lowest priority number to highest; first match wins",
      "Allow rules are always evaluated before deny rules",
      "Default rules always take precedence over custom rules"
    ],
    "a": 1,
    "e": "NSG rules are processed from lowest number (highest priority) to highest number. The FIRST matching rule is applied and processing stops. Lower numbers = higher priority."
  },
  {
    "id": "az-046",
    "d": 4,
    "t": "Networking",
    "q": "What is the default behavior of an NSG when NO custom rules match inbound traffic?",
    "o": [
      "Allow all inbound traffic",
      "Allow traffic from within the VNet only",
      "Deny all inbound traffic (implicit deny-all)",
      "Log and allow the traffic"
    ],
    "a": 2,
    "e": "NSGs have built-in implicit deny-all rules at priority 65500 (DenyAllInbound, DenyAllOutbound) that block all traffic when no custom rule matches."
  },
  {
    "id": "az-047",
    "d": 4,
    "t": "Networking",
    "q": "VNet A is peered with VNet B. VNet B is peered with VNet C. Can VMs in VNet A directly reach VMs in VNet C?",
    "o": [
      "Yes, VNet peering is transitive",
      "No, VNet peering is NOT transitive",
      "Yes, if 'Allow Gateway Transit' is enabled on all peerings",
      "Yes, if all VNets are in the same region"
    ],
    "a": 1,
    "e": "VNet peering is non-transitive. VNet A cannot reach VNet C through VNet B. You need a direct peering between A and C, or a hub-spoke design with a NVA/VPN gateway and 'Use Remote Gateways' enabled."
  },
  {
    "id": "az-048",
    "d": 4,
    "t": "Networking",
    "q": "You need all outbound internet traffic from VMs in a subnet to flow through a Network Virtual Appliance (NVA) for inspection. What should you configure?",
    "o": [
      "NSG outbound rules on the subnet",
      "User Defined Route (UDR) with next hop set to the NVA's private IP",
      "Azure Firewall policy on the VNet",
      "Service endpoints for internet-bound traffic"
    ],
    "a": 1,
    "e": "UDRs (User Defined Routes) override Azure's default routing. Creating a route for 0.0.0.0/0 with next hop = NVA's private IP forces all outbound traffic through the appliance."
  },
  {
    "id": "az-049",
    "d": 4,
    "t": "Networking",
    "q": "You've configured a UDR routing traffic through an NVA, but VMs cannot reach the internet. The NVA is a VM. What is the MOST LIKELY missing configuration?",
    "o": [
      "The UDR needs a BGP route",
      "IP Forwarding must be enabled on the NVA's network interface in Azure",
      "The NVA needs a public IP address",
      "An NSG rule must allow outbound on the NVA's subnet"
    ],
    "a": 1,
    "e": "Azure drops traffic destined for an IP different from the NIC's assigned IP unless IP Forwarding is enabled on that NIC. This must be enabled both in Azure AND within the OS of the NVA VM."
  },
  {
    "id": "az-050",
    "d": 4,
    "t": "Networking",
    "q": "Which Azure load balancer type operates at Layer 7 and supports path-based URL routing and WAF capabilities?",
    "o": [
      "Azure Standard Load Balancer",
      "Azure Application Gateway",
      "Azure Traffic Manager",
      "Azure Front Door"
    ],
    "a": 1,
    "e": "Azure Application Gateway is an L7 load balancer supporting URL path-based routing, SSL termination, session affinity, and optionally WAF (Web Application Firewall)."
  },
  {
    "id": "az-051",
    "d": 4,
    "t": "Networking",
    "q": "You need to distribute traffic globally across multiple Azure regions based on the lowest latency for end users. Which service should you use?",
    "o": [
      "Azure Standard Load Balancer",
      "Azure Application Gateway",
      "Azure Traffic Manager with 'Performance' routing method",
      "Azure Internal Load Balancer"
    ],
    "a": 2,
    "e": "Azure Traffic Manager is a DNS-based global traffic manager. The 'Performance' routing method directs users to the endpoint with the lowest latency from their location."
  },
  {
    "id": "az-052",
    "d": 4,
    "t": "Networking",
    "q": "You need to connect an on-premises network to Azure with a PRIVATE, DEDICATED connection NOT traversing the public internet. What should you use?",
    "o": [
      "Site-to-Site VPN over IPSec",
      "Point-to-Site VPN",
      "Azure ExpressRoute",
      "VNet Peering with on-premises gateway"
    ],
    "a": 2,
    "e": "ExpressRoute provides a private, dedicated connection to Azure through a connectivity provider (e.g., Equinix, AT&T), not traversing the public internet. Offers predictable performance and lower latency than VPN."
  },
  {
    "id": "az-053",
    "d": 4,
    "t": "Networking",
    "q": "You need VMs in a VNet to resolve each other's hostnames using custom DNS names (e.g., vm1.contoso.internal). What is the SIMPLEST solution without deploying custom DNS servers?",
    "o": [
      "Azure Traffic Manager with custom DNS",
      "Azure Private DNS Zone linked to the VNet",
      "Azure Public DNS Zone",
      "Configure /etc/hosts on each VM"
    ],
    "a": 1,
    "e": "Azure Private DNS Zones provide automatic DNS registration and resolution for VNet resources when auto-registration is enabled. No DNS server deployment required."
  },
  {
    "id": "az-054",
    "d": 4,
    "t": "Networking",
    "q": "What is the MAIN difference between Azure Firewall and Network Security Groups (NSGs)?",
    "o": [
      "NSGs operate at Layer 7; Azure Firewall operates at Layer 4 only",
      "Azure Firewall is a managed, stateful firewall with FQDN filtering and threat intelligence; NSGs are stateless L3/L4 packet filters",
      "NSGs can filter HTTPS traffic by URL; Azure Firewall cannot",
      "Azure Firewall is free; NSGs are charged per rule"
    ],
    "a": 1,
    "e": "NSGs are simple, stateless L3/L4 packet filters at subnet/NIC level. Azure Firewall is a managed, stateful network security service with FQDN filtering, TLS inspection, and threat intelligence feeds."
  },
  {
    "id": "az-055",
    "d": 4,
    "t": "Networking",
    "q": "You need to capture network traffic flows through an NSG for security analysis and compliance auditing. Which feature should you enable?",
    "o": [
      "Azure Monitor Diagnostic Settings for VMs",
      "NSG Flow Logs via Network Watcher",
      "Azure Firewall diagnostic logs",
      "Azure Sentinel data connector"
    ],
    "a": 1,
    "e": "NSG Flow Logs, enabled through Network Watcher, capture a 5-tuple (source/dest IP, port, protocol, allow/deny) of all traffic through NSGs. Logs go to a storage account and optionally to Log Analytics via Traffic Analytics."
  },
  {
    "id": "az-056",
    "d": 4,
    "t": "Networking",
    "q": "What is the purpose of a Service Endpoint in Azure networking?",
    "o": [
      "Expose an Azure service via a private IP in your VNet",
      "Extend the VNet's identity to Azure services, allowing you to restrict service access to the VNet over the Azure backbone",
      "Create a DNS alias for Azure service URLs",
      "Route all traffic through Azure Firewall"
    ],
    "a": 1,
    "e": "Service Endpoints extend your VNet's private address space and identity to Azure services (Storage, SQL, etc.) over the Azure backbone, allowing you to lock down access to specific VNets/subnets. Note: the service still has a public endpoint."
  },
  {
    "id": "az-057",
    "d": 4,
    "t": "Networking",
    "q": "What does a Private Endpoint provide that a Service Endpoint does NOT?",
    "o": [
      "BGP dynamic routing to the Azure service",
      "A private IP address in your VNet for the Azure service, making it reachable without public internet exposure",
      "Lower latency to Azure services",
      "Support for more Azure service types"
    ],
    "a": 1,
    "e": "Private Endpoints assign a private IP from your VNet to an Azure service (e.g., Storage, SQL, Key Vault), enabling fully private connectivity. The service is accessible only from your VNet or connected networks, with no public endpoint needed."
  },
  {
    "id": "az-058",
    "d": 4,
    "t": "Networking",
    "q": "An Azure Standard Load Balancer requires a health probe. A backend VM fails its health probe. What happens?",
    "o": [
      "The VM is automatically restarted",
      "Traffic is no longer sent to that VM by the load balancer",
      "The VM is deleted and replaced",
      "An alert is triggered but traffic continues to flow"
    ],
    "a": 1,
    "e": "The Standard Load Balancer removes unhealthy backend instances (those failing health probes) from the rotation. Traffic is only sent to instances passing their probe."
  },
  {
    "id": "az-059",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "You need to receive an email alert when a VM's CPU exceeds 85% for more than 5 minutes. What should you configure?",
    "o": [
      "Azure Policy with Audit effect on CPU metrics",
      "Azure Monitor Metric Alert with a threshold rule on Percentage CPU",
      "Azure Security Center high CPU alert",
      "Log Analytics query alert on Windows Event Log"
    ],
    "a": 1,
    "e": "Azure Monitor Metric Alerts evaluate platform metrics (like Percentage CPU) against thresholds over configurable time windows. When the threshold is exceeded for the window, an alert fires."
  },
  {
    "id": "az-060",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "What is the purpose of a Log Analytics Workspace in Azure Monitor?",
    "o": [
      "Store VM OS disk snapshots for recovery",
      "Centrally collect, store, and query log and performance data from multiple Azure and on-premises sources using KQL",
      "Provide real-time VM performance dashboards only",
      "Replace Azure Storage for all diagnostic data"
    ],
    "a": 1,
    "e": "Log Analytics Workspaces are centralized data stores for monitoring telemetry from VMs, applications, services, and on-premises systems. Data is queried using KQL (Kusto Query Language)."
  },
  {
    "id": "az-061",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "What is the CORRECT difference between Azure Backup and Azure Site Recovery?",
    "o": [
      "Azure Backup replicates to a secondary region; Site Recovery creates backups on a schedule",
      "Azure Backup protects against data loss/corruption (backup/restore); Azure Site Recovery enables disaster recovery with continuous replication and regional failover",
      "Site Recovery is for file-level backup; Azure Backup is for VM-level recovery only",
      "Both services are identical but differ only in pricing"
    ],
    "a": 1,
    "e": "Azure Backup = data protection (scheduled backups, point-in-time restore). Azure Site Recovery = business continuity and DR (continuous replication, orchestrated failover to another region with near-zero RPO)."
  },
  {
    "id": "az-062",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "Azure Monitor Activity Log retains data for how long by default, and what should you do to retain it longer?",
    "o": [
      "7 days default; extend via Azure Policy",
      "30 days default; purchase a Log Analytics premium tier",
      "90 days default; configure Diagnostic Settings to send to a Log Analytics workspace or Storage Account",
      "365 days default; no action needed"
    ],
    "a": 2,
    "e": "Activity Logs are retained for 90 days by default. To retain longer, use Diagnostic Settings to archive to a Storage Account (up to years) or stream to a Log Analytics workspace with custom retention."
  },
  {
    "id": "az-063",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "Which Azure Monitor feature provides CPU, memory, disk, and dependency maps for VMs without writing custom queries?",
    "o": [
      "Azure Advisor",
      "VM Insights",
      "Application Insights",
      "Azure Service Health"
    ],
    "a": 1,
    "e": "VM Insights provides curated performance charts and a dependency map (using the Dependency Agent) for VMs and VM Scale Sets, pre-built without requiring custom KQL queries."
  },
  {
    "id": "az-064",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "What is Azure Service Health used for?",
    "o": [
      "Monitor individual VM CPU and memory metrics",
      "Track Azure platform incidents, planned maintenance events, and health advisories affecting YOUR specific subscriptions and regions",
      "Configure alerting thresholds for Azure services",
      "Manage RBAC for monitoring resources"
    ],
    "a": 1,
    "e": "Azure Service Health provides personalized alerts and information about Azure service incidents, planned maintenance, and health advisories, filtered to the subscriptions and regions you use."
  },
  {
    "id": "az-065",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "What is the purpose of Action Groups in Azure Monitor?",
    "o": [
      "Group Azure resources for applying policies",
      "Define a collection of notification actions (email, SMS, webhook, runbook) triggered when an alert fires",
      "Organize metric data into logical categories",
      "Apply RBAC roles to monitoring data"
    ],
    "a": 1,
    "e": "Action Groups define WHO to notify and WHAT to do when an alert fires: send email/SMS, call webhooks, trigger Azure Functions/Logic Apps/Automation Runbooks, or create ITSM tickets."
  },
  {
    "id": "az-066",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "Which query language is used to query data in Azure Log Analytics workspaces?",
    "o": [
      "SQL (T-SQL)",
      "PowerShell",
      "KQL (Kusto Query Language)",
      "Azure Resource Graph (ARG) syntax"
    ],
    "a": 2,
    "e": "Azure Monitor Log Analytics uses KQL (Kusto Query Language). It's also used in Azure Data Explorer, Microsoft Sentinel, and Azure Resource Graph."
  },
  {
    "id": "az-067",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "You need to back up an Azure VM with a recovery point objective (RPO) of 24 hours and retain backups for 30 days. Which service should you use?",
    "o": [
      "VM Snapshots stored in a storage account",
      "Azure Site Recovery with daily replication",
      "Azure Backup with Recovery Services Vault and a backup policy",
      "Azure Blob Storage with geo-replication"
    ],
    "a": 2,
    "e": "Azure Backup with a Recovery Services Vault and backup policy allows you to schedule daily backups and configure retention policies (daily, weekly, monthly, yearly) for VMs and other workloads."
  },
  {
    "id": "az-068",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "Which Azure tool provides recommendations to reduce costs by identifying underutilized VMs and unattached disks?",
    "o": [
      "Azure Monitor",
      "Azure Security Center",
      "Azure Advisor",
      "Azure Cost Management + Billing"
    ],
    "a": 2,
    "e": "Azure Advisor provides actionable recommendations across five categories: Cost, Reliability, Security, Performance, and Operational Excellence. It identifies idle/underutilized resources to reduce spend."
  },
  {
    "id": "az-069",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "You want a non-compliant Azure Policy to automatically deploy a Log Analytics agent to VMs that are missing it. Which policy effect should you use?",
    "o": [
      "Audit",
      "Deny",
      "Modify",
      "DeployIfNotExists"
    ],
    "a": 3,
    "e": "DeployIfNotExists triggers an ARM template deployment (e.g., installing an agent) when a resource doesn't have a specified related resource. Remediation tasks apply this to existing non-compliant resources."
  },
  {
    "id": "az-070",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "An Azure Backup job for a VM fails. Where do you FIRST look to diagnose the failure reason?",
    "o": [
      "VM Boot Diagnostics",
      "Azure Monitor Activity Log",
      "Recovery Services Vault → Backup Jobs",
      "Azure Advisor recommendations"
    ],
    "a": 2,
    "e": "The Recovery Services Vault's 'Backup Jobs' section shows the status, error codes, and detailed messages for all backup and restore operations, making it the first place to diagnose failures."
  },
  {
    "id": "az-071",
    "d": 1,
    "t": "Identities & Governance",
    "q": "You want users to register their MFA methods before they can access any company resource. Which Azure AD feature enforces this registration flow?",
    "o": [
      "Conditional Access policy requiring MFA",
      "Azure AD Identity Protection — User risk policy",
      "Azure AD Combined security information registration",
      "Azure AD Password Protection"
    ],
    "a": 0,
    "e": "A Conditional Access policy that requires MFA registration (targeting 'All Users' with the grant 'Require multi-factor authentication') forces users to complete the registration wizard before accessing resources."
  },
  {
    "id": "az-072",
    "d": 1,
    "t": "Identities & Governance",
    "q": "You need just-in-time privileged access to the Global Administrator role with approval and time limits. Which feature provides this?",
    "o": [
      "Azure AD Conditional Access",
      "Azure AD Privileged Identity Management (PIM)",
      "Azure AD Identity Protection",
      "Azure RBAC custom role"
    ],
    "a": 1,
    "e": "PIM provides just-in-time (JIT) activation of privileged roles with approval workflows, time limits, MFA, and audit trails — ideal for minimizing standing privileged access."
  },
  {
    "id": "az-073",
    "d": 1,
    "t": "Identities & Governance",
    "q": "Your organization syncs on-premises AD to Azure AD. A user's password changed on-premises but they can't sign in to Azure AD. Which tool do you check FIRST?",
    "o": [
      "Azure AD Connect Health",
      "Azure AD Sign-in logs",
      "Active Directory Users and Computers",
      "Azure AD Password Protection proxy logs"
    ],
    "a": 0,
    "e": "Azure AD Connect Health monitors the sync infrastructure, shows sync errors, connector status, and latency — the first stop when on-prem changes aren't reflecting in Azure AD."
  },
  {
    "id": "az-074",
    "d": 1,
    "t": "Identities & Governance",
    "q": "An Azure Policy assignment is blocking resource deployments in a subscription. You need to exclude one resource group from the policy. What should you use?",
    "o": [
      "Delete and re-create the policy at resource-group scope",
      "Set the policy effect to Audit",
      "Add an exclusion (scope exclusion) to the policy assignment",
      "Create a resource lock on the resource group"
    ],
    "a": 2,
    "e": "Policy assignments support scope exclusions — you specify one or more child scopes (resource groups, resources) that are exempt from the policy, without changing the policy definition or effect."
  },
  {
    "id": "az-075",
    "d": 1,
    "t": "Identities & Governance",
    "q": "Which Azure Policy effect creates a resource automatically when one doesn't exist (e.g., adds a Log Analytics diagnostic setting)?",
    "o": [
      "Append",
      "Audit",
      "DeployIfNotExists",
      "Modify"
    ],
    "a": 2,
    "e": "DeployIfNotExists triggers an ARM template deployment when a compliant resource doesn't exist. It's used to auto-remediate, such as deploying diagnostic settings when they're missing."
  },
  {
    "id": "az-076",
    "d": 1,
    "t": "Identities & Governance",
    "q": "You need to regularly review which external guests still need access to a Teams channel. Which Azure AD feature automates this?",
    "o": [
      "Azure AD Privileged Identity Management",
      "Azure AD Access Reviews",
      "Azure AD Entitlement Management",
      "Azure AD Conditional Access"
    ],
    "a": 1,
    "e": "Access Reviews let you schedule periodic reviews of group membership, application assignments, or role assignments — reviewers confirm or remove access, and auto-apply decisions can revoke stale guest access."
  },
  {
    "id": "az-077",
    "d": 1,
    "t": "Identities & Governance",
    "q": "What is the maximum number of Azure AD directories a single user account can be a member of?",
    "o": [
      "1",
      "10",
      "500",
      "Unlimited"
    ],
    "a": 3,
    "e": "A user account (UPN) can be a member (or guest) of an unlimited number of Azure AD tenants. There's no hard cap on tenant membership per user."
  },
  {
    "id": "az-078",
    "d": 1,
    "t": "Identities & Governance",
    "q": "You want all new Azure resources in a subscription to inherit a 'CostCenter' tag from their resource group. Which policy effect achieves this automatically on creation?",
    "o": [
      "Deny",
      "Append",
      "Modify",
      "DeployIfNotExists"
    ],
    "a": 2,
    "e": "The Modify effect can add or replace tags on resources during creation or update, including inheriting a tag value from the resource group — without blocking deployment."
  },
  {
    "id": "az-079",
    "d": 1,
    "t": "Identities & Governance",
    "q": "Your company has 50 subscriptions under 5 departments. You want to enforce a 'No Public IPs' policy across all subscriptions of one department only. What is the MOST efficient scope?",
    "o": [
      "Assign the policy to each subscription individually",
      "Assign the policy to the root management group",
      "Assign the policy to the department's management group",
      "Use Azure Blueprints at tenant level"
    ],
    "a": 2,
    "e": "Management groups let you organize subscriptions into a hierarchy. Assigning a policy to a management group automatically applies it to all child subscriptions in that group — one assignment covers all 10 subscriptions of that department."
  },
  {
    "id": "az-080",
    "d": 1,
    "t": "Identities & Governance",
    "q": "A user in Azure AD reports they can see resources in a subscription but cannot start or stop VMs. Which built-in role are they MOST likely assigned?",
    "o": [
      "Owner",
      "Contributor",
      "Reader",
      "Virtual Machine Contributor"
    ],
    "a": 2,
    "e": "The Reader role grants view-only access to all resources in a scope — no ability to create, modify, or perform actions. The user needs at least Virtual Machine Contributor to start/stop VMs."
  },
  {
    "id": "az-081",
    "d": 1,
    "t": "Identities & Governance",
    "q": "You need to allow an application to read secrets from Azure Key Vault without using a password or certificate stored in code. What is the BEST approach?",
    "o": [
      "Store the service principal secret in app settings",
      "Use a system-assigned managed identity and a Key Vault access policy",
      "Use an Azure AD B2C flow",
      "Store the certificate in Azure Blob Storage"
    ],
    "a": 1,
    "e": "System-assigned managed identity gives the app an automatically managed Azure AD identity. Combined with a Key Vault access policy (or RBAC), the app authenticates without any stored credentials."
  },
  {
    "id": "az-082",
    "d": 1,
    "t": "Identities & Governance",
    "q": "Which Azure AD license tier is required to use Conditional Access policies?",
    "o": [
      "Azure AD Free",
      "Azure AD P1",
      "Azure AD P2",
      "Microsoft 365 E3"
    ],
    "a": 1,
    "e": "Conditional Access requires Azure AD Premium P1 (or higher). P2 adds Identity Protection risk signals. Free tier only has basic security defaults, not granular CA policies."
  },
  {
    "id": "az-083",
    "d": 1,
    "t": "Identities & Governance",
    "q": "You need to enforce that developers can only deploy resources to the East US region across 20 subscriptions. What is the BEST single action?",
    "o": [
      "Create a Conditional Access policy for location",
      "Assign the 'Allowed locations' built-in policy to the management group containing those subscriptions",
      "Create a custom RBAC role restricting regions",
      "Use Azure Blueprints to lock regions"
    ],
    "a": 1,
    "e": "The 'Allowed locations' built-in Azure Policy restricts which Azure regions resources can be deployed to. Assigning it at management group scope covers all child subscriptions in one step."
  },
  {
    "id": "az-084",
    "d": 1,
    "t": "Identities & Governance",
    "q": "What differentiates Azure AD B2B from Azure AD B2C?",
    "o": [
      "B2B is for end consumers; B2C is for partner employees",
      "B2B federates partner/guest identities into your tenant; B2C is a customer identity platform for public apps",
      "B2B requires Azure AD P2; B2C requires P1",
      "They are identical features with different naming"
    ],
    "a": 1,
    "e": "Azure AD B2B lets external partners collaborate using their existing identity (guest accounts in your tenant). Azure AD B2C is a separate CIAM service for building customer-facing apps where users can sign up/in with social or local accounts."
  },
  {
    "id": "az-085",
    "d": 1,
    "t": "Identities & Governance",
    "q": "A resource group has a 'CanNotDelete' resource lock. An Owner of the subscription tries to delete the resource group. What happens?",
    "o": [
      "The delete succeeds because Owner overrides locks",
      "The delete fails — locks override RBAC permissions for everyone except Lock administrators",
      "Only the user who created the lock can delete",
      "The lock only applies to resources inside, not the resource group itself"
    ],
    "a": 1,
    "e": "Resource locks override RBAC permissions. A CanNotDelete lock prevents deletion regardless of role — even Owner or Global Administrator cannot delete without first removing the lock."
  },
  {
    "id": "az-086",
    "d": 2,
    "t": "Storage",
    "q": "You need to automatically move blobs to the Cool tier after 30 days and delete them after 365 days. Which feature handles this?",
    "o": [
      "Azure Blob versioning",
      "Lifecycle management policy",
      "Azure Backup retention",
      "Storage immutability policy"
    ],
    "a": 1,
    "e": "Blob lifecycle management policies define rules with filters (prefix, blob type) and actions (tierToCool, tierToArchive, delete) triggered by age thresholds — fully automated, no custom scripts needed."
  },
  {
    "id": "az-087",
    "d": 2,
    "t": "Storage",
    "q": "A storage account uses LRS redundancy. You need to protect against an entire Azure datacenter failure. What should you change to?",
    "o": [
      "ZRS",
      "GRS",
      "GZRS",
      "RA-GRS"
    ],
    "a": 0,
    "e": "ZRS (Zone-Redundant Storage) replicates data synchronously across 3 availability zones in the same region, protecting against datacenter (zone) failures. GRS protects against region failures but doesn't guarantee zone-level durability."
  },
  {
    "id": "az-088",
    "d": 2,
    "t": "Storage",
    "q": "You want to access Azure Blob Storage from a VNet without traffic leaving the Microsoft backbone. Which feature should you configure?",
    "o": [
      "Storage firewall with IP rules",
      "Service Endpoint for Microsoft.Storage on the subnet",
      "VNet peering with the storage VNet",
      "ExpressRoute public peering"
    ],
    "a": 1,
    "e": "Service Endpoints route traffic from the subnet to Azure Storage over the Microsoft backbone, never the public internet. They extend the VNet's private address space to the service."
  },
  {
    "id": "az-089",
    "d": 2,
    "t": "Storage",
    "q": "Which SAS type allows you to define reusable access policies that can be revoked without regenerating the storage account key?",
    "o": [
      "Account SAS",
      "Service SAS with stored access policy",
      "User delegation SAS",
      "Ad-hoc SAS"
    ],
    "a": 1,
    "e": "A Service SAS linked to a stored access policy can be revoked by deleting or modifying the policy — you don't need to rotate the account key. This is the recommended approach for service-level SAS tokens."
  },
  {
    "id": "az-090",
    "d": 2,
    "t": "Storage",
    "q": "Azure File Sync is deployed with a cloud tiering policy set to 20% free space. What does this mean?",
    "o": [
      "20% of Azure Files capacity is reserved for tiered data",
      "The server endpoint will keep at least 20% of the local volume free by tiering cold files to Azure",
      "20% of files will be cached locally",
      "The policy applies only during business hours"
    ],
    "a": 1,
    "e": "Cloud tiering free space policy ensures that the Windows Server volume always has at least the specified percentage free, by replacing least-recently-used files with pointer stubs that recall on demand from Azure."
  },
  {
    "id": "az-091",
    "d": 2,
    "t": "Storage",
    "q": "You need to copy 50 TB of on-premises data to Azure Blob Storage with the LEAST network impact. Which service should you use?",
    "o": [
      "AzCopy over the internet",
      "Azure Data Factory",
      "Azure Import/Export (Data Box)",
      "Azure Storage Explorer"
    ],
    "a": 2,
    "e": "Azure Data Box (Import/Export) ships physical storage devices — you copy data locally, ship the device to Microsoft, and they upload it to Azure. Ideal for large datasets where network transfer would take too long or consume too much bandwidth."
  },
  {
    "id": "az-092",
    "d": 2,
    "t": "Storage",
    "q": "What is the purpose of soft delete for blobs?",
    "o": [
      "Encrypts blobs at rest",
      "Allows recovery of deleted blobs within a configurable retention period",
      "Replicates blobs to a secondary region",
      "Prevents blobs from being overwritten"
    ],
    "a": 1,
    "e": "Blob soft delete retains deleted or overwritten blobs in a 'soft deleted' state for 1–365 days. During this window, they can be undeleted — protection against accidental deletion or application bugs."
  },
  {
    "id": "az-093",
    "d": 2,
    "t": "Storage",
    "q": "You need to store compliance documents that must not be modified or deleted for 7 years. Which storage feature enforces this?",
    "o": [
      "Blob snapshots",
      "Azure Backup for Blobs",
      "Immutable blob storage (WORM policy)",
      "Azure Key Vault managed HSM"
    ],
    "a": 2,
    "e": "Immutable blob storage supports WORM (Write Once, Read Many) policies — time-based retention locks or legal holds — that prevent modification or deletion even by storage account owners, satisfying regulatory compliance."
  },
  {
    "id": "az-094",
    "d": 2,
    "t": "Storage",
    "q": "A storage account has public network access disabled. How can an application in a different VNet access blobs securely?",
    "o": [
      "Re-enable public access temporarily during transfers",
      "Configure a Private Endpoint in the application's VNet",
      "Use a Service Endpoint on the storage account",
      "Use Shared Key authentication from a public IP"
    ],
    "a": 1,
    "e": "A Private Endpoint assigns a private IP from your VNet to the storage account, enabling secure access over the Microsoft backbone without public internet exposure — even when public access is disabled."
  },
  {
    "id": "az-095",
    "d": 2,
    "t": "Storage",
    "q": "Which Azure storage redundancy option provides read access to data in the secondary region at all times, even without a failover?",
    "o": [
      "GRS",
      "RA-GRS",
      "ZRS",
      "GZRS"
    ],
    "a": 1,
    "e": "RA-GRS (Read-Access Geo-Redundant Storage) replicates to a secondary region AND provides a secondary read endpoint (URL with -secondary suffix) that is always accessible — unlike GRS which only allows reads after a failover."
  },
  {
    "id": "az-096",
    "d": 2,
    "t": "Storage",
    "q": "You need to grant a third-party auditor read-only access to blobs in a container for 48 hours without creating an Azure AD account. What is the BEST approach?",
    "o": [
      "Add them as a Guest user with Storage Blob Data Reader role",
      "Generate a SAS token with read permissions expiring in 48 hours",
      "Enable public anonymous access on the container",
      "Give them the storage account key"
    ],
    "a": 1,
    "e": "A SAS token scoped to the container with read permissions and a 48-hour expiry is the most appropriate option — no account creation, granular permissions, and automatically expires."
  },
  {
    "id": "az-097",
    "d": 2,
    "t": "Storage",
    "q": "What is the minimum redundancy required to use Azure Files Premium tier?",
    "o": [
      "LRS or ZRS only",
      "GRS or GZRS",
      "LRS only",
      "Any redundancy option"
    ],
    "a": 0,
    "e": "Azure Files Premium (FileStorage accounts) supports LRS and ZRS only. Standard Azure Files supports LRS, ZRS, GRS, and GZRS."
  },
  {
    "id": "az-098",
    "d": 2,
    "t": "Storage",
    "q": "Which AzCopy command syntax correctly copies all blobs from a container to a local directory?",
    "o": [
      "azcopy copy 'https://account.blob.core.windows.net/container' './local' --recursive",
      "azcopy sync 'https://account.blob.core.windows.net/container' './local'",
      "azcopy upload './local' 'https://account.blob.core.windows.net/container'",
      "azcopy pull 'https://account.blob.core.windows.net/container' './local'"
    ],
    "a": 0,
    "e": "azcopy copy with --recursive downloads all blobs from a container URL to a local path. 'sync' is for keeping source and destination in sync (deletes extras). 'upload' and 'pull' are not valid AzCopy commands."
  },
  {
    "id": "az-099",
    "d": 3,
    "t": "Compute",
    "q": "You need to scale out a set of identical VMs automatically based on CPU load and ensure zero downtime during OS updates. Which feature should you use?",
    "o": [
      "Availability Set",
      "VM Scale Set with rolling upgrade policy",
      "Azure Dedicated Host",
      "Proximity Placement Group"
    ],
    "a": 1,
    "e": "VM Scale Sets with rolling upgrade policy update instances in batches, keeping a portion always running — ensuring zero downtime. They also auto-scale based on metrics like CPU."
  },
  {
    "id": "az-100",
    "d": 3,
    "t": "Compute",
    "q": "Which Azure service provides secure RDP/SSH access to VMs directly from the Azure portal WITHOUT exposing public IP addresses or requiring open inbound ports?",
    "o": [
      "Azure VPN Gateway",
      "Azure Bastion",
      "Azure Firewall DNAT rule",
      "Just-in-time VM access"
    ],
    "a": 1,
    "e": "Azure Bastion is a managed PaaS service that provides browser-based RDP/SSH over TLS to VMs without exposing them to the public internet — no public IP needed on the VM, no inbound 3389/22 ports."
  },
  {
    "id": "az-101",
    "d": 3,
    "t": "Compute",
    "q": "You need to run a containerized workload that scales to zero when idle and requires no infrastructure management. Which Azure service is the BEST fit?",
    "o": [
      "Azure Kubernetes Service (AKS)",
      "Azure Container Instances (ACI)",
      "Azure VM with Docker",
      "Azure App Service with container"
    ],
    "a": 1,
    "e": "ACI runs containers on-demand without managing VMs or orchestration. It starts in seconds and you only pay while running — ideal for burst, short-lived, or scale-to-zero workloads."
  },
  {
    "id": "az-102",
    "d": 3,
    "t": "Compute",
    "q": "An App Service web app needs to access an Azure SQL Database securely without storing connection credentials in config files. What is the BEST approach?",
    "o": [
      "Store credentials in Azure Key Vault and reference with app settings",
      "Enable system-assigned managed identity and grant it access to SQL using Azure AD authentication",
      "Use a service principal with a certificate stored in Blob Storage",
      "Hard-code credentials in the app source code"
    ],
    "a": 1,
    "e": "With a managed identity, the App Service gets an Azure AD identity automatically. Granting it access to SQL via Azure AD authentication eliminates the need to store or rotate any credentials."
  },
  {
    "id": "az-103",
    "d": 3,
    "t": "Compute",
    "q": "You want to test a new version of an App Service app in production conditions before swapping it to the live slot. Which feature enables this?",
    "o": [
      "App Service Backup",
      "Deployment slots (staging slot)",
      "Azure Traffic Manager weighted routing",
      "Azure Front Door A/B routing"
    ],
    "a": 1,
    "e": "Deployment slots let you deploy to a 'staging' slot (with production configuration via slot settings), test thoroughly, then do a warm swap — the staging slot becomes production with zero downtime."
  },
  {
    "id": "az-104",
    "d": 3,
    "t": "Compute",
    "q": "Which App Service plan tier supports auto-scaling, custom domains, SSL, and deployment slots?",
    "o": [
      "Free (F1)",
      "Shared (D1)",
      "Standard (S1) or higher",
      "Basic (B1)"
    ],
    "a": 2,
    "e": "Standard tier and above support auto-scaling rules and deployment slots (up to 5). Basic supports custom domains and SSL but NOT auto-scaling or slots. Free and Shared have significant limitations."
  },
  {
    "id": "az-105",
    "d": 3,
    "t": "Compute",
    "q": "Your AKS cluster nodes are running at 90% CPU. New pods are stuck in Pending state. What is the FASTEST way to accommodate them?",
    "o": [
      "Add more pods to the existing nodes",
      "Enable the cluster autoscaler on the node pool",
      "Manually add a new node pool",
      "Increase pod resource limits"
    ],
    "a": 1,
    "e": "The cluster autoscaler detects pending pods that can't schedule due to insufficient node resources, then automatically scales out the node pool. It's the fastest way to accommodate burst demand without manual intervention."
  },
  {
    "id": "az-106",
    "d": 3,
    "t": "Compute",
    "q": "You need to run a one-time data processing batch job that uses 1000 VMs in parallel for 2 hours. Which Azure service is designed for this?",
    "o": [
      "Azure VM Scale Sets",
      "Azure Batch",
      "Azure Kubernetes Service",
      "Azure App Service"
    ],
    "a": 1,
    "e": "Azure Batch is purpose-built for large-scale parallel and HPC workloads — it provisions, manages, and scales pools of compute nodes, distributes tasks, and tears down automatically after completion."
  },
  {
    "id": "az-107",
    "d": 3,
    "t": "Compute",
    "q": "What is the purpose of Proximity Placement Groups in Azure?",
    "o": [
      "Group VMs in different regions for failover",
      "Keep a set of VMs physically close together within a datacenter to minimize inter-VM latency",
      "Automatically place VMs across availability zones",
      "Reserve capacity for VMs in a specific region"
    ],
    "a": 1,
    "e": "Proximity Placement Groups (PPG) co-locate VMs in the same physical data center rack, minimizing network latency between them — critical for tightly coupled HPC, SAP HANA, or latency-sensitive workloads."
  },
  {
    "id": "az-108",
    "d": 3,
    "t": "Compute",
    "q": "A VM uses Spot pricing. Azure sends a 30-second eviction notice. What should your architecture account for?",
    "o": [
      "Spot VMs cannot be evicted once running",
      "The workload must tolerate interruption and be stateless or checkpoint frequently",
      "Azure provides a 1-hour warning and migrates the VM",
      "Spot VMs in Availability Zones cannot be evicted"
    ],
    "a": 1,
    "e": "Spot VMs can be evicted with 30 seconds notice when Azure needs capacity. Workloads must be stateless, use checkpointing, or store state externally — suitable for batch jobs, CI/CD agents, dev/test environments."
  },
  {
    "id": "az-109",
    "d": 3,
    "t": "Compute",
    "q": "Which VM extension enables automatic patching and collects patch compliance data for Azure VMs?",
    "o": [
      "Azure Monitor Agent",
      "Log Analytics Agent",
      "Azure Update Manager / Guest Configuration extension",
      "Azure Automation DSC"
    ],
    "a": 2,
    "e": "Azure Update Manager (using the Azure Policies and machine extensions framework) assesses patch compliance and can automatically install updates on Azure VMs — replacing the older Update Management solution in Azure Automation."
  },
  {
    "id": "az-110",
    "d": 3,
    "t": "Compute",
    "q": "You need to deploy a containerized app that requires persistent storage and service discovery between microservices, with full orchestration. Which Azure service should you use?",
    "o": [
      "Azure Container Instances",
      "Azure Kubernetes Service (AKS)",
      "Azure App Service with Docker Compose",
      "Azure Container Apps"
    ],
    "a": 1,
    "e": "AKS provides full Kubernetes orchestration including persistent volumes, service discovery, ingress, horizontal pod autoscaling, and namespace isolation — the right choice for complex multi-container workloads."
  },
  {
    "id": "az-111",
    "d": 3,
    "t": "Compute",
    "q": "An Azure VM is unresponsive and you cannot connect via RDP. Which Azure feature lets you view the boot screen and run commands without network connectivity?",
    "o": [
      "Azure Bastion",
      "Serial Console and Boot Diagnostics",
      "Azure Network Watcher",
      "VM Run Command via Azure CLI"
    ],
    "a": 1,
    "e": "Serial Console provides terminal access via the COM port (works even without network). Boot Diagnostics shows a screenshot of the VM's boot state. Together they allow diagnosing and fixing VMs that are unresponsive to RDP/SSH."
  },
  {
    "id": "az-112",
    "d": 4,
    "t": "Networking",
    "q": "You need to protect a web app from SQL injection and XSS attacks at the HTTP layer. Which Azure service provides this?",
    "o": [
      "Azure Firewall",
      "Network Security Group",
      "Azure Application Gateway with WAF",
      "Azure DDoS Protection Standard"
    ],
    "a": 2,
    "e": "Application Gateway with WAF (Web Application Firewall) inspects HTTP traffic for OWASP threats like SQL injection and XSS at layer 7 — NSG and Azure Firewall operate at layers 3-4 and don't parse HTTP payloads."
  },
  {
    "id": "az-113",
    "d": 4,
    "t": "Networking",
    "q": "What is the key difference between Azure Load Balancer and Azure Application Gateway?",
    "o": [
      "Load Balancer is regional; Application Gateway is global",
      "Load Balancer works at layer 4 (TCP/UDP); Application Gateway works at layer 7 (HTTP/HTTPS)",
      "Application Gateway only works with VMs; Load Balancer works with all resources",
      "Load Balancer supports WAF; Application Gateway does not"
    ],
    "a": 1,
    "e": "Azure Load Balancer distributes traffic at layer 4 (transport layer, port/protocol). Application Gateway routes at layer 7 (application layer), enabling URL-based routing, session affinity, SSL termination, and WAF."
  },
  {
    "id": "az-114",
    "d": 4,
    "t": "Networking",
    "q": "Users across three continents need to be routed to the nearest healthy application endpoint. Which Azure service provides latency-based global routing with health monitoring?",
    "o": [
      "Azure Load Balancer Standard",
      "Azure Application Gateway",
      "Azure Traffic Manager",
      "Azure Front Door"
    ],
    "a": 2,
    "e": "Traffic Manager is a DNS-based global load balancer. Its 'Performance' routing method directs users to the closest endpoint by measuring DNS latency, with health probes to avoid directing traffic to unhealthy endpoints."
  },
  {
    "id": "az-115",
    "d": 4,
    "t": "Networking",
    "q": "An NSG rule has priority 100 allowing port 80 and priority 200 denying port 80. What happens to HTTP traffic?",
    "o": [
      "Both rules apply and traffic is denied",
      "The deny rule wins regardless of priority",
      "The allow rule wins because lower priority number = higher priority",
      "Traffic is blocked by default"
    ],
    "a": 2,
    "e": "NSG rules are processed in order from lowest to highest priority number. Priority 100 is evaluated before priority 200, so the allow rule at 100 is matched first and HTTP traffic is allowed."
  },
  {
    "id": "az-116",
    "d": 4,
    "t": "Networking",
    "q": "Two VNets need to communicate. They are in different Azure regions. Which connectivity option requires the LEAST configuration and NO gateway?",
    "o": [
      "VPN Gateway connection",
      "ExpressRoute",
      "Global VNet Peering",
      "Azure Virtual WAN"
    ],
    "a": 2,
    "e": "Global VNet Peering extends VNet peering across regions with no gateway required. Traffic traverses the Microsoft backbone. It's the simplest option for cross-region VNet connectivity."
  },
  {
    "id": "az-117",
    "d": 4,
    "t": "Networking",
    "q": "You want to access Azure PaaS services (SQL Database, Key Vault) from a VNet using a private IP address, making them invisible to the public internet. Which feature provides this?",
    "o": [
      "Service Endpoints",
      "Private Endpoints",
      "VNet Integration",
      "Network Security Groups"
    ],
    "a": 1,
    "e": "Private Endpoints assign a private IP from your VNet to the PaaS service. DNS resolves the service's FQDN to the private IP, so traffic never leaves your VNet — unlike Service Endpoints, which still route to the service's public IP."
  },
  {
    "id": "az-118",
    "d": 4,
    "t": "Networking",
    "q": "Your on-premises network connects to Azure via ExpressRoute. You also want to route all VM internet traffic through your on-premises firewall. Which Azure feature forces this?",
    "o": [
      "NSG outbound deny rule for internet",
      "Service Endpoint for internet traffic",
      "User Defined Route (UDR) with default route (0.0.0.0/0) pointing to on-premises virtual appliance",
      "Azure Firewall with DNAT rules"
    ],
    "a": 2,
    "e": "A UDR with a default route (0.0.0.0/0) pointing to the on-premises NVA/firewall (via ExpressRoute) is called forced tunneling — it redirects all internet-bound VM traffic through the on-premises network for inspection."
  },
  {
    "id": "az-119",
    "d": 4,
    "t": "Networking",
    "q": "Which Azure tool captures and analyzes VM network traffic flows, and can detect security anomalies using traffic analytics?",
    "o": [
      "Azure Monitor",
      "Azure Firewall Logs",
      "Network Watcher with NSG Flow Logs",
      "Azure Sentinel"
    ],
    "a": 2,
    "e": "Network Watcher's NSG Flow Logs capture source/destination IP, port, protocol, and allow/deny decisions. Combined with Traffic Analytics (Log Analytics), it visualizes patterns and flags anomalies."
  },
  {
    "id": "az-120",
    "d": 4,
    "t": "Networking",
    "q": "You need to resolve Azure private DNS zone hostnames from an on-premises network connected via ExpressRoute. What must you configure?",
    "o": [
      "A public DNS delegation for the private zone",
      "A DNS resolver or conditional forwarder on-premises pointing to Azure DNS (168.63.129.16)",
      "Azure DNS Private Resolver with inbound endpoints",
      "ExpressRoute Route Filter for DNS traffic"
    ],
    "a": 2,
    "e": "Azure DNS Private Resolver with an inbound endpoint provides a reachable IP that on-premises DNS forwarders can send queries to. This is the recommended way to resolve Azure private DNS zones from on-premises since 168.63.129.16 is not reachable off-Azure."
  },
  {
    "id": "az-121",
    "d": 4,
    "t": "Networking",
    "q": "What is the default behavior when you associate an NSG with a subnet AND with a NIC on a VM inside that subnet?",
    "o": [
      "Only the subnet NSG is applied",
      "Only the NIC NSG is applied",
      "Both NSGs are evaluated — traffic must be allowed by both to reach the VM",
      "The NSG with lower priority wins"
    ],
    "a": 2,
    "e": "When NSGs are on both the subnet and NIC, inbound traffic is evaluated against the subnet NSG first, then the NIC NSG — traffic must pass both. Outbound traffic is evaluated in reverse order (NIC first, then subnet)."
  },
  {
    "id": "az-122",
    "d": 4,
    "t": "Networking",
    "q": "You need to connect 100 branch offices to Azure and to each other through a central hub, with automatic routing and SD-WAN support. Which Azure service is designed for this?",
    "o": [
      "VPN Gateway with BGP",
      "Azure Virtual WAN",
      "Multiple VNet Peerings with NVA",
      "Azure ExpressRoute with multiple circuits"
    ],
    "a": 1,
    "e": "Azure Virtual WAN is a networking service that provides optimized, hub-and-spoke connectivity between branches, Azure VNets, and the internet with integrated BGP routing — designed for large-scale branch connectivity scenarios."
  },
  {
    "id": "az-123",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "You want to be alerted when a VM's available memory drops below 500 MB. Which Azure Monitor component do you configure?",
    "o": [
      "Diagnostic Setting",
      "Activity Log alert",
      "Metric alert rule",
      "Log Analytics workspace query"
    ],
    "a": 2,
    "e": "Metric alert rules evaluate numeric signals (CPU, memory, disk) against thresholds at a configured frequency. The Azure Monitor Agent (AMA) must be installed to collect in-guest metrics like available memory."
  },
  {
    "id": "az-124",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "A resource was accidentally deleted. Where do you look in Azure Monitor to find out WHO deleted it and WHEN?",
    "o": [
      "Metrics Explorer",
      "Log Analytics Workspace",
      "Activity Log",
      "Azure Advisor"
    ],
    "a": 2,
    "e": "The Activity Log records all control-plane operations (ARM operations) — create, delete, update — including the caller identity, timestamp, and result. It's the authoritative audit trail for resource lifecycle events."
  },
  {
    "id": "az-125",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "Your team wants to run a KQL query to find all failed login attempts to Azure VMs in the past 24 hours. Where do you write and run this query?",
    "o": [
      "Azure Monitor Metrics Explorer",
      "Log Analytics Workspace",
      "Azure Security Center",
      "Azure Activity Log"
    ],
    "a": 1,
    "e": "Log Analytics Workspace stores and indexes log data from VMs (via AMA/MMA), Azure services, and security solutions. KQL queries run against this store — Metrics Explorer is for numeric time-series data only."
  },
  {
    "id": "az-126",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "You need to restore a VM to a state from 3 days ago. The VM was backed up daily with Azure Backup. What is the recovery option?",
    "o": [
      "VM snapshot restore from Blob Storage",
      "Restore from Recovery Services Vault recovery point to a new or existing VM",
      "Re-deploy from ARM template",
      "Use Azure Site Recovery to initiate failover"
    ],
    "a": 1,
    "e": "Azure Backup stores recovery points in a Recovery Services Vault. You select the desired recovery point (3 days ago) and restore to the original VM location or to a new VM — this is the standard restore path."
  },
  {
    "id": "az-127",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "What is the difference between RPO and RTO in disaster recovery planning?",
    "o": [
      "RPO is the recovery time; RTO is the data loss tolerance",
      "RPO is maximum tolerable data loss (time); RTO is maximum tolerable downtime",
      "RPO and RTO are both measured in data volume",
      "RTO applies only to Active-Active architectures"
    ],
    "a": 1,
    "e": "RPO (Recovery Point Objective) defines how much data loss is acceptable — e.g., RPO of 1 hour means backups/replication must be at most 1 hour old. RTO (Recovery Time Objective) defines how quickly the system must be back online."
  },
  {
    "id": "az-128",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "Azure Site Recovery (ASR) is replicating an on-premises Hyper-V VM to Azure. The primary site goes down. What is the process to bring the VM online in Azure?",
    "o": [
      "ASR automatically starts the VM in Azure with no action needed",
      "Run a test failover first, then a planned failover from the Recovery Services Vault",
      "Restore from Azure Backup",
      "Trigger a failover from the Recovery Services Vault; ASR brings the replicated VM online in Azure"
    ],
    "a": 3,
    "e": "ASR continuously replicates the VM to Azure. On primary site failure, you trigger an unplanned failover from the Recovery Services Vault (or automate it via recovery plans) — ASR brings the VM online in Azure using the latest replicated state."
  },
  {
    "id": "az-129",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "Which Azure Monitor feature allows you to define a set of KQL queries, charts, and metrics in a single reusable view that can be shared across teams?",
    "o": [
      "Azure Dashboard",
      "Azure Workbooks",
      "Metrics Explorer pinned charts",
      "Application Insights Live Metrics"
    ],
    "a": 1,
    "e": "Azure Monitor Workbooks are interactive documents that combine KQL queries, metrics visualizations, text, and parameter controls into shareable, parameterized reports — much richer than static dashboard tiles."
  },
  {
    "id": "az-130",
    "d": 5,
    "t": "Monitor & Backup",
    "q": "You apply a 'CanNotDelete' lock to a resource group. A team member needs to update the tags on a resource inside it. Can they?",
    "o": [
      "No — CanNotDelete prevents all modifications including tag updates",
      "Yes — CanNotDelete only prevents deletion, not modification of resources",
      "Only the lock owner can modify resources",
      "Tags are managed at subscription level and are unaffected by locks"
    ],
    "a": 1,
    "e": "CanNotDelete lock only prevents deletion. Read and write operations (including tag updates, configuration changes) are still permitted on resources within the locked scope — only ReadOnly locks block modifications."
  }
],
    why: {
  "az-001": [
    "Incorrecto: \"User Administrator\" no cumple con el requisito descrito. La opción correcta es \"Global Administrator\" — Global Administrator has full control over Azure AD and all Microsoft 365/Azure services. It's the most powerful directory role.",
    null,
    "It's the most powerful directory role.",
    "Incorrecto: \"Security Administrator\" no cumple con el requisito descrito. La opción correcta es \"Global Administrator\" — Global Administrator has full control over Azure AD and all Microsoft 365/Azure services. It's the most powerful directory role."
  ],
  "az-002": [
    "Owner includes the ability to assign roles.",
    null,
    "Incorrecto: \"Reader\" no cumple con el requisito descrito. La opción correcta es \"Contributor\" — Contributor can create and manage all resources but cannot grant RBAC access to others. Owner includes the ability to assign roles.",
    "Incorrecto: \"User Access Administrator\" no cumple con el requisito descrito. La opción correcta es \"Contributor\" — Contributor can create and manage all resources but cannot grant RBAC access to others. Owner includes the ability to assign roles."
  ],
  "az-003": [
    "Management Groups allow you to organize subscriptions hierarchically and apply policies, RBAC, and budgets at scale across multiple subscriptions.",
    null,
    "Incorrecto: \"Use Azure Blueprints on each subscription\" no cumple con el requisito descrito. La opción correcta es \"Create a Management Group and apply policies at that level\" — Management Groups allow you to organize subscriptions hierarchically and apply policies, RBAC, and budgets at scale across multiple subscriptions.",
    "Management Groups allow you to organize subscriptions hierarchically and apply policies, RBAC, and budgets at scale across multiple subscriptions."
  ],
  "az-004": [
    "Incorrecto: \"RBAC Deny assignment\" no cumple con el requisito descrito. La opción correcta es \"Azure Policy with Deny effect\" — Azure Policy with the Deny effect prevents non-compliant resource creation. The built-in policy 'Allowed locations' restricts deployments to specified regions.",
    null,
    "Incorrecto: \"Azure Blueprints\" no cumple con el requisito descrito. La opción correcta es \"Azure Policy with Deny effect\" — Azure Policy with the Deny effect prevents non-compliant resource creation. The built-in policy 'Allowed locations' restricts deployments to specified regions.",
    "Incorrecto: \"Resource Locks\" no cumple con el requisito descrito. La opción correcta es \"Azure Policy with Deny effect\" — Azure Policy with the Deny effect prevents non-compliant resource creation. The built-in policy 'Allowed locations' restricts deployments to specified regions."
  ],
  "az-005": [
    "Incorrecto: \"Assign Reader role to all users\" no cumple con el requisito descrito. La opción correcta es \"Resource Lock of type CanNotDelete\" — CanNotDelete locks prevent deletion of a resource or resource group even by Owners. The resource can still be modified but not deleted.",
    "Incorrecto: \"Azure Policy with Audit effect\" no cumple con el requisito descrito. La opción correcta es \"Resource Lock of type CanNotDelete\" — CanNotDelete locks prevent deletion of a resource or resource group even by Owners. The resource can still be modified but not deleted.",
    null,
    "The resource can still be modified but not deleted."
  ],
  "az-006": [
    "Incorrecto: \"MFA Server\" no cumple con el requisito descrito. La opción correcta es \"Conditional Access\" — Conditional Access evaluates signals (location, device, user risk) and applies access controls like MFA only when conditions are met. Requires Azure AD Premium P1.",
    null,
    "Incorrecto: \"Identity Protection\" no cumple con el requisito descrito. La opción correcta es \"Conditional Access\" — Conditional Access evaluates signals (location, device, user risk) and applies access controls like MFA only when conditions are met. Requires Azure AD Premium P1.",
    "Incorrecto: \"Privileged Identity Management (PIM)\" no cumple con el requisito descrito. La opción correcta es \"Conditional Access\" — Conditional Access evaluates signals (location, device, user risk) and applies access controls like MFA only when conditions are met. Requires Azure AD Premium P1."
  ],
  "az-007": [
    "Incorrecto: \"Contributor role doesn't include read permissions\" no cumple con el requisito descrito. La opción correcta es \"A Deny assignment at resource level overrides the Contributor role\" — Deny assignments explicitly block access even when a permissive role (like Contributor) would otherwise allow it. They take precedence over allow roles.",
    "Incorrecto: \"The resource is in a different subscription\" no cumple con el requisito descrito. La opción correcta es \"A Deny assignment at resource level overrides the Contributor role\" — Deny assignments explicitly block access even when a permissive role (like Contributor) would otherwise allow it. They take precedence over allow roles.",
    null,
    "Incorrecto: \"The resource was recently moved between resource groups\" no cumple con el requisito descrito. La opción correcta es \"A Deny assignment at resource level overrides the Contributor role\" — Deny assignments explicitly block access even when a permissive role (like Contributor) would otherwise allow it. They take precedence over allow roles."
  ],
  "az-008": [
    "Incorrecto: \"Resource → Resource Group → Subscription → Management Group\" no cumple con el requisito descrito. La opción correcta es \"Management Group → Subscription → Resource Group → Resource\" — RBAC assignments are inherited downward: Management Group → Subscription → Resource Group → Resource. A role assigned at a higher scope propagates to all child scopes.",
    null,
    "Incorrecto: \"Subscription → Management Group → Resource Group → Resource\" no cumple con el requisito descrito. La opción correcta es \"Management Group → Subscription → Resource Group → Resource\" — RBAC assignments are inherited downward: Management Group → Subscription → Resource Group → Resource. A role assigned at a higher scope propagates to all child scopes.",
    "Incorrecto: \"Resource Group → Resource → Subscription → Management Group\" no cumple con el requisito descrito. La opción correcta es \"Management Group → Subscription → Resource Group → Resource\" — RBAC assignments are inherited downward: Management Group → Subscription → Resource Group → Resource. A role assigned at a higher scope propagates to all child scopes."
  ],
  "az-009": [
    "Incorrecto: \"Permanently assign admin roles to reduce ticket overhead\" no cumple con el requisito descrito. La opción correcta es \"Provide just-in-time privileged access with approval workflows and time limits\" — PIM provides time-limited, just-in-time privileged access to Azure AD and Azure resources, with optional approval workflows, reducing standing privilege exposure.",
    null,
    "PIM provides time-limited, just-in-time privileged access to Azure AD and Azure resources, with optional approval workflows, reducing standing privilege exposure.",
    "Incorrecto: \"Audit all login activity and generate compliance reports\" no cumple con el requisito descrito. La opción correcta es \"Provide just-in-time privileged access with approval workflows and time limits\" — PIM provides time-limited, just-in-time privileged access to Azure AD and Azure resources, with optional approval workflows, reducing standing privilege exposure."
  ],
  "az-010": [
    "Incorrecto: \"Deny\" no cumple con el requisito descrito. La opción correcta es \"Modify\" — Modify effect can add, update, or remove tags on resources during creation or update, without blocking the operation. Append adds properties but cannot modify existing ones.",
    "Incorrecto: \"Audit\" no cumple con el requisito descrito. La opción correcta es \"Modify\" — Modify effect can add, update, or remove tags on resources during creation or update, without blocking the operation. Append adds properties but cannot modify existing ones.",
    "Append adds properties but cannot modify existing ones.",
    null
  ],
  "az-011": [
    "Incorrecto: \"Azure AD Free\" no cumple con el requisito descrito. La opción correcta es \"Azure AD Premium P1\" — Conditional Access policies require Azure AD Premium P1 at minimum. P2 adds Identity Protection-based conditions (user/sign-in risk).",
    null,
    "Incorrecto: \"Azure AD Premium P2\" no cumple con el requisito descrito. La opción correcta es \"Azure AD Premium P1\" — Conditional Access policies require Azure AD Premium P1 at minimum. P2 adds Identity Protection-based conditions (user/sign-in risk).",
    "Incorrecto: \"Microsoft 365 Business Basic\" no cumple con el requisito descrito. La opción correcta es \"Azure AD Premium P1\" — Conditional Access policies require Azure AD Premium P1 at minimum. P2 adds Identity Protection-based conditions (user/sign-in risk)."
  ],
  "az-012": [
    "Data plane operations (reading/writing blobs) are not directly affected by the lock type.",
    "Data plane operations (reading/writing blobs) are not directly affected by the lock type.",
    null,
    "Data plane operations (reading/writing blobs) are not directly affected by the lock type."
  ],
  "az-013": [
    "Incorrecto: \"They are deleted immediately\" no cumple con el requisito descrito. La opción correcta es \"They are flagged in the compliance report but NOT modified or blocked\" — The Audit effect only logs non-compliant resources in the Azure Policy compliance dashboard. It does not block, modify, or delete resources.",
    null,
    "Incorrecto: \"A remediation task runs automatically\" no cumple con el requisito descrito. La opción correcta es \"They are flagged in the compliance report but NOT modified or blocked\" — The Audit effect only logs non-compliant resources in the Azure Policy compliance dashboard. It does not block, modify, or delete resources.",
    "Incorrecto: \"They are moved to a quarantine resource group\" no cumple con el requisito descrito. La opción correcta es \"They are flagged in the compliance report but NOT modified or blocked\" — The Audit effect only logs non-compliant resources in the Azure Policy compliance dashboard. It does not block, modify, or delete resources."
  ],
  "az-014": [
    "Assigning the Contributor (or custom) role at the resource group scope limits the user's access to only that resource group, following the principle of least privilege.",
    "Incorrecto: \"Subscription\" no cumple con el requisito descrito. La opción correcta es \"Resource Group\" — Assigning the Contributor (or custom) role at the resource group scope limits the user's access to only that resource group, following the principle of least privilege.",
    null,
    "Incorrecto: \"Individual VM resources\" no cumple con el requisito descrito. La opción correcta es \"Resource Group\" — Assigning the Contributor (or custom) role at the resource group scope limits the user's access to only that resource group, following the principle of least privilege."
  ],
  "az-015": [
    "Azure Blueprints package governance artifacts (policies, RBAC, ARM templates, resource groups) into a single definition that can be applied repeatedly to create compliant environments.",
    null,
    "Azure Blueprints package governance artifacts (policies, RBAC, ARM templates, resource groups) into a single definition that can be applied repeatedly to create compliant environments.",
    "Incorrecto: \"Provide cost allocation reports across subscriptions\" no cumple con el requisito descrito. La opción correcta es \"Package RBAC, policies, resource groups, and ARM templates into a reusable definition for consistent environment setup\" — Azure Blueprints package governance artifacts (policies, RBAC, ARM templates, resource groups) into a single definition that can be applied repeatedly to create compliant environments."
  ],
  "az-016": [
    "Incorrecto: \"Azure Files\" no cumple con el requisito descrito. La opción correcta es \"Azure Blob Storage\" — Azure Blob Storage is designed for unstructured data (images, videos, documents) and natively exposes HTTP/HTTPS endpoints. It's the de facto choice for web-accessible object storage.",
    "It's the de facto choice for web-accessible object storage.",
    null,
    "It's the de facto choice for web-accessible object storage."
  ],
  "az-017": [
    "ZRS replicates across 3 separate availability zones in the same region, protecting against single-datacenter failures while staying in-region.",
    null,
    "Incorrecto: \"LRS is cheaper and less durable than ZRS\" no cumple con el requisito descrito. La opción correcta es \"LRS replicates 3 copies within a single datacenter; ZRS replicates across 3 availability zones in the same region\" — LRS keeps 3 copies within one datacenter. ZRS replicates across 3 separate availability zones in the same region, protecting against single-datacenter failures while staying in-region.",
    "Incorrecto: \"ZRS is only available for premium storage accounts\" no cumple con el requisito descrito. La opción correcta es \"LRS replicates 3 copies within a single datacenter; ZRS replicates across 3 availability zones in the same region\" — LRS keeps 3 copies within one datacenter. ZRS replicates across 3 separate availability zones in the same region, protecting against single-datacenter failures while staying in-region."
  ],
  "az-018": [
    "They can be restricted to specific operations, containers, and time windows without exposing account keys.",
    null,
    "Incorrecto: \"Azure AD token with a Contributor role\" no cumple con el requisito descrito. La opción correcta es \"Shared Access Signature (SAS) token with 48-hour expiry\" — SAS tokens provide time-limited, permission-scoped access to storage resources. They can be restricted to specific operations, containers, and time windows without exposing account keys.",
    "They can be restricted to specific operations, containers, and time windows without exposing account keys."
  ],
  "az-019": [
    "Incorrecto: \"Hot\" no cumple con el requisito descrito. La opción correcta es \"Archive\" — Archive tier has the lowest storage cost but the highest access cost and latency (data must be rehydrated, taking hours). It's designed for rarely accessed data kept long-term.",
    "Incorrecto: \"Cool\" no cumple con el requisito descrito. La opción correcta es \"Archive\" — Archive tier has the lowest storage cost but the highest access cost and latency (data must be rehydrated, taking hours). It's designed for rarely accessed data kept long-term.",
    "Incorrecto: \"Cold\" no cumple con el requisito descrito. La opción correcta es \"Archive\" — Archive tier has the lowest storage cost but the highest access cost and latency (data must be rehydrated, taking hours). It's designed for rarely accessed data kept long-term.",
    null
  ],
  "az-020": [
    "Azure Disks with shared disk are limited to specific use cases.",
    null,
    "Azure Disks with shared disk are limited to specific use cases.",
    "Azure Disks with shared disk are limited to specific use cases."
  ],
  "az-021": [
    "Incorrecto: \"The blob is permanently deleted after 24 hours\" no cumple con el requisito descrito. La opción correcta es \"The blob can be restored within 14 days from the Azure portal or API\" — Blob soft delete retains deleted blobs in a soft-deleted state for the retention period. They can be undeleted via the portal, CLI, or API within that window.",
    null,
    "Incorrecto: \"The blob is automatically moved to the Archive tier\" no cumple con el requisito descrito. La opción correcta es \"The blob can be restored within 14 days from the Azure portal or API\" — Blob soft delete retains deleted blobs in a soft-deleted state for the retention period. They can be undeleted via the portal, CLI, or API within that window.",
    "Incorrecto: \"The blob must be recovered from Azure Backup\" no cumple con el requisito descrito. La opción correcta es \"The blob can be restored within 14 days from the Azure portal or API\" — Blob soft delete retains deleted blobs in a soft-deleted state for the retention period. They can be undeleted via the portal, CLI, or API within that window."
  ],
  "az-022": [
    "Enabling the hierarchical namespace during account creation adds directory and file-level POSIX ACLs on top of Blob Storage.",
    "Incorrecto: \"General-purpose v1 (GPv1)\" no cumple con el requisito descrito. La opción correcta es \"General-purpose v2 (GPv2) with hierarchical namespace enabled\" — ADLS Gen2 is built on GPv2 accounts. Enabling the hierarchical namespace during account creation adds directory and file-level POSIX ACLs on top of Blob Storage.",
    null,
    "Incorrecto: \"Premium FileStorage\" no cumple con el requisito descrito. La opción correcta es \"General-purpose v2 (GPv2) with hierarchical namespace enabled\" — ADLS Gen2 is built on GPv2 accounts. Enabling the hierarchical namespace during account creation adds directory and file-level POSIX ACLs on top of Blob Storage."
  ],
  "az-023": [
    "Incorrecto: \"AzCopy over the internet link\" no cumple con el requisito descrito. La opción correcta es \"Azure Data Box (physical device)\" — 200 TB over 100 Mbps would take weeks. Azure Data Box ships a physical appliance (80 TB capacity) to your location. You load data locally and ship it back to Microsoft for upload, bypassing network limitations.",
    "Azure Data Box ships a physical appliance (80 TB capacity) to your location.",
    null,
    "Azure Data Box ships a physical appliance (80 TB capacity) to your location."
  ],
  "az-024": [
    "Lifecycle policies automate tier transitions (Hot → Cool → Archive) and deletion based on blob age, last modified date, or last accessed date, optimizing storage costs.",
    null,
    "Lifecycle policies automate tier transitions (Hot → Cool → Archive) and deletion based on blob age, last modified date, or last accessed date, optimizing storage costs.",
    "Incorrecto: \"Enable geo-redundant replication on a schedule\" no cumple con el requisito descrito. La opción correcta es \"Automatically transition blobs between access tiers or delete them after specified days\" — Lifecycle policies automate tier transitions (Hot → Cool → Archive) and deletion based on blob age, last modified date, or last accessed date, optimizing storage costs."
  ],
  "az-025": [
    "Incorrecto: \"Disable the storage account firewall entirely\" no cumple con el requisito descrito. La opción correcta es \"Add the VM's subnet to the storage account's allowed virtual networks\" — Storage firewall 'service endpoints' or 'private endpoints' allow access from specific VNets/subnets. Adding the subnet to the allowed list enables private access without exposing a public IP.",
    "Adding the subnet to the allowed list enables private access without exposing a public IP.",
    null,
    "Incorrecto: \"Create a VPN Gateway between the VM's VNet and the storage account\" no cumple con el requisito descrito. La opción correcta es \"Add the VM's subnet to the storage account's allowed virtual networks\" — Storage firewall 'service endpoints' or 'private endpoints' allow access from specific VNets/subnets. Adding the subnet to the allowed list enables private access without exposing a public IP."
  ],
  "az-026": [
    "Incorrecto: \"ZRS\" no cumple con el requisito descrito. La opción correcta es \"GZRS\" — GZRS (Geo-Zone-Redundant Storage) combines ZRS (3 zones in primary region) with GRS (replication to a secondary paired region), providing the highest durability.",
    "Incorrecto: \"GRS\" no cumple con el requisito descrito. La opción correcta es \"GZRS\" — GZRS (Geo-Zone-Redundant Storage) combines ZRS (3 zones in primary region) with GRS (replication to a secondary paired region), providing the highest durability.",
    null,
    "Incorrecto: \"LRS\" no cumple con el requisito descrito. La opción correcta es \"GZRS\" — GZRS (Geo-Zone-Redundant Storage) combines ZRS (3 zones in primary region) with GRS (replication to a secondary paired region), providing the highest durability."
  ],
  "az-027": [
    "Azure storage accounts have two keys (key1 and key2) so you can rotate one while updating applications to use the other.",
    null,
    "Incorrecto: \"Enable firewall rules to block all public access\" no cumple con el requisito descrito. La opción correcta es \"Rotate (regenerate) the compromised storage account key immediately\" — Immediately rotate the compromised key to invalidate it. Azure storage accounts have two keys (key1 and key2) so you can rotate one while updating applications to use the other.",
    "Azure storage accounts have two keys (key1 and key2) so you can rotate one while updating applications to use the other."
  ],
  "az-028": [
    "AzCopy is a command-line utility optimized for Azure Storage transfers with support for parallel transfers, job journaling (resume), and SAS tokens.",
    null,
    "AzCopy is a command-line utility optimized for Azure Storage transfers with support for parallel transfers, job journaling (resume), and SAS tokens.",
    "AzCopy is a command-line utility optimized for Azure Storage transfers with support for parallel transfers, job journaling (resume), and SAS tokens."
  ],
  "az-029": [
    "Availability Sets distribute VMs across up to 3 fault domains and 20 update domains, ensuring at least one VM stays available during planned and unplanned outages.",
    null,
    "Incorrecto: \"Azure Site Recovery\" no cumple con el requisito descrito. La opción correcta es \"Availability Set\" — Availability Sets distribute VMs across up to 3 fault domains and 20 update domains, ensuring at least one VM stays available during planned and unplanned outages.",
    "Incorrecto: \"VM Scale Set\" no cumple con el requisito descrito. La opción correcta es \"Availability Set\" — Availability Sets distribute VMs across up to 3 fault domains and 20 update domains, ensuring at least one VM stays available during planned and unplanned outages."
  ],
  "az-030": [
    null,
    "Availability Sets only provide HA distribution without scaling.",
    "Incorrecto: \"VMSS is only available for Linux VMs\" no cumple con el requisito descrito. La opción correcta es \"VMSS supports autoscaling; Availability Sets provide high availability only\" — VMSS adds autoscaling capabilities (scale out/in based on metrics or schedules) in addition to high availability. Availability Sets only provide HA distribution without scaling.",
    "Availability Sets only provide HA distribution without scaling."
  ],
  "az-031": [
    "Incorrecto: \"Azure Virtual Machines\" no cumple con el requisito descrito. La opción correcta es \"Azure Container Instances (ACI)\" — ACI provides serverless containers billed per second of execution. No cluster or server management required, making it ideal for short-lived, event-driven workloads.",
    "Incorrecto: \"Azure Kubernetes Service (AKS)\" no cumple con el requisito descrito. La opción correcta es \"Azure Container Instances (ACI)\" — ACI provides serverless containers billed per second of execution. No cluster or server management required, making it ideal for short-lived, event-driven workloads.",
    null,
    "Incorrecto: \"Azure App Service\" no cumple con el requisito descrito. La opción correcta es \"Azure Container Instances (ACI)\" — ACI provides serverless containers billed per second of execution. No cluster or server management required, making it ideal for short-lived, event-driven workloads."
  ],
  "az-032": [
    "Incorrecto: \"Azure Virtual Machines\" no cumple con el requisito descrito. La opción correcta es \"Azure App Service\" — Azure App Service is a fully managed PaaS for web apps. It includes built-in autoscaling, SSL, custom domains, deployment slots for blue/green deployments, and no OS/VM management.",
    null,
    "Incorrecto: \"Azure Container Instances\" no cumple con el requisito descrito. La opción correcta es \"Azure App Service\" — Azure App Service is a fully managed PaaS for web apps. It includes built-in autoscaling, SSL, custom domains, deployment slots for blue/green deployments, and no OS/VM management.",
    "Incorrecto: \"Azure VM Scale Sets\" no cumple con el requisito descrito. La opción correcta es \"Azure App Service\" — Azure App Service is a fully managed PaaS for web apps. It includes built-in autoscaling, SSL, custom domains, deployment slots for blue/green deployments, and no OS/VM management."
  ],
  "az-033": [
    "Incorrecto: \"Configure a VPN Gateway and use VPN client\" no cumple con el requisito descrito. La opción correcta es \"Deploy Azure Bastion\" — Azure Bastion provides browser-based RDP/SSH over TLS (port 443) to VMs without any public IP on the VM or open RDP/SSH ports. JIT is also valid but Bastion is the cleaner solution.",
    null,
    "Incorrecto: \"Use Just-in-Time (JIT) VM Access\" no cumple con el requisito descrito. La opción correcta es \"Deploy Azure Bastion\" — Azure Bastion provides browser-based RDP/SSH over TLS (port 443) to VMs without any public IP on the VM or open RDP/SSH ports. JIT is also valid but Bastion is the cleaner solution.",
    "Incorrecto: \"Configure an NSG rule to allow port 3389 from your IP only\" no cumple con el requisito descrito. La opción correcta es \"Deploy Azure Bastion\" — Azure Bastion provides browser-based RDP/SSH over TLS (port 443) to VMs without any public IP on the VM or open RDP/SSH ports. JIT is also valid but Bastion is the cleaner solution."
  ],
  "az-034": [
    "AKS uses its system-assigned or user-assigned managed identity to authenticate to ACR without storing credentials.",
    "Incorrecto: \"Make the ACR registry public\" no cumple con el requisito descrito. La opción correcta es \"Attach the ACR to the AKS cluster using managed identity\" — Attaching ACR to AKS using managed identity is the recommended secretless approach. AKS uses its system-assigned or user-assigned managed identity to authenticate to ACR without storing credentials.",
    null,
    "Incorrecto: \"Use a service principal with password stored in a ConfigMap\" no cumple con el requisito descrito. La opción correcta es \"Attach the ACR to the AKS cluster using managed identity\" — Attaching ACR to AKS using managed identity is the recommended secretless approach. AKS uses its system-assigned or user-assigned managed identity to authenticate to ACR without storing credentials."
  ],
  "az-035": [
    "Incorrecto: \"Enable Azure Monitor agent automatically after deployment\" no cumple con el requisito descrito. La opción correcta es \"Run PowerShell or shell scripts on a VM after provisioning for configuration\" — Custom Script Extension downloads and executes scripts on VMs post-deployment. Commonly used for software installation, configuration, and post-provisioning setup tasks.",
    null,
    "Incorrecto: \"Create automated VM snapshots on a schedule\" no cumple con el requisito descrito. La opción correcta es \"Run PowerShell or shell scripts on a VM after provisioning for configuration\" — Custom Script Extension downloads and executes scripts on VMs post-deployment. Commonly used for software installation, configuration, and post-provisioning setup tasks.",
    "Incorrecto: \"Resize VM disks without downtime\" no cumple con el requisito descrito. La opción correcta es \"Run PowerShell or shell scripts on a VM after provisioning for configuration\" — Custom Script Extension downloads and executes scripts on VMs post-deployment. Commonly used for software installation, configuration, and post-provisioning setup tasks."
  ],
  "az-036": [
    "Incorrecto: \"Standard HDD\" no cumple con el requisito descrito. La opción correcta es \"Ultra Disk\" — Ultra Disk provides configurable IOPS (up to 160,000) and throughput with sub-millisecond latency. Ideal for IO-intensive workloads like SAP HANA, SQL Server, and Oracle.",
    "Incorrecto: \"Standard SSD\" no cumple con el requisito descrito. La opción correcta es \"Ultra Disk\" — Ultra Disk provides configurable IOPS (up to 160,000) and throughput with sub-millisecond latency. Ideal for IO-intensive workloads like SAP HANA, SQL Server, and Oracle.",
    "Incorrecto: \"Premium SSD\" no cumple con el requisito descrito. La opción correcta es \"Ultra Disk\" — Ultra Disk provides configurable IOPS (up to 160,000) and throughput with sub-millisecond latency. Ideal for IO-intensive workloads like SAP HANA, SQL Server, and Oracle.",
    null
  ],
  "az-037": [
    "Incorrecto: \"Deallocate the VM and leave it stopped\" no cumple con el requisito descrito. La opción correcta es \"Delete the VM resource while keeping the managed disk (uncheck 'Delete disk' option)\" — When deleting a VM in Azure, you can choose to retain the managed disk. Uncheck the disk deletion option, and the disk remains as a standalone resource you can attach to another VM.",
    null,
    "Uncheck the disk deletion option, and the disk remains as a standalone resource you can attach to another VM.",
    "Uncheck the disk deletion option, and the disk remains as a standalone resource you can attach to another VM."
  ],
  "az-038": [
    "Incorrecto: \"Group VMs across different regions for global load balancing\" no cumple con el requisito descrito. La opción correcta es \"Co-locate VMs in the same physical datacenter to minimize network latency between them\" — Proximity Placement Groups constrain VM placement to minimize inter-VM network latency by ensuring VMs are physically close. Critical for HPC and latency-sensitive clustered applications.",
    null,
    "Incorrecto: \"Apply NSG rules consistently to multiple VMs\" no cumple con el requisito descrito. La opción correcta es \"Co-locate VMs in the same physical datacenter to minimize network latency between them\" — Proximity Placement Groups constrain VM placement to minimize inter-VM network latency by ensuring VMs are physically close. Critical for HPC and latency-sensitive clustered applications.",
    "Incorrecto: \"Replicate VM configurations across availability zones\" no cumple con el requisito descrito. La opción correcta es \"Co-locate VMs in the same physical datacenter to minimize network latency between them\" — Proximity Placement Groups constrain VM placement to minimize inter-VM network latency by ensuring VMs are physically close. Critical for HPC and latency-sensitive clustered applications."
  ],
  "az-039": [
    "Incorrecto: \"Manually configure each VM using the Azure portal\" no cumple con el requisito descrito. La opción correcta es \"Use ARM templates or Bicep for repeatable deployments\" — ARM templates and Bicep provide infrastructure-as-code for consistent, version-controlled, repeatable deployments across any region or environment.",
    null,
    "ARM templates and Bicep provide infrastructure-as-code for consistent, version-controlled, repeatable deployments across any region or environment.",
    "ARM templates and Bicep provide infrastructure-as-code for consistent, version-controlled, repeatable deployments across any region or environment."
  ],
  "az-040": [
    null,
    "OS disks typically require VM deallocation for resize.",
    "Incorrecto: \"Create a new disk, copy data, and attach it\" no cumple con el requisito descrito. La opción correcta es \"Resize from the Azure portal while the VM is running (online resize for data disks)\" — Azure supports online resize for data disks (without VM restart). OS disks typically require VM deallocation for resize. Only expansion is supported — managed disks cannot be shrunk.",
    "Incorrecto: \"Increase the disk size via disk striping\" no cumple con el requisito descrito. La opción correcta es \"Resize from the Azure portal while the VM is running (online resize for data disks)\" — Azure supports online resize for data disks (without VM restart). OS disks typically require VM deallocation for resize. Only expansion is supported — managed disks cannot be shrunk."
  ],
  "az-041": [
    "Incorrecto: \"Production web applications with SLA requirements\" no cumple con el requisito descrito. La opción correcta es \"Fault-tolerant, interruptible batch processing or stateless workloads\" — Spot VMs use spare Azure capacity at up to 90% discount but can be evicted with 30-second notice when capacity is needed. Only suitable for fault-tolerant, checkpointed, or stateless workloads.",
    null,
    "Incorrecto: \"Mission-critical databases requiring 99.9% uptime\" no cumple con el requisito descrito. La opción correcta es \"Fault-tolerant, interruptible batch processing or stateless workloads\" — Spot VMs use spare Azure capacity at up to 90% discount but can be evicted with 30-second notice when capacity is needed. Only suitable for fault-tolerant, checkpointed, or stateless workloads.",
    "Incorrecto: \"Active Directory domain controllers\" no cumple con el requisito descrito. La opción correcta es \"Fault-tolerant, interruptible batch processing or stateless workloads\" — Spot VMs use spare Azure capacity at up to 90% discount but can be evicted with 30-second notice when capacity is needed. Only suitable for fault-tolerant, checkpointed, or stateless workloads."
  ],
  "az-042": [
    "This is different from 'Stopped' which still incurs compute charges.",
    null,
    "This is different from 'Stopped' which still incurs compute charges.",
    "This is different from 'Stopped' which still incurs compute charges."
  ],
  "az-043": [
    "Incorrecto: \"Self-managed Kubernetes on Azure VMs\" no cumple con el requisito descrito. La opción correcta es \"Azure Kubernetes Service (AKS)\" — AKS is a managed Kubernetes service where Azure manages the Kubernetes control plane (API server, etcd) at no charge. You only pay for the agent (worker) nodes.",
    "Incorrecto: \"Azure Container Instances\" no cumple con el requisito descrito. La opción correcta es \"Azure Kubernetes Service (AKS)\" — AKS is a managed Kubernetes service where Azure manages the Kubernetes control plane (API server, etcd) at no charge. You only pay for the agent (worker) nodes.",
    null,
    "Incorrecto: \"Azure Red Hat OpenShift\" no cumple con el requisito descrito. La opción correcta es \"Azure Kubernetes Service (AKS)\" — AKS is a managed Kubernetes service where Azure manages the Kubernetes control plane (API server, etcd) at no charge. You only pay for the agent (worker) nodes."
  ],
  "az-044": [
    "Incorrecto: \"Site-to-Site VPN between the two VNets\" no cumple con el requisito descrito. La opción correcta es \"VNet Peering\" — VNet Peering connects VNets through the Azure backbone with low latency and high bandwidth. No gateways or public internet required. VNet Global Peering works across regions.",
    null,
    "Incorrecto: \"ExpressRoute\" no cumple con el requisito descrito. La opción correcta es \"VNet Peering\" — VNet Peering connects VNets through the Azure backbone with low latency and high bandwidth. No gateways or public internet required. VNet Global Peering works across regions.",
    "Incorrecto: \"Azure Relay\" no cumple con el requisito descrito. La opción correcta es \"VNet Peering\" — VNet Peering connects VNets through the Azure backbone with low latency and high bandwidth. No gateways or public internet required. VNet Global Peering works across regions."
  ],
  "az-045": [
    "The FIRST matching rule is applied and processing stops.",
    null,
    "Incorrecto: \"Allow rules are always evaluated before deny rules\" no cumple con el requisito descrito. La opción correcta es \"From lowest priority number to highest; first match wins\" — NSG rules are processed from lowest number (highest priority) to highest number. The FIRST matching rule is applied and processing stops. Lower numbers = higher priority.",
    "Incorrecto: \"Default rules always take precedence over custom rules\" no cumple con el requisito descrito. La opción correcta es \"From lowest priority number to highest; first match wins\" — NSG rules are processed from lowest number (highest priority) to highest number. The FIRST matching rule is applied and processing stops. Lower numbers = higher priority."
  ],
  "az-046": [
    "NSGs have built-in implicit deny-all rules at priority 65500 (DenyAllInbound, DenyAllOutbound) that block all traffic when no custom rule matches.",
    "NSGs have built-in implicit deny-all rules at priority 65500 (DenyAllInbound, DenyAllOutbound) that block all traffic when no custom rule matches.",
    null,
    "NSGs have built-in implicit deny-all rules at priority 65500 (DenyAllInbound, DenyAllOutbound) that block all traffic when no custom rule matches."
  ],
  "az-047": [
    "VNet A cannot reach VNet C through VNet B.",
    null,
    "You need a direct peering between A and C, or a hub-spoke design with a NVA/VPN gateway and 'Use Remote Gateways' enabled.",
    "Incorrecto: \"Yes, if all VNets are in the same region\" no cumple con el requisito descrito. La opción correcta es \"No, VNet peering is NOT transitive\" — VNet peering is non-transitive. VNet A cannot reach VNet C through VNet B. You need a direct peering between A and C, or a hub-spoke design with a NVA/VPN gateway and 'Use Remote Gateways' enabled."
  ],
  "az-048": [
    "Creating a route for 0.0.0.0/0 with next hop = NVA's private IP forces all outbound traffic through the appliance.",
    null,
    "Incorrecto: \"Azure Firewall policy on the VNet\" no cumple con el requisito descrito. La opción correcta es \"User Defined Route (UDR) with next hop set to the NVA's private IP\" — UDRs (User Defined Routes) override Azure's default routing. Creating a route for 0.0.0.0/0 with next hop = NVA's private IP forces all outbound traffic through the appliance.",
    "Creating a route for 0.0.0.0/0 with next hop = NVA's private IP forces all outbound traffic through the appliance."
  ],
  "az-049": [
    "Incorrecto: \"The UDR needs a BGP route\" no cumple con el requisito descrito. La opción correcta es \"IP Forwarding must be enabled on the NVA's network interface in Azure\" — Azure drops traffic destined for an IP different from the NIC's assigned IP unless IP Forwarding is enabled on that NIC. This must be enabled both in Azure AND within the OS of the NVA VM.",
    null,
    "Incorrecto: \"The NVA needs a public IP address\" no cumple con el requisito descrito. La opción correcta es \"IP Forwarding must be enabled on the NVA's network interface in Azure\" — Azure drops traffic destined for an IP different from the NIC's assigned IP unless IP Forwarding is enabled on that NIC. This must be enabled both in Azure AND within the OS of the NVA VM.",
    "This must be enabled both in Azure AND within the OS of the NVA VM."
  ],
  "az-050": [
    "Azure Application Gateway is an L7 load balancer supporting URL path-based routing, SSL termination, session affinity, and optionally WAF (Web Application Firewall).",
    null,
    "Azure Application Gateway is an L7 load balancer supporting URL path-based routing, SSL termination, session affinity, and optionally WAF (Web Application Firewall).",
    "Azure Application Gateway is an L7 load balancer supporting URL path-based routing, SSL termination, session affinity, and optionally WAF (Web Application Firewall)."
  ],
  "az-051": [
    "Incorrecto: \"Azure Standard Load Balancer\" no cumple con el requisito descrito. La opción correcta es \"Azure Traffic Manager with 'Performance' routing method\" — Azure Traffic Manager is a DNS-based global traffic manager. The 'Performance' routing method directs users to the endpoint with the lowest latency from their location.",
    "Incorrecto: \"Azure Application Gateway\" no cumple con el requisito descrito. La opción correcta es \"Azure Traffic Manager with 'Performance' routing method\" — Azure Traffic Manager is a DNS-based global traffic manager. The 'Performance' routing method directs users to the endpoint with the lowest latency from their location.",
    null,
    "Incorrecto: \"Azure Internal Load Balancer\" no cumple con el requisito descrito. La opción correcta es \"Azure Traffic Manager with 'Performance' routing method\" — Azure Traffic Manager is a DNS-based global traffic manager. The 'Performance' routing method directs users to the endpoint with the lowest latency from their location."
  ],
  "az-052": [
    "Incorrecto: \"Site-to-Site VPN over IPSec\" no cumple con el requisito descrito. La opción correcta es \"Azure ExpressRoute\" — ExpressRoute provides a private, dedicated connection to Azure through a connectivity provider (e.g., Equinix, AT&T), not traversing the public internet. Offers predictable performance and lower latency than VPN.",
    "Incorrecto: \"Point-to-Site VPN\" no cumple con el requisito descrito. La opción correcta es \"Azure ExpressRoute\" — ExpressRoute provides a private, dedicated connection to Azure through a connectivity provider (e.g., Equinix, AT&T), not traversing the public internet. Offers predictable performance and lower latency than VPN.",
    null,
    "Incorrecto: \"VNet Peering with on-premises gateway\" no cumple con el requisito descrito. La opción correcta es \"Azure ExpressRoute\" — ExpressRoute provides a private, dedicated connection to Azure through a connectivity provider (e.g., Equinix, AT&T), not traversing the public internet. Offers predictable performance and lower latency than VPN."
  ],
  "az-053": [
    "Incorrecto: \"Azure Traffic Manager with custom DNS\" no cumple con el requisito descrito. La opción correcta es \"Azure Private DNS Zone linked to the VNet\" — Azure Private DNS Zones provide automatic DNS registration and resolution for VNet resources when auto-registration is enabled. No DNS server deployment required.",
    null,
    "Incorrecto: \"Azure Public DNS Zone\" no cumple con el requisito descrito. La opción correcta es \"Azure Private DNS Zone linked to the VNet\" — Azure Private DNS Zones provide automatic DNS registration and resolution for VNet resources when auto-registration is enabled. No DNS server deployment required.",
    "Incorrecto: \"Configure /etc/hosts on each VM\" no cumple con el requisito descrito. La opción correcta es \"Azure Private DNS Zone linked to the VNet\" — Azure Private DNS Zones provide automatic DNS registration and resolution for VNet resources when auto-registration is enabled. No DNS server deployment required."
  ],
  "az-054": [
    "Azure Firewall is a managed, stateful network security service with FQDN filtering, TLS inspection, and threat intelligence feeds.",
    null,
    "Azure Firewall is a managed, stateful network security service with FQDN filtering, TLS inspection, and threat intelligence feeds.",
    "Azure Firewall is a managed, stateful network security service with FQDN filtering, TLS inspection, and threat intelligence feeds."
  ],
  "az-055": [
    "Incorrecto: \"Azure Monitor Diagnostic Settings for VMs\" no cumple con el requisito descrito. La opción correcta es \"NSG Flow Logs via Network Watcher\" — NSG Flow Logs, enabled through Network Watcher, capture a 5-tuple (source/dest IP, port, protocol, allow/deny) of all traffic through NSGs. Logs go to a storage account and optionally to Log Analytics via Traffic Analytics.",
    null,
    "Logs go to a storage account and optionally to Log Analytics via Traffic Analytics.",
    "Incorrecto: \"Azure Sentinel data connector\" no cumple con el requisito descrito. La opción correcta es \"NSG Flow Logs via Network Watcher\" — NSG Flow Logs, enabled through Network Watcher, capture a 5-tuple (source/dest IP, port, protocol, allow/deny) of all traffic through NSGs. Logs go to a storage account and optionally to Log Analytics via Traffic Analytics."
  ],
  "az-056": [
    "Note: the service still has a public endpoint.",
    null,
    "Note: the service still has a public endpoint.",
    "Incorrecto: \"Route all traffic through Azure Firewall\" no cumple con el requisito descrito. La opción correcta es \"Extend the VNet's identity to Azure services, allowing you to restrict service access to the VNet over the Azure backbone\" — Service Endpoints extend your VNet's private address space and identity to Azure services (Storage, SQL, etc.) over the Azure backbone, allowing you to lock down access to specific VNets/subnets. Note: the service still has a public endpoint."
  ],
  "az-057": [
    "The service is accessible only from your VNet or connected networks, with no public endpoint needed.",
    null,
    "Incorrecto: \"Lower latency to Azure services\" no cumple con el requisito descrito. La opción correcta es \"A private IP address in your VNet for the Azure service, making it reachable without public internet exposure\" — Private Endpoints assign a private IP from your VNet to an Azure service (e.g., Storage, SQL, Key Vault), enabling fully private connectivity. The service is accessible only from your VNet or connected networks, with no public endpoint needed.",
    "The service is accessible only from your VNet or connected networks, with no public endpoint needed."
  ],
  "az-058": [
    "Incorrecto: \"The VM is automatically restarted\" no cumple con el requisito descrito. La opción correcta es \"Traffic is no longer sent to that VM by the load balancer\" — The Standard Load Balancer removes unhealthy backend instances (those failing health probes) from the rotation. Traffic is only sent to instances passing their probe.",
    null,
    "Incorrecto: \"The VM is deleted and replaced\" no cumple con el requisito descrito. La opción correcta es \"Traffic is no longer sent to that VM by the load balancer\" — The Standard Load Balancer removes unhealthy backend instances (those failing health probes) from the rotation. Traffic is only sent to instances passing their probe.",
    "Traffic is only sent to instances passing their probe."
  ],
  "az-059": [
    "Incorrecto: \"Azure Policy with Audit effect on CPU metrics\" no cumple con el requisito descrito. La opción correcta es \"Azure Monitor Metric Alert with a threshold rule on Percentage CPU\" — Azure Monitor Metric Alerts evaluate platform metrics (like Percentage CPU) against thresholds over configurable time windows. When the threshold is exceeded for the window, an alert fires.",
    null,
    "When the threshold is exceeded for the window, an alert fires.",
    "When the threshold is exceeded for the window, an alert fires."
  ],
  "az-060": [
    "Incorrecto: \"Store VM OS disk snapshots for recovery\" no cumple con el requisito descrito. La opción correcta es \"Centrally collect, store, and query log and performance data from multiple Azure and on-premises sources using KQL\" — Log Analytics Workspaces are centralized data stores for monitoring telemetry from VMs, applications, services, and on-premises systems. Data is queried using KQL (Kusto Query Language).",
    null,
    "Incorrecto: \"Provide real-time VM performance dashboards only\" no cumple con el requisito descrito. La opción correcta es \"Centrally collect, store, and query log and performance data from multiple Azure and on-premises sources using KQL\" — Log Analytics Workspaces are centralized data stores for monitoring telemetry from VMs, applications, services, and on-premises systems. Data is queried using KQL (Kusto Query Language).",
    "Data is queried using KQL (Kusto Query Language)."
  ],
  "az-061": [
    "Azure Site Recovery = business continuity and DR (continuous replication, orchestrated failover to another region with near-zero RPO).",
    null,
    "Azure Site Recovery = business continuity and DR (continuous replication, orchestrated failover to another region with near-zero RPO).",
    "Incorrecto: \"Both services are identical but differ only in pricing\" no cumple con el requisito descrito. La opción correcta es \"Azure Backup protects against data loss/corruption (backup/restore); Azure Site Recovery enables disaster recovery with continuous replication and regional failover\" — Azure Backup = data protection (scheduled backups, point-in-time restore). Azure Site Recovery = business continuity and DR (continuous replication, orchestrated failover to another region with near-zero RPO)."
  ],
  "az-062": [
    "Incorrecto: \"7 days default; extend via Azure Policy\" no cumple con el requisito descrito. La opción correcta es \"90 days default; configure Diagnostic Settings to send to a Log Analytics workspace or Storage Account\" — Activity Logs are retained for 90 days by default. To retain longer, use Diagnostic Settings to archive to a Storage Account (up to years) or stream to a Log Analytics workspace with custom retention.",
    "To retain longer, use Diagnostic Settings to archive to a Storage Account (up to years) or stream to a Log Analytics workspace with custom retention.",
    null,
    "Incorrecto: \"365 days default; no action needed\" no cumple con el requisito descrito. La opción correcta es \"90 days default; configure Diagnostic Settings to send to a Log Analytics workspace or Storage Account\" — Activity Logs are retained for 90 days by default. To retain longer, use Diagnostic Settings to archive to a Storage Account (up to years) or stream to a Log Analytics workspace with custom retention."
  ],
  "az-063": [
    "Incorrecto: \"Azure Advisor\" no cumple con el requisito descrito. La opción correcta es \"VM Insights\" — VM Insights provides curated performance charts and a dependency map (using the Dependency Agent) for VMs and VM Scale Sets, pre-built without requiring custom KQL queries.",
    null,
    "VM Insights provides curated performance charts and a dependency map (using the Dependency Agent) for VMs and VM Scale Sets, pre-built without requiring custom KQL queries.",
    "Incorrecto: \"Azure Service Health\" no cumple con el requisito descrito. La opción correcta es \"VM Insights\" — VM Insights provides curated performance charts and a dependency map (using the Dependency Agent) for VMs and VM Scale Sets, pre-built without requiring custom KQL queries."
  ],
  "az-064": [
    "Incorrecto: \"Monitor individual VM CPU and memory metrics\" no cumple con el requisito descrito. La opción correcta es \"Track Azure platform incidents, planned maintenance events, and health advisories affecting YOUR specific subscriptions and regions\" — Azure Service Health provides personalized alerts and information about Azure service incidents, planned maintenance, and health advisories, filtered to the subscriptions and regions you use.",
    null,
    "Azure Service Health provides personalized alerts and information about Azure service incidents, planned maintenance, and health advisories, filtered to the subscriptions and regions you use.",
    "Incorrecto: \"Manage RBAC for monitoring resources\" no cumple con el requisito descrito. La opción correcta es \"Track Azure platform incidents, planned maintenance events, and health advisories affecting YOUR specific subscriptions and regions\" — Azure Service Health provides personalized alerts and information about Azure service incidents, planned maintenance, and health advisories, filtered to the subscriptions and regions you use."
  ],
  "az-065": [
    "Action Groups define WHO to notify and WHAT to do when an alert fires: send email/SMS, call webhooks, trigger Azure Functions/Logic Apps/Automation Runbooks, or create ITSM tickets.",
    null,
    "Incorrecto: \"Organize metric data into logical categories\" no cumple con el requisito descrito. La opción correcta es \"Define a collection of notification actions (email, SMS, webhook, runbook) triggered when an alert fires\" — Action Groups define WHO to notify and WHAT to do when an alert fires: send email/SMS, call webhooks, trigger Azure Functions/Logic Apps/Automation Runbooks, or create ITSM tickets.",
    "Incorrecto: \"Apply RBAC roles to monitoring data\" no cumple con el requisito descrito. La opción correcta es \"Define a collection of notification actions (email, SMS, webhook, runbook) triggered when an alert fires\" — Action Groups define WHO to notify and WHAT to do when an alert fires: send email/SMS, call webhooks, trigger Azure Functions/Logic Apps/Automation Runbooks, or create ITSM tickets."
  ],
  "az-066": [
    "Incorrecto: \"SQL (T-SQL)\" no cumple con el requisito descrito. La opción correcta es \"KQL (Kusto Query Language)\" — Azure Monitor Log Analytics uses KQL (Kusto Query Language). It's also used in Azure Data Explorer, Microsoft Sentinel, and Azure Resource Graph.",
    "Incorrecto: \"PowerShell\" no cumple con el requisito descrito. La opción correcta es \"KQL (Kusto Query Language)\" — Azure Monitor Log Analytics uses KQL (Kusto Query Language). It's also used in Azure Data Explorer, Microsoft Sentinel, and Azure Resource Graph.",
    null,
    "It's also used in Azure Data Explorer, Microsoft Sentinel, and Azure Resource Graph."
  ],
  "az-067": [
    "Incorrecto: \"VM Snapshots stored in a storage account\" no cumple con el requisito descrito. La opción correcta es \"Azure Backup with Recovery Services Vault and a backup policy\" — Azure Backup with a Recovery Services Vault and backup policy allows you to schedule daily backups and configure retention policies (daily, weekly, monthly, yearly) for VMs and other workloads.",
    "Azure Backup with a Recovery Services Vault and backup policy allows you to schedule daily backups and configure retention policies (daily, weekly, monthly, yearly) for VMs and other workloads.",
    null,
    "Azure Backup with a Recovery Services Vault and backup policy allows you to schedule daily backups and configure retention policies (daily, weekly, monthly, yearly) for VMs and other workloads."
  ],
  "az-068": [
    "Incorrecto: \"Azure Monitor\" no cumple con el requisito descrito. La opción correcta es \"Azure Advisor\" — Azure Advisor provides actionable recommendations across five categories: Cost, Reliability, Security, Performance, and Operational Excellence. It identifies idle/underutilized resources to reduce spend.",
    "Incorrecto: \"Azure Security Center\" no cumple con el requisito descrito. La opción correcta es \"Azure Advisor\" — Azure Advisor provides actionable recommendations across five categories: Cost, Reliability, Security, Performance, and Operational Excellence. It identifies idle/underutilized resources to reduce spend.",
    null,
    "Incorrecto: \"Azure Cost Management + Billing\" no cumple con el requisito descrito. La opción correcta es \"Azure Advisor\" — Azure Advisor provides actionable recommendations across five categories: Cost, Reliability, Security, Performance, and Operational Excellence. It identifies idle/underutilized resources to reduce spend."
  ],
  "az-069": [
    "Incorrecto: \"Audit\" no cumple con el requisito descrito. La opción correcta es \"DeployIfNotExists\" — DeployIfNotExists triggers an ARM template deployment (e.g., installing an agent) when a resource doesn't have a specified related resource. Remediation tasks apply this to existing non-compliant resources.",
    "Incorrecto: \"Deny\" no cumple con el requisito descrito. La opción correcta es \"DeployIfNotExists\" — DeployIfNotExists triggers an ARM template deployment (e.g., installing an agent) when a resource doesn't have a specified related resource. Remediation tasks apply this to existing non-compliant resources.",
    "Incorrecto: \"Modify\" no cumple con el requisito descrito. La opción correcta es \"DeployIfNotExists\" — DeployIfNotExists triggers an ARM template deployment (e.g., installing an agent) when a resource doesn't have a specified related resource. Remediation tasks apply this to existing non-compliant resources.",
    null
  ],
  "az-070": [
    "Incorrecto: \"VM Boot Diagnostics\" no cumple con el requisito descrito. La opción correcta es \"Recovery Services Vault → Backup Jobs\" — The Recovery Services Vault's 'Backup Jobs' section shows the status, error codes, and detailed messages for all backup and restore operations, making it the first place to diagnose failures.",
    "Incorrecto: \"Azure Monitor Activity Log\" no cumple con el requisito descrito. La opción correcta es \"Recovery Services Vault → Backup Jobs\" — The Recovery Services Vault's 'Backup Jobs' section shows the status, error codes, and detailed messages for all backup and restore operations, making it the first place to diagnose failures.",
    null,
    "Incorrecto: \"Azure Advisor recommendations\" no cumple con el requisito descrito. La opción correcta es \"Recovery Services Vault → Backup Jobs\" — The Recovery Services Vault's 'Backup Jobs' section shows the status, error codes, and detailed messages for all backup and restore operations, making it the first place to diagnose failures."
  ],
  "az-071": [
    null,
    "A Conditional Access policy that requires MFA registration (targeting 'All Users' with the grant 'Require multi-factor authentication') forces users to complete the registration wizard before accessing resources.",
    "A Conditional Access policy that requires MFA registration (targeting 'All Users' with the grant 'Require multi-factor authentication') forces users to complete the registration wizard before accessing resources.",
    "Incorrecto: \"Azure AD Password Protection\" no cumple con el requisito descrito. La opción correcta es \"Conditional Access policy requiring MFA\" — A Conditional Access policy that requires MFA registration (targeting 'All Users' with the grant 'Require multi-factor authentication') forces users to complete the registration wizard before accessing resources."
  ],
  "az-072": [
    "PIM provides just-in-time (JIT) activation of privileged roles with approval workflows, time limits, MFA, and audit trails — ideal for minimizing standing privileged access.",
    null,
    "Incorrecto: \"Azure AD Identity Protection\" no cumple con el requisito descrito. La opción correcta es \"Azure AD Privileged Identity Management (PIM)\" — PIM provides just-in-time (JIT) activation of privileged roles with approval workflows, time limits, MFA, and audit trails — ideal for minimizing standing privileged access.",
    "Incorrecto: \"Azure RBAC custom role\" no cumple con el requisito descrito. La opción correcta es \"Azure AD Privileged Identity Management (PIM)\" — PIM provides just-in-time (JIT) activation of privileged roles with approval workflows, time limits, MFA, and audit trails — ideal for minimizing standing privileged access."
  ],
  "az-073": [
    null,
    "Azure AD Connect Health monitors the sync infrastructure, shows sync errors, connector status, and latency — the first stop when on-prem changes aren't reflecting in Azure AD.",
    "Incorrecto: \"Active Directory Users and Computers\" no cumple con el requisito descrito. La opción correcta es \"Azure AD Connect Health\" — Azure AD Connect Health monitors the sync infrastructure, shows sync errors, connector status, and latency — the first stop when on-prem changes aren't reflecting in Azure AD.",
    "Azure AD Connect Health monitors the sync infrastructure, shows sync errors, connector status, and latency — the first stop when on-prem changes aren't reflecting in Azure AD."
  ],
  "az-074": [
    "Policy assignments support scope exclusions — you specify one or more child scopes (resource groups, resources) that are exempt from the policy, without changing the policy definition or effect.",
    "Policy assignments support scope exclusions — you specify one or more child scopes (resource groups, resources) that are exempt from the policy, without changing the policy definition or effect.",
    null,
    "Policy assignments support scope exclusions — you specify one or more child scopes (resource groups, resources) that are exempt from the policy, without changing the policy definition or effect."
  ],
  "az-075": [
    "Incorrecto: \"Append\" no cumple con el requisito descrito. La opción correcta es \"DeployIfNotExists\" — DeployIfNotExists triggers an ARM template deployment when a compliant resource doesn't exist. It's used to auto-remediate, such as deploying diagnostic settings when they're missing.",
    "Incorrecto: \"Audit\" no cumple con el requisito descrito. La opción correcta es \"DeployIfNotExists\" — DeployIfNotExists triggers an ARM template deployment when a compliant resource doesn't exist. It's used to auto-remediate, such as deploying diagnostic settings when they're missing.",
    null,
    "Incorrecto: \"Modify\" no cumple con el requisito descrito. La opción correcta es \"DeployIfNotExists\" — DeployIfNotExists triggers an ARM template deployment when a compliant resource doesn't exist. It's used to auto-remediate, such as deploying diagnostic settings when they're missing."
  ],
  "az-076": [
    "Incorrecto: \"Azure AD Privileged Identity Management\" no cumple con el requisito descrito. La opción correcta es \"Azure AD Access Reviews\" — Access Reviews let you schedule periodic reviews of group membership, application assignments, or role assignments — reviewers confirm or remove access, and auto-apply decisions can revoke stale guest access.",
    null,
    "Incorrecto: \"Azure AD Entitlement Management\" no cumple con el requisito descrito. La opción correcta es \"Azure AD Access Reviews\" — Access Reviews let you schedule periodic reviews of group membership, application assignments, or role assignments — reviewers confirm or remove access, and auto-apply decisions can revoke stale guest access.",
    "Access Reviews let you schedule periodic reviews of group membership, application assignments, or role assignments — reviewers confirm or remove access, and auto-apply decisions can revoke stale guest access."
  ],
  "az-077": [
    "Incorrecto: \"1\" no cumple con el requisito descrito. La opción correcta es \"Unlimited\" — A user account (UPN) can be a member (or guest) of an unlimited number of Azure AD tenants. There's no hard cap on tenant membership per user.",
    "Incorrecto: \"10\" no cumple con el requisito descrito. La opción correcta es \"Unlimited\" — A user account (UPN) can be a member (or guest) of an unlimited number of Azure AD tenants. There's no hard cap on tenant membership per user.",
    "Incorrecto: \"500\" no cumple con el requisito descrito. La opción correcta es \"Unlimited\" — A user account (UPN) can be a member (or guest) of an unlimited number of Azure AD tenants. There's no hard cap on tenant membership per user.",
    null
  ],
  "az-078": [
    "Incorrecto: \"Deny\" no cumple con el requisito descrito. La opción correcta es \"Modify\" — The Modify effect can add or replace tags on resources during creation or update, including inheriting a tag value from the resource group — without blocking deployment.",
    "Incorrecto: \"Append\" no cumple con el requisito descrito. La opción correcta es \"Modify\" — The Modify effect can add or replace tags on resources during creation or update, including inheriting a tag value from the resource group — without blocking deployment.",
    null,
    "Incorrecto: \"DeployIfNotExists\" no cumple con el requisito descrito. La opción correcta es \"Modify\" — The Modify effect can add or replace tags on resources during creation or update, including inheriting a tag value from the resource group — without blocking deployment."
  ],
  "az-079": [
    "Assigning a policy to a management group automatically applies it to all child subscriptions in that group — one assignment covers all 10 subscriptions of that department.",
    "Assigning a policy to a management group automatically applies it to all child subscriptions in that group — one assignment covers all 10 subscriptions of that department.",
    null,
    "Incorrecto: \"Use Azure Blueprints at tenant level\" no cumple con el requisito descrito. La opción correcta es \"Assign the policy to the department's management group\" — Management groups let you organize subscriptions into a hierarchy. Assigning a policy to a management group automatically applies it to all child subscriptions in that group — one assignment covers all 10 subscriptions of that department."
  ],
  "az-080": [
    "Incorrecto: \"Owner\" no cumple con el requisito descrito. La opción correcta es \"Reader\" — The Reader role grants view-only access to all resources in a scope — no ability to create, modify, or perform actions. The user needs at least Virtual Machine Contributor to start/stop VMs.",
    "The user needs at least Virtual Machine Contributor to start/stop VMs.",
    null,
    "The user needs at least Virtual Machine Contributor to start/stop VMs."
  ],
  "az-081": [
    "Incorrecto: \"Store the service principal secret in app settings\" no cumple con el requisito descrito. La opción correcta es \"Use a system-assigned managed identity and a Key Vault access policy\" — System-assigned managed identity gives the app an automatically managed Azure AD identity. Combined with a Key Vault access policy (or RBAC), the app authenticates without any stored credentials.",
    null,
    "Incorrecto: \"Use an Azure AD B2C flow\" no cumple con el requisito descrito. La opción correcta es \"Use a system-assigned managed identity and a Key Vault access policy\" — System-assigned managed identity gives the app an automatically managed Azure AD identity. Combined with a Key Vault access policy (or RBAC), the app authenticates without any stored credentials.",
    "Incorrecto: \"Store the certificate in Azure Blob Storage\" no cumple con el requisito descrito. La opción correcta es \"Use a system-assigned managed identity and a Key Vault access policy\" — System-assigned managed identity gives the app an automatically managed Azure AD identity. Combined with a Key Vault access policy (or RBAC), the app authenticates without any stored credentials."
  ],
  "az-082": [
    "Free tier only has basic security defaults, not granular CA policies.",
    null,
    "Incorrecto: \"Azure AD P2\" no cumple con el requisito descrito. La opción correcta es \"Azure AD P1\" — Conditional Access requires Azure AD Premium P1 (or higher). P2 adds Identity Protection risk signals. Free tier only has basic security defaults, not granular CA policies.",
    "Incorrecto: \"Microsoft 365 E3\" no cumple con el requisito descrito. La opción correcta es \"Azure AD P1\" — Conditional Access requires Azure AD Premium P1 (or higher). P2 adds Identity Protection risk signals. Free tier only has basic security defaults, not granular CA policies."
  ],
  "az-083": [
    "Incorrecto: \"Create a Conditional Access policy for location\" no cumple con el requisito descrito. La opción correcta es \"Assign the 'Allowed locations' built-in policy to the management group containing those subscriptions\" — The 'Allowed locations' built-in Azure Policy restricts which Azure regions resources can be deployed to. Assigning it at management group scope covers all child subscriptions in one step.",
    null,
    "Incorrecto: \"Create a custom RBAC role restricting regions\" no cumple con el requisito descrito. La opción correcta es \"Assign the 'Allowed locations' built-in policy to the management group containing those subscriptions\" — The 'Allowed locations' built-in Azure Policy restricts which Azure regions resources can be deployed to. Assigning it at management group scope covers all child subscriptions in one step.",
    "Incorrecto: \"Use Azure Blueprints to lock regions\" no cumple con el requisito descrito. La opción correcta es \"Assign the 'Allowed locations' built-in policy to the management group containing those subscriptions\" — The 'Allowed locations' built-in Azure Policy restricts which Azure regions resources can be deployed to. Assigning it at management group scope covers all child subscriptions in one step."
  ],
  "az-084": [
    "Incorrecto: \"B2B is for end consumers; B2C is for partner employees\" no cumple con el requisito descrito. La opción correcta es \"B2B federates partner/guest identities into your tenant; B2C is a customer identity platform for public apps\" — Azure AD B2B lets external partners collaborate using their existing identity (guest accounts in your tenant). Azure AD B2C is a separate CIAM service for building customer-facing apps where users can sign up/in with social or local accounts.",
    null,
    "Azure AD B2C is a separate CIAM service for building customer-facing apps where users can sign up/in with social or local accounts.",
    "Incorrecto: \"They are identical features with different naming\" no cumple con el requisito descrito. La opción correcta es \"B2B federates partner/guest identities into your tenant; B2C is a customer identity platform for public apps\" — Azure AD B2B lets external partners collaborate using their existing identity (guest accounts in your tenant). Azure AD B2C is a separate CIAM service for building customer-facing apps where users can sign up/in with social or local accounts."
  ],
  "az-085": [
    "A CanNotDelete lock prevents deletion regardless of role — even Owner or Global Administrator cannot delete without first removing the lock.",
    null,
    "A CanNotDelete lock prevents deletion regardless of role — even Owner or Global Administrator cannot delete without first removing the lock.",
    "A CanNotDelete lock prevents deletion regardless of role — even Owner or Global Administrator cannot delete without first removing the lock."
  ],
  "az-086": [
    "Blob lifecycle management policies define rules with filters (prefix, blob type) and actions (tierToCool, tierToArchive, delete) triggered by age thresholds — fully automated, no custom scripts needed.",
    null,
    "Incorrecto: \"Azure Backup retention\" no cumple con el requisito descrito. La opción correcta es \"Lifecycle management policy\" — Blob lifecycle management policies define rules with filters (prefix, blob type) and actions (tierToCool, tierToArchive, delete) triggered by age thresholds — fully automated, no custom scripts needed.",
    "Incorrecto: \"Storage immutability policy\" no cumple con el requisito descrito. La opción correcta es \"Lifecycle management policy\" — Blob lifecycle management policies define rules with filters (prefix, blob type) and actions (tierToCool, tierToArchive, delete) triggered by age thresholds — fully automated, no custom scripts needed."
  ],
  "az-087": [
    null,
    "Incorrecto: \"GRS\" no cumple con el requisito descrito. La opción correcta es \"ZRS\" — ZRS (Zone-Redundant Storage) replicates data synchronously across 3 availability zones in the same region, protecting against datacenter (zone) failures. GRS protects against region failures but doesn't guarantee zone-level durability.",
    "Incorrecto: \"GZRS\" no cumple con el requisito descrito. La opción correcta es \"ZRS\" — ZRS (Zone-Redundant Storage) replicates data synchronously across 3 availability zones in the same region, protecting against datacenter (zone) failures. GRS protects against region failures but doesn't guarantee zone-level durability.",
    "Incorrecto: \"RA-GRS\" no cumple con el requisito descrito. La opción correcta es \"ZRS\" — ZRS (Zone-Redundant Storage) replicates data synchronously across 3 availability zones in the same region, protecting against datacenter (zone) failures. GRS protects against region failures but doesn't guarantee zone-level durability."
  ],
  "az-088": [
    "Incorrecto: \"Storage firewall with IP rules\" no cumple con el requisito descrito. La opción correcta es \"Service Endpoint for Microsoft.Storage on the subnet\" — Service Endpoints route traffic from the subnet to Azure Storage over the Microsoft backbone, never the public internet. They extend the VNet's private address space to the service.",
    null,
    "They extend the VNet's private address space to the service.",
    "Incorrecto: \"ExpressRoute public peering\" no cumple con el requisito descrito. La opción correcta es \"Service Endpoint for Microsoft.Storage on the subnet\" — Service Endpoints route traffic from the subnet to Azure Storage over the Microsoft backbone, never the public internet. They extend the VNet's private address space to the service."
  ],
  "az-089": [
    "Incorrecto: \"Account SAS\" no cumple con el requisito descrito. La opción correcta es \"Service SAS with stored access policy\" — A Service SAS linked to a stored access policy can be revoked by deleting or modifying the policy — you don't need to rotate the account key. This is the recommended approach for service-level SAS tokens.",
    null,
    "Incorrecto: \"User delegation SAS\" no cumple con el requisito descrito. La opción correcta es \"Service SAS with stored access policy\" — A Service SAS linked to a stored access policy can be revoked by deleting or modifying the policy — you don't need to rotate the account key. This is the recommended approach for service-level SAS tokens.",
    "Incorrecto: \"Ad-hoc SAS\" no cumple con el requisito descrito. La opción correcta es \"Service SAS with stored access policy\" — A Service SAS linked to a stored access policy can be revoked by deleting or modifying the policy — you don't need to rotate the account key. This is the recommended approach for service-level SAS tokens."
  ],
  "az-090": [
    "Cloud tiering free space policy ensures that the Windows Server volume always has at least the specified percentage free, by replacing least-recently-used files with pointer stubs that recall on demand from Azure.",
    null,
    "Cloud tiering free space policy ensures that the Windows Server volume always has at least the specified percentage free, by replacing least-recently-used files with pointer stubs that recall on demand from Azure.",
    "Cloud tiering free space policy ensures that the Windows Server volume always has at least the specified percentage free, by replacing least-recently-used files with pointer stubs that recall on demand from Azure."
  ],
  "az-091": [
    "Incorrecto: \"AzCopy over the internet\" no cumple con el requisito descrito. La opción correcta es \"Azure Import/Export (Data Box)\" — Azure Data Box (Import/Export) ships physical storage devices — you copy data locally, ship the device to Microsoft, and they upload it to Azure. Ideal for large datasets where network transfer would take too long or consume too much bandwidth.",
    "Incorrecto: \"Azure Data Factory\" no cumple con el requisito descrito. La opción correcta es \"Azure Import/Export (Data Box)\" — Azure Data Box (Import/Export) ships physical storage devices — you copy data locally, ship the device to Microsoft, and they upload it to Azure. Ideal for large datasets where network transfer would take too long or consume too much bandwidth.",
    null,
    "Incorrecto: \"Azure Storage Explorer\" no cumple con el requisito descrito. La opción correcta es \"Azure Import/Export (Data Box)\" — Azure Data Box (Import/Export) ships physical storage devices — you copy data locally, ship the device to Microsoft, and they upload it to Azure. Ideal for large datasets where network transfer would take too long or consume too much bandwidth."
  ],
  "az-092": [
    "Incorrecto: \"Encrypts blobs at rest\" no cumple con el requisito descrito. La opción correcta es \"Allows recovery of deleted blobs within a configurable retention period\" — Blob soft delete retains deleted or overwritten blobs in a 'soft deleted' state for 1–365 days. During this window, they can be undeleted — protection against accidental deletion or application bugs.",
    null,
    "Incorrecto: \"Replicates blobs to a secondary region\" no cumple con el requisito descrito. La opción correcta es \"Allows recovery of deleted blobs within a configurable retention period\" — Blob soft delete retains deleted or overwritten blobs in a 'soft deleted' state for 1–365 days. During this window, they can be undeleted — protection against accidental deletion or application bugs.",
    "Incorrecto: \"Prevents blobs from being overwritten\" no cumple con el requisito descrito. La opción correcta es \"Allows recovery of deleted blobs within a configurable retention period\" — Blob soft delete retains deleted or overwritten blobs in a 'soft deleted' state for 1–365 days. During this window, they can be undeleted — protection against accidental deletion or application bugs."
  ],
  "az-093": [
    "Immutable blob storage supports WORM (Write Once, Read Many) policies — time-based retention locks or legal holds — that prevent modification or deletion even by storage account owners, satisfying regulatory compliance.",
    "Incorrecto: \"Azure Backup for Blobs\" no cumple con el requisito descrito. La opción correcta es \"Immutable blob storage (WORM policy)\" — Immutable blob storage supports WORM (Write Once, Read Many) policies — time-based retention locks or legal holds — that prevent modification or deletion even by storage account owners, satisfying regulatory compliance.",
    null,
    "Incorrecto: \"Azure Key Vault managed HSM\" no cumple con el requisito descrito. La opción correcta es \"Immutable blob storage (WORM policy)\" — Immutable blob storage supports WORM (Write Once, Read Many) policies — time-based retention locks or legal holds — that prevent modification or deletion even by storage account owners, satisfying regulatory compliance."
  ],
  "az-094": [
    "A Private Endpoint assigns a private IP from your VNet to the storage account, enabling secure access over the Microsoft backbone without public internet exposure — even when public access is disabled.",
    null,
    "A Private Endpoint assigns a private IP from your VNet to the storage account, enabling secure access over the Microsoft backbone without public internet exposure — even when public access is disabled.",
    "A Private Endpoint assigns a private IP from your VNet to the storage account, enabling secure access over the Microsoft backbone without public internet exposure — even when public access is disabled."
  ],
  "az-095": [
    "Incorrecto: \"GRS\" no cumple con el requisito descrito. La opción correcta es \"RA-GRS\" — RA-GRS (Read-Access Geo-Redundant Storage) replicates to a secondary region AND provides a secondary read endpoint (URL with -secondary suffix) that is always accessible — unlike GRS which only allows reads after a failover.",
    null,
    "Incorrecto: \"ZRS\" no cumple con el requisito descrito. La opción correcta es \"RA-GRS\" — RA-GRS (Read-Access Geo-Redundant Storage) replicates to a secondary region AND provides a secondary read endpoint (URL with -secondary suffix) that is always accessible — unlike GRS which only allows reads after a failover.",
    "Incorrecto: \"GZRS\" no cumple con el requisito descrito. La opción correcta es \"RA-GRS\" — RA-GRS (Read-Access Geo-Redundant Storage) replicates to a secondary region AND provides a secondary read endpoint (URL with -secondary suffix) that is always accessible — unlike GRS which only allows reads after a failover."
  ],
  "az-096": [
    "Incorrecto: \"Add them as a Guest user with Storage Blob Data Reader role\" no cumple con el requisito descrito. La opción correcta es \"Generate a SAS token with read permissions expiring in 48 hours\" — A SAS token scoped to the container with read permissions and a 48-hour expiry is the most appropriate option — no account creation, granular permissions, and automatically expires.",
    null,
    "A SAS token scoped to the container with read permissions and a 48-hour expiry is the most appropriate option — no account creation, granular permissions, and automatically expires.",
    "A SAS token scoped to the container with read permissions and a 48-hour expiry is the most appropriate option — no account creation, granular permissions, and automatically expires."
  ],
  "az-097": [
    null,
    "Standard Azure Files supports LRS, ZRS, GRS, and GZRS.",
    "Incorrecto: \"LRS only\" no cumple con el requisito descrito. La opción correcta es \"LRS or ZRS only\" — Azure Files Premium (FileStorage accounts) supports LRS and ZRS only. Standard Azure Files supports LRS, ZRS, GRS, and GZRS.",
    "Incorrecto: \"Any redundancy option\" no cumple con el requisito descrito. La opción correcta es \"LRS or ZRS only\" — Azure Files Premium (FileStorage accounts) supports LRS and ZRS only. Standard Azure Files supports LRS, ZRS, GRS, and GZRS."
  ],
  "az-098": [
    null,
    "'sync' is for keeping source and destination in sync (deletes extras).",
    "'upload' and 'pull' are not valid AzCopy commands.",
    "'upload' and 'pull' are not valid AzCopy commands."
  ],
  "az-099": [
    "Incorrecto: \"Availability Set\" no cumple con el requisito descrito. La opción correcta es \"VM Scale Set with rolling upgrade policy\" — VM Scale Sets with rolling upgrade policy update instances in batches, keeping a portion always running — ensuring zero downtime. They also auto-scale based on metrics like CPU.",
    null,
    "Incorrecto: \"Azure Dedicated Host\" no cumple con el requisito descrito. La opción correcta es \"VM Scale Set with rolling upgrade policy\" — VM Scale Sets with rolling upgrade policy update instances in batches, keeping a portion always running — ensuring zero downtime. They also auto-scale based on metrics like CPU.",
    "Incorrecto: \"Proximity Placement Group\" no cumple con el requisito descrito. La opción correcta es \"VM Scale Set with rolling upgrade policy\" — VM Scale Sets with rolling upgrade policy update instances in batches, keeping a portion always running — ensuring zero downtime. They also auto-scale based on metrics like CPU."
  ],
  "az-100": [
    "Azure Bastion is a managed PaaS service that provides browser-based RDP/SSH over TLS to VMs without exposing them to the public internet — no public IP needed on the VM, no inbound 3389/22 ports.",
    null,
    "Azure Bastion is a managed PaaS service that provides browser-based RDP/SSH over TLS to VMs without exposing them to the public internet — no public IP needed on the VM, no inbound 3389/22 ports.",
    "Incorrecto: \"Just-in-time VM access\" no cumple con el requisito descrito. La opción correcta es \"Azure Bastion\" — Azure Bastion is a managed PaaS service that provides browser-based RDP/SSH over TLS to VMs without exposing them to the public internet — no public IP needed on the VM, no inbound 3389/22 ports."
  ],
  "az-101": [
    "Incorrecto: \"Azure Kubernetes Service (AKS)\" no cumple con el requisito descrito. La opción correcta es \"Azure Container Instances (ACI)\" — ACI runs containers on-demand without managing VMs or orchestration. It starts in seconds and you only pay while running — ideal for burst, short-lived, or scale-to-zero workloads.",
    null,
    "Incorrecto: \"Azure VM with Docker\" no cumple con el requisito descrito. La opción correcta es \"Azure Container Instances (ACI)\" — ACI runs containers on-demand without managing VMs or orchestration. It starts in seconds and you only pay while running — ideal for burst, short-lived, or scale-to-zero workloads.",
    "Incorrecto: \"Azure App Service with container\" no cumple con el requisito descrito. La opción correcta es \"Azure Container Instances (ACI)\" — ACI runs containers on-demand without managing VMs or orchestration. It starts in seconds and you only pay while running — ideal for burst, short-lived, or scale-to-zero workloads."
  ],
  "az-102": [
    "Granting it access to SQL via Azure AD authentication eliminates the need to store or rotate any credentials.",
    null,
    "Incorrecto: \"Use a service principal with a certificate stored in Blob Storage\" no cumple con el requisito descrito. La opción correcta es \"Enable system-assigned managed identity and grant it access to SQL using Azure AD authentication\" — With a managed identity, the App Service gets an Azure AD identity automatically. Granting it access to SQL via Azure AD authentication eliminates the need to store or rotate any credentials.",
    "Granting it access to SQL via Azure AD authentication eliminates the need to store or rotate any credentials."
  ],
  "az-103": [
    "Incorrecto: \"App Service Backup\" no cumple con el requisito descrito. La opción correcta es \"Deployment slots (staging slot)\" — Deployment slots let you deploy to a 'staging' slot (with production configuration via slot settings), test thoroughly, then do a warm swap — the staging slot becomes production with zero downtime.",
    null,
    "Incorrecto: \"Azure Traffic Manager weighted routing\" no cumple con el requisito descrito. La opción correcta es \"Deployment slots (staging slot)\" — Deployment slots let you deploy to a 'staging' slot (with production configuration via slot settings), test thoroughly, then do a warm swap — the staging slot becomes production with zero downtime.",
    "Incorrecto: \"Azure Front Door A/B routing\" no cumple con el requisito descrito. La opción correcta es \"Deployment slots (staging slot)\" — Deployment slots let you deploy to a 'staging' slot (with production configuration via slot settings), test thoroughly, then do a warm swap — the staging slot becomes production with zero downtime."
  ],
  "az-104": [
    "Free and Shared have significant limitations.",
    "Free and Shared have significant limitations.",
    null,
    "Basic supports custom domains and SSL but NOT auto-scaling or slots."
  ],
  "az-105": [
    "Incorrecto: \"Add more pods to the existing nodes\" no cumple con el requisito descrito. La opción correcta es \"Enable the cluster autoscaler on the node pool\" — The cluster autoscaler detects pending pods that can't schedule due to insufficient node resources, then automatically scales out the node pool. It's the fastest way to accommodate burst demand without manual intervention.",
    null,
    "Incorrecto: \"Manually add a new node pool\" no cumple con el requisito descrito. La opción correcta es \"Enable the cluster autoscaler on the node pool\" — The cluster autoscaler detects pending pods that can't schedule due to insufficient node resources, then automatically scales out the node pool. It's the fastest way to accommodate burst demand without manual intervention.",
    "Incorrecto: \"Increase pod resource limits\" no cumple con el requisito descrito. La opción correcta es \"Enable the cluster autoscaler on the node pool\" — The cluster autoscaler detects pending pods that can't schedule due to insufficient node resources, then automatically scales out the node pool. It's the fastest way to accommodate burst demand without manual intervention."
  ],
  "az-106": [
    "Azure Batch is purpose-built for large-scale parallel and HPC workloads — it provisions, manages, and scales pools of compute nodes, distributes tasks, and tears down automatically after completion.",
    null,
    "Azure Batch is purpose-built for large-scale parallel and HPC workloads — it provisions, manages, and scales pools of compute nodes, distributes tasks, and tears down automatically after completion.",
    "Azure Batch is purpose-built for large-scale parallel and HPC workloads — it provisions, manages, and scales pools of compute nodes, distributes tasks, and tears down automatically after completion."
  ],
  "az-107": [
    "Incorrecto: \"Group VMs in different regions for failover\" no cumple con el requisito descrito. La opción correcta es \"Keep a set of VMs physically close together within a datacenter to minimize inter-VM latency\" — Proximity Placement Groups (PPG) co-locate VMs in the same physical data center rack, minimizing network latency between them — critical for tightly coupled HPC, SAP HANA, or latency-sensitive workloads.",
    null,
    "Incorrecto: \"Automatically place VMs across availability zones\" no cumple con el requisito descrito. La opción correcta es \"Keep a set of VMs physically close together within a datacenter to minimize inter-VM latency\" — Proximity Placement Groups (PPG) co-locate VMs in the same physical data center rack, minimizing network latency between them — critical for tightly coupled HPC, SAP HANA, or latency-sensitive workloads.",
    "Incorrecto: \"Reserve capacity for VMs in a specific region\" no cumple con el requisito descrito. La opción correcta es \"Keep a set of VMs physically close together within a datacenter to minimize inter-VM latency\" — Proximity Placement Groups (PPG) co-locate VMs in the same physical data center rack, minimizing network latency between them — critical for tightly coupled HPC, SAP HANA, or latency-sensitive workloads."
  ],
  "az-108": [
    "Incorrecto: \"Spot VMs cannot be evicted once running\" no cumple con el requisito descrito. La opción correcta es \"The workload must tolerate interruption and be stateless or checkpoint frequently\" — Spot VMs can be evicted with 30 seconds notice when Azure needs capacity. Workloads must be stateless, use checkpointing, or store state externally — suitable for batch jobs, CI/CD agents, dev/test environments.",
    null,
    "Incorrecto: \"Azure provides a 1-hour warning and migrates the VM\" no cumple con el requisito descrito. La opción correcta es \"The workload must tolerate interruption and be stateless or checkpoint frequently\" — Spot VMs can be evicted with 30 seconds notice when Azure needs capacity. Workloads must be stateless, use checkpointing, or store state externally — suitable for batch jobs, CI/CD agents, dev/test environments.",
    "Incorrecto: \"Spot VMs in Availability Zones cannot be evicted\" no cumple con el requisito descrito. La opción correcta es \"The workload must tolerate interruption and be stateless or checkpoint frequently\" — Spot VMs can be evicted with 30 seconds notice when Azure needs capacity. Workloads must be stateless, use checkpointing, or store state externally — suitable for batch jobs, CI/CD agents, dev/test environments."
  ],
  "az-109": [
    "Azure Update Manager (using the Azure Policies and machine extensions framework) assesses patch compliance and can automatically install updates on Azure VMs — replacing the older Update Management solution in Azure Automation.",
    "Incorrecto: \"Log Analytics Agent\" no cumple con el requisito descrito. La opción correcta es \"Azure Update Manager / Guest Configuration extension\" — Azure Update Manager (using the Azure Policies and machine extensions framework) assesses patch compliance and can automatically install updates on Azure VMs — replacing the older Update Management solution in Azure Automation.",
    null,
    "Azure Update Manager (using the Azure Policies and machine extensions framework) assesses patch compliance and can automatically install updates on Azure VMs — replacing the older Update Management solution in Azure Automation."
  ],
  "az-110": [
    "AKS provides full Kubernetes orchestration including persistent volumes, service discovery, ingress, horizontal pod autoscaling, and namespace isolation — the right choice for complex multi-container workloads.",
    null,
    "AKS provides full Kubernetes orchestration including persistent volumes, service discovery, ingress, horizontal pod autoscaling, and namespace isolation — the right choice for complex multi-container workloads.",
    "AKS provides full Kubernetes orchestration including persistent volumes, service discovery, ingress, horizontal pod autoscaling, and namespace isolation — the right choice for complex multi-container workloads."
  ],
  "az-111": [
    "Incorrecto: \"Azure Bastion\" no cumple con el requisito descrito. La opción correcta es \"Serial Console and Boot Diagnostics\" — Serial Console provides terminal access via the COM port (works even without network). Boot Diagnostics shows a screenshot of the VM's boot state. Together they allow diagnosing and fixing VMs that are unresponsive to RDP/SSH.",
    null,
    "Incorrecto: \"Azure Network Watcher\" no cumple con el requisito descrito. La opción correcta es \"Serial Console and Boot Diagnostics\" — Serial Console provides terminal access via the COM port (works even without network). Boot Diagnostics shows a screenshot of the VM's boot state. Together they allow diagnosing and fixing VMs that are unresponsive to RDP/SSH.",
    "Incorrecto: \"VM Run Command via Azure CLI\" no cumple con el requisito descrito. La opción correcta es \"Serial Console and Boot Diagnostics\" — Serial Console provides terminal access via the COM port (works even without network). Boot Diagnostics shows a screenshot of the VM's boot state. Together they allow diagnosing and fixing VMs that are unresponsive to RDP/SSH."
  ],
  "az-112": [
    "Application Gateway with WAF (Web Application Firewall) inspects HTTP traffic for OWASP threats like SQL injection and XSS at layer 7 — NSG and Azure Firewall operate at layers 3-4 and don't parse HTTP payloads.",
    "Incorrecto: \"Network Security Group\" no cumple con el requisito descrito. La opción correcta es \"Azure Application Gateway with WAF\" — Application Gateway with WAF (Web Application Firewall) inspects HTTP traffic for OWASP threats like SQL injection and XSS at layer 7 — NSG and Azure Firewall operate at layers 3-4 and don't parse HTTP payloads.",
    null,
    "Application Gateway with WAF (Web Application Firewall) inspects HTTP traffic for OWASP threats like SQL injection and XSS at layer 7 — NSG and Azure Firewall operate at layers 3-4 and don't parse HTTP payloads."
  ],
  "az-113": [
    "Application Gateway routes at layer 7 (application layer), enabling URL-based routing, session affinity, SSL termination, and WAF.",
    null,
    "Application Gateway routes at layer 7 (application layer), enabling URL-based routing, session affinity, SSL termination, and WAF.",
    "Application Gateway routes at layer 7 (application layer), enabling URL-based routing, session affinity, SSL termination, and WAF."
  ],
  "az-114": [
    "Incorrecto: \"Azure Load Balancer Standard\" no cumple con el requisito descrito. La opción correcta es \"Azure Traffic Manager\" — Traffic Manager is a DNS-based global load balancer. Its 'Performance' routing method directs users to the closest endpoint by measuring DNS latency, with health probes to avoid directing traffic to unhealthy endpoints.",
    "Incorrecto: \"Azure Application Gateway\" no cumple con el requisito descrito. La opción correcta es \"Azure Traffic Manager\" — Traffic Manager is a DNS-based global load balancer. Its 'Performance' routing method directs users to the closest endpoint by measuring DNS latency, with health probes to avoid directing traffic to unhealthy endpoints.",
    null,
    "Incorrecto: \"Azure Front Door\" no cumple con el requisito descrito. La opción correcta es \"Azure Traffic Manager\" — Traffic Manager is a DNS-based global load balancer. Its 'Performance' routing method directs users to the closest endpoint by measuring DNS latency, with health probes to avoid directing traffic to unhealthy endpoints."
  ],
  "az-115": [
    "Priority 100 is evaluated before priority 200, so the allow rule at 100 is matched first and HTTP traffic is allowed.",
    "Priority 100 is evaluated before priority 200, so the allow rule at 100 is matched first and HTTP traffic is allowed.",
    null,
    "Priority 100 is evaluated before priority 200, so the allow rule at 100 is matched first and HTTP traffic is allowed."
  ],
  "az-116": [
    "Incorrecto: \"VPN Gateway connection\" no cumple con el requisito descrito. La opción correcta es \"Global VNet Peering\" — Global VNet Peering extends VNet peering across regions with no gateway required. Traffic traverses the Microsoft backbone. It's the simplest option for cross-region VNet connectivity.",
    "Incorrecto: \"ExpressRoute\" no cumple con el requisito descrito. La opción correcta es \"Global VNet Peering\" — Global VNet Peering extends VNet peering across regions with no gateway required. Traffic traverses the Microsoft backbone. It's the simplest option for cross-region VNet connectivity.",
    null,
    "Incorrecto: \"Azure Virtual WAN\" no cumple con el requisito descrito. La opción correcta es \"Global VNet Peering\" — Global VNet Peering extends VNet peering across regions with no gateway required. Traffic traverses the Microsoft backbone. It's the simplest option for cross-region VNet connectivity."
  ],
  "az-117": [
    "DNS resolves the service's FQDN to the private IP, so traffic never leaves your VNet — unlike Service Endpoints, which still route to the service's public IP.",
    null,
    "DNS resolves the service's FQDN to the private IP, so traffic never leaves your VNet — unlike Service Endpoints, which still route to the service's public IP.",
    "Incorrecto: \"Network Security Groups\" no cumple con el requisito descrito. La opción correcta es \"Private Endpoints\" — Private Endpoints assign a private IP from your VNet to the PaaS service. DNS resolves the service's FQDN to the private IP, so traffic never leaves your VNet — unlike Service Endpoints, which still route to the service's public IP."
  ],
  "az-118": [
    "A UDR with a default route (0.0.0.0/0) pointing to the on-premises NVA/firewall (via ExpressRoute) is called forced tunneling — it redirects all internet-bound VM traffic through the on-premises network for inspection.",
    "A UDR with a default route (0.0.0.0/0) pointing to the on-premises NVA/firewall (via ExpressRoute) is called forced tunneling — it redirects all internet-bound VM traffic through the on-premises network for inspection.",
    null,
    "A UDR with a default route (0.0.0.0/0) pointing to the on-premises NVA/firewall (via ExpressRoute) is called forced tunneling — it redirects all internet-bound VM traffic through the on-premises network for inspection."
  ],
  "az-119": [
    "Incorrecto: \"Azure Monitor\" no cumple con el requisito descrito. La opción correcta es \"Network Watcher with NSG Flow Logs\" — Network Watcher's NSG Flow Logs capture source/destination IP, port, protocol, and allow/deny decisions. Combined with Traffic Analytics (Log Analytics), it visualizes patterns and flags anomalies.",
    "Incorrecto: \"Azure Firewall Logs\" no cumple con el requisito descrito. La opción correcta es \"Network Watcher with NSG Flow Logs\" — Network Watcher's NSG Flow Logs capture source/destination IP, port, protocol, and allow/deny decisions. Combined with Traffic Analytics (Log Analytics), it visualizes patterns and flags anomalies.",
    null,
    "Incorrecto: \"Azure Sentinel\" no cumple con el requisito descrito. La opción correcta es \"Network Watcher with NSG Flow Logs\" — Network Watcher's NSG Flow Logs capture source/destination IP, port, protocol, and allow/deny decisions. Combined with Traffic Analytics (Log Analytics), it visualizes patterns and flags anomalies."
  ],
  "az-120": [
    "This is the recommended way to resolve Azure private DNS zones from on-premises since 168.63.129.16 is not reachable off-Azure.",
    "This is the recommended way to resolve Azure private DNS zones from on-premises since 168.63.129.16 is not reachable off-Azure.",
    null,
    "Incorrecto: \"ExpressRoute Route Filter for DNS traffic\" no cumple con el requisito descrito. La opción correcta es \"Azure DNS Private Resolver with inbound endpoints\" — Azure DNS Private Resolver with an inbound endpoint provides a reachable IP that on-premises DNS forwarders can send queries to. This is the recommended way to resolve Azure private DNS zones from on-premises since 168.63.129.16 is not reachable off-Azure."
  ],
  "az-121": [
    "Outbound traffic is evaluated in reverse order (NIC first, then subnet).",
    "Incorrecto: \"Only the NIC NSG is applied\" no cumple con el requisito descrito. La opción correcta es \"Both NSGs are evaluated — traffic must be allowed by both to reach the VM\" — When NSGs are on both the subnet and NIC, inbound traffic is evaluated against the subnet NSG first, then the NIC NSG — traffic must pass both. Outbound traffic is evaluated in reverse order (NIC first, then subnet).",
    null,
    "Incorrecto: \"The NSG with lower priority wins\" no cumple con el requisito descrito. La opción correcta es \"Both NSGs are evaluated — traffic must be allowed by both to reach the VM\" — When NSGs are on both the subnet and NIC, inbound traffic is evaluated against the subnet NSG first, then the NIC NSG — traffic must pass both. Outbound traffic is evaluated in reverse order (NIC first, then subnet)."
  ],
  "az-122": [
    "Incorrecto: \"VPN Gateway with BGP\" no cumple con el requisito descrito. La opción correcta es \"Azure Virtual WAN\" — Azure Virtual WAN is a networking service that provides optimized, hub-and-spoke connectivity between branches, Azure VNets, and the internet with integrated BGP routing — designed for large-scale branch connectivity scenarios.",
    null,
    "Incorrecto: \"Multiple VNet Peerings with NVA\" no cumple con el requisito descrito. La opción correcta es \"Azure Virtual WAN\" — Azure Virtual WAN is a networking service that provides optimized, hub-and-spoke connectivity between branches, Azure VNets, and the internet with integrated BGP routing — designed for large-scale branch connectivity scenarios.",
    "Azure Virtual WAN is a networking service that provides optimized, hub-and-spoke connectivity between branches, Azure VNets, and the internet with integrated BGP routing — designed for large-scale branch connectivity scenarios."
  ],
  "az-123": [
    "Incorrecto: \"Diagnostic Setting\" no cumple con el requisito descrito. La opción correcta es \"Metric alert rule\" — Metric alert rules evaluate numeric signals (CPU, memory, disk) against thresholds at a configured frequency. The Azure Monitor Agent (AMA) must be installed to collect in-guest metrics like available memory.",
    "Incorrecto: \"Activity Log alert\" no cumple con el requisito descrito. La opción correcta es \"Metric alert rule\" — Metric alert rules evaluate numeric signals (CPU, memory, disk) against thresholds at a configured frequency. The Azure Monitor Agent (AMA) must be installed to collect in-guest metrics like available memory.",
    null,
    "Incorrecto: \"Log Analytics workspace query\" no cumple con el requisito descrito. La opción correcta es \"Metric alert rule\" — Metric alert rules evaluate numeric signals (CPU, memory, disk) against thresholds at a configured frequency. The Azure Monitor Agent (AMA) must be installed to collect in-guest metrics like available memory."
  ],
  "az-124": [
    "Incorrecto: \"Metrics Explorer\" no cumple con el requisito descrito. La opción correcta es \"Activity Log\" — The Activity Log records all control-plane operations (ARM operations) — create, delete, update — including the caller identity, timestamp, and result. It's the authoritative audit trail for resource lifecycle events.",
    "Incorrecto: \"Log Analytics Workspace\" no cumple con el requisito descrito. La opción correcta es \"Activity Log\" — The Activity Log records all control-plane operations (ARM operations) — create, delete, update — including the caller identity, timestamp, and result. It's the authoritative audit trail for resource lifecycle events.",
    null,
    "Incorrecto: \"Azure Advisor\" no cumple con el requisito descrito. La opción correcta es \"Activity Log\" — The Activity Log records all control-plane operations (ARM operations) — create, delete, update — including the caller identity, timestamp, and result. It's the authoritative audit trail for resource lifecycle events."
  ],
  "az-125": [
    "KQL queries run against this store — Metrics Explorer is for numeric time-series data only.",
    null,
    "Incorrecto: \"Azure Security Center\" no cumple con el requisito descrito. La opción correcta es \"Log Analytics Workspace\" — Log Analytics Workspace stores and indexes log data from VMs (via AMA/MMA), Azure services, and security solutions. KQL queries run against this store — Metrics Explorer is for numeric time-series data only.",
    "Incorrecto: \"Azure Activity Log\" no cumple con el requisito descrito. La opción correcta es \"Log Analytics Workspace\" — Log Analytics Workspace stores and indexes log data from VMs (via AMA/MMA), Azure services, and security solutions. KQL queries run against this store — Metrics Explorer is for numeric time-series data only."
  ],
  "az-126": [
    "You select the desired recovery point (3 days ago) and restore to the original VM location or to a new VM — this is the standard restore path.",
    null,
    "Incorrecto: \"Re-deploy from ARM template\" no cumple con el requisito descrito. La opción correcta es \"Restore from Recovery Services Vault recovery point to a new or existing VM\" — Azure Backup stores recovery points in a Recovery Services Vault. You select the desired recovery point (3 days ago) and restore to the original VM location or to a new VM — this is the standard restore path.",
    "You select the desired recovery point (3 days ago) and restore to the original VM location or to a new VM — this is the standard restore path."
  ],
  "az-127": [
    "RTO (Recovery Time Objective) defines how quickly the system must be back online.",
    null,
    "Incorrecto: \"RPO and RTO are both measured in data volume\" no cumple con el requisito descrito. La opción correcta es \"RPO is maximum tolerable data loss (time); RTO is maximum tolerable downtime\" — RPO (Recovery Point Objective) defines how much data loss is acceptable — e.g., RPO of 1 hour means backups/replication must be at most 1 hour old. RTO (Recovery Time Objective) defines how quickly the system must be back online.",
    "Incorrecto: \"RTO applies only to Active-Active architectures\" no cumple con el requisito descrito. La opción correcta es \"RPO is maximum tolerable data loss (time); RTO is maximum tolerable downtime\" — RPO (Recovery Point Objective) defines how much data loss is acceptable — e.g., RPO of 1 hour means backups/replication must be at most 1 hour old. RTO (Recovery Time Objective) defines how quickly the system must be back online."
  ],
  "az-128": [
    "On primary site failure, you trigger an unplanned failover from the Recovery Services Vault (or automate it via recovery plans) — ASR brings the VM online in Azure using the latest replicated state.",
    "On primary site failure, you trigger an unplanned failover from the Recovery Services Vault (or automate it via recovery plans) — ASR brings the VM online in Azure using the latest replicated state.",
    "On primary site failure, you trigger an unplanned failover from the Recovery Services Vault (or automate it via recovery plans) — ASR brings the VM online in Azure using the latest replicated state.",
    null
  ],
  "az-129": [
    "Azure Monitor Workbooks are interactive documents that combine KQL queries, metrics visualizations, text, and parameter controls into shareable, parameterized reports — much richer than static dashboard tiles.",
    null,
    "Azure Monitor Workbooks are interactive documents that combine KQL queries, metrics visualizations, text, and parameter controls into shareable, parameterized reports — much richer than static dashboard tiles.",
    "Azure Monitor Workbooks are interactive documents that combine KQL queries, metrics visualizations, text, and parameter controls into shareable, parameterized reports — much richer than static dashboard tiles."
  ],
  "az-130": [
    "Read and write operations (including tag updates, configuration changes) are still permitted on resources within the locked scope — only ReadOnly locks block modifications.",
    null,
    "Read and write operations (including tag updates, configuration changes) are still permitted on resources within the locked scope — only ReadOnly locks block modifications.",
    "Read and write operations (including tag updates, configuration changes) are still permitted on resources within the locked scope — only ReadOnly locks block modifications."
  ]
},
    glossary: [
  {
    "term": "Azure Policy",
    "cat": "Governance",
    "d": 1,
    "def": "Servicio que evalúa recursos en Azure frente a reglas corporativas (Deny, Audit, Modify, Append, DeployIfNotExists)."
  },
  {
    "term": "CanNotDelete Lock",
    "cat": "Governance",
    "d": 1,
    "def": "Bloqueo de recurso que impide borrar un recurso o grupo de recursos incluso a usuarios con rol Owner, permitiendo su modificación."
  },
  {
    "term": "Conditional Access",
    "cat": "Identities",
    "d": 1,
    "def": "Motor de políticas de Entra ID (requiere P1+) que evalúa señales de usuario, ubicación y riesgo para exigir controles como MFA."
  },
  {
    "term": "PIM (Privileged Identity Management)",
    "cat": "Identities",
    "d": 1,
    "def": "Característica de Entra ID P2 que entrega acceso privilegiado Just-In-Time (por tiempo limitado y con aprobación)."
  },
  {
    "term": "ZRS vs GRS",
    "cat": "Storage",
    "d": 2,
    "def": "ZRS replica síncronamente en 3 zonas de una misma región; GRS replica asíncronamente a una segunda región emparejada."
  },
  {
    "term": "Stored Access Policy (SAS)",
    "cat": "Storage",
    "d": 2,
    "def": "Política en el contenedor o cola que permite cambiar permisos o revocar un Service SAS sin regenerar la clave de la cuenta."
  },
  {
    "term": "Private Endpoint",
    "cat": "Networking",
    "d": 4,
    "def": "Interfaz de red con IP privada de tu VNet que conecta de forma privada a un servicio PaaS (Storage, SQL, Key Vault) mediante Private Link."
  },
  {
    "term": "Azure Bastion",
    "cat": "Compute",
    "d": 3,
    "def": "Servicio PaaS gestionado que brinda conectividad RDP y SSH por TLS desde el portal sin exponer IPs públicas en las VMs."
  },
  {
    "term": "Application Gateway",
    "cat": "Networking",
    "d": 4,
    "def": "Balanceador de carga regional de capa 7 (HTTP/HTTPS) con terminación TLS, enrutamiento por rutas y WAF integrado."
  },
  {
    "term": "Activity Log",
    "cat": "Monitor",
    "d": 5,
    "def": "Registro de auditoría del plano de control de Azure que responde quién, qué y cuándo se crearon, actualizaron o eliminaron recursos."
  },
  {
    "term": "Azure Site Recovery (ASR)",
    "cat": "Backup & DR",
    "d": 5,
    "def": "Servicio de replicación continua y orquestación de failover para máquinas virtuales entre regiones de Azure o desde on-premises."
  }
]
  };
})(window);
