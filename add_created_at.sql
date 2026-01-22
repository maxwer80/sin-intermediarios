-- Script para agregar columna de fecha de creación
-- Ejecutar en Supabase Studio

-- 1. Agregar columna created_at si no existe
ALTER TABLE preguntas ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Verificar que se agregó
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'preguntas';
