import React, { useContext } from "react";
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
} from "@mui/material";
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

  const handleUpdateServiceName = (newName) => {
    const newServicios = [...servicios];
    newServicios[srvIdx].name = newName;
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
                          <TableCell sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>PARÁMETRO</TableCell>
                          <TableCell sx={{ width: "220px", color: "#94a3b8", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>TIPO</TableCell>
                          <TableCell align="right" sx={{ width: 60 }}></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {section.fields.map((field, fIdx) => (
                          <TableRow key={field.id} sx={{ "&:hover": { backgroundColor: "#fcfcfc" } }}>
                            <TableCell align="center"><DragIndicatorIcon sx={{ color: "#cbd5e1", opacity: 0.2 }} fontSize="small" /></TableCell>
                            <TableCell>
                              <TextField fullWidth size="small" variant="standard" value={field.label} onChange={(e) => {
                                  const newServicios = [...servicios];
                                  newServicios[srvIdx].sections[sidx].fields[fIdx].label = e.target.value;
                                  setServicios(newServicios);
                              }} />
                            </TableCell>
                            <TableCell>
                              <Select fullWidth size="small" value={field.type} variant="standard" onChange={(e) => {
                                  const newServicios = [...servicios];
                                  newServicios[srvIdx].sections[sidx].fields[fIdx].type = e.target.value;
                                  setServicios(newServicios);
                              }}>
                                {fieldTypes.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                              </Select>
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
                      <TableCell sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>PARÁMETRO A EVALUAR</TableCell>
                      <TableCell sx={{ width: "220px", color: "#94a3b8", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>TIPO DE DATO</TableCell>
                      <TableCell align="right" sx={{ width: 60 }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(srv.fields || []).map((field, fIdx) => (
                      <TableRow key={field.id} sx={{ "& td": { borderBottom: "1px solid #f1f5f9" }, "&:hover": { backgroundColor: "#fcfcfc" } }}>
                        <TableCell align="center"><DragIndicatorIcon sx={{ color: "#cbd5e1", opacity: 0.2 }} fontSize="small" /></TableCell>
                        <TableCell>
                          <TextField fullWidth size="small" variant="outlined" value={field.label} placeholder="Etiqueta..." onChange={(e) => handleUpdateField(fIdx, "label", e.target.value)} sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "transparent" }, "&:hover fieldset": { borderColor: "#e2e8f0" } } }} />
                        </TableCell>
                        <TableCell>
                          <Select fullWidth size="small" value={field.type} onChange={(e) => handleUpdateField(fIdx, "type", e.target.value)} sx={{ "& fieldset": { borderColor: "transparent" }, "&:hover fieldset": { borderColor: "#e2e8f0" } }}>
                            {fieldTypes.map((opt) => (
                              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                          </Select>
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
