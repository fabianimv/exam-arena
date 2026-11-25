/* =========================================================================
   data/prometheus-pca/exam.js — CNCF · Prometheus Certified Associate (PCA) (English)
   Observability concepts, Prometheus architecture, PromQL, instrumentation,
   exporters, alerting rules, Alertmanager and SLO-based alerting.
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["prometheus-pca"] = {
    "id": "prometheus-pca",
    "appId": "prometheus-pca",
    "provider": "CNCF & Linux Foundation",
    "badge": "Prometheus · PCA",
    "icon": "🔥",
    "color": "#e6522c",
    "featured": true,
    "title": "CNCF · Prometheus Certified Associate (PCA)",
    "subtitle": "Observability signals, pull model, service discovery & relabeling, PromQL, metric types, exporters, alerting rules, Alertmanager routing and SLO burn-rate alerts",
    "passingScore": 75,
    "domains": {
      "1": "Observability Concepts (18%)",
      "2": "Prometheus Fundamentals (20%)",
      "3": "PromQL (28%)",
      "4": "Instrumentation and Exporters (16%)",
      "5": "Alerting and Dashboarding (18%)"
    },
    "shortDomains": {
      "1": "Observability",
      "2": "Fundamentals",
      "3": "PromQL",
      "4": "Instrumentation",
      "5": "Alerting"
    },
    "topics": [
      {
        "id": "pca-t-1-1",
        "d": 1,
        "title": "1.1 · Signals, SLIs/SLOs and Monitoring Methods",
        "html": "<h4>Three pillars and when to use each</h4>\n<table class=\"keytable\">\n<tr><th>Signal</th><th>Best for</th><th>Cost profile</th></tr>\n<tr><td>Metrics</td><td>Aggregated trends, alerting, capacity</td><td>Cheap per sample; cost grows with <b>cardinality</b></td></tr>\n<tr><td>Logs</td><td>Discrete events with rich context</td><td>Grows with volume</td></tr>\n<tr><td>Traces</td><td>Latency breakdown of a request across services</td><td>Usually sampled</td></tr>\n</table>\n<h4>SLI, SLO and error budget</h4>\n<p>An <b>SLI</b> is a ratio of good events to valid events (e.g. requests served under 300 ms). An <b>SLO</b> is the target for that SLI over a window (99.9% over 30 days). The <b>error budget</b> is the allowed failure: <code>(1 - SLO) × window</code>, e.g. 43.2 minutes per 30 days at 99.9%.</p>\n<h4>Methods</h4>\n<ul>\n<li><b>RED</b> for request-driven services: Rate, Errors, Duration.</li>\n<li><b>USE</b> for resources: Utilization, Saturation, Errors.</li>\n<li><b>Blackbox</b> monitoring probes from the outside (user symptoms); <b>whitebox</b> uses internal instrumentation.</li>\n</ul>"
      },
      {
        "id": "pca-t-2-1",
        "d": 2,
        "title": "2.1 · Architecture, Data Model and Configuration",
        "html": "<h4>Components</h4>\n<p>The Prometheus server <b>pulls</b> (scrapes) HTTP endpoints, stores samples in a local <b>TSDB</b>, evaluates recording and alerting rules, and sends alerts to <b>Alertmanager</b>. Short-lived batch jobs can push to the <b>Pushgateway</b>, which is then scraped.</p>\n<h4>Data model</h4>\n<p>A time series is identified by its metric name and label set, e.g. <code>http_requests_total{job=\"api\",method=\"GET\",code=\"200\"}</code>. Each sample is a float64 value plus a millisecond timestamp. Every target produces <code>up</code> (1 or 0) and <code>scrape_duration_seconds</code>.</p>\n<h4>Key configuration</h4>\n<pre>global:\n  scrape_interval: 30s\n  evaluation_interval: 30s\nrule_files: [rules/*.yml]\nscrape_configs:\n  - job_name: node\n    static_configs:\n      - targets: ['10.0.0.5:9100']</pre>\n<p>Validate with <code>promtool check config prometheus.yml</code>; reload with <code>SIGHUP</code> or <code>POST /-/reload</code> (requires <code>--web.enable-lifecycle</code>).</p>"
      },
      {
        "id": "pca-t-2-2",
        "d": 2,
        "title": "2.2 · Service Discovery, Relabeling, Storage and Scaling",
        "html": "<h4>Relabeling stages</h4>\n<table class=\"keytable\">\n<tr><th>Stage</th><th>Runs</th><th>Typical use</th></tr>\n<tr><td><code>relabel_configs</code></td><td>Before the scrape, on target labels (including <code>__meta_*</code>)</td><td>Keep/drop targets, set <code>__address__</code>, copy metadata into labels</td></tr>\n<tr><td><code>metric_relabel_configs</code></td><td>After the scrape, on every sample</td><td>Drop expensive metrics or labels before ingestion</td></tr>\n</table>\n<h4>Storage</h4>\n<p>The local TSDB is single-node; retention is set with <code>--storage.tsdb.retention.time</code> / <code>.size</code>. Long-term, global or highly available storage uses <code>remote_write</code> to systems such as Thanos, Cortex or Mimir.</p>\n<h4>High availability</h4>\n<p>Run two identical Prometheus replicas scraping the same targets; Alertmanager deduplicates their alerts, and a query layer (e.g. Thanos Query) can deduplicate series using a replica label.</p>"
      },
      {
        "id": "pca-t-3-1",
        "d": 3,
        "title": "3.1 · PromQL Essentials: Selectors, Rates and Aggregation",
        "html": "<h4>Types of expressions</h4>\n<ul>\n<li><b>Instant vector:</b> <code>http_requests_total{job=\"api\"}</code></li>\n<li><b>Range vector:</b> <code>http_requests_total[5m]</code> — input for functions such as <code>rate()</code>; cannot be graphed directly.</li>\n<li><b>Scalar</b> and <b>string</b>.</li>\n</ul>\n<h4>Counter functions</h4>\n<table class=\"keytable\">\n<tr><th>Function</th><th>Meaning</th></tr>\n<tr><td><code>rate(c[5m])</code></td><td>Per-second average over the window, handles counter resets. Use for alerts and most graphs.</td></tr>\n<tr><td><code>irate(c[5m])</code></td><td>Per-second rate from the last two samples; very reactive, noisy.</td></tr>\n<tr><td><code>increase(c[1h])</code></td><td>Total increase over the window (extrapolated, may be non-integer).</td></tr>\n</table>\n<p>Rule: <b>rate first, then aggregate</b> — <code>sum by (job) (rate(http_requests_total[5m]))</code>. The range should cover at least four scrape intervals.</p>"
      },
      {
        "id": "pca-t-3-2",
        "d": 3,
        "title": "3.2 · Histograms, Vector Matching and Prediction",
        "html": "<h4>Quantiles from histograms</h4>\n<pre>histogram_quantile(0.95,\n  sum by (le, job) (rate(http_request_duration_seconds_bucket[5m])))</pre>\n<p>Always keep the <code>le</code> label when aggregating buckets.</p>\n<h4>Ratios and joins</h4>\n<pre>sum(rate(http_requests_total{code=~\"5..\"}[5m]))\n  / sum(rate(http_requests_total[5m]))</pre>\n<p>Binary operations match series with identical labels. Use <code>on(...)</code>/<code>ignoring(...)</code> to choose labels and <code>group_left</code>/<code>group_right</code> for many-to-one joins, e.g. enriching with <code>kube_pod_info</code>.</p>\n<h4>Time-shifting and prediction</h4>\n<ul>\n<li><code>offset 1w</code> compares with last week.</li>\n<li><code>predict_linear(node_filesystem_avail_bytes[6h], 4*3600) &lt; 0</code> predicts a full disk in 4 hours.</li>\n<li><code>absent(up{job=\"api\"})</code> returns 1 when no series exist.</li>\n</ul>"
      },
      {
        "id": "pca-t-4-1",
        "d": 4,
        "title": "4.1 · Metric Types, Naming and Exporters",
        "html": "<h4>Metric types</h4>\n<table class=\"keytable\">\n<tr><th>Type</th><th>Behavior</th><th>Example</th></tr>\n<tr><td>Counter</td><td>Only increases (resets on restart)</td><td><code>http_requests_total</code></td></tr>\n<tr><td>Gauge</td><td>Goes up and down</td><td><code>queue_depth</code></td></tr>\n<tr><td>Histogram</td><td>Cumulative <code>_bucket{le}</code>, <code>_sum</code>, <code>_count</code>; aggregatable</td><td><code>http_request_duration_seconds</code></td></tr>\n<tr><td>Summary</td><td>Client-side quantiles; <b>not</b> aggregatable across instances</td><td><code>rpc_duration_seconds{quantile=\"0.99\"}</code></td></tr>\n</table>\n<h4>Naming best practices</h4>\n<p>Use snake_case, a domain prefix, <b>base units</b> (<code>_seconds</code>, <code>_bytes</code>) and the <code>_total</code> suffix for counters. Never put unbounded values (user IDs, emails, full URLs) in labels.</p>\n<h4>Exporters</h4>\n<p>Exporters translate third-party metrics: <code>node_exporter</code> (hosts, plus the <b>textfile collector</b> for cron jobs), <code>blackbox_exporter</code> (HTTP/TCP/ICMP probes), <code>mysqld_exporter</code>, and many more. The Pushgateway is only for service-level batch jobs.</p>"
      },
      {
        "id": "pca-t-5-1",
        "d": 5,
        "title": "5.1 · Alerting Rules, Recording Rules and Alertmanager",
        "html": "<h4>Rules</h4>\n<pre>groups:\n- name: api\n  rules:\n  - record: job:http_requests:rate5m\n    expr: sum by (job) (rate(http_requests_total[5m]))\n  - alert: HighErrorRate\n    expr: job:http_errors:ratio_rate5m &gt; 0.05\n    for: 10m\n    labels: { severity: page }\n    annotations: { summary: 'High error rate on {{ $labels.job }}' }</pre>\n<p>An alert is <b>pending</b> while the condition has held for less than <code>for</code>, then <b>firing</b>.</p>\n<h4>Alertmanager</h4>\n<table class=\"keytable\">\n<tr><th>Feature</th><th>Purpose</th></tr>\n<tr><td>Routing tree</td><td>Matchers send alerts to receivers (PagerDuty, Slack, email)</td></tr>\n<tr><td>Grouping</td><td><code>group_by</code>, <code>group_wait</code>, <code>group_interval</code>, <code>repeat_interval</code></td></tr>\n<tr><td>Inhibition</td><td>Mute dependent alerts while a more severe one fires</td></tr>\n<tr><td>Silences</td><td>Time-bound muting, e.g. maintenance windows</td></tr>\n</table>\n<h4>SLO burn-rate alerts</h4>\n<p>Page when the budget burns fast over both a long and a short window, e.g. 14.4× over 1h <b>and</b> 5m for a 99.9% SLO.</p>"
      }
    ],
    "questions": [
      {
        "id": "pca-01",
        "d": 1,
        "t": "Choosing the Right Signal",
        "q": "Checkout latency rose from 300 ms to 2 s. The request passes through an API gateway, three microservices and two databases. Metrics confirm the overall p99 increase. Which signal best shows where in the call path the time is spent?",
        "o": [
          "Distributed traces, which break each request into spans per service and dependency.",
          "Node-level CPU metrics, because latency always comes from CPU saturation.",
          "Application logs grepped by timestamp on each service in turn.",
          "The `up` metric of every service, which records per-hop response times."
        ],
        "a": 0,
        "e": "Traces record the timing of each hop of a single request, so they show which service or dependency adds the latency. Metrics are aggregated and logs lack the causal links between services."
      },
      {
        "id": "pca-02",
        "d": 1,
        "t": "Pull Model",
        "q": "An architect asks why Prometheus scrapes targets instead of having them push metrics. Which is a genuine operational advantage of the pull model?",
        "o": [
          "Targets need no HTTP endpoint, which reduces their attack surface.",
          "It guarantees no samples are lost when the Prometheus server restarts.",
          "Prometheus knows when a target is down, because a failed scrape sets `up` to 0.",
          "It removes the need for service discovery, since targets announce themselves."
        ],
        "a": 2,
        "e": "Because Prometheus initiates the scrape, it can tell the difference between 'no data' and 'target unreachable', exposed as `up == 0`. It also makes it easy to run a second Prometheus or scrape manually for debugging."
      },
      {
        "id": "pca-03",
        "d": 1,
        "t": "Defining an SLI",
        "q": "The product team wants an availability indicator for a public API. Which expression is a well-formed SLI?",
        "o": [
          "The average CPU usage of the API Pods over the last 30 days.",
          "The proportion of valid requests that returned a non-5xx response, over all valid requests.",
          "The number of Pods in the API Deployment that are currently Ready.",
          "The total number of 5xx responses in the last hour, without normalization."
        ],
        "a": 1,
        "e": "A good SLI is a ratio of good events to valid events that reflects user experience. CPU or Pod counts are causes, not user-facing outcomes, and a raw error count depends on traffic volume."
      },
      {
        "id": "pca-04",
        "d": 1,
        "t": "Error Budget",
        "q": "A service has an availability SLO of 99.9% measured over a rolling 30-day window. Roughly how much full downtime does its error budget allow in that window?",
        "o": [
          "About 4.3 minutes",
          "About 7.2 hours",
          "About 8.8 hours",
          "About 43 minutes"
        ],
        "a": 3,
        "e": "Error budget = (1 - 0.999) × 30 days = 0.001 × 43,200 minutes = 43.2 minutes. 8.8 hours corresponds to 99.9% over a year, and 4.3 minutes to 99.99% over 30 days."
      },
      {
        "id": "pca-05",
        "d": 1,
        "t": "Cardinality",
        "q": "After a deploy, Prometheus memory usage tripled and `prometheus_tsdb_head_series` jumped from 400k to 6M. The new release added a `user_id` label to `http_requests_total`. What is the right fix?",
        "o": [
          "Increase `scrape_interval` from 30s to 5m so fewer samples are stored.",
          "Remove the `user_id` label from the metric; per-user detail belongs in logs or traces.",
          "Shorten retention to 2 days so old user series expire sooner.",
          "Add more CPU to Prometheus, since series churn is a CPU problem."
        ],
        "a": 1,
        "e": "Each unique label combination is a separate series held in memory. Unbounded labels such as user IDs explode cardinality. Keep labels bounded and put high-cardinality context into logs or traces."
      },
      {
        "id": "pca-06",
        "d": 1,
        "t": "RED and USE",
        "q": "You are designing two dashboards: one for a REST service and one for the database host it runs on. Which pairing of methods is most appropriate?",
        "o": [
          "USE for the REST service and RED for the host, since hosts serve requests.",
          "RED for both dashboards, because every component ultimately handles requests.",
          "RED for the REST service and USE for the database host.",
          "USE for both dashboards, because CPU and memory explain every incident."
        ],
        "a": 2,
        "e": "RED describes request-driven services from the caller's point of view; USE describes resources such as CPU, disks and network interfaces. Combining both links symptoms to resource causes."
      },
      {
        "id": "pca-07",
        "d": 1,
        "t": "Blackbox Monitoring",
        "q": "All internal metrics of a web app look healthy, yet customers report the site is unreachable due to an expired TLS certificate on the load balancer. What monitoring would have caught this?",
        "o": [
          "Adding more labels to the application's internal request counters and histograms.",
          "External `blackbox_exporter` HTTP probes, including `probe_ssl_earliest_cert_expiry`.",
          "Lowering the scrape interval of node_exporter on every web server in the pool.",
          "Recording rules that precompute the application's request and error rates."
        ],
        "a": 1,
        "e": "Blackbox monitoring tests the system like a user does, catching failures outside the application such as DNS, load balancers or certificates. The blackbox exporter also exposes certificate expiry for early alerts."
      },
      {
        "id": "pca-08",
        "d": 2,
        "t": "Data Model",
        "q": "Which statement correctly describes what uniquely identifies a time series in Prometheus?",
        "o": [
          "The metric name together with its complete set of label names and values.",
          "The metric name alone; labels are optional annotations stored with samples.",
          "The scrape job name and the target address, regardless of metric name.",
          "The metric name plus the timestamp of its first sample."
        ],
        "a": 0,
        "e": "A series is identified by its name and full label set. Changing any label value, even one, creates a different series, which is why label design drives cardinality."
      },
      {
        "id": "pca-09",
        "d": 2,
        "t": "Scrape Configuration",
        "q": "Prometheus refuses to load a config with `scrape_interval: 15s` and `scrape_timeout: 30s` for one job. Why?",
        "o": [
          "`scrape_timeout` must be at least twice the `scrape_interval`.",
          "`scrape_timeout` can only be set globally, never per job.",
          "Intervals must be expressed in milliseconds in the scrape section.",
          "`scrape_timeout` cannot be greater than `scrape_interval`."
        ],
        "a": 3,
        "e": "A scrape must finish before the next one begins, so the timeout cannot exceed the interval. Use `promtool check config` to detect this before reloading."
      },
      {
        "id": "pca-10",
        "d": 2,
        "t": "Kubernetes Service Discovery",
        "q": "Using `kubernetes_sd_configs` with role `pod`, you want to scrape only Pods annotated `prometheus.io/scrape: \"true\"`. Which relabel rule achieves this?",
        "o": [
          "`metric_relabel_configs` with `action: drop` on `__name__` matching `prometheus.io/scrape`.",
          "`relabel_configs` with `action: keep` on `__meta_kubernetes_pod_annotation_prometheus_io_scrape` and `regex: true`.",
          "`relabel_configs` with `action: labelmap` and `regex: __meta_kubernetes_pod_annotation_(.+)`.",
          "`static_configs` listing each annotated Pod IP, regenerated by a CronJob every minute."
        ],
        "a": 1,
        "e": "Target selection happens in `relabel_configs` using discovery metadata. Annotations appear as `__meta_kubernetes_pod_annotation_<name>` with characters sanitized to underscores, and `keep` drops non-matching targets."
      },
      {
        "id": "pca-11",
        "d": 2,
        "t": "Dropping Expensive Metrics",
        "q": "A target exposes `grpc_server_handling_seconds_bucket` with thousands of series that nobody uses. You still want every other metric from that target. Where should you drop it?",
        "o": [
          "In `metric_relabel_configs` with `action: drop` on `__name__`.",
          "In `relabel_configs` with `action: drop` on `__name__`, before the scrape happens.",
          "In a recording rule that overwrites the metric with an empty vector.",
          "By raising `sample_limit` on the job so the scrape no longer fails."
        ],
        "a": 0,
        "e": "`metric_relabel_configs` runs on scraped samples, before ingestion, so you can drop specific metrics. At `relabel_configs` time no metric names exist yet; it operates on targets."
      },
      {
        "id": "pca-12",
        "d": 2,
        "t": "Long-Term Storage",
        "q": "Compliance requires 13 months of metrics and a global view across five clusters, each with its own Prometheus. What is the recommended approach?",
        "o": [
          "Set `--storage.tsdb.retention.time=400d` on each server and federate everything into one Prometheus.",
          "Mount the same NFS volume as TSDB storage for all five servers.",
          "Use `remote_write` (or sidecars) to a horizontally scalable store such as Thanos, Cortex or Mimir.",
          "Run `promtool tsdb dump` nightly and import the output into a central server."
        ],
        "a": 2,
        "e": "Local TSDB is single-node and not designed for long retention or global queries. Remote storage systems provide durable object storage, deduplication and a global query view."
      },
      {
        "id": "pca-13",
        "d": 2,
        "t": "Highly Available Prometheus",
        "q": "You need alerting to keep working if one Prometheus server dies. What is the standard Prometheus HA pattern?",
        "o": [
          "Run two Prometheus servers in an active-passive cluster sharing one TSDB directory.",
          "Run one Prometheus and enable its built-in Raft replication with `--cluster.peer`.",
          "Run two Prometheus servers that each scrape half of the targets to share the load.",
          "Two identical replicas scraping the same targets, alerting via a deduplicating Alertmanager cluster."
        ],
        "a": 3,
        "e": "Prometheus has no clustering of its own. Identical replicas give redundancy, and Alertmanager (itself clustered via gossip) deduplicates the duplicate alerts they send."
      },
      {
        "id": "pca-14",
        "d": 2,
        "t": "Reloading Configuration",
        "q": "You edited `prometheus.yml` on a running server and want to apply it without a restart. Which sequence is correct?",
        "o": [
          "Run `promtool check config prometheus.yml`, then send `SIGHUP` or `POST /-/reload` (with `--web.enable-lifecycle`).",
          "Delete the WAL directory so Prometheus re-reads its configuration on the next scrape.",
          "Call `POST /api/v1/admin/tsdb/snapshot`, which reloads configuration and rules.",
          "Do nothing; Prometheus watches the file and reloads within one `scrape_interval`."
        ],
        "a": 0,
        "e": "Validating first avoids a failed reload. The reload endpoint is disabled unless `--web.enable-lifecycle` is set; `SIGHUP` always works. If the new config is invalid, Prometheus keeps the old one and reports the failure."
      },
      {
        "id": "pca-15",
        "d": 2,
        "t": "Target Health",
        "q": "Which PromQL query lists every target that failed its most recent scrape?",
        "o": [
          "`scrape_samples_scraped == 0`",
          "`up == 0`",
          "`absent(up)`",
          "`rate(up[5m]) < 0`"
        ],
        "a": 1,
        "e": "Prometheus records `up` = 1 for a successful scrape and 0 for a failed one, per target. `absent(up)` only reports when no `up` series exist at all."
      },
      {
        "id": "pca-16",
        "d": 3,
        "t": "Counters and rate()",
        "q": "You want to graph requests per second for the `api` job from the counter `http_requests_total`. Which query is correct?",
        "o": [
          "`http_requests_total{job=\"api\"} / 60`",
          "`deriv(http_requests_total{job=\"api\"}[5m])`",
          "`sum(rate(http_requests_total{job=\"api\"}[5m]))`",
          "`rate(sum(http_requests_total{job=\"api\"})[5m])`"
        ],
        "a": 2,
        "e": "`rate()` computes per-second increase from a counter while handling resets, and aggregation comes after the rate. The raw counter is cumulative, and `deriv` is meant for gauges."
      },
      {
        "id": "pca-17",
        "d": 3,
        "t": "rate vs irate",
        "q": "An alert on `irate(http_errors_total[5m]) > 10` flaps constantly, while the dashboard trend looks steady. What change is most appropriate?",
        "o": [
          "Use `rate()`, which averages over the whole window.",
          "Shrink the window to `[30s]` so `irate` reacts faster to changes.",
          "Replace the counter with a gauge so `irate` becomes stable.",
          "Add `offset 5m` to the selector to smooth out the spikes."
        ],
        "a": 0,
        "e": "`irate` uses only the last two samples, so it reflects momentary spikes. `rate` averages over the range, giving the stability needed for alert conditions; `irate` is mainly for high-resolution graphs."
      },
      {
        "id": "pca-18",
        "d": 3,
        "t": "Range Window Size",
        "q": "With `scrape_interval: 1m`, the query `rate(http_requests_total[1m])` often returns no data. What is the cause and fix?",
        "o": [
          "`rate` only accepts windows expressed in hours, so use `[1h]`.",
          "The counter was reset, so the query must be wrapped in `resets()`.",
          "The query needs `irate` because the interval is one minute.",
          "The window holds under two samples; use about four intervals, e.g. `[5m]`."
        ],
        "a": 3,
        "e": "`rate` needs at least two samples in the range. With a 1-minute scrape, a 1-minute window often contains only one. A range of about four intervals is robust to missed scrapes."
      },
      {
        "id": "pca-19",
        "d": 3,
        "t": "Aggregation Order",
        "q": "A colleague wrote `rate(sum by (job) (http_requests_total)[5m:])`. Why is `sum by (job) (rate(http_requests_total[5m]))` preferred?",
        "o": [
          "Subqueries are not supported in recording rules or alerting rules.",
          "Summing raw counters first hides per-instance resets, distorting the rate.",
          "`sum` must always be the outermost function in any PromQL expression.",
          "Both are equivalent; the second form is only shorter to write."
        ],
        "a": 1,
        "e": "When one instance restarts its counter drops to zero; `rate` on that series corrects for it. After summing, the reset looks like a real decrease of the total, distorting the result."
      },
      {
        "id": "pca-20",
        "d": 3,
        "t": "histogram_quantile",
        "q": "You need the 95th percentile request latency per job from the histogram `http_request_duration_seconds`. Which query is correct?",
        "o": [
          "`histogram_quantile(0.95, sum by (job) (rate(http_request_duration_seconds_bucket[5m])))`",
          "`quantile(0.95, rate(http_request_duration_seconds_sum[5m]))`",
          "`histogram_quantile(0.95, sum by (le, job) (rate(http_request_duration_seconds_bucket[5m])))`",
          "`avg by (job) (http_request_duration_seconds_bucket{le=\"0.95\"})`"
        ],
        "a": 2,
        "e": "`histogram_quantile` needs the per-bucket rates with the `le` label preserved. Dropping `le` in the aggregation removes the bucket boundaries, and `quantile()` across series is a different calculation."
      },
      {
        "id": "pca-21",
        "d": 3,
        "t": "Error Ratio",
        "q": "Which expression returns the fraction of requests that ended with a 5xx status over the last 5 minutes, across all instances?",
        "o": [
          "`rate(http_requests_total{code=~\"5..\"}[5m]) / rate(http_requests_total[5m])`",
          "`count(http_requests_total{code=~\"5..\"}) / count(http_requests_total)`",
          "`sum(increase(http_requests_total{code=\"5xx\"}[5m]))`",
          "`sum(rate(http_requests_total{code=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m]))`"
        ],
        "a": 3,
        "e": "Aggregating both sides with `sum` produces two single-element vectors that divide cleanly. Without aggregation, series are matched on their full label sets (including `code`), so each 5xx series is divided by itself."
      },
      {
        "id": "pca-22",
        "d": 3,
        "t": "Many-to-One Matching",
        "q": "You want to add the `node` label from `kube_pod_info{namespace, pod, node}` (value always 1) to `container_memory_working_set_bytes{namespace, pod, container}`. Which expression does this?",
        "o": [
          "`container_memory_working_set_bytes + on(namespace, pod) kube_pod_info`",
          "`container_memory_working_set_bytes * on(namespace, pod) group_left(node) kube_pod_info`",
          "`container_memory_working_set_bytes and on(namespace, pod) kube_pod_info`",
          "`kube_pod_info * on(node) group_right container_memory_working_set_bytes`"
        ],
        "a": 1,
        "e": "Matching `on(namespace, pod)` aligns the series; `group_left(node)` allows many containers per Pod on the left side and copies `node` from the info metric. Multiplying by 1 keeps the memory value."
      },
      {
        "id": "pca-23",
        "d": 3,
        "t": "offset",
        "q": "A dashboard panel must show how today's request rate compares with the same time last week. Which query provides last week's value?",
        "o": [
          "`sum(rate(http_requests_total[5m] offset 1w))`",
          "`sum(rate(http_requests_total[1w]))`",
          "`sum(rate(http_requests_total[5m])) - 1w`",
          "`sum(rate(http_requests_total[5m] @ 1w))`"
        ],
        "a": 0,
        "e": "`offset 1w` shifts the evaluation back one week while keeping the same 5-minute window. A `[1w]` range averages over the entire week instead, and `@` expects a Unix timestamp."
      },
      {
        "id": "pca-24",
        "d": 3,
        "t": "predict_linear",
        "q": "You want to alert when a file system is predicted to run out of space within 4 hours, based on the trend of the last 6 hours. Which expression fits?",
        "o": [
          "`node_filesystem_avail_bytes < 4 * 3600`",
          "`deriv(node_filesystem_avail_bytes[4h]) < 0`",
          "`rate(node_filesystem_avail_bytes[6h]) * 4 < 0`",
          "`predict_linear(node_filesystem_avail_bytes[6h], 4 * 3600) < 0`"
        ],
        "a": 3,
        "e": "`predict_linear` fits a linear regression over the range and extrapolates the gauge the given number of seconds ahead. `rate` is for counters, and a negative derivative alone does not mean the disk will fill soon."
      },
      {
        "id": "pca-25",
        "d": 3,
        "t": "Detecting Missing Targets",
        "q": "The `payments` job disappeared from service discovery after a bad deploy, so `up{job=\"payments\"} == 0` never fires. Which expression detects this situation?",
        "o": [
          "`up{job=\"payments\"} != 1`",
          "`absent(up{job=\"payments\"})`",
          "`count(up{job=\"payments\"}) == 0`",
          "`up{job=\"payments\"} unless up`"
        ],
        "a": 1,
        "e": "When no series match, comparison and `count` return an empty result, so nothing fires. `absent()` returns 1 precisely when the selector matches nothing, making it ideal for 'target vanished' alerts."
      },
      {
        "id": "pca-26",
        "d": 3,
        "t": "increase() Extrapolation",
        "q": "`increase(jobs_processed_total[1h])` returns `29.8` even though the counter only increments by whole numbers. Why?",
        "o": [
          "The counter is stored as float32, which introduces small rounding errors.",
          "A counter reset occurred, and `increase` subtracts a fraction for each reset.",
          "`increase` extrapolates to the window edges, as samples rarely align with them.",
          "The query is affected by `scrape_timeout` and must be wrapped in `round()` to be valid."
        ],
        "a": 2,
        "e": "`increase` is `rate` multiplied by the window length, and both extrapolate the observed slope to the range edges. Non-integer results are expected; use `round()` only for display."
      },
      {
        "id": "pca-27",
        "d": 4,
        "t": "Histogram vs Summary",
        "q": "A service runs 20 replicas and you need the fleet-wide p99 latency. Which metric type should the service expose?",
        "o": [
          "A Summary, because its client-side quantiles can be averaged across replicas.",
          "A Gauge holding the latest request duration of each replica.",
          "A Counter of total request time, divided by replica count at query time.",
          "A Histogram, because bucket counters can be summed across replicas before computing quantiles."
        ],
        "a": 3,
        "e": "Summary quantiles are computed per instance and cannot be combined mathematically. Histogram buckets are counters, so `sum by (le)` across replicas followed by `histogram_quantile` yields a valid fleet-wide estimate."
      },
      {
        "id": "pca-28",
        "d": 4,
        "t": "Metric Naming",
        "q": "You are adding a metric that measures how long outbound payment API calls take. Which name follows Prometheus naming conventions?",
        "o": [
          "`payment_api_request_duration_seconds`",
          "`PaymentApiLatencyMs`",
          "`payment_api_duration_milliseconds_total`",
          "`payment.api.latency`"
        ],
        "a": 0,
        "e": "Names use snake_case, a domain prefix, and base units such as seconds. `_total` is reserved for counters, dots are not allowed, and milliseconds should be avoided in favor of seconds."
      },
      {
        "id": "pca-29",
        "d": 4,
        "t": "Exporters",
        "q": "You must monitor a vendor-supplied MySQL server whose source code you cannot change. What is the standard Prometheus approach?",
        "o": [
          "Push MySQL statistics to the Pushgateway from a cron job every minute.",
          "Run `mysqld_exporter` to expose MySQL status in Prometheus format.",
          "Patch the MySQL binary with a Prometheus client library.",
          "Parse the MySQL slow query log with a recording rule every minute."
        ],
        "a": 1,
        "e": "Exporters bridge systems that do not natively expose Prometheus metrics. They run alongside the service and translate its stats on each scrape, keeping the pull model and `up` semantics."
      },
      {
        "id": "pca-30",
        "d": 4,
        "t": "Pushgateway Use Cases",
        "q": "Which workload is an appropriate use of the Pushgateway?",
        "o": [
          "A long-running web service behind a firewall that blocks inbound scrapes.",
          "Every Pod of a Deployment pushing its request counters every 15 seconds.",
          "A nightly batch job that pushes its completion time and records processed before exiting.",
          "Replacing service discovery by having all targets push their metrics."
        ],
        "a": 2,
        "e": "The Pushgateway is meant for service-level, short-lived batch jobs that may finish before a scrape. It does not expire pushed series and becomes a single point of failure if used for regular instances."
      },
      {
        "id": "pca-31",
        "d": 4,
        "t": "Textfile Collector",
        "q": "A cron script on each host checks the age of the latest backup file. You want that value in Prometheus with the host's labels and without running another HTTP server. What should you use?",
        "o": [
          "Write the value to a `.prom` file read by node_exporter's textfile collector.",
          "Push the value to the Pushgateway with the hostname as the job name.",
          "Add the value to `/etc/prometheus/prometheus.yml` as a static label.",
          "Create a recording rule that runs the script on each evaluation."
        ],
        "a": 0,
        "e": "The textfile collector exposes metrics written atomically to `*.prom` files in a configured directory, attached to the host's existing node_exporter target and its labels."
      },
      {
        "id": "pca-32",
        "d": 4,
        "t": "Histogram Buckets",
        "q": "Your latency SLO is 'requests faster than 300 ms'. The histogram uses default buckets (..., 0.25, 0.5, 1, ...). Why should you adjust them?",
        "o": [
          "Default buckets are measured in milliseconds, so they must be converted to seconds.",
          "Histograms only support up to five buckets; extra ones are silently dropped.",
          "Adding buckets reduces cardinality because each bucket replaces a label.",
          "Without a `le=\"0.3\"` bucket, the count of requests under 300 ms can only be estimated by interpolation."
        ],
        "a": 3,
        "e": "Buckets are cumulative counters with fixed boundaries. A bucket exactly at the SLO threshold gives an exact good-events count; otherwise the value between 0.25 and 0.5 must be interpolated."
      },
      {
        "id": "pca-33",
        "d": 4,
        "t": "Exposition Format",
        "q": "Which snippet is valid Prometheus text exposition format for a counter?",
        "o": [
          "`http_requests_total(method=GET, code=200) = 1027` after a `# TYPE` line",
          "`http_requests_total{method=\"GET\",code=\"200\"} 1027` after a `# TYPE` line",
          "`{\"name\": \"http_requests_total\", \"labels\": {\"method\": \"GET\"}, \"value\": 1027}`",
          "`http_requests_total:method=GET:code=200 1027 counter` with no header"
        ],
        "a": 1,
        "e": "The text format uses optional `# HELP` and `# TYPE` lines, then `name{label=\"value\",...} value [timestamp]`. Label values are double-quoted inside curly braces."
      },
      {
        "id": "pca-34",
        "d": 5,
        "t": "Alert States",
        "q": "An alert rule has `for: 10m`. Its expression became true 4 minutes ago. What is the alert's state and has Alertmanager been notified?",
        "o": [
          "Firing; Alertmanager is notified immediately and waits 10 minutes to send.",
          "Pending; it is not sent to Alertmanager until the condition holds for 10 minutes.",
          "Inactive; `for` delays evaluation of the expression itself by 10 minutes.",
          "Resolved; the alert resets each evaluation until 10 minutes pass."
        ],
        "a": 1,
        "e": "While the condition holds for less than the `for` duration the alert is pending and visible in the Prometheus UI and the `ALERTS` metric, but is not sent. After 10 continuous minutes it becomes firing."
      },
      {
        "id": "pca-35",
        "d": 5,
        "t": "Alertmanager Timing",
        "q": "The on-call engineer receives the same unresolved alert notification every 5 minutes and asks to be reminded only every 4 hours. Which Alertmanager setting controls this?",
        "o": [
          "`group_wait`",
          "`group_interval`",
          "`repeat_interval`",
          "`resolve_timeout`"
        ],
        "a": 2,
        "e": "`repeat_interval` sets how long to wait before resending a notification for a group that has not changed. `group_wait` delays the first notification and `group_interval` controls updates when new alerts join a group."
      },
      {
        "id": "pca-36",
        "d": 5,
        "t": "Inhibition",
        "q": "When a whole cluster loses network connectivity, dozens of service-level alerts fire alongside the `ClusterUnreachable` critical alert. How do you suppress the dependent alerts automatically?",
        "o": [
          "An `inhibit_rules` entry sourced on `ClusterUnreachable` with `equal: [cluster]`.",
          "A silence created by the on-call engineer each time such an outage starts.",
          "Lowering the severity of every service-level alert to `info`.",
          "Increasing `group_wait` to one hour so the alerts expire before sending."
        ],
        "a": 0,
        "e": "Inhibition mutes target alerts while a matching source alert fires, scoped by labels listed in `equal`. Silences are manual and time-bound, while changing severities loses useful signals."
      },
      {
        "id": "pca-37",
        "d": 5,
        "t": "Silences",
        "q": "A database will be under planned maintenance from 02:00 to 04:00 tonight. You want no pages for it during that window, while keeping alert rules intact. What should you do?",
        "o": [
          "Comment out the database alert rules and reload Prometheus after the window.",
          "Stop the Alertmanager service for those two hours.",
          "Add an inhibition rule that always mutes all database alerts.",
          "Create an Alertmanager silence for the database labels from 02:00 to 04:00."
        ],
        "a": 3,
        "e": "Silences mute matching alerts for a defined period and expire automatically. Editing rules risks forgetting to restore them, and stopping Alertmanager mutes every other team too."
      },
      {
        "id": "pca-38",
        "d": 5,
        "t": "Routing Tree",
        "q": "All alerts go to Slack. Critical alerts must also page through PagerDuty. How should the Alertmanager route be configured?",
        "o": [
          "Two separate Alertmanager instances, one per receiver, each scraping Prometheus.",
          "A child route matching `severity=\"critical\"` to PagerDuty with `continue: true`, followed by a route to Slack.",
          "A single route to Slack with a webhook that forwards critical messages to PagerDuty.",
          "Set `severity=critical` as a group label so Alertmanager picks the receiver automatically."
        ],
        "a": 1,
        "e": "Routes are evaluated top-down and stop at the first match unless `continue: true` is set. Continuing lets a critical alert page through PagerDuty and still reach the Slack route."
      },
      {
        "id": "pca-39",
        "d": 5,
        "t": "Recording Rules",
        "q": "A dashboard opened by 200 engineers runs a heavy `histogram_quantile` over thousands of series and slows Prometheus. What is the recommended optimization?",
        "o": [
          "Lower `scrape_interval` so each query touches fewer samples.",
          "Move the query into an alerting rule with `for: 0s` and graph `ALERTS`.",
          "Precompute it with a recording rule and point the dashboard at the result.",
          "Increase `--query.max-concurrency` to 1000 so all queries run in parallel."
        ],
        "a": 2,
        "e": "Recording rules precompute expensive expressions at each evaluation and store the result as new series, so dashboards read cheap pre-aggregated data. The `level:metric:operations` naming convention keeps them discoverable."
      },
      {
        "id": "pca-40",
        "d": 5,
        "t": "Burn-Rate Alerting",
        "q": "For a 99.9% availability SLO over 30 days, the team wants to page only on fast, sustained budget consumption with low false positives. Which strategy fits?",
        "o": [
          "Page whenever any single request returns a 5xx response.",
          "Page when the error ratio exceeds 14.4 × 0.1% over both 1h and 5m.",
          "Page only once the 30-day error budget is fully consumed.",
          "Page when CPU usage stays above 90% for 5 minutes."
        ],
        "a": 1,
        "e": "A 14.4× burn rate spends 2% of a 30-day budget in one hour. Requiring both a long and a short window makes the alert significant yet quick to reset, the multi-window multi-burn-rate approach."
      }
    ],
    "why": {
      "pca-01": [
        null,
        "CPU is one possible cause, but it cannot show which hop in a multi-service request is slow.",
        "Correlating logs across services by timestamp is slow and imprecise without trace context.",
        "`up` only shows whether a scrape succeeded; it has no per-request timing."
      ],
      "pca-02": [
        "Pull actually requires targets to expose an HTTP endpoint.",
        "Restarts can still lose in-memory data not yet in the WAL; pulling does not guarantee completeness.",
        null,
        "Pull relies on service discovery to find targets; push models are the ones where targets announce themselves."
      ],
      "pca-03": [
        "CPU usage is a resource metric and does not tell whether users were served successfully.",
        null,
        "Ready Pods measure capacity, not whether requests succeed.",
        "A raw count depends on traffic and is not a ratio; the same number can be good or bad."
      ],
      "pca-04": [
        "4.3 minutes corresponds to a 99.99% SLO over 30 days.",
        "7.2 hours corresponds to a 99% SLO over 30 days.",
        "8.8 hours corresponds to a 99.9% SLO over a full year.",
        null
      ],
      "pca-05": [
        "Fewer samples per series does not reduce the number of series held in memory.",
        null,
        "Active series stay in the head block regardless of retention; shorter retention also loses history.",
        "Memory growth here is driven by series count, not CPU."
      ],
      "pca-06": [
        "This reverses the methods: RED is user-facing for services and USE is for resources.",
        "A database host has resources like disks and CPU that RED does not describe.",
        null,
        "USE ignores the user-facing symptoms that matter most for a service."
      ],
      "pca-07": [
        "Internal counters cannot see failures that happen before traffic reaches the application.",
        null,
        "node_exporter reports host metrics and does not see the load balancer certificate.",
        "Recording rules only reshape existing data; they cannot add an external viewpoint."
      ],
      "pca-08": [
        null,
        "Labels are part of the identity; different label values are different series.",
        "Job and instance are just two labels among many; the metric name is also part of identity.",
        "Timestamps belong to samples, not to series identity."
      ],
      "pca-09": [
        "The constraint is the opposite: the timeout must not exceed the interval.",
        "`scrape_timeout` can be set per job.",
        "Durations use units like `15s`; milliseconds are not required.",
        null
      ],
      "pca-10": [
        "`metric_relabel_configs` runs after the scrape and acts on metric names, not on Pod annotations.",
        null,
        "`labelmap` copies matching labels; it does not filter targets.",
        "Static lists defeat the purpose of service discovery and go stale immediately."
      ],
      "pca-11": [
        null,
        "Before the scrape there are no metric names to match; `relabel_configs` works on targets.",
        "Recording rules create new series and cannot delete ingested ones.",
        "Raising `sample_limit` keeps ingesting the unwanted series."
      ],
      "pca-12": [
        "Very long local retention and federating all raw data into one server does not scale and has no durability guarantees.",
        "Sharing a TSDB directory between servers is unsupported and corrupts data.",
        null,
        "Dump and import is manual, slow and not a supported long-term storage strategy."
      ],
      "pca-13": [
        "Prometheus does not support sharing a TSDB directory or active-passive clustering.",
        "Prometheus has no built-in Raft or peer replication.",
        "Splitting targets is sharding; losing one server loses half the monitoring.",
        null
      ],
      "pca-14": [
        null,
        "Deleting the WAL loses recent data and does not reload configuration.",
        "The snapshot API creates a TSDB backup; it does not reload config.",
        "Prometheus does not watch its configuration file for changes."
      ],
      "pca-15": [
        "A target can return zero samples successfully; this does not mean the scrape failed.",
        null,
        "`absent(up)` only fires when no `up` series exist at all.",
        "`up` is a gauge of 0/1; applying `rate` to it is meaningless."
      ],
      "pca-16": [
        "Dividing a cumulative counter by 60 does not give a per-second rate.",
        "`deriv` is for gauges and does not handle counter resets.",
        null,
        "Applying rate after summing breaks reset handling, and this syntax is not even valid without a subquery."
      ],
      "pca-17": [
        null,
        "A shorter window makes `irate` even noisier.",
        "The metric is naturally a counter; turning it into a gauge loses reset handling.",
        "`offset` shifts time; it does not smooth values."
      ],
      "pca-18": [
        "`rate` accepts any duration unit; hours are not required.",
        "Resets are handled automatically by `rate`; `resets()` only counts them.",
        "`irate` also needs two samples in the window and has the same problem.",
        null
      ],
      "pca-19": [
        "Subqueries are allowed in rules; the issue is correctness, not syntax.",
        null,
        "There is no such rule; aggregation can appear anywhere valid in an expression.",
        "The results differ whenever any instance restarts."
      ],
      "pca-20": [
        "Aggregating without `le` destroys the bucket boundaries needed for the quantile.",
        "`_sum` holds totals, and `quantile()` across series is not a latency percentile.",
        null,
        "`le` holds bucket boundaries in seconds, not quantile values."
      ],
      "pca-21": [
        "Series match on identical label sets including `code`, so each 5xx series is divided by itself and returns 1.",
        "`count` counts series, not requests.",
        "Status codes are values like `500` or `503`, not `5xx`, and this returns a count, not a ratio.",
        null
      ],
      "pca-22": [
        "Addition changes the value by 1, copies no labels, and fails because several containers share one Pod (many-to-one needs `group_left`).",
        null,
        "`and` filters series but does not add labels from the right side.",
        "Matching on `node` alone does not align Pods, and the left side would be the info metric."
      ],
      "pca-23": [
        null,
        "A one-week range averages the whole week, not the same moment last week.",
        "You cannot subtract a duration from a vector.",
        "`@` takes a Unix timestamp such as `@ 1700000000`, not a duration."
      ],
      "pca-24": [
        "This compares bytes with seconds and does not involve a trend.",
        "A negative slope alone does not tell whether the disk fills within 4 hours.",
        "`rate` is for counters; available bytes is a gauge.",
        null
      ],
      "pca-25": [
        "With no series present, the comparison returns nothing.",
        null,
        "`count` of an empty vector is also empty, not zero.",
        "`unless up` removes every series, so it always returns nothing."
      ],
      "pca-26": [
        "Samples are float64, and the deviation is far larger than rounding error.",
        "Resets are handled by adding back the pre-reset value, not subtracting fractions.",
        null,
        "Scrape timeouts do not affect the arithmetic; the result is already valid."
      ],
      "pca-27": [
        "Averaging percentiles is mathematically wrong; summary quantiles do not aggregate.",
        "A gauge of the latest duration loses all distribution information.",
        "Total time divided by replicas gives a mean at best, not a percentile.",
        null
      ],
      "pca-28": [
        null,
        "CamelCase and milliseconds both violate conventions.",
        "`_total` is reserved for counters and milliseconds are not a base unit.",
        "Dots are not valid characters in metric names."
      ],
      "pca-29": [
        "The Pushgateway is for batch jobs and loses the `up` health signal for the database.",
        null,
        "Modifying vendor binaries is impractical and unsupported.",
        "Recording rules query existing metrics; they cannot read log files."
      ],
      "pca-30": [
        "Use a Prometheus inside the network, or remote_write, rather than pushing a long-running service.",
        "Per-instance pushes create stale series that never expire and a single bottleneck.",
        null,
        "Push-based discovery breaks `up` semantics and is not supported."
      ],
      "pca-31": [
        null,
        "Pushing per-host data to the Pushgateway loses host labels and leaves stale series.",
        "Configuration labels are static and cannot carry changing measured values.",
        "Recording rules evaluate PromQL; they cannot execute scripts."
      ],
      "pca-32": [
        "Default buckets are already in seconds.",
        "There is no five-bucket limit; buckets cost one series each.",
        "Each bucket adds a series; it does not reduce cardinality.",
        null
      ],
      "pca-33": [
        "Parentheses and `=` are not part of the exposition syntax.",
        null,
        "JSON is not the Prometheus text exposition format.",
        "Colon-separated label encoding is not valid exposition syntax."
      ],
      "pca-34": [
        "Alerts are only sent once the `for` duration has elapsed.",
        null,
        "The expression is evaluated every interval; `for` delays firing, not evaluation.",
        "Resolved applies to alerts that fired and then cleared."
      ],
      "pca-35": [
        "`group_wait` delays the first notification of a new group.",
        "`group_interval` governs notifications when the group content changes.",
        null,
        "`resolve_timeout` sets when alerts without end time are considered resolved."
      ],
      "pca-36": [
        null,
        "Manual silences depend on someone reacting quickly during an outage.",
        "Changing severities affects alerts even when the cluster is healthy.",
        "Delaying all notifications slows down every incident, not just this one."
      ],
      "pca-37": [
        "Editing rules is error-prone and may leave monitoring disabled after the window.",
        "Stopping Alertmanager mutes every alert from every team.",
        "Permanent inhibition would hide real database incidents outside maintenance.",
        null
      ],
      "pca-38": [
        "Alertmanager does not scrape Prometheus; Prometheus pushes alerts to it.",
        null,
        "Forwarding through a webhook adds a fragile custom component.",
        "Group labels affect grouping, not receiver selection."
      ],
      "pca-39": [
        "A shorter scrape interval creates more samples, making queries heavier.",
        "Alerting rules do not provide data to dashboards in a reusable form.",
        null,
        "Allowing more concurrency only increases load on an already busy server."
      ],
      "pca-40": [
        "Single errors are expected within the budget and would cause constant pages.",
        null,
        "Paging only after the budget is gone is too late to protect the SLO.",
        "CPU is a cause, not a user-facing symptom of the SLO."
      ]
    },
    "glossary": [
      { "term": "SLI / SLO", "cat": "Observability", "d": 1, "def": "An SLI is a ratio of good to valid events; an SLO is the target for that ratio over a time window.", "tip": "Error budget = (1 - SLO) × window." },
      { "term": "Cardinality", "cat": "Observability", "d": 1, "def": "Number of unique time series, determined by every combination of label values.", "tip": "Never use unbounded values such as user IDs as labels." },
      { "term": "RED / USE", "cat": "Observability", "d": 1, "def": "RED (Rate, Errors, Duration) for services; USE (Utilization, Saturation, Errors) for resources.", "tip": "Combine both to connect user symptoms with resource causes." },
      { "term": "up", "cat": "Fundamentals", "d": 2, "def": "Synthetic metric set to 1 when a scrape succeeds and 0 when it fails.", "tip": "Use `absent(up{job=...})` to detect targets that vanished entirely." },
      { "term": "relabel_configs", "cat": "Fundamentals", "d": 2, "def": "Rules applied to discovered targets before scraping, using `__meta_*` labels.", "tip": "Use `keep`/`drop` to select targets and `replace` to set `__address__`." },
      { "term": "metric_relabel_configs", "cat": "Fundamentals", "d": 2, "def": "Rules applied to scraped samples before ingestion.", "tip": "The right place to drop expensive metrics by `__name__`." },
      { "term": "remote_write", "cat": "Fundamentals", "d": 2, "def": "Streams samples to an external storage system such as Thanos, Cortex or Mimir.", "tip": "The standard answer for long-term retention and global views." },
      { "term": "rate()", "cat": "PromQL", "d": 3, "def": "Per-second average increase of a counter over a range, handling resets.", "tip": "Rate first, then aggregate; use a range of at least four scrape intervals." },
      { "term": "histogram_quantile()", "cat": "PromQL", "d": 3, "def": "Estimates a quantile from cumulative histogram buckets.", "tip": "Keep the `le` label when aggregating: `sum by (le) (rate(..._bucket[5m]))`." },
      { "term": "group_left", "cat": "PromQL", "d": 3, "def": "Modifier for many-to-one vector matching that can copy labels from the one side.", "tip": "Common with info metrics like `kube_pod_info`." },
      { "term": "absent()", "cat": "PromQL", "d": 3, "def": "Returns a 1-valued series when the given selector matches no series.", "tip": "Alerts on missing data that comparisons cannot detect." },
      { "term": "Histogram", "cat": "Instrumentation", "d": 4, "def": "Metric type with cumulative `_bucket{le}` counters plus `_sum` and `_count`.", "tip": "Aggregatable across instances, unlike Summary quantiles." },
      { "term": "Pushgateway", "cat": "Instrumentation", "d": 4, "def": "Intermediary that stores metrics pushed by short-lived batch jobs for Prometheus to scrape.", "tip": "Not for long-running services; series never expire automatically." },
      { "term": "Textfile Collector", "cat": "Instrumentation", "d": 4, "def": "node_exporter collector that exposes metrics from `*.prom` files in a directory.", "tip": "Ideal for cron jobs and scripts on hosts." },
      { "term": "for (alert rule)", "cat": "Alerting", "d": 5, "def": "Duration a condition must hold before an alert moves from pending to firing.", "tip": "Pending alerts are not sent to Alertmanager." },
      { "term": "Inhibition", "cat": "Alerting", "d": 5, "def": "Alertmanager feature that mutes target alerts while a matching source alert fires.", "tip": "Use `equal` labels to scope it, e.g. the same `cluster`." },
      { "term": "repeat_interval", "cat": "Alerting", "d": 5, "def": "How long Alertmanager waits before re-sending a notification for an unchanged group.", "tip": "Differs from `group_wait` (first send) and `group_interval` (group changes)." },
      { "term": "Burn Rate", "cat": "Alerting", "d": 5, "def": "Speed at which an SLO error budget is being consumed relative to the allowed rate.", "tip": "14.4× over 1h and 5m is a common paging threshold for 99.9% / 30d." }
    ]
  };
})(window);
