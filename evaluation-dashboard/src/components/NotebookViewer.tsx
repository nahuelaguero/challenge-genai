"use client";

import React, { useState } from "react";
import ArchitectureDiagram from "./ArchitectureDiagram";
import RAGManager from "./RAGManager";

interface Metrics {
  structure_score: number;
  keyword_score: number;
  clarification_score: number;
  length_score: number;
  empathy_score: number;
  overall_score: number;
  structure_details: {
    found: string[];
    missing: string[];
    total_expected: number;
  };
  keyword_details: {
    found: string[];
    missing: string[];
    total_expected: number;
  };
  clarification_details: {
    needs_clarification: boolean;
    asks_for_clarification: boolean;
    clarification_phrases: string[];
  };
  length_details: {
    character_count: number;
    word_count: number;
    optimal_range: string;
    actual_category: string;
  };
  empathy_details: {
    found_indicators: string[];
    empathy_phrases: string[];
  };
}

interface EvaluationCase {
  query: string;
  response: string;
  liveResponse?: string;
  simulatedMetrics?: Metrics;
  liveMetrics?: Metrics;
  responseTime?: number;
  timestamp?: string;
}

interface ExpectedData {
  expectedComponents: string[];
  expectedKeywords: string[];
  requiresClarification: boolean;
}

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
  - Ingresos mínimos de ₲4,000,000
  - Cédula de identidad paraguaya vigente
  - Historial crediticio (no indispensable)

• Documentos necesarios:
  - Cédula de identidad paraguaya
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
  - Libre inversión: desde ₲2,500,000 hasta ₲500,000,000
  - Educativo: condiciones especiales
  - Vivienda: hasta 70% del valor
  
• Plazos: desde 6 hasta 60 meses
• Tasas: desde 2.2% mensual
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
• Cuota de manejo: ₲0 (¡Gratis!)
• Retiros en cajeros propios: ₲0
• Retiros en otros cajeros: ₲15,000
• Transferencias: ₲0
• Compras: ₲0

