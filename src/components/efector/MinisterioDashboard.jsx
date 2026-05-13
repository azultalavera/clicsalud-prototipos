import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Avatar,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
} from "@mui/material";
import {
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
  PauseCircle as PauseCircleIcon,
  Assignment as AssignmentIcon,
  LocationOn as LocationOnIcon,
  LocalHospital as HospitalIcon,
  Apartment as ApartmentIcon,
  DonutLarge as DonutIcon,
  BarChart as BarChartIcon,
  MedicalServices as MedicalIcon,
  Healing as HealingIcon,
  FlashOn as UrgentIcon,
  ErrorOutline as ErrorIcon,
} from "@mui/icons-material";

import { MOCK_ESTABLECIMIENTOS, MOCK_TRAMITES } from "../../data/mockData";

// ── Configuración Visual ClicSalud
const THEME = {
  primary: "#005596",
  warning: "#F7BE2B",
  danger: "#E2464C",
  success: "#32A430",
  noVigente: "#004582",
  bg: "#f4f7f9",
};

// ── Datos Dinámicos
const ESTABLECIMIENTOS = MOCK_ESTABLECIMIENTOS;
const TRAMITES = MOCK_TRAMITES;

const count = (arr, key, val) => arr.filter((x) => x[key] === val).length;
const total = ESTABLECIMIENTOS.length;

const tipologiasConfig = [
  {
    key: "CLÍNICAS, SANATORIOS y HOSPITALES",
    label: "Hospitales",
    icon: <HospitalIcon />,
  },
  {
    key: "ESTABLECIMIENTOS GERIÁTRICOS",
    label: "Geriátricos",
    icon: <ApartmentIcon />,
  },
  {
    key: "CENTRO DE SALUD AMBULATORIO",
    label: "Ambulatorios",
    icon: <MedicalIcon />,
  },
  {
    key: "CENTRO DE CIRUGÍA AMBULATORIA",
    label: "Cirugía Amb.",
    icon: <HealingIcon />,
  },
];

const estadosEst = [
  {
    key: "HABILITADO",
    label: "Habilitado",
    color: THEME.success,
    icon: <CheckCircleIcon />,
  },
  {
    key: "PRÓXIMO A VENCER",
    label: "Vencimiento",
    color: THEME.warning,
    icon: <WarningIcon />,
  },
  {
    key: "VENCIDO",
    label: "Vencido",
    color: THEME.danger,
    icon: <CancelIcon />,
  },
  {
    key: "NO VIGENTE",
    label: "No Vigente",
    color: THEME.noVigente,
    icon: <PauseCircleIcon />,
  },
];

// ── Sub-componentes Estilizados
const StatCard = ({ label, value, color, icon }) => (
  <Paper
    elevation={0}
    sx={{
      flex: 1,
      p: 3,
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      bgcolor: "white",
    }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: 950, color: "#1e293b", lineHeight: 1 }}
        >
          {value}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            color: "#64748b",
            textTransform: "uppercase",
            fontSize: "0.7rem",
          }}
        >
          {label}
        </Typography>
      </Box>
      <Avatar
        sx={{ bgcolor: `${color}15`, color: color, width: 48, height: 48 }}
      >
        {icon}
      </Avatar>
    </Box>
  </Paper>
);

const MiniUrgentCard = ({ est, color }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 2,
      border: `1px solid #f1f5f9`,
      bgcolor: "#f8fafc",
      mb: 1.5,
      display: "flex",
      alignItems: "center",
      gap: 2,
      boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    }}
  >
    <Avatar
      sx={{
        bgcolor: `${color}15`,
        color: color,
        width: 36,
        height: 36,
        borderRadius: 1.5,
      }}
    >
      <UrgentIcon sx={{ fontSize: 20 }} />
    </Avatar>
    <Box flex={1}>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 900, color: "#1e293b", lineHeight: 1.2 }}
      >
        {est.nombre}
      </Typography>
      <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
        {est.departamento}
      </Typography>
    </Box>
    <Box sx={{ textAlign: "right" }}>
      <Typography
        sx={{ fontWeight: 950, color: color, fontSize: "1rem", lineHeight: 1 }}
      >
        {est.diasParaVencer}d
      </Typography>
      <Typography
        variant="caption"
        sx={{ fontWeight: 700, color: "#94a3b8", fontSize: "0.6rem" }}
      >
        PLAZO
      </Typography>
    </Box>
  </Box>
);

