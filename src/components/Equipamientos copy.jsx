import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TextField, 
  Button, CircularProgress, Autocomplete, Stack, IconButton, 
  Divider, Checkbox, Chip, Tooltip 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const getTextoNormativo = (item) => {
  if (item.esAdicional) return "Equipo agregado manualmente fuera de normativa.";
  if (item.explicacionPersonalizada) return item.explicacionPersonalizada;
  const regla = item.tipoRegla?.toUpperCase();
  const base = item.base || 1;
  const min = item.cantidadMinima || 1;
  switch (regla) {
    case 'UNICO': return "Requisito fijo: 1 unidad por servicio.";
    case 'LINEAL': return "Cálculo Lineal: 1 unidad por cada cama o sala.";
    case 'PROPORCIONAL': return `Cálculo Proporcional: 1 cada ${base} unidades. Mínimo: ${min}.`;
    case 'BOOLEANO': return "Declaración de existencia.";
    default: return "Normativa Anexo I.";
  }
};

const Equipamientos = ({ selectedServices = {}, infraSelection = {} }) => {
  const [reglas, setReglas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filasTabla, setFilasTabla] = useState([]);
  const [filtroOrigen, setFiltroOrigen] = useState(null);
  const [filtroEquipamiento, setFiltroEquipamiento] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3001/equipamientos');
        const data = await res.json();
        setReglas(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (reglas.length > 0) {
      const servicios = Object.keys(selectedServices || {});
      const infraestructura = Object.keys(infraSelection || {}).filter(key => (infraSelection[key] || 0) > 0);
      const pool = [...servicios, ...infraestructura].map(s => s.trim().toUpperCase());

      let iniciales = reglas
        .filter(r => pool.includes(r.origen.toUpperCase()))
        .map(regla => {
          let unidadesCalculadas = 1;
          const cantidadDeclarada = infraSelection[regla.origen] || 0;
          if (regla.tipoRegla === 'LINEAL') {
            unidadesCalculadas = cantidadDeclarada > 0 ? cantidadDeclarada : 1;
          } else if (regla.tipoRegla === 'PROPORCIONAL') {
            unidadesCalculadas = Math.max(regla.cantidadMinima, Math.ceil(cantidadDeclarada / (regla.base || 1)));
          }
          return { ...regla, idFila: `${regla.id}-${Math.random()}`, unidadesRequeridas: unidadesCalculadas, esAdicional: false };
        });

      if (pool.includes("UNIDAD CORONARIA")) {
        const cantCamasUCO = infraSelection["UNIDAD CORONARIA"] || 0;
        const bloqueUCO = [
          { id: 380, origen: "UNIDAD CORONARIA", equipamiento: "RESPIRADOR MECÁNICO DE RESGUARDO", tipoRegla: "UNICO", unidadesRequeridas: 1 },
          { id: 381, origen: "UNIDAD CORONARIA", equipamiento: "SISTEMA PORTÁTIL DE ASPIRACIÓN PARA DRENAJE", tipoRegla: "UNICO", unidadesRequeridas: 1 },
          { id: 382, origen: "UNIDAD CORONARIA", equipamiento: "ECOCARDIÓGRAFO", tipoRegla: "UNICO", unidadesRequeridas: 1 },
          { id: 383, origen: "UNIDAD CORONARIA", equipamiento: "CARRO DE URGENCIA", tipoRegla: "UNICO", unidadesRequeridas: 1 },
          { id: 384, origen: "UNIDAD CORONARIA", equipamiento: "TENSIÓMETRO", tipoRegla: "UNICO", unidadesRequeridas: 1 },
          { id: 385, origen: "UNIDAD CORONARIA", equipamiento: "NEBULIZADOR", tipoRegla: "UNICO", unidadesRequeridas: 1 },
          { id: 386, origen: "UNIDAD CORONARIA", equipamiento: "EQUIPO DE ASPIRACIÓN", tipoRegla: "PROPORCIONAL", base: 4, cantidadMinima: 1, unidadesRequeridas: Math.max(1, Math.ceil(cantCamasUCO / 4)) },
          { id: 387, origen: "UNIDAD CORONARIA", equipamiento: "RESPIRADOR MECÁNICO VOLUMÉTRICO", tipoRegla: "PROPORCIONAL", base: 3, cantidadMinima: 1, unidadesRequeridas: Math.max(1, Math.ceil(cantCamasUCO / 3)) },
          { id: 388, origen: "UNIDAD CORONARIA", equipamiento: "EQUIPO DE DESFIBRILACIÓN Y SINCRONIZADOR", tipoRegla: "PROPORCIONAL", base: 4, cantidadMinima: 2, unidadesRequeridas: Math.max(2, Math.ceil(cantCamasUCO / 4)) },
          { id: 389, origen: "UNIDAD CORONARIA", equipamiento: "ELECTROCARDIÓGRAFO", tipoRegla: "PROPORCIONAL", base: 4, cantidadMinima: 2, unidadesRequeridas: Math.max(2, Math.ceil(cantCamasUCO / 4)) },
          { id: 390, origen: "UNIDAD CORONARIA", equipamiento: "MARCAPASO TRANSITORIO CON 2 CATÉTERES", tipoRegla: "PROPORCIONAL", base: 4, cantidadMinima: 2, unidadesRequeridas: Math.max(2, Math.ceil(cantCamasUCO / 4)) },
          { id: 391, origen: "UNIDAD CORONARIA", equipamiento: "BOMBA DE INFUSIÓN", tipoRegla: "PROPORCIONAL", base: 4, cantidadMinima: 2, unidadesRequeridas: Math.max(2, Math.ceil(cantCamasUCO / 4)) },
          { id: 392, origen: "UNIDAD CORONARIA", equipamiento: "OXÍMETRO DE PULSO PORTÁTIL", tipoRegla: "PROPORCIONAL", base: 4, cantidadMinima: 2, unidadesRequeridas: Math.max(2, Math.ceil(cantCamasUCO / 4)) }
        ].map(u => ({ ...u, idFila: `${u.id}-${Math.random()}`, esAdicional: false, requiereMarca: true, requiereModelo: true, requiereSerie: true }));
        const otrosEquipos = iniciales.filter(f => f.origen !== "UNIDAD CORONARIA");
        iniciales = [...otrosEquipos, ...bloqueUCO];
      }
      setFilasTabla(iniciales);
    }
  }, [reglas, selectedServices, infraSelection]);

  // FIX: REVISIÓN DE DATOS REACTIVA A LA CLONACIÓN
  const datosRevisionAgrupados = useMemo(() => {
    // 1. Contamos cuántas veces aparece cada ID de normativa en la tabla actual
    const conteos = filasTabla.reduce((acc, fila) => {
      if (!fila.esAdicional && fila.id) {
        acc[fila.id] = (acc[fila.id] || 0) + 1;
      }
      return acc;
    }, {});

    // 2. Identificamos qué equipos necesitan revisión (los que requieren > 1 unidad)
    const consolidado = {};
    
    // Obtenemos una lista de "maestros" únicos de lo que hay en la tabla
    const maestrosVisibles = filasTabla.filter(f => !f.esAdicional).reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) return acc.concat([current]);
      else return acc;
    }, []);

    maestrosVisibles.forEach(m => {
      // Solo mostramos en el panel si el requerimiento es mayor a 1 
      // o si es proporcional (para que el usuario sepa cuánto cargó de su meta)
      if (m.unidadesRequeridas > 1 || m.tipoRegla === 'PROPORCIONAL') {
        consolidado[m.id] = {
          nombre: m.equipamiento,
          actual: conteos[m.id] || 0,
          total: m.unidadesRequeridas
        };
      }
    });

    return Object.values(consolidado);
  }, [filasTabla]); // Escucha cambios en filasTabla (incluida la clonación)

  const handleClonar = (idFila) => {
    const idxOriginal = filasTabla.findIndex(f => f.idFila === idFila);
    const itemAClonar = filasTabla[idxOriginal];
    const nuevoItem = { ...itemAClonar, idFila: `${itemAClonar.id}-${Math.random()}` };
    const nuevasFilas = [...filasTabla];
    nuevasFilas.splice(idxOriginal + 1, 0, nuevoItem);
    setFilasTabla(nuevasFilas);
  };

  const handleAddExtra = () => {
    setFilasTabla([...filasTabla, { idFila: `extra-${Date.now()}`, origen: '', equipamiento: '', esAdicional: true, requiereMarca: true, requiereModelo: true, requiereSerie: true, unidadesRequeridas: 0 }]);
  };

  const handleBorrarFila = (idFila) => {
    setFilasTabla(filasTabla.filter(f => f.idFila !== idFila));
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', width: '100%' }}>
      <Box sx={{ flex: 1, maxWidth: 'calc(100% - 330px)' }}>
        <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
          <Stack direction="row" spacing={2}>
            <Autocomplete sx={{ flex: 1 }} options={[...new Set(filasTabla.map(r => r.origen))].sort()} value={filtroOrigen} onChange={(e, v) => setFiltroOrigen(v)} renderInput={(params) => <TextField {...params} label="Origen" variant="standard" />} />
            <Autocomplete sx={{ flex: 1 }} options={[...new Set(filasTabla.map(r => r.equipamiento))].sort()} value={filtroEquipamiento} onChange={(e, v) => setFiltroEquipamiento(v)} renderInput={(params) => <TextField {...params} label="Equipamiento" variant="standard" />} />
            <Button variant="contained" startIcon={<SearchIcon />} sx={{ backgroundColor: '#29b6f6' }}>CONSULTAR</Button>
          </Stack>
        </Paper>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{ '& th': { backgroundColor: 'white', borderBottom: '2px solid #005596', color: '#005596', fontWeight: 'bold', py: 2 } }}>
                <TableCell>ORIGEN</TableCell>
                <TableCell>EQUIPO</TableCell>
                <TableCell align="center">NORMATIVA</TableCell>
                <TableCell>MARCA</TableCell>
                <TableCell>MODELO</TableCell>
                <TableCell>SERIE</TableCell>
                <TableCell>MANT.</TableCell>
                <TableCell align="center">ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filasTabla.filter(f => (!filtroOrigen || f.origen === filtroOrigen) && (!filtroEquipamiento || f.equipamiento === filtroEquipamiento)).map((item) => (
                <TableRow key={item.idFila} hover sx={{ bgcolor: item.esAdicional ? '#fafafa' : 'inherit' }}>
                  <TableCell sx={{ fontSize: '0.65rem', color: '#666' }}>{item.esAdicional ? <TextField variant="standard" fullWidth sx={{ '& input': { fontSize: '0.65rem' } }} /> : item.origen}</TableCell>
                  <TableCell sx={{ fontWeight: 500, fontSize: '0.75rem' }}>{item.esAdicional ? <TextField variant="standard" fullWidth sx={{ '& input': { fontSize: '0.75rem' } }} /> : item.equipamiento}</TableCell>
                  <TableCell align="center">
                    {!item.esAdicional ? (
                      <Tooltip title={getTextoNormativo(item)} arrow placement="top">
                        <Box sx={{ display: 'inline-flex', cursor: 'help' }}><Chip label={`REQ: ${item.unidadesRequeridas}`} size="small" variant="outlined" icon={<InfoOutlinedIcon style={{ fontSize: '14px' }} />} sx={{ fontSize: '0.6rem', fontWeight: 'bold', color: '#005596', bgcolor: '#f1faff', pointerEvents: 'none' }} /></Box>
                      </Tooltip>
                    ) : "-"}
                  </TableCell>
                  <TableCell>{item.requiereMarca ? <TextField variant="standard" size="small" fullWidth /> : "-"}</TableCell>
                  <TableCell>{item.requiereModelo ? <TextField variant="standard" size="small" fullWidth /> : "-"}</TableCell>
                  <TableCell>{item.requiereSerie ? <TextField variant="standard" size="small" fullWidth /> : (item.tipoRegla === 'BOOLEANO' ? <Checkbox size="small" /> : "-")}</TableCell>
                  <TableCell><TextField type="date" variant="standard" size="small" InputLabelProps={{ shrink: true }} sx={{ '& input': { fontSize: '0.7rem' } }} /></TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {!item.esAdicional && <IconButton size="small" color="primary" onClick={() => handleClonar(item.idFila)}><ContentCopyIcon sx={{ fontSize: 16 }} /></IconButton>}
                      {(item.esAdicional || filasTabla.filter(f => f.id === item.id).length > 1) && (
                        <IconButton size="small" sx={{ color: '#d32f2f' }} onClick={() => handleBorrarFila(item.idFila)}><CloseIcon sx={{ fontSize: 16 }} /></IconButton>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow><TableCell colSpan={8} sx={{ p: 0 }}><Button fullWidth startIcon={<AddIcon />} onClick={handleAddExtra} sx={{ justifyContent: 'flex-start', color: '#0090d0', fontWeight: 'bold', py: 1.5, px: 2, borderRadius: 0, '&:hover': { bgcolor: '#f0faff' } }}>AGREGAR EQUIPO EXTRA</Button></TableCell></TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* PANEL DE REVISIÓN */}
      <Box sx={{ width: 300, position: 'sticky', top: 20 }}>
        <Paper elevation={0} sx={{ border: '2px solid #005596', borderRadius: '4px' }}>
          <Box sx={{ p: 1.5, backgroundColor: '#005596', color: 'white' }}><Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>REVISIÓN DE DATOS CARGADOS</Typography></Box>
          <Box sx={{ p: 2, maxHeight: '60vh', overflowY: 'auto' }}>
            {datosRevisionAgrupados.length === 0 ? (
              <Typography variant="caption" sx={{ color: '#999', textAlign: 'center', display: 'block' }}>No hay requerimientos múltiples para validar.</Typography>
            ) : datosRevisionAgrupados.map((item, i) => {
              const ok = item.actual >= item.total;
              return (
                <Box key={i} sx={{ p: 1.5, mb: 1, borderRadius: '6px', bgcolor: ok ? '#f1f8e9' : '#f8f9fa', border: '1px solid', borderColor: ok ? '#c8e6c9' : '#eeeeee' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.72rem' }}>{item.nombre}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: ok ? '#2e7d32' : '#757575' }}>{ok ? 'Completo' : `Faltan: ${item.total - item.actual}`}</Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>{item.actual} / {item.total}</Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Equipamientos;