const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const normalize = (str) =>
  (str || "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

const targetServices = [
  "UNIDADES DE TERAPIA INTENSIVA",
  "TERAPIA INTENSIVA PEDIATRICA",
  "TERAPIA INTENSIVA NEONATAL",
  "HEMODINAMIA",
  "HEMODIALISIS"
].map(normalize);

if (db.configuraciones_maestras) {
  const clinicasConfig = db.configuraciones_maestras.find(c => c.id === 'clinicas' || normalize(c.tipologia).includes("CLINICAS"));
  
  if (clinicasConfig && clinicasConfig.servicios) {
    clinicasConfig.servicios.forEach(srv => {
      const srvName = normalize(srv.name);
      
      // 1. Vaciar si coincide
      if (targetServices.some(t => srvName.includes(t))) {
        if (srv.sections) srv.sections.forEach(sec => sec.fields = []);
        if (srv.fields) srv.fields = [];
        console.log(`Vaciado AGRESIVO: ${srv.name}`);
      }
      
      // 2. Establecer origen
      // Si es DATOS GENERALES -> ADMIN
      // Si es cualquier otro servicio clínico -> TRÁMITE
      const isGeneral = srv.id === "srv-gen" || srvName.includes("DATOS GENERALES");
      
      const setOrigin = (fields) => {
        if (fields) {
          fields.forEach(f => {
            f.origin = isGeneral ? "ADMIN" : "TRÁMITE";
          });
        }
      };
      
      if (srv.sections) srv.sections.forEach(sec => setOrigin(sec.fields));
      setOrigin(srv.fields);
    });
  }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log("db.json actualizado AGRESIVAMENTE.");
