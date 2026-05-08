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
  ToggleButtonGroup,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionIcon from "@mui/icons-material/Description";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HistoryIcon from "@mui/icons-material/History";
import ScienceIcon from "@mui/icons-material/Science";
import { Message as MessageIcon } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
} from "@mui/material";


import {
  normalize,
  getFlatFields,
  getCompletionStats,
} from "./components/utils";

import FieldItem from "./components/FieldItem";
import VerificationTable from "./components/VerificationTable";
import ServicesTable from "./components/ServicesTable";
import PlansTable from "./components/PlansTable";
import DocumentsTable from "./components/DocumentsTable";
import AggregatedInspectionTable from "./components/AggregatedInspectionTable";
import ObservationDialog from "./components/ObservationDialog";
import FileViewerModal from "./components/FileViewerModal";
import PhotoViewer from "./components/PhotoViewer";
import RevisionActaView from "./components/RevisionActaView";
import SignatureModal from "./components/SignatureModal";

const PantallaInspeccion = ({
  serviciosEfector: propsServicios,
  infraEfector: propsInfra,
  rrhhEfector: propsRrhh,
  equiposEfector: propsEquipos,
}) => {
  const [loading, setLoading] = useState(true);
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
    representative: { data: null, name: "" },
    inspector: { data: null, name: "" },
  });

  const [activeView, setActiveView] = useState("INSPECCION"); // "REVISION" o "INSPECCION"
  const [historyAnchorEl, setHistoryAnchorEl] = useState(null);
  const historyMenuOpen = Boolean(historyAnchorEl);

  const handleHistoryClick = (event) => {
    setHistoryAnchorEl(event.currentTarget);
  };
  const handleHistoryClose = () => {
    setHistoryAnchorEl(null);
  };

  const [obsDialog, setObsDialog] = useState({
    open: false,
    fieldId: null,
    label: "",
    value: "",
    category: "TRAMITE", // Nueva prop: GENERAL or TRAMITE
  });

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

    // Actualizar dato individual preservando el valor actual
    handleFieldChange(obsDialog.fieldId, {
      ...(isObject ? currentData : { value: currentData }),
      obs: text,
    });

    setObsDialog({ ...obsDialog, open: false });
  };

  const [viewerPhoto, setViewerPhoto] = useState(null);
  const [targetPhotoField, setTargetPhotoField] = useState(null);

  const photoInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;

      // Si tenemos un campo objetivo, guardamos la foto ahí
      if (targetPhotoField) {
        handleFieldChange(targetPhotoField, {
          ...(typeof inspectorData[targetPhotoField] === 'object' ? inspectorData[targetPhotoField] : { value: inspectorData[targetPhotoField] }),
          photo: base64String
        });
        setTargetPhotoField(null);
      } else {
        // Si no, es una foto global
        setAttachments((prev) => [...prev, file]);
        const currentPhotos = JSON.parse(localStorage.getItem("inspector_photos") || "[]");
        localStorage.setItem("inspector_photos", JSON.stringify([...currentPhotos, { name: file.name, data: base64String }]));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = null; // Reset input
  };

  const handleSaveSignature = (dataUrl, name = "") => {
    if (signatureStep === 1) {
      setSignatures((prev) => ({ ...prev, representative: { data: dataUrl, name } }));
      setSignatureStep(2);
    } else {
      setSignatures((prev) => ({ ...prev, inspector: { data: dataUrl, name: name || "ING. GUSTAVO SOSA" } }));
      setSignatureStep(0);
      setSignatureModalOpen(false);
    }
  };

  const [expandedDatosGenerales, setExpandedDatosGenerales] = useState(true);
  const [expandedEstablecimiento, setExpandedEstablecimiento] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ARQUITECTURA");
  const [selectedSubService, setSelectedSubService] = useState("");
  const [serviciosEfector, setServiciosEfector] = useState([]);
  const [infraEfector, setInfraEfector] = useState({});
  const [rrhhEfector, setRrhhEfector] = useState([]);
  const [equiposEfector, setEquiposEfector] = useState([]);
  const [tipologia, setTipologia] = useState("CLÍNICAS, SANATORIOS Y HOSPITALES");
  const [directorTecnico, setDirectorTecnico] = useState({ nombre: "JUAN CARLOS", apellido: "PÉREZ", dni: "20.455.123" });

  const datosGeneralesSrv = React.useMemo(() =>
    config?.servicios?.find((s) => normalize(s.name).includes("DATOS GENERALES")),
    [config]
  );

  const otherServices = React.useMemo(() => {
    return config?.servicios?.filter((s) => {
      const isGeneral = normalize(s.name).includes("DATOS GENERALES");
      if (isGeneral) return false;

      const allEfectorSelection = [
        ...(serviciosEfector || []),
        ...Object.keys(infraEfector || {}).filter((k) => (infraEfector[k] || 0) > 0)
      ];

      return allEfectorSelection.some((effSrv) => {
        const nSrvName = (s.name || "").toUpperCase();
        const nEffSrv = (effSrv || "").toUpperCase();

        if (nSrvName === nEffSrv) return true;

        // Lógica de variantes
        if (nSrvName.includes(nEffSrv) || nEffSrv.includes(nSrvName)) {
          const isPed = (str) => str.includes("PEDIAT") || str.includes("UTIP");
          const isNeo = (str) => str.includes("NEONAT") || str.includes("UTIN");
          const isUco = (str) => str.includes("CORONARI") || str.includes("UCO");
          const isUcim = (str) => str.includes("INTERMEDIO") || str.includes("UCIM");

          if (isPed(nSrvName) !== isPed(nEffSrv)) return false;
          if (isNeo(nSrvName) !== isNeo(nEffSrv)) return false;
          if (isUco(nSrvName) !== isUco(nEffSrv)) return false;
          if (isUcim(nSrvName) !== isUcim(nEffSrv)) return false;

          return true;
        }
        return false;
      });
    }) || [];
  }, [config, serviciosEfector, infraEfector]);

  useEffect(() => {
    const loadFromCache = () => {
      const cachedSrv = localStorage.getItem("efector_servicios");
      const cachedInfra = localStorage.getItem("efector_infra");
      const cachedRrhh = localStorage.getItem("efector_rrhh");
      const cachedEquipos = localStorage.getItem("efector_equipos");
      const cachedTipo = localStorage.getItem("efector_tipo");
      const cachedDT = localStorage.getItem("efector_dt");

      if (cachedSrv) setServiciosEfector(JSON.parse(cachedSrv));
      if (cachedInfra) setInfraEfector(JSON.parse(cachedInfra));
      if (cachedRrhh) setRrhhEfector(JSON.parse(cachedRrhh));
      if (cachedEquipos) setEquiposEfector(JSON.parse(cachedEquipos));
      if (cachedTipo) setTipologia(cachedTipo);
      if (cachedDT) setDirectorTecnico(JSON.parse(cachedDT));
    };

    // 1. Prioridad: Props
    if (propsServicios) {
      setServiciosEfector(propsServicios);
      setInfraEfector(propsInfra || {});
      setRrhhEfector(propsRrhh || []);
      setEquiposEfector(propsEquipos || []);
    } else {
      // 2. Fallback: LocalStorage
      loadFromCache();
    }

    // 4. Cargar persistencia
    const savedData = localStorage.getItem("inspector_data");
    const savedGenObs = localStorage.getItem("obs_datos_generales");
    const savedTraObs = localStorage.getItem("obs_datos_tramite");
    const savedManualObs = localStorage.getItem("general_obs");

    if (savedData) setInspectorData(JSON.parse(savedData));
    else {
      setInspectorData({ "f-fecqs7p6": new Date().toISOString().split("T")[0] });
    }

    if (savedGenObs) {
      try { setObsDatosGenerales(JSON.parse(savedGenObs)); } catch (e) { setObsDatosGenerales([]); }
    }
    if (savedTraObs) {
      try { setObsDatosTramite(JSON.parse(savedTraObs)); } catch (e) { setObsDatosTramite([]); }
    }
    if (savedManualObs) setGeneralObs(savedManualObs);

    // 3. Escuchar cambios en otras pestañas (Sincronización automática)
    const handleStorageChange = (e) => {
      if (e.key?.startsWith("efector_")) {
        loadFromCache();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [propsServicios, propsInfra, propsRrhh, propsEquipos]);

  // Guardar datos automáticamente
  useEffect(() => {
    if (Object.keys(inspectorData).length > 0) {
      localStorage.setItem("inspector_data", JSON.stringify(inspectorData));
    }
  }, [inspectorData]);

  useEffect(() => {
    localStorage.setItem("general_obs", generalObs);
  }, [generalObs]);

  // Sincronización automática de sumarios de observaciones
  useEffect(() => {
    if (!config) return;

    const extractValue = (val) => (val && typeof val === 'object' && !Array.isArray(val) ? val.value : val);
    const extractObs = (val) => (val && typeof val === 'object' && !Array.isArray(val) ? val.obs : "");
    const extractPhoto = (val) => (val && typeof val === 'object' && !Array.isArray(val) ? val.photo : null);

    // 1. Datos Generales
    let genSummary = [];
    const genFields = datosGeneralesSrv?.sections
      ? getFlatFields(datosGeneralesSrv.sections)
      : datosGeneralesSrv?.fields || [];

    genFields.forEach(f => {
      const fieldData = inspectorData[f.id];
      const val = extractValue(fieldData);
      const obs = extractObs(fieldData);

      const photo = extractPhoto(fieldData);

      if ((f.type === 'boolean' || f.type === 'checkbox') && val === false) {
        genSummary.push({ id: f.id, label: f.label, text: `NO CUMPLE${obs ? ` (${obs})` : ''}`, type: 'ERROR', hasPhoto: !!photo, photo });
      } else if (obs) {
        genSummary.push({ id: f.id, label: f.label, text: obs, type: 'OBS', hasPhoto: !!photo, photo });
      }
    });
    setObsDatosGenerales(genSummary);

    // 2. Datos Trámite
    let traSummary = [];
    let emplazamientos = []; // Nuevos emplazamientos para el efector

    (config.servicios || []).forEach(srv => {
      const isGeneralSrv = normalize(srv.name).includes("DATOS GENERALES");
      if (isGeneralSrv) return;

      const srvFields = srv.sections ? getFlatFields(srv.sections) : srv.fields || [];
      srvFields.forEach(f => {
        const fieldData = inspectorData[f.id];
        const val = extractValue(fieldData);
        const obs = extractObs(fieldData);
        const isDoc = f.id?.includes('doc') || f.label?.toUpperCase().includes('DOCUMENTO');
        let isIrregularidadTramite = false;
        let razonIrregular = "";

        const photo = extractPhoto(fieldData);

        // Regla 1: Datos Generales / Otros (Boolean NO CUMPLE) -> OBSERVACIÓN DE ACTA
        if ((f.type === 'boolean' || f.type === 'checkbox') && val === false) {
          traSummary.push({ id: f.id, label: f.label, service: srv.name, text: `NO CUMPLE${obs ? ` (${obs})` : ''}`, type: 'ERROR', hasPhoto: !!photo, photo });
        } else if (obs && !isDoc) {
          // Observaciones manuales en campos normales -> OBSERVACIÓN DE ACTA
          traSummary.push({ id: f.id, label: f.label, service: srv.name, text: obs, type: 'OBS', hasPhoto: !!photo, photo });
        }

        // Regla 2: Camas y Salas (Actual > Declarado) -> IRREGULARIDAD TRÁMITE
        const isCamaSala = f.label?.toUpperCase().includes('CAMA') || f.label?.toUpperCase().includes('SALA') || f.label?.toUpperCase().includes('HABITACIÓN');
        if (isCamaSala && typeof val === 'number') {
          const declarado = infraEfector[f.label] || 0;
          if (val > declarado) {
            isIrregularidadTramite = true;
            razonIrregular = `Cantidad superior a la declarada (${val} vs ${declarado})`;
          }
        }

        // Regla 3: Equipamiento (Actual < Declarado) -> IRREGULARIDAD TRÁMITE
        const isEquip = f.label?.toUpperCase().includes('EQUIPO') || f.label?.toUpperCase().includes('EQUIPAMIENTO') || f.id?.includes('eq');
        if (isEquip && typeof val === 'number') {
          const equipoMatch = equiposEfector?.filter(e => e.equipamiento === f.label && e.origen === srv.name) || [];
          const declarado = equipoMatch.reduce((acc, curr) => acc + (curr.actualQty || 1), 0);
          if (val < declarado) {
            isIrregularidadTramite = true;
            razonIrregular = `Faltante de equipamiento (${val} de ${declarado} requeridos)`;
          }
        }

        // Regla 4: Documentos (Cualquier observación) -> IRREGULARIDAD TRÁMITE
        if (isDoc && obs) {
          isIrregularidadTramite = true;
          razonIrregular = obs;
        }

        if (isIrregularidadTramite) {
          emplazamientos.push({
            etapa: "Inspección",
            servicio: srv.name,
            item: f.label,
            observacion: razonIrregular,
            valorObservado: val,
            tipoObs: "IRREGULARIDAD",
            estado: "PENDIENTE DE SUBIR"
          });
        }
      });
    });

    // 3. Escaneo de IDs Manuales (Planos, Documentos, Infraestructura Literal)
    Object.keys(inspectorData).forEach(key => {
      if (key.startsWith('plan_auth_') || key.startsWith('doc_auth_') || key.startsWith('infra_literal_')) {
        const data = inspectorData[key];
        const isPlan = key.startsWith('plan_auth_');
        const isDoc = key.startsWith('doc_auth_');
        const isInfra = key.startsWith('infra_literal_');

        if (data && (data.observado || data.obs)) {
          // Si ya existe en el summary (por alguna razón), no duplicar
          if (traSummary.find(item => item.id === key)) return;

          let label = "";
          let service = "";

          if (isPlan) {
            label = `PLANO: ${key.replace('plan_auth_', '').replace('_', '.')}`;
            service = "ARQUITECTURA";
          } else if (isDoc) {
            label = `DOCUMENTO: ${key.replace('doc_auth_', '').replace(/_/g, ' ')}`;
            service = "DOCUMENTACIÓN";
          } else if (isInfra) {
            label = key.replace('infra_literal_', '').replace(/_/g, ' ');
            service = "SALAS Y CAMAS";
          }

          traSummary.push({
            id: key,
            label,
            service,
            text: data.obs || "NO CUMPLE",
            type: 'OBS',
            hasPhoto: !!data.photo,
            photo: data.photo
          });
        }
      }
    });

    setObsDatosTramite(traSummary);

    localStorage.setItem("obs_datos_generales", JSON.stringify(genSummary));
    localStorage.setItem("obs_datos_tramite", JSON.stringify(traSummary));
    localStorage.setItem("inspector_emplazamientos", JSON.stringify(emplazamientos));
  }, [inspectorData, config, datosGeneralesSrv, otherServices]);

  const hasObservations =
    (obsDatosGenerales?.length || 0) > 0 ||
    (obsDatosTramite?.length || 0) > 0 ||
    (generalObs || "").trim().length > 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3001/configuraciones_maestras?tipologia=${encodeURIComponent(
            tipologia,
          )}`,
        );
        const data = await res.json();
        if (data && data.length > 0) {
          const masterConfig = data[0];
          setConfig(masterConfig);
          localStorage.setItem("master_config", JSON.stringify(masterConfig));
        }
      } catch (err) {
        console.error("Error al cargar configuración", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tipologia]);

  const SUBSERVICIOS = [
    "UNIDADES DE TERAPIA INTENSIVA",
    "UNIDAD CORONARIA",
    "UNIDAD DE TERAPIA INTENSIVA NEONATAL",
    "HEMODIALISIS",
  ];
  const TARGET_MAPPINGS = {
    "UNIDADES DE TERAPIA INTENSIVA": [
      "UTI",
      "TERAPIA INTENSIVA",
      "CUIDADOS INTENSIVOS",
      "CUIDADOS CRITICOS",
      "UNIDAD DE TERAPIA INTENSIVA",
      "UNIDADES DE TERAPIA INTENSIVA",
    ],
    "UNIDAD CORONARIA": ["UCO", "CORONARIA", "CORONARIO", "UNIDAD CORONARIA"],
    "UNIDAD DE TERAPIA INTENSIVA NEONATAL": ["UTIN", "NEONATAL", "UNIDAD DE TERAPIA INTENSIVA NEONATAL"],
    HEMODIALISIS: ["HEMODIALISIS", "DIALISIS"],
  };

  const normalizedMatch = (srvName, targetKey) => {
    const nSrv = srvName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
    const nKey = targetKey
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();

    if (nSrv.includes(nKey) || nKey.includes(nSrv)) return true;

    const srvWords = nSrv.split(/\W+/).filter((w) => w.length > 3);
    const keyWords = nKey.split(/\W+/).filter((w) => w.length > 3);
    return keyWords.some((kw) => srvWords.includes(kw));
  };

  const activeSubServicios = SUBSERVICIOS.filter((sub) => {
    const allEfectorSelection = [
      ...serviciosEfector,
      ...Object.keys(infraEfector || {}).filter(
        (k) => (infraEfector[k] || 0) > 0,
      ),
    ];

    return allEfectorSelection.some((srvName) => {
      const isMatch = TARGET_MAPPINGS[sub]?.some((k) =>
        normalizedMatch(srvName, k),
      );
      const nSrv = srvName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();

      const isExcluded =
        sub === "UNIDADES DE TERAPIA INTENSIVA" &&
        (nSrv.includes("PEDIAT") ||
          nSrv.includes("NEONAT") ||
          nSrv.includes("CORONARI") ||
          nSrv.includes("INTERMEDIA"));

      // Si es exactamente la UTI que buscamos, nunca la excluimos de su propio chip
      if (
        sub === "UNIDADES DE TERAPIA INTENSIVA" &&
        (nSrv.includes("TERAPIA INTENSIVA") || nSrv.includes("UTI"))
      ) {
        if (!nSrv.includes("PEDIAT") && !nSrv.includes("NEONAT")) return true;
      }

      return isMatch && !isExcluded;
    });
  });

  useEffect(() => {
    if (
      activeSubServicios.length > 0 &&
      !activeSubServicios.includes(selectedSubService)
    ) {
      setSelectedSubService(activeSubServicios[0]);
    }
  }, [activeSubServicios, selectedSubService]);

  const handleFieldChange = (fieldId, newValue) => {
    setInspectorData((prev) => {
      const current = prev[fieldId] || {};
      if (newValue && typeof newValue === 'object' && !Array.isArray(newValue)) {
        return { ...prev, [fieldId]: { ...current, ...newValue } };
      }
      return { ...prev, [fieldId]: { ...current, value: newValue } };
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#ffffffff",
        }}
      >
        <CircularProgress size={80} thickness={4} />
      </Box>
    );
  }

  const allServiceNames = config?.servicios?.map((s) => s.name) || [];

  const PESTAÑAS = [
    {
      id: "ARQUITECTURA",
      label: "ARQUITECTURA",
      icon: <DomainIcon sx={{ fontSize: 28 }} />,
    },
    {
      id: "SERVICIOS",
      label: "SERVICIOS",
      icon: <LocalHospitalIcon sx={{ fontSize: 28 }} />,
    },
    {
      id: "SALAS Y CAMAS",
      label: "SALAS Y CAMAS",
      icon: <BedIcon sx={{ fontSize: 28 }} />,
    },
    {
      id: "RECURSOS HUMANOS",
      label: "RRHH y JS",
      icon: <PeopleIcon sx={{ fontSize: 28 }} />,
    },
    {
      id: "EQUIPAMIENTO",
      label: "EQUIPAMIENTO",
      icon: <MedicalServicesIcon sx={{ fontSize: 28 }} />,
    },
    {
      id: "DOCUMENTACION",
      label: "DOCUMENTOS ADJUNTOS",
      icon: <DescriptionIcon sx={{ fontSize: 28 }} />,
    },
  ];

  const renderProgressBar = (stats) => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: 0.5,
        }}
      >
        <Chip
          label={`${stats.percent}%`}
          size="small"
          sx={{
            fontWeight: 800,
            fontSize: "0.75rem",
            bgcolor: stats.percent === 100 ? "#def7ed" : "#f1f5f9",
            color: stats.percent === 100 ? "#065f46" : "#64748b",
            height: 20,
            "& .MuiChip-label": { px: 1 }
          }}
        />
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 64px)",
        width: "89%",
        bgcolor: "#ffffff",
        overflowX: "hidden",
        mx: "auto",
        maxWidth: 850,
        pt: 2,
        pb: 6,
      }}
    >
      {/* Header Estilizado según Screenshot */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          borderLeft: '8px solid #0090d0',
          bgcolor: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
          width: '100%'
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 950, color: '#0f172a', mb: 1, letterSpacing: -1.5 }}>
          {inspectorData["f-nomtcemx"] || "SANATORIO ALLENDE"}
        </Typography>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#0090d0', color: 'white', borderRadius: 1.5, p: 0.4, display: 'flex' }}>
            <LocalHospitalIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 850, color: '#64748b', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            {tipologia}
          </Typography>

          <Divider orientation="vertical" flexItem sx={{ mx: 2, height: 20, my: 'auto' }} />

          <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b' }}>
            DIRECTOR TÉCNICO: <Box component="span" sx={{ color: '#0f172a', fontWeight: 900 }}>{directorTecnico.nombre} {directorTecnico.apellido}</Box>
          </Typography>

          <Divider orientation="vertical" flexItem sx={{ mx: 2, height: 20, my: 'auto' }} />

          <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b' }}>
            DNI: <Box component="span" sx={{ color: '#0f172a', fontWeight: 900 }}>{directorTecnico.dni}</Box>
          </Typography>
        </Stack>
      </Paper>

      {/* Selector de Acta / Revisión / Historial */}
      <Box
        sx={{
          bgcolor: '#ebeef2',
          borderRadius: 6,
          p: 0.8,
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
        }}
      >
        <Button
          onClick={handleHistoryClick}
          startIcon={<HistoryIcon sx={{ color: '#0ea5e9' }} />}
          endIcon={historyMenuOpen ? <KeyboardArrowUpIcon sx={{ color: '#0ea5e9' }} /> : <KeyboardArrowDownIcon sx={{ color: '#0ea5e9' }} />}
          sx={{
            bgcolor: historyMenuOpen ? 'white' : 'transparent',
            borderRadius: 5,
            px: 3,
            py: 1,
            fontWeight: 900,
            color: '#0ea5e9',
            boxShadow: historyMenuOpen ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            textTransform: 'uppercase',
            fontSize: '0.85rem',
            letterSpacing: '0.02em',
            '&:hover': { bgcolor: historyMenuOpen ? '#ffffff' : 'rgba(0,0,0,0.04)' }
          }}
        >
          HISTORIAL
        </Button>

        <Menu
          anchorEl={historyAnchorEl}
          open={historyMenuOpen}
          onClose={handleHistoryClose}
          PaperProps={{
            elevation: 0,
            sx: {
              mt: 1.5,
              borderRadius: 4,
              minWidth: 180,
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
              border: '1px solid #f1f5f9',
              '& .MuiMenuItem-root': {
                fontWeight: 800,
                color: '#64748b',
                fontSize: '0.9rem',
                py: 1.5,
                px: 3,
                mx: 1,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: '#f0f9ff',
                  color: '#0ea5e9'
                }
              }
            }
          }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleHistoryClose} sx={{ bgcolor: '#f0f9ff !important', color: '#0ea5e9 !important' }}>ACTA 1</MenuItem>
          <MenuItem onClick={handleHistoryClose}>ACTA 2</MenuItem>
          <MenuItem onClick={handleHistoryClose}>ACTA 3</MenuItem>
        </Menu>

        <Button
          variant="text"
          onClick={() => setActiveView("REVISION")}
          sx={{
            flex: 1,
            borderRadius: 5,
            fontWeight: 900,
            py: 1,
            color: activeView === "REVISION" ? "#0f172a" : "#64748b",
            bgcolor: activeView === "REVISION" ? "white" : "transparent",
            boxShadow: activeView === "REVISION" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            textTransform: 'none',
            fontSize: '0.85rem',
            '&:hover': { bgcolor: activeView === "REVISION" ? 'white' : 'rgba(0,0,0,0.04)' }
          }}
        >
          ACTA 4: REVISIÓN
        </Button>
        <Button
          variant="text"
          onClick={() => setActiveView("INSPECCION")}
          sx={{
            flex: 1,
            borderRadius: 5,
            fontWeight: 900,
            py: 1,
            color: activeView === "INSPECCION" ? "#0f172a" : "#64748b",
            bgcolor: activeView === "INSPECCION" ? "white" : "transparent",
            boxShadow: activeView === "INSPECCION" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            textTransform: 'none',
            fontSize: '0.85rem',
            '&:hover': { bgcolor: activeView === "INSPECCION" ? 'white' : 'rgba(0,0,0,0.04)' }
          }}
        >
          ACTA 5: INSPECCIÓN
        </Button>
      </Box>

      {activeView === "REVISION" ? (
        <RevisionActaView
          obsGenerales={obsDatosGenerales}
          obsTramite={obsDatosTramite}
        />
      ) : (
        <>

          {datosGeneralesSrv && (
            <Accordion
              expanded={expandedDatosGenerales}
              onChange={() => setExpandedDatosGenerales(!expandedDatosGenerales)}
              sx={{
                mb: 2,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                borderRadius: "12px !important",
                "&:before": { display: "none" },
                border: "1px solid #e2e8f0",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#0ea5e9" }} />}
                sx={{ px: { xs: 2, sm: 3 }, py: 0.5 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    pr: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 900, color: "#1e293b" }}
                  >
                    DATOS GENERALES
                  </Typography>
                  {renderProgressBar(
                    getCompletionStats(
                      datosGeneralesSrv.sections
                        ? getFlatFields(datosGeneralesSrv.sections)
                        : datosGeneralesSrv.fields,
                      inspectorData
                    ),
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: 2,
                  bgcolor: "#ffffff",
                  borderTop: "1px solid #e2e8f0",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {datosGeneralesSrv.sections
                    ? datosGeneralesSrv.sections.map((sec) => {
                      const sectionStats = getCompletionStats(sec.fields, inspectorData);
                      return (
                        <Accordion
                          key={sec.id}
                          elevation={0}
                          defaultExpanded
                          sx={{
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px !important",
                            overflow: "hidden",
                            "&:before": { display: "none" },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={
                              <ExpandMoreIcon sx={{ color: "#0ea5e9" }} />
                            }
                            sx={{
                              bgcolor: "#f8fafc",
                              "& .MuiAccordionSummary-content": {
                                flexDirection: "column",
                              },
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 800,
                                color: "#475569",
                                textTransform: "uppercase",
                                fontSize: "0.8rem",
                              }}
                            >
                              {sec.name}
                            </Typography>
                            {renderProgressBar(sectionStats)}
                          </AccordionSummary>
                          <AccordionDetails sx={{ py: 2 }}>
                            <Box
                              sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                                gap: 2,
                              }}
                            >
                              {sec.fields.map((field) => (
                                <FieldItem
                                  key={field.id}
                                  field={field}
                                  value={inspectorData[field.id]}
                                  onChange={handleFieldChange}
                                  onOpenObs={(fid, lbl, val) => handleOpenObsDialog(fid, lbl, val, "GENERAL")}
                                />
                              ))}
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })
                    : datosGeneralesSrv.fields?.map((field) => (
                      <FieldItem
                        key={field.id}
                        field={field}
                        value={inspectorData[field.id]}
                        onChange={handleFieldChange}
                        onOpenObs={(fid, lbl, val) => handleOpenObsDialog(fid, lbl, val, "GENERAL")}
                        infraEfector={infraEfector}
                        serviciosEfector={serviciosEfector}
                      />
                    ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          )}

          <Accordion
            expanded={expandedEstablecimiento}
            onChange={() => setExpandedEstablecimiento(!expandedEstablecimiento)}
            sx={{
              mb: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              borderRadius: "12px !important",
              "&:before": { display: "none" },
              border: "1px solid #e2e8f0",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#0ea5e9" }} />}
              sx={{ px: { xs: 2, sm: 3 }, py: 0.5 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  pr: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 900, color: "#1e293b" }}
                >
                  DATOS DEL TRÁMITE
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 700 }}>
                  Valores declarados en el trámite
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: { xs: 2, sm: 3 }, py: 2, bgcolor: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 3,
                  px: { xs: 1, sm: 4 },
                  width: "100%",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 24,
                    left: 40,
                    right: 40,
                    height: 2,
                    bgcolor: "#e2e8f0",
                    zIndex: 0,
                  }}
                />

                {PESTAÑAS.map((tab) => {
                  const isSelected = selectedCategory === tab.id;
                  return (
                    <Box
                      key={tab.id}
                      onClick={() => setSelectedCategory(tab.id)}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        cursor: "pointer",
                        zIndex: 1,
                        flex: 1,
                        minWidth: 0,
                        gap: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          bgcolor: isSelected ? "#0ea5e9" : "#ffffff",
                          color: isSelected ? "white" : "#64748b",
                          border: "2px solid",
                          borderColor: isSelected ? "#0ea5e9" : "#cbd5e1",
                          boxShadow: isSelected
                            ? "0 4px 10px rgba(14,165,233,0.3)"
                            : "none",
                          transition: "all 0.2s",
                        }}
                      >
                        {tab.icon}
                      </Box>
                      <Typography
                        align="center"
                        sx={{
                          fontWeight: 800,
                          fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.8rem" },
                          color: isSelected ? "#0f172a" : "#64748b",
                          lineHeight: 1.1,
                        }}
                      >
                        {tab.label}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>


              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}
              >
                {/* Casos especiales globales según categoría */}
                {selectedCategory === "ARQUITECTURA" && (
                  <Box sx={{ mb: 4 }}>
                    <PlansTable
                      inspectorData={inspectorData}
                      onChange={handleFieldChange}
                      onOpenObs={handleOpenObsDialog}
                      onOpenViewer={setViewerFile}
                    />
                  </Box>
                )}

                {selectedCategory === "DOCUMENTACION" && (
                  <Box sx={{ mb: 4 }}>
                    <DocumentsTable
                      inspectorData={inspectorData}
                      onChange={handleFieldChange}
                      onOpenObs={handleOpenObsDialog}
                      onOpenViewer={setViewerFile}
                    />
                  </Box>
                )}

                {selectedCategory === "SERVICIOS" && (
                  <Box sx={{ mb: 4 }}>
                    <ServicesTable
                      inspectorData={inspectorData}
                      onChange={handleFieldChange}
                      onOpenObs={handleOpenObsDialog}
                      serviciosEfector={serviciosEfector}
                    />
                  </Box>
                )}

                {selectedCategory === "SERVICIOS" && (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      mb: 4,
                      mt: 1,
                      justifyContent: "center",
                      p: 2,
                      bgcolor: "#f8fafc",
                      borderRadius: 4,
                      border: "1px dashed #cbd5e1",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        width: "100%",
                        textAlign: "center",
                        fontWeight: 700,
                        mb: 1,
                        color: "#94a3b8",
                      }}
                    >
                      SUB-ÁREAS TÉCNICAS A EVALUAR
                    </Typography>
                    {activeSubServicios.map((sub) => (
                      <Chip
                        key={sub}
                        size="medium"
                        label={sub}
                        clickable
                        onClick={() => setSelectedSubService(sub)}
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          px: 1,
                          bgcolor: selectedSubService === sub ? "#e0f2fe" : "white",
                          color: selectedSubService === sub ? "#0369a1" : "#64748b",
                          border: "2px solid",
                          borderColor: selectedSubService === sub ? "#0ea5e9" : "#e2e8f0",
                        }}
                      />
                    ))}
                  </Box>
                )}

                {(selectedCategory === "EQUIPAMIENTO" || selectedCategory === "SALAS Y CAMAS") && (
                  <Box sx={{ mb: 4 }}>
                    <AggregatedInspectionTable
                      category={selectedCategory}
                      services={otherServices}
                      inspectorData={inspectorData}
                      infraEfector={infraEfector}
                      equiposEfector={equiposEfector}
                      onChange={handleFieldChange}
                      onOpenObs={handleOpenObsDialog}
                    />
                  </Box>
                )}

                <FileViewerModal
                  file={viewerFile}
                  onClose={() => setViewerFile(null)}
                />

                {otherServices.map((srv) => {
                  let matchedSections = [];

                  if (selectedCategory === "SERVICIOS") {
                    const isTargetService = TARGET_MAPPINGS[selectedSubService]?.some(
                      (k) => normalizedMatch(srv.name, k),
                    );
                    const nSrv = (srv.name || "").toUpperCase();
                    const isExcluded =
                      selectedSubService === "UTI" &&
                      (nSrv.includes("PEDIAT") ||
                        nSrv.includes("NEONAT") ||
                        nSrv.includes("CORONARI") ||
                        nSrv.includes("INTERMEDIA"));

                    if (
                      isTargetService &&
                      (!isExcluded || nSrv === "UNIDAD DE TERAPIA INTENSIVA") &&
                      srv.sections
                    ) {
                      matchedSections = srv.sections.filter((sec) => {
                        const n = sec.name.toUpperCase();

                        // Si estamos en una sub-área técnica específica (UTI, UCO, etc), 
                        // mostramos TODO (incluyendo equipamiento y rrhh) para que la evaluación sea integral
                        const isSubAreaTecnica = [
                          "UNIDADES DE TERAPIA INTENSIVA",
                          "UNIDAD CORONARIA",
                          "UNIDAD DE TERAPIA INTENSIVA NEONATAL",
                          "HEMODIALISIS"
                        ].includes(selectedSubService);

                        const isRelevant = isSubAreaTecnica || (
                          !n.includes("ARQUITECTURA") &&
                          !n.includes("EQUIPAMIENTO") &&
                          !n.includes("RECURSOS") &&
                          !n.includes("RRHH") &&
                          !n.includes("JEFE")
                        );

                        if (!isRelevant) return false;
                        return sec.fields && sec.fields.length > 0;
                      });
                    }
                  } else {
                    if (srv.sections) {
                      const keyword =
                        selectedCategory === "RECURSOS HUMANOS"
                          ? "RECURSOS"
                          : selectedCategory === "SALAS Y CAMAS"
                            ? "SALA"
                            : selectedCategory === "DOCUMENTACION"
                              ? "DOCUMENTO"
                              : selectedCategory;
                      matchedSections = srv.sections.filter((sec) => {
                        const isMatch =
                          sec.name.toUpperCase().includes(keyword) ||
                          (selectedCategory === "DOCUMENTACION" &&
                            sec.name.toUpperCase().includes("DOCUMENTA")) ||
                          (selectedCategory === "RECURSOS HUMANOS" &&
                            sec.name.toUpperCase().includes("JEFE")) ||
                          (selectedCategory === "SALAS Y CAMAS" &&
                            sec.name.toUpperCase().includes("CAMA"));

                        if (!isMatch || selectedCategory === "DOCUMENTACION" || selectedCategory === "EQUIPAMIENTO" || selectedCategory === "SALAS Y CAMAS") return false;

                        // Verificar si tiene campos válidos después de filtrar por infraEfector si aplica
                        const validFields = (sec.fields || []).filter((f) => {
                          if (
                            sec.name.toUpperCase().includes("SALA") ||
                            sec.name.toUpperCase().includes("CAMA")
                          ) {
                            const label = f.label || f.name;
                            const uLabel = label.toUpperCase();
                            const isGenericLabel = uLabel.includes("CAMAS") || uLabel.includes("SALAS") || uLabel.includes("HABITACION") || (uLabel.includes("N") && uLabel.includes("DE"));

                            // Si es etiqueta genérica, basta con que el servicio esté en infraEfector
                            if (isGenericLabel && infraEfector && (infraEfector[srv.name] || infraEfector[srv.id])) return true;

                            return (infraEfector && (infraEfector[label] || 0) > 0);
                          }
                          return true;
                        });

                        return validFields.length > 0;
                      });
                    }
                  }

                  if (!matchedSections || matchedSections.length === 0) return null;

                  return (
                    <Accordion
                      key={srv.id}
                      defaultExpanded
                      sx={{
                        mb: 1,
                        boxShadow: "none",
                        borderRadius: "12px !important",
                        border: "1px solid #e2e8f0",
                        "&:before": { display: "none" },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: "#475569" }} />}
                        sx={{
                          bgcolor: "#f8fafc",
                          px: 3,
                          "&.Mui-expanded": {
                            borderBottom: "1px solid #e2e8f0",
                          },
                          "& .MuiAccordionSummary-content": {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            pr: 2
                          }
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <LocalHospitalIcon sx={{ color: "#64748b", fontSize: 20 }} />
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 900,
                              color: "#1e293b",
                              fontSize: "1rem",
                              textTransform: "uppercase"
                            }}
                          >
                            {srv.name}
                          </Typography>
                        </Box>
                        {renderProgressBar(getCompletionStats(getFlatFields(matchedSections), inspectorData))}
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 3 }}>
                        {matchedSections.map((section) => {
                          const sectionFields = section.fields.filter((f) => {
                            if (section.name.toUpperCase().includes("SALA") || section.name.toUpperCase().includes("CAMA")) {
                              const label = f.label || f.name;
                              const uLabel = label.toUpperCase();
                              const isGenericLabel = uLabel.includes("CAMAS") || uLabel.includes("SALAS") || uLabel.includes("HABITACION") || (uLabel.includes("N") && uLabel.includes("DE"));
                              if (isGenericLabel && infraEfector && (infraEfector[srv.name] || infraEfector[srv.id])) return true;
                              return infraEfector && (infraEfector[label] > 0);
                            }
                            return true;
                          });
                          const sectionStats = getCompletionStats(sectionFields, inspectorData);

                          return (
                            <Box key={section.id} sx={{ mb: 4 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, borderBottom: "1px solid #f1f5f9", pb: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                                  {section.name}
                                </Typography>
                                {renderProgressBar(sectionStats)}
                              </Box>

                              {(section.name.includes("EQUIPAMIENTO") ||
                                section.name.includes("RECURSOS") ||
                                section.name.includes("RRHH") ||
                                section.name.includes("SALA") ||
                                section.name.includes("CAMA")) ? (
                                <VerificationTable
                                  fields={sectionFields}
                                  inspectorData={inspectorData}
                                  onChange={handleFieldChange}
                                  onOpenObs={handleOpenObsDialog}
                                  infraEfector={infraEfector}
                                  rrhhEfector={rrhhEfector}
                                  equiposEfector={equiposEfector}
                                  currentSrvName={srv.name}
                                />
                              ) : (
                                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 3 }}>
                                  {section.fields?.map((field) => (
                                    <FieldItem
                                      key={field.id}
                                      field={field}
                                      value={inspectorData[field.id]}
                                      onChange={handleFieldChange}
                                      infraEfector={infraEfector}
                                      serviciosEfector={serviciosEfector}
                                    />
                                  ))}
                                </Box>
                              )}
                            </Box>
                          );
                        })}
                      </AccordionDetails>
                    </Accordion>
                  )
                })}
              </Box>
            </AccordionDetails>
          </Accordion>

          <ObservationDialog
            open={obsDialog.open}
            label={obsDialog.label}
            value={obsDialog.value}
            onClose={() => setObsDialog({ ...obsDialog, open: false })}
            onSave={handleSaveObs}
          />

          <PhotoViewer
            open={!!viewerPhoto}
            photo={viewerPhoto}
            onClose={() => setViewerPhoto(null)}
          />

          {/* Resumen de Observaciones en Acordeón */}
          <Accordion
            defaultExpanded
            sx={{
              mt: 4,
              borderRadius: '16px !important',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              '&:before': { display: 'none' }
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#0ea5e9' }} />}>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%", pr: 2 }}>
                <Typography sx={{ fontWeight: 900, color: '#1e293b', fontSize: '1.25rem' }}>
                  RESUMEN DE OBSERVACIONES
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pb: 4, bgcolor: '#fcfcfc' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

                {/* Cuadro de Conclusión General (Estilo Acta 1/3) */}
                {generalObs && (
                  <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #FFE0B2', bgcolor: '#FFF9E6', display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <MessageIcon sx={{ color: '#92400e', mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 950, color: '#92400e', mb: 0.5, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Conclusión General de la Inspección
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#92400e', fontWeight: 600, lineHeight: 1.6, fontSize: '0.95rem' }}>
                        "{generalObs}"
                      </Typography>
                    </Box>
                  </Paper>
                )}

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box sx={{ bgcolor: '#0ea5e9', color: 'white', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <InfoIcon sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "#1e293b", fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                      OBSERVACIONES DE DATOS GENERALES
                    </Typography>
                  </Box>

                  <Paper variant="outlined" sx={{ overflow: 'hidden', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                    <Box sx={{ bgcolor: '#f8fafc', p: 1.5, borderBottom: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr auto', px: 3 }}>
                      <Typography variant="caption" sx={{ fontWeight: 900, color: '#64748b' }}>DETALLE DEL HALLAZGO / ELEMENTO</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 900, color: '#64748b' }}>EVIDENCIA</Typography>
                    </Box>
                    <Box sx={{ p: 0 }}>
                      {obsDatosGenerales.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                          <Typography sx={{ color: "#94a3b8", fontStyle: "italic", fontSize: "0.85rem" }}>No hay observaciones pendientes.</Typography>
                        </Box>
                      ) : (
                        <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                          {obsDatosGenerales.map((obs, idx) => (
                            <Box component="li" key={idx} sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: idx === obsDatosGenerales.length - 1 ? 'none' : '1px solid #f1f5f9',
                              py: 2,
                              px: 3,
                              '&:hover': { bgcolor: '#f8fafc' }
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Typography sx={{ fontWeight: 800, color: obs.type === 'ERROR' ? '#ef4444' : '#475569', fontSize: '0.85rem' }}>{obs.label}</Typography>
                                <Typography sx={{ fontWeight: 500, color: '#64748b', fontSize: '0.85rem' }}>: {obs.text}</Typography>
                              </Box>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  if (obs.hasPhoto) {
                                    setViewerPhoto(obs.photo);
                                  } else {
                                    setTargetPhotoField(obs.id);
                                    photoInputRef.current.click();
                                  }
                                }}
                                sx={{ ml: 1, color: obs.hasPhoto ? '#0ea5e9' : '#94a3b8', '&:hover': { color: '#0ea5e9' } }}
                              >
                                {obs.hasPhoto ? <VisibilityIcon sx={{ fontSize: 18 }} /> : <PhotoCamera sx={{ fontSize: 18 }} />}
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box sx={{ bgcolor: '#ef4444', color: 'white', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ReportProblemIcon sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "#1e293b", fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                      OBSERVACIONES DE DATOS DEL TRÁMITE
                    </Typography>
                  </Box>

                  <Paper variant="outlined" sx={{ overflow: 'hidden', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                    <Box sx={{ bgcolor: '#f8fafc', p: 1.5, borderBottom: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr auto', px: 3 }}>
                      <Typography variant="caption" sx={{ fontWeight: 900, color: '#64748b' }}>DETALLE TÉCNICO / SERVICIO</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 900, color: '#64748b' }}>EVIDENCIA</Typography>
                    </Box>
                    <Box sx={{ p: 0 }}>
                      {obsDatosTramite.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                          <Typography sx={{ color: "#94a3b8", fontStyle: "italic", fontSize: "0.85rem" }}>No hay observaciones pendientes.</Typography>
                        </Box>
                      ) : (
                        <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                          {obsDatosTramite.map((obs, idx) => (
                            <Box component="li" key={idx} sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: idx === obsDatosTramite.length - 1 ? 'none' : '1px solid #f1f5f9',
                              py: 2,
                              px: 3,
                              '&:hover': { bgcolor: '#f8fafc' }
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Chip
                                  label={obs.service}
                                  size="small"
                                  sx={{
                                    fontWeight: 900,
                                    fontSize: '0.6rem',
                                    bgcolor: '#f1f5f9',
                                    color: '#475569',
                                    height: 18,
                                    borderRadius: 1
                                  }}
                                />
                                <Typography sx={{ fontWeight: 800, color: obs.type === 'ERROR' ? '#ef4444' : '#475569', fontSize: '0.85rem' }}>{obs.label}</Typography>
                                <Typography sx={{ fontWeight: 500, color: '#64748b', fontSize: '0.85rem' }}>: {obs.text}</Typography>
                              </Box>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  if (obs.hasPhoto) {
                                    setViewerPhoto(obs.photo);
                                  } else {
                                    setTargetPhotoField(obs.id);
                                    photoInputRef.current.click();
                                  }
                                }}
                                sx={{ ml: 1, color: obs.hasPhoto ? '#0ea5e9' : '#94a3b8', '&:hover': { color: '#0ea5e9' } }}
                              >
                                {obs.hasPhoto ? <VisibilityIcon sx={{ fontSize: 18 }} /> : <PhotoCamera sx={{ fontSize: 18 }} />}
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Box>

              </Box>
            </AccordionDetails>
          </Accordion>

          <Box sx={{ mt: 5, mb: 2 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 950, color: "#1e293b", mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}
            >
              Observaciones Generales del Acta
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder="Escriba aquí la conclusión general de la inspección..."
              value={generalObs}
              onChange={(e) => setGeneralObs(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 4,
                  bgcolor: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  fontSize: '1rem',
                  fontWeight: 500,
                  "&:hover": { borderColor: "#cbd5e1" },
                  "&.Mui-focused": { borderColor: "#0ea5e9" },
                },
              }}
            />
          </Box>

          <Box sx={{ mt: 5, mb: 6 }}>
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Button
                variant="outlined"
                onClick={() => photoInputRef.current.click()}
                startIcon={<PhotoCamera />}
                sx={{
                  borderRadius: 4,
                  textTransform: "none",
                  fontWeight: 800,
                  px: 3,
                  py: 1.5,
                  borderColor: "#e2e8f0",
                  color: "#475569",
                  "&:hover": { bgcolor: "#f1f5f9", borderColor: "#cbd5e1" },
                }}
              >
                Abrir Cámara
              </Button>
              <input
                ref={photoInputRef}
                type="file"
                hidden
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
              />


            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5 }}>
              {attachments.map((file, idx) => (
                <Paper
                  key={idx}
                  elevation={0}
                  sx={{
                    p: 0.5,
                    borderRadius: 4,
                    position: "relative",
                    width: 110,
                    height: 110,
                    border: "2px solid #e2e8f0",
                    bgcolor: "#f8fafc",
                    overflow: "visible",
                  }}
                >
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "12px",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        p: 1,
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: "#64748b",
                          wordBreak: "break-all",
                          fontSize: "0.65rem",
                        }}
                      >
                        {file.name}
                      </Typography>
                    </Box>
                  )}
                  <IconButton
                    size="small"
                    onClick={() =>
                      setAttachments(attachments.filter((_, i) => i !== idx))
                    }
                    sx={{
                      position: "absolute",
                      top: -12,
                      right: -12,
                      bgcolor: "#ef4444",
                      color: "white",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      "&:hover": { bgcolor: "#dc2626" },
                      "& .MuiSvgIcon-root": { fontSize: 16 },
                    }}
                  >
                    <Close />
                  </IconButton>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Visualización de Firmas */}
          {(signatures.representative.data || signatures.inspector.data) && (
            <Box
              sx={{
                mb: 4,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 3,
                p: 3,
                bgcolor: "#f8fafc",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: 'block', mb: 1 }}
                >
                  Firma Responsable
                </Typography>
                <Box sx={{ height: 100, bgcolor: "white", borderRadius: 3, border: "1px solid #e2e8f0", overflow: 'hidden', mb: 1.5 }}>
                  {signatures.representative.data && <img src={signatures.representative.data} alt="firma responsable" style={{ height: '100%' }} />}
                </Box>
                <Typography sx={{ fontWeight: 900, color: '#1e293b', fontSize: '0.85rem' }}>
                  {signatures.representative.name || "---"}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block' }}>
                  Aclaración Responsable
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: 'block', mb: 1 }}
                >
                  Firma Inspector
                </Typography>
                <Box sx={{ height: 100, bgcolor: "white", borderRadius: 3, border: "1px solid #e2e8f0", overflow: 'hidden', mb: 1.5 }}>
                  {signatures.inspector.data && <img src={signatures.inspector.data} alt="firma inspector" style={{ height: '100%' }} />}
                </Box>
                <Typography sx={{ fontWeight: 900, color: '#1e293b', fontSize: '0.85rem' }}>
                  {signatures.inspector.name || "---"}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block' }}>
                  Inspector Interviniente
                </Typography>
              </Box>
            </Box>
          )}

          <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
            {!(signatures.representative.data && signatures.inspector.data) ? (
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => {
                  setSignatureStep(1);
                  setSignatureModalOpen(true);
                }}
                startIcon={<DriveFileRenameOutline />}
                sx={{
                  py: 2.5,
                  borderRadius: 8,
                  fontWeight: 900,
                  fontSize: "1.1rem",
                  color: "#0ea5e9",
                  border: "3px solid #0ea5e9",
                  "&:hover": {
                    border: "3px solid #0284c7",
                    bgcolor: "#f0f9ff",
                  },
                }}
              >
                FIRMAR ACTA
              </Button>
            ) : (
              <>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    py: 2.5,
                    borderRadius: 8,
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    bgcolor: "#059669",
                    boxShadow: "0 10px 15px -3px rgba(5, 150, 105, 0.3)",
                    "&:hover": { bgcolor: "#047857" },
                  }}
                >
                  APROBAR
                </Button>

                {hasObservations && (
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      py: 2.5,
                      borderRadius: 8,
                      fontWeight: 900,
                      fontSize: "1.1rem",
                      bgcolor: "#ef4444",
                      boxShadow: "0 10px 15px -3px rgba(239, 68, 68, 0.3)",
                      "&:hover": { bgcolor: "#dc2626" },
                    }}
                  >
                    NO APROBAR
                  </Button>
                )}
              </>
            )}
          </Stack>

        </>
      )}

      <SignatureModal
        open={signatureModalOpen}
        step={signatureStep}
        onClose={() => {
          setSignatureModalOpen(false);
          setSignatureStep(0);
        }}
        onSave={handleSaveSignature}
      />
    </Box>
  );
};




export default PantallaInspeccion;
