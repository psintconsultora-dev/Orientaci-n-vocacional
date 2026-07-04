import { InterestArea, Question, Participant } from './types';

export const INTEREST_AREAS: InterestArea[] = [
  {
    id: 'CALC',
    name: 'Cálculo',
    fullName: 'Cálculo y Construcción (Matemáticas y Estadística)',
    description: 'Preferencia por el trabajo con números, fórmulas, análisis cuantitativo, resolución de acertijos lógicos y modelamiento de datos.',
    careers: ['Licenciatura en Matemáticas', 'Estadística', 'Actuaría', 'Ingeniería Civil', 'Análisis de Datos Finacieros'],
    environments: ['Departamentos de analítica corporativa', 'Centros de investigación', 'Bancos y consultoras', 'Estudios de ingeniería'],
    color: '#3B82F6' // Blue
  },
  {
    id: 'FISO',
    name: 'Científica',
    fullName: 'Ciencias Físico-Químicas (Investigación Pura)',
    description: 'Interés en comprender los fenómenos de la naturaleza inanimada mediante la experimentación, formulación de hipótesis y el método científico.',
    careers: ['Física', 'Química', 'Astronomía', 'Geología', 'Nanotecnología'],
    environments: ['Laboratorios de I+D', 'Observatorios', 'Universidades', 'Plantas de alta tecnología'],
    color: '#06B6D4' // Cyan
  },
  {
    id: 'TECN',
    name: 'Tecnología',
    fullName: 'Tecnología, Programación e Ingeniería de Sistemas',
    description: 'Gusto por el diseño de software, manejo de equipos computacionales, reparación de dispositivos, automatización de procesos y redes.',
    careers: ['Ingeniería de Sistemas', 'Desarrollo de Software', 'Ciberseguridad', 'Robótica', 'Ingeniería Electrónica'],
    environments: ['Empresas de software', 'Startups tecnológicas', 'Centros de datos', 'Áreas de soporte e innovación'],
    color: '#6366F1' // Indigo
  },
  {
    id: 'BIOL',
    name: 'C. Biológicas',
    fullName: 'Ciencias Biológicas, Ecología y Medio Ambiente',
    description: 'Preferencia por el estudio de los seres vivos, genética, ecosistemas y la preservación de la biodiversidad marina o terrestre.',
    careers: ['Biología', 'Biotecnología', 'Ecología', 'Oceanografía', 'Genética'],
    environments: ['Áreas naturales protegidas', 'Laboratorios biológicos', 'ONGs ambientales', 'Centros de genética'],
    color: '#10B981' // Emerald
  },
  {
    id: 'MEDI',
    name: 'Medicina',
    fullName: 'Ciencias Médicas, Salud y Rehabilitación',
    description: 'Vocación por la preservación de la salud humana, el diagnóstico de dolencias, tratamientos sanitarios y terapias corporales.',
    careers: ['Medicina General', 'Enfermería', 'Kinesiología', 'Odontología', 'Nutrición'],
    environments: ['Hospitales y clínicas', 'Centros de salud comunitaria', 'Consultorios privados', 'Centros deportivos'],
    color: '#EF4444' // Red
  },
  {
    id: 'AGRO',
    name: 'Agropecuaria',
    fullName: 'Agronomía, Veterinaria y Ciencias de la Tierra',
    description: 'Interés por las actividades al aire libre relacionadas con la cría de animales, agricultura, silvicultura y optimización de recursos rurales.',
    careers: ['Agronomía', 'Medicina Veterinaria', 'Ingeniería Forestal', 'Zootecnia'],
    environments: ['Campos de cultivo y estancias', 'Clínicas veterinarias de campo', 'Criaderos', 'Organismos agropecuarios'],
    color: '#84CC16' // Lime
  },
  {
    id: 'ARTE',
    name: 'Artístico-Plástica',
    fullName: 'Artes Visuales, Diseño y Expresión Plástica',
    description: 'Gusto por plasmar ideas de forma gráfica o tridimensional mediante pintura, escultura, fotografía, diseño digital e ilustración.',
    careers: ['Artes Visuales', 'Diseño Gráfico', 'Arquitectura de Interiores', 'Ilustración Digital', 'Fotografía'],
    environments: ['Estudios de diseño', 'Agencias creativas', 'Galerías de arte', 'Talleres artísticos independientes'],
    color: '#EC4899' // Pink
  },
  {
    id: 'MUSI',
    name: 'Música',
    fullName: 'Música, Canto y Artes Escénicas',
    description: 'Atracción por la creación de melodías, ejecución de instrumentos, canto, producción de audio o dirección escénica.',
    careers: ['Composición Musical', 'Producción de Sonido', 'Canto y Actuación', 'Dirección de Orquesta'],
    environments: ['Estudios de grabación', 'Teatros y escenarios', 'Academias de música', 'Productoras audiovisuales'],
    color: '#F43F5E' // Rose
  },
  {
    id: 'LITE',
    name: 'Literatura',
    fullName: 'Lengua, Literatura y Redacción Creativa',
    description: 'Preferencia por la expresión escrita, creación literaria, periodismo de opinión, crítica textual y la lectura profunda.',
    careers: ['Letras y Literatura', 'Periodismo', 'Filosofía', 'Edición de Textos', 'Guionismo'],
    environments: ['Editoriales', 'Medios de comunicación', 'Agencias de contenidos', 'Instituciones culturales'],
    color: '#D97706' // Amber (Dark)
  },
  {
    id: 'SOCI',
    name: 'C. Sociales',
    fullName: 'Ciencias Sociales, Historia y Ciencias Políticas',
    description: 'Interés en el análisis de las estructuras sociales, sucesos del pasado, leyes, administración pública y procesos culturales.',
    careers: ['Derecho', 'Sociología', 'Historia', 'Ciencias Políticas', 'Antropología'],
    environments: ['Estudios jurídicos', 'Organismos públicos', 'Fundaciones sociales', 'Centros de investigación histórica'],
    color: '#14B8A6' // Teal
  },
  {
    id: 'ENSE',
    name: 'Enseñanza',
    fullName: 'Enseñanza, Pedagogía y Capacitación',
    description: 'Vocación por transmitir conocimientos, coordinar grupos de aprendizaje, diseñar metodologías lúdicas y guiar a estudiantes.',
    careers: ['Educación Primaria / Secundaria', 'Pedagogía', 'Psicopedagogía', 'Capacitación Corporativa'],
    environments: ['Colegios y liceos', 'Universidades', 'Plataformas de e-learning', 'Departamentos de recursos humanos'],
    color: '#8B5CF6' // Purple
  },
  {
    id: 'ASIS',
    name: 'Servicio Social',
    fullName: 'Servicio Social, Psicología y Asistencia Comunitaria',
    description: 'Profunda empatía y orientación al bienestar del prójimo, brindando contención psicológica, ayuda social y resolviendo problemas comunitarios.',
    careers: ['Psicología Clínica', 'Trabajo Social', 'Terapia Ocupacional', 'Orientación Familiar'],
    environments: ['Consultorios terapéuticos', 'Refugios y ONGs', 'Centros de inserción social', 'Áreas de salud mental'],
    color: '#F59E0B' // Amber
  },
  {
    id: 'ECON',
    name: 'Economía',
    fullName: 'Economía, Finanzas y Negocios',
    description: 'Interés en el flujo de capitales, emprendimiento comercial, planes de marketing, ventas, gestión corporativa y presupuestos.',
    careers: ['Administración de Empresas', 'Economía', 'Finanzas', 'Marketing y Ventas', 'Comercio Internacional'],
    environments: ['Empresas corporativas', 'Startups y emprendimientos propios', 'Bolsa de valores', 'Áreas de marketing'],
    color: '#059669' // Emerald Dark
  },
  {
    id: 'OFIC',
    name: 'Oficina',
    fullName: 'Oficina, Logística y Organización Administrativa',
    description: 'Gusto por mantener el orden de datos, registros, inventarios, agendas, y tareas operativas dentro de una oficina corporativa.',
    careers: ['Secretariado Ejecutivo', 'Administración Pública', 'Gestión de Logística', 'Archivología'],
    environments: ['Oficinas públicas o privadas', 'Almacenes y centros de distribución', 'Áreas de atención al cliente'],
    color: '#6B7280' // Gray
  },
  {
    id: 'IDIO',
    name: 'Idiomas',
    fullName: 'Idiomas, Traducción y Relaciones Exteriores',
    description: 'Preferencia por el dominio de lenguas extranjeras, el intercambio intercultural, la traducción simultánea y la diplomacia.',
    careers: ['Traductorado Público', 'Relaciones Internacionales', 'Turismo y Hotelería', 'Lingüística'],
    environments: ['Embajadas y consulados', 'Agencias de turismo', 'Empresas multinacionales', 'Agencias de traducción'],
    color: '#A855F7' // Purple Light
  }
];

