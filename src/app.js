
const express = require('express');
const path = require('path');

// Aplicación web de tareas en memoria con salud y métricas.
function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  const tareas = [];
  const metricas = {
    solicitudes: 0,
    errores: 0,
    inicio: Date.now()
  };

  // Registrar solicitudes para monitoreo.
  app.use((req, res, next) => {
    metricas.solicitudes++;
    const t0 = Date.now();

    res.on('finish', () => {
      if (res.statusCode >= 500) {
        metricas.errores++;
      }

      if (process.env.NODE_ENV !== 'test') {
        console.log(JSON.stringify({
          nivel: 'info',
          metodo: req.method,
          ruta: req.path,
          estado: res.statusCode,
          ms: Date.now() - t0
        }));
      }
    });

    next();
  });

  // Comprobar el estado de la aplicación.
  app.get('/health', (req, res) => {
    res.json({ estado: 'ok' });
  });

  // Consultar métricas de funcionamiento.
  app.get('/metrics', (req, res) => {
    res.json({
      solicitudes: metricas.solicitudes,
      errores: metricas.errores,
      tareas: tareas.length,
      segundosActivo: Math.round(
        (Date.now() - metricas.inicio) / 1000
      )
    });
  });

  // Obtener todas las tareas.
  app.get('/api/tareas', (req, res) => {
    res.json(tareas);
  });

  // Crear una nueva tarea.
  app.post('/api/tareas', (req, res) => {
    const titulo =
      req.body && typeof req.body.titulo === 'string'
        ? req.body.titulo.trim()
        : '';

    if (!titulo) {
      return res.status(400).json({
        error: 'El título es obligatorio'
      });
    }

    const tarea = {
      id: tareas.length
        ? Math.max(...tareas.map(t => t.id)) + 1
        : 1,
      titulo,
      completada: false
    };

    tareas.push(tarea);

    return res.status(201).json(tarea);
  });

  // Cambiar el estado de una tarea.
  app.patch('/api/tareas/:id', (req, res) => {
    const tarea = tareas.find(
      t => t.id === Number(req.params.id)
    );

    if (!tarea) {
      return res.status(404).json({
        error: 'Tarea no encontrada'
      });
    }

    tarea.completada = !tarea.completada;

    return res.json(tarea);
  });

  // NUEVA FUNCIONALIDAD: eliminar una tarea.
  app.delete('/api/tareas/:id', (req, res) => {
    const id = Number(req.params.id);

    const indice = tareas.findIndex(
      t => t.id === id
    );

    if (indice === -1) {
      return res.status(404).json({
        error: 'Tarea no encontrada'
      });
    }

    tareas.splice(indice, 1);

    return res.status(200).json({
      mensaje: 'Tarea eliminada correctamente'
    });
  });

  return app;
}

module.exports = { createApp };
