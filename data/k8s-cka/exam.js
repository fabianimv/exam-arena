/* =========================================================================
   data/k8s-cka/exam.js — CNCF · Certified Kubernetes Administrator (CKA) (English)
   Hands-on administration scenarios: etcd, kubeadm, RBAC, scheduling,
   networking, storage and troubleshooting (Kubernetes v1.31+ curriculum).
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["k8s-cka"] = {
    "id": "k8s-cka",
    "appId": "k8s-cka",
    "provider": "CNCF & Linux Foundation",
    "badge": "K8s · CKA",
    "icon": "☸️",
    "color": "#2563eb",
    "featured": true,
    "title": "CNCF · Certified Kubernetes Administrator (CKA)",
    "subtitle": "etcd backup & restore, kubeadm upgrades, RBAC, Helm & CRDs, scheduling, Services, Gateway API, NetworkPolicy, storage and cluster troubleshooting",
    "passingScore": 66,
    "domains": {
      "1": "Cluster Architecture, Installation & Configuration (25%)",
      "2": "Workloads & Scheduling (15%)",
      "3": "Services & Networking (20%)",
      "4": "Storage (10%)",
      "5": "Troubleshooting (30%)"
    },
    "shortDomains": {
      "1": "Cluster Arch & Config",
      "2": "Workloads & Scheduling",
      "3": "Services & Networking",
      "4": "Storage",
      "5": "Troubleshooting"
    },
    "topics": [
      {
        "id": "cka-t-1-1",
        "d": 1,
        "title": "1.1 · Control Plane Anatomy and etcd Backup & Restore",
        "html": "<h4>What runs on a kubeadm control plane node</h4>\n<p>In a kubeadm cluster the control plane components run as <b>static Pods</b> managed directly by the kubelet from manifests in <code>/etc/kubernetes/manifests</code>. They are visible through the API as read-only <i>mirror Pods</i>.</p>\n<table class=\"keytable\">\n<tr><th>Component</th><th>Responsibility</th><th>Failure symptom</th></tr>\n<tr><td><code>kube-apiserver</code></td><td>Single entry point, authn/authz, admission, persistence to etcd</td><td><code>kubectl</code> returns <i>connection refused</i> on :6443</td></tr>\n<tr><td><code>etcd</code></td><td>Consistent key-value store holding all cluster state</td><td>API server crash-loops, writes fail</td></tr>\n<tr><td><code>kube-scheduler</code></td><td>Assigns <code>nodeName</code> to new Pods</td><td>New Pods stay <code>Pending</code> with no scheduling events</td></tr>\n<tr><td><code>kube-controller-manager</code></td><td>Reconciliation loops (ReplicaSets, Nodes, Endpoints, tokens)</td><td>Deployments are not scaled, ReplicaSets do not create Pods</td></tr>\n</table>\n<h4>etcd snapshot</h4>\n<pre>ETCDCTL_API=3 etcdctl snapshot save /opt/backup/etcd.db \\\n  --endpoints=https://127.0.0.1:2379 \\\n  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\\n  --cert=/etc/kubernetes/pki/etcd/server.crt \\\n  --key=/etc/kubernetes/pki/etcd/server.key</pre>\n<p>Read the exact paths from <code>/etc/kubernetes/manifests/etcd.yaml</code> (flags <code>--trusted-ca-file</code>, <code>--cert-file</code>, <code>--key-file</code>, <code>--listen-client-urls</code>).</p>\n<h4>etcd restore</h4>\n<ol>\n<li><code>etcdutl snapshot restore /opt/backup/etcd.db --data-dir /var/lib/etcd-restore</code> (older guides use <code>etcdctl snapshot restore</code>).</li>\n<li>Edit <code>/etc/kubernetes/manifests/etcd.yaml</code> so the <code>etcd-data</code> <b>hostPath</b> points at <code>/var/lib/etcd-restore</code>.</li>\n<li>The kubelet detects the change and recreates the etcd static Pod; wait for the API server to recover.</li>\n</ol>"
      },
      {
        "id": "cka-t-1-2",
        "d": 1,
        "title": "1.2 · kubeadm Lifecycle: Upgrades, Join Tokens and Certificates",
        "html": "<h4>Control plane upgrade (one minor version at a time)</h4>\n<ol>\n<li>Upgrade the <code>kubeadm</code> package on the first control plane node.</li>\n<li><code>kubeadm upgrade plan</code> → <code>kubeadm upgrade apply v1.31.x</code>.</li>\n<li>On additional control plane nodes: <code>kubeadm upgrade node</code>.</li>\n<li><code>kubectl drain &lt;node&gt; --ignore-daemonsets</code>, upgrade <code>kubelet</code> and <code>kubectl</code>, <code>systemctl daemon-reload &amp;&amp; systemctl restart kubelet</code>, then <code>kubectl uncordon</code>.</li>\n</ol>\n<h4>Worker nodes</h4>\n<p>Upgrade <code>kubeadm</code>, run <code>kubeadm upgrade node</code>, drain, upgrade kubelet, restart and uncordon. Workers can lag the API server by up to three minor versions, never be newer.</p>\n<h4>Tokens and certificates</h4>\n<table class=\"keytable\">\n<tr><th>Task</th><th>Command</th></tr>\n<tr><td>New join command (default token TTL is 24h)</td><td><code>kubeadm token create --print-join-command</code></td></tr>\n<tr><td>Check certificate expiry</td><td><code>kubeadm certs check-expiration</code></td></tr>\n<tr><td>Renew all control plane certificates</td><td><code>kubeadm certs renew all</code> then restart the control plane static Pods</td></tr>\n</table>"
      },
      {
        "id": "cka-t-1-3",
        "d": 1,
        "title": "1.3 · RBAC, Helm, Kustomize and Custom Resources",
        "html": "<h4>RBAC building blocks</h4>\n<table class=\"keytable\">\n<tr><th>Object</th><th>Scope</th><th>Notes</th></tr>\n<tr><td><code>Role</code> / <code>RoleBinding</code></td><td>Namespace</td><td>A RoleBinding grants permissions <b>in its own namespace</b>, even when it references a ClusterRole.</td></tr>\n<tr><td><code>ClusterRole</code> / <code>ClusterRoleBinding</code></td><td>Cluster</td><td>Needed for cluster-scoped resources (nodes, PVs, namespaces) or all-namespace access.</td></tr>\n</table>\n<p>Subjects can be <code>User</code>, <code>Group</code> or <code>ServiceAccount</code> (with its namespace). Verify with <code>kubectl auth can-i list pods -n prod --as=system:serviceaccount:ci:deployer</code>.</p>\n<h4>Package and configuration tooling</h4>\n<ul>\n<li><b>Helm:</b> <code>helm upgrade --install</code>, <code>helm history</code>, <code>helm rollback &lt;release&gt; &lt;revision&gt;</code>, <code>-f values.yaml</code> / <code>--set</code>.</li>\n<li><b>Kustomize:</b> base + overlays, <code>kubectl apply -k overlays/prod</code>, <code>kubectl kustomize</code> to render.</li>\n<li><b>CRDs &amp; Operators:</b> a CRD must be installed and <i>Established</i> before custom resources of that kind can be created; an operator (controller) reconciles them.</li>\n</ul>"
      },
      {
        "id": "cka-t-2-1",
        "d": 2,
        "title": "2.1 · Deployments, Rollouts and Pod Placement",
        "html": "<h4>Rolling updates</h4>\n<p><code>strategy.rollingUpdate.maxSurge</code> controls extra Pods above the desired count, <code>maxUnavailable</code> controls how many may be missing. With <code>maxUnavailable: 0</code> capacity never drops, provided readiness probes gate traffic.</p>\n<pre>kubectl set image deploy/web web=nginx:1.27\nkubectl rollout status deploy/web\nkubectl rollout history deploy/web\nkubectl rollout undo deploy/web --to-revision=2</pre>\n<h4>Placement controls</h4>\n<table class=\"keytable\">\n<tr><th>Mechanism</th><th>Effect</th></tr>\n<tr><td>Taint + toleration</td><td>Repels Pods; a toleration only <b>allows</b> scheduling on the tainted node, it does not attract.</td></tr>\n<tr><td><code>nodeSelector</code> / node affinity</td><td><b>Attracts</b> Pods to nodes with matching labels.</td></tr>\n<tr><td>Requests</td><td>The scheduler sums <b>requests</b> (not limits) against node allocatable.</td></tr>\n<tr><td>PodDisruptionBudget</td><td>Limits voluntary evictions such as <code>kubectl drain</code>.</td></tr>\n</table>\n<h4>Configuration and autoscaling</h4>\n<p>ConfigMaps consumed as <b>environment variables</b> are read only at container start; mounted volumes (without <code>subPath</code>) are refreshed by the kubelet. The HorizontalPodAutoscaler needs <b>metrics-server</b> and CPU/memory <b>requests</b> on the target containers.</p>"
      },
      {
        "id": "cka-t-3-1",
        "d": 3,
        "title": "3.1 · Services, DNS, Ingress and Gateway API",
        "html": "<h4>Service types</h4>\n<table class=\"keytable\">\n<tr><th>Type</th><th>Reachability</th></tr>\n<tr><td><code>ClusterIP</code></td><td>Internal virtual IP (default).</td></tr>\n<tr><td><code>NodePort</code></td><td>Every node on a port in <code>30000-32767</code>.</td></tr>\n<tr><td><code>LoadBalancer</code></td><td>Requires a cloud controller or a bare-metal implementation (e.g. MetalLB); otherwise <code>EXTERNAL-IP</code> stays <code>&lt;pending&gt;</code>.</td></tr>\n</table>\n<p>A Service routes only to <b>Ready</b> Pods whose labels match its <code>selector</code>; check <code>kubectl get endpointslices -l kubernetes.io/service-name=web</code>.</p>\n<h4>DNS</h4>\n<p>Services resolve as <code>&lt;svc&gt;.&lt;ns&gt;.svc.cluster.local</code>; from another namespace use at least <code>&lt;svc&gt;.&lt;ns&gt;</code>.</p>\n<h4>Ingress and Gateway API</h4>\n<ul>\n<li>Ingress objects need <code>spec.ingressClassName</code> (or a default IngressClass) so a controller claims them.</li>\n<li>Gateway API: <code>GatewayClass</code> → <code>Gateway</code> (listeners) → <code>HTTPRoute</code> attached via <code>parentRefs</code>. Listeners accept routes only from the <b>same namespace</b> unless <code>allowedRoutes.namespaces.from</code> is <code>All</code> or <code>Selector</code>.</li>\n</ul>"
      },
      {
        "id": "cka-t-3-2",
        "d": 3,
        "title": "3.2 · NetworkPolicy Semantics",
        "html": "<h4>Rules of thumb</h4>\n<ul>\n<li>Pods are non-isolated until a policy selects them for a given direction (<code>policyTypes</code>).</li>\n<li>Policies are additive (union of allows); there are no deny rules.</li>\n<li>Inside one <code>from</code>/<code>to</code> element, <code>namespaceSelector</code> + <code>podSelector</code> are <b>AND</b>; separate list elements are <b>OR</b>.</li>\n<li>Egress isolation also blocks DNS: allow UDP and TCP 53 to the <code>kube-dns</code> Pods.</li>\n<li>Enforcement depends on the CNI plugin (Calico, Cilium); flannel alone does not enforce policies.</li>\n</ul>\n<pre>apiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata: { name: default-deny-ingress, namespace: prod }\nspec:\n  podSelector: {}\n  policyTypes: [Ingress]</pre>"
      },
      {
        "id": "cka-t-4-1",
        "d": 4,
        "title": "4.1 · PersistentVolumes, Claims and StorageClasses",
        "html": "<h4>Binding lifecycle</h4>\n<table class=\"keytable\">\n<tr><th>Concept</th><th>Key facts</th></tr>\n<tr><td>Access modes</td><td><code>ReadWriteOnce</code> (one node), <code>ReadOnlyMany</code>, <code>ReadWriteMany</code> (many nodes), <code>ReadWriteOncePod</code> (one Pod).</td></tr>\n<tr><td><code>volumeBindingMode</code></td><td><code>WaitForFirstConsumer</code> keeps the PVC <code>Pending</code> until a Pod uses it, so the volume is created in the Pod's zone.</td></tr>\n<tr><td><code>persistentVolumeReclaimPolicy</code></td><td><code>Delete</code> removes the backing disk; <code>Retain</code> leaves the PV <code>Released</code> until an admin clears <code>spec.claimRef</code>.</td></tr>\n<tr><td>Expansion</td><td>Requires <code>allowVolumeExpansion: true</code>; edit the PVC request upward. Shrinking is not supported.</td></tr>\n</table>"
      },
      {
        "id": "cka-t-5-1",
        "d": 5,
        "title": "5.1 · Troubleshooting Workloads and Nodes",
        "html": "<h4>Pod status decoder</h4>\n<table class=\"keytable\">\n<tr><th>Status</th><th>First command</th><th>Typical cause</th></tr>\n<tr><td><code>Pending</code></td><td><code>kubectl describe pod</code> (Events)</td><td>Insufficient requests, selector/affinity mismatch, taints, unbound PVC</td></tr>\n<tr><td><code>ImagePullBackOff</code></td><td><code>kubectl describe pod</code></td><td>Wrong image/tag, private registry without <code>imagePullSecrets</code></td></tr>\n<tr><td><code>CrashLoopBackOff</code></td><td><code>kubectl logs --previous</code></td><td>Application error, bad config, failing command</td></tr>\n<tr><td><code>OOMKilled</code> (exit 137)</td><td><code>kubectl describe pod</code> (Last State)</td><td>Memory limit too low or leak</td></tr>\n<tr><td>Running but <code>0/1</code> READY</td><td><code>kubectl describe pod</code></td><td>Readiness probe failing → removed from Service endpoints</td></tr>\n</table>\n<h4>Node NotReady</h4>\n<pre>ssh node01\nsystemctl status kubelet containerd\njournalctl -u kubelet --since '10 min ago'\ncrictl ps -a</pre>"
      },
      {
        "id": "cka-t-5-2",
        "d": 5,
        "title": "5.2 · Troubleshooting the Control Plane, DNS and Metrics",
        "html": "<h4>When kubectl itself is down</h4>\n<p>If the API server static Pod fails (for example after a typo in its manifest), <code>kubectl</code> cannot help. Use the node runtime instead: <code>crictl ps -a | grep kube-apiserver</code>, <code>crictl logs &lt;id&gt;</code>, or <code>/var/log/pods/</code> and <code>journalctl -u kubelet</code> for manifest parse errors.</p>\n<h4>Cluster DNS checks</h4>\n<pre>kubectl -n kube-system get pods -l k8s-app=kube-dns\nkubectl run dnstest --image=busybox:1.36 --rm -it --restart=Never -- nslookup kubernetes.default</pre>\n<h4>Resource usage</h4>\n<p><code>kubectl top nodes</code> / <code>kubectl top pods -A --sort-by=memory</code> require <b>metrics-server</b>. Events sorted by time: <code>kubectl get events -A --sort-by=.metadata.creationTimestamp</code>.</p>"
      }
    ],
    "questions": [
      {
        "id": "cka-01",
        "d": 1,
        "t": "etcd Snapshot Backup",
        "q": "Before a risky maintenance window you must take a snapshot of the etcd instance running as a static Pod on `controlplane`. The etcd manifest uses TLS client authentication on `https://127.0.0.1:2379` with certificates under `/etc/kubernetes/pki/etcd/`. Which command produces a valid snapshot at `/opt/backup/etcd.db`?",
        "o": [
          "`kubectl get all -A -o yaml > /opt/backup/etcd.db`, because it exports every object stored in etcd, including Secrets and CRDs, in a restorable format.",
          "`ETCDCTL_API=3 etcdctl snapshot save /opt/backup/etcd.db --endpoints=https://127.0.0.1:2379 --cacert=/etc/kubernetes/pki/etcd/ca.crt --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key`",
          "`cp -r /var/lib/etcd /opt/backup/etcd.db` while etcd keeps running, since the member directory under the data dir is always a crash-consistent snapshot.",
          "`ETCDCTL_API=3 etcdctl snapshot save /opt/backup/etcd.db --endpoints=http://127.0.0.1:2379 --insecure-skip-tls-verify`, since loopback clients need no certificates."
        ],
        "a": 1,
        "e": "`etcdctl snapshot save` takes a consistent point-in-time snapshot through the etcd API. Because etcd requires mutual TLS, you must pass `--cacert`, `--cert` and `--key` (read the exact paths from `/etc/kubernetes/manifests/etcd.yaml`) and the HTTPS client endpoint."
      },
      {
        "id": "cka-02",
        "d": 1,
        "t": "etcd Restore",
        "q": "After an accidental mass deletion you have restored a snapshot with `etcdutl snapshot restore /opt/backup/etcd.db --data-dir /var/lib/etcd-restore`. The cluster still shows the deleted objects missing. What is the remaining step to make the control plane use the restored data?",
        "o": [
          "Run `kubeadm reset` on the control plane node so it re-reads every data directory under `/var/lib/`.",
          "Restart the kube-apiserver static Pod, because the API server caches the etcd data directory path.",
          "Point the `etcd-data` hostPath in `/etc/kubernetes/manifests/etcd.yaml` to `/var/lib/etcd-restore`.",
          "Run `kubectl apply -f /var/lib/etcd-restore` so the API server replays the restored objects."
        ],
        "a": 2,
        "e": "Restoring writes a new data directory but etcd keeps using the old one until its static Pod manifest is changed. Updating the `etcd-data` hostPath (or moving the restored directory into the original path) makes the kubelet recreate etcd on top of the restored state."
      },
      {
        "id": "cka-03",
        "d": 1,
        "t": "kubeadm Control Plane Upgrade",
        "q": "You are upgrading a kubeadm cluster from v1.30.4 to v1.31.2. You have already installed `kubeadm` v1.31.2 on the first control plane node. What is the correct next sequence on that node?",
        "o": [
          "Run `kubeadm upgrade plan`, then `kubeadm upgrade apply v1.31.2`, then drain the node, upgrade kubelet and kubectl, restart kubelet and uncordon.",
          "Upgrade the kubelet first and restart it, then run `kubeadm upgrade node` so it detects the newer kubelet version.",
          "Run `kubeadm init --kubernetes-version v1.31.2` to regenerate the control plane manifests for the new version.",
          "Run `kubeadm upgrade apply v1.31.2` on every worker node first so the control plane is never newer than its kubelets."
        ],
        "a": 0,
        "e": "On the first control plane node the documented order is: upgrade kubeadm, `kubeadm upgrade plan`, `kubeadm upgrade apply v1.31.2`, then drain, upgrade kubelet/kubectl, `systemctl daemon-reload && systemctl restart kubelet` and uncordon. Other control plane and worker nodes use `kubeadm upgrade node`."
      },
      {
        "id": "cka-04",
        "d": 1,
        "t": "RBAC Across Namespaces",
        "q": "The CI pipeline runs as ServiceAccount `deployer` in namespace `ci`. It must be able to `get`, `list` and `watch` Pods in namespace `prod` only, and nothing in any other namespace. Which RBAC configuration meets the requirement with least privilege?",
        "o": [
          "A Role in `ci` with the Pod permissions and a RoleBinding in `ci` that references ServiceAccount `deployer`.",
          "A ClusterRole with the Pod permissions and a ClusterRoleBinding that references ServiceAccount `deployer` in namespace `ci`.",
          "A Role in `prod` with the Pod permissions and a RoleBinding in `ci` whose subject is ServiceAccount `deployer`.",
          "A Role in `prod` with the Pod permissions and a RoleBinding in `prod` whose subject is ServiceAccount `deployer` in namespace `ci`."
        ],
        "a": 3,
        "e": "A RoleBinding grants permissions in its own namespace. Creating both the Role and the RoleBinding in `prod`, with subject `kind: ServiceAccount, name: deployer, namespace: ci`, gives read access to Pods in `prod` only."
      },
      {
        "id": "cka-05",
        "d": 1,
        "t": "Verifying Permissions",
        "q": "You just created RBAC rules for ServiceAccount `deployer` in namespace `ci`. Without obtaining its token, how do you confirm that it can list Pods in `prod` but cannot delete them?",
        "o": [
          "`kubectl get pods -n prod --token=deployer` and `kubectl delete pod x -n prod --token=deployer`.",
          "`kubectl auth can-i list pods -n prod --as=system:serviceaccount:ci:deployer` and the same with `delete pods`.",
          "`kubectl describe sa deployer -n ci`, which lists the effective verbs granted on every resource.",
          "`kubectl auth whoami -n prod`, which prints the permissions of every ServiceAccount in the namespace."
        ],
        "a": 1,
        "e": "`kubectl auth can-i` with `--as=system:serviceaccount:<ns>:<name>` uses impersonation to evaluate the authorizer and returns `yes`/`no` for each verb and resource, which is the fastest way to validate RBAC in the exam."
      },
      {
        "id": "cka-06",
        "d": 1,
        "t": "Static Pods",
        "q": "A Pod named `audit-agent-node01` keeps coming back seconds after `kubectl delete pod audit-agent-node01` succeeds. It has no owner references and its name ends with the node name. How do you permanently remove it?",
        "o": [
          "Delete the ReplicaSet that owns it, which you can find with `kubectl get rs -A`.",
          "Cordon `node01` so the kubelet stops recreating Pods on it.",
          "Remove its manifest from the kubelet `staticPodPath` (usually `/etc/kubernetes/manifests`) on `node01`.",
          "Run `kubectl delete pod audit-agent-node01 --grace-period=0 --force` so the kubelet forgets it."
        ],
        "a": 2,
        "e": "It is a static Pod: the kubelet creates it from a file and the API only shows a mirror Pod. Deleting the mirror Pod has no effect; removing the file from `staticPodPath` (check `/var/lib/kubelet/config.yaml`) stops it."
      },
      {
        "id": "cka-07",
        "d": 1,
        "t": "Joining Nodes",
        "q": "A new worker must join a kubeadm cluster that was bootstrapped three days ago. The original `kubeadm join` command fails with an authentication error about the bootstrap token. What should you run on the control plane?",
        "o": [
          "`kubeadm token create --print-join-command`, then run the printed command on the new worker.",
          "`kubeadm init phase upload-certs` and reuse the old join command unchanged.",
          "`kubeadm certs renew all`, because the join failure is caused by expired control plane certificates.",
          "`kubectl certificate approve` on every pending CSR, which re-enables the expired token."
        ],
        "a": 0,
        "e": "Bootstrap tokens expire after 24 hours by default. `kubeadm token create --print-join-command` creates a new token and prints the full join command with the CA certificate hash."
      },
      {
        "id": "cka-08",
        "d": 1,
        "t": "Control Plane Certificates",
        "q": "Monitoring warns that control plane certificates expire in 5 days on a kubeadm cluster that has not been upgraded for almost a year. What is the correct remediation?",
        "o": [
          "Delete `/etc/kubernetes/pki` so kubeadm regenerates every certificate, including the cluster CA, on the next kubelet restart.",
          "Increase the kubelet `--rotate-certificates` flag, which also renews API server and etcd serving certificates.",
          "Run `kubeadm certs check-expiration`, then `kubeadm certs renew all`, and restart the control plane static Pods so they load the new certificates.",
          "Run `kubeadm token create --ttl 8760h` to extend the lifetime of all cluster certificates by one year."
        ],
        "a": 2,
        "e": "`kubeadm certs renew all` renews the leaf certificates signed by the existing CA. The components only read them at startup, so the API server, controller manager, scheduler and etcd static Pods must be restarted (for example by moving their manifests out and back)."
      },
      {
        "id": "cka-09",
        "d": 1,
        "t": "Helm Rollback",
        "q": "`helm upgrade payments ./chart -f values-prod.yaml` produced revision 7, and the application now fails health checks. Revision 6 was healthy. What is the quickest correct way to return to the previous state?",
        "o": [
          "`helm uninstall payments` followed by `helm install payments ./chart` with the old values file.",
          "`helm history payments` to confirm the revision, then `helm rollback payments 6`.",
          "`kubectl rollout undo deployment/payments`, which also updates the Helm release record.",
          "`helm upgrade payments ./chart --version 6`, because the chart version equals the release revision."
        ],
        "a": 1,
        "e": "`helm rollback <release> <revision>` re-applies the manifests stored for that revision and records a new revision, keeping Helm state consistent. Uninstalling causes downtime and `kubectl rollout undo` desynchronizes the release from Helm."
      },
      {
        "id": "cka-10",
        "d": 1,
        "t": "Custom Resource Definitions",
        "q": "Applying `backup-policy.yaml` (kind `BackupPolicy`, apiVersion `ops.example.com/v1`) fails with `no matches for kind \"BackupPolicy\" in version \"ops.example.com/v1\"`. What is the most likely cause?",
        "o": [
          "The namespace in the manifest does not exist, and the API server reports it as an unknown kind.",
          "The ServiceAccount used by kubectl lacks the `create` verb on custom resources.",
          "The operator Deployment that reconciles BackupPolicy objects is scaled to zero replicas.",
          "The CRD `backuppolicies.ops.example.com` serving v1 is not installed or not yet Established."
        ],
        "a": 3,
        "e": "The API server can only accept a kind after a CRD registers it. Install the CRD (often shipped by the operator's Helm chart), wait for the `Established` condition, then create the custom resource."
      },
      {
        "id": "cka-11",
        "d": 2,
        "t": "Zero-Downtime Rolling Update",
        "q": "Deployment `web` has 4 replicas behind a Service. During image updates users see brief errors because capacity drops. You must keep 4 serving Pods at all times, allowing at most one extra Pod. Which configuration achieves this?",
        "o": [
          "`strategy.type: Recreate` with a readiness probe on the container.",
          "`maxSurge: 0` and `maxUnavailable: 1`, so only one old Pod is replaced at a time.",
          "`maxSurge: 1` and `maxUnavailable: 0`, together with a readiness probe that reflects real availability.",
          "`maxSurge: 100%` and `maxUnavailable: 100%`, so the new ReplicaSet is created all at once."
        ],
        "a": 2,
        "e": "With `maxUnavailable: 0` the controller never removes an old Pod until a new one is Ready, and `maxSurge: 1` allows one extra Pod during the rollout. Without a meaningful readiness probe, 'Ready' would be reported before the app can actually serve."
      },
      {
        "id": "cka-12",
        "d": 2,
        "t": "Rollout Undo",
        "q": "`kubectl rollout history deploy/api` shows revisions 3, 4 and 5. Revision 5 (current) is broken and revision 4 also had a known bug; revision 3 is the last good one. Which command restores it?",
        "o": [
          "`kubectl rollout undo deploy/api --to-revision=3`",
          "`kubectl rollout undo deploy/api` twice in a row, which steps back two revisions.",
          "`kubectl rollout restart deploy/api --revision=3`",
          "`kubectl scale deploy/api --replicas=0` and then set the replicas back, which reloads revision 3."
        ],
        "a": 0,
        "e": "`--to-revision` rolls back to a specific revision. A plain `undo` goes to the previous revision; running it twice would toggle between 5 and 4 because the rollback itself creates a new revision."
      },
      {
        "id": "cka-13",
        "d": 2,
        "t": "Taints, Tolerations and Affinity",
        "q": "GPU nodes are tainted `gpu=true:NoSchedule` and labeled `accelerator=nvidia`. A training Pod must run only on GPU nodes. The team added the matching toleration, but the Pod sometimes lands on regular nodes. What is missing?",
        "o": [
          "Nothing; a toleration both permits and forces scheduling onto tainted nodes, so the issue is a scheduler bug.",
          "Change the taint effect to `PreferNoSchedule`, which attracts Pods that tolerate it.",
          "Add a `NoExecute` toleration so the Pod gets evicted from the regular, untainted nodes.",
          "A `nodeSelector` or required node affinity on `accelerator=nvidia`; tolerations allow, never attract."
        ],
        "a": 3,
        "e": "Taints keep other Pods away; tolerations merely lift that restriction. To pin the Pod to GPU nodes you also need a node selector or `requiredDuringSchedulingIgnoredDuringExecution` node affinity on the GPU label."
      },
      {
        "id": "cka-14",
        "d": 2,
        "t": "Requests and Scheduling",
        "q": "A new Pod stays `Pending` with the event `0/3 nodes are available: 3 Insufficient cpu`. `kubectl top nodes` shows every node at about 20% real CPU usage. Why does the scheduler reject the Pod?",
        "o": [
          "`kubectl top` is cached for 24 hours, so the real usage is much higher than displayed.",
          "The scheduler checks the CPU request against allocatable minus existing requests, not real usage.",
          "The Pod's CPU limit is higher than the node's capacity, and limits are what the scheduler uses.",
          "The kubelet reserves 80% of CPU for system daemons whenever metrics-server is installed."
        ],
        "a": 1,
        "e": "Scheduling is based on requests. Nodes can be 'full' by requests while actual usage is low. Fix by lowering over-sized requests on existing workloads, reducing the new Pod's request, or adding capacity."
      },
      {
        "id": "cka-15",
        "d": 2,
        "t": "ConfigMap Updates",
        "q": "A Deployment reads `LOG_LEVEL` from a ConfigMap via `envFrom` and also mounts the same ConfigMap as a volume at `/etc/app`. You change `LOG_LEVEL` to `debug`. What happens without further action?",
        "o": [
          "Both the environment variable and the mounted file update within a minute because the kubelet watches ConfigMaps.",
          "Neither updates; ConfigMaps are immutable once referenced by a running Pod.",
          "The mounted file is eventually refreshed, but the environment variable keeps its old value until the containers restart.",
          "The environment variable updates immediately and the mounted file only after a node reboot."
        ],
        "a": 2,
        "e": "Environment variables are resolved when the container starts. Projected ConfigMap volumes (not using `subPath`) are refreshed by the kubelet sync loop. Use `kubectl rollout restart` to pick up env changes."
      },
      {
        "id": "cka-16",
        "d": 2,
        "t": "HorizontalPodAutoscaler",
        "q": "`kubectl get hpa web` shows `TARGETS: <unknown>/70%` and the replica count never changes under load. metrics-server is running and `kubectl top pods` works. What is the most likely cause?",
        "o": [
          "The `web` containers set no CPU requests, so a utilization percentage cannot be computed.",
          "The HPA must be created in the `kube-system` namespace to read metrics.",
          "HPA only works with StatefulSets; Deployments require the Vertical Pod Autoscaler.",
          "The Deployment has `maxSurge: 0`, which prevents the HPA from adding replicas."
        ],
        "a": 0,
        "e": "CPU utilization targets are a percentage of the Pod's CPU request. Without requests the HPA reports `<unknown>`. Add `resources.requests.cpu` to every container in the target workload."
      },
      {
        "id": "cka-17",
        "d": 2,
        "t": "PodDisruptionBudget and Drain",
        "q": "`kubectl drain node02 --ignore-daemonsets` hangs repeating `Cannot evict pod as it would violate the pod's disruption budget`. The Deployment has 2 replicas and its PDB sets `minAvailable: 2`. What is the safest way to finish the maintenance?",
        "o": [
          "Re-run the drain with `--disable-eviction`, which deletes the Pods and bypasses the PDB.",
          "Temporarily scale to 3 replicas (or set the PDB to `minAvailable: 1`) so one Pod can be evicted safely.",
          "Delete the PDB permanently, since PDBs only protect StatefulSets and never Deployments.",
          "Stop the kubelet on node02, which makes the scheduler move the Pods without checking the PDB."
        ],
        "a": 1,
        "e": "A PDB with `minAvailable` equal to the replica count allows zero voluntary disruptions. Adding a replica or temporarily relaxing the budget lets eviction proceed while preserving availability."
      },
      {
        "id": "cka-18",
        "d": 3,
        "t": "Service Without Endpoints",
        "q": "Service `api` (ClusterIP) times out. `kubectl get endpointslices -l kubernetes.io/service-name=api` shows no endpoints although three `api` Pods are Running and Ready. The Service selector is `app: api-server`; the Pods are labeled `app: api`. What is the fix?",
        "o": [
          "Change the Service type to NodePort so kube-proxy discovers the Pods directly.",
          "Restart kube-proxy on every node to refresh its iptables rules.",
          "Delete and recreate the Pods so they register with the Service.",
          "Make the Service selector match the Pod labels (for example `app: api`)."
        ],
        "a": 3,
        "e": "Endpoints are built from Pods that match the Service selector and are Ready. A label mismatch produces an empty EndpointSlice; aligning selector and labels fixes routing immediately."
      },
      {
        "id": "cka-19",
        "d": 3,
        "t": "Default Deny Ingress",
        "q": "Security requires that all Pods in namespace `prod` reject incoming traffic unless another policy explicitly allows it. Egress must not be affected. Which NetworkPolicy implements this?",
        "o": [
          "`podSelector: {}` with `policyTypes: [Ingress]` and no `ingress` rules.",
          "`podSelector: {}` with `policyTypes: [Ingress, Egress]` and no rules.",
          "`podSelector: {}` with an `ingress` rule containing `from: []`.",
          "`podSelector: { matchLabels: { deny: all } }` with `policyTypes: [Ingress]`."
        ],
        "a": 0,
        "e": "An empty `podSelector` selects every Pod in the namespace; declaring `Ingress` with no rules isolates them for ingress only. Adding Egress would also block outbound traffic, including DNS."
      },
      {
        "id": "cka-20",
        "d": 3,
        "t": "NetworkPolicy AND vs OR",
        "q": "Database Pods in `data` must accept traffic only from Pods labeled `role: backend` that run in namespaces labeled `team: payments`. Which `ingress.from` definition is correct?",
        "o": [
          "Two list items: `- namespaceSelector: {matchLabels: {team: payments}}` and `- podSelector: {matchLabels: {role: backend}}`.",
          "Only `- podSelector: {matchLabels: {role: backend, team: payments}}`.",
          "A single list item containing both `namespaceSelector: {matchLabels: {team: payments}}` and `podSelector: {matchLabels: {role: backend}}`.",
          "Only `- namespaceSelector: {matchLabels: {team: payments}}`, because Pod labels are not supported in ingress rules."
        ],
        "a": 2,
        "e": "Within one `from` element, `namespaceSelector` and `podSelector` are combined with AND. Two separate elements are ORed, which would admit any Pod from payments namespaces or any backend Pod in `data`."
      },
      {
        "id": "cka-21",
        "d": 3,
        "t": "Egress Policy Breaks DNS",
        "q": "After applying an egress NetworkPolicy that only allows TCP 5432 to the database Pods, the application fails with `could not translate host name \"postgres\"`. Connectivity by IP works. What should you add?",
        "o": [
          "An ingress rule on the database Pods that allows UDP 53 from the application.",
          "An egress rule allowing UDP and TCP 53 to the CoreDNS Pods in `kube-system`.",
          "A `hostAliases` entry in the Pod spec for every Service the application uses.",
          "Change the Service to `clusterIP: None`, because headless Services do not need DNS."
        ],
        "a": 1,
        "e": "Once egress is isolated, DNS queries to CoreDNS are blocked too. Allow port 53 (UDP and TCP) to the kube-dns Pods, typically via a `namespaceSelector` on `kubernetes.io/metadata.name: kube-system` plus a `podSelector` on `k8s-app: kube-dns`."
      },
      {
        "id": "cka-22",
        "d": 3,
        "t": "LoadBalancer on Bare Metal",
        "q": "On an on-premises kubeadm cluster with no cloud integration, a Service of type `LoadBalancer` has shown `EXTERNAL-IP <pending>` for an hour. What explains this and what is a valid way to expose the app externally?",
        "o": [
          "kube-proxy runs in IPVS mode; switching it to iptables mode lets the Service get its external IP.",
          "The Service needs `externalTrafficPolicy: Local` before an IP can be allocated.",
          "CoreDNS cannot resolve the external name, and restarting CoreDNS will allocate the IP.",
          "No controller implements LoadBalancer here; install one (e.g. MetalLB) or use a NodePort Service."
        ],
        "a": 3,
        "e": "LoadBalancer Services rely on a cloud controller manager or a bare-metal implementation to provision an address. Without one the status stays pending, although the NodePort allocated underneath already works."
      },
      {
        "id": "cka-23",
        "d": 3,
        "t": "Cross-Namespace DNS",
        "q": "A Pod in namespace `web` must connect to Service `redis` in namespace `cache`. Using the host name `redis` fails with NXDOMAIN. Which host name works with the default cluster DNS configuration?",
        "o": [
          "`redis.cache.svc.cluster.local` (or simply `redis.cache`).",
          "`cache.redis.svc.cluster.local` (namespace first, then Service).",
          "`redis.web.svc.cluster.local` (the client Pod's namespace).",
          "`redis.cache.pod.cluster.local` (the Pod record of the Service)."
        ],
        "a": 0,
        "e": "Service records follow `<service>.<namespace>.svc.<cluster-domain>`. The Pod's search path only includes its own namespace, so a bare `redis` resolves against `web`."
      },
      {
        "id": "cka-24",
        "d": 3,
        "t": "Gateway API Route Attachment",
        "q": "A shared `Gateway` named `public` lives in namespace `infra`. An `HTTPRoute` in namespace `shop` references it in `parentRefs`, but its status shows `Accepted: False` with reason `NotAllowedByListeners`. What change fixes this without moving the route?",
        "o": [
          "Add `ingressClassName: public` to the HTTPRoute so the Gateway controller claims it.",
          "Recreate the HTTPRoute as an Ingress, since routes cannot cross namespaces.",
          "Set the listener's `allowedRoutes.namespaces.from` to `All` or a `Selector` matching `shop`.",
          "Create a ClusterRoleBinding that lets the `shop` namespace read Gateways."
        ],
        "a": 2,
        "e": "By default Gateway listeners accept routes only from the Gateway's own namespace (`from: Same`). Allowing `All` or a label `Selector` lets routes in other namespaces attach, which is how platform teams delegate routing."
      },
      {
        "id": "cka-25",
        "d": 3,
        "t": "Ingress Class",
        "q": "The cluster runs the ingress-nginx controller with IngressClass `nginx`, which is not marked as default. A newly created Ingress has no ADDRESS and the controller logs show nothing about it. What is the most probable cause?",
        "o": [
          "The backend Service is of type ClusterIP; Ingress requires NodePort backends.",
          "The Ingress does not set `spec.ingressClassName: nginx`, so no controller claims it.",
          "The `pathType` is `Prefix`; ingress-nginx only supports `Exact`.",
          "Ingress objects must be created in the controller's namespace."
        ],
        "a": 1,
        "e": "When no IngressClass is marked as default, controllers ignore Ingress objects without a matching `ingressClassName`. Setting it (or annotating the IngressClass as default) gets the Ingress reconciled."
      },
      {
        "id": "cka-26",
        "d": 4,
        "t": "WaitForFirstConsumer",
        "q": "A new PVC using StorageClass `fast-ssd` stays `Pending` with the event `waiting for first consumer to be created before binding`. No Pod uses it yet. What should you conclude?",
        "o": [
          "The CSI driver is broken and must be reinstalled before any PVC in the cluster can bind.",
          "The PVC requests more capacity than the StorageClass or backend quota allows.",
          "There is no default StorageClass, so the controller ignores the claim entirely.",
          "This is expected with `WaitForFirstConsumer`: provisioning happens once a Pod using the claim is scheduled."
        ],
        "a": 3,
        "e": "Delayed binding lets the scheduler pick the node first, so the volume is created in a compatible zone. The PVC will bind once a Pod referencing it is scheduled."
      },
      {
        "id": "cka-27",
        "d": 4,
        "t": "Access Modes",
        "q": "A Deployment with 3 replicas spread across different nodes must write to the same shared directory. Which PVC access mode and storage type satisfy this?",
        "o": [
          "`ReadWriteOnce` on a block device, because all replicas belong to the same Deployment.",
          "`ReadWriteOncePod`, which shares the volume among Pods of the same owner.",
          "`ReadWriteMany` backed by a shared file system such as NFS or CephFS.",
          "`ReadOnlyMany`, and each replica then writes into its own `subPath` directory."
        ],
        "a": 2,
        "e": "Only `ReadWriteMany` allows read-write mounts from multiple nodes, and it needs a backend that supports it, such as NFS or CephFS. `ReadWriteOnce` restricts the volume to a single node."
      },
      {
        "id": "cka-28",
        "d": 4,
        "t": "Reclaim Policy Retain",
        "q": "A PV with `persistentVolumeReclaimPolicy: Retain` was bound to a PVC that has been deleted. The PV now shows `Released`, and a new PVC requesting the same size stays `Pending`. How can the existing data volume be reused?",
        "o": [
          "Remove `spec.claimRef` from the PV (after verifying or cleaning its data) so it becomes `Available` again.",
          "Change the reclaim policy to `Delete`, which makes the PV available while keeping its data.",
          "Restart the kube-controller-manager so it rebinds Released volumes automatically.",
          "Create the new PVC in the `default` namespace, which can always claim Released volumes."
        ],
        "a": 0,
        "e": "Retained volumes keep a reference to the old claim and are not rebound automatically, to protect data. Clearing `claimRef` returns the PV to `Available` so a matching PVC can bind."
      },
      {
        "id": "cka-29",
        "d": 4,
        "t": "Volume Expansion",
        "q": "A database PVC of 20Gi is nearly full. Its StorageClass has `allowVolumeExpansion: true` and the CSI driver supports online expansion. What is the correct procedure?",
        "o": [
          "Create a second 40Gi PVC and change the PV's `claimRef` so the data moves to it.",
          "Raise `spec.resources.requests.storage` on the PVC and watch its conditions until the resize finishes.",
          "Edit the PV's `spec.capacity.storage`, which makes the CSI driver resize the disk.",
          "Delete the PVC and recreate it with a larger size; the Retain policy preserves the data."
        ],
        "a": 1,
        "e": "Expansion is requested on the PVC. The external resizer grows the volume and, if needed, the kubelet grows the file system. Shrinking is not supported, and editing the PV capacity does not resize storage."
      },
      {
        "id": "cka-30",
        "d": 5,
        "t": "Node NotReady",
        "q": "`kubectl get nodes` shows `node01` as `NotReady` for ten minutes. Pods on it are not being updated. What is the most effective first diagnostic step?",
        "o": [
          "Delete the node object with `kubectl delete node node01` so it re-registers automatically.",
          "Restart the kube-apiserver on the control plane so it refreshes all node heartbeats.",
          "SSH to `node01` and check the kubelet and runtime: `systemctl status kubelet`, `journalctl -u kubelet`.",
          "Run `kubectl drain node01 --force` and wait for the node to report Ready again."
        ],
        "a": 2,
        "e": "NotReady means the node has stopped reporting healthy status, usually because the kubelet or the container runtime is stopped, misconfigured or cannot reach the API server. Its service status and journal reveal the cause."
      },
      {
        "id": "cka-31",
        "d": 5,
        "t": "CrashLoopBackOff",
        "q": "Pod `worker-7d9c` is in `CrashLoopBackOff` with 14 restarts. `kubectl logs worker-7d9c` prints nothing useful because the new container has just started. How do you see why it crashed?",
        "o": [
          "`kubectl logs worker-7d9c --previous` to read the output of the last terminated container.",
          "`kubectl get events --field-selector type=Normal` to read the application stack trace.",
          "`kubectl exec worker-7d9c -- cat /var/log/messages` in the crashing container.",
          "`kubectl top pod worker-7d9c --containers` to see the exit reason."
        ],
        "a": 0,
        "e": "`--previous` (`-p`) returns logs from the previous container instance, which normally contain the fatal error. Combine with `kubectl describe pod` to see exit codes and the Last State reason."
      },
      {
        "id": "cka-32",
        "d": 5,
        "t": "ImagePullBackOff",
        "q": "A Deployment rolled out with image `registry.internal/payments:2.4` and the new Pods are in `ImagePullBackOff`. `kubectl describe pod` shows `pull access denied ... authorization failed`. The tag exists. What should you fix?",
        "o": [
          "Set `imagePullPolicy: Never` so the kubelet uses a copy cached on the node.",
          "Increase the Pod's memory limit, because image pulls fail when the container is OOMKilled.",
          "Rename the image to `docker.io/payments:2.4`, because private registries are not supported.",
          "Create a `docker-registry` Secret with valid credentials and add it to `imagePullSecrets`."
        ],
        "a": 3,
        "e": "An authorization failure on an existing tag means the kubelet is pulling without valid credentials. A registry Secret referenced by the Pod spec or attached to its ServiceAccount resolves it."
      },
      {
        "id": "cka-33",
        "d": 5,
        "t": "Pending by Node Selector",
        "q": "A Pod is `Pending` with `0/4 nodes are available: 1 node(s) had untolerated taint {node-role.kubernetes.io/control-plane: }, 3 node(s) didn't match Pod's node affinity/selector`. The Pod has `nodeSelector: disktype: ssd`. What is the best fix if the SSD worker is `node03`?",
        "o": [
          "Remove the control plane taint so the Pod can run there.",
          "Label the correct node: `kubectl label node node03 disktype=ssd`.",
          "Add a toleration for every taint so the selector is ignored.",
          "Set `nodeName: node03` and keep the selector, which is evaluated after binding."
        ],
        "a": 1,
        "e": "No worker carries the label the selector needs. Adding the label to the intended node satisfies the selector; removing control plane taints would place workloads on the control plane."
      },
      {
        "id": "cka-34",
        "d": 5,
        "t": "Broken kube-apiserver Manifest",
        "q": "After editing `/etc/kubernetes/manifests/kube-apiserver.yaml` to add an admission plugin, every `kubectl` command returns `The connection to the server 10.0.0.10:6443 was refused`. How do you find the error?",
        "o": [
          "Run `kubectl logs -n kube-system kube-apiserver-controlplane` to read the startup error.",
          "Reboot the control plane node so the API server starts again with its default flags.",
          "On the node, use `crictl ps -a` / `crictl logs` and `journalctl -u kubelet` to find the error.",
          "Run `kubeadm reset` and `kubeadm init` again to regenerate a valid API server manifest."
        ],
        "a": 2,
        "e": "With the API server down, kubectl cannot fetch logs. The container runtime and kubelet journal still have them: an invalid flag shows in the container logs, while YAML errors prevent the kubelet from even creating the static Pod."
      },
      {
        "id": "cka-35",
        "d": 5,
        "t": "Scheduler Down",
        "q": "New Pods across all namespaces stay `Pending` and `kubectl describe pod` shows no events at all, not even `FailedScheduling`. Existing Pods are healthy. Which component should you check first?",
        "o": [
          "kube-proxy, because it assigns IP addresses to new Pods.",
          "The `kube-scheduler` static Pod in `kube-system` (its manifest and logs).",
          "CoreDNS, because Pods wait for DNS registration before scheduling.",
          "The kubelet on every worker node, because it pulls Pods from the queue."
        ],
        "a": 1,
        "e": "A missing or crashing scheduler leaves `spec.nodeName` empty without emitting events. A `FailedScheduling` event would instead indicate that the scheduler is running but cannot fit the Pod."
      },
      {
        "id": "cka-36",
        "d": 5,
        "t": "OOMKilled",
        "q": "A Java service restarts several times a day. `kubectl describe pod` shows `Last State: Terminated, Reason: OOMKilled, Exit Code: 137`. Memory limit is 512Mi and JVM heap is set to 1Gi. What is the correct fix?",
        "o": [
          "Increase the CPU limit, because OOMKilled is triggered by sustained CPU throttling.",
          "Remove the readiness probe, which kills the container whenever it times out.",
          "Set `restartPolicy: Never` so the kernel stops killing the container.",
          "Align heap and limit: raise the limit above the JVM footprint or lower the heap size."
        ],
        "a": 3,
        "e": "Exit code 137 with reason OOMKilled means the container exceeded its memory limit and the kernel killed it. A heap larger than the limit guarantees this; size the limit for heap plus non-heap memory or bound the heap to the limit."
      },
      {
        "id": "cka-37",
        "d": 5,
        "t": "Readiness Probe Failing",
        "q": "Pods of `checkout` show `Running` but `READY 0/1`, and the Service returns 503 through the ingress. Events show `Readiness probe failed: HTTP probe failed with statuscode: 404`. What is happening?",
        "o": [
          "They are removed from Service endpoints because readiness fails, likely a wrong probe path or port.",
          "The kubelet restarts the containers each time the readiness probe fails, causing the 503s.",
          "The 404 comes from the ingress controller, which is unrelated to the Pod readiness.",
          "The Pods are still pulling their image; readiness becomes true automatically after the pull."
        ],
        "a": 0,
        "e": "Failing readiness probes remove Pods from EndpointSlices without restarting them (that is liveness). A 404 suggests the probe `path` or `port` does not match what the application exposes."
      },
      {
        "id": "cka-38",
        "d": 5,
        "t": "Cluster DNS Failure",
        "q": "Applications fail to resolve any Service name, while connections by ClusterIP work. Which approach best isolates the problem?",
        "o": [
          "Restart every application Deployment so each Pod regenerates its `/etc/resolv.conf`.",
          "Switch all Services to NodePort so applications can bypass cluster DNS.",
          "Check CoreDNS Pods, logs and `kube-dns` endpoints, then run `nslookup kubernetes.default` from a temp Pod.",
          "Edit `/etc/hosts` on every node to add the names of all cluster Services."
        ],
        "a": 2,
        "e": "Working ClusterIP connectivity points to DNS. Verifying CoreDNS health, its Service endpoints and its ConfigMap, plus a throwaway busybox lookup, quickly shows whether the issue is CoreDNS, its upstream, or policy blocking port 53."
      },
      {
        "id": "cka-39",
        "d": 5,
        "t": "Resource Usage Investigation",
        "q": "You are asked to write to `/opt/top-pod.txt` the name of the Pod using the most memory across all namespaces. metrics-server is installed. Which command gives you the answer directly?",
        "o": [
          "`kubectl describe nodes | grep -i memory`",
          "`kubectl top pods -A --sort-by=memory`",
          "`kubectl get pods -A -o wide --sort-by=.spec.containers[0].resources.limits.memory`",
          "`kubectl get --raw /metrics | grep container_memory`"
        ],
        "a": 1,
        "e": "`kubectl top` queries the Metrics API backed by metrics-server, and `--sort-by=memory` orders by current usage. Sorting by limits shows configuration, not consumption."
      },
      {
        "id": "cka-40",
        "d": 5,
        "t": "Container Runtime Failure",
        "q": "`node02` is NotReady. The kubelet journal repeats `failed to connect to /run/containerd/containerd.sock: connection refused`. What should you do?",
        "o": [
          "Reinstall kubeadm on the node and rejoin it to the cluster with a fresh token.",
          "Delete all Pods on node02 so the kubelet stops querying the container runtime.",
          "Change the kubelet to use the Docker shim, which is the default runtime in current Kubernetes versions.",
          "Restore the runtime with `systemctl enable --now containerd`, then verify with `crictl ps` and node status."
        ],
        "a": 3,
        "e": "The kubelet cannot manage containers when the CRI socket is unavailable. Restoring the containerd service fixes the node; dockershim was removed in Kubernetes 1.24."
      }
    ],
    "why": {
      "cka-01": [
        "A YAML export is not an etcd snapshot: it skips internal keys, cannot be restored with etcd tooling, and secrets and resource versions are lost.",
        null,
        "Copying the live data directory can capture an inconsistent state mid-write; use the snapshot API instead.",
        "etcd listens only on HTTPS with client certificate authentication; a plain HTTP request without certificates is rejected."
      ],
      "cka-02": [
        "`kubeadm reset` wipes the control plane configuration and would destroy the cluster rather than restore it.",
        "The API server does not hold the etcd data path; etcd itself must start from the restored directory.",
        null,
        "The restored directory contains etcd database files, not Kubernetes manifests that kubectl could apply."
      ],
      "cka-03": [
        null,
        "Upgrading the kubelet before the control plane can make it newer than the API server, which is unsupported; `kubeadm upgrade node` is for additional nodes.",
        "`kubeadm init` bootstraps a new cluster and must not be re-run on an existing control plane.",
        "Workers must never be newer than the API server, so the control plane is upgraded first."
      ],
      "cka-04": [
        "A binding in `ci` only grants permissions inside `ci`, not in `prod`.",
        "A ClusterRoleBinding grants the permissions in every namespace, violating least privilege.",
        "The RoleBinding must live in the namespace where permissions apply; a binding in `ci` cannot reference a Role in `prod`.",
        null
      ],
      "cka-05": [
        "`--token` expects an actual bearer token, not a ServiceAccount name; and deleting real Pods to test is destructive.",
        null,
        "`describe sa` shows tokens and secrets, not the RBAC permissions bound to it.",
        "`kubectl auth whoami` only shows your own identity, not the permissions of other accounts."
      ],
      "cka-06": [
        "Static Pods have no ReplicaSet; they are created by the kubelet from a file.",
        "Cordoning prevents scheduling of new Pods by the scheduler but does not affect static Pods managed by the kubelet.",
        null,
        "Force deletion removes the mirror object only; the kubelet recreates it from the manifest."
      ],
      "cka-07": [
        null,
        "`upload-certs` is for joining additional control plane nodes; it does not renew the expired bootstrap token.",
        "The error is about the bootstrap token, not about control plane certificates.",
        "CSR approval happens after a successful TLS bootstrap; it cannot revive an expired token."
      ],
      "cka-08": [
        "Deleting the PKI directory would also regenerate the CA, breaking every kubeconfig and node trust relationship.",
        "Kubelet certificate rotation only covers the kubelet's own client and serving certificates.",
        null,
        "Bootstrap token TTL is unrelated to certificate expiry."
      ],
      "cka-09": [
        "Uninstalling deletes all release resources, causing downtime and potentially data loss.",
        null,
        "Rolling back the Deployment directly leaves Helm's release record pointing at the broken revision, causing drift on the next upgrade.",
        "`--version` selects a chart version, which is unrelated to release revision numbers."
      ],
      "cka-10": [
        "A missing namespace produces `namespaces \"x\" not found`, not a missing kind error.",
        "Authorization failures return `Forbidden`, not `no matches for kind`.",
        "Without the operator the object would still be accepted; it would just not be reconciled.",
        null
      ],
      "cka-11": [
        "`Recreate` terminates all old Pods before starting new ones, guaranteeing downtime.",
        "`maxUnavailable: 1` drops capacity to 3 Pods during the rollout, which is what causes the errors.",
        null,
        "Allowing 100% unavailable can remove all old Pods before new ones are ready."
      ],
      "cka-12": [
        null,
        "Each undo creates a new revision, so a second undo returns to the broken revision 5 instead of reaching 3.",
        "`rollout restart` re-creates Pods with the current template; it has no revision flag.",
        "Scaling does not change the Pod template; the current broken revision would start again."
      ],
      "cka-13": [
        "Tolerations never attract Pods; this is documented behavior, not a bug.",
        "`PreferNoSchedule` is a softer repel effect and does not attract Pods.",
        "`NoExecute` tolerations control eviction from tainted nodes, not placement away from untainted ones.",
        null
      ],
      "cka-14": [
        "Metrics from `kubectl top` are near real time; they are not cached for a day.",
        null,
        "Limits are not used for scheduling decisions; requests are.",
        "There is no such automatic reservation; system reservations are explicitly configured via kubelet flags."
      ],
      "cka-15": [
        "Environment variables are not updated in running containers.",
        "ConfigMaps are only immutable when `immutable: true` is set.",
        null,
        "File refresh does not require a reboot and env vars never update in place."
      ],
      "cka-16": [
        null,
        "HPAs work in any namespace where the target workload lives.",
        "HPA supports Deployments, ReplicaSets and StatefulSets.",
        "`maxSurge` only affects rollouts, not scaling performed by the HPA."
      ],
      "cka-17": [
        "Bypassing eviction ignores the PDB and can drop the application below its required availability.",
        null,
        "PDBs apply to any workload with selected Pods, and deleting it removes the protection permanently.",
        "Stopping the kubelet makes the node NotReady and causes unplanned disruption after the eviction timeout."
      ],
      "cka-18": [
        "Service type does not affect endpoint selection; a NodePort with the same selector is equally empty.",
        "kube-proxy only programs the endpoints it receives; there are none to program.",
        "Recreated Pods keep the same labels and still would not match the selector.",
        null
      ],
      "cka-19": [
        null,
        "Including Egress also blocks outbound traffic, which the requirement explicitly excludes.",
        "An ingress rule with an empty `from` list allows traffic from all sources instead of denying it.",
        "This selects only Pods carrying the label `deny: all`, leaving the rest unprotected."
      ],
      "cka-20": [
        "Separate list items are ORed, allowing any Pod from payments namespaces or any `role: backend` Pod in `data`.",
        "A plain podSelector only matches Pods in the policy's own namespace and `team` is a namespace label.",
        null,
        "Pod labels are supported; dropping the podSelector would allow every Pod in payments namespaces."
      ],
      "cka-21": [
        "DNS traffic goes from the application to CoreDNS, not to the database Pods.",
        null,
        "Hard-coding addresses is brittle and does not scale as ClusterIPs change.",
        "Headless Services still rely on DNS to return Pod IPs."
      ],
      "cka-22": [
        "Proxy mode does not allocate external addresses.",
        "`externalTrafficPolicy` changes source IP and routing behavior but does not provision an address.",
        "DNS is not involved in allocating LoadBalancer IPs.",
        null
      ],
      "cka-23": [
        null,
        "The order is wrong: service name first, then namespace, then `svc`.",
        "This queries namespace `web`, where no `redis` Service exists, which is exactly why the bare name failed.",
        "`pod` records use dashed IP addresses, not Service names."
      ],
      "cka-24": [
        "`ingressClassName` is an Ingress field; HTTPRoutes attach through `parentRefs`.",
        "Gateway API explicitly supports cross-namespace attachment when the listener permits it.",
        null,
        "Route attachment is governed by the Gateway listener policy, not by RBAC on the namespace."
      ],
      "cka-25": [
        "Ingress backends are normally ClusterIP Services.",
        null,
        "ingress-nginx supports `Prefix`, `Exact` and `ImplementationSpecific`.",
        "Ingress objects belong in the application namespace, next to their Services."
      ],
      "cka-26": [
        "The message is informational, not an error from the CSI driver.",
        "A capacity problem would produce a provisioning failure event, not a wait for consumer.",
        "The claim explicitly names `fast-ssd`, so the default StorageClass is irrelevant.",
        null
      ],
      "cka-27": [
        "`ReadWriteOnce` allows mounting on a single node; replicas on other nodes would fail to attach.",
        "`ReadWriteOncePod` is even stricter: exactly one Pod.",
        null,
        "`ReadOnlyMany` cannot be written to, regardless of subPath."
      ],
      "cka-28": [
        null,
        "Changing the policy does not clear the old claim reference, and `Delete` would destroy the disk when released.",
        "Released PVs are never rebound automatically by design.",
        "Namespace has no effect on binding Released volumes."
      ],
      "cka-29": [
        "`claimRef` reassignment does not move or grow data.",
        null,
        "PV capacity is informational for binding; editing it does not resize the backing disk.",
        "Deleting the PVC risks data loss and recreating it will not bind to the old volume automatically."
      ],
      "cka-30": [
        "Deleting the node object loses its labels and taints and does not fix the underlying kubelet issue.",
        "Node heartbeats are sent by the kubelet; restarting the API server does not fix a silent node.",
        null,
        "Draining evicts workloads but does not diagnose or repair the node."
      ],
      "cka-31": [
        null,
        "Events contain Kubernetes lifecycle information, not application stack traces.",
        "You cannot reliably exec into a container that crashes on start, and it would show the new instance.",
        "`kubectl top` reports resource usage, not exit reasons."
      ],
      "cka-32": [
        "`Never` only works if the image already exists on the node, which is not the case.",
        "Image pulls happen before the container runs; memory limits do not affect them.",
        "Private registries are fully supported through image pull secrets.",
        null
      ],
      "cka-33": [
        "Running workloads on the control plane is a bad practice and the control plane also lacks the label.",
        null,
        "Tolerations do not bypass node selectors.",
        "Setting `nodeName` bypasses the scheduler but the kubelet still rejects the Pod if the selector does not match."
      ],
      "cka-34": [
        "`kubectl logs` needs the API server, which is down.",
        "Rebooting does not change the broken manifest; the API server will fail again.",
        null,
        "Resetting the cluster is destructive and unnecessary for a manifest typo."
      ],
      "cka-35": [
        "kube-proxy programs Service rules; Pod IPs come from the CNI after scheduling.",
        null,
        "Scheduling does not depend on DNS registration.",
        "The kubelet runs Pods already bound to its node; it does not pick unscheduled Pods."
      ],
      "cka-36": [
        "OOMKilled is caused by memory, not CPU throttling.",
        "Readiness probes never kill containers.",
        "The kernel would still kill the process; the Pod would simply stop instead of restarting.",
        null
      ],
      "cka-37": [
        null,
        "Readiness failures do not restart containers; only liveness probes do.",
        "The event explicitly comes from the kubelet's readiness probe against the Pod.",
        "The Pods are already Running, so the image has been pulled."
      ],
      "cka-38": [
        "Restarting applications regenerates the same resolv.conf and does not fix CoreDNS.",
        "Exposing Services via NodePort does not provide name resolution inside Pods.",
        null,
        "Pods do not use the node's `/etc/hosts`, and this approach does not scale."
      ],
      "cka-39": [
        "Node descriptions show allocated requests and limits, not per-Pod usage.",
        null,
        "This sorts by configured limits rather than actual memory consumption.",
        "The API server's /metrics endpoint does not expose per-container memory usage."
      ],
      "cka-40": [
        "Rejoining the node is unnecessary when only the runtime service is down.",
        "Deleting Pods does not restore the runtime and causes avoidable disruption.",
        "dockershim was removed in Kubernetes 1.24; containerd is the standard runtime.",
        null
      ]
    },
    "glossary": [
      { "term": "Static Pod", "cat": "Control Plane", "d": 1, "def": "A Pod managed directly by the kubelet from a manifest file in `staticPodPath`; the API shows only a read-only mirror Pod.", "tip": "Control plane components in kubeadm clusters are static Pods in `/etc/kubernetes/manifests`." },
      { "term": "etcdctl snapshot save", "cat": "Control Plane", "d": 1, "def": "Creates a consistent point-in-time backup of etcd through its client API.", "tip": "Always pass `--endpoints`, `--cacert`, `--cert` and `--key` copied from the etcd manifest." },
      { "term": "etcdutl snapshot restore", "cat": "Control Plane", "d": 1, "def": "Restores an etcd snapshot into a new data directory.", "tip": "Point the etcd static Pod's `etcd-data` hostPath at the new directory afterwards." },
      { "term": "kubeadm upgrade apply", "cat": "Lifecycle", "d": 1, "def": "Upgrades control plane components on the first control plane node to a target version.", "tip": "Other nodes use `kubeadm upgrade node`; upgrade one minor version at a time." },
      { "term": "RoleBinding", "cat": "Security", "d": 1, "def": "Grants the permissions of a Role or ClusterRole to subjects within one namespace.", "tip": "The binding's namespace determines where the permissions apply." },
      { "term": "kubectl auth can-i", "cat": "Security", "d": 1, "def": "Checks whether a subject may perform a verb on a resource, optionally impersonating with `--as`.", "tip": "ServiceAccounts are impersonated as `system:serviceaccount:<ns>:<name>`." },
      { "term": "CustomResourceDefinition", "cat": "Extensibility", "d": 1, "def": "Registers a new API kind so the API server can store custom resources.", "tip": "Wait for the `Established` condition before creating resources of the new kind." },
      { "term": "maxSurge / maxUnavailable", "cat": "Workloads", "d": 2, "def": "RollingUpdate parameters controlling extra and missing Pods during a Deployment rollout.", "tip": "`maxUnavailable: 0` keeps full capacity during updates." },
      { "term": "Taint and Toleration", "cat": "Scheduling", "d": 2, "def": "Taints repel Pods from nodes; tolerations allow Pods to schedule onto tainted nodes.", "tip": "Combine with node affinity to force placement onto dedicated nodes." },
      { "term": "PodDisruptionBudget", "cat": "Workloads", "d": 2, "def": "Limits how many Pods of an application can be voluntarily disrupted at once.", "tip": "`minAvailable` equal to replicas blocks every drain." },
      { "term": "EndpointSlice", "cat": "Networking", "d": 3, "def": "Scalable list of ready backend addresses for a Service, built from Pods matching its selector.", "tip": "Empty slices usually mean selector/label mismatch or no Ready Pods." },
      { "term": "NetworkPolicy", "cat": "Networking", "d": 3, "def": "Namespaced allow-list of ingress/egress traffic for selected Pods, enforced by the CNI plugin.", "tip": "Selectors inside one `from` element are ANDed; separate elements are ORed." },
      { "term": "Gateway API", "cat": "Networking", "d": 3, "def": "Role-oriented L4/L7 routing API with GatewayClass, Gateway and Route resources.", "tip": "Use `allowedRoutes` on listeners to let routes from other namespaces attach." },
      { "term": "WaitForFirstConsumer", "cat": "Storage", "d": 4, "def": "StorageClass binding mode that delays provisioning until a Pod using the PVC is scheduled.", "tip": "A Pending PVC with this mode is expected until a Pod consumes it." },
      { "term": "Reclaim Policy", "cat": "Storage", "d": 4, "def": "Defines what happens to a PV after its claim is deleted: `Delete` or `Retain`.", "tip": "Retained PVs go to `Released`; clear `claimRef` to reuse them." },
      { "term": "crictl", "cat": "Troubleshooting", "d": 5, "def": "CLI for CRI-compatible container runtimes used to inspect containers and logs on a node.", "tip": "Essential when the API server is down: `crictl ps -a`, `crictl logs <id>`." },
      { "term": "Exit Code 137", "cat": "Troubleshooting", "d": 5, "def": "Container killed with SIGKILL, commonly by the OOM killer when exceeding its memory limit.", "tip": "Look for `Reason: OOMKilled` under Last State in `kubectl describe pod`." },
      { "term": "metrics-server", "cat": "Troubleshooting", "d": 5, "def": "Cluster add-on that serves the Metrics API used by `kubectl top` and the HPA.", "tip": "Without it, `kubectl top` fails and HPA targets show `<unknown>`." }
    ]
  };
})(window);
