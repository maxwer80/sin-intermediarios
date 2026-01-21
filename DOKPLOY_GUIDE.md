# 🚀 Guía de Despliegue en Dokploy

## Pre-requisitos
- ✅ Repositorio GitHub: `https://github.com/maxwer80/sin-intermediarios.git`
- ✅ VPS con Dokploy instalado
- ✅ Dockerfile configurado en el repo

---

## Paso 1: Acceder a Dokploy

Abre tu panel de Dokploy en el navegador (generalmente `https://tu-ip:3000` o el dominio que hayas configurado).

---

## Paso 2: Crear Nueva Aplicación

1. Click en **"+ Create Service"** o **"Crear Servicio"**
2. Selecciona **"Application"** o **"Aplicación"**

---

## Paso 3: Configurar el Repositorio

| Campo | Valor |
|-------|-------|
| **Source Type** | Git / GitHub |
| **Repository URL** | `https://github.com/maxwer80/sin-intermediarios.git` |
| **Branch** | `main` |
| **Build Type** | Dockerfile |

---

## Paso 4: Configurar el Build

| Campo | Valor |
|-------|-------|
| **Dockerfile Path** | `./Dockerfile` |
| **Docker Context** | `.` |

---

## Paso 5: Configurar el Dominio (Opcional)

1. Ve a la pestaña **"Domains"** o **"Dominios"**
2. Añade tu dominio personalizado o usa el generado por Traefik
3. Habilita **HTTPS** si tienes certificado SSL

---

## Paso 6: Deploy

1. Click en **"Deploy"** o **"Desplegar"**
2. Espera a que el build complete (1-2 minutos)
3. Verifica en los logs que nginx inició correctamente

---

## Paso 7: Verificar

Una vez desplegado, tu aplicación estará disponible en:
- URL de Traefik: `https://sin-intermediarios-xxxxx.traefik.me`
- O tu dominio personalizado

---

## 🔧 Troubleshooting

**Error de build**: Verifica que el Dockerfile esté en la raíz del repositorio.

**Error de conexión a Supabase**: La app está configurada para conectarse a:
```
http://antigravity-supabase-7b4026-72-60-173-156.traefik.me
```
Asegúrate de que tu Supabase VPS esté corriendo.
