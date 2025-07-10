const fetch = require("node-fetch");

const testCases = [
  {
    id: 1,
    description: "Consulta básica sobre límite de tarjeta de crédito",
    query: "¿Cuál es el límite de mi tarjeta de crédito?",
    expectedType: "exitoso",
    simulatedScore: 4.2,
    simulatedStructure: {
      analysis: true,
      response: true,
      details: true,
      nextStep: true,
    },
  },
  {
    id: 2,
    description: "Consulta sobre beneficios de tarjeta de débito",
    query: "¿Qué beneficios tiene la tarjeta de débito?",
    expectedType: "exitoso",
    simulatedScore: 4.1,
    simulatedStructure: {
      analysis: true,
      response: true,
      details: true,
      nextStep: true,
    },
  },
  {
    id: 3,
    description: "Consulta problemática con lenguaje coloquial",
    query: "che hermano necesito guita urgente, dame un prestamo ya",
    expectedType: "problemático",
    simulatedScore: 3.8,
    simulatedStructure: {
      analysis: true,
      response: true,
      details: true,
      nextStep: false,
    },
  },
];

async function getRealResponse(query) {
  try {
    const response = await fetch("http://localhost:3456/api/test-prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    return data.response;
  } catch (error) {
    console.error("Error getting real response:", error);
    return null;
  }
}

function analyzeResponse(response) {
  const hasAnalysis = /📊.*análisis:|análisis:/i.test(response);
  const hasResponse = /💬.*respuesta:|respuesta:/i.test(response);
  const hasDetails = /📋.*detalles:|detalles:/i.test(response);
  const hasNextStep = /🔄.*próximo paso:|próximo paso:/i.test(response);

  const structureScore = [
    hasAnalysis,
    hasResponse,
    hasDetails,
    hasNextStep,
  ].filter(Boolean).length;

  // Calidad de la respuesta (1-5)
  let qualityScore = 3.0; // Base

  if (hasAnalysis) qualityScore += 0.3;
  if (hasResponse) qualityScore += 0.4;
  if (hasDetails) qualityScore += 0.2;
  if (hasNextStep) qualityScore += 0.1;

  // Empatía
  const empathyIndicators =
    /entiendo|comprendo|me da mucho gusto|te ayudo|con gusto|por supuesto/i.test(
      response
    );
  if (empathyIndicators) qualityScore += 0.2;

  // Longitud apropiada
  const wordCount = response.split(/\s+/).length;
  if (wordCount >= 80 && wordCount <= 200) qualityScore += 0.1;

  return {
    structureScore,
    qualityScore: Math.min(5.0, qualityScore),
    hasAnalysis,
    hasResponse,
    hasDetails,
    hasNextStep,
    empathyIndicators,
    wordCount,
  };
}

async function compareResponses() {
  console.log("🔍 COMPARACIÓN: RESPUESTAS REALES VS SIMULADAS");
  console.log("=".repeat(80));

  const results = [];

  for (const testCase of testCases) {
    console.log(`\n📝 Caso ${testCase.id}: ${testCase.description}`);
    console.log(`❓ Query: "${testCase.query}"`);
    console.log("-".repeat(60));

    // Obtener respuesta real
    const realResponse = await getRealResponse(testCase.query);
    if (!realResponse) {
      console.log("❌ No se pudo obtener respuesta real");
      continue;
    }

    // Analizar respuesta real
    const realAnalysis = analyzeResponse(realResponse);

    // Mostrar comparación
    console.log(`📊 ESTRUCTURA:`);
    console.log(`   Real:     ${realAnalysis.structureScore}/4 componentes`);
    console.log(
      `   Simulado: ${
        Object.values(testCase.simulatedStructure).filter(Boolean).length
      }/4 componentes`
    );

    console.log(`\n🎯 CALIDAD GENERAL:`);
    console.log(`   Real:     ${realAnalysis.qualityScore.toFixed(1)}/5.0`);
    console.log(`   Simulado: ${testCase.simulatedScore}/5.0`);
    console.log(
      `   Diferencia: ${(
        realAnalysis.qualityScore - testCase.simulatedScore
      ).toFixed(1)} puntos`
    );

    console.log(`\n🔍 DETALLES:`);
    console.log(
      `   Análisis:      Real ${
        realAnalysis.hasAnalysis ? "✅" : "❌"
      } vs Simulado ${testCase.simulatedStructure.analysis ? "✅" : "❌"}`
    );
    console.log(
      `   Respuesta:     Real ${
        realAnalysis.hasResponse ? "✅" : "❌"
      } vs Simulado ${testCase.simulatedStructure.response ? "✅" : "❌"}`
    );
    console.log(
      `   Detalles:      Real ${
        realAnalysis.hasDetails ? "✅" : "❌"
      } vs Simulado ${testCase.simulatedStructure.details ? "✅" : "❌"}`
    );
    console.log(
      `   Próximo paso:  Real ${
        realAnalysis.hasNextStep ? "✅" : "❌"
      } vs Simulado ${testCase.simulatedStructure.nextStep ? "✅" : "❌"}`
    );

    console.log(`\n📏 MÉTRICAS ADICIONALES:`);
    console.log(
      `   Empatía:       ${realAnalysis.empathyIndicators ? "✅" : "❌"}`
    );
    console.log(`   Palabras:      ${realAnalysis.wordCount} (óptimo: 80-200)`);

    // Mostrar fragmento de respuesta real
    console.log(`\n📋 FRAGMENTO DE RESPUESTA REAL:`);
    console.log(`"${realResponse.substring(0, 150)}..."`);

    results.push({
      testCase,
      realAnalysis,
      realResponse: realResponse.substring(0, 200) + "...",
    });

    // Pausa entre llamadas
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Resumen final
  console.log("\n📊 RESUMEN COMPARATIVO");
  console.log("=".repeat(80));

  const avgRealQuality =
    results.reduce((sum, r) => sum + r.realAnalysis.qualityScore, 0) /
    results.length;
  const avgSimulatedQuality =
    testCases.reduce((sum, tc) => sum + tc.simulatedScore, 0) /
    testCases.length;

  console.log(`🎯 Calidad promedio:`);
  console.log(`   Real:     ${avgRealQuality.toFixed(2)}/5.0`);
  console.log(`   Simulado: ${avgSimulatedQuality.toFixed(2)}/5.0`);
  console.log(
    `   Diferencia: ${(avgRealQuality - avgSimulatedQuality).toFixed(2)} puntos`
  );

  const avgRealStructure =
    results.reduce((sum, r) => sum + r.realAnalysis.structureScore, 0) /
    results.length;
  const avgSimulatedStructure =
    testCases.reduce(
      (sum, tc) =>
        sum + Object.values(tc.simulatedStructure).filter(Boolean).length,
      0
    ) / testCases.length;

  console.log(`\n📊 Estructura promedio:`);
  console.log(`   Real:     ${avgRealStructure.toFixed(1)}/4 componentes`);
  console.log(`   Simulado: ${avgSimulatedStructure.toFixed(1)}/4 componentes`);
  console.log(
    `   Diferencia: ${(avgRealStructure - avgSimulatedStructure).toFixed(
      1
    )} componentes`
  );

  // Identificar brechas
  console.log(`\n🔍 BRECHAS IDENTIFICADAS:`);

  if (avgRealQuality < avgSimulatedQuality) {
    console.log(
      `❌ La calidad real es ${(avgSimulatedQuality - avgRealQuality).toFixed(
        1
      )} puntos menor que la simulada`
    );
  } else {
    console.log(`✅ La calidad real supera o iguala la simulada`);
  }

  if (avgRealStructure < avgSimulatedStructure) {
    console.log(
      `❌ La estructura real carece de ${(
        avgSimulatedStructure - avgRealStructure
      ).toFixed(1)} componentes en promedio`
    );
  } else {
    console.log(`✅ La estructura real es consistente con la simulada`);
  }

  // Problemas específicos
  const missingNextStep = results.filter(
    (r) => !r.realAnalysis.hasNextStep
  ).length;
  if (missingNextStep > 0) {
    console.log(
      `⚠️  ${missingNextStep}/${results.length} casos no incluyen "próximo paso"`
    );
  }

  const lowEmpathy = results.filter(
    (r) => !r.realAnalysis.empathyIndicators
  ).length;
  if (lowEmpathy > 0) {
    console.log(
      `⚠️  ${lowEmpathy}/${results.length} casos carecen de indicadores de empatía`
    );
  }

  return results;
}

// Ejecutar comparación
compareResponses()
  .then((results) => {
    console.log("\n✅ Comparación completada");
    console.log(`📈 Se analizaron ${results.length} casos exitosamente`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en la comparación:", error);
    process.exit(1);
  });
