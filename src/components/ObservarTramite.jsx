import React, { useState } from 'react';
import { 
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Checkbox, TextField, Paper, Chip, IconButton, Stack, Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  ChatBubbleOutline as ChatIcon,
  ReportProblem as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Architecture as ArchIcon,
  MedicalServices as MedIcon,
  Groups as RRHHIcon,
  Person as BossIcon,
  PrecisionManufacturing as EquipIcon,
  Folder as FolderIcon
} from '@mui/icons-material';

const ObservarTramite = ({ selectedServices = {}, infraSelection = {}, equiposCargados = [] }) => {
  const [obsData, setObsData] = useState({});

  const handleToggle = (key) => {
    setObsData(prev => ({
      ...prev,
      [key]: { ...prev[key], checked: !prev[key]?.checked, valorObs: '', estado: 'neutral' }
    }));
  };

  const handleValChange = (key, val, decl) => {
    const num = parseInt(val);
    let st = "neutral";
    if (val === "" || isNaN(num)) st = "neutral";
    else if (num < decl) st = "rectificacion";
    else if (num > decl) st = "irregularidad";
    else st = "igual";

    setObsData(prev => ({ ...prev, [key]: { ...prev[key], valorObs: val, estado: st } }));
  };

  const renderStatus = (estado) => {
    if (estado === "rectificacion") return <WarningIcon sx={{ color: "#fbc02d" }} fontSize="small" />;
    if (estado === "irregularidad") return <ErrorIcon sx={{ color: "#d32f2f" }} fontSize="small" />;
    if (estado === "igual") return <InfoIcon sx={{ color: "#9e9e9e" }} fontSize="small" />;
    return null;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1 }}>
      
      {/* 1. ARQUITECTURA */}
      <Accordion variant="outlined" sx={{ borderRadius: '12px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Stack direction="row" spacing={1}><ArchIcon color="primary" /><Typography sx={{ fontWeight: 'bold' }}>ARQUITECTURA</Typography></Stack></AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <TableContainer><Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}><TableRow>
              <TableCell>Documento</TableCell><TableCell align="center">Visualizar documento</TableCell>
              <TableCell align="center">Observado</TableCell><TableCell align="center">Observación</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {['Plano de Evacuación', 'Plano Eléctrico'].map(doc => (
                <TableRow key={doc}>
                  <TableCell>{doc}</TableCell>
                  <TableCell align="center"><IconButton size="small"><VisibilityIcon /></IconButton></TableCell>
                  <TableCell align="center"><Checkbox size="small" onChange={() => handleToggle(doc)} /></TableCell>
                  <TableCell align="center">{obsData[doc]?.checked && <IconButton size="small" color="primary"><ChatIcon /></IconButton>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* 2. SERVICIOS */}
      <Accordion defaultExpanded variant="outlined" sx={{ borderRadius: '12px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Stack direction="row" spacing={1}><MedIcon color="primary" /><Typography sx={{ fontWeight: 'bold' }}>SERVICIOS</Typography></Stack></AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <TableContainer><Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}><TableRow>
              <TableCell>Servicio</TableCell><TableCell align="center">Valor declarado</TableCell>
              <TableCell align="center">Observado</TableCell><TableCell align="center">Valor observado</TableCell><TableCell align="center">Observación</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {Object.entries(infraSelection).map(([key, decl]) => (
                <TableRow key={key} sx={{ bgcolor: obsData[key]?.estado === 'igual' ? '#f1f8e9' : 'inherit' }}>
                  <TableCell>{key}</TableCell><TableCell align="center">{decl}</TableCell>
                  <TableCell align="center"><Checkbox size="small" onChange={() => handleToggle(key)} /></TableCell>
                  <TableCell align="center">
                    {obsData[key]?.checked && (
                      <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                        <TextField size="small" variant="standard" type="number" onChange={(e) => handleValChange(key, e.target.value, decl)} />
                        {obsData[key]?.estado === "rectificacion" && <ErrorIcon sx={{ color: "#d32f2f" }} fontSize="small" />}
                      </Stack>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {obsData[key]?.checked && obsData[key]?.estado !== "igual" && <IconButton size="small" color="primary"><ChatIcon /></IconButton>}
                    {obsData[key]?.checked && renderStatus(obsData[key]?.estado)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* 3. RECURSOS HUMANOS */}
      <Accordion variant="outlined" sx={{ borderRadius: '12px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Stack direction="row" spacing={1}><RRHHIcon color="primary" /><Typography sx={{ fontWeight: 'bold' }}>RECURSOS HUMANOS</Typography></Stack></AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <TableContainer><Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}><TableRow>
              <TableCell>Servicio</TableCell><TableCell>Tipo de plantel</TableCell><TableCell>Area de desempeño</TableCell><TableCell>Rol</TableCell>
              <TableCell align="center">Valor declarado</TableCell><TableCell align="center">Observado</TableCell>
              <TableCell align="center">Valor observado</TableCell><TableCell align="center">Observación</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {[{ s: 'UTI', tp: 'Médico', ad: 'Internación', rd: 'Guardia', v: 5 }].map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.s}</TableCell><TableCell>{r.tp}</TableCell><TableCell>{r.ad}</TableCell><TableCell>{r.rd}</TableCell>
                  <TableCell align="center">{r.v}</TableCell><TableCell align="center"><Checkbox size="small" onChange={() => handleToggle(`rrhh-${i}`)} /></TableCell>
                  <TableCell align="center">{obsData[`rrhh-${i}`]?.checked && <TextField size="small" variant="standard" type="number" />}</TableCell>
                  <TableCell align="center">{obsData[`rrhh-${i}`]?.checked && <IconButton size="small" color="primary"><ChatIcon /></IconButton>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* 4. JEFE DE SERVICIOS */}
      <Accordion variant="outlined" sx={{ borderRadius: '12px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Stack direction="row" spacing={1}><BossIcon color="primary" /><Typography sx={{ fontWeight: 'bold' }}>JEFE DE SERVICIOS</Typography></Stack></AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <TableContainer><Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}><TableRow>
              <TableCell>Servicio</TableCell><TableCell>Tipo de plantel</TableCell><TableCell align="center">Valor declarado</TableCell>
              <TableCell align="center">Observado</TableCell><TableCell align="center">Valor observado</TableCell><TableCell align="center">Observación</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {[{ s: 'UTI', tp: 'Médico Especialista', v: 1 }].map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.s}</TableCell><TableCell>{r.tp}</TableCell><TableCell align="center">{r.v}</TableCell>
                  <TableCell align="center"><Checkbox size="small" onChange={() => handleToggle(`jefe-${i}`)} /></TableCell>
                  <TableCell align="center">{obsData[`jefe-${i}`]?.checked && <TextField size="small" variant="standard" />}</TableCell>
                  <TableCell align="center">{obsData[`jefe-${i}`]?.checked && <IconButton size="small" color="primary"><ChatIcon /></IconButton>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* 5. EQUIPAMIENTOS (MODIFICADO) */}
<Accordion defaultExpanded variant="outlined" sx={{ borderRadius: '12px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction="row" spacing={1}>
            <EquipIcon color="primary" />
            <Typography sx={{ fontWeight: 'bold' }}>EQUIPAMIENTOS</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell>Servicio/Sala</TableCell>
                  <TableCell>Equipo</TableCell>
                  <TableCell align="center">Valor declarado</TableCell>
                  <TableCell align="center">Observado</TableCell>
                  <TableCell align="center">Valor observado</TableCell>
                  <TableCell align="center">Observación</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[{ s: 'UTI', e: 'Monitor', v: 8 }].map((r, i) => {
                  const itemKey = `equip-${i}`;
                  const itemObs = obsData[itemKey] || {};
                  return (
                    <TableRow key={i} sx={{ bgcolor: itemObs.estado === 'igual' ? '#f5f5f5' : 'inherit' }}>
                      <TableCell>{r.s}</TableCell>
                      <TableCell>{r.e}</TableCell>
                      <TableCell align="center">{r.v}</TableCell>
                      <TableCell align="center">
                        <Checkbox size="small" onChange={() => handleToggle(itemKey)} />
                      </TableCell>
                      <TableCell align="center">
                        {itemObs.checked && (
                          <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                            <TextField 
                              size="small" 
                              variant="standard" 
                              type="number" 
                              onChange={(e) => handleValChange(itemKey, e.target.value, r.v)}
                              helperText={itemObs.estado === "igual" ? "Los valores coinciden" : ""}
                              FormHelperTextProps={{ sx: { color: '#9e9e9e', fontSize: '0.65rem', fontWeight: 'bold' } }}
                            />
                            {itemObs.estado === "rectificacion" && (
                              <ErrorIcon sx={{ color: "#d32f2f" }} fontSize="small" />
                            )}
                          </Stack>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {itemObs.checked && itemObs.estado === "igual" && (
                          <Tooltip title="Sin discrepancias: No se requiere observación">
                            <InfoIcon sx={{ color: "#9e9e9e" }} fontSize="small" />
                          </Tooltip>
                        )}
                        {itemObs.checked && itemObs.estado !== "igual" && itemObs.estado !== "neutral" && (
                          <IconButton size="small" color="primary">
                            <ChatIcon fontSize="small" />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* 6. DOCUMENTOS ADJUNTOS */}
      <Accordion variant="outlined" sx={{ borderRadius: '12px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Stack direction="row" spacing={1}><FolderIcon color="primary" /><Typography sx={{ fontWeight: 'bold' }}>DOCUMENTOS ADJUNTOS</Typography></Stack></AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <TableContainer><Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}><TableRow>
              <TableCell>Documento</TableCell><TableCell align="center">Visualizar documento</TableCell>
              <TableCell align="center">Observado</TableCell><TableCell align="center">Observación</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {['Título DT', 'Seguro Mala Praxis'].map(doc => (
                <TableRow key={doc}>
                  <TableCell>{doc}</TableCell>
                  <TableCell align="center"><IconButton size="small"><VisibilityIcon /></IconButton></TableCell>
                  <TableCell align="center"><Checkbox size="small" onChange={() => handleToggle(doc)} /></TableCell>
                  <TableCell align="center">{obsData[doc]?.checked && <IconButton size="small" color="primary"><ChatIcon /></IconButton>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></TableContainer>
        </AccordionDetails>
      </Accordion>

    </Box>
  );
};

export default ObservarTramite;