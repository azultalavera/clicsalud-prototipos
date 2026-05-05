import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Paper,
  Divider,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tabs,
  Tab,
  Fab,
  Alert,
  Snackbar,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Apartment as ApartmentIcon,
  FaceRetouchingNatural as FaceRetouchingNaturalIcon,
  MedicalServices as MedicalServicesIcon,
  DeleteOutline as DeleteOutlineIcon,
  Add as AddIcon,
  DragIndicator as DragIndicatorIcon,
  Bed as BedIcon,
  People as PeopleIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  ListAlt as ListAltIcon,
  Bolt as BoltIcon,
  Science as ScienceIcon,
  ExpandMore as ExpandMoreIcon,
  Layers as LayersIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { ConfigContext, slugify, fieldTypes } from "./ConfiguradorClinicas";

const TRAMITE_MAPPING = {
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

const PASOS_TRAMITE = [
  "DATOS GENERALES",
  "ARQUITECTURA",
  "INFRAESTRUCTURA",
  "EQUIPAMIENTO",
  "RECURSOS HUMANOS",
  "SERVICIOS",
  "FINALIZACIÓN"
];

const normalize = (str) =>
  (str || "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

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

  const calculatedFields = React.useMemo(() => {
    if (!servicios) return [];
    
    let fields = [];
    const isAggregate = selectedCategoryId?.startsWith("agg-");
    const type = selectedCategoryId?.replace("agg-", "");

    if (isAggregate) {
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
      rawFields.forEach(f => {
        const key = normalize(f.label || f.name);
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
      fields = Object.values(grouped);
    } else {
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
            fields = srv.sections.flatMap((sec, sIdx) => 
              (sec.fields || []).map((f, fIdx) => ({
                ...f,
                _srvIdx: srvIdx,
                _secIdx: sIdx,
                _originalIdx: fIdx,
                _secName: sec.name
              }))
            );
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
    }
    return fields;
  }, [servicios, selectedCategoryId]);

  const parseOptions = (options = "") =>
    String(options)
      .split(",")
      .map((option) => option.trim())
      .filter(Boolean);

  const handleAddOption = (row) => {
    const fieldId = row.id;
    const nextOption = (optionDrafts[fieldId] || "").trim();
    if (!nextOption) return;

    const newServicios = JSON.parse(JSON.stringify(servicios));

    if (row.idsByService) {
      newServicios.forEach(srv => {
        if (row.idsByService[srv.id]) {
          srv.sections.forEach(sec => {
            sec.fields = sec.fields.map(f => {
              if (f.id === row.idsByService[srv.id]) {
                const currentOptions = parseOptions(f.options);
                if (!currentOptions.some(opt => opt.toLowerCase() === nextOption.toLowerCase())) {
                  return { ...f, options: [...currentOptions, nextOption].join(", ") };
                }
              }
              return f;
            });
          });
        }
      });
    } else {
      const srv = newServicios[row._srvIdx];
      if (srv) {
        let targetFields = row._secIdx !== -1 ? srv.sections[row._secIdx].fields : srv.fields;
        if (targetFields && targetFields[row._originalIdx]) {
          const currentOptions = parseOptions(targetFields[row._originalIdx].options);
          if (!currentOptions.some(opt => opt.toLowerCase() === nextOption.toLowerCase())) {
            targetFields[row._originalIdx].options = [...currentOptions, nextOption].join(", ");
          }
        }
      }
    }
    setServicios(newServicios);
    setOptionDrafts(prev => ({ ...prev, [fieldId]: "" }));
  };

  const handleRemoveOption = (row, optionToRemove) => {
    const newServicios = JSON.parse(JSON.stringify(servicios));

    if (row.idsByService) {
      newServicios.forEach(srv => {
        if (row.idsByService[srv.id]) {
          srv.sections.forEach(sec => {
            sec.fields = sec.fields.map(f => {
              if (f.id === row.idsByService[srv.id]) {
                const remainingOptions = parseOptions(f.options).filter(opt => opt !== optionToRemove);
                return { ...f, options: remainingOptions.join(", ") };
              }
              return f;
            });
          });
        }
      });
    } else {
      const srv = newServicios[row._srvIdx];
      if (srv) {
        let targetFields = row._secIdx !== -1 ? srv.sections[row._secIdx].fields : srv.fields;
        if (targetFields && targetFields[row._originalIdx]) {
          const remainingOptions = parseOptions(targetFields[row._originalIdx].options).filter(opt => opt !== optionToRemove);
          targetFields[row._originalIdx].options = remainingOptions.join(", ");
        }
      }
    }
    setServicios(newServicios);
  };

  const handleLoadMinimums = () => {
    const isAggregate = selectedCategoryId?.startsWith("agg-");
    const newServicios = [...servicios];

    if (isAggregate) {
      const aggType = selectedCategoryId.replace("agg-", "");
      
      if (aggType === "infra") {
        // SALAS -> QUIROFANO, SALA DE PARTO
        ["QUIRÓFANO", "SALA DE PARTO"].forEach(srvName => {
          const srv = newServicios.find(s => s.name.toUpperCase() === srvName);
          if (srv) {
            const sec = srv.sections.find(s => normalize(s.name).includes("SALA"));
            if (sec && !sec.fields.some(f => normalize(f.label) === "salas")) {
              sec.fields.push({ id: `fld-${Date.now()}-${Math.random()}`, label: "SALAS", type: "number", origin: "ADMIN" });
            }
          }
        });

        // CAMAS -> ALL
        newServicios.forEach((s, sIdx) => {
          const sec = s.sections.find(sec => normalize(sec.name).includes("CAMA"));
          if (sec && !sec.fields.some(f => normalize(f.label) === "camas")) {
            sec.fields.push({ id: `fld-${Date.now()}-${Math.random()}`, label: "CAMAS", type: "number", origin: "ADMIN" });
          }
        });

        // REQUISITOS DEL TRÁMITE (TOTAL CAMAS / SERVICIOS)
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
        // EQUIPAMIENTO MÍNIMO -> ALL
        newServicios.forEach((s, sIdx) => {
          const sec = s.sections.find(sec => normalize(sec.name).includes("EQUIP"));
          if (sec && !sec.fields.some(f => normalize(f.label).includes("equipamiento"))) {
            sec.fields.push({ 
              id: `fld-equip-${Date.now()}-${Math.random()}`, 
              label: "EQUIPAMIENTO MÍNIMO", 
              type: "number", 
              origin: "TRÁMITE",
              pasoTramite: "EQUIPAMIENTO",
              tramiteService: s.name
            });
          }
        });
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
      return;
    }

    const currentSrv = servicios.find(s => s.id === selectedCategoryId) ||
      servicios.flatMap(s => s.sections || []).find(s => s.id === selectedCategoryId);
    if (!currentSrv) return;

    let sourceList = [];
    let fieldType = "text";
    let labelField = "";

    if (activeTab === 1) { // Infra
      sourceList = [...TRAMITE_MAPPING.SALAS, ...TRAMITE_MAPPING.CAMAS].map(name => ({ name }));
      fieldType = "number";
      labelField = "name";
    } else if (activeTab === 2) {
      sourceList = equipamientos;
      fieldType = "number";
      labelField = "equipamiento";
    }

    const filtered = sourceList.filter(item => {
      const label = typeof labelField === "function" ? labelField(item) : item[labelField];
      return !currentSrv.sections?.some(sec => sec.fields.some(f => f.label === label));
    });

    if (filtered.length > 0) {
      const targetSrvIdx = newServicios.findIndex(s => s.id === selectedCategoryId || s.sections?.some(sec => sec.id === selectedCategoryId));
      const targetSrv = newServicios[targetSrvIdx];
      const targetSecIdx = targetSrv.sections?.findIndex(sec => sec.id === selectedCategoryId) ?? -1;

      filtered.forEach(item => {
        const label = typeof labelField === "function" ? labelField(item) : item[labelField];
        const newF = { id: `fld-${Date.now()}-${Math.random()}`, label, type: fieldType, origin: "ADMIN" };
        if (targetSecIdx !== -1) targetSrv.sections[targetSecIdx].fields.push(newF);
        else targetSrv.fields.push(newF);
      });
      setServicios(newServicios);
      setSnackbar({ open: true, message: `Se cargaron ${filtered.length} requisitos`, severity: "success" });
    }
  };

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
    if (activeTab > 0 && selectedCategoryId && equipamientos.length > 0 && rrhhList.length > 0 && jefeServicioList.length > 0) {
      handleLoadMinimums(true); // true means silent/auto
    }
  }, [selectedCategoryId, activeTab, equipamientos, rrhhList, jefeServicioList]);

  useEffect(() => {
    if (!selectedCategoryId && servicios.length > 0) {
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

  const handleConfirmAddRequirement = (label, servicesIds) => {
    if (!label.trim() || servicesIds.length === 0) return;
    
    const isAggregate = selectedCategoryId?.startsWith("agg-");
    const aggType = isAggregate ? selectedCategoryId.replace("agg-", "") : null;
    
    const newServicios = JSON.parse(JSON.stringify(servicios));
    
    servicesIds.forEach(srvId => {
      const srv = newServicios.find(s => s.id === srvId);
      if (!srv) return;

      const newField = {
        id: `fld-${Date.now()}-${Math.random()}`,
        label: label.toUpperCase(),
        type: (aggType === "infra" || aggType === "equip") ? "number" : "text",
        origin: (aggType === "equip" || aggType === "infra") ? "TRÁMITE" : "ADMIN",
        pasoTramite: aggType === "equip" ? "EQUIPAMIENTO" : (aggType === "infra" ? "INFRAESTRUCTURA" : ""),
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

  const onSave = async () => {
    try {
      await handleSaveConfig();
      setSnackbar({ open: true, message: "¡Configuración guardada correctamente!", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Error al guardar la configuración", severity: "error" });
    }
  };


  if (loading) return <Box sx={{ p: 5 }}>Cargando configuración...</Box>;

  return (
    <Box sx={{ maxWidth: "1400px", width: "95%", mx: "auto", p: { xs: 2, md: 4, lg: 6 }, fontFamily: "Roboto, sans-serif" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate("..")} size="small" sx={{ backgroundColor: "#f1f5f9" }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2" sx={{ ml: 2, color: "#64748b", fontWeight: 600 }}>Volver a Selector</Typography>
      </Box>

      {/* MODO SELECTION */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
        <ToggleButtonGroup
          value={inspectionMode}
          exclusive
          onChange={(e, next) => next && setInspectionMode(next)}
          size="small"
          sx={{
            backgroundColor: "#ffffff",
            "& .MuiToggleButton-root": {
              px: 3,
              fontWeight: 800,
              border: "1px solid #e2e8f0",
              color: "#64748b",
              "&.Mui-selected": {
                backgroundColor: "#0B85C4",
                color: "#ffffff",
                "&:hover": { backgroundColor: "#096da1" },
              },
            },
          }}
        >
          <ToggleButton value="ADMIN">ADMIN</ToggleButton>
          <ToggleButton value="TRAMITE">TRÁMITE</ToggleButton>
        </ToggleButtonGroup>

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
              onClick={() => {
                const mockServicios = ["INTERNACIÓN GENERAL", "CENTRO QUIRÚRGICO", "UNIDAD DE TERAPIA INTENSIVA ADULTOS", "NEONATOLOGÍA"];
                const mockInfra = { "QUIRÓFANOS": 2, "SALA DE PARTOS": 1, "INTERNACIÓN GENERAL": 20, "NEONATOLOGÍA": 6 };
                const mockRrhh = [
                  { origen: "CENTRO QUIRÚRGICO", especialidad: "Enfermero/a", cantidad: 4 },
                  { origen: "UNIDAD DE TERAPIA INTENSIVA ADULTOS", especialidad: "Médico/a Especialista", cantidad: 2 }
                ];
                const mockEquipos = [
                  { origen: "CENTRO QUIRÚRGICO", equipamiento: "Mesa de Cirugía", cantidad: 2 },
                  { origen: "CENTRO QUIRÚRGICO", equipamiento: "Monitor Multiparamétrico", cantidad: 4 }
                ];

                localStorage.setItem("efector_servicios", JSON.stringify(mockServicios));
                localStorage.setItem("efector_infra", JSON.stringify(mockInfra));
                localStorage.setItem("efector_rrhh", JSON.stringify(mockRrhh));
                localStorage.setItem("efector_equipos", JSON.stringify(mockEquipos));
                localStorage.setItem("efector_tipo", "CLÍNICAS, SANATORIOS Y HOSPITALES");
                localStorage.setItem("efector_dt", JSON.stringify({ nombre: "MARIA", apellido: "GOMEZ", dni: "25.123.456" }));

                setSnackbar({ open: true, message: "Datos de Trámite simulados para el Inspector.", severity: "success" });
              }}
              sx={{ fontWeight: 800, borderRadius: 3, textTransform: 'none' }}
            >
              SIMULAR DATOS EN INSPECTOR
            </Button>
          </Stack>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 4, minHeight: "70vh" }}>
        {/* SIDEBAR */}
        <Paper
          elevation={0}
          sx={{
            width: 320,
            flexShrink: 0,
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0", bgcolor: "#f8fafc" }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar servicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <AddIcon sx={{ mr: 1, color: "#64748b", transform: "rotate(45deg)", fontSize: 20 }} />,
                sx: { borderRadius: 3, bgcolor: "white" }
              }}
            />
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            {/* ACCORDION: DATOS GENERALES */}
            <Accordion 
              defaultExpanded 
              elevation={0} 
              sx={{ 
                borderBottom: "1px solid #e2e8f0", 
                "&:before": { display: "none" },
                "&.Mui-expanded": { margin: 0 }
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 900, color: "#1e293b", fontSize: "0.85rem", textTransform: "uppercase" }}>
                  DATOS GENERALES
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List sx={{ py: 0 }}>
                  {generalDataSrv?.sections?.map((sec) => (
                    <ListItemButton
                      key={sec.id}
                      selected={selectedCategoryId === sec.id}
                      onClick={() => setSelectedCategoryId(sec.id)}
                      sx={{
                        mx: 1,
                        borderRadius: 2,
                        mb: 0.5,
                        "&.Mui-selected": { backgroundColor: "rgba(11, 133, 196, 0.08)", color: "#0B85C4" },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <ListAltIcon fontSize="small" color={selectedCategoryId === sec.id ? "primary" : "inherit"} />
                      </ListItemIcon>
                      <ListItemText
                        primary={sec.name}
                        primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: selectedCategoryId === sec.id ? 800 : 500 }}
                      />
                    </ListItemButton>
                  ))}
                  <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Button 
                      size="small" 
                      variant="text" 
                      startIcon={<AddIcon />} 
                      onClick={handleAddGeneralSection}
                      sx={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'none' }}
                    >
                      Añadir Paso
                    </Button>
                  </Box>
                </List>
              </AccordionDetails>
            </Accordion>

            {/* ACCORDION: DATOS DEL TRÁMITE */}
            <Accordion 
              defaultExpanded 
              elevation={0} 
              sx={{ 
                borderBottom: "1px solid #e2e8f0", 
                "&:before": { display: "none" },
                "&.Mui-expanded": { margin: 0 }
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 900, color: "#32A430", fontSize: "0.85rem", textTransform: "uppercase" }}>
                  DATOS DEL TRÁMITE
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List sx={{ py: 0 }}>
                  {[
                    { id: "agg-arq", name: "ARQUITECTURA", icon: <ApartmentIcon fontSize="small" /> },
                    { id: "agg-infra", name: "SALAS Y CAMAS", icon: <BedIcon fontSize="small" /> },
                    { id: "agg-rrhh", name: "RECURSOS HUMANOS", icon: <PeopleIcon fontSize="small" /> },
                    { id: "agg-js", name: "JEFE DE SERVICIO", icon: <FaceRetouchingNaturalIcon fontSize="small" /> },
                    { id: "agg-equip", name: "EQUIPAMIENTO", icon: <MedicalServicesIcon fontSize="small" /> },
                  ].map((cat) => (
                    <ListItemButton
                      key={cat.id}
                      selected={selectedCategoryId === cat.id}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      sx={{
                        mx: 1,
                        borderRadius: 2,
                        mb: 0.5,
                        "&.Mui-selected": { backgroundColor: "rgba(50, 164, 48, 0.08)", color: "#32A430" },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {React.cloneElement(cat.icon, { color: selectedCategoryId === cat.id ? "success" : "inherit" })}
                      </ListItemIcon>
                      <ListItemText
                        primary={cat.name}
                        primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: selectedCategoryId === cat.id ? 800 : 500 }}
                      />
                    </ListItemButton>
                  ))}
                  <Divider sx={{ my: 1, mx: 2 }} />
                  {tramiteServices.map((srv) => (
                    <ListItemButton
                      key={srv.id}
                      selected={selectedCategoryId === srv.id}
                      onClick={() => setSelectedCategoryId(srv.id)}
                      sx={{
                        mx: 1,
                        borderRadius: 2,
                        mb: 0.5,
                        "&.Mui-selected": { backgroundColor: "rgba(50, 164, 48, 0.08)", color: "#32A430" },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <ApartmentIcon fontSize="small" color={selectedCategoryId === srv.id ? "success" : "inherit"} />
                      </ListItemIcon>
                      <ListItemText
                        primary={srv.name}
                        primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: selectedCategoryId === srv.id ? 800 : 500 }}
                      />
                    </ListItemButton>
                  ))}
                  <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Button 
                      size="small" 
                      variant="text" 
                      startIcon={<AddIcon />} 
                      onClick={handleAddTramiteService}
                      sx={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'none', color: '#32A430' }}
                    >
                      Añadir Área del Trámite
                    </Button>
                  </Box>
                </List>
              </AccordionDetails>
            </Accordion>

            {/* ACCORDION: SERVICIOS CLÍNICOS */}
            <Accordion 
              defaultExpanded 
              elevation={0} 
              sx={{ 
                borderBottom: "1px solid #e2e8f0", 
                "&:before": { display: "none" },
                "&.Mui-expanded": { margin: 0 }
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 900, color: "#64748b", fontSize: "0.85rem", textTransform: "uppercase" }}>
                  SERVICIOS CLÍNICOS
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List sx={{ py: 0 }}>
                  {otherServices
                    .filter(s => normalize(s.name).includes(normalize(searchTerm)))
                    .map((srv) => (
                    <ListItemButton
                      key={srv.id}
                      selected={selectedCategoryId === srv.id}
                      onClick={() => setSelectedCategoryId(srv.id)}
                      sx={{
                        mx: 1,
                        borderRadius: 2,
                        mb: 0.5,
                        "&.Mui-selected": { backgroundColor: "rgba(100, 116, 139, 0.08)", color: "#64748b" },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <MedicalServicesIcon fontSize="small" color={selectedCategoryId === srv.id ? "primary" : "inherit"} />
                      </ListItemIcon>
                      <ListItemText
                        primary={srv.name}
                        primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: selectedCategoryId === srv.id ? 800 : 500 }}
                      />
                    </ListItemButton>
                  ))}
                  <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Button 
                      size="small" 
                      variant="text" 
                      startIcon={<AddIcon />} 
                      onClick={handleAddService}
                      sx={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'none', color: '#64748b' }}
                    >
                      Añadir Servicio Clínico
                    </Button>
                  </Box>
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box sx={{ p: 2, borderTop: "1px solid #e2e8f0", bgcolor: "#f8fafc" }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={onSave}
              sx={{ textTransform: "none", fontWeight: 800, borderRadius: 2, bgcolor: "#0B85C4" }}
            >
              Guardar Configuración
            </Button>
          </Box>

        </Paper>

        {/* MAIN CONTENT AREA */}
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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

            {inspectionMode === "TRAMITE" && selectedTramiteId && (
              <Chip
                label={`Expediente: ${tramites.find(t => t.id === selectedTramiteId)?.expediente}`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
            )}
          </Box>

          <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f8fafc", borderBottom: "2px solid #e2e8f0", position: "sticky", top: 0, zIndex: 10 }}>
                <TableRow>
                  <TableCell sx={{ width: "160px", color: "#64748b", fontWeight: 800, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: "#f8fafc" }}>DATO</TableCell>
                  <TableCell sx={{ width: "150px", color: "#64748b", fontWeight: 800, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: "#f8fafc" }}>{selectedCategoryId?.startsWith("agg-") ? "PASO" : "SUBSECCIÓN"}</TableCell>
                  <TableCell sx={{ color: "#64748b", fontWeight: 800, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: "#f8fafc" }}>REQUISITO</TableCell>
                  <TableCell sx={{ width: "200px", color: "#64748b", fontWeight: 800, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: "#f8fafc" }}>TIPO DE DATO</TableCell>
                  <TableCell align="center" sx={{ width: 110, color: "#64748b", fontWeight: 800, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: "#f8fafc" }}>ACCIONES</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {calculatedFields.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 10, textAlign: "center", color: "#94a3b8" }}>
                      No hay requisitos configurados. Usa "Cargar Mínimos" para empezar.
                    </TableCell>
                  </TableRow>
                ) : (
                  calculatedFields.map((row) => (
                    <TableRow key={row.id} sx={{ "&:hover": { bgcolor: "#fcfcfc" }, "& td": { borderBottom: "1px solid #f1f5f9" } }}>
                      {/* DATO: toggle ADMIN / TRÁMITE */}
                      <TableCell sx={{ width: 170, py: 1 }}>
                        <ToggleButtonGroup
                          value={row.origin || "ADMIN"}
                          exclusive
                          onChange={(e, val) => {
                            if (!val) return;
                            const newServicios = JSON.parse(JSON.stringify(servicios));

                            if (row.idsByService) {
                              newServicios.forEach(srv => {
                                if (row.idsByService[srv.id]) {
                                  srv.sections.forEach(sec => {
                                    sec.fields = sec.fields.map(f => f.id === row.idsByService[srv.id] ? { ...f, origin: val, ...(val === "ADMIN" ? { tramiteField: "" } : {}) } : f);
                                  });
                                }
                              });
                            } else {
                              const srv = newServicios[row._srvIdx];
                              if (srv) {
                                let targetFields = row._secIdx !== -1 ? srv.sections[row._secIdx].fields : srv.fields;
                                if (targetFields && targetFields[row._originalIdx]) {
                                  targetFields[row._originalIdx].origin = val;
                                  if (val === "ADMIN") targetFields[row._originalIdx].tramiteField = "";
                                }
                              }
                            }
                            setServicios(newServicios);
                          }}
                          size="small"
                          sx={{
                            "& .MuiToggleButton-root": {
                              py: 0.3, px: 1.5,
                              fontSize: "0.68rem",
                              fontWeight: 800,
                              border: "1px solid #e2e8f0",
                              "&.Mui-selected": {
                                bgcolor: "#0B85C4",
                                color: "white",
                                "&:hover": { bgcolor: "#096da1" }
                              }
                            }
                          }}
                        >
                          <ToggleButton value="ADMIN">ADMIN</ToggleButton>
                          <ToggleButton value="TRÁMITE">TRÁMITE</ToggleButton>
                        </ToggleButtonGroup>
                      </TableCell>

                      {/* PASO DEL TRÁMITE (Si es TRÁMITE muestra select, si es ADMIN muestra nombre sección) */}
                      <TableCell sx={{ width: 150, py: 1 }}>
                        {(row.origin || "ADMIN") === "TRÁMITE" ? (
                          <Select
                            fullWidth
                            size="small"
                            variant="standard"
                            value={row.pasoTramite || ""}
                            displayEmpty
                            onChange={(e) => {
                              const val = e.target.value;
                              const newServicios = JSON.parse(JSON.stringify(servicios));

                              if (row.idsByService) {
                                newServicios.forEach(srv => {
                                  if (row.idsByService[srv.id]) {
                                    srv.sections.forEach(sec => {
                                      sec.fields = sec.fields.map(f => f.id === row.idsByService[srv.id] ? { ...f, pasoTramite: val } : f);
                                    });
                                  }
                                });
                              } else {
                                const srv = newServicios[row._srvIdx];
                                if (srv) {
                                  let targetFields = row._secIdx !== -1 ? srv.sections[row._secIdx].fields : srv.fields;
                                  if (targetFields && targetFields[row._originalIdx]) {
                                    targetFields[row._originalIdx].pasoTramite = val;
                                  }
                                }
                              }
                              setServicios(newServicios);
                            }}
                            sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b" }}
                            InputProps={{ disableUnderline: true }}
                          >
                            <MenuItem value="" disabled>Seleccionar paso...</MenuItem>
                            {PASOS_TRAMITE.map(paso => (
                              <MenuItem key={paso} value={paso} sx={{ fontSize: "0.75rem" }}>
                                {paso}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : (
                          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8" }}>
                            {row._secName || "ÚNICO"}
                          </Typography>
                        )}
                      </TableCell>

                      {/* REQUISITO: TextField si ADMIN, Select/combo si TRÁMITE */}
                      <TableCell sx={{ py: 1 }}>
                        {(row.origin || "ADMIN") === "TRÁMITE" ? (
                          <Select
                            fullWidth
                            size="small"
                            variant="standard"
                            value={row.tramiteField || ""}
                            displayEmpty
                            onChange={(e) => {
                              const val = e.target.value;
                              const fieldName = val.split(" > ").pop();
                              const newServicios = JSON.parse(JSON.stringify(servicios));

                              if (row.idsByService) {
                                newServicios.forEach(srv => {
                                  if (row.idsByService[srv.id]) {
                                    srv.sections.forEach(sec => {
                                      sec.fields = sec.fields.map(f =>
                                        f.id === row.idsByService[srv.id]
                                          ? { ...f, tramiteField: val, label: fieldName, ...(fieldName.toUpperCase().includes("FECHA") ? { type: "date" } : {}) }
                                          : f
                                      );
                                    });
                                  }
                                });
                              } else {
                                const srv = newServicios[row._srvIdx];
                                if (srv) {
                                  let targetFields = row._secIdx !== -1 ? srv.sections[row._secIdx].fields : srv.fields;
                                  if (targetFields && targetFields[row._originalIdx]) {
                                    targetFields[row._originalIdx].tramiteField = val;
                                    targetFields[row._originalIdx].label = fieldName;
                                    if (fieldName.toUpperCase().includes("FECHA")) {
                                      targetFields[row._originalIdx].type = "date";
                                    }
                                  }
                                }
                              }
                              setServicios(newServicios);
                            }}
                            sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#0B85C4" }}
                          >
                            <MenuItem value="" disabled>Seleccionar atributo del trámite...</MenuItem>
                            {Object.keys(TRAMITE_MAPPING).map(category => [
                              <MenuItem
                                key={`cat-${category}`}
                                disabled
                                sx={{ backgroundColor: "#f8fafc", fontWeight: 800, color: "#64748b", fontSize: "0.7rem", letterSpacing: "0.05em" }}
                              >
                                {category}
                              </MenuItem>,
                              ...TRAMITE_MAPPING[category].map(attr => (
                                <MenuItem key={attr} value={`${category} > ${attr}`} sx={{ pl: 3, fontSize: "0.85rem" }}>
                                  {attr}
                                </MenuItem>
                              ))
                            ])}
                          </Select>
                        ) : (
                          <TextField
                            fullWidth size="small" variant="standard"
                            value={row.label || ""}
                            placeholder="Escribir requisito..."
                            onChange={(e) => {
                              const val = e.target.value;
                              const newServicios = JSON.parse(JSON.stringify(servicios));

                              if (row.idsByService) {
                                newServicios.forEach(srv => {
                                  if (row.idsByService[srv.id]) {
                                    srv.sections.forEach(sec => {
                                      sec.fields = sec.fields.map(f => f.id === row.idsByService[srv.id] ? { ...f, label: val } : f);
                                    });
                                  }
                                });
                              } else {
                                const srv = newServicios[row._srvIdx];
                                if (srv) {
                                  let targetFields = row._secIdx !== -1 ? srv.sections[row._secIdx].fields : srv.fields;
                                  if (targetFields && targetFields[row._originalIdx]) {
                                    targetFields[row._originalIdx].label = val;
                                  }
                                }
                              }
                              setServicios(newServicios);
                            }}
                            InputProps={{ disableUnderline: true, sx: { fontSize: "0.85rem", fontWeight: 600 } }}
                          />
                        )}
                        {row.tramiteService && (
                          <Typography variant="caption" sx={{ display: 'block', color: '#0ea5e9', fontWeight: 900, mt: 0.5, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                            SERVICIO: {row.tramiteService}
                          </Typography>
                        )}
                      </TableCell>

                      {/* TIPO DE DATO */}
                      <TableCell sx={{ width: 200, py: 1 }}>
                        <TextField
                          select fullWidth size="small" variant="standard"
                          value={row.type || "text"}
                          onChange={(e) => {
                            const val = e.target.value;
                            const newServicios = JSON.parse(JSON.stringify(servicios));

                            if (row.idsByService) {
                              newServicios.forEach(srv => {
                                if (row.idsByService[srv.id]) {
                                  srv.sections.forEach(sec => {
                                    sec.fields = sec.fields.map(f => f.id === row.idsByService[srv.id] ? { ...f, type: val } : f);
                                  });
                                }
                              });
                            } else {
                              const srv = newServicios[row._srvIdx];
                              if (srv) {
                                let targetFields = row._secIdx !== -1 ? srv.sections[row._secIdx].fields : srv.fields;
                                if (targetFields && targetFields[row._originalIdx]) {
                                  targetFields[row._originalIdx].type = val;
                                }
                              }
                            }
                            setServicios(newServicios);
                          }}
                          InputProps={{ disableUnderline: true, sx: { fontSize: "0.85rem", fontWeight: 600 } }}
                        >
                          {fieldTypes.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                        </TextField>

                        {/* Gestión de opciones para toggle/select */}
                        {(row.type === "toggle" || row.type === "select") && (
                          <Box sx={{ mt: 1 }}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <TextField
                                size="small"
                                variant="outlined"
                                placeholder="Nueva opción..."
                                value={optionDrafts[row.id] || ""}
                                onChange={(e) => setOptionDrafts(prev => ({ ...prev, [row.id]: e.target.value }))}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddOption(row);
                                  }
                                }}
                                sx={{ 
                                  "& .MuiOutlinedInput-root": { borderRadius: 2, height: 30, fontSize: "0.75rem" }
                                }}
                              />
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleAddOption(row)}
                              >
                                <AddIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Stack>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                              {parseOptions(row.options).map((opt, idx) => (
                                <Chip
                                  key={idx}
                                  label={opt}
                                  size="small"
                                  onDelete={() => handleRemoveOption(row, opt)}
                                  sx={{ 
                                    height: 20, 
                                    fontSize: "0.65rem", 
                                    fontWeight: 700,
                                    bgcolor: "#f1f5f9"
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </TableCell>

                      {/* ACCIONES */}
                      <TableCell align="center" sx={{ width: 110, py: 1 }}>
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="Simular valor (Hardcode)">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setHardcodeDialog({
                                  open: true,
                                  field: row,
                                  value: row.valorTramite || "",
                                  srvIdx: row._srvIdx ?? -1,
                                  secIdx: row._secIdx ?? -1,
                                  fIdx: row._originalIdx ?? -1,
                                });
                              }}
                              sx={{
                                color: "#0ea5e9",
                                bgcolor: "rgba(14, 165, 233, 0.08)",
                                "&:hover": { bgcolor: "rgba(14, 165, 233, 0.18)" }
                              }}
                            >
                              <ScienceIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <IconButton size="small" onClick={() => {
                          const newServicios = (servicios || []).map(srv => {
                            if (row.idsByService && row.idsByService[srv.id]) {
                              return {
                                ...srv,
                                sections: srv.sections.map(sec => ({
                                  ...sec,
                                  fields: sec.fields.filter(f => f.id !== row.idsByService[srv.id])
                                }))
                              };
                            }
                            if (!row.idsByService && row._srvIdx === servicios.indexOf(srv)) {
                              if (row._secIdx !== -1) {
                                return {
                                  ...srv,
                                  sections: srv.sections.map((sec, si) =>
                                    si === row._secIdx
                                      ? { ...sec, fields: sec.fields.filter((_, fi) => fi !== row._originalIdx) }
                                      : sec
                                  )
                                };
                              } else {
                                return { ...srv, fields: (srv.fields || []).filter((_, fi) => fi !== row._originalIdx) };
                              }
                            }
                            return srv;
                          });
                          setServicios(newServicios);
                        }} sx={{ color: "#94a3b8", "&:hover": { color: "#ef4444" } }}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <Box sx={{ p: 2, bgcolor: "#fcfcfc", borderTop: "1px solid #e2e8f0", textAlign: "center", display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ListAltIcon />}
                onClick={handleLoadMinimums}
                sx={{ textTransform: "none", fontWeight: 800, borderRadius: 2, borderColor: "#0B85C4", color: "#0B85C4" }}
              >
                Cargar Mínimos
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setAddRequirementDialog({ 
                    open: true, 
                    selectedServices: selectedCategoryId?.startsWith("agg-") ? [] : [selectedCategoryId] 
                  });
                }}
                sx={{ textTransform: "none", fontWeight: 800, borderRadius: 2, bgcolor: "#0B85C4", "&:hover": { bgcolor: "#096da1" } }}
              >
                Añadir Requisito
              </Button>
            </Box>
          </Paper>
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

      {/* DIALOGO DE HARCODEO (SIMULACIÓN) */}
      <Dialog
        open={hardcodeDialog.open}
        onClose={() => setHardcodeDialog({ ...hardcodeDialog, open: false })}
        PaperProps={{ sx: { borderRadius: 4, width: '100%', maxWidth: 450, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: '#1e293b' }}>
          Simular Valor (Harcodeo)
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
            Ingrese el valor que desea que aparezca como <strong>Declarado (Trámite)</strong> para el campo "{hardcodeDialog.field?.label}".
          </Typography>
          <TextField
            fullWidth
            autoFocus
            label="Valor Simulado"
            value={hardcodeDialog.value}
            onChange={(e) => setHardcodeDialog({ ...hardcodeDialog, value: e.target.value })}
            variant="outlined"
            size="large"
            placeholder={hardcodeDialog.field?.type === 'number' ? "Ej: 10" : "Ej: SI"}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setHardcodeDialog({ ...hardcodeDialog, open: false })}
            sx={{ fontWeight: 700, color: '#64748b', textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
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
            sx={{
              fontWeight: 800,
              textTransform: 'none',
              borderRadius: 3,
              px: 3,
              bgcolor: '#f59e0b',
              "&:hover": { bgcolor: '#d97706' }
            }}
          >
            Confirmar Valor
          </Button>
        </DialogActions>
      </Dialog>

      <AddRequirementDialog
        open={addRequirementDialog.open}
        onClose={() => setAddRequirementDialog({ open: false, selectedServices: [] })}
        onConfirm={handleConfirmAddRequirement}
        availableServices={otherServices}
        initialSelected={addRequirementDialog.selectedServices}
        category={selectedCategoryId?.startsWith("agg-") ? selectedCategoryId.replace("agg-", "").toUpperCase() : "SERVICIO"}
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

const AddRequirementDialog = ({ open, onClose, onConfirm, availableServices, initialSelected, category }) => {
  const [label, setLabel] = useState("");
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      setLabel("");
      setSelected(initialSelected || []);
      setSearch("");
    }
  }, [open, initialSelected]);

  const filtered = availableServices.filter(s => normalize(s.name).includes(normalize(search)));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontWeight: 900, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
        NUEVO REQUISITO {category !== "SERVICIO" ? `EN ${category}` : ""}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Nombre del Requisito</Typography>
          <TextField
            fullWidth
            autoFocus
            size="small"
            placeholder="Ej: PLANILLAS DE CONTROL"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            sx={{ mb: 3, mt: 1 }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Asignar a Servicios</Typography>
            <Button size="small" onClick={() => setSelected(selected.length === availableServices.length ? [] : availableServices.map(s => s.id))}>
              {selected.length === availableServices.length ? "Deseleccionar Todo" : "Seleccionar Todo"}
            </Button>
          </Box>
          
          <TextField
            fullWidth
            size="small"
            placeholder="Filtrar servicios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 1 }}
          />

          <Paper variant="outlined" sx={{ maxHeight: 300, overflowY: "auto", borderRadius: 3, p: 1 }}>
            <List size="small">
              {filtered.map(srv => (
                <ListItemButton 
                  key={srv.id} 
                  dense 
                  onClick={() => setSelected(prev => prev.includes(srv.id) ? prev.filter(id => id !== srv.id) : [...prev, srv.id])}
                  selected={selected.includes(srv.id)}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemText primary={srv.name} primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: selected.includes(srv.id) ? 800 : 500 }} />
                  {selected.includes(srv.id) && <AddIcon sx={{ color: "#32A430", fontSize: 18 }} />}
                </ListItemButton>
              ))}
            </List>
          </Paper>
          <Typography variant="caption" sx={{ mt: 1, display: "block", color: "#94a3b8" }}>
            {selected.length} servicios seleccionados
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <Button onClick={onClose} sx={{ fontWeight: 700, textTransform: "none", color: "#64748b" }}>Cancelar</Button>
        <Button 
          variant="contained" 
          disabled={!label.trim() || selected.length === 0}
          onClick={() => onConfirm(label, selected)}
          sx={{ fontWeight: 800, textTransform: "none", borderRadius: 3, px: 4, bgcolor: "#0B85C4" }}
        >
          Añadir Requisito
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClinicasDashboard;
