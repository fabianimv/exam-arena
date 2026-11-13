/* =========================================================================
   data/databricks-de/exam.js — Databricks · Data Engineer Associate (English)
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["databricks-de"] = {
    "id": "databricks-de",
    "appId": "databricks-de",
    "provider": "Databricks",
    "badge": "Databricks · Data Eng",
    "icon": "🧱",
    "color": "#e02424",
    "featured": true,
    "title": "Databricks · Data Engineer Associate",
    "subtitle": "Lakehouse, Delta Lake, Medallion Architecture, Auto Loader, Workflows, and Unity Catalog",
    "passingScore": 70,
    "domains": {
      "1": "Databricks Lakehouse Platform (24%)",
      "2": "ELT with Spark SQL and Python (29%)",
      "3": "Incremental Processing and DLT (22%)",
      "4": "Production Pipelines and Workflows (16%)",
      "5": "Data Governance with Unity Catalog (9%)"
    },
    "shortDomains": {
      "1": "Lakehouse & Delta",
      "2": "ELT & Spark",
      "3": "Streaming & DLT",
      "4": "Workflows",
      "5": "Unity Catalog"
    },
    "topics": [
      {
        "id": "dbd-t-1-1",
        "d": 1,
        "title": "1.1 · Lakehouse Architecture and the Medallion Model (Bronze, Silver, Gold)",
        "html": "\n<h4>Lakehouse Fundamentals: Convergence of Data Lake and Data Warehouse</h4>\n<p>The <b>Databricks Lakehouse</b> paradigm eliminates traditional data silos by unifying the scalability and low cost of cloud object storage (AWS S3, Azure ADLS Gen2, GCP Cloud Storage) with the reliability, performance, and governance guarantees of an enterprise Data Warehouse. It is built on open formats such as <b>Apache Parquet</b> combined with an ACID transactional metadata layer provided by <b>Delta Lake</b>.</p>\n<ul>\n  <li><b>Separation of compute and storage:</b> Allows the compute infrastructure to scale elastically and independently of the volume of stored data, provisioning ephemeral clusters on demand.</li>\n  <li><b>Open, standard storage:</b> Avoids vendor lock-in by keeping the physical data in standardized Parquet files accessible through multiple engines.</li>\n  <li><b>Unified workload support:</b> Enables simultaneous Business Intelligence (BI), analytical SQL, real-time streaming, and Machine Learning on a single physical copy of the data.</li>\n</ul>\n\n<h4>The Medallion Architecture (Bronze &rarr; Silver &rarr; Gold)</h4>\n<p>The Medallion design structures the progressive refinement of data across three logical layers to ensure quality and governance from ingestion to analytical consumption:</p>\n<table class=\"keytable\">\n<tr><th>Layer</th><th>Technical Purpose</th><th>Key Transformations</th><th>Main Consumers</th></tr>\n<tr><td><b>Bronze (Raw)</b></td><td>Append-only landing zone for raw data coming from source systems (APIs, logs, OLTP databases).</td><td>Preservation of the original format or raw JSON, addition of ingestion metadata (<code>_rescued_data</code>, load timestamp, source file).</td><td>Data Engineers, reprocessing pipelines, and technical auditing.</td></tr>\n<tr><td><b>Silver (Curated)</b></td><td>Clean, conformed, and standardized enterprise view; single source of truth for business entities.</td><td>Filtering of critical nulls, deduplication, strict typing, enrichment with reference joins, and normalization.</td><td>Data Engineers, Data Scientists for exploration and feature engineering.</td></tr>\n<tr><td><b>Gold (Business)</b></td><td>High-performance analytical consumption layer with aggregated data modeled to business needs.</td><td>Time-based aggregations, KPI metrics, dimensional schemas (star / snowflake), and fact tables.</td><td>BI Analysts, executive dashboards, operational applications, and production ML models.</td></tr>\n</table>\n\n<div class=\"tip\"><b>Best Practices in the Bronze Layer:</b> Never apply business cleansing transformations or column filtering in the Bronze layer. The primary goal of Bronze is to act as a faithful, immutable replica of the source so that the entire history can be reprocessed when logic changes, without having to extract the data again from the transactional systems.</div>\n"
      },
      {
        "id": "dbd-t-1-2",
        "d": 1,
        "title": "1.2 · Delta Lake Internals: ACID, _delta_log, Time Travel, VACUUM, and Liquid Clustering",
        "html": "\n<h4>Delta Lake Internal Anatomy: The Transaction Log (_delta_log)</h4>\n<p>Delta Lake implements ACID transactions on object storage through an ordered, deterministic transaction log located in the <code>_delta_log/</code> subdirectory at the root of each table:</p>\n<ul>\n  <li><b>JSON Commit Files:</b> Each operation (insert, update, delete) generates an atomic sequential JSON file (<code>000000.json</code>, <code>000001.json</code>) containing actions that add (<code>add</code>) and logically remove (<code>remove</code>) Parquet files, along with column statistics (minimums, maximums, null counts).</li>\n  <li><b>Parquet Checkpoints:</b> Every 10 transactions (by default), Delta Lake compacts the accumulated state into a <code>.checkpoint.parquet</code> file (e.g., <code>000010.checkpoint.parquet</code>), avoiding scanning thousands of JSON files to reconstruct the current state.</li>\n  <li><b>Optimistic Concurrency Control (OCC):</b> Writers assume there will be no collisions; if two transactions modify the same files simultaneously, Delta checks whether the conflicts are reconcilable or fails the second one with <code>ConcurrentModificationException</code> to guarantee serializability.</li>\n</ul>\n\n<h4>Time Travel and Historical Restore</h4>\n<p>Thanks to the immutable commit log, Delta Lake allows querying previous versions of the table without physically duplicating the underlying files:</p>\n<ul>\n  <li><b>SQL syntax:</b> <code>SELECT * FROM my_table VERSION AS OF 15;</code> or <code>SELECT * FROM my_table TIMESTAMP AS OF '2024-01-15 10:00:00';</code>.</li>\n  <li><b>Restore:</b> <code>RESTORE TABLE my_table TO VERSION AS OF 12;</code> creates a new commit that returns the table to the exact state of that version.</li>\n</ul>\n\n<h4>Physical Maintenance: OPTIMIZE, Liquid Clustering, and VACUUM</h4>\n<table class=\"keytable\">\n<tr><th>Command / Technique</th><th>Function and Internal Mechanism</th><th>Operational Impact</th></tr>\n<tr><td><b>OPTIMIZE (Bin-packing)</b></td><td>Compacts collections of small files into uniform ~1 GB files through atomic rewrite operations.</td><td>Dramatically speeds up reads by reducing the file-open overhead on cloud storage.</td></tr>\n<tr><td><b>Liquid Clustering (CLUSTER BY)</b></td><td>Replaces rigid physical partitioning and <code>Z-ORDER</code>. Organizes data in a multidimensional, dynamic way based on commonly queried columns.</td><td>Avoids over-partitioning problems and allows changing the clustering keys without rewriting the entire table.</td></tr>\n<tr><td><b>VACUUM</b></td><td>Physically removes from storage the Parquet files that were marked as removed (<code>remove</code>) and exceed the retention threshold.</td><td>Frees up disk space. Its default retention is <b>7 days</b>; running it with zero retention breaks Time Travel and risks corrupting active concurrent reads.</td></tr>\n</table>\n\n<div class=\"tip\"><b>Danger of VACUUM with reduced retention:</b> The property <code>spark.databricks.delta.vacuum.retentionCheck.enabled = false</code> allows running <code>VACUUM</code> with less than 168 hours (7 days). It is strongly discouraged in production environments, since any long-running query that is reading old Parquet files will fail if they are purged while the query is still running.</div>\n"
      },
      {
        "id": "dbd-t-2-1",
        "d": 2,
        "title": "2.1 · Ingestion and Extraction with Spark SQL, Higher-Order Functions, and JSON",
        "html": "\n<h4>Direct File Reads and Ingestion with Spark SQL</h4>\n<p>Spark SQL allows interacting directly with files stored in cloud storage using ANSI SQL syntax or the DataFrame API:</p>\n<ul>\n  <li><b>Direct file queries:</b> <code>SELECT * FROM parquet.`/path/directory/`</code> or <code>SELECT * FROM json.`/path/logs/`</code>.</li>\n  <li><b>COPY INTO command:</b> Declarative, idempotent SQL statement recommended for batch ingestion of millions of new files into existing Delta tables:\n    <pre><code>COPY INTO delta.`/path/delta_table`\nFROM `/path/landing/`\nFILEFORMAT = CSV\nFORMAT_OPTIONS ('header' = 'true', 'inferSchema' = 'true')\nCOPY_OPTIONS ('mergeSchema' = 'true');</code></pre>\n  </li>\n</ul>\n\n<h4>Handling Semi-Structured Data and JSON Parsing</h4>\n<p>In modern pipelines, events land as untyped JSON strings. Spark SQL offers optimized native functions:</p>\n<ul>\n  <li><b>from_json(col, schema):</b> Deserializes a JSON text column into a strongly typed structure (<code>STRUCT</code> or <code>ARRAY</code>) according to the provided schema.</li>\n  <li><b>to_json(col):</b> Converts a complex structure (<code>STRUCT</code> or <code>MAP</code>) into a standardized JSON string.</li>\n  <li><b>schema_of_json(json_str):</b> Automatically infers the schema signature from a representative sample of JSON text.</li>\n  <li><b>Navigation operators:</b> Attribute access using dot notation (<code>customer.address.city</code>) or the colon operator (<code>payload:id::int</code>).</li>\n</ul>\n\n<h4>Higher-Order Functions on Arrays</h4>\n<p>They allow manipulating collections and nested arrays directly in SQL without resorting to costly unnesting operations (<code>explode</code>) followed by groupings:</p>\n<table class=\"keytable\">\n<tr><th>Function</th><th>Signature / Example</th><th>Purpose</th></tr>\n<tr><td><b>TRANSFORM</b></td><td><code>TRANSFORM(items, i -> i.price * 1.21)</code></td><td>Applies a transformation expression element by element, returning a new transformed array.</td></tr>\n<tr><td><b>FILTER</b></td><td><code>FILTER(transactions, t -> t.amount &gt; 100)</code></td><td>Filters the array elements, keeping only those that satisfy the boolean predicate.</td></tr>\n<tr><td><b>EXISTS</b></td><td><code>EXISTS(tags, tag -> tag = 'urgent')</code></td><td>Evaluates whether at least one array element satisfies the boolean condition (returns true/false).</td></tr>\n<tr><td><b>AGGREGATE</b></td><td><code>AGGREGATE(lines, 0.0, (acc, x) -> acc + x.subtotal)</code></td><td>Reduces the array to a single accumulated value using an accumulator function and an initial value.</td></tr>\n</table>\n\n<div class=\"tip\"><b>Higher-Order Function performance:</b> Using <code>TRANSFORM</code> and <code>FILTER</code> is dramatically more efficient than breaking an array apart with <code>explode()</code> and re-aggregating it with <code>collect_list()</code>, since it avoids massive data shuffles across the cluster network.</div>\n"
      },
      {
        "id": "dbd-t-2-2",
        "d": 2,
        "title": "2.2 · Advanced Manipulation, Deduplication, MERGE INTO, and Window Functions",
        "html": "\n<h4>Data Deduplication in ELT Pipelines</h4>\n<p>Ingestion from distributed sources often produces duplicate records due to network retries with at-least-once semantics. There are two main deduplication approaches:</p>\n<ul>\n  <li><b>dropDuplicates([cols]):</b> Fast method in the PySpark DataFrame API that keeps an arbitrary row for each unique key identified.</li>\n  <li><b>Window Function Deduplication:</b> Deterministic SQL approach when you need to keep the most recent record according to a timestamp:\n    <pre><code>WITH ranked_rows AS (\n  SELECT *,\n    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY updated_at DESC) AS ranking\n  FROM raw_events\n)\nSELECT * EXCEPT(ranking) FROM ranked_rows WHERE ranking = 1;</code></pre>\n  </li>\n</ul>\n\n<h4>Atomic Upserts with MERGE INTO</h4>\n<p>Delta Lake provides full native support for atomic <code>MERGE INTO</code> operations, combining inserts, updates, and deletes in a single ACID transaction:</p>\n<pre><code>MERGE INTO target_silver AS t\nUSING source_updates AS s\nON t.order_id = s.order_id\nWHEN MATCHED AND s.is_canceled = true THEN\n  DELETE\nWHEN MATCHED THEN\n  UPDATE SET t.status = s.status, t.amount = s.amount, t.updated_at = current_timestamp()\nWHEN NOT MATCHED THEN\n  INSERT (order_id, status, amount, created_at, updated_at)\n  VALUES (s.order_id, s.status, s.amount, s.event_date, current_timestamp());</code></pre>\n\n<h4>UDF (User-Defined Function) Types and Performance</h4>\n<table class=\"keytable\">\n<tr><th>UDF Type</th><th>Language / Environment</th><th>Performance</th><th>Optimal Use Case</th></tr>\n<tr><td><b>SQL UDF</b></td><td>Native ANSI SQL</td><td><b>Maximum</b>: Optimized by Catalyst and accelerated by the Photon engine.</td><td>Standard business logic, mathematical calculations, string transformations.</td></tr>\n<tr><td><b>Pandas UDF (Vectorized)</b></td><td>Python + PyArrow</td><td><b>High</b>: Processes entire batches in columnar memory via Apache Arrow.</td><td>Complex statistical transformations, batch ML model inference.</td></tr>\n<tr><td><b>Standard Python UDF</b></td><td>Pure Python (row-by-row)</td><td><b>Low</b>: Incurs massive IPC/Py4J serialization overhead between the JVM and the Python runtime.</td><td>Discouraged except for legacy libraries without columnar support.</td></tr>\n</table>\n\n<div class=\"tip\"><b>Managed vs External Tables:</b> When running <code>DROP TABLE</code> on a <b>Managed</b> table, Databricks removes both the metadata definition in the catalog and the underlying physical Parquet files. On an <b>External</b> table (defined with a <code>LOCATION</code> clause), <code>DROP TABLE</code> only removes the metadata, leaving the data files intact in cloud storage.</div>\n"
      },
      {
        "id": "dbd-t-3-1",
        "d": 3,
        "title": "3.1 · Structured Streaming, Auto Loader (cloudFiles), and Checkpointing",
        "html": "\n<h4>The Structured Streaming Paradigm</h4>\n<p>Spark Structured Streaming processes continuous streams by treating data sources as <b>unbounded tables</b> to which new records are continuously appended. The engine internally divides processing into low-latency micro-batches or continuous streaming.</p>\n\n<h4>Output Modes</h4>\n<table class=\"keytable\">\n<tr><th>Output Mode</th><th>Behavior at Each Trigger</th><th>Restrictions and Use Cases</th></tr>\n<tr><td><b>Append</b> (default)</td><td>Only the new records that arrived in the current micro-batch are emitted to the sink.</td><td>Required for incremental ELT pipelines. In queries with time-based aggregations it requires defining a Watermark.</td></tr>\n<tr><td><b>Complete</b></td><td>The entire accumulated results table is rewritten and emitted in each micro-batch.</td><td>Mandatory for non-windowed aggregations or global count metrics; not compatible with direct append-only sinks.</td></tr>\n<tr><td><b>Update</b></td><td>Only the rows whose aggregated state has changed since the previous trigger are written to the sink.</td><td>Ideal for maintaining live state tables or updating external dashboards.</td></tr>\n</table>\n\n<h4>Auto Loader (format(\"cloudFiles\")): Scalable Incremental Ingestion</h4>\n<p><b>Auto Loader</b> is Databricks' proprietary technology for incrementally detecting and ingesting millions of new files deposited in cloud object storage:</p>\n<ul>\n  <li><b>Directory Listing mode:</b> Periodically scans the directory; optimal for paths with fewer than 1 million files and moderate volume.</li>\n  <li><b>File Notification mode:</b> Uses cloud queue and event services (AWS SNS/SQS, Azure Event Grid, GCP Pub/Sub) to receive notices of new files without scanning massive folders.</li>\n  <li><b>Schema Inference and Evolution:</b>\n    <pre><code>spark.readStream.format(\"cloudFiles\")\n  .option(\"cloudFiles.format\", \"json\")\n  .option(\"cloudFiles.schemaLocation\", \"/checkpoints/schema_dir\")\n  .option(\"cloudFiles.schemaEvolutionMode\", \"addNewColumns\")\n  .load(\"/mnt/raw_landing/\")</code></pre>\n  </li>\n  <li><b>_rescued_data column:</b> Captures any unexpected column, corrupt data, or incompatible type in a structured JSON field without breaking ingestion or dropping records.</li>\n</ul>\n\n<h4>Checkpointing and Watermarks</h4>\n<ul>\n  <li><b>checkpointLocation:</b> Mandatory persistent directory in cloud storage where the engine saves the log of offsets read, commits, and aggregation state. Ensures recovery after failures and <b>exactly-once</b> semantics.</li>\n  <li><b>withWatermark(col, delayThreshold):</b> Sets the maximum allowable time threshold for late events (e.g., <code>withWatermark(\"event_time\", \"10 minutes\")</code>). Allows the engine to discard old data and purge the in-memory State Store to prevent memory leaks (OOM).</li>\n</ul>\n"
      },
      {
        "id": "dbd-t-3-2",
        "d": 3,
        "title": "3.2 · Delta Live Tables (DLT): Expectations, Materialized Views, and Streaming Tables",
        "html": "\n<h4>Declarative Architecture of Delta Live Tables (DLT)</h4>\n<p><b>Delta Live Tables (DLT)</b> is Databricks' declarative framework for building and orchestrating reliable data pipelines in SQL or Python. The developer defines the desired transformations and DLT automatically infers the dependency graph (DAG), manages the cluster infrastructure, implements checkpoints, and captures quality metrics.</p>\n\n<h4>DLT Datasets: Streaming Tables vs Materialized Views</h4>\n<table class=\"keytable\">\n<tr><th>Object Type</th><th>Declarative Syntax (SQL)</th><th>Processing Mechanism</th><th>Recommended Use Case</th></tr>\n<tr><td><b>Streaming Table</b></td><td><code>CREATE OR REFRESH STREAMING TABLE silver_events AS SELECT * FROM STREAM(raw_source)</code></td><td>Strictly incremental (append-only) processing; only processes data that has never been read before.</td><td>Raw ingestion from Auto Loader, Kafka queue messages, high-volume time-based events.</td></tr>\n<tr><td><b>Materialized View</b></td><td><code>CREATE OR REFRESH MATERIALIZED VIEW gold_kpis AS SELECT date, sum(total) FROM silver_events GROUP BY date</code></td><td>Computes and persists results according to the latest state of the source tables, handling updates automatically.</td><td>Complex business aggregations, deduplication, dimensional joins, and the Gold layer.</td></tr>\n</table>\n\n<h4>Data Quality Expectations</h4>\n<p>DLT allows defining declarative integrity constraints applied in flight while pipelines run:</p>\n<table class=\"keytable\">\n<tr><th>Expectation Clause</th><th>Action on Invalid Record</th><th>Pipeline Behavior</th></tr>\n<tr><td><code>CONSTRAINT v_email EXPECT (email IS NOT NULL)</code></td><td>Keeps the record in the target table and emits a metric alert in the Event Log.</td><td>The pipeline continues uninterrupted; ideal for preventive quality monitoring.</td></tr>\n<tr><td><code>EXPECT (edad &gt;= 18) ON VIOLATION DROP ROW</code></td><td>Drops the invalid row from the target table, recording the count of dropped rows.</td><td>The pipeline continues; ensures that only conforming data advances to Silver/Gold layers.</td></tr>\n<tr><td><code>EXPECT (id IS NOT NULL) ON VIOLATION FAIL UPDATE</code></td><td>Immediately stops execution and marks the pipeline in a fatal error state.</td><td>Halts the job immediately; mandatory for primary keys or critical financial data.</td></tr>\n</table>\n\n<div class=\"tip\"><b>Triggered vs Continuous mode in DLT:</b> In <b>Continuous</b> mode, clusters remain active to process data with latency of seconds. In <b>Triggered</b> mode, the pipeline processes all accumulated pending data and stops, substantially optimizing DBU consumption for hourly or daily ingestion.</div>\n"
      },
      {
        "id": "dbd-t-4-1",
        "d": 4,
        "title": "4.1 · Databricks Workflows: Cluster Types, Task Orchestration, and Alerts",
        "html": "\n<h4>Databricks Workflows: End-to-End Task Orchestration (Multi-Task Jobs)</h4>\n<p><b>Databricks Workflows</b> is the fully managed native orchestrator that lets you build workflows based on directed acyclic graphs (DAGs). It supports heterogeneous tasks including Notebooks, Python scripts, SQL queries/dashboards, DLT pipelines, and dbt models.</p>\n\n<h4>Compute Types for Workflows: Job Clusters vs All-Purpose Clusters</h4>\n<table class=\"keytable\">\n<tr><th>Feature</th><th>Job Cluster (Automated)</th><th>All-Purpose Cluster (Interactive)</th></tr>\n<tr><td><b>Lifecycle</b></td><td>Ephemeral: Databricks provisions the cluster when the job starts and destroys it immediately when the run finishes.</td><td>Persistent: Stays running or idle according to the auto-termination policy.</td></tr>\n<tr><td><b>DBU Cost</b></td><td><b>Reduced rate (~50% to 60% savings)</b> compared to All-Purpose clusters.</td><td>Full standard interactive compute rate.</td></tr>\n<tr><td><b>Isolation</b></td><td>Full isolation of resources and libraries; prevents interference between concurrent jobs.</td><td>Shared among multiple users or notebooks under development.</td></tr>\n<tr><td><b>Recommendation</b></td><td><b>Mandatory standard for production workloads and scheduled jobs.</b></td><td>Used exclusively for interactive development and exploratory analysis.</td></tr>\n</table>\n\n<h4>Passing Parameters Between Tasks with TaskValues</h4>\n<p>Databricks allows transferring metadata and dynamic values between nodes of a DAG using the <code>taskValues</code> utility:</p>\n<ul>\n  <li><b>Sender (Upstream task):</b> <code>dbutils.jobs.taskValues.set(key = \"batch_count\", value = 14500)</code></li>\n  <li><b>Receiver (Downstream task):</b> <code>total = dbutils.jobs.taskValues.get(taskKey = \"tarea_ingesta\", key = \"batch_count\", default = 0)</code></li>\n</ul>\n\n<h4>Resilience: Repair and Rerun</h4>\n<p>When a multi-task job fails in one of its intermediate branches, the <b>Repair and Rerun</b> feature allows re-running only the failed tasks and their downstream dependencies, without spending compute again on tasks that already completed successfully in the previous run.</p>\n\n<div class=\"tip\"><b>Retry Policies and Alerts:</b> Each task in a Workflow lets you configure automatic retries (<code>retries</code>) with minimum wait intervals (<code>min_retry_interval_millis</code>) and event-driven notifications (success, failure, duration exceeded) sent to emails or corporate webhooks (Slack, PagerDuty).</div>\n"
      },
      {
        "id": "dbd-t-4-2",
        "d": 4,
        "title": "4.2 · Lifecycle: Git Repos, CI/CD, Cluster Policies, and Cost Governance",
        "html": "\n<h4>Version Control Integration: Databricks Repos</h4>\n<p><b>Databricks Repos</b> provides enterprise-grade bidirectional integration with the main Git providers (GitHub, GitLab, Bitbucket, Azure DevOps). It allows engineering teams to:</p>\n<ul>\n  <li>Organize code into development branches (feature branches) and perform commit, push, pull, and merge operations directly from the workspace.</li>\n  <li>Import and structure modular code in reusable pure Python packages (<code>.py</code>) using standard <code>import</code> statements within notebooks.</li>\n  <li>Ensure that production jobs run pointing to protected stable branches (e.g., <code>main</code> or release tags).</li>\n</ul>\n\n<h4>CI/CD Automation with Databricks Asset Bundles (DABs)</h4>\n<p><b>Databricks Asset Bundles (DABs)</b> lets you manage data projects as infrastructure as code (IaC). Using declarative YAML files (<code>databricks.yml</code>), developers define DLT pipelines, Workflows, permissions, and configurations, deploying them programmatically across development, test, and production environments with the Databricks CLI.</p>\n\n<h4>Cluster Policies and Cost Control</h4>\n<p>Cluster Policies enforce strict rules on what types of resources data engineers can provision in the workspace:</p>\n<ul>\n  <li><b>Instance Type Limitation:</b> Restricts the allowed virtual machine families (e.g., prohibiting costly GPUs in analytics notebooks).</li>\n  <li><b>Enforced Auto-Termination:</b> Requires configuring a maximum idle time (e.g., 20 minutes) to automatically shut down forgotten clusters.</li>\n  <li><b>Mandatory Tagging (Custom Tags):</b> Requires assigning tags such as <code>CostCenter</code>, <code>Project</code>, or <code>Owner</code> on each cluster to break down cloud billing.</li>\n</ul>\n\n<h4>The Photon Engine: Vectorized Acceleration in C++</h4>\n<p><b>Photon</b> is the native execution engine developed in C++ and integrated into the Databricks runtime that replaces the JVM execution engine with modern SIMD vectorized processing. Although it carries a DBU surcharge, Photon dramatically reduces processing times for heavy SQL queries, scans, and joins, frequently achieving a lower total cost of ownership (TCO).</p>\n"
      },
      {
        "id": "dbd-t-5-1",
        "d": 5,
        "title": "5.1 · Unity Catalog: 3-Level Namespace, Metastore, and External Locations",
        "html": "\n<h4>Centralized Architecture of Unity Catalog</h4>\n<p><b>Unity Catalog</b> is Databricks' comprehensive governance solution for data and artificial intelligence. Unlike traditional solutions based on a local Hive Metastore per cluster, Unity Catalog operates at the account level and provides:</p>\n<ul>\n  <li><b>Unified Regional Metastore:</b> A single centralized metadata store per geographic region that is attached to multiple Databricks workspaces, facilitating shared governance.</li>\n  <li><b>Three-Level Namespace:</b> The resolution of any data object follows the canonical hierarchy:\n    <br/><code>&lt;catalog&gt;.&lt;schema&gt;.&lt;object&gt;</code> (example: <code>corp_prod.finance.billing</code>).</li>\n</ul>\n\n<h4>Securable Objects and Secure Storage</h4>\n<table class=\"keytable\">\n<tr><th>Securable Object</th><th>Definition and Architectural Role</th><th>Governance and Permissions</th></tr>\n<tr><td><b>Storage Credential</b></td><td>Encapsulates a managed cloud identity (AWS IAM Role, Azure Managed Identity, or GCP Service Account) with read/write permissions on object storage.</td><td>Only Metastore admins can create them; avoids exposing secret keys or tokens to users.</td></tr>\n<tr><td><b>External Location</b></td><td>Associates a specific <code>Storage Credential</code> with a cloud storage URL prefix (e.g., <code>s3://my-datalake-bucket/silver/</code>).</td><td>Allows granting privileges such as <code>CREATE EXTERNAL TABLE</code> or <code>READ FILES</code> to engineers without giving them direct IAM access.</td></tr>\n<tr><td><b>Managed Storage</b></td><td>Root storage location assigned at the catalog or schema level where managed tables are automatically stored.</td><td>When a Managed Table is dropped with <code>DROP TABLE</code>, Unity Catalog automatically purges the physical files from the bucket.</td></tr>\n<tr><td><b>Volumes</b></td><td>Unity Catalog object designed to govern unstructured or semi-structured files (PDFs, images, raw CSVs, checkpoints).</td><td>Available as <b>Managed Volumes</b> or <b>External Volumes</b>, accessible via POSIX paths at <code>/Volumes/catalog/schema/volume/</code>.</td></tr>\n</table>\n\n<div class=\"tip\"><b>Resolving Objects Without a Full Prefix:</b> If the 3-level name is not specified, Databricks falls back to the catalog and schema active in the current session, configured with <code>USE CATALOG catalog;</code> and <code>USE SCHEMA schema;</code>.</div>\n"
      },
      {
        "id": "dbd-t-5-2",
        "d": 5,
        "title": "5.2 · Governance in Unity Catalog: GRANT Permissions, Dynamic Views, Filters, and Lineage",
        "html": "\n<h4>Declarative Access Control (ANSI SQL RBAC)</h4>\n<p>Unity Catalog implements a standard ANSI SQL privilege model managed through declarative statements that grant and revoke permissions on centralized account-level identities (users and groups):</p>\n<pre><code>GRANT USAGE ON CATALOG corp_prod TO `bi_analysts`;\nGRANT USAGE ON SCHEMA corp_prod.sales TO `bi_analysts`;\nGRANT SELECT ON TABLE corp_prod.sales.annual_summary TO `bi_analysts`;</code></pre>\n<p><i>Fundamental inheritance rule:</i> To access any table, a user requires the <code>USAGE</code> privilege on all higher levels of the hierarchy (both on the catalog and on the corresponding schema).</p>\n\n<h4>Granular Security: Row Filters and Column Masks</h4>\n<p>Unity Catalog lets you implement row-level security policies and dynamic column masking without duplicating physical tables:</p>\n<ul>\n  <li><b>Row Filters:</b> SQL functions that evaluate whether the current session can view a given row:\n    <pre><code>CREATE FUNCTION region_filter(region STRING)\nRETURN IF(IS_ACCOUNT_GROUP_MEMBER('global_admin') OR region = 'EMEA', true, false);\n\nALTER TABLE corp_prod.sales.orders\nSET ROW FILTER region_filter ON (region);</code></pre>\n  </li>\n  <li><b>Column Masks:</b> Obfuscate sensitive data (PII, credit cards) for unauthorized groups:\n    <pre><code>CREATE FUNCTION mask_card(number STRING)\nRETURN IF(IS_ACCOUNT_GROUP_MEMBER('financial_audit'), number, CONCAT('****-****-****-', RIGHT(number, 4)));\n\nALTER TABLE corp_prod.finance.payments\nALTER COLUMN card_number SET MASK mask_card;</code></pre>\n  </li>\n  <li><b>Dynamic Views:</b> Traditional method using built-in functions such as <code>current_user()</code> or <code>is_account_group_member()</code> within the <code>WHERE</code> clause of a standard view.</li>\n</ul>\n\n<h4>Automated Data Lineage</h4>\n<p>Unity Catalog automatically records <b>table- and column-level data lineage</b> at runtime for any query executed in Databricks, with no need for additional libraries or code instrumentation. It facilitates regulatory compliance audits (GDPR/CCPA) and visual impact analysis for schema changes.</p>\n"
      }
    ],
    "questions": [
      {
        "id": "dbd-01",
        "d": 1,
        "t": "Lakehouse Architecture vs Data Lake/Data Warehouse",
        "q": "Your financial organization stores terabytes of transactions in a cloud object Data Lake (Parquet format). The analytics team complains about inconsistent reads when ingestion pipelines update data concurrently. In addition, the audit requires deleting records under the right to be forgotten (GDPR), which forces you to manually rewrite entire partitions. What fundamental technical advantage does migrating these tables to `Delta Lake` in the Lakehouse provide to solve both problems?",
        "o": [
          "It adds an ACID transaction log (`_delta_log`) that guarantees serializable isolation for concurrent reads and enables row-level `DELETE` statements.",
          "It converts object storage into a private HDFS transactional cluster with synchronous distributed locks managed by an external highly available Apache ZooKeeper service.",
          "It automatically duplicates all files into a dedicated relational Data Warehouse cluster to process analytical queries without interacting with the open Data Lake.",
          "It delegates concurrency control and deletes to secondary indexes created in the RAM of the Databricks driver node during each interactive session."
        ],
        "a": 0,
        "e": "Delta Lake solves the lack of transactions in the traditional Data Lake through its ACID transaction log (`_delta_log`). This log guarantees consistent reads through Optimistic Concurrency Control (OCC) and snapshot isolation, allowing `DELETE`, `UPDATE`, and `MERGE INTO` operations at the record level without manually rewriting entire partitions.",
        "why": [
          null,
          "Delta Lake operates on standard cloud object storage (S3, ADLS, GCS); it does not require HDFS clusters or coordination through Apache ZooKeeper.",
          "The Lakehouse architecture processes data directly in the open Data Lake; it does not duplicate data into an external proprietary Data Warehouse.",
          "The transaction log resides in persistent storage (`_delta_log`), not in the volatile memory of the driver node."
        ]
      },
      {
        "id": "dbd-02",
        "d": 1,
        "t": "Medallion Architecture: Bronze Layer",
        "q": "A data engineer designs the ingestion pipeline for millions of JSON events generated by IoT sensors. Some sensors send unexpected additional fields due to firmware updates, and others present malformed payloads. What is the recommended design for the `Bronze` layer table in a Medallion architecture?",
        "o": [
          "Immediately filter and discard any record that does not exactly match the predefined schema to maintain database integrity.",
          "Ingest the data in append-only mode in its native format or a wide schema, capturing new or malformed fields in `_rescued_data` for auditing.",
          "Normalize the entities by applying full array unnesting and exhaustive per-sensor deduplication before persisting the records to object storage.",
          "Run cleansing and hourly aggregation transformations in the micro-batch to write dimensional fact tables directly in precomputed Gold format."
        ],
        "a": 1,
        "e": "The Bronze layer must act as a faithful, auditable historical replica of the data source (append-only). In Databricks, the best practice is to ingest the data in its original format or flexible schema using Auto Loader's `_rescued_data` column to preserve unforeseen fields or corrupt records, allowing the data to be reprocessed after any later validation failure.",
        "why": [
          "Discarding data in the Bronze layer destroys historical traceability and makes it impossible to recover information if the schema discrepancy was valid.",
          null,
          "Normalization, unnesting, and deduplication are Silver layer transformations, not part of the raw Bronze ingestion layer.",
          "Hourly aggregations and dimensional models belong to the Gold layer; applying them at initial ingestion skips the refinement and auditing phases."
        ]
      },
      {
        "id": "dbd-03",
        "d": 1,
        "t": "Medallion Architecture: Silver Layer",
        "q": "In your Lakehouse platform, the `Bronze` layer contains raw events from multiple transactional sources. The data team needs to feed predictive models and business analysts with a unified view of customers. Which set of operations properly characterizes the step from the `Bronze` layer to the `Silver` layer?",
        "o": [
          "Build exclusively final aggregation tables with precomputed monthly KPI metrics optimized for executive dashboard visualization tools.",
          "Replicate the raw files identically without validating data types, to maintain an exact mirror of the source file system of the storage provider.",
          "Clean records, strictly type columns, resolve nulls, deduplicate keys, and enrich the data to form a clean enterprise view.",
          "Apply destructive anonymization by removing all primary keys to restrict access to any user who is not a corporate cluster administrator."
        ],
        "a": 2,
        "e": "The Silver (curated) layer is the enterprise source of truth of the Lakehouse. It transforms the raw Bronze data by validating data types, removing duplicates using business keys, resolving critical null values, applying enrichment with master tables, and structuring clean entities on which to build analytics and machine learning.",
        "why": [
          "Final aggregated metrics and KPIs belong to the Gold layer; the Silver layer keeps the detailed grain of the business entities.",
          "An identical mirror without validations is the Bronze layer itself, and lacks the filtering and cleansing characteristic of Silver.",
          null,
          "Destructive anonymization of primary keys destroys the referential integrity required in Silver; security is implemented with masks and filters in Unity Catalog."
        ]
      },
      {
        "id": "dbd-04",
        "d": 1,
        "t": "Medallion Architecture: Gold Layer",
        "q": "The finance department requires a Power BI dashboard to query total daily sales by region and product category, with response times under one second. How should this use case be implemented in the `Gold` layer of the Lakehouse?",
        "o": [
          "Configure a direct continuous streaming connection to the raw JSON files of the Bronze layer to reflect sales with millisecond real-time latency.",
          "Provide an external table over unoptimized compressed CSV text files to reduce disk storage cost in the public cloud.",
          "Generate business aggregate tables, star-schema dimensional models, or materialized views optimized with `OPTIMIZE` and clustering for analytical queries.",
          "Consume uncached dynamic views that run complex joins of 15 raw tables and real-time aggregations every time the user opens the report in the BI tool."
        ],
        "a": 2,
        "e": "The Gold layer is designed for high-performance analytical consumption. It stores business-optimized data models (star/snowflake schemas, pre-aggregated fact and dimension tables), compacted with `OPTIMIZE` and organized to minimize data scans, guaranteeing sub-second responses in dashboards and reports.",
        "why": [
          "Querying raw Bronze JSON files in real time would generate massive load and unacceptable latencies for a concurrent BI dashboard.",
          "Unoptimized CSV files lack data skipping statistics (`data skipping`), resulting in slow reads and compute overhead.",
          null,
          "Running joins of 15 raw tables on every query generates very high latencies and wastes resources compared with a precomputed Gold table."
        ]
      },
      {
        "id": "dbd-05",
        "d": 1,
        "t": "Delta Lake Internals: _delta_log and Concurrency",
        "q": "Two Spark processes write simultaneously to the same Delta table. Process A updates customer records in the 'Norte' region and Process B inserts new purchases from the 'Sur' region. How does `Delta Lake` coordinate these concurrent writes without causing heavy locking or inconsistent reads?",
        "o": [
          "It uses Optimistic Concurrency Control (OCC) by checking the `_delta_log` transaction log; since they do not collide on the same files, it validates both commits.",
          "It locks the entire table using a distributed in-memory semaphore, pausing Process B until Process A finishes its commit and releases the execution thread.",
          "It writes the data of both processes to temporary Parquet files and delegates conflict resolution to a nightly asynchronous database reconciliation cron job.",
          "It systematically rejects any concurrent write by throwing a `TableAlreadyLockedException` exception upon detecting two active jobs on the compute cluster."
        ],
        "a": 0,
        "e": "Delta Lake uses Optimistic Concurrency Control (OCC). Each transaction records its operations assuming there will be no conflicts. Before performing the atomic commit to the `_delta_log` (using atomic operations such as `put-if-absent`), Delta checks whether another transaction has modified the same files. Since Process A and Process B operate on different regions and files, both commits succeed without global locks.",
        "why": [
          null,
          "Delta Lake does not use heavy full-table locks (pessimistic locking); its OCC model allows concurrent writes if there is no file conflict.",
          "Delta Lake guarantees immediate transactional consistency on each commit; it does not defer consistency to nightly asynchronous processes.",
          "Delta does not systematically reject concurrent transactions; it only aborts if there is a real modification conflict on the same data files."
        ]
      },
      {
        "id": "dbd-06",
        "d": 1,
        "t": "Delta Lake: Time Travel and Recovery",
        "q": "During a manual production update, an analyst accidentally runs an `UPDATE` without a `WHERE` clause, corrupting the price column across the entire `sales_silver` table. The table has an intact transaction history going back 30 days. What is the fastest and safest way to restore the table to the exact state prior to the error?",
        "o": [
          "Atomically restore the table by running `RESTORE TABLE sales_silver TO VERSION AS OF <previous_version>;`.",
          "Download the latest manual database backup from a zip file and overwrite the storage bucket folder using terminal bash commands.",
          "Create a new Databricks cluster and run a full re-ingestion of all historical files from the company's relational source system.",
          "Run a standard relational database `ROLLBACK TRANSACTION;` command, assuming the interactive session is still open in the current notebook."
        ],
        "a": 0,
        "e": "Delta Lake provides the `RESTORE TABLE <table> TO VERSION AS OF <version>` or `TIMESTAMP AS OF <timestamp>` statement. This statement generates a new commit in the `_delta_log` that points to the valid Parquet files of the previous version, reverting the corruption instantly and atomically without re-ingesting data or moving physical files.",
        "why": [
          null,
          "Manually overwriting files in the bucket corrupts the `_delta_log` transaction log and can cause severe inconsistencies in the catalog.",
          "Re-ingesting the entire history takes hours or days of unnecessary compute, whereas `RESTORE TABLE` completes in a few seconds using metadata.",
          "Spark SQL and Delta Lake do not use session-based transactions with `ROLLBACK TRANSACTION`; transactions are committed atomically with each command."
        ]
      },
      {
        "id": "dbd-07",
        "d": 1,
        "t": "Delta Lake: Compaction with OPTIMIZE",
        "q": "A streaming pipeline writes thousands of small Parquet files (~500 KB each) per hour to an orders Delta table. As a result, analytical queries take several minutes because of the overhead of listing and opening files in object storage. Which maintenance action solves this small-file problem?",
        "o": [
          "Run the command `VACUUM orders RETAIN 0 HOURS;` to immediately purge all files smaller than 1 MB from cloud object storage.",
          "Run the command `OPTIMIZE orders;` to automatically compact collections of small files into larger files of approximately 1 GB.",
          "Physically repartition the directory in the operating system using a Python script, dividing the total rows across 100 file system folders.",
          "Change the storage format from Delta to flat CSV to avoid columnar metadata packaging in reads by the company's business analysts."
        ],
        "a": 1,
        "e": "The `OPTIMIZE` command performs automatic compaction (bin-packing), gathering collections of small files into larger, more efficient Parquet files (up to ~1 GB). This drastically reduces metadata calls to object storage (S3/ADLS/GCS) and speeds up reading for analytical queries.",
        "why": [
          "`VACUUM` does not compact files; it purges logically deleted files. Running it with zero retention can also corrupt in-flight transactions.",
          null,
          "Manually manipulating files in storage alters the physical structure without updating the `_delta_log`, corrupting the Delta table.",
          "Migrating to CSV would drastically worsen performance by losing the columnar format, Snappy compression, and data skipping statistics."
        ]
      },
      {
        "id": "dbd-08",
        "d": 1,
        "t": "Physical Optimization: Liquid Clustering vs Z-ORDER",
        "q": "Your team manages a 50 TB Delta table with frequent queries filtered concurrently by `customer_id` (high cardinality) and `order_date` (time series). Traditional date-based partitioning was historically used, but it caused over-partitioning and data skew problems. Which two statements about modern physical organization techniques in Delta Lake are correct? (Choose 2 answers)",
        "o": [
          "`Liquid Clustering` (`CLUSTER BY (customer_id, order_date)`) simplifies physical design by allowing flexible multidimensional clustering without over-partitioning.",
          "`Z-ORDER BY` allows dynamically modifying the ordering keys without needing to rewrite or reorder the existing files in the table.",
          "`Liquid Clustering` supports evolving clustering keys over time without requiring redefining or rewriting the entire historical table.",
          "Classic physical partitioning by high-cardinality columns such as `customer_id` is the officially recommended Databricks practice for large tables."
        ],
        "a": [
          0,
          2
        ],
        "e": "`Liquid Clustering` (`CLUSTER BY`) is the recommended physical optimization technology in Databricks. Unlike strict directory-based partitioning, it does not suffer from over-partitioning or skew, and it allows evolving the clustering columns without having to rewrite the table's history. In contrast, `Z-ORDER` requires explicitly re-running `OPTIMIZE ZORDER BY` and does not adapt its keys incrementally.",
        "why": [
          null,
          "`Z-ORDER` does not dynamically adapt its keys; it requires manually re-running the `OPTIMIZE ... ZORDER BY` command to reorganize the data.",
          null,
          "Physically partitioning by high-cardinality columns generates millions of micro-folders (over-partitioning), severely degrading performance."
        ]
      },
      {
        "id": "dbd-09",
        "d": 1,
        "t": "Maintenance with VACUUM and Retention",
        "q": "A data engineer periodically runs the `VACUUM` command on a Delta table to free up space in object storage. A developer suggests running `SET spark.databricks.delta.vacuum.retentionCheck.enabled = false; VACUUM sales RETAIN 0 HOURS;` after each micro-batch to keep the bucket completely clean. Why is this practice a serious risk in production?",
        "o": [
          "Because it permanently deletes old files that may be being read by active concurrent queries and destroys the Time Travel capability.",
          "Because it permanently disables the Photon engine on the cluster, forcing interpreted, non-vectorized compilation of all subsequent SQL queries in the catalog.",
          "Because it causes Unity Catalog to automatically revoke the `SELECT` privileges of all user groups on the affected table in the database.",
          "Because it overwrites the table schema, turning all numeric columns into non-serializable binary types in the underlying Parquet files."
        ],
        "a": 0,
        "e": "Delta Lake keeps files marked as removed (tombstoned) during the safety retention period (by default 7 days or 168 hours). If the safety check is disabled and files are purged with zero retention (`RETAIN 0 HOURS`), any running analytical query that is reading files from previous versions will fail immediately with file-not-found errors (`FileNotFoundException`), in addition to preventing the use of Time Travel.",
        "why": [
          null,
          "`VACUUM` is a disk maintenance operation; it does not affect the Photon execution engine or the query compiler configuration.",
          "Unity Catalog privileges are managed in the metastore; the physical purge of data files does not alter the assigned RBAC permissions.",
          "`VACUUM` only deletes physically unreferenced files; it does not modify the logical schema of the columns or their data types."
        ]
      },
      {
        "id": "dbd-10",
        "d": 1,
        "t": "Managed vs External Tables",
        "q": "An infrastructure team needs to define a table in Databricks called `telemetry_nodes`. They want to ensure that if a user with permissions accidentally runs `DROP TABLE telemetry_nodes;`, the data files in the S3 or ADLS Gen2 bucket remain completely intact. How should this table be declared?",
        "o": [
          "As a managed table (`Managed Table`) within the main catalog without specifying any external location clause in the create command.",
          "As a global temporary table (`GLOBAL TEMP VIEW`) within the system database so that it resides permanently in volatile cluster storage.",
          "As an external table (`External Table`) by explicitly specifying a storage path with the `LOCATION 's3://bucket/path/'` clause.",
          "As a standard view (`VIEW`) based on a `SELECT * FROM parquet` query with storage managed in the central metastore of the corporate region."
        ],
        "a": 2,
        "e": "In Databricks and Unity Catalog, tables created with the `LOCATION` clause are external tables (`External Tables`). When `DROP TABLE` is run on an external table, only the metadata and the catalog entry are removed, but the physical data files in object storage remain completely intact.",
        "why": [
          "In a `Managed Table`, the `DROP TABLE` command removes both the metadata and the physical data files in the bucket.",
          "A `GLOBAL TEMP VIEW` disappears when the Spark application/cluster terminates and does not durably persist data in the catalog.",
          null,
          "A view does not store data by itself; the stated need is to create a persistent table that protects the underlying physical files."
        ]
      },
      {
        "id": "dbd-11",
        "d": 1,
        "t": "Metadata Checkpoints in Delta Lake",
        "q": "A Delta table has recorded more than 20,000 write transactions over six months. A new engineer wonders why queries do not degrade linearly over time given that they must read tens of thousands of `.json` files in the `_delta_log/` directory. Which internal mechanism prevents this degradation?",
        "o": [
          "The Catalyst compiler saves a fixed binary copy of the metadata on the local hard drive of each worker virtual machine in the compute cluster.",
          "Delta Lake automatically generates a `.checkpoint.parquet` file every 10 transactions, compacting the table's accumulated state up to that point.",
          "Databricks runs a process that irreversibly deletes all JSON files prior to the latest commit every midnight in storage.",
          "Reads ignore the `_delta_log` directory and read the data by directly scanning the Parquet files through POSIX calls to the cloud bucket."
        ],
        "a": 1,
        "e": "Every 10 commits (by default), Delta Lake generates a compacted checkpoint file in Parquet format (e.g., `000010.checkpoint.parquet`, `000020.checkpoint.parquet`). When querying the table, the engine only needs to read the latest Parquet checkpoint and the few JSON files after it, reconstructing the full table state in memory almost instantly.",
        "why": [
          "Workers do not persist master metadata on their local disks; the state is derived dynamically from the `_delta_log` in object storage.",
          null,
          "Delta Lake does not arbitrarily delete earlier JSON files; it keeps them to enable Time Travel according to the configured log retention.",
          "Scanning the files directly without consulting the `_delta_log` would ignore the transaction records, reading corrupt or deleted data."
        ]
      },
      {
        "id": "dbd-12",
        "d": 1,
        "t": "Compute: Photon Execution Engine",
        "q": "Your company runs daily pipelines with very heavy Spark SQL queries containing multiple aggregations, filters, and joins over hundreds of millions of rows. You want to reduce query execution times without modifying the SQL code or changing the cluster infrastructure. Which Databricks component provides native vectorized acceleration for this purpose?",
        "o": [
          "The `Photon` engine, a native executor developed in C++ that processes vectorized queries in parallel, replacing Spark's JVM runtime.",
          "The `Serverless SQL Warehouse` service configured exclusively with GPU instances to compile relational queries using CUDA cores.",
          "The `Koalas` extension that automatically converts all SQL queries into sequential computation operations on a single machine using Pandas.",
          "The `GraphX` module that transforms relational tables into in-memory distributed graphs to solve filters such as connected paths on the cluster."
        ],
        "a": 0,
        "e": "`Photon` is Databricks' native execution engine written from scratch in C++. It replaces Apache Spark's traditional JVM-based execution engine with a vectorized columnar engine that takes advantage of the instruction-level parallelism (SIMD) of modern hardware, notably accelerating SQL and DataFrame workloads without requiring changes to the query code.",
        "why": [
          null,
          "SQL Warehouses use CPUs and can use Photon; they do not require GPU hardware or CUDA compilation for relational SQL.",
          "Koalas is a Pandas-compatible API on PySpark; it does not accelerate complex SQL queries or replace the distributed execution engine.",
          "GraphX is a library for graph computation; it is not an acceleration engine for relational queries or standard ELT pipelines."
        ]
      },
      {
        "id": "dbd-13",
        "d": 2,
        "t": "Spark SQL: Querying Files Directly",
        "q": "A data analyst needs to quickly inspect the contents of several newly downloaded Parquet files at the path `dbfs:/mnt/landing/orders/` without creating a formal table in the metastore or registering persistent metadata. Which Databricks ANSI SQL syntax allows querying these files directly?",
        "o": [
          "Run `OPEN FILE 'dbfs:/mnt/landing/orders/' FORMAT PARQUET;` to load the content into the development workspace's interactive console.",
          "Run `SELECT * FROM parquet.`dbfs:/mnt/landing/orders/`;` using the format notation and backticks around the path.",
          "Run `IMPORT TABLE orders FROM 'dbfs:/mnt/landing/orders/' TYPE PARQUET;` to instantiate a volatile pointer in shared memory.",
          "Run `READ_PARQUET('dbfs:/mnt/landing/orders/')` as a scalar function within a `WHERE` clause in an interactive Python session."
        ],
        "a": 1,
        "e": "Spark SQL supports direct queries on files stored in file systems or buckets using the syntax `SELECT * FROM <format>.`<path>``. This allows exploring data in Parquet, JSON, CSV, Delta, or text formats without having to register tables in the catalog beforehand.",
        "why": [
          "The `OPEN FILE` statement does not exist in Spark SQL syntax or in Databricks' ANSI SQL standard.",
          null,
          "The `IMPORT TABLE` command is not valid syntax for querying files ad hoc in Spark SQL.",
          "`READ_PARQUET` is not a Spark SQL scalar function to invoke in WHERE clauses; direct table notation or the DataFrame API is used."
        ]
      },
      {
        "id": "dbd-14",
        "d": 2,
        "t": "Idempotent Ingestion with COPY INTO",
        "q": "A daily pipeline receives thousands of CSV files in a cloud bucket and must load them into a target Delta table. If the pipeline fails midway and is retried, duplicate records must not be inserted for files that were already processed successfully. Which declarative SQL command provides this incremental, idempotent load guarantee?",
        "o": [
          "Use `INSERT INTO delta_target SELECT * FROM csv.`path/`;` relying on the Catalyst optimizer to discard previously read files.",
          "Run a bash script with `rsync` that moves the processed files to a temporary folder before invoking a `LOAD DATA INPATH` command in the metastore.",
          "Use the `COPY INTO delta_target FROM 'path/' FILEFORMAT = CSV FORMAT_OPTIONS ('header'='true');` command, which records the files already loaded.",
          "Run `CREATE OR REPLACE TABLE delta_target AS SELECT * FROM csv.`path/`;` to overwrite the table on each daily pipeline run."
        ],
        "a": 2,
        "e": "The `COPY INTO` command is a declarative, idempotent SQL statement designed to load new files incrementally into Delta tables. It internally records the files already processed in the table metadata; if re-run on the same folder, it automatically skips the files already loaded without duplicating data.",
        "why": [
          "`INSERT INTO ... SELECT` blindly inserts all records returned by the query, duplicating data if retried after a partial failure.",
          "Moving files with bash is fragile, prone to concurrency errors, and provides no ACID transactionality in the database.",
          null,
          "`CREATE OR REPLACE TABLE` destroys the previous historical data on each run, preventing incremental accumulation of historical data."
        ]
      },
      {
        "id": "dbd-15",
        "d": 2,
        "t": "Semi-Structured Data: from_json",
        "q": "An events table in the Bronze layer stores in the `payload_str` column text strings with JSON objects that contain nested fields: `{\"user_id\": 102, \"details\": {\"ip\": \"192.168.1.1\", \"action\": \"login\"}}`. You want to extract the `ip` field as a structured column in the Silver layer. What is the appropriate, best-performing method?",
        "o": [
          "Apply a regular expression with `regexp_extract()` on the text string to look for alphanumeric character patterns between quotes in the column.",
          "Write a custom pure Python UDF that invokes the standard library `json.loads()` row by row on each distributed executor in the cluster.",
          "Split the string by commas and braces using `split()` and get the element at the static position using array indexes in the final projection.",
          "Define the schema with `STRUCT` and deserialize the column using `from_json(payload_str, 'STRUCT<user_id: INT, details: STRUCT<ip: STRING, action: STRING>>')`."
        ],
        "a": 3,
        "e": "`from_json()` is the optimized native Spark SQL function for transforming JSON strings into structured types (`STRUCT` or `ARRAY`). By providing an explicit schema or one inferred with `schema_of_json()`, the Catalyst and Photon engines compile the deserialization to highly efficient native code, allowing nested fields to be accessed using dot notation (`col.details.ip`).",
        "why": [
          "Regular expressions with `regexp_extract` are slow, brittle against minor changes in the JSON format, and prone to parsing errors.",
          "A row-by-row Python UDF suffers a severe performance penalty from IPC serialization between the JVM and the Python interpreter.",
          "Using `split()` assumes a strict positional order in the JSON, which fails as soon as the fields change order or contain internal commas.",
          null
        ]
      },
      {
        "id": "dbd-16",
        "d": 2,
        "t": "Higher-Order Functions: TRANSFORM",
        "q": "You have a table with the column `base_prices` of type `ARRAY<DOUBLE>`. You need to apply a 16% tax to each element of the array, generating a new column `prices_with_tax` of type `ARRAY<DOUBLE>` with the resulting amounts. Which Spark SQL higher-order function performs this transformation without needing to unnest the array?",
        "o": [
          "`TRANSFORM(base_prices, p -> round(p * 1.16, 2))` to apply the lambda function to each element of the array directly in memory.",
          "`FILTER(base_prices, p -> p * 1.16)` to multiply each value and return the transformed set in a new collection in the catalog.",
          "`EXPLODE_TRANSFORM(base_prices, p -> p * 1.16)` to temporarily unnest the elements and automatically rebuild the list through an internal collector.",
          "`MAP_VALUES(base_prices, p -> p * 1.16)` to iterate over the array's numeric indexes and update the underlying records on disk."
        ],
        "a": 0,
        "e": "The higher-order function `TRANSFORM(array, element -> expression)` evaluates an expression or lambda function on each element of an array and returns a new array with the transformed results. This avoids the computational cost of breaking the array apart with `explode()` and then regrouping it with `collect_list()`.",
        "why": [
          null,
          "`FILTER` only evaluates boolean predicates to keep or discard elements; it does not transform the values of the array elements.",
          "`EXPLODE_TRANSFORM` does not exist in the Spark SQL specification or in Databricks.",
          "`MAP_VALUES` operates on key-value map data types (`MAP<K, V>`), not on primitive arrays (`ARRAY<T>`)."
        ]
      },
      {
        "id": "dbd-17",
        "d": 2,
        "t": "Higher-Order Functions: FILTER and EXISTS",
        "q": "In an e-commerce table, each order has an `items` column of type `ARRAY<STRUCT<name: STRING, category: STRING, price: DOUBLE>>`. You want to filter the table to select only the orders that contain at least one item in the category 'Electronics' with a price greater than 500 dollars. Which SQL condition in the `WHERE` clause meets the requirement optimally?",
        "o": [
          "`WHERE items.category = 'Electronics' AND items.price > 500` referencing array fields directly as if they were scalar columns in the table.",
          "`WHERE EXISTS(items, a -> a.category = 'Electronics' AND a.price > 500)` using the boolean higher-order function.",
          "`WHERE ARRAY_CONTAINS(items.category, 'Electronics') AND MAX(items.price) > 500` combining array and aggregation functions in the query's WHERE clause.",
          "`WHERE COUNT_IF(items, a -> a.category = 'Electronics') >= 1` to count the matches in the array at cluster disk-scan time."
        ],
        "a": 1,
        "e": "The higher-order function `EXISTS(expr, x -> boolean_expression)` returns `true` if at least one array element satisfies the boolean condition defined by the lambda function. It is the cleanest and most efficient solution in Spark SQL for checking predicates on complex arrays without requiring `explode()`.",
        "why": [
          "It is not possible to access fields of an `ARRAY<STRUCT>` directly with scalar notation without unnesting or using higher-order functions.",
          null,
          "`ARRAY_CONTAINS` only evaluates equality against simple literal elements and cannot evaluate multiple correlated conditions together with price predicates.",
          "`COUNT_IF` is an aggregate function over table columns, not a higher-order function for nested arrays."
        ]
      },
      {
        "id": "dbd-18",
        "d": 2,
        "t": "Deduplication in Spark SQL",
        "q": "An ingestion pipeline processes shopping cart events that contain duplicates caused by mobile network retries. The events have the columns `session_id`, `product_id`, `quantity`, and `event_timestamp`. You must remove duplicates while keeping only the event with the most recent timestamp for each (`session_id`, `product_id`) pair. Which two techniques in Spark SQL and DataFrames are correct? (Choose 2 answers)",
        "o": [
          "Call `df.dropDuplicates([\"session_id\", \"product_id\"])` after first sorting the entire DataFrame with `df.sort(\"event_timestamp\")`.",
          "Compute `ROW_NUMBER() OVER (PARTITION BY session_id, product_id ORDER BY event_timestamp DESC)` in a CTE and filter `WHERE row_num = 1`.",
          "Use the `GROUP BY session_id, product_id` clause, directly selecting `FIRST(quantity)` without defining an explicit ordering criterion.",
          "Use `QUALIFY ROW_NUMBER() OVER (PARTITION BY session_id, product_id ORDER BY event_timestamp DESC) = 1` directly in the SQL query."
        ],
        "a": [
          1,
          3
        ],
        "e": "To deterministically keep the most recent record, use the window function `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY timestamp DESC)`. In Databricks and Spark SQL, this can be solved with a common table expression (CTE) filtering `row_num = 1`, or directly and elegantly with the `QUALIFY ROW_NUMBER() ... = 1` clause.",
        "why": [
          "`dropDuplicates` does not guarantee keeping the most recent row after a distributed sort, because internal partitions can alter the partition order.",
          null,
          "`FIRST(quantity)` without ordering is nondeterministic and can return any arbitrary value across successive executions.",
          null
        ]
      },
      {
        "id": "dbd-19",
        "d": 2,
        "t": "Atomic Operations: MERGE INTO",
        "q": "You have a Delta table named `customers_silver` and a batch of updates in the temporary table `updates_bronze`. You want to update the `email` and `address` fields of existing customers and add new customers that do not exist yet. Which SQL statement correctly implements this atomic upsert pattern?",
        "o": [
          "Run a bulk `UPDATE` followed by an `INSERT INTO customers_silver SELECT * FROM updates_bronze WHERE id NOT IN (SELECT id FROM customers_silver)` in two separate transactions.",
          "Overwrite the entire partition using the `INSERT OVERWRITE customers_silver SELECT * FROM updates_bronze` clause in a single catalog transaction.",
          "`MERGE INTO customers_silver AS t USING updates_bronze AS s ON t.id = s.id WHEN MATCHED THEN UPDATE SET t.email=s.email, t.address=s.address WHEN NOT MATCHED THEN INSERT *;`",
          "Create a temporary view combined with `UNION ALL` and run a physical compaction command with `OPTIMIZE customers_silver ZORDER BY (id)` on the bucket."
        ],
        "a": 2,
        "e": "The Delta Lake `MERGE INTO` statement allows coordinated Upsert operations (updates and inserts) in a single atomic ACID transaction. It evaluates the match condition (`ON t.id = s.id`) and runs the `WHEN MATCHED` branches to update existing rows and `WHEN NOT MATCHED` to insert new records.",
        "why": [
          "Running `UPDATE` followed by `INSERT` makes two independent transactions that can cause race conditions and redundant table scans.",
          "`INSERT OVERWRITE` overwrites the existing data, deleting all customers that are not present in the current batch of updates.",
          null,
          "`UNION ALL` plus `OPTIMIZE` simply accumulates duplicates in the table without updating records or reconciling customer versions."
        ]
      },
      {
        "id": "dbd-20",
        "d": 2,
        "t": "MERGE INTO with Conditional Delete",
        "q": "An inventory system sends catalog change records. The source table `stock_updates` includes an `operation` column with the values 'UPDATE', 'INSERT', or 'DELETE'. You need to synchronize the Delta table `current_stock`. If the operation is 'DELETE' and the product matches, it must be removed from the target table. How is this logic expressed within a `MERGE INTO` command?",
        "o": [
          "Add a `WHEN MATCHED AND s.operation = 'DELETE' THEN DROP ROW` clause as the first condition of the MERGE statement in the SQL query.",
          "Create an external database trigger that captures the delete events and makes Databricks REST API calls to process them.",
          "Run a Python stored procedure that extracts the IDs with 'DELETE' and runs a `for` loop issuing individual `DELETE FROM` statements on the cluster.",
          "Configure the `WHEN MATCHED AND s.operation = 'DELETE' THEN DELETE` clause before the standard update clause."
        ],
        "a": 3,
        "e": "Delta Lake supports multiple `WHEN MATCHED` clauses, evaluated in the order they are declared. To handle conditional deletes, declare `WHEN MATCHED AND s.operation = 'DELETE' THEN DELETE` first, and then `WHEN MATCHED THEN UPDATE SET ...`. This way, the rows flagged for deletion are logically purged from the table in the same atomic transaction.",
        "why": [
          "The `DROP ROW` syntax does not exist in the standard SQL `MERGE INTO` statement or in Delta Lake (the `DELETE` keyword is used).",
          "Databricks does not support traditional OLTP database triggers, and REST calls would add unacceptable latency to the data pipeline.",
          "A sequential Python loop issuing individual `DELETE` statements generates thousands of unnecessary commits in the `_delta_log` and degrades the cluster.",
          null
        ]
      },
      {
        "id": "dbd-21",
        "d": 2,
        "t": "UDF Performance: SQL vs Python vs Pandas",
        "q": "A data engineer needs to compute a custom financial metric over 100 million rows. The function can be implemented as a native SQL UDF, a standard Python UDF (`@udf`), or a vectorized Pandas UDF (`@pandas_udf`). If the calculation can be expressed in standard mathematical expressions, which is the most efficient option?",
        "o": [
          "The native `SQL UDF`, because Catalyst and the Photon engine compile it directly to vectorized machine code with no serialization overhead.",
          "The standard `Python UDF`, because the CPython garbage collector manages the memory of each row more efficiently than the Spark JVM.",
          "The `Pandas UDF`, because it is always faster than any native SQL function since it runs in vectorized in-memory NumPy micro-batches.",
          "There is no measurable performance difference among the three alternatives because Catalyst optimizes all the code to identical Java bytecode in the compiler."
        ],
        "a": 0,
        "e": "Native `SQL UDFs` are the most efficient in Databricks because they are fully integrated into the Catalyst optimizer and the vectorized `Photon` execution engine. They do not suffer the IPC serialization overhead (exchange between the JVM and the Python runtime) that affects standard Python UDFs, and they outperform Pandas UDFs by avoiding intermediate conversions.",
        "why": [
          null,
          "Standard Python UDFs suffer extreme row-by-row serialization overhead (Py4J/IPC), making them the slowest alternative in Spark.",
          "Although Pandas UDFs are much faster than standard Python UDFs, they still incur Arrow serialization costs compared to a native SQL UDF.",
          "Catalyst cannot optimize inside the Python interpreter in a standard Python UDF; the performance difference is usually 10x to 100x."
        ]
      },
      {
        "id": "dbd-22",
        "d": 2,
        "t": "Handling Dates and Timestamps",
        "q": "In a billing report, you need to truncate the `transaction_timestamp` column (TIMESTAMP type) to the first day of the corresponding month at 00:00:00 to perform monthly aggregations. Which function is recommended in Spark SQL for this temporal truncation?",
        "o": [
          "`DATE_FORMAT(transaction_timestamp, 'yyyy-MM')` to convert the timestamp to a text string and then filter it alphabetically in the query.",
          "`DATE_TRUNC('month', transaction_timestamp)`, which returns the timestamp adjusted to the start of the specified time unit while preserving the type.",
          "`TRUNCATE_TIME(transaction_timestamp, '30 days')`, computing a fixed 30-day subtraction on the timestamp of each record evaluated by the engine.",
          "`TO_MONTH_START(transaction_timestamp)`, which mathematically rounds the Unix epoch number to the nearest monthly multiple of seconds at runtime."
        ],
        "a": 1,
        "e": "The Spark SQL `date_trunc(unit, timestamp)` function truncates a timestamp to the specified unit (e.g., `'month'`, `'year'`, `'day'`, `'hour'`), returning a `TIMESTAMP` value at the exact start of the period. This preserves the native data type for efficient comparisons and sorting without converting to text strings.",
        "why": [
          "`date_format()` converts the timestamp to `STRING`, which degrades the performance of indexes, temporal comparisons, and data skipping operations.",
          null,
          "The `TRUNCATE_TIME` function does not exist in the Spark SQL specification or in Databricks.",
          "`TO_MONTH_START` is not a Spark SQL function; months have variable lengths (28-31 days) that cannot be computed with fixed multiples."
        ]
      },
      {
        "id": "dbd-23",
        "d": 2,
        "t": "Nested Structures: Accessing STRUCT Fields",
        "q": "You have a `customer` column of type `STRUCT<name: STRING, address: STRUCT<city: STRING, postal_code: INT>>`. You want to project the customer's city in a SQL query. Which syntax is valid for accessing the nested `city` field in Databricks SQL?",
        "o": [
          "`SELECT customer->address->city FROM sales;` using arrow-style pointer operators similar to C++-based languages.",
          "`SELECT EXTRACT_FIELD(customer, 'address.city') FROM sales;` calling a helper function for inspecting system column metadata.",
          "`SELECT customer.address.city FROM sales;` using the standard dot-notation navigation over nested structures.",
          "`SELECT customer['address']['city']::string FROM sales;` forcing a key-value map cast over tuple structures in distributed memory."
        ],
        "a": 2,
        "e": "In Spark SQL and Databricks SQL, fields inside a `STRUCT` data type are accessed naturally with dot notation: `column_name.field.subfield`. This syntax is intuitive, ANSI SQL-compliant, and highly optimized by the execution engine.",
        "why": [
          "The arrow operator `->` is used in lambda functions (higher-order functions), not to access attributes of a `STRUCT`.",
          "The `EXTRACT_FIELD` function is not part of the Spark SQL built-in function library.",
          null,
          "Bracket indexing with strings (`col['clave']`) is reserved for `MAP` types, not for strongly typed attributes of a `STRUCT`."
        ]
      },
      {
        "id": "dbd-24",
        "d": 2,
        "t": "Unnesting Arrays: explode vs posexplode",
        "q": "A table contains orders with an `items` column of type `ARRAY<STRING>`. Some orders contain no items (`items` is an empty array or `NULL`). You need to flatten the array so that each item occupies its own row, but without losing the orders that have no items (they must appear with a `NULL` value). Which SQL function should be used?",
        "o": [
          "`SELECT order_id, explode(items) FROM orders;` relying on the engine to automatically keep the rows with null or empty arrays in the result.",
          "`SELECT order_id, posexplode(items) FROM orders;` to generate both the integer position and the corresponding element value in each row.",
          "`SELECT order_id, unnest_all(items) FROM orders;` calling the standard dimensional flattening function of PostgreSQL databases on the cluster.",
          "`SELECT order_id, explode_outer(items) FROM orders;` to ensure the parent rows with null or empty arrays are preserved in the result."
        ],
        "a": 3,
        "e": "`explode_outer(col)` is the variant of `explode()` that preserves rows whose array is `NULL` or empty (`size = 0`). Unlike `explode()`, which silently discards these rows (behavior analogous to an `INNER JOIN`), `explode_outer()` emits a row with a `NULL` value for the flattened column (behavior analogous to a `LEFT OUTER JOIN`).",
        "why": [
          "`explode()` automatically discards any row where the array is null or empty, losing the orders without items.",
          "`posexplode()` adds a position index column but also discards empty or null rows just like standard `explode()`.",
          "`unnest_all()` is not a Spark SQL function in Databricks.",
          null
        ]
      },
      {
        "id": "dbd-25",
        "d": 2,
        "t": "View Types: Standard vs Temp vs Global Temp",
        "q": "A data engineer creates a view for a temporary analysis in an interactive notebook: `CREATE TEMPORARY VIEW vista_temporal AS SELECT * FROM datos_raw;`. Later, a colleague tries to query `vista_temporal` from another cluster and gets a table-not-found error. What is the reason for this behavior?",
        "o": [
          "Temporary views (`TEMPORARY VIEW`) have a scope strictly tied to the current Spark session and are not visible from other clusters or sessions.",
          "The user who created the view did not run the command `GRANT SELECT ON VIEW vista_temporal TO PUBLIC;` in the account's central corporate metastore.",
          "Temporary views can only query tables in Parquet format and fail if the underlying data is in Delta Lake format in production.",
          "The second colleague did not enable the property `spark.sql.globalTempViews.crossClusterEnabled = true` in the advanced settings of their compute cluster."
        ],
        "a": 0,
        "e": "In Apache Spark and Databricks, a `TEMPORARY VIEW` exists only within the scope of the Spark session (`SparkSession`) in which it was declared. It is not registered in any persistent catalog or metastore, and it is automatically destroyed when the session ends or the cluster shuts down. It is not accessible from other clusters or from other concurrent sessions.",
        "why": [
          null,
          "Temporary views are not registered in Unity Catalog or the Hive Metastore; therefore, they do not support access-control `GRANT` statements.",
          "Temporary views can query any format supported by Spark, including Delta, Parquet, CSV, and JSON with no restrictions.",
          "That Spark configuration property does not exist; session isolation is intrinsic to the lifecycle of a temporary view."
        ]
      },
      {
        "id": "dbd-26",
        "d": 2,
        "t": "Window Functions: RANK vs DENSE_RANK",
        "q": "In a sales competition, two employees tie for first place with 100 sales each, and the next employee has 90 sales. You want the employee with 90 sales to appear in position 2 of the ranking without gaps in the numbering. Which analytic window function should be used in the SQL query?",
        "o": [
          "`ROW_NUMBER() OVER (ORDER BY sales DESC)` to assign sequential numbers independent of ties in the sales values evaluated by the query.",
          "`DENSE_RANK() OVER (ORDER BY sales DESC)` to assign the same rank to tied values without creating jumps in the subsequent numbering.",
          "`RANK() OVER (ORDER BY sales DESC)` to compute the positions, leaving a gap equal to the number of tied competitors in the table.",
          "`PERCENT_RANK() OVER (ORDER BY sales DESC)` to express each employee's relative position as a percentage of the total staff evaluated."
        ],
        "a": 1,
        "e": "`DENSE_RANK()` assigns the same rank to identical values in the `ORDER BY` clause and continues with the next consecutive integer (1, 1, 2...). In contrast, `RANK()` would leave a gap (1, 1, 3...), and `ROW_NUMBER()` would assign unique, arbitrary sequential values to the tied rows (1, 2, 3).",
        "why": [
          "`ROW_NUMBER()` would break the tie by arbitrarily and nondeterministically assigning position 1 to one and position 2 to the other.",
          null,
          "`RANK()` would leave a gap after the two-way tie, assigning position 3 to the next employee instead of the required position 2.",
          "`PERCENT_RANK()` computes a relative decimal fraction between 0 and 1, not an ordinal integer ranking position."
        ]
      },
      {
        "id": "dbd-27",
        "d": 2,
        "t": "Multidimensional Aggregations: ROLLUP and CUBE",
        "q": "The business analyst team requires a sales report that includes hierarchical cumulative subtotals: first the company grand total, then the subtotals by year, and within each year the subtotals by month and region. Which SQL aggregation clause solves this hierarchy without resorting to multiple `UNION ALL` statements?",
        "o": [
          "`GROUP BY region, month, year WITH RECURSIVE` to iteratively compute the cumulative totals through an in-memory graph common expression.",
          "`GROUP BY CUBE (year, month, region)` to exhaustively compute all $2^3 = 8$ possible combinations of dimensions regardless of hierarchy.",
          "`GROUP BY ROLLUP (year, month, region)` to generate the aggregated subtotals in strictly hierarchical order from left to right.",
          "`GROUP BY year, month, region ORDER BY TOTALS DESC` forcing the injection of synthetically computed rows in the final sort stage on the cluster."
        ],
        "a": 2,
        "e": "`GROUP BY ROLLUP (a, b, c)` generates progressive hierarchical aggregations considering the order of the declared columns: `(a, b, c)`, `(a, b)`, `(a)`, and the overall grand total `()`. It is the optimal clause for generating reports with hierarchically structured subtotals (e.g., year &rarr; month &rarr; region) in a single aggregation pass.",
        "why": [
          "`WITH RECURSIVE` is used for recursive queries over graphs or hierarchical trees of records; it is not a clause for subtotals in `GROUP BY`.",
          "`CUBE` generates all possible combinations of dimensions, producing unnecessary non-hierarchical subtotals and increasing the computational cost.",
          null,
          "`ORDER BY TOTALS` is not a valid clause in Spark SQL for synthesizing aggregated subtotal rows."
        ]
      },
      {
        "id": "dbd-28",
        "d": 3,
        "t": "Structured Streaming: Unbounded Table Model",
        "q": "A data engineer new to Apache Spark assumes that a Structured Streaming flow requires rewriting the query logic differently from batch processing. What is the fundamental architectural concept of Structured Streaming that unifies both paradigms?",
        "o": [
          "It converts the event stream into individual CSV files on disk that are processed by a polling script on the operating system of the driver node.",
          "It runs a synchronous REST service that stores each event in an external relational database before notifying the catalog subscribers.",
          "It transforms all the data into directed acyclic graphs in RAM managed by independent CPython threads on the cluster driver.",
          "It treats the continuous data stream as an unbounded table to which each new batch appends records in append mode."
        ],
        "a": 3,
        "e": "The conceptual model of Spark Structured Streaming treats the continuous data stream as an *unbounded table* that grows continuously as new data arrives. This makes it possible to express streaming queries using exactly the same APIs and Catalyst optimizations as in batch queries.",
        "why": [
          "Structured Streaming does not generate temporary CSV files for polling; it processes micro-batches in memory, or continuously, directly into Delta sinks.",
          "Structured Streaming does not depend on synchronous REST services or intermediate relational databases to coordinate distributed ingestion.",
          "Spark computation is based on RDDs and DataFrames distributed across JVM executors, not on graphs managed by CPython on the driver.",
          null
        ]
      },
      {
        "id": "dbd-29",
        "d": 3,
        "t": "Structured Streaming: Output Modes",
        "q": "A streaming pipeline reads continuous click events and writes directly to a Silver-layer Delta table incrementally, without performing aggregations or groupings. Which output mode (`outputMode`) should be configured in the `DataStreamWriter`?",
        "o": [
          "`outputMode(\"append\")` to emit only the new records processed in each micro-batch to the target Delta table.",
          "`outputMode(\"complete\")` to overwrite the entire table with the consolidated event history in each streaming micro-batch executed.",
          "`outputMode(\"update\")` to recompute the hash of each row and insert only records that do not already exist in object storage.",
          "`outputMode(\"snapshot\")` to dump a static copy of the driver node's memory in binary format to the corporate data catalog."
        ],
        "a": 0,
        "e": "The `append` output mode (the default in Structured Streaming) emits only the new rows processed in the current micro-batch to the sink. In queries without aggregations, it is the only supported mode for incremental Delta tables, ensuring continuous and atomic writing of new records.",
        "why": [
          null,
          "`complete` rewrites the entire table on each trigger and is only allowed in queries with aggregations; it would fail on a simple ingestion without groupings.",
          "`update` emits modified rows and, in streaming without aggregations, behaves equivalently to append, but it does not compute row hashes.",
          "`snapshot` does not exist as an output mode in Apache Spark Structured Streaming or in Databricks."
        ]
      },
      {
        "id": "dbd-30",
        "d": 3,
        "t": "Structured Streaming: Checkpointing and Fault Tolerance",
        "q": "A critical Structured Streaming job stops unexpectedly due to a temporary network interruption with cloud storage. When the cluster restarts, the job resumes automatically without duplicating events or losing pending records. Which technical component makes this recovery possible with `exactly-once` guarantees?",
        "o": [
          "The transaction log of the SQLite relational database embedded in the ephemeral local disk of the Databricks driver node.",
          "The checkpoint directory (`checkpointLocation`), which durably persists the logs of offsets read, commits, and streaming state.",
          "The cluster auto-restart policy that requests all historical events again from the original start timestamp of the transactional source.",
          "The inter-node replication mechanism of Apache ZooKeeper configured on the worker nodes of the corporate workspace's compute cluster."
        ],
        "a": 1,
        "e": "The `checkpointLocation` directory is the cornerstone of fault tolerance in Structured Streaming. It durably stores in object storage (S3/ADLS/GCS) the logs of offsets read (`offsets/`), the committed batches (`commits/`), and the aggregation state. This allows the engine to restart exactly where it was interrupted, guaranteeing *exactly-once* semantics.",
        "why": [
          "Spark does not use SQLite on the driver to store checkpoints; the driver's ephemeral disk is destroyed when the cluster restarts.",
          null,
          "Re-requesting all the history from the beginning would violate exactly-once semantics and generate massive duplicates in the sinks.",
          "Databricks and Spark Structured Streaming do not use Apache ZooKeeper for checkpoint management or offset coordination."
        ]
      },
      {
        "id": "dbd-31",
        "d": 3,
        "t": "Auto Loader: Directory Listing vs File Notification",
        "q": "Your company ingests 500,000 new files daily into an S3 bucket that already holds more than 10 million historical files. The current pipeline, which uses standard `spark.read`, takes more than an hour just to list the bucket contents before starting to process. Which `Auto Loader` configuration resolves this bottleneck?",
        "o": [
          "Set `cloudFiles.useIncrementalListing = false` to force a sequential scan on a single master thread on the driver node of the compute cluster.",
          "Use `COPY INTO` with the option to force re-indexing of storage folders through POSIX calls to the distributed file system.",
          "Enable file notification mode (`cloudFiles.useNotifications = true`) using event queues (SNS/SQS) to receive notices.",
          "Split the bucket into 1,000 subfolders and launch a 1,000-node cluster running an `ls -R` command in parallel through bash scripts on Linux."
        ],
        "a": 2,
        "e": "Auto Loader (`cloudFiles`) offers **File Notification** mode (`cloudFiles.useNotifications = true`), which automatically configures cloud event services (AWS SNS/SQS, Azure Event Grid, GCP Pub/Sub). Instead of listing directories with millions of files (which is slow and costly on storage APIs), Auto Loader reads the notifications directly from the message queue, detecting new files instantly.",
        "why": [
          "Disabling incremental listing would force full bucket scans, worsening the performance problem instead of solving it.",
          "`COPY INTO` on buckets with tens of millions of files also suffers from high file-listing latencies compared to event queues.",
          null,
          "Launching 1,000 nodes to run `ls` commands generates prohibitive costs and excessive calls that cause throttling on the S3 API."
        ]
      },
      {
        "id": "dbd-32",
        "d": 3,
        "t": "Auto Loader: Schema Evolution and _rescued_data",
        "q": "A pipeline with Auto Loader (`format(\"cloudFiles\")`) processes third-party JSON files. The provider often adds new fields without notice and occasionally sends corrupt records where a numeric field contains text. Which two Auto Loader mechanisms make it possible to handle this situation without failing the pipeline or losing data? (Choose 2 answers)",
        "o": [
          "Configure `cloudFiles.schemaEvolutionMode = 'addNewColumns'` so that Auto Loader dynamically adds new columns to the table schema.",
          "Set `cloudFiles.enforceStrictTypes = true` to force records with incorrectly typed data to be silently converted to zero.",
          "Use `cloudFiles.dropMalformed = true` to immediately delete from storage the files that contain any parsing discrepancy.",
          "Take advantage of the `_rescued_data` column, which automatically captures any unexpected column or corrupt data in JSON format without breaking ingestion."
        ],
        "a": [
          0,
          3
        ],
        "e": "Auto Loader provides advanced schema-handling capabilities: 1) `cloudFiles.schemaEvolutionMode = 'addNewColumns'` automatically expands the target table schema when it detects new columns in the input files. 2) The special `_rescued_data` column captures any field that does not match the expected schema or that contains malformed values, ensuring no data is lost and allowing anomalies to be audited later.",
        "why": [
          null,
          "`cloudFiles.enforceStrictTypes` is not a valid Auto Loader option, and silently converting to zero would cause undetectable corruption in numeric data.",
          "Auto Loader does not silently discard files; its design prioritizes no data loss by rescuing anomalies in `_rescued_data`.",
          null
        ]
      },
      {
        "id": "dbd-33",
        "d": 3,
        "t": "Structured Streaming: Triggers and Trigger.AvailableNow",
        "q": "A team needs to run an incremental streaming ingestion pipeline once per night. They want it to process all the data that arrived during the day, splitting it efficiently into multiple micro-batches so as not to overload the cluster memory, and then have the cluster shut down automatically. Which trigger (`Trigger`) is the best practice recommended by Databricks?",
        "o": [
          "`trigger(continuous = '10 seconds')` to keep the cluster running permanently, passively waiting for new records in the cloud bucket.",
          "`trigger(processingTime = '1 hour')` to force the engine to pause execution for exactly 60 minutes before processing the current batch.",
          "`trigger(once = true)` because it is the directive that processes everything in a single massive micro-batch, forcing full consumption of the driver's RAM.",
          "`trigger(availableNow = true)` to incrementally process all available data in efficient micro-batches and then terminate the stream."
        ],
        "a": 3,
        "e": "`Trigger.AvailableNow` (or `availableNow = true`) is the trigger recommended by Databricks for incremental batch processing. Unlike `Trigger.Once` (which processed everything in a single massive micro-batch and could cause OutOfMemory errors), `AvailableNow` processes all accumulated pending data by splitting it into multiple micro-batches of optimal size according to the configured limits, and ends the run cleanly.",
        "why": [
          "`continuous` keeps the cluster running 24/7 with continuous DBU consumption, contradicting the requirement of a nightly run followed by shutdown.",
          "`processingTime = '1 hour'` runs the stream in an infinite loop every hour without shutting down the cluster after processing the day's data.",
          "`Trigger.Once` is deprecated in favor of `Trigger.AvailableNow` because it processed all pending data in a single uncontrolled micro-batch.",
          null
        ]
      },
      {
        "id": "dbd-34",
        "d": 3,
        "t": "Structured Streaming: Watermarking and Late Events",
        "q": "A streaming query performs aggregations over 10-minute time windows (`window(timestamp, '10 minutes')`) to count orders. If no wait-time limit is configured for late events, the in-memory State Store will grow indefinitely until the cluster's RAM is exhausted (OOM). Which DataFrame API method solves this problem by defining the late-data drop threshold?",
        "o": [
          "`withWatermark(\"timestamp\", \"20 minutes\")`, which defines the time threshold beyond which old events are dropped and the state is released.",
          "`dropOldEvents(delay = \"20 minutes\")`, which physically deletes the delayed records from the object storage system before reading them.",
          "`setTimeToLive(\"timestamp\", 1200)` to set a Redis-style expiration on each individual key on the worker nodes of the corporate cluster.",
          "`filter(timestamp > current_timestamp() - interval 20 minutes)` applied statically in the projection clause of the initial streaming query."
        ],
        "a": 0,
        "e": "The **Watermarking** mechanism (`withWatermark(timeColumn, delayThreshold)`) tells the Structured Streaming engine how much time delay to tolerate for out-of-order events. When the watermark advances, the engine drops any event that arrives with a timestamp earlier than the threshold and safely purges the intermediate state from memory, preventing OutOfMemory (OOM) crashes.",
        "why": [
          null,
          "`dropOldEvents` does not exist in the Apache Spark Structured Streaming API or in Databricks.",
          "`setTimeToLive` is not a Spark function; Structured Streaming manages its state through State Stores (HDFS or RocksDB) governed by watermarks.",
          "Using `current_timestamp()` in streaming is nondeterministic and does not allow the engine to deduce when to close and emit past aggregation windows."
        ]
      },
      {
        "id": "dbd-35",
        "d": 3,
        "t": "Delta Live Tables: Streaming Tables",
        "q": "In a Delta Live Tables (DLT) pipeline defined in SQL, you need to create a Bronze-layer table that continuously ingests new log files from a cloud directory using Auto Loader. Which declarative DLT syntax properly defines this table as a strictly incremental ingestion dataset?",
        "o": [
          "`CREATE MATERIALIZED VIEW raw_logs AS SELECT * FROM cloud_files('/mnt/raw/', 'json');` to refresh the entire table periodically on each run.",
          "`CREATE OR REFRESH STREAMING TABLE raw_logs AS SELECT * FROM STREAM read_files('/mnt/raw/', format => 'json');`",
          "`CREATE TEMPORARY TABLE raw_logs AS SELECT * FROM STREAMING_READ('/mnt/raw/') WITH OPTIONS ('mode'='incremental') in the metadata catalog.",
          "`CREATE EXTERNAL DELTA TABLE raw_logs LOCATION '/mnt/raw/' AS SELECT * FROM json.`/mnt/raw/` WHERE _is_new = true in the corporate central metastore.`"
        ],
        "a": 1,
        "e": "In Delta Live Tables with SQL, tables designed for purely incremental (append-only) ingestion and processing are defined with the syntax `CREATE OR REFRESH STREAMING TABLE <name> AS SELECT * FROM STREAM <source>`. The `STREAM` keyword tells DLT to consume the source as a continuous incremental flow.",
        "why": [
          "A `MATERIALIZED VIEW` recomputes its contents when the sources change; it is not designed for continuous append-only incremental ingestion.",
          null,
          "The `STREAMING_READ` syntax and `CREATE TEMPORARY TABLE` are not part of the Delta Live Tables declarative framework.",
          "`CREATE EXTERNAL DELTA TABLE` with an artificial `_is_new` filter does not use the streaming capabilities or the transactional tracking of DLT."
        ]
      },
      {
        "id": "dbd-36",
        "d": 3,
        "t": "Delta Live Tables: Materialized Views vs Streaming Tables",
        "q": "You are designing the Gold layer in a Delta Live Tables pipeline. The target table must compute the cumulative total amount and the number of transactions per customer from the Silver table, performing complex aggregations and requiring full consistency against historical data updates. Why should you choose a `Materialized View` instead of a `Streaming Table`?",
        "o": [
          "Because Materialized Views do not consume compute DBUs in Databricks, since they are processed entirely within the region's metastore.",
          "Because Streaming Tables are prohibited by specification from running any `WHERE` clause or applying logical filtering transformations.",
          "Because Materialized Views recompute and keep the aggregated state consistent when the data sources are modified or deleted.",
          "Because Streaming Tables can only store a maximum of 10,000 records before requiring a manual physical compaction command on disk."
        ],
        "a": 2,
        "e": "In Delta Live Tables, `Materialized Views` are designed specifically for complex transformations, joins, and aggregations in the Silver/Gold layers. When the source data undergoes modifications, insertions, or deletions, DLT recomputes and synchronizes the Materialized View state to reflect the exact current state of the business, whereas `Streaming Tables` are restricted to append-only incremental flows.",
        "why": [
          "Materialized Views consume standard cluster compute billed in DBUs when running the transformation queries.",
          "Streaming Tables can perfectly well apply `WHERE` clauses, transformations, and projections as long as the source is incremental.",
          null,
          "Streaming Tables scale fully to billions of rows; they have no arbitrary limit of 10,000 records."
        ]
      },
      {
        "id": "dbd-37",
        "d": 3,
        "t": "DLT: Quality Expectations (DROP ROW)",
        "q": "In a Delta Live Tables (DLT) pipeline, the data quality team stipulates the following rule: records with a null `customer_id` or an `age` under 18 must be silently dropped without stopping pipeline execution, recording the number of skipped records in the DLT metrics. Which expectation clause meets this requirement?",
        "o": [
          "`CONSTRAINT age_rule CHECK (customer_id IS NOT NULL AND age >= 18) ON ERROR SKIP RECORD in the corporate metadata catalog.`",
          "`EXPECT (customer_id IS NOT NULL AND age >= 18) ON VIOLATION ABORT PIPELINE with immediate notification to the on-call operations team.`",
          "`EXPECT (customer_id IS NOT NULL AND age >= 18) ON INVALID DISCARD INTO DLQ isolating non-conforming rows in a secondary audit table.`",
          "`CONSTRAINT valid_customers EXPECT (customer_id IS NOT NULL AND age >= 18) ON VIOLATION DROP ROW`"
        ],
        "a": 3,
        "e": "Delta Live Tables provides the `ON VIOLATION DROP ROW` clause within the expectation definition (`CONSTRAINT ... EXPECT ... ON VIOLATION DROP ROW`). This action automatically filters out and drops any row that does not satisfy the boolean condition, allowing valid rows to continue to the target table and recording the dropped-row metrics in the DLT Event Log.",
        "why": [
          "The `CHECK ... ON ERROR SKIP RECORD` syntax does not exist in the Delta Live Tables declarative specification.",
          "`ON VIOLATION ABORT PIPELINE` is not a valid clause; to abort execution, `ON VIOLATION FAIL UPDATE` is used.",
          "`ON INVALID DISCARD INTO DLQ` is not DLT syntax; isolating records in message queues is implemented with table-branching patterns.",
          null
        ]
      },
      {
        "id": "dbd-38",
        "d": 3,
        "t": "DLT: Quality Expectations (FAIL UPDATE vs Warn)",
        "q": "A regulatory bank reconciliation pipeline in Delta Live Tables cannot tolerate under any circumstances that the `transfer_amount` column is negative or null. If a single record violates this condition, the entire pipeline must stop immediately and mark the run as failed to alert the engineers. Which DLT expectation guarantees this behavior?",
        "o": [
          "`CONSTRAINT positive_amount EXPECT (transfer_amount > 0) ON VIOLATION FAIL UPDATE`",
          "`EXPECT (transfer_amount > 0) ON VIOLATION DROP ROW silently dropping the row to continue processing without errors.`",
          "`CONSTRAINT positive_amount EXPECT (transfer_amount > 0) only emitting a warning in the system's quality metrics log.`",
          "`EXPECT (transfer_amount > 0) ON ANOMALY RAISE CRITICAL ALERT stopping the network service of the corporate account's compute cluster.`"
        ],
        "a": 0,
        "e": "The `ON VIOLATION FAIL UPDATE` action is the strictest directive in Delta Live Tables expectations. If any processed row violates the boolean condition (`transfer_amount > 0`), DLT immediately aborts the pipeline update, prevents corrupt data from being persisted, and marks the job run as failed to trigger on-call alerts.",
        "why": [
          null,
          "`ON VIOLATION DROP ROW` would drop the row and continue execution successfully, which violates the strict regulatory requirement.",
          "Omitting the `ON VIOLATION` clause (the default expectation) only emits a warning in the logs but keeps the record and continues the pipeline.",
          "`ON ANOMALY RAISE CRITICAL ALERT` is not syntax recognized by the Delta Live Tables declarative compiler."
        ]
      },
      {
        "id": "dbd-39",
        "d": 4,
        "t": "Databricks Workflows: Job vs All-Purpose Compute",
        "q": "The data engineering team runs a series of daily pipelines scheduled through Databricks Workflows. Currently, all the tasks are configured to run on an existing interactive cluster ('All-Purpose Cluster') that stays on all day. The IT director asks to reduce the monthly DBU bill and isolate the runs. Which architectural change should be applied?",
        "o": [
          "Configure the notebooks to run on local clusters on the developers' workstations through SSH tunnels.",
          "Configure the Workflow tasks to use 'Job Clusters' (ephemeral automated clusters) created and destroyed on each run.",
          "Increase the number of workers of the current interactive cluster so the tasks finish in fewer minutes and reduce overall usage.",
          "Migrate the jobs to a standalone virtual machine without Apache Spark, using standard Python scripts run with crontab."
        ],
        "a": 1,
        "e": "`Job Clusters` (automated clusters for jobs) are the mandatory practice for production workloads in Databricks Workflows. Databricks creates them at the start of the job and destroys them immediately when it finishes, ensuring total resource isolation and billing at a significantly reduced DBU rate (~50-60% discount compared to interactive All-Purpose Clusters).",
        "why": [
          "Running corporate workloads through SSH tunnels on personal laptops breaks the security, scalability, and availability of the Lakehouse.",
          null,
          "Increasing the workers of an All-Purpose interactive cluster that stays active all day drastically increases DBU costs.",
          "Removing Apache Spark prevents processing large distributed volumes and forfeits the governance and optimization advantages of Databricks."
        ]
      },
      {
        "id": "dbd-40",
        "d": 4,
        "t": "Workflows: Orchestration and TaskValues",
        "q": "You have a Workflow with two tasks: Task A processes a batch of sales and computes the total number of anomalous records detected; Task B needs to read that numeric count to decide whether to generate an executive report or send an alert email. How are these dynamic parameters communicated between tasks of a DAG in Databricks Workflows?",
        "o": [
          "Write the value to a temporary file in `/tmp` of the worker node's local operating system and read it from Task B using shell commands.",
          "Create a shared-memory message queue using operating system environment variables exported on the interactive cluster.",
          "Use the task utility `dbutils.jobs.taskValues.set()` in Task A and `dbutils.jobs.taskValues.get()` in Task B.",
          "Overwrite the source code of Task B's notebook through a Databricks REST API call before its execution starts."
        ],
        "a": 2,
        "e": "`taskValues` is the built-in Databricks Workflows feature for passing small values and metadata between dependent tasks in the same DAG. The sending task calls `dbutils.jobs.taskValues.set(key, value)` and the downstream receiving task retrieves the value with `dbutils.jobs.taskValues.get(taskKey, key)` without requiring intermediate tables or external storage.",
        "why": [
          "The local `/tmp` directory is ephemeral and resides on different nodes that can be destroyed between tasks, preventing data sharing.",
          "Operating system environment variables are not propagated between different clusters or between decoupled tasks of a Workflow.",
          null,
          "Modifying notebook source code through the REST API during an ongoing run is an unsafe and discouraged practice."
        ]
      },
      {
        "id": "dbd-41",
        "d": 4,
        "t": "Workflows: Recovery with Repair and Rerun",
        "q": "A Databricks Workflows job made up of a DAG of 6 chained tasks runs overnight. The first three tasks (ingestion, validation, and filtering) complete successfully after two hours of compute, but the fourth task fails due to a transient connection error with a geolocation service. After fixing the issue in the external service, what is the most efficient way to relaunch the job?",
        "o": [
          "Delete the job's run history in the Databricks user interface and schedule a new immediate trigger for the entire pipeline.",
          "Clone the entire Workflow, creating a duplicate copy in the workspace that contains only the remaining tasks of the graph.",
          "Rerun the job from the beginning with the 'Run now' button, letting the three initial tasks consume two hours of compute again.",
          "Use the 'Repair and Rerun' feature on the failed run to rerun only task 4 and its downstream dependent tasks."
        ],
        "a": 3,
        "e": "The **Repair and Rerun** feature of Databricks Workflows lets you relaunch a failed run, processing only the tasks that failed and those that depend on them downstream in the DAG. It respects and preserves the successful results of the previous tasks, saving hours of compute and unnecessary DBU costs.",
        "why": [
          "Deleting the history removes the audit trail and does not solve the need to resume processing the flow.",
          "Manually cloning the Workflow for each failure is inefficient, creates clutter in the workspace, and complicates maintenance.",
          "Rerunning the entire job from scratch wastes two hours of compute and costs on tasks that already completed successfully.",
          null
        ]
      },
      {
        "id": "dbd-42",
        "d": 4,
        "t": "Cluster Policies",
        "q": "Your company's finance department detects cost overruns in the cloud bill because some developers forget to shut down their interactive clusters over the weekend and provision GPU instances for tasks that only require basic SQL. Which two measures implemented through `Cluster Policies` solve these cost governance problems? (Choose 2 answers)",
        "o": [
          "Completely disable the Unity Catalog service across the whole workspace so that no one can provision virtual machines.",
          "Enforce a mandatory maximum value in `autotermination_minutes` (e.g., 20 minutes) to force automatic shutdown after inactivity.",
          "Restrict the allowed instance families in `node_type_id`, blocking the selection of GPU or excessively costly machine types.",
          "Configure a bash script that randomly kills Java processes on the driver whenever memory usage exceeds 50 percent."
        ],
        "a": [
          1,
          2
        ],
        "e": "**Cluster Policies** are the central compute governance and FinOps tool in Databricks. They allow administrators to: 1) Enforce an auto-termination rule (`autotermination_minutes`) that shuts down idle clusters after a predefined time. 2) Limit the allowed instance families (`node_type_id`), preventing the provisioning of costly types such as GPUs except in authorized projects.",
        "why": [
          "Unity Catalog is the data governance engine and has no relation to forcing virtual machine shutdown.",
          null,
          null,
          "Randomly killing Java processes would cause catastrophic failures and inconsistencies instead of implementing an orderly cost policy."
        ]
      },
      {
        "id": "dbd-43",
        "d": 4,
        "t": "Version Control: Databricks Repos",
        "q": "A team of 10 data engineers needs to collaborate on the same code repository containing notebooks and modules in `.py` files. They want to work with standard Git flows (creating development branches, pull requests, and testing before merging into the `main` branch) and ensure that production jobs run stable versioned code. Which native Databricks solution provides this integration?",
        "o": [
          "Manually export each notebook to a compressed `.dbc` file at the end of the day and email it to the data tech lead.",
          "Copy the notebook code into a shared Delta table in the Bronze layer and synchronize versions through concurrent `MERGE INTO` statements.",
          "Install a local Git server on the driver node of the interactive cluster, running a daemon service through Linux terminal commands.",
          "Use `Databricks Repos`, connecting the workspace with remote Git providers to manage branches, commits, and version control at the user level."
        ],
        "a": 3,
        "e": "`Databricks Repos` integrates the Databricks environment with external Git providers (GitHub, GitLab, Azure DevOps, Bitbucket). It allows developers to work on individual branches, sync changes with `git pull` and `git push`, import modular `.py` modules, and configure production Workflows jobs to point to stable tags or release branches.",
        "why": [
          "Manually exporting `.dbc` files by email provides no version control, makes merging difficult, and is prone to serious human error.",
          "Storing source code in Delta tables as text strings is not a version control system and does not support Git flows.",
          "Installing a Git server on the driver is not scalable, lacks high availability, and is destroyed when the interactive cluster restarts.",
          null
        ]
      },
      {
        "id": "dbd-44",
        "d": 4,
        "t": "Monitoring and Alerts in Workflows",
        "q": "A multi-task bank reconciliation pipeline scheduled in Databricks Workflows is critical for the stock market opening. If the job fails or its duration extends beyond 45 minutes (business SLA), the SRE operations team must receive a high-priority notification in its incident channel. How is this monitoring configured in Databricks Workflows?",
        "o": [
          "Create an interactive notebook in a `while True` loop that queries the Databricks REST API every 5 seconds and sends network alerts over a socket.",
          "Configure job notifications in the Workflows interface, associating a Webhook destination or email for failure events and duration SLA thresholds.",
          "Visually inspect the Databricks console every morning at 06:00 AM by manually refreshing the page in a web browser.",
          "Modify the Linux kernel on the worker virtual machines to emit SNMP signals to a local monitoring gateway on the intranet."
        ],
        "a": 1,
        "e": "Databricks Workflows includes native support for **Alerts and Notifications**. It lets you configure notification rules for job events (start, success, failure) and runtime SLA thresholds (e.g., alert if the duration exceeds 45 minutes). Notifications are automatically dispatched to email addresses or system destinations such as Webhooks (Slack, PagerDuty, MS Teams).",
        "why": [
          "An infinite loop in a notebook needlessly consumes an entire cluster and adds operational fragility compared to the job's native alerts.",
          null,
          "Manual inspection is not scalable, does not provide real-time alerts, and does not guarantee compliance with critical SLAs.",
          "Modifying the Linux kernel on ephemeral nodes is impractical, violates the managed architecture, and is lost every time the cluster is recreated."
        ]
      },
      {
        "id": "dbd-45",
        "d": 4,
        "t": "CI/CD with Databricks Asset Bundles (DABs)",
        "q": "Your organization adopts DevOps practices for data and requires that all Delta Live Tables pipelines, Workflows jobs, and associated permissions be defined as code (IaC), automatically tested in GitHub Actions pipelines, and deployed programmatically to development, staging, and production environments. Which official Databricks tool is designed specifically for this workflow?",
        "o": [
          "The interactive `dbfs cp` command built into the Linux terminal client to transfer notebooks from one folder to another in the metastore.",
          "A bash script that generates screenshots of the graphical interface and sends them to the workspace administrators for manual approval.",
          "`Databricks Asset Bundles (DABs)`, which lets you manage projects as declarative code through YAML files and the Databricks CLI.",
          "The `pip` package manager to compile the entire corporate workspace as a closed binary wheel distribution of pure Python."
        ],
        "a": 2,
        "e": "`Databricks Asset Bundles (DABs)` is the official Databricks framework for implementing CI/CD and Infrastructure as Code (IaC). It lets you define complete project structures (DLT pipelines, jobs, permissions, compute) in declarative YAML files (`databricks.yml`), validate them with `databricks bundle validate`, and deploy them to multiple environments with `databricks bundle deploy` through CI/CD tools such as GitHub Actions or GitLab CI.",
        "why": [
          "`dbfs cp` only copies files to storage; it does not define declarative pipelines, jobs, dependencies, or infrastructure as code.",
          "Screenshots and manual approvals are the opposite of the CI/CD automation recommended by modern DevOps practices.",
          null,
          "`pip` and wheels compile Python code libraries, but they do not orchestrate jobs, DLT pipelines, or infrastructure in Databricks workspaces."
        ]
      },
      {
        "id": "dbd-46",
        "d": 4,
        "t": "Compute Optimization: Autoscaling and Spot Instances",
        "q": "A daily ETL processing pipeline experiences extreme volume fluctuations: on Mondays it processes 100 million records because of the weekend backlog, but from Tuesday to Friday it processes only 10 million. If a large static cluster is provisioned, budget is wasted during the week; if a small one is provisioned, the Monday pipeline misses its SLA. Which cluster configuration balances cost and performance?",
        "o": [
          "Provision a static cluster with 100 fixed dedicated nodes and leave it running permanently to guarantee capacity in the worst possible case.",
          "Run the pipeline on the driver node exclusively, disabling all worker nodes to avoid Spark's inter-node network cost.",
          "Purchase a fixed 3-year reservation of cloud compute instances for the interactive cluster regardless of the actual recorded usage.",
          "Enable cluster autoscaling (`Autoscaling`) with a range of workers (e.g., 2 to 20) and use Spot instances for the secondary workers."
        ],
        "a": 3,
        "e": "Cluster **autoscaling** (`Autoscaling`) lets Databricks dynamically add worker nodes when the workload and the number of Spark stages require it (e.g., the Monday peak) and remove them when demand drops. Combining it with **Spot instances** for the workers (keeping the driver node on an on-demand instance) drastically reduces cloud infrastructure cost.",
        "why": [
          "A massive static cluster running continuously generates unacceptable budget waste on low-demand days.",
          "Running everything on the driver eliminates Spark's distributed parallelism and causes catastrophic out-of-memory (OutOfMemory) failures.",
          "Fixed 3-year reservations for elastic workloads with occasional peaks do not take advantage of the cloud's intrinsic elasticity and increase the TCO.",
          null
        ]
      },
      {
        "id": "dbd-47",
        "d": 5,
        "t": "Unity Catalog: 3-Level Namespace",
        "q": "A data engineer at a multinational corporation needs to unambiguously reference the customers table located in the sales domain of the production environment governed by Unity Catalog. What is the canonical three-level namespace format that must be used in SQL queries?",
        "o": [
          "`cluster.database.table` (for example, `etl_cluster_01.sales.customers`), identifying the cluster that processes the query in real time.",
          "`metastore.workspace.table` (for example, `global_ms.workspace_01.customers`), identifying the regional metastore and the local workspace.",
          "`bucket.folder.table` (for example, `s3_lakehouse.sales_curated.customers`), identifying the physical path in the cloud object storage.",
          "`catalog.schema.table` (for example, `prod_corp.sales.customers`), identifying the catalog, schema (database), and table."
        ],
        "a": 3,
        "e": "Unity Catalog standardizes object resolution through a hierarchical **3-level namespace**: `<catalog>.<schema>.<table>` (or view / volume / model). The first level (`catalog`) usually represents the environment or business domain, the second (`schema` or database) the functional logical grouping, and the third (`table`) the specific data entity.",
        "why": [
          "Tables are fully decoupled from compute clusters in Unity Catalog; they are not named after the cluster that runs them.",
          "The metastore and the workspace are management infrastructure levels; they are not part of the SQL syntax for querying data.",
          "`bucket.folder.table` describes physical storage paths, whereas Unity Catalog provides a unified logical governance abstraction.",
          null
        ]
      },
      {
        "id": "dbd-48",
        "d": 5,
        "t": "Unity Catalog: Credentials and External Locations",
        "q": "The cloud security team strictly prohibits data engineers from having access to AWS IAM access keys or connections with secret text strings in notebooks. However, the engineers must be able to read and write files in the path `s3://empresa-datalake/silver/`. How does Unity Catalog solve this secure access requirement?",
        "o": [
          "Configure the AWS credentials in plain text inside a `.bashrc` file on the driver node of each virtual machine in the interactive cluster.",
          "Ask developers to request a temporary STS token every morning and paste it as a comment in the first cell of the working notebook.",
          "Create a `Storage Credential` with a managed IAM Role and associate it with an `External Location` that governs the bucket URL in Unity Catalog.",
          "Open the S3 bucket with public read and write access for the range of the company office's public IP addresses."
        ],
        "a": 2,
        "e": "Unity Catalog decouples cloud authentication through two securable objects: 1) `Storage Credential`, which encapsulates a managed cloud identity (IAM Role on AWS, Managed Identity on Azure, Service Account on GCP) configured by metastore administrators. 2) `External Location`, which combines that credential with a storage URL (`s3://...`). Users are granted SQL permissions on the External Location without seeing or handling credentials.",
        "why": [
          "Storing IAM keys in text files on the driver violates all security policies and exposes credentials to any user of the cluster.",
          "Pasting manual tokens into notebooks is insecure, prone to leaks in Git, and does not meet Unity Catalog's centralized auditing.",
          null,
          "Making a bucket public represents a very serious security breach and exposes all confidential corporate data on the internet."
        ]
      },
      {
        "id": "dbd-49",
        "d": 5,
        "t": "Unity Catalog: Granular Security (Row Filters & Column Masks)",
        "q": "A table contains employee payroll and salaries (`employees_silver`). The human resources leadership requires that: 1) analysts can only view employees belonging to their own country (`country_id`); 2) the `salary` field be visible in clear text to the `hr_directors` group, but appear as `NULL` or masked for all other users. Which two Unity Catalog mechanisms make it possible to meet these guidelines without duplicating the physical table? (Choose 2 answers)",
        "o": [
          "Apply a `Row Filter` on the table through a SQL function that checks `is_account_group_member()` and dynamically filters the `country_id` field.",
          "Apply a `Column Mask` on the `salary` column through a SQL function that obfuscates the value for users who do not belong to the authorized group.",
          "Create a separate physical cluster for each country and duplicate the Parquet files into 50 different storage buckets in the public cloud.",
          "Run a nightly script that rewrites the table, permanently removing the salary column from the files in object storage."
        ],
        "a": [
          0,
          1
        ],
        "e": "Unity Catalog provides native granular access control without duplicating data: 1) **Row Filters**: SQL functions that return a boolean to restrict which rows each user can see based on their membership in corporate groups (`ROW FILTER`). 2) **Column Masks**: SQL functions applied to individual columns (`SET MASK`) that conditionally mask or return obfuscated values.",
        "why": [
          null,
          null,
          "Creating separate clusters and duplicating files into 50 buckets creates a maintenance nightmare, desynchronization, and massive cost overruns.",
          "Physically deleting the salary column destroys the information and prevents the human resources department from legitimately querying the data."
        ]
      },
      {
        "id": "dbd-50",
        "d": 5,
        "t": "Unity Catalog: Automated Data Lineage",
        "q": "The regulatory compliance team asks to audit how the `ingreso_neto` metric is calculated in the annual financial report and which source tables feed that specific column. How does the **Data Lineage** feature of Unity Catalog help answer this audit without manually documenting the code?",
        "o": [
          "It forces engineers to manually declare each transformation in a shared spreadsheet before approving any code pull request.",
          "It installs an external agent on each developer's computer to record keystrokes while notebooks are edited in the workspace.",
          "It runs a static code analyzer that sends the notebook text to a third-party language model to deduce the theoretical relationships.",
          "It automatically generates table-level and column-level lineage diagrams captured at runtime during the queries executed in Databricks."
        ],
        "a": 3,
        "e": "Unity Catalog automatically captures **data lineage (Data Lineage)** at the table and column level at runtime for any SQL or DataFrame query run on the workspace clusters. This lets auditors and administrators graphically visualize in the user interface the origin of the data, the intermediate transformations, and the destination of each column without requiring manual code instrumentation.",
        "why": [
          "Manual documentation in spreadsheets is prone to becoming outdated immediately and does not provide verifiable traceability in audits.",
          "Capturing keystrokes on user computers is a privacy violation and does not provide technical lineage of the data tables.",
          "Unity Catalog does not send code to third-party LLMs to guess lineage; it captures it deterministically from Spark's physical execution plan.",
          null
        ]
      }
    ],
    "why": {
      "dbd-01": [
        null,
        "Delta Lake operates on standard cloud object storage (S3, ADLS, GCS); it does not require HDFS clusters or coordination through Apache ZooKeeper.",
        "The Lakehouse architecture processes data directly in the open Data Lake; it does not duplicate data into an external proprietary Data Warehouse.",
        "The transaction log resides in persistent storage (`_delta_log`), not in the volatile memory of the driver node."
      ],
      "dbd-02": [
        "Discarding data in the Bronze layer destroys historical traceability and makes it impossible to recover information if the schema discrepancy was valid.",
        null,
        "Normalization, unnesting, and deduplication are Silver layer transformations, not part of the raw Bronze ingestion layer.",
        "Hourly aggregations and dimensional models belong to the Gold layer; applying them at initial ingestion skips the refinement and auditing phases."
      ],
      "dbd-03": [
        "Final aggregated metrics and KPIs belong to the Gold layer; the Silver layer keeps the detailed grain of the business entities.",
        "An identical mirror without validations is the Bronze layer itself, and lacks the filtering and cleansing characteristic of Silver.",
        null,
        "Destructive anonymization of primary keys destroys the referential integrity required in Silver; security is implemented with masks and filters in Unity Catalog."
      ],
      "dbd-04": [
        "Querying raw Bronze JSON files in real time would generate massive load and unacceptable latencies for a concurrent BI dashboard.",
        "Unoptimized CSV files lack data skipping statistics (`data skipping`), resulting in slow reads and compute overhead.",
        null,
        "Running joins of 15 raw tables on every query generates very high latencies and wastes resources compared with a precomputed Gold table."
      ],
      "dbd-05": [
        null,
        "Delta Lake does not use heavy full-table locks (pessimistic locking); its OCC model allows concurrent writes if there is no file conflict.",
        "Delta Lake guarantees immediate transactional consistency on each commit; it does not defer consistency to nightly asynchronous processes.",
        "Delta does not systematically reject concurrent transactions; it only aborts if there is a real modification conflict on the same data files."
      ],
      "dbd-06": [
        null,
        "Manually overwriting files in the bucket corrupts the `_delta_log` transaction log and can cause severe inconsistencies in the catalog.",
        "Re-ingesting the entire history takes hours or days of unnecessary compute, whereas `RESTORE TABLE` completes in a few seconds using metadata.",
        "Spark SQL and Delta Lake do not use session-based transactions with `ROLLBACK TRANSACTION`; transactions are committed atomically with each command."
      ],
      "dbd-07": [
        "`VACUUM` does not compact files; it purges logically deleted files. Running it with zero retention can also corrupt in-flight transactions.",
        null,
        "Manually manipulating files in storage alters the physical structure without updating the `_delta_log`, corrupting the Delta table.",
        "Migrating to CSV would drastically worsen performance by losing the columnar format, Snappy compression, and data skipping statistics."
      ],
      "dbd-08": [
        null,
        "`Z-ORDER` does not dynamically adapt its keys; it requires manually re-running the `OPTIMIZE ... ZORDER BY` command to reorganize the data.",
        null,
        "Physically partitioning by high-cardinality columns generates millions of micro-folders (over-partitioning), severely degrading performance."
      ],
      "dbd-09": [
        null,
        "`VACUUM` is a disk maintenance operation; it does not affect the Photon execution engine or the query compiler configuration.",
        "Unity Catalog privileges are managed in the metastore; the physical purge of data files does not alter the assigned RBAC permissions.",
        "`VACUUM` only deletes physically unreferenced files; it does not modify the logical schema of the columns or their data types."
      ],
      "dbd-10": [
        "In a `Managed Table`, the `DROP TABLE` command removes both the metadata and the physical data files in the bucket.",
        "A `GLOBAL TEMP VIEW` disappears when the Spark application/cluster terminates and does not durably persist data in the catalog.",
        null,
        "A view does not store data by itself; the stated need is to create a persistent table that protects the underlying physical files."
      ],
      "dbd-11": [
        "Workers do not persist master metadata on their local disks; the state is derived dynamically from the `_delta_log` in object storage.",
        null,
        "Delta Lake does not arbitrarily delete earlier JSON files; it keeps them to enable Time Travel according to the configured log retention.",
        "Scanning the files directly without consulting the `_delta_log` would ignore the transaction records, reading corrupt or deleted data."
      ],
      "dbd-12": [
        null,
        "SQL Warehouses use CPUs and can use Photon; they do not require GPU hardware or CUDA compilation for relational SQL.",
        "Koalas is a Pandas-compatible API on PySpark; it does not accelerate complex SQL queries or replace the distributed execution engine.",
        "GraphX is a library for graph computation; it is not an acceleration engine for relational queries or standard ELT pipelines."
      ],
      "dbd-13": [
        "The `OPEN FILE` statement does not exist in Spark SQL syntax or in Databricks' ANSI SQL standard.",
        null,
        "The `IMPORT TABLE` command is not valid syntax for querying files ad hoc in Spark SQL.",
        "`READ_PARQUET` is not a Spark SQL scalar function to invoke in WHERE clauses; direct table notation or the DataFrame API is used."
      ],
      "dbd-14": [
        "`INSERT INTO ... SELECT` blindly inserts all records returned by the query, duplicating data if retried after a partial failure.",
        "Moving files with bash is fragile, prone to concurrency errors, and provides no ACID transactionality in the database.",
        null,
        "`CREATE OR REPLACE TABLE` destroys the previous historical data on each run, preventing incremental accumulation of historical data."
      ],
      "dbd-15": [
        "Regular expressions with `regexp_extract` are slow, brittle against minor changes in the JSON format, and prone to parsing errors.",
        "A row-by-row Python UDF suffers a severe performance penalty from IPC serialization between the JVM and the Python interpreter.",
        "Using `split()` assumes a strict positional order in the JSON, which fails as soon as the fields change order or contain internal commas.",
        null
      ],
      "dbd-16": [
        null,
        "`FILTER` only evaluates boolean predicates to keep or discard elements; it does not transform the values of the array elements.",
        "`EXPLODE_TRANSFORM` does not exist in the Spark SQL specification or in Databricks.",
        "`MAP_VALUES` operates on key-value map data types (`MAP<K, V>`), not on primitive arrays (`ARRAY<T>`)."
      ],
      "dbd-17": [
        "It is not possible to access fields of an `ARRAY<STRUCT>` directly with scalar notation without unnesting or using higher-order functions.",
        null,
        "`ARRAY_CONTAINS` only evaluates equality against simple literal elements and cannot evaluate multiple correlated conditions together with price predicates.",
        "`COUNT_IF` is an aggregate function over table columns, not a higher-order function for nested arrays."
      ],
      "dbd-18": [
        "`dropDuplicates` does not guarantee keeping the most recent row after a distributed sort, because internal partitions can alter the partition order.",
        null,
        "`FIRST(quantity)` without ordering is nondeterministic and can return any arbitrary value across successive executions.",
        null
      ],
      "dbd-19": [
        "Running `UPDATE` followed by `INSERT` makes two independent transactions that can cause race conditions and redundant table scans.",
        "`INSERT OVERWRITE` overwrites the existing data, deleting all customers that are not present in the current batch of updates.",
        null,
        "`UNION ALL` plus `OPTIMIZE` simply accumulates duplicates in the table without updating records or reconciling customer versions."
      ],
      "dbd-20": [
        "The `DROP ROW` syntax does not exist in the standard SQL `MERGE INTO` statement or in Delta Lake (the `DELETE` keyword is used).",
        "Databricks does not support traditional OLTP database triggers, and REST calls would add unacceptable latency to the data pipeline.",
        "A sequential Python loop issuing individual `DELETE` statements generates thousands of unnecessary commits in the `_delta_log` and degrades the cluster.",
        null
      ],
      "dbd-21": [
        null,
        "Standard Python UDFs suffer extreme row-by-row serialization overhead (Py4J/IPC), making them the slowest alternative in Spark.",
        "Although Pandas UDFs are much faster than standard Python UDFs, they still incur Arrow serialization costs compared to a native SQL UDF.",
        "Catalyst cannot optimize inside the Python interpreter in a standard Python UDF; the performance difference is usually 10x to 100x."
      ],
      "dbd-22": [
        "`date_format()` converts the timestamp to `STRING`, which degrades the performance of indexes, temporal comparisons, and data skipping operations.",
        null,
        "The `TRUNCATE_TIME` function does not exist in the Spark SQL specification or in Databricks.",
        "`TO_MONTH_START` is not a Spark SQL function; months have variable lengths (28-31 days) that cannot be computed with fixed multiples."
      ],
      "dbd-23": [
        "The arrow operator `->` is used in lambda functions (higher-order functions), not to access attributes of a `STRUCT`.",
        "The `EXTRACT_FIELD` function is not part of the Spark SQL built-in function library.",
        null,
        "Bracket indexing with strings (`col['clave']`) is reserved for `MAP` types, not for strongly typed attributes of a `STRUCT`."
      ],
      "dbd-24": [
        "`explode()` automatically discards any row where the array is null or empty, losing the orders without items.",
        "`posexplode()` adds a position index column but also discards empty or null rows just like standard `explode()`.",
        "`unnest_all()` is not a Spark SQL function in Databricks.",
        null
      ],
      "dbd-25": [
        null,
        "Temporary views are not registered in Unity Catalog or the Hive Metastore; therefore, they do not support access-control `GRANT` statements.",
        "Temporary views can query any format supported by Spark, including Delta, Parquet, CSV, and JSON with no restrictions.",
        "That Spark configuration property does not exist; session isolation is intrinsic to the lifecycle of a temporary view."
      ],
      "dbd-26": [
        "`ROW_NUMBER()` would break the tie by arbitrarily and nondeterministically assigning position 1 to one and position 2 to the other.",
        null,
        "`RANK()` would leave a gap after the two-way tie, assigning position 3 to the next employee instead of the required position 2.",
        "`PERCENT_RANK()` computes a relative decimal fraction between 0 and 1, not an ordinal integer ranking position."
      ],
      "dbd-27": [
        "`WITH RECURSIVE` is used for recursive queries over graphs or hierarchical trees of records; it is not a clause for subtotals in `GROUP BY`.",
        "`CUBE` generates all possible combinations of dimensions, producing unnecessary non-hierarchical subtotals and increasing the computational cost.",
        null,
        "`ORDER BY TOTALS` is not a valid clause in Spark SQL for synthesizing aggregated subtotal rows."
      ],
      "dbd-28": [
        "Structured Streaming does not generate temporary CSV files for polling; it processes micro-batches in memory, or continuously, directly into Delta sinks.",
        "Structured Streaming does not depend on synchronous REST services or intermediate relational databases to coordinate distributed ingestion.",
        "Spark computation is based on RDDs and DataFrames distributed across JVM executors, not on graphs managed by CPython on the driver.",
        null
      ],
      "dbd-29": [
        null,
        "`complete` rewrites the entire table on each trigger and is only allowed in queries with aggregations; it would fail on a simple ingestion without groupings.",
        "`update` emits modified rows and, in streaming without aggregations, behaves equivalently to append, but it does not compute row hashes.",
        "`snapshot` does not exist as an output mode in Apache Spark Structured Streaming or in Databricks."
      ],
      "dbd-30": [
        "Spark does not use SQLite on the driver to store checkpoints; the driver's ephemeral disk is destroyed when the cluster restarts.",
        null,
        "Re-requesting all the history from the beginning would violate exactly-once semantics and generate massive duplicates in the sinks.",
        "Databricks and Spark Structured Streaming do not use Apache ZooKeeper for checkpoint management or offset coordination."
      ],
      "dbd-31": [
        "Disabling incremental listing would force full bucket scans, worsening the performance problem instead of solving it.",
        "`COPY INTO` on buckets with tens of millions of files also suffers from high file-listing latencies compared to event queues.",
        null,
        "Launching 1,000 nodes to run `ls` commands generates prohibitive costs and excessive calls that cause throttling on the S3 API."
      ],
      "dbd-32": [
        null,
        "`cloudFiles.enforceStrictTypes` is not a valid Auto Loader option, and silently converting to zero would cause undetectable corruption in numeric data.",
        "Auto Loader does not silently discard files; its design prioritizes no data loss by rescuing anomalies in `_rescued_data`.",
        null
      ],
      "dbd-33": [
        "`continuous` keeps the cluster running 24/7 with continuous DBU consumption, contradicting the requirement of a nightly run followed by shutdown.",
        "`processingTime = '1 hour'` runs the stream in an infinite loop every hour without shutting down the cluster after processing the day's data.",
        "`Trigger.Once` is deprecated in favor of `Trigger.AvailableNow` because it processed all pending data in a single uncontrolled micro-batch.",
        null
      ],
      "dbd-34": [
        null,
        "`dropOldEvents` does not exist in the Apache Spark Structured Streaming API or in Databricks.",
        "`setTimeToLive` is not a Spark function; Structured Streaming manages its state through State Stores (HDFS or RocksDB) governed by watermarks.",
        "Using `current_timestamp()` in streaming is nondeterministic and does not allow the engine to deduce when to close and emit past aggregation windows."
      ],
      "dbd-35": [
        "A `MATERIALIZED VIEW` recomputes its contents when the sources change; it is not designed for continuous append-only incremental ingestion.",
        null,
        "The `STREAMING_READ` syntax and `CREATE TEMPORARY TABLE` are not part of the Delta Live Tables declarative framework.",
        "`CREATE EXTERNAL DELTA TABLE` with an artificial `_is_new` filter does not use the streaming capabilities or the transactional tracking of DLT."
      ],
      "dbd-36": [
        "Materialized Views consume standard cluster compute billed in DBUs when running the transformation queries.",
        "Streaming Tables can perfectly well apply `WHERE` clauses, transformations, and projections as long as the source is incremental.",
        null,
        "Streaming Tables scale fully to billions of rows; they have no arbitrary limit of 10,000 records."
      ],
      "dbd-37": [
        "The `CHECK ... ON ERROR SKIP RECORD` syntax does not exist in the Delta Live Tables declarative specification.",
        "`ON VIOLATION ABORT PIPELINE` is not a valid clause; to abort execution, `ON VIOLATION FAIL UPDATE` is used.",
        "`ON INVALID DISCARD INTO DLQ` is not DLT syntax; isolating records in message queues is implemented with table-branching patterns.",
        null
      ],
      "dbd-38": [
        null,
        "`ON VIOLATION DROP ROW` would drop the row and continue execution successfully, which violates the strict regulatory requirement.",
        "Omitting the `ON VIOLATION` clause (the default expectation) only emits a warning in the logs but keeps the record and continues the pipeline.",
        "`ON ANOMALY RAISE CRITICAL ALERT` is not syntax recognized by the Delta Live Tables declarative compiler."
      ],
      "dbd-39": [
        "Running corporate workloads through SSH tunnels on personal laptops breaks the security, scalability, and availability of the Lakehouse.",
        null,
        "Increasing the workers of an All-Purpose interactive cluster that stays active all day drastically increases DBU costs.",
        "Removing Apache Spark prevents processing large distributed volumes and forfeits the governance and optimization advantages of Databricks."
      ],
      "dbd-40": [
        "The local `/tmp` directory is ephemeral and resides on different nodes that can be destroyed between tasks, preventing data sharing.",
        "Operating system environment variables are not propagated between different clusters or between decoupled tasks of a Workflow.",
        null,
        "Modifying notebook source code through the REST API during an ongoing run is an unsafe and discouraged practice."
      ],
      "dbd-41": [
        "Deleting the history removes the audit trail and does not solve the need to resume processing the flow.",
        "Manually cloning the Workflow for each failure is inefficient, creates clutter in the workspace, and complicates maintenance.",
        "Rerunning the entire job from scratch wastes two hours of compute and costs on tasks that already completed successfully.",
        null
      ],
      "dbd-42": [
        "Unity Catalog is the data governance engine and has no relation to forcing virtual machine shutdown.",
        null,
        null,
        "Randomly killing Java processes would cause catastrophic failures and inconsistencies instead of implementing an orderly cost policy."
      ],
      "dbd-43": [
        "Manually exporting `.dbc` files by email provides no version control, makes merging difficult, and is prone to serious human error.",
        "Storing source code in Delta tables as text strings is not a version control system and does not support Git flows.",
        "Installing a Git server on the driver is not scalable, lacks high availability, and is destroyed when the interactive cluster restarts.",
        null
      ],
      "dbd-44": [
        "An infinite loop in a notebook needlessly consumes an entire cluster and adds operational fragility compared to the job's native alerts.",
        null,
        "Manual inspection is not scalable, does not provide real-time alerts, and does not guarantee compliance with critical SLAs.",
        "Modifying the Linux kernel on ephemeral nodes is impractical, violates the managed architecture, and is lost every time the cluster is recreated."
      ],
      "dbd-45": [
        "`dbfs cp` only copies files to storage; it does not define declarative pipelines, jobs, dependencies, or infrastructure as code.",
        "Screenshots and manual approvals are the opposite of the CI/CD automation recommended by modern DevOps practices.",
        null,
        "`pip` and wheels compile Python code libraries, but they do not orchestrate jobs, DLT pipelines, or infrastructure in Databricks workspaces."
      ],
      "dbd-46": [
        "A massive static cluster running continuously generates unacceptable budget waste on low-demand days.",
        "Running everything on the driver eliminates Spark's distributed parallelism and causes catastrophic out-of-memory (OutOfMemory) failures.",
        "Fixed 3-year reservations for elastic workloads with occasional peaks do not take advantage of the cloud's intrinsic elasticity and increase the TCO.",
        null
      ],
      "dbd-47": [
        "Tables are fully decoupled from compute clusters in Unity Catalog; they are not named after the cluster that runs them.",
        "The metastore and the workspace are management infrastructure levels; they are not part of the SQL syntax for querying data.",
        "`bucket.folder.table` describes physical storage paths, whereas Unity Catalog provides a unified logical governance abstraction.",
        null
      ],
      "dbd-48": [
        "Storing IAM keys in text files on the driver violates all security policies and exposes credentials to any user of the cluster.",
        "Pasting manual tokens into notebooks is insecure, prone to leaks in Git, and does not meet Unity Catalog's centralized auditing.",
        null,
        "Making a bucket public represents a very serious security breach and exposes all confidential corporate data on the internet."
      ],
      "dbd-49": [
        null,
        null,
        "Creating separate clusters and duplicating files into 50 buckets creates a maintenance nightmare, desynchronization, and massive cost overruns.",
        "Physically deleting the salary column destroys the information and prevents the human resources department from legitimately querying the data."
      ],
      "dbd-50": [
        "Manual documentation in spreadsheets is prone to becoming outdated immediately and does not provide verifiable traceability in audits.",
        "Capturing keystrokes on user computers is a privacy violation and does not provide technical lineage of the data tables.",
        "Unity Catalog does not send code to third-party LLMs to guess lineage; it captures it deterministically from Spark's physical execution plan.",
        null
      ]
    },
    "glossary": [
      {
        "term": "Delta Lake",
        "cat": "Lakehouse & Delta",
        "d": 1,
        "def": "Open storage layer that brings ACID transactions, versioning (Time Travel), and scalable metadata to Data Lakes based on Apache Parquet.",
        "tip": "It guarantees serializability and optimistic concurrency control (OCC) directly on cloud object storage."
      },
      {
        "term": "_delta_log",
        "cat": "Lakehouse & Delta",
        "d": 1,
        "def": "Internal Delta Lake metadata directory that stores the atomic commit log in JSON files and compacted checkpoints in Parquet format every 10 transactions.",
        "tip": "It allows the exact state of the table to be reconstructed in memory without performing costly file listings in the cloud bucket."
      },
      {
        "term": "Medallion Architecture",
        "cat": "Lakehouse & Delta",
        "d": 1,
        "def": "Architectural design pattern in the Lakehouse structured in three progressive quality layers: Bronze (raw), Silver (cleaned and enriched), and Gold (business aggregate).",
        "tip": "Bronze should always be append-only and keep the data without destructive business transformations for auditing and reprocessing."
      },
      {
        "term": "Liquid Clustering",
        "cat": "Lakehouse & Delta",
        "d": 1,
        "def": "Modern physical data management mechanism in Delta Lake that replaces rigid physical partitioning and Z-Order by dynamically reorganizing data with CLUSTER BY.",
        "tip": "It avoids over-partitioning and data skew, allowing the clustering columns to be redefined without having to rewrite the entire table."
      },
      {
        "term": "OPTIMIZE & Z-ORDER",
        "cat": "Lakehouse & Delta",
        "d": 1,
        "def": "Delta Lake maintenance command that compacts small files (bin-packing of ~1 GB) and multidimensionally sorts the data for data skipping.",
        "tip": "Z-ORDER is only effective on high-cardinality columns commonly used in WHERE filters; it should not be applied to very low-cardinality columns."
      },
      {
        "term": "VACUUM",
        "cat": "Lakehouse & Delta",
        "d": 1,
        "def": "Garbage collection command in Delta Lake that physically purges the Parquet files marked as deleted that exceed the configured retention period.",
        "tip": "The default retention period is 7 days (168 hours); running it with zero retention breaks Time Travel and risks corrupting concurrent reads."
      },
      {
        "term": "Time Travel",
        "cat": "Lakehouse & Delta",
        "d": 1,
        "def": "Native Delta Lake capability to query or restore historical snapshots of a table using version numbers or timestamps.",
        "tip": "It is invoked with VERSION AS OF or TIMESTAMP AS OF, and a table is reverted to a previous state with RESTORE TABLE."
      },
      {
        "term": "Managed vs External Tables",
        "cat": "Lakehouse & Delta",
        "d": 1,
        "def": "Table differentiation in Databricks: Managed manages both the metadata and the physical files; External stores the data in an external path through the LOCATION clause.",
        "tip": "Running DROP TABLE on a Managed table deletes the physical data from the bucket; on an External Table the files remain intact."
      },
      {
        "term": "COPY INTO",
        "cat": "ELT & Spark",
        "d": 2,
        "def": "Idempotent Databricks SQL statement that incrementally and in batches loads new files from cloud storage into a Delta table.",
        "tip": "It internally tracks the files already processed, avoiding duplicates on reruns without the need to maintain manual tracking scripts."
      },
      {
        "term": "Higher-Order Functions",
        "cat": "ELT & Spark",
        "d": 2,
        "def": "Spark SQL functions (TRANSFORM, FILTER, EXISTS, AGGREGATE) that operate directly on collections and nested arrays without requiring them to be broken apart.",
        "tip": "They avoid the use of explode() and massive network shuffles, notably speeding up the processing of nested structures."
      },
      {
        "term": "from_json",
        "cat": "ELT & Spark",
        "d": 2,
        "def": "Spark SQL function that deserializes a JSON-formatted text column into a strongly typed structure (STRUCT or ARRAY) from a given schema.",
        "tip": "Combine it with schema_of_json() to dynamically infer schemas from samples without writing them manually."
      },
      {
        "term": "MERGE INTO",
        "cat": "ELT & Spark",
        "d": 2,
        "def": "Atomic SQL statement that allows coordinated insert, update, and delete operations (Upsert) between source and target tables in a single transaction.",
        "tip": "It supports conditional clauses such as WHEN MATCHED AND condition THEN DELETE and WHEN NOT MATCHED THEN INSERT."
      },
      {
        "term": "Pandas UDF (Vectorized)",
        "cat": "ELT & Spark",
        "d": 2,
        "def": "User-defined function in Python that uses Apache Arrow to exchange batches of columnar in-memory data with the Spark executor.",
        "tip": "It provides up to 100 times higher performance than standard Python UDFs, which process row by row with high IPC cost."
      },
      {
        "term": "Auto Loader (cloudFiles)",
        "cat": "Streaming & DLT",
        "d": 3,
        "def": "Databricks incremental ingestion engine for processing millions of new files in cloud storage without listing entire directories.",
        "tip": "It supports Directory Listing and File Notification modes (SNS/SQS, Event Grid) with automatic schema inference and evolution."
      },
      {
        "term": "_rescued_data",
        "cat": "Streaming & DLT",
        "d": 3,
        "def": "Special column automatically generated by Auto Loader that stores in JSON format any field that is new or incompatible with the expected schema.",
        "tip": "It prevents the silent loss of corrupt or unexpected records, allowing ingestion to continue without fatal failures."
      },
      {
        "term": "Delta Live Tables (DLT)",
        "cat": "Streaming & DLT",
        "d": 3,
        "def": "Declarative Databricks framework for building reliable data pipelines in SQL or Python with automatic dependency and quality management.",
        "tip": "It automates orchestration, checkpoint maintenance, cluster scaling, and metrics capture in the Event Log."
      },
      {
        "term": "Streaming Table (DLT)",
        "cat": "Streaming & DLT",
        "d": 3,
        "def": "Managed table in Delta Live Tables designed to process continuous or growing data streams in a strictly incremental (append-only) manner.",
        "tip": "It is declared with CREATE OR REFRESH STREAMING TABLE and reads from streaming sources with the STREAM() function."
      },
      {
        "term": "Materialized View (DLT)",
        "cat": "Streaming & DLT",
        "d": 3,
        "def": "Persisted view in Delta Live Tables whose results are precomputed and automatically refreshed to reflect the current state of the sources.",
        "tip": "Ideal for the Gold layer, business aggregations, and complex joins where full analytical consistency is required."
      },
      {
        "term": "Data Quality Expectations",
        "cat": "Streaming & DLT",
        "d": 3,
        "def": "Declarative data quality constraints in DLT applied in flight through EXPECT, ON VIOLATION DROP ROW, and ON VIOLATION FAIL UPDATE.",
        "tip": "They let you govern data integrity by defining whether non-conforming rows generate warnings, are dropped, or abort the pipeline."
      },
      {
        "term": "Watermarking (Structured Streaming)",
        "cat": "Streaming & DLT",
        "d": 3,
        "def": "Mechanism in Structured Streaming for defining the tolerable lateness limit for out-of-order events and purging the in-memory State Store.",
        "tip": "Without watermarking, streaming aggregation queries in Append mode would accumulate state indefinitely, causing OutOfMemory errors."
      },
      {
        "term": "Job Cluster (Automated)",
        "cat": "Workflows",
        "d": 4,
        "def": "Ephemeral cluster provisioned exclusively by Databricks Workflows for running a job and destroyed when it finishes.",
        "tip": "It bills at a noticeably lower DBU rate (~50-60% savings) and guarantees total isolation in production compared to All-Purpose clusters."
      },
      {
        "term": "Repair and Rerun",
        "cat": "Workflows",
        "d": 4,
        "def": "Databricks Workflows feature that lets you resume a multi-task job by running only the failed tasks and their downstream dependencies.",
        "tip": "It avoids the cost and delay of recomputing upstream tasks that already completed successfully in the previous run."
      },
      {
        "term": "Cluster Policy",
        "cat": "Workflows",
        "d": 4,
        "def": "Set of administrative rules that restricts the cluster types, instance families, auto-termination, and tags allowed to users.",
        "tip": "Essential for financial governance (FinOps), preventing the accidental creation of oversized clusters or clusters without automatic shutdown."
      },
      {
        "term": "Three-Level Namespace",
        "cat": "Unity Catalog",
        "d": 5,
        "def": "Canonical hierarchical object resolution structure in Unity Catalog with the format catalog.schema.table (or view / volume / model).",
        "tip": "It lets you organize data by corporate domains or environments (dev/staging/prod) centralized in a single regional metastore."
      },
      {
        "term": "Row Filters & Column Masks",
        "cat": "Unity Catalog",
        "d": 5,
        "def": "Granular access-control SQL functions in Unity Catalog that filter rows or mask columns dynamically based on the user's identity.",
        "tip": "They avoid the proliferation of redundant views to ensure compliance with privacy regulations such as GDPR and HIPAA."
      }
    ]
  };
})(window);
