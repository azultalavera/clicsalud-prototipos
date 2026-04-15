import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  TextField,
  MenuItem,
  Stack,
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
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ErrorOutline as ErrorOutlineIcon,
  Domain as DomainIcon,
  People as PeopleIcon,
  MedicalServices as MedicalServicesIcon,
  Bed as BedIcon,
  LocalHospital as LocalHospitalIcon,
  PhotoCamera,
  CloudUpload,
  Close,
  Delete,
  DriveFileRenameOutline,
  Visibility as VisibilityIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";

const UTI_SECTIONS = [
  {
    id: "uti_arch",
    name: "ARQUITECTURA",
    fields: [
      {
        id: "uti_edificacion",
        label: "Coincide con edificacion",
        type: "boolean",
      },
      { id: "uti_planos", label: "Planos", type: "boolean" },
    ],
  },
  {
    id: "uti_salas",
    name: "SALAS Y CAMAS",
    fields: [
      { id: "uti_camas", label: "TERAPIA INTENSIVA ADULTOS", type: "number" },
    ],
  },
  {
    id: "uti_enfermeria",
    name: "Planillas de enfermería con controles diarios",
    fields: [
      { id: "uti_signos", label: "Signos vitales", type: "boolean" },
      { id: "uti_balance", label: "Balance diario", type: "boolean" },
      {
        id: "uti_volumenes",
        label: "Volúmenes de ingresos y egresos",
        type: "boolean",
      },
      { id: "uti_medicacion", label: "Medicación", type: "boolean" },
    ],
  },
  {
    id: "uti_locales",
    name: "De los Edificios/Locales de la unidad",
    fields: [
      {
        id: "uti_zona",
        label: "Unidad ubicada en zona de circulación semirrestringida",
        type: "boolean",
      },
      {
        id: "uti_pileta",
        label: "Sala de internación c/pileta lavamanos",
        type: "boolean",
      },
      { id: "uti_office", label: "Office de enfermería", type: "boolean" },
      { id: "uti_monitores", label: "Monitores", type: "boolean" },
      {
        id: "uti_ropa",
        label: "Local de ropa y material usado",
        type: "boolean",
      },
      { id: "uti_lavachatas", label: "Area lavachatas", type: "boolean" },
      {
        id: "uti_deposito",
        label: "Depósito de camillas y aparatología",
        type: "boolean",
      },
      { id: "uti_sala_medicos", label: "Sala de médicos", type: "boolean" },
      {
        id: "uti_otras_uci",
        label: "Posee otras Unidades de UCI / UCO",
        type: "boolean",
      },
      {
        id: "uti_comparte_uci",
        label: "Comparte algún local UCI / UCO",
        type: "boolean",
      },
      { id: "uti_grupo", label: "Grupo electrógeno", type: "boolean" },
      {
        id: "uti_iluminacion_emergencia",
        label: "Sistema de Iluminación de Emergencia",
        type: "boolean",
      },
      {
        id: "uti_acceso",
        label: "Acceso directo y exclusivo",
        type: "boolean",
      },
      {
        id: "uti_comunicacion_cirugia",
        label: "Fácil comunicación c/cirugía",
        type: "boolean",
      },
      {
        id: "uti_camas_ortopedicas",
        label: "Camas ortopédicas o articuladas",
        type: "boolean",
      },
      { id: "uti_doble_comando", label: "Doble comando", type: "boolean" },
      { id: "uti_rodantes", label: "Rodantes", type: "boolean" },
      { id: "uti_ventanas", label: "Ventanas al exterior", type: "boolean" },
      {
        id: "uti_vision_panoramica",
        label: "Visión panorámica directa a todas las camas",
        type: "boolean",
      },
      {
        id: "uti_instrumental_esteril",
        label: "Local de Instrumental y material estéril",
        type: "boolean",
      },
      {
        id: "uti_cama_aislamiento",
        label: "Local cerrado c/1 cama para aislamiento",
        type: "boolean",
      },
      {
        id: "uti_evoluciones",
        label: "Evoluciones diarias en Historia Clínica",
        type: "boolean",
      },
      {
        id: "uti_libro_enf",
        label: "Libro de Registro de Enfermedades Transmisibles",
        type: "boolean",
      },
      {
        id: "uti_libro_psico",
        label: "Libro de Registro de psicofármacos",
        type: "boolean",
      },
      {
        id: "uti_vestuario",
        label: "Vestuario para visitas c/pileta lavamanos",
        type: "boolean",
      },
      {
        id: "uti_habitacion_medico",
        label: "Habitación, c/baño propio para médico de Guardia",
        type: "boolean",
      },
      {
        id: "uti_doble_circuito",
        label: "Doble circuito de energía eléctrica",
        type: "boolean",
      },
      {
        id: "uti_diez_tomas",
        label: "Diez tomas de electricidad por cama",
        type: "boolean",
      },
      { id: "uti_hermeticidad", label: "Hermeticidad", type: "boolean" },
      { id: "uti_privacidad", label: "Privacidad", type: "boolean" },
      {
        id: "uti_superficie",
        label: "Superficie total sala internación",
        type: "boolean",
      },
      { id: "uti_ilum_natural", label: "Iluminación natural", type: "boolean" },
      {
        id: "uti_ilum_art_central",
        label: "Iluminación artificial central",
        type: "boolean",
      },
      {
        id: "uti_ilum_individual",
        label: "Iluminación Individual",
        type: "boolean",
      },
      {
        id: "uti_acceso_4",
        label: "Acceso desde 4 posiciones",
        type: "boolean",
      },
    ],
  },
  {
    id: "uti_equip",
    name: "EQUIPAMIENTO",
    fields: [
      {
        id: "uti_marcapaso",
        label: "Marcapaso transitorio (si no tiene UCO)",
        type: "boolean",
      },
      { id: "uti_carro", label: "Carro de urgencia", type: "boolean" },
      { id: "uti_tensionmetro", label: "Tensiómetro", type: "boolean" },
      { id: "uti_nebulizador", label: "Nebulizador", type: "boolean" },
      {
        id: "uti_aspiracion_portatil",
        label: "Sistema portatil de aspiración para drenaje",
        type: "boolean",
      },
      {
        id: "uti_respirador",
        label: "Respirador mecánico volumétrico",
        type: "boolean",
      },
      {
        id: "uti_desfibrilador",
        label: "Equipo de desfibrilación y sincronizador",
        type: "boolean",
      },
      { id: "uti_bomba", label: "Bomba de infusión", type: "boolean" },
      {
        id: "uti_oximetro",
        label: "Oxímetro de pulso portátil",
        type: "boolean",
      },
      { id: "uti_electro", label: "Electrocardiógrafo", type: "boolean" },
      { id: "uti_aspiracion", label: "Equipo de aspiración", type: "boolean" },
    ],
  },
];

