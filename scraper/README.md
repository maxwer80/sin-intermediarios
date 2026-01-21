# Scraper de Comentarios de X/Twitter

Este script extrae comentarios de un tweet de X/Twitter y los guarda como preguntas en Supabase.

## Requisitos

- Node.js 18+ instalado
- Conexión a internet

## Instalación

```bash
cd scraper
npm install
npm run install-browser
```

## Uso

1. Edita `scraper.js` y cambia la URL del tweet si es necesario:
   ```javascript
   const TWEET_URL = 'https://x.com/NoticiasCaracol/status/2013984810562109749';
   ```

2. Ejecuta el scraper:
   ```bash
   npm run scrape
   ```

3. El script:
   - Abrirá una ventana del navegador
   - Navegará al tweet
   - Extraerá los comentarios
   - Los guardará en Supabase con estado "pendiente"

4. Revisa las preguntas en Supabase Studio y aprueba las que quieras usar.

## Notas

- Los comentarios se guardan con estado `pendiente` para que puedas revisarlos
- El script detecta automáticamente el tema basado en palabras clave
- Si X bloquea el acceso, puede que necesites iniciar sesión manualmente
