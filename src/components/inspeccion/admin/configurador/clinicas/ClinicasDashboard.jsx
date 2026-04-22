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
} from "@mui/material";
import {
  Business as BusinessIcon,
  Apartment as ApartmentIcon,
  FaceRetouchingNatural as FaceRetouchingNaturalIcon,
  MedicalServices as MedicalServicesIcon,
  DeleteOutline as DeleteOutlineIcon,
  Add as AddIcon,
  DragIndicator as DragIndicatorIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  ListAlt as ListAltIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { ConfigContext, slugify, fieldTypes } from "./ConfiguradorClinicas";

const TRAMITE_MAPPING = {
  "ARQUITECTURA": [
    "Nombre del Establecimiento",
    "N° de Expediente",
    "Descripción",
    "Plano de arquitectura",
    "Memoria descriptiva"
  ],
  "ESTABLECIMIENTO": [
    "Denominación",
    "Tipo dependencia",
    "Propiedad",
    "CUIT",
    "Localidad",
    "Dirección",
    "Contacto (Email)",
    "Contacto (Teléfono)"
  ],
  "SALAS": [
    "QUIRÓFANOS",
    "QUIRÓFANOS PARA HEMODINAMIA",
    "SALA DE ENDOSCOPÍA",
    "SALA DE PARTOS",
    "SALA DE PROCEDIMIENTOS"
  ],
  "CAMAS": [
    "HEMODIÁLISIS",
    "INTERNACIÓN GENERAL",
    "INTERNACIÓN PROLONGADA",
    "MATERNIDAD",
    "NEONATOLOGÍA",
    "PEDIATRÍA",
    "SHOCK ROOM",
    "TERAPIA INTENSIVA ADULTOS",
    "TERAPIA INTENSIVA PEDIÁTRICA",
    "UNIDAD CORONARIA",
    "UNIDAD CUIDADOS INTERMEDIOS",
    "USO TRANSITORIO (Guardia, Onco, CA Quirurg)"
  ],
  "DOCUMENTOS ADJUNTOS": [
    "Vto. Plan de Evacuación",
    "Vto. Bomberos",
    "Vto. Extinguidores",
    "Habilitación Laboratorio",
    "Habilitación Municipal"
  ],
  "RECURSOS HUMANOS": [
    "TIPO PLANTEL",
    "ÁREA DE DESEMPEÑO",
    "ROL DE DESEMPEÑO",
    "CANTIDAD"
  ],
  "JEFES DE SERVICIO": [
    "SERVICIO",
    "TIPO DE PLANTEL",
    "CUIL",
    "APELLIDO",
    "NOMBRES",
    "MATRÍCULA",
    "TÍTULO",
    "ESPECIALIDAD",
    "ESTADO"
  ]
};

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

  const parseOptions = (options = "") =>
    String(options)
      .split(",")
      .map((option) => option.trim())
      .filter(Boolean);

  const handleAddOption = (srvIdx, fIdx, secIdx, fieldId) => {
    const nextOption = (optionDrafts[fieldId] || "").trim();
    if (!nextOption) return;

    const newServicios = [...servicios];
    const sourceField = secIdx !== -1 
      ? newServicios[srvIdx].sections[secIdx].fields[fIdx]
      : newServicios[srvIdx].fields[fIdx];

    const currentOptions = parseOptions(sourceField.options);
    if (currentOptions.some(opt => opt.toLowerCase() === nextOption.toLowerCase())) {
      setOptionDrafts(prev => ({ ...prev, [fieldId]: "" }));
      return;
    }

    const updatedOptions = [...currentOptions, nextOption].join(", ");
    if (secIdx !== -1) {
      newServicios[srvIdx].sections[secIdx].fields[fIdx].options = updatedOptions;
    } else {
      newServicios[srvIdx].fields[fIdx].options = updatedOptions;
    }
    setServicios(newServicios);
    setOptionDrafts(prev => ({ ...prev, [fieldId]: "" }));
  };

  const handleRemoveOption = (srvIdx, fIdx, secIdx, optionToRemove) => {
    const newServicios = [...servicios];
    const sourceField = secIdx !== -1 
      ? newServicios[srvIdx].sections[secIdx].fields[fIdx]
      : newServicios[srvIdx].fields[fIdx];

    const remainingOptions = parseOptions(sourceField.options).filter(opt => opt !== optionToRemove);
    const updatedOptions = remainingOptions.join(", ");
    
    if (secIdx !== -1) {
      newServicios[srvIdx].sections[secIdx].fields[fIdx].options = updatedOptions;
    } else {
      newServicios[srvIdx].fields[fIdx].options = updatedOptions;
    }
    setServicios(newServicios);
  };

  const handleLoadMinimums = (isAuto = false) => {
    const currentSrv = servicios.find(s => s.id === selectedCategoryId) || 
                       servicios.flatMap(s => s.sections || []).find(s => s.id === selectedCategoryId);
    if (!currentSrv) return;

    let sourceList = [];
    let fieldType = "";
    let labelField = "";

    if (activeTab === 1) { // Equipamiento
      sourceList = equipamientos;
      fieldType = "equipamiento";
      labelField = "equipamiento";
    } else if (activeTab === 2) { // RRHH
      sourceList = rrhhList;
      fieldType = "rrhh";
      labelField = (item) => `${item.origen} - ${item.especialidad}`;
    } else if (activeTab === 3) { // Jefe de Servicio
      sourceList = jefeServicioList;
      fieldType = "jefe_servicio";
      labelField = (item) => `${item.origen} - ${item.especialidad}`;
    }

    if (sourceList.length === 0) return;

    const srvName = currentSrv.name.toUpperCase();
    const filtered = sourceList.filter(item => {
      const itemOrigen = item.origen?.toUpperCase();
      return itemOrigen === srvName || srvName.includes(itemOrigen) || itemOrigen.includes(srvName);
    });

    if (filtered.length === 0) {
      if (!isAuto) {
        setSnackbar({ open: true, message: `No se encontraron mínimos configurados para ${currentSrv.name}`, severity: "warning" });
      }
      return;
    }

    const newServicios = [...servicios];
    
    const genSrvIdx = newServicios.findIndex(s => s.sections?.some(sec => sec.id === selectedCategoryId));
    const isGeneral = genSrvIdx !== -1;
    const targetSrvIdx = isGeneral ? genSrvIdx : newServicios.findIndex(s => s.id === selectedCategoryId);
    
    const targetSrv = newServicios[targetSrvIdx];
    if (!targetSrv) return;
    
    const genSecIdx = isGeneral ? targetSrv.sections.findIndex(sec => sec.id === selectedCategoryId) : -1;

    let addedCount = 0;
    filtered.forEach(item => {
      const label = typeof labelField === "function" ? labelField(item) : item[labelField];
      
      let existingFields = isGeneral ? (targetSrv.sections[genSecIdx]?.fields || []) : (targetSrv.fields || []);
      if (existingFields.some(f => f.label === label)) return;

      addedCount++;
      const newField = {
        id: `fld-${Date.now()}-${Math.random()}`,
        label: label,
        type: fieldType,
        origin: "ADMIN",
        options: ""
      };

      if (isGeneral) {
        if (!targetSrv.sections[genSecIdx].fields) targetSrv.sections[genSecIdx].fields = [];
        targetSrv.sections[genSecIdx].fields.push(newField);
      } else {
        if (!targetSrv.fields) targetSrv.fields = [];
        targetSrv.fields.push(newField);
      }
    });

    if (addedCount > 0) {
      setServicios(newServicios);
      if (!isAuto) {
        setSnackbar({ open: true, message: `Se cargaron ${addedCount} requisitos mínimos para ${currentSrv.name}`, severity: "success" });
      }
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
    });
    setServicios(newServicios);
  };

  const onSave = async () => {
    try {
      await handleSaveConfig();
      setSnackbar({ open: true, message: "¡Configuración guardada correctamente!", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Error al guardar la configuración", severity: "error" });
    }
  };

  const tramiteServices = servicios.filter((s) => s.isTramite);
  const generalDataSrv = servicios.find((s) => s.id === "srv-gen");
  const otherServices = servicios.filter((s) => s.id !== "srv-gen" && !s.isTramite);

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
          <TextField
            select
            size="small"
            label="Seleccionar Trámite para Inspeccionar"
            value={selectedTramiteId}
            onChange={(e) => setSelectedTramiteId(e.target.value)}
            sx={{ minWidth: 400, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
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
          <List
            subheader={
              <ListSubheader sx={{ fontWeight: 900, color: "#1e293b", py: 1, backgroundColor: "#f8fafc" }}>
                CATEGORÍAS DE INSPECCIÓN
              </ListSubheader>
            }
            sx={{ flexGrow: 1, overflowY: "auto", py: 0 }}
          >
            <ListSubheader sx={{ fontWeight: 800, color: "#0B85C4", fontSize: "0.7rem", lineHeight: "32px", mt: 2 }}>
              DATOS GENERALES
            </ListSubheader>
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

            <ListSubheader sx={{ fontWeight: 800, color: "#32A430", fontSize: "0.7rem", lineHeight: "32px", mt: 2 }}>
              DATOS DEL TRÁMITE
            </ListSubheader>
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

            <ListSubheader sx={{ fontWeight: 800, color: "#64748b", fontSize: "0.7rem", lineHeight: "32px", mt: 2 }}>
              SERVICIOS TÉCNICOS
            </ListSubheader>
            {otherServices.map((srv) => (
              <ListItemButton
                key={srv.id}
                selected={selectedCategoryId === srv.id}
                onClick={() => setSelectedCategoryId(srv.id)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  mb: 0.5,
                  "&.Mui-selected": { backgroundColor: "rgba(100, 116, 139, 0.08)", color: "#1e293b" },
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
          </List>
          
          <Box sx={{ p: 2, borderTop: "1px solid #e2e8f0", bgcolor: "#f8fafc" }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddService}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
            >
              Nuevo Servicio
            </Button>
          </Box>
        </Paper>

        {/* MAIN CONTENT AREA */}
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
             <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: "#1e293b" }}>
                  {(() => {
                    const sec = generalDataSrv?.sections?.find(s => s.id === selectedCategoryId);
                    if (sec) return sec.name;
                    const srv = servicios.find(s => s.id === selectedCategoryId);
                    return srv?.name || "Seleccione una categoría";
                  })()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {inspectionMode === "ADMIN" ? "Configuración de parámetros maestros" : "Auditando datos declarados"}
                </Typography>
             </Box>

             <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
               <Tabs 
                 value={activeTab} 
                 onChange={(e, val) => setActiveTab(val)}
                 sx={{ 
                   "& .MuiTab-root": { fontWeight: 800, fontSize: "0.75rem", minHeight: 48 },
                   "& .Mui-selected": { color: "#0B85C4 !important" },
                   "& .MuiTabs-indicator": { backgroundColor: "#0B85C4" }
                 }}
               >
                 <Tab label="PARÁMETROS" />
                 <Tab label="EQUIPAMIENTO" />
                 <Tab label="RRHH" />
                 <Tab label="JEFE DE SERVICIO" />
               </Tabs>
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
                <TableHead sx={{ bgcolor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <TableRow>
                    <TableCell sx={{ width: 40 }}></TableCell>
                    <TableCell sx={{ width: "150px", color: "#64748b", fontWeight: 800, fontSize: "0.7rem" }}>ORIGEN</TableCell>
                    <TableCell sx={{ color: "#64748b", fontWeight: 800, fontSize: "0.7rem" }}>ETIQUETA / REF. TRÁMITE</TableCell>
                    <TableCell sx={{ width: "220px", color: "#64748b", fontWeight: 800, fontSize: "0.7rem" }}>TIPO</TableCell>
                    <TableCell align="right" sx={{ width: 60 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(() => {
                    let fields = [];
                    let targetSrvIdx = -1;
                    let targetSecIdx = -1;

                    const genSecIdx = generalDataSrv?.sections?.findIndex(s => s.id === selectedCategoryId) ?? -1;
                    if (genSecIdx !== -1) {
                      fields = generalDataSrv.sections[genSecIdx].fields || [];
                      targetSrvIdx = servicios.indexOf(generalDataSrv);
                      targetSecIdx = genSecIdx;
                    } else {
                        const srvIdx = servicios.findIndex(s => s.id === selectedCategoryId);
                        if (srvIdx !== -1) {
                          fields = servicios[srvIdx].fields || [];
                          targetSrvIdx = srvIdx;
                        }
                      }

                      // Tab-based filtering
                      const filteredFields = fields.filter(f => {
                        if (activeTab === 0) return !["equipamiento", "rrhh", "jefe_servicio"].includes(f.type);
                        if (activeTab === 1) return f.type === "equipamiento";
                        if (activeTab === 2) return f.type === "rrhh";
                        if (activeTab === 3) return f.type === "jefe_servicio";
                        return true;
                      });

                      if (filteredFields.length === 0) {
                        return (
                          <TableRow>
                            <TableCell colSpan={activeTab === 0 ? 5 : 4} sx={{ py: 10, textAlign: "center", color: "#94a3b8" }}>
                               No hay campos configurados en esta pestaña.
                            </TableCell>
                          </TableRow>
                        );
                      }

                      return filteredFields.map((field, fIdx) => {
                        // We need the original index for state updates if we filter
                        const originalIdx = fields.indexOf(field);
                        return (
                        <TableRow key={field.id} sx={{ "&:hover": { bgcolor: "#fcfcfc" } }}>
                          <TableCell align="center">
                            <DragIndicatorIcon sx={{ color: "#cbd5e1", opacity: 0.3 }} fontSize="small" />
                          </TableCell>
                          <TableCell>
                            <ToggleButtonGroup
                              value={field.origin || "ADMIN"}
                              exclusive
                              onChange={(e, val) => {
                                if (!val) return;
                                const newServicios = [...servicios];
                                if (targetSecIdx !== -1) {
                                  newServicios[targetSrvIdx].sections[targetSecIdx].fields[originalIdx].origin = val;
                                } else {
                                  newServicios[targetSrvIdx].fields[originalIdx].origin = val;
                                }
                                setServicios(newServicios);
                              }}
                              size="small"
                              sx={{ "& .MuiToggleButton-root": { py: 0.2, px: 1, fontSize: "0.6rem", fontWeight: 800 } }}
                            >
                              <ToggleButton value="ADMIN">ADMIN</ToggleButton>
                              <ToggleButton value="TRÁMITE">TRÁMITE</ToggleButton>
                            </ToggleButtonGroup>
                          </TableCell>
                          <TableCell>
                            {field.origin === "TRÁMITE" ? (
                              <Select
                                fullWidth size="small" variant="standard"
                                value={field.tramiteField || ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const newServicios = [...servicios];
                                  if (targetSecIdx !== -1) {
                                    newServicios[targetSrvIdx].sections[targetSecIdx].fields[originalIdx].tramiteField = val;
                                    newServicios[targetSrvIdx].sections[targetSecIdx].fields[originalIdx].label = val.split(" > ")[1] || val;
                                  } else {
                                    newServicios[targetSrvIdx].fields[originalIdx].tramiteField = val;
                                    newServicios[targetSrvIdx].fields[originalIdx].label = val.split(" > ")[1] || val;
                                  }
                                  setServicios(newServicios);
                                }}
                                sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#0B85C4" }}
                                displayEmpty
                              >
                                <MenuItem value="" disabled>Seleccionar campo...</MenuItem>
                                {Object.keys(TRAMITE_MAPPING).map(cat => [
                                  <MenuItem key={cat} disabled sx={{ fontWeight: 900, fontSize: "0.7rem", bgcolor: "#f1f5f9" }}>{cat}</MenuItem>,
                                  ...TRAMITE_MAPPING[cat].map(f => <MenuItem key={f} value={`${cat} > ${f}`} sx={{ pl: 4 }}>{f}</MenuItem>)
                                ])}
                              </Select>
                            ) : (
                              <>
                                {field.type === "equipamiento" || field.type === "rrhh" || field.type === "jefe_servicio" ? (
                                  <Select
                                    fullWidth size="small" variant="standard"
                                    value={field.label || ""}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      const newServicios = [...servicios];
                                      if (targetSecIdx !== -1) {
                                        newServicios[targetSrvIdx].sections[targetSecIdx].fields[originalIdx].label = val;
                                      } else {
                                        newServicios[targetSrvIdx].fields[originalIdx].label = val;
                                      }
                                      setServicios(newServicios);
                                    }}
                                    sx={{ fontSize: "0.85rem", fontWeight: 700, color: field.type === 'equipamiento' ? '#32A430' : field.type === 'rrhh' ? '#f59e0b' : '#ef4444' }}
                                    displayEmpty
                                  >
                                    <MenuItem value="" disabled>Seleccionar requisito...</MenuItem>
                                    {field.type === "equipamiento" && equipamientos.map((e) => (
                                      <MenuItem key={e.id} value={e.equipamiento}>{e.equipamiento}</MenuItem>
                                    ))}
                                    {field.type === "rrhh" && rrhhList.map((r) => (
                                      <MenuItem key={r.id} value={`${r.origen} - ${r.especialidad}`}>{r.origen} - {r.especialidad}</MenuItem>
                                    ))}
                                    {field.type === "jefe_servicio" && jefeServicioList.map((j) => (
                                      <MenuItem key={j.id} value={`${j.origen} - ${j.especialidad}`}>{j.origen} - {j.especialidad}</MenuItem>
                                    ))}
                                  </Select>
                                ) : (
                                  <TextField
                                    fullWidth size="small" variant="standard"
                                    value={field.label}
                                    onChange={(e) => {
                                      const newServicios = [...servicios];
                                      if (targetSecIdx !== -1) {
                                        newServicios[targetSrvIdx].sections[targetSecIdx].fields[originalIdx].label = e.target.value;
                                      } else {
                                        newServicios[targetSrvIdx].fields[originalIdx].label = e.target.value;
                                      }
                                      setServicios(newServicios);
                                    }}
                                    InputProps={{ disableUnderline: true, sx: { fontSize: "0.85rem", fontWeight: 500 } }}
                                  />
                                )}
                              </>
                            )}

                            {/* OPTIONS EDITOR */}
                            {(field.type === "select" || field.type === "toggle") && field.origin !== "TRÁMITE" && (
                              <Box sx={{ mt: 1.5, p: 1, bgcolor: "#f8fafc", borderRadius: 2 }}>
                                 <TextField
                                   fullWidth size="small" variant="standard"
                                   placeholder="Añadir opción..."
                                   value={optionDrafts[field.id] || ""}
                                   onChange={(e) => setOptionDrafts(prev => ({ ...prev, [field.id]: e.target.value }))}
                                   onKeyDown={(e) => {
                                     if (e.key === "Enter" || e.key === ",") {
                                       e.preventDefault();
                                       handleAddOption(targetSrvIdx, originalIdx, targetSecIdx, field.id);
                                     }
                                   }}
                                   InputProps={{ sx: { fontSize: "0.75rem" } }}
                                 />
                                 <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                                   {parseOptions(field.options).map((opt, oIdx) => (
                                     <Chip
                                       key={oIdx}
                                       label={opt}
                                       size="small"
                                       onDelete={() => handleRemoveOption(targetSrvIdx, originalIdx, targetSecIdx, opt)}
                                       sx={{ bgcolor: "#fff", border: "1px solid #e2e8f0", fontSize: "0.7rem", fontWeight: 700 }}
                                     />
                                   ))}
                                 </Box>
                              </Box>
                            )}
                          </TableCell>
                          <TableCell>
                            {/* In specialized tabs, we might want to hide the type selector or disable it */}
                            <TextField
                              select fullWidth size="small" variant="standard"
                              value={field.type}
                              disabled={activeTab !== 0}
                              onChange={(e) => {
                                const newServicios = [...servicios];
                                if (targetSecIdx !== -1) {
                                  newServicios[targetSrvIdx].sections[targetSecIdx].fields[originalIdx].type = e.target.value;
                                } else {
                                  newServicios[targetSrvIdx].fields[originalIdx].type = e.target.value;
                                }
                                setServicios(newServicios);
                              }}
                              InputProps={{ disableUnderline: true, sx: { fontSize: "0.85rem", fontWeight: 600 } }}
                            >
                              {fieldTypes.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                            </TextField>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={() => {
                              const newServicios = [...servicios];
                              if (targetSecIdx !== -1) {
                                newServicios[targetSrvIdx].sections[targetSecIdx].fields.splice(originalIdx, 1);
                              } else {
                                newServicios[targetSrvIdx].fields.splice(originalIdx, 1);
                              }
                              setServicios(newServicios);
                            }}>
                              <DeleteOutlineIcon fontSize="small" sx={{ color: "#ef4444" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        );
                      });
                    })()}
                  </TableBody>
             </Table>
             <Box sx={{ p: 2, bgcolor: "#fcfcfc", borderTop: "1px solid #e2e8f0", textAlign: "center", display: "flex", justifyContent: "center", gap: 2 }}>
                 <Button 
                   variant="contained"
                   startIcon={<AddIcon />}
                   onClick={() => {
                     const newServicios = [...servicios];
                     const typeMap = ["text", "equipamiento", "rrhh", "jefe_servicio"];
                     const newField = { 
                       id: `fld-${Date.now()}`, 
                       label: "", 
                       type: typeMap[activeTab], 
                       options: "" 
                     };
                     const genSecIdx = generalDataSrv?.sections?.findIndex(s => s.id === selectedCategoryId) ?? -1;
                     if (genSecIdx !== -1) {
                       newServicios[servicios.indexOf(generalDataSrv)].sections[genSecIdx].fields.push(newField);
                     } else {
                       const srvIdx = servicios.findIndex(s => s.id === selectedCategoryId);
                       if (srvIdx !== -1) newServicios[srvIdx].fields.push(newField);
                     }
                     setServicios(newServicios);
                   }}
                   sx={{ textTransform: "none", fontWeight: 800, borderRadius: 2, bgcolor: "#0B85C4", "&:hover": { bgcolor: "#096da1" } }}
                 >
                   {(() => {
                     if (activeTab === 0) return "Añadir parámetro";
                     if (activeTab === 1) return "Añadir equipamiento";
                     if (activeTab === 2) return "Añadir RRHH";
                     if (activeTab === 3) return "Añadir Jefe de Servicio";
                   })()}
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