export const QUESTIONS: Question[] = [
  // 1. CALC
  { id: 1, areaId: 'CALC', text: 'Resolver problemas matemáticos complejos o ecuaciones algebraicas.' },
  { id: 2, areaId: 'CALC', text: 'Analizar gráficos estadísticos y tendencias de datos numéricos.' },
  { id: 3, areaId: 'CALC', text: 'Diseñar algoritmos lógicos o fórmulas para optimizar cálculos.' },
  // 2. FISO
  { id: 4, areaId: 'FISO', text: 'Hacer experimentos en un laboratorio químico para observar reacciones.' },
  { id: 5, areaId: 'FISO', text: 'Estudiar las leyes del universo, el movimiento de astros o la física de partículas.' },
  { id: 6, areaId: 'FISO', text: 'Investigar la estructura atómica y propiedades de nuevos materiales.' },
  // 3. TECN
  { id: 7, areaId: 'TECN', text: 'Reparar o armar dispositivos electrónicos, computadoras o consolas.' },
  { id: 8, areaId: 'TECN', text: 'Escribir código de programación para crear un sistema web o una aplicación móvil.' },
  { id: 9, areaId: 'TECN', text: 'Configurar redes de internet inalámbricas o servidores corporativos.' },
  // 4. BIOL
  { id: 10, areaId: 'BIOL', text: 'Investigar el comportamiento de especies de insectos o plantas en su hábitat.' },
  { id: 11, areaId: 'BIOL', text: 'Estudiar muestras de microorganismos con un microscopio de alta potencia.' },
  { id: 12, areaId: 'BIOL', text: 'Desarrollar proyectos ecológicos para la conservación del ecosistema marino.' },
  // 5. MEDI
  { id: 13, areaId: 'MEDI', text: 'Diagnosticar enfermedades, interpretar radiografías y recetar tratamientos médicos.' },
  { id: 14, areaId: 'MEDI', text: 'Asistir en cirugías o aplicar primeros auxilios de emergencia.' },
  { id: 15, areaId: 'MEDI', text: 'Diseñar planes de rehabilitación kinésica para personas lesionadas.' },
  // 6. AGRO
  { id: 16, areaId: 'AGRO', text: 'Supervisar cosechas de frutas, verduras o cereales en campos de cultivo.' },
  { id: 17, areaId: 'AGRO', text: 'Tratar médicamente a animales domésticos o de granja como veterinario.' },
  { id: 18, areaId: 'AGRO', text: 'Analizar la fertilidad de las tierras de cultivo y diseñar sistemas de riego.' },
  // 7. ARTE
  { id: 19, areaId: 'ARTE', text: 'Pintar un mural, tallar una escultura o realizar ilustraciones de fantasía.' },
  { id: 20, areaId: 'ARTE', text: 'Diseñar el logotipo de una marca comercial o la interfaz visual de una app.' },
  { id: 21, areaId: 'ARTE', text: 'Tomar y editar fotografías profesionales para catálogos o revistas.' },
  // 8. MUSI
  { id: 22, areaId: 'MUSI', text: 'Componer pistas musicales, escribir acordes o arreglar piezas instrumentales.' },
  { id: 23, areaId: 'MUSI', text: 'Tocar un instrumento (piano, guitarra, batería, etc.) en vivo en una banda u orquesta.' },
  { id: 24, areaId: 'MUSI', text: 'Grabar, mezclar y masterizar voces e instrumentos en un estudio de sonido.' },
  // 9. LITE
  { id: 25, areaId: 'LITE', text: 'Escribir cuentos, novelas literarias o libretos para obras de teatro.' },
  { id: 26, areaId: 'LITE', text: 'Redactar artículos de prensa, crónicas de viajes o columnas de opinión.' },
  { id: 27, areaId: 'LITE', text: 'Leer de forma analítica libros clásicos y debatir sobre las ideas de los autores.' },
  // 10. SOCI
  { id: 28, areaId: 'SOCI', text: 'Investigar sucesos del pasado a través de documentos históricos o restos arqueológicos.' },
  { id: 29, areaId: 'SOCI', text: 'Defender legalmente la inocencia o los derechos laborales de un ciudadano.' },
  { id: 30, areaId: 'SOCI', text: 'Analizar las políticas de gobierno y proponer reformas constitucionales.' },
  // 11. ENSE
  { id: 31, areaId: 'ENSE', text: 'Explicar de forma sencilla conceptos difíciles de ciencia o geografía a niños.' },
  { id: 32, areaId: 'ENSE', text: 'Diseñar el programa de estudios o las guías de actividades para un curso escolar.' },
  { id: 33, areaId: 'ENSE', text: 'Dar talleres prácticos o charlas de capacitación a personal de una empresa.' },
  // 12. ASIS
  { id: 34, areaId: 'ASIS', text: 'Escuchar pacientemente los problemas emocionales de una persona para aconsejarla.' },
  { id: 35, areaId: 'ASIS', text: 'Organizar ollas populares o colectas de ayuda para familias sin hogar.' },
  { id: 36, areaId: 'ASIS', text: 'Ayudar a personas mayores o con discapacidades a integrarse en actividades lúdicas.' },
  // 13. ECON
  { id: 37, areaId: 'ECON', text: 'Elaborar el presupuesto anual de una compañía y estimar ganancias futuras.' },
  { id: 38, areaId: 'ECON', text: 'Negociar acuerdos comerciales, ventas por mayor o planificar lanzamientos de productos.' },
  { id: 39, areaId: 'ECON', text: 'Idear un nuevo modelo de negocio o coordinar un equipo de ventas.' },
  // 40. OFIC
  { id: 40, areaId: 'OFIC', text: 'Clasificar y archivar facturas de compras por orden alfabético y cronológico.' },
  { id: 41, areaId: 'OFIC', text: 'Llevar el control del inventario de insumos de papelería en una oficina.' },
  { id: 42, areaId: 'OFIC', text: 'Atender el conmutador telefónico y registrar citas de la gerencia general.' },
  // 15. IDIO
  { id: 43, areaId: 'IDIO', text: 'Traducir del inglés u otro idioma textos literarios o manuales técnicos.' },
  { id: 44, areaId: 'IDIO', text: 'Interpretar conversaciones telefónicas simultáneas entre ejecutivos de distintos países.' },
  { id: 45, areaId: 'IDIO', text: 'Aprender un nuevo idioma extranjero y practicar su vocabulario diariamente.' }
];

