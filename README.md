# ⚡ Cloud & SRE Exam Arena

Plataforma unificada de simulación de exámenes cloud y entrenamiento de incidentes SRE en producción. Construida sin dependencias de build (HTML, CSS y JS puros) e integrada con [`@fabianimv/study-tracker`](https://github.com/fabianimv/study-tracker) para medir el avance por proveedor, dominio, semana y mes directamente en el navegador.

## Proveedores y Simuladores incluidos

| Proveedor | ID (`appId`) | Contenido | Dominios |
| :--- | :--- | :--- | :--- |
| 🚨 **SRE & Production** | `sre-incidents` | **60 escenarios reales de incidentes en producción**, 7 guías de estudio y 50 términos de glosario SRE | 1. Triage, Incident Command y SLIs/SLOs (15 %)<br>2. Kubernetes, Contenedores y Tráfico (25 %)<br>3. Kafka, Mensajería y Sistemas Distribuidos (20 %)<br>4. Observabilidad: Prometheus, Thanos, Grafana y Datadog (15 %)<br>5. Bases de Datos, Storage, Caché y DRP (15 %)<br>6. Redes, DNS, TLS, Seguridad y GitOps/IaC (10 %) |
| ☁️ **Google Cloud** | `gcp-genai-leader` | **200 preguntas** con explicación individual por opción incorrecta, 16 temas y 85 términos de glosario | 1. Fundamentos de la gen AI (30 %)<br>2. Oferta de gen AI de Google Cloud (35 %)<br>3. Técnicas para mejorar la salida del modelo (20 %)<br>4. Estrategias de negocio (15 %) |
| 🔷 **Microsoft Azure** | `az-104` | **130 preguntas** para **AZ-104 Azure Administrator**, 5 guías de dominio y glosario | 1. Identities & Governance (20 %)<br>2. Storage (15 %)<br>3. Compute (20 %)<br>4. Networking (25 %)<br>5. Monitor & Backup (20 %) |
| 🟧 **Amazon Web Services** | `aws-saa-c03` | **44 preguntas** para **AWS Solutions Architect Associate (SAA-C03)**, 4 guías de dominio y glosario | 1. Design Secure Architectures (30 %)<br>2. Design Resilient Architectures (26 %)<br>3. Design High-Performing Architectures (24 %)<br>4. Design Cost-Optimized Architectures (20 %) |

## Cómo funciona la corrección (estilo GCP)

Cada pregunta sigue el flujo de estudio activo:

1. **Confirmación explícita**: seleccionas la(s) respuesta(s) y pulsas **Responder**.
2. **Si aciertas (`✔ Correcto`)**: se muestra en verde la explicación completa de por qué esa arquitectura o acción de mitigación es la correcta.
3. **Si te equivocas (`✘ Incorrecto`)**:
   - Primero ves en un bloque rojo **Tu respuesta** junto con **Por qué está mal** (una explicación específica para el distractor que elegiste: por qué empeoraría el incidente, qué límite técnico viola o por qué no ataca la causa raíz).
   - Debajo ves en un bloque verde la **Respuesta correcta** junto con **Por qué** es la adecuada.
4. **Repaso final y repetición selectiva**: al terminar una prueba puedes pulsar **Repetir las N falladas** o iniciar una sesión filtrando desde `@fabianimv/study-tracker` únicamente las preguntas **nuevas** o las **falladas la última vez**.

## Seguimiento de progreso con `@fabianimv/study-tracker`

Cada simulador utiliza su propio `appId` independiente en `localStorage` (`study-tracker:sre-incidents`, `study-tracker:gcp-genai-leader`, `study-tracker:az-104`, `study-tracker:aws-saa-c03`):

- **Dominio estimado (Mastery)**: porcentaje de preguntas vistas que acertaste la última vez que las respondiste.
- **Tendencia semanal y mensual**: evolución del porcentaje de acierto y cambio respecto al periodo anterior.
- **Desglose por dominio e historial de sesiones**: con detalle pregunta por pregunta.
- **Portabilidad JSON**: botones de **Exportar copia** e **Importar copia** compatibles con los respaldos de tus repositorios individuales.

## Cómo añadir un nuevo proveedor o examen

Crea un fichero en `data/<proveedor>/exam.js` que registre una entrada en `window.EXAMS['<id>']` con la estructura:

```js
window.EXAMS['mi-examen'] = {
  id: 'mi-examen',
  appId: 'mi-examen',
  provider: 'Nombre del Proveedor',
  badge: 'Badge corto',
  icon: '🎯',
  title: 'Título completo',
  subtitle: 'Descripción corta',
  passingScore: 70,
  domains: { 1: 'Dominio 1 (50 %)', 2: 'Dominio 2 (50 %)' },
  shortDomains: { 1: 'Dom 1', 2: 'Dom 2' },
  topics: [ /* { id, d, title, html } */ ],
  questions: [ /* { id, d, t, q, o: [...], a: 0, e: '...' } */ ],
  why: { /* 'q-id': [null, 'Por qué la opción 1 está mal', ...] */ },
  glossary: [ /* { term, cat, d, def, tip? } */ ]
};
```

Y añade el `<script src="data/<proveedor>/exam.js"></script>` en `index.html` y su `id` en `EXAM_ORDER` dentro de `assets/js/app.js`.

## Ejecución local

No requiere instalación ni compilación. Puedes servir la carpeta con cualquier servidor estático:

```bash
python3 -m http.server 8080
# Abre http://localhost:8080
```

## Licencia

[MIT](LICENSE) © Fabián Muñoz
