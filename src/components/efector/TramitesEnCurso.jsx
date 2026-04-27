import React from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Business as BusinessIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const TRAMITES = [
  {
    id: 1,
    tipo: "HABILITACIÓN",
    estado: "BORRADOR AUDITORÍA",
    fecha: "20/10/2025",
    color: "#424242", // Gris oscuro
    accion: "CONTINUAR",
    buttonColor: "#00b0ff",
  },
  {
    id: 2,
    tipo: "HABILITACIÓN",
    estado: "RESPUESTA EMPLAZAMIENTO",
    fecha: "15/1/2026",
    color: "#800000", // Bordo
    accion: "CONTINUAR",
    buttonColor: "#00b0ff",
  },
  {
    id: 3,
    tipo: "HABILITACIÓN",
    estado: "EN ANÁLISIS ARQUITECTURA",
    fecha: "16/1/2026",
    color: "#03a9f4", // Celeste
    accion: "VISUALIZAR",
    buttonColor: "#ffb74d",
  },
  {
    id: 4,
    tipo: "HABILITACIÓN",
    estado: "BORRADOR AUDITORÍA",
    fecha: "13/2/2026",
    color: "#757575", // Gris
    accion: "CONTINUAR",
    buttonColor: "#00b0ff",
  },
  {
    id: 5,
    tipo: "HABILITACIÓN",
    estado: "PENDIENTE DE EVALUACIÓN ARQUITECTURA",
    fecha: "19/2/2026",
    color: "#ff9800", // Naranja
    accion: "VISUALIZAR",
    buttonColor: "#ffb74d",
  },
  {
    id: 6,
    tipo: "HABILITACIÓN",
    estado: "ACEPTADO DOCUMENTACIÓN...",
    fecha: "10/3/2026",
    color: "#fbc02d", // Amarillo oscuro
    accion: "VISUALIZAR",
    buttonColor: "#ffb74d",
  },
];

const TramiteCard = ({ tramite, onAction }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        mb: 1,
        display: "flex",
        alignItems: "center",
        borderLeft: `8px solid ${tramite.color}`,
        borderRadius: "4px",
        overflow: "hidden",
        p: 2,
        minHeight: "100px",
        border: '1px solid #e0e0e0',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Box sx={{ mr: 4, ml: 1, display: "flex", alignItems: "center" }}>
        <BusinessIcon sx={{ fontSize: 45, color: "#555" }} />
      </Box>

      <Box sx={{ flex: 1.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#333", letterSpacing: 0.5 }}>
          {tramite.tipo}
        </Typography>
      </Box>

      <Box sx={{ flex: 2, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
          Estado del trámite:
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold", color: "#444", lineHeight: 1.2 }}>
          {tramite.estado}
        </Typography>
      </Box>

      <Box sx={{ flex: 1.5, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
          Fecha de creación:
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold", color: "#444" }}>
          {tramite.fecha}
        </Typography>
      </Box>

      <Box sx={{ ml: 4 }}>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => onAction(tramite)}
          sx={{
            backgroundColor: tramite.buttonColor,
            "&:hover": { backgroundColor: tramite.buttonColor, opacity: 0.9 },
            borderRadius: "8px",
            px: 4,
            py: 1,
            fontWeight: "bold",
            fontSize: "0.85rem",
            boxShadow: 'none',
            textTransform: 'none'
          }}
        >
          {tramite.accion}
        </Button>
      </Box>
    </Paper>
  );
};

const TramitesEnCurso = () => {
  const navigate = useNavigate();

  const handleAction = (tramite) => {
    if (tramite.accion === "CONTINUAR") {
      if (tramite.id === 2) {
        navigate("/home-efector/respuesta-emplazamiento");
      } else {
        navigate("/home-efector/servicios");
      }
    }
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      {/* Tabs Superiores */}
      <Box sx={{ mb: 0, display: "flex" }}>
        <Tabs
          value={1}
          textColor="primary"
          indicatorColor="none"
          sx={{
            minHeight: "auto",
            "& .MuiTabs-indicator": { display: "none" },
            "& .MuiTab-root": {
              textTransform: "uppercase",
              fontWeight: "bold",
              fontSize: "0.85rem",
              minHeight: "auto",
              py: 1.5,
              px: 3,
              mr: 1,
              borderRadius: "8px 8px 0 0",
              color: "#666",
              bgcolor: "#f5f5f5",
              border: '1px solid #ddd',
              borderBottom: 'none',
              "&.Mui-selected": {
                bgcolor: "#004a80",
                color: "white",
                borderColor: "#004a80",
              },
            },
          }}
        >
          <Tab label="MIS ESTABLECIMIENTOS" />
          <Tab label="TRÁMITES EN CURSO" />
        </Tabs>
      </Box>

      {/* Contenedor Principal */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "0 8px 8px 8px",
          overflow: "hidden",
          border: "1px solid #004a80",
          backgroundColor: '#fff'
        }}
      >
        {/* Título Azul */}
        <Box
          sx={{
            bgcolor: "#004a80",
            color: "white",
            py: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 500, letterSpacing: 1.5 }}>
            Trámites en curso
          </Typography>
        </Box>

        {/* Lista de Trámites */}
        <Box
          sx={{
            p: 3,
            bgcolor: "#fcfcfc",
            maxHeight: "calc(100vh - 350px)",
            overflowY: "auto",
            backgroundImage: "radial-gradient(#ddd 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Stack spacing={1}>
            {TRAMITES.map((tramite) => (
              <TramiteCard key={tramite.id} tramite={tramite} onAction={handleAction} />
            ))}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default TramitesEnCurso;
