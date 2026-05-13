import React from "react";
import { Box, Typography, Paper, Grid, Avatar } from "@mui/material";
import {
  HomeWork as HomeWorkIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { MOCK_ESTABLECIMIENTOS, MOCK_TRAMITES } from "../../data/mockData";


const DashboardEfector = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", p: { xs: 2, md: 4 } }}>
      {/* Header Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 5, 
          bgcolor: "white", 
          borderRadius: "16px", 
          border: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          gap: 2.5
        }}
      >
        <Box sx={{ width: 6, height: 36, bgcolor: "#005596", borderRadius: "4px" }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#005596", letterSpacing: -1 }}>
            Panel de Control
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona tus establecimientos y da seguimiento a tus trámites de forma rápida.
          </Typography>
        </Box>
      </Paper>

      {/* Modern Dashboard Cards */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper
            onClick={() => navigate("/home-efector/mis-establecimientos")}
            elevation={2}
            sx={{
              p: 4,
              borderRadius: "16px",
              cursor: "pointer",
              border: "1px solid #e0e0e0",
              bgcolor: "#fff",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                borderColor: '#004a80'
              }
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle2" color="#004a80" sx={{ fontWeight: 700, mb: 1 }}>
                  BANDEJA PRINCIPAL
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a1a1a", mb: 1 }}>
                  Mis Establecimientos ({MOCK_ESTABLECIMIENTOS.length})
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Visualiza y gestiona todos tus establecimientos registrados.
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "#f0f7fb", color: "#004a80", width: 80, height: 80 }}>
                <HomeWorkIcon sx={{ fontSize: 40 }} />
              </Avatar>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            onClick={() => navigate("/home-efector/mis-tramites")}
            elevation={2}
            sx={{
              p: 4,
              borderRadius: "16px",
              cursor: "pointer",
              border: "1px solid #e0e0e0",
              bgcolor: "#fff",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                borderColor: '#004a80'
              }
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle2" color="#004a80" sx={{ fontWeight: 700, mb: 1 }}>
                  SEGUIMIENTO
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a1a1a", mb: 1 }}>
                  Mis Trámites ({MOCK_TRAMITES.length})
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Da seguimiento al estado de tus habilitaciones y renovaciones.
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "#f0f7fb", color: "#004a80", width: 80, height: 80 }}>
                <TimelineIcon sx={{ fontSize: 40 }} />
              </Avatar>
            </Box>
          </Paper>
        </Grid>

        {/* Quick Stats Summary */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", mb: 2, mt: 2 }}>
            Estadísticas de Gestión
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: "Establecimientos Habilitados", count: MOCK_ESTABLECIMIENTOS.filter(e => e.estado === "HABILITADO").length, color: "#2e7d32" },
              { label: "Trámites en Auditoría", count: MOCK_TRAMITES.filter(t => t.estado.includes("AUDITORÍA")).length, color: "#424242" },
              { label: "Próximos a Vencer", count: MOCK_ESTABLECIMIENTOS.filter(e => e.estado === "PRÓXIMO A VENCER").length, color: "#f57f17" },
              { label: "Vencidos / No Vigentes", count: MOCK_ESTABLECIMIENTOS.filter(e => e.estado === "VENCIDO" || e.estado === "NO VIGENTE").length, color: "#d32f2f" },
            ].map((stat, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", textAlign: 'center', border: `1px solid ${stat.color}30`, bgcolor: `${stat.color}05` }}>
                  <Typography variant="h4" sx={{ fontWeight: 950, color: stat.color }}>{stat.count}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: 'uppercase' }}>{stat.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardEfector;
