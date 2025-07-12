"use client";

import { useState } from "react";

export default function LiveTester() {
  const [query, setQuery] = useState("");
  const [originalResponse, setOriginalResponse] = useState("");
  const [ragResponse, setRAGResponse] = useState("");
  const [ragMetadata, setRAGMetadata] = useState<{
    strategy: string;
    reason: string;
    confidence: number;
    triggers?: string[];
    docsUsed?: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState({ original: 0, rag: 0 });

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case "rag_success":
        return "bg-green-100 text-green-800 border-green-300";
      case "fallback_to_original":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "escalate_to_human":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStrategyIcon = (strategy: string) => {
    switch (strategy) {
      case "rag_success":
        return "🧠";
      case "fallback_to_original":
        return "🔄";
      case "escalate_to_human":
        return "🤝";
      default:
        return "❓";
    }
  };

  const getStrategyTitle = (strategy: string) => {
    switch (strategy) {
      case "rag_success":
        return "RAG Exitoso";
      case "fallback_to_original":
        return "Fallback Automático";
      case "escalate_to_human":
        return "Escalamiento Humano";
      default:
        return "Estrategia Desconocida";
    }
  };

  const testPrompts = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      // Test sistema original
      const originalStart = Date.now();
      const originalRes = await fetch("/api/test-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const originalData = await originalRes.json();
      const originalTime = Date.now() - originalStart;

      // Test sistema RAG
      const ragStart = Date.now();
      const ragRes = await fetch("/api/test-prompt-rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const ragData = await ragRes.json();
      const ragTime = Date.now() - ragStart;

      setOriginalResponse(originalData.response);
      setRAGResponse(ragData.response);
      setRAGMetadata(ragData.metadata);
      setResponseTime({ original: originalTime, rag: ragTime });
    } catch (error) {
      console.error("Error testing prompts:", error);
      setOriginalResponse("Error al obtener respuesta");
      setRAGResponse("Error al obtener respuesta");
    } finally {
      setLoading(false);
    }
  };

  // Determinar cuál es la respuesta final que vería el usuario
  const getFinalResponse = () => {
    if (!ragMetadata) return ragResponse;

    switch (ragMetadata.strategy) {
      case "rag_success":
        return ragResponse;
      case "fallback_to_original":
        return originalResponse;
      case "escalate_to_human":
        return ragResponse; // La respuesta de escalamiento
      default:
        return ragResponse;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-xl font-bold text-black mb-4">
        🧪 Probador en Tiempo Real - Sistema Inteligente
      </h3>
      <p className="text-gray-600 mb-6">
        Compara el sistema original con el nuevo sistema RAG inteligente que
        incluye fallback automático y escalamiento.
      </p>

      <div className="space-y-6">
        {/* Input de consulta */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Escribe tu consulta (ej: ¿Cuál es la tasa para préstamo hipotecario?)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 p-3 border rounded-lg"
            onKeyPress={(e) => e.key === "Enter" && testPrompts()}
          />
          <button
            onClick={testPrompts}
            disabled={loading || !query.trim()}
            className={`px-6 py-3 rounded-lg font-medium ${
              loading || !query.trim()
                ? "bg-gray-300 text-gray-500"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "🔄 Probando..." : "🚀 Comparar"}
          </button>
        </div>

        {/* Ejemplos rápidos */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <h5 className="font-semibold text-green-800 text-sm mb-2">
              🧠 RAG Exitoso
            </h5>
            <button
              onClick={() =>
                setQuery("¿Cuál es la tasa para préstamo hipotecario?")
              }
              className="text-xs text-green-700 hover:underline"
            >
              &quot;¿Cuál es la tasa para préstamo hipotecario?&quot;
            </button>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <h5 className="font-semibold text-yellow-800 text-sm mb-2">
              🔄 Fallback
            </h5>
            <button
              onClick={() => setQuery("¿qué puedes hacer?")}
              className="text-xs text-yellow-700 hover:underline"
            >
              &quot;¿qué puedes hacer?&quot;
            </button>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <h5 className="font-semibold text-red-800 text-sm mb-2">
              🤝 Escalamiento
            </h5>
            <button
              onClick={() => setQuery("MI CUENTA FUE HACKEADA!! URGENTE")}
              className="text-xs text-red-700 hover:underline"
            >
              &quot;MI CUENTA FUE HACKEADA!! URGENTE&quot;
            </button>
          </div>
        </div>

        {/* Resultados */}
        {originalResponse && ragResponse && (
          <div className="space-y-6">
            {/* Decisión del Sistema Inteligente */}
            {ragMetadata && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
                <h4 className="font-bold text-gray-800 mb-4">
                  🎯 Decisión del Sistema Inteligente
                </h4>

                <div
                  className={`p-4 rounded-lg border-2 ${getStrategyColor(
                    ragMetadata.strategy
                  )}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">
                      {getStrategyIcon(ragMetadata.strategy)}
                    </div>
                    <div>
                      <h5 className="font-bold text-lg">
                        {getStrategyTitle(ragMetadata.strategy)}
                      </h5>
                      <p className="text-sm opacity-80">{ragMetadata.reason}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Confianza:</span>
                      <div className="text-lg font-bold">
                        {(ragMetadata.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold">Docs Usados:</span>
                      <div className="text-lg font-bold">
                        {ragMetadata.docsUsed || 0}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold">Triggers:</span>
                      <div className="text-sm">
                        {ragMetadata.triggers?.join(", ") || "ninguno"}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold">Tiempo:</span>
                      <div className="text-lg font-bold">
                        {responseTime.rag}ms
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comparación de Respuestas */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Sistema Original */}
              <div className="bg-gray-50 p-6 rounded-lg border">
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="font-bold text-gray-800">
                    ❌ Sistema Original
                  </h4>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                    {responseTime.original}ms
                  </span>
                </div>
                <div className="bg-white p-4 rounded border max-h-64 overflow-y-auto">
                  <div className="prose max-w-none text-sm">
                    {originalResponse.split("\n").map((line, idx) => (
                      <p key={idx} className="mb-2 last:mb-0">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sistema RAG */}
              <div className="bg-blue-50 p-6 rounded-lg border">
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="font-bold text-blue-800">
                    {ragMetadata?.strategy === "rag_success"
                      ? "🧠"
                      : ragMetadata?.strategy === "fallback_to_original"
                      ? "🔄"
                      : ragMetadata?.strategy === "escalate_to_human"
                      ? "🤝"
                      : "✅"}
                    Sistema con RAG
                  </h4>
                  <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded">
                    {responseTime.rag}ms
                  </span>
                  {ragMetadata && (
                    <span
                      className={`text-xs px-2 py-1 rounded ${getStrategyColor(
                        ragMetadata.strategy
                      )}`}
                    >
                      {getStrategyIcon(ragMetadata.strategy)}{" "}
                      {getStrategyTitle(ragMetadata.strategy)}
                    </span>
                  )}
                </div>
                <div className="bg-white p-4 rounded border max-h-64 overflow-y-auto">
                  <div className="prose max-w-none text-sm">
                    {ragResponse.split("\n").map((line, idx) => (
                      <p key={idx} className="mb-2 last:mb-0">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Respuesta Final al Usuario */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-4">
                💬 Respuesta Final que Recibe el Usuario
                {ragMetadata && (
                  <span className="ml-2 text-sm font-normal">
                    (Generada por: {getStrategyTitle(ragMetadata.strategy)})
                  </span>
                )}
              </h4>
              <div className="bg-white p-4 rounded border">
                <div className="prose max-w-none">
                  {getFinalResponse()
                    .split("\n")
                    .map((line, idx) => (
                      <p key={idx} className="mb-2 last:mb-0">
                        {line}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            {/* Métricas de Rendimiento */}
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-bold text-gray-800 mb-4">
                📊 Métricas de Rendimiento
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {responseTime.original}ms
                  </div>
                  <div className="text-sm text-gray-600">Sistema Original</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {responseTime.rag}ms
                  </div>
                  <div className="text-sm text-gray-600">Sistema RAG</div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      responseTime.rag < responseTime.original
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {responseTime.rag < responseTime.original ? "🚀" : "⚠️"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {responseTime.rag < responseTime.original
                      ? "RAG más rápido"
                      : "Original más rápido"}
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