const AlertContainer = ({ title, icon, color, data }) => (
  <Paper
    elevation={0}
    sx={{
      p: 4,
      borderRadius: "24px",
      border: `1px solid ${color}20`,
      bgcolor: "#fff",
      height: "100%",
    }}
  >
    <Box display="flex" alignItems="center" gap={1.5} mb={3}>
      <Avatar
        sx={{ bgcolor: `${color}15`, color: color, width: 40, height: 40 }}
      >
        {icon}
      </Avatar>
      <Typography variant="h6" sx={{ fontWeight: 950, color: "#1e293b" }}>
        {title}
      </Typography>
      <Chip
        label={`${data.length} CASOS`}
        size="small"
        sx={{
          ml: "auto",
          fontWeight: 950,
          bgcolor: `${color}10`,
          color: color,
        }}
      />
    </Box>
    <Box sx={{ maxHeight: 400, overflowY: "auto", pr: 1 }}>
      {data.map((e, i) => (
        <MiniUrgentCard key={i} est={e} color={color} />
      ))}
      {data.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <CheckCircleIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 2 }} />
          <Typography
            variant="body2"
            sx={{ color: "#94a3b8", fontWeight: 700 }}
          >
            Sin alertas críticas detectadas
          </Typography>
        </Box>
      )}
    </Box>
  </Paper>
);

