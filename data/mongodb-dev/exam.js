/* =========================================================================
   data/mongodb-dev/exam.js — MongoDB · Associate Developer (English)
   Document model, CRUD, indexes, data modeling, aggregation, drivers,
   tooling and Atlas (MongoDB 7.x / 8.x).
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["mongodb-dev"] = {
    "id": "mongodb-dev",
    "appId": "mongodb-dev",
    "provider": "MongoDB",
    "badge": "MongoDB · Developer",
    "icon": "🍃",
    "color": "#00684a",
    "featured": true,
    "title": "MongoDB · Associate Developer",
    "subtitle": "BSON document model, CRUD and update operators, compound indexes and the ESR rule, schema design patterns, aggregation pipeline, drivers, transactions and Atlas tooling",
    "passingScore": 70,
    "domains": {
      "1": "MongoDB Overview and the Document Model (8%)",
      "2": "CRUD Operations (51%)",
      "3": "Indexes (17%)",
      "4": "Data Modeling (4%)",
      "5": "Aggregation (8%)",
      "6": "Drivers, Tools and Atlas (12%)"
    },
    "shortDomains": {
      "1": "Document Model",
      "2": "CRUD",
      "3": "Indexes",
      "4": "Data Modeling",
      "5": "Aggregation",
      "6": "Drivers & Tools"
    },
    "topics": [
      {
        "id": "mdb-t-1-1",
        "d": 1,
        "title": "1.1 · Documents, BSON Types and Schema Validation",
        "html": "<h4>The document model</h4>\n<p>MongoDB stores <b>documents</b> (BSON, a binary JSON superset) in <b>collections</b> inside <b>databases</b>. Documents in a collection can have different shapes, but related data should be shaped the way the application reads it.</p>\n<table class=\"keytable\">\n<tr><th>Fact</th><th>Detail</th></tr>\n<tr><td>Maximum document size</td><td><b>16 MB</b>. Larger files use <b>GridFS</b>.</td></tr>\n<tr><td><code>_id</code></td><td>Required, unique and immutable primary key. If omitted, the driver generates an <code>ObjectId</code>.</td></tr>\n<tr><td><code>ObjectId</code></td><td>12 bytes, starts with a timestamp, so it is roughly ordered by creation time.</td></tr>\n<tr><td>Money</td><td>Use <code>Decimal128</code> (or integer cents), never binary <code>double</code>.</td></tr>\n<tr><td>Dates</td><td>Use the BSON <code>Date</code> type, not strings, so ranges, sorting and TTL indexes work.</td></tr>\n</table>\n<h4>Schema validation</h4>\n<pre>db.createCollection('users', {\n  validator: { $jsonSchema: {\n    bsonType: 'object',\n    required: ['email', 'createdAt'],\n    properties: { email: { bsonType: 'string' } }\n  } },\n  validationLevel: 'strict',\n  validationAction: 'error'\n})</pre>\n<p><code>validationAction: 'warn'</code> logs violations instead of rejecting writes; <code>validationLevel: 'moderate'</code> skips existing invalid documents on update.</p>"
      },
      {
        "id": "mdb-t-2-1",
        "d": 2,
        "title": "2.1 · Inserting and Querying Documents",
        "html": "<h4>Inserts</h4>\n<p><code>insertOne()</code> and <code>insertMany()</code>. <code>insertMany</code> is <b>ordered</b> by default: it stops at the first error. Pass <code>{ ordered: false }</code> to keep inserting the remaining documents.</p>\n<h4>Query operators</h4>\n<table class=\"keytable\">\n<tr><th>Need</th><th>Syntax</th></tr>\n<tr><td>Comparison</td><td><code>$eq $ne $gt $gte $lt $lte $in $nin</code></td></tr>\n<tr><td>Logical</td><td><code>$and $or $nor $not</code> (implicit AND between fields)</td></tr>\n<tr><td>Embedded field</td><td><code>{ 'address.city': 'Lima' }</code> (dot notation)</td></tr>\n<tr><td>Array contains value</td><td><code>{ tags: 'mongodb' }</code></td></tr>\n<tr><td>Several conditions on the <b>same</b> array element</td><td><code>{ results: { $elemMatch: { $gte: 80, $lt: 85 } } }</code></td></tr>\n<tr><td>Field presence / type</td><td><code>$exists</code>, <code>$type</code></td></tr>\n</table>\n<h4>Projection, sort, limit</h4>\n<p>Projections either include or exclude fields; you cannot mix both except for <code>_id</code>. Cursors support <code>sort()</code>, <code>skip()</code> and <code>limit()</code>. For deep pagination prefer range queries on an indexed field (e.g. <code>_id &gt; lastSeenId</code>) over large <code>skip()</code> values.</p>\n<p><code>countDocuments(filter)</code> runs a query; <code>estimatedDocumentCount()</code> reads collection metadata and takes no filter.</p>"
      },
      {
        "id": "mdb-t-2-2",
        "d": 2,
        "title": "2.2 · Updates, Upserts, Deletes and Transactions",
        "html": "<h4>Update operators</h4>\n<table class=\"keytable\">\n<tr><th>Operator</th><th>Use</th></tr>\n<tr><td><code>$set</code> / <code>$unset</code></td><td>Set or remove fields</td></tr>\n<tr><td><code>$inc</code></td><td>Atomic counters, no read-modify-write race</td></tr>\n<tr><td><code>$push</code> + <code>$each</code> + <code>$slice</code></td><td>Append and keep only the last N items</td></tr>\n<tr><td><code>$addToSet</code></td><td>Append only if the value is not already present</td></tr>\n<tr><td><code>$pull</code></td><td>Remove matching array elements</td></tr>\n<tr><td><code>items.$</code></td><td>First array element matched by the filter</td></tr>\n<tr><td><code>items.$[]</code> / <code>items.$[el]</code> + <code>arrayFilters</code></td><td>All elements / all elements matching a condition</td></tr>\n</table>\n<p><code>updateOne</code>/<code>updateMany</code> require update operators (or a pipeline); <code>replaceOne</code> replaces the whole document except <code>_id</code>. With <code>{ upsert: true }</code> a document is inserted when nothing matches, seeded with the equality fields of the filter.</p>\n<p><code>findOneAndUpdate</code> returns the document before the update by default; use <code>returnDocument: 'after'</code> (Node.js) or <code>returnNewDocument: true</code> (mongosh) to get the updated one.</p>\n<h4>Deletes</h4>\n<p><code>deleteMany({})</code> removes every document but keeps the collection and its indexes; <code>drop()</code> removes the collection and its indexes.</p>\n<h4>Transactions</h4>\n<p>Single-document writes are always atomic. Multi-document ACID transactions need a replica set or sharded cluster and a <b>session</b>; keep them short (default limit 60 s) and use them only when several documents must change together.</p>"
      },
      {
        "id": "mdb-t-3-1",
        "d": 3,
        "title": "3.1 · Index Types, the ESR Rule and explain()",
        "html": "<h4>Index types</h4>\n<ul>\n<li><b>Single field</b> and <b>compound</b> (<code>{ status: 1, date: -1 }</code>).</li>\n<li><b>Multikey</b>: created automatically when an indexed field holds an array. A compound index can include at most one array field per document.</li>\n<li><b>Unique</b>, <b>partial</b> (<code>partialFilterExpression</code>), <b>sparse</b>, <b>TTL</b> (<code>expireAfterSeconds</code> on a Date field, single-field only), <b>text</b>, <b>wildcard</b>, <b>2dsphere</b>.</li>\n</ul>\n<h4>Compound index design: ESR</h4>\n<p>Order fields as <b>E</b>quality → <b>S</b>ort → <b>R</b>ange. A compound index also serves queries on any of its <b>prefixes</b>: <code>{a,b,c}</code> supports <code>{a}</code>, <code>{a,b}</code> and <code>{a,b,c}</code>, but not <code>{b}</code> alone.</p>\n<h4>Reading explain('executionStats')</h4>\n<table class=\"keytable\">\n<tr><th>Signal</th><th>Meaning</th></tr>\n<tr><td><code>COLLSCAN</code></td><td>No usable index: every document is read</td></tr>\n<tr><td><code>IXSCAN</code> + <code>FETCH</code></td><td>Index used, documents fetched</td></tr>\n<tr><td><code>SORT</code> stage</td><td>In-memory sort: the index does not provide the order</td></tr>\n<tr><td><code>totalDocsExamined</code> ≫ <code>nReturned</code></td><td>Index is not selective enough</td></tr>\n<tr><td><code>totalDocsExamined: 0</code></td><td><b>Covered query</b>: answered from the index alone</td></tr>\n</table>"
      },
      {
        "id": "mdb-t-4-1",
        "d": 4,
        "title": "4.1 · Schema Design: Embed vs. Reference and Patterns",
        "html": "<h4>The guiding rule</h4>\n<p><b>Data that is accessed together should be stored together.</b> Model for your queries, not for normalization.</p>\n<table class=\"keytable\">\n<tr><th>Relationship</th><th>Usual choice</th></tr>\n<tr><td>One-to-few, read with the parent</td><td>Embed</td></tr>\n<tr><td>One-to-many, bounded</td><td>Embed or array of references</td></tr>\n<tr><td>One-to-squillions / unbounded growth</td><td>Reference from the child (avoid unbounded arrays and the 16 MB limit)</td></tr>\n<tr><td>Many-to-many</td><td>Arrays of references on one or both sides</td></tr>\n</table>\n<h4>Common patterns</h4>\n<ul>\n<li><b>Subset:</b> embed only the most-used items (e.g. latest 10 reviews), keep the rest in another collection.</li>\n<li><b>Extended reference:</b> copy a few frequently read fields of a referenced document to avoid joins.</li>\n<li><b>Computed:</b> store precomputed totals updated on write.</li>\n<li><b>Bucket / time series:</b> group measurements per time window; MongoDB <b>time series collections</b> do this natively.</li>\n</ul>"
      },
      {
        "id": "mdb-t-5-1",
        "d": 5,
        "title": "5.1 · The Aggregation Pipeline",
        "html": "<h4>Core stages</h4>\n<table class=\"keytable\">\n<tr><th>Stage</th><th>Purpose</th></tr>\n<tr><td><code>$match</code></td><td>Filter; place it first so it can use indexes</td></tr>\n<tr><td><code>$group</code></td><td>Group by <code>_id</code> with accumulators (<code>$sum</code>, <code>$avg</code>, <code>$max</code>, <code>$push</code>)</td></tr>\n<tr><td><code>$project</code> / <code>$set</code></td><td>Reshape or add computed fields</td></tr>\n<tr><td><code>$unwind</code></td><td>One output document per array element</td></tr>\n<tr><td><code>$lookup</code></td><td>Left outer join with another collection</td></tr>\n<tr><td><code>$sort</code>, <code>$limit</code>, <code>$skip</code>, <code>$count</code>, <code>$facet</code></td><td>Ordering, paging, multi-result views</td></tr>\n<tr><td><code>$out</code> / <code>$merge</code></td><td>Write results: <code>$out</code> replaces a collection, <code>$merge</code> upserts into an existing one</td></tr>\n</table>\n<pre>db.orders.aggregate([\n  { $match: { status: 'paid', createdAt: { $gte: ISODate('2026-01-01') } } },\n  { $group: { _id: '$customerId', total: { $sum: '$amount' }, orders: { $sum: 1 } } },\n  { $sort: { total: -1 } },\n  { $limit: 10 }\n])</pre>"
      },
      {
        "id": "mdb-t-6-1",
        "d": 6,
        "title": "6.1 · Drivers, Read/Write Concerns and Tools",
        "html": "<h4>Driver best practices</h4>\n<ul>\n<li>Create <b>one <code>MongoClient</code> per application process</b> and reuse it; it manages a connection pool.</li>\n<li>Keep credentials out of source code: environment variables or a secret manager.</li>\n<li>Retryable writes and reads are on by default in modern drivers.</li>\n</ul>\n<h4>Consistency controls</h4>\n<table class=\"keytable\">\n<tr><th>Setting</th><th>Effect</th></tr>\n<tr><td><code>writeConcern: { w: 'majority' }</code></td><td>Acknowledged only after a majority of replica set members have the write; survives failover (default in 5.0+)</td></tr>\n<tr><td><code>w: 1</code></td><td>Acknowledged by the primary only; can be rolled back after a failover</td></tr>\n<tr><td><code>readPreference: 'secondary'</code></td><td>Offloads reads but may return stale data</td></tr>\n<tr><td><code>readConcern: 'majority'</code></td><td>Returns only data that cannot be rolled back</td></tr>\n</table>\n<h4>Tools</h4>\n<p><code>mongosh</code> (shell), <code>mongodump</code>/<code>mongorestore</code> (BSON backups that preserve types and indexes), <code>mongoexport</code>/<code>mongoimport</code> (JSON/CSV for data exchange), MongoDB Compass (GUI), Atlas CLI and Atlas Search for full-text search.</p>"
      }
    ],
    "questions": [
      {
        "id": "mdb-01",
        "d": 1,
        "t": "Document Size Limit",
        "q": "A media service stores each uploaded video, up to 200 MB, inside a field of the `videos` document. Inserts of larger uploads fail. What is the recommended way to store these files in MongoDB?",
        "o": [
          "Split each file across several fields of the same document.",
          "Use GridFS, which stores files in chunks across two collections.",
          "Raise the server parameter that controls the maximum document size.",
          "Compress the binary with zstd so it always fits in one document."
        ],
        "a": 1,
        "e": "BSON documents are limited to 16 MB, and the limit cannot be raised. GridFS splits a file into chunks stored in `fs.chunks`, with metadata in `fs.files`. Many teams instead store files in object storage and keep only the URL in MongoDB."
      },
      {
        "id": "mdb-02",
        "d": 1,
        "t": "The _id Field",
        "q": "A developer runs `db.events.insertOne({ type: 'login', user: 'ana' })` without an `_id`. What happens?",
        "o": [
          "The insert fails because every document must declare its own `_id`.",
          "The document is stored without a primary key and cannot be updated later.",
          "An `ObjectId` is generated for `_id`, which is unique and immutable in the collection.",
          "MongoDB uses the first field, `type`, as the primary key."
        ],
        "a": 2,
        "e": "Every document needs a unique `_id`. If it is missing, the driver (or the server) generates an `ObjectId`. The `_id` field is automatically indexed, unique and cannot be changed after insertion."
      },
      {
        "id": "mdb-03",
        "d": 1,
        "t": "Schema Validation",
        "q": "The `users` collection must reject any new document that lacks `email` or stores it as something other than a string, while the rest of the schema stays flexible. What should you configure?",
        "o": [
          "A unique index on `email`, which also rejects documents without the field.",
          "A `$jsonSchema` validator requiring `email` of `bsonType: 'string'` with `validationAction: 'error'`.",
          "A `$jsonSchema` validator with `validationAction: 'warn'`, which blocks invalid writes.",
          "Nothing in the database; MongoDB cannot enforce fields because it is schemaless."
        ],
        "a": 1,
        "e": "Schema validation with `$jsonSchema` lets you require specific fields and types while leaving others flexible. `validationAction: 'error'` rejects invalid writes; `warn` only logs them."
      },
      {
        "id": "mdb-04",
        "d": 1,
        "t": "Numeric Types for Money",
        "q": "An invoicing app stores amounts as JavaScript numbers. Finance reports totals such as `0.30000000000000004`. Which BSON type should be used for monetary values?",
        "o": [
          "`Decimal128`, which stores exact decimal values.",
          "`Double`, rounded to two decimals in every query.",
          "`String`, converted back to a number in the application.",
          "`Int32`, which supports up to six decimal places."
        ],
        "a": 0,
        "e": "Binary floating point cannot represent most decimal fractions exactly. `Decimal128` (or storing integer cents in `Int64`) keeps exact values and still supports arithmetic, sorting and comparison in queries."
      },
      {
        "id": "mdb-05",
        "d": 2,
        "t": "Ordered insertMany",
        "q": "`insertMany` loads 10,000 product documents. Document 37 has a duplicate `_id`. The team wants every valid document inserted and the duplicates reported. Which call does that?",
        "o": [
          "`insertMany(docs)`, since the default skips duplicates automatically.",
          "`insertMany(docs, { upsert: true })`, which overwrites the duplicate.",
          "`insertMany(docs, { writeConcern: { w: 0 } })`, which ignores errors.",
          "`insertMany(docs, { ordered: false })`, which continues after errors and reports them."
        ],
        "a": 3,
        "e": "By default `insertMany` is ordered and stops at the first error, so documents after 37 are not inserted. With `ordered: false` the server attempts every document and returns a bulk write error listing the failures."
      },
      {
        "id": "mdb-06",
        "d": 2,
        "t": "Querying Arrays",
        "q": "Documents in `articles` have a `tags` array such as `['mongodb', 'database', 'nosql']`. Which filter returns every article whose tags include `mongodb`?",
        "o": [
          "`{ tags: ['mongodb'] }`",
          "`{ tags: { $size: 'mongodb' } }`",
          "`{ tags: 'mongodb' }`",
          "`{ 'tags.0': { $all: 'mongodb' } }`"
        ],
        "a": 2,
        "e": "An equality condition on an array field matches documents where any element equals the value. `{ tags: ['mongodb'] }` would instead require the array to be exactly `['mongodb']`."
      },
      {
        "id": "mdb-07",
        "d": 2,
        "t": "$elemMatch",
        "q": "Each student document has `results: [82, 91, 77]`. You need students with at least one single result that is both `>= 80` and `< 85`. Which filter is correct?",
        "o": [
          "`{ results: { $gte: 80, $lt: 85 } }`",
          "`{ results: { $elemMatch: { $gte: 80, $lt: 85 } } }`",
          "`{ $and: [ { results: { $gte: 80 } }, { results: { $lt: 85 } } ] }`",
          "`{ 'results.$': { $gte: 80, $lt: 85 } }`"
        ],
        "a": 1,
        "e": "Without `$elemMatch`, each condition can be satisfied by a different element: `[91, 77]` matches because 91 ≥ 80 and 77 < 85. `$elemMatch` requires one element to meet all conditions."
      },
      {
        "id": "mdb-08",
        "d": 2,
        "t": "Embedded Documents",
        "q": "Customers have `address: { city: 'Lima', zip: '15001', country: 'PE' }`. The filter `{ address: { city: 'Lima' } }` returns nothing. Which filter returns all customers in Lima?",
        "o": [
          "`{ 'address.city': 'Lima' }`",
          "`{ address: { $in: ['Lima'] } }`",
          "`{ address: { city: 'Lima', $partial: true } }`",
          "`{ city: 'Lima' }`, since embedded fields are flattened."
        ],
        "a": 0,
        "e": "Matching an embedded document by value requires an exact match of the whole subdocument, including field order. Dot notation queries a single nested field."
      },
      {
        "id": "mdb-09",
        "d": 2,
        "t": "Projection Rules",
        "q": "`db.users.find({}, { name: 1, email: 1, password: 0 })` fails with a projection error. What is the problem and the fix?",
        "o": [
          "Projections require string values, so write `{ name: 'include' }` instead.",
          "Inclusion and exclusion cannot be mixed (except `_id`); use `{ name: 1, email: 1 }`.",
          "The `password` field must be hidden with `$unset` inside the query filter.",
          "Projections are only allowed on indexed fields, so create an index first."
        ],
        "a": 1,
        "e": "A projection is either inclusive or exclusive. With an inclusion projection every other field is already excluded, so `{ name: 1, email: 1 }` hides `password`. Only `_id` may be excluded in an inclusion projection."
      },
      {
        "id": "mdb-10",
        "d": 2,
        "t": "updateOne vs replaceOne",
        "q": "`db.profiles.updateOne({ _id: 7 }, { name: 'Ana', plan: 'pro' })` throws `Update document requires atomic operators`. The goal was to change only those two fields. What is the correct call?",
        "o": [
          "`db.profiles.replaceOne({ _id: 7 }, { name: 'Ana', plan: 'pro' })`",
          "`db.profiles.updateOne({ _id: 7 }, { name: 'Ana', plan: 'pro' }, { multi: false })`",
          "`db.profiles.insertOne({ _id: 7, name: 'Ana', plan: 'pro' })`",
          "`db.profiles.updateOne({ _id: 7 }, { $set: { name: 'Ana', plan: 'pro' } })`"
        ],
        "a": 3,
        "e": "`updateOne` expects update operators such as `$set`. `replaceOne` would accept the document but replace every other field, losing data the intent was to keep."
      },
      {
        "id": "mdb-11",
        "d": 2,
        "t": "Upsert",
        "q": "A job records daily page views: if a document for `{ page: '/home', day: '2026-11-26' }` exists, increment `views`; otherwise create it with `views: 1`. Which single operation does this atomically?",
        "o": [
          "`find` the document, then `insertOne` or `updateOne` depending on the result.",
          "`replaceOne(filter, { views: 1 }, { upsert: true })`",
          "`updateOne(filter, { $inc: { views: 1 } }, { upsert: true })`",
          "`insertOne({ ...filter, views: 1 })` inside a try/catch that retries as an update."
        ],
        "a": 2,
        "e": "With `upsert: true`, if nothing matches MongoDB inserts a document built from the filter's equality fields plus the update, so `views` starts at 1. A unique index on `{ page, day }` prevents duplicates under concurrent upserts."
      },
      {
        "id": "mdb-12",
        "d": 2,
        "t": "Atomic Counters",
        "q": "Two app instances read `stock`, subtract the ordered quantity in code and write the result back with `$set`. Under load, stock values are sometimes wrong. What is the simplest correct fix?",
        "o": [
          "Filter on `stock: { $gte: qty }` and update with `$inc: { stock: -qty }`.",
          "Wrap the read and the `$set` in a `setTimeout` to serialize the requests.",
          "Read from a secondary to reduce contention on the primary.",
          "Lower the write concern to `w: 0` so the writes finish faster."
        ],
        "a": 0,
        "e": "Read-modify-write in the application races. `$inc` is applied atomically on the server, and the `stock: { $gte: qty }` condition prevents overselling: if it fails, `matchedCount` is 0."
      },
      {
        "id": "mdb-13",
        "d": 2,
        "t": "$push with $slice",
        "q": "Each device document keeps a `recentEvents` array. A new event must be appended while keeping only the latest 50 events. Which update does this in one operation?",
        "o": [
          "`{ $addToSet: { recentEvents: event }, $limit: 50 }`",
          "`{ $set: { recentEvents: { $concat: [event] } } }`",
          "`{ $push: { recentEvents: event }, $pop: { recentEvents: 50 } }`",
          "`{ $push: { recentEvents: { $each: [event], $slice: -50 } } }`"
        ],
        "a": 3,
        "e": "`$push` with `$each` and a negative `$slice` appends and then trims the array to the last N elements, which also prevents unbounded growth toward the 16 MB limit."
      },
      {
        "id": "mdb-14",
        "d": 2,
        "t": "$addToSet",
        "q": "Users can follow topics. Clicking 'follow' twice must not add the same topic twice to `following`. Which update guarantees that?",
        "o": [
          "`{ $push: { following: 'kubernetes' } }`",
          "`{ $addToSet: { following: 'kubernetes' } }`",
          "`{ $set: { 'following.$': 'kubernetes' } }`",
          "`{ $inc: { following: 'kubernetes' } }`"
        ],
        "a": 1,
        "e": "`$addToSet` adds the value only if it is not already in the array. `$push` always appends, creating duplicates."
      },
      {
        "id": "mdb-15",
        "d": 2,
        "t": "Array Filters",
        "q": "An order has `items: [{ sku: 'A1', status: 'pending' }, { sku: 'B2', status: 'pending' }, { sku: 'C3', status: 'shipped' }]`. You must set `status: 'cancelled'` on every pending item in one update. Which update is correct?",
        "o": [
          "`updateOne({ _id }, { $set: { 'items.$.status': 'cancelled' } })` with filter `{ 'items.status': 'pending' }`.",
          "`updateOne({ _id }, { $set: { 'items.status': 'cancelled' } })`",
          "`updateOne({ _id }, { $set: { 'items.$[it].status': 'cancelled' } }, { arrayFilters: [ { 'it.status': 'pending' } ] })`",
          "`updateMany({ 'items.status': 'pending' }, { $set: { 'items.$.status': 'cancelled' } })`"
        ],
        "a": 2,
        "e": "The filtered positional operator `$[identifier]` with `arrayFilters` updates every element that matches the condition. The `$` operator only updates the first matching element."
      },
      {
        "id": "mdb-16",
        "d": 2,
        "t": "findOneAndUpdate",
        "q": "A ticketing service in Node.js reserves the next free seat with `findOneAndUpdate` and must return the seat as it looks after the update (status `reserved`). Which option is required?",
        "o": [
          "`{ upsert: true }`",
          "`{ projection: { status: 1 } }`",
          "`{ ordered: false }`",
          "`{ returnDocument: 'after' }`"
        ],
        "a": 3,
        "e": "By default `findOneAndUpdate` returns the document before modification. `returnDocument: 'after'` (Node.js driver) or `returnNewDocument: true` (mongosh) returns the updated version."
      },
      {
        "id": "mdb-17",
        "d": 2,
        "t": "deleteMany vs drop",
        "q": "A staging collection must be emptied every night before reloading, keeping its indexes and validation rules. Which operation fits?",
        "o": [
          "`db.staging.deleteMany({})`",
          "`db.staging.drop()`",
          "`db.dropDatabase()`",
          "`db.staging.remove()` with no arguments, then `drop()`."
        ],
        "a": 0,
        "e": "`deleteMany({})` removes all documents while keeping the collection, its indexes and its validator. `drop()` deletes the collection with its indexes, so they would have to be recreated. For very large collections, drop and recreate can be faster if done with care."
      },
      {
        "id": "mdb-18",
        "d": 2,
        "t": "Pagination",
        "q": "An API pages through 50 million log documents with `find().sort({ _id: 1 }).skip(page * 100).limit(100)`. Deep pages take seconds. What is the better approach?",
        "o": [
          "Increase the page size to 10,000 so fewer pages are requested.",
          "Seek from the last `_id`: `find({ _id: { $gt: lastId } })` with sort and limit.",
          "Remove the sort so the server can skip over documents much faster.",
          "Add an index on `{ skip: 1 }` so the server can jump to the offset."
        ],
        "a": 1,
        "e": "`skip()` still walks through all skipped entries, so cost grows with page depth. Seeking from the last seen indexed value jumps straight to the next page."
      },
      {
        "id": "mdb-19",
        "d": 2,
        "t": "Counting Documents",
        "q": "A dashboard shows the total number of documents in a 2-billion-document collection and must load quickly. Exactness to the last document is not required and there is no filter. Which method fits?",
        "o": [
          "`countDocuments({})`, which reads metadata instantly.",
          "`find().toArray().length`",
          "`estimatedDocumentCount()`, which uses collection metadata.",
          "`aggregate([{ $count: 'n' }])`, which never scans documents."
        ],
        "a": 2,
        "e": "`estimatedDocumentCount()` reads the collection's metadata count and does not take a filter. `countDocuments` and `$count` execute a query, which is expensive on a huge collection."
      },
      {
        "id": "mdb-20",
        "d": 2,
        "t": "Multi-Document Transactions",
        "q": "A wallet transfer must debit one account document and credit another; both changes must succeed or neither. The deployment is a 3-member replica set. What should the code use?",
        "o": [
          "Two `updateOne` calls with `w: 'majority'`, which makes them atomic together.",
          "A single `updateMany` with `$inc` on both `_id` values.",
          "A multi-document transaction started on a client session, committing both updates together.",
          "`bulkWrite` with `ordered: true`, which rolls back earlier writes on failure."
        ],
        "a": 2,
        "e": "Atomicity across documents requires a transaction (e.g. `session.withTransaction(...)`). Write concern controls durability, not atomicity, and ordered bulk writes stop on error without rolling back previous operations."
      },
      {
        "id": "mdb-21",
        "d": 3,
        "t": "The ESR Rule",
        "q": "A frequent query is `find({ status: 'open', priority: { $gte: 3 } }).sort({ createdAt: -1 })`. Which compound index follows the Equality-Sort-Range rule?",
        "o": [
          "`{ priority: 1, status: 1, createdAt: -1 }`",
          "`{ createdAt: -1, priority: 1, status: 1 }`",
          "`{ status: 1, priority: 1, createdAt: -1 }`",
          "`{ status: 1, createdAt: -1, priority: 1 }`"
        ],
        "a": 3,
        "e": "Equality fields first (`status`), then the sort field (`createdAt`), then range fields (`priority`). This lets the index return documents already sorted and avoids an in-memory SORT stage."
      },
      {
        "id": "mdb-22",
        "d": 3,
        "t": "Index Prefixes",
        "q": "The collection has the index `{ country: 1, city: 1, lastName: 1 }`. Which query can NOT use this index efficiently?",
        "o": [
          "`find({ country: 'CL' })`",
          "`find({ country: 'CL', city: 'Santiago' })`",
          "`find({ country: 'CL', city: 'Santiago', lastName: 'Rojas' })`",
          "`find({ city: 'Santiago' })`"
        ],
        "a": 3,
        "e": "A compound index supports queries on its prefixes: `{country}`, `{country, city}` and the full key. A query on `city` alone skips the leading field and cannot use the index for an efficient bounded scan."
      },
      {
        "id": "mdb-23",
        "d": 3,
        "t": "explain() Output",
        "q": "`explain('executionStats')` for a slow query shows `stage: 'COLLSCAN'`, `nReturned: 12` and `totalDocsExamined: 1800000`. What does this mean?",
        "o": [
          "No suitable index was used, so every document was read to return 12 results.",
          "The query was covered by an index, so no documents were fetched.",
          "The index is correct but the server's cache is cold.",
          "The query used an index and then sorted 1.8 million entries in memory."
        ],
        "a": 0,
        "e": "COLLSCAN is a full collection scan. Examining 1.8 million documents to return 12 indicates a missing or unusable index for this filter."
      },
      {
        "id": "mdb-24",
        "d": 3,
        "t": "Covered Queries",
        "q": "There is an index `{ email: 1, status: 1 }`. Which query is a covered query (answered entirely from the index)?",
        "o": [
          "`find({ email: 'a@x.io' })`",
          "`find({ email: 'a@x.io' }, { status: 1, _id: 0 })`",
          "`find({ email: 'a@x.io' }, { status: 1 })`",
          "`find({ status: 'active' }, { email: 1, _id: 0 })`"
        ],
        "a": 1,
        "e": "A covered query filters and projects only on indexed fields and excludes `_id` (unless `_id` is in the index). The plan then shows `totalDocsExamined: 0`."
      },
      {
        "id": "mdb-25",
        "d": 3,
        "t": "Partial Unique Index",
        "q": "Phone numbers are optional, but when present they must be unique. Creating a unique index on `phone` fails because many documents lack the field. What should you create?",
        "o": [
          "A regular index on `phone`, then check duplicates in the application.",
          "A compound unique index on `{ phone: 1, _id: 1 }` to allow repeated nulls.",
          "A unique index on `phone` with a `partialFilterExpression` on `$exists`.",
          "A TTL index on `phone` so documents with missing values expire."
        ],
        "a": 2,
        "e": "In a regular unique index, every document without the field is indexed as `null`, so they collide. A partial index only includes documents that match the filter, enforcing uniqueness only where `phone` exists."
      },
      {
        "id": "mdb-26",
        "d": 3,
        "t": "TTL Indexes",
        "q": "Password reset tokens must disappear automatically 30 minutes after `createdAt`. What is the right approach?",
        "o": [
          "A cron job that runs `deleteMany` on expired tokens every second.",
          "A TTL index on `createdAt` with `expireAfterSeconds: 1800`.",
          "A capped collection sized to hold about 30 minutes of tokens.",
          "A compound TTL index on `{ createdAt: 1, userId: 1 }`."
        ],
        "a": 1,
        "e": "TTL indexes delete documents whose Date field is older than `expireAfterSeconds`. The background monitor runs about every 60 seconds, so deletion is not instantaneous; TTL works on single-field indexes only."
      },
      {
        "id": "mdb-27",
        "d": 3,
        "t": "Multikey Index Limits",
        "q": "Creating the index `{ tags: 1, categories: 1 }` fails with `cannot index parallel arrays`. Both fields are arrays in the same documents. Why?",
        "o": [
          "A compound multikey index can include at most one array-valued field per document.",
          "Array fields cannot be indexed at all; only scalar fields can.",
          "Compound indexes support at most one field in total.",
          "The index must be created with `{ sparse: true }` when fields are arrays."
        ],
        "a": 0,
        "e": "Indexing two array fields would create the Cartesian product of their elements. Create separate indexes or restructure the data so only one indexed field is an array."
      },
      {
        "id": "mdb-28",
        "d": 3,
        "t": "Regex and Text Search",
        "q": "A product search uses `find({ name: /laptop/i })` on 5 million documents and is slow despite an index on `name`. Users need relevance-ranked, case-insensitive search. What should you use?",
        "o": [
          "Change the pattern to `/laptop/` without the `i` flag; it then uses the index fully.",
          "Add a second regular index on `name` in descending order.",
          "Store `name` in uppercase and keep the unanchored regex.",
          "Atlas Search (or a text index) to get tokenized, relevance-ranked search."
        ],
        "a": 3,
        "e": "Only case-sensitive, left-anchored regexes such as `/^lap/` use an index efficiently. Full-text needs with ranking are served by Atlas Search (Lucene) or a `text` index."
      },
      {
        "id": "mdb-29",
        "d": 4,
        "t": "Embed vs Reference",
        "q": "Each customer has at most three shipping addresses, which are always shown on the customer profile page. How should they be modeled?",
        "o": [
          "Embed the addresses as an array inside the customer document.",
          "Store addresses in a separate collection with a reference to the customer.",
          "Store each address in its own database for isolation.",
          "Store the addresses as a JSON string field to avoid nesting."
        ],
        "a": 0,
        "e": "A bounded one-to-few relationship that is read with the parent is a textbook case for embedding: one read returns everything the page needs."
      },
      {
        "id": "mdb-30",
        "d": 4,
        "t": "Unbounded Arrays",
        "q": "A forum embeds every comment in the post document. Popular posts now hit `BSONObjectTooLarge` errors and updates are slow. What change addresses the root cause?",
        "o": [
          "Compress the comments array with a custom encoding before saving.",
          "Move comments to their own collection that references `postId`.",
          "Shard the posts collection so documents can exceed 16 MB.",
          "Increase the WiredTiger cache size on every replica set member."
        ],
        "a": 1,
        "e": "Unbounded arrays grow without limit and eventually exceed 16 MB. Referencing from the child keeps documents bounded; embedding only the most recent comments is the subset pattern."
      },
      {
        "id": "mdb-31",
        "d": 4,
        "t": "Subset Pattern",
        "q": "Product pages show the 10 most recent reviews; the full list (sometimes thousands) is viewed rarely. Which design best balances read speed and document size?",
        "o": [
          "Embed every review directly inside the product document.",
          "Keep reviews only in a separate collection and join with `$lookup` on every page load.",
          "Embed the 10 latest reviews; keep the full list in a `reviews` collection.",
          "Store reviews in a single document per day across all products."
        ],
        "a": 2,
        "e": "The subset pattern keeps frequently accessed data embedded for single-read pages while the complete, rarely used data lives in its own collection."
      },
      {
        "id": "mdb-32",
        "d": 4,
        "t": "Time Series Data",
        "q": "Thousands of sensors send a reading every 10 seconds. Queries aggregate readings by sensor over time windows, and data older than 90 days can be deleted. What is the best fit?",
        "o": [
          "One document per sensor with all readings in an ever-growing array.",
          "A regular collection with a text index on the sensor name.",
          "A capped collection with no secondary indexes at all.",
          "A time series collection keyed by sensor, with `expireAfterSeconds`."
        ],
        "a": 3,
        "e": "Time series collections bucket measurements internally for efficient storage and queries, and support automatic expiry. A single growing array per sensor would hit the 16 MB limit."
      },
      {
        "id": "mdb-33",
        "d": 5,
        "t": "Pipeline Stage Order",
        "q": "A pipeline computes revenue per customer for paid orders in 2026: `[ { $group: ... }, { $match: { status: 'paid', year: 2026 } } ]`. It is slow and returns wrong totals. What is the fix?",
        "o": [
          "Move `$match` before `$group` so it filters first and can use an index.",
          "Add `allowDiskUse: true` and keep the order of stages.",
          "Replace `$group` with `$project`, which is faster for large inputs.",
          "Add a `$sort` stage at the end of the pipeline to fix the totals."
        ],
        "a": 0,
        "e": "Stages run in order. Grouping first aggregates all orders and drops the fields used afterwards by `$match`. Filtering first reduces the data and allows index use."
      },
      {
        "id": "mdb-34",
        "d": 5,
        "t": "$lookup",
        "q": "Order documents store `customerId`. A report needs each order with its customer's name from the `customers` collection, keeping orders with no matching customer. Which stage does this?",
        "o": [
          "`$merge` into `customers` with `on: 'customerId'` to combine them.",
          "`$lookup` from `customers` with `localField: 'customerId'`.",
          "`$unionWith: 'customers'`, which appends customer fields to each order.",
          "`$graphLookup` with `maxDepth: 0`, which performs an inner join."
        ],
        "a": 1,
        "e": "`$lookup` performs a left outer join, adding an array of matching documents (empty when there is no match). Follow it with `$unwind` (`preserveNullAndEmptyArrays: true`) or `$first` to flatten."
      },
      {
        "id": "mdb-35",
        "d": 5,
        "t": "$unwind and $group",
        "q": "Articles have a `tags` array. You need the number of articles per tag, most frequent first. Which pipeline is correct?",
        "o": [
          "`[ { $group: { _id: '$tags', n: { $sum: 1 } } }, { $sort: { n: -1 } } ]`",
          "`[ { $project: { n: { $size: '$tags' } } }, { $sort: { n: -1 } } ]`",
          "`[ { $count: '$tags' }, { $sort: { count: -1 } }, { $limit: 100 } ]`",
          "`[ { $unwind: '$tags' }, { $group: { _id: '$tags', n: { $sum: 1 } } }, { $sort: { n: -1 } } ]`"
        ],
        "a": 3,
        "e": "`$unwind` emits one document per tag, so `$group` by tag counts articles per individual tag. Grouping on the array itself groups identical whole arrays instead."
      },
      {
        "id": "mdb-36",
        "d": 5,
        "t": "$merge vs $out",
        "q": "A nightly job builds a `monthly_sales` summary. Each run computes only the current month and must update it without deleting previous months. Which final stage fits?",
        "o": [
          "`$out: 'monthly_sales'`, which appends to the collection.",
          "`$merge: { into: 'monthly_sales', whenMatched: 'replace' }`",
          "`$set: { collection: 'monthly_sales' }` as the last stage.",
          "`$group` with `$push` into the `monthly_sales` collection."
        ],
        "a": 1,
        "e": "`$merge` upserts results into an existing collection, ideal for incremental materialized views. `$out` replaces the entire target collection on every run."
      },
      {
        "id": "mdb-37",
        "d": 6,
        "t": "MongoClient Lifecycle",
        "q": "A Node.js API creates a new `MongoClient`, connects, runs one query and closes it on every HTTP request. Under load, latency spikes and Atlas shows thousands of connections. What should change?",
        "o": [
          "Create one `MongoClient` at startup and reuse its pool across requests.",
          "Raise the Atlas tier so it accepts more connections per second.",
          "Set `maxPoolSize: 1` on each per-request client to limit connections.",
          "Switch every query to `readPreference: 'secondary'` to spread connections."
        ],
        "a": 0,
        "e": "Each client performs connection handshakes and authentication. A single long-lived client per process reuses pooled connections, which drivers are designed for."
      },
      {
        "id": "mdb-38",
        "d": 6,
        "t": "Backup Tooling",
        "q": "You need a logical backup of a database that can be restored with the same BSON types (ObjectId, Decimal128, Date) and indexes. Which tools fit?",
        "o": [
          "`mongoexport` to CSV and `mongoimport` to restore.",
          "`db.collection.find()` output saved from mongosh as text.",
          "`mongodump` and `mongorestore`.",
          "MongoDB Compass export to JSON for every collection."
        ],
        "a": 2,
        "e": "`mongodump` writes BSON plus metadata, including index definitions, and `mongorestore` recreates them faithfully. CSV and JSON exports are for data exchange and can lose type fidelity. On Atlas, managed cloud backups are the usual production choice."
      },
      {
        "id": "mdb-39",
        "d": 6,
        "t": "Read Your Own Writes",
        "q": "After a user updates their profile, the app immediately reads it back with `readPreference: 'secondary'` and sometimes shows the old value. What explains this and what fixes it?",
        "o": [
          "The update used `$set`, which is applied lazily; use `replaceOne` instead.",
          "Secondaries lag behind; read from the primary or use a causal session.",
          "The driver caches documents for 60 seconds; disable the driver cache.",
          "The collection needs a TTL index so secondaries refresh their data."
        ],
        "a": 1,
        "e": "Replication to secondaries lags behind the primary. Reading from the primary, or using a causally consistent session with majority read and write concerns, guarantees users see their own writes."
      },
      {
        "id": "mdb-40",
        "d": 6,
        "t": "Write Concern",
        "q": "A payments service must not lose acknowledged writes if the primary fails right after acknowledging. Which write concern provides this guarantee?",
        "o": [
          "`{ w: 0 }`, because it skips waiting for the server to respond.",
          "`{ w: 1 }`, because the primary already has the write.",
          "`{ w: 1, j: false }`, which reduces disk latency on the primary.",
          "`{ w: 'majority' }`, acknowledged once most members have it."
        ],
        "a": 3,
        "e": "Writes acknowledged by a majority survive a failover because the new primary is elected from members that have them. With `w: 1`, a write only on the old primary can be rolled back."
      }
    ],
    "why": {
      "mdb-01": [
        "The 16 MB limit applies to the whole document, no matter how many fields the data is split across.",
        null,
        "The 16 MB BSON limit is fixed and cannot be changed with a server parameter.",
        "Compression ratios vary; video is usually already compressed, so it would not fit reliably."
      ],
      "mdb-02": [
        "`_id` is optional on insert; it is generated when missing.",
        "Every stored document has an `_id`, so it can always be updated.",
        null,
        "MongoDB never uses another field as primary key; `_id` is always the key."
      ],
      "mdb-03": [
        "A unique index does not reject missing fields; documents without `email` are indexed as null, and types are not checked.",
        null,
        "`warn` only logs violations; invalid writes are still accepted.",
        "MongoDB supports schema validation with `$jsonSchema` on any collection."
      ],
      "mdb-04": [
        null,
        "Rounding a binary double does not remove representation errors in sums.",
        "Strings cannot be summed or compared numerically in queries and aggregations.",
        "`Int32` is an integer type without decimals."
      ],
      "mdb-05": [
        "The default is ordered, which stops at the first error.",
        "`insertMany` has no `upsert` option; upserts belong to update operations.",
        "`w: 0` gives no acknowledgment at all, so failures are not even reported.",
        null
      ],
      "mdb-06": [
        "This requires the whole array to equal exactly `['mongodb']`.",
        "`$size` expects a number and matches array length, not content.",
        null,
        "`$all` expects an array, and `tags.0` checks only the first element."
      ],
      "mdb-07": [
        "Each condition can be met by a different element, returning unwanted documents.",
        null,
        "Same issue: the two conditions are evaluated independently across elements.",
        "The positional `$` operator is for projections and updates, not query filters."
      ],
      "mdb-08": [
        null,
        "`$in` compares the whole subdocument with strings, which never matches.",
        "`$partial` is not a MongoDB operator.",
        "Embedded fields are not flattened; `city` at the top level does not exist."
      ],
      "mdb-09": [
        "Projections use 1/0 or true/false, not strings like 'include'.",
        null,
        "`$unset` is an update operator, not a query or projection operator.",
        "Any field can be projected; indexes are unrelated."
      ],
      "mdb-10": [
        "`replaceOne` drops every field not listed, losing the rest of the profile.",
        "`multi` is not the problem; the update still lacks operators.",
        "Inserting with an existing `_id` fails with a duplicate key error.",
        null
      ],
      "mdb-11": [
        "Two separate operations race under concurrency and can create duplicates.",
        "A replacement resets the document to `{ views: 1 }` every time instead of incrementing.",
        null,
        "Try/catch retry logic is more code and still not a single atomic operation."
      ],
      "mdb-12": [
        null,
        "Delaying requests in one process does not serialize writes across instances.",
        "Secondaries can return stale values, making the race worse.",
        "`w: 0` removes acknowledgments and hides errors without fixing the race."
      ],
      "mdb-13": [
        "`$limit` is an aggregation stage, not an update operator, and `$addToSet` drops repeated events.",
        "`$concat` is for strings and would replace the array.",
        "`$pop` removes only one element from either end, not down to 50.",
        null
      ],
      "mdb-14": [
        "`$push` appends even if the value already exists.",
        null,
        "`$` requires a matching array element in the filter and would overwrite it.",
        "`$inc` works on numbers only."
      ],
      "mdb-15": [
        "`$` updates only the first matching element.",
        "Without a positional operator this tries to set a field on the array itself and fails.",
        null,
        "Still uses `$`, so only the first pending item in each order is changed."
      ],
      "mdb-16": [
        "Upsert controls insertion when nothing matches, not which version is returned.",
        "Projection limits fields; it still returns the pre-update document.",
        "`ordered` is an option for bulk inserts and writes.",
        null
      ],
      "mdb-17": [
        null,
        "`drop()` also removes the indexes and validator, which must be kept.",
        "Dropping the database removes every collection, not just staging.",
        "`remove()` is deprecated and dropping afterwards loses the indexes."
      ],
      "mdb-18": [
        "Bigger pages reduce request count but each deep page is still expensive.",
        null,
        "Without a sort the order is undefined, and skipping is still linear.",
        "There is no `skip` field; indexes cannot accelerate the skip operation itself."
      ],
      "mdb-19": [
        "`countDocuments` runs an aggregation over the data and is not instant.",
        "Loading 2 billion documents into memory is impractical.",
        null,
        "`$count` is an aggregation stage that processes documents."
      ],
      "mdb-20": [
        "Write concern ensures durability per write; it does not make two writes atomic.",
        "`$inc` with the same amount cannot debit one document and credit another in one update.",
        null,
        "Ordered bulk writes stop on error but never roll back completed writes."
      ],
      "mdb-21": [
        "Leading with the range field reduces index selectivity for the equality and breaks the sort.",
        "Leading with the sort field forces scanning many non-matching entries.",
        "Placing the range before the sort field forces an in-memory sort.",
        null
      ],
      "mdb-22": [
        "This is the index prefix `{ country }` and can use the index.",
        "This uses the prefix `{ country, city }`.",
        "This uses the full index key.",
        null
      ],
      "mdb-23": [
        null,
        "A covered query would show IXSCAN with zero documents examined.",
        "A cold cache affects latency, not the plan type or documents examined.",
        "The plan shows a collection scan, not an index scan with a sort."
      ],
      "mdb-24": [
        "Without a projection the full document is returned, so it must be fetched.",
        null,
        "`_id` is included by default and is not in the index, forcing a fetch.",
        "Filtering on `status` alone cannot use the index prefix efficiently."
      ],
      "mdb-25": [
        "Application checks race under concurrency and do not guarantee uniqueness.",
        "Adding `_id` makes every entry unique, so it enforces nothing.",
        null,
        "TTL indexes delete documents by date; they do not enforce uniqueness."
      ],
      "mdb-26": [
        "A per-second cron job adds load and operational complexity that TTL indexes handle natively.",
        null,
        "Capped collections are size-based, not time-based, and do not expire by age.",
        "TTL indexes must be single-field."
      ],
      "mdb-27": [
        null,
        "Array fields can be indexed; they produce multikey indexes.",
        "Compound indexes can contain many fields.",
        "`sparse` concerns missing fields, not arrays."
      ],
      "mdb-28": [
        "An unanchored pattern still scans every index key even without the `i` flag.",
        "Index direction does not help unanchored regex matching.",
        "Uppercasing fixes case but the unanchored regex still scans everything and has no ranking.",
        null
      ],
      "mdb-29": [
        null,
        "Referencing requires an extra query for data that is always read together.",
        "Separate databases add complexity with no benefit for this relationship.",
        "A JSON string cannot be queried or indexed by its fields."
      ],
      "mdb-30": [
        "Compression delays but does not remove unbounded growth.",
        null,
        "Sharding distributes documents; it does not lift the 16 MB per-document limit.",
        "Cache size does not change document size limits."
      ],
      "mdb-31": [
        "Embedding thousands of reviews makes documents huge and can hit 16 MB.",
        "A join on every page load adds latency for the most common read.",
        null,
        "Daily documents mix products and do not match how the page reads data."
      ],
      "mdb-32": [
        "A single growing array hits the 16 MB limit and makes updates expensive.",
        "Text indexes are for full-text search, not time-based queries.",
        "Capped collections drop data by size, not age, and have no query optimizations for time ranges.",
        null
      ],
      "mdb-33": [
        null,
        "Disk use helps memory limits; it does not fix filtering after grouping.",
        "`$project` reshapes documents; it does not aggregate totals.",
        "Sorting changes order, not the incorrectly computed totals."
      ],
      "mdb-34": [
        "`$merge` writes results into a collection; it does not join data.",
        null,
        "`$unionWith` concatenates documents from another collection; it does not join them.",
        "`$graphLookup` is for recursive lookups and is also a left outer join."
      ],
      "mdb-35": [
        "Grouping by the array groups identical whole arrays, not individual tags.",
        "This computes the number of tags per article.",
        "`$count` takes a field name for its output and counts all documents.",
        null
      ],
      "mdb-36": [
        "`$out` replaces the whole collection, deleting previous months.",
        null,
        "`$set` adds fields to documents; it does not write to collections.",
        "`$group` cannot write to another collection."
      ],
      "mdb-37": [
        null,
        "A larger tier treats the symptom; per-request clients still waste handshakes.",
        "A pool of size one per request still creates a client per request.",
        "Read preference does not address the connection churn."
      ],
      "mdb-38": [
        "CSV loses BSON types and does not include index definitions.",
        "Shell text output is not a restorable backup format.",
        null,
        "JSON exports can lose type fidelity and do not restore indexes."
      ],
      "mdb-39": [
        "`$set` is applied immediately on the primary.",
        null,
        "Drivers do not cache documents.",
        "TTL indexes delete documents and do not affect replication."
      ],
      "mdb-40": [
        "`w: 0` does not wait for any acknowledgment, so writes can be lost silently.",
        "A write only on the primary can be rolled back after failover.",
        "Disabling journaling increases the risk of losing writes.",
        null
      ]
    },
    "glossary": [
      { "term": "BSON", "cat": "Document Model", "d": 1, "def": "Binary JSON-like format MongoDB uses to store documents, with extra types such as ObjectId, Date and Decimal128.", "tip": "Maximum document size is 16 MB." },
      { "term": "ObjectId", "cat": "Document Model", "d": 1, "def": "12-byte default `_id` value whose first 4 bytes are a timestamp.", "tip": "Generated by the driver when `_id` is missing." },
      { "term": "$jsonSchema", "cat": "Document Model", "d": 1, "def": "Validator operator that enforces required fields and BSON types on writes.", "tip": "`validationAction: 'warn'` logs instead of rejecting." },
      { "term": "GridFS", "cat": "Document Model", "d": 1, "def": "Specification for storing files larger than 16 MB as chunks in `fs.chunks` and `fs.files`.", "tip": "Object storage plus a URL is often simpler." },
      { "term": "$elemMatch", "cat": "CRUD", "d": 2, "def": "Matches documents where a single array element satisfies all given conditions.", "tip": "Without it, conditions may be met by different elements." },
      { "term": "Upsert", "cat": "CRUD", "d": 2, "def": "Update option that inserts a new document when no document matches the filter.", "tip": "Equality fields from the filter seed the inserted document." },
      { "term": "arrayFilters", "cat": "CRUD", "d": 2, "def": "Conditions that select which array elements the `$[identifier]` operator updates.", "tip": "`$` updates only the first match; `$[]` updates all elements." },
      { "term": "Multi-Document Transaction", "cat": "CRUD", "d": 2, "def": "ACID unit of work across several documents or collections, run inside a client session.", "tip": "Requires a replica set or sharded cluster." },
      { "term": "ESR Rule", "cat": "Indexes", "d": 3, "def": "Guideline to order compound index fields: Equality, then Sort, then Range.", "tip": "Avoids in-memory SORT stages." },
      { "term": "Covered Query", "cat": "Indexes", "d": 3, "def": "Query answered entirely from an index without fetching documents.", "tip": "Exclude `_id` unless it is part of the index." },
      { "term": "Partial Index", "cat": "Indexes", "d": 3, "def": "Index that only includes documents matching a `partialFilterExpression`.", "tip": "Use for unique constraints on optional fields." },
      { "term": "TTL Index", "cat": "Indexes", "d": 3, "def": "Single-field index on a Date that deletes documents after `expireAfterSeconds`.", "tip": "The cleanup task runs roughly every 60 seconds." },
      { "term": "Subset Pattern", "cat": "Data Modeling", "d": 4, "def": "Embed only the most frequently used part of related data and store the rest separately.", "tip": "Classic for latest reviews or comments." },
      { "term": "Time Series Collection", "cat": "Data Modeling", "d": 4, "def": "Collection type optimized for measurements over time, defined by `timeField` and optional `metaField`.", "tip": "Supports automatic expiry with `expireAfterSeconds`." },
      { "term": "$lookup", "cat": "Aggregation", "d": 5, "def": "Aggregation stage performing a left outer join with another collection.", "tip": "Combine with `$unwind` to flatten the joined array." },
      { "term": "$merge", "cat": "Aggregation", "d": 5, "def": "Final stage that upserts pipeline results into a collection.", "tip": "Unlike `$out`, it does not replace the whole target." },
      { "term": "Write Concern", "cat": "Drivers & Tools", "d": 6, "def": "Level of acknowledgment requested for writes, such as `w: 1` or `w: 'majority'`.", "tip": "`majority` writes survive a primary failover." },
      { "term": "Read Preference", "cat": "Drivers & Tools", "d": 6, "def": "Which replica set members serve reads: primary, secondary or nearest.", "tip": "Secondary reads may be stale." }
    ]
  };
})(window);
