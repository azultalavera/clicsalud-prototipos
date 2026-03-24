import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Modal,
  TextField,
  Stack,
  IconButton,
  Autocomplete,
  Chip,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import Layout from "./Layout";

// --- CONSTANTES ---
const opcionesTipologia = ["CLÍNICAS, SANATORIOS Y HOSPITALES", "GERIÁTRICOS"];

const categoriasMapper = [
  { label: "SERVICIO", id: "SERVICIO" },
  { label: "SERVICIO COMPLEMENTARIO", id: "COMPLEMENTARIO" },
  { label: "SERVICIO CON INTERNACION", id: "INTERNACION" },
  { label: "SALAS", id: "SALA" },
  { label: "CAMAS", id: "CAMA" },
];

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 750,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "4px",
  overflow: "hidden",
};

const Infraestructura = () => {
  const [data, setData] = useState([]);
  const [listaMaestraOrigenes, setListaMaestraOrigenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ESTADOS DE FILTROS
  const [filtroTipologia, setFiltroTipologia] = useState(null);
  const [filtroTipoOrigen, setFiltroTipoOrigen] = useState(null);
  const [filtroOrigen, setFiltroOrigen] = useState(null);
  const [filtroTipoInfra, setFiltroTipoInfra] = useState(null);
  const [filtroRequerida, setFiltroRequerida] = useState(null);

  const [currentItem, setCurrentItem] = useState({
    tipologia: null,
    origen: "",
    tipo: null,
    requerida: "",
    tipoInfra: null,
    minimo: "",
  });

  const cargarTodo = async () => {
    setLoading(true);
    try {
      const [resInfra, resOrigenes] = await Promise.all([
        fetch("http://localhost:3001/infraestructura"),
        fetch("http://localhost:3001/origenes"),
      ]);
      const jsonInfra = await resInfra.json();
      const jsonOrigenes = await resOrigenes.json();
      setData(jsonInfra);
      setListaMaestraOrigenes(jsonOrigenes);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  // --- LÓGICA DE LISTADOS DINÁMICOS (PARA FILTROS Y MODAL) ---
  // Lógica para obtener el listado de nombres según la categoría elegida
  const getOrigenesPorTipo = (tipoLabel) => {
    // Si no hay lista maestra aún, devolvemos vacío
    if (!listaMaestraOrigenes || listaMaestraOrigenes.length === 0) return [];

    // Si no hay tipo seleccionado, devolvemos todos los nombres únicos disponibles
    if (!tipoLabel) {
      return [...new Set(listaMaestraOrigenes.map((o) => o.nombre))].sort();
    }

    // Buscamos el ID de la categoría (ej: "SALA") para el label seleccionado (ej: "SALAS")
    const catId = categoriasMapper.find((c) => c.label === tipoLabel)?.id;

    // Filtramos y devolvemos solo los nombres
    return listaMaestraOrigenes
      .filter((o) => o.categoriaId === catId)
      .map((o) => o.nombre)
      .sort();
  };

  const listadoOrigenesFiltro = useMemo(
    () => getOrigenesPorTipo(filtroTipoOrigen),
    [listaMaestraOrigenes, filtroTipoOrigen],
  );
  const listadoRequeridaFiltro = useMemo(
    () => getOrigenesPorTipo(filtroTipoInfra),
    [listaMaestraOrigenes, filtroTipoInfra],
  );

  const listadoOrigenesModal = useMemo(
    () => getOrigenesPorTipo(currentItem.tipo),
    [listaMaestraOrigenes, currentItem.tipo],
  );
  const listadoRequeridaModal = useMemo(
    () => getOrigenesPorTipo(currentItem.tipoInfra),
    [listaMaestraOrigenes, currentItem.tipoInfra],
  );

  const dataFiltrada = useMemo(() => {
    return data.filter((item) => {
      return (
        (!filtroTipologia || item.tipologia === filtroTipologia) &&
        (!filtroOrigen || item.origen === filtroOrigen) &&
        (!filtroRequerida || item.requerida === filtroRequerida) &&
        (!filtroTipoOrigen ||
          item.tipo?.toUpperCase() === filtroTipoOrigen?.toUpperCase()) &&
        (!filtroTipoInfra ||
          item.tipoInfra?.toUpperCase() === filtroTipoInfra?.toUpperCase())
      );
    });
  }, [
    data,
    filtroTipologia,
    filtroOrigen,
    filtroRequerida,
    filtroTipoOrigen,
    filtroTipoInfra,
  ]);

  const handleGuardar = async () => {
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:3001/infraestructura/${currentItem.id}`
      : "http://localhost:3001/infraestructura";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...currentItem,
        origen: currentItem.origen?.toUpperCase(),
        requerida: currentItem.requerida?.toUpperCase(),
      }),
    });
    setOpen(false);
    cargarTodo();
  };

  return (
    <Layout>
      <Paper
        elevation={0}
        sx={{
          borderRadius: "4px",
          border: "1px solid #e0e0e0",
          overflow: "hidden",
          mb: 8,
          mx: "auto",
          maxWidth: "1750px",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#005596",
            color: "white",
            py: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            Gestión de Infraestructura
          </Typography>
        </Box>

        <Box sx={{ p: 4, backgroundColor: "white" }}>
          {/* SECCIÓN FILTROS REORGANIZADA */}
          <Paper
            variant="outlined"
            sx={{ p: 3, mb: 4, borderRadius: "4px", borderColor: "#e0e0e0" }}
          >
            <Typography
              variant="h6"
              sx={{ color: "#0090d0", mb: 3, fontWeight: "bold" }}
            >
              Filtros de configuración
            </Typography>

            <Stack spacing={2}>
              {/* FILA 1: TIPOLOGIA */}
              <Autocomplete
                options={opcionesTipologia}
                value={filtroTipologia}
                onChange={(e, v) => setFiltroTipologia(v)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tipología"
                    variant="standard"
                    sx={{ maxWidth: "50%" }}
                  />
                )}
              />

              {/* FILA 2: TIPO ORIGEN + ORIGEN */}
              <Stack direction="row" spacing={4}>
                <Autocomplete
                  sx={{ flex: 1 }}
                  options={categoriasMapper.map((c) => c.label)}
                  value={filtroTipoOrigen}
                  onChange={(e, v) => {
                    setFiltroTipoOrigen(v);
                    setFiltroOrigen(null); // Reseteamos el hijo al cambiar el padre
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tipo de Origen"
                      variant="standard"
                    />
                  )}
                />
                <Autocomplete
                  sx={{ flex: 2 }}
                  options={listadoOrigenesFiltro}
                  value={filtroOrigen || null}
                  onChange={(e, v) => setFiltroOrigen(v)}
                  // Importante: si no hay opciones, avisamos al usuario
                  noOptionsText={
                    filtroTipoOrigen
                      ? "No hay orígenes para esta categoría"
                      : "Cargando..."
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Origen" variant="standard" />
                  )}
                />
              </Stack>

              {/* FILA 3: TIPO INFRA + INFRA REQUERIDA */}
              <Stack direction="row" spacing={4}>
                <Autocomplete
                  sx={{ flex: 1 }}
                  options={categoriasMapper.map((c) => c.label)}
                  value={filtroTipoInfra}
                  onChange={(e, v) => {
                    setFiltroTipoInfra(v);
                    setFiltroRequerida(null); // Reseteamos el hijo
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tipo de Infraestructura"
                      variant="standard"
                    />
                  )}
                />
                <Autocomplete
                  sx={{ flex: 2 }}
                  options={listadoRequeridaFiltro}
                  value={filtroRequerida || null}
                  onChange={(e, v) => setFiltroRequerida(v)}
                  noOptionsText={
                    filtroTipoInfra
                      ? "No hay registros para esta categoría"
                      : "Cargando..."
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Infraestructura Requerida"
                      variant="standard"
                    />
                  )}
                />
              </Stack>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 1,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    setFiltroTipologia(null);
                    setFiltroTipoOrigen(null);
                    setFiltroOrigen(null);
                    setFiltroTipoInfra(null);
                    setFiltroRequerida(null);
                  }}
                  sx={{
                    color: "#29b6f6",
                    borderColor: "#29b6f6",
                    px: 4,
                    fontWeight: "bold",
                  }}
                >
                  LIMPIAR
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  sx={{ backgroundColor: "#29b6f6", px: 4, fontWeight: "bold" }}
                >
                  CONSULTAR
                </Button>
              </Box>
            </Stack>
          </Paper>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setCurrentItem({
                  tipologia: null,
                  origen: "",
                  tipo: null,
                  requerida: "",
                  tipoInfra: null,
                  minimo: "",
                });
                setIsEditing(false);
                setOpen(true);
              }}
              sx={{ backgroundColor: "#29b6f6", fontWeight: "bold" }}
            >
              AGREGAR REGLA
            </Button>
          </Box>

          <TableContainer>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      backgroundColor: "white",
                      borderBottom: "2px solid #005596",
                      color: "#005596",
                      fontWeight: "bold",
                      py: 2,
                    },
                  }}
                >
                  <TableCell>TIPOLOGÍA</TableCell>
                  <TableCell>ORIGEN</TableCell>
                  <TableCell>INFRAESTRUCTURA REQUERIDA</TableCell>
                  <TableCell align="center">MÍNIMO</TableCell>
                  <TableCell align="center">ACCIONES</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataFiltrada.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontSize: "0.75rem" }}>
                      {row.tipologia}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {row.origen}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {row.tipo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{row.requerida}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {row.tipoInfra}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      {row.minimo}
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <IconButton
                          onClick={() => {
                            setCurrentItem(row);
                            setIsEditing(true);
                            setOpen(true);
                          }}
                          color="primary"
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            if (window.confirm("¿Eliminar?"))
                              fetch(
                                `http://localhost:3001/infraestructura/${row.id}`,
                                { method: "DELETE" },
                              ).then(() => cargarTodo());
                          }}
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
        </Box>
      </Paper>

      {/* MODAL (MISMA ESTRUCTURA QUE FILTROS) */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={styleModal}>
          <Box
            sx={{
              bgcolor: "#005596",
              color: "white",
              p: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {isEditing ? "EDITAR CONFIGURACIÓN" : "NUEVA CONFIGURACIÓN"}
            </Typography>
          </Box>
          <Box sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Autocomplete
                options={opcionesTipologia}
                value={currentItem.tipologia}
                onChange={(e, v) =>
                  setCurrentItem({ ...currentItem, tipologia: v })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="TIPOLOGÍA"
                    variant="standard"
                    fullWidth
                  />
                )}
              />
              <Stack direction="row" spacing={2}>
                <Autocomplete
                  sx={{ flex: 1 }}
                  options={categoriasMapper.map((c) => c.label)}
                  value={currentItem.tipo}
                  onChange={(e, v) =>
                    setCurrentItem({ ...currentItem, tipo: v, origen: "" })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="TIPO DE ORIGEN"
                      variant="standard"
                    />
                  )}
                />
                <Autocomplete
                  sx={{ flex: 2 }}
                  freeSolo
                  forcePopupIcon
                  options={listadoOrigenesModal}
                  value={currentItem.origen}
                  onInputChange={(e, v) =>
                    setCurrentItem({ ...currentItem, origen: v.toUpperCase() })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="ORIGEN"
                      variant="standard"
                      placeholder="Seleccione..."
                    />
                  )}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <Autocomplete
                  sx={{ flex: 1 }}
                  options={categoriasMapper.map((c) => c.label)}
                  value={currentItem.tipoInfra}
                  onChange={(e, v) =>
                    setCurrentItem({
                      ...currentItem,
                      tipoInfra: v,
                      requerida: "",
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="TIPO DE INFRAESTRUCTURA"
                      variant="standard"
                    />
                  )}
                />
                <Autocomplete
                  sx={{ flex: 2 }}
                  freeSolo
                  forcePopupIcon
                  options={listadoRequeridaModal}
                  value={currentItem.requerida}
                  onInputChange={(e, v) =>
                    setCurrentItem({
                      ...currentItem,
                      requerida: v.toUpperCase(),
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="INFRAESTRUCTURA REQUERIDA"
                      variant="standard"
                      placeholder="Seleccione..."
                    />
                  )}
                />
              </Stack>
              <TextField
                label="MÍNIMO"
                type="number"
                variant="standard"
                sx={{ width: "30%" }}
                value={currentItem.minimo}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, minimo: e.target.value })
                }
              />
            </Stack>
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 5 }}
            >
              <Button
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => setOpen(false)}
              >
                CANCELAR
              </Button>
              <Button
                variant="contained"
                startIcon={<CheckIcon />}
                onClick={handleGuardar}
                sx={{ bgcolor: "#005596" }}
              >
                {isEditing ? "ACTUALIZAR" : "AGREGAR"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Layout>
  );
};

export default Infraestructura;
