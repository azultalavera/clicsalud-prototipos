import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import { useNavigate } from 'react-router-dom';

const SelectorCLINICAS = () => {
  const navigate = useNavigate();
  const t = "CLÍNICAS, SANATORIOS Y HOSPITALES";

  const handleSelect = () => {
    navigate("clinicas-sanatorios-y-hospitales");
  };

  return (
    <Paper 
      onClick={handleSelect}
      elevation={0}
      sx={{ 
        p: 4, 
        border: '1px solid #e2e8f0', 
        borderRadius: 4, 
        cursor: 'pointer', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 2,
        width: '100%',
        minHeight: '200px',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: '#fff',
        '&:hover': { 
          borderColor: '#0ea5e9', 
          backgroundColor: '#f0f9ff',
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 25px -5px rgba(14,165,233,0.1), 0 10px 10px -5px rgba(14,165,233,0.04)'
        } 
      }}
    >
      <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: '50%', border: '1px solid #e2e8f0', color: '#0ea5e9', display: 'flex' }}>
        <BusinessIcon sx={{ fontSize: 32 }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', lineHeight: 1.2, textAlign: 'center' }}>
        {t}
      </Typography>
    </Paper>
  );
};

export default SelectorCLINICAS;
