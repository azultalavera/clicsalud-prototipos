import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  TextField,
  MenuItem,
  Stack,
<<<<<<< Updated upstream
=======
  Grid,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
  Tooltip,
  Fab,
>>>>>>> Stashed changes
} from "@mui/material";
<<<<<<< Updated upstream
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
=======
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import DomainIcon from "@mui/icons-material/Domain";
import PeopleIcon from "@mui/icons-material/People";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import BedIcon from "@mui/icons-material/Bed";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
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
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
import SaveIcon from "@mui/icons-material/Save";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PersonIcon from "@mui/icons-material/Person";
>>>>>>> Stashed changes
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";

<<<<<<< Updated upstream
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
=======
const normalize = (str) =>
  str
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim() || "";

const getFlatFields = (sectionsObj) => {
  if (!sectionsObj) return [];
  if (Array.isArray(sectionsObj)) {
    return sectionsObj.reduce(
      (acc, sec) => [...acc, ...(sec.fields || [])],
      [],
    );
  }
  return [];
>>>>>>> Stashed changes
};

const DEFAULT_TIPOLOGIA = "CLÍNICAS, SANATORIOS Y HOSPITALES";

const PantallaInspeccion = ({
  serviciosEfector: propsServicios,
  infraEfector: propsInfra,
  rrhhEfector: propsRrhh,
  equiposEfector: propsEquipos,
  tipologia: propsTipologia,
  directorTecnico: propsDT,
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

<<<<<<< Updated upstream
=======
  const [obsDialog, setObsDialog] = useState({
    open: false,
    fieldId: null,
    label: "",
    value: "",
    category: "TRAMITE", // Nueva prop: GENERAL or TRAMITE
  });

  const [currentActa, setCurrentActa] = useState(2);
  const efectorResponses = {
    Quirófanos: {
      msg: "Se adjunta plano rectificado con 11 quirófanos.",
      file: "plano_final.pdf",
    },
    "Plan de Evacuación": {
      msg: "Nuevo plan aprobado por bomberos.",
      file: "bomberos.pdf",
    },
  };

  const handleOpenObsDialog = (
    fieldId,
    label,
    currentValue,
    category = "TRAMITE",
  ) => {
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
    const isObject =
      currentData &&
      typeof currentData === "object" &&
      !Array.isArray(currentData);

    // Actualizar dato individual preservando el valor actual
    handleFieldChange(obsDialog.fieldId, {
      ...(isObject ? currentData : { value: currentData }),
      obs: text,
    });

    setObsDialog({ ...obsDialog, open: false });
  };

>>>>>>> Stashed changes
  const photoInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
<<<<<<< Updated upstream
=======

    // Persistir como Base64 para que el efector pueda verlas
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const currentPhotos = JSON.parse(
          localStorage.getItem("inspector_photos") || "[]",
        );
        localStorage.setItem(
          "inspector_photos",
          JSON.stringify([
            ...currentPhotos,
            { name: file.name, data: base64String },
          ]),
        );
      };
      reader.readAsDataURL(file);
    });
>>>>>>> Stashed changes
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

  const handleClearActa = () => {
    setInspectorData({});
    setObsDatosGenerales([]);
    setObsDatosTramite([]);
    setGeneralObs("");
    setAttachments([]);
    setSignatures({ representative: null, inspector: null });
    setSignatureStep(0);
    setSignatureModalOpen(false);
    localStorage.removeItem("inspector_photos");
  };

  const [expandedDatosGenerales, setExpandedDatosGenerales] = useState(true);
  const [expandedEstablecimiento, setExpandedEstablecimiento] = useState(true);
<<<<<<< Updated upstream
  const [selectedCategory, setSelectedCategory] = useState("ARQUITECTURA");
  const [selectedSubService, setSelectedSubService] = useState("UTI");
=======
  const [selectedCategory, setSelectedCategory] = useState("SALAS Y CAMAS");
  const [selectedSubService, setSelectedSubService] = useState("");
