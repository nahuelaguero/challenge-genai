export interface EvaluationCase {
  id: number;
  input: string;
  category: string;
  complexity: "baja" | "media" | "alta";
  expectedComponents: string[];
  expectedKeywords: string[];
  requiresClarification: boolean;
  response: string;
  scores: {
    structure: number;
    keywords: number;
    clarification: number;
    length: number;
    empathy: number;
    overall: number;
  };
}

export const evaluationCases: EvaluationCase[] = [
  // CASO 1: EXITOSO - Ejemplo perfecto
  {
    id: 1,
    input: "¿Cuál es el límite de mi tarjeta de crédito?",
    category: "tarjeta_credito",
    complexity: "media",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: ["límite", "tarjeta de crédito", "scoring", "verificar"],
    requiresClarification: true,
    response: `🤔 **Análisis:** El cliente pregunta sobre el límite de su tarjeta de crédito. Entiendo que es importante conocer esta información para planificar sus gastos. Necesito verificar su información personal ya que los límites varían según el perfil crediticio.

💡 **Respuesta:** Comprendo tu interés en conocer el límite exacto de tu tarjeta de crédito. Me da mucho gusto poder ayudarte con esta consulta. Para darte la información más precisa, necesito verificar algunos datos de tu cuenta de forma segura.

📋 **Detalles:** Los límites de tarjeta de crédito se asignan según tu scoring crediticio y pueden variar entre ₲2,500,000 y ₲50,000,000. Nuestra tarjeta de crédito tiene una cuota anual de ₲1,500,000, pero los beneficios que obtienes realmente valen la pena.

🔄 **Siguiente paso:** Por favor proporciona los últimos 4 dígitos de tu tarjeta y tu número de identificación para proceder con la consulta. Te aseguro que manejaremos tu información con total confidencialidad.`,
    scores: {
      structure: 1.0,
      keywords: 0.75,
      clarification: 1.0,
      length: 1.0,
      empathy: 0.8,
      overall: 0.91,
    },
  },
  // CASO 2: EXITOSO - Manejo de consulta ambigua
  {
    id: 2,
    input: "¿Cuánto me cobran?",
    category: "general",
    complexity: "alta",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: [
      "productos",
      "específico",
      "tarjeta de débito",
      "tarjeta de crédito",
      "préstamos",
    ],
    requiresClarification: true,
    response: `🤔 **Análisis:** Entiendo que quieres conocer los costos de nuestros servicios. La consulta es muy general y podría referirse a cualquiera de nuestros productos financieros. Me imagino que puede ser confuso con tantas opciones. Necesito aclaración específica para brindarte la información más útil.

💡 **Respuesta:** Comprendo perfectamente que quieras conocer nuestros costos antes de tomar una decisión. Es muy inteligente de tu parte preguntar. Para ayudarte de la mejor manera, necesito saber a qué producto específico te refieres.

📋 **Detalles:** Te comparto un resumen de nuestros productos y sus costos:
- Tarjeta de débito: Sin cuota anual (¡completamente gratis!)
- Tarjeta de crédito: ₲1,500,000 anuales (con excelentes beneficios)
- Préstamos: Tasa desde 22% anual (muy competitiva en el mercado)

🔄 **Siguiente paso:** ¿Podrías decirme si preguntas sobre tarjeta de débito, tarjeta de crédito o préstamos? Así podré darte detalles específicos que realmente te sirvan.`,
    scores: {
      structure: 1.0,
      keywords: 1.0,
      clarification: 1.0,
      length: 1.0,
      empathy: 0.9,
      overall: 0.98,
    },
  },
  // CASO 3: EXITOSO - Información específica
  {
    id: 3,
    input: "Necesito un préstamo de ₲100,000,000",
    category: "prestamo",
    complexity: "media",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: [
      "préstamo",
      "₲100,000,000",
      "tasa",
      "plazo",
      "pago mensual",
    ],
    requiresClarification: false,
    response: `🤔 **Análisis:** El cliente solicita información sobre un préstamo específico de $100,000. Entiendo que debe tener un proyecto importante o una necesidad específica. Este monto está perfectamente dentro de nuestro rango disponible (hasta $500,000).

💡 **Respuesta:** ¡Qué excelente noticia que consideréis FinTechPro para tu préstamo! Me da mucho gusto saber que podemos ayudarte con un préstamo de $100,000. Tenemos opciones muy flexibles para ti.

📋 **Detalles:** 
- Monto: $100,000 (perfectamente disponible)
- Tasa: Desde 18% anual (según tu perfil crediticio, podríamos ofrecerte una tasa muy atractiva)
- Plazo: Hasta 60 meses (puedes elegir el que mejor se adapte a tu situación)
- Pago mensual estimado: $2,500-$3,000 (dependiendo del plazo que elijas)

🔄 **Siguiente paso:** ¿Te gustaría que iniciemos el proceso de solicitud? Me encantaría acompañarte en todo el proceso, o si prefieres, puedo explicarte más detalles sobre términos y condiciones.`,
    scores: {
      structure: 1.0,
      keywords: 1.0,
      clarification: 0.0,
      length: 1.0,
      empathy: 0.9,
      overall: 0.88,
    },
  },
  // CASO 4: EXITOSO - Manejo de problema técnico
  {
    id: 4,
    input: "Mi tarjeta de débito no funciona",
    category: "tarjeta_debito",
    complexity: "alta",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: ["tarjeta de débito", "problema", "solución"],
    requiresClarification: true,
    response: `🤔 **Análisis:** El cliente reporta un problema con su tarjeta de débito. Entiendo que esto debe ser muy frustrante, especialmente si necesita usar su tarjeta urgentemente. Esto requiere atención inmediata para resolver el inconveniente.

💡 **Respuesta:** Lamento mucho que tengas problemas con tu tarjeta de débito. Entiendo lo molesto que debe ser no poder usar tu tarjeta cuando la necesitas. No te preocupes, estoy aquí para ayudarte a solucionarlo de inmediato.

📋 **Detalles:** Los problemas más comunes que podemos resolver rápidamente incluyen:
- Bloqueos por seguridad (los más frecuentes)
- Exceder límites diarios de retiro
- Fallas técnicas temporales en el sistema
- Problemas de conectividad en cajeros

🔄 **Siguiente paso:** ¿Podrías decirme qué mensaje específico aparece cuando intentas usar la tarjeta? Con esa información podré identificar la causa exacta y darte la solución más rápida posible.`,
    scores: {
      structure: 1.0,
      keywords: 1.0,
      clarification: 1.0,
      length: 1.0,
      empathy: 1.0,
      overall: 1.0,
    },
  },
  // CASO 5: EXITOSO - Consulta simple y directa
  {
    id: 5,
    input: "¿Qué documentos necesito para la tarjeta de crédito?",
    category: "tarjeta_credito",
    complexity: "baja",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: ["documentos", "tarjeta de crédito", "requisitos"],
    requiresClarification: false,
    response: `🤔 **Análisis:** El cliente pregunta sobre los documentos necesarios para obtener una tarjeta de crédito. Me parece excelente que quiera prepararse con anticipación. Esta es información estándar que puedo proporcionar directamente.

💡 **Respuesta:** ¡Qué bueno que quieras prepararte con anticipación! Me encanta trabajar con personas organizadas como tú. Para solicitar tu tarjeta de crédito, necesitarás algunos documentos básicos que seguramente ya tienes.

📋 **Detalles:** Los documentos que necesitas son muy estándar:
- Identificación oficial vigente (INE, pasaporte o cédula profesional)
- Comprobante de ingresos de los últimos 3 meses
- Comprobante de domicilio no mayor a 3 meses
- Estado de cuenta bancario reciente

🔄 **Siguiente paso:** ¿Ya tienes todos estos documentos disponibles? Si es así, me da muchísimo gusto poder ayudarte a iniciar el proceso de solicitud de inmediato.`,
    scores: {
      structure: 1.0,
      keywords: 1.0,
      clarification: 0.0,
      length: 1.0,
      empathy: 0.8,
      overall: 0.88,
    },
  },
  // CASO 6: EXITOSO - Manejo de queja con empatía
  {
    id: 6,
    input: "Estoy muy molesto, me cobraron algo que no entiendo",
    category: "queja",
    complexity: "alta",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: ["entiendo", "frustración", "ayuda", "específico"],
    requiresClarification: true,
    response: `🤔 **Análisis:** El cliente está muy molesto por un cargo que no entiende. Reconozco completamente su frustración - no hay nada más molesto que cargos inesperados sin explicación clara. Necesito manejar su molestia con máxima empatía y resolver su consulta específica de inmediato.

💡 **Respuesta:** Entiendo completamente tu frustración y lamento mucho que hayas tenido esta experiencia. Tienes todo el derecho de estar molesto por un cargo que no entiendes. Estoy aquí para ayudarte y vamos a resolver esto juntos de inmediato. Tu tranquilidad es mi prioridad.

📋 **Detalles:** Para aclarar tu situación de la manera más rápida y efectiva, necesito:
- Verificar tu identidad de forma segura (por tu protección)
- Revisar detalladamente todos los movimientos de tu cuenta
- Explicarte paso a paso cada cargo para que quede todo crystal claro

🔄 **Siguiente paso:** ¿Podrías proporcionarme los últimos 4 dígitos de tu tarjeta/cuenta y la fecha aproximada del cargo? Te prometo que vamos a investigarlo a fondo y encontrar la explicación que necesitas.`,
    scores: {
      structure: 1.0,
      keywords: 1.0,
      clarification: 1.0,
      length: 1.0,
      empathy: 1.0,
      overall: 1.0,
    },
  },
  // CASO 7: PROBLEMÁTICO - SIN ESTRUCTURA (Falla crítica)
  {
    id: 7,
    input: "¿Cuánto puedo retirar con mi tarjeta de débito?",
    category: "tarjeta_debito",
    complexity: "baja",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: ["tarjeta de débito", "retirar", "límite"],
    requiresClarification: false,
    response: `El cliente pregunta sobre límites de retiro. Los límites dependen del perfil. Límites estándar: retiro diario entre ₲250,000 y ₲2,500,000, retiro por transacción hasta ₲500,000, sin límite en número de transacciones. Los límites pueden ajustarse. ¿Necesitas verificar tu límite específico?`,
    scores: {
      structure: 0.0, // Sin emojis ni formato
      keywords: 0.67, // Menciona algunas palabras clave
      clarification: 0.0, // No requiere pero no maneja bien
      length: 0.4, // Muy corto
      empathy: 0.0, // Muy frío y robótico
      overall: 0.21,
    },
  },
  // CASO 8: PROBLEMÁTICO - SIN EMPATÍA (Falla de tono)
  {
    id: 8,
    input: "¿Qué pasa si no pago mi tarjeta de crédito?",
    category: "tarjeta_credito",
    complexity: "alta",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: ["tarjeta de crédito", "pago", "consecuencias"],
    requiresClarification: false,
    response: `🤔 **Análisis:** Consulta sobre consecuencias de no pagar tarjeta de crédito. Información estándar disponible.

💡 **Respuesta:** Las consecuencias del no pago son claras y deben cumplirse según términos y condiciones.

📋 **Detalles:** Al no pagar se generan:
- Intereses moratorios del 3% mensual
- Comisión por pago tardío de ₲125,000
- Reporte negativo en buró de crédito
- Bloqueo de tarjeta después de 90 días

🔄 **Siguiente paso:** Debe realizar el pago inmediatamente para evitar estas consecuencias. Contáctenos para opciones de pago.`,
    scores: {
      structure: 1.0, // Tiene estructura
      keywords: 1.0, // Menciona palabras clave
      clarification: 0.0, // No requiere aclaración
      length: 0.8, // Longitud adecuada
      empathy: 0.0, // Muy frío, sin empatía
      overall: 0.56,
    },
  },
  // CASO 9: PROBLEMÁTICO - INFORMACIÓN INCORRECTA (Falla de precisión)
  {
    id: 9,
    input: "¿Puedo pagar mi préstamo antes?",
    category: "prestamo",
    complexity: "media",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: ["préstamo", "pago anticipado", "prepago"],
    requiresClarification: false,
    response: `🤔 **Análisis:** El cliente pregunta sobre pago anticipado de préstamo. Esta es una consulta sobre políticas de prepago.

💡 **Respuesta:** ¡Por supuesto que puedes pagar tu préstamo antes! Nos da mucho gusto que estés considerando esta opción.

📋 **Detalles:** Las condiciones de prepago incluyen:
- Comisión por pago anticipado del 2% sobre el saldo
- Penalización por cancelación temprana de ₲250,000
- Debes pagar al menos el 80% del préstamo para calificar
- Solo se permite después de 12 meses de pagos

🔄 **Siguiente paso:** ¿Te gustaría que calculemos el costo total del prepago? Podemos programar una cita para revisar tu caso específico.`,
    scores: {
      structure: 1.0, // Tiene estructura
      keywords: 0.33, // Menciona pocas palabras clave correctas
      clarification: 0.0, // No requiere aclaración
      length: 1.0, // Longitud adecuada
      empathy: 0.8, // Tiene empatía
      overall: 0.43, // Falla por información incorrecta
    },
  },
  // CASO 10: LÍMITE - Parcialmente bueno pero con fallas menores
  {
    id: 10,
    input: "Hola",
    category: "saludo",
    complexity: "baja",
    expectedComponents: ["analysis", "response", "details", "next_step"],
    expectedKeywords: ["ayuda", "productos", "servicios"],
    requiresClarification: true,
    response: `🤔 **Análisis:** El cliente me saluda de manera general. Debo responder cordialmente y ofrecer ayuda.

💡 **Respuesta:** ¡Hola! Bienvenido a FinTechPro. Estoy aquí para ayudarte con todas tus consultas financieras.

📋 **Detalles:** Puedo ayudarte con:
- Tarjetas de débito y crédito
- Préstamos personales
- Consultas sobre tu cuenta

🔄 **Siguiente paso:** ¿En qué puedo ayudarte hoy?`,
    scores: {
      structure: 1.0, // Tiene estructura
      keywords: 0.67, // Menciona algunos productos
      clarification: 1.0, // Maneja bien la necesidad de aclaración
      length: 0.6, // Un poco corto
      empathy: 0.6, // Empatía básica pero no excepcional
      overall: 0.77, // Funcional pero no excepcional
    },
  },
];

