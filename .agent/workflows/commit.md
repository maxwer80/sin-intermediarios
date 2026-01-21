---
description: Subir código al repositorio de GitHub con un mensaje de commit
---

# Workflow: Commit y Push

Este workflow sube todos los cambios al repositorio de GitHub.

## Parámetros requeridos
- **mensaje**: El mensaje de commit (el usuario debe proporcionarlo)

## Pasos

1. Verificar que hay cambios pendientes:
```bash
cd "/Users/johnbalcazar/Documents/SIN INTERMEDIARIOS"
git status
```

// turbo
2. Agregar todos los archivos al staging:
```bash
cd "/Users/johnbalcazar/Documents/SIN INTERMEDIARIOS"
git add .
```

// turbo
3. Crear el commit con el mensaje proporcionado por el usuario:
```bash
cd "/Users/johnbalcazar/Documents/SIN INTERMEDIARIOS"
git commit -m "[MENSAJE DEL USUARIO]"
```

// turbo
4. Subir los cambios a GitHub:
```bash
cd "/Users/johnbalcazar/Documents/SIN INTERMEDIARIOS"
git push origin main
```

5. Confirmar que el push fue exitoso verificando el output del comando.

## Notas
- Si el push falla por autenticación, el usuario debe asegurarse de tener las credenciales de GitHub configuradas.
- Si hay conflictos, informar al usuario y no continuar automáticamente.
