const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const normalize = (str) =>
  (str || "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

if (db.configuraciones_maestras) {
  const clinicasConfig = db.configuraciones_maestras.find(c => c.id === 'clinicas' || c.tipologia === 'CLÍNICAS, SANATORIOS Y HOSPITALES');
  
  if (clinicasConfig && clinicasConfig.servicios) {
    clinicasConfig.servicios.forEach(srv => {
      // 1. Limpiar secciones de equipamiento
      if (srv.sections) {
        srv.sections = srv.sections.filter(sec => {
          const n = normalize(sec.name);
          return !(n.includes("EQUIP") || n.includes("INSTRUMENTAL"));
        });
      }
      
      // 2. Limpiar campos de tipo equipamiento o que parezcan serlo
      if (srv.fields) {
        srv.fields = srv.fields.filter(f => {
          const type = (f.type || "").toLowerCase();
          const label = normalize(f.label || "");
          return type !== "equipamiento" && !label.includes("EQUIPAMIENTO");
        });
      }
    });
    
    console.log("Se han limpiado las secciones y campos de equipamiento en 'clinicas'.");
  }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log("db.json actualizado correctamente.");
