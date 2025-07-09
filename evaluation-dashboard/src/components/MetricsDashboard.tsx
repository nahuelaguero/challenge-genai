"use client";

export default function MetricsDashboard() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Métricas de Evaluación
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Estructura</h3>
          <p className="text-sm text-gray-600">
            Evalúa componentes específicos del prompt: 🤔 Análisis, 💡
            Respuesta, 📋 Detalles, 🔄 Siguiente paso
          </p>
          <div className="mt-2 text-lg font-bold text-blue-600">30%</div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Keywords</h3>
          <p className="text-sm text-gray-600">
            Palabras clave del contexto específico + términos del dominio
            fintech
          </p>
          <div className="mt-2 text-lg font-bold text-green-600">25%</div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Claridad</h3>
          <p className="text-sm text-gray-600">
            Chain of Thought, manejo de ambigüedad, respuesta a intención
            específica
          </p>
          <div className="mt-2 text-lg font-bold text-yellow-600">20%</div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-2">Longitud</h3>
          <p className="text-sm text-gray-600">
            Rango óptimo 200-800 caracteres para respuestas estructuradas
          </p>
          <div className="mt-2 text-lg font-bold text-purple-600">10%</div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">Empatía</h3>
          <p className="text-sm text-gray-600">
            Palabras empáticas y cortesía específica para servicios financieros
          </p>
          <div className="mt-2 text-lg font-bold text-red-600">15%</div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Características de las Métricas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Especificidad</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Evalúa técnicas específicas de prompting</li>
              <li>• Mide componentes únicos del diseño</li>
              <li>• Alineada con objetivos del challenge</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Transferibilidad</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Mismas funciones en simulado y real</li>
              <li>• Consistencia del 98.5%</li>
              <li>• Sin modificaciones entre sistemas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
