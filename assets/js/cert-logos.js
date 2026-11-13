/* =========================================================================
   assets/js/cert-logos.js — High-Craft Inline SVG Certification & Provider Logos
   Exam Arena Multi-Provider Simulator (14 Certifications)

   Exposes:
     - window.CERT_LOGOS: Map of 32x32 SVG string marks keyed by exam ID.
     - window.getCertLogo(examId, opts): Generates crisp SVG string marks
       with customizable size and CSS class name.
   ========================================================================= */
(function (root) {
  'use strict';

  var CLAUDE_SPARK_PATH = 'm4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z';

  var DATABRICKS_PATH = 'M.95 14.184L12 20.403l9.919-5.55v2.21L12 22.662l-10.484-5.96-.565.308v.77L12 24l11.05-6.218v-4.317l-.515-.309L12 19.118l-9.867-5.653v-2.21L12 16.805l11.05-6.218V6.32l-.515-.308L12 11.974 2.647 6.681 12 1.388l7.76 4.368.668-.411v-.566L12 0 .95 6.27v.72L12 13.207l9.919-5.55v2.26L12 15.52z';

  var NVIDIA_PATH = 'M8.948 8.798v-1.43a6.7 6.7 0 0 1 .424-.018c3.922-.124 6.493 3.374 6.493 3.374s-2.774 3.851-5.75 3.851c-.398 0-.787-.062-1.158-.185v-4.346c1.528.185 1.837.857 2.747 2.385l2.04-1.714s-1.492-1.952-4-1.952a6.016 6.016 0 0 0-.796.035m0-4.735v2.138l.424-.027c5.45-.185 9.01 4.47 9.01 4.47s-4.08 4.964-8.33 4.964c-.37 0-.733-.035-1.095-.097v1.325c.3.035.61.062.91.062 3.957 0 6.82-2.023 9.593-4.408.459.371 2.34 1.263 2.73 1.652-2.633 2.208-8.772 3.984-12.253 3.984-.335 0-.653-.018-.971-.053v1.864H24V4.063zm0 10.326v1.131c-3.657-.654-4.673-4.46-4.673-4.46s1.758-1.944 4.673-2.262v1.237H8.94c-1.528-.186-2.73 1.245-2.73 1.245s.68 2.412 2.739 3.11M2.456 10.9s2.164-3.197 6.5-3.533V6.201C4.153 6.59 0 10.653 0 10.653s2.35 6.802 8.948 7.42v-1.237c-4.84-.6-6.492-5.936-6.492-5.936z';

  /* Generador de geometría vectorial para el timón de 7 radios de Kubernetes */
  var K8S_HELM_INNER = (function () {
    var spokes = [];
    var rivets = [];
    for (var i = 0; i < 7; i++) {
      var angleDeg = -90 + (i * 360 / 7);
      var rad = angleDeg * Math.PI / 180;
      var cos = Math.cos(rad);
      var sin = Math.sin(rad);
      var xHub = (16 + cos * 4.6).toFixed(2);
      var yHub = (16 + sin * 4.6).toFixed(2);
      var xRimIn = (16 + cos * 9.7).toFixed(2);
      var yRimIn = (16 + sin * 9.7).toFixed(2);
      var xRimOut = (16 + cos * 11.9).toFixed(2);
      var yRimOut = (16 + sin * 11.9).toFixed(2);
      var xHandle = (16 + cos * 15.0).toFixed(2);
      var yHandle = (16 + sin * 15.0).toFixed(2);
      var xRivet = (16 + cos * 10.8).toFixed(2);
      var yRivet = (16 + sin * 10.8).toFixed(2);

      spokes.push('<line x1="' + xHub + '" y1="' + yHub + '" x2="' + xRimIn + '" y2="' + yRimIn + '" stroke="#326CE5" stroke-width="1.8"/>');
      spokes.push('<line x1="' + xRimOut + '" y1="' + yRimOut + '" x2="' + xHandle + '" y2="' + yHandle + '" stroke="#326CE5" stroke-width="2.2" stroke-linecap="round"/>');
      rivets.push('<circle cx="' + xRivet + '" cy="' + yRivet + '" r="0.85" fill="#FFFFFF"/>');
    }
    return spokes.join('') + rivets.join('');
  })();

  /* Definiciones de marcas vectoriales por ID de examen */
  var LOGO_DEFINITIONS = {
    /* 1. Anthropic · Claude Certified Architect */
    'claude-architect':
      '<defs>' +
        '<linearGradient id="clogo-claude-arch" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#F28C6E"/>' +
          '<stop offset="100%" stop-color="#D97757"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<circle cx="16" cy="16" r="14.2" stroke="#E07A5F" stroke-width="1.1" stroke-dasharray="3.2 2" stroke-opacity="0.85"/>' +
      '<circle cx="16" cy="16" r="11.8" stroke="#E07A5F" stroke-width="0.5" stroke-opacity="0.35"/>' +
      '<line x1="16" y1="0.5" x2="16" y2="3.2" stroke="#E07A5F" stroke-width="1.2" stroke-linecap="round"/>' +
      '<line x1="16" y1="28.8" x2="16" y2="31.5" stroke="#E07A5F" stroke-width="1.2" stroke-linecap="round"/>' +
      '<line x1="0.5" y1="16" x2="3.2" y2="16" stroke="#E07A5F" stroke-width="1.2" stroke-linecap="round"/>' +
      '<line x1="28.8" y1="16" x2="31.5" y2="16" stroke="#E07A5F" stroke-width="1.2" stroke-linecap="round"/>' +
      '<circle cx="6" cy="6" r="0.8" fill="#E07A5F" opacity="0.6"/>' +
      '<circle cx="26" cy="6" r="0.8" fill="#E07A5F" opacity="0.6"/>' +
      '<circle cx="6" cy="26" r="0.8" fill="#E07A5F" opacity="0.6"/>' +
      '<circle cx="26" cy="26" r="0.8" fill="#E07A5F" opacity="0.6"/>' +
      '<g transform="translate(16 16) scale(0.85) translate(-12 -12)">' +
        '<path d="' + CLAUDE_SPARK_PATH + '" fill="url(#clogo-claude-arch)"/>' +
      '</g>',

    /* 2. Anthropic · Claude Certified Developer */
    'claude-developer':
      '<defs>' +
        '<linearGradient id="clogo-claude-dev" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#F28C6E"/>' +
          '<stop offset="100%" stop-color="#D97757"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<path d="M6 10.5 L1.8 15 L6 19.5" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M26 10.5 L30.2 15 L26 19.5" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M13.5 28.5 L18.5 21.5" stroke="#E07A5F" stroke-width="2" stroke-linecap="round"/>' +
      '<g transform="translate(16 14.5) scale(0.8) translate(-12 -12)">' +
        '<path d="' + CLAUDE_SPARK_PATH + '" fill="url(#clogo-claude-dev)"/>' +
      '</g>',

    /* 3. Anthropic · Claude Certified Associate */
    'claude-associate':
      '<defs>' +
        '<linearGradient id="clogo-claude-assoc" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#F28C6E"/>' +
          '<stop offset="100%" stop-color="#D97757"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<g transform="translate(16 13) scale(0.8) translate(-12 -12)">' +
        '<path d="' + CLAUDE_SPARK_PATH + '" fill="url(#clogo-claude-assoc)"/>' +
      '</g>' +
      '<path d="M8.5 25.5 L16 29 L23.5 25.5" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M11 22.5 L16 25 L21 22.5" stroke="#E07A5F" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M16 19.2 L16.8 21 L18.7 21.2 L17.3 22.5 L17.7 24.3 L16 23.4 L14.3 24.3 L14.7 22.5 L13.3 21.2 L15.2 21 Z" fill="#FBBF24"/>',

    /* AI Agent Harness Engineering */
    'harness-engineering':
      '<defs>' +
        '<linearGradient id="clogo-harness-grad" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#818CF8"/>' +
          '<stop offset="100%" stop-color="#6366F1"/>' +
        '</linearGradient>' +
        '<linearGradient id="clogo-harness-core" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#EEF2FF"/>' +
          '<stop offset="100%" stop-color="#C7D2FE"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<path d="M16 2.8 L26.5 7.2 V15.2 C26.5 22.2 21.8 26.8 16 29.2 C10.2 26.8 5.5 22.2 5.5 15.2 V7.2 Z" fill="#6366F1" fill-opacity="0.16" stroke="#6366F1" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<ellipse cx="16" cy="16" rx="8" ry="3.5" transform="rotate(-28 16 16)" fill="none" stroke="#818CF8" stroke-width="1.2"/>' +
      '<ellipse cx="16" cy="16" rx="8" ry="3.5" transform="rotate(28 16 16)" fill="none" stroke="#A5B4FC" stroke-width="1.2" stroke-dasharray="2.5 1.5"/>' +
      '<circle cx="23.1" cy="12.3" r="1.3" fill="#818CF8"/>' +
      '<circle cx="8.9" cy="19.7" r="1.3" fill="#818CF8"/>' +
      '<path d="M16 11 L20 16 L16 21 L12 16 Z" fill="url(#clogo-harness-grad)" stroke="#EEF2FF" stroke-width="0.9"/>' +
      '<circle cx="16" cy="16" r="1.8" fill="#FFFFFF"/>' +
      '<path d="M13 5.8 H19" stroke="#818CF8" stroke-width="1.2" stroke-linecap="round"/>' +
      '<circle cx="16" cy="5.8" r="1" fill="#C7D2FE"/>',

    /* 4. Databricks · Generative AI Engineer Associate */
    'databricks-genai':
      '<defs>' +
        '<linearGradient id="clogo-db-genai" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#FF5A36"/>' +
          '<stop offset="100%" stop-color="#FF3621"/>' +
        '</linearGradient>' +
        '<linearGradient id="clogo-genai-star" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#FDE047"/>' +
          '<stop offset="100%" stop-color="#FFB800"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<g transform="translate(14.5 17) scale(0.9) translate(-12 -12)">' +
        '<path d="' + DATABRICKS_PATH + '" fill="url(#clogo-db-genai)"/>' +
      '</g>' +
      '<path d="M25 1 L26.3 5 L30.3 6.3 L26.3 7.6 L25 11.6 L23.7 7.6 L19.7 6.3 L23.7 5 Z" fill="url(#clogo-genai-star)"/>' +
      '<circle cx="25" cy="6.3" r="1.1" fill="#FFFFFF"/>' +
      '<path d="M19 1.5 L19.6 3.2 L21.3 3.8 L19.6 4.4 L19 6.1 L18.4 4.4 L16.7 3.8 L18.4 3.2 Z" fill="#FDE047" opacity="0.85"/>',

    /* 5. Databricks · Certified Data Engineer Associate */
    'databricks-de':
      '<defs>' +
        '<linearGradient id="clogo-db-de" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#FF5238"/>' +
          '<stop offset="50%" stop-color="#FF3621"/>' +
          '<stop offset="100%" stop-color="#E02200"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<g transform="translate(16 16) scale(1.02) translate(-12 -12)">' +
        '<path d="' + DATABRICKS_PATH + '" fill="url(#clogo-db-de)"/>' +
      '</g>',

    /* 6. NVIDIA · Generative AI Leader */
    'nvidia-genl':
      '<defs>' +
        '<linearGradient id="clogo-nvidia-grad" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#88D800"/>' +
          '<stop offset="100%" stop-color="#76B900"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<g transform="translate(16 16) scale(1.18) translate(-12 -12)">' +
        '<path d="' + NVIDIA_PATH + '" fill="url(#clogo-nvidia-grad)"/>' +
      '</g>',

    /* 7. Kubernetes · KCNA (Cloud Native Associate) */
    'k8s-kcna':
      '<circle cx="16" cy="16" r="4.6" fill="#326CE5"/>' +
      '<circle cx="16" cy="16" r="2.3" fill="#FFFFFF"/>' +
      '<circle cx="16" cy="16" r="10.8" fill="none" stroke="#326CE5" stroke-width="2.2"/>' +
      K8S_HELM_INNER,

    /* 8. HashiCorp · Terraform Associate (003) */
    'terraform-003':
      '<defs>' +
        '<linearGradient id="clogo-tf-1" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#8F5BE2"/>' +
          '<stop offset="100%" stop-color="#7B42BC"/>' +
        '</linearGradient>' +
        '<linearGradient id="clogo-tf-2" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#A86FF3"/>' +
          '<stop offset="100%" stop-color="#844FBA"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<g transform="translate(16 16) scale(1.15) translate(-12 -12)">' +
        '<path d="M0 0v7.551l7.433 3.776V3.775z" fill="url(#clogo-tf-1)"/>' +
        '<path d="M8.258 3.775v7.552l7.433 3.776V7.551z" fill="#7B42BC"/>' +
        '<path d="M16.492 0v7.551l7.508 3.776V3.775z" fill="url(#clogo-tf-2)"/>' +
        '<path d="M8.258 12.673v7.551l7.433 3.776v-7.551z" fill="#5C2D91"/>' +
      '</g>',

    /* 9. SRE · Site Reliability & Incident Management */
    'sre-incidents':
      '<defs>' +
        '<linearGradient id="clogo-sre-shield" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#EF4444" stop-opacity="0.3"/>' +
          '<stop offset="100%" stop-color="#B91C1C" stop-opacity="0.5"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<path d="M16 2.5 L27 6.8 V15.2 C27 22.2 22.2 27.2 16 29.5 C9.8 27.2 5 22.2 5 15.2 V6.8 Z" fill="url(#clogo-sre-shield)" stroke="#EF4444" stroke-width="1.8" stroke-linejoin="round"/>' +
      '<path d="M16 5 L24.5 8.5 V15 C24.5 20.5 20.8 24.5 16 26.5 C11.2 24.5 7.5 20.5 7.5 15 V8.5 Z" fill="none" stroke="#EF4444" stroke-width="0.7" stroke-opacity="0.35"/>' +
      '<path d="M3 16 H8.5 L10.8 12.5 L13.2 19.5 L16 7 L19.2 23.5 L21.8 13.5 L23.5 16 H29" fill="none" stroke="#EF4444" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/>' +
      '<path d="M3 16 H8.5 L10.8 12.5 L13.2 19.5 L16 7 L19.2 23.5 L21.8 13.5 L23.5 16 H29" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',

    /* 10. Apache Kafka & Confluent Streaming Platform */
    'kafka-confluent':
      '<path d="M8 16 C14 16 16.5 8.5 23 8.5" fill="none" stroke="#0EA5E9" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M8 16 C14 16 16.5 23.5 23 23.5" fill="none" stroke="#0EA5E9" stroke-width="2.6" stroke-linecap="round"/>' +
      '<circle cx="15.5" cy="11.5" r="1.4" fill="#38BDF8"/>' +
      '<circle cx="15.5" cy="20.5" r="1.4" fill="#38BDF8"/>' +
      '<circle cx="11.5" cy="16" r="1.2" fill="#7DD3FC"/>' +
      '<circle cx="8" cy="16" r="5" fill="#0EA5E9"/>' +
      '<circle cx="8" cy="16" r="2.5" fill="#FFFFFF"/>' +
      '<circle cx="8" cy="16" r="1.1" fill="#0369A1"/>' +
      '<circle cx="23" cy="8.5" r="4.2" fill="#0EA5E9"/>' +
      '<circle cx="23" cy="8.5" r="2" fill="#FFFFFF"/>' +
      '<circle cx="23" cy="8.5" r="0.9" fill="#0369A1"/>' +
      '<circle cx="23" cy="23.5" r="4.2" fill="#0EA5E9"/>' +
      '<circle cx="23" cy="23.5" r="2" fill="#FFFFFF"/>' +
      '<circle cx="23" cy="23.5" r="0.9" fill="#0369A1"/>',

    /* 11. Google Cloud · GenAI Leader */
    'gcp-genai-leader':
      '<defs>' +
        '<linearGradient id="clogo-gcp-spark" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#4285F4"/>' +
          '<stop offset="50%" stop-color="#34A853"/>' +
          '<stop offset="100%" stop-color="#EA4335"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<g transform="translate(3 5.44) scale(0.10156)">' +
        '<path fill="#EA4335" d="M170.252 56.819l22.253-22.253.983-9.37C153.436-11.677 88.976-7.496 52.42 33.92c-10.154 11.503-17.687 25.844-21.704 40.653l7.97-1.123 44.505-7.339 3.436-3.514c19.797-21.742 53.27-24.667 76.128-6.168z"/>' +
        '<path fill="#4285F4" d="M224.205 73.918c-5.115-18.836-15.616-35.769-30.217-48.722l-31.232 31.232c13.188 10.776 20.701 27.01 20.379 44.037v5.544c15.351 0 27.797 12.445 27.797 27.796 0 15.352-12.446 27.485-27.797 27.485H127.464l-5.466 5.934v33.34l5.466 5.231h55.671c39.93 0.311 72.552-31.494 72.863-71.424 0.188-24.203-11.745-46.893-31.793-60.453z"/>' +
        '<path fill="#34A853" d="M71.87 205.796h55.594v-44.506H71.87c-3.961 0-7.797-.851-11.399-2.497l-7.887 2.42-22.409 22.253-1.952 7.574c12.567 9.489 27.9 14.825 43.647 14.756z"/>' +
        '<path fill="#FBBC05" d="M71.87 61.426C31.939 61.664-.237 94.228 0 134.158c0.134 22.298 10.548 43.288 28.223 56.881l32.248-32.247c-13.991-6.221-20.208-22.686-13.887-36.676 6.32-13.99 22.786-20.207 36.775-13.887 6.165 2.785 11.102 7.723 13.887 13.887l32.248-32.247c-13.721-17.937-35.041-28.424-57.624-28.343z"/>' +
      '</g>' +
      '<path d="M26.5 1 L27.3 3.5 L29.8 4.3 L27.3 5.1 L26.5 7.6 L25.7 5.1 L23.2 4.3 L25.7 3.5 Z" fill="url(#clogo-gcp-spark)"/>',

    /* 12. Microsoft Azure · AZ-104 (Administrator Associate) */
    'az-104':
      '<defs>' +
        '<linearGradient id="clogo-az-dark" x1="58.972%" x2="37.191%" y1="7.411%" y2="103.762%">' +
          '<stop offset="0%" stop-color="#114A8B"/>' +
          '<stop offset="100%" stop-color="#0669BC"/>' +
        '</linearGradient>' +
        '<linearGradient id="clogo-az-light" x1="37.279%" x2="62.473%" y1="4.6%" y2="99.979%">' +
          '<stop offset="0%" stop-color="#38BDF8"/>' +
          '<stop offset="100%" stop-color="#0078D4"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<g transform="translate(4 4.66) scale(0.09375)">' +
        '<path fill="url(#clogo-az-dark)" d="M85.343.003h75.753L82.457 233a12.08 12.08 0 0 1-11.442 8.216H12.06A12.06 12.06 0 0 1 .633 225.303L73.898 8.219A12.08 12.08 0 0 1 85.343 0z"/>' +
        '<path fill="#0078D4" d="M195.423 156.282H75.297a5.56 5.56 0 0 0-3.796 9.627l77.19 72.047a12.14 12.14 0 0 0 8.28 3.26h68.02z"/>' +
        '<path fill="url(#clogo-az-light)" d="M182.098 8.207A12.06 12.06 0 0 0 170.67.003H86.245c5.175 0 9.773 3.301 11.428 8.204L170.94 225.3a12.062 12.062 0 0 1-11.428 15.92h84.429a12.062 12.062 0 0 0 11.425-15.92z"/>' +
      '</g>',

    /* 13. AWS · Certified Solutions Architect Associate (SAA-C03) */
    'aws-saa-c03':
      '<defs>' +
        '<linearGradient id="clogo-aws-cloud" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#334155"/>' +
          '<stop offset="100%" stop-color="#1E293B"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<path d="M16 4.2 C19 4.2 21.5 6.3 22.2 9.2 C24.5 9.6 26.2 11.6 26.2 14 C26.2 16.8 24 19 21.2 19 H10.8 C7.8 19 5.5 16.6 5.5 13.6 C5.5 10.9 7.4 8.7 10 8.2 C11 5.8 13.3 4.2 16 4.2 Z" fill="url(#clogo-aws-cloud)" stroke="#475569" stroke-width="1.1"/>' +
      '<text x="16" y="14.8" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif" font-size="7.6" font-weight="900" fill="#FFFFFF" letter-spacing="-0.4">aws</text>' +
      '<path d="M6.5 21.5 C11.5 26.2 20.5 26.2 25.5 21.8" fill="none" stroke="#FF9900" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M26.8 20.4 L25.5 23.4 L23.4 21.2 Z" fill="#FF9900"/>',

    /* Insignia Genérica de Respaldo */
    'default':
      '<defs>' +
        '<linearGradient id="clogo-def-grad" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#6366F1"/>' +
          '<stop offset="100%" stop-color="#4F46E5"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<path d="M16 2.5 L26 7 V15 C26 21.5 21.5 26.5 16 29 C10.5 26.5 6 21.5 6 15 V7 Z" fill="url(#clogo-def-grad)" stroke="#818CF8" stroke-width="1.2"/>' +
      '<path d="M16 8.5 L17.8 12.2 L21.8 12.8 L18.9 15.6 L19.6 19.5 L16 17.6 L12.4 19.5 L13.1 15.6 L10.2 12.8 L14.2 12.2 Z" fill="#FDE047"/>'
  };

  /* Mapa de alias para compatibilidad retroactiva o shorthands */
  var ALIASES = {
    'claude': 'claude-architect',
    'anthropic': 'claude-architect',
    'harness': 'harness-engineering',
    'databricks': 'databricks-de',
    'nvidia': 'nvidia-genl',
    'k8s': 'k8s-kcna',
    'kubernetes': 'k8s-kcna',
    'terraform': 'terraform-003',
    'hashicorp': 'terraform-003',
    'sre': 'sre-incidents',
    'kafka': 'kafka-confluent',
    'confluent': 'kafka-confluent',
    'gcp': 'gcp-genai-leader',
    'google': 'gcp-genai-leader',
    'azure': 'az-104',
    'aws': 'aws-saa-c03'
  };

  function resolveId(id) {
    if (!id) return 'default';
    var clean = String(id).toLowerCase().trim();
    if (LOGO_DEFINITIONS.hasOwnProperty(clean)) return clean;
    if (ALIASES.hasOwnProperty(clean)) return ALIASES[clean];
    return 'default';
  }

  /**
   * Genera un elemento SVG inline limpio para la certificación o proveedor indicado.
   *
   * @param {string} examId - Identificador del examen (ej. 'claude-architect', 'az-104')
   * @param {Object|number} [opts] - Opciones de renderizado { size: 32, className: '' }
   * @returns {string} Markup HTML SVG
   */
  function getCertLogo(examId, opts) {
    opts = (typeof opts === 'number') ? { size: opts } : (opts || {});
    var size = (opts.size != null && !isNaN(opts.size)) ? Number(opts.size) : 32;
    var customClass = opts.className ? ' ' + opts.className : '';
    var canonicalId = resolveId(examId);
    var inner = LOGO_DEFINITIONS[canonicalId] || LOGO_DEFINITIONS['default'];

    var cls = 'cert-logo cert-logo--' + canonicalId + customClass;

    return '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      inner +
    '</svg>';
  }

  /* Precompilar diccionario de marcas a 32x32 estándar */
  var CERT_LOGOS = {};
  var ALL_IDS = [
    'claude-architect',
    'claude-developer',
    'claude-associate',
    'harness-engineering',
    'databricks-genai',
    'databricks-de',
    'nvidia-genl',
    'k8s-kcna',
    'terraform-003',
    'sre-incidents',
    'kafka-confluent',
    'gcp-genai-leader',
    'az-104',
    'aws-saa-c03'
  ];

  ALL_IDS.forEach(function (id) {
    CERT_LOGOS[id] = getCertLogo(id, { size: 32 });
  });

  /* Asignar alias en el objeto CERT_LOGOS */
  Object.keys(ALIASES).forEach(function (alias) {
    var target = ALIASES[alias];
    if (CERT_LOGOS[target]) {
      CERT_LOGOS[alias] = CERT_LOGOS[target];
    }
  });

  /* Exposición global e interoperabilidad */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      CERT_LOGOS: CERT_LOGOS,
      getCertLogo: getCertLogo
    };
  }

  if (typeof root !== 'undefined') {
    root.CERT_LOGOS = CERT_LOGOS;
    root.getCertLogo = getCertLogo;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
