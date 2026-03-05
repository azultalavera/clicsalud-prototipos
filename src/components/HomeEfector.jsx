import React, { useState, useMemo } from 'react';
import { 
  Box, Typography, Paper, Stepper, Step, StepLabel, 
  StepConnector, stepConnectorClasses, styled, Button, Stack, Tooltip, Fab,
  Tabs, Tab, Divider
} from '@mui/material';
import { 
  Map as MapIcon, Business as BusinessIcon, Person as PersonIcon, 
  MedicalServices as MedicalServicesIcon, Groups as GroupsIcon, 
  AccountTree as AccountTreeIcon, HomeRepairService as HomeRepairServiceIcon, 
  CloudUpload as CloudUploadIcon, Save as SaveIcon, Send as SendIcon,
  ArrowBackIos as ArrowBackIosIcon, Cancel as CancelIcon, Add as AddIcon
} from '@mui/icons-material';

// Navegación
import { Routes, Route, useNavigate, useLocation, Navigate, Link } from 'react-router-dom';

// Componentes
import Layout from './Layout';
import ServicesStep from './steps/ServicesStep';
import Equipamientos from './steps/Equipamientos'; 
import RRHHStep from './steps/RRHHStep'; 
import JefeServicioStep from './steps/JefeServicioStep'; 
import ModalHabilitacion from './ModalHabilitacion';
import ObservarTramite from './ObservarTramite'; 

import ActaInspeccion from './ActaInspeccion';

// --- ESTILOS STEPPER ---
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 22 },
  [`& .${stepConnectorClasses.line}`]: { borderColor: '#29b6f6', borderTopWidth: 2, borderRadius: 1 },
}));

const StepIconRoot = styled('div')(({ ownerState }) => ({
  backgroundColor: ownerState.active ? '#005596' : '#29b6f6',
  zIndex: 1, color: '#fff', width: 45, height: 45, display: 'flex', borderRadius: '50%',
  justifyContent: 'center', alignItems: 'center', transition: '0.3s',
  '&:hover': { transform: 'scale(1.1)', backgroundColor: '#005596' }
}));

function StepIconCustom(props) {
  const { active, completed, icon, onClick } = props;
  const icons = { 1: <MapIcon />, 2: <BusinessIcon />, 3: <PersonIcon />, 4: <MedicalServicesIcon />, 5: <GroupsIcon />, 6: <AccountTreeIcon />, 7: <HomeRepairServiceIcon />, 8: <CloudUploadIcon /> };
  return <StepIconRoot ownerState={{ active, completed }} onClick={onClick}>{icons[String(icon)]}</StepIconRoot>;
}

