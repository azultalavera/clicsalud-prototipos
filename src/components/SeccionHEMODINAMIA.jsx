import React from 'react';
import { Box, Typography, Paper, Switch, Stack, TextField, Grid, Divider } from '@mui/material';

const FilaAuditoria = ({ label, value, onChange }) => (
  <Box sx={{ 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    py: 1.2, px: 2, borderBottom: '1px solid #f0f0f0',
    bgcolor: value ? '#fff3e0' : 'transparent', // Un naranja muy suave para Hemodiálisis
    transition: '0.2s'
  }}>
    <Typography variant="body2" sx={{ fontWeight: 500, color: '#444' }}>{label}</Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="caption" sx={{ fontWeight: '900', color: value ? '#ef6c00' : '#999' }}>
        {value ? 'SÍ' : 'NO'}
      </Typography>
      <Switch size="small" checked={!!value} onChange={onChange} color="warning" />
    </Box>
  </Box>
);

const SeccionHEMODINAMIA = ({ data, onDataChange }) => {
  return (
    <Box sx={{ mt: 1 }}>
      
      {/* 1. DIRECCIÓN Y FUNCIONAMIENTO */}
      <Typography variant="subtitle2" sx={{ color: '#ef6c00', fontWeight: 'bold', mb: 1.5, mt: 2, textTransform: 'uppercase' }}>
        Dirección, Funcionamiento y Normas
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
        <FilaAuditoria label="Unidad de Diálisis Independiente" value={data.hemo_independiente} onChange={(e) => onDataChange('hemo_independiente', e.target.checked)} />
        <FilaAuditoria label="Reglamento Interno" value={data.hemo_reglamento} onChange={(e) => onDataChange('hemo_reglamento', e.target.checked)} />
        <FilaAuditoria label="Plan de Evacuación / Habilitación Bomberos" value={data.hemo_seguridad} onChange={(e) => onDataChange('hemo_seguridad', e.target.checked)} />
        <FilaAuditoria label="Convenio de Internación" value={data.hemo_convenio} onChange={(e) => onDataChange('hemo_convenio', e.target.checked)} />
        <FilaAuditoria label="Normas de Procedimientos (Médicos y Enfermeras)" value={data.hemo_normas_proc} onChange={(e) => onDataChange('hemo_normas_proc', e.target.checked)} />
        <FilaAuditoria label="Normas de bioseguridad expuestas" value={data.hemo_bioseg_exp} onChange={(e) => onDataChange('hemo_bioseg_exp', e.target.checked)} />
      </Paper>

      {/* 2. REGISTROS Y FISCALIZACIÓN (INCUCAI/ECODAI) */}
      <Typography variant="subtitle2" sx={{ color: '#ef6c00', fontWeight: 'bold', mb: 1.5, textTransform: 'uppercase' }}>
        Registros, Libros y Fiscalización
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
        <FilaAuditoria label="Registro Historia Clínica completa" value={data.hemo_hc_completa} onChange={(e) => onDataChange('hemo_hc_completa', e.target.checked)} />
        <FilaAuditoria label="Registro de Psicofármacos Actualizado" value={data.hemo_psico_act} onChange={(e) => onDataChange('hemo_psico_act', e.target.checked)} />
        <FilaAuditoria label="Registro de Enfermedades Transmisibles" value={data.hemo_enf_trans} onChange={(e) => onDataChange('hemo_enf_trans', e.target.checked)} />
        <FilaAuditoria label="Libro de Reusos / Cant. máxima reusos" value={data.hemo_libro_reusos} onChange={(e) => onDataChange('hemo_libro_reusos', e.target.checked)} />
        <FilaAuditoria label="Planillas de Personal Enfermería" value={data.hemo_planillas_enf} onChange={(e) => onDataChange('hemo_planillas_enf', e.target.checked)} />
        <Divider />
        <Box sx={{ p: 2, bgcolor: '#fafafa' }}>
          <Stack spacing={2}>
            <FilaAuditoria label="Nro de Inscripción de pacientes al INCUCAI y/o ECODAI" value={data.hemo_incucai_nro} onChange={(e) => onDataChange('hemo_incucai_nro', e.target.checked)} />
            <FilaAuditoria label="Carpetas de Inscripción de pacientes al INCUCAI / ECODAI" value={data.hemo_incucai_carpetas} onChange={(e) => onDataChange('hemo_incucai_carpetas', e.target.checked)} />
          </Stack>
        </Box>
      </Paper>

      {/* 3. ANÁLISIS DE AGUA (CRÍTICO) */}
      <Typography variant="subtitle2" sx={{ color: '#ef6c00', fontWeight: 'bold', mb: 1.5, textTransform: 'uppercase' }}>
        Control y Análisis de Agua
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FilaAuditoria label="Análisis Físico-Químico" value={data.hemo_agua_fisico} onChange={(e) => onDataChange('hemo_agua_fisico', e.target.checked)} />
              <TextField fullWidth label="Fecha último Físico-Químico" type="date" variant="standard" InputLabelProps={{shrink:true}} sx={{ mt: 1, px: 2 }} 
                value={data.fecha_fisico || ''} onChange={(e) => onDataChange('fecha_fisico', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FilaAuditoria label="Análisis Bacteriológico" value={data.hemo_agua_bacterio} onChange={(e) => onDataChange('hemo_agua_bacterio', e.target.checked)} />
              <TextField fullWidth label="Fecha último Bacteriológico" type="date" variant="standard" InputLabelProps={{shrink:true}} sx={{ mt: 1, px: 2 }} 
                value={data.fecha_bacterio || ''} onChange={(e) => onDataChange('fecha_bacterio', e.target.value)} />
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* 4. SEROLOGÍA (PERSONAL Y PACIENTES) */}
      <Typography variant="subtitle2" sx={{ color: '#ef6c00', fontWeight: 'bold', mb: 1.5, textTransform: 'uppercase' }}>
        Serología (VIH, Hepatitis B y C)
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
        <Grid container>
          <Grid item xs={6} sx={{ borderRight: '1px solid #eee' }}>
            <Typography variant="caption" sx={{ p: 2, fontWeight: 'bold', display: 'block', textAlign: 'center', bgcolor: '#f5f5f5' }}>PACIENTES</Typography>
            <FilaAuditoria label="VIH" value={data.ser_pac_hiv} onChange={(e) => onDataChange('ser_pac_hiv', e.target.checked)} />
            <FilaAuditoria label="Hepatitis B" value={data.ser_pac_hb} onChange={(e) => onDataChange('ser_pac_hb', e.target.checked)} />
            <FilaAuditoria label="Hepatitis C" value={data.ser_pac_hc} onChange={(e) => onDataChange('ser_pac_hc', e.target.checked)} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ p: 2, fontWeight: 'bold', display: 'block', textAlign: 'center', bgcolor: '#f5f5f5' }}>PERSONAL</Typography>
            <FilaAuditoria label="VIH" value={data.ser_per_hiv} onChange={(e) => onDataChange('ser_per_hiv', e.target.checked)} />
            <FilaAuditoria label="Hepatitis B" value={data.ser_per_hb} onChange={(e) => onDataChange('ser_per_hb', e.target.checked)} />
            <FilaAuditoria label="Hepatitis C" value={data.ser_per_hc} onChange={(e) => onDataChange('ser_per_hc', e.target.checked)} />
          </Grid>
        </Grid>
      </Paper>

      {/* 5. OBSERVACIONES GENERALES */}
      <Paper variant="outlined" sx={{ borderRadius: '12px', p: 2 }}>
        <TextField 
          fullWidth multiline rows={3} 
          label="Observaciones de la Unidad de Diálisis" 
          placeholder="Anote aquí detalles sobre el estado de los filtros, reusos o hallazgos en serología..."
          value={data.hemo_obs || ''} 
          onChange={(e) => onDataChange('hemo_obs', e.target.value)}
        />
      </Paper>

    </Box>
  );
};

export default SeccionHEMODINAMIA;