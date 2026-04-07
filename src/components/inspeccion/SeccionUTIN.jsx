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
      bgcolor: value ? "#e1f5fe" : "transparent",
      transition: "0.2s",
    }}
  >
    <Typography variant="body2" sx={{ fontWeight: 500, color: "#444", flex: 1, pr: 2 }}>
      {label}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography variant="caption" sx={{ fontWeight: "900", color: value ? "#0288d1" : "#999" }}>
        {value ? "SÍ" : "NO"}
      </Typography>
      <Switch size="small" checked={!!value} onChange={onChange} color="info" />
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

const registros = [
  { key: "utin_planillas", label: "Planillas de enfermería con controles diarios" },
  { key: "utin_signos", label: "Signos vitales" },
  { key: "utin_balance", label: "Balance diario" },
  { key: "utin_volumenes", label: "Volúmenes de ingresos y egresos" },
  { key: "utin_medicacion", label: "Medicación" },
];

const edificios = [
  { key: "utin_semirrestringida", label: "Unidad ubicada en zona de circulación semirrestringida" },
  { key: "utin_pileta", label: "Sala de internación c/pileta lavamanos" },
  { key: "utin_office_monitores", label: "Office de enfermería con monitores" },
  { key: "utin_ropa_limpia", label: "Área de depósito de ropa limpia" },
  { key: "utin_sucio", label: "Local de ropa y material usado" },
  { key: "utin_pileta_material", label: "Pileta para material" },
  { key: "utin_deposito_incubadoras", label: "Depósito para incubadora/cuna/aparatos" },
  { key: "utin_sala_medicos", label: "Sala de médicos" },
  { key: "utin_camilla_codo", label: "Camillas accionadas a codo" },
  { key: "utin_camilla_pie", label: "Camilla a pie" },
  { key: "utin_camilla_electrica", label: "Camilla a electricidad" },
  { key: "utin_lactario", label: "Local de fórmulas lácteas" },
  { key: "utin_extractor_filtro", label: "Extractor de aire con filtro" },
  { key: "utin_ventilacion", label: "Ventilación" },
  { key: "utin_acceso_exclusivo", label: "Acceso directo y exclusivo" },
  { key: "utin_privacidad", label: "Privacidad" },
  { key: "utin_incubadoras", label: "Incubadoras" },
  { key: "utin_fuente_oxigeno_1", label: "Fuente de oxígeno" },
  { key: "utin_aire_comprimido", label: "Aire comprimido" },
  { key: "utin_aspiracion", label: "Aspiración" },
  { key: "utin_unidades_aislamiento", label: "Unidades de aislamiento" },
  { key: "utin_ventanas_fijo", label: "Ventanas al exterior de paño fijo" },
  { key: "utin_iluminacion_difusa", label: "Iluminación individual difusa" },
  { key: "utin_vision", label: "Visión panorámica directa a todas las camas" },
  { key: "utin_esteril", label: "Local de Instrumental y material estéril" },
  { key: "utin_aislamiento", label: "Local cerrado c/2 unidades para aislamiento" },
  { key: "utin_lavabo_propio", label: "Lavabo propio" },
  { key: "utin_vestuario", label: "Vestuario para visitas c/pileta lavamanos" },
  { key: "utin_jabon_liquido", label: "Dispensador de jabón líquido" },
  { key: "utin_sanitarios_personal", label: "Sanitarios para el personal" },
  { key: "utin_habitacion_guardia", label: "Habitación, c/baño propio para médico de Guardia" },
  { key: "utin_dispensador_liquido", label: "Con dispensador líquido" },
  { key: "utin_toalla_papel", label: "Toalla de papel" },
  { key: "utin_armario_llave", label: "Armario con llave" },
  { key: "utin_tomas_indep", label: "Ocho tomas de electricidad por cama con tablero independiente" },
  { key: "utin_climatizacion", label: "Sistema calefacción refrigeración" },
  { key: "utin_facil_cirugia", label: "Fácil comunicación c/cirugía" },
  { key: "utin_consola_monitoreo", label: "Consola de monitoreo" },
  { key: "utin_repisa_individual", label: "Repisa individual" },
  { key: "utin_cunas", label: "Cunas" },
  { key: "utin_fuente_oxigeno_2", label: "Fuente de oxígeno en internación" },
  { key: "utin_consola_secundaria", label: "Consola para monitoreo" },
  { key: "utin_ventanas_exterior", label: "Ventanas al exterior" },
  { key: "utin_iluminacion_natural", label: "Iluminación natural" },
  { key: "utin_iluminacion_artificial", label: "Iluminación artificial central" },
];

