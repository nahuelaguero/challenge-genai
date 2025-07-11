# 🛫 Flujo Conversacional VuelaConNosotros - Guía Explicativa

## 📖 Introducción

Este documento te guía paso a paso por el funcionamiento completo del chatbot "VuelaConNosotros" para que entiendas cómo fluye una conversación desde que el usuario escribe un mensaje hasta que recibe una respuesta personalizada.

---

## 🚀 **PASO 1: Canales de Entrada - ¿Cómo llega el usuario?**

El flujo empieza por los **canales de entrada** que se aceptan, que son:

### 💬 **Web Chat**

- El usuario entra al sitio web de VuelaConNosotros y abre el chat
- Ejemplo: "Hola, necesito cambiar mi vuelo de mañana"

### 📱 **WhatsApp**

- El usuario envía un mensaje por WhatsApp Business
- Ejemplo: "Tengo el vuelo cancelado, ¿qué hago?"

### ☎️ **Teléfono**

- El usuario llama y habla por voz (convertida a texto)
- Ejemplo: [Usuario habla] → [Sistema convierte a texto]

### 📲 **App Móvil**

- El usuario usa la aplicación móvil de la aerolínea
- Ejemplo: Usuario abre chat dentro de la app

**¿Por qué múltiples canales?** Porque los pasajeros están en diferentes situaciones: en el aeropuerto (móvil), en casa (web), o urgencias (WhatsApp/teléfono).

---

## 🔍 **PASO 2: Procesamiento de Entrada - Preparando el mensaje**

Una vez que llega el mensaje por cualquier canal, va al **Procesamiento de Entrada**. Aquí ocurren 4 cosas importantes:

### 🧹 **Normalización**

- **Qué significa:** Limpia y estandariza el texto
- **Ejemplo:** "HOLA!!!! necesito ayuda 😱" → "Hola necesito ayuda"
- **Por qué:** Diferentes canales envían texto en formatos distintos

### 🔐 **Autenticación**

- **Qué significa:** Verifica quién es el usuario
- **Ejemplo:** Busca el número de teléfono, email, o localizador de vuelo
- **Por qué:** Necesita saber si es cliente para dar información personalizada

### 🌍 **Detección de Idioma**

- **Qué significa:** Identifica en qué idioma está escribiendo
- **Ejemplo:** "Hello" → Inglés, "Hola" → Español, "Bonjour" → Francés
- **Por qué:** VuelaConNosotros vuela a múltiples países

### 😊 **Análisis de Sentimiento**

- **Qué significa:** Detecta si el usuario está feliz, molesto, o en crisis
- **Ejemplo:** "MI VUELO SE CANCELÓ!!" → Sentimiento: Muy negativo + Urgencia
- **Por qué:** Las personas molestas necesitan atención prioritaria

**Resultado:** El mensaje crudo se convierte en datos estructurados listos para entender.

---

## 🧠 **PASO 3: Motor NLU - Entendiendo la intención**

Ahora viene la parte inteligente: **¿Qué quiere realmente el usuario?**

### 🎯 **Detección de Intenciones**

El sistema identifica **QUÉ** quiere hacer:

**Intenciones principales:**

- **"Cambiar vuelo"** - Usuario: "Necesito cambiar mi vuelo del viernes"
- **"Consultar equipaje"** - Usuario: "¿Cuánto equipaje puedo llevar?"
- **"Estado del vuelo"** - Usuario: "¿A qué hora sale mi vuelo?"
- **"Cancelar vuelo"** - Usuario: "Quiero cancelar mi reserva"
- **"Quejas"** - Usuario: "Mi vuelo llegó tarde y perdí mi conexión"

### 🏷️ **Extracción de Entidades**

El sistema identifica **DETALLES** específicos:

- **Fechas:** "viernes", "15 de enero", "mañana"
- **Destinos:** "Madrid", "Lima", "Barcelona"
- **Nombres:** "Juan Pérez", "María García"
- **Números:** "ABC123" (localizador), "VN1234" (vuelo)
- **Horarios:** "10:30", "por la tarde", "temprano"

**Ejemplo completo:**

- Usuario: "Necesito cambiar mi vuelo ABC123 del viernes a Madrid por algo más barato"
- NLU detecta:
  - **Intención:** Cambiar vuelo
  - **Localizador:** ABC123
  - **Fecha actual:** viernes
  - **Destino:** Madrid
  - **Restricción:** precio (más barato)

---

## 💬 **PASO 4A: Gestor de Diálogo - Manteniendo la conversación**

Paralelamente, el **Gestor de Diálogo** se encarga de:

### 🧵 **Estado Conversacional**

