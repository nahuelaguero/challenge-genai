"use client";

export default function ArchitectureDiagram() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Arquitectura Cognitiva - Chatbot &quot;VuelaConNosotros&quot;
        </h2>
        <p className="text-gray-600 mb-6">
          Diagrama de flujo completo con componentes principales y sus
          interacciones
        </p>
      </div>

      {/* Diagrama Mermaid */}
      <div className="bg-white p-6 rounded-lg border shadow-lg">
        <div className="mermaid-container" style={{ textAlign: "center" }}>
          <div
            className="mermaid"
            dangerouslySetInnerHTML={{
              __html: `
                <svg viewBox="0 0 1200 1000" xmlns="http://www.w3.org/2000/svg">
                  <!-- Canales de Entrada -->
                  <g id="input-channels">
                    <rect x="50" y="50" width="120" height="60" rx="10" fill="#e1f5fe" stroke="#0277bd" stroke-width="2"/>
                    <text x="110" y="85" text-anchor="middle" font-size="12" font-weight="bold">💬 Web Chat</text>
                    
                    <rect x="200" y="50" width="120" height="60" rx="10" fill="#e1f5fe" stroke="#0277bd" stroke-width="2"/>
                    <text x="260" y="85" text-anchor="middle" font-size="12" font-weight="bold">📱 WhatsApp</text>
                    
                    <rect x="350" y="50" width="120" height="60" rx="10" fill="#e1f5fe" stroke="#0277bd" stroke-width="2"/>
                    <text x="410" y="85" text-anchor="middle" font-size="12" font-weight="bold">☎️ Teléfono</text>
                    
                    <rect x="500" y="50" width="120" height="60" rx="10" fill="#e1f5fe" stroke="#0277bd" stroke-width="2"/>
                    <text x="560" y="85" text-anchor="middle" font-size="12" font-weight="bold">📲 App Móvil</text>
                  </g>

                  <!-- Flechas hacia abajo -->
                  <g id="arrows-down-1">
                    <path d="M 110 110 L 285 150" stroke="#0277bd" stroke-width="2" marker-end="url(#arrowhead)"/>
                    <path d="M 260 110 L 285 150" stroke="#0277bd" stroke-width="2" marker-end="url(#arrowhead)"/>
                    <path d="M 410 110 L 385 150" stroke="#0277bd" stroke-width="2" marker-end="url(#arrowhead)"/>
                    <path d="M 560 110 L 385 150" stroke="#0277bd" stroke-width="2" marker-end="url(#arrowhead)"/>
                  </g>

                  <!-- Procesamiento de Entrada -->
                  <g id="processing">
                    <rect x="200" y="150" width="200" height="80" rx="10" fill="#e8f5e8" stroke="#2e7d32" stroke-width="2"/>
                    <text x="300" y="175" text-anchor="middle" font-size="14" font-weight="bold">🔍 Procesamiento de Entrada</text>
                    <text x="300" y="195" text-anchor="middle" font-size="10">• Normalización • Autenticación</text>
                    <text x="300" y="210" text-anchor="middle" font-size="10">• Detección Idioma • Análisis Sentimiento</text>
                  </g>

                  <!-- Flecha hacia NLU -->
                  <path d="M 300 230 L 300 280" stroke="#2e7d32" stroke-width="2" marker-end="url(#arrowhead)"/>

                  <!-- Motor NLU -->
                  <g id="nlu">
                    <rect x="200" y="280" width="200" height="80" rx="10" fill="#f3e5f5" stroke="#7b1fa2" stroke-width="2"/>
                    <text x="300" y="305" text-anchor="middle" font-size="14" font-weight="bold">🧠 Motor NLU</text>
                    <text x="300" y="325" text-anchor="middle" font-size="11">Intenciones: Cambiar vuelo, Equipaje</text>
                    <text x="300" y="340" text-anchor="middle" font-size="11">Entidades: Fechas, destinos, nombres</text>
                  </g>

                  <!-- Gestor de Diálogo (izquierda) -->
                  <g id="dialog">
                    <rect x="30" y="300" width="150" height="80" rx="10" fill="#fff3e0" stroke="#f57c00" stroke-width="2"/>
                    <text x="105" y="325" text-anchor="middle" font-size="12" font-weight="bold">💬 Gestor Diálogo</text>
                    <text x="105" y="340" text-anchor="middle" font-size="9">• Estado conversacional</text>
                    <text x="105" y="355" text-anchor="middle" font-size="9">• Contexto multi-turno</text>
                  </g>

                  <!-- Sistemas Backend (derecha) -->
                  <g id="backend">
                    <rect x="420" y="300" width="170" height="110" rx="10" fill="#ffebee" stroke="#d32f2f" stroke-width="2"/>
                    <text x="505" y="325" text-anchor="middle" font-size="12" font-weight="bold">🔌 Sistemas Backend</text>
                    <text x="505" y="345" text-anchor="middle" font-size="9">• GDS (Amadeus/Sabre)</text>
                    <text x="505" y="360" text-anchor="middle" font-size="9">• CRM Clientes</text>
                    <text x="505" y="375" text-anchor="middle" font-size="9">• Facturación/Pagos</text>
                  </g>

                  <!-- Observabilidad / Métricas -->
                  <g id="observability">
                    <rect x="850" y="400" width="200" height="120" rx="10" fill="#ede7f6" stroke="#5e35b1" stroke-width="2"/>
                    <text x="950" y="425" text-anchor="middle" font-size="14" font-weight="bold">📊 Observabilidad</text>
                    <text x="950" y="450" text-anchor="middle" font-size="10">• Monitoring (Prometheus)</text>
                    <text x="950" y="465" text-anchor="middle" font-size="10">• Logging (ELK)</text>
                    <text x="950" y="480" text-anchor="middle" font-size="10">• Tracing (Jaeger)</text>
                  </g>

                  <!-- Agente Humano -->
                  <g id="human-agent">
                    <rect x="420" y="560" width="170" height="60" rx="10" fill="#e0f2f1" stroke="#00897b" stroke-width="2"/>
                    <text x="505" y="590" text-anchor="middle" font-size="13" font-weight="bold">👩‍💼 Agente Humano</text>
                  </g>

                  <!-- Flecha de Escalamiento -->
                  <path d="M 300 500 L 505 560" stroke="#1565c0" stroke-width="2" marker-end="url(#arrowhead)"/>

                  <!-- Motor de Decisiones -->
                  <g id="decisions">
                    <rect x="200" y="420" width="200" height="80" rx="10" fill="#e3f2fd" stroke="#1565c0" stroke-width="2"/>
                    <text x="300" y="445" text-anchor="middle" font-size="14" font-weight="bold">⚙️ Motor de Decisiones</text>
                    <text x="300" y="465" text-anchor="middle" font-size="10">• Políticas • Autorización • Escalamiento</text>
                    <text x="300" y="480" text-anchor="middle" font-size="10">• Reglas de Negocio</text>
                  </g>

                  <!-- Flecha hacia Generador NLG -->
                  <path d="M 300 500 L 300 560" stroke="#1565c0" stroke-width="2" marker-end="url(#arrowhead)"/>

                  <!-- Generador NLG -->
                  <g id="nlg">
                    <rect x="200" y="560" width="200" height="80" rx="10" fill="#fce4ec" stroke="#c2185b" stroke-width="2"/>
                    <text x="300" y="585" text-anchor="middle" font-size="14" font-weight="bold">📝 Generador NLG</text>
                    <text x="300" y="605" text-anchor="middle" font-size="10">• Respuestas Personalizadas</text>
                    <text x="300" y="620" text-anchor="middle" font-size="10">• Adaptación Tono • Estructura</text>
                  </g>

                  <!-- Flecha hacia Respuesta Usuario -->
                  <path d="M 300 640 L 300 700" stroke="#c2185b" stroke-width="2" marker-end="url(#arrowhead)"/>

                  <!-- Respuesta Usuario -->
                  <g id="response">
                    <rect x="200" y="700" width="200" height="60" rx="10" fill="#f5f5f5" stroke="#424242" stroke-width="2"/>
                    <text x="300" y="725" text-anchor="middle" font-size="14" font-weight="bold">📤 Respuesta al Usuario</text>
                    <text x="300" y="745" text-anchor="middle" font-size="10">Información + Acciones + Pasos</text>
                  </g>

                  <!-- Retroalimentación -->
                  <path d="M 400 730 Q 600 730 600 340 Q 600 300 570 340" stroke="#666" stroke-width="2" stroke-dasharray="5,5" marker-end="url(#arrowhead)" fill="none"/>
                  <text x="620" y="500" font-size="10" fill="#666">Retroalimentación</text>

                  <!-- Flujos de Intenciones -->
                  <g id="intent-flows">
                    <!-- Cambiar Vuelo -->
                    <rect x="650" y="100" width="180" height="120" rx="10" fill="#fff8e1" stroke="#ff8f00" stroke-width="2"/>
                    <text x="740" y="125" text-anchor="middle" font-size="12" font-weight="bold">✈️ Flujo: Cambiar Vuelo</text>
                    <text x="740" y="145" text-anchor="middle" font-size="9">1. Usuario: "Cambiar vuelo"</text>
                    <text x="740" y="160" text-anchor="middle" font-size="9">2. NLU: Detecta intención</text>
                    <text x="740" y="175" text-anchor="middle" font-size="9">3. Sistema: Consulta GDS</text>
                    <text x="740" y="190" text-anchor="middle" font-size="9">4. Motor: Aplica políticas</text>
                    <text x="740" y="205" text-anchor="middle" font-size="9">5. Respuesta: Opciones</text>

                    <!-- Consultar Equipaje -->
                    <rect x="650" y="250" width="180" height="120" rx="10" fill="#e8f5e8" stroke="#4caf50" stroke-width="2"/>
                    <text x="740" y="275" text-anchor="middle" font-size="12" font-weight="bold">🧳 Flujo: Equipaje</text>
                    <text x="740" y="295" text-anchor="middle" font-size="9">1. Usuario: "¿Qué equipaje?"</text>
                    <text x="740" y="310" text-anchor="middle" font-size="9">2. NLU: Identifica consulta</text>
                    <text x="740" y="325" text-anchor="middle" font-size="9">3. Base: Conocimiento</text>
                    <text x="740" y="340" text-anchor="middle" font-size="9">4. Motor: Personaliza</text>
                    <text x="740" y="355" text-anchor="middle" font-size="9">5. Respuesta: Info boleto</text>
                  </g>

                  <!-- Escalabilidad -->
                  <g id="scalability">
                    <rect x="850" y="100" width="200" height="270" rx="10" fill="#e3f2fd" stroke="#2196f3" stroke-width="2"/>
                    <text x="950" y="125" text-anchor="middle" font-size="14" font-weight="bold">🚀 Escalabilidad</text>
                    
                    <text x="950" y="155" text-anchor="middle" font-size="12" font-weight="bold">📈 Arquitectura</text>
                    <text x="950" y="175" text-anchor="middle" font-size="9">• Microservicios</text>
                    <text x="950" y="190" text-anchor="middle" font-size="9">• Load Balancing</text>
                    <text x="950" y="205" text-anchor="middle" font-size="9">• Cache Distribuido</text>
                    
                    <text x="950" y="235" text-anchor="middle" font-size="12" font-weight="bold">🧠 Evolución</text>
                    <text x="950" y="255" text-anchor="middle" font-size="9">• Aprendizaje continuo</text>
                    <text x="950" y="270" text-anchor="middle" font-size="9">• A/B Testing</text>
                    <text x="950" y="285" text-anchor="middle" font-size="9">• Mejora automática</text>
                    
                    <text x="950" y="315" text-anchor="middle" font-size="12" font-weight="bold">🔧 Funcionalidades</text>
                    <text x="950" y="335" text-anchor="middle" font-size="9">• Plug-in intenciones</text>
                    <text x="950" y="350" text-anchor="middle" font-size="9">• Conectores sistemas</text>
                  </g>

                  <!-- Definición de puntas de flecha -->
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
                    </marker>
                  </defs>
                </svg>
              `,
            }}
          />
        </div>
      </div>

      {/* Descripción de Componentes */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-4">
            🔄 Flujo Principal
          </h3>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Entrada por múltiples canales</li>
            <li>2. Procesamiento y normalización</li>
            <li>3. Comprensión NLU (intenciones/entidades)</li>
            <li>4. Gestión de diálogo y consulta sistemas</li>
            <li>5. Aplicación de políticas y decisiones</li>
            <li>6. Generación de respuesta personalizada</li>
          </ol>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-4">
            🔗 Conexiones Críticas
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              • <strong>NLU ↔ Gestor Diálogo:</strong> Contexto conversacional
            </li>
            <li>
              • <strong>NLU ↔ Sistemas Backend:</strong> Validación datos
            </li>
            <li>
              • <strong>Backend → Decisiones:</strong> Información en tiempo
              real
            </li>
            <li>
              • <strong>Respuesta → NLU:</strong> Retroalimentación aprendizaje
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-4">
            ⚡ Características Clave
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              • <strong>Escalable:</strong> Arquitectura microservicios
            </li>
            <li>
              • <strong>Inteligente:</strong> Aprendizaje continuo
            </li>
            <li>
              • <strong>Integrado:</strong> Conexión sistemas existentes
            </li>
            <li>
              • <strong>Flexible:</strong> Nuevas intenciones fácil adición
            </li>
          </ul>
        </div>
      </div>

      {/* NUEVA SECCIÓN: Justificaciones Técnicas */}
      <div className="bg-white p-6 rounded-lg border shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          🏗️ Justificaciones de Decisiones Arquitectónicas
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-700 mb-2">
                🎯 Arquitectura Microservicios
              </h4>
              <p className="text-sm text-gray-600">
                <strong>Decisión:</strong> Separar NLU, gestor diálogo y NLG
                como servicios independientes.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Justificación:</strong> Permite escalar cada componente
                según demanda, facilita mantenimiento y despliegue
                independiente. Crítico para aerolíneas con picos de tráfico
                estacionales.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-green-700 mb-2">
                🔄 Gestor de Diálogo Centralizado
              </h4>
              <p className="text-sm text-gray-600">
                <strong>Decisión:</strong> Mantener estado conversacional en
                servicio dedicado con Redis distribuido.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Justificación:</strong> Conversaciones aerolínea son
                multi-turno complejas (cambio vuelo + equipaje + asientos).
                Requiere persistencia de contexto entre sesiones.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-purple-700 mb-2">
                🌐 Integración GDS Híbrida
              </h4>
              <p className="text-sm text-gray-600">
                <strong>Decisión:</strong> Conectar directamente con
                Amadeus/Sabre + cache local + fallback.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Justificación:</strong> GDS tienen latencia alta
                (300-500ms). Cache permite respuestas &lt;100ms para consultas
                frecuentes. Fallback asegura disponibilidad 99.9%.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-orange-700 mb-2">
                📊 Observabilidad Distribuida
              </h4>
              <p className="text-sm text-gray-600">
                <strong>Decisión:</strong> Tracing completo con Jaeger +
                métricas Prometheus + logs ELK.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Justificación:</strong> Debugging conversaciones
                complejas requiere visibilidad completa del flujo. Crítico para
                detectar fallas en cadena de servicios.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NUEVA SECCIÓN: Desafíos Conversacionales */}
      <div className="bg-white p-6 rounded-lg border shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          🚨 Desafíos Conversacionales Específicos
        </h3>
        <div className="space-y-6">
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <h4 className="font-semibold text-red-700 mb-3">
              🔄 Desafío: Cambio de Vuelo con Múltiples Restricciones
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-gray-700 mb-2">
                  ❌ Escenario Problemático:
                </h5>
                <div className="bg-white p-3 rounded border text-sm">
                  <p>
                    <strong>Usuario:</strong> "Necesito cambiar mi vuelo del
                    viernes"
                  </p>
                  <p>
                    <strong>Bot:</strong> "¿A qué fecha deseas cambiarlo?"
                  </p>
                  <p>
                    <strong>Usuario:</strong> "No sé, algo más barato"
                  </p>
                  <p>
                    <strong>Bot:</strong> "¿Qué fechas prefieres?"
                  </p>
                  <p>
                    <strong>Usuario:</strong> "Las que sean más baratas..."
                  </p>
                  <p className="text-red-600 mt-2">
                    <strong>PROBLEMA:</strong> Conversación circular, bot no
                    entiende restricción presupuestaria
                  </p>
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-gray-700 mb-2">
                  ✅ Solución Arquitectónica:
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • <strong>Motor NLU:</strong> Detecta intención implícita
                    "optimizar precio"
                  </li>
                  <li>
                    • <strong>Gestor Diálogo:</strong> Mantiene contexto de
                    restricción presupuestaria
                  </li>
                  <li>
                    • <strong>Backend:</strong> Consulta GDS con filtros de
                    precio
                  </li>
                  <li>
                    • <strong>NLG:</strong> Propone 3 opciones más baratas
                    ordenadas
                  </li>
                  <li>
                    • <strong>Escalamiento:</strong> Si &gt;3 intentos fallidos
                    → agente humano
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
            <h4 className="font-semibold text-orange-700 mb-3">
              🎭 Desafío: Manejo de Emociones en Crisis
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-gray-700 mb-2">
                  🚨 Escenario Crítico:
                </h5>
                <div className="bg-white p-3 rounded border text-sm">
                  <p>
                    <strong>Usuario:</strong> "MI VUELO SE CANCELÓ Y TENGO UNA
                    EMERGENCIA FAMILIAR!!"
                  </p>
                  <p>
                    <strong>Análisis automático:</strong> Sentimiento negativo
                    alto + urgencia + mayúsculas
                  </p>
                  <p className="text-orange-600 mt-2">
                    <strong>DESAFÍO:</strong> Detectar crisis emocional +
                    priorizar + escalar apropiadamente
                  </p>
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-gray-700 mb-2">
                  🎯 Solución Implementada:
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • <strong>Análisis Sentimiento:</strong> Detecta urgencia
                    emocional → prioridad alta
                  </li>
                  <li>
                    • <strong>NLG Empático:</strong> Respuesta inicial:
                    "Entiendo tu situación urgente..."
                  </li>
                  <li>
                    • <strong>Escalamiento Inmediato:</strong> &lt;30 segundos →
                    agente humano especializado
                  </li>
                  <li>
                    • <strong>Contexto Preservado:</strong> Toda la conversación
                    disponible para agente
                  </li>
                  <li>
                    • <strong>SLA Especial:</strong> Casos crisis → resolución
                    &lt;5 minutos
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NUEVA SECCIÓN: Casos de Uso Detallados */}
      <div className="bg-white p-6 rounded-lg border shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          🎬 Casos de Uso Detallados - Ejemplos de Diálogos
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold text-blue-700 mb-3">
                ✅ Caso Exitoso: Cambio de Vuelo
              </h4>
              <div className="space-y-2 text-sm">
                <div className="bg-white p-2 rounded">
                  <p>
                    <strong>👤 Usuario:</strong> "Hola, necesito cambiar mi
                    vuelo de mañana"
                  </p>
                </div>
                <div className="bg-blue-100 p-2 rounded">
                  <p>
                    <strong>🤖 Bot:</strong> "Te ayudo con el cambio de vuelo.
                    Necesito tu localizador o número de boleto."
                  </p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p>
                    <strong>👤 Usuario:</strong> "ABC123"
                  </p>
                </div>
                <div className="bg-blue-100 p-2 rounded">
                  <p>
                    <strong>🤖 Bot:</strong> "Encontré tu vuelo VuelaConNosotros
                    1234 del 15/01 a las 10:30 (Lima→Madrid). Veo que tienes
                    tarifa Flexible sin penalización. ¿A qué fecha deseas
                    cambiar?"
                  </p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p>
                    <strong>👤 Usuario:</strong> "16 de enero por la tarde"
                  </p>
                </div>
                <div className="bg-blue-100 p-2 rounded">
                  <p>
                    <strong>🤖 Bot:</strong> "Perfecto. Tengo 2 opciones para el
                    16/01:
                    <br />
                    🔸 Vuelo 1240 - 15:30 (mismo precio)
                    <br />
                    🔸 Vuelo 1242 - 18:45 (mismo precio)
                    <br />
                    ¿Cuál prefieres?"
                  </p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p>
                    <strong>👤 Usuario:</strong> "El de 18:45"
                  </p>
                </div>
                <div className="bg-blue-100 p-2 rounded">
                  <p>
                    <strong>🤖 Bot:</strong> "¡Cambio realizado! Tu nuevo vuelo
                    es VuelaConNosotros 1242 del 16/01 a las 18:45. He enviado
                    la confirmación a tu email.
                    <br />
                    <br />
                    🔄 <strong>Próximo paso:</strong> Haz check-in online 24h
                    antes del vuelo."
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
              <h4 className="font-semibold text-yellow-700 mb-3">
                ⚠️ Caso Complejo: Múltiples Restricciones
              </h4>
              <div className="space-y-2 text-sm">
                <div className="bg-white p-2 rounded">
                  <p>
                    <strong>👤 Usuario:</strong> "Necesito cambiar mi vuelo pero
                    solo tengo 50 euros extra"
                  </p>
                </div>
                <div className="bg-yellow-100 p-2 rounded">
                  <p>
                    <strong>🤖 Bot:</strong> "Entiendo tu restricción
                    presupuestaria. ¿Podrías darme tu localizador para buscar
                    opciones dentro de tu presupuesto?"
                  </p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p>
                    <strong>👤 Usuario:</strong> "DEF456"
                  </p>
                </div>
                <div className="bg-yellow-100 p-2 rounded">
                  <p>
                    <strong>🤖 Bot:</strong> "Vuelo DEF456 (Barcelona→Roma,
                    20/01). Tu tarifa Basic tiene penalización de 30€. Con tu
                    presupuesto de 50€, tienes 20€ para diferencia de precio.
                    <br />
                    <br />
                    Opciones dentro de tu presupuesto:
                    <br />
                    🔸 21/01 - 08:30 (costo total: 45€)
                    <br />
                    🔸 22/01 - 14:20 (costo total: 35€)
                    <br />
                    <br />
                    ¿Alguna de estas te sirve?"
                  </p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p>
                    <strong>👤 Usuario:</strong> "El 22 está bien"
                  </p>
                </div>
                <div className="bg-yellow-100 p-2 rounded">
                  <p>
                    <strong>🤖 Bot:</strong> "¡Perfecto! He procesado el cambio
                    por 35€ (30€ penalización + 5€ diferencia). Tu nuevo vuelo
                    es el 22/01 a las 14:20.
                    <br />
                    <br />
                    💳 Se cobrará de la tarjeta terminada en 1234.
                    <br />
                    📧 Confirmación enviada a tu email.
                    <br />
                    <br />
                    🔄 <strong>Próximo paso:</strong> Revisar detalles del vuelo
                    y hacer check-in online."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NUEVA SECCIÓN: Estrategia de Evolución Detallada */}
      <div className="bg-white p-6 rounded-lg border shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          📈 Estrategia de Evolución y Escalabilidad - Roadmap 12 Meses
        </h3>
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <h4 className="font-semibold text-green-700 mb-2">
                🚀 Trimestre 1
              </h4>
              <h5 className="text-sm font-semibold mb-2">Base Sólida</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Intenciones core (cambio vuelo, equipaje, check-in)</li>
                <li>• Integración GDS básica</li>
                <li>• Canales Web + WhatsApp</li>
                <li>• Métricas básicas</li>
                <li>• Escalamiento humano simple</li>
              </ul>
            </div>

            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold text-blue-700 mb-2">
                🎯 Trimestre 2
              </h4>
              <h5 className="text-sm font-semibold mb-2">
                Inteligencia Avanzada
              </h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Análisis sentimiento avanzado</li>
                <li>• Personalización ML</li>
                <li>• Predicción intenciones</li>
                <li>• A/B testing automático</li>
                <li>• Voz (Google/Alexa)</li>
              </ul>
            </div>

            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
              <h4 className="font-semibold text-purple-700 mb-2">
                🔧 Trimestre 3
              </h4>
              <h5 className="text-sm font-semibold mb-2">
                Ecosistema Completo
              </h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Integración CRM completa</li>
                <li>• Servicios auxiliares (hoteles, autos)</li>
                <li>• Multidioma (ES, EN, PT)</li>
                <li>• Auto-aprendizaje continuo</li>
                <li>• APIs terceros</li>
              </ul>
            </div>

            <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
              <h4 className="font-semibold text-orange-700 mb-2">
                🌐 Trimestre 4
              </h4>
              <h5 className="text-sm font-semibold mb-2">Expansión Global</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Localización regional</li>
                <li>• Integración partners</li>
                <li>• Predicción proactiva</li>
                <li>• Insights analytics</li>
                <li>• Certificaciones compliance</li>
              </ul>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-gray-700 mb-3">
              ⚙️ Estrategias Técnicas de Escalabilidad
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h5 className="font-semibold text-blue-600 mb-2">
                  🏗️ Arquitectura
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Microservicios independientes</li>
                  <li>• Event-driven architecture</li>
                  <li>• CQRS para lecturas complejas</li>
                  <li>• Auto-scaling horizontal</li>
                  <li>• Circuit breakers</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-green-600 mb-2">
                  🧠 Inteligencia
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Feedback loops automáticos</li>
                  <li>• Reentrenamiento programado</li>
                  <li>• Drift detection</li>
                  <li>• Ensemble models</li>
                  <li>• Edge computing</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-purple-600 mb-2">📊 Datos</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Data lake centralizado</li>
                  <li>• Streaming real-time</li>
                  <li>• ML pipelines automatizados</li>
                  <li>• Synthetic data generation</li>
                  <li>• Privacy-preserving ML</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