>>>>>>> Stashed changes
  const [serviciosEfector, setServiciosEfector] = useState([]);
  const [infraEfector, setInfraEfector] = useState({});
  const [rrhhEfector, setRrhhEfector] = useState([]);
  const [equiposEfector, setEquiposEfector] = useState([]);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
  const [tipologia, setTipologia] = useState("CLÍNICAS, SANATORIOS Y HOSPITALES");
  const [directorTecnico, setDirectorTecnico] = useState({ nombre: "JUAN CARLOS", apellido: "PÉREZ", dni: "20.455.123" });

  const datosGeneralesSrv = React.useMemo(() =>
    config?.servicios?.find((s) => normalize(s.name).includes("DATOS GENERALES")),
    [config]
=======
  const [tipologia, setTipologia] = useState(
    "CLÍNICAS, SANATORIOS Y HOSPITALES",
  );
  const [directorTecnico, setDirectorTecnico] = useState({
    nombre: "JUAN CARLOS",
    apellido: "PÉREZ",
    dni: "20.455.123",
  });

  const datosGeneralesSrv = React.useMemo(
    () =>
      config?.servicios?.find((s) =>
        normalize(s.name).includes("DATOS GENERALES"),
      ),
    [config],
>>>>>>> Stashed changes
  );

  const otherServices = React.useMemo(() => {
    return (
      config?.servicios?.filter((s) => {
        const isGeneral = normalize(s.name).includes("DATOS GENERALES");
        if (isGeneral) return false;

        const allEfectorSelection = [
          ...(serviciosEfector || []),
          ...Object.keys(infraEfector || {}).filter(
            (k) => (infraEfector[k] || 0) > 0,
          ),
        ];

        return allEfectorSelection.some((effSrv) => {
          const nSrvName = (s.name || "").toUpperCase();
          const nEffSrv = (effSrv || "").toUpperCase();

          if (nSrvName === nEffSrv) return true;

<<<<<<< Updated upstream
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
=======
          // Lógica de variantes
          if (nSrvName.includes(nEffSrv) || nEffSrv.includes(nSrvName)) {
            const isPed = (str) =>
              str.includes("PEDIAT") || str.includes("UTIP");
            const isNeo = (str) =>
              str.includes("NEONAT") || str.includes("UTIN");
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
      }) || []
    );
>>>>>>> Stashed changes
  }, [config, serviciosEfector, infraEfector]);
>>>>>>> Stashed changes

  useEffect(() => {
    const loadFromCache = () => {
      const cachedSrv = localStorage.getItem("efector_servicios");
      const cachedInfra = localStorage.getItem("efector_infra");
      const cachedRrhh = localStorage.getItem("efector_rrhh");
      const cachedEquipos = localStorage.getItem("efector_equipos");
      if (cachedSrv) setServiciosEfector(JSON.parse(cachedSrv));
      if (cachedInfra) setInfraEfector(JSON.parse(cachedInfra));
      else {
        // Mock data para el prototipo si no hay cache
        setInfraEfector({
          "Consultorios de Guardia": 4,
          "Box de Atención": 6,
          "Sala de Rayos X": 1,
          "Camas de Internación": 24,
          "Camas de UTI": 8,
          "Cunas de Neonatología": 12,
          "Puestos de Diálisis": 5,
        });
      }
      if (cachedRrhh) setRrhhEfector(JSON.parse(cachedRrhh));
      if (cachedEquipos) setEquiposEfector(JSON.parse(cachedEquipos));
    };

<<<<<<< Updated upstream
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

<<<<<<< Updated upstream
=======
    // 4. Cargar persistencia
    const savedData = localStorage.getItem("inspector_data");
    const savedGenObs = localStorage.getItem("obs_datos_generales");
    const savedTraObs = localStorage.getItem("obs_datos_tramite");
    const savedManualObs = localStorage.getItem("general_obs");

    if (savedData) setInspectorData(JSON.parse(savedData));
=======
    // 1. Cargar desde Props si están presentes, sino Cache
    if (propsServicios) setServiciosEfector(propsServicios);
>>>>>>> Stashed changes
    else {
      const cached = localStorage.getItem("efector_servicios");
      if (cached) setServiciosEfector(JSON.parse(cached));
    }

<<<<<<< Updated upstream
    if (savedGenObs) {
      try { setObsDatosGenerales(JSON.parse(savedGenObs)); } catch (e) { setObsDatosGenerales([]); }
    }
    if (savedTraObs) {
      try { setObsDatosTramite(JSON.parse(savedTraObs)); } catch (e) { setObsDatosTramite([]); }
=======
    if (propsInfra) setInfraEfector(propsInfra);
    else {
      const cached = localStorage.getItem("efector_infra");
      if (cached) setInfraEfector(JSON.parse(cached));
    }

    if (propsRrhh) setRrhhEfector(propsRrhh);
    else {
      const cached = localStorage.getItem("efector_rrhh");
      if (cached) setRrhhEfector(JSON.parse(cached));
    }

    if (propsEquipos) setEquiposEfector(propsEquipos);
    else {
      const cached = localStorage.getItem("efector_equipos");
      if (cached) setEquiposEfector(JSON.parse(cached));
    }

    if (propsTipologia) setTipologia(propsTipologia);
    else {
      const cached = localStorage.getItem("efector_tipo");
      if (cached) setTipologia(cached);
    }

    if (propsDT) setDirectorTecnico(propsDT);
    else {
      const cached = localStorage.getItem("efector_dt");
      if (cached) setDirectorTecnico(JSON.parse(cached));
>>>>>>> Stashed changes
    }

>>>>>>> Stashed changes
    // 3. Escuchar cambios en otras pestañas (Sincronización automática)
    const handleStorageChange = (e) => {
      if (e.key?.startsWith("efector_")) {
        loadFromCache();
      }
    };

    // 4. Cargar persistencia (Inspector)
    const savedData = localStorage.getItem("inspector_data");
    const savedGenObs = localStorage.getItem("obs_datos_generales");
    const savedTraObs = localStorage.getItem("obs_datos_tramite");
    const savedManualObs = localStorage.getItem("general_obs");

    if (savedData) setInspectorData(JSON.parse(savedData));
    else {
      setInspectorData({
        "f-fecqs7p6": new Date().toISOString().split("T")[0],
      });
    }

    if (savedGenObs) {
      try {
        setObsDatosGenerales(JSON.parse(savedGenObs));
      } catch (e) {
        setObsDatosGenerales([]);
      }
    }
    if (savedTraObs) {
      try {
        setObsDatosTramite(JSON.parse(savedTraObs));
      } catch (e) {
        setObsDatosTramite([]);
      }
    }
    if (savedManualObs) setGeneralObs(savedManualObs);

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [
    propsServicios,
    propsInfra,
    propsRrhh,
    propsEquipos,
    propsTipologia,
    propsDT,
  ]);

<<<<<<< Updated upstream
=======
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

    const extractValue = (val) =>
      val && typeof val === "object" && !Array.isArray(val) ? val.value : val;
    const extractObs = (val) =>
      val && typeof val === "object" && !Array.isArray(val) ? val.obs : "";

    // 1. Datos Generales
    let genSummary = [];
    const genFields = datosGeneralesSrv?.sections
      ? getFlatFields(datosGeneralesSrv.sections)
      : datosGeneralesSrv?.fields || [];

    genFields.forEach((f) => {
      const fieldData = inspectorData[f.id];
      const val = extractValue(fieldData);
      const obs = extractObs(fieldData);

<<<<<<< Updated upstream
      if ((f.type === 'boolean' || f.type === 'checkbox') && val === false) {
        genSummary.push({ label: f.label, text: `NO CUMPLE${obs ? ` (${obs})` : ''}`, type: 'ERROR' });
=======
      if ((f.type === "boolean" || f.type === "checkbox") && val === false) {
        genSummary.push({
          label: f.label,
          text: `NO CUMPLE${obs ? ` (${obs})` : ""}`,
          type: "ERROR",
        });
>>>>>>> Stashed changes
      } else if (obs) {
        genSummary.push({ label: f.label, text: obs, type: "OBS" });
      }
    });
    setObsDatosGenerales(genSummary);

    // 2. Datos Trámite
    let traSummary = [];
    let emplazamientos = []; // Nuevos emplazamientos para el efector

    otherServices.forEach((srv) => {
      const srvFields = srv.sections
        ? getFlatFields(srv.sections)
        : srv.fields || [];
      srvFields.forEach((f) => {
        const fieldData = inspectorData[f.id];
        const val = extractValue(fieldData);
        const obs = extractObs(fieldData);
        const isDoc =
          f.id?.includes("doc") || f.label?.toUpperCase().includes("DOCUMENTO");
        let isIrregularidadTramite = false;
        let razonIrregular = "";

        // Regla 1: Datos Generales / Otros (Boolean NO CUMPLE) -> OBSERVACIÓN DE ACTA
        if ((f.type === "boolean" || f.type === "checkbox") && val === false) {
          traSummary.push({
            label: f.label,
            service: srv.name,
            text: `NO CUMPLE${obs ? ` (${obs})` : ""}`,
            type: "ERROR",
          });
        } else if (obs && !isDoc) {
          // Observaciones manuales en campos normales -> OBSERVACIÓN DE ACTA
          traSummary.push({
            label: f.label,
            service: srv.name,
            text: obs,
            type: "OBS",
          });
        }

        // Regla 2: Camas y Salas (Actual > Declarado) -> IRREGULARIDAD TRÁMITE
        const isCamaSala =
          f.label?.toUpperCase().includes("CAMA") ||
          f.label?.toUpperCase().includes("SALA") ||
          f.label?.toUpperCase().includes("HABITACIÓN");
        if (isCamaSala && typeof val === "number") {
          const declarado = infraEfector[f.label] || 0;
          if (val > declarado) {
            isIrregularidadTramite = true;
            razonIrregular = `Cantidad superior a la declarada (${val} vs ${declarado})`;
          }
        }

        // Regla 3: Equipamiento (Actual < Declarado) -> IRREGULARIDAD TRÁMITE
<<<<<<< Updated upstream
        const isEquip = f.label?.toUpperCase().includes('EQUIPO') || f.label?.toUpperCase().includes('EQUIPAMIENTO') || f.id?.includes('eq');
        if (isEquip && typeof val === 'number') {
          const equipoMatch = equiposEfector?.filter(e => e.equipamiento === f.label && e.origen === srv.name) || [];
          const declarado = equipoMatch.reduce((acc, curr) => acc + (curr.actualQty || 1), 0);
=======
        const isEquip =
          f.label?.toUpperCase().includes("EQUIPO") ||
          f.label?.toUpperCase().includes("EQUIPAMIENTO") ||
          f.id?.includes("eq");
        if (isEquip && typeof val === "number") {
          const equipoMatch =
            equiposEfector?.filter(
              (e) => e.equipamiento === f.label && e.origen === srv.name,
            ) || [];
          const declarado = equipoMatch.reduce(
            (acc, curr) => acc + (curr.actualQty || 1),
            0,
          );
>>>>>>> Stashed changes
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
            estado: "PENDIENTE DE SUBIR",
          });
        }
      });
    });
    setObsDatosTramite(traSummary);

    localStorage.setItem("obs_datos_generales", JSON.stringify(genSummary));
    localStorage.setItem("obs_datos_tramite", JSON.stringify(traSummary));
    localStorage.setItem(
      "inspector_emplazamientos",
      JSON.stringify(emplazamientos),
    );
  }, [inspectorData, config, datosGeneralesSrv, otherServices]);

  const hasObservations =
    (obsDatosGenerales?.length || 0) > 0 ||
    (obsDatosTramite?.length || 0) > 0 ||
    (generalObs || "").trim().length > 0;

>>>>>>> Stashed changes
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
    "HEMODINAMIA",
    "HOSPITAL DE DIA",
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
    HEMODINAMIA: ["HEMODINAMIA"],
    "HOSPITAL DE DIA": ["HOSPITAL DE DIA"],
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
          nSrv.includes("INTERMEDIA") ||
          nSrv.includes("HEMODIALISIS") ||
          nSrv.includes("HEMODINAMIA") ||
          nSrv.includes("HOSPITAL DE DIA"));

      // Si es exactamente la UTI que buscamos, nunca la excluimos de su propio chip
      if (
        sub === "UTI" &&
        (nSrv.includes("TERAPIA INTENSIVA") || nSrv.includes("UTI"))
      ) {
        if (
          !nSrv.includes("PEDIAT") &&
          !nSrv.includes("NEONAT") &&
          !nSrv.includes("CORONARI") &&
          !nSrv.includes("INTERMEDIA")
        )
          return true;
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

<<<<<<< Updated upstream
  const handleFieldChange = (fieldId, value) => {
    setInspectorData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
=======
  const handleFieldChange = (fieldId, newValue) => {
    setInspectorData((prev) => {
      const current = prev[fieldId];
<<<<<<< Updated upstream
      const isCurrentObject = current && typeof current === 'object' && !Array.isArray(current);
      const isNewValueObject = newValue && typeof newValue === 'object' && !Array.isArray(newValue);

      if (isCurrentObject && isNewValueObject) {
        return {
          ...prev,
          [fieldId]: {
            ...current,
            ...newValue,
          },
        };
      }

      if (isNewValueObject && 'obs' in newValue && !isCurrentObject) {
        return {
          ...prev,
          [fieldId]: {
            value: current,
            ...newValue,
          },
        };
=======
      const isObject =
        current && typeof current === "object" && !Array.isArray(current);

      // Si el newValue ya es un objeto (como el que viene de handleSaveObs), lo usamos directo
      if (
        newValue &&
        typeof newValue === "object" &&
        !Array.isArray(newValue) &&
        "obs" in newValue
      ) {
        return { ...prev, [fieldId]: newValue };
>>>>>>> Stashed changes
      }

      return {
        ...prev,
<<<<<<< Updated upstream
        [fieldId]: newValue,
=======
        [fieldId]: isObject ? { ...current, value: newValue } : newValue,
>>>>>>> Stashed changes
      };
    });
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      id: "RECURSOS HUMANOS",
=======
      id: "SALAS_Y_CAMAS",
      label: "SALAS Y CAMAS",
      icon: <BedIcon sx={{ fontSize: 28 }} />,
    },
    {
      id: "SERVICIOS",
      label: "SERVICIOS",
      icon: <LocalHospitalIcon sx={{ fontSize: 28 }} />,
    },
    {
      id: "RRHH",
>>>>>>> Stashed changes
      label: "RRHH",
      icon: <PeopleIcon sx={{ fontSize: 28 }} />,
    },
    {
      id: "EQUIPAMIENTO",
      label: "EQUIPAMIENTOS",
      icon: <MedicalServicesIcon sx={{ fontSize: 28 }} />,
    },
    {
<<<<<<< Updated upstream
      id: "SALAS Y CAMAS",
      label: "SALAS Y CAMAS",
      icon: <BedIcon sx={{ fontSize: 28 }} />,
    },
    {
      id: "SERVICIOS",
      label: "SERVICIOS",
      icon: <LocalHospitalIcon sx={{ fontSize: 28 }} />,
=======
      id: "DOCUMENTACION",
      label: "DOCUMENTOS ADJUNTOS",
      icon: <DescriptionIcon sx={{ fontSize: 28 }} />,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            fontWeight: 900,
            minWidth: 45,
            color: "#64748b",
            textAlign: "right",
=======
            fontWeight: 800,
            fontSize: "0.75rem",
            bgcolor: stats.percent === 100 ? "#def7ed" : "#f1f5f9",
            color: stats.percent === 100 ? "#065f46" : "#64748b",
            height: 20,
            "& .MuiChip-label": { px: 1 },
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
          borderRadius: 4,
          borderLeft: "8px solid #0090d0",
          bgcolor: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          border: "1px solid #e2e8f0",
          width: "100%",
        }}
      >
        <Typography
          variant="h3"
          sx={{ fontWeight: 950, color: "#0f172a", mb: 1, letterSpacing: -1.5 }}
        >
          {inspectorData["f-nomtcemx"] || "SANATORIO ALLENDE"}
        </Typography>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              bgcolor: "#0090d0",
              color: "white",
              borderRadius: 1.5,
              p: 0.4,
              display: "flex",
            }}
          >
            <LocalHospitalIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 850,
              color: "#64748b",
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            {tipologia}
          </Typography>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 2, height: 20, my: "auto" }}
          />

          <Typography
            variant="caption"
            sx={{ fontWeight: 800, color: "#64748b" }}
          >
            DIRECTOR TÉCNICO:{" "}
            <Box component="span" sx={{ color: "#0f172a", fontWeight: 900 }}>
              {directorTecnico.nombre} {directorTecnico.apellido}
            </Box>
          </Typography>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 2, height: 20, my: "auto" }}
          />

          <Typography
            variant="caption"
            sx={{ fontWeight: 800, color: "#64748b" }}
          >
            DNI:{" "}
            <Box component="span" sx={{ color: "#0f172a", fontWeight: 900 }}>
              {directorTecnico.dni}
            </Box>
          </Typography>
        </Stack>
      </Paper>

      {/* Selector de Acta */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
        <ToggleButtonGroup
          value={currentActa}
          exclusive
          onChange={(e, v) => v && setCurrentActa(v)}
          sx={{
            bgcolor: "#f1f5f9",
            p: 0.5,
            borderRadius: 4,
            "& .MuiToggleButton-root": {
              px: 4,
              py: 1,
              borderRadius: 3,
              border: "none",
              fontWeight: 900,
              fontSize: "0.85rem",
              color: "#64748b",
              "&.Mui-selected": {
                bgcolor: "white",
                color: "#0ea5e9",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                "&:hover": { bgcolor: "white" },
              },
            },
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
      {currentActa === 1 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {/* RESUMEN DE OBSERVACIONES ARRIBA */}
          <Box>
            <Typography
              variant="h5"
>>>>>>> Stashed changes
              sx={{
                fontWeight: 950,
                color: "#0f172a",
                mb: 3,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
<<<<<<< Updated upstream
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
=======
              RESUMEN DE OBSERVACIONES PENDIENTES
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 900,
                    color: "#475569",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <InfoIcon sx={{ color: "#0ea5e9" }} />
                  DATOS GENERALES
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    bgcolor: "#f8fafc",
                    borderRadius: 4,
                    border: "2px solid #e2e8f0",
                  }}
                >
                  {obsDatosGenerales.length === 0 ? (
                    <Typography sx={{ color: "#94a3b8", fontStyle: "italic" }}>
                      No hay observaciones pendientes.
                    </Typography>
                  ) : (
                    <Box
                      component="ul"
                      sx={{
                        m: 0,
                        pl: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      {obsDatosGenerales.map((obs, idx) => (
                        <Box
                          component="li"
                          key={idx}
>>>>>>> Stashed changes
                          sx={{
                            color:
                              obs.type === "ERROR" ? "#ef4444" : "#475569",
                            fontSize: "0.95rem",
                          }}
                        >
                          <Box component="span" sx={{ fontWeight: 800 }}>
                            {obs.label}:{" "}
                          </Box>
                          {obs.text}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Paper>
              </Box>

              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 900,
                    color: "#475569",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <AssignmentIndIcon sx={{ color: "#0ea5e9" }} />
                  DATOS DEL TRÁMITE
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    bgcolor: "#f8fafc",
                    borderRadius: 4,
                    border: "2px solid #e2e8f0",
                  }}
                >
                  {obsDatosTramite.length === 0 ? (
                    <Typography sx={{ color: "#94a3b8", fontStyle: "italic" }}>
                      No hay observaciones pendientes.
                    </Typography>
                  ) : (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                    >
                      {Object.entries(
                        obsDatosTramite.reduce((acc, obs) => {
                          const srv = obs.service || "OTROS";
                          if (!acc[srv]) acc[srv] = [];
                          acc[srv].push(obs);
                          return acc;
                        }, {}),
                      ).map(([service, items]) => (
                        <Box key={service}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 950,
                              color: "#0369a1",
                              mb: 1.5,
                              fontSize: "0.7rem",
                              textTransform: "uppercase",
                              bgcolor: "#e0f2fe",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              display: "inline-block",
                            }}
                          >
                            {service}
                          </Typography>
<<<<<<< Updated upstream
                          {renderProgressBar(sectionStats)}
                        </AccordionSummary>
                        <AccordionDetails sx={{ py: 3 }}>
=======
>>>>>>> Stashed changes
                          <Box
                            component="ul"
                            sx={{
<<<<<<< Updated upstream
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
=======
                              m: 0,
                              pl: 2,
                              mt: 1,
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                              listStyle: "none",
                            }}
                          >
                            {items.map((obs, idx) => (
                              <Box
                                component="li"
                                key={idx}
                                sx={{
                                  color:
                                    obs.type === "ERROR"
                                      ? "#ef4444"
                                      : "#475569",
                                  fontSize: "0.95rem",
                                  display: "flex",
                                  gap: 1,
                                }}
                              >
                                <Box component="span" sx={{ fontWeight: 800 }}>
                                  - {obs.label}:{" "}
                                </Box>
                                <Box component="span">{obs.text}</Box>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Paper>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* APARTADO DE LOS EMPLAZAMIENTOS */}
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 950,
                color: "#0f172a",
                mb: 3,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              VALIDACIÓN DE EMPLAZAMIENTOS
            </Typography>
            <RevisionActa efectorResponses={efectorResponses} />
          </Box>
        </Box>
      ) : (
        <>
          {datosGeneralesSrv && (
            <Accordion
              expanded={expandedDatosGenerales}
              onChange={() =>
                setExpandedDatosGenerales(!expandedDatosGenerales)
              }
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
                                  gridTemplateColumns:
                                    "repeat(2, minmax(0, 1fr))",
                                  gap: 2,
                                }}
                              >
                                {sec.fields.map((field) => (
                                  <FieldItem
                                    key={field.id}
                                    field={field}
                                    value={inspectorData[field.id]}
                                    onChange={handleFieldChange}
                                    onOpenObs={(fid, lbl, val) =>
                                      handleOpenObsDialog(
                                        fid,
                                        lbl,
                                        val,
                                        "GENERAL",
                                      )
                                    }
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
                          onOpenObs={(fid, lbl, val) =>
                            handleOpenObsDialog(fid, lbl, val, "GENERAL")
                          }
                        />
                      ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          )}
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
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
=======
            <Typography variant="h6" sx={{ fontWeight: 900, color: "#1e293b" }}>
              DATOS DEL TRÁMITE
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#64748b", fontWeight: 700 }}
            >
              Estado de carga por áreas técnicas y servicios declarados
            </Typography>
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
          {currentActa === 1 ? (
            <RevisionActa
              section="TRAMITE"
              efectorResponses={efectorResponses}
            />
          ) : (
            <>
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
                          fontSize: {
                            xs: "0.65rem",
                            sm: "0.75rem",
                            md: "0.8rem",
                          },
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
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 900,
                      mb: 2,
                      color: "#1e293b",
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      letterSpacing: 1,
                    }}
                  >
                    LISTADO DE SERVICIOS REGISTRADOS
                  </Typography>
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <Table size="small">
                      <TableHead sx={{ bgcolor: "#f1f5f9" }}>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 900,
                              color: "#64748b",
                              fontSize: "0.65rem",
                              py: 1,
                            }}
                          >
                            SERVICIO DECLARADO
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              fontWeight: 900,
                              color: "#64748b",
                              fontSize: "0.65rem",
                              width: 100,
                              py: 1,
                            }}
                          >
                            OBSERVADO
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              fontWeight: 900,
                              color: "#64748b",
                              fontSize: "0.65rem",
                              width: 120,
                              py: 1,
                            }}
                          >
                            OBSERVACIÓN
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(serviciosEfector || []).map((s, i) => {
                          const srvId = `srv-verify-${s.replace(/\s+/g, "-").toLowerCase()}`;
                          const currentVal = inspectorData[srvId] || {};
                          return (
                            <TableRow
                              key={i}
                              sx={{
                                "&:nth-of-type(odd)": { bgcolor: "#fcfcfc" },
                              }}
                            >
                              <TableCell
                                sx={{
                                  fontWeight: 700,
                                  color: "#475569",
                                  py: 1.5,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: "50%",
                                      bgcolor: "#0ea5e9",
                                    }}
                                  />
                                  {s}
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Checkbox
                                  checked={currentVal.observado || false}
                                  onChange={(e) =>
                                    handleFieldChange(srvId, {
                                      ...currentVal,
                                      observado: e.target.checked,
                                    })
                                  }
                                  color="success"
                                  size="small"
                                />
                              </TableCell>
                              <TableCell align="center">
                                {currentVal.observado && (
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleOpenObsDialog(
                                        srvId,
                                        `SERVICIO: ${s}`,
                                        currentVal.obs,
                                      )
                                    }
                                    sx={{
                                      color: currentVal.obs
                                        ? "#0ea5e9"
                                        : "#cbd5e1",
                                    }}
                                  >
                                    {currentVal.obs ? (
                                      <ChatBubbleIcon fontSize="small" />
                                    ) : (
                                      <ChatBubbleOutlineIcon fontSize="small" />
                                    )}
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {selectedCategory === "SERVICIOS" && (
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
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
                        bgcolor:
                          selectedSubService === sub ? "#e0f2fe" : "white",
                        color:
                          selectedSubService === sub ? "#0369a1" : "#64748b",
                        border: "2px solid",
                        borderColor:
                          selectedSubService === sub ? "#0ea5e9" : "#e2e8f0",
                      }}
                    />
                  ))}
                </Box>
              )}

              {selectedCategory !== "SERVICIOS" && <Box sx={{ mb: 4 }} />}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  flexGrow: 1,
                }}
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

                {/* Resumen dinámico de infraestructura (Trámite) */}
                {selectedCategory === "SALAS_Y_CAMAS" &&
                  infraEfector &&
                  Object.keys(infraEfector).length > 0 && (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 5 }}
                    >
                      {/* TABLA DE SALAS */}
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{ p: 1, bgcolor: "#e0f2fe", borderRadius: 2 }}
                            >
                              <DomainIcon
                                sx={{ color: "#0369a1", fontSize: 24 }}
                              />
                            </Box>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 900,
                                color: "#1e293b",
                                fontSize: "1.1rem",
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                              }}
                            >
                              SALAS
                            </Typography>
                          </Box>
                          <Chip
                            label={`TOTAL DECLARADO: ${Object.entries(
                              infraEfector,
                            )
                              .filter(
                                ([k, v]) =>
                                  v > 0 &&
                                  ![
                                    "CAMA",
                                    "CUNA",
                                    "UNIDAD",
                                    "PUESTO",
                                    "MATERNIDAD",
                                    "INTERNACION",
                                  ].some((kw) => normalize(k).includes(kw)),
                              )
                              .reduce((acc, [k, v]) => acc + v, 0)}`}
                            sx={{
                              fontWeight: 900,
                              bgcolor: "#f1f5f9",
                              color: "#475569",
                            }}
                          />
                        </Box>
                        <VerificationTable
                          fields={Object.entries(infraEfector)
                            .filter(
                              ([k, v]) =>
                                v > 0 &&
                                [
                                  "SALA",
                                  "HABITACION",
                                ].some((kw) => normalize(k).includes(kw)),
                            )
                            .map(([k, v]) => ({
                              id: `infra-dyn-sala-${k.replace(/\s+/g, "-")}`,
                              label: k,
                              type: "number",
                              valorDeclarado: v,
                            }))}
                          inspectorData={inspectorData}
                          onChange={handleFieldChange}
                          onOpenObs={handleOpenObsDialog}
                          currentSrvName="SALAS DECLARADAS"
                        />
                      </Box>

                      {/* TABLA DE CAMAS */}
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{ p: 1, bgcolor: "#ecfdf5", borderRadius: 2 }}
                            >
                              <BedIcon
                                sx={{ color: "#059669", fontSize: 24 }}
                              />
                            </Box>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 900,
                                color: "#1e293b",
                                fontSize: "1.1rem",
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                              }}
                            >
                              CAMAS Y PUESTOS
                            </Typography>
                          </Box>
                          <Chip
                            label={`TOTAL DECLARADO: ${Object.entries(
                              infraEfector,
                            )
                              .filter(
                                ([k, v]) =>
                                  v > 0 &&
                                  [
                                    "CAMA",
                                    "CUNA",
                                    "UNIDAD",
                                    "PUESTO",
                                    "MATERNIDAD",
                                    "INTERNACION",
                                  ].some((kw) => normalize(k).includes(kw)),
                              )
                              .reduce((acc, [k, v]) => acc + v, 0)}`}
                            sx={{
                              fontWeight: 900,
                              bgcolor: "#ecfdf5",
                              color: "#059669",
                            }}
                          />
                        </Box>
                        <VerificationTable
                          fields={Object.entries(infraEfector)
                            .filter(
                              ([k, v]) =>
                                v > 0 &&
                                [
                                  "CAMA",
                                  "CUNA",
                                  "UNIDAD",
                                  "PUESTO",
                                  "MATERNIDAD",
                                  "INTERNACION",
                                ].some((kw) => normalize(k).includes(kw)),
                            )
                            .map(([k, v]) => ({
                              id: `infra-dyn-cama-${k.replace(/\s+/g, "-")}`,
                              label: k,
                              type: "number",
                              valorDeclarado: v,
                            }))}
                          inspectorData={inspectorData}
                          onChange={handleFieldChange}
                          onOpenObs={handleOpenObsDialog}
                          currentSrvName="CAMAS DECLARADAS"
                        />
                      </Box>
                    </Box>
                  )}

                <FileViewerModal
                  file={viewerFile}
                  onClose={() => setViewerFile(null)}
