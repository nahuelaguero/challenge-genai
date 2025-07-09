"use client";

import { useState } from "react";

// Patrones de intención
const INTENT_PATTERNS = {
  consultar_saldo: {
    keywords: ["saldo", "dinero", "plata", "cuenta", "disponible"],
    expectedResponse: /saldo|dinero|disponible|cuenta/i,
  },
  consultar_tarjeta: {
    keywords: ["tarjeta", "card", "plastico"],
    expectedResponse: /tarjeta|card|débito|crédito/i,
  },
  solicitar_tarjeta: {
    keywords: ["solicitar", "pedir", "nueva", "tarjeta"],
    expectedResponse: /solicitud|proceso|documentos|requisitos/i,
    requiresMultiple: true,
  },
  consultar_prestamo: {
    keywords: ["prestamo", "credito", "financiamiento"],
    expectedResponse: /préstamo|crédito|financiamiento|tasa/i,
  },
  solicitar_prestamo: {
    keywords: ["solicitar", "pedir", "prestamo", "credito"],
    expectedResponse: /solicitud|proceso|documentos|requisitos/i,
    requiresMultiple: true,
  },
  bloquear_tarjeta: {
    keywords: ["bloquear", "bloqueo", "tarjeta", "cancelar"],
    expectedResponse: /bloqueo|bloquear|cancelar|seguridad/i,
  },
  desbloquear_tarjeta: {
    keywords: ["desbloquear", "activar", "tarjeta"],
    expectedResponse: /desbloquear|activar|habilitar/i,
  },
  consultar_movimientos: {
    keywords: ["movimientos", "transacciones", "historial"],
    expectedResponse: /movimientos|transacciones|historial/i,
  },
  cambiar_pin: {
    keywords: ["cambiar", "pin", "clave"],
    expectedResponse: /pin|clave|cambiar|seguridad/i,
  },
  consultar_limite: {
    keywords: ["limite", "cupo", "disponible"],
    expectedResponse: /límite|cupo|disponible/i,
  },
  aumentar_limite: {
    keywords: ["aumentar", "incrementar", "limite"],
    expectedResponse: /aumentar|incrementar|límite/i,
  },
  consultar_estado_cuenta: {
    keywords: ["estado", "cuenta", "resumen"],
    expectedResponse: /estado|cuenta|resumen/i,
  },
  reportar_problema: {
    keywords: ["problema", "error", "falla", "ayuda"],
    expectedResponse: /problema|error|solución|ayuda/i,
  },
  consultar_politicas: {
    keywords: ["politicas", "terminos", "condiciones"],
    expectedResponse: /políticas|términos|condiciones/i,
  },
};

const AMBIGUOUS_PATTERNS = [
  "que",
  "como",
  "donde",
  "cuando",
  "ayuda",
  "hola",
  "info",
];

// Funciones de evaluación (métricas originales mejoradas)
function detectIntent(query: string): string {
  const lowerQuery = query.toLowerCase();

  if (AMBIGUOUS_PATTERNS.some((pattern) => lowerQuery.includes(pattern))) {
    return "ambigua";
  }

  for (const [intent, pattern] of Object.entries(INTENT_PATTERNS)) {
    const matchedKeywords = pattern.keywords.filter((keyword) =>
      lowerQuery.includes(keyword)
    );

    if (
      "requiresMultiple" in pattern &&
      pattern.requiresMultiple &&
      matchedKeywords.length >= 2
    ) {
      return intent;
    } else if (!("requiresMultiple" in pattern) && matchedKeywords.length > 0) {
      return intent;
    }
  }

  return "consulta_general";
}

function calculateStructureScore(response: string): number {
  const hasAnalysis = /🤔.*análisis:|análisis:/i.test(response);
  const hasResponse = /💡.*respuesta:|respuesta:/i.test(response);
  const hasDetails = /📋.*detalles:|detalles:/i.test(response);
  const hasNextStep = /🔄.*siguiente paso:|siguiente paso:/i.test(response);

  const components = [hasAnalysis, hasResponse, hasDetails, hasNextStep];
  return components.filter(Boolean).length / 4;
}

