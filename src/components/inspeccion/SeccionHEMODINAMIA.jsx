import React from "react";
import { Box, Typography, Paper, Switch, Stack, TextField, Grid } from "@mui/material";

const FilaAuditoria = ({ label, value, onChange }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 2,
      py: 1.2,
      px: 2,
      borderBottom: "1px solid #f0f0f0",
      bgcolor: value ? "#fff3e0" : "transparent",
      transition: "0.2s",
    }}
  >
    <Typography variant="body2" sx={{ fontWeight: 500, color: "#444", flex: 1, pr: 2 }}>
      {label}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography variant="caption" sx={{ fontWeight: "900", color: value ? "#ef6c00" : "#999" }}>
        {value ? "SÍ" : "NO"}
      </Typography>
      <Switch size="small" checked={!!value} onChange={onChange} color="warning" />
    </Box>
  </Box>
);

const resolveBooleanValue = (data, key, fallbackKeys = []) =>
  [key, ...fallbackKeys].some((candidate) => !!data[candidate]);

const renderBooleanItems = (items, data, onDataChange) =>
  items.map(({ key, label, fallbackKeys }) => (
    <FilaAuditoria
      key={key}
      label={label}
      value={resolveBooleanValue(data, key, fallbackKeys)}
      onChange={(e) => onDataChange(key, e.target.checked)}
    />
  ));

const direccionYFuncionamiento = [
  { key: "hemo_independiente", label: "Unidad de Diálisis Independiente" },
  { key: "hemo_psico_act", label: "Registro de Psicofármacos Actualizado" },
  { key: "hemo_enf_trans", label: "Registro de Enfermedades Transmisibles" },
  { key: "hemo_reglamento", label: "Reglamento Interno" },
  { key: "hemo_plan_evac", label: "Plan de Evacuación", fallbackKeys: ["hemo_seguridad"] },
  { key: "hemo_bomberos", label: "Habilitación de Bomberos", fallbackKeys: ["hemo_seguridad"] },
  { key: "hemo_bioseg_exp", label: "Normas bioseguridad expuestas" },
  { key: "hemo_normas_medicos", label: "Normas de Procedimientos para Médicos", fallbackKeys: ["hemo_normas_proc"] },
  { key: "hemo_normas_enfermeria", label: "Normas de Procedimientos para enfermeras", fallbackKeys: ["hemo_normas_proc"] },
  { key: "hemo_incucai_nro", label: "Nro de Inscripción de pacientes al INCUCAI y/o ECODAI" },
  { key: "hemo_incucai_carpetas", label: "Carpetas de Inscripción de pacientes al INCUCAI y/o ECODAI" },
  { key: "hemo_convenio", label: "Convenio de Internación" },
  { key: "hemo_hc_completa", label: "Registro Historia clínica completa" },
  { key: "hemo_planillas_enf", label: "Planillas de Personal Enfermería" },
];

const serologiaPacientes = [
  { key: "ser_pac_hiv", label: "HIV" },
  { key: "ser_pac_hb", label: "Hepatitis B" },
  { key: "ser_pac_hc", label: "Hepatitis C" },
];

const serologiaPersonal = [
  { key: "ser_per_hiv", label: "HIV" },
  { key: "ser_per_hb", label: "Hepatitis B" },
  { key: "ser_per_hc", label: "Hepatitis C" },
];

const reusosYObservaciones = [
  { key: "hemo_libro_reusos", label: "Libro de Reusos" },
  { key: "hemo_obs_registradas", label: "Observaciones registradas" },
];

const SeccionHEMODINAMIA = ({ data, onDataChange }) => {
  return (
    <Box sx={{ mt: 1 }}>
      <Typography
        variant="subtitle2"
        sx={{ color: "#ef6c00", fontWeight: "bold", mb: 1.5, mt: 2, textTransform: "uppercase" }}
      >
        De la Dirección y Funcionamiento
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        {renderBooleanItems(direccionYFuncionamiento, data, onDataChange)}
      </Paper>

      <Typography
        variant="subtitle2"
        sx={{ color: "#ef6c00", fontWeight: "bold", mb: 1.5, textTransform: "uppercase" }}
      >
        Análisis de agua
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        <FilaAuditoria
          label="Físico, Químico"
          value={!!data.hemo_agua_fisico}
          onChange={(e) => onDataChange("hemo_agua_fisico", e.target.checked)}
        />
        <Box sx={{ px: 2, pb: 2, pt: 1, borderBottom: "1px solid #f0f0f0", bgcolor: "#fafafa" }}>
          <TextField
            fullWidth
            label="Fecha último físico-químico"
            type="date"
            variant="standard"
            InputLabelProps={{ shrink: true }}
            value={data.fecha_fisico || ""}
            onChange={(e) => onDataChange("fecha_fisico", e.target.value)}
          />
        </Box>
        <FilaAuditoria
          label="Bacteriológico"
          value={!!data.hemo_agua_bacterio}
          onChange={(e) => onDataChange("hemo_agua_bacterio", e.target.checked)}
        />
        <Box sx={{ px: 2, pb: 2, pt: 1, bgcolor: "#fafafa" }}>
          <TextField
            fullWidth
            label="Fecha último bacteriológico"
            type="date"
            variant="standard"
            InputLabelProps={{ shrink: true }}
            value={data.fecha_bacterio || ""}
            onChange={(e) => onDataChange("fecha_bacterio", e.target.value)}
          />
        </Box>
      </Paper>

      <Typography
        variant="subtitle2"
        sx={{ color: "#ef6c00", fontWeight: "bold", mb: 1.5, textTransform: "uppercase" }}
      >
        Posee serología del personal y pacientes
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        <Grid container>
          <Grid item xs={12} md={6} sx={{ borderRight: { md: "1px solid #eee" } }}>
            <Typography
              variant="caption"
              sx={{ p: 2, fontWeight: "bold", display: "block", textAlign: "center", bgcolor: "#f5f5f5" }}
            >
              PERSONAL
            </Typography>
            {renderBooleanItems(serologiaPersonal, data, onDataChange)}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="caption"
              sx={{ p: 2, fontWeight: "bold", display: "block", textAlign: "center", bgcolor: "#f5f5f5" }}
            >
              PACIENTES
            </Typography>
            {renderBooleanItems(serologiaPacientes, data, onDataChange)}
          </Grid>
        </Grid>
      </Paper>

      <Typography
        variant="subtitle2"
        sx={{ color: "#ef6c00", fontWeight: "bold", mb: 1.5, textTransform: "uppercase" }}
      >
        Libro de reusos y observaciones
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        {renderBooleanItems(reusosYObservaciones, data, onDataChange)}
        <Box sx={{ p: 2, bgcolor: "#fafafa", borderTop: "1px solid #f0f0f0" }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Cant. máxima reusos"
              type="number"
              variant="standard"
              value={data.hemo_reusos_max || ""}
              onChange={(e) => onDataChange("hemo_reusos_max", e.target.value)}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Detalle de observaciones"
              placeholder="Anote aquí detalles sobre filtros, reusos, hallazgos o novedades de la unidad..."
              value={data.hemo_obs || ""}
              onChange={(e) => onDataChange("hemo_obs", e.target.value)}
            />
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default SeccionHEMODINAMIA;