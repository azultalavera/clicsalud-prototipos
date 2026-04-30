import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  IconButton
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Close from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";

import RevisionActa from "./RevisionActa";
import InspeccionActa from "./InspeccionActa";
import { SignatureModal } from "./InspeccionSubComponents";

const getFlatFields = (sectionsObj) => {
  if (!sectionsObj) return [];
  if (Array.isArray(sectionsObj)) {
    return sectionsObj.reduce((acc, sec) => [...acc, ...(sec.fields || [])], []);
  }
  return [];
};

const normalizedMatch = (srvName, targetKey) => {
  const nSrv = (srvName || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
  const nKey = (targetKey || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

  if (nSrv.includes(nKey) || nKey.includes(nSrv)) return true;

  const srvWords = nSrv.split(/\W+/).filter((w) => w.length > 3);
  const keyWords = nKey.split(/\W+/).filter((w) => w.length > 3);
  return keyWords.some((kw) => srvWords.includes(kw));
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
  const [signatureStep, setSignatureStep] = useState(0); 
  const [signatures, setSignatures] = useState({
    representative: null,
    inspector: null,
  });

  const [obsDialog, setObsDialog] = useState({
    open: false,
    fieldId: null,
    label: "",
    value: "",
  });

  const [tipologia, setTipologia] = useState("Sanatorios y Clínicas");
  const [directorTecnico, setDirectorTecnico] = useState(null);
  const [serviciosEfector, setServiciosEfector] = useState([]);
  const [infraEfector, setInfraEfector] = useState({});
  const [rrhhEfector, setRrhhEfector] = useState([]);
  const [equiposEfector, setEquiposEfector] = useState([]);

  const [currentActa, setCurrentActa] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState("ARQUITECTURA");
  const [selectedSubService, setSelectedSubService] = useState("");

  const photoInputRef = useRef(null);

  // Carga inicial y persistencia
  useEffect(() => {
    const loadFromCache = () => {
      const cachedSrv = localStorage.getItem("efector_servicios");
      const cachedInfra = localStorage.getItem("efector_infra");
      const cachedRrhh = localStorage.getItem("efector_rrhh");
      const cachedEquipos = localStorage.getItem("efector_equipos");
      const cachedTipo = localStorage.getItem("efector_tipo");

      if (cachedSrv) setServiciosEfector(JSON.parse(cachedSrv));
      if (cachedInfra) setInfraEfector(JSON.parse(cachedInfra));
      if (cachedRrhh) setRrhhEfector(JSON.parse(cachedRrhh));
      if (cachedEquipos) setEquiposEfector(JSON.parse(cachedEquipos));
      if (cachedTipo) setTipologia(cachedTipo);
    };

    if (propsServicios) {
      setServiciosEfector(propsServicios);
      setInfraEfector(propsInfra || {});
      setRrhhEfector(propsRrhh || []);
      setEquiposEfector(propsEquipos || []);
    } else {
      loadFromCache();
    }

    const savedData = localStorage.getItem("inspector_data");
    if (savedData) setInspectorData(JSON.parse(savedData));
    else setInspectorData({ "f-fecqs7p6": new Date().toISOString().split("T")[0] });

    const savedManualObs = localStorage.getItem("general_obs");
    if (savedManualObs) setGeneralObs(savedManualObs);

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
    const datosGeneralesSrv = config.servicios.find(s => s.name === "DATOS GENERALES");
    const genFields = datosGeneralesSrv?.sections ? getFlatFields(datosGeneralesSrv.sections) : datosGeneralesSrv?.fields || [];

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
    const otherServices = config.servicios.filter(s => s.name !== "DATOS GENERALES");

    otherServices.forEach(srv => {
      const srvFields = srv.sections ? getFlatFields(srv.sections) : srv.fields || [];
      srvFields.forEach(f => {
        const fieldData = inspectorData[f.id];
        const val = extractValue(fieldData);
        const obs = extractObs(fieldData);
        if ((f.type === 'boolean' || f.type === 'checkbox') && val === false) {
          traSummary.push({ label: f.label, service: srv.name, text: `NO CUMPLE${obs ? ` (${obs})` : ''}`, type: 'ERROR' });
        } else if (obs) {
          traSummary.push({ label: f.label, service: srv.name, text: obs, type: 'OBS' });
        }
      });
    });
    setObsDatosTramite(traSummary);

    localStorage.setItem("obs_datos_generales", JSON.stringify(genSummary));
    localStorage.setItem("obs_datos_tramite", JSON.stringify(traSummary));
  }, [inspectorData, config]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3001/configuraciones_maestras?tipologia=${encodeURIComponent(tipologia)}`);
        const data = await res.json();
        if (data && data.length > 0) {
          setConfig(data[0]);
        }
      } catch (err) {
        console.error("Error al cargar configuración", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tipologia]);

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

  const handleOpenObsDialog = (fieldId, label, value) => {
    setObsDialog({ open: true, fieldId, label, value });
  };

  const handleSaveObs = (text) => {
    const current = inspectorData[obsDialog.fieldId];
    const isObject = current && typeof current === 'object' && !Array.isArray(current);
    const newValue = isObject ? { ...current, obs: text } : { value: current, obs: text };
    handleFieldChange(obsDialog.fieldId, newValue);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const handleSaveSignature = (dataUrl) => {
    if (signatureStep === 1) setSignatures({ ...signatures, representative: dataUrl });
    else setSignatures({ ...signatures, inspector: dataUrl });
    setSignatureModalOpen(false);
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><CircularProgress size={80} /></Box>;

  const datosGeneralesSrv = config?.servicios?.find(s => s.name === "DATOS GENERALES");
  const otherServices = config?.servicios?.filter(s => s.name !== "DATOS GENERALES") || [];

  const SUBSERVICIOS = ["UTI", "UCO", "UCIM", "UTIP", "UTIN", "HEMODIALISIS", "QUIRÓFANO"];
  const TARGET_MAPPINGS = {
    UTI: ["UTI", "TERAPIA INTENSIVA", "CUIDADOS INTENSIVOS", "CUIDADOS CRITICOS", "UNIDAD DE TERAPIA INTENSIVA"],
    UCO: ["UCO", "CORONARIA", "CORONARIO", "UNIDAD CORONARIA"],
    UCIM: ["UCIM", "CUIDADOS INTERMEDIOS", "TERAPIA INTERMEDIA", "CUIDADOS MODERADOS", "UNIDAD DE CUIDADOS INTERMEDIOS"],
    UTIP: ["UTIP", "PEDIATRICA"],
    UTIN: ["UTIN", "NEONATAL"],
    HEMODIALISIS: ["HEMODIALISIS", "DIALISIS"],
    QUIRÓFANO: ["QUIROFANO", "QUIRÓFANO", "CENTRO QUIRÚRGICO", "ÁREA QUIRÚRGICA"],
  };

  const activeSubServicios = SUBSERVICIOS.filter((sub) => {
    const allEfectorSelection = [...serviciosEfector, ...Object.keys(infraEfector || {}).filter((k) => (infraEfector[k] || 0) > 0)];
    return allEfectorSelection.some((srvName) => TARGET_MAPPINGS[sub]?.some((k) => normalizedMatch(srvName, k)));
  });

  const PESTAÑAS = [
    { id: "ARQUITECTURA", label: "ARQUITECTURA", icon: <VisibilityIcon sx={{ fontSize: 28 }} /> },
    { id: "SERVICIOS", label: "SERVICIOS", icon: <VisibilityIcon sx={{ fontSize: 28 }} /> },
    { id: "RECURSOS HUMANOS", label: "RRHH y JS", icon: <VisibilityIcon sx={{ fontSize: 28 }} /> },
    { id: "EQUIPAMIENTO", label: "EQUIPAMIENTO", icon: <VisibilityIcon sx={{ fontSize: 28 }} /> },
    { id: "DOCUMENTACION", label: "DOCUMENTOS ADJUNTOS", icon: <DescriptionIcon sx={{ fontSize: 28 }} /> },
    { id: "SALAS Y CAMAS", label: "SALAS Y CAMAS", icon: <VisibilityIcon sx={{ fontSize: 28 }} /> },
  ];

  return (
    <Box sx={{ bgcolor: "#ffffffff", minHeight: "100vh", pb: 10 }}>
      <Box sx={{ position: "sticky", top: 0, zIndex: 1000, bgcolor: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid #e2e8f0", p: 2, display: "flex", justifyContent: "center" }}>
        <ToggleButtonGroup value={currentActa} exclusive onChange={(e, val) => val && setCurrentActa(val)} sx={{ bgcolor: "white", borderRadius: 4, p: 0.5, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
          <ToggleButton value={1} sx={{ px: 4, borderRadius: "12px !important", fontWeight: 900, textTransform: "none", border: "none", "&.Mui-selected": { bgcolor: "#0ea5e9", color: "white", "&:hover": { bgcolor: "#0284c7" } } }}>
            ACTA 1: REVISIÓN
          </ToggleButton>
          <ToggleButton value={2} sx={{ px: 4, borderRadius: "12px !important", fontWeight: 900, textTransform: "none", border: "none", "&.Mui-selected": { bgcolor: "#0ea5e9", color: "white", "&:hover": { bgcolor: "#0284c7" } } }}>
            ACTA 2: INSPECCIÓN
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, sm: 4 } }}>
        {currentActa === 1 ? (
          <RevisionActa />
        ) : (
          <InspeccionActa 
            inspectorData={inspectorData}
            handleFieldChange={handleFieldChange}
            handleOpenObsDialog={handleOpenObsDialog}
            activeSubServicios={activeSubServicios}
            selectedSubService={selectedSubService}
            setSelectedSubService={setSelectedSubService}
            otherServices={otherServices}
            datosGeneralesSrv={datosGeneralesSrv}
            infraEfector={infraEfector}
            rrhhEfector={rrhhEfector}
            equiposEfector={equiposEfector}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            PESTAÑAS={PESTAÑAS}
            TARGET_MAPPINGS={TARGET_MAPPINGS}
            normalizedMatch={normalizedMatch}
            obsDatosGenerales={obsDatosGenerales}
            obsDatosTramite={obsDatosTramite}
            generalObs={generalObs}
            setGeneralObs={setGeneralObs}
            photoInputRef={photoInputRef}
            viewerFile={viewerFile}
            setViewerFile={setViewerFile}
            obsDialog={obsDialog}
            setObsDialog={setObsDialog}
            handleSaveObs={handleSaveObs}
            getFlatFields={getFlatFields}
          />
        )}

        {/* Fotos y Adjuntos (Común a ambas actas o solo Inspección?) El usuario pidió eliminar el botón adjuntar de aquí, pero el contenedor sigue existiendo */}
        <Box sx={{ mb: 6, mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: "#1e293b", mb: 2 }}>FOTOS Y ADJUNTOS</Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Button variant="outlined" onClick={() => photoInputRef.current.click()} startIcon={<PhotoCamera />} sx={{ borderRadius: 4, textTransform: "none", fontWeight: 800, px: 3, py: 1.5 }}>Abrir Cámara</Button>
            <input ref={photoInputRef} type="file" hidden accept="image/*" capture="environment" onChange={handleFileSelect} />
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5 }}>
            {attachments.map((file, idx) => (
              <Paper key={idx} sx={{ p: 0.5, borderRadius: 4, position: "relative", width: 110, height: 110, border: "2px solid #e2e8f0", overflow: "visible" }}>
                <img src={URL.createObjectURL(file)} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }} />
                <IconButton size="small" onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))} sx={{ position: "absolute", top: -12, right: -12, bgcolor: "#ef4444", color: "white" }}><Close /></IconButton>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Firmas y Finalización */}
        <Box sx={{ mt: 8, pt: 4, borderTop: "2px solid #f1f5f9", display: "flex", justifyContent: "center", gap: 3 }}>
          <Button variant="contained" size="large" onClick={() => { setSignatureStep(1); setSignatureModalOpen(true); }} sx={{ bgcolor: "#0f172a", borderRadius: 4, px: 6, py: 2, fontWeight: 900 }}>FIRMAR ACTA</Button>
        </Box>
      </Box>

      <SignatureModal 
        open={signatureModalOpen} 
        step={signatureStep} 
        onClose={() => setSignatureModalOpen(false)} 
        onSave={handleSaveSignature} 
      />
    </Box>
  );
};

export default PantallaInspeccion;
