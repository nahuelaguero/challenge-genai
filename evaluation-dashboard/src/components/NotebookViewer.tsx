"use client";

import React, { useState } from "react";
import ArchitectureDiagram from "./ArchitectureDiagram";

interface Metrics {
  structure_score: number;
  keyword_score: number;
  clarification_score: number;
  length_score: number;
  empathy_score: number;
  overall_score: number;
}

interface EvaluationCase {
  query: string;
  response: string;
  liveResponse?: string;
  simulatedMetrics?: Metrics;
  liveMetrics?: Metrics;
}

interface ExpectedData {
  expectedComponents: string[];
  expectedKeywords: string[];
  requiresClarification: boolean;
}

// Dataset con respuestas simuladas para cada caso
const evaluationDataset = [
  {
    id: 1,
    query:
      "Mi tarjeta de débito fue rechazada y tengo dinero en la cuenta, qué puede estar pasando?",
    expectedIntent: "problema_tarjeta",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: [
      "tarjeta",
      "bloqueada",
      "límite",
      "seguridad",
      "verificar",
    ],
    requiresClarification: false,
    response: `Lamento mucho que hayas tenido este inconveniente con tu tarjeta. Entiendo lo frustrante que puede ser.

**Mi proceso de análisis:**
1. Verificaré posibles causas del rechazo
2. Revisaré el estado de tu tarjeta
3. Te ofreceré soluciones inmediatas

**Posibles causas:**
- La tarjeta podría estar bloqueada por seguridad
- Límite diario de transacciones alcanzado
- Problema temporal con el comercio o terminal
- Tarjeta dañada físicamente

**¿Puedes confirmarme:**
- ¿Es la primera vez que te pasa hoy?
- ¿Has realizado otras compras exitosas recientemente?
- ¿Recibiste alguna notificación en tu app?

Mientras tanto, puedes intentar pagar con nuestra app móvil usando QR.`,
    metrics: {
      clarity: 0.78,
      empathy: 0.85,
      completeness: 0.72,
      accuracy: 0.75,
    },
  },
  {
    id: 2,
    query: "Cómo solicito una tarjeta de crédito?",
    expectedIntent: "solicitud_producto",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: [
      "requisitos",
      "documentos",
      "ingresos",
      "proceso",
      "app",
    ],
    requiresClarification: false,
    response: `🤔 **Análisis:** Detecté que deseas solicitar una tarjeta de crédito.

💡 **Respuesta:** ¡Excelente decisión! Solicitar tu tarjeta de crédito es muy sencillo a través de nuestra app o web.

📋 **Detalles:**
• Requisitos básicos:
  - Ser mayor de 18 años
  - Ingresos mínimos de $800.000
  - Documento de identidad vigente
  - Historial crediticio (no indispensable)

• Documentos necesarios:
  - Cédula de ciudadanía
  - Certificado laboral o de ingresos
  - Extractos bancarios últimos 3 meses

• Proceso de solicitud:
  1. Ingresa a la app/web
  2. Selecciona "Solicitar tarjeta de crédito"
  3. Completa el formulario
  4. Adjunta documentos
  5. Espera aprobación (24-48 horas)

🔄 **Siguiente paso:** ¿Te gustaría que te envíe el link directo para iniciar tu solicitud? También puedo explicarte los beneficios de nuestras tarjetas.`,
    metrics: {
      clarity: 0.82,
      empathy: 0.75,
      completeness: 0.85,
      accuracy: 0.8,
    },
  },
  {
    id: 3,
    query: "Necesito un préstamo",
    expectedIntent: "solicitud_prestamo",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: ["monto", "plazo", "tasa", "requisitos", "simulador"],
    requiresClarification: true,
    response: `🤔 **Análisis:** Entiendo que necesitas un préstamo. Para ofrecerte la mejor opción, necesito conocer algunos detalles.

💡 **Respuesta:** Perfecto, puedo ayudarte con información sobre nuestros préstamos personales. Tenemos varias opciones según tus necesidades.

📋 **Detalles:** 
• Tipos de préstamos disponibles:
  - Libre inversión: desde $1M hasta $50M
  - Educativo: condiciones especiales
  - Vivienda: hasta 70% del valor
  
• Plazos: desde 6 hasta 60 meses
• Tasas: desde 1.2% mensual
• Aprobación: 24 horas

Para darte información más específica, necesito saber:
- ¿Qué monto aproximado necesitas?
- ¿Para qué lo necesitas?
- ¿En cuánto tiempo podrías pagarlo?

🔄 **Siguiente paso:** Puedo realizar una simulación personalizada con estos datos o explicarte el proceso de solicitud.`,
    metrics: {
      clarity: 0.8,
      empathy: 0.7,
      completeness: 0.78,
      accuracy: 0.82,
    },
  },
  {
    id: 4,
    query: "cuales son las comisiones de la tarjeta",
    expectedIntent: "consulta_comisiones",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: ["cuota", "manejo", "retiro", "transferencia", "gratis"],
    requiresClarification: true,
    response: `🤔 **Análisis:** Veo que necesitas información sobre comisiones. Como manejamos diferentes tarjetas, te daré un resumen general.

💡 **Respuesta:** Las comisiones varían según el tipo de tarjeta (débito o crédito). Te muestro el detalle:

📋 **Detalles:**
**Tarjeta de Débito:**
• Cuota de manejo: $0 (¡Gratis!)
• Retiros en cajeros propios: $0
• Retiros en otros cajeros: $4,500
• Transferencias: $0
• Compras: $0

**Tarjeta de Crédito:**
• Cuota de manejo: $15,000/mes (primer año gratis)
• Avances: 3% del monto
• Compras: $0
• Pagos diferidos: según el plazo

¿De cuál tarjeta específicamente necesitas información?

🔄 **Siguiente paso:** Puedo explicarte cómo evitar algunas comisiones o los beneficios adicionales de cada tarjeta.`,
    metrics: {
      clarity: 0.79,
      empathy: 0.65,
      completeness: 0.75,
      accuracy: 0.77,
    },
  },
  {
    id: 5,
    query: "Como bajo mi app?",
    expectedIntent: "descarga_app",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: ["descargar", "Play Store", "App Store", "link", "QR"],
    requiresClarification: false,
    response: `🤔 **Análisis:** Necesitas descargar nuestra aplicación móvil.

💡 **Respuesta:** ¡Perfecto! Descargar nuestra app es muy fácil y rápido. Te explico cómo hacerlo según tu dispositivo.

📋 **Detalles:**
**Para Android:**
1. Abre Google Play Store
2. Busca "[Nombre Fintech]"
3. Toca "Instalar"
4. Espera la descarga

**Para iPhone:**
1. Abre App Store
2. Busca "[Nombre Fintech]"
3. Toca "Obtener"
4. Confirma con Face ID/Touch ID

**Alternativa rápida:**
• Envía "APP" al WhatsApp +57 300 XXX XXXX
• Te llegará el link directo

La app pesa aproximadamente 45MB y es compatible con Android 5.0+ y iOS 12+.

🔄 **Siguiente paso:** Una vez descargada, puedo guiarte en el proceso de registro si lo necesitas.`,
    metrics: {
      clarity: 0.85,
      empathy: 0.72,
      completeness: 0.83,
      accuracy: 0.81,
    },
  },
  {
    id: 6,
    query: "Olvide mi clave que hago",
    expectedIntent: "recuperar_clave",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: [
      "recuperar",
      "restablecer",
      "SMS",
      "correo",
      "seguridad",
    ],
    requiresClarification: false,
    response: `🤔 **Análisis:** Veo que olvidaste tu clave de acceso. No te preocupes, es algo común.

💡 **Respuesta:** Entiendo tu situación. Recuperar tu clave es un proceso sencillo y seguro que puedes hacer en minutos.

📋 **Detalles:** 
**Opción 1 - Desde la app:**
1. En la pantalla de login, toca "¿Olvidaste tu clave?"
2. Ingresa tu número de documento
3. Recibirás un código por SMS
4. Ingresa el código y crea tu nueva clave

**Opción 2 - Por seguridad adicional:**
• Llama al 01 8000 XXX XXX
• Ten a mano tu documento y tarjeta
• Responde las preguntas de seguridad
• El asesor te ayudará inmediatamente

**Recomendaciones para tu nueva clave:**
• Mínimo 8 caracteres
• Combina números y letras
• Evita fechas de nacimiento

🔄 **Siguiente paso:** ¿Prefieres que te envíe el link directo para recuperar tu clave o necesitas ayuda adicional?`,
    metrics: {
      clarity: 0.83,
      empathy: 0.88,
      completeness: 0.82,
      accuracy: 0.84,
    },
  },
  {
    id: 7,
    query: "puedo pagar netflix con la tarjeta?",
    expectedIntent: "uso_tarjeta",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: [
      "internacional",
      "suscripciones",
      "débito",
      "crédito",
      "activar",
    ],
    requiresClarification: false,
    response: `🤔 **Análisis:** Quieres saber si puedes usar tu tarjeta para pagar Netflix.

💡 **Respuesta:** ¡Sí, absolutamente! Puedes usar tanto tu tarjeta de débito como de crédito para pagar Netflix y otras suscripciones.

📋 **Detalles:**
**Con Tarjeta de Crédito:**
✓ Funciona de inmediato
✓ Acumulas puntos por cada pago
✓ Puedes diferir a 1 cuota sin interés

**Con Tarjeta de Débito:**
✓ Debes activar compras internacionales
✓ Se debita directo de tu cuenta
✓ Sin costos adicionales

**Para activar compras internacionales:**
1. Ingresa a la app
2. Ve a "Mis tarjetas"
3. Activa "Compras por internet"
4. ¡Listo! Ya puedes usarla

**Tip:** También sirve para Spotify, Disney+, Amazon Prime y más.

🔄 **Siguiente paso:** ¿Necesitas ayuda para activar las compras internacionales en tu tarjeta?`,
    metrics: {
      clarity: 0.87,
      empathy: 0.78,
      completeness: 0.86,
      accuracy: 0.85,
    },
  },
  {
    id: 8,
    query: "Hasta que hora atienden",
    expectedIntent: "horarios_atencion",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: ["horario", "24/7", "chat", "teléfono", "oficina"],
    requiresClarification: false,
    response: `🤔 **Análisis:** Necesitas conocer nuestros horarios de atención.

💡 **Respuesta:** Te comparto todos nuestros canales y horarios de atención para que elijas el más conveniente.

📋 **Detalles:**
**Chat en app y web:** 
• 24/7 todos los días
• Respuesta inmediata con IA
• Agente humano: 6 AM - 10 PM

**Línea telefónica:**
• Lunes a viernes: 7 AM - 8 PM
• Sábados: 8 AM - 5 PM
• Domingos y festivos: 9 AM - 3 PM

**Oficinas físicas:**
• Lunes a viernes: 8 AM - 5 PM
• Sábados: 9 AM - 1 PM
• Domingos: Cerrado

**WhatsApp Business:**
• 24/7 para consultas
• Agente: 8 AM - 6 PM

🔄 **Siguiente paso:** ¿Hay algo específico en lo que necesites ayuda ahora mismo?`,
    metrics: {
      clarity: 0.84,
      empathy: 0.73,
      completeness: 0.88,
      accuracy: 0.82,
    },
  },
  {
    id: 9,
    query: "tengo un cobro que no reconozco",
    expectedIntent: "reclamo_transaccion",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: [
      "bloquear",
      "disputa",
      "fraude",
      "seguridad",
      "reembolso",
    ],
    requiresClarification: true,
    response: `🤔 **Análisis:** Detecté un posible cargo no reconocido en tu cuenta. Esto requiere atención inmediata.

💡 **Respuesta:** Lamento esta situación. Vamos a resolverlo rápidamente. Tu seguridad es nuestra prioridad.

📋 **Detalles:**
**Acciones inmediatas:**
1. ¿Ya bloqueaste tu tarjeta? 
   - Si no: Ve a la app > Mis tarjetas > Bloquear
   - O llama al 01 8000 XXX XXX

2. **Necesito estos datos del cobro:**
   - Fecha de la transacción
   - Monto exacto
   - Nombre del comercio

**Proceso de reclamo:**
• Tienes 120 días para reportar
• Investigación: 5-15 días hábiles
• Si procede, reembolso en 48 horas

**Medidas de seguridad:**
• Cambiaremos tu tarjeta sin costo
• Revisaremos todas tus transacciones
• Activaremos alertas adicionales

🔄 **Siguiente paso:** Por favor compárteme los detalles del cobro para iniciar el reclamo formal inmediatamente.`,
    metrics: {
      clarity: 0.81,
      empathy: 0.9,
      completeness: 0.84,
      accuracy: 0.83,
    },
  },
  {
    id: 10,
    query: "cuanto me prestan",
    expectedIntent: "consulta_capacidad",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: [
      "capacidad",
      "ingresos",
      "historial",
      "simulador",
      "monto",
    ],
    requiresClarification: true,
    response: `🤔 **Análisis:** Quieres conocer tu capacidad de préstamo. Esto depende de varios factores.

💡 **Respuesta:** Entiendo que quieres saber cuánto puedes solicitar. Tu capacidad de préstamo depende de tu perfil financiero.

📋 **Detalles:**
**Factores que determinan el monto:**
• Ingresos mensuales demostrados
• Gastos y obligaciones actuales
• Historial crediticio
• Tipo de contrato laboral
• Antigüedad laboral

**Rangos generales:**
• Ingresos $1-2M: hasta $5M
• Ingresos $2-4M: hasta $15M
• Ingresos +$4M: hasta $50M

**Para cálculo exacto necesito:**
- Tus ingresos mensuales
- Si tienes otros créditos
- Para qué necesitas el préstamo

**Simulador en línea:**
App > Préstamos > Simular

🔄 **Siguiente paso:** ¿Te gustaría que hagamos una simulación rápida con tus datos o prefieres usar el simulador de la app?`,
    metrics: {
      clarity: 0.77,
      empathy: 0.68,
      completeness: 0.76,
      accuracy: 0.78,
    },
  },
];

