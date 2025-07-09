"use client";

export default function ArchitectureDiagram() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Arquitectura Cognitiva - Chatbot &quot;VuelaConNosotros&quot;
        </h2>
        <p className="text-gray-600">
          Sistema de atención al cliente para aerolínea con procesamiento
          inteligente de consultas
        </p>
      </div>

      {/* Capa de Entrada */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-6 h-6 bg-blue-500 rounded-full mr-3"></div>
          Capa de Entrada (Input Layer)
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-blue-700 mb-2">
              Canales de Entrada
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Chat en vivo (web/móvil)</li>
              <li>• WhatsApp Business API</li>
              <li>• Integración telefónica</li>
              <li>• Aplicación móvil nativa</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-blue-700 mb-2">
              Procesamiento de Texto
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Normalización de texto</li>
              <li>• Corrección ortográfica</li>
              <li>• Detección de idioma</li>
              <li>• Análisis de sentimiento</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-blue-700 mb-2">Autenticación</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Verificación de identidad</li>
              <li>• Acceso a datos de reserva</li>
              <li>• Validación de pasajero</li>
              <li>• Contexto de sesión</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Capa de Procesamiento Cognitivo */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-6 h-6 bg-green-500 rounded-full mr-3"></div>
          Capa de Procesamiento Cognitivo (NLU + Diálogo)
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-green-700 mb-2">NLU Engine</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Detección de intenciones</li>
              <li>• Extracción de entidades</li>
              <li>• Análisis contextual</li>
              <li>• Clasificación de urgencia</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-green-700 mb-2">
              Gestor de Diálogo
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Estado conversacional</li>
              <li>• Manejo de contexto</li>
              <li>• Flujos multi-turno</li>
              <li>• Resolución de ambigüedad</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-green-700 mb-2">
              Motor de Decisiones
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Políticas de la aerolínea</li>
              <li>• Reglas de negocio</li>
              <li>• Autorización de cambios</li>
              <li>• Escalamiento a humanos</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-green-700 mb-2">
              Generación NLG
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Respuestas personalizadas</li>
              <li>• Adaptación de tono</li>
              <li>• Información estructurada</li>
              <li>• Sugerencias proactivas</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Capa de Integración */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-lg border">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-6 h-6 bg-purple-500 rounded-full mr-3"></div>
          Capa de Integración (Sistemas Backend)
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-purple-700 mb-2">
              Sistemas de Reservas
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• GDS (Amadeus/Sabre)</li>
              <li>• Sistema de inventario</li>
              <li>• Gestión de asientos</li>
              <li>• Precios dinámicos</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-purple-700 mb-2">
              APIs Operacionales
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Estado de vuelos</li>
              <li>• Información de equipaje</li>
              <li>• Check-in automático</li>
              <li>• Notificaciones push</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-purple-700 mb-2">
              Servicios Externos
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Información meteorológica</li>
              <li>• Datos de aeropuertos</li>
              <li>• Servicios de pago</li>
              <li>• Sistemas de seguridad</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Flujo de Procesamiento de Consultas */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
          Flujo de Procesamiento de Consultas
        </h3>
        <div className="flex flex-col space-y-4">
          {[
            {
              step: 1,
              color: "blue",
              title: "Recepción",
              desc: "Usuario envía consulta por cualquier canal",
            },
            {
              step: 2,
              color: "green",
              title: "Análisis",
              desc: "NLU procesa intención y extrae entidades",
            },
            {
              step: 3,
              color: "yellow",
              title: "Contexto",
              desc: "Gestor de diálogo mantiene estado conversacional",
            },
            {
              step: 4,
              color: "purple",
              title: "Consulta",
              desc: "Integración con sistemas para obtener datos",
            },
            {
              step: 5,
              color: "red",
              title: "Decisión",
              desc: "Motor aplica políticas y reglas de negocio",
            },
            {
              step: 6,
              color: "indigo",
              title: "Respuesta",
              desc: "NLG genera respuesta personalizada",
            },
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div
                className={`w-10 h-10 bg-${item.color}-500 text-white rounded-full flex items-center justify-center font-bold`}
              >
                {item.step}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
              {index < 5 && (
                <div className="w-0 h-8 border-l-2 border-gray-300 ml-5"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Intenciones Críticas */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-6 h-6 bg-orange-500 rounded-full mr-3"></div>
          Intenciones Críticas Soportadas
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-orange-700 mb-3">
              🔄 Cambiar Vuelo
            </h4>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Capacidades:</strong>
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Búsqueda de vuelos alternativos</li>
                <li>• Cálculo de diferencias de precio</li>
                <li>• Aplicación de políticas de cambio</li>
                <li>• Procesamiento de pagos adicionales</li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Escalamiento:</strong> A agente humano para casos
                complejos
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-orange-700 mb-3">
              🧳 Políticas de Equipaje
            </h4>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Capacidades:</strong>
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Información por tipo de boleto</li>
                <li>• Cálculo de costos adicionales</li>
                <li>• Restricciones por destino</li>
                <li>• Artículos prohibidos/permitidos</li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Especialización:</strong> Base de conocimiento
                actualizada automáticamente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