const QUIROFANO_SECTIONS = [
  {
    id: "quir_arch",
    name: "ARQUITECTURA",
    fields: [
      { id: "quir_lavabo", label: "Lavabo de cirujanos", type: "boolean" },
      {
        id: "quir_climatizacion",
        label: "Climatización (Filtro HEPA)",
        type: "boolean",
      },
    ],
  },
  {
    id: "quir_salas",
    name: "SALAS Y CAMAS",
    fields: [{ id: "quir_num", label: "QUIRÓFANO", type: "number" }],
  },
  {
    id: "quir_equip",
    name: "EQUIPAMIENTO",
    fields: [
      { id: "quir_electrobisturi", label: "ELECTROBISTURÍ", type: "number" },
      { id: "quir_anestesia", label: "MÁQUINA DE ANESTESIA", type: "number" },
      { id: "quir_traqueo", label: "CAJA DE TRAQUEOTOMÍA", type: "number" },
      { id: "quir_monitor", label: "MONITOR MULTIPARAMÉTRICO", type: "number" },
      {
        id: "quir_cama",
        label: "CAMA O CAMILLA QUIRÚRGICA REGULABLE",
        type: "number",
      },
      {
        id: "quir_aspiracion",
        label: "SISTEMA DE ASPIRACIÓN AUTOMÁTICA",
        type: "number",
      },
      {
        id: "quir_laringo",
        label: "LARINGOSCOPIO Y TUBOS ENDOTRAQUEALES",
        type: "number",
      },
      { id: "quir_mesa", label: "MESA DE CIRUGÍA TIPO MAYO", type: "number" },
      { id: "quir_cardio", label: "CARDIODESFIBRILADOR", type: "number" },
      { id: "quir_lamp", label: "LÁMPARA CIÁLITICA", type: "number" },
    ],
  },
];

const HARDCODED_UTI_SERVICE = {
  id: "hardcoded_uti_pro",
  name: "UNIDAD DE TERAPIA INTENSIVA",
  sections: UTI_SECTIONS,
};

