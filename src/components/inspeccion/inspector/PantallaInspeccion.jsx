import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  TextField,
  MenuItem,
  Stack,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  Switch,
  Snackbar,
  Alert,
  Grid,
  Checkbox
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Close from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import HomeIcon from "@mui/icons-material/Home";
import logoMinisterio from "../../../assets/logo/e1756780-3abd-4b92-a58c-ae3db6a864fe.jpeg";

import {
  normalize,
  getFlatFields,
  getCompletionStats,
} from "./components/utils";

import FieldItem from "./components/FieldItem";
import ServicesTable from "./components/ServicesTable";
import PlansTable from "./components/PlansTable";
import DocumentsTable from "./components/DocumentsTable";
import AggregatedInspectionTable from "./components/AggregatedInspectionTable";
import FileViewerModal from "./components/FileViewerModal";
import PhotoViewer from "./components/PhotoViewer";
import RevisionActaView from "./components/RevisionActaView";

// --- WIZARD STEPS DEFINITION ---
const WIZARD_STEPS = [
  { id: "DG", label: "Bioseguridad y Grales.", category: "A" },
  { id: "ARQ", label: "Paso Arquitectura", category: "B" },
  { id: "SRV", label: "Paso Servicios", category: "B" },
  { id: "EQP", label: "Paso Equipamiento", category: "B" },
  { id: "CAM", label: "Salas y Camas", category: "B" },
  { id: "RRHH", label: "Paso Personal", category: "B" },
  { id: "DOC", label: "Documentos Adjuntos", category: "B" },
  { id: "CIERRE", label: "Cierre y Firmas", category: "B" }
];

