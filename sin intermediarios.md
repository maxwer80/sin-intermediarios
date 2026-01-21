  
Especificación de requerimientos para aplicación gamificada "Sin Intermediarios"  
Compartido por john  
Esta es una copia de una conversación entre Claude y john. El contenido puede incluir material no verificado o no seguro que no representa las opiniones de Anthropic. La instantánea compartida puede contener archivos adjuntos y datos que no se muestran aquí.  
necesito que me generes un documento de documento de especificacion de requerimientos para desarrollar un juego gamificado o aplicativo que haga esto : Título del formato  
“SIN INTERMEDIARIOS”:  Cuando la pregunta la hace el país.  
Tipo de formato  
\* APLICACION GAMIFICADA  
Concepto  
“SIN INTERMEDIARIO” es un formato televisivo innovador en el que candidatos presidenciales en Colombia responden, en tiempo real, preguntas reales hechas por ciudadanos en las redes sociales de Noticias Caracol, seleccionadas de manera aleatoria y transparente.   
La idea es que se suban todas las preguntas que se le hicieron a lo candidatos en una hoja de cálculo o en una base de datos como supabase   
Objetivo editorial   
\* Humanizar la figura política sin perder rigor.   
\* Promover la transparencia y la rendición de cuentas.   
\* Renovar el lenguaje de la entrevista política tradicional.  
Público objetivo  
\* Ciudadanos votantes entre 18 y 60 años.   
\* Audiencia digital y televisiva interesada en política, actualidad y democracia.   
\* Usuarios activos de redes sociales.  
 Activación del juego   
El candidato toma el iPad y presiona el botón:  
🔵 COMENZAR  
Se activa una animación gráfica que refuerza: con animación random de preguntas.

1. Aparición de la pregunta En pantalla aparece:  
2. Pregunta (texto grande).  
3. Usuario de X o de qué red viene (opcional).  
4. Tema al que pertenece.  
5. Contador visual (60–90 segundos). Gráfica sobria, institucional, moderna. Con los colores de noticias caracol   
* 

Repetición

* Se realizan de 5  a 10 preguntas por segmento.

Reglas claras   
Las preguntas provienen exclusivamente de ciudadanos reales.   
\* Filtro previo automático:   
   \* Lenguaje respetuoso.   
   \* Coherencia temática.   
   \* No insultos, no ataques personales.   
\* El candidato no puede elegir, cambiar ni rechazar la pregunta.   
\* El medio no edita ni altera el contenido de la pregunta.  
Viabilidad técnica  
\* iPad con app dedicada.   
\* Moderación automática con IA \+ supervisión editorial.   
\* Sistema seguro, auditable y replicable.         
Utilizara supabase como base de datos  
Mostrar menos  
7:50 PM

# **Documento de Especificación de Requerimientos (SRS)**

## **Aplicación Gamificada "SIN INTERMEDIARIOS"**

---

## **1\. INFORMACIÓN GENERAL DEL PROYECTO**

### **1.1 Identificación del Proyecto**

* Nombre del proyecto: SIN INTERMEDIARIOS \- Aplicación Gamificada  
* Versión del documento: 1.0  
* Fecha: 20 de enero de 2026  
* Cliente: Noticias Caracol  
* Tipo de aplicación: Aplicación web/tablet gamificada para formato televisivo

### **1.2 Propósito del Documento**

Este documento define los requerimientos funcionales y no funcionales para el desarrollo de una aplicación gamificada que permita a candidatos presidenciales en Colombia responder preguntas ciudadanas en tiempo real, de manera aleatoria y transparente.

### **1.3 Alcance del Proyecto**

La aplicación permitirá la recolección, moderación, almacenamiento y presentación aleatoria de preguntas ciudadanas realizadas a través de redes sociales de Noticias Caracol, para ser respondidas en vivo durante un formato televisivo.  
---

## **2\. DESCRIPCIÓN GENERAL**

### **2.1 Concepto Editorial**

"SIN INTERMEDIARIOS" es un formato que elimina la intermediación tradicional en entrevistas políticas, permitiendo que ciudadanos reales formulen preguntas directamente a candidatos presidenciales, seleccionadas de manera aleatoria y sin posibilidad de manipulación.

### **2.2 Objetivos del Formato**

