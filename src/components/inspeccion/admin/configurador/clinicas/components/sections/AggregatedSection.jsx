import React, { useMemo, useContext } from "react";
import { Box, Paper } from "@mui/material";
import { ConfigContext, fieldTypes } from "../../ConfiguradorClinicas";
import { normalize, TRAMITE_MAPPING } from "../utils";
import ConfigTable from "../ConfigTable";

const AggregatedSection = ({ 
  type, 
  selectedCategoryId,
  equipamientos,
  optionDrafts, 
  setOptionDrafts, 
  setHardcodeDialog, 
  setAddRequirementDialog,
  setSnackbar,
  onEdit
}) => {
  const { servicios, setServicios } = useContext(ConfigContext);

  const calculatedFields = useMemo(() => {
    if (!servicios) return [];
    
    let rawFields = [];
    servicios.forEach(srv => {
      (srv.sections || []).forEach(sec => {
        const n = normalize(sec.name);
        let match = false;
        if (type === "infra") match = n.includes("SALA") || n.includes("CAMA");
        if (type === "rrhh") match = (n.includes("RRHH") || n.includes("RECURSOS")) && !n.includes("JEFE");
        if (type === "js") match = n.includes("JEFE");
        if (type === "equip") match = n.includes("EQUIP") || n.includes("INSTRUMENTAL");
        if (type === "arq") match = n.includes("ARQUITECTURA") || n.includes("PLANO");
        
        if (match) {
          (sec.fields || []).forEach(f => {
            rawFields.push({ ...f, _srvId: srv.id, _srvName: srv.name, _secName: sec.name });
          });
        }
      });
    });

    const grouped = {};
    const normalizationCache = {};

    rawFields.forEach(f => {
      const rawLabel = f.label || f.name;
      if (!normalizationCache[rawLabel]) {
        normalizationCache[rawLabel] = normalize(rawLabel);
      }
      const key = normalizationCache[rawLabel];

      if (!grouped[key]) {
        grouped[key] = {
          ...f,
          appliedServices: [],
          idsByService: {}
        };
      }
      grouped[key].appliedServices.push(f._srvName);
      grouped[key].idsByService[f._srvId] = f.id;
    });
    return Object.values(grouped);
  }, [servicios, type]);

  const handleLoadMinimums = () => {
    const newServicios = JSON.parse(JSON.stringify(servicios));
    const aggType = type;
    
    if (aggType === "infra") {
      ["QUIRÓFANO", "SALA DE PARTO"].forEach(srvName => {
        const srv = newServicios.find(s => s.name.toUpperCase() === srvName);
        if (srv) {
          const sec = (srv.sections || []).find(s => normalize(s.name).includes("SALA"));
          if (sec && !sec.fields.some(f => normalize(f.label) === "salas")) {
            sec.fields.push({ id: `fld-${Date.now()}-${Math.random()}`, label: "SALAS", type: "number", origin: "ADMIN" });
          }
        }
      });

      newServicios.forEach((s) => {
        const sec = (s.sections || []).find(sec => normalize(sec.name).includes("CAMA"));
        if (sec && !sec.fields.some(f => normalize(f.label) === "camas")) {
          sec.fields.push({ id: `fld-${Date.now()}-${Math.random()}`, label: "CAMAS", type: "number", origin: "ADMIN" });
        }
      });

      const genSrv = newServicios.find(s => s.id === "srv-gen");
      if (genSrv) {
        let targetSec = genSrv.sections.find(s => normalize(s.name).includes("DATOS"));
        if (!targetSec && genSrv.sections.length > 0) targetSec = genSrv.sections[0];
        
        if (targetSec) {
          if (!targetSec.fields.some(f => f.label === "TOTAL DE CAMAS")) {
            targetSec.fields.push({ 
              id: `fld-totcamas-${Date.now()}`, 
              label: "TOTAL DE CAMAS", 
              type: "number", 
              origin: "TRÁMITE", 
              tramiteField: "DATOS DEL TRÁMITE > TOTAL DE CAMAS" 
            });
          }
          if (!targetSec.fields.some(f => f.label === "SERVICIOS SELECCIONADOS")) {
            targetSec.fields.push({ 
              id: `fld-servsel-${Date.now()}`, 
              label: "SERVICIOS SELECCIONADOS", 
              type: "textarea", 
              origin: "TRÁMITE", 
              tramiteField: "DATOS DEL TRÁMITE > SERVICIOS SELECCIONADOS" 
            });
          }
        }
      }
    }

    if (aggType === "equip") {
      // 1. Limpiar todo lo relacionado a equipamiento
      newServicios.forEach(srv => {
        (srv.sections || []).forEach(sec => {
          const n = normalize(sec.name);
          if (n.includes("EQUIP") || n.includes("INSTRUMENTAL")) {
            sec.fields = [];
          }
        });
      });

      // 2. Cargar desde la administración de equipamientos
      if (equipamientos && equipamientos.length > 0) {
        equipamientos.forEach(item => {
          const srv = newServicios.find(s => normalize(s.name) === normalize(item.origen));
          if (srv) {
            let sec = srv.sections.find(s => {
              const n = normalize(s.name);
              return n.includes("EQUIP") || n.includes("INSTRUMENTAL");
            });
            
            if (!sec) {
              sec = { id: `sec-equip-${Date.now()}-${Math.random()}`, name: "EQUIPAMIENTO", fields: [] };
              srv.sections.push(sec);
            }

            const label = (item.equipamiento || item.name || "").toUpperCase();
            if (!sec.fields.some(f => normalize(f.label) === normalize(label))) {
              sec.fields.push({
                id: `fld-equip-${Date.now()}-${Math.random()}`,
                label: label,
                type: "number",
                origin: "TRÁMITE",
                pasoTramite: "EQUIPAMIENTO",
                tramiteField: `EQUIPAMIENTO > ${label}`,
                tramiteService: srv.name
              });
            }
          }
        });
        setSnackbar({ open: true, message: `Se limpió y cargó el equipamiento desde la administración (${equipamientos.length} items)`, severity: "success" });
      } else {
        setSnackbar({ open: true, message: "No hay equipamientos en la administración para cargar", severity: "warning" });
      }
    }

    if (aggType === "arq") {
      const genSrv = newServicios.find(s => s.id === "srv-gen");
      if (genSrv) {
        let arqSec = genSrv.sections.find(s => normalize(s.name).includes("ARQUITECTURA"));
        if (!arqSec) {
          arqSec = { id: `sec-arq-${Date.now()}`, name: "ARQUITECTURA", fields: [] };
          genSrv.sections.push(arqSec);
        }
        
        const fieldsToAdd = TRAMITE_MAPPING["ARQUITECTURA"] || [];
        fieldsToAdd.forEach(label => {
          if (!arqSec.fields.some(f => f.label === label)) {
            arqSec.fields.push({
              id: `fld-arq-${Date.now()}-${Math.random()}`,
              label: label,
              type: "text",
              origin: "TRÁMITE",
              pasoTramite: "ARQUITECTURA",
              tramiteField: `ARQUITECTURA > ${label}`
            });
          }
        });
      }
    }

    setServicios(newServicios);
    setSnackbar({ open: true, message: "Mínimos globales cargados correctamente", severity: "success" });
  };

  return (
    <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: "1px solid #e2e8f0", overflow: "hidden" }}>
      <ConfigTable
        calculatedFields={calculatedFields}
        selectedCategoryId={selectedCategoryId}
        servicios={servicios}
        setServicios={setServicios}
        optionDrafts={optionDrafts}
        setOptionDrafts={setOptionDrafts}
        setHardcodeDialog={setHardcodeDialog}
        handleLoadMinimums={handleLoadMinimums}
        setAddRequirementDialog={setAddRequirementDialog}
        fieldTypes={fieldTypes}
        onEdit={onEdit}
      />
    </Paper>
  );
};

export default AggregatedSection;
