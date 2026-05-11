import React from "react";
import { Box, Typography, Paper, Grid, Avatar } from "@mui/material";
import {
  HomeWork as HomeWorkIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const DashboardEfector = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", p: { xs: 2, md: 4 }, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#111", mb: 1, letterSpacing: -0.5 }}>
          Panel de Control
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona tus establecimientos y da seguimiento a tus trámites de forma rápida.
        </Typography>
      </Box>

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
                  Mis Establecimientos
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
                  Mis Trámites
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
      </Grid>
    </Box>
  );
};

export default DashboardEfector;
