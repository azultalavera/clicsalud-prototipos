import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  Stack,
  Autocomplete,
  Divider,
  Chip,
  Checkbox,
  Modal,
} from "@mui/material";
import {
  Edit as EditIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  PlaylistAdd as PlaylistAddIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorOutlineIcon,
  Check as CheckIcon,
  PriorityHigh as PriorityHighIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  overflow: "hidden",
};

const EquipamientosLabV3 = ({
  selectedServices = {},
  infraSelection = {},
  equiposCargados = [],
  setEquiposCargados,
  onValidationChange,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [isExtraMode, setIsExtraMode] = useState(false);
  const [requisitosDB, setRequisitosDB] = useState([]);
  const [todosLosEquiposDB, setTodosLosEquiposDB] = useState([]);
  const [todosLosEquiposFullDB, setTodosLosEquiposFullDB] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedRevision, setExpandedRevision] = useState({});

  const [form, setForm] = useState({
    id: null,
    subId: null,
    origen: "",
    equipamiento: "",
    otroEquipo: "",
    marca: "",
    modelo: "",
    serie: "",
    soloExistencia: false,
  });

  const serviceNames = useMemo(() => {
    const servicios = Object.keys(selectedServices).filter(
      (k) => !!selectedServices[k],
    );
    const infra = Object.keys(infraSelection).filter(
      (k) => !!infraSelection[k],
    );
    return [...new Set([...servicios, ...infra])];
  }, [selectedServices, infraSelection]);

  // Lista de equipos para el modal (filtra los que ya son requeridos en el origen actual)
  const listaEquiposDisponiblesExtra = useMemo(() => {
    const origenActual = serviceNames[activeIdx];
    const requeridosNombres = requisitosDB
      .filter((r) => r.origen === origenActual)
      .map((r) => r.equipamiento);

    return todosLosEquiposDB
      .filter((nome) => !requeridosNombres.includes(nome))
      .concat("OTRO");
  }, [requisitosDB, todosLosEquiposDB, activeIdx, serviceNames]);

  useEffect(() => {
    const fetchEquipamientos = async () => {
      try {
        const res = await fetch("http://localhost:3001/equipamientos");
        const data = await res.json();

        const nombresTotales = [
          ...new Set(data.map((item) => item.equipamiento)),
        ];
        setTodosLosEquiposDB(nombresTotales);
        setTodosLosEquiposFullDB(data);

        const limpiar = (t) =>
          t
            ? t
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .trim()
              .toUpperCase()
            : "";

        const calculados = data
          .filter((eq) =>
            serviceNames.some((s) => limpiar(s) === limpiar(eq.origen)),
          )
          .map((eq) => {
            const cantidadInfra = parseInt(infraSelection[eq.origen]) || 1;
            let totalNecesario = 0;
            if (eq.tipoRegla === "PROPORCIONAL") {
              totalNecesario =
                Math.ceil(cantidadInfra / eq.base) * eq.cantidadMinima;
            } else if (eq.tipoRegla === "LINEAL") {
              totalNecesario = cantidadInfra * eq.cantidadMinima;
            } else {
              totalNecesario = eq.cantidadMinima || 1;
            }
            return { ...eq, cantidadFinalCalculada: totalNecesario };
          });
        setRequisitosDB(calculados);
      } catch (err) {
        console.error(err);
      }
    };
    if (serviceNames.length > 0) fetchEquipamientos();
  }, [serviceNames, infraSelection]);

  const datosRevisionPorOrigen = useMemo(() => {
    const agrupado = {};
    serviceNames.forEach((origen) => {
      const requisitosDeEsteOrigen = requisitosDB.filter(
        (r) => r.origen === origen,
      );
      const items = requisitosDeEsteOrigen.map((req) => {
        const actual = equiposCargados.filter(
          (c) =>
            (c.id === req.id ||
              (c.isExtra &&
                c.equipamiento === req.equipamiento &&
                c.origen === req.origen)) &&
            c.marca?.trim() !== "",
        ).length;
        return {
          nombre: req.equipamiento,
          actual,
          total: req.cantidadFinalCalculada,
          completo: actual >= req.cantidadFinalCalculada,
        };
      });
      agrupado[origen] = items.sort((a, b) =>
        a.completo === b.completo ? 0 : a.completo ? 1 : -1,
      );
    });
    return agrupado;
  }, [requisitosDB, equiposCargados, serviceNames]);

  useEffect(() => {
    const todosLosOrigenes = Object.values(datosRevisionPorOrigen).flat();
    const todoOk =
      todosLosOrigenes.length > 0 && todosLosOrigenes.every((i) => i.completo);
    onValidationChange(todoOk);
  }, [datosRevisionPorOrigen, onValidationChange]);

  const handleOpenForm = (req, subIndex, esExtra = false) => {
    const isNewRequest = !req;
    const targetOrigen = serviceNames[activeIdx];

    setForm({
      id: isNewRequest ? `extra-${Date.now()}` : req.id,
      subId: subIndex,
      origen: isNewRequest ? targetOrigen : req.origen,
      equipamiento: isNewRequest ? "" : req.equipamiento,
      otroEquipo: "",
      marca: req?.marca || "",
      modelo: req?.modelo || "",
      serie: req?.serie || "",
      soloExistencia: !!req?.soloExistencia,
    });
    setIsExtraMode(esExtra || isNewRequest);
    setOpenModal(true);
  };

  const addOneExistencia = (req, subIndex) => {
    setEquiposCargados((prev) => [
      ...prev,
      {
        id: req.id,
        subId: subIndex,
        origen: req.origen,
        equipamiento: req.equipamiento,
        marca: "SÓLO EXISTENCIA",
        modelo: "-",
        serie: "-",
        isExtra: false,
      },
    ]);
  };

  const handleDirectConfirm = (req, subIndex) => {
    addOneExistencia(req, subIndex);
  };

  const removeOneExistencia = (req) => {
    setEquiposCargados((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].id === req.id && copy[i].origen === req.origen) {
          copy.splice(i, 1);
          return copy;
        }
      }
      return prev;
    });
  };

  const handleSave = () => {
    const finalEquipamiento =
      form.equipamiento === "OTRO" ? form.otroEquipo : form.equipamiento;

    if (!finalEquipamiento) {
      alert("Debe indicar el nombre del equipo");
      return;
    }

    if (
      !form.soloExistencia &&
      !form.marca &&
      !form.modelo &&
      !form.serie
    ) {
      alert(
        "Debe completar al menos un dato técnico (Marca, Modelo o Serie) o marcar 'Sólo existencia'",
      );
      return;
    }

    setEquiposCargados((prev) => {
      const sinEste = prev.filter(
        (c) => !(c.id === form.id && c.subId === form.subId),
      );
      return [
        ...sinEste,
        {
          ...form,
          equipamiento: finalEquipamiento,
          marca: form.soloExistencia ? "SÓLO EXISTENCIA" : form.marca,
          modelo: form.soloExistencia ? "-" : form.modelo,
          serie: form.soloExistencia ? "-" : form.serie,
          isExtra: isExtraMode,
        },
      ];
    });
    setOpenModal(false);
    setForm({
      id: null,
      subId: null,
      origen: "",
      equipamiento: "",
      otroEquipo: "",
      marca: "",
      modelo: "",
      serie: "",
      soloExistencia: false,
    });
  };

  const handleLimpiarFila = (id, subId) => {
    setEquiposCargados((prev) =>
      prev.map((c) =>
        c.id === id && c.subId === subId
          ? { ...c, marca: "", modelo: "", serie: "" }
          : c,
      ),
    );
  };

  const itemsAMostrar = useMemo(() => {
    const origenSel = serviceNames[activeIdx];
    const obligatorios = requisitosDB.filter((r) => r.origen === origenSel);
    const extrasCargados = equiposCargados.filter(
      (c) =>
        c.origen === origenSel &&
        c.isExtra &&
        !obligatorios.some((ob) => ob.equipamiento === c.equipamiento),
    );
    const extrasAgrupados = extrasCargados.reduce((acc, curr) => {
      if (!acc[curr.equipamiento]) {
        const fullInfo = todosLosEquiposFullDB.find(
          (eq) => eq.equipamiento === curr.equipamiento,
        );
        acc[curr.equipamiento] = {
          id: curr.id,
          equipamiento: curr.equipamiento,
          cantidadFinalCalculada: 0,
          isExtra: true,
          origen: origenSel,
          soloExistencia: curr.soloExistencia || fullInfo?.soloExistencia || false,
        };
      }
      return acc;
    }, {});
    const combined = [...obligatorios, ...Object.values(extrasAgrupados)];
    return combined.sort((a, b) => {
      // 1. Requeridos primero, Extras al último
      if (!a.isExtra && b.isExtra) return -1;
      if (a.isExtra && !b.isExtra) return 1;

      // 2. SoloExistencia: true primero
      if (a.soloExistencia && !b.soloExistencia) return -1;
      if (!a.soloExistencia && b.soloExistencia) return 1;

      // 3. Empate: alfabético
      return a.equipamiento.localeCompare(b.equipamiento);
    });
  }, [requisitosDB, serviceNames, activeIdx, equiposCargados]);

  return (
    <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "#25ade6", mb: 1 }}
      >
        EQUIPAMIENTOS
      </Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        {/* PANEL LATERAL ORIGENES */}
        <Paper
          variant="outlined"
          sx={{
            width: 350,
            height: "70vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              bgcolor: "#00386f",
              color: "white",
              p: 1,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            ORIGENES
          </Box>
          <List dense sx={{ flex: 1, overflow: "auto" }}>
            {serviceNames.map((s, i) => {
              const items = datosRevisionPorOrigen[s] || [];
              const isCompleto =
                items.length === 0 || items.every((req) => req.completo);

              return (
                <ListItemButton
                  key={s}
                  selected={activeIdx === i}
                  onClick={() => setActiveIdx(i)}
                  sx={{
                    "&.Mui-selected": {
                      bgcolor: "#e3f2fd",
                      color: "#005596",
                      borderRight: "4px solid #005596",
                    },
                  }}
                >
                  <ListItemText
                    primary={s}
                    primaryTypographyProps={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                    }}
                  />
                  <Chip
                    label={isCompleto ? "COMPLETO" : "INCOMPLETO"}
                    variant="outlined"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.6rem",
                      fontWeight: "bold",
                      ml: 1,
                      color: isCompleto ? "#000000ff" : "#000000ff",
                      borderColor: isCompleto ? "#000000ff" : "#000000ff",
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Paper>

        {/* TABLA CENTRAL */}
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            flex: 1,
            height: "70vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    bgcolor: "#00386f",
                    color: "white",
                    fontWeight: "bold",
                  },
                }}
              >
                <TableCell>EQUIPOS</TableCell>
                <TableCell align="center">
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    py: 0.5,
                    borderRadius: 1
                  }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>CANTIDAD</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">REQUERIDO</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {itemsAMostrar.map((req, idx) => {
                const prev = itemsAMostrar[idx - 1];
                const isFirstOfMainGroup = !prev || prev.isExtra !== req.isExtra;
                const isFirstOfSubGroup =
                  isFirstOfMainGroup || prev.soloExistencia !== req.soloExistencia;

                const mainTitle = req.isExtra
                  ? "EQUIPOS EXTRA"
                  : "EQUIPOS REQUERIDOS";
                const subTitle = req.soloExistencia
                  ? "Sólo existencia"
                  : "MARCA/MODELO/SERIE";

                const cargadosEnEste = equiposCargados.filter(
                  (c) =>
                    (c.id === req.id ||
                      (c.isExtra && c.equipamiento === req.equipamiento)) &&
                    c.origen === serviceNames[activeIdx],
                );
                const actualCount = cargadosEnEste.length;
                const isComplete =
                  actualCount >= (req.cantidadFinalCalculada || 0);

                return (
                  <React.Fragment key={req.id}>
                    {isFirstOfMainGroup && (
                      <TableRow sx={{ bgcolor: "#F1F5F9" }}>
                        <TableCell colSpan={4} sx={{ py: 1.5, px: 2 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: "900",
                              color: "#005596",
                              fontSize: "0.9rem",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {mainTitle}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {isFirstOfSubGroup && (
                      <TableRow sx={{ bgcolor: "transparent" }}>
                        <TableCell
                          colSpan={4}
                          sx={{
                            py: 0.5,
                            px: 3,
                            borderBottom: "1px solid #f1f5f9",
                          }}
                        >
                          <Typography
                            variant="overline"
                            sx={{
                              fontWeight: "700",
                              color: "#64748b",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              fontSize: "0.7rem",
                            }}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 2,
                                bgcolor: "#94a3b8",
                                borderRadius: 1,
                              }}
                            />
                            {subTitle}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow
                      hover={!req.soloExistencia}
                      onClick={() => {
                        if (!req.soloExistencia) {
                          setExpandedRow(expandedRow === req.id ? null : req.id);
                        }
                      }}
                      sx={{ cursor: req.soloExistencia ? "default" : "pointer" }}
                    >
                      <TableCell sx={{ fontWeight: 700 }}>
                        {req.equipamiento}{" "}
                        {req.isExtra && (
                          <Chip
                            label="EXTRA"
                            size="small"
                            variant="outlined"
                            sx={{
                              ml: 1,
                              height: 18,
                              fontSize: "0.65rem",
                              color: "#0B85C4",
                              borderColor: "#0B85C4",
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {req.soloExistencia ? (
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              border: `1px solid ${actualCount > 0 ? "#005596" : "#ccc"}`,
                              borderRadius: "4px",
                              height: "28px",
                              bgcolor: "white",
                              overflow: "hidden"
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeOneExistencia(req);
                              }}
                              disabled={actualCount === 0}
                              sx={{
                                borderRadius: 0,
                                p: 0,
                                width: 28,
                                height: 28,
                                borderRight: "1px solid #ccc"
                              }}
                            >
                              <RemoveIcon fontSize="inherit" />
                            </IconButton>
                            <Typography
                              sx={{
                                width: "30px",
                                textAlign: "center",
                                fontSize: "0.75rem",
                                fontWeight: actualCount > 0 ? "bold" : "normal",
                                color: actualCount > 0 ? "#005596" : "inherit"
                              }}
                            >
                              {actualCount}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                addOneExistencia(req, actualCount);
                              }}
                              sx={{
                                borderRadius: 0,
                                p: 0,
                                width: 28,
                                height: 28,
                                borderLeft: "1px solid #ccc"
                              }}
                            >
                              <AddIcon fontSize="inherit" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Typography
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: `1px solid ${actualCount > 0 ? "#005596" : "#ccc"}`,
                              borderRadius: "4px",
                              height: "28px",
                              width: "30px",
                              bgcolor: "white",
                              fontSize: "0.75rem",
                              fontWeight: actualCount > 0 ? "bold" : "normal",
                              color: actualCount > 0 ? "#005596" : "inherit"
                            }}
                          >
                            {actualCount}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          sx={{ fontWeight: "regular", fontSize: "0.85rem", color: "#000000ff" }}
                        >
                          {req.isExtra ? "-" : (req.cantidadFinalCalculada || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {!req.soloExistencia && (
                          <IconButton size="small">
                            {expandedRow === req.id ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                    {!req.soloExistencia && (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ p: 0 }}>
                          <Collapse in={expandedRow === req.id}>
                            <Box sx={{ p: 2, bgcolor: "#ffffffff" }}>
                              <Table
                                size="small"
                                sx={{
                                  bgcolor: "white",
                                  border: "1px solid #cbd5e1",
                                }}
                              >
                                <TableHead sx={{ bgcolor: "#f8fafc" }}>
                                  <TableRow
                                    sx={{
                                      "& th": {
                                        fontWeight: "bold",
                                        fontSize: "0.65rem",
                                        color: "#64748b",
                                      },
                                    }}
                                  >
                                    <TableCell sx={{ width: 140 }}>
                                      UNIDAD
                                    </TableCell>
                                    <TableCell>MARCA</TableCell>
                                    <TableCell>MODELO</TableCell>
                                    <TableCell>SERIE</TableCell>
                                    <TableCell align="center">
                                      ACCIONES
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {cargadosEnEste.map((unit, uIdx) => (
                                    <TableRow
                                      key={uIdx}
                                      sx={{ bgcolor: "#ffffffff" }}
                                    >
                                      <TableCell
                                        size="small"
                                        sx={{
                                          fontSize: "0.75rem",
                                          fontWeight: 600,
                                        }}
                                      >
                                        #{uIdx + 1}
                                      </TableCell>
                                      <TableCell sx={{ fontSize: "0.75rem" }}>
                                        {unit.marca}
                                      </TableCell>
                                      <TableCell sx={{ fontSize: "0.75rem" }}>
                                        {unit.modelo}
                                      </TableCell>
                                      <TableCell sx={{ fontSize: "0.75rem" }}>
                                        {unit.serie}
                                      </TableCell>
                                      <TableCell align="center">
                                        <Stack
                                          direction="row"
                                          spacing={1}
                                          justifyContent="center"
                                        >
                                          <IconButton
                                            size="small"
                                            onClick={() =>
                                              handleOpenForm(
                                                unit,
                                                unit.subId,
                                                unit.isExtra,
                                              )
                                            }
                                            disabled={req.soloExistencia}
                                          >
                                            <EditIcon
                                              fontSize="inherit"
                                              color={
                                                req.soloExistencia
                                                  ? "disabled"
                                                  : "primary"
                                              }
                                            />
                                          </IconButton>
                                          <IconButton
                                            size="small"
                                            onClick={() =>
                                              unit.isExtra
                                                ? setEquiposCargados((prev) =>
                                                  prev.filter(
                                                    (c) =>
                                                      !(
                                                        c.id === unit.id &&
                                                        c.subId === unit.subId
                                                      ),
                                                  ),
                                                )
                                                : handleLimpiarFila(
                                                  unit.id,
                                                  unit.subId,
                                                )
                                            }
                                          >
                                            {unit.isExtra ? (
                                              <CloseIcon
                                                fontSize="small"
                                                sx={{ color: "#d32f2f" }}
                                              />
                                            ) : (
                                              <DeleteIcon
                                                fontSize="small"
                                                color="action"
                                              />
                                            )}
                                          </IconButton>
                                        </Stack>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  {!req.isExtra &&
                                    actualCount <
                                    req.cantidadFinalCalculada && (
                                      <TableRow>
                                        <TableCell
                                          sx={{
                                            fontStyle: "italic",
                                            color: "#b0b0b0ff",
                                            fontSize: "0.75rem",
                                          }}
                                        >
                                          Pendiente de carga
                                        </TableCell>
                                        <TableCell colSpan={3} />
                                        <TableCell align="center">
                                          {req.soloExistencia ? (
                                            <Stack
                                              direction="row"
                                              spacing={1}
                                              justifyContent="center"
                                            >
                                              <Button
                                                variant="contained"
                                                size="small"
                                                color="success"
                                                onClick={() =>
                                                  handleDirectConfirm(
                                                    req,
                                                    actualCount,
                                                  )
                                                }
                                                sx={{
                                                  fontSize: "0.65rem",
                                                  fontWeight: "bold",
                                                }}
                                              >
                                                CONFIRMAR 1
                                              </Button>
                                              {req.cantidadFinalCalculada -
                                                actualCount >
                                                1 && (
                                                  <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="success"
                                                    onClick={() => {
                                                      const faltantes =
                                                        req.cantidadFinalCalculada -
                                                        actualCount;
                                                      const nuevos = Array.from({
                                                        length: faltantes,
                                                      }).map((_, i) => ({
                                                        id: req.id,
                                                        subId: actualCount + i,
                                                        origen: req.origen,
                                                        equipamiento:
                                                          req.equipamiento,
                                                        marca: "SÓLO EXISTENCIA",
                                                        modelo: "-",
                                                        serie: "-",
                                                        isExtra: false,
                                                      }));
                                                      setEquiposCargados(
                                                        (prev) => [
                                                          ...prev,
                                                          ...nuevos,
                                                        ],
                                                      );
                                                    }}
                                                    sx={{
                                                      fontSize: "0.65rem",
                                                      fontWeight: "bold",
                                                    }}
                                                  >
                                                    CONFIRMAR FALTANTES (
                                                    {req.cantidadFinalCalculada -
                                                      actualCount}
                                                    )
                                                  </Button>
                                                )}
                                            </Stack>
                                          ) : (
                                            <IconButton
                                              size="small"
                                              onClick={() =>
                                                handleOpenForm(
                                                  req,
                                                  actualCount,
                                                  false,
                                                )
                                              }
                                            >
                                              <AddIcon color="error" />
                                            </IconButton>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  {isComplete && !req.isExtra && (
                                    <TableRow
                                      sx={{ borderTop: "1px dashed #ccc" }}
                                    >
                                      <TableCell
                                        sx={{
                                          color: "#94a3b8",
                                          fontStyle: "italic",
                                          fontSize: "0.75rem",
                                        }}
                                      >
                                        Opcional
                                      </TableCell>
                                      <TableCell colSpan={3} />
                                      <TableCell align="center">
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            handleOpenForm(
                                              req,
                                              Date.now(),
                                              true,
                                            )
                                          }
                                        >
                                          <AddIcon
                                            fontSize="small"
                                            sx={{ color: "#94a3b8" }}
                                          />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
          <Box
            sx={{
              p: 2,
              mt: "auto",
              bgcolor: "#f8fafc",
              textAlign: "center",
              borderTop: "1px solid #eee",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<PlaylistAddIcon />}
              onClick={() => handleOpenForm(null, 0, true)}
            >
              AGREGAR EQUIPO NO REQUERIDO
            </Button>
          </Box>
        </TableContainer>
      </Box>

      {/* MODAL */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={styleModal}>
          <Box
            sx={{
              bgcolor: "#005596",
              color: "white",
              py: 2,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
            >
              {isExtraMode && !requisitosDB.find((r) => r.id === form.id)
                ? "NUEVO EQUIPO"
                : "EDITAR EQUIPO"}
            </Typography>
          </Box>
          <Box sx={{ p: 4 }}>
            <Stack spacing={3}>
              <TextField
                label="Origen"
                value={form.origen}
                disabled
                fullWidth
                variant="standard"
              />

              {isExtraMode && !requisitosDB.find((r) => r.id === form.id) ? (
                <Autocomplete
                  freeSolo
                  options={listaEquiposDisponiblesExtra}
                  value={form.equipamiento || null}
                  onChange={(e, v) => {
                    const isSolo = todosLosEquiposFullDB.find(eq => eq.equipamiento === v)?.soloExistencia || false;
                    setForm({ ...form, equipamiento: v, soloExistencia: isSolo });
                  }}
                  onInputChange={(e, v) => {
                    const isSolo = todosLosEquiposFullDB.find(eq => eq.equipamiento === v)?.soloExistencia || false;
                    setForm({ ...form, equipamiento: v, soloExistencia: isSolo });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tipo de Equipo"
                      variant="standard"
                      placeholder="Escriba o seleccione"
                    />
                  )}
                />
              ) : (
                <TextField
                  label="Tipo de Equipo"
                  value={form.equipamiento}
                  disabled
                  fullWidth
                  variant="standard"
                />
              )}

              {form.equipamiento === "OTRO" && (
                <TextField
                  label="Nombre Equipo"
                  fullWidth
                  variant="standard"
                  value={form.otroEquipo}
                  onChange={(e) => setForm({ ...form, otroEquipo: e.target.value.toUpperCase() })}
                  autoFocus
                />
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox
                  checked={form.soloExistencia}
                  onChange={(e) => setForm({ ...form, soloExistencia: e.target.checked })}
                  size="small"
                  disabled={!isExtraMode}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: isExtraMode ? "#64748b" : "rgba(100, 116, 139, 0.5)"
                  }}
                >
                  Sólo existencia
                </Typography>
              </Box>

              {(() => {
                const isSoloExistencia = form.soloExistencia;

                return (
                  <>
                    <TextField
                      label="Marca"
                      fullWidth
                      variant="standard"
                      disabled={isSoloExistencia}
                      value={isSoloExistencia ? "" : form.marca}
                      onChange={(e) =>
                        setForm({ ...form, marca: e.target.value.toUpperCase() })
                      }
                    />
                    <TextField
                      label="Modelo"
                      fullWidth
                      variant="standard"
                      disabled={isSoloExistencia}
                      value={isSoloExistencia ? "" : form.modelo}
                      onChange={(e) =>
                        setForm({ ...form, modelo: e.target.value.toUpperCase() })
                      }
                    />
                    <TextField
                      label="Serie"
                      fullWidth
                      variant="standard"
                      disabled={isSoloExistencia}
                      value={isSoloExistencia ? "" : form.serie}
                      onChange={(e) =>
                        setForm({ ...form, serie: e.target.value.toUpperCase() })
                      }
                    />
                  </>
                );
              })()}
            </Stack>

            <Box
              sx={{
                mt: 4,
                display: "flex",
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                onClick={() => setOpenModal(false)}
                sx={{ bgcolor: "#d32f2f", "&:hover": { bgcolor: "#b71c1c" } }}
                startIcon={<CancelIcon />}
              >
                CANCELAR
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{ bgcolor: "#005596", "&:hover": { bgcolor: "#00386f" } }}
                startIcon={<CheckIcon />}
              >
                AGREGAR
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default EquipamientosLabV3;
