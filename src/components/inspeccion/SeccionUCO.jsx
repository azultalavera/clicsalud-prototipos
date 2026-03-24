import React from 'react';
import { Box, Typography, Paper, Switch, TextField, Stack } from '@mui/material';

const FilaAuditoria = ({ label, value, onChange }) => (
  <Box sx={{ 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    py: 1.2, px: 2, borderBottom: '1px solid #f0f0f0',
    bgcolor: value ? '#fff9c4' : 'transparent',
    transition: '0.2s'
  }}>
    <Typography variant="body2" sx={{ fontWeight: 500, color: '#444' }}>{label}</Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="caption" sx={{ fontWeight: '900', color: value ? '#f57f17' : '#999' }}>
        {value ? 'SÍ' : 'NO'}
      </Typography>
      <Switch size="small" checked={!!value} onChange={onChange} color="warning" />
    </Box>
  </Box>
);

const SeccionUCO = ({ data, onDataChange }) => {
  return (
    <Box sx={{ mt: 1 }}>
      
      {/* 1. PLANILLAS DE ENFERMERÍA (LO QUE FALTABA) */}
      <Typography variant="subtitle2" sx={{ color: '#e65100', fontWeight: 'bold', mb: 1.5, mt: 2, textTransform: 'uppercase' }}>
        Planillas de enfermería con controles diarios
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
        <FilaAuditoria label="Signos Vitales" value={data.uco_signos} onChange={(e) => onDataChange('uco_signos', e.target.checked)} />
        <FilaAuditoria label="Balance Diario" value={data.uco_balance} onChange={(e) => onDataChange('uco_balance', e.target.checked)} />
        <FilaAuditoria label="Volúmenes de ingresos y egresos" value={data.uco_volumenes} onChange={(e) => onDataChange('uco_volumenes', e.target.checked)} />
        <FilaAuditoria label="Medicación" value={data.uco_medicacion} onChange={(e) => onDataChange('uco_medicacion', e.target.checked)} />
        <FilaAuditoria label="Evoluciones diarias en Historia Clínica" value={data.uco_evoluciones} onChange={(e) => onDataChange('uco_evoluciones', e.target.checked)} />
      </Paper>

      {/* 2. EDIFICIOS / LOCALES DE UNIDAD */}
      <Typography variant="subtitle2" sx={{ color: '#e65100', fontWeight: 'bold', mb: 1.5, textTransform: 'uppercase' }}>
        Edificios y Locales de la Unidad
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
        <FilaAuditoria label="Unidad ubicada en zona de circulación semirrestringida" value={data.uco_semirrestringida} onChange={(e) => onDataChange('uco_semirrestringida', e.target.checked)} />
        <FilaAuditoria label="Acceso directo y exclusivo" value={data.uco_acceso_excl} onChange={(e) => onDataChange('uco_acceso_excl', e.target.checked)} />
        <FilaAuditoria label="Fácil comunicación con cirugía" value={data.uco_com_cirugia} onChange={(e) => onDataChange('uco_com_cirugia', e.target.checked)} />
        <FilaAuditoria label="Visión panorámica directa a todas las camas" value={data.uco_vision} onChange={(e) => onDataChange('uco_vision', e.target.checked)} />
        <FilaAuditoria label="Sala de internación con pileta lavamanos" value={data.uco_pileta} onChange={(e) => onDataChange('uco_pileta', e.target.checked)} />
        <FilaAuditoria label="Office de enfermería" value={data.uco_office} onChange={(e) => onDataChange('uco_office', e.target.checked)} />
        <FilaAuditoria label="Local cerrado con 1 cama para aislamiento" value={data.uco_aislamiento} onChange={(e) => onDataChange('uco_aislamiento', e.target.checked)} />
        <FilaAuditoria label="Local de Instrumental y material estéril" value={data.uco_esteril} onChange={(e) => onDataChange('uco_esteril', e.target.checked)} />
        <FilaAuditoria label="Local de ropa y material usado (sucio)" value={data.uco_sucio} onChange={(e) => onDataChange('uco_sucio', e.target.checked)} />
        <FilaAuditoria label="Area lavachatas" value={data.uco_lavachatas} onChange={(e) => onDataChange('uco_lavachatas', e.target.checked)} />
        <FilaAuditoria label="Depósito de camillas y aparatología" value={data.uco_deposito} onChange={(e) => onDataChange('uco_deposito', e.target.checked)} />
        <FilaAuditoria label="Sala de médicos" value={data.uco_sala_medicos} onChange={(e) => onDataChange('uco_sala_medicos', e.target.checked)} />
        <FilaAuditoria label="Habitación con baño propio para médico de Guardia" value={data.uco_dorm_medico} onChange={(e) => onDataChange('uco_dorm_medico', e.target.checked)} />
        <FilaAuditoria label="Vestuario para visitas con pileta lavamanos" value={data.uco_vest_visitas} onChange={(e) => onDataChange('uco_vest_visitas', e.target.checked)} />
        <FilaAuditoria label="Posee otras Unidades de UCI / UCO" value={data.uco_otras_uni} onChange={(e) => onDataChange('uco_otras_uni', e.target.checked)} />
        <FilaAuditoria label="Comparte algún local UCI / UCO" value={data.uco_comparte} onChange={(e) => onDataChange('uco_comparte', e.target.checked)} />
      </Paper>

      {/* 3. EQUIPAMIENTO Y MOBILIARIO */}
      <Typography variant="subtitle2" sx={{ color: '#e65100', fontWeight: 'bold', mb: 1.5, textTransform: 'uppercase' }}>
        Equipamiento y Mobiliario
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
        <FilaAuditoria label="Monitores Multiparamétricos" value={data.uco_monitores} onChange={(e) => onDataChange('uco_monitores', e.target.checked)} />
        <FilaAuditoria label="Camas ortopédicas o articuladas" value={data.uco_camas_orto} onChange={(e) => onDataChange('uco_camas_orto', e.target.checked)} />
        <FilaAuditoria label="Doble comando" value={data.uco_doble_comando} onChange={(e) => onDataChange('uco_doble_comando', e.target.checked)} />
        <FilaAuditoria label="Rodantes operativos" value={data.uco_rodantes} onChange={(e) => onDataChange('uco_rodantes', e.target.checked)} />
        <FilaAuditoria label="Plano apoyo rígido (RCP)" value={data.uco_plano_rigido} onChange={(e) => onDataChange('uco_plano_rigido', e.target.checked)} />
        <FilaAuditoria label="Acceso desde 4 posiciones" value={data.uco_acceso_4p} onChange={(e) => onDataChange('uco_acceso_4p', e.target.checked)} />
      </Paper>

      {/* 4. INSTALACIONES Y AMBIENTE */}
      <Typography variant="subtitle2" sx={{ color: '#e65100', fontWeight: 'bold', mb: 1.5, textTransform: 'uppercase' }}>
        Instalaciones, Energía y Ambiente
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0', bgcolor: '#fafafa' }}>
           <TextField 
             fullWidth label="Superficie total sala internación UCO (m2)" 
             variant="standard" type="number"
             value={data.uco_superficie || ''} 
             onChange={(e) => onDataChange('uco_superficie', e.target.value)} 
           />
        </Box>
        <FilaAuditoria label="Grupo electrógeno" value={data.uco_electrogeno} onChange={(e) => onDataChange('uco_electrogeno', e.target.checked)} />
        <FilaAuditoria label="Sistema de Iluminación de Emergencia" value={data.uco_luz_emerg} onChange={(e) => onDataChange('uco_luz_emerg', e.target.checked)} />
        <FilaAuditoria label="Diez tomas de electricidad por cama" value={data.uco_tomas_cama} onChange={(e) => onDataChange('uco_tomas_cama', e.target.checked)} />
        <FilaAuditoria label="Hermeticidad" value={data.uco_hermeticidad} onChange={(e) => onDataChange('uco_hermeticidad', e.target.checked)} />
        <FilaAuditoria label="Privacidad asegurada" value={data.uco_privacidad} onChange={(e) => onDataChange('uco_privacidad', e.target.checked)} />
        <FilaAuditoria label="Ventanas al exterior DE PAÑO FIJO" value={data.uco_ventanas_fijo} onChange={(e) => onDataChange('uco_ventanas_fijo', e.target.checked)} />
        <FilaAuditoria label="Iluminación natural" value={data.uco_ilumin_nat} onChange={(e) => onDataChange('uco_ilumin_nat', e.target.checked)} />
        <FilaAuditoria label="Iluminación artificial central" value={data.uco_ilumin_art} onChange={(e) => onDataChange('uco_ilumin_art', e.target.checked)} />
        <FilaAuditoria label="Iluminación Individual" value={data.uco_ilumin_ind} onChange={(e) => onDataChange('uco_ilumin_ind', e.target.checked)} />
      </Paper>

    </Box>
  );
};

export default SeccionUCO;