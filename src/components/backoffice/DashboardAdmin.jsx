import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, Fab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import Layout from '../ui/Layout';
import ModalHabilitacion from '../ui/ModalHabilitacion';

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const cards = [
    { 
      title: "Asignación de Roles", 
      path: "/clicsalud-backoffice/asignar-rol", 
      icon: <PeopleIcon sx={{ fontSize: 60 }} /> 
    },
    { 
      title: "Configuración de Recursos", 
      path: "/clicsalud-backoffice/gestion-recursos", 
      icon: <SettingsIcon sx={{ fontSize: 60 }} /> 
    }
  ];

  return (
    <Layout>
      <Box sx={{ 
        p: 10, 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 150px)' 
      }}>
        <Grid container spacing={4} sx={{ maxWidth: '800px', justifyContent: 'center' }}>
          {cards.map((item) => (
            <Grid item xs={12} md={6} key={item.title} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card 
                elevation={2} 
                sx={{ 
                  borderRadius: 2, 
                  border: '1px solid #eceff1',
                  width: '350px', 
                  height: '220px', 
                  display: 'flex',
                  flexDirection: 'column',
                  transition: '0.2s',
                  '&:hover': { 
                    border: '2px solid #0090d0', 
                    transform: 'scale(1.02)' 
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => navigate(item.path)} 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
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
      <Fab 
        onClick={() => setOpenModal(true)} 
        sx={{ 
          position: "fixed", 
          bottom: 30, 
          right: 30, 
          backgroundColor: "#005596", 
          color: "white",
          '&:hover': { backgroundColor: "#00447a" }
        }}
      >
        <AddIcon />
      </Fab>
      <ModalHabilitacion open={openModal} onClose={() => setOpenModal(false)} />
    </Layout>
  );
};

export default DashboardAdmin;