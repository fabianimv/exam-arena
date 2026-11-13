/* =========================================================================
   data/k8s-kcna/exam.js — CNCF · Kubernetes & Cloud Native Associate (KCNA) (English)
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["k8s-kcna"] = {
    "id": "k8s-kcna",
    "appId": "k8s-kcna",
    "provider": "CNCF / Kubernetes",
    "badge": "CNCF · KCNA",
    "icon": "☸️",
    "color": "#326ce5",
    "featured": false,
    "title": "CNCF · Kubernetes & Cloud Native Associate (KCNA)",
    "subtitle": "K8s Architecture, Scheduling, OCI Containers, Observability, GitOps, and Service Mesh",
    "passingScore": 75,
    "domains": {
      "1": "Kubernetes Fundamentals (46 %)",
      "2": "Container Orchestration (22 %)",
      "3": "Cloud Native Architecture (16 %)",
      "4": "Cloud Native Observability (8 %)",
      "5": "Application Delivery and GitOps (8 %)"
    },
    "shortDomains": {
      "1": "K8s Core",
      "2": "Orchestration",
      "3": "Cloud Native",
      "4": "Observability",
      "5": "GitOps & CI/CD"
    },
    "topics": [
      {
        "id": "kcna-t-1-1",
        "d": 1,
        "title": "1.1 · Kubernetes Architecture: Control Plane and Worker Nodes",
        "html": "\n<h4>The brain of the cluster: Control Plane Architecture</h4>\n<p>The <b>Control Plane</b> manages the global state of the Kubernetes cluster, detects and responds to events (such as creating replicas when a pod fails), and makes scheduling decisions. Its key components are:</p>\n<table class=\"keytable\">\n<tr><th>Component</th><th>Role and Main Function</th><th>Key Interaction</th></tr>\n<tr><td><b><code>kube-apiserver</code></b></td><td>Front door and central REST API of the cluster; validates and configures data for pods, services, and controllers.</td><td>It is the <b>only</b> component that communicates directly with <code>etcd</code>. All other components talk through it.</td></tr>\n<tr><td><b><code>etcd</code></b></td><td>Distributed, consistent, highly available key-value store based on the <b>Raft</b> consensus algorithm.</td><td>Stores the entire cluster state. Requires an odd number of nodes (3 or 5) to maintain quorum <code>(N/2)+1</code>.</td></tr>\n<tr><td><b><code>kube-scheduler</code></b></td><td>Assigns newly created pods with no assigned node to viable, healthy nodes.</td><td>Evaluates requirements in two phases: <b>Filtering (Predicates)</b> to discard non-viable nodes and <b>Prioritization (Priorities/Scoring)</b> to score the remaining ones.</td></tr>\n<tr><td><b><code>kube-controller-manager</code></b></td><td>Runs the continuous control loops that reconcile the current state with the desired state.</td><td>Groups multiple controllers: Node Controller, Deployment Controller, ReplicaSet Controller, ServiceAccount Controller.</td></tr>\n<tr><td><b><code>cloud-controller-manager</code></b></td><td>Integrates cloud provider-specific logic (AWS, Azure, GCP), separating it from the Kubernetes core.</td><td>Manages external load balancers (<code>LoadBalancer</code>), cloud network routes, and instance/node lifecycles.</td></tr>\n</table>\n\n<h4>Execution on Worker Nodes</h4>\n<p>Worker nodes run the user's actual workloads in containers grouped into Pods:</p>\n<table class=\"keytable\">\n<tr><th>Component</th><th>Role and Main Function</th></tr>\n<tr><td><b><code>kubelet</code></b></td><td>Main agent that runs on every node. Receives Pod specifications (<code>PodSpecs</code>) from the apiserver and ensures containers are running and healthy by interacting with the runtime via <b>CRI</b>.</td></tr>\n<tr><td><b><code>kube-proxy</code></b></td><td>Network proxy that maintains traffic forwarding rules on each node (using <code>iptables</code> or <code>IPVS</code>), implementing the <b>Service</b> abstraction and internal load balancing.</td></tr>\n<tr><td><b>Container Runtime (CRI)</b></td><td>Software in charge of pulling images and running containers (for example, <code>containerd</code> or <code>CRI-O</code>), implementing the OCI (Open Container Initiative) specification.</td></tr>\n</table>\n<div class=\"tip\"><b>Key for KCNA:</b> No component or user ever writes to <code>etcd</code> directly except <code>kube-apiserver</code>. If the apiserver is down, existing pods keep running on the nodes, but no declarative changes can be made and the cluster cannot be queried.</div>\n"
      },
      {
        "id": "kcna-t-1-2",
        "d": 1,
        "title": "1.2 · Core Kubernetes Primitives and Workloads",
        "html": "\n<h4>Object Hierarchy and Workloads</h4>\n<p>Kubernetes provides declarative abstractions designed for different computing patterns:</p>\n<table class=\"keytable\">\n<tr><th>Object</th><th>Purpose and Usage Pattern</th><th>Behavior on Failure</th></tr>\n<tr><td><b><code>Pod</code></b></td><td>Smallest atomic unit of deployment. Groups one or more containers that share storage, network (same IP address and <code>localhost</code>), and IPC.</td><td>It is ephemeral. If it dies or the node fails, the pod is not recreated on its own; a controller is required.</td></tr>\n<tr><td><b><code>ReplicaSet</code></b></td><td>Maintains a stable, guaranteed number of identical pod replicas running at all times through selectors.</td><td>Creates new pods or deletes surplus ones to exactly match the <code>spec.replicas</code> field.</td></tr>\n<tr><td><b><code>Deployment</code></b></td><td>Higher-level declarative controller that manages ReplicaSets. Supports <b>Rolling Updates</b>, pausing rollouts, and automatic <b>Rollbacks</b>.</td><td>Ideal for stateless web applications and APIs (<i>stateless</i>). ReplicaSets are never created directly.</td></tr>\n<tr><td><b><code>StatefulSet</code></b></td><td>For stateful applications (databases, Kafka) that need stable ordinal identities (<code>app-0</code>, <code>app-1</code>), predictable DNS, and dedicated persistent storage (<code>volumeClaimTemplates</code>).</td><td>Strict order of deployment, scaling, and sequential termination (from highest to lowest index).</td></tr>\n<tr><td><b><code>DaemonSet</code></b></td><td>Ensures that a copy of the pod runs on <b>all</b> (or a specific subset of) the cluster's nodes.</td><td>Ideal for infrastructure agents: log collectors (Fluentd), metrics (node-exporter), or CNI proxies.</td></tr>\n<tr><td><b><code>Job</code> / <code>CronJob</code></b></td><td><code>Job</code> runs pods until a specified number of tasks complete successfully (batch). <code>CronJob</code> adds time-based scheduling (crontab format).</td><td>Ends the pod in <code>Completed</code> without restarting it indefinitely (<code>restartPolicy: OnFailure</code> or <code>Never</code>).</td></tr>\n</table>\n\n<h4>Configuration Decoupling: ConfigMaps and Secrets</h4>\n<p>To respect the principles of the <i>12-Factor App</i>, code and configuration must be strictly separated:</p>\n<ul>\n<li><b><code>ConfigMap</code>:</b> Stores plain-text configuration (environment variables, configuration files, or CLI arguments) decoupled from the container image.</li>\n<li><b><code>Secret</code>:</b> Stores confidential data (passwords, OAuth tokens, SSH keys). By default they are stored base64-encoded in the API and can be encrypted at rest (<i>encryption at rest</i>) in <code>etcd</code>.</li>\n<li><b><code>Namespace</code>:</b> Logical partition of a physical cluster to isolate environments (dev, staging, prod), teams, or projects, applying resource limits (<code>ResourceQuota</code>) and permissions with RBAC.</li>\n</ul>\n<div class=\"tip\"><b>Typical KCNA question:</b> A <code>Namespace</code> does not by itself provide network or kernel isolation. To isolate traffic between namespaces, <code>NetworkPolicies</code> are required.</div>\n"
      },
      {
        "id": "kcna-t-2-1",
        "d": 2,
        "title": "2.1 · Pod Lifecycle, Scheduling, and Resource Management",
        "html": "\n<h4>Requests vs. Limits and Quality of Service (QoS) Classes</h4>\n<p>The scheduler (<code>kube-scheduler</code>) and the Linux kernel (via cgroups) manage container CPU and memory resources:</p>\n<table class=\"keytable\">\n<tr><th>Directive</th><th>Main Use</th><th>Effect of Exceeding the Limit</th></tr>\n<tr><td><b><code>resources.requests</code></b></td><td>Used exclusively by <code>kube-scheduler</code> to calculate whether a node has enough capacity to host the pod.</td><td>Guarantees a reserved minimum floor for the container on the node.</td></tr>\n<tr><td><b><code>resources.limits</code></b></td><td>Hard upper limit enforced by the kernel through cgroups.</td><td>For <b>CPU</b> it causes throttling (<i>CFS Throttling</i>); for <b>Memory</b> it causes immediate termination by the kernel: <code>OOMKilled (Exit Code 137)</code>.</td></tr>\n</table>\n\n<h4>QoS (Quality of Service) Classes and Eviction Priority</h4>\n<ol>\n<li><b><code>Guaranteed</code>:</b> Both CPU and memory have <code>requests</code> and <code>limits</code> defined and they are <b>exactly equal</b> for all containers. They are the last to be evicted when the node is saturated.</li>\n<li><b><code>Burstable</code>:</b> At least one container has <code>requests</code> or <code>limits</code> configured but they do not meet the strict Guaranteed condition.</li>\n<li><b><code>BestEffort</code>:</b> No container defines either requests or limits. They are the first to be removed when the node suffers memory or disk pressure.</li>\n</ol>\n\n<h4>Kubelet Health Probes</h4>\n<table class=\"keytable\">\n<tr><th>Probe</th><th>Behavior on Failure</th><th>Recommended Use Case</th></tr>\n<tr><td><b><code>startupProbe</code></b></td><td>Temporarily disables liveness and readiness while the application starts. If it exceeds the retries, the kubelet restarts the pod.</td><td>Legacy or heavy services that take minutes to start, avoiding premature restart loops.</td></tr>\n<tr><td><b><code>readinessProbe</code></b></td><td>If it fails, the Pod is <b>not restarted</b>, but its IP is immediately removed from the Service's Endpoints.</td><td>Indicates whether the container is ready to receive user traffic (e.g. cache warm-up or DB connection established).</td></tr>\n<tr><td><b><code>livenessProbe</code></b></td><td>If it fails consecutively, the <code>kubelet</code> kills the container and applies the Pod's <code>restartPolicy</code>.</td><td>Detect deadlocks or unrecoverable internal failures where the process is still alive but cannot make progress.</td></tr>\n</table>\n<div class=\"tip\"><b>Golden rule:</b> Never use a <code>livenessProbe</code> to check an external database. If the DB suffers latency, Kubernetes will kill all your pods at once, causing a cascading restart storm.</div>\n"
      },
      {
        "id": "kcna-t-2-2",
        "d": 2,
        "title": "2.2 · Networking and Persistent Storage in Kubernetes",
        "html": "\n<h4>The Kubernetes Networking Model and CNI</h4>\n<p>Kubernetes imposes a flat, fundamental network model: <b>every Pod has its own unique, routable IP address</b> within the cluster. Two pods can communicate directly by IP without needing NAT. This abstraction is implemented by a <b>CNI (Container Network Interface)</b> plugin such as Calico, Flannel, or Cilium.</p>\n\n<h4>Service Types (<code>Service</code>)</h4>\n<table class=\"keytable\">\n<tr><th>Type</th><th>Scope and Operation</th><th>Main Use Case</th></tr>\n<tr><td><b><code>ClusterIP</code></b> (Default)</td><td>Assigns a stable internal virtual IP reachable only from within the cluster.</td><td>Internal communication between microservices (backend, database, queues).</td></tr>\n<tr><td><b><code>NodePort</code></b></td><td>Opens a static port (default range <code>30000-32767</code>) on the IP of <b>every worker node</b> in the cluster.</td><td>Basic external access for development or integration with pre-existing load balancers.</td></tr>\n<tr><td><b><code>LoadBalancer</code></b></td><td>Creates a <code>NodePort</code> internally and interacts with the cloud provider to provision a public/private load balancer with an external IP.</td><td>Direct exposure of critical services to the Internet in managed cloud environments.</td></tr>\n<tr><td><b><code>ExternalName</code></b></td><td>Maps the service to an external DNS name (CNAME record), with no load balancing or proxy IPs.</td><td>Connect pods with external services (e.g. RDS, CloudSQL, or third-party APIs).</td></tr>\n</table>\n\n<h4>Network Security with NetworkPolicy</h4>\n<p>By default, the Kubernetes network is <b>non-isolated</b>: any pod can communicate with any other pod in any namespace. A <b><code>NetworkPolicy</code></b> resource lets you define filtering rules at layers 3 and 4 (IP, ports, Pod and Namespace selectors). When a policy is applied to a pod, it enters <i>default-deny</i> mode for traffic not explicitly allowed.</p>\n\n<h4>Persistent Storage: CSI, PV, PVC, and StorageClass</h4>\n<ul>\n<li><b><code>CSI (Container Storage Interface)</code>:</b> Open standard that allows storage providers to integrate their drivers into Kubernetes without touching the project's source code.</li>\n<li><b><code>StorageClass</code>:</b> Defines the storage provisioner and parameters for dynamic volume provisioning.</li>\n<li><b><code>PersistentVolume (PV)</code>:</b> Storage resource in the cluster provisioned by an administrator or dynamically through a StorageClass.</li>\n<li><b><code>PersistentVolumeClaim (PVC)</code>:</b> Storage request made by a developer specifying size and access mode:\n  <ul>\n    <li><b><code>ReadWriteOnce (RWO)</code>:</b> Mountable in read/write mode by a single node at a time (block disks).</li>\n    <li><b><code>ReadOnlyMany (ROX)</code>:</b> Mountable in read-only mode by multiple nodes concurrently.</li>\n    <li><b><code>ReadWriteMany (RWX)</code>:</b> Mountable in read/write mode by multiple nodes simultaneously (shared file systems such as NFS or CephFS).</li>\n  </ul>\n</li>\n</ul>\n"
      },
      {
        "id": "kcna-t-3-1",
        "d": 3,
        "title": "3.1 · Cloud Native Architecture Principles and the CNCF Ecosystem",
        "html": "\n<h4>What is Cloud Native according to the CNCF?</h4>\n<p>The <b>Cloud Native Computing Foundation (CNCF)</b> defines <i>Cloud Native</i> technologies as those that empower organizations to build and run scalable applications in modern, dynamic environments such as public, private, and hybrid clouds. Their essential characteristics are:</p>\n<ul>\n<li><b>Containers:</b> Self-contained, reproducible packaging of the application with all its dependencies.</li>\n<li><b>Service Meshes:</b> Intelligent, secure management of communication between services.</li>\n<li><b>Microservices:</b> Small, autonomous, decoupled services that are deployed independently.</li>\n<li><b>Immutable Infrastructure:</b> Servers and containers are never modified in production; they are destroyed and replaced with new versions.</li>\n<li><b>Declarative APIs:</b> The operator declares the desired state and the automated system takes care of reconciling the actual state.</li>\n</ul>\n\n<h4>CNCF Project Maturity Stages</h4>\n<p>The CNCF organizes its projects into three graduation levels according to their community adoption, governance, and production maturity:</p>\n<table class=\"keytable\">\n<tr><th>Level</th><th>Maturity Criteria</th><th>Example Projects</th></tr>\n<tr><td><b>Sandbox</b></td><td>Early-stage, experimental, or research projects with promising potential. Minimal adoption requirements.</td><td>KEDA (formerly), OpenFeature, Telepresence.</td></tr>\n<tr><td><b>Incubating</b></td><td>Projects with demonstrated production use, active governance, and a solid base of contributors.</td><td>Cilium (prior to graduation), gRPC, Dapr, Notary.</td></tr>\n<tr><td><b>Graduated</b></td><td>Highest level of technical maturity, audited security, broad adoption in mission-critical environments, and demonstrated neutral governance.</td><td><b>Kubernetes, Prometheus, Envoy, Helm, containerd, CoreDNS, Jaeger, Fluentd, OpenTelemetry</b>.</td></tr>\n</table>\n<div class=\"tip\"><b>KCNA exam tip:</b> Clearly identify which projects are <i>Graduated</i>. Common questions ask whether foundational projects such as Kubernetes, Prometheus, Envoy, Helm, or containerd have reached official CNCF graduation status.</div>\n"
      },
      {
        "id": "kcna-t-3-2",
        "d": 3,
        "title": "3.2 · Service Mesh, Security, RBAC, and Gateway API",
        "html": "\n<h4>Service Mesh: Decoupling the Network from Application Logic</h4>\n<p>A <b>Service Mesh</b> is a dedicated infrastructure layer that facilitates service-to-service communication (<i>East-West</i> traffic) in a secure, fast, and observable way. It is divided into two planes:</p>\n<ul>\n<li><b>Data Plane:</b> Lightweight sidecar proxies (commonly <b>Envoy</b>) injected alongside each application container. They intercept all inbound and outbound traffic without altering the app's code.</li>\n<li><b>Control Plane:</b> Manages and distributes configuration to the proxies (e.g. <b>Istio</b> or <b>Linkerd</b>), issuing mTLS certificates and routing policies.</li>\n</ul>\n<table class=\"keytable\">\n<tr><th>Capability</th><th>Immediate Benefit</th></tr>\n<tr><td><b>Mutual TLS (mTLS)</b></td><td>End-to-end encryption in transit and mutual cryptographic authentication of service identities without changing code.</td></tr>\n<tr><td><b>Traffic Resilience</b></td><td>Automatic retries, timeouts, circuit breaking, and rate limiting.</td></tr>\n<tr><td><b>Uniform Observability</b></td><td>Uniform generation of golden metrics (RPS, latency, errors) and distributed traces for all microservices.</td></tr>\n</table>\n\n<h4>Role-Based Access Control (RBAC)</h4>\n<p>In Kubernetes, every request is authenticated and then authorized through <b>RBAC</b>. The components are:</p>\n<ul>\n<li><b><code>Role</code> vs. <code>ClusterRole</code>:</b> A <code>Role</code> defines permissions within a <b>specific namespace</b> (e.g. read pods in <i>default</i>). A <code>ClusterRole</code> defines permissions cluster-wide (e.g. list nodes, or read pods in all namespaces).</li>\n<li><b><code>RoleBinding</code> vs. <code>ClusterRoleBinding</code>:</b> Binds a Role or ClusterRole to a subject (user, group, or <code>ServiceAccount</code>).</li>\n<li><b><code>ServiceAccount</code>:</b> Provides a managed identity for processes running inside Pods to interact with the <code>kube-apiserver</code>.</li>\n</ul>\n\n<h4>Evolution: From Ingress to the Gateway API</h4>\n<p>The traditional <code>Ingress</code> resource suffered from a lack of expressiveness and an overload of proprietary annotations. The <b>Gateway API</b> is its modern, role-oriented successor:</p>\n<ul>\n<li><b><code>GatewayClass</code>:</b> Managed by the infrastructure administrator (defines the controller).</li>\n<li><b><code>Gateway</code>:</b> Managed by the cluster/network operator (defines ports and TLS certificates).</li>\n<li><b><code>HTTPRoute</code> / <code>GRPCRoute</code>:</b> Managed by the application developer (defines forwarding rules and filters).</li>\n</ul>\n"
      },
      {
        "id": "kcna-t-4-1",
        "d": 4,
        "title": "4.1 · The Three Pillars of Cloud Native Observability",
        "html": "\n<h4>Metrics, Logs, and Distributed Traces</h4>\n<p><b>Observability</b> is the ability to infer the internal states of a complex system from the analysis of its external telemetry outputs:</p>\n<table class=\"keytable\">\n<tr><th>Pillar</th><th>Nature of the Data</th><th>Main Purpose</th><th>CNCF Technologies</th></tr>\n<tr><td><b>Metrics</b></td><td>Numeric values measured at regular intervals (counters, gauges, histograms). Very storage-efficient.</td><td>Anomaly detection, real-time alerts, performance dashboards, and SLO calculation.</td><td><b>Prometheus</b>, Thanos, Cortex.</td></tr>\n<tr><td><b>Logs</b></td><td>Discrete textual records with a timestamp generated by application events or errors.</td><td>Deep forensic investigation of failures and auditing of specific behavior.</td><td><b>Fluentd</b>, Fluent Bit, Grafana Loki.</td></tr>\n<tr><td><b>Traces (Tracing)</b></td><td>Representation of the full lifecycle of a request that traverses multiple microservices (composed of <i>Spans</i> with temporal and causal context).</td><td>Precise identification of latency bottlenecks and slow or broken dependencies.</td><td><b>Jaeger</b>, <b>OpenTelemetry</b>.</td></tr>\n</table>\n\n<h4>OpenTelemetry (OTel): The Unified Standard</h4>\n<p><b>OpenTelemetry</b> is a CNCF <i>Graduated</i> project born from the merger of <i>OpenTracing</i> and <i>OpenCensus</i>. It provides a unified collection of APIs, SDKs, and tools to generate and export metrics, logs, and traces in a way that is agnostic of the observability backend.</p>\n<ul>\n<li><b>OTel Collector:</b> High-performance telemetry proxy that receives data through the <b>OTLP</b> (OpenTelemetry Protocol) protocol, processes it (filters, enriches, samples), and exports it to backends such as Prometheus, Jaeger, or Datadog.</li>\n</ul>\n<div class=\"tip\"><b>KCNA Key:</b> OpenTelemetry standardizes telemetry instrumentation and collection, but it does not provide its own storage or visualization. To store and query metrics and traces it connects to backends such as Prometheus or Jaeger.</div>\n"
      },
      {
        "id": "kcna-t-4-2",
        "d": 4,
        "title": "4.2 · Cluster Monitoring, Telemetry with Prometheus and Alertmanager",
        "html": "\n<h4>Prometheus Architecture</h4>\n<p><b>Prometheus</b> is the <i>de facto</i> standard for monitoring cloud-native systems. Its structural characteristics are:</p>\n<ul>\n<li><b>Pull Model (Scraping):</b> Prometheus actively polls the HTTP endpoints (usually <code>/metrics</code>) of targets at configured intervals, instead of waiting for services to push data.</li>\n<li><b>Time-Series Database (TSDB):</b> Stores data on disk as time series made up of a metric identifier, labels (<i>key-value labels</i>), and timestamped float values.</li>\n<li><b>PromQL:</b> Powerful functional query language to aggregate, filter, and compute derivatives and rates over metrics (e.g. <code>rate(http_requests_total[5m])</code>).</li>\n</ul>\n\n<h4>Monitoring Ecosystem Components</h4>\n<table class=\"keytable\">\n<tr><th>Component</th><th>Role in the Platform</th></tr>\n<tr><td><b><code>cAdvisor</code></b></td><td>Daemon embedded directly in the <code>kubelet</code> that collects and exposes CPU, memory, network, and disk usage metrics of the containers running on each node.</td></tr>\n<tr><td><b><code>node-exporter</code></b></td><td>Agent deployed as a <code>DaemonSet</code> to collect operating system and host hardware metrics (kernel, CPU, swap, filesystem).</td></tr>\n<tr><td><b><code>metrics-server</code></b></td><td>Lightweight in-memory component that aggregates basic usage metrics for the CLI (<code>kubectl top</code>) and for pod autoscaling (<b>HPA</b>). It does not persist historical data.</td></tr>\n<tr><td><b><code>Alertmanager</code></b></td><td>Service that receives alerts fired by Prometheus rules, deduplicates them, groups them by service/severity, and sends them to receivers (Slack, PagerDuty, Email).</td></tr>\n</table>\n\n<h4>SRE Concepts: SLI, SLO, and Error Budgets</h4>\n<ul>\n<li><b>SLI (Service Level Indicator):</b> Real-time quantitative metric of the service (e.g. success rate of HTTP requests).</li>\n<li><b>SLO (Service Level Objective):</b> Agreed internal target for the SLI over a period (e.g. 99.9% success over 30 days).</li>\n<li><b>Error Budget:</b> The allowed margin of failure <code>(100% - SLO)</code>. If the budget is exhausted, deployments are frozen to prioritize stability.</li>\n</ul>\n"
      },
      {
        "id": "kcna-t-5-1",
        "d": 5,
        "title": "5.1 · GitOps Principles and Declarative Continuous Deployment",
        "html": "\n<h4>What is GitOps?</h4>\n<p><b>GitOps</b> is an operating model for cloud-native applications that uses <b>Git as the Single Source of Truth</b> for declarative infrastructure and applications. The CNCF <b>OpenGitOps</b> initiative establishes four fundamental principles:</p>\n<ol>\n<li><b>Declarative:</b> The entire desired system state must be expressed declaratively (YAML manifests, Kustomize, Helm).</li>\n<li><b>Versioned and Immutable:</b> The desired state is stored in Git, allowing full auditing, change history, and instant rollback capability.</li>\n<li><b>Pulled Automatically (Pull):</b> Software agents in the cluster actively pull the desired state from Git (<i>Pull</i> model), instead of an external CI pipeline running <code>kubectl apply</code> with administrative credentials (<i>Push</i> model).</li>\n<li><b>Continuously Reconciled:</b> The agent permanently compares the cluster's actual state with the state in Git. If it detects divergence (<i>Drift</i>), it reconciles the system automatically (<i>Self-Healing</i>).</li>\n</ol>\n\n<h4>Push Model vs. Pull Model in Continuous Deployment</h4>\n<table class=\"keytable\">\n<tr><th>Criterion</th><th>Traditional CI/CD (Push Model)</th><th>GitOps (Pull Model - ArgoCD / Flux)</th></tr>\n<tr><td><b>Cluster Access</b></td><td>The CI server (Jenkins, GitHub Actions) must hold administrator credentials (kubeconfig) for the cluster, creating a critical security risk.</td><td>The operator (<b>ArgoCD / Flux</b>) runs <b>inside</b> the cluster and pulls from Git with read-only permissions. No credentials are exposed outside.</td></tr>\n<tr><td><b>Drift Detection</b></td><td>If someone manually modifies a resource with <code>kubectl edit</code>, the CI pipeline does not find out until the next deployment.</td><td>The operator detects the manual change within seconds and overwrites it to restore the Git state.</td></tr>\n<tr><td><b>Auditing and Rollback</b></td><td>Rollbacks require re-running complex pipelines or manual scripts.</td><td>A rollback is performed simply by running <code>git revert</code> on the Git repository.</td></tr>\n</table>\n<div class=\"tip\"><b>CNCF Graduated Projects in GitOps:</b> Both <b>Argo CD</b> and <b>Flux</b> are CNCF <i>Graduated</i> projects that implement the GitOps pattern on Kubernetes.</div>\n"
      },
      {
        "id": "kcna-t-5-2",
        "d": 5,
        "title": "5.2 · Packaging and Modern Application Delivery Strategies",
        "html": "\n<h4>Package Management and Templating: Helm vs. Kustomize</h4>\n<p>Managing complex manifests across multiple environments (dev, QA, prod) is addressed with two main tools in the CNCF ecosystem:</p>\n<table class=\"keytable\">\n<tr><th>Feature</th><th>Helm (The K8s package manager)</th><th>Kustomize (Template-free customization)</th></tr>\n<tr><td><b>Approach</b></td><td>Uses a Go template engine (<i>Go Templates</i>) and <code>values.yaml</code> files to generate dynamic manifests.</td><td>Template-free approach (<i>template-free</i>); uses base layers (<i>bases</i>) and declarative overrides (<i>overlays</i>).</td></tr>\n<tr><td><b>Structure</b></td><td>Packaged in <b>Charts</b> with <code>Chart.yaml</code>, <code>templates/</code>, and versioned dependencies in OCI repositories.</td><td>Uses a <code>kustomization.yaml</code> file that defines patches and resources. Natively integrated into <code>kubectl</code> (<code>kubectl apply -k</code>).</td></tr>\n<tr><td><b>Version Management</b></td><td>Keeps a history of <i>releases</i> in the cluster (stored as Secrets), allowing <code>helm rollback</code>.</td><td>Keeps no internal state in the cluster; delegates versioning purely to Git.</td></tr>\n</table>\n\n<h4>Application Deployment Strategies</h4>\n<table class=\"keytable\">\n<tr><th>Strategy</th><th>How It Works</th><th>Pros and Cons</th></tr>\n<tr><td><b>Recreate</b></td><td>Destroys all existing replicas (v1) before creating the new replicas (v2).</td><td>Simple and free of version concurrency issues in the DB, but causes <b>downtime</b>.</td></tr>\n<tr><td><b>Rolling Update</b></td><td>Gradually replaces v1 pods with v2 pods by controlling <code>maxSurge</code> and <code>maxUnavailable</code>.</td><td>Kubernetes default strategy. Zero downtime, but requires v1 and v2 to coexist and support the same data schema.</td></tr>\n<tr><td><b>Blue/Green</b></td><td>Deploys the complete new environment (Green) in parallel to the current one (Blue). When Green is validated, the Service or Ingress switches the selector instantly.</td><td>Zero downtime and instant rollback by switching the selector. Doubles infrastructure resource consumption during the cutover.</td></tr>\n<tr><td><b>Canary</b></td><td>Sends a small percentage of real traffic (e.g. 5% or 10%) to the new version (Canary) while 90% stays on v1. If the metrics are optimal, it is gradually promoted.</td><td>Minimizes the blast radius of bugs on real users. Requires an advanced Ingress Controller, Service Mesh, or tools such as <b>Argo Rollouts</b> or <b>Flagger</b>.</td></tr>\n</table>\n"
      }
    ],
    "questions": [
      {
        "id": "kcna-01",
        "d": 1,
        "t": "Control Plane Architecture",
        "q": "During a security audit of a Kubernetes cluster architecture, the cybersecurity team needs to identify which is the only Control Plane component that exposes the public REST API, authenticates and authorizes requests, and communicates directly and exclusively with the persistent data store `etcd`. Which component fulfills this function?",
        "o": [
          "`kube-scheduler`, since it evaluates compute resource requirements and calculates the suitable node for pods.",
          "`kube-controller-manager`, since it centralizes the continuous control loops that reconcile the desired state.",
          "`kube-apiserver`, since it exposes the REST endpoints, validates manifests, and is the only direct client of `etcd`.",
          "`kubelet`, since it resides on the worker nodes reporting container health to the central storage."
        ],
        "a": 2,
        "e": "The `kube-apiserver` is the central gateway of Kubernetes. It is the only cluster component that interacts directly with `etcd`; all other clients (controllers, scheduler, kubelet, and users via `kubectl`) must communicate through its REST API."
      },
      {
        "id": "kcna-02",
        "d": 1,
        "t": "etcd State Store",
        "q": "An infrastructure architect is designing the high-availability topology for the `etcd` state store in a production Kubernetes cluster. Why is it essential to deploy an odd number of members (for example, 3 or 5 instances) in the `etcd` cluster?",
        "o": [
          "To allow the Raft consensus algorithm to determine the strict majority `(N/2)+1` and tolerate network partitions without suffering split-brain.",
          "To double sequential write speed through hash partitioning and symmetric balancing of transactions between active and passive nodes.",
          "To ensure that the `kube-apiserver` can alternate independent TLS certificates in each cloud availability zone.",
          "To prevent the database from requiring periodic compaction of historical revisions on SSD block storage."
        ],
        "a": 0,
        "e": "`etcd` uses the Raft distributed consensus algorithm, which requires a strict majority (quorum) of `(N/2)+1` members to commit writes and elect a leader. An odd number maximizes fault tolerance: a 3-node cluster tolerates the loss of 1 node (quorum 2), while 4 nodes also tolerate only 1 failure (quorum 3) while consuming unnecessary extra resources."
      },
      {
        "id": "kcna-03",
        "d": 1,
        "t": "Scheduling with kube-scheduler",
        "q": "A machine learning inference Pod has been deployed that requests 4 dedicated GPUs and 32 GiB of RAM. When reviewing the deployment status, the Pod remains in `Pending` state. Which Control Plane component is responsible for evaluating the feasibility filters and scoring the nodes to assign this Pod?",
        "o": [
          "`kube-scheduler`, since it filters viable nodes using predicates and scores the candidates to select the final node.",
          "`kube-controller-manager`, since it monitors that the requested replicas exist and creates new nodes if the quota is not sufficient.",
          "`kubelet`, since it inspects the hardware drivers in the host operating system before accepting new workloads.",
          "`cloud-controller-manager`, since it automatically provisions GPU instances in the cloud provider's infrastructure."
        ],
        "a": 0,
        "e": "The `kube-scheduler` watches for newly created pods that have no assigned node (empty `nodeName`). It runs a two-step process: first filtering (Filtering/Predicates), where it discards nodes that do not meet resources or taints; and then prioritization (Scoring/Priorities), where it assigns a score to the remaining viable nodes to choose the best one."
      },
      {
        "id": "kcna-04",
        "d": 1,
        "t": "Reconciliation Loop",
        "q": "In the Kubernetes operating model, configuration is expressed declaratively. What is the main responsibility of the `kube-controller-manager` component in relation to this declarative paradigm?",
        "o": [
          "Compile the YAML manifests into binary images so the container runtime can run them on each worker node without needing to interpret text.",
          "Run continuous control loops that compare the cluster's current state with the desired state and apply continuous corrections.",
          "Cryptographically validate the JWT tokens issued to the administrator users who run frequent administrative commands with `kubectl`.",
          "Establish overlay network tunnels using VXLAN encapsulation between all the nodes that make up the cluster."
        ],
        "a": 1,
        "e": "The `kube-controller-manager` runs continuous control loops (reconciliation loops). On each iteration, it compares the desired state declared in Kubernetes objects with the actual state observed in the cluster and performs the necessary actions (such as creating or destroying pods) so that both match."
      },
      {
        "id": "kcna-05",
        "d": 1,
        "t": "Cloud Controller Manager",
        "q": "A company migrates its self-managed Kubernetes clusters to a public cloud infrastructure. What is the purpose of the `cloud-controller-manager` binary introduced in the modern Kubernetes architecture?",
        "o": [
          "Completely replace the `kubelet` on the nodes to allow running microservices without needing an operating system.",
          "Monitor pod memory saturation and send automatic alerts to the provider's monthly billing and analytics dashboards.",
          "Manage the provisioning of elastic clusters using Terraform templates embedded in the firmware of bare-metal hypervisors.",
          "Decouple cloud provider-dependent logic (load balancers, routes, and node instances) from the core Kubernetes code."
        ],
        "a": 3,
        "e": "The `cloud-controller-manager` allows cloud providers (AWS, Azure, Google Cloud, OpenStack, etc.) to integrate their platforms with Kubernetes without coupling proprietary code inside the main Kubernetes repository. It manages specific controllers for nodes, network routes, and `LoadBalancer`-type load balancers."
      },
      {
        "id": "kcna-06",
        "d": 1,
        "t": "Node Kubelet Agent",
        "q": "On every worker node of a Kubernetes cluster runs an essential process that acts as the system's main agent. What is the main responsibility of the `kubelet` in the node's day-to-day operation?",
        "o": [
          "Distribute HTTP traffic by balancing external requests among the pods according to the round-robin policy defined in the routing tables.",
          "Query the `etcd` database directly to synchronize network changes and apply perimeter isolation policies.",
          "Receive Pod specifications (`PodSpecs`) from the `kube-apiserver`, interact with the runtime via CRI, and monitor their health status.",
          "Run the source code build process when a developer pushes a new commit to a connected Git repository."
        ],
        "a": 2,
        "e": "The `kubelet` is the primary node agent. It receives `PodSpecs` (mainly from the `kube-apiserver`, or from local files in static pods), interacts with the container runtime through the CRI interface to create and stop containers, and runs health probes (liveness, readiness, startup), reporting the status of the node and pods to the apiserver."
      },
      {
        "id": "kcna-07",
        "d": 1,
        "t": "Routing with kube-proxy",
        "q": "A developer asks how requests directed to a `ClusterIP` virtual IP reach the correct backend pods within a worker node. Which network component implements this abstraction by programming forwarding rules in the node's operating system?",
        "o": [
          "`kube-proxy`, since it programs rules in `iptables` or `IPVS` on each node to forward traffic directed to Services to the Pods.",
          "`CoreDNS`, since it translates TCP packets at the physical link layer using ARP switching tables on the data center's physical network switches.",
          "`containerd`, since it encapsulates Ethernet frames in TLS headers before transmitting them to the physical network interface card.",
          "`kube-scheduler`, since it updates the kernel's static route tables every time a new container changes state."
        ],
        "a": 0,
        "e": "`kube-proxy` is the network component that runs on every worker node. It watches the `Service` and `Endpoints` (or `EndpointSlices`) objects through the apiserver and programs NAT filtering and forwarding rules in the Linux kernel (using `iptables` or `IPVS` modes) to translate the services' virtual IPs to the pods' real IPs."
      },
      {
        "id": "kcna-08",
        "d": 1,
        "t": "Control Plane High Availability",
        "q": "Which TWO Kubernetes Control Plane components use a Lease-based Leader Election mechanism to operate in active-passive mode and prevent multiple instances from making conflicting decisions simultaneously? (Select two)",
        "o": [
          "`kube-scheduler`",
          "`kube-apiserver`",
          "`kube-controller-manager`",
          "`kubelet`"
        ],
        "a": [
          0,
          2
        ],
        "e": "Both `kube-scheduler` and `kube-controller-manager` implement leader election (using `Lease` objects in Kubernetes). Even if multiple replicas are deployed on control plane nodes for high availability, only one instance acts as the active leader to prevent two schedulers from assigning the same pod or two controllers from duplicating replicas. In contrast, `kube-apiserver` is active-active with no leader (all instances serve traffic in parallel behind a load balancer)."
      },
      {
        "id": "kcna-09",
        "d": 1,
        "t": "CRI and Container Runtime",
        "q": "Historically, Kubernetes contained code specific to communicating with Docker. To decouple orchestration from the execution engine, the CNCF promoted a standard gRPC-based specification. What is this interface called that allows using runtimes such as `containerd` or `CRI-O`?",
        "o": [
          "`CNI (Container Network Interface)`, which manages IP addresses and packet routing between containers in the cluster through network tunnels.",
          "`CSI (Container Storage Interface)`, which defines interoperability for attaching and mounting persistent volumes.",
          "`OCI (Open Container Initiative)`, which exclusively defines the tarball file format of Helm manifests.",
          "`CRI (Container Runtime Interface)`, which standardizes gRPC communication between the `kubelet` and container runtimes."
        ],
        "a": 3,
        "e": "The `CRI` (Container Runtime Interface) is the standard gRPC API introduced in Kubernetes so that the `kubelet` can interact with any compatible container runtime (such as `containerd` or `CRI-O`) without needing to incorporate engine-specific code within the Kubernetes project."
      },
      {
        "id": "kcna-10",
        "d": 1,
        "t": "Pod Anatomy",
        "q": "A developer configures a multi-container Pod containing a web application and an auxiliary container (sidecar) to process logs. Which of the following statements accurately describes the environment shared by the containers within this same Pod?",
        "o": [
          "Each container receives an independent public IP address and they communicate with each other exclusively through the cluster's Ingress using TLS certificates.",
          "They share the same Network namespace (same IP address and communication via `localhost`), as well as mounted storage volumes.",
          "They run on physically distinct worker nodes to guarantee high availability against the unexpected loss of a server.",
          "They necessarily share the same read-only root file system and the same user space with no process isolation."
        ],
        "a": 1,
        "e": "A `Pod` is the smallest unit in Kubernetes. All containers that are part of the same Pod are always scheduled on the same worker node and share Linux kernel namespaces: Network namespace (they share the same pod IP and can communicate via `localhost` on different ports), IPC namespace, and they can share volumes declared in the pod."
      },
      {
        "id": "kcna-11",
        "d": 1,
        "t": "Deployments and ReplicaSets",
        "q": "A software engineering team needs to update a web application in production with no downtime, with the ability to perform automatic rollbacks if errors increase. Why is a `Deployment` object used instead of directly creating a `ReplicaSet`?",
        "o": [
          "Because ReplicaSets do not support pods with more than one container nor allow mounting secrets injected from environment variables.",
          "Because Deployments automatically run static code vulnerability scans before starting the pod lifecycle.",
          "Because the `Deployment` declaratively manages the lifecycle of multiple ReplicaSets, enabling rolling updates and rollbacks.",
          "Because the `ReplicaSet` was marked as deprecated in Kubernetes version 1.25 and can no longer be processed by the API Server."
        ],
        "a": 2,
        "e": "A `Deployment` is a higher-level declarative controller that manages `ReplicaSets`. When performing a version update (`RollingUpdate`), the Deployment creates a new ReplicaSet with the new image and gradually scales up the new one while scaling down the old one. If something fails, it allows reverting (`kubectl rollout undo`) to the previous ReplicaSet instantly."
      },
      {
        "id": "kcna-12",
        "d": 1,
        "t": "DaemonSet Controller",
        "q": "You need to collect the log files from every physical server in the cluster and send them to a central Elasticsearch cluster. For this, exactly one replica of the Fluentd agent must run on each of the cluster's worker nodes. Which workload primitive is ideal for this requirement?",
        "o": [
          "`DaemonSet`, since it guarantees that a copy of the Pod runs automatically on all (or the selected) nodes of the cluster.",
          "`StatefulSet`, since it assigns a fixed static IP address and an exclusive numbered persistent volume to each running replica.",
          "`Job`, since it runs the containers in the background until the successful completion code is reached in the batch task.",
          "`Deployment`, since it randomly recalculates the location of the agents on each service restart to avoid bottlenecks."
        ],
        "a": 0,
        "e": "A `DaemonSet` ensures that all (or a selection based on node selectors/taints) nodes run a copy of a Pod. As new nodes are added to the cluster, the DaemonSet automatically creates the Pod on them; when nodes are destroyed, the pods are removed. Typical cases: log collection (Fluentd), node metrics (node-exporter), or CNI agents."
      },
      {
        "id": "kcna-13",
        "d": 1,
        "t": "StatefulSet Controller",
        "q": "A data team needs to deploy an Apache ZooKeeper cluster on Kubernetes. The application requires each instance to keep a stable, predictable DNS hostname across restarts (`zk-0`, `zk-1`, `zk-2`) and to retain its own dedicated persistent disk storage. Which Kubernetes resource should they use?",
        "o": [
          "`DaemonSet`, since it provides hostnames derived from the name of the worker node on which the container was started.",
          "`Deployment`, since it allows associating a single shared NFS volume with concurrent reads for all active replicas of the cluster without lock collisions.",
          "`CronJob`, since it periodically restarts the instances, assigning new sequential identifiers when the execution time ends.",
          "`StatefulSet`, since it offers stable ordinal network identities, ordered termination, and dedicated volumes via `volumeClaimTemplates`."
        ],
        "a": 3,
        "e": "A `StatefulSet` is the controller designed for stateful workloads that need fixed, predictable network identities (ordinal indexes `name-0`, `name-1`), sequential order of deployment and update, and dedicated persistent storage for each replica through `volumeClaimTemplates` (the volume of `zk-0` is not reassigned to `zk-1` on restart)."
      },
      {
        "id": "kcna-14",
        "d": 1,
        "t": "Batch Workloads: Job vs CronJob",
        "q": "A financial application must run an accounting reconciliation every night at 02:00 AM UTC. The process takes approximately 20 minutes, processes pending transactions, and must release compute resources after finishing successfully. Which resource is the most appropriate to model this requirement?",
        "o": [
          "`Deployment`, setting `replicas: 1` and a `livenessProbe` that kills the container when the data reconciliation ends to force memory release.",
          "`CronJob`, since it creates `Job` objects recurrently according to a crontab-style time expression, terminating when the task completes.",
          "`DaemonSet`, since it ensures that the financial task runs on all worker nodes without interfering with production workloads.",
          "`StatefulSet`, since it guarantees that the process retains the same network identifier during the execution of the accounting calculations."
        ],
        "a": 1,
        "e": "A `CronJob` manages the periodic, time-based execution of batch tasks. At each interval specified by the cron syntax (e.g., `0 2 * * *`), it creates a `Job` object. The `Job` creates one or more pods that run until they complete their work successfully (`Completed`) and then stop, without consuming residual CPU/memory."
      },
      {
        "id": "kcna-15",
        "d": 1,
        "t": "Namespace Isolation",
        "q": "An organization shares a large Kubernetes cluster among three different development teams. They want to organize resources logically to avoid name collisions and enforce compute quota limits (`ResourceQuota`). Which Kubernetes primitive provides this kind of logical partitioning?",
        "o": [
          "`NodeSelector`, because it physically partitions the host's CPU cores and assigns them to the different teams through a hypervisor.",
          "`ClusterRole`, because it splits microservice network traffic into different virtual subnets with hardware encryption.",
          "`Namespace`, because it provides a logical partition within the cluster to isolate names, quotas, and access control policies.",
          "`StorageClass`, because it segments container storage disks, guaranteeing cryptographic isolation per user."
        ],
        "a": 2,
        "e": "`Namespaces` provide a mechanism for isolating groups of resources within a single physical cluster. They allow different teams or projects to use the same resource names without collisions, apply authorization policies through RBAC, and set limits on CPU, memory, and object count consumption through `ResourceQuota`."
      },
      {
        "id": "kcna-16",
        "d": 1,
        "t": "DNS Resolution Across Namespaces",
        "q": "The frontend pod in the `production` namespace needs to call, over HTTP, the billing API exposed by the `billing-svc` service that resides in the `finance` namespace. Assuming the cluster's default domain (`cluster.local`), what is the correct FQDN (Fully Qualified Domain Name) to connect to it?",
        "o": [
          "`billing-svc.production.pod.cluster.local`, because pod-to-pod queries always resolve within the originating namespace.",
          "`finance.billing-svc.k8s.internal`, because service names follow the cloud provider's reversed subdomain format.",
          "`http://billing-svc:8080/finance`, because Kubernetes uses relative paths in the HTTP protocol instead of standard DNS records.",
          "`billing-svc.finance.svc.cluster.local`, following the standard DNS name format for services across different namespaces."
        ],
        "a": 3,
        "e": "CoreDNS in Kubernetes resolves services using the standard FQDN convention: `<service-name>.<namespace>.svc.<cluster-domain>`. In this case, to reach the `billing-svc` service in the `finance` namespace, the full name resolvable from any namespace is `billing-svc.finance.svc.cluster.local`."
      },
      {
        "id": "kcna-17",
        "d": 1,
        "t": "Configuration Injection",
        "q": "Which TWO Kubernetes objects are commonly used to inject decoupled configuration into containers (through environment variables or files mounted as volumes), differing mainly in the sensitivity of the information they store? (Select two)",
        "o": [
          "`PersistentVolumeClaim`",
          "`ConfigMap`",
          "`NetworkPolicy`",
          "`Secret`"
        ],
        "a": [
          1,
          3
        ],
        "e": "`ConfigMap` and `Secret` are the two core Kubernetes objects for separating configuration from application code. `ConfigMap` stores key-value pairs and plain-text files for non-confidential configuration, while `Secret` stores confidential data (API keys, passwords, certificates) base64-encoded in the API and with encryption-at-rest support in `etcd`."
      },
      {
        "id": "kcna-18",
        "d": 1,
        "t": "Static Pods",
        "q": "When a Kubernetes cluster is initialized with `kubeadm`, the essential Control Plane components (such as `kube-apiserver`, `etcd`, and `kube-scheduler`) are started as Pods. However, there is no active scheduler at that point to schedule them. How are these components run on the control node?",
        "o": [
          "As `Static Pods`, managed directly by the `kubelet` by reading YAML manifests in the local directory `/etc/kubernetes/manifests`.",
          "As Docker Swarm containers running on a temporary virtual machine until the cluster reaches the Ready state and the scheduler takes control of the system.",
          "Through a startup script in `/etc/rc.local` that simulates apiserver responses using a static in-memory JSON file.",
          "Through an external Terraform controller that sends SSH commands to compile the Kubernetes code on the node."
        ],
        "a": 0,
        "e": "`Static Pods` are managed directly by the `kubelet` daemon on a specific node, without involvement from the `kube-apiserver` or the `kube-scheduler`. The kubelet periodically watches a local host directory (by default `/etc/kubernetes/manifests`) and creates the pods declared there. `kubeadm` uses this mechanism to bootstrap the Control Plane itself."
      },
      {
        "id": "kcna-19",
        "d": 1,
        "t": "Init Containers (initContainers)",
        "q": "A web application needs to verify that the database server is accepting connections and download a configuration file from an S3 bucket before starting its main process. Which Kubernetes primitive allows these preparatory tasks to run sequentially and in a blocking manner?",
        "o": [
          "`Ephemeral Containers`, because they run temporarily to collect memory dumps when a pod enters CrashLoopBackOff.",
          "`Sidecar Containers`, because they start simultaneously with the main app and run indefinitely, sharing the same lifecycle.",
          "`initContainers`, because they run sequentially before the application containers start and must complete successfully.",
          "`Pause Containers`, because they hold network traffic until the user manually sends a confirmation signal through the API."
        ],
        "a": 2,
        "e": "`initContainers` are specialized containers that run before the application's main containers start in a Pod. They always run sequentially: each one must finish successfully (`exit code 0`) before the next one begins. If an initContainer fails, Kubernetes restarts the pod until it completes successfully."
      },
      {
        "id": "kcna-20",
        "d": 1,
        "t": "Pod Lifecycle Phases",
        "q": "When querying a Pod with the `kubectl get pods` command, an operator looks at the `STATUS` field. Which of the following states corresponds to an official high-level phase of the `Pod` object lifecycle according to the Kubernetes specification?",
        "o": [
          "`CrashLoopBackOff`, which indicates that the container has reached the maximum memory limit allowed by its quality of service class and is terminated by the kernel.",
          "`Pending`, which indicates that the Pod has been accepted by the cluster but one or more of its containers have not yet been scheduled or created.",
          "`ImagePullBackOff`, which indicates that the image registry has revoked the authentication token of the developer who deployed the app.",
          "`Terminating`, which indicates that the kubelet has received an immediate forced eviction request without honoring grace periods."
        ],
        "a": 1,
        "e": "The official Pod lifecycle phases (`status.phase` field) are: `Pending`, `Running`, `Succeeded`, `Failed`, and `Unknown`. By contrast, `CrashLoopBackOff` and `ImagePullBackOff` are detailed container states (`waiting.reason`), and `Terminating` is a CLI display status during deletion, but not a formal phase of the object."
      },
      {
        "id": "kcna-21",
        "d": 1,
        "t": "Labels and Selectors",
        "q": "In Kubernetes, objects are not linked to each other through rigid static references, but through loose coupling based on key-value metadata. What is the mechanism a `Service` uses to dynamically identify which pods should receive its traffic?",
        "o": [
          "`Annotations`, because they store non-identifying information consumed by external monitoring and continuous integration tools.",
          "`ClusterIP`, because it automatically associates all pods within the same CIDR block of the worker node's subnet.",
          "`ResourceVersion`, because it connects controllers with pods that have the same cryptographic sequence number in `etcd`.",
          "`Labels` and `Label Selectors`, because the Service queries and matches the labels declared in the template of the active Pods."
        ],
        "a": 3,
        "e": "`Labels` are key-value pairs attached to Kubernetes objects. Controllers and services use `Label Selectors` to query and group resources in a decoupled way. For example, a Service with `selector: { app: backend }` will route traffic to all Pods that carry the label `app: backend`."
      },
      {
        "id": "kcna-22",
        "d": 1,
        "t": "Metadata and Annotations",
        "q": "An SRE team wants to attach information to Kubernetes manifests, including the Git commit hash, the responsible team's email address, and configuration directives for an external Ingress Controller. They do not need to filter pods using this data. Which metadata field should they use?",
        "o": [
          "`annotations`, because it allows storing large, unstructured, arbitrary metadata that is not used to select objects.",
          "`labels`, because labels are the only metadata field supported by the OpenAPI specification of Kubernetes schemas.",
          "`finalizers`, because they notify external controllers that they must record the commit in Git before authorizing pod creation.",
          "`ownerReferences`, because they link the Git developer's credentials to the cluster's administrative service account."
        ],
        "a": 0,
        "e": "`annotations` allow attaching arbitrary key-value metadata to Kubernetes objects. Unlike `labels`, annotations are not used to identify or select objects through efficient queries; they are intended to be read by external tools, libraries, specialized controllers (such as Ingress), or for auditing purposes."
      },
      {
        "id": "kcna-23",
        "d": 1,
        "t": "Graceful Pod Termination",
        "q": "When a Pod deletion is requested (for example, during a scale-down or a rollout), Kubernetes runs an orderly termination process. What is the standard sequence of signals and timings that the `kubelet` applies to the container's processes?",
        "o": [
          "It sends `SIGKILL` to the container immediately and then waits 30 seconds to confirm that the disk has been safely detached from the host by the kernel.",
          "It sends a `SIGSTOP` signal to freeze the container's memory and then exports a diagnostic dump to the apiserver.",
          "It sends `SIGTERM`, waits for the time defined in `terminationGracePeriodSeconds` (30s by default), and if the process has not exited, sends `SIGKILL`.",
          "It removes the pod's network interfaces and waits indefinitely until all process threads finish naturally."
        ],
        "a": 2,
        "e": "The graceful termination process of a Pod follows this order: 1) The pod moves to the Terminating state and is removed from the services' Endpoints; 2) The `preStop` hook runs if configured; 3) The `kubelet` sends the `SIGTERM` signal to the main process (PID 1); 4) It waits for the grace period (`terminationGracePeriodSeconds`, 30 seconds by default); 5) If the process has still not terminated, it sends `SIGKILL` to force an immediate shutdown."
      },
      {
        "id": "kcna-24",
        "d": 2,
        "t": "Resource Management: Requests vs Limits",
        "q": "An engineer configures the CPU and memory resources of a container within a Pod. What is the fundamental difference in behavior between `resources.requests` and `resources.limits` in Kubernetes?",
        "o": [
          "`requests` defines the maximum memory consumption before the node is rebooted, while `limits` is used to calculate the monthly cloud cost.",
          "`requests` restricts the number of HTTP requests per second the container can serve, while `limits` restricts network bandwidth.",
          "`requests` is used exclusively by the Linux kernel to apply CPU throttling, while `limits` is used by the scheduler for scheduling.",
          "`requests` is the guaranteed amount the scheduler uses to place the pod, while `limits` is the hard cap enforced by cgroups."
        ],
        "a": 3,
        "e": "`resources.requests` represents the minimum guaranteed amount of CPU and memory that the container needs; the `kube-scheduler` uses it to find a node with enough available capacity. By contrast, `resources.limits` is the hard upper limit enforced by the Linux kernel cgroups: exceeding the CPU limit causes throttling (CFS throttling), while exceeding the memory limit causes immediate termination by the OOM Killer (`OOMKilled`)."
      },
      {
        "id": "kcna-25",
        "d": 2,
        "t": "Quality of Service (QoS) Classes",
        "q": "A worker node runs out of available RAM and the kernel enters severe resource pressure. The `kubelet` must begin evicting pods to maintain operating system stability. Which QoS (Quality of Service) class will be the first to be selected for eviction?",
        "o": [
          "`Guaranteed`, because its replicas can be instantly recreated by the scheduler on other nodes in the cluster.",
          "`BestEffort`, because it defines no `requests` or `limits` values, making it the class with the lowest retention priority.",
          "`Burstable`, because it has consumed more memory than the average historically allocated by the namespace quota directives.",
          "`CriticalSystem`, because Kubernetes prioritizes user applications over the operating system's internal daemons."
        ],
        "a": 1,
        "e": "Kubernetes automatically classifies each Pod into a QoS class: 1) `Guaranteed` (requests = limits for CPU and memory in all containers); 2) `Burstable` (at least one request or limit defined); 3) `BestEffort` (no container defines requests or limits). Under memory pressure (MemoryPressure), `BestEffort` pods are the first to be evicted and terminated, followed by `Burstable` pods that exceed their requests, and finally `Guaranteed` pods."
      },
      {
        "id": "kcna-26",
        "d": 2,
        "t": "Taints and Tolerations",
        "q": "A cluster has 3 worker nodes equipped with high-cost GPU acceleration hardware. The platform administrator wants to ensure that no ordinary Pod is scheduled on these nodes unless the developer explicitly declares that their Pod can tolerate that restriction. Which mechanism should be implemented?",
        "o": [
          "Apply a `Taint` to the GPU nodes and configure a matching `Toleration` on the Pods that need to run on them.",
          "Configure a DenyAll `NetworkPolicy` in the namespace where the physical GPU servers are registered.",
          "Create a `ClusterRole` with read-only verbs assigned to the replication controller's default service account in each of the availability zones.",
          "Define a `LimitRange` with a value of zero in the shared memory field for all nodes that do not have hardware acceleration."
        ],
        "a": 0,
        "e": "`Taints` and `Tolerations` work together to ensure that pods are not assigned to inappropriate nodes. A Taint is applied to a node (`kubectl taint nodes nodo1 gpu=true:NoSchedule`) and acts as a repellent: the `kube-scheduler` will not schedule any pod on that node unless the pod has a matching `Toleration`."
      },
      {
        "id": "kcna-27",
        "d": 2,
        "t": "Node Affinity (NodeAffinity)",
        "q": "An engineering team needs its pods to run preferably on nodes that have the label `topology.kubernetes.io/zone=us-east-1a`, but if there is no capacity available in that zone, they accept being scheduled in any other zone rather than remaining in the Pending state. Which affinity configuration should they declare?",
        "o": [
          "`nodeSelector: { zone: us-east-1a }`, because `nodeSelector` automatically fails over to other available zones when the servers in the rack run out of capacity.",
          "`requiredDuringSchedulingIgnoredDuringExecution`, because it represents a strict, unbreakable rule that must be enforced.",
          "`preferredDuringSchedulingIgnoredDuringExecution`, because it defines a soft affinity that gives priority but does not block scheduling.",
          "`podAntiAffinity` with `topologyKey` set at the operating system level to force deployment onto different hypervisors."
        ],
        "a": 2,
        "e": "`NodeAffinity` offers two types of rules: `requiredDuringSchedulingIgnoredDuringExecution` (hard affinity, or hard rule, mandatory for the pod to be scheduled; if it is not met, the pod stays Pending) and `preferredDuringSchedulingIgnoredDuringExecution` (soft affinity, or soft rule, where the scheduler tries to satisfy the preference by giving a higher score to those nodes, but if they are not available, it will schedule the pod on another viable node)."
      },
      {
        "id": "kcna-28",
        "d": 2,
        "t": "Kubelet Health Probes",
        "q": "Which TWO statements correctly describe the fundamental difference between a `livenessProbe` and a `readinessProbe` run by the `kubelet` in a Pod? (Select two)",
        "o": [
          "If a `livenessProbe` fails consecutively, the kubelet restarts the affected container according to the `restartPolicy`.",
          "If a `livenessProbe` fails, the pod is immediately migrated to another worker node using a live migration command.",
          "If a `readinessProbe` fails, the kubelet permanently destroys the container's persistent storage volume.",
          "If a `readinessProbe` fails, the Pod is not restarted, but its IP address is removed from the Endpoints of all associated Services."
        ],
        "a": [
          0,
          3
        ],
        "e": "`livenessProbe` and `readinessProbe` have very different operational consequences: The `livenessProbe` determines whether the application is alive; if it fails, the `kubelet` kills the container and restarts it. The `readinessProbe` determines whether the application is ready to receive traffic; if it fails, the pod **is not restarted**, but it is temporarily excluded from the services' endpoints so that no user receives errors while the service recovers or initializes."
      },
      {
        "id": "kcna-29",
        "d": 2,
        "t": "Startup Probe (startupProbe)",
        "q": "A legacy microservice developed in Java typically takes between 90 and 120 seconds to load caches and dependencies during initialization. In previous deployments, the `livenessProbe` configured at 30 seconds repeatedly killed the container, causing a continuous restart loop (`CrashLoopBackOff`). Which native Kubernetes solution solves this problem optimally?",
        "o": [
          "Increase the container's memory limit to 64 GiB to force the Java virtual machine to disable Just-In-Time compilation and reserve space in the memory heap.",
          "Configure a `startupProbe` with a sufficient grace period, because it disables liveness and readiness checks until it responds successfully.",
          "Remove all health probes from the manifest and delegate monitoring to a Linux cron job running on the node's operating system that restarts the pod when it detects failures.",
          "Set the `restartPolicy: Never` directive in the Deployment to prevent the kubelet from trying to restart the application on probe failures."
        ],
        "a": 1,
        "e": "The `startupProbe` was introduced specifically to solve the problem of slow-starting applications. Until the `startupProbe` has responded successfully for the first time, the `livenessProbe` and `readinessProbe` checks are completely disabled. This makes it possible to grant a generous startup margin (e.g., `failureThreshold: 30`, `periodSeconds: 10` = up to 300s) without sacrificing the fast responsiveness of the liveness probe once the service is in normal operation."
      },
      {
        "id": "kcna-30",
        "d": 2,
        "t": "Horizontal Pod Autoscaler (HPA)",
        "q": "An e-commerce store experiences variable traffic spikes during sales promotions. To automatically respond to these demand increases, they configure a `HorizontalPodAutoscaler` (HPA) object. What is the standard operational behavior of the HPA under a sustained increase in load?",
        "o": [
          "It increases the number of physical vCPUs and network cards assigned to the worker node virtual machines through hot-plugging.",
          "It increases the container's CPU `resources.limits` values on the fly without needing to restart the application process.",
          "It dynamically adjusts the number of pod replicas in the target Deployment or ReplicaSet based on the observed metrics.",
          "It automatically converts the `Deployment` into a `DaemonSet` to ensure that all instances in the cluster serve traffic."
        ],
        "a": 2,
        "e": "The `HorizontalPodAutoscaler` (HPA) implements horizontal scaling (scaling out or in): it increases or decreases the number of pod replicas (`spec.replicas`) of a Deployment, ReplicaSet, or StatefulSet to keep the observed metric (CPU usage, memory, or custom Prometheus metrics) close to the target configured by the operator."
      },
      {
        "id": "kcna-31",
        "d": 2,
        "t": "Storage: PV, PVC, and StorageClass",
        "q": "A developer needs to request 100 GiB of persistent storage for their database without having to know the infrastructure details of the cloud provider's underlying storage. What is the standard declarative flow in Kubernetes to provision this storage in a decoupled, dynamic way?",
        "o": [
          "The developer creates a `PersistentVolumeClaim` (PVC) that references a `StorageClass`, which invokes the CSI driver to create the `PersistentVolume` (PV).",
          "The developer runs a script in the container that directly formats a SCSI device on the worker host's operating system, assigning root permissions to the block.",
          "The cluster administrator must connect via SSH to the database node to manually create an ext4 partition on the local disk and edit the /etc/fstab file.",
          "The developer defines an `emptyDir` volume with indefinite retention configured at the root of their container image."
        ],
        "a": 0,
        "e": "The Kubernetes storage model separates roles: the developer requests resources by declaring a `PersistentVolumeClaim` (PVC) with the required capacity and access mode, specifying a `StorageClass`. The `StorageClass` defines the provisioner (cloud CSI driver, e.g., EBS, Azure Disk, GPD), which automatically interacts with the storage API to provision a physical disk and create the `PersistentVolume` (PV) object bound to the PVC."
      },
      {
        "id": "kcna-32",
        "d": 2,
        "t": "Volume Access Modes",
        "q": "An image processing application is deployed with 5 replicas distributed across different worker nodes. All replicas must concurrently read and write files on the same shared network storage volume. Which access mode (accessMode) must the assigned `PersistentVolume` support?",
        "o": [
          "`ReadWriteOnce` (RWO), because it allows read-write mounting by multiple simultaneous nodes as long as they share the same namespace.",
          "`ReadOnlyMany` (ROX), because it offers the highest data transfer rate in concurrent disk input and output operations.",
          "`ReadWriteOncePod` (RWOP), because it guarantees that multiple pods in the same cluster can share the storage driver's network socket.",
          "`ReadWriteMany` (RWX), because it allows the volume to be mounted in read/write mode simultaneously by multiple worker nodes."
        ],
        "a": 3,
        "e": "The access modes of a PersistentVolume in Kubernetes are: 1) `ReadWriteOnce` (RWO): the volume can be mounted as read/write by a single node; 2) `ReadOnlyMany` (ROX): it can be mounted as read-only by multiple nodes; 3) `ReadWriteMany` (RWX): it can be mounted as read/write by multiple nodes concurrently (typical of network file systems such as NFS, AWS EFS, Azure Files, or CephFS)."
      },
      {
        "id": "kcna-33",
        "d": 2,
        "t": "Service Types in Kubernetes",
        "q": "A company wants to expose an internal accounting-processing microservice so that it can only be called by other microservices residing within the same Kubernetes cluster, guaranteeing that it is not accessible from outside. Which `Service` type should be configured?",
        "o": [
          "`LoadBalancer`, because it automatically restricts incoming traffic to the private IP addresses of developers connected through VPN.",
          "`ClusterIP`, because it assigns an internal virtual IP address accessible exclusively from inside the Kubernetes cluster.",
          "`NodePort`, because it exposes a static port accessible only on the `127.0.0.1` loopback address of the master nodes.",
          "`ExternalName`, because it redirects traffic to a public load balancer managed by the international payment gateway."
        ],
        "a": 1,
        "e": "`ClusterIP` is the default `Service` type in Kubernetes. It assigns a stable virtual IP address that is routable exclusively from inside the cluster. It is the ideal and recommended option for internal communication between microservices (backends, databases, private APIs) that must not be exposed externally."
      },
      {
        "id": "kcna-34",
        "d": 2,
        "t": "Network Security with NetworkPolicy",
        "q": "By default, the Kubernetes network allows any Pod to communicate with any other Pod in the cluster. To comply with banking security regulations, the database pods must be isolated so that they only accept traffic on port 5432 from pods with the label `app: payment-api`. Which mechanism and requirement are needed?",
        "o": [
          "Create a `ClusterRoleBinding` that revokes TCP connection privileges at the API Server authentication protocol level.",
          "Configure a static `/etc/hosts` file inside the database container image that blocks the cluster's CIDR ranges.",
          "Define a `NetworkPolicy` with specific Ingress rules and make sure a CNI plugin that supports the specification is in place.",
          "Modify the `kubelet` flags on each node to disable packet routing between different namespaces."
        ],
        "a": 2,
        "e": "A `NetworkPolicy` is the native Kubernetes resource for controlling traffic flow at layers 3 and 4 (IPs, ports, and Pod/Namespace selectors). When a NetworkPolicy is applied to a set of pods, they become isolated (default deny for anything not explicitly allowed). A `CNI` plugin that supports NetworkPolicies (such as Calico, Cilium, or Weave Net) is essential, since basic providers such as Flannel ignore these rules."
      },
      {
        "id": "kcna-35",
        "d": 3,
        "t": "Cloud Native Principles (CNCF)",
        "q": "According to the official definition from the Cloud Native Computing Foundation (CNCF), what is the primary purpose of adopting cloud native technologies such as containers, service meshes, and declarative APIs?",
        "o": [
          "To enable organizations to build and run scalable applications in dynamic environments, fault-tolerant and with predictable changes.",
          "To completely eliminate the use of operating systems on servers through direct instruction emulation in microcode inside the hardware processors.",
          "To force all enterprise applications to migrate to a centralized monolithic model to simplify accounting audits and consolidate all databases on a single host.",
          "To guarantee that no workload can run outside private data centers in order to avoid cloud transfer costs."
        ],
        "a": 0,
        "e": "The CNCF defines Cloud Native as the set of technologies that make it possible to build and run scalable applications in dynamic environments (public, private, and hybrid clouds) using containers, service meshes, microservices, immutable infrastructure, and declarative APIs, enabling systems that are resilient, manageable, and observable, and that allow frequent, predictable changes with minimal effort."
      },
      {
        "id": "kcna-36",
        "d": 3,
        "t": "12-Factor App Methodology",
        "q": "A development team is refactoring a service to comply with the best practices of the `12-Factor App` methodology recommended for Kubernetes applications. Which of the following design decisions represents a faithful application of these principles?",
        "o": [
          "Embedding production database passwords in the application's source code to avoid network requests.",
          "Storing user session state in files on the container's local hard disk to maximize access speed and avoid calls to external caches.",
          "Writing logs directly to raw block disk partitions to avoid the overhead of the operating system daemon and reduce CPU cycle consumption.",
          "Storing configuration in injected environment variables, running stateless processes, and sending logs to stdout as an event stream."
        ],
        "a": 3,
        "e": "The `12-Factor App` methodology establishes fundamental principles for cloud native applications: Factor III (Config): strictly separate configuration from code using environment variables; Factor VI (Processes): run the application as one or more stateless, share-nothing processes; Factor XI (Logs): treat logs as continuous event streams directed to standard output (`stdout`/`stderr`), delegating their collection to the platform."
      },
      {
        "id": "kcna-37",
        "d": 3,
        "t": "CNCF Project Maturity Levels",
        "q": "The CNCF classifies its projects into three graduation levels: `Sandbox`, `Incubating`, and `Graduated`. What is the fundamental criterion that distinguishes a project at the `Graduated` level (such as Kubernetes, Prometheus, or Envoy)?",
        "o": [
          "Having been acquired entirely by a multinational company that exclusively funds all of its active developers.",
          "Demonstrating maximum technical maturity, broad adoption in large-scale production environments, audited security, and solid neutral governance.",
          "Being a recent experimental development project with no production users but a conceptually innovative architecture.",
          "Having completely replaced all other existing open source tools in the same technology category of the industry."
        ],
        "a": 1,
        "e": "`Graduated` projects in the CNCF represent the highest level of maturity. To reach this status, a project must meet rigorous criteria: massive, documented adoption in mission-critical production environments by multiple organizations, transparent, healthy, and neutral governance processes, contributor diversity commitments, and having passed a formal, independent security audit."
      },
      {
        "id": "kcna-38",
        "d": 3,
        "t": "Service Mesh Architecture",
        "q": "Which TWO fundamental capabilities does a `Service Mesh` architecture (such as Istio or Linkerd) provide by deploying sidecar proxies (such as Envoy) on east-west traffic between microservices? (Select two)",
        "o": [
          "Complete replacement of the persistent storage layer with databases embedded in kernel sockets.",
          "Automatic encryption and mutual authentication in transit (`mTLS`) between microservices without modifying the application code.",
          "Uniform generation of telemetry, golden metrics (RPS, latency, errors), and distributed trace propagation for all internal traffic.",
          "Hardware acceleration of complex SQL queries through static index rewriting in the relational database engine."
        ],
        "a": [
          1,
          2
        ],
        "e": "A `Service Mesh` manages service-to-service communication (east-west traffic) by injecting lightweight sidecar proxies (usually Envoy). Its two major contributions are: 1) Security: cryptographic identity authentication and automatic end-to-end encryption through transparent `mTLS`; 2) Uniform observability: it collects golden network metrics (p99 latency, success rate, throughput) and propagates trace headers without requiring developers to instrument every HTTP client in their code."
      },
      {
        "id": "kcna-39",
        "d": 3,
        "t": "Access Control with RBAC",
        "q": "A Kubernetes administrator needs to grant the support team permissions to view logs and list pods only within the `staging` namespace, ensuring that they cannot view or modify resources in any other namespace or at the cluster level. Which combination of RBAC objects should they apply?",
        "o": [
          "A `ClusterRole` with wildcard `*` verbs bound through a `ClusterRoleBinding` across the entire organization to ensure full support visibility.",
          "An Ingress-type `NetworkPolicy` combined with a `LimitRange` object configured with read permissions on the subnet and consumption quotas in the namespace.",
          "A `Role` defined with permissions on pods in the `staging` namespace, bound to the users through a `RoleBinding` in that same namespace.",
          "A `ServiceAccount` configured with root administrative privileges in the local `/etc/sudoers` file of the worker nodes."
        ],
        "a": 2,
        "e": "In Kubernetes RBAC: a `Role` defines permissions that are scoped exclusively within a **specific namespace**. To grant those permissions to a user, group, or ServiceAccount within that same namespace, a `RoleBinding` is used. If a `ClusterRole` with a `ClusterRoleBinding` were used, the permissions would extend to the entire cluster, violating the principle of least privilege."
      },
      {
        "id": "kcna-40",
        "d": 3,
        "t": "Pod Identities with ServiceAccount",
        "q": "A microservice deployed on Kubernetes needs to periodically query the Kubernetes API to list the status of other pods in its namespace. How should this process authenticate to the `kube-apiserver` according to Kubernetes security best practices?",
        "o": [
          "By assigning a dedicated `ServiceAccount` to the Pod, which automatically injects a projected JWT token that the HTTP client uses as a Bearer credential.",
          "By sharing the `kubernetes-admin` user's administrative certificate in a plain-text environment variable in the manifest to simplify testing.",
          "By disabling the authorization module in the `kube-apiserver` configuration file to allow anonymous queries on the compute cluster's internal network.",
          "By configuring a perimeter firewall rule that assumes all traffic coming from the pod's IP address is trusted."
        ],
        "a": 0,
        "e": "A `ServiceAccount` provides a managed identity to processes running inside Pods. When a ServiceAccount is associated with the Pod (`spec.serviceAccountName`), Kubernetes securely mounts an authentication token (cryptographic JWT) as a projected volume at `/var/run/secrets/kubernetes.io/serviceaccount/token`. The application's SDK reads this token and sends it as the `Authorization: Bearer <token>` header to the `kube-apiserver`."
      },
      {
        "id": "kcna-41",
        "d": 3,
        "t": "Gateway API vs Ingress",
        "q": "As Kubernetes clusters grew in complexity, the traditional `Ingress` resource showed expressiveness limitations, relying excessively on proprietary annotations specific to each controller. What is the main architectural advantage introduced by the modern CNCF `Gateway API`?",
        "o": [
          "It forces all services in the cluster to communicate exclusively over unencrypted UDP sockets to reduce latency in high-concurrency connections.",
          "It merges all network layers into a single monolithic binary managed exclusively by the corporate security team to avoid configuration drift.",
          "It eliminates the need for public IP addresses by routing all incoming traffic through physical console serial ports installed in each rack of the data center.",
          "It structures routing through role-oriented resources (`GatewayClass`, `Gateway`, `HTTPRoute`), enabling separation of concerns and portability."
        ],
        "a": 3,
        "e": "The `Gateway API` is the official evolution of Ingress in Kubernetes. Its major architectural advantage is its role-oriented design: 1) `GatewayClass` (cloud infrastructure administrator); 2) `Gateway` (cluster operator who defines listeners and TLS); 3) `HTTPRoute` / `GRPCRoute` (application developer who defines routes and redirects). It also standardizes advanced features such as weighted traffic splitting, header filters, and native gRPC support without proprietary annotations."
      },
      {
        "id": "kcna-42",
        "d": 3,
        "t": "Admission Control and Policies",
        "q": "The security governance team needs to guarantee that no container can run as the `root` user (`privileged: true`) or pull images with the `:latest` tag in the cluster. Which native Kubernetes and CNCF ecosystem mechanism makes it possible to intercept and validate manifests before they are persisted in `etcd`?",
        "o": [
          "`kube-proxy` through deep packet inspection with heuristic code-signature inspection at the TCP transport layer to block unwanted connections.",
          "`Admission Controllers` (mutating and validating admission controllers) integrated with policy engines such as `OPA / Gatekeeper` or `Kyverno`.",
          "The `kube-scheduler`, assigning a negative score to pods that do not include a corporate digital signature certificate issued by the certificate authority.",
          "A Bash script run locally on developers' laptops before sending the `git push` command."
        ],
        "a": 1,
        "e": "`Admission Controllers` are interceptors in the `kube-apiserver` that evaluate requests right after they are authenticated and authorized, but before the object is stored in `etcd`. Through `ValidatingAdmissionWebhooks`, CNCF ecosystem tools such as `OPA/Gatekeeper` or `Kyverno` inspect the manifest content and reject the creation of pods that violate security policies (such as running as root or using `:latest` images)."
      },
      {
        "id": "kcna-43",
        "d": 4,
        "t": "The Three Pillars of Observability",
        "q": "In the observability paradigm for distributed systems and cloud native architectures, the so-called \"Three Pillars of Observability\" are frequently described. What are these three fundamental types of telemetry signals and their characteristic value?",
        "o": [
          "CPU, Memory, and Disk Storage, which measure exclusively the performance of the physical hardware in the data center and alert on mechanical failures in servers.",
          "Authentication, Authorization, and Auditing, which ensure compliance with perimeter firewall security policies and the access logging of corporate users.",
          "Metrics (numeric aggregates for trends), Logs (detailed timestamped textual events), and Traces (the path and distributed latency of requests).",
          "Deployments, Unit tests, and Continuous integration, which ensure that the code meets the repository's quality standards."
        ],
        "a": 2,
        "e": "The Three Pillars of Observability are: 1) `Metrics`: aggregatable, efficient numeric data for measuring trends, calculating SLIs, and triggering real-time alerts; 2) `Logs`: timestamped textual event records for understanding exactly what happened at a specific moment; 3) `Traces`: represent the complete path of a request across multiple microservices (using Spans), making it possible to identify latency bottlenecks."
      },
      {
        "id": "kcna-44",
        "d": 4,
        "t": "Prometheus Architecture",
        "q": "Prometheus is the quintessential graduated monitoring and alerting project in the CNCF. Which of the following statements accurately describes Prometheus's data collection model and core architecture?",
        "o": [
          "It uses a `pull`-based model that actively polls `/metrics` HTTP endpoints, stores time series in its local TSDB, and queries data with `PromQL`.",
          "It requires all microservices to send telemetry events through synchronous calls to an external PostgreSQL relational database with normalized relational schemas.",
          "It operates exclusively as a passive agent that intercepts packets on the Ethernet network interface of physical switches without consuming CPU or requiring agents on the worker nodes.",
          "It automatically downloads the pods' configuration files to compile audit binaries in flash memory during boot."
        ],
        "a": 0,
        "e": "Prometheus uses a collection model based on active polling (`pull model` / scraping): at regular intervals (scrape interval), Prometheus queries over HTTP the metrics endpoint (usually `/metrics`) exposed by each configured target. It stores this data in its disk-optimized time series database (`TSDB`) and offers the powerful `PromQL` language for querying metrics and evaluating alerting rules."
      },
      {
        "id": "kcna-45",
        "d": 4,
        "t": "OpenTelemetry (OTel) Ecosystem",
        "q": "An organization uses multiple programming languages (Go, Java, Python, Node.js) and wants to instrument its microservices in a neutral way so as not to be locked into a specific observability vendor (vendor lock-in). What is the role of `OpenTelemetry` (OTel) in this scenario?",
        "o": [
          "To completely replace the nodes' operating system in order to unify network drivers into a single Linux binary standard optimized for distributed architectures.",
          "To provide a distributed relational database with ACID transactional support designed specifically to compete with MySQL clusters in transactional data storage.",
          "To automatically run stress load tests simulating millions of concurrent users in production environments.",
          "To provide a standard set of APIs, SDKs, and tools (along with the OTel Collector) for generating and exporting metrics, logs, and traces in a vendor-agnostic way."
        ],
        "a": 3,
        "e": "OpenTelemetry (OTel), a CNCF `Graduated` project, provides a unified, vendor-agnostic standard for observability. It offers APIs and SDKs in multiple languages to instrument code in a uniform way, defines the open `OTLP` protocol, and provides the `OTel Collector`, an intermediary component that receives, processes, and exports telemetry (metrics, traces, and logs) to any compatible analysis backend (Prometheus, Jaeger, Datadog, etc.)."
      },
      {
        "id": "kcna-46",
        "d": 4,
        "t": "Cluster Monitoring and Alertmanager",
        "q": "In a Kubernetes infrastructure, what is the function of `cAdvisor` in the monitoring telemetry chain, and how does it work with `Prometheus Alertmanager` in service degradation situations?",
        "o": [
          "`cAdvisor` manages the encryption of HTTPS communications at the Ingress, while Alertmanager restarts containers that suffer prolonged network latency on their connections.",
          "`cAdvisor` collects container CPU and memory usage metrics from the kubelet, and Alertmanager manages, groups, and routes the alerts fired by Prometheus.",
          "`cAdvisor` periodically runs backups of the `etcd` database to disk, and Alertmanager rolls back failed deployments in the cluster by sending automatic commands to the apiserver.",
          "`cAdvisor` calculates the billing costs of virtual machines, while Alertmanager sends emails exclusively to the corporate finance team."
        ],
        "a": 1,
        "e": "`cAdvisor` (Container Advisor) is a service natively embedded in the `kubelet` binary that collects, aggregates, and exposes performance and resource usage metrics (CPU, memory, disk, and network) for all containers running on that node. Prometheus scrapes these metrics and, if an alerting rule is met, sends the notification to `Alertmanager`, which deduplicates, groups, and routes the alerts to Slack, PagerDuty, or email."
      },
      {
        "id": "kcna-47",
        "d": 5,
        "t": "Fundamental Principles of GitOps",
        "q": "A platform engineering team adopts the `GitOps` methodology to manage the infrastructure and applications of its production clusters. What is the central tenet that defines how GitOps works?",
        "o": [
          "Developers must connect through an interactive console to each worker node to build the changes directly in the production environment without the need for automated testing.",
          "Production changes are made by sending manual, unversioned requests through the cloud provider's web control panel to speed up deployment times.",
          "The Git repository is the Single Source of Truth where the desired state is declared, which is continuously reconciled by an agent in the cluster.",
          "All infrastructure must be configured using assembly scripts stored in the boot sector of hard drives."
        ],
        "a": 2,
        "e": "The core of `GitOps` is using Git as the Single Source of Truth for the entire system. All configuration and application manifests are stored declaratively and versioned in Git repositories. An automated operator running inside the cluster (such as ArgoCD or Flux) continuously compares the state in Git with the state of the cluster and automatically syncs any drift."
      },
      {
        "id": "kcna-48",
        "d": 5,
        "t": "Packaging: Helm vs Kustomize",
        "q": "An organization needs to standardize application delivery across its clusters. While evaluating CNCF ecosystem tools, they compare `Helm` with `Kustomize`. What is the main methodological difference between these two solutions?",
        "o": [
          "`Helm` is a binary compiler for the Linux kernel on physical servers, while `Kustomize` is a distributed key-value database like `etcd` for storing configuration.",
          "`Helm` only supports deployments in private clouds without Internet connectivity, while `Kustomize` requires mandatory root access to the host hardware to mount file systems.",
          "`Helm` exclusively manages TLS security certificates at the Ingress, while `Kustomize` monitors the pods' CPU consumption to calculate automatic replica scaling.",
          "`Helm` uses Go templates with `values.yaml`, while `Kustomize` composes declarative manifests through layers (bases and overlays) without templates."
        ],
        "a": 3,
        "e": "`Helm` is the Kubernetes package manager; it uses Go templates (`templates/`) combined with variable files (`values.yaml`) to generate parameterized manifests, managing release versions and rollbacks in the cluster. By contrast, `Kustomize` is a template-free tool (`template-free`) that uses a declarative composition approach through base layers (`bases`) and environment-specific modifications (`overlays`), and is natively built into `kubectl` (`kubectl apply -k`)."
      },
      {
        "id": "kcna-49",
        "d": 5,
        "t": "OpenGitOps Principles",
        "q": "Which TWO characteristics correspond to the official `OpenGitOps` principles promoted by the CNCF for modern cloud native application deployment? (Select two)",
        "o": [
          "The desired state of the system is described in a fully declarative way and stored in a versioned, immutable system such as Git.",
          "Software agents residing inside the cluster automatically retrieve (Pull model) the desired state from the source of truth.",
          "Deployments are necessarily executed through imperative Bash scripts manually invoked by an on-call operator.",
          "The cluster authorizes any external CI tool to overwrite configurations on the fly without leaving a record in the commit history."
        ],
        "a": [
          0,
          1
        ],
        "e": "The four fundamental principles of `OpenGitOps` (CNCF) are: 1) `Declarative`: the system is described through declarations; 2) `Versioned and Immutable`: the desired state is stored immutably and with history (in Git); 3) `Pulled Automatically`: software agents in the cluster pull the desired state; 4) `Continuously Reconciled`: automated software permanently monitors and reconciles any divergence between the desired state and the actual state."
      },
      {
        "id": "kcna-50",
        "d": 5,
        "t": "Cloud Native Deployment Strategies",
        "q": "An e-commerce team wants to deploy an experimental version of the recommendation engine. They want to send only 10% of real user traffic to the new version to evaluate the error rate and latency before rolling it out to the entire platform. Which deployment strategy should they use?",
        "o": [
          "`Canary Deployment`, because it allows routing a controlled, progressive percentage of real traffic to the new version.",
          "`Recreate`, because it simultaneously shuts down all the old replicas before starting the new ones to avoid schema incompatibility.",
          "`Blue/Green`, because it instantly switches 100% of all user traffic from the blue environment to the green environment without coexistence.",
          "Standard `RollingUpdate` without a load balancer, because it automatically splits banking transactions between the two oldest servers in the rack."
        ],
        "a": 0,
        "e": "A `Canary Deployment` introduces a new software version by sending it only a small fraction of real production traffic (e.g., 10%), while the remaining 90% continues to be served by the stable version v1. This makes it possible to validate telemetry, error, and performance metrics with real users while drastically minimizing the blast radius in case of failures. If the metrics are satisfactory, traffic is progressively increased until v1 is fully replaced."
      }
    ],
    "why": {
      "kcna-01": [
        "The `kube-scheduler` does not expose the REST API or access `etcd` directly; it queries unassigned pods and updates assignments through the `kube-apiserver`.",
        "The `kube-controller-manager` runs the internal control loops (such as ReplicaSet or NodeController), but it does not store data or interact with `etcd` directly.",
        null,
        "The `kubelet` is an agent that runs on worker nodes, not on the Control Plane, and never communicates directly with `etcd`."
      ],
      "kcna-02": [
        null,
        "`etcd` does not perform sharding or write balancing; all write operations necessarily go through the Raft leader node.",
        "The odd number of nodes follows from Raft consensus quorum math and has no relation to the apiserver's TLS certificates.",
        "Periodic compaction of historical revisions in `etcd` is necessary regardless of whether the number of members is even or odd."
      ],
      "kcna-03": [
        null,
        "The `kube-controller-manager` manages the lifecycle of replicas and resources, but it does not decide on which specific node each Pod runs.",
        "The `kubelet` runs and monitors pods once they have already been assigned to its specific node by the scheduler; it does not schedule pods globally.",
        "The `cloud-controller-manager` integrates cloud services (such as load balancers or routes), but it does not make scheduling decisions for individual pods."
      ],
      "kcna-04": [
        "Kubernetes does not compile YAML files into binaries; images are built beforehand by OCI engines, and the YAML files are resource definitions parsed by the API.",
        null,
        "Validating authentication tokens and certificates is the responsibility of the `kube-apiserver`, not the controller manager.",
        "Configuring overlay networks and packet encapsulation is the responsibility of the CNI plugin, not the controller manager."
      ],
      "kcna-05": [
        "The `cloud-controller-manager` does not replace the `kubelet`; the kubelet remains the indispensable agent on every worker node.",
        "Resource monitoring and billing are handled by telemetry tools and provider APIs, not by this component.",
        "Creating clusters with Terraform or IaC is external to Kubernetes and is not part of the `cloud-controller-manager`.",
        null
      ],
      "kcna-06": [
        "Network traffic balancing on the nodes is the responsibility of `kube-proxy` or a Service Mesh / Ingress Controller, not the `kubelet`.",
        "The `kubelet` never communicates directly with `etcd`; any query or status report goes through the `kube-apiserver`.",
        null,
        "The `kubelet` does not compile source code; it only runs container images that were previously built and published to a registry."
      ],
      "kcna-07": [
        null,
        "`CoreDNS` is the cluster's internal DNS server that resolves names to IPs, but it does not program kernel rules or route packets at the transport level.",
        "`containerd` is a container runtime that manages images and process namespaces, not the routing of Kubernetes Services.",
        "The `kube-scheduler` assigns pods to nodes during the scheduling phase, but it has no relation to traffic routing or kernel tables."
      ],
      "kcna-08": [
        null,
        "`kube-apiserver` does not use active-passive leader election; it is completely stateless and operates in a balanced active-active mode.",
        null,
        "The `kubelet` is an agent that runs independently on each worker node to manage its own local containers; it does not take part in control plane leader election."
      ],
      "kcna-09": [
        "The `CNI` (Container Network Interface) focuses on connectivity and the configuration of container network interfaces, not on running containers.",
        "The `CSI` (Container Storage Interface) is responsible for provisioning and mounting storage volumes, not for the container lifecycle.",
        "The `OCI` (Open Container Initiative) defines image format and low-level runtime specifications (such as `runc`), not the Helm format.",
        null
      ],
      "kcna-10": [
        "Containers within the same Pod share the same IP address; they do not receive independent IP addresses or need Ingress to communicate with each other.",
        null,
        "All containers in the same Pod necessarily run on the same physical/virtual node; a Pod is never split across multiple nodes.",
        "Each container maintains its own root file system derived from its container image; only explicitly mounted volumes are shared."
      ],
      "kcna-11": [
        "`ReplicaSets` support exactly the same Pod template (`PodTemplateSpec`) as Deployments, including multiple containers and secrets.",
        "Deployments do not perform static vulnerability analysis of source code; that is a task for CI/CD pipelines.",
        null,
        "`ReplicaSets` remain official, fundamental components in Kubernetes; they are the controllers that Deployments use internally."
      ],
      "kcna-12": [
        null,
        "A `StatefulSet` is used for stateful workloads (such as distributed databases) that require ordering and persistence, not for running one agent per node.",
        "A `Job` is used for finite tasks that run to completion; log agents must run continuously as daemons.",
        "A `Deployment` distributes pods seeking to balance capacity, and may place multiple replicas on one node and zero on another, without guaranteeing one per node."
      ],
      "kcna-13": [
        "A `DaemonSet` does not guarantee stable ordinal names or dedicated volume templates per replica; it runs one pod per node for agents.",
        "A `Deployment` treats its replicas as replaceable and interchangeable with random names (e.g., `app-5df4c9-xk7pz`), which breaks clusters such as ZooKeeper.",
        "A `CronJob` runs one-off scheduled tasks and does not maintain continuous services or stable ordinal identities.",
        null
      ],
      "kcna-14": [
        "A `Deployment` is designed for continuous services; if the container exits with code 0, the Deployment will treat it as a failure and restart it.",
        null,
        "A `DaemonSet` would run the process on every node in the cluster at once, duplicating the accounting reconciliation and causing inconsistencies.",
        "A `StatefulSet` maintains continuous stateful services and is not designed for batch processes that must finish and shut down."
      ],
      "kcna-15": [
        "`NodeSelector` is a scheduling technique for directing pods to nodes with specific labels, not a mechanism for logical partitioning of the cluster.",
        "A `ClusterRole` is an RBAC object that defines permissions on cluster-wide resources, not a partition of objects or cluster quotas.",
        null,
        "`StorageClass` defines the types and provisioners of persistent storage volumes, without providing resource name isolation."
      ],
      "kcna-16": [
        "The proposed FQDN points to the `production` namespace and uses the pod suffix (`.pod.`), instead of pointing to `finance` with the `.svc.` suffix.",
        "Kubernetes does not use the reversed subdomain convention or `.k8s.internal` as the CoreDNS default standard.",
        "An HTTP URL is not a DNS hostname resolvable at the transport layer; network resolution requires the service's standard FQDN.",
        null
      ],
      "kcna-17": [
        "A `PersistentVolumeClaim` is a request for persistent block or file storage on disk, not a store for configuration parameters.",
        null,
        "A `NetworkPolicy` defines network traffic filtering rules at the layer 3/4 firewall level, unrelated to application configuration.",
        null
      ],
      "kcna-18": [
        null,
        "Kubernetes does not depend on Docker Swarm to start up; the `kubelet` itself is capable of starting pods autonomously.",
        "The control plane components are not simulated scripts, but the real Kubernetes binaries running as Static Pods.",
        "Terraform can provision the virtual machine, but orchestrating the bootstrap of the pods on the node is done by the `kubelet`."
      ],
      "kcna-19": [
        "`Ephemeral Containers` are used for live interactive debugging in already running pods with `kubectl debug`, not for startup preparation.",
        "`Sidecar Containers` run in parallel throughout the application's lifetime, whereas preparation tasks must finish before the app starts.",
        null,
        "The `pause` container reserves the Pod's network and IPC namespaces in the kernel, but it does not run initialization tasks or user scripts."
      ],
      "kcna-20": [
        "`CrashLoopBackOff` is a container state (`waiting.reason`) that indicates repeated failures in the process, not an official Pod phase.",
        null,
        "`ImagePullBackOff` is a container waiting reason when the image cannot be pulled, not a phase of the Pod lifecycle.",
        "`Terminating` is an indication shown by `kubectl` while waiting for the deletion grace period, but it is not an official Pod phase."
      ],
      "kcna-21": [
        "`Annotations` are used to attach arbitrary metadata that controllers or services cannot query through efficient selectors.",
        "`ClusterIP` is the virtual IP address assigned to the service, but it is not the mechanism that finds or identifies the backend pods.",
        "`ResourceVersion` is an internal optimistic concurrency control marker used by `etcd` and the apiserver, unrelated to load balancing.",
        null
      ],
      "kcna-22": [
        null,
        "`labels` are designed for identifying and selecting objects; `annotations` are used for descriptive metadata or plugin configuration.",
        "`finalizers` are strings that block the deletion of a resource until pre-deletion cleanup tasks are completed.",
        "`ownerReferences` establish parent-child relationships between objects for garbage collection (e.g., a Deployment as the owner of a ReplicaSet)."
      ],
      "kcna-23": [
        "`SIGKILL` is not sent at the start; sending `SIGKILL` immediately would abruptly abort in-flight connections without allowing graceful cleanup.",
        "Kubernetes does not send `SIGSTOP` to freeze processes or take memory dumps during normal pod termination.",
        null,
        "The `kubelet` does not wait indefinitely; the wait time is strictly bounded by `terminationGracePeriodSeconds` before `SIGKILL`."
      ],
      "kcna-24": [
        "`requests` does not reboot nodes and `limits` is not a cloud billing directive, but a kernel isolation setting.",
        "`requests` and `limits` manage compute resources (CPU and memory), not application-layer HTTP request rates or network bandwidth.",
        "The relationship is reversed: `requests` is used by the scheduler to place the pod on a node, while `limits` is used by cgroups for throttling or OOM.",
        null
      ],
      "kcna-25": [
        "Pods with `Guaranteed` QoS are the most protected on the system and the last to be considered for eviction under memory saturation.",
        null,
        "`Burstable` pods have higher priority than `BestEffort` pods; they are only evicted if no `BestEffort` pods remain on the node.",
        "`CriticalSystem` is not a standard QoS class for ordinary pods, and system processes have higher priority than user apps."
      ],
      "kcna-26": [
        null,
        "A `NetworkPolicy` filters network traffic between pods at layer 3/4, but it has no influence on the scheduler's node placement decisions.",
        "A `ClusterRole` controls authentication and authorization permissions on the Kubernetes API, not the physical placement of workloads on nodes.",
        "A `LimitRange` sets minimum and maximum resource values per pod within a namespace, and does not control the assignment of specialized nodes."
      ],
      "kcna-27": [
        "`nodeSelector` is a strict exact-match mechanism; if no node satisfies the specified label, the pod remains `Pending`.",
        "`requiredDuringScheduling...` is a hard, unavoidable condition; if there is no room in `us-east-1a`, the pod will fail to be scheduled.",
        null,
        "`podAntiAffinity` pushes pods away from each other, not toward specific nodes; moreover, a positive preference toward the `us-east-1a` zone is what is requested."
      ],
      "kcna-28": [
        null,
        "Kubernetes does not perform live migration of pods between nodes when a probe fails; the local `kubelet` simply restarts the container.",
        "A `readinessProbe` failure never destroys the data or persistent volumes associated with the Pod.",
        null
      ],
      "kcna-29": [
        "Increasing memory to 64 GiB does not fix the dependency loading time or prevent the liveness probe from failing due to premature timeout.",
        null,
        "Removing the health probes leaves the application without automated supervision for failures and deadlocks in production, which is a serious anti-pattern.",
        "`restartPolicy: Never` is not a valid option for a `Deployment` template (Deployments strictly require `restartPolicy: Always`)."
      ],
      "kcna-30": [
        "The HPA does not add physical hardware or reconfigure virtual machines; that function belongs to the `Cluster Autoscaler` or `Karpenter` at the node level.",
        "Vertical scaling of resources (modifying requests/limits) is managed by the `VerticalPodAutoscaler` (VPA), not the HPA.",
        null,
        "The HPA does not change the controller class or turn Deployments into DaemonSets; it only modifies the replica count."
      ],
      "kcna-31": [
        null,
        "Containers in Kubernetes run isolated and must not directly format low-level SCSI devices of the host operating system.",
        "Manual provisioning via SSH breaks the declarative, automated model of Kubernetes cloud native architecture.",
        "An `emptyDir` volume is ephemeral and is completely destroyed when the Pod is deleted or terminates, so it is not suitable for persistent databases."
      ],
      "kcna-32": [
        "`ReadWriteOnce` (RWO) can only be mounted by **a single node at a time**; if the pods reside on different nodes, they will not be able to mount the volume.",
        "`ReadOnlyMany` (ROX) only allows **read** operations; the replicas will not be able to write or save the processed files.",
        "`ReadWriteOncePod` (RWOP) restricts mounting to a single Pod across the entire cluster, preventing concurrent use by 5 replicas.",
        null
      ],
      "kcna-33": [
        "`LoadBalancer` provisions an external load balancer in the cloud provider with a public or external network IP, needlessly exposing the service.",
        null,
        "`NodePort` opens a publicly accessible port on the IP of every worker node in the cluster (range 30000-32767), allowing unwanted external access.",
        "`ExternalName` maps the service to an external DNS name through a CNAME without load balancing internal local pods."
      ],
      "kcna-34": [
        "`ClusterRoleBinding` governs permissions on the Kubernetes API (CRUD operations with kubectl); it does not filter network packets between pods.",
        "Editing `/etc/hosts` in the image does not block incoming network connections at the socket level, nor is it maintainable in a dynamic environment.",
        null,
        "The `kubelet` does not manage network packet filtering for pods; that responsibility belongs to the rules programmed by the CNI plugin."
      ],
      "kcna-35": [
        null,
        "Cloud Native does not eliminate operating systems or emulate microcode; it relies on modern operating systems (mainly Linux) and container isolation.",
        "The Cloud Native paradigm promotes decoupled microservices and modular systems, exactly the opposite of centralized monolithic architectures.",
        "Cloud Native technologies are designed to operate in hybrid and multi-cloud environments with open portability, not to restrict workloads to private data centers."
      ],
      "kcna-36": [
        "Embedding credentials in source code violates Factor III (Config) and represents a serious security vulnerability in version control.",
        "Storing state on local disk violates Factor VI (Stateless processes); containers are ephemeral and any local state is lost when the Pod is recreated.",
        "Writing directly to raw disks violates Factor XI (Logs); 12-Factor applications must emit logs to `stdout` without managing log files.",
        null
      ],
      "kcna-37": [
        "The CNCF strictly requires vendor neutrality; no Graduated project can be exclusively owned by a single private company.",
        null,
        "Projects in an early experimental phase with no production adoption correspond to the `Sandbox` category, not `Graduated`.",
        "The CNCF does not require a project to eliminate its competitors; in fact, multiple graduated and incubating projects coexist healthily in the ecosystem."
      ],
      "kcna-38": [
        "A Service Mesh manages transport and network layers at layer 7; it does not replace persistent storage or Kubernetes databases.",
        null,
        null,
        "A Service Mesh's network proxies do not analyze or optimize SQL queries of relational databases; they operate on network protocols such as HTTP, gRPC, or TCP."
      ],
      "kcna-39": [
        "A `ClusterRole` bound through a `ClusterRoleBinding` would grant permissions across all namespaces in the cluster, violating the restriction to isolate to `staging`.",
        "A `NetworkPolicy` controls the flow of IP network traffic between pods; it does not manage authorizations on the Kubernetes API or `kubectl` commands.",
        null,
        "Kubernetes permissions are managed in the API through RBAC, not by editing local `/etc/sudoers` files of the nodes' Linux operating system."
      ],
      "kcna-40": [
        null,
        "Embedding the `kubernetes-admin` certificate in an environment variable grants unlimited superuser access to the container, which is a critical security flaw.",
        "Disabling authorization on the API Server would open the cluster to anonymous access without authentication, completely compromising system security.",
        "Blindly trusting pod IP addresses is extremely insecure due to the dynamic, reusable, and ephemeral nature of IPs in Kubernetes."
      ],
      "kcna-41": [
        "The Gateway API supports standard secure protocols (HTTP, HTTPS, TLS, gRPC); it does not force the use of unencrypted UDP.",
        "The Gateway API does exactly the opposite of a monolithic design: it decouples configuration into independent resources for each operational role.",
        "The Gateway API does not use serial ports or dispense with modern TCP/IP networks; it routes standard network traffic with high expressiveness at layer 7.",
        null
      ],
      "kcna-42": [
        "`kube-proxy` programs network packet forwarding rules on the nodes; it has no visibility into, or ability to analyze, manifests in the API.",
        null,
        "The `kube-scheduler` is responsible for placing pods on nodes based on resources and affinity, not for validating security compliance policies at admission.",
        "Scripts on local machines (such as pre-commit hooks) can be bypassed or disabled by developers; security must be enforced by the cluster."
      ],
      "kcna-43": [
        "CPU, memory, and disk are physical infrastructure resources that can be measured through metrics, but they are not the 3 pillars of observability.",
        "Authentication, authorization, and auditing (the three A's) belong to the domain of information security and access control, not observability.",
        null,
        "Deployments and continuous testing belong to the software development lifecycle (CI/CD), not to runtime telemetry signals."
      ],
      "kcna-44": [
        null,
        "Prometheus does not use a push model toward SQL relational databases; its core design is pull over a time series database (TSDB).",
        "Prometheus is not a passive sniffer of physical network interfaces; it is an application-layer application that performs explicit HTTP scraping.",
        "Prometheus does not compile code or modify binaries; its function is strictly focused on collecting, storing, and querying metrics."
      ],
      "kcna-45": [
        "OpenTelemetry is not an operating system and does not compete with the Linux kernel; it is an application-layer observability framework.",
        "OpenTelemetry does not include a transactional relational database; it delegates storage to dedicated observability backends.",
        "Load and stress testing is done with specialized tools (such as k6 or Locust) and is not part of OpenTelemetry's scope.",
        null
      ],
      "kcna-46": [
        "`cAdvisor` does not manage TLS certificates and `Alertmanager` does not restart containers; Alertmanager is exclusively an alert management and routing system.",
        null,
        "`etcd` backups are managed by data administration tools (such as `etcdctl` or Velero), not `cAdvisor`.",
        "`cAdvisor` collects technical container resource metrics on the host; it is not a cloud financial billing tool."
      ],
      "kcna-47": [
        "Connecting via SSH to production nodes to modify configurations manually is exactly the antithesis of immutability and GitOps.",
        "Manual changes through web consoles create unaudited drift and violate the single-version principle in Git.",
        null,
        "GitOps uses human-readable declarative manifests (YAML, Kustomize, Helm) stored in version control repositories, not assembly code."
      ],
      "kcna-48": [
        "Neither Helm nor Kustomize compiles kernel code or is a database; both are tools for managing and packaging declarative Kubernetes manifests.",
        "Helm operates in any Kubernetes environment (public or private), and Kustomize does not require root privileges or interact directly with hardware.",
        "TLS management and resource monitoring are tasks for cert-manager and Prometheus respectively, not the purpose of Helm or Kustomize.",
        null
      ],
      "kcna-49": [
        null,
        null,
        "Manually executed imperative scripts radically contradict the declarative, automated principle of GitOps.",
        "Allowing external changes without recording them in Git creates hidden drift and destroys Git as the single, auditable source of truth."
      ],
      "kcna-50": [
        null,
        "The `Recreate` strategy destroys all v1 replicas at once, causing downtime and affecting 100% of users.",
        "`Blue/Green` abruptly switches **100% of traffic** to the new environment once validated; it does not split traffic into progressive percentages (90/10).",
        "Standard `RollingUpdate` replaces replicas pod by pod but without fine-grained percentage control of traffic based on layer 7 weights."
      ]
    },
    "glossary": [
      {
        "term": "kube-apiserver",
        "cat": "Control Plane",
        "d": 1,
        "def": "Core Control Plane component that exposes the Kubernetes REST API; it authenticates, authorizes, validates, and mutates requests and is the only process with direct access to etcd."
      },
      {
        "term": "etcd",
        "cat": "Control Plane",
        "d": 1,
        "def": "Distributed, consistent key-value store based on the Raft consensus algorithm that stores the entire declarative and real-time state of the cluster."
      },
      {
        "term": "kube-scheduler",
        "cat": "Control Plane",
        "d": 1,
        "def": "Control plane component that detects pods with no assigned node and selects the most suitable node through sequential filtering (predicates) and prioritization (scoring) phases."
      },
      {
        "term": "kube-controller-manager",
        "cat": "Control Plane",
        "d": 1,
        "def": "Binary that packages and runs Kubernetes' core control loops (Node Lifecycle, ReplicaSet, Endpoints, ServiceAccount) to reconcile the actual state with the desired state."
      },
      {
        "term": "cloud-controller-manager",
        "cat": "Control Plane",
        "d": 1,
        "def": "Component that decouples cloud provider-specific logic (network routes, node instances, and external load balancer provisioning) from the Kubernetes core."
      },
      {
        "term": "kubelet",
        "cat": "Worker Node",
        "d": 1,
        "def": "Primary agent that runs on each worker node; it interprets PodSpecs received from the apiserver, manages container lifecycle through CRI, and reports its health status."
      },
      {
        "term": "kube-proxy",
        "cat": "Worker Node",
        "d": 1,
        "def": "Network process on each node that programs rules in iptables or IPVS to implement the virtual Service abstraction and enable traffic routing to the right pods."
      },
      {
        "term": "CRI (Container Runtime Interface)",
        "cat": "Runtime",
        "d": 1,
        "def": "gRPC interface standard that lets the kubelet interoperate with multiple container runtimes (such as containerd or CRI-O) without recompiling the Kubernetes source code."
      },
      {
        "term": "Pod",
        "cat": "Workloads",
        "d": 1,
        "def": "Smallest and most basic deployable compute unit in Kubernetes; it encapsulates one or more tightly coupled containers that share storage, IP address, and localhost."
      },
      {
        "term": "DaemonSet",
        "cat": "Workloads",
        "d": 1,
        "def": "Controller that ensures a copy of a pod runs on all nodes (or on a subset filtered by selectors), typical for telemetry agents, logs, or CNI proxies."
      },
      {
        "term": "StatefulSet",
        "cat": "Workloads",
        "d": 1,
        "def": "Workload controller designed for stateful applications that require fixed ordinal network identities (e.g., app-0), dedicated persistence, and strict deployment order."
      },
      {
        "term": "ConfigMap and Secret",
        "cat": "Configuration",
        "d": 1,
        "def": "Primitives for injecting configuration decoupled from the container; ConfigMap stores plain text and variables, while Secret holds credentials and sensitive data that can be encrypted at rest."
      },
      {
        "term": "QoS Classes (Guaranteed, Burstable, BestEffort)",
        "cat": "Resources",
        "d": 2,
        "def": "Classification assigned by Kubernetes to each Pod based on the presence and equivalence of its CPU and memory requests and limits; it determines eviction priority under saturation."
      },
      {
        "term": "Taints and Tolerations",
        "cat": "Scheduling",
        "d": 2,
        "def": "Node repulsion mechanism: a Taint applied to a node prevents pods without a matching Toleration from being scheduled or from continuing to run on it."
      },
      {
        "term": "Liveness and Readiness Probes",
        "cat": "Lifecycle",
        "d": 2,
        "def": "Kubelet probes; Liveness restarts the container if it deadlocks, while Readiness removes the pod from the Service endpoints if it cannot yet serve user traffic."
      },
      {
        "term": "CNI (Container Network Interface)",
        "cat": "Networking",
        "d": 2,
        "def": "Standard CNCF specification for configuring network interfaces in Linux containers, guaranteeing the flat Kubernetes model where every Pod has a unique IP."
      },
      {
        "term": "CSI and StorageClass",
        "cat": "Storage",
        "d": 2,
        "def": "CSI decouples storage plugins from the K8s code, and StorageClass defines the provisioner and the parameters needed to dynamically create persistent volumes (PV)."
      },
      {
        "term": "NetworkPolicy",
        "cat": "Network Security",
        "d": 2,
        "def": "Kubernetes resource that specifies how groups of pods can communicate with each other and with other network endpoints at layers 3 and 4 through declarative Ingress and Egress rules."
      },
      {
        "term": "HPA (Horizontal Pod Autoscaler)",
        "cat": "Scalability",
        "d": 2,
        "def": "Controller that automatically adjusts the number of replicas of a Deployment or ReplicaSet based on observed CPU, memory, or custom metric utilization."
      },
      {
        "term": "CNCF Graduation Levels",
        "cat": "CNCF Ecosystem",
        "d": 3,
        "def": "Project maturity levels in the CNCF: Sandbox (early experimental phase), Incubating (real adoption and solid governance), and Graduated (maximum technical maturity and audited security)."
      },
      {
        "term": "Service Mesh and mTLS",
        "cat": "Architecture",
        "d": 3,
        "def": "Dedicated infrastructure layer with sidecar proxies (e.g., Envoy) that manages east-west traffic, applying mutual encryption (mTLS), traffic control, and telemetry without modifying the code."
      },
      {
        "term": "RBAC (Role-Based Access Control)",
        "cat": "Security",
        "d": 3,
        "def": "Access control model that governs permissions on the Kubernetes API through Roles (namespace scope), ClusterRoles (cluster-wide scope), and their corresponding bindings (Bindings)."
      },
      {
        "term": "Gateway API",
        "cat": "Networking",
        "d": 3,
        "def": "Evolution of Ingress with a role-oriented architecture (GatewayClass for infra, Gateway for operators, and HTTPRoute for developers) with advanced native layer 7 support."
      },
      {
        "term": "Prometheus and PromQL",
        "cat": "Observability",
        "d": 4,
        "def": "Time series monitoring system based on HTTP pull collection, accompanied by the PromQL language for queries, alerts, and calculation of SLIs and SLOs."
      },
      {
        "term": "OpenGitOps",
        "cat": "GitOps",
        "d": 5,
        "def": "Set of open CNCF principles that define GitOps: declarative desired state, versioned and immutable in Git, pulled by agents and continuously reconciled."
      }
    ]
  };
})(window);
