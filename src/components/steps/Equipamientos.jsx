import React, { useState, useEffect, useMemo } from "react";
import {
  Box, Typography, Paper, TextField, Button, IconButton, List,
  ListItemButton, ListItemText, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Collapse, Stack, Autocomplete, Divider, Chip, Tooltip
} from "@mui/material";
import {
  Edit as EditIcon,
  Add as AddIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  LibraryAdd as LibraryAddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const EquipamientosLabV3 = ({
  selectedServices = {},
  infraSelection = {},
  equiposCargados = [],
  setEquiposCargados,
  onValidationChange,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isExtraMode, setIsExtraMode] = useState(false);
  const [requisitosDB, setRequisitosDB] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  const [form, setForm] = useState({
    id: null,
    subId: null,
    origen: "",
    equipamiento: "",
    otroEquipo: "",
    marca: "",
    modelo: "",
    serie: "",
  });

  // 1. Cálculo de Orígenes (Servicios e Infraestructura)
  const serviceNames = useMemo(() => {
    const servicios = Object.keys(selectedServices).filter((k) => !!selectedServices[k]);
    const infra = Object.keys(infraSelection).filter((k) => !!infraSelection[k]);
    return [...new Set([...servicios, ...infra])];
  }, [selectedServices, infraSelection]);

  const listaEquiposUnicos = useMemo(() => {
    const nombres = requisitosDB.map((r) => r.equipamiento);
    return [...new Set(nombres), "OTRO"];
  }, [requisitosDB]);

  // 2. Motor de Revisión
  const datosRevisionAgrupados = useMemo(() => {
    return requisitosDB.map((req) => {
      const cantidadCargada = equiposCargados.filter(
        (c) => c.id === req.id && c.marca?.trim() !== ""
      ).length;
      return {
        id: req.id,
        nombre: req.equipamiento,
        actual: cantidadCargada,
        total: req.cantidadFinalCalculada,
      };
    });
  }, [requisitosDB, equiposCargados]);

  // 3. Efecto para validar contra el botón Siguiente del padre
  useEffect(() => {
    if (datosRevisionAgrupados.length > 0) {
      const todoOk = datosRevisionAgrupados.every((item) => item.actual >= item.total);
      onValidationChange(todoOk);
    } else {
      onValidationChange(false);
    }
  }, [datosRevisionAgrupados, onValidationChange]);

  // 4. Carga de datos desde API (db.json)
  useEffect(() => {
    const fetchEquipamientos = async () => {
      try {
        const res = await fetch("http://localhost:3001/equipamientos");
        const data = await res.json();
        const limpiar = (t) =>
          t ? t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toUpperCase() : "";

        const calculados = data
          .filter((eq) => serviceNames.some((s) => limpiar(s) === limpiar(eq.origen)))
          .map((eq) => {
            const cantidadInfra = parseInt(infraSelection[eq.origen]) || 0;
            let totalNecesario =
              eq.tipoRegla === "PROPORCIONAL"
                ? Math.ceil(cantidadInfra / eq.base) * eq.cantidadMinima
                : eq.cantidadMinima || 1;
            return { ...eq, cantidadFinalCalculada: totalNecesario };
          });
        setRequisitosDB(calculados);
      } catch (err) {
        console.error(err);
      }
    };
    if (serviceNames.length > 0) fetchEquipamientos();
  }, [serviceNames, infraSelection]);

  // --- HANDLERS ---
  const habilitarCargaExtraLibre = () => {
    setForm({ id: `extra-${Date.now()}`, subId: 0, origen: "", equipamiento: "", otroEquipo: "", marca: "", modelo: "", serie: "" });
    setIsExtraMode(true);
    setIsEditing(true);
  };

  const prepararCarga = (req, subIndex, esExtra = false) => {
    const previo = equiposCargados.find((c) => c.id === req.id && c.subId === subIndex) || {};
    setForm({
      id: req.id,
      subId: subIndex,
      origen: req.origen,
      equipamiento: req.equipamiento,
      marca: previo.marca || "",
      modelo: previo.modelo || "",
      serie: previo.serie || "",
    });
    setIsEditing(true);
    setIsExtraMode(esExtra);
  };

  const handleActualizar = () => {
    const nombreFinal = form.equipamiento === "OTRO" ? form.otroEquipo : form.equipamiento;
    if (!form.origen || !nombreFinal || !form.marca) {
      alert("Faltan campos obligatorios");
      return;
    }
    setEquiposCargados((prev) => {
      const sinEste = prev.filter((c) => !(c.id === form.id && c.subId === form.subId));
      return [...sinEste, { ...form, equipamiento: nombreFinal, isExtra: isExtraMode }];
    });
    setForm({ id: null, subId: null, origen: "", equipamiento: "", otroEquipo: "", marca: "", modelo: "", serie: "" });
    setIsEditing(false);
    setIsExtraMode(false);
  };

  const handleLimpiarFila = (id, subId) => {
    setEquiposCargados((prev) =>
      prev.map((c) => (c.id === id && c.subId === subId ? { ...c, marca: "", modelo: "", serie: "" } : c))
    );
  };

  const itemsDelServicio = useMemo(() => {
    const origenSel = serviceNames[activeIdx];
    const obligatorios = requisitosDB.filter((r) => r.origen === origenSel);
    const extras = equiposCargados.filter((c) => c.origen === origenSel && c.isExtra);
    const extrasAgrupados = extras.reduce((acc, curr) => {
      if (!acc[curr.equipamiento])
        acc[curr.equipamiento] = { id: curr.id, equipamiento: curr.equipamiento, cantidadFinalCalculada: 0, isExtra: true };
      return acc;
    }, {});
    return [...obligatorios, ...Object.values(extrasAgrupados)];
  }, [requisitosDB, serviceNames, activeIdx, equiposCargados]);

  return (
    <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#25ade6", mb: 1 }}>
        EQUIPAMIENTOS
      </Typography>

      {/* FORMULARIO SUPERIOR */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mb: 1,
          borderRadius: "8px",
          border: isExtraMode ? "2px solid #005596" : "1px solid #e2e8f0",
          transition: "all 0.2s ease-in-out"
        }}
      >
        <Stack direction="column" spacing={2}>
          <Stack direction="row" spacing={2} alignItems="flex-end">
            <Autocomplete sx={{ flex: 1.2 }} options={serviceNames} disabled={!isExtraMode} value={form.origen || null}
              onChange={(e, v) => setForm({ ...form, origen: v })} renderInput={(params) => <TextField {...params} label="Origen" variant="standard" />} />
            
            <Autocomplete sx={{ flex: 1.2 }} options={listaEquiposUnicos} disabled={!isExtraMode} value={form.equipamiento || null}
              onChange={(e, v) => setForm({ ...form, equipamiento: v, otroEquipo: "" })} renderInput={(params) => <TextField {...params} label="Tipo Equipo" variant="standard" />} />
            
            {form.equipamiento === "OTRO" ? (
              <TextField label="Nombre Equipo" variant="standard" sx={{ flex: 1.2 }} value={form.otroEquipo} onChange={(e) => setForm({ ...form, otroEquipo: e.target.value.toUpperCase() })} autoFocus />
            ) : <Box sx={{ flex: 1.2 }} />}
            <Box sx={{ minWidth: "64px" }} />
          </Stack>

          <Stack direction="row" spacing={2} alignItems="flex-end">
            <TextField label="Marca" variant="standard" value={form.marca} sx={{ flex: 1.2 }} onChange={(e) => setForm({ ...form, marca: e.target.value.toUpperCase() })} />
            <TextField label="Modelo" variant="standard" value={form.modelo} sx={{ flex: 1.2 }} onChange={(e) => setForm({ ...form, modelo: e.target.value.toUpperCase() })} />
            <TextField label="Serie" variant="standard" value={form.serie} sx={{ flex: 1.2 }} onChange={(e) => setForm({ ...form, serie: e.target.value.toUpperCase() })} />
            <Button variant="contained" disabled={!isEditing} onClick={handleActualizar} sx={{ bgcolor: "#005596", fontWeight: "bold", px: 3, height: "32px" }}> + </Button>
          </Stack>
        </Stack>
      </Paper>

      <Box sx={{ display: "flex", gap: 2 }}>
        {/* PANEL LATERAL */}
        <Paper variant="outlined" sx={{ width: 280, height: "60vh", display: "flex", flexDirection: "column" }}>
          <Box sx={{ p: 1 }}>
            <Button fullWidth variant="outlined" startIcon={<LibraryAddIcon />} onClick={habilitarCargaExtraLibre}>AGREGAR EQUIPO EXTRA</Button>
          </Box>
          <Divider />
          <List dense sx={{ flex: 1, overflow: "auto" }}>
            <Typography variant="caption" sx={{ px: 2, pt: 1, pb: 0, fontWeight: "bold", color: "#475569" }}>ORIGENES DECLARADOS</Typography>
            {serviceNames.map((s, i) => (
              <ListItemButton key={s} selected={activeIdx === i} onClick={() => { setActiveIdx(i); setIsExtraMode(false); }}
                sx={{ "&.Mui-selected": { bgcolor: "#e3f2fd", color: "#005596", borderRight: "4px solid #005596" } }}>
                <ListItemText primary={s} primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: 700 }} />
              </ListItemButton>
            ))}
          </List>
        </Paper>

        {/* TABLA CENTRAL */}
        <TableContainer component={Paper} variant="outlined" sx={{ flex: 1, height: "60vh" }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{ "& th": { bgcolor: "#00386f", color: "white", fontWeight: "bold" } }}>
                <TableCell>Equipo Requerido</TableCell>
                <TableCell align="center">Obligatorio</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {itemsDelServicio.map((req) => (
                <React.Fragment key={req.id}>
                  <TableRow hover onClick={() => setExpandedRow(expandedRow === req.id ? null : req.id)} sx={{ cursor: "pointer" }}>
                    <TableCell sx={{ fontWeight: 700 }}>{req.equipamiento} {req.isExtra && <Chip label="extra" size="small" color="info" sx={{ ml: 1, height: 18 }} />}</TableCell>
                    <TableCell align="center">{req.cantidadFinalCalculada}</TableCell>
                    <TableCell align="right"><IconButton size="small">{expandedRow === req.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</IconButton></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} sx={{ p: 0 }}>
                      <Collapse in={expandedRow === req.id}>
                        <Box sx={{ p: 2, bgcolor: "#f1f5f9" }}>
                          <Table size="small" sx={{ bgcolor: "white", border: "1px solid #cbd5e1" }}>
                            <TableHead sx={{ bgcolor: "#e2e8f0" }}>
                              <TableRow sx={{ "& th": { fontWeight: "bold", fontSize: "0.75rem" } }}>
                                <TableCell>UNIDAD / EQUIPO</TableCell><TableCell>MARCA</TableCell><TableCell>MODELO</TableCell><TableCell>SERIE</TableCell><TableCell align="center">ACCIONES</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {equiposCargados.filter(c => c.id === req.id && c.origen === serviceNames[activeIdx]).map((unit, uIdx) => (
                                <TableRow key={uIdx} sx={{ bgcolor: "#f0fdf4" }}>
                                  <TableCell sx={{ fontSize: "0.8rem", fontWeight: 600 }}>{unit.isExtra ? unit.equipamiento : `#${unit.subId + 1}`}</TableCell>
                                  <TableCell sx={{ fontSize: "0.8rem" }}>{unit.marca}</TableCell><TableCell sx={{ fontSize: "0.8rem" }}>{unit.modelo}</TableCell><TableCell sx={{ fontSize: "0.8rem" }}>{unit.serie}</TableCell>
                                  <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                      <Tooltip title="Editar"><IconButton size="small" onClick={() => prepararCarga(req, unit.subId, unit.isExtra)}><EditIcon fontSize="small" color="primary" /></IconButton></Tooltip>
                                      {unit.isExtra ? (
                                        <Tooltip title="Eliminar"><IconButton size="small" onClick={() => setEquiposCargados(prev => prev.filter(c => !(c.id === unit.id && c.subId === unit.subId)))}><CloseIcon fontSize="small" sx={{ color: "#d32f2f" }} /></IconButton></Tooltip>
                                      ) : (
                                        <Tooltip title="Limpiar"><IconButton size="small" onClick={() => handleLimpiarFila(unit.id, unit.subId)}><DeleteIcon fontSize="small" color="action" /></IconButton></Tooltip>
                                      )}
                                    </Stack>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {!req.isExtra && Array.from({ length: Math.max(0, req.cantidadFinalCalculada - equiposCargados.filter(c => c.id === req.id && c.origen === serviceNames[activeIdx]).length) }).map((_, idx) => (
                                <TableRow key={idx}><TableCell sx={{ color: "#94a3b8", fontSize: "0.8rem" }}>Unidad pendiente</TableCell><TableCell colSpan={3} />
                                  <TableCell align="center">
                                    <Tooltip title="Cargar"><IconButton size="small" onClick={() => prepararCarga(req, (equiposCargados.filter(c => c.id === req.id).length || 0) + idx, false)}><AddIcon fontSize="small" color="success" /></IconButton></Tooltip>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PANEL DE REVISIÓN */}
        <Box sx={{ width: 280 }}>
          <Paper variant="outlined" sx={{ border: "2px solid #00386f", height: "60vh", display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 1, bgcolor: "#00386f", color: "white", textAlign: "center", fontWeight: "bold" }}>REVISIÓN</Box>
            <Box sx={{ p: 1, flex: 1, overflowY: "auto" }}>
              {datosRevisionAgrupados.map((item, i) => {
                const completado = item.actual >= item.total;
                return (
                  <Box key={i} sx={{ p: 1, mb: 1, borderRadius: "6px", bgcolor: completado ? "#f0fdf4" : "#fff", border: "1px solid #e2e8f0" }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, display: "block" }}>{item.nombre}</Typography>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" sx={{ fontWeight: "bold", color: completado ? "#16a34a" : "#dc2626" }}>
                        {completado ? "COMPLETO" : `FALTA: ${item.total - item.actual}`}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: "bold", color: "#475569" }}>{item.actual}/{item.total}</Typography>
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default EquipamientosLabV3;