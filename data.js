/**
 * SIN INTERMEDIARIOS - Mock Data
 * Sample questions for testing without Supabase connection
 */

const mockQuestions = [
    {
        id: '1',
        pregunta: '¿Cómo piensa reducir la inflación sin afectar el empleo en el país?',
        usuario_red_social: '@carlos_martinez',
        red_social: 'X',
        tema: 'Economía',
        estado: 'aprobada'
    },
    {
        id: '2',
        pregunta: '¿Cuál es su plan concreto para mejorar la seguridad en las ciudades principales de Colombia?',
        usuario_red_social: '@maria_lopez',
        red_social: 'Instagram',
        tema: 'Seguridad',
        estado: 'aprobada'
    },
    {
        id: '3',
        pregunta: '¿Qué propuestas tiene para garantizar el acceso universal a la salud de calidad?',
        usuario_red_social: '@juan_perez',
        red_social: 'Facebook',
        tema: 'Salud',
        estado: 'aprobada'
    },
    {
        id: '4',
        pregunta: '¿Cómo planea mejorar la calidad de la educación pública en zonas rurales?',
        usuario_red_social: '@andrea_gomez',
        red_social: 'X',
        tema: 'Educación',
        estado: 'aprobada'
    },
    {
        id: '5',
        pregunta: '¿Qué medidas tomará para combatir la deforestación en la Amazonía colombiana?',
        usuario_red_social: '@pedro_silva',
        red_social: 'Instagram',
        tema: 'Medio Ambiente',
        estado: 'aprobada'
    },
    {
        id: '6',
        pregunta: '¿Cómo garantizará que la justicia sea más ágil y accesible para todos los ciudadanos?',
        usuario_red_social: '@lucia_fernandez',
        red_social: 'X',
        tema: 'Justicia',
        estado: 'aprobada'
    },
    {
        id: '7',
        pregunta: '¿Cuáles son sus planes para mejorar la infraestructura vial del país?',
        usuario_red_social: '@roberto_diaz',
        red_social: 'Facebook',
        tema: 'Infraestructura',
        estado: 'aprobada'
    },
    {
        id: '8',
        pregunta: '¿Qué programas implementará para reducir la pobreza extrema en Colombia?',
        usuario_red_social: '@carolina_ruiz',
        red_social: 'Instagram',
        tema: 'Política Social',
        estado: 'aprobada'
    },
    {
        id: '9',
        pregunta: '¿Cómo planea generar más empleos para los jóvenes recién graduados?',
        usuario_red_social: '@david_castro',
        red_social: 'X',
        tema: 'Economía',
        estado: 'aprobada'
    },
    {
        id: '10',
        pregunta: '¿Qué hará para combatir la corrupción en las instituciones del Estado?',
        usuario_red_social: '@sofia_moreno',
        red_social: 'Facebook',
        tema: 'Justicia',
        estado: 'aprobada'
    },
    {
        id: '11',
        pregunta: '¿Cuál es su posición sobre la reforma tributaria y cómo afectará a la clase media?',
        usuario_red_social: '@miguel_torres',
        red_social: 'X',
        tema: 'Economía',
        estado: 'aprobada'
    },
    {
        id: '12',
        pregunta: '¿Qué propone para garantizar agua potable en todas las regiones del país?',
        usuario_red_social: '@valentina_herrera',
        red_social: 'Instagram',
        tema: 'Infraestructura',
        estado: 'aprobada'
    },
    {
        id: '13',
        pregunta: '¿Cómo abordará la crisis migratoria y la integración de venezolanos en Colombia?',
        usuario_red_social: '@andres_jimenez',
        red_social: 'X',
        tema: 'Política Social',
        estado: 'aprobada'
    },
    {
        id: '14',
        pregunta: '¿Qué inversiones realizará en ciencia, tecnología e innovación?',
        usuario_red_social: '@camila_vargas',
        red_social: 'Facebook',
        tema: 'Educación',
        estado: 'aprobada'
    },
    {
        id: '15',
        pregunta: '¿Cuál será su estrategia para combatir el narcotráfico y los grupos armados?',
        usuario_red_social: '@felipe_rojas',
        red_social: 'X',
        tema: 'Seguridad',
        estado: 'aprobada'
    }
];

// Social network icons mapping
const socialIcons = {
    'X': '𝕏',
    'Instagram': '📸',
    'Facebook': '📘',
    'Otra': '🌐'
};

// Topic to data attribute mapping
const topicMapping = {
    'Economía': 'economia',
    'Seguridad': 'seguridad',
    'Salud': 'salud',
    'Educación': 'educacion',
    'Medio Ambiente': 'medio-ambiente',
    'Justicia': 'justicia',
    'Infraestructura': 'infraestructura',
    'Política Social': 'politica-social',
    'Otros': 'otros'
};
