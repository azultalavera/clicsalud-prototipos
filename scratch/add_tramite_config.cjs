const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db.tramite_config = {
  mapping: {
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
  },
  pasos: [
    "DATOS GENERALES",
    "ARQUITECTURA",
    "INFRAESTRUCTURA",
    "EQUIPAMIENTO",
    "RECURSOS HUMANOS",
    "SERVICIOS",
    "FINALIZACIÓN"
  ]
};

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log("Configuración del trámite añadida a db.json.");