>>>>>>> Stashed changes
                />
              ))}
            </Box>
          )}

          {selectedCategory !== "SERVICIOS" && <Box sx={{ mb: 4 }} />}

<<<<<<< Updated upstream
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}
          >
            {/* Header del Establecimiento */}
=======
                  if (selectedCategory === "SERVICIOS") {
                    const isTargetService = TARGET_MAPPINGS[
                      selectedSubService
                    ]?.some((k) => normalizedMatch(srv.name, k));
                    const nSrv = (srv.name || "").toUpperCase();
                    const isExcluded =
                      selectedSubService === "UTI" &&
                      (nSrv.includes("PEDIAT") ||
                        nSrv.includes("NEONAT") ||
                        nSrv.includes("CORONARI") ||
                        nSrv.includes("INTERMEDIA"));
>>>>>>> Stashed changes

<<<<<<< Updated upstream
            {selectedCategory === "ARQUITECTURA" && (
              <Box sx={{ mb: 6 }}>
                <Box sx={{ mb: 3, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
=======
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
                        selectedCategory === "RRHH"
                          ? "RECURSOS"
                          : selectedCategory === "SALAS_Y_CAMAS"
                            ? "NONE_MATCH"
                            : selectedCategory === "DOCUMENTACION"
                              ? "DOCUMENTO"
                              : selectedCategory;
                      matchedSections = srv.sections.filter((sec) => {
                        const sName = sec.name.toUpperCase();
                        const arqSrvs = [
                          "GUARDIA",
                          "QUIROFANO",
                          "SALA DE PARTO",
                          "UNIDADES DE TERAPIA INTENSIVA",
                          "UNIDAD CORONARIA",
                          "UNIDAD DE TERAPIA INTENSIVA PEDIATRICA",
                          "UNIDAD DE TERAPIA INTENSIVA NEONATAL",
                          "HEMODINAMIA",
                          "HOSPITAL DE DIA",
                        ];
                        const isArqSrv = arqSrvs.some((ts) =>
                          (srv.name || "").toUpperCase().includes(ts),
                        );

                        const isMatch =
                          (sName.includes(keyword) &&
                            (selectedCategory !== "ARQUITECTURA" ||
                              isArqSrv)) ||
                          (selectedCategory === "ARQUITECTURA" &&
                            isArqSrv &&
                            (sec.fields || []).some((f) => {
                              const lbl = (
                                f.label ||
                                f.name ||
                                ""
                              ).toUpperCase();
                              return (
                                lbl.includes("N° DE CAMAS") ||
                                lbl.includes("COINCIDE CON EDIFICACION") ||
                                lbl.includes("PLANOS")
                              );
                            })) ||
                          (selectedCategory === "DOCUMENTACION" &&
                            sName.includes("DOCUMENTA")) ||
                          (selectedCategory === "RRHH" &&
                            (sName.includes("RECURSOS") ||
                              sName.includes("JEFE"))) ||
                          (selectedCategory === "SALAS_Y_CAMAS" &&
                            (sName.includes("SALA") ||
                              sName.includes("CAMA") ||
                              sName.includes("MATERNIDAD") ||
                              sName.includes("INTERNACION")));

                        if (!isMatch) return false;

                        // Verificar si tiene campos válidos después de filtrar por infraEfector si aplica
                        const validFields = (sec.fields || []).filter((f) => {
                          if (
                            sec.name.toUpperCase().includes("SALA") ||
                            sec.name.toUpperCase().includes("CAMA")
                          ) {
                            const label = f.label || f.name;
                            const uLabel = label.toUpperCase();
<<<<<<< Updated upstream
                            const isGenericLabel = uLabel.includes("CAMAS") || uLabel.includes("SALAS") || uLabel.includes("HABITACION") || (uLabel.includes("N") && uLabel.includes("DE"));

                            // Si es etiqueta genérica, basta con que el servicio esté en infraEfector
                            if (isGenericLabel && infraEfector && (infraEfector[srv.name] || infraEfector[srv.id])) return true;
=======
                            const isGenericLabel =
                              uLabel.includes("CAMAS") ||
                              uLabel.includes("SALAS") ||
                              uLabel.includes("HABITACION") ||
                              (uLabel.includes("N") && uLabel.includes("DE"));
>>>>>>> Stashed changes

                            // Si es etiqueta genérica, basta con que el servicio esté en infraEfector
                            if (
                              isGenericLabel &&
                              infraEfector &&
                              (infraEfector[srv.name] || infraEfector[srv.id])
                            )
                              return true;

                            return (
                              infraEfector && (infraEfector[label] || 0) > 0
                            );
                          }
                          return true;
                        });

                        return validFields.length > 0;
                      });
                    }
                  }

                  if (!matchedSections || matchedSections.length === 0)
                    return null;

                  return (
                    <Accordion
                      key={srv.id}
                      defaultExpanded
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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

<<<<<<< Updated upstream
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
=======
=======
                      <AccordionSummary
                        expandIcon={
                          <ExpandMoreIcon sx={{ color: "#475569" }} />
                        }
                        sx={{
                          bgcolor: "#f8fafc",
                          px: 3,
                          "&.Mui-expanded": {
                            borderBottom: "1px solid #e2e8f0",
                          },
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <LocalHospitalIcon
                            sx={{ color: "#64748b", fontSize: 20 }}
                          />
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 900,
                              color: "#1e293b",
                              fontSize: "1rem",
                              textTransform: "uppercase",
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
                                  pb: 1,
                                }}
                              >
                                {section.name}
                              </Typography>
                            )}

                            {section.name.includes("EQUIPAMIENTO") ||
                            section.name.includes("RECURSOS") ||
                            section.name.includes("RRHH") ||
                            section.name.includes("SALA") ||
                            section.name.includes("CAMA") ? (
                              <VerificationTable
                                fields={section.fields.filter((f) => {
                                  const label = f.label || f.name || "";
                                  const uLabel = label.toUpperCase();
                                  const isArqField =
                                    uLabel.includes("N° DE CAMAS") ||
                                    uLabel.includes(
                                      "COINCIDE CON EDIFICACION",
                                    ) ||
                                    uLabel.includes("PLANOS");

                                  if (
                                    selectedCategory === "ARQUITECTURA" &&
                                    isArqField
                                  )
                                    return true;
                                  if (
                                    selectedCategory === "SERVICIOS" &&
                                    isArqField
                                  )
                                    return false;
                                  if (
                                    selectedCategory === "SALAS_Y_CAMAS" &&
                                    isArqField
                                  )
                                    return false;

                                  if (
                                    section.name
                                      .toUpperCase()
                                      .includes("SALA") ||
                                    section.name.toUpperCase().includes("CAMA")
                                  ) {
                                    const isGenericLabel =
                                      uLabel.includes("CAMAS") ||
                                      uLabel.includes("SALAS") ||
                                      uLabel.includes("HABITACION") ||
                                      (uLabel.includes("N") &&
                                        uLabel.includes("DE"));
                                    if (
                                      isGenericLabel &&
                                      infraEfector &&
                                      (infraEfector[srv.name] ||
                                        infraEfector[srv.id])
                                    )
                                      return true;
                                    return (
                                      infraEfector && infraEfector[label] > 0
                                    );
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
                                  gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                  },
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
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Box>
            </>
          )}
        </AccordionDetails>
      </Accordion>
      </>
      )}
>>>>>>> Stashed changes

      <ObservationDialog
        open={obsDialog.open}
        label={obsDialog.label}
        value={obsDialog.value}
        onClose={() => setObsDialog({ ...obsDialog, open: false })}
        onSave={handleSaveObs}
      />

<<<<<<< Updated upstream
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
                  <Box component="li" key={idx} sx={{ color: obs.type === 'ERROR' ? '#ef4444' : '#475569', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box component="span" sx={{ fontWeight: 800 }}>{obs.label}: </Box>
                      {obs.text}
                    </Box>
                    <IconButton size="small" onClick={() => photoInputRef.current.click()} sx={{ color: '#0ea5e9', bgcolor: '#f0f9ff', '&:hover': { bgcolor: '#e0f2fe' } }} title="Adjuntar foto a esta observación">
                      <PhotoCamera fontSize="small" />
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
                  <Box component="li" key={idx} sx={{ color: obs.type === 'ERROR' ? '#ef4444' : '#475569', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box component="span" sx={{ fontWeight: 800 }}>{obs.label}</Box>
                      <Box component="span" sx={{ color: '#94a3b8', fontSize: '0.75rem', mx: 0.5 }}>({obs.service})</Box>
                      : {obs.text}
                    </Box>
                    <IconButton size="small" onClick={() => photoInputRef.current.click()} sx={{ color: '#0ea5e9', bgcolor: '#f0f9ff', '&:hover': { bgcolor: '#e0f2fe' } }} title="Adjuntar foto a esta observación">
                      <PhotoCamera fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
=======
      {currentActa === 2 && (
        <>
          {/* RESUMEN DE OBSERVACIONES */}
          <Box sx={{ mt: 6, mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 950,
            color: "#0f172a",
            mb: 4,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          RESUMEN DE OBSERVACIONES
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 900,
                color: "#475569",
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <InfoIcon sx={{ color: "#0ea5e9" }} />
              OBSERVACIONES DE DATOS GENERALES
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                bgcolor: "#f8fafc",
                borderRadius: 4,
                minHeight: 80,
                border: "2px solid #e2e8f0",
              }}
            >
              {obsDatosGenerales.length === 0 ? (
                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontStyle: "italic",
                    fontSize: "0.9rem",
                  }}
                >
                  No hay observaciones registradas en esta sección.
                </Typography>
              ) : (
                <Box
                  component="ul"
                  sx={{
                    m: 0,
                    pl: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  {obsDatosGenerales.map((obs, idx) => (
                    <Box
                      component="li"
                      key={idx}
                      sx={{
                        color: obs.type === "ERROR" ? "#ef4444" : "#475569",
                        fontSize: "0.95rem",
                      }}
                    >
                      <Box component="span" sx={{ fontWeight: 800 }}>
                        {obs.label}:{" "}
                      </Box>
                      {obs.text}
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>

          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 900,
                color: "#475569",
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <AssignmentIndIcon sx={{ color: "#0ea5e9" }} />
              OBSERVACIONES DE DATOS DEL TRÁMITE
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                bgcolor: "#f8fafc",
                borderRadius: 4,
                minHeight: 80,
                border: "2px solid #e2e8f0",
              }}
            >
              {obsDatosTramite.length === 0 ? (
                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontStyle: "italic",
                    fontSize: "0.9rem",
                  }}
                >
                  No hay observaciones registradas en esta sección.
                </Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {Object.entries(
                    obsDatosTramite.reduce((acc, obs) => {
                      const srv = obs.service || "OTROS";
                      if (!acc[srv]) acc[srv] = [];
                      acc[srv].push(obs);
                      return acc;
                    }, {}),
                  ).map(([service, items]) => (
                    <Box key={service}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 950,
                          color: "#0369a1",
                          mb: 1.5,
                          fontSize: "0.7rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          bgcolor: "#e0f2fe",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          display: "inline-block",
                        }}
                      >
                        {service}
                      </Typography>
                      <Box
                        component="ul"
                        sx={{
                          m: 0,
                          pl: 2,
                          mt: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          listStyle: "none",
                        }}
                      >
                        {items.map((obs, idx) => (
                          <Box
                            component="li"
                            key={idx}
                            sx={{
                              color:
                                obs.type === "ERROR" ? "#ef4444" : "#475569",
                              fontSize: "0.95rem",
                              display: "flex",
                              gap: 1,
                            }}
                          >
                            <Box component="span" sx={{ fontWeight: 800 }}>
                              - {obs.label}:{" "}
                            </Box>
                            <Box component="span">{obs.text}</Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>
>>>>>>> Stashed changes
        </Box>
      </Box>

      {/* OBSERVACIONES GENERALES */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 900, color: "#1e293b", mb: 2 }}
        >
          OBSERVACIONES GENERALES
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: "2px solid #e2e8f0",
            borderRadius: 6,
            bgcolor: "#ffffff",
          }}
        >
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Escriba aquí cualquier observación general sobre la inspección..."
            value={generalObs}
            onChange={(e) => setGeneralObs(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
                "&:hover": { borderColor: "#cbd5e1" },
                "&.Mui-focused": { borderColor: "#0ea5e9" },
              },
            }}
          />
<<<<<<< Updated upstream
        </Box>
>>>>>>> Stashed changes
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
=======

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => photoInputRef.current.click()}
              startIcon={<PhotoCamera />}
>>>>>>> Stashed changes
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
              Sacar Foto
            </Button>
          </Stack>
        </Paper>
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
              sx={{
                fontWeight: 800,
                color: "#64748b",
                textTransform: "uppercase",
              }}
            >
              Firma Responsable
            </Typography>
            <Box
              sx={{
                height: 100,
                mt: 1,
                bgcolor: "white",
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                overflow: "hidden",
              }}
            >
              {signatures.representative && (
                <img
                  src={signatures.representative}
                  alt="firma responsable"
                  style={{ height: "100%" }}
                />
              )}
            </Box>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: "#64748b",
                textTransform: "uppercase",
              }}
            >
              Firma Inspector
            </Typography>
            <Box
              sx={{
                height: 100,
                mt: 1,
                bgcolor: "white",
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                overflow: "hidden",
              }}
            >
              {signatures.inspector && (
                <img
                  src={signatures.inspector}
                  alt="firma inspector"
                  style={{ height: "100%" }}
                />
              )}
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 900,
                mt: 1,
                color: "#1e293b",
                textTransform: "uppercase",
              }}
            >
              JUAN PÉREZ (INSPECTOR)
            </Typography>
          </Box>
        </Box>
      )}
    </>
  )}

<<<<<<< Updated upstream
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
=======
  <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 3 }}>
        {currentActa === 2 && (
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
        )}

        <Stack direction="row" spacing={3}>
          {currentActa === 1 ? (
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
                  bgcolor: "#0ea5e9",
                  "&:hover": { bgcolor: "#0284c7" },
                }}
              >
                EMPLAZAR
              </Button>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => setCurrentActa(2)}
                sx={{
                  py: 2.5,
                  borderRadius: 8,
                  fontWeight: 900,
                  fontSize: "1.1rem",
                  bgcolor: "#f59e0b",
                  "&:hover": { bgcolor: "#d97706" },
                }}
              >
                REGISTRAR NUEVA ACTA
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
        </Stack>
      </Box>
