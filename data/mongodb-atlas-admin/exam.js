/* =========================================================================
   data/mongodb-atlas-admin/exam.js — MongoDB · Atlas Administrator (English)
   Domains and weights follow the official 2026 MongoDB Atlas Administrator
   Certification Exam Guide (70 questions, 95 minutes, single and multiple
   response).
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["mongodb-atlas-admin"] = {
    "id": "mongodb-atlas-admin",
    "appId": "mongodb-atlas-admin",
    "provider": "MongoDB",
    "badge": "MongoDB · Atlas Admin",
    "icon": "🍃",
    "color": "#00684a",
    "featured": true,
    "title": "MongoDB · Atlas Administrator",
    "subtitle": "Replica set resilience, backups and PITR, failover troubleshooting, ESR indexing, sharding, Performance Advisor, Query Profiler, alerts, IP Access List, Private Endpoints, KMS encryption and RBAC",
    "passingScore": 70,
    "domains": {
      "1": "MongoDB Architecture and Core Operations (16%)",
      "2": "Cluster Reliability and Data Resilience (20%)",
      "3": "Indexing and Query Optimization (16%)",
      "4": "Sharding Strategies and Scalable Deployments (8%)",
      "5": "Performance Monitoring and Tuning (20%)",
      "6": "Security, Networking, and Encryption (20%)"
    },
    "shortDomains": {
      "1": "Core Operations",
      "2": "Reliability & Backup",
      "3": "Indexing & Queries",
      "4": "Sharding",
      "5": "Monitoring & Tuning",
      "6": "Security & Network"
    },
    "topics": [
      {
        "id": "atl-t-1-1",
        "d": 1,
        "title": "1.1 · Core Operations: Queries, CRUD, Aggregation and the Document Model",
        "html": "<h4>Exam format</h4>\n<p>70 questions in 95 minutes. <b>Multiple choice</b> has one correct answer; <b>multiple response</b> has two or three, and the question says how many to pick. MongoDB does not publish the passing score.</p>\n<h4>Queries and CRUD</h4>\n<table class=\"keytable\">\n<tr><th>Need</th><th>Syntax</th></tr>\n<tr><td>Array contains a value</td><td><code>{ roles: 'admin' }</code></td></tr>\n<tr><td>Ranges</td><td><code>$gt $gte $lt $lte</code></td></tr>\n<tr><td>Either condition</td><td><code>{ $or: [ {...}, {...} ] }</code> (fields in one filter are an implicit AND)</td></tr>\n<tr><td>Shape results</td><td>projection, <code>.sort()</code>, <code>.limit()</code>, <code>countDocuments(filter)</code></td></tr>\n<tr><td>Change one field</td><td><code>updateOne(filter, { $set: { field: value } })</code></td></tr>\n</table>\n<h4>Aggregation</h4>\n<p>Stages run in order and each consumes the previous output. Filter early with <code>$match</code>, use <code>$unwind</code> before grouping per array element, and <b><code>$sort</code> before <code>$limit</code></b> for top-N results.</p>\n<h4>Document model</h4>\n<p>Data accessed together is stored together (fewer joins, flexible and polymorphic schemas). Embed bounded, co-read data; reference unbounded or independently accessed data to stay far below the 16 MB document limit.</p>"
      },
      {
        "id": "atl-t-2-1",
        "d": 2,
        "title": "2.1 · Replica Sets, Multi-Region Deployments and Failover",
        "html": "<h4>How Atlas provides high availability</h4>\n<p>Every Atlas cluster is at least a <b>3-member replica set</b>. Within one region, Atlas spreads members across <b>availability zones</b>. If the primary fails, the remaining electable members hold an election, usually within seconds, and drivers with <b>retryable writes/reads</b> reconnect automatically.</p>\n<table class=\"keytable\">\n<tr><th>Risk</th><th>Protection</th></tr>\n<tr><td>Node or AZ failure</td><td>Default 3-node replica set across AZs</td></tr>\n<tr><td>Full region outage</td><td>Multi-region cluster with electable nodes in 3 regions (e.g. 2-2-1) so a majority survives</td></tr>\n<tr><td>Cloud provider outage</td><td>Multi-cloud cluster (electable nodes in AWS, Azure and GCP)</td></tr>\n<tr><td>Local read latency</td><td>Read-only nodes in other regions (they do not vote)</td></tr>\n</table>\n<p>Use <b>Test Resilience → Test Primary Failover</b> to verify that applications survive an election before a real incident.</p>\n<h4>Replication lag and the oplog window</h4>\n<p>Secondaries replay the primary's <b>oplog</b>. The <b>Replication Oplog Window</b> is how many hours of writes the oplog holds. If a secondary lags behind more than that window, it can no longer catch up and needs a full <b>initial sync</b>. Lag usually comes from write bursts, under-provisioned secondaries, slow disks or network problems.</p>"
      },
      {
        "id": "atl-t-2-2",
        "d": 2,
        "title": "2.2 · Backups, Point-in-Time Recovery and Incident Methodology",
        "html": "<h4>Atlas backup options</h4>\n<table class=\"keytable\">\n<tr><th>Feature</th><th>What it gives you</th></tr>\n<tr><td>Cloud Backup snapshots</td><td>Scheduled snapshots (hourly/daily/weekly/monthly) with retention policies</td></tr>\n<tr><td>Continuous Cloud Backup</td><td><b>Point-in-time restore (PITR)</b> to any moment inside the configured restore window</td></tr>\n<tr><td>Backup Compliance Policy</td><td>Prevents anyone, including Project Owners, from deleting backups or weakening the policy (WORM-style protection for compliance)</td></tr>\n<tr><td>Multi-region snapshot copies</td><td>Copies snapshots to other regions for disaster recovery</td></tr>\n<tr><td>Termination protection</td><td>Blocks accidental deletion of a cluster</td></tr>\n</table>\n<p>Pick the schedule from the business <b>RPO</b> (how much data you can lose) and <b>RTO</b> (how fast you must recover), and <b>test restores</b> regularly.</p>\n<h4>Identify → Mitigate → Remediate</h4>\n<ol>\n<li><b>Identify</b> the failing component with metrics and alerts (CPU, connections, replication lag, disk).</li>\n<li><b>Mitigate</b> user impact quickly (kill a runaway operation, scale up temporarily, shift reads).</li>\n<li><b>Remediate</b> the root cause (add an index, fix the query or schema, right-size the tier).</li>\n</ol>"
      },
      {
        "id": "atl-t-3-1",
        "d": 3,
        "title": "3.1 · Index Design, Costs and explain()",
        "html": "<h4>Design rules</h4>\n<ul>\n<li><b>ESR:</b> order compound index fields Equality → Sort → Range.</li>\n<li><b>Prefixes:</b> <code>{a,b,c}</code> serves <code>{a}</code>, <code>{a,b}</code> and <code>{a,b,c}</code>, never <code>{b}</code> alone.</li>\n<li><b>Sort direction:</b> <code>{a:1,b:-1}</code> supports sorts <code>{a:1,b:-1}</code> and its exact inverse <code>{a:-1,b:1}</code>, not <code>{a:1,b:1}</code>.</li>\n<li><b>Selectivity:</b> a field with few distinct or skewed values (e.g. a boolean that is 98% true) is a poor stand-alone index.</li>\n<li><b>Cost:</b> each index slows writes and consumes RAM and disk. Use <code>$indexStats</code> and Performance Advisor to find unused or redundant ones.</li>\n</ul>\n<h4>explain('executionStats')</h4>\n<p>Check <code>winningPlan</code> for <code>IXSCAN</code> and the expected <code>indexName</code>, compare <code>totalKeysExamined</code> / <code>totalDocsExamined</code> with <code>nReturned</code>, and look for an in-memory <code>SORT</code> stage.</p>\n<h4>Building indexes in Atlas</h4>\n<p>For large production collections, Atlas offers <b>rolling index builds</b>, which build the index one member at a time to reduce impact, at the cost of a longer total build.</p>"
      },
      {
        "id": "atl-t-4-1",
        "d": 4,
        "title": "4.1 · Sharding Architecture and Shard Key Selection",
        "html": "<h4>Architecture</h4>\n<p>A sharded cluster has <b>shards</b> (each a replica set), <b>config servers</b> holding metadata, and <b>mongos</b> routers. Data is split by <b>shard key</b> into ranges (chunks) that the balancer distributes across shards.</p>\n<h4>A good shard key has</h4>\n<ul>\n<li><b>High cardinality</b>: many distinct values (avoid a 5-value country field).</li>\n<li><b>Low frequency</b>: no single value dominates.</li>\n<li><b>Non-monotonic</b> growth: a timestamp or ObjectId alone sends every insert to one \"hot\" shard.</li>\n<li><b>Query isolation</b>: most queries include the key, so they are targeted instead of scatter-gather.</li>\n</ul>\n<table class=\"keytable\">\n<tr><th>Strategy</th><th>Good for</th><th>Trade-off</th></tr>\n<tr><td>Ranged</td><td>Range queries on the key</td><td>Monotonic keys create hot spots</td></tr>\n<tr><td>Hashed</td><td>Even write distribution</td><td>Range queries become scatter-gather</td></tr>\n<tr><td>Zone sharding</td><td>Data residency / locality</td><td>Needs a key prefix that maps to zones</td></tr>\n</table>\n<p>Fix a poor key with <code>reshardCollection</code> (change the key online) or <code>refineCollectionShardKey</code> (add suffix fields to increase cardinality).</p>"
      },
      {
        "id": "atl-t-5-1",
        "d": 5,
        "title": "5.1 · Atlas Monitoring Tools, Alerts and Resource Bottlenecks",
        "html": "<h4>Which tool for which question</h4>\n<table class=\"keytable\">\n<tr><th>Tool</th><th>Use it to</th></tr>\n<tr><td>Real-Time Performance Panel</td><td>See operations, hottest collections and slowest queries happening <b>right now</b></td></tr>\n<tr><td>Query Profiler</td><td>Explore slow operations over a past time window, filtered by namespace or operation type</td></tr>\n<tr><td>Query Insights / Namespace Insights</td><td>Compare latency and operation counts per collection over time</td></tr>\n<tr><td>Performance Advisor</td><td>Get <b>index suggestions</b> from slow query patterns and find redundant or unused indexes to drop</td></tr>\n<tr><td>Metrics charts</td><td>Opcounters, connections, Query Targeting, Scan and Order, CPU, disk IOPS and latency, cache usage, replication lag</td></tr>\n</table>\n<h4>Key signals</h4>\n<ul>\n<li><b>Query Targeting</b> (scanned objects or keys / returned): values far above 1 mean missing or poor indexes.</li>\n<li><b>Scan and Order</b>: in-memory sorts not supported by an index.</li>\n<li><b>Cache</b> fill and dirty ratios plus high disk read IOPS: the working set no longer fits in RAM.</li>\n<li><b>Disk queue depth</b> and IOPS at the provisioned limit: storage bottleneck.</li>\n</ul>\n<h4>Alerting best practices</h4>\n<p>Alert on symptoms that need action (replication lag, oplog window, disk usage, connections, Query Targeting, host down), set thresholds with a sustained duration to avoid noise, and route them to the right channel (PagerDuty, Slack, email, webhook). Use compute and storage <b>auto-scaling</b> for predictable growth.</p>"
      },
      {
        "id": "atl-t-6-1",
        "d": 6,
        "title": "6.1 · Network Access, Authentication, RBAC and Encryption",
        "html": "<h4>Network access</h4>\n<table class=\"keytable\">\n<tr><th>Option</th><th>Notes</th></tr>\n<tr><td>IP Access List</td><td>Only listed IPs/CIDRs can connect. Entries can be <b>temporary</b> (auto-expire). Avoid <code>0.0.0.0/0</code>.</td></tr>\n<tr><td>Network peering</td><td>Private routing between your VPC/VNet and the Atlas VPC; CIDRs must not overlap.</td></tr>\n<tr><td>Private Endpoints</td><td>AWS PrivateLink, Azure Private Link, GCP Private Service Connect: one-way private connectivity, no CIDR overlap concerns, traffic never crosses the public internet.</td></tr>\n</table>\n<h4>Two kinds of users</h4>\n<ul>\n<li><b>Atlas users</b> sign in to the Atlas UI/API and get <b>organization/project roles</b> (Organization Owner, Project Owner, Project Read Only...).</li>\n<li><b>Database users</b> connect to clusters and get <b>database roles</b> (built-in such as <code>read</code>, <code>readWrite</code>, or <b>custom roles</b>). They can be scoped to specific clusters and created as <b>temporary</b> users.</li>\n</ul>\n<p>Authentication methods: SCRAM, X.509 certificates, AWS IAM, LDAP and OIDC (workforce and workload identity federation).</p>\n<h4>Encryption</h4>\n<p>Atlas always encrypts traffic with TLS (you can raise the minimum TLS version) and encrypts storage by default. <b>Encryption at rest using customer key management</b> integrates the Encrypted Storage Engine with AWS KMS, Azure Key Vault or Google Cloud KMS, so you control and can revoke the key.</p>"
      }
    ],
    "questions": [
      {
        "id": "atl-01",
        "d": 1,
        "t": "Aggregation Stage Order",
        "q": "Each order document has an `items` array of `{ sku, qty, price }`. You need the 5 SKUs with the highest revenue in 2026. Which pipeline order is correct?",
        "o": [
          "`$group` by SKU → `$unwind` items → `$match` 2026 → `$limit` 5 → `$sort` revenue",
          "`$match` 2026 → `$unwind` items → `$group` by SKU → `$sort` revenue desc → `$limit` 5",
          "`$unwind` items → `$limit` 5 → `$match` 2026 → `$group` by SKU → `$sort` revenue",
          "`$match` 2026 → `$group` by SKU → `$unwind` items → `$limit` 5 → `$sort` revenue"
        ],
        "a": 1,
        "e": "Filter first so the stage can use an index and less data flows on, unwind so each item becomes a document, group per SKU, then sort descending and only then limit to the top 5."
      },
      {
        "id": "atl-02",
        "d": 1,
        "t": "$limit Before $sort",
        "q": "A report pipeline ends with `{ $limit: 10 }` followed by `{ $sort: { total: -1 } }`. Each run returns a different 'top 10'. Why?",
        "o": [
          "`$sort` ignores any fields created by previous stages.",
          "The pipeline needs `allowDiskUse: true` to sort consistently.",
          "It sorts only 10 arbitrary documents; `$sort` must come first.",
          "`$limit` is evaluated after `$sort` automatically, so the issue is replication lag."
        ],
        "a": 2,
        "e": "Stages run in sequence. Limiting first keeps an arbitrary 10 documents, and sorting them afterwards does not produce the real top 10. Sorting first, then limiting, does."
      },
      {
        "id": "atl-03",
        "d": 1,
        "t": "Array Equality Queries",
        "q": "User documents store `roles: ['viewer', 'admin', 'billing']`. Which filter returns every user who has the `admin` role?",
        "o": [
          "`{ roles: 'admin' }`",
          "`{ roles: ['admin'] }`",
          "`{ 'roles.admin': true }`",
          "`{ roles: { $size: 'admin' } }`"
        ],
        "a": 0,
        "e": "An equality match on an array field matches documents where any element equals the value. `['admin']` would require the array to be exactly that single element."
      },
      {
        "id": "atl-04",
        "d": 1,
        "t": "Logical and Relational Operators",
        "q": "The fraud team needs orders whose `total` is greater than 1000 OR whose `status` is `flagged`. Which filter is correct?",
        "o": [
          "`{ total: { $gt: 1000 }, status: 'flagged' }`",
          "`{ $and: [ { total: { $gt: 1000 } }, { status: 'flagged' } ] }`",
          "`{ total: { $gt: 1000, $or: 'flagged' } }`",
          "`{ $or: [ { total: { $gt: 1000 } }, { status: 'flagged' } ] }`"
        ],
        "a": 3,
        "e": "`$or` takes an array of conditions and matches documents that satisfy at least one. Listing fields together in one filter is an implicit AND."
      },
      {
        "id": "atl-05",
        "d": 1,
        "t": "Embedding vs Referencing",
        "q": "An Atlas alert reports `BSONObjectTooLarge` on the `devices` collection, where every status change is appended to an embedded `history` array. What is the right model change?",
        "o": [
          "Raise the maximum document size in the cluster's advanced configuration.",
          "Move history entries to their own collection that references the device.",
          "Compress the `history` array with zstd network compression on the driver.",
          "Move the collection to a sharded cluster so documents can grow beyond 16 MB."
        ],
        "a": 1,
        "e": "Unbounded arrays eventually hit the fixed 16 MB document limit and make every update heavier. Referencing the child records keeps documents bounded; sharding and compression do not change the limit."
      },
      {
        "id": "atl-06",
        "d": 1,
        "t": "Counting and Shaping Results",
        "q": "An on-call engineer needs the exact number of orders with `status: 'failed'` in the last hour, without returning the documents. Which call fits?",
        "o": [
          "`db.orders.find({ status: 'failed', ts: { $gte: since } }).toArray().length`",
          "`db.orders.estimatedDocumentCount({ status: 'failed' })`",
          "`db.orders.countDocuments({ status: 'failed', ts: { $gte: since } })`",
          "`db.orders.find({ status: 'failed' }).limit(1)`"
        ],
        "a": 2,
        "e": "`countDocuments(filter)` returns an exact count of matching documents on the server. `estimatedDocumentCount` ignores filters and loading every document into the client is wasteful."
      },
      {
        "id": "atl-07",
        "d": 1,
        "t": "Updating a Single Field",
        "q": "You must change the `tier` of customer `C-1042` to `gold` without touching any other field. Which operation is correct?",
        "o": [
          "`db.customers.replaceOne({ _id: 'C-1042' }, { tier: 'gold' })`",
          "`db.customers.updateOne({ _id: 'C-1042' }, { $set: { tier: 'gold' } })`",
          "`db.customers.insertOne({ _id: 'C-1042', tier: 'gold' })`",
          "`db.customers.updateOne({ _id: 'C-1042' }, { tier: 'gold' })`"
        ],
        "a": 1,
        "e": "`$set` modifies only the named field. `replaceOne` would discard every other field, inserting fails on the existing `_id`, and `updateOne` without an operator is rejected."
      },
      {
        "id": "atl-08",
        "d": 1,
        "t": "Document Model Advantages",
        "q": "A team migrating from a relational database asks why the document model suits their product catalog. Which TWO statements are genuine advantages? (Choose 2.)",
        "o": [
          "Data that is read together can be stored together, avoiding many joins per request.",
          "Foreign keys between collections are enforced automatically by the server engine.",
          "Documents in a collection can vary, so new product types need no migration.",
          "Every collection requires a fixed schema declared before its first insert."
        ],
        "a": [0, 2],
        "e": "Documents map to application objects so related data can be embedded and fetched in one read, and the flexible schema accommodates polymorphic records. MongoDB does not enforce foreign keys and does not require a predeclared schema (validation is optional)."
      },
      {
        "id": "atl-09",
        "d": 2,
        "t": "Primary Failure",
        "q": "The primary of a 3-node M30 replica set in one region becomes unreachable because of a hardware fault. The application uses a current driver with default settings. What happens?",
        "o": [
          "The cluster becomes read-only until Atlas support promotes a secondary manually.",
          "All data written since the last snapshot is lost and must be restored from backup.",
          "The application must be redeployed with the new primary's hostname.",
          "The remaining members elect a new primary within seconds and retryable writes let the driver continue."
        ],
        "a": 3,
        "e": "Replica sets fail over automatically: the two surviving members form a majority and elect a primary. Drivers discover the new primary through the SRV connection string, and retryable writes retry once on transient errors."
      },
      {
        "id": "atl-10",
        "d": 2,
        "t": "Surviving a Region Outage",
        "q": "A payments platform must keep accepting writes even if an entire cloud region goes down. Which Atlas topology meets this?",
        "o": [
          "A multi-region cluster with electable nodes spread across three regions (for example 2-2-1).",
          "A single-region 5-node cluster spread across three availability zones.",
          "A single-region cluster plus read-only nodes in a second region.",
          "A single-region cluster with hourly snapshots copied to another region."
        ],
        "a": 0,
        "e": "To elect a primary after losing a region, a majority of electable nodes must live outside it. Three regions with 2-2-1 keep a majority with any one region down. Read-only nodes do not vote, and snapshots only help after a restore."
      },
      {
        "id": "atl-11",
        "d": 2,
        "t": "Point-in-Time Recovery",
        "q": "At 10:47 a script deleted 40,000 documents by mistake. The last scheduled snapshot was at 06:00. The business needs the data exactly as it was at 10:46. What should have been enabled, and how do you restore?",
        "o": [
          "Termination protection, then restore the 06:00 snapshot.",
          "A Backup Compliance Policy, then download the oplog and replay it manually.",
          "Continuous Cloud Backup, then perform a point-in-time restore to 10:46.",
          "Multi-region snapshot copies, then restore from the copy in the other region."
        ],
        "a": 2,
        "e": "Continuous Cloud Backup keeps the oplog so Atlas can restore to any moment inside the restore window. Snapshots alone only offer their own timestamps, losing almost five hours of writes here."
      },
      {
        "id": "atl-12",
        "d": 2,
        "t": "Backup Compliance",
        "q": "Auditors require that production backups cannot be deleted or shortened, even by a compromised Project Owner account, for 7 years. Which Atlas feature addresses this?",
        "o": [
          "A custom database role that removes the `dropDatabase` action.",
          "Termination protection enabled on the production cluster.",
          "An IP Access List restricted to the corporate network.",
          "A Backup Compliance Policy enforcing the 7-year retention."
        ],
        "a": 3,
        "e": "A Backup Compliance Policy locks backup settings at the project level: snapshots cannot be deleted before their retention ends and the policy cannot be weakened by project users. Changes require a support process."
      },
      {
        "id": "atl-13",
        "d": 2,
        "t": "Identify, Mitigate, Remediate",
        "q": "CPU on the primary is at 100% and application latency is spiking. The Real-Time Performance Panel shows a new unindexed report query running hundreds of times. Following Identify → Mitigate → Remediate, what comes next?",
        "o": [
          "Kill or throttle the report operations now, then add the index it needs.",
          "Remediate first by redesigning the schema, then mitigate by restarting the cluster.",
          "Skip mitigation and open a ticket with the application team for the next sprint.",
          "Mitigate by deleting the report collection, then remediate by restoring it from backup."
        ],
        "a": 0,
        "e": "After identifying the cause, mitigation reduces user impact fast without destroying data. Remediation then fixes the root cause durably, here with an index that supports the query."
      },
      {
        "id": "atl-14",
        "d": 2,
        "t": "Oplog Window",
        "q": "During a nightly bulk load, the `Replication Oplog Window` alert drops below 1 hour and one secondary lags 90 minutes. What is the main risk if this continues?",
        "o": [
          "The primary rejects all reads until the secondary catches up.",
          "The lagging secondary falls off the oplog and must perform a full initial sync.",
          "Atlas automatically deletes the oldest backups to free oplog space.",
          "The cluster switches to read-only mode for the rest of the load."
        ],
        "a": 1,
        "e": "A secondary can only catch up from entries still in the primary's oplog. If its lag exceeds the oplog window, it must resync all data, which is slow and reduces redundancy. Increase the oplog size or minimum window, throttle the load, or size secondaries properly."
      },
      {
        "id": "atl-15",
        "d": 2,
        "t": "Replication Lag Causes",
        "q": "A secondary shows steadily increasing replication lag while the primary is healthy. Disk IOPS on that secondary sit at the provisioned limit. What is the most likely cause and fix?",
        "o": [
          "There are extra indexes on that secondary only, so drop them on that node.",
          "The application reads from the primary; switch reads to `secondaryPreferred`.",
          "TLS is enabled, so disabling it would speed up replication.",
          "The secondary's disk cannot keep up; raise IOPS or the tier."
        ],
        "a": 3,
        "e": "Lag grows when a secondary cannot replay the oplog as fast as the primary writes. Saturated IOPS point to storage. Atlas members share the same configuration, so increase provisioned IOPS or the tier, and smooth bulk writes."
      },
      {
        "id": "atl-16",
        "d": 2,
        "t": "Recurring Failovers",
        "q": "A cluster has had six unplanned elections this week. Each one follows a period where the primary runs at 100% CPU and memory pressure. How should you remediate?",
        "o": [
          "Disable automatic elections so the current primary is never replaced.",
          "Add read-only nodes in another region to absorb the elections.",
          "Fix the workload exhausting the primary and right-size the tier.",
          "Reduce `electionTimeoutMillis` so that elections finish faster."
        ],
        "a": 2,
        "e": "Recurring failovers are a symptom: the primary becomes unresponsive under resource exhaustion. Fixing the queries and capacity removes the cause; tuning elections only hides it."
      },
      {
        "id": "atl-17",
        "d": 2,
        "t": "Testing Resilience",
        "q": "Before a major sale, the team wants evidence that the application survives a primary election without user-facing errors. What should you do?",
        "o": [
          "Pause the cluster for 5 minutes and then resume it again.",
          "Run Atlas Test Primary Failover and watch the application.",
          "Delete the primary node from the cluster configuration.",
          "Restore a snapshot into the production cluster during peak traffic."
        ],
        "a": 1,
        "e": "Atlas can trigger a controlled primary failover so you can validate connection strings, retryable writes and timeouts. Pausing or restoring causes real downtime or data changes."
      },
      {
        "id": "atl-18",
        "d": 2,
        "t": "Operational Safeguards",
        "q": "Which TWO Atlas features help prevent accidental or malicious data loss in production? (Choose 2.)",
        "o": [
          "Termination protection on the cluster.",
          "Increasing the cluster tier from M30 to M50.",
          "Enabling the Real-Time Performance Panel.",
          "A Backup Compliance Policy on the project."
        ],
        "a": [0, 3],
        "e": "Termination protection blocks deleting the cluster until it is explicitly disabled, and a Backup Compliance Policy keeps backups from being deleted or weakened. Tier size and monitoring panels do not protect data."
      },
      {
        "id": "atl-19",
        "d": 3,
        "t": "The ESR Guideline",
        "q": "A hot query is `find({ tenantId: 7, amount: { $gt: 500 } }).sort({ createdAt: -1 })`. Which index follows the ESR guideline?",
        "o": [
          "`{ amount: 1, tenantId: 1, createdAt: -1 }`",
          "`{ tenantId: 1, createdAt: -1, amount: 1 }`",
          "`{ createdAt: -1, amount: 1, tenantId: 1 }`",
          "`{ tenantId: 1, amount: 1, createdAt: -1 }`"
        ],
        "a": 1,
        "e": "Equality (`tenantId`) first, then the sort field (`createdAt`), then the range (`amount`). The index then returns results already ordered and avoids an in-memory sort."
      },
      {
        "id": "atl-20",
        "d": 3,
        "t": "Index Prefix Alignment",
        "q": "A collection has the index `{ region: 1, status: 1, updatedAt: 1 }`. Which query can NOT use it efficiently?",
        "o": [
          "`find({ region: 'eu' })`",
          "`find({ region: 'eu', status: 'open' })`",
          "`find({ status: 'open', updatedAt: { $gt: d } })`",
          "`find({ region: 'eu', status: 'open', updatedAt: { $gt: d } })`"
        ],
        "a": 2,
        "e": "A compound index supports queries on its prefixes. A query that omits the leading field `region` cannot seek into the index."
      },
      {
        "id": "atl-21",
        "d": 3,
        "t": "Cardinality and Selectivity",
        "q": "A developer created an index on `isActive`, which is `true` in 98% of 50 million documents. Queries on `{ isActive: true }` are still slow. Why?",
        "o": [
          "Boolean fields cannot be indexed in MongoDB at all.",
          "The index must be a hashed index to support booleans.",
          "The index should be descending (`isActive: -1`) to match `true`.",
          "The field is barely selective, so it still matches almost everything."
        ],
        "a": 3,
        "e": "An index helps when it narrows the result set. With 98% of documents matching, the server reads nearly everything anyway. Combine such fields with selective ones in a compound index, or use a partial index for the rare value."
      },
      {
        "id": "atl-22",
        "d": 3,
        "t": "Confirming the Index Used",
        "q": "You created `{ customerId: 1, createdAt: -1 }` for a slow query. How do you confirm the query now uses it?",
        "o": [
          "Check `explain('executionStats')` for an `IXSCAN` on that index.",
          "Check that the index appears in `db.collection.getIndexes()`.",
          "Wait for the Atlas index build alert in the UI to turn green.",
          "Compare the collection's storage size before and after the index build."
        ],
        "a": 0,
        "e": "An index existing does not mean the planner picks it. The explain output shows the winning plan, the index name, keys and documents examined versus returned."
      },
      {
        "id": "atl-23",
        "d": 3,
        "t": "Index Costs",
        "q": "After a team added 25 indexes to the `events` collection, insert latency doubled and RAM pressure rose. What is the best next step?",
        "o": [
          "Add even more indexes so that writes are spread across them.",
          "Find unused or redundant indexes with `$indexStats` and drop them.",
          "Convert all indexes to hashed indexes, which have no write cost.",
          "Disable journaling to compensate for the extra index overhead."
        ],
        "a": 1,
        "e": "Every index must be updated on each write and competes for cache memory. Removing indexes that queries do not use (or that are prefixes of others) restores write performance."
      },
      {
        "id": "atl-24",
        "d": 3,
        "t": "Rolling Index Builds",
        "q": "You must create an index on a 2 TB collection in a busy production cluster and want to minimize the impact on the primary. Which Atlas option fits?",
        "o": [
          "Build the index during peak hours so it finishes faster.",
          "Pause the cluster, build the index offline and resume.",
          "Use a rolling index build, which builds the index on one member at a time.",
          "Create the index on a secondary only and keep it there."
        ],
        "a": 2,
        "e": "Rolling builds take each member out of rotation in turn to build the index, avoiding a simultaneous build on all members. They take longer overall and involve a stepdown of the primary, so plan accordingly."
      },
      {
        "id": "atl-25",
        "d": 3,
        "t": "Sort Direction in Compound Indexes",
        "q": "There is an index `{ category: 1, price: -1 }`. Which sort can the index provide without an in-memory sort?",
        "o": [
          "`{ category: 1, price: 1 }`",
          "`{ category: -1, price: -1 }`",
          "`{ price: -1, category: 1 }`",
          "`{ category: -1, price: 1 }`"
        ],
        "a": 3,
        "e": "An index supports its own sort order and its exact inverse. The inverse of `{ category: 1, price: -1 }` is `{ category: -1, price: 1 }`; mixed variations need a different index."
      },
      {
        "id": "atl-26",
        "d": 3,
        "t": "Slow Query Analysis",
        "q": "explain() for a dashboard query shows `IXSCAN` on `{ status: 1 }`, then a `SORT` stage on `createdAt`, with 400,000 keys examined for 50 results. What optimization fits best?",
        "o": [
          "Increase the cluster tier so the in-memory sort is faster.",
          "Remove the sort and order the results in the application.",
          "Create the compound index `{ status: 1, createdAt: -1 }`.",
          "Add a hint that forces a collection scan for this query."
        ],
        "a": 2,
        "e": "The existing index filters but cannot provide the order, so MongoDB fetches and sorts many entries in memory. A compound index with the sort field returns ordered results and stops after the limit."
      },
      {
        "id": "atl-27",
        "d": 4,
        "t": "Monotonic Shard Keys",
        "q": "An events collection is sharded on `{ createdAt: 1 }`. Almost all inserts land on a single shard while others sit idle. What explains this and what is a better choice?",
        "o": [
          "The key only grows, so inserts hit the last chunk; use a hashed key.",
          "The balancer is disabled; enabling it spreads inserts evenly with the same key.",
          "The collection needs additional secondary indexes on `createdAt`.",
          "Too many shards were added, so the shard count must be reduced."
        ],
        "a": 0,
        "e": "Ever-increasing values always fall in the highest range, creating a hot shard. Hashing the key or prefixing it with a well-distributed field spreads writes."
      },
      {
        "id": "atl-28",
        "d": 4,
        "t": "Shard Key Cardinality",
        "q": "A multi-tenant collection is sharded on `country`, which has 6 distinct values. Two countries hold 80% of the data and their chunks cannot be split. What is the core problem?",
        "o": [
          "The cluster tier is too small to support sharding properly.",
          "Country codes must be stored as numbers to be split.",
          "The key has low cardinality and skew, creating jumbo chunks.",
          "The balancer window configured for the cluster is too short."
        ],
        "a": 2,
        "e": "A shard key can split data only between distinct values. With few, uneven values, large indivisible (jumbo) chunks appear. Add high-cardinality fields to the key."
      },
      {
        "id": "atl-29",
        "d": 4,
        "t": "Choosing a Shard Strategy",
        "q": "An orders service mostly runs `find({ customerId, orderDate: { $gte, $lt } })`. There are millions of customers with fairly even order volume. Which shard key fits best?",
        "o": [
          "Hashed `{ orderDate: 'hashed' }` only",
          "Ranged `{ customerId: 1, orderDate: 1 }`",
          "Ranged `{ orderDate: 1 }`",
          "Ranged `{ status: 1, region: 1 }`"
        ],
        "a": 1,
        "e": "A compound ranged key led by a high-cardinality `customerId` distributes data and lets mongos target one shard for each customer's date range. A hashed date scatters range queries; a date-only key is monotonic."
      },
      {
        "id": "atl-30",
        "d": 4,
        "t": "Fixing a Poor Shard Key",
        "q": "A production collection was sharded on an unsuitable key and must move to a better one without downtime or a manual dump and reload. What should you use?",
        "o": [
          "`reshardCollection` to change the shard key online (or `refineCollectionShardKey` to add suffix fields).",
          "Drop the collection's shard key with `unshardCollection` and shard it again immediately.",
          "Edit the `config.collections` document directly to change the key.",
          "Add more shards; the balancer will pick a better key automatically."
        ],
        "a": 0,
        "e": "Resharding copies data to a new key distribution online and then switches over. Refining adds fields to the existing key to increase cardinality. Editing config metadata is unsupported and dangerous."
      },
      {
        "id": "atl-31",
        "d": 5,
        "t": "Performance Advisor",
        "q": "A team wants Atlas to analyze slow queries and recommend specific indexes with their estimated impact. Which tool provides this?",
        "o": [
          "The Real-Time Performance Panel",
          "Atlas Data Explorer",
          "The Performance Advisor",
          "The Activity Feed"
        ],
        "a": 2,
        "e": "Performance Advisor examines slow query logs, suggests indexes ranked by impact, and also flags redundant or unused indexes to drop."
      },
      {
        "id": "atl-32",
        "d": 5,
        "t": "Real-Time vs Historical Tools",
        "q": "Latency spiked yesterday between 14:00 and 14:20 and has already recovered. You need to see which operations were slow during that window. Which tool fits best?",
        "o": [
          "The Real-Time Performance Panel (live)",
          "The Query Profiler for that time range",
          "The project's IP Access List history",
          "The cluster's Backup and restore page"
        ],
        "a": 1,
        "e": "The Query Profiler shows slow operations over a selectable past time range with filters by namespace and operation type. The Real-Time Performance Panel only shows what is happening now."
      },
      {
        "id": "atl-33",
        "d": 5,
        "t": "Query Targeting Metric",
        "q": "The `Query Targeting: Scanned Objects / Returned` metric sits around 15,000 on a busy cluster. What does this indicate?",
        "o": [
          "The cluster has far too many client connections open.",
          "Replication lag is high on one or more secondaries.",
          "The data disk on the primary is almost full.",
          "Queries scan far more documents than they return (missing indexes)."
        ],
        "a": 3,
        "e": "A ratio close to 1 means efficient, well-indexed queries. Thousands of scanned documents per returned document point to collection scans or unselective indexes."
      },
      {
        "id": "atl-34",
        "d": 5,
        "t": "Inefficient Query Signals",
        "q": "Which TWO Atlas metrics most directly indicate inefficient queries that need index work? (Choose 2.)",
        "o": [
          "Network bytes in per second",
          "Query Targeting (scanned / returned)",
          "Number of database users in the project",
          "Scan and Order (in-memory sorts)"
        ],
        "a": [1, 3],
        "e": "High Query Targeting reveals scans that return little, and Scan and Order counts sorts that no index supports. Network traffic and user counts do not measure query efficiency."
      },
      {
        "id": "atl-35",
        "d": 5,
        "t": "Configuring Alerts",
        "q": "The team was paged 40 times last night for brief CPU spikes that resolved in seconds, yet missed a disk that reached 95%. How should alerting be improved?",
        "o": [
          "Disable all alerts and rely on a weekly review of the metrics.",
          "Send every alert by email only, to reduce the paging noise.",
          "Alert on CPU above 1% so that every spike is investigated.",
          "Alert on actionable symptoms with sustained durations, including disk usage."
        ],
        "a": 3,
        "e": "Effective monitoring targets conditions that need action, uses durations to filter transient spikes, covers capacity signals such as disk space and the oplog window, and pages only for urgent issues."
      },
      {
        "id": "atl-36",
        "d": 5,
        "t": "Database Profiler",
        "q": "What is the purpose of the database profiler in an Atlas performance investigation?",
        "o": [
          "It encrypts slow queries before they are written to the logs.",
          "It records operations slower than a threshold for later analysis.",
          "It automatically rewrites slow queries to use indexes.",
          "It replaces the need to run explain() on any new query."
        ],
        "a": 1,
        "e": "Profiling captures slow operations with timing, keys and documents examined and plan summaries. It has overhead, so keep the threshold sensible; Atlas surfaces the data in the Query Profiler."
      },
      {
        "id": "atl-37",
        "d": 5,
        "t": "Cache and Working Set",
        "q": "As data grew, read latency rose. Metrics show the WiredTiger cache constantly full, high page faults and disk read IOPS climbing. What does this suggest?",
        "o": [
          "The working set no longer fits in RAM; add memory or shrink it.",
          "There are far too many entries in the IP Access List.",
          "Replication has been disabled on this cluster.",
          "The cluster is using TLS 1.3 instead of TLS 1.2."
        ],
        "a": 0,
        "e": "When frequently accessed data and indexes exceed the cache, reads go to disk. More RAM or a smaller working set (indexes that avoid scans, archived cold data) restores performance."
      },
      {
        "id": "atl-38",
        "d": 5,
        "t": "Disk Bottlenecks",
        "q": "Disk IOPS sit at the provisioned maximum and disk queue depth is high during the daily batch, while CPU and cache look healthy. What is the right action?",
        "o": [
          "Add more database users so the batch runs in parallel.",
          "Increase the number of IP Access List entries.",
          "Increase provisioned IOPS and smooth the batch writes.",
          "Lower the cluster tier to reduce the monthly cost."
        ],
        "a": 2,
        "e": "The bottleneck is storage throughput. More IOPS (or a tier/storage option that provides it) and spreading the write load address it; CPU and RAM are not the constraint."
      },
      {
        "id": "atl-39",
        "d": 5,
        "t": "Auto-Scaling",
        "q": "A retail cluster's load grows steadily week over week, with predictable daily peaks. The team wants capacity to follow demand without manual tier changes. What should they enable?",
        "o": [
          "Termination protection on the cluster",
          "Cluster tier and storage auto-scaling",
          "A Backup Compliance Policy on the project",
          "Read-only nodes in every region"
        ],
        "a": 1,
        "e": "Atlas auto-scaling adjusts the cluster tier and storage based on utilization, within the limits you set. Sudden spikes still need headroom because scaling is not instantaneous."
      },
      {
        "id": "atl-40",
        "d": 5,
        "t": "Real-Time Performance Panel",
        "q": "Right now, users report timeouts. You want to see the operations currently running, the hottest collections and the slowest queries live. Which tool fits?",
        "o": [
          "The Real-Time Performance Panel",
          "The Query Profiler for the last 7 days",
          "The Performance Advisor index suggestions",
          "The project's Activity Feed"
        ],
        "a": 0,
        "e": "The Real-Time Performance Panel streams current operations, hot collections and slow queries, ideal during an active incident. The other tools analyze history or recommendations."
      },
      {
        "id": "atl-41",
        "d": 6,
        "t": "Encryption at Rest with KMS",
        "q": "Security policy requires that the company controls, rotates and can revoke the key that encrypts Atlas data at rest, using AWS KMS. What should you configure?",
        "o": [
          "TLS 1.3 as the minimum protocol version for clients.",
          "Client-side field level encryption for every field.",
          "An IP Access List entry for the KMS endpoint.",
          "Encryption at Rest using Customer Key Management (AWS KMS)."
        ],
        "a": 3,
        "e": "Customer key management integrates the Encrypted Storage Engine with your cloud KMS, so your key protects the data at rest and revoking it makes the data inaccessible. TLS protects data in transit."
      },
      {
        "id": "atl-42",
        "d": 6,
        "t": "IP Access List",
        "q": "A contractor needs to connect from their laptop for a 4-hour migration task. What is the most secure way to grant network access?",
        "o": [
          "Add `0.0.0.0/0` and remove it when the contractor finishes.",
          "Add the contractor's IP as a temporary access list entry.",
          "Share the existing VPC peering connection with the contractor.",
          "Disable the IP Access List for the project during the task."
        ],
        "a": 1,
        "e": "Temporary access list entries expire on their own, limiting exposure to the specific IP and time window. Opening `0.0.0.0/0` exposes the cluster to the whole internet."
      },
      {
        "id": "atl-43",
        "d": 6,
        "t": "Private Endpoints vs Peering",
        "q": "The application VPC's CIDR overlaps with ranges used by other VPCs, and policy forbids traffic over the public internet. Which connectivity option fits best?",
        "o": [
          "VPC peering, since it supports overlapping CIDRs by design.",
          "Public connections restricted by a strict IP Access List.",
          "A Private Endpoint (AWS PrivateLink).",
          "A separate VPN from each developer laptop to Atlas."
        ],
        "a": 2,
        "e": "Private Endpoints expose Atlas as an interface endpoint inside your VPC: traffic stays on the provider's network and overlapping CIDRs are not a problem. Peering requires non-overlapping ranges."
      },
      {
        "id": "atl-44",
        "d": 6,
        "t": "Purpose of Network Peering",
        "q": "What does network peering between your cloud VPC and the Atlas VPC provide?",
        "o": [
          "Private routing so applications reach Atlas without public IPs.",
          "Automatic encryption of data at rest using your own KMS key.",
          "Database user authentication without passwords.",
          "Cross-region replication of your cluster's data."
        ],
        "a": 0,
        "e": "Peering connects the networks privately; you still add the peered CIDR to the IP Access List. It does not handle encryption at rest, authentication or replication."
      },
      {
        "id": "atl-45",
        "d": 6,
        "t": "Atlas Users vs Database Users",
        "q": "A reporting service must read the `analytics` database on the production cluster. A colleague proposes inviting the service account as an Atlas Project Read Only user. Why is that wrong, and what is correct?",
        "o": [
          "Project Read Only grants write access; use Project Owner instead.",
          "Atlas users cannot be invited to projects; only organizations.",
          "Applications must connect with the Atlas API key used for automation.",
          "Atlas users manage Atlas itself; it needs a database user with `read`."
        ],
        "a": 3,
        "e": "Atlas users and their organization/project roles control the Atlas control plane. Connecting to a cluster's data requires a database user with database roles."
      },
      {
        "id": "atl-46",
        "d": 6,
        "t": "Authentication Mechanisms",
        "q": "A workload runs on AWS Lambda and the team does not want to store any database password. Which Atlas authentication method fits?",
        "o": [
          "SCRAM-SHA-256 with the password in an environment variable.",
          "AWS IAM authentication using the Lambda function's IAM role.",
          "An Atlas Organization Owner API key.",
          "Anonymous access restricted by the IP Access List."
        ],
        "a": 1,
        "e": "AWS IAM authentication lets a database user map to an IAM role, so the function authenticates with temporary AWS credentials. X.509 and OIDC workload identity are other passwordless options."
      },
      {
        "id": "atl-47",
        "d": 6,
        "t": "Custom Roles",
        "q": "An ETL job must run `find` on `sales.orders` and `insert` on `sales.audit`, and nothing else. No built-in role matches exactly. What should you do?",
        "o": [
          "Grant `readWriteAnyDatabase`, which includes both actions.",
          "Grant `dbAdmin` on the `sales` database.",
          "Create a custom role with exactly those two privileges.",
          "Grant `readWrite` on `sales` and trust the team with the rest."
        ],
        "a": 2,
        "e": "Custom roles combine specific actions on specific namespaces, enforcing least privilege when built-in roles are too broad."
      },
      {
        "id": "atl-48",
        "d": 6,
        "t": "Least Privilege with Built-in Roles",
        "q": "A support engineer needs to query the `crm` database only. Which assignment follows least privilege?",
        "o": [
          "`readAnyDatabase`",
          "`atlasAdmin`",
          "`readWrite` on `crm`",
          "`read` on `crm`"
        ],
        "a": 3,
        "e": "`read` scoped to the single database grants exactly what is needed. Any-database roles, write access or admin roles exceed the requirement."
      },
      {
        "id": "atl-49",
        "d": 6,
        "t": "Transport Security",
        "q": "Compliance requires that no client connects to the cluster using TLS 1.0 or 1.1. What should you do in Atlas?",
        "o": [
          "Set the cluster's minimum TLS protocol version to TLS 1.2.",
          "Disable TLS and rely on the IP Access List instead.",
          "Enable encryption at rest with a customer-managed key.",
          "Create a custom role that denies old TLS versions."
        ],
        "a": 0,
        "e": "Atlas always requires TLS and lets you raise the minimum protocol version per cluster. Encryption at rest and roles do not control the transport protocol."
      },
      {
        "id": "atl-50",
        "d": 6,
        "t": "Least-Privilege Database Users",
        "q": "Which TWO practices reduce the risk from database user credentials in Atlas? (Choose 2.)",
        "o": [
          "Restrict each database user to the specific clusters it needs.",
          "Give every application user the `atlasAdmin` role to avoid permission errors.",
          "Use temporary database users that expire automatically for short-lived access.",
          "Share one database user across all applications and engineers."
        ],
        "a": [0, 2],
        "e": "Scoping users to specific clusters limits the blast radius, and temporary users remove forgotten access. Broad admin roles and shared credentials defeat least privilege and auditing."
      }
    ],
    "why": {
      "atl-01": [
        "Grouping before unwinding groups whole arrays, and limiting before sorting picks arbitrary documents.",
        null,
        "Limiting right after unwinding keeps 5 arbitrary items before filtering and grouping.",
        "Unwinding after grouping is too late, and limit before sort returns an arbitrary 5."
      ],
      "atl-02": [
        "`$sort` can sort on any field present in its input, including computed ones.",
        "`allowDiskUse` only matters for memory limits; it does not fix stage order.",
        null,
        "Stage order is never rearranged in a way that changes results, and replication lag is unrelated."
      ],
      "atl-03": [
        null,
        "An array value requires an exact match of the whole array.",
        "`roles.admin` looks for a field named `admin` inside array elements.",
        "`$size` expects a number and matches the array length."
      ],
      "atl-04": [
        "Fields in one filter are combined with AND.",
        "`$and` requires both conditions, not either.",
        "`$or` is not valid inside a field condition like this.",
        null
      ],
      "atl-05": [
        "The 16 MB document limit is fixed and not configurable.",
        null,
        "Network compression does not change the stored document size.",
        "Sharding distributes documents; each document is still limited to 16 MB."
      ],
      "atl-06": [
        "Loading all matching documents to the client is slow and wasteful.",
        "`estimatedDocumentCount` does not accept a filter and is approximate.",
        null,
        "`limit(1)` returns at most one document, not a count."
      ],
      "atl-07": [
        "`replaceOne` removes every field except `_id` and `tier`.",
        null,
        "Inserting with an existing `_id` fails with a duplicate key error.",
        "Without an update operator, `updateOne` is rejected."
      ],
      "atl-08": [
        null,
        "MongoDB does not enforce foreign keys between collections.",
        null,
        "Collections do not need a predeclared schema; validation is optional."
      ],
      "atl-09": [
        "Atlas elects a new primary automatically; no manual promotion is needed.",
        "Majority-acknowledged writes are on the surviving members; no restore is needed.",
        "Drivers use the SRV connection string and discover the new primary automatically.",
        null
      ],
      "atl-10": [
        null,
        "All availability zones are in one region; a regional outage takes them all down.",
        "Read-only nodes do not vote and cannot become primary.",
        "Snapshots support recovery after the fact, not continuous writes during the outage."
      ],
      "atl-11": [
        "Termination protection prevents cluster deletion, and the 06:00 snapshot loses hours of data.",
        "A compliance policy protects backups but does not give point-in-time restore.",
        null,
        "Snapshot copies only contain the snapshot times, not 10:46."
      ],
      "atl-12": [
        "Database roles do not protect Atlas backups from deletion.",
        "Termination protection blocks deleting the cluster, not deleting backups.",
        "Network restrictions do not prevent an authenticated owner from deleting backups.",
        null
      ],
      "atl-13": [
        null,
        "Schema redesign is slow and restarting the cluster causes more disruption.",
        "Users keep suffering while nothing is mitigated.",
        "Deleting data is destructive and unrelated to the cause."
      ],
      "atl-14": [
        "The primary keeps serving reads and writes regardless of secondary lag.",
        null,
        "Atlas does not delete backups to free oplog space.",
        "Lag on a secondary does not make the cluster read-only."
      ],
      "atl-15": [
        "Index definitions are identical across replica set members.",
        "Moving reads to secondaries adds load to the lagging node.",
        "TLS is mandatory in Atlas and is not the cause of IOPS saturation.",
        null
      ],
      "atl-16": [
        "Automatic elections cannot be disabled in Atlas and are what keep the cluster available.",
        "Read-only nodes do not vote and do not reduce load on the primary's writes.",
        null,
        "Faster elections do not stop the primary from becoming unresponsive."
      ],
      "atl-17": [
        "Pausing the cluster causes full downtime instead of a controlled election.",
        null,
        "Removing nodes changes the topology and risks availability.",
        "Restoring into production overwrites live data."
      ],
      "atl-18": [
        null,
        "A larger tier adds capacity, not protection against deletion.",
        "The panel is a monitoring tool and does not prevent data loss.",
        null
      ],
      "atl-19": [
        "Leading with the range field reduces selectivity and breaks the sort.",
        null,
        "Leading with the sort field scans many non-matching tenants.",
        "Putting the range before the sort forces an in-memory sort."
      ],
      "atl-20": [
        "This uses the prefix `{ region }`.",
        "This uses the prefix `{ region, status }`.",
        null,
        "This uses the full index key."
      ],
      "atl-21": [
        "Boolean fields can be indexed like any other field.",
        "Hashed indexes do not improve selectivity for low-cardinality values.",
        "Index direction does not affect equality matches on a single field.",
        null
      ],
      "atl-22": [
        null,
        "An index can exist and still not be chosen by the query planner.",
        "A completed build does not prove that this query uses the index.",
        "Storage size says nothing about which plan a query uses."
      ],
      "atl-23": [
        "More indexes add more write cost and memory pressure.",
        null,
        "Hashed indexes still have to be maintained on every write.",
        "Journaling protects durability; disabling it is unsafe and not available in Atlas."
      ],
      "atl-24": [
        "Peak hours maximize impact on users.",
        "Pausing causes downtime and is not how indexes are built.",
        null,
        "Indexes must exist on all members; a secondary-only index is not a supported production setup."
      ],
      "atl-25": [
        "Changing only one direction is neither the index order nor its inverse.",
        "This flips only `category`, which the index cannot provide.",
        "The index cannot sort with `price` as the leading field.",
        null
      ],
      "atl-26": [
        "A bigger tier treats the symptom while still scanning and sorting 400,000 entries.",
        "Sorting in the application still requires fetching every matching document.",
        null,
        "A collection scan is worse than the current index scan."
      ],
      "atl-27": [
        null,
        "The balancer moves chunks later, but every new insert still targets the same top range.",
        "More indexes do not change where inserts are routed.",
        "Fewer shards reduce capacity and do not fix the hot spot."
      ],
      "atl-28": [
        "Tier size does not change how many ways the key can split data.",
        "Changing the data type does not add distinct values.",
        null,
        "A longer balancer window cannot split chunks that share a single key value."
      ],
      "atl-29": [
        "Hashing the date scatters every range query across all shards.",
        null,
        "A date-only key is monotonic and creates a hot shard.",
        "`status` has very low cardinality."
      ],
      "atl-30": [
        null,
        "Unsharding and resharding by hand moves all data twice and is not the online path.",
        "Editing config metadata directly is unsupported and can corrupt the cluster.",
        "The balancer never changes the shard key."
      ],
      "atl-31": [
        "The panel shows live activity but does not recommend indexes.",
        "Data Explorer browses and edits data; it does not analyze slow queries.",
        null,
        "The Activity Feed lists project events, not query recommendations."
      ],
      "atl-32": [
        "The Real-Time panel only shows current activity, not yesterday.",
        null,
        "Access list history does not show query performance.",
        "Backups are unrelated to query latency analysis."
      ],
      "atl-33": [
        "Connection count is a separate metric.",
        "Replication lag is shown in its own metric.",
        "Disk usage is not reflected in Query Targeting.",
        null
      ],
      "atl-34": [
        "Network traffic reflects volume, not whether queries are indexed.",
        null,
        "The number of users has nothing to do with query efficiency.",
        null
      ],
      "atl-35": [
        "Removing alerts leaves real incidents undetected.",
        "Email-only routing delays urgent incidents and keeps the noise.",
        "A 1% threshold creates even more noise.",
        null
      ],
      "atl-36": [
        "The profiler does not encrypt operations.",
        null,
        "The profiler only records; it never rewrites queries.",
        "explain() is still needed to analyze specific query plans."
      ],
      "atl-37": [
        null,
        "Access list size does not affect read latency.",
        "Atlas clusters are always replica sets.",
        "TLS version does not cause cache pressure."
      ],
      "atl-38": [
        "More users do not add disk throughput.",
        "The access list is unrelated to disk performance.",
        null,
        "A smaller tier reduces capacity and makes the bottleneck worse."
      ],
      "atl-39": [
        "Termination protection prevents deletion; it does not scale capacity.",
        null,
        "A compliance policy concerns backups, not capacity.",
        "Read-only nodes add read locality, not automatic sizing of the primary."
      ],
      "atl-40": [
        null,
        "A 7-day profiler view is for historical analysis, not live triage.",
        "Index suggestions do not show current operations.",
        "The Activity Feed records project events, not running queries."
      ],
      "atl-41": [
        "TLS protects data in transit, not at rest.",
        "Client-side encryption is application-level and does not give KMS control over storage encryption.",
        "Network access to KMS is not how customer key management is configured.",
        null
      ],
      "atl-42": [
        "`0.0.0.0/0` opens the cluster to the entire internet.",
        null,
        "Peering connects VPCs, not an individual laptop.",
        "The IP Access List cannot be disabled while keeping the cluster secure."
      ],
      "atl-43": [
        "VPC peering requires non-overlapping CIDR blocks.",
        "Public connections traverse the internet, which policy forbids.",
        null,
        "Per-laptop VPNs do not cover the application workload and are not an Atlas feature."
      ],
      "atl-44": [
        null,
        "Encryption at rest is configured separately with customer key management.",
        "Authentication is handled by database users and their mechanisms.",
        "Replication is configured in the cluster topology, not in peering."
      ],
      "atl-45": [
        "Project Read Only is read-only on the Atlas control plane and Project Owner is far broader.",
        "Atlas users can be invited to projects.",
        "Atlas API keys manage Atlas resources; they are not database credentials.",
        null
      ],
      "atl-46": [
        "This still stores a password, which the team wants to avoid.",
        null,
        "Atlas API keys cannot authenticate to the database.",
        "Atlas does not allow anonymous database access."
      ],
      "atl-47": [
        "Any-database write access is far broader than required.",
        "`dbAdmin` grants administrative actions, not the needed data access.",
        null,
        "Relying on people not to misuse broad permissions is not least privilege."
      ],
      "atl-48": [
        "`readAnyDatabase` exposes every database.",
        "`atlasAdmin` grants full administrative control.",
        "`readWrite` allows modifications that are not needed.",
        null
      ],
      "atl-49": [
        null,
        "TLS cannot be disabled in Atlas, and network rules do not encrypt traffic.",
        "Encryption at rest does not control the transport protocol.",
        "Database roles cannot restrict TLS protocol versions."
      ],
      "atl-50": [
        null,
        "`atlasAdmin` for applications grants far more than needed.",
        null,
        "Shared credentials prevent auditing and make rotation and revocation hard."
      ]
    },
    "glossary": [
      { "term": "Replica Set", "cat": "Reliability", "d": 2, "def": "Group of mongod members holding the same data; one primary accepts writes and secondaries replicate its oplog.", "tip": "Every Atlas cluster is at least a 3-member replica set." },
      { "term": "Electable Node", "cat": "Reliability", "d": 2, "def": "Replica set member that votes in elections and can become primary.", "tip": "Read-only and analytics nodes do not vote." },
      { "term": "Oplog Window", "cat": "Reliability", "d": 2, "def": "Time span of operations retained in the primary's oplog.", "tip": "A secondary lagging beyond it needs a full initial sync." },
      { "term": "Continuous Cloud Backup", "cat": "Reliability", "d": 2, "def": "Atlas backup mode that enables point-in-time restore within a configured window.", "tip": "Use it when RPO must be minutes, not hours." },
      { "term": "Backup Compliance Policy", "cat": "Reliability", "d": 2, "def": "Project-level policy that prevents deleting backups or weakening backup settings.", "tip": "Protects even against compromised Project Owners." },
      { "term": "Identify → Mitigate → Remediate", "cat": "Reliability", "d": 2, "def": "Incident methodology: find the cause, reduce user impact fast, then fix the root cause.", "tip": "Mitigation must not destroy data." },
      { "term": "ESR Guideline", "cat": "Indexing", "d": 3, "def": "Order compound index fields Equality, then Sort, then Range.", "tip": "Avoids in-memory SORT stages." },
      { "term": "Rolling Index Build", "cat": "Indexing", "d": 3, "def": "Atlas option that builds an index on one replica set member at a time.", "tip": "Less impact, longer total build time." },
      { "term": "Shard Key", "cat": "Sharding", "d": 4, "def": "Field or fields that determine how documents are distributed across shards.", "tip": "Needs high cardinality, low frequency and non-monotonic growth." },
      { "term": "reshardCollection", "cat": "Sharding", "d": 4, "def": "Command that changes a collection's shard key online.", "tip": "`refineCollectionShardKey` only adds suffix fields." },
      { "term": "Performance Advisor", "cat": "Monitoring", "d": 5, "def": "Atlas tool that suggests indexes from slow queries and flags redundant or unused ones.", "tip": "Suggestions are ranked by estimated impact." },
      { "term": "Query Profiler", "cat": "Monitoring", "d": 5, "def": "Atlas view of slow operations over a selectable time range.", "tip": "Use it for past incidents; use the Real-Time panel for live ones." },
      { "term": "Query Targeting", "cat": "Monitoring", "d": 5, "def": "Ratio of scanned objects or keys to returned documents.", "tip": "Values far above 1 point to missing indexes." },
      { "term": "Real-Time Performance Panel", "cat": "Monitoring", "d": 5, "def": "Live view of current operations, hot collections and slow queries.", "tip": "First stop during an active incident." },
      { "term": "IP Access List", "cat": "Security", "d": 6, "def": "Allowed IP addresses and CIDR blocks that can connect to a project's clusters.", "tip": "Prefer temporary entries for short-lived access." },
      { "term": "Private Endpoint", "cat": "Security", "d": 6, "def": "Private, one-way connectivity to Atlas via PrivateLink, Private Link or Private Service Connect.", "tip": "No CIDR overlap concerns, unlike VPC peering." },
      { "term": "Customer Key Management", "cat": "Security", "d": 6, "def": "Encryption at rest using a key you control in AWS KMS, Azure Key Vault or Google Cloud KMS.", "tip": "Revoking the key makes the data unreadable." },
      { "term": "Atlas User vs Database User", "cat": "Security", "d": 6, "def": "Atlas users manage the Atlas UI/API with org/project roles; database users connect to clusters with database roles.", "tip": "Applications always need database users." },
      { "term": "Custom Role", "cat": "Security", "d": 6, "def": "Database role combining specific actions on specific namespaces.", "tip": "Use when built-in roles grant more than needed." }
    ]
  };
})(window);
