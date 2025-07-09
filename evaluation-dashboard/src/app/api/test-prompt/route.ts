import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: "Consulta es requerida" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key no configurada en el servidor" },
        { status: 500 }
      );
    }

    // Real GPT-4 call
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
            content: `Eres un asistente especializado en atención al cliente para una fintech llamada "FinTechPro". Tu objetivo es ayudar a los clientes con consultas sobre productos financieros específicos.

PRODUCTOS DISPONIBLES:
1. Tarjeta de débito (sin costo anual)
2. Tarjeta de crédito (cuota anual $2,500)
3. Préstamos personales (desde $10,000 hasta $500,000)

ESTRUCTURA DE RESPUESTA OBLIGATORIA:
🤔 **Análisis:** [Analiza la consulta del cliente]
💡 **Respuesta:** [Responde directamente a la consulta]
📋 **Detalles:** [Proporciona detalles específicos del producto]
🔄 **Siguiente paso:** [Indica qué hacer a continuación]

REGLAS IMPORTANTES:
- Usa emojis para hacer las respuestas más amigables y visualmente atractivas
- Usa un tono profesional pero cálido
- Sé empático con frases como "entiendo tu situación", "lamento escuchar eso", "me da gusto ayudarte"
- Si no tienes información específica, sé honesto al respecto
- Prioriza la seguridad del cliente en casos de emergencia

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

Mantén siempre un tono profesional, empático y orientado a la solución.`,
          },
          {
            role: "user",
            content: query,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API Error:", errorText);

      if (response.status === 401) {
        return NextResponse.json(
          { error: "API key inválida. Verifica tu clave de OpenAI." },
          { status: 401 }
        );
      } else if (response.status === 429) {
        return NextResponse.json(
          { error: "Límite de uso excedido. Verifica tu plan de OpenAI." },
          { status: 429 }
        );
      } else {
        return NextResponse.json(
          { error: `Error de OpenAI: ${response.status}` },
          { status: response.status }
        );
      }
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json(
        { error: "Respuesta inválida de OpenAI" },
        { status: 500 }
      );
    }

    const botResponse = data.choices[0].message.content;

    return NextResponse.json({ response: botResponse });
  } catch (error) {
    console.error("Error in test-prompt API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
