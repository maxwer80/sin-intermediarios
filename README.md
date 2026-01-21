# Sin Intermediarios

Aplicación de preguntas ciudadanas para Noticias Caracol - Sistema gamificado de selección de preguntas.

## 🚀 Despliegue

Esta aplicación puede desplegarse usando Docker/Dokploy.

### Requisitos
- Docker
- Dokploy (opcional, para despliegue en VPS)

### Ejecución local
```bash
docker build -t sin-intermediarios .
docker run -p 8080:80 sin-intermediarios
```
Acceder a: http://localhost:8080

### Configuración
La aplicación se conecta a una instancia de Supabase self-hosted. Las credenciales están configuradas en `app.js`.

## 📁 Estructura
- `index.html` - Página principal
- `app.js` - Lógica de la aplicación y conexión a Supabase
- `data.js` - Datos de respaldo (mock data)
- `styles.css` - Estilos CSS
- `Dockerfile` - Configuración para despliegue Docker

## 🎮 Características
- Sistema de ruleta para selección aleatoria de preguntas
- Temporizador de 60 segundos por pregunta
- Integración con Supabase para persistencia de datos
- Diseño responsivo y animaciones
