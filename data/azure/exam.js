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
          "Assign the policy initiative to each subscription individually using Azure CLI scripts",
          "Create a Management Group hierarchy and assign policy initiatives at that scope",
          "Publish and assign an Azure Blueprint separately to each individual subscription",
          "Create a central subscription and deploy a shared resource group containing policies"
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
          "Azure RBAC role assignment with a custom Deny action on resource providers",
          "Azure Policy assignment with a \"Deny\" effect using the Allowed Locations definition",
          "Resource lock of type \"ReadOnly\" applied across all subscription resource groups",
          "Azure Service Health rule configured to restrict regional deployments automatically"
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
          "A `ReadOnly` resource lock on the resource group hides existing resources from view",
          "A deny assignment applied at the subscription level explicitly blocks the read action",
          "The resource resides in a different resource group where the user lacks permissions",
          "An Azure Policy definition with an `Audit` effect filters non-compliant resources out"
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
          "Enforce automated password rotation and self-service password reset for cloud users",
          "Provide just-in-time, time-bound, and approval-based activation for privileged roles",
          "Synchronize on-premises Active Directory password hashes with Azure AD Connect health",
          "Continuously detect leaked user credentials on the dark web using machine learning"
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
          "Users cannot read or download blob objects, and all access keys are revoked immediately",
          "Users can modify blob container data, but cannot delete containers or storage tables",
          "Users can manage blob data plane items, but cannot modify storage account resource settings",
          "Users can modify resource tags, but cannot regenerate access keys or alter network rules"
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
          "They are automatically disabled and prevented from receiving inbound network traffic",
          "They are marked non-compliant in reports, but continue running without modification",
          "They trigger an automatic remediation task that updates their configuration settings",
          "They are moved to an isolated quarantine subscription until brought into compliance"
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
          "Aggregate resource health events and service health alerts across subscriptions",
          "Package role assignments, policies, and ARM templates into reusable environment definitions",
          "Automate cross-region failover and disaster recovery orchestration for virtual machines",
          "Analyze cloud spending patterns and generate cost allocation reports across subscriptions"
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
          "LRS replicates synchronously across 3 paired regions; ZRS stores 3 copies in one single datacenter",
          "LRS replicates 3 copies within one datacenter; ZRS replicates across 3 availability zones in a region",
          "LRS guarantees high availability during regional loss; ZRS only provides rack-level fault isolation",
          "LRS asynchronously mirrors data to another continent; ZRS requires premium block blob tier accounts"
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
          "A secondary storage account access key configured to auto-expire after 48 hours",
          "A service Shared Access Signature (SAS) token configured with a 48-hour expiry",
          "An Azure AD application service principal assigned the Contributor role on the VM",
          "A POSIX-compliant container access control list (ACL) with a temporary time limit"
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
          "Hot access tier",
          "Cool access tier",
          "Cold access tier",
          "Archive access tier"
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
          "Azure Blob Storage with NFS v3 protocol support enabled",
          "Azure Files with dual SMB and NFS protocol share support",
          "Azure Managed Disks with shared disk clustering enabled",
          "Azure Table Storage with structured REST endpoint access"
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
          "The blob is permanently deleted from storage after a 24-hour grace window",
          "The blob can be restored within 14 days directly from the Azure portal or CLI",
          "The blob is moved to Archive access tier and requires 15 hours to rehydrate",
          "The blob must be restored from an Azure Backup Recovery Services vault point"
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
          "BlobStorage legacy account with container versioning enabled",
          "General-purpose v1 (GPv1) account with flat namespace structure",
          "General-purpose v2 (GPv2) account with hierarchical namespace enabled",
          "Premium FileStorage account with multi-protocol protocol enabled"
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
          "AzCopy utility transferring data over the shared 100 Mbps connection",
          "Azure Data Factory using a self-hosted integration runtime pipeline",
          "Azure Data Box physical appliance shipped for offline data transfer",
          "Azure Storage Explorer with parallel multi-part blob transfers enabled"
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
          "Automatically replicate blobs to a secondary paired storage account in another region",
          "Automatically transition blobs between access tiers or delete them based on retention rules",
          "Continuously monitor blob transaction metrics and alert administrators on capacity spikes",
          "Schedule automated failover between primary and secondary endpoints during storage incidents"
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
          "Assign a public IP address to the VM and whitelist it in storage firewall settings",
          "Attach a Network Security Group rule allowing outbound traffic on TCP port 445",
          "Add the VM subnet to the storage account firewall virtual network access rules",
          "Deploy a Virtual Network Gateway to establish a point-to-site connection to storage"
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
          "Zone-redundant storage (ZRS)",
          "Geo-redundant storage (GRS)",
          "Geo-zone-redundant storage (GZRS)",
          "Locally redundant storage (LRS)"
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
          "Submit an urgent support ticket to Microsoft Azure requesting account quarantine",
          "Regenerate the compromised access key immediately and update connecting workloads",
          "Configure storage firewall rules to temporarily deny all public endpoint traffic",
          "Change the replication tier from LRS to GRS to isolate compromised data partitions"
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
          "VMSS provides automated scaling based on metrics; Availability Sets only provide high availability",
          "Availability Sets provide automated horizontal scaling; VMSS only provides static VM fault isolation",
          "VMSS supports heterogeneous operating systems per pool; Availability Sets require identical VM images",
          "Availability Sets automatically span multiple Azure regions; VMSS is restricted to a single datacenter"
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
          "Azure Virtual Machines on a scheduled automation runbook",
          "Azure Kubernetes Service (AKS) with spot node pool nodes",
          "Azure Container Instances (ACI) with per-second billing",
          "Azure App Service Linux plan configured with WebJobs tasks"
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
          "Create an `imagePullSecret` using a scoped ACR service principal credential",
          "Enable anonymous pull access on the ACR network firewall public endpoint",
          "Attach the ACR to the AKS cluster using a managed identity role assignment",
          "Store an admin account token in a Kubernetes ConfigMap mounted by the pods"
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
          "Deploy and configure the Azure Monitor Agent automatically across all VM instances",
          "Execute PowerShell or Bash scripts on a VM post-provisioning for software setup",
          "Schedule automated managed disk snapshots and upload backup archives to storage",
          "Perform online resizing of VM OS disks without requiring a system deallocation"
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
          "Deallocate the virtual machine to retain disk data while avoiding compute charges",
          "Delete the VM resource while deselecting the option to delete the managed OS disk",
          "Capture a full managed snapshot of the OS disk and delete the entire disk resource",
          "Move the virtual machine resource to a dedicated archive resource group for reuse"
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
          "Distribute VMs across regions to provide multi-region failover and load balancing",
          "Co-locate VMs within the same datacenter hardware to minimize inter-VM latency",
          "Associate network interfaces with Application Security Groups to simplify filtering",
          "Synchronize virtual machine state across availability zones for high availability"
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
          "Deallocate the VM, expand the disk size in Azure, start the VM, and extend the volume",
          "Detach the OS disk from the running VM, expand the disk, and reattach it to the VM",
          "Create a new managed disk with the target size, clone data, and swap the OS disk",
          "Attach an empty data disk and configure software storage spaces disk striping"
        ],
        "a": 0,
        "e": "To resize an Azure VM's OS disk, you must first deallocate the VM (stop it completely), resize the managed disk in Azure (it can only be expanded, not shrunk), restart the VM, and extend the file system partition within the OS. Online resizing without deallocation is supported for data disks, but resizing the OS disk requires deallocation."
      },
      {
        "id": "az-041",
        "d": 3,
        "t": "Compute",
        "q": "Azure Spot VMs are BEST suited for which type of workloads?",
        "o": [
          "Production customer-facing web applications requiring guaranteed uptime SLAs",
          "Fault-tolerant, interruptible batch processing and stateless scale-out workloads",
          "Mission-critical relational database clusters requiring 99.99% availability",
          "Identity directory controllers and mission-critical enterprise authentication"
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
          "The OS is paused in memory; full compute charges and storage costs continue to accrue",
          "Compute resources are released; no compute charges apply, but storage costs continue",
          "The VM configuration is preserved in cold storage; compute is billed at a 50% discount",
          "The host hardware is undergoing platform maintenance; compute charges are discounted"
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
          "Allow all inbound traffic across all ports and protocols via default rules",
          "Permit inbound traffic originating from within the virtual network only",
          "Deny all inbound traffic by falling through to the implicit deny-all rule",
          "Forward unmatched inbound packets to Azure Network Watcher packet capture"
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
          "Network Security Group outbound security rules configured on the subnet",
          "User Defined Route (UDR) for 0.0.0.0/0 with next hop set to the NVA IP",
          "Azure Firewall application rule collection associated with the VNet",
          "Virtual Network service endpoints configured for internet-bound traffic"
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
          "Border Gateway Protocol (BGP) route propagation must be enabled on the UDR",
          "IP Forwarding must be enabled on the NVA network interface card in Azure",
          "A standard SKU public IP address must be directly assigned to the NVA NIC",
          "An outbound NSG rule must be created to permit TCP traffic on the NVA NIC"
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
          "Azure Standard Load Balancer using cross-region routing",
          "Azure Application Gateway with multi-region backend pools",
          "Azure Traffic Manager using the Performance routing method",
          "Azure Front Door using custom domain weighted distribution"
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
          "Azure Traffic Manager profile with custom domain endpoint records",
          "Azure Private DNS Zone linked to the virtual network for resolution",
          "Azure Public DNS Zone with manual host A record synchronization",
          "Custom DNS forwarder deployed on a dedicated B-series virtual machine"
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
          "NSGs provide stateful Layer 7 URL inspection; Azure Firewall only filters Layer 4 IP traffic",
          "Azure Firewall provides stateful Layer 7 and FQDN filtering; NSGs filter basic Layer 3 and 4",
          "NSGs inspect encrypted HTTPS payloads natively; Azure Firewall is restricted to subnet routing",
          "Azure Firewall operates as a host-based firewall; NSGs provide central network boundary security"
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
          "Assign a dedicated public IP address directly to a virtual machine network interface",
          "Route subnet traffic to Azure PaaS services over the backbone without traversing the internet",
          "Establish an encrypted IPSec VPN tunnel connecting an on-premises datacenter to Azure",
          "Distribute incoming network traffic across backend virtual machine pool instances"
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
          "Automated end-to-end TLS encryption in transit for all outbound network traffic",
          "A private IP in your VNet for PaaS services, accessible across peered VNets and VPNs",
          "Direct public IP bypass that removes outbound data egress charges completely",
          "Built-in distributed denial-of-service (DDoS) Protection Network Protection tier"
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
          "The backend virtual machine is automatically restarted by the load balancer probe",
          "The load balancer stops routing new network connections to that unhealthy VM",
          "The VM is removed from the backend pool and replaced with a newly deployed image",
          "An alert is triggered in Azure Monitor while existing and new traffic continues"
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
          "An Azure Policy definition with an `Audit` effect evaluating VM CPU metrics",
          "An Azure Monitor metric alert rule evaluating the `Percentage CPU` metric",
          "A Microsoft Defender for Cloud recommendation tracking high compute usage",
          "A Log Analytics scheduled query alert parsing VM Windows event log records"
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
          "Store automated virtual machine OS disk snapshots and managed backup restore points",
          "Centrally aggregate, retain, and analyze telemetry logs and performance data via KQL",
          "Provide real-time live streaming metrics dashboards for compute resource telemetry",
          "Archive blob storage diagnostic telemetry to cold storage for long-term compliance"
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
          "Azure Backup performs cross-region disaster failover; Site Recovery creates daily point-in-time file archives",
          "Azure Backup protects against data loss via point-in-time restore; Site Recovery replicates workloads for DR failover",
          "Azure Site Recovery handles granular file and folder recovery; Azure Backup is restricted to full virtual machines",
          "Azure Backup provides continuous real-time synchronous replication; Site Recovery only executes scheduled backups"
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
          "7 days default; extend retention by deploying an automated Azure Policy remediation task",
          "30 days default; upgrade the subscription to a Log Analytics Dedicated Cluster tier",
          "90 days default; stream logs via Diagnostic Settings to Log Analytics or a Storage Account",
          "365 days default; retain indefinitely without configuring additional diagnostic routing"
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
          "Monitor guest operating system CPU, memory, and disk performance metrics across virtual machines",
          "Track platform outages, planned maintenance, and health advisories affecting your specific resources",
          "Define multi-resource alert threshold rules and automated runbook remediations in Azure Monitor",
          "Assign role-based access control permissions for centralized workspace auditing and diagnostics"
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
          "Organize Azure resources into logical governance containers for applying policy initiatives",
          "Define reusable notification preferences and automated actions triggered when alert rules fire",
          "Aggregate metric telemetry into custom categories for cross-subscription dashboard reporting",
          "Enforce role-based access control permissions across Log Analytics data export destinations"
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
          "T-SQL (Transact-SQL)",
          "PromQL (Prometheus Query Language)",
          "KQL (Kusto Query Language)",
          "OData `$filter` syntax"
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
          "Managed disk snapshots scheduled by a runbook",
          "Azure Site Recovery with 24-hour point retention",
          "Azure Backup with a vault and daily backup policy",
          "GRS storage account with soft delete for VHDs"
        ],
        "a": 2,
        "e": "Azure Backup with a Recovery Services vault and a backup policy lets you schedule daily VM backups (RPO 24 h) and configure retention (daily, weekly, monthly, yearly) such as 30 days. Site Recovery is for DR replication, not long-term backup retention."
      },
      {
        "id": "az-068",
        "d": 5,
        "t": "Monitor & Backup",
        "q": "Which Azure tool provides recommendations to reduce costs by identifying underutilized VMs and unattached disks?",
        "o": [
          "Azure Monitor VM insights",
          "Microsoft Defender for Cloud",
          "Azure Advisor",
          "Cost Management budgets"
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
          "`Audit` policy effect rule",
          "`Deny` policy effect rule",
          "`Modify` policy effect rule",
          "`DeployIfNotExists` effect"
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
          "VM Boot Diagnostics screenshot and serial log",
          "Activity Log filtered on the VM resource",
          "Recovery Services vault → Backup jobs",
          "Log Analytics `AddonAzureBackupJobs` table"
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
          "Conditional Access with sign-in frequency control",
          "Azure AD Privileged Identity Management (PIM)",
          "Azure AD access reviews for privileged roles",
          "Azure AD administrative units with scoped roles"
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
          "Set the assignment enforcement mode to `DoNotEnforce`",
          "Change the policy definition's effect to `Audit`",
          "Add the resource group to the assignment's `notScopes`",
          "Grant the deployers Resource Policy Contributor on that RG"
        ],
        "a": 2,
        "e": "Policy assignments support scope exclusions (`notScopes`) — you specify one or more child scopes (resource groups, resources) that are excluded from the assignment, without changing the policy definition or effect for the rest of the subscription."
      },
      {
        "id": "az-075",
        "d": 1,
        "t": "Identities & Governance",
        "q": "Which Azure Policy effect creates a resource automatically when one doesn't exist (e.g., adds a Log Analytics diagnostic setting)?",
        "o": [
          "`Append` policy effect",
          "`Audit` policy effect",
          "`DeployIfNotExists` effect",
          "`Modify` policy effect"
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
          "Maximum 1 directory",
          "Maximum 10 directories",
          "Maximum 500 directories",
          "Unlimited directories"
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
          "Assign the policy to each of the department's subscriptions",
          "Assign it at the root management group with exclusions",
          "Assign the policy to the department's management group",
          "Deploy a blueprint containing the policy to each subscription"
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
          "Store a service principal client secret in app settings",
          "Use a system-assigned managed identity with Key Vault access",
          "Use a service principal certificate in the App Service store",
          "Allow the app's subnet via a Key Vault service endpoint"
        ],
        "a": 1,
        "e": "A system-assigned managed identity gives the app an automatically managed Azure AD identity. Granting it access through a Key Vault access policy (or Key Vault RBAC role such as Key Vault Secrets User) lets the app authenticate without any stored credentials."
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
          "Create a Conditional Access policy with named locations",
          "Assign the 'Allowed locations' policy at the management group",
          "Create a custom RBAC role scoped to East US resource groups",
          "Assign 'Allowed locations' to each of the 20 subscriptions"
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
          "B2B handles consumer self-service sign-up; B2C handles partner guests",
          "B2B invites partners as guests; B2C is customer identity for apps",
          "B2B requires Azure AD P2; B2C requires Azure AD Premium P1",
          "B2B uses a separate tenant; B2C uses your workforce tenant"
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
          "The delete succeeds because Owner permissions override locks",
          "The delete fails until the lock is removed, even for Owner",
          "The delete succeeds only if the Owner also created the lock",
          "Only the resources inside are protected, not the group itself"
        ],
        "a": 1,
        "e": "Resource locks override RBAC permissions. A CanNotDelete lock prevents deletion regardless of role — even an Owner must first remove the lock (which requires Microsoft.Authorization/locks/delete, held by Owner and User Access Administrator) before deleting the resource group."
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
          "Premium LRS",
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
          "Storage firewall IP rule for the VNet's NAT public IP",
          "Service endpoint for `Microsoft.Storage` on the subnet",
          "VNet peering to the storage account's managed VNet",
          "ExpressRoute Microsoft peering to the storage service"
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
          "Account SAS scoped to the blob service",
          "Service SAS with a stored access policy",
          "User delegation SAS signed with Azure AD",
          "Ad hoc service SAS with a short expiry"
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
          "20% of the Azure file share is reserved for tiered files",
          "The local volume keeps at least 20% free by tiering cold files",
          "Only the 20% most recently accessed files stay cached locally",
          "Cold files are tiered as soon as the local volume reaches 20% used"
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
          "AzCopy with `--cap-mbps` bandwidth throttling",
          "Azure Data Factory copy activity via a SHIR",
          "Azure Data Box offline transfer device",
          "Azure File Sync with cloud tiering enabled"
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
          "Keeps scheduled read-only point-in-time copies of each blob",
          "Lets you recover deleted blobs within a set retention period",
          "Replicates deleted blobs to the secondary region for recovery",
          "Prevents blobs from being deleted or overwritten for a set period"
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
          "Blob snapshots with a 7-year lifecycle rule",
          "Azure Backup for Blobs with 7-year retention",
          "Time-based immutability (WORM) policy",
          "Blob soft delete at maximum retention"
        ],
        "a": 2,
        "e": "Immutable blob storage supports WORM (Write Once, Read Many) policies — time-based retention or legal holds — that prevent modification or deletion even by storage account owners, satisfying regulatory compliance such as a 7-year retention requirement."
      },
      {
        "id": "az-094",
        "d": 2,
        "t": "Storage",
        "q": "A storage account has public network access disabled. How can an application in a different VNet access blobs securely?",
        "o": [
          "Allow the app's public IP in the storage firewall",
          "Configure a Private Endpoint in the application's VNet",
          "Add a service endpoint and VNet rule for the app's subnet",
          "Enable the 'Allow trusted Microsoft services' exception"
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
          "Geo-redundant storage (`GRS`) replication",
          "Read-access geo-redundant storage (`RA-GRS`)",
          "Zone-redundant storage (`ZRS`) replication",
          "Geo-zone-redundant storage (`GZRS`) option"
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
          "Invite them as a B2B guest with Storage Blob Data Reader",
          "Issue a read-only container SAS that expires in 48 hours",
          "Set the container access level to Blob (anonymous read)",
          "Share the account's key2 and regenerate it after 48 hours"
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
          "`azcopy copy 'https://account.blob.core.windows.net/container' './local' --recursive`",
          "`azcopy copy './local' 'https://account.blob.core.windows.net/container' --recursive`",
          "`azcopy copy 'https://account.blob.core.windows.net/container' './local' --overwrite=true`",
          "`azcopy download 'https://account.blob.core.windows.net/container' './local' --recursive`"
        ],
        "a": 0,
        "e": "`azcopy copy <source> <destination> --recursive` downloads all blobs from a container URL to a local path. Without `--recursive` a container/directory source isn't traversed, the argument order is always source then destination, and `download` is not a valid AzCopy v10 command."
      },
      {
        "id": "az-099",
        "d": 3,
        "t": "Compute",
        "q": "You need to scale out a set of identical VMs automatically based on CPU load and ensure zero downtime during OS updates. Which feature should you use?",
        "o": [
          "Availability Set with 3 fault domains",
          "VM Scale Set with rolling upgrade policy",
          "Zonal VMs behind a Standard Load Balancer",
          "VM Scale Set with Automatic upgrade policy"
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
          "Azure VM with Docker Engine",
          "Azure App Service for Containers (Linux)"
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
          "Store the SQL password as a slot-sticky connection string",
          "Enable a managed identity and use Azure AD auth to SQL",
          "Use a service principal with a certificate in Blob Storage",
          "Use SQL authentication with an encrypted `web.config` section"
        ],
        "a": 1,
        "e": "With a system-assigned managed identity, the App Service gets an Azure AD identity automatically. Creating a contained database user for that identity and using Azure AD authentication to SQL eliminates the need to store or rotate any credentials."
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
          "Shared (D1) with a custom domain",
          "Basic (B3) scaled to 3 instances",
          "Standard (S1) or higher",
          "Isolated v2 (I1v2) only"
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
          "Configure a Horizontal Pod Autoscaler on the deployment",
          "Enable the cluster autoscaler on the node pool",
          "Increase the pods' CPU limits in the deployment spec",
          "Enable the Vertical Pod Autoscaler on the workload"
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
          "Spread VMs across fault domains within a datacenter",
          "Co-locate VMs physically to minimize inter-VM latency",
          "Distribute VMs across availability zones automatically",
          "Reserve VM capacity in a specific region or zone"
        ],
        "a": 1,
        "e": "Proximity Placement Groups (PPG) co-locate VMs physically close together within a single datacenter, minimizing network latency between them — critical for tightly coupled HPC, SAP HANA, or latency-sensitive workloads."
      },
      {
        "id": "az-108",
        "d": 3,
        "t": "Compute",
        "q": "A VM uses Spot pricing. Azure sends a 30-second eviction notice. What should your architecture account for?",
        "o": [
          "Azure live-migrates Spot VMs to other hosts before eviction",
          "Workloads must tolerate interruption and checkpoint state",
          "Setting max price to -1 prevents eviction for capacity",
          "Spot VMs in an Availability Set are protected from eviction"
        ],
        "a": 1,
        "e": "Spot VMs can be evicted with 30 seconds notice when Azure needs capacity (even with max price -1, which only prevents price-based eviction). Workloads must be interruption-tolerant: stateless, checkpointing, or storing state externally — suitable for batch jobs, CI/CD agents, dev/test."
      },
      {
        "id": "az-109",
        "d": 3,
        "t": "Compute",
        "q": "Which VM extension enables automatic patching and collects patch compliance data for Azure VMs?",
        "o": [
          "Azure Monitor Agent with a data collection rule",
          "Azure Automation Update Management with MMA",
          "Azure Update Manager with periodic assessment",
          "Azure Automation State Configuration (DSC)"
        ],
        "a": 2,
        "e": "Azure Update Manager (using the VM extension framework, with periodic assessment and automatic/scheduled patching) assesses patch compliance and installs updates on Azure VMs — replacing the older Update Management solution in Azure Automation that relied on the Log Analytics (MMA) agent."
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
          "Azure Bastion browser-based RDP session",
          "Serial Console with Boot Diagnostics",
          "Network Watcher connection troubleshoot",
          "VM Run Command via `az vm run-command`"
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
          "Azure Firewall Standard with application rules",
          "NSG with service tag rules on port 443",
          "Application Gateway with a WAF policy",
          "DDoS Network Protection on the VNet"
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
          "Load Balancer is layer 4; Application Gateway is layer 7 (HTTP)",
          "Load Balancer terminates TLS; Application Gateway passes it through",
          "Load Balancer integrates WAF; Application Gateway does not"
        ],
        "a": 1,
        "e": "Azure Load Balancer distributes traffic at layer 4 (TCP/UDP, port/protocol). Application Gateway routes at layer 7 (HTTP/HTTPS), enabling URL-based routing, session affinity, TLS termination, and WAF."
      },
      {
        "id": "az-114",
        "d": 4,
        "t": "Networking",
        "q": "Users across three continents need to be routed to the nearest healthy application endpoint. Which Azure service provides latency-based global routing with health monitoring?",
        "o": [
          "Azure Load Balancer Standard",
          "Azure Application Gateway v2",
          "Azure Traffic Manager",
          "Azure DNS with alias records"
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
          "Traffic is denied because deny rules override allow rules",
          "Traffic is denied because the last matching rule wins",
          "Traffic is allowed because priority 100 is evaluated first",
          "Traffic is denied by the default `DenyAllInBound` rule"
        ],
        "a": 2,
        "e": "NSG rules are processed in order from lowest to highest priority number, and processing stops at the first match. Priority 100 is evaluated before priority 200, so the allow rule at 100 matches first and HTTP traffic is allowed."
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
          "NSG outbound rule denying the `Internet` service tag",
          "NAT Gateway associated with the VM subnets",
          "UDR sending 0.0.0.0/0 to the on-premises firewall",
          "Azure Firewall with DNAT rules for outbound traffic"
        ],
        "a": 2,
        "e": "Forced tunneling redirects all internet-bound VM traffic through the on-premises network for inspection. It is implemented with a default route (0.0.0.0/0) pointing to on-premises — a UDR toward the on-premises NVA/gateway, or (common with ExpressRoute) a 0.0.0.0/0 route advertised from on-premises over BGP."
      },
      {
        "id": "az-119",
        "d": 4,
        "t": "Networking",
        "q": "Which Azure tool captures and analyzes VM network traffic flows, and can detect security anomalies using traffic analytics?",
        "o": [
          "Azure Monitor VM insights Map",
          "Azure Firewall diagnostic logs",
          "Network Watcher NSG flow logs",
          "Network Watcher packet capture"
        ],
        "a": 2,
        "e": "Network Watcher's NSG flow logs (now evolving into VNet flow logs) capture source/destination IP, port, protocol, and allow/deny decisions. Combined with Traffic Analytics (Log Analytics), it visualizes patterns and flags anomalies."
      },
      {
        "id": "az-120",
        "d": 4,
        "t": "Networking",
        "q": "You need to resolve Azure private DNS zone hostnames from an on-premises network connected via ExpressRoute. What must you configure?",
        "o": [
          "Public DNS delegation for the private zone",
          "On-premises conditional forwarder to 168.63.129.16",
          "Azure DNS Private Resolver with an inbound endpoint",
          "ExpressRoute route filter allowing DNS traffic"
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
          "Only the subnet NSG applies; the NIC NSG is ignored",
          "Only the NIC NSG applies because it is more specific",
          "Both are evaluated; traffic must be allowed by both",
          "Rules from both NSGs are merged and sorted by priority"
        ],
        "a": 2,
        "e": "When NSGs are on both the subnet and NIC, they are evaluated independently: inbound traffic is evaluated against the subnet NSG first, then the NIC NSG — traffic must be allowed by both. Outbound traffic is evaluated in reverse order (NIC first, then subnet)."
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
          "Restore the VM from an incremental disk snapshot",
          "Restore the 3-day-old recovery point from the vault",
          "Redeploy the VM from its exported ARM template",
          "Fail over to an earlier Azure Site Recovery point"
        ],
        "a": 1,
        "e": "Azure Backup stores recovery points in a Recovery Services vault. You select the desired recovery point (3 days ago) and restore to a new VM, restore disks, or replace the existing VM's disks — this is the standard restore path."
      },
      {
        "id": "az-127",
        "d": 5,
        "t": "Monitor & Backup",
        "q": "What is the difference between RPO and RTO in disaster recovery planning?",
        "o": [
          "RPO is the maximum downtime; RTO is the maximum data loss",
          "RPO is the maximum data loss; RTO is the maximum downtime",
          "RPO is the backup frequency; RTO is the backup retention",
          "RPO is data loss in GB; RTO is the time to restore data"
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
          "ASR automatically fails over and starts the VM in Azure",
          "Run a test failover first, then a planned failover from the vault",
          "Restore the latest Azure Backup recovery point to Azure",
          "Trigger an unplanned failover from the Recovery Services vault"
        ],
        "a": 3,
        "e": "ASR continuously replicates the VM to Azure. On primary site failure, you trigger an (unplanned) failover from the Recovery Services vault, or automate it via recovery plans — ASR brings the VM online in Azure using the latest replicated (or app-consistent) recovery point."
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
          "No — CanNotDelete blocks all write operations, including tags",
          "Yes — CanNotDelete blocks deletion but allows modifications",
          "Only users with the Owner role can modify locked resources",
          "No — tag updates are treated as delete-and-recreate operations"
        ],
        "a": 1,
        "e": "CanNotDelete lock only prevents deletion. Read and write operations (including tag updates, configuration changes) are still permitted on resources within the locked scope — only ReadOnly locks block modifications."
      }
    ],
    why: {
      "az-001": [
        "`User Administrator` solo gestiona usuarios y grupos básicos, no puede administrar otros roles de directorio ni servicios globales de Microsoft.",
        null,
        "`Privileged Role Administrator` administra asignaciones de roles de Azure AD y PIM, pero no otorga control operativo total sobre todos los servicios de Microsoft 365.",
        "`Security Administrator` lee directivas y gestiona alertas de seguridad, pero no tiene permisos totales de administración de directorio ni asignación de recursos."
      ],
      "az-002": [
        "`Owner` incluye la acción `Microsoft.Authorization/*`, lo que permitiría al usuario otorgar y modificar permisos RBAC a otros usuarios.",
        null,
        "`Reader` únicamente permite ver recursos existentes; no permite crearlos, configurarlos ni eliminarlos.",
        "`User Access Administrator` está diseñado exclusivamente para gestionar asignaciones de roles y permisos RBAC, sin capacidad de administrar recursos de cómputo o almacenamiento."
      ],
      "az-003": [
        "Asignar políticas suscripción por suscripción genera sobrecarga administrativa y riesgo de desalineación ante nuevas suscripciones.",
        null,
        "Aunque Blueprints puede empaquetar políticas, asignarlo suscripción por suscripción no aprovecha la herencia automática de gobernanza.",
        "Los Resource Groups no pueden abarcar múltiples suscripciones ni heredan políticas hacia otras suscripciones."
      ],
      "az-004": [
        "Azure RBAC se basa en un modelo \"allow\" por defecto; las \"Deny assignments\" las gestiona Azure (p. ej. Blueprints) y no sirven para filtrar ubicaciones.",
        null,
        "Los Resource Locks de tipo \"ReadOnly\" impiden cualquier modificación o creación, no permiten restringir selectivamente por región.",
        "Azure Service Health es un servicio de notificación sobre incidentes y mantenimiento de la plataforma, no un motor de control o cumplimiento."
      ],
      "az-005": [
        "Asignar el rol `Reader` impediría que los administradores gestionen o modifiquen los recursos en producción cuando sea necesario.",
        "Una directiva de Azure Policy con efecto `Audit` solo reporta el estado de cumplimiento en un informe; no bloquea la acción de borrado.",
        null,
        "Los Resource Groups no tienen una propiedad nativa de `soft delete` para recuperar grupos enteros eliminados por error."
      ],
      "az-006": [
        "`MFA Server` es una solución heredada local (en desuso) que no ofrece directivas contextuales basadas en la nube.",
        null,
        "`Identity Protection` detecta riesgos de usuario y de inicio de sesión, pero las reglas condicionales de acceso por ubicación se configuran mediante Conditional Access.",
        "`Privileged Identity Management (PIM)` gestiona la activación puntual y temporal de roles privilegiados, no el desafío de MFA según red de origen."
      ],
      "az-007": [
        "Un bloqueo `ReadOnly` impide modificar o eliminar recursos en el plano de control, pero no oculta su visibilidad ni bloquea la lectura.",
        "Las `Deny assignments` suelen bloquear acciones de modificación/despliegue creadas por Blueprints; la lectura básica de recursos rara vez se deniega.",
        null,
        "Azure Policy evalúa cumplimiento y audita o bloquea despliegues, pero no oculta recursos existentes en el portal ni en la API."
      ],
      "az-008": [
        "La jerarquía en Azure fluye de arriba hacia abajo (de mayor a menor ámbito), no desde el recurso individual hacia los grupos de administración.",
        null,
        "Las suscripciones están contenidas dentro de Management Groups, por lo que el ámbito superior de herencia es Management Group, no Subscription.",
        "Los recursos están contenidos dentro de un Resource Group; la herencia nunca fluye desde un hijo hacia el padre."
      ],
      "az-009": [
        "La rotación de contraseñas y SSPR son funciones de administración de contraseñas de Azure AD, no de PIM.",
        null,
        "La sincronización de identidades y contraseñas híbridas la realiza Azure AD Connect (ahora Entra Connect), no PIM.",
        "La detección de credenciales filtradas y riesgos de inicio de sesión es función de Azure AD Identity Protection."
      ],
      "az-010": [
        "`Deny` bloquea inmediatamente la creación o actualización del recurso no conforme, en lugar de corregirlo agregando el tag.",
        "`Audit` únicamente registra una advertencia en el panel de cumplimiento; no agrega ni modifica ninguna propiedad en el recurso.",
        "`Append` puede agregar campos a la solicitud durante la creación, pero para la gestión moderna de tags el efecto recomendado y específico es `Modify`.",
        null
      ],
      "az-011": [
        "`Azure AD Free` solo incluye autenticación básica y Security Defaults fijos; no permite crear directivas personalizadas de Conditional Access.",
        null,
        "`Azure AD Premium P2` admite directivas basadas en riesgo (Identity Protection), pero la licencia mínima requerida para Conditional Access estándar es P1.",
        "`Microsoft 365 Business Basic` incluye únicamente las funciones de Azure AD Free a menos que se adquiera un complemento o plan Premium."
      ],
      "az-012": [
        "Un bloqueo `ReadOnly` opera en el plano de control; no revoca claves de acceso existentes ni bloquea descargas de datos si ya se tiene autenticación.",
        "El bloqueo `ReadOnly` no diferencia entre crear y borrar objetos a nivel de datos; bloquea cambios en el plano de gestión del recurso.",
        null,
        "Con un bloqueo `ReadOnly`, cualquier modificación en el plano de control (incluyendo actualizar tags) queda totalmente denegada."
      ],
      "az-013": [
        "El efecto `Audit` no altera el estado de ejecución ni la conectividad de red de los recursos.",
        null,
        "La remediación automática requiere el efecto `DeployIfNotExists` o `Modify` junto con una tarea de remediación, no el efecto `Audit`.",
        "Azure Policy no mueve recursos de suscripción ni crea recursos de cuarentena."
      ],
      "az-014": [
        "El ámbito `Management Group` otorgaría permisos sobre todas las suscripciones y recursos contenidos bajo ese grupo, violando el mínimo privilegio.",
        "El ámbito `Subscription` otorgaría permisos sobre todos los grupos de recursos de la suscripción, no solo sobre el grupo especificado.",
        null,
        "Asignar permisos a nivel de VMs individuales no permitiría al usuario crear nuevas máquinas virtuales dentro del grupo de recursos."
      ],
      "az-015": [
        "La supervisión de incidentes y salud de la plataforma corresponde a Azure Monitor y Azure Service Health.",
        null,
        "La orquestación de recuperación ante desastres y conmutación por error entre regiones es tarea de Azure Site Recovery.",
        "El análisis de costos y la asignación presupuestaria son responsabilidad de Microsoft Cost Management."
      ],
      "az-016": [
        "`Azure Files` proporciona recursos compartidos SMB/NFS para sistemas de archivos montables, no un almacén masivo de objetos HTTP/HTTPS optimizado para web.",
        "`Azure Table Storage` es una base de datos NoSQL de clave-valor para entidades estructuradas, no para archivos binarios masivos de imágenes.",
        null,
        "`Azure Queue Storage` está diseñado para mensajería asíncrona entre servicios, no para almacenar archivos multimedia."
      ],
      "az-017": [
        "LRS no replica entre regiones pares; se limita a un único centro de datos. ZRS es el que distribuye entre tres zonas.",
        null,
        "LRS no tolera la caída de un centro de datos ni de una región completa; ZRS sí tolera la caída de un centro de datos al abarcar 3 zonas.",
        "LRS no replica hacia otro continente (eso sería GRS/GZRS); y ZRS está disponible tanto en almacenamiento estándar como premium."
      ],
      "az-018": [
        "Las claves de acceso de la cuenta de almacenamiento no admiten fechas de expiración automáticas ni limitación temporal nativa.",
        null,
        "El rol `Contributor` en una VM no otorga permisos de subida a Blob Storage y una entidad de servicio requiere mayor configuración de permisos que un SAS temporal para terceros.",
        "Las ACLs de Azure Data Lake Gen2 gestionan permisos de archivos y carpetas, pero no admiten expiración temporal de 48 horas sin credenciales."
      ],
      "az-019": [
        "El nivel `Hot` tiene los costos de almacenamiento más altos, optimizado para datos en acceso frecuente.",
        "El nivel `Cool` está optimizado para datos almacenados al menos 30 días con acceso infrecuente mensual, resultando más costoso por GB almacenado que Archive.",
        "El nivel `Cold` requiere retención mínima de 90 días, pero su costo por GB almacenado es significativamente mayor que Archive para acceso anual.",
        null
      ],
      "az-020": [
        "Aunque Blob Storage admite NFS v3, no ofrece un recurso compartido de archivos SMB nativo para Windows Server al mismo tiempo.",
        null,
        "Los Shared Disks de Azure Managed Disks proporcionan discos de bloque para clusters de conmutación por error (como WSFC o Pacemaker), no recursos compartidos de archivos multi-protocolo.",
        "Azure Table Storage es un almacén de claves-atributos NoSQL no estructurado, no un sistema de archivos para montaje de SO."
      ],
      "az-021": [
        "Soft delete retiene el blob durante el período configurado (14 días en este caso), no se purga a las 24 horas.",
        null,
        "El blob eliminado pasa a estado soft-deleted en el mismo nivel de acceso; no se traslada al nivel Archive ni requiere rehidratación.",
        "El blob se recupera ejecutando una operación `Undelete` directamente en el storage account, sin depender de copias en Recovery Services vault."
      ],
      "az-022": [
        "Las cuentas de tipo heredado `BlobStorage` no admiten la activación de espacio de nombres jerárquico (HNS).",
        "Las cuentas GPv1 no admiten Azure Data Lake Storage Gen2 ni características avanzadas de espacio jerárquico.",
        null,
        "FileStorage es una cuenta optimizada exclusivamente para Azure Files premium (SMB/NFS), no para ADLS Gen2."
      ],
      "az-023": [
        "Transferir 200 TB a través de una conexión compartida de 100 Mbps tardaría más de 6 meses y saturaría el enlace corporativo.",
        "Azure Data Factory con self-hosted IR sigue dependiendo del ancho de banda de red disponible, con los mismos tiempos inviables de transferencia.",
        null,
        "Storage Explorer también transmite los datos sobre la conexión a internet, sufriendo las mismas limitaciones de ancho de banda."
      ],
      "az-024": [
        "La replicación entre cuentas de almacenamiento se realiza con Object Replication, no mediante políticas de ciclo de vida.",
        null,
        "La monitorización de métricas y alertas de capacidad se configura a través de Azure Monitor y Métricas de almacenamiento.",
        "La conmutación por error entre extremos primarios y secundarios la gestiona la redundancia geográfica (Customer-managed failover), no el ciclo de vida."
      ],
      "az-025": [
        "Asignar una IP pública a la VM para permitir acceso público viola el requerimiento de seguridad de mantener el acceso privado y restringido.",
        "Abrir el puerto 445 en el NSG no soluciona el bloqueo del firewall del storage account a nivel de plano de red de Azure.",
        null,
        "No se requiere una Virtual Network Gateway para conectar una VM a un servicio PaaS en la misma red virtual; basta con Service Endpoints o Private Endpoints."
      ],
      "az-026": [
        "ZRS distribuye datos entre tres zonas de disponibilidad dentro de la misma región, pero no protege ante la caída de la región completa.",
        "GRS replica a una región secundaria par, pero en la región primaria solo utiliza replicación local (LRS), no entre zonas.",
        null,
        "LRS mantiene 3 copias dentro de un único centro de datos en una sola región, sin protección ante fallos de zona ni de región."
      ],
      "az-027": [
        "Abrir un ticket de soporte introduce demoras críticas mientras la clave filtrada continúa expuesta y utilizable por terceros.",
        null,
        "Bloquear el firewall puede mitigar accesos de red, pero no invalida la credencial comprometida; la rotación inmediata de la clave es indispensable.",
        "Modificar el nivel de replicación no afecta los mecanismos de autenticación ni revoca las claves de acceso filtradas."
      ],
      "az-028": [
        "AzCopy is a command-line utility optimized for Azure Storage transfers with support for parallel transfers, job journaling (resume), and SAS tokens.",
        null,
        "AzCopy is a command-line utility optimized for Azure Storage transfers with support for parallel transfers, job journaling (resume), and SAS tokens.",
        "AzCopy is a command-line utility optimized for Azure Storage transfers with support for parallel transfers, job journaling (resume), and SAS tokens."
      ],
      "az-029": [
        "Las `Availability Zones` separan VMs en centros de datos distintos dentro de una región, pero para distribuir dos VMs entre update domains en un único centro de datos se usa un Availability Set.",
        null,
        "`Azure Site Recovery` es una solución de replicación y conmutación por error ante desastres entre regiones, no un mecanismo de alta disponibilidad local durante mantenimiento.",
        "`VM Scale Sets` despliegan y escalan grupos homogéneos de VMs; para dos VMs existentes individuales el mecanismo estándar es un Availability Set."
      ],
      "az-030": [
        null,
        "Los Availability Sets no admiten escalado automático horizontal; solo distribuyen VMs preexistentes entre dominios de error y actualización.",
        "Las instancias de un VMSS se basan en una plantilla común idéntica, mientras que en un Availability Set se pueden agrupar VMs con configuraciones y SO distintos.",
        "Ni VMSS ni Availability Sets abarcan múltiples regiones de Azure de forma automática; ambos son construcciones regionales."
      ],
      "az-031": [
        "Ejecutar una VM completa para un trabajo por lotes efímero requiere aprovisionar y mantener la infraestructura del SO subyacente.",
        "AKS requiere administrar un cluster y grupos de nodos, lo que introduce una sobrecarga operativa innecesaria para un job que corre una sola vez.",
        null,
        "App Service requiere aprovisionar y mantener un App Service Plan activo, generando costos continuos de cómputo aunque el contenedor no esté ejecutándose."
      ],
      "az-032": [
        "`Azure Virtual Machines` es IaaS y requiere administrar parches del sistema operativo, escalado manual y balanceadores sin slots nativos.",
        null,
        "`Azure Container Instances` ejecuta contenedores individuales sin estado, pero no incluye slots de implementación ni balanceo PaaS integrado para web.",
        "`Azure VM Scale Sets` requiere configurar y administrar las imágenes y el mantenimiento de las instancias de máquinas virtuales."
      ],
      "az-033": [
        "Una `VPN Gateway` requiere configurar túneles, certificados o clientes VPN en cada puesto de trabajo, lo cual es más complejo que Bastion en el portal.",
        null,
        "`JIT VM Access` abre el puerto 3389 temporalmente en la IP pública de la VM, por lo que el puerto sí queda expuesto durante la ventana activa.",
        "Permitir el puerto 3389 desde una IP específica sigue exponiendo el protocolo RDP directamente a internet en la IP pública de la máquina."
      ],
      "az-034": [
        "Los `imagePullSecrets` almacenan credenciales dentro de secretos de Kubernetes, lo cual incumple el requisito explícito de no almacenar secretos.",
        "Habilitar acceso anónimo expone el registro privado públicamente a internet sin autenticación, violando las políticas de seguridad corporativas.",
        null,
        "Los ConfigMaps no están diseñados para almacenar credenciales confidenciales y los tokens de administrador quedarían expuestos en texto claro dentro del cluster."
      ],
      "az-035": [
        "La instalación del agente de Azure Monitor se gestiona mediante la Azure Monitor Agent VM Extension, no Custom Script Extension.",
        null,
        "Las instantáneas y copias de seguridad de discos administrados se gestionan mediante Azure Backup y directivas de instantáneas, no Custom Script Extension.",
        "El cambio de tamaño de discos se realiza a nivel del recurso de disco en ARM o el portal, no mediante scripts del agente de extensión."
      ],
      "az-036": [
        "`Standard HDD` utiliza medios magnéticos convencionales con la latencia más alta y el menor rendimiento de IOPS.",
        "`Standard SSD` es adecuado para cargas de trabajo ligeras de desarrollo o servidores web con tráfico moderado, no para bases de datos críticas.",
        "`Premium SSD` ofrece alto rendimiento basado en SSD, pero sus IOPS y latencia están por debajo de las capacidades de sub-milisegundo de Ultra Disk.",
        null
      ],
      "az-037": [
        "Desasignar la máquina virtual mantiene el recurso de VM activo en la suscripción, en lugar de desmantelarlo (decommission).",
        null,
        "Eliminar el disco administrado tras tomar una instantánea destruye el disco existente; requeriría crear un disco nuevo desde el snapshot más adelante.",
        "Mover la VM a otro grupo de recursos no desmantela la VM existente ni libera el objeto de cómputo."
      ],
      "az-038": [
        "Distribuir máquinas virtuales entre regiones se gestiona con Azure Traffic Manager, Front Door o arquitecturas multi-región, lo opuesto a la proximidad física.",
        null,
        "La agrupación lógica de interfaces de red para reglas de filtrado se realiza con Application Security Groups (ASGs), no PPGs.",
        "La distribución entre zonas de disponibilidad dispersa físicamente las VMs para tolerancia a fallos; un PPG busca cercanía física para reducir latencia."
      ],
      "az-039": [
        "Configurar manualmente cada VM en el portal es propenso a errores humanos, no es versionable ni escalable.",
        null,
        "`Azure Migrate` está orientado a la migración desde entornos locales hacia Azure, no al despliegue repetible de infraestructura como código.",
        "`Azure Site Recovery` replica máquinas virtuales para recuperación ante desastres, no para aprovisionar plantillas idénticas en múltiples regiones."
      ],
      "az-040": [
        null,
        "No es posible desasociar (detach) el disco del sistema operativo de una máquina virtual mientras la VM existe.",
        "Clonar datos manualmente a un nuevo disco administrado no es el método oficial ni soportado para expandir el disco del sistema operativo.",
        "Agregar discos de datos y configurar striping amplía el almacenamiento de datos secundarios, pero no resuelve la falta de espacio en la partición del sistema operativo."
      ],
      "az-041": [
        "Las Spot VMs no ofrecen SLA de disponibilidad y pueden ser desalojadas en cualquier momento con solo 30 segundos de aviso previo.",
        null,
        "Las bases de datos relacionales críticas no toleran desalojos repentinos del hardware sin riesgo de indisponibilidad del servicio.",
        "Los controladores de dominio requieren alta disponibilidad continua y disponibilidad determinista, inadecuados para instancias desalojables."
      ],
      "az-042": [
        "Mantener el sistema operativo pausado corresponde al estado `Stopped` (desde dentro del SO), en el cual el hardware sigue asignado y Azure continúa facturando el cómputo.",
        null,
        "En estado `Deallocated` no hay descuento parcial de cómputo; el costo de cómputo (vCPU y RAM) es exactamente cero ($0), cobrándose únicamente discos e IPs públicas fijas.",
        "El mantenimiento de la plataforma Azure no coloca las máquinas en estado desasignado facturable con descuento."
      ],
      "az-043": [
        "Kubernetes auto-administrado sobre VMs requiere que el usuario instale, configure, parchee y mantenga manualmente los nodos de control plane y etcd.",
        "`Azure Container Instances` es un entorno serverless para ejecutar contenedores individuales o grupos de contenedores, no un orquestador completo con control plane expuesto.",
        null,
        "`Azure Red Hat OpenShift` es una plataforma administrada conjuntamente con Red Hat, pero en el contexto estándar de certificación AZ-104 el orquestador nativo gestionado por Microsoft es AKS."
      ],
      "az-044": [
        "Una conexión `Site-to-Site VPN` entre VNets requiere dos Virtual Network Gateways, introduce costos por hora de gateway y limita el ancho de banda.",
        null,
        "`ExpressRoute` requiere conectividad a través de un proveedor de telecomunicaciones externo para conectar redes on-premises, no para dos VNets en Azure.",
        "`Azure Relay` es un servicio de mensajería para comunicar servicios detrás de firewalls a nivel de aplicación, no un enlace de red entre VNets."
      ],
      "az-045": [
        "Los números de prioridad más bajos tienen mayor precedencia (p. ej. la regla 100 se procesa antes que la 200), no de mayor a menor número.",
        null,
        "El tipo de regla (Allow o Deny) no determina el orden de evaluación; el orden lo dicta estrictamente el número de prioridad.",
        "Las reglas personalizadas (prioridades 100 a 4096) siempre se evalúan antes que las reglas por defecto (prioridades 65000 a 65500)."
      ],
      "az-046": [
        "El comportamiento por defecto de un NSG no es permitir todo el tráfico entrante, sino denegarlo excepto el tráfico interno de la VNet y el Azure Load Balancer.",
        "Aunque existe una regla por defecto que permite la comunicación dentro de la VNet (AllowVNetInBound), la regla final de cierre por defecto que aplica al tráfico externo no emparejado es DenyAllInBound.",
        null,
        "Azure Network Watcher no captura paquetes por defecto a menos que se configure explícitamente una sesión de Packet Capture."
      ],
      "az-047": [
        "El emparejamiento de redes virtuales (VNet peering) es no transitivo; el tráfico no puede saltar a través de una VNet intermedia de forma nativa.",
        null,
        "`Allow Gateway Transit` permite a las VNets remotas utilizar una puerta de enlace VPN o ExpressRoute en la VNet hub, no habilita transitividad de enrutamiento general entre VNets.",
        "La ubicación geográfica de las VNets no altera la regla fundamental de no transitividad del peering."
      ],
      "az-048": [
        "Los NSGs filtran paquetes por IP y puerto (permitir o denegar), pero no pueden cambiar la ruta de salto siguiente (next hop) del tráfico.",
        null,
        "Las reglas de Azure Firewall filtran el tráfico una vez que llega al firewall, pero para redirigir el tráfico hacia el firewall o NVA es imprescindible una ruta UDR.",
        "Los Service Endpoints desvían el tráfico hacia servicios PaaS de Microsoft a través del backbone, no enrutan hacia un NVA ni gestionan tráfico general de internet."
      ],
      "az-049": [
        "La propagación de rutas BGP se usa con puertas de enlace ExpressRoute o VPN, no es un requisito para que un NVA reenvíe tráfico local UDR.",
        null,
        "El NVA puede salir a internet mediante NAT Gateway, Azure Firewall o una IP pública secundaria; una IP pública estándar directa no es el fallo obligatorio que bloquea el reenvío interno.",
        "Las reglas por defecto de NSG ya permiten todo el tráfico de salida (AllowInternetOutBound); lo que Azure bloquea por omisión en una NIC es recibir paquetes con una IP de destino ajena si falta `IP Forwarding`."
      ],
      "az-050": [
        "Azure Application Gateway is an L7 load balancer supporting URL path-based routing, SSL termination, session affinity, and optionally WAF (Web Application Firewall).",
        null,
        "Azure Application Gateway is an L7 load balancer supporting URL path-based routing, SSL termination, session affinity, and optionally WAF (Web Application Firewall).",
        "Azure Application Gateway is an L7 load balancer supporting URL path-based routing, SSL termination, session affinity, and optionally WAF (Web Application Firewall)."
      ],
      "az-051": [
        "Standard Load Balancer opera en capa 4 y, aunque existe Cross-region Load Balancer, no utiliza el método de enrutamiento basado en latencia de DNS (Performance routing).",
        "Application Gateway es un balanceador regional de capa 7; no distribuye tráfico DNS a nivel global basado en la latencia más baja de clientes dispersos.",
        null,
        "El método ponderado (weighted) reparte tráfico por porcentajes predefinidos, no por la menor latencia geográfica del cliente como pide el escenario."
      ],
      "az-052": [
        "Una VPN `Site-to-Site` cifra el tráfico mediante IPSec pero viaja a través del internet público, no sobre un circuito dedicado privado.",
        "Una conexión `Point-to-Site` es para conectar clientes individuales remotos sobre internet mediante VPN cliente, no para un enlace dedicado corporativo.",
        null,
        "El `VNet Peering` conecta redes virtuales dentro de Azure, no una red física local on-premises."
      ],
      "az-053": [
        "Traffic Manager es un servicio de balanceo global basado en DNS público para endpoints externos, no para resolución interna de nombres en una VNet.",
        null,
        "Las zonas públicas de DNS exigen exponer registros en servidores de nombres públicos de internet y no admiten autoregistro automático de VMs privadas.",
        "Desplegar un reenviador DNS en una VM requiere gestionar la infraestructura, parches y disponibilidad del servidor, violando el requisito de no desplegar servidores DNS dedicados."
      ],
      "az-054": [
        "Es al revés: los NSGs operan únicamente en capas 3 y 4 (IP, puerto, protocolo), mientras que Azure Firewall inspecciona capa 7 (FQDN, URLs, reglas de aplicación).",
        null,
        "Los NSGs no pueden descifrar ni inspeccionar el contenido de paquetes HTTPS a nivel de capa de aplicación; Azure Firewall Premium sí admite inspección TLS.",
        "Azure Firewall es un firewall de red centralizado totalmente administrado como PaaS, no un firewall basado en host."
      ],
      "az-055": [
        "Los `Diagnostic Settings` de las VMs recopilan registros del SO y métricas de rendimiento del host, no los flujos de paquetes IP del NSG.",
        null,
        "Los registros de `Azure Firewall` solo capturan el tráfico que atraviesa el firewall de Azure, no los paquetes que pasan por los NSGs de las subredes.",
        "Los conectores de `Microsoft Sentinel` ingieren eventos de seguridad ya recopilados; para registrar los flujos de red del NSG primero se requiere activar NSG Flow Logs."
      ],
      "az-056": [
        "Asignar IPs públicas directamente a las NICs expone la VM a internet, lo contrario al propósito de un Service Endpoint que busca aislar el tráfico.",
        null,
        "Los túneles VPN IPSec se establecen mediante Azure VPN Gateway, no a través de Service Endpoints.",
        "La distribución de tráfico entrante entre instancias se realiza con Azure Load Balancer o Application Gateway."
      ],
      "az-057": [
        "El cifrado en tránsito (TLS/HTTPS) lo implementa el propio servicio PaaS en ambos mecanismos; no es una exclusividad de Private Endpoint.",
        null,
        "Private Endpoint no elimina los costos de transferencia de datos; de hecho, cobra por gigabyte procesado tanto en entrada como en salida.",
        "La protección DDoS Network Protection es una funcionalidad de red a nivel de VNet, no una característica exclusiva que provea Private Endpoint frente a Service Endpoint."
      ],
      "az-058": [
        "El Load Balancer solo monitoriza la salud de red para tomar decisiones de enrutamiento; no tiene permisos ni capacidad para reiniciar máquinas virtuales.",
        null,
        "El Load Balancer no destruye ni aprovisiona máquinas virtuales de reemplazo; solo las marca como no saludables en su tabla de distribución.",
        "El balanceador deja de enviar nuevo tráfico inmediatamente a la instancia no saludable; no continúa enviando tráfico como si estuviera sana."
      ],
      "az-059": [
        "Azure Policy evalúa el estado de cumplimiento y configuración de recursos en el plano de control, no genera alertas en tiempo real sobre métricas de rendimiento como la CPU.",
        null,
        "Microsoft Defender for Cloud genera recomendaciones y alertas de seguridad ante amenazas, no alertas operativas de umbral de uso de CPU.",
        "El porcentaje de CPU es una métrica de plataforma recopilada de forma continua por Azure Monitor; usar una consulta de log de eventos no es el mecanismo directo ni estándar."
      ],
      "az-060": [
        "El almacenamiento de snapshots y puntos de recuperación de copias de seguridad es responsabilidad de Azure Backup y Recovery Services vaults.",
        null,
        "Los paneles de métricas en tiempo real utilizan Azure Monitor Metrics y Azure Dashboards, no requieren obligatoriamente Log Analytics ni son su función primaria.",
        "El archivado frío a largo plazo de bajo costo se realiza en Azure Blob Storage (nivel Archive), no en un espacio de trabajo de Log Analytics."
      ],
      "az-061": [
        "Es al revés: Site Recovery es el que orquesta la conmutación por error ante desastres entre regiones, mientras que Azure Backup gestiona copias puntuales.",
        null,
        "Azure Backup admite restauración granular de archivos y carpetas además de discos y VMs completas; Site Recovery está diseñado para replicación completa de máquinas y failover.",
        "Azure Backup trabaja con copias de seguridad programadas periódicas; es Azure Site Recovery el que mantiene replicación continua asíncrona para RPO cercano a cero."
      ],
      "az-062": [
        "El período de retención por defecto no es de 7 días sino de 90 días, y Azure Policy no cambia el almacenamiento interno del Activity Log.",
        "El período de retención por defecto no es de 30 días ni requiere adquirir un cluster dedicado de Log Analytics para extenderlo.",
        null,
        "El Activity Log solo almacena 90 días en la plataforma por defecto; los registros más antiguos de 90 días se purgan a menos que se exporten."
      ],
      "az-063": [
        "`Azure Advisor` ofrece recomendaciones de costos, seguridad y confiabilidad, pero no gráficos de rendimiento en tiempo real ni mapas de dependencias.",
        null,
        "`Application Insights` supervisa el código y rendimiento de aplicaciones web (APM), no la infraestructura y dependencias a nivel de VM del sistema operativo.",
        "`Azure Service Health` informa sobre el estado de la plataforma global de Azure y mantenimientos programados, no sobre métricas internas de VMs."
      ],
      "az-064": [
        "La supervisión de métricas del sistema operativo invitado (CPU, memoria, disco) se realiza mediante Azure Monitor Metrics y VM Insights.",
        null,
        "La creación de reglas de alertas y remediaciones automatizadas se configura en Azure Monitor Alerts y Action Groups.",
        "La asignación de permisos y control de acceso RBAC se administra mediante Azure RBAC en el plano de control, no a través de Service Health."
      ],
      "az-065": [
        "La organización de recursos para asignación de políticas de gobernanza se realiza mediante Management Groups y Resource Groups, no Action Groups.",
        null,
        "La agregación de métricas y visualización personalizada se realiza mediante Azure Workbooks y Azure Dashboards.",
        "El control de acceso a los destinos de exportación de datos se gestiona mediante Azure RBAC y directivas de red, no con Action Groups."
      ],
      "az-066": [
        "T-SQL se usa en Azure SQL Database; Log Analytics no acepta T-SQL sino KQL.",
        "PromQL se usa contra un Azure Monitor workspace (managed Prometheus), no contra un Log Analytics workspace.",
        null,
        "OData `$filter` sirve para filtrar llamadas REST (p. ej. Activity Log API), no para consultar tablas de Log Analytics."
      ],
      "az-067": [
        "Snapshots programados con un runbook no dan consistencia de aplicación multi-disco ni gestión de retención; es una solución casera, no el servicio de backup.",
        "Site Recovery es replicación para DR (failover), no backup; su retención de puntos de recuperación es de pocos días (máx. 15), no 30.",
        null,
        "GRS + soft delete protege blobs ante borrado o desastre regional, pero no genera puntos de restauración programados y consistentes de la VM."
      ],
      "az-068": [
        "VM insights muestra rendimiento y dependencias de las VMs, pero no genera recomendaciones de ahorro sobre VMs infrautilizadas o discos sin adjuntar.",
        "Defender for Cloud da recomendaciones de seguridad (secure score), no de costo.",
        null,
        "Los budgets de Cost Management alertan cuando el gasto supera un umbral, pero no identifican recursos infrautilizados."
      ],
      "az-069": [
        "`Audit` únicamente registra una advertencia en los informes de cumplimiento de directivas; no despliega recursos ni agentes.",
        "`Deny` bloquea la creación o actualización de recursos no conformes, pero no puede instalar ni desplegar componentes faltantes.",
        "`Modify` permite agregar, actualizar o eliminar etiquetas y valores de recursos existentes, pero no ejecuta plantillas ARM para desplegar nuevos recursos o extensiones.",
        null
      ],
      "az-070": [
        "Boot Diagnostics sirve para problemas de arranque del SO; no muestra el código de error del job de backup.",
        "El Activity Log registra operaciones de control plane, pero no el detalle ni los códigos de error del job de backup.",
        null,
        "Esa tabla solo existe si antes configuraste diagnostic settings hacia Log Analytics; no es el primer lugar donde mirar."
      ],
      "az-071": [
        null,
        "Las directivas de User risk en Identity Protection responden a cuentas comprometidas, pero no orquestan la experiencia de registro previo obligatorio de métodos MFA.",
        "El registro combinado es la interfaz moderna de autoservicio que unifica SSPR y MFA, pero la directiva que exige y obliga a pasar por ese flujo es Conditional Access.",
        "Azure AD Password Protection valida la fortaleza de las contraseñas contra listas prohibidas globales y personalizadas, no gestiona métodos ni registros de MFA."
      ],
      "az-072": [
        "Conditional Access controla condiciones de inicio de sesión, pero no ofrece activación just-in-time de roles con aprobación y duración limitada.",
        null,
        "Las access reviews revisan periódicamente quién tiene acceso, pero no conceden el rol just-in-time con aprobación.",
        "Las administrative units limitan el alcance de roles administrativos, pero la asignación sigue siendo permanente, no JIT."
      ],
      "az-073": [
        null,
        "Los registros de inicio de sesión de Azure AD muestran el fallo de autenticación en la nube, pero no revelan el estado ni los errores del motor de sincronización de contraseñas.",
        "ADUC solo muestra el objeto local en el controlador de dominio, pero no proporciona visibilidad sobre la sincronización de hashes hacia Azure AD.",
        "Los logs del proxy de Password Protection auditan validaciones de directivas de contraseñas locales, no el estado del agente de sincronización de Azure AD Connect."
      ],
      "az-074": [
        "`DoNotEnforce` desactiva el efecto de la asignación en toda la suscripción, no solo en el resource group.",
        "Cambiar el efecto a `Audit` deja de bloquear despliegues en todos los scopes de la asignación, no solo en un resource group.",
        null,
        "Un rol RBAC no exime de Azure Policy; la política sigue aplicando con cualquier permiso que tenga el usuario."
      ],
      "az-075": [
        "`Append` añade campos o propiedades específicas al manifiesto del recurso durante el despliegue, pero no crea un nuevo recurso hijo o relacionado.",
        "`Audit` genera un registro de no cumplimiento en la consola de directivas, sin realizar ninguna acción de creación o corrección.",
        null,
        "`Modify` actualiza o reemplaza propiedades y etiquetas en el recurso evaluado, pero no ejecuta una plantilla ARM para crear un recurso independiente como Diagnostic Settings."
      ],
      "az-076": [
        "`Privileged Identity Management (PIM)` gestiona la activación temporal y gobernanza de roles privilegiados de Azure AD y Azure, no revisiones periódicas de miembros invitados en grupos o canales.",
        null,
        "`Entitlement Management` organiza paquetes de acceso y flujos de solicitud de recursos, pero la funcionalidad periódica y recurrente de certificación de acceso continuo es Access Reviews.",
        "`Conditional Access` impone controles de acceso en tiempo real durante el inicio de sesión (como MFA o dispositivos conformes), pero no realiza revisiones periódicas de membresías existentes."
      ],
      "az-077": [
        "Una cuenta de usuario de Azure AD puede pertenecer a su directorio de origen y a su vez ser invitado en otros directorios externos; no está limitada a 1.",
        "No existe un tope de 10 directorios; los usuarios pueden colaborar con múltiples organizaciones como miembros o invitados sin este límite.",
        "Azure AD no impone un límite rígido de 500 directorios por identidad de usuario para pertenencia o acceso B2B.",
        null
      ],
      "az-078": [
        "`Deny` bloquea la creación de recursos que no cumplan la condición, en lugar de agregar la etiqueta heredada automáticamente.",
        "`Append` puede agregar campos a la petición durante la creación, pero para agregar o modificar etiquetas heredadas el efecto específico y recomendado es `Modify`.",
        null,
        "`DeployIfNotExists` se utiliza para desplegar recursos dependientes o hijos completos mediante plantillas ARM, no para aplicar etiquetas en el propio recurso."
      ],
      "az-079": [
        "Funciona, pero requiere 10 asignaciones y no cubre suscripciones nuevas del departamento; no es lo más eficiente.",
        "Asignar en el root obliga a mantener exclusiones para los otros 4 departamentos y arriesga afectar a todo el tenant.",
        null,
        "Un blueprint por suscripción sigue siendo una asignación por suscripción, además Blueprints está en deprecación; el management group lo resuelve con una sola asignación."
      ],
      "az-080": [
        "`Owner` otorga control total sobre todos los recursos, incluyendo la capacidad de iniciar, detener y asignar roles a otros usuarios.",
        "`Contributor` permite realizar cualquier acción de administración sobre recursos (incluyendo encender y apagar VMs), sin restringir operaciones de cómputo.",
        null,
        "`Virtual Machine Contributor` otorga los permisos necesarios para iniciar, apagar y gestionar máquinas virtuales; si tuviera este rol sí podría detenerlas."
      ],
      "az-081": [
        "Un client secret en app settings sigue siendo una credencial almacenada que hay que proteger y rotar.",
        null,
        "Un certificado de service principal sigue siendo una credencial que hay que cargar, renovar y rotar; la managed identity elimina esa gestión.",
        "Un service endpoint solo controla el acceso de red; la app sigue necesitando autenticarse ante Key Vault con alguna identidad."
      ],
      "az-082": [
        "`Azure AD Free` no admite directivas personalizadas de Conditional Access; únicamente permite habilitar Security Defaults predefinidos.",
        null,
        "`Azure AD P2` incluye funciones adicionales de Identity Protection basadas en riesgo, pero la licencia mínima base para Conditional Access es Azure AD P1.",
        "`Microsoft 365 E3` incluye la funcionalidad de Azure AD P1, pero el nivel de licencia de Azure AD requerido formalmente como estándar del servicio es Azure AD P1."
      ],
      "az-083": [
        "Conditional Access y named locations controlan desde dónde inicia sesión el usuario, no en qué región se despliegan los recursos.",
        null,
        "RBAC no puede restringir la región de despliegue; un resource group en East US puede contener recursos de cualquier región.",
        "Funciona, pero son 20 asignaciones; la pregunta pide la MEJOR acción única, que es asignar en el management group."
      ],
      "az-084": [
        "Está invertido: B2B es colaboración con partners y B2C es identidad de clientes/consumidores.",
        null,
        "B2B funciona con cualquier edición (facturación MAU) y B2C tiene su propio modelo de precios; no dependen de P1/P2 así.",
        "Está invertido: B2C usa un tenant separado (Azure AD B2C tenant), mientras B2B agrega guests a tu tenant corporativo."
      ],
      "az-085": [
        "Los locks se evalúan por encima de RBAC; ningún rol, ni siquiera Owner, puede borrar mientras exista el lock.",
        null,
        "Haber creado el lock no da ninguna excepción; cualquiera debe eliminar el lock primero (requiere `Microsoft.Authorization/locks/delete`).",
        "Un lock en un resource group aplica al grupo y se hereda a todos sus recursos."
      ],
      "az-086": [
        "El versionado de blobs guarda versiones históricas anteriores de un blob ante modificaciones o sobrescrituras, pero no mueve niveles ni programa eliminaciones por antigüedad.",
        null,
        "La retención de `Azure Backup` protege puntos de recuperación de copias de seguridad de bóvedas, no administra el ciclo de vida de los datos de producción en el storage account.",
        "Las directivas de inmutabilidad (WORM) bloquean la modificación y borrado de blobs durante un período legal o de cumplimiento, no gestionan transiciones entre niveles ni purgas periódicas de costos."
      ],
      "az-087": [
        null,
        "GRS mantiene las 3 copias primarias en LRS (un solo datacenter); ante la caída de ese datacenter necesitas un geo-failover asíncrono con posible pérdida de datos.",
        "Premium LRS cambia el rendimiento (SSD), pero sigue replicando dentro de un único datacenter.",
        "RA-GRS añade lectura en la región secundaria, pero la región primaria sigue siendo LRS en un solo datacenter."
      ],
      "az-088": [
        "Permitir la IP pública de salida sigue enviando el tráfico por el endpoint público vía internet, no por la red troncal desde la subnet.",
        null,
        "Una storage account no vive en una VNet propia con la que puedas hacer peering.",
        "Microsoft peering de ExpressRoute es para tráfico desde on-premises, no para VMs que ya están en una VNet de Azure."
      ],
      "az-089": [
        "Una account SAS no admite stored access policies; para revocarla hay que regenerar la clave de la cuenta.",
        null,
        "Una user delegation SAS no admite stored access policies reutilizables; solo se revoca revocando las user delegation keys.",
        "Una SAS ad hoc lleva sus permisos embebidos en el token; no hay política reutilizable que modificar o borrar para revocarla."
      ],
      "az-090": [
        "La política de espacio libre se refiere al volumen local del servidor, no a una reserva de capacidad en el file share de Azure.",
        null,
        "La política no fija un porcentaje de archivos en caché; garantiza un porcentaje de espacio libre en el volumen.",
        "Está invertido: el tiering se activa cuando el espacio libre baja del 20%, no cuando el volumen está al 20% de uso."
      ],
      "az-091": [
        "Limitar el ancho de banda reduce el impacto instantáneo pero alarga la transferencia de 50 TB durante semanas por la red.",
        "Data Factory con self-hosted integration runtime sigue moviendo los 50 TB por la red.",
        null,
        "File Sync sincroniza los archivos a Azure Files por la red, no a Blob Storage, y no evita el consumo de ancho de banda."
      ],
      "az-092": [
        "Eso describe snapshots (o versioning), no soft delete.",
        null,
        "La replicación a la región secundaria es GRS/RA-GRS; también replicaría el borrado.",
        "Impedir borrado o sobreescritura durante un periodo es la inmutabilidad (WORM); soft delete permite borrar pero recuperar después."
      ],
      "az-093": [
        "Los snapshots pueden ser eliminados por quien tenga permisos y no impiden modificar el blob base.",
        "Azure Backup conserva copias, pero no impide que el blob original se modifique o borre.",
        null,
        "Soft delete tiene un máximo de 365 días y no impide borrar ni sobreescribir; solo permite recuperar."
      ],
      "az-094": [
        "Con el acceso de red público deshabilitado, las reglas de IP del firewall no se aplican: todo acceso por el endpoint público queda bloqueado.",
        null,
        "Los service endpoints usan el endpoint público de la cuenta; si el acceso público está deshabilitado, las reglas de VNet no tienen efecto.",
        "La excepción de servicios de confianza aplica a ciertos servicios de Azure (Backup, Event Grid, etc.), no a una aplicación propia."
      ],
      "az-095": [
        "`GRS` replica los datos a una región secundaria par, pero los datos en el extremo secundario no son legibles hasta que se produce una conmutación por error (failover).",
        null,
        "`ZRS` replica entre tres zonas dentro de la región primaria, pero no mantiene ninguna copia en una región secundaria.",
        "`GZRS` replica entre zonas locales y hacia una región secundaria, pero el acceso de lectura secundario continuo requiere activar la variante `RA-GZRS`."
      ],
      "az-096": [
        "Invitar un guest implica crear una cuenta en tu directorio, justo lo que el requisito prohíbe.",
        null,
        "El acceso anónimo expone el contenedor a cualquiera y no expira solo.",
        "La clave de cuenta da control total (no solo lectura) sobre toda la storage account; depender de rotarla manualmente es riesgoso."
      ],
      "az-097": [
        null,
        "Las cuentas Premium de archivos (`FileStorage` SSD) no admiten replicación geográfica (`GRS` ni `GZRS`); solo admiten redundancia local y zonal.",
        "Azure Files Premium admite tanto `LRS` como `ZRS` (en regiones donde ZRS está disponible), por lo que no está limitado exclusivamente a LRS.",
        "No se puede seleccionar cualquier opción; los niveles georredundantes estándar no están disponibles para recursos compartidos de archivos Premium."
      ],
      "az-098": [
        null,
        "El orden es origen y luego destino: este comando sube la carpeta local al contenedor, no descarga.",
        "Sin `--recursive`, AzCopy no copia el contenido de un contenedor/directorio como origen; `--overwrite` no cambia eso.",
        "`download` no es un subcomando de AzCopy v10; las descargas se hacen con `azcopy copy`."
      ],
      "az-099": [
        "Un Availability Set da tolerancia a fallos de hardware, pero no escala automáticamente según CPU.",
        null,
        "VMs zonales con load balancer dan alta disponibilidad, pero no autoescalado ni actualización orquestada por lotes.",
        "El modo Automatic actualiza todas las instancias a la vez en orden aleatorio, lo que puede causar downtime."
      ],
      "az-100": [
        "`Azure VPN Gateway` conecta redes enteras o dispositivos mediante túneles IPSec/P2S, requiriendo un cliente VPN en vez de acceso directo por navegador sin cliente.",
        null,
        "Una regla DNAT en `Azure Firewall` traduce el tráfico entrante de una IP pública, por lo que el puerto de acceso sigue expuesto a internet a través del firewall.",
        "`Just-in-time (JIT) VM access` abre dinámicamente puertos en el NSG y en la IP pública de la VM, requiriendo seguir exponiendo la IP y el puerto durante la sesión."
      ],
      "az-101": [
        "AKS requiere gestionar el cluster y sus node pools, que no escalan a cero el plano de nodos del sistema.",
        null,
        "Una VM con Docker requiere gestionar el SO y se factura mientras esté encendida.",
        "App Service cobra por el App Service plan aunque no haya tráfico; no escala a cero."
      ],
      "az-102": [
        "Una connection string en la configuración sigue almacenando la contraseña; solo cambia que no se intercambia en el swap.",
        null,
        "El certificado del service principal sigue siendo una credencial almacenada que hay que proteger y rotar.",
        "Cifrar la sección de `web.config` sigue guardando credenciales SQL en archivos de configuración."
      ],
      "az-103": [
        "`App Service Backup` realiza copias de seguridad periódicas del contenido del sitio y la base de datos, no proporciona entornos de preproducción para pruebas.",
        null,
        "`Azure Traffic Manager` es un balanceador DNS que distribuye peticiones externas entre endpoints públicos, no una función nativa de pre-calentamiento y swap de App Service.",
        "`Azure Front Door` gestiona enrutamiento global HTTP/HTTPS, pero no gestiona las configuraciones de swap en caliente ni el aislamiento de slots en el App Service Plan."
      ],
      "az-104": [
        "Shared admite dominios personalizados, pero no SSL de dominio propio, autoescalado ni slots.",
        "Basic permite escalar manualmente hasta 3 instancias y SSL, pero no autoescalado ni deployment slots.",
        null,
        "Isolated sí soporta todo, pero no es el único: Standard ya incluye autoescalado y slots."
      ],
      "az-105": [
        "HPA crea más pods, que también quedarían en Pending porque falta capacidad de nodos.",
        null,
        "El scheduler usa los requests, no los limits; subir limits no libera capacidad en los nodos.",
        "VPA ajusta requests/limits de los pods, pero no añade nodos; los pods seguirían sin caber."
      ],
      "az-106": [
        "Azure Batch is purpose-built for large-scale parallel and HPC workloads — it provisions, manages, and scales pools of compute nodes, distributes tasks, and tears down automatically after completion.",
        null,
        "Azure Batch is purpose-built for large-scale parallel and HPC workloads — it provisions, manages, and scales pools of compute nodes, distributes tasks, and tears down automatically after completion.",
        "Azure Batch is purpose-built for large-scale parallel and HPC workloads — it provisions, manages, and scales pools of compute nodes, distributes tasks, and tears down automatically after completion."
      ],
      "az-107": [
        "Repartir VMs en fault domains es lo que hace un Availability Set, con el objetivo opuesto (resiliencia, no cercanía).",
        null,
        "Repartir entre zonas aumenta la distancia y la latencia; es lo contrario a un PPG.",
        "Reservar capacidad es On-demand Capacity Reservation, no Proximity Placement Groups."
      ],
      "az-108": [
        "Las Spot VMs no se migran en vivo al ser desalojadas; se detienen (deallocate) o eliminan según la eviction policy.",
        null,
        "Max price `-1` solo evita el desalojo por precio; Azure puede seguir desalojando por falta de capacidad.",
        "Pertenecer a un Availability Set (o zona) no protege una Spot VM del desalojo."
      ],
      "az-109": [
        "AMA con DCR recolecta logs y métricas, pero no evalúa ni instala parches.",
        "Update Management de Automation dependía del agente MMA y fue retirado (agosto 2024); su reemplazo es Azure Update Manager.",
        null,
        "State Configuration (DSC) gestiona configuración deseada, no evaluación ni instalación automática de parches."
      ],
      "az-110": [
        "AKS provides full Kubernetes orchestration including persistent volumes, service discovery, ingress, horizontal pod autoscaling, and namespace isolation — the right choice for complex multi-container workloads.",
        null,
        "AKS provides full Kubernetes orchestration including persistent volumes, service discovery, ingress, horizontal pod autoscaling, and namespace isolation — the right choice for complex multi-container workloads.",
        "AKS provides full Kubernetes orchestration including persistent volumes, service discovery, ingress, horizontal pod autoscaling, and namespace isolation — the right choice for complex multi-container workloads."
      ],
      "az-111": [
        "Bastion sigue usando RDP/SSH por la red hacia la VM; si la VM no responde a RDP, Bastion tampoco conectará.",
        null,
        "Connection troubleshoot diagnostica conectividad, pero no muestra la pantalla de arranque ni da acceso a consola.",
        "Run Command depende del VM agent en un SO funcionando y no muestra la pantalla de arranque."
      ],
      "az-112": [
        "Las application rules de Azure Firewall Standard filtran por FQDN, pero no inspeccionan el payload HTTP en busca de SQL injection o XSS.",
        "Un NSG filtra en capa 3-4 (IP/puerto) y no entiende el contenido HTTP.",
        null,
        "DDoS Protection mitiga ataques volumétricos de red, no ataques de aplicación como SQL injection o XSS."
      ],
      "az-113": [
        "Ambos son servicios regionales; el balanceo global corresponde a Front Door, Traffic Manager o el cross-region Load Balancer.",
        null,
        "Está invertido: Load Balancer no termina TLS (capa 4); Application Gateway sí hace TLS termination.",
        "Está invertido: el WAF se integra con Application Gateway (y Front Door), no con Load Balancer."
      ],
      "az-114": [
        "Load Balancer Standard es regional (capa 4); no enruta usuarios entre continentes por latencia.",
        "Application Gateway es un balanceador regional de capa 7; no hace enrutamiento global por latencia.",
        null,
        "Los alias records de Azure DNS apuntan a recursos de Azure, pero no hacen enrutamiento por latencia ni health probes."
      ],
      "az-115": [
        "En NSG no hay precedencia de deny sobre allow; manda el número de prioridad más bajo que coincida.",
        "El procesamiento se detiene en la primera coincidencia (prioridad más baja); no gana la última.",
        null,
        "Las reglas por defecto (prioridad 65500) solo se evalúan si ninguna regla anterior coincide; aquí la regla 100 ya coincide."
      ],
      "az-116": [
        "Una conexión `VPN Gateway` requiere aprovisionar y pagar puertas de enlace de red virtual en ambas regiones, además de configurar túneles y tablas de rutas.",
        "`ExpressRoute` requiere contratar un circuito dedicado privado con un proveedor de conectividad externo, con alta complejidad de aprovisionamiento.",
        null,
        "`Azure Virtual WAN` es una arquitectura de conectividad a gran escala que requiere aprovisionar hubs virtuales, conexiones y gateways."
      ],
      "az-117": [
        "Los `Service Endpoints` mantienen la dirección IP pública del servicio PaaS como destino en el backbone, por lo que el recurso sigue teniendo un extremo público visible.",
        null,
        "`VNet Integration` permite a una aplicación web de App Service emitir tráfico hacia una VNet, no asigna una IP privada de la VNet a un recurso PaaS receptor.",
        "Los `Network Security Groups` son reglas de filtrado de paquetes de red de nivel 3/4; no proporcionan interfaces ni direcciones IP privadas para servicios PaaS."
      ],
      "az-118": [
        "Un NSG solo permite o bloquea; no redirige el tráfico hacia el firewall on-premises.",
        "NAT Gateway da salida a internet desde Azure con IPs públicas propias, justo lo contrario a enviarla por on-premises.",
        null,
        "DNAT traduce tráfico entrante; no sirve para forzar la salida a internet a través de on-premises."
      ],
      "az-119": [
        "El Map de VM insights muestra dependencias entre procesos, pero no registra flujos permitidos/denegados ni ofrece traffic analytics.",
        "Los logs de Azure Firewall solo cubren el tráfico que pasa por el firewall, no todos los flujos de las VMs.",
        null,
        "Packet capture captura paquetes de una VM bajo demanda, pero no ofrece análisis continuo de flujos ni Traffic Analytics."
      ],
      "az-120": [
        "Las private DNS zones no pueden delegarse públicamente; exponerlas en DNS público rompe el propósito de la zona privada.",
        "168.63.129.16 es una IP virtual solo alcanzable desde dentro de Azure; on-premises no puede reenviarle consultas directamente.",
        null,
        "Los route filters aplican a Microsoft peering para servicios públicos; no resuelven nombres de zonas privadas."
      ],
      "az-121": [
        "El NSG del NIC no se ignora; se evalúa después del de la subnet para el tráfico entrante.",
        "El NSG de subnet también se aplica; no hay regla de 'más específico gana'.",
        null,
        "Las reglas no se fusionan: cada NSG se evalúa por separado y el tráfico debe pasar ambos."
      ],
      "az-122": [
        "Una `VPN Gateway` estándar tiene un límite de túneles IPsec concurrentes (típicamente 30 o 100 según SKU) y no ofrece orquestación hub-spoke automática ni integración nativa con SD-WAN a gran escala.",
        null,
        "Múltiples emparejamientos con un NVA requieren configurar y mantener manualmente enrutamiento UDR, appliances de terceros y peering no transitivo para 100 sucursales.",
        "Desplegar 100 circuitos `ExpressRoute` individuales para sucursales resultaría económicamente prohibitivo y complejo de gestionar comparado con una solución hub SD-WAN."
      ],
      "az-123": [
        "Un `Diagnostic Setting` define el destino hacia donde se envían los datos de supervisión (p. ej. Log Analytics o Storage), no evalúa condiciones ni emite alertas.",
        "Las alertas del `Activity Log` reaccionan a operaciones del plano de control de Azure (como encender o borrar la VM), no a métricas de rendimiento interno del SO.",
        null,
        "Aunque es posible crear una alerta basada en consultas de logs sobre la tabla `Perf`, la forma más directa, nativa y de menor latencia para supervisar un umbral numérico de memoria es una regla de alerta métrica."
      ],
      "az-124": [
        "`Metrics Explorer` grafica métricas numéricas agregadas de rendimiento (uso de CPU, red, disco), no registra eventos de auditoría de plano de control ni identidades.",
        "`Log Analytics Workspace` solo contendría esa información si previamente se configuró la exportación del registro de actividad hacia el espacio de trabajo.",
        null,
        "`Azure Advisor` analiza la configuración de los recursos activos para recomendar mejoras de costos, seguridad y rendimiento, no audita eventos pasados de eliminación."
      ],
      "az-125": [
        "`Metrics Explorer` solo visualiza series temporales numéricas de rendimiento; no admite consultas KQL sobre tablas de registros de eventos.",
        null,
        "`Azure Security Center` (Microsoft Defender for Cloud) presenta alertas e incidentes de seguridad procesados, pero la consola principal donde se redactan y ejecutan consultas KQL ad-hoc sobre tablas de eventos de seguridad es Log Analytics.",
        "`Azure Activity Log` almacena eventos del plano de control de la suscripción de Azure, no los registros de inicio de sesión internos del sistema operativo Windows o Linux."
      ],
      "az-126": [
        "No hay snapshots de disco independientes; el backup se gestiona desde el vault, que es donde se elige el punto de restauración.",
        null,
        "Una plantilla ARM recrea la infraestructura, pero no los datos de los discos de hace 3 días.",
        "La VM está protegida con Azure Backup, no con Site Recovery; además ASR es para DR, no para volver a un estado de hace días."
      ],
      "az-127": [
        "Está invertido: RPO es pérdida de datos tolerable y RTO es tiempo de inactividad tolerable.",
        null,
        "La frecuencia de backup ayuda a cumplir el RPO, pero no lo define; la retención no tiene relación con el RTO.",
        "El RPO se expresa en tiempo (antigüedad máxima de los datos), no en volumen de datos."
      ],
      "az-128": [
        "ASR no hace failover automático; hay que iniciarlo manualmente o vía recovery plan automatizado.",
        "La test failover no es requisito previo y el planned failover requiere que el sitio primario esté disponible para apagar la VM.",
        "La VM está protegida con Site Recovery, no con Azure Backup; restaurar un backup daría peor RPO y RTO.",
        null
      ],
      "az-129": [
        "Azure Monitor Workbooks are interactive documents that combine KQL queries, metrics visualizations, text, and parameter controls into shareable, parameterized reports — much richer than static dashboard tiles.",
        null,
        "Azure Monitor Workbooks are interactive documents that combine KQL queries, metrics visualizations, text, and parameter controls into shareable, parameterized reports — much richer than static dashboard tiles.",
        "Azure Monitor Workbooks are interactive documents that combine KQL queries, metrics visualizations, text, and parameter controls into shareable, parameterized reports — much richer than static dashboard tiles."
      ],
      "az-130": [
        "Eso describe un lock ReadOnly; CanNotDelete solo bloquea operaciones de eliminación.",
        null,
        "Con CanNotDelete cualquiera con permisos de escritura RBAC puede modificar; no se requiere Owner.",
        "Actualizar tags es una operación de escritura (PATCH), no un borrado y recreación del recurso."
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
