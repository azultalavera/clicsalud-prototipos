import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Select, MenuItem, 
  Button, Chip, Stack 
} from '@mui/material';
import { 
  Save as SaveIcon,
  SettingsSuggest as SettingsSuggestIcon 
} from '@mui/icons-material';

// Nota: Estos tipos de datos deberían venir de una configuración centralizada o del backend
const DATA_TYPES = [
  'ALFANUMÉRICO',
  'STRING',
  'NÚMERO',
  'FECHA',
  'SI/NO',
  'BUTTON GROUP'
];

const ConfiguracionInspeccion = ({ fields = [], onSave }) => {
  const [localFields, setLocalFields] = useState(fields);

  const handleTypeChange = (id, newType) => {
    setLocalFields(prev => 
      prev.map(f => f.id === id ? { ...f, type: newType } : f)
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 800 }}>
            Configuración de Inspección
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Panel del <strong>ADMINISTRADOR</strong>: Defina la estructura de la plantilla que utilizarán los efectores e inspectores.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<SaveIcon />} 
          size="large"
          onClick={() => onSave && onSave(localFields)}
          sx={{ borderRadius: 3, px: 4 }}
        >
          Guardar Plantilla
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Categoría / Área</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Dato a Inspeccionar</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tipología</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tipo de Dato Configurado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {localFields.map((field) => (
              <TableRow key={field.id} hover>
                <TableCell>
                  <Chip 
                    label={field.category} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                    sx={{ fontWeight: 'bold' }}
                  />
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                    {field.subCategory || field.subTitle || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{field.label}</Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {field.isClinic && <Chip label="Clínica" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />}
                    {field.isGeriatric && <Chip label="Geriátrico" size="small" color="secondary" sx={{ height: 20, fontSize: '0.65rem' }} />}
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <Select
                    value={field.type}
                    size="small"
                    onChange={(e) => handleTypeChange(field.id, e.target.value)}
                    sx={{ minWidth: 160, borderRadius: 2 }}
                    IconComponent={SettingsSuggestIcon}
                  >
                    {DATA_TYPES.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {localFields.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">No hay campos configurados actualmente.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ConfiguracionInspeccion;
