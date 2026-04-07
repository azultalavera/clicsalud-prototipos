import React from 'react';
import { Box, Typography, Grid, Card, CardActionArea, IconButton, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import PeopleIcon from '@mui/icons-material/People'; 
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Layout from '../ui/Layout';

// Mock data to include descriptions and colors for the visual improvement
const categorias = [
  { 
    id: 'infra',
    title: "Infraestructura", 
    description: "Configuración de parámetros físicos y tipologías edilicias.",
    path: "/clicsalud-backoffice/gestion-recursos/infraestructura", 
    icon: <BusinessIcon sx={{ fontSize: 32 }} />,
    color: "#0B85C4",
    bg: "linear-gradient(135deg, #0B85C4 0%, #086a9f 100%)"
  },
  { 
    id: 'equip',
    title: "Equipamientos", 
    description: "Matriz de equipos médicos, calibración y tecnología instalada.",
    path: "/clicsalud-backoffice/gestion-recursos/equipamientos", 
    icon: <HomeRepairServiceIcon sx={{ fontSize: 32 }} />,
    color: "#8b5cf6",
    bg: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
  },
  { 
    id: 'rrhh',
    title: "Recursos Humanos", 
    description: "Definición paramétrica de personal, matrículas y roles.",
    path: "/clicsalud-backoffice/gestion-recursos/recursos-humanos", 
    icon: <PeopleIcon sx={{ fontSize: 32 }} />,
    color: "#32A430",
    bg: "linear-gradient(135deg, #32A430 0%, #257e24 100%)"
  },
  { 
    id: 'jefes',
    title: "Jefe de Servicio", 
    description: "Perfiles requeridos para directores de área y coordinadores médicos.",
    path: "/clicsalud-backoffice/gestion-recursos/jefe-servicio", 
    icon: <SupervisorAccountIcon sx={{ fontSize: 32 }} />,
    color: "#f59e0b",
    bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
  },
  {
    id: 'acta',
    title: "Actas de Inspección",
    description: "Constructor de formularios maestros y requisitos automáticos.",
    path: "/clicsalud-backoffice/gestion-recursos/acta-inpeccion",
    icon: <AssignmentIcon sx={{ fontSize: 32 }} />,
    color: "#E2464C",
    bg: "linear-gradient(135deg, #E2464C 0%, #b91c1c 100%)"
  }
];

const GestionRecursos = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Box sx={{ maxWidth: "1200px", mx: "auto", p: { xs: 2, md: 3, lg: 4 }, fontFamily: "Roboto, sans-serif" }}>
        
        {/* CONTAINER CON FONDO BLANCO */}
        <Box sx={{ backgroundColor: "#ffffff", p: { xs: 3, md: 4, lg: 5 }, borderRadius: 4, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.05)", border: "1px solid #e2e8f0", minHeight: "calc(100vh - 120px)" }}>

        {/* BREADCRUMB / BACK ARROW */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigate("/clicsalud-backoffice")} sx={{ backgroundColor: "#f1f5f9", mr: 2 }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
            Volver a Panel
          </Typography>
        </Box>

        {/* HEADER SECTION */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
          <Box sx={{ p: 2, borderRadius: 3, backgroundColor: "rgba(11, 133, 196, 0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
             <SettingsSuggestIcon sx={{ color: "#0B85C4", fontSize: 48 }} />
          </Box>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: "#1e293b", letterSpacing: "-0.02em", mb: 1 }}>
              Configuración de Recursos
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b", fontSize: "1.1rem" }}>
              Gestione las reglas de negocio, matrices de evaluación y parámetros del sistema central.
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 6 }} />

        {/* CARDS GRID */}
        <Grid container spacing={3} justifyContent="center" alignItems="stretch">
          {categorias.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 4, 
                  border: "1px solid #e2e8f0",
                  height: "210px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  '&:hover': {
                    borderColor: item.color,
                    boxShadow: `0 20px 25px -5px ${item.color}20, 0 8px 10px -6px ${item.color}20`,
                    transform: "translateY(-4px)"
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => navigate(item.path)}
                  sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start" }}
                >
                  <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box sx={{ p: 1.5, borderRadius: 3, background: item.bg, color: "#ffffff", display: "flex", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
                      {item.icon}
                    </Box>
                    <IconButton sx={{ backgroundColor: "#f8fafc", color: item.color, width: 32, height: 32 }}>
                       <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1, lineHeight: 1.2 }}>
                      {item.title}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ color: "#64748b", flexGrow: 1, lineHeight: 1.6, fontSize: "0.95rem" }}>
                    {item.description}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        </Box>
      </Box>
    </Layout>
  );
};

export default GestionRecursos;