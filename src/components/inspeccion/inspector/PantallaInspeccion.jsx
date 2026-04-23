import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  TextField,
  MenuItem,
  Stack, Grid,
  Button,
  ToggleButton,
  ToggleButtonGroup, Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Autocomplete,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import DomainIcon from "@mui/icons-material/Domain";
import PeopleIcon from "@mui/icons-material/People";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import BedIcon from "@mui/icons-material/Bed";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import CloudUpload from "@mui/icons-material/CloudUpload";
import Close from "@mui/icons-material/Close";
import Delete from "@mui/icons-material/Delete";
import DriveFileRenameOutline from "@mui/icons-material/DriveFileRenameOutline";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionIcon from "@mui/icons-material/Description";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import CancelIcon from "@mui/icons-material/Cancel";
import ChatIcon from "@mui/icons-material/Chat";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Fab,
} from "@mui/material";
import { useNavigate, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import RevisionActa from "./RevisionActa";


const normalize = (str) =>
  str
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim() || "";

const getFlatFields = (sectionsObj) => {
  if (!sectionsObj) return [];
  if (Array.isArray(sectionsObj)) {
    return sectionsObj.reduce((acc, sec) => [...acc, ...(sec.fields || [])], []);
  }
  return [];
};

const PantallaInspeccion = ({
  serviciosEfector: propsServicios,
  infraEfector: propsInfra,
  rrhhEfector: propsRrhh,
  equiposEfector: propsEquipos,
}) => {
  const navigate = useNavigate();
  const [currentActa, setCurrentActa] = useState(1);
  const [loading, setLoading] = useState(true);
  const [efectorResponses, setEfectorResponses] = useState({});
  const [config, setConfig] = useState(null);
  const [inspectorData, setInspectorData] = useState({});
  const [viewerFile, setViewerFile] = useState(null);
  const [obsDatosGenerales, setObsDatosGenerales] = useState([]);
  const [obsDatosTramite, setObsDatosTramite] = useState([]);
  const [generalObs, setGeneralObs] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [signatureStep, setSignatureStep] = useState(0); // 0: cerrado, 1: responsable, 2: inspector
  const [signatures, setSignatures] = useState({
    representative: null,
    inspector: null,
  });

  const [obsDialog, setObsDialog] = useState({
    open: false,
    fieldId: null,
    label: "",
    value: "",
    category: "TRAMITE",
  });

  const signatureCanvasRef = useRef(null);
  const [isDrawingSignature, setIsDrawingSignature] = useState(false);

  const startDrawingSignature = (e) => {
    const canvas = signatureCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1e293b";

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawingSignature(true);
  };

  const drawSignature = (e) => {
    if (!isDrawingSignature) return;

    const canvas = signatureCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();

    if (e.cancelable) e.preventDefault();
  };

  const stopDrawingSignature = () => {
    setIsDrawingSignature(false);
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const dataUrl = signatureCanvasRef.current.toDataURL();
    handleSaveSignature(dataUrl);
    clearSignature();
  };

  const [serviciosEfector, setServiciosEfector] = useState([]);
  const [infraEfector, setInfraEfector] = useState({});
  const [rrhhEfector, setRrhhEfector] = useState([]);
  const [equiposEfector, setEquiposEfector] = useState([]);

  const [expandedDatosGenerales, setExpandedDatosGenerales] = useState(true);
  const [expandedEstablecimiento, setExpandedEstablecimiento] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ARQUITECTURA");
  const [selectedSubService, setSelectedSubService] = useState("");

  const handleOpenObsDialog = (fieldId, label, currentValue, category = "TRAMITE") => {
    setObsDialog({
      open: true,
      fieldId,
      label,
      value: currentValue || "",
      category,
    });
  };

  const handleSaveObs = (text) => {
    const currentData = inspectorData[obsDialog.fieldId];
    const isObject = currentData && typeof currentData === 'object' && !Array.isArray(currentData);

    handleFieldChange(obsDialog.fieldId, {
      ...(isObject ? currentData : { value: currentData }),
      obs: text,
      observado: text.trim().length > 0
    });

    setObsDialog({ ...obsDialog, open: false });
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const currentPhotos = JSON.parse(localStorage.getItem("inspector_photos") || "[]");
        localStorage.setItem("inspector_photos", JSON.stringify([...currentPhotos, { name: file.name, data: base64String }]));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveSignature = (dataUrl) => {
    if (signatureStep === 1) {
      setSignatures((prev) => ({ ...prev, representative: dataUrl }));
      setSignatureStep(2);
    } else {
      setSignatures((prev) => ({ ...prev, inspector: dataUrl }));
      setSignatureStep(0);
      setSignatureModalOpen(false);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("¿Está seguro que desea eliminar TODAS las observaciones y reiniciar la inspección?")) {
      setInspectorData({ "f-fecqs7p6": new Date().toISOString().split("T")[0] });
      setObsDatosGenerales([]);
      setObsDatosTramite([]);
      setGeneralObs("");
      setSignatures({ representative: null, inspector: null });
      localStorage.removeItem("inspector_data");
      localStorage.removeItem("obs_datos_generales");
      localStorage.removeItem("general_obs");
      localStorage.removeItem("acta_inspeccion_actual");
      localStorage.removeItem("inspector_photos");
      alert("Inspección reiniciada.");
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setInfraEfector(JSON.parse(localStorage.getItem("efector_infra") || "{}"));
      setEquiposEfector(JSON.parse(localStorage.getItem("efector_equipos") || "[]"));
      setRrhhEfector(JSON.parse(localStorage.getItem("efector_rrhh") || "[]"));
      setServiciosEfector(JSON.parse(localStorage.getItem("efector_servicios") || "[]"));
      setEfectorResponses(JSON.parse(localStorage.getItem("efector_responses") || "{}"));
    };
    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 2000);
    handleStorageChange();
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleFinalize = (result) => {
    const actaData = {
      id: "ACTA-" + Date.now(),
      fecha: new Date().toLocaleDateString(),
      estado: result,
      inspectorData,
      generalObs,
      attachments: attachments.map(f => f.name),
      signatures
    };
    localStorage.setItem("acta_inspeccion_actual", JSON.stringify(actaData));
    alert(`Inspección finalizada con éxito: ${result}. El acta ha sido enviada al establecimiento.`);
    navigate("/");
  };

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("http://localhost:3001/configuraciones_maestras");
        const data = await res.json();
        setConfig(data[0]);
        const savedData = JSON.parse(localStorage.getItem("inspector_data") || "{}");
        if (Object.keys(savedData).length === 0) {
          setInspectorData({ "f-fecqs7p6": new Date().toISOString().split("T")[0] });
        } else {
          setInspectorData(savedData);
        }
        setLoading(false);
      } catch (e) {
        console.error("Error loading config:", e);
      }
    };
    loadConfig();
  }, []);

  useEffect(() => {
    if (!loading && inspectorData) {
      localStorage.setItem("inspector_data", JSON.stringify(inspectorData));
    }
  }, [inspectorData, loading]);

  const datosGeneralesSrv = config?.servicios?.find((s) => s.id === "srv-gen");
  const datosTramiteSrv = config?.servicios?.find((s) => s.id === "srv-tramite");

  const directorTecnico = {
    nombre: inspectorData["f-nomdtcemx"] || "Dr. Juan",
    apellido: inspectorData["f-apedtcemx"] || "Pérez",
    dni: inspectorData["f-dnidtcemx"] || "20.123.456",
  };

  const tipologia = inspectorData["f-tipdtcemx"] || "CLÍNICA CON INTERNACIÓN";

  const SUBSERVICIOS = [
    "GUARDIA",
    "QUIROFANO",
    "SALA DE PARTO",
    "UTI",
    "UNIDAD CORONARIA",
    "UTIP",
    "UTIN",
    "HEMODINAMIA",
    "HOSPITAL DE DIA",
  ];

  const TARGET_MAPPINGS = {
    "GUARDIA": ["GUARDIA"],
    "QUIROFANO": ["QUIROFANO", "QUIRÓFANO", "CENTRO QUIRÚRGICO", "ÁREA QUIRÚRGICA"],
    "SALA DE PARTO": ["SALA DE PARTO", "OBSTETRICIA", "MATERNIDAD"],
    "UTI": ["UNIDADES DE TERAPIA INTENSIVA", "UTI", "TERAPIA INTENSIVA"],
    "UNIDAD CORONARIA": ["UNIDAD CORONARIA", "UCO"],
    "UTIP": ["UNIDAD DE TERAPIA INTENSIVA PEDIATRICA", "UTIP"],
    "UTIN": ["UNIDAD DE TERAPIA INTENSIVA NEONATAL", "UTIN"],
    "HEMODINAMIA": ["HEMODINAMIA"],
    "HOSPITAL DE DIA": ["HOSPITAL DE DIA"],
  };

  const normalizedMatch = (srvName, targetKey) => {
    const nSrv = srvName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    const nKey = targetKey.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    if (nSrv.includes(nKey) || nKey.includes(nSrv)) return true;
    const srvWords = nSrv.split(/\W+/).filter((w) => w.length > 3);
    const keyWords = nKey.split(/\W+/).filter((w) => w.length > 3);
    return keyWords.some((kw) => srvWords.includes(kw));
  };

  const activeSubServicios = SUBSERVICIOS.filter((sub) => {
    const allEfectorSelection = [
      ...serviciosEfector,
      ...Object.keys(infraEfector || {}).filter((k) => (infraEfector[k] || 0) > 0),
    ];
    return allEfectorSelection.some((srvName) => {
      const isMatch = TARGET_MAPPINGS[sub]?.some((k) => normalizedMatch(srvName, k));
      const nSrv = srvName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
      const isExcluded = sub === "UTI" && (nSrv.includes("PEDIAT") || nSrv.includes("NEONAT") || nSrv.includes("CORONARI") || nSrv.includes("INTERMEDIA"));
      if (sub === "UTI" && (nSrv.includes("TERAPIA INTENSIVA") || nSrv.includes("UTI"))) {
        if (!nSrv.includes("PEDIAT") && !nSrv.includes("NEONAT")) return true;
      }
      return isMatch && !isExcluded;
    });
  });

  useEffect(() => {
    if (activeSubServicios.length > 0 && !activeSubServicios.includes(selectedSubService)) {
      setSelectedSubService(activeSubServicios[0]);
    }
  }, [activeSubServicios, selectedSubService]);

  const handleFieldChange = (fieldId, newValue) => {
    setInspectorData((prev) => {
      const current = prev[fieldId];
      const isObject = current && typeof current === 'object' && !Array.isArray(current);
      if (newValue && typeof newValue === 'object' && !Array.isArray(newValue) && 'obs' in newValue) {
        return { ...prev, [fieldId]: newValue };
      }
      return {
        ...prev,
        [fieldId]: isObject ? { ...current, value: newValue } : newValue
      };
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "#ffffffff" }}>
        <CircularProgress size={80} thickness={4} />
      </Box>
    );
  }

  const PESTAÑAS = [
    { id: "ARQUITECTURA", label: "ARQUITECTURA", icon: <DomainIcon sx={{ fontSize: 28 }} /> },
    { id: "SALAS Y CAMAS", label: "SALAS Y CAMAS", icon: <BedIcon sx={{ fontSize: 28 }} /> },
    { id: "RECURSOS HUMANOS", label: "RRHH", icon: <PeopleIcon sx={{ fontSize: 28 }} /> },
    { id: "JEFE DE SERVICIO", label: "JS", icon: <FaceRetouchingNaturalIcon sx={{ fontSize: 28 }} /> },
    { id: "EQUIPAMIENTO", label: "EQUIPAMIENTO", icon: <MedicalServicesIcon sx={{ fontSize: 28 }} /> },
    { id: "DOCUMENTACION", label: "DOCUMENTOS ADJUNTOS", icon: <DescriptionIcon sx={{ fontSize: 28 }} /> },
  ];

  const getCompletionStats = (fieldsArray) => {
    if (!fieldsArray || fieldsArray.length === 0) return { total: 0, filled: 0, percent: 100 };
    const total = fieldsArray.length;
    const filled = fieldsArray.filter((f) => {
      const val = inspectorData[f.id];
      if (val === undefined || val === null) return false;
      if (typeof val === "object") return val.observado !== undefined && val.observado !== false;
      return String(val).trim() !== "";
    }).length;
    return { total, filled, percent: Math.round((filled / total) * 100) };
  };

  const renderProgressBar = (stats) => {
    return (
      <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
        <Chip label={`${stats.percent}%`} size="small" sx={{ fontWeight: 800, fontSize: "0.75rem", bgcolor: stats.percent === 100 ? "#def7ed" : "#f1f5f9", color: stats.percent === 100 ? "#065f46" : "#64748b", height: 20, "& .MuiChip-label": { px: 1 } }} />
      </Box>
    );
  };

  const fieldsActuales = datosTramiteSrv?.sections?.find((sec) => sec.id === selectedCategory)?.fields || [];
  const hasObservations = Object.values(inspectorData).some(v => v && typeof v === 'object' && v.observado);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 64px)", width: "89%", bgcolor: "#ffffff", overflowX: "hidden", mx: "auto", maxWidth: 850, pt: 2, pb: 6 }}>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={currentActa}
          exclusive
          onChange={(e, v) => v && setCurrentActa(v)}
          size="small"
          sx={{
            bgcolor: '#f8fafc', p: 0.5, borderRadius: 4, border: '1px solid #e2e8f0',
            '& .MuiToggleButton-root': { px: 4, py: 1, borderRadius: 3.5, border: 'none', fontWeight: 900, fontSize: '0.75rem', color: '#94a3b8', letterSpacing: 1.2, transition: 'all 0.2s', '&.Mui-selected': { bgcolor: 'white', color: '#0090d0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', '&:hover': { bgcolor: 'white' } } }
          }}
        >
          <ToggleButton value={1}>ACTA 1: REVISIÓN</ToggleButton>
          <ToggleButton value={2}>ACTA 2: INSPECCIÓN</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Paper
        elevation={0}
        sx={{ p: 3, mb: 4, borderRadius: 4, borderLeft: `8px solid ${currentActa === 1 ? '#0090d0' : '#f59e0b'}`, bgcolor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', width: '100%' }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h3" sx={{ fontWeight: 950, color: '#0f172a', mb: 1, letterSpacing: -1.5 }}>
            {inspectorData["f-nomtcemx"] || "SANATORIO ALLENDE"}
          </Typography>
          {currentActa === 2 && (
            <Chip label="SEGUIMIENTO" sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 900, fontSize: '0.65rem', borderRadius: 1.5, height: 24 }} />
          )}
        </Stack>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box sx={{ bgcolor: currentActa === 1 ? '#0090d0' : '#f59e0b', color: 'white', borderRadius: 1.5, p: 0.4, display: 'flex' }}>
            <LocalHospitalIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 850, color: '#64748b', letterSpacing: 1.5, textTransform: 'uppercase' }}>{tipologia}</Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 2, height: 20, my: 'auto' }} />
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b' }}>DIRECTOR TÉCNICO: <Box component="span" sx={{ color: '#0f172a', fontWeight: 900 }}>{directorTecnico.nombre} {directorTecnico.apellido}</Box></Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 2, height: 20, my: 'auto' }} />
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b' }}>DNI: <Box component="span" sx={{ color: '#0f172a', fontWeight: 900 }}>{directorTecnico.dni}</Box></Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 2, height: 20, my: 'auto' }} />
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b' }}>FECHA Y HORA: <Box component="span" sx={{ color: currentActa === 1 ? '#e11d48' : '#b45309', fontWeight: 900 }}>{new Date().toLocaleDateString()} HS</Box></Typography>
        </Stack>
      </Paper>

      {currentActa === 1 ? (
        <RevisionActa efectorResponses={efectorResponses} onValidate={(id, s) => alert(id + ":" + s)} />
      ) : (
        <>
          {/* 1. DATOS GENERALES */}
          {datosGeneralesSrv && (
            <Accordion expanded={expandedDatosGenerales} onChange={() => setExpandedDatosGenerales(!expandedDatosGenerales)} sx={{ mb: 2, boxShadow: "0 2px 10px rgba(0,0,0,0.05)", borderRadius: "12px !important", "&:before": { display: "none" }, border: "1px solid #e2e8f0" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#0ea5e9" }} />} sx={{ px: 3, py: 0.5 }}>
                <Box sx={{ display: "flex", flexDirection: "column", width: "100%", pr: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: "#1e293b" }}>1. DATOS GENERALES</Typography>
                  {renderProgressBar(getCompletionStats(datosGeneralesSrv.sections ? getFlatFields(datosGeneralesSrv.sections) : datosGeneralesSrv.fields))}
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, py: 2, bgcolor: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {datosGeneralesSrv.sections ? datosGeneralesSrv.sections.map((sec) => (
                    <Accordion key={sec.id} elevation={0} defaultExpanded sx={{ border: "1px solid #e2e8f0", borderRadius: "12px !important", overflow: "hidden", "&:before": { display: "none" } }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#0ea5e9" }} />} sx={{ bgcolor: "#f8fafc", "& .MuiAccordionSummary-content": { flexDirection: "column" } }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#475569", textTransform: "uppercase", fontSize: "0.8rem" }}>{sec.name}</Typography>
                        {renderProgressBar(getCompletionStats(sec.fields))}
                      </AccordionSummary>
                      <AccordionDetails sx={{ py: 2 }}>
                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 2 }}>
                          {sec.fields.map((f) => (
                            <FieldItem key={f.id} field={f} value={inspectorData[f.id]} efectorResponse={efectorResponses[f.id]} currentActa={currentActa} onChange={handleFieldChange} onOpenObs={(fid, lbl, val) => handleOpenObsDialog(fid, lbl, val, "GENERAL")} />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  )) : datosGeneralesSrv.fields?.map((f) => (
                    <FieldItem key={f.id} field={f} value={inspectorData[f.id]} efectorResponse={efectorResponses[f.id]} currentActa={currentActa} onChange={handleFieldChange} onOpenObs={(fid, lbl, val) => handleOpenObsDialog(fid, lbl, val, "GENERAL")} />
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          )}

          {/* 2. DATOS DEL TRÁMITE */}
          <Accordion expanded={expandedEstablecimiento} onChange={() => setExpandedEstablecimiento(!expandedEstablecimiento)} sx={{ mb: 2, boxShadow: "0 2px 10px rgba(0,0,0,0.05)", borderRadius: "12px !important", "&:before": { display: "none" }, border: "1px solid #e2e8f0" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#0ea5e9" }} />} sx={{ px: 3, py: 0.5 }}>
              <Box sx={{ display: "flex", flexDirection: "column", width: "100%", pr: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: "#1e293b" }}>2. DATOS DEL TRÁMITE</Typography>
                <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 700 }}>Infraestructura, RRHH y Equipamiento</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, py: 2, bgcolor: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, px: 4, width: "100%", position: "relative" }}>
                <Box sx={{ position: "absolute", top: 24, left: 40, right: 40, height: 2, bgcolor: "#e2e8f0", zIndex: 0 }} />
                {PESTAÑAS.map((tab) => {
                  const isSelected = selectedCategory === tab.id;
                  return (
                    <Box key={tab.id} onClick={() => setSelectedCategory(tab.id)} sx={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", zIndex: 1, flex: 1, gap: 0.5 }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", bgcolor: isSelected ? "#0ea5e9" : "#ffffff", color: isSelected ? "white" : "#64748b", border: isSelected ? "none" : "1px solid #e2e8f0", boxShadow: isSelected ? "0 4px 12px rgba(14, 165, 233, 0.4)" : "none", transition: "all 0.3s", "&:hover": { transform: "scale(1.1)", bgcolor: isSelected ? "#0ea5e9" : "#f8fafc" } }}>
                        {tab.icon}
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 900, fontSize: "0.65rem", color: isSelected ? "#0ea5e9" : "#64748b", textAlign: "center", mt: 0.5 }}>{tab.label}</Typography>
                    </Box>
                  );
                })}
              </Box>
              <Divider sx={{ mb: 4, borderStyle: "dashed" }} />
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 950, color: "#0f172a", mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ArrowBackIcon sx={{ transform: 'rotate(180deg)', fontSize: 20, color: '#0ea5e9' }} />
                  DETALLE DE {selectedCategory}
                </Typography>
                {selectedCategory === "SALAS Y CAMAS" ? (
                  <VerificationTable fields={fieldsActuales} inspectorData={inspectorData} onChange={handleFieldChange} onOpenObs={(fid, lbl, val) => handleOpenObsDialog(fid, lbl, val, "TRAMITE")} infraEfector={infraEfector} rrhhEfector={rrhhEfector} equiposEfector={equiposEfector} currentSrvName={selectedCategory} />
                ) : selectedCategory === "EQUIPAMIENTO" ? (
                  <Box>
                    <Alert severity="info" sx={{ mb: 3, borderRadius: 3, fontWeight: 700 }}>
                      EQUIPAMIENTOS REPORTADOS POR EL EFECTOR:
                    </Alert>
                    <Grid container spacing={2}>
                      {equiposEfector && equiposEfector.length > 0 ? (
                        equiposEfector.map((eq, i) => (
                          <Grid item xs={12} md={6} key={i}>
                            <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#005596' }}>{eq.nombre}</Typography>
                              <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                                <Typography variant="caption">CANTIDAD: <b>{eq.cantidad}</b></Typography>
                                <Typography variant="caption">ESTADO: <b>{eq.estado}</b></Typography>
                              </Stack>
                            </Paper>
                          </Grid>
                        ))
                      ) : (
                        <Grid item xs={12}>
                          <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#64748b' }}>No se detectó carga de equipamiento por parte del efector.</Typography>
                        </Grid>
                      )}
                    </Grid>
                    <Divider sx={{ my: 4 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 2 }}>CONSTACIÓN DEL INSPECTOR:</Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 2.5 }}>
                      {fieldsActuales.map((f) => (
                        <FieldItem key={f.id} field={f} value={inspectorData[f.id]} efectorResponse={efectorResponses[f.id]} currentActa={currentActa} onChange={handleFieldChange} onOpenObs={(fid, lbl, val) => handleOpenObsDialog(fid, lbl, val, "TRAMITE")} />
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 2.5 }}>
                    {fieldsActuales.map((f) => (
                      <FieldItem key={f.id} field={f} value={inspectorData[f.id]} efectorResponse={efectorResponses[f.id]} currentActa={currentActa} onChange={handleFieldChange} onOpenObs={(fid, lbl, val) => handleOpenObsDialog(fid, lbl, val, "TRAMITE")} />
                    ))}
                  </Box>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* 3. RESUMEN OBSERVACIONES (Inhabilitado para edición) */}
          <Accordion sx={{ mb: 2, boxShadow: "0 2px 10px rgba(0,0,0,0.05)", borderRadius: "12px !important", "&:before": { display: "none" }, border: "1px solid #e2e8f0" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#ef4444" }} />} sx={{ px: 3, py: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: "#1e293b" }}>3. RESUMEN OBSERVACIONES</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, py: 2, bgcolor: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
              <Stack spacing={3}>
                {/* Sub-apartado: Datos Generales */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "#475569", mb: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}>Observaciones datos generales</Typography>
                  <Stack spacing={1}>
                    {Object.entries(inspectorData)
                      .filter(([k, v]) => {
                        const isGeneral = getFlatFields(datosGeneralesSrv?.sections || datosGeneralesSrv?.fields).some(f => f.id === k);
                        const isNo = v === "NO" || v === false || (v && typeof v === 'object' && (v.value === "NO" || v.value === false));
                        const hasObs = v && typeof v === 'object' && v.observado;
                        return isGeneral && (isNo || hasObs);
                      })
                      .map(([k, v]) => (
                        <Box key={k} sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                          <Typography variant="caption" sx={{ fontWeight: 900, color: '#ef4444' }}>{k}</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                            {v === "NO" || v?.value === "NO" ? "Incumplimiento detectado (Marcado como NO)" : v?.obs}
                          </Typography>
                        </Box>
                      ))}
                    {Object.entries(inspectorData).filter(([k, v]) => {
                      const isGeneral = getFlatFields(datosGeneralesSrv?.sections || datosGeneralesSrv?.fields).some(f => f.id === k);
                      const isNo = v === "NO" || (v && typeof v === 'object' && v.value === "NO");
                      const hasObs = v && typeof v === 'object' && v.observado;
                      return isGeneral && (isNo || hasObs);
                    }).length === 0 && (
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>Sin observaciones en esta categoría.</Typography>
                      )}
                  </Stack>
                </Box>

                <Divider />

                {/* Sub-apartado: Datos del Trámite */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "#475569", mb: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}>Observaciones datos del trámite</Typography>
                  <Stack spacing={1}>
                    {Object.entries(inspectorData)
                      .filter(([k, v]) => {
                        const isGeneral = getFlatFields(datosGeneralesSrv?.sections || datosGeneralesSrv?.fields).some(f => f.id === k);
                        const isNo = v === "NO" || v === false || (v && typeof v === 'object' && (v.value === "NO" || v.value === false));
                        const hasObs = v && typeof v === 'object' && v.observado;
                        return !isGeneral && (isNo || hasObs);
                      })
                      .map(([k, v]) => (
                        <Box key={k} sx={{ p: 1.5, bgcolor: '#fef2f2', borderRadius: 2, border: '1px solid #fee2e2' }}>
                          <Typography variant="caption" sx={{ fontWeight: 900, color: '#ef4444' }}>{k}</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                            {v === "NO" || v?.value === "NO" ? "Requisito No Cumplido" : v?.obs}
                          </Typography>
                        </Box>
                      ))}
                    {Object.entries(inspectorData).filter(([k, v]) => {
                      const isGeneral = getFlatFields(datosGeneralesSrv?.sections || datosGeneralesSrv?.fields).some(f => f.id === k);
                      const isNo = v === "NO" || (v && typeof v === 'object' && v.value === "NO");
                      const hasObs = v && typeof v === 'object' && v.observado;
                      return !isGeneral && (isNo || hasObs);
                    }).length === 0 && (
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>Sin observaciones técnicas registradas.</Typography>
                      )}
                  </Stack>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* 4. OBSERVACIONES GENERALES (Editable) */}
          <Accordion sx={{ mb: 2, boxShadow: "0 2px 10px rgba(0,0,0,0.05)", borderRadius: "12px !important", "&:before": { display: "none" }, border: "1px solid #e2e8f0" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#f59e0b" }} />} sx={{ px: 3, py: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: "#1e293b" }}>4. OBSERVACIONES GENERALES</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, py: 2, bgcolor: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="El inspector puede agregar aquí notas adicionales o conclusiones finales..."
                value={generalObs}
                onChange={(e) => setGeneralObs(e.target.value)}
                sx={{ bgcolor: '#f8fafc', '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button fullWidth variant="outlined" startIcon={<PhotoCamera />} component="label" sx={{ py: 1.5, borderRadius: 3, fontWeight: 800 }}>
                  SACAR FOTO / SUBIR ARCHIVO
                  <input type="file" hidden multiple accept="image/*,application/pdf" onChange={handleFileSelect} />
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<DriveFileRenameOutline />}
                  onClick={() => { setSignatureStep(1); setSignatureModalOpen(true); }}
                  sx={{ py: 1.5, borderRadius: 3, fontWeight: 900, bgcolor: signatures.representative && signatures.inspector ? "#059669" : "#0ea5e9" }}
                >
                  FIRMAR ACTA
                </Button>
              </Stack>
              {attachments.length > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f1f5f9', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: '#64748b' }}>ARCHIVOS ADJUNTOS: {attachments.length}</Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Botones de Acción Final (Fuera de los apartados) */}
          <Stack spacing={2} sx={{ mt: 4, mb: 4, px: 1 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={!signatures.inspector || !signatures.representative}
              onClick={() => handleFinalize("APROBADO")}
              sx={{ py: 2.5, borderRadius: 8, fontWeight: 950, fontSize: "1.2rem", bgcolor: "#059669", boxShadow: '0 4px 14px 0 rgba(5, 150, 105, 0.39)' }}
            >
              APROBAR ACTA
            </Button>
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={!signatures.inspector || !signatures.representative}
              onClick={() => handleFinalize("NO APROBADO")}
              sx={{ py: 2.5, borderRadius: 8, fontWeight: 950, fontSize: "1.2rem", bgcolor: "#ef4444", boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)' }}
            >
              NO APROBAR (NOTIFICAR EMPLAZAMIENTO)
            </Button>
          </Stack>
        </>
      )}

      <Fab color="error" sx={{ position: 'fixed', bottom: 32, right: 32 }} onClick={handleClearAll}><Delete /></Fab>

      <Dialog open={obsDialog.open} onClose={() => setObsDialog({ ...obsDialog, open: false })} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 900 }}>OBSERVACIÓN: {obsDialog.label}</DialogTitle>
        <DialogContent><TextField fullWidth multiline rows={4} variant="outlined" placeholder="Escriba la observación técnica..." value={obsDialog.value} onChange={(e) => setObsDialog({ ...obsDialog, value: e.target.value })} sx={{ mt: 1 }} /></DialogContent>
        <DialogActions><Button onClick={() => setObsDialog({ ...obsDialog, open: false })}>Cancelar</Button><Button onClick={() => handleSaveObs(obsDialog.value)} variant="contained">Guardar</Button></DialogActions>
      </Dialog>

      {/* MODAL DE FIRMAS EXACTO */}
      <Dialog
        open={signatureModalOpen}
        onClose={() => setSignatureModalOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 6, overflow: 'hidden' } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 950,
            textAlign: "center",
            bgcolor: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
            py: 3,
            color: "#1e293b",
            fontSize: "1.2rem",
          }}
        >
          {signatureStep === 1 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Box sx={{ bgcolor: '#0ea5e9', color: 'white', px: 2, py: 0.5, borderRadius: 2, fontSize: '0.7rem', fontWeight: 900 }}>PASO 1 DE 2</Box>
              FIRMA: RESPONSABLE ESTABLECIMIENTO
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Box sx={{ bgcolor: '#059669', color: 'white', px: 2, py: 0.5, borderRadius: 2, fontSize: '0.7rem', fontWeight: 900 }}>PASO 2 DE 2</Box>
              FIRMA: INSPECTOR INTERVINIENTE
            </Box>
          )}
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box
            sx={{
              border: "3px dashed #cbd5e1",
              borderRadius: 6,
              height: 350,
              bgcolor: "#ffffff",
              cursor: "crosshair",
              touchAction: "none",
              overflow: "hidden",
              position: "relative",
              "&:hover": { borderColor: "#94a3b8" },
            }}
            onMouseDown={startDrawingSignature}
            onMouseMove={drawSignature}
            onMouseUp={stopDrawingSignature}
            onMouseLeave={stopDrawingSignature}
            onTouchStart={startDrawingSignature}
            onTouchMove={drawSignature}
            onTouchEnd={stopDrawingSignature}
          >
            <canvas
              ref={signatureCanvasRef}
              width={800}
              height={350}
              style={{ width: "100%", height: "100%" }}
            />
            <Box sx={{ position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: 1 }}>
                ESCRIBA SU FIRMA AQUÍ
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: 4,
            pt: 1,
            justifyContent: "space-between",
            bgcolor: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <Button
            onClick={() => setSignatureModalOpen(false)}
            sx={{
              fontWeight: 800,
              borderRadius: 3,
              color: "#64748b",
              px: 3,
            }}
          >
            Cancelar
          </Button>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              onClick={clearSignature}
              variant="outlined"
              color="error"
              sx={{
                fontWeight: 800,
                borderRadius: 3,
                px: 3,
                borderWidth: "2px",
                "&:hover": { borderWidth: "2px" },
              }}
            >
              Limpiar
            </Button>
            <Button
              onClick={saveSignature}
              variant="contained"
              sx={{
                fontWeight: 900,
                borderRadius: 3,
                px: 4,
                bgcolor: signatureStep === 1 ? "#0ea5e9" : "#059669",
                boxShadow: signatureStep === 1
                  ? "0 4px 10px rgba(14,165,233,0.3)"
                  : "0 4px 10px rgba(5,150,105,0.3)",
              }}
            >
              {signatureStep === 1 ? "Siguiente Firma" : "Confirmar Firma"}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};


const FieldItem = ({ field, value, efectorResponse, currentActa, onChange, onOpenObs }) => {
  const isObj = value && typeof value === 'object' && !Array.isArray(value);
  const realValue = isObj ? value.value : value;
  const obsText = isObj ? value.obs : "";
  const hasResponse = efectorResponse && (efectorResponse.descargo || efectorResponse.files?.length > 0);

  const renderInput = () => {
    switch (field.type) {
      case "boolean":
      case "checkbox":
        return (
          <ToggleButtonGroup value={realValue === undefined ? null : realValue ? "si" : "no"} exclusive disabled={field.origin === "TRÁMITE"} onChange={(e, v) => v && onChange(field.id, v === "si")} fullWidth sx={{ height: 48 }}>
            <ToggleButton value="si" sx={{ flex: 1, fontWeight: 700, "&.Mui-selected": { bgcolor: "#dcfce7", color: "#166534" } }}>SÍ</ToggleButton>
            <ToggleButton value="no" sx={{ flex: 1, fontWeight: 700, "&.Mui-selected": { bgcolor: "#fee2e2", color: "#991b1b" } }}>NO</ToggleButton>
          </ToggleButtonGroup>
        );
      case "date":
        return <TextField type="date" fullWidth variant="outlined" size="small" disabled={field.origin === "TRÁMITE"} value={realValue || ""} onChange={(e) => onChange(field.id, e.target.value)} InputLabelProps={{ shrink: true }} sx={{ "& .MuiInputBase-root": { height: 48 } }} />;
      default:
        return <TextField fullWidth variant="outlined" size="small" disabled={field.origin === "TRÁMITE"} value={realValue || ""} onChange={(e) => onChange(field.id, e.target.value)} sx={{ "& .MuiInputBase-root": { height: 48 } }} />;
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 3, bgcolor: '#ffffff' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 900, color: '#475569', textTransform: 'uppercase' }}>{field.label}</Typography>
        {onOpenObs && (
          <IconButton size="small" onClick={() => onOpenObs(field.id, field.label, obsText)} color={obsText ? "primary" : "default"}>
            {obsText ? <ChatBubbleIcon sx={{ fontSize: 16 }} /> : <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />}
          </IconButton>
        )}
      </Stack>
      {renderInput()}
      {hasResponse && (
        <Box sx={{ mt: 1.5, p: 1, bgcolor: '#f0f9ff', borderRadius: 2, border: '1px dashed #0ea5e9' }}>
          <Typography variant="caption" sx={{ fontWeight: 900, color: '#0369a1', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <InfoIcon sx={{ fontSize: 14 }} /> RESPUESTA DEL EFECTOR
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.7rem', fontStyle: 'italic' }}>"{efectorResponse.descargo}"</Typography>
        </Box>
      )}
      {currentActa === 2 && field.origin === "TRÁMITE" && (
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ReportProblemIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#b45309', fontSize: '0.6rem' }}>EMPLAZAMIENTO PREVIO (ACTA-1)</Typography>
        </Box>
      )}
    </Box>
  );
};

const VerificationTable = ({ fields, inspectorData, onChange, onOpenObs, infraEfector }) => (
  <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
    <Table size="small">
      <TableHead sx={{ bgcolor: "#f1f5f9" }}>
        <TableRow>
          <TableCell sx={{ fontWeight: 900 }}>Elemento</TableCell>
          <TableCell align="center" sx={{ fontWeight: 900 }}>Trámite</TableCell>
          <TableCell align="center" sx={{ fontWeight: 900, bgcolor: '#e0f2fe' }}>Efector</TableCell>
          <TableCell align="center" sx={{ fontWeight: 900 }}>Inspector</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {fields.map((f) => (
          <TableRow key={f.id}>
            <TableCell sx={{ fontSize: '0.8rem', fontWeight: 700 }}>{f.label}</TableCell>
            <TableCell align="center">{f.valorTramite}</TableCell>
            <TableCell align="center" sx={{ bgcolor: '#f0f9ff', fontWeight: 900 }}>{infraEfector[f.id] || "-"}</TableCell>
            <TableCell align="center">
              <TextField size="small" value={inspectorData[f.id] || ""} onChange={(e) => onChange(f.id, e.target.value)} sx={{ width: 80 }} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default PantallaInspeccion;