const HomeEfector = () => {
  // --- HOOKS (DENTRO DE LA FUNCIÓN) ---
  const navigate = useNavigate();
  const location = useLocation();
  const baseRoute = "/home-efector";
  
  // ESTADOS GLOBALES (Elevación de estado para compartir entre pestañas)
  const [selectedServices, setSelectedServices] = useState({});
  const [infraSelection, setInfraSelection] = useState({});
  const [equiposCargados, setEquiposCargados] = useState([]); // Estado para los equipos
  
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

  const currentPath = location.pathname;

  const activeStep = useMemo(() => {
    const lastPart = location.pathname.split('/').filter(Boolean).pop();
    const idx = steps.findIndex(s => s.path === lastPart);
    return idx >= 0 ? idx : 3; 
  }, [location.pathname]);

  const handleNext = () => activeStep < steps.length - 1 && navigate(`${baseRoute}/${steps[activeStep + 1].path}`);
  const handleBack = () => activeStep > 0 && navigate(`${baseRoute}/${steps[activeStep - 1].path}`);



  // Función para Testing Automatizado (Simulación de carga completa)
const handleQAFill = () => {
  // 1. Cargamos Servicios de prueba
  setSelectedServices({
    "Neonatología": true,
    "Unidad Coronaria": true,
    "Quirófano": true
  });

  // 2. Cargamos Infraestructura
  setInfraSelection({
    "Salas de Parto": 2,
    "Camas UTI": 5,
    "Consultorios": 3
  });

  // 3. Cargamos Equipamientos
  setEquiposCargados([
    { origen: "Neonatología", equipamiento: "Incubadora", marca: "Fanem", modelo: "Vision 2186", serie: "SN998822" },
    { origen: "Quirófano", equipamiento: "Bisturí Eléctrico", marca: "Medtronic", modelo: "Force FX", serie: "SN112233" },
    { origen: "Unidad Coronaria", equipamiento: "Monitor Multiparamétrico", marca: "Mindray", modelo: "BeneVision N17", serie: "SN445566" }
  ]);

  setIsServiceValid(true); // Habilitamos el "Siguiente"
  alert("🚀 Datos de Testing cargados correctamente");
};
  return (
    <Layout>
      {/* SUB-NAVBAR: PESTAÑAS FIJAS DEBAJO DEL NAV PRINCIPAL */}
      <Box sx={{ 
        position: 'sticky', top: 64, zIndex: 10, bgcolor: '#fff', 
        borderBottom: '1px solid #e0e0e0', mx: -4, mt: -4, mb: 4, px: 4 
      }}>
        <Tabs 
          value={currentPath.includes('observartramite') ? '/home-efector/observartramite' : 
                 currentPath.includes('actainspeccion') ? '/home-efector/actainspeccion' : 
                 '/home-efector/vertramite'} 
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="VER TRÁMITE" value="/home-efector/vertramite" component={Link} to="/home-efector/vertramite" sx={{ fontWeight: 'bold' }} />
          <Tab label="OBSERVAR TRÁMITE" value="/home-efector/observartramite" component={Link} to="/home-efector/observartramite" sx={{ fontWeight: 'bold' }} />
          <Tab label="ACTA DE INSPECCIÓN" value="/home-efector/actainspeccion" component={Link} to="/home-efector/actainspeccion" sx={{ fontWeight: 'bold' }} />
        </Tabs>
      </Box>

      {/* CUERPO DEL TRÁMITE */}
      <Paper elevation={2} sx={{ borderRadius: '8px', overflow: 'hidden', mb: 2, mx: 'auto', maxWidth: '1600px' }}>
        <Box sx={{ backgroundColor: '#005596', color: 'white', py: 2, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Expediente N° 170-2026 | Habilitación</Typography>
          <Typography variant="body2">Azul Talavera - CIDS</Typography>
        </Box>

        <Box sx={{ p: 4, backgroundColor: 'white' }}>
          
          {/* STEPPER CONDICIONAL */}
          {!['observartramite', 'actainspeccion'].some(p => currentPath.includes(p)) && (
            <Box sx={{ mb: 6 }}>
              <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel StepIconComponent={(props) => (<StepIconCustom {...props} onClick={() => navigate(`${baseRoute}/${steps[index].path}`)} />)}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#333', display: 'block', mt: 1 }}>{step.label}</Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}

          {/* CONTENIDO DINÁMICO */}
          <Box sx={{ minHeight: '450px' }}>
            <Routes>
              <Route path="/" element={<Navigate to="vertramite" replace />} />
              <Route path="vertramite" element={<Navigate to="servicios" replace />} />
              
              {/* Pasamos los estados a los componentes de carga */}
              <Route path="servicios" element={
                <ServicesStep 
                  selectedServices={selectedServices} 
                  setSelectedServices={setSelectedServices} 
                  infraSelection={infraSelection} 
                  setInfraSelection={setInfraSelection} 
                  onValidationChange={setIsServiceValid} 
                />
              } />
              
              <Route path="rrhh" element={<RRHHStep selectedServices={selectedServices} />} />
              <Route path="jefes" element={<JefeServicioStep selectedServices={selectedServices} />} />
              
              {/* PASO EQUIPAMIENTOS: Sincronizado con equiposCargados */}
              <Route path="equipamientos" element={
                <Equipamientos 
                  selectedServices={selectedServices} 
                  infraSelection={infraSelection} 
                  equiposCargados={equiposCargados}
                  setEquiposCargados={setEquiposCargados}
                />
              } />
              
              {/* PESTAÑA OBSERVAR: Recibe todos los datos para auditoría */}
              <Route path="observartramite" element={
                <ObservarTramite 
                  selectedServices={selectedServices} 
                  infraSelection={infraSelection}
                  equiposCargados={equiposCargados}
                />
              } />

              <Route path="actainspeccion" element={<ActaInspeccion />} />
            </Routes>
          </Box>

          {/* BOTONERA CONDICIONAL */}
          {!['observartramite', 'actainspeccion'].some(p => currentPath.includes(p)) && (
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => navigate('/')}>CANCELAR</Button>
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" startIcon={<ArrowBackIosIcon />} onClick={handleBack} disabled={activeStep === 0}>ANTERIOR</Button>
                <Button variant="outlined" startIcon={<SaveIcon />}>GUARDAR</Button>
                <Button variant="contained" endIcon={<SendIcon />} onClick={handleNext} disabled={(activeStep === 3 && !isServiceValid) || activeStep === steps.length - 1} sx={{ backgroundColor: '#29b6f6' }}>SIGUIENTE</Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Paper>

      <Fab onClick={() => setOpenModal(true)} sx={{ position: 'fixed', bottom: 30, right: 30, backgroundColor: '#005596', color: 'white' }}><AddIcon /></Fab>
      <ModalHabilitacion open={openModal} onClose={() => setOpenModal(false)} />
    </Layout>
  );
};

export default HomeEfector;