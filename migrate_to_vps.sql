-- ============================================
-- SCRIPT DE MIGRACIÓN A VPS SELF-HOSTED
-- Ejecutar en: http://antigravity-supabase-7b4026-72-60-173-156.traefik.me
-- Usuario: supabase | Contraseña: 1yh2ixzlourtf8mvgburizox8on9uxei
-- ============================================

-- PASO 1: Crear tabla preguntas
CREATE TABLE IF NOT EXISTS preguntas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pregunta TEXT NOT NULL,
    usuario_red_social VARCHAR(100),
    red_social VARCHAR(20) CHECK (red_social IN ('X', 'Instagram', 'Facebook', 'Otra')),
    tema VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada', 'usada')),
    razon_rechazo TEXT,
    candidato_respondio VARCHAR(50),
    fecha_respuesta TIMESTAMPTZ,
    confianza_ia NUMERIC,
    fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
    fecha_actualizacion TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE preguntas IS 'Preguntas ciudadanas para el formato Sin Intermediarios';

-- PASO 2: Crear tabla auditoria
CREATE TABLE IF NOT EXISTS auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pregunta_id UUID REFERENCES preguntas(id),
    accion VARCHAR(50),
    usuario VARCHAR(100),
    detalles JSONB,
    ip_address VARCHAR(50),
    fecha TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE auditoria IS 'Registro de auditoría para transparencia del sistema';

-- PASO 3: Habilitar Row Level Security
ALTER TABLE preguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria ENABLE ROW LEVEL SECURITY;

-- PASO 4: Crear políticas de acceso
CREATE POLICY "Lectura pública de preguntas" ON preguntas FOR SELECT USING (true);
CREATE POLICY "Actualización de preguntas" ON preguntas FOR UPDATE USING (true);
CREATE POLICY "Inserción de preguntas" ON preguntas FOR INSERT WITH CHECK (true);

CREATE POLICY "Lectura de auditoría" ON auditoria FOR SELECT USING (true);
CREATE POLICY "Inserción de auditoría" ON auditoria FOR INSERT WITH CHECK (true);

-- PASO 5: Insertar datos de preguntas
INSERT INTO preguntas (id, pregunta, usuario_red_social, red_social, tema, estado, fecha_creacion, fecha_actualizacion) VALUES
('115337b9-ed7f-41c7-8684-8bde9adeba06', '¿Cuál será su estrategia para combatir el narcotráfico y los grupos armados?', '@felipe_rojas', 'X', 'Seguridad', 'aprobada', '2026-01-21 02:29:25.418023+00', '2026-01-21 02:29:25.418023+00'),
('115b3ad1-0b3f-4934-a7b7-3fa89846df14', '¿Qué inversiones realizará en ciencia, tecnología e innovación?', '@camila_vargas', 'Facebook', 'Educación', 'aprobada', '2026-01-21 02:29:25.418023+00', '2026-01-21 02:29:25.418023+00'),
('2b12b391-6d3c-4364-9f5b-b3fd7c68d3a7', '¿Cómo piensa reducir la inflación sin afectar el empleo en el país?', '@carlos_martinez', 'X', 'Economía', 'aprobada', '2026-01-21 02:29:25.418023+00', '2026-01-21 02:29:25.418023+00'),
('2daa0a61-8383-4da1-8c9a-475f6de76a72', '¿Qué hará para combatir la corrupción en las instituciones del Estado?', '@sofia_moreno', 'Facebook', 'Justicia', 'aprobada', '2026-01-21 02:29:25.418023+00', '2026-01-21 02:29:25.418023+00'),
('5765b5e7-7ab6-4e0c-9d19-98e50b72545e', '¿Cómo abordará la crisis migratoria y la integración de venezolanos en Colombia?', '@andres_jimenez', 'X', 'Política Social', 'aprobada', '2026-01-21 02:29:25.418023+00', '2026-01-21 02:29:25.418023+00'),
('5db074c7-cf75-4f66-9952-c8e741d2b79d', '¿Qué programas implementará para reducir la pobreza extrema en Colombia?', '@carolina_ruiz', 'Instagram', 'Política Social', 'aprobada', '2026-01-21 02:29:25.418023+00', '2026-01-21 02:29:25.418023+00'),
('639b3027-11bc-42dc-999f-c91d300c2d3f', '¿Cuáles son sus planes para mejorar la infraestructura vial del país?', '@roberto_diaz', 'Facebook', 'Infraestructura', 'aprobada', '2026-01-21 02:29:25.418023+00', '2026-01-21 02:29:25.418023+00'),
('8252c37a-8d2e-45a5-b257-3d35871c2c3b', '¿Cómo planea generar más empleos para los jóvenes recién graduados?', '@david_castro', 'X', 'Economía', 'aprobada', '2026-01-21 02:29:25.418023+00', '2026-01-21 02:29:25.418023+00'),
('a4d9bfdc-8c37-4fd9-aa17-6f9e7bca5951', '¿Cuál es su posición sobre la reforma tributaria y cómo afectará a la clase media?', '@miguel_torres', 'X', 'Economía', 'aprobada', '2026-01-21 02:29:25.418023+00', '2026-01-21 02:29:25.418023+00'),
('af4ab1c8-2245-4cdd-866d-ffd673378f0d', '¿Qué propone para garantizar agua potable en todas las regiones del país?', '@valentina_herrera', 'Instagram', 'Infraestructura', 'aprobada', '2026-01-21 02:29:25.418023+00', '2026-01-21 02:29:25.418023+00'),
('d1aec5e4-ac44-4e62-b217-97668a2133e5', '¿Qué medidas tomará para combatir la deforestación en la Amazonía colombiana?', '@pedro_silva', 'Instagram', 'Medio Ambiente', 'aprobada', '2026-01-21 02:29:25.418023+00', '2026-01-21 02:29:25.418023+00'),
('de56fa14-eac7-4153-a10b-104e7737fd2a', '¿Cómo garantizará que la justicia sea más ágil y accesible para todos los ciudadanos?', '@lucia_fernandez', 'X', 'Justicia', 'aprobada', '2026-01-21 02:29:25.418023+00', '2026-01-21 02:29:25.418023+00'),
('e511e646-eaff-4c13-842d-0b75f7204eab', '¿Qué propuestas tiene para garantizar el acceso universal a la salud de calidad?', '@juan_perez', 'Facebook', 'Salud', 'aprobada', '2026-01-21 02:29:25.418023+00', '2026-01-21 02:29:25.418023+00'),
('e5a75409-f535-4551-93b6-c027283e2ed9', '¿Cuál es su plan concreto para mejorar la seguridad en las ciudades principales de Colombia?', '@maria_lopez', 'Instagram', 'Seguridad', 'aprobada', '2026-01-21 02:29:25.418023+00', '2026-01-21 02:29:25.418023+00'),
('f6d4b9b2-058c-419b-befc-fad54663b0d1', '¿Cómo planea mejorar la calidad de la educación pública en zonas rurales?', '@andrea_gomez', 'X', 'Educación', 'aprobada', '2026-01-21 02:29:25.418023+00', '2026-01-21 02:29:25.418023+00');

-- PASO 6: Verificar la migración
SELECT COUNT(*) as total_preguntas FROM preguntas;
