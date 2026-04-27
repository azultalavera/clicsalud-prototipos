import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";

const RevisionActa = ({ efectorResponses = {}, onValidate }) => {
  // Estado local para manejar las validaciones interactivas
  const [statuses, setStatuses] = React.useState({
    "Quirófanos": "PENDIENTE",
    "Camas Uso Transitorio": "PENDIENTE",
    "Libro de Quejas": "PENDIENTE",
    "Plan de Evacuación": "PENDIENTE",
    "Habilitación Bomberos": "PENDIENTE",
    "Blindaje Plomo": "PENDIENTE",
    "Dosimetría": "PENDIENTE",
    "Señalética": "PENDIENTE",
  });

  const handleUpdateStatus = (elemento, newStatus) => {
    setStatuses(prev => ({ ...prev, [elemento]: newStatus }));
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "VALIDADO": return <Chip label="VALIDADO" size="small" color="success" sx={{ fontWeight: 900, fontSize: '0.6rem' }} />;
      case "RECHAZADO": return <Chip label="RECHAZADO" size="small" color="error" sx={{ fontWeight: 900, fontSize: '0.6rem' }} />;
      default: return <Chip label="PENDIENTE" size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', bgcolor: '#fef3c7', color: '#b45309' }} />;
    }
  };

  const irregularidadesTramite = [
    { id: "Quirófanos", elemento: "Quirófanos", declarado: 11, constatado: 5, obs: "IRREGULARIDAD: No se constatan 6 quirófanos." },
    { id: "Camas Uso Transitorio", elemento: "Camas Uso Transitorio", declarado: 5, constatado: 9, obs: "RECTIFICACIÓN: Excedente de 4 camas." },
  ];

  const obsGenerales = [
    { id: "Libro de Quejas", elemento: "Libro de Quejas", obs: "No se presenta libro de quejas foliado." },
    { id: "Plan de Evacuación", elemento: "Plan de Evacuación", obs: "Vencimiento 10/03/2026." },
    { id: "Habilitación Bomberos", elemento: "Habilitación Bomberos", obs: "Certificado vencido Enero 2026." },
    { id: "Blindaje Plomo", elemento: "Radiofísica: Blindaje", obs: "Falta blindaje en puerta Rayos X." },
    { id: "Dosimetría", elemento: "Radiofísica: Dosimetría", obs: "Registros incompletos." },
    { id: "Señalética", elemento: "Radiofísica: Señalética", obs: "Falta luz roja de advertencia." }
  ];

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, bgcolor: '#f1f5f9', minHeight: '100%' }}>

      {/* SECCIÓN 1: DATOS GENERALES */}
      <Typography variant="h6" sx={{ fontWeight: 950, color: '#1e293b', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <InfoIcon color="primary" /> OBSERVACIONES DATOS GENERALES
      </Typography>

      <Paper sx={{ p: 0, mb: 5, borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>ELEMENTO / CATEGORÍA</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>DETALLE DEL HALLAZGO</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>ESTADO</TableCell>
                <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.7rem' }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {obsGenerales.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{row.elemento}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#475569' }}>{row.obs}</TableCell>
                  <TableCell>{getStatusChip(statuses[row.id])}</TableCell>
                  <TableCell align="center">
                     <Stack direction="row" spacing={1} justifyContent="center">
                        <Button 
                          size="small" 
                          variant={statuses[row.id] === "VALIDADO" ? "contained" : "outlined"} 
                          color="success" 
                          onClick={() => handleUpdateStatus(row.id, "VALIDADO")}
                          sx={{ fontSize: '0.65rem', fontWeight: 900 }}
                        >
                          VALIDAR
                        </Button>
                        <Button 
                          size="small" 
                          variant={statuses[row.id] === "RECHAZADO" ? "contained" : "outlined"} 
                          color="error" 
                          onClick={() => handleUpdateStatus(row.id, "RECHAZADO")}
                          sx={{ fontSize: '0.65rem', fontWeight: 900 }}
                        >
                          RECHAZAR
                        </Button>
                     </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* SECCIÓN 2: DATOS DEL TRÁMITE */}
      <Typography variant="h6" sx={{ fontWeight: 950, color: '#1e293b', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ErrorIcon color="error" /> IRREGULARIDADES DATOS DEL TRÁMITE
      </Typography>
      
      <Paper sx={{ p: 0, mb: 3, borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>ELEMENTO TÉCNICO</TableCell>
                <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.7rem' }}>DECLARADO</TableCell>
                <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.7rem' }}>CONSTATADO</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>ESTADO</TableCell>
                <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.7rem' }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {irregularidadesTramite.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{row.elemento}</TableCell>
                  <TableCell align="center"><Chip label={row.declarado} size="small" sx={{ fontWeight: 800, bgcolor: '#e2e8f0' }} /></TableCell>
                  <TableCell align="center"><Chip label={row.constatado} size="small" sx={{ fontWeight: 800, bgcolor: '#fee2e2', color: '#991b1b' }} /></TableCell>
                  <TableCell>{getStatusChip(statuses[row.id])}</TableCell>
                  <TableCell align="center">
                     <Stack direction="row" spacing={1} justifyContent="center">
                        <Button 
                          size="small" 
                          variant={statuses[row.id] === "VALIDADO" ? "contained" : "outlined"} 
                          color="success" 
                          onClick={() => handleUpdateStatus(row.id, "VALIDADO")}
                          sx={{ minWidth: 0, p: 0.5, borderRadius: 1.5 }}
                        >
                          <CheckCircleIcon sx={{ fontSize: 18 }} />
                        </Button>
                        <Button 
                          size="small" 
                          variant={statuses[row.id] === "RECHAZADO" ? "contained" : "outlined"} 
                          color="error" 
                          onClick={() => handleUpdateStatus(row.id, "RECHAZADO")}
                          sx={{ minWidth: 0, p: 0.5, borderRadius: 1.5 }}
                        >
                          <ErrorIcon sx={{ fontSize: 18 }} />
                        </Button>
                     </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

    </Box>
  );
};

export default RevisionActa;
