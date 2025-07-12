"use client";

import { useState, useEffect } from "react";

interface KnowledgeDocument {
  id: string;
  content: string;
  metadata: {
    type: "producto" | "regulacion" | "contexto" | "promocion";
    category: string;
    updated: string;
    source: string;
    tags: string[];
    active: boolean;
  };
  embedding?: number[];
}

interface RAGDecision {
  strategy: "rag_success" | "fallback_to_original" | "escalate_to_human";
  reason: string;
  confidence: number;
  triggers: string[];
}

interface RAGTestResult {
  query: string;
  originalResponse: string;
  ragResponse: string;
  finalResponse: string;
  retrievedDocs: KnowledgeDocument[];
  decision: RAGDecision;
  responseTime: {
    original: number;
    rag: number;
    total: number;
  };
  timestamp: string;
}

interface RAGStats {
  totalDocuments: number;
  activeDocuments: number;
  lastIndexed: string;
  searchesPer24h: number;
  avgConfidence: number;
  successRate: number;
  fallbackRate: number;
  escalationRate: number;
}

export default function RAGManager() {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeDocument[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "knowledge" | "test" | "results" | "analytics"
  >("overview");

  // Estados para edición de documentos
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingDoc, setEditingDoc] = useState<any>({});
  const [isReindexing, setIsReindexing] = useState<string | null>(null);

  // Estados para pruebas RAG
  const [testQuery, setTestQuery] = useState("");
  const [isTestingRAG, setIsTestingRAG] = useState(false);
  const [testResults, setTestResults] = useState<RAGTestResult[]>([]);

  // Estados para estadísticas
  const [ragStats, setRAGStats] = useState<RAGStats>({
    totalDocuments: 0,
    activeDocuments: 0,
    lastIndexed: new Date().toISOString(),
    searchesPer24h: 0,
    avgConfidence: 0.0,
    successRate: 0.0,
    fallbackRate: 0.0,
    escalationRate: 0.0,
  });

  // Datos iniciales de la base de conocimiento
  useEffect(() => {
    // Intentar cargar desde localStorage primero
    const savedKnowledgeBase = localStorage.getItem("ragKnowledgeBase");

    let initialKnowledge: KnowledgeDocument[];

    if (savedKnowledgeBase) {
      // Si hay datos guardados, usarlos
      try {
        initialKnowledge = JSON.parse(savedKnowledgeBase);
      } catch (error) {
        console.error("Error parsing saved knowledge base:", error);
        // Si hay error, usar datos por defecto
        initialKnowledge = getDefaultKnowledgeBase();
      }
    } else {
      // Si no hay datos guardados, usar datos por defecto
      initialKnowledge = getDefaultKnowledgeBase();
    }

    setKnowledgeBase(initialKnowledge);
    updateRAGStats(initialKnowledge);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para obtener la base de conocimiento por defecto
  const getDefaultKnowledgeBase = (): KnowledgeDocument[] => [
    {
      id: "prestamo-hipotecario-2025",
      content:
        "Préstamos hipotecarios FinTechPro 2025: Tasa 8.5% anual fija, plazo hasta 25 años, monto hasta ₲2.500.000.000. Requisitos: ingresos mínimos ₲8.000.000 mensuales, antigüedad laboral 2+ años, garantía hipotecaria sobre inmueble. Cumple normativas ANAC Paraguay. Promoción enero 2025: sin gastos de escrituración hasta 31 marzo 2025.",
      metadata: {
        type: "producto",
        category: "prestamos",
        updated: "2025-01-15",
        source: "productos-financieros-2025.pdf",
        tags: ["hipotecario", "vivienda", "tasa", "2025"],
        active: true,
      },
    },
    {
      id: "documentacion-mercosur",
      content:
        "Decreto 2024-156 Paraguay: Cédula MERCOSUR válida para operaciones financieras desde agosto 2024. Reconocimiento automático en sistema bancario paraguayo. Requisitos adicionales: fotografía vigente y comprobante de domicilio en Paraguay. Aplicable a préstamos, tarjetas de crédito e inversiones. Vigente para todos los países MERCOSUR (Argentina, Brasil, Uruguay, Paraguay).",
      metadata: {
        type: "regulacion",
        category: "documentacion",
        updated: "2024-08-15",
        source: "anac-paraguay-normativas.pdf",
        tags: ["mercosur", "cedula", "documentacion", "decreto"],
        active: true,
      },
    },
    {
      id: "contexto-guarani-financiero",
      content:
        "Términos financieros en guaraní: jajajára (préstamo), viru (dinero), ñembyaty (ahorro), ñemuhã (invertir). Fechas importantes Paraguay: 15 mayo (Día de la Independencia) promociones especiales, diciembre (aguinaldo) productos estacionales. Cultura familiar paraguaya: decisiones financieras importantes incluyen consulta familiar, especialmente personas mayores.",
      metadata: {
        type: "contexto",
        category: "cultural",
        updated: "2025-01-10",
        source: "contexto-cultural-paraguay.json",
        tags: ["guarani", "cultura", "familia", "tradiciones"],
        active: true,
      },
    },
    {
      id: "tarjeta-credito-gold-promo",
      content:
        "Tarjeta Crédito Gold enero 2025: Promoción especial sin cuota de manejo primeros 6 meses (ahorro ₲750.000). Cashback 2% en todas las compras, límite hasta ₲45.000.000. Requisitos: ingresos ₲6.000.000+ mensuales, scoring crediticio bueno. Beneficios adicionales: seguro de viaje internacional, acceso VIP aeropuerto Silvio Pettirossi, protección de compras. Promoción válida hasta 31 marzo 2025.",
      metadata: {
        type: "promocion",
        category: "tarjetas",
        updated: "2025-01-15",
        source: "promociones-enero-2025.pdf",
        tags: ["gold", "promocion", "cashback", "aeropuerto"],
        active: true,
      },
    },
    {
      id: "tipos-cambio-enero-2025",
      content:
        "Tipos de cambio FinTechPro enero 2025: USD/PYG 7.350 (compra) / 7.380 (venta). EUR/PYG 8.100 (compra) / 8.140 (venta). ARS/PYG 7.20 (compra) / 7.35 (venta). BRL/PYG 1.235 (compra) / 1.255 (venta). Actualización automática cada 30 minutos durante horario bancario. Comisión por cambio: 0.5% para clientes premium, 1.2% para clientes estándar.",
      metadata: {
        type: "contexto",
        category: "cambio",
        updated: "2025-01-15",
        source: "tipos-cambio-tiempo-real.api",
        tags: ["usd", "eur", "ars", "brl", "cambio"],
        active: true,
      },
    },
  ];

  // Función para guardar en localStorage
  const saveKnowledgeBaseToStorage = (knowledgeBase: KnowledgeDocument[]) => {
    try {
      localStorage.setItem("ragKnowledgeBase", JSON.stringify(knowledgeBase));
    } catch (error) {
      console.error("Error saving knowledge base to localStorage:", error);
    }
  };

  const updateRAGStats = (
    docs: KnowledgeDocument[],
    customResults?: RAGTestResult[]
  ) => {
    const activeDocs = docs.filter((doc) => doc.metadata.active);
    const resultsToUse = customResults || testResults;

    // Calcular métricas de rendimiento
    const totalTests = resultsToUse.length;
    const successCount = resultsToUse.filter(
      (r) => r.decision.strategy === "rag_success"
    ).length;
    const fallbackCount = resultsToUse.filter(
      (r) => r.decision.strategy === "fallback_to_original"
    ).length;
    const escalationCount = resultsToUse.filter(
      (r) => r.decision.strategy === "escalate_to_human"
    ).length;

    setRAGStats({
      totalDocuments: docs.length,
      activeDocuments: activeDocs.length,
      lastIndexed: new Date().toISOString(),
      searchesPer24h: totalTests,
      avgConfidence:
        resultsToUse.length > 0
          ? resultsToUse.reduce(
              (sum, result) => sum + result.decision.confidence,
              0
            ) / resultsToUse.length
          : 0,
      successRate: totalTests > 0 ? (successCount / totalTests) * 100 : 0,
      fallbackRate: totalTests > 0 ? (fallbackCount / totalTests) * 100 : 0,
      escalationRate: totalTests > 0 ? (escalationCount / totalTests) * 100 : 0,
    });
  };

  const startEditingDocument = (doc: KnowledgeDocument) => {
    setEditingDocId(doc.id);
    setEditingDoc({
      ...doc,
      metadata: {
        ...doc.metadata,
        tags: doc.metadata.tags, // Mantener como array para edición
      },
    });
  };

  const cancelEditingDocument = () => {
    setEditingDocId(null);
    setEditingDoc({});
  };

  const saveEditedDocument = async () => {
    if (!editingDocId || !editingDoc.content?.trim()) return;

    setIsReindexing(editingDocId);

    // Simular reindexación (en producción sería llamada a API de embeddings)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const updatedKnowledge = knowledgeBase.map((doc) => {
      if (doc.id === editingDocId) {
        return {
          ...doc,
          content: editingDoc.content!.trim(),
          metadata: {
            ...editingDoc.metadata!,
            updated: new Date().toISOString(),
            tags:
              typeof editingDoc.metadata?.tags === "string"
                ? (editingDoc.metadata.tags as string)
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0)
                : (editingDoc.metadata?.tags as string[]) || [],
          },
        };
      }
      return doc;
    });

    setKnowledgeBase(updatedKnowledge);
    updateRAGStats(updatedKnowledge);
    setEditingDocId(null);
    setEditingDoc({});
    setIsReindexing(null);
    saveKnowledgeBaseToStorage(updatedKnowledge); // Guardar en localStorage
  };

  const toggleDocumentStatus = (docId: string) => {
    const updated = knowledgeBase.map((doc) =>
      doc.id === docId
        ? {
            ...doc,
            metadata: { ...doc.metadata, active: !doc.metadata.active },
          }
        : doc
    );
    setKnowledgeBase(updated);
    updateRAGStats(updated);
    saveKnowledgeBaseToStorage(updated); // Guardar en localStorage
  };

  const deleteDocument = (docId: string) => {
    const updated = knowledgeBase.filter((doc) => doc.id !== docId);
    setKnowledgeBase(updated);
    updateRAGStats(updated);
    saveKnowledgeBaseToStorage(updated); // Guardar en localStorage
  };

  const searchKnowledgeBase = (
    query: string
  ): { docs: KnowledgeDocument[]; confidence: number } => {
    const queryLower = query.toLowerCase();
    const activeDocs = knowledgeBase.filter((doc) => doc.metadata.active);

    const docsWithRelevance = activeDocs
      .map((doc) => ({
        doc,
        relevance: calculateRelevance(queryLower, doc),
      }))
      .filter(({ relevance }) => relevance > 0.3)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 3);

    const docs = docsWithRelevance.map(({ doc }) => doc);
    const avgRelevance =
      docsWithRelevance.length > 0
        ? docsWithRelevance.reduce((sum, { relevance }) => sum + relevance, 0) /
          docsWithRelevance.length
        : 0;

    return {
      docs,
      confidence: Math.min(avgRelevance * 1.2, 1.0),
    };
  };

  const calculateRelevance = (
    query: string,
    doc: KnowledgeDocument
  ): number => {
    let score = 0;

    const contentWords = doc.content.toLowerCase().split(" ");
    const queryWords = query.split(" ");

    queryWords.forEach((word) => {
      if (contentWords.includes(word)) {
        score += 0.2;
      }
    });

    // Relevancia por tags
    doc.metadata.tags.forEach((tag) => {
      if (query.includes(tag.toLowerCase())) {
        score += 0.3;
      }
    });

    // Relevancia por tipo
    if (query.includes("prestamo") && doc.metadata.category === "prestamos") {
      score += 0.4;
    }
    if (query.includes("tarjeta") && doc.metadata.category === "tarjetas") {
      score += 0.4;
    }
    if (
      query.includes("mercosur") &&
      doc.metadata.category === "documentacion"
    ) {
      score += 0.4;
    }

    // Bonus por información reciente
    const docDate = new Date(doc.metadata.updated);
    const now = new Date();
    const daysDiff =
      (now.getTime() - docDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff < 30) score += 0.1;
    if (daysDiff < 7) score += 0.1;

    return Math.min(score, 1.0);
  };

  const makeRAGDecision = (
    query: string,
    ragConfidence: number,
    docsCount: number
  ): RAGDecision => {
    const triggers: string[] = [];
    let strategy: RAGDecision["strategy"] = "rag_success";
    let reason = "";

    // Detectar casos que requieren escalamiento a humano
    const shouldEscalateToHuman = () => {
      // Información sensible
      if (
        /\b\d{4,}\b/.test(query) &&
        (query.includes("cuenta") ||
          query.includes("clave") ||
          query.includes("pin"))
      ) {
        triggers.push("informacion_sensible");
        return true;
      }

      // Emociones fuertes
      if (
        /urgente|emergency|problema|error|reclamo|denuncia/i.test(query) &&
        /!{2,}|MAYUS{3,}/.test(query)
      ) {
        triggers.push("crisis_emocional");
        return true;
      }

      // Consultas muy complejas
      if (
        query.split(" ").length > 15 &&
        query.includes("y") &&
        query.includes("pero")
      ) {
        triggers.push("consulta_compleja");
        return true;
      }

      // Servicios no disponibles
      if (
        /seguro|inversion|credito hipotecario|tarjeta empresarial/i.test(
          query
        ) &&
        ragConfidence < 0.3
      ) {
        triggers.push("servicio_no_disponible");
        return true;
      }

      return false;
    };

    // Lógica de decisión
    if (shouldEscalateToHuman()) {
      strategy = "escalate_to_human";
      reason = "Consulta requiere atención humana especializada";
    } else if (ragConfidence < 0.6 || docsCount === 0) {
      strategy = "fallback_to_original";
      reason =
        ragConfidence < 0.6
          ? "Confianza insuficiente en RAG, usando sistema original"
          : "No se encontraron documentos relevantes";
      triggers.push("baja_confianza");
    } else {
      strategy = "rag_success";
      reason = "RAG encontró información relevante con alta confianza";
      triggers.push("alta_confianza");
    }

    return {
      strategy,
      reason,
      confidence: ragConfidence,
      triggers,
    };
  };

  const testRAGComparison = async () => {
    if (!testQuery.trim()) return;

    setIsTestingRAG(true);
    const totalStartTime = Date.now();

    try {
      // 1. Búsqueda RAG
      const ragSearchResult = searchKnowledgeBase(testQuery);
      const relevantDocs = ragSearchResult.docs;
      const ragConfidence = ragSearchResult.confidence;

      // 2. Decisión inteligente
      const decision = makeRAGDecision(
        testQuery,
        ragConfidence,
        relevantDocs.length
      );

      // 3. Llamada al sistema original
      const originalStartTime = Date.now();
      const originalResponse = await fetch("/api/test-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: testQuery }),
      });
      const originalData = await originalResponse.json();
      const originalTime = Date.now() - originalStartTime;

      let finalResponse = "";
      let ragResponseText = "";
      let ragTime = 0;

      if (decision.strategy === "rag_success") {
        // 4. Llamada al sistema con RAG (enviando documentos actualizados)
        const ragStartTime = Date.now();
        const ragResponse = await fetch("/api/test-prompt-rag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: testQuery,
            knowledgeBase: knowledgeBase,
          }),
        });
        const ragData = await ragResponse.json();
        ragTime = Date.now() - ragStartTime;
        ragResponseText = ragData.response || "Error en respuesta RAG";
        finalResponse = ragResponseText;
      } else if (decision.strategy === "fallback_to_original") {
        ragResponseText = `🔄 FALLBACK: ${decision.reason}`;
        finalResponse = originalData.response || "Error en respuesta";
        ragTime = 50; // Tiempo simulado para fallback
      } else {
        // escalate_to_human
        ragResponseText = `🆘 ESCALAMIENTO: ${decision.reason}`;
        finalResponse = `🤝 **Transferencia a Agente Humano**

Esta consulta requiere atención especializada. Un agente humano se pondrá en contacto contigo en breve.

**Motivo**: ${decision.triggers.join(", ")}
**Tiempo estimado**: 3-5 minutos
**Ticket**: #${Date.now().toString().slice(-6)}

Mientras tanto, puedes contactarnos:
• WhatsApp: +595 981 123 456  
• Teléfono: 0800-FINTECH
• Email: soporte@fintechpro.com.py`;
        ragTime = 30; // Tiempo mínimo para escalamiento
      }

      const result: RAGTestResult = {
        query: testQuery,
        originalResponse:
          originalData.response || "Error en respuesta original",
        ragResponse: ragResponseText,
        finalResponse,
        retrievedDocs: relevantDocs,
        decision,
        responseTime: {
          original: originalTime,
          rag: ragTime,
          total: Date.now() - totalStartTime,
        },
        timestamp: new Date().toISOString(),
      };

      const updatedResults = [result, ...testResults];
      setTestResults(updatedResults);
      updateRAGStats(knowledgeBase, updatedResults);
      setTestQuery("");
    } catch (error) {
      console.error("Error testing RAG:", error);
    } finally {
      setIsTestingRAG(false);
    }
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case "producto":
        return "bg-blue-100 text-blue-800";
      case "regulacion":
        return "bg-green-100 text-green-800";
      case "contexto":
        return "bg-purple-100 text-purple-800";
      case "promocion":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStrategyColor = (strategy: RAGDecision["strategy"]) => {
    switch (strategy) {
      case "rag_success":
        return "bg-green-100 text-green-800";
      case "fallback_to_original":
        return "bg-yellow-100 text-yellow-800";
      case "escalate_to_human":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStrategyIcon = (strategy: RAGDecision["strategy"]) => {
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-xl font-bold text-black mb-4">
        Sistema RAG Inteligente con Fallback y Escalamiento
      </h3>
      <p className="text-gray-600 mb-6">
        Sistema avanzado que combina RAG, fallback automático al sistema
        original, y escalamiento inteligente a asistencia humana según el
        contexto y confianza.
      </p>

      {/* Estadísticas RAG Mejoradas */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            {ragStats.totalDocuments}
          </div>
          <div className="text-sm text-blue-800">Total Documentos</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {ragStats.successRate.toFixed(0)}%
          </div>
          <div className="text-sm text-green-800">Éxito RAG</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">
            {ragStats.fallbackRate.toFixed(0)}%
          </div>
          <div className="text-sm text-yellow-800">Fallback</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">
            {ragStats.escalationRate.toFixed(0)}%
          </div>
          <div className="text-sm text-red-800">Escalamiento</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">
            {ragStats.avgConfidence.toFixed(2)}
          </div>
          <div className="text-sm text-purple-800">Confianza Promedio</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {[
          { id: "overview", label: "Resumen", icon: "📊" },
          { id: "knowledge", label: "Base Conocimiento", icon: "📚" },
          { id: "test", label: "Probar RAG", icon: "🧪" },
          { id: "results", label: "Resultados", icon: "📋" },
          { id: "analytics", label: "Analíticas", icon: "📈" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() =>
              setActiveTab(
                tab.id as
                  | "overview"
                  | "knowledge"
                  | "test"
                  | "results"
                  | "analytics"
              )
            }
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
            <h4 className="font-bold text-gray-800 mb-4">
              Flujo de Decisión Inteligente
            </h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-700 mb-2">
                  RAG Exitoso
                </h5>
                <div className="text-sm text-green-600 space-y-1">
                  <div>• Confianza ≥ 60%</div>
                  <div>• Documentos relevantes encontrados</div>
                  <div>• No requiere escalamiento</div>
                  <div className="font-medium mt-2">
                    → Respuesta enriquecida con RAG
                  </div>
                </div>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-200">
                <h5 className="font-semibold text-yellow-700 mb-2">
                  Fallback Automático
                </h5>
                <div className="text-sm text-yellow-600 space-y-1">
                  <div>• Confianza &lt; 60%</div>
                  <div>• Pocos documentos relevantes</div>
                  <div>• Información insuficiente</div>
                  <div className="font-medium mt-2">
                    → Sistema original como respaldo
                  </div>
                </div>
              </div>
              <div className="bg-red-100 p-4 rounded-lg border border-red-200">
                <h5 className="font-semibold text-red-700 mb-2">
                  Escalamiento Humano
                </h5>
                <div className="text-sm text-red-600 space-y-1">
                  <div>• Información sensible detectada</div>
                  <div>• Crisis emocional</div>
                  <div>• Consulta muy compleja</div>
                  <div className="font-medium mt-2">
                    → Transferencia a agente
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-bold text-gray-800 mb-3">
                Casos de Escalamiento
              </h5>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-red-600">
                    Información sensible:
                  </span>{" "}
                  números de cuenta, claves, PINs
                </div>
                <div>
                  <span className="font-semibold text-orange-600">
                    Crisis emocional:
                  </span>{" "}
                  urgencias, mayúsculas, múltiples exclamaciones
                </div>
                <div>
                  <span className="font-semibold text-purple-600">
                    Consulta compleja:
                  </span>{" "}
                  múltiples productos, condiciones complicadas
                </div>
                <div>
                  <span className="font-semibold text-blue-600">
                    Servicio no disponible:
                  </span>{" "}
                  productos fuera de catálogo
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-bold text-gray-800 mb-3">
                Beneficios del Sistema
              </h5>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  • <strong>Respuestas precisas:</strong> RAG cuando hay alta
                  confianza
                </div>
                <div>
                  • <strong>Fallback seguro:</strong> Sistema original como
                  respaldo
                </div>
                <div>
                  • <strong>Escalamiento inteligente:</strong> Humano cuando es
                  necesario
                </div>
                <div>
                  • <strong>Protección de datos:</strong> Detección automática
                  información sensible
                </div>
                <div>
                  • <strong>Manejo de crisis:</strong> Atención prioritaria
                  casos urgentes
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "knowledge" && (
        <div className="space-y-6">
          {/* Lista de documentos */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4">
              Base de Conocimiento ({knowledgeBase.length} documentos)
            </h4>
            <p className="text-gray-600 mb-4">
              Edita cualquier documento para actualizar la información en tiempo
              real. Los cambios se reindexan automáticamente.
            </p>

            {/* Botón de reseteo */}
            <div className="mb-4">
              <button
                onClick={() => {
                  const defaultKnowledge = getDefaultKnowledgeBase();
                  setKnowledgeBase(defaultKnowledge);
                  updateRAGStats(defaultKnowledge);
                  saveKnowledgeBaseToStorage(defaultKnowledge);
                }}
                className="px-4 py-2 rounded-lg text-sm bg-gray-600 text-white hover:bg-gray-700"
              >
                Resetear a Valores Por Defecto
              </button>
              <span className="ml-2 text-xs text-gray-500">
                Los cambios se guardan automáticamente en tu navegador
              </span>
            </div>

            <div className="space-y-3">
              {knowledgeBase.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4 bg-white">
                  {editingDocId === doc.id ? (
                    /* Modo Edición */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-blue-600">
                          Editando Documento
                        </h5>
                        <div className="flex gap-2">
                          <button
                            onClick={saveEditedDocument}
                            disabled={
                              isReindexing === doc.id ||
                              !editingDoc.content?.trim()
                            }
                            className={`px-3 py-1 rounded text-sm ${
                              isReindexing === doc.id ||
                              !editingDoc.content?.trim()
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            {isReindexing === doc.id
                              ? "Reindexando..."
                              : "Guardar"}
                          </button>
                          <button
                            onClick={cancelEditingDocument}
                            disabled={isReindexing === doc.id}
                            className="px-3 py-1 rounded text-sm bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <select
                          value={editingDoc.metadata?.type || "producto"}
                          onChange={(e) =>
                            setEditingDoc({
                              ...editingDoc,
                              metadata: {
                                ...editingDoc.metadata!,
                                type: e.target.value as
                                  | "producto"
                                  | "regulacion"
                                  | "contexto"
                                  | "promocion",
                              },
                            })
                          }
                          className="p-2 border rounded-lg"
                          disabled={isReindexing === doc.id}
                        >
                          <option value="producto">📊 Producto</option>
                          <option value="regulacion">📋 Regulación</option>
                          <option value="contexto">🌍 Contexto</option>
                          <option value="promocion">🎯 Promoción</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Categoría"
                          value={editingDoc.metadata?.category || ""}
                          onChange={(e) =>
                            setEditingDoc({
                              ...editingDoc,
                              metadata: {
                                ...editingDoc.metadata!,
                                category: e.target.value,
                              },
                            })
                          }
                          className="p-2 border rounded-lg"
                          disabled={isReindexing === doc.id}
                        />
                        <input
                          type="text"
                          placeholder="Fuente"
                          value={editingDoc.metadata?.source || ""}
                          onChange={(e) =>
                            setEditingDoc({
                              ...editingDoc,
                              metadata: {
                                ...editingDoc.metadata!,
                                source: e.target.value,
                              },
                            })
                          }
                          className="p-2 border rounded-lg"
                          disabled={isReindexing === doc.id}
                        />
                      </div>

                      <input
                        type="text"
                        placeholder="Tags separados por comas"
                        value={
                          Array.isArray(editingDoc.metadata?.tags)
                            ? editingDoc.metadata.tags.join(", ")
                            : editingDoc.metadata?.tags || ""
                        }
                        onChange={(e) =>
                          setEditingDoc({
                            ...editingDoc,
                            metadata: {
                              ...editingDoc.metadata!,
                              tags: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2 border rounded-lg"
                        disabled={isReindexing === doc.id}
                      />

                      <textarea
                        placeholder="Contenido del documento"
                        value={editingDoc.content || ""}
                        onChange={(e) =>
                          setEditingDoc({
                            ...editingDoc,
                            content: e.target.value,
                          })
                        }
                        className="w-full p-3 border rounded-lg h-32"
                        disabled={isReindexing === doc.id}
                      />
                    </div>
                  ) : (
                    /* Modo Vista */
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getDocumentTypeColor(
                              doc.metadata.type
                            )}`}
                          >
                            {doc.metadata.type}
                          </span>
                          <span className="text-sm font-medium text-gray-600">
                            {doc.metadata.category}
                          </span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              doc.metadata.active
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditingDocument(doc)}
                            className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => toggleDocumentStatus(doc.id)}
                            className={`px-2 py-1 rounded text-xs ${
                              doc.metadata.active
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            {doc.metadata.active ? "Desactivar" : "Activar"}
                          </button>
                          <button
                            onClick={() => deleteDocument(doc.id)}
                            className="px-2 py-1 rounded text-xs bg-red-100 text-red-700 hover:bg-red-200"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {doc.content}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {doc.metadata.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500">
                        Fuente: {doc.metadata.source} | Actualizado:{" "}
                        {new Date(doc.metadata.updated).toLocaleDateString()}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Resto del componente permanece igual */}
      {activeTab === "test" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border">
            <h4 className="font-bold text-gray-800 mb-4">
              Probar Sistema Inteligente
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              El sistema evaluará automáticamente cada consulta y decidirá entre
              RAG, fallback o escalamiento humano.
            </p>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Ejemplo: ¿Cuál es la tasa para préstamo hipotecario?"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                className="flex-1 p-3 border rounded-lg"
                onKeyPress={(e) => e.key === "Enter" && testRAGComparison()}
              />
              <button
                onClick={testRAGComparison}
                disabled={isTestingRAG || !testQuery.trim()}
                className={`px-6 py-3 rounded-lg font-medium ${
                  isTestingRAG || !testQuery.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isTestingRAG ? "Analizando..." : "Probar"}
              </button>
            </div>
          </div>

          {/* Ejemplos categorizados */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h5 className="font-semibold text-green-800 mb-2">
                Casos RAG Exitoso
              </h5>
              <div className="space-y-2">
                {[
                  "¿Cuál es la tasa para préstamo hipotecario?",
                  "¿Puedo usar mi cédula del MERCOSUR?",
                  "¿Qué promociones tienen en tarjetas?",
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTestQuery(suggestion)}
                    className="w-full text-left text-sm p-2 bg-white rounded border hover:bg-green-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h5 className="font-semibold text-yellow-800 mb-2">
                Casos Fallback
              </h5>
              <div className="space-y-2">
                {[
                  "¿Cómo solicito una tarjeta?",
                  "Necesito ayuda con mi app",
                  "¿Cuáles son las comisiones?",
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTestQuery(suggestion)}
                    className="w-full text-left text-sm p-2 bg-white rounded border hover:bg-yellow-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h5 className="font-semibold text-red-800 mb-2">
                Casos Escalamiento
              </h5>
              <div className="space-y-2">
                {[
                  "MI CUENTA FUE HACKEADA!! URGENTE",
                  "Mi número de cuenta es 123456789",
                  "Tengo un problema muy complejo con mi tarjeta y necesito resolver varios temas",
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTestQuery(suggestion)}
                    className="w-full text-left text-sm p-2 bg-white rounded border hover:bg-red-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Último resultado si existe */}
          {testResults.length > 0 && (
            <div className="border rounded-lg p-4 bg-white">
              <h5 className="font-bold text-gray-800 mb-4">Último Resultado</h5>
              <div className="mb-4 p-3 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStrategyColor(
                      testResults[0].decision.strategy
                    )}`}
                  >
                    {getStrategyIcon(testResults[0].decision.strategy)}{" "}
                    {testResults[0].decision.strategy
                      .replace(/_/g, " ")
                      .toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-600">
                    Confianza:{" "}
                    {(testResults[0].decision.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  {testResults[0].decision.reason}
                </p>
                <div className="text-xs text-gray-500">
                  Triggers: {testResults[0].decision.triggers.join(", ")} |
                  Tiempo total: {testResults[0].responseTime.total}ms
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded border text-sm">
                <strong>Respuesta Final:</strong>
                <br />
                {testResults[0].finalResponse}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "results" && (
        <div className="space-y-4">
          <h4 className="font-bold text-gray-800">
            Historial de Decisiones ({testResults.length})
          </h4>

          {testResults.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">🧪</div>
              <p>No hay pruebas realizadas aún.</p>
              <p className="text-sm">
                Ve a la pestaña &quot;Probar RAG&quot; para empezar.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, idx) => (
                <div key={idx} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <h6 className="font-semibold text-gray-800">
                      {result.query}
                    </h6>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStrategyColor(
                          result.decision.strategy
                        )}`}
                      >
                        {getStrategyIcon(result.decision.strategy)}{" "}
                        {result.decision.strategy.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(result.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    <strong>Decisión:</strong> {result.decision.reason}
                  </div>

                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <strong>Respuesta Final:</strong>
                    <br />
                    {result.finalResponse.substring(0, 300)}...
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>
                      Confianza: {(result.decision.confidence * 100).toFixed(0)}
                      %
                    </span>
                    <span>Tiempo: {result.responseTime.total}ms</span>
                    <span>Docs: {result.retrievedDocs.length}</span>
                    <span>Triggers: {result.decision.triggers.join(", ")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <h4 className="font-bold text-gray-800">Analíticas del Sistema</h4>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h5 className="font-bold text-gray-800 mb-3">
                Distribución de Estrategias
              </h5>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm">RAG Exitoso</span>
                  </div>
                  <span className="font-medium">
                    {ragStats.successRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-sm">Fallback</span>
                  </div>
                  <span className="font-medium">
                    {ragStats.fallbackRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm">Escalamiento</span>
                  </div>
                  <span className="font-medium">
                    {ragStats.escalationRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h5 className="font-bold text-gray-800 mb-3">
                Rendimiento del Sistema
              </h5>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Consultas totales:</span>
                  <span className="font-medium">{testResults.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tiempo promedio RAG:</span>
                  <span className="font-medium">
                    {testResults.length > 0
                      ? Math.round(
                          testResults.reduce(
                            (sum, r) => sum + r.responseTime.rag,
                            0
                          ) / testResults.length
                        )
                      : 0}
                    ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tiempo promedio total:</span>
                  <span className="font-medium">
                    {testResults.length > 0
                      ? Math.round(
                          testResults.reduce(
                            (sum, r) => sum + r.responseTime.total,
                            0
                          ) / testResults.length
                        )
                      : 0}
                    ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Documentos activos:</span>
                  <span className="font-medium">
                    {ragStats.activeDocuments}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h5 className="font-bold text-gray-800 mb-3">
              Triggers de Escalamiento
            </h5>
            {testResults.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {Array.from(
                  new Set(testResults.flatMap((r) => r.decision.triggers))
                ).map((trigger) => {
                  const count = testResults.filter((r) =>
                    r.decision.triggers.includes(trigger)
                  ).length;
                  const percentage = (
                    (count / testResults.length) *
                    100
                  ).toFixed(1);
                  return (
                    <div key={trigger} className="flex justify-between">
                      <span className="text-sm">
                        {trigger.replace(/_/g, " ")}:
                      </span>
                      <span className="font-medium">
                        {count} ({percentage}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No hay datos suficientes para mostrar triggers.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
