import React, { useState, useMemo } from 'react';
import { 
  Box, Typography, Paper, Stepper, Step, StepLabel, 
  StepConnector, stepConnectorClasses, styled, Button, Stack, Tooltip, Fab 
} from '@mui/material';
import { 
  Map as MapIcon, Business as BusinessIcon, Person as PersonIcon, 
  MedicalServices as MedicalServicesIcon, Groups as GroupsIcon, 
  AccountTree as AccountTreeIcon, HomeRepairService as HomeRepairServiceIcon, 
  CloudUpload as CloudUploadIcon, Save as SaveIcon, Send as SendIcon,
  ArrowBackIos as ArrowBackIosIcon, Cancel as CancelIcon, Add as AddIcon 
} from '@mui/icons-material';

// Navegación
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

// Componentes (Asegúrate de que las rutas a los archivos sean las correctas)
import Layout from './Layout';
import ServicesStep from './steps/ServicesStep';
import Equipamientos from './steps/Equipamientos'; 
import RRHHStep from './steps/RRHHStep'; 
import JefeServicioStep from './steps/JefeServicioStep'; 
import ModalHabilitacion from './ModalHabilitacion';

// --- ESTILOS PERSONALIZADOS ---
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 22 },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#29b6f6',
    borderTopWidth: 2,
    borderRadius: 1,
  },
}));

const StepIconRoot = styled('div')(({ ownerState }) => ({
  backgroundColor: ownerState.active ? '#005596' : '#29b6f6',
  zIndex: 1,
  color: '#fff',
  width: 45,
  height: 45,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: ownerState.active ? '0 0 10px rgba(0,0,0,0.3)' : 'none',
  cursor: 'pointer',
  transition: '0.3s',
  '&:hover': { transform: 'scale(1.1)', backgroundColor: '#005596' }
}));

function StepIconCustom(props) {
  const { active, completed, icon, onClick } = props;
  const icons = {
    1: <MapIcon />, 2: <BusinessIcon />, 3: <PersonIcon />, 
    4: <MedicalServicesIcon />, 5: <GroupsIcon />, 6: <AccountTreeIcon />, 
    7: <HomeRepairServiceIcon />, 8: <CloudUploadIcon />,
  };
  return (
    <StepIconRoot ownerState={{ active, completed }} onClick={onClick}>
      {icons[String(icon)]}
    </StepIconRoot>
  );
}