const equipamientoInternacion = [
  { key: "utin_incubadoras_cerradas", label: "Incubadoras a servocontrol de circuito cerrado 6 (seis)" },
  { key: "utin_incubadoras_reserva", label: "Incubadoras a servocontrol de reserva 2 (dos)" },
  { key: "utin_incubadora_transporte", label: "Incubadora de transporte 2 (dos)" },
  { key: "utin_servocunas", label: "Incubadoras servocunas 2 (dos)" },
  { key: "utin_cunas_dos", label: "Cunas 2 (dos)" },
  { key: "utin_monitores_transcutaneos", label: "Monitores transcutáneos de oxígeno 1 (uno)" },
  { key: "utin_respirador_neonatal", label: "Respirador de uso neonatal con respiración sincronizada del paciente 2 (dos)" },
  { key: "utin_blender", label: "Mezclador de oxígeno - aire comprimido (Blender) 8 (ocho)" },
  { key: "utin_halocefalico", label: "Halocefálico con tapa rebatible 3 pequeños y 3 medianos" },
  { key: "utin_reanimacion", label: "Equipo para reanimación completo 2 (dos)" },
  { key: "utin_aspirador_regulable", label: "Aspirador regulable con manómetro 1 (uno)" },
  { key: "utin_desfibrilador_sincronizador", label: "Sincronizador desfibrilador con paletas neonatal 1 (uno)" },
  { key: "utin_balanza_electronica", label: "Balanza electrónica 1 (una)" },
  { key: "utin_electrocardiografo", label: "Electrocardiógrafo 1 (uno)" },
  { key: "utin_pediometro", label: "Pediómetro 1 (uno)" },
  { key: "utin_reloj_segundero", label: "Reloj de pared con segundero 1 (uno)" },
  { key: "utin_ecografo_portatil", label: "Ecógrafo portátil para ecografías ECO Doppler color 1 (uno)" },
  { key: "utin_cocina_formula", label: "Cocina de 2 hornallas para fórmula láctea" },
  { key: "utin_heladera_formula", label: "Heladera para fórmula láctea" },
  { key: "utin_gases_central", label: "Oxígeno, aire comprimido y aspiración central una toma por unidad" },
  { key: "utin_tubos_portatiles", label: "Tubos de oxígeno portátil 2 (dos)" },
  { key: "utin_monitores_cardio", label: "Monitores cardiorrespiratorios 4 (cuatro)" },
  { key: "utin_tensiometro", label: "Tensiómetro Neonatal (efecto Doppler) 2 (dos)" },
  { key: "utin_bomba_jeringa", label: "Bomba de perfusión de jeringa 4 (cuatro)" },
  { key: "utin_bomba_continua", label: "Bomba de perfusión continua 4 (cuatro)" },
  { key: "utin_spot_luminoterapia", label: "Spot de luminoterapia 4 (cuatro)" },
  { key: "utin_oximetro_pulso", label: "Oxímetro de pulso 4 (cuatro)" },
  { key: "utin_canalizacion", label: "Canalización umbilical / curación / punción lumbar / drenaje torácico" },
  { key: "utin_humidificador", label: "Calentador humidificador tipo Fishel Paykel para cada halocefálico" },
  { key: "utin_balanzas_neonatales", label: "Balanzas neonatales / incubadoras 6 (seis)" },
  { key: "utin_mesa_central", label: "Mesa central 1 (una)" },
  { key: "utin_balanza_panales", label: "Balanza para pañales 1 (una)" },
  { key: "utin_eeg_portatil", label: "Electroencefalógrafo portátil 1 (uno)" },
  { key: "utin_lampara_portatil", label: "Lámpara portátil 1 (una)" },
  { key: "utin_rx_portatil", label: "Aparato de Rx portátil con 2 delantales plomados 1 (uno)" },
  { key: "utin_microondas_formula", label: "Horno de microondas para fórmula láctea" },
  { key: "utin_mesada_formula", label: "Mesada con pileta para fórmula láctea" },
];