>>>>>>> Stashed changes

      <SignatureModal
        open={signatureModalOpen}
        step={signatureStep}
        onClose={() => {
          setSignatureModalOpen(false);
          setSignatureStep(0);
        }}
        onSave={handleSaveSignature}
      />

<<<<<<< Updated upstream
      <Box
        sx={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 1200,
        }}
      >
        <Tooltip title="Eliminar todo lo cargado en el acta">
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleClearActa}
            sx={{
              borderRadius: 8,
              py: 1.5,
              px: 3,
              boxShadow: "0 10px 20px rgba(239, 68, 68, 0.25)",
              textTransform: "none",
              fontWeight: 900,
            }}
          >
            Limpiar acta
          </Button>
        </Tooltip>
      </Box>
=======
      {/* Botón Flotante para Guardar */}
      <Fab
        color="primary"
        aria-label="save"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          bgcolor: "#0ea5e9",
          boxShadow: "0 4px 20px rgba(14,165,233,0.4)",
          "&:hover": { bgcolor: "#0284c7" },
        }}
        onClick={() => {
          // Simular guardado (ya se guarda en useEffect, pero damos feedback)
          const event = new CustomEvent("show-toast", {
            detail: {
              message: "Cambios guardados con éxito",
              severity: "success",
            },
          });
          window.dispatchEvent(event);
        }}
      >
        <SaveIcon />
      </Fab>
