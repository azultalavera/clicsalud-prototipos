export const TRAMITE_MAPPING = {
  "ARQUITECTURA": [
    "NOMBRE DEL ESTABLECIMIENTO",
    "PROFESIONAL DE AREA CONSTRUCTUIVA DATOS"
  ],
  "DIRECTOR TECNICO": [
    "NOMBRE",
    "APELLIDO",
    "DNI"
  ],
  "DATOS GENERALES > DATOS": [
    "FECHA VENCIMIENTO PLAN EVACUACION",
    "FECHA VENCIMIENTO BOMBEROS",
    "FECHA VENCIMIENTO EXTINGUIDORES"
  ],
  "DATOS DEL TRÁMITE": [
    "TOTAL DE CAMAS",
    "SERVICIOS SELECCIONADOS"
  ]
};

export const PASOS_TRAMITE = [
  "DATOS GENERALES",
  "ARQUITECTURA",
  "INFRAESTRUCTURA",
  "EQUIPAMIENTO",
  "RECURSOS HUMANOS",
  "SERVICIOS",
  "FINALIZACIÓN"
];

export const normalize = (str) =>
  (str || "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

export const parseOptions = (options = "") =>
  String(options)
    .split(",")
    .map((option) => option.trim())
    .filter(Boolean);
