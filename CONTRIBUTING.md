# Contributing to Cloud & SRE Exam Arena

Thank you for your interest in contributing to **Cloud & SRE Exam Arena**! Whether you are submitting a new certification track, adding production incident scenarios, fixing typos, or polishing domain study guides, your help is welcome.

---

## Code of Conduct & Contribution Philosophy

Exam Arena is built on **active recall** and **deliberate practice**:
1. **High Technical Accuracy:** Questions must reflect authentic, realistic production engineering or certification scenarios—not trivial trivia or trick wording.
2. **First-Class Distractor Rationale (`why`):** Every incorrect answer choice must include a clear explanation of *why* it fails (e.g., causes downtime, introduces security holes, breaks compatibility, or violates limits).
3. **Zero Build Complexity:** The codebase is written in pure, vanilla JavaScript (ES5/ES6 compatible), standard CSS3, and semantic HTML5. No build tools, transpilers, or bundlers are required.

---

## Adding a New Provider or Exam Track

To contribute a new track (e.g., CKA, CompTIA Security+, Terraform Associate, etc.), follow these steps:

### 1. Create the Track Data File
Create a new folder and file under `data/<track-name>/exam.js`. For example:
```
data/k8s/exam.js
```

### 2. Implement the `window.EXAMS['<id>']` Schema
Your file should register its exam object into the global `window.EXAMS` registry wrapped in an IIFE:

```js
(function (w) {
  'use strict';

  w.EXAMS = w.EXAMS || {};
  w.EXAMS['k8s-cka'] = {
    // Unique track identifier (URL hash friendly, lowercase with hyphens)
    id: 'k8s-cka',

    // LocalStorage tracking key for @fabianimv/study-tracker
    appId: 'k8s-cka',

    // Provider or authority
    provider: 'CNCF & Linux Foundation',

    // Short label for badges and navigation buttons
    badge: 'K8s · CKA',

    // Emoji icon representing the track
    icon: '☸️',

    // Hex brand color used for accents and progress bars
    color: '#326ce5',

    // Full display title
    title: 'Certified Kubernetes Administrator (CKA)',

    // Short subtitle summarizing the track
    subtitle: 'Cluster Architecture, Installation, Workloads & Scheduling, Storage, Services & Networking, and Troubleshooting.',

    // Passing score reference percentage (integer between 0 and 100)
    passingScore: 66,

    // Official domains with percentage weights
    domains: {
      1: 'Cluster Architecture, Installation & Configuration (25 %)',
      2: 'Workloads & Scheduling (15 %)',
      3: 'Services & Networking (20 %)',
      4: 'Storage (10 %)',
      5: 'Troubleshooting (30 %)'
    },

    // Short domain labels used for compact KPI charts and progress filters
    shortDomains: {
      1: 'Cluster Arch & Config',
      2: 'Workloads & Scheduling',
      3: 'Services & Networking',
      4: 'Storage',
      5: 'Troubleshooting'
    },

    // Domain study guides and topic reference notes
    topics: [
      {
        id: 't-1-1',
        d: 1, // Domain index
        title: '1.1 · Control Plane High Availability & etcd Backups',
        html: '<p>Key concepts, troubleshooting steps, commands, and tables...</p>'
      }
    ],

    // Questions and simulation scenarios
    questions: [
      {
        id: 'cka-01',
        d: 3, // Domain number matching key in domains object
        t: 'Ingress & CoreDNS', // Sub-topic badge
        q: 'A newly deployed Pod cannot resolve internal cluster DNS names, but external IP requests succeed. Which step should you perform first to isolate the issue?',
        o: [
          'Restart the entire worker node hosting the application Pod.',
          'Verify CoreDNS Pod status and inspect logs using kubectl logs -n kube-system -l k8s-app=kube-dns.',
          'Edit the kube-apiserver manifest to increase timeout flags.',
          'Re-apply the CNI daemonset across all nodes.'
        ],
        a: 1, // 0-based index of correct answer (or array of indices for multi-select [1, 3])
        e: 'Inspect CoreDNS first. Since external IP connectivity works, node networking and egress are intact; internal DNS resolution failures point to CoreDNS or kube-dns service endpoints.'
      }
    ],

    // Deep diagnostic feedback per option (Indexed by question id)
    why: {
      'cka-01': [
        'Rebooting the node causes unneeded service disruption and does not address the DNS root cause.',
        null, // Correct answer: set to null or omit
        'The kube-apiserver timeout is unrelated to in-cluster Pod DNS resolution handled by CoreDNS.',
        'Re-applying CNI disrupts the data plane across all nodes; external traffic is already flowing fine.'
      ]
    },

    // Technical glossary terms with optional exam tips
    glossary: [
      {
        term: 'CoreDNS',
        cat: 'Networking',
        d: 3,
        def: 'Default DNS server for Kubernetes clusters, providing service discovery and domain resolution for internal cluster FQDNs.',
        tip: 'Check ConfigMap coredns in kube-system for forward plugins and errors.'
      }
    ]
  };
})(window);
```

### 3. Register the Track in the Application
To make your track visible and fully functional:
1. **`index.html`**: Add the script tag loading your data file before `assets/js/app.js`:
   ```html
   <script src="data/k8s/exam.js"></script>
   ```
2. **`assets/js/app.js`**: Add your track ID into the `EXAM_ORDER` array:
   ```js
   var EXAM_ORDER = ['sre-incidents', 'gcp-genai-leader', 'az-104', 'aws-saa-c03', 'k8s-cka'];
   ```
3. **`assets/js/cloud-sync.js`**: Add your track ID into `EXAM_IDS` to enable cloud sync:
   ```js
   var EXAM_IDS = ['sre-incidents', 'gcp-genai-leader', 'az-104', 'aws-saa-c03', 'k8s-cka'];
   ```

---

## Style Guidelines for Questions & Scenarios

- **Realistic Context:** Start with the scenario context (time, role, metric behavior, or architectural constraint).
- **Single Correct Approach vs. Distractors:** Each distractor should represent a common mistake (e.g., misinterpreting TTL cache behavior, picking an antipattern, choosing an unnecessarily expensive SKU).
- **Precision:** Mention exact CLI flags, API names, and metrics where relevant (e.g., `kubectl drain --ignore-daemonsets`, `--cascade=orphan`, `Vertex AI Search`).
- **Formatting:** Code snippets and commands should be wrapped in backticks (e.g., `` `kubectl get nodes` ``) so our i18n formatter renders them cleanly in bold.

---

## Testing Your Changes Locally

Run a simple local web server to verify your questions, topics, and glossary:

```bash
python3 -m http.server 8080
```
1. Open [http://localhost:8080](http://localhost:8080).
2. Select your track from the header dropdown.
3. Verify that:
   - All questions render correctly and submit with immediate diagnostic feedback.
   - Topics expand and collapse properly.
   - The glossary filters by search query and category pills.
   - Progress correctly tracks under `@fabianimv/study-tracker`.
   - The `ES / EN` language switch functions smoothly without broken template placeholders.

---

## Submitting Pull Requests

1. Fork the repository on GitHub.
2. Create a clean feature branch:
   ```bash
   git checkout -b feat/add-k8s-cka-track
   ```
3. Commit your changes with clear, descriptive commit messages:
   ```bash
   git commit -m "feat(data): add Kubernetes CKA track with 50 scenarios and why rationale"
   ```
4. Push to your fork and open a Pull Request against the `main` branch.
