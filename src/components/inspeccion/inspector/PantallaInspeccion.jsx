import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  MenuItem,
  Stack,
  Chip,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  FactCheck as FactCheckIcon,
} from "@mui/icons-material";

const DEFAULT_TIPOLOGIA = "CLÍNICAS, SANATORIOS Y HOSPITALES";

const PantallaInspeccion = () => {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [inspectorData, setInspectorData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3001/configuraciones_maestras?tipologia=${encodeURIComponent(
            DEFAULT_TIPOLOGIA
          )}`
        );
        const data = await res.json();
        if (data && data.length > 0) {
          setConfig(data[0]);
          setSelectedServiceId(data[0].servicios[0]?.id);
        }
      } catch (err) {
        console.error("Error al cargar configuración", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFieldChange = (fieldId, value) => {
    setInspectorData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "#f8fafc" }}>
        <CircularProgress size={80} thickness={4} />
      </Box>
    );
  }

  const currentServiceIndex = config?.servicios?.findIndex((s) => s.id === selectedServiceId) ?? 0;
  const currentService = config?.servicios?.[currentServiceIndex];

  const handleNext = () => {
    if (currentServiceIndex < (config?.servicios?.length ?? 0) - 1) {
      setSelectedServiceId(config.servicios[currentServiceIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentServiceIndex > 0) {
      setSelectedServiceId(config.servicios[currentServiceIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 64px)",
        bgcolor: "#f1f5f9",
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        {/* SIDEBAR - Optimizado para 40+ (Iconos grandes, texto claro) */}
        <Box
          sx={{
            width: { xs: 300, lg: 380 },
            bgcolor: "#fff",
            borderRight: "2px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            zIndex: 1,
          }}
        >
          <Box sx={{ p: 4, bgcolor: "#005596", color: "white" }}>
            <Stack direction="row" spacing={2} alignItems="center">
               <FactCheckIcon sx={{ fontSize: 32 }} />
               <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                  ACTA DIGITAL
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 700, textTransform: "uppercase" }}>
                  INSPECTOR DE SALUD
                </Typography>
               </Box>
            </Stack>
          </Box>
          
          <List sx={{ flexGrow: 1, py: 2, overflowY: "auto", px: 1.5 }}>
            {config?.servicios?.map((srv, idx) => (
              <ListItemButton
                key={srv.id}
                selected={selectedServiceId === srv.id}
                onClick={() => setSelectedServiceId(srv.id)}
                sx={{
                  py: 2.5,
                  px: 3,
                  mb: 1,
                  borderRadius: 3,
                  transition: "all 0.2s",
                  border: "1px solid transparent",
                  "&.Mui-selected": {
                    bgcolor: "#e0f2fe",
                    borderColor: "#0ea5e9",
                    color: "#0369a1",
                    "& .MuiListItemIcon-root": { color: "#0369a1" },
                    "& .MuiTypography-root": { fontWeight: 900, fontSize: "1.05rem" },
                  },
                  "&:hover": { bgcolor: "#f1f5f9" }
                }}
              >
                <ListItemIcon sx={{ minWidth: 45, color: "#64748b" }}>
                   <Typography sx={{ fontWeight: 900, fontSize: "1.2rem", opacity: 0.5 }}>{idx + 1}</Typography>
                </ListItemIcon>
                <ListItemText
                  primary={srv.name}
                  primaryTypographyProps={{ variant: "body1", sx: { fontSize: "1rem", lineHeight: 1.2 } }}
                />
                {Object.keys(inspectorData).some(key => srv.sections?.some(sec => sec.fields.some(f => f.id === key)) || srv.fields?.some(f => f.id === key)) && (
                   <CheckCircleIcon sx={{ ml: 1, color: "#059669", fontSize: 20 }} />
                )}
              </ListItemButton>
            ))}
          </List>
          
          <Divider />
          <Box sx={{ p: 3, bgcolor: "#f8fafc" }}>
             <Button fullWidth variant="contained" size="large" sx={{ py: 2, borderRadius: 3, fontWeight: 900, fontSize: "1.1rem", bgcolor: "#059669", "&:hover": { bgcolor: "#047857" } }}>
                FINALIZAR ACTA
             </Button>
          </Box>
        </Box>

        {/* MAIN PANEL - Diseñado para Alta Visibilidad */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Header del Servicio Actual */}
          <Box sx={{ p: { xs: 4, lg: 6 }, pb: 2, bgcolor: "white", borderBottom: "1px solid #e2e8f0" }}>
             <Chip label={`SECCIÓN ${currentServiceIndex + 1} DE ${config?.servicios?.length}`} color="primary" sx={{ fontWeight: 900, mb: 2, borderRadius: 1 }} />
             <Typography variant="h3" sx={{ fontWeight: 900, color: "#0f172a", mb: 1, letterSpacing: -1 }}>
                {currentService?.name}
             </Typography>
             <Typography variant="h6" sx={{ color: "#64748b", fontWeight: 400 }}>
                Complete todos los campos requeridos para esta sección.
             </Typography>
          </Box>

          <Box sx={{ p: { xs: 4, lg: 6 }, flexGrow: 1 }}>
            <Grid container spacing={5}>
              {currentService?.sections && currentService.sections.length > 0 ? (
                currentService.sections.map((section) => (
                  <Grid item xs={12} key={section.id}>
                    <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                       <Box sx={{ width: 8, height: 40, bgcolor: "#0ea5e9", borderRadius: 4 }} />
                       <Typography variant="h4" sx={{ fontWeight: 900, color: "#1e293b" }}>{section.name}</Typography>
                    </Box>
                    <Grid container spacing={4}>
                      {section.fields.map((field) => (
                        <Grid item xs={12} md={6} xl={4} key={field.id}>
                          <FieldCard field={field} value={inspectorData[field.id]} onChange={handleFieldChange} />
                        </Grid>
                      ))}
                    </Grid>
                    <Divider sx={{ mt: 6, opacity: 0.5 }} />
                  </Grid>
                ))
              ) : (
                currentService?.fields?.map((field) => (
                  <Grid item xs={12} md={6} xl={4} key={field.id}>
                    <FieldCard field={field} value={inspectorData[field.id]} onChange={handleFieldChange} />
                  </Grid>
                ))
              )}
            </Grid>

            {/* Navegación Inferior - Botones GIGANTES */}
            <Stack direction="row" spacing={3} sx={{ mt: 10, mb: 10 }}>
               <Button 
                variant="outlined" 
                size="large" 
                startIcon={<PrevIcon />}
                disabled={currentServiceIndex === 0}
                onClick={handlePrev}
                sx={{ flex: 1, py: 4, borderRadius: 4, borderSize: 3, fontWeight: 900, fontSize: "1.2rem" }}
               >
                  ANTERIOR
               </Button>
               <Button 
                variant="contained" 
                size="large" 
                endIcon={<NextIcon />}
                disabled={currentServiceIndex === (config?.servicios?.length ?? 0) - 1}
                onClick={handleNext}
                sx={{ flex: 2, py: 4, borderRadius: 4, fontWeight: 900, fontSize: "1.4rem", bgcolor: "#005596" }}
               >
                  GUARDAR Y CONTINUAR
               </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

/* COMPONENTE DE TARJETA ADAPTADO PARA TABLET / 40+ */
const FieldCard = ({ field, value, onChange }) => {
  const renderInput = () => {
    switch (field.type) {
      case "boolean":
      case "checkbox":
        return (
          <ToggleButtonGroup
            value={value === undefined ? null : (value ? "si" : "no")}
            exclusive
            onChange={(e, val) => {
              if (val !== null) onChange(field.id, val === "si");
            }}
            fullWidth
            sx={{ mt: 2, height: 80 }}
          >
            <ToggleButton 
              value="si" 
              sx={{ 
                borderRadius: "16px 0 0 16px",
                border: "2px solid #e2e8f0",
                "&.Mui-selected": { bgcolor: "#dcfce7", color: "#166534", borderColor: "#166534", fontWeight: 900, fontSize: "1.2rem" }
              }}
            >
              SÍ / CUMPLE
            </ToggleButton>
            <ToggleButton 
              value="no"
              sx={{ 
                borderRadius: "0 16px 16px 0",
                border: "2px solid #e2e8f0",
                "&.Mui-selected": { bgcolor: "#fee2e2", color: "#991b1b", borderColor: "#991b1b", fontWeight: 900, fontSize: "1.2rem" }
              }}
            >
              NO / NO CUMPLE
            </ToggleButton>
          </ToggleButtonGroup>
        );
      case "select":
        return (
          <TextField
            select
            fullWidth
            variant="outlined"
            value={value || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{ 
                sx: { borderRadius: 4, height: 70, fontSize: "1.2rem", fontWeight: 700 } 
            }}
            SelectProps={{
                MenuProps: {
                    PaperProps: { sx: { borderRadius: 3, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" } }
                }
            }}
          >
            {field.options?.split(",").map((opt) => (
              <MenuItem key={opt} value={opt.trim()} sx={{ py: 2.5, fontSize: "1.1rem", fontWeight: 500, borderBottom: "1px solid #f1f5f9" }}>
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
            placeholder="0"
            value={value || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{ 
                sx: { borderRadius: 4, height: 70, fontSize: "1.5rem", fontWeight: 900, textAlign: "center" } 
            }}
          />
        );
      default:
        return (
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Escriba aquí..."
            value={value || ""}
            multiline={field.type === "textarea"}
            rows={field.type === "textarea" ? 4 : 1}
            onChange={(e) => onChange(field.id, e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{ 
                sx: { borderRadius: 4, fontSize: "1.1rem", fontWeight: 500, p: 2 } 
            }}
          />
        );
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        height: "100%",
        borderRadius: 5,
        border: "2px solid #e2e8f0",
        bgcolor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
        transition: "0.3s",
        "&:hover": {
          borderColor: "#0ea5e9",
          boxShadow: "0 15px 30px -10px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", mb: 1, minHeight: 60, lineHeight: 1.2 }}>
        {field.label}
      </Typography>
      {renderInput()}
    </Paper>
  );
};

export default PantallaInspeccion;