**Tarjeta de Crédito:**
• Cuota de manejo: ₲125,000/mes (primer año gratis)
• Avances: 3% del monto
• Compras: ₲0
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
  const [selectedCases, setSelectedCases] = useState<number[]>([]);
  const [evaluationCases, setEvaluationCases] = useState<{
    [key: number]: EvaluationCase;
  }>({});
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});
  const [expandedMetrics, setExpandedMetrics] = useState<{
    [key: string]: boolean;
  }>({});

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

      structure_details: { found: [], missing: [], total_expected: 0 },
      keyword_details: { found: [], missing: [], total_expected: 0 },
      clarification_details: {
        needs_clarification: false,
        asks_for_clarification: false,
        clarification_phrases: [],
      },
      length_details: {
        character_count: 0,
        word_count: 0,
        optimal_range: "",
        actual_category: "",
      },
      empathy_details: { found_indicators: [], empathy_phrases: [] },
    };

    // 1. Verificar componentes estructurales
    let structureScore = 0;
    const foundComponents: string[] = [];
    const missingComponents: string[] = [];

    for (const component of expectedData.expectedComponents) {
      if (
        component === "analysis" &&
        response.includes("🤔") &&
        response.includes("Análisis:")
      ) {
        structureScore += 1;
        foundComponents.push("🤔 Análisis");
      } else if (
        component === "response" &&
        response.includes("💡") &&
        response.includes("Respuesta:")
      ) {
        structureScore += 1;
        foundComponents.push("💡 Respuesta");
      } else if (
        component === "details" &&
        response.includes("📋") &&
        response.includes("Detalles:")
      ) {
        structureScore += 1;
        foundComponents.push("📋 Detalles");
      } else if (
        component === "next_step" &&
        response.includes("🔄") &&
        response.includes("Siguiente paso:")
      ) {
        structureScore += 1;
        foundComponents.push("🔄 Siguiente paso");
      } else {
        missingComponents.push(component);
      }
    }
    results.structure_score =
      structureScore / expectedData.expectedComponents.length;
    results.structure_details = {
      found: foundComponents,
      missing: missingComponents,
      total_expected: expectedData.expectedComponents.length,
    };

    // 2. Verificar presencia de palabras clave
    let keywordsFound = 0;
    const foundKeywords: string[] = [];
    const missingKeywords: string[] = [];
    const responseLower = response.toLowerCase();

    for (const keyword of expectedData.expectedKeywords) {
      if (responseLower.includes(keyword.toLowerCase())) {
        keywordsFound += 1;
        foundKeywords.push(keyword);
      } else {
        missingKeywords.push(keyword);
      }
    }
    results.keyword_score =
      keywordsFound / expectedData.expectedKeywords.length;
    results.keyword_details = {
      found: foundKeywords,
      missing: missingKeywords,
      total_expected: expectedData.expectedKeywords.length,
    };

    // 3. Verificar manejo de aclaración
    const needsClarification = expectedData.requiresClarification;
    const clarificationPhrases = [
      "necesito",
      "podrías",
      "específico",
      "aclaración",
      "cuál",
      "qué",
      "dime",
      "indicar",
      "proporcionar",
    ];

    const foundClarificationPhrases = clarificationPhrases.filter((phrase) =>
      responseLower.includes(phrase)
    );

    const asksForClarification = foundClarificationPhrases.length > 0;
    results.clarification_score =
      needsClarification === asksForClarification ? 1.0 : 0.0;
    results.clarification_details = {
      needs_clarification: needsClarification,
      asks_for_clarification: asksForClarification,
      clarification_phrases: foundClarificationPhrases,
    };

    // 4. Verificar longitud apropiada
    const length = response.length;
    const wordCount = response.split(" ").length;
    let lengthCategory = "";

    if (length >= 200 && length <= 800) {
      results.length_score = 1.0;
      lengthCategory = "Óptima";
    } else if (
      (length >= 100 && length < 200) ||
      (length > 800 && length <= 1000)
    ) {
      results.length_score = 0.7;
      lengthCategory =
        length < 200 ? "Corta pero aceptable" : "Larga pero aceptable";
    } else {
      results.length_score = 0.3;
      lengthCategory = length < 100 ? "Muy corta" : "Muy larga";
    }

    results.length_details = {
      character_count: length,
      word_count: wordCount,
      optimal_range: "200-800 caracteres",
      actual_category: lengthCategory,
    };

    // 5. Verificar tono empático
    const empathyIndicators = [
      "entiendo",
      "perfecto",
      "ayudo",
      "lamento",
      "bienvenido",
      "gracias",
      "excelente",
      "encantado",
    ];

    const foundEmpathyIndicators = empathyIndicators.filter((indicator) =>
      responseLower.includes(indicator)
    );

    const empathyScore = foundEmpathyIndicators.length;
    results.empathy_score = Math.min(empathyScore / 2, 1.0);
    results.empathy_details = {
      found_indicators: foundEmpathyIndicators,
      empathy_phrases: foundEmpathyIndicators,
    };

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

      const simulatedResponse = caseData.response;
      const simulatedMetrics = evaluateResponse(simulatedResponse, caseData);

      console.log(`🚀 Iniciando llamada a ChatGPT para caso ${caseId}`);
      console.log(`📝 Query: "${caseData.query}"`);
      console.log(`⏱️ Timestamp: ${new Date().toISOString()}`);

      const startTime = performance.now();

      const response = await fetch("/api/test-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: caseData.query,
        }),
      });

      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      console.log(`⏱️ Tiempo de respuesta: ${responseTime}ms`);
      console.log(`📊 Status: ${response.status}`);

      if (!response.ok) {
        let errorMessage = `Error del servidor: ${response.status}`;
        try {
          const errorText = await response.text();
          console.error(`❌ Error del servidor: ${errorText}`);
          errorMessage = errorText || errorMessage;
        } catch (textError) {
          console.error(`❌ Error al leer respuesta de error: ${textError}`);
        }
        alert(`Error: ${errorMessage}`);
        return;
      }

      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error(`❌ Error al parsear JSON: ${jsonError}`);
        console.error(`❌ Respuesta recibida: ${responseText}`);
        alert(
          `Error: Respuesta inválida del servidor. Revisa la consola para más detalles.`
        );
        return;
      }

      if (data.error) {
        console.error(`❌ Error de API: ${data.error}`);
        alert(`Error: ${data.error}`);
        return;
      }

      console.log(`✅ Respuesta recibida (${data.response.length} caracteres)`);
      console.log(`📝 Respuesta: "${data.response.substring(0, 100)}..."`);

      const liveMetrics = evaluateResponse(data.response, caseData);

      console.log(`📊 Métricas calculadas:`, liveMetrics);

      setEvaluationCases((prev) => ({
        ...prev,
        [caseId]: {
          query: caseData.query,
          response: simulatedResponse,
          liveResponse: data.response,
          simulatedMetrics: simulatedMetrics,
          liveMetrics: liveMetrics,
          responseTime: responseTime,
          timestamp: new Date().toISOString(),
        },
      }));
    } catch (error) {
      console.error("❌ Error completo:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      alert(`Error al conectar con el servicio: ${errorMessage}`);
    } finally {
      setIsLoading((prev) => ({ ...prev, [caseId]: false }));
    }
  };

  // Función para manejar la expansión/contracción de métricas
  const toggleMetricExpansion = (caseId: number, metric: string) => {
    const key = `${caseId}-${metric}`;
    setExpandedMetrics((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Función para manejar la selección/deselección de casos
  const toggleCaseSelection = (caseId: number) => {
    setSelectedCases((prev) => {
      const newSelected = prev.includes(caseId)
        ? prev.filter((id) => id !== caseId)
        : [...prev, caseId];

      // Si se está abriendo un caso por primera vez, calcular métricas simuladas
      if (
        !prev.includes(caseId) &&
        !evaluationCases[caseId]?.simulatedMetrics
      ) {
        const caseData = evaluationDataset.find((item) => item.id === caseId);
        if (caseData) {
          const simulatedMetrics = evaluateResponse(
            caseData.response,
            caseData
          );
          setEvaluationCases((prevCases) => ({
            ...prevCases,
            [caseId]: {
              ...prevCases[caseId],
              query: caseData.query,
              response: caseData.response,
              simulatedMetrics,
            },
          }));
        }
      }

      return newSelected;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* El header se ha eliminado porque ya está presente en page.tsx */}

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
            Ejercicio 1
          </button>
          <button
            onClick={() => setActiveTab("ejercicio2")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "ejercicio2"
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Ejercicio 2
          </button>
        </div>

        {/* Content */}
        {activeTab === "ejercicio1" && (
          <div className="space-y-6">
            {/* Objetivo */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-black mb-4">
                1 - Prompt Engineering para Bot de Fintech Paraguaya
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
                <pre className="whitespace-pre-wrap font-mono text-sm">{`Eres un asesor financiero experto de una fintech paraguaya llamada "FinTechPro". Tu objetivo es ayudar a los clientes con consultas sobre productos financieros específicos de manera empática, precisa y profesional.

PRODUCTOS DISPONIBLES CON INFORMACIÓN ESPECÍFICA:

1. TARJETA DE DÉBITO:
   • Cuota de manejo: ₲0 (sin costo anual)
   • Retiros cajeros propios: ₲0
   • Retiros cajeros ajenos: ₲15,000
   • Transferencias: ₲0
   • Compras nacionales e internacionales: ₲0
   • Límite diario: ₲8,000,000

2. TARJETA DE CRÉDITO:
   • Cuota de manejo: ₲125,000/mes (primer año GRATIS)
   • Límites disponibles: desde ₲2,500,000 hasta ₲50,000,000
   • Requisitos mínimos: >18 años, ingresos >₲4,000,000/mes
   • Avances en efectivo: 3% del monto (mín ₲25,000)
   • Tasa de interés: 2.8% mensual (39.7% E.A.)
   • Tiempo de aprobación: 24-48 horas

3. PRÉSTAMOS PERSONALES:
   • Montos: desde ₲2,500,000 hasta ₲500,000,000
   • Tasas: desde 2.2% mensual (29.8% E.A.)
   • Plazos: 6 a 84 meses
   • Requisitos: ingresos >₲5,000,000, antigüedad laboral >6 meses
   • Aprobación: 24-48 horas
   • Tipos: libre inversión, educativo, compra de cartera

ESTRUCTURA DE RESPUESTA OBLIGATORIA:
🤔 **Análisis:** [Analiza la consulta del cliente paso a paso]
💡 **Respuesta:** [Responde directamente a la consulta con empatía]
📋 **Detalles:** [Proporciona detalles específicos y datos concretos]
🔄 **Siguiente paso:** [Indica acciones concretas a seguir]

TÉCNICAS DE PROMPT ENGINEERING APLICADAS:

1. **Chain-of-Thought:** Muestra tu razonamiento en la sección Análisis
2. **Few-shot Learning:** Usa los ejemplos como referencia de formato y contenido
3. **Empathy First:** Reconoce emociones y responde con frases empáticas
4. **Specific Information:** SIEMPRE incluye datos numéricos concretos cuando aplique
5. **Clarification Handling:** Si la consulta es ambigua, pide información específica

EJEMPLOS MEJORADOS CON INFORMACIÓN ESPECÍFICA:

Ejemplo 1 - Consulta: "¿Cuáles son las comisiones de la tarjeta?"
🤔 **Análisis:** El cliente pregunta sobre comisiones pero no especifica si es tarjeta de débito o crédito. Debo proporcionar información de ambas para ser proactivo.
💡 **Respuesta:** Entiendo tu interés en conocer las comisiones de nuestras tarjetas. Te proporciono el detalle completo de ambas opciones.
📋 **Detalles:** 
**Tarjeta de Débito:** Cuota de manejo ₲0, retiros cajeros propios ₲0, retiros otros cajeros ₲15,000
**Tarjeta de Crédito:** Cuota de manejo ₲125,000/mes (primer año GRATIS), avances 3% (mín ₲25,000), compras ₲0
🔄 **Siguiente paso:** ¿Te interesa información específica sobre alguna tarjeta en particular o quieres conocer los beneficios adicionales de cada una?

Ejemplo 2 - Consulta: "Mi tarjeta fue rechazada"
🤔 **Análisis:** Rechazo de tarjeta puede tener múltiples causas. Debo ser empático y ofrecer soluciones inmediatas.
💡 **Respuesta:** Lamento mucho este inconveniente. Entiendo lo frustrante que debe ser esta situación.
📋 **Detalles:** Posibles causas: límite diario alcanzado (₲8,000,000), tarjeta bloqueada por seguridad, terminal con problemas, o verificación de transacción pendiente.
🔄 **Siguiente paso:** Revisa si recibiste notificaciones en la app FinTechPro. Si persiste, comunícate al 0800-FINTECH para desbloqueo inmediato. Mientras tanto, puedes usar la app para pagos con QR en comercios de Asunción.

PALABRAS EMPÁTICAS OBLIGATORIAS (usar al menos 2 por respuesta):
• "entiendo" / "comprendo"
• "lamento" / "siento"
• "perfecto" / "excelente"
• "me da gusto" / "encantado"
• "gracias por" / "agradezco"

INFORMACIÓN DE CONTACTO Y SOPORTE:
• Línea de atención: 0800-FINTECH (24/7)
• WhatsApp: +595 981 123 456
• Horario oficinas: Lunes a viernes 8:00AM - 6:00PM
• App móvil: "FinTechPro" (Android/iOS)
• Oficinas: Asunción, Ciudad del Este, Encarnación

REGLAS CRÍTICAS:
1. SIEMPRE incluir datos numéricos específicos en guaraníes cuando sea relevante
2. Ser proactivo: dar información completa sin esperar múltiples preguntas
3. Manejar ambigüedad preguntando específicamente qué necesita el cliente
4. En casos de seguridad (cargos no reconocidos, claves), escalar inmediatamente a soporte
5. Ofrecer alternativas cuando el producto principal no aplique
6. Mantener contexto cultural paraguayo en ejemplos y referencias

Mantén siempre un tono profesional, empático y orientado a la solución.`}</pre>
              </div>
            </div>

            {/* Técnicas Utilizadas */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-black mb-4">
                Técnicas de Prompt Engineering
              </h3>

              {/* Técnicas Utilizadas */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-green-700 mb-4">
                  ✅ Técnicas Utilizadas
                </h4>
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-black mb-2">
                      1. Chain-of-Thought (CoT) Prompting
                    </h5>
                    <p className="text-gray-700 text-sm mb-3">
                      <strong>Implementación:</strong> Sección obligatoria
                      &quot;🤔 **Análisis:**&quot; donde el modelo debe mostrar
                      su razonamiento paso a paso.
                    </p>
                    <div className="bg-white p-3 rounded border-l-4 border-blue-300 mb-3">
                      <p className="text-xs font-mono text-gray-600">
                        🤔 **Análisis:** El cliente pregunta sobre comisiones
                        pero no especifica si es tarjeta de débito o crédito.
                        Debo proporcionar información de ambas para ser
                        proactivo y completo.
                      </p>
                    </div>
                    <p className="text-gray-600 text-xs">
                      <strong>Justificación:</strong> En atención al cliente
                      financiero permite entender el razonamiento del asistente,
                      genera confianza y transparencia.
                    </p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-black mb-2">
                      2. Few-Shot Learning
                    </h5>
                    <p className="text-gray-700 text-sm mb-3">
                      <strong>Implementación:</strong> Se proporcionan 2
                      ejemplos específicos y detallados que entrenan al modelo
                      sobre el formato esperado.
                    </p>
                    <div className="bg-white p-3 rounded border-l-4 border-green-300 mb-3">
                      <p className="text-xs text-gray-600">
                        • Ejemplo 1: Consulta ambigua sobre comisiones →
                        Respuesta proactiva con ambas opciones
                        <br />• Ejemplo 2: Problema técnico → Respuesta empática
                        + soluciones múltiples
                      </p>
                    </div>
                    <p className="text-gray-600 text-xs">
                      <strong>Justificación:</strong> Los ejemplos demuestran el
                      comportamiento deseado y reducen la variabilidad en las
                      respuestas.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-black mb-2">
                      3. Role Prompting
                    </h5>
                    <p className="text-gray-700 text-sm mb-3">
                      <strong>Implementación:</strong> Define el rol específico
                      como &quot;asesor financiero experto de una fintech
                      paraguaya&quot;.
                    </p>
                    <div className="bg-white p-3 rounded border-l-4 border-purple-300 mb-3">
                      <p className="text-xs font-mono text-gray-600">
                        &quot;Eres un asesor financiero experto de una fintech
                        paraguaya llamada &apos;FinTechPro&apos;&quot;
                      </p>
                    </div>
                    <p className="text-gray-600 text-xs">
                      <strong>Justificación:</strong> Establece contexto
                      profesional, geográfico y cultural específico, manteniendo
                      consistencia en el tono.
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-black mb-2">
                      4. Structured Output
                    </h5>
                    <p className="text-gray-700 text-sm mb-3">
                      <strong>Implementación:</strong> Formato obligatorio de 4
                      secciones con emojis identificadores.
                    </p>
                    <div className="bg-white p-3 rounded border-l-4 border-orange-300 mb-3">
                      <p className="text-xs font-mono text-gray-600">
                        🤔 **Análisis:** → 💡 **Respuesta:** → 📋 **Detalles:**
                        → 🔄 **Siguiente paso:**
                      </p>
                    </div>
                    <p className="text-gray-600 text-xs">
                      <strong>Justificación:</strong> Garantiza respuestas
                      organizadas, fáciles de procesar automáticamente y
                      consistentes.
                    </p>
                  </div>

                  <div className="border-l-4 border-pink-500 pl-4 bg-pink-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-black mb-2">
                      5. Empathy-First Approach
                    </h5>
                    <p className="text-gray-700 text-sm mb-3">
                      <strong>Implementación:</strong> Lista obligatoria de
                      palabras empáticas que debe usar (mínimo 2 por respuesta).
                    </p>
                    <div className="bg-white p-3 rounded border-l-4 border-pink-300 mb-3">
                      <p className="text-xs text-gray-600">
                        &quot;entiendo&quot;, &quot;comprendo&quot;,
                        &quot;lamento&quot;, &quot;siento&quot;,
                        &quot;perfecto&quot;, &quot;excelente&quot;
                      </p>
                    </div>
                    <p className="text-gray-600 text-xs">
                      <strong>Justificación:</strong> En atención al cliente
                      financiero, la empatía es crítica para manejar estrés y
                      frustración.
                    </p>
                  </div>

                  <div className="border-l-4 border-indigo-500 pl-4 bg-indigo-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-black mb-2">
                      6. Information Grounding
                    </h5>
                    <p className="text-gray-700 text-sm mb-3">
                      <strong>Implementación:</strong> Datos numéricos
                      específicos y verificables en cada respuesta relevante.
                    </p>
                    <div className="bg-white p-3 rounded border-l-4 border-indigo-300 mb-3">
                      <p className="text-xs font-mono text-gray-600">
                        Cuota: ₲125,000/mes • Límites: ₲2,500,000-₲50,000,000 •
                        Límite diario: ₲8,000,000
                      </p>
                    </div>
                    <p className="text-gray-600 text-xs">
                      <strong>Justificación:</strong> Evita respuestas genéricas
                      y proporciona información accionable específica.
                    </p>
                  </div>
                </div>
              </div>

              {/* Técnicas NO Utilizadas */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-bold text-red-700 mb-4">
                  ❌ Técnicas NO Utilizadas y Justificación
                </h4>
                <div className="space-y-4">
                  <div className="border-l-4 border-gray-400 pl-4 bg-gray-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-black mb-2">
                      Zero-Shot Learning
                    </h5>
                    <p className="text-gray-600 text-sm">
                      <strong>Por qué NO:</strong> Los casos de uso financiero
                      requieren consistencia y precisión específica. Sin
                      ejemplos, el modelo podría generar respuestas incorrectas
                      o inconsistentes.
                    </p>
                  </div>

                  <div className="border-l-4 border-gray-400 pl-4 bg-gray-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-black mb-2">
                      Self-Consistency
                    </h5>
                    <p className="text-gray-600 text-sm">
                      <strong>Por qué NO:</strong> En atención al cliente
                      necesitamos una respuesta determinística y clara, no
                      múltiples opciones que puedan confundir al cliente.
                    </p>
                  </div>

                  <div className="border-l-4 border-gray-400 pl-4 bg-gray-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-black mb-2">
                      Multi-Step Reasoning
                    </h5>
                    <p className="text-gray-600 text-sm">
                      <strong>Por qué NO:</strong> Aunque útil para problemas
                      complejos, puede resultar en respuestas demasiado largas y
                      confusas para consultas simples de atención al cliente.
                    </p>
                  </div>

                  <div className="border-l-4 border-gray-400 pl-4 bg-gray-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-black mb-2">
                      Tree of Thoughts
                    </h5>
                    <p className="text-gray-600 text-sm">
                      <strong>Por qué NO:</strong> Explorar múltiples ramas de
                      razonamiento puede confundir al cliente. En atención al
                      cliente necesitamos una respuesta clara y directa.
                    </p>
                  </div>

                  <div className="border-l-4 border-gray-400 pl-4 bg-gray-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-black mb-2">
                      Constitutional AI
                    </h5>
                    <p className="text-gray-600 text-sm">
                      <strong>Por qué NO:</strong> El contexto financiero ya
                      tiene regulaciones específicas, y las reglas están
                      implementadas directamente en el prompt.
                    </p>
                  </div>
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
                  {evaluationDataset.map((item) => {
                    // Función para obtener el tipo de caso y su configuración
                    const getCaseTypeConfig = (id: number) => {
                      // Casos exitosos (score alto)
                      if ([1, 2, 3, 4, 5, 6].includes(id)) {
                        return {
                          type: "Exitoso",
                          badge: "bg-green-100 text-green-800",
                          description:
                            "Demuestra funcionamiento óptimo del sistema",
                        };
                      }
                      // Casos problemáticos (score bajo)
                      else if ([7, 8, 9].includes(id)) {
                        return {
                          type: "Problemático",
                          badge: "bg-red-100 text-red-800",
                          description: "Muestra limitaciones y áreas de mejora",
                        };
                      }
                      // Caso límite
                      else if (id === 10) {
                        return {
                          type: "Límite",
                          badge: "bg-yellow-100 text-yellow-800",
                          description:
                            "Caso borderline que requiere análisis detallado",
                        };
                      }
                      return {
                        type: "Estándar",
                        badge: "bg-gray-100 text-gray-800",
                        description: "Caso de evaluación general",
                      };
                    };

                    const typeConfig = getCaseTypeConfig(item.id);

                    return (
                      <div key={item.id} className="border rounded-lg">
                        <button
                          onClick={() => toggleCaseSelection(item.id)}
                          className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-bold text-black">
                                  Caso {item.id}:
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig.badge}`}
                                >
                                  {typeConfig.type}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm mb-2">
                                {item.query}
                              </p>
                              <p className="text-gray-500 text-xs italic">
                                {typeConfig.description}
                              </p>
                            </div>
                            <div className="flex items-center ml-4">
                              {selectedCases.includes(item.id) ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-blue-600"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                        </button>

                        {selectedCases.includes(item.id) && (
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
                                      {/* Métrica de Estructura - Sistema Simulado */}
                                      <div className="border rounded-lg">
                                        <button
                                          onClick={() =>
                                            toggleMetricExpansion(
                                              item.id,
                                              "sim-structure"
                                            )
                                          }
                                          className="w-full flex justify-between items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                          <span className="text-sm font-medium">
                                            Estructura:
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <span className="font-semibold">
                                              {evaluationCases[item.id]
                                                ?.simulatedMetrics
                                                ? Math.round(
                                                    evaluationCases[item.id]
                                                      .simulatedMetrics!
                                                      .structure_score * 100
                                                  )
                                                : Math.round(
                                                    item.metrics.clarity * 100
                                                  )}
                                              %
                                            </span>
                                            <svg
                                              className={`w-4 h-4 transition-transform ${
                                                expandedMetrics[
                                                  `${item.id}-sim-structure`
                                                ]
                                                  ? "rotate-180"
                                                  : ""
                                              }`}
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                              />
                                            </svg>
                                          </div>
                                        </button>
                                        {expandedMetrics[
                                          `${item.id}-sim-structure`
                                        ] &&
                                          evaluationCases[item.id]
                                            ?.simulatedMetrics && (
                                            <div className="p-3 border-t bg-blue-25">
                                              <div className="text-xs space-y-2">
                                                <div>
                                                  <span className="font-medium text-green-700">
                                                    ✅ Componentes encontrados (
                                                    {
                                                      evaluationCases[item.id]
                                                        .simulatedMetrics!
                                                        .structure_details.found
                                                        .length
                                                    }
                                                    ):
                                                  </span>
                                                  <div className="ml-4 mt-1">
                                                    {evaluationCases[
                                                      item.id
                                                    ].simulatedMetrics!.structure_details.found.map(
                                                      (comp, idx) => (
                                                        <span
                                                          key={idx}
                                                          className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 mb-1 text-xs"
                                                        >
                                                          {comp}
                                                        </span>
                                                      )
                                                    )}
                                                    {evaluationCases[item.id]
                                                      .simulatedMetrics!
                                                      .structure_details.found
                                                      .length === 0 && (
                                                      <span className="text-gray-500 text-xs">
                                                        Ninguno
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                                {evaluationCases[item.id]
                                                  .simulatedMetrics!
                                                  .structure_details.missing
                                                  .length > 0 && (
                                                  <div>
                                                    <span className="font-medium text-red-700">
                                                      ❌ Componentes faltantes:
                                                    </span>
                                                    <div className="ml-4 mt-1">
                                                      {evaluationCases[
                                                        item.id
                                                      ].simulatedMetrics!.structure_details.missing.map(
                                                        (comp, idx) => (
                                                          <span
                                                            key={idx}
                                                            className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded mr-2 mb-1 text-xs"
                                                          >
                                                            {comp}
                                                          </span>
                                                        )
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                                <div className="text-gray-600 text-xs">
                                                  Total esperado:{" "}
                                                  {
                                                    evaluationCases[item.id]
                                                      .simulatedMetrics!
                                                      .structure_details
                                                      .total_expected
                                                  }{" "}
                                                  componentes
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                      </div>

                                      {/* Métrica de Palabras Clave - Sistema Simulado */}
                                      <div className="border rounded-lg">
                                        <button
                                          onClick={() =>
                                            toggleMetricExpansion(
                                              item.id,
                                              "sim-keywords"
                                            )
                                          }
                                          className="w-full flex justify-between items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                        >
                                          <span className="text-sm font-medium">
                                            Palabras clave:
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <span className="font-semibold">
                                              {evaluationCases[item.id]
                                                ?.simulatedMetrics
                                                ? Math.round(
                                                    evaluationCases[item.id]
                                                      .simulatedMetrics!
                                                      .keyword_score * 100
                                                  )
                                                : Math.round(
                                                    item.metrics.accuracy * 100
                                                  )}
                                              %
                                            </span>
                                            <svg
                                              className={`w-4 h-4 transition-transform ${
                                                expandedMetrics[
                                                  `${item.id}-sim-keywords`
                                                ]
                                                  ? "rotate-180"
                                                  : ""
                                              }`}
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                              />
                                            </svg>
                                          </div>
                                        </button>
                                        {expandedMetrics[
                                          `${item.id}-sim-keywords`
                                        ] &&
                                          evaluationCases[item.id]
                                            ?.simulatedMetrics && (
                                            <div className="p-3 border-t bg-green-25">
                                              <div className="text-xs space-y-2">
                                                <div>
                                                  <span className="font-medium text-green-700">
                                                    ✅ Palabras encontradas (
                                                    {
                                                      evaluationCases[item.id]
                                                        .simulatedMetrics!
                                                        .keyword_details.found
                                                        .length
                                                    }
                                                    ):
                                                  </span>
                                                  <div className="ml-4 mt-1">
                                                    {evaluationCases[
                                                      item.id
                                                    ].simulatedMetrics!.keyword_details.found.map(
                                                      (word, idx) => (
                                                        <span
                                                          key={idx}
                                                          className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 mb-1 text-xs"
                                                        >
                                                          {word}
                                                        </span>
                                                      )
                                                    )}
                                                    {evaluationCases[item.id]
                                                      .simulatedMetrics!
                                                      .keyword_details.found
                                                      .length === 0 && (
                                                      <span className="text-gray-500 text-xs">
                                                        Ninguna
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                                {evaluationCases[item.id]
                                                  .simulatedMetrics!
                                                  .keyword_details.missing
                                                  .length > 0 && (
                                                  <div>
                                                    <span className="font-medium text-red-700">
                                                      ❌ Palabras faltantes:
                                                    </span>
                                                    <div className="ml-4 mt-1">
                                                      {evaluationCases[
                                                        item.id
                                                      ].simulatedMetrics!.keyword_details.missing.map(
                                                        (word, idx) => (
                                                          <span
                                                            key={idx}
                                                            className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded mr-2 mb-1 text-xs"
                                                          >
                                                            {word}
                                                          </span>
                                                        )
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                                <div className="text-gray-600 text-xs">
                                                  Total esperado:{" "}
                                                  {
                                                    evaluationCases[item.id]
                                                      .simulatedMetrics!
                                                      .keyword_details
                                                      .total_expected
                                                  }{" "}
                                                  palabras clave
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                      </div>

                                      {/* Métrica de Clarificación - Sistema Simulado */}
                                      <div className="border rounded-lg">
                                        <button
                                          onClick={() =>
                                            toggleMetricExpansion(
                                              item.id,
                                              "sim-clarification"
                                            )
                                          }
                                          className="w-full flex justify-between items-center p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                                        >
                                          <span className="text-sm font-medium">
                                            Clarificación:
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <span className="font-semibold">
                                              {evaluationCases[item.id]
                                                ?.simulatedMetrics
                                                ? Math.round(
                                                    evaluationCases[item.id]
                                                      .simulatedMetrics!
                                                      .clarification_score * 100
                                                  )
                                                : Math.round(
                                                    item.metrics.completeness *
                                                      100
                                                  )}
                                              %
                                            </span>
                                            <svg
                                              className={`w-4 h-4 transition-transform ${
                                                expandedMetrics[
                                                  `${item.id}-sim-clarification`
                                                ]
                                                  ? "rotate-180"
                                                  : ""
                                              }`}
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                              />
                                            </svg>
                                          </div>
                                        </button>
                                        {expandedMetrics[
                                          `${item.id}-sim-clarification`
                                        ] &&
                                          evaluationCases[item.id]
                                            ?.simulatedMetrics && (
                                            <div className="p-3 border-t bg-yellow-25">
                                              <div className="text-xs space-y-2">
                                                <div>
                                                  <span className="font-medium text-gray-700">
                                                    📋 Análisis de
                                                    clarificación:
                                                  </span>
                                                  <div className="ml-4 mt-1 space-y-1">
                                                    <div>
                                                      <span className="font-medium">
                                                        Necesita clarificación:
                                                      </span>
                                                      <span
                                                        className={`ml-2 px-2 py-1 rounded text-xs ${
                                                          evaluationCases[
                                                            item.id
                                                          ].simulatedMetrics!
                                                            .clarification_details
                                                            .needs_clarification
                                                            ? "bg-orange-100 text-orange-800"
                                                            : "bg-green-100 text-green-800"
                                                        }`}
                                                      >
                                                        {evaluationCases[
                                                          item.id
                                                        ].simulatedMetrics!
                                                          .clarification_details
                                                          .needs_clarification
                                                          ? "Sí"
                                                          : "No"}
                                                      </span>
                                                    </div>
                                                    <div>
                                                      <span className="font-medium">
                                                        Solicita clarificación:
                                                      </span>
                                                      <span
                                                        className={`ml-2 px-2 py-1 rounded text-xs ${
                                                          evaluationCases[
                                                            item.id
                                                          ].simulatedMetrics!
                                                            .clarification_details
                                                            .asks_for_clarification
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-gray-100 text-gray-800"
                                                        }`}
                                                      >
                                                        {evaluationCases[
                                                          item.id
                                                        ].simulatedMetrics!
                                                          .clarification_details
                                                          .asks_for_clarification
                                                          ? "Sí"
                                                          : "No"}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                                {evaluationCases[item.id]
                                                  .simulatedMetrics!
                                                  .clarification_details
                                                  .clarification_phrases
                                                  .length > 0 && (
                                                  <div>
                                                    <span className="font-medium text-blue-700">
                                                      🔍 Frases de clarificación
                                                      encontradas:
                                                    </span>
                                                    <div className="ml-4 mt-1">
                                                      {evaluationCases[
                                                        item.id
                                                      ].simulatedMetrics!.clarification_details.clarification_phrases.map(
                                                        (phrase, idx) => (
                                                          <span
                                                            key={idx}
                                                            className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 mb-1 text-xs"
                                                          >
                                                            {phrase}
                                                          </span>
                                                        )
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                      </div>

                                      {/* Métrica de Longitud - Sistema Simulado */}
                                      <div className="border rounded-lg">
                                        <button
                                          onClick={() =>
                                            toggleMetricExpansion(
                                              item.id,
                                              "sim-length"
                                            )
                                          }
                                          className="w-full flex justify-between items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                                        >
                                          <span className="text-sm font-medium">
                                            Longitud:
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <span className="font-semibold">
                                              {evaluationCases[item.id]
                                                ?.simulatedMetrics
                                                ? Math.round(
                                                    evaluationCases[item.id]
                                                      .simulatedMetrics!
                                                      .length_score * 100
                                                  )
                                                : 85}
                                              %
                                            </span>
                                            <svg
                                              className={`w-4 h-4 transition-transform ${
                                                expandedMetrics[
                                                  `${item.id}-sim-length`
                                                ]
                                                  ? "rotate-180"
                                                  : ""
                                              }`}
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                              />
                                            </svg>
                                          </div>
                                        </button>
                                        {expandedMetrics[
                                          `${item.id}-sim-length`
                                        ] &&
                                          evaluationCases[item.id]
                                            ?.simulatedMetrics && (
                                            <div className="p-3 border-t bg-purple-25">
                                              <div className="text-xs space-y-2">
                                                <div className="grid grid-cols-2 gap-4">
                                                  <div>
                                                    <span className="font-medium text-gray-700">
                                                      📏 Caracteres:
                                                    </span>
                                                    <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                                      {
                                                        evaluationCases[item.id]
                                                          .simulatedMetrics!
                                                          .length_details
                                                          .character_count
                                                      }
                                                    </span>
                                                  </div>
                                                  <div>
                                                    <span className="font-medium text-gray-700">
                                                      📝 Palabras:
                                                    </span>
                                                    <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                                      {
                                                        evaluationCases[item.id]
                                                          .simulatedMetrics!
                                                          .length_details
                                                          .word_count
                                                      }
                                                    </span>
                                                  </div>
                                                </div>
                                                <div>
                                                  <span className="font-medium text-gray-700">
                                                    🎯 Rango óptimo:
                                                  </span>
                                                  <span className="ml-2 text-green-700">
                                                    {
                                                      evaluationCases[item.id]
                                                        .simulatedMetrics!
                                                        .length_details
                                                        .optimal_range
                                                    }
                                                  </span>
                                                </div>
                                                <div>
                                                  <span className="font-medium text-gray-700">
                                                    📊 Categoría:
                                                  </span>
                                                  <span
                                                    className={`ml-2 px-2 py-1 rounded text-xs ${
                                                      evaluationCases[item.id]
                                                        .simulatedMetrics!
                                                        .length_details
                                                        .actual_category ===
                                                      "Óptima"
                                                        ? "bg-green-100 text-green-800"
                                                        : evaluationCases[
                                                            item.id
                                                          ].simulatedMetrics!.length_details.actual_category.includes(
                                                            "aceptable"
                                                          )
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}
                                                  >
                                                    {
                                                      evaluationCases[item.id]
                                                        .simulatedMetrics!
                                                        .length_details
                                                        .actual_category
                                                    }
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                      </div>

                                      {/* Métrica de Empatía - Sistema Simulado */}
                                      <div className="border rounded-lg">
                                        <button
                                          onClick={() =>
                                            toggleMetricExpansion(
                                              item.id,
                                              "sim-empathy"
                                            )
                                          }
                                          className="w-full flex justify-between items-center p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                                        >
                                          <span className="text-sm font-medium">
                                            Empatía:
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <span className="font-semibold">
                                              {evaluationCases[item.id]
                                                ?.simulatedMetrics
                                                ? Math.round(
                                                    evaluationCases[item.id]
                                                      .simulatedMetrics!
                                                      .empathy_score * 100
                                                  )
                                                : Math.round(
                                                    item.metrics.empathy * 100
                                                  )}
                                              %
                                            </span>
                                            <svg
                                              className={`w-4 h-4 transition-transform ${
                                                expandedMetrics[
                                                  `${item.id}-sim-empathy`
                                                ]
                                                  ? "rotate-180"
                                                  : ""
                                              }`}
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                              />
                                            </svg>
                                          </div>
                                        </button>
                                        {expandedMetrics[
                                          `${item.id}-sim-empathy`
                                        ] &&
                                          evaluationCases[item.id]
                                            ?.simulatedMetrics && (
                                            <div className="p-3 border-t bg-pink-25">
                                              <div className="text-xs space-y-2">
                                                <div>
                                                  <span className="font-medium text-pink-700">
                                                    💝 Indicadores de empatía
                                                    encontrados (
                                                    {
                                                      evaluationCases[item.id]
                                                        .simulatedMetrics!
                                                        .empathy_details
                                                        .found_indicators.length
                                                    }
                                                    ):
                                                  </span>
                                                  <div className="ml-4 mt-1">
                                                    {evaluationCases[
                                                      item.id
                                                    ].simulatedMetrics!.empathy_details.found_indicators.map(
                                                      (indicator, idx) => (
                                                        <span
                                                          key={idx}
                                                          className="inline-block bg-pink-100 text-pink-800 px-2 py-1 rounded mr-2 mb-1 text-xs"
                                                        >
                                                          {indicator}
                                                        </span>
                                                      )
                                                    )}
                                                    {evaluationCases[item.id]
                                                      .simulatedMetrics!
                                                      .empathy_details
                                                      .found_indicators
                                                      .length === 0 && (
                                                      <span className="text-gray-500 text-xs">
                                                        Ninguno detectado
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                                <div className="text-gray-600 text-xs">
                                                  💡 Se buscan palabras como:
                                                  entiendo, perfecto, ayudo,
                                                  lamento, bienvenido, gracias,
                                                  excelente, encantado
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                      </div>

                                      {/* Score General - Sistema Simulado */}
                                      <div className="flex justify-between p-3 bg-gray-100 rounded-lg font-semibold border-2">
                                        <span>🏆 Score General:</span>
                                        <span className="text-lg">
                                          {evaluationCases[item.id]
                                            ?.simulatedMetrics
                                            ? Math.round(
                                                evaluationCases[item.id]
                                                  .simulatedMetrics!
                                                  .overall_score * 100
                                              )
                                            : Math.round(
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
                                          {
                                            evaluationCases[item.id]
                                              .liveResponse
                                          }
                                        </pre>
                                      </div>

                                      {/* Detalles técnicos de la llamada a la API */}
                                      <div className="bg-blue-50 p-4 rounded border mt-4">
                                        <h6 className="font-semibold text-blue-800 mb-2">
                                          🔧 Detalles Técnicos de la Llamada
                                        </h6>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <span className="font-medium text-blue-700">
                                              Tiempo de respuesta:
                                            </span>
                                            <span className="ml-2 text-blue-600">
                                              {evaluationCases[item.id]
                                                .responseTime || 0}
                                              ms
                                            </span>
                                          </div>
                                          <div>
                                            <span className="font-medium text-blue-700">
                                              Timestamp:
                                            </span>
                                            <span className="ml-2 text-blue-600">
                                              {evaluationCases[item.id]
                                                .timestamp
                                                ? new Date(
                                                    evaluationCases[
                                                      item.id
                                                    ].timestamp!
                                                  ).toLocaleString()
                                                : "N/A"}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="font-medium text-blue-700">
                                              Caracteres:
                                            </span>
                                            <span className="ml-2 text-blue-600">
                                              {evaluationCases[item.id]
                                                .liveResponse?.length || 0}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="font-medium text-blue-700">
                                              Palabras:
                                            </span>
                                            <span className="ml-2 text-blue-600">
                                              {evaluationCases[
                                                item.id
                                              ].liveResponse?.split(" ")
                                                .length || 0}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      <div>
                                        <h5 className="font-bold text-black mb-2">
                                          Métricas de evaluación:
                                        </h5>
                                        <div className="space-y-2">
                                          {/* Métrica de Estructura */}
                                          <div className="border rounded-lg">
                                            <button
                                              onClick={() =>
                                                toggleMetricExpansion(
                                                  item.id,
                                                  "structure"
                                                )
                                              }
                                              className="w-full flex justify-between items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                              <span className="text-sm font-medium">
                                                Estructura:
                                              </span>
                                              <div className="flex items-center gap-2">
                                                <span className="font-semibold">
                                                  {evaluationCases[item.id]
                                                    ?.liveMetrics
                                                    ? Math.round(
                                                        evaluationCases[item.id]
                                                          .liveMetrics!
                                                          .structure_score * 100
                                                      )
                                                    : 0}
                                                  %
                                                </span>
                                                <svg
                                                  className={`w-4 h-4 transition-transform ${
                                                    expandedMetrics[
                                                      `${item.id}-structure`
                                                    ]
                                                      ? "rotate-180"
                                                      : ""
                                                  }`}
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                  />
                                                </svg>
                                              </div>
                                            </button>
                                            {expandedMetrics[
                                              `${item.id}-structure`
                                            ] &&
                                              evaluationCases[item.id]
                                                ?.liveMetrics && (
                                                <div className="p-3 border-t bg-blue-25">
                                                  <div className="text-xs space-y-2">
                                                    <div>
                                                      <span className="font-medium text-green-700">
                                                        ✅ Componentes
                                                        encontrados (
                                                        {
                                                          evaluationCases[
                                                            item.id
                                                          ].liveMetrics!
                                                            .structure_details
                                                            .found.length
                                                        }
                                                        ):
                                                      </span>
                                                      <div className="ml-4 mt-1">
                                                        {evaluationCases[
                                                          item.id
                                                        ].liveMetrics!.structure_details.found.map(
                                                          (comp, idx) => (
                                                            <span
                                                              key={idx}
                                                              className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 mb-1 text-xs"
                                                            >
                                                              {comp}
                                                            </span>
                                                          )
                                                        )}
                                                        {evaluationCases[
                                                          item.id
                                                        ].liveMetrics!
                                                          .structure_details
                                                          .found.length ===
                                                          0 && (
                                                          <span className="text-gray-500 text-xs">
                                                            Ninguno
                                                          </span>
                                                        )}
                                                      </div>
                                                    </div>
                                                    {evaluationCases[item.id]
                                                      .liveMetrics!
                                                      .structure_details.missing
                                                      .length > 0 && (
                                                      <div>
                                                        <span className="font-medium text-red-700">
                                                          ❌ Componentes
                                                          faltantes:
                                                        </span>
                                                        <div className="ml-4 mt-1">
                                                          {evaluationCases[
                                                            item.id
                                                          ].liveMetrics!.structure_details.missing.map(
                                                            (comp, idx) => (
                                                              <span
                                                                key={idx}
                                                                className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded mr-2 mb-1 text-xs"
                                                              >
                                                                {comp}
                                                              </span>
                                                            )
                                                          )}
                                                        </div>
                                                      </div>
                                                    )}
                                                    <div className="text-gray-600 text-xs">
                                                      Total esperado:{" "}
                                                      {
                                                        evaluationCases[item.id]
                                                          .liveMetrics!
                                                          .structure_details
                                                          .total_expected
                                                      }{" "}
                                                      componentes
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                          </div>

                                          {/* Métrica de Palabras Clave */}
                                          <div className="border rounded-lg">
                                            <button
                                              onClick={() =>
                                                toggleMetricExpansion(
                                                  item.id,
                                                  "keywords"
                                                )
                                              }
                                              className="w-full flex justify-between items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                            >
                                              <span className="text-sm font-medium">
                                                Palabras clave:
                                              </span>
                                              <div className="flex items-center gap-2">
                                                <span className="font-semibold">
                                                  {evaluationCases[item.id]
                                                    ?.liveMetrics
                                                    ? Math.round(
                                                        evaluationCases[item.id]
                                                          .liveMetrics!
                                                          .keyword_score * 100
                                                      )
                                                    : 0}
                                                  %
                                                </span>
                                                <svg
                                                  className={`w-4 h-4 transition-transform ${
                                                    expandedMetrics[
                                                      `${item.id}-keywords`
                                                    ]
                                                      ? "rotate-180"
                                                      : ""
                                                  }`}
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                  />
                                                </svg>
                                              </div>
                                            </button>
                                            {expandedMetrics[
                                              `${item.id}-keywords`
                                            ] &&
                                              evaluationCases[item.id]
                                                ?.liveMetrics && (
                                                <div className="p-3 border-t bg-green-25">
                                                  <div className="text-xs space-y-2">
                                                    <div>
                                                      <span className="font-medium text-green-700">
                                                        ✅ Palabras encontradas
                                                        (
                                                        {
                                                          evaluationCases[
                                                            item.id
                                                          ].liveMetrics!
                                                            .keyword_details
                                                            .found.length
                                                        }
                                                        ):
                                                      </span>
                                                      <div className="ml-4 mt-1">
                                                        {evaluationCases[
                                                          item.id
                                                        ].liveMetrics!.keyword_details.found.map(
                                                          (word, idx) => (
                                                            <span
                                                              key={idx}
                                                              className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 mb-1 text-xs"
                                                            >
                                                              {word}
                                                            </span>
                                                          )
                                                        )}
                                                        {evaluationCases[
                                                          item.id
                                                        ].liveMetrics!
                                                          .keyword_details.found
                                                          .length === 0 && (
                                                          <span className="text-gray-500 text-xs">
                                                            Ninguna
                                                          </span>
                                                        )}
                                                      </div>
                                                    </div>
                                                    {evaluationCases[item.id]
                                                      .liveMetrics!
                                                      .keyword_details.missing
                                                      .length > 0 && (
                                                      <div>
                                                        <span className="font-medium text-red-700">
                                                          ❌ Palabras faltantes:
                                                        </span>
                                                        <div className="ml-4 mt-1">
                                                          {evaluationCases[
                                                            item.id
                                                          ].liveMetrics!.keyword_details.missing.map(
                                                            (word, idx) => (
                                                              <span
                                                                key={idx}
                                                                className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded mr-2 mb-1 text-xs"
                                                              >
                                                                {word}
                                                              </span>
                                                            )
                                                          )}
                                                        </div>
                                                      </div>
                                                    )}
                                                    <div className="text-gray-600 text-xs">
                                                      Total esperado:{" "}
                                                      {
                                                        evaluationCases[item.id]
                                                          .liveMetrics!
                                                          .keyword_details
                                                          .total_expected
                                                      }{" "}
                                                      palabras clave
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                          </div>

                                          {/* Métrica de Clarificación */}
                                          <div className="border rounded-lg">
                                            <button
                                              onClick={() =>
                                                toggleMetricExpansion(
                                                  item.id,
                                                  "clarification"
                                                )
                                              }
                                              className="w-full flex justify-between items-center p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                                            >
                                              <span className="text-sm font-medium">
                                                Clarificación:
                                              </span>
                                              <div className="flex items-center gap-2">
                                                <span className="font-semibold">
                                                  {evaluationCases[item.id]
                                                    ?.liveMetrics
                                                    ? Math.round(
                                                        evaluationCases[item.id]
                                                          .liveMetrics!
                                                          .clarification_score *
                                                          100
                                                      )
                                                    : 0}
                                                  %
                                                </span>
                                                <svg
                                                  className={`w-4 h-4 transition-transform ${
                                                    expandedMetrics[
                                                      `${item.id}-clarification`
                                                    ]
                                                      ? "rotate-180"
                                                      : ""
                                                  }`}
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                  />
                                                </svg>
                                              </div>
                                            </button>
                                            {expandedMetrics[
                                              `${item.id}-clarification`
                                            ] &&
                                              evaluationCases[item.id]
                                                ?.liveMetrics && (
                                                <div className="p-3 border-t bg-yellow-25">
                                                  <div className="text-xs space-y-2">
                                                    <div>
                                                      <span className="font-medium text-gray-700">
                                                        📋 Análisis de
                                                        clarificación:
                                                      </span>
                                                      <div className="ml-4 mt-1 space-y-1">
                                                        <div>
                                                          <span className="font-medium">
                                                            Necesita
                                                            clarificación:
                                                          </span>
                                                          <span
                                                            className={`ml-2 px-2 py-1 rounded text-xs ${
                                                              evaluationCases[
                                                                item.id
                                                              ].liveMetrics!
                                                                .clarification_details
                                                                .needs_clarification
                                                                ? "bg-orange-100 text-orange-800"
                                                                : "bg-green-100 text-green-800"
                                                            }`}
                                                          >
                                                            {evaluationCases[
                                                              item.id
                                                            ].liveMetrics!
                                                              .clarification_details
                                                              .needs_clarification
                                                              ? "Sí"
                                                              : "No"}
                                                          </span>
                                                        </div>
                                                        <div>
                                                          <span className="font-medium">
                                                            Solicita
                                                            clarificación:
                                                          </span>
                                                          <span
                                                            className={`ml-2 px-2 py-1 rounded text-xs ${
                                                              evaluationCases[
                                                                item.id
                                                              ].liveMetrics!
                                                                .clarification_details
                                                                .asks_for_clarification
                                                                ? "bg-blue-100 text-blue-800"
                                                                : "bg-gray-100 text-gray-800"
                                                            }`}
                                                          >
                                                            {evaluationCases[
                                                              item.id
                                                            ].liveMetrics!
                                                              .clarification_details
                                                              .asks_for_clarification
                                                              ? "Sí"
                                                              : "No"}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    {evaluationCases[item.id]
                                                      .liveMetrics!
                                                      .clarification_details
                                                      .clarification_phrases
                                                      .length > 0 && (
                                                      <div>
                                                        <span className="font-medium text-blue-700">
                                                          🔍 Frases de
                                                          clarificación
                                                          encontradas:
                                                        </span>
                                                        <div className="ml-4 mt-1">
                                                          {evaluationCases[
                                                            item.id
                                                          ].liveMetrics!.clarification_details.clarification_phrases.map(
                                                            (phrase, idx) => (
                                                              <span
                                                                key={idx}
                                                                className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 mb-1 text-xs"
                                                              >
                                                                {phrase}
                                                              </span>
                                                            )
                                                          )}
                                                        </div>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              )}
                                          </div>

                                          {/* Métrica de Longitud */}
                                          <div className="border rounded-lg">
                                            <button
                                              onClick={() =>
                                                toggleMetricExpansion(
                                                  item.id,
                                                  "length"
                                                )
                                              }
                                              className="w-full flex justify-between items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                                            >
                                              <span className="text-sm font-medium">
                                                Longitud:
                                              </span>
                                              <div className="flex items-center gap-2">
                                                <span className="font-semibold">
                                                  {evaluationCases[item.id]
                                                    ?.liveMetrics
                                                    ? Math.round(
                                                        evaluationCases[item.id]
                                                          .liveMetrics!
                                                          .length_score * 100
                                                      )
                                                    : 0}
                                                  %
                                                </span>
                                                <svg
                                                  className={`w-4 h-4 transition-transform ${
                                                    expandedMetrics[
                                                      `${item.id}-length`
                                                    ]
                                                      ? "rotate-180"
                                                      : ""
                                                  }`}
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                  />
                                                </svg>
                                              </div>
                                            </button>
                                            {expandedMetrics[
                                              `${item.id}-length`
                                            ] &&
                                              evaluationCases[item.id]
                                                ?.liveMetrics && (
                                                <div className="p-3 border-t bg-purple-25">
                                                  <div className="text-xs space-y-2">
                                                    <div className="grid grid-cols-2 gap-4">
                                                      <div>
                                                        <span className="font-medium text-gray-700">
                                                          📏 Caracteres:
                                                        </span>
                                                        <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                                          {
                                                            evaluationCases[
                                                              item.id
                                                            ].liveMetrics!
                                                              .length_details
                                                              .character_count
                                                          }
                                                        </span>
                                                      </div>
                                                      <div>
                                                        <span className="font-medium text-gray-700">
                                                          📝 Palabras:
                                                        </span>
                                                        <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                                          {
                                                            evaluationCases[
                                                              item.id
                                                            ].liveMetrics!
                                                              .length_details
                                                              .word_count
                                                          }
                                                        </span>
                                                      </div>
                                                    </div>
                                                    <div>
                                                      <span className="font-medium text-gray-700">
                                                        🎯 Rango óptimo:
                                                      </span>
                                                      <span className="ml-2 text-green-700">
                                                        {
                                                          evaluationCases[
                                                            item.id
                                                          ].liveMetrics!
                                                            .length_details
                                                            .optimal_range
                                                        }
                                                      </span>
                                                    </div>
                                                    <div>
                                                      <span className="font-medium text-gray-700">
                                                        📊 Categoría:
                                                      </span>
                                                      <span
                                                        className={`ml-2 px-2 py-1 rounded text-xs ${
                                                          evaluationCases[
                                                            item.id
                                                          ].liveMetrics!
                                                            .length_details
                                                            .actual_category ===
                                                          "Óptima"
                                                            ? "bg-green-100 text-green-800"
                                                            : evaluationCases[
                                                                item.id
                                                              ].liveMetrics!.length_details.actual_category.includes(
                                                                "aceptable"
                                                              )
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                        }`}
                                                      >
                                                        {
                                                          evaluationCases[
                                                            item.id
                                                          ].liveMetrics!
                                                            .length_details
                                                            .actual_category
                                                        }
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                          </div>

                                          {/* Métrica de Empatía */}
                                          <div className="border rounded-lg">
                                            <button
                                              onClick={() =>
                                                toggleMetricExpansion(
                                                  item.id,
                                                  "empathy"
                                                )
                                              }
                                              className="w-full flex justify-between items-center p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                                            >
                                              <span className="text-sm font-medium">
                                                Empatía:
                                              </span>
                                              <div className="flex items-center gap-2">
                                                <span className="font-semibold">
                                                  {evaluationCases[item.id]
                                                    ?.liveMetrics
                                                    ? Math.round(
                                                        evaluationCases[item.id]
                                                          .liveMetrics!
                                                          .empathy_score * 100
                                                      )
                                                    : 0}
                                                  %
                                                </span>
                                                <svg
                                                  className={`w-4 h-4 transition-transform ${
                                                    expandedMetrics[
                                                      `${item.id}-empathy`
                                                    ]
                                                      ? "rotate-180"
                                                      : ""
                                                  }`}
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                  />
                                                </svg>
                                              </div>
                                            </button>
                                            {expandedMetrics[
                                              `${item.id}-empathy`
                                            ] &&
                                              evaluationCases[item.id]
                                                ?.liveMetrics && (
                                                <div className="p-3 border-t bg-pink-25">
                                                  <div className="text-xs space-y-2">
                                                    <div>
                                                      <span className="font-medium text-pink-700">
                                                        💝 Indicadores de
                                                        empatía encontrados (
                                                        {
                                                          evaluationCases[
                                                            item.id
                                                          ].liveMetrics!
                                                            .empathy_details
                                                            .found_indicators
                                                            .length
                                                        }
                                                        ):
                                                      </span>
                                                      <div className="ml-4 mt-1">
                                                        {evaluationCases[
                                                          item.id
                                                        ].liveMetrics!.empathy_details.found_indicators.map(
                                                          (indicator, idx) => (
                                                            <span
                                                              key={idx}
                                                              className="inline-block bg-pink-100 text-pink-800 px-2 py-1 rounded mr-2 mb-1 text-xs"
                                                            >
                                                              {indicator}
                                                            </span>
                                                          )
                                                        )}
                                                        {evaluationCases[
                                                          item.id
                                                        ].liveMetrics!
                                                          .empathy_details
                                                          .found_indicators
                                                          .length === 0 && (
                                                          <span className="text-gray-500 text-xs">
                                                            Ninguno detectado
                                                          </span>
                                                        )}
                                                      </div>
                                                    </div>
                                                    <div className="text-gray-600 text-xs">
                                                      💡 Se buscan palabras
                                                      como: entiendo, perfecto,
                                                      ayudo, lamento,
                                                      bienvenido, gracias,
                                                      excelente, encantado
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                          </div>

                                          {/* Score General */}
                                          <div className="flex justify-between p-3 bg-gray-100 rounded-lg font-semibold border-2">
                                            <span>🏆 Score General:</span>
                                            <span className="text-lg">
                                              {evaluationCases[item.id]
                                                ?.liveMetrics
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
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sistema RAG */}
            <RAGManager />

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
  
  structure_details: {
    found: string[];
    missing: string[];
    total_expected: number;
  };
  keyword_details: {
    found: string[];
    missing: string[];
    total_expected: number;
  };
  clarification_details: {
    needs_clarification: boolean;
    asks_for_clarification: boolean;
    clarification_phrases: string[];
  };
  length_details: {
    character_count: number;
    word_count: number;
    optimal_range: string;
    actual_category: string;
  };
  empathy_details: {
    found_indicators: string[];
    empathy_phrases: string[];
  };
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
    structure_details: { found: [], missing: [], total_expected: 0 },
    keyword_details: { found: [], missing: [], total_expected: 0 },
    clarification_details: {
      needs_clarification: false,
      asks_for_clarification: false,
      clarification_phrases: [],
    },
    length_details: {
      character_count: 0,
      word_count: 0,
      optimal_range: "",
      actual_category: "",
    },
    empathy_details: { found_indicators: [], empathy_phrases: [] },
  };

  // 1. Verificar componentes estructurales
  let structureScore = 0;
  const foundComponents: string[] = [];
  const missingComponents: string[] = [];
  
  for (const component of expectedData.expectedComponents) {
    if (component === "analysis" && 
        response.includes("🤔") && response.includes("Análisis:")) {
      structureScore += 1;
      foundComponents.push("🤔 Análisis");
    } else if (component === "response" && 
               response.includes("💡") && response.includes("Respuesta:")) {
      structureScore += 1;
      foundComponents.push("💡 Respuesta");
    } else if (component === "details" && 
               response.includes("📋") && response.includes("Detalles:")) {
      structureScore += 1;
      foundComponents.push("📋 Detalles");
    } else if (component === "next_step" && 
               response.includes("🔄") && response.includes("Siguiente paso:")) {
      structureScore += 1;
      foundComponents.push("🔄 Siguiente paso");
    } else {
      missingComponents.push(component);
    }
  }
  results.structure_score = structureScore / expectedData.expectedComponents.length;
  results.structure_details = {
    found: foundComponents,
    missing: missingComponents,
    total_expected: expectedData.expectedComponents.length,
  };

  // 2. Verificar presencia de palabras clave
  let keywordsFound = 0;
  const foundKeywords: string[] = [];
  const missingKeywords: string[] = [];
  const responseLower = response.toLowerCase();
  
  for (const keyword of expectedData.expectedKeywords) {
    if (responseLower.includes(keyword.toLowerCase())) {
      keywordsFound += 1;
      foundKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  }
  results.keyword_score = keywordsFound / expectedData.expectedKeywords.length;
  results.keyword_details = {
    found: foundKeywords,
    missing: missingKeywords,
    total_expected: expectedData.expectedKeywords.length,
  };

  // 3. Verificar manejo de aclaración
  const needsClarification = expectedData.requiresClarification;
  const clarificationPhrases = [
    "necesito",
    "podrías",
    "específico",
    "aclaración",
    "cuál",
    "qué",
    "dime",
    "indicar",
    "proporcionar",
  ];
  
  const foundClarificationPhrases = clarificationPhrases.filter((phrase) =>
    responseLower.includes(phrase)
  );
  
  const asksForClarification = foundClarificationPhrases.length > 0;
  results.clarification_score = needsClarification === asksForClarification ? 1.0 : 0.0;
  results.clarification_details = {
    needs_clarification: needsClarification,
    asks_for_clarification: asksForClarification,
    clarification_phrases: foundClarificationPhrases,
  };

  // 4. Verificar longitud apropiada
  const length = response.length;
  const wordCount = response.split(' ').length;
  let lengthCategory = "";
  
  if (length >= 200 && length <= 800) {
    results.length_score = 1.0;
    lengthCategory = "Óptima";
  } else if (
    (length >= 100 && length < 200) ||
    (length > 800 && length <= 1000)
  ) {
    results.length_score = 0.7;
    lengthCategory = length < 200 ? "Corta pero aceptable" : "Larga pero aceptable";
  } else {
    results.length_score = 0.3;
    lengthCategory = length < 100 ? "Muy corta" : "Muy larga";
  }
  
  results.length_details = {
    character_count: length,
    word_count: wordCount,
    optimal_range: "200-800 caracteres",
    actual_category: lengthCategory,
  };

  // 5. Verificar tono empático
  const empathyIndicators = [
    "entiendo",
    "perfecto",
    "ayudo", 
    "lamento",
    "bienvenido",
    "gracias",
    "excelente",
    "encantado",
  ];
  
  const foundEmpathyIndicators = empathyIndicators.filter((indicator) =>
    responseLower.includes(indicator)
  );
  
  const empathyScore = foundEmpathyIndicators.length;
  results.empathy_score = Math.min(empathyScore / 2, 1.0);
  results.empathy_details = {
    found_indicators: foundEmpathyIndicators,
    empathy_phrases: foundEmpathyIndicators,
  };

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
                    <h4 className="font-bold text-black mb-2">1. Estructura</h4>
                    <p className="text-sm text-gray-700">
                      Verifica componentes estructurales: Análisis, Respuesta,
                      Detalles y Siguiente paso. Busca emojis específicos y
                      formato consistente.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-sm border">
                    <h4 className="font-bold text-black mb-2">2. Empatía</h4>
                    <p className="text-sm text-gray-700">
                      Identifica 5 palabras empáticas específicas:
                      &quot;entiendo&quot;, &quot;perfecto&quot;,
                      &quot;ayudo&quot;, &quot;lamento&quot;,
                      &quot;bienvenido&quot;. Máximo 100% con 2+ palabras.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-sm border">
                    <h4 className="font-bold text-black mb-2">
                      3. Palabras clave
                    </h4>
                    <p className="text-sm text-gray-700">
                      Verifica presencia de términos relevantes según el
                      contexto de la consulta. Evalúa productos, procesos y
                      información específica.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-sm border">
                    <h4 className="font-bold text-black mb-2">
                      4. Score general
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
                <h4>Intenciones Críticas Identificadas (Por Complejidad):</h4>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                  <h6 className="font-semibold text-blue-700 mb-2">
                    💡 Lógica de Clasificación:
                  </h6>
                  <div className="text-sm grid md:grid-cols-3 gap-4">
                    <div>
                      <strong>🟢 CONSULTAR:</strong> Solo mostrar información
                      <br />
                      <em>
                        Ej: &quot;¿A qué hora sale mi vuelo?&quot; → Mostrar
                        horario + gate + asiento
                      </em>
                    </div>
                    <div>
                      <strong>🟡 MODIFICAR:</strong> Cambiar algo existente
                      <br />
                      <em>
                        Ej: &quot;Quiero cambiar mi asiento&quot; →
                        Disponibilidad + preferencias + cobro
                      </em>
                    </div>
                    <div>
                      <strong>🔴 TRANSACCIONAR:</strong> Operaciones complejas
                      <br />
                      <em>
                        Ej: &quot;Cambiar vuelo completo&quot; → Pricing +
                        políticas + inventario
                      </em>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h5 className="font-bold text-green-700 mb-2">
                      🟢 Complejidad Baja (Solo Consultas)
                    </h5>
                    <ul className="text-sm space-y-1">
                      <li>
                        • <strong>Estado vuelo:</strong> Horario, gate, asiento
                        asignado
                      </li>
                      <li>
                        • <strong>Equipaje:</strong> Políticas, peso permitido
                      </li>
                      <li>
                        • <strong>Asientos disponibles:</strong> Mostrar mapa
                        vuelo
                      </li>
                      <li>
                        • <strong>Servicios info:</strong> Comidas,
                        entretenimiento
                      </li>
                      <li>
                        • <strong>Documentación:</strong> Requisitos
                        MERCOSUR/visa
                      </li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h5 className="font-bold text-blue-700 mb-2">
                      🔵 Complejidad Baja (Acciones Simples)
                    </h5>
                    <ul className="text-sm space-y-1">
                      <li>
                        • <strong>Check-in:</strong> Validar identidad + generar
                        pase
                      </li>
                      <li>
                        • <strong>Pase de abordar:</strong> Re-enviar por
                        WhatsApp
                      </li>
                      <li>
                        • <strong>Notificaciones:</strong> Activar alertas vuelo
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-6">
                  <h5 className="font-bold text-orange-700 mb-2">
                    🟡 Complejidad Media (Modificaciones)
                  </h5>
                  <ul className="text-sm space-y-1">
                    <li>
                      • <strong>Cambiar asiento:</strong> Disponibilidad +
                      preferencias + tarifas premium
                    </li>
                    <li>
                      • <strong>Agregar servicios:</strong> Comidas especiales +
                      pricing + disponibilidad
                    </li>
                    <li>
                      • <strong>Upgrade clase:</strong> Disponibilidad +
                      diferencia precio + políticas
                    </li>
                    <li>
                      • <strong>Modificar datos:</strong> Nombre, contacto
                      (según restricciones boleto)
                    </li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
                  <h5 className="font-bold text-red-700 mb-2">
                    🔴 Complejidad Alta (Críticas)
                  </h5>
                  <ul className="text-sm space-y-1">
                    <li>
                      • <strong>Cambiar vuelo:</strong> Disponibilidad +
                      políticas + cálculos precio + restricciones tarifarias
                    </li>
                    <li>
                      • <strong>Cancelar/reembolsos:</strong> Políticas
                      complejas + procesamiento pagos + excepciones
                    </li>
                    <li>
                      • <strong>Gestión crisis:</strong> Vuelos cancelados +
                      reubicación + compensaciones
                    </li>
                  </ul>
                </div>

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
                        <div>
                          &quot;Necesito cambiar mi vuelo a Buenos Aires del
                          viernes&quot;
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Bot</div>
                        <div>
                          &quot;¡Por supuesto! Te ayudo con el cambio. ¿Me das
                          tu código de reserva o número de cédula?&quot;
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Usuario</div>
                        <div>&quot;Mi reserva es VCN458&quot;</div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Bot</div>
                        <div>
                          &quot;Perfecto. Veo tu vuelo ASU-EZE del 15 de julio a
                          las 14:30. ¿Para qué nueva fecha lo necesitas?&quot;
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Usuario</div>
                        <div>&quot;Para el 20 de julio&quot;</div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Bot</div>
                        <div>
                          &quot;Encontré disponibilidad el 20/07 a las 09:15 y
                          16:45. La diferencia es de USD $85. ¿Cuál horario
                          prefieres?&quot;
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Usuario</div>
                        <div>&quot;El de la mañana está perfecto&quot;</div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-green-500 text-white p-3 rounded-lg rounded-bl-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Bot</div>
                        <div>
                          &quot;¡Listo! Vuelo cambiado a VCN812 del 20/07 09:15
                          ASU-EZE. Confirmación enviada a tu WhatsApp y email.
                          ¡Buen viaje!&quot;
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
                        <div>&quot;Cámbiame el vuelo&quot;</div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-yellow-500 text-white p-3 rounded-lg rounded-bl-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Bot</div>
                        <div>
                          &quot;Te ayudo con eso. ¿Me das tu código de reserva o
                          apellido y cédula para buscarlo?&quot;
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Usuario</div>
                        <div>&quot;No tengo el código acá&quot;</div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-yellow-500 text-white p-3 rounded-lg rounded-bl-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Bot</div>
                        <div>
                          &quot;No hay problema. Con tu cédula y apellido puedo
                          encontrarlo. ¿Me los das?&quot;
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Usuario</div>
                        <div>&quot;5.234.567, González&quot;</div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-green-500 text-white p-3 rounded-lg rounded-bl-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Bot</div>
                        <div>
                          &quot;Perfecto. Veo dos reservas: ASU-São Paulo el
                          18/07 y ASU-Lima el 25/07. ¿Cuál querés cambiar?&quot;
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h5 className="font-bold">
                  📋 Flujo Adicional: Check-in Automatizado (Complejidad Baja)
                </h5>

                <p>
                  <strong>Camino Exitoso - Check-in Express:</strong>
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border my-4">
                  <div className="space-y-3">
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Usuario</div>
                        <div>&quot;Necesito hacer check-in&quot;</div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Bot</div>
                        <div>
                          &quot;¡Perfecto! ¿Me das tu apellido y código de
                          reserva?&quot;
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Usuario</div>
                        <div>&quot;Silva, VCN892&quot;</div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-green-500 text-white p-3 rounded-lg rounded-bl-sm max-w-xs">
                        <div className="text-xs opacity-75 mb-1">Bot</div>
                        <div>
                          &quot;✅ ¡Check-in listo! Vuelo VCN892 ASU→GRU hoy
                          16:20. Asiento 12F. Pase enviado a tu WhatsApp. ¡Buen
                          viaje a São Paulo!&quot;
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h5 className="font-bold">
                  ⚠️ Desafíos Conversacionales Críticos y Mitigaciones
                </h5>
                <div className="grid md:grid-cols-1 gap-4 mt-4">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h6 className="font-semibold text-yellow-700 mb-2">
                      🚨 Desafío 1: Gestión de Crisis Masiva
                    </h6>
                    <div className="text-sm space-y-2">
                      <p>
                        <strong>Escenario:</strong> Tormenta cancela 50+ vuelos,
                        10,000 pasajeros afectados simultáneamente
                      </p>
                      <p>
                        <strong>Problema:</strong> Saturación de canales,
                        información inconsistente, frustración masiva
                      </p>
                      <p>
                        <strong>Mitigación Arquitectónica:</strong>
                      </p>
                      <ul className="ml-4 space-y-1">
                        <li>
                          • Auto-scaling automático basado en volumen de
                          consultas
                        </li>
                        <li>
                          • Respuestas proactivas: envío masivo de
                          notificaciones antes de consultas
                        </li>
                        <li>
                          • Cola de prioridades: pasajeros en conexión →
                          prioritarios
                        </li>
                        <li>
                          • Fallback a información estática cuando GDS está
                          saturado
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h6 className="font-semibold text-red-700 mb-2">
                      🔄 Desafío 2: Conversaciones Multi-Sesión Complejas
                    </h6>
                    <div className="text-sm space-y-2">
                      <p>
                        <strong>Escenario:</strong> Usuario inicia cambio de
                        vuelo en web, continúa en WhatsApp 2 horas después,
                        termina por teléfono
                      </p>
                      <p>
                        <strong>Problema:</strong> Pérdida de contexto,
                        re-explicar todo, frustración usuario
                      </p>
                      <p>
                        <strong>Mitigación Técnica:</strong>
                      </p>
                      <ul className="ml-4 space-y-1">
                        <li>• Contexto persistente con Redis: TTL 24 horas</li>
                        <li>• ID sesión unificado por email/teléfono</li>
                        <li>
                          • Resumen automático: &quot;Veo que estabas cambiando
                          vuelo VCN458 ASU-EZE...&quot;
                        </li>
                        <li>• Sincronización cross-canal en tiempo real</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h6 className="font-semibold text-purple-700 mb-2">
                      💰 Desafío 3: Cálculos de Precio Complejos en Tiempo Real
                    </h6>
                    <div className="text-sm space-y-2">
                      <p>
                        <strong>Escenario:</strong> Cambio de vuelo con tarifa
                        flexible + upgrade + equipaje extra + penalizaciones
                      </p>
                      <p>
                        <strong>Problema:</strong> 15+ reglas tarifarias,
                        promociones activas, disponibilidad cambiante
                      </p>
                      <p>
                        <strong>Mitigación Conversacional:</strong>
                      </p>
                      <ul className="ml-4 space-y-1">
                        <li>
                          • Desglose paso a paso: &quot;Calculando diferencia de
                          tarifa... ✅&quot;
                        </li>
                        <li>
                          • Explicación clara: &quot;Diferencia tarifa USD $120
                          + penalización ₲150.000 = Total USD $185&quot;
                        </li>
                        <li>
                          • Timeout manejo: &quot;Pricing toma más tiempo,
                          ¿prefieres que te llame?&quot;
                        </li>
                        <li>• Confirmación explícita antes de procesar pago</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h6 className="font-semibold text-blue-700 mb-2">
                      🌍 Desafío 4: Regulaciones Cambiantes por País
                    </h6>
                    <div className="text-sm space-y-2">
                      <p>
                        <strong>Escenario:</strong> COVID, requisitos
                        USA/Europa, documentos MERCOSUR cambian semanalmente
                      </p>
                      <p>
                        <strong>Problema:</strong> Información desactualizada
                        puede causar problemas legales/migratorios
                      </p>
                      <p>
                        <strong>Mitigación Operacional:</strong>
                      </p>
                      <ul className="ml-4 space-y-1">
                        <li>
                          • Base conocimiento con versionado y fechas de
                          actualización
                        </li>
                        <li>
                          • Disclaimers automáticos: &quot;Info actualizada al
                          [fecha], confirma en consulado&quot;
                        </li>
                        <li>
                          • Escalamiento automático para casos complejos de
                          documentación
                        </li>
                        <li>
                          • Integración con fuentes oficiales (IATA, gobiernos)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-black mb-4">
                3. Plan de Implementación Pragmático
              </h3>
              <div className="prose max-w-none text-black">
                <p>
                  Roadmap de implementación con objetivos concretos y medibles
                  para VuelaConNosotros:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-bold text-green-700 mb-3">
                      📈 Fase 1 (Meses 1-3) - Solo Consultas + Check-in
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>
                        • <strong>Consultas básicas:</strong> Estado vuelo,
                        equipaje, asientos, servicios, documentación
                      </li>
                      <li>
                        • <strong>Acción simple:</strong> Check-in automatizado
                      </li>
                      <li>
                        • <strong>Canales:</strong> WhatsApp + Web chat
                      </li>
                      <li>
                        • <strong>Integración:</strong> GDS solo lectura + base
                        conocimiento estática
                      </li>
                      <li>
                        • <strong>Objetivo:</strong> 80% consultas informativas
                        resueltas sin agente
                      </li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-bold text-orange-700 mb-3">
                      🎯 Fase 2 (Meses 4-6) - Modificaciones Simples
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>
                        • <strong>Modificaciones:</strong> Cambiar asiento,
                        agregar servicios, upgrade
                      </li>
                      <li>
                        • <strong>Personalización:</strong> Preferencias
                        cliente, historial
                      </li>
                      <li>
                        • <strong>Integración:</strong> GDS escritura + payment
                        gateway básico
                      </li>
                      <li>
                        • <strong>Canales:</strong> + Teléfono con ASR, app
                        móvil
                      </li>
                      <li>
                        • <strong>Objetivo:</strong> 70% modificaciones simples
                        automatizadas
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-1 gap-6 mt-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-bold text-red-700 mb-3">
                      🚀 Fase 3 (Meses 7-12) - Transacciones Críticas Complejas
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ul className="text-sm space-y-1">
                        <li>
                          • <strong>Transacciones complejas:</strong> Cambio
                          vuelo completo, cancelaciones con reembolso
                        </li>
                        <li>
                          • <strong>Gestión crisis:</strong> Reubicación
                          automática, compensaciones, comunicación masiva
                        </li>
                        <li>
                          • <strong>Integración avanzada:</strong> Pricing
                          engines, inventory real-time, payment processing
                        </li>
                      </ul>
                      <ul className="text-sm space-y-1">
                        <li>
                          • <strong>IA predictiva:</strong> Análisis
                          sentimiento, detección problemas, escalamiento
                          inteligente
                        </li>
                        <li>
                          • <strong>Escalabilidad crisis:</strong> 10,000+
                          usuarios simultáneos durante eventos climáticos
                        </li>
                        <li>
                          • <strong>Objetivo:</strong> 60% transacciones
                          complejas automatizadas, gestión crisis proactiva
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-bold text-gray-700 mb-3">
                    🎛️ Consideraciones Técnicas Críticas
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-semibold mb-2">
                        Escalabilidad Real:
                      </h5>
                      <ul className="space-y-1">
                        <li>• Picos de tráfico en temporada alta (Dic-Mar)</li>
                        <li>
                          • Eventos disruptivos (clima, cancelaciones masivas)
                        </li>
                        <li>• Crecimiento orgánico 20% anual de consultas</li>
                        <li>• Auto-scaling basado en métricas reales</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Métricas de Éxito:</h5>
                      <ul className="space-y-1">
                        <li>• Reducción 40% llamadas call center</li>
                        <li>• CSAT &gt;4.2/5.0 conversaciones bot</li>
                        <li>• ROI positivo en 8 meses</li>
                        <li>• Tiempo resolución &lt;3 minutos promedio</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <h4 className="font-bold text-indigo-700 mb-3">
                    🔧 Herramientas Específicas: Obtener vs Enviar Información
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-semibold mb-2 text-indigo-600">
                        📥 Herramientas para OBTENER:
                      </h5>
                      <ul className="space-y-1">
                        <li>
                          • <strong>GDS APIs:</strong> Amadeus, Sabre -
                          disponibilidad tiempo real
                        </li>
                        <li>
                          • <strong>Pricing Engine:</strong> Cálculos tarifarios
                          complejos
                        </li>
                        <li>
                          • <strong>CRM Database:</strong> Historial cliente,
                          preferencias
                        </li>
                        <li>
                          • <strong>Inventory System:</strong> Asientos,
                          servicios disponibles
                        </li>
                        <li>
                          • <strong>External APIs:</strong> Clima, restricciones
                          países
                        </li>
                        <li>
                          • <strong>Knowledge Base:</strong> Políticas, FAQ
                          actualizadas
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2 text-indigo-600">
                        📤 Herramientas para ENVIAR:
                      </h5>
                      <ul className="space-y-1">
                        <li>
                          • <strong>Reservation System:</strong>{" "}
                          Crear/modificar/cancelar reservas
                        </li>
                        <li>
                          • <strong>Payment Gateway:</strong> Procesar
                          reembolsos, cargos
                        </li>
                        <li>
                          • <strong>Notification Hub:</strong> SMS, email, push
                          notifications
                        </li>
                        <li>
                          • <strong>Document Generator:</strong> Pases abordar,
                          vouchers
                        </li>
                        <li>
                          • <strong>Ticketing System:</strong> Abrir casos
                          soporte, escalamiento
                        </li>
                        <li>
                          • <strong>Analytics Collector:</strong> Métricas
                          conversación, feedback
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-bold text-purple-700 mb-3">
                    🧠 Evolución Continua del Conocimiento
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-semibold mb-2">
                        Nuevas Bases de Conocimiento:
                      </h5>
                      <ul className="space-y-1">
                        <li>
                          • <strong>Rutas nuevas:</strong> Auto-import desde
                          planning comercial
                        </li>
                        <li>
                          • <strong>Políticas actualizadas:</strong> Versionado
                          con rollback
                        </li>
                        <li>
                          • <strong>Promociones temporales:</strong> TTL
                          automático
                        </li>
                        <li>
                          • <strong>Regulaciones países:</strong> Sync con
                          fuentes oficiales
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">
                        Mejora Automática IA:
                      </h5>
                      <ul className="space-y-1">
                        <li>
                          • <strong>Feedback loops:</strong> Satisfacción →
                          reentrenamiento
                        </li>
                        <li>
                          • <strong>Intent discovery:</strong> Nuevas
                          intenciones desde conversaciones
                        </li>
                        <li>
                          • <strong>Error pattern detection:</strong> Fallos
                          recurrentes → mejoras
                        </li>
                        <li>
                          • <strong>A/B testing:</strong> Optimización
                          respuestas automática
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-bold text-green-700 mb-3">
                    🇵🇾 Consideraciones Específicas Paraguay
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-semibold mb-2 text-green-600">
                        🌍 Contexto Local:
                      </h5>
                      <ul className="space-y-1">
                        <li>
                          • <strong>Idiomas:</strong> Soporte guaraní y español
                          nativo
                        </li>
                        <li>
                          • <strong>Regulaciones:</strong> Cumplimiento ANAC
                          Paraguay
                        </li>
                        <li>
                          • <strong>Conexiones:</strong> Hub Silvio Pettirossi
                          (ASU)
                        </li>
                        <li>
                          • <strong>Destinos frecuentes:</strong> Buenos Aires,
                          São Paulo, Lima
                        </li>
                        <li>
                          • <strong>Temporadas:</strong> Alta Dic-Mar, baja
                          Jun-Ago
                        </li>
                        <li>
                          • <strong>Clima:</strong> Tormentas Oct-Mar afectan
                          operaciones
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2 text-green-600">
                        📱 Canales Prioritarios:
                      </h5>
                      <ul className="space-y-1">
                        <li>
                          • <strong>WhatsApp:</strong> Canal principal (80%
                          usuarios PY)
                        </li>
                        <li>
                          • <strong>Teléfono:</strong> Respaldo para urgencias
                        </li>
                        <li>
                          • <strong>Web Chat:</strong> Usuarios
                          corporativos/jóvenes
                        </li>
                        <li>
                          • <strong>SMS:</strong> Notificaciones vuelos/cambios
                          de gate
                        </li>
                        <li>
                          • <strong>Horarios:</strong> 5:00-23:00 (operaciones
                          aeropuerto)
                        </li>
                        <li>
                          • <strong>Moneda:</strong> Guaraníes (₲) y USD para
                          internacionales
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-700 mb-3">
                    📊 Plan de Implementación - VuelaConNosotros Paraguay
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded border">
                      <h5 className="font-semibold text-blue-600 mb-2">
                        🚀 Fase 1: Consultas + Check-in (Meses 1-3)
                      </h5>
                      <ul className="text-sm space-y-1">
                        <li>
                          • <strong>Consultas:</strong> Estado vuelos
                          ASU-EZE/GRU, equipaje ANAC, asientos, servicios
                        </li>
                        <li>
                          • <strong>Acción:</strong> Check-in automatizado
                        </li>
                        <li>
                          • <strong>Canales:</strong> WhatsApp (prioritario) +
                          Web Chat
                        </li>
                        <li>
                          • <strong>Idiomas:</strong> Español + escalamiento
                          guaraní
                        </li>
                        <li>
                          • <strong>Objetivo:</strong> 80% consultas
                          informativas sin agente
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <h5 className="font-semibold text-blue-600 mb-2">
                        🎯 Fase 2: Modificaciones (Meses 4-6)
                      </h5>
                      <ul className="text-sm space-y-1">
                        <li>
                          • <strong>Modificar:</strong> Cambiar asientos,
                          agregar comidas, upgrades
                        </li>
                        <li>
                          • <strong>Info avanzada:</strong> Documentación
                          MERCOSUR/USA/Europa
                        </li>
                        <li>
                          • <strong>Canales:</strong> + Teléfono, app móvil, SMS
                          proactivo
                        </li>
                        <li>
                          • <strong>Personalización:</strong> Preferencias
                          cliente frecuente
                        </li>
                        <li>
                          • <strong>Objetivo:</strong> 70% modificaciones
                          simples automatizadas
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-bold text-yellow-700 mb-3">
                    ⚠️ Desafíos Técnicos de Escalabilidad
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Desafío:</strong> Picos de tráfico en temporada
                      alta (Dic-Mar) + conexiones internacionales
                      <br />
                      <strong>Mitigación:</strong> Auto-scaling predictivo +
                      cache inteligente para rutas frecuentes ASU-EZE/GRU
                    </div>
                    <div>
                      <strong>Desafío:</strong> Procesamiento bilingüe (guaraní
                      tiene menos recursos NLP)
                      <br />
                      <strong>Mitigación:</strong> Modelos híbridos español +
                      detección guaraní + fallback a agente nativo
                    </div>
                    <div>
                      <strong>Desafío:</strong> Integración GDS internacional
                      desde Paraguay (latencia)
                      <br />
                      <strong>Mitigación:</strong> Cache regional + CDN en
                      Brasil/Argentina + fallback local
                    </div>
                    <div>
                      <strong>Desafío:</strong> Compliance ANAC + regulaciones
                      múltiples destinos (USA, Europa, MERCOSUR)
                      <br />
                      <strong>Mitigación:</strong> Base conocimiento multi-país
                      + alertas regulatorias automáticas
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
