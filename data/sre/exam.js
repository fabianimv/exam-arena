/* =========================================================================
   data/sre/exam.js — SRE · Production Incident Simulation (English)
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["sre-incidents"] = {
    "id": "sre-incidents",
    "appId": "sre-incidents",
    "provider": "SRE & Production",
    "badge": "SRE · Incident Sim",
    "icon": "🚨",
    "color": "#d93025",
    "title": "SRE · Production Incident Simulation",
    "subtitle": "Real on-call scenarios: Triage, SLIs/SLOs, Kubernetes, Kafka, Prometheus/Thanos, Databases, DRP, DNS, TLS, and GitOps.",
    "passingScore": 75,
    "domains": {
      "1": "Triage, Incident Command, and SLIs/SLOs (15 %)",
      "2": "Kubernetes, Containers, and Traffic (25 %)",
      "3": "Kafka, Messaging, and Distributed Systems (20 %)",
      "4": "Observability: Prometheus, Thanos, Grafana, and Datadog (15 %)",
      "5": "Databases, Storage, Cache, and DRP (15 %)",
      "6": "Networking, DNS, TLS, Security, and GitOps/IaC (10 %)"
    },
    "shortDomains": {
      "1": "Triage & SLOs",
      "2": "Kubernetes",
      "3": "Kafka & Distributed",
      "4": "Observability",
      "5": "Data, Cache & DRP",
      "6": "DNS, TLS & GitOps"
    },
    "topics": [
      {
        "id": "sre-t-1-1",
        "d": 1,
        "title": "1.1 · Incident Command (IC), Triage, and Mitigation vs. Root Cause",
        "html": "\n<h4>The golden rule in a production incident</h4>\n<p>In SRE incident response, the primary goal is to <b>restore service and stop user impact (mitigate)</b>, <em>not</em> to find or implement the definitive root-cause fix while the system is bleeding. If a deployment broke production 5 minutes ago, the correct response is to <b>roll back</b> or <b>drain traffic</b>, not to open the IDE and debug line by line.</p>\n\n<h4>Roles in incident command (ICS / Google SRE)</h4>\n<table class=\"keytable\">\n<tr><th>Role</th><th>Primary responsibility</th><th>Common mistake to avoid</th></tr>\n<tr><td><b>Incident Commander (IC)</b></td><td>Coordinates the response, makes high-level decisions, assigns tasks, and keeps focus on mitigating the impact.</td><td>Running commands in the terminal and losing the overall view of the incident.</td></tr>\n<tr><td><b>Operations / Ops Lead</b></td><td>Executes the technical changes in production (rollbacks, scaling, failover) in coordination with the IC.</td><td>Applying changes in production without announcing them in the incident channel (\"freelancing\").</td></tr>\n<tr><td><b>Communications Lead (Comms)</b></td><td>Updates the status page and informs stakeholders and support every agreed N minutes.</td><td>Leaving leadership or customers without updates for 1 hour because \"we are still investigating\".</td></tr>\n<tr><td><b>Scribe</b></td><td>Records the timeline (timestamps, ruled-out hypotheses, commands executed) for the postmortem.</td><td>Relying on the team's memory the next day.</td></tr>\n</table>\n\n<h4>Rapid diagnostic methodologies: RED and USE</h4>\n<table class=\"keytable\">\n<tr><th>Method</th><th>What it measures</th><th>What it is for</th></tr>\n<tr><td><b>RED</b> (Request-driven)</td><td><b>R</b>ate (RPS), <b>E</b>rrors (error rate), <b>D</b>uration (p50/p95/p99 latency)</td><td>Microservices, HTTP/gRPC APIs, and gateways (user-oriented).</td></tr>\n<tr><td><b>USE</b> (Resource-driven)</td><td><b>U</b>tilization (% usage), <b>S</b>aturation (wait queue), <b>E</b>rrors (device errors)</td><td>Hardware, nodes, CPU, memory, disks, and network (infrastructure-oriented).</td></tr>\n</table>\n<div class=\"tip\"><b>Incident tip:</b> When facing an unknown incident, start from the outside in with the <b>4 Golden Signals</b>: Latency, Traffic, Errors, and Saturation. Never look at average latency: a failure affecting 2 % of users with 30 s timeouts goes unnoticed in the average but spikes the <b>p99</b>.</div>\n"
      },
      {
        "id": "sre-t-1-2",
        "d": 1,
        "title": "1.2 · SLIs, SLOs, Error Budgets, and Burn Rate Alerts",
        "html": "\n<h4>SLI vs. SLO vs. SLA</h4>\n<table class=\"keytable\">\n<tr><th>Concept</th><th>Definition</th><th>Practical example</th></tr>\n<tr><td><b>SLI (Indicator)</b></td><td>The exact quantitative metric that reflects the user experience (usually the proportion of good events over total events).</td><td>% of HTTP requests to <code>/checkout</code> with a code ≠ 5xx that respond in &lt; 400 ms.</td></tr>\n<tr><td><b>SLO (Objective)</b></td><td>The internal reliability target for an SLI over a window (e.g., 28 or 30 days). It defines the <b>Error Budget</b>.</td><td>99.9 % over 30 days (error budget: 43.2 minutes of downtime per month).</td></tr>\n<tr><td><b>SLA (Agreement)</b></td><td>External legal contract with financial consequences or credits if breached. Always looser than the internal SLO.</td><td>99.5 % monthly; if it drops below, 10 % of the invoice is refunded.</td></tr>\n</table>\n\n<h4>Burn Rate-based alerts</h4>\n<p>Alerting simply when \"the error rate exceeds 0.1 % for 5 minutes\" generates noise or detects serious incidents late. The <b>burn rate</b> measures at what multiple of the sustainable rate we are consuming the monthly error budget:</p>\n<ul>\n<li><b>Burn rate = 1</b>: we will consume exactly 100 % of the error budget in 30 days.</li>\n<li><b>Burn rate = 14.4</b>: we will consume <b>2 % of the monthly budget in just 1 hour</b> (exhausting the whole month in ~50 hours). It requires an <b>on-call alert (Page / P1)</b>.</li>\n<li><b>Multi-window, multi-burn-rate (Google SRE Workbook)</b>: combines a long window (e.g., 1 h) and a short window (e.g., 5 min) with an <code>AND</code> condition. This prevents the alert from continuing to fire for hours after the incident has already been mitigated (thanks to the short window) and avoids false positives from 30-second spikes (thanks to the long window).</li>\n</ul>\n\n<h4>Blameless Postmortem culture</h4>\n<p>A blameless postmortem assumes the engineer acted with the best intentions and the information available at the time. If the conclusion of an incident is \"John made a mistake running a script\", the postmortem has failed: the right question is <b>why the system allowed a manual command without validation, peer review, or dry-run to take down production</b>.</p>\n"
      },
      {
        "id": "sre-t-2-1",
        "d": 2,
        "title": "2.1 · Pod Diagnostics in Kubernetes: OOMKilled, Throttling, and Probes",
        "html": "\n<h4>Critical Pod states and their real meaning</h4>\n<table class=\"keytable\">\n<tr><th>Symptom / State</th><th>Actual cause in the kernel / kubelet</th><th>Correct action</th></tr>\n<tr><td><b>OOMKilled (Exit Code 137)</b></td><td>The container's cgroup exceeded its <code>resources.limits.memory</code> (or the node suffered host-level OOM) and the Linux OOM Killer sent <code>SIGKILL (9)</code>.</td><td>Check for memory leaks, set the runtime heap (e.g., <code>-XX:MaxRAMPercentage</code> or <code>GOMEMLIMIT</code>) below the container limit, or raise <code>limits.memory</code>.</td></tr>\n<tr><td><b>High p99 latency with CPU at 40 % of the limit</b></td><td><b>CPU CFS Throttling</b>: a multithreaded app consumes its entire CPU quota in the first milliseconds of the 100 ms CFS period and the kernel freezes it for the rest of the cycle.</td><td>Inspect <code>container_cpu_cfs_throttled_periods_total</code>; raise or remove the hard CPU limit while ensuring an adequate <code>requests.cpu</code>.</td></tr>\n<tr><td><b>CrashLoopBackOff on all pods at once</b></td><td>Usually an external dependency being down or a misconfigured <b>livenessProbe</b> that kills the container when it responds slowly under load or checks an external database.</td><td><b>Never</b> connect a <code>livenessProbe</code> to external dependencies (DB, Redis, APIs). Use <code>readinessProbe</code> to remove the pod from the Service without restarting it, and <code>startupProbe</code> for slow starts.</td></tr>\n<tr><td><b>Pending indefinitely</b></td><td>The scheduler finds no node: missing <code>requests</code> (CPU/Mem), zone affinity with a PV (<code>VolumeNodeAffinityConflict</code>), Taints without Tolerations, or exhausted quota.</td><td>Run <code>kubectl describe pod</code> and read the scheduler's <code>Events</code> section.</td></tr>\n</table>\n\n<div class=\"tip\"><b>On-call rule:</b> If a database slows down and your microservices have a <code>livenessProbe</code> that runs <code>SELECT 1</code> against that DB, Kubernetes will restart all your pods at the same time, causing a cascade of reconnections that will take the database down even further. The <code>livenessProbe</code> should only check that the local process is not in deadlock.</div>\n"
      },
      {
        "id": "sre-t-2-2",
        "d": 2,
        "title": "2.2 · Zero-Downtime Rolling Updates, Ingress 502/504, and DNS in K8s",
        "html": "\n<h4>Why 502 Bad Gateway errors occur during a deployment in Kubernetes</h4>\n<p>When Kubernetes removes a pod during a <i>rolling update</i>, two flows occur <b>in parallel (asynchronously)</b>, not in sequence:</p>\n<ol>\n<li>The node's <code>kubelet</code> sends <code>SIGTERM</code> to the container so it shuts down.</li>\n<li>The Endpoints controller removes the pod's IP and notifies <code>kube-proxy</code> / Ingress NGINX so they update their rules.</li>\n</ol>\n<p>If your application closes its HTTP socket at millisecond 1 upon receiving <code>SIGTERM</code>, but Ingress NGINX takes 2–5 seconds to learn that this Endpoint no longer exists, NGINX will keep sending requests to the dead pod → <b>502 Bad Gateway (Connection refused / reset by peer)</b>.</p>\n\n<h4>The complete solution for Zero-Downtime Deployments</h4>\n<ul>\n<li>Add a <code>lifecycle.preStop</code> hook (e.g., <code>sleep 5</code> or <code>sleep 10</code>) before the container receives <code>SIGTERM</code>, giving the Endpoint time to disappear from all load balancers while the app keeps accepting in-flight traffic.</li>\n<li>Implement <b>Graceful Shutdown</b> in the application upon receiving <code>SIGTERM</code>: stop accepting new connections and finish in-progress requests before exiting.</li>\n<li>Ensure that <code>terminationGracePeriodSeconds</code> is greater than the sum of <code>preStop</code> + the request drain time.</li>\n</ul>\n\n<h4>The classic CoreDNS and <code>ndots:5</code> problem</h4>\n<p>By default in Kubernetes, <code>/etc/resolv.conf</code> has <code>ndots:5</code> and a list of search domains (<code>&lt;ns&gt;.svc.cluster.local svc.cluster.local cluster.local</code>). Any external FQDN with fewer than 5 dots (such as <code>api.stripe.com</code>, which has 2 dots) first generates <b>4 failed internal DNS queries (A and AAAA = 8 packets)</b> before querying the real domain. During traffic spikes this saturates CoreDNS and exhausts the UDP <code>nf_conntrack</code> table. It is mitigated with <b>NodeLocal DNSCache</b>, lowering <code>dnsConfig.options.ndots: \"2\"</code>, or using a trailing dot on external FQDNs (<code>api.stripe.com.</code>).</p>\n"
      },
      {
        "id": "sre-t-3-1",
        "d": 3,
        "title": "3.1 · Apache Kafka Incidents: Consumer Lag, Rebalance Storms, and ISR",
        "html": "\n<h4>Critical difference: <code>session.timeout.ms</code> vs. <code>max.poll.interval.ms</code></h4>\n<table class=\"keytable\">\n<tr><th>Parameter</th><th>What it controls</th><th>What happens if exceeded</th></tr>\n<tr><td><b>session.timeout.ms</b></td><td>Network/process health via the background thread (heartbeat thread).</td><td>The coordinator assumes the consumer died due to a network failure/crash and triggers a rebalance.</td></tr>\n<tr><td><b>max.poll.interval.ms</b></td><td>Maximum time allowed between two successive calls to <code>poll()</code> on the processing thread.</td><td>If a batch of messages takes longer than this limit to process (e.g., slow calls to an API or DB), the consumer is kicked out of the group even though it keeps sending heartbeats → <b>Rebalance Storm</b> and duplicate reprocessing.</td></tr>\n</table>\n\n<h4>Durability and partition availability</h4>\n<ul>\n<li><b>UnderReplicatedPartitions &gt; 0</b>: One or more followers are lagging behind the leader (saturated network, slow disk on a broker, or a broker down). There is no immediate data loss, but the cluster loses its fault-tolerance margin.</li>\n<li><b>OfflinePartitionsCount &gt; 0</b>: Critical P1 emergency. The partition has no active leader; both reads and writes on that partition fail.</li>\n<li><b>The durability equation</b>: With <code>replication.factor = 3</code>, <code>min.insync.replicas = 2</code>, and producers with <code>acks = all</code>, you can lose 1 broker with no impact or data loss. But if you configure <code>min.insync.replicas = 3</code> with <code>replication.factor = 3</code>, the failure or restart of <b>a single broker</b> will block all writes with <code>NotEnoughReplicasException</code>.</li>\n</ul>\n\n<h4>Kafka Connect and the Poison Pill problem</h4>\n<p>In a Kafka Connect Sink connector, a single corrupt or schema-incompatible message (\"poison pill\") will keep the task in a <code>FAILED</code> state in an infinite loop if it is restarted without changes. The clean emergency mitigation is to enable error tolerance (<code>errors.tolerance = all</code>) together with a <b>Dead Letter Queue (DLQ)</b> (<code>errors.deadletterqueue.topic.name</code> and <code>errors.deadletterqueue.context.headers.enable = true</code>) to isolate the failed messages without stopping the pipeline.</p>\n"
      },
      {
        "id": "sre-t-3-2",
        "d": 3,
        "title": "3.2 · Resilience in Distributed Systems: Retry Storms, Backoff, Jitter, and Load Shedding",
        "html": "\n<h4>Why naive retries turn a hiccup into a total outage</h4>\n<p>If a service B suffers a temporary 5-second degradation and its 50 clients A immediately retry up to 3 times without pause when a call fails, the load on B <b>instantly quadruples</b> (traffic amplification). When B tries to recover, the avalanche of retries takes it down again: this is a <b>Retry Storm</b>.</p>\n\n<h4>Mandatory defenses between microservices</h4>\n<table class=\"keytable\">\n<tr><th>Pattern</th><th>How it works</th><th>When it acts</th></tr>\n<tr><td><b>Exponential Backoff + Jitter</b></td><td>Exponentially increases the wait between retries (1s, 2s, 4s...) and adds a random offset (<b>jitter</b>) to desynchronize the clients.</td><td>Prevents thousands of clients from retrying at exactly the same millisecond.</td></tr>\n<tr><td><b>Retry Budget</b></td><td>Limits client-side retries to a maximum (e.g., 10 % of total traffic). If the whole service fails, it stops retrying.</td><td>Prevents massive amplification when the dependency is completely down.</td></tr>\n<tr><td><b>Circuit Breaker</b></td><td>Opens the circuit on the client after N consecutive failures and fails fast locally for a window before probing with a single request (half-open).</td><td>Protects the client from blocking its threads waiting on timeouts from a dead dependency.</td></tr>\n<tr><td><b>Load Shedding</b></td><td>The server proactively rejects requests with <code>HTTP 503</code> or <code>429</code> when its internal queue or latency exceeds a threshold, prioritizing critical traffic.</td><td>Prevents the server from collapsing at 100 % and lets at least the accepted requests finish on time.</td></tr>\n</table>\n"
      },
      {
        "id": "sre-t-4-1",
        "d": 4,
        "title": "4.1 · Prometheus and Thanos in Production: Cardinality, PromQL, and Compaction",
        "html": "\n<h4>The #1 enemy of a TSDB: Cardinality Explosion</h4>\n<p>In Prometheus, Thanos, and Datadog, <b>every unique combination of metric name + labels creates an independent time series in RAM and in the index</b>. Adding a label with unbounded values such as <code>user_id</code>, <code>email</code>, <code>request_id</code>, <code>trace_id</code>, or <code>ip_origen</code> multiplies the series by millions, causing <b>OOM in Prometheus</b> and extremely slow queries.</p>\n<ul>\n<li><b>Rule:</b> Metric labels should only contain small, finite sets (status code, HTTP method, service name, zone). High-cardinality identifiers belong in <b>logs</b> or in <b>exemplars / traces</b>.</li>\n<li><b>Quick diagnosis:</b> Query Prometheus's <code>/api/v1/status/tsdb</code> endpoint or the <i>TSDB Status</i> UI to identify which metric and which label concentrate the most series, and apply <code>metric_relabel_configs</code> with <code>action: labeldrop</code> while the code is being fixed.</li>\n</ul>\n\n<h4>Classic PromQL traps on call</h4>\n<table class=\"keytable\">\n<tr><th>Query / Error</th><th>Why it fails</th><th>Correct approach</th></tr>\n<tr><td><code>rate(http_requests_total[30s])</code> with <code>scrape_interval: 30s</code></td><td><code>rate()</code> needs <b>at least 2 samples</b> within the window to compute the slope. With a window equal to the scrape interval, it often finds only 1 sample and returns empty.</td><td>Always use a window of at least <b>4× the <code>scrape_interval</code></b> (e.g., <code>[2m]</code> or <code>[5m]</code>).</td></tr>\n<tr><td>Averaging percentiles: <code>avg(http_latency_p99)</code></td><td>Averaging percentiles across instances with different traffic volumes is mathematically invalid and hides the nodes with the most traffic and worst latency.</td><td>Expose histograms (<code>_bucket</code>) and aggregate the per-bucket rates first: <code>histogram_quantile(0.99, sum by (le) (rate(http_duration_seconds_bucket[5m])))</code>.</td></tr>\n</table>\n\n<h4>Thanos architecture</h4>\n<ul>\n<li><b>Thanos Sidecar / Receive</b>: Uploads 2-hour TSDB blocks to Object Storage and exposes recent data in real time over gRPC (StoreAPI).</li>\n<li><b>Thanos Store Gateway</b>: Queries historical blocks directly from the Object Storage bucket (uses an index cache on disk/memory).</li>\n<li><b>Thanos Querier</b>: Deduplicates series coming from highly available Prometheus pairs (using replica labels such as <code>replica=\"a\"</code> / <code>replica=\"b\"</code>) and unifies real-time + historical data.</li>\n<li><b>Thanos Compactor</b>: <b>Singleton</b> component (there must never be two instances running on the same bucket at the same time) that compacts blocks and generates <i>downsampling</i> resolutions (5m and 1h).</li>\n</ul>\n"
      },
      {
        "id": "sre-t-5-1",
        "d": 5,
        "title": "5.1 · Databases, Connection Pooling, Cache Stampede, and DRP (RPO/RTO)",
        "html": "\n<h4>Database connection exhaustion (Connection Exhaustion)</h4>\n<p>When a Kubernetes cluster scales from 20 to 150 pods during a traffic spike and each pod opens a pool of 20 connections to PostgreSQL/MySQL, the database receives 3,000 simultaneous connections. It exceeds <code>max_connections</code>, rejects new connections (<code>FATAL: sorry, too many clients already</code>), and burns all its CPU/RAM context-switching between processes.</p>\n<ul>\n<li><b>Correct mitigation:</b> Place a transactional pooler such as <b>PgBouncer</b> (in <code>pool_mode = transaction</code>) or ProxySQL in front of the database, and size each pod's pool conservatively.</li>\n</ul>\n\n<h4>Cache Stampede (Thundering Herd) in Redis</h4>\n<p>If a heavily queried key (e.g., the homepage catalog at 5,000 RPS) expires in Redis at instant $T$, the 5,000 concurrent threads see a simultaneous <i>cache miss</i> and launch the same heavy query against the database at once, taking it down.</p>\n<ul>\n<li><b>Mitigations:</b>\n  <ol>\n    <li><b>Singleflight / Request Coalescing (Mutex lock):</b> Only 1 request computes the value in the DB while the others wait for that same result or return the slightly stale value (<i>stale-while-revalidate</i>).</li>\n    <li><b>TTL jitter:</b> If you load thousands of keys in bulk, add a random value to the TTL (e.g., 3600s ± 300s) so they don't all expire in the same second.</li>\n  </ol>\n</li>\n</ul>\n\n<h4>DRP in Production: RPO vs. RTO and Replication</h4>\n<table class=\"keytable\">\n<tr><th>Metric / Mode</th><th>What it means in a disaster</th><th>Architectural impact</th></tr>\n<tr><td><b>RPO (Recovery Point Objective)</b></td><td>How much <b>data (measured as time going backward)</b> we can afford to lose at most (e.g., RPO = 5 min).</td><td>Depends on backup frequency or replication lag between sites. RPO = 0 requires synchronous replication.</td></tr>\n<tr><td><b>RTO (Recovery Time Objective)</b></td><td>How much <b>downtime</b> it takes us to get back to operating after declaring the disaster (e.g., RTO = 15 min).</td><td>Depends on failover automation (DNS, replica promotion, capacity scaling at the secondary site).</td></tr>\n</table>\n<div class=\"tip\"><b>Caution in a DRP failover:</b> If you fail over automatically to an asynchronous replica that had 40 seconds of replication lag, you will lose those 40 seconds of committed transactions, and if the old primary comes back to life believing it is still the leader, you will have <b>Split-Brain</b>. Always use STONITH / fencing and check the lag before promoting.</div>\n"
      },
      {
        "id": "sre-t-6-1",
        "d": 6,
        "title": "6.1 · DNS, TLS Certificates, Terraform State Drift, and GitOps with ArgoCD",
        "html": "\n<h4>Why traffic keeps reaching the old datacenter after changing DNS</h4>\n<p>During a DRP or a load balancer change via DNS, lowering the TTL 5 minutes before the change does not help if the previous TTL was <code>86400</code> (24 hours): recursive resolvers will keep serving the cached record until the old TTL expires. In addition, many HTTP clients (Java JVM by default in older configurations, HTTP/1.1 keep-alive connection pools, and HTTP/2) <b>resolve DNS only once when opening the socket and reuse the TCP connection indefinitely</b> without querying DNS again until the server actively closes the connections or <code>maxConnectionAge</code> expires.</p>\n\n<h4>TLS Certificate Incidents in Production</h4>\n<ul>\n<li><b>Works in desktop Chrome, but fails in backend clients (cURL, Python, Java, Android) with <code>unable to get local issuer certificate</code>:</b> The server is only sending the leaf certificate and forgot to include the <b>intermediate certificate chain (fullchain)</b>. Browsers download the intermediate on their own (AIA fetching), but API clients and SDKs do not.</li>\n</ul>\n\n<h4>GitOps (ArgoCD) and Terraform during an Incident</h4>\n<table class=\"keytable\">\n<tr><th>On-call situation</th><th>What happens if you act wrongly</th><th>Correct SRE procedure</th></tr>\n<tr><td>You apply an urgent change with <code>kubectl edit deployment</code> on a cluster managed by <b>ArgoCD with <code>selfHeal: true</code></b>.</td><td>Within seconds, ArgoCD detects the drift from Git and <b>automatically reverts your mitigation</b> back to the broken state.</td><td>Make the change through a commit/revert in the GitOps repository (or temporarily disable <code>auto-sync</code> in ArgoCD while mitigating and then reflect it in Git).</td></tr>\n<tr><td>A teammate manually deleted or modified a cloud resource and you want to fix something else with <b>Terraform</b>.</td><td>Running <code>terraform apply -auto-approve</code> without reading the plan can destroy or recreate critical resources to force convergence.</td><td>Always inspect <code>terraform plan</code>, and use <code>terraform state</code> / <code>import</code> or <code>moved</code>/<code>import</code> blocks to reconcile the state without destroying live infrastructure.</td></tr>\n</table>\n"
      }
    ],
    "questions": [
      {
        "id": "sre-01",
        "d": 1,
        "t": "Incident response",
        "q": "It is 03:15 AM. PagerDuty fires a P1 alert: the 5xx error rate on the payments API rose from 0.05 % to 18 % 6 minutes ago. In the timeline you see that version v2.14.0 of the payments service was deployed at 03:08 AM. The on-call developer says they think they know which line of code is failing and asks for 25 minutes to prepare a fix and push it through CI/CD. As Incident Commander, what decision do you make?",
        "o": [
          "Order an immediate rollback to the stable version (v2.13.x) to mitigate user impact and postpone live debugging of the code.",
          "Authorize the 25 minutes to deploy a roll-forward hotfix, avoiding managing two consecutive deployments in production.",
          "Temporarily divert requests to an asynchronous retry queue while the developer builds and validates the fix in staging.",
          "Perform a staggered restart of all payments service replicas to check whether the failure is caused by a transient initialization leak."
        ],
        "a": 0,
        "e": "In SRE incident management, the absolute priority is to minimize MTTR by mitigating user impact immediately. When a newly deployed change correlates directly with the start of the incident and the rollback is safe, reverting restores service in minutes; investigating and building a hot fix needlessly prolongs the outage."
      },
      {
        "id": "sre-02",
        "d": 1,
        "t": "SLIs and Latency",
        "q": "VIP customers report extreme slowness and timeouts when confirming orders, but the executive dashboard shows that the API's \"average response time (avg)\" remains stable at 180 ms. Which metric should you review and adopt as an SLI to capture this real problem?",
        "o": [
          "Tail percentiles (p95, p99, and p99.9) derived from request duration histograms at the load balancer.",
          "Aggregated median (p50) latency combined with the microservice's overall requests per second.",
          "Weighted moving average of response time grouped by customer type over five-minute windows.",
          "Aggregate rate of successful transactions (`HTTP 2xx`) normalized against total hourly traffic volume."
        ],
        "a": 0,
        "e": "The arithmetic mean hides extreme values (outliers): if 97 % of requests take 50 ms and 3 % suffer 10-second timeouts, the average still looks healthy (~348 ms), but thousands of users are experiencing failures. Tail percentiles (p95, p99) expose exactly the experience of the most affected users."
      },
      {
        "id": "sre-03",
        "d": 1,
        "t": "Alerts and Burn Rate",
        "q": "Your service has a 99.9 % monthly availability SLO (error budget of 43.2 minutes over 30 days). You want to configure a P1 alert that wakes up the on-call engineer only when the failure rate seriously threatens the budget, and that stops firing as soon as the incident is mitigated. According to the Google SRE Workbook, which strategy is recommended?",
        "o": [
          "Multi-window, multi-burn-rate alert: require simultaneously (AND) that the burn rate exceed 14.4x over the last hour and over the last 5 minutes.",
          "Static error-rate threshold alert: notify if failures exceed 0.1 % of requests in a simple 1-minute sliding window.",
          "Absolute exhaustion-based alert: fire the on-call page as soon as the cumulative monthly budget consumption reaches 100 %.",
          "Extended single-window alert: evaluate only that the burn rate exceeds 6x over a continuous 6-hour moving window."
        ],
        "a": 0,
        "e": "The multi-window multi-burn-rate scheme combines a long window (1h at 14.4x = consumes 2 % of the monthly budget) to ensure the incident is significant and not a fleeting hiccup, with a short window (5m at 14.4x) using AND so that the alert resolves within a few minutes once the incident is fixed."
      },
      {
        "id": "sre-04",
        "d": 1,
        "t": "Incident Command",
        "q": "During a major incident (SEV-1) with 12 engineers on the call, three people start making simultaneous changes to different production components without notice, making the diagnosis worse. As Incident Commander (IC), what is your immediate responsibility?",
        "o": [
          "Establish strict control of the channel: stop uncoordinated changes, channel all operational actions through the Ops Lead under your approval, and instruct the Scribe to keep the log.",
          "Delegate the leadership of the incident to the most senior specialist and withdraw to a private room to inspect the database metrics in isolation.",
          "Preventively revoke the attendees' deployment credentials and personally take over direct execution of corrective commands on the production servers.",
          "Allow each engineer to keep running their tests in parallel for fifteen minutes to see which of the three hypotheses produces an improvement first."
        ],
        "a": 0,
        "e": "The Incident Commander coordinates and maintains a single operational source of truth. When there is \"freelancing\" (engineers applying changes on their own), the system state gets contaminated and it becomes impossible to know which change caused which effect. All actions on production must be announced and approved by the IC."
      },
      {
        "id": "sre-05",
        "d": 1,
        "t": "Blameless postmortems",
        "q": "An engineer ran a maintenance script in the wrong terminal and deleted a table in production because the staging and production environments shared credentials and the console prompt was identical. In the postmortem meeting, a manager proposes reprimanding the engineer and closing the case as \"human error\". What is the correct approach of a Blameless Postmortem?",
        "o": [
          "Treat human error as the initial symptom and prioritize systemic defenses: segregate credentials per environment, implement confirmations in tooling, and differentiate visual prompts.",
          "Classify individual lack of attention as the root cause and establish a formal manual email approval flow before running any administrative script in the console.",
          "Temporarily restrict the offending engineer's access to read-only while they complete a formal training plan on production operational best practices.",
          "Organize a department-wide session to analyze in detail the individual mistakes made by the operator in order to build greater awareness and rigor in the team."
        ],
        "a": 0,
        "e": "In blameless SRE culture (Blameless Postmortem), blaming the person or asking them to \"be more careful\" does not prevent another engineer from falling into the same trap tomorrow. The true root cause is systemic: absence of technical barriers (shared credentials, lack of guardrails, and indistinguishable prompts)."
      },
      {
        "id": "sre-06",
        "d": 1,
        "t": "USE vs RED Method",
        "q": "A bare-metal database node shows intermittent performance drops. Average CPU usage is 45 % and memory usage is 60 %, but disk queries take 10 times longer than normal. Applying the USE method (Utilization, Saturation, Errors), which dimension and indicator will give you the definitive clue?",
        "o": [
          "Storage Saturation and Errors: measure the I/O wait queue (`await` and `aqu-sz` in `iostat`) and check for hardware failures in `dmesg` or SMART logs.",
          "Disk utilization per device: examine the static `%util` percentage in `iostat`, assuming a value below 70 % rules out bus problems.",
          "Network subsystem saturation: record dropped packets (`rx_dropped`) and TCP retransmission events on the physical interfaces connected to the host.",
          "Paging memory utilization: verify the major page fault rate (`pgmajfault`) and swap traffic to active swap partitions."
        ],
        "a": 0,
        "e": "Brendan Gregg's USE method evaluates each physical resource by Utilization, Saturation (queue length / time waiting for a turn), and Errors. A disk or RAID array with hardware failures or IOPS saturation can show low CPU utilization but a very high wait queue (saturation) and bus errors."
      },
      {
        "id": "sre-07",
        "d": 1,
        "t": "Error Budget Policy",
        "q": "A critical checkout microservice has had 3 consecutive weeks of incidents and has consumed 115 % of its monthly Error Budget (its availability dropped to 99.78 % against a 99.9 % SLO). The product team pushes to launch a large experimental feature tomorrow. According to the standard SRE Error Budget policy, what should happen?",
        "o": [
          "Freeze non-critical product deployments and reassign engineering effort to stability improvements and resilience testing until the budget is restored.",
          "Temporarily adjust the service level objective (SLO) to 99.5 % during month-end close to regularize the negative balance and authorize the scheduled deployment.",
          "Enable the experimental feature immediately for 10 % of traffic through a Feature Flag without slowing the pace of delivering new features.",
          "Issue a business exception that allows the launch while keeping alerts temporarily silenced until the feature's trial period ends."
        ],
        "a": 0,
        "e": "The Error Budget turns the tension between product and operations into an objective rule agreed upon in advance: while budget remains, the team can take risks and deploy fast; when the budget is exhausted, reliability, resilience, and postmortem tasks are prioritized before introducing more risky changes."
      },
      {
        "id": "sre-08",
        "d": 1,
        "t": "Alert design",
        "q": "The on-call team receives 90 alerts per night of the type \"CPU > 80 % for 2 minutes on pod X\", but none of them matches real degradation for users. When a real outage occurs at 04:00 AM, the on-call engineer ignores the alert thinking it is another false positive. Which two SRE engineering measures fix this alert fatigue? (Choose 2 answers)",
        "o": [
          "Base the alerts that generate on-call pages on user-perceived symptoms, such as the HTTP failure rate or SLO burn rate, instead of isolated cause metrics.",
          "Downgrade resource saturation alerts with no direct user impact to tickets or daytime review dashboards, avoiding nighttime calls for routine HPA fluctuations.",
          "Raise the CPU trigger threshold to 95 % while keeping the nighttime pager mechanism for any momentary spike recorded in the containers.",
          "Configure an automated script that immediately restarts any pod exceeding 80 % sustained consumption to avoid manual engineer intervention."
        ],
        "a": [
          0,
          1
        ],
        "e": "To eradicate alert fatigue, every alert that interrupts sleep (page) must be actionable, urgent, and reflect real user impact (symptoms / SLO burn rate). Resource utilization signals that the system handles on its own (such as a pod with high CPU under an HPA) should not wake a human."
      },
      {
        "id": "sre-09",
        "d": 1,
        "t": "Incident communication",
        "q": "You have been managing a partial outage of the bank transfer system for 25 minutes. You have not yet confirmed the exact cause, although you are already draining traffic to the contingency site. The incident management agreement requires updates every 20 minutes. What should the Communications Lead do?",
        "o": [
          "Issue the update within the scheduled time, communicating the identified impact, the mitigation actions in progress, and the time of the next report, without waiting to isolate the root cause.",
          "Postpone the communication until the traffic drain to contingency is complete so as not to cause confusion in case the technical maneuver runs into setbacks.",
          "Immediately publish a preliminary technical report attributing the anomaly to latency from the telecommunications network provider to ease the business's concern.",
          "Suspend the periodic communications while waiting to arrange an extraordinary sync call with the operations directors and the company's legal department."
        ],
        "a": 0,
        "e": "During an active incident, silence creates uncertainty and leads executives and support to interrupt the technical team looking for answers. Communicating on time what is known, what is being done to mitigate, and when the next update will be maintains trust without needing to invent a premature root cause."
      },
      {
        "id": "sre-10",
        "d": 1,
        "t": "Toil and Automation",
        "q": "Every time a backoffice user locks their account in production, an SRE engineer must connect via VPN, open Rundeck or a SQL console, check two tables, and run a manual UPDATE. This happens 35 times a day and consumes 3 hours a day of the team's time. How does SRE classify this work and what is the goal?",
        "o": [
          "It is defined as Toil (manual, repetitive work with no enduring value); it should be eliminated by creating a self-service interface or audited API to keep overall toil under 50 %.",
          "It constitutes standard operational support; the recommended practice is to rotate attention among on-call engineers without dedicating development time to automating routine tasks.",
          "It represents architectural technical debt; it should be documented in the general backlog to be addressed exclusively during the comprehensive redesign of the authentication platform.",
          "It corresponds to mandatory governance; it should remain a manual human intervention to certify that no automated process modifies security records in production."
        ],
        "a": 0,
        "e": "Google SRE defines Toil as any task that is manual, repetitive, automatable, tactical, without enduring value, and that grows linearly with traffic or users. Eliminating it through safe automation and self-service frees up time for real engineering that improves the platform."
      },
      {
        "id": "sre-11",
        "d": 2,
        "t": "OOMKilled vs JVM/Go Limits",
        "q": "A Java microservice deployed on Kubernetes restarts every 20 minutes with `OOMKilled` status (Exit Code 137). The Pod manifest has `resources.requests.memory: 1Gi` and `resources.limits.memory: 2Gi`, and the container starts with `-Xmx2048m`. Why does the kernel kill the container if the maximum heap was set to 2048 MB?",
        "o": [
          "The JVM requires native memory outside the Heap (Metaspace, thread stacks, and NIO buffers); with `-Xmx2048m` the total RSS exceeds the cgroup's 2 GiB. You should set `-XX:MaxRAMPercentage=75.0` or increase `limits.memory`.",
          "The Kubernetes scheduler evicts the container when it sustainedly exceeds `requests.memory: 1Gi`; `requests.memory` must be set equal to 2 GiB to grant the `Guaranteed` QoS class without modifying the JVM flags.",
          "`G1GC` garbage collection generates internal fragmentation in the Heap; the `ParallelGC` collector must be forced and `-XX:MinRAMPercentage=80.0` configured so that the cgroup handles paging to disk.",
          "The process exhausts the container's file descriptors upon reaching the Heap ceiling; the `nofile` parameter must be increased in the pod's security spec while keeping the 2048 MB of `-Xmx`."
        ],
        "a": 0,
        "e": "The Kubernetes memory limit (`limits.memory`) applies to the container's entire cgroup (RSS + non-reclaimable cache). In Java (or Go/Node), the process uses Heap + Metaspace + Thread Stacks + Off-Heap/Direct Buffers + native memory. If the Heap alone equals `limits.memory`, as soon as it reaches its ceiling the total process will exceed the cgroup and the Linux OOM Killer will send SIGKILL (128 + 9 = 137)."
      },
      {
        "id": "sre-12",
        "d": 2,
        "t": "CPU CFS Throttling",
        "q": "A Go API inside Kubernetes shows p99 latency spikes of 1.8 seconds, even though the container's average CPU usage is only 350m against a `limits.cpu: 1000m`. In Prometheus you observe that `rate(container_cpu_cfs_throttled_periods_total[5m]) / rate(container_cpu_cfs_periods_total[5m])` exceeds 65 %. What is happening and how do you mitigate it?",
        "o": [
          "It suffers from CPU CFS Throttling: bursts across multiple goroutines exhaust the assigned quota in fractions of the 100 ms window, freezing the process; it is mitigated by relaxing or removing `limits.cpu` with an adequate `requests.cpu`.",
          "Go garbage collector pauses block execution during traffic bursts; it is mitigated by setting `GOGC=off` and fixing `GOMEMLIMIT=1500MiB` to prevent the runtime from stopping threads while serving requests.",
          "The pod competes with noisy processes on the same physical node that degrade its quota; it is mitigated by configuring `cpuManagerPolicy: static` in the kubelet to isolate exclusive cores without modifying the application manifests.",
          "The Linux CFS scheduler period is excessively long; it is mitigated by reducing the global `cpu.cfs_period_us` parameter to 10 ms on the nodes to fragment bursts without changing `limits.cpu` in the deployment."
        ],
        "a": 0,
        "e": "The Linux kernel enforces `limits.cpu` through CFS quotas in 100 ms periods. A service with 8 concurrent threads handling a burst consumes 100 ms of accumulated CPU time in only 12.5 ms of real clock time (8 × 12.5 ms = 100 ms) and is frozen for the other 87.5 ms of the cycle, ruining p99 even though average usage looks low."
      },
      {
        "id": "sre-13",
        "d": 2,
        "t": "Liveness vs Readiness Probes",
        "q": "During a 15-second maintenance on the Redis cluster, all 80 pods of your main API simultaneously enter `CrashLoopBackOff`, causing a total outage of 12 minutes even after Redis was healthy again. When reviewing the Deployment you see that the `livenessProbe` calls `/healthz`, and that endpoint does a `PING` to Redis and a `SELECT 1` to PostgreSQL. What was the design error?",
        "o": [
          "Tying the `livenessProbe` to external dependencies: the Redis failure caused mass pod restarts; the liveness probe should only evaluate the health of the local process, reserving dependencies for the `readinessProbe`.",
          "Configuring an insufficient `failureThreshold` on the `livenessProbe`: it should have been set to 20 retries with `timeoutSeconds: 5` to tolerate Redis outages without decoupling the dependencies from the local probe endpoint.",
          "Omitting a circuit breaker pattern inside the `/healthz` endpoint: it should have returned a forced HTTP 200 on transient external failures while keeping the database check centralized in the same liveness probe.",
          "Using HTTP checks instead of direct TCP probes: a `tcpSocket` to the app port would have avoided evaluating the dependency health endpoint without needing to redefine the pod's probe architecture."
        ],
        "a": 0,
        "e": "If a `livenessProbe` checks external dependencies (databases, caches, other microservices), any latency or brief outage in that dependency will make the kubelet kill all your pods simultaneously, unleashing a cold-start and reconnection storm. The `livenessProbe` should only check the internal health of the process itself."
      },
      {
        "id": "sre-14",
        "d": 2,
        "t": "502 Errors in Rolling Updates",
        "q": "Every time you deploy a new version of a microservice behind Ingress NGINX, a spike of `502 Bad Gateway` errors is recorded in client requests for about 15 seconds, even though the new pods pass their `readinessProbe` before the old ones are terminated. Why does this happen and how do you achieve a truly Zero-Downtime deployment?",
        "o": [
          "Endpoint removal in NGINX and the sending of `SIGTERM` happen in parallel asynchronously; if the app closes the socket immediately, NGINX sends residual traffic. It is mitigated with a `preStop: sleep` hook and graceful shutdown.",
          "The `RollingUpdate` strategy keeps persistent keepalive connections to the old pods; it is mitigated by reducing `keepalive_timeout` to 0 on the Ingress NGINX to force continuous TCP reconnections on every incoming HTTP request.",
          "The scheduler does not wait to drain the iptables tables before shutting down pods; it is mitigated by configuring `maxUnavailable: 0` and `maxSurge: 50%` in the Deployment so that old pods are never removed without doubling total capacity.",
          "The NGINX balancer needs to invalidate internal DNS resolution; it is mitigated by forcing the `resolver-validity: 1s` directive in the Ingress controller's global configuration to synchronize the replica list in real time."
        ],
        "a": 0,
        "e": "In Kubernetes, when a Pod moves to the `Terminating` state, the kubelet triggers `preStop` / `SIGTERM` at the same time as the EndpointSlice controller notifies `kube-proxy` and the Ingress Controller. Since that propagation over the network is asynchronous, adding a small `preStop` (`sleep 5` or `10`) lets the pod be removed from the load balancer before it stops accepting TCP connections."
      },
      {
        "id": "sre-15",
        "d": 2,
        "t": "CoreDNS and ndots:5",
        "q": "Your pods in Kubernetes make thousands of calls per second to external APIs such as `api.mercadopago.com` and `hooks.slack.com`. During peak hours, you observe DNS resolution latencies of up to 5 seconds, CoreDNS pods at 100 % CPU, and `nf_conntrack: table full, dropping packet` messages on the nodes. Which default Kubernetes mechanism multiplies external DNS queries by 5 and how is it mitigated?",
        "o": [
          "The `ndots:5` directive in `/etc/resolv.conf` forces resolution against all internal search domains before the external domain; it is mitigated by implementing `NodeLocal DNSCache`, reducing `ndots:2`, or using absolute FQDNs with a trailing dot.",
          "A lack of CoreDNS replicas saturates the workers' UDP channel; it is mitigated by configuring a `HorizontalPodAutoscaler` on CoreDNS driven by requests per second and enabling session affinity on the `kube-dns` service.",
          "Packet loss from saturated conntrack tables is caused by ephemeral UDP port collisions; it is mitigated by forcing pods to use TCP exclusively for name resolution through the `use-vc` option in `dnsConfig`.",
          "The CoreDNS `cache` plugin lacks a sufficient expiration time; it is mitigated by increasing the `ttl` parameter to 3600 seconds in the upstream block of the `Corefile` to retain external responses in node memory."
        ],
        "a": 0,
        "e": "With `ndots:5` (the default in Kubernetes), any name with fewer than 5 dots is first treated as a relative name and is concatenated with each `search` entry in `/etc/resolv.conf`, generating 8 useless DNS packets before querying the absolute name. `NodeLocal DNSCache` (with TCP connections to CoreDNS) or setting `ndots: 2` drastically reduces queries and UDP `conntrack` entries."
      },
      {
        "id": "sre-16",
        "d": 2,
        "t": "PodDisruptionBudget and Node Draining",
        "q": "You are trying to upgrade the Kubernetes version of your worker nodes. The command `kubectl drain node-04 --ignore-daemonsets --delete-emptydir-data` has been blocked for 40 minutes, retrying to evict pod `ordenes-api-7f8b9-x2k` with the message: `error when evicting pods: Cannot evict pod as it would violate the pod's disruption budget`. What should you check?",
        "o": [
          "Check `kubectl get pdb`: a `PodDisruptionBudget` with `minAvailable: 100%` (or `maxUnavailable: 0`), or with secondary replicas that are not `Ready`, leaves `ALLOWED DISRUPTIONS = 0` and vetoes the eviction.",
          "Check for blockages in the node's CNI network interfaces and force the eviction by running `kubectl drain --force --disable-eviction=true`, assuming there are blocking open sockets in the Pod.",
          "Check whether there are volumes with zonal affinity (`PersistentVolumeClaims`) attached to the pod and force a restart of the kubelet's `systemd` daemon to bypass the scheduler validation.",
          "Check whether the other nodes in the cluster contain untolerated `NoSchedule` taints and temporarily disable the mutating admission controller on the control plane's API Server."
        ],
        "a": 0,
        "e": "The Eviction API respects `PodDisruptionBudgets` (PDB). If a PDB was misconfigured with `maxUnavailable: 0` (or `minAvailable` equal to the current number of healthy replicas), `ALLOWED DISRUPTIONS` will be `0` and `kubectl drain` will never be able to evict any pod of that service until there are more `Ready` replicas or the PDB is adjusted."
      },
      {
        "id": "sre-17",
        "d": 2,
        "t": "Pending Pods and Volume Affinity",
        "q": "After a node failure in the `us-east-1a` availability zone, a stateful pod (mounting a `PersistentVolume` backed by a zonal EBS gp3 disk) stays permanently in `Pending` state. When running `kubectl describe pod`, you see the event: `0/12 nodes are available: 4 node(s) had volume node affinity conflict, 8 node(s) Insufficient cpu`. What exactly does this diagnosis mean?",
        "o": [
          "The EBS volume is zonal and resides in `us-east-1a` (hence the affinity conflict on the 4 nodes in other zones), and the 8 nodes in `us-east-1a` lack free capacity to cover the pod's `requests.cpu`.",
          "The Pod spec has a misconfigured `nodeAffinity` rule pointing to obsolete labels, while the remaining 8 nodes are hogged by pods with `system-node-critical` priority.",
          "The AWS EBS CSI driver lost connectivity with the regional EC2 API, causing the scheduler to misinterpret the attached-volume limits on instances in secondary zones.",
          "The EBS volume reached its guaranteed IOPS bandwidth limit in the original zone, so the scheduler refuses to place the container on nodes exceeding 70 % accumulated CPU reservation."
        ],
        "a": 0,
        "e": "The `FailedScheduling` message breaks down why each of the 12 nodes in the cluster was discarded: zonal block disks (EBS, GCP Zonal PD, Azure Managed Disk LRS) can only be mounted on nodes in their same availability zone (4 nodes discarded for being in another AZ), and the remaining 8 nodes in that same AZ have no free capacity for the requested `requests.cpu`."
      },
      {
        "id": "sre-18",
        "d": 2,
        "t": "HPA and Slow Startup",
        "q": "During a commercial campaign, traffic rises by 300 %. The `HorizontalPodAutoscaler` (HPA) detects CPU at 95 % and scales your Deployment from 10 to 40 replicas. However, the new pods take 90 seconds to initialize caches at startup, and during that startup their CPU hits 100 %, causing the HPA to scale uncontrollably up to the maximum of 100 replicas before the first ones are ready, while the `livenessProbe` starts killing them at 45 seconds. Which two adjustments solve both problems? (Choose 2 answers)",
        "o": [
          "Configure a `startupProbe` with a generous margin (e.g., 120s) to pause `livenessProbe` evaluation until the container's CPU-intensive initialization finishes.",
          "Tune the HPA's `behavior.scaleUp` policy (with a stabilization window and controlled increase rate) to avoid over-scaling induced by the pod startup spike.",
          "Remove the `readinessProbe` check and raise `initialDelaySeconds` on the `livenessProbe` to 180s so that traffic enters immediately without waiting for local warm-up.",
          "Configure the HPA to scale exclusively based on the node memory usage metric (`container_memory_working_set_bytes`), disabling the Deployment's CPU signals."
        ],
        "a": [
          0,
          1
        ],
        "e": "The `startupProbe` is designed specifically for slow-initializing containers: until it succeeds, it blocks execution of `livenessProbe`, preventing premature kills. And configuring `behavior.scaleUp` in HPA v2 together with optimizing warm-up prevents the reactive over-scaling caused by CPU consumption during bootstrap."
      },
      {
        "id": "sre-19",
        "d": 2,
        "t": "NetworkPolicies and Connectivity",
        "q": "A team deploys a `NetworkPolicy` for the first time in the `pagos` namespace to allow only the `checkout` service to connect to port `8080` of `pagos-api` (an `Ingress`-type policy). Immediately afterward, `pagos-api` still receives requests from `checkout`, but it can no longer connect to the external RDS database and stops resolving names in CoreDNS. What would have happened if the policy had also included `policyTypes: [\"Ingress\", \"Egress\"]` with `egress: []`?",
        "o": [
          "Declaring `Egress` with `egress: []` imposes a strict default-deny that blocks all outbound traffic, including DNS (port 53) and RDS; both outbound paths must be explicitly authorized in the `egress` section.",
          "An empty `egress: []` section allows all outbound traffic by default according to the Kubernetes specification; the DNS block would be due to an incompatibility with the cluster's CNI driver.",
          "Traffic to essential services such as `kube-dns` is exempt by default in policies; the isolation would only restrict external public IPs but would keep the connection to RDS in the VPC.",
          "The rule would isolate only outbound communications to other pods within the same `pagos` namespace, leaving TCP connections destined for endpoints outside the cluster intact."
        ],
        "a": 0,
        "e": "In Kubernetes, as soon as a Pod is selected by a `NetworkPolicy` that declares `Egress` in `policyTypes`, all outbound traffic not explicitly authorized is blocked (including DNS traffic to port 53 in `kube-system`). Forgetting to allow egress to CoreDNS (UDP/TCP 53) is one of the most common causes of outages after applying Zero-Trust policies."
      },
      {
        "id": "sre-20",
        "d": 2,
        "t": "Certificates and Secrets in Pods",
        "q": "You updated a Kubernetes `Secret` containing a rotated API key. The pods that mount that `Secret` as a file volume at `/etc/secrets/api-key` see the updated file after ~1 minute, but another group of pods that consume it through environment variables (`envFrom` / `valueFrom.secretKeyRef`) keep using the old key and returning `401 Unauthorized`. Why?",
        "o": [
          "Environment variables in Linux are assigned when the process starts and do not change at runtime; to pick up the `Secret`'s new key, the pods must be restarted with `kubectl rollout restart deployment/...`.",
          "The kubelet synchronizes environment variables only when the periodic 15-minute polling interval completes; it is enough to wait for the node daemon's cycle without needing to recreate the live containers.",
          "The `Secret` was locked with the `immutable: true` property in the API Server; the entire `Secret` object must be recreated in etcd for the `secretKeyRef` pointers to refresh in the runtime.",
          "The container process requires a `SIGHUP` signal to re-read its `/proc/$PID/environ` file; it is solved by sending a `kill -1` command to the main PID without triggering a new rollout of the Deployment."
        ],
        "a": 0,
        "e": "While `Secrets` and `ConfigMaps` mounted as volumes (unless they use `subPath`) are updated periodically by the kubelet through atomic symbolic links, environment variables (`env` / `envFrom`) are fixed in the process memory when the container starts. They require recreating the pods (`rollout restart` or using an operator such as Reloader)."
      },
      {
        "id": "sre-21",
        "d": 3,
        "t": "Kafka Rebalance Storms",
        "q": "In your production Kafka cluster, the `procesador-facturas` consumer group enters a continuous loop of rebalances (`PreparingRebalance` → `CompletingRebalance`) every 5 minutes, `consumer_lag` grows nonstop, and duplicate invoices are being generated. In the consumer logs you see: `CommitFailedException: Offset commit cannot be completed since the consumer is not part of an active group for auto partition assignment; it is likely that the consumer was kicked out of the group`. Each batch of 500 messages makes calls to an external web service that now responds in ~800 ms per message. Which parameter has been exceeded and how do you mitigate it?",
        "o": [
          "The batch takes 400 s and exceeds `max.poll.interval.ms` (300 s), causing ejection by the coordinator; it is mitigated by reducing `max.poll.records` (e.g., to 50) and/or increasing `max.poll.interval.ms`.",
          "The heartbeat thread is blocked by the external web service latency, exceeding `session.timeout.ms` (45 s); it is mitigated by reducing `heartbeat.interval.ms` to 1000 ms and tripling the broker pool.",
          "The commit acknowledgment timeout `default.api.timeout.ms` expires during the commit; it is mitigated by disabling `enable.auto.commit` and running `commitSync()` synchronously after processing each individual invoice.",
          "The `RangeAssignor` assignor revokes all partitions in bulk; it is mitigated by migrating to `CooperativeStickyAssignor` without changing the volume of messages returned by each invocation of the `poll()` method."
        ],
        "a": 0,
        "e": "When the consumer's main thread takes longer than `max.poll.interval.ms` between two calls to `poll()`, the Group Coordinator assumes the consumer is hung, kicks it out of the group, and reassigns its partitions to another consumer (which reads the same uncommitted batch again). Lowering `max.poll.records` makes each `poll()` cycle short and predictable."
      },
      {
        "id": "sre-22",
        "d": 3,
        "t": "Kafka ISR and Availability",
        "q": "A critical transactions topic in Kafka has `replication.factor = 3` and `min.insync.replicas = 3`. Producers write with `acks = all`. At 11:00 AM, broker 2 is restarted to apply a kernel patch. During the 3 minutes that broker 2 is down, all producers fail to publish with `NotEnoughReplicasException`. Why did this happen and what is the recommended configuration for high availability with durability?",
        "o": [
          "With 3 replicas, `min.insync.replicas = 3` requires 100 % of the ISR to acknowledge; if 1 broker goes down, 2 remain and the write is vetoed. The standard architecture is `replication.factor = 3` with `min.insync.replicas = 2`.",
          "The topic lost the transactional quorum of in-sync replicas; `min.insync.replicas = 1` with `acks = all` must be temporarily reconfigured to continue producing even if only one broker survives in the cluster.",
          "The cluster could not re-elect leaders during the restart; `unclean.leader.election.enable = true` must be enabled at the broker level to allow lagging replicas to take temporary leadership.",
          "The producer configuration collided with the broker; the producer must be changed to `acks = 1` so that it acknowledges only on the leader broker, ignoring the configured value of `min.insync.replicas`."
        ],
        "a": 0,
        "e": "With `replication.factor = 3` and `acks = all`, setting `min.insync.replicas = 2` guarantees that each write is acknowledged on at least 2 different brokers (zero data loss if a broker fails), while tolerating maintenance or failure of 1 of the 3 brokers without interrupting writes."
      },
      {
        "id": "sre-23",
        "d": 3,
        "t": "Kafka Connect Poison Pill",
        "q": "A Kafka Connect Sink connector that sends events to Elasticsearch has been in `FAILED` state for 20 minutes. Every time you restart it through the REST API (`POST /connectors/.../restart`), it fails again after 2 seconds at the same offset because a producer published a JSON with a corrupt date field that fails to parse. There are 400,000 legitimate messages waiting behind it. What is the correct way to unblock the operation without losing traceability of the corrupt message?",
        "o": [
          "Configure `errors.tolerance = all` with `errors.deadletterqueue.topic.name` and context headers; restart the task to divert the corrupt message to the DLQ without stopping the ingestion of the 400,000 events.",
          "Manually advance the Kafka Connect group offset using `kafka-consumer-groups --shift-by 1` on the affected partition to skip the poisoned record without modifying the worker configuration.",
          "Set `errors.tolerance = all` with `errors.log.enable = true` without defining a DLQ, discarding messages with parsing errors directly to the container log to maximize throughput to Elasticsearch.",
          "Change the dynamic mapping of the index in Elasticsearch to `\"dynamic\": true` so that it accepts any format in the corrupt date field without needing to divert the message flow to a secondary topic."
        ],
        "a": 0,
        "e": "A \"poison pill\" blocks the entire partition (Head-of-Line blocking) if `errors.tolerance` is set to `none` (the default value). Enabling `errors.tolerance = all` together with a Dead Letter Queue (DLQ) and context headers automatically sends the defective record to the DLQ topic with the exact reason for the failure for later inspection, immediately unblocking the main flow."
      },
      {
        "id": "sre-24",
        "d": 3,
        "t": "Hot Partitions and Key Skew",
        "q": "Your `eventos-inventario` topic has 24 partitions and your consumer microservice has 24 replica pods. However, during CyberDay you see that 23 pods are at 5 % CPU with lag 0, while a single pod is at 100 % CPU and accumulates 800,000 messages of lag on partition 7. What is the cause and what should you check?",
        "o": [
          "Key skew (Key Skew / Hot Partition): the producer uses a hyper-frequent partitioning key (such as the central warehouse ID or a null string) that the hash function invariably assigns to partition 7.",
          "Horizontally scale the consumer Deployment from 24 to 48 replicas to associate multiple concurrent pods with partition 7 through parallel worker threads within the same Kafka consumer group.",
          "A failure in the coordinator broker's rebalance protocol that incorrectly assigned multiple virtual partitions to the pod of partition 7; it is mitigated by forcing a graceful restart of the entire cluster.",
          "Misalignment of the Snappy compression algorithm on the broker of partition 7 that slows decompression on the client; it is solved by migrating the storage format to `compression.type=producer`."
        ],
        "a": 0,
        "e": "In Kafka, a partition can be consumed by at most one consumer within the same Consumer Group (adding more than 24 pods would leave the extra pods idle). When a single partition concentrates the lag and load, it is because the message key's hash function sends most events to that partition. It requires designing a more granular (composite) key or sub-partitioning the work."
      },
      {
        "id": "sre-25",
        "d": 3,
        "t": "Retry Storm",
        "q": "The catalog service suffered a 10-second network outage. Although the network has fully recovered, the service remains down at 100 % CPU, receiving 5 times its usual traffic because the 40 client microservices and the mobile app are immediately retrying every failed request without pause in a tight loop. Which combination of mechanisms prevents and stops this retry storm?",
        "o": [
          "Exponential Backoff with random Jitter on clients, Retry Budget (cap of 10 % additional requests), Circuit Breakers to cut calls on failures, and preventive Load Shedding / Rate Limiting on the server.",
          "Scale replicas reactively through an aggressive HPA with a CPU threshold of 40 % to absorb the massive flow of concurrent retries without rejecting connections or applying preventive backpressure on clients.",
          "Configure ultra-short 200 ms timeouts on clients with immediate linear retries and enable the `Retry-After: 1` header on all catalog error responses to dampen traffic.",
          "Configure a reverse proxy with `stale-while-revalidate` caching that returns old cached catalog responses, keeping clients retrying indefinitely against the load balancer."
        ],
        "a": 0,
        "e": "Synchronized immediate retries cause a metastable failure (load amplification). Exponential Backoff spaces out attempts, Jitter desynchronizes the waves of clients, the Retry Budget / Circuit Breaker stops retries at the source when the failure is widespread, and Load Shedding lets the server recover by dropping the excess traffic."
      },
      {
        "id": "sre-26",
        "d": 3,
        "t": "Idempotency in Payments",
        "q": "During a latency spike, the payment gateway correctly processes a charge on the customer's card, but the HTTP response takes 5.2 seconds and the API client cuts the connection at 5.0 seconds due to a timeout. When the request is automatically retried, the customer is charged twice. How should this flow be correctly designed so that retrying is safe?",
        "o": [
          "Require an idempotency token (`Idempotency-Key`) generated by the client and stored atomically on the server with the charge; on retries with the same key, return the previous result without duplicating the charge.",
          "Implement a distributed lock in Redis based on the user identifier with a 10-second expiration, rejecting requests if the lock is still active while the bank processor responds.",
          "Require the client to make a `GET /status` query before each retry to check whether the charge was recorded, delegating the decision to resend the payment request to the client's polling logic.",
          "Run a `SELECT` query on the payments database filtering by amount and recent timestamp right before sending the external transaction, aborting if matching records are detected."
        ],
        "a": 0,
        "e": "In distributed systems, on a network timeout the client cannot tell whether the request failed before reaching the server or executed successfully and the response was lost. The only way to achieve exactly-once delivery in business effects (such as charges) over at-least-once retries is to make the receiver idempotent through a unique `Idempotency-Key`."
      },
      {
        "id": "sre-27",
        "d": 3,
        "t": "Cascading Timeouts and Deadlines",
        "q": "The API Gateway has a 3-second timeout to service A. However, service A has a 30-second timeout configured to service B and the database. When service B degrades, the API Gateway cuts off at 3 seconds and returns 504 to the user, but service A keeps running the heavy query for another 27 seconds and exhausts all its worker threads. Which pattern solves this waste of resources?",
        "o": [
          "Align timeouts in a decreasing cascade downstream and propagate Deadlines/cancellation contexts (`context.Context` / gRPC deadlines); if the gateway cuts the call, downstream services abort the work immediately.",
          "Raise the API Gateway timeout to 35 seconds to place it above the accumulated time of the dependent services, guaranteeing that the gateway never interrupts active backend requests.",
          "Implement a Bulkhead pattern isolating service A's connection pool to service B, limiting the threads allocated to the integration without needing to synchronize deadlines or propagate cancellations.",
          "Make the communication asynchronous by converting HTTP calls into events through a persistent intermediate queue, responding with an HTTP 202 ticket to the user so they poll the status periodically."
        ],
        "a": 0,
        "e": "Working on a request whose client disconnected 20 seconds ago burns CPU, database connections, and memory for a response nobody will read (zombie work). Propagating deadlines and cancellation signals together with shorter timeouts in the inner layers than in the outer ones frees resources immediately."
      },
      {
        "id": "sre-28",
        "d": 3,
        "t": "Graceful Degradation",
        "q": "During Black Friday, the \"AI-powered personalized recommendations\" microservice on the product detail page starts failing with 500 errors due to GPU saturation. Because the e-commerce backend calls it synchronously and as mandatory, the entire product page returns a 500 error and nobody can buy. Which architectural change applies the Graceful Degradation principle?",
        "o": [
          "Treat the recommendation as an ancillary service with a strict timeout (150 ms) and a fallback to a best-sellers cache or hide the widget, ensuring that browsing and purchasing are never interrupted.",
          "Add urgent autoscaling to the GPU cluster and raise the call timeout to 5 seconds in the backend, allowing requests to wait as long as needed until the AI inference finishes.",
          "Implement background retries from the browser frontend via WebSockets to refresh the carousel once the recommendations service recovers, keeping the blocking in the backend.",
          "Place an in-memory queue with infinite retries inside the product backend to guarantee that no request to the recommendation model is lost during GPU saturation peaks."
        ],
        "a": 0,
        "e": "In resilient architecture, a secondary or enriching component (recommendations, reviews, avatars) must never be a single point of failure (SPOF) for the business-critical path (search and pay). With a Circuit Breaker and a static or empty degraded fallback, the user can keep buying without noticing the internal failure."
      },
      {
        "id": "sre-29",
        "d": 3,
        "t": "Eventual Consistency and the Outbox Pattern",
        "q": "A microservice saves an order in PostgreSQL (`COMMIT`) and on the next line publishes an `PedidoCreado` event to Kafka. During a brief network outage to Kafka, the `COMMIT` in PostgreSQL succeeds but the publish to Kafka fails (or the pod dies right between the two lines), leaving paid orders in the database that are never sent to the warehouse. Which pattern resolves this dual write (Dual Write)?",
        "o": [
          "Transactional Outbox pattern: write the order and the event to the `outbox` table in the same local ACID transaction; a decoupled process (CDC or poller) relays the events to Kafka with delivery guarantees.",
          "Reverse the execution sequence: first publish the event to the Kafka topic with full replica acknowledgment and then commit the ACID transaction in PostgreSQL with explicit error handling.",
          "Implement a two-phase distributed transaction coordinator (Two-Phase Commit / XA) between the Kafka broker and the PostgreSQL engine to commit both data stores simultaneously.",
          "Wrap the call to the Kafka producer in an intensive synchronous retry loop inside the database transaction before executing the final `COMMIT` of the purchase in the orders table."
        ],
        "a": 0,
        "e": "Writing directly to two different systems (PostgreSQL and Kafka) without a transactional coordinator always suffers from race conditions if the process crashes between the first commit and the second. With Transactional Outbox, persistence of the state and the event to be sent is atomic in a single local database, guaranteeing at-least-once delivery to Kafka."
      },
      {
        "id": "sre-30",
        "d": 3,
        "t": "Bounded Queues and Backpressure",
        "q": "A service ingests events over HTTP and puts them into an in-memory queue (`chan` or `LinkedBlockingQueue` with no size limit) for a pool of 4 threads to write to disk. When the disk slows down for 10 minutes, the in-memory queue grows to accumulate 4 million objects, the garbage collector (GC) consumes 98 % of the CPU, and the process dies with `OutOfMemoryError`, losing the 4 million events in RAM. Which design principle was missing?",
        "o": [
          "Bounded queues and backpressure (Backpressure / Load Shedding): set a maximum capacity on the queue and respond with `HTTP 429 / 503` when saturated to slow the input and force senders to pause or retry.",
          "Dynamic memory allocation: increase the JVM Heap to 90 % of physical RAM and double the consumer thread pool to 32 to speed up draining of the in-memory structure before OOM occurs.",
          "Overflow to secondary storage: temporarily serialize excess events to swap files in the local `/tmp` directory when memory exceeds 80 %, avoiding rejecting incoming HTTP traffic.",
          "Queues based on weak references (`WeakReference`): let the garbage collector automatically purge old objects when memory reaches the critical limit without interrupting data ingestion."
        ],
        "a": 0,
        "e": "An unbounded in-memory queue does not absorb sustained overloads: it only moves the bottleneck to RAM until it causes a catastrophic OOM with loss of everything queued. Bounding queues and applying backpressure (or quickly responding 429/503) keeps the service alive and predictable under saturation."
      },
      {
        "id": "sre-31",
        "d": 4,
        "t": "Cardinality Explosion",
        "q": "Your production Prometheus server starts restarting with `OOMKilled` every hour after the deployment of a new version of the `auth-api` service. RAM consumption went from 6 GiB to 48 GiB and queries in Grafana time out. When querying `/api/v1/status/tsdb` you see that the `http_requests_total` metric went from 1,200 series to 4,800,000 active series because someone added the `user_id` and `session_token` labels to the counter. What is the immediate mitigation in Prometheus and the definitive fix?",
        "o": [
          "Deploy `metric_relabel_configs` with `action: labeldrop` in Prometheus to discard `user_id` and `session_token` at ingestion, then remove those labels from the app code and move them to logs or traces.",
          "Reduce database retention with `--storage.tsdb.retention.time=2h` in Prometheus to purge old blocks on disk, keeping the user labels so as not to lose granularity in Grafana.",
          "Configure a recording rule (`recording rule`) that precomputes `sum by(status)` over the original metric every minute, keeping the high-cardinality labels on the application's `/metrics` endpoint.",
          "Enable hot block compression and delegate ingestion to a Thanos Receive cluster via `remote_write`, allowing the 4.8 million active series to be persisted without altering the counter's labels."
        ],
        "a": 0,
        "e": "Each distinct value of `user_id` × `session_token` creates a new time series in the TSDB index. With `metric_relabel_configs` (`action: labeldrop`, `regex: \"(user_id|session_token)\"`) you discard those labels before they enter the TSDB without waiting for a new app deployment, and then you clean up the source code."
      },
      {
        "id": "sre-32",
        "d": 4,
        "t": "PromQL rate() vs scrape_interval",
        "q": "The collection interval (`scrape_interval`) of your global Prometheus is `30s`. A teammate creates a Grafana panel and an alert with the expression `rate(http_requests_total[30s])`, but the chart appears full of blank gaps (\"No data\") and the alert never evaluates correctly. Why does that PromQL query fail?",
        "o": [
          "`rate()` needs at least 2 samples in the window to compute the derivative; with `[30s]` and a 30s interval only 1 sample falls in (or 0 due to jitter). The recommended minimum window is 4× the scrape interval (e.g., `[2m]`).",
          "`rate()` must be replaced with the `irate(http_requests_total[30s])` function, since `irate()` computes the instantaneous rate using a single sample without requiring interpolation of additional samples in the range.",
          "The `Min step: 30s` directive is missing in the Grafana panel's query options to force the PromQL engine to exactly synchronize the graphical resolution with the metrics exporter's clock.",
          "PromQL cannot extrapolate values without applying an `offset 30s` modifier, which compensates for scrape delay and aligns the moving window with the last consolidated block of the TSDB database."
        ],
        "a": 0,
        "e": "In PromQL, `rate()` and `irate()` require at least two points within the range selector `[...]` to extrapolate the per-second derivative. The official Prometheus best practice is to use a range of at least `4 × scrape_interval` (with a 30s scrape, use `[2m]` at minimum) to be resilient to slightly delayed or missed scrapes."
      },
      {
        "id": "sre-33",
        "d": 4,
        "t": "Aggregating Percentiles and Histograms",
        "q": "You have 20 replicas of an API. Each replica exposes a precomputed `Summary` with its local 99th percentile (`http_response_time_p99`). To see the service's global p99 in Grafana, an engineer writes `avg(http_response_time_p99)`. During an incident in which 2 replicas receive 60 % of the traffic and take 5 seconds while the other 18 have almost no traffic at 20 ms, the panel still shows ~518 ms. Why is this incorrect and how should it be computed in Prometheus?",
        "o": [
          "Averaging percentiles is mathematically invalid because it distorts the weighted distribution; a `Histogram` should be used and aggregated with `histogram_quantile(0.99, sum(rate(http_response_time_seconds_bucket[5m])) by (le))`.",
          "A weighted average should be applied by multiplying each pod's p99 by its request volume: `sum(http_response_time_p99 * rate(http_requests_total[5m])) / sum(rate(http_requests_total[5m]))` while keeping the `Summary`.",
          "The correct operator on precomputed summaries is `max(http_response_time_p99)`, since it accurately reflects the worst percentile recorded by any active pod without needing to migrate to histograms.",
          "The aggregation function `quantile(0.99, http_response_time_p99)` should be used in PromQL to compute the percentile of percentiles over the instantaneous vector of replicas instead of averaging them arithmetically."
        ],
        "a": 0,
        "e": "Quantiles/percentiles are neither aggregatable nor averageable: the average of twenty local p99s has no relation to the global p99 if traffic or distribution varies between pods. In contrast, a histogram's bucket counters (`_bucket` with the `le` label) can be summed across all replicas with `sum by (le) (rate(...))` before applying `histogram_quantile()`."
      },
      {
        "id": "sre-34",
        "d": 4,
        "t": "Thanos Compactor Singleton",
        "q": "In your observability platform with Thanos on S3/GCS, you notice that long-range queries (30 or 90 days) are getting slower and slower and that the `thanos-compactor` component constantly fails with overlapping block errors (`overlapping blocks`) and metadata corruption. When reviewing Kubernetes you see that someone scaled the `thanos-compactor` Deployment to `replicas: 3` for \"high availability\". What is the problem?",
        "o": [
          "The highest finite bound of the histogram was `le=\"10.0\"` (+Inf); for larger values, `histogram_quantile()` interpolates linearly within the last bucket and reports its edge (`10.0s`). The buckets must be adjusted to the real range.",
          "The global `scrape_timeout: 10s` parameter aborted the collection of the slowest samples; Prometheus automatically truncates any histogram value that exceeds the scrape time configured in the job.",
          "The expression omitted the infinite bucket (`le=\"+Inf\"`) when computing the sum in PromQL; the `histogram_quantile()` function by default assigns the value of the largest available bucket when the total sum of samples does not match.",
          "The microservice's metrics library implements a timer with a 10-second cutoff to mitigate memory contention, diverting slower requests to an independent failure counter."
        ],
        "a": 0,
        "e": "Unlike `Thanos Querier` or `Thanos Store Gateway` (which are stateless and scalable to multiple replicas), `Thanos Compactor` modifies and replaces TSDB blocks in the Object Storage bucket. Running two or more instances over the same series at the same time corrupts the bucket state."
      },
      {
        "id": "sre-35",
        "d": 4,
        "t": "Thanos HA Deduplication",
        "q": "You have two identical Prometheus servers (`prom-a` and `prom-b`) scraping the same pods in high availability, each with its `Thanos Sidecar` connected to `Thanos Querier`. However, when querying in Grafana through `Thanos Querier`, you see each series duplicated or `sum()` values come out at exactly double the real ones. Which configuration is missing?",
        "o": [
          "`group_by` (groups by common labels such as `cluster`), `group_wait` (initial wait to accumulate alerts of the same incident), and `group_interval` (wait before emitting batches with new alerts of the group).",
          "`repeat_interval` extended to 12 hours combined with `resolve_timeout: 5m` to freeze notifications from new containers without needing to define label-based aggregation criteria.",
          "`mute_time_intervals` configured on the Slack receiver to temporarily silence the communication channels during the scheduled execution of deployments in production environments.",
          "Global `inhibit_rules` that discard any subsequent alert after the first notification is recorded, without applying dampening in `group_wait` or aggregation filters in the route."
        ],
        "a": 0,
        "e": "For `Thanos Querier` to transparently merge the samples of an HA pair of Prometheus servers without duplicating results in `sum()`, both Prometheus servers must share the same `external_labels` except for the replica label (such as `replica=\"prom-a\"` / `replica=\"prom-b\"`), which is specified in `--query.replica-label`."
      },
      {
        "id": "sre-36",
        "d": 4,
        "t": "Correlating Metrics, Logs, and Traces",
        "q": "During a p99 latency investigation, you see in Grafana that the > 2 seconds bucket of the Prometheus histogram spikes at a specific moment, but there are 5,000 requests per second in the logs and searching by hand for which request was the slow one takes too long. Which two OpenTelemetry and Prometheus practices let you jump in one click from the spike on the chart to the exact trace and logs of that request? (Choose 2 answers)",
        "o": [
          "Enable Exemplars on Prometheus histograms, linking the `trace_id` to sample points, allowing you to jump from the Grafana panel to the trace viewer in Tempo or Jaeger.",
          "Transparently inject `trace_id` and `span_id` as key fields in the app's structured JSON logs to correlate traces with the service's records.",
          "Record the `trace_id` as a permanent label (`label`) on the Prometheus HTTP requests counter to filter individual metrics by transaction identifier.",
          "Configure a cron script that queries the Jaeger API looking for slow traces to periodically dump their identifiers into a static table in the operational database."
        ],
        "a": [
          0,
          1
        ],
        "e": "Exemplars let you associate a `trace_id` with a histogram bucket without creating new time series (avoiding cardinality explosion), and by including `trace_id` in structured JSON logs you can correlate Metric → Distributed Trace → exact Logs in seconds."
      },
      {
        "id": "sre-37",
        "d": 4,
        "t": "Absence of signal and Dead Man's Switch",
        "q": "Your Prometheus alert to detect failures in the billing service is `rate(billing_errors_total[5m]) > 5`. At 02:00 AM, the cluster where `billing-service` runs loses network connectivity entirely (or all pods are deleted by mistake). Since Prometheus can no longer scrape any pod, the `billing_errors_total` metric disappears and the expression returns an empty vector, so NO alert fires. How do you prevent this blind spot?",
        "o": [
          "Add alerts on `up == 0` or `absent(up{job=\"billing-service\"}) == 1`, check for anomalous drops in total traffic, and have a Watchdog alert to guarantee Alertmanager is operational.",
          "Chain the metric expression with a default scalar vector using `(rate(billing_errors_total[5m]) or on() vector(0)) > 5` to ensure the rule never returns an empty result during network failures.",
          "Configure the `keep_firing_for: 30m` directive in the Prometheus rule to retain indefinitely the last failure state evaluated before the metrics exporter disconnected.",
          "Reduce the global `evaluation_interval` parameter from 1 minute to 5 seconds so that the rules engine detects the connection loss before the series are declared stale."
        ],
        "a": 0,
        "e": "In PromQL, when a query returns an empty vector (because no series match in the current window), the alert rule is not satisfied and becomes inactive. Monitoring `up == 0` / `absent(...)` for each critical job and having a continuous `Watchdog` ensures that the total disappearance of a service or of the monitoring system itself always generates an alert."
      },
      {
        "id": "sre-38",
        "d": 4,
        "t": "Counters and Resets in PromQL",
        "q": "A pod restarts and its in-memory counter `orders_processed_total` goes from `15,400` to `0`, and one minute later it is `120`. A developer fears that `rate(orders_processed_total[5m])` will give a huge negative number (`-15,280 / 300s`) and break the alerts. How do `rate()` and `increase()` actually behave in Prometheus on a counter reset?",
        "o": [
          "They detect drops in value between successive samples, interpreting them as a counter reset to zero, adding the new value to the previous delta to always deliver a positive, continuous rate.",
          "They return a transient negative differential value that forces you to wrap the calculation in `clamp_min(rate(...), 0)` to prevent unexpected anomalous drops in panels and alerts based on static thresholds.",
          "They completely discard the affected calculation window, returning `NaN` until the new counter accumulates a number of samples greater than the one recorded before the reset.",
          "They require adding the `resets(orders_processed_total[5m])` function inside the mathematical formula to manually correct the discontinuity in the time series on unexpected restarts."
        ],
        "a": 0,
        "e": "Automatic handling of counter resets (counter reset detection) is one of the reasons `rate()` and `increase()` exist in PromQL: if sample $t_2$ is lower than $t_1$, PromQL interprets that the process restarted after $t_1$ and compensates the calculation so that the rate is always positive. (Note: this is why you should never use `rate()` on a `Gauge` that legitimately goes up and down)."
      },
      {
        "id": "sre-39",
        "d": 4,
        "t": "Structured Logs and Ingestion Costs",
        "q": "The monthly bill of your observability platform (Datadog / Cloud Logging / Elasticsearch) multiplied by 6 this month and the daily index saturated midday. When auditing the traffic you see that a single microservice generates 82 % of the volume because it left active a middleware that logs the full body of every HTTP 200 response (including 200 KB JSON catalogs) in plain text. What is the correct SRE strategy?",
        "o": [
          "Immediately filter out HTTP 200 bodies in the agent/collector, patch the code to stop dumping massive payloads on successful responses, and set per-service ingestion volume quotas and alerts.",
          "Enable stream compression in the collector daemon and divert all the massive logs to a cold object storage bucket (S3/GCS), preserving the detailed payload dump in the code.",
          "Expand the daily ingestion quota in the observability platform by negotiating a higher corporate tier and reduce the hot index retention period from 30 to 5 days to control cost.",
          "Reconfigure the ingestion pipeline to transform the JSON body into a unique SHA-256 cryptographic hash, storing the processed value in the primary index to allow direct forensic searches."
        ],
        "a": 0,
        "e": "In modern observability, collectors (Datadog Agent, OpenTelemetry Collector, Vector, Fluent Bit) allow you to filter or truncate giant fields on the fly without waiting for a deployment, protecting the budget and the index quota. High-volume 200 OK requests are represented with metrics and trace sampling (head/tail sampling), not by dumping 200 KB bodies per log."
      },
      {
        "id": "sre-40",
        "d": 4,
        "t": "Trace Sampling (Tail-based vs Head-based Sampling)",
        "q": "You want to capture 100 % of distributed traces for requests that end in error (HTTP 5xx) or whose total latency exceeds 1.5 seconds, but only 1 % of normal fast, successful requests to control costs. What type of sampling do you need in your OpenTelemetry architecture?",
        "o": [
          "Tail-based sampling in the OpenTelemetry Collector, retaining spans in a buffer to decide whether to keep or discard the full trace after checking whether there was an error or whether latency exceeded 1.5 seconds.",
          "Probabilistic head-based sampling configured at 1 % in the ingress proxy's SDK, delegating to the root span the prediction of the behavior and duration of downstream dependencies.",
          "Local rate-limiting sampling in each microservice setting a cap of 50 traces per second, ensuring deterministic sampling at the source without deploying an intermediate Collector layer.",
          "Span-to-metrics sampling in the observability backend, converting spans under 1.5s into aggregation metrics after ingesting 100 % of the traffic into the central platform."
        ],
        "a": 0,
        "e": "With Head-based sampling, the decision to sample is made at millisecond 0 when the request enters, before knowing whether it will produce a 500 error in the last microservice or take 3 seconds. Tail-based sampling retains a trace's spans in memory for a few seconds in the Collector and keeps 100 % of anomalous traces (errors or high latency) while discarding most routine ones."
      },
      {
        "id": "sre-41",
        "d": 5,
        "t": "Connection Exhaustion in PostgreSQL",
        "q": "During a high-traffic event, the HPA scales your microservices from 15 to 120 pods. Suddenly, the PostgreSQL database (configured with `max_connections = 500`) starts rejecting connections with `FATAL: sorry, too many clients already`, the DB CPU rises to 100 %, and the entire platform goes down. Each pod had a pool of 10 connections configured (`120 × 10 = 1,200 > 500`). What is the recommended architectural solution instead of simply raising `max_connections` to 5,000 in PostgreSQL?",
        "o": [
          "Deploy a pooler such as PgBouncer in transaction mode to multiplex logical connections over a bounded pool of physical processes (100–200) in PostgreSQL, tuning the pool per replica.",
          "Increase `max_connections = 2000` in `postgresql.conf` and vertically scale the database instance's RAM to absorb the memory cost of the dedicated backend processes.",
          "Configure a layer-4 TCP load balancer (HAProxy) in front of the database to queue the excess connection requests and distribute them among read replicas in a balanced way.",
          "Reduce the local pool size to 3 connections per pod in the application's ORM and configure exponential backoff for connection retries to avoid exceeding the allowed global limit."
        ],
        "a": 0,
        "e": "In PostgreSQL, each physical connection is an operating system process (`postgres` backend process) that consumes several megabytes of RAM and generates lock/snapshot contention and CPU context switches if thousands are active. PgBouncer in transaction mode keeps a few real warm connections to PostgreSQL while accepting thousands of clients from Kubernetes."
      },
      {
        "id": "sre-42",
        "d": 5,
        "t": "Cache Stampede in Redis",
        "q": "Your application's homepage queries a Redis key `home:featured_products` that has a TTL of 300 seconds and takes 2.5 seconds to compute through a heavy JOIN on the database. With 4,000 users per second on the homepage, every exact 5 minutes when the key expires in Redis, 10,000 concurrent requests suffer a simultaneous cache miss and launch the 10,000 heavy SQL queries at once, causing 100 % CPU spikes on the database. How do you eradicate this Cache Stampede?",
        "o": [
          "Implement Request Coalescing (Singleflight) or a distributed lock with the `stale-while-revalidate` pattern: only one thread recalculates the value in the database while the rest wait or read the previous data.",
          "Extend the TTL in Redis to 86400 seconds (24 hours) and schedule a nightly cron job that regenerates the key outside business hours, dispensing with real-time synchronization.",
          "Divert the 10,000 concurrent queries to a dedicated PostgreSQL read replica to isolate the impact of the cache miss without modifying the key expiration logic.",
          "Inject `Cache-Control: public, max-age=300` HTTP headers in the web response to force the clients' browsers to store the result locally for 5 minutes."
        ],
        "a": 0,
        "e": "The Cache Stampede (Thundering Herd) phenomenon occurs when multiple threads try to regenerate the same just-expired key in parallel. With Singleflight / request coalescing or asynchronous refresh before expiration (stale-while-revalidate / probabilistic early expiration), the database receives only 1 query instead of 10,000."
      },
      {
        "id": "sre-43",
        "d": 5,
        "t": "DDL Migrations and Table Locks",
        "q": "At 12:30 PM (peak hour), a deployment runs a schema migration on the `transacciones` table (180 million rows) in PostgreSQL that tries to add a column with an operation that requires a prolonged `ACCESS EXCLUSIVE LOCK`. Although the `ALTER TABLE` is left waiting behind a 10-minute analytical query, all new reads (`SELECT`) and writes (`INSERT`) from the application are immediately blocked in a queue and the site goes down completely. Why were even the `SELECT`s blocked and how is it avoided?",
        "o": [
          "A DDL waiting for `ACCESS EXCLUSIVE LOCK` queues and blocks all subsequent transactions (`SELECT`, `INSERT`); it is avoided by setting a short `lock_timeout` (e.g., 2s) with retries and expand-and-contract techniques.",
          "PostgreSQL automatically raises the isolation level to `SERIALIZABLE` during any `ALTER TABLE` operation; it is avoided by running the change with the `SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED` option.",
          "The database engine generates a full dump of the table to temporary disk to reorganize the physical tuples; it is avoided by first running a `VACUUM ANALYZE` to preload the free space map.",
          "`SELECT` queries are paused because the planner invalidates the system catalog's shared memory; it is avoided by running the script inside a `BEGIN ... END` block with an explicit `SHARE` lock level."
        ],
        "a": 0,
        "e": "It is one of the most classic production outages with PostgreSQL: even though the `ALTER TABLE` has not yet acquired the `ACCESS EXCLUSIVE LOCK` because it is waiting for a long transaction, its request in the queue prevents new `ACCESS SHARE LOCK`s (simple `SELECT`s) from getting through. Setting `SET lock_timeout = '2s'` before any migration guarantees that, if it does not obtain the lock within 2 seconds, the DDL fails cleanly without queuing the entire application."
      },
      {
        "id": "sre-44",
        "d": 5,
        "t": "DRP: RPO vs RTO and Asynchronous Failover",
        "q": "The business defines for the main database an RPO (Recovery Point Objective) of 0 seconds (zero loss of committed transactions) and an RTO (Recovery Time Objective) of 10 minutes in the event of an availability zone failure. Currently you have a primary instance in Zone A with asynchronous replication to a replica in Zone B that accumulates 45 seconds of `replication_lag` at peak hours. Does your architecture meet the objective and why?",
        "o": [
          "It fails the RPO = 0: with asynchronous replication and 45s of lag, promoting the replica after a Zone A failure loses 45s of committed data; an RPO of zero requires synchronous replication or a multi-AZ quorum.",
          "It comfortably satisfies both commitments: the 45-second lag is well below the 10-minute RTO window and the asynchronous engine guarantees data durability when switching replicas.",
          "It fails the 10-minute RTO because of network latency between zones, but satisfies RPO = 0 by persisting WAL records in a deferred manner on the replica's redundant storage.",
          "It satisfies the zero-second RPO because the relational engine blocks committed transactions in the primary's buffer until the secondary node issues the network acknowledgment."
        ],
        "a": 0,
        "e": "The RPO measures the maximum tolerable data loss in time looking backward from the moment of failure; the RTO measures how long it takes you to restore service going forward. If your replica is 45 seconds behind asynchronously, promoting it after the primary's destruction means losing those 45 seconds of writes (actual RPO = 45s > 0s)."
      },
      {
        "id": "sre-45",
        "d": 5,
        "t": "Split-Brain in Database Failover",
        "q": "A homegrown monitoring script pings the primary database in Zone A from Zone B. During a temporary network partition between both zones (while both keep receiving traffic from different load balancers), the script gets no ping response and automatically promotes the Zone B replica to primary without isolating or shutting down the Zone A node. For 8 minutes, both instances accept independent writes with the same auto-incrementing IDs. What is this incident called and how is it prevented?",
        "o": [
          "Split-Brain failure: it is avoided with an odd-sized distributed quorum (e.g., Patroni with etcd across 3 AZs), fencing mechanisms (STONITH) to isolate the old node, and by avoiding failover scripts without external consensus.",
          "Byzantine Fault condition: it is prevented by configuring a 60-second ICMP retry threshold and complementing the failover script with a SQL probe query directly to the database port.",
          "Active Replica Collision: it is mitigated by enabling active-active bidirectional multi-master replication so that both instances automatically merge the divergent changes in the background.",
          "Cascade-in-Cascade condition: it is eradicated by configuring an Anycast DNS load balancer with layer-7 health checks to switch the public IPs without requiring coordination between data nodes."
        ],
        "a": 0,
        "e": "A network failure from a single observation point never distinguishes whether the primary node died or whether only the link between the two was cut. Promoting a replica without quorum (e.g., etcd/Consul/Patroni with a lease renewed by majority) or fencing creates two active primaries (Split-Brain) whose conflicting writes cannot be merged automatically."
      },
      {
        "id": "sre-46",
        "d": 5,
        "t": "Read-After-Write Consistency with Read Replicas",
        "q": "To relieve the load on the primary database node, you modify the API so that all `POST /perfil` requests write to the primary node and all `GET /perfil` requests read from the asynchronous read replicas. Users immediately report that when they save a change to their profile and the screen automatically reloads (100 ms later), they see their old data as if it had not been saved. What phenomenon is occurring and how is it resolved without giving up the replicas?",
        "o": [
          "Under MVCC, the transaction holds the oldest `xmin`; `autovacuum` cannot recycle dead tuples created after that point so as not to violate the snapshot, generating bloat. It is mitigated with `statement_timeout`.",
          "The analytical query acquired an `ACCESS EXCLUSIVE LOCK` that prevented concurrent execution of the `autovacuum` process; it is fixed by scheduling a daily `VACUUM FULL` immediately after the query.",
          "The `maintenance_work_mem` parameter proved insufficient to store the dead tuple pointers in memory, forcing `autovacuum` to abort cleanup to avoid planner locks.",
          "The query saturated the WAL logical replication buffer, forcing the collector to suspend the disk page sweep until the replicas confirmed receipt of all transactional changes."
        ],
        "a": 0,
        "e": "Even in a healthy cluster, asynchronous replication takes tens or hundreds of milliseconds. If the browser makes a `POST` followed immediately by a `GET`, the `GET` may reach a replica before the replication event does. Routing the user's reads to the primary for a few seconds after a `POST/PUT` (or checking the WAL log position/LSN) guarantees Read-after-write consistency."
      },
      {
        "id": "sre-47",
        "d": 5,
        "t": "Untested backups",
        "q": "During a Production Readiness Review, a team claims to have a solid DRP because a cronjob runs `pg_dump` every night and uploads a `.sql.gz` file to an S3 bucket, but they have never run a test restore in the last 18 months. When inspecting the bucket you discover that the files from the last 4 months weigh 20 bytes because the backup user's password expired and the script compressed the empty output without `set -euo pipefail`. What fundamental SRE lesson does this illustrate?",
        "o": [
          "First `SELECT pg_cancel_backend(pid);` (sends `SIGINT`, canceling the query without cutting the socket); if it does not yield, `SELECT pg_terminate_backend(pid);` (sends `SIGTERM`, closing the connection and the process).",
          "First invoke `SELECT pg_terminate_backend(pid);` to abort the client session; if the query stays hung, force termination with `kill -9 <PID>` on the backend process in the operating system.",
          "First run `DISCARD ALL` pointing at the process identifier to invalidate locks; as a last resort invoke `VACUUM FULL` on the blocked tables to force the release of resources.",
          "First invoke `pg_reload_conf()` with a reduced `statement_timeout` to force expiration; if the hold persists, perform a soft restart of the service with `systemctl reload postgresql`."
        ],
        "a": 0,
        "e": "In SRE it is a law that real recovery capability is not your backup policy, but your tested restore process. Without `set -euo pipefail` in bash scripts, without success/size metrics, and without periodic restore drills that verify the data and measure the real RTO, backups tend to fail silently just when they are needed most."
      },
      {
        "id": "sre-48",
        "d": 5,
        "t": "IOPS Saturation and Burst Balance on Cloud Disks",
        "q": "A cloud database worked perfectly during a 20-minute load test, but after 3 hours of sustained production traffic the disk read/write latency jumps from 2 ms to 85 ms and performance plummets even though traffic has not increased in the last hour. The storage volume uses burst credits (Burst Balance). What happened?",
        "o": [
          "gp2 volumes use burst credits: they accumulate a balance at rest but under continuous load they deplete the bucket and fall to baseline performance (3 IOPS/GiB); it is solved by migrating to gp3 (guaranteed fixed IOPS) or io2.",
          "The Linux I/O scheduler exhausted the memory allocated to dirty pages in the kernel page cache, forcing blocking synchronous writes to disk; it is prevented by setting the `vm.dirty_ratio` parameter to 5 %.",
          "The database file system ran out of free inodes due to the massive generation of unindexed temporary tables; it is solved by running an online resize of the AWS EBS gp2 disk.",
          "PostgreSQL's `shared_buffers` memory saturated due to continuous concurrency, causing cache misses that tripled physical disk reads; it is solved by increasing the instance's RAM to 64 GiB."
        ],
        "a": 0,
        "e": "Many cloud volumes (such as gp2 on AWS or certain standard tiers on Azure/GCP) accumulate IOPS credits when idle and spend them in spikes. A short 20-minute test passes with a high score thanks to the accumulated credits, but continuous production traffic empties the credit bucket and collapses performance. You must monitor the Burst Balance metric or use volumes with constant provisioned IOPS (e.g., gp3/io2/Premium SSD)."
      },
      {
        "id": "sre-49",
        "d": 5,
        "t": "N+1 Queries and Missing Indexes After a Deployment",
        "q": "After deploying a new `/api/v2/historial-compras` endpoint, the database CPU usage rises from 20 % to 99 % even though the endpoint receives only 30 requests per second. In `pg_stat_statements` you observe that the query `SELECT * FROM items_pedido WHERE pedido_id = $1` runs 6,000 times per second doing a `Seq Scan` (full sequential scan). Which two combined problems are taking down the database? (Choose 2 answers)",
        "o": [
          "The code introduces an N+1 query antipattern in the ORM: for each of the 30 requests it iterates, executing 200 individual SQL queries instead of grouping with `IN` or `JOIN`.",
          "Absence of a B-Tree index on the foreign key `items_pedido(pedido_id)`, which forces the optimizer to perform a full sequential scan (`Seq Scan`) on each of the 6,000 QPS.",
          "The query optimizer statistics are out of date in `pg_statistic`, causing the engine to choose a sequential scan instead of using the existing index.",
          "The application's connection pool lacks a `statement_timeout`, accumulating transactions waiting on row locks in the `items_pedido` table that saturate the CPU through contention."
        ],
        "a": [
          0,
          1
        ],
        "e": "Unlike primary keys, many relational engines (including PostgreSQL) do NOT automatically create an index on a foreign key (`FOREIGN KEY`) column. If, on top of the missing index on `pedido_id` (which causes a `Seq Scan`), you add an N+1 loop in the ORM/code that multiplies the queries per request by 200, 30 RPS is enough to completely saturate all the database CPUs."
      },
      {
        "id": "sre-50",
        "d": 5,
        "t": "Key Eviction in Redis (maxmemory-policy)",
        "q": "You use the same Redis cluster for two mixed purposes: storing user authentication sessions and caching temporary catalog responses. Redis memory reaches 100 % of `maxmemory` and you have the `maxmemory-policy noeviction` policy configured (or alternatively `allkeys-lru`). With `noeviction`, new logins fail with the error `OOM command not allowed when used memory > maxmemory`; if you switch to `allkeys-lru`, active user sessions are closed at random. What is the correct solution?",
        "o": [
          "Segregate the workloads: one instance for authentication sessions without destructive eviction and another for cache with `allkeys-lru`, or apply `volatile-lru` while guaranteeing an explicit TTL on catalog keys.",
          "Set the `maxmemory-policy allkeys-random` directive to spread evictions statistically, assuming the high proportion of catalog keys will absorb the vast majority of evictions.",
          "Enable disk persistence with `appendfsync everysec` (AOF) on the same instance so that sessions evicted by `allkeys-lru` are transparently reloaded from disk on each request.",
          "Migrate the instance to a 3-master Redis Cluster topology to distribute the key space by hash slots, keeping the mix of sessions and cache data under the `noeviction` policy."
        ],
        "a": 0,
        "e": "Mixing critical state data (sessions or job queues such as Sidekiq/BullMQ) with general-purpose cache on the same Redis instance is a classic antipattern: the cache fills the memory and either blocks session writes (`noeviction`) or evicts critical data (`allkeys-lru`). They must be isolated in separate instances with eviction policies appropriate to each role."
      },
      {
        "id": "sre-51",
        "d": 6,
        "t": "ArgoCD Self-Heal during an Incident",
        "q": "During a P1 incident at 04:00 AM, you discover that a misconfigured environment variable in the `pagos-api` Deployment is causing the failure. To mitigate quickly, you run `kubectl set env deployment/pagos-api FEATURE_X=false`. The new pods start fine and the error disappears, but exactly 45 seconds later the pods are recreated on their own with `FEATURE_X=true` and the incident returns. The cluster is managed with ArgoCD. What happened and how should you act?",
        "o": [
          "ArgoCD has `selfHeal: true` and reverts the divergence from Git; you must apply the mitigation through a GitOps commit or temporarily pause `auto-sync` on the Application while you stabilize the service.",
          "An admission policy controller (Kyverno/Gatekeeper) detected unauthorized mutation of the manifest and forced a rollback of the Deployment; it is solved by adding an exemption annotation in the metadata.",
          "The deployment was blocked by a race condition with the Kubernetes Deployment Controller; it is mitigated by running `kubectl rollout pause deployment/pagos-api` to freeze ArgoCD synchronization.",
          "The application lacks RBAC permissions to update environment variables at runtime; it is solved by modifying the `SyncPolicy` directive in ArgoCD to disable strict schema validation."
        ],
        "a": 0,
        "e": "In a GitOps environment with ArgoCD and `selfHeal: true`, Git is the sole source of desired truth: any manual change applied directly with `kubectl` against the API Server is considered drift and is overwritten in the next reconciliation cycle. For a mitigation to be durable, it must be applied in Git (or auto-sync must be disabled during the emergency and Git synced before re-enabling it)."
      },
      {
        "id": "sre-52",
        "d": 6,
        "t": "TLS Certificates and Incomplete Intermediate Chain",
        "q": "You manually renewed the TLS certificate on a load balancer for `api.tuempresa.com`. When testing from your laptop with Chrome and Safari, the green padlock appears with no errors. However, as soon as it goes to production, webhooks from external partners, Python scripts (`requests`), Go/Java microservices, and Android devices fail en masse with `SSLHandshakeException` / `SSL: CERTIFICATE_VERIFY_FAILED (unable to get local issuer certificate)`. What is the exact cause?",
        "o": [
          "You installed only the leaf certificate without the intermediate chain (`fullchain.pem`); browsers download the missing issuer through AIA fetching, but libraries such as OpenSSL, Python, and the JVM require the full chain.",
          "The load balancer forcibly negotiated TLS 1.3 with modern elliptic-curve algorithms, causing incompatibility with legacy HTTP libraries in Java and Python that require traditional RSA cipher suites.",
          "The certificate was issued with only a Common Name (CN), omitting the `Subject Alternative Name` (SAN) extension, which is mandatory for strict validation in modern Go, Python, and Android runtimes.",
          "The issuing Certificate Authority used an obsolete SHA-1 signature algorithm, causing backend trust stores to reject the handshake while desktop browsers tolerate the connection."
        ],
        "a": 0,
        "e": "This is the number one incident after renewing TLS certificates: strict clients (cURL, OpenSSL, JVM, Go, Python, Android) only have the root CAs in their local store and need the server to present the domain certificate followed by the intermediate certificates (`fullchain`). You can always verify it with `openssl s_client -connect api.tuempresa.com:443 -servername api.tuempresa.com`."
      },
      {
        "id": "sre-53",
        "d": 6,
        "t": "DNS TTL and Persistent Connections During Failover",
        "q": "You run a DR failover by changing your API's `A` / `CNAME` DNS record to point from the Primary Region to the Secondary Region. The record had a previous TTL of `3600` seconds (1 hour), although you lowered it to `60` seconds right at the time of the change. In addition, several internal microservices are still sending traffic to the primary load balancer's private IPs even 2 hours later. Which two factors explain this behavior? (Choose 2 answers)",
        "o": [
          "Recursive DNS servers retain the previously cached 3600s TTL; the TTL must be reduced to 60s at least 24 to 48 hours in advance for the IP change to take immediate effect on all clients.",
          "Clients with persistent TCP connections (HTTP Keep-Alive or gRPC) do not query DNS while the socket remains open; they keep dispatching traffic to the old IP unless connection recycling is forced.",
          "BGP Anycast routing tables between cloud regions take a minimum of 120 minutes to propagate modified prefixes, invalidating updates on the authoritative DNS servers during that period.",
          "The standard DNS specification prohibits TTLs below 300 seconds, forcing corporate recursive resolvers to automatically raise the cache to 7200 seconds to protect themselves from denial attacks."
        ],
        "a": [
          0,
          1
        ],
        "e": "Changing the TTL at the moment of the disaster does not invalidate caches that already stored the record with the previous 1-hour TTL. And more importantly: DNS is only queried when establishing a new connection; if clients keep persistent TCP sockets open (HTTP keep-alive or gRPC/HTTP2) against a load balancer that still responds at the network level, they will never resolve the name again unless the server closes the connections or a `MaxConnectionAge` exists."
      },
      {
        "id": "sre-54",
        "d": 6,
        "t": "Terraform State Drift During an Emergency",
        "q": "Two weeks ago, during an emergency, an engineer manually modified the rules of a Firewall / Security Group and the size of a node group in the AWS/GCP console without updating the Terraform code. Today you need to add a new rule with Terraform, and when you run `terraform plan` you see: `Plan: 1 to add, 3 to change, 2 to destroy` (including the destruction and recreation of critical resources created by hand). What is the safe procedure?",
        "o": [
          "Cold Start: scheduling a pod from scratch (scheduling, runtime startup, and probes) takes seconds; if the SLO demands low latency, `minReplicas` must be at least 1, or pre-warmed replicas should be used instead of scale-to-zero.",
          "Thundering Herd phenomenon: the sudden concentration of requests after an idle period saturates the connection pool; it is remedied by configuring a Circuit Breaker with fast opening and retries at the Ingress.",
          "Cluster Autoscaler latency: the delay occurs exclusively when provisioning new worker nodes at the cloud provider; it is resolved by fixing an instance pool with backup nodes that are already powered on.",
          "TCP connection starvation: the Ingress proxy freezes the TLS handshake for destinations with no active endpoints; it is mitigated by reducing the `keepalive_timeout` parameter to 1 second to force continuous reconnections."
        ],
        "a": 0,
        "e": "When there is state drift due to manual changes (ClickOps), a blind `terraform apply` will revert the earlier emergency changes or destroy production resources. First, you reconcile the HCL code and the state with the reality in production, and only when the `plan` is clean do you apply the new change."
      },
      {
        "id": "sre-55",
        "d": 6,
        "t": "SNAT Port Exhaustion",
        "q": "Your 50 Kubernetes nodes reach the internet through a single NAT Gateway with only 1 public IP address (which has ~64,000 ephemeral ports per destination). After a change in a microservice that calls an external bank's API at 2,000 RPS, outbound connections from the entire cluster start failing with connection timeouts (`SYN` packets sent without response / packets dropped at the NAT Gateway). Reviewing the code, you see that the developer instantiates a new HTTP client on every request without reusing connections (`Connection: close`). What is the cause and the solution?",
        "o": [
          "Lack of N-1 reserve: the regions were operating without headroom to absorb traffic from another region; the failover overflowed `us-east-1`. It is prevented by provisioning sufficient headroom in each region and applying Load Shedding in the surviving one.",
          "Route 53 session affinity failure: sticky cookies saturated the regional load balancer in Virginia; it is prevented by migrating to a weighted round-robin algorithm that ignores the geographic origin of clients.",
          "DNS health check propagation latency: the checks kept declaring the failed region healthy for 15 minutes; it is avoided by reducing the probe interval to 1 second using Route 53 fast checks.",
          "Schema divergence in distributed databases: asynchronous replication between regions blocked transactions in Virginia; it is avoided by forcing bidirectional synchronous multi-region replication on all tables."
        ],
        "a": 0,
        "e": "At 2,000 new connections per second to the same destination IP/port, in just 32 seconds you consume the 64,512 ephemeral ports of a public IP on the NAT Gateway because closed connections remain in a waiting state before their tuple can be recycled. Reusing sockets through a singleton HTTP client with a Keep-Alive pool reduces port usage from 64,000 to a few dozen."
      },
      {
        "id": "sre-56",
        "d": 6,
        "t": "Credential Leak and Zero-Downtime Rotation",
        "q": "The security scanner detects that a production service key (`API_SECRET_KEY`) was accidentally pushed in a commit to a public repository 10 minutes ago. However, if you simply revoke the current key at the external provider right now without first updating your microservices, you will take the production integration out of service. What is the standard pattern for rotating credentials with zero downtime, and how do you act in the face of an active public exposure?",
        "o": [
          "Dual-Key pattern: immediately issue a second credential, inject it into production with an orderly pod rotation, verify traffic with the new key, and revoke the leaked credential (or revoke right away if there is abuse).",
          "Restrict the compromised credential in the provider console using an allowlist of the cluster's NAT IPs to nullify external access, postponing key rotation to the monthly maintenance window.",
          "Instantly revoke the credential at the payment gateway, accepting the temporary loss of payment processing as the lesser evil, and then start the manual rollout of the new secret to all microservices.",
          "Immediately change the GitHub repository to private visibility and purge the commit with `git filter-repo`, keeping the credential active in production since public access to the code has been removed."
        ],
        "a": 0,
        "e": "Rewriting Git history (`push --force`) never invalidates an exposed secret: bots scrape GitHub's public events within seconds. Rotation must be immediate, and designing systems with support for two simultaneously active keys (or automated rotation with Vault / Secrets Manager) allows you to replace the secret and invalidate the compromised one in minutes without taking down the service."
      },
      {
        "id": "sre-57",
        "d": 6,
        "t": "Terraform State Lock",
        "q": "The Terraform CI/CD pipeline failed midway through a `terraform plan` because the GitHub Actions runner abruptly lost power. Now any new attempt to run Terraform fails with `Error acquiring the state lock`, showing the ID of the orphaned lock in DynamoDB / GCS. What should you check before releasing the lock?",
        "o": [
          "Confirm that no Terraform process is active on runners or terminals against that backend; once you are sure the lock is orphaned, release it with `terraform force-unlock <LOCK_ID>`.",
          "Delete the lock record directly from the DynamoDB table with `aws dynamodb delete-item` to free the pipeline without waiting for manual confirmations from engineers about active tasks.",
          "Run `terraform refresh` specifying the orphaned lock ID to force Terraform to sync the remote state and clear the concurrency locks in an unattended way.",
          "Export the environment variable `TF_CLI_ARGS=\"-lock=false\"` in the CI/CD pipeline to run the contingency plan while ignoring the distributed concurrency locks in DynamoDB."
        ],
        "a": 0,
        "e": "The state lock prevents two concurrent Terraform runs from writing to `terraform.tfstate` at the same time and corrupting it. If a runner died abruptly and left the lock dangling, you first verify that no job is still running in the background and then use `terraform force-unlock <ID>`. You should never disable locking with `-lock=false` as a routine practice."
      },
      {
        "id": "sre-58",
        "d": 6,
        "t": "MTU and Fragmentation in VPN Tunnels / Overlay CNI",
        "q": "You connected your Kubernetes cluster (which uses a VXLAN/Geneve overlay network) to an on-premises data center through an IPSec VPN. Small requests (`ping`, a 100-byte `GET /health`) work in 5 ms without losing a single packet, but any request that returns a large JSON (> 1,400 bytes) or a TLS handshake with large certificates hangs indefinitely until it times out. What is the classic network diagnosis?",
        "o": [
          "PMTUD black hole: VXLAN and IPSec encapsulation reduce the MTU below 1,500 bytes and a firewall blocks ICMP `Fragmentation Needed` messages; it is mitigated by reducing the CNI MTU and enabling `TCP MSS Clamping`.",
          "Asymmetric routing: outbound traffic travels through the IPSec tunnel but large responses are returned through the public Internet Gateway, where firewalls drop the packets due to missing TCP state.",
          "TCP Window Scale exhaustion: the VPN router lacks buffer space for bursts larger than 64 KB, silently dropping segments that exceed the initial congestion window.",
          "UDP packet fragmentation in DNS: responses with large certificates require EDNS0 DNS resolution that exceeds 512 bytes, and are blocked by the on-premises network security team."
        ],
        "a": 0,
        "e": "When ping and tiny responses pass perfectly but large transfers or TLS handshakes hang silently, it is the unmistakable symptom of an MTU / TCP MSS problem: large packets with the `DF` (Don't Fragment) bit exceed the encapsulated tunnel's MTU and are dropped without the source finding out. Applying TCP MSS Clamping and adjusting the CNI MTU solves the problem instantly."
      },
      {
        "id": "sre-59",
        "d": 6,
        "t": "CDN Cache Attack or Traffic Spike (Cache Bypass)",
        "q": "Your website handles 50,000 RPS because Cloudflare / CloudFront serves 96% from cache and your origin only receives 2,000 RPS. Suddenly, the origin collapses, receiving 45,000 RPS because a marketing campaign sent links with a per-user unique parameter (`?utm_click_id=9f8a7b...`) and the CDN treats each URL with a different query string as a different cache key (`Cache Status: MISS`). What is the immediate mitigation at the Edge?",
        "o": [
          "Normalize the Cache Key in the CDN to ignore tracking parameters (`utm_*`) or strip query strings at the Edge, restoring the hit rate in seconds without altering the backend or losing analytics data.",
          "Emit `Cache-Control: public, s-maxage=3600` in the origin header on all responses to force the CDN to store the content in cache regardless of the query strings sent.",
          "Configure a Rate Limiting rule at the Edge that blocks or presents a Captcha challenge to any IP address making more than 10 requests per second with `utm_*` parameters to protect the origin.",
          "Implement a rewrite rule on the origin NGINX to remove the query arguments and return an HTTP 301 redirect to the user toward the clean URL so that the CDN caches it."
        ],
        "a": 0,
        "e": "When tracking parameters or random timestamps in the query string are part of the CDN's Cache Key, every visitor causes a `Cache MISS` (accidental Cache Busting) and hits the origin directly. Ignoring those query params in the CDN's Cache Key mitigates the incident in seconds from the edge."
      },
      {
        "id": "sre-60",
        "d": 6,
        "t": "IP Exhaustion in a Kubernetes Subnet",
        "q": "During a disaster recovery test, your Kubernetes cluster (which uses a VPC-native IP CNI such as AWS VPC CNI or Azure CNI) tries to scale 200 new pods. The nodes have plenty of CPU and RAM, but the pods get stuck in `ContainerCreating` with the error: `Failed to create pod sandbox: plugin type=\"aws-cni\" failed (add): add cmd: failed to assign an IP address to container`. Which resource was exhausted?",
        "o": [
          "Exhaustion of available IPv4 addresses in the VPC subnet (CIDR block) where the nodes operate, or the limit of ENIs/secondary IPs per EC2 instance type for the CNI plugin.",
          "Inode exhaustion in the containerd directory (`/var/lib/containerd/io.containerd.runtime.v2.task`), preventing the CNI plugin from generating the network namespace state file for the new pod.",
          "Exhaustion of ephemeral SNAT ports on the VPC NAT Gateway, causing timeouts in the CNI plugin's calls when it tries to validate connectivity with the cloud metadata APIs.",
          "The maximum Security Groups quota per elastic network interface (ENI) in the AWS account was reached, preventing the `aws-node` daemonset from attaching additional network interfaces to the worker node."
        ],
        "a": 0,
        "e": "With CNI plugins that assign IPs directly from the VPC subnet range (AWS VPC CNI, Azure CNI, GKE VPC-native), a `/24` subnet (251 usable IPs) quickly runs out of addresses when scaling nodes and pods. The error occurs in the `ContainerCreating` phase (after the scheduler has already chosen the node) when the CNI plugin requests a secondary IP from the VPC and the subnet is full."
      }
    ],
    "why": {
      "sre-01": [
        null,
        "Accepting a 25-minute window with 18% failures critically degrades availability and burns the error budget when an already validated stable version exists.",
        "Queueing payments asynchronously without immediate bank confirmation breaks the API semantics and generates a massive accumulation of pending transactions.",
        "The increase in errors correlates exactly with the 03:08 AM deployment; restarting replicas with the same defective code will not resolve the underlying problem."
      ],
      "sre-02": [
        null,
        "The median (p50) only reflects the center of the distribution and completely ignores users in the tail of degraded requests.",
        "Even if grouped by customer segment, computing the arithmetic mean still masks the outliers and timeouts suffered by slow users.",
        "A counter of successful status codes does not measure response duration and overlooks requests that take tens of seconds to respond."
      ],
      "sre-03": [
        null,
        "An isolated 1-minute window at 0.1% is prone to false positives from bursts or momentary restarts, causing severe alert fatigue.",
        "Alerting only once the budget has been completely consumed prevents taking preventive measures to protect the compromised SLO.",
        "A single prolonged window without confirmation on a short window keeps the alert active for hours after the incident is resolved, increasing reset time."
      ],
      "sre-04": [
        null,
        "The Incident Commander must not abandon coordination of the group or isolate themselves in individual analytical tasks, losing the global view of the event.",
        "The IC must coordinate and delegate, not become a lone operator executing technical commands, nor needlessly paralyze the operations team.",
        "Allowing concurrent actions without control invalidates any cause-effect correlation and can cause catastrophic cross-failures in the system."
      ],
      "sre-05": [
        null,
        "Adding manual approvals does not eliminate underlying design flaws (such as shared credentials) and needlessly slows down routine operational tasks.",
        "Sanctioning or sidelining the operator fosters a culture of fear and does not prevent another colleague from making exactly the same technical mistake in the future.",
        "Individually exposing professionals destroys psychological safety and contradicts the fundamental principle of a blameless retrospective analysis."
      ],
      "sre-06": [
        null,
        "In RAID arrays or modern SSD disks, the `%util` metric can approach 100% under normal parallel loads or appear low while the request queue (`await`) is saturated.",
        "Although the network is a resource in the USE method, the scenario's explicit symptom is the degradation of queries at the local storage level.",
        "If free memory is at 60%, the reported bottleneck lies in disk performance and not in virtual memory contention or paging."
      ],
      "sre-07": [
        null,
        "Reactively modifying the SLO to mask a breach destroys the usefulness of the Error Budget as a mechanism for balancing velocity and reliability.",
        "Introducing complex new code when the budget is already exhausted adds risk to an unstable system whose availability is already compromised.",
        "Operational exceptions do not replace Error Budget discipline; silencing alerts worsens the impact of new failures instead of remediating them."
      ],
      "sre-08": [
        null,
        null,
        "Slightly increasing the percentage on the same cause metric does not solve the conceptual problem; it still triggers on-call pages for consumption with no real customer impact.",
        "Automatically restarting pods under high load causes unnecessary interruption of active connections and can trigger cascading restart storms."
      ],
      "sre-09": [
        null,
        "Interrupting the agreed periodic cadence creates institutional uncertainty and causes stakeholders to interrupt the technical team demanding updates.",
        "Issuing unverified conjectures compromises the team's technical and legal credibility if the source of the degradation turns out to belong to its own infrastructure.",
        "Halting external communication to wait for executive meetings isolates support and customers from the operational instructions needed during the contingency."
      ],
      "sre-10": [
        null,
        "Rotating purely manual work does not reduce the department's operational overload; the SRE principle seeks to eradicate toil through permanent engineering solutions.",
        "Postponing tactical automation while waiting for a future rewrite perpetuates the continued waste of 3 hours a day of the team's time on mechanical tasks.",
        "Governance and audit requirements are better satisfied by automated tools with access control and a cryptographic history than by manual SQL interventions."
      ],
      "sre-11": [
        null,
        "Kubernetes does not kill a pod for exceeding `requests.memory`; the cgroup limits enforced by the kernel correspond strictly to `limits.memory`.",
        "Changing the GC algorithm does not reduce native consumption outside the Heap (Metaspace, buffers, stacks) that causes the cgroup violation.",
        "Exit Code 137 (`SIGKILL`) due to OOM indicates cgroup memory exhaustion, not file descriptor (`nofile`) saturation."
      ],
      "sre-12": [
        null,
        "The observed metric measures kernel quota pauses imposed by CFS (`cpu.cfs_quota_us`), not Go garbage collector pause times.",
        "Throttling occurs because the container itself exhausts its allowed quota in multi-threaded bursts, not because of interference from other pods on shared cores.",
        "Changing the CFS period at the node level does not resolve the mismatch if the container keeps consuming more CPU time in bursts than the assigned quota."
      ],
      "sre-13": [
        null,
        "Increasing retries in `livenessProbe` mitigates brief outages but does not fix the architectural error; any prolonged DB failure will restart all pods in a cascade.",
        "Masking external errors with HTTP 200 on `/healthz` defeats the usefulness of the probe instead of properly separating liveness from operational availability.",
        "Switching to `tcpSocket` only checks whether the port responds, but does not resolve the root cause of having coupled dependencies into the pod restart decision."
      ],
      "sre-14": [
        null,
        "Disabling keepalive increases SSL/TCP connection overhead and does not prevent in-flight requests from reaching a pod that has already closed its local process.",
        "Setting `maxUnavailable: 0` does not resolve the race condition between the propagation of the Endpoint event to iptables/NGINX and the `SIGTERM` sent to the pod.",
        "The NGINX Ingress controller updates its backends through the Kubernetes Endpoints API, not through DNS queries for hostnames."
      ],
      "sre-15": [
        null,
        "Scaling centralized CoreDNS pods does not eliminate the root problem: each external query still generates 5 or more useless UDP queries that saturate conntrack on the nodes.",
        "Forcing TCP (`use-vc`) mitigates UDP packet loss but worsens latency and connection overhead against CoreDNS if the lookup still tries all internal domains.",
        "Increasing the TTL in CoreDNS does not help if failed lookups against nonexistent subdomains (`api.mercadopago.com.default.svc.cluster.local`) return uncached NXDOMAIN."
      ],
      "sre-16": [
        null,
        "The `--force` flag in `kubectl drain` ignores pods without a controller (such as orphan pods), but the eviction API still strictly respects the `PodDisruptionBudget`.",
        "Restarting kubelet does not bypass the Eviction API restrictions imposed at the control plane level by the configured PDB.",
        "The reported block comes from the PDB object check in the app's namespace, not from node taints or admission controllers."
      ],
      "sre-17": [
        null,
        "The `volume node affinity conflict` event is not an affinity declared on the pod, but a constraint imposed by the PersistentVolume being pinned to the `us-east-1a` zone.",
        "The message reflects a storage geographic placement conflict and CPU saturation, not an EC2 API unavailability or a CSI driver failure.",
        "The scheduler evaluates physical zone availability and unallocated `requests.cpu` on the nodes; it does not measure accumulated disk IOPS limits when scheduling pods."
      ],
      "sre-18": [
        null,
        null,
        "Removing `readinessProbe` causes user traffic to be sent to pods that have not yet finished warming up their caches, triggering HTTP 5xx errors.",
        "Ignoring CPU and basing the HPA on memory alone does not prevent pods from being killed by liveness, nor does it resolve processing saturation under real traffic."
      ],
      "sre-19": [
        null,
        "In Kubernetes, declaring `egress: []` means denying all outbound traffic (an empty list of allowed rules), not allowing everything (which is expressed as `egress: [{}]`).",
        "Kubernetes does not add implicit exceptions for `kube-dns`; if Egress isolation is enabled, you must explicitly allow port 53 UDP/TCP to DNS.",
        "Egress policies apply to all traffic leaving the pod, regardless of whether the destination is another local pod or an external database outside the cluster."
      ],
      "sre-20": [
        null,
        "The kubelet never updates environment variables of an already running container; they remain unchanged in the process memory from startup.",
        "If the Secret was successfully updated for volumes, it is not immutable; the cause is Linux's inherent inability to mutate environment variables in live processes.",
        "Linux does not update a process's environment block upon a `SIGHUP` signal; the only standard way in Kubernetes is to restart the Deployment's pods."
      ],
      "sre-21": [
        null,
        "In modern Kafka clients the heartbeat runs in a separate thread; pauses due to slow processing trigger `max.poll.interval.ms`, not `session.timeout.ms`.",
        "Calling `commitSync()` after every message blocks the consumer thread, raising total latency, and does not prevent exceeding `max.poll.interval.ms` if the `poll()` batch is still large.",
        "The cooperative assignor smooths incremental assignment but does not prevent the coordinator from declaring the consumer dead if it exceeds `max.poll.interval.ms`."
      ],
      "sre-22": [
        null,
        "Setting `min.insync.replicas = 1` risks irreversible data loss if the only surviving broker fails before replicating to the recovered nodes.",
        "Enabling `unclean.leader.election` introduces message loss and offset corruption by allowing out-of-sync replicas to become leaders.",
        "If `min.insync.replicas` stays at 3 and the ISR drops to 2, the broker will reject the producer's request with `NotEnoughReplicasException` regardless of the `acks` setting."
      ],
      "sre-23": [
        null,
        "Manually moving offsets with `--shift-by` is risky in production, skips offsets blindly, and destroys the traceability of the faulty payload for later debugging.",
        "Discarding events to logs only, without a DLQ, causes the corrupt message to be lost for reprocessing and floods the log files with no audit guarantees.",
        "If the connector's serializer fails to parse the JSON before sending it over HTTP to Elasticsearch, changing the Elasticsearch mapping does not prevent the local exception in Connect."
      ],
      "sre-24": [
        null,
        "In Kafka a partition can only be consumed simultaneously by 1 pod in the same group; adding more pods will leave the new replicas `idle`.",
        "The symptom comes from a disproportionate volume of data produced to that specific partition, not from an assignment failure by the Group Coordinator.",
        "The compression type does not alter the distribution of messages across partitions nor explain why partition 7 concentrates 800,000 messages versus 0 in the others."
      ],
      "sre-25": [
        null,
        "Reactively scaling replicas during a retry storm shifts the collapse to the underlying databases and does not stop the looping retry synchronization cycle.",
        "Immediate linear retries without backoff or jitter concentrate massive waves of concurrent requests (thundering herd) that prevent the backend from recovering.",
        "Keeping retries without a Circuit Breaker or Retry Budget continues to saturate the server's CPU with superfluous TCP connections and HTTP requests."
      ],
      "sre-26": [
        null,
        "A temporary lock expires if processing takes longer than 10s; the subsequent retry would find the lock free and execute a second, duplicate charge.",
        "Doing check-then-act from the client without idempotency guarantees on the server creates a race condition if the confirmation of the first request arrives after the check.",
        "Checking with a `SELECT` before processing is not atomic with the call to the external bank processor, suffering the same race condition under concurrent requests."
      ],
      "sre-27": [
        null,
        "Raising the gateway timeout to 35 s pushes the slowness onto the end user, saturates the edge proxy connections, and worsens overall degradation when dependencies are slow.",
        "The Bulkhead isolates threads but does not prevent requests already cancelled by the gateway from continuing to consume CPU and sockets for an additional 27 seconds in service B.",
        "Turning a critical synchronous flow into asynchronous polling with queues adds enormous operational complexity and does not solve the lack of time-limit propagation in REST APIs."
      ],
      "sre-28": [
        null,
        "Raising timeouts to 5s in non-critical components saturates the main app's thread pools and propagates the slowness to product purchases.",
        "Keeping the blocking in the backend causes 500 errors on the home page, preventing product sales regardless of what the client attempts over WebSocket.",
        "Queueing without limit in memory under GPU saturation causes excessive RAM consumption and eventual OOM in the backend without offering graceful degradation to the buyer."
      ],
      "sre-29": [
        null,
        "If publishing to Kafka succeeds but the `COMMIT` in PostgreSQL fails due to a key conflict or network outage, an event for an order that does not exist in the DB will be published.",
        "Kafka does not natively implement the XA/2PC protocol with PostgreSQL; forcing distributed transactions introduces extreme fragility and prolonged locks.",
        "Keeping a SQL transaction open while retrying over the network to Kafka locks rows and connections in the database, worsening the outage if Kafka does not respond."
      ],
      "sre-30": [
        null,
        "Increasing the Heap only postpones the problem by a few minutes in the face of a sustained disk bottleneck and worsens GC pause times when the giant heap collapses.",
        "If the disk subsystem is already degraded or saturated, dumping more data to `/tmp` immediately worsens I/O slowness and exhausts the node's disk.",
        "Using weak references discards data arbitrarily with no traceability or control, violating the integrity of business event ingestion."
      ],
      "sre-31": [
        null,
        "Shortening disk retention does not relieve memory of the hot block (`head block`); active series remain loaded in memory, causing the `OOMKilled`.",
        "Recording rules evaluate already indexed series; if scraping keeps ingesting 4.8 million unique series, Prometheus will collapse anyway due to RAM.",
        "Sending 4.8 million series via `remote_write` shifts the memory and network collapse to Thanos Receive without fixing the cardinality explosion at its root."
      ],
      "sre-32": [
        null,
        "`irate()` also requires at least 2 samples within the window to compute the instantaneous rate; with a 30s window and 30s scraping it still suffers gaps due to lack of data.",
        "The `step` parameter in Grafana defines the distance between chart points; it does not add samples within the `[30s]` range of the `rate()` function on the Prometheus server.",
        "The `offset` modifier shifts the window into the past; it does not resolve the lack of sufficient samples within a range identical to the collection interval."
      ],
      "sre-33": [
        null,
        "Weighting local percentiles by volume is still mathematically wrong: percentiles cannot be averaged linearly because they are not additive.",
        "`max()` takes the highest value among individual instances but does not reflect the 99th percentile of the overall set of requests served by the cluster.",
        "Computing `quantile()` over local percentiles produces a severe statistical bias; only `histogram_quantile()` over cumulative buckets (`le`) is valid."
      ],
      "sre-34": [
        null,
        "The `scrape_timeout` governs the duration of the HTTP scrape request against `/metrics`, not the magnitude of the latency times recorded in the app's metrics.",
        "If `+Inf` were excluded, the formula would return NaN or count errors; the exact value of 10.0s arises from interpolation by falling into the upper finite bucket `le=\"10.0\"`.",
        "Instrumentation libraries do not truncate duration measurements; they simply increment the counters of the corresponding buckets according to the actual duration."
      ],
      "sre-35": [
        null,
        "`repeat_interval` only spaces out the resending of identical alerts that are already active; it does not group 45 distinct alerts fired simultaneously into a single notification.",
        "Muting by schedule (`mute_time_intervals`) hides legitimate incidents during deployments instead of intelligently grouping them when they occur.",
        "A generic inhibition rule without explicit hierarchy would silence unrelated critical alerts instead of neatly grouping the incident's alerts."
      ],
      "sre-36": [
        null,
        null,
        "Adding `trace_id` as an ordinary label on metrics triggers a critical cardinality explosion that will exhaust Prometheus RAM within minutes.",
        "Polling the trace backend via cron generates delays and decouples the real-time visual inspection natively offered by the Exemplars integration."
      ],
      "sre-37": [
        null,
        "Adding `or vector(0)` returns a value of 0 when the series is missing, so the `> 5` condition will remain false and the alert will still not fire in a total outage.",
        "`keep_firing_for` only keeps active an alert that was already firing; if the service suddenly goes down without prior errors, the rule will never fire.",
        "Evaluating rules more frequently does not generate data if scraping does not respond; the series will be marked absent faster but the vector will remain empty."
      ],
      "sre-38": [
        null,
        "`rate()` already handles resets internally and natively; it never produces negative numbers when a monotonic counter drops to zero.",
        "Prometheus does not discard the window or emit NaN; it computes the increase between the starting point and the new value assuming a reset from zero.",
        "The `resets()` function only counts how many resets occurred in the interval; it is neither necessary nor correct to incorporate it into the usual `rate()` computation."
      ],
      "sre-39": [
        null,
        "Sending giant payloads of successful requests to S3 still generates unnecessary CPU, bandwidth, and storage overhead for redundant data.",
        "Increasing quotas and reducing retention days raises the bill and harms the historical retention of important events without solving the design problem.",
        "Generating hashes over successful 200 KB responses consumes CPU resources on the collectors and saturates the index with cryptographic data that has no operational value."
      ],
      "sre-40": [
        null,
        "Head-based sampling makes the decision in the initial millisecond; with a 1% rate it will irreversibly discard 99% of the requests that later fail or take 2 seconds.",
        "Sampling locally with a fixed quota on each node does not evaluate the outcome of the overall request and generates fragmented traces if one service samples and the next does not.",
        "Ingesting 100% of spans into central storage before filtering shifts all the transfer and ingestion cost that is precisely meant to be avoided."
      ],
      "sre-41": [
        null,
        "Multiplying processes in PostgreSQL saturates the CPU through context switches and internal lock contention in shared memory, degrading performance even with spare RAM.",
        "A layer 4 load balancer does not multiplex transactions; it only redirects entire TCP sockets and still opens one physical connection in PostgreSQL for each client connection.",
        "Reducing the pool to 3 connections mitigates the temporary overrun but introduces local contention bottlenecks in each pod as traffic increases during the event peak."
      ],
      "sre-42": [
        null,
        "Extending the TTL to 24 hours leaves the catalog stale throughout the day and the massive stampede will repeat identically when the key expires after 24 hours.",
        "Launching 10,000 heavy 2.5s queries at once will still collapse the read replica due to CPU saturation and connection exhaustion.",
        "Browser caching does not protect against the Stampede generated by new visitors or concurrent users accessing at the instant the central key expires."
      ],
      "sre-43": [
        null,
        "In PostgreSQL, `READ UNCOMMITTED` behaves identically to `READ COMMITTED` and does not mitigate the lock acquisition queue that blocks concurrent queries.",
        "The read blocking is due to contention in PostgreSQL's lock queue, not to tuple overwriting or a lack of free space in disk pages.",
        "A structural `ALTER TABLE` always requires `ACCESS EXCLUSIVE LOCK`; it cannot be downgraded to `SHARE LOCK`, nor does it avoid the catalog lock wait queue."
      ],
      "sre-44": [
        null,
        "It confuses RTO (time to restore service) with RPO (maximum tolerable data loss); a 45s lag in asynchronous replication means losing up to 45s of transactions.",
        "If Zone A physically collapses, WAL not transmitted to Zone B is lost forever, absolutely violating the RPO = 0 commitment.",
        "Waiting for the network acknowledgment on every commit describes synchronous replication; asynchronous replication commits locally without waiting for the replica."
      ],
      "sre-45": [
        null,
        "Raising timeouts or using SQL in a 2-node script does not solve the lack of quorum; in a network partition, the unintended double promotion will still occur.",
        "Active-active multi-master replication during network partitions generates primary key collisions and severe corruption of relational data with no deterministic resolution.",
        "Switching DNS does not stop the concurrent writes that internal load balancers keep sending to the original node if it has not been fenced (fencing/STONITH)."
      ],
      "sre-46": [
        null,
        "An analytical `SELECT` query acquires a shared `ACCESS SHARE` lock, which does not block `autovacuum`; what blocks cleanup is the MVCC horizon held back by the snapshot.",
        "A reduced `maintenance_work_mem` only increases the number of passes over the index; it does not suspend or invalidate the dead tuple sweep.",
        "The described bloat is due to the transaction horizon (`xmin`) being held by the open query on the primary, not to WAL replication slot saturation."
      ],
      "sre-47": [
        null,
        "Sending `kill -9` (`SIGKILL`) to a PostgreSQL backend process corrupts shared memory (`shared memory`), forcing all backends to restart and begin crash recovery.",
        "`DISCARD ALL` only takes effect within the local session itself, and `VACUUM FULL` will try to obtain `ACCESS EXCLUSIVE LOCK`, severely worsening database locking.",
        "`pg_reload_conf()` and `systemctl reload` reload global file configurations without altering the timeout of queries that are already running."
      ],
      "sre-48": [
        null,
        "The abrupt drop and the `BurstBalance = 0%` metric in CloudWatch unequivocally confirm the exhaustion of EBS gp2 I/O credits, not a kernel virtual memory mismatch.",
        "Running out of inodes prevents creating new files on the file system, but it does not reduce disk transfer IOPS or empty the EBS credit bucket.",
        "The key symptom is hardware disk latency degradation directly tied to the exhaustion of the AWS burst balance, not a PostgreSQL buffer configuration."
      ],
      "sre-49": [
        null,
        null,
        "In PostgreSQL, foreign keys do not automatically create indexes; the cause is the physical absence of the index, not an erroneous cost estimate in the statistics.",
        "The symptom is a massive volume of concurrent reads without an index (6,000 QPS with Seq Scan), not a retention of transactional locks due to a missing timeout."
      ],
      "sre-50": [
        null,
        "Random eviction (`allkeys-random`) will inevitably evict users' active session keys, causing sudden and unpredictable logouts.",
        "Redis is a purely in-memory database; the AOF file is used for recovery after server crashes and does not reload evicted keys on demand.",
        "Increasing partitions in Redis Cluster raises total capacity but preserves the underlying antipattern: the cache will fill the RAM again and block session writes."
      ],
      "sre-51": [
        null,
        "Admission controllers reject requests at the moment they are sent to the API (`admission phase`); they do not wait 45 seconds to revert changes that were already persisted.",
        "`kubectl rollout pause` pauses the replica rollout in Kubernetes, but it does not prevent the ArgoCD reconciler from overwriting the Deployment manifest.",
        "The symptom is not a permissions error or a schema validation error, but the GitOps operator's continuous reconciliation (`selfHeal`) against the Git branch."
      ],
      "sre-52": [
        null,
        "The explicit error `unable to get local issuer certificate` points to a missing intermediate issuer in the TLS chain, not a protocol version or cipher suite incompatibility.",
        "If the SAN were missing, the reported error would be `hostname mismatch` or `SAN missing`, not a failure to resolve the chain issuer (`local issuer certificate`).",
        "Current public CAs do not issue SHA-1 certificates, and the symptom typically results from omitting `fullchain.pem` in the load balancer configuration."
      ],
      "sre-53": [
        null,
        null,
        "DNS failover changes name resolution on clients, not the propagation of BGP network routes between regions.",
        "There is no restriction that raises TTLs to 7200s; the retained traffic is due to the natural expiration of the previous 1-hour TTL and open TCP sockets."
      ],
      "sre-54": [
        null,
        "The symptom is not a collapse from massive concurrency (Thundering Herd), but the inherent startup time of a pod when scaling from zero replicas.",
        "Even with nodes already running, the pod's cold start (scheduling, process startup, and `readinessProbe`) takes several seconds to respond to the first call.",
        "The delay is not due to the Ingress TLS negotiation, but to the time the pod takes to initialize and register as a healthy endpoint in Kubernetes."
      ],
      "sre-55": [
        null,
        "The cause of the outage is not session affinity, but the massive overflow of requests onto a region that did not have idle capacity to absorb the global traffic.",
        "The health checks worked (they failed over within 3 minutes); the problem was that the destination region could not process 100% of the combined load and collapsed.",
        "Forcing synchronous replication between São Paulo and Virginia would add 120 ms of latency per transaction and does not protect against CPU saturation from request overload."
      ],
      "sre-56": [
        null,
        "Many third-party APIs do not support static IP filtering, and keeping active a key with administrative permissions that has been publicly leaked represents an intolerable corporate risk.",
        "Revoking before preparing the alternate key takes down the payment gateway in production; the safe procedure is to first create the secondary credential and then invalidate the exposed one.",
        "Making the repository private does not neutralize the risk: bots scan GitHub within milliseconds, and the key must be considered irreparably compromised from the moment of its publication."
      ],
      "sre-57": [
        null,
        "Blindly deleting the item directly from DynamoDB without verifying concurrent processes risks catastrophic corruption of the state file if another runner was still applying changes.",
        "`terraform refresh` does not release orphaned state locks; on the contrary, it will fail with the same lock acquisition error when trying to read the backend.",
        "Disabling locking with `-lock=false` allows multiple simultaneous CI/CD runs to overwrite the state, causing irreversible inconsistency in cloud resources."
      ],
      "sre-58": [
        null,
        "If there were asymmetric routing with stateful firewall drops, small responses (`GET /health`) would also not receive return packets and would fail just the same.",
        "The classic symptom where small packets pass and transfers > 1,400 bytes or TLS handshakes hang unequivocally points to MTU/PMTUD problems, not Window Scaling.",
        "DNS resolution had already completed before the HTTP request was sent; the blocking occurs in the TCP data transfer when exceeding the encapsulated link's MTU."
      ],
      "sre-59": [
        null,
        "If the CDN includes the full query string in the Cache Key, each URL with a unique parameter will still be considered a distinct object, generating Cache MISS regardless of `s-maxage`.",
        "Blocking legitimate clients coming from marketing campaigns through rate limiting or captchas destroys business conversion instead of optimizing cache delivery.",
        "Sending a 301 redirect forces 45,000 concurrent users to make a second HTTP request, keeping the initial saturation on the origin servers."
      ],
      "sre-60": [
        null,
        "The `failed to assign an IP address to container` error emitted by the CNI plugin refers strictly to IP address assignment in the VPC, not to space or inodes in containerd.",
        "The NAT Gateway translates traffic toward the internet; the assignment of local IPs to containers happens through local calls to the EC2 API to reserve IPs in the private subnet.",
        "If the Security Groups limit were reached, the error would describe a failure in `AttachNetworkInterface`, not a direct IP exhaustion failure when creating the pod sandbox."
      ]
    },
    "glossary": [
      {
        "term": "acks=all (Kafka)",
        "cat": "Kafka",
        "d": 3,
        "def": "Kafka producer setting that requires the leader to wait for acknowledgment from all in-sync replicas (ISR) before considering the write successful.",
        "tip": "Always combine it with min.insync.replicas=2 and replication.factor=3 for durability without losing availability when 1 broker goes down."
      },
      {
        "term": "Retry Amplification (Retry Storm)",
        "cat": "Distributed Systems",
        "d": 3,
        "def": "Failure cascade in which multiple clients immediately retry failed requests against a degraded service, multiplying its load and preventing it from recovering.",
        "tip": "Prevented with Exponential Backoff + Jitter, retry budgets (Retry Budget), and Circuit Breakers."
      },
      {
        "term": "Blameless Postmortem",
        "cat": "Incidents",
        "d": 1,
        "def": "Post-incident analysis focused on understanding systemic causes, observability gaps, and missing safety guardrails, without blaming or punishing the individual who performed the action."
      },
      {
        "term": "Burn Rate",
        "cat": "SLOs",
        "d": 1,
        "def": "The relative rate at which a service consumes its error budget (Error Budget). A burn rate of 1 consumes the exact budget over the SLO window; a burn rate of 14.4 consumes 2% of the monthly budget in 1 hour.",
        "tip": "Page the on-call only when the burn rate is high in both the long window (1h) and the short window (5m)."
      },
      {
        "term": "Cache Stampede (Thundering Herd)",
        "cat": "Data and Caching",
        "d": 5,
        "def": "Avalanche of simultaneous database queries when a heavily requested cache key expires and hundreds of threads try to recompute it at once.",
        "tip": "Mitigate with Request Coalescing (Singleflight / lock), stale-while-revalidate, or by adding jitter to the TTL."
      },
      {
        "term": "Canary Deployment",
        "cat": "Deployments",
        "d": 2,
        "def": "Deployment strategy that routes a small percentage of real traffic (e.g., 1-5%) to the new version and compares its SLIs (errors, latency) before promoting it to 100%."
      },
      {
        "term": "Cardinality (High Cardinality)",
        "cat": "Observability",
        "d": 4,
        "def": "Total number of unique combinations of label values on a metric. Labels with unbounded values (user_id, request_id, IP) blow up RAM and index consumption in Prometheus/Datadog.",
        "tip": "Never put user, session, or request IDs in metric labels; move them to logs or traces."
      },
      {
        "term": "CFS Quota Throttling",
        "cat": "Kubernetes",
        "d": 2,
        "def": "Forced pause imposed by the Linux Completely Fair Scheduler when a container's threads exhaust their CPU quota (limits.cpu) before the 100 ms window ends, driving up p99 tail latency."
      },
      {
        "term": "Circuit Breaker",
        "cat": "Distributed Systems",
        "d": 3,
        "def": "Client-side pattern that stops invoking a remote dependency when its failure rate exceeds a threshold, returning an immediate error or fallback during a cooldown period."
      },
      {
        "term": "conntrack (nf_conntrack)",
        "cat": "Networking and Linux",
        "d": 6,
        "def": "Linux kernel table that tracks the state of all active network connections for NAT and firewalling. If it fills up, the kernel silently drops new packets (nf_conntrack: table full, dropping packet)."
      },
      {
        "term": "Consumer Lag (Kafka)",
        "cat": "Kafka",
        "d": 3,
        "def": "Difference between the last offset produced in a partition (log-end-offset) and the last offset committed by the consumer group."
      },
      {
        "term": "CrashLoopBackOff",
        "cat": "Kubernetes",
        "d": 2,
        "def": "State in which a container repeatedly fails after starting and the kubelet applies an exponential wait (10s, 20s, 40s... up to 5 min) before restarting it again."
      },
      {
        "term": "Dead Letter Queue (DLQ)",
        "cat": "Kafka",
        "d": 3,
        "def": "Secondary queue or topic to which messages that cannot be processed after several attempts (poison pills) are diverted, allowing the consumer to keep moving forward."
      },
      {
        "term": "Error Budget",
        "cat": "SLOs",
        "d": 1,
        "def": "The margin of unavailability or failures allowed by the SLO (100% - SLO). While budget remains, delivery speed is prioritized; if it runs out, reliability and technical debt remediation are prioritized."
      },
      {
        "term": "Exemplar",
        "cat": "Observability",
        "d": 4,
        "def": "A reference to a specific trace (trace_id) attached to a metric sample (e.g., a latency histogram bucket), which lets you jump from a spike in Grafana directly to the slow trace."
      },
      {
        "term": "Exponential Backoff + Jitter",
        "cat": "Distributed Systems",
        "d": 3,
        "def": "Retry algorithm that multiplies the wait time after each failure and adds a random value (jitter) to prevent all clients from retrying in sync."
      },
      {
        "term": "Fullchain (TLS Chain)",
        "cat": "Security and Networking",
        "d": 6,
        "def": "Certificate file that concatenates the server certificate (leaf) followed by the intermediate authority certificates needed for strict clients (cURL, SDKs, JVM) to validate the signature up to the root CA."
      },
      {
        "term": "Golden Signals (4 Golden Signals)",
        "cat": "Observability",
        "d": 4,
        "def": "The four essential metrics defined by Google SRE for monitoring any system: Latency, Traffic, Errors, and Saturation."
      },
      {
        "term": "Graceful Shutdown",
        "cat": "Kubernetes",
        "d": 2,
        "def": "Orderly process upon receiving SIGTERM in which the application stops accepting new requests, finishes processing in-flight requests, and closes connections before terminating the process."
      },
      {
        "term": "Head-of-Line Blocking",
        "cat": "Networking and Systems",
        "d": 3,
        "def": "Phenomenon in which a slow message or request at the head of a queue or partition blocks the processing of all the items behind it."
      },
      {
        "term": "histogram_quantile (PromQL)",
        "cat": "Observability",
        "d": 4,
        "def": "PromQL function that estimates a quantile (e.g., 0.95 or 0.99) from the cumulative buckets (_bucket) of a Prometheus histogram."
      },
      {
        "term": "Hot Partition",
        "cat": "Kafka",
        "d": 3,
        "def": "Load imbalance in Kafka or partitioned databases when a very frequent partition key concentrates most of the traffic on a single partition and a single consumer."
      },
      {
        "term": "Idempotency",
        "cat": "Distributed Systems",
        "d": 3,
        "def": "Property of an operation whereby applying it once or several times produces exactly the same final state, essential when there are retries or at-least-once delivery."
      },
      {
        "term": "Incident Commander (IC)",
        "cat": "Incidents",
        "d": 1,
        "def": "Person with the highest coordination authority during an incident. Directs the mitigation strategy and assigns tasks without getting bogged down in direct technical execution."
      },
      {
        "term": "ISR (In-Sync Replicas)",
        "cat": "Kafka",
        "d": 3,
        "def": "Set of replicas of a Kafka partition that are fully caught up with the leader within the replica.lag.time.max.ms threshold."
      },
      {
        "term": "Liveness Probe",
        "cat": "Kubernetes",
        "d": 2,
        "def": "Kubelet probe that determines whether the container is stuck (deadlock) and must be killed and restarted. It must never depend on databases or external services."
      },
      {
        "term": "Load Shedding",
        "cat": "Distributed Systems",
        "d": 3,
        "def": "Defensive technique in which an overloaded service quickly rejects part of the incoming traffic to protect its ability to respond in time to the remaining requests."
      },
      {
        "term": "max.poll.interval.ms (Kafka)",
        "cat": "Kafka",
        "d": 3,
        "def": "Maximum time a Kafka consumer can take to process a batch before calling poll() again. If exceeded, the broker evicts it from the group and reassigns its partitions.",
        "tip": "Cause #1 of looping rebalances when the processing of each message makes slow calls."
      },
      {
        "term": "RED Method",
        "cat": "Observability",
        "d": 1,
        "def": "Monitoring framework for request-oriented services: Rate (requests/s), Errors (errors/s), and Duration (latency distribution)."
      },
      {
        "term": "USE Method",
        "cat": "Observability",
        "d": 1,
        "def": "Monitoring framework for hardware/system resources: Utilization (% of time busy), Saturation (queued work waiting), and Errors (resource errors)."
      },
      {
        "term": "MTBF / MTTR / MTTD",
        "cat": "Incidents",
        "d": 1,
        "def": "Mean Time Between Failures, Mean Time To Detect, and Mean Time To Recover/Restore (time until service is restored)."
      },
      {
        "term": "ndots:5 (Kubernetes DNS)",
        "cat": "Kubernetes",
        "d": 2,
        "def": "Default setting in the pods' /etc/resolv.conf that forces trying all the cluster's search suffixes before resolving any name with fewer than 5 dots."
      },
      {
        "term": "NodeLocal DNSCache",
        "cat": "Kubernetes",
        "d": 2,
        "def": "Kubernetes DaemonSet that runs a DNS caching agent on each node to reduce DNS resolution latency and avoid saturating CoreDNS and the conntrack table."
      },
      {
        "term": "OOMKilled (Exit Code 137)",
        "cat": "Kubernetes",
        "d": 2,
        "def": "Forced termination of a container with the SIGKILL signal (128 + 9 = 137) because its RAM consumption exceeded the limit defined in its cgroup or exhausted the node's memory."
      },
      {
        "term": "Outbox Pattern (Transactional Outbox)",
        "cat": "Distributed Systems",
        "d": 5,
        "def": "Pattern that guarantees consistency between a database and Kafka by saving the event in a local table within the same SQL transaction and publishing it asynchronously with CDC/Debezium or a relay."
      },
      {
        "term": "PgBouncer",
        "cat": "Data and Caching",
        "d": 5,
        "def": "Lightweight connection pooler for PostgreSQL that multiplexes thousands of application client connections over a few physical connections to the database."
      },
      {
        "term": "PodDisruptionBudget (PDB)",
        "cat": "Kubernetes",
        "d": 2,
        "def": "Kubernetes object that limits how many pods of an application can be down simultaneously due to voluntary disruptions (node drains, cluster upgrades)."
      },
      {
        "term": "Poison Pill",
        "cat": "Kafka",
        "d": 3,
        "def": "Malformed or unexpected message in a queue that causes the consumer to fail systematically every time it tries to deserialize or process it."
      },
      {
        "term": "preStop Hook",
        "cat": "Kubernetes",
        "d": 2,
        "def": "Action that the kubelet runs inside the container right before sending it SIGTERM when deleting the pod; key to giving load balancers time to remove the endpoint without causing 502 errors."
      },
      {
        "term": "rate() vs. irate() (PromQL)",
        "cat": "Observability",
        "d": 4,
        "def": "rate() computes the average per-second rate using all samples in the time window (ideal for alerts and trends); irate() uses only the last two samples (reactive but volatile)."
      },
      {
        "term": "Readiness Probe",
        "cat": "Kubernetes",
        "d": 2,
        "def": "Kubelet probe that indicates whether a pod is ready to receive traffic. If it fails, the pod is removed from the Service's Endpoints but is NOT restarted."
      },
      {
        "term": "RPO (Recovery Point Objective)",
        "cat": "DR",
        "d": 5,
        "def": "Maximum amount of data (measured in time, e.g., 5 minutes) that the organization accepts losing in the event of a disaster."
      },
      {
        "term": "RTO (Recovery Time Objective)",
        "cat": "DR",
        "d": 5,
        "def": "Maximum time that can elapse from when a disaster occurs until the service is operational again."
      },
      {
        "term": "Self-Heal (ArgoCD)",
        "cat": "GitOps and IaC",
        "d": 6,
        "def": "ArgoCD automatic sync option that reverts any manual change made with kubectl in the cluster to force it to match the state declared in Git."
      },
      {
        "term": "SNAT Port Exhaustion",
        "cat": "Networking and Linux",
        "d": 6,
        "def": "Exhaustion of outbound ephemeral ports on a NAT Gateway or node when pods open thousands of new outbound connections without reusing them through keep-alive pools."
      },
      {
        "term": "Split-Brain",
        "cat": "Distributed Systems",
        "d": 5,
        "def": "Catastrophic scenario in which two nodes of a cluster lose communication with each other and both simultaneously assume the primary role, accepting divergent writes and corrupting the data."
      },
      {
        "term": "Startup Probe",
        "cat": "Kubernetes",
        "d": 2,
        "def": "Kubernetes probe that disables liveness and readiness checks until the application finishes starting up for the first time, avoiding restart loops in services that are slow to initialize."
      },
      {
        "term": "Terraform State Drift",
        "cat": "GitOps and IaC",
        "d": 6,
        "def": "Divergence between the actual infrastructure deployed at the cloud provider and what is recorded in the terraform.tfstate file or the HCL code."
      },
      {
        "term": "Thanos Compactor",
        "cat": "Observability",
        "d": 4,
        "def": "Thanos singleton component that merges TSDB blocks in Object Storage, applies retention, and generates downsampling blocks (5m and 1h). It must never run with more than 1 replica on the same bucket."
      },
      {
        "term": "Toil (Repetitive Operational Work)",
        "cat": "Incidents",
        "d": 1,
        "def": "Manual, repetitive, automatable, tactical work with no lasting value that scales linearly with service size. Google SRE recommends keeping it below 50% of the team's time."
      }
    ]
  };
})(window);
