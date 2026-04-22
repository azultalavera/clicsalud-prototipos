import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea,
  IconButton
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

const roles = [
  {
    id: 'admin',
    title: 'Administración Central',
    description: 'Gestión de configuración maestra, recursos, infraestructura y asignación de roles del sistema.',
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 60, color: '#005596' }} />,
    path: '/admin',
    color: '#005596'
  },
  {
    id: 'efector',
    title: 'Efector de Salud',
    description: 'Acceso para instituciones de salud. Gestión de datos propios, personal y cumplimiento de normativas.',
    icon: <LocalHospitalIcon sx={{ fontSize: 60, color: '#008bb4' }} />,
    path: '/home-efector',
    color: '#008bb4'
  },
  {
    id: 'inspector',
    title: 'Módulo de Inspección',
    description: 'Herramienta de campo para inspectores. Realización de auditorías, relevamientos y actas digitales.',
    icon: <AssignmentTurnedInIcon sx={{ fontSize: 60, color: '#29b6f6' }} />,
    path: '/inspector',
    color: '#29b6f6'
  }
];

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(135deg, rgba(245, 247, 250, 0.9) 0%, rgba(195, 207, 226, 0.8) 100%), url(/health_tech_background_1776795417776.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0,85,150,0.1) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%',
          zIndex: 0
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(41,182,246,0.1) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%',
          zIndex: 0
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', mb: 2 }}>
            <HealthAndSafetyIcon sx={{ fontSize: 48, color: '#005596', mr: 2 }} />
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 900, 
                color: '#005596',
                letterSpacing: '-0.5px'
              }}
            >
              ClicSalud
            </Typography>
          </Box>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#546e7a', 
              fontWeight: 400,
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Plataforma Integral de Gestión y Fiscalización Sanitaria
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ mt: 3, color: '#90a4ae', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 700 }}
          >
            Seleccione su rol para ingresar
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {roles.map((role) => (
            <Grid item xs={12} sm={6} md={4} key={role.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                    '& .icon-bg': {
                      transform: 'scale(1.1) rotate(5deg)',
                      background: `${role.color}15`
                    }
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => navigate(role.path)}
                  sx={{ height: '100%', p: 4 }}
                >
                  <Box 
                    className="icon-bg"
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      borderRadius: '24px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      mb: 3,
                      background: '#f8f9fa',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {role.icon}
                  </Box>
                  <CardContent sx={{ p: 0 }}>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      component="h2" 
                      sx={{ fontWeight: 700, color: '#263238', mb: 2 }}
                    >
                      {role.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary" 
                      sx={{ lineHeight: 1.6 }}
                    >
                      {role.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 10, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#90a4ae' }}>
            © 2026 ClicSalud - Ministerio de Salud. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default RoleSelection;
