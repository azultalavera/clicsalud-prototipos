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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";


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
    representative: null,
    inspector: null,
  });

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

  const photoInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);

    // Persistir como Base64 para que el efector pueda verlas
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

    // 1. Datos Generales
    let genSummary = [];
    const genFields = datosGeneralesSrv?.sections
      ? getFlatFields(datosGeneralesSrv.sections)
      : datosGeneralesSrv?.fields || [];

    genFields.forEach(f => {
      const fieldData = inspectorData[f.id];
      const val = extractValue(fieldData);
      const obs = extractObs(fieldData);

      if ((f.type === 'boolean' || f.type === 'checkbox') && val === false) {
        genSummary.push({ label: f.label, text: `NO CUMPLE${obs ? ` (${obs})` : ''}`, type: 'ERROR' });
      } else if (obs) {
        genSummary.push({ label: f.label, text: obs, type: 'OBS' });
      }
    });
    setObsDatosGenerales(genSummary);

    // 2. Datos Trámite
    let traSummary = [];
    let emplazamientos = []; // Nuevos emplazamientos para el efector

    otherServices.forEach(srv => {
      const srvFields = srv.sections ? getFlatFields(srv.sections) : srv.fields || [];
      srvFields.forEach(f => {
        const fieldData = inspectorData[f.id];
        const val = extractValue(fieldData);
        const obs = extractObs(fieldData);
        const isDoc = f.id?.includes('doc') || f.label?.toUpperCase().includes('DOCUMENTO');
        let isIrregularidadTramite = false;
        let razonIrregular = "";

        // Regla 1: Datos Generales / Otros (Boolean NO CUMPLE) -> OBSERVACIÓN DE ACTA
        if ((f.type === 'boolean' || f.type === 'checkbox') && val === false) {
          traSummary.push({ label: f.label, service: srv.name, text: `NO CUMPLE${obs ? ` (${obs})` : ''}`, type: 'ERROR' });
        } else if (obs && !isDoc) {
          // Observaciones manuales en campos normales -> OBSERVACIÓN DE ACTA
          traSummary.push({ label: f.label, service: srv.name, text: obs, type: 'OBS' });
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
    "UTI",
    "UCO",
    "UCIM",
    "UTIP",
    "UTIN",
    "HEMODIALISIS",
    "QUIRÓFANO",
  ];
  const TARGET_MAPPINGS = {
    UTI: [
      "UTI",
      "TERAPIA INTENSIVA",
      "CUIDADOS INTENSIVOS",
      "CUIDADOS CRITICOS",
      "UNIDAD DE TERAPIA INTENSIVA",
    ],
    UCO: ["UCO", "CORONARIA", "CORONARIO", "UNIDAD CORONARIA"],
    UCIM: [
      "UCIM",
      "CUIDADOS INTERMEDIOS",
      "TERAPIA INTERMEDIA",
      "CUIDADOS MODERADOS",
      "UNIDAD DE CUIDADOS INTERMEDIOS",
    ],
    UTIP: ["UTIP", "PEDIATRICA"],
    UTIN: ["UTIN", "NEONATAL"],
    HEMODIALISIS: ["HEMODIALISIS", "DIALISIS"],
    QUIRÓFANO: [
      "QUIROFANO",
      "QUIRÓFANO",
      "CENTRO QUIRÚRGICO",
      "ÁREA QUIRÚRGICA",
    ],
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
        sub === "UTI" &&
        (nSrv.includes("PEDIAT") ||
          nSrv.includes("NEONAT") ||
          nSrv.includes("CORONARI") ||
          nSrv.includes("INTERMEDIA"));

      // Si es exactamente la UTI que buscamos, nunca la excluimos de su propio chip
      if (
        sub === "UTI" &&
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
      const current = prev[fieldId];
      const isObject = current && typeof current === 'object' && !Array.isArray(current);

      // Si el newValue ya es un objeto (como el que viene de handleSaveObs), lo usamos directo
      if (newValue && typeof newValue === 'object' && !Array.isArray(newValue) && 'obs' in newValue) {
        return { ...prev, [fieldId]: newValue };
      }

      // Si no, preservamos el 'obs' existente si había uno
      return {
        ...prev,
        [fieldId]: isObject
          ? { ...current, value: newValue }
          : newValue
      };
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
    {
      id: "SALAS Y CAMAS",
      label: "SALAS Y CAMAS",
      icon: <BedIcon sx={{ fontSize: 28 }} />,
    },
  ];

  const getFlatFields = (sectionsObj) => {
    return sectionsObj?.flatMap((sec) => sec.fields || []) || [];
  };

  const getCompletionStats = (fieldsArray) => {
    if (!fieldsArray || fieldsArray.length === 0)
      return { total: 0, filled: 0, percent: 100 };
    const total = fieldsArray.length;
    const filled = fieldsArray.filter((f) => {
      const val = inspectorData[f.id];
      if (val === undefined || val === null) return false;
      if (typeof val === "object")
        return val.observado !== undefined && val.observado !== false;
      return String(val).trim() !== "";
    }).length;
    const percent = Math.round((filled / total) * 100);
    return { total, filled, percent };
  };

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
                  const sectionStats = getCompletionStats(sec.fields);
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
              Estado de carga por áreas técnicas y servicios declarados
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

          {selectedCategory === "SERVICIOS" && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mb: 4,
                mt: 3,
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

          {selectedCategory !== "SERVICIOS" && <Box sx={{ mb: 4 }} />}

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
                  infraEfector={infraEfector}
                  currentSrvName="GENERAL"
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
                    const isRelevant =
                      !n.includes("ARQUITECTURA") &&
                      !n.includes("EQUIPAMIENTO") &&
                      !n.includes("RECURSOS") &&
                      !n.includes("RRHH") &&
                      !n.includes("JEFE");

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

                    if (!isMatch) return false;

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
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 3 }}>
                    {matchedSections.map((section) => (
                      <Box key={section.id} sx={{ mb: 4 }}>
                        {selectedCategory === "SERVICIOS" && (
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 800,
                              mb: 2,
                              color: "#64748b",
                              textTransform: "uppercase",
                              borderBottom: "1px solid #f1f5f9",
                              pb: 1
                            }}
                          >
                            {section.name}
                          </Typography>
                        )}

                        {(section.name.includes("EQUIPAMIENTO") ||
                          section.name.includes("RECURSOS") ||
                          section.name.includes("RRHH") ||
                          section.name.includes("SALA") ||
                          section.name.includes("CAMA")) ? (
                          <VerificationTable
                            fields={section.fields.filter((f) => {
                              if (section.name.toUpperCase().includes("SALA") || section.name.toUpperCase().includes("CAMA")) {
                                const label = f.label || f.name;
                                const uLabel = label.toUpperCase();
                                const isGenericLabel = uLabel.includes("CAMAS") || uLabel.includes("SALAS") || uLabel.includes("HABITACION") || (uLabel.includes("N") && uLabel.includes("DE"));
                                if (isGenericLabel && infraEfector && (infraEfector[srv.name] || infraEfector[srv.id])) return true;
                                return infraEfector && (infraEfector[label] > 0);
                              }
                              return true;
                            })}
                            inspectorData={inspectorData}
                            onChange={handleFieldChange}
                            onOpenObs={handleOpenObsDialog}
                            infraEfector={infraEfector}
                            rrhhEfector={rrhhEfector}
                            equiposEfector={equiposEfector}
                            currentSrvName={srv.name}
                          />
                        ) : (
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                              gap: 3
                            }}
                          >
                            {section.fields?.map((field) => (
                              <FieldItem
                                key={field.id}
                                field={field}
                                value={inspectorData[field.id]}
                                onChange={handleFieldChange}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              );
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

      {/* Observaciones Agregadas */}
      <Box sx={{ mt: 6, mb: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900, color: "#1e293b", mb: 2 }}>
            OBSERVACIONES DE DATOS GENERALES
          </Typography>
          <Paper variant="outlined" sx={{ p: 3, bgcolor: "white", borderRadius: 4, minHeight: 100, border: '2px solid #f1f5f9' }}>
            {obsDatosGenerales.length === 0 ? (
              <Typography sx={{ color: "#94a3b8", fontStyle: "italic", fontSize: "0.9rem" }}>No hay observaciones pendientes.</Typography>
            ) : (
              <Box component="ul" sx={{ m: 0, pl: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {obsDatosGenerales.map((obs, idx) => (
                  <Box component="li" key={idx} sx={{ color: obs.type === 'ERROR' ? '#ef4444' : '#475569', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', py: 0.8 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box component="span" sx={{ fontWeight: 800 }}>{obs.label}</Box>
                        <Box component="span" sx={{ fontWeight: 500 }}>: {obs.text}</Box>
                    </Box>
                    <IconButton 
                        size="small" 
                        onClick={() => photoInputRef.current.click()}
                        sx={{ ml: 1, color: '#94a3b8', '&:hover': { color: '#0ea5e9' } }}
                    >
                        <PhotoCamera sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900, color: "#1e293b", mb: 2 }}>
            OBSERVACIONES DE DATOS DEL TRÁMITE
          </Typography>
          <Paper variant="outlined" sx={{ p: 3, bgcolor: "white", borderRadius: 4, minHeight: 100, border: '2px solid #f1f5f9' }}>
            {obsDatosTramite.length === 0 ? (
              <Typography sx={{ color: "#94a3b8", fontStyle: "italic", fontSize: "0.9rem" }}>No hay observaciones pendientes.</Typography>
            ) : (
              <Box component="ul" sx={{ m: 0, pl: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {obsDatosTramite.map((obs, idx) => (
                  <Box component="li" key={idx} sx={{ color: obs.type === 'ERROR' ? '#ef4444' : '#475569', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', py: 0.8 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Chip 
                        label={obs.service} 
                        size="small" 
                        sx={{ 
                          fontWeight: 900, 
                          fontSize: '0.65rem', 
                          bgcolor: '#e0f2fe', 
                          color: '#0369a1',
                          height: 20,
                          borderRadius: 1
                        }} 
                      />
                      <Box component="span" sx={{ fontWeight: 800 }}>{obs.label}</Box> 
                      <Box component="span" sx={{ fontWeight: 500 }}>: {obs.text}</Box>
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={() => photoInputRef.current.click()}
                      sx={{ ml: 1, color: '#94a3b8', '&:hover': { color: '#0ea5e9' } }}
                    >
                      <PhotoCamera sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Box>

        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 900, color: "#1e293b", mb: 2 }}
          >
            OBSERVACIONES GENERALES
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Escriba aquí cualquier observación general sobre la inspección..."
            value={generalObs}
            onChange={(e) => setGeneralObs(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 6,
                bgcolor: "#f8fafc",
                border: "2px solid #e2e8f0",
                "&:hover": { borderColor: "#cbd5e1" },
                "&.Mui-focused": { borderColor: "#0ea5e9" },
              },
            }}
          />
        </Box>
      </Box>

      {/* Fotos y Adjuntos */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 900, color: "#1e293b", mb: 2 }}
        >
          FOTOS Y ADJUNTOS
        </Typography>
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
      {(signatures.representative || signatures.inspector) && (
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
              sx={{ fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}
            >
              Firma Responsable
            </Typography>
            <Box sx={{ height: 100, mt: 1, bgcolor: "white", borderRadius: 3, border: "1px solid #e2e8f0", overflow: 'hidden' }}>
              {signatures.representative && <img src={signatures.representative} alt="firma responsable" style={{ height: '100%' }} />}
            </Box>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}
            >
              Firma Inspector
            </Typography>
            <Box sx={{ height: 100, mt: 1, bgcolor: "white", borderRadius: 3, border: "1px solid #e2e8f0", overflow: 'hidden' }}>
              {signatures.inspector && <img src={signatures.inspector} alt="firma inspector" style={{ height: '100%' }} />}
            </Box>
          </Box>
        </Box>
      )}

      <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
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
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={!signatures.inspector || !signatures.representative}
          sx={{
            py: 2.5,
            borderRadius: 8,
            fontWeight: 900,
            fontSize: "1.1rem",
            bgcolor: "#059669",
            boxShadow: "0 10px 15px -3px rgba(5, 150, 105, 0.3)",
            "&:hover": { bgcolor: "#047857" },
            "&.Mui-disabled": {
              bgcolor: "#e2e8f0",
              color: "#94a3b8",
            },
          }}
        >
          APROBAR
        </Button>

        {hasObservations && (
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={!signatures.inspector || !signatures.representative}
            sx={{
              py: 2.5,
              borderRadius: 8,
              fontWeight: 900,
              fontSize: "1.1rem",
              bgcolor: "#ef4444",
              boxShadow: "0 10px 15px -3px rgba(239, 68, 68, 0.3)",
              "&:hover": { bgcolor: "#dc2626" },
              "&.Mui-disabled": {
                bgcolor: "#fee2e2",
                color: "#fca5a5",
              },
            }}
          >
            NO APROBAR
          </Button>
        )}
      </Stack>

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

const FieldItem = ({ field, value, onChange, onOpenObs }) => {
  const isObj = value && typeof value === 'object' && !Array.isArray(value);
  const realValue = isObj ? value.value : value;
  const obsText = isObj ? value.obs : "";
  const isObserved = isObj ? value.observado : false;

  const renderInput = () => {
    switch (field.type) {
      case "boolean":
      case "checkbox":
        return (
          <ToggleButtonGroup
            value={realValue === undefined ? null : realValue ? "si" : "no"}
            exclusive
            disabled={field.origin === "TRÁMITE"}
            onChange={(e, val) => {
              if (val !== null) onChange(field.id, val === "si");
            }}
            fullWidth
            sx={{ height: 48 }}
          >
            <ToggleButton
              value="si"
              sx={{
                flex: 1,
                borderRadius: "8px 0 0 8px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                fontWeight: 700,
                color: "#64748b",
                "&.Mui-selected": {
                  bgcolor: "#dcfce7",
                  color: "#166534",
                  fontWeight: 900,
                },
              }}
            >
              SÍ
            </ToggleButton>
            <ToggleButton
              value="no"
              sx={{
                flex: 1,
                borderRadius: "0 8px 8px 0",
                border: "1px solid #cbd5e1",
                borderLeft: "none",
                fontSize: "14px",
                fontWeight: 700,
                color: "#64748b",
                "&.Mui-selected": {
                  bgcolor: "#fee2e2",
                  color: "#991b1b",
                  fontWeight: 900,
                },
              }}
            >
              NO
            </ToggleButton>
          </ToggleButtonGroup>
        );
      case "date":
        return (
          <TextField
            type="date"
            fullWidth
            variant="outlined"
            size="small"
            disabled={field.origin === "TRÁMITE"}
            value={realValue || field.valorTramite || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: 2,
                fontSize: "14px",
                height: 48,
                fontWeight: 600,
              },
            }}
          />
        );
      case "toggle":
        return (
          <ToggleButtonGroup
            value={realValue}
            exclusive
            disabled={field.origin === "TRÁMITE"}
            onChange={(e, val) => {
              if (val !== null) onChange(field.id, val);
            }}
            fullWidth
            sx={{ height: 48 }}
          >
            {field.options?.split(",").map((opt) => (
              <ToggleButton
                key={opt}
                value={opt.trim()}
                sx={{
                  flex: 1,
                  fontSize: "13px",
                  fontWeight: 700,
                  "&.Mui-selected": {
                    bgcolor: "#e0f2fe",
                    color: "#0369a1",
                    fontWeight: 900,
                  },
                }}
              >
                {opt.trim()}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        );
      case "select":
        return (
          <TextField
            select
            fullWidth
            variant="outlined"
            size="small"
            disabled={field.origin === "TRÁMITE"}
            value={realValue || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: 2,
                fontSize: "14px",
                fontWeight: 500,
                height: 48,
              },
            }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    borderRadius: 2,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  },
                },
              },
            }}
          >
            {field.options?.split(",").map((opt) => (
              <MenuItem
                key={opt}
                value={opt.trim()}
                sx={{
                  py: 1,
                  fontSize: "0.9rem",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                {opt.trim()}
              </MenuItem>
            ))}
          </TextField>
        );
      case "number":
        return (
          <TextField
            type="number"
            fullWidth
            variant="outlined"
            size="small"
            placeholder="0"
            disabled={field.origin === "TRÁMITE"}
            value={realValue || field.valorTramite || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            InputProps={{
              sx: {
                borderRadius: 2,
                fontSize: "14px",
                height: 48,
                fontWeight: 600,
              },
            }}
          />
        );
      default:
        return (
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Escriba aquí..."
            disabled={field.origin === "TRÁMITE"}
            value={realValue || field.valorTramite || ""}
            multiline={field.type === "textarea"}
            rows={field.type === "textarea" ? 3 : 1}
            onChange={(e) => onChange(field.id, e.target.value)}
            InputProps={{
              sx: {
                borderRadius: 2,
                fontSize: "14px",
                fontWeight: 500,
                minHeight: 48,
              },
            }}
          />
        );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
        minWidth: 0,
      }}
    >
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{
              fontWeight: 800,
              color: "#334155",
              lineHeight: 1.2,
              fontSize: "13px",
              textTransform: "uppercase",
              mb: 1
            }}
          >
            {field.label}
          </Typography>
          {onOpenObs && (
            <IconButton
              size="small"
              onClick={() => onOpenObs(field.id, field.label, obsText)}
              sx={{
                ml: 0.5,
                mb: 1,
                p: 0.5,
                color: obsText ? "#0ea5e9" : "#94a3b8",
                "&:hover": { color: "#0ea5e9", backgroundColor: "rgba(14, 165, 233, 0.05)" }
              }}
            >
              {obsText ? <ChatBubbleIcon sx={{ fontSize: 16 }} /> : <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          )}
        </Box>
        {renderInput()}
      </Box>

    </Box>
  );
};

const VerificationTable = ({
  fields,
  inspectorData,
  onChange,
  onOpenObs,
  infraEfector,
  rrhhEfector,
  equiposEfector,
  currentSrvName,
}) => {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: "1px solid #e2e8f0", borderRadius: 3, overflowX: "auto" }}
    >
      <Table size="small" sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: "#f1f5f9" }}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: 900, color: "#334155", width: "35%", py: 2 }}
            >
              Elemento a Inspeccionar
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: 900, color: "#334155", py: 2 }}
            >
              Valor Declarado
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: 900, color: "#334155", py: 2, width: 90 }}
            >
              Observado
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: 900, color: "#334155", py: 2, width: 140 }}
            >
              Valor Observado
            </TableCell>
            <TableCell
              sx={{ fontWeight: 900, color: "#334155", width: "30%", py: 2 }}
            >
              Observación
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields?.map((field) => {
            const currentVal = inspectorData[field.id] || {};
            const isObservado = currentVal.observado || false;
            const valorObj = currentVal.valor || "";
            const obsText = currentVal.obs || "";

            let valorDeclarado =
              field.valorTramite ?? field.cantidadMinima ?? field.valorDeclarado ?? 1;

            // 1. INFRAESTRUCTURA (Camas/Salas)
            const name = field.label || field.name;
            if (infraEfector) {
              if (infraEfector[name] !== undefined) {
                valorDeclarado = infraEfector[name];
              } else if (currentSrvName) {
                const upperLabel = normalize(name);
                const isGeneric = upperLabel.includes("CAMA") || upperLabel.includes("SALA") || upperLabel.includes("HABITACION") || (upperLabel.includes("N") && upperLabel.includes("DE"));

                if (isGeneric) {
                  if (infraEfector[currentSrvName] !== undefined) {
                    valorDeclarado = infraEfector[currentSrvName];
                  } else {
                    const foundKey = Object.keys(infraEfector).find(k =>
                      normalize(k).includes(normalize(currentSrvName)) ||
                      normalize(currentSrvName).includes(normalize(k))
                    );
                    if (foundKey) valorDeclarado = infraEfector[foundKey];
                  }
                }
              }
            }

            // 2. RECURSOS HUMANOS
            if (rrhhEfector && rrhhEfector.length > 0) {
              const rrhhMatch = rrhhEfector.find(
                (r) =>
                  (r.especialidad === field.especialidad ||
                    r.especialidad === field.label ||
                    r.tipoPlantel === field.tipoPlantel ||
                    r.tipoPlantel === field.label) &&
                  r.origen === currentSrvName,
              );
              if (rrhhMatch) valorDeclarado = rrhhMatch.cantidadCargada;
            }

            // 3. EQUIPAMIENTO
            const isQuirofano = currentSrvName
              ?.toUpperCase()
              .includes("QUIROFANO");
            if (isQuirofano || (equiposEfector && equiposEfector.length > 0)) {
              const equipoMatch =
                equiposEfector?.filter(
                  (e) =>
                    (e.equipamiento === field.equipamiento ||
                      e.equipamiento === field.label) &&
                    e.origen === currentSrvName,
                ) || [];

              if (isQuirofano) {
                const orCount = Number(
                  infraEfector["QUIRÓFANO"] || infraEfector["QUIROFANO"] || 1,
                );
                const actualSum = equipoMatch.reduce((acc, curr) => acc + (curr.actualQty || 1), 0);
                valorDeclarado = Math.max(orCount, actualSum);
                if (equipoMatch.length === 0) valorDeclarado = orCount;
              } else if (equipoMatch.length > 0) {
                // Sumamos las cantidades (si viene del simulador trae actualQty, sino contamos items)
                valorDeclarado = equipoMatch.reduce((acc, curr) => acc + (curr.actualQty || 1), 0);
              }
            }

            const isNumeric = !isNaN(valorDeclarado);
            const hasError =
              isObservado &&
              valorObj !== "" &&
              isNumeric &&
              Number(valorObj) !== Number(valorDeclarado);

            const update = (key, val) =>
              onChange(field.id, { ...currentVal, [key]: val });

            const vObs = Number(valorObj);
            const vDec = Number(valorDeclarado);
            const isFilled = valorObj !== "";
            const isMatch = isFilled && vObs === vDec;

            // Lógica de Validación de Iconos (HU)
            const getStatusIndicator = () => {
              if (!isObservado || !isFilled) return null;

              const upperSrv = currentSrvName?.toUpperCase() || "";
              const upperLabel = (field.label || "").toUpperCase();

              const isJefe = upperLabel.includes("JEFE") || upperSrv.includes("JEFE");
              const isServiciosCamas = upperLabel.includes("CAMA") || upperLabel.includes("SALA") || upperLabel.includes("PUESTO") || upperSrv.includes("CAMA") || upperSrv.includes("SALA");
              const isRrhhEquip = !isJefe && !isServiciosCamas; // Por descarte según HU

              if (isMatch) return <InfoIcon sx={{ color: "#94a3b8", fontSize: 20 }} />; // Gris

              if (isServiciosCamas) {
                return vObs < vDec
                  ? <ReportProblemIcon sx={{ color: "#eab308", fontSize: 20 }} /> // Amarillo (Advertencia)
                  : <ErrorIcon sx={{ color: "#ef4444", fontSize: 20 }} />; // Rojo (Error)
              }

              if (isJefe) {
                return vObs < vDec
                  ? <ErrorIcon sx={{ color: "#ef4444", fontSize: 20 }} /> // Rojo (Error)
                  : <ReportProblemIcon sx={{ color: "#eab308", fontSize: 20 }} />; // Amarillo (Advertencia)
              }

              if (isRrhhEquip) {
                return vObs < vDec
                  ? <ErrorIcon sx={{ color: "#ef4444", fontSize: 20 }} /> // Rojo (Error)
                  : null;
              }
              return null;
            };

            return (
              <TableRow
                key={field.id}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  bgcolor: hasError ? "#fef2f2" : "inherit",
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    fontWeight: 700,
                    color: "#1e293b",
                    fontSize: "0.85rem",
                    py: 1.5,
                  }}
                >
                  {field.label ||
                    field.name ||
                    field.equipamiento ||
                    field.especialidad ||
                    "Elemento Sin Nombre"}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 800 }}>
                  <Box
                    sx={{
                      bgcolor: "#e2e8f0",
                      color: "#0f172a",
                      display: "inline-block",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1.5,
                    }}
                  >
                    {valorDeclarado}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={isObservado}
                    onChange={(e) => update("observado", e.target.checked)}
                    color="success"
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                  />
                </TableCell>
                <TableCell align="center">
                  {isObservado && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        size="small"
                        type="number"
                        placeholder="Cant."
                        disabled={field.origin === "TRÁMITE"}
                        value={valorObj || (field.origin === "TRÁMITE" ? valorDeclarado : "")}
                        onChange={(e) => update("valor", e.target.value)}
                        error={hasError}
                        sx={{
                          flexGrow: 1,
                          "& .MuiInputBase-root": {
                            bgcolor: field.origin === "TRÁMITE" ? "#f1f5f9" : "white",
                            fontWeight: 800,
                            height: 38,
                          },
                        }}
                      />
                      {getStatusIndicator()}
                    </Box>
                  )}
                </TableCell>
                <TableCell align="center">
                  {isObservado && !isMatch && (
                    <IconButton
                      size="small"
                      onClick={() => onOpenObs(field.id, `[${currentSrvName}] ${field.label || field.name}`, obsText)}
                      sx={{
                        color: obsText ? "#0ea5e9" : "#cbd5e1",
                        border: "1px solid",
                        borderColor: obsText ? "#0ea5e9" : "#e2e8f0",
                        bgcolor: obsText ? "#f0f9ff" : "transparent",
                        "&:hover": { bgcolor: "#e0f2fe" }
                      }}
                    >
                      {obsText ? <ChatBubbleIcon /> : <ChatBubbleOutlineIcon />}
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const PlansTable = ({ inspectorData, onChange, onOpenViewer, onOpenObs }) => {
  const plansData = [
    { category: "Plano General", files: ["plano1.pdf", "plano2.pdf"] },
    { category: "Plano General - Anexo", files: ["plano3.pdf"] },
  ];

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: "1px solid #e2e8f0", borderRadius: 4, overflow: "hidden" }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "#f8fafc" }}>
            <TableCell
              sx={{ fontWeight: 900, color: "#0369a1", fontSize: "0.80rem", py: 2 }}
            >
              DOCUMENTO
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: 900, color: "#0369a1", fontSize: "0.80rem" }}
            >
              VISUALIZAR DOCUMENTO
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: 900, color: "#0369a1", fontSize: "0.80rem" }}
            >
              OBSERVADO
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: 900, color: "#0369a1", fontSize: "0.80rem" }}
            >
              OBSERVACIÓN
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {plansData.map((group) => (
            <React.Fragment key={group.category}>
              <TableRow sx={{ bgcolor: "#f1f5f9" }}>
                <TableCell
                  colSpan={4}
                  sx={{
                    fontWeight: 900,
                    color: "#475569",
                    py: 1,
                    fontSize: "0.85rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  {group.category}
                </TableCell>
              </TableRow>
              {group.files.map((file) => {
                const fieldId = `plan_auth_${file.replace(".", "_")}`;
                const currentVal = inspectorData[fieldId] || {};
                const isObserved = currentVal.observado || false;
                const obsText = currentVal.obs || "";

                return (
                  <TableRow key={file} hover sx={{ "&:last-child td": { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 700, color: "#1e293b", py: 1.5 }}>
                      {file}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        sx={{ color: "#0ea5e9" }}
                        onClick={() => onOpenViewer(file)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={isObserved}
                        onChange={(e) =>
                          onChange(fieldId, { ...currentVal, observado: e.target.checked })
                        }
                        color="primary"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        disabled={!isObserved}
                        onClick={() => onOpenObs(fieldId, `[PLANO] ${file}`, obsText)}
                        sx={{
                          color: obsText ? "#0ea5e9" : "#cbd5e1"
                        }}
                      >
                        <ChatBubbleOutlineIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ObservationDialog = ({ open, label, value, onClose, onSave }) => {
  const [text, setText] = useState(value);

  // Sincronizar texto cuando se abre para un campo nuevo
  useEffect(() => {
    setText(value);
  }, [value, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 4, p: 1 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 900, color: "#1e293b", pb: 1 }}>
        Observación: {label}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: "#64748b", mb: 2, fontWeight: 500 }}>
          Ingrese el detalle de la observación encontrada para este ítem.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={5}
          variant="outlined"
          placeholder="Escriba el detalle aquí..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              bgcolor: "#f8fafc",
            }
          }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          sx={{ fontWeight: 700, color: "#64748b", textTransform: "none" }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={() => onSave(text)}
          sx={{
            borderRadius: 3,
            fontWeight: 800,
            textTransform: "none",
            px: 4,
            bgcolor: "#0ea5e9",
            "&:hover": { bgcolor: "#0284c7" }
          }}
        >
          Guardar Observación
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const FileViewerModal = ({ file, onClose }) => {
  if (!file) return null;

  const filePath = `/src/assets/archivos/planos/${file}`;

  return (
    <Dialog
      open={!!file}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: 4,
          height: "90vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          py: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 900, color: "#1e293b" }}>
          VISUALIZADOR: {file}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            color="primary"
            title="Abrir en nueva pestaña"
            onClick={() => window.open(filePath, "_blank")}
          >
            <OpenInNewIcon />
          </IconButton>
          <IconButton size="small" onClick={onClose} sx={{ color: "#64748b" }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 0, flexGrow: 1, overflow: "hidden" }}>
        <iframe
          src={filePath}
          title="File Viewer"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PantallaInspeccion;

const SignatureModal = ({ open, step, onClose, onSave }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (open && canvasRef.current) {
      setTimeout(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.lineWidth = 4;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.strokeStyle = "#1e293b";
        // Limpiar por si acaso al abrir
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, 100);
    }
  }, [open, step]);

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
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const save = () => {
    const canvas = canvasRef.current;
    // Verificar si el canvas está vacío (opcional, pero buena práctica)
    onSave(canvas.toDataURL());
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 8,
          overflow: "hidden",
        },
      }}
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
        {step === 1 ? (
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
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        >
          <canvas
            ref={canvasRef}
            width={512} // Ajustar al ancho del dialogo aprox
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
          onClick={onClose}
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
            onClick={clear}
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
            onClick={save}
            variant="contained"
            sx={{
              fontWeight: 900,
              borderRadius: 3,
              px: 4,
              bgcolor: step === 1 ? "#0ea5e9" : "#059669",
              boxShadow: step === 1
                ? "0 4px 10px rgba(14,165,233,0.3)"
                : "0 4px 10px rgba(5,150,105,0.3)",
            }}
          >
            {step === 1 ? "Siguiente Firma" : "Confirmar Firma"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
