const DEPARTAMENTOS = ["Capital", "Río Cuarto", "Punilla", "Colón", "General San Martín", "Tercero Arriba", "San Justo", "Santa María", "Calamuchita", "Unión"];
const LOCALIDADES = {
  "Capital": ["Córdoba"],
  "Río Cuarto": ["Río Cuarto", "Vicuña Mackenna", "Sampacho"],
  "Punilla": ["Villa Carlos Paz", "Cosquín", "La Falda"],
  "Colón": ["Jesús María", "La Calera", "Villa Allende"],
  "General San Martín": ["Villa María", "Villa Nueva"],
  "Tercero Arriba": ["Río Tercero", "Oliva"],
  "San Justo": ["San Francisco", "Las Varillas"],
  "Santa María": ["Alta Gracia", "Malagueño"],
  "Calamuchita": ["Santa Rosa", "Villa General Belgrano"],
  "Unión": ["Bell Ville", "Justiniano Posse"]
};
const TIPOLOGIAS = [
  "CLÍNICAS, SANATORIOS y HOSPITALES",
  "ESTABLECIMIENTOS GERIÁTRICOS",
  "CENTRO DE SALUD AMBULATORIO",
  "CENTRO DE CIRUGÍA AMBULATORIA"
];
const ESTADOS_ESTABLECIMIENTO = [
  { label: "HABILITADO", color: "#2e7d32" },
  { label: "PRÓXIMO A VENCER", color: "#f57f17" },
  { label: "VENCIDO", color: "#d32f2f" },
  { label: "EN PROCESO DE MODIFICACIÓN", color: "#6a1b9a" },
  { label: "NO VIGENTE", color: "#004582" }
];
const TIPOS_TRAMITE = ["HABILITACIÓN", "ALTA DIGITAL", "RENOVACIÓN", "MODIFICACIÓN", "RENOVACIÓN Y ADECUACIÓN"];
const ESTADOS_TRAMITE = [
  { label: "BORRADOR AUDITORÍA", color: "#424242" },
  { label: "RESPUESTA EMPLAZAMIENTO", color: "#800000" },
  { label: "EN ANÁLISIS ARQUITECTURA", color: "#03a9f4" },
  { label: "PENDIENTE EVALUACIÓN ARQUITECTURA", color: "#ff9800" },
  { label: "ACEPTADO DOCUMENTACIÓN", color: "#fbc02d" }
];

const generateMockData = () => {
  const establishments = [];
  const tramites = [];

  // Generate 400 Establishments
  for (let i = 1; i <= 400; i++) {
    const depto = DEPARTAMENTOS[Math.floor(Math.random() * DEPARTAMENTOS.length)];
    const locs = LOCALIDADES[depto];
    const loc = locs[Math.floor(Math.random() * locs.length)];
    const tipologia = TIPOLOGIAS[Math.floor(Math.random() * TIPOLOGIAS.length)];
    const estadoObj = ESTADOS_ESTABLECIMIENTO[Math.floor(Math.random() * ESTADOS_ESTABLECIMIENTO.length)];
    
    // Random flags for new requirements
    const diasVencer = estadoObj.label === "PRÓXIMO A VENCER" ? Math.floor(Math.random() * 30) + 1 : null;
    const emplazamientoVence = Math.random() < 0.05; // 5% chance
    const enSumario = Math.random() < 0.03; // 3% chance
    const requiereReinspeccion = Math.random() < 0.06; // 6% chance
    
    // Generate a date for last inspection (between 30 and 300 days ago)
    const lastInspection = new Date();
    lastInspection.setDate(lastInspection.getDate() - (Math.floor(Math.random() * 270) + 30));
    const diasDesdeInspeccion = Math.floor((new Date() - lastInspection) / (1000 * 60 * 60 * 24));

    establishments.push({
      id: i,
      nSolicitud: (4400 + i).toString(),
      expediente: `0425-${382230 + i}/2026`,
      nombre: `Establecimiento de Salud #${i} - ${loc}`,
      cuit: `30-${Math.floor(10000000 + Math.random() * 89999999)}-${Math.floor(Math.random() * 9)}`,
      fechaCreacion: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/2026`,
      departamento: depto,
      localidad: loc,
      tipologia: tipologia,
      estado: estadoObj.label,
      color: estadoObj.color,
      diasParaVencer: diasVencer,
      emplazamientoInspeccionVence: emplazamientoVence,
      enSumario: enSumario,
      diasEmplazamiento: emplazamientoVence ? Math.floor(Math.random() * 10) + 1 : null,
      requiereReinspeccion: requiereReinspeccion,
      ultimaInspeccion: lastInspection.toLocaleDateString("es-AR"),
      diasDesdeInspeccion: diasDesdeInspeccion
    });
  }

  // Generate 500 Tramites
  for (let i = 1; i <= 500; i++) {
    const est = establishments[Math.floor(Math.random() * establishments.length)];
    const tipo = TIPOS_TRAMITE[Math.floor(Math.random() * TIPOS_TRAMITE.length)];
    const estadoObj = ESTADOS_TRAMITE[Math.floor(Math.random() * ESTADOS_TRAMITE.length)];
    
    tramites.push({
      id: i,
      expediente: `${170 + i}-2026`,
      nSolicitud: (4408 + i).toString(),
      servicio: est.nombre,
      tipo: tipo,
      estado: estadoObj.label,
      fechaIngreso: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/2026`,
      color: estadoObj.color
    });
  }

  return { establishments, tramites };
};

const { establishments, tramites } = generateMockData();

export const MOCK_ESTABLECIMIENTOS = establishments;
export const MOCK_TRAMITES = tramites;
