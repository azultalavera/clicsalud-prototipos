import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  ListSubheader
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { normalize } from "./utils";
import { fieldTypes, ConfigContext } from "../ConfiguradorClinicas";

const AddRequirementDialog = ({ open, onClose, onConfirm, availableServices, initialSelected, category }) => {
  const { mapping } = useContext(ConfigContext);
  const [origin, setOrigin] = useState("ADMIN");
  const [label, setLabel] = useState("");
  const [tramiteField, setTramiteField] = useState("");
  const [pasoTramite, setPasoTramite] = useState("");
  const [type, setType] = useState("text");
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      setOrigin("ADMIN");
      setLabel("");
      setTramiteField("");
      setPasoTramite("");
      setType("text");
      setSelected(initialSelected || []);
      setSearch("");
    }
  }, [open, initialSelected]);

  const filtered = availableServices.filter(s => normalize(s.name).includes(normalize(search)));

  const handleOriginChange = (event, newOrigin) => {
    if (newOrigin !== null) {
      setOrigin(newOrigin);
      setLabel("");
      setTramiteField("");
      setPasoTramite("");
    }
  };

  const handleTramiteSelect = (e) => {
    const val = e.target.value;
    setTramiteField(val);
    if (val) {
      const [paso, attr] = val.split(" > ");
      setPasoTramite(paso);
      setLabel(attr);
    } else {
      setPasoTramite("");
      setLabel("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontWeight: 900, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
        NUEVO REQUISITO {category && category !== "SERVICIO" ? `EN ${category}` : ""}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <ToggleButtonGroup
            color="primary"
            value={origin}
            exclusive
            onChange={handleOriginChange}
            size="small"
            sx={{ width: "100%" }}
          >
            <ToggleButton value="ADMIN" sx={{ flexGrow: 1, fontWeight: 800 }}>Sistema (Admin)</ToggleButton>
            <ToggleButton value="TRÁMITE" sx={{ flexGrow: 1, fontWeight: 800 }}>Mapeado a Trámite</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ mt: 1, display: "flex", gap: 2, mb: 3 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
              {origin === "ADMIN" ? "Nombre del Requisito" : "Seleccionar Campo del Trámite"}
            </Typography>
            {origin === "ADMIN" ? (
              <TextField
                fullWidth
                autoFocus
                size="small"
                placeholder="Ej: PLANILLAS DE CONTROL"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                sx={{ mt: 1 }}
              />
            ) : (
              <TextField
                select
                fullWidth
                size="small"
                value={tramiteField}
                onChange={handleTramiteSelect}
                sx={{ mt: 1 }}
              >
                <MenuItem value="">
                  <em>Seleccione un campo...</em>
                </MenuItem>
                {mapping && Object.keys(mapping).map(cat => [
                  <ListSubheader key={`header-${cat}`} sx={{ fontWeight: 900, bgcolor: "#f1f5f9", lineHeight: "36px" }}>
                    {cat}
                  </ListSubheader>,
                  ...mapping[cat].map(attr => (
                    <MenuItem key={`${cat} > ${attr}`} value={`${cat} > ${attr}`} sx={{ pl: 4 }}>
                      {attr}
                    </MenuItem>
                  ))
                ])}
              </TextField>
            )}
          </Box>
          <Box sx={{ width: 150 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Tipo de Dato</Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={type}
              onChange={(e) => setType(e.target.value)}
              sx={{ mt: 1 }}
            >
              {fieldTypes.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Asignar a Servicios</Typography>
          <Button size="small" onClick={() => setSelected(selected.length === availableServices.length ? [] : availableServices.map(s => s.id))}>
            {selected.length === availableServices.length ? "Deseleccionar Todo" : "Seleccionar Todo"}
          </Button>
        </Box>
        
        <TextField
          fullWidth
            size="small"
            placeholder="Filtrar servicios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 1 }}
          />

          <Paper variant="outlined" sx={{ maxHeight: 300, overflowY: "auto", borderRadius: 3, p: 1 }}>
            <List size="small">
              {filtered.map(srv => (
                <ListItemButton 
                  key={srv.id} 
                  dense 
                  onClick={() => setSelected(prev => prev.includes(srv.id) ? prev.filter(id => id !== srv.id) : [...prev, srv.id])}
                  selected={selected.includes(srv.id)}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemText primary={srv.name} primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: selected.includes(srv.id) ? 800 : 500 }} />
                  {selected.includes(srv.id) && <AddIcon sx={{ color: "#32A430", fontSize: 18 }} />}
                </ListItemButton>
              ))}
            </List>
          </Paper>
          <Typography variant="caption" sx={{ mt: 1, display: "block", color: "#94a3b8" }}>
            {selected.length} servicios seleccionados
          </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <Button onClick={onClose} sx={{ fontWeight: 700, textTransform: "none", color: "#64748b" }}>Cancelar</Button>
        <Button 
          variant="contained" 
          disabled={!label.trim() || selected.length === 0 || (origin === "TRÁMITE" && !tramiteField)}
          onClick={() => onConfirm(label, selected, type, origin, pasoTramite, tramiteField)}
          sx={{ fontWeight: 800, textTransform: "none", borderRadius: 3, px: 4, bgcolor: "#0B85C4" }}
        >
          Añadir Requisito
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRequirementDialog;
