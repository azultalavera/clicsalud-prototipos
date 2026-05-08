import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Button,
  IconButton,
  Stack,
  Divider,
  Card,
  CardContent,
  Grid
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  DeleteOutline as DeleteOutlineIcon,
  Layers as LayersIcon,
  Subtitles as SubtitlesIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ConfigContext } from "../ConfiguradorClinicas";

const TramiteMappingEditor = () => {
  const { mapping, handleSaveTramiteConfig, loading } = useContext(ConfigContext);
  const navigate = useNavigate();

  const [localMapping, setLocalMapping] = useState({});
  const [newSubSecName, setNewSubSecName] = useState("");

  useEffect(() => {
    if (mapping) setLocalMapping(JSON.parse(JSON.stringify(mapping)));
  }, [mapping]);

  const handleAddSubSection = () => {
    if (!newSubSecName.trim()) return;
    const upper = newSubSecName.toUpperCase();
    if (localMapping[upper]) return;
    
    setLocalMapping({
      ...localMapping,
      [upper]: []
    });
    setNewSubSecName("");
  };

  const handleRemoveSubSection = (sub) => {
    const next = { ...localMapping };
    delete next[sub];
    setLocalMapping(next);
  };

  const handleAddRequirement = (sub) => {
    const next = { ...localMapping };
    next[sub] = [...next[sub], ""];
    setLocalMapping(next);
  };

  const handleUpdateRequirement = (sub, idx, val) => {
    const next = { ...localMapping };
    next[sub] = [...next[sub]];
    next[sub][idx] = val;
    setLocalMapping(next);
  };

  const handleRemoveRequirement = (sub, idx) => {
    const next = { ...localMapping };
    next[sub] = next[sub].filter((_, i) => i !== idx);
    setLocalMapping(next);
  };

  const handleSave = () => {
    // Usar las llaves como 'pasos' y el objeto como 'mapping'
    const newPasos = Object.keys(localMapping).sort();
    handleSaveTramiteConfig(localMapping, newPasos);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1400, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <IconButton onClick={() => navigate("..")} sx={{ bgcolor: "#f1f5f9" }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#1e293b", letterSpacing: "-0.02em" }}>
            Mapeo de Trámite
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Configura las subsecciones y sus requisitos internos para el origen TRÁMITE
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={loading}
          sx={{ borderRadius: 3, px: 4, fontWeight: 800, bgcolor: "#0B85C4", "&:hover": { bgcolor: "#096da1" } }}
        >
          Guardar Mapeo
        </Button>
      </Box>

      {/* TOOLBAR PARA NUEVA SUBSECCION */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 3, border: "1px solid #e2e8f0", display: "flex", gap: 2, alignItems: "center", bgcolor: "#f8fafc" }} elevation={0}>
        <LayersIcon sx={{ color: "#64748b" }} />
        <Typography sx={{ fontWeight: 800, color: "#475569", minWidth: 150 }}>Nueva Subsección:</Typography>
        <TextField 
          size="small" 
          placeholder="Ej: ARQUITECTURA, RRHH, EQUIPAMIENTO..." 
          value={newSubSecName}
          onChange={(e) => setNewSubSecName(e.target.value)}
          sx={{ bgcolor: "white", flexGrow: 1 }}
        />
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddSubSection}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
        >
          Añadir Subsección
        </Button>
      </Paper>

      <Grid container spacing={3}>
        {Object.keys(localMapping).sort().map(sub => (
          <Grid item xs={12} md={6} lg={4} key={sub}>
            <Card sx={{ height: "100%", borderRadius: 4, border: "1px solid #e2e8f0", boxShadow: "none", display: "flex", flexDirection: "column" }}>
              <Box sx={{ p: 2, bgcolor: "#f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
                <Typography sx={{ fontWeight: 900, color: "#334155", fontSize: "0.9rem" }}>{sub}</Typography>
                <IconButton size="small" color="error" onClick={() => handleRemoveSubSection(sub)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Stack spacing={1.5}>
                  {localMapping[sub].map((req, idx) => (
                    <Box key={idx} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <SubtitlesIcon sx={{ color: "#cbd5e1", fontSize: 18 }} />
                      <TextField 
                        fullWidth 
                        size="small" 
                        placeholder="Nombre del requisito..."
                        value={req} 
                        onChange={(e) => handleUpdateRequirement(sub, idx, e.target.value)}
                        variant="standard"
                        InputProps={{ sx: { fontSize: "0.85rem", fontWeight: 500 } }}
                      />
                      <IconButton size="small" onClick={() => handleRemoveRequirement(sub, idx)}>
                        <DeleteOutlineIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                      </IconButton>
                    </Box>
                  ))}
                  <Button 
                    fullWidth
                    startIcon={<AddIcon />} 
                    onClick={() => handleAddRequirement(sub)}
                    sx={{ mt: 2, border: "1px dashed #cbd5e1", borderRadius: 2, color: "#64748b", textTransform: "none", fontSize: "0.75rem" }}
                  >
                    Añadir Requisito
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TramiteMappingEditor;