// Calculate scores helper
export function calculateParticipantScores(answers: Record<number, number>): {
  rawScores: Record<string, number>;
  percentiles: Record<string, number>;
} {
  const rawScores: Record<string, number> = {};
  const percentiles: Record<string, number> = {};

  // Initialize all areas to 0
  for (const area of INTEREST_AREAS) {
    rawScores[area.id] = 0;
  }

  // Aggregate question answers
  for (const question of QUESTIONS) {
    const answer = answers[question.id] || 3; // default to neutral (3) if not answered
    rawScores[question.areaId] = (rawScores[question.areaId] || 0) + answer;
  }

  // Calculate percentiles
  // Minimum possible raw score is 3 (3 questions * 1), max is 15 (3 questions * 5)
  // Scale of 3 to 15 has length 12
  for (const area of INTEREST_AREAS) {
    const score = rawScores[area.id] || 9; // Neutral default
    // Calculate percentage-based percentile
    const pct = Math.round(((score - 3) / 12) * 100);
    percentiles[area.id] = Math.max(0, Math.min(100, pct));
  }

  return { rawScores, percentiles };
}

// Generate complete answers record from specific interests
function generateAnswers(primary: string[], highRating = 5, secondary: string[] = [], secondaryRating = 4) {
  const answers: Record<number, number> = {};
  for (const q of QUESTIONS) {
    if (primary.includes(q.areaId)) {
      answers[q.id] = Math.floor(Math.random() * 2) + (highRating - 1); // 4 or 5
    } else if (secondary.includes(q.areaId)) {
      answers[q.id] = Math.floor(Math.random() * 2) + (secondaryRating - 1); // 3 or 4
    } else {
      answers[q.id] = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
    }
  }
  return answers;
}

