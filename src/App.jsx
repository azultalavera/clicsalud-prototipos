import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Importaciones de tus componentes
import DashboardAdmin from './components/DashboardAdmin';
import GestionRecursos from './components/GestionRecursos';
import AsignacionRoles from './components/AsignacionRoles';
import Infraestructura from './components/Infraestructura';
import Equipamientos from './components/steps/Equipamientos'; // Este es el de Gestión (Admin)
import HomeEfector from './components/HomeEfector';
import EquipamientosConfig from './components/EquipamientosConfig';
import RecursosHumanosConfig from './components/RecursosHumanosConfig';
import JefeServicioConfig from './components/JefeServicioConfig';



const theme = createTheme({
  palette: {
    primary: { main: '#005596' },
    secondary: { main: '#29b6f6' },
    background: { default: '#f5f5f5' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <Router>
        <Routes>
          <Route path="/" element={<DashboardAdmin />} />
          <Route path="/clicsalud-backoffice/asignar-rol" element={<AsignacionRoles />} />
          <Route path="/clicsalud-backoffice/gestion-recursos" element={<GestionRecursos />} />
          <Route path="/clicsalud-backoffice/gestion-recursos/infraestructura" element={<Infraestructura />} />
          <Route path="/clicsalud-backoffice/gestion-recursos/equipamientos" element={<EquipamientosConfig />} />
          <Route path="/clicsalud-backoffice/gestion-recursos/recursos-humanos" element={<RecursosHumanosConfig />} />
          <Route path="/clicsalud-backoffice/gestion-recursos/jefe-servicio" element={<JefeServicioConfig />} />

          <Route path="/home-efector/*" element={<HomeEfector />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;