- **Qué significa:** Recuerda de qué estamos hablando
- **Ejemplo:**
  - Turno 1: "Quiero cambiar vuelo"
  - Turno 2: "ABC123" ← El sistema recuerda que está pidiendo localizador
  - Turno 3: "El de 18:45" ← El sistema recuerda que está eligiendo horario

### 🔄 **Contexto Multi-turno**

- **Qué significa:** Mantiene información entre múltiples mensajes
- **Ejemplo:** Usuario sale del chat y vuelve 2 horas después, el sistema recuerda que estaba cambiando un vuelo
- **Por qué:** Las conversaciones de aerolínea son complejas (cambio + equipaje + asientos)

---

## 🔌 **PASO 4B: Sistemas Backend - Consultando la realidad**

Mientras tanto, el sistema consulta **información real** en:

### ✈️ **GDS (Amadeus/Sabre)**

- **Qué es:** Sistemas globales donde están TODOS los vuelos del mundo
- **Qué consulta:** Disponibilidad, precios, horarios en tiempo real
- **Ejemplo:** "¿Hay vuelos Madrid-Lima el 16 de enero?"

### 👤 **CRM de Clientes**

- **Qué es:** Base de datos con información del pasajero
- **Qué consulta:** Historial, preferencias, status (VIP, frecuente)
- **Ejemplo:** "Juan Pérez es cliente platinum, darle prioridad"

### 💳 **Facturación/Pagos**

- **Qué es:** Sistema que maneja dinero y cobros
- **Qué consulta:** Si puede cambiar gratis, cuánto cobrar
- **Ejemplo:** "Su tarifa Basic tiene penalización de 30€"

**Importante:** Todo esto pasa en paralelo y muy rápido (menos de 2 segundos).

---

## ⚙️ **PASO 5: Motor de Decisiones - ¿Qué hacer ahora?**

Con toda la información, el **Motor de Decisiones** decide:

### 📋 **Políticas de la Aerolínea**

- **Ejemplo:** "Cambios gratis solo si queda más de 24h"
- **Ejemplo:** "Clientes VIP no pagan penalizaciones"
- **Ejemplo:** "Vuelos internacionales tienen reglas diferentes"

### 🔐 **Autorización**

- **¿Puede hacer esto?** Verifica permisos del cliente
- **¿Cuánto cuesta?** Calcula precios según tarifa
- **¿Hay disponibilidad?** Confirma que existan opciones

### 🆘 **Decisión de Escalamiento**

- **¿El bot puede resolverlo?** Si es simple → continúa automático
- **¿Necesita humano?** Si es complejo → escala a agente
- **¿Es emergencia?** Si hay crisis → prioridad máxima

**Ejemplos de decisiones:**

- ✅ "Puede cambiar gratis, hay 3 opciones disponibles"
- ⚠️ "Necesita pagar 50€, ¿confirma?"
- 🚨 "Caso complejo, transferir a agente humano"

---

## 📝 **PASO 6: Generador NLG - Creando la respuesta**

Finalmente, el **Generador NLG** crea una respuesta humana:

### 🎨 **Respuestas Personalizadas**

- **Para cliente frecuente:** "Hola María, veo que eres cliente Platinum..."
- **Para cliente nuevo:** "Hola, bienvenido a VuelaConNosotros..."
- **Para situación urgente:** "Entiendo tu preocupación, te ayudo inmediatamente..."

### 🎭 **Adaptación de Tono**

- **Cliente molesto:** Tono empático y disculpas
- **Cliente normal:** Tono profesional y amigable
- **Cliente VIP:** Tono especialmente atento

### 🏗️ **Estructura Clara**

Cada respuesta tiene:

1. **Saludo/Reconocimiento** - "Entiendo que quieres cambiar tu vuelo"
2. **Información específica** - "Tu vuelo ABC123 del 15/01 a las 10:30"
3. **Opciones claras** - "Tienes 2 opciones disponibles:"
4. **Próximo paso** - "¿Cuál opción prefieres?"

---

## 📤 **PASO 7: Respuesta al Usuario - El resultado final**

La respuesta llega al usuario con:

### ℹ️ **Información**

- Datos específicos sobre su consulta
- Estado actual de su reserva
- Opciones disponibles

### 🎬 **Acciones**

- Botones para elegir ("Opción A", "Opción B")
- Enlaces para hacer check-in
- Códigos QR para mostrar en el aeropuerto

### 👣 **Próximos Pasos**

- Qué debe hacer después
- Cuándo debe hacerlo
- Dónde encontrar más información

---

## 🔄 **PASO 8: Retroalimentación - Aprendizaje continuo**

Todo termina pero el sistema aprende:

### 📊 **¿Funcionó bien?**

