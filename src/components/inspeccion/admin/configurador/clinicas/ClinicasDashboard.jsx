import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Tooltip,
  Fab,
  Alert,
  Snackbar,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Button
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  DeleteSweep as DeleteSweepIcon,
  Add as AddIcon
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { ConfigContext } from "./ConfiguradorClinicas";

// Modularized imports
import { normalize } from "./components/utils";
import ConfigSidebar from "./components/ConfigSidebar";
import AddRequirementDialog from "./components/AddRequirementDialog";
import EditRequirementDialog from "./components/EditRequirementDialog";
import HardcodeDialog from "./components/HardcodeDialog";

// Section imports
import AggregatedSection from "./components/sections/AggregatedSection";
import StandardSection from "./components/sections/StandardSection";

const ClinicasDashboard = () => {
  const {
    tipologiaName,
    servicios,
    setServicios,
    handleSaveConfig,
    loading,
  } = useContext(ConfigContext);

  const navigate = useNavigate();
  const [inspectionMode, setInspectionMode] = useState("ADMIN");
  const [tramites, setTramites] = useState([]);
  const [equipamientos, setEquipamientos] = useState([]);
  const [rrhhList, setRrhhList] = useState([]);
  const [jefeServicioList, setJefeServicioList] = useState([]);
  const [selectedTramiteId, setSelectedTramiteId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [optionDrafts, setOptionDrafts] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [hardcodeDialog, setHardcodeDialog] = useState({ open: false, field: null, value: "", srvIdx: -1, secIdx: -1, fIdx: -1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [addRequirementDialog, setAddRequirementDialog] = useState({ open: false, selectedServices: [] });
  const [editRequirementDialog, setEditRequirementDialog] = useState({ open: false, fieldData: null });

  useEffect(() => {
    fetch("http://localhost:3001/tramites")
      .then((res) => res.json())
      .then((data) => setTramites(data))
      .catch((err) => console.error("Error fetching tramites:", err));

    fetch("http://localhost:3001/equipamientos")
      .then((res) => res.json())
      .then((data) => setEquipamientos(data))
      .catch((err) => console.error("Error fetching equipamientos:", err));

    fetch("http://localhost:3001/recursos-humanos")
      .then((res) => res.json())
      .then((data) => setRrhhList(data))
      .catch((err) => console.error("Error fetching rrhh:", err));

    fetch("http://localhost:3001/jefe-servicio")
      .then((res) => res.json())
      .then((data) => setJefeServicioList(data))
      .catch((err) => console.error("Error fetching jefe-servicio:", err));
  }, []);

  useEffect(() => {
    if (!selectedCategoryId && servicios?.length > 0) {
      const genSrv = servicios.find(s => s.id === "srv-gen");
      if (genSrv && genSrv.sections && genSrv.sections.length > 0) {
        setSelectedCategoryId(genSrv.sections[0].id);
      } else if (servicios[0].id) {
        setSelectedCategoryId(servicios[0].id);
      }
    }
  }, [servicios, selectedCategoryId]);

  const handleAddService = () => {
    const newServicios = [...servicios];
    newServicios.push({
      id: `srv-${Date.now()}`,
      name: "Nuevo Servicio",
      isDeletable: true,
      fields: [],
      sections: [{ id: `sec-${Date.now()}`, name: "Sección 1", fields: [] }]
    });
    setServicios(newServicios);
  };

  const handleAddGeneralSection = () => {
    const newServicios = JSON.parse(JSON.stringify(servicios));
    const genSrv = newServicios.find(s => s.id === "srv-gen");
    if (genSrv) {
      if (!genSrv.sections) genSrv.sections = [];
      const newSec = {
        id: `sec-${Date.now()}`,
        name: "Nuevo Paso",
        fields: []
      };
      genSrv.sections.push(newSec);
      setServicios(newServicios);
      setSelectedCategoryId(newSec.id);
    }
  };

  const handleAddTramiteService = () => {
    const newServicios = JSON.parse(JSON.stringify(servicios));
    const newSrv = {
      id: `srv-${Date.now()}`,
      name: "Nueva Área del Trámite",
      isDeletable: true,
      isTramite: true,
      fields: [],
      sections: [{ id: `sec-${Date.now()}`, name: "Sección 1", fields: [] }]
    };
    newServicios.push(newSrv);
    setServicios(newServicios);
    setSelectedCategoryId(newSrv.id);
  };

  const { generalDataSrv, tramiteServices, otherServices } = React.useMemo(() => {
    if (!servicios) return { generalDataSrv: null, tramiteServices: [], otherServices: [] };
    const general = servicios.find(s => normalize(s.name).includes("DATOS GENERALES"));
    const tramite = servicios.filter(s => s.id !== "srv-gen" && s.isTramite);
    const other = servicios.filter(s => s.id !== "srv-gen" && !s.isTramite);
    return { generalDataSrv: general, tramiteServices: tramite, otherServices: other };
  }, [servicios]);

  const handleConfirmAddRequirement = (label, servicesIds, dataType, originVal, pasoTramiteVal, tramiteFieldVal) => {
    if (!label.trim() || servicesIds.length === 0) return;
    
    const isAggregate = selectedCategoryId?.startsWith("agg-");
    const aggType = isAggregate ? selectedCategoryId.replace("agg-", "") : null;
    
    const newServicios = JSON.parse(JSON.stringify(servicios));
    
    servicesIds.forEach(srvId => {
      const srv = newServicios.find(s => s.id === srvId);
      if (!srv) return;

      const baseOrigin = originVal || (srv.isTramite ? "ADMIN" : "TRÁMITE");
      const basePaso = pasoTramiteVal || (aggType === "equip" ? "EQUIPAMIENTO" : (aggType === "infra" ? "INFRAESTRUCTURA" : ""));

      const newField = {
        id: `fld-${Date.now()}-${Math.random()}`,
        label: label.toUpperCase(),
        type: dataType || "text",
        origin: baseOrigin,
        pasoTramite: baseOrigin === "TRÁMITE" ? basePaso : "",
        tramiteField: baseOrigin === "TRÁMITE" ? (tramiteFieldVal || "") : "",
        options: ""
      };

      if (isAggregate) {
        let targetSec = srv.sections.find(sec => {
          const n = normalize(sec.name);
          if (aggType === "infra") return n.includes("SALA") || n.includes("CAMA");
          if (aggType === "equip") return n.includes("EQUIP") || n.includes("INSTRUMENTAL");
          if (aggType === "rrhh") return (n.includes("RRHH") || n.includes("RECURSOS")) && !n.includes("JEFE");
          if (aggType === "js") return n.includes("JEFE");
          if (aggType === "arq") return n.includes("ARQUITECTURA");
          return false;
        });

        if (!targetSec) {
          const fallbackNames = { infra: "SALAS", equip: "EQUIPAMIENTO", rrhh: "RECURSOS HUMANOS", js: "JEFES DE SERVICIO", arq: "ARQUITECTURA" };
          const name = fallbackNames[aggType] || "REQUISITOS";
          targetSec = { id: `sec-${Date.now()}`, name, fields: [] };
          srv.sections.push(targetSec);
        }
        targetSec.fields.push(newField);
      } else {
        const sec = srv.sections?.find(sec => sec.id === selectedCategoryId);
        if (sec) sec.fields.push(newField);
        else (srv.fields || (srv.fields = [])).push(newField);
      }
    });

    setServicios(newServicios);
    setAddRequirementDialog({ open: false, selectedServices: [] });
    setSnackbar({ open: true, message: `Requisito añadido a ${servicesIds.length} servicios.`, severity: "success" });
  };

  const handleConfirmEditRequirement = (updatedField) => {
    const newServicios = JSON.parse(JSON.stringify(servicios));
    
    // We update this field across all services where it exists by its ID
    newServicios.forEach(srv => {
      if (srv.sections) {
        srv.sections.forEach(sec => {
          const fieldIndex = sec.fields?.findIndex(f => f.id === updatedField.id);
          if (fieldIndex !== -1 && fieldIndex !== undefined) {
            sec.fields[fieldIndex] = { ...sec.fields[fieldIndex], ...updatedField };
          }
        });
      }
      if (srv.fields) {
        const fieldIndex = srv.fields.findIndex(f => f.id === updatedField.id);
        if (fieldIndex !== -1) {
          srv.fields[fieldIndex] = { ...srv.fields[fieldIndex], ...updatedField };
        }
      }
    });

    setServicios(newServicios);
    setEditRequirementDialog({ open: false, fieldData: null });
    setSnackbar({ open: true, message: `Requisito "${updatedField.label}" actualizado correctamente.`, severity: "success" });
  };
  const onSave = async () => {
    try {
      await handleSaveConfig();
      setSnackbar({ open: true, message: "¡Configuración guardada correctamente!", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Error al guardar la configuración", severity: "error" });
    }
  };

  const handleClearSection = () => {
    const isAggregate = selectedCategoryId?.startsWith("agg-");
    const newServicios = JSON.parse(JSON.stringify(servicios));

    if (isAggregate) {
      const type = selectedCategoryId.replace("agg-", "");
      newServicios.forEach(srv => {
        (srv.sections || []).forEach(sec => {
          const n = normalize(sec.name);
          let match = false;
          if (type === "infra") match = n.includes("SALA") || n.includes("CAMA");
          if (type === "rrhh") match = (n.includes("RRHH") || n.includes("RECURSOS")) && !n.includes("JEFE");
          if (type === "js") match = n.includes("JEFE");
          if (type === "equip") match = n.includes("EQUIP") || n.includes("INSTRUMENTAL");
          if (type === "arq") match = n.includes("ARQUITECTURA") || n.includes("PLANO");
          
          if (match) sec.fields = [];
        });
      });
    } else {
      const srvIdx = newServicios.findIndex(s => s.id === selectedCategoryId || (s.sections || []).some(sec => sec.id === selectedCategoryId));
      if (srvIdx !== -1) {
        const srv = newServicios[srvIdx];
        const secIdx = (srv.sections || []).findIndex(sec => sec.id === selectedCategoryId);
        
        if (secIdx !== -1) {
          // Si seleccionamos una sección específica, vaciar solo esa
          srv.sections[secIdx].fields = [];
        } else {
          // Si seleccionamos el servicio completo, vaciar TODAS las secciones y campos base
          (srv.sections || []).forEach(sec => sec.fields = []);
          srv.fields = [];
        }
      }
    }

    setServicios(newServicios);
    setSnackbar({ open: true, message: "Se ha vaciado la sección correctamente.", severity: "info" });
  };

  if (loading) return <Box sx={{ p: 5 }}>Cargando configuración...</Box>;

  const isAggregate = selectedCategoryId?.startsWith("agg-");

  return (
    <Box sx={{ maxWidth: "1400px", width: "95%", mx: "auto", p: { xs: 2, md: 4, lg: 6 }, fontFamily: "Roboto, sans-serif" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate("..")} size="small" sx={{ backgroundColor: "#f1f5f9" }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2" sx={{ ml: 2, color: "#64748b", fontWeight: 600 }}>Volver a Selector</Typography>
      </Box>

      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>


        {inspectionMode === "TRAMITE" && (
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              select
              size="small"
              label="Seleccionar Trámite para Inspeccionar"
              value={selectedTramiteId}
              onChange={(e) => setSelectedTramiteId(e.target.value)}
              sx={{ minWidth: 300, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            >
              {tramites.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{t.razonSocial}</Typography>
                    <Typography variant="caption" color="textSecondary">{t.expediente}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              color="secondary"
              onClick={async () => {
                try {
                  const res = await fetch("http://localhost:3001/simulacion_inspeccion");
                  const rawData = await res.json();
                  const simData = Array.isArray(rawData) ? rawData[0] : rawData;
                  
                  if (simData) {
                    localStorage.setItem("efector_servicios", JSON.stringify(simData.servicios));
                    localStorage.setItem("efector_infra", JSON.stringify(simData.infraestructura));
                    localStorage.setItem("efector_rrhh", JSON.stringify(simData.rrhh));
                    localStorage.setItem("efector_jefes", JSON.stringify(simData.jefes));
                    localStorage.setItem("efector_equipos", JSON.stringify(simData.equipos));
                    localStorage.setItem("efector_tipo", simData.tipologia);
                    localStorage.setItem("efector_dt", JSON.stringify(simData.directorTecnico));
                    
                    setSnackbar({ open: true, message: "Datos de Trámite cargados desde db.json. Reiniciando para aplicar...", severity: "success" });
                    setTimeout(() => window.location.reload(), 1000);
                  }
                } catch (err) {
                  console.error("Error al cargar simulación:", err);
                  setSnackbar({ open: true, message: "Error al conectar con la base de datos de simulación.", severity: "error" });
                }
              }}
              sx={{ fontWeight: 800, borderRadius: 3, textTransform: 'none' }}
            >
              SIMULAR DATOS EN INSPECTOR
            </Button>
          </Stack>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 4, minHeight: "70vh" }}>
        <ConfigSidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          generalDataSrv={generalDataSrv}
          tramiteServices={tramiteServices}
          otherServices={otherServices}
          handleAddGeneralSection={handleAddGeneralSection}
          handleAddTramiteService={handleAddTramiteService}
          handleAddService={handleAddService}
          setAddRequirementDialog={setAddRequirementDialog}
          onSave={onSave}
          loading={loading}
        />

        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: "#1e293b" }}>
                  {(() => {
                    if (selectedCategoryId === "agg-infra") return "SALAS Y CAMAS (GLOBAL)";
                    if (selectedCategoryId === "agg-rrhh") return "RECURSOS HUMANOS (GLOBAL)";
                    if (selectedCategoryId === "agg-js") return "JEFE DE SERVICIO (GLOBAL)";
                    if (selectedCategoryId === "agg-equip") return "EQUIPAMIENTO (GLOBAL)";
                    if (selectedCategoryId === "agg-arq") return "ARQUITECTURA (GLOBAL)";
                    
                    const sec = generalDataSrv?.sections?.find(s => s.id === selectedCategoryId);
                    if (sec) return sec.name;
                    const srv = servicios.find(s => s.id === selectedCategoryId);
                    return srv?.name || "Seleccione una categoría";
                  })()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Configura en qué servicios se aplica cada requisito de forma masiva
                </Typography>
              </Box>
              <Tooltip title="Vaciar esta sección">
                <IconButton 
                  color="error" 
                  onClick={handleClearSection}
                  sx={{ 
                    ml: 1, 
                    mr: 2,
                    bgcolor: "rgba(239, 68, 68, 0.05)",
                    "&:hover": { bgcolor: "rgba(239, 68, 68, 0.15)" }
                  }}
                >
                  <DeleteSweepIcon />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setAddRequirementDialog({ 
                    open: true, 
                    // Pre-select current service if it's not a global view
                    selectedServices: selectedCategoryId?.startsWith("agg-") ? [] : [selectedCategoryId] 
                  });
                }}
                sx={{ textTransform: "none", fontWeight: 800, borderRadius: 2, bgcolor: "#0B85C4", "&:hover": { bgcolor: "#096da1" } }}
              >
                Añadir Requisito Manual
              </Button>
            </Box>

            {inspectionMode === "TRAMITE" && selectedTramiteId && (
              <Chip
                label={`Expediente: ${tramites.find(t => t.id === selectedTramiteId)?.expediente}`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
            )}
          </Box>

          {isAggregate ? (
            <AggregatedSection
              type={selectedCategoryId.replace("agg-", "")}
              selectedCategoryId={selectedCategoryId}
              equipamientos={equipamientos}
              optionDrafts={optionDrafts}
              setOptionDrafts={setOptionDrafts}
              setHardcodeDialog={setHardcodeDialog}
              setAddRequirementDialog={setAddRequirementDialog}
              setSnackbar={setSnackbar}
              onEdit={(row) => setEditRequirementDialog({ open: true, fieldData: row })}
            />
          ) : (
            <StandardSection
              selectedCategoryId={selectedCategoryId}
              activeTab={activeTab}
              equipamientos={equipamientos}
              rrhhList={rrhhList}
              jefeServicioList={jefeServicioList}
              optionDrafts={optionDrafts}
              setOptionDrafts={setOptionDrafts}
              setHardcodeDialog={setHardcodeDialog}
              setAddRequirementDialog={setAddRequirementDialog}
              setSnackbar={setSnackbar}
              onEdit={(row) => setEditRequirementDialog({ open: true, fieldData: row })}
            />
          )}
        </Box>
      </Box>

      <Tooltip title="Guardar Cambios" placement="left">
        <Fab
          variant="extended"
          onClick={onSave}
          disabled={loading}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            backgroundColor: "#32A430",
            color: "white",
            boxShadow: "0 10px 25px -5px rgba(50, 164, 48, 0.4)",
            "&:hover": { backgroundColor: "#2d932b", transform: "scale(1.05)" },
            transition: "all 0.2s ease",
            px: 4,
            fontWeight: 800,
          }}
        >
          <SaveIcon sx={{ mr: 1.5 }} />
          Guardar Configuración
        </Fab>
      </Tooltip>

      <HardcodeDialog
        open={hardcodeDialog.open}
        onClose={() => setHardcodeDialog({ ...hardcodeDialog, open: false })}
        field={hardcodeDialog.field}
        value={hardcodeDialog.value}
        onChangeValue={(val) => setHardcodeDialog({ ...hardcodeDialog, value: val })}
        onConfirm={() => {
          const { srvIdx, secIdx, fIdx, value, field } = hardcodeDialog;
          const newServicios = [...servicios];
          if (secIdx !== -1) {
            newServicios[srvIdx].sections[secIdx].fields[fIdx].valorTramite = value;
          } else {
            newServicios[srvIdx].fields[fIdx].valorTramite = value;
          }
          setServicios(newServicios);
          setHardcodeDialog({ ...hardcodeDialog, open: false });
          setSnackbar({ open: true, message: `Valor "${value}" asignado a "${field.label}". No olvides GUARDAR.`, severity: "success" });
        }}
      />

      <AddRequirementDialog
        open={addRequirementDialog.open}
        onClose={() => setAddRequirementDialog({ open: false, selectedServices: [] })}
        onConfirm={handleConfirmAddRequirement}
        availableServices={otherServices}
        initialSelected={addRequirementDialog.selectedServices}
        category={selectedCategoryId?.startsWith("agg-") ? selectedCategoryId.replace("agg-", "").toUpperCase() : "SERVICIO"}
      />

      <EditRequirementDialog
        open={editRequirementDialog.open}
        onClose={() => setEditRequirementDialog({ open: false, fieldData: null })}
        onConfirm={handleConfirmEditRequirement}
        fieldData={editRequirementDialog.fieldData}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 3 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClinicasDashboard;
