import React, { useState } from 'react';
import {
  Box, Typography, Paper, Grid, Switch, Accordion, AccordionSummary, Stack,
  AccordionDetails, TextField, Tab, Tabs, Chip, Divider, ToggleButton, ToggleButtonGroup, 
  FormControlLabel, Radio, RadioGroup, FormControl, InputAdornment
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import ElevatorIcon from '@mui/icons-material/Elevator';
import DomainIcon from '@mui/icons-material/Domain';
import FireExtinguisherIcon from '@mui/icons-material/FireExtinguisher';
import BusinessIcon from '@mui/icons-material/Business';
import RoomIcon from '@mui/icons-material/Room';

const ActaInspeccion = () => {
  const [data, setData] = useState({
    tipoInspeccion: 'RUTINA',
    modalidad: 'PRESENCIAL',
    tipoHC: 'DIGITAL',
    hc_estado: 'completas',
    ascensores: 'AMBOS',
    vencExtinguidores: '2029-01-01',
  });
  
  const [tabValue, setTabValue] = useState(0);

  const handleSwitch = (name) => (event) => {
    setData({ ...data, [name]: event.target.checked });
  };

  const handleToggle = (name) => (event, next) => {
    if (next !== null) setData({ ...data, [name]: next });
  };

  const renderFilaCheck = (label, key) => (
    <Box sx={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      py: 1.5, px: 2, borderBottom: '1px solid #f0f0f0',
      bgcolor: data[key] ? '#f1f8e9' : 'transparent', transition: '0.2s'
    }}>
      <Typography variant="body2" sx={{ fontWeight: 500, color: '#444' }}>{label}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: '900', color: data[key] ? '#2e7d32' : '#999', minWidth: '25px' }}>
          {data[key] ? 'SÍ' : 'NO'}
        </Typography>
        <Switch size="small" checked={!!data[key]} onChange={handleSwitch(key)} color="success" />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: '1200px', mx: 'auto', bgcolor: '#f4f7f9', minHeight: '100vh' }}>
      
      {/* CONTENEDOR ÚNICO DE CABECERA (TODO LO QUE ESTÁ ARRIBA DE LAS PESTAÑAS) */}
      <Paper elevation={3} sx={{ borderRadius: '16px', overflow: 'hidden', mb: 3, border: '1px solid #e0e0e0' }}>
        
        {/* PARTE A: IDENTIFICACIÓN DEL ESTABLECIMIENTO */}
        <Box sx={{ p: 3, bgcolor: '#005596', color: 'white' }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h4" sx={{ fontWeight: '900', letterSpacing: -1 }}>SANATORIO ALLENDE</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip label="CLÍNICAS, SANATORIOS Y HOSPITALES" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }} />
                <Chip label="EXP: 0416-092831/2026" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />
              </Stack>
            </Grid>
            <Grid item sx={{ textAlign: 'right' }}>
              <Typography variant="overline" sx={{ opacity: 0.8, fontWeight: 'bold' }}>Modalidad de Inspección</Typography>
              <ToggleButtonGroup value={data.modalidad} exclusive onChange={handleToggle('modalidad')} size="small" sx={{ bgcolor: 'white', ml: 2 }}>
                <ToggleButton value="PRESENCIAL" sx={{ fontWeight: 'bold', px: 2 }}>PRESENCIAL</ToggleButton>
                <ToggleButton value="VIRTUAL" sx={{ fontWeight: 'bold', px: 2 }}>VIRTUAL</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        </Box>

        {/* PARTE B: DATOS TÉCNICOS Y DIRECTOR (EN UNA SOLA GRILLA) */}
        <Box sx={{ p: 3, bgcolor: '#fff' }}>
          <Grid container spacing={4}>
            {/* Columna Izquierda: Trámite */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 2, color: '#005596', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon fontSize="small" /> INFORMACIÓN DEL TRÁMITE
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666', mb: 0.5, display: 'block' }}>TIPO DE INSPECCIÓN</Typography>
                  <ToggleButtonGroup value={data.tipoInspeccion} exclusive onChange={handleToggle('tipoInspeccion')} size="small" color="primary" fullWidth sx={{ height: 40 }}>
                    <ToggleButton value="HABILITACION">HABILITACIÓN</ToggleButton>
                    <ToggleButton value="RUTINA">RUTINA</ToggleButton>
                    <ToggleButton value="DENUNCIA">DENUNCIA</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid item xs={6}><TextField fullWidth label="Última Habilitación" variant="filled" size="small" value="15/09/2023" disabled /></Grid>
                <Grid item xs={6}><TextField fullWidth label="Resolución N°" variant="filled" size="small" value="1719" disabled /></Grid>
              </Grid>
            </Grid>

            {/* Columna Derecha: Director Técnico */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 2, color: '#005596', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIndIcon fontSize="small" /> DIRECTOR TÉCNICO VIGENTE
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}><TextField fullWidth label="Nombre y Apellido" variant="standard" value="Dr. Barrardi Horacio" InputProps={{ readOnly: true }} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="DNI" variant="standard" value="10.566.234" InputProps={{ readOnly: true }} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="Matrícula" variant="standard" value="11551" InputProps={{ readOnly: true }} /></Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* 3. SECCIÓN DE AUDITORÍA (LISTA DE CONTROL) */}
      <Box sx={{ mb: 3 }}>
        <Accordion defaultExpanded variant="outlined" sx={{ mb: 1, borderRadius: '12px !important', overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#fff' }}>
            <Typography sx={{ fontWeight: 'bold', color: '#005596' }}>REGISTROS Y HISTORIA CLÍNICA</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ p: 2, bgcolor: '#fafafa', borderBottom: '1px solid #eee' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666', mb: 1, display: 'block' }}>TIPO DE H.C.</Typography>
                  <ToggleButtonGroup value={data.tipoHC} exclusive onChange={handleToggle('tipoHC')} size="small" color="primary" fullWidth sx={{ bgcolor: 'white' }}>
                    <ToggleButton value="DIGITAL">DIGITAL</ToggleButton>
                    <ToggleButton value="MANUAL">MANUAL</ToggleButton>
                    <ToggleButton value="MIXTA">MIXTA</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666', mb: 1, display: 'block' }}>ESTADO REVISIÓN (EXCLUYENTE)</Typography>
                  <RadioGroup row value={data.hc_estado} onChange={(e) => setData({...data, hc_estado: e.target.value})}>
                    <FormControlLabel value="completas" control={<Radio color="success" size="small" />} label={<Typography variant="body2">Completas</Typography>} />
                    <FormControlLabel value="incompletas" control={<Radio color="error" size="small" />} label={<Typography variant="body2">Incompletas</Typography>} />
                  </RadioGroup>
                </Grid>
              </Grid>
            </Box>
            {renderFilaCheck("Registro de Historia Clínica", "reg_hc")}
            {renderFilaCheck("Manual de Procedimientos", "manual_proc")}
          </AccordionDetails>
        </Accordion>

        <Accordion variant="outlined" sx={{ mb: 1, borderRadius: '12px !important', overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#fff' }}>
            <Typography sx={{ fontWeight: 'bold', color: '#005596' }}>DATOS EDILICIOS Y SEGURIDAD</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ p: 2, bgcolor: '#fafafa' }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666', mb: 1, display: 'block' }}>SISTEMA DE ELEVACIÓN</Typography>
                  <ToggleButtonGroup value={data.ascensores} exclusive onChange={handleToggle('ascensores')} color="primary" fullWidth sx={{ height: 50, bgcolor: 'white' }}>
                    {['ASCENSOR', 'MONTACAMILLAS', 'AMBOS', 'NINGUNO'].map(opt => <ToggleButton key={opt} value={opt} sx={{ fontWeight: 'bold' }}>{opt}</ToggleButton>)}
                  </ToggleButtonGroup>
                </Grid>
                <Grid item xs={6} md={3}><Stack direction="row" spacing={1} alignItems="center"><DomainIcon color="action" fontSize="small" /><TextField fullWidth type="number" label="Plantas" variant="standard" size="small" /></Stack></Grid>
                <Grid item xs={6} md={3}><Stack direction="row" spacing={1} alignItems="center"><FireExtinguisherIcon color="action" fontSize="small" /><TextField fullWidth type="date" label="Venc. Extinguidores" variant="standard" size="small" value={data.vencExtinguidores} onChange={(e)=>setData({...data, vencExtinguidores: e.target.value})} InputLabelProps={{shrink:true}} /></Stack></Grid>
              </Grid>
            </Box>
            {renderFilaCheck("Plan de Evacuación Vigente", "plan_evac")}
            {renderFilaCheck("Habilitación Bomberos", "bomberos_ok")}
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* 4. PESTAÑAS PARA SERVICIOS ESPECÍFICOS */}
      <Tabs value={tabValue} onChange={(e,v) => setTabValue(v)} sx={{ mb: 2, bgcolor: '#fff', borderRadius: '8px' }} centered>
        <Tab label="TERAPIA (UTI)" icon={<LocalHospitalIcon />} iconPosition="start" />
        <Tab label="CORONARIA (UCO)" icon={<MeetingRoomIcon />} iconPosition="start" />
      </Tabs>

      <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 4, bgcolor: '#fff' }}>
        {tabValue === 0 ? renderFilaCheck("Monitores UTI", "uti_mon") : renderFilaCheck("Ventanas Paño Fijo", "uco_vent")}
      </Paper>
    </Box>
  );
};

export default ActaInspeccion;