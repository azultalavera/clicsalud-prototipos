import React from 'react';
import { Box, Typography, Grid, Card, CardActionArea, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import PeopleIcon from '@mui/icons-material/People'; 
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import Layout from '../ui/Layout';

const GestionRecursos = () => {
  const navigate = useNavigate();

  const categorias = [
    { 
      title: "Infraestructura", 
      path: "/clicsalud-backoffice/gestion-recursos/infraestructura", 
      icon: <BusinessIcon sx={{ fontSize: 60 }} /> 
    },
    { 
      title: "Equipamientos", 
      path: "/clicsalud-backoffice/gestion-recursos/equipamientos", 
      icon: <HomeRepairServiceIcon sx={{ fontSize: 60 }} /> 
    },
    { 
      title: "Recursos Humanos", 
      // Esta ruta debe coincidir con la de RecursosHumanosConfig.jsx
      path: "/clicsalud-backoffice/gestion-recursos/recursos-humanos", 
      icon: <PeopleIcon sx={{ fontSize: 60 }} /> 
    },
    { 
      title: "Jefe de Servicio", 
      // Esta ruta debe coincidir con la de JefeServicioConfig.jsx
      path: "/clicsalud-backoffice/gestion-recursos/jefe-servicio", 
      icon: <SupervisorAccountIcon sx={{ fontSize: 60 }} /> 
    }
  ];

  return (
    <Layout>
      <Paper elevation={3} sx={{ borderRadius: '4px', overflow: 'hidden', mb: 5, mx: 'auto', maxWidth: '1700px' }}>
        <Box sx={{ backgroundColor: '#005596', color: 'white', py: 2, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>Configuración de recursos</Typography>
        </Box>

        <Box sx={{ p: 10, backgroundColor: 'white', display: 'flex', justifyContent: 'center' }}>
          <Grid 
            container 
            spacing={2} 
            sx={{ maxWidth: '700px' }} 
            justifyContent="center"
          >
            {categorias.map((item) => (
              <Grid item xs={12} sm={6} key={item.title} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card elevation={2} sx={{ 
                  width: '300px', 
                  height: '200px', 
                  borderRadius: 2, 
                  border: '1px solid #eceff1',
                  '&:hover': { border: '2px solid #0090d0', transform: 'scale(1.02)' },
                  transition: '0.2s'
                }}>
                  <CardActionArea onClick={() => navigate(item.path)} sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                    <Box sx={{ color: '#0090d0', mb: 2 }}>{item.icon}</Box>
                    <Typography variant="h5" sx={{ color: '#005596', fontWeight: 'bold' }}>
                      {item.title}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Layout>
  );
};

export default GestionRecursos;