* Humanizar la figura política manteniendo rigor periodístico  
* Promover transparencia y rendición de cuentas  
* Renovar el lenguaje de la entrevista política tradicional  
* Generar confianza ciudadana mediante un sistema auditable

### **2.3 Público Objetivo**

* Ciudadanos votantes entre 18 y 60 años  
* Audiencia digital y televisiva interesada en política  
* Usuarios activos de redes sociales (X, Instagram, Facebook)

---

## **3\. REQUERIMIENTOS FUNCIONALES**

### **3.1 Módulo de Recolección de Preguntas**

#### **RF-001: Importación de Preguntas**

Prioridad: Alta  
Descripción: El sistema debe permitir importar preguntas desde múltiples fuentes.  
Criterios de aceptación:

* Importación manual mediante formulario web  
* Carga masiva desde archivo CSV/Excel  
* Integración con APIs de redes sociales (X, Instagram, Facebook)  
* Captura de metadatos: usuario, red social, fecha, hora

#### **RF-002: Almacenamiento en Base de Datos**

Prioridad: Alta  
Descripción: Todas las preguntas deben almacenarse en Supabase con estructura definida.  
Estructura de datos mínima:  
\- id: UUID (único)  
\- pregunta: TEXT  
\- usuario\_red\_social: VARCHAR(255)  
\- red\_social: ENUM('X', 'Instagram', 'Facebook', 'Otra')  
\- tema: VARCHAR(100)  
\- fecha\_creacion: TIMESTAMP  
\- estado: ENUM('pendiente', 'aprobada', 'rechazada', 'usada')  
\- razon\_rechazo: TEXT (opcional)  
\- candidato\_respondio: VARCHAR(255) (opcional)

\- fecha\_respuesta: TIMESTAMP (opcional)

### **3.2 Módulo de Moderación**

#### **RF-003: Filtro Automático con IA**

Prioridad: Alta  
Descripción: Sistema de moderación automática que evalúa cada pregunta.  
Criterios de validación:

* Detección de lenguaje ofensivo o insultos  
* Identificación de ataques personales  
* Verificación de coherencia temática  
* Detección de spam o contenido irrelevante  
* Clasificación automática por temas

Categorías de temas sugeridas:

* Economía  
* Seguridad  
* Salud  
* Educación  
* Medio Ambiente  
* Justicia  
* Infraestructura  
* Política Social  
* Otros

#### **RF-004: Supervisión Editorial**

Prioridad: Alta  
Descripción: Panel de administración para revisión manual.  
Funcionalidades:

* Dashboard con preguntas en estado "pendiente"  
* Aprobar/rechazar preguntas con justificación  
* Editar categorización de temas (sin alterar contenido)  
* Ver historial de moderación  
* Estadísticas de moderación (% aprobadas, rechazadas, por tema)

### **3.3 Módulo de Aplicación para Tablet (iPad)**

#### **RF-005: Pantalla de Inicio**

Prioridad: Alta  
Descripción: Interfaz inicial simple y clara.  
Elementos:

* Logo de Noticias Caracol  
* Título "SIN INTERMEDIARIOS"  
* Botón grande "COMENZAR" (color azul institucional)  
* Contador de preguntas disponibles  
* Indicador del candidato actual (opcional)

#### **RF-006: Animación de Selección Aleatoria**

Prioridad: Alta  
Descripción: Animación que muestre la aleatoriedad del proceso.  
Características:

* Animación de preguntas desplazándose rápidamente (efecto "slot machine")  
* Duración: 3-5 segundos  
* Transparencia del proceso  
* No permite intervención durante la animación

#### **RF-007: Presentación de Pregunta**

Prioridad: Alta  
Descripción: Visualización clara y legible de la pregunta seleccionada.  
Elementos en pantalla:

* Pregunta completa (texto grande, tipografía legible)  
* Usuario de la red social (formato: @usuario o anónimo)  
* Icono de la red social de origen  
* Etiqueta del tema/categoría  
* Contador visual (temporizador de 60-90 segundos)  
* Botón "SIGUIENTE PREGUNTA"

Diseño:

* Paleta de colores de Noticias Caracol (azul, rojo, blanco)  
* Diseño sobrio e institucional  
* Optimizado para lectura en TV  
* Responsive para diferentes tamaños de iPad