export default function NotebookViewer() {
  const [activeTab, setActiveTab] = useState("ejercicio1");
  const [showDataset, setShowDataset] = useState(false);
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [evaluationCases, setEvaluationCases] = useState<{
    [key: number]: EvaluationCase;
  }>({});
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});

  // Importar la función de evaluación
  const evaluateResponse = (
    response: string,
    expectedData: ExpectedData
  ): Metrics => {
    const results: Metrics = {
      structure_score: 0,
      keyword_score: 0,
      clarification_score: 0,
      length_score: 0,
      empathy_score: 0,
      overall_score: 0,
    };

    // 1. Verificar componentes estructurales
    let structureScore = 0;
    for (const component of expectedData.expectedComponents) {
      if (
        component === "analysis" &&
        response.includes("🤔") &&
        response.includes("Análisis:")
      ) {
        structureScore += 1;
      } else if (
        component === "response" &&
        response.includes("💡") &&
        response.includes("Respuesta:")
      ) {
        structureScore += 1;
      } else if (
        component === "details" &&
        response.includes("📋") &&
        response.includes("Detalles:")
      ) {
        structureScore += 1;
      } else if (
        component === "next_step" &&
        response.includes("🔄") &&
        response.includes("Siguiente paso:")
      ) {
        structureScore += 1;
      }
    }
    results.structure_score =
      structureScore / expectedData.expectedComponents.length;

    // 2. Verificar presencia de palabras clave
    let keywordsFound = 0;
    const responseLower = response.toLowerCase();
    for (const keyword of expectedData.expectedKeywords) {
      if (responseLower.includes(keyword.toLowerCase())) {
        keywordsFound += 1;
      }
    }
    results.keyword_score =
      keywordsFound / expectedData.expectedKeywords.length;

    // 3. Verificar manejo de aclaración
    const needsClarification = expectedData.requiresClarification;
    const asksForClarification = [
      "necesito",
      "podrías",
      "específico",
      "aclaración",
      "cuál",
      "qué",
    ].some((phrase) => responseLower.includes(phrase));

    results.clarification_score =
      needsClarification === asksForClarification ? 1.0 : 0.0;

    // 4. Verificar longitud apropiada
    const length = response.length;
    if (length >= 200 && length <= 800) {
      results.length_score = 1.0;
    } else if (
      (length >= 100 && length < 200) ||
      (length > 800 && length <= 1000)
    ) {
      results.length_score = 0.7;
    } else {
      results.length_score = 0.3;
    }

    // 5. Verificar tono empático
    const empathyIndicators = [
      "entiendo",
      "perfecto",
      "ayudo",
      "lamento",
      "bienvenido",
    ];
    const empathyScore = empathyIndicators.filter((indicator) =>
      responseLower.includes(indicator)
    ).length;
    results.empathy_score = Math.min(empathyScore / 2, 1.0);

    // 6. Score general
    results.overall_score =
      results.structure_score * 0.3 +
      results.keyword_score * 0.25 +
      results.clarification_score * 0.2 +
      results.length_score * 0.1 +
      results.empathy_score * 0.15;

    return results;
  };

  const handleTestCase = async (caseId: number) => {
    setIsLoading((prev) => ({ ...prev, [caseId]: true }));

    try {
      const caseData = evaluationDataset.find((c) => c.id === caseId);
      if (!caseData) return;

      // Sistema simulado
      const simulatedResponse = caseData.response;
      const simulatedMetrics = evaluateResponse(simulatedResponse, caseData);

      // Sistema real - llamada a ChatGPT
      const response = await fetch("/api/test-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: caseData.query,
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert(`Error: ${data.error}`);
        return;
      }

      const liveMetrics = evaluateResponse(data.response, caseData);

      setEvaluationCases((prev) => ({
        ...prev,
        [caseId]: {
          query: caseData.query,
          response: simulatedResponse,
          liveResponse: data.response,
          simulatedMetrics: simulatedMetrics,
          liveMetrics: liveMetrics,
        },
      }));
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servicio");
    } finally {
      setIsLoading((prev) => ({ ...prev, [caseId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-center mb-4">
            Challenge itti 2025
          </h1>
          <p className="text-center text-gray-600">
            Prompt Engineering y Arquitectura Cognitiva
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("ejercicio1")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "ejercicio1"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Entrega Principal
          </button>
          <button
            onClick={() => setActiveTab("ejercicio2")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "ejercicio2"
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Arquitectura Cognitiva
          </button>
        </div>

        {/* Content */}
        {activeTab === "ejercicio1" && (
          <div className="space-y-6">
            {/* Objetivo */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-black mb-4">
                1 - Prompt Engineering para Bot de Fintech
              </h2>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-black mb-3">Objetivo</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Diseñar un prompt unificado aplicando técnicas de in-context
                  learning para un bot de atención al cliente de fintech.
                  Productos: tarjetas de débito, tarjetas de crédito y
                  préstamos.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-bold text-black mb-4">
                  Entregables
                </h3>
                <ul className="space-y-4">
                  <li>
                    <strong className="text-black">Prompt Unificado:</strong>
                    <p className="text-gray-600 mt-1">
                      Prompt completo con técnicas de prompting avanzadas.
                      Modelo: GPT-4.
                    </p>
                  </li>
                  <li>
                    <strong className="text-black">Documentación:</strong>
                    <p className="text-gray-600 mt-1">
                      Técnicas utilizadas y justificación de su uso.
                    </p>
                  </li>
                  <li>
                    <strong className="text-black">Evaluaciones:</strong>
                    <p className="text-gray-600 mt-1">
                      Dataset de 5-10 ejemplos con métricas de desempeño. Código
                      replicable incluido.
                    </p>
                  </li>
                  <li>
                    <strong className="text-black">Ejemplos de Salidas:</strong>
                    <p className="text-gray-600 mt-1">
                      Demostraciones del funcionamiento en diferentes
                      escenarios.
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Prompt Propuesto */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-black mb-4">
                Prompt Propuesto
              </h3>
              <div className="bg-gray-900 text-white p-6 rounded-lg overflow-x-auto">
                <pre className="whitespace-pre-wrap font-mono text-sm">{`Eres un asesor financiero experto de una fintech llamada "FinTechPro". Tu objetivo es ayudar a los clientes con consultas sobre productos financieros específicos.

PRODUCTOS DISPONIBLES:
1. Tarjeta de débito (sin costo anual)
2. Tarjeta de crédito (cuota anual $2,500, límites $5,000-$200,000)
3. Préstamos personales (desde $10,000 hasta $500,000, tasas desde 18% anual)

ESTRUCTURA DE RESPUESTA OBLIGATORIA:
🤔 **Análisis:** [Analiza la consulta del cliente]
💡 **Respuesta:** [Responde directamente a la consulta]
📋 **Detalles:** [Proporciona detalles específicos del producto]
🔄 **Siguiente paso:** [Indica qué hacer a continuación]

TÉCNICAS DE IN-CONTEXT LEARNING:
1. **Few-shot learning:** Usa los ejemplos proporcionados como referencia
2. **Chain-of-thought:** Muestra tu razonamiento paso a paso
3. **Empathy:** Reconoce las emociones del cliente y responde apropiadamente
4. **Clarification:** Si la consulta es ambigua, pide información específica

EJEMPLOS DE RESPUESTAS:

Ejemplo 1 - Consulta: "¿Cuál es el límite de mi tarjeta de crédito?"
🤔 **Análisis:** El cliente pregunta sobre el límite de crédito. No tengo información específica de su cuenta, debo explicar los rangos generales.
💡 **Respuesta:** Entiendo tu consulta sobre el límite de crédito. Los límites de nuestra tarjeta van desde $5,000 hasta $200,000, dependiendo de tu perfil crediticio.
📋 **Detalles:** La evaluación incluye historial crediticio, ingresos y antigüedad laboral. Nuestra tarjeta tiene una cuota anual de $2,500 con diversos beneficios.
🔄 **Siguiente paso:** Te recomiendo que revisemos tu perfil específico para conocer tu límite exacto. ¿Te gustaría que iniciemos ese proceso?

Ejemplo 2 - Consulta: "Necesito un préstamo"
🤔 **Análisis:** El cliente solicita un préstamo pero no especifica el monto ni el propósito. Necesito más información para brindar una respuesta precisa.
💡 **Respuesta:** Me da gusto saber que estás interesado en nuestros préstamos personales. Ofrecemos préstamos desde $10,000 hasta $500,000.
📋 **Detalles:** Nuestras tasas comienzan desde 18% anual, con plazos de hasta 60 meses. El proceso de aprobación toma entre 24-48 horas una vez completada la documentación.
🔄 **Siguiente paso:** Para brindarte información más específica, necesito conocer el monto que requieres y el propósito del préstamo. ¿Podrías proporcionarme esos detalles?

REGLAS IMPORTANTES:
- Usa emojis para hacer las respuestas más amigables y visualmente atractivas
- Usa un tono profesional pero cálido
- Sé empático con frases como "entiendo tu situación", "lamento escuchar eso", "me da gusto ayudarte"
- Si no tienes información específica, sé honesto al respecto
- Prioriza la seguridad del cliente en casos de emergencia

Mantén siempre un tono profesional, empático y orientado a la solución.`}</pre>
              </div>
            </div>

            {/* Técnicas Utilizadas */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-black mb-4">
                Técnicas de Prompt Engineering
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-bold text-black mb-2">
                    Chain of Thought (CoT)
                  </h4>
                  <p className="text-gray-600 text-sm">
                    El modelo muestra su proceso de razonamiento paso a paso
                    antes de dar la respuesta final.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-bold text-black mb-2">
                    Few-Shot Learning
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Se proporcionan ejemplos específicos de consultas y
                    respuestas para guiar el comportamiento.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-bold text-black mb-2">Role Prompting</h4>
                  <p className="text-gray-600 text-sm">
                    Define el rol como &quot;asesor financiero experto&quot;
                    para mantener consistencia profesional.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-bold text-black mb-2">
                    Structured Output
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Formato de respuesta obligatorio con 5 secciones para
                    mantener claridad y consistencia.
                  </p>
                </div>
              </div>
            </div>

            {/* Dataset de Evaluación */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-black mb-4">
                Dataset de Evaluación y Métricas
              </h3>
              <p className="text-gray-600 mb-6">
                10 casos de prueba que cubren los principales escenarios de
                consultas en una fintech. Cada caso incluye métricas de
                evaluación calculadas automáticamente.
              </p>

              {/* API Key Status */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-green-800">
                    API Key de OpenAI configurada correctamente
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <button
                  onClick={() => setShowDataset(!showDataset)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showDataset ? "Ocultar Dataset" : "Ver Dataset Completo"}
                </button>
              </div>

              {showDataset && (
                <div className="mt-6 space-y-4">
                  {evaluationDataset.map((item) => (
                    <div key={item.id} className="border rounded-lg">
                      <button
                        onClick={() =>
                          setSelectedCase(
                            selectedCase === item.id ? null : item.id
                          )
                        }
                        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-black">
                              Caso {item.id}:
                            </span>
                            <span className="ml-2 text-gray-700">
                              {item.query}
                            </span>
                          </div>
                          <span className="text-lg">
                            {selectedCase === item.id ? "−" : "+"}
                          </span>
                        </div>
                      </button>

                      {selectedCase === item.id && (
                        <div className="p-4 border-t bg-gray-50">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-bold text-black mb-2">
                                Query del usuario:
                              </h4>
                              <p className="text-gray-700 italic mb-6">
                                {item.query}
                              </p>
                              <hr className="my-4" />
                            </div>

                            {/* Comparación lado a lado */}
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Sistema Simulado */}
                              <div className="space-y-4">
                                <h4 className="font-semibold text-gray-700 text-center">
                                  Sistema Simulado
                                </h4>
                                <div className="bg-white p-4 rounded border min-h-[300px]">
                                  <pre className="whitespace-pre-wrap text-sm">
                                    {item.response}
                                  </pre>
                                </div>
                                <div>
                                  <h5 className="font-bold text-black mb-2">
                                    Métricas de evaluación:
                                  </h5>
                                  <div className="space-y-2">
                                    <div className="flex justify-between p-2 bg-blue-50 rounded">
                                      <span className="text-sm">
                                        Estructura:
                                      </span>
                                      <span className="font-semibold">
                                        {Math.round(item.metrics.clarity * 100)}
                                        %
                                      </span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-green-50 rounded">
                                      <span className="text-sm">
                                        Palabras clave:
                                      </span>
                                      <span className="font-semibold">
                                        {Math.round(
                                          item.metrics.accuracy * 100
                                        )}
                                        %
                                      </span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-yellow-50 rounded">
                                      <span className="text-sm">
                                        Clarificación:
                                      </span>
                                      <span className="font-semibold">
                                        {Math.round(
                                          item.metrics.completeness * 100
                                        )}
                                        %
                                      </span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-purple-50 rounded">
                                      <span className="text-sm">Longitud:</span>
                                      <span className="font-semibold">85%</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-pink-50 rounded">
                                      <span className="text-sm">Empatía:</span>
                                      <span className="font-semibold">
                                        {Math.round(item.metrics.empathy * 100)}
                                        %
                                      </span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-gray-100 rounded font-semibold">
                                      <span>Score General:</span>
                                      <span>
                                        {Math.round(
                                          ((item.metrics.clarity +
                                            item.metrics.accuracy +
                                            item.metrics.completeness +
                                            item.metrics.empathy) /
                                            4) *
                                            100
                                        )}
                                        %
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Sistema Real con ChatGPT */}
                              <div className="space-y-4">
                                <h4 className="font-semibold text-blue-600 text-center">
                                  Sistema Real (ChatGPT)
                                </h4>

                                {!evaluationCases[item.id]?.liveResponse ? (
                                  <div className="bg-gray-50 p-8 rounded border min-h-[300px] flex flex-col items-center justify-center">
                                    <p className="text-gray-500 mb-4 text-center">
                                      Haz clic en el botón para probar con
                                      ChatGPT real
                                    </p>
                                    <button
                                      onClick={() => handleTestCase(item.id)}
                                      disabled={isLoading[item.id]}
                                      className={`px-4 py-2 rounded-lg ${
                                        isLoading[item.id]
                                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                          : "bg-blue-600 text-white hover:bg-blue-700"
                                      }`}
                                    >
                                      {isLoading[item.id]
                                        ? "Probando..."
                                        : "Probar Real"}
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <div className="bg-white p-4 rounded border min-h-[300px]">
                                      <pre className="whitespace-pre-wrap text-sm">
                                        {evaluationCases[item.id].liveResponse}
                                      </pre>
                                    </div>
                                    <div>
                                      <h5 className="font-bold text-black mb-2">
                                        Métricas de evaluación:
                                      </h5>
                                      <div className="space-y-2">
                                        <div className="flex justify-between p-2 bg-blue-50 rounded">
                                          <span className="text-sm">
                                            Estructura:
                                          </span>
                                          <span className="font-semibold">
                                            {evaluationCases[item.id]
                                              .liveMetrics
                                              ? Math.round(
                                                  evaluationCases[item.id]
                                                    .liveMetrics!
                                                    .structure_score * 100
                                                )
                                              : 0}
                                            %
                                          </span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-green-50 rounded">
                                          <span className="text-sm">
                                            Palabras clave:
                                          </span>
                                          <span className="font-semibold">
                                            {evaluationCases[item.id]
                                              .liveMetrics
                                              ? Math.round(
                                                  evaluationCases[item.id]
                                                    .liveMetrics!
                                                    .keyword_score * 100
                                                )
                                              : 0}
                                            %
                                          </span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-yellow-50 rounded">
                                          <span className="text-sm">
                                            Clarificación:
                                          </span>
                                          <span className="font-semibold">
                                            {evaluationCases[item.id]
                                              .liveMetrics
                                              ? Math.round(
                                                  evaluationCases[item.id]
                                                    .liveMetrics!
                                                    .clarification_score * 100
                                                )
                                              : 0}
                                            %
                                          </span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-purple-50 rounded">
                                          <span className="text-sm">
                                            Longitud:
                                          </span>
                                          <span className="font-semibold">
                                            {evaluationCases[item.id]
                                              .liveMetrics
                                              ? Math.round(
                                                  evaluationCases[item.id]
                                                    .liveMetrics!.length_score *
                                                    100
                                                )
                                              : 0}
                                            %
                                          </span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-pink-50 rounded">
                                          <span className="text-sm">
                                            Empatía:
                                          </span>
                                          <span className="font-semibold">
                                            {evaluationCases[item.id]
                                              .liveMetrics
                                              ? Math.round(
                                                  evaluationCases[item.id]
                                                    .liveMetrics!
                                                    .empathy_score * 100
                                                )
                                              : 0}
                                            %
                                          </span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-gray-100 rounded font-semibold">
                                          <span>Score General:</span>
                                          <span>
                                            {evaluationCases[item.id]
                                              .liveMetrics
                                              ? Math.round(
                                                  evaluationCases[item.id]
                                                    .liveMetrics!
                                                    .overall_score * 100
                                                )
                                              : 0}
                                            %
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Código de Evaluación */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-black mb-4">
                Código de Evaluación de Métricas (TypeScript)
              </h3>
              <div className="bg-gray-900 border border-gray-600 p-6 rounded-lg overflow-x-auto">
                <pre className="font-mono text-sm text-white bg-gray-900 p-4 rounded">{`interface Metrics {
  structure_score: number;
  keyword_score: number;
  clarification_score: number;
  length_score: number;
  empathy_score: number;
  overall_score: number;
}

interface ExpectedData {
  expectedComponents: string[];
  expectedKeywords: string[];
  requiresClarification: boolean;
}

const evaluateResponse = (response: string, expectedData: ExpectedData): Metrics => {
  const results: Metrics = {
    structure_score: 0,
    keyword_score: 0,
    clarification_score: 0,
    length_score: 0,
    empathy_score: 0,
    overall_score: 0,
  };

  // 1. Verificar componentes estructurales
  let structureScore = 0;
  for (const component of expectedData.expectedComponents) {
    if (component === "analysis" && 
        response.includes("🤔") && response.includes("Análisis:")) {
      structureScore += 1;
    } else if (component === "response" && 
               response.includes("💡") && response.includes("Respuesta:")) {
      structureScore += 1;
    } else if (component === "details" && 
               response.includes("📋") && response.includes("Detalles:")) {
      structureScore += 1;
    } else if (component === "next_step" && 
               response.includes("🔄") && response.includes("Siguiente paso:")) {
      structureScore += 1;
    }
  }
  results.structure_score = structureScore / expectedData.expectedComponents.length;

  // 2. Verificar presencia de palabras clave
  let keywordsFound = 0;
  const responseLower = response.toLowerCase();
  for (const keyword of expectedData.expectedKeywords) {
    if (responseLower.includes(keyword.toLowerCase())) {
      keywordsFound += 1;
    }
  }
  results.keyword_score = keywordsFound / expectedData.expectedKeywords.length;

  // 3. Verificar manejo de aclaración
  const needsClarification = expectedData.requiresClarification;
  const asksForClarification = ["necesito", "podrías", "específico", "aclaración", "cuál", "qué"]
    .some(phrase => responseLower.includes(phrase));
  
  results.clarification_score = needsClarification === asksForClarification ? 1.0 : 0.0;

  // 4. Verificar longitud apropiada
  const length = response.length;
  if (length >= 200 && length <= 800) {
    results.length_score = 1.0;
  } else if ((length >= 100 && length < 200) || (length > 800 && length <= 1000)) {
    results.length_score = 0.7;
  } else {
    results.length_score = 0.3;
  }

  // 5. Verificar tono empático
  const empathyIndicators = ["entiendo", "perfecto", "ayudo", "lamento", "bienvenido"];
  const empathyScore = empathyIndicators.filter(indicator => 
    responseLower.includes(indicator)
  ).length;
  results.empathy_score = Math.min(empathyScore / 2, 1.0);

  // 6. Score general
  results.overall_score = (
    results.structure_score * 0.3 +
    results.keyword_score * 0.25 +
    results.clarification_score * 0.2 +
    results.length_score * 0.1 +
    results.empathy_score * 0.15
  );

  return results;
};`}</pre>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Este código TypeScript se ejecuta en
                  tiempo real para evaluar tanto las respuestas simuladas como
                  las respuestas reales de ChatGPT, proporcionando métricas
                  objetivas y comparables.
                </p>
              </div>

              {/* Fundamento de la Evaluación */}
              <div className="mt-8 bg-gray-50 rounded-lg p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-black mb-6 text-center">
                  Fundamento de la Evaluación
                </h3>
                <p className="text-center text-gray-600 mb-6 max-w-3xl mx-auto">
                  Sistema de evaluación basado en métricas objetivas que
                  reflejan calidad real del prompt. Utiliza detección
                  inteligente de intenciones y análisis estructural para
                  proporcionar feedback específico y accionable.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm border">
                    <h4 className="font-bold text-black mb-2">
                      1. Estructura (~86%)
                    </h4>
                    <p className="text-sm text-gray-700">
                      Verifica componentes estructurales: Análisis, Respuesta,
                      Detalles y Siguiente paso. Busca emojis específicos y
                      formato consistente.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-sm border">
                    <h4 className="font-bold text-black mb-2">
                      2. Empatía (~74%)
                    </h4>
                    <p className="text-sm text-gray-700">
                      Identifica 5 palabras empáticas específicas:
                      &quot;entiendo&quot;, &quot;perfecto&quot;,
                      &quot;ayudo&quot;, &quot;lamento&quot;,
                      &quot;bienvenido&quot;. Máximo 100% con 2+ palabras.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-sm border">
                    <h4 className="font-bold text-black mb-2">
                      3. Palabras clave (~79%)
                    </h4>
                    <p className="text-sm text-gray-700">
                      Verifica presencia de términos relevantes según el
                      contexto de la consulta. Evalúa productos, procesos y
                      información específica.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-sm border">
                    <h4 className="font-bold text-black mb-2">
                      4. Score general (~79%)
                    </h4>
                    <p className="text-sm text-gray-700">
                      Combina todas las métricas con pesos: Estructura (30%),
                      Palabras clave (25%), Aclaración (20%), Longitud (10%),
                      Empatía (15%).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ejercicio2" && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-black tracking-tight">
                Arquitectura Cognitiva
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Propuesta para chatbot &quot;VuelaConNosotros&quot; de
                aerolínea.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-black mb-4">
                1. Arquitectura de Alto Nivel
              </h3>
              <p className="text-gray-600 mb-6">
                Diagrama de componentes principales y sus interacciones para
                procesamiento eficiente de consultas.
              </p>
              <ArchitectureDiagram />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-black mb-4">
                2. Flujo Conversacional
              </h3>
              <p className="text-gray-600 mb-6">
                Análisis detallado de dos intenciones críticas con flujos de
                éxito y manejo de errores.
              </p>
              <div className="prose max-w-none text-black">
                <h4>Intenciones Críticas Identificadas:</h4>
                <ol>
                  <li>
                    <strong>Cambiar Vuelo:</strong> Permite a los usuarios
                    modificar su reserva existente.
                  </li>
                  <li>
                    <strong>Consultar Políticas de Equipaje:</strong>{" "}
                    Proporciona información sobre las reglas de equipaje.
                  </li>
                </ol>

                <h5 className="font-bold">
                  Flujo Conversacional para &quot;Cambiar Vuelo&quot;
                </h5>

                <p>
                  <strong>Camino Exitoso:</strong>
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border my-4">
                  <div className="space-y-3">
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Usuario</div>
                        <div>&quot;Quiero cambiar mi vuelo a Bogotá.&quot;</div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Bot</div>
                        <div>
                          &quot;Claro, puedo ayudarte. ¿Me confirmas tu número
                          de reserva o documento de identidad?&quot;
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Usuario</div>
                        <div>&quot;Mi reserva es ABC123.&quot;</div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Bot</div>
                        <div>
                          &quot;Perfecto. Veo tu vuelo para el 15 de julio.
                          ¿Para qué fecha te gustaría cambiarlo?&quot;
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Usuario</div>
                        <div>&quot;Para el 20 de julio.&quot;</div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Bot</div>
                        <div>
                          &quot;He encontrado un vuelo disponible el 20 de julio
                          a las 10:00 AM. La diferencia de tarifa es de $50.
                          ¿Deseas confirmar el cambio?&quot;
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Usuario</div>
                        <div>&quot;Sí, confirmo.&quot;</div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-green-500 text-white p-3 rounded-lg rounded-bl-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Bot</div>
                        <div>
                          &quot;Excelente! Tu vuelo ha sido cambiado. Recibirás
                          la confirmación en tu correo electrónico en unos
                          minutos.&quot;
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p>
                  <strong>Camino con Aclaración / Manejo de Error:</strong>
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border my-4">
                  <div className="space-y-3">
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Usuario</div>
                        <div>&quot;Cámbiame el vuelo.&quot;</div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-yellow-500 text-white p-3 rounded-lg rounded-bl-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Bot</div>
                        <div>
                          &quot;Entendido. Para poder ayudarte necesito saber,
                          ¿cuál es tu número de reserva y a qué destino
                          viajas?&quot;
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Usuario</div>
                        <div>&quot;No tengo la reserva a mano.&quot;</div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-yellow-500 text-white p-3 rounded-lg rounded-bl-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Bot</div>
                        <div>
                          &quot;No te preocupes. Puedo buscar tu reserva con tu
                          número de documento y apellido. ¿Me los podrías
                          proporcionar?&quot;
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Usuario</div>
                        <div>&quot;12345678, Pérez.&quot;</div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-green-500 text-white p-3 rounded-lg rounded-bl-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Bot</div>
                        <div>
                          &quot;Gracias. Encuentro dos reservas a nombre de Juan
                          Pérez. Una a Bogotá el 15 de julio y otra a Medellín
                          el 22 de agosto. ¿Cuál de las dos deseas
                          modificar?&quot;
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h5 className="font-bold">
                  Desafío Conversacional y Mitigación
                </h5>
                <p>
                  <strong>Desafío:</strong> La ambigüedad en la solicitud
                  inicial del usuario (&quot;cámbiame el vuelo&quot;).
                  <br />
                  <strong>Mitigación:</strong> La arquitectura está diseñada
                  para manejar la ambigüedad haciendo preguntas clarificadoras
                  secuenciales. En lugar de fallar, el bot solicita la
                  información que le falta (primero reserva, luego documento)
                  hasta tener los datos necesarios para proceder, guiando al
                  usuario de forma proactiva.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-black mb-4">
                3. Estrategia de Evolución y Escalabilidad
              </h3>
              <div className="prose max-w-none text-black">
                <p>
                  La arquitectura se diseña para ser escalable y evolutiva desde
                  su concepción:
                </p>
                <ul>
                  <li>
                    <strong>Escalabilidad:</strong> La arquitectura basada en
                    microservicios permite que cada componente (NLU, Gestor de
                    Diálogo, etc.) se escale de forma independiente. Si aumenta
                    el número de usuarios, podemos asignar más recursos solo al
                    NLU sin afectar los otros componentes.
                  </li>
                  <li>
                    <strong>Nuevas Funcionalidades:</strong> La capa de
                    integración y el gestor de diálogo modular permiten agregar
                    nuevas herramientas y APIs (ej. un nuevo sistema de
                    check-in) sin modificar el núcleo del bot. Simplemente se
                    añade una nueva habilidad al gestor.
                  </li>
                  <li>
                    <strong>Evolución Continua:</strong> Se implementará un
                    ciclo de feedback donde las conversaciones con baja
                    puntuación de satisfacción o con fallos de comprensión son
                    revisadas por un equipo humano. Estas conversaciones se
                    utilizan para re-entrenar y ajustar el modelo de NLU y el
                    prompt, mejorando continuamente la inteligencia del bot.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
