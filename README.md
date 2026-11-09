# Plantilla DevOps — Electiva 1 (ITLA 2026-C-3)

Aplicación web mínima (lista de tareas) con todo lo necesario para practicar un pipeline **CI/CD** sin cuentas pagas ni Azure:

| Pieza | Archivo | Para qué sirve |
|---|---|---|
| App Node.js/Express | `src/app.js`, `src/server.js` | API de tareas + `/health` y `/metrics` |
| Frontend estático | `public/index.html` | Se publica en GitHub Pages |
| Pruebas automatizadas | `tests/app.test.js` | Jest + Supertest con cobertura |
| Contenedor | `Dockerfile` | Imagen de producción con *healthcheck* |
| Pipeline | `.github/workflows/ci.yml` | Lint → pruebas → build Docker → deploy a Pages |

## Requisitos (gratis)
- Cuenta de **GitHub** (usa un repositorio **público**: GitHub Actions es gratuito).
- **Git** y **Node.js 20+**. Opcional para probar el contenedor en tu PC: **Docker Desktop**.

## Ejecutar en tu computadora
```bash
npm install
npm test          # pruebas + cobertura
npm start         # http://localhost:3000
```
Endpoints: `GET /health`, `GET /metrics`, `GET/POST /api/tareas`, `PATCH /api/tareas/:id`.

Con Docker:
```bash
docker build -t tareas-devops .
docker run -p 3000:3000 tareas-devops
```

## Subirlo a GitHub y activar el pipeline
1. Crea un repositorio **público** vacío en GitHub (sin README).
2. En la carpeta de la plantilla:
   ```bash
   git init
   git add .
   git commit -m "Plantilla inicial"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Source: GitHub Actions**.
4. Abre la pestaña **Actions**: verás el workflow *CI/CD* ejecutándose. Cuando termine, la URL de tu página aparece en el job *Despliegue a GitHub Pages*.

## Práctica 3 — qué debes agregar
- Al menos **2 pruebas nuevas** (por ejemplo: borrar tareas, validar títulos largos).
- Una funcionalidad nueva pequeña con su prueba (ej. `DELETE /api/tareas/:id`).
- Provocar a propósito una prueba fallida, mostrar que el pipeline se pone en **rojo**, corregirla y mostrarlo en **verde**.
- Completar este README con la explicación de cada etapa del pipeline.

## Proyecto Final — cómo extenderla
- Persistencia con **SQLite** (o MongoDB) en lugar del arreglo en memoria.
- Publicar la imagen en **GitHub Container Registry** (`ghcr.io`) desde el pipeline.
- Análisis estático real (ESLint) y umbral de cobertura mínima.
- Monitoreo: usar `/metrics` y los logs JSON; definir al menos una **alerta** (ej. errores > 0).
- Documentar: guía de instalación, manual de operaciones y lecciones aprendidas.




## Implementación de la Práctica 3

**Estudiante:** Jeffrey Mercado  
**Matrícula:** 2022-0443  
**Sección:** TDS-015

### Funcionalidad implementada

Se agregó el endpoint DELETE /api/tareas/:id para eliminar
tareas existentes. Si el identificador no existe, devuelve
el código HTTP 404.

### Pruebas automatizadas

La plantilla incluía seis pruebas originales. Se agregaron
dos pruebas nuevas para verificar:

1. La eliminación correcta de una tarea.
2. La respuesta HTTP 404 al eliminar una tarea inexistente.

Resultado: 8 pruebas exitosas y 93.61 % de cobertura
de líneas en la ejecución local.

### Etapas del pipeline CI/CD

1. Checkout: descarga el código del repositorio de GitHub.

2. Instalación: prepara Node.js e instala las dependencias
   necesarias para ejecutar el proyecto.

3. Pruebas: ejecuta Jest para comprobar el funcionamiento
   de la API y obtener un reporte de cobertura.

4. Construcción: verifica que el proyecto pueda
   construirse como imagen Docker.

5. Despliegue: publica el frontend estático mediante
   GitHub Pages cuando las etapas anteriores terminan
   correctamente.

### Problema encontrado y solución

La primera ejecución del pipeline falló porque GitHub
Pages todavía no estaba habilitado.

Se corrigió desde Settings > Pages, seleccionando
GitHub Actions como fuente de publicación.

Después de repetir el pipeline, las etapas de construcción,
pruebas y despliegue finalizaron correctamente.

### Enlaces del proyecto

Repositorio:
https://github.com/Jeffrey29600/practica3-cicd-devops

Aplicación publicada:
https://jeffrey29600.github.io/practica3-cicd-devops/