function calculateKeywordScore(query: string, response: string): number {
  const intent = detectIntent(query);
  const pattern = INTENT_PATTERNS[intent as keyof typeof INTENT_PATTERNS];

  if (!pattern) return 0.5;

  const responseText = response.toLowerCase();
  const contextKeywords = pattern.keywords.filter((keyword) =>
    responseText.includes(keyword)
  );
  const fintechKeywords = [
    "tarjeta",
    "crédito",
    "débito",
    "préstamo",
    "saldo",
    "cuenta",
  ];
  const fintechMatches = fintechKeywords.filter((keyword) =>
    responseText.includes(keyword)
  );

  const contextScore = Math.min(
    contextKeywords.length / pattern.keywords.length,
    1.0
  );
  const fintechScore = Math.min(fintechMatches.length / 2, 1.0);

  return contextScore * 0.7 + fintechScore * 0.3;
}

function calculateClarificationScore(query: string, response: string): number {
  const intent = detectIntent(query);
  const pattern = INTENT_PATTERNS[intent as keyof typeof INTENT_PATTERNS];

  if (!pattern) return 0.5;

  const hasExpectedResponse = pattern.expectedResponse.test(response);
  const hasReasoning =
    /proceso|análisis|considero|evalúo|primero|segundo|luego/i.test(response);
  const needsClarification = intent === "ambigua";
  const asksClarification =
    /necesito|podrías|específico|aclaración|cuál|qué/i.test(response);

  let score = 0;
  if (hasExpectedResponse) score += 0.5;
  if (hasReasoning) score += 0.3;
  if (needsClarification && asksClarification) score += 0.2;
  if (!needsClarification && !asksClarification) score += 0.2;

  return Math.min(score, 1.0);
}

function calculateLengthScore(response: string): number {
  const length = response.length;
  if (length >= 200 && length <= 800) return 1.0;
  if (length >= 100 && length < 200) return 0.7;
  if (length > 800 && length <= 1000) return 0.7;
  if (length >= 50 && length < 100) return 0.3;
  return 0.3;
}

function calculateEmpathyScore(response: string): number {
  const empathyWords = ["entiendo", "lamento", "comprendo", "apoyo", "ayudo"];
  const politenessWords = ["por favor", "gracias", "disculpe", "con gusto"];

  const empathyCount = empathyWords.filter((word) =>
    response.toLowerCase().includes(word)
  ).length;
  const politenessCount = politenessWords.filter((word) =>
    response.toLowerCase().includes(word)
  ).length;

  const empathyScore = Math.min(empathyCount / 2, 1.0);
  const politenessScore = Math.min(politenessCount / 2, 1.0);

  return (empathyScore + politenessScore) / 2;
}

function calculateOverallScore(metrics: {
  structure_score: number;
  keyword_score: number;
  clarification_score: number;
  length_score: number;
  empathy_score: number;
}): number {
  const weights = {
    structure_score: 0.3,
    keyword_score: 0.25,
    clarification_score: 0.2,
    length_score: 0.1,
    empathy_score: 0.15,
  };

  return Object.entries(weights).reduce((total, [key, weight]) => {
    return total + metrics[key as keyof typeof metrics] * weight;
  }, 0);
}

function evaluateResponse(query: string, response: string) {
  const metrics = {
    structure_score: calculateStructureScore(response),
    keyword_score: calculateKeywordScore(query, response),
    clarification_score: calculateClarificationScore(query, response),
    length_score: calculateLengthScore(response),
    empathy_score: calculateEmpathyScore(response),
  };

  const overall_score = calculateOverallScore(metrics);

  return { ...metrics, overall_score };
}

// Dataset de prueba
const testDataset = [
  {
    query: "¿Cuál es mi saldo actual?",
    expectedResponse:
      "Para consultar tu saldo actual, puedes acceder a tu cuenta...",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: ["saldo", "cuenta", "consultar", "acceder"],
    requiresClarification: false,
  },
  {
    query: "¿Cómo solicito una tarjeta de crédito?",
    expectedResponse: "Para solicitar una tarjeta de crédito necesitas...",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: ["tarjeta", "crédito", "solicitar", "requisitos"],
    requiresClarification: false,
  },
  {
    query: "Mi tarjeta está bloqueada, ¿qué hago?",
    expectedResponse: "Si tu tarjeta está bloqueada, puedes desbloquearla...",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: ["tarjeta", "bloqueada", "desbloquear", "solución"],
    requiresClarification: false,
  },
  {
    query: "¿Cuáles son las tasas de interés para préstamos?",
    expectedResponse: "Nuestras tasas de interés para préstamos varían...",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: ["tasas", "interés", "préstamos", "varían"],
    requiresClarification: false,
  },
  {
    query: "¿Cómo cambio mi PIN?",
    expectedResponse: "Para cambiar tu PIN puedes hacerlo...",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: ["cambiar", "PIN", "proceso", "seguridad"],
    requiresClarification: false,
  },
];