#### **RF-008: Temporizador**

Prioridad: Media  
Descripción: Contador regresivo para tiempo de respuesta.  
Funcionalidades:

* Tiempo configurable (60-90 segundos)  
* Alerta visual cuando quedan 10 segundos  
* Pausa manual (solo para producción)  
* Reinicio si es necesario

#### **RF-009: Navegación de Preguntas**

Prioridad: Alta  
Descripción: Sistema de avance entre preguntas.  
Reglas:

* Botón "SIGUIENTE PREGUNTA" activa nueva selección aleatoria  
* No permite retroceder a pregunta anterior  
* No permite omitir preguntas sin responder  
* Límite de 5-10 preguntas por sesión (configurable)  
* Marca automáticamente pregunta como "usada"

#### **RF-010: Registro de Respuestas**

Prioridad: Media  
Descripción: El sistema registra automáticamente qué preguntas fueron respondidas.  
Datos registrados:

* Candidato que respondió  
* Fecha y hora de respuesta  
* Duración de la respuesta (opcional)  
* Cambio de estado a "usada"

### **3.4 Módulo de Administración y Reportes**

#### **RF-011: Panel de Control**

Prioridad: Media  
Descripción: Dashboard administrativo para gestión completa.  
Funcionalidades:

* Vista general de preguntas (todas, aprobadas, pendientes, usadas)  
* Filtros por estado, tema, red social, fecha  
* Búsqueda por texto  
* Exportación de datos (CSV, Excel)

#### **RF-012: Configuración del Sistema**

Prioridad: Media  
Descripción: Parámetros configurables del sistema.  
Configuraciones:

* Tiempo de respuesta por pregunta  
* Número de preguntas por sesión  
* Temas activos/inactivos  
* Palabras clave de filtro  
* Sensibilidad del filtro de IA

#### **RF-013: Auditoría y Trazabilidad**

Prioridad: Alta  
Descripción: Sistema completo de auditoría para transparencia.  
Registros:

* Log de todas las preguntas mostradas  
* Historial de cambios de estado  
* Registro de acciones de moderadores  
* Timestamp de todas las operaciones  
* IP y usuario que realizó cada acción

#### **RF-014: Reportes**

Prioridad: Media  
Descripción: Generación de reportes analíticos.  
Tipos de reportes:

* Preguntas por tema  
* Preguntas por red social  
* Tasa de aprobación/rechazo  
* Preguntas respondidas por candidato  
* Estadísticas de tiempo de respuesta

---

## **4\. REQUERIMIENTOS NO FUNCIONALES**

### **4.1 Rendimiento**

RNF-001: La aplicación debe cargar una pregunta nueva en menos de 2 segundos.  
RNF-002: La animación de selección debe ejecutarse sin interrupciones (60 fps mínimo).  
RNF-003: El sistema debe soportar al menos 10,000 preguntas en base de datos sin degradación.

### **4.2 Seguridad**

RNF-004: Autenticación obligatoria para acceso al panel de administración.  
RNF-005: Encriptación de datos sensibles en Supabase.  
RNF-006: Sistema de roles (Admin, Moderador, Operador de iPad).  
RNF-007: Logs de auditoría inmutables.  
RNF-008: Protección contra inyección SQL y XSS.  
RNF-009: Rate limiting para prevenir ataques DDoS.

### **4.3 Usabilidad**

RNF-010: Interfaz intuitiva que no requiera capacitación extensa.  
RNF-011: Botones grandes y táctiles optimizados para iPad.  
RNF-012: Tipografía legible desde 3 metros de distancia (para TV).  
RNF-013: Feedback visual inmediato en todas las acciones.

### **4.4 Disponibilidad**

RNF-014: Disponibilidad del 99.5% durante horarios de emisión.  
RNF-015: Sistema de backup automático diario.  
RNF-016: Recuperación ante fallos en menos de 5 minutos.

### **4.5 Compatibilidad**

RNF-017: Compatible con iPad Pro (2018 o superior).  
RNF-018: Compatible con iPadOS 15 o superior.  
RNF-019: Panel web compatible con Chrome, Firefox, Safari (últimas 2 versiones).  
RNF-020: Diseño responsive para diferentes tamaños de pantalla en panel admin.

