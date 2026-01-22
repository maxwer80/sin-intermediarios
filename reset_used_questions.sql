-- Reset all 'usada' questions back to 'aprobada'
UPDATE preguntas
SET estado = 'aprobada', fecha_respuesta = NULL
WHERE estado = 'usada';
