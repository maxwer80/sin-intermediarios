-- Script para habilitar el panel de administración
-- Ejecutar en Supabase Studio: http://antigravity-supabase-7b4026-72-60-173-156.traefik.me
-- Menu: SQL Editor

-- 1. Agregar columna obligatoria (si no existe)
ALTER TABLE preguntas ADD COLUMN IF NOT EXISTS obligatoria BOOLEAN DEFAULT false;

-- 2. Agregar políticas RLS para INSERT y DELETE (anon puede hacer CRUD)
-- Esto es necesario para que el panel de admin funcione sin autenticación

-- Política para INSERT
DROP POLICY IF EXISTS "Allow insert for anon" ON preguntas;
CREATE POLICY "Allow insert for anon" ON preguntas
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Política para DELETE
DROP POLICY IF EXISTS "Allow delete for anon" ON preguntas;
CREATE POLICY "Allow delete for anon" ON preguntas
    FOR DELETE
    TO anon
    USING (true);

-- 3. Verificar que las políticas existen
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'preguntas';
