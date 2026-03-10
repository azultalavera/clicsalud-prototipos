import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  Accordion,
  AccordionSummary,
  Stack,
  AccordionDetails,
  TextField,
  Tab,
  Tabs,
  Chip,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import SeccionUTI from "./SeccionUTI";
import SeccionUCO from "./SeccionUCO";
import SeccionUTIN from "./SeccionUTIN";
import SeccionHEMODINAMIA from "./SeccionHEMODINAMIA";

const ActaInspeccion = () => {
  const [data, setData] = useState({
    tipoInspeccion: "HABILITACIÓN",
    tipoHC: "DIGITAL",
    hc_estado: "COMPLETAS",
    ascensores: "AMBOS",
    extintores_vigo: "VIGENTE",
    venc_evac: "2029-01-01",
    venc_bomb: "2029-01-01",
    venc_ext: "2029-01-01",
    lab_ubi: "EXTERNO",
    lab_ges: "TERCERIZADO",
  });
  const handleChildDataChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };
  const [tabValue, setTabValue] = useState(0);

  const handleSwitch = (name) => (event) => {
    setData({ ...data, [name]: event.target.checked });
  };

  const handleToggle = (name) => (event, next) => {
    if (next !== null) setData({ ...data, [name]: next });
  };

  const renderFilaCheck = (label, key) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 1.5,
        px: 2,
        borderBottom: "1px solid #f0f0f0",
        bgcolor: data[key] ? "#f1f8e9" : "transparent",
        transition: "0.2s",
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500, color: "#444" }}>
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography
          variant="caption"
          sx={{ fontWeight: "900", color: data[key] ? "#2e7d32" : "#999" }}
        >
          {data[key] ? "SÍ" : "NO"}
        </Typography>
        <Switch
          size="small"
          checked={!!data[key]}
          onChange={handleSwitch(key)}
          color="success"
        />
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        p: { xs: 1 },
        maxWidth: "1200px",
        mx: "auto",
        bgcolor: "#ffffff",
        minHeight: "100vh",
      }}
    >
      {/* CABECERA UNIFICADA */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          mb: 3,
          border: "1px solid #e0e0e0",
          bgcolor: "#fff",
        }}
      >
        <Box sx={{ p: 3, bgcolor: "#005596", color: "white" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "900" }}>
                SANATORIO ALLENDE
              </Typography>
              <Chip
                label="CLÍNICAS, SANATORIOS Y HOSPITALES"
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: "bold",
                  mt: 1,
                }}
              />
            </Box>
          </Stack>
        </Box>
        <Box sx={{ p: 3 }}>
          <Box sx={{ fontWeight: "bold", display: "block", mb: 1 }}>
            <Typography
              variant="caption"
              sx={{ display: "block", fontWeight: "bold", mb: 1 }}
            >
              TIPO DE INSPECCIÓN
            </Typography>
            <ToggleButtonGroup
              value={data.tipoInspeccion}
              exclusive
              onChange={handleToggle("tipoInspeccion")}
              size="small"
              color="black"
              sx={{ bgcolor: "white" }}
            >
              <ToggleButton value="HABILITACION">HABILITACIÓN</ToggleButton>
              <ToggleButton value="RUTINA">RUTINA</ToggleButton>
              <ToggleButton value="DENUNCIA">DENUNCIA</ToggleButton>
            </ToggleButtonGroup>
            
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#005596",
                  fontWeight: "bold",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <AssignmentIndIcon fontSize="small" /> DIRECTOR TÉCNICO VIGENTE
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Apellido y Nombre"
                  variant="standard"
                  value="Dr. Barrardi Horacio"
                  InputProps={{ readOnly: true }}
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    fullWidth
                    label="DNI"
                    variant="standard"
                    value="10.566.234"
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    fullWidth
                    label="Matrícula"
                    variant="standard"
                    value="11551"
                    InputProps={{ readOnly: true }}
                  />
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#005596",
                  fontWeight: "bold",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <BusinessIcon fontSize="small" /> ANTECEDENTES DEL TRÁMITE
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Fecha de Habilitación"
                  variant="standard"
                  value="15/09/2023"
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  fullWidth
                  label="Resolución N°"
                  variant="standard"
                  value="1719"
                  InputProps={{ readOnly: true }}
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* CUERPO DE AUDITORÍA */}
      <Box sx={{ mb: 3 }}>
        {/* 1. REGISTROS */}
        <Accordion
          defaultExpanded
          variant="outlined"
          sx={{ borderRadius: "12px !important", mb: 1, overflow: "hidden" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ bgcolor: "#f8f9fa" }}
          >
            <Typography sx={{ fontWeight: "bold", color: "#005596" }}>
              REGISTROS E HISTORIA CLÍNICA
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", display: "block", mb: 1 }}
                  >
                    TIPO DE HISTORIA CLÍNICA
                  </Typography>
                  <ToggleButtonGroup
                    value={data.tipoHC}
                    exclusive
                    onChange={handleToggle("tipoHC")}
                    size="small"
                    fullWidth
                    color="primary"
                  >
                    <ToggleButton value="DIGITAL">DIGITAL</ToggleButton>
                    <ToggleButton value="PAPEL">PAPEL</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", display: "block", mb: 1 }}
                  >
                    REVISIÓN DE HISTORIA CLÍNICA
                  </Typography>
                  <ToggleButtonGroup
                    value={data.hc_estado}
                    exclusive
                    onChange={handleToggle("hc_estado")}
                    size="small"
                    fullWidth
                    color="primary"
                  >
                    <ToggleButton value="COMPLETAS">COMPLETAS</ToggleButton>
                    <ToggleButton value="INCOMPLETAS">INCOMPLETAS</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
              </Grid>
            </Box>
            {renderFilaCheck("Registro de Historia Clínicas", "reg_hc")}
            {renderFilaCheck(
              "Reglamento Interno / Manual Procedimientos",
              "manual_ok",
            )}
            {renderFilaCheck(
              "Aditamento privado / Denominación correcta",
              "denom_ok",
            )}
          </AccordionDetails>
        </Accordion>

        {/* 2. INFRAESTRUCTURA, EDIFICIO Y SEGURIDAD */}
        <Accordion
          variant="outlined"
          sx={{ borderRadius: "12px !important", mb: 1, overflow: "hidden" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ bgcolor: "#f8f9fa" }}
          >
            <Typography sx={{ fontWeight: "bold", color: "#005596" }}>
              INFRAESTRUCTURA, EDIFICIO Y SEGURIDAD
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Cantidad de Plantas"
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Últ. Insp. Conservador"
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", display: "block", mb: 1 }}
                  >
                    SISTEMA DE ELEVACIÓN
                  </Typography>
                  <ToggleButtonGroup
                    value={data.ascensores}
                    exclusive
                    onChange={handleToggle("ascensores")}
                    size="small"
                    fullWidth
                    color="primary"
                  >
                    <ToggleButton value="AMBOS">AMBOS</ToggleButton>
                    <ToggleButton value="MONTACAMILLAS">
                      MONTACAMILLAS
                    </ToggleButton>
                    <ToggleButton value="ASCENSORES">ASCENSORES</ToggleButton>
                    <ToggleButton value="NINGUNO">NINGUNO</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
              </Grid>
            </Box>
            {renderFilaCheck(
              "Baño para público discapacitado mixto",
              "baño_disc",
            )}
            {renderFilaCheck(
              "Libre ingreso, circulación y giro de camillas",
              "giro_camillas",
            )}
            {renderFilaCheck("Luces autónomas de emergencia", "luces_emerg")}
            {renderFilaCheck("Equipo Electrógenos", "electrogeno")}

            <Divider sx={{ my: 2 }}>
              <Chip label="CONSULTORIOS" size="small" />
            </Divider>
            {renderFilaCheck("Consultorios Externos", "cons_ext")}
            <Box sx={{ p: 2, bgcolor: "#fafafa" }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Total Consultorios"
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Con baño privado y vestuario"
                    variant="standard"
                  />
                </Grid>
              </Grid>
            </Box>
            {renderFilaCheck("Consultorio con lavabo", "lavabo_ok")}
            {renderFilaCheck("Consultorios Salud Mental", "mental_ok")}

            <Divider sx={{ my: 2 }}>
              <Chip label="SEGURIDAD Y VENCIMIENTOS" size="small" />
            </Divider>
            {renderFilaCheck("Plan Evacuación vigente", "plan_ok")}
            <Box sx={{ px: 2, pb: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="Vencimiento Plan Evacuación"
                variant="standard"
                value={data.venc_evac}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Box>

            <Box sx={{ p: 2, bgcolor: "#fcfcfc", borderTop: "1px solid #eee" }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: "bold", display: "block", mb: 1 }}
              >
                EXTINGUIDORES DE INCENDIOS
              </Typography>
              <ToggleButtonGroup
                value={data.extintores_vigo}
                exclusive
                onChange={handleToggle("extintores_vigo")}
                size="small"
                fullWidth
                color="primary"
                sx={{ mb: 2 }}
              >
                <ToggleButton value="VIGENTE">VIGENTE</ToggleButton>
                <ToggleButton value="NO VIGENTE">NO VIGENTE</ToggleButton>
              </ToggleButtonGroup>
              <TextField
                fullWidth
                type="date"
                label="Vencimiento Extinguidores"
                variant="standard"
                value={data.venc_ext}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Box>

            {renderFilaCheck("Salida de Emergencia", "salida_emerg")}
            {renderFilaCheck("Habilitación Bomberos", "bomberos_ok")}
            <Box sx={{ px: 2, pb: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="Vencimiento Bomberos"
                variant="standard"
                value={data.venc_bomb}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Box>

            {renderFilaCheck("Silla de Ruedas", "silla_ok")}
            {renderFilaCheck("Todas las camas tipo Ortopedia", "camas_orto")}
            {renderFilaCheck("Posee planos inclinados", "planos_inc")}
          </AccordionDetails>
        </Accordion>

        {/* 3. INTERNACIÓN Y RESIDUOS */}
        <Accordion
          variant="outlined"
          sx={{ borderRadius: "12px !important", mb: 1, overflow: "hidden" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ bgcolor: "#f8f9fa" }}
          >
            <Typography sx={{ fontWeight: "bold", color: "#005596" }}>
              SECTOR DE INTERNACIÓN Y RESIDUOS
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            {renderFilaCheck("Condiciones Edilicias", "cond_edi")}
            {renderFilaCheck("Área de Residuos", "residuos_ok")}
          </AccordionDetails>
        </Accordion>

        {/* 4. LABORATORIO */}
        <Accordion
          variant="outlined"
          sx={{ borderRadius: "12px !important", mb: 1, overflow: "hidden" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ bgcolor: "#f8f9fa" }}
          >
            <Typography sx={{ fontWeight: "bold", color: "#005596" }}>
              LABORATORIO
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", display: "block", mb: 1 }}
                  >
                    GESTIÓN
                  </Typography>
                  <ToggleButtonGroup
                    value={data.lab_ges}
                    exclusive
                    onChange={handleToggle("lab_ges")}
                    size="small"
                    fullWidth
                    color="primary"
                  >
                    <ToggleButton value="PROPIO">PROPIO</ToggleButton>
                    <ToggleButton value="TERCERIZADO">TERCERIZADO</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", display: "block", mb: 1 }}
                  >
                    UBICACIÓN
                  </Typography>
                  <ToggleButtonGroup
                    value={data.lab_ubi}
                    exclusive
                    onChange={handleToggle("lab_ubi")}
                    size="small"
                    fullWidth
                    color="primary"
                  >
                    <ToggleButton value="INTERNO">INTERNO</ToggleButton>
                    <ToggleButton value="EXTERNO">EXTERNO</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
              </Grid>
            </Box>
            {renderFilaCheck("Habilitación por Cobico", "cobico_ok")}
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* TABS SERVICIOS */}
      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        centered
        sx={{ mb: 2, bgcolor: "#fff", borderRadius: "12px" }}
      >
        <Tab label="TERAPIA (UTI)" />
        <Tab label="CORONARIA (UCO)" />
        <Tab label="TERAPIA NEONATAL (UTIN)" />
        <Tab label="HEMODINAMIA" />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {tabValue === 0 && (
          <SeccionUTI data={data} onDataChange={handleChildDataChange} />
        )}

        {tabValue === 1 && (
          <SeccionUCO data={data} onDataChange={handleChildDataChange} />
        )}

        {tabValue === 2 && (
          <SeccionUTIN data={data} onDataChange={handleChildDataChange} />
        )}

        {tabValue === 3 && (
          <SeccionHEMODINAMIA data={data} onDataChange={handleChildDataChange} />
        )}
      </Box>
    </Box>
  );
};

export default ActaInspeccion;