### **4.6 Mantenibilidad**

RNF-021: Código documentado y comentado.  
RNF-022: Arquitectura modular para facilitar actualizaciones.  
RNF-023: Variables de entorno para configuraciones.  
RNF-024: Uso de componentes reutilizables.

### **4.7 Escalabilidad**

RNF-025: Arquitectura preparada para múltiples candidatos simultáneos.  
RNF-026: Base de datos diseñada para crecimiento de millones de preguntas.  
RNF-027: API REST para futuras integraciones.  
---

## **5\. ARQUITECTURA DEL SISTEMA**

### **5.1 Stack Tecnológico Propuesto**

Frontend (Aplicación iPad):

* React Native o PWA (Progressive Web App)  
* Tailwind CSS para estilos  
* Animations: Framer Motion o GSAP

Backend:

* Supabase (BaaS \- Backend as a Service)  
  * PostgreSQL como base de datos  
  * Supabase Auth para autenticación  
  * Supabase Storage para archivos (si aplica)  
  * Row Level Security (RLS) para seguridad

IA y Moderación:

* API de Claude (Anthropic) para moderación de contenido  
* Análisis de sentimientos y detección de lenguaje ofensivo  
* Clasificación automática de temas

Hosting:

* Vercel o Netlify para frontend  
* Supabase Cloud para backend

### **5.2 Diagrama de Componentes**

┌─────────────────────────────────────────────────────────┐  
│                    REDES SOCIALES                       │  
│              (X, Instagram, Facebook)                   │  
└────────────────────┬────────────────────────────────────┘  
                     │  
                     ▼  
┌─────────────────────────────────────────────────────────┐  
│              MÓDULO DE RECOLECCIÓN                      │  
│         (APIs \+ Importación Manual/CSV)                 │  
└────────────────────┬────────────────────────────────────┘  
                     │  
                     ▼  
┌─────────────────────────────────────────────────────────┐  
│           MODERACIÓN AUTOMÁTICA (IA)                    │  
│      (Filtro de lenguaje \+ Clasificación)               │  
└────────────────────┬────────────────────────────────────┘  
                     │  
                     ▼  
┌─────────────────────────────────────────────────────────┐  
│              SUPABASE DATABASE                          │  
│         (Preguntas \+ Metadatos \+ Logs)                  │  
└───────┬──────────────────────────────────────┬──────────┘  
        │                                      │  
        ▼                                      ▼  
┌──────────────────────┐          ┌───────────────────────┐  
│  PANEL ADMIN WEB     │          │   APP TABLET (iPad)   │  
│  (Moderación Manual) │          │  (Presentación Live)  │

└──────────────────────┘          └───────────────────────┘

### **5.3 Flujo de Datos**

1. Recolección: Preguntas llegan desde redes sociales → Sistema de recolección  
2. Almacenamiento: Preguntas se guardan en Supabase con estado "pendiente"  
3. Moderación IA: Filtro automático evalúa y clasifica  
4. Supervisión: Moderadores revisan y aprueban/rechazan  
5. Estado "Aprobada": Pregunta disponible para selección aleatoria  
6. Selección Live: App de iPad consulta preguntas aprobadas → Selección aleatoria  
7. Presentación: Pregunta se muestra en pantalla  
8. Registro: Sistema marca pregunta como "usada" y registra respuesta

---

## **6\. REGLAS DE NEGOCIO**

### **6.1 Reglas de Selección de Preguntas**

RN-001: Solo preguntas con estado "aprobada" pueden ser seleccionadas.  
RN-002: Una pregunta solo puede ser usada una vez por candidato.  
RN-003: La selección debe ser verdaderamente aleatoria (sin sesgo).  
RN-004: El candidato no puede rechazar ni cambiar preguntas.  
RN-005: El medio no puede editar el contenido de las preguntas aprobadas.

### **6.2 Reglas de Moderación**

RN-006: Preguntas con lenguaje ofensivo son rechazadas automáticamente.  
RN-007: Ataques personales directos son rechazados.  
RN-008: Preguntas incoherentes o spam son filtradas.  
RN-009: Moderadores no pueden aprobar preguntas previamente rechazadas por IA sin justificación.  
RN-010: Toda decisión de moderación debe quedar registrada.