>>>>>>> Stashed changes
    </Box>
  );
};

<<<<<<< Updated upstream
const FieldItem = ({ field, value, onChange }) => {
=======
const FieldItem = ({ field, value, onChange, onOpenObs }) => {
  const isObj = value && typeof value === "object" && !Array.isArray(value);
  const realValue = isObj ? value.value : value;
  const obsText = isObj ? value.obs : "";
  const isObserved = isObj ? value.observado : false;

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{
              fontWeight: 800,
              color: "#334155",
              lineHeight: 1.2,
              fontSize: "13px",
              textTransform: "uppercase",
              mb: 1,
            }}
          >
            {field.label}
          </Typography>
          {onOpenObs &&
            field.type !== "boolean" &&
            field.type !== "checkbox" && (
              <IconButton
                size="small"
                onClick={() => onOpenObs(field.id, field.label, obsText)}
                sx={{
                  ml: 0.5,
                  mb: 1,
                  p: 0.5,
                  color: obsText ? "#0ea5e9" : "#94a3b8",
                  "&:hover": {
                    color: "#0ea5e9",
                    backgroundColor: "rgba(14, 165, 233, 0.05)",
                  },
                }}
              >
                {obsText ? (
                  <ChatBubbleIcon sx={{ fontSize: 16 }} />
                ) : (
                  <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            )}
        </Box>
>>>>>>> Stashed changes
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
              Equipo
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
              align="center"
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
            const valorObj = currentVal.valor !== undefined && currentVal.valor !== null ? currentVal.valor : "";
            const obsText = currentVal.obs || "";

            let valorDeclarado =
<<<<<<< Updated upstream
              field.cantidadMinima ?? field.valorDeclarado ?? 1;
=======
              field.valorTramite ??
              field.cantidadMinima ??
              field.valorDeclarado ??
              1;
>>>>>>> Stashed changes

            // 1. INFRAESTRUCTURA (Camas/Salas)
            const name = field.label || field.name;
<<<<<<< Updated upstream
            if (infraEfector && infraEfector[name] !== undefined) {
              valorDeclarado = infraEfector[name];
=======
            if (infraEfector) {
              if (infraEfector[name] !== undefined) {
                valorDeclarado = infraEfector[name];
              } else if (currentSrvName) {
                const upperLabel = normalize(name);
<<<<<<< Updated upstream
                const isGeneric = upperLabel.includes("CAMA") || upperLabel.includes("SALA") || upperLabel.includes("HABITACION") || (upperLabel.includes("N") && upperLabel.includes("DE"));
=======
                const isGeneric =
                  upperLabel.includes("CAMA") ||
                  upperLabel.includes("SALA") ||
                  upperLabel.includes("HABITACION") ||
                  upperLabel.includes("MATERNIDAD") ||
                  upperLabel.includes("INTERNACION") ||
                  (upperLabel.includes("N") && upperLabel.includes("DE"));
>>>>>>> Stashed changes

                if (isGeneric) {
                  if (infraEfector[currentSrvName] !== undefined) {
                    valorDeclarado = infraEfector[currentSrvName];
                  } else {
<<<<<<< Updated upstream
                    const foundKey = Object.keys(infraEfector).find(k =>
                      normalize(k).includes(normalize(currentSrvName)) ||
                      normalize(currentSrvName).includes(normalize(k))
=======
                    const foundKey = Object.keys(infraEfector).find(
                      (k) =>
                        normalize(k).includes(normalize(currentSrvName)) ||
                        normalize(currentSrvName).includes(normalize(k)),
>>>>>>> Stashed changes
                    );
                    if (foundKey) valorDeclarado = infraEfector[foundKey];
                  }
                }
              }
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                // El valor esperado es al menos 1 por cada quirófano declarado
                valorDeclarado = Math.max(orCount, equipoMatch.length);
              } else if (equipoMatch.length > 0) {
                valorDeclarado = equipoMatch.length;
=======
                const actualSum = equipoMatch.reduce(
                  (acc, curr) => acc + (curr.actualQty || 1),
                  0,
                );
                valorDeclarado = Math.max(orCount, actualSum);
                if (equipoMatch.length === 0) valorDeclarado = orCount;
              } else if (equipoMatch.length > 0) {
                // Sumamos las cantidades (si viene del simulador trae actualQty, sino contamos items)
                valorDeclarado = equipoMatch.reduce(
                  (acc, curr) => acc + (curr.actualQty || 1),
                  0,
                );
>>>>>>> Stashed changes
              }
            }

            const isNumeric = !isNaN(valorDeclarado);
            const hasError =
              isObservado &&
              valorObj !== "" &&
              isNumeric &&
              Number(valorObj) !== Number(valorDeclarado);

            const isEquipmentRow = Boolean(
              field.equipamiento ||
              (field.label?.toUpperCase().includes("EQUIPO")) ||
              currentSrvName?.toUpperCase().includes("EQUIPAMIENTO")
            );
            const inputError = isEquipmentRow && isObservado && valorObj !== "" && isNumeric && Number(valorObj) < Number(valorDeclarado);

            const update = (key, val) =>
              onChange(field.id, { ...currentVal, [key]: val });

<<<<<<< Updated upstream
=======
            const vObs = Number(valorObj);
            const vDec = Number(valorDeclarado);
            const isFilled = valorObj !== "";
            const isMatch = isFilled && vObs === vDec;

            // Lógica de Validación de Iconos (HU)
            const getStatusIndicator = () => {
              if (!isObservado || !isFilled) return null;

              const upperSrv = currentSrvName?.toUpperCase() || "";
              const upperLabel = (field.label || "").toUpperCase();

              const isJefe =
                upperLabel.includes("JEFE") || upperSrv.includes("JEFE");
              const isServiciosCamas =
                upperLabel.includes("CAMA") ||
                upperLabel.includes("SALA") ||
                upperLabel.includes("PUESTO") ||
                upperSrv.includes("CAMA") ||
                upperSrv.includes("SALA");
              const isRrhhEquip = !isJefe && !isServiciosCamas; // Por descarte según HU

<<<<<<< Updated upstream
              if (isMatch) return <InfoIcon sx={{ color: "#94a3b8", fontSize: 20 }} />; // Igual
=======
              if (isMatch)
                return <InfoIcon sx={{ color: "#94a3b8", fontSize: 20 }} />; // Gris
>>>>>>> Stashed changes

              if (isServiciosCamas) {
                return vObs < vDec ? (
                  <ReportProblemIcon sx={{ color: "#eab308", fontSize: 20 }} /> // Amarillo (Advertencia)
                ) : (
                  <ErrorIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                ); // Rojo (Error)
              }

              if (isJefe) {
                return vObs < vDec ? (
                  <ErrorIcon sx={{ color: "#ef4444", fontSize: 20 }} /> // Rojo (Error)
                ) : (
                  <ReportProblemIcon sx={{ color: "#eab308", fontSize: 20 }} />
                ); // Amarillo (Advertencia)
              }

              if (isRrhhEquip) {
                return vObs < vDec ? (
                  <ErrorIcon sx={{ color: "#ef4444", fontSize: 20 }} /> // Rojo (Error)
                ) : null;
              }
              return null;
            };

            const statusIcon = getStatusIndicator();

>>>>>>> Stashed changes
            return (
              <TableRow
                key={field.id}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  bgcolor: hasError ? "#fef2f200" : "inherit",
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
=======
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
>>>>>>> Stashed changes
                      <TextField
                        size="small"
                        type="number"
                        placeholder="Cant."
<<<<<<< Updated upstream
                        value={valorObj !== "" ? String(valorObj) : (field.origin === "TRÁMITE" ? String(valorDeclarado) : "")}
=======
                        disabled={field.origin === "TRÁMITE"}
                        value={
                          valorObj ||
                          (field.origin === "TRÁMITE" ? valorDeclarado : "")
                        }
>>>>>>> Stashed changes
                        onChange={(e) => update("valor", e.target.value)}
                        error={inputError}
                        inputProps={{ min: 0, inputMode: "numeric" }}
                        sx={{
                          flexGrow: 1,
                          "& .MuiInputBase-root": {
<<<<<<< Updated upstream
                            bgcolor: "white",
=======
                            bgcolor:
                              field.origin === "TRÁMITE" ? "#f1f5f9" : "white",
>>>>>>> Stashed changes
                            fontWeight: 800,
                            height: 38,
                          },
                          "& input": {
                            MozAppearance: "textfield",
                          },
                          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                            WebkitAppearance: "none",
                            margin: 0,
                          },
                        }}
                      />
                      {statusIcon}
                    </Box>
                  )}
                </TableCell>
                <TableCell align="center">
<<<<<<< Updated upstream
                  {isObservado && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
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
                    </Box>
>>>>>>> Stashed changes
=======
                  {isObservado && !isMatch && (
                    <IconButton
                      size="small"
                      onClick={() =>
                        onOpenObs(
                          field.id,
                          `[${currentSrvName}] ${field.label || field.name}`,
                          obsText,
                        )
                      }
                      sx={{
                        color: obsText ? "#0ea5e9" : "#cbd5e1",
                        border: "1px solid",
                        borderColor: obsText ? "#0ea5e9" : "#e2e8f0",
                        bgcolor: obsText ? "#f0f9ff" : "transparent",
                        "&:hover": { bgcolor: "#e0f2fe" },
                      }}
                    >
                      {obsText ? <ChatBubbleIcon /> : <ChatBubbleOutlineIcon />}
                    </IconButton>
>>>>>>> Stashed changes
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
              sx={{
                fontWeight: 900,
                color: "#0369a1",
                fontSize: "0.80rem",
                py: 2,
              }}
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
                  <TableRow
                    key={file}
                    hover
                    sx={{ "&:last-child td": { border: 0 } }}
                  >
                    <TableCell
                      sx={{ fontWeight: 700, color: "#1e293b", py: 1.5 }}
                    >
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
                          onChange(fieldId, {
                            ...currentVal,
                            observado: e.target.checked,
                          })
                        }
                        color="primary"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
<<<<<<< Updated upstream
                        sx={{ color: isObserved ? "#0ea5e9" : "#cbd5e1" }}
=======
                        disabled={!isObserved}
                        onClick={() =>
                          onOpenObs(fieldId, `[PLANO] ${file}`, obsText)
                        }
                        sx={{
                          color: obsText ? "#0ea5e9" : "#cbd5e1",
                        }}
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
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
        sx: { borderRadius: 4, p: 1 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 900, color: "#1e293b", pb: 1 }}>
        Observación: {label}
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="body2"
          sx={{ color: "#64748b", mb: 2, fontWeight: 500 }}
        >
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
            },
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
            "&:hover": { bgcolor: "#0284c7" },
          }}
        >
          Guardar Observación
        </Button>
      </DialogActions>
    </Dialog>
  );
};

