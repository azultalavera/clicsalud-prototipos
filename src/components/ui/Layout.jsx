import React, { useState } from 'react';
import { 
  Box, AppBar, Toolbar, Typography, Avatar, IconButton, 
  Menu, MenuItem, ListItemIcon, Divider, Drawer, List, 
  ListItemButton, ListItemText 
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InboxIcon from '@mui/icons-material/Inbox';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import fondoOndas from '../../assets/fondo.webp';

const drawerWidthFull = 320;
const drawerWidthMini = 70;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Estado para el despliegue
  const openMenu = Boolean(anchorEl);

  const menuItems = [
    { text: 'Inicio', icon: <HomeIcon />, path: '/clicsalud-backoffice/dashboard' },
    { text: 'Asignacion de Roles', icon: <PeopleIcon />, path: '/clicsalud-backoffice/asignar-rol' },
    { text: 'Configuración de Recursos', icon: <SettingsIcon />, path: '/clicsalud-backoffice/gestion-recursos' },
  ];

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = (route) => {
    setAnchorEl(null);
    if (route) navigate(route);
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* HEADER SUPERIOR (Z-Index alto para estar sobre la barra) */}
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: '#0090d0', 
          boxShadow: 'none', 
          zIndex: (theme) => theme.zIndex.drawer + 1 
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" sx={{ mr: 2 }} onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              Ministerio de <span style={{ fontWeight: 900 }}>SALUD</span> 
              <span style={{ fontSize: '1.2rem', fontWeight: 300, ml: 2 }}>| ClicSALUD</span>
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>Administrador</Typography>
            <IconButton onClick={handleMenuClick} sx={{ p: 0 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'white', color: '#0090d0', border: '2px solid white' }}>C</Avatar>
            </IconButton>
            
            <Menu anchorEl={anchorEl} open={openMenu} onClose={() => handleMenuClose()} PaperProps={{ sx: { width: 200, mt: 1 } }}>
              <MenuItem onClick={() => handleMenuClose('/')}>
                <ListItemIcon><AdminPanelSettingsIcon fontSize="small" /></ListItemIcon>
                Administrador
              </MenuItem>
              <MenuItem onClick={() => handleMenuClose('/home-efector')}>
                <ListItemIcon><LocalHospitalIcon fontSize="small" /></ListItemIcon>
                Efector
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleMenuClose('/login')}>Cerrar Sesión</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* BARRA LATERAL (Drawer) */}
      <Drawer
        variant="permanent"
        sx={{
          width: isDrawerOpen ? drawerWidthFull : drawerWidthMini,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          [`& .MuiDrawer-paper`]: {
            width: isDrawerOpen ? drawerWidthFull : drawerWidthMini,
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            pt: 8, // Espacio para el AppBar
            borderRight: '1px solid #e0e0e0',
            backgroundColor: '#ffffff'
          },
        }}
      >
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton 
                key={item.text} 
                onClick={() => navigate(item.path)}
                sx={{ 
                  minHeight: 48, 
                  justifyContent: isDrawerOpen ? 'initial' : 'center', 
                  px: 2.5,
                  bgcolor: isActive ? '#f0f7ff' : 'transparent',
                  borderLeft: isActive ? '4px solid #0090d0' : '4px solid transparent'
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 0, 
                    mr: isDrawerOpen ? 3 : 'auto', 
                    justifyContent: 'center',
                    color: isActive ? '#0090d0' : '#757575' 
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: isDrawerOpen ? 1 : 0,
                    color: isActive ? '#0090d0' : '#333',
                    '& .MuiTypography-root': { fontWeight: isActive ? 'bold' : 'normal' }
                  }} 
                />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>

      {/* CONTENIDO PRINCIPAL */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 4, 
          mt: 8, 
          backgroundImage: `url(${fondoOndas})`, 
          backgroundAttachment: 'fixed', 
          backgroundSize: 'cover',
          minHeight: '100vh'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;