import React from 'react';
import { Box, Typography, Paper, Switch, TextField, Grid } from '@mui/material';

const FilaAuditoria = ({ label, value, onChange }) => (
  <Box sx={{ 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    py: 1.2, px: 2, borderBottom: '1px solid #f0f0f0',
    bgcolor: value ? '#e1f5fe' : 'transparent',
    transition: '0.2s'
  }}>
    <Typography variant="body2" sx={{ fontWeight: 500, color: '#444' }}>{label}</Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="caption" sx={{ fontWeight: '900', color: value ? '#0288d1' : '#999' }}>
        {value ? 'SÍ' : 'NO'}
      </Typography>
      <Switch size="small" checked={!!value} onChange={onChange} color="info" />
    </Box>
  </Box>
);

const SeccionUTIN = ({ data, onDataChange }) => {
  return (
    <Box sx={{ mt: 1 }}>
      
      {/* 1. PLANILLAS DE ENFERMERÍA NEONATAL */}
      <Typography variant="subtitle2" sx={{ color: '#01579b', fontWeight: 'bold', mb: 1.5, mt: 2, textTransform: 'uppercase' }}>
        Planillas de enfermería con controles diarios
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
        <FilaAuditoria label="Signos Vitales" value={data.utin_signos} onChange={(e) => onDataChange('utin_signos', e.target.checked)} />
        <FilaAuditoria label="Volúmenes de ingresos y egresos" value={data.utin_volumenes} onChange={(e) => onDataChange('utin_volumenes', e.target.checked)} />
        <FilaAuditoria label="Balance Diario" value={data.utin_balance} onChange={(e) => onDataChange('utin_balance', e.target.checked)} />
        <FilaAuditoria label="Medicación" value={data.utin_medicacion} onChange={(e) => onDataChange('utin_medicacion', e.target.checked)} />
      </Paper>

      {/* 2. PLANTA FÍSICA Y LOCALES */}
      <Typography variant="subtitle2" sx={{ color: '#01579b', fontWeight: 'bold', mb: 1.5, textTransform: 'uppercase' }}>
        Edificios y Locales de la Unidad
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
        <FilaAuditoria label="Unidad ubicada en zona de circulación semirrestringida" value={data.utin_semirrestringida} onChange={(e) => onDataChange('utin_semirrestringida', e.target.checked)} />
        <FilaAuditoria label="Visión panorámica directa a todas las camas" value={data.utin_vision} onChange={(e) => onDataChange('utin_vision', e.target.checked)} />
        <FilaAuditoria label="Sala de internación c/pileta lavamanos" value={data.utin_pileta} onChange={(e) => onDataChange('utin_pileta', e.target.checked)} />
        <FilaAuditoria label="Local de Instrumental y material estéril" value={data.utin_esteril} onChange={(e) => onDataChange('utin_esteril', e.target.checked)} />
        <FilaAuditoria label="Office de enfermería con monitores" value={data.utin_office_monitores} onChange={(e) => onDataChange('utin_office_monitores', e.target.checked)} />
        <FilaAuditoria label="Local cerrado c/2 unidades para aislamiento" value={data.utin_aislamiento} onChange={(e) => onDataChange('utin_aislamiento', e.target.checked)} />
        <FilaAuditoria label="Lactario (Fórmulas lácteas)" value={data.utin_lactario} onChange={(e) => onDataChange('utin_lactario', e.target.checked)} />
        <FilaAuditoria label="Vestuario para visitas c/pileta lavamanos" value={data.utin_vestuario} onChange={(e) => onDataChange('utin_vestuario', e.target.checked)} />
      </Paper>

      {/* 3. EQUIPAMIENTO E INSTALACIONES */}
      <Typography variant="subtitle2" sx={{ color: '#01579b', fontWeight: 'bold', mb: 1.5, textTransform: 'uppercase' }}>
        Equipamiento Neonatal e Instalaciones
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
        <Box sx={{ p: 2, bgcolor: '#fafafa' }}>
           <TextField 
             fullWidth label="Superficie total sala internación UTIN (m2)" 
             variant="standard" type="number"
             value={data.utin_superficie || ''} 
             onChange={(e) => onDataChange('utin_superficie', e.target.value)} 
           />
        </Box>
        <FilaAuditoria label="Ocho tomas de electricidad por cama con tablero independiente" value={data.utin_tomas_indep} onChange={(e) => onDataChange('utin_tomas_indep', e.target.checked)} />
        <FilaAuditoria label="Extractor de aire con filtro" value={data.utin_extractor_filtro} onChange={(e) => onDataChange('utin_extractor_filtro', e.target.checked)} />
        <FilaAuditoria label="Ventanas al exterior (De paño fijo)" value={data.utin_ventanas_fijo} onChange={(e) => onDataChange('utin_ventanas_fijo', e.target.checked)} />
        <FilaAuditoria label="Aire comprimido / Fuentes de Oxígeno / Aspiración" value={data.utin_gases} onChange={(e) => onDataChange('utin_gases', e.target.checked)} />
      </Paper>

      {/* 4. SERVICIOS DE APOYO Y GESTIÓN (NUEVO) */}
      <Typography variant="subtitle2" sx={{ color: '#01579b', fontWeight: 'bold', mb: 1.5, textTransform: 'uppercase' }}>
        Servicios de Apoyo y Gestión
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
        <FilaAuditoria label="Cronograma de trabajo" value={data.utin_cronograma} onChange={(e) => onDataChange('utin_cronograma', e.target.checked)} />
        <FilaAuditoria label="Laboratorio Bioquímico" value={data.utin_lab_bioquimico} onChange={(e) => onDataChange('utin_lab_bioquimico', e.target.checked)} />
        <FilaAuditoria label="Radiología" value={data.utin_radiologia} onChange={(e) => onDataChange('utin_radiologia', e.target.checked)} />
        <FilaAuditoria label="Hemoterapia" value={data.utin_hemoterapia} onChange={(e) => onDataChange('utin_hemoterapia', e.target.checked)} />
      </Paper>

    </Box>
  );
};

export default SeccionUTIN;