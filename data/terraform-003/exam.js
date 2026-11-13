/* =========================================================================
   data/terraform-003/exam.js — HashiCorp · Terraform Associate (003) (English)
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["terraform-003"] = {
    "id": "terraform-003",
    "appId": "terraform-003",
    "provider": "HashiCorp",
    "badge": "Terraform · 003",
    "icon": "🟪",
    "color": "#7b42bc",
    "featured": false,
    "title": "HashiCorp · Terraform Associate (003)",
    "subtitle": "IaC, HCL, State Management, Locking, Modules, Workspaces, Drift, and HCP Terraform",
    "passingScore": 70,
    "domains": {
      "1": "IaC Concepts and Terraform Core (15%)",
      "2": "Basic Workflow: Init, Plan, Apply, Destroy (20%)",
      "3": "State Management and Remote Backends (20%)",
      "4": "Modules, Workspaces, and Reuse (20%)",
      "5": "HCL, Variables, Functions, and Expressions (15%)",
      "6": "HCP Terraform, Sentinel, and Security (10%)"
    },
    "shortDomains": {
      "1": "IaC Core",
      "2": "CLI Workflow",
      "3": "State & Locks",
      "4": "Modules",
      "5": "HCL & Vars",
      "6": "HCP & Policy"
    },
    "topics": [
      {
        "id": "tf-t-1-1",
        "d": 1,
        "title": "1.1 · IaC Fundamentals, Declarative vs. Imperative Approach, and Idempotency",
        "html": "<h4>Infrastructure as Code (IaC) and the Declarative Paradigm</h4>\n<p>Infrastructure as Code (IaC) lets you provision, configure, and govern compute resources through machine-readable definitions in versionable files, instead of manual configuration in web consoles or ad-hoc scripts.</p>\n<table class=\"keytable\">\n<tr><th>Paradigm</th><th>Operating Mechanism</th><th>Example in IaC / Tool</th><th>Behavior on Changes</th></tr>\n<tr><td><b>Declarative</b></td><td>The engineer defines the <b>desired end state</b>. The engine calculates the differences (delta) between the actual and desired state.</td><td><b>Terraform (HCL)</b>, Kubernetes manifests, AWS CloudFormation.</td><td>If a VM's size is changed from <code>t3.micro</code> to <code>t3.large</code>, the engine determines whether to apply a resize or a replacement without manual intermediate steps.</td></tr>\n<tr><td><b>Imperative</b></td><td>The engineer defines the <b>exact sequence of commands</b>, step by step, that must be executed to reach the goal.</td><td>Bash scripts, AWS CLI, procedural Python boto3.</td><td>To update a VM, the script must check whether it exists, query its state, stop it, modify it, and start it explicitly.</td></tr>\n</table>\n\n<h4>The Idempotency Principle</h4>\n<p>An operation is <b>idempotent</b> if running it multiple times in a row produces exactly the same final result in the system without unwanted side effects:</p>\n<ul>\n  <li><b>Run 1:</b> If the resource does not exist, Terraform creates it.</li>\n  <li><b>Run 2 (no code changes):</b> Terraform detects that the actual state matches the code 100% and reports: <code>No changes. Your infrastructure matches the configuration.</code></li>\n  <li><b>Immutable Infrastructure:</b> Instead of patching servers in place (mutable drift), Terraform promotes replacing outdated instances with new pre-packaged versions (AMIs built with Packer).</li>\n</ul>\n<div class=\"tip\"><b>Exam 003 Key:</b> Terraform is strictly <b>declarative</b> and <b>idempotent</b>. The responsibility of translating the what into the how falls entirely on the corresponding provider plugin.</div>"
      },
      {
        "id": "tf-t-1-2",
        "d": 1,
        "title": "1.2 · Terraform Core Architecture, Providers (Plugins), and RPC Lifecycle",
        "html": "<h4>Architectural Separation: Terraform Core vs. Plugins</h4>\n<p>Terraform uses a modular architecture based on decoupled microprocesses that communicate through remote procedure calls over gRPC sockets:</p>\n<table class=\"keytable\">\n<tr><th>Component</th><th>Main Responsibilities</th><th>Distribution / Binary</th></tr>\n<tr><td><b>Terraform Core</b></td><td>Reading and interpreting HCL files, building the Directed Acyclic Graph (DAG), managing the state file (<code>terraform.tfstate</code>), calculating differences (diff), and orchestrating RPC calls.</td><td>Static binary compiled in Go (<code>terraform</code>). Completely independent of the cloud or provider.</td></tr>\n<tr><td><b>Provider Plugins</b></td><td>Translating abstract operations (Create, Read, Update, Delete) into real calls to provider APIs (AWS SDK, Azure ARM, Google Cloud API, Kubernetes API).</td><td>Binaries downloaded dynamically into <code>.terraform/providers/</code> from the Terraform Registry during <code>terraform init</code>.</td></tr>\n</table>\n\n<h4>The Provider Lock File (.terraform.lock.hcl)</h4>\n<p>Introduced in Terraform 0.14, the <b>Dependency Lock File</b> guarantees absolute reproducibility of deployments across developers and CI/CD pipelines:</p>\n<ul>\n  <li>It records the exact selected provider version and the <b>SHA-256 cryptographic hashes</b> of its multi-platform binary packages (<code>h1:</code> schemes).</li>\n  <li><b>Versioning Rule:</b> <code>~> 5.0</code> allows compatible versions such as <code>5.1</code> or <code>5.40</code>, but blocks <code>6.0</code> (major breaking changes).</li>\n  <li><b>Git Best Practices:</b> The <code>.terraform.lock.hcl</code> file <b>must be included in version control (Git)</b>, while the <code>.terraform/</code> folder must be ignored in <code>.gitignore</code>.</li>\n</ul>\n<div class=\"tip\"><b>Frequently Asked Question:</b> If a provider is not installed on the machine, which command must be run? Always <code>terraform init</code>. Core does not download plugins during <code>plan</code> or <code>apply</code>.</div>"
      },
      {
        "id": "tf-t-2-1",
        "d": 2,
        "title": "2.1 · CLI Workflow: Init, Plan, Apply, Destroy, and Execution Modes (-refresh-only, -target)",
        "html": "<h4>The Essential Terraform CLI Lifecycle</h4>\n<p>The standard Terraform workflow consists of four fundamental steps that ensure collaborative, safe, and deterministic development:</p>\n<table class=\"keytable\">\n<tr><th>Phase / Command</th><th>Actions Performed</th><th>Effects on State and Infrastructure</th></tr>\n<tr><td><code>terraform init</code></td><td>Configures the state backend, downloads the referenced modules, and fetches the required provider binaries, recording them in the lock file.</td><td>Creates the local <code>.terraform/</code> directory and <code>.terraform.lock.hcl</code>. Does not contact the cloud to read or create resources.</td></tr>\n<tr><td><code>terraform plan</code></td><td>Runs an implicit refresh (reads the cloud), compares against <code>main.tf</code>, and calculates the predictive execution plan (<code>+ create, ~ update, - destroy</code>).</td><td>Pure read against the cloud. With <code>-out=tfplan</code> it generates an immutable binary file guaranteed for deployment.</td></tr>\n<tr><td><code>terraform apply</code></td><td>Requests interactive manual confirmation (unless <code>-auto-approve</code> is used or a saved plan is provided), invokes the provider APIs, and updates the state.</td><td>Creates, modifies, or destroys real resources at the cloud provider and persists the new version in <code>terraform.tfstate</code>.</td></tr>\n<tr><td><code>terraform destroy</code></td><td>Calculates the reverse destruction plan following the DAG in the opposite direction and requests confirmation before purging the resources.</td><td>Equivalent to <code>terraform apply -destroy</code>. Removes all infrastructure managed in the configuration.</td></tr>\n</table>\n\n<h4>Special Execution Modes</h4>\n<ul>\n  <li><b>-refresh-only (Terraform 0.15+):</b> Inspects the real infrastructure and updates the state to reflect drift (external changes) without proposing modifications in the cloud. Safely replaces the legacy <code>terraform refresh</code> command.</li>\n  <li><b>-target=resource.name:</b> Restricts execution to a single resource or module. It is an <b>antipattern for regular use</b>; it should be reserved only for disaster recovery or complex circular dependencies, since it can leave the state out of sync.</li>\n</ul>\n<div class=\"tip\"><b>CI/CD Best Practice:</b> In automated pipelines, always separate <code>terraform plan -out=tfplan</code> in the pull request stage from <code>terraform apply tfplan</code> in the merge-to-production stage. This guarantees that what was approved is exactly what is executed, with no race conditions.</div>"
      },
      {
        "id": "tf-t-2-2",
        "d": 2,
        "title": "2.2 · Inspection and Formatting: validate, fmt, graph, console, and Troubleshooting (TF_LOG)",
        "html": "<h4>Static Analysis, Formatting, and Inspection Tools</h4>\n<p>Terraform provides fast local commands that let you verify code sanity before invoking remote APIs:</p>\n<table class=\"keytable\">\n<tr><th>Command</th><th>Scope / Validation Performed</th><th>Requires Network / Cloud API Access?</th></tr>\n<tr><td><code>terraform validate</code></td><td>Verifies HCL2 syntax, data types in variables, required arguments in resources, and consistency between local blocks.</td><td><b>No.</b> It only requires that <code>terraform init</code> has previously downloaded the provider schemas.</td></tr>\n<tr><td><code>terraform fmt</code></td><td>Applies HashiCorp's canonical style of spacing, indentation, and alignment to all <code>.tf</code> files.</td><td><b>No.</b> With the <code>-check</code> flag it returns exit code 1 if there are badly formatted files (ideal as a CI linter).</td></tr>\n<tr><td><code>terraform console</code></td><td>Interactive REPL console to evaluate HCL expressions, built-in functions (<code>cidrsubnet</code>, <code>jsonencode</code>), and query live state values.</td><td>Local read-only access to the loaded state. Does not allow invoking mutations.</td></tr>\n<tr><td><code>terraform graph</code></td><td>Generates a visual representation in DOT format of the Directed Acyclic Graph (DAG) of dependencies between resources and providers.</td><td>Lets you diagnose execution order and parallelism by piping it to Graphviz: <code>terraform graph | dot -Tpng > graph.png</code>.</td></tr>\n</table>\n\n<h4>Advanced Troubleshooting: Logging Environment Variables</h4>\n<p>When a command fails with opaque API errors or authentication problems, detailed logging of the core and providers is enabled:</p>\n<ul>\n  <li><code>TF_LOG=TRACE</code>: Maximum level of detail; shows HTTP headers and full JSON payloads of REST calls to the provider APIs.</li>\n  <li>Available levels (from lowest to highest verbosity): <code>OFF</code>, <code>ERROR</code>, <code>WARN</code>, <code>INFO</code>, <code>DEBUG</code>, <code>TRACE</code>.</li>\n  <li><code>TF_LOG_PATH=terraform.log</code>: Redirects CLI logs to a file on disk, avoiding flooding the terminal's standard output.</li>\n</ul>\n<div class=\"tip\"><b>Critical Exam Difference:</b> <code>terraform validate</code> <b>does not detect</b> whether an S3 bucket name already exists in AWS or whether your cloud credentials have expired; detecting that requires <code>terraform plan</code>.</div>"
      },
      {
        "id": "tf-t-3-1",
        "d": 3,
        "title": "3.1 · State Anatomy (terraform.tfstate), State Locking, and Remote Backends",
        "html": "<h4>The Fundamental Role of terraform.tfstate</h4>\n<p>Terraform needs a mechanism to correlate the declarative configuration written in HCL with the real physical entities in the cloud infrastructure. That mechanism is the <b>JSON state</b> file (<code>terraform.tfstate</code>):</p>\n<ul>\n  <li><b>Identifier Mapping:</b> Associates the logical HCL identifier (e.g., <code>aws_instance.web</code>) with the unique cloud ID (e.g., <code>i-04a1bc239f88</code>).</li>\n  <li><b>Performance Cache:</b> Stores attributes and dependencies so that not every API has to be queried on each graph evaluation.</li>\n  <li><b>Metadata:</b> Keeps pointers to provider versions and pointers to dependencies between modules.</li>\n</ul>\n\n<h4>Remote Backends and State Locking</h4>\n<table class=\"keytable\">\n<tr><th>Backend</th><th>State Storage</th><th>State Locking Mechanism</th><th>Encryption at Rest Support</th></tr>\n<tr><td><b>local (default)</b></td><td><code>terraform.tfstate</code> file on the machine's local disk.</td><td>Operating-system-level locks on the local file.</td><td>Depends on the host's disk encryption. Unsuitable for teams.</td></tr>\n<tr><td><b>s3 (AWS)</b></td><td>Objects in a versioned Amazon S3 Bucket.</td><td><b>Amazon DynamoDB</b> table with primary key <code>LockID</code> (String type).</td><td>SSE-S3 / SSE-KMS with least-privilege IAM policies.</td></tr>\n<tr><td><b>azurerm (Azure)</b></td><td>Blob in Azure Blob Storage (Storage Account).</td><td>Native Azure Storage <b>Blob Lease</b> mechanism.</td><td>Azure Storage service-side encryption with RBAC.</td></tr>\n<tr><td><b>gcs (Google)</b></td><td>Bucket in Google Cloud Storage.</td><td>Native locking built into the GCS API through preconditions.</td><td>Encryption by default with Google-managed keys or CMEK.</td></tr>\n<tr><td><b>remote / cloud</b></td><td>HCP Terraform / Terraform Enterprise.</td><td>Automatic transactional locking managed by the platform.</td><td>Encryption at rest and in transit with strict RBAC access control.</td></tr>\n</table>\n<div class=\"tip\"><b>What is an orphaned lock?</b> If a CI pipeline fails abruptly (e.g., a runner killed by OOM), the lock may remain held. It is released in a controlled way with <code>terraform force-unlock &lt;LOCK-ID&gt;</code> after verifying that no process is active.</div>"
      },
      {
        "id": "tf-t-3-2",
        "d": 3,
        "title": "3.2 · Advanced State Manipulation: import, state rm, state mv, and moved Blocks",
        "html": "<h4>Safe Operations and State Refactoring</h4>\n<p>The state file must never be edited manually with a text editor (risk of JSON corruption or an invalid checksum). Terraform provides atomic manipulation commands:</p>\n<table class=\"keytable\">\n<tr><th>Operation / Command</th><th>Technical Purpose</th><th>Impact on Real Cloud</th></tr>\n<tr><td><code>terraform import &lt;addr&gt; &lt;id&gt;</code></td><td>Links a pre-existing cloud resource to the Terraform state under a given HCL address.</td><td><b>Zero destructive impact.</b> It only reads the resource from the cloud and writes it to <code>terraform.tfstate</code>.</td></tr>\n<tr><td><code>import { to = ... id = ... }</code></td><td>Declarative import syntax (Terraform 1.5+). Lets you version the import and generate HCL code with <code>-generate-config-out</code>.</td><td><b>Zero destructive impact.</b> It runs predictably during the normal <code>terraform apply</code> flow.</td></tr>\n<tr><td><code>terraform state rm &lt;addr&gt;</code></td><td>Removes a resource from the state file without destroying it in the cloud.</td><td>The physical resource <b>continues to exist in the cloud</b>; Terraform simply stops managing it.</td></tr>\n<tr><td><code>terraform state mv &lt;src&gt; &lt;dst&gt;</code></td><td>Renames a resource or moves it from one module to another within the state file.</td><td>Prevents Terraform from destroying the old resource and creating a new one when its name is changed in the code.</td></tr>\n<tr><td><code>moved { from = ... to = ... }</code></td><td>Declarative HCL block (Terraform 1.1+) to record name or module migrations in version-controlled source code.</td><td><b>Excellent for refactoring:</b> Any user or CI/CD running <code>apply</code> updates the state automatically without recreating anything.</td></tr>\n</table>\n\n<h4>Quick State Inspection</h4>\n<ul>\n  <li><code>terraform state list</code>: Lists all addresses of resources managed in the current state (e.g., <code>aws_vpc.main</code>, <code>module.vpc.aws_subnet.public[0]</code>).</li>\n  <li><code>terraform state show &lt;addr&gt;</code>: Shows all attributes stored for a specific resource in readable HCL format.</li>\n</ul>\n<div class=\"tip\"><b>Key Question:</b> You want to stop managing an RDS database with Terraform but keep it intact in production. Which command do you use? <code>terraform state rm aws_db_instance.prod</code>. Never <code>terraform destroy</code>.</div>"
      },
      {
        "id": "tf-t-4-1",
        "d": 4,
        "title": "4.1 · Modules: Standard Structure, Sources (Registry, Git, Local), and Variables/Outputs",
        "html": "<h4>Standard Module Structure in Terraform</h4>\n<p>A module is a container of grouped resources used to encapsulate infrastructure logic, promote reuse, and enforce engineering standards:</p>\n<ul>\n  <li><b>Root Module:</b> The main working directory where Terraform CLI commands are run.</li>\n  <li><b>Child Module:</b> Any module called from within another module through a <code>module \"name\" { ... }</code> block.</li>\n  <li><b>Recommended canonical structure:</b>\n    <ul>\n      <li><code>main.tf</code>: Resource definitions and the module's main logic.</li>\n      <li><code>variables.tf</code>: Declaration of input variables (inputs) with types and descriptions.</li>\n      <li><code>outputs.tf</code>: Declaration of exposed values so the parent module can consume them.</li>\n      <li><code>README.md</code> and <code>LICENSE</code>: Mandatory documentation for publishing to Registries.</li>\n    </ul>\n  </li>\n</ul>\n\n<h4>Module Sources (Source Types)</h4>\n<table class=\"keytable\">\n<tr><th>Source Type</th><th>HCL Syntax Example</th><th>Versioning / Initialization Rule</th></tr>\n<tr><td><b>Terraform Registry</b></td><td><code>source = \"terraform-aws-modules/vpc/aws\"</code><br><code>version = \"~> 5.0\"</code></td><td>Supports the <code>version</code> argument with semantic constraints (SemVer). Requires <code>terraform init</code>.</td></tr>\n<tr><td><b>Local Path</b></td><td><code>source = \"./modules/security-groups\"</code></td><td>Does not support the <code>version</code> argument. Always reads directly from the local file system on disk.</td></tr>\n<tr><td><b>Git Repository</b></td><td><code>source = \"git::https://example.com/vpc.git?ref=v2.1.0\"</code></td><td>Allows pinning to specific branches, tags, or commits with the <code>?ref=</code> parameter.</td></tr>\n<tr><td><b>S3 / GCS Bucket</b></td><td><code>source = \"s3::https://s3.amazonaws.com/my-tf-modules/vpc.zip\"</code></td><td>Downloads and unpacks versioned module packages from object storage.</td></tr>\n</table>\n\n<h4>Data Flow: Inputs and Outputs</h4>\n<p>Child modules act as black boxes: the parent module passes values through <b>inputs</b> (arguments of the <code>module</code> block) and consumes the generated results using the syntax <code>module.&lt;MODULE_NAME&gt;.&lt;OUTPUT_NAME&gt;</code>.</p>\n<div class=\"tip\"><b>Strict Rule:</b> A parent module <b>cannot directly access</b> the internal attributes of a resource inside a child module (e.g., <code>aws_subnet.public.id</code>). The child module must explicitly expose it in its <code>outputs.tf</code>.</div>"
      },
      {
        "id": "tf-t-4-2",
        "d": 4,
        "title": "4.2 · Terraform Workspaces: Multi-Environment Management (CLI vs HCP Terraform)",
        "html": "<h4>Workspaces in the Terraform CLI (Open Source)</h4>\n<p>CLI Workspaces let you associate multiple independent state files with the same local HCL code directory:</p>\n<table class=\"keytable\">\n<tr><th>Command</th><th>Action Performed</th></tr>\n<tr><td><code>terraform workspace list</code></td><td>Shows the workspaces that exist in the backend (the active one is marked with an asterisk <code>*</code>).</td></tr>\n<tr><td><code>terraform workspace new dev</code></td><td>Creates a new workspace named <code>dev</code> and immediately switches to it.</td></tr>\n<tr><td><code>terraform workspace select prod</code></td><td>Switches the execution context to the existing <code>prod</code> workspace.</td></tr>\n<tr><td><code>terraform workspace show</code></td><td>Prints the name of the workspace currently active in the terminal session.</td></tr>\n</table>\n\n<h4>State Isolation and Interpolated Variable</h4>\n<ul>\n  <li><b>Isolated State:</b> Locally it is stored in <code>terraform.tfstate.d/&lt;workspace_name&gt;/terraform.tfstate</code>. In S3 it is located under the prefix <code>env:/&lt;workspace_name&gt;/...</code>.</li>\n  <li><b>Interpolation:</b> The expression <code>terraform.workspace</code> returns the name of the current workspace at runtime (e.g., <code>env = terraform.workspace</code>).</li>\n</ul>\n\n<h4>Limitations of CLI Workspaces vs. HCP Terraform Workspaces</h4>\n<table class=\"keytable\">\n<tr><th>Criterion</th><th>CLI Workspaces (OSS)</th><th>HCP Terraform Workspaces</th></tr>\n<tr><td><b>HCL Code</b></td><td>Same code for all workspaces.</td><td>Can be tied to different branches (<code>dev</code> vs <code>main</code>) or repositories.</td></tr>\n<tr><td><b>Variables and Credentials</b></td><td>Share the same <code>.tfvars</code> files unless passed through a manual flag.</td><td>Environment and Terraform variables natively segregated with RBAC and sensitive values.</td></tr>\n<tr><td><b>Permissions / Security</b></td><td>Same cloud-level access for whoever runs the CLI.</td><td>Granular permissions: who can plan vs. who can approve in production.</td></tr>\n</table>\n<div class=\"tip\"><b>Production Architecture Tip:</b> For environments with critical structural differences (e.g., Dev with 1 AZ and Prod with Multi-AZ and Direct Connect) or different cloud accounts, <b>separate directories</b> or <b>HCP Workspaces</b> are recommended instead of CLI workspaces.</div>"
      },
      {
        "id": "tf-t-5-1",
        "d": 5,
        "title": "5.1 · HCL: Data Types, Variable Precedence, Outputs, and the sensitive Attribute",
        "html": "<h4>Data Types in HashiCorp Configuration Language (HCL2)</h4>\n<p>Terraform has a static, expressive type system divided into primitive and complex types:</p>\n<table class=\"keytable\">\n<tr><th>Category</th><th>Data Types</th><th>HCL Example</th></tr>\n<tr><td><b>Primitives</b></td><td><code>string</code>, <code>number</code>, <code>bool</code></td><td><code>\"us-east-1\"</code>, <code>443</code>, <code>true</code></td></tr>\n<tr><td><b>Collections (Homogeneous)</b></td><td><code>list(&lt;type&gt;)</code>, <code>set(&lt;type&gt;)</code>, <code>map(&lt;type&gt;)</code></td><td><code>[\"a\", \"b\"]</code>, <code>tomap({\"env\" = \"prod\"})</code></td></tr>\n<tr><td><b>Structural (Heterogeneous)</b></td><td><code>tuple([...])</code>, <code>object({...})</code></td><td><code>object({ name = string, port = number })</code></td></tr>\n</table>\n\n<h4>Strict Variable Precedence Hierarchy (Highest to Lowest)</h4>\n<p>If the same variable name is defined in multiple sources, Terraform resolves the value following this unambiguous order:</p>\n<ol>\n  <li><b>CLI command-line flags:</b> <code>-var</code> or <code>-var-file</code> (Highest Priority).</li>\n  <li><b>*.auto.tfvars or *.auto.tfvars.json files:</b> Evaluated in alphabetical order of file name.</li>\n  <li><b>terraform.tfvars.json file:</b> Standard static JSON definitions.</li>\n  <li><b>terraform.tfvars file:</b> The most common default variables file.</li>\n  <li><b>System environment variables:</b> With the prefix <code>TF_VAR_&lt;variable_name&gt;</code> (e.g., <code>TF_VAR_region=\"eu-west-1\"</code>).</li>\n  <li><b>Default value:</b> The <code>default = ...</code> argument in the <code>variable</code> declaration (Lowest Priority).</li>\n</ol>\n\n<h4>The sensitive = true Attribute</h4>\n<ul>\n  <li>It can be declared on input variables and in <code>output</code> blocks.</li>\n  <li><b>Console Effect:</b> Masks the value in the output of <code>plan</code>, <code>apply</code>, and <code>output</code>, displaying <code>(sensitive value)</code>.</li>\n  <li><b>Crucial Security Warning:</b> The <code>sensitive</code> attribute <b>does NOT encrypt the value</b> in the <code>terraform.tfstate</code> file; the value is still stored in plain text inside the state JSON.</li>\n</ul>\n<div class=\"tip\"><b>Precedence Mnemonic:</b> The CLI overrides <code>auto</code> files, these override <code>terraform.tfvars</code>, which overrides <code>TF_VAR_*</code>, and finally the <code>default</code> in the code.</div>"
      },
      {
        "id": "tf-t-5-2",
        "d": 5,
        "title": "5.2 · Dynamic Expressions: count vs for_each, dynamic blocks, splat, and Built-in Functions",
        "html": "<h4>count vs. for_each: Identifier Stability</h4>\n<p>To create multiple instances of a resource or module, HCL offers two meta-arguments with radically different operational implications:</p>\n<table class=\"keytable\">\n<tr><th>Meta-argument</th><th>Required Input Type</th><th>Indexing in State</th><th>Behavior When Removing an Intermediate Element</th></tr>\n<tr><td><b>count</b></td><td>Integer (or <code>length(list)</code>).</td><td>Zero-based numeric index: <code>aws_subnet.sub[0]</code>, <code>[1]</code>, <code>[2]</code>.</td><td><b>Risk of cascading rebuilds:</b> If you remove index <code>[1]</code> from a list of 3, the old <code>[2]</code> becomes <code>[1]</code>; Terraform destroys and recreates the shifted resources.</td></tr>\n<tr><td><b>for_each</b></td><td><code>map</code> or <code>set(string)</code>.</td><td>Unique semantic key: <code>aws_subnet.sub[\"public-a\"]</code>, <code>[\"public-b\"]</code>.</td><td><b>100% Stable:</b> If you remove the key <code>\"public-a\"</code>, only that resource is destroyed. The rest remain unchanged.</td></tr>\n</table>\n\n<h4>Dynamic Blocks (dynamic blocks)</h4>\n<p>They let you generate repetitive nested blocks (such as <code>ingress</code> rules in security groups or tags) from lists or maps without duplicating code:</p>\n<pre><code>dynamic \"ingress\" {\n  for_each = var.service_ports\n  content {\n    from_port = ingress.value\n    to_port   = ingress.value\n    protocol  = \"tcp\"\n  }\n}</code></pre>\n\n<h4>Splat Expressions ([*]) and Key Functions</h4>\n<ul>\n  <li><b>Splat ([*]):</b> Gets a list with one attribute from all instances created with <code>count</code>: <code>aws_instance.server[*].id</code>.</li>\n  <li><b>Built-in Functions:</b> Terraform includes pure functions such as <code>lookup(map, key, default)</code>, <code>flatten(list)</code>, <code>merge(map1, map2)</code>, <code>can(expr)</code>, and <code>try(expr1, expr2)</code>. Terraform does not allow defining custom functions in HCL.</li>\n</ul>\n<div class=\"tip\"><b>Official Best Practice:</b> For collections of resources where the order may vary or elements may be removed in the future, always use <code>for_each</code> instead of <code>count</code>.</div>"
      },
      {
        "id": "tf-t-6-1",
        "d": 6,
        "title": "6.1 · HCP Terraform and Terraform Enterprise: Remote Runs, VCS Triggers, and Private Registry",
        "html": "<h4>Evolution: From Local Terraform CLI to a Managed Platform</h4>\n<p>HCP Terraform (formerly Terraform Cloud) is HashiCorp's managed SaaS platform for team collaboration on IaC, while Terraform Enterprise is the self-managed version (self-hosted / on-premises):</p>\n<table class=\"keytable\">\n<tr><th>Capability</th><th>Terraform CLI (Open Source)</th><th>HCP Terraform / Terraform Enterprise</th></tr>\n<tr><td><b>Execution Environment</b></td><td>Developer's local machine or generic runner in Jenkins / GitHub Actions.</td><td>Isolated, reproducible containers in HashiCorp's cloud infrastructure (or private agents).</td></tr>\n<tr><td><b>VCS Integration</b></td><td>Manual through pipeline scripts.</td><td>Native: runs <code>plan</code> automatically on Pull Requests and waits for approval on merges to the main branch.</td></tr>\n<tr><td><b>Variable Management</b></td><td>Local <code>.tfvars</code> files or host environment variables.</td><td>Workspaces with segregated variables, categorized as Terraform vs HCL vs Env and protected as <i>Write-Only</i>.</td></tr>\n<tr><td><b>Private Module Registry</b></td><td>Private Git repositories with custom URLs.</td><td>Integrated private registry with semantic versioning, an interactive documentation viewer, and self-service catalogs.</td></tr>\n</table>\n\n<h4>Run Execution Modes</h4>\n<ul>\n  <li><b>VCS-driven:</b> Triggered automatically by commits or pull requests in the repository (GitHub, GitLab, Bitbucket).</li>\n  <li><b>CLI-driven:</b> The developer runs <code>terraform plan</code> or <code>apply</code> in their local terminal, but the compute and the cloud API calls happen remotely in HCP Terraform.</li>\n  <li><b>API-driven:</b> Orchestrated programmatically from external pipelines or self-service platforms through the HCP Terraform REST API.</li>\n</ul>\n<div class=\"tip\"><b>Speculative Plans:</b> On GitHub pull requests, HCP Terraform generates speculative plans that show the impact of the change without altering the state or acquiring the production state lock.</div>"
      },
      {
        "id": "tf-t-6-2",
        "d": 6,
        "title": "6.2 · Governance and Security: Policy as Code with Sentinel / OPA and Secrets Management",
        "html": "<h4>Governance with Policy as Code: HashiCorp Sentinel and OPA</h4>\n<p>Sentinel is the governance engine embedded in HCP Terraform and Terraform Enterprise that evaluates logical policies between the <code>plan</code> phase and the <code>apply</code> phase:</p>\n<table class=\"keytable\">\n<tr><th>Enforcement Level</th><th>Behavior During Execution</th><th>Who Can Override It?</th></tr>\n<tr><td><b>Advisory</b></td><td>Emits an informational warning in the log if the rule fails, but <b>allows the apply to continue</b> without interruption.</td><td>No one required; it does not stop the run.</td></tr>\n<tr><td><b>Soft Mandatory</b></td><td>Blocks execution on failure, but <b>allows an authorized administrator to override the block</b> and proceed with the apply.</td><td>Users with <i>Policy Override</i> permissions in the organization.</td></tr>\n<tr><td><b>Hard Mandatory</b></td><td>Strictly and absolutely blocks the deployment. The block can <b>under no circumstances</b> be overridden.</td><td>No one. Requires fixing the HCL code or modifying the policy.</td></tr>\n</table>\n\n<h4>Credential Security: Dynamic Provider Credentials with OIDC</h4>\n<p>Storing long-lived secret keys (such as <code>AWS_SECRET_ACCESS_KEY</code>) in environment variables represents a critical attack vector:</p>\n<ul>\n  <li>HCP Terraform acts as a trusted OIDC (OpenID Connect) identity provider.</li>\n  <li>When a run starts, it exchanges a temporary cryptographic token with the cloud provider (AWS IAM, Azure AD, GCP Workload Identity).</li>\n  <li>The cloud issues short-lived temporary credentials (STS tokens) that expire as soon as the run finishes, completely eliminating static secrets.</li>\n</ul>\n<div class=\"tip\"><b>Policy Evaluation Timing:</b> Sentinel policies are evaluated <b>after the plan has been calculated</b> but <b>strictly before the apply is executed</b>.</div>"
      }
    ],
    "questions": [
      {
        "id": "tf-01",
        "d": 1,
        "t": "Declarative vs. Imperative in IaC",
        "q": "An operations team migrates from Bash scripts to Terraform. They need to update the instance type of 20 virtual machines from `t3.micro` to `t3.medium`. What is the main technical advantage of Terraform's declarative model over the imperative script in this operation?",
        "o": [
          "The imperative script automatically detects the entire attribute delta in the cloud without needing to query the inventory of active virtual machines in the cluster beforehand.",
          "Terraform only requires modifying the attribute in HCL; the engine calculates the desired state against the actual one and applies only the necessary mutation.",
          "The imperative script guarantees that if a machine fails midway through execution, all instances are rolled back to the original compute type.",
          "Terraform compiles the HCL code into procedural shell scripts that are executed sequentially over SSH on the target servers."
        ],
        "a": 1,
        "e": "In the declarative paradigm, the developer specifies the expected end state (`instance_type = \"t3.medium\"`) without programming the sequence of transition steps. Terraform compares the desired state with the stored actual state and executes only the API calls necessary to adjust the attribute."
      },
      {
        "id": "tf-02",
        "d": 1,
        "t": "Idempotency Principle in IaC",
        "q": "An engineer runs `terraform apply` on a production environment and all resources are created successfully. Immediately afterward, without modifying any `.tf` file or altering the infrastructure in the cloud console, they run `terraform apply` a second time. What technical result occurs?",
        "o": [
          "Terraform preventively recreates those resources whose provider does not support cryptographic integrity checks during the initial state refresh phase.",
          "Terraform generates a name conflict error in the cloud and locks the state file until an unlock command is run.",
          "Terraform reports zero changes because the desired state in the code matches the actual state in the cloud, leaving the infrastructure intact.",
          "Terraform runs the creation POST calls again, delegating to the provider's API the responsibility of ignoring duplicate resources."
        ],
        "a": 2,
        "e": "Idempotency guarantees that running the same configuration repeatedly produces the same result with no side effects. Since there are no discrepancies between the HCL code, the state file, and the actual cloud, Terraform determines that the delta is null and takes no action."
      },
      {
        "id": "tf-03",
        "d": 1,
        "t": "Terraform Core vs. Provider Plugins",
        "q": "During the resolution of a provisioning incident, the team analyzes Terraform's internal architecture. Which responsibility belongs exclusively to **Terraform Core** and NOT to the **Provider Plugins**?",
        "o": [
          "Interpret the HCL configuration, build the Directed Acyclic Graph (DAG) of dependencies, and manage the state file.",
          "Authenticate directly against the cloud provider's API endpoints and manage the refresh of OAuth tokens or temporary IAM session keys.",
          "Define the attribute schema of each cloud resource and translate CRUD operations into specific HTTP/REST requests.",
          "Determine which network or compute parameters are compatible across the geographic regions of a specific provider."
        ],
        "a": 0,
        "e": "Terraform Core is the cloud-agnostic binary responsible for parsing HCL files, evaluating expressions, building the dependency graph (DAG), and managing the state file (`terraform.tfstate`). Provider Plugins handle communication with each platform's specific APIs."
      },
      {
        "id": "tf-04",
        "d": 1,
        "t": "Dependency Lock File (.terraform.lock.hcl)",
        "q": "A developer adds a new provider to their code with the constraint `version = \"~> 5.0\"`. After running `terraform init`, they notice that the `.terraform.lock.hcl` file was created. What is the fundamental purpose of this file, and what best practice should the team follow regarding Git?",
        "o": [
          "Temporarily store the provider's compiled binaries in base64 format; it should be added to `.gitignore` so as not to bloat the repository.",
          "Store the provider's encrypted authentication credentials; it must be strictly excluded from any version control system.",
          "Record the remote backend's transactional locks to prevent concurrent runs; it should be shared only between development environments.",
          "Record the exact version and cryptographic hashes of the provider plugins used; it should be included in the Git repository."
        ],
        "a": 3,
        "e": "The `.terraform.lock.hcl` file locks provider versions and records their multi-platform cryptographic checksums. It must be stored in Git to ensure that all team members and CI/CD runners download exactly the same verified versions of the plugins."
      },
      {
        "id": "tf-05",
        "d": 1,
        "t": "Immutable vs. Mutable Infrastructure",
        "q": "A company wants to reduce configuration drift and errors during frequent deployments. The architecture adopts the principle of **immutable infrastructure** with Terraform and Packer. Which pattern correctly describes this approach?",
        "o": [
          "Apply software patches and update packages in place on existing servers using Terraform provisioners on every commit.",
          "Build complete machine images (AMIs) with Packer and use Terraform to replace existing servers with new instances.",
          "Configure dynamic configuration agents such as Chef or Puppet inside the instances to alter system files at runtime.",
          "Block the cloud's modification APIs to prevent Terraform from applying changes after the initial creation of the machines."
        ],
        "a": 1,
        "e": "Immutable infrastructure promotes not modifying servers in production. Instead, any software or configuration change is packaged into a new base image (e.g., an AMI built with Packer) and Terraform destroys the old instances, replacing them with new instances using the updated image."
      },
      {
        "id": "tf-06",
        "d": 1,
        "t": "Dependency Management and depends_on",
        "q": "Terraform automatically builds implicit dependencies based on attribute references between resources in the DAG. However, there are scenarios where the `depends_on` meta-argument must be used. In which TWO situations is it strictly necessary to define `depends_on`? (Choose 2 answers)",
        "o": [
          "When a resource needs permissions from an IAM role or associated policy, but its block does not reference any direct attribute of that policy.",
          "When two subnets in the same VPC are created in different Availability Zones and Terraform needs to serialize their creation for safety.",
          "When a compute application requires a database cluster to be ready, but the configuration does not pass connection strings between the two.",
          "When a static public IP address is assigned to an EC2 instance by directly referencing `aws_eip.ip.public_ip` in the instance."
        ],
        "a": [
          0,
          2
        ],
        "e": "Implicit dependencies are created when a resource reads an attribute of another (e.g., `subnet_id = aws_subnet.main.id`). If no such reference exists but there is a mandatory order at the service level (such as an IAM policy attached to a role before provisioning a cluster, or a DB required by an app with no attribute link), `depends_on` must be used."
      },
      {
        "id": "tf-07",
        "d": 1,
        "t": "Partial Failure During terraform apply",
        "q": "During the execution of a plan that includes 15 resources, the cloud provider times out on resource number 8 and `terraform apply` ends abruptly with an error code. What happens to the 7 resources created before the failure?",
        "o": [
          "They remain in the cloud and their identifiers are saved in the state; the failed resource is marked for remediation in the next apply.",
          "Terraform runs an immediate automatic rollback procedure, destroying the 7 previous resources to preserve the atomic consistency of the infrastructure plan.",
          "The state file is corrupted and reverts to its initial version, leaving the 7 resources orphaned with no way to manage them.",
          "The resources remain in the cloud but Terraform removes them from its internal graph, making it mandatory to run `terraform import`."
        ],
        "a": 0,
        "e": "Terraform updates the state file incrementally and transactionally as each resource is created. If a failure occurs in the middle of an apply, the successfully created resources are already recorded in the state. On the next run, Terraform will resume the plan, attempting to create or repair the pending resources."
      },
      {
        "id": "tf-08",
        "d": 1,
        "t": "Infrastructure Drift Detection",
        "q": "An administrator manually changes the size of an EBS disk from the AWS web console to resolve an urgent space alert. The next day, the development team runs `terraform plan`. How does Terraform handle this discrepancy known as **drift**?",
        "o": [
          "Terraform ignores the manual change and immediately overwrites the disk in the cloud without notifying the operator in the command output.",
          "Terraform immediately aborts the command reporting an integrity violation and requires manually syncing the state file with a JSON editor before continuing.",
          "Terraform queries the actual state in the cloud during the read phase, detects the difference from the HCL code, and proposes aligning the resource.",
          "Terraform automatically updates the source code in the local `.tf` files to reflect the new disk size without intervention."
        ],
        "a": 2,
        "e": "By default, `terraform plan` performs an automatic refresh, reading the actual state of resources in the cloud through the APIs. By comparing reality with the HCL file, it detects the discrepancy (drift) and generates a plan to restore or update the attribute as declared in the code."
      },
      {
        "id": "tf-09",
        "d": 2,
        "t": "Scope of the terraform init Command",
        "q": "A new engineer downloads a repository with Terraform code that uses AWS and Azure providers, as well as public modules from the Terraform Registry. What exact actions does `terraform init` perform in the working directory?",
        "o": [
          "It thoroughly verifies IAM credentials in the cloud, validates the subscription quota, and immediately deploys the network resources defined in the remote modules.",
          "It compiles the `.tf` files into intermediate binary language and acquires a permanent exclusive lock on the remote backend.",
          "It runs a syntax check of the code and compares the configuration with the resources deployed at the cloud providers.",
          "It initializes the state backend, downloads the required provider plugins, and downloads the source code of the child modules."
        ],
        "a": 3,
        "e": "`terraform init` prepares the local working directory. It configures the backend (local or remote), downloads provider plugins to `.terraform/providers/`, creates or updates `.terraform.lock.hcl`, and downloads child modules to `.terraform/modules/`. It does not validate cloud credentials or read remote resources."
      },
      {
        "id": "tf-10",
        "d": 2,
        "t": "Using terraform init -upgrade",
        "q": "The team maintains a project with providers declared with the constraint `version = \"~> 5.10\"`. Version `5.25.0` has been published in the Registry, but when running `terraform init`, the CLI keeps using version `5.10.1` recorded in `.terraform.lock.hcl`. Which command must be run to update the providers within the allowed constraint?",
        "o": [
          "Run the `terraform get -update` command to force a complete re-evaluation of the provider schemas and rebuild the dependency tree in the project.",
          "Run `terraform init -upgrade` to update providers and modules to the most recent version allowed by the constraints.",
          "Run `terraform refresh` to force Terraform Core to query the versions published in the official remote registry.",
          "Manually delete the `.git` folder and run `terraform validate` to release the pinned version in the local environment."
        ],
        "a": 1,
        "e": "The `terraform init -upgrade` command queries the provider and module registry, downloading the most recent version that satisfies the version constraints specified in the configuration and updating the `.terraform.lock.hcl` file accordingly."
      },
      {
        "id": "tf-11",
        "d": 2,
        "t": "Saved Plan Files (-out=tfplan)",
        "q": "In a production CI/CD architecture, the pipeline generates a plan with `terraform plan -out=tfplan` in the Pull Request phase and then runs `terraform apply tfplan` after approval from technical leadership. What technical guarantee does this approach provide compared to running a direct interactive `terraform apply`?",
        "o": [
          "It guarantees that the changes reviewed in the PR are applied with mathematical exactness without being affected by drift that occurred between the plan and the apply.",
          "It substantially speeds up execution because it skips communication with the provider plugins, delegating all requests to the web browser's cache.",
          "It allows manually editing the parameters of the binary `tfplan` plan with a word processor before authorizing the deployment.",
          "It eliminates the need to authenticate against the cloud provider since the `tfplan` file embeds signed temporary credentials."
        ],
        "a": 0,
        "e": "When applying a previously saved plan file (`terraform apply tfplan`), Terraform executes strictly the actions calculated at the moment the plan was generated. It does not perform a new refresh or recalculate the graph, preventing concurrent external changes (drift) from altering the modifications that were approved."
      },
      {
        "id": "tf-12",
        "d": 2,
        "t": "terraform plan -refresh-only",
        "q": "An engineer suspects that someone manually modified the tags and security groups of several EC2 instances from the AWS web console. They want to update the state file to reflect the cloud's reality without introducing changes to the physical resources. Which official command should they run?",
        "o": [
          "Run `terraform apply -target=aws_instance.all` to force the rewriting of resource identifiers in the remote backend.",
          "Run `terraform import` on all the instances to overwrite the conflicting attributes without requiring confirmation.",
          "Run `terraform plan -refresh-only` to inspect the drift and, after verifying the changes, apply it to update the state.",
          "Run `terraform state rm` on the affected resources so that Terraform rediscovers them on the next initialization."
        ],
        "a": 2,
        "e": "The `terraform plan -refresh-only` mode queries the cloud provider's APIs to detect any discrepancy (drift) and proposes updating only the state file to align it with reality. If the operator approves the result through `terraform apply -refresh-only`, the state is updated without modifying any resource in the cloud."
      },
      {
        "id": "tf-13",
        "d": 2,
        "t": "Risks of the -target Meta-argument / Flag",
        "q": "A developer in a hurry urgently needs to apply a change to a database and runs `terraform apply -target=aws_db_instance.primary`. Why does HashiCorp's official documentation strongly discourage the use of `-target` in routine workflows?",
        "o": [
          "Because it permanently invalidates the `.terraform.lock.hcl` file, forcing the plugins to be reinstalled on every team machine.",
          "Because it automatically destroys all resources that were not included in the `-target` parameter to maintain parity.",
          "Because it disables encryption of data at rest within the state file and cancels the DynamoDB mutual exclusion mechanism.",
          "Because it breaks the integrity of the DAG and can leave dependencies out of date or cause subsequent failures in the overall deployment."
        ],
        "a": 3,
        "e": "Using `-target` isolates a subset of the dependency graph while ignoring the rest. This can leave dependent resources in inconsistent states, hide necessary pending changes, or create drift in the global state. It should only be used in exceptional rescue circumstances or to resolve broken dependencies."
      },
      {
        "id": "tf-14",
        "d": 2,
        "t": "Controlled Infrastructure Destruction",
        "q": "At the end of a proof of concept in an ephemeral environment, the team needs to dismantle all the infrastructure created by the configuration. Before proceeding with the physical deletion, they want to carefully review which components will be purged. Which combination of commands lets you preview and execute the destruction safely?",
        "o": [
          "Run the `terraform state rm *` command to completely purge the inventory and then manually shut down the instances from the cloud provider's web console.",
          "Run `terraform plan -destroy` to preview the resources to be deleted and then `terraform destroy` to confirm the action.",
          "Run `terraform validate -destroy` to audit dependencies and then `terraform clean` to purge the objects.",
          "Run `terraform apply -refresh=false` selecting the interactive delete option at the CLI console prompt."
        ],
        "a": 1,
        "e": "`terraform plan -destroy` generates a speculative plan that shows exactly which resources will be deleted (marked with `-`). Afterward, `terraform destroy` (equivalent to `terraform apply -destroy`) requests interactive confirmation before deleting the physical resources at the provider."
      },
      {
        "id": "tf-15",
        "d": 2,
        "t": "Scope of terraform validate",
        "q": "A continuous integration pipeline runs `terraform validate` on every pull request to check code quality. What type of error can `terraform validate` detect with certainty?",
        "o": [
          "A resource block that omits a required argument or that assigns a string value to a number parameter.",
          "An S3 bucket name that is already being used by another AWS account globally across Amazon's infrastructure.",
          "An expired access key or missing permissions in the IAM policy assigned to the continuous integration runner's role.",
          "Temporary unavailability of the compute service in the configured availability zone of the selected region."
        ],
        "a": 0,
        "e": "`terraform validate` operates in a strictly local mode on the HCL syntax, the previously downloaded provider schemas, and the internal consistency of types and required arguments. It does not contact external APIs, so it cannot verify credentials, global name collisions, or resource quotas."
      },
      {
        "id": "tf-16",
        "d": 2,
        "t": "Canonical Formatting with terraform fmt in CI",
        "q": "You want to implement a step in the CI pipeline to verify that all `.tf` files comply with HashiCorp's official style guidelines, failing the build if any file is not formatted but without modifying the files in the workspace. Which TWO `terraform fmt` flags are appropriate for this purpose? (Choose 2 answers)",
        "o": [
          "The `-write=true` flag to save the changes automatically to the remote repository during job execution.",
          "The `-check` flag to return a non-zero exit code (exit code 1) if badly formatted files are detected.",
          "The `-fix-syntax` flag to correct indentation discrepancies and logical variable name errors in the code.",
          "The `-diff` flag to show formatting differences in unified diff style on the pipeline console's standard output."
        ],
        "a": [
          1,
          3
        ],
        "e": "In CI/CD pipelines, `terraform fmt -check` verifies whether the files comply with the canonical style, returning exit code 1 if it finds discrepancies (which stops the pipeline). Combined with `-diff`, it prints exactly which lines need correction in diff format without modifying the local files."
      },
      {
        "id": "tf-17",
        "d": 2,
        "t": "Troubleshooting with TF_LOG and TF_LOG_PATH",
        "q": "When running `terraform apply`, an Azure API call returns a generic `500 InternalServerError` with no details in the standard output. The engineer needs to examine the HTTP headers and the exact JSON payload of the request sent by the provider. Which environment configuration should they apply?",
        "o": [
          "Set `TF_DEBUG=1` and redirect the output buffer using `terraform apply --verbose-payload=all`.",
          "Set `TF_LOG=ERROR` in the terminal to filter secondary messages and show only the failed socket payloads.",
          "Set the environment variable `TF_LOG=TRACE` and optionally `TF_LOG_PATH=terraform.log` to capture all the traffic.",
          "Add the argument `log_level = \"verbose\"` inside the `provider \"azurerm\"` block in the main HCL configuration file."
        ],
        "a": 2,
        "e": "`TF_LOG` controls the logging detail level in Terraform Core and plugins. The `TRACE` level is the most verbose and includes full HTTP requests and responses. `TF_LOG_PATH` defines the path of the text file where these logs are persisted for detailed analysis."
      },
      {
        "id": "tf-18",
        "d": 2,
        "t": "Interactive Console terraform console",
        "q": "An engineer wants to verify the result of a network manipulation function `cidrsubnet(\"10.0.0.0/16\", 8, 2)` before using it in the creation of production subnets. What is the fastest and safest method Terraform offers for this evaluation?",
        "o": [
          "Run `terraform plan -target=network` and carefully review the calculation annotations in the dependency graph preview.",
          "Write a Python script invoking the provider's SDK to calculate the IP range and compare it with the state.",
          "Declare a temporary variable with the function in the `default` block and run `terraform validate` in the console.",
          "Run the `terraform console` command and enter the expression directly to see its live interactive evaluation."
        ],
        "a": 3,
        "e": "`terraform console` provides an interactive REPL (Read-Eval-Print Loop) environment that lets you evaluate any expression, built-in HCL function (such as `cidrsubnet`, `merge`, `jsonencode`), and query resource values in the state without applying changes to the infrastructure."
      },
      {
        "id": "tf-19",
        "d": 3,
        "t": "Purpose of the State File (terraform.tfstate)",
        "q": "An infrastructure team debates whether it is essential to keep the `terraform.tfstate` file or whether Terraform could dynamically query the cloud APIs on each run without needing to persist a local state. What is one of the irreplaceable functions that the state file fulfills?",
        "o": [
          "Map the logical resource names in HCL to the real physical cloud identifiers and record dependencies between them.",
          "Store the commit history and authentication credentials to allow automatic rollbacks to previous code versions.",
          "Compile the HCL code into CloudFormation or ARM templates before sending it to the hypervisors of public cloud providers.",
          "Ensure that network providers apply layer 7 firewall policies before virtual machines begin booting."
        ],
        "a": 0,
        "e": "The state file stores the unique association between abstract declarations in HCL (`aws_instance.app`) and the real physical IDs at the provider (`i-0a1234bc5678`), as well as metadata on dependencies, destruction order, and a cache of attributes that cannot be queried directly through the API."
      },
      {
        "id": "tf-20",
        "d": 3,
        "t": "State Locking and Concurrency",
        "q": "Two engineers simultaneously run `terraform apply` on the same directory and remote backend in Amazon S3. Which mechanism prevents both runs from colliding and corrupting the state file?",
        "o": [
          "Git commit synchronization that automatically cancels the pipeline run with the lower seniority on the branch.",
          "SSE-KMS asymmetric encryption that rejects simultaneous requests coming from different IP addresses in the same VPC.",
          "State Locking through a DynamoDB table that grants an exclusive lock to the first active run.",
          "An internal AWS load balancer that queues CLI requests and processes them serially according to the order of arrival at port 443."
        ],
        "a": 2,
        "e": "Terraform's `s3` backend integrates with Amazon DynamoDB to implement State Locking. When an operation acquires the lock (by writing a record with `LockID`), any other concurrent run is immediately rejected with an active lock error until the first one finishes."
      },
      {
        "id": "tf-21",
        "d": 3,
        "t": "Migration to a Remote Backend",
        "q": "A project started with local state (`local backend`). The team decides to migrate to a remote backend in Amazon S3 with DynamoDB to enable collaborative work. After configuring the `terraform { backend \"s3\" { ... } }` block, which command must be run to safely transfer the existing state to the cloud?",
        "o": [
          "Manually upload the `terraform.tfstate` file through the S3 web console and then run `terraform refresh` in the terminal.",
          "Run `terraform init -migrate-state` and interactively confirm copying the local state to the new remote backend.",
          "Run `terraform apply -backend-config=\"s3\"` to overwrite the remote configuration with the current local version.",
          "Run `terraform state push s3://mybucket/terraform.tfstate` to force synchronization without validating the lock table."
        ],
        "a": 1,
        "e": "`terraform init -migrate-state` detects the change in the `backend` block definition, requests interactive confirmation to copy the existing state to the new remote storage, and updates the local references without risk of data loss."
      },
      {
        "id": "tf-22",
        "d": 3,
        "t": "The terraform refresh Command",
        "q": "What specific technical action does the `terraform refresh` command perform (and the equivalent implicit refresh phase within `terraform plan` and `terraform apply`)?",
        "o": [
          "Reload all of the operating system's local environment variables and update the installed provider binaries to the most recent available version.",
          "Verify the validity of the cloud provider endpoint's TLS certificates and renew them if they are about to expire.",
          "Revert the physical infrastructure in the cloud to force it to match exactly what is defined in the local `.tf` files.",
          "Query the state of the managed resources through the provider APIs and update the state file with the real data."
        ],
        "a": 3,
        "e": "`terraform refresh` reads the current state of resources in the cloud through the providers' APIs and updates the state file to reflect any external changes (drift). It does not modify resources in the cloud or alter the HCL code."
      },
      {
        "id": "tf-23",
        "d": 3,
        "t": "Declarative Resource Import (import block)",
        "q": "In Terraform 1.5+, the company wants to bring an ALB load balancer created manually into the configuration versioned in Git without interrupting traffic. What is the modern, declarative method recommended by HashiCorp?",
        "o": [
          "Define an `import { to = aws_lb.main id = \"arn:aws:...\" }` block and optionally generate the code with `-generate-config-out`.",
          "Run `terraform apply -import=aws_lb.main` passing the ARN in the terminal session's environment variables.",
          "Create an empty resource in HCL and run `terraform refresh` so that Terraform autocompletes the network parameters automatically.",
          "Delete the load balancer in the cloud console and let Terraform rebuild it from scratch with a new logical address."
        ],
        "a": 0,
        "e": "Terraform 1.5 introduced the declarative `import { to = <RESOURCE_ADDR> id = \"<CLOUD_ID>\" }` blocks. Combined with `terraform plan -generate-config-out=generated.tf`, Terraform automatically generates the corresponding HCL code and plans the import in a versionable and predictable way."
      },
      {
        "id": "tf-24",
        "d": 3,
        "t": "The terraform state rm Command",
        "q": "A company decides to outsource the management of a critical MySQL database to a team of DBAs who will administer it manually. They want to remove the database from Terraform so that future `terraform destroy` or `apply` commands do not modify or destroy it, but the physical database must remain intact and operational. Which command meets this requirement?",
        "o": [
          "Run `terraform destroy -target=aws_db_instance.db`, making sure not to confirm the interactive prompt in the console.",
          "Run `terraform state rm aws_db_instance.db` to remove it from the state file while keeping the physical resource in AWS.",
          "Add the attribute `lifecycle { prevent_destroy = false }` and delete the database code block in `main.tf`.",
          "Modify the state manually by deleting the resource's JSON section with a plain text editor and recalculating the MD5 hash."
        ],
        "a": 1,
        "e": "`terraform state rm <resource_address>` removes the resource from the Terraform state file without invoking the cloud provider's API to delete it. As a result, the physical resource continues to exist in the cloud, but Terraform stops tracking and managing it."
      },
      {
        "id": "tf-25",
        "d": 3,
        "t": "Refactoring with the moved Block",
        "q": "During a code refactoring in Terraform 1.1+, the team moves an individual resource `aws_sqs_queue.orders` into a reusable module `module.billing.aws_sqs_queue.orders`. They want the pipeline, upon merging to the main branch, not to attempt to destroy the existing queue or create a new one. Which declarative solution must be included in the code?",
        "o": [
          "Run an imperative script with `terraform state rm` followed by `terraform import` in the continuous deployment pipeline.",
          "Configure `lifecycle { create_before_destroy = true }` inside the child module to force the coexistence of both message queues.",
          "Include a `moved { from = aws_sqs_queue.orders to = module.billing.aws_sqs_queue.orders }` block in the HCL configuration.",
          "Rename the identifier in HCL and pass the `-force-state-rewrite` flag during the next `apply` command."
        ],
        "a": 2,
        "e": "The `moved` block lets you document name refactorings or moves between modules directly in the HCL code. When running `terraform plan` or `apply`, Terraform recognizes the change in logical address and updates the state automatically without destroying or recreating the physical resource in the cloud."
      },
      {
        "id": "tf-26",
        "d": 3,
        "t": "Releasing Locks with force-unlock",
        "q": "During the execution of a deployment pipeline in GitLab CI, the runner suddenly shuts down due to a power outage in the datacenter while running `terraform apply`. Subsequent runs fail indicating that the state is locked with a `Lock Info Info: ID: 5c91a0...`. After verifying that the previous process has completely terminated, how should the operator proceed?",
        "o": [
          "Permanently delete the `terraform.tfstate` file from the S3 bucket and recreate all of the company's infrastructure from scratch with `terraform apply`.",
          "Wait 24 hours until the DynamoDB table automatically purges the lock record due to expiration.",
          "Change the workspace identifier in the code to bypass the concurrency check in subsequent runs.",
          "Run `terraform force-unlock 5c91a0...` to manually release the held lock after confirming there are no active processes."
        ],
        "a": 3,
        "e": "If a process is interrupted abnormally, the state lock can remain held in the backend. Once it has been verified that no other operator or pipeline is running changes, `terraform force-unlock <LOCK-ID>` is used to manually remove the lock and restore operability."
      },
      {
        "id": "tf-27",
        "d": 3,
        "t": "State Security and Sensitive Data",
        "q": "An engineer generates a random password using the resource `resource \"random_password\" \"db\" { length = 16 }` and passes it to the `password` argument of an `aws_db_instance` resource. Where is that password stored in clear text, and what security measure mitigates the risk?",
        "o": [
          "It is stored in clear text in `terraform.tfstate`; the risk is mitigated by protecting the remote backend with encryption (KMS) and strict RBAC permissions.",
          "It is automatically encrypted with HashiCorp's public key in the state; no additional storage measures are required.",
          "Terraform removes password values from the state file and only keeps them in volatile memory during the apply run.",
          "It is recorded exclusively in the `.terraform.lock.hcl` file protected by HMAC signatures from the operating system provider."
        ],
        "a": 0,
        "e": "Any value generated or consumed by a resource is recorded in plain text in the `terraform.tfstate` file, even if the variables or outputs have the `sensitive = true` attribute. Therefore, it is imperative to store the state in a secure remote backend with encryption at rest (SSE-KMS) and restricted access."
      },
      {
        "id": "tf-28",
        "d": 3,
        "t": "State Inspection Commands",
        "q": "A security auditor needs to inspect the current configuration and the identifiers of resources managed by Terraform in a production environment, ensuring that their commands do NOT make modifications or active reads in the cloud. Which TWO commands safely meet this criterion? (Choose 2 answers)",
        "o": [
          "Run `terraform state list` to get the complete list of resource addresses recorded in the current state.",
          "Run `terraform plan -refresh=true` to force the update of network attributes with the most recent information from the cloud.",
          "Run `terraform state show <resource_address>` to view in detail all the attributes and metadata of a specific resource.",
          "Run `terraform apply -auto-approve` in read-only mode to compare the cluster's cryptographic parameters."
        ],
        "a": [
          0,
          2
        ],
        "e": "`terraform state list` and `terraform state show` are pure inspection commands that operate exclusively on the data persisted in the local or remote state file, without sending modification requests to the cloud or making active queries to the external APIs."
      },
      {
        "id": "tf-29",
        "d": 4,
        "t": "Standard Module Structure",
        "q": "The platform architecture team designs a Terraform module to be consumed by multiple projects in the organization. According to HashiCorp's official best practices, what is the recommended minimal, canonical file structure?",
        "o": [
          "A single `deploy.tf` file containing all the logic, variables, providers, and automation scripts packaged in a tarball.",
          "Three fundamental files: `main.tf` (main resources), `variables.tf` (declared inputs), and `outputs.tf` (exposed values).",
          "A master `terraform.hcl` file accompanied by subdirectories for each environment named `dev/`, `stage/`, and `production/`.",
          "A precompiled binary file generated by `terraform package` accompanied by a metadata manifest file in XML format."
        ],
        "a": 1,
        "e": "HashiCorp's standard convention for modules stipulates: `main.tf` for resource definitions, `variables.tf` for required or optional input variables, `outputs.tf` for the values the module returns to the caller, and optionally `README.md` and `LICENSE`."
      },
      {
        "id": "tf-30",
        "d": 4,
        "t": "Module Sources (module source)",
        "q": "You want to call a network module hosted in a private Git repository, ensuring that production deployments always use exactly the version tagged `v2.4.1`. What is the correct syntax to declare this source in the `module` block?",
        "o": [
          "`source = \"git::https://example.com/network.git\"` defining `version = \"v2.4.1\"` in the block's lower argument.",
          "`source = \"./network\"` setting the environment variable `TF_MODULE_GIT_TAG=\"v2.4.1\"` in the host operating system.",
          "`source = \"git::https://example.com/network.git?ref=v2.4.1\"` using the `?ref=` query parameter in the repository URL.",
          "`source = \"registry::https://example.com/network.git#v2.4.1\"` invoking Git's binary package emulation protocol."
        ],
        "a": 2,
        "e": "When consuming modules directly from Git repositories, the HCL `version` argument is not supported (it only applies to Terraform Registries). Instead, you must specify the branch, tag, or commit hash using the `?ref=<tag>` query suffix at the end of the repository URL."
      },
      {
        "id": "tf-31",
        "d": 4,
        "t": "Communication Between Modules and Outputs",
        "q": "A root module calls a child module named `vpc` that creates several subnets. In the root module, an `aws_instance.app` resource needs to use the ID of the public subnet generated in the child module. How should this data flow be implemented in HCL?",
        "o": [
          "The root module can directly read `module.vpc.aws_subnet.public.id` without the child module needing to declare outputs.",
          "The child module must write the ID to an operating system environment variable so that the root module reads it with `env()`.",
          "The root module must query the global state database using the non-standard function `state_lookup(\"vpc_subnet\")`.",
          "The child module must expose the value in its `outputs.tf` file and the root module references it as `module.vpc.subnet_id`."
        ],
        "a": 3,
        "e": "Modules encapsulate their internal resources. A calling module cannot directly access the child module's resources; the child must explicitly define an `output \"subnet_id\" { value = aws_subnet.public.id }` block, allowing the parent to consume it through `module.vpc.subnet_id`."
      },
      {
        "id": "tf-32",
        "d": 4,
        "t": "Workspaces in the Terraform CLI",
        "q": "A developer uses Terraform CLI workspaces to switch between the `dev` and `prod` environments on the same code folder. They need the storage bucket name to include the current workspace name. How is this value referenced dynamically in HCL?",
        "o": [
          "Using the reserved expression `${terraform.workspace}` within the interpolation string in the corresponding attribute.",
          "Calling the built-in function `workspace()` passing as an argument the identifier of the backend configured in the main block.",
          "Reading the operating system environment variable through the interpolation `${var.TERRAFORM_WORKSPACE_NAME}`.",
          "Enabling the `-dynamic-workspace-interpolate` flag in the `terraform init` command before generating the execution plan."
        ],
        "a": 0,
        "e": "Terraform exposes the name of the currently selected workspace through the special reserved variable `terraform.workspace`. It can be used in HCL expressions, for example: `bucket = \"empresa-datos-${terraform.workspace}\"`."
      },
      {
        "id": "tf-33",
        "d": 4,
        "t": "Critical Limitations of CLI Workspaces",
        "q": "A banking organization manages two environments: `Development` (deployed in a non-production AWS account with 1 AZ and no dedicated encryption) and `Production` (in an audited AWS account, Multi-AZ, with Direct Connect and dedicated KMS keys). Why does HashiCorp's official documentation discourage using **CLI Workspaces** for this scenario?",
        "o": [
          "Because CLI Workspaces do not allow running `terraform plan` reliably if the total number of resources exceeds 50 objects in the state inventory.",
          "Because CLI Workspaces share the same HCL code and backend, making it unsafe and complex to manage different credentials and topologies.",
          "Because the `terraform workspace select` command automatically destroys the previous environment's resources before switching to the new one.",
          "Because remote backends on Amazon S3 and Azure Blob Storage prohibit by design the storage of multiple state files."
        ],
        "a": 1,
        "e": "CLI workspaces share exactly the same code base and the same backend configuration. For environments with critical topological differences, separate cloud accounts, or strict access controls, it is recommended to use independent directories or HCP Terraform Workspaces with segregated credentials and variables."
      },
      {
        "id": "tf-34",
        "d": 4,
        "t": "Lifecycle: create_before_destroy",
        "q": "A rule is updated in an AWS security group that requires forced replacement of the resource. By default, Terraform destroys the existing resource before creating the new one, which would cause a temporary traffic outage (downtime). Which directive of the `lifecycle` meta-block reverses this order to avoid the interruption?",
        "o": [
          "Configure the `lifecycle { zero_downtime = true }` directive to delegate the high-availability transition to the cloud provider's control plane.",
          "Configure `lifecycle { prevent_destroy = true }` to force the provider to modify the security group in place.",
          "Configure `lifecycle { create_before_destroy = true }` to provision the new resource before decommissioning the existing one.",
          "Configure `lifecycle { ignore_changes = [rules] }` to hide the discrepancy during the plan calculation phase."
        ],
        "a": 2,
        "e": "The `create_before_destroy = true` argument inside the `lifecycle` block alters Terraform's default behavior on replacements: it first creates the new resource, updates the associated dependencies, and only when it is operational destroys the old resource, ensuring service continuity."
      },
      {
        "id": "tf-35",
        "d": 4,
        "t": "Lifecycle: prevent_destroy",
        "q": "A team wants to protect a production database against catastrophic accidental deletions. They add `lifecycle { prevent_destroy = true }` to their `aws_db_instance` block. What technical effect occurs if an engineer accidentally runs `terraform destroy` on this project?",
        "o": [
          "Terraform requests an administrative authorization key securely sent to the project owner's mobile phone before destroying.",
          "Terraform destroys all resources except the database, assigning it a temporary public maintenance IP address.",
          "Terraform proceeds with the destruction but creates a cold backup snapshot in a secondary storage bucket.",
          "Terraform stops the command at the plan phase with an explicit error, preventing the destruction of the database and the rest of the plan."
        ],
        "a": 3,
        "e": "`prevent_destroy = true` acts as a plan-level safeguard. If any plan (including `terraform destroy` or a change that forces replacement of the resource) involves destroying a resource protected with this directive, Terraform immediately aborts the run with an error before making changes."
      },
      {
        "id": "tf-36",
        "d": 4,
        "t": "Lifecycle: ignore_changes",
        "q": "An autoscaling group in Azure (Virtual Machine Scale Set) has its capacity managed dynamically by an external metrics service based on demand. Every time the team runs `terraform apply`, Terraform detects drift and tries to reset the number of instances to the static HCL value. How do you instruct Terraform to ignore external changes to that attribute?",
        "o": [
          "Add the `lifecycle { ignore_changes = [instances_count] }` block inside the resource definition in the HCL file.",
          "Define the attribute as `instances_count = null` so that Terraform disables reconciliation in that code block.",
          "Run `terraform apply -skip-attribute=instances_count` in all automated runs of the deployment pipeline.",
          "Mark the corresponding variable with `sensitive = true` so that the engine skips the diff comparison in the plan."
        ],
        "a": 0,
        "e": "`lifecycle { ignore_changes = [ <ATTRIBUTE_NAMES> ] }` tells Terraform to ignore differences between the code and the actual state for the specified attributes. It is ideal for parameters managed by external dynamic processes such as autoscaling or automatic security tags."
      },
      {
        "id": "tf-37",
        "d": 4,
        "t": "Passing Multiple Providers to Modules (providers map)",
        "q": "A company deploys a multi-region architecture where a module needs to provision resources simultaneously in `us-east-1` (default) and `us-west-2` (secondary). How do you explicitly pass multiple configurations of the same provider from the root module to the child module?",
        "o": [
          "Duplicate the `module` block in two completely different local directories, setting a different geographic region variable in each.",
          "Declare an alias in the root module's provider and pass it to the child module through the argument `providers = { aws.west = aws.west }`.",
          "Set the environment variable `AWS_REGION_LIST=\"us-east-1,us-west-2\"` before running module initialization in the CLI.",
          "Call the `provider_override()` function inside the child module's resource blocks to switch the session at runtime."
        ],
        "a": 1,
        "e": "To pass alternate provider configurations (identified with `alias`) to a child module, the `providers` meta-argument is defined within the module call: `providers = { aws.alias_in_child = aws.alias_in_parent }`. The child module must declare the expected aliases in its `configuration_aliases` block."
      },
      {
        "id": "tf-38",
        "d": 4,
        "t": "Module Download and Versioning",
        "q": "When working with modules in Terraform, the team analyzes the download mechanisms into the hidden `.terraform/modules` directory and version control. Which TWO statements about module versioning are technically correct? (Choose 2 answers)",
        "o": [
          "Modules referenced with local relative paths (`./modules/vpc`) support version constraints through the `version` argument.",
          "The `version` argument in a `module` block is only supported when the source comes from a Terraform Registry (public or private).",
          "Terraform downloads remote modules during `terraform init` and stores them in the local `.terraform/modules` directory.",
          "Modifying the code inside `.terraform/modules/` is the official practice for updating third-party modules without altering the upstream."
        ],
        "a": [
          1,
          2
        ],
        "e": "The `version` argument can only be used with sources from Terraform Registries. In addition, Terraform downloads remote modules during `terraform init` and places them in `.terraform/modules/`. Local modules do not support the `version` argument, and files inside `.terraform/` should never be modified."
      },
      {
        "id": "tf-39",
        "d": 5,
        "t": "Variable Precedence Hierarchy",
        "q": "The value of the variable `db_port` is defined in multiple locations simultaneously: in `terraform.tfvars` (`db_port = 3306`), as the environment variable `TF_VAR_db_port=5432`, in a `prod.auto.tfvars` file (`db_port = 8443`), and on the command line through the flag `-var=\"db_port=9000\"`. Which value will take absolute priority during the Terraform run?",
        "o": [
          "The value `8443` defined in the `prod.auto.tfvars` file because files with the `auto` suffix override the console for security.",
          "The value `5432` defined in the environment variable `TF_VAR_db_port` because the operating system takes priority over local files.",
          "The value `9000` passed through the `-var` command-line flag because direct CLI arguments hold the highest precedence.",
          "The value `3306` defined in `terraform.tfvars` because it is the standard variable definition file recognized by HashiCorp."
        ],
        "a": 2,
        "e": "The official variable precedence order in Terraform (from highest to lowest) is: 1) CLI flags `-var` or `-var-file`, 2) `*.auto.tfvars` or `*.auto.tfvars.json` files, 3) `terraform.tfvars.json` file, 4) `terraform.tfvars` file, 5) `TF_VAR_*` environment variables, and 6) The `default` value in the variable declaration."
      },
      {
        "id": "tf-40",
        "d": 5,
        "t": "Complex Data Types in HCL",
        "q": "A developer needs to declare an input variable to represent the configuration of a web cluster, which must accept key-value pairs where the inner data types are heterogeneous: a string for the name, an integer for the port, and a boolean for SSL. Which HCL structural data type must be specified?",
        "o": [
          "`map(any)` allowing the Terraform engine to dynamically convert all inner values into base64-encoded text strings.",
          "`list(object)` forcing all of the element's inner attributes to be converted to the type with the largest memory footprint.",
          "`tuple([string, number, bool])` requiring that the data be accessed mandatorily through alphanumeric map keys.",
          "`object({ name = string, port = number, ssl_enabled = bool })` defining exactly the attribute names and their specific types."
        ],
        "a": 3,
        "e": "In HCL, a `map` requires all of its elements to be of the same type (homogeneous). When you need a structure with fixed keys and values of different types (string, number, bool), the correct structural data type is `object({...})`. A `tuple` is also heterogeneous but is indexed by sequential position, not by named keys."
      },
      {
        "id": "tf-41",
        "d": 5,
        "t": "The sensitive = true Attribute",
        "q": "An input variable for a third-party API token is declared with `sensitive = true` and referenced in a resource. What is Terraform's guaranteed behavior regarding this value, and what technical precaution must be maintained?",
        "o": [
          "The value is masked as `(sensitive value)` in the terminal logs, but remains visible in clear text in `terraform.tfstate`.",
          "Terraform encrypts the value with the AES-256 algorithm in the state file and requires a master password to decrypt it on every CLI run.",
          "The value is destroyed from memory immediately after the API call and is not recorded in any file on disk.",
          "The value is sent only through dedicated VPN tunnels, blocking any attempt to run from public networks."
        ],
        "a": 0,
        "e": "The `sensitive = true` attribute prevents Terraform from printing the sensitive value to the console during `plan`, `apply`, or when invoking `terraform output`. However, HashiCorp explicitly warns that the value **still exists in clear text inside the state file** (`terraform.tfstate`), so the state must be protected with encryption and RBAC."
      },
      {
        "id": "tf-42",
        "d": 5,
        "t": "count vs. for_each and Index Shifting",
        "q": "A team used `count = length(var.subnet_cidrs)` with a list of subnets `[\"10.0.1.0/24\", \"10.0.2.0/24\", \"10.0.3.0/24\"]` (indexes 0, 1, 2). In an update, they decide to remove the middle subnet `\"10.0.2.0/24\"`. Why does an unwanted destructive recreation occur, and how is it fixed?",
        "o": [
          "The provider's cloud API rejects lists with numeric gaps; it is fixed by running a Bash reindexing script before compiling the plan.",
          "The provider locks the subnet in a pending state; it is fixed by running `terraform refresh` to reconcile the routes.",
          "When index 1 is removed, element 2 becomes the new index 1, forcing the destruction and recreation of subnets; it is fixed with `for_each`.",
          "Terraform destroys all of the module's resources when the length of a `count` loop is altered; it is fixed by duplicating the code by hand."
        ],
        "a": 2,
        "e": "With `count`, resources are indexed numerically (`aws_subnet.sub[0]`, `[1]`, `[2]`). If the intermediate element is removed, the subsequent elements undergo an index shift (index 2 becomes 1), causing Terraform to modify or destroy and recreate the shifted resources. The solution is to use `for_each` with a map or set, associating each resource with a stable semantic key."
      },
      {
        "id": "tf-43",
        "d": 5,
        "t": "Dynamic Blocks (dynamic blocks)",
        "q": "You need to generate multiple `ingress` rules inside a security group resource (`aws_security_group`), where the number of ports to open varies by environment based on a list of variables. What is the correct HCL construct to generate these repetitive blocks without duplicating code?",
        "o": [
          "Use a C preprocessor `#include` macro inside a header file that is inserted into the `main.tf` file.",
          "Duplicate the `resource` block as many times as there are ports using the HCL2 `split_resource` meta-argument.",
          "Write an external Python script that renders a Jinja2 template before each run of the continuous integration pipeline.",
          "Declare a `dynamic \"ingress\"` block with a `for_each` argument and define the port attributes inside the `content` block."
        ],
        "a": 3,
        "e": "Dynamic blocks (`dynamic \"<block_type>\" { for_each = ... content { ... } }`) let you build repetitive nested blocks inside resources or data sources from a list, set, or map in HCL, accessing the values through `<block_type>.value`."
      },
      {
        "id": "tf-44",
        "d": 5,
        "t": "Built-in HCL Functions: lookup, try, and can",
        "q": "In an HCL configuration, a map of settings is queried that may not contain a specific key depending on the environment. The developer needs to get the key's value if it exists, or a predefined fallback value if it is not present, preventing Terraform from throwing an evaluation error. Which built-in function solves this case?",
        "o": [
          "The `default(map, key, fallback)` function, which suppresses read errors by assigning zero to the missing variables.",
          "The `lookup(map, key, default)` function, which looks up a key in a map and returns the default value if it is not found.",
          "The `find_or_create(map, key)` function, which automatically inserts the key into the state file with a null value.",
          "The `coalesce_key(map, key)` function, which merges local variable dictionaries with the system's global variables."
        ],
        "a": 1,
        "e": "`lookup(map, key, default)` looks up a key within a map. If the key exists, it returns its value; if it does not exist, it returns the value specified in the third argument `default` without interrupting execution with nonexistent-key errors."
      },
      {
        "id": "tf-45",
        "d": 5,
        "t": "Splat Expressions and for Comprehensions",
        "q": "A module creates a cluster of 5 web servers using `count = 5`. In the root module, you need to get a list with all the private IP addresses of the generated servers to configure them in a load balancer. What is the most concise syntax using Splat expressions?",
        "o": [
          "`aws_instance.web[*].private_ip` leveraging the Splat operator to project the attribute into a list of values.",
          "`aws_instance.web.all.private_ip` invoking the collective property of Terraform Core's shared resource engine.",
          "`[for i in 0..5 : aws_instance.web[i].private_ip]` assuming that the final index auto-increments non-inclusively.",
          "`get_list(aws_instance.web, \"private_ip\")` calling Terraform's state file introspection function."
        ],
        "a": 0,
        "e": "The Splat operator (`[*]`) lets you capture a specific attribute from a collection of resources created with `count` and return them as an ordered list: `aws_instance.web[*].private_ip`. It is equivalent to `[for s in aws_instance.web : s.private_ip]`, but more concise."
      },
      {
        "id": "tf-46",
        "d": 5,
        "t": "Custom Validations on Variables",
        "q": "An architecture team wants to ensure that engineers deploy infrastructure only in one of three corporately approved regions: `us-east-1`, `us-west-2`, or `eu-west-1`. They want Terraform to stop execution immediately during early validation if any other region is entered. How is this restriction implemented in HCL?",
        "o": [
          "Setting a rule in the `.terraform.lock.hcl` file with the cryptographic hash of the regions authorized by the organization.",
          "Adding an `assert(region in [\"us-east-1\", ...])` clause in the header of Terraform's providers file.",
          "Defining a `validation { condition = contains([...], var.region) error_message = \"...\" }` block inside the variable block.",
          "Installing a pre-commit plugin that intercepts keyboard calls before the Terraform binary runs."
        ],
        "a": 2,
        "e": "Terraform lets you add one or more `validation` blocks inside a `variable` declaration. It must include a `condition` argument that returns a boolean and an `error_message` argument that is printed if the condition evaluates to `false`, blocking execution early."
      },
      {
        "id": "tf-47",
        "d": 6,
        "t": "HCP Terraform: Remote Execution and Speculative Plans",
        "q": "An organization adopts HCP Terraform (formerly Terraform Cloud) and integrates its GitHub repositories through a VCS-connected workspace. A developer opens a Pull Request modifying network resources. What type of run does HCP Terraform automatically launch on that Pull Request, and what is its impact?",
        "o": [
          "An automatic production plan that acquires the exclusive lock on the state file and starts provisioning immediately in the real cloud.",
          "A Speculative Plan that shows the expected diff without modifying the state or acquiring the production lock.",
          "A local syntactic analysis that downloads the state to the developer's machine to evaluate the estimated cost of the solution.",
          "A test run on an ephemeral cluster that creates and destroys the resources in a temporary sandbox AWS account."
        ],
        "a": 1,
        "e": "In VCS-based flows in HCP Terraform, opening or updating a Pull Request automatically triggers a **Speculative Plan**. This plan is read-only: it shows reviewers exactly which changes would be applied if the PR were accepted, without modifying the real production state or locking the workspace."
      },
      {
        "id": "tf-48",
        "d": 6,
        "t": "Policy as Code with Sentinel: Severity Levels",
        "q": "In HCP Terraform, a Sentinel policy is configured to verify that no EC2 instance exceeds the `m5.large` size for budget reasons. The policy is configured with the **Soft Mandatory** enforcement level. During the execution of an urgent plan for a massive marketing event, the policy fails because the team requires an `m5.2xlarge`. What does this enforcement level allow?",
        "o": [
          "Execution continues without interruption because the Soft Mandatory level acts only as an informational message in the run logs.",
          "The system definitively cancels the plan and immediately destroys the workspace, forcing the infrastructure to be rebuilt from a corporate base template.",
          "Any developer on the project can click to skip the rule without needing special administrative credentials.",
          "Execution is preventively blocked, but a user with policy administrative privileges can override the failure and authorize the apply."
        ],
        "a": 3,
        "e": "Sentinel in HCP Terraform has three enforcement levels: `Advisory` (a warning that never stops the apply), `Soft Mandatory` (blocks execution but allows an authorized administrator to apply a manual override), and `Hard Mandatory` (a strict block that can under no circumstances be overridden)."
      },
      {
        "id": "tf-49",
        "d": 6,
        "t": "HCP Workspaces vs. CLI Workspaces",
        "q": "An architect must justify to the security leadership the adoption of HCP Terraform Workspaces instead of using the open-source CLI Workspaces. What is a fundamental architecture and security difference between the two models?",
        "o": [
          "HCP Workspaces isolate states, sensitive (write-only) variables, RBAC, and Git branches independently for each workspace.",
          "CLI Workspaces automatically encrypt the HCL code in local repositories while HCP stores all the code in accessible plain text.",
          "HCP Workspaces eliminate the state file by delegating persistence to the hypervisors' transactional databases.",
          "CLI Workspaces allow parallel execution of multiple concurrent apply commands on the same resource without locks."
        ],
        "a": 0,
        "e": "Unlike CLI workspaces (which are just isolated state folders over a single code base and set of local variables), HCP Terraform Workspaces are complete entities that encapsulate their own state file, run history, protected environment and Terraform variables, RBAC permissions, and linkage to specific VCS branches."
      },
      {
        "id": "tf-50",
        "d": 6,
        "t": "Dynamic Provider Credentials with OIDC",
        "q": "To comply with a strict security regulation, a company must eliminate all long-lived static access keys (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`) from its HCP Terraform pipelines. Which TWO technical benefits does implementing **Dynamic Provider Credentials** through OIDC offer in this scenario? (Choose 2 answers)",
        "o": [
          "It generates short-lived credentials with automatic rotation through the cryptographic exchange of a JWT token signed by HCP.",
          "It allows developers to access the AWS web console without needing accounts in the corporate identity provider.",
          "It reduces the attack surface and the risk of secret leakage by not storing permanent credentials in workspace variables.",
          "It increases the network and compute quotas assigned by default by the cloud provider upon detecting a federation validated by HashiCorp."
        ],
        "a": [
          0,
          2
        ],
        "e": "Dynamic Provider Credentials lets HCP Terraform act as an OIDC Identity Provider (IdP). When a run starts, HCP issues a signed JWT token that AWS STS exchanges for temporary credentials (lasting minutes). This eliminates the storage of long-lived static keys in variables and drastically mitigates the risk of credential leakage."
      }
    ],
    "why": {
      "tf-01": [
        "Imperative scripts do not calculate deltas automatically; they require manual programmatic logic to query the current state of each resource before acting.",
        null,
        "Traditional imperative scripts lack native transactionality; if they fail midway through execution, they leave the infrastructure in a partially modified state.",
        "Terraform does not generate shell scripts or interact over SSH by default; it communicates directly with the providers' APIs through REST/gRPC calls."
      ],
      "tf-02": [
        "Terraform does not recreate existing resources if their attributes match; the check is performed by comparing the current state with the code in the DAG.",
        "No name conflict or error is generated; the Terraform engine recognizes that the resources already exist and are under its management.",
        null,
        "Terraform does not send blind creation POST calls to providers; it only sends mutation calls when it detects differences in the plan."
      ],
      "tf-03": [
        null,
        "Authentication and credential management against the remote APIs is the direct responsibility of the corresponding Provider Plugin.",
        "The definition of resource schemas and the translation into REST calls belongs to the provider plugin, not to Terraform Core.",
        "The regional compatibility rules and parameter validation of cloud services are governed by the provider plugin."
      ],
      "tf-04": [
        "The lock file does not contain base64 binaries; it stores version metadata and SHA-256 hashes in readable HCL format.",
        "The lock file never contains authentication credentials or secrets; it only records provider constraints and checksums.",
        "Transactional concurrent-execution locks are handled by the Remote Backend (State Locking), not by the provider dependency file.",
        null
      ],
      "tf-05": [
        "Updating software in place on existing servers is the definition of mutable infrastructure, which fosters configuration drift.",
        null,
        "Using configuration management tools to modify live instances corresponds to the traditional mutable model.",
        "Immutability does not imply freezing the infrastructure without updates, but rather implementing changes through total replacement of components."
      ],
      "tf-06": [
        null,
        "Terraform creates independent subnets in parallel by default; forcing serialization without functional dependencies is unnecessary.",
        null,
        "Referencing `aws_eip.ip.public_ip` already generates an automatic implicit dependency in the graph, making the use of `depends_on` redundant."
      ],
      "tf-07": [
        null,
        "Terraform does not implement automatic rollbacks on apply failures; it keeps the completed resources and updates the state in real time.",
        "The state is not corrupted; the atomic persistence mechanism saves each confirmed resource to the backend immediately.",
        "The created resources are not orphaned and manual import is not required; they are already formally recorded in the state."
      ],
      "tf-08": [
        "Terraform never overwrites resources during `plan`; the `plan` command is strictly read-only and only projects future changes.",
        "Terraform does not lock up or require manually editing the state JSON; it is designed to reconcile discrepancies declaratively.",
        null,
        "Terraform never automatically modifies the developer's `.tf` source code files upon detecting drift in the infrastructure."
      ],
      "tf-09": [
        "The `init` command does not validate IAM credentials with calls to the cloud APIs nor provision infrastructure resources.",
        "Terraform does not compile HCL into intermediate binaries nor acquire permanent state locks during module initialization.",
        "Syntax checking is the job of `terraform validate`, and comparison with the cloud corresponds to `terraform plan`.",
        null
      ],
      "tf-10": [
        "`terraform get -update` only updates local or remote modules that are already initialized, but does not update provider plugins.",
        null,
        "`terraform refresh` queries the real infrastructure in the cloud to update the state; it does not manage plugin or module versions.",
        "Deleting the `.git` directory would destroy the project's version history and does not affect Terraform's provider download logic."
      ],
      "tf-11": [
        null,
        "Terraform still uses provider plugins to communicate with the cloud APIs; there is no relationship with browser caches.",
        "The `tfplan` file is a structured binary file; modifying it directly corrupts its cryptographic checksum and invalidates execution.",
        "The plan file does not embed cloud credentials; the environment where the `apply` runs must have valid permissions and credentials."
      ],
      "tf-12": [
        "The `-target` flag still tries to align the physical infrastructure with the `.tf` code, and may revert changes or recreate resources.",
        "`terraform import` is used for resources not previously managed by Terraform; it is not designed to update drift on existing resources.",
        null,
        "`terraform state rm` removes the resources from the state, causing Terraform to stop tracking them, which would worsen the discrepancy."
      ],
      "tf-13": [
        "The `-target` flag does not alter or invalidate the provider dependency lock file `.terraform.lock.hcl`.",
        "Terraform does not destroy unspecified resources; it simply excludes them from the execution plan for that one invocation.",
        "The remote backend's encryption and state locking mechanism keep working exactly the same with or without `-target`.",
        null
      ],
      "tf-14": [
        "`terraform state rm` only deletes records from the state but leaves the resources active in the cloud, incurring operating costs.",
        null,
        "The `terraform validate -destroy` and `terraform clean` commands or flags do not exist in the official Terraform CLI.",
        "The `-refresh=false` flag only skips the state query in the cloud; it does not start a destruction process or offer interactive deletion."
      ],
      "tf-15": [
        null,
        "A global S3 bucket name collision is only detected by querying the AWS API during plan or when attempting to create it in apply.",
        "IAM credentials and permissions are not evaluated by `validate`; the command runs successfully even without cloud credentials.",
        "Zone availability and compute quotas require active calls to the provider's APIs, outside the scope of `validate`."
      ],
      "tf-16": [
        "The `-write=true` flag would overwrite files on disk instead of acting in strict check mode for PR validation.",
        null,
        "The `-fix-syntax` flag does not exist in Terraform; `terraform fmt` only adjusts indentation and spacing, it does not fix logic or broken syntax.",
        null
      ],
      "tf-17": [
        "The `TF_DEBUG` variable and the `--verbose-payload` flag do not exist in the Terraform CLI specification.",
        "`TF_LOG=ERROR` would only log critical error events, hiding the HTTP requests and payloads that only appear at `TRACE`.",
        null,
        "Terraform's log level is not configured as an HCL argument inside the `provider` block; it is managed via environment variables."
      ],
      "tf-18": [
        "`terraform plan -target` requires having declared resources and performs network reads against the provider, making it much slower.",
        "The Python SDK may have subnet calculation implementations slightly different from HCL's native mathematical function.",
        "Complex HCL functions cannot always be evaluated in a variable's static `default` argument, and `validate` does not print results.",
        null
      ],
      "tf-19": [
        null,
        "Terraform state does not store commit history or manage authentication credentials; that is the role of Git and environment variables.",
        "Terraform does not convert HCL into CloudFormation or ARM templates; it uses its own plugins to call the provider's REST APIs.",
        "Firewall and network security policies are implemented by the provider's network resources, not by Terraform's state file."
      ],
      "tf-20": [
        "Git does not take part in the execution of the Terraform CLI or coordinate concurrency over cloud resources.",
        "SSE-KMS encryption protects data at rest, but it does not implement mutual exclusion logic or process concurrency control.",
        null,
        "No load balancer is involved; the Terraform client communicates directly with the S3 and DynamoDB APIs from the CLI."
      ],
      "tf-21": [
        "Manually uploading the file to S3 ignores local metadata synchronization and can cause discrepancies or loss of history.",
        null,
        "The `terraform apply` command does not accept the `-backend-config` flag; backend configuration is initialized exclusively with `init`.",
        "`terraform state push` is a low-level command that does not manage the backend configuration transition in a guided or safe manner."
      ],
      "tf-22": [
        "Refresh does not update environment variables or provider plugins; those tasks belong to the operating system and to `init -upgrade`.",
        "Terraform does not manage or renew TLS certificates of the public API endpoints of cloud providers.",
        "Refresh never modifies the infrastructure in the cloud; it is a read operation on the provider and a write operation on the state.",
        null
      ],
      "tf-23": [
        null,
        "The `-import` flag does not exist in `terraform apply`; the historical import was run with `terraform import <addr> <id>` via the CLI.",
        "`terraform refresh` only updates resources that are already recorded in the state; it does not discover or import unlinked resources.",
        "Destroying the load balancer would cause a total outage of the production service, violating the requirement not to affect traffic."
      ],
      "tf-24": [
        "`terraform destroy -target` would physically delete the database in AWS as soon as the operation completes, causing service loss.",
        null,
        "Deleting the block in `main.tf` without running `state rm` would cause Terraform to destroy the database in AWS on the next `terraform apply`.",
        "Manually editing the state file is dangerous, prone to format errors, and formally discouraged by HashiCorp."
      ],
      "tf-25": [
        "A `state rm` and `import` script is imperative, cumbersome to coordinate among multiple developers, and is not recorded in Git.",
        "`create_before_destroy` does not solve identifier renaming; it would still try to create a duplicate queue with the same name.",
        null,
        "The `-force-state-rewrite` flag does not exist in Terraform; the official, recommended mechanism is the declarative `moved` block."
      ],
      "tf-26": [
        "Deleting the state file from S3 would destroy the record of all the infrastructure, causing serious inconsistencies and orphaned resources.",
        "DynamoDB does not release Terraform locks automatically by expiration; the lock persists until it is explicitly released.",
        "Switching workspaces would create a new, empty environment, disconnecting the code from the actual state of the existing infrastructure.",
        null
      ],
      "tf-27": [
        null,
        "The state file does not apply native asymmetric encryption by default to individual fields; it is a structured plain-text JSON document.",
        "Terraform must persist all of the resources' attributes in the state to be able to compare drift and manage dependencies in the future.",
        "The `.terraform.lock.hcl` file only stores provider plugin versions and checksums; it never stores resource data or passwords."
      ],
      "tf-28": [
        null,
        "`terraform plan -refresh=true` performs active queries to the cloud APIs, violating the restriction against reads in the cloud.",
        null,
        "`terraform apply -auto-approve` tries to apply changes directly in the cloud without confirmation; it is not a read-only command."
      ],
      "tf-29": [
        "Grouping everything into a single `deploy.tf` file hinders readability and maintainability and breaks Terraform's standard module conventions.",
        null,
        "Having environment subdirectories inside the module itself couples reusable logic with the configuration of specific environments.",
        "Terraform does not use compiled binary files or XML manifests for the distribution and packaging of modules in its ecosystem."
      ],
      "tf-30": [
        "The `version` argument in module blocks is only supported with Terraform Registry sources, not with generic Git repositories.",
        "Local paths (`./network`) do not read from remote Git repositories or recognize arbitrary environment variables for versioning.",
        null,
        "The `registry::` scheme with `#` is not valid module source syntax in Terraform; the standard prefix is `git::` with `?ref=`."
      ],
      "tf-31": [
        "Terraform prohibits direct access to the internal resources of a child module; it only allows access to values exported as outputs.",
        "HCL does not use operating system environment variables to exchange data between modules during graph resolution.",
        "The `state_lookup()` function does not exist in HCL; data flow between modules is modeled cleanly and declaratively through outputs.",
        null
      ],
      "tf-32": [
        null,
        "There is no `workspace()` function in HCL; the official reference is the language context identifier `terraform.workspace`.",
        "It is not accessed as an ordinary variable `var.TERRAFORM_WORKSPACE_NAME`; it belongs to the engine's global `terraform` object.",
        "There is no `-dynamic-workspace-interpolate` flag in the Terraform CLI specification."
      ],
      "tf-33": [
        "CLI workspaces have no arbitrary limit of 50 resources; the restriction lies in their security model and topology.",
        null,
        "`terraform workspace select` only changes the pointer to the active state file; it never destroys physical resources in the cloud.",
        "Backends such as S3 fully support multiple workspaces by creating prefixes in the bucket such as `env:/<workspace_name>/`."
      ],
      "tf-34": [
        "The `zero_downtime` argument does not exist in HCL syntax or in Terraform's resource lifecycle blocks.",
        "`prevent_destroy` blocks the plan if it requires destruction, but it does not reverse the order of resource creation and destruction.",
        null,
        "`ignore_changes` skips detecting modifications to specific attributes, preventing the change from being applied in the cloud."
      ],
      "tf-35": [
        "Terraform CLI has no phone verification or interactive multifactor authentication mechanisms at destroy runtime.",
        "Terraform does not partially destroy the rest of the resources; the `prevent_destroy` error blocks the entire destruction plan.",
        "The `prevent_destroy` directive does not generate automatic backup snapshots; its sole function is to reject the delete order.",
        null
      ],
      "tf-36": [
        null,
        "Assigning `null` to a required numeric argument in a resource usually causes a schema validation error in the provider.",
        "The `-skip-attribute` flag does not exist in the Terraform CLI; suppression of attribute changes is defined in the `lifecycle` block.",
        "`sensitive = true` only masks values in the terminal's visual output; it does not alter drift detection logic or prevent updates."
      ],
      "tf-37": [
        "Duplicating entire directories introduces massive code redundancy and makes uniform maintenance of the infrastructure difficult.",
        null,
        "Environment variables cannot configure concurrent provider aliases in Terraform for multi-region distribution in a single plan.",
        "The `provider_override()` function does not exist in HCL; provider assignment is declarative through blocks and formal aliases."
      ],
      "tf-38": [
        "Modules with local paths do not support the `version` argument; they directly reflect the state of the files on the host's disk.",
        null,
        null,
        "Editing files in `.terraform/modules/` is a dangerous antipattern; any new `terraform init` overwrites the changes without warning."
      ],
      "tf-39": [
        "`*.auto.tfvars` files have high priority and are loaded automatically, but they are overridden by explicit flags passed on the CLI.",
        "`TF_VAR_*` environment variables have lower precedence than `.tfvars` files and than flags passed on the command line.",
        null,
        "The `terraform.tfvars` file has intermediate precedence; it is overridden by both `auto.tfvars` files and the CLI."
      ],
      "tf-40": [
        "A `map` requires type homogeneity; if numbers and strings are mixed, HCL will try to coerce all values to the most generic type (string).",
        "A list of objects is a collection of multiple instances, whereas here a single structural configuration object needs to be typed.",
        "A `tuple` is a sequence numerically indexed by fixed position (0, 1, 2); it does not assign attribute names to its elements.",
        null
      ],
      "tf-41": [
        null,
        "Terraform does not selectively encrypt sensitive attributes with master passwords inside the state JSON; the JSON is plain text.",
        "Terraform must record the values in the state to be able to detect drift and evaluate future changes; the value is not destroyed from disk.",
        "The `sensitive` attribute does not control the network path or require VPN tunnels; it is purely a presentation and masking directive."
      ],
      "tf-42": [
        "The provider's API does not evaluate HCL indexes; the problem stems entirely from Terraform's positional indexing model.",
        "The block is not caused by the cloud API and is not fixed by `refresh`; the diff is generated by the HCL engine when it compares addresses by index.",
        null,
        "Terraform does not destroy all of the module's resources; it only destroys and recreates the resources whose numeric indexes have changed position."
      ],
      "tf-43": [
        "Terraform and HCL do not support C preprocessor macros or `#include` directives; their design is native and declarative.",
        "There is no `split_resource` meta-argument in Terraform; duplicating resource blocks produces verbose code that is hard to maintain.",
        "Although Jinja2 templates can be used externally, they are not Terraform's native solution; `dynamic` solves this in a standard way.",
        null
      ],
      "tf-44": [
        "The `default()` function does not exist in HCL; a map's default value is handled with `lookup()` or the `try()` expression.",
        null,
        "The `find_or_create()` function does not exist in HCL; Terraform functions are pure functions that never modify state or insert data.",
        "The `coalesce_key()` function does not exist in HCL; `merge()` is used to combine maps and `coalesce()` is used to select non-null values."
      ],
      "tf-45": [
        null,
        "There is no `.all` property on Terraform resources; trying to access one this way produces an undefined attribute error.",
        "The `0..5` loop would try to access 6 elements (indexes 0, 1, 2, 3, 4, 5) when, with `count = 5`, only indexes 0 through 4 exist.",
        "The `get_list()` function does not exist in HCL; attribute projection is done with splat expressions or `for` expressions."
      ],
      "tf-46": [
        "The `.terraform.lock.hcl` file only manages provider plugin versions and checksums; it does not evaluate business rules on variables.",
        "There is no `assert` syntax in provider blocks; variable validations are defined inside the variable's own block in `variables.tf`.",
        null,
        "Pre-commit hooks are tools external to the Terraform CLI; they are not part of the HCL language and do not guarantee validation in CI/CD."
      ],
      "tf-47": [
        "HCP Terraform does not run an automatic apply on Pull Requests; changes are only applied when the PR is approved and merged to the main branch.",
        null,
        "HCP Terraform runs the plan in its own remote cloud containers; it never downloads the state file to local workstations in this workflow.",
        "Speculative plans do not provision resources in the real cloud; they are simulations based on reading APIs and computing diffs."
      ],
      "tf-48": [
        "The level that acts only as an informational message without stopping the apply is `Advisory`, not `Soft Mandatory`.",
        "Sentinel never destroys workspaces or infrastructure when a policy fails; it only blocks the transition to the apply.",
        "With `Soft Mandatory`, standard users cannot override the block; roles with explicit Policy Override permissions in the organization are required.",
        null
      ],
      "tf-49": [
        null,
        "CLI workspaces do not encrypt local HCL code; the source code resides in plain text on the client's disk and repositories.",
        "HCP Terraform still uses the state file; it stores it in a managed, encrypted way with strict transactional control.",
        "Concurrent parallel execution without locking would cause data corruption; exclusive locking is a fundamental safety requirement."
      ],
      "tf-50": [
        null,
        "OIDC in HCP Terraform authenticates only Terraform runs with the cloud API; it does not replace SSO access for human users.",
        null,
        "OIDC federated authentication does not increase cloud service quotas; it only securely authenticates API calls."
      ]
    },
    "glossary": [
      {
        "term": "Idempotency",
        "cat": "IaC Core",
        "d": 1,
        "def": "A property that guarantees that applying a configuration multiple times produces an identical final infrastructure state with no unintended side effects.",
        "tip": "If you run `terraform apply` with no code changes or drift, Terraform finishes with zero changes and exit code 0."
      },
      {
        "term": "Declarative Approach",
        "cat": "IaC Core",
        "d": 1,
        "def": "An IaC paradigm in which the desired end state of the infrastructure is described in HCL, leaving the engine to compute the transition actions.",
        "tip": "Unlike imperative scripts (Bash, Python), Terraform takes care of the what instead of the how."
      },
      {
        "term": "Terraform Core",
        "cat": "IaC Core",
        "d": 1,
        "def": "A static binary compiled in Go that is responsible for processing the HCL configuration, building the dependency DAG, and managing the state file.",
        "tip": "Core is cloud-agnostic; it delegates communication with remote APIs to provider plugins via gRPC."
      },
      {
        "term": "Provider Plugin",
        "cat": "IaC Core",
        "d": 1,
        "def": "A standalone executable binary that translates abstract Terraform Core calls into actual HTTP/REST requests against provider APIs.",
        "tip": "They are downloaded automatically during `terraform init` and stored locally in the hidden `.terraform/providers/` directory."
      },
      {
        "term": "Dependency Graph (DAG)",
        "cat": "IaC Core",
        "d": 1,
        "def": "A Directed Acyclic Graph generated by Terraform Core to model precedence relationships between resources and maximize parallel creation.",
        "tip": "You can inspect it visually by exporting it with `terraform graph | dot -Tsvg > graph.svg`."
      },
      {
        "term": "terraform init",
        "cat": "CLI Workflow",
        "d": 2,
        "def": "The initial command that initializes the backend, downloads the required provider plugins, and downloads the referenced child modules.",
        "tip": "It must be run after cloning a repository, changing backends, or adding a new provider or module."
      },
      {
        "term": "Execution Plan (tfplan)",
        "cat": "CLI Workflow",
        "d": 2,
        "def": "A predictive representation computed by `terraform plan` that details the resources that will be created, updated, or destroyed in the cloud.",
        "tip": "In CI/CD pipelines, save the plan with `-out=tfplan` and apply it with `terraform apply tfplan` to avoid discrepancies caused by drift."
      },
      {
        "term": "terraform plan -refresh-only",
        "cat": "CLI Workflow",
        "d": 2,
        "def": "An execution mode that queries the cloud infrastructure to update the local state according to drift without proposing changes to resources.",
        "tip": "It safely replaces the deprecated `terraform refresh` command, showing a confirmation before modifying the state."
      },
      {
        "term": "terraform validate",
        "cat": "CLI Workflow",
        "d": 2,
        "def": "A local static analysis command that checks HCL2 syntax, type consistency, and the existence of required arguments in blocks.",
        "tip": "It does not contact cloud APIs or validate credentials or quotas; it only requires that `init` has downloaded the provider schemas."
      },
      {
        "term": "TF_LOG and TF_LOG_PATH",
        "cat": "CLI Workflow",
        "d": 2,
        "def": "Environment variables to enable CLI debug logging (levels: TRACE, DEBUG, INFO, WARN, ERROR) and redirect the output to a file.",
        "tip": "`TF_LOG=TRACE` shows the complete HTTP REST requests and responses exchanged with the cloud APIs."
      },
      {
        "term": "terraform.tfstate",
        "cat": "State & Locks",
        "d": 3,
        "def": "The central JSON file that links the resources declared in HCL code to their real identifiers and metadata in the cloud infrastructure.",
        "tip": "It must never be edited by hand; incorrectly altering it corrupts checksums and can cause accidental destruction of resources."
      },
      {
        "term": "State Locking",
        "cat": "State & Locks",
        "d": 3,
        "def": "A mutual exclusion mechanism that prevents multiple users or pipelines from modifying the same state concurrently and causing corruption.",
        "tip": "Backends such as S3 require a DynamoDB table with the `LockID` key; Azure Storage uses Blob Leases and GCS uses native preconditions."
      },
      {
        "term": "Remote Backend (S3 + DynamoDB)",
        "cat": "State & Locks",
        "d": 3,
        "def": "An HCL configuration that stores the state file in a shared, encrypted S3 bucket with transactional locking support via DynamoDB.",
        "tip": "To migrate from local to remote, run `terraform init -migrate-state` and answer `yes` to the transfer prompt."
      },
      {
        "term": "terraform import",
        "cat": "State & Locks",
        "d": 3,
        "def": "A mechanism for bringing pre-existing infrastructure not created with Terraform into the state file without destroying or modifying it in the cloud.",
        "tip": "In Terraform 1.5+, the declarative `import { to = ... id = ... }` block is preferred, together with the `-generate-config-out` flag."
      },
      {
        "term": "moved Block",
        "cat": "State & Locks",
        "d": 3,
        "def": "An HCL declaration (`moved { from = ... to = ... }`) introduced in Terraform 1.1 that records refactoring of resource or module names.",
        "tip": "It lets you rename resources or extract them into modules in Git without Terraform trying to destroy the existing resource to create a new one."
      },
      {
        "term": "Root Module vs Child Module",
        "cat": "Modules",
        "d": 4,
        "def": "The Root Module is the working directory where CLI commands are run; a Child Module is any module called from another HCL block.",
        "tip": "Resources inside a Child Module are encapsulated; the parent module can only interact through input variables and outputs."
      },
      {
        "term": "Terraform Registry",
        "cat": "Modules",
        "d": 4,
        "def": "The central public (registry.terraform.io) and private repository of modules and providers maintained by HashiCorp and the open source community.",
        "tip": "Modules published in the public Registry must have public GitHub repositories with names in the format `terraform-<PROVIDER>-<NAME>`."
      },
      {
        "term": "CLI Workspaces",
        "cat": "Modules",
        "d": 4,
        "def": "A CLI feature that lets you maintain multiple isolated state files over the same HCL code directory using `terraform.workspace`.",
        "tip": "Suitable for simple parameter variations; not recommended for environments with topological differences or critical credential differences."
      },
      {
        "term": "create_before_destroy",
        "cat": "Modules",
        "d": 4,
        "def": "A `lifecycle` meta-argument that reverses the standard replacement order, provisioning the new resource first before removing the old one.",
        "tip": "Essential for zero-downtime updates of load balancers, SSL certificates, or auto scaling groups."
      },
      {
        "term": "prevent_destroy",
        "cat": "Modules",
        "d": 4,
        "def": "A `lifecycle` meta-argument safeguard that rejects any Terraform plan that would delete a critical resource.",
        "tip": "It prevents disasters in production databases; it must be explicitly removed from the HCL before an intentional destroy can be run."
      },
      {
        "term": "Variable Precedence",
        "cat": "HCL & Vars",
        "d": 5,
        "def": "The strict hierarchical order in which Terraform evaluates variables: CLI flags > `*.auto.tfvars` > `terraform.tfvars` > `TF_VAR_*` > `default`.",
        "tip": "Values passed explicitly in the terminal with `-var` or `-var-file` take absolute priority over any file on disk."
      },
      {
        "term": "sensitive Attribute",
        "cat": "HCL & Vars",
        "d": 5,
        "def": "A boolean parameter (`sensitive = true`) on variables and outputs that hides values in terminal output to prevent accidental leakage in logs.",
        "tip": "Warning: The value remains fully visible in plain text inside the `terraform.tfstate` file."
      },
      {
        "term": "count vs for_each",
        "cat": "HCL & Vars",
        "d": 5,
        "def": "`count` indexes resources numerically (`[0]`), whereas `for_each` uses map or set keys (`[\"item\"]`), avoiding chain replacements.",
        "tip": "If a middle element is removed from a list with `count`, Terraform recreates the subsequent elements. With `for_each`, only the deleted element is destroyed."
      },
      {
        "term": "HCP Terraform (Remote Runs)",
        "cat": "HCP & Policy",
        "d": 6,
        "def": "A SaaS platform that runs Terraform workflows in managed remote containers, decoupling execution from local workstations.",
        "tip": "It provides native VCS integration to launch automatic speculative plans on every GitHub or GitLab Pull Request."
      },
      {
        "term": "Sentinel Policy as Code",
        "cat": "HCP & Policy",
        "d": 6,
        "def": "HashiCorp's governance framework that validates business, security, and cost rules against the plan before allowing the apply to run.",
        "tip": "It has three severity levels: `Advisory` (warning), `Soft Mandatory` (block with admin override), and `Hard Mandatory` (strict block)."
      }
    ]
  };
})(window);