export default function EvaluationCard() {
  const [selectedQuery, setSelectedQuery] = useState(testDataset[0].query);
  const [apiKey, setApiKey] = useState("");
  const [realResponse, setRealResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Respuesta simulada
  const simulatedResponse = `🤔 **Análisis:** El cliente consulta sobre su saldo actual. Necesito brindar información sobre cómo puede verificar su saldo disponible.

💡 **Respuesta:** Entiendo que necesitas conocer tu saldo actual. Puedes consultarlo de varias maneras: a través de nuestra app móvil, en cajeros automáticos, o llamando a nuestro centro de atención.

📋 **Detalles:** Tu cuenta de débito muestra el saldo en tiempo real. La app móvil está disponible 24/7 y es la forma más rápida de consultar tu dinero disponible.

🔄 **Siguiente paso:** Te recomiendo descargar nuestra app móvil para consultas futuras. ¿Necesitas ayuda con la descarga o tienes otra consulta sobre tu cuenta?`;

  const simulatedMetrics = evaluateResponse(selectedQuery, simulatedResponse);
  const realMetrics = realResponse
    ? evaluateResponse(selectedQuery, realResponse)
    : null;

  const handleRealTest = async () => {
    if (!apiKey.trim()) {
      setError("Se requiere API key de OpenAI");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/test-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: selectedQuery,
          apiKey: apiKey.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en la API");
      }

      const data = await response.json();
      setRealResponse(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de consulta */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Consulta a evaluar:
        </label>
        <select
          value={selectedQuery}
          onChange={(e) => setSelectedQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {testDataset.map((item, index) => (
            <option key={index} value={item.query}>
              {item.query}
            </option>
          ))}
        </select>
      </div>

      {/* API Key para prueba real */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          API Key de OpenAI (para prueba real):
        </label>
        <div className="flex gap-2">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleRealTest}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Ejecutando..." : "Probar Real"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* Comparación side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sistema Simulado */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Sistema Simulado
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Respuesta:</h4>
              <div className="bg-white p-4 rounded border text-sm">
                {simulatedResponse}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Métricas:</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Estructura:</span>
                  <span className="font-mono">
                    {(simulatedMetrics.structure_score * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Keywords:</span>
                  <span className="font-mono">
                    {(simulatedMetrics.keyword_score * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Claridad:</span>
                  <span className="font-mono">
                    {(simulatedMetrics.clarification_score * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Longitud:</span>
                  <span className="font-mono">
                    {(simulatedMetrics.length_score * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Empatía:</span>
                  <span className="font-mono">
                    {(simulatedMetrics.empathy_score * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="font-mono">
                    {(simulatedMetrics.overall_score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sistema Real */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Sistema Real (ChatGPT)
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Respuesta:</h4>
              <div className="bg-white p-4 rounded border text-sm min-h-[200px]">
                {realResponse ||
                  'Ingresa tu API key y presiona "Probar Real" para ver la respuesta de ChatGPT'}
              </div>
            </div>

            {realMetrics && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Métricas:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Estructura:</span>
                    <span className="font-mono">
                      {(realMetrics.structure_score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Keywords:</span>
                    <span className="font-mono">
                      {(realMetrics.keyword_score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Claridad:</span>
                    <span className="font-mono">
                      {(realMetrics.clarification_score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Longitud:</span>
                    <span className="font-mono">
                      {(realMetrics.length_score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Empatía:</span>
                    <span className="font-mono">
                      {(realMetrics.empathy_score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="font-mono">
                      {(realMetrics.overall_score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparación de resultados */}
      {realMetrics && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Comparación de Resultados
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Simulado:</span>
              <div className="text-2xl font-bold text-gray-800">
                {(simulatedMetrics.overall_score * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Real:</span>
              <div className="text-2xl font-bold text-blue-600">
                {(realMetrics.overall_score * 100).toFixed(1)}%
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Diferencia:{" "}
            {Math.abs(
              simulatedMetrics.overall_score - realMetrics.overall_score
            ).toFixed(3)}
            (
            {(
              Math.abs(
                simulatedMetrics.overall_score - realMetrics.overall_score
              ) * 100
            ).toFixed(1)}
            %)
          </div>
        </div>
      )}
    </div>
  );
}
