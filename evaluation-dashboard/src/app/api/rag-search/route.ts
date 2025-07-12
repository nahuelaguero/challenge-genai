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

// Base de conocimiento de ejemplo (en producción vendría de una base de datos)
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
      "Decreto 2024-156 Paraguay: Cédula MERCOSUR válida para operaciones financieras desde agosto 2024. Reconocimiento automático en sistema bancario paraguayo. Requisitos adicionales: fotografía vigente y comprobante de domicilio en Paraguay. Aplicable a préstamos, tarjetas de crédito e inversiones.",
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
      "Términos financieros en guaraní: jajajára (préstamo), viru (dinero), ñembyaty (ahorro), ñemuhã (invertir). Fechas importantes Paraguay: 15 mayo (Día de la Independencia) promociones especiales, diciembre (aguinaldo) productos estacionales. Cultura familiar paraguaya: decisiones financieras importantes incluyen consulta familiar.",
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
      "Tarjeta Crédito Gold enero 2025: Promoción especial sin cuota de manejo primeros 6 meses (ahorro ₲750.000). Cashback 2% en todas las compras, límite hasta ₲45.000.000. Requisitos: ingresos ₲6.000.000+ mensuales. Beneficios: seguro de viaje internacional, acceso VIP aeropuerto Silvio Pettirossi, protección de compras.",
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
      "Tipos de cambio FinTechPro enero 2025: USD/PYG 7.350 (compra) / 7.380 (venta). EUR/PYG 8.100 (compra) / 8.140 (venta). ARS/PYG 7.20 (compra) / 7.35 (venta). BRL/PYG 1.235 (compra) / 1.255 (venta). Actualización cada 30 minutos durante horario bancario.",
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

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: "Query es requerida" },
        { status: 400 }
      );
    }

    // Búsqueda semántica simulada
    const relevantDocs = searchKnowledgeBase(query);

    const response = {
      query,
      documents: relevantDocs,
      count: relevantDocs.length,
      confidence: relevantDocs.length > 0 ? 0.85 : 0.2,
      searchTime: Math.random() * 100 + 50, // Simular tiempo de búsqueda
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in RAG search:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

function searchKnowledgeBase(query: string): KnowledgeDocument[] {
  const queryLower = query.toLowerCase();
  const activeDocs = knowledgeBase.filter((doc) => doc.metadata.active);

  return activeDocs
    .map((doc) => ({
      doc,
      relevance: calculateRelevance(queryLower, doc),
    }))
    .filter(({ relevance }) => relevance > 0.3)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3)
    .map(({ doc }) => doc);
}

function calculateRelevance(query: string, doc: KnowledgeDocument): number {
  let score = 0;

  // Relevancia por contenido
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

  // Relevancia por tipo y categoría
  if (query.includes("prestamo") && doc.metadata.category === "prestamos") {
    score += 0.4;
  }
  if (query.includes("hipotecario") && doc.id.includes("hipotecario")) {
    score += 0.5;
  }
  if (query.includes("tarjeta") && doc.metadata.category === "tarjetas") {
    score += 0.4;
  }
  if (query.includes("mercosur") && doc.metadata.category === "documentacion") {
    score += 0.4;
  }
  if (query.includes("cambio") && doc.metadata.category === "cambio") {
    score += 0.4;
  }
  if (query.includes("guarani") && doc.metadata.category === "cultural") {
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
