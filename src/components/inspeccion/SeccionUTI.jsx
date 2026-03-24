import React from 'react';
import { Box, Typography, Grid, TextField, Paper, Switch, Divider } from '@mui/material';

const FilaAuditoria = ({ label, value, onChange }) => (
  <Box sx={{ 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    py: 1.2, px: 2, borderBottom: '1px solid #f0f0f0',
    bgcolor: value ? '#f1f8e9' : 'transparent', transition: '0.2s'
  }}>
    <Typography variant="body2" sx={{ fontWeight: 500, color: '#444' }}>{label}</Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="caption" sx={{ fontWeight: '900', color: value ? '#2e7d32' : '#999' }}>
        {value ? 'SÍ' : 'NO'}
      </Typography>
      <Switch size="small" checked={!!value} onChange={onChange} color="success" />
    </Box>
  </Box>
);

const SeccionUTI = ({ data, onDataChange }) => {
  return (
    <Box sx={{ mt: 1 }}>
      
      {/* 1. PLANILLAS Y REGISTROS */}
      <Typography variant="subtitle2" sx={{ color: '#005596', fontWeight: 'bold', mb: 1.5, mt: 2, textTransform: 'uppercase' }}>
        Planillas y Registros Obligatorios
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
        <FilaAuditoria label="Signos Vitales y Controles Diarios" value={data.uti_signos} onChange={(e) => onDataChange('uti_signos', e.target.checked)} />
        <FilaAuditoria label="Balance Diario (Ingresos y Egresos)" value={data.uti_balance} onChange={(e) => onDataChange('uti_balance', e.target.checked)} />
        <FilaAuditoria label="Registro de Medicación" value={data.uti_medicacion} onChange={(e) => onDataChange('uti_medicacion', e.target.checked)} />
        <FilaAuditoria label="Evoluciones diarias en Historia Clínica" value={data.uti_evoluciones} onChange={(e) => onDataChange('uti_evoluciones', e.target.checked)} />
        <FilaAuditoria label="Libro de Registro de Enfermedades Transmisibles" value={data.uti_libro_enf} onChange={(e) => onDataChange('uti_libro_enf', e.target.checked)} />
        <FilaAuditoria label="Libro de Registro de Psicofármacos" value={data.uti_libro_psico} onChange={(e) => onDataChange('uti_libro_psico', e.target.checked)} />
      </Paper>

      {/* 2. PLANTA FÍSICA Y LOCALES */}
      <Typography variant="subtitle2" sx={{ color: '#005596', fontWeight: 'bold', mb: 1.5, textTransform: 'uppercase' }}>
        Edificios y Locales de la Unidad
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
        <FilaAuditoria label="Unidad ubicada en zona semirrestringida" value={data.uti_semirrestringida} onChange={(e) => onDataChange('uti_semirrestringida', e.target.checked)} />
        <FilaAuditoria label="Acceso directo y exclusivo" value={data.uti_acceso_excl} onChange={(e) => onDataChange('uti_acceso_excl', e.target.checked)} />
        <FilaAuditoria label="Fácil comunicación con Quirófano/Cirugía" value={data.uti_com_cirugia} onChange={(e) => onDataChange('uti_com_cirugia', e.target.checked)} />
        <FilaAuditoria label="Visión panorámica directa a todas las camas" value={data.uti_vision} onChange={(e) => onDataChange('uti_vision', e.target.checked)} />
        <FilaAuditoria label="Sala de internación con pileta lavamanos" value={data.uti_pileta} onChange={(e) => onDataChange('uti_pileta', e.target.checked)} />
        <FilaAuditoria label="Office de enfermería" value={data.uti_office} onChange={(e) => onDataChange('uti_office', e.target.checked)} />
        <FilaAuditoria label="Local de Instrumental y material estéril" value={data.uti_esteril} onChange={(e) => onDataChange('uti_esteril', e.target.checked)} />
        <FilaAuditoria label="Local de ropa y material usado (sucio)" value={data.uti_sucio} onChange={(e) => onDataChange('uti_sucio', e.target.checked)} />
        <FilaAuditoria label="Area lavachatas" value={data.uti_lavachatas} onChange={(e) => onDataChange('uti_lavachatas', e.target.checked)} />
        <FilaAuditoria label="Local cerrado con 1 cama para aislamiento" value={data.uti_aislamiento} onChange={(e) => onDataChange('uti_aislamiento', e.target.checked)} />
        <FilaAuditoria label="Depósito de camillas y aparatología" value={data.uti_deposito} onChange={(e) => onDataChange('uti_deposito', e.target.checked)} />
        <FilaAuditoria label="Sala de médicos" value={data.uti_sala_medicos} onChange={(e) => onDataChange('uti_sala_medicos', e.target.checked)} />
        <FilaAuditoria label="Habitación con baño propio para médico de Guardia" value={data.uti_dorm_medico} onChange={(e) => onDataChange('uti_dorm_medico', e.target.checked)} />
        <FilaAuditoria label="Vestuario para visitas con pileta lavamanos" value={data.uti_vest_visitas} onChange={(e) => onDataChange('uti_vest_visitas', e.target.checked)} />
        <FilaAuditoria label="Posee otras Unidades de UCI / UCO" value={data.uti_otras_uni} onChange={(e) => onDataChange('uti_otras_uni', e.target.checked)} />
        <FilaAuditoria label="Comparte algún local UCI / UCO" value={data.uti_comparte} onChange={(e) => onDataChange('uti_comparte', e.target.checked)} />
      </Paper>

      {/* 3. EQUIPAMIENTO Y MOBILIARIO */}
      <Typography variant="subtitle2" sx={{ color: '#005596', fontWeight: 'bold', mb: 1.5, textTransform: 'uppercase' }}>
        Equipamiento y Mobiliario
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
        <FilaAuditoria label="Monitores Multiparamétricos" value={data.uti_monitores} onChange={(e) => onDataChange('uti_monitores', e.target.checked)} />
        <FilaAuditoria label="Camas ortopédicas o articuladas" value={data.uti_camas_orto} onChange={(e) => onDataChange('uti_camas_orto', e.target.checked)} />
        <FilaAuditoria label="Doble comando" value={data.uti_doble_comando} onChange={(e) => onDataChange('uti_doble_comando', e.target.checked)} />
        <FilaAuditoria label="Rodantes operativos" value={data.uti_rodantes} onChange={(e) => onDataChange('uti_rodantes', e.target.checked)} />
      </Paper>

      {/* 4. INSTALACIONES Y AMBIENTE */}
      <Typography variant="subtitle2" sx={{ color: '#005596', fontWeight: 'bold', mb: 1.5, textTransform: 'uppercase' }}>
        Instalaciones, Energía y Ambiente
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0', bgcolor: '#fafafa' }}>
           <TextField 
             fullWidth label="Superficie total sala internación (m2)" 
             variant="standard" type="number"
             value={data.uti_superficie || ''} 
             onChange={(e) => onDataChange('uti_superficie', e.target.value)} 
           />
        </Box>
        <FilaAuditoria label="Grupo electrógeno de transferencia automática" value={data.uti_electrogeno} onChange={(e) => onDataChange('uti_electrogeno', e.target.checked)} />
        <FilaAuditoria label="Sistema de Iluminación de Emergencia" value={data.uti_luz_emerg} onChange={(e) => onDataChange('uti_luz_emerg', e.target.checked)} />
        <FilaAuditoria label="Doble circuito de energía eléctrica" value={data.uti_doble_circuito} onChange={(e) => onDataChange('uti_doble_circuito', e.target.checked)} />
        <FilaAuditoria label="Diez tomas de electricidad por cama" value={data.uti_tomas_cama} onChange={(e) => onDataChange('uti_tomas_cama', e.target.checked)} />
        <FilaAuditoria label="Hermeticidad en la unidad" value={data.uti_hermeticidad} onChange={(e) => onDataChange('uti_hermeticidad', e.target.checked)} />
        <FilaAuditoria label="Privacidad (cortinas o paneles)" value={data.uti_privacidad} onChange={(e) => onDataChange('uti_privacidad', e.target.checked)} />
        <FilaAuditoria label="Ventanas al exterior" value={data.uti_ventanas} onChange={(e) => onDataChange('uti_ventanas', e.target.checked)} />
        <FilaAuditoria label="Iluminación natural" value={data.uti_ilumin_nat} onChange={(e) => onDataChange('uti_ilumin_nat', e.target.checked)} />
        <FilaAuditoria label="Iluminación artificial central" value={data.uti_ilumin_art} onChange={(e) => onDataChange('uti_ilumin_art', e.target.checked)} />
        <FilaAuditoria label="Iluminación Individual por cama" value={data.uti_ilumin_ind} onChange={(e) => onDataChange('uti_ilumin_ind', e.target.checked)} />
        <FilaAuditoria label="Acceso desde 4 posiciones a la cabecera" value={data.uti_acceso_4p} onChange={(e) => onDataChange('uti_acceso_4p', e.target.checked)} />
      </Paper>

    </Box>
  );
};

export default SeccionUTI;