### **6.3 Reglas de Tiempo**

RN-011: Tiempo de respuesta configurable entre 60-90 segundos.  
RN-012: Número de preguntas por sesión: 5-10 (configurable).  
RN-013: Tiempo de animación de selección: 3-5 segundos fijos.  
---

## **7\. CASOS DE USO PRINCIPALES**

### **CU-001: Importar Preguntas desde CSV**

Actor: Administrador  
Precondición: Usuario autenticado como administrador  
Flujo principal:

1. Administrador accede al panel de importación  
2. Selecciona archivo CSV con formato correcto  
3. Sistema valida formato y contenido  
4. Sistema importa preguntas a Supabase  
5. Sistema ejecuta moderación automática  
6. Sistema muestra resumen de importación

Postcondición: Preguntas importadas y en estado "pendiente" o "aprobada"

### **CU-002: Moderar Pregunta Manualmente**

Actor: Moderador  
Precondición: Usuario autenticado como moderador, preguntas pendientes disponibles  
Flujo principal:

1. Moderador accede a dashboard de moderación  
2. Sistema muestra lista de preguntas pendientes  
3. Moderador selecciona una pregunta  
4. Moderador revisa contenido y recomendación de IA  
5. Moderador decide aprobar o rechazar  
6. Si rechaza, ingresa motivo  
7. Sistema actualiza estado de pregunta  
8. Sistema registra acción en log de auditoría

Postcondición: Pregunta aprobada o rechazada con justificación

### **CU-003: Responder Preguntas en Vivo (Candidato)**

Actor: Candidato, Operador técnico  
Precondición: App de iPad abierta, preguntas aprobadas disponibles  
Flujo principal:

1. Candidato presiona botón "COMENZAR"  
2. Sistema ejecuta animación de selección aleatoria  
3. Sistema selecciona pregunta aleatoria de pool de aprobadas  
4. Sistema muestra pregunta completa en pantalla  
5. Sistema inicia temporizador (60-90 seg)  
6. Candidato responde pregunta  
7. Al finalizar, candidato presiona "SIGUIENTE PREGUNTA"  
8. Sistema marca pregunta como "usada"  
9. Se repite proceso hasta completar 5-10 preguntas

Postcondición: Preguntas respondidas y marcadas como usadas

### **CU-004: Consultar Auditoría**

Actor: Administrador, Auditor externo  
Precondición: Usuario autenticado con permisos  
Flujo principal:

1. Usuario accede a sección de auditoría  
2. Sistema muestra log completo de acciones  
3. Usuario aplica filtros (fecha, acción, usuario)  
4. Sistema muestra resultados filtrados  
5. Usuario exporta reporte si es necesario

Postcondición: Información de auditoría visualizada/exportada  
---

## **8\. DISEÑO DE INTERFAZ (UI/UX)**

### **8.1 Principios de Diseño**

* Minimalismo y claridad  
* Identidad visual de Noticias Caracol  
* Accesibilidad (WCAG 2.1 nivel AA)  
* Optimización para lectura en TV  
* Feedback inmediato en interacciones

### **8.2 Paleta de Colores**

Colores institucionales de Noticias Caracol:

* Azul principal: \#0033A0  
* Rojo secundario: \#E30613  
* Blanco: \#FFFFFF  
* Gris claro: \#F5F5F5  
* Gris texto: \#333333

### **8.3 Tipografía**

* Pregunta principal: Sans-serif bold, 32-40pt  
* Metadatos: Sans-serif regular, 18-24pt  
* Botones: Sans-serif bold, 24pt  
* Sugerencia: Roboto, Open Sans o similar

### **8.4 Wireframes Básicos**

#### **Pantalla de Inicio (iPad)**

┌────────────────────────────────────────┐  
│                                        │  
│        \[Logo Noticias Caracol\]         │  
│                                        │  
│       SIN INTERMEDIARIOS               │  
│                                        │  
│                                        │  
│         ┌──────────────────┐           │  
│         │   COMENZAR   │           │  
│         └──────────────────┘           │  
│                                        │  
│     Preguntas disponibles: 47          │  
│                                        │

└────────────────────────────────────────┘

#### **Pantalla de Pregunta (iPad)**

