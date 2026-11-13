/* =========================================================================
   data/anthropic-associate/exam.js — Anthropic · Claude Certified Associate (CCAO-F) (English)
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["claude-associate"] = {
    "id": "claude-associate",
    "appId": "claude-associate",
    "provider": "Anthropic",
    "badge": "Claude · Associate (CCAO-F)",
    "icon": "✨",
    "color": "#e07a5f",
    "featured": true,
    "title": "Anthropic · Claude Certified Associate (CCAO-F)",
    "subtitle": "Output Evaluation, Workflow Integration, Governance, Projects, and Prompt Chaining",
    "passingScore": 72,
    "domains": {
      "1": "Output Evaluation and Validation (21%)",
      "2": "Integration into Business Workflows (16%)",
      "3": "Governance and Responsible AI (16%)",
      "4": "Prompting and Task Execution (14%)",
      "5": "Product and Surface Selection (12%)",
      "6": "Configuration and Troubleshooting (11%)",
      "7": "Advanced Structuring and Prompt Chaining (10%)"
    },
    "shortDomains": {
      "1": "Validation",
      "2": "Workflows",
      "3": "Governance",
      "4": "Prompting",
      "5": "Claude Products",
      "6": "Troubleshooting",
      "7": "Prompt Chaining"
    },
    "topics": [
      {
        "id": "ccao-t-1",
        "d": 1,
        "title": "1.1 · Output Evaluation and Validation (Rubrics, Factual Verification, and Ground Truth)",
        "html": "<table class=\"keytable\">\n<tr><th>Evaluation Dimension</th><th>Validation Criterion in the Workplace</th><th>Risk of Omission</th></tr>\n<tr><td><b>Factual Accuracy (Ground Truth)</b></td><td>Strict cross-checking of figures, dates, regulations, and citations against the company's primary sources (balance sheets, contracts, policies).</td><td>Propagation of eloquent hallucinations and erroneous data in executive documents.</td></tr>\n<tr><td><b>Predefined Rubrics</b></td><td>Prior definition of objective acceptance criteria (1-5 or binary scale) before inspecting the generated outputs.</td><td>Confirmation bias and subjective evaluation based on the mere fluency of the text.</td></tr>\n<tr><td><b>Golden Datasets</b></td><td>Fixed, representative set of test cases with human reference answers to compare prompt versions.</td><td>Inconsistent ad-hoc testing that makes it impossible to measure real regressions or improvements.</td></tr>\n<tr><td><b>Format Consistency</b></td><td>Verification of tables, required fields, delimiters, and the presentation structure requested in the prompt.</td><td>Outputs incompatible with downstream operational workflows or executive reports.</td></tr>\n</table>\n<p class=\"mt-2\"><b>Golden Rule:</b> Linguistic fluency does not equal truthfulness. A well-articulated, formal text can contain critical hallucinations; human validation against primary sources (ground truth) is mandatory before making business decisions.</p>"
      },
      {
        "id": "ccao-t-2",
        "d": 2,
        "title": "2.1 · Integration into Business Workflows (Human-in-the-Loop, Handoffs, and Triage)",
        "html": "<table class=\"keytable\">\n<tr><th>Operating Pattern</th><th>When to Apply It with Claude</th><th>Human Responsibility</th></tr>\n<tr><td><b>Mandatory Human-in-the-Loop (HITL)</b></td><td>High-impact decisions: credit denial, medical diagnoses, employment sanctions, crisis communications.</td><td>Substantive review and authorized sign-off; AI must never be the final automated decision-maker.</td></tr>\n<tr><td><b>Operational Handoff</b></td><td>Triage and drafting in customer support, sales, and commercial operations.</td><td>Personalize the communication with verified case data before formal delivery to the customer.</td></tr>\n<tr><td><b>Assisted Extraction and Cross-Checking</b></td><td>Detection of discrepancies in purchase contracts against the organization's standard templates.</td><td>Legal validation of the flagged clauses before proceeding to signature.</td></tr>\n<tr><td><b>Dual-Signature Protocols</b></td><td>High-value commercial proposals and quotes prepared with AI assistance.</td><td>Formal certification that every price, margin, and deadline has been verified against current rates.</td></tr>\n</table>\n<p class=\"mt-2\"><b>Principle of Accountability:</b> AI accelerates synthesis and drafting, but civil, legal, and commercial liability to third parties always rests with the organization's professionals.</p>"
      },
      {
        "id": "ccao-t-3",
        "d": 3,
        "title": "3.1 · Governance and Responsible AI (Anthropic AUP, Privacy, and PII Redaction)",
        "html": "<table class=\"keytable\">\n<tr><th>Governance Area</th><th>Key Compliance Guideline</th><th>Control Mechanism</th></tr>\n<tr><td><b>Acceptable Use Policy (AUP)</b></td><td>Strict prohibition of weapons, cyberattacks on critical infrastructure, election disinformation, and regulated advice without supervision.</td><td>Anthropic's native safety filters and internal audits of use cases.</td></tr>\n<tr><td><b>PII Redaction (Sensitive Data)</b></td><td>Replacement of names, national ID numbers, credit cards, salaries, and home addresses with synthetic identifiers before the prompt.</td><td>Prior anonymization protocols and perimeter data loss prevention (DLP) filters.</td></tr>\n<tr><td><b>Claude for Work (Zero Training)</b></td><td>On Team and Enterprise plans, Anthropic guarantees that data, prompts, and documents are not used to train models.</td><td>Formal corporate agreement and Data Processing Addendum (DPA) compliant with GDPR.</td></tr>\n<tr><td><b>Over-reliance</b></td><td>Tendency of employees to assume outputs are infallible because they sound coherent and persuasive.</td><td>Ongoing training, mandatory rubrics, and active source verification.</td></tr>\n</table>\n<p class=\"mt-2\"><b>Corporate Isolation:</b> Prohibit uploading trade secrets or proprietary code to free or personal consumer accounts. Always use enterprise environments with SSO and controlled retention policies.</p>"
      },
      {
        "id": "ccao-t-4",
        "d": 4,
        "title": "4.1 · Strategic Prompting and Task Execution (Structure, Context, and Delimiters)",
        "html": "<table class=\"keytable\">\n<tr><th>Prompt Component</th><th>Practical Function</th><th>Implementation Example</th></tr>\n<tr><td><b>Role (System Prompt)</b></td><td>Frames the perspective, level of expertise, and professional tone required.</td><td><i>\"Act as a senior financial auditor specialized in treasury risk...\"</i></td></tr>\n<tr><td><b>XML Delimiters</b></td><td>Clearly separate the business instructions from the raw data to be processed.</td><td>Use of tags such as <code>&lt;context&gt;</code>, <code>&lt;document&gt;</code>, and <code>&lt;instructions&gt;</code>.</td></tr>\n<tr><td><b>Few-Shot Prompting</b></td><td>Provides 2 or 3 approved real examples to fix the tone and structure without ambiguity.</td><td>Input/output pairs representative of the company's institutional voice and format.</td></tr>\n<tr><td><b>Negative Constraints</b></td><td>Sets explicit limits to avoid digressions, assumptions, or invented additions.</td><td><i>\"Do not add commitments not specified in the text; respond 'Not stated' if the data is missing.\"</i></td></tr>\n<tr><td><b>Prior Reasoning</b></td><td>Asks the model to think step by step before issuing the final conclusion.</td><td><i>\"First analyze the key clauses and then issue the risk recommendation.\"</i></td></tr>\n</table>"
      },
      {
        "id": "ccao-t-5",
        "d": 5,
        "title": "5.1 · Product and Surface Selection (Claude Projects, Artifacts, and Plans)",
        "html": "<table class=\"keytable\">\n<tr><th>Surface / Feature</th><th>When It Is the Right Choice</th><th>When NOT to Use It</th></tr>\n<tr><td><b>Claude Projects</b></td><td>Team collaboration with persistent document memory (policies, catalogs) and shared instructions.</td><td>One-off, isolated, or ad-hoc queries that do not require historical context or shared documents.</td></tr>\n<tr><td><b>Artifacts</b></td><td>Substantial reusable deliverables: lengthy documents, interactive SVG diagrams, complex tables, and code components.</td><td>Brief conversational replies, confirmations, or text exchanges of fewer than 10 lines.</td></tr>\n<tr><td><b>Standard Chat</b></td><td>Quick queries, initial brainstorming, and ephemeral explorations without document persistence.</td><td>Recurring team work that requires loading the same 10 manuals on every chat turn.</td></tr>\n<tr><td><b>Claude Team / Enterprise</b></td><td>Organizations that require SSO, an admin console, centralized billing, and a formal no-training guarantee.</td><td>Purely personal or recreational use with no company data or privacy requirements.</td></tr>\n</table>"
      },
      {
        "id": "ccao-t-6",
        "d": 6,
        "title": "6.1 · Configuration and Troubleshooting (Context Drift, Turn Limits, and Documentation)",
        "html": "<table class=\"keytable\">\n<tr><th>Operational Problem</th><th>Underlying Cause</th><th>Recommended Solution</th></tr>\n<tr><td><b>Context Drift</b></td><td>Excessively long chats (30+ turns) where the model loses attention to early guidelines.</td><td>Open a new focused chat summarizing the key agreements and closing obsolete threads.</td></tr>\n<tr><td><b>Factual Hallucination</b></td><td>Absence of explicit document context or implicit permission for the model to make things up.</td><td>Anchor to the document with the instruction: <i>\"Base your answer only on the attached text; if it is not included, state 'Not stated'.\"</i></td></tr>\n<tr><td><b>Truncated Output</b></td><td>The maximum output token limit for a conversation turn was reached.</td><td>Send the command <i>\"Continue exactly where you left off\"</i> or ask for structuring by sections.</td></tr>\n<tr><td><b>Contradictions in Projects</b></td><td>Obsolete files or conflicting versions loaded into the project's knowledge base.</td><td>Audit and purge the Project's documents, retaining only the current approved version.</td></tr>\n</table>"
      },
      {
        "id": "ccao-t-7",
        "d": 7,
        "title": "7.1 · Advanced Structuring and Prompt Chaining (Modular Decomposition vs. Mega-Prompt)",
        "html": "<table class=\"keytable\">\n<tr><th>Chain Stage</th><th>Operational Objective</th><th>Quality Checkpoint</th></tr>\n<tr><td><b>Step 1: Extraction</b></td><td>Isolate facts, numerical data, or key clauses from the lengthy source document.</td><td>Validate that no table rows were omitted and no units of measure were mixed up.</td></tr>\n<tr><td><b>Step 2: Analysis and Cross-Referencing</b></td><td>Compare the extracted data against risk policies, thresholds, or internal guidelines.</td><td>Verify the analytical logic before generating persuasive writing or conclusions.</td></tr>\n<tr><td><b>Step 3: Final Drafting</b></td><td>Synthesize the conclusions into the final executive format (Artifact, table, or memo).</td><td>Human review of style, tone, and compliance with the final deliverable's constraints.</td></tr>\n<tr><td><b>Mega-Prompt Failure</b></td><td>Trying to have the model extract, analyze, weigh, and write 20 pages in a single instruction.</td><td>The model omits intermediate details, dilutes constraints, and saturates the generation limit.</td></tr>\n</table>\n<p class=\"mt-2\"><b>Best Practice:</b> Prompt Chaining allows intermediate outputs to be inspected and corrected before errors propagate to later stages, achieving institutional-quality results.</p>"
      }
    ],
    "questions": [
      {
        "id": "ccao-01",
        "d": 1,
        "t": "Quality Rubrics and Prior Criteria",
        "q": "A sales team uses Claude to draft executive summaries intended for key clients. Before reviewing the first drafts generated by the model, what is the recommended methodological best practice for objectively evaluating the quality of the text and avoiding cognitive biases?",
        "o": [
          "Define a formal rubric with objective criteria (factual accuracy, tone, and length limits) before reading the drafts.",
          "First read several drafts in an open-ended way to intuitively identify which sounds most eloquent and adopt that style.",
          "Configure the output as a technical JSON schema so that an automated validator checks the syntax without the need for human intervention.",
          "Ask Claude in a second prompt to rate its own responses from 1 to 10 and accept only those with a perfect score."
        ],
        "a": 0,
        "e": "Defining an objective evaluation rubric before interacting with the model prevents confirmation bias and avoids confusing mere text fluency with business quality."
      },
      {
        "id": "ccao-02",
        "d": 1,
        "t": "Factual Verification Against Primary Sources",
        "q": "While validating a financial report drafted by Claude from a balance sheet in PDF format, an analyst notices that two figures in the summary table differ from those in the original balance sheet. What is the appropriate professional and operational conduct in this scenario?",
        "o": [
          "Assume that Claude applied a smart accounting adjustment for inflation or seasonality not stated in the original document.",
          "Check each figure directly against the official source financial statements before approving and circulating the report.",
          "Ask Claude in the same chat whether its calculations are true and accept the figures as correct if it answers yes.",
          "Modify the original balance sheet to align it with the more favorable and optimistic conclusions presented in Claude's table."
        ],
        "a": 1,
        "e": "Factual accuracy requires always checking generated data against the primary source (ground truth). A numerical discrepancy must never be assumed to be a valid accounting adjustment."
      },
      {
        "id": "ccao-03",
        "d": 1,
        "t": "Evaluation with Golden Datasets",
        "q": "The operations team wants to compare the performance of three different prompt versions for classifying customer technical support tickets. Which tool or methodological approach provides the most reliable and repeatable comparative evaluation?",
        "o": [
          "Test each prompt version with two or three hypothetical cases made up on the spot in an ephemeral chat session.",
          "Automatically select the prompt version that produces the longest responses with the richest technical vocabulary.",
          "Evaluate each prompt version against a fixed test set (`Golden Dataset`) with previously validated human answers.",
          "Ask a novice user to subjectively choose which of the three prompt versions is written in the most pleasant style."
        ],
        "a": 2,
        "e": "A `Golden Dataset` with curated real examples and human reference answers makes it possible to measure accuracy and compare prompt changes in a standardized, scientific way."
      },
      {
        "id": "ccao-04",
        "d": 1,
        "t": "Factual Grounding and Exception Prevention",
        "q": "An online retail store uses Claude to answer questions about product returns. Which prompt instruction minimizes the risk of the model inventing customer-favorable business exceptions that are not covered by the policies?",
        "o": [
          "Instruct Claude to be understanding and authorize extraordinary returns whenever the buyer expresses obvious frustration.",
          "Allow the model to fill gaps in the policy based on common global e-commerce practices.",
          "Increase the output token limit so the assistant can suggest possible alternative legal settlements outside the internal rules.",
          "Attach the official policy and instruct Claude to answer based only on it and to state when a query exceeds its limits."
        ],
        "a": 3,
        "e": "Strict grounding in the attached text, together with an explicit instruction to state when a query falls outside the policy, prevents hallucinations and unauthorized concessions."
      },
      {
        "id": "ccao-05",
        "d": 1,
        "t": "Hallucination Detection and Mitigation",
        "q": "While auditing a legal memorandum drafted with Claude, a lawyer discovers that the text cites a nonexistent statute article with complete rhetorical conviction. How is this phenomenon technically classified, and what is the mandatory safeguard in the workflow?",
        "o": [
          "Factual hallucination; it is mitigated by requiring verifiable verbatim citations checked against official legislation and mandatory human review.",
          "Context drift; it is corrected by doubling the number of legal documents uploaded to the thread so the model has more options.",
          "Copyright violation; it is resolved by asking the courts for authorization for the commercial use of legislative texts.",
          "Token drift; it is resolved by removing line breaks from the prompt to force the model to stick to the current penal code."
        ],
        "a": 0,
        "e": "A hallucination occurs when the model generates false information that appears certain. In regulated fields, requiring verbatim citations and human validation by experts is essential."
      },
      {
        "id": "ccao-06",
        "d": 1,
        "t": "Essential Criteria in HR Rubrics",
        "q": "A quality committee designs a formal rubric to evaluate the responses generated by Claude in an internal portal for employee labor inquiries. Which TWO dimensions should be weighted as a priority to ensure rigor and compliance? (Select 2)",
        "o": [
          "Factual accuracy and verifiable grounding in the company's current collective agreements and labor policies.",
          "Strict adherence to professional corporate tone guidelines and respect for staff privacy rules.",
          "Mandatory response length to ensure each answer always exceeds a minimum of four detailed paragraphs.",
          "Predominant use of complex legal terminology to project maximum formal authority toward employees."
        ],
        "a": [
          0,
          1
        ],
        "e": "Factual accuracy and a professional tone that respects privacy are the fundamental pillars in human resources queries; forced length and excessive jargon are counterproductive."
      },
      {
        "id": "ccao-07",
        "d": 1,
        "t": "Tone Standardization Through Few-Shot",
        "q": "A customer service supervisor notices that Claude responds in a very informal style to retail banking customers and with excessive coldness to private banking customers. What is the most effective and lasting way to standardize the communication tone?",
        "o": [
          "Write warnings in capital letters threatening the model with performance penalties if it changes style between turns.",
          "Include in the base prompt two or three concrete examples (`Few-Shot`) of the expected empathetic and formal tone for each segment.",
          "Instruct customers to adapt their questions to the model by writing them in a fixed fifty-word structure.",
          "Manually rewrite each Claude response before sending it, without documenting or changing the original prompt guidelines."
        ],
        "a": 1,
        "e": "Using demonstrative examples (few-shot prompting) is the most effective technique for setting tone, formality, and communication structure in business scenarios."
      },
      {
        "id": "ccao-08",
        "d": 1,
        "t": "Linguistic Fluency Risk in Contracts",
        "q": "When auditing the quality of commercial contract summaries generated by Claude, why is it negligent to rely exclusively on the fluency of the writing as an indicator of accuracy?",
        "o": [
          "A polished style and perfect syntax show that the model consulted public records in real time.",
          "Language models produce flawless prose only when all the premises analyzed are 100% correct.",
          "Grammatical fluency and conviction can mask the accidental omission of critical indemnification clauses or deadlines.",
          "Excessive stylistic fluency immediately triggers security firewalls at Anthropic that cancel the corporate account."
        ],
        "a": 2,
        "e": "Syntactic coherence does not guarantee factual integrity. A well-written summary can sound flawless while omitting penalties or critical expiration clauses."
      },
      {
        "id": "ccao-09",
        "d": 1,
        "t": "Role of the Human Reviewer in Commercial Proposals",
        "q": "A sales team uses Claude to speed up the drafting of customized commercial proposals for public tenders. What is the irreplaceable role of the human reviewer in this workflow (`Human-in-the-Loop`)?",
        "o": [
          "Monitor the rate at which tokens appear on screen to check network latency during text generation.",
          "Systematically replace all nouns with manual synonyms to eliminate any recognizable trace of AI.",
          "Disable the corporate firewall controls to allow Claude to download confidential customer data from the internet.",
          "Validate prices, delivery times, and contractual commitments before the formal, binding submission of the bid."
        ],
        "a": 3,
        "e": "In binding proposals, the human reviewer ensures that the price, deadline, and legal-condition commitments are feasible and consistent with the company's capabilities."
      },
      {
        "id": "ccao-10",
        "d": 1,
        "t": "Objective Metrics for Complaint Classification",
        "q": "In an assisted automation project to classify customer complaints by severity level (Low, Medium, High, Critical), which objective metric makes it possible to evaluate the model's quality without relying on personal impressions?",
        "o": [
          "The exact match rate against a batch of complaints previously labeled by specialists in the area.",
          "The average speed at which the human reviewer manages to read and approve the classified summaries in the system's user interface.",
          "The total number of positive adjectives the model adds to its analysis to soften the customer's discontent.",
          "The number of characters and explanatory paragraphs Claude provides to defend each severity classification."
        ],
        "a": 0,
        "e": "Exact match against a sample labeled by human experts (ground truth) is the standard metric for objectively measuring the accuracy of a classification task."
      },
      {
        "id": "ccao-11",
        "d": 1,
        "t": "Diagnosing Failures in Complex Tables",
        "q": "While evaluating a prompt to extract key data from supplier invoices, Claude accurately extracts simple invoices but omits entire lines in invoices with complex multi-page tables. What is the correct methodological procedure?",
        "o": [
          "Require all suppliers in the market to abandon tables and submit only linear plain-text documents.",
          "Examine the failed cases, enrich the prompt with structured examples of complex tables, and revalidate with the test dataset.",
          "Accept a 30% omission rate in tables, assuming language models are not ready for the workplace.",
          "Delete the original test dataset and evaluate the prompt only with simple invoices to certify a 100% success rate."
        ],
        "a": 1,
        "e": "The iterative quality cycle in AI consists of analyzing errors, providing examples of the complex structures in the prompt (few-shot), and measuring again against the test dataset."
      },
      {
        "id": "ccao-12",
        "d": 1,
        "t": "Strategic Purpose of Evaluation Rubrics",
        "q": "What is the main organizational advantage of designing and documenting an evaluation rubric before deploying a Claude-based assistant in a business area?",
        "o": [
          "Automatically reduce token consumption and secure a discount on the platform's monthly subscription fee.",
          "Completely eliminate the need for future audits by guaranteeing that the model will always respond without failures.",
          "Establish a transparent, agreed-upon standard for determining whether responses meet the expected quality requirements.",
          "Force the model to respond with the same number of words regardless of the complexity of the query."
        ],
        "a": 2,
        "e": "A prior rubric aligns business expectations, provides measurable criteria for audits, and clearly defines what constitutes an acceptable response for the company."
      },
      {
        "id": "ccao-13",
        "d": 2,
        "t": "Assisted Triage of Medical Claims",
        "q": "A health insurer wants to reduce the processing time for medical reimbursement claims. Which workflow architecture optimally combines operational speed and safety for policyholders?",
        "o": [
          "Configure Claude to settle and order bank transfers autonomously without any human review.",
          "Require a physician to manually transcribe each receipt so that Claude only drafts a generic welcome email.",
          "Delegate to Claude the final rejection of doubtful claims, preventing the policyholder from appealing the decision with an operator.",
          "Use Claude to extract data and classify the claim, leaving the reimbursement approval to a qualified human adjuster."
        ],
        "a": 3,
        "e": "The recommended pattern uses Claude to speed up data extraction and triage, reserving financial authorization and the final decision for human professionals."
      },
      {
        "id": "ccao-14",
        "d": 2,
        "t": "Handoff Protocol in Customer Support",
        "q": "A customer service representative uses Claude to draft replies to complex complaints from dissatisfied users. Which action ensures a safe and empathetic handoff (`handoff`)?",
        "o": [
          "The representative reads the draft, validates the case data, adjusts the message with genuine empathy, and takes ownership of signing the response.",
          "The representative sets up a script that immediately forwards the first draft generated by Claude to customers without any prior reading.",
          "The representative tells the customer to go directly to the Claude platform to debate their contractual disagreements.",
          "The representative removes references to the customer's problem to prevent the customer from replying with requests for further clarification."
        ],
        "a": 0,
        "e": "A responsible handoff requires the human agent to validate the data, adjust the tone to the customer's particular circumstances, and take formal responsibility for the message."
      },
      {
        "id": "ccao-15",
        "d": 2,
        "t": "Assisted Review of Supplier Contracts",
        "q": "The procurement department receives draft contracts from various international suppliers. What is the most productive and safe way to integrate Claude into the review workflow for these documents?",
        "o": [
          "Dispense with the legal team and digitally sign contracts whenever Claude raises no warning in the chat.",
          "Use Claude to compare the contract against the company's standard policies and generate a list of discrepancies for the lawyers.",
          "Upload the contracts to open social networks so external users can check whether the clauses are common in other countries.",
          "Ask Claude to rewrite the contract by removing all arbitration clauses and liability limits without consulting the legal department."
        ],
        "a": 1,
        "e": "Claude excels as a critical reading assistant, identifying divergences from corporate templates so lawyers can focus their time on the risk points."
      },
      {
        "id": "ccao-16",
        "d": 2,
        "t": "Integrity in Financial Reports for Investors",
        "q": "A wealth advisory firm prepares quarterly summaries for institutional investors. How should the workflow be structured to guarantee the full accuracy of the projections and analyses generated?",
        "o": [
          "Allow Claude to make macroeconomic predictions based on unverified financial forums on the internet.",
          "Omit the risk warnings section from the final document if Claude suggests an extraordinarily favorable return outlook.",
          "Provide audited data to the model, generate the preliminary narrative analysis, and validate every ratio and claim with the finance team.",
          "Publish the summaries immediately on the investor portal before internal review in order to be the first in the market to disclose data."
        ],
        "a": 2,
        "e": "Financial rigor requires providing validated information as context, using the model to draft the qualitative analysis, and subjecting the result to review by the accounting team."
      },
      {
        "id": "ccao-17",
        "d": 2,
        "t": "Governance in Personnel Selection",
        "q": "The talent acquisition team uses Claude to summarize transcripts of job interviews with candidates. Which governance guideline must be followed in this selection process?",
        "o": [
          "Configure an algorithmic filter that automatically rejects a candidate if their spoken transcript has a low or negative sentiment score.",
          "Use the model to infer the candidate's age, gender, or cultural origin and balance internal hiring quotas.",
          "Share candidates' full audio recordings with competing companies to create blacklists of applicants in the sector.",
          "Use the summaries as informational support material, reserving the decision to advance in the process to the judgment of human evaluators."
        ],
        "a": 3,
        "e": "AI in recruiting should act only as documentary support. Decisions on selection, rejection, or hiring must be made by people to prevent discrimination and bias."
      },
      {
        "id": "ccao-18",
        "d": 2,
        "t": "Mandatory Human-in-the-Loop Checkpoints",
        "q": "In which TWO of the following workplace situations is it strictly mandatory to apply a human checkpoint and approval (`Human-in-the-Loop`) before releasing the output generated with Claude? (Select 2)",
        "o": [
          "Formal issuance of a communication notifying the denial of a mortgage or the cancellation of an insurance contract.",
          "Publication of an emergency press release in response to a cybersecurity incident involving compromised confidential data.",
          "Grammar correction of an informal internal memo about the room change for the Tuesday sync meeting.",
          "Generation of a preliminary list of creative names for an internal corporate environmental volunteering campaign."
        ],
        "a": [
          0,
          1
        ],
        "e": "Decisions with direct financial or legal impact on people (credit) and public crisis communications require mandatory human oversight and approval."
      },
      {
        "id": "ccao-19",
        "d": 2,
        "t": "Content Consistency with Claude Projects",
        "q": "A marketing department with eight writers produces corporate articles for the company blog. To ensure that all posts maintain a consistent brand voice regardless of who writes the prompt, what is the best practice?",
        "o": [
          "Centralize the style guide, audience profile, and approved articles in a `Claude Project` shared by the whole team.",
          "Ask each writer to use individual free accounts and freely apply their own personal style criteria without common guidelines.",
          "Instruct the writers not to provide company context in order to encourage maximum diversity of opinions.",
          "Prohibit the use of examples in prompts to prevent the model from repeating previously used phrasing."
        ],
        "a": 0,
        "e": "A `Claude Project` lets you share a reference knowledge base (Project Knowledge) and joint instructions, ensuring consistency of style and tone across all writers."
      },
      {
        "id": "ccao-20",
        "d": 2,
        "t": "Preventing Overreliance in Quotes",
        "q": "The sales director of an industrial company notices that several account executives copy quotes generated by Claude and send them to customers without checking unit prices or discounts. What operational measure should be implemented to address this problem?",
        "o": [
          "Immediately shut down access to any artificial intelligence tool across the entire company and financially penalize the whole sales team.",
          "Establish a formal verification protocol where the salesperson must tick a control box certifying the accuracy of each figure.",
          "Install a bot that automatically approves all quotes whenever the total exceeds ten thousand euros.",
          "Hide the official rates from salespeople so that they depend exclusively on the AI model's intrinsic memory."
        ],
        "a": 1,
        "e": "Imposing an explicit verification step with a signature or responsible confirmation reinforces the human control role and prevents the automatic copying of unvalidated data."
      },
      {
        "id": "ccao-21",
        "d": 2,
        "t": "Value of Assisted Triage in the Help Desk",
        "q": "In a corporation's user support center, Claude is implemented to generate proposed solutions for software incidents. What essential advantage does this model provide compared to 100% unattended resolution without humans?",
        "o": [
          "It makes it possible to dispense entirely with specialized level 1 technicians and shift the entire support payroll to corporate cloud compute costs.",
          "It mathematically guarantees that the main servers will not require security patches or scheduled maintenance.",
          "It speeds up the search for preliminary diagnoses while keeping the human analyst's judgment to validate the solution before applying it.",
          "It makes it possible to restart core production servers instantly without needing to validate access credentials."
        ],
        "a": 2,
        "e": "The collaborative approach leverages Claude's speed to structure the solution and leaves verification to the technician before making changes to systems."
      },
      {
        "id": "ccao-22",
        "d": 3,
        "t": "PII Anonymization and Redaction",
        "q": "An HR analyst wants to use Claude to summarize a salary spreadsheet that includes full names, national ID numbers, and salaries. According to corporate privacy and data governance principles, which prior step is indispensable?",
        "o": [
          "Upload the original file directly in a private chat, assuming individual accounts are not subject to internal rules.",
          "Ask Claude in the prompt to keep the salary information secret and to promise to erase it from its memory after responding.",
          "Share the chat's public link with other analysts so they can check whether the personal data is easily recognizable.",
          "Anonymize the spreadsheet by replacing names and ID numbers with synthetic codes (Employee 1, Employee 2) before loading the text."
        ],
        "a": 3,
        "e": "Before transferring information to any language model, personally identifiable information (PII) must be anonymized or replaced with synthetic data to comply with privacy regulations."
      },
      {
        "id": "ccao-23",
        "d": 3,
        "t": "Anthropic Acceptable Use Policy (AUP)",
        "q": "An IT security consultant asks Claude for step-by-step instructions to compromise an industrial control system (SCADA) at a drinking water treatment plant. Why does the model refuse this request?",
        "o": [
          "It is a direct violation of Anthropic's Acceptable Use Policy (`AUP`), which prohibits facilitating cyberattacks on critical infrastructure.",
          "Claude lacks theoretical concepts about SCADA networks and industrial systems because it was trained only on classical literature.",
          "The query exceeds the standard context token limit available for professional accounts in the chat environment.",
          "A notarized authorization issued by the ministry of industry is required to unlock answers about sanitation networks."
        ],
        "a": 0,
        "e": "Anthropic's Acceptable Use Policy (AUP) expressly prohibits providing operational instructions for cyberattacks and for compromising critical infrastructure."
      },
      {
        "id": "ccao-24",
        "d": 3,
        "t": "Privacy and Training in Business Plans",
        "q": "When adopting Claude for Work on business plans (Team or Enterprise), what is Anthropic's formal commitment regarding training its artificial intelligence models on customer data?",
        "o": [
          "Anthropic automatically adds all uploaded corporate documents to the training corpus of its upcoming commercial models.",
          "Anthropic guarantees that it does not train its foundation models on the data, documents, or prompts uploaded by corporate customers.",
          "The data is anonymously handed over to partner universities for sociological research on office writing habits.",
          "Only documents written in English are excluded from training, while other languages are used freely."
        ],
        "a": 1,
        "e": "In the business editions (Team and Enterprise), Anthropic establishes by contract that it does not use the customer's inputs or documents to train or fine-tune its models."
      },
      {
        "id": "ccao-25",
        "d": 3,
        "t": "Guidelines in Financial Advice",
        "q": "A commercial bank is considering incorporating Claude into its online banking to guide customers on investment options and mortgage loans. Which responsible AI principle should govern this initiative?",
        "o": [
          "Publicly promote the model as a certified financial advisor capable of making autonomous, binding investment decisions on behalf of the retail customer.",
          "Contractually guarantee customers that the financial projections calculated by Claude have a 100% assured return.",
          "Clearly state that the responses are merely indicative and that any formal decision requires validation by a qualified human advisor.",
          "Remove any mention of macroeconomic risks from the responses to encourage immediate uptake of bank loans."
        ],
        "a": 2,
        "e": "In regulated sectors such as finance, AI must function as an indicative informational assistant, making clear that binding decisions require certified advisors."
      },
      {
        "id": "ccao-26",
        "d": 3,
        "t": "Prohibited Uses under the Acceptable Use Policy",
        "q": "According to Anthropic's Acceptable Use Policy (`Acceptable Use Policy`), which TWO of the following activities are strictly prohibited on the platform? (Select 2)",
        "o": [
          "Designing or facilitating biological, chemical, or radiological weapons or material for malicious cyberattacks.",
          "Coordinated generation of content for covert election disinformation campaigns or vote manipulation.",
          "Preparing comparison tables of open-source software costs to support internal purchasing decisions.",
          "Translation of occupational risk prevention manuals from Spanish to English for construction site personnel."
        ],
        "a": [
          0,
          1
        ],
        "e": "Anthropic's AUP strictly prohibits weapons proliferation and cyberattacks, as well as election interference through coordinated disinformation."
      },
      {
        "id": "ccao-27",
        "d": 3,
        "t": "Clinical Governance in Healthcare",
        "q": "A hospital plans to use Claude to draft explanatory self-care guides for patients diagnosed with hypertension. What is the fundamental ethical and operational requirement before distributing the material?",
        "o": [
          "Allow patients to use the model to adjust their daily medication doses without needing to see a doctor.",
          "Conceal that the drafts had AI assistance to prevent the bioethics committee from requesting a review of the document.",
          "Distribute the printed guides immediately as long as the typographic design and colors match the hospital's manual.",
          "Submit all drafted clinical content to formal review and express approval by licensed medical specialists."
        ],
        "a": 3,
        "e": "Any medical information intended for patients must be rigorously validated by licensed health personnel to prevent errors and health misinformation."
      },
      {
        "id": "ccao-28",
        "d": 3,
        "t": "Over-reliance Risk",
        "q": "Which option most accurately describes the phenomenon of over-reliance (`over-reliance`) in the deployment of artificial intelligence models in business organizations?",
        "o": [
          "The psychological tendency of employees to accept the model's outputs as true without subjecting them to critical verification.",
          "The technical overload of local networks caused by sending too many heavy PDF files simultaneously through the corporate web browser.",
          "Managers' preference for hiring data analysts rather than training existing staff in office software.",
          "The technical mistake of using identical network passwords for access to the corporate AI platform."
        ],
        "a": 0,
        "e": "Over-reliance occurs when users stop verifying outputs because the AI writes eloquently and persuasively, causing business errors."
      },
      {
        "id": "ccao-29",
        "d": 3,
        "t": "AI Usage Policies for Contractors",
        "q": "An engineering company hires external consultants to collaborate on the design of a new engine. Which security clause must be stipulated in the generative AI tool usage policy for these professionals?",
        "o": [
          "Require them to use only free consumer trial versions to avoid incurring additional expenses in the billing of the contracted project.",
          "Expressly prohibit entering blueprints, proprietary source code, or trade secrets into unmanaged personal accounts.",
          "Require contractors to translate all specifications into French before making any conceptual query to the AI.",
          "Impose daily deletion of browser history without keeping any record of the deliverables that were AI-assisted."
        ],
        "a": 1,
        "e": "To protect intellectual property, contracts must prohibit uploading proprietary assets to personal accounts where the data does not have enterprise privacy guarantees."
      },
      {
        "id": "ccao-30",
        "d": 3,
        "t": "Regulatory Compliance and DPA Agreements",
        "q": "A European corporation subject to the General Data Protection Regulation (GDPR) is evaluating the use of Claude among its employees for business management tasks. Which legal and operational measure supports the lawful processing of the data?",
        "o": [
          "Install an unverified browser extension that promises to block the company's IP address from Anthropic.",
          "State in the employment contract that employees themselves are personally liable before the courts for any data processing they perform with AI tools.",
          "Sign a Data Processing Agreement (`DPA`) and channel usage through managed corporate accounts with access control.",
          "Limit queries to public holidays so that data protection authorities cannot inspect traffic on business days."
        ],
        "a": 2,
        "e": "Under the GDPR, organizations must sign a Data Processing Addendum (DPA) with the provider and use managed business accounts to ensure lawful processing."
      },
      {
        "id": "ccao-31",
        "d": 4,
        "t": "Structure of an Enterprise Prompt",
        "q": "A project manager wants to write a comprehensive prompt to summarize executive meeting minutes consistently week after week. Which of the following structures contains all the essential methodological components?",
        "o": [
          "Write a single sentence asking for a pleasant, concise summary so the model decides the length with complete autonomy.",
          "Paste twenty full pages of transcripts mixed with informal instructions without using any kind of delimiter, category, or functional heading.",
          "Write an unordered list of English adjectives requesting analytical excellence without defining the expected final format.",
          "Define the role (`System Prompt`), the operational context, the task delimited with tags, format examples, and explicit constraints."
        ],
        "a": 3,
        "e": "A robust prompt for repetitive business tasks combines role, context, clear delimited instructions, concrete examples (few-shot), and negative guardrails."
      },
      {
        "id": "ccao-32",
        "d": 4,
        "t": "Using XML Delimiters in Long Prompts",
        "q": "When designing a long prompt that includes company policies, example cases, and the text of a contract to be audited, what is the technical benefit of using XML-style delimiters (such as `<context>` or `<contract>`)?",
        "o": [
          "They help Claude clearly distinguish which parts are operational guidelines and which are input data to be processed.",
          "They compile the prompt into binary machine code, speeding up the download of the generated text over slow broadband connections.",
          "They are required by the web browser in order to display the text in full-screen mode without altering the system typography.",
          "They automatically convert the document into a relational database on Anthropic's central servers."
        ],
        "a": 0,
        "e": "XML tags structure the prompt visually and logically for Claude-family models, separating instructions from raw data and reducing ambiguity."
      },
      {
        "id": "ccao-33",
        "d": 4,
        "t": "Applying Few-Shot Prompting",
        "q": "The editorial team of a corporate publication needs Claude to write press releases that rigorously follow the company's journalistic sobriety and structure. Which prompting technique ensures the result most faithful to the style?",
        "o": [
          "Write the entire prompt in capital letters, emphasizing that the company's reputation depends on this press release.",
          "Include in the prompt two previously approved real press releases to illustrate the expected structure and formal register.",
          "Instruct the model to be as creative as possible and surprise readers with unexpected poetic metaphors.",
          "Ask Claude to imitate the style of nineteenth-century novelists to give the release a more distinguished, classic tone."
        ],
        "a": 1,
        "e": "Providing real examples (few-shot prompting) anchors the style, vocabulary, and arrangement of information much more effectively than mere abstract descriptions."
      },
      {
        "id": "ccao-34",
        "d": 4,
        "t": "Negative Constraints and Preventing Assumptions",
        "q": "An operations analyst asks Claude to extract the delivery deadlines and owners from a project follow-up email. In its response, Claude adds assumed dates that were not in the original message. How should the prompt be corrected?",
        "o": [
          "Ask it to imagine and infer logical delivery deadlines when they do not appear in the original email so the project schedule is not left with blank dates.",
          "Increase the number of allowed tokens by ten thousand so the model can justify the invented dates more extensively.",
          "Add an explicit constraint: 'Extract only dates mentioned in the text; if a milestone has no date, explicitly state Not specified'.",
          "Remove the original email from the prompt and ask Claude to produce a generic schedule for any type of company."
        ],
        "a": 2,
        "e": "Explicit negative constraints tell the model exactly what to do when information is absent (write 'Not specified'), preventing unfounded guesses."
      },
      {
        "id": "ccao-35",
        "d": 4,
        "t": "Key Elements for Reducing Ambiguity",
        "q": "Which TWO prompt-writing practices are highly recommended to avoid ambiguous or generic responses in business analysis tasks? (Select 2)",
        "o": [
          "Define the output format precisely (for example, a three-column comparison table with specific metrics).",
          "Specify the target audience and the required technical level (for example, an audit committee unfamiliar with IT).",
          "Avoid including length constraints so the model writes without limits as far as it deems necessary.",
          "Ask the model to express feelings of enthusiasm and excessive optimism in every technical conclusion it issues."
        ],
        "a": [
          0,
          1
        ],
        "e": "Clearly specifying the delivery format and the recipient's profile drastically reduces ambiguity and tailors the message to business needs."
      },
      {
        "id": "ccao-36",
        "d": 4,
        "t": "Prior Reasoning for Human Audit",
        "q": "In information security incident analysis, Claude is instructed with the guideline: 'Before issuing the final verdict on severity, explain your reasoning step by step, evaluating each attack vector.' What operational advantage does this approach provide?",
        "o": [
          "It allows Claude to connect remotely and in real time with government cyberdefense agencies to validate the accuracy of each technical deduction made.",
          "It guarantees that the generated response is exactly identical no matter how many times the question is asked in the chat.",
          "It is a documented technical shortcut to double the monthly storage quota available in the user's account.",
          "It promotes more rigorous logical analysis by the model and allows human auditors to verify the consistency of the deductions."
        ],
        "a": 3,
        "e": "Asking the model to break down its reasoning (chain-of-thought) before the final conclusion improves the logical soundness of the deductions and facilitates human auditing of the result."
      },
      {
        "id": "ccao-37",
        "d": 4,
        "t": "Structuring and Placement of Constraints",
        "q": "A technical writer observes that Claude frequently forgets a negative instruction about not using anglicisms when it is placed in the middle of a three-thousand-word reference document. What is the most appropriate structuring adjustment?",
        "o": [
          "Move the constraint to the end of the prompt or group it in a prominent section under a clear guidelines tag.",
          "Repeat the same constraint fifty times consecutively in capital letters throughout every paragraph of the document.",
          "Translate the constraint into binary or hexadecimal code so it gains greater relevance in the model's attention mechanisms.",
          "Accept that language models are incapable of remembering negative guidelines when processing texts of more than a thousand words."
        ],
        "a": 0,
        "e": "Placing key guidelines at the end of the prompt or in a clearly delimited section exploits the recency effect in the model's attention, maximizing constraint compliance."
      },
      {
        "id": "ccao-38",
        "d": 4,
        "t": "Calibrating the Complexity Level",
        "q": "When asking Claude to summarize a cloud architecture report intended for non-technical financial directors, which prompt instruction best guides the required level of depth?",
        "o": [
          "Require the entire report to be written using only very basic, elementary childlike vocabulary so that no reader has the slightest conceptual doubt.",
          "Instruct Claude to translate the technological impact into business terms of costs, timelines, and risks, defining the indispensable jargon.",
          "Order the exclusive use of acronyms and electronic circuit diagrams to project an image of technical cutting-edge.",
          "Ask it to assume that the financial directors have mastered Kubernetes cluster configuration and to omit all explanation of concepts."
        ],
        "a": 1,
        "e": "Directing a technical report to a business audience requires linking the technology to financial impacts and risks, explaining the indispensable technical terminology without sounding condescending."
      },
      {
        "id": "ccao-39",
        "d": 5,
        "t": "Surface Selection: Claude Projects",
        "q": "A software company's support team regularly shares product manuals, error guides, and refund policies to resolve user inquiries. Which Claude environment is ideal for organizing this workflow?",
        "o": [
          "Use a standard individual chat where each support agent must manually re-upload the fifteen manuals every time a new customer inquiry begins.",
          "Develop a custom application from scratch using the Anthropic API even though the team has no programmers.",
          "Set up a `Claude Project`, since it allows storing persistent reference documentation and shared instructions for the team.",
          "Download the model files to local hard drives to operate without internet access in the sales offices."
        ],
        "a": 2,
        "e": "`Claude Projects` is designed specifically for teams that need to share permanent knowledge bases (Project Knowledge) and work instructions in a no-code environment."
      },
      {
        "id": "ccao-40",
        "d": 5,
        "t": "Benefits of Using Artifacts",
        "q": "A strategy consultant needs Claude to draft a thirty-page digital transformation proposal that will require multiple rounds of editing and refinement. Why is it very convenient for the output to be generated in an `Artifact`?",
        "o": [
          "`Artifacts` prevent other department members from editing or copying the text unless they have a special assigned cryptographic decryption key.",
          "Using `Artifacts` multiplies the speed of the user's internet connection while downloading the file to their local machine.",
          "`Artifacts` automatically grant binding legal validity to the document before the country's regulatory authorities.",
          "It isolates and displays the substantial document in a dedicated side panel, making it easier to read, version, and edit iteratively."
        ],
        "a": 3,
        "e": "`Artifacts` separate substantial, lengthy content from the conversational flow, offering a side panel to inspect, copy, iterate on, and version the document with complete ease."
      },
      {
        "id": "ccao-41",
        "d": 5,
        "t": "Ad-hoc Queries in Standard Chat",
        "q": "A junior analyst needs to quickly learn the definition and etymological origin of a financial term to understand a press article, without involving customer data or company policies. Which Claude surface is the most efficient?",
        "o": [
          "A standard individual chat in Claude, since it is a one-off, ephemeral query that does not require persistent document context.",
          "Create a formal corporate `Claude Project` and invite the directors of ten different areas to archive and document the isolated definition of the term.",
          "Hire an outside consulting firm to develop a software connector with the Anthropic API to resolve the vocabulary question.",
          "Set up a dedicated cloud server to process vocabulary queries using Python scripts."
        ],
        "a": 0,
        "e": "For quick, non-recurring ad-hoc questions, standard chat is the most direct and lightweight option, avoiding the overhead of creating unnecessary projects or integrations."
      },
      {
        "id": "ccao-42",
        "d": 5,
        "t": "Ideal Use Cases for Artifacts",
        "q": "In which TWO of the following workplace situations is it highly advantageous for Claude to generate its response as an `Artifact` in the side window? (Select 2)",
        "o": [
          "Development of an interactive diagram or SVG code that the team wants to view, test, and refine iteratively.",
          "Creation of an extensive, structured multi-page operating guide intended to be exported and shared with the team.",
          "A short courtesy reply in the chat confirming receipt of a file with the text: 'Understood, thanks'.",
          "A one-line clarification explaining the meaning of a very common corporate acronym during a quick conversation."
        ],
        "a": [
          0,
          1
        ],
        "e": "`Artifacts` are designed for substantial, reusable, or interactive content (code, SVG diagrams, long documents), not for brief conversational replies."
      },
      {
        "id": "ccao-43",
        "d": 5,
        "t": "Governance and Enterprise Plans",
        "q": "A company of sixty employees needs to deploy Claude with centralized authentication (Single Sign-On or SSO), consolidated single billing, and department-level access controls. Which service tier meets these requirements?",
        "o": [
          "Ask each employee to create a personal free account using their private email accounts.",
          "Subscribe to corporate plans such as `Claude Team` or `Claude Enterprise`, equipped with an administrative console and centralized governance.",
          "Buy sixty individual `Claude Pro` subscriptions and reimburse the monthly cost through expense reports.",
          "Install third-party browser extensions to share a single access password among all employees."
        ],
        "a": 1,
        "e": "The `Claude Team` and `Claude Enterprise` plans provide an administration console, identity provisioning via SSO, centralized billing, and formal privacy guarantees."
      },
      {
        "id": "ccao-44",
        "d": 5,
        "t": "Project Instructions vs Knowledge Base",
        "q": "Within a `Claude Project`, what is the conceptual and operational difference between 'Project Instructions' (`Project Instructions`) and 'Knowledge Files' (`Project Knowledge`)?",
        "o": [
          "Instructions can only be written by Anthropic, while files are public documents visible on the internet.",
          "There is no operational distinction; both modules serve exactly the same function in context processing.",
          "Instructions set the role, tone, and permanent response rules; files provide the factual reference information.",
          "Files set the members' subscription prices and instructions store the company's network passwords."
        ],
        "a": 2,
        "e": "`Project Instructions` define how Claude should behave (role, style, guidelines), while `Project Knowledge` stores the substantive documentation that feeds its answers."
      },
      {
        "id": "ccao-45",
        "d": 6,
        "t": "Context Drift in Long Threads",
        "q": "In a very long work conversation with more than forty exchanges, a user notices that Claude starts neglecting instructions given at the beginning and confuses details of topics already closed. What technical phenomenon is occurring and what is the recommended operational solution?",
        "o": [
          "Virus infection on the local computer; solved by formatting the hard drive and reinstalling the operating system.",
          "Permanent account lockout for suspicious activity; resolved by waiting a full week without making any queries.",
          "Irreversible exhaustion of the main server; remedied by sending the same message ten times in a row in capital letters.",
          "Context drift (`Context Drift`); resolved by opening a new, focused chat and summarizing the key agreements accumulated so far."
        ],
        "a": 3,
        "e": "`Context Drift` occurs when the accumulation of messages in a chat dilutes the model's attention to the initial instructions; the solution is to open a new chat with a clean summary."
      },
      {
        "id": "ccao-46",
        "d": 6,
        "t": "Contradictions in the Knowledge Base",
        "q": "When asking about the vacation procedure in a `Claude Project`, the model gives contradictory answers, sometimes citing 20 days and other times 25 days for the same type of contract. After reviewing the uploaded files, what is the most likely cause and how should it be fixed?",
        "o": [
          "Two versions of the benefits manual are uploaded (an old one and an updated one); the obsolete file should be removed from the Project.",
          "Claude totally lacks the technical ability to process binary PDF files and systematically confuses numbers when extracting plain text.",
          "It is essential that all documents in the Project have exactly the same number of pages to avoid contradictions.",
          "Employees must phrase their questions in verse or rhyme so the model identifies which file has legal priority."
        ],
        "a": 0,
        "e": "Having divergent or outdated versions of a policy in `Project Knowledge` confuses the model; good practice requires auditing and cleaning up the files, keeping only the current version."
      },
      {
        "id": "ccao-47",
        "d": 6,
        "t": "Handling Outputs Truncated by Token Limit",
        "q": "During the generation of an extensive comparative analysis of fifteen competitors, Claude suddenly stops in the middle of a paragraph without completing the table. What is the usual technical reason for this behavior and how is the task resumed?",
        "o": [
          "Anthropic canceled and suspended the user's access to the platform for asking an analytical question that was excessively complex for the cloud processor.",
          "The maximum output token limit for a single turn was reached; simply typing 'continue' lets the model carry on with the text.",
          "The model detected a copyright infringement in the name of one of the competitors and froze the screen.",
          "An unrecoverable failure occurred in the global telecommunications network that destroyed the entire previous conversation history."
        ],
        "a": 1,
        "e": "Each response turn has a preset output token limit. If the response reaches it, generation is cut off cleanly; sending a message asking it to 'continue' allows the task to be completed."
      },
      {
        "id": "ccao-48",
        "d": 6,
        "t": "Preventing Responses with External Information in Projects",
        "q": "In a `Claude Project` created to answer questions about life insurance policies, it is noticed that the model sometimes answers with standard coverages from other countries that are not part of the company's contracts. Which adjustment to the project instructions eliminates this problem?",
        "o": [
          "Upload links to internet insurance forums to the project so the model can verify which policies are most popular.",
          "Prohibit employees from asking questions containing numbers or percentages to prevent the model from searching for external data.",
          "Instruct explicitly: 'Answer exclusively based on the policies loaded in the project; if a piece of data does not appear in them, state that it is not on record'.",
          "Remove all policies from the project and ask the model to memorize the insurance terms through a single prompt."
        ],
        "a": 2,
        "e": "Explicitly instructing Claude to restrict its answers to the project documents, and specifying what to answer when information is missing, prevents hallucinations with external data."
      },
      {
        "id": "ccao-49",
        "d": 6,
        "t": "File Upload Limits in Web Sessions",
        "q": "An analyst tries to upload a two-gigabyte recorded video file to a Claude chat session to have it transcribe the meeting and extract agreements. The platform immediately rejects the upload. What is the operational reason and the best working alternative?",
        "o": [
          "The platform only allows file uploads from users with express authorization from the United Nations ethics committee.",
          "The user must change the video file extension to '.txt' to fool the interface's verification systems.",
          "The video must be split into four hundred five-megabyte files and all of them uploaded together in the same message.",
          "The file exceeds the supported size limits and file types; the plain-text transcript should be extracted and loaded into the session."
        ],
        "a": 3,
        "e": "Claude is optimized to process text and documents (PDF, text, code, images). For recorded meetings, a plain-text transcript should be used, which is lightweight and efficient."
      },
      {
        "id": "ccao-50",
        "d": 6,
        "t": "Custom Instructions Hierarchy vs Task Prompts",
        "q": "A consultant has custom instructions configured in their global profile so that Claude always answers with short bullet lists. However, for a specific task they need to write a formal apology letter in continuous paragraphs. What is the cleanest way to proceed?",
        "o": [
          "State in the task prompt: 'For this particular task, ignore the usual bullet-point format and write the letter in continuous, formal paragraphs'.",
          "Permanently delete the corporate user account on the server and request a new email address from the IT infrastructure department.",
          "Wait for the weekend to pass so the custom instructions expire automatically on the server.",
          "Uninstall the web browser and access from a portable tablet so the system does not recognize the user's preferences."
        ],
        "a": 0,
        "e": "Explicit guidelines given in the task prompt (`user prompt`) take operational priority to temporarily override the general profile preferences without needing to delete them."
      },
      {
        "id": "ccao-51",
        "d": 7,
        "t": "Modular Decomposition vs Mega-Prompt Failure",
        "q": "A consulting team must produce a fifty-page strategic plan analyzing balance sheets, surveys, and regulations. Why does sending a single 'mega-prompt' asking for the entire report to be written in one turn produce unsatisfactory results?",
        "o": [
          "The model automatically triggers an extraordinary financial penalty charge every time a prompt exceeds five hundred words.",
          "The model tends to omit critical details, over-condense sections, and lose coherence when trying to meet multiple goals at once.",
          "Anthropic's terms of service strictly prohibit analyzing financial statements and market surveys in the same account.",
          "The user's web browser restarts due to lack of RAM when trying to receive more than two paragraphs of text simultaneously."
        ],
        "a": 1,
        "e": "'Mega-prompts' overload the model's planning capacity, causing superficial summaries, omission of secondary guidelines, and saturation of the per-turn token limit."
      },
      {
        "id": "ccao-52",
        "d": 7,
        "t": "Logical Sequence in Contract Prompt Chaining",
        "q": "When implementing a prompt chain (`Prompt Chaining`) to audit a complex lease agreement and propose modifications, what is the most effective methodological sequence to ensure quality and risk control?",
        "o": [
          "Step 1: Immediately draft the final modifications -> Step 2: Ask the model what it thought of the contract overall -> Step 3: Extract the original clauses.",
          "Step 1: Request an allegorical poem about the property -> Step 2: Print the document -> Step 3: Translate the signatures into three languages.",
          "Step 1: Extract risk clauses into a table -> Step 2: Compare against company policy -> Step 3: Draft counterproposals for the wording.",
          "Step 1: Digitally sign the agreement -> Step 2: Ask Claude to look for serious errors -> Step 3: Notify the counterparty of termination."
        ],
        "a": 2,
        "e": "An effective chain progresses from the concrete and analytical to synthesis: first it extracts the objective data, then evaluates it against internal policies, and finally drafts the alternative clauses."
      },
      {
        "id": "ccao-53",
        "d": 7,
        "t": "Intermediate Inspection in Prompt Chains",
        "q": "In a workflow that uses prompt chaining (`Prompt Chaining`), what crucial operational benefit does reviewing and validating the intermediate results of each phase before triggering the next step provide?",
        "o": [
          "It grants a fifty percent discount credit on the company's monthly cloud services bill.",
          "It eliminates the need for users to know the business subject matter, making the work team completely infallible.",
          "It allows subsequent steps to run instantly without consuming compute time on the platform's servers.",
          "It allows errors or hallucinations to be detected and corrected early, preventing them from propagating and being amplified in later phases."
        ],
        "a": 3,
        "e": "Validating intermediate outputs in a chained workflow acts as a quality checkpoint (gatekeeper), preventing an extraction error from contaminating the analysis and the final report."
      },
      {
        "id": "ccao-54",
        "d": 7,
        "t": "Handling Failures in Intermediate Phases",
        "q": "A team designs a chain of three prompts to generate case studies: Step 1: Extract metrics from the customer interview -> Step 2: Structure the case (Challenge, Solution, Result) -> Step 3: Polish the brand voice. If Step 2 produces a deficient, disorganized structure, what is the correct action?",
        "o": [
          "Refine the Step 2 prompt by providing a clear structural template and repeat that phase before moving on to the style polish of Step 3.",
          "Proceed directly to Step 3, wrongly assuming that the style polishing phase will automatically fix the earlier structural problems.",
          "Discard the entire case study project and rule that language models are not useful for business communication tasks.",
          "Repeat Step 1 by loading ten additional customer transcripts unrelated to the case in question."
        ],
        "a": 0,
        "e": "If an intermediate phase fails, the prompt for that specific phase must be corrected with clear guidelines and templates before continuing. Moving forward on a flawed foundation only amplifies writing failures."
      },
      {
        "id": "ccao-55",
        "d": 7,
        "t": "Competitive Advantages of Modular Decomposition",
        "q": "What is the main advantage of decomposing a complex analysis into a sequential chain of prompts compared to trying to solve it in a single long instruction?",
        "o": [
          "The single instruction unlocks secret quantum processing modules on Anthropic's servers that do not operate in chains.",
          "Modular decomposition isolates each subtask, allowing greater depth of analysis, data traceability, and quality control.",
          "The modular chain does not require users to understand the steps of the problem, since the model deduces the business plan automatically.",
          "The single instruction mathematically and irrefutably guarantees that there will be no factual hallucinations in any of the sections produced."
        ],
        "a": 1,
        "e": "Modularity lets the model concentrate its attention on one specific subtask at a time (extraction, comparison, drafting), improving quality and facilitating human control."
      }
    ],
    "why": {
      "ccao-01": [
        null,
        "Evaluating intuitively without predefined criteria leads to rating superficial eloquence positively while ignoring critical omissions of information.",
        "Validating only the syntax of a JSON verifies the file format but does not check the factual accuracy, tone, or business suitability of the content.",
        "Language models tend to overestimate the quality of their own outputs when self-evaluating without a binding external rubric and human oversight."
      ],
      "ccao-02": [
        "Claude is a language model and does not make tacit accounting adjustments or independent regulatory calculations without explicit instructions.",
        null,
        "Asking the model for confirmation usually causes it to justify its previous answer with apparent conviction instead of detecting the underlying numerical error.",
        "Altering primary accounting records to make them match an erroneous AI output is a serious ethical and regulatory violation."
      ],
      "ccao-03": [
        "Testing two or three improvised cases lacks statistical representativeness and does not detect edge cases or regressions in classification.",
        "The length and complexity of the text do not reflect operational accuracy; in fact, excessively long responses hinder quick ticket resolution.",
        null,
        "The subjective aesthetic judgment of a single user does not measure the accuracy of technical categorization or compliance with service policies."
      ],
      "ccao-04": [
        "Asking it to grant business exceptions out of empathy empowers the model to make financial commitments that the company is not willing to honor.",
        "Allowing it to use vague external knowledge to fill regulatory gaps produces false promises that are incompatible with the business terms.",
        "Increasing output length without bounding the sources of truth multiplies the risk of Claude rambling and producing invalid regulatory commitments.",
        null
      ],
      "ccao-05": [
        null,
        "Context drift is the loss of attention to early instructions in long threads; adding more legal documents saturates attention and worsens hallucinations.",
        "Citing a nonexistent article is not a copyright infringement but a synthetic generation error that does not involve court licenses.",
        "Line breaks improve prompt readability; removing them has no positive technical impact on the accuracy of legal references."
      ],
      "ccao-06": [
        null,
        null,
        "Requiring an arbitrary minimum length induces artificially dense responses that make it harder for the employee to quickly understand labor rules.",
        "Excess technical jargon hinders communicative clarity and can create confusion or distrust in sensitive labor-relations matters."
      ],
      "ccao-07": [
        "Threatening the model or writing in capital letters offers no concrete stylistic guidance and is ineffective for modulating linguistic register.",
        null,
        "Requiring customers to follow a rigid format shifts the friction onto the external user and ruins the customer service experience.",
        "Manually correcting without updating the prompt perpetuates operational inefficiency and does not resolve the root cause of style variability."
      ],
      "ccao-08": [
        "Fluency is a property of the language model and is no proof of consulting external records or official databases.",
        "Advanced models can write false or incomplete texts with the same grammatical elegance as true texts.",
        null,
        "Anthropic does not penalize textual fluency; it is an intrinsic characteristic of the model and has no relationship with security blocks."
      ],
      "ccao-09": [
        "Watching the token stream provides no business value and does not ensure that the proposal content meets the tender requirements.",
        "Arbitrarily replacing nouns wastes unnecessary time and tends to degrade the technical accuracy of the commercial document.",
        "Disabling firewalls undermines IT security, and in addition Claude does not freely browse the customer's corporate network.",
        null
      ],
      "ccao-10": [
        null,
        "The reviewer's reading speed measures the human user's agility, but it does not show whether the severity assigned by the AI was correct.",
        "Adding flattering adjectives does not improve technical classification and distorts the objective analysis of the problem reported by the customer.",
        "Longer, more verbose responses do not imply greater diagnostic accuracy; they often just introduce noise into the categorization."
      ],
      "ccao-11": [
        "Forcing external third parties to change their invoicing format is operationally unfeasible and shifts an internal problem onto suppliers.",
        null,
        "Accepting high omission rates in invoicing causes serious accounting losses and wastes the opportunity to optimize the prompt.",
        "Evaluating only easy cases falsifies performance indicators and hides critical vulnerabilities before production deployment."
      ],
      "ccao-12": [
        "Rubrics are human organizational documents and have no direct technical relationship to pricing or token billing.",
        "No rubric exempts you from periodic monitoring, since business processes and queries evolve over time.",
        null,
        "Rubrics seek quality and conceptual accuracy, not to artificially limit the natural length required to explain a topic."
      ],
      "ccao-13": [
        "Issuing disbursements 100% autonomously without human oversight exposes the company to fraud and improper payments caused by hallucinations.",
        "Forcing a physician to transcribe data by hand wastes high-cost professional time on tasks that AI can speed up.",
        "Automating rejections without the possibility of human review violates consumer rights and insurance sector regulations.",
        null
      ],
      "ccao-14": [
        null,
        "Sending AI outputs without prior human verification can convey erroneous commitments or inappropriate responses in conflict situations.",
        "Transferring the customer directly to a chatbot does not resolve the case and drastically degrades the perception of customer service.",
        "Deliberately omitting the friction points generates user frustration and often causes the complaint to escalate to regulatory bodies."
      ],
      "ccao-15": [
        "Replacing corporate lawyers with a language model legally exposes the company to harmful clauses that go undetected.",
        null,
        "Publishing commercial contracts on public forums is a serious violation of confidentiality agreements and trade secrets.",
        "Unilaterally modifying substantial clauses without legal advice creates defects in consent and greater procedural risks."
      ],
      "ccao-16": [
        "Basing investment reports on internet rumors violates securities market laws and ruins the firm's fiduciary reputation.",
        "Omitting risk factors violates legal disclosure obligations and exposes the entity to sanctions from the securities commission.",
        null,
        "Prioritizing immediacy over document verification in fiduciary reports creates regulatory and financial liability risks."
      ],
      "ccao-17": [
        "Automated sentiment analysis of oral interviews penalizes shy applicants or those speaking in a second language, creating unfair discrimination.",
        "Inferring protected categories (age, origin, gender) to influence hiring is illegal and violates anti-discrimination labor regulations.",
        "Sharing applicant data with competitors violates data protection law (GDPR) and competition law.",
        null
      ],
      "ccao-18": [
        null,
        null,
        "An operational email about a room change is a low-risk task that creates no serious legal or financial consequences if it contains a minor slip.",
        "An internal brainstorm of campaign names is a harmless creative exercise that does not put critical rights or resources at stake."
      ],
      "ccao-19": [
        null,
        "Having isolated accounts without common guidelines causes dispersion in corporate image and makes brand quality control harder.",
        "Omitting the corporate context produces generic responses misaligned with the brand identity and the company's business objectives.",
        "Prohibiting examples removes one of the most powerful style-alignment techniques (few-shot) and increases unwanted variability."
      ],
      "ccao-20": [
        "Reactively banning the technology eliminates productivity benefits instead of educating the team in rigorous and responsible use.",
        null,
        "A bot with automatic approval based on a monetary threshold amplifies financial risk instead of guaranteeing the accuracy of unit prices.",
        "Hiding official price lists from the sales staff prevents checking against sources of truth and fosters serious financial errors."
      ],
      "ccao-21": [
        "AI assistance improves analysts' productivity but does not replace the technical knowledge needed to resolve complex incidents.",
        "A language model generates text and technical suggestions; it does not affect the physical stability of servers or operating system patching.",
        null,
        "Remediation actions in production require rigorous authorization and authentication to avoid catastrophic service outages."
      ],
      "ccao-22": [
        "Individual cloud accounts still send data to external servers; ignoring privacy policies constitutes a disciplinary and legal violation.",
        "Language models have no ethical will or contractual capacity to keep secrets through a conversational instruction.",
        "Sharing public links with salary data amplifies the exposure of confidential information and worsens the security breach.",
        null
      ],
      "ccao-23": [
        null,
        "Claude has extensive technical knowledge about industrial networks; the refusal is due to ethical and security safeguards, not conceptual ignorance.",
        "The length of the query is minimal and has no relation to the context window's token limit.",
        "Anthropic does not sell or authorize exceptions for attacks on critical infrastructure through notarial procedures."
      ],
      "ccao-24": [
        "Anthropic does not use data from business plans to train public models; data privacy and isolation are guaranteed by contract.",
        null,
        "Corporate data processing agreements prohibit the unauthorized transfer of information to academic institutions or other third parties.",
        "The no-training policy on business accounts applies universally to all data regardless of the language used."
      ],
      "ccao-25": [
        "Presenting an AI as a certified legal or financial advisor violates banking regulatory frameworks and financial consumer protection rules.",
        "Investments carry market risks, and no technology can guarantee future returns without committing fraud.",
        null,
        "Concealing the risks associated with financial products violates transparency guidelines and the financial sector's codes of conduct."
      ],
      "ccao-26": [
        null,
        null,
        "Comparing software costs for a purchasing decision is a perfectly legitimate and supported business activity.",
        "Translating occupational safety manuals supports risk prevention and represents an ordinary, positive use case."
      ],
      "ccao-27": [
        "Delegating pharmacological adjustment to a language model without medical supervision puts patients' lives at risk and violates health law.",
        "Concealing the use of AI from the ethics committee breaches institutional transparency policies and bypasses essential clinical safety controls.",
        "Visual quality and corporate colors do not certify the medical accuracy or therapeutic suitability of the recommendations for patients.",
        null
      ],
      "ccao-28": [
        null,
        "Bandwidth overload is a telecommunications network problem unrelated to the cognitive bias of over-reliance.",
        "Hiring decisions are part of talent management and do not define the concept of over-reliance on model responses.",
        "Password reuse is a poor cybersecurity practice, not a phenomenon of complacency toward AI outputs."
      ],
      "ccao-29": [
        "Encouraging the use of free accounts worsens the risk, since those consumer versions lack the data protections of business plans.",
        null,
        "Requiring prior translation into a specific language adds no security and needlessly hinders the project's technical workflows.",
        "Deleting histories without traceability prevents auditing the provenance of the work and verifying compliance with intellectual property rules."
      ],
      "ccao-30": [
        "Unofficial browser extensions pose a serious security risk and do not replace the contractual guarantees of the GDPR.",
        "Shifting legal responsibility exclusively onto workers is null and void under European data protection regulations.",
        null,
        "Data protection legislation operates permanently, 24 hours a day all year, with no exceptions for holidays or weekends."
      ],
      "ccao-31": [
        "An open-ended single-sentence instruction produces unpredictable outputs with variable depth that rarely satisfy an executive committee.",
        "Mixing data and instructions without structure confuses the model's attention and leads to the omission of key meeting agreements.",
        "A list of abstract adjectives provides no operational guidance on which sections or decisions should be extracted from the minutes.",
        null
      ],
      "ccao-32": [
        null,
        "XML tags are plain text interpreted by the model; they do not perform binary compilation or alter the network transfer rate.",
        "The browser does not require XML tags to switch to full-screen mode; they are a prompt-structuring standard, not CSS/HTML.",
        "The language model processes text in context and does not create relational SQL databases from XML markup in the prompt."
      ],
      "ccao-33": [
        "Using capital letters provides no technical clarity or concrete examples of how the press release should be structured.",
        null,
        "Encouraging open-ended creativity in corporate releases produces extravagant texts that clash with the sobriety required by management.",
        "Imitating nineteenth-century literary styles introduces anachronistic expressions that harm the readability and professionalism of the release."
      ],
      "ccao-34": [
        "Authorizing the model to invent dates when data is missing perpetuates the error and produces unrealistic work schedules for the project.",
        "Increasing the token limit allows longer responses but does not correct the tendency to invent data not present in the email.",
        null,
        "Removing the source email eliminates the working context and leaves the schedule unrelated to the ongoing project."
      ],
      "ccao-35": [
        null,
        null,
        "Omitting length guidelines tends to result in rambling, scattered responses that take executives excessive reading time.",
        "Introducing contrived emotions detracts from the rigor of technical reports and distorts the impartiality of business analysis."
      ],
      "ccao-36": [
        "Claude reasons from the text and its internal weights; it does not establish secret external connections with government defense agencies.",
        "Language models are probabilistic in nature; asking for step-by-step reasoning does not eliminate the natural variability of the text.",
        "Prompt wording does not change the subscription's storage quotas, which are governed by the plan purchased.",
        null
      ],
      "ccao-37": [
        null,
        "Obsessively repeating a sentence degrades prompt coherence and needlessly and inefficiently consumes context tokens.",
        "The model processes natural language; encoding instructions in binary or hexadecimal makes interpretation harder and causes errors.",
        "Advanced models can process tens of thousands of words and respect constraints if these are properly structured and placed."
      ],
      "ccao-38": [
        "Using childlike language is disrespectful in a corporate environment and devalues the seriousness of the financial analysis presented.",
        null,
        "Overloading the report with cryptic acronyms prevents executives from understanding the project's feasibility and blocks decision-making.",
        "Assuming engineering knowledge in finance profiles causes misinformation and erroneous assessments of the project budget."
      ],
      "ccao-39": [
        "Uploading manuals in each individual chat wastes time, causes redundant token consumption, and risks using outdated versions.",
        "Building a custom platform with the API requires software development and ongoing maintenance, which is disproportionate and unnecessary.",
        null,
        "Claude's advanced models operate as cloud services from Anthropic and are not downloaded for offline local execution."
      ],
      "ccao-40": [
        "`Artifacts` are not restrictive encryption mechanisms; their purpose is to improve viewing and editing in the user interface.",
        "Generating an `Artifact` does not alter the physical bandwidth of the user's telecommunications connection.",
        "An `Artifact` is a software display tool and does not replace the legal signature or the notarial formalities of a proposal.",
        null
      ],
      "ccao-41": [
        null,
        "Creating a project and inviting executives over a one-off vocabulary question creates unnecessary bureaucracy and clutters the workspace.",
        "Hiring developers to look up a lexical term is an unjustified expense compared to the immediacy of the existing web interface.",
        "Provisioning cloud infrastructure for a one-off language query is a waste of technical and financial resources."
      ],
      "ccao-42": [
        null,
        null,
        "A two-word confirmation message should stay in the usual conversational flow; creating an Artifact for it is unnecessary.",
        "A one-line clarification does not need a dedicated side display panel and fits perfectly in the body of the chat."
      ],
      "ccao-43": [
        "Personal accounts lack centralized administration, prevent the application of retention policies, and compromise corporate security.",
        null,
        "Managing individual licenses through reimbursements offers no unified console, no SSO, and no contractual team data protection guarantees.",
        "Sharing a single account among dozens of employees violates the terms of service, voids traceability, and weakens access security."
      ],
      "ccao-44": [
        "Instructions are freely configured by the company's project administrators; they are not an exclusive field of Anthropic.",
        "Confusing the two elements clutters the project: mixing tone policies with product manuals harms the model's accuracy.",
        null,
        "Neither module handles payments or keys; their purpose is to structure the assistant's behavior and knowledge."
      ],
      "ccao-45": [
        "The phenomenon of losing focus in a chat is a property of the cloud model's attention and has no relation to local viruses.",
        "There is no account lockout; the session has simply accumulated too much scattered prior information in the context window.",
        "Repeating the message in the same long thread worsens token saturation and does not help the model recover the forgotten guidelines.",
        null
      ],
      "ccao-46": [
        null,
        "Claude processes PDF documents with high accuracy; the error is not one of format, but of contradictory content in the uploaded files.",
        "The number of pages per document is irrelevant; what creates contradictions is the discrepancy in the policy data they contain.",
        "Writing questions in verse confers no document hierarchy and hinders professional communication on the platform."
      ],
      "ccao-47": [
        "The platform does not sanction or cancel accounts for requesting detailed analyses of multiple competitors in the chat.",
        null,
        "Commercial mentions in competitive analyses do not trigger automatic freezes for copyright infringement.",
        "The abrupt cutoff is an ordinary per-turn generation length limit and does not imply data loss or network outages."
      ],
      "ccao-48": [
        "Adding links to external forums introduces more noise and increases the likelihood that the model will cite coverages that are no longer in force.",
        "Numbers and percentages are inherent to insurance policies; prohibiting them makes the team's operational work impossible.",
        null,
        "Deleting the documents deprives Claude of its knowledge base (ground truth), forcing it to resort to general knowledge and speculate."
      ],
      "ccao-49": [
        "Anthropic manages its technical file limits directly on its platform without the intermediation of international bodies.",
        "Changing the extension does not turn a binary video into readable text; the file will remain incompatible and cause an error.",
        "Uploading hundreds of binary fragments blocks the web interface and does not allow the model to process the audiovisual content efficiently.",
        null
      ],
      "ccao-50": [
        null,
        "Deleting the account destroys the company's history, projects, and settings in a completely unnecessary way.",
        "Profile custom instructions are permanent and have no automatic expiration date on weekends.",
        "Instructions are tied to the user's cloud profile, so switching devices does not remove the formatting configuration."
      ],
      "ccao-51": [
        "Anthropic does not apply financial fines for prompt length; billing is based on token consumption according to the plan purchased.",
        null,
        "Combining diverse information sources is a common practice in analysis tasks and does not violate the terms of service.",
        "Modern browsers handle text streams without problems; the bottleneck is the model's cognitive capacity in a single turn."
      ],
      "ccao-52": [
        "Drafting modifications before extracting and understanding the original clauses reverses the analytical logic and leads to legal errors.",
        "Generating poems or ornamental translations diverts the workflow and adds no value to the contract's risk analysis.",
        null,
        "Signing the contract before analyzing the risks legally commits the company and makes any later audit useless."
      ],
      "ccao-53": [
        "Reviewing intermediate outputs is a good prompt engineering practice for users, not a commercial loyalty program with discounts.",
        "The reviewer's business domain knowledge remains indispensable for judging whether the intermediate output is correct.",
        "Each step in the chain requires independent computational processing; human reviews do not cancel out the model's inference time.",
        null
      ],
      "ccao-54": [
        null,
        "The style polishing phase improves the writing but does not repair a disorganized content structure or one lacking narrative logic.",
        "Abandoning the project over a structural failure in an intermediate phase is premature; it is enough to adjust the guidelines of the failed step.",
        "Adding unrelated transcripts in Step 1 introduces noise and does not solve the structuring problem in Step 2."
      ],
      "ccao-55": [
        "Anthropic's models use the same standard processing infrastructure with no secret quantum modules for long prompts.",
        null,
        "Designing an effective chain requires a deep understanding of the business workflow to define which inputs and outputs each stage requires.",
        "No single prompt guarantees the absence of hallucinations; in fact, concentrating multiple goals into one instruction raises the risk of error."
      ]
    },
    "glossary": [
      {
        "term": "Claude Projects",
        "cat": "Claude Surfaces",
        "d": 5,
        "def": "Collaborative workspaces in Claude that allow storing up to hundreds of thousands of words of reference documentation (Project Knowledge) and custom instructions shared among team members."
      },
      {
        "term": "Artifacts",
        "cat": "Claude Surfaces",
        "d": 5,
        "def": "Interactive side window in the Claude interface where substantial, reusable content is generated and displayed, such as long text documents, SVG diagrams, web components, and code, facilitating iteration and versioning."
      },
      {
        "term": "Acceptable Use Policy (AUP)",
        "cat": "Governance",
        "d": 3,
        "def": "Formal Anthropic policy that prohibits the use of its models for harmful activities, including weapons development, election disinformation, cyberattacks on critical infrastructure, and binding legal or medical advice without qualified supervision."
      },
      {
        "term": "Hallucination",
        "cat": "Validation",
        "d": 1,
        "def": "Generation of false claims, facts, figures, or citations presented with high eloquence and apparent technical certainty by the language model, mitigable through grounding in documents and human validation."
      },
      {
        "term": "Prompt Chaining",
        "cat": "Prompt Chaining",
        "d": 7,
        "def": "Methodological pattern that decomposes a complex business task into a sequence of modular steps, where the validated output of one prompt serves as the contextual input of the next."
      },
      {
        "term": "PII Redaction",
        "cat": "Governance",
        "d": 3,
        "def": "Prior process of identifying and replacing personally identifiable data (names, ID numbers, addresses, banking data) with placeholders or synthetic data before sending it to the model."
      },
      {
        "term": "Human-in-the-Loop (HITL)",
        "cat": "Workflows",
        "d": 2,
        "def": "Operational design in which a trained human professional must actively review, validate, and authorize the outputs or recommendations generated by AI before their publication or execution in the business."
      },
      {
        "term": "Context Drift",
        "cat": "Troubleshooting",
        "d": 6,
        "def": "Degradation in adherence to initial instructions that occurs in prolonged chat sessions, caused by the accumulation of intermediate messages that dilute the model's attention."
      },
      {
        "term": "Project Knowledge Base",
        "cat": "Claude Surfaces",
        "d": 5,
        "def": "Repository of internal documents (PDFs, spreadsheets, text manuals) loaded into a `Claude Project` so the model answers grounded in the organization's specific corporate information."
      },
      {
        "term": "Custom Instructions",
        "cat": "Troubleshooting",
        "d": 6,
        "def": "Global or per-project guidelines that define the role, tone, writing style, and formatting preferences Claude should adopt by default in all its interactions."
      },
      {
        "term": "Golden Evaluation Dataset",
        "cat": "Validation",
        "d": 1,
        "def": "Curated, standardized set of real questions and cases with reference answers verified by human experts, used to objectively measure and compare the effectiveness of different prompt versions."
      },
      {
        "term": "Rubric Evaluation",
        "cat": "Validation",
        "d": 1,
        "def": "Structured framework of explicit criteria (factual accuracy, tone, constraint compliance, format) defined before testing to objectively rate the quality of generated responses."
      },
      {
        "term": "Few-Shot Prompting",
        "cat": "Prompting",
        "d": 4,
        "def": "Prompt engineering technique consisting of including two or more representative input-output example pairs within the prompt to guide the desired format, style, and depth with high precision."
      },
      {
        "term": "Zero-Shot Prompting",
        "cat": "Prompting",
        "d": 4,
        "def": "Direct request to the model without providing prior examples of the task, relying on explicit instructions and the model's intrinsic knowledge to produce the expected result."
      },
      {
        "term": "Claude Team & Enterprise",
        "cat": "Claude Surfaces",
        "d": 5,
        "def": "Anthropic business plans that offer a centralized administration console, single sign-on (SSO), consolidated billing, higher usage limits, and contractual guarantees of no training on customer data."
      },
      {
        "term": "Claude Pro",
        "cat": "Claude Surfaces",
        "d": 5,
        "def": "Paid individual subscription aimed at professional users that grants expanded usage limits compared to the free plan and priority access to the most advanced models in the Claude family."
      },
      {
        "term": "Context Window",
        "cat": "Troubleshooting",
        "d": 6,
        "def": "Maximum capacity in tokens that Claude can process simultaneously in an interaction (up to 200,000 tokens in Claude 3/3.5 models), covering conversation history, documents, and the current prompt."
      },
      {
        "term": "Grounding",
        "cat": "Validation",
        "d": 1,
        "def": "Practice of basing the model's responses strictly on supplied reference documents, instructing it to cite excerpts and to state explicitly when the information is not in the text."
      },
      {
        "term": "XML Delimiters",
        "cat": "Prompting",
        "d": 4,
        "def": "XML-style markup tags (such as `<context>`, `<instructions>`, `<example>`) used to structure the components of the prompt, making it easier for Claude to distinguish operational guidelines from raw data."
      },
      {
        "term": "Output Guardrails",
        "cat": "Governance",
        "d": 3,
        "def": "Negative rules and constraints programmed into the prompt (or verified in post-processing) designed to prevent the model from emitting harmful content, unauthorized advice, or protected data."
      },
      {
        "term": "Over-reliance",
        "cat": "Governance",
        "d": 3,
        "def": "Cognitive and operational risk in which a company's employees uncritically accept the AI's responses without checking their accuracy, dazzled by the fluency and coherence of the text."
      },
      {
        "term": "Operational Handoff",
        "cat": "Workflows",
        "d": 2,
        "def": "Structured transfer point in a workflow where the draft or triage generated by Claude passes to an employee for personalization, data verification, and final sign-off."
      },
      {
        "term": "System Prompt",
        "cat": "Prompting",
        "d": 4,
        "def": "Set of primary guidelines that configure the model's personality, professional role, ethical limits, and permanent rules of conduct throughout an entire session or project."
      },
      {
        "term": "Data Retention Policy",
        "cat": "Governance",
        "d": 3,
        "def": "Policy that stipulates the period of time during which AI providers store query logs before secure deletion, a critical aspect for GDPR and SOC 2 compliance."
      },
      {
        "term": "Temperature & Determinism",
        "cat": "Troubleshooting",
        "d": 6,
        "def": "Inherent stochastic nature of language models that creates natural variability between successive responses; in business tasks it is controlled through tightly bounded prompts and fixed rubrics."
      }
    ]
  };
})(window);