>>>>>>> Stashed changes
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                bgcolor: "#0ea5e9",
                color: "white",
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontSize: "0.7rem",
                fontWeight: 900,
              }}
            >
              PASO 1 DE 2
            </Box>
            FIRMA: RESPONSABLE ESTABLECIMIENTO
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                bgcolor: "#059669",
                color: "white",
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontSize: "0.7rem",
                fontWeight: 900,
              }}
            >
              PASO 2 DE 2
            </Box>
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
<<<<<<< Updated upstream
          <Box sx={{ position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
             <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: 1 }}>
                ESCRIBA SU FIRMA AQUÍ
             </Typography>
=======
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: 0,
              right: 0,
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#94a3b8", fontWeight: 700, letterSpacing: 1 }}
            >
              ESCRIBA SU FIRMA AQUÍ
            </Typography>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
              boxShadow: step === 1 
                ? "0 4px 10px rgba(14,165,233,0.3)"
                : "0 4px 10px rgba(5,150,105,0.3)",
=======
              boxShadow:
                step === 1
                  ? "0 4px 10px rgba(14,165,233,0.3)"
                  : "0 4px 10px rgba(5,150,105,0.3)",
>>>>>>> Stashed changes
            }}
          >
            {step === 1 ? "Siguiente Firma" : "Confirmar Firma"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
