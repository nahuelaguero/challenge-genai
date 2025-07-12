import { NextRequest, NextResponse } from "next/server";

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
}

interface RAGDecision {
  strategy: "rag_success" | "fallback_to_original" | "escalate_to_human";
  reason: string;
  confidence: number;
  triggers: string[];
}

// Base de conocimiento (en producción estaría en una base de datos)
const knowledgeBase: KnowledgeDocument[] = [
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

function calculateRelevance(query: string, doc: KnowledgeDocument): number {
  let score = 0;

  const contentWords = doc.content.toLowerCase().split(" ");
  const queryWords = query.toLowerCase().split(" ");

  queryWords.forEach((word) => {
    if (contentWords.includes(word)) {
      score += 0.2;
    }
  });

  // Relevancia por tags
  doc.metadata.tags.forEach((tag) => {
    if (query.toLowerCase().includes(tag.toLowerCase())) {
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
  if (query.includes("mercosur") && doc.metadata.category === "documentacion") {
    score += 0.4;
  }

  // Bonus por información reciente
  const docDate = new Date(doc.metadata.updated);
  const now = new Date();
  const daysDiff = (now.getTime() - docDate.getTime()) / (1000 * 60 * 60 * 24);

  if (daysDiff < 30) score += 0.1;
  if (daysDiff < 7) score += 0.1;

  return Math.min(score, 1.0);
}

function searchKnowledgeBaseWithCustomData(
  query: string,
  customKnowledgeBase: KnowledgeDocument[]
): {
  docs: KnowledgeDocument[];
  confidence: number;
} {
  const activeDocs = customKnowledgeBase.filter((doc) => doc.metadata.active);

  const docsWithRelevance = activeDocs
    .map((doc) => ({
      doc,
      relevance: calculateRelevance(query, doc),
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
}

function makeRAGDecision(
  query: string,
  ragConfidence: number,
  docsCount: number
): RAGDecision {
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
      /seguro|inversion|credito hipotecario|tarjeta empresarial/i.test(query) &&
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
}

async function callOriginalAPI(query: string): Promise<string> {
  try {
    const response = await fetch("http://localhost:3456/api/test-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    return data.response || "Error en sistema original";
  } catch {
    return "Error al acceder al sistema original";
  }
}

async function callOpenAIWithRAG(
  query: string,
  relevantDocs: KnowledgeDocument[],
  apiKey: string
): Promise<string> {
  try {
    // Crear contexto RAG con documentos relevantes
    const ragContext = relevantDocs
      .map((doc, index) => `${index + 1}. ${doc.content}`)
      .join("\n\n");

    // Prompt mejorado con información específica de RAG
    const enhancedSystemPrompt = `Eres un asesor financiero experto de FinTechPro Paraguay. Usa ÚNICAMENTE la información específica proporcionada a continuación para responder consultas.

INFORMACIÓN ESPECÍFICA DISPONIBLE:
${ragContext}

INSTRUCCIONES PRINCIPALES:
- Responde únicamente basándote en la información específica proporcionada
- Menciona datos concretos como tasas, montos, fechas y requisitos cuando estén disponibles  
- Si mencionas regulaciones, especifica decretos y fechas exactas
- Para promociones, incluye fechas de vigencia y condiciones precisas
- Sé preciso con los números y guaraníes (₲)
- Si la información no está completa, indica claramente qué información específica falta

ESTRUCTURA DE RESPUESTA OBLIGATORIA:
🤔 **Análisis:** [Analiza la consulta basándote en la información disponible]
💬 **Respuesta:** [Responde directamente usando los datos específicos proporcionados]
📋 **Detalles:** [Proporciona detalles concretos: tasas, montos, fechas, requisitos]
🔄 **Próximo paso:** [Indica acciones específicas que el cliente puede hacer]

INFORMACIÓN DE CONTACTO:
• Línea: 0800-FINTECH (24/7) • WhatsApp: +595 981 123 456 • App: "FinTechPro"
• Oficinas: Asunción, Ciudad del Este, Encarnación (L-V 8AM-6PM)

Mantén tono profesional, empático y usa la información específica proporcionada.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: enhancedSystemPrompt,
          },
          {
            role: "user",
            content: query,
          },
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API Error:", errorText);

      if (response.status === 401) {
        throw new Error("API key inválida");
      } else if (response.status === 429) {
        throw new Error("Límite de uso excedido");
      } else {
        throw new Error(`Error de OpenAI: ${response.status}`);
      }
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Respuesta inválida de OpenAI");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, knowledgeBase: customKnowledgeBase } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query requerida" }, { status: 400 });
    }

    // Verificar API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key de OpenAI no configurada en el servidor" },
        { status: 500 }
      );
    }

    // Usar base de conocimiento personalizada si se proporciona, sino usar la por defecto
    const activeKnowledgeBase = customKnowledgeBase || knowledgeBase;

    // 1. Búsqueda en base de conocimiento (usando la base correcta)
    const ragSearchResult = searchKnowledgeBaseWithCustomData(
      query,
      activeKnowledgeBase
    );
    const relevantDocs = ragSearchResult.docs;
    const ragConfidence = ragSearchResult.confidence;

    // 2. Decisión inteligente
    const decision = makeRAGDecision(query, ragConfidence, relevantDocs.length);

    // 3. Ejecutar estrategia correspondiente
    let finalResponse = "";
    const metadata = {
      strategy: decision.strategy,
      reason: decision.reason,
      confidence: decision.confidence,
      triggers: decision.triggers,
      docsUsed: relevantDocs.length,
    };

    if (decision.strategy === "escalate_to_human") {
      finalResponse = `🤝 **Transferencia a Agente Humano**

Esta consulta requiere atención especializada. Un agente humano se pondrá en contacto contigo en breve.

**Motivo**: ${decision.triggers.join(", ")}
**Tiempo estimado**: 3-5 minutos
**Ticket**: #${Date.now().toString().slice(-6)}

Mientras tanto, puedes contactarnos:
• WhatsApp: +595 981 123 456  
• Teléfono: 0800-FINTECH
• Email: soporte@fintechpro.com.py

**Información de contexto disponible**: Consulta enviada a supervisor especializado en ${
        decision.triggers.includes("informacion_sensible")
          ? "seguridad y datos personales"
          : decision.triggers.includes("crisis_emocional")
          ? "atención de urgencias"
          : "consultas complejas"
      }.`;
    } else if (decision.strategy === "fallback_to_original") {
      // Llamar al sistema original como fallback
      const originalResponse = await callOriginalAPI(query);
      finalResponse = `ℹ️ **Respuesta del Sistema (Modo Fallback)**

${originalResponse}

---
*Nota técnica: Esta respuesta fue generada por el sistema base debido a ${decision.reason.toLowerCase()}. Si necesitas información más específica, contacta con nuestro equipo de soporte.*`;
    } else {
      // Usar RAG - Llamada real a OpenAI con contexto enriquecido
      try {
        const ragResponse = await callOpenAIWithRAG(
          query,
          relevantDocs,
          apiKey
        );
        finalResponse = `🧠 **Respuesta RAG Enriquecida**

${ragResponse}

---
*Información basada en: ${relevantDocs
          .map((d) => d.metadata.source)
          .join(", ")} | Confianza: ${(decision.confidence * 100).toFixed(
          0
        )}%*`;
      } catch (error) {
        console.error("Error en llamada OpenAI RAG:", error);
        // Fallback a sistema original si falla OpenAI
        const originalResponse = await callOriginalAPI(query);
        finalResponse = `⚠️ **Respuesta del Sistema (Fallback por Error)**

${originalResponse}

---
*Nota técnica: Se produjo un error temporal en el sistema RAG. Se usó el sistema base como respaldo.*`;

        // Actualizar metadata para reflejar el fallback por error
        metadata.strategy = "fallback_to_original";
        metadata.reason = "Error en llamada a OpenAI, fallback automático";
      }
    }

    return NextResponse.json({
      response: finalResponse,
      metadata,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in RAG API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
