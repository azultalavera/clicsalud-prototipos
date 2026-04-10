import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import SelectorCLINICAS from './clinicas/SelectorCLINICAS';
import SelectorGERIATRICOS from './geriatricos/SelectorGERIATRICOS';

const SelectoresMain = () => {
  return (
    <Box sx={{ maxWidth: '1100px', mx: 'auto', p: { xs: 4, md: 8 }, textAlign: 'center' }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', mb: 2, letterSpacing: '-0.02em' }}>
          Seleccionar Tipología
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem', mb: 4 }}>
          Elija el tipo de establecimiento para configurar o editar su planilla de inspección maestra.
        </Typography>
      </Box>
      
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6} lg={4} sx={{ display: 'flex' }}>
          <SelectorCLINICAS />
        </Grid>
        <Grid item xs={12} md={6} lg={4} sx={{ display: 'flex' }}>
          <SelectorGERIATRICOS />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SelectoresMain;
