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
    path: "/clicsalud-backoffice/gestion-recursos/infraestructura", 
    icon: <BusinessIcon sx={{ fontSize: 48 }} />,
    color: "#0B85C4",
  },
  { 
    id: 'equip',
    title: "Equipamientos", 
    path: "/clicsalud-backoffice/gestion-recursos/equipamientos", 
    icon: <HomeRepairServiceIcon sx={{ fontSize: 48 }} />,
    color: "#8b5cf6",
  },
  { 
    id: 'rrhh',
    title: "Recursos Humanos", 
    path: "/clicsalud-backoffice/gestion-recursos/recursos-humanos", 
    icon: <PeopleIcon sx={{ fontSize: 48 }} />,
    color: "#32A430",
  },
  { 
    id: 'jefes',
    title: "Jefe de Servicio", 
    path: "/clicsalud-backoffice/gestion-recursos/jefe-servicio", 
    icon: <SupervisorAccountIcon sx={{ fontSize: 48 }} />,
    color: "#f59e0b",
  },
  {
    id: 'acta',
    title: "Actas de Inspección",
    path: "/clicsalud-backoffice/gestion-recursos/acta-inpeccion",
    icon: <AssignmentIcon sx={{ fontSize: 48 }} />,
    color: "#E2464C",
  },
  {
    id: 'servicios',
    title: "Servicios",
    path: "/clicsalud-backoffice/gestion-recursos/servicios",
    icon: <SettingsSuggestIcon sx={{ fontSize: 48 }} />,
    color: "#00796b",
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
                  aspectRatio: "1/1",
                  backgroundColor: "#ffffff",
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
                  sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 3 }}
                >
                  <Box sx={{ color: item.color, mb: 2 }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", textAlign: "center", lineHeight: 1.2 }}>
                    {item.title}
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