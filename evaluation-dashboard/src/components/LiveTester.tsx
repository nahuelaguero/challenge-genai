"use client";

import { useState } from "react";
import { z } from "zod";

// Esquemas de validación con zod
const QuerySchema = z.object({
  text: z.string().min(1, "La consulta no puede estar vacía"),
  intent: z
    .enum([
      "consultar_saldo",
      "consultar_tarjeta",
      "solicitar_tarjeta",
      "consultar_prestamo",
      "solicitar_prestamo",
      "bloquear_tarjeta",
      "desbloquear_tarjeta",
      "consultar_movimientos",
      "cambiar_pin",
      "consultar_limite",
      "aumentar_limite",
      "consultar_estado_cuenta",
      "reportar_problema",
      "consultar_politicas",
      "ambigua",
    ])
    .optional(),
  expectedResponse: z
    .string()
    .min(1, "La respuesta esperada no puede estar vacía"),
});

const ResponseSchema = z.object({
  response: z.string().min(1),
  reasoning: z.string().optional(),
});

// Configuración de patrones de intención
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
    expectedResponse: /solicitud|requisitos|documentos|evaluación/i,
    requiresMultiple: true,
  },
  bloquear_tarjeta: {
    keywords: ["bloquear", "suspender", "cancelar"],
    expectedResponse: /bloqueo|suspensión|seguridad|confirmación/i,
  },
  desbloquear_tarjeta: {
    keywords: ["desbloquear", "activar", "habilitar"],
    expectedResponse: /desbloqueo|activación|habilitación/i,
  },
  consultar_movimientos: {
    keywords: ["movimientos", "transacciones", "historial"],
    expectedResponse: /movimientos|transacciones|historial|registro/i,
  },
  cambiar_pin: {
    keywords: ["pin", "clave", "contraseña", "cambiar"],
    expectedResponse: /PIN|clave|contraseña|cambio|seguridad/i,
  },
  consultar_limite: {
    keywords: ["limite", "tope", "maximo"],
    expectedResponse: /límite|tope|máximo|disponible/i,
  },
  aumentar_limite: {
    keywords: ["aumentar", "incrementar", "subir", "limite"],
    expectedResponse: /aumento|incremento|evaluación|solicitud/i,
  },
  consultar_estado_cuenta: {
    keywords: ["estado", "cuenta", "resumen"],
    expectedResponse: /estado|resumen|cuenta|información/i,
  },
  reportar_problema: {
    keywords: ["problema", "error", "falla", "inconveniente"],
    expectedResponse: /problema|error|soporte|asistencia/i,
  },
  consultar_politicas: {
    keywords: ["politicas", "terminos", "condiciones"],
    expectedResponse: /políticas|términos|condiciones|información/i,
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
const GENERIC_QUESTION_STARTERS = [
  "que puedo",
  "como puedo",
  "donde puedo",
  "ayudame",
];

// Funciones auxiliares usando los patrones
function detectIntent(query: string): string {
  const lowerQuery = query.toLowerCase();

  // Verificar patrones ambiguos
  if (
    AMBIGUOUS_PATTERNS.some((pattern) => lowerQuery.includes(pattern)) ||
    GENERIC_QUESTION_STARTERS.some((starter) => lowerQuery.startsWith(starter))
  ) {
    return "ambigua";
  }

  // Buscar intención específica
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

// Funciones de evaluación específicas para el challenge - basadas en la métrica original mejorada
function calculateStructureScore(response: string): number {
  // Evaluar componentes específicos del prompt diseñado (como métrica original)
  const hasAnalysis = /🤔.*análisis:|análisis:/i.test(response);
  const hasResponse = /💡.*respuesta:|respuesta:/i.test(response);
  const hasDetails = /📋.*detalles:|detalles:/i.test(response);
  const hasNextStep = /🔄.*siguiente paso:|siguiente paso:/i.test(response);

  // Contar componentes presentes
  const components = [hasAnalysis, hasResponse, hasDetails, hasNextStep];
  const presentComponents = components.filter(Boolean).length;

  // Score basado en componentes específicos del prompt
  return presentComponents / 4;
}

function calculateKeywordScore(query: string, response: string): number {
  const intent = detectIntent(query);
  const pattern = INTENT_PATTERNS[intent as keyof typeof INTENT_PATTERNS];

  if (!pattern) return 0.5;

  const responseText = response.toLowerCase();

  // Evaluar palabras clave específicas del contexto (métrica original)
  const contextKeywords = pattern.keywords.filter((keyword) =>
    responseText.includes(keyword)
  );

  // Evaluar palabras clave específicas del dominio fintech (mejora)
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

  // Combinar ambas evaluaciones (más peso al contexto específico)
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

  // Evaluar si responde a la intención específica (métrica original)
  const hasExpectedResponse = pattern.expectedResponse.test(response);

  // Evaluar si usa Chain of Thought (técnica específica del prompt)
  const hasReasoning =
    /proceso|análisis|considero|evalúo|primero|segundo|luego/i.test(response);

  // Evaluar si hace preguntas clarificadoras cuando es necesario
  const needsClarification = intent === "ambigua";
  const asksClarification =
    /necesito|podrías|específico|aclaración|cuál|qué/i.test(response);

  let score = 0;
  if (hasExpectedResponse) score += 0.5; // Responde correctamente
  if (hasReasoning) score += 0.3; // Usa Chain of Thought
  if (needsClarification && asksClarification) score += 0.2; // Maneja ambigüedad
  if (!needsClarification && !asksClarification) score += 0.2; // No pregunta innecesariamente

  return Math.min(score, 1.0);
}

function calculateLengthScore(response: string): number {
  const length = response.length;

  // Evaluar longitud apropiada para respuestas estructuradas del prompt
  if (length >= 200 && length <= 800) return 1.0; // Rango óptimo para respuestas estructuradas
  if (length >= 100 && length < 200) return 0.7; // Algo corta
  if (length > 800 && length <= 1000) return 0.7; // Algo larga
  if (length >= 50 && length < 100) return 0.3; // Muy corta
  return 0.3; // Muy larga o muy corta
}

function calculateEmpathyScore(response: string): number {
  // Evaluar empatía específica para fintech (métrica original)
  const empathyWords = ["entiendo", "lamento", "comprendo", "apoyo", "ayudo"];
  const politenessWords = ["por favor", "gracias", "disculpe", "con gusto"];

  const empathyCount = empathyWords.filter((word) =>
    response.toLowerCase().includes(word)
  ).length;

  const politenessCount = politenessWords.filter((word) =>
    response.toLowerCase().includes(word)
  ).length;

  // Máximo 1.0 con al menos 2 palabras empáticas
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

interface TestResult {
  query: string;
  response: string;
  metrics: {
    structure_score: number;
    keyword_score: number;
    clarification_score: number;
    length_score: number;
    empathy_score: number;
    overall_score: number;
  };
  timestamp: string;
}

interface LiveTesterProps {
  onTestComplete?: (result: TestResult) => void;
}

export default function LiveTester({ onTestComplete }: LiveTesterProps) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [showDataset, setShowDataset] = useState(false);
  const [runningBatch, setRunningBatch] = useState(false);
  const [batchPaused, setBatchPaused] = useState(false);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);

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
    {
      query: "¿Qué documentos necesito para abrir una cuenta?",
      expectedResponse: "Para abrir una cuenta necesitas presentar...",
      expectedComponents: ["analysis", "response", "details", "next_step"],
      expectedKeywords: ["documentos", "cuenta", "abrir", "presentar"],
      requiresClarification: false,
    },
    {
      query: "¿Cuál es el límite de mi tarjeta?",
      expectedResponse: "Tu límite de tarjeta actual es...",
      expectedComponents: ["analysis", "response", "details", "next_step"],
      expectedKeywords: ["límite", "tarjeta", "actual", "disponible"],
      requiresClarification: false,
    },
    {
      query: "¿Cómo puedo aumentar mi límite de crédito?",
      expectedResponse: "Para aumentar tu límite de crédito necesitas...",
      expectedComponents: ["analysis", "response", "details", "next_step"],
      expectedKeywords: ["aumentar", "límite", "crédito", "proceso"],
      requiresClarification: false,
    },
    {
      query: "¿Dónde puedo ver mis movimientos?",
      expectedResponse: "Puedes consultar tus movimientos en...",
      expectedComponents: ["analysis", "response", "details", "next_step"],
      expectedKeywords: [
        "movimientos",
        "consultar",
        "historial",
        "transacciones",
      ],
      requiresClarification: false,
    },
    {
      query: "Tengo un problema con una transacción",
      expectedResponse:
        "Lamento escuchar sobre el problema con tu transacción...",
      expectedComponents: ["analysis", "response", "details", "next_step"],
      expectedKeywords: ["problema", "transacción", "solución", "ayuda"],
      requiresClarification: false,
    },
  ];

  const validateAndSubmit = async () => {
    try {
      // Validar entrada
      const validatedQuery = QuerySchema.parse({
        text: query,
        expectedResponse: "Respuesta esperada del sistema",
      });

      setLoading(true);
      const result = await fetch("/api/test-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: validatedQuery.text }),
      });

      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }

      const data = await result.json();

      // Validar respuesta
      const validatedResponse = ResponseSchema.parse({
        response: data.response || "Sin respuesta",
        reasoning: data.reasoning,
      });

      setResponse(validatedResponse.response);

      // Calcular métricas
      const metrics = {
        structure_score: calculateStructureScore(validatedResponse.response),
        keyword_score: calculateKeywordScore(
          validatedQuery.text,
          validatedResponse.response
        ),
        clarification_score: calculateClarificationScore(
          validatedQuery.text,
          validatedResponse.response
        ),
        length_score: calculateLengthScore(validatedResponse.response),
        empathy_score: calculateEmpathyScore(validatedResponse.response),
        overall_score: 0,
      };

      metrics.overall_score = calculateOverallScore(metrics);

      const testResult: TestResult = {
        query: validatedQuery.text,
        response: validatedResponse.response,
        metrics,
        timestamp: new Date().toISOString(),
      };

      setResults((prev) => [...prev, testResult]);
      onTestComplete?.(testResult);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
        alert(
          "Error de validación: " +
            error.errors.map((e) => e.message).join(", ")
        );
      } else {
        console.error("Error:", error);
        alert("Error al procesar la consulta");
      }
    } finally {
      setLoading(false);
    }
  };

  const runBatchTest = async () => {
    if (runningBatch && !batchPaused) {
      setBatchPaused(true);
      return;
    }

    if (batchPaused) {
      setBatchPaused(false);
      return;
    }

    setRunningBatch(true);
    setBatchPaused(false);
    setCurrentBatchIndex(0);

    for (let i = currentBatchIndex; i < testDataset.length; i++) {
      if (batchPaused) {
        setCurrentBatchIndex(i);
        break;
      }

      const testCase = testDataset[i];
      setQuery(testCase.query);
      setCurrentBatchIndex(i + 1);

      try {
        setLoading(true);
        const result = await fetch("/api/test-prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: testCase.query }),
        });

        if (!result.ok) continue;

        const data = await result.json();
        const validatedResponse = ResponseSchema.parse({
          response: data.response || "Sin respuesta",
          reasoning: data.reasoning,
        });

        setResponse(validatedResponse.response);

        const metrics = {
          structure_score: calculateStructureScore(validatedResponse.response),
          keyword_score: calculateKeywordScore(
            testCase.query,
            validatedResponse.response
          ),
          clarification_score: calculateClarificationScore(
            testCase.query,
            validatedResponse.response
          ),
          length_score: calculateLengthScore(validatedResponse.response),
          empathy_score: calculateEmpathyScore(validatedResponse.response),
          overall_score: 0,
        };

        metrics.overall_score = calculateOverallScore(metrics);

        const testResult: TestResult = {
          query: testCase.query,
          response: validatedResponse.response,
          metrics,
          timestamp: new Date().toISOString(),
        };

        setResults((prev) => [...prev, testResult]);
        onTestComplete?.(testResult);

        // Pausa entre requests
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error in batch test:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!batchPaused) {
      setRunningBatch(false);
      setCurrentBatchIndex(0);
    }
  };

  const stopBatchTest = () => {
    setRunningBatch(false);
    setBatchPaused(false);
    setCurrentBatchIndex(0);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Probador en Vivo
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Consulta del Cliente
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
            placeholder="Escribe tu consulta aquí..."
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={validateAndSubmit}
            disabled={loading || !query.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Procesando..." : "Probar Consulta"}
          </button>

          <button
            onClick={runBatchTest}
            disabled={loading && !runningBatch}
            className={`px-6 py-2 rounded-lg text-white ${
              runningBatch && !batchPaused
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-green-600 hover:bg-green-700"
            } disabled:opacity-50`}
          >
            {runningBatch && !batchPaused
              ? `Pausar (${currentBatchIndex}/${testDataset.length})`
              : batchPaused
              ? `Continuar (${currentBatchIndex}/${testDataset.length})`
              : "Ejecutar Dataset Completo"}
          </button>

          {runningBatch && (
            <button
              onClick={stopBatchTest}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Detener
            </button>
          )}
        </div>

        {response && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Respuesta del Sistema
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg border min-h-[200px] max-h-[400px] overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {response}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Dataset de Evaluación y Métricas
            </h3>
            <button
              onClick={() => setShowDataset(!showDataset)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {showDataset ? "Ocultar Dataset" : "Ver Dataset Completo"}
            </button>
          </div>

          <p className="text-gray-600 mb-4">
            {testDataset.length} casos de prueba que cubren los principales
            escenarios de consultas en una fintech. Cada caso incluye métricas
            de evaluación calculadas automáticamente.
          </p>

          {showDataset && (
            <div className="bg-gray-50 p-4 rounded-lg border max-h-[300px] overflow-y-auto">
              <div className="grid gap-3">
                {testDataset.map((item, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="font-medium text-gray-800 mb-1">
                      {index + 1}. {item.query}
                    </div>
                    <div className="text-sm text-gray-600">
                      Respuesta esperada:{" "}
                      {item.expectedResponse.substring(0, 100)}...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Resultados de Pruebas ({results.length})
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="font-medium text-gray-800 mb-2">
                    {result.query}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      Estructura:{" "}
                      {(result.metrics.structure_score * 100).toFixed(1)}%
                    </div>
                    <div>
                      Palabras clave:{" "}
                      {(result.metrics.keyword_score * 100).toFixed(1)}%
                    </div>
                    <div>
                      Claridad:{" "}
                      {(result.metrics.clarification_score * 100).toFixed(1)}%
                    </div>
                    <div>
                      Longitud: {(result.metrics.length_score * 100).toFixed(1)}
                      %
                    </div>
                    <div>
                      Empatía: {(result.metrics.empathy_score * 100).toFixed(1)}
                      %
                    </div>
                    <div className="font-semibold">
                      General: {(result.metrics.overall_score * 100).toFixed(1)}
                      %
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
