import React, { useState, useEffect, createContext } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box, Snackbar, Alert } from "@mui/material";

// Icons
import { 
  ToggleOn as ToggleOnIcon,
  TextFields as TextFieldsIcon,
  Numbers as NumbersIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  Notes as NotesIcon,
  ListAlt as ListAltIcon,
  CheckBox as CheckBoxIcon
} from "@mui/icons-material";

// Subcomponents
import ClinicasDashboard from "./ClinicasDashboard";
import ClinicasServicioEditor from "./ClinicasServicioEditor";

export const ConfigContext = createContext();

export const fieldTypes = [
  { value: "boolean", label: "SI/NO", icon: <ToggleOnIcon fontSize="small" sx={{ color: "#0ea5e9" }} /> },
  { value: "checkbox", label: "Casilla Verif.", icon: <CheckBoxIcon fontSize="small" sx={{ color: "#3b82f6" }} /> },
  { value: "text", label: "Texto corto", icon: <TextFieldsIcon fontSize="small" sx={{ color: "#64748b" }} /> },
  { value: "textarea", label: "Párrafo", icon: <NotesIcon fontSize="small" sx={{ color: "#64748b" }} /> },
  { value: "number", label: "Numérico", icon: <NumbersIcon fontSize="small" sx={{ color: "#10b981" }} /> },
  { value: "date", label: "Fecha", icon: <EventIcon fontSize="small" sx={{ color: "#f59e0b" }} /> },
  { value: "time", label: "Hora", icon: <AccessTimeIcon fontSize="small" sx={{ color: "#f59e0b" }} /> },
  { value: "select", label: "Lista Desplegable", icon: <ListAltIcon fontSize="small" sx={{ color: "#8b5cf6" }} /> },
];

export const tramiteSectionsTemplate = [
  { id: "tramite-estab", name: "ESTABLECIMIENTO", isTramite: true, isDeletable: false, fields: [] },
  { id: "tramite-dirtec", name: "DIRECTOR TÉCNICO", isTramite: true, isDeletable: false, fields: [] },
  { id: "tramite-serv", name: "SERVICIOS", isTramite: true, isDeletable: false, fields: [] },
  { id: "tramite-rrhh", name: "RECURSOS HUMANOS", isTramite: true, isDeletable: false, fields: [] },
  { id: "tramite-jefe", name: "JEFE DE SERVICIO", isTramite: true, isDeletable: false, fields: [] },
  { id: "tramite-equip", name: "EQUIPAMIENTOS", isTramite: true, isDeletable: false, fields: [] },
];

export const initialServiciosTemplate = [
  {
    id: "srv-gen",
    name: "DATOS GENERALES",
    isDeletable: false,
    sections: [
      { id: "sec-reg", name: "REGISTROS", fields: [] },
      { id: "sec-dat", name: "DATOS", fields: [] },
    ],
  },
  {
    id: "srv-uti",
    name: "Unidades de Terapia Intensiva (UTI)",
    isDeletable: true,
    fields: [],
  },
];

export const slugify = (text) => {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

const ConfiguradorClinicas = () => {
  const [servicios, setServicios] = useState([]);
  const tipologiaName = "CLÍNICAS, SANATORIOS Y HOSPITALES";
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const loadConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/configuraciones_maestras?tipologia=${encodeURIComponent(tipologiaName)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        let loadedServicios = data[0].servicios;
        // Filter out legacy elements if present in db
        // Fix: Use ONLY what's on the server, don't force prepending tramite sections
        // unless explicitly needed by the business rules if they were missing.
        // But the user asked for ONLY what's in db.json.
        setServicios(loadedServicios);
      } else {
        // Fallback more minimal
        setServicios(initialServiciosTemplate);
      }
    } catch (err) {
      console.error("Error loading config", err);
      setServicios(initialServiciosTemplate);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      const resSearch = await fetch(`http://localhost:3001/configuraciones_maestras?tipologia=${encodeURIComponent(tipologiaName)}`);
      const dataSearch = await resSearch.json();
      const payload = { tipologia: tipologiaName, servicios };

      if (dataSearch && dataSearch.length > 0) {
        await fetch(`http://localhost:3001/configuraciones_maestras/${dataSearch[0].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...dataSearch[0], ...payload }),
        });
      } else {
        await fetch(`http://localhost:3001/configuraciones_maestras`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: `cm-${Date.now()}`, ...payload }),
        });
      }
      setToast({ open: true, message: `Planilla maestra para "${tipologiaName}" guardada.`, severity: "success" });
    } catch (err) {
      setToast({ open: true, message: "ERROR: No se pudo guardar.", severity: "error" });
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleCloseToast = () => setToast({ ...toast, open: false });

  const contextValue = {
    servicios,
    setServicios,
    tipologiaName,
    setTipologiaName: () => {}, // static
    loadConfig,
    handleSaveConfig,
    loading,
    slugify,
  };

  return (
    <ConfigContext.Provider value={contextValue}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 128px)",
          backgroundColor: "#ffffff",
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          position: "relative",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        <Routes>
          <Route index element={<ClinicasDashboard />} />
          <Route path=":servicioSlug" element={<ClinicasServicioEditor />} />
          <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
        <Snackbar open={toast.open} autoHideDuration={6000} onClose={handleCloseToast} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
          <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: "100%", ...(toast.severity === "success" && { backgroundColor: "#32A430", color: "#ffffff", "& .MuiAlert-icon": { color: "#ffffff" } }), ...(toast.severity === "error" && { backgroundColor: "#E2464C", color: "#ffffff", "& .MuiAlert-icon": { color: "#ffffff" } }) }}>
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </ConfigContext.Provider>
  );
};

export default ConfiguradorClinicas;