export default function MinisterioDashboard() {
  const now = new Date();
  const fecha = now.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const vencidos = ESTABLECIMIENTOS.filter((e) => e.estado === "VENCIDO")
    .sort((a, b) => a.diasParaVencer - b.diasParaVencer)
    .slice(0, 8);
  const proximos = ESTABLECIMIENTOS.filter(
    (e) => e.estado === "PRÓXIMO A VENCER",
  )
    .sort((a, b) => a.diasParaVencer - b.diasParaVencer)
    .slice(0, 8);

  return (
    <Box sx={{ bgcolor: THEME.bg, minHeight: "100vh", pb: 8 }}>
      {/* HEADER */}
      <Box sx={{ bgcolor: THEME.primary, color: "white", pt: 2, pb: 4 }}>
        <Box
          sx={{
            px: { xs: 2, sm: 4, lg: 4 },
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box>
              <Typography
                variant="overline"
                sx={{ fontWeight: 800, opacity: 0.8, letterSpacing: 2 }}
              >
                MINISTERIO DE SALUD · CÓRDOBA
              </Typography>
              <Typography
                variant="h2"
                sx={{ fontWeight: 950, letterSpacing: -1 }}
              >
                ClicSalud:{" "}
                <span style={{ fontWeight: 300 }}>Centro de Control</span>
              </Typography>
            </Box>
            <Box
              sx={{
                textAlign: "right",
                bgcolor: "rgba(255,255,255,0.1)",
                p: 3,
                borderRadius: 3,
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 950 }}>
                PANEL EJECUTIVO
              </Typography>
              <Typography
                variant="caption"
                sx={{ opacity: 0.8, fontWeight: 700 }}
              >
                {fecha}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          mt: -5,
          px: { xs: 2, sm: 4, lg: 4, margin:"18px" },
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* KPI GRID */}
        <Grid container spacing={3} mb={5}>
          {estadosEst.map((e) => (
            <Grid item xs={12} sm={6} md={3} key={e.key}>
              <StatCard
                label={e.label}
                value={count(ESTABLECIMIENTOS, "estado", e.key)}
                color={e.color}
                icon={e.icon}
              />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* PRIMERA FILA: DISTRIBUCIÓN, TRAMITES POR TIPOLOGIA, CANTIDAD DE TRAMITES */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 4,
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
                bgcolor: "#fff",
                height: "100%",
                width: "100%",
              }}
            >
              <Box display="flex" alignItems="center" gap={1.5} mb={4}>
                <Avatar
                  sx={{ bgcolor: `${THEME.primary}10`, color: THEME.primary }}
                >
                  <LocationOnIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 950 }}>
                  Distribución Geográfica
                </Typography>
              </Box>
              <Stack spacing={3}>
                {["Capital", "Río Cuarto", "Punilla", "Colón", "San Justo"].map(
                  (dep) => (
                    <Box key={dep}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 800, color: "#475569" }}
                        >
                          {dep}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 950 }}>
                          {count(ESTABLECIMIENTOS, "departamento", dep)}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={
                          (count(ESTABLECIMIENTOS, "departamento", dep) / 100) *
                          100
                        }
                        sx={{ height: 10, borderRadius: 5, bgcolor: "#f1f5f9" }}
                      />
                    </Box>
                  ),
                )}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 4,
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
                bgcolor: "#fff",
                height: "100%",
              }}
            >
              <Box display="flex" alignItems="center" gap={1.5} mb={4}>
                <Avatar
                  sx={{ bgcolor: `${THEME.primary}10`, color: THEME.primary }}
                >
                  <BarChartIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 950 }}>
                  Trámites por Tipología
                </Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow
                      sx={{
                        "& th": {
                          border: "none",
                          color: "#64748b",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          fontSize: "0.55rem",
                          pb: 2,
                          px: 0.5,
                        },
                      }}
                    >
                      <TableCell>TIPOLOGÍA</TableCell>
                      <TableCell align="center">ADEC.</TableCell>
                      <TableCell align="center">HAB.</TableCell>
                      <TableCell align="center">ALTA</TableCell>
                      <TableCell align="center">RENOV.</TableCell>
                      <TableCell align="center">MODIF.</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tipologiasConfig.map((tip, idx) => {
                      // Invented values for Trámites cross-referenced by Tipología
                      const data = [
                        [4, 45, 12, 110, 25], // Hospitales
                        [8, 20, 5, 80, 15], // Geriátricos
                        [5, 50, 25, 75, 20], // Ambulatorios
                        [4, 30, 14, 47, 24], // Cirugía Amb.
                      ][idx];
                      return (
                        <TableRow
                          key={tip.key}
                          sx={{
                            "& td": {
                              py: 2,
                              borderBottom: "1px solid #f1f5f9",
                              px: 0.5,
                            },
                          }}
                        >
                          <TableCell
                            sx={{
                              fontWeight: 800,
                              fontSize: "0.65rem",
                              color: "#1e293b",
                            }}
                          >
                            {tip.label}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontWeight: 950, color: THEME.danger }}
                          >
                            {data[0]}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontWeight: 950, color: THEME.primary }}
                          >
                            {data[1]}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontWeight: 950, color: THEME.success }}
                          >
                            {data[2]}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontWeight: 950, color: THEME.warning }}
                          >
                            {data[3]}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontWeight: 950, color: THEME.noVigente }}
                          >
                            {data[4]}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 4,
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
                bgcolor: "#fff",
                height: "100%",
              }}
            >
              <Box display="flex" alignItems="center" gap={1.5} mb={4}>
                <Avatar
                  sx={{ bgcolor: `${THEME.primary}10`, color: THEME.primary }}
                >
                  <DonutIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 950 }}>
                  Cantidad de Trámites
                </Typography>
              </Box>
              <Stack spacing={2.5}>
                {[
                  { label: "Habilitación", value: 145, color: THEME.primary },
                  { label: "Alta Digital", value: 56, color: THEME.success },
                  { label: "Renovación", value: 312, color: THEME.warning },
                  { label: "Modificación", value: 84, color: THEME.noVigente },
                  { label: "Adecuación", value: 21, color: THEME.danger },
                ].map((d, i) => (
                  <Box key={i}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 800, color: "#475569" }}
                      >
                        {d.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 950, color: d.color }}
                      >
                        {d.value}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(d.value / 350) * 100}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "#f1f5f9",
                        "& .MuiLinearProgress-bar": { bgcolor: d.color },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* SEGUNDA FILA: VENCIDOS Y PROXIMO A VENCER */}
          <Grid item xs={12} md={6}>
            <AlertContainer
              title="VENCIDOS"
              icon={<ErrorIcon sx={{ fontSize: 24 }} />}
              color={THEME.danger}
              data={vencidos}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <AlertContainer
              title="PRÓXIMO A VENCER"
              icon={<WarningIcon sx={{ fontSize: 24 }} />}
              color={THEME.warning}
              data={proximos}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