┌────────────────────────────────────────┐  
│  \[@usuario\_twitter\] • Twitter • Economía│  
│                                        │  
│  ¿Cómo piensa reducir la inflación     │  
│  sin afectar el empleo en el país?     │  
│                                        │  
│                                        │  
│         \[●●●●●●○○○○\] 60s               │  
│                                        │  
│                                        │  
│      ┌──────────────────────┐          │  
│      │ SIGUIENTE PREGUNTA │          │  
│      └──────────────────────┘          │  
│                                        │

└────────────────────────────────────────┘

#### **Dashboard de Moderación (Web)**

┌──────────────────────────────────────────────┐  
│ Noticias Caracol | Sin Intermediarios        │  
├──────────────────────────────────────────────┤  
│ \[Dashboard\] \[Moderación\] \[Reportes\] \[Config\] │  
├──────────────────────────────────────────────┤  
│                                              │  
│ Preguntas Pendientes (23)                    │  
│ ┌──────────────────────────────────────────┐ │  
│ │ "¿Qué hará con la reforma tributaria?"  │ │  
│ │ @user123 • Twitter • Economía            │ │  
│ │ IA: ✓ Aprobada (95% confianza)           │ │  
│ │ \[✓ Aprobar\] \[✗ Rechazar\] \[Ver detalles\] │ │  
│ └──────────────────────────────────────────┘ │  
│ ┌──────────────────────────────────────────┐ │  
│ │ "¿Por qué no hace nada por seguridad?"  │ │  
│ │ @user456 • Instagram • Seguridad         │ │  
│ │ IA: ⚠ Revisar (lenguaje tendencioso)     │ │  
│ │ \[✓ Aprobar\] \[✗ Rechazar\] \[Ver detalles\] │ │  
│ └──────────────────────────────────────────┘ │  
│                                              │

└──────────────────────────────────────────────┘

---

## **9\. PLAN DE IMPLEMENTACIÓN**

### **9.1 Fases del Proyecto**

#### **Fase 1: Fundación (Semanas 1-2)**

* Configuración de Supabase (database, auth, RLS)  
* Diseño de esquema de base de datos  
* Configuración de repositorio y CI/CD  
* Diseño de arquitectura detallada

Entregables:

* Base de datos funcional  
* Esquema documentado  
* Repositorio configurado

#### **Fase 2: Backend y Moderación (Semanas 3-4)**

* API REST con Supabase  
* Sistema de importación de preguntas (CSV, manual)  
* Integración con IA para moderación automática  
* Panel de moderación manual (versión básica)

Entregables:

* API funcional  
* Sistema de moderación operativo  
* Panel admin básico

#### **Fase 3: Aplicación iPad (Semanas 5-6)**

* Desarrollo de interfaz para iPad  
* Implementación de selección aleatoria  
* Animaciones y transiciones  
* Sistema de temporizador  
* Integración con backend

Entregables:

* App de iPad funcional  
* Animaciones implementadas  
* Integración completa

#### **Fase 4: Pulimento y Testing (Semana 7\)**

* Pruebas de usabilidad  
* Ajustes de diseño visual  
* Optimización de rendimiento  
* Testing en dispositivos reales  
* Corrección de bugs

Entregables:

* Aplicación optimizada  
* Bugs críticos resueltos  
* Documentación de usuario

#### **Fase 5: Despliegue y Capacitación (Semana 8\)**

* Despliegue en producción  
* Capacitación a moderadores y operadores  
* Documentación técnica  
* Plan de soporte  
* Monitoreo inicial

Entregables:

* Sistema en producción  
* Personal capacitado  
* Documentación completa

### **9.2 Recursos Necesarios**

Equipo técnico:

* 1 Líder técnico / Arquitecto (8 semanas)  
* 1-2 Desarrolladores fullstack (8 semanas)  
* 1 Diseñador UI/UX (3 semanas)  
* 1 QA Tester (2 semanas)

Infraestructura:

* Cuenta Supabase (plan Pro recomendado)  
* Cuenta API de Claude (Anthropic)  
* Hosting para frontend (Vercel/Netlify)  
* iPad Pro para pruebas  
* Dominios y certificados SSL

---

## **10\. TESTING Y CALIDAD**