- ¿El usuario quedó satisfecho?
- ¿Necesitó ayuda adicional?
- ¿Escaló a humano?

### 🧠 **Mejora Automática**

- Si muchos usuarios preguntan lo mismo → crear respuesta automática
- Si algo falló → ajustar el flujo
- Si hay confusión → mejorar detección de intenciones

---

## 🚨 **Casos Especiales: Cuándo las cosas se complican**

### 😡 **Crisis Emocional**

**Usuario:** "MI VUELO SE CANCELÓ Y TENGO UNA EMERGENCIA FAMILIAR!!"

**Flujo especial:**

1. **Análisis sentimiento** detecta: Crisis + Urgencia
2. **Respuesta inmediata:** "Entiendo tu situación urgente, te ayudo YA"
3. **Escalamiento automático:** <30 segundos → agente humano especializado
4. **Contexto completo:** Agente recibe toda la conversación
5. **SLA especial:** Resolución en <5 minutos

### 🔄 **Conversación Circular**

**Problema:** Usuario dice "algo más barato" pero bot no entiende

**Solución:**

1. **Motor NLU** detecta intención implícita: "optimizar precio"
2. **Gestor Diálogo** mantiene contexto: restricción presupuestaria
3. **Backend** consulta opciones ordenadas por precio
4. **NLG** propone: "Estas son las 3 opciones más baratas disponibles"

---

## 🎯 **Ejemplo Completo: De Principio a Fin**

**Escenario:** Usuario quiere cambiar vuelo con restricción de presupuesto

### 1️⃣ **Entrada** (WhatsApp)

**Usuario:** "Necesito cambiar mi vuelo pero solo tengo 50 euros extra"

### 2️⃣ **Procesamiento**

- ✅ Normalización: texto limpio
- ✅ Autenticación: reconoce número WhatsApp → Cliente Juan
- ✅ Idioma: Español
- ✅ Sentimiento: Neutral, con restricción

### 3️⃣ **NLU**

- 🎯 Intención: Cambiar vuelo
- 🏷️ Entidades: Restricción presupuestaria (50€)

### 4️⃣ **Consultas Backend**

- ✈️ GDS: Busca vuelo actual de Juan
- 💳 Facturación: Calcula costos de cambio
- 👤 CRM: Juan es cliente estándar

### 5️⃣ **Motor Decisiones**

- 📋 Política: Tarifa Basic = 30€ penalización
- 🔢 Cálculo: 50€ presupuesto - 30€ penalización = 20€ para diferencia
- ✅ Autorización: Buscar opciones ≤20€ diferencia

### 6️⃣ **NLG Genera**

"Hola Juan, entiendo tu restricción presupuestaria. Tu vuelo DEF456 (Barcelona→Roma, 20/01) tiene penalización de 30€. Con tu presupuesto de 50€, puedes elegir entre:
🔸 21/01 - 08:30 (total: 45€)  
🔸 22/01 - 14:20 (total: 35€)
¿Cuál prefieres?"

### 7️⃣ **Respuesta Usuario**

**Usuario:** "El 22 está bien"

### 8️⃣ **Procesamiento Final**

Sistema ejecuta cambio automáticamente y confirma:
"¡Perfecto! Cambio procesado por 35€. Tu nuevo vuelo es 22/01 a las 14:20. ✅ Confirmación enviada a tu email"

---

## 📈 **Evolución y Escalabilidad**

El sistema está diseñado para crecer:

### 🔧 **Trimestre 1:** Base sólida

- Intenciones básicas funcionando
- Integración GDS estable
- 2 canales (Web + WhatsApp)

### 🎯 **Trimestre 2:** Inteligencia avanzada

- Predicción de intenciones
- Personalización con ML
- Análisis sentimiento refinado

### 🌐 **Trimestre 3:** Ecosistema completo

- Integración con hoteles y autos
- Múltiples idiomas
- Servicios auxiliares

### 🚀 **Trimestre 4:** Expansión global

- Partners internacionales
- Predicción proactiva
- Analytics avanzados

---

## 🎓 **Conclusión**

El chatbot VuelaConNosotros es como tener un empleado de aerolínea súper inteligente que:

- 👂 **Escucha** en múltiples canales
- 🧠 **Entiende** lo que realmente quieres
- 🔍 **Consulta** información real en tiempo real
- 🤔 **Decide** la mejor solución siguiendo políticas
- 💬 **Responde** de manera personalizada y clara
- 📚 **Aprende** de cada conversación para mejorar

Todo esto pasa en menos de 3 segundos, 24/7, en múltiples idiomas, y puede manejar miles de conversaciones simultáneas.

**¿El resultado?** Pasajeros más felices, agentes humanos enfocados en casos complejos, y una aerolínea más eficiente. ✈️
