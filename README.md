# Challenge ITTI 2025 - Solución Completa

## 📋 Descripción General

Solución integral para el Challenge Técnico de ITTI 2025, compuesta por dos ejercicios principales:

- **Ejercicio 1**: Prompt Engineering para bot de fintech con técnicas avanzadas
- **Ejercicio 2**: Arquitectura cognitiva para chatbot de aerolínea "VuelaConNosotros"

## 🏗️ Arquitectura del Proyecto

```
challenge-genai/
├── Challenge-genai.ipynb          # Notebook principal con soluciones
├── evaluation-dashboard/          # Dashboard web interactivo
│   ├── src/app/                  # Aplicación Next.js
│   ├── src/components/           # Componentes React
│   └── src/data/                 # Datos de evaluación
└── README.md                     # Esta documentación
```

## 🚀 Cómo Ejecutar

### Prerequisitos

- Python 3.8+ (para Jupyter)
- Node.js 18+ (para el dashboard)
- Clave API de OpenAI (opcional, para testing en vivo)

### 1. Notebook Jupyter

```bash
# Instalar dependencias
pip install jupyter pandas numpy matplotlib

# Ejecutar notebook
jupyter notebook Challenge-genai.ipynb
```

### 2. Dashboard Web

```bash
# Navegar al dashboard
cd evaluation-dashboard

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

El dashboard estará disponible en: http://localhost:3000

### 3. Testing con OpenAI (Opcional)

```bash
export OPENAI_API_KEY="tu-api-key-aqui"
```

## 📊 Funcionalidades

### Dashboard Web

- **📚 Entrega Principal**: Notebook completo con soluciones detalladas
- **🧪 Probador Interactivo**: Testing en tiempo real con GPT-4 real o simulado
- **📊 Casos de Evaluación**: Dataset completo con análisis de casos
- **🏗️ Arquitectura Cognitiva**: Diagrama y documentación completa

### Evaluación Automática

- Dataset de 10 casos de prueba
- Métricas cuantificables (estructura, palabras clave, empatía, etc.)
- Scoring automático con insights

## 🎯 Técnicas Implementadas

### Prompt Engineering

- Role Playing
- Few-Shot Learning
- Chain of Thought
- Structured Output
- In-Context Learning
- Error Handling
- Constraint Definition

### Arquitectura Cognitiva

- Diseño modular de 5 capas
- Manejo de intenciones complejas
- Estrategia de escalabilidad
- Flujos conversacionales detallados

## 📈 Métricas de Calidad

- **Score General**: 80%
- **Estructura**: 100%
- **Palabras Clave**: 91%
- **Manejo de Aclaraciones**: 70%
- **Empatía**: 40% (área de mejora identificada)

## 🔧 Tecnologías Utilizadas

- **Backend**: Python, Jupyter Notebook
- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js
- **Diagramas**: Mermaid
- **API**: OpenAI GPT-4

## 👨‍💻 Autor

Desarrollado para ITTI Challenge 2025

---

_Este proyecto demuestra expertise en prompt engineering, arquitecturas cognitivas y desarrollo full-stack._
