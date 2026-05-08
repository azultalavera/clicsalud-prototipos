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
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  ListSubheader
} from "@mui/material";
import { fieldTypes, ConfigContext } from "../ConfiguradorClinicas";

const EditRequirementDialog = ({ open, onClose, onConfirm, fieldData }) => {
  const { mapping } = useContext(ConfigContext);
  const [origin, setOrigin] = useState("ADMIN");
  const [label, setLabel] = useState("");
  const [tramiteField, setTramiteField] = useState("");
  const [pasoTramite, setPasoTramite] = useState("");
  const [type, setType] = useState("text");

  useEffect(() => {
    if (open && fieldData) {
      setOrigin(fieldData.origin || "ADMIN");
      setLabel(fieldData.label || "");
      setTramiteField(fieldData.tramiteField || "");
      setPasoTramite(fieldData.pasoTramite || "");
      setType(fieldData.type || "text");
    }
  }, [open, fieldData]);

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
        EDITAR REQUISITO
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

        <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
              {origin === "ADMIN" ? "Nombre del Requisito" : "Seleccionar Campo del Trámite"}
            </Typography>
            {origin === "ADMIN" ? (
              <TextField
                fullWidth
                autoFocus
                size="small"
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
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <Button onClick={onClose} sx={{ fontWeight: 700, textTransform: "none", color: "#64748b" }}>Cancelar</Button>
        <Button 
          variant="contained" 
          disabled={!label.trim() || (origin === "TRÁMITE" && !tramiteField)}
          onClick={() => onConfirm({ ...fieldData, label, origin, pasoTramite, tramiteField, type })}
          sx={{ fontWeight: 800, textTransform: "none", borderRadius: 3, px: 4, bgcolor: "#0B85C4" }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRequirementDialog;
