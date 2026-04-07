import React from "react";
import { Box, Typography, Paper, Switch, TextField } from "@mui/material";

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
      bgcolor: value ? "#fff9c4" : "transparent",
      transition: "0.2s",
    }}
  >
    <Typography variant="body2" sx={{ fontWeight: 500, color: "#444", flex: 1, pr: 2 }}>
      {label}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography variant="caption" sx={{ fontWeight: "900", color: value ? "#f57f17" : "#999" }}>
        {value ? "SÍ" : "NO"}
      </Typography>
      <Switch size="small" checked={!!value} onChange={onChange} color="warning" />
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
  { key: "uco_planos", label: "Planos" },
  { key: "uco_coincide_edificacion", label: "Coincide con edificación" },
];

const registros = [
  { key: "uco_planillas", label: "Planillas de enfermería con controles diarios" },
  { key: "uco_signos", label: "Signos vitales" },
  { key: "uco_balance", label: "Balance diario" },
  { key: "uco_volumenes", label: "Volúmenes de ingresos y egresos" },
  { key: "uco_medicacion", label: "Medicación" },
  { key: "uco_evoluciones", label: "Evoluciones diarias en Historia Clínica" },
];

const edificios = [
  { key: "uco_semirrestringida", label: "Unidad ubicada en zona de circulación semirrestringida" },
  { key: "uco_pileta", label: "Sala de internación c/pileta lavamanos" },
  { key: "uco_office", label: "Office de enfermería" },
  { key: "uco_monitores", label: "Monitores" },
  { key: "uco_sucio", label: "Local de ropa y material usado" },
  { key: "uco_lavachatas", label: "Área lavachatas" },
  { key: "uco_deposito", label: "Depósito de camillas y aparatología" },
  { key: "uco_sala_medicos", label: "Sala de médicos" },
  { key: "uco_electrogeno", label: "Grupo electrógeno" },
  { key: "uco_acceso_excl", label: "Acceso directo y exclusivo" },
  { key: "uco_com_cirugia", label: "Fácil comunicación c/cirugía" },
  { key: "uco_privacidad", label: "Privacidad" },
  { key: "uco_vision", label: "Visión panorámica directa a todas las camas" },
  { key: "uco_esteril", label: "Local de Instrumental y material estéril" },
  { key: "uco_aislamiento", label: "Local cerrado c/1 cama para aislamiento" },
  { key: "uco_vest_visitas", label: "Vestuario para visitas c/pileta lavamanos" },
  { key: "uco_dorm_medico", label: "Habitación, c/baño propio para médico de Guardia" },
  { key: "uco_comparte", label: "Comparte algún local UCI / UCO" },
  { key: "uco_otras_uni", label: "Posee otras Unidades de UCI / UCO" },
];

const equipamiento = [
  { key: "uco_camas_orto", label: "Camas ortopédicas o articuladas" },
  { key: "uco_doble_comando", label: "Doble comando" },
  { key: "uco_rodantes", label: "Rodantes" },
  { key: "uco_plano_rigido", label: "Plano de apoyo rígido" },
  { key: "uco_acceso_4p", label: "Acceso desde 4 posiciones" },
];

const instalaciones = [
  { key: "uco_luz_emerg", label: "Sistema de Iluminación de Emergencia" },
  { key: "uco_tomas_cama", label: "Diez tomas de electricidad por cama" },
  { key: "uco_hermeticidad", label: "Hermeticidad" },
  { key: "uco_ventanas_fijo", label: "Ventanas al exterior de paño fijo" },
  { key: "uco_ilumin_nat", label: "Iluminación natural" },
  { key: "uco_ilumin_art", label: "Iluminación artificial central" },
  { key: "uco_ilumin_ind", label: "Iluminación Individual" },
];

const SeccionUCO = ({ data, onDataChange }) => {
  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="subtitle2" sx={{ color: "#e65100", fontWeight: "bold", mb: 1.5, mt: 2, textTransform: "uppercase" }}>
        Datos Generales
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #f0f0f0", bgcolor: "#fafafa" }}>
          <TextField
            fullWidth
            label="N° de camas"
            variant="standard"
            type="number"
            value={data.uco_n_camas || ""}
            onChange={(e) => onDataChange("uco_n_camas", e.target.value)}
          />
        </Box>
        {renderBooleanItems(datosGenerales, data, onDataChange)}
      </Paper>

      <Typography variant="subtitle2" sx={{ color: "#e65100", fontWeight: "bold", mb: 1.5, textTransform: "uppercase" }}>
        Planillas de enfermería con controles diarios
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        {renderBooleanItems(registros, data, onDataChange)}
      </Paper>

      <Typography variant="subtitle2" sx={{ color: "#e65100", fontWeight: "bold", mb: 1.5, textTransform: "uppercase" }}>
        Edificios y Locales de la Unidad
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        {renderBooleanItems(edificios, data, onDataChange)}
      </Paper>

      <Typography variant="subtitle2" sx={{ color: "#e65100", fontWeight: "bold", mb: 1.5, textTransform: "uppercase" }}>
        Equipamiento y Mobiliario
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        {renderBooleanItems(equipamiento, data, onDataChange)}
      </Paper>

      <Typography variant="subtitle2" sx={{ color: "#e65100", fontWeight: "bold", mb: 1.5, textTransform: "uppercase" }}>
        Instalaciones, Energía y Ambiente
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #f0f0f0", bgcolor: "#fafafa" }}>
          <TextField
            fullWidth
            label="Superficie total sala internación UCO (m²)"
            variant="standard"
            type="number"
            value={data.uco_superficie || ""}
            onChange={(e) => onDataChange("uco_superficie", e.target.value)}
          />
        </Box>
        {renderBooleanItems(instalaciones, data, onDataChange)}
      </Paper>
    </Box>
  );
};

export default SeccionUCO;