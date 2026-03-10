import React, { useState, useEffect, useMemo } from "react";
import {
  Box, Typography, Paper, TextField, Button, IconButton, List,
  ListItemButton, ListItemText, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Collapse, Stack, Autocomplete, Divider
} from "@mui/material";
import {
  Edit as EditIcon,
  Add as AddIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  LibraryAdd as LibraryAddIcon 
} from "@mui/icons-material";

const EquipamientosLabV3 = ({ selectedServices, infraSelection }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isExtraMode, setIsExtraMode] = useState(false);
  const [requisitosDB, setRequisitosDB] = useState([]);
  const [cargados, setCargados] = useState([]);
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

  const serviceNames = useMemo(() => {
    const servicios = Object.keys(selectedServices || {}).filter((key) => !!selectedServices[key]);
    const infra = Object.keys(infraSelection || {}).filter((key) => !!infraSelection[key]);
    return [...new Set([...servicios, ...infra])];
  }, [selectedServices, infraSelection]);

  const listaEquiposUnicos = useMemo(() => {
    const nombres = requisitosDB.map(r => r.equipamiento);
    return [...new Set(nombres), "OTRO"];
  }, [requisitosDB]);

  useEffect(() => {
    const fetchEquipamientos = async () => {
      try {
        const res = await fetch("http://localhost:3001/equipamientos");
        const data = await res.json();
        const limpiar = (t) => t ? t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toUpperCase() : "";

        const calculados = data
          .filter((eq) => serviceNames.some((s) => limpiar(s) === limpiar(eq.origen)))
          .map((eq) => {
            const cantidadInfra = parseInt(infraSelection[eq.origen]) || 0;
            let totalNecesario = eq.tipoRegla === "PROPORCIONAL"
                ? Math.ceil(cantidadInfra / eq.base) * eq.cantidadMinima
                : eq.cantidadMinima || 1;
            return { ...eq, cantidadFinalCalculada: totalNecesario };
          });
        setRequisitosDB(calculados);
      } catch (err) { console.error(err); }
    };
    if (serviceNames.length > 0) fetchEquipamientos();
  }, [serviceNames, infraSelection]);

  const datosRevisionAgrupados = useMemo(() => {
    return requisitosDB.map((req) => {
      const cantidadCargada = cargados.filter((c) => c.id === req.id && c.marca.trim() !== "").length;
      return {
        id: req.id,
        nombre: req.equipamiento,
        actual: cantidadCargada,
        total: req.cantidadFinalCalculada,
      };
    });
  }, [requisitosDB, cargados]);

  const prepararCarga = (req, subIndex, esExtra = false) => {
    const previo = cargados.find((c) => c.id === req.id && c.subId === subIndex) || {};
    setForm({
      id: req.id,
      subId: subIndex,
      origen: req.origen,
      equipamiento: `${req.equipamiento} ${esExtra ? "(Extra)" : `(Unid. ${subIndex + 1})`}`,
      marca: previo.marca || "",
      modelo: previo.modelo || "",
      serie: previo.serie || "",
    });
    setIsEditing(true);
    setIsExtraMode(false);
  };

  const habilitarCargaExtraLibre = () => {
    setForm({
      id: `extra-${Date.now()}`,
      subId: 0,
      origen: "",
      equipamiento: "",
      otroEquipo: "",
      marca: "",
      modelo: "",
      serie: "",
    });
    setIsExtraMode(true);
    setIsEditing(true);
  };

  const handleActualizar = () => {
    const nombreEquipoFinal = form.equipamiento === "OTRO" ? form.otroEquipo : form.equipamiento;
    if (!form.origen || !nombreEquipoFinal || !form.marca) {
        alert("Complete los campos obligatorios (Origen, Equipo y Marca)");
        return;
    }
    setCargados((prev) => {
      const sinEsteSlot = prev.filter((c) => !(c.id === form.id && c.subId === form.subId));
      return [...sinEsteSlot, { ...form, equipamiento: nombreEquipoFinal }];
    });
    setForm({ id: null, subId: null, origen: "", equipamiento: "", otroEquipo: "", marca: "", modelo: "", serie: "" });
    setIsEditing(false);
    setIsExtraMode(false);
  };

  const itemsDelServicio = requisitosDB.filter((r) => r.origen === serviceNames[activeIdx]);

  return (
    <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#25ade6' }}>EQUIPAMIENTOS</Typography>
      
      {/* FORMULARIO SUPERIOR */}
      <Paper variant="outlined" sx={{ p: 2, mb: 1, borderRadius: "8px", bgcolor: isExtraMode ? "#ffffff" : "#fff", border: isExtraMode ? "2px solid #c2edff" : "1px solid #c2edff" }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', width: '100%' }}>
            <Autocomplete
              sx={{ flex: 1.5 }}
              options={serviceNames}
              disabled={!isExtraMode}
              value={form.origen || null}
              onChange={(e, v) => setForm({...form, origen: v})}
              renderInput={(params) => <TextField {...params} label="Origen" variant="standard" />}
            />
            <Autocomplete
              sx={{ flex: 2 }}
              options={listaEquiposUnicos}
              disabled={!isExtraMode}
              value={form.equipamiento || null}
              onChange={(e, v) => setForm({...form, equipamiento: v, otroEquipo: ""})}
              renderInput={(params) => <TextField {...params} label="Tipo Equipo" variant="standard" />}
            />
            {form.equipamiento?.includes("OTRO") && (
              <TextField 
                label="Nombre Equipo" 
                variant="standard" 
                sx={{ flex: 2 }}
                value={form.otroEquipo}
                onChange={(e) => setForm({...form, otroEquipo: e.target.value.toUpperCase()})}
                autoFocus
              />
            )}
            <TextField label="Marca" variant="standard" value={form.marca} sx={{ flex: 1.5 }}
              onChange={(e) => setForm({ ...form, marca: e.target.value.toUpperCase() })} />
            <TextField label="Modelo" variant="standard" value={form.modelo} sx={{ flex: 1.5 }}
              onChange={(e) => setForm({ ...form, modelo: e.target.value.toUpperCase() })} />
            <TextField label="N° Serie" variant="standard" value={form.serie} sx={{ flex: 1.5 }}
              onChange={(e) => setForm({ ...form, serie: e.target.value.toUpperCase() })} />
            <Button variant="contained" disabled={!isEditing} onClick={handleActualizar}
              sx={{ bgcolor: "#005596", height: "36px", fontWeight: "bold", px: 4 }}>AGREGAR EQUIPO</Button>
          </Box>
        </Stack>
      </Paper>

      <Box sx={{ display: "flex", gap: 2 }}>
        {/* LISTA IZQUIERDA */}
        <Paper variant="outlined" sx={{ width: 280, borderRadius: "8px", height: "65vh", display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 1 }}>
            <Button fullWidth variant="outlined" startIcon={<LibraryAddIcon />} onClick={habilitarCargaExtraLibre}
              sx={{ color: '#005596', borderColor: '#005596', fontWeight: 'bold' }}>AGREGAR EQUIPO EXTRA</Button>
          </Box>
          <Box sx={{ flex: 1, overflow: "auto" }}>
            <List dense>
              <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', fontWeight: 'bold', color: '#64748b' }}>SERVICIOS DECLARADOS</Typography>
              {serviceNames.map((s, i) => (
                <ListItemButton key={s} selected={activeIdx === i && !isExtraMode} onClick={() => { setActiveIdx(i); setIsExtraMode(false); }}>
                  <ListItemText primary={s} secondary={infraSelection[s] ? `${infraSelection[s]} unidades` : ""}
                    primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: 700 }} />
                </ListItemButton>
              ))}
            </List>
          </Box>
          <Divider />
          
        </Paper>

        {/* TABLA CENTRAL EXPANDIBLE */}
        <TableContainer component={Paper} variant="outlined" sx={{ flex: 1, borderRadius: "8px", height: "65vh" }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{ "& th": { bgcolor: "#00386f", fontSize: "0.85rem", fontWeight: 800, color: "#ffffff", py: 1 } }}>
                <TableCell>Equipo Requerido</TableCell>
                <TableCell align="center">Obligatorio</TableCell>
                <TableCell align="right" width="60px" />
              </TableRow>
            </TableHead>
            <TableBody>
              {itemsDelServicio.map((req) => (
                <React.Fragment key={req.id}>
                  <TableRow hover onClick={() => setExpandedRow(expandedRow === req.id ? null : req.id)}
                    sx={{ cursor: "pointer", "& td": { py: 0.8 } }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.9rem" }}>{req.equipamiento}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800, fontSize: "0.95rem" }}>{req.cantidadFinalCalculada}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small">
                        {expandedRow === req.id ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} style={{ padding: 0 }}>
                      <Collapse in={expandedRow === req.id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 1.5, bgcolor: "#f8fafc" }}>
                          <Table size="small" sx={{ bgcolor: "white", border: "1px solid #e2e8f0" }}>
                            <TableHead>
                              <TableRow sx={{ bgcolor: "#f1f5f9", "& th": { py: 0.5, fontSize: "0.75rem", fontWeight: "bold", color: "#64748b" } }}>
                                <TableCell>UNIDAD</TableCell><TableCell>MARCA</TableCell><TableCell>MODELO</TableCell><TableCell>SERIE</TableCell><TableCell align="center">ACCIONES</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {(() => {
                                const entries = [];
                                for (let i = 0; i < req.cantidadFinalCalculada; i++) entries.push({ idx: i, extra: false });
                                cargados.filter(c => c.id === req.id && c.subId >= req.cantidadFinalCalculada)
                                       .forEach(c => entries.push({ idx: c.subId, extra: true }));
                                return entries.map((entry) => {
                                  const itemCargado = cargados.find(c => c.id === req.id && c.subId === entry.idx);
                                  const isFull = !!itemCargado?.marca;
                                  return (
                                    <TableRow key={entry.idx} sx={{ bgcolor: isFull ? "#f0fdf4" : "transparent", "& td": { py: 0.4 } }}>
                                      <TableCell sx={{ fontSize: "0.8rem", fontWeight: 600 }}>{entry.extra ? "(EXTRA)" : `#${entry.idx + 1}`}</TableCell>
                                      <TableCell sx={{ fontSize: "0.8rem" }}>{itemCargado?.marca || "-"}</TableCell>
                                      <TableCell sx={{ fontSize: "0.8rem" }}>{itemCargado?.modelo || "-"}</TableCell>
                                      <TableCell sx={{ fontSize: "0.8rem" }}>{itemCargado?.serie || "-"}</TableCell>
                                      <TableCell align="center">
                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); prepararCarga(req, entry.idx, entry.extra); }} sx={{ p: 0.2 }}>
                                          {isFull ? <EditIcon sx={{ fontSize: "1rem", color: "#005596" }} /> : <AddIcon sx={{ fontSize: "1rem", color: "#16a34a" }} />}
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  );
                                });
                              })()}
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
        <Box sx={{ width: 300 }}>
          <Paper variant="outlined" sx={{ border: "2px solid #005596", borderRadius: "8px", height: "65vh", display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 1.2, bgcolor: "#005596", color: "white" }}><Typography variant="body2" fontWeight="bold" textAlign="center">REVISIÓN</Typography></Box>
            <Box sx={{ p: 1.5, flex: 1, overflowY: "auto" }}>
              {datosRevisionAgrupados.map((item, i) => {
                const ok = item.actual >= item.total;
                return (
                  <Box key={i} sx={{ p: 1, mb: 1, borderRadius: "6px", bgcolor: ok ? "#f0fdf4" : "#fff", border: "1px solid", borderColor: ok ? "#bbf7d0" : "#e2e8f0" }}>
                    <Typography variant="body2" sx={{ fontWeight: 800, fontSize: "0.78rem", lineHeight: 1.2 }}>{item.nombre}</Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                      <Typography sx={{ fontSize: "0.7rem", color: ok ? "#16a34a" : "#dc2626", fontWeight: "bold" }}>{ok ? "COMPLETO" : `FALTA: ${item.total - item.actual}`}</Typography>
                      <Typography sx={{ fontSize: "0.7rem", fontWeight: "bold", color: "#475569" }}>{item.actual}/{item.total}</Typography>
                    </Box>
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