const PantallaInspeccion = ({
  serviciosEfector: propsServicios,
  infraEfector: propsInfra,
  rrhhEfector: propsRrhh,
  jefesEfector: propsJefes,
  equiposEfector: propsEquipos,
}) => {
  const { id } = useParams(); // Obtenemos el ID de la inspección desde la URL (ej: inspeccion_allende)
  const navigate = useNavigate();

  // --- PERSISTENCIA DINÁMICA SEGÚN EL ID DEL ESTABLECIMIENTO ---
  const dataKey = id ? `inspector_data_${id}` : "inspector_data";
  const genObsKey = id ? `obs_datos_generales_${id}` : "obs_datos_generales";
  const traObsKey = id ? `obs_datos_tramite_${id}` : "obs_datos_tramite";
  const manualObsKey = id ? `general_obs_${id}` : "general_obs";
  const photosKey = id ? `inspector_photos_by_component_${id}` : "inspector_photos_by_component";
  const stepKey = id ? `current_step_${id}` : "current_step";
  const cidiLevelKey = id ? `cidi_level_${id}` : "cidi_level";
  const cuilKey = id ? `cuil_responsable_${id}` : "cuil_responsable";
  const signaturesKey = id ? `signatures_${id}` : "signatures";
  const testigosKey = id ? `testigos_${id}` : "testigos";
  const negativaKey = id ? `negativa_firma_${id}` : "negativa_firma";

  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);
  
  const [inspectorData, setInspectorData] = useState({});
  const [viewerFile, setViewerFile] = useState(null);
  const [obsDatosGenerales, setObsDatosGenerales] = useState([]);
  const [obsDatosTramite, setObsDatosTramite] = useState([]);
  const [generalObs, setGeneralObs] = useState("");
  const [attachments, setAttachments] = useState([]);
  
  // Paso actual del Wizard
  const [currentStep, setCurrentStep] = useState(0);

  // Evidencia Fotográfica Transversal por ID de Componente
  const [photosByComponent, setPhotosByComponent] = useState({});
  
  // Modal de Fotos
  const [photoManagerField, setPhotoManagerField] = useState(null);

  // Bottom Sheet para Trigger Forzado (Bioseguridad)
  const [forcedModal, setForcedModal] = useState({ open: false, fieldId: null, label: "" });

  // Control de CiDi y CUIL
  const [cuilResponsable, setCuilResponsable] = useState("");
  const [cidiLevel, setCidiLevel] = useState(null); // null, 1, 2
  const [cidiChecking, setCidiChecking] = useState(false);
  const [cidiBlocked, setCidiBlocked] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Testigos y Negativa a Firmar
  const [negativaFirma, setNegativaFirma] = useState(false);
  const [testigos, setTestigos] = useState({
    t1: { cuil: "", nombre: "", firma: null },
    t2: { cuil: "", nombre: "", firma: null }
  });

  const [signatures, setSignatures] = useState({
    representative: { data: null, name: "" },
    inspector: { data: null, name: "" },
  });

  const [activeView, setActiveView] = useState("INSPECCION"); // "REVISION" o "INSPECCION"
  const [historyAnchorEl, setHistoryAnchorEl] = useState(null);
  const historyMenuOpen = Boolean(historyAnchorEl);

  const [autoFillAnchorEl, setAutoFillAnchorEl] = useState(null);
  const autoFillMenuOpen = Boolean(autoFillAnchorEl);

  const [closeActaModalOpen, setCloseActaModalOpen] = useState(false);
  const [closeActaAction, setCloseActaAction] = useState(""); 
  const [closeActaNote, setCloseActaNote] = useState("");

  const [serviciosEfector, setServiciosEfector] = useState([]);
  const [infraEfector, setInfraEfector] = useState({});
  const [rrhhEfector, setRrhhEfector] = useState([]);
  const [equiposEfector, setEquiposEfector] = useState([]);
  const [tipologia, setTipologia] = useState("CLÍNICAS, SANATORIOS Y HOSPITALES");
  
  // DT y Nombre cargados dinámicamente desde caché de HomeInspector
  const [efectorNombre, setEfectorNombre] = useState("SANATORIO ALLENDE");
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
        const nSrvName = normalize(s.name || "");
        const nEffSrv = normalize(effSrv || "");

        if (nSrvName === nEffSrv) return true;
        
        if (nSrvName.includes(nEffSrv) || nEffSrv.includes(nSrvName)) {
           const isPed = (str) => str.includes("PEDIAT") || str.includes("UTIP");
           const isNeo = (str) => str.includes("NEONAT") || str.includes("UTIN");
           const isUco = (str) => str.includes("CORONARI") || str.includes("UCO");
           
           if (isPed(nSrvName) !== isPed(nEffSrv)) return false;
           if (isNeo(nSrvName) !== isNeo(nEffSrv)) return false;
           if (isUco(nSrvName) !== isUco(nEffSrv)) return false;

           return true;
        }

        const isQuir = (str) => str.includes("QUIR") || str.includes("PABELLON");
        if (isQuir(nSrvName) && isQuir(nEffSrv)) return true;
        
        return false;
      });
    }) || [];
  }, [config, serviciosEfector, infraEfector]);

  // Cargar caché local e inicializaciones según el ID de establecimiento
  useEffect(() => {
    // Cargar Plus Jakarta Sans
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    const loadFromCache = () => {
      const cachedSrv = localStorage.getItem("efector_servicios");
      const cachedInfra = localStorage.getItem("efector_infra");
      const cachedRrhh = localStorage.getItem("efector_rrhh");
      const cachedJefes = localStorage.getItem("efector_jefes");
      const cachedEquipos = localStorage.getItem("efector_equipos");
      
      const cachedTipo = localStorage.getItem("efector_tipo");
      const cachedDT = localStorage.getItem("efector_dt");
      const cachedNombre = localStorage.getItem("efector_nombre");

      if (cachedSrv) setServiciosEfector(JSON.parse(cachedSrv));
      if (cachedInfra) setInfraEfector(JSON.parse(cachedInfra));
      
      let rrhhList = [];
      if (cachedRrhh) rrhhList = JSON.parse(cachedRrhh);
      if (cachedJefes) {
        const jefes = JSON.parse(cachedJefes);
        rrhhList = [...rrhhList, ...jefes.map(j => ({ ...j, isJefe: true }))];
      }
      setRrhhEfector(rrhhList);

      if (cachedEquipos) setEquiposEfector(JSON.parse(cachedEquipos));
      if (cachedTipo) setTipologia(cachedTipo);
      if (cachedDT) setDirectorTecnico(JSON.parse(cachedDT));
      if (cachedNombre) setEfectorNombre(cachedNombre);
    };

    if (propsServicios) {
      setServiciosEfector(propsServicios);
      setInfraEfector(propsInfra || {});
      
      let rrhhList = propsRrhh || [];
      if (propsJefes) {
        rrhhList = [...rrhhList, ...propsJefes.map(j => ({ ...j, isJefe: true }))];
      }
      setRrhhEfector(rrhhList);
      setEquiposEfector(propsEquipos || []);
    } else {
      loadFromCache();
    }

    // Carga de estados de inspección específicos del ID
    const savedData = localStorage.getItem(dataKey);
    const savedGenObs = localStorage.getItem(genObsKey);
    const savedTraObs = localStorage.getItem(traObsKey);
    const savedManualObs = localStorage.getItem(manualObsKey);
    const savedPhotos = localStorage.getItem(photosKey);
    const savedStep = localStorage.getItem(stepKey);
    const savedCidi = localStorage.getItem(cidiLevelKey);
    const savedCuil = localStorage.getItem(cuilKey);
    const savedSignatures = localStorage.getItem(signaturesKey);
    const savedTestigos = localStorage.getItem(testigosKey);
    const savedNegativa = localStorage.getItem(negativaKey);

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
    
    if (savedPhotos) {
      try { setPhotosByComponent(JSON.parse(savedPhotos)); } catch (e) { setPhotosByComponent({}); }
    } else {
      setPhotosByComponent({});
    }

    if (savedStep) setCurrentStep(Number(savedStep));
    else setCurrentStep(0);

    if (savedCidi) setCidiLevel(Number(savedCidi));
    else setCidiLevel(null);

    if (savedCuil) setCuilResponsable(savedCuil);
    else setCuilResponsable("");

    if (savedSignatures) setSignatures(JSON.parse(savedSignatures));
    else setSignatures({ representative: { data: null, name: "" }, inspector: { data: null, name: "" } });

    if (savedTestigos) setTestigos(JSON.parse(savedTestigos));
    else setTestigos({ t1: { cuil: "", nombre: "", firma: null }, t2: { cuil: "", nombre: "", firma: null } });

    if (savedNegativa) setNegativaFirma(savedNegativa === "true");
    else setNegativaFirma(false);

    const handleStorageChange = (e) => {
      if (e.key?.startsWith("efector_")) {
        loadFromCache();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [propsServicios, propsInfra, propsRrhh, propsEquipos, id, dataKey]);

  // Persistir datos específicos por ID
  useEffect(() => {
    if (Object.keys(inspectorData).length > 0) {
      localStorage.setItem(dataKey, JSON.stringify(inspectorData));
    }
  }, [inspectorData, dataKey]);

  useEffect(() => {
    localStorage.setItem(manualObsKey, generalObs);
  }, [generalObs, manualObsKey]);

  useEffect(() => {
    localStorage.setItem(photosKey, JSON.stringify(photosByComponent));
  }, [photosByComponent, photosKey]);

  useEffect(() => {
    localStorage.setItem(stepKey, String(currentStep));
  }, [currentStep, stepKey]);

  useEffect(() => {
    if (cidiLevel !== null) localStorage.setItem(cidiLevelKey, String(cidiLevel));
    else localStorage.removeItem(cidiLevelKey);
  }, [cidiLevel, cidiLevelKey]);

  useEffect(() => {
    localStorage.setItem(cuilKey, cuilResponsable);
  }, [cuilResponsable, cuilKey]);

  useEffect(() => {
    localStorage.setItem(signaturesKey, JSON.stringify(signatures));
  }, [signatures, signaturesKey]);

  useEffect(() => {
    localStorage.setItem(testigosKey, JSON.stringify(testigos));
  }, [testigos, testigosKey]);

  useEffect(() => {
    localStorage.setItem(negativaKey, String(negativaFirma));
  }, [negativaFirma, negativaKey]);

  // Sincronización de sumarios de observaciones
  useEffect(() => {
    if (!config) return;

    const extractValue = (val) => (val && typeof val === 'object' && !Array.isArray(val) ? val.value : val);
    const extractObs = (val) => (val && typeof val === 'object' && !Array.isArray(val) ? val.obs : "");

    // 1. Datos Generales
    let genSummary = [];
    const genFields = datosGeneralesSrv?.sections
      ? getFlatFields(datosGeneralesSrv.sections)
      : datosGeneralesSrv?.fields || [];

    genFields.forEach(f => {
      const fieldData = inspectorData[f.id];
      const val = extractValue(fieldData);
      const obs = extractObs(fieldData);
      const hasPhoto = photosByComponent[f.id] && photosByComponent[f.id].length > 0;

      if ((f.type === 'boolean' || f.type === 'checkbox') && val === false) {
        genSummary.push({ id: f.id, label: f.label, text: `NO CUMPLE${obs ? ` (${obs})` : ''}`, type: 'ERROR', hasPhoto });
      } else if (obs) {
        genSummary.push({ id: f.id, label: f.label, text: obs, type: 'OBS', hasPhoto });
      }
    });
    setObsDatosGenerales(genSummary);

    // 2. Datos Trámite
    let traSummary = [];
    let emplazamientos = [];

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
        const hasPhoto = photosByComponent[f.id] && photosByComponent[f.id].length > 0;

        if ((f.type === 'boolean' || f.type === 'checkbox') && val === false) {
          traSummary.push({ id: f.id, label: f.label, service: srv.name, text: `NO CUMPLE${obs ? ` (${obs})` : ''}`, type: 'ERROR', hasPhoto });
        } else if (obs && !isDoc) {
          traSummary.push({ id: f.id, label: f.label, service: srv.name, text: obs, type: 'OBS', hasPhoto });
        }

        const isCamaSala = f.label?.toUpperCase().includes('CAMA') || f.label?.toUpperCase().includes('SALA') || f.label?.toUpperCase().includes('HABITACIÓN');
        if (isCamaSala && typeof val === 'number') {
          const declarado = infraEfector[f.label] || 0;
          if (val > declarado) {
            isIrregularidadTramite = true;
            razonIrregular = `Cantidad superior a la declarada (${val} vs ${declarado})`;
          }
        }

        const isEquip = f.label?.toUpperCase().includes('EQUIPO') || f.label?.toUpperCase().includes('EQUIPAMIENTO') || f.id?.includes('eq');
        if (isEquip && typeof val === 'number') {
          const equipoMatch = equiposEfector?.filter(e => e.equipamiento === f.label && e.origen === srv.name) || [];
          const declarado = equipoMatch.reduce((acc, curr) => acc + (curr.actualQty || 1), 0);
          if (val < declarado) {
            isIrregularidadTramite = true;
            razonIrregular = `Faltante de equipamiento (${val} de ${declarado} requeridos)`;
          }
        }

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
            estado: "PENDIENTE"
          });
        }
      });
    });

    Object.keys(inspectorData).forEach(key => {
      if (key.startsWith('plan_auth_') || key.startsWith('doc_auth_') || key.startsWith('infra_literal_') || key === 'dt_presente_fisico') {
        const data = inspectorData[key];
        const isPlan = key.startsWith('plan_auth_');
        const isDoc = key.startsWith('doc_auth_');
        const isInfra = key.startsWith('infra_literal_');
        const hasPhoto = photosByComponent[key] && photosByComponent[key].length > 0;

        if (data && (data.observado || data.obs || data.coincideRealidad === false || data.existe === false)) {
          if (traSummary.find(item => item.id === key)) return;

          let label = "";
          let service = "";

          if (isPlan) {
            label = `PLANO: ${key.replace('plan_auth_', '').replace(/_/g, '.')}`;
            service = "ARQUITECTURA";
          } else if (isDoc) {
            label = `DOCUMENTO: ${key.replace('doc_auth_', '').replace(/_/g, ' ')}`;
            service = "DOCUMENTACIÓN";
          } else if (isInfra) {
            label = key.replace('infra_literal_', '').replace(/_/g, ' ');
            service = "SALAS Y CAMAS";
          } else if (key === 'dt_presente_fisico') {
            label = "DIRECTOR TÉCNICO AUSENTE";
            service = "RECURSOS HUMANOS";
          }

          traSummary.push({
            id: key,
            label,
            service,
            text: data.obs || "INCOMPATIBLE / NO CUMPLE",
            type: 'OBS',
            hasPhoto
          });
        }
      }
    });

    setObsDatosGenerales(genSummary);
    setObsDatosTramite(traSummary);
    localStorage.setItem(genObsKey, JSON.stringify(genSummary));
    localStorage.setItem(traObsKey, JSON.stringify(traSummary));
    localStorage.setItem(`inspector_emplazamientos_${id || "default"}`, JSON.stringify(emplazamientos));
  }, [inspectorData, config, datosGeneralesSrv, otherServices, photosByComponent, id, genObsKey, traObsKey]);

  const hasObservations =
    (obsDatosGenerales?.length || 0) > 0 ||
    (obsDatosTramite?.length || 0) > 0 ||
    (generalObs || "").trim().length > 0;

  const getFormatoInspeccion = () => {
    if (!config) return "PRESENCIAL";
    let formatoId = null;
    config.servicios?.forEach(srv => {
      const srvFields = srv.sections ? getFlatFields(srv.sections) : srv.fields || [];
      srvFields.forEach(f => {
        if (f.label && f.label.toUpperCase().includes("FORMATO INSPECCIÓN")) {
          formatoId = f.id;
        }
      });
    });
    
    if (formatoId && inspectorData[formatoId]) {
       const val = typeof inspectorData[formatoId] === 'object' ? inspectorData[formatoId].value : inspectorData[formatoId];
       if (typeof val === 'string') return val.toUpperCase();
    }
    return "PRESENCIAL";
  };

  const actualFormatoInspeccion = getFormatoInspeccion();

  // Carga de configuración de la API mock
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

  // Manejo de cambios de campos
  const handleFieldChange = (fieldId, newValue) => {
    const fieldObj = datosGeneralesSrv?.sections 
      ? getFlatFields(datosGeneralesSrv.sections).find(f => f.id === fieldId) 
      : datosGeneralesSrv?.fields?.find(f => f.id === fieldId);
    
    const isBioseguridad = fieldObj && (fieldObj.type === "boolean" || fieldObj.type === "checkbox");
    
    if (isBioseguridad && newValue === false) {
      setForcedModal({
        open: true,
        fieldId,
        label: fieldObj.label
      });
      return;
    }

    setInspectorData((prev) => {
      const current = prev[fieldId] || {};
      if (newValue && typeof newValue === 'object' && !Array.isArray(newValue)) {
        return { ...prev, [fieldId]: { ...current, ...newValue } };
      }
      return { ...prev, [fieldId]: { ...current, value: newValue } };
    });
  };

  // Guardado de Trigger Forzado (Modal)
  const handleSaveForcedObs = (fieldId, text, photosArray) => {
    setInspectorData((prev) => ({
      ...prev,
      [fieldId]: { value: false, obs: text, observado: true }
    }));
    
    if (photosArray.length > 0) {
      setPhotosByComponent(prev => ({
        ...prev,
        [fieldId]: photosArray
      }));
    }

    setForcedModal({ open: false, fieldId: null, label: "" });
  };

  // Cancelado de Trigger Forzado: se revierte a SÍ (true)
  const handleCancelForcedObs = () => {
    const fid = forcedModal.fieldId;
    setInspectorData((prev) => ({
      ...prev,
      [fid]: { value: true, obs: "", observado: false }
    }));
    setForcedModal({ open: false, fieldId: null, label: "" });
  };

  // Simulación de cruce de datos CiDi
  const handleVerifyCidi = () => {
    if (!cuilResponsable) return;
    setCidiChecking(true);
    setTimeout(() => {
      setCidiChecking(false);
      const lastChar = cuilResponsable.slice(-1);
      if (lastChar === "2") {
        setCidiLevel(2);
        setCidiBlocked(false);
      } else {
        setCidiLevel(1);
        setCidiBlocked(true);
        setSnackbarOpen(true);
      }
    }, 1500);
  };

  const handleOpenCloseActa = (action) => {
    setCloseActaAction(action);
    setCloseActaNote("");
    setCloseActaModalOpen(true);
  };

  const handleHistoryClick = (event) => {
    setHistoryAnchorEl(event.currentTarget);
  };
  const handleHistoryClose = () => {
    setHistoryAnchorEl(null);
  };

  const handleAutoFillClick = (event) => {
    setAutoFillAnchorEl(event.currentTarget);
  };
  const handleAutoFillClose = () => {
    setAutoFillAnchorEl(null);
  };

  const handleAutoFill = (mode) => {
    if (!config) return;
    handleAutoFillClose();
    
    const newInspectorData = { ...inspectorData };
    let hasOneObs = false;

    const fillFields = (fields) => {
      fields.forEach((f, idx) => {
        let value = null;
        let obs = "";

        if (f.type === "boolean" || f.type === "checkbox") {
          value = true;
          if (mode === "many" && idx % 7 === 0) {
            value = false;
            obs = "No cumple con bioseguridad básica.";
          } else if (mode === "one" && !hasOneObs) {
            value = false;
            obs = "Observación de prueba.";
            hasOneObs = true;
          }
        } else if (f.type === "text" || f.type === "textarea") {
          value = "Datos completados";
        } else if (f.type === "number") {
          value = 3;
        } else if (f.type === "select" || f.type === "radio" || f.type === "toggle") {
          value = "Si";
        } else if (f.type === "date") {
          value = new Date().toISOString().split('T')[0];
        }

        if (value !== null) {
          newInspectorData[f.id] = { value, obs };
        }
      });
    };

    if (datosGeneralesSrv) {
      const genFields = datosGeneralesSrv.sections
        ? getFlatFields(datosGeneralesSrv.sections)
        : datosGeneralesSrv.fields || [];
      fillFields(genFields);
    }

    otherServices.forEach(srv => {
      const srvFields = srv.sections
        ? getFlatFields(srv.sections)
        : srv.fields || [];
      fillFields(srvFields);
    });

    setInspectorData(newInspectorData);
  };

  // --- RENDER FIRMAS EMBEBIDAS PARA CIERRE ---
  const SignaturePad = ({ label, onSave, onClear }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSigned, setHasSigned] = useState(false);

    useEffect(() => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.strokeStyle = "#0f172a";
      }
    }, []);

    const getPointerPos = (e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const startDrawing = (e) => {
      const { x, y } = getPointerPos(e);
      const ctx = canvasRef.current.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
      if (e.touches) e.preventDefault();
    };

    const draw = (e) => {
      if (!isDrawing) return;
      const { x, y } = getPointerPos(e);
      const ctx = canvasRef.current.getContext("2d");
      ctx.lineTo(x, y);
      ctx.stroke();
      if (e.touches) e.preventDefault();
    };

    const stopDrawing = () => {
      if (isDrawing) {
        canvasRef.current.getContext("2d").closePath();
        setIsDrawing(false);
        setHasSigned(true);
        onSave(canvasRef.current.toDataURL());
      }
    };

    const clear = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSigned(false);
      onClear();
    };

    return (
      <Card variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: "white", textAlign: "center", position: "relative" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, color: "#475569", textTransform: "uppercase", fontSize: "0.75rem" }}>
          {label}
        </Typography>
        <Box 
          sx={{ 
            border: "2px dashed #cbd5e1", 
            borderRadius: 2, 
            height: 120, 
            position: "relative",
            bgcolor: "#f8fafc",
            touchAction: "none"
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        >
          <canvas ref={canvasRef} width={280} height={120} style={{ width: "100%", height: "100%" }} />
          {!hasSigned && (
            <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, letterSpacing: 0.5 }}>
                FIRME CON EL DEDO AQUÍ
              </Typography>
            </Box>
          )}
        </Box>
        <Button size="small" color="error" onClick={clear} sx={{ mt: 1, fontWeight: 800, textTransform: "none" }}>
          Limpiar trazo
        </Button>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        bgcolor: "#f4f6fa",
        background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
        overflowX: "hidden",
        mx: "auto",
        maxWidth: "none",
        px: { xs: 3, sm: 6 },
        pt: 4,
        pb: 8,
        position: "relative",
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif"
      }}
    >
      {/* HARD BLOCK OVERLAY DE CIDI PRIVADO */}
      {cidiBlocked && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(15, 23, 42, 0.95)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
            textAlign: "center",
            borderRadius: 4
          }}
        >
          <Box sx={{ bgcolor: "#ef4444", color: "white", p: 3, borderRadius: "50%", mb: 3 }}>
            <LockIcon sx={{ fontSize: 60 }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 950, color: "white", mb: 2 }}>
            SISTEMA BLOQUEADO
          </Typography>
          <Typography variant="body1" sx={{ color: "#cbd5e1", maxWidth: 500, mb: 4, lineHeight: 1.6, fontWeight: 600 }}>
            El Responsable del Establecimiento debe contar con <b>Ciudadano Digital Nivel 2 verificado</b> para firmar el acta.
          </Typography>
          <Paper variant="outlined" sx={{ p: 2.5, mb: 4, bgcolor: "#1e293b", borderColor: "#334155", color: "white", textAlign: "left" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, color: "#f87171" }}>
              INFORMACIÓN DETALLADA (API CiDi):
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: "monospace", display: "block" }}>
              CUIL Responsable: {cuilResponsable}<br />
              Nivel de Ciudadano Digital: Nivel 1 (No verificado)<br />
              Estado de Firma: Inhabilitada permanentemente
            </Typography>
          </Paper>
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              setCidiBlocked(false);
              setCidiLevel(null);
              setCuilResponsable("");
            }}
            sx={{ fontWeight: 900, px: 4, py: 1.5, borderRadius: 3 }}
          >
            Volver a Validar CUIL
          </Button>
        </Box>
      )}

      {/* HEADER PRINCIPAL REVERSIONADO */}
      <Box sx={{ mb: 5, borderBottom: "1px solid rgba(226, 232, 240, 0.8)", pb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 3 }}>
          <Box>
            {/* Breadcrumb / Back Link */}
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/inspector")}
              sx={{ 
                color: "#64748b", 
                fontWeight: 750, 
                fontSize: "0.85rem", 
                p: 0, 
                mb: 1.5,
                minWidth: 0,
                textTransform: "none",
                "&:hover": { bgcolor: "transparent", color: "#0284c7" }
              }}
            >
              Volver al Panel
            </Button>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 900, 
                color: "#0f172a", 
                letterSpacing: "-1.5px", 
                lineHeight: 1.1,
                fontSize: { xs: "2.2rem", sm: "2.8rem" },
                mb: 1
              }}
            >
              {efectorNombre}
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.95rem" }}>
              {tipologia} • DT: <Box component="span" sx={{ fontWeight: 800, color: "#475569" }}>{directorTecnico.nombre} {directorTecnico.apellido}</Box>
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <img 
              src={logoMinisterio} 
              alt="Logo Ministerio" 
              style={{ height: 48, objectFit: "contain", marginRight: 8 }}
            />
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={handleAutoFillClick}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{ fontWeight: 'bold', borderRadius: 2 }}
            >
              Autocompletar
            </Button>
            <Menu
              anchorEl={autoFillAnchorEl}
              open={autoFillMenuOpen}
              onClose={handleAutoFillClose}
            >
              <MenuItem onClick={() => handleAutoFill("none")}>Operativo sin observaciones</MenuItem>
              <MenuItem onClick={() => handleAutoFill("one")}>Con una observación</MenuItem>
              <MenuItem onClick={() => handleAutoFill("many")}>Con múltiples irregularidades</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>

      {/* SELECTOR DE HISTORIAL Y VISTAS */}
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
          startIcon={<HistoryIcon sx={{ color: '#0090d0' }} />}
          endIcon={historyMenuOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          sx={{
            bgcolor: historyMenuOpen ? 'white' : 'transparent',
            borderRadius: 5,
            px: 2.5,
            py: 0.8,
            fontWeight: 900,
            color: '#0090d0',
            boxShadow: historyMenuOpen ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            fontSize: '0.8rem',
            '&:hover': { bgcolor: historyMenuOpen ? '#ffffff' : 'rgba(0,0,0,0.04)' }
          }}
        >
          HISTORIAL
        </Button>

        <Menu
          anchorEl={historyAnchorEl}
          open={historyMenuOpen}
          onClose={handleHistoryClose}
        >
          <MenuItem onClick={handleHistoryClose} sx={{ color: '#0090d0 !important' }}>ACTA 1 - APROBADO</MenuItem>
          <MenuItem onClick={handleHistoryClose}>ACTA 2 - IRREGULAR</MenuItem>
        </Menu>

        <Button
          variant="text"
          onClick={() => setActiveView("REVISION")}
          sx={{
            flex: 1,
            borderRadius: 5,
            fontWeight: 900,
            py: 0.8,
            color: activeView === "REVISION" ? "#0f172a" : "#64748b",
            bgcolor: activeView === "REVISION" ? "white" : "transparent",
            boxShadow: activeView === "REVISION" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            fontSize: '0.8rem',
            '&:hover': { bgcolor: activeView === "REVISION" ? 'white' : 'rgba(0,0,0,0.04)' }
          }}
        >
          REVISIÓN DE RESUMEN
        </Button>
        <Button
          variant="text"
          onClick={() => setActiveView("INSPECCION")}
          sx={{
            flex: 1,
            borderRadius: 5,
            fontWeight: 900,
            py: 0.8,
            color: activeView === "INSPECCION" ? "#0f172a" : "#64748b",
            bgcolor: activeView === "INSPECCION" ? "white" : "transparent",
            boxShadow: activeView === "INSPECCION" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            fontSize: '0.8rem',
            '&:hover': { bgcolor: activeView === "INSPECCION" ? 'white' : 'rgba(0,0,0,0.04)' }
          }}
        >
          ASISTENTE DE INSPECCIÓN
        </Button>
      </Box>

      {/* VIEW REVISION */}
      {activeView === "REVISION" ? (
        <RevisionActaView
          obsGenerales={obsDatosGenerales}
          obsTramite={obsDatosTramite}
        />
      ) : (
        /* VIEW INSPECCION (MOBILE WIZARD FLOW) */
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          
          {/* HEADER DUAL (APARTADO A / APARTADO B SEGMENTED CONTROL) */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 1 }}>
            <Button
              variant="contained"
              onClick={() => setCurrentStep(0)}
              sx={{
                py: 2,
                borderRadius: 4,
                fontWeight: 900,
                fontSize: "0.85rem",
                bgcolor: WIZARD_STEPS[currentStep].category === "A" ? "#0090d0" : "#cbd5e1",
                color: WIZARD_STEPS[currentStep].category === "A" ? "white" : "#64748b",
                "&:hover": { bgcolor: WIZARD_STEPS[currentStep].category === "A" ? "#007bb0" : "#94a3b8" }
              }}
            >
              APARTADO A: DATOS GENERALES
            </Button>
            <Button
              variant="contained"
              onClick={() => setCurrentStep(1)}
              sx={{
                py: 2,
                borderRadius: 4,
                fontWeight: 900,
                fontSize: "0.85rem",
                bgcolor: WIZARD_STEPS[currentStep].category === "B" ? "#0090d0" : "#cbd5e1",
                color: WIZARD_STEPS[currentStep].category === "B" ? "white" : "#64748b",
                "&:hover": { bgcolor: WIZARD_STEPS[currentStep].category === "B" ? "#007bb0" : "#94a3b8" }
              }}
            >
              APARTADO B: DATOS TRÁMITE
            </Button>
          </Box>

          {/* STEPPER PROGRESS BAR */}
          <Box sx={{ bgcolor: "#f8fafc", p: 2, borderRadius: 3, border: "1px solid #e2e8f0" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: "#475569" }}>
                PASO {currentStep + 1} DE {WIZARD_STEPS.length}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 950, color: "#0090d0" }}>
                {WIZARD_STEPS[currentStep].label.toUpperCase()}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={((currentStep + 1) / WIZARD_STEPS.length) * 100}
              sx={{ height: 8, borderRadius: 4, bgcolor: "#cbd5e1", "& .MuiLinearProgress-bar": { bgcolor: "#0090d0" } }}
            />
          </Box>

          {/* STEP CONTROLLER RENDERING */}
          <Box sx={{ minHeight: 350, pt: 1 }}>
            
            {/* PASO 0: DATOS GENERALES (APARTADO A) */}
            {currentStep === 0 && datosGeneralesSrv && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: "#1e293b", borderLeft: "4px solid #0090d0", pl: 1.5 }}>
                  Formulario de Bioseguridad y Estado General
                </Typography>

                {datosGeneralesSrv.sections ? (
                  datosGeneralesSrv.sections.map((sec, sIdx) => (
                    <Paper key={sIdx} variant="outlined" sx={{ p: 3, borderRadius: 4, borderColor: "#e2e8f0" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "#475569", textTransform: "uppercase", fontSize: "0.8rem", mb: 2, borderBottom: "1px solid #f1f5f9", pb: 1 }}>
                        {sec.name}
                      </Typography>
                      
                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
                        {sec.fields.map((field) => (
                          <FieldItem
                            key={field.id}
                            field={field}
                            value={inspectorData[field.id]}
                            onChange={handleFieldChange}
                            onOpenObs={(fid, lbl, val) => handleFieldChange(fid, { value: false, obs: val })}
                            photos={photosByComponent[field.id]}
                            onOpenPhotos={(fid, lbl) => setPhotoManagerField({ id: fid, label: lbl })}
                          />
                        ))}
                      </Box>
                    </Paper>
                  ))
                ) : (
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
                      {datosGeneralesSrv.fields?.map((field) => (
                        <FieldItem
                          key={field.id}
                          field={field}
                          value={inspectorData[field.id]}
                          onChange={handleFieldChange}
                          photos={photosByComponent[field.id]}
                          onOpenPhotos={(fid, lbl) => setPhotoManagerField({ id: fid, label: lbl })}
                        />
                      ))}
                    </Box>
                  </Paper>
                )}
              </Box>
            )}

            {/* PASO 1: ARQUITECTURA */}
            {currentStep === 1 && (
              <PlansTable
                inspectorData={inspectorData}
                onChange={handleFieldChange}
                onOpenViewer={setViewerFile}
                onOpenPhotos={(fid, lbl) => setPhotoManagerField({ id: fid, label: lbl })}
                photosByComponent={photosByComponent}
              />
            )}

            {/* PASO 2: SERVICIOS */}
            {currentStep === 2 && (
              <ServicesTable
                inspectorData={inspectorData}
                onChange={handleFieldChange}
                serviciosEfector={serviciosEfector}
                onOpenPhotos={(fid, lbl) => setPhotoManagerField({ id: fid, label: lbl })}
                photosByComponent={photosByComponent}
              />
            )}

            {/* PASO 3: EQUIPAMIENTO */}
            {currentStep === 3 && (
              <AggregatedInspectionTable
                category="EQUIPAMIENTO"
                services={otherServices}
                inspectorData={inspectorData}
                equiposEfector={equiposEfector}
                onChange={handleFieldChange}
                onOpenPhotos={(fid, lbl) => setPhotoManagerField({ id: fid, label: lbl })}
                photosByComponent={photosByComponent}
              />
            )}

            {/* PASO 4: SALAS Y CAMAS */}
            {currentStep === 4 && (
              <AggregatedInspectionTable
                category="SALAS Y CAMAS"
                services={otherServices}
                inspectorData={inspectorData}
                infraEfector={infraEfector}
                onChange={handleFieldChange}
                onOpenPhotos={(fid, lbl) => setPhotoManagerField({ id: fid, label: lbl })}
                photosByComponent={photosByComponent}
              />
            )}

            {/* PASO 5: PERSONAL */}
            {currentStep === 5 && (
              <AggregatedInspectionTable
                category="RECURSOS HUMANOS"
                services={otherServices}
                inspectorData={inspectorData}
                rrhhEfector={rrhhEfector}
                onChange={handleFieldChange}
                onOpenPhotos={(fid, lbl) => setPhotoManagerField({ id: fid, label: lbl })}
                photosByComponent={photosByComponent}
              />
            )}

            {/* PASO 6: DOCUMENTOS ADJUNTOS */}
            {currentStep === 6 && (
              <DocumentsTable
                inspectorData={inspectorData}
                onChange={handleFieldChange}
                onOpenPhotos={(fid, lbl) => setPhotoManagerField({ id: fid, label: lbl })}
                photosByComponent={photosByComponent}
              />
            )}

            {/* PASO 7: CIERRE Y FIRMAS */}
            {currentStep === 7 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                
                <Card variant="outlined" sx={{ p: 2.5, borderRadius: 3, border: "1px solid #bae6fd", bgcolor: "#f0f9ff" }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#0369a1" }}>
                    FORMATO DE INSPECCIÓN ACTUAL: <b>{actualFormatoInspeccion}</b>
                  </Typography>
                </Card>

                {actualFormatoInspeccion === "VIRTUAL" ? (
                  <Card variant="outlined" sx={{ p: 3, borderRadius: 4, textAlign: "center", bgcolor: "#f8fafc" }}>
                    <VerifiedUserIcon sx={{ fontSize: 50, color: "#10b981", mb: 1.5 }} />
                    <Typography variant="h6" sx={{ fontWeight: 900, color: "#1e293b", mb: 1 }}>
                      Inspección Virtual Habilitada
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b", maxWidth: 500, mx: "auto", mb: 3 }}>
                      Las firmas físicas presenciales han sido diferidas. El cierre del acta se ejecutará mediante autenticación de token institucional.
                    </Typography>
                  </Card>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#f8fafc", p: 2, borderRadius: 3, border: "1px solid #e2e8f0" }}>
                      <Box>
                        <Typography sx={{ fontWeight: 900, color: "#1e293b", fontSize: "0.95rem" }}>
                          El Responsable se niega a firmar
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                          Active esta opción si el efector rechaza firmar el acta. Desbloqueará firmas de testigos.
                        </Typography>
                      </Box>
                      <Switch
                        checked={negativaFirma}
                        onChange={(e) => setNegativaFirma(e.target.checked)}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": { color: "#ef4444" },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#ef4444" }
                        }}
                      />
                    </Box>

                    {!negativaFirma ? (
                      <Card variant="outlined" sx={{ p: 3, borderRadius: 4, display: "flex", flexDirection: "column", gap: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "#1e293b" }}>
                          Validación CiDi del Responsable
                        </Typography>
                        
                        <Box sx={{ bgcolor: "#f8fafc", p: 1.5, borderRadius: 2, border: "1px dashed #cbd5e1", mb: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 900, color: "#64748b", display: "block", mb: 0.5 }}>
                            CUILs de simulación CiDi:
                          </Typography>
                          <Typography variant="caption" sx={{ display: "block" }}>
                            • <b>20-22222222-2</b>: CiDi Nivel 2 verificado (Éxito)
                          </Typography>
                          <Typography variant="caption" sx={{ display: "block" }}>
                            • <b>20-11111111-2</b>: CiDi Nivel 1 (Bloqueo de Interfaz)
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", gap: 2 }}>
                          <TextField
                            fullWidth
                            label="CUIL del Responsable"
                            placeholder="Ingrese CUIL del firmante"
                            value={cuilResponsable}
                            onChange={(e) => setCuilResponsable(e.target.value)}
                            size="small"
                          />
                          <Button
                            variant="contained"
                            onClick={handleVerifyCidi}
                            disabled={cidiChecking || !cuilResponsable}
                            sx={{ fontWeight: 900, px: 3, bgcolor: "#1e293b" }}
                          >
                            {cidiChecking ? <CircularProgress size={20} color="inherit" /> : "Validar"}
                          </Button>
                        </Box>

                        {cidiLevel === 2 && (
                          <Paper variant="outlined" sx={{ p: 2, bgcolor: "#def7ed", borderColor: "#10b98140", display: "flex", alignItems: "center", gap: 1.5 }}>
                            <CheckCircleIcon sx={{ color: "#10b981" }} />
                            <Box>
                              <Typography sx={{ fontWeight: 900, color: "#065f46", fontSize: "0.85rem" }}>
                                Responsable Verificado (CiDi Nivel 2)
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#065f46" }}>
                                {directorTecnico.nombre} {directorTecnico.apellido} - DNI {cuilResponsable.slice(3, 11)}
                              </Typography>
                            </Box>
                          </Paper>
                        )}
                      </Card>
                    ) : (
                      <Card variant="outlined" sx={{ p: 3, borderRadius: 4, display: "flex", flexDirection: "column", gap: 3, borderColor: "#fca5a5", bgcolor: "#fffbfa" }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "#b91c1c", display: "flex", alignItems: "center", gap: 0.5 }}>
                          <WarningIcon /> Firma de Testigos por Negativa de Responsable
                        </Typography>

                        {/* Testigo 1 */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, bgcolor: "white", p: 2, borderRadius: 2.5, border: "1px solid #fca5a540" }}>
                          <Typography variant="caption" sx={{ fontWeight: 900, color: "#334155" }}>DATOS TESTIGO 1</Typography>
                          <Grid container spacing={2}>
                            <Grid size={6}>
                              <TextField
                                label="Nombre y Apellido"
                                size="small"
                                fullWidth
                                value={testigos.t1.nombre}
                                onChange={(e) => setTestigos(prev => ({ ...prev, t1: { ...prev.t1, nombre: e.target.value } }))}
                              />
                            </Grid>
                            <Grid size={6}>
                              <TextField
                                label="CUIL Testigo 1"
                                size="small"
                                fullWidth
                                value={testigos.t1.cuil}
                                onChange={(e) => setTestigos(prev => ({ ...prev, t1: { ...prev.t1, cuil: e.target.value } }))}
                              />
                            </Grid>
                          </Grid>
                          <SignaturePad 
                            label="Firma Testigo 1"
                            onSave={(img) => setTestigos(prev => ({ ...prev, t1: { ...prev.t1, firma: img } }))}
                            onClear={() => setTestigos(prev => ({ ...prev, t1: { ...prev.t1, firma: null } }))}
                          />
                        </Box>

                        {/* Testigo 2 */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, bgcolor: "white", p: 2, borderRadius: 2.5, border: "1px solid #fca5a540" }}>
                          <Typography variant="caption" sx={{ fontWeight: 900, color: "#334155" }}>DATOS TESTIGO 2</Typography>
                          <Grid container spacing={2}>
                            <Grid size={6}>
                              <TextField
                                label="Nombre y Apellido"
                                size="small"
                                fullWidth
                                value={testigos.t2.nombre}
                                onChange={(e) => setTestigos(prev => ({ ...prev, t2: { ...prev.t2, nombre: e.target.value } }))}
                              />
                            </Grid>
                            <Grid size={6}>
                              <TextField
                                label="CUIL Testigo 2"
                                size="small"
                                fullWidth
                                value={testigos.t2.cuil}
                                onChange={(e) => setTestigos(prev => ({ ...prev, t2: { ...prev.t2, cuil: e.target.value } }))}
                              />
                            </Grid>
                          </Grid>
                          <SignaturePad 
                            label="Firma Testigo 2"
                            onSave={(img) => setTestigos(prev => ({ ...prev, t2: { ...prev.t2, firma: img } }))}
                            onClear={() => setTestigos(prev => ({ ...prev, t2: { ...prev.t2, firma: null } }))}
                          />
                        </Box>
                      </Card>
                    )}

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
                      {!negativaFirma && (
                        <SignaturePad
                          label="Firma Responsable del Establecimiento"
                          onSave={(img) => setSignatures(prev => ({ ...prev, representative: { data: img, name: `${directorTecnico.nombre} ${directorTecnico.apellido}` } }))}
                          onClear={() => setSignatures(prev => ({ ...prev, representative: { data: null, name: "" } }))}
                        />
                      )}

                      <SignaturePad
                        label="Firma Inspector Interviniente"
                        onSave={(img) => setSignatures(prev => ({ ...prev, inspector: { data: img, name: "ING. GUSTAVO SOSA" } }))}
                        onClear={() => setSignatures(prev => ({ ...prev, inspector: { data: null, name: "" } }))}
                      />
                    </Box>

                  </Box>
                )}

                {/* OBSERVACIONES GENERALES FINAL */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, color: "#1e293b" }}>
                    Observaciones Generales de Cierre de Acta
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Conclusión final técnico-legal de la inspección..."
                    value={generalObs}
                    onChange={(e) => setGeneralObs(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "#f8fafc" } }}
                  />
                </Box>

                {/* BOTONES DE CIERRE FINAL */}
                <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={actualFormatoInspeccion !== "VIRTUAL" && !negativaFirma && cidiLevel !== 2}
                    onClick={() => handleOpenCloseActa("APROBAR")}
                    sx={{
                      py: 2,
                      borderRadius: 3,
                      fontWeight: 900,
                      bgcolor: "#059669",
                      "&:hover": { bgcolor: "#047857" }
                    }}
                  >
                    APROBAR ACTA
                  </Button>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={actualFormatoInspeccion !== "VIRTUAL" && !negativaFirma && cidiLevel !== 2}
                    onClick={() => handleOpenCloseActa("NO APROBAR")}
                    sx={{
                      py: 2,
                      borderRadius: 3,
                      fontWeight: 900,
                      bgcolor: "#ef4444",
                      "&:hover": { bgcolor: "#dc2626" }
                    }}
                  >
                    RECHAZAR ACTA
                  </Button>
                </Stack>

              </Box>
            )}

          </Box>

          {/* NAVEGACIÓN INFERIOR WIZARD */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4, pt: 3, borderTop: "1px solid #e2e8f0" }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => prev - 1)}
              sx={{ fontWeight: 800, borderRadius: 3, py: 1.2, px: 3 }}
            >
              Volver
            </Button>
            
            <Button
              variant="contained"
              endIcon={currentStep === WIZARD_STEPS.length - 1 ? <CheckIcon /> : <ArrowForwardIcon />}
              disabled={currentStep === WIZARD_STEPS.length - 1}
              onClick={() => setCurrentStep(prev => prev + 1)}
              sx={{ fontWeight: 900, borderRadius: 3, py: 1.2, px: 3, bgcolor: "#0090d0", "&:hover": { bgcolor: "#007bb0" } }}
            >
              Siguiente
            </Button>
          </Box>

        </Box>
      )}

      {/* VISOR DE PLANOS */}
      <FileViewerModal
        file={viewerFile}
        onClose={() => setViewerFile(null)}
      />

      {/* GESTOR DE EVIDENCIA FOTOGRÁFICA (HASTA 5 FOTOS POR COMPONENTE) */}
      <Dialog
        open={!!photoManagerField}
        onClose={() => setPhotoManagerField(null)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 4, p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 950, color: "#1e293b", pb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PhotoCamera sx={{ color: "#0090d0" }} />
            Evidencia Fotográfica
          </Box>
          <IconButton size="small" onClick={() => setPhotoManagerField(null)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#64748b", mb: 2, fontWeight: 550 }}>
            Cargue hasta 5 fotografías para el componente: <b>{photoManagerField?.label}</b>
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1.5, mb: 3 }}>
            {photoManagerField && (photosByComponent[photoManagerField.id] || []).map((img, idx) => (
              <Box key={idx} sx={{ width: "100%", height: 75, position: "relative", border: "1px solid #cbd5e1", borderRadius: 2, overflow: "hidden" }}>
                <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="evidencia" />
                <IconButton
                  size="small"
                  onClick={() => {
                    const currentPhotos = photosByComponent[photoManagerField.id] || [];
                    setPhotosByComponent(prev => ({
                      ...prev,
                      [photoManagerField.id]: currentPhotos.filter((_, i) => i !== idx)
                    }));
                  }}
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    bgcolor: "rgba(239, 68, 68, 0.9)",
                    color: "white",
                    p: 0.2,
                    "&:hover": { bgcolor: "#dc2626" }
                  }}
                >
                  <Close sx={{ fontSize: 12 }} />
                </IconButton>
              </Box>
            ))}

            {(!photoManagerField || (photosByComponent[photoManagerField.id] || []).length < 5) && (
              <Box
                component="label"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 75,
                  border: "2px dashed #cbd5e1",
                  borderRadius: 2,
                  cursor: "pointer",
                  bgcolor: "#f8fafc",
                  "&:hover": { borderColor: "#0ea5e9" }
                }}
              >
                <PhotoCamera sx={{ color: "#94a3b8" }} />
                <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "0.65rem", fontWeight: 700 }}>Añadir</Typography>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64 = reader.result;
                      const currentPhotos = photosByComponent[photoManagerField.id] || [];
                      setPhotosByComponent(prev => ({
                        ...prev,
                        [photoManagerField.id]: [...currentPhotos, base64]
                      }));
                    };
                    reader.readAsDataURL(file);
                    e.target.value = null;
                  }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="contained" onClick={() => setPhotoManagerField(null)} sx={{ borderRadius: 2, fontWeight: 900, px: 3, bgcolor: "#1e293b" }}>
            Guardar Evidencia
          </Button>
        </DialogActions>
      </Dialog>

      {/* TRIGGER FORZADO: BOTTOM SHEET DE EVIDENCIA DE BIOSEGURIDAD */}
      <Dialog
        open={forcedModal.open}
        onClose={() => {}} 
        disableEscapeKeyDown
        scroll="paper"
        PaperProps={{
          sx: {
            position: 'fixed',
            bottom: 0,
            m: 0,
            width: '100%',
            maxWidth: 'sm',
            borderRadius: '24px 24px 0 0',
            p: 2,
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 950, color: "#ef4444", borderBottom: "1px solid #fee2e2", pb: 1, display: "flex", gap: 1, alignItems: "center" }}>
          <WarningIcon /> Incumplimiento Crítico Registrado
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ color: "#475569", mb: 3, fontWeight: 600 }}>
            Ha marcado <b>NO</b> en: <Box component="span" sx={{ color: "#ef4444", fontWeight: 900 }}>{forcedModal.label}</Box>.<br />
            Para continuar, es obligatorio ingresar una descripción detallada del hallazgo y adjuntar al menos una foto de la infracción.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 900, color: "#334155", display: "block", mb: 1 }}>
              Descripción del Hallazgo / Infracción (mínimo 3 caracteres) *
            </Typography>
            <TextField
              id="forced-obs-input"
              fullWidth
              multiline
              rows={3}
              placeholder="Describa en detalle la infracción de bioseguridad..."
              onChange={(e) => {
                const text = e.target.value;
                document.getElementById("forced-save-btn").disabled = text.trim().length < 3 || (photosByComponent[forcedModal.fieldId] || []).length === 0;
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 900, color: "#334155", display: "block", mb: 1 }}>
              Fotos de Evidencia (Mínimo 1 foto obligatoria) *
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {forcedModal.fieldId && (photosByComponent[forcedModal.fieldId] || []).map((img, idx) => (
                <Box key={idx} sx={{ width: 75, height: 75, position: "relative", border: "1px solid #cbd5e1", borderRadius: 2, overflow: "hidden" }}>
                  <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="infracción" />
                  <IconButton
                    size="small"
                    onClick={() => {
                      const currentPhotos = photosByComponent[forcedModal.fieldId] || [];
                      const updated = currentPhotos.filter((_, i) => i !== idx);
                      setPhotosByComponent(prev => ({ ...prev, [forcedModal.fieldId]: updated }));
                      
                      const obsTextVal = document.getElementById("forced-obs-input").value;
                      document.getElementById("forced-save-btn").disabled = obsTextVal.trim().length < 3 || updated.length === 0;
                    }}
                    sx={{ position: "absolute", top: 2, right: 2, bgcolor: "rgba(239, 68, 68, 0.9)", color: "white", p: 0.2 }}
                  >
                    <Close sx={{ fontSize: 12 }} />
                  </IconButton>
                </Box>
              ))}

              {(!forcedModal.fieldId || (photosByComponent[forcedModal.fieldId] || []).length < 5) && (
                <Box
                  component="label"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 75,
                    height: 75,
                    border: "2px dashed #fca5a5",
                    borderRadius: 2,
                    cursor: "pointer",
                    bgcolor: "#fffbfa",
                    "&:hover": { borderColor: "#ef4444" }
                  }}
                >
                  <PhotoCamera sx={{ color: "#ef4444" }} />
                  <Typography variant="caption" sx={{ color: "#ef4444", fontSize: "0.6rem", fontWeight: 700 }}>Añadir</Typography>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64 = reader.result;
                        const currentPhotos = photosByComponent[forcedModal.fieldId] || [];
                        const updated = [...currentPhotos, base64];
                        setPhotosByComponent(prev => ({
                          ...prev,
                          [forcedModal.fieldId]: updated
                        }));
                        
                        const obsTextVal = document.getElementById("forced-obs-input").value;
                        document.getElementById("forced-save-btn").disabled = obsTextVal.trim().length < 3 || updated.length === 0;
                      };
                      reader.readAsDataURL(file);
                      e.target.value = null;
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: "1px solid #fee2e2", justifyContent: "space-between" }}>
          <Button
            variant="text"
            color="inherit"
            onClick={handleCancelForcedObs}
            sx={{ fontWeight: 800, color: "#64748b" }}
          >
            Volver a "SÍ"
          </Button>
          <Button
            id="forced-save-btn"
            variant="contained"
            disabled
            onClick={() => {
              const textVal = document.getElementById("forced-obs-input").value;
              handleSaveForcedObs(forcedModal.fieldId, textVal, photosByComponent[forcedModal.fieldId] || []);
            }}
            sx={{ fontWeight: 900, bgcolor: "#ef4444", "&:hover": { bgcolor: "#dc2626" } }}
          >
            Registrar Infracción
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR DE AVISO DE BLOQUEO CIDI */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%', fontWeight: 800, borderRadius: 3 }}>
          Firma Inhabilitada: El responsable no tiene Ciudadano Digital Nivel 2 verificado.
        </Alert>
      </Snackbar>

      {/* DIALOG DE CONFIRMACIÓN DE NOTA DE CIERRE */}
      <Dialog
        open={closeActaModalOpen}
        onClose={() => setCloseActaModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: '#1e293b', pb: 1 }}>
          Nota de Cierre - Acta {closeActaAction === "APROBAR" ? "Aprobada" : "Rechazada"}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#64748b', mb: 3, fontWeight: 550 }}>
            Ingrese una nota final justificativa para la conclusión de la inspección.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Escriba la nota de cierre..."
            value={closeActaNote}
            onChange={(e) => setCloseActaNote(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "#f8fafc" } }}
          />
        </DialogContent>
        <DialogActions sx={{ pt: 2, px: 3, pb: 2 }}>
          <Button onClick={() => setCloseActaModalOpen(false)} sx={{ color: '#64748b', fontWeight: 800 }}>
            CANCELAR
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setCloseActaModalOpen(false);
              alert(`Acta concluida (${closeActaAction}) con éxito.\nNota final: ${closeActaNote}`);
              navigate("/inspector"); // Al cerrar volvemos al home
            }}
            sx={{
              bgcolor: closeActaAction === "APROBAR" ? "#059669" : "#ef4444",
              fontWeight: 900,
              borderRadius: 2.5,
              px: 3,
              "&:hover": { bgcolor: closeActaAction === "APROBAR" ? "#047857" : "#dc2626" }
            }}
          >
            CONFIRMAR CIERRE
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PantallaInspeccion;
