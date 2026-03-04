import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  CircularProgress, Modal, TextField, Stack, IconButton,
  Autocomplete, Chip 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

const styleModal = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 650, bgcolor: 'background.paper', boxShadow: 24, borderRadius: '4px', overflow: 'hidden'
};

const Infraestructura = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Estados de Filtros
  const [filtroTipologia, setFiltroTipologia] = useState(null);
  const [filtroOrigen, setFiltroOrigen] = useState(null);
  const [filtroRequerida, setFiltroRequerida] = useState(null);
  const [filtroTipoRequisito, setFiltroTipoRequisito] = useState(null);

  const opcionesTipologia = ["CLÍNICAS, SANATORIOS Y HOSPITALES", "GERIÁTRICOS"];
  const opcionesTipoInfra = ["CAMA", "SALA", "SERVICIO", "SERVICIO COMPLEMENTARIO"];

  const [currentItem, setCurrentItem] = useState({
    tipologia: 'CLÍNICAS, SANATORIOS Y HOSPITALES',
    origen: '', tipo: '', requerida: '', tipoInfra: '', minimo: ''
  });

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/infraestructura');
      const json = await res.json();
      setData(json);
    } catch (err) { console.error("Error:", err); }
    setLoading(false);
  };

  useEffect(() => { cargarDatos(); }, []);

  const dataFiltrada = useMemo(() => {
    return data.filter(item => {
      return (!filtroTipologia || item.tipologia === filtroTipologia) &&
             (!filtroOrigen || item.origen === filtroOrigen) &&
             (!filtroRequerida || item.requerida === filtroRequerida) &&
             (!filtroTipoRequisito || item.tipoInfra === filtroTipoRequisito);
    });
  }, [data, filtroTipologia, filtroOrigen, filtroRequerida, filtroTipoRequisito]);

  const handleGuardar = async () => {
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `http://localhost:3001/infraestructura/${currentItem.id}` : 'http://localhost:3001/infraestructura';
    await fetch(url, {
      method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(currentItem)
    });
    setOpen(false);
    cargarDatos();
  };

  const handleBorrar = async (id) => {
    if (window.confirm("¿Desea eliminar esta regla?")) {
      await fetch(`http://localhost:3001/infraestructura/${id}`, { method: 'DELETE' });
      cargarDatos();
    }
  };

  return (
    <Layout>
      <Paper elevation={0} sx={{ borderRadius: '4px', border: '1px solid #e0e0e0', overflow: 'hidden', mb: 8, mx: 'auto', maxWidth: '1750px' }}>
        <Box sx={{ backgroundColor: '#005596', color: 'white', py: 2, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>Gestión de infraestructura</Typography>
        </Box>

        <Box sx={{ p: 4, backgroundColor: 'white' }}>
          
          {/* SECCIÓN FILTROS REESTRUCTURADA CON FLEX PURO */}
          <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: '4px', borderColor: '#e0e0e0' }}>
            <Typography variant="h6" sx={{ color: '#0090d0', mb: 4, fontWeight: 'bold' }}>
              Filtros de configuración de infraestructura
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* FILA 1 */}
              <Box sx={{ display: 'flex', gap: 4, width: '100%' }}>
                <Box sx={{ flex: '1 1 50%' }}>
                  <Autocomplete
                    options={opcionesTipologia}
                    value={filtroTipologia}
                    onChange={(e, v) => setFiltroTipologia(v)}
                    renderInput={(params) => <TextField {...params} label="Tipología" variant="standard" fullWidth />}
                  />
                </Box>
                <Box sx={{ flex: '1 1 50%' }}>
                  <Autocomplete
                    options={[...new Set(data.map(i => i.origen))].sort()}
                    value={filtroOrigen}
                    onChange={(e, v) => setFiltroOrigen(v)}
                    renderInput={(params) => <TextField {...params} label="Origen" variant="standard" fullWidth />}
                  />
                </Box>
              </Box>

              {/* FILA 2 */}
              <Box sx={{ display: 'flex', gap: 4, width: '100%' }}>
                <Box sx={{ flex: '1 1 50%' }}>
                  <Autocomplete
                    options={[...new Set(data.map(i => i.requerida))].sort()}
                    value={filtroRequerida}
                    onChange={(e, v) => setFiltroRequerida(v)}
                    renderInput={(params) => <TextField {...params} label="Infraestructura" variant="standard" fullWidth />}
                  />
                </Box>
                <Box sx={{ flex: '1 1 50%' }}>
                  <Autocomplete
                    options={opcionesTipoInfra}
                    value={filtroTipoRequisito}
                    onChange={(e, v) => setFiltroTipoRequisito(v)}
                    renderInput={(params) => <TextField {...params} label="Tipo Requisito" variant="standard" fullWidth />}
                  />
                </Box>
              </Box>
              
              {/* FILA 3: BOTONES AL EXTREMO DERECHO */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2, width: '100%' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => { setFiltroTipologia(null); setFiltroOrigen(null); setFiltroRequerida(null); setFiltroTipoRequisito(null); }}
                  sx={{ color: '#29b6f6', borderColor: '#29b6f6', px: 5, fontWeight: 'bold' }}
                >
                  LIMPIAR
                </Button>
                <Button variant="contained" startIcon={<SearchIcon />} sx={{ backgroundColor: '#29b6f6', px: 5, fontWeight: 'bold' }}>
                  CONSULTAR
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* BOTÓN AGREGAR */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setCurrentItem({ tipologia: 'CLÍNICAS, SANATORIOS Y HOSPITALES', origen: '', tipo: '', requerida: '', tipoInfra: '', minimo: '' }); setIsEditing(false); setOpen(true); }} sx={{ backgroundColor: '#29b6f6', fontWeight: 'bold' }}>
              AGREGAR INFRAESTRUCTURA
            </Button>
          </Box>

          {/* TABLA DE INFRAESTRUCTURA */}
          {loading ? (
            <CircularProgress sx={{ display: 'block', mx: 'auto', my: 5 }} />
          ) : (
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow 
                    sx={{ 
                      '& th': { 
                        backgroundColor: 'white', // Fondo blanco para el header
                        borderBottom: '2px solid #005596', 
                        color: '#005596', 
                        fontWeight: 'bold', 
                        py: 2 
                      } 
                    }}
                  >
                    {/* NUEVA COLUMNA TIPOLOGÍA */}
                    <TableCell>TIPOLOGÍA</TableCell>
                    <TableCell>ORIGEN (SERVICIO/SALA)</TableCell>
                    <TableCell>TIPO</TableCell>
                    <TableCell>INFRAESTRUCTURA REQUERIDA</TableCell>
                    <TableCell>TIPO REQUISITO</TableCell>
                    <TableCell>MÍNIMO</TableCell>
                    <TableCell align="center">ACCIONES</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataFiltrada.map((row) => (
                    <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                      {/* DATO DE LA NUEVA COLUMNA */}
                      <TableCell sx={{ fontSize: '0.75rem', color: '#666' }}>
                        {row.tipologia}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#333' }}>
                        {row.origen}
                      </TableCell>
                      <TableCell>{row.tipo}</TableCell>
                      <TableCell>{row.requerida}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.tipoInfra} 
                          size="small" 
                          sx={{ fontSize: '0.65rem', fontWeight: 'bold', bgcolor: '#e3f2fd', color: '#005596' }} 
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#0090d0' }}>
                        {row.minimo}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton 
                            onClick={() => { setCurrentItem(row); setIsEditing(true); setOpen(true); }} 
                            color="primary" 
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleBorrar(row.id)} 
                            color="error" 
                            size="small"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={styleModal}>
          <Box sx={{ bgcolor: '#005596', color: 'white', p: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
              {isEditing ? 'Editar Configuración' : 'Nueva Configuración'}
            </Typography>
          </Box>
          <Box sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Autocomplete options={opcionesTipologia} value={currentItem.tipologia} onChange={(e, v) => setCurrentItem({...currentItem, tipologia: v})} renderInput={(params) => <TextField {...params} label="Tipología" variant="standard" fullWidth />} />
              <TextField label="Origen" variant="standard" fullWidth value={currentItem.origen} onChange={(e) => setCurrentItem({...currentItem, origen: e.target.value.toUpperCase()})} />
              <TextField label="Requisito" variant="standard" fullWidth value={currentItem.requerida} onChange={(e) => setCurrentItem({...currentItem, requerida: e.target.value.toUpperCase()})} />
              <Autocomplete options={opcionesTipoInfra} value={currentItem.tipoInfra} onChange={(e, v) => setCurrentItem({...currentItem, tipoInfra: v})} renderInput={(params) => <TextField {...params} label="Tipo de Requisito" variant="standard" fullWidth />} />
              <TextField label="Mínimo" variant="standard" fullWidth value={currentItem.minimo} onChange={(e) => setCurrentItem({...currentItem, minimo: e.target.value})} />
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 5 }}>
              <Button variant="contained" color="error" startIcon={<CancelIcon />} onClick={() => setOpen(false)}>CANCELAR</Button>
              <Button variant="contained" startIcon={<CheckIcon />} onClick={handleGuardar} sx={{ bgcolor: '#005596' }}>{isEditing ? 'ACTUALIZAR' : 'AGREGAR'}</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Layout>
  );
};

export default Infraestructura;