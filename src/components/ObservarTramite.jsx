import React from 'react';
import { 
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Checkbox, TextField, Paper, Chip, IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GroupsIcon from '@mui/icons-material/Groups';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';

const ObservarTramite = ({ 
  selectedServices = {}, 
  infraSelection = {}, 
  equiposCargados = [] 
}) => {
  
  const serviciosActivos = Object.keys(selectedServices).filter(key => selectedServices[key]);

  // --- LÓGICA DE AUTO-FILL PARA EQUIPOS (MODO TEST) ---
  const equiposSimulados = [
    { equipamiento: "BOMBA DE INFUSION" }, { equipamiento: "BOMBA DE INFUSION" },
    { equipamiento: "MONITOR MULTIPARAMETRICO" }, { equipamiento: "MONITOR MULTIPARAMETRICO" }, { equipamiento: "MONITOR MULTIPARAMETRICO" },
    { equipamiento: "CARDIO DESFIBRILADOR" },
    { equipamiento: "RESPIRADOR MICROPROCESADO" }, { equipamiento: "RESPIRADOR MICROPROCESADO" },
  ];

  const fuenteDeDatos = equiposCargados.length > 0 ? equiposCargados : equiposSimulados;

  const equiposAgrupados = fuenteDeDatos.reduce((acc, eq) => {
    const nombre = eq.equipamiento?.toUpperCase() || "SIN NOMBRE";
    if (!acc[nombre]) acc[nombre] = { nombre, cantidad: 0 };
    acc[nombre].cantidad += 1;
    return acc;
  }, {});

  const listaEquipos = Object.values(equiposAgrupados);

  // --- RRHH HARCODEADOS ---
  const rrhhHarcoded = [
    { servicio: "HEMODINAMIA", personal: "Médico radiólogo", cant: 5 },
    { servicio: "HOSPITAL DE DIA", personal: "Médico oncólogico", cant: 8 },
    { servicio: "HOSPITAL DE DIA", personal: "Trabajador social", cant: 2 },
    { servicio: "HOSPITAL DE DIA", personal: "Enfermeros", cant: 4 },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1 }}>
      <Typography variant="h6" sx={{ color: '#005596', fontWeight: 'bold', mb: 1 }}>
        REVISIÓN AUDITORÍA DE TRÁMITE
      </Typography>

      {/* 1. ARQUITECTURA */}
      <Accordion variant="outlined" sx={{ borderRadius: '12px', mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#005596' }} />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ArchitectureIcon color="primary" fontSize="small" />
            <Typography sx={{ fontWeight: 'bold' }}>ARQUITECTURA</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <TableContainer><Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}><TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ÍTEM</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>OBSERVADO</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>COMENTARIO</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {['Plano de Evacuación', 'Plano Eléctrico'].map(i => (
                <TableRow key={i}><TableCell>{i}</TableCell>
                <TableCell align="center"><Checkbox size="small" color="error" /></TableCell>
                <TableCell><TextField variant="standard" fullWidth /></TableCell></TableRow>
              ))}
            </TableBody>
          </Table></TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* 2. SERVICIOS E INFRAESTRUCTURA */}
      <Accordion variant="outlined" sx={{ borderRadius: '12px', mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#005596' }} />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MedicalServicesIcon color="primary" fontSize="small" />
            <Typography sx={{ fontWeight: 'bold' }}>SERVICIOS E INFRAESTRUCTURA</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <TableContainer><Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}><TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>SERVICIO / CAPACIDAD</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>VALOR</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>OBSERVADO</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {serviciosActivos.map(srv => (
                <TableRow key={srv}>
                  <TableCell sx={{ fontWeight: 'bold', color: '#005596' }}>{srv.toUpperCase()}</TableCell>
                  <TableCell align="center"><Chip label="SÍ" size="small" color="success" variant="outlined" /></TableCell>
                  <TableCell align="center"><Checkbox size="small" color="error" /></TableCell>
                </TableRow>
              ))}
              {Object.entries(infraSelection).map(([key, val]) => (
                <TableRow key={key}><TableCell sx={{ pl: 4 }}>{key}</TableCell>
                <TableCell align="center">{val}</TableCell>
                <TableCell align="center"><Checkbox size="small" color="error" /></TableCell></TableRow>
              ))}
            </TableBody>
          </Table></TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* 3. RECURSOS HUMANOS (HARCODEADO) */}
      <Accordion variant="outlined" sx={{ borderRadius: '12px', mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#005596' }} />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupsIcon color="primary" />
            <Typography sx={{ fontWeight: 'bold' }}>RECURSOS HUMANOS</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <TableContainer><Table size="small">
            <TableHead sx={{ bgcolor: '#f4f7f9' }}><TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>SERVICIO</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>PERSONAL</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>DECLARADA</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>OBS.</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>CANT. OBS.</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {rrhhHarcoded.map((row, idx) => (
                <TableRow key={idx} hover>
                  <TableCell sx={{ fontWeight: 'bold', color: '#005596', fontSize: '0.75rem' }}>{row.servicio}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.personal}</TableCell>
                  <TableCell align="center">{row.cant}</TableCell>
                  <TableCell align="center"><Checkbox size="small" color="error" /></TableCell>
                  <TableCell align="center"><TextField size="small" sx={{ width: '45px' }} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* 4. JEFE DE SERVICIOS (DINÁMICO) */}
      <Accordion variant="outlined" sx={{ borderRadius: '12px', mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#005596' }} />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" fontSize="small" />
            <Typography sx={{ fontWeight: 'bold' }}>JEFE DE SERVICIOS</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <TableContainer><Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}><TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>SERVICIO</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>PROFESIONAL</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>OBSERVADO</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {serviciosActivos.map(srv => (
                <TableRow key={srv}>
                  <TableCell sx={{ fontWeight: 'bold', color: '#005596' }}>{srv.toUpperCase()}</TableCell>
                  <TableCell>Apellido, Nombre - CUIL - Matrícula</TableCell>
                  <TableCell align="center"><Checkbox size="small" color="error" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* 5. EQUIPAMIENTOS (AGRUPADOS + MODO TEST) */}
      <Accordion defaultExpanded variant="outlined" sx={{ borderRadius: '12px', mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#005596' }} />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PrecisionManufacturingIcon color="primary" />
            <Typography sx={{ fontWeight: 'bold' }}>EQUIPAMIENTOS DECLARADOS</Typography>
            {equiposCargados.length === 0 }
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <TableContainer><Table size="small">
            <TableHead sx={{ bgcolor: '#f4f7f9' }}><TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>EQUIPO</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>CANT. DECLARADA</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>OBSERVADO</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>CANT. OBSERVADA</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {listaEquipos.map((eq, i) => (
                <TableRow key={i} hover>
                  <TableCell sx={{ fontWeight: 'bold', color: '#005596' }}>{eq.nombre}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>{eq.cantidad}</TableCell>
                  <TableCell align="center"><Checkbox size="small" color="error" /></TableCell>
                  <TableCell align="center"><TextField size="small" type="number" sx={{ width: '60px' }} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* 6. DOCUMENTOS */}
      <Accordion variant="outlined" sx={{ borderRadius: '12px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#005596' }} />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FolderIcon color="primary" fontSize="small" />
            <Typography sx={{ fontWeight: 'bold' }}>DOCUMENTOS ADJUNTOS</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1, textAlign: 'center' }}>
          <Chip label="VER PDF HABILITACIÓN" color="primary" variant="outlined" clickable />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ObservarTramite;