### **10.1 Tipos de Pruebas**

#### **Pruebas Unitarias**

* Funciones de moderación de IA  
* Lógica de selección aleatoria  
* Validaciones de datos  
* Cálculos de tiempo

#### **Pruebas de Integración**

* Conexión con Supabase  
* API de moderación con IA  
* Flujo completo de pregunta (recolección → moderación → presentación)

#### **Pruebas de Interfaz**

* Usabilidad en iPad  
* Responsive design en panel admin  
* Animaciones y transiciones  
* Accesibilidad (WCAG)

#### **Pruebas de Rendimiento**

* Carga de 10,000+ preguntas  
* Tiempo de respuesta de API  
* Fluidez de animaciones  
* Concurrencia de usuarios en panel admin

#### **Pruebas de Seguridad**

* Autenticación y autorización  
* Inyección SQL  
* XSS y CSRF  
* Auditoría de logs

### **10.2 Criterios de Aceptación Global**

* Todas las funcionalidades críticas operan sin errores  
* Tiempo de carga de pregunta \< 2 segundos  
* Animación fluida a 60 fps  
* Panel admin accesible desde navegadores principales  
* Sistema de auditoría registra todas las acciones  
* Moderación por IA con 90%+ de precisión  
* App de iPad estable durante 2 horas continuas  
* Documentación completa y clara

---

## **11\. CONSIDERACIONES DE SEGURIDAD Y PRIVACIDAD**

### **11.1 Protección de Datos Personales**

* Cumplimiento con Ley 1581 de 2012 (Colombia) \- Habeas Data  
* Almacenamiento seguro de datos de usuarios de redes sociales  
* Anonimización opcional de usuarios si es requerido  
* Política de retención de datos clara

### **11.2 Seguridad de Acceso**

* Autenticación de dos factores (2FA) para administradores  
* Gestión de roles y permisos granular  
* Sesiones con timeout automático  
* Logs de acceso completos

### **11.3 Integridad del Sistema**

* Prevención de manipulación de resultados aleatorios  
* Sistema de auditoría inmutable  
* Backups automáticos diarios  
* Plan de recuperación ante desastres

---

## **12\. MANTENIMIENTO Y SOPORTE**

### **12.1 Soporte Post-Lanzamiento**

* Soporte técnico durante los primeros 3 meses  
* Corrección de bugs críticos (respuesta en 4 horas)  
* Corrección de bugs menores (respuesta en 48 horas)  
* Actualizaciones de seguridad

### **12.2 Actualizaciones Futuras (Roadmap)**

Versión 1.1 (Posibles mejoras):

* Integración con más redes sociales (TikTok, WhatsApp)  
* Sistema de votación ciudadana de preguntas  
* Estadísticas en tiempo real durante la emisión  
* Múltiples idiomas

Versión 2.0 (Visión a largo plazo):

* IA generativa para análisis de respuestas  
* Sistema de fact-checking en tiempo real  
* Integración con sistemas de verificación de identidad  
* Plataforma multi-país

---

## **13\. RIESGOS Y MITIGACIÓN**

| Riesgo | Probabilidad | Impacto | Mitigación |
| ----- | ----- | ----- | ----- |
| Fallo de Supabase durante emisión en vivo | Baja | Alto | Sistema de backup local, plan de contingencia |
| IA aprueba contenido inapropiado | Media | Alto | Revisión manual obligatoria, ajuste de sensibilidad |
| Manipulación del sistema aleatorio | Baja | Crítico | Auditoría de código, logs inmutables, transparencia |
| Ataque DDoS al panel de moderación | Media | Medio | Rate limiting, CDN, monitoreo 24/7 |
| Problemas de conectividad en iPad | Media | Alto | Caché local de preguntas, modo offline |
| Rechazo de candidatos al formato | Media | Crítico | Acuerdos previos, demostración de transparencia |

---

## **14\. MÉTRICAS DE ÉXITO**

### **KPIs Técnicos**

* Uptime del sistema: \>99.5%  
* Tiempo de carga de pregunta: \<2 segundos  
* Tasa de error: \<0.1%  
* Precisión de moderación IA: \>90%

### **KPIs de Negocio**

