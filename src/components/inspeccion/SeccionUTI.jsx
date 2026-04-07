import React from "react";
import { Box, Typography, TextField, Paper, Switch } from "@mui/material";

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
      bgcolor: value ? "#f1f8e9" : "transparent",
      transition: "0.2s",
    }}
  >
    <Typography variant="body2" sx={{ fontWeight: 500, color: "#444", flex: 1, pr: 2 }}>
      {label}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography variant="caption" sx={{ fontWeight: "900", color: value ? "#2e7d32" : "#999" }}>
        {value ? "SÍ" : "NO"}
      </Typography>
      <Switch size="small" checked={!!value} onChange={onChange} color="success" />
    </Box>
  </Box>
);

const renderBooleanItems = (items, data, onDataChange) =>
  items.map(({ key, label }) => (
    <FilaAuditoria
      key={key}
      label={label}
      value={data[key]}
      onChange={(e) => onDataChange(key, e.target.checked)}
    />
  ));

const datosGenerales = [
  { key: "uti_coincide_edificacion", label: "Coincide con edificación" },
  { key: "uti_planos", label: "Planos" },
];

const registros = [
  { key: "uti_planillas", label: "Planillas de enfermería con controles diarios" },
  { key: "uti_signos", label: "Signos vitales" },
  { key: "uti_balance", label: "Balance diario" },
  { key: "uti_volumenes", label: "Volúmenes de ingresos y egresos" },
  { key: "uti_medicacion", label: "Medicación" },
  { key: "uti_evoluciones", label: "Evoluciones diarias en Historia Clínica" },
  { key: "uti_libro_enf", label: "Libro de Registro de Enfermedades Transmisibles" },
  { key: "uti_libro_psico", label: "Libro de Registro de psicofármacos" },
];

const edificios = [
  { key: "uti_semirrestringida", label: "Unidad ubicada en zona de circulación semirrestringida" },
  { key: "uti_pileta", label: "Sala de internación c/pileta lavamanos" },
  { key: "uti_office", label: "Office de enfermería" },
  { key: "uti_sucio", label: "Local de ropa y material usado" },
  { key: "uti_lavachatas", label: "Área lavachatas" },
  { key: "uti_deposito", label: "Depósito de camillas y aparatología" },
  { key: "uti_sala_medicos", label: "Sala de médicos" },
  { key: "uti_otras_uni", label: "Posee otras Unidades de UCI / UCO" },
  { key: "uti_comparte", label: "Comparte algún local UCI / UCO" },
  { key: "uti_acceso_excl", label: "Acceso directo y exclusivo" },
  { key: "uti_com_cirugia", label: "Fácil comunicación c/cirugía" },
  { key: "uti_vision", label: "Visión panorámica directa a todas las camas" },
  { key: "uti_esteril", label: "Local de Instrumental y material estéril" },
  { key: "uti_aislamiento", label: "Local cerrado c/1 cama para aislamiento" },
  { key: "uti_vest_visitas", label: "Vestuario para visitas c/pileta lavamanos" },
  { key: "uti_dorm_medico", label: "Habitación, c/baño propio para médico de Guardia" },
];

const equipamiento = [
  { key: "uti_monitores", label: "Monitores" },
  { key: "uti_camas_orto", label: "Camas ortopédicas o articuladas" },
  { key: "uti_doble_comando", label: "Doble comando" },
  { key: "uti_rodantes", label: "Rodantes" },
  { key: "uti_acceso_4p", label: "Acceso desde 4 posiciones" },
];

const instalaciones = [
  { key: "uti_electrogeno", label: "Grupo electrógeno" },
  { key: "uti_luz_emerg", label: "Sistema de Iluminación de Emergencia" },
  { key: "uti_doble_circuito", label: "Doble circuito de energía eléctrica" },
  { key: "uti_tomas_cama", label: "Diez tomas de electricidad por cama" },
  { key: "uti_hermeticidad", label: "Hermeticidad" },
  { key: "uti_privacidad", label: "Privacidad" },
  { key: "uti_ventanas", label: "Ventanas al exterior" },
  { key: "uti_ilumin_nat", label: "Iluminación natural" },
  { key: "uti_ilumin_art", label: "Iluminación artificial central" },
  { key: "uti_ilumin_ind", label: "Iluminación Individual" },
];

const SeccionUTI = ({ data, onDataChange }) => {
  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="subtitle2" sx={{ color: "#005596", fontWeight: "bold", mb: 1.5, mt: 2, textTransform: "uppercase" }}>
        Datos Generales
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #f0f0f0", bgcolor: "#fafafa" }}>
          <TextField
            fullWidth
            label="N° de camas"
            variant="standard"
            type="number"
            value={data.uti_n_camas || ""}
            onChange={(e) => onDataChange("uti_n_camas", e.target.value)}
          />
        </Box>
        {renderBooleanItems(datosGenerales, data, onDataChange)}
      </Paper>

      <Typography variant="subtitle2" sx={{ color: "#005596", fontWeight: "bold", mb: 1.5, textTransform: "uppercase" }}>
        Planillas y Registros Obligatorios
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        {renderBooleanItems(registros, data, onDataChange)}
      </Paper>

      <Typography variant="subtitle2" sx={{ color: "#005596", fontWeight: "bold", mb: 1.5, textTransform: "uppercase" }}>
        Edificios y Locales de la Unidad
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        {renderBooleanItems(edificios, data, onDataChange)}
      </Paper>

      <Typography variant="subtitle2" sx={{ color: "#005596", fontWeight: "bold", mb: 1.5, textTransform: "uppercase" }}>
        Equipamiento y Mobiliario
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        {renderBooleanItems(equipamiento, data, onDataChange)}
      </Paper>

      <Typography variant="subtitle2" sx={{ color: "#005596", fontWeight: "bold", mb: 1.5, textTransform: "uppercase" }}>
        Instalaciones, Energía y Ambiente
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #f0f0f0", bgcolor: "#fafafa" }}>
          <TextField
            fullWidth
            label="Superficie total sala internación (m²)"
            variant="standard"
            type="number"
            value={data.uti_superficie || ""}
            onChange={(e) => onDataChange("uti_superficie", e.target.value)}
          />
        </Box>
        {renderBooleanItems(instalaciones, data, onDataChange)}
      </Paper>
    </Box>
  );
};

export default SeccionUTI;

