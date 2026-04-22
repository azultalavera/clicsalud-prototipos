import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Divider,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Fab,
  TableContainer,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

const TRAMITE_MAPPING = {
  "ARQUITECTURA": [
    "Nombre del Establecimiento",
    "N° de Expediente",
    "Descripción",
    "Plano de arquitectura",
    "Memoria descriptiva"
  ],
  "ESTABLECIMIENTO": [
    "Denominación",
    "Tipo dependencia",
    "Propiedad",
    "CUIT",
    "Localidad",
    "Dirección",
    "Contacto (Email)",
    "Contacto (Teléfono)"
  ],
  "SALAS": [
    "QUIRÓFANOS",
    "QUIRÓFANOS PARA HEMODINAMIA",
    "SALA DE ENDOSCOPÍA",
    "SALA DE PARTOS",
    "SALA DE PROCEDIMIENTOS"
  ],
  "CAMAS": [
    "HEMODIÁLISIS",
    "INTERNACIÓN GENERAL",
    "INTERNACIÓN PROLONGADA",
    "MATERNIDAD",
    "NEONATOLOGÍA",
    "PEDIATRÍA",
    "SHOCK ROOM",
    "TERAPIA INTENSIVA ADULTOS",
    "TERAPIA INTENSIVA PEDIÁTRICA",
    "UNIDAD CORONARIA",
    "UNIDAD CUIDADOS INTERMEDIOS",
    "USO TRANSITORIO (Guardia, Onco, CA Quirurg)"
  ],
  "DOCUMENTOS ADJUNTOS": [
    "Vto. Plan de Evacuación",
    "Vto. Bomberos",
    "Vto. Extinguidores",
    "Habilitación Laboratorio",
    "Habilitación Municipal"
  ]
};
import {
  MedicalServices as MedicalServicesIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  DeleteOutline as DeleteOutlineIcon,
  Add as AddIcon,
  DragIndicator as DragIndicatorIcon
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";
import { ConfigContext, slugify, fieldTypes } from "./ConfiguradorClinicas";

const ClinicasServicioEditor = () => {
  const { tipologiaName, servicios, setServicios, handleSaveConfig } =
    useContext(ConfigContext);

  const { servicioSlug } = useParams();
  const navigate = useNavigate();
  const [equipamientos, setEquipamientos] = useState([]);
  const [rrhhList, setRrhhList] = useState([]);
  const [jefeServicioList, setJefeServicioList] = useState([]);

  React.useEffect(() => {
    fetch("http://localhost:3001/equipamientos")
      .then((res) => res.json())
      .then((data) => setEquipamientos(data))
      .catch((err) => console.error("Error fetching equipamientos:", err));

    fetch("http://localhost:3001/recursos-humanos")
      .then((res) => res.json())
      .then((data) => setRrhhList(data))
      .catch((err) => console.error("Error fetching rrhh:", err));

    fetch("http://localhost:3001/jefe-servicio")
      .then((res) => res.json())
      .then((data) => setJefeServicioList(data))
      .catch((err) => console.error("Error fetching jefe-servicio:", err));
  }, []);

  const parseOptions = (options = "") =>
    String(options)
      .split(/\r?\n|,/)
      .map((option) => option.trim())
      .filter(Boolean);

  const formatOptionsForEditor = (options = "") =>
    parseOptions(options).join("\n");

  const normalizeOptionsInput = (input = "") => parseOptions(input).join(", ");

  // Find the service in the context state by looking at the slug
  const srvIdx = servicios.findIndex((s) => slugify(s.name) === servicioSlug);
  const srv = servicios[srvIdx];

  const [optionDrafts, setOptionDrafts] = useState({});

  const handleUpdateServiceName = (newName) => {
    const newServicios = [...servicios];
    newServicios[srvIdx].name = newName;
    setServicios(newServicios);
  };

  const handleAddOption = (fieldIdx, sectionIdx, fieldId) => {
    const nextOption = (optionDrafts[fieldId] || "").trim();
    if (!nextOption) return;

    const newServicios = [...servicios];
    const sourceField =
      sectionIdx !== null
        ? newServicios[srvIdx].sections[sectionIdx].fields[fieldIdx]
        : newServicios[srvIdx].fields[fieldIdx];

    const currentOptions = parseOptions(sourceField.options);

    if (
      currentOptions.some(
        (option) => option.toLowerCase() === nextOption.toLowerCase(),
      )
    ) {
      setOptionDrafts((prev) => ({ ...prev, [fieldId]: "" }));
      return;
    }

    sourceField.options = [...currentOptions, nextOption].join(", ");
    setServicios(newServicios);
    setOptionDrafts((prev) => ({ ...prev, [fieldId]: "" }));
  };

  const handleRemoveOption = (fieldIdx, sectionIdx, optionToRemove) => {
    const newServicios = [...servicios];
    const sourceField =
      sectionIdx !== null
        ? newServicios[srvIdx].sections[sectionIdx].fields[fieldIdx]
        : newServicios[srvIdx].fields[fieldIdx];

    sourceField.options = parseOptions(sourceField.options)
      .filter((option) => option !== optionToRemove)
      .join(", ");
    setServicios(newServicios);
  };

  const handleAddField = () => {
    const newField = {
      id: `new-${Date.now()}`,
      label: "",
      type: "text",
      options: "",
    };
    const newServicios = [...servicios];
    newServicios[srvIdx].fields.push(newField);
    setServicios(newServicios);
  };

  const handleUpdateField = (fieldIdx, key, value) => {
    const newServicios = [...servicios];
    newServicios[srvIdx].fields[fieldIdx][key] = value;
    setServicios(newServicios);
  };

  const handleDeleteField = (fieldIdx) => {
    const newServicios = [...servicios];
    newServicios[srvIdx].fields.splice(fieldIdx, 1);
    setServicios(newServicios);
  };

  if (!srv) return <Box sx={{ p: 5 }}>Servicio no encontrado.</Box>;

  return (
    <Box sx={{ width: "70%", mx: "auto", p: { xs: 2, md: 4, lg: 6 }, fontFamily: "Roboto, sans-serif" }}>
      {/* Sub-Header / Breadcrumb */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <IconButton
          onClick={() => navigate("..")}
          size="small"
          sx={{ backgroundColor: "#f1f5f9" }}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
          Volver a {tipologiaName}
        </Typography>
      </Box>

      {/* Editor Content */}
      <Box sx={{ mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e2e8f0",
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: "#fff",
          }}
        >
          {/* Header del Servicio */}
          <Box
            sx={{
              backgroundColor: "#ffffff",
              borderBottom: "2px solid rgba(11, 133, 196, 0.2)",
              p: 3,
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Box sx={{ p: 1.5, backgroundColor: "rgba(11, 133, 196, 0.05)", borderRadius: 2 }}>
              <MedicalServicesIcon sx={{ color: "#0B85C4", fontSize: 32 }} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="overline"
                sx={{ fontWeight: 800, color: "#000000", fontFamily: "Roboto, sans-serif" }}
              >
                MATRIZ DE INSPECCIÓN
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                value={srv.name}
                onChange={(e) => handleUpdateServiceName(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: "1.5rem", fontWeight: 800, color: "#0B85C4", fontFamily: "Roboto, sans-serif" },
                }}
              />
            </Box>
            <Chip
              label={`${(srv.fields?.length || 0) + (srv.sections?.reduce((acc, s) => acc + (s.fields?.length || 0), 0) || 0)} datos`}
              sx={{ backgroundColor: "rgba(11, 133, 196, 0.1)", color: "#0B85C4", fontWeight: 700, fontFamily: "Roboto, sans-serif" }}
            />
          </Box>

          {/* Contenedor de Tablas (por secciones o directas) */}
          <Box sx={{ p: 0 }}>
            {srv.sections && srv.sections.length > 0 ? (
              srv.sections.map((section, sidx) => (
                <Box key={section.id} sx={{ mb: 4 }}>
                  <Box sx={{ px: 4, py: 2, backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#475569", textTransform: "uppercase" }}>
                      Sección: {section.name}
                    </Typography>
                    <IconButton size="small" onClick={() => {
                      const newServicios = [...servicios];
                      newServicios[srvIdx].sections.splice(sidx, 1);
                      setServicios(newServicios);
                    }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <TableContainer>
                    <Table size="small">
                      <TableHead sx={{ borderBottom: "1px solid #f1f5f9" }}>
                        <TableRow>
                          <TableCell sx={{ width: 40 }}></TableCell>
                          <TableCell sx={{ width: "180px", color: "#94a3b8", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>ORIGEN</TableCell>
                          <TableCell sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>PARÁMETRO / REF. TRÁMITE</TableCell>
                          <TableCell sx={{ width: "220px", color: "#94a3b8", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>TIPO DE DATO</TableCell>
                          <TableCell align="right" sx={{ width: 60 }}></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {section.fields.map((field, fIdx) => (
                          <TableRow key={field.id} sx={{ "&:hover": { backgroundColor: "#fcfcfc" } }}>
                            <TableCell align="center"><DragIndicatorIcon sx={{ color: "#cbd5e1", opacity: 0.2 }} fontSize="small" /></TableCell>
                            <TableCell>
                              <ToggleButtonGroup
                                size="small"
                                value={field.origin === "TRÁMITE" ? "TRÁMITE" : "ADMIN"}
                                exclusive
                                onChange={(e, val) => {
                                  if (!val) return;
                                  const newServicios = [...servicios];
                                  const target = newServicios[srvIdx].sections[sidx].fields[fIdx];
                                  target.origin = val;
                                  if (val === "ADMIN") delete target.tramiteField;
                                  setServicios(newServicios);
                                }}
                                sx={{
                                  height: 32,
                                  "& .MuiToggleButton-root": {
                                    px: 2,
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    border: "1px solid #e2e8f0",
                                    "&.Mui-selected": {
                                      bgcolor: "#0B85C4",
                                      color: "white",
                                      "&:hover": { bgcolor: "#096da1" }
                                    }
                                  }
                                }}
                              >
                                <ToggleButton value="ADMIN">ADMIN</ToggleButton>
                                <ToggleButton value="TRÁMITE">TRÁMITE</ToggleButton>
                              </ToggleButtonGroup>
                            </TableCell>
                            <TableCell>
                              {field.origin === "TRÁMITE" ? (
                                <Select
                                  fullWidth
                                  size="small"
                                  value={field.tramiteField || ""}
                                  variant="standard"
                                  sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#0B85C4' }}
                                  onChange={(e) => {
                                    const newServicios = [...servicios];
                                    const val = e.target.value;
                                    newServicios[srvIdx].sections[sidx].fields[fIdx].tramiteField = val;
                                    newServicios[srvIdx].sections[sidx].fields[fIdx].label = val.split(" > ")[1] || val;
                                    setServicios(newServicios);
                                  }}
                                  displayEmpty
                                >
                                  <MenuItem value="" disabled>Seleccionar campo del trámite...</MenuItem>
                                  {Object.keys(TRAMITE_MAPPING).map(category => [
                                    <MenuItem key={category} disabled sx={{ backgroundColor: '#f8fafc', fontWeight: 800, color: '#64748b', fontSize: '0.7rem' }}>
                                      {category}
                                    </MenuItem>,
                                    ...TRAMITE_MAPPING[category].map(f => (
                                      <MenuItem key={f} value={`${category} > ${f}`} sx={{ pl: 3, fontSize: '0.85rem' }}>
                                        {f}
                                      </MenuItem>
                                    ))
                                  ])}
                                </Select>
                              ) : (
                                <>
                                  {field.type === "equipamiento" || field.type === "rrhh" || field.type === "jefe_servicio" ? (
                                    <Select
                                      fullWidth size="small" variant="standard"
                                      value={field.label || ""}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        const newServicios = [...servicios];
                                        newServicios[srvIdx].sections[sidx].fields[fIdx].label = val;
                                        setServicios(newServicios);
                                      }}
                                      sx={{ fontSize: "0.85rem", fontWeight: 700, color: field.type === 'equipamiento' ? '#32A430' : field.type === 'rrhh' ? '#f59e0b' : '#ef4444' }}
                                      displayEmpty
                                    >
                                      <MenuItem value="" disabled>Seleccionar requisito...</MenuItem>
                                      {field.type === "equipamiento" && equipamientos.map((e) => (
                                        <MenuItem key={e.id} value={e.equipamiento}>{e.equipamiento}</MenuItem>
                                      ))}
                                      {field.type === "rrhh" && rrhhList.map((r) => (
                                        <MenuItem key={r.id} value={`${r.origen} - ${r.especialidad}`}>{r.origen} - {r.especialidad}</MenuItem>
                                      ))}
                                      {field.type === "jefe_servicio" && jefeServicioList.map((j) => (
                                        <MenuItem key={j.id} value={`${j.origen} - ${j.especialidad}`}>{j.origen} - {j.especialidad}</MenuItem>
                                      ))}
                                    </Select>
                                  ) : (
                                    <TextField fullWidth size="small" variant="standard" placeholder="Nombre del parámetro..." value={field.label} onChange={(e) => {
                                      const newServicios = [...servicios];
                                      newServicios[srvIdx].sections[sidx].fields[fIdx].label = e.target.value;
                                      setServicios(newServicios);
                                    }} />
                                  )}
                                </>
                              )}
                            </TableCell>
                            <TableCell>
                              <Select fullWidth size="small" value={field.type} variant="standard" sx={{ fontSize: '0.85rem' }} onChange={(e) => {
                                const newServicios = [...servicios];
                                newServicios[srvIdx].sections[sidx].fields[fIdx].type = e.target.value;
                                setServicios(newServicios);
                              }}>
                                {fieldTypes.map(opt => <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.85rem' }}>{opt.label}</MenuItem>)}
                              </Select>
                              {(field.type === "select" || field.type === "toggle") && (
                                <Box sx={{ mt: 1 }}>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    variant="standard"
                                    placeholder="Nueva opción + Enter"
                                    value={optionDrafts[field.id] || ""}
                                    onChange={(e) =>
                                      setOptionDrafts((prev) => ({
                                        ...prev,
                                        [field.id]: e.target.value,
                                      }))
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === ",") {
                                        e.preventDefault();
                                        handleAddOption(fIdx, sidx, field.id);
                                      }
                                    }}
                                  />
                                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                                    {parseOptions(field.options).map((opt, oIdx) => (
                                      <Chip
                                        key={oIdx}
                                        label={opt}
                                        size="small"
                                        onDelete={() => handleRemoveOption(fIdx, sidx, opt)}
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <IconButton size="small" onClick={() => {
                                const newServicios = [...servicios];
                                newServicios[srvIdx].sections[sidx].fields.splice(fIdx, 1);
                                setServicios(newServicios);
                              }}><DeleteOutlineIcon fontSize="small" /></IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ p: 1, px: 4 }}>
                    <Button size="small" startIcon={<AddIcon />} onClick={() => {
                      const newServicios = [...servicios];
                      newServicios[srvIdx].sections[sidx].fields.push({ id: `new-${Date.now()}`, label: "", type: "text", options: "" });
                      setServicios(newServicios);
                    }}>Añadir parámetro en {section.name}</Button>
                  </Box>
                </Box>
              ))
            ) : (
              <TableContainer sx={{ backgroundColor: "#fff" }}>
                <Table size="small">
                  <TableHead sx={{ borderBottom: "2px solid #f1f5f9" }}>
                    <TableRow>
                      <TableCell sx={{ width: 40 }}></TableCell>
                      <TableCell sx={{ width: "180px", color: "#94a3b8", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>ORIGEN</TableCell>
                      <TableCell sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>PARÁMETRO / REF. TRÁMITE</TableCell>
                      <TableCell sx={{ width: "220px", color: "#94a3b8", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>TIPO DE DATO</TableCell>
                      <TableCell align="right" sx={{ width: 60 }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(srv.fields || []).map((field, fIdx) => (
                      <TableRow key={field.id} sx={{ "& td": { borderBottom: "1px solid #f1f5f9" }, "&:hover": { backgroundColor: "#fcfcfc" } }}>
                        <TableCell align="center"><DragIndicatorIcon sx={{ color: "#cbd5e1", opacity: 0.2 }} fontSize="small" /></TableCell>
                        <TableCell>
                          <ToggleButtonGroup
                            size="small"
                            value={field.origin === "TRÁMITE" ? "TRÁMITE" : "ADMIN"}
                            exclusive
                            onChange={(e, val) => {
                              if (!val) return;
                              handleUpdateField(fIdx, "origin", val);
                              if (val === "ADMIN") {
                                const newServicios = [...servicios];
                                delete newServicios[srvIdx].fields[fIdx].tramiteField;
                                setServicios(newServicios);
                              }
                            }}
                            sx={{
                              height: 32,
                              "& .MuiToggleButton-root": {
                                px: 2,
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                border: "1px solid #e2e8f0",
                                "&.Mui-selected": {
                                  bgcolor: "#0B85C4",
                                  color: "white",
                                  "&:hover": { bgcolor: "#096da1" }
                                }
                              }
                            }}
                          >
                            <ToggleButton value="ADMIN">ADMIN</ToggleButton>
                            <ToggleButton value="TRÁMITE">TRÁMITE</ToggleButton>
                          </ToggleButtonGroup>
                        </TableCell>
                        <TableCell>
                          {field.origin === "TRÁMITE" ? (
                            <Select
                              fullWidth
                              size="small"
                              value={field.tramiteField || ""}
                              variant="standard"
                              sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#0B85C4' }}
                              onChange={(e) => {
                                const val = e.target.value;
                                const newServicios = [...servicios];
                                newServicios[srvIdx].fields[fIdx].tramiteField = val;
                                newServicios[srvIdx].fields[fIdx].label = val.split(" > ")[1] || val;
                                setServicios(newServicios);
                              }}
                              displayEmpty
                            >
                              <MenuItem value="" disabled>Seleccionar campo del trámite...</MenuItem>
                              {Object.keys(TRAMITE_MAPPING).map(category => [
                                <MenuItem key={category} disabled sx={{ backgroundColor: '#f8fafc', fontWeight: 800, color: '#64748b', fontSize: '0.7rem' }}>
                                  {category}
                                </MenuItem>,
                                ...TRAMITE_MAPPING[category].map(f => (
                                  <MenuItem key={f} value={`${category} > ${f}`} sx={{ pl: 3, fontSize: '0.85rem' }}>
                                    {f}
                                  </MenuItem>
                                ))
                              ])}
                            </Select>
                          ) : (
                            <TextField
                              fullWidth
                              size="small"
                              variant="standard"
                              placeholder="Nombre del parámetro..."
                              value={field.label}
                              onChange={(e) => handleUpdateField(fIdx, "label", e.target.value)}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Select
                            fullWidth
                            size="small"
                            value={field.type}
                            onChange={(e) => handleUpdateField(fIdx, "type", e.target.value)}
                            sx={{ "& fieldset": { borderColor: "transparent" }, "&:hover fieldset": { borderColor: "#e2e8f0" }, fontSize: '0.85rem' }}
                          >
                            {fieldTypes.map((opt) => (
                              <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.85rem' }}>{opt.label}</MenuItem>
                            ))}
                          </Select>
                          {(field.type === "select" || field.type === "toggle") && (
                            <Box sx={{ mt: 1 }}>
                              <TextField
                                fullWidth
                                size="small"
                                variant="standard"
                                placeholder="Nueva opción + Enter"
                                value={optionDrafts[field.id] || ""}
                                onChange={(e) =>
                                  setOptionDrafts((prev) => ({
                                    ...prev,
                                    [field.id]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === ",") {
                                    e.preventDefault();
                                    handleAddOption(fIdx, null, field.id);
                                  }
                                }}
                              />
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                                {parseOptions(field.options).map((opt, oIdx) => (
                                  <Chip
                                    key={oIdx}
                                    label={opt}
                                    size="small"
                                    onDelete={() => handleRemoveOption(fIdx, null, opt)}
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleDeleteField(fIdx)}><DeleteOutlineIcon fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>

          {/* Botón Añadir Sección (si corresponde) */}
          <Box sx={{ p: 2, px: 4, backgroundColor: "#fcfcfc", borderTop: "1px dashed #e2e8f0" }}>
            <Button onClick={() => {
              const newServicios = [...servicios];
              if (!newServicios[srvIdx].sections) newServicios[srvIdx].sections = [];
              newServicios[srvIdx].sections.push({ id: `sec-${Date.now()}`, name: "Nueva Sección", fields: [] });
              setServicios(newServicios);
            }} startIcon={<AddIcon />} sx={{ fontWeight: 700 }}>
              Añadir nueva sección
            </Button>
            {!srv.sections && (
              <Button onClick={handleAddField} startIcon={<AddIcon />} sx={{ fontWeight: 700, ml: 2 }}>
                Añadir parámetro
              </Button>
            )}
          </Box>
        </Paper>
      </Box>

      {/* FAB SAVE */}
      <Tooltip title="Guardar Cambios" placement="left">
        <Fab
          variant="extended"
          color="primary"
          onClick={handleSaveConfig}
          sx={{
            position: "fixed",
            bottom: 40,
            right: 40,
            backgroundColor: "#32A430",
            "&:hover": {
              backgroundColor: "#278525",
            },
          }}
        >
          <SaveIcon sx={{ mr: 1 }} /> Guardar Cambios
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default ClinicasServicioEditor;
