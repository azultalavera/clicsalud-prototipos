import React, { useMemo, useContext } from "react";
import { Paper } from "@mui/material";
import { ConfigContext, fieldTypes } from "../../ConfiguradorClinicas";
import { normalize } from "../utils";
import ConfigTable from "../ConfigTable";

const StandardSection = ({ 
  selectedCategoryId,
  activeTab,
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
    
    let fields = [];
    const generalDataSrv = servicios.find(s => normalize(s.name).includes("DATOS GENERALES"));
    const genSecIdx = generalDataSrv?.sections?.findIndex(s => s.id === selectedCategoryId) ?? -1;
    
    if (genSecIdx !== -1) {
      fields = (generalDataSrv.sections[genSecIdx].fields || []).map(f => ({
        ...f,
        _srvIdx: servicios.indexOf(generalDataSrv),
        _secIdx: genSecIdx,
        _originalIdx: generalDataSrv.sections[genSecIdx].fields.indexOf(f)
      }));
    } else {
      const srvIdx = servicios.findIndex(s => s.id === selectedCategoryId);
      if (srvIdx !== -1) {
        const srv = servicios[srvIdx];
        if (srv.sections && srv.sections.length > 0) {
          const sectionFields = srv.sections.flatMap((sec, sIdx) => 
            (sec.fields || []).map((f, fIdx) => ({
              ...f,
              _srvIdx: srvIdx,
              _secIdx: sIdx,
              _originalIdx: fIdx,
              _secName: sec.name
            }))
          );
          const baseFields = (srv.fields || []).map((f, fIdx) => ({
            ...f,
            _srvIdx: srvIdx,
            _secIdx: -1,
            _originalIdx: fIdx,
            _secName: "GENERAL"
          }));
          fields = [...baseFields, ...sectionFields];
        } else {
          fields = (srv.fields || []).map((f, fIdx) => ({
            ...f,
            _srvIdx: srvIdx,
            _secIdx: -1,
            _originalIdx: fIdx
          }));
        }
      }
    }
    return fields;
  }, [servicios, selectedCategoryId]);

  const handleLoadMinimums = () => {
    const newServicios = JSON.parse(JSON.stringify(servicios));
    const parentSrv = newServicios.find(s => s.id === selectedCategoryId || (s.sections || []).some(sec => sec.id === selectedCategoryId));
    if (!parentSrv) return;

    let totalAdded = 0;

    const processList = (list, labelKey, typeLabel, sectionPattern) => {
      if (!list || list.length === 0) return;

      // Filtrar por origen
      const relevant = list.filter(item => normalize(item.origen) === normalize(parentSrv.name));
      if (relevant.length === 0) return;

      // Encontrar o crear sección
      let targetSec = parentSrv.sections.find(sec => normalize(sec.name).includes(sectionPattern));
      if (!targetSec) {
        targetSec = { id: `sec-${typeLabel.toLowerCase()}-${Date.now()}-${Math.random()}`, name: typeLabel.toUpperCase(), fields: [] };
        parentSrv.sections.push(targetSec);
      }

      relevant.forEach(item => {
        const label = (item[labelKey] || item.name || "").toUpperCase();
        if (!targetSec.fields.some(f => normalize(f.label) === normalize(label))) {
          targetSec.fields.push({
            id: `fld-${typeLabel.toLowerCase()}-${Date.now()}-${Math.random()}`,
            label,
            type: typeLabel === "EQUIP" ? "number" : "text",
            origin: "ADMIN"
          });
          totalAdded++;
        }
      });
    };

    // 1. Equipamiento
    processList(equipamientos, "equipamiento", "EQUIP", "EQUIP");
    // 2. RRHH
    processList(rrhhList, "especialidad", "RRHH", "RECURSOS");
    // 3. Jefe de Servicio
    processList(jefeServicioList, "especialidad", "JEFE", "JEFE");

    if (totalAdded > 0) {
      setServicios(newServicios);
      setSnackbar({ open: true, message: `Se cargaron ${totalAdded} requisitos mínimos.`, severity: "success" });
    } else {
      setSnackbar({ open: true, message: "No se encontraron nuevos requisitos mínimos para este servicio.", severity: "info" });
    }
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

export default StandardSection;
