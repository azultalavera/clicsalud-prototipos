import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Importaciones de tus componentes
import DashboardAdmin from './components/backoffice/DashboardAdmin';
import GestionRecursos from './components/backoffice/GestionRecursos';
import AsignacionRoles from './components/backoffice/AsignacionRoles';
import Infraestructura from './components/backoffice/Infraestructura';
import HomeEfector from './components/efector/HomeEfector';
import EquipamientosConfig from './components/backoffice/EquipamientosConfig';
import RecursosHumanosConfig from './components/backoffice/RecursosHumanosConfig';
import JefeServicioConfig from './components/backoffice/JefeServicioConfig';
import ConfiguradorInspeccionRouter from './components/inspeccion/admin/configurador/ConfiguradorRouter';
import PantallaInspeccion from './components/inspeccion/inspector/PantallaInspeccion';
import Layout from './components/ui/Layout';
import RoleSelection from './components/ui/RoleSelection';

const theme = createTheme({
  palette: {
    primary: { main: '#005596' },
    secondary: { main: '#29b6f6' },
    background: { default: '#ffffff' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  // --- LÓGICA DE LIMPIEZA POR SESIÓN DE TERMINAL ---
  useEffect(() => {
    const syncTerminalSession = async () => {
      try {
        const response = await fetch('/session_id.txt');
        if (!response.ok) return;
        const currentSessionId = await response.text();
        const storedSessionId = localStorage.getItem('terminal_session_id');

        if (storedSessionId && storedSessionId !== currentSessionId) {
          console.log('[Session] Terminal session changed. Clearing localStorage...');
          localStorage.clear();
          // Opcional: Recargar la página para asegurar que todo el estado de React se limpie
          window.location.reload();
        }
        
        localStorage.setItem('terminal_session_id', currentSessionId);
      } catch (err) {
        console.error('[Session] Error syncing terminal session:', err);
      }
    };

    syncTerminalSession();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <Router>
        <Routes>
          {/* LANDING SELECCIÓN DE ROL */}
          <Route path="/" element={<RoleSelection />} />

          {/* RUTAS ADMINISTRADOR */}
          <Route path="/admin" element={<DashboardAdmin />} />
          <Route path="/clicsalud-backoffice/asignar-rol" element={<AsignacionRoles />} />
          <Route path="/clicsalud-backoffice/gestion-recursos" element={<GestionRecursos />} />
          <Route path="/clicsalud-backoffice/gestion-recursos/infraestructura" element={<Infraestructura />} />
          <Route path="/clicsalud-backoffice/gestion-recursos/equipamientos" element={<EquipamientosConfig />} />
          <Route path="/clicsalud-backoffice/gestion-recursos/recursos-humanos" element={<RecursosHumanosConfig />} />
          <Route path="/clicsalud-backoffice/gestion-recursos/jefe-servicio" element={<JefeServicioConfig />} />
          <Route path="/clicsalud-backoffice/gestion-recursos/acta-inpeccion/*" element={<ConfiguradorInspeccionRouter />} />

          {/* RUTA EFECTOR: Usamos /* para que HomeEfector maneje sus sub-rutas internamente */}
          <Route path="/home-efector/*" element={<HomeEfector />} />

          {/* RUTA INSPECTOR: Pantalla de Tablet */}
          <Route path="/inspector/*" element={<Layout><PantallaInspeccion /></Layout>} />
          
          {/* FALLBACK: Solo si no entra en ninguna de las de arriba */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;