export const FINTECH_PROMPT = `Eres un asistente especializado en atención al cliente para una fintech paraguaya llamada "FinTechPro". 
Tu objetivo es ayudar a los clientes de manera clara, precisa y empática con consultas sobre 
nuestros productos: tarjetas de débito, tarjetas de crédito y préstamos.

## INSTRUCCIONES PRINCIPALES:
1. Siempre muestra tu proceso de razonamiento paso a paso
2. Responde de manera empática y profesional
3. Si no tienes información suficiente, pide aclaración específica
4. Estructura tus respuestas de forma clara y organizada
5. Menciona siempre el producto específico en tu respuesta

## PRODUCTOS DISPONIBLES:
- **Tarjetas de Débito**: Sin cuota anual, límite según ingresos, débito inmediato
- **Tarjetas de Crédito**: Cuota anual ₲1,500,000, límite según scoring, facturación mensual
- **Préstamos**: Monto hasta ₲500,000,000, tasa desde 22% anual, plazo hasta 60 meses

## FORMATO DE RESPUESTA:
🤔 **Análisis:** [Tu proceso de razonamiento]
💡 **Respuesta:** [Respuesta clara y directa]
📋 **Detalles:** [Información específica relevante]
🔄 **Siguiente paso:** [Acción recomendada si aplica]

¿Cómo puedo ayudarte hoy?`;
