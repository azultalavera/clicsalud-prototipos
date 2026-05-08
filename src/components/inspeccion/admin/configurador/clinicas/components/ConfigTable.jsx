import React from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  TextField,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  Button,
} from "@mui/material";
import { ListAlt as ListAltIcon, Add as AddIcon, Science as ScienceIcon, DeleteOutline as DeleteOutlineIcon, Edit as EditIcon } from "@mui/icons-material";
import { parseOptions } from "./utils";
import { ConfigContext } from "../ConfiguradorClinicas";
import { useContext } from "react";

const ConfigTable = ({
  calculatedFields,
  selectedCategoryId,
  servicios,
  setServicios,
  optionDrafts,
  setOptionDrafts,
  setHardcodeDialog,
  handleLoadMinimums,
  setAddRequirementDialog,
  fieldTypes,
  onEdit
}) => {
  const { mapping: TRAMITE_MAPPING, pasos: PASOS_TRAMITE } = useContext(ConfigContext);
  const handleAddOption = (row) => {
    const fieldId = row.id;
    const nextOption = (optionDrafts[fieldId] || "").trim();
    if (!nextOption) return;

    const newServicios = JSON.parse(JSON.stringify(servicios));

    if (row.idsByService) {
      newServicios.forEach(srv => {
        if (row.idsByService[srv.id]) {
          srv.sections.forEach(sec => {
            sec.fields = sec.fields.map(f => {
              if (f.id === row.idsByService[srv.id]) {
                const currentOptions = parseOptions(f.options);
                if (!currentOptions.some(opt => opt.toLowerCase() === nextOption.toLowerCase())) {
                  return { ...f, options: [...currentOptions, nextOption].join(", ") };
                }
              }
              return f;
            });
          });
        }
      });
    } else {
      const srv = newServicios[row._srvIdx];
      if (srv) {
        let targetFields = row._secIdx !== -1 ? srv.sections[row._secIdx].fields : srv.fields;
        if (targetFields && targetFields[row._originalIdx]) {
          const currentOptions = parseOptions(targetFields[row._originalIdx].options);
          if (!currentOptions.some(opt => opt.toLowerCase() === nextOption.toLowerCase())) {
            targetFields[row._originalIdx].options = [...currentOptions, nextOption].join(", ");
          }
        }
      }
    }
    setServicios(newServicios);
    setOptionDrafts(prev => ({ ...prev, [fieldId]: "" }));
  };

  const handleRemoveOption = (row, optionToRemove) => {
    const newServicios = JSON.parse(JSON.stringify(servicios));

    if (row.idsByService) {
      newServicios.forEach(srv => {
        if (row.idsByService[srv.id]) {
          srv.sections.forEach(sec => {
            sec.fields = sec.fields.map(f => {
              if (f.id === row.idsByService[srv.id]) {
                const remainingOptions = parseOptions(f.options).filter(opt => opt !== optionToRemove);
                return { ...f, options: remainingOptions.join(", ") };
              }
              return f;
            });
          });
        }
      });
    } else {
      const srv = newServicios[row._srvIdx];
      if (srv) {
        let targetFields = row._secIdx !== -1 ? srv.sections[row._secIdx].fields : srv.fields;
        if (targetFields && targetFields[row._originalIdx]) {
          const remainingOptions = parseOptions(targetFields[row._originalIdx].options).filter(opt => opt !== optionToRemove);
          targetFields[row._originalIdx].options = remainingOptions.join(", ");
        }
      }
    }
    setServicios(newServicios);
  };

  return (
    <Box>
      <Table size="small">
        <TableHead sx={{ bgcolor: "#f8fafc", borderBottom: "2px solid #e2e8f0", position: "sticky", top: 0, zIndex: 10 }}>
          <TableRow>
            <TableCell sx={{ width: "160px", color: "#64748b", fontWeight: 800, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: "#f8fafc" }}>DATO</TableCell>
            <TableCell sx={{ width: "150px", color: "#64748b", fontWeight: 800, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: "#f8fafc" }}>{selectedCategoryId?.startsWith("agg-") ? "PASO" : "SUBSECCIÓN"}</TableCell>
            <TableCell sx={{ color: "#64748b", fontWeight: 800, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: "#f8fafc" }}>REQUISITO</TableCell>
            <TableCell sx={{ width: "200px", color: "#64748b", fontWeight: 800, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: "#f8fafc" }}>TIPO DE DATO</TableCell>
            <TableCell align="center" sx={{ width: 110, color: "#64748b", fontWeight: 800, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: "#f8fafc" }}>ACCIONES</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {calculatedFields.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} sx={{ py: 10, textAlign: "center", color: "#94a3b8" }}>
                No hay requisitos configurados. Usa "Cargar Mínimos" para empezar.
              </TableCell>
            </TableRow>
          ) : (
            calculatedFields.map((row) => (
              <TableRow key={row.id} sx={{ "&:hover": { bgcolor: "#fcfcfc" }, "& td": { borderBottom: "1px solid #f1f5f9" } }}>
                <TableCell sx={{ width: 130, py: 1 }}>
                  <Chip 
                    label={row.origin === "TRÁMITE" ? "TRÁMITE" : "ADMIN"} 
                    size="small" 
                    sx={{ 
                      fontWeight: 800, 
                      fontSize: "0.68rem", 
                      bgcolor: row.origin === "TRÁMITE" ? "#0B85C4" : "#f1f5f9", 
                      color: row.origin === "TRÁMITE" ? "white" : "#64748b",
                      borderRadius: 1
                    }} 
                  />
                </TableCell>

                <TableCell sx={{ width: 150, py: 1 }}>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8" }}>
                    {(row.origin === "TRÁMITE" ? row.pasoTramite : row._secName) || "N/A"}
                  </Typography>
                </TableCell>

                <TableCell sx={{ py: 1 }}>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: row.origin === "TRÁMITE" ? "#0B85C4" : "#1e293b" }}>
                    {row.label || "Sin nombre"}
                  </Typography>
                  {row.origin === "TRÁMITE" && row.tramiteField && (
                    <Typography sx={{ fontSize: "0.65rem", color: "#64748b", mt: 0.5, letterSpacing: "0.02em" }}>
                      Mapeado a: {row.tramiteField}
                    </Typography>
                  )}
                  {row.tramiteService && (
                    <Typography variant="caption" sx={{ display: 'block', color: '#0ea5e9', fontWeight: 900, mt: 0.5, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                      SERVICIO: {row.tramiteService}
                    </Typography>
                  )}
                </TableCell>

                <TableCell sx={{ width: 200, py: 1 }}>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#475569" }}>
                    {fieldTypes.find(opt => opt.value === row.type)?.label || row.type || "Texto"}
                  </Typography>
                  {(row.type === "toggle" || row.type === "select") && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                      {parseOptions(row.options).map((opt, idx) => (
                        <Chip
                          key={idx}
                          label={opt}
                          size="small"
                          sx={{ height: 18, fontSize: "0.6rem", fontWeight: 700, bgcolor: "#f1f5f9" }}
                        />
                      ))}
                    </Box>
                  )}
                </TableCell>

                <TableCell align="center" sx={{ width: 110, py: 1 }}>
                  <Stack direction="row" spacing={0.5} justifyContent="center">
                    <Tooltip title="Simular valor (Hardcode)">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setHardcodeDialog({
                            open: true,
                            field: row,
                            value: row.valorTramite || "",
                            srvIdx: row._srvIdx ?? -1,
                            secIdx: row._secIdx ?? -1,
                            fIdx: row._originalIdx ?? -1,
                          });
                        }}
                        sx={{
                          color: "#0ea5e9",
                          bgcolor: "rgba(14, 165, 233, 0.08)",
                          "&:hover": { bgcolor: "rgba(14, 165, 233, 0.18)" }
                        }}
                      >
                        <ScienceIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar requisito">
                      <IconButton size="small" onClick={() => onEdit && onEdit(row)} sx={{ color: "#94a3b8", "&:hover": { color: "#0ea5e9" } }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <IconButton size="small" onClick={() => {
                      const newServicios = (servicios || []).map(srv => {
                        if (row.idsByService && row.idsByService[srv.id]) {
                          return {
                            ...srv,
                            sections: srv.sections.map(sec => ({
                              ...sec,
                              fields: sec.fields.filter(f => f.id !== row.idsByService[srv.id])
                            }))
                          };
                        }
                        if (!row.idsByService && row._srvIdx === servicios.indexOf(srv)) {
                          if (row._secIdx !== -1) {
                            return {
                              ...srv,
                              sections: srv.sections.map((sec, si) =>
                                si === row._secIdx
                                  ? { ...sec, fields: sec.fields.filter((_, fi) => fi !== row._originalIdx) }
                                  : sec
                              )
                            };
                          } else {
                            return { ...srv, fields: (srv.fields || []).filter((_, fi) => fi !== row._originalIdx) };
                          }
                        }
                        return srv;
                      });
                      setServicios(newServicios);
                    }} sx={{ color: "#94a3b8", "&:hover": { color: "#ef4444" } }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Box sx={{ p: 2, bgcolor: "#fcfcfc", borderTop: "1px solid #e2e8f0", textAlign: "center", display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ListAltIcon />}
          onClick={handleLoadMinimums}
          sx={{ textTransform: "none", fontWeight: 800, borderRadius: 2, borderColor: "#0B85C4", color: "#0B85C4" }}
        >
          Cargar Mínimos Automáticos
        </Button>
      </Box>
    </Box>
  );
};

export default ConfigTable;
