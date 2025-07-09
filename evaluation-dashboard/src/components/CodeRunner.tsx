"use client";

import { useState } from "react";
import { z } from "zod";

// Reutilizar los mismos esquemas y patrones del LiveTester
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

// Importar las mismas funciones auxiliares del LiveTester
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

// Funciones auxiliares compartidas - métrica híbrida
function detectIntent(query: string): string {
  const lowerQuery = query.toLowerCase();

  if (
    AMBIGUOUS_PATTERNS.some((pattern) => lowerQuery.includes(pattern)) ||
    GENERIC_QUESTION_STARTERS.some((starter) => lowerQuery.startsWith(starter))
  ) {
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

interface CodeRunnerProps {
  onResultsChange?: (results: EvaluationResult[]) => void;
}

interface EvaluationResult {
  query: string;
  response: string;
  expected_response: string;
  metrics: {
    structure_score: number;
    keyword_score: number;
    clarification_score: number;
    length_score: number;
    empathy_score: number;
    overall_score: number;
  };
  intent: string;
}

export default function CodeRunner({ onResultsChange }: CodeRunnerProps) {
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const evaluationDataset = [
    {
      query: "¿Cuál es mi saldo actual?",
      expected_response:
        "Para consultar tu saldo actual, puedes acceder a tu cuenta...",
      metrics: {
        structure_score: 0.75,
        keyword_score: 0.8,
        clarification_score: 0.7,
        length_score: 0.85,
        empathy_score: 0.65,
      },
    },
    {
      query: "¿Cómo solicito una tarjeta de crédito?",
      expected_response: "Para solicitar una tarjeta de crédito necesitas...",
      metrics: {
        structure_score: 0.8,
        keyword_score: 0.85,
        clarification_score: 0.75,
        length_score: 0.9,
        empathy_score: 0.7,
      },
    },
    {
      query: "Mi tarjeta está bloqueada, ¿qué hago?",
      expected_response:
        "Si tu tarjeta está bloqueada, puedes desbloquearla...",
      metrics: {
        structure_score: 0.7,
        keyword_score: 0.75,
        clarification_score: 0.8,
        length_score: 0.75,
        empathy_score: 0.85,
      },
    },
    {
      query: "¿Cuáles son las tasas de interés para préstamos?",
      expected_response: "Nuestras tasas de interés para préstamos varían...",
      metrics: {
        structure_score: 0.65,
        keyword_score: 0.7,
        clarification_score: 0.75,
        length_score: 0.8,
        empathy_score: 0.6,
      },
    },
    {
      query: "¿Cómo cambio mi PIN?",
      expected_response: "Para cambiar tu PIN puedes hacerlo...",
      metrics: {
        structure_score: 0.75,
        keyword_score: 0.85,
        clarification_score: 0.7,
        length_score: 0.7,
        empathy_score: 0.65,
      },
    },
    {
      query: "¿Qué documentos necesito para abrir una cuenta?",
      expected_response: "Para abrir una cuenta necesitas presentar...",
      metrics: {
        structure_score: 0.8,
        keyword_score: 0.75,
        clarification_score: 0.85,
        length_score: 0.85,
        empathy_score: 0.7,
      },
    },
    {
      query: "¿Cuál es el límite de mi tarjeta?",
      expected_response: "Tu límite de tarjeta actual es...",
      metrics: {
        structure_score: 0.7,
        keyword_score: 0.8,
        clarification_score: 0.65,
        length_score: 0.75,
        empathy_score: 0.6,
      },
    },
    {
      query: "¿Cómo puedo aumentar mi límite de crédito?",
      expected_response: "Para aumentar tu límite de crédito necesitas...",
      metrics: {
        structure_score: 0.75,
        keyword_score: 0.75,
        clarification_score: 0.8,
        length_score: 0.8,
        empathy_score: 0.7,
      },
    },
    {
      query: "¿Dónde puedo ver mis movimientos?",
      expected_response: "Puedes consultar tus movimientos en...",
      metrics: {
        structure_score: 0.7,
        keyword_score: 0.85,
        clarification_score: 0.75,
        length_score: 0.75,
        empathy_score: 0.65,
      },
    },
    {
      query: "Tengo un problema con una transacción",
      expected_response:
        "Lamento escuchar sobre el problema con tu transacción...",
      metrics: {
        structure_score: 0.8,
        keyword_score: 0.7,
        clarification_score: 0.85,
        length_score: 0.85,
        empathy_score: 0.9,
      },
    },
  ];

  const runEvaluation = async () => {
    setLoading(true);
    const evaluationResults = [];

    for (const testCase of evaluationDataset) {
      try {
        // Validar entrada
        const validatedQuery = QuerySchema.parse({
          text: testCase.query,
          expectedResponse: testCase.expected_response,
        });

        // Simular respuesta (en lugar de llamar a la API)
        const simulatedResponse = testCase.expected_response;

        // Validar respuesta
        const validatedResponse = ResponseSchema.parse({
          response: simulatedResponse,
          reasoning: "Respuesta simulada para evaluación",
        });

        // Calcular métricas usando las funciones auxiliares
        const calculatedMetrics = {
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

        calculatedMetrics.overall_score =
          calculateOverallScore(calculatedMetrics);

        evaluationResults.push({
          query: validatedQuery.text,
          response: validatedResponse.response,
          expected_response: testCase.expected_response,
          metrics: calculatedMetrics,
          intent: detectIntent(validatedQuery.text),
        });
      } catch (error) {
        console.error("Error evaluating test case:", error);
        // Continuar con el siguiente caso en caso de error
      }
    }

    setResults(evaluationResults);
    onResultsChange?.(evaluationResults);
    setLoading(false);
  };

  const codeExample = `
# Sistema de Evaluación de Métricas para Chatbot Fintech
# Usando validaciones con Zod y patrones estructurados

from zod import z
import re

# Esquemas de validación
QuerySchema = z.object({
    'text': z.string().min(1, "La consulta no puede estar vacía"),
    'intent': z.enum([
        'consultar_saldo', 'consultar_tarjeta', 'solicitar_tarjeta',
        'consultar_prestamo', 'solicitar_prestamo', 'bloquear_tarjeta',
        'desbloquear_tarjeta', 'consultar_movimientos', 'cambiar_pin',
        'consultar_limite', 'aumentar_limite', 'consultar_estado_cuenta',
        'reportar_problema', 'consultar_politicas', 'ambigua'
    ]).optional(),
    'expectedResponse': z.string().min(1, "La respuesta esperada no puede estar vacía")
})

# Configuración de patrones de intención
INTENT_PATTERNS = {
    'consultar_saldo': {
        'keywords': ['saldo', 'dinero', 'plata', 'cuenta', 'disponible'],
        'expectedResponse': re.compile(r'saldo|dinero|disponible|cuenta', re.IGNORECASE)
    },
    'solicitar_tarjeta': {
        'keywords': ['solicitar', 'pedir', 'nueva', 'tarjeta'],
        'expectedResponse': re.compile(r'solicitud|proceso|documentos|requisitos', re.IGNORECASE),
        'requiresMultiple': True
    },
    # ... más patrones
}

def detect_intent(query: str) -> str:
    """Detecta la intención usando patrones estructurados"""
    lower_query = query.lower()
    
    # Verificar patrones ambiguos
    ambiguous_patterns = ['que', 'como', 'donde', 'cuando', 'ayuda', 'hola', 'info']
    if any(pattern in lower_query for pattern in ambiguous_patterns):
        return 'ambigua'
    
    # Buscar intención específica
    for intent, pattern in INTENT_PATTERNS.items():
        matched_keywords = [kw for kw in pattern['keywords'] if kw in lower_query]
        
        if pattern.get('requiresMultiple', False) and len(matched_keywords) >= 2:
            return intent
        elif not pattern.get('requiresMultiple', False) and matched_keywords:
            return intent
    
    return 'consulta_general'

def calculate_structure_score(response: str) -> float:
    """Calcula puntuación de estructura"""
    has_greeting = bool(re.search(r'hola|buenos|buenas|saludos', response, re.IGNORECASE))
    has_closing = bool(re.search(r'gracias|ayuda|consulta|disponible', response, re.IGNORECASE))
    has_structure = '\\n' in response or '.' in response
    
    score = 0
    if has_greeting: score += 0.3
    if has_closing: score += 0.3
    if has_structure: score += 0.4
    
    return min(score, 1.0)

def calculate_keyword_score(query: str, response: str) -> float:
    """Calcula puntuación de palabras clave"""
    intent = detect_intent(query)
    pattern = INTENT_PATTERNS.get(intent)
    
    if not pattern:
        return 0.5
    
    response_text = response.lower()
    matched_keywords = [kw for kw in pattern['keywords'] if kw in response_text]
    
    return min(len(matched_keywords) / len(pattern['keywords']), 1.0)

def calculate_overall_score(metrics: dict) -> float:
    """Calcula puntuación general con pesos"""
    weights = {
        'structure_score': 0.30,
        'keyword_score': 0.25,
        'clarification_score': 0.20,
        'length_score': 0.10,
        'empathy_score': 0.15
    }
    
    return sum(metrics[key] * weight for key, weight in weights.items())

# Ejemplo de uso
def evaluate_response(query: str, response: str) -> dict:
    """Evalúa una respuesta usando todas las métricas"""
    try:
        # Validar entrada
        validated_query = QuerySchema.parse({
            'text': query,
            'expectedResponse': "Respuesta esperada del sistema"
        })
        
        # Calcular métricas
        metrics = {
            'structure_score': calculate_structure_score(response),
            'keyword_score': calculate_keyword_score(query, response),
            'clarification_score': calculate_clarification_score(query, response),
            'length_score': calculate_length_score(response),
            'empathy_score': calculate_empathy_score(response),
        }
        
        metrics['overall_score'] = calculate_overall_score(metrics)
        
        return {
            'query': validated_query['text'],
            'response': response,
            'metrics': metrics,
            'intent': detect_intent(query),
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"Error de validación: {e}")
        return None
  `;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Evaluación Automatizada
      </h2>

      <div className="mb-6">
        <button
          onClick={runEvaluation}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed mr-4"
        >
          {loading ? "Ejecutando..." : "Ejecutar Evaluación"}
        </button>

        <button
          onClick={() => setShowCode(!showCode)}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
        >
          {showCode ? "Ocultar Código" : "Ver Código"}
        </button>
      </div>

      {showCode && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Código de Evaluación
          </h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm whitespace-pre-wrap">{codeExample}</pre>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Resultados de Evaluación ({results.length} casos)
          </h3>

          <div className="grid gap-4">
            {results.map((result, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                <div className="mb-2">
                  <div className="font-medium text-gray-800">
                    {result.query}
                  </div>
                  <div className="text-sm text-gray-600">
                    Intención: {result.intent}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm mb-2">
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
                    Longitud: {(result.metrics.length_score * 100).toFixed(1)}%
                  </div>
                  <div>
                    Empatía: {(result.metrics.empathy_score * 100).toFixed(1)}%
                  </div>
                  <div className="font-semibold">
                    General: {(result.metrics.overall_score * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="text-sm text-gray-600 mt-2">
                  <strong>Respuesta:</strong>{" "}
                  {result.response.substring(0, 200)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
