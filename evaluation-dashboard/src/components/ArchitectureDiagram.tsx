"use client";

export default function ArchitectureDiagram() {
  return (
    <div className="space-y-8">
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

                  <!-- Flecha hacia NLU (RECTA) -->
                  <path d="M 300 230 L 300 300" stroke="#2e7d32" stroke-width="2" marker-end="url(#arrowhead)"/>

                  <!-- Motor NLU (centrado, bien separado) -->
                  <g id="nlu">
                    <rect x="200" y="300" width="200" height="80" rx="10" fill="#f3e5f5" stroke="#7b1fa2" stroke-width="2"/>
                    <text x="300" y="325" text-anchor="middle" font-size="14" font-weight="bold">🧠 Motor NLU</text>
                    <text x="300" y="345" text-anchor="middle" font-size="11">Intenciones: Cambiar vuelo, Equipaje</text>
                    <text x="300" y="360" text-anchor="middle" font-size="11">Entidades: Fechas, destinos, nombres</text>
                  </g>

                  <!-- CONEXIONES DESDE PROCESAMIENTO -->
                  <path d="M 250 230 L 100 420" stroke="#2e7d32" stroke-width="2" marker-end="url(#arrowhead)"/>
                  <path d="M 350 230 L 640 420" stroke="#2e7d32" stroke-width="2" marker-end="url(#arrowhead)"/>

                  <!-- CONEXIÓN PRINCIPAL: NLU → Gestor Diálogo -->
                  <path d="M 200 340 L 170 420" stroke="#7b1fa2" stroke-width="2" marker-end="url(#arrowhead)"/>
                  
                  <!-- CONEXIÓN CONDICIONAL: NLU → Backend (validación) -->
                  <path d="M 400 340 L 550 420" stroke="#7b1fa2" stroke-width="2" stroke-dasharray="5,5" marker-end="url(#arrowhead)"/>
                  <text x="475" y="365" font-size="10" fill="#7b1fa2">validación</text>

                  <!-- Gestor de Diálogo (izquierda, bien separado) -->
                  <g id="dialog">
                    <rect x="30" y="420" width="170" height="80" rx="10" fill="#fff3e0" stroke="#f57c00" stroke-width="2"/>
                    <text x="115" y="445" text-anchor="middle" font-size="12" font-weight="bold">💬 Gestor Diálogo</text>
                    <text x="115" y="465" text-anchor="middle" font-size="10">• Estado conversacional</text>
                    <text x="115" y="485" text-anchor="middle" font-size="10">• Contexto multi-turno</text>
                  </g>

                  <!-- Sistemas Backend (movido hacia la izquierda) -->
                  <g id="backend">
                    <rect x="550" y="420" width="180" height="100" rx="10" fill="#ffebee" stroke="#d32f2f" stroke-width="2"/>
                    <text x="640" y="445" text-anchor="middle" font-size="12" font-weight="bold">🔌 Sistemas Backend</text>
                    <text x="640" y="465" text-anchor="middle" font-size="10">• GDS (Amadeus/Sabre)</text>
                    <text x="640" y="480" text-anchor="middle" font-size="10">• CRM Clientes</text>
                    <text x="640" y="495" text-anchor="middle" font-size="10">• Facturación/Pagos</text>
                  </g>

                  <!-- Observabilidad / Métricas -->
                  <g id="observability">
                    <rect x="900" y="400" width="200" height="120" rx="10" fill="#ede7f6" stroke="#5e35b1" stroke-width="2"/>
                    <text x="1000" y="425" text-anchor="middle" font-size="14" font-weight="bold">📊 Observabilidad</text>
                    <text x="1000" y="450" text-anchor="middle" font-size="10">• Monitoring (Prometheus)</text>
                    <text x="1000" y="465" text-anchor="middle" font-size="10">• Logging (ELK)</text>
                    <text x="1000" y="480" text-anchor="middle" font-size="10">• Tracing (Jaeger)</text>
                  </g>

                  <!-- Agente Humano (derecha) -->
                  <g id="human-agent">
                    <rect x="500" y="560" width="160" height="60" rx="10" fill="#e0f2f1" stroke="#00897b" stroke-width="2"/>
                    <text x="580" y="595" text-anchor="middle" font-size="13" font-weight="bold">👩‍💼 Agente Humano</text>
                  </g>

                  <!-- Flecha de Escalamiento -->
                  <path d="M 400 590 L 500 590" stroke="#1565c0" stroke-width="2" marker-end="url(#arrowhead)"/>

                  <!-- CONEXIÓN MEJORADA: Gestor Diálogo ↔ Backend (bidireccional) -->
                  <path d="M 200 460 L 550 460" stroke="#f57c00" stroke-width="2" marker-end="url(#arrowhead)"/>
                  <path d="M 550 480 L 200 480" stroke="#d32f2f" stroke-width="2" marker-end="url(#arrowhead)"/>

                  <!-- Motor de Decisiones (alineado con columna central) -->
                  <g id="decisions">
                    <rect x="200" y="550" width="200" height="80" rx="10" fill="#e3f2fd" stroke="#1565c0" stroke-width="2"/>
                    <text x="300" y="575" text-anchor="middle" font-size="14" font-weight="bold">⚙️ Motor de Decisiones</text>
                    <text x="300" y="595" text-anchor="middle" font-size="10">• Políticas • Autorización • Escalamiento</text>
                    <text x="300" y="615" text-anchor="middle" font-size="10">• Reglas de Negocio</text>
                  </g>

                  <!-- CONEXIÓN: NLU → Motor de Decisiones (flujo principal) -->
                  <path d="M 300 380 L 300 550" stroke="#7b1fa2" stroke-width="2" marker-end="url(#arrowhead)"/>
                  
                  <!-- CONEXIÓN: Gestor Diálogo → Motor de Decisiones (coordinación) -->
                  <path d="M 115 500 L 240 570" stroke="#f57c00" stroke-width="2" marker-end="url(#arrowhead)"/>
                  
                  <!-- CONEXIÓN: Backend → Motor de Decisiones (información en tiempo real) -->
                  <path d="M 550 520 L 360 570" stroke="#d32f2f" stroke-width="2" marker-end="url(#arrowhead)"/>
                  <text x="450" y="540" font-size="9" fill="#d32f2f">info tiempo real</text>

                  <!-- Flecha hacia Generador NLG (recta) -->
                  <path d="M 300 630 L 300 680" stroke="#1565c0" stroke-width="2" marker-end="url(#arrowhead)"/>

                  <!-- Generador NLG (alineado con columna central) -->
                  <g id="nlg">
                    <rect x="200" y="680" width="200" height="80" rx="10" fill="#fce4ec" stroke="#c2185b" stroke-width="2"/>
                    <text x="300" y="705" text-anchor="middle" font-size="14" font-weight="bold">📝 Generador NLG</text>
                    <text x="300" y="725" text-anchor="middle" font-size="10">• Respuestas Personalizadas</text>
                    <text x="300" y="745" text-anchor="middle" font-size="10">• Adaptación Tono • Estructura</text>
                  </g>

                  <!-- Flecha hacia Respuesta Usuario (recta) -->
                  <path d="M 300 760 L 300 800" stroke="#c2185b" stroke-width="2" marker-end="url(#arrowhead)"/>

                  <!-- Respuesta Usuario (alineado con columna central) -->
                  <g id="response">
                    <rect x="200" y="800" width="200" height="60" rx="10" fill="#f5f5f5" stroke="#424242" stroke-width="2"/>
                    <text x="300" y="825" text-anchor="middle" font-size="14" font-weight="bold">📤 Respuesta al Usuario</text>
                    <text x="300" y="845" text-anchor="middle" font-size="10">Información + Acciones + Pasos</text>
                  </g>

                  <!-- Retroalimentación -->
                  <path d="M 400 830 Q 600 830 600 370 Q 600 340 400 340" stroke="#666" stroke-width="2" stroke-dasharray="5,5" marker-end="url(#arrowhead)" fill="none"/>
                  <text x="620" y="600" font-size="10" fill="#666">Retroalimentación</text>

                  <!-- Flujos de Intenciones -->
                  <g id="intent-flows">
                    <!-- Cambiar Vuelo -->
                    <rect x="900" y="100" width="180" height="120" rx="10" fill="#fff8e1" stroke="#ff8f00" stroke-width="2"/>
                    <text x="990" y="125" text-anchor="middle" font-size="12" font-weight="bold">✈️ Flujo: Cambiar Vuelo</text>
                    <text x="990" y="145" text-anchor="middle" font-size="9">1. Usuario: "Cambiar vuelo"</text>
                    <text x="990" y="160" text-anchor="middle" font-size="9">2. NLU: Detecta intención</text>
                    <text x="990" y="175" text-anchor="middle" font-size="9">3. Sistema: Consulta GDS</text>
                    <text x="990" y="190" text-anchor="middle" font-size="9">4. Motor: Aplica políticas</text>
                    <text x="990" y="205" text-anchor="middle" font-size="9">5. Respuesta: Opciones</text>

                    <!-- Consultar Equipaje -->
                    <rect x="900" y="250" width="180" height="120" rx="10" fill="#e8f5e8" stroke="#4caf50" stroke-width="2"/>
                    <text x="990" y="275" text-anchor="middle" font-size="12" font-weight="bold">🧳 Flujo: Equipaje</text>
                    <text x="990" y="295" text-anchor="middle" font-size="9">1. Usuario: "¿Qué equipaje?"</text>
                    <text x="990" y="310" text-anchor="middle" font-size="9">2. NLU: Identifica consulta</text>
                    <text x="990" y="325" text-anchor="middle" font-size="9">3. Base: Conocimiento</text>
                    <text x="990" y="340" text-anchor="middle" font-size="9">4. Motor: Personaliza</text>
                    <text x="990" y="355" text-anchor="middle" font-size="9">5. Respuesta: Info boleto</text>
                  </g>

                  <!-- Escalabilidad -->
                  <g id="scalability">
                    <rect x="900" y="620" width="200" height="200" rx="10" fill="#e3f2fd" stroke="#2196f3" stroke-width="2"/>
                    <text x="1000" y="645" text-anchor="middle" font-size="14" font-weight="bold">🚀 Escalabilidad</text>
                    
                    <text x="1000" y="675" text-anchor="middle" font-size="12" font-weight="bold">📈 Arquitectura</text>
                    <text x="1000" y="695" text-anchor="middle" font-size="9">• Microservicios</text>
                    <text x="1000" y="710" text-anchor="middle" font-size="9">• Load Balancing</text>
                    <text x="1000" y="725" text-anchor="middle" font-size="9">• Cache Distribuido</text>
                    
                    <text x="1000" y="755" text-anchor="middle" font-size="12" font-weight="bold">🧠 Evolución</text>
                    <text x="1000" y="775" text-anchor="middle" font-size="9">• Aprendizaje continuo</text>
                    <text x="1000" y="790" text-anchor="middle" font-size="9">• A/B Testing</text>
                    <text x="1000" y="805" text-anchor="middle" font-size="9">• Mejora automática</text>
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

      {/* Métricas y KPIs del Sistema */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-4">
            📊 Métricas de Performance - Paraguay
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              • <strong>Latencia:</strong> &lt;200ms respuesta desde ASU
            </li>
            <li>
              • <strong>Disponibilidad:</strong> 99.9% uptime (crítico
              temporadas altas)
            </li>
            <li>
              • <strong>Precisión NLU:</strong> &gt;95% español, &gt;80% guaraní
            </li>
            <li>
              • <strong>Escalamiento:</strong> 5000+ usuarios concurrentes
              (crisis climáticas)
            </li>
            <li>
              • <strong>Resolución:</strong> 80% consultas, 70% modificaciones,
              60% transacciones
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-4">
            🎯 Casos de Uso Principales - Paraguay
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              • <strong>Reservas y Check-in:</strong> Vuelos domésticos e
              internacionales
            </li>
            <li>
              • <strong>Cambios de Vuelo:</strong> Flexibilidad para eventos
              familiares
            </li>
            <li>
              • <strong>Estado de Vuelos:</strong> Conexiones Asunción-Buenos
              Aires/São Paulo
            </li>
            <li>
              • <strong>Equipaje:</strong> Regulaciones ANAC y destinos
              internacionales
            </li>
            <li>
              • <strong>Documentación:</strong> Cédula MERCOSUR, visas
              USA/Europa
            </li>
            <li>
              • <strong>Clima:</strong> Cancelaciones por tormentas estacionales
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-4">
            ✨ Ventajas Competitivas
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              • <strong>24/7 Disponible:</strong> Sin horarios de atención
            </li>
            <li>
              • <strong>Multicanal:</strong> Web, WhatsApp, teléfono, app
            </li>
            <li>
              • <strong>Contextual:</strong> Recuerda conversaciones previas
            </li>
            <li>
              • <strong>Escalable:</strong> Crece con la demanda
            </li>
            <li>
              • <strong>Aprendizaje:</strong> Mejora continua automática
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
                independiente. Crítico para aerolíneas con picos estacionales y
                eventos masivos (Black Friday, temporadas altas).
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
                <strong>Justificación:</strong> Conversaciones aerolíneas son
                multi-turno complejas (cambio vuelo + equipaje + asientos +
                comida). Requiere persistencia de contexto entre sesiones.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-purple-700 mb-2">
                🌐 Integración GDS Híbrida
              </h4>
              <p className="text-sm text-gray-600">
                <strong>Decisión:</strong> Conectar directamente con GDS
                (Amadeus/Sabre) + cache local + fallback.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Justificación:</strong> Sistemas GDS tienen latencia
                alta (300-500ms). Cache permite respuestas &lt;100ms para
                consultas frecuentes. Fallback asegura disponibilidad 99.9%.
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
          Desafíos Conversacionales Específicos
        </h3>
        <div className="space-y-6">
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <h4 className="font-semibold text-red-700 mb-3">
              Desafío: Cambio de Vuelo con Múltiples Restricciones
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-gray-700 mb-2">
                  ❌ Escenario Problemático:
                </h5>
                <div className="bg-white p-3 rounded border text-sm">
                  <p>
                    <strong>Usuario:</strong> &quot;Necesito cambiar mi vuelo
                    del viernes&quot;
                  </p>
                  <p>
                    <strong>Bot:</strong> &quot;¿A qué fecha deseas
                    cambiarlo?&quot;
                  </p>
                  <p>
                    <strong>Usuario:</strong> &quot;No sé, algo más barato&quot;
                  </p>
                  <p>
                    <strong>Bot:</strong> &quot;¿Qué fechas prefieres?&quot;
                  </p>
                  <p>
                    <strong>Usuario:</strong> &quot;Las que sean más
                    baratas...&quot;
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
                    &quot;optimizar precio&quot;
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
                    <strong>Usuario:</strong> &quot;MI VUELO SE CANCELÓ Y TENGO
                    UNA EMERGENCIA FAMILIAR!!&quot;
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
                    &lt;Entiendo tu situación urgente...&lt;
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
          Casos de Uso Detallados - Ejemplos de Diálogos
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
                    <strong>👤 Usuario:</strong> &quot;Hola, necesito cambiar mi
                    vuelo de mañana&quot;
                  </p>
                </div>
                <div className="bg-blue-100 p-2 rounded">
                  <p>
                    <strong>🤖 Bot:</strong> &quot;Te ayudo con el cambio de
                    vuelo. Necesito tu localizador o número de boleto.&quot;
                  </p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p>
                    <strong>👤 Usuario:</strong> &quot;ABC123&quot;
                  </p>
                </div>
                <div className="bg-blue-100 p-2 rounded">
                  <p>
                    <strong>🤖 Bot:</strong> &quot;Encontré tu vuelo VCN456 del
                    15/01 a las 14:30 (ASU→EZE Buenos Aires). Veo que tienes
                    tarifa Flexible sin penalización. ¿A qué fecha deseas
                    cambiar?&quot;
                  </p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p>
                    <strong>👤 Usuario:</strong> &quot;16 de enero por la
                    tarde&quot;
                  </p>
                </div>
                <div className="bg-blue-100 p-2 rounded">
                  <p>
                    <strong>🤖 Bot:</strong> &quot;Perfecto. Tengo 2 opciones
                    para el 16/01 ASU→EZE:
                    <br />
                    🔸 VCN672 - 15:30 (mismo precio)
                    <br />
                    🔸 VCN684 - 18:45 (mismo precio)
                    <br />
                    ¿Cuál prefieres?&quot;
                  </p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p>
                    <strong>👤 Usuario:</strong> &quot;El de 18:45&quot;
                  </p>
                </div>
                <div className="bg-blue-100 p-2 rounded">
                  <p>
                    <strong>🤖 Bot:</strong> &quot;¡Cambio realizado! Tu nuevo
                    vuelo es VCN684 del 16/01 a las 18:45 ASU→EZE. Confirmación
                    enviada a tu WhatsApp y email.
                    <br />
                    <br />
                    🔄 <strong>Próximo paso:</strong> Check-in online desde 24h
                    antes.&quot;
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
                    <strong>👤 Usuario:</strong> &quot;Necesito cambiar mi vuelo
                    pero solo tengo 50 euros extra&quot;
                  </p>
                </div>
                <div className="bg-yellow-100 p-2 rounded">
                  <p>
                    <strong>🤖 Bot:</strong> &quot;Entiendo tu restricción
                    presupuestaria. ¿Podrías darme tu localizador para buscar
                    opciones dentro de tu presupuesto?&quot;
                  </p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p>
                    <strong>👤 Usuario:</strong> &quot;DEF456&quot;
                  </p>
                </div>
                <div className="bg-yellow-100 p-2 rounded">
                  <p>
                    <strong>🤖 Bot:</strong> &quot;Vuelo DEF456 (Barcelona→Roma,
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
                    ¿Alguna de estas te sirve?&quot;
                  </p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p>
                    <strong>👤 Usuario:</strong> &quot;El 22 está bien&quot;
                  </p>
                </div>
                <div className="bg-yellow-100 p-2 rounded">
                  <p>
                    <strong>🤖 Bot:</strong> &quot;¡Perfecto! He procesado el
                    cambio por 35€ (30€ penalización + 5€ diferencia). Tu nuevo
                    vuelo es el 22/01 a las 14:20.
                    <br />
                    <br />
                    💳 Se cobrará de la tarjeta terminada en 1234.
                    <br />
                    📧 Confirmación enviada a tu email.
                    <br />
                    <br />
                    🔄 <strong>Próximo paso:</strong> Revisar detalles del vuelo
                    y hacer check-in online.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NUEVA SECCIÓN: Ecosistema VuelaConNosotros */}
      <div className="bg-white p-6 rounded-lg border shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          🌐 Ecosistema VuelaConNosotros Paraguay
        </h3>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <h4 className="font-semibold text-green-700 mb-2">
                ✈️ Rutas Principales
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • <strong>MERCOSUR:</strong> ASU→EZE (Buenos Aires), ASU→GRU
                  (São Paulo)
                </li>
                <li>
                  • <strong>Regional:</strong> ASU→LIM (Lima), ASU→SCL
                  (Santiago)
                </li>
                <li>
                  • <strong>Internacionales:</strong> ASU→MIA (Miami), ASU→MAD
                  (Madrid)
                </li>
                <li>
                  • <strong>Domésticos:</strong> ASU→CDE (Ciudad del Este)
                </li>
              </ul>
            </div>

            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold text-blue-700 mb-2">
                🎯 Operaciones Críticas
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • <strong>Temporada alta:</strong> Dic-Mar (vacaciones)
                </li>
                <li>
                  • <strong>Eventos disruptivos:</strong> Tormentas Oct-Mar
                </li>
                <li>
                  • <strong>Conexiones:</strong> Hub ASU para Sudamérica
                </li>
                <li>
                  • <strong>Documentación:</strong> Cédula MERCOSUR, visas
                  USA/Europa
                </li>
              </ul>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-gray-700 mb-3">
              🇵🇾 Contexto Operativo Paraguay
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-blue-600 mb-2">
                  🌍 Regulaciones Locales
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • <strong>ANAC Paraguay:</strong> Autoridad de aviación
                    civil
                  </li>
                  <li>
                    • <strong>Idiomas:</strong> Español prioritario, soporte
                    guaraní
                  </li>
                  <li>
                    • <strong>Horarios:</strong> 5:00-23:00 (operaciones
                    aeropuerto)
                  </li>
                  <li>
                    • <strong>Moneda:</strong> USD para internacionales, ₲ para
                    tasas
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-green-600 mb-2">
                  📱 Canales Culturales
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • <strong>WhatsApp:</strong> 80% población paraguaya activa
                  </li>
                  <li>
                    • <strong>Teléfono:</strong> Generaciones mayores +
                    urgencias
                  </li>
                  <li>
                    • <strong>App/Web:</strong> Viajeros frecuentes corporativos
                  </li>
                  <li>
                    • <strong>SMS:</strong> Notificaciones críticas (gate,
                    delays)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
