import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Paper,
  Divider,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Fab,
  Stack,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import ApartmentIcon from "@mui/icons-material/Apartment";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import { useNavigate } from "react-router-dom";
import { ConfigContext, slugify, fieldTypes } from "./ConfiguradorClinicas";

const ClinicasDashboard = () => {
  const {
    tipologiaName,
    setTipologiaName,
    servicios,
    setServicios,
    loadConfig,
    handleSaveConfig,
    loading,
  } = useContext(ConfigContext);

  const tipologiaSlug = "clinicas-sanatorios-y-hospitales";
  const navigate = useNavigate();
  const [optionDrafts, setOptionDrafts] = useState({});

  const parseOptions = (options = "") =>
    String(options)
      .split(",")
      .map((option) => option.trim())
      .filter(Boolean);

  const renderTipologiaIcon = (slug, props = {}) => {
    switch (slug) {
      case "clinicas-sanatorios-y-hospitales":
        return <ApartmentIcon {...props} />;
      case "estetica-cosmiatria-y-cosmetologia":
        return <FaceRetouchingNaturalIcon {...props} />;
      case "geriatricos":
      case "salud-ambulatoria":
      case "cirugia-ambulatoria":
      case "consultorios":
      default:
        return <BusinessIcon {...props} />;
    }
  };

  // En caso de recargar página, intentamos recuperar la tipología basada en el slug si es posible
  // (Idealmente tendríamos un mapeo de slug -> nombre real)
  // Por ahora asumimos que el estado se mantiene o el usuario seleccionó desde el inicio.

  // --- Handlers ---
  const handleAddGeneralSection = () => {
    const newServicios = [...servicios];
    newServicios[0].sections.push({
      id: `sec-${Date.now()}`,
      name: "Nueva Sección",
      fields: [],
    });
    setServicios(newServicios);
  };

  const handleUpdateField = (
    serviceIdx,
    fieldIdx,
    key,
    value,
    sectionIdx = null,
  ) => {
    const newServicios = [...servicios];
    if (sectionIdx !== null) {
      newServicios[serviceIdx].sections[sectionIdx].fields[fieldIdx][key] =
        value;
    } else {
      newServicios[serviceIdx].fields[fieldIdx][key] = value;
    }
    setServicios(newServicios);
  };

  const handleAddField = (serviceIdx, sectionIdx = null) => {
    const newField = {
      id: `new-${Date.now()}`,
      label: "",
      type: "text",
      options: "",
    };
    const newServicios = [...servicios];
    if (sectionIdx !== null) {
      newServicios[serviceIdx].sections[sectionIdx].fields.push(newField);
    } else {
      newServicios[serviceIdx].fields.push(newField);
    }
    setServicios(newServicios);
  };

  const handleDeleteField = (serviceIdx, fieldIdx, sectionIdx = null) => {
    const newServicios = [...servicios];
    if (sectionIdx !== null) {
      newServicios[serviceIdx].sections[sectionIdx].fields.splice(fieldIdx, 1);
    } else {
      newServicios[serviceIdx].fields.splice(fieldIdx, 1);
    }
    setServicios(newServicios);
  };

  const handleAddService = () => {
    const newServicios = [...servicios];
    newServicios.push({
      id: `srv-${Date.now()}`,
      name: "Nuevo Servicio",
      isDeletable: true,
      fields: [],
    });
    setServicios(newServicios);
  };

  const handleDeleteService = (serviceIdx) => {
    if (window.confirm("¿Está seguro de eliminar este Servicio?")) {
      const newServicios = [...servicios];
      newServicios.splice(serviceIdx, 1);
      setServicios(newServicios);
    }
  };

  const handleAddOption = (serviceIdx, fieldIdx, sectionIdx, fieldId) => {
    const nextOption = (optionDrafts[fieldId] || "").trim();
    if (!nextOption) return;

    const sourceField =
      sectionIdx !== null
        ? servicios[serviceIdx].sections[sectionIdx].fields[fieldIdx]
        : servicios[serviceIdx].fields[fieldIdx];

    const currentOptions = parseOptions(sourceField.options);

    if (
      currentOptions.some(
        (option) => option.toLowerCase() === nextOption.toLowerCase(),
      )
    ) {
      setOptionDrafts((prev) => ({ ...prev, [fieldId]: "" }));
      return;
    }

    handleUpdateField(
      serviceIdx,
      fieldIdx,
      "options",
      [...currentOptions, nextOption].join(", "),
      sectionIdx,
    );
    setOptionDrafts((prev) => ({ ...prev, [fieldId]: "" }));
  };

  const handleRemoveOption = (
    serviceIdx,
    fieldIdx,
    sectionIdx,
    optionToRemove,
  ) => {
    const sourceField =
      sectionIdx !== null
        ? servicios[serviceIdx].sections[sectionIdx].fields[fieldIdx]
        : servicios[serviceIdx].fields[fieldIdx];

    const remainingOptions = parseOptions(sourceField.options).filter(
      (option) => option !== optionToRemove,
    );

    handleUpdateField(
      serviceIdx,
      fieldIdx,
      "options",
      remainingOptions.join(", "),
      sectionIdx,
    );
  };

  const tramiteServices = servicios.filter((s) => s.isTramite);
  const generalDataSrv = servicios.find((s) => s.id === "srv-gen");
  const otherServices = servicios.filter((s) => s.id !== "srv-gen" && !s.isTramite);

  if (loading) return <Box sx={{ p: 5 }}>Cargando configuración...</Box>;

  return (
    <Box sx={{ maxWidth: "1400px", width: "95%", mx: "auto", p: { xs: 2, md: 4, lg: 6 }, fontFamily: "Roboto, sans-serif" }}>
      {/* Top Header - Back Button */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton
          onClick={() => navigate("..")}
          size="small"
          sx={{ backgroundColor: "#f1f5f9" }}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography
          variant="body2"
          sx={{ ml: 2, color: "#64748b", fontWeight: 600 }}
        >
          Volver a Selector
        </Typography>
      </Box>

      {/* HEADER DE TIPOLOGÍA */}
      <Paper
        elevation={0}
        sx={{
          p: 5,
          mb: 6,
          backgroundColor: "#ffffff",
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          color: "#0B85C4",
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: "rgba(11, 133, 196, 0.05)",
            borderRadius: 3,
            border: "1px solid rgba(11, 133, 196, 0.2)",
          }}
        >
          {renderTipologiaIcon(tipologiaSlug, { sx: { fontSize: 48, color: "#0B85C4" } })}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="overline"
            sx={{
              color: "#000000",
              fontWeight: 800,
              letterSpacing: "0.15em",
              display: "block",
              mb: 0.5,
              fontFamily: "Roboto, sans-serif",
            }}
          >
            CONFIGURANDO TIPOLOGÍA
          </Typography>
          <TextField
            fullWidth
            variant="standard"
            value={tipologiaName}
            onChange={(e) => setTipologiaName(e.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: { color: "#0B85C4", fontSize: "2rem", fontWeight: 800, fontFamily: "Roboto, sans-serif" },
            }}
          />
        </Box>
      </Paper>

      {/* DATOS DEL TRAMITE */}
      {tipologiaSlug === "clinicas-sanatorios-y-hospitales" && tramiteServices.length > 0 && (
        <Box sx={{ mb: 6, p: 4, backgroundColor: "#fcfcfc", borderRadius: 4, border: "2px dashed #cbd5e1" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "#1e293b", mb: 3, fontFamily: "Roboto, sans-serif" }}
          >
            Datos del Trámite
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr", xl: "1fr 1fr 1fr 1fr" }, gap: 2 }}>
            {tramiteServices.map((srv) => (
              <Paper
                key={srv.id}
                onClick={() => navigate(slugify(srv.name))}
                elevation={0}
                sx={{
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                  borderRadius: 3,
                  "&:hover": {
                    borderColor: "#32A430",
                    boxShadow: "0 4px 12px rgba(50, 164, 48, 0.1)",
                  },
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#1e293b", textTransform: "uppercase" }}>
                  {srv.name}
                </Typography>
                <Chip
                  label={`${srv.fields.length} campos`}
                  size="small"
                  sx={{ backgroundColor: srv.fields.length > 0 ? "#dcfce7" : "#f1f5f9", color: srv.fields.length > 0 ? "#166534" : "#64748b", fontWeight: 700, fontSize: "0.75rem" }}
                />
              </Paper>
            ))}
          </Box>
        </Box>
      )}

      {/* SECCIÓN DATOS TÉCNICOS */}
      <Box sx={{ p: 4, backgroundColor: "#ffffff", borderRadius: 4, border: "1px solid #e2e8f0", mb: 8, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.05)" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 900, color: "#0f172a", mb: 5, pb: 2, borderBottom: "2px solid #e2e8f0", fontFamily: "Roboto, sans-serif" }}
        >
          Datos Técnicos
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.4fr 1fr" }, gap: { xs: 4, lg: 8 } }}>
          <Box>
        {/* DATOS GENERALES (CON ACORDEONES) */}
      {generalDataSrv && (
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "#0B85C4", mb: 4, fontFamily: "Roboto, sans-serif" }}
          >
            Datos Generales
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {generalDataSrv.sections.map((section, sIdx) => (
              <Accordion
                key={section.id}
                elevation={0}
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px !important",
                  overflow: "hidden",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#0B85C4" }} />}
                  sx={{
                    backgroundColor: "#ffffff",
                    borderBottom: "1px solid #e2e8f0",
                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",
                      gap: 2,
                    },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 800,
                      color: "#000000",
                      textTransform: "uppercase",
                      flexGrow: 1,
                      fontFamily: "Roboto, sans-serif",
                    }}
                  >
                    {section.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <Table size="small">
                    <TableHead
                      sx={{
                        backgroundColor: "#fff",
                        borderBottom: "2px solid #f1f5f9",
                      }}
                    >
                      <TableRow>
                        <TableCell sx={{ width: 40 }}></TableCell>
                        <TableCell
                          sx={{
                            color: "#94a3b8",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                          }}
                        >
                          ETIQUETA / PREGUNTA
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "220px",
                            color: "#94a3b8",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                          }}
                        >
                          TIPO
                        </TableCell>
                        <TableCell align="right" sx={{ width: 60 }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {section.fields.map((field, fIdx) => (
                        <TableRow
                          key={field.id}
                          sx={{ "& td": { borderBottom: "1px solid #f1f5f9" } }}
                        >
                          <TableCell align="center">
                            <DragIndicatorIcon
                              sx={{ color: "#cbd5e1", opacity: 0.2 }}
                              fontSize="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              variant="outlined"
                              value={field.label}
                              onChange={(e) =>
                                handleUpdateField(
                                  0,
                                  fIdx,
                                  "label",
                                  e.target.value,
                                  sIdx,
                                )
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": { borderColor: "transparent" },
                                },
                              }}
                            />
                            {field.type === "select" && (
                              <Box sx={{ mt: 1, px: 0.5 }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  variant="standard"
                                  placeholder="Escribí una opción"
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
                                      handleAddOption(0, fIdx, sIdx, field.id);
                                    }
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                  sx={{ display: "block", mt: 0.5 }}
                                >
                                  Presioná <b>Enter</b> para añadir la opción.
                                </Typography>

                                {parseOptions(field.options).length > 0 && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 0.5,
                                      mt: 1,
                                    }}
                                  >
                                    {parseOptions(field.options).map(
                                      (option, idx) => (
                                        <Chip
                                          key={`${field.id}-${option}-${idx}`}
                                          label={option}
                                          onDelete={() =>
                                            handleRemoveOption(
                                              0,
                                              fIdx,
                                              sIdx,
                                              option,
                                            )
                                          }
                                          size="small"
                                          variant="outlined"
                                          color="primary"
                                        />
                                      ),
                                    )}
                                  </Box>
                                )}
                              </Box>
                            )}
                          </TableCell>
                          <TableCell>
                            <TextField
                              select
                              fullWidth
                              size="small"
                              variant="standard"
                              InputProps={{ disableUnderline: true }}
                              value={field.type}
                              onChange={(e) =>
                                handleUpdateField(
                                  0,
                                  fIdx,
                                  "type",
                                  e.target.value,
                                  sIdx,
                                )
                              }
                            >
                              {fieldTypes.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </MenuItem>
                              ))}
                            </TextField>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteField(0, fIdx, sIdx)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Box
                    sx={{
                      p: 2,
                      textAlign: "center",
                      backgroundColor: "#fcfcfc",
                    }}
                  >
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => handleAddField(0, sIdx)}
                      sx={{ textTransform: "none", fontWeight: 700 }}
                    >
                      Añadir fila a {section.name}
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddGeneralSection}
              sx={{ py: 2, borderRadius: 3, borderStyle: "dashed" }}
            >
              Nueva Sección de Datos Generales
            </Button>
          </Box>
        </Box>
      )}
      </Box>

      <Box>
      {/* SERVICIOS */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: "#0B85C4", mb: 3, fontFamily: "Roboto, sans-serif" }}
        >
          Servicios a Inspeccionar
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {otherServices.map((srv) => {
            const srvIdx = servicios.indexOf(srv);
            return (
              <Paper
                key={srv.id}
                onClick={() => navigate(slugify(srv.name))}
                elevation={0}
                sx={{
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  cursor: "pointer",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                  borderRadius: 3,
                  "&:hover": {
                    borderColor: "#0B85C4",
                    backgroundColor: "rgba(11, 133, 196, 0.02)",
                  },
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: "rgba(11, 133, 196, 0.05)",
                    borderRadius: 2,
                    color: "#0B85C4",
                  }}
                >
                  <MedicalServicesIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#000000", fontFamily: "Roboto, sans-serif" }}>
                    {srv.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#000000", opacity: 0.7, fontFamily: "Roboto, sans-serif" }}>
                    Clic para configurar los parámetros de este servicio
                  </Typography>
                </Box>
                <Chip
                  label={`${srv.fields.length} parámetros`}
                  sx={{ fontWeight: 600, fontFamily: "Roboto, sans-serif" }}
                />
                {srv.isDeletable && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteService(srvIdx);
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                )}
              </Paper>
            );
          })}
          <Paper
            onClick={handleAddService}
            elevation={0}
            sx={{
              p: 3,
              textAlign: "center",
              border: "2px dashed #0B85C4",
              borderRadius: 3,
              backgroundColor: "#ffffff",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(11, 133, 196, 0.05)",
              }
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0B85C4", fontFamily: "Roboto, sans-serif" }}>
              + Añadir Nuevo Servicio
            </Typography>
          </Paper>
        </Box>
      </Box>
      </Box>
      </Box>
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
          <SaveIcon sx={{ mr: 1 }} />
          Guardar
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default ClinicasDashboard;
