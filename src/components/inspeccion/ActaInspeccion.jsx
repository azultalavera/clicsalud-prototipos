import React, { useEffect, useState, useMemo } from "react";
import {
  Alert, Box, Checkbox, Chip, CircularProgress, FormControlLabel,
  Grid, MenuItem, Paper, Stack, Switch, TextField, Typography,
  List, ListItemButton, ListItemIcon, ListItemText, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, ToggleButton, ToggleButtonGroup
} from "@mui/material";
import {
  AssignmentInd as AssignmentIndIcon,
  Business as BusinessIcon,
  Visibility as VisibilityIcon,
  ChatBubbleOutline as ChatIcon,
  ReportProblem as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Architecture as ArchIcon,
  MedicalServices as MedIcon,
  Groups as RRHHIcon,
  Person as BossIcon,
  PrecisionManufacturing as EquipIcon,
  Folder as FolderIcon,
  ListAlt as ListAltIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

const DEFAULT_TIPOLOGIA = "CLÍNICAS, SANATORIOS Y HOSPITALES";

const normalizeText = (value = "") =>
  value.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/\s+/g, " ").trim();

const parseOptions = (options) => {
  if (Array.isArray(options)) return options.filter(Boolean);
  return String(options || "").split(",").map((i) => i.trim()).filter(Boolean);
};

const getFieldKey = (field, sectionId, serviceId) =>
  field?.key || field?.id || `${serviceId}-${sectionId || "field"}-${field?.label || "campo"}`;