* Número de preguntas recolectadas por día: meta 500+  
* Tasa de participación ciudadana (preguntas enviadas): meta 10,000+  
* Rating de transparencia del sistema (encuestas): meta 8/10  
* Número de candidatos que participan: meta 100%

### **KPIs de Contenido**

* Diversidad de temas (distribución equitativa): \<30% en un solo tema  
* Preguntas respondidas por candidato: 5-10 por sesión  
* Tiempo promedio de respuesta: 60-90 segundos

---

## **15\. DOCUMENTACIÓN REQUERIDA**

### **15.1 Documentación Técnica**

* Manual de instalación y configuración  
* Documentación de API  
* Diagrama de arquitectura  
* Guía de contribución al código  
* Documentación de base de datos

### **15.2 Documentación de Usuario**

* Manual de operación de iPad  
* Guía de moderación  
* Tutorial de panel de administración  
* FAQ para productores de TV

### **15.3 Documentación Legal**

* Términos y condiciones de uso  
* Política de privacidad  
* Consentimientos de participación ciudadana  
* Acuerdos con candidatos

---

## **16\. PRESUPUESTO ESTIMADO (REFERENCIAL)**

### **Desarrollo (8 semanas**

Continuar  
7:52 PM  
)

* Equipo de desarrollo: USD $25,000 \- $40,000  
* Diseño UI/UX: USD $3,000 \- $5,000  
* QA y Testing: USD $2,000 \- $3,000

### **Infraestructura (primer año)**

* Supabase (plan Pro): USD $300 \- $600/año  
* API Claude (moderación IA): USD $1,000 \- $2,000/año  
* Hosting frontend: USD $200/año  
* Dominios y SSL: USD $100/año

### **Hardware**

* iPad Pro: USD $1,000 \- $1,500 (por dispositivo)

### **Contingencia**

* 15-20% del presupuesto total

Total estimado: USD $32,000 \- $53,000 (desarrollo \+ primer año operación)  
---

## **17\. GLOSARIO**

* Gamificación: Aplicación de elementos de juego en contextos no lúdicos  
* Supabase: Plataforma de backend como servicio basada en PostgreSQL  
* RLS (Row Level Security): Sistema de seguridad a nivel de filas en base de datos  
* IA (Inteligencia Artificial): Tecnología para análisis y moderación automática  
* API REST: Interfaz de programación de aplicaciones basada en arquitectura REST  
* PWA (Progressive Web App): Aplicación web que funciona como app nativa  
* Moderación: Proceso de revisión y aprobación de contenido  
* Aleatoriedad: Selección sin patrón predecible ni sesgo  
* Auditoría: Registro completo de acciones para transparencia

---

## **18\. APROBACIONES**

| Rol | Nombre | Firma | Fecha |
| ----- | ----- | ----- | ----- |
| Sponsor del Proyecto |  |  |  |
| Director Editorial |  |  |  |
| Líder Técnico |  |  |  |
| Product Owner |  |  |  |

---

## **19\. CONTROL DE VERSIONES**

| Versión | Fecha | Autor | Cambios |
| ----- | ----- | ----- | ----- |
| 1.0 | 20/01/2026 | Equipo Técnico | Documento inicial |

---

Fin del Documento de Especificación de Requerimientos  
---

## **ANEXOS**

### **Anexo A: Ejemplo de Estructura CSV para Importación**

csv  
pregunta,usuario,red\_social,tema  
"¿Cómo reducirá la inflación?",@user123,Twitter,Economía  
"¿Qué hará por la educación pública?",@user456,Instagram,Educación

"¿Cuál es su plan de seguridad?",@user789,Facebook,Seguridad

### **Anexo B: Ejemplo de Respuesta API de Moderación**

json  
{  
  "pregunta\_id": "uuid-1234",  
  "estado": "aprobada",  
  "confianza": 0.95,  
  "tema\_detectado": "Economía",  
  "lenguaje\_ofensivo": false,  
  "ataque\_personal": false,  
  "coherencia": true,  
  "recomendacion": "aprobar"

}

### **Anexo C: Códigos de Estado de Preguntas**

* pendiente: Pregunta importada, esperando moderación  
* aprobada: Pregunta lista para ser seleccionada  
* rechazada: Pregunta no cumple criterios  
* usada: Pregunta ya respondida por candidato

