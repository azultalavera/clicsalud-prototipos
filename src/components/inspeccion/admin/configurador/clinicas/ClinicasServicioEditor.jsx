import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
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

import {
  MedicalServices as MedicalServicesIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  DeleteOutline as DeleteOutlineIcon,
  Add as AddIcon,
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";
import { ConfigContext, slugify, fieldTypes } from "./ConfiguradorClinicas";

// ─── Atributos del Trámite ───────────────────────────────────────────────────
const TRAMITE_MAPPING = {
  "ARQUITECTURA": [
    "NOMBRE DEL ESTABLECIMIENTO",
    "PROFESIONAL DE AREA CONSTRUCTUIVA DATOS",
  ],
  "DIRECTOR TECNICO": [
    "NOMBRE",
    "APELLIDO",
    "DNI",
  ],
  "DATOS GENERALES > DATOS": [
    "FECHA VENCIMIENTO PLAN EVACUACION",
    "FECHA VENCIMIENTO BOMBEROS",
    "FECHA VENCIMIENTO EXTINGUIDORES",
  ],
};

// ─── Estilos compartidos de cabecera ─────────────────────────────────────────
const thSx = {
  color: "#94a3b8",
  fontWeight: 700,
  fontSize: "0.72rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  py: 1.5,
};

// ─── Componente de fila de campo ─────────────────────────────────────────────
const FieldRow = ({ field, fIdx, onChangeOrigin, onChangeTramite, onChangeLabel, onChangeType, onDelete }) => {
  const isAdmin = field.origin !== "TRÁMITE";

  return (
    <TableRow sx={{ "&:hover": { backgroundColor: "#fcfcfc" }, "& td": { borderBottom: "1px solid #f1f5f9" } }}>
      {/* DATO (toggle ADMIN / TRÁMITE) */}
      <TableCell sx={{ width: 190, py: 1 }}>
        <ToggleButtonGroup
          size="small"
          value={isAdmin ? "ADMIN" : "TRÁMITE"}
          exclusive
          onChange={(_, val) => val && onChangeOrigin(val)}
          sx={{
            height: 30,
            "& .MuiToggleButton-root": {
              px: 1.5,
              fontSize: "0.68rem",
              fontWeight: 700,
              border: "1px solid #e2e8f0",
              "&.Mui-selected": {
                bgcolor: "#0B85C4",
                color: "white",
                "&:hover": { bgcolor: "#096da1" },
              },
            },
          }}
        >
          <ToggleButton value="ADMIN">ADMIN</ToggleButton>
          <ToggleButton value="TRÁMITE">TRÁMITE</ToggleButton>
        </ToggleButtonGroup>
      </TableCell>

      {/* REQUISITO: input si ADMIN, combo si TRÁMITE */}
      <TableCell sx={{ py: 1 }}>
        {isAdmin ? (
          <TextField
            fullWidth
            size="small"
            variant="standard"
            placeholder="Escribir requisito..."
            value={field.label || ""}
            onChange={(e) => onChangeLabel(e.target.value)}
            InputProps={{ sx: { fontSize: "0.85rem" } }}
          />
        ) : (
          <Select
            fullWidth
            size="small"
            variant="standard"
            value={field.tramiteField || ""}
            displayEmpty
            onChange={(e) => onChangeTramite(e.target.value)}
            sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#0B85C4" }}
          >
            <MenuItem value="" disabled>
              Seleccionar atributo del trámite...
            </MenuItem>
            {Object.keys(TRAMITE_MAPPING).map((category) => [
              <MenuItem
                key={`cat-${category}`}
                disabled
                sx={{
                  backgroundColor: "#f8fafc",
                  fontWeight: 800,
                  color: "#64748b",
                  fontSize: "0.7rem",
                  letterSpacing: "0.05em",
                }}
              >
                {category}
              </MenuItem>,
              ...TRAMITE_MAPPING[category].map((attr) => (
                <MenuItem
                  key={attr}
                  value={`${category} > ${attr}`}
                  sx={{ pl: 3, fontSize: "0.85rem" }}
                >
                  {attr}
                </MenuItem>
              )),
            ])}
          </Select>
        )}
      </TableCell>

      {/* TIPO DE DATO (combo siempre) */}
      <TableCell sx={{ width: 200, py: 1 }}>
        <Select
          fullWidth
          size="small"
          variant="standard"
          value={field.type || "text"}
          onChange={(e) => onChangeType(e.target.value)}
          sx={{ fontSize: "0.85rem" }}
        >
          {fieldTypes.map((opt) => (
            <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: "0.85rem" }}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </TableCell>

      {/* ACCIONES */}
      <TableCell sx={{ width: 70, py: 1, textAlign: "center" }}>
        <IconButton size="small" onClick={onDelete} sx={{ color: "#94a3b8", "&:hover": { color: "#ef4444" } }}>
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

// ─── Cabecera de tabla ────────────────────────────────────────────────────────
const TableHeader = () => (
  <TableHead>
    <TableRow sx={{ backgroundColor: "#f8fafc" }}>
      <TableCell sx={thSx}>DATO</TableCell>
      <TableCell sx={thSx}>REQUISITO</TableCell>
      <TableCell sx={thSx}>TIPO DE DATO</TableCell>
      <TableCell sx={{ ...thSx, textAlign: "center" }}>ACCIONES</TableCell>
    </TableRow>
  </TableHead>
);

// ─── Componente principal ─────────────────────────────────────────────────────
const ClinicasServicioEditor = () => {
  const { tipologiaName, servicios, setServicios, handleSaveConfig } = useContext(ConfigContext);
  const { servicioSlug } = useParams();
  const navigate = useNavigate();

  const srvIdx = servicios.findIndex((s) => slugify(s.name) === servicioSlug);
  const srv = servicios[srvIdx];

  // ── helpers ──────────────────────────────────────────────────────────────
  const updateField = (sidx, fIdx, updates) => {
    const next = servicios.map((s, si) => {
      if (si !== srvIdx) return s;
      const clone = { ...s };
      if (sidx !== null) {
        clone.sections = s.sections.map((sec, si2) => {
          if (si2 !== sidx) return sec;
          return {
            ...sec,
            fields: sec.fields.map((f, fi) =>
              fi === fIdx ? { ...f, ...updates } : f
            ),
          };
        });
      } else {
        clone.fields = s.fields.map((f, fi) =>
          fi === fIdx ? { ...f, ...updates } : f
        );
      }
      return clone;
    });
    setServicios(next);
  };

  const deleteField = (sidx, fIdx) => {
    const next = servicios.map((s, si) => {
      if (si !== srvIdx) return s;
      const clone = { ...s };
      if (sidx !== null) {
        clone.sections = s.sections.map((sec, si2) => {
          if (si2 !== sidx) return sec;
          return { ...sec, fields: sec.fields.filter((_, fi) => fi !== fIdx) };
        });
      } else {
        clone.fields = s.fields.filter((_, fi) => fi !== fIdx);
      }
      return clone;
    });
    setServicios(next);
  };

  const addField = (sidx) => {
    const blank = { id: `f-${Date.now()}`, label: "", type: "text", origin: "ADMIN", options: "" };
    const next = servicios.map((s, si) => {
      if (si !== srvIdx) return s;
      const clone = { ...s };
      if (sidx !== null) {
        clone.sections = s.sections.map((sec, si2) =>
          si2 === sidx ? { ...sec, fields: [...sec.fields, blank] } : sec
        );
      } else {
        clone.fields = [...(s.fields || []), blank];
      }
      return clone;
    });
    setServicios(next);
  };

  const handleOriginChange = (sidx, fIdx, val) => {
    const updates = { origin: val };
    if (val === "ADMIN") updates.tramiteField = "";
    updateField(sidx, fIdx, updates);
  };

  const handleTramiteChange = (sidx, fIdx, rawVal) => {
    const label = rawVal.split(" > ").pop();
    const updates = {
      tramiteField: rawVal,
      label,
      type: label.toUpperCase().includes("FECHA") ? "date" : undefined,
    };
    if (!updates.type) delete updates.type;
    updateField(sidx, fIdx, updates);
  };

  if (!srv) return <Box sx={{ p: 5 }}>Servicio no encontrado.</Box>;

  const hasSections = srv.sections && srv.sections.length > 0;

  return (
    <Box sx={{ width: "75%", mx: "auto", p: { xs: 2, md: 4, lg: 6 }, fontFamily: "Roboto, sans-serif" }}>
      {/* Breadcrumb */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <IconButton onClick={() => navigate("..")} size="small" sx={{ backgroundColor: "#f1f5f9" }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
          Volver a {tipologiaName}
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Paper elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 4, overflow: "hidden", backgroundColor: "#fff" }}>
          {/* Header */}
          <Box sx={{ backgroundColor: "#ffffff", borderBottom: "2px solid rgba(11,133,196,0.2)", p: 3, display: "flex", alignItems: "center", gap: 3 }}>
            <Box sx={{ p: 1.5, backgroundColor: "rgba(11,133,196,0.05)", borderRadius: 2 }}>
              <MedicalServicesIcon sx={{ color: "#0B85C4", fontSize: 32 }} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="overline" sx={{ fontWeight: 800, color: "#000" }}>
                MATRIZ DE INSPECCIÓN
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                value={srv.name}
                onChange={(e) => {
                  const next = [...servicios];
                  next[srvIdx] = { ...next[srvIdx], name: e.target.value };
                  setServicios(next);
                }}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: "1.5rem", fontWeight: 800, color: "#0B85C4" },
                }}
              />
            </Box>
            <Chip
              label={`${(srv.fields?.length || 0) + (srv.sections?.reduce((a, s) => a + (s.fields?.length || 0), 0) || 0)} datos`}
              sx={{ backgroundColor: "rgba(11,133,196,0.1)", color: "#0B85C4", fontWeight: 700 }}
            />
          </Box>

          {/* Tablas */}
          <Box>
            {hasSections ? (
              srv.sections.map((section, sidx) => (
                <Box key={section.id} sx={{ mb: 0, borderBottom: "1px solid #e2e8f0" }}>
                  {/* Cabecera de sección */}
                  <Box sx={{ px: 4, py: 1.5, backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#475569", textTransform: "uppercase", fontSize: "0.75rem" }}>
                      Sección: {section.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const next = servicios.map((s, si) => {
                          if (si !== srvIdx) return s;
                          return { ...s, sections: s.sections.filter((_, i) => i !== sidx) };
                        });
                        setServicios(next);
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <TableContainer>
                    <Table size="small">
                      <TableHeader />
                      <TableBody>
                        {section.fields.map((field, fIdx) => (
                          <FieldRow
                            key={field.id}
                            field={field}
                            fIdx={fIdx}
                            onChangeOrigin={(val) => handleOriginChange(sidx, fIdx, val)}
                            onChangeTramite={(val) => handleTramiteChange(sidx, fIdx, val)}
                            onChangeLabel={(val) => updateField(sidx, fIdx, { label: val })}
                            onChangeType={(val) => updateField(sidx, fIdx, { type: val })}
                            onDelete={() => deleteField(sidx, fIdx)}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box sx={{ p: 1, px: 3 }}>
                    <Button size="small" startIcon={<AddIcon />} onClick={() => addField(sidx)} sx={{ fontWeight: 600, fontSize: "0.78rem" }}>
                      Añadir fila en {section.name}
                    </Button>
                  </Box>
                </Box>
              ))
            ) : (
              <Box>
                <TableContainer>
                  <Table size="small">
                    <TableHeader />
                    <TableBody>
                      {(srv.fields || []).map((field, fIdx) => (
                        <FieldRow
                          key={field.id}
                          field={field}
                          fIdx={fIdx}
                          onChangeOrigin={(val) => handleOriginChange(null, fIdx, val)}
                          onChangeTramite={(val) => handleTramiteChange(null, fIdx, val)}
                          onChangeLabel={(val) => updateField(null, fIdx, { label: val })}
                          onChangeType={(val) => updateField(null, fIdx, { type: val })}
                          onDelete={() => deleteField(null, fIdx)}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ p: 1, px: 3 }}>
                  <Button size="small" startIcon={<AddIcon />} onClick={() => addField(null)} sx={{ fontWeight: 600, fontSize: "0.78rem" }}>
                    Añadir fila
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          {/* Footer acciones globales */}
          <Box sx={{ p: 2, px: 4, backgroundColor: "#fcfcfc", borderTop: "1px dashed #e2e8f0" }}>
            <Button
              startIcon={<AddIcon />}
              sx={{ fontWeight: 700 }}
              onClick={() => {
                const next = servicios.map((s, si) => {
                  if (si !== srvIdx) return s;
                  const sections = [...(s.sections || []), { id: `sec-${Date.now()}`, name: "Nueva Sección", fields: [] }];
                  return { ...s, sections };
                });
                setServicios(next);
              }}
            >
              Añadir sección
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* FAB Guardar */}
      <Tooltip title="Guardar Cambios" placement="left">
        <Fab
          variant="extended"
          onClick={handleSaveConfig}
          sx={{ position: "fixed", bottom: 40, right: 40, backgroundColor: "#32A430", color: "#fff", "&:hover": { backgroundColor: "#278525" } }}
        >
          <SaveIcon sx={{ mr: 1 }} /> Guardar Cambios
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default ClinicasServicioEditor;
