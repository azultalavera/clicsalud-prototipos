const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

if (db.configuraciones_maestras) {
  const clinicasConfig = db.configuraciones_maestras.find(c => c.id === 'clinicas' || c.tipologia === 'CLÍNICAS, SANATORIOS Y HOSPITALES');
  
  if (clinicasConfig && clinicasConfig.servicios) {
    clinicasConfig.servicios.forEach(srv => {
      if (srv.sections) {
        srv.sections.forEach(sec => {
          if (sec.fields) {
            sec.fields.forEach(f => {
              f.origin = "TRÁMITE";
            });
          }
        });
      }
      if (srv.fields) {
        srv.fields.forEach(f => {
          f.origin = "TRÁMITE";
        });
      }
    });
    console.log("Se han migrado todos los campos a origen 'TRÁMITE'.");
  }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log("db.json actualizado correctamente.");
