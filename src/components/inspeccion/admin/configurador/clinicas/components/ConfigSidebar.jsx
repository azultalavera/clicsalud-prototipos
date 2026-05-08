import React from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  MedicalServices as MedicalServicesIcon,
  LocalHospital as LocalHospitalIcon,
  Bed as BedIcon,
  People as PeopleIcon,
  FaceRetouchingNatural as FaceRetouchingNaturalIcon,
  Apartment as ApartmentIcon,
  ListAlt as ListAltIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { normalize } from "./utils";
import { useNavigate } from "react-router-dom";

const ConfigSidebar = ({
  searchTerm,
  setSearchTerm,
  selectedCategoryId,
  setSelectedCategoryId,
  generalDataSrv,
  tramiteServices,
  otherServices,
  handleAddGeneralSection,
  handleAddTramiteService,
  handleAddService,
  setAddRequirementDialog,
  onSave,
  loading
}) => {
  const navigate = useNavigate();
  return (
    <Paper
      elevation={0}
      sx={{
        width: 320,
        flexShrink: 0,
        borderRadius: 4,
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0", bgcolor: "#f8fafc" }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddRequirementDialog({ open: true, selectedServices: [] })}
          sx={{ mb: 1, textTransform: "none", fontWeight: 800, borderRadius: 2, bgcolor: "#32A430", "&:hover": { bgcolor: "#278525" } }}
        >
          Añadir Nuevo Requisito
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<SettingsIcon />}
          onClick={() => navigate("tramite-config")}
          sx={{ mb: 2, textTransform: "none", fontWeight: 800, borderRadius: 2, color: "#0B85C4", borderColor: "#0B85C4" }}
        >
          Configurar Mapeo Trámite
        </Button>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar servicio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <AddIcon sx={{ mr: 1, color: "#64748b", transform: "rotate(45deg)", fontSize: 20 }} />,
            sx: { borderRadius: 3, bgcolor: "white" }
          }}
        />
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {/* ACCORDION: DATOS GENERALES */}
        <Accordion 
          defaultExpanded 
          elevation={0} 
          sx={{ 
            borderBottom: "1px solid #e2e8f0", 
            "&:before": { display: "none" },
            "&.Mui-expanded": { margin: 0 }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 900, color: "#1e293b", fontSize: "0.85rem", textTransform: "uppercase" }}>
              DATOS GENERALES
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List sx={{ py: 0 }}>
              {generalDataSrv?.sections?.map((sec) => (
                <ListItemButton
                  key={sec.id}
                  selected={selectedCategoryId === sec.id}
                  onClick={() => setSelectedCategoryId(sec.id)}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    mb: 0.5,
                    "&.Mui-selected": { backgroundColor: "rgba(11, 133, 196, 0.08)", color: "#0B85C4" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <ListAltIcon fontSize="small" color={selectedCategoryId === sec.id ? "primary" : "inherit"} />
                  </ListItemIcon>
                  <ListItemText
                    primary={sec.name}
                    primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: selectedCategoryId === sec.id ? 800 : 500 }}
                  />
                </ListItemButton>
              ))}
              <Box sx={{ p: 1, textAlign: 'center' }}>
                <Button 
                  size="small" 
                  variant="text" 
                  startIcon={<AddIcon />} 
                  onClick={handleAddGeneralSection}
                  sx={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'none' }}
                >
                  Añadir Paso
                </Button>
              </Box>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* ACCORDION: DATOS DEL TRÁMITE */}
        <Accordion 
          defaultExpanded 
          elevation={0} 
          sx={{ 
            borderBottom: "1px solid #e2e8f0", 
            "&:before": { display: "none" },
            "&.Mui-expanded": { margin: 0 }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 900, color: "#32A430", fontSize: "0.85rem", textTransform: "uppercase" }}>
              DATOS DEL TRÁMITE
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List sx={{ py: 0 }}>
              {[
                { id: "agg-arq", name: "ARQUITECTURA", icon: <ApartmentIcon fontSize="small" /> },
                { id: "agg-infra", name: "SALAS Y CAMAS", icon: <BedIcon fontSize="small" /> },
                { id: "agg-rrhh", name: "RECURSOS HUMANOS", icon: <PeopleIcon fontSize="small" /> },
                { id: "agg-js", name: "JEFE DE SERVICIO", icon: <FaceRetouchingNaturalIcon fontSize="small" /> },
                { id: "agg-equip", name: "EQUIPAMIENTO", icon: <MedicalServicesIcon fontSize="small" /> },
              ].map((cat) => (
                <ListItemButton
                  key={cat.id}
                  selected={selectedCategoryId === cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    mb: 0.5,
                    "&.Mui-selected": { backgroundColor: "rgba(50, 164, 48, 0.08)", color: "#32A430" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {React.cloneElement(cat.icon, { color: selectedCategoryId === cat.id ? "success" : "inherit" })}
                  </ListItemIcon>
                  <ListItemText
                    primary={cat.name}
                    primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: selectedCategoryId === cat.id ? 800 : 500 }}
                  />
                </ListItemButton>
              ))}
              <Divider sx={{ my: 1, mx: 2 }} />
              {tramiteServices.map((srv) => (
                <ListItemButton
                  key={srv.id}
                  selected={selectedCategoryId === srv.id}
                  onClick={() => setSelectedCategoryId(srv.id)}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    mb: 0.5,
                    "&.Mui-selected": { backgroundColor: "rgba(50, 164, 48, 0.08)", color: "#32A430" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <ApartmentIcon fontSize="small" color={selectedCategoryId === srv.id ? "success" : "inherit"} />
                  </ListItemIcon>
                  <ListItemText
                    primary={srv.name}
                    primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: selectedCategoryId === srv.id ? 800 : 500 }}
                  />
                </ListItemButton>
              ))}
              <Box sx={{ p: 1, textAlign: 'center' }}>
                <Button 
                  size="small" 
                  variant="text" 
                  startIcon={<AddIcon />} 
                  onClick={handleAddTramiteService}
                  sx={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'none', color: '#32A430' }}
                >
                  Añadir Área del Trámite
                </Button>
              </Box>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* ACCORDION: ORIGENES */}
        <Accordion 
          defaultExpanded 
          elevation={0} 
          sx={{ 
            borderBottom: "1px solid #e2e8f0", 
            "&:before": { display: "none" },
            "&.Mui-expanded": { margin: 0 }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 900, color: "#64748b", fontSize: "0.85rem", textTransform: "uppercase" }}>
              ORIGENES
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List sx={{ py: 0 }}>
              {otherServices
                .filter(s => normalize(s.name).includes(normalize(searchTerm)))
                .map((srv) => (
                <ListItemButton
                  key={srv.id}
                  selected={selectedCategoryId === srv.id}
                  onClick={() => setSelectedCategoryId(srv.id)}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    mb: 0.5,
                    "&.Mui-selected": { backgroundColor: "rgba(100, 116, 139, 0.08)", color: "#64748b" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <MedicalServicesIcon fontSize="small" color={selectedCategoryId === srv.id ? "primary" : "inherit"} />
                  </ListItemIcon>
                  <ListItemText
                    primary={srv.name}
                    primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: selectedCategoryId === srv.id ? 800 : 500 }}
                  />
                </ListItemButton>
              ))}
              <Box sx={{ p: 1, textAlign: 'center' }}>
                <Button 
                  size="small" 
                  variant="text" 
                  startIcon={<AddIcon />} 
                  onClick={handleAddService}
                  sx={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'none', color: '#64748b' }}
                >
                  Añadir Origen
                </Button>
              </Box>
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid #e2e8f0", bgcolor: "#f8fafc" }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />} // Originally SaveIcon, but I'll check consistency later
          onClick={onSave}
          disabled={loading}
          sx={{ textTransform: "none", fontWeight: 800, borderRadius: 2, bgcolor: "#0B85C4" }}
        >
          Guardar Configuración
        </Button>
      </Box>
    </Paper>
  );
};

export default ConfigSidebar;
