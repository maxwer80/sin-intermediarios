
-- Script definitivo para permisos de Admin
-- Ejecuta esto en Supabase Studio -> SQL Editor

-- 1. Asegurar que RLS esté activo
ALTER TABLE preguntas ENABLE ROW LEVEL SECURITY;

-- 2. Limpiar políticas antiguas (para evitar duplicados/errores)
DROP POLICY IF EXISTS "Allow select for anon" ON preguntas;
DROP POLICY IF EXISTS "Allow insert for anon" ON preguntas;
DROP POLICY IF EXISTS "Allow update for anon" ON preguntas;
DROP POLICY IF EXISTS "Allow delete for anon" ON preguntas;

-- 3. Crear TODAS las políticas CRUD para usuarios anónimos (Admin Panel)

-- LECTURA (Ver las preguntas)
CREATE POLICY "Allow select for anon" ON preguntas FOR SELECT TO anon USING (true);

-- CREACIÓN (Subir CSV o nuevas preguntas)
CREATE POLICY "Allow insert for anon" ON preguntas FOR INSERT TO anon WITH CHECK (true);

-- ACTUALIZACIÓN (Aprobar, Editar, Marcar Obligatoria)
CREATE POLICY "Allow update for anon" ON preguntas FOR UPDATE TO anon USING (true);

-- ELIMINACIÓN (Borrar preguntas)
CREATE POLICY "Allow delete for anon" ON preguntas FOR DELETE TO anon USING (true);

-- 4. Verificar
SELECT * FROM pg_policies WHERE tablename = 'preguntas';