const HomeEfector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const baseRoute = "/home-efector";
  
  // ESTADOS GLOBALES
  const [selectedServices, setSelectedServices] = useState({});
  const [infraSelection, setInfraSelection] = useState({});
  const [isServiceValid, setIsServiceValid] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const steps = [
    { label: 'Arquitectura', path: 'arquitectura' },
    { label: 'Establecimiento', path: 'establecimiento' },
    { label: 'Director Técnico', path: 'director' },
    { label: 'Servicios', path: 'servicios' },
    { label: 'Recursos Humanos', path: 'rrhh' },
    { label: 'Jefe de Servicio', path: 'jefes' },
    { label: 'Equipamientos', path: 'equipamientos' },
    { label: 'Documentos', path: 'documentos' },
  ];

  // Sincronizar activeStep con la URL para que el Stepper se pinte bien
  const activeStep = useMemo(() => {
    const currentPath = location.pathname.split('/').filter(Boolean).pop();
    const idx = steps.findIndex(s => s.path === currentPath);
    return idx >= 0 ? idx : 3; // Por defecto a Servicios (Step 3)
  }, [location.pathname]);

  // Navegación Absoluta para evitar duplicación de URLs
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      navigate(`${baseRoute}/${steps[activeStep + 1].path}`);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      navigate(`${baseRoute}/${steps[activeStep - 1].path}`);
    }
  };

  const handleStepClick = (index) => {
    navigate(`${baseRoute}/${steps[index].path}`);
  };

  return (
    <Layout>
      <Paper elevation={2} sx={{ borderRadius: '8px', overflow: 'hidden', mb: 2, mx: 'auto', maxWidth: '1600px', position: 'relative' }}>
        
        {/* ENCABEZADO INSTITUCIONAL */}
        <Box sx={{ backgroundColor: '#005596', color: 'white', py: 2, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Trámite Nº 170 Habilitación</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Azul Talavera - CIDS</Typography>
        </Box>

        <Box sx={{ p: 4, backgroundColor: 'white' }}>
          {/* STEPPER CON ICONOS PERSONALIZADOS */}
          <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel 
                  StepIconComponent={(props) => (
                    <StepIconCustom 
                      {...props} 
                      onClick={() => handleStepClick(index)} 
                    />
                  )}
                >
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#333', display: 'block', mt: 1 }}>
                    {step.label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* CONTENEDOR DE CONTENIDO DINÁMICO (RUTAS) */}
          <Box sx={{ mt: 6, p: 3, minHeight: '450px' }}>
            <Routes>
              {/* Redirección interna si no hay path */}
              <Route path="/" element={<Navigate to="servicios" replace />} />
              
              <Route path="servicios" element={
                <ServicesStep 
                  selectedServices={selectedServices} 
                  setSelectedServices={setSelectedServices}
                  infraSelection={infraSelection}
                  setInfraSelection={setInfraSelection}
                  onValidationChange={(isValid) => setIsServiceValid(isValid)}
                />
              } />

              <Route path="rrhh" element={
                <RRHHStep selectedServices={selectedServices} />
              } />

              <Route path="jefes" element={
                <JefeServicioStep selectedServices={selectedServices} />
              } />

              <Route path="equipamientos" element={
                <Equipamientos 
                  selectedServices={selectedServices} 
                  infraSelection={infraSelection} 
                />
              } />

              <Route path="*" element={
                <Box sx={{ textAlign: 'center', py: 10 }}>
                  <Typography variant="h6" color="text.secondary">
                    El módulo de <strong>{steps[activeStep]?.label}</strong> está siendo procesado.
                  </Typography>
                </Box>
              } />
            </Routes>
          </Box>

          {/* BOTONERA DE ACCIÓN */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<CancelIcon />} 
              sx={{ fontWeight: 'bold' }}
              onClick={() => navigate('/')}
            >
              CANCELAR
            </Button>
            
            <Stack direction="row" spacing={2}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBackIosIcon />} 
                onClick={handleBack} 
                disabled={activeStep === 0}
                sx={{ color: '#29b6f6', borderColor: '#29b6f6', fontWeight: 'bold' }}
              >
                ANTERIOR
              </Button>
              
              <Button 
                variant="outlined" 
                startIcon={<SaveIcon />} 
                sx={{ color: '#29b6f6', borderColor: '#29b6f6', fontWeight: 'bold' }}
              >
                GUARDAR
              </Button>
              
              <Tooltip title={(!isServiceValid && activeStep === 3) ? "Debe realizar la revisión exitosa para continuar" : ""}>
                <span>
                  <Button 
                    variant="contained" 
                    endIcon={<SendIcon />} 
                    onClick={handleNext} 
                    disabled={(activeStep === 3 && !isServiceValid) || activeStep === steps.length - 1} 
                    sx={{ 
                      backgroundColor: '#29b6f6', 
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: '#039be5' } 
                    }}
                  >
                    SIGUIENTE
                  </Button>
                </span>
              </Tooltip>
            </Stack>
          </Box>
        </Box>
      </Paper>

      {/* BOTÓN FLOTANTE (+) */}
      <Fab 
        onClick={() => setOpenModal(true)}
        sx={{ 
          position: 'fixed', 
          bottom: 30, 
          right: 30, 
          backgroundColor: '#005596', 
          color: 'white',
          '&:hover': { backgroundColor: '#003a66' } 
        }}
      >
        <AddIcon />
      </Fab>

      {/* MODAL DE TIPOLOGÍA */}
      <ModalHabilitacion 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
      />
    </Layout>
  );
};

export default HomeEfector;