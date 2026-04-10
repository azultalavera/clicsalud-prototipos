import React, { useState } from 'react';
import { 
  Box, Typography, Paper, TextField, Switch, FormControlLabel, 
  Tabs, Tab, Grid, Button, ToggleButton, ToggleButtonGroup,
  Card, CardContent, Divider, Stack
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { 
  Send as SendIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';

const CargaDatosEfector = ({ fields = [], onDataSubmit }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({});

  const categories = [...new Set(fields.map(f => f.category))];
  const currentCategory = categories[activeTab];
  const filteredFields = fields.filter(f => f.category === currentCategory);

  const handleInputChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const renderInput = (field) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'FECHA':
        return (
          <DatePicker
            label={field.label}
            value={value || null}
            onChange={(val) => handleInputChange(field.id, val)}
            slotProps={{ textField: { fullWidth: true, variant: 'standard' } }}
          />
        );
      case 'SI/NO':
        return (
          <FormControlLabel
            control={
              <Switch 
                checked={!!value} 
                onChange={(e) => handleInputChange(field.id, e.target.checked)} 
              />
            }
            label={value ? 'SÍ' : 'NO'}
          />
        );
      case 'NÚMERO':
        return (
          <TextField
            fullWidth
            type="number"
            label={field.label}
            variant="standard"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );
      case 'BUTTON GROUP':
        return (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              {field.label}
            </Typography>
            <ToggleButtonGroup
              color="primary"
              value={value}
              exclusive
              onChange={(e, val) => handleInputChange(field.id, val)}
              fullWidth
              size="small"
            >
              {(field.options || []).map(opt => (
                <ToggleButton key={opt} value={opt}>{opt}</ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        );
      default:
        return (
          <TextField
            fullWidth
            label={field.label}
            variant="standard"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
        <Paper 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 4, 
            background: 'linear-gradient(135deg, #005596 0%, #29b6f6 100%)', 
            color: 'white',
            boxShadow: '0 10px 30px rgba(0,85,150,0.2)'
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <CloudUploadIcon sx={{ fontSize: 48, opacity: 0.9 }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>Carga de Datos del Efector</Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                <strong>VISTA EFECTOR:</strong> Complete el relevamiento de recursos humanos, equipamientos e infraestructura.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, val) => setActiveTab(val)} 
            variant="scrollable" 
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' }
            }}
          >
            {categories.map((cat, idx) => (
              <Tab key={cat} label={cat} sx={{ fontWeight: 700, px: 3 }} />
            ))}
          </Tabs>
        </Box>

        <Grid container spacing={3}>
          {filteredFields.map(field => (
            <Grid item xs={12} md={6} key={field.id}>
              <Card variant="outlined" sx={{ borderRadius: 3, border: '1px solid #e2e8f0', transition: '0.2s', '&:hover': { borderColor: 'primary.main' } }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold' }}>
                    {field.subCategory || field.subTitle || 'General'}
                  </Typography>
                  <Divider sx={{ my: 1.5, opacity: 0.5 }} />
                  {renderInput(field)}
                </CardContent>
              </Card>
            </Grid>
          ))}
          {filteredFields.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#f8fafc', borderRadius: 4 }}>
                <Typography color="text.secondary">No hay campos configurados para esta categoría.</Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" size="large" sx={{ borderRadius: 2, px: 4 }}>
            Guardar Borrador
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            startIcon={<SendIcon />}
            onClick={() => onDataSubmit && onDataSubmit(formData)}
            sx={{ borderRadius: 2, px: 4, fontWeight: 'bold' }}
          >
            Enviar Declaración Jurada
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default CargaDatosEfector;
