-- Agregar IA al constraint de red_social
-- Ejecutar en Supabase Dashboard > SQL Editor

-- 1. Eliminar el constraint actual
ALTER TABLE preguntas DROP CONSTRAINT IF EXISTS preguntas_red_social_check;

-- 2. Crear nuevo constraint incluyendo IA
ALTER TABLE preguntas ADD CONSTRAINT preguntas_red_social_check 
  CHECK (red_social IN ('X', 'Instagram', 'Facebook', 'TikTok', 'WhatsApp', 'IA', 'Otra'));
