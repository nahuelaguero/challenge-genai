# Dashboard de Evaluación - Challenge GenAI

## Documentación de Prompt Engineering

### Técnicas Utilizadas

#### 1. **Chain-of-Thought (CoT) Prompting**

**Implementación:** Sección obligatoria "🤔 **Análisis:**" donde el modelo debe mostrar su razonamiento paso a paso.

**Ejemplo concreto en el prompt:**

```
🤔 **Análisis:** El cliente pregunta sobre comisiones pero no especifica si es tarjeta de débito o crédito. Debo proporcionar información de ambas para ser proactivo y completo.
```

**Justificación:** Esta técnica es fundamental en atención al cliente financiero porque permite al cliente entender el razonamiento del asistente, genera confianza y demuestra transparencia en la toma de decisiones.

#### 2. **Few-Shot Learning**

**Implementación:** Se proporcionan 2 ejemplos específicos y detallados que entrenan al modelo sobre el formato y tipo de respuesta esperado.

**Ejemplo concreto:**

- Ejemplo 1: Consulta ambigua sobre comisiones → Respuesta proactiva con ambas opciones
- Ejemplo 2: Problema técnico → Respuesta empática + soluciones múltiples

**Justificación:** Los ejemplos demuestran el comportamiento deseado y reducen la variabilidad en las respuestas del modelo.

#### 3. **Role Prompting**

**Implementación:** Define el rol específico como "asesor financiero experto de una fintech paraguaya llamada FinTechPro".

**Ejemplo concreto en el prompt:**

```
Eres un asesor financiero experto de una fintech paraguaya llamada "FinTechPro"
```

**Justificación:** Establece el contexto profesional, geográfico y cultural específico, manteniendo consistencia en el tono y tipo de respuestas.

#### 4. **Structured Output**

**Implementación:** Formato obligatorio de 4 secciones con emojis identificadores:

- 🤔 **Análisis:**
- 💡 **Respuesta:**
- 📋 **Detalles:**
- 🔄 **Siguiente paso:**

**Justificación:** Garantiza respuestas organizadas, fáciles de procesar automáticamente y consistentes para todos los casos.

#### 5. **Empathy-First Approach**

**Implementación:** Lista obligatoria de palabras empáticas que debe usar (mínimo 2 por respuesta):

- "entiendo" / "comprendo"
- "lamento" / "siento"
- "perfecto" / "excelente"
- "me da gusto" / "encantado"

**Ejemplo concreto:**

```
💡 **Respuesta:** Lamento mucho este inconveniente. Entiendo lo frustrante que debe ser esta situación, especialmente cuando necesitas realizar una transacción importante.
```

**Justificación:** En atención al cliente financiero, la empatía es crítica para manejar situaciones de estrés y frustración.

#### 6. **Information Grounding**

**Implementación:** Datos numéricos específicos y verificables en cada respuesta relevante.

**Ejemplo concreto:**

```
• Cuota de manejo: ₲125,000/mes (primer año GRATIS)
• Límites disponibles: desde ₲2,500,000 hasta ₲50,000,000
• Límite diario: ₲8,000,000
```

**Justificación:** Evita respuestas genéricas y proporciona información accionable y específica que el cliente puede usar para tomar decisiones.

### Técnicas NO Utilizadas y Justificación

#### 1. **Zero-Shot Learning**

**Por qué NO:** Los casos de uso financiero requieren consistencia y precisión específica. Sin ejemplos, el modelo podría generar respuestas incorrectas o inconsistentes.

#### 2. **Self-Consistency**

**Por qué NO:** En atención al cliente, necesitamos una respuesta determinística y clara, no múltiples opciones que puedan confundir al cliente.

#### 3. **Multi-Step Reasoning**

**Por qué NO:** Aunque útil para problemas complejos, puede resultar en respuestas demasiado largas y confusas para consultas simples de atención al cliente.

#### 4. **Adversarial Prompting**

**Por qué NO:** No es apropiado para atención al cliente, donde el objetivo es ser útil y empático, no resistir ataques.

#### 5. **Constitutional AI**

**Por qué NO:** El contexto financiero ya tiene regulaciones específicas, y las reglas están implementadas directamente en el prompt.

#### 6. **Tree of Thoughts**

**Por qué NO:** Explorar múltiples ramas de razonamiento puede confundir al cliente. En atención al cliente necesitamos una respuesta clara y directa.

### Métricas de Evaluación

El sistema evalúa 5 criterios principales:

1. **Estructura (0-1):** Presencia de las 4 secciones obligatorias
2. **Palabras Clave (0-1):** Inclusión de términos esperados según el contexto
3. **Clarificación (0-1):** Manejo adecuado de consultas ambiguas
4. **Longitud (0-1):** Respuestas con extensión apropiada (ni muy cortas ni muy largas)
5. **Empatía (0-1):** Uso de palabras empáticas y tono apropiado

### Dataset Balanceado

El dataset incluye **10 casos** que demuestran diferentes niveles de desempeño:

- **6 casos exitosos** (0.77-1.0): Demuestran funcionamiento correcto
- **3 casos problemáticos** (0.21-0.56): Muestran fallas reales del sistema
- **1 caso límite** (0.77): Funcional pero con mejoras posibles

Este enfoque balanceado permite una evaluación realista del sistema y identificación de áreas de mejora.

## Información del Proyecto

- **Modelo utilizado:** GPT-3.5 Turbo (OpenAI)
- **Contexto:** Fintech paraguaya "FinTechPro"
- **Productos:** Tarjetas de débito, tarjetas de crédito, préstamos
- **Moneda:** Guaraníes (₲)
- **Contacto:** 0800-FINTECH, WhatsApp +595 981 123 456

## Instalación y Uso

```bash
cd evaluation-dashboard
npm install
npm run dev
```

El dashboard estará disponible en `http://localhost:3000`
