const testCases = [
  {
    id: 1,
    description: "Consulta básica sobre límite de tarjeta de crédito",
    query: "¿Cuál es el límite de mi tarjeta de crédito?",
    expectedType: "exitoso",
  },
  {
    id: 2,
    description: "Consulta sobre beneficios de tarjeta de débito",
    query: "¿Qué beneficios tiene la tarjeta de débito?",
    expectedType: "exitoso",
  },
  {
    id: 3,
    description: "Consulta problemática con lenguaje coloquial",
    query: "che hermano necesito guita urgente, dame un prestamo ya",
    expectedType: "problemático",
  },
  {
    id: 4,
    description: "Consulta límite sobre producto inexistente",
    query: "¿Tienen seguros de vida?",
    expectedType: "límite",
  },
  {
    id: 5,
    description: "Consulta ambigua sobre tasas",
    query: "¿Cuánto me cobran de interés?",
    expectedType: "problemático",
  },
  {
    id: 6,
    description: "Consulta sobre requisitos para préstamo",
    query: "¿Qué documentos necesito para un préstamo personal?",
    expectedType: "exitoso",
  },
  {
    id: 7,
    description: "Consulta con información personal sensible",
    query: "Mi número de cuenta es 123456789, ¿puedes revisar mi saldo?",
    expectedType: "problemático",
  },
  {
    id: 8,
    description: "Consulta sobre cambio de límite",
    query: "¿Puedo aumentar el límite de mi tarjeta de crédito?",
    expectedType: "exitoso",
  },
  {
    id: 9,
    description: "Consulta sobre bloqueo de tarjeta",
    query: "Perdí mi tarjeta de débito, ¿cómo la bloqueo?",
    expectedType: "exitoso",
  },
  {
    id: 10,
    description: "Consulta límite sobre criptomonedas",
    query: "¿Puedo comprar Bitcoin con mi tarjeta?",
    expectedType: "límite",
  },
];

async function testSingleCase(testCase) {
  console.log(`\n🧪 Ejecutando caso ${testCase.id}: ${testCase.description}`);
  console.log(`❓ Query: "${testCase.query}"`);

  try {
    const response = await fetch("http://localhost:3456/api/test-prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: testCase.query,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error HTTP ${response.status}: ${errorText}`);
      return null;
    }

    const data = await response.json();

    if (data.error) {
      console.error(`❌ Error en respuesta: ${data.error}`);
      return null;
    }

    console.log(`✅ Respuesta obtenida (${data.response.length} caracteres)`);
    console.log(`📊 Tipo esperado: ${testCase.expectedType}`);

    // Analizar la respuesta
    const hasAnalysis = /📊.*análisis:|análisis:/i.test(data.response);
    const hasResponse = /💬.*respuesta:|respuesta:/i.test(data.response);
    const hasDetails = /📋.*detalles:|detalles:/i.test(data.response);
    const hasNextStep = /🔄.*próximo paso:|próximo paso:/i.test(data.response);

    const structureScore = [
      hasAnalysis,
      hasResponse,
      hasDetails,
      hasNextStep,
    ].filter(Boolean).length;

    console.log(`📈 Estructura encontrada: ${structureScore}/4 componentes`);
    console.log(`   - Análisis: ${hasAnalysis ? "✅" : "❌"}`);
    console.log(`   - Respuesta: ${hasResponse ? "✅" : "❌"}`);
    console.log(`   - Detalles: ${hasDetails ? "✅" : "❌"}`);
    console.log(`   - Próximo paso: ${hasNextStep ? "✅" : "❌"}`);

    // Verificar manejo de casos problemáticos
    if (testCase.expectedType === "problemático") {
      const handlesProblematic =
        /no puedo|no es posible|necesito más información|aclaración|por favor proporciona/i.test(
          data.response
        );
      console.log(
        `⚠️  Manejo de caso problemático: ${handlesProblematic ? "✅" : "❌"}`
      );
    }

    // Verificar límites del sistema
    if (testCase.expectedType === "límite") {
      const acknowledgesLimit =
        /no ofrecemos|fuera de mis servicios|no está disponible|no tengo información|no puedo ayudar con/i.test(
          data.response
        );
      console.log(
        `🚧 Reconoce límites del sistema: ${acknowledgesLimit ? "✅" : "❌"}`
      );
    }

    // Verificar empatía y profesionalismo
    const empathyIndicators =
      /entiendo|comprendo|me da mucho gusto|te ayudo|con gusto|por supuesto/i.test(
        data.response
      );
    console.log(
      `❤️  Indicadores de empatía: ${empathyIndicators ? "✅" : "❌"}`
    );

    return {
      testCase,
      response: data.response,
      structureScore,
      hasAnalysis,
      hasResponse,
      hasDetails,
      hasNextStep,
      empathyIndicators,
    };
  } catch (error) {
    console.error(`❌ Error al ejecutar caso ${testCase.id}:`, error.message);
    return null;
  }
}

async function runAllTests() {
  console.log("🚀 Iniciando evaluación de los 10 casos de prueba");
  console.log("=".repeat(80));

  const results = [];

  for (const testCase of testCases) {
    const result = await testSingleCase(testCase);
    if (result) {
      results.push(result);
    }

    // Pausa entre llamadas para no sobrecargar la API
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\n📊 RESUMEN DE RESULTADOS");
  console.log("=".repeat(80));

  const totalCases = results.length;
  const avgStructureScore =
    results.reduce((sum, r) => sum + r.structureScore, 0) / totalCases;
  const empathyCount = results.filter((r) => r.empathyIndicators).length;

  console.log(`📈 Casos evaluados: ${totalCases}/10`);
  console.log(
    `📊 Promedio de estructura: ${avgStructureScore.toFixed(1)}/4 componentes`
  );
  console.log(
    `❤️  Casos con empatía: ${empathyCount}/${totalCases} (${(
      (empathyCount / totalCases) *
      100
    ).toFixed(1)}%)`
  );

  // Análisis por tipo de caso
  const successful = results.filter(
    (r) => r.testCase.expectedType === "exitoso"
  );
  const problematic = results.filter(
    (r) => r.testCase.expectedType === "problemático"
  );
  const limit = results.filter((r) => r.testCase.expectedType === "límite");

  console.log(`\n📋 Análisis por tipo:`);
  console.log(`   - Exitosos: ${successful.length} casos`);
  console.log(`   - Problemáticos: ${problematic.length} casos`);
  console.log(`   - Límites: ${limit.length} casos`);

  // Mostrar mejores y peores respuestas
  const bestStructure = results.reduce((best, current) =>
    current.structureScore > best.structureScore ? current : best
  );

  const worstStructure = results.reduce((worst, current) =>
    current.structureScore < worst.structureScore ? current : worst
  );

  console.log(
    `\n🏆 Mejor estructura: Caso ${bestStructure.testCase.id} (${bestStructure.structureScore}/4)`
  );
  console.log(
    `📉 Peor estructura: Caso ${worstStructure.testCase.id} (${worstStructure.structureScore}/4)`
  );

  return results;
}

// Ejecutar las pruebas
runAllTests()
  .then((results) => {
    console.log("\n✅ Evaluación completada");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en la evaluación:", error);
    process.exit(1);
  });