const usoExclusivo = [
  { key: "utin_aspiracion_4camas", label: "Equipo de aspiración 1 cada 4 camas" },
  { key: "utin_tubos_oxigeno", label: "Tubos de oxígeno" },
  { key: "utin_desfibrilacion", label: "Equipo de desfibrilación" },
  { key: "utin_monitores_exclusivos", label: "Monitores" },
  { key: "utin_adaptador", label: "Adaptador" },
  { key: "utin_carro_curacion", label: "Carro de curación" },
  { key: "utin_tensiometro_exclusivo", label: "Tensiómetro" },
  { key: "utin_exanguineotransfusion", label: "Equipo de Exanguineotransfusión" },
  { key: "utin_ppcva_nasal", label: "Dispositivo PPCVA nasal" },
  { key: "utin_aspiracion_toracica", label: "Sistema de aspiración torácica" },
  { key: "utin_cateterizacion_vesical", label: "Equipos para cateterización vesical" },
  { key: "utin_cateterizacion_venosa", label: "Equipos para cateterización venosa" },
  { key: "utin_puncion_toracica", label: "Equipo para punción torácica" },
  { key: "utin_oximetro_portatil", label: "Oxímetro de pulso portátil" },
  { key: "utin_botiquin_urgencias", label: "Botiquín c/medicamentos para urgencias de 24 hs." },
  { key: "utin_oxigeno_aspiracion_cama", label: "Oxígeno y aspiración central c/boca individual para cada cama" },
  { key: "utin_respirador_volumetrico", label: "Respirador volumétrico c/presión positiva y negativa" },
  { key: "utin_canal_individual", label: "Canal individual por cama" },
  { key: "utin_comando_central", label: "Comando central" },
  { key: "utin_ambu", label: "Resucitador tipo AMBU" },
  { key: "utin_instrumental_examen", label: "Instrumental de examen" },
  { key: "utin_nebulizador", label: "Nebulizador" },
  { key: "utin_luminoterapia_equipo", label: "Equipo de luminoterapia" },
  { key: "utin_intubacion_endotraqueal", label: "Elementos para intubación endotraqueal" },
  { key: "utin_aspiracion_portatil", label: "Sistema portátil de aspiración para drenaje" },
  { key: "utin_cateterizacion_nasogastrica", label: "Equipos para cateterización nasogástrica" },
  { key: "utin_puncion_raquidea", label: "Equipo para punción raquídea" },
  { key: "utin_puncion_abdominal", label: "Equipo para punción abdominal" },
  { key: "utin_bomba_infusion", label: "Bomba de infusión continua" },
  { key: "utin_incubadoras_portatiles", label: "Incubadoras portátiles c/control de t° y alarma" },
  { key: "utin_caja_paro", label: "Caja de paro" },
];

const apoyo = [
  { key: "utin_cronograma", label: "Cronograma de trabajo" },
  { key: "utin_lab_bioquimico", label: "Lab. bioquímico" },
  { key: "utin_hemoterapia", label: "Hemoterapia" },
  { key: "utin_radiologia", label: "Radiología" },
];

const SeccionUTIN = ({ data, onDataChange }) => {
  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="subtitle2" sx={{ color: "#01579b", fontWeight: "bold", mb: 1.5, mt: 2, textTransform: "uppercase" }}>
        Datos Generales
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #f0f0f0", bgcolor: "#fafafa" }}>
          <TextField
            fullWidth
            label="N° de camas"
            variant="standard"
            type="number"
            value={data.utin_n_camas || ""}
            onChange={(e) => onDataChange("utin_n_camas", e.target.value)}
          />
        </Box>
      </Paper>

      <Typography variant="subtitle2" sx={{ color: "#01579b", fontWeight: "bold", mb: 1.5, textTransform: "uppercase" }}>
        Planillas de enfermería con controles diarios
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        {renderBooleanItems(registros, data, onDataChange)}
      </Paper>

      <Typography variant="subtitle2" sx={{ color: "#01579b", fontWeight: "bold", mb: 1.5, textTransform: "uppercase" }}>
        Edificios y Locales de la Unidad
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #f0f0f0", bgcolor: "#fafafa" }}>
          <TextField
            fullWidth
            label="Superficie total sala internación UTIN (m²)"
            variant="standard"
            type="number"
            value={data.utin_superficie || ""}
            onChange={(e) => onDataChange("utin_superficie", e.target.value)}
          />
        </Box>
        {renderBooleanItems(edificios, data, onDataChange)}
      </Paper>

      <Typography variant="subtitle2" sx={{ color: "#01579b", fontWeight: "bold", mb: 1.5, textTransform: "uppercase" }}>
        Equipamiento en internación cada 8 unidades
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        {renderBooleanItems(equipamientoInternacion, data, onDataChange)}
      </Paper>

      <Typography variant="subtitle2" sx={{ color: "#01579b", fontWeight: "bold", mb: 1.5, textTransform: "uppercase" }}>
        Equipamiento de uso exclusivo
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        {renderBooleanItems(usoExclusivo, data, onDataChange)}
      </Paper>

      <Typography variant="subtitle2" sx={{ color: "#01579b", fontWeight: "bold", mb: 1.5, textTransform: "uppercase" }}>
        Servicios de apoyo y gestión
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 3 }}>
        {renderBooleanItems(apoyo, data, onDataChange)}
      </Paper>
    </Box>
  );
};

export default SeccionUTIN;