# Usar nginx para servir archivos estáticos
FROM nginx:alpine

# Copiar archivos de la aplicación principal
COPY index.html /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY data.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY "diseñoux.jpg" /usr/share/nginx/html/

# Copiar archivos del panel de administración
COPY admin.html /usr/share/nginx/html/
COPY admin.js /usr/share/nginx/html/
COPY admin-styles.css /usr/share/nginx/html/

# Exponer puerto 80
EXPOSE 80

# nginx se ejecuta automáticamente
CMD ["nginx", "-g", "daemon off;"]
