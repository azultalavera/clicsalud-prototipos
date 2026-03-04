import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  CircularProgress, Modal, TextField, Stack, IconButton,
  Divider, MenuItem, Select, FormControl, 
  InputLabel, Checkbox, FormControlLabel, FormGroup,
  Autocomplete, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import Layout from './Layout';

const styleModal = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 750, bgcolor: 'background.paper', boxShadow: 24, borderRadius: '4px', overflow: 'hidden'
};

const EquipamientosConfig = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ESTADOS PARA FILTROS ACTUALIZADOS
  const [filtroTipologia, setFiltroTipologia] = useState(null);
  const [filtroOrigen, setFiltroOrigen] = useState(null);
  const [filtroEquipamiento, setFiltroEquipamiento] = useState(null);
  const [filtroRegla, setFiltroRegla] = useState(null);

  const opcionesRegla = ["UNICO", "LINEAL", "PROPORCIONAL"];

  const [currentItem, setCurrentItem] = useState({
    tipologia: '',
    origen: '', 
    tipo: 'SERVICIO', 
    equipamiento: '', 
    tipoRegla: 'UNICO',
    base: 1,
    cantidadMinima: 1,
    requiereMarca: true,
    requiereModelo: true,
    requiereSerie: true,
    soloExistencia: false
  });

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/equipamientos');
      const json = await res.json();
      setData(json);
    } catch (err) { console.error("Error al cargar datos:", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { cargarDatos(); }, []);

  // LÓGICA DE FILTRADO CON TIPOLOGÍA
  const dataFiltrada = useMemo(() => {
    return data.filter(item => {
      return (!filtroTipologia || item.tipologia === filtroTipologia) &&
             (!filtroOrigen || item.origen === filtroOrigen) &&
             (!filtroEquipamiento || item.equipamiento === filtroEquipamiento) &&
             (!filtroRegla || item.tipoRegla === filtroRegla);
    });
  }, [data, filtroTipologia, filtroOrigen, filtroEquipamiento, filtroRegla]);

  const formatTrazabilidad = (row) => {
    if (row.soloExistencia || (!row.requiereMarca && !row.requiereModelo && !row.requiereSerie)) return "SÓLO EXISTENCIA";
    const m1 = row.requiereMarca ? 'M' : '-';
    const m2 = row.requiereModelo ? 'M' : '-';
    const s = row.requiereSerie ? 'S' : '-';
    return `${m1}/${m2}/${s}`;
  };

  const handleGuardar = async () => {
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing 
      ? `http://localhost:3001/equipamientos/${currentItem.id}` 
      : 'http://localhost:3001/equipamientos';
    
    const finalPayload = {
      ...currentItem,
      tipologia: currentItem.tipologia.trim().toUpperCase(),
      origen: currentItem.origen.trim().toUpperCase(),
      equipamiento: currentItem.equipamiento.trim().toUpperCase(),
      requiereMarca: currentItem.soloExistencia ? false : currentItem.requiereMarca,
      requiereModelo: currentItem.soloExistencia ? false : currentItem.requiereModelo,
      requiereSerie: currentItem.soloExistencia ? false : currentItem.requiereSerie,
    };

    try {
      const response = await fetch(url, {
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(finalPayload)
      });
      if (response.ok) { setOpen(false); cargarDatos(); }
    } catch (err) { console.error("Error:", err); }
  };

  const handleToggleExistencia = (checked) => {
    setCurrentItem({
      ...currentItem,
      soloExistencia: checked,
      requiereMarca: !checked ? currentItem.requiereMarca : false,
      requiereModelo: !checked ? currentItem.requiereModelo : false,
      requiereSerie: !checked ? currentItem.requiereSerie : false,
    });
  };

  return (
    <Layout>
      <Paper elevation={0} sx={{ borderRadius: '4px', border: '1px solid #e0e0e0', mb: 8, mx: 'auto', maxWidth: '1750px', overflow: 'hidden' }}>
        <Box sx={{ backgroundColor: '#005596', color: 'white', py: 2, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>Gestión de Equipamiento</Typography>
        </Box>

        <Box sx={{ p: 4, bgcolor: 'white' }}>
          
          <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: '4px', borderColor: '#e0e0e0' }}>
            <Typography variant="h6" sx={{ color: '#0090d0', mb: 4, fontWeight: 'bold' }}>
              Filtros de configuración de equipamiento
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* FILA 1: TIPOLOGÍA Y ORIGEN */}
              <Box sx={{ display: 'flex', gap: 4, width: '100%' }}>
                <Box sx={{ flex: '1 1 50%' }}>
                  <Autocomplete
                    options={[...new Set(data.map(i => i.tipologia))].filter(Boolean).sort()}
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

              {/* FILA 2: EQUIPAMIENTO Y REGLA */}
              <Box sx={{ display: 'flex', gap: 4, width: '100%' }}>
                <Box sx={{ flex: '1 1 50%' }}>
                  <Autocomplete
                    options={[...new Set(data.map(i => i.equipamiento))].sort()}
                    value={filtroEquipamiento}
                    onChange={(e, v) => setFiltroEquipamiento(v)}
                    renderInput={(params) => <TextField {...params} label="Tipo de Equipo" variant="standard" fullWidth />}
                  />
                </Box>
                <Box sx={{ flex: '1 1 50%' }}>
                  <Autocomplete
                    options={opcionesRegla}
                    value={filtroRegla}
                    onChange={(e, v) => setFiltroRegla(v)}
                    renderInput={(params) => <TextField {...params} label="Tipo de Regla" variant="standard" fullWidth />}
                  />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2, width: '100%' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => { setFiltroTipologia(null); setFiltroOrigen(null); setFiltroEquipamiento(null); setFiltroRegla(null); }}
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

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#29b6f6', fontWeight: 'bold' }} 
              onClick={() => { 
                setCurrentItem({ tipologia: '', origen: '', tipo: 'SERVICIO', equipamiento: '', tipoRegla: 'UNICO', base: 1, cantidadMinima: 1, requiereMarca: true, requiereModelo: true, requiereSerie: true, soloExistencia: false });
                setIsEditing(false); setOpen(true); 
              }}> NUEVO EQUIPO </Button>
          </Box>

          <TableContainer sx={{ border: '1px solid #eee', borderRadius: '4px' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ '& th': { backgroundColor: 'white', borderBottom: '2px solid #005596', color: '#005596', fontWeight: 'bold', py: 2 } }}>
                  <TableCell>TIPOLOGÍA</TableCell>
                  <TableCell>ORIGEN</TableCell>
                  <TableCell>TIPO DE EQUIPO</TableCell>
                  <TableCell align="center">REGLA</TableCell>
                  <TableCell align="center">MÍNIMO</TableCell>
                  <TableCell align="center">MARCA/MODELO/SERIE</TableCell>
                  <TableCell align="center">ACCIONES</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataFiltrada.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontSize: '0.75rem', color: '#666' }}>{row.tipologia || '-'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.origen}</TableCell>
                    <TableCell>{row.equipamiento}</TableCell>
                    <TableCell align="center">
                      <Chip label={row.tipoRegla} size="small" sx={{ fontSize: '0.65rem', fontWeight: 'bold', bgcolor: '#e3f2fd', color: '#005596' }} />
                    </TableCell>
                    <TableCell align="center">{row.cantidadMinima}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: row.soloExistencia ? '#2e7d32' : '#666', letterSpacing: 0.5 }}>
                        {formatTrazabilidad(row)}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <IconButton onClick={() => { 
                            const isExistencia = row.soloExistencia || (!row.requiereMarca && !row.requiereModelo && !row.requiereSerie);
                            setCurrentItem({...row, soloExistencia: isExistencia}); 
                            setIsEditing(true); setOpen(true); 
                          }} color="primary" size="small"><EditIcon fontSize="small" /></IconButton>
                        <IconButton onClick={() => handleBorrar(row.id)} color="error" size="small"><CloseIcon fontSize="small" /></IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      {/* MODAL MANTENIDO CON CAMPO TIPOLOGÍA */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={styleModal}>
          <Box sx={{ bgcolor: '#005596', color: 'white', p: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{isEditing ? 'EDITAR EQUIPO' : 'NUEVO EQUIPO'}</Typography>
          </Box>
          <Box sx={{ p: 4 }}>
            <Stack spacing={2.5}>
              <TextField label="Tipología" variant="standard" fullWidth value={currentItem.tipologia} onChange={(e) => setCurrentItem({...currentItem, tipologia: e.target.value})} />
              <TextField label="Origen" variant="standard" fullWidth value={currentItem.origen} onChange={(e) => setCurrentItem({...currentItem, origen: e.target.value})} />
              <TextField label="Equipamiento" variant="standard" fullWidth value={currentItem.equipamiento} onChange={(e) => setCurrentItem({...currentItem, equipamiento: e.target.value})} />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel>Regla</InputLabel>
                  <Select value={currentItem.tipoRegla} onChange={(e) => setCurrentItem({...currentItem, tipoRegla: e.target.value})}>
                    {opcionesRegla.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                  </Select>
                </FormControl>
                {currentItem.tipoRegla === 'PROPORCIONAL' && (
                   <TextField label="Base" type="number" variant="standard" sx={{width: 100}} value={currentItem.base} onChange={(e) => setCurrentItem({...currentItem, base: e.target.value})} />
                )}
                <TextField label="Mínimo" type="number" variant="standard" sx={{width: 100}} value={currentItem.cantidadMinima} onChange={(e) => setCurrentItem({...currentItem, cantidadMinima: e.target.value})} />
              </Box>

              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: '4px', mt: 2 }}>
                <FormControlLabel 
                  control={<Checkbox checked={currentItem.soloExistencia} onChange={(e) => handleToggleExistencia(e.target.checked)} color="success" />} 
                  label={<Typography sx={{ fontWeight: 'bold' }}>¿Sólo existencia? (Sin Marca/Modelo/Serie)</Typography>} 
                />
                <FormGroup row sx={{ justifyContent: 'space-around', mt: 1, opacity: currentItem.soloExistencia ? 0.5 : 1 }}>
                  <FormControlLabel control={<Checkbox checked={currentItem.requiereMarca} disabled={currentItem.soloExistencia} onChange={(e) => setCurrentItem({...currentItem, requiereMarca: e.target.checked})} />} label="Marca" />
                  <FormControlLabel control={<Checkbox checked={currentItem.requiereModelo} disabled={currentItem.soloExistencia} onChange={(e) => setCurrentItem({...currentItem, requiereModelo: e.target.checked})} />} label="Modelo" />
                  <FormControlLabel control={<Checkbox checked={currentItem.requiereSerie} disabled={currentItem.soloExistencia} onChange={(e) => setCurrentItem({...currentItem, requiereSerie: e.target.checked})} />} label="Serie" />
                </FormGroup>
              </Box>
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              <Button variant="contained" color="error" startIcon={<CancelIcon />} onClick={() => setOpen(false)}>CANCELAR</Button>
              <Button variant="contained" startIcon={<CheckIcon />} onClick={handleGuardar} sx={{ bgcolor: '#005596' }}>{isEditing ? 'ACTUALIZAR' : 'GUARDAR'}</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Layout>
  );
};

export default EquipamientosConfig;