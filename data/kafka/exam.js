/* =========================================================================
   data/kafka/exam.js — Apache Kafka & Confluent (CCDAK / Administración) (English)
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["kafka-confluent"] = {
    "id": "kafka-confluent",
    "appId": "kafka-confluent",
    "provider": "Apache Kafka & Confluent",
    "badge": "Kafka & Confluent",
    "icon": "🌀",
    "color": "#ff6600",
    "title": "Apache Kafka & Confluent (CCDAK / Administration)",
    "subtitle": "Cluster architecture and KRaft, Producers and Idempotence/EOS, Consumer Groups and Cooperative Rebalancing, Schema Registry, Kafka Connect, Kafka Streams/ksqlDB, and Security/Operations.",
    "passingScore": 75,
    "domains": {
      "1": "Kafka Architecture, Partitions, Replication, and KRaft",
      "2": "Producers, Delivery Guarantees, Serialization, and Schema Registry",
      "3": "Consumers, Consumer Groups, Offset Management, and Rebalancing",
      "4": "Confluent Ecosystem: Kafka Connect, Kafka Streams, and ksqlDB",
      "5": "Security (SASL/mTLS/ACLs), Monitoring, Compaction, and Performance"
    },
    "shortDomains": {
      "1": "Architecture & KRaft",
      "2": "Producers & Schemas",
      "3": "Consumers & Offsets",
      "4": "Connect, Streams & ksqlDB",
      "5": "Security & Operations"
    },
    "topics": [
      {
        "id": "t-1-1",
        "d": 1,
        "title": "1.1 · Cluster Architecture, Partitions, ISR, High Watermark, and KRaft",
        "html": "\n<h4>Anatomy of a Partition: Immutable Commit Log</h4>\n<p>In Apache Kafka, a <b>topic</b> is subdivided into one or more <b>partitions</b>. Each partition is an ordered, immutable sequence of records structured as an <i>append-only commit log</i>. Each message within a partition receives a unique sequential identifier called an <b>offset</b>.</p>\n<ul>\n  <li><b>Log End Offset (LEO):</b> The offset of the next message that will be written to a replica's log (it marks the end of the log on that replica).</li>\n  <li><b>High Watermark (HW):</b> The offset of the last message that has been successfully replicated to <b>all in-sync replicas (ISR)</b>. Consumers can <i>only</i> read records with an offset lower than the HW, avoiding dirty reads of unsecured data.</li>\n</ul>\n\n<h4>Replica Roles and the In-Sync Replicas (ISR)</h4>\n<table class=\"keytable\">\n<tr><th>Component / Metric</th><th>Technical Function</th><th>Failure / Out-of-Sync Criterion</th></tr>\n<tr><td><b>Leader Replica</b></td><td>Serves all client reads and writes (except reads from follower replicas configured with <code>rack.id</code>).</td><td>If the leader broker collapses, the Controller elects a new leader from among the ISR members.</td></tr>\n<tr><td><b>Follower Replica</b></td><td>Acts as an internal consumer: sends periodic <code>FetchRequest</code> requests to the leader to copy new messages to its local log.</td><td>Does not serve writes; replicates passively.</td></tr>\n<tr><td><b>ISR (In-Sync Replicas)</b></td><td>Subset of replicas that stay up to date with the leader according to <code>replica.lag.time.max.ms</code> (30,000 ms by default).</td><td>If a replica does not send a valid fetch or does not advance its LEO before this timeout expires, it is removed from the ISR.</td></tr>\n</table>\n\n<h4>Architectural Evolution: From Apache ZooKeeper to KRaft (KIP-500)</h4>\n<p>Traditionally, Kafka depended on ZooKeeper for controller election, broker registration, and topic management. With <b>KRaft (Kafka Raft Metadata Mode)</b>, metadata management is unified within Kafka itself:</p>\n<ul>\n  <li><b>Controller Quorum:</b> An odd number of nodes (typically 3 or 5) run the Raft consensus protocol, managing the internal <code>@metadata</code> partition.</li>\n  <li><b>process.roles:</b> Each node is configured as <code>broker</code>, <code>controller</code>, or combined mode <code>broker,controller</code>.</li>\n  <li><b>Instant Failover:</b> The active controller replicates the metadata log to the standby controllers in RAM; when the leader fails, election and recovery take milliseconds instead of minutes (eliminating the bottleneck of scanning thousands of znodes in ZK).</li>\n</ul>\n<div class=\"tip\"><b>KRaft Production Rule:</b> In large-scale production environments, always separate the roles: keep 3 nodes dedicated exclusively with <code>process.roles=controller</code> and the rest as <code>process.roles=broker</code>. Mixing roles in production exposes controllers to GC pauses or I/O saturation caused by broker data traffic.</div>\n"
      },
      {
        "id": "t-1-2",
        "d": 1,
        "title": "1.2 · Partition Resilience: acks, min.insync.replicas, and Unclean Leader Election",
        "html": "\n<h4>The Durability and Availability Equation</h4>\n<p>Resilience in Kafka is defined by the interaction between the producer configuration (<code>acks</code>) and the broker/topic policies (<code>replication.factor</code> and <code>min.insync.replicas</code>):</p>\n<table class=\"keytable\">\n<tr><th>replication.factor</th><th>min.insync.replicas</th><th>acks (Producer)</th><th>Brokers that can fail without halting writes</th><th>Durability Guarantee</th></tr>\n<tr><td>3</td><td>2</td><td>all (-1)</td><td>1 broker down</td><td><b>Optimal (Enterprise Standard):</b> Zero data loss guaranteed and high availability.</td></tr>\n<tr><td>3</td><td>3</td><td>all (-1)</td><td>0 brokers down</td><td><b>Fragile:</b> Any restart or failure of just 1 broker blocks all writes with <code>NotEnoughReplicasException</code>.</td></tr>\n<tr><td>3</td><td>1</td><td>1</td><td>2 brokers down</td><td><b>High Risk:</b> If the leader acknowledges the write and fails before the followers replicate, the message is lost.</td></tr>\n<tr><td>3</td><td>2</td><td>0</td><td>N/A</td><td><b>No guarantees:</b> The producer does not wait for an ACK. Massive loss in case of a network or broker failure.</td></tr>\n</table>\n\n<h4>Clean vs. Unclean Leader Election</h4>\n<p>What happens if the leader fails and <b>no ISR replica is available</b> (for example, after a simultaneous failure of 2 out of 3 nodes)?</p>\n<ul>\n  <li><b>unclean.leader.election.enable = false (Recommended):</b> The partition enters the <code>Offline</code> state (unavailable for reads and writes) until one of the replicas from the original ISR comes back online. <b>Consistency is prioritized over availability: zero data loss.</b></li>\n  <li><b>unclean.leader.election.enable = true:</b> A lagging replica outside the ISR is promoted to leader. <b>Availability is prioritized at the cost of irrecoverable data loss</b>: messages that were on the previous leader but not on the promoted replica are truncated and permanently destroyed, causing severe offset inconsistencies.</li>\n</ul>\n\n<h4>Log Segments and Index Files</h4>\n<p>Each partition is stored on the broker's file system divided into <b>segments</b>:</p>\n<ul>\n  <li><code>.log</code>: Stores the actual serialized records on sequential disk.</li>\n  <li><code>.index</code>: Sparse index that maps the <i>logical offset</i> to the <i>physical byte position</i> within the <code>.log</code> file.</li>\n  <li><code>.timeindex</code>: Maps timestamps to the corresponding offset for efficient lookups by date.</li>\n  <li><b>Segment Roll:</b> A new segment is created when the active segment exceeds <code>segment.bytes</code> (1 GB by default) or <code>segment.ms</code> (7 days by default). Retention (by time or size) only evaluates closed (non-active) segments.</li>\n</ul>\n<div class=\"tip\"><b>Beware of segment.ms:</b> If you have a topic with 3-day retention (<code>retention.ms=259200000</code>) but traffic is very low and <code>segment.ms</code> has the default value of 7 days, old messages from 6 days ago will NOT be deleted because they still reside in the active segment. Set <code>segment.ms</code> to the same order of magnitude as <code>retention.ms</code> on low-volume topics.</div>\n"
      },
      {
        "id": "t-2-1",
        "d": 2,
        "title": "2.1 · Producers: Delivery Guarantees, Idempotence, and EOS Transactions",
        "html": "\n<h4>Delivery Guarantees and Acknowledgment Levels (acks)</h4>\n<table class=\"keytable\">\n<tr><th>acks</th><th>Required Acknowledgment</th><th>Latency</th><th>Risk of Loss</th><th>Recommended Use Case</th></tr>\n<tr><td><b>0</b></td><td>None; the producer assumes success as soon as it places the bytes on the network socket.</td><td>Minimal (&lt; 1 ms)</td><td>Extreme (if the broker fails or there is a network failure, the batch is lost).</td><td>Disposable high-frequency metrics, non-critical clicks.</td></tr>\n<tr><td><b>1</b></td><td>The leader broker writes to its local log and responds with an ACK immediately.</td><td>Low</td><td>Moderate (if the leader acknowledges and fails before the followers replicate).</td><td>Standard application logs where minimal loss is tolerable.</td></tr>\n<tr><td><b>all / -1</b></td><td>The leader writes to its log and waits for all replicas in the current <b>ISR</b> to acknowledge the write.</td><td>Medium</td><td>None (as long as <code>min.insync.replicas &gt;= 2</code>).</td><td>Finance, payments, inventory, auditing, and core systems.</td></tr>\n</table>\n\n<h4>The Idempotent Producer (KIP-98)</h4>\n<p>When a send is retried after a network timeout where the broker did store the message but the response was lost, a traditional producer creates duplicates. With <code>enable.idempotence = true</code>:</p>\n<ol>\n  <li>The broker assigns the producer a unique 64-bit <b>Producer ID (PID)</b> during the initial handshake.</li>\n  <li>For each batch and partition, the producer increments a monotonically increasing integer <b>Sequence Number</b> (0, 1, 2...).</li>\n  <li>The broker stores in memory the last 5 acknowledged sequence numbers per partition: if it receives a message with a Sequence Number that has already been persisted, it acknowledges it without duplicating it in the log. If a gap arrives (e.g., 4 arrives when it expected 2), it rejects the batch with <code>OutOfOrderSequenceException</code>.</li>\n</ol>\n<p><b>Mandatory requirements:</b> <code>acks = all</code>, <code>retries &gt; 0</code>, and <code>max.in.flight.requests.per.connection &lt;= 5</code>.</p>\n\n<h4>Exactly-Once Semantics (EOS) and Atomic Transactions</h4>\n<p>Kafka transactions make it possible to coordinate atomic writes across multiple partitions and topics, together with the commit of the consumed offsets (the <i>consume-transform-produce</i> pattern):</p>\n<ul>\n  <li><b>transactional.id:</b> Persistent identifier assigned by the user to the producer so that it survives restarts.</li>\n  <li><b>Transaction Coordinator:</b> Broker responsible for managing transaction state in the internal <code>__transaction_state</code> topic using a Two-Phase Commit (2PC) protocol.</li>\n  <li><b>Control Markers:</b> Special control messages (<code>COMMIT</code> or <code>ABORT</code>) written to the data partitions.</li>\n  <li><b>Consumer: isolation.level = read_committed:</b> The consumer withholds messages up to the <b>Last Stable Offset (LSO)</b>; it hides aborted messages and only delivers records from successfully committed transactions.</li>\n</ul>\n<div class=\"tip\"><b>The max.in.flight myth:</b> Historically, <code>max.in.flight.requests.per.connection=1</code> was required to avoid reordering on retries. With <code>enable.idempotence=true</code>, Kafka safely supports up to <code>5</code> in-flight requests while maintaining strict message ordering, since the broker validates the concurrent Sequence Numbers.</div>\n"
      },
      {
        "id": "t-2-2",
        "d": 2,
        "title": "2.2 · Producers: Batching, Compression, Partitioning, and Schema Registry",
        "html": "\n<h4>Internal Mechanics of Batching and Compression</h4>\n<p>The Kafka producer does not send each message immediately. It uses an internal buffer (<code>RecordAccumulator</code>) structured per partition:</p>\n<table class=\"keytable\">\n<tr><th>Parameter</th><th>Default value</th><th>Impact on Throughput vs. Latency</th></tr>\n<tr><td><b>batch.size</b></td><td>16,384 bytes (16 KB)</td><td>Maximum size in bytes of each batch per partition. Raising it to 64 KB or 128 KB maximizes throughput under high loads.</td></tr>\n<tr><td><b>linger.ms</b></td><td>0 ms</td><td>Maximum time the producer waits before sending a batch that is not full. Setting it to 5–20 ms allows many more messages to accumulate per batch, dramatically multiplying throughput with imperceptible latency.</td></tr>\n<tr><td><b>compression.type</b></td><td>none (use lz4 / zstd)</td><td>Compression is performed on the producer client. It reduces WAN bandwidth and disk usage on the broker. <code>lz4</code> offers the best CPU/performance ratio; <code>zstd</code> offers maximum compression for large payloads.</td></tr>\n</table>\n\n<h4>Partitioning Strategies</h4>\n<ul>\n  <li><b>With Key (Key != null):</b> Kafka applies a hashing function (by default <code>murmur2(key) % num_partitions</code>). It guarantees that all messages with the same key go strictly to the <b>same partition</b> (absolute ordering per entity/customer).</li>\n  <li><b>Without Key (Key == null):</b> Modern versions use the <b>Sticky Partitioner (KIP-480)</b>, which concentrates consecutive records in the same partition until <code>batch.size</code> is filled or <code>linger.ms</code> is reached before rotating to the next one, avoiding inefficient micro-batches.</li>\n</ul>\n\n<h4>Confluent Schema Registry: Wire Format and Compatibility Modes</h4>\n<p>Schema Registry decouples producers and consumers by validating schemas (Avro, Protobuf, JSON Schema) centrally. In each published message, the serializer injects a <b>5-byte</b> binary header called the <b>Confluent Wire Format</b>:</p>\n<ul>\n  <li><b>Byte 0 (Magic Byte):</b> Always <code>0x00</code> (identifies the Confluent protocol).</li>\n  <li><b>Bytes 1–4 (Schema ID):</b> A 4-byte integer in Big-Endian format that references the unique ID of the schema registered in Schema Registry.</li>\n  <li><b>Bytes 5+ (Payload):</b> Binary message data serialized with the corresponding schema.</li>\n</ul>\n<table class=\"keytable\">\n<tr><th>Compatibility Mode</th><th>What the schema change allows</th><th>Mandatory Deployment Rule</th></tr>\n<tr><td><b>BACKWARD (Default)</b></td><td>Consumers with the new schema can read data produced with the previous schema (e.g., adding optional fields with a default or deleting fields).</td><td><b>Upgrade Consumers first</b>, Producers afterward.</td></tr>\n<tr><td><b>FORWARD</b></td><td>Consumers with the old schema can read data produced with the new schema (e.g., adding new fields or deleting fields with a default).</td><td><b>Upgrade Producers first</b>, Consumers afterward.</td></tr>\n<tr><td><b>FULL</b></td><td>Combines BACKWARD and FORWARD: new reads old and old reads new. Only 100% symmetric changes are allowed.</td><td><b>Any order</b> (safe decoupled deployment).</td></tr>\n<tr><td><b>TRANSITIVE variants</b></td><td>Apply the rules not only against the immediately previous version, but against <b>all registered historical versions</b>.</td><td>Mandatory in architectures with infinite data retention.</td></tr>\n</table>\n<div class=\"tip\"><b>Classic serialization error:</b> If a generic consumer tries to read a topic governed by Schema Registry using a raw JSON or String deserializer, it will fail immediately with illegal character errors or data corruption because of the first 5 binary bytes (Magic Byte + Schema ID).</div>\n"
      },
      {
        "id": "t-3-1",
        "d": 3,
        "title": "3.1 · Consumers: Consumer Groups, Partition Assignment, and Offsets",
        "html": "\n<h4>The Consumer Group Model and Horizontal Scalability</h4>\n<p>A <b>Consumer Group</b> makes it possible to split processing work across multiple instances sharing the same <code>group.id</code>:</p>\n<ul>\n  <li><b>Golden Rule:</b> Each partition is consumed at any given time by <b>at most one instance</b> of that group.</li>\n  <li><b>Maximum Parallelism:</b> The maximum number of active consumers processing data is exactly equal to the <b>number of partitions in the topic</b>. If you have a topic with 8 partitions and launch 12 consumer instances in the same group, 4 of them will remain completely idle.</li>\n  <li><b>Multiple Groups (Pub/Sub):</b> If two applications use different <code>group.id</code> values (e.g., <code>billing-service</code> and <code>fraud-service</code>), both receive all of the messages independently.</li>\n</ul>\n\n<h4>Offset Management: Internal __consumer_offsets Topic</h4>\n<p>Consumer progress is persisted in the internal <code>__consumer_offsets</code> topic (50 partitions, <code>cleanup.policy=compact</code> policy). The Group Coordinator responsible for a group is determined with the formula:</p>\n<pre><code>partition = Math.abs(group.id.hashCode()) % 50</code></pre>\n<p>The leader broker of that <code>__consumer_offsets</code> partition acts as the <b>Group Coordinator</b> for that group.</p>\n\n<h4>Commit Strategies: Risk of Duplication vs. Data Loss</h4>\n<table class=\"keytable\">\n<tr><th>Strategy</th><th>Configuration / Method</th><th>Commit Timing</th><th>Guarantee / Main Risk</th></tr>\n<tr><td><b>Auto-commit</b></td><td><code>enable.auto.commit = true</code><br><code>auto.commit.interval.ms = 5000</code></td><td>Automatic on the next call to <code>poll()</code> if the interval has elapsed.</td><td><b>Risk of duplicates or loss:</b> If the app processes part of the batch and fails, the unprocessed records are lost if the offset was committed, or duplicated if it was not.</td></tr>\n<tr><td><b>Manual Synchronous</b></td><td><code>commitSync()</code></td><td>Blocks the consumer thread until an ACK is received from <code>__consumer_offsets</code>.</td><td><b>Safe At-Least-Once:</b> Automatically retries on transient failures. Penalizes throughput if called per record.</td></tr>\n<tr><td><b>Manual Asynchronous</b></td><td><code>commitAsync(callback)</code></td><td>Non-blocking; sends the commit request and continues immediately.</td><td><b>High Throughput:</b> <i>Never retries</i> on error to prevent an old commit from overwriting a more recent one that was already confirmed.</td></tr>\n</table>\n\n<h4>Behavior on a New Partition: auto.offset.reset</h4>\n<table class=\"keytable\">\n<tr><th>Value</th><th>Behavior</th></tr>\n<tr><td><b>earliest</b></td><td>Starts reading from the oldest offset available in the partition (useful for reprocessing or initial load).</td></tr>\n<tr><td><b>latest (default)</b></td><td>Starts reading only the new messages that arrive from the moment of subscription.</td></tr>\n<tr><td><b>none</b></td><td>Throws <code>NoOffsetForPartitionException</code> if no previously committed offset exists for that group on that partition.</td></tr>\n</table>\n<div class=\"tip\"><b>Professional Commit Pattern:</b> Use <code>commitAsync()</code> during the regular processing loop to maintain high performance, and run a <code>commitSync()</code> in a <code>finally</code> block when closing the consumer or in the <code>ConsumerRebalanceListener</code> callbacks to secure the last offset before giving up the partition.</div>\n"
      },
      {
        "id": "t-3-2",
        "d": 3,
        "title": "3.2 · Consumers: Liveness, Timeouts, and Cooperative Rebalancing",
        "html": "\n<h4>Liveness and Failure Detection in Consumer Clients</h4>\n<p>The Kafka consumer client separates the detection of process failures from slow data processing using two independent threads:</p>\n<table class=\"keytable\">\n<tr><th>Parameter</th><th>Responsible Thread</th><th>Purpose</th><th>What Happens When Exceeded</th></tr>\n<tr><td><b>session.timeout.ms</b><br>(Default: 45s)</td><td>Heartbeat Thread (background)</td><td>Detects physical node failures, JVM freezes, or loss of network connectivity with the Group Coordinator.</td><td>The coordinator declares the consumer dead and starts a rebalance to reassign its partitions.</td></tr>\n<tr><td><b>heartbeat.interval.ms</b><br>(Default: 3s)</td><td>Heartbeat Thread (background)</td><td>Frequency at which the background thread sends presence heartbeats to the broker.</td><td>It must be set to at most <b>1/3 of <code>session.timeout.ms</code></b>.</td></tr>\n<tr><td><b>max.poll.interval.ms</b><br>(Default: 300s / 5m)</td><td>Main Processing Thread</td><td>Maximum time allowed between two consecutive calls to <code>poll()</code>.</td><td>If processing the batch on the main thread takes longer than this time, the client <b>removes itself from the group</b>, causing a disruptive rebalance.</td></tr>\n<tr><td><b>max.poll.records</b><br>(Default: 500)</td><td>Main Processing Thread</td><td>Maximum number of records returned by a single call to <code>poll()</code>.</td><td>Primary tool for avoiding exceeding <code>max.poll.interval.ms</code> when DB/API calls take time per record.</td></tr>\n</table>\n\n<h4>Rebalance Protocols: Eager vs. Cooperative Sticky</h4>\n<table class=\"keytable\">\n<tr><th>Characteristic</th><th>Eager Rebalancing (Traditional)</th><th>Incremental Cooperative Rebalancing (KIP-429)</th></tr>\n<tr><td><b>Mechanism</b></td><td><b>Stop-The-World:</b> All consumers in the group give up all of their assigned partitions simultaneously and stop processing data while they are reassigned.</td><td><b>Incremental:</b> Only the specific partitions that need to change owners are revoked and migrated. The remaining consumers continue processing without pause.</td></tr>\n<tr><td><b>Assignors</b></td><td><code>RangeAssignor</code>, <code>RoundRobinAssignor</code>, <code>StickyAssignor</code>.</td><td><code>CooperativeStickyAssignor</code> (recommended modern standard).</td></tr>\n<tr><td><b>Latency Impact</b></td><td>Massive latency spikes and ingestion pauses during continuous deployments.</td><td>Smooth and transparent: minimal impact on processing continuity.</td></tr>\n</table>\n\n<h4>Static Membership (KIP-345) and Deployments on Kubernetes</h4>\n<p>On Kubernetes, a <i>rolling update</i> restarts pods one by one. With traditional dynamic membership, each restarted pod triggers <b>two global rebalances</b> (one when it shuts down and another when it rejoins).</p>\n<ul>\n  <li>By setting <code>group.instance.id = \"fixed-pod-id\"</code>, the consumer becomes a <b>static member</b>.</li>\n  <li>When the pod restarts, the Group Coordinator keeps its partitions reserved without triggering any rebalance during the grace period set by <code>session.timeout.ms</code>.</li>\n</ul>\n<div class=\"tip\"><b>Rebalance Storm Diagnosis:</b> If you see a consumer disconnecting and reconnecting in an infinite loop throwing <code>CommitFailedException</code>, it is almost never a network problem: the problem is that processing a batch took longer than <code>max.poll.interval.ms</code>. Solution: reduce <code>max.poll.records</code> (e.g., to 50 or 100) or increase <code>max.poll.interval.ms</code>.</div>\n"
      },
      {
        "id": "t-4-1",
        "d": 4,
        "title": "4.1 · Kafka Connect: Architecture, Internal Topics, SMTs, and Dead Letter Queues",
        "html": "\n<h4>Architecture: Standalone vs. Distributed</h4>\n<p><b>Kafka Connect</b> is the scalable framework for integrating Kafka with external systems (relational databases, Elasticsearch, S3, Snowflake, MongoDB):</p>\n<ul>\n  <li><b>Standalone Mode:</b> A single local process for development or testing. It does not tolerate node failures or scale horizontally. It stores configurations and offsets in local disk files.</li>\n  <li><b>Distributed Mode (Mandatory in Production):</b> A cluster of multiple <i>Workers</i> coordinated through Kafka's Consumer Group protocol. Tasks are automatically distributed among the cluster's workers with auto-rebalancing on failures.</li>\n</ul>\n\n<h4>Internal Topics in Kafka Connect Distributed</h4>\n<table class=\"keytable\">\n<tr><th>Internal Topic</th><th>Partitions</th><th>cleanup.policy</th><th>Critical Purpose</th></tr>\n<tr><td><code>config.storage.topic</code></td><td><b>Strictly 1</b></td><td><code>compact</code></td><td>Stores connector configurations. Requires exactly 1 partition to guarantee strict linear ordering across all workers.</td></tr>\n<tr><td><code>offset.storage.topic</code></td><td>Multiple (e.g., 25–50)</td><td><code>compact</code></td><td>Records the read offsets of Source Connectors in the source system.</td></tr>\n<tr><td><code>status.storage.topic</code></td><td>Multiple (e.g., 5)</td><td><code>compact</code></td><td>Records the real-time status (<code>RUNNING</code>, <code>PAUSED</code>, <code>FAILED</code>) of connectors and tasks.</td></tr>\n</table>\n\n<h4>Single Message Transforms (SMTs)</h4>\n<p>SMTs modify individual records in memory on the fly (in-flight) before writing to Kafka (Source) or before delivering to the destination (Sink):</p>\n<ul>\n  <li>Field modification: <code>org.apache.kafka.connect.transforms.InsertField</code> (injects timestamps, partition metadata, or static values).</li>\n  <li>Dynamic routing: <code>RegexRouter</code> (modifies the destination topic name based on a regex).</li>\n  <li>Security / Privacy: <code>MaskField</code> (masks card numbers or PII data by replacing them with hashes or nulls).</li>\n  <li>Key transformation: <code>ValueToKey</code> (extracts a field from the JSON/Avro payload and turns it into the Kafka message key).</li>\n</ul>\n\n<h4>Error Handling and Dead Letter Queue (DLQ) in Sink Connectors</h4>\n<p>When an invalid or corrupt record (<i>poison pill</i>) reaches a Sink Connector, the default configuration (<code>errors.tolerance = none</code>) causes the task to fail and stop immediately (<code>FAILED</code>).</p>\n<table class=\"keytable\">\n<tr><th>Parameter</th><th>Recommended Value</th><th>Effect</th></tr>\n<tr><td><code>errors.tolerance</code></td><td><code>all</code></td><td>Continues processing subsequent records without stopping the task on deserialization or conversion failures.</td></tr>\n<tr><td><code>errors.deadletterqueue.topic.name</code></td><td><code>dlq-my-sink-topic</code></td><td>Automatically publishes corrupt messages to the specified Dead Letter Queue topic.</td></tr>\n<tr><td><code>errors.deadletterqueue.context.headers.enable</code></td><td><code>true</code></td><td>Injects debugging headers into the DLQ message with the exception, the error code, the original topic, and the failed offset.</td></tr>\n</table>\n<div class=\"tip\"><b>Fundamental DLQ Limitation:</b> Dead Letter Queues in Kafka Connect <b>only exist for Sink Connectors</b>. A Source Connector that fails while reading from its source (e.g., a corrupt JDBC record) cannot send records to a Connect DLQ because the failure occurs before the record is a valid Kafka object.</div>\n"
      },
      {
        "id": "t-4-2",
        "d": 4,
        "title": "4.2 · Kafka Streams and ksqlDB: Stream-Table Duality, Co-partitioning, and Joins",
        "html": "\n<h4>Stream-Table Duality (KStream vs. KTable vs. GlobalKTable)</h4>\n<table class=\"keytable\">\n<tr><th>Abstraction</th><th>Data Semantics</th><th>Mental Model</th><th>Behavior on Duplicate Key</th></tr>\n<tr><td><b>KStream</b></td><td>Continuous flow of independent, immutable events.</td><td>Insert Stream (historical facts, logs, clicks).</td><td>Each record is processed as a new, independent event.</td></tr>\n<tr><td><b>KTable</b></td><td>Materialized view of the current state per primary key.</td><td>Changelog (UPSERT).</td><td>A new record with the same key overwrites the previous value (a record with a <code>null</code> value acts as a DELETE / Tombstone).</td></tr>\n<tr><td><b>GlobalKTable</b></td><td>Full copy of the dataset on <b>all application instances</b>.</td><td>Full local Lookup Cache (e.g., postal code catalog).</td><td>Stores all partitions of the topic on every node. Does not require co-partitioning in joins with a KStream.</td></tr>\n</table>\n\n<h4>The Mandatory Co-partitioning Requirement</h4>\n<p>To perform a join between two <code>KStream</code>s or between a <code>KStream</code> and a <code>KTable</code>, both input topics must be <b>co-partitioned</b>:</p>\n<ol>\n  <li>Have exactly the <b>same number of partitions</b>.</li>\n  <li>Use the <b>same partitioning strategy and the same key</b> (same serializer / hashing).</li>\n</ol>\n<p>If these conditions are not met, Kafka Streams fails with <code>TopologyException</code> or internally forces a <code>repartition</code> step, writing to and reading back from the cluster, with a significant I/O and latency penalty.</p>\n\n<h4>Persistent State Stores: RocksDB and Changelog Topics</h4>\n<p>Stateful operations (aggregations such as <code>count()</code>, <code>aggregate()</code>, windows, or joins) use local off-heap storage with <b>RocksDB</b>:</p>\n<ul>\n  <li><b>Fault Resilience:</b> Each local RocksDB State Store is backed in Kafka by an <b>internal Changelog Topic</b> with <code>cleanup.policy=compact</code>.</li>\n  <li><b>Ultra-Fast Failover:</b> By setting <code>num.standby.replicas = 1</code> (or more), other instances of the application maintain a warm local copy (warm standby) by continuously reading the changelog. If the primary instance fails, the standby takes over in seconds without waiting to rebuild RocksDB from scratch.</li>\n</ul>\n\n<h4>Types of Time Windows</h4>\n<ul>\n  <li><b>Tumbling Windows:</b> Fixed-size, non-overlapping, contiguous windows (e.g., 10:00 to 10:05, 10:05 to 10:10).</li>\n  <li><b>Hopping Windows:</b> Fixed-size windows with a periodic advance that overlap (e.g., 5-minute duration with a hop every 1 minute).</li>\n  <li><b>Sliding Windows:</b> Based on the exact time difference between two individual records (typically used in stream joins).</li>\n  <li><b>Session Windows:</b> Based on periods of activity separated by intervals of inactivity (<i>inactivity gap</i>).</li>\n</ul>\n\n<h4>ksqlDB: Push Queries vs. Pull Queries</h4>\n<ul>\n  <li><b>Push Queries (<code>EMIT CHANGES</code>):</b> Continuous real-time subscription. The query stays open and emits each new event as soon as it occurs.</li>\n  <li><b>Pull Queries:</b> Synchronous <i>request/response</i>-style query (similar to a classic <code>SELECT ... WHERE ROWKEY = 'X'</code>) that reads the current materialized state in the local table without waiting for future changes.</li>\n</ul>\n<div class=\"tip\"><b>RocksDB Memory Tuning:</b> RocksDB stores its memtables and block caches <b>outside the JVM Heap (Off-Heap)</b>. If you allocate an 8 GB container with a 7 GB JVM heap and multiple stateful KTables, the process will suffer a Linux OOMKilled (Exit Code 137). Reserve at least 40-50% of the container's RAM for RocksDB.</div>\n"
      },
      {
        "id": "t-5-1",
        "d": 5,
        "title": "5.1 · Security: Authentication (mTLS, SASL), Encryption, and Authorization with ACLs",
        "html": "\n<h4>Security Planes in Apache Kafka</h4>\n<p>End-to-end security in a Kafka cluster covers three complementary dimensions:</p>\n<table class=\"keytable\">\n<tr><th>Dimension</th><th>Main Mechanism</th><th>Broker / Client Configuration</th></tr>\n<tr><td><b>Encryption in Transit</b></td><td>TLS / SSL</td><td>Encrypts network packets between producers, consumers, brokers, and Confluent components.</td></tr>\n<tr><td><b>Authentication</b></td><td>mTLS (Mutual TLS / SSL)<br>SASL (SCRAM, OAUTH, GSSAPI/Kerberos)</td><td>Verifies the cryptographic identity of the client or user (determines the <i>KafkaPrincipal</i>).</td></tr>\n<tr><td><b>Authorization</b></td><td>Access Control Lists (ACLs)</td><td>Defines which operations (Read, Write, Create, Describe) a <i>Principal</i> can perform on which resource.</td></tr>\n</table>\n\n<h4>SASL Protocols in Production</h4>\n<table class=\"keytable\">\n<tr><th>SASL Mechanism</th><th>Cryptography / Characteristics</th><th>Typical Use Case</th></tr>\n<tr><td><b>SASL/SCRAM</b><br>(SCRAM-SHA-256 / 512)</td><td>Secure key exchange with salting and cryptographic hashing over multiple iterations. Credentials are stored dynamically in KRaft or ZooKeeper without restarting brokers.</td><td>Modern de facto standard for username/password authentication without heavy external infrastructure.</td></tr>\n<tr><td><b>SASL/OAUTHBEARER</b></td><td>JWT tokens issued by an external OpenID Connect / OAuth 2.0 server (Okta, Keycloak, Azure AD).</td><td>Cloud-native architectures and corporate SSO with federated rotation of short-lived tokens.</td></tr>\n<tr><td><b>SASL/GSSAPI (Kerberos)</b></td><td>Kerberos tickets backed by Active Directory or MIT Kerberos.</td><td>Large corporations and banks with legacy Kerberos infrastructure.</td></tr>\n<tr><td><b>SASL/PLAIN</b></td><td>Clear-text password without hashing.</td><td><b>Dangerous:</b> Only acceptable if it is necessarily encapsulated over TLS-encrypted channels (<code>SASL_SSL</code>).</td></tr>\n</table>\n\n<h4>Authorization with ACLs: Rules and Structure</h4>\n<p>Kafka ACLs are evaluated by the broker's authorizer (<code>org.apache.kafka.metadata.authorizer.StandardAuthorizer</code> in KRaft):</p>\n<pre><code>Principal P is [Allowed / Denied] Operation O from Host H on Resource R</code></pre>\n<ul>\n  <li><b>Deny Precedence:</b> If a client matches a <code>DENY</code> rule and an <code>ALLOW</code> rule simultaneously, <b>the DENY rule always takes absolute precedence</b>.</li>\n  <li><b>Default Deny:</b> With <code>allow.everyone.if.no.acl.found = false</code>, any request on a resource without an explicit <code>ALLOW</code> rule is immediately rejected with <code>TopicAuthorizationException</code> or <code>ClusterAuthorizationException</code>.</li>\n  <li><b>Minimum Permissions for a Producer:</b> <code>Write</code> and <code>Describe</code> operations on the <code>Topic</code>. If it uses transactions or idempotence, it additionally requires <code>Write</code> and <code>Describe</code> on the <code>TransactionalId</code>.</li>\n  <li><b>Minimum Permissions for a Consumer:</b> <code>Read</code> and <code>Describe</code> operations on the <code>Topic</code>, and the <code>Read</code> operation on the corresponding <code>Group</code>.</li>\n</ul>\n<div class=\"tip\"><b>mTLS Configuration (Keystore vs. Truststore):</b> The <b>Keystore</b> contains the client's private key and its own signed certificate (to present itself to the broker). The <b>Truststore</b> contains the certificates of the trusted Certificate Authorities (CAs) used to validate that the certificate presented by the broker is legitimate.</div>\n"
      },
      {
        "id": "t-5-2",
        "d": 5,
        "title": "5.2 · Operations: Log Compaction, Tiered Storage, and Critical JMX Metrics",
        "html": "\n<h4>Log Compaction: Lifecycle and Cleanup</h4>\n<p>With <code>cleanup.policy = compact</code>, Kafka guarantees retaining at least the last known value for each key within a partition (ideal for dimension tables, configurations, or changelogs):</p>\n<ul>\n  <li><b>Head vs. Tail:</b> The <i>Tail</i> contains segments that have already been processed and compacted (Clean). The <i>Head</i> contains new, uncompacted records (Dirty). The <i>Log Cleaner</i> threads read the Head and build a map of recent offsets in RAM (SkimpyOffsetMap) to purge obsolete records in the Tail.</li>\n  <li><b>Active Segment:</b> The active segment (where writes currently occur) is <b>never compacted</b>, no matter how many duplicate messages it receives.</li>\n  <li><b>Tombstones (Deletion):</b> To delete a key, the producer writes a record with that key and a <b>null value</b>. The broker retains the tombstone for <code>delete.retention.ms</code> (default 24h) to ensure slow consumers observe the deletion before it is purged from disk.</li>\n</ul>\n\n<h4>Tiered Storage (Confluent / KIP-405)</h4>\n<p>Resolves the dilemma between storage capacity and cost in architectures with retention of months or years:</p>\n<ul>\n  <li><b>Hot Storage (Local NVMe/SSD):</b> Stores active and recent segments to serve real-time reads with sub-millisecond latency.</li>\n  <li><b>Cold Storage (Object Storage: S3, GCS, Azure Blob):</b> Closed segments are automatically uploaded to massive, low-cost object storage.</li>\n  <li><b>Fast Partition Reassignment:</b> When migrating partitions between brokers, only the few hot local segments are transferred; historical storage is not copied between nodes.</li>\n</ul>\n\n<h4>Critical JMX Metrics in Production</h4>\n<table class=\"keytable\">\n<tr><th>JMX Metric</th><th>Ideal Value</th><th>Alert Interpretation</th></tr>\n<tr><td><code>UnderReplicatedPartitions</code></td><td><b>0</b></td><td>Indicates that one or more ISR replicas are not keeping pace with the leader. Imminent loss of redundancy in the event of failures.</td></tr>\n<tr><td><code>OfflinePartitionsCount</code></td><td><b>0</b></td><td><b>P1 Critical:</b> Partition with no available leader. All read and write operations fail.</td></tr>\n<tr><td><code>ActiveControllerCount</code></td><td><b>1</b></td><td>Exactly 1 across the entire cluster. If it is 0, there is no active controller (metadata frozen). If it is &gt; 1 on ZooKeeper, there is a Split-Brain.</td></tr>\n<tr><td><code>RequestHandlerAvgIdlePercent</code></td><td><b>&gt; 0.30 (30%)</b></td><td>Percentage of idle time of the network/request threads. If it drops below 20%, the brokers are saturated on CPU or disk.</td></tr>\n<tr><td><code>Consumer Lag</code></td><td>Close to 0</td><td>Distance between the log's LEO and the offset committed by the group. Constant growth signals collapsed consumers.</td></tr>\n</table>\n<div class=\"tip\"><b>Heap Tuning on Brokers:</b> The Kafka broker is designed to rely on the <b>Linux Kernel PageCache</b>. Do not allocate more than 8 to 12 GB of RAM to the JVM Heap (<code>-Xms8g -Xmx8g</code>). Leaving 40–50 GB of RAM free on the node for the PageCache allows Kafka to serve consumer reads directly from RAM without touching the physical disk thanks to the <code>sendfile</code> system call (Zero-Copy).</div>\n"
      }
    ],
    "questions": [
      {
        "id": "q-1",
        "d": 1,
        "t": "KRaft and Metadata Quorum",
        "q": "Your organization is migrating a 100-broker Apache Kafka cluster from ZooKeeper to KRaft (Kafka Raft Metadata Mode). During the production design phase, the architecture team debates the node topology and the roles to configure through **process.roles**. What is the official architecture recommendation for a cluster of this size?",
        "o": [
          "Deploy a dedicated, independent quorum of 3 or 5 nodes with `process.roles=controller` and configure the 100 brokers with `process.roles=broker`, isolating roles.",
          "Configure all 100 nodes in combined mode with `process.roles=broker,controller` to distribute the consensus of the `@metadata` log evenly across all servers in the cluster.",
          "Configure a single node with `process.roles=controller` and 99 nodes with `process.roles=broker`, assuming KRaft delegates metadata fault tolerance to local storage.",
          "Deploy an even number of 4 dedicated controllers with `process.roles=controller` and 100 brokers, to balance quorum voting equally between two availability zones."
        ],
        "a": 0,
        "e": "In medium and large-scale production environments, mixing the broker and controller roles on the same nodes (**process.roles=broker,controller**) exposes the metadata quorum to severe disk I/O interference, bandwidth saturation, and Garbage Collection pauses caused by client data traffic. The official recommendation is to isolate 3 or 5 dedicated nodes with **process.roles=controller** running Raft consensus on the internal **@metadata** topic, while the rest operate as pure brokers."
      },
      {
        "id": "q-2",
        "d": 1,
        "t": "High Watermark and LEO",
        "q": "A producer sends a message to partition 0 of a topic with **replication.factor=3** and **min.insync.replicas=2**. The partition's leader broker writes the message to its local log, updating its Log End Offset (LEO) from 104 to 105. However, the two follower replicas that are part of the ISR have not yet sent their next fetch request to copy this record. A consumer configured with **isolation.level=read_uncommitted** makes a call to **poll()**. Will this consumer be able to read the message with offset 104?",
        "o": [
          "No, because no consumer can read above the High Watermark (HW), and the HW only advances when the ISR replicas confirm replication of the record.",
          "Yes, because with `isolation.level=read_uncommitted` the consumer reads directly up to the leader's Log End Offset (LEO) without waiting for follower replication.",
          "Yes, as long as the producer has configured `acks=1` or `acks=0`, which authorizes the leader broker to expose the message immediately in the client's `poll()` call.",
          "No, because with `min.insync.replicas=2` reads are necessarily redirected to a follower replica in the ISR until the leader completes local synchronization."
        ],
        "a": 0,
        "e": "The High Watermark (HW) represents the offset of the last record that has been replicated to all replicas belonging to the ISR. In Apache Kafka, no consumer (even one configured with **isolation.level=read_uncommitted**) can read beyond the HW. This prevents dirty reads: if the leader failed before the followers replicated offset 104, the newly elected leader would not contain that offset, so no client should ever have seen it."
      },
      {
        "id": "q-3",
        "d": 1,
        "t": "In-Sync Replicas and replica.lag.time.max.ms",
        "q": "In a Kafka cluster with **replica.lag.time.max.ms=30000** (30 seconds), a follower broker hosting a replica of a critical partition suffers a prolonged Garbage Collection pause (Stop-The-World) caused by a poorly sized heap. The pause lasts 42 seconds, during which time the follower sends no FetchRequest to the leader. What action does the leader broker take after the 30 seconds have elapsed?",
        "o": [
          "The leader removes the follower replica from the in-sync replica set (ISR), notifying the controller to update the partition metadata.",
          "The leader marks the partition as degraded and rejects writes with `NotEnoughReplicasException`, even though the other replicas in the ISR continue to respond to requests.",
          "The leader declares the partition in the `Offline` state and rejects requests from both producers and consumers until the broker reconnects and the quorum is restored.",
          "The leader preemptively transfers partition leadership to the next follower to try to restore communication with the KRaft quorum."
        ],
        "a": 0,
        "e": "The **replica.lag.time.max.ms** parameter defines the maximum time a follower replica can take to send a fetch request and keep up with the leader's LEO. If that time elapses without synchronization activity, the leader detects the anomaly and removes the follower from the ISR, updating the partition state in the metadata quorum (KRaft or ZK), allowing writes to continue normally as long as **min.insync.replicas** is satisfied."
      },
      {
        "id": "q-4",
        "d": 1,
        "t": "min.insync.replicas and Availability",
        "q": "A critical payments topic in production is configured with **replication.factor=3** and **min.insync.replicas=2**. All producers send transactions with **acks=all** (-1). During a network outage in a data center, 2 of the 3 brokers hosting the replicas of partition 0 disconnect simultaneously, leaving only the leader broker in the ISR (ISR size = 1). What behavior will producers and consumers observe on partition 0?",
        "o": [
          "Producers will receive a `NotEnoughReplicasException` and their writes will be rejected; consumers will be able to continue reading the committed messages up to the High Watermark.",
          "Both producer write operations and consumer read operations will fail immediately with `NotEnoughReplicasException` until the ISR is restored.",
          "Producers will continue writing successfully because the leader transparently downgrades the level to `acks=1`, but consumer reads will be paused.",
          "Producers will be blocked on the client until `delivery.timeout.ms` expires, while consumers will receive a continuous `OffsetOutOfRangeException` error."
        ],
        "a": 0,
        "e": "When a producer sends with **acks=all** and the current ISR size is smaller than **min.insync.replicas** (in this case 1 < 2), the leader broker rejects the write with **NotEnoughReplicasException** (or **NotEnoughReplicasAfterAppendException**) to avoid compromising the agreed durability. However, consumers are not blocked: they can continue reading all the historical data that had already reached the High Watermark before the incident."
      },
      {
        "id": "q-5",
        "d": 1,
        "t": "Unclean Leader Election",
        "q": "A Kafka cluster has **unclean.leader.election.enable=false** configured globally. For a partition with **replication.factor=3**, the leader broker suddenly fails and, at the same time, the only follower that was part of the ISR suffers an irreparable hardware failure. The cluster's third broker hosts a replica that was outside the ISR due to a lag of 5,000 offsets. What happens to the partition in this scenario?",
        "o": [
          "The partition is declared in the `Offline` state and rejects reads and writes until at least one of the replicas that were part of the original ISR is back online.",
          "The controller promotes the replica outside the ISR as the new leader to guarantee availability, permanently truncating the 5,000 offsets that were not replicated.",
          "The controller dynamically reassigns the partition to another available broker in the cluster and asks the producers to retransmit the last 5,000 records using idempotence.",
          "The partition remains operational in read-only mode served by the lagging replica, blocking only new writes from producers until the ISR is recovered."
        ],
        "a": 0,
        "e": "With **unclean.leader.election.enable=false**, Kafka strictly prioritizes data consistency and durability over availability. If no live replica remains within the ISR, no lagging replica (outside the ISR) can be elected as the new leader. As a result, the partition enters the **Offline** state (rejecting reads and writes) until at least one member of the original ISR recovers, guaranteeing that committed data is never lost."
      },
      {
        "id": "q-6",
        "d": 1,
        "t": "Impact of a Forced Unclean Leader Election",
        "q": "In the previous scenario, business leadership demands that the service be restored immediately at all costs and orders the administrator to run a dynamic command to set **unclean.leader.election.enable=true** on the topic. The lagging replica (5,000 offsets behind) is elected as the new leader. What irreversible data integrity consequence occurs immediately?",
        "o": [
          "The 5,000 unreplicated records are permanently lost and, if the previous leader recovers, it will truncate its log to the new leader's epoch, discarding that data.",
          "The 5,000 missing records are moved to the cluster's Dead Letter Queue topic (`__dead_letter`) so that consumers can manually reprocess them after the incident.",
          "The new leader enters read-only mode to preserve consistency until an administrator runs `kafka-leader-election.sh` to force resynchronization.",
          "Connected consumers will immediately receive a fatal `OffsetOutOfRangeException` error and disconnect from the group upon detecting gaps in the partition's log numbering."
        ],
        "a": 0,
        "e": "Enabling **unclean.leader.election.enable=true** allows a replica outside the ISR to become leader to restore availability. However, all committed records that resided on the original leader and never reached this lagging replica are permanently lost. When the former leader restarts, it detects that the new leader has a higher leader epoch and truncates its own log to match the new leader, destroying the data that had previously been acknowledged as successful."
      },
      {
        "id": "q-7",
        "d": 1,
        "t": "Log Segments and Index Files",
        "q": "A Kafka broker stores 2 TB of records in the data directory of a high-volume partition. A consumer requests to read starting at logical offset 450,210. How does the broker locate the exact physical position of the record on disk without having to linearly scan gigabytes of data in the **.log** file?",
        "o": [
          "It consults the sparse `.index` index file in memory using binary search to locate the nearest physical byte position and then advances sequentially in the file.",
          "It consults the `.timeindex` file to resolve the offset through the timestamp and jumps to the physical displacement indicated in the compression header of the data segment.",
          "It traverses the partition's `leader-epoch-checkpoint` metadata file to determine the exact byte offset corresponding to the start of the record batch.",
          "It uses a Bloom filter loaded in the PageCache to verify the existence of the offset and retrieves the file pointer from the partition's control record."
        ],
        "a": 0,
        "e": "Kafka divides partitions into segments and associates a sparse **.index** index file with each **.log** data file. This file maps relative offsets to physical byte positions (file pointers) within the **.log** file. Because the index is sorted and resides in the Linux PageCache, the broker performs an O(log N) binary search to jump to the nearest byte and then sequentially scans only a few records up to the exact offset, achieving ultra-efficient reads."
      },
      {
        "id": "q-8",
        "d": 1,
        "t": "Segment Roll and Retention Policies",
        "q": "An audit topic is configured with time-based retention of 7 days (**retention.ms=604800000**). However, when inspecting the broker's storage, the SRE team discovers messages on disk that are more than 16 days old. Upon reviewing the segment configuration, they observe that **segment.bytes=1073741824** (1 GB) and **segment.ms=1814400000** (21 days), and the current **.log** file weighs only 250 MB. Why have the old messages not been deleted?",
        "o": [
          "Because retention only evaluates closed segments; as long as the active segment has not reached `segment.bytes` or `segment.ms`, it is not rolled and no message within it can be purged.",
          "Because the broker's `retention.check.interval.ms` parameter takes precedence over `retention.ms`, delaying cleanup until the log reaches the global disk size limit.",
          "Because time-based purging requires the group's consumers to commit all of the segment's offsets before the `LogCleaner` thread proceeds with its physical deletion from disk.",
          "Because when retention policies coexist, `segment.ms` acts as the mandatory minimum retention time on disk before deletion by `retention.ms` is enabled."
        ],
        "a": 0,
        "e": "In Kafka, the active segment (the one to which new messages are being written) is never deleted or compacted, regardless of the age of the records it contains. Retention policies (both time-based with **retention.ms** and size-based with **retention.bytes**) are only evaluated and applied to closed (inactive) segments. For topics with a low publishing rate, it is crucial to set **segment.ms** to a value less than or equal to **retention.ms** to force the segment roll and allow timely purging."
      },
      {
        "id": "q-9",
        "d": 1,
        "t": "KRaft Controller Quorum and Fault Tolerance",
        "q": "In a KRaft architecture for a regulated financial environment, **5 dedicated nodes** are deployed with the controller role (**process.roles=controller**). Based on the Raft consensus algorithm used by KRaft, what is the minimum number of controllers that must remain online and operational for the quorum to elect a metadata leader and process changes in the cluster (such as topic creation or partition reassignment)?",
        "o": [
          "At least 3 controllers (simple majority of (5/2) + 1), allowing the simultaneous failure of up to 2 nodes without losing metadata availability.",
          "At least 4 controllers, since KRaft's Raft protocol requires a two-thirds supermajority of votes to authorize changes to the `@metadata` log.",
          "At least 2 controllers, as long as the current leader remains active and the observer replica in the same network zone stays synchronized.",
          "Strictly all 5 controllers, because any network partition in the quorum preemptively blocks writes in the cluster."
        ],
        "a": 0,
        "e": "KRaft is based on the Raft distributed consensus algorithm. For a quorum of N nodes, the number of active nodes required to form a majority (quorum) is **floor(N/2) + 1**. For N = 5, at least 3 controllers must be online and communicating with each other. Therefore, the system can tolerate the simultaneous failure of up to **(N - 1) / 2 = 2** controllers without losing the ability to make changes to the cluster metadata."
      },
      {
        "id": "q-10",
        "d": 1,
        "t": "Rack Awareness and Replica Distribution",
        "q": "You are deploying a Kafka cluster on AWS across 3 Availability Zones (us-east-1a, us-east-1b, us-east-1c). You want to ensure that for any topic with **replication.factor=3**, no partition has more than one replica located in the same Availability Zone, guaranteeing that the total loss of one AZ causes neither data loss nor unavailability. Which configuration must be defined on each broker?",
        "o": [
          "Configure `broker.rack` on each broker with its zone identifier, allowing the replica assignor to distribute partitions across different zones.",
          "Configure `replica.selector.class` with `RackAwareReplicaSelector` on each broker so that replicas are dynamically distributed according to the zones' network topology.",
          "Define `advertised.listeners` with the DNS suffix of each availability zone and enable `zookeeper.rack.enable=true` in the global configuration of all brokers in the cluster.",
          "Set `min.insync.replicas=3` globally to force the replica quorum to require mandatory acknowledgment from brokers in different zones."
        ],
        "a": 0,
        "e": "The **broker.rack** property enables the Rack Awareness mechanism in Apache Kafka. By specifying which rack or availability zone each broker belongs to, the replica assignment algorithm automatically distributes each partition's replicas across different logical racks. This way, for **replication.factor=3** spread across 3 distinct AZs, each replica is guaranteed to reside in a different AZ, protecting the cluster against complete failures of a datacenter or AZ."
      },
      {
        "id": "q-11",
        "d": 1,
        "t": "Partitioning and Parallelism Capacity",
        "q": "A video streaming platform needs to process a sustained rate of **60,000 events per second**. It has been rigorously measured that each consumer microservice instance can stably process a maximum of **3,000 events per second**. The topic was originally created with **8 partitions**. The operations team deploys a Kubernetes deployment with **20 pods** of the same Consumer Group. What will the actual throughput achieved be, and how should the bottleneck be resolved?",
        "o": [
          "Only 8 pods will process data (24,000 eps in total), leaving 12 pods idle; the topic's partitions must be increased to at least 20 to allow simultaneous parallel consumption.",
          "All 20 pods will consume in parallel, reaching 60,000 eps, since Kafka assigns multiple consumers to each partition if they belong to the same deployment group in the cluster.",
          "The Consumer Group will fail with an `IllegalStateException` on the broker, since Kafka prohibits having more active members than partitions in the topic.",
          "60,000 eps will be reached but with massive event duplication, since the 12 surplus pods will concurrently read the already assigned partitions."
        ],
        "a": 0,
        "e": "A fundamental rule of the Consumer Group protocol in Apache Kafka is that each partition of a topic is assigned to **at most one consumer** within the same group. Therefore, with 8 partitions, at most 8 instances can process data in parallel (8 × 3,000 = 24,000 eps); the remaining 12 instances stay idle in passive standby. To reach 60,000 eps, the topic must be scaled to at least 20 partitions (20 × 3,000 = 60,000 eps)."
      },
      {
        "id": "q-12",
        "d": 1,
        "t": "Zero-Copy and I/O Performance on Linux",
        "q": "One of the primary reasons an Apache Kafka broker can deliver millions of messages per second with exceptionally low CPU consumption is the use of the **Zero-Copy** technique. How does this optimization work at the operating system level, and which Linux system call does the broker use to transfer data from the log segments to the consumers' network sockets?",
        "o": [
          "It uses the `sendfile()` syscall, which transfers data from the kernel PageCache to the network socket via DMA, without copying it into the JVM's user space.",
          "It uses `mmap()` together with Java NIO off-heap buffers, allowing the JVM to transfer data blocks from disk to the network interface without context switches.",
          "It uses the `splice()` syscall to connect file descriptors through kernel pipes, forcing batches to be decompressed in an intermediate buffer before being transmitted over the socket.",
          "It uses `epoll()` with vectorized `readv()` and `writev()` calls, delegating direct byte serialization to the network controller hardware."
        ],
        "a": 0,
        "e": "In traditional architectures, reading from disk and sending over the network requires 4 context switches and 4 data copies (disk -> kernel buffer -> user space JVM -> socket buffer -> NIC). With the Linux **sendfile()** system call (Zero-Copy), data is transferred via DMA directly from the kernel PageCache to the physical interface's network socket, never crossing the boundary into the JVM's user space. This eliminates unnecessary heap memory usage and frees up CPU cycles."
      },
      {
        "id": "q-13",
        "d": 2,
        "t": "Durability Guarantees in Producers",
        "q": "A banking platform processes high-value money transfers and simultaneously collects web navigation click metrics. The development team must configure two independent Kafka producers. For bank transfers, the loss of even a single event is not tolerated under any circumstances; for web metrics, the lowest possible latency is sought and occasional loss is tolerated. What are the recommended **acks** configurations for each case?",
        "o": [
          "Transfers: `acks=all` (-1) with retries enabled; Web metrics: `acks=0` in fire-and-forget mode.",
          "Transfers: `acks=1` with infinite retries; Web metrics: `acks=all` with `delivery.timeout.ms=0`.",
          "Transfers: `acks=all` with `retries=0`; Web metrics: `acks=1` with mandatory `snappy` compression.",
          "Transfers: `acks=2` with a replica quorum; Web metrics: `acks=-1` with the send buffer disabled."
        ],
        "a": 0,
        "e": "For critical banking transactions where data loss is unacceptable, the mandatory configuration is **acks=all** (or -1), forcing the leader broker to wait for confirmation from all replicas in the ISR before responding with an ACK to the producer, combined with practically infinite retries (**retries=Integer.MAX_VALUE** or a high **delivery.timeout.ms**). For disposable metrics where minimal latency and maximum throughput take priority, **acks=0** sends packets in fire-and-forget mode without waiting for any acknowledgment."
      },
      {
        "id": "q-14",
        "d": 2,
        "t": "Producer Idempotence (KIP-98)",
        "q": "A producer sends a critical message to the broker. The broker successfully persists the message to disk, but a micro network interruption prevents the ACK response from reaching the producer. When the timeout expires, the producer automatically retries sending the same message. If the producer has **enable.idempotence=true** configured, how does the broker avoid recording a duplicate message?",
        "o": [
          "The broker validates the Producer ID (PID) and the Sequence Number assigned by the producer; if they were already persisted, it confirms the ACK without duplicating the record in the partition's local log.",
          "The broker computes a CRC32 checksum of the payload and discards the incoming message if it matches any record stored in the partition's index.",
          "The broker rejects the duplicate message by comparing the offset assigned by the client with the partition's current High Watermark before writing it to disk.",
          "The broker delegates detection to the KRaft quorum, which maintains a temporary in-memory table with the hashes of the transactions processed in the last 60 seconds."
        ],
        "a": 0,
        "e": "With **enable.idempotence=true**, the broker assigns each producer a unique Producer ID (PID) at startup. For each partition, the producer maintains a monotonic integer sequence number per message or batch. The broker keeps the last processed sequence numbers in memory: if it receives a message with a PID and Sequence Number it already has recorded, it recognizes that this is a retry due to a network failure, returns an ACK to the producer, and skips writing the duplicate to the commit log."
      },
      {
        "id": "q-15",
        "d": 2,
        "t": "Ordering and max.in.flight.requests with Idempotence",
        "q": "Traditionally, to guarantee that messages do not become reordered when retrying after network failures, Kafka engineers had to configure **max.in.flight.requests.per.connection=1**, which severely penalized throughput. Why is it possible in modern versions of Apache Kafka with **enable.idempotence=true** to set **max.in.flight.requests.per.connection** up to **5** while maintaining a strict ordering guarantee?",
        "o": [
          "Because the broker tracks up to 5 sequence numbers per PID and partition; if a batch arrives out of order due to retries, it rejects it with `OutOfOrderSequenceException`, preserving order.",
          "Because the client suspends transmission on the TCP socket and buffers subsequent requests until it receives confirmation of the oldest request sent in the pipeline.",
          "Because the broker buffers incoming requests in a priority queue based on the record's creation timestamp before persisting them sequentially in the partition's log.",
          "Because KRaft's network protocol intercepts batches in transit and dynamically reassigns logical offsets in the controller quorum before the physical save."
        ],
        "a": 0,
        "e": "With idempotence enabled, the broker tracks up to 5 in-flight requests per partition by validating sequence numbers. If batch 0 suffers a transient network failure and is retried while batch 1 is already in transit, the broker will not accept batch 1 until batch 0 has been persisted sequentially (or will throw **OutOfOrderSequenceException** if an unexpected gap occurs), guaranteeing perfect arrival order without reducing network parallelism to 1."
      },
      {
        "id": "q-16",
        "d": 2,
        "t": "EOS Transactions and transactional.id",
        "q": "A financial processing application implements the **consume-transform-produce** pattern to transfer balance between two accounts represented in different topics. To guarantee Exactly-Once semantics (EOS), the developer initializes the producer with a static **transactional.id** and delimits processing with **beginTransaction()** and **commitTransaction()**. What is the role of the **Transaction Coordinator** component on the broker during this flow?",
        "o": [
          "It runs a Two-Phase Commit by recording state in `__transaction_state` and writing atomic control markers (COMMIT/ABORT) to the data partitions.",
          "It temporarily blocks read access on the participating partitions to prevent other consumers from reading incomplete records during processing.",
          "It holds transactional messages in an off-heap buffer on the broker until the final commit is received, avoiding prior writes to the disk segments.",
          "It monitors the producer's sequence numbers and automatically discards duplicates in the `@metadata` log without intervening in user partitions."
        ],
        "a": 0,
        "e": "The Transaction Coordinator (a broker assigned based on the hash of the **transactional.id**) leads a partition of the internal **__transaction_state** topic. It manages the transaction lifecycle through a distributed Two-Phase Commit protocol: it registers the partitions involved, records the initial state (Ongoing), and upon receiving the commit, writes atomic control markers (**Control Markers: COMMIT/ABORT**) to the destination partitions before marking the transaction as Complete."
      },
      {
        "id": "q-17",
        "d": 2,
        "t": "Isolation Level in Consumers (read_committed)",
        "q": "A transaction in a producer includes 100 messages in the **transactions** topic. Midway through the process, a call to an external service fails and the application runs **abortTransaction()**, causing the Transaction Coordinator to write an **ABORT** control marker to the partition. A consumer reading from this topic has **isolation.level=read_uncommitted** configured. What will this consumer observe?",
        "o": [
          "It will read all 100 messages of the aborted transaction as usual, since `read_uncommitted` delivers all records up to the High Watermark without filtering transactions.",
          "It will transparently skip the 100 aborted messages, since the broker physically removes them from the log segment as soon as it processes the ABORT marker it receives.",
          "It will receive a `TransactionAbortedException` in the `poll()` call and will have to manually reset its offset to the start of the transaction.",
          "It will receive the 100 records with their original key but with the payload replaced by a null value (`tombstone`), requiring validation in the application."
        ],
        "a": 0,
        "e": "By default, consumers operate with **isolation.level=read_uncommitted**, which means they read all messages that have reached the High Watermark, regardless of whether they belong to open, committed, or aborted transactions. To ignore aborted messages and process only data from successfully completed transactions, consumers must be configured strictly with **isolation.level=read_committed**."
      },
      {
        "id": "q-18",
        "d": 2,
        "t": "Batching Mechanics: linger.ms and batch.size",
        "q": "A producer microservice publishes events with a configuration of **batch.size=32768** (32 KB) and **linger.ms=10**. The application sends a first 500-byte message to partition 2 and then goes idle without producing any other events. At what point will that message be physically transmitted over the network to the broker?",
        "o": [
          "It will be transmitted when the 10 ms `linger.ms` timer expires, since the message does not fill the 32 KB buffer and the producer waits for more events.",
          "Immediately at 0 ms, because the first record sent to an empty partition ignores `linger.ms` to minimize the client's startup latency.",
          "It will be held indefinitely in the client's accumulator until the application publishes enough events to reach the `batch.size` threshold.",
          "It will be transmitted when the `delivery.timeout.ms` time elapses (120 seconds by default), at which point the batch is discarded due to the delivery timeout."
        ],
        "a": 0,
        "e": "The Kafka producer sends a batch of records per partition when either of two conditions is met (whichever comes first): the accumulated size reaches **batch.size**, or the time specified in **linger.ms** elapses. Since the 500-byte message does not reach 32 KB, the producer holds the message waiting to accumulate more data until the **linger.ms** timer (10 ms) expires, triggering the immediate sending of the batch."
      },
      {
        "id": "q-19",
        "d": 2,
        "t": "Message Compression in the Producer",
        "q": "A cloud log ingestion architecture generates JSON messages with an average size of 80 KB. **compression.type=lz4** is configured on the producer. When monitoring the infrastructure, which component performs the compression and decompression of the data, and what impact does it have on the brokers?",
        "o": [
          "Compression occurs on the producer and decompression on the consumer; the brokers store and forward batches without decompressing them, minimizing CPU and network consumption in the cluster.",
          "The producer sends data in plain text and the leader broker performs the LZ4 compression when writing to disk, while the followers replicate without recompressing.",
          "The producer compresses the message, but the leader broker must decompress each batch to validate the keys and recalculate the relative offset in the `.index` file.",
          "Compression runs on the broker's network controller through TCP Offload acceleration, transmitting the compressed blocks without JVM involvement."
        ],
        "a": 0,
        "e": "In Kafka, compression is end-to-end: the producer client compresses the entire record batch in memory before transmitting it over the network socket, and the consumer client decompresses it when reading. The broker simply stores the compressed bytes directly in the disk log and transmits them to consumers using **sendfile()** without decompressing them, preserving broker CPU (unless incompatible schemes or transformations are configured between topics)."
      },
      {
        "id": "q-20",
        "d": 2,
        "t": "Sticky Partitioner (KIP-480)",
        "q": "An application publishes sensor events that have no defined business key, so all messages are sent with **key=null** to a topic with 16 partitions. In earlier versions of Kafka, the default partitioner distributed messages one by one in round-robin, record by record, producing inefficient micro-batches. How does the **Sticky Partitioner** solve this problem?",
        "o": [
          "It groups successive keyless messages into the same partition until `batch.size` is filled or `linger.ms` is met, then rotates to another partition to maximize batching.",
          "It assigns all messages with a null key to the topic's first partition in a fixed manner to avoid fragmentation in the PageCache storage of the different brokers.",
          "It generates a synthetic UUID v4 in memory for each keyless record and applies the Murmur2 hash, guaranteeing a uniform, instantaneous statistical spread.",
          "It distributes messages in round-robin at the TCP connection level, sending a single record per network packet to the broker with the lowest latency observed in previous requests."
        ],
        "a": 0,
        "e": "The Sticky Partitioner (introduced in KIP-480) radically improves performance for keyless messages (**key=null**). Instead of scattering each individual message to a different partition in pure round-robin (which created tiny 1-message batches with high network overhead), the Sticky Partitioner sticks to a specific partition until the batch fills up or **linger.ms** expires, achieving denser batches and substantially reducing end-to-end latency."
      },
      {
        "id": "q-21",
        "d": 2,
        "t": "Confluent Schema Registry Wire Format",
        "q": "A legacy service tries to consume messages from a topic governed by Confluent Schema Registry using a generic plain-text deserializer (**StringDeserializer**). The application fails immediately with strange characters at the start of each message. When examining the raw binary payload with a hex viewer, the engineers see the first bytes: **[0x00, 0x00, 0x00, 0x00, 0x2A]**. What exactly do these 5 bytes represent according to the Confluent Wire Format?",
        "o": [
          "The first byte is Confluent's Magic Byte (0x00) and the following 4 bytes correspond to the Schema ID (the integer 42 in Big-Endian format) registered in Schema Registry.",
          "The 5 bytes represent an extended CRC32 checksum used by the client to verify the integrity of the message header against possible network failures on the socket.",
          "They correspond to the numeric identifier of the leader broker followed by the relative physical partition index assigned during sending by the client's partitioner in the network protocol.",
          "They indicate a UNIX timestamp truncated to 40 bits that defines the exact instant of record creation before the compression configured on the client is applied."
        ],
        "a": 0,
        "e": "The Confluent Schema Registry serialization standard (for Avro, Protobuf, and JSON Schema) prepends exactly 5 bytes of metadata to the serialized payload: Byte 0 is the **Magic Byte (0x00)** that identifies the Schema Registry protocol, and Bytes 1 through 4 correspond to the **Schema ID** expressed as a 4-byte integer in Big-Endian order. Any standard deserializer that ignores this header will fail by interpreting the first 5 bytes as part of the data."
      },
      {
        "id": "q-22",
        "d": 2,
        "t": "BACKWARD Compatibility in Schema Registry",
        "q": "In an event-driven architecture, a topic uses an Avro schema with the default compatibility policy: **BACKWARD**. The orders service team wants to update the schema by adding a new optional field with a default value (**default**). Following the strict rules of BACKWARD compatibility, what must the deployment order in production be to avoid failures?",
        "o": [
          "All consumers must first be updated and deployed with the new schema, and then the producers must be updated and deployed.",
          "The producers must be deployed first so that they emit the new field, and then the consumers updated once the schema is active.",
          "Producers and consumers must be deployed simultaneously in a maintenance window, first purging the pending data from the topic.",
          "The mode must first be changed to `FORWARD` in Schema Registry, since `BACKWARD` prohibits adding new fields even if they define default values."
        ],
        "a": 0,
        "e": "**BACKWARD** compatibility guarantees that consumers using the new schema can correctly process data generated with earlier schemas. Therefore, the mandatory deployment order requires **updating the consumers first** (they will still be able to read the old messages that producers continue to emit, applying the default value to the new field) and, once all consumers support the new schema, **updating the producers**."
      },
      {
        "id": "q-23",
        "d": 2,
        "t": "FULL Compatibility in Schema Registry",
        "q": "A global organization has dozens of autonomous teams that deploy microservices continuously and independently (CI/CD). Architecture management demands a policy in Confluent Schema Registry that guarantees any team can deploy producers or consumers in **any order**, ensuring that new consumers read messages from old producers and old consumers read messages from new producers. Which compatibility mode must be configured?",
        "o": [
          "Configure the `FULL` (or `FULL_TRANSITIVE`) compatibility mode, which simultaneously guarantees backward (`BACKWARD`) and forward (`FORWARD`) compatibility across versions.",
          "Configure the `FORWARD_TRANSITIVE` mode, since it allows old consumers to process without interruption the events generated by new future schemas.",
          "Configure the `BACKWARD_TRANSITIVE` mode and enable the `allow.schema.evolution=true` property in the Confluent Schema Registry configuration file.",
          "Configure the `NONE` validation mode at the subject level, delegating compatibility to the ability of Avro deserializers to ignore unknown fields."
        ],
        "a": 0,
        "e": "The **FULL** compatibility mode (and its **FULL_TRANSITIVE** variant) combines the guarantees of BACKWARD and FORWARD. This means that a consumer with a new schema can read data produced with old schemas, and a consumer with an old schema can read data produced with the new schema. This total symmetry completely decouples the deployment cycle, allowing producers or consumers to be updated in any order without risk of incompatibility."
      },
      {
        "id": "q-24",
        "d": 2,
        "t": "Routing Breakage When Changing Partitions",
        "q": "A payments topic is partitioned by the **user_id** key using Kafka's default partitioner (**murmur2**). The topic originally had **12 partitions**. Due to an increase in traffic, an operator runs the **kafka-topics.sh --alter** command to increase the partitions to **24**. What immediate consequence does the application suffer with respect to per-user processing order?",
        "o": [
          "Future messages for the same `user_id` may be assigned to a different partition (because the `hash(key) % N` formula changes), breaking strict per-user ordering.",
          "Kafka will automatically redistribute the historical messages from the 12 original partitions across the 24 partitions to rebalance local storage.",
          "Producers will fail with a fatal `TopicAuthorizationException` upon detecting that the local partition metadata does not match that of the cluster.",
          "Per-user order is preserved because Kafka maintains a historical key map in the `meta.properties` file to route the same users to their previous partitions."
        ],
        "a": 0,
        "e": "The default partitioner assigns partitions by computing **murmur2(key) % total_partitions**. If the total number of partitions changes (from 12 to 24), the result of the mathematical modulo changes for the vast majority of keys. From that moment on, new events for user 'user-123' will be written to a different partition from where their historical events are, breaking the sequential per-key ordering guarantee. Therefore, the number of partitions of a keyed topic should never be altered without planning a migration."
      },
      {
        "id": "q-25",
        "d": 3,
        "t": "Consumer Group and Partitioning Topology",
        "q": "A billing events topic has **12 partitions**. There are two independent downstream systems consuming from this topic: the billing service (**group.id=billing-app**) with **4 active instances**, and the real-time fraud service (**group.id=fraud-app**) with **12 active instances**. How does Kafka assign partitions to the members of each group?",
        "o": [
          "In `billing-app` each instance receives 3 partitions and in `fraud-app` each instance receives 1 partition; both groups independently process all events.",
          "The 12 partitions are split among the 16 total instances of both groups through global round-robin, with each message processed by only one instance in the cluster.",
          "In `billing-app`, 8 partitions are left orphaned and unprocessed because Kafka requires the number of consumers in the group to equal the number of partitions in the topic.",
          "In `fraud-app` only 4 instances receive partitions to stay in sync with the billing group and avoid consumption asymmetries on the leader brokers."
        ],
        "a": 0,
        "e": "The Apache Kafka Consumer Group model completely decouples groups from one another: each group with a different **group.id** acts as an independent pub/sub subscriber and receives all of the topic's data. Within each group, the coordinator distributes the partitions evenly: in **billing-app** 12 partitions / 4 consumers = 3 partitions per consumer; in **fraud-app** 12 partitions / 12 consumers = 1 partition per consumer."
      },
      {
        "id": "q-26",
        "d": 3,
        "t": "auto.offset.reset Behavior",
        "q": "A data science team deploys a new analytics application with a group identifier never used before (**group.id=analytics-v1**) to consume from a topic with 10 million events accumulated over the last year. The client is initialized with the configuration **auto.offset.reset=earliest**. From which position will the application start reading on its first startup?",
        "o": [
          "From the oldest offset available in each partition (the start of the log retained according to the retention rules), processing the entire accumulated history.",
          "From the current High Watermark of each partition, consuming only the new messages produced after the start of the client's session in the cluster.",
          "It will fail immediately with a `NoOffsetForPartitionException` since it finds no previously committed offsets in the `__consumer_offsets` topic.",
          "From the timestamp corresponding to 24 hours ago in each partition, applying the default offset window for new analytics groups configured on the leader broker."
        ],
        "a": 0,
        "e": "The **auto.offset.reset** property defines the policy to follow when there is no previously committed offset in the **__consumer_offsets** topic for that group (or when the stored offset has been deleted because retention expired). With **auto.offset.reset=earliest**, the consumer positions itself at the lowest offset available in each partition (the start of the commit log), allowing it to process all existing historical data."
      },
      {
        "id": "q-27",
        "d": 3,
        "t": "Risks of Auto-Commit (enable.auto.commit)",
        "q": "A consumer processes orders into a relational database with **enable.auto.commit=true** and **auto.commit.interval.ms=5000** (5 seconds). During one run, the consumer fetches 100 messages in a call to **poll()**. It manages to persist 40 orders to the database after 3 seconds of processing, but at that moment a catastrophic node failure (Kernel Panic) occurs, shutting down the process without running any finally block. What will happen when the pod restarts and rejoins the group?",
        "o": [
          "It will reprocess the 40 orders already inserted in addition to the remaining 60, since the failure occurred before the 5 seconds of auto-commit elapsed and no offset was committed.",
          "It will permanently lose the 60 unprocessed orders, since the consumer immediately commits the entire batch to the broker upon returning from the `poll()` method.",
          "It will resume processing exactly from order 41, because the broker monitors the client's TCP stream and infers which records were fetched by the JVM.",
          "The group will lock up with continuous `CommitFailedException`, because Kafka detects inconsistent transactions between the external database and the broker."
        ],
        "a": 0,
        "e": "With **enable.auto.commit=true**, offsets are only committed periodically during calls to **poll()** if the 5-second interval has elapsed. Since the crash occurred at 3 seconds, no commit was sent for the 100 records read. Upon restart, the consumer retrieves the last committed offset on the broker and requests the same 100 messages again, causing duplicate reprocessing of the 40 orders already saved (non-idempotent At-Least-Once semantics)."
      },
      {
        "id": "q-28",
        "d": 3,
        "t": "commitSync vs. commitAsync and Retries",
        "q": "A Kafka developer wants to maximize throughput by replacing **commitSync()** with **commitAsync()**. To avoid data loss, the developer decides to implement a callback on **commitAsync()** that, upon receiving a transient network error, immediately retries the commit with that same failed offset. Why is this retry pattern in **commitAsync()** considered a serious anti-pattern in production?",
        "o": [
          "If the commit of offset 200 fails but a later commit of 300 succeeds, a late retry of 200 would overwrite 300 in `__consumer_offsets`, causing a rewind and massive reprocessing.",
          "Because retries executed inside the `commitAsync()` callback block the main thread of the client application, negating the benefits of asynchronous concurrency.",
          "Because the broker rejects asynchronous commit requests that come from the same client thread without first receiving a prior synchronous confirmation.",
          "Because the Kafka protocol prohibits the use of callbacks in consumer operations when the `enable.auto.commit` property is set to false."
        ],
        "a": 0,
        "e": "**commitAsync()** deliberately does not retry, by architectural design. Consider the sequence: the request to commit offset 200 fails because of a network blip, but 50 ms later a new request to commit offset 300 succeeds. If the callback retries the commit of offset 200 after offset 300 has already been persisted, the broker will overwrite the progress with 200, so that if the consumer restarts, it will reprocess everything from 200 onward."
      },
      {
        "id": "q-29",
        "d": 3,
        "t": "max.poll.interval.ms and Rebalance Storms",
        "q": "A consumer fetches batches with the default setting **max.poll.records=500**. Each message requires an HTTP call to a legacy credit-scoring service that takes an average of 200 ms per record (100 seconds in total for the whole batch). The **max.poll.interval.ms** parameter is set to its default value of 300,000 ms (5 minutes). During a marketing campaign, the legacy service degrades and starts taking 800 ms per record (400 seconds to process the batch). What critical symptom will the team observe in the consumer?",
        "o": [
          "The consumer exceeds `max.poll.interval.ms` without calling `poll()`, so the coordinator declares it dead and triggers continuous rebalancing (Rebalance Storm).",
          "The heartbeat thread will keep the session alive on the broker without any problems, patiently waiting the 400 seconds until the next `poll()` call.",
          "The broker will close the client's TCP connection after 60 seconds, throwing an unrecoverable `DisconnectException` and forcing the eviction of the pod in Kubernetes.",
          "The group coordinator will dynamically reduce the value of `max.poll.records` by half and continue assigning smaller batches to avoid latency drops."
        ],
        "a": 0,
        "e": "The **max.poll.interval.ms** parameter defines the maximum time the main processing thread can take between two successive calls to **poll()**. Even if the background thread (Heartbeat Thread) keeps sending heartbeats to the broker, if batch processing exceeds this limit, the client assumes it is blocked or deadlocked and deliberately leaves the group. The coordinator starts a rebalance, assigning the partitions to another consumer, which will also block, producing a continuous rebalance storm."
      },
      {
        "id": "q-30",
        "d": 3,
        "t": "session.timeout.ms vs. heartbeat.interval.ms",
        "q": "In the configuration of a Kafka consumer client, what is the difference in responsibilities and the recommended mathematical relationship between **session.timeout.ms** and **heartbeat.interval.ms**?",
        "o": [
          "`session.timeout.ms` sets the time without heartbeats before the client is declared dead; `heartbeat.interval.ms` is the heartbeat cadence and should be set to `≤ 1/3` of the timeout.",
          "The `session.timeout.ms` parameter controls the maximum batch processing time on the main thread and must always be three times `heartbeat.interval.ms`.",
          "The `heartbeat.interval.ms` interval sets the frequency at which the broker sends probes to the client and must match the value of `session.timeout.ms` exactly.",
          "Both parameters define the expiration interval of SASL credentials and must be configured with a strict one-to-one parity relationship on the client."
        ],
        "a": 0,
        "e": "**session.timeout.ms** is the threshold at which the Group Coordinator detects node failures or network loss. For its part, **heartbeat.interval.ms** determines how often the background heartbeat thread sends liveness signals to the coordinator. The official recommendation is to set **heartbeat.interval.ms** to at most **one third (1/3)** of **session.timeout.ms** (for example, 3 s versus 10 s or 45 s) to tolerate transient network packet loss without triggering premature rebalances."
      },
      {
        "id": "q-31",
        "d": 3,
        "t": "Incremental Cooperative Rebalancing (KIP-429)",
        "q": "A company experiences periodic performance drops in its consumers every time a new pod joins the Consumer Group because of the traditional Eager (Stop-The-World) rebalancing policy. The team decides to upgrade its assignor to **CooperativeStickyAssignor**. How does this protocol transform the rebalancing behavior?",
        "o": [
          "Instead of revoking all partitions en masse and paralyzing the group, it revokes and transfers, in a second phase, only the partitions that must change owner, without pausing the rest.",
          "It keeps active assignments indefinitely and moves conflict resolution to the KRaft quorum, eliminating rebalance pauses through provisional group replicas.",
          "It allows multiple consumers to share the same physical partition in parallel for the duration of the assignment, synchronizing offset progress through a distributed lock in the cluster.",
          "It delegates partition assignment exclusively to the leader consumer, which dynamically redistributes partitions without consulting or notifying the Group Coordinator."
        ],
        "a": 0,
        "e": "The traditional Eager protocol required all group members to give up all of their assigned partitions (a Stop-The-World pause) while the group leader calculated the new distribution. With **CooperativeStickyAssignor** (KIP-429), rebalancing is incremental: consumers keep their current partitions and continue processing data; only the specific partitions that must be reassigned to balance the load are revoked and migrated, eliminating latency spikes during deployments."
      },
      {
        "id": "q-32",
        "d": 3,
        "t": "Static Membership with group.instance.id (KIP-345)",
        "q": "A set of 20 Kafka consumers runs on Kubernetes. Every time a Rolling Update deployment is performed, the pods are destroyed and recreated one by one, causing 40 successive global rebalances that saturate the cluster. How does the **Static Membership** feature, through the **group.instance.id** property, help mitigate this problem?",
        "o": [
          "It assigns a static identifier to each pod; if the pod restarts before `session.timeout.ms` expires, the coordinator keeps its partitions without triggering a rebalance.",
          "It stores the assignment state on a shared persistent volume (PVC), allowing the new pod to mount the local partitions without registering again with the Kafka cluster.",
          "It tells the Group Coordinator to ignore the disconnection and hold the messages of those partitions in a temporary broker buffer until `max.poll.interval.ms` expires.",
          "It allows the successor pod to immediately take over the previous pod's credentials through an ephemeral SASL token, keeping the TCP connection open through the Kubernetes cluster Ingress."
        ],
        "a": 0,
        "e": "With Static Membership (KIP-345), each consumer defines a persistent **group.instance.id** (for example, the Kubernetes StatefulSet name: **consumer-pod-0**). When a pod restarts, the coordinator does not trigger an immediate rebalance upon losing the TCP socket; instead, it waits patiently for **session.timeout.ms**. If the pod reconnects with the same **group.instance.id** before that time expires, it resumes exactly its same assigned partitions without any other consumer suffering any interruption."
      },
      {
        "id": "q-33",
        "d": 3,
        "t": "Manual Per-Partition Commit with OffsetAndMetadata",
        "q": "A microservice processes complex events and wants to ensure strict At-Least-Once semantics at the record level without waiting to finish a full batch of 500 messages returned by **poll()**. If a failure occurs at record 150 of partition 2, the application wants the offsets of the records already processed in partition 1 and in the first 149 of partition 2 to be secured on the broker. Which consumer API technique should be used?",
        "o": [
          "Invoke `commitSync(Map<TopicPartition, OffsetAndMetadata>)`, specifying the partition and the next offset (`currentOffset + 1`) after completing each successfully processed unit of work.",
          "Invoke `seek(TopicPartition, offset)` after processing each message to synchronously update the committed offset in the broker's internal `__consumer_offsets` topic.",
          "Configure `enable.auto.commit=true` with `auto.commit.interval.ms=1`, delegating to the secondary thread the real-time persistence of each acknowledged message.",
          "Call the `pause()` method on the active partition and run `commitAsync()` with no arguments to force the broker to deduce the consumer's granular progress."
        ],
        "a": 0,
        "e": "For granular offset control, Kafka allows invoking **commitSync(offsetsMap)** or **commitAsync(offsetsMap)** by passing a map that links each **TopicPartition** to an **OffsetAndMetadata** object. A critical rule to remember is that the committed offset must always be the **next offset expected to be read** (that is, the offset of the last successfully processed record + 1). This way, after a failure or rebalance, the consumer will resume exactly at the unprocessed record."
      },
      {
        "id": "q-34",
        "d": 3,
        "t": "ConsumerRebalanceListener and State Management",
        "q": "An application uses an in-memory buffer to accumulate metric aggregations per partition before flushing them to a time-series database. To avoid data loss or duplicates when a Consumer Group rebalance occurs, which **ConsumerRebalanceListener** implementation should be programmed?",
        "o": [
          "In `onPartitionsRevoked()`, flush the pending buffer data to the database and synchronously commit the offsets with `commitSync()` before giving up the partitions.",
          "In `onPartitionsAssigned()`, purge the local buffer and run `seekToEnd()` on the received partitions to synchronize reading with the most recent data generated on the broker.",
          "In `onPartitionsLost()`, force an emergency flush of the buffer to the database and run `commitSync()` to guarantee persistence before restarting the client in the group.",
          "In `onPartitionsRevoked()`, transmit the in-memory buffer to the newly assigned consumer through a direct gRPC call before completing the rebalance in the cluster."
        ],
        "a": 0,
        "e": "The **ConsumerRebalanceListener** interface exposes the **onPartitionsRevoked** and **onPartitionsAssigned** methods. The **onPartitionsRevoked()** method is invoked just before the consumer loses ownership of its assigned partitions. It is the mandatory critical moment to flush any in-memory state or accumulator to persistent storage and synchronously commit (**commitSync**) the processed offsets, ensuring that the new owner of the partition starts from the exact point."
      },
      {
        "id": "q-35",
        "d": 3,
        "t": "Manual Assignment with assign() vs. subscribe()",
        "q": "A forensic audit process must periodically and exclusively read the data in partition 3 of the **security-logs** topic, without participating in the dynamic Consumer Group protocol, without registering in **__consumer_offsets**, and without ever triggering rebalances on other instances. How should the consumer be configured?",
        "o": [
          "Invoke the `assign()` method, manually specifying the `TopicPartition(\"security-logs\", 3)` object instead of using the dynamic subscription method `subscribe()`.",
          "Invoke `subscribe()` with a regular expression that matches partition 3 and omit the mandatory `group.id` property from the client initialization configuration.",
          "Configure `group.id=\"\"` (empty string) and disable `enable.auto.commit`, using the ordinary `subscribe()` method to receive only partition 3.",
          "Deny the `JoinGroup` and `SyncGroup` permissions to the audit user via ACLs, forcing the broker to deliver partition 3 in direct read mode without registering offsets in the cluster."
        ],
        "a": 0,
        "e": "The Kafka Consumer API has two mutually exclusive subscription modes: **subscribe()** (dynamic subscription with Consumer Groups, automatic partition balancing, and failure detection) and **assign()** (static, manual assignment of specific partitions). When using **assign()**, the consumer does not use the Group Coordinator, does not participate in rebalances, and processes exclusively the partitions specified manually."
      },
      {
        "id": "q-36",
        "d": 3,
        "t": "Internal __consumer_offsets Topic and Group Coordinator",
        "q": "A support engineer needs to diagnose a coordination problem in a Consumer Group with **group.id=\"payment-processor\"**. To identify exactly which of the cluster's 30 brokers is acting as the **Group Coordinator** for that group, what internal calculation does the Kafka protocol perform?",
        "o": [
          "It computes `Math.abs(group.id.hashCode()) % partitions` on the `__consumer_offsets` topic; the leader broker of that partition formally acts as its Group Coordinator in the cluster.",
          "It queries the KRaft quorum, which dynamically selects an available broker and records that group's affinity in the cluster's shared internal `@metadata` partition.",
          "It always statically assigns the broker with the lowest numeric identifier (`broker.id=0`), concentrating all coordination functions on the root node.",
          "The consumer client evaluates network latency against all brokers and selects as coordinator the node that responds with the lowest TCP handshake time."
        ],
        "a": 0,
        "e": "In Kafka, the internal **__consumer_offsets** topic has **50 partitions** by default with a compaction policy. To determine which partition hosts the commits of a given group, the hash of the **group.id** is computed modulo the total number of partitions (**abs(hashCode) % 50**). The leader broker of that **__consumer_offsets** partition automatically takes on the **Group Coordinator** role for all members of that group."
      },
      {
        "id": "q-37",
        "d": 4,
        "t": "Kafka Connect: Standalone vs. Distributed",
        "q": "A data engineering team designs a production pipeline to capture changes (CDC with Debezium) from 15 PostgreSQL databases into Apache Kafka. An engineer proposes deploying Kafka Connect in **Standalone** mode to simplify the initial setup without creating internal topics. Why is Standalone mode unacceptable for this enterprise environment?",
        "o": [
          "It runs in a single process with no fault tolerance or horizontal scalability; if it goes down, all tasks stop with no self-recovery mechanism.",
          "Standalone mode does not support Source connectors such as Debezium, being restricted exclusively to reverse ingestion through Sink connectors.",
          "It does not support integration with Confluent Schema Registry or binary formats such as Avro or Protobuf, forcing mandatory conversion of events to untyped plain text.",
          "It requires the external databases to share the same local network segment as the worker and prohibits client authentication through SASL protocols."
        ],
        "a": 0,
        "e": "Kafka Connect Standalone mode is intended only for local testing and development. It runs in a single process, stores offsets and configurations in local flat files on disk, and offers no high availability or scalability. In contrast, **Distributed** mode forms a cluster of multiple workers coordinated by Kafka's group protocol, distributes the tasks in a balanced way, and, if a worker fails, automatically reassigns its tasks to the surviving nodes."
      },
      {
        "id": "q-38",
        "d": 4,
        "t": "Kafka Connect Internal Topics",
        "q": "When initializing a Kafka Connect cluster in distributed mode, an administrator manually creates the internal topics. By mistake, the administrator creates the **config.storage.topic** topic with **3 partitions** instead of **1 partition**. When the Connect workers start, the cluster fails and refuses to start. Why does the Connect configuration topic strictly require **exactly 1 partition**?",
        "o": [
          "It requires a single compacted partition to guarantee a consistent view with strict, total, chronological linear ordering of the configurations across all workers in the cluster.",
          "Because Connect workers internally use a non-concurrent consumer that throws `IllegalArgumentException` if the internal topic has more than one active physical segment.",
          "Because the Connect rebalance protocol requires all tasks to read the configuration log through `seekToBeginning()` on partition 0 exclusively.",
          "Because distributing configurations across multiple partitions would automatically disable log compaction (`cleanup.policy=compact`) on the leader broker of each partition."
        ],
        "a": 0,
        "e": "The **config.storage.topic** topic stores the configurations of all connectors and tasks in the Connect cluster with a compaction policy (**cleanup.policy=compact**). It strictly requires **a single partition** so that all workers read exactly the same ordered sequence of configuration events. If it had multiple partitions, different workers could observe configuration updates in a different relative order, breaking the cluster's distributed consistency."
      },
      {
        "id": "q-39",
        "d": 4,
        "t": "Single Message Transforms (SMTs)",
        "q": "A JDBC Source connector extracts records from a customer table that contains a column with sensitive personal data named **credit_card_number**. The compliance regulation (PCI-DSS) prohibits unmasked card numbers from touching Kafka topics. Which native, declarative Kafka Connect component should be configured on the connector without having to program an intermediate microservice?",
        "o": [
          "A Single Message Transform (SMT) with `MaskField$Value` on the connector to mask or nullify the sensitive digits before the message is published to the broker.",
          "A payload converter configured with AES-256 encryption on the Connect worker to protect the record body using keys dynamically managed in an external KMS.",
          "A compatibility rule in Schema Registry that validates the schema and automatically discards any record that contains plain-text card numbers.",
          "A downstream Consumer Interceptor that identifies the numeric pattern of the credit card and masks the digits before delivering it to the application layer."
        ],
        "a": 0,
        "e": "Single Message Transforms (SMTs) are lightweight in-memory transformations that run directly on the Kafka Connect workers on each individual record. For Source connectors, the transformation is applied after reading from the source system and before writing to Kafka. Using the standard **MaskField$Value** transformation, the connector masks the confidential field in flight, guaranteeing that the sensitive data is never persisted in the Kafka commit log."
      },
      {
        "id": "q-40",
        "d": 4,
        "t": "Dead Letter Queue (DLQ) in Sink Connectors",
        "q": "A Kafka Connect Sink connector transfers events from a topic to an OpenSearch cluster. Unexpectedly, an application publishes a message with corrupt, malformed JSON (Poison Pill). The connector task fails immediately and moves to **FAILED** state, halting consumption of the partition. How should the connector be configured to automatically send invalid records to an isolation topic without stopping the data flow?",
        "o": [
          "Configure `errors.tolerance=all`, define `errors.deadletterqueue.topic.name=opensearch-dlq`, and enable context headers to record the reason for the error.",
          "Set `errors.tolerance=none` and configure `errors.retry.timeout=-1` to force the connector to retry indefinitely without throwing fatal exceptions.",
          "Configure `errors.deadletterqueue.topic.name=opensearch-dlq` while keeping the default value of `errors.tolerance=none` so that no corrupt record is lost.",
          "Change the converter to `ByteArrayConverter` on the worker and enable `auto.offset.reset=latest` to automatically skip batches of non-conforming records."
        ],
        "a": 0,
        "e": "By default, Kafka Connect stops tasks at the first error (**errors.tolerance=none**). When **errors.tolerance=all** is configured, the connector tolerates faulty records and continues processing the rest. Combined with **errors.deadletterqueue.topic.name**, any record that fails deserialization or transformation is automatically diverted to the specified DLQ topic. Enabling context headers (**context.headers.enable=true**) adds invaluable metadata about the error, the topic, and the original offset."
      },
      {
        "id": "q-41",
        "d": 4,
        "t": "Converters vs. Transforms in Kafka Connect",
        "q": "In the Kafka Connect architecture, what is the fundamental difference in purpose between a **Converter** (such as **AvroConverter** or **JsonConverter**) and a **Single Message Transform (SMT)**?",
        "o": [
          "The Converter translates between the byte format in Kafka and the in-memory Connect Data API; the SMT modifies fields, headers, or the structure of the record in transit, synchronously.",
          "The Converter can only be used in Source tasks to serialize events, while SMTs operate exclusively in Sink tasks to filter corrupt records.",
          "The Converter handles network compression and decompression of batches, while the SMT determines which physical broker replication requests are sent to.",
          "The Converter validates schema compatibility in Schema Registry, while the SMT is responsible for committing the offsets read in the internal status topic."
        ],
        "a": 0,
        "e": "Kafka stores only flat byte arrays (byte[]). The **Converter** has the exclusive mission of serializing and deserializing: it converts Kafka bytes into Kafka Connect's typed object model (**ConnectRecord**) or vice versa. On the other hand, **SMTs** operate in memory on that already-deserialized **ConnectRecord**, allowing fields to be modified, data to be filtered, keys to be changed, or destination topics to be renamed dynamically."
      },
      {
        "id": "q-42",
        "d": 4,
        "t": "Kafka Streams: KStream vs. KTable",
        "q": "An e-commerce platform builds an analytics system with the Kafka Streams library. They have two data sources: an uninterrupted queue of user clicks on the website (each click is an independent event) and a stream of user profile updates (where each message represents the updated address and country of a user identified by their ID). Which Kafka Streams abstraction should be used to model each case?",
        "o": [
          "Clicks are modeled as a `KStream` (a stream of independent facts); profile updates as a `KTable` (a view of the latest state per key).",
          "Clicks are modeled as a `KTable` with time-based retention; profile updates as a keyless `GlobalKTable` to optimize local memory consumption.",
          "Both sources must necessarily be modeled as `KStream`, delegating the manual in-memory state update to a call to `transformValues()`.",
          "Clicks are modeled as a 1-minute `SessionWindow` and profiles as a 24-hour `TimeWindows`, since Kafka Streams does not support non-windowed tables in aggregation topologies."
        ],
        "a": 0,
        "e": "The stream-table duality is the conceptual core of Kafka Streams. A **KStream** represents an immutable stream of inserts (historical facts or events such as clicks, transactions, or sensor readings), where each record is appended without overwriting the previous ones. A **KTable** represents a changelog or materialized table: each record is an UPSERT on the primary key, where a new value replaces the previous one (and a null value represents a DELETE)."
      },
      {
        "id": "q-43",
        "d": 4,
        "t": "Co-partitioning Requirement in Kafka Streams Joins",
        "q": "A Kafka Streams application performs an inner join between a KStream (**orders**) and a KTable (**customers**). Both streams use **customer_id** as the key and the same serializer. However, the **orders** topic has **12 partitions** and the **customers** topic has **4 partitions**. When the topology starts, what problem will occur, and what is the required technical solution?",
        "o": [
          "Lack of co-partitioning, which causes a `TopologyException`; the solution is to recreate or repartition both topics with the same number of partitions.",
          "Kafka Streams will multiplex the table's 4 partitions across the order stream's 12 partitions in memory without requiring physical infrastructure changes or repartitioning.",
          "The join will fail with a `SerializationException` because the metadata log epoch differs, requiring `auto.offset.reset=earliest` to be enabled in the Streams configuration.",
          "The cluster will automatically reduce the orders partitions to 4 through a streams group rebalance to match the cardinality of the customer table."
        ],
        "a": 0,
        "e": "For a stream-table join to work correctly in a local, parallel fashion in Kafka Streams, both topics must be **co-partitioned**: they must have strictly the **same number of partitions** and the **same key partitioning function**. If they have different numbers of partitions (12 versus 4), records with the same key will end up in processing tasks assigned to different physical instances, preventing the join from finding local matches."
      },
      {
        "id": "q-44",
        "d": 4,
        "t": "GlobalKTable and Joins Without Co-partitioning",
        "q": "You need to enrich a massive KStream of banking transactions (50 partitions) with a small reference table of postal codes and branches (5 partitions). You want to avoid the cost and complexity of repartitioning the massive transaction stream. Which Kafka Streams abstraction allows this join to be performed directly without requiring both topics to be co-partitioned?",
        "o": [
          "Model the reference table as a `GlobalKTable`, which replicates all of its partitions on every local instance of the application, allowing joins without co-partitioning.",
          "Model the table as a standard `KTable` by enabling the `streams.join.broadcast=true` parameter in the topology configuration to skip the co-partitioning requirement.",
          "Group the stream using `repartition(Repartitioner.with(...))`, delegating to RocksDB the dynamic distribution of the secondary keys at runtime.",
          "Use a sliding window (`SlidingWindows`) on the `KStream` to store the postal codes in a circular buffer in memory shared by the threads."
        ],
        "a": 0,
        "e": "A **GlobalKTable** reads and stores **all partitions** of the reference topic in the local State Store of **every instance** of the application. Thanks to this, any task processing a KStream record can look up information in the GlobalKTable locally and instantly, regardless of how the input stream is partitioned and without requiring co-partitioning. The trade-off is that the GlobalKTable dataset must be small enough to fit on each node's disk."
      },
      {
        "id": "q-45",
        "d": 4,
        "t": "RocksDB State Stores and Changelog Topics",
        "q": "A Kafka Streams topology computes a stateful aggregation window (Stateful Processing). The team needs to guarantee high resilience and a minimal recovery time (RTO) if one of the application instances fails in production. How does Kafka Streams persist local state, and which configuration drastically speeds up failover?",
        "o": [
          "It persists locally in `RocksDB` backed by a compacted `changelog topic` in Kafka; configuring `num.standby.replicas ≥ 1` keeps hot replicas ready for failover.",
          "It stores state in the Java heap memory with periodic checkpoints to an S3 bucket; configuring `state.cleanup.delay.ms=0` forces instant reconstruction of the State Store.",
          "It writes each state update directly to an external database such as Cassandra, configuring `processing.guarantee=exactly_once_v2` for synchronization.",
          "It uses volatile in-memory tables with `state.store.type=in_memory`, configuring `replication.factor=3` on the broker to transfer the state via Zero-Copy upon failure."
        ],
        "a": 0,
        "e": "Kafka Streams uses **RocksDB** by default as persistent, off-heap local storage for its State Stores. To tolerate failures, each state mutation is sent in parallel to an **internal Changelog Topic** in Kafka with a compaction policy. If an instance fails, another instance can rebuild the state by reading this changelog. To achieve near-instant failover (an RTO of seconds), **num.standby.replicas** is configured, which makes standby replicas keep their local RocksDB hot-synchronized."
      },
      {
        "id": "q-46",
        "d": 4,
        "t": "Time Windows: Tumbling vs. Hopping vs. Sliding",
        "q": "An industrial monitoring system must calculate a factory's average energy consumption **every 15 minutes in independent, non-overlapping blocks** (e.g., from 08:00 to 08:15, from 08:15 to 08:30). No event may belong to more than one time window. Which type of Kafka Streams window should be selected?",
        "o": [
          "A fixed, contiguous, non-overlapping time window (`Tumbling Window`) of 15 minutes defined using `TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(15))`. ",
          "A periodically overlapping time window (`Hopping Window`) with a duration of 15 minutes and an advance or hop interval configured at a continuous 1 minute.",
          "A window based on variable periods of inactivity (`Session Window`) with a cutoff or inactivity gap of exactly 15 minutes.",
          "A continuous sliding window (`Sliding Window`) calculated based on the maximum time distance of 15 minutes between consecutive records in the log."
        ],
        "a": 0,
        "e": "**Tumbling Windows** are fixed-size, contiguous time windows that **never overlap**. Each individual record belongs to exactly one window based on its timestamp. In contrast, Hopping Windows overlap periodically according to their advance interval, and Session Windows depend on variable periods of user inactivity."
      },
      {
        "id": "q-47",
        "d": 4,
        "t": "ksqlDB: Push Queries vs. Pull Queries",
        "q": "A development team implements a fraud monitoring solution with **ksqlDB**. On a real-time web dashboard they need to show instant alerts as new suspicious transactions occur, while in a call center service they need to look up a user's current balance on demand when the customer calls. Which type of ksqlDB query corresponds to each need?",
        "o": [
          "The dashboard requires a `Push Query` (with `EMIT CHANGES` to emit continuous events); the call center service requires a `Pull Query` (a one-time synchronous query to the table).",
          "The dashboard requires a `Pull Query` with HTTP polling every second on the table; the call center service requires a `Push Query` with a persistent websocket subscription.",
          "Both needs must be solved exclusively with synchronous `Pull Queries` against the materialized KTable to avoid memory saturation on the ksqlDB server.",
          "Both needs must be solved with continuous streaming `Push Queries`, delegating to the call center frontend the filtering of the customer's balance in local memory."
        ],
        "a": 0,
        "e": "ksqlDB defines two query paradigms: **Push Queries** (defined with the **EMIT CHANGES** clause) are reactive streaming subscriptions that stay permanently open, sending each new event as it arrives; they are ideal for real-time dashboards and alerts. **Pull Queries** work like traditional SQL queries: they are one-time, synchronous, and read the current state materialized in a ksqlDB table for a given key."
      },
      {
        "id": "q-48",
        "d": 4,
        "t": "ksqlDB: Key Definitions and Aggregations",
        "q": "When creating a STREAM in ksqlDB from an existing Kafka topic using the statement **CREATE STREAM orders_stream (...) WITH (KAFKA_TOPIC='orders', VALUE_FORMAT='AVRO');**, why is it essential to explicitly define the **KEY = 'order_id'** property if you plan to later run a **GROUP BY order_id** clause or perform joins with other tables?",
        "o": [
          "To indicate that the topic is already partitioned by that field in Kafka, avoiding an intermediate repartitioning step over the network when performing joins or groupings in the topology.",
          "Because ksqlDB rejects `CREATE STREAM` statements if an explicit primary key matching the schema name in the corporate Confluent Schema Registry is not defined.",
          "Because if the key is not defined, ksqlDB truncates the records on the broker and overwrites the payload of the original topic during the first execution of the query.",
          "Because binary serialization formats such as Avro require the key and value to share the same Subject in Schema Registry to authorize groupings."
        ],
        "a": 0,
        "e": "In ksqlDB and Kafka Streams, aggregation operations (**GROUP BY**) and joins require messages to be partitioned by the corresponding key. By specifying **KEY = 'field'**, ksqlDB recognizes that the topic is already partitioned by that key in Kafka. If it is not defined, or if grouping is done by a field other than the current key, ksqlDB will be forced to internally generate an intermediate repartition topic (**repartition topic**), doubling network traffic and storage usage."
      },
      {
        "id": "q-49",
        "d": 5,
        "t": "Authentication: mTLS vs. SASL/SCRAM",
        "q": "A digital bank must authenticate thousands of client microservices and administrator users against its Kafka cluster. For applications that reside in public clouds, they prefer credential management with dynamic password rotation stored natively in Kafka, without depending on certificates issued for each client. Which Kafka authentication mechanism meets this requirement?",
        "o": [
          "`SASL/SCRAM` (SCRAM-SHA-256 or SCRAM-SHA-512), which stores salted hashes in Kafka metadata and allows credentials to be created and rotated on the fly with `kafka-configs.sh`.",
          "`mTLS` (Mutual TLS), since it manages public key pairs directly in the KRaft quorum metadata without requiring periodic renewal of client certificates.",
          "`SASL/PLAIN` over an unencrypted channel, since it stores passwords in broker memory and delegates rotation to the `kafka-acls.sh` administrative command.",
          "`Kerberos (SASL/GSSAPI)`, because it stores user tickets in a decentralized way in each broker's local storage, avoiding external servers such as Active Directory or a KDC."
        ],
        "a": 0,
        "e": "**SASL/SCRAM** (Salted Challenge Response Authentication Mechanism) is the native standard for secure credential-based authentication in Kafka. It allows defining users and salted/hashed passwords (SHA-256 / SHA-512) that are stored directly in Kafka metadata. It allows users to be created, modified, and revoked at runtime without restarting brokers (**kafka-configs.sh**), avoiding the complexity of managing PKI and individual X.509 certificates for each client."
      },
      {
        "id": "q-50",
        "d": 5,
        "t": "Keystore and Truststore Configuration in mTLS",
        "q": "When configuring mutual TLS authentication (**mTLS**) on a Java Kafka client, the developer specifies two certificate stores: **ssl.keystore.location** and **ssl.truststore.location**. What is the exact technical function of each of these stores?",
        "o": [
          "The `Keystore` contains the client's private key and certificate to authenticate to the broker; the `Truststore` contains the CA certificates to validate the broker.",
          "The `Keystore` contains the public certificates of the cluster brokers; the `Truststore` stores the SASL credentials and the system's access control lists (ACLs).",
          "The `Truststore` encrypts the records in the broker's disk storage; the `Keystore` is responsible for decrypting network traffic on the clients' sockets.",
          "Both files contain exactly the same X.509 certificate structure and can point to the same file without compromising the security of the private keys."
        ],
        "a": 0,
        "e": "In the public key infrastructure (PKI) used by Java and Kafka for mTLS: the **Keystore** holds the client's own identity (its secret private key and the corresponding public certificate signed by a CA). The **Truststore** stores exclusively the public certificates of the CAs the client trusts. When the broker presents its TLS certificate during the handshake, the client uses the Truststore to validate the signature of the broker's CA."
      },
      {
        "id": "q-51",
        "d": 5,
        "t": "Authorization with ACLs and the Principle of Least Privilege",
        "q": "A new producer microservice (**Principal: User:order-service**) must publish messages transactionally (using EOS transactions and **transactional.id=\"tx-order-01\"**) to the **orders** topic. What are the minimum required permissions an administrator must grant through **kafka-acls.sh**, following the principle of least privilege?",
        "o": [
          "`Write` and `Describe` operation permissions on the `Topic:orders` resource, along with `Write` and `Describe` permissions on the `TransactionalId:tx-order-01` resource in the cluster.",
          "`All` operation permissions on the `Cluster` resource, accompanied by `Read` and `Write` operation permissions on the `Topic:orders` resource on the cluster's data partitions.",
          "`Write` operation permissions exclusively on the `Cluster` resource, since privileges on topics and transactions are automatically inherited on the broker for producers.",
          "`Read` and `Write` operation permissions on the internal `__transaction_state` topic, complemented by `Describe` operation permissions on the `Topic:orders` resource."
        ],
        "a": 0,
        "e": "For a transactional producer to operate under the principle of least privilege, it requires **Write** and **Describe** permissions on the data topic (**Topic:orders**) to send messages and query its partition metadata. Additionally, when using transactions, the Transaction Coordinator validates that the Principal has **Write** and **Describe** permissions on the configured **TransactionalId** resource (**tx-order-01**). Clients should never be granted direct permissions on internal topics such as **__transaction_state**."
      },
      {
        "id": "q-52",
        "d": 5,
        "t": "Deny Precedence and allow.everyone.if.no.acl.found",
        "q": "In a cluster with ACLs enabled and **allow.everyone.if.no.acl.found=false**, the administrator configures the following two rules for the user **User:analyst** on the **reports** topic:\n1. ALLOW Operation Read from Host 192.168.1.50\n2. DENY Operation Read from Host *\nThe user attempts to read from the topic from the machine with IP 192.168.1.50. What result will they get and why?",
        "o": [
          "Access will be denied with `TopicAuthorizationException`, since in Kafka's security policies `DENY` rules take strict precedence over any `ALLOW`.",
          "Access will be granted successfully because the `ALLOW` rule defines a more specific host IP address than the generic wildcard (`*`) in the evaluated `DENY` rule.",
          "Access will be allowed because authorization rules are evaluated in chronological order of insertion and rule 1 was registered earlier in the metadata.",
          "The TCP connection will remain suspended on the broker until an administrator resolves the ambiguity in the rules using the `kafka-acls.sh` command-line tool run against the quorum."
        ],
        "a": 0,
        "e": "The ACL evaluation algorithm in Apache Kafka follows a strict hierarchy: if **any explicit DENY rule** matches the user, host, and operation, **access is blocked immediately** (Deny Precedence), regardless of whether specific ALLOW rules exist. If there is no matching DENY, the ALLOW rules are evaluated. If no ALLOW rule matches and **allow.everyone.if.no.acl.found=false**, access is denied by default."
      },
      {
        "id": "q-53",
        "d": 5,
        "t": "Log Compaction Mechanics: Head vs. Tail",
        "q": "A global configuration topic has the cleanup policy **cleanup.policy=compact** configured. How does the log compaction process (**Log Cleaner**) work internally on the broker, and how is the active log segment treated?",
        "o": [
          "It evaluates closed segments, purging old records with repeated keys using an in-memory offset map; the active segment is left intact and uncompacted to avoid degrading I/O.",
          "It compacts both closed segments and the active write segment in real time as each individual message is persisted in the kernel's PageCache buffer.",
          "It periodically halts producer writes to merge all partition segments into a single compressed file on the fly using zstandard.",
          "It requires disabling traffic and running an offline administrative task with `kafka-log-dirs.sh` to rebuild the key indexes in the local directory."
        ],
        "a": 0,
        "e": "During log compaction, the partition is logically divided into the **Tail** (closed segments where previous key versions have already been purged) and the **Head** (closed segments with new records not yet processed by the cleaner). The Log Cleaner threads build an in-memory hash table (SkimpyOffsetMap) with the latest keys of the Head and rewrite the Tail segments, removing obsolete records. It is a universal rule that **the active segment is never compacted**, so as not to interfere with ongoing writes."
      },
      {
        "id": "q-54",
        "d": 5,
        "t": "Tombstones and delete.retention.ms",
        "q": "In a user table backed by a compacted topic (**cleanup.policy=compact**), a service deletes a user by publishing a record with key **user-884** and **payload=null** (a deletion record called a **Tombstone**). Why doesn't Kafka physically delete this record immediately during the next compaction round, and instead wait for the time configured in **delete.retention.ms** (24 hours by default)?",
        "o": [
          "To ensure that slower or temporarily offline consumers read the Tombstone and propagate the deletion in their local systems before it is purged.",
          "Because Linux file systems block the physical truncation of disk blocks containing null values until a synchronous `fsck` check is run on the server.",
          "Because the KRaft quorum requires 24 hours to propagate the key nullification among the metadata controllers before confirming the physical deletion of the block.",
          "Because the leader broker attempts to recover the original payload by communicating with the registered producers in case the key deletion was an accidental action during maintenance."
        ],
        "a": 0,
        "e": "A Tombstone is an explicit marker that tells consumers that the key has been deleted. If Kafka removed the Tombstone immediately during a compaction round before a lagging or downed consumer reaches that offset, that consumer would never learn about the deletion and would keep the old record in its database forever. The **delete.retention.ms** parameter guarantees a sufficient time window for all downstream consumers to process the deletion."
      },
      {
        "id": "q-55",
        "d": 5,
        "t": "JMX Metric: UnderReplicatedPartitions",
        "q": "During a production on-call shift, a Prometheus alert notifies that the JMX metric **kafka.server:type=ReplicaManager,name=UnderReplicatedPartitions** has increased from 0 to **18** in the cluster. What is the technical meaning of this alert, and what are its most common operational causes?",
        "o": [
          "It indicates 18 partitions with replicas outside the ISR because they are lagging behind the leader; it typically occurs due to broker failures, bandwidth saturation, or disk I/O saturation.",
          "It indicates that 18 partitions were deleted from the broker's local file system and require manual restoration from backups in object storage.",
          "It indicates that 18 consumers in the group exceeded the value of `max.poll.interval.ms`, causing the broker to mark their assigned partitions as under-replicated.",
          "It indicates that 18 producers are publishing batches with `acks=0` at a rate higher than the network socket bandwidth, dropping messages in the RecordAccumulator."
        ],
        "a": 0,
        "e": "**UnderReplicatedPartitions** is the most critical health metric of a Kafka cluster. A value greater than 0 indicates that for one or more partitions, the number of replicas in the current ISR is lower than the configured **replication.factor**. This commonly occurs when a broker shuts down, loses network connectivity, suffers massive Garbage Collection pauses, or experiences disk I/O bottlenecks that prevent it from keeping pace with the leader."
      },
      {
        "id": "q-56",
        "d": 5,
        "t": "JMX Metric: ActiveControllerCount",
        "q": "On an observability dashboard for an Apache Kafka cluster, an SRE engineer reviews the **kafka.controller:type=KafkaController,name=ActiveControllerCount** metric. What is the only healthy value this metric should show globally across the cluster, and what do anomalous values of 0 or greater than 1 indicate?",
        "o": [
          "It must be exactly 1 globally; a value of 0 indicates the absence of an active controller, blocking metadata, while a value > 1 signals a Split-Brain condition.",
          "It must equal the total number of brokers in the cluster to ensure that all nodes actively participate as controllers in a multi-master metadata scheme of the quorum.",
          "It must remain at 0 continuously during normal operation, rising to 1 only transiently when a planned partition re-election is executed.",
          "It must strictly match the number of replicas of the internal `@metadata` topic (typically 3 or 5) to reflect all voting members of the KRaft controller quorum."
        ],
        "a": 0,
        "e": "In every Apache Kafka cluster, there must be **exactly one active controller** at all times (**ActiveControllerCount = 1** aggregated across the whole cluster; each broker reports 0, except the leader, which reports 1). If the sum is 0, it means no controller has been elected (metadata is frozen). If it is greater than 1 in legacy ZooKeeper environments, it denotes a Split-Brain state where two brokers believe they are the controller simultaneously, threatening the integrity of the cluster."
      },
      {
        "id": "q-57",
        "d": 5,
        "t": "JMX Metric: RequestHandlerAvgIdlePercent",
        "q": "A broker's Grafana dashboard shows that the **kafka.server:type=KafkaRequestHandlerPool,name=RequestHandlerAvgIdlePercent** metric has dropped steadily to **0.06** (6% idle time). At the same time, producers report massive increases in acknowledgment latency. What technical diagnosis does this metric represent?",
        "o": [
          "The request-processing threads (`num.io.threads`) are saturated at 94% of their I/O or compute capacity, leaving the broker on the verge of operational collapse.",
          "The broker detects a load below 6% and temporarily suspends the network threads (`num.network.threads`) to reduce CPU usage on the data center node.",
          "Consumer clients are suffering SASL authentication failures on 94% of incoming connections, saturating the cluster broker's network socket queue.",
          "The JVM Garbage Collector is holding 94% of the available heap, causing continuous Stop-The-World pauses in the application threads."
        ],
        "a": 0,
        "e": "**RequestHandlerAvgIdlePercent** measures the average percentage of time that the request-handling threads (configured with **num.io.threads**) remain idle waiting for work. A healthy value is above 30% - 40% (0.3 - 0.4). A drop to 6% (0.06) means the threads spend 94% of their time busy, which indicates critical disk or CPU saturation on the broker, causing incoming requests to queue in the network queue and driving latency up."
      },
      {
        "id": "q-58",
        "d": 5,
        "t": "Tiered Storage in Confluent Platform (KIP-405)",
        "q": "A multinational retains financial event data for 5 years for regulatory reasons. Traditionally, this required continuously adding SSD/NVMe disks to the brokers, driving up costs and making partition reassignment take weeks. How does **Tiered Storage** resolve this architectural bottleneck?",
        "o": [
          "It moves old closed segments to inexpensive object storage (S3/GCS) and keeps only hot data on local disk; reassignment transfers only the local hot data.",
          "It applies in-memory (RAM) deduplication and compresses historical segments onto cold EBS volumes, transferring the blocks in the background using `kafka-reassign-partitions.sh` over the network.",
          "It converts old segments into Iceberg tables in object storage, delegating consumers' historical reads to an external Presto query engine.",
          "It archives historical logs to a secondary cluster using MirrorMaker 2 in asynchronous mode, deleting the local partitions once they are replicated in the corporate data lake."
        ],
        "a": 0,
        "e": "Tiered Storage (KIP-405) decouples compute from storage in Kafka. Recent (\"hot\") data is retained on local NVMe/SSD storage on the broker for ultra-low-latency real-time reads. Closed segments are sent asynchronously to cloud object storage (S3, GCS), offering practically infinite retention at low cost. In addition, when a partition is migrated between brokers, only the small amount of local hot data is copied, making rebalances nearly instantaneous."
      },
      {
        "id": "q-59",
        "d": 5,
        "t": "JVM Heap Sizing and the Linux PageCache",
        "q": "A junior engineer proposes setting the JVM heap of a Kafka broker to **60 GB** on a server with 64 GB of physical RAM, arguing that \"more memory for Java always improves performance.\" Why does a senior Kafka architect emphatically reject this proposal?",
        "o": [
          "Kafka delegates storage to the Linux `PageCache` to perform Zero-Copy; a 60 GB heap starves the kernel of RAM and causes massive Garbage Collection pauses in the JVM.",
          "Because the JVM on 64-bit systems disables pointer compression (Compressed OOPs) above 32 GB, which penalizes memory and blocks the allocation of off-heap buffers.",
          "Because Kafka's architecture stores all sparse index files in the Linux Swap space, requiring at least 80% of physical RAM to be left free.",
          "Because the KRaft protocol mandates that the heap size on each broker be strictly proportional to the number of processing threads (`num.network.threads`)."
        ],
        "a": 0,
        "e": "Unlike other Java data systems, Apache Kafka was designed not to store message data on the JVM heap. A modest heap (typically 6 to 10 GB) is more than enough for the broker's internal objects, avoiding Garbage Collection Stop-The-World pauses. All the remaining RAM on the server should be left free so that the Linux kernel can automatically use it as **PageCache**, which allows consumer fetch requests to be served at RAM speed without physical disk reads."
      },
      {
        "id": "q-60",
        "d": 5,
        "t": "Security Integration with SASL/OAUTHBEARER",
        "q": "A company adopts a Zero-Trust architecture and decides to integrate the authentication of all its Kafka clients with its corporate identity provider (Okta / Azure AD / Keycloak) using JWT tokens. Which native Kafka protocol is used, and how is it ensured that clients with expired tokens are disconnected?",
        "o": [
          "`SASL/OAUTHBEARER` is used; the broker validates the IdP's JWT signature using JWKS keys and monitors the `exp` expiration attribute to force client re-authentication.",
          "Federated `SASL/SCRAM` is used; the broker queries Okta's Introspect endpoint in real time through webhooks and revokes the TCP session the instant the token expires.",
          "`SASL/GSSAPI` is used with a custom PAM module that translates JWT tokens to Kerberos tickets, delegating the closing of idle sockets to the operating system daemon.",
          "Dynamic ACLs with the Bearer prefix are configured in `kafka-acls.sh`, delegating validation of token validity to a Confluent Schema Registry interceptor connector."
        ],
        "a": 0,
        "e": "**SASL/OAUTHBEARER** is Kafka's standard for identity federation through OAuth 2.0 and OpenID Connect. The client requests a signed token (JWT) from its Authorization Server / IdP and authenticates to the broker by presenting that token. The broker validates the token against the IdP's JWKS endpoint. In addition, the broker tracks the JWT's expiration time (**exp**): when the token expires, Kafka requires automatic re-authentication or disconnects the client if it does not renew its credential."
      }
    ],
    "why": {
      "q-1": [
        null,
        "Mixing roles (`broker,controller`) across 100 nodes degrades Raft consensus due to I/O contention and GC pauses caused by the brokers' massive data traffic.",
        "A single controller introduces a single point of failure (SPOF); if it goes down, the cluster is unable to coordinate partitions or handle metadata changes.",
        "Raft quorums require an odd number of nodes (3 or 5); an even number such as 4 does not increase fault tolerance compared to 3 and makes it harder to break ties."
      ],
      "q-2": [
        null,
        "`isolation.level=read_uncommitted` only allows reading records from non-aborted transactions that have already reached the High Watermark; it never allows reading above the HW up to the LEO.",
        "The producer's `acks` setting does not alter the consumer rule: no message is visible before being replicated in the ISR up to the High Watermark.",
        "Consumers read from the leader by default, and the `min.insync.replicas` parameter applies to producer writes with `acks=all`; it does not necessarily redirect reads to followers."
      ],
      "q-3": [
        null,
        "The leader only rejects writes with `NotEnoughReplicasException` if the ISR size drops below `min.insync.replicas`; otherwise it keeps accepting traffic.",
        "A partition only becomes `Offline` if its leader broker fails and there are no eligible replicas to succeed it, not because a follower is removed from the ISR.",
        "The leader does not voluntarily hand over its role to an unresponsive node; leader re-election only occurs when the leader itself fails."
      ],
      "q-4": [
        null,
        "Consumers do not block with `NotEnoughReplicasException`; this exception only affects writes with `acks=all` when the ISR is smaller than `min.insync.replicas`.",
        "Kafka never silently downgrades `acks=all` to `acks=1`, so as not to violate the durability guarantees requested by the producer.",
        "`NotEnoughReplicasException` is returned to the producer immediately when it attempts to write, and consumers can keep consuming up to the High Watermark without offset errors."
      ],
      "q-5": [
        null,
        "With `unclean.leader.election.enable=false`, the controller is strictly forbidden from electing replicas outside the ISR, to avoid silent data loss.",
        "Kafka cannot reassign nonexistent data to another broker or ask the producer to retransmit arbitrary data already acknowledged by a failed leader.",
        "A partition with no available replicas in the ISR enters a fully `Offline` state; it does not remain in read-only mode on replicas outside the ISR."
      ],
      "q-6": [
        null,
        "Kafka does not automatically divert missing records to a Dead Letter Queue topic after an unclean election; the data is simply lost.",
        "The new leader accepts reads and writes immediately; it does not enter read-only mode or wait for manual reconciliation.",
        "Consumers do not receive `OffsetOutOfRangeException` because of the election; they will continue reading from the new High Watermark without detecting the omission of the lost offsets."
      ],
      "q-7": [
        null,
        "The `.timeindex` file maps timestamps to logical offsets for time-based lookups, not for resolving direct read requests by offset.",
        "The `leader-epoch-checkpoint` file maps leader epochs to their starting offsets for reconciliation between replicas, not for indexing individual records.",
        "Kafka does not use Bloom filters for on-disk offset lookups; it relies directly on the sparse `.index` index file and binary search."
      ],
      "q-8": [
        null,
        "`retention.check.interval.ms` only defines the periodic frequency of the evaluator thread (5 minutes by default); it does not postpone deletion based on log size.",
        "Kafka's retention is independent of consumer progress; it does not wait for offsets to be committed in `__consumer_offsets` before purging inactive segments.",
        "`segment.ms` determines when an active segment is rolled based on time; it does not act as a grace period or block the purging of segments that are already closed."
      ],
      "q-9": [
        null,
        "Raft uses a simple majority (more than 50% of the quorum's votes: 3 out of 5), not a two-thirds supermajority.",
        "A 5-node quorum with 2 live nodes cannot process metadata because 2 does not constitute a strict majority of the total quorum of 5.",
        "The Raft quorum is specifically designed to tolerate minority failures; with 5 nodes it tolerates up to 2 failures without halting metadata operations."
      ],
      "q-10": [
        null,
        "`RackAwareReplicaSelector` allows consumers to read from the closest replica (Follower Fetching), but it does not control how replicas are assigned to brokers.",
        "`advertised.listeners` manages connectivity and network resolution for clients, and the `zookeeper.rack.enable` parameter does not exist in Apache Kafka.",
        "`min.insync.replicas` sets the minimum number of replicas that must acknowledge writes with `acks=all`, but it does not influence the physical placement of partitions."
      ],
      "q-11": [
        null,
        "Kafka does not allow two members of the same Consumer Group to read from the same partition in parallel; each partition is assigned to at most one consumer.",
        "Having more consumers than partitions is valid; the extra consumers simply remain idle as standby.",
        "Excess pods do not generate duplicates; the coordinator assigns them no partitions, keeping them on passive standby."
      ],
      "q-12": [
        null,
        "`mmap()` avoids some copies but still involves interaction with user space; `sendfile()` performs the entire transfer inside the kernel via DMA.",
        "`splice()` connects descriptors via pipes but is not Kafka's standard mechanism for transferring log segments to client sockets, nor does it decompress batches.",
        "`readv()` and `writev()` perform scatter/gather I/O passing through user space, requiring copies between kernel and application buffers."
      ],
      "q-13": [
        null,
        "With `acks=1`, data can be lost if the leader fails before replicating to the followers; and `acks=all` for web metrics adds unnecessary latency.",
        "Configuring `retries=0` in transfers exposes them to loss on any transient network error; and `acks=1` for metrics does not offer the lowest possible latency.",
        "The value `acks=2` does not exist in the Kafka protocol (only 0, 1, or all/-1), and `acks=-1` contradicts the low-latency requirement for metrics."
      ],
      "q-14": [
        null,
        "Kafka does not use CRC32 checksums of the payload for semantic deduplication; the CRC only validates physical integrity against data corruption in transit or on disk.",
        "Offsets are assigned exclusively by the leader broker when writing to the log, never by the producer client.",
        "Idempotence is managed on each broker for its partitions through the PID and sequence numbers; the KRaft quorum is not involved and no hash tables are used."
      ],
      "q-15": [
        null,
        "The producer does not synchronously throttle the TCP socket; it sends up to 5 concurrent requests in a pipeline, relying on the broker's sequence validation.",
        "The broker does not reorder by record timestamp; it persists strictly based on the contiguous sequence numbers assigned by the producer.",
        "The KRaft quorum only manages cluster metadata; user data is transmitted directly between clients and brokers without passing through KRaft."
      ],
      "q-16": [
        null,
        "Kafka does not acquire read locks on partitions during transactions; isolation is resolved in the consumers according to `isolation.level`.",
        "Transactional messages are written immediately to the disk segments; their validity is defined through COMMIT/ABORT control markers.",
        "Basic sequence-based deduplication is done by each broker on its local replicas; the Transaction Coordinator manages the 2PC cycle in `__transaction_state`."
      ],
      "q-17": [
        null,
        "The broker does not physically delete aborted messages upon receiving the marker; they remain in the log until the usual segment retention purges them.",
        "A consumer with `read_uncommitted` does not throw exceptions on aborted transactions; it simply delivers the records as ordinary messages.",
        "Kafka does not replace aborted messages with tombstones; the original content remains intact on disk next to the control marker."
      ],
      "q-18": [
        null,
        "The producer does not send at 0 ms if `linger.ms > 0`; it deliberately waits the configured interval to try to accumulate more records in the batch.",
        "Messages are not held indefinitely; `linger.ms` ensures a maximum wait limit to send the batch even if it does not reach `batch.size`.",
        "`delivery.timeout.ms` is the maximum total time to acknowledge the message (including retries); the initial physical send is triggered by `linger.ms` or `batch.size`."
      ],
      "q-19": [
        null,
        "Compression configured on the producer is performed by the client itself, not by the leader broker when writing to disk.",
        "The broker does not need to decompress the batch to index it; offset and size metadata are read directly from the batch header (RecordBatch).",
        "Kafka implements application-level compression in the JVM/SDK; it does not use TCP Offload acceleration on the network card to compress messages."
      ],
      "q-20": [
        null,
        "The Sticky Partitioner does not concentrate everything on partition 0; it switches partitions each time a batch is completed to spread the load evenly.",
        "The producer does not generate fake UUIDs for keyless messages; it preserves the null key and uses per-batch stickiness logic.",
        "The Sticky Partitioner seeks exactly the opposite of sending one record per packet; it maximizes batch size to reduce network overhead."
      ],
      "q-21": [
        null,
        "Those 5 bytes are not a CRC32 checksum; they correspond to the Magic Byte (0x00) and the schema ID assigned by Confluent Schema Registry.",
        "The broker ID and partition reside in the headers of Kafka's network protocol, never as a binary prefix inside the record payload.",
        "The record timestamp is stored in the native metadata of the Kafka RecordBatch, not as a 5-byte prefix inside the message body."
      ],
      "q-22": [
        null,
        "In `BACKWARD` mode, if producers are upgraded first, the old consumers will fail because they do not know how to deserialize the new field.",
        "Evolutionary schema compatibility in Kafka is designed precisely to avoid simultaneous maintenance downtime and topic purges.",
        "`BACKWARD` perfectly allows adding new fields as long as they have a `default` value; there is no need to change the policy to `FORWARD`."
      ],
      "q-23": [
        null,
        "`FORWARD` only guarantees that old consumers can read data from new producers, but it does not ensure that new consumers can read data from old producers.",
        "`BACKWARD_TRANSITIVE` requires upgrading consumers before producers, and the `allow.schema.evolution` property does not exist in Schema Registry.",
        "The `NONE` mode disables all compatibility checks in the schema registry, exposing the system to unpredictable runtime failures."
      ],
      "q-24": [
        null,
        "Kafka never redistributes historical records when partitions are added; old messages remain intact in their original partitions.",
        "Producers do not throw authorization exceptions; they simply refresh the topic metadata and apply the new number of partitions to the hash.",
        "Kafka does not maintain key mapping tables in `meta.properties`; the partition is computed mathematically on the client with the hashing formula."
      ],
      "q-25": [
        null,
        "Consumer Groups are independent (Pub/Sub model); each group receives its own full copy of the data from all 12 partitions.",
        "A group with fewer instances than partitions assigns several partitions to each instance (12 / 4 = 3); no partition is left orphaned.",
        "One group's assignment does not affect other groups; in `fraud-app`, the 12 instances receive 1 partition each without being limited to 4."
      ],
      "q-26": [
        null,
        "Reading only the messages produced after the consumer starts corresponds to the behavior of `auto.offset.reset=latest`, not `earliest`.",
        "`NoOffsetForPartitionException` is thrown only if `auto.offset.reset=none` is configured and there are no previously saved offsets.",
        "`auto.offset.reset` does not calculate 24-hour windows; the valid standard values are `earliest`, `latest`, or `none`."
      ],
      "q-27": [
        null,
        "With `enable.auto.commit=true`, the commit is triggered periodically in the `poll()` call; it does not commit messages the instant they are received.",
        "The broker does not know how many records the application has processed locally; it only updates offsets when it receives an explicit commit request.",
        "Kafka does not validate the state of external databases; `CommitFailedException` occurs due to rebalances or timeouts in the group membership protocol."
      ],
      "q-28": [
        null,
        "`commitAsync()` does not block the main thread; the problem is purely logical, caused by the inversion of the order of committed offsets in out-of-sequence retries.",
        "The broker processes OffsetCommit requests as they arrive; it does not validate synchronous dependencies between prior asynchronous commits.",
        "The Kafka API perfectly allows using callbacks with `commitAsync()`; the risk lies in incorrect logic for disordered manual retries."
      ],
      "q-29": [
        null,
        "Even if the heartbeat thread is still alive, not calling `poll()` within `max.poll.interval.ms` makes the client actively leave the group because it considers itself blocked.",
        "The broker does not cut the TCP socket because of slow processing; it is the client that decides to leave the group upon exceeding the local poll timeout.",
        "Kafka does not automatically adjust batch sizes (`max.poll.records`) on the fly; that setting is static on the client."
      ],
      "q-30": [
        null,
        "The maximum processing time of the main thread is controlled by `max.poll.interval.ms`, while `session.timeout.ms` detects connectivity or process failures.",
        "Heartbeats are sent by the client to the Group Coordinator, never the other way around, and the interval must be significantly lower (1/3) than the session timeout.",
        "These parameters govern membership and failure detection in Consumer Groups, not the expiration or renewal of SASL credentials."
      ],
      "q-31": [
        null,
        "The cooperative protocol does not delegate assignment to KRaft or create provisional replicas; it coordinates the handover of partitions in two consecutive phases.",
        "Kafka prohibits multiple members of the same group from consuming the same partition simultaneously; the cooperative protocol respects this fundamental rule.",
        "Although the leader calculates the distribution in the assignment protocol, the Group Coordinator always orchestrates and confirms the join and sync phases."
      ],
      "q-32": [
        null,
        "Static Membership is managed at the Kafka protocol level with the broker; it does not depend on storing assignments on Kubernetes PVC persistent volumes.",
        "The coordinator waits for `session.timeout.ms`, not `max.poll.interval.ms`, and does not store messages in special temporary buffers during the absence.",
        "Static Membership does not manage network tokens or reuse TCP sockets through Ingress; the client reopens a session by identifying itself with its `group.instance.id`."
      ],
      "q-33": [
        null,
        "`seek()` only repositions the consumer's local read pointer in memory for the next `poll()` call; it does not persist or commit offsets on the broker.",
        "`auto.commit.interval.ms=1` does not ensure per-record atomicity and floods the cluster with network requests without guaranteeing which exact message was processed.",
        "`commitAsync()` with no parameters commits the last offset returned by `poll()`, not the intermediate record the application is processing at that moment."
      ],
      "q-34": [
        null,
        "`onPartitionsAssigned()` is invoked after the partitions have already been assigned; flushing the buffer there loses the data of the previously revoked partitions.",
        "`onPartitionsLost()` indicates that the partitions have already been claimed by another consumer; committing there will inevitably fail with `CommitFailedException`.",
        "Kafka does not support direct gRPC pipelines between consumers to transfer memory buffers; state must be persisted and committed on the broker."
      ],
      "q-35": [
        null,
        "`subscribe()` activates the coordinated dynamic group protocol and mandatorily requires a valid `group.id`; it does not allow omitting it or isolating partitions with regex.",
        "Using `subscribe()` with an empty or null `group.id` throws a configuration exception (`InvalidGroupIdException`), preventing the consumer from starting.",
        "Denying coordination permissions via ACLs will prevent the application from starting, rather than granting it direct access or isolating a specific partition."
      ],
      "q-36": [
        null,
        "The Group Coordinator is computed deterministically from the hash of the `group.id`; it is not assigned randomly in KRaft or in `@metadata`.",
        "The coordinator is not broker 0; the `__consumer_offsets` partitions are distributed across all brokers to spread the load evenly.",
        "The client does not choose the coordinator by network latency; it requests the coordinator's identity from the cluster through a `FindCoordinatorRequest`."
      ],
      "q-37": [
        null,
        "Standalone mode supports Source and Sink connectors; its serious limitation is the lack of fault tolerance, balancing, and high availability.",
        "Standalone mode supports Schema Registry converters such as Avro; the restriction that is unacceptable in production is that it is a single point of failure (SPOF).",
        "Kafka Connect Standalone communicates over standard TCP and supports SASL mechanisms; its unsuitability lies in the lack of resilience and scalability."
      ],
      "q-38": [
        null,
        "The obstacle is not a segment error in the consumer, but the impossibility of guaranteeing total linear ordering of configurations with multiple partitions.",
        "Connect does not limit its reads to partition 0 by rebalance design; it requires 1 partition so that all workers see exactly the same updates in order.",
        "Log compaction works independently of the number of partitions; the 1-partition requirement responds to the need for consistent global ordering."
      ],
      "q-39": [
        null,
        "Encrypting with a generic converter does not selectively mask the field before writing it to the Kafka log as PCI-DSS requires; an SMT applies the transformation on the fly.",
        "Schema Registry validates the structure and type compatibility of the schema, but it does not inspect or anonymize the data contained within the fields.",
        "Filtering in the downstream consumer is unacceptable for PCI-DSS because the card number would already have been stored unmasked, in plain text, on the broker's disks."
      ],
      "q-40": [
        null,
        "`errors.tolerance=none` stops the task immediately on any error; it does not divert messages to the DLQ or allow consumption to continue.",
        "If `errors.tolerance` remains at `none`, the task fails on the first corrupt record and the DLQ is never used.",
        "Changing the converter to bytes does not resolve the erroneous indexing in OpenSearch or send the erroneous records to a dead letter queue."
      ],
      "q-41": [
        null,
        "Both Converters and SMTs can be applied in both Source and Sink connectors at different stages of the Connect pipeline.",
        "Compression and network routing are handled by the underlying producer/consumer client and the brokers, not by Connect components.",
        "Compatibility is verified by Schema Registry and offset commits are performed by the Connect framework; the SMT transforms individual records."
      ],
      "q-42": [
        null,
        "Modeling continuous clicks in a `KTable` would overwrite a user's earlier clicks, losing events; and a `GlobalKTable` requires a key.",
        "Kafka Streams provides the `KTable` abstraction precisely to represent mutable views of state per key without the need for manual aggregations.",
        "Time windows are applied on aggregation operations, not to model basic continuous-input entities such as streams or changelog tables."
      ],
      "q-43": [
        null,
        "Kafka Streams does not multiplex asymmetric partitions in local joins; it rigorously requires both topics to have the same number of partitions.",
        "The failure due to different partitioning is a topology issue (`TopologyException`), not a serialization one, and it is not resolved with `auto.offset.reset`.",
        "Kafka cannot reduce or truncate partitions of existing data topics on the fly; co-partitioning must be planned or enforced in the stream."
      ],
      "q-44": [
        null,
        "A standard `KTable` always requires co-partitioning; the fictitious `streams.join.broadcast` parameter does not exist in the Kafka Streams API.",
        "Repartitioning the massive 50-partition stream adds network and storage overhead, which is exactly what the question asks to avoid by using `GlobalKTable`.",
        "Sliding windows (`SlidingWindows`) are used for temporal aggregations between two streams, not for enriching streams against reference tables."
      ],
      "q-45": [
        null,
        "Storing large state on the heap would saturate memory with GC pauses, and Kafka Streams does not natively back State Stores with S3 buckets.",
        "Kafka Streams uses embedded RocksDB and internal changelog topics; it does not write synchronous transactions to external databases such as Cassandra.",
        "`in_memory` loses all state when the instance fails and would force it to be rebuilt from scratch from the changelog, drastically increasing the RTO."
      ],
      "q-46": [
        null,
        "`Hopping Windows` advance with periodic overlap, causing events to belong simultaneously to multiple adjacent windows.",
        "`Session Windows` do not have a fixed length of 15 minutes; they open and close dynamically according to inactivity between events from the same sender.",
        "`Sliding Windows` are evaluated continuously based on relative time differences between pairs of events, not on discrete fixed blocks."
      ],
      "q-47": [
        null,
        "The real-time dashboard benefits from reactive `Push Queries` with `EMIT CHANGES`; polling with `Pull Queries` introduces overhead and latency.",
        "`Pull Queries` do not offer continuous reactive updates for the dashboard; this model would require inefficient repetitive requests.",
        "The call center service needs to look up the current balance on demand (request/response); a continuous `Push Query` would be unnecessary and inefficient."
      ],
      "q-48": [
        null,
        "ksqlDB allows creating streams without defining `KEY`; the key is defined to optimize topologies and avoid unnecessary repartitioning over the network.",
        "ksqlDB is only a processing layer; it never truncates or destroys data in the underlying Kafka topics when the key is omitted.",
        "Avro and Schema Registry manage independent schemas for key and value (`-key` and `-value`); they do not require unique composite fields for grouping."
      ],
      "q-49": [
        null,
        "mTLS requires generating and distributing X.509 certificates and private keys to each client; it does not use passwords stored natively in Kafka.",
        "SASL/PLAIN transmits passwords in clear text, requiring TLS, and does not store dynamic salted credentials in Kafka metadata.",
        "Kerberos requires a complex centralized KDC (Key Distribution Center) infrastructure; it does not store native dynamic credentials in Kafka."
      ],
      "q-50": [
        null,
        "The Keystore contains the client's own credentials (private key and certificate); the Truststore validates CA authorities and does not contain ACLs or SASL passwords.",
        "Keystore and Truststore are components of authentication and encryption in transit with TLS; they do not manage encryption at rest on the brokers' disks.",
        "They must not be confused or merged: the Keystore holds the client's secret private key, while the Truststore contains trusted public certificates (CA)."
      ],
      "q-51": [
        null,
        "Granting `All` on `Cluster` violates the principle of least privilege by granting administrative permissions that are unnecessary for transactional producing.",
        "Permissions on topics and transactions are not magically inherited from `Cluster`; they must be explicitly assigned on the topic and the `TransactionalId`.",
        "Clients should never have direct access to the internal `__transaction_state` topic; that topic is managed exclusively by the Transaction Coordinator."
      ],
      "q-52": [
        null,
        "In Kafka there is no IP specificity: a match with a `DENY` rule overrides any `ALLOW` rule, regardless of whether the host is a wildcard.",
        "The order in which ACLs were registered has no influence; the authorizer groups and evaluates denials first, before any grant.",
        "Authorization rules do not block TCP handshakes due to ambiguity; the authorizer resolves deterministically by denying access immediately."
      ],
      "q-53": [
        null,
        "The active segment is never compacted by the Log Cleaner; it remains purely append-only so as not to degrade the latency of incoming writes.",
        "Kafka does not halt producers or consolidate entire partitions into a single compressed file; it cleans inactive segments in the background.",
        "Log compaction runs live and continuously in the background through cleaner threads; it requires no offline maintenance."
      ],
      "q-54": [
        null,
        "The ext4 or XFS file system has no restrictions on writing records with a null payload; tombstone retention is a logical Kafka rule.",
        "KRaft does not take 24 hours to synchronize metadata; tombstone retention protects the processing of downstream data consumers.",
        "Kafka does not try to recover deleted data by contacting producers; published records are immutable and flow strictly in one direction."
      ],
      "q-55": [
        null,
        "`UnderReplicatedPartitions` does not measure loss of partitions on disk; it measures partitions whose current number of in-sync replicas (ISR) is lower than their `replication.factor`.",
        "Consumer lag is monitored with the `consumer lag` metric and does not affect the broker's under-replicated partitions.",
        "The `acks=0` setting on producers does not determine whether follower replicas stay in sync within the partition's ISR."
      ],
      "q-56": [
        null,
        "In Kafka there must be exactly one active leader controller across the whole cluster; a multi-master model with multiple leaders does not exist in KRaft or ZooKeeper.",
        "The healthy value in normal operation is 1, not 0; a value of 0 means no broker holds metadata leadership, preventing administrative changes.",
        "The `ActiveControllerCount` metric measures the active leader (exactly 1), not the total number of nodes or voters that make up the controller quorum."
      ],
      "q-57": [
        null,
        "The metric measures the percentage of idle time; 6% idle means a critical saturation of 94%, not a low workload.",
        "Authentication failures are reflected in SASL/SSL connection error metrics, not in the utilization of the request-handling thread pool (`num.io.threads`).",
        "The metric directly monitors the `KafkaRequestHandlerPool` threads, not garbage collection pauses or the JVM heap memory."
      ],
      "q-58": [
        null,
        "Tiered Storage offloads segments to Cloud Object Storage (S3, GCS, Azure Blob); it does not rely on cold EBS volumes or in-memory (RAM) deduplication.",
        "Tiered Storage keeps the data transparently accessible to Kafka clients through the standard API; it requires neither Iceberg tables nor external engines.",
        "MirrorMaker 2 replicates between independent clusters, but it is not Tiered Storage (which decouples native storage within a single cluster)."
      ],
      "q-59": [
        null,
        "Even though pointer compression (Compressed OOPs) is lost when going above 32 GB, the primary reason Kafka uses small heaps (6-10 GB) is to maximize the OS PageCache and avoid GC pauses.",
        "Kafka does not use Linux Swap space; on the contrary, swap should be disabled or minimized (`vm.swappiness=1`) to avoid severe performance drops.",
        "KRaft does not set heap restrictions based on network threads; brokers are sized to leave most of the RAM to the operating system's PageCache."
      ],
      "q-60": [
        null,
        "SASL/SCRAM is not federated with JWT introspection endpoints via webhooks; Kafka's native standard for JWT tokens is SASL/OAUTHBEARER.",
        "SASL/GSSAPI is designed for corporate Kerberos authentication, not for direct federation with OpenID Connect/OAuth 2.0 tokens.",
        "ACLs manage authorization, not authentication or validation of JWT tokens, and Schema Registry does not participate in TCP transport-level security."
      ]
    },
    "glossary": [
      {
        "term": "ISR (In-Sync Replicas)",
        "cat": "Architecture & KRaft",
        "d": 1,
        "def": "Subset of a partition's replicas that are alive and caught up with the leader, according to the synchronization time threshold.",
        "tip": "Continuously monitor that UnderReplicatedPartitions is 0; if a replica does not send a FetchRequest before replica.lag.time.max.ms, it is removed from the ISR."
      },
      {
        "term": "High Watermark (HW)",
        "cat": "Architecture & KRaft",
        "d": 1,
        "def": "Offset of the last record that has been successfully replicated to all replicas in a partition's ISR.",
        "tip": "Consumers can never read beyond the High Watermark, guaranteeing they never read data that could be lost in a leader failover."
      },
      {
        "term": "Log End Offset (LEO)",
        "cat": "Architecture & KRaft",
        "d": 1,
        "def": "Offset of the next message that will be written to the local log of a specific replica of a partition.",
        "tip": "The gap between the leader's LEO and a follower's LEO determines that replica's replication lag."
      },
      {
        "term": "KRaft (Kafka Raft Metadata Mode)",
        "cat": "Architecture & KRaft",
        "d": 1,
        "def": "Internal Raft-based consensus mechanism that replaces Apache ZooKeeper for metadata management and controller election.",
        "tip": "In large-scale production, always isolate 3 or 5 dedicated nodes with process.roles=controller, without mixing in the broker role."
      },
      {
        "term": "Controller Quorum",
        "cat": "Architecture & KRaft",
        "d": 1,
        "def": "Set of dedicated nodes that run the Raft protocol and keep the @metadata metadata log replicated in memory.",
        "tip": "To tolerate F simultaneous failures, 2F + 1 controllers are required; 3 tolerate 1 failure, 5 tolerate 2 failures."
      },
      {
        "term": "broker.rack",
        "cat": "Architecture & KRaft",
        "d": 1,
        "def": "Broker setting that identifies the physical rack or the Availability Zone (AZ) in cloud environments.",
        "tip": "Essential on AWS/GCP/Azure so that Kafka distributes a partition's replicas across different zones, ensuring high availability in the event of datacenter failures."
      },
      {
        "term": "Unclean Leader Election",
        "cat": "Architecture & KRaft",
        "d": 1,
        "def": "Election as the new leader of an out-of-sync replica (outside the ISR) when all ISR replicas have collapsed.",
        "tip": "Keep unclean.leader.election.enable=false in financial systems to avoid data loss and offset mismatches."
      },
      {
        "term": "Zero-Copy (sendfile)",
        "cat": "Architecture & KRaft",
        "d": 1,
        "def": "Linux kernel technique that transfers data from the PageCache directly to the network socket via DMA without crossing into JVM memory.",
        "tip": "Kafka relies heavily on Zero-Copy; do not allocate an excessive Java Heap, so as to leave free RAM for the Linux PageCache."
      },
      {
        "term": "acks=all (-1)",
        "cat": "Producers & Schemas",
        "d": 2,
        "def": "Producer setting that requires acknowledgment from the leader and from all replicas in the ISR before considering the send successful.",
        "tip": "Always combine it with min.insync.replicas=2 and replication.factor=3 for maximum durability without data loss."
      },
      {
        "term": "min.insync.replicas",
        "cat": "Producers & Schemas",
        "d": 2,
        "def": "Minimum number of replicas in the ISR required to accept a write when the producer sends with acks=all.",
        "tip": "If the ISR size drops below this value, the leader broker rejects writes with NotEnoughReplicasException."
      },
      {
        "term": "Idempotent Producer",
        "cat": "Producers & Schemas",
        "d": 2,
        "def": "Producer mode that prevents the insertion of duplicate messages in the commit log upon network retries.",
        "tip": "Enabled with enable.idempotence=true; it assigns a Producer ID (PID) and a Sequence Number that the broker validates in memory."
      },
      {
        "term": "max.in.flight.requests.per.connection",
        "cat": "Producers & Schemas",
        "d": 2,
        "def": "Maximum number of unacknowledged requests the client can send over a single TCP connection to the broker.",
        "tip": "With enable.idempotence=true, it can be set up to 5 while maintaining strict ordering guarantees."
      },
      {
        "term": "transactional.id",
        "cat": "Producers & Schemas",
        "d": 2,
        "def": "Unique, persistent identifier assigned to a producer to enable Exactly-Once (EOS) transactions across restarts.",
        "tip": "The Transaction Coordinator maps the transactional.id to a partition of the internal __transaction_state topic."
      },
      {
        "term": "read_committed",
        "cat": "Producers & Schemas",
        "d": 2,
        "def": "Consumer isolation level that filters out messages from aborted transactions and delivers only committed messages.",
        "tip": "The consumer holds back messages up to the Last Stable Offset (LSO) to hide writes from transactions that are still open."
      },
      {
        "term": "linger.ms",
        "cat": "Producers & Schemas",
        "d": 2,
        "def": "Maximum time in milliseconds that the producer holds a batch in the RecordAccumulator before transmitting it over the network.",
        "tip": "Increasing linger.ms from 0 to 10-20 ms allows denser batches to form, multiplying throughput with barely perceptible latency."
      },
      {
        "term": "batch.size",
        "cat": "Producers & Schemas",
        "d": 2,
        "def": "Maximum size in bytes reserved for each batch of messages accumulated per partition in the producer's memory.",
        "tip": "The default value is 16 KB (16384 bytes); in high-volume systems it is recommended to raise it to 64 KB or 128 KB."
      },
      {
        "term": "Sticky Partitioner",
        "cat": "Producers & Schemas",
        "d": 2,
        "def": "Partitioning strategy that groups records with a null key in the same partition until the batch is full or linger.ms is exhausted.",
        "tip": "Introduced in KIP-480, it eliminates the overhead of record-by-record round-robin and drastically reduces latency for keyless messages."
      },
      {
        "term": "Confluent Wire Format",
        "cat": "Producers & Schemas",
        "d": 2,
        "def": "5-byte binary format prepended to the payload serialized by Confluent Schema Registry (Byte 0: Magic Byte 0x00, Bytes 1-4: Schema ID).",
        "tip": "Any generic deserializer that tries to read the payload without accounting for these 5 bytes will fail with illegal character errors."
      },
      {
        "term": "BACKWARD Compatibility",
        "cat": "Producers & Schemas",
        "d": 2,
        "def": "Schema Registry compatibility mode where consumers with the new schema can process data produced with previous schemas.",
        "tip": "Golden deployment rule: upgrade the Consumers first and the Producers afterward."
      },
      {
        "term": "FULL Compatibility",
        "cat": "Producers & Schemas",
        "d": 2,
        "def": "Symmetric compatibility mode where new and old schemas can read data produced by any version.",
        "tip": "Allows development teams to deploy producers or consumers in any order, in a fully decoupled manner."
      },
      {
        "term": "Consumer Group",
        "cat": "Consumers & Offsets",
        "d": 3,
        "def": "Coordinated set of consumer instances that share the same group.id to split the consumption of a topic's partitions.",
        "tip": "The number of partitions in the topic sets the strict limit on active concurrent consumers within the same group."
      },
      {
        "term": "Group Coordinator",
        "cat": "Consumers & Offsets",
        "d": 3,
        "def": "Kafka broker designated to manage the membership, heartbeats, rebalances, and offset commits of a Consumer Group.",
        "tip": "It is determined by the formula: leader broker of partition abs(hashCode(group.id)) % 50 of the __consumer_offsets topic."
      },
      {
        "term": "auto.offset.reset",
        "cat": "Consumers & Offsets",
        "d": 3,
        "def": "Policy the consumer adopts when there is no previously committed offset in the cluster or the stored offset has expired.",
        "tip": "Use 'earliest' to process the entire history from the start of the log, and 'latest' to read only new incoming events."
      },
      {
        "term": "commitSync vs. commitAsync",
        "cat": "Consumers & Offsets",
        "d": 3,
        "def": "Manual offset commit methods on the consumer: synchronous, blocking, with retries vs. asynchronous, non-blocking, without retries.",
        "tip": "Use commitAsync during the main loop and secure the final commit with commitSync on shutdown or in onPartitionsRevoked."
      },
      {
        "term": "max.poll.interval.ms",
        "cat": "Consumers & Offsets",
        "d": 3,
        "def": "Maximum time allowed between consecutive poll() calls before the consumer removes itself from the group.",
        "tip": "If processing a batch exceeds this time, reduce max.poll.records or increase max.poll.interval.ms to avoid Rebalance Storms."
      },
      {
        "term": "session.timeout.ms",
        "cat": "Consumers & Offsets",
        "d": 3,
        "def": "Maximum time the coordinator waits without receiving heartbeat signals before considering a consumer dead.",
        "tip": "The heartbeat.interval.ms parameter should always be set to at most one third (1/3) of session.timeout.ms."
      },
      {
        "term": "CooperativeStickyAssignor",
        "cat": "Consumers & Offsets",
        "d": 3,
        "def": "Incremental rebalancing protocol (KIP-429) that revokes and transfers only the partitions that change owner, without pausing the rest.",
        "tip": "Replaces the old Eager (Stop-The-World) rebalancing, eliminating throughput drops during deployments and autoscaling."
      },
      {
        "term": "Static Membership (group.instance.id)",
        "cat": "Consumers & Offsets",
        "d": 3,
        "def": "Mechanism that assigns a persistent ID to a consumer so it can survive brief restarts without triggering rebalances.",
        "tip": "Ideal for Rolling Update deployments on Kubernetes by binding group.instance.id to the StatefulSet hostname."
      },
      {
        "term": "Kafka Connect Distributed",
        "cat": "Connect, Streams & ksqlDB",
        "d": 4,
        "def": "Scalable, fault-tolerant cluster of Kafka Connect workers that manage Source and Sink connectors in a distributed fashion.",
        "tip": "It uses three compacted internal topics (configs, offsets, status); config.storage.topic must have strictly 1 partition."
      },
      {
        "term": "Single Message Transform (SMT)",
        "cat": "Connect, Streams & ksqlDB",
        "d": 4,
        "def": "Lightweight in-memory transformation that modifies fields, masks data, or routes topics on individual records in Connect.",
        "tip": "They are configured declaratively on the connector (e.g., InsertField, MaskField, RegexRouter) without writing additional microservices."
      },
      {
        "term": "Dead Letter Queue (DLQ)",
        "cat": "Connect, Streams & ksqlDB",
        "d": 4,
        "def": "Isolation topic where Sink connectors automatically divert invalid or corrupt records (Poison Pills).",
        "tip": "Enabled with errors.tolerance=all and errors.deadletterqueue.topic.name; it applies only to Sink connectors, not Source."
      },
      {
        "term": "KStream vs. KTable Duality",
        "cat": "Connect, Streams & ksqlDB",
        "d": 4,
        "def": "Kafka Streams paradigm: KStream represents continuous immutable facts (INSERT); KTable represents the current state per key (UPSERT).",
        "tip": "A KStream can be aggregated to form a KTable, and a KTable's changelog can be emitted as a KStream."
      },
      {
        "term": "GlobalKTable",
        "cat": "Connect, Streams & ksqlDB",
        "d": 4,
        "def": "Kafka Streams abstraction that stores all of a topic's data in the local memory/disk of every instance of the app.",
        "tip": "Allows joins with KStreams without requiring co-partitioning, ideal for small lookup tables or static catalogs."
      },
      {
        "term": "Co-partitioning",
        "cat": "Connect, Streams & ksqlDB",
        "d": 4,
        "def": "Strict requirement in Kafka Streams joins: both topics must have an identical number of partitions and the same key hash function.",
        "tip": "If they are not co-partitioned, Kafka Streams throws TopologyException or forces an expensive intermediate repartitioning across the cluster."
      },
      {
        "term": "RocksDB State Store",
        "cat": "Connect, Streams & ksqlDB",
        "d": 4,
        "def": "Embedded off-heap key-value database used by Kafka Streams to persist window and aggregation state.",
        "tip": "It is backed by a compacted changelog topic in Kafka; use num.standby.replicas for instant failovers without slow reconstruction."
      },
      {
        "term": "Tombstone (Log Compaction)",
        "cat": "Security & Operations",
        "d": 5,
        "def": "Record with an existing key and a null payload (value=null) that indicates the logical deletion of that key in a compacted topic.",
        "tip": "Kafka retains tombstones for delete.retention.ms (default 24h) so that slow consumers can process the deletion."
      },
      {
        "term": "UnderReplicatedPartitions",
        "cat": "Security & Operations",
        "d": 5,
        "def": "Fundamental JMX metric that indicates the number of partitions whose current ISR size is lower than the replication.factor.",
        "tip": "It must be strictly 0 under normal conditions; any positive value indicates failed brokers, disk saturation, or network lag."
      },
      {
        "term": "Tiered Storage (KIP-405)",
        "cat": "Security & Operations",
        "d": 5,
        "def": "Architecture that separates compute from storage by offloading closed segments to Object Storage (S3/GCS/Azure Blob).",
        "tip": "Enables unlimited retention at low cost and reduces partition rebalancing times from weeks to minutes."
      }
    ]
  };
})(window);