// Pre-populate some realistic candidates
export const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: 'p-1',
    name: 'Sofía Rodríguez',
    date: '2026-06-28',
    answers: generateAnswers(['ARTE', 'MUSI', 'LITE'], 5, ['IDIO', 'SOCI'], 4),
    rawScores: {},
    percentiles: {},
    notes: 'Estudiante de último año de secundaria. Demuestra alta inclinación por áreas expresivas y de humanidades. Muy interesada en diseño gráfico o producción musical.'
  },
  {
    id: 'p-2',
    name: 'Carlos Mendoza',
    date: '2026-07-01',
    answers: generateAnswers(['CALC', 'TECN', 'FISO'], 5, ['BIOL'], 4),
    rawScores: {},
    percentiles: {},
    notes: 'Perfil eminentemente lógico-analítico. Muestra fascinación por el desarrollo de algoritmos, programación de sistemas y física experimental. Aconsejado para Ingenierías.'
  },
  {
    id: 'p-3',
    name: 'Ana María Silva',
    date: '2026-07-02',
    answers: generateAnswers(['ASIS', 'MEDI', 'ENSE'], 5, ['BIOL', 'IDIO'], 4),
    rawScores: {},
    percentiles: {},
    notes: 'Perfil marcadamente asistencial e interpersonal. Gran vocación de ayuda humanitaria, interés clínico (medicina) y excelente trato para el aprendizaje.'
  },
  {
    id: 'p-4',
    name: 'Javier Ortega',
    date: '2026-07-03',
    answers: generateAnswers(['ECON', 'OFIC', 'IDIO'], 5, ['CALC', 'SOCI'], 4),
    rawScores: {},
    percentiles: {},
    notes: 'Interés por las finanzas, la negociación de negocios internacionales, planificación estratégica de proyectos y el ordenamiento operativo empresarial.'
  }
];

// Initialize mock candidates scores
for (const p of INITIAL_PARTICIPANTS) {
  const { rawScores, percentiles } = calculateParticipantScores(p.answers);
  p.rawScores = rawScores;
  p.percentiles = percentiles;
}
