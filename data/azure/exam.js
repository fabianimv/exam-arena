/* =========================================================================
   data/azure/exam.js — Microsoft Azure · Administrator (AZ-104) (English)
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["az-104"] = {
    "id": "az-104",
    "appId": "az-104",
    "provider": "Microsoft Azure",
    "badge": "Azure · AZ-104",
    "icon": "🔷",
    "color": "#0078d4",
    "title": "Microsoft Azure · Administrator (AZ-104)",
    "subtitle": "Identity and Governance (Entra ID, RBAC, Policy), Storage, Compute (VMs, AKS, App Service), Networking, and Monitoring.",
    "passingScore": 70,
    "domains": {
      "1": "Identities & Governance (20 %)",
      "2": "Storage (15 %)",
      "3": "Compute (20 %)",
      "4": "Networking (25 %)",
      "5": "Monitor & Backup (20 %)"
    },
    "shortDomains": {
      "1": "Identities",
      "2": "Storage",
      "3": "Compute",
      "4": "Networking",
      "5": "Monitor & Backup"
    },
    "topics": [
      {
        "id": "az-t-1",
        "d": 1,
        "title": "1.1 · Identities (Entra ID / Azure AD) and Governance (RBAC, Policy, Locks)",
        "html": "<table class=\"keytable\">\n<tr><th>Component</th><th>Key purpose on the AZ-104 exam</th><th>Critical difference</th></tr>\n<tr><td><b>Entra ID Roles vs Azure RBAC</b></td><td>Entra ID manages directory identities (Global Admin, User Admin); Azure RBAC manages Azure resources in the hierarchy Management Group → Subscription → Resource Group → Resource.</td><td><b>Owner</b> can delegate permissions; <b>Contributor</b> manages everything except granting access; <b>User Access Admin</b> only assigns roles.</td></tr>\n<tr><td><b>Azure Policy</b></td><td>Evaluates and enforces compliance of resource properties (allowed regions, SKUs, tags).</td><td>Key effects: <b>Deny</b> (blocks), <b>Audit</b> (only logs), <b>Modify</b> (adds/edits tags), <b>DeployIfNotExists</b>.</td></tr>\n<tr><td><b>Resource Locks</b></td><td><code>CanNotDelete</code> (allows modifying but not deleting) and <code>ReadOnly</code> (blocks changes on the control plane).</td><td>Locks take precedence even over the <b>Owner</b> role until the lock is explicitly removed.</td></tr>\n<tr><td><b>Conditional Access & PIM</b></td><td>Conditional Access requires MFA/device based on signals (requires P1); PIM grants Just-In-Time privileged access (requires P2).</td><td><b>B2B</b> invites partners as Guests to your tenant; <b>B2C</b> is a CIAM platform for external customers.</td></tr>\n</table>"
      },
      {
        "id": "az-t-2",
        "d": 2,
        "title": "2.1 · Azure Storage: Redundancy, Tiers, SAS, and Immutability",
        "html": "<table class=\"keytable\">\n<tr><th>Redundancy</th><th>Copies and scope</th><th>When to choose it</th></tr>\n<tr><td><b>LRS</b></td><td>3 synchronous copies in a single datacenter.</td><td>Lowest cost, no tolerance for zone or Region failure.</td></tr>\n<tr><td><b>ZRS</b></td><td>3 synchronous copies spread across 3 Availability Zones in the same Region.</td><td>High availability against the failure of an entire datacenter.</td></tr>\n<tr><td><b>GRS / GZRS</b></td><td>Replicates asynchronously to a paired secondary Region.</td><td>Recovery from Regional disasters (direct secondary read only with <b>RA-GRS / RA-GZRS</b>).</td></tr>\n</table>\n<div class=\"tip\"><b>AZ-104 tip:</b> To revoke a SAS token without rotating the storage account key, always tie it to a <b>Stored Access Policy</b>. For private access over your VNet's internal IP without going out to the internet, even with public access disabled, use a <b>Private Endpoint</b>.</div>"
      },
      {
        "id": "az-t-3",
        "d": 3,
        "title": "3.1 · Compute: VMs, VMSS, App Service, ACI, and AKS",
        "html": "<table class=\"keytable\">\n<tr><th>Service</th><th>Use case in AZ-104</th><th>Key points</th></tr>\n<tr><td><b>VM Scale Sets (VMSS)</b></td><td>Horizontal autoscaling of identical VMs and updates with a <i>rolling upgrade policy</i>.</td><td>Combine it with <b>Proximity Placement Groups</b> for minimum physical latency between VMs.</td></tr>\n<tr><td><b>Azure Bastion</b></td><td>Browser-based RDP/SSH over TLS with no public IP on the VM and without opening ports 22/3389 to the internet.</td><td>If the VM does not respond over the network, use <b>Serial Console and Boot Diagnostics</b>.</td></tr>\n<tr><td><b>App Service</b></td><td>Web PaaS with <b>Deployment Slots</b> (available from the <b>Standard S1</b> plan) for staging tests and zero-downtime swaps.</td><td>Use <b>Managed Identity</b> to connect to Azure SQL or Key Vault without storing secrets in code.</td></tr>\n<tr><td><b>ACI vs AKS</b></td><td><b>ACI</b> runs containers on demand without managing nodes; <b>AKS</b> provides full orchestration with Cluster Autoscaler and persistent storage.</td><td>For massive parallel short-lived batch HPC jobs, use <b>Azure Batch</b>.</td></tr>\n</table>"
      },
      {
        "id": "az-t-4",
        "d": 4,
        "title": "4.1 · Networking: VNets, Peering, NSG, Load Balancing, and Private DNS",
        "html": "<table class=\"keytable\">\n<tr><th>Load balancer</th><th>Layer and scope</th><th>When to use it</th></tr>\n<tr><td><b>Azure Load Balancer</b></td><td>Layer 4 (TCP/UDP), Regional.</td><td>Non-HTTP traffic or ultra-low-latency internal balancing.</td></tr>\n<tr><td><b>Application Gateway</b></td><td>Layer 7 (HTTP/HTTPS), Regional, supports WAF and URL/host-based routing.</td><td>Protect web applications against SQLi/XSS in a single Region.</td></tr>\n<tr><td><b>Traffic Manager vs Front Door</b></td><td><b>Traffic Manager</b> balances through global DNS; <b>Front Door</b> is a global Layer 7 Anycast reverse proxy with CDN and WAF.</td><td>To resolve Azure private DNS zones from on-premises over ExpressRoute, deploy <b>Azure DNS Private Resolver</b> with an inbound endpoint.</td></tr>\n</table>"
      },
      {
        "id": "az-t-5",
        "d": 5,
        "title": "5.1 · Monitor & Backup: Alerts, Log Analytics (KQL), Recovery Services, and ASR",
        "html": "<table class=\"keytable\">\n<tr><th>Tool</th><th>What it records or solves</th></tr>\n<tr><td><b>Activity Log</b></td><td>Control plane operations (who created, modified, or deleted a resource in ARM and when).</td></tr>\n<tr><td><b>Log Analytics Workspace</b></td><td>Advanced <b>KQL</b> queries over VM, container, and security logs; visualized in interactive reports with <b>Azure Workbooks</b>.</td></tr>\n<tr><td><b>Azure Backup vs Site Recovery (ASR)</b></td><td><b>Azure Backup</b> restores historical recovery points from a Recovery Services Vault; <b>ASR</b> continuously replicates VMs to fail over with minimal RTO/RPO if the primary site goes down.</td></tr>\n</table>"
      }
    ],
    "questions": [
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
    "why": {
      "az-001": [
        "`User Administrator` only manages basic users and groups; it cannot manage other directory roles or global Microsoft services.",
        null,
        "`Privileged Role Administrator` manages Azure AD role assignments and PIM, but does not grant full operational control over all Microsoft 365 services.",
        "`Security Administrator` reads policies and manages security alerts, but does not have full directory administration permissions or resource assignment rights."
      ],
      "az-002": [
        "`Owner` includes the `Microsoft.Authorization/*` action, which would allow the user to grant and modify RBAC permissions for other users.",
        null,
        "`Reader` only allows viewing existing resources; it does not allow creating, configuring, or deleting them.",
        "`User Access Administrator` is designed exclusively to manage RBAC role assignments and permissions, with no ability to administer compute or storage resources."
      ],
      "az-003": [
        "Assigning policies subscription by subscription creates administrative overhead and a risk of misalignment when new subscriptions are added.",
        null,
        "Although Blueprints can package policies, assigning it subscription by subscription does not take advantage of automatic governance inheritance.",
        "Resource Groups cannot span multiple subscriptions or inherit policies to other subscriptions."
      ],
      "az-004": [
        "Azure RBAC is based on an \"allow\" model by default; \"Deny assignments\" are managed by Azure (e.g., Blueprints) and cannot be used to filter locations.",
        null,
        "\"ReadOnly\" Resource Locks prevent any modification or creation; they cannot selectively restrict by region.",
        "Azure Service Health is a notification service for platform incidents and maintenance, not a control or compliance engine."
      ],
      "az-005": [
        "Assigning the `Reader` role would prevent administrators from managing or modifying production resources when necessary.",
        "An Azure Policy with the `Audit` effect only reports compliance status in a report; it does not block the delete action.",
        null,
        "Resource Groups do not have a native `soft delete` property to recover entire groups deleted by mistake."
      ],
      "az-006": [
        "`MFA Server` is a legacy on-premises (deprecated) solution that does not offer cloud-based contextual policies.",
        null,
        "`Identity Protection` detects user risk and sign-in risk, but conditional access rules by location are configured through Conditional Access.",
        "`Privileged Identity Management (PIM)` manages just-in-time, temporary activation of privileged roles, not MFA challenges based on source network."
      ],
      "az-007": [
        "A `ReadOnly` lock prevents modifying or deleting resources on the control plane, but it does not hide their visibility or block reading.",
        "`Deny assignments` typically block modification/deployment actions created by Blueprints; basic reading of resources is rarely denied.",
        null,
        "Azure Policy evaluates compliance and audits or blocks deployments, but it does not hide existing resources in the portal or the API."
      ],
      "az-008": [
        "The hierarchy in Azure flows top-down (from larger to smaller scope), not from the individual resource up to the management groups.",
        null,
        "Subscriptions are contained within Management Groups, so the top inheritance scope is Management Group, not Subscription.",
        "Resources are contained within a Resource Group; inheritance never flows from a child to its parent."
      ],
      "az-009": [
        "Password rotation and SSPR are Azure AD password management features, not PIM.",
        null,
        "Hybrid identity and password synchronization is performed by Azure AD Connect (now Entra Connect), not PIM.",
        "Detection of leaked credentials and sign-in risks is a function of Azure AD Identity Protection."
      ],
      "az-010": [
        "`Deny` immediately blocks the creation or update of the non-compliant resource, instead of remediating it by adding the tag.",
        "`Audit` only records a warning in the compliance dashboard; it does not add or modify any property on the resource.",
        "`Append` can add fields to the request during creation, but for modern tag management the recommended, purpose-built effect is `Modify`.",
        null
      ],
      "az-011": [
        "`Azure AD Free` only includes basic authentication and fixed Security Defaults; it does not allow creating custom Conditional Access policies.",
        null,
        "`Azure AD Premium P2` supports risk-based policies (Identity Protection), but the minimum license required for standard Conditional Access is P1.",
        "`Microsoft 365 Business Basic` includes only the Azure AD Free features unless an add-on or Premium plan is purchased."
      ],
      "az-012": [
        "A `ReadOnly` lock operates on the control plane; it does not revoke existing access keys or block data downloads if authentication is already in place.",
        "The `ReadOnly` lock does not distinguish between creating and deleting objects at the data level; it blocks changes on the resource's management plane.",
        null,
        "With a `ReadOnly` lock, any modification on the control plane (including updating tags) is completely denied."
      ],
      "az-013": [
        "The `Audit` effect does not alter the running state or network connectivity of resources.",
        null,
        "Automatic remediation requires the `DeployIfNotExists` or `Modify` effect together with a remediation task, not the `Audit` effect.",
        "Azure Policy does not move resources between subscriptions or create quarantine resources."
      ],
      "az-014": [
        "The `Management Group` scope would grant permissions over all subscriptions and resources contained under that group, violating least privilege.",
        "The `Subscription` scope would grant permissions over all resource groups in the subscription, not just the specified group.",
        null,
        "Assigning permissions at the individual VM level would not allow the user to create new virtual machines within the resource group."
      ],
      "az-015": [
        "Monitoring of incidents and platform health is the role of Azure Monitor and Azure Service Health.",
        null,
        "Orchestration of disaster recovery and failover across regions is the job of Azure Site Recovery.",
        "Cost analysis and budget allocation are the responsibility of Microsoft Cost Management."
      ],
      "az-016": [
        "`Azure Files` provides SMB/NFS file shares for mountable file systems, not a massive HTTP/HTTPS object store optimized for the web.",
        "`Azure Table Storage` is a NoSQL key-value database for structured entities, not for massive binary image files.",
        null,
        "`Azure Queue Storage` is designed for asynchronous messaging between services, not for storing media files."
      ],
      "az-017": [
        "LRS does not replicate across paired regions; it is limited to a single datacenter. ZRS is the one that distributes across three zones.",
        null,
        "LRS does not tolerate the loss of a datacenter or an entire region; ZRS does tolerate the loss of a datacenter because it spans 3 zones.",
        "LRS does not replicate to another continent (that would be GRS/GZRS); and ZRS is available in both standard and premium storage."
      ],
      "az-018": [
        "Storage account access keys do not support automatic expiration dates or native time limits.",
        null,
        "The `Contributor` role on a VM does not grant upload permissions to Blob Storage, and a service principal requires more permission configuration than a temporary SAS for third parties.",
        "Azure Data Lake Gen2 ACLs manage file and folder permissions, but do not support a temporary 48-hour expiration without credentials."
      ],
      "az-019": [
        "The `Hot` tier has the highest storage costs, optimized for frequently accessed data.",
        "The `Cool` tier is optimized for data stored for at least 30 days with infrequent monthly access, making it more expensive per GB stored than Archive.",
        "The `Cold` tier requires a minimum retention of 90 days, but its cost per GB stored is significantly higher than Archive for annual access.",
        null
      ],
      "az-020": [
        "Although Blob Storage supports NFS v3, it does not offer a native SMB file share for Windows Server at the same time.",
        null,
        "Azure Managed Disks Shared Disks provide block disks for failover clusters (such as WSFC or Pacemaker), not multi-protocol file shares.",
        "Azure Table Storage is an unstructured NoSQL key-attribute store, not a file system for OS mounting."
      ],
      "az-021": [
        "Soft delete retains the blob for the configured period (14 days in this case); it is not purged at 24 hours.",
        null,
        "The deleted blob moves to a soft-deleted state in the same access tier; it is not moved to the Archive tier and does not require rehydration.",
        "The blob is recovered by running an `Undelete` operation directly on the storage account, without relying on copies in a Recovery Services vault."
      ],
      "az-022": [
        "Legacy `BlobStorage` account types do not support enabling hierarchical namespace (HNS).",
        "GPv1 accounts do not support Azure Data Lake Storage Gen2 or advanced hierarchical namespace features.",
        null,
        "FileStorage is an account type optimized exclusively for premium Azure Files (SMB/NFS), not for ADLS Gen2."
      ],
      "az-023": [
        "Transferring 200 TB over a shared 100 Mbps connection would take more than 6 months and would saturate the corporate link.",
        "Azure Data Factory with a self-hosted IR still depends on the available network bandwidth, with the same unworkable transfer times.",
        null,
        "Storage Explorer also transmits the data over the internet connection, suffering from the same bandwidth limitations."
      ],
      "az-024": [
        "Replication between storage accounts is done with Object Replication, not through lifecycle policies.",
        null,
        "Metric monitoring and capacity alerts are configured through Azure Monitor and storage Metrics.",
        "Failover between primary and secondary endpoints is handled by geo-redundancy (customer-managed failover), not by lifecycle management."
      ],
      "az-025": [
        "Assigning a public IP to the VM to allow public access violates the security requirement to keep access private and restricted.",
        "Opening port 445 in the NSG does not resolve the storage account firewall block at the Azure network plane level.",
        null,
        "A Virtual Network Gateway is not required to connect a VM to a PaaS service in the same virtual network; Service Endpoints or Private Endpoints are sufficient."
      ],
      "az-026": [
        "ZRS distributes data across three availability zones within the same region, but does not protect against the loss of the entire region.",
        "GRS replicates to a paired secondary region, but in the primary region it only uses local replication (LRS), not zone-based replication.",
        null,
        "LRS keeps 3 copies within a single datacenter in a single region, with no protection against zone or region failures."
      ],
      "az-027": [
        "Opening a support ticket introduces critical delays while the leaked key remains exposed and usable by third parties.",
        null,
        "Blocking the firewall may mitigate network access, but it does not invalidate the compromised credential; immediate key rotation is essential.",
        "Changing the replication level does not affect authentication mechanisms or revoke leaked access keys."
      ],
      "az-028": [
        "AzCopy is a command-line utility optimized for Azure Storage transfers with support for parallel transfers, job journaling (resume), and SAS tokens.",
        null,
        "AzCopy is a command-line utility optimized for Azure Storage transfers with support for parallel transfers, job journaling (resume), and SAS tokens.",
        "AzCopy is a command-line utility optimized for Azure Storage transfers with support for parallel transfers, job journaling (resume), and SAS tokens."
      ],
      "az-029": [
        "`Availability Zones` separate VMs into distinct datacenters within a region, but to distribute two VMs across update domains within a single datacenter you use an Availability Set.",
        null,
        "`Azure Site Recovery` is a disaster replication and failover solution across regions, not a local high-availability mechanism during maintenance.",
        "`VM Scale Sets` deploy and scale homogeneous groups of VMs; for two existing individual VMs, the standard mechanism is an Availability Set."
      ],
      "az-030": [
        null,
        "Availability Sets do not support automatic horizontal scaling; they only distribute pre-existing VMs across fault and update domains.",
        "VMSS instances are based on a common identical template, whereas in an Availability Set you can group VMs with different configurations and operating systems.",
        "Neither VMSS nor Availability Sets automatically span multiple Azure regions; both are regional constructs."
      ],
      "az-031": [
        "Running a full VM for an ephemeral batch job requires provisioning and maintaining the underlying OS infrastructure.",
        "AKS requires managing a cluster and node pools, which introduces unnecessary operational overhead for a job that runs only once.",
        null,
        "App Service requires provisioning and maintaining an active App Service Plan, generating ongoing compute costs even when the container is not running."
      ],
      "az-032": [
        "`Azure Virtual Machines` is IaaS and requires managing OS patching, manual scaling, and load balancers without native slots.",
        null,
        "`Azure Container Instances` runs individual stateless containers, but does not include deployment slots or integrated PaaS load balancing for web.",
        "`Azure VM Scale Sets` requires configuring and managing the images and maintenance of the virtual machine instances."
      ],
      "az-033": [
        "A `VPN Gateway` requires configuring tunnels, certificates, or VPN clients on each workstation, which is more complex than Bastion in the portal.",
        null,
        "`JIT VM Access` temporarily opens port 3389 on the VM's public IP, so the port is exposed during the active window.",
        "Allowing port 3389 from a specific IP still exposes the RDP protocol directly to the internet on the machine's public IP."
      ],
      "az-034": [
        "`imagePullSecrets` store credentials inside Kubernetes secrets, which violates the explicit requirement not to store secrets.",
        "Enabling anonymous access exposes the private registry publicly to the internet without authentication, violating corporate security policies.",
        null,
        "ConfigMaps are not designed to store sensitive credentials, and admin tokens would be exposed in clear text inside the cluster."
      ],
      "az-035": [
        "Installation of the Azure Monitor agent is handled through the Azure Monitor Agent VM Extension, not the Custom Script Extension.",
        null,
        "Managed disk snapshots and backups are handled through Azure Backup and snapshot policies, not the Custom Script Extension.",
        "Disk resizing is done at the disk resource level in ARM or the portal, not through extension agent scripts."
      ],
      "az-036": [
        "`Standard HDD` uses conventional magnetic media with the highest latency and the lowest IOPS performance.",
        "`Standard SSD` is suitable for lightweight development workloads or web servers with moderate traffic, not for critical databases.",
        "`Premium SSD` offers high SSD-based performance, but its IOPS and latency fall short of the sub-millisecond capabilities of Ultra Disk.",
        null
      ],
      "az-037": [
        "Deallocating the virtual machine keeps the VM resource active in the subscription, rather than decommissioning it.",
        null,
        "Deleting the managed disk after taking a snapshot destroys the existing disk; you would need to create a new disk from the snapshot later.",
        "Moving the VM to another resource group does not decommission the existing VM or release the compute object."
      ],
      "az-038": [
        "Distributing virtual machines across regions is handled with Azure Traffic Manager, Front Door, or multi-region architectures, the opposite of physical proximity.",
        null,
        "Logical grouping of network interfaces for filtering rules is done with Application Security Groups (ASGs), not PPGs.",
        "Distribution across availability zones physically disperses VMs for fault tolerance; a PPG seeks physical proximity to reduce latency."
      ],
      "az-039": [
        "Manually configuring each VM in the portal is prone to human error and is neither versionable nor scalable.",
        null,
        "`Azure Migrate` is oriented toward migration from on-premises environments to Azure, not repeatable infrastructure-as-code deployment.",
        "`Azure Site Recovery` replicates virtual machines for disaster recovery, not for provisioning identical templates across multiple regions."
      ],
      "az-040": [
        null,
        "It is not possible to detach the operating system disk from a virtual machine while the VM exists.",
        "Manually cloning data to a new managed disk is not the official or supported method for expanding the operating system disk.",
        "Adding data disks and configuring striping expands secondary data storage, but does not resolve the lack of space on the operating system partition."
      ],
      "az-041": [
        "Spot VMs do not offer an availability SLA and can be evicted at any time with only 30 seconds' notice.",
        null,
        "Critical relational databases cannot tolerate sudden hardware evictions without the risk of service unavailability.",
        "Domain controllers require continuous high availability and deterministic availability, which makes them unsuitable for evictable instances."
      ],
      "az-042": [
        "Keeping the operating system paused corresponds to the `Stopped` state (from within the OS), in which the hardware remains allocated and Azure continues to bill for compute.",
        null,
        "In the `Deallocated` state there is no partial compute discount; the compute cost (vCPU and RAM) is exactly zero ($0), and only disks and static public IPs are billed.",
        "Azure platform maintenance does not place machines in a billable deallocated state with a discount."
      ],
      "az-043": [
        "Self-managed Kubernetes on VMs requires the user to manually install, configure, patch, and maintain the control plane nodes and etcd.",
        "`Azure Container Instances` is a serverless environment for running individual containers or container groups, not a full orchestrator with an exposed control plane.",
        null,
        "`Azure Red Hat OpenShift` is a platform jointly managed with Red Hat, but in the standard AZ-104 certification context the native orchestrator managed by Microsoft is AKS."
      ],
      "az-044": [
        "A `Site-to-Site VPN` connection between VNets requires two Virtual Network Gateways, introduces hourly gateway costs, and limits bandwidth.",
        null,
        "`ExpressRoute` requires connectivity through an external telecommunications provider to connect on-premises networks, not for two VNets in Azure.",
        "`Azure Relay` is a messaging service for connecting services behind firewalls at the application level, not a network link between VNets."
      ],
      "az-045": [
        "Lower priority numbers have higher precedence (e.g., rule 100 is processed before rule 200), not from highest to lowest number.",
        null,
        "The rule type (Allow or Deny) does not determine the evaluation order; the order is dictated strictly by the priority number.",
        "Custom rules (priorities 100 to 4096) are always evaluated before default rules (priorities 65000 to 65500)."
      ],
      "az-046": [
        "The default behavior of an NSG is not to allow all inbound traffic, but to deny it except for internal VNet traffic and the Azure Load Balancer.",
        "Although there is a default rule that allows communication within the VNet (AllowVNetInBound), the final default catch-all rule that applies to unmatched external traffic is DenyAllInBound.",
        null,
        "Azure Network Watcher does not capture packets by default unless a Packet Capture session is explicitly configured."
      ],
      "az-047": [
        "Virtual network peering (VNet peering) is non-transitive; traffic cannot hop through an intermediate VNet natively.",
        null,
        "`Allow Gateway Transit` allows remote VNets to use a VPN or ExpressRoute gateway in the hub VNet; it does not enable general routing transitivity between VNets.",
        "The geographic location of the VNets does not alter the fundamental non-transitivity rule of peering."
      ],
      "az-048": [
        "NSGs filter packets by IP and port (allow or deny), but cannot change the next hop of the traffic.",
        null,
        "Azure Firewall rules filter traffic once it reaches the firewall, but to redirect traffic to the firewall or NVA a UDR route is essential.",
        "Service Endpoints divert traffic to Microsoft PaaS services over the backbone; they do not route to an NVA or manage general internet traffic."
      ],
      "az-049": [
        "BGP route propagation is used with ExpressRoute or VPN gateways; it is not a requirement for an NVA to forward UDR-routed traffic.",
        null,
        "The NVA can reach the internet through NAT Gateway, Azure Firewall, or a secondary public IP; a direct standard public IP is not the mandatory failure that blocks internal forwarding.",
        "Default NSG rules already allow all outbound traffic (AllowInternetOutBound); what Azure blocks by default on a NIC is receiving packets with a foreign destination IP if `IP Forwarding` is missing."
      ],
      "az-050": [
        "Azure Application Gateway is an L7 load balancer supporting URL path-based routing, SSL termination, session affinity, and optionally WAF (Web Application Firewall).",
        null,
        "Azure Application Gateway is an L7 load balancer supporting URL path-based routing, SSL termination, session affinity, and optionally WAF (Web Application Firewall).",
        "Azure Application Gateway is an L7 load balancer supporting URL path-based routing, SSL termination, session affinity, and optionally WAF (Web Application Firewall)."
      ],
      "az-051": [
        "Standard Load Balancer operates at Layer 4 and, although Cross-region Load Balancer exists, it does not use the DNS latency-based routing method (Performance routing).",
        "Application Gateway is a regional Layer 7 load balancer; it does not distribute DNS traffic globally based on the lowest latency for dispersed clients.",
        null,
        "The weighted method distributes traffic by predefined percentages, not by the client's lowest geographic latency as the scenario requires."
      ],
      "az-052": [
        "A `Site-to-Site` VPN encrypts traffic using IPSec but travels over the public internet, not over a private dedicated circuit.",
        "A `Point-to-Site` connection is for connecting individual remote clients over the internet using a client VPN, not for a dedicated corporate link.",
        null,
        "`VNet Peering` connects virtual networks within Azure, not a physical on-premises network."
      ],
      "az-053": [
        "Traffic Manager is a global load-balancing service based on public DNS for external endpoints, not for internal name resolution within a VNet.",
        null,
        "Public DNS zones require exposing records on public internet name servers and do not support automatic registration of private VMs.",
        "Deploying a DNS forwarder on a VM requires managing the infrastructure, patching, and availability of the server, violating the requirement not to deploy dedicated DNS servers."
      ],
      "az-054": [
        "It is the other way around: NSGs operate only at layers 3 and 4 (IP, port, protocol), while Azure Firewall inspects layer 7 (FQDNs, URLs, application rules).",
        null,
        "NSGs cannot decrypt or inspect the content of HTTPS packets at the application layer; Azure Firewall Premium does support TLS inspection.",
        "Azure Firewall is a fully managed, centralized network firewall delivered as PaaS, not a host-based firewall."
      ],
      "az-055": [
        "VM `Diagnostic Settings` collect OS logs and host performance metrics, not the NSG's IP packet flows.",
        null,
        "`Azure Firewall` logs only capture traffic that traverses the Azure firewall, not packets passing through the subnet NSGs.",
        "`Microsoft Sentinel` connectors ingest security events that have already been collected; to record NSG network flows you must first enable NSG Flow Logs."
      ],
      "az-056": [
        "Assigning public IPs directly to NICs exposes the VM to the internet, the opposite of the purpose of a Service Endpoint, which aims to isolate traffic.",
        null,
        "IPSec VPN tunnels are established through Azure VPN Gateway, not through Service Endpoints.",
        "Distribution of incoming traffic across instances is done with Azure Load Balancer or Application Gateway."
      ],
      "az-057": [
        "Encryption in transit (TLS/HTTPS) is implemented by the PaaS service itself in both mechanisms; it is not exclusive to Private Endpoint.",
        null,
        "Private Endpoint does not eliminate data transfer costs; in fact, it charges per gigabyte processed for both inbound and outbound.",
        "DDoS Network Protection is a network feature at the VNet level, not an exclusive capability that Private Endpoint provides over Service Endpoint."
      ],
      "az-058": [
        "The Load Balancer only monitors network health to make routing decisions; it has no permissions or ability to restart virtual machines.",
        null,
        "The Load Balancer does not destroy or provision replacement virtual machines; it only marks them as unhealthy in its distribution table.",
        "The load balancer immediately stops sending new traffic to the unhealthy instance; it does not continue sending traffic as if it were healthy."
      ],
      "az-059": [
        "Azure Policy evaluates the compliance and configuration state of resources on the control plane; it does not generate real-time alerts on performance metrics such as CPU.",
        null,
        "Microsoft Defender for Cloud generates security recommendations and alerts for threats, not operational alerts based on CPU usage thresholds.",
        "CPU percentage is a platform metric collected continuously by Azure Monitor; using an event log query is not the direct or standard mechanism."
      ],
      "az-060": [
        "Storage of snapshots and backup recovery points is the responsibility of Azure Backup and Recovery Services vaults.",
        null,
        "Real-time metrics dashboards use Azure Monitor Metrics and Azure Dashboards; they do not necessarily require Log Analytics, nor is that its primary function.",
        "Low-cost, long-term cold archiving is done in Azure Blob Storage (Archive tier), not in a Log Analytics workspace."
      ],
      "az-061": [
        "It is the other way around: Site Recovery is what orchestrates disaster failover across regions, while Azure Backup manages point-in-time copies.",
        null,
        "Azure Backup supports granular file and folder restore in addition to full disks and VMs; Site Recovery is designed for full machine replication and failover.",
        "Azure Backup works with periodic scheduled backups; it is Azure Site Recovery that maintains continuous asynchronous replication for a near-zero RPO."
      ],
      "az-062": [
        "The default retention period is not 7 days but 90 days, and Azure Policy does not change the internal storage of the Activity Log.",
        "The default retention period is not 30 days, nor does extending it require purchasing a dedicated Log Analytics cluster.",
        null,
        "The Activity Log only stores 90 days on the platform by default; records older than 90 days are purged unless they are exported."
      ],
      "az-063": [
        "`Azure Advisor` offers cost, security, and reliability recommendations, but not real-time performance charts or dependency maps.",
        null,
        "`Application Insights` monitors the code and performance of web applications (APM), not the infrastructure and dependencies at the VM operating system level.",
        "`Azure Service Health` reports on the status of the global Azure platform and scheduled maintenance, not on internal VM metrics."
      ],
      "az-064": [
        "Monitoring of guest operating system metrics (CPU, memory, disk) is done through Azure Monitor Metrics and VM Insights.",
        null,
        "Creation of alert rules and automated remediations is configured in Azure Monitor Alerts and Action Groups.",
        "Permission assignment and RBAC access control are managed through Azure RBAC on the control plane, not through Service Health."
      ],
      "az-065": [
        "Organization of resources for governance policy assignment is done through Management Groups and Resource Groups, not Action Groups.",
        null,
        "Metric aggregation and custom visualization are done through Azure Workbooks and Azure Dashboards.",
        "Access control to data export destinations is managed through Azure RBAC and network policies, not with Action Groups."
      ],
      "az-066": [
        "T-SQL is used in Azure SQL Database; Log Analytics does not accept T-SQL but KQL.",
        "PromQL is used against an Azure Monitor workspace (managed Prometheus), not against a Log Analytics workspace.",
        null,
        "OData `$filter` is used to filter REST calls (e.g., the Activity Log API), not to query Log Analytics tables."
      ],
      "az-067": [
        "Snapshots scheduled with a runbook provide neither multi-disk application consistency nor retention management; it is a homegrown solution, not the backup service.",
        "Site Recovery is replication for DR (failover), not backup; its recovery point retention is only a few days (max. 15), not 30.",
        null,
        "GRS + soft delete protects blobs against deletion or regional disaster, but does not generate scheduled, consistent restore points for the VM."
      ],
      "az-068": [
        "VM insights shows VM performance and dependencies, but does not generate savings recommendations for underutilized VMs or unattached disks.",
        "Defender for Cloud gives security recommendations (secure score), not cost recommendations.",
        null,
        "Cost Management budgets alert when spending exceeds a threshold, but do not identify underutilized resources."
      ],
      "az-069": [
        "`Audit` only records a warning in policy compliance reports; it does not deploy resources or agents.",
        "`Deny` blocks the creation or update of non-compliant resources, but cannot install or deploy missing components.",
        "`Modify` allows adding, updating, or removing tags and values on existing resources, but does not run ARM templates to deploy new resources or extensions.",
        null
      ],
      "az-070": [
        "Boot Diagnostics is for OS boot problems; it does not show the backup job's error code.",
        "The Activity Log records control plane operations, but not the details or error codes of the backup job.",
        null,
        "That table only exists if you previously configured diagnostic settings to Log Analytics; it is not the first place to look."
      ],
      "az-071": [
        null,
        "User risk policies in Identity Protection respond to compromised accounts, but do not orchestrate the mandatory prior registration experience for MFA methods.",
        "Combined registration is the modern self-service interface that unifies SSPR and MFA, but the policy that requires and enforces going through that flow is Conditional Access.",
        "Azure AD Password Protection validates password strength against global and custom banned lists; it does not manage MFA methods or registrations."
      ],
      "az-072": [
        "Conditional Access controls sign-in conditions, but does not offer just-in-time role activation with approval and limited duration.",
        null,
        "Access reviews periodically review who has access, but do not grant the role just-in-time with approval.",
        "Administrative units limit the scope of administrative roles, but the assignment remains permanent, not JIT."
      ],
      "az-073": [
        null,
        "Azure AD sign-in logs show the authentication failure in the cloud, but do not reveal the state or errors of the password synchronization engine.",
        "ADUC only shows the on-premises object on the domain controller, but provides no visibility into hash synchronization to Azure AD.",
        "Password Protection proxy logs audit on-premises password policy validations, not the state of the Azure AD Connect sync agent."
      ],
      "az-074": [
        "`DoNotEnforce` disables the effect of the assignment across the entire subscription, not just in the resource group.",
        "Changing the effect to `Audit` stops blocking deployments in all scopes of the assignment, not just in one resource group.",
        null,
        "An RBAC role does not exempt from Azure Policy; the policy still applies regardless of whatever permissions the user has."
      ],
      "az-075": [
        "`Append` adds specific fields or properties to the resource manifest during deployment, but does not create a new child or related resource.",
        "`Audit` generates a non-compliance record in the policy console, without performing any creation or remediation action.",
        null,
        "`Modify` updates or replaces properties and tags on the evaluated resource, but does not run an ARM template to create a standalone resource such as Diagnostic Settings."
      ],
      "az-076": [
        "`Privileged Identity Management (PIM)` manages temporary activation and governance of privileged Azure AD and Azure roles, not periodic reviews of guest members in groups or channels.",
        null,
        "`Entitlement Management` organizes access packages and resource request workflows, but the periodic, recurring continuous access certification feature is Access Reviews.",
        "`Conditional Access` enforces real-time access controls during sign-in (such as MFA or compliant devices), but does not perform periodic reviews of existing memberships."
      ],
      "az-077": [
        "An Azure AD user account can belong to its home directory and also be a guest in other external directories; it is not limited to 1.",
        "There is no cap of 10 directories; users can collaborate with multiple organizations as members or guests without this limit.",
        "Azure AD does not impose a hard limit of 500 directories per user identity for membership or B2B access.",
        null
      ],
      "az-078": [
        "`Deny` blocks the creation of resources that do not meet the condition, instead of automatically adding the inherited tag.",
        "`Append` can add fields to the request during creation, but to add or modify inherited tags the specific, recommended effect is `Modify`.",
        null,
        "`DeployIfNotExists` is used to deploy dependent or full child resources through ARM templates, not to apply tags on the resource itself."
      ],
      "az-079": [
        "It works, but requires 10 assignments and does not cover new subscriptions in the department; it is not the most efficient.",
        "Assigning at the root forces you to maintain exclusions for the other 4 departments and risks affecting the entire tenant.",
        null,
        "One blueprint per subscription is still one assignment per subscription; in addition, Blueprints is being deprecated; the management group solves it with a single assignment."
      ],
      "az-080": [
        "`Owner` grants full control over all resources, including the ability to start, stop, and assign roles to other users.",
        "`Contributor` allows performing any management action on resources (including powering VMs on and off), without restricting compute operations.",
        null,
        "`Virtual Machine Contributor` grants the permissions needed to start, shut down, and manage virtual machines; if they had this role, they could stop them."
      ],
      "az-081": [
        "A client secret in app settings is still a stored credential that must be protected and rotated.",
        null,
        "A service principal certificate is still a credential that must be uploaded, renewed, and rotated; a managed identity eliminates that management.",
        "A service endpoint only controls network access; the app still needs to authenticate to Key Vault with some identity."
      ],
      "az-082": [
        "`Azure AD Free` does not support custom Conditional Access policies; it only allows enabling predefined Security Defaults.",
        null,
        "`Azure AD P2` includes additional risk-based Identity Protection features, but the base minimum license for Conditional Access is Azure AD P1.",
        "`Microsoft 365 E3` includes Azure AD P1 functionality, but the Azure AD license tier formally required as the service standard is Azure AD P1."
      ],
      "az-083": [
        "Conditional Access and named locations control where the user signs in from, not which region resources are deployed to.",
        null,
        "RBAC cannot restrict the deployment region; a resource group in East US can contain resources from any region.",
        "It works, but that is 20 assignments; the question asks for the BEST single action, which is to assign at the management group."
      ],
      "az-084": [
        "It is inverted: B2B is collaboration with partners and B2C is customer/consumer identity.",
        null,
        "B2B works with any edition (MAU billing) and B2C has its own pricing model; they do not depend on P1/P2 in that way.",
        "It is inverted: B2C uses a separate tenant (Azure AD B2C tenant), while B2B adds guests to your corporate tenant."
      ],
      "az-085": [
        "Locks are evaluated above RBAC; no role, not even Owner, can delete while the lock exists.",
        null,
        "Having created the lock grants no exception; anyone must remove the lock first (requires `Microsoft.Authorization/locks/delete`).",
        "A lock on a resource group applies to the group and is inherited by all of its resources."
      ],
      "az-086": [
        "Blob versioning keeps earlier historical versions of a blob upon modification or overwrite, but does not move tiers or schedule deletions by age.",
        null,
        "`Azure Backup` retention protects backup recovery points in vaults; it does not manage the lifecycle of production data in the storage account.",
        "Immutability policies (WORM) block modification and deletion of blobs during a legal or compliance period; they do not manage tier transitions or periodic cost-saving purges."
      ],
      "az-087": [
        null,
        "GRS keeps the 3 primary copies in LRS (a single datacenter); if that datacenter goes down you need an asynchronous geo-failover with possible data loss.",
        "Premium LRS changes the performance (SSD), but still replicates within a single datacenter.",
        "RA-GRS adds read access in the secondary region, but the primary region is still LRS in a single datacenter."
      ],
      "az-088": [
        "Allowing the outbound public IP still sends traffic through the public endpoint over the internet, not over the backbone from the subnet.",
        null,
        "A storage account does not live in its own VNet that you could peer with.",
        "ExpressRoute Microsoft peering is for traffic from on-premises, not for VMs that are already in an Azure VNet."
      ],
      "az-089": [
        "An account SAS does not support stored access policies; to revoke it you must regenerate the account key.",
        null,
        "A user delegation SAS does not support reusable stored access policies; it can only be revoked by revoking the user delegation keys.",
        "An ad hoc SAS carries its permissions embedded in the token; there is no reusable policy to modify or delete in order to revoke it."
      ],
      "az-090": [
        "The free space policy refers to the server's local volume, not to a capacity reservation in the Azure file share.",
        null,
        "The policy does not set a percentage of cached files; it guarantees a percentage of free space on the volume.",
        "It is inverted: tiering is triggered when free space drops below 20%, not when the volume is at 20% usage."
      ],
      "az-091": [
        "Limiting bandwidth reduces the instantaneous impact but stretches the 50 TB transfer over weeks across the network.",
        "Data Factory with a self-hosted integration runtime still moves the 50 TB over the network.",
        null,
        "File Sync syncs files to Azure Files over the network, not to Blob Storage, and does not avoid bandwidth consumption."
      ],
      "az-092": [
        "That describes snapshots (or versioning), not soft delete.",
        null,
        "Replication to the secondary region is GRS/RA-GRS; it would also replicate the deletion.",
        "Preventing deletion or overwrite for a period is immutability (WORM); soft delete allows deleting but recovering afterward."
      ],
      "az-093": [
        "Snapshots can be deleted by anyone with permissions and do not prevent modifying the base blob.",
        "Azure Backup keeps copies, but does not prevent the original blob from being modified or deleted.",
        null,
        "Soft delete has a maximum of 365 days and does not prevent deleting or overwriting; it only allows recovery."
      ],
      "az-094": [
        "With public network access disabled, firewall IP rules do not apply: all access through the public endpoint is blocked.",
        null,
        "Service endpoints use the account's public endpoint; if public access is disabled, VNet rules have no effect.",
        "The trusted services exception applies to certain Azure services (Backup, Event Grid, etc.), not to a custom application."
      ],
      "az-095": [
        "`GRS` replicates data to a paired secondary region, but data at the secondary endpoint is not readable until a failover occurs.",
        null,
        "`ZRS` replicates across three zones within the primary region, but does not maintain any copy in a secondary region.",
        "`GZRS` replicates across local zones and to a secondary region, but continuous secondary read access requires enabling the `RA-GZRS` variant."
      ],
      "az-096": [
        "Inviting a guest involves creating an account in your directory, which is exactly what the requirement prohibits.",
        null,
        "Anonymous access exposes the container to anyone and does not expire on its own.",
        "The account key gives full control (not just read) over the entire storage account; relying on rotating it manually is risky."
      ],
      "az-097": [
        null,
        "Premium file accounts (`FileStorage` SSD) do not support geo-replication (`GRS` or `GZRS`); they only support local and zonal redundancy.",
        "Azure Files Premium supports both `LRS` and `ZRS` (in regions where ZRS is available), so it is not limited exclusively to LRS.",
        "You cannot select any option; standard geo-redundant tiers are not available for Premium file shares."
      ],
      "az-098": [
        null,
        "The order is source and then destination: this command uploads the local folder to the container; it does not download.",
        "Without `--recursive`, AzCopy does not copy the contents of a container/directory as a source; `--overwrite` does not change that.",
        "`download` is not an AzCopy v10 subcommand; downloads are done with `azcopy copy`."
      ],
      "az-099": [
        "An Availability Set provides hardware fault tolerance, but does not scale automatically based on CPU.",
        null,
        "Zonal VMs with a load balancer provide high availability, but not autoscaling or batch-orchestrated updates.",
        "Automatic mode updates all instances at once in random order, which can cause downtime."
      ],
      "az-100": [
        "`Azure VPN Gateway` connects entire networks or devices through IPSec/P2S tunnels, requiring a VPN client instead of direct clientless browser access.",
        null,
        "A DNAT rule in `Azure Firewall` translates inbound traffic from a public IP, so the access port remains exposed to the internet through the firewall.",
        "`Just-in-time (JIT) VM access` dynamically opens ports in the NSG and on the VM's public IP, which means the IP and port remain exposed during the session."
      ],
      "az-101": [
        "AKS requires managing the cluster and its node pools, and the system node pool does not scale to zero.",
        null,
        "A VM with Docker requires managing the OS and is billed while it is powered on.",
        "App Service charges for the App Service plan even when there is no traffic; it does not scale to zero."
      ],
      "az-102": [
        "A connection string in the configuration still stores the password; the only difference is that it is not exchanged in the swap.",
        null,
        "The service principal certificate is still a stored credential that must be protected and rotated.",
        "Encrypting the `web.config` section still keeps SQL credentials in configuration files."
      ],
      "az-103": [
        "`App Service Backup` performs periodic backups of the site content and database; it does not provide pre-production environments for testing.",
        null,
        "`Azure Traffic Manager` is a DNS load balancer that distributes external requests across public endpoints, not a native App Service warm-up and swap feature.",
        "`Azure Front Door` handles global HTTP/HTTPS routing, but does not manage hot swap configurations or slot isolation in the App Service Plan."
      ],
      "az-104": [
        "Shared supports custom domains, but not custom-domain SSL, autoscaling, or slots.",
        "Basic allows manual scaling up to 3 instances and SSL, but not autoscaling or deployment slots.",
        null,
        "Isolated does support everything, but it is not the only one: Standard already includes autoscaling and slots."
      ],
      "az-105": [
        "HPA creates more pods, which would also remain Pending because node capacity is lacking.",
        null,
        "The scheduler uses requests, not limits; raising limits does not free up capacity on the nodes.",
        "VPA adjusts pod requests/limits, but does not add nodes; the pods would still not fit."
      ],
      "az-106": [
        "Azure Batch is purpose-built for large-scale parallel and HPC workloads — it provisions, manages, and scales pools of compute nodes, distributes tasks, and tears down automatically after completion.",
        null,
        "Azure Batch is purpose-built for large-scale parallel and HPC workloads — it provisions, manages, and scales pools of compute nodes, distributes tasks, and tears down automatically after completion.",
        "Azure Batch is purpose-built for large-scale parallel and HPC workloads — it provisions, manages, and scales pools of compute nodes, distributes tasks, and tears down automatically after completion."
      ],
      "az-107": [
        "Spreading VMs across fault domains is what an Availability Set does, with the opposite goal (resilience, not proximity).",
        null,
        "Spreading across zones increases distance and latency; it is the opposite of a PPG.",
        "Reserving capacity is On-demand Capacity Reservation, not Proximity Placement Groups."
      ],
      "az-108": [
        "Spot VMs are not live-migrated when evicted; they are stopped (deallocated) or deleted depending on the eviction policy.",
        null,
        "Max price `-1` only avoids price-based eviction; Azure can still evict due to lack of capacity.",
        "Belonging to an Availability Set (or zone) does not protect a Spot VM from eviction."
      ],
      "az-109": [
        "AMA with DCR collects logs and metrics, but does not assess or install patches.",
        "Automation Update Management depended on the MMA agent and was retired (August 2024); its replacement is Azure Update Manager.",
        null,
        "State Configuration (DSC) manages desired configuration, not automatic patch assessment or installation."
      ],
      "az-110": [
        "AKS provides full Kubernetes orchestration including persistent volumes, service discovery, ingress, horizontal pod autoscaling, and namespace isolation — the right choice for complex multi-container workloads.",
        null,
        "AKS provides full Kubernetes orchestration including persistent volumes, service discovery, ingress, horizontal pod autoscaling, and namespace isolation — the right choice for complex multi-container workloads.",
        "AKS provides full Kubernetes orchestration including persistent volumes, service discovery, ingress, horizontal pod autoscaling, and namespace isolation — the right choice for complex multi-container workloads."
      ],
      "az-111": [
        "Bastion still uses RDP/SSH over the network to the VM; if the VM does not respond to RDP, Bastion will not connect either.",
        null,
        "Connection troubleshoot diagnoses connectivity, but does not show the boot screen or provide console access.",
        "Run Command depends on the VM agent in a working OS and does not show the boot screen."
      ],
      "az-112": [
        "Azure Firewall Standard application rules filter by FQDN, but do not inspect the HTTP payload for SQL injection or XSS.",
        "An NSG filters at layer 3-4 (IP/port) and does not understand HTTP content.",
        null,
        "DDoS Protection mitigates volumetric network attacks, not application attacks such as SQL injection or XSS."
      ],
      "az-113": [
        "Both are regional services; global load balancing is the domain of Front Door, Traffic Manager, or the cross-region Load Balancer.",
        null,
        "It is inverted: Load Balancer does not terminate TLS (layer 4); Application Gateway does perform TLS termination.",
        "It is inverted: WAF integrates with Application Gateway (and Front Door), not with Load Balancer."
      ],
      "az-114": [
        "Standard Load Balancer is regional (layer 4); it does not route users across continents by latency.",
        "Application Gateway is a regional layer 7 load balancer; it does not do global latency-based routing.",
        null,
        "Azure DNS alias records point to Azure resources, but do not do latency-based routing or health probes."
      ],
      "az-115": [
        "In an NSG there is no deny-over-allow precedence; the lowest matching priority number wins.",
        "Processing stops at the first match (lowest priority number); the last one does not win.",
        null,
        "Default rules (priority 65500) are only evaluated if no earlier rule matches; here rule 100 already matches."
      ],
      "az-116": [
        "A `VPN Gateway` connection requires provisioning and paying for virtual network gateways in both regions, as well as configuring tunnels and route tables.",
        "`ExpressRoute` requires contracting a private dedicated circuit with an external connectivity provider, with high provisioning complexity.",
        null,
        "`Azure Virtual WAN` is a large-scale connectivity architecture that requires provisioning virtual hubs, connections, and gateways."
      ],
      "az-117": [
        "`Service Endpoints` keep the PaaS service's public IP address as the destination on the backbone, so the resource still has a visible public endpoint.",
        null,
        "`VNet Integration` allows an App Service web app to send traffic into a VNet; it does not assign a private IP from the VNet to a receiving PaaS resource.",
        "`Network Security Groups` are layer 3/4 network packet filtering rules; they do not provide interfaces or private IP addresses for PaaS services."
      ],
      "az-118": [
        "An NSG only allows or blocks; it does not redirect traffic to the on-premises firewall.",
        "NAT Gateway provides internet egress from Azure using its own public IPs, exactly the opposite of sending it through on-premises.",
        null,
        "DNAT translates inbound traffic; it is not useful for forcing internet egress through on-premises."
      ],
      "az-119": [
        "The VM insights Map shows dependencies between processes, but does not record allowed/denied flows or offer traffic analytics.",
        "Azure Firewall logs only cover traffic that passes through the firewall, not all VM flows.",
        null,
        "Packet capture captures packets from a VM on demand, but does not offer continuous flow analysis or Traffic Analytics."
      ],
      "az-120": [
        "Private DNS zones cannot be publicly delegated; exposing them in public DNS defeats the purpose of the private zone.",
        "168.63.129.16 is a virtual IP reachable only from within Azure; on-premises cannot forward queries to it directly.",
        null,
        "Route filters apply to Microsoft peering for public services; they do not resolve private zone names."
      ],
      "az-121": [
        "The NIC's NSG is not ignored; it is evaluated after the subnet's for inbound traffic.",
        "The subnet NSG is also applied; there is no 'most specific wins' rule.",
        null,
        "Rules are not merged: each NSG is evaluated separately and the traffic must pass both."
      ],
      "az-122": [
        "A standard `VPN Gateway` has a limit on concurrent IPsec tunnels (typically 30 or 100 depending on SKU) and does not offer automatic hub-spoke orchestration or native large-scale SD-WAN integration.",
        null,
        "Multiple peerings with an NVA require manually configuring and maintaining UDR routing, third-party appliances, and non-transitive peering for 100 branches.",
        "Deploying 100 individual `ExpressRoute` circuits for branches would be economically prohibitive and complex to manage compared with an SD-WAN hub solution."
      ],
      "az-123": [
        "A `Diagnostic Setting` defines the destination where monitoring data is sent (e.g., Log Analytics or Storage); it does not evaluate conditions or issue alerts.",
        "`Activity Log` alerts react to Azure control plane operations (such as powering on or deleting the VM), not to internal OS performance metrics.",
        null,
        "Although it is possible to create a log query-based alert on the `Perf` table, the most direct, native, and lowest-latency way to monitor a numeric memory threshold is a metric alert rule."
      ],
      "az-124": [
        "`Metrics Explorer` charts aggregated numeric performance metrics (CPU usage, network, disk); it does not record control plane audit events or identities.",
        "`Log Analytics Workspace` would only contain that information if exporting the activity log to the workspace was previously configured.",
        null,
        "`Azure Advisor` analyzes the configuration of active resources to recommend cost, security, and performance improvements; it does not audit past deletion events."
      ],
      "az-125": [
        "`Metrics Explorer` only visualizes numeric performance time series; it does not support KQL queries on event log tables.",
        null,
        "`Azure Security Center` (Microsoft Defender for Cloud) presents processed security alerts and incidents, but the main console for writing and running ad-hoc KQL queries on security event tables is Log Analytics.",
        "`Azure Activity Log` stores Azure subscription control plane events, not the internal sign-in logs of the Windows or Linux operating system."
      ],
      "az-126": [
        "There are no standalone disk snapshots; backup is managed from the vault, which is where you choose the restore point.",
        null,
        "An ARM template recreates the infrastructure, but not the disk data from 3 days ago.",
        "The VM is protected with Azure Backup, not Site Recovery; moreover, ASR is for DR, not for returning to a state from days ago."
      ],
      "az-127": [
        "It is inverted: RPO is tolerable data loss and RTO is tolerable downtime.",
        null,
        "Backup frequency helps meet the RPO, but does not define it; retention has no relationship to the RTO.",
        "RPO is expressed in time (maximum age of the data), not in data volume."
      ],
      "az-128": [
        "ASR does not perform automatic failover; it must be initiated manually or via an automated recovery plan.",
        "Test failover is not a prerequisite, and planned failover requires the primary site to be available in order to shut down the VM.",
        "The VM is protected with Site Recovery, not Azure Backup; restoring a backup would give a worse RPO and RTO.",
        null
      ],
      "az-129": [
        "Azure Monitor Workbooks are interactive documents that combine KQL queries, metrics visualizations, text, and parameter controls into shareable, parameterized reports — much richer than static dashboard tiles.",
        null,
        "Azure Monitor Workbooks are interactive documents that combine KQL queries, metrics visualizations, text, and parameter controls into shareable, parameterized reports — much richer than static dashboard tiles.",
        "Azure Monitor Workbooks are interactive documents that combine KQL queries, metrics visualizations, text, and parameter controls into shareable, parameterized reports — much richer than static dashboard tiles."
      ],
      "az-130": [
        "That describes a ReadOnly lock; CanNotDelete only blocks delete operations.",
        null,
        "With CanNotDelete anyone with RBAC write permissions can modify; Owner is not required.",
        "Updating tags is a write operation (PATCH), not a deletion and recreation of the resource."
      ]
    },
    "glossary": [
      {
        "term": "Azure Policy",
        "cat": "Governance",
        "d": 1,
        "def": "Service that evaluates resources in Azure against corporate rules (Deny, Audit, Modify, Append, DeployIfNotExists)."
      },
      {
        "term": "CanNotDelete Lock",
        "cat": "Governance",
        "d": 1,
        "def": "Resource lock that prevents deleting a resource or resource group even for users with the Owner role, while still allowing modification."
      },
      {
        "term": "Conditional Access",
        "cat": "Identities",
        "d": 1,
        "def": "Entra ID policy engine (requires P1+) that evaluates user, location, and risk signals to enforce controls such as MFA."
      },
      {
        "term": "PIM (Privileged Identity Management)",
        "cat": "Identities",
        "d": 1,
        "def": "Entra ID P2 feature that delivers Just-In-Time privileged access (time-limited and with approval)."
      },
      {
        "term": "ZRS vs GRS",
        "cat": "Storage",
        "d": 2,
        "def": "ZRS replicates synchronously across 3 zones within a single region; GRS replicates asynchronously to a second paired region."
      },
      {
        "term": "Stored Access Policy (SAS)",
        "cat": "Storage",
        "d": 2,
        "def": "Policy on the container or queue that lets you change permissions or revoke a Service SAS without regenerating the account key."
      },
      {
        "term": "Private Endpoint",
        "cat": "Networking",
        "d": 4,
        "def": "Network interface with a private IP from your VNet that privately connects to a PaaS service (Storage, SQL, Key Vault) via Private Link."
      },
      {
        "term": "Azure Bastion",
        "cat": "Compute",
        "d": 3,
        "def": "Managed PaaS service that provides RDP and SSH connectivity over TLS from the portal without exposing public IPs on the VMs."
      },
      {
        "term": "Application Gateway",
        "cat": "Networking",
        "d": 4,
        "def": "Regional layer 7 (HTTP/HTTPS) load balancer with TLS termination, path-based routing, and integrated WAF."
      },
      {
        "term": "Activity Log",
        "cat": "Monitor",
        "d": 5,
        "def": "Azure control plane audit log that answers who, what, and when resources were created, updated, or deleted."
      },
      {
        "term": "Azure Site Recovery (ASR)",
        "cat": "Backup & DR",
        "d": 5,
        "def": "Continuous replication and failover orchestration service for virtual machines between Azure regions or from on-premises."
      }
    ]
  };
})(window);
