# Usar nginx para servir archivos estáticos
FROM nginx:alpine

# Copiar archivos de la aplicación
COPY index.html /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY data.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/

# Copiar assets si existen
COPY *.jpg /usr/share/nginx/html/ 2>/dev/null || true

# Exponer puerto 80
EXPOSE 80

# nginx se ejecuta automáticamente
CMD ["nginx", "-g", "daemon off;"]
