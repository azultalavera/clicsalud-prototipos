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
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Autocomplete,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import Layout from "./Layout";

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

const EquipamientosConfig = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // OPCIONES PARA EL MULTISELECT DE TRAZABILIDAD
  const opcionesTrazabilidad = [
    { label: "SÓLO EXISTENCIA", value: "soloExistencia" },
    { label: "MARCA", value: "requiereMarca" },
    { label: "MODELO", value: "requiereModelo" },
    { label: "SERIE", value: "requiereSerie" },
  ];

  const opcionesRegla = ["UNICO", "LINEAL", "PROPORCIONAL"];

  // FILTROS
  const [filtroTipologia, setFiltroTipologia] = useState(null);
  const [filtroOrigen, setFiltroOrigen] = useState(null);
  const [filtroEquipamiento, setFiltroEquipamiento] = useState(null);
  const [filtroRegla, setFiltroRegla] = useState(null);

  const [currentItem, setCurrentItem] = useState({
    tipologia: "",
    origen: "",
    tipo: "SERVICIO",
    equipamiento: "",
    tipoRegla: "UNICO",
    base: 1,
    cantidadMinima: 1,
    requiereMarca: true,
    requiereModelo: true,
    requiereSerie: true,
    soloExistencia: false,
  });

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/equipamientos");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const dataFiltrada = useMemo(() => {
    return data.filter((item) => {
      return (
        (!filtroTipologia || item.tipologia === filtroTipologia) &&
        (!filtroOrigen || item.origen === filtroOrigen) &&
        (!filtroEquipamiento || item.equipamiento === filtroEquipamiento) &&
        (!filtroRegla || item.tipoRegla === filtroRegla)
      );
    });
  }, [data, filtroTipologia, filtroOrigen, filtroEquipamiento, filtroRegla]);

  const formatTrazabilidad = (row) => {
    if (row.soloExistencia) return "SÓLO EXISTENCIA";
    const m1 = row.requiereMarca ? "M" : "-";
    const m2 = row.requiereModelo ? "M" : "-";
    const s = row.requiereSerie ? "S" : "-";
    return `${m1}/${m2}/${s}`;
  };

  const handleBorrar = async (id) => {
    if (!window.confirm("¿Eliminar este registro?")) return;
    try {
      await fetch(`http://localhost:3001/equipamientos/${id}`, {
        method: "DELETE",
      });
      cargarDatos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGuardar = async () => {
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:3001/equipamientos/${currentItem.id}`
      : "http://localhost:3001/equipamientos";

    const finalPayload = {
      ...currentItem,
      tipologia: currentItem.tipologia?.trim().toUpperCase(),
      origen: currentItem.origen?.trim().toUpperCase(),
      equipamiento: currentItem.equipamiento?.trim().toUpperCase(),
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });
      if (response.ok) {
        setOpen(false);
        cargarDatos();
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // LOGICA DEL MULTISELECT
  const handleTrazabilidadChange = (event, newValue) => {
    const lastSelected =
      newValue.length > 0 ? newValue[newValue.length - 1].value : null;

    let update = {
      soloExistencia: false,
      requiereMarca: false,
      requiereModelo: false,
      requiereSerie: false,
    };

    if (lastSelected === "soloExistencia") {
      update.soloExistencia = true;
    } else {
      newValue.forEach((item) => {
        if (item.value !== "soloExistencia") {
          update[item.value] = true;
        }
      });
    }
    setCurrentItem({ ...currentItem, ...update });
  };

  const getSelectedTrazabilidad = () => {
    const selected = [];
    if (currentItem.soloExistencia) selected.push(opcionesTrazabilidad[0]);
    if (currentItem.requiereMarca) selected.push(opcionesTrazabilidad[1]);
    if (currentItem.requiereModelo) selected.push(opcionesTrazabilidad[2]);
    if (currentItem.requiereSerie) selected.push(opcionesTrazabilidad[3]);
    return selected;
  };

  return (
    <Layout>
      <Paper
        elevation={0}
        sx={{
          borderRadius: "4px",
          border: "1px solid #e0e0e0",
          mb: 8,
          mx: "auto",
          maxWidth: "1750px",
          overflow: "hidden",
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
            Gestión de Equipamientos
          </Typography>
        </Box>

        <Box sx={{ p: 4, bgcolor: "white" }}>
          <Paper
            variant="outlined"
            sx={{ p: 3, mb: 4, borderRadius: "4px", borderColor: "#e0e0e0" }}
          >
            <Typography
              variant="h6"
              sx={{ color: "#0090d0", mb: 4, fontWeight: "bold" }}
            >
              Filtros de configuración de equipamiento
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ display: "flex", gap: 4, width: "100%" }}>
                <Box sx={{ flex: "1 1 50%" }}>
                  <Autocomplete
                    options={[...new Set(data.map((i) => i.tipologia))]
                      .filter(Boolean)
                      .sort()}
                    value={filtroTipologia}
                    onChange={(e, v) => setFiltroTipologia(v)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tipología"
                        variant="standard"
                        fullWidth
                      />
                    )}
                  />
                </Box>
                <Box sx={{ flex: "1 1 50%" }}>
                  <Autocomplete
                    options={[...new Set(data.map((i) => i.origen))].sort()}
                    value={filtroOrigen}
                    onChange={(e, v) => setFiltroOrigen(v)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Origen"
                        variant="standard"
                        fullWidth
                      />
                    )}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 4, width: "100%" }}>
                <Box sx={{ flex: "1 1 50%" }}>
                  <Autocomplete
                    options={[
                      ...new Set(data.map((i) => i.equipamiento)),
                    ].sort()}
                    value={filtroEquipamiento}
                    onChange={(e, v) => setFiltroEquipamiento(v)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tipo de Equipo"
                        variant="standard"
                        fullWidth
                      />
                    )}
                  />
                </Box>
                <Box sx={{ flex: "1 1 50%" }}>
                  <Autocomplete
                    options={opcionesRegla}
                    value={filtroRegla}
                    onChange={(e, v) => setFiltroRegla(v)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tipo de Regla"
                        variant="standard"
                        fullWidth
                      />
                    )}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 2,
                  width: "100%",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    setFiltroTipologia(null);
                    setFiltroOrigen(null);
                    setFiltroEquipamiento(null);
                    setFiltroRegla(null);
                  }}
                  sx={{
                    color: "#29b6f6",
                    borderColor: "#29b6f6",
                    px: 5,
                    fontWeight: "bold",
                  }}
                >
                  LIMPIAR
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  sx={{ backgroundColor: "#29b6f6", px: 5, fontWeight: "bold" }}
                >
                  CONSULTAR
                </Button>
              </Box>
            </Box>
          </Paper>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ bgcolor: "#29b6f6", fontWeight: "bold" }}
              onClick={() => {
                setCurrentItem({
                  tipologia: "",
                  origen: "",
                  tipo: "SERVICIO",
                  equipamiento: "",
                  tipoRegla: "UNICO",
                  base: 1,
                  cantidadMinima: 1,
                  requiereMarca: true,
                  requiereModelo: true,
                  requiereSerie: true,
                  soloExistencia: false,
                });
                setIsEditing(false);
                setOpen(true);
              }}
            >
              {" "}
              NUEVO EQUIPO{" "}
            </Button>
          </Box>

          <TableContainer
            sx={{ border: "1px solid #eee", borderRadius: "4px" }}
          >
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
                  <TableCell>TIPO DE EQUIPO</TableCell>
                  <TableCell align="center">REGLA</TableCell>
                  <TableCell align="center">MÍNIMO</TableCell>
                  <TableCell align="center">TRAZABILIDAD</TableCell>
                  <TableCell align="center">ACCIONES</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataFiltrada.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontSize: "0.75rem", color: "#666" }}>
                      {row.tipologia || "-"}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {row.origen}
                    </TableCell>
                    <TableCell>{row.equipamiento}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.tipoRegla}
                        size="small"
                        sx={{
                          fontSize: "0.65rem",
                          fontWeight: "bold",
                          bgcolor: "#e3f2fd",
                          color: "#005596",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">{row.cantidadMinima}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        color: row.soloExistencia ? "#2e7d32" : "#666",
                      }}
                    >
                      {formatTrazabilidad(row)}
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                      >
                        <IconButton
                          onClick={() => {
                            setIsEditing(true);
                            setCurrentItem(row);
                            setOpen(true);
                          }}
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
        </Box>
      </Paper>

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
              {isEditing ? "EDITAR EQUIPO" : "NUEVO EQUIPO"}
            </Typography>
          </Box>
          <Box sx={{ p: 4 }}>
            <Stack spacing={2.5}>
              <TextField
                label="Tipología"
                variant="standard"
                fullWidth
                value={currentItem.tipologia}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, tipologia: e.target.value })
                }
              />
              <TextField
                label="Origen"
                variant="standard"
                fullWidth
                value={currentItem.origen}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, origen: e.target.value })
                }
              />
              <TextField
                label="Equipamiento"
                variant="standard"
                fullWidth
                value={currentItem.equipamiento}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    equipamiento: e.target.value,
                  })
                }
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel>Regla</InputLabel>
                  <Select
                    value={currentItem.tipoRegla}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        tipoRegla: e.target.value,
                      })
                    }
                  >
                    {opcionesRegla.map((r) => (
                      <MenuItem key={r} value={r}>
                        {r}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {currentItem.tipoRegla === "PROPORCIONAL" && (
                  <TextField
                    label="Base"
                    type="number"
                    variant="standard"
                    sx={{ width: 100 }}
                    value={currentItem.base}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, base: e.target.value })
                    }
                  />
                )}
                <TextField
                  label="Mínimo"
                  type="number"
                  variant="standard"
                  sx={{ width: 100 }}
                  value={currentItem.cantidadMinima}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      cantidadMinima: e.target.value,
                    })
                  }
                />
              </Box>

              <Box sx={{ mt: 1 }}>
                <Autocomplete
                  multiple
                  options={opcionesTrazabilidad}
                  getOptionLabel={(option) => option.label}
                  value={getSelectedTrazabilidad()}
                  onChange={handleTrazabilidadChange}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  disableCloseOnSelect
                  renderOption={(props, option, { selected }) => {
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        <Checkbox
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.label}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Configuración de Trazabilidad"
                      placeholder="Seleccione..."
                    />
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => {
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <Chip
                          key={key}
                          label={option.label}
                          {...tagProps}
                          size="small"
                          sx={{
                            bgcolor: "white",
                            border: "1px solid #ccc",
                            fontWeight: "bold",
                          }}
                        />
                      );
                    })
                  }
                />
              </Box>
            </Stack>
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}
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
                {isEditing ? "ACTUALIZAR" : "GUARDAR"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Layout>
  );
};

export default EquipamientosConfig;
