"use client";

export default function ArchitectureDiagram() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Arquitectura Cognitiva - Chatbot &quot;VuelaConNosotros&quot;
        </h2>
        <p className="text-gray-600">
          Diagrama de flujo con componentes principales y sus interacciones
        </p>
      </div>

      {/* Diagrama Principal con Flechas */}
      <div className="bg-white p-8 rounded-lg border shadow-lg">
        <div className="relative">
          {/* Fila 1: Canales de Entrada */}
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-4 gap-4">
              {[
                { name: "Web Chat", icon: "💬" },
                { name: "WhatsApp", icon: "📱" },
                { name: "Teléfono", icon: "☎️" },
                { name: "App Móvil", icon: "📲" },
              ].map((channel, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-2xl border-2 border-blue-300">
                    {channel.icon}
                  </div>
                  <span className="text-xs mt-1 text-gray-600">
                    {channel.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Flechas hacia abajo */}
          <div className="flex justify-center mb-4">
            <div className="flex flex-col items-center">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-blue-500"></div>
              <div className="w-1 h-6 bg-blue-500"></div>
            </div>
          </div>

          {/* Fila 2: Capa de Procesamiento de Entrada */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-lg border-2 border-green-400 min-w-[300px]">
              <h3 className="text-center font-bold text-green-800 mb-4">
                🔍 Procesamiento de Entrada
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded text-center">
                  Normalización
                </div>
                <div className="bg-white p-2 rounded text-center">
                  Autenticación
                </div>
                <div className="bg-white p-2 rounded text-center">
                  Detección Idioma
                </div>
                <div className="bg-white p-2 rounded text-center">
                  Análisis Sentimiento
                </div>
              </div>
            </div>
          </div>

          {/* Flechas hacia abajo */}
          <div className="flex justify-center mb-4">
            <div className="flex flex-col items-center">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-green-500"></div>
              <div className="w-1 h-6 bg-green-500"></div>
            </div>
          </div>

          {/* Fila 3: Motor NLU */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-6 rounded-lg border-2 border-purple-400 min-w-[350px]">
              <h3 className="text-center font-bold text-purple-800 mb-4">
                🧠 Motor NLU (Comprensión)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="font-semibold text-purple-700">
                    Intenciones
                  </div>
                  <div className="text-xs text-gray-600">
                    Cambiar vuelo, Consultar equipaje
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="font-semibold text-purple-700">Entidades</div>
                  <div className="text-xs text-gray-600">
                    Fechas, destinos, nombres
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flechas bidireccionales hacia los lados */}
          <div className="flex justify-between items-center mb-8">
            {/* Flecha izquierda hacia Gestor de Diálogo */}
            <div className="flex items-center">
              <div className="w-0 h-0 border-t-[12px] border-b-[12px] border-r-[20px] border-t-transparent border-b-transparent border-r-orange-500"></div>
              <div className="w-6 h-1 bg-orange-500"></div>
              <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-4 rounded-lg border-2 border-orange-400 min-w-[200px]">
                <h4 className="font-bold text-orange-800 text-center mb-2">
                  💬 Gestor de Diálogo
                </h4>
                <div className="text-xs text-gray-600 text-center">
                  <div>• Estado conversacional</div>
                  <div>• Contexto multi-turno</div>
                  <div>• Resolución ambigüedad</div>
                </div>
              </div>
            </div>

            {/* Flecha derecha hacia Sistemas Backend */}
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-red-100 to-red-200 p-4 rounded-lg border-2 border-red-400 min-w-[200px]">
                <h4 className="font-bold text-red-800 text-center mb-2">
                  🔌 Sistemas Backend
                </h4>
                <div className="text-xs text-gray-600 text-center">
                  <div>• GDS (Amadeus/Sabre)</div>
                  <div>• Estado de vuelos</div>
                  <div>• Inventario asientos</div>
                </div>
              </div>
              <div className="w-6 h-1 bg-red-500"></div>
              <div className="w-0 h-0 border-t-[12px] border-b-[12px] border-l-[20px] border-t-transparent border-b-transparent border-l-red-500"></div>
            </div>
          </div>

          {/* Flechas hacia abajo desde ambos lados */}
          <div className="flex justify-center mb-4">
            <div className="flex flex-col items-center">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-indigo-500"></div>
              <div className="w-1 h-6 bg-indigo-500"></div>
            </div>
          </div>

          {/* Fila 4: Motor de Decisiones */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-indigo-100 to-indigo-200 p-6 rounded-lg border-2 border-indigo-400 min-w-[400px]">
              <h3 className="text-center font-bold text-indigo-800 mb-4">
                ⚙️ Motor de Decisiones
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="font-semibold text-indigo-700">Políticas</div>
                  <div className="text-xs text-gray-600">
                    Cambios, cancelaciones
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="font-semibold text-indigo-700">
                    Autorización
                  </div>
                  <div className="text-xs text-gray-600">Límites, permisos</div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="font-semibold text-indigo-700">
                    Escalamiento
                  </div>
                  <div className="text-xs text-gray-600">A agente humano</div>
                </div>
              </div>
            </div>
          </div>

          {/* Flechas hacia abajo */}
          <div className="flex justify-center mb-4">
            <div className="flex flex-col items-center">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-pink-500"></div>
              <div className="w-1 h-6 bg-pink-500"></div>
            </div>
          </div>

          {/* Fila 5: Generador de Respuestas */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-pink-100 to-pink-200 p-6 rounded-lg border-2 border-pink-400 min-w-[350px]">
              <h3 className="text-center font-bold text-pink-800 mb-4">
                📝 Generador de Respuestas (NLG)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="font-semibold text-pink-700">
                    Personalización
                  </div>
                  <div className="text-xs text-gray-600">
                    Tono, contexto usuario
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="font-semibold text-pink-700">
                    Estructuración
                  </div>
                  <div className="text-xs text-gray-600">
                    Formato, sugerencias
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flechas hacia abajo */}
          <div className="flex justify-center mb-4">
            <div className="flex flex-col items-center">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-gray-500"></div>
              <div className="w-1 h-6 bg-gray-500"></div>
            </div>
          </div>

          {/* Fila 6: Salida al Usuario */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg border-2 border-gray-400 min-w-[300px]">
              <h3 className="text-center font-bold text-gray-800 mb-4">
                📤 Respuesta al Usuario
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="font-semibold text-gray-700">Información</div>
                  <div className="text-xs text-gray-600">Datos solicitados</div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="font-semibold text-gray-700">Acciones</div>
                  <div className="text-xs text-gray-600">
                    Confirmación, pasos
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flecha de retroalimentación (curva) */}
          <div className="absolute right-0 top-1/2 transform translate-x-8">
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-600 mb-2 whitespace-nowrap">
                Retroalimentación
              </div>
              <div className="w-1 h-32 bg-gray-400"></div>
              <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-gray-400"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Flujos de Intenciones Críticas */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border">
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
          🔄 Flujos de Intenciones Críticas
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Flujo: Cambiar Vuelo */}
          <div className="bg-white p-6 rounded-lg border">
            <h4 className="font-bold text-orange-700 mb-4 flex items-center">
              <span className="mr-2">✈️</span>
              Flujo: Cambiar Vuelo
            </h4>
            <div className="space-y-3">
              {[
                {
                  step: "1",
                  text: "Usuario: 'Necesito cambiar mi vuelo'",
                  color: "blue",
                },
                {
                  step: "2",
                  text: "NLU: Detecta intención + extrae datos",
                  color: "green",
                },
                {
                  step: "3",
                  text: "Sistema: Consulta GDS disponibilidad",
                  color: "purple",
                },
                {
                  step: "4",
                  text: "Motor: Aplica políticas de cambio",
                  color: "red",
                },
                {
                  step: "5",
                  text: "NLG: Genera opciones personalizadas",
                  color: "orange",
                },
                {
                  step: "6",
                  text: "Respuesta: 'Opciones disponibles...'",
                  color: "gray",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 bg-${item.color}-500 text-white rounded-full flex items-center justify-center text-xs font-bold`}
                  >
                    {item.step}
                  </div>
                  <span className="text-sm text-gray-700">{item.text}</span>
                  {index < 5 && (
                    <div className="w-0 h-4 border-l border-gray-300 ml-3"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Flujo: Consultar Equipaje */}
          <div className="bg-white p-6 rounded-lg border">
            <h4 className="font-bold text-orange-700 mb-4 flex items-center">
              <span className="mr-2">🧳</span>
              Flujo: Consultar Equipaje
            </h4>
            <div className="space-y-3">
              {[
                {
                  step: "1",
                  text: "Usuario: '¿Qué equipaje puedo llevar?'",
                  color: "blue",
                },
                {
                  step: "2",
                  text: "NLU: Identifica consulta + tipo boleto",
                  color: "green",
                },
                {
                  step: "3",
                  text: "Sistema: Accede a base conocimiento",
                  color: "purple",
                },
                {
                  step: "4",
                  text: "Motor: Personaliza según destino",
                  color: "red",
                },
                {
                  step: "5",
                  text: "NLG: Estructura respuesta completa",
                  color: "orange",
                },
                {
                  step: "6",
                  text: "Respuesta: 'Según tu boleto...'",
                  color: "gray",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 bg-${item.color}-500 text-white rounded-full flex items-center justify-center text-xs font-bold`}
                  >
                    {item.step}
                  </div>
                  <span className="text-sm text-gray-700">{item.text}</span>
                  {index < 5 && (
                    <div className="w-0 h-4 border-l border-gray-300 ml-3"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Estrategia de Escalabilidad */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg border">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
          🚀 Estrategia de Escalabilidad y Evolución
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold text-cyan-700 mb-2">
              📈 Escalabilidad
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Microservicios independientes</li>
              <li>• Load balancing inteligente</li>
              <li>• Cache distribuido</li>
              <li>• APIs RESTful modulares</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold text-cyan-700 mb-2">
              🧠 Evolución Continua
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Aprendizaje de interacciones</li>
              <li>• A/B testing de respuestas</li>
              <li>• Mejora automática NLU</li>
              <li>• Análisis de sentiment trends</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold text-cyan-700 mb-2">
              🔧 Nuevas Funcionalidades
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Plug-in de intenciones</li>
              <li>• Conectores de sistemas</li>
              <li>• Templates personalizables</li>
              <li>• Multi-idioma dinámico</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