const ActaInspeccion = ({ tipologia = DEFAULT_TIPOLOGIA, selectedServices = {}, infraSelection = {}, equiposCargados = [] }) => {
  const [data, setData] = useState({ tipoInspeccion: "HABILITACION" });
  const [obsData, setObsData] = useState({});
  const [serviciosConfig, setServiciosConfig] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [configError, setConfigError] = useState("");
  const [activeTab, setActiveTab] = useState("antecedentes"); // Controls left sidebar selection

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoadingConfig(true);
        setConfigError("");
        const response = await fetch(`http://localhost:3001/configuraciones_maestras?tipologia=${encodeURIComponent(tipologia)}`);
        const result = await response.json();
        setServiciosConfig(Array.isArray(result) && result.length > 0 ? result[0].servicios || [] : []);
      } catch (error) {
        console.error(error);
        setConfigError("No se pudo cargar la configuración maestra.");
      } finally {
        setLoadingConfig(false);
      }
    };
    loadConfig();
  }, [tipologia]);

  const generalSections = useMemo(() => serviciosConfig.find((s) => s.id === "srv-gen")?.sections || [], [serviciosConfig]);
  const configuredServices = useMemo(() => {
    const services = serviciosConfig.filter((s) => s.id !== "srv-gen");
    const selectedNames = Object.keys(selectedServices || {});
    if (!selectedNames.length) return services;
    const normalized = selectedNames.map(normalizeText);
    const filtered = services.filter((s) => {
      const sName = normalizeText(s.name).replace(/\([^)]*\)/g, "").trim();
      return normalized.some((sel) => sel.includes(sName) || sName.includes(sel));
    });
    return filtered.length > 0 ? filtered : services;
  }, [selectedServices, serviciosConfig]);

  const handleFieldChange = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

  const handleToggleObs = (key) => {
    setObsData((prev) => ({
      ...prev, [key]: { ...prev[key], checked: !prev[key]?.checked, valorObs: "", estado: "neutral" },
    }));
  };

  const handleValChangeObs = (key, val, decl) => {
    const num = parseInt(val);
    let st = "neutral";
    if (val === "" || isNaN(num)) st = "neutral";
    else if (num < decl) st = "rectificacion";
    else if (num > decl) st = "irregularidad";
    else st = "igual";
    setObsData((prev) => ({ ...prev, [key]: { ...prev[key], valorObs: val, estado: st } }));
  };

  const renderStatus = (estado) => {
    if (estado === "rectificacion") return <WarningIcon sx={{ color: "#fbc02d" }} />;
    if (estado === "irregularidad") return <ErrorIcon sx={{ color: "#d32f2f" }} />;
    if (estado === "igual") return <CheckCircleIcon sx={{ color: "#2e7d32" }} />;
    return <InfoIcon sx={{ color: "#9e9e9e" }} />;
  };

  const renderConfiguredField = (field, serviceId, sectionId = "main") => {
    if (!field || field.visible === false) return null;
    const fieldKey = getFieldKey(field, sectionId, serviceId);
    const value = data[fieldKey] ?? (field.type === "boolean" || field.type === "checkbox" ? false : "");

    if (field.type === "boolean") {
      return (
        <Box key={fieldKey} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1.5, px: 2, borderBottom: "1px solid #f0f0f0", bgcolor: value ? "#f1f8e9" : "transparent" }}>
          <Typography variant="body1" sx={{ color: "#444" }}>{field.label}</Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: value ? "#2e7d32" : "#999" }}>{value ? "SÍ" : "NO"}</Typography>
            <Switch size="medium" checked={!!value} onChange={(event) => handleFieldChange(fieldKey, event.target.checked)} color="success" />
          </Stack>
        </Box>
      );
    }
    if (field.type === "checkbox") {
      return (
        <Box key={fieldKey} sx={{ py: 1.5, px: 2, borderBottom: "1px solid #f0f0f0" }}>
          <FormControlLabel control={<Checkbox checked={!!value} onChange={(e) => handleFieldChange(fieldKey, e.target.checked)} />} label={<Typography variant="body1">{field.label}</Typography>} />
        </Box>
      );
    }
    if (field.type === "select") {
      return (
        <Box key={fieldKey} sx={{ mb: 2 }}>
          <TextField select fullWidth label={field.label} variant="standard" value={value} onChange={(e) => handleFieldChange(fieldKey, e.target.value)}>
            <MenuItem value=""><em>Seleccionar...</em></MenuItem>
            {parseOptions(field.options).map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>
        </Box>
      );
    }
    return (
      <Box key={fieldKey} sx={{ mb: 2 }}>
        <TextField fullWidth label={field.label} variant="standard" type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "time" ? "time" : "text"} multiline={field.type === "textarea"} minRows={3} value={value} onChange={(e) => handleFieldChange(fieldKey, e.target.value)} InputLabelProps={field.type === "date" || field.type === "time" ? { shrink: true } : undefined} />
      </Box>
    );
  };

  const renderObservacionTable = (headers, items, typeKey) => (
    <TableContainer component={Paper} elevation={1} sx={{ mb: 4, borderRadius: 2 }}>
      <Table>
        <TableHead sx={{ bgcolor: "#fafafa" }}>
          <TableRow>
            {headers.labels.map((l, i) => (
              <TableCell key={i} align={headers.aligns?.[i] || "left"} sx={{ fontWeight: "bold" }}>{l}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, i) => {
            const itemKey = `${typeKey}-${i}`;
            const itemObs = obsData[itemKey] || {};
            const isChecked = !!itemObs.checked;
            return (
              <TableRow key={i} hover selected={isChecked && itemObs.estado === 'igual'} sx={{ '&.Mui-selected, &.Mui-selected:hover': { bgcolor: '#f1f8e9' } }}>
                {item.cols.map((col, cIdx) => (
                  <TableCell key={cIdx} align={headers.aligns?.[cIdx] || "left"} sx={{ fontWeight: cIdx === 0 ? "bold" : "normal" }}>{col}</TableCell>
                ))}
                <TableCell align="center">
                  <Checkbox color="primary" checked={isChecked} onChange={() => handleToggleObs(itemKey)} />
                </TableCell>
                <TableCell align="center" sx={{ width: 120 }}>
                  {isChecked && item.decl !== undefined && (
                    <TextField size="small" variant="outlined" type="number" placeholder="Cant." onChange={(e) => handleValChangeObs(itemKey, e.target.value, item.decl)} inputProps={{ style: { textAlign: 'center' } }} />
                  )}
                </TableCell>
                <TableCell align="center" sx={{ width: 120 }}>
                  <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                    {isChecked && itemObs.estado && itemObs.estado !== "neutral" && renderStatus(itemObs.estado)}
                    {isChecked && itemObs.estado !== "igual" && <IconButton size="small" color="primary"><ChatIcon fontSize="small" /></IconButton>}
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const TRAMITE_VIEWS = {
    antecedentes: (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#005596" }}>Resumen y Antecedentes Técnicos</Typography>
        <Alert severity="info" sx={{ mb: 4 }}>Información cargada inicialmente en el empadronamiento de la institución.</Alert>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ color: "#005596", display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <AssignmentIndIcon /> Director Técnico Vigente
            </Typography>
            <Stack spacing={3}>
              <TextField fullWidth label="Apellido y Nombre" variant="standard" value="Dr. Barrardi Horacio" InputProps={{ readOnly: true }} />
              <Stack direction="row" spacing={2}>
                <TextField fullWidth label="DNI" variant="standard" value="10.566.234" InputProps={{ readOnly: true }} />
                <TextField fullWidth label="Matrícula" variant="standard" value="11551" InputProps={{ readOnly: true }} />
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ color: "#005596", display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <BusinessIcon /> Datos del Trámite
            </Typography>
            <Stack spacing={3}>
              <TextField fullWidth label="Fecha de Habilitación / Inicio" variant="standard" value="15/09/2023" InputProps={{ readOnly: true }} />
              <TextField fullWidth label="Resolución Ministerial N°" variant="standard" value="1719 / MS / 2023" InputProps={{ readOnly: true }} />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    ),
    rrhh: (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#005596" }}>Planteles, Profesionales y Autoridades</Typography>
        
        <Typography variant="h6" sx={{ mb: 1 }}>Jefaturas y Directores de Área</Typography>
        {renderObservacionTable(
          { labels: ["Rol Registrado", "Profesional / Especialidad", "Observar", "-", "Acción"], aligns: ["left", "left", "center", "center", "center"] },
          [{ cols: ["Director Médico", "Dr. Barrardi - Mat: 11551"] }, { cols: ["Jefe de UTI", "Dr. Gomez - Mat: 4123"] }], "boss"
        )}

        <Typography variant="h6" sx={{ mb: 1, mt: 4 }}>Plantel de Recursos Humanos (Guardias / Técnicos)</Typography>
        {renderObservacionTable(
          { labels: ["Servicio", "Tipo de Plantel", "Cant. Declarada", "Observar", "Observado", "Estado"], aligns: ["left", "left", "center", "center", "center", "center"] },
          [{ cols: ["UTI", "Médico de Guardia Interna", "5"], decl: 5 }, { cols: ["Enfermería", "Enfermero/a Universit.", "12"], decl: 12 }], "rrhh"
        )}
      </Box>
    ),
    arquitectura: (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#005596" }}>Arquitectura Física y Documentación</Typography>

        <Typography variant="h6" sx={{ mb: 1 }}>Planos y Cédulas Edilicias</Typography>
        {renderObservacionTable(
          { labels: ["Plano / Sector", "Requisito Mínimo", "Observar", "-", "Acción"], aligns: ["left", "center", "center", "center", "center"] },
          [{ cols: ["Plano Evacuación Bomberos", "Aprobado (Visible)"] }, { cols: ["Plano Eléctrico Unifilar", "Aprobado Colegio"] }], "arq"
        )}

        <Typography variant="h6" sx={{ mb: 1, mt: 4 }}>Documentación Complementaria Legal</Typography>
        {renderObservacionTable(
          { labels: ["Documento Exigible", "Tipo", "Observar", "-", "Acción"], aligns: ["left", "center", "center", "center", "center"] },
          [{ cols: ["Seguro de Mala Praxis Institucional", "PDF Adjunto"] }, { cols: ["Habilitación Municipal", "Certificado"] }], "doc"
        )}
      </Box>
    ),
    servicios: (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#005596" }}>Servicios y Capacidad Instalada (Declarada)</Typography>
        {renderObservacionTable(
          { labels: ["Habilitado", "Capacidad Declarada", "Observar", "V. Observado", "Estado"], aligns: ["left", "center", "center", "center", "center"] },
          Object.entries(infraSelection || { "Camas UTI Adultos": 5, "Consultorios Externos": 12 }).map(([k, v]) => ({ cols: [k, String(v)], decl: v })), "srv"
        )}
      </Box>
    ),
    equipos: (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#005596" }}>Equipamiento Tecnológico y Analítico</Typography>
        {renderObservacionTable(
          { labels: ["Sector de Ubicación", "Equipo Técnico", "Cant. Declarada", "Observar", "V. Observado", "Estado"], aligns: ["left", "left", "center", "center", "center", "center"] },
          [{ cols: ["UTI", "Monitores Multiparamétricos de Alta", "8"], decl: 8 }, { cols: ["Quirófano A", "Mesa de Anestesia Completa", "2"], decl: 2 }, { cols: ["Laboratorio Central", "Centrífugas automáticas", "4"], decl: 4 }], "eqp"
        )}
      </Box>
    ),
    "datos-generales": (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#005596" }}>Parámetros Generales (Datos Técnicos)</Typography>
        <Alert severity="success" sx={{ mb: 4 }}>Complete los parámetros técnicos transversales al establecimiento.</Alert>
        
        {generalSections.map(sec => (
          <Box key={sec.id} sx={{ mb: 5 }}>
            <Typography variant="h6" sx={{ borderBottom: "2px solid #005596", pb: 1, mb: 3, color: "#333" }}>{sec.name}</Typography>
            {sec.fields && sec.fields.length > 0 ? (
              <Grid container spacing={3}>
                {sec.fields.map(f => (
                   <Grid item xs={12} md={f.type === 'textarea' ? 12 : 6} key={f.id}>
                     {renderConfiguredField(f, "srv-gen", sec.id)}
                   </Grid>
                ))}
              </Grid>
            ) : <Typography variant="body1" color="text.secondary">Sección vacía.</Typography>}
          </Box>
        ))}
      </Box>
    )
  };

  const getServiceView = (service) => (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#005596" }}>Inspección del Servicio: {service.name}</Typography>
      <Alert severity="info" sx={{ mb: 4 }}>Verificación de parámetros obligatorios según normativa para este servicio específico.</Alert>
      
      <Grid container spacing={4}>
        {(service.fields || []).filter(f => f.visible !== false).length > 0 ? (
          (service.fields || []).filter(f => f.visible !== false).map(f => (
            <Grid item xs={12} md={f.type === 'textarea' ? 12 : 6} key={f.id}>
              {renderConfiguredField(f, service.id)}
            </Grid>
          ))
        ) : (
          <Grid item xs={12}><Typography variant="body1" color="text.secondary">Servicio sin parámetros detallados en configuración maestra.</Typography></Grid>
        )}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "1600px", mx: "auto" }}>
      {/* HEADER PRINCIPAL COMPACTO EN MATERIAL UI CLÁSICO */}
      <Paper elevation={1} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
           <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#005596", mb: 1 }}>
                Sanatorio Allende
              </Typography>
              <Stack direction="row" spacing={2}>
                <Chip label={`Expediente: 170-2026/01`} size="medium" color="primary" sx={{ fontWeight: "bold" }} />
                <Chip label={tipologia} size="medium" variant="outlined" />
              </Stack>
           </Box>
           <Box sx={{ mt: { xs: 2, sm: 0 }, minWidth: 300 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>Tipo de Clasificación (Acta)</Typography>
              <ToggleButtonGroup value={data.tipoInspeccion} exclusive onChange={(_, next) => next !== null && handleFieldChange("tipoInspeccion", next)} size="small" color="primary" fullWidth>
                <ToggleButton value="HABILITACION" sx={{ fontWeight: "bold" }}>Habilitación</ToggleButton>
                <ToggleButton value="RUTINA" sx={{ fontWeight: "bold" }}>Rutina</ToggleButton>
                <ToggleButton value="DENUNCIA" sx={{ fontWeight: "bold" }}>Denuncia</ToggleButton>
              </ToggleButtonGroup>
           </Box>
        </Stack>
      </Paper>

      <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" } }}>
        {/* PANEL LATERAL DE NAVEGACION */}
        <Box sx={{ width: { xs: "100%", md: 350 }, flexShrink: 0 }}>
          <Paper elevation={1} sx={{ borderRadius: 2, position: "sticky", top: 24, overflow: "hidden" }}>
             
             {/* Grupo 1: Observar Tramite */}
             <Box sx={{ bgcolor: "#f5f5f5", px: 2, py: 1.5, borderBottom: "1px solid #e0e0e0" }}>
               <Typography variant="overline" sx={{ fontWeight: "bold", color: "#333", display: "flex", alignItems: "center", gap: 1 }}>
                 <VisibilityIcon fontSize="small" /> Datos Declarados
               </Typography>
             </Box>
             <List sx={{ p: 0 }}>
                {[
                  { id: "antecedentes", label: "Resumen y Antecedentes", icon: <AssignmentIndIcon /> },
                  { id: "rrhh", label: "Planteles y RRHH", icon: <RRHHIcon /> },
                  { id: "arquitectura", label: "Arquitectura y Planos", icon: <ArchIcon /> },
                  { id: "servicios", label: "Servicios e Infraestructura", icon: <MedIcon /> },
                  { id: "equipos", label: "Equipamiento Clínico", icon: <EquipIcon /> },
                ].map(item => (
                  <ListItemButton key={item.id} selected={activeTab === item.id} onClick={() => setActiveTab(item.id)} sx={{ py: 1.5, '&.Mui-selected, &.Mui-selected:hover': { bgcolor: '#e3f2fd', color: '#1565c0', '& .MuiListItemIcon-root': { color: '#1565c0' } } }}>
                    <ListItemIcon sx={{ minWidth: 40, color: activeTab === item.id ? '#1565c0' : '#757575' }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} primaryTypographyProps={{ variant: "body1", fontWeight: activeTab === item.id ? "bold" : "inherit" }} />
                  </ListItemButton>
                ))}
             </List>

             {/* Grupo 2: Formularios Técnicos Dinámicos */}
             <Box sx={{ bgcolor: "#f5f5f5", px: 2, py: 1.5, borderTop: "1px solid #e0e0e0", borderBottom: "1px solid #e0e0e0" }}>
               <Typography variant="overline" sx={{ fontWeight: "bold", color: "#333", display: "flex", alignItems: "center", gap: 1 }}>
                 <ListAltIcon fontSize="small" /> Carga Técnica de Acta
               </Typography>
             </Box>
             <List sx={{ p: 0 }}>
                <ListItemButton selected={activeTab === "datos-generales"} onClick={() => setActiveTab("datos-generales")} sx={{ py: 1.5, '&.Mui-selected, &.Mui-selected:hover': { bgcolor: '#e3f2fd', color: '#1565c0', '& .MuiListItemIcon-root': { color: '#1565c0' } } }}>
                  <ListItemIcon sx={{ minWidth: 40, color: activeTab === "datos-generales" ? '#1565c0' : '#757575' }}><ListAltIcon /></ListItemIcon>
                  <ListItemText primary="Parámetros Generales" primaryTypographyProps={{ variant: "body1", fontWeight: activeTab === "datos-generales" ? "bold" : "inherit" }} />
                </ListItemButton>
                
                {loadingConfig && <Box p={3} textAlign="center"><CircularProgress size={30} /></Box>}
                {configError && <Typography color="error" variant="body2" sx={{p:3}}>{configError}</Typography>}
                
                {configuredServices.map(srv => (
                  <ListItemButton key={srv.id} selected={activeTab === srv.id} onClick={() => setActiveTab(srv.id)} sx={{ py: 1.5, '&.Mui-selected, &.Mui-selected:hover': { bgcolor: '#e3f2fd', color: '#1565c0', '& .MuiListItemIcon-root': { color: '#1565c0' } } }}>
                    <ListItemIcon sx={{ minWidth: 40, color: activeTab === srv.id ? '#1565c0' : '#757575' }}><InfoIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary={srv.name} primaryTypographyProps={{ variant: "body1", fontWeight: activeTab === srv.id ? "bold" : "inherit", noWrap: true }} />
                    {srv.fields?.length > 0 && <Chip label={srv.fields.length} size="small" sx={{ height: 20, fontSize: "0.75rem", fontWeight: "bold" }} />}
                  </ListItemButton>
                ))}
             </List>
          </Paper>
        </Box>

        {/* CONTENIDO PRINCIPAL (DERECHA) */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
           <Paper elevation={1} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2, minHeight: "650px", bgcolor: "#ffffff" }}>
              {TRAMITE_VIEWS[activeTab] || (configuredServices.find(s => s.id === activeTab) ? getServiceView(configuredServices.find(s => s.id === activeTab)) : <Typography>Seleccione un apartado a la izquierda</Typography>)}
           </Paper>
        </Box>
      </Box>

    </Box>
  );
};

export default ActaInspeccion;
