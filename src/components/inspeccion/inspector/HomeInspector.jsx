import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Avatar,
  Stack,
  Divider,
  TextField,
  InputAdornment,
  BottomNavigation,
  BottomNavigationAction,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ButtonBase
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RoomIcon from "@mui/icons-material/Room";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SearchIcon from "@mui/icons-material/Search";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import HomeIcon from "@mui/icons-material/Home";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ReportIcon from "@mui/icons-material/Report";
import WarningIcon from "@mui/icons-material/Warning";
import GradingIcon from "@mui/icons-material/Grading";
import ShieldIcon from "@mui/icons-material/Shield";
import logoMinisterio from "../../../assets/logo/e1756780-3abd-4b92-a58c-ae3db6a864fe.jpeg";

const HomeInspector = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("TODOS"); 
  const [activeTab, setActiveTab] = useState(0); 
  const [agendaSubTab, setAgendaSubTab] = useState("TRAMITE");

  const [oficioTypeOpen, setOficioTypeOpen] = useState(false);
  const [selectedOficioType, setSelectedOficioType] = useState(""); 
  const [oficioModalOpen, setOficioModalOpen] = useState(false);
  const [oficioSearch, setOficioSearch] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const asignadas = [
    {
      id: "inspeccion_allende",
      name: "Sanatorio Allende",
      tipologia: "Clínicas, Sanatorios y Hospitales",
      direccion: "Av. Hipólito Yrigoyen 384, Córdoba",
      fecha: "Hoy, 09:30 hs",
      dt: { nombre: "JUAN CARLOS", apellido: "PÉREZ", dni: "20.455.123" },
      estado: "PENDIENTE",
      tipo: "TRAMITE",
      nroExpediente: "EX-2026-08122",
      tramite: "Habilitación de Complejo Quirúrgico"
    },
    {
      id: "inspeccion_privado",
      name: "Hospital Privado",
      tipologia: "Clínicas, Sanatorios y Hospitales",
      direccion: "Av. Naciones Unidas 346, Córdoba",
      fecha: "Mañana, 08:00 hs",
      dt: { nombre: "MARÍA EUGENIA", apellido: "GÓMEZ", dni: "27.881.341" },
      estado: "EN CURSO",
      tipo: "TRAMITE",
      nroExpediente: "EX-2026-11902",
      tramite: "Ampliación UTI Pediátrica"
    },
    {
      id: "inspeccion_reina_fabiola",
      name: "Clínica Reina Fabiola",
      tipologia: "Clínicas, Sanatorios y Hospitales",
      direccion: "Jacinto Ríos 554, Córdoba",
      fecha: "09 Jul, 10:30 hs",
      dt: { nombre: "ALBERTO", apellido: "FERNÁNDEZ", dni: "18.399.112" },
      estado: "PENDIENTE",
      tipo: "TRAMITE",
      nroExpediente: "EX-2026-02331",
      tramite: "Reválida de Legajo Médico"
    },
    {
      id: "inspeccion_canada",
      name: "Sanatorio de la Cañada",
      tipologia: "Clínicas, Sanatorios y Hospitales",
      direccion: "Pueyrredón 650, Córdoba",
      fecha: "10 Jul, 11:30 hs",
      dt: { nombre: "CARLOS", apellido: "SÁNCHEZ", dni: "22.112.554" },
      estado: "PENDIENTE",
      tipo: "OFICIO",
      motivoOficio: "RUTINA",
      detalle: "Auditoría Trimestral de Bioseguridad"
    },
    {
      id: "inspeccion_misericordia",
      name: "Hospital Misericordia",
      tipologia: "Clínicas, Sanatorios y Hospitales",
      direccion: "Belgrano 1500, Córdoba",
      fecha: "12 Jul, 08:30 hs",
      dt: { nombre: "LAURA", apellido: "MARTÍNEZ", dni: "25.667.112" },
      estado: "PENDIENTE",
      tipo: "OFICIO",
      motivoOficio: "DENUNCIA",
      detalle: "Insalubridad en Guardia Central"
    },
    {
      id: "inspeccion_transito",
      name: "Hospital Tránsito Cáceres",
      tipologia: "Clínicas, Sanatorios y Hospitales",
      direccion: "Buchardo 1250, Córdoba",
      fecha: "13 Jul, 09:00 hs",
      dt: { nombre: "DANIEL", apellido: "GARCÍA", dni: "19.332.665" },
      estado: "EN CURSO",
      tipo: "OFICIO",
      motivoOficio: "RUTINA",
      detalle: "Inspección Anual contra Incendios"
    },
    {
      id: "inspeccion_sol",
      name: "Clínica del Sol",
      tipologia: "Clínicas, Sanatorios y Hospitales",
      direccion: "Chacabuco 750, Córdoba",
      fecha: "15 Jul, 10:00 hs",
      dt: { nombre: "SILVIA", apellido: "LOPEZ", dni: "23.443.998" },
      estado: "PENDIENTE",
      tipo: "OFICIO",
      motivoOficio: "DENUNCIA",
      detalle: "Denuncia Vecinal por generador eléctrico"
    }
  ];

  const baseEstablecimientosProvincial = [
    { id: "oficio_niños", name: "Hospital de Niños Santísima Trinidad", tipologia: "Clínicas, Sanatorios y Hospitales", direccion: "Bajada Pucará 1900, Córdoba", dt: { nombre: "HECTOR", apellido: "FERREYRA", dni: "15.882.113" } },
    { id: "oficio_maternidad", name: "Maternidad Provincial Felipe Lucini", tipologia: "Clínicas, Sanatorios y Hospitales", direccion: "Pje. Ciriaco Ortiz 2900, Córdoba", dt: { nombre: "BEATRIZ", apellido: "ALONSO", dni: "22.654.890" } },
    { id: "oficio_velez", name: "Clínica Vélez Sarsfield", tipologia: "Clínicas, Sanatorios y Hospitales", direccion: "Naciones Unidas 980, Córdoba", dt: { nombre: "ROBERTO", apellido: "CAMPOS", dni: "17.443.901" } },
    { id: "oficio_ferreyra", name: "Hospital Raúl Ferreyra", tipologia: "Clínicas, Sanatorios y Hospitales", direccion: "Av. Richieri 2200, Córdoba", dt: { nombre: "PATRICIA", apellido: "SOSA", dni: "24.110.450" } },
    { id: "oficio_clinicas", name: "Hospital Nacional de Clínicas", tipologia: "Clínicas, Sanatorios y Hospitales", direccion: "Santa Rosa 1564, Córdoba", dt: { nombre: "JULIO", apellido: "BERMEJO", dni: "14.230.119" } }
  ];

  const handleStartInspection = (inspeccion, tipoDeOficio = "PROGRAMADA") => {
    localStorage.setItem("efector_tipo", inspeccion.tipologia);
    localStorage.setItem("efector_dt", JSON.stringify(inspeccion.dt));
    localStorage.setItem("efector_nombre", inspeccion.name);
    localStorage.setItem("inspeccion_modalidad", tipoDeOficio);
    navigate(`/inspector/${inspeccion.id}`);
  };

  const filteredAsignadas = asignadas.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.direccion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterState === "TODOS" || item.estado === filterState;
    const matchesType = item.tipo === agendaSubTab;
    return matchesSearch && matchesFilter && matchesType;
  });

  const filteredOficio = baseEstablecimientosProvincial.filter(e => 
    e.name.toLowerCase().includes(oficioSearch.toLowerCase()) ||
    e.direccion.toLowerCase().includes(oficioSearch.toLowerCase())
  );

  const totalTramites = asignadas.filter(a => a.tipo === "TRAMITE").length;
  const totalOficios = asignadas.filter(a => a.tipo === "OFICIO").length;
  const totalDenuncias = asignadas.filter(a => a.tipo === "OFICIO" && a.motivoOficio === "DENUNCIA").length;
  const totalRutinas = asignadas.filter(a => a.tipo === "OFICIO" && a.motivoOficio === "RUTINA").length;

  const currentTabAsignadas = asignadas.filter(a => a.tipo === agendaSubTab);
  const countTotal = currentTabAsignadas.length;
  const countEnCurso = currentTabAsignadas.filter(a => a.estado === "EN CURSO").length;
  const countPendiente = currentTabAsignadas.filter(a => a.estado === "PENDIENTE").length;

  const handleSelectOficioType = (type) => {
    setSelectedOficioType(type);
    setOficioTypeOpen(false);
    setOficioModalOpen(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        mx: "auto",
        px: { xs: 3, sm: 5, md: 7 },
        pt: 4,
        pb: 16,
        background: "radial-gradient(ellipse at top, #f0f9ff 0%, #e2e8f0 100%)",
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        position: "relative"
      }}
    >
      <style>{`
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
          70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .dot-online {
          width: 9px; height: 9px; border-radius: 50%;
          background: #10b981; display: inline-block;
          animation: pulse-glow 2s infinite;
        }
        .dot-alert {
          width: 8px; height: 8px; border-radius: 50%;
          background: #ef4444; display: inline-block;
          animation: pulse-red 1.5s infinite;
        }
      `}</style>

      {/* TOP BAR */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 5, pb: 2.5, borderBottom: "1px solid rgba(226,232,240,0.7)" }}>
        <img src={logoMinisterio} alt="Ministerio de Salud" style={{ height: 40, objectFit: "contain" }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, bgcolor: "rgba(255,255,255,0.75)", px: 2, py: 0.8, borderRadius: 3, border: "1px solid rgba(226,232,240,0.9)" }}>
          <span className="dot-online" />
          <Typography sx={{ color: "#334155", fontWeight: 800, fontSize: "0.8rem", letterSpacing: 0.5 }}>ONLINE</Typography>
        </Box>
      </Box>

      {/* MAIN CONTAINER */}
      <Box sx={{ width: "100%", maxWidth: 860, mx: "auto" }}>

        {/* GREETING */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography sx={{ fontWeight: 900, color: "#0f172a", letterSpacing: "-2px", lineHeight: 1, fontSize: { xs: "2.6rem", sm: "3.4rem" }, mb: 1 }}>
            Gustavo Sosa
          </Typography>
          <Typography sx={{ color: "#64748b", fontWeight: 600, fontSize: "1.1rem" }}>
            Inspector de Fiscalización · Martes, 07 de Julio
          </Typography>
        </Box>

        {/* ─── TAB 0: INICIO ─── */}
        {activeTab === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

            {/* CARD: INSPECCIONES DE TRÁMITE */}
            <Card
              elevation={0}
              onClick={() => { setAgendaSubTab("TRAMITE"); setActiveTab(1); }}
              sx={{
                borderRadius: 6,
                cursor: "pointer",
                border: "1.5px solid rgba(2,132,199,0.25)",
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                transition: "all 0.25s ease",
                "&:hover": { transform: "translateY(-3px)", boxShadow: "0 12px 30px rgba(2,132,199,0.12)", borderColor: "#0284c7" }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

                  {/* LEFT: ICON + TEXT */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Avatar sx={{ bgcolor: "#0284c7", width: 72, height: 72, boxShadow: "0 8px 20px rgba(2,132,199,0.3)" }}>
                      <AssignmentIcon sx={{ fontSize: 36, color: "white" }} />
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 900, color: "#0284c7", textTransform: "uppercase", letterSpacing: 1.5, mb: 0.5 }}>
                        Habilitaciones de Ley
                      </Typography>
                      <Typography sx={{ fontWeight: 900, color: "#0f172a", fontSize: "1.55rem", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
                        Inspecciones de Trámite
                      </Typography>
                    </Box>
                  </Box>

                  {/* RIGHT: COUNTER + ARROW */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                    <Box sx={{ textAlign: "center", bgcolor: "white", px: 3, py: 1.5, borderRadius: 4, border: "1px solid rgba(2,132,199,0.15)" }}>
                      <Typography sx={{ fontWeight: 900, color: "#0284c7", fontSize: "2.2rem", lineHeight: 1 }}>{totalTramites}</Typography>
                      <Typography sx={{ color: "#64748b", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase" }}>Expedientes</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: "#0284c7", width: 44, height: 44 }}>
                      <ArrowForwardIcon sx={{ color: "white", fontSize: 22 }} />
                    </Avatar>
                  </Box>

                </Box>
              </CardContent>
            </Card>

            {/* CARD: INSPECCIONES DE OFICIO */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 6,
                border: "1.5px solid rgba(15,23,42,0.1)",
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                overflow: "visible"
              }}
            >
              <CardContent sx={{ p: 4 }}>

                {/* HEADER ROW */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Avatar sx={{ bgcolor: "#0f172a", width: 72, height: 72, boxShadow: "0 8px 20px rgba(15,23,42,0.2)" }}>
                      <ShieldIcon sx={{ fontSize: 36, color: "white" }} />
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 900, color: "#64748b", textTransform: "uppercase", letterSpacing: 1.5, mb: 0.5 }}>
                        Fiscalización Espontánea
                      </Typography>
                      <Typography sx={{ fontWeight: 900, color: "#0f172a", fontSize: "1.55rem", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
                        Inspecciones de Oficio
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* TWO SUB-CARDS: RUTINA + DENUNCIA */}
                <Grid container spacing={2.5}>

                  {/* RUTINA */}
                  <Grid item xs={12} sm={6}>
                    <Card
                      elevation={0}
                      onClick={() => { setAgendaSubTab("OFICIO"); setActiveTab(1); }}
                      sx={{
                        borderRadius: 5,
                        cursor: "pointer",
                        border: "1.5px solid rgba(16,185,129,0.3)",
                        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                        transition: "all 0.25s ease",
                        "&:hover": { transform: "translateY(-3px)", boxShadow: "0 10px 24px rgba(16,185,129,0.15)", borderColor: "#10b981" }
                      }}
                    >
                      <CardContent sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar sx={{ bgcolor: "#10b981", width: 52, height: 52 }}>
                            <GradingIcon sx={{ fontSize: 26, color: "white" }} />
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 900, color: "#065f46", fontSize: "1rem", letterSpacing: "-0.3px" }}>Rutina</Typography>
                            <Typography sx={{ color: "#047857", fontWeight: 600, fontSize: "0.8rem" }}>Auditoría periódica</Typography>
                          </Box>
                        </Box>
                        <Typography sx={{ fontWeight: 900, color: "#065f46", fontSize: "2.4rem", lineHeight: 1 }}>{totalRutinas}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* DENUNCIA */}
                  <Grid item xs={12} sm={6}>
                    <Card
                      elevation={0}
                      onClick={() => { setAgendaSubTab("OFICIO"); setActiveTab(1); }}
                      sx={{
                        borderRadius: 5,
                        cursor: "pointer",
                        border: "1.5px solid rgba(239,68,68,0.3)",
                        background: "linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%)",
                        transition: "all 0.25s ease",
                        "&:hover": { transform: "translateY(-3px)", boxShadow: "0 10px 24px rgba(239,68,68,0.15)", borderColor: "#ef4444" }
                      }}
                    >
                      <CardContent sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar sx={{ bgcolor: "#ef4444", width: 52, height: 52 }}>
                            <WarningIcon sx={{ fontSize: 26, color: "white" }} />
                          </Avatar>
                          <Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography sx={{ fontWeight: 900, color: "#9b1c1c", fontSize: "1rem", letterSpacing: "-0.3px" }}>Denuncia</Typography>
                              <span className="dot-alert" />
                            </Box>
                            <Typography sx={{ color: "#b91c1c", fontWeight: 600, fontSize: "0.8rem" }}>Atención prioritaria</Typography>
                          </Box>
                        </Box>
                        <Typography sx={{ fontWeight: 900, color: "#9b1c1c", fontSize: "2.4rem", lineHeight: 1 }}>{totalDenuncias}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* NEW ACT BUTTON */}
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setOficioTypeOpen(true)}
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{
                    mt: 2.5,
                    py: 1.8,
                    borderRadius: 4,
                    fontWeight: 900,
                    fontSize: "0.95rem",
                    borderColor: "#0f172a",
                    color: "#0f172a",
                    borderWidth: "2px",
                    textTransform: "none",
                    "&:hover": { bgcolor: "#0f172a", color: "white", borderWidth: "2px" }
                  }}
                >
                  Nueva Acta de Oficio
                </Button>

              </CardContent>
            </Card>

            {/* MINI TOOLS ROW */}
            <Grid container spacing={2.5}>
              <Grid item xs={6}>
                <Card elevation={0} onClick={() => setActiveTab(2)} sx={{ borderRadius: 5, cursor: "pointer", bgcolor: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(226,232,240,0.8)", transition: "all 0.2s", "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 20px rgba(15,23,42,0.04)" } }}>
                  <CardContent sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#fffbeb", color: "#d97706", width: 48, height: 48 }}>
                      <FolderOpenIcon sx={{ fontSize: 24 }} />
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 900, color: "#0f172a", fontSize: "1.5rem", lineHeight: 1 }}>3</Typography>
                      <Typography sx={{ fontWeight: 800, color: "#78350f", fontSize: "0.85rem" }}>Legajos</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card elevation={0} onClick={() => setActiveTab(3)} sx={{ borderRadius: 5, cursor: "pointer", bgcolor: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(226,232,240,0.8)", transition: "all 0.2s", "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 20px rgba(15,23,42,0.04)" } }}>
                  <CardContent sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#f5f3ff", color: "#7c3aed", width: 48, height: 48 }}>
                      <AutorenewIcon sx={{ fontSize: 24 }} />
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 900, color: "#0f172a", fontSize: "1.5rem", lineHeight: 1 }}>3</Typography>
                      <Typography sx={{ fontWeight: 800, color: "#5b21b6", fontSize: "0.85rem" }}>Trámites</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

          </Box>
        )}

        {/* ─── TAB 1: AGENDA ─── */}
        {activeTab === 1 && (
          <Box>

            {/* SUB-TAB SWITCHER */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 4, bgcolor: "rgba(0,0,0,0.04)", p: 0.8, borderRadius: 5 }}>
              <ButtonBase
                onClick={() => { setAgendaSubTab("TRAMITE"); setSearchTerm(""); setFilterState("TODOS"); }}
                sx={{
                  py: 2, borderRadius: 4, fontWeight: 900, fontSize: "0.95rem", gap: 1,
                  color: agendaSubTab === "TRAMITE" ? "#0284c7" : "#64748b",
                  bgcolor: agendaSubTab === "TRAMITE" ? "white" : "transparent",
                  boxShadow: agendaSubTab === "TRAMITE" ? "0 4px 15px rgba(0,0,0,0.05)" : "none",
                  transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                <AssignmentIcon sx={{ fontSize: 20 }} />
                Trámites ({totalTramites})
              </ButtonBase>
              <ButtonBase
                onClick={() => { setAgendaSubTab("OFICIO"); setSearchTerm(""); setFilterState("TODOS"); }}
                sx={{
                  py: 2, borderRadius: 4, fontWeight: 900, fontSize: "0.95rem", gap: 1,
                  color: agendaSubTab === "OFICIO" ? "#0f172a" : "#64748b",
                  bgcolor: agendaSubTab === "OFICIO" ? "white" : "transparent",
                  boxShadow: agendaSubTab === "OFICIO" ? "0 4px 15px rgba(0,0,0,0.05)" : "none",
                  transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                <ShieldIcon sx={{ fontSize: 20 }} />
                Oficio ({totalOficios})
              </ButtonBase>
            </Box>

            {/* SEARCH + CHIPS */}
            <Box sx={{ mb: 4, display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#94a3b8", fontSize: 22 }} />
                    </InputAdornment>
                  ),
                  sx: {
                    bgcolor: "white",
                    borderRadius: 4.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    border: "1.5px solid #e2e8f0",
                    "& fieldset": { border: "none" }
                  }
                }}
              />
              <Stack direction="row" spacing={1.5}>
                {[
                  { label: `Todos (${countTotal})`, val: "TODOS", active: "#0f172a" },
                  { label: `En Curso (${countEnCurso})`, val: "EN CURSO", active: agendaSubTab === "TRAMITE" ? "#0284c7" : "#0f172a" },
                  { label: `Pendientes (${countPendiente})`, val: "PENDIENTE", active: "#f59e0b" }
                ].map(f => (
                  <Chip
                    key={f.val}
                    label={f.label}
                    onClick={() => setFilterState(f.val)}
                    sx={{
                      fontWeight: 800, px: 1, py: 2.3, borderRadius: 4, fontSize: "0.8rem",
                      bgcolor: filterState === f.val ? f.active : "white",
                      color: filterState === f.val ? "white" : "#475569",
                      border: filterState === f.val ? "none" : "1px solid #e2e8f0",
                      transition: "all 0.15s"
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* LIST */}
            <Stack spacing={3}>

              {/* TRAMITE CARDS */}
              {agendaSubTab === "TRAMITE" && filteredAsignadas.map((inspeccion) => {
                const isEnCurso = inspeccion.estado === "EN CURSO";
                return (
                  <Card
                    key={inspeccion.id}
                    onClick={() => handleStartInspection(inspeccion, "TRAMITE")}
                    elevation={0}
                    sx={{
                      borderRadius: 6, bgcolor: "white", cursor: "pointer",
                      border: `1.5px solid ${isEnCurso ? "rgba(2,132,199,0.35)" : "rgba(226,232,240,0.9)"}`,
                      boxShadow: isEnCurso ? "0 6px 20px rgba(2,132,199,0.06)" : "0 2px 10px rgba(15,23,42,0.01)",
                      position: "relative", overflow: "hidden",
                      transition: "all 0.22s ease",
                      "&:hover": { transform: "translateY(-3px)", boxShadow: "0 12px 28px rgba(15,23,42,0.06)" }
                    }}
                  >
                    {/* Color accent bar */}
                    <Box sx={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, bgcolor: "#0284c7" }} />
                    <CardContent sx={{ pl: 4.5, pr: 3.5, py: 3.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ flex: 1 }}>
                        {/* EXP NUMBER + STATE */}
                        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                          <Chip label={inspeccion.nroExpediente} size="small" sx={{ bgcolor: "#e0f2fe", color: "#0369a1", fontWeight: 900, fontSize: "0.7rem", borderRadius: 1.5 }} />
                          <Chip label={inspeccion.estado} size="small" sx={{ fontWeight: 900, fontSize: "0.7rem", borderRadius: 1.5, bgcolor: isEnCurso ? "#def7ed" : "#f1f5f9", color: isEnCurso ? "#065f46" : "#475569" }} />
                        </Stack>
                        {/* NAME */}
                        <Typography sx={{ fontWeight: 900, color: "#0f172a", fontSize: "1.45rem", letterSpacing: "-0.5px", lineHeight: 1.1, mb: 0.5 }}>
                          {inspeccion.name}
                        </Typography>
                        <Typography sx={{ color: "#475569", fontWeight: 700, fontSize: "0.9rem", mb: 1.5 }}>
                          {inspeccion.tramite}
                        </Typography>
                        {/* META */}
                        <Stack direction="row" spacing={3}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                            <RoomIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                            <Typography sx={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>{inspeccion.direccion}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                            <CalendarTodayIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                            <Typography sx={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>{inspeccion.fecha}</Typography>
                          </Box>
                        </Stack>
                      </Box>
                      <IconButton sx={{ width: 56, height: 56, bgcolor: "#0284c7", color: "white", ml: 2, boxShadow: "0 6px 16px rgba(2,132,199,0.25)", flexShrink: 0, "&:hover": { bgcolor: "#0369a1", transform: "scale(1.05)" }, transition: "all 0.2s" }}>
                        <PlayArrowIcon sx={{ fontSize: 28 }} />
                      </IconButton>
                    </CardContent>
                  </Card>
                );
              })}

              {/* OFICIO CARDS */}
              {agendaSubTab === "OFICIO" && filteredAsignadas.map((inspeccion) => {
                const isEnCurso = inspeccion.estado === "EN CURSO";
                const isDenuncia = inspeccion.motivoOficio === "DENUNCIA";
                const accentColor = isDenuncia ? "#ef4444" : "#10b981";
                return (
                  <Card
                    key={inspeccion.id}
                    onClick={() => handleStartInspection(inspeccion, inspeccion.motivoOficio)}
                    elevation={0}
                    sx={{
                      borderRadius: 6, bgcolor: "white", cursor: "pointer",
                      border: `1.5px solid ${isDenuncia ? "rgba(239,68,68,0.25)" : "rgba(16,185,129,0.25)"}`,
                      boxShadow: isDenuncia ? "0 6px 20px rgba(239,68,68,0.04)" : "0 6px 20px rgba(16,185,129,0.04)",
                      position: "relative", overflow: "hidden",
                      transition: "all 0.22s ease",
                      "&:hover": { transform: "translateY(-3px)", boxShadow: `0 12px 28px ${isDenuncia ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)"}` }
                    }}
                  >
                    <Box sx={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, bgcolor: accentColor }} />
                    <CardContent sx={{ pl: 4.5, pr: 3.5, py: 3.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ flex: 1 }}>
                        {/* MOTIVE + STATE */}
                        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                          {isDenuncia ? (
                            <Chip
                              icon={<WarningIcon sx={{ fontSize: "13px !important", color: "#9b1c1c !important" }} />}
                              label="DENUNCIA" size="small"
                              sx={{ bgcolor: "#fde8e8", color: "#9b1c1c", fontWeight: 900, fontSize: "0.7rem", borderRadius: 1.5 }}
                            />
                          ) : (
                            <Chip
                              icon={<GradingIcon sx={{ fontSize: "13px !important", color: "#065f46 !important" }} />}
                              label="RUTINA" size="small"
                              sx={{ bgcolor: "#def7ed", color: "#065f46", fontWeight: 900, fontSize: "0.7rem", borderRadius: 1.5 }}
                            />
                          )}
                          <Chip label={inspeccion.estado} size="small" sx={{ fontWeight: 900, fontSize: "0.7rem", borderRadius: 1.5, bgcolor: isEnCurso ? "#e0f2fe" : "#f1f5f9", color: isEnCurso ? "#0284c7" : "#475569" }} />
                        </Stack>
                        {/* NAME */}
                        <Typography sx={{ fontWeight: 900, color: "#0f172a", fontSize: "1.45rem", letterSpacing: "-0.5px", lineHeight: 1.1, mb: 0.5 }}>
                          {inspeccion.name}
                        </Typography>
                        <Typography sx={{ color: isDenuncia ? "#b91c1c" : "#475569", fontWeight: 700, fontSize: "0.9rem", mb: 1.5 }}>
                          {inspeccion.detalle}
                        </Typography>
                        {/* META */}
                        <Stack direction="row" spacing={3}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                            <RoomIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                            <Typography sx={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>{inspeccion.direccion}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                            <CalendarTodayIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                            <Typography sx={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>{inspeccion.fecha}</Typography>
                          </Box>
                        </Stack>
                      </Box>
                      <IconButton sx={{ width: 56, height: 56, bgcolor: accentColor, color: "white", ml: 2, boxShadow: `0 6px 16px ${accentColor}40`, flexShrink: 0, "&:hover": { filter: "brightness(0.9)", transform: "scale(1.05)" }, transition: "all 0.2s" }}>
                        <PlayArrowIcon sx={{ fontSize: 28 }} />
                      </IconButton>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredAsignadas.length === 0 && (
                <Typography sx={{ textAlign: "center", color: "#94a3b8", py: 8, fontWeight: 700 }}>
                  No hay inspecciones en esta categoría.
                </Typography>
              )}
            </Stack>
          </Box>
        )}

        {/* ─── TAB 2: LEGAJOS ─── */}
        {activeTab === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Typography sx={{ fontWeight: 900, color: "#0f172a", borderLeft: "4px solid #d97706", pl: 2, fontSize: "1.5rem", letterSpacing: "-0.5px" }}>
              Expedientes Activos
            </Typography>
            <Stack spacing={3}>
              {[
                { nro: "EX-2026-08122", desc: "Habilitación de Complejo Quirúrgico", efector: "Sanatorio Allende", pct: 75, badge: "EN REVISIÓN", color: "#0284c7" },
                { nro: "EX-2026-11902", desc: "Ampliación de Camas UTI Pediátrica", efector: "Hospital Privado", pct: 40, badge: "PENDIENTE", color: "#f59e0b" },
                { nro: "EX-2026-02331", desc: "Reválida de Legajo Médico", efector: "Clínica Reina Fabiola", pct: 90, badge: "APORTAR PRUEBAS", color: "#10b981" }
              ].map((exp, idx) => (
                <Card key={idx} elevation={0} sx={{ borderRadius: 5, bgcolor: "white", p: 4, border: "1.5px solid #e2e8f0" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ fontWeight: 900, color: "#64748b", fontSize: "0.85rem" }}>{exp.nro}</Typography>
                    <Chip label={exp.badge} size="small" sx={{ fontWeight: 900, fontSize: "0.7rem", bgcolor: exp.color + "15", color: exp.color }} />
                  </Box>
                  <Typography sx={{ fontWeight: 900, color: "#0f172a", mb: 0.5, fontSize: "1.3rem", letterSpacing: "-0.5px" }}>{exp.desc}</Typography>
                  <Typography sx={{ color: "#475569", mb: 3, fontSize: "0.9rem" }}>Efector: <b>{exp.efector}</b></Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <LinearProgress variant="determinate" value={exp.pct} sx={{ flex: 1, height: 8, borderRadius: 5, bgcolor: "#e2e8f0", "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg, ${exp.color}80, ${exp.color})`, borderRadius: 5 } }} />
                    <Typography sx={{ fontWeight: 900, color: "#0f172a", fontSize: "0.9rem" }}>{exp.pct}%</Typography>
                  </Box>
                </Card>
              ))}
            </Stack>
          </Box>
        )}

        {/* ─── TAB 3: TRÁMITES ─── */}
        {activeTab === 3 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Typography sx={{ fontWeight: 900, color: "#0f172a", borderLeft: "4px solid #7c3aed", pl: 2, fontSize: "1.5rem", letterSpacing: "-0.5px" }}>
              Sincronización de Actas
            </Typography>
            <Stack spacing={3}>
              {[
                { item: "Inspección de Infraestructura Quirófano", efector: "Sanatorio Allende", status: "En Proceso de Firma", sinc: "Sincronizado", color: "#10b981" },
                { item: "Validación de Director Técnico", efector: "Hospital Privado", status: "Falta CUIL CiDi Nivel 2", sinc: "Pendiente Offline", color: "#f59e0b" },
                { item: "Inspección de Bioseguridad", efector: "Hospital de la Cañada", status: "En carga inicial", sinc: "Sincronizado", color: "#10b981" }
              ].map((t, idx) => (
                <Card key={idx} elevation={0} sx={{ borderRadius: 5, bgcolor: "white", p: 4, border: "1.5px solid #e2e8f0" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.05rem" }}>{t.item}</Typography>
                    <Chip label={t.sinc} size="small" sx={{ fontWeight: 900, fontSize: "0.7rem", bgcolor: t.color + "15", color: t.color }} />
                  </Box>
                  <Typography sx={{ color: "#64748b", fontSize: "0.9rem" }}>
                    {t.efector} · <span style={{ color: "#0f172a", fontWeight: 800 }}>{t.status}</span>
                  </Typography>
                </Card>
              ))}
            </Stack>
          </Box>
        )}

      </Box>

      {/* ─── FLOATING DOCK ─── */}
      <Paper
        elevation={0}
        sx={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          width: "88%", maxWidth: 560, zIndex: 2000, borderRadius: 6,
          background: "rgba(255,255,255,0.82)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 8px 32px rgba(15,23,42,0.10)",
          overflow: "hidden"
        }}
      >
        <BottomNavigation
          showLabels value={activeTab}
          onChange={(_, v) => { setActiveTab(v); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          sx={{
            height: 74, bgcolor: "transparent",
            "& .MuiBottomNavigationAction-root": {
              color: "#94a3b8", transition: "all 0.2s",
              "&.Mui-selected": {
                color: "#0f172a",
                "& .MuiSvgIcon-root": { transform: "scale(1.2)" },
                "& .MuiBottomNavigationAction-label": { fontWeight: 900, fontSize: "0.78rem" }
              }
            }
          }}
        >
          <BottomNavigationAction label="Inicio" icon={<HomeIcon sx={{ fontSize: 25 }} />} />
          <BottomNavigationAction label="Agenda" icon={<LocalHospitalIcon sx={{ fontSize: 25 }} />} />
          <BottomNavigationAction label="Legajos" icon={<FolderOpenIcon sx={{ fontSize: 25 }} />} />
          <BottomNavigationAction label="Trámites" icon={<AutorenewIcon sx={{ fontSize: 25 }} />} />
        </BottomNavigation>
      </Paper>

      {/* ─── MODAL: MOTIVO OFICIO ─── */}
      <Dialog
        open={oficioTypeOpen} onClose={() => setOficioTypeOpen(false)}
        fullWidth maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 7, p: 3.5, bgcolor: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)" } }}
      >
        <DialogTitle sx={{ fontWeight: 900, textAlign: "center", fontSize: "1.35rem", color: "#0f172a", pb: 1 }}>
          Nueva Inspección de Oficio
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", pt: 1 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Button variant="outlined" fullWidth startIcon={<HelpOutlineIcon sx={{ fontSize: 22 }} />} onClick={() => handleSelectOficioType("RUTINA")} sx={{ py: 2.8, borderRadius: 5, fontWeight: 900, color: "#0f172a", borderColor: "#cbd5e1", borderWidth: "2px", textTransform: "none", fontSize: "1.05rem", "&:hover": { bgcolor: "#f8fafc", borderColor: "#0f172a", borderWidth: "2px" } }}>Control de Rutina</Button>
            <Button variant="outlined" fullWidth color="error" startIcon={<ReportIcon sx={{ fontSize: 22 }} />} onClick={() => handleSelectOficioType("DENUNCIA")} sx={{ py: 2.8, borderRadius: 5, fontWeight: 900, borderWidth: "2px", textTransform: "none", fontSize: "1.05rem", "&:hover": { bgcolor: "#fff5f5", borderWidth: "2px" } }}>Atención por Denuncia</Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pt: 2 }}>
          <Button variant="text" onClick={() => setOficioTypeOpen(false)} sx={{ fontWeight: 800, color: "#64748b" }}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* ─── MODAL: BUSCAR ESTABLECIMIENTO ─── */}
      <Dialog
        open={oficioModalOpen} onClose={() => setOficioModalOpen(false)}
        fullWidth maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 7, p: 3, bgcolor: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)" } }}
      >
        <DialogTitle sx={{ fontWeight: 900, display: "flex", justifyContent: "space-between", alignItems: "flex-start", pb: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 900, color: "#0f172a", fontSize: "1.3rem" }}>Asociar Establecimiento</Typography>
            <Typography sx={{ color: "#0284c7", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5, mt: 0.5 }}>
              {selectedOficioType === "RUTINA" ? "INSPECCIÓN DE RUTINA" : "ATENCIÓN POR DENUNCIA"}
            </Typography>
          </Box>
          <IconButton onClick={() => setOficioModalOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "rgba(0,0,0,0.06)", py: 3 }}>
          <TextField
            fullWidth placeholder="Buscar establecimiento..."
            value={oficioSearch} onChange={(e) => setOficioSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#64748b" }} /></InputAdornment>,
              sx: { bgcolor: "#f1f5f9", borderRadius: 4, fontWeight: 600, mb: 3 }
            }}
          />
          <Typography sx={{ fontWeight: 900, color: "#94a3b8", display: "block", mb: 2, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: 0.5 }}>
            {filteredOficio.length} establecimientos
          </Typography>
          <List sx={{ maxHeight: 280, overflowY: "auto" }}>
            {filteredOficio.map((efector) => (
              <ListItem key={efector.id} button onClick={() => { setOficioModalOpen(false); handleStartInspection({ id: efector.id, name: efector.name, tipologia: efector.tipologia, dt: efector.dt }, selectedOficioType); }} sx={{ borderRadius: 4, mb: 1.5, border: "1.5px solid #f1f5f9", p: 2, "&:hover": { bgcolor: "#f0f9ff", borderColor: "#bae6fd" } }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LocalHospitalIcon sx={{ color: "#0284c7", fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography sx={{ fontWeight: 900, color: "#0f172a", fontSize: "1rem" }}>{efector.name}</Typography>}
                  secondary={<Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 550 }}>{efector.direccion}</Typography>}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, justifyContent: "space-between" }}>
          <Button variant="text" onClick={() => { setOficioModalOpen(false); setOficioTypeOpen(true); }} sx={{ fontWeight: 800, color: "#0284c7" }}>Atrás</Button>
          <Button variant="text" onClick={() => setOficioModalOpen(false)} sx={{ fontWeight: 800, color: "#64748b" }}>Cancelar</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default HomeInspector;