const DEFAULT_TIPOLOGIA = "CLÍNICAS, SANATORIOS Y HOSPITALES";

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
  const [generalObs, setGeneralObs] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [signatureStep, setSignatureStep] = useState(0); // 0: cerrado, 1: responsable, 2: inspector
  const [signatures, setSignatures] = useState({
    representative: null,
    inspector: null,
  });

  const photoInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
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
  const [selectedSubService, setSelectedSubService] = useState("UTI");
  const [serviciosEfector, setServiciosEfector] = useState([]);
  const [infraEfector, setInfraEfector] = useState({});
  const [rrhhEfector, setRrhhEfector] = useState([]);
  const [equiposEfector, setEquiposEfector] = useState([]);

  useEffect(() => {
    const loadFromCache = () => {
      const cachedSrv = localStorage.getItem("efector_servicios");
      const cachedInfra = localStorage.getItem("efector_infra");
      const cachedRrhh = localStorage.getItem("efector_rrhh");
      const cachedEquipos = localStorage.getItem("efector_equipos");
      if (cachedSrv) setServiciosEfector(JSON.parse(cachedSrv));
      if (cachedInfra) setInfraEfector(JSON.parse(cachedInfra));
      if (cachedRrhh) setRrhhEfector(JSON.parse(cachedRrhh));
      if (cachedEquipos) setEquiposEfector(JSON.parse(cachedEquipos));
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

    // 3. Escuchar cambios en otras pestañas (Sincronización automática)
    const handleStorageChange = (e) => {
      if (e.key?.startsWith("efector_")) {
        loadFromCache();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [propsServicios, propsInfra, propsRrhh, propsEquipos]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3001/configuraciones_maestras?tipologia=${encodeURIComponent(
            DEFAULT_TIPOLOGIA,
          )}`,
        );
        const data = await res.json();
        if (data && data.length > 0) {
          const masterConfig = data[0];
          // Forzar la existencia de UNIDAD DE TERAPIA INTENSIVA con los campos requeridos
          if (!masterConfig.servicios) masterConfig.servicios = [];
          const utiIdx = masterConfig.servicios.findIndex(
            (s) =>
              s.name?.toUpperCase().includes("TERAPIA INTENSIVA") &&
              !s.name?.toUpperCase().includes("PEDI") &&
              !s.name?.toUpperCase().includes("NEONAT"),
          );
          if (utiIdx !== -1) {
            masterConfig.servicios[utiIdx] = {
              ...masterConfig.servicios[utiIdx],
              ...HARDCODED_UTI_SERVICE,
            };
          } else {
            masterConfig.servicios.push(HARDCODED_UTI_SERVICE);
          }

          // Parche para UCO y UCIM (Cuidados Intermedios)
          const ucoSrv = masterConfig.servicios.find(
            (s) =>
              s.name?.toUpperCase().includes("CORONARI") ||
              s.name?.toUpperCase().includes("UCO"),
          );
          if (ucoSrv) ucoSrv.sections = UTI_SECTIONS;
          const ucimSrv = masterConfig.servicios.find(
            (s) =>
              s.name?.toUpperCase().includes("INTERMEDIA") ||
              s.name?.toUpperCase().includes("UCIM"),
          );
          if (ucimSrv) ucimSrv.sections = UTI_SECTIONS;

          // Parche para QUIRÓFANO
          let quirSrv = masterConfig.servicios.find((s) => {
            const n = s.name?.toUpperCase() || "";
            return n.includes("QUIRÓFANO") || n.includes("QUIRÓFANO");
          });

          if (!quirSrv) {
            quirSrv = { id: "srv-quirofano-hardcoded", name: "QUIRÓFANO" };
            masterConfig.servicios.push(quirSrv);
          }
          quirSrv.sections = QUIROFANO_SECTIONS;

          setConfig(masterConfig);
        }
      } catch (err) {
        console.error("Error al cargar configuración", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const handleFieldChange = (fieldId, value) => {
    setInspectorData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
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

  const datosGeneralesSrv = config?.servicios?.find((s) =>
    s.name?.toUpperCase().includes("DATOS GENERALES"),
  );

  const otherServices =
    config?.servicios?.filter((s) => {
      const isGeneral = s.name?.toUpperCase().includes("DATOS GENERALES");
      if (isGeneral) return false;

      // Normalizado para comparación robusta (sin acentos, mayúsculas)
      const normalize = (str) =>
        str
          ?.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toUpperCase()
          .trim() || "";

      const allEfectorSelection = [
        ...serviciosEfector,
        ...Object.keys(infraEfector || {}).filter(
          (k) => (infraEfector[k] || 0) > 0,
        ),
      ];

      return allEfectorSelection.some((effSrv) => {
        const nSrvName = s.name.toUpperCase();
        const nEffSrv = effSrv.toUpperCase();

        // Coincidencia exacta o robusta
        if (nSrvName === nEffSrv) return true;

        if (normalizedMatch(effSrv, s.name)) {
          // Validar variantes
          const isPed = (str) => str.includes("PEDIAT") || str.includes("UTIP");
          const isNeo = (str) => str.includes("NEONAT") || str.includes("UTIN");
          const isUco = (str) =>
            str.includes("CORONARI") || str.includes("UCO");
          const isUcim = (str) =>
            str.includes("INTERMEDIO") || str.includes("UCIM");

          if (isPed(nSrvName) !== isPed(nEffSrv)) return false;
          if (isNeo(nSrvName) !== isNeo(nEffSrv)) return false;
          if (isUco(nSrvName) !== isUco(nEffSrv)) return false;
          if (isUcim(nSrvName) !== isUcim(nEffSrv)) return false;

          return true;
        }
        return false;
      });
    }) || [];

  const allServiceNames = config?.servicios?.map((s) => s.name) || [];

  const PESTAÑAS = [
    {
      id: "ARQUITECTURA",
      label: "ARQUITECTURA",
      icon: <DomainIcon sx={{ fontSize: 28 }} />,
    },
    {
      id: "RECURSOS HUMANOS",
      label: "RRHH",
      icon: <PeopleIcon sx={{ fontSize: 28 }} />,
    },
    {
      id: "EQUIPAMIENTO",
      label: "EQUIPAMIENTO",
      icon: <MedicalServicesIcon sx={{ fontSize: 28 }} />,
    },
    {
      id: "SALAS Y CAMAS",
      label: "SALAS Y CAMAS",
      icon: <BedIcon sx={{ fontSize: 28 }} />,
    },
    {
      id: "SERVICIOS",
      label: "SERVICIOS",
      icon: <LocalHospitalIcon sx={{ fontSize: 28 }} />,
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
          gap: 2,
          mb: 1,
          mt: 1,
          width: "100%",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <LinearProgress
            variant="determinate"
            value={stats.percent}
            sx={{
              height: 8,
              borderRadius: 3,
              bgcolor: "#f1f5f9",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#b7b7b7",
                borderRadius: 3,
              },
            }}
          />
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 900,
            minWidth: 45,
            color: "#64748b",
            textAlign: "right",
          }}
        >
          {stats.percent}%
        </Typography>
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
        maxWidth: 800,
        pt: 4,
        pb: 10,
      }}
    >
      {/* Header del Establecimiento (Lo primero que ve) */}
      <Box
        sx={{
          mb: 4,
          p: 4,
          bgcolor: "#f8fafc",
          borderRadius: 6,
          border: "1px solid #e2e8f0",
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "6px",
            height: "100%",
            bgcolor: "#0ea5e9",
          }}
        />
        <Typography
          variant="h3"
          sx={{
            fontWeight: 950,
            color: "#1e293b",
            mb: 1,
            letterSpacing: "-0.025em",
            fontSize: { xs: "2rem", sm: "2.5rem" },
          }}
        >
          SANATORIO ALLENDE
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <LocalHospitalIcon sx={{ color: "#0ea5e9", fontSize: 24 }} />
          <Typography
            variant="h6"
            sx={{
              color: "#64748b",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: "0.9rem",
            }}
          >
            Clínicas, Sanatorios y Hospitales
          </Typography>
        </Box>
      </Box>

      {datosGeneralesSrv && (
        <Accordion
          expanded={expandedDatosGenerales}
          onChange={() => setExpandedDatosGenerales(!expandedDatosGenerales)}
          sx={{
            mb: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            borderRadius: "16px !important",
            "&:before": { display: "none" },
            border: "1px solid #e2e8f0",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#0ea5e9" }} />}
            sx={{ px: { xs: 2, sm: 3 }, py: 1 }}
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
                variant="h5"
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
              py: 3,
              bgcolor: "#ffffffff",
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
                        <AccordionDetails sx={{ py: 3 }}>
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                              gap: 3,
                            }}
                          >
                            {sec.fields.map((field) => (
                              <FieldItem
                                key={field.id}
                                field={field}
                                value={inspectorData[field.id]}
                                onChange={handleFieldChange}
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
          mb: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          borderRadius: "16px !important",
          "&:before": { display: "none" },
          border: "1px solid #e2e8f0",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "#0ea5e9" }} />}
          sx={{ px: { xs: 2, sm: 3 }, py: 1 }}
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
              variant="h5"
              sx={{ fontWeight: 900, color: "#1e293b" }}
            >
              DATOS DEL ESTABLECIMIENTO
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 700 }}>
               Estado de carga por áreas técnicas
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: { xs: 2, sm: 3 }, py: 3, bgcolor: "#ffffffff", borderTop: "1px solid #e2e8f0" }}>
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
                top: 28,
                left: { xs: 30, sm: 80 },
                right: { xs: 30, sm: 80 },
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
                    width: "20%",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
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
              {activeSubServicios.length === 0 && (
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#ef4444", fontWeight: 700, mb: 1 }}
                  >
                    El efector no ha declarado ningún servicio de este tipo.
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      setServiciosEfector([
                        "UNIDADES DE TERAPIA INTENSIVA",
                        "CUIDADOS INTERMEDIOS",
                      ])
                    }
                    sx={{ borderRadius: 4, textTransform: "none", fontWeight: 700 }}
                  >
                    Simular servicios técnicos para demo
                  </Button>
                </Box>
              )}
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
            {/* Header del Establecimiento */}

            {selectedCategory === "ARQUITECTURA" && (
              <Box sx={{ mb: 6 }}>
                <Box sx={{ mb: 3, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 32,
                        bgcolor: "#0ea5e9",
                        borderRadius: 4,
                      }}
                    />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 900,
                        color: "#1e293b",
                        letterSpacing: -0.5,
                      }}
                    >
                      VISUALIZACIÓN DE PLANOS Y DOCUMENTACIÓN
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", mt: 1, fontWeight: 700 }}
                  >
                    Revise la documentación técnica cargada por el establecimiento
                    para validar su coincidencia con la realidad.
                  </Typography>
                </Box>

                <PlansTable
                  inspectorData={inspectorData}
                  onChange={handleFieldChange}
                  onOpenViewer={setViewerFile}
                />
              </Box>
            )}

            <FileViewerModal
              file={viewerFile}
              onClose={() => setViewerFile(null)}
            />

            {selectedCategory === "SALAS Y CAMAS" && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ mb: 3, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 32,
                        bgcolor: "#0ea5e9",
                        borderRadius: 4,
                      }}
                    />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 900,
                        color: "#1e293b",
                        letterSpacing: -0.5,
                      }}
                    >
                      GLOBAL: SALAS Y CAMAS CARGADAS
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", mt: 1, fontWeight: 600 }}
                  >
                    A continuación se listan todas las salas y camas declaradas por
                    el efector para su validación general.
                  </Typography>
                </Box>

                <VerificationTable
                  fields={Object.keys(infraEfector || {})
                    .filter((key) => infraEfector[key] > 0)
                    .map((key) => ({
                      id: `global_infra_${key}`,
                      label: key,
                      name: key,
                    }))}
                  inspectorData={inspectorData}
                  onChange={handleFieldChange}
                  infraEfector={infraEfector}
                  currentSrvName="GENERAL"
                />
                <Divider sx={{ my: 4, borderStyle: "dashed" }} />
              </Box>
            )}
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
                    // Ocultar arquitectura/equipos generales en pestaña servicios
                    return (
                      !n.includes("ARQUITECTURA") &&
                      !n.includes("EQUIPAMIENTO") &&
                      !n.includes("RECURSOS") &&
                      !n.includes("RRHH")
                    );
                  });
                }
              } else {
                if (srv.sections) {
                  const keyword =
                    selectedCategory === "RECURSOS HUMANOS"
                      ? "RECURSOS"
                      : selectedCategory === "SALAS Y CAMAS"
                        ? "SALA"
                        : selectedCategory;
                  matchedSections = srv.sections.filter(
                    (sec) =>
                      sec.name.toUpperCase().includes(keyword) ||
                      (selectedCategory === "SALAS Y CAMAS" &&
                        sec.name.toUpperCase().includes("CAMA")),
                  );
                }
              }

              if (!matchedSections || matchedSections.length === 0) return null;

              const blockStats = getCompletionStats(getFlatFields(matchedSections));

              return (
                <Box key={srv.id} sx={{ mb: 2 }}>
                  <Box sx={{ mb: 3, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 32,
                          bgcolor: "#475569",
                          borderRadius: 4,
                        }}
                      />
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 900,
                          color: "#1e293b",
                          letterSpacing: -0.5,
                        }}
                      >
                        {srv.name}
                      </Typography>
                    </Box>
                    {renderProgressBar(blockStats)}
                  </Box>

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
                          }}
                        >
                          {section.name}
                        </Typography>
                      )}

                      {selectedCategory === "EQUIPAMIENTO" ||
                      selectedCategory === "RECURSOS HUMANOS" ||
                      selectedCategory === "SALAS Y CAMAS" ? (
                        <VerificationTable
                          fields={section.fields.filter((f) => {
                            // En Arquitectura/Camas siempre filtramos si hay 0 declarado para no saturar
                            if (selectedCategory === "SALAS Y CAMAS") {
                              const name = f.label || f.name;
                              return infraEfector[name] > 0;
                            }
                            // En Equipamiento y RRHH mostramos TODO lo configurado para que el inspector audite
                            return true;
                          })}
                          inspectorData={inspectorData}
                          onChange={handleFieldChange}
                          infraEfector={infraEfector}
                          rrhhEfector={rrhhEfector}
                          equiposEfector={equiposEfector}
                          currentSrvName={srv.name}
                        />
                      ) : (
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                            gap: 3,
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
                  <Divider sx={{ mb: 2, mt: 4, opacity: 0.5 }} />
                </Box>
              );
            })}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Observación General */}
      <Box sx={{ mt: 6, mb: 4 }}>
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

          <Button
            variant="outlined"
            onClick={() => fileInputRef.current.click()}
            startIcon={<CloudUpload />}
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
            Adjuntar Archivo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            multiple
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
          FINALIZAR ACTA
        </Button>
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

const FieldItem = ({ field, value, onChange }) => {
  const renderInput = () => {
    switch (field.type) {
      case "boolean":
      case "checkbox":
        return (
          <ToggleButtonGroup
            value={value === undefined ? null : value ? "si" : "no"}
            exclusive
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
            value={value || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            InputLabelProps={{ shrink: true }}
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
      case "toggle":
        return (
          <ToggleButtonGroup
            value={value}
            exclusive
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
            value={value || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            InputProps={{
              sx: {
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
            value={value || ""}
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
            value={value || ""}
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
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "flex-end",
          mb: 0.5,
          width: "100%",
          boxSizing: "border-box",
          minWidth: 0,
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            color: "#334155",
            lineHeight: 1.2,
            fontSize: "13px",
            textTransform: "uppercase",
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            maxWidth: "100%",
            display: "block",
          }}
        >
          {field.label}
        </Typography>
      </Box>
      <Box sx={{ width: "100%", boxSizing: "border-box", minWidth: 0 }}>
        {renderInput()}
      </Box>
    </Box>
  );
};

const VerificationTable = ({
  fields,
  inspectorData,
  onChange,
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
              field.cantidadMinima ?? field.valorDeclarado ?? 1;

            // 1. INFRAESTRUCTURA (Camas/Salas)
            const name = field.label || field.name;
            if (infraEfector && infraEfector[name] !== undefined) {
              valorDeclarado = infraEfector[name];
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
                // El valor esperado es al menos 1 por cada quirófano declarado
                valorDeclarado = Math.max(orCount, equipoMatch.length);
              } else if (equipoMatch.length > 0) {
                valorDeclarado = equipoMatch.length;
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
                    <TextField
                      size="small"
                      type="number"
                      placeholder="Cant."
                      value={valorObj}
                      onChange={(e) => update("valor", e.target.value)}
                      error={hasError}
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-root": {
                          bgcolor: "white",
                          fontWeight: 800,
                          height: 38,
                        },
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {isObservado && (
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Razones, marcas, estado..."
                      value={obsText}
                      onChange={(e) => update("obs", e.target.value)}
                      sx={{
                        "& .MuiInputBase-root": {
                          bgcolor: "white",
                          minHeight: 38,
                          fontSize: "0.85rem",
                        },
                      }}
                    />
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

const PlansTable = ({ inspectorData, onChange, onOpenViewer }) => {
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
                        sx={{ color: isObserved ? "#0ea5e9" : "#cbd5e1" }}
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
