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
    "Plano Arquitectura": "PENDIENTE",
    "Contrato Residuos": "PENDIENTE",
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
    { id: "Quirófanos", seccion: "CIRUGÍA", elemento: "Quirófanos", declarado: 11, constatado: 5, obs: "IRREGULARIDAD: No se constatan 6 quirófanos." },
    { id: "Camas Uso Transitorio", seccion: "INTERNACIÓN", elemento: "Camas Uso Transitorio", declarado: 5, constatado: 9, obs: "RECTIFICACIÓN: Excedente de 4 camas." },
  ];

  const obsGenerales = [
    { id: "Libro de Quejas", seccion: "REGISTROS", elemento: "Libro de Quejas", obs: "No se presenta libro de quejas foliado." },
    { id: "Plan de Evacuación", seccion: "REVISIÓN", elemento: "Plan de Evacuación", obs: "Vencimiento 10/03/2026." },
    { id: "Habilitación Bomberos", seccion: "REVISIÓN", elemento: "Habilitación Bomberos", obs: "Certificado vencido Enero 2026." },
    { id: "Blindaje Plomo", seccion: "RADIOFÍSICA", elemento: "Radiofísica: Blindaje", obs: "Falta blindaje en puerta Rayos X." },
    { id: "Dosimetría", seccion: "RADIOFÍSICA", elemento: "Radiofísica: Dosimetría", obs: "Registros incompletos." },
    { id: "Señalética", seccion: "RADIOFÍSICA", elemento: "Radiofísica: Señalética", obs: "Falta luz roja de advertencia." }
  ];

  const documentosObservados = [
    { id: "Plano Arquitectura", seccion: "ARQUITECTURA", elemento: "Plano de Arquitectura", obs: "Falta firma de profesional interviniente." },
    { id: "Contrato Residuos", seccion: "DOCUMENTACIÓN", elemento: "Contrato Recolección Residuos", obs: "Contrato vencido." },
  ];

  const isAllValidado = Object.values(statuses).every(s => s === "VALIDADO");
  const hasRechazado = Object.values(statuses).some(s => s === "RECHAZADO");

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, bgcolor: '#f8fafc', minHeight: '100%' }}>

      {/* Cuadro de Conclusión General (Estilo Acta 1/3) */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 4, border: '1px solid #FFE0B2', bgcolor: '#FFF9E6', display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <DescriptionIcon sx={{ color: '#92400e', mt: 0.5 }} />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 950, color: '#92400e', mb: 0.5, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            RESUMEN DE OBSERVACIONES (ACTA DE REVISIÓN)
          </Typography>
          <Typography variant="body1" sx={{ color: '#92400e', fontWeight: 600, lineHeight: 1.6, fontSize: '0.95rem' }}>
            "Se detectaron múltiples irregularidades en la documentación técnica y en la infraestructura de los servicios críticos. El efector ha respondido a los emplazamientos y se procede a la validación final."
          </Typography>
        </Box>
      </Paper>

      {/* SECCIÓN 1: DATOS GENERALES */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box sx={{ bgcolor: '#0ea5e9', color: 'white', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <InfoIcon sx={{ fontSize: 18 }} />
        </Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "#1e293b", fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1 }}>
          OBSERVACIONES DATOS GENERALES
        </Typography>
      </Box>

      <Paper sx={{ p: 0, mb: 5, borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>SECCIÓN / SERVICIO</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>ELEMENTO / CATEGORÍA</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>DETALLE DEL HALLAZGO</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>ESTADO</TableCell>
                <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.7rem' }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {obsGenerales.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Chip label={row.seccion} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', height: 18 }} />
                  </TableCell>
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
                          sx={{ fontSize: '0.65rem', fontWeight: 900, borderRadius: 2 }}
                        >
                          VALIDAR
                        </Button>
                        <Button 
                          size="small" 
                          variant={statuses[row.id] === "RECHAZADO" ? "contained" : "outlined"} 
                          color="error" 
                          onClick={() => handleUpdateStatus(row.id, "RECHAZADO")}
                          sx={{ fontSize: '0.65rem', fontWeight: 900, borderRadius: 2 }}
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box sx={{ bgcolor: '#ef4444', color: 'white', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ErrorIcon sx={{ fontSize: 18 }} />
        </Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "#1e293b", fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1 }}>
          IRREGULARIDADES DATOS DEL TRÁMITE
        </Typography>
      </Box>
      
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#475569", mb: 1, ml: 1, fontSize: '0.8rem' }}>
        Diferencias Constatadas
      </Typography>
      <Paper sx={{ p: 0, mb: 3, borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>SECCIÓN / SERVICIO</TableCell>
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
                  <TableCell>
                    <Chip label={row.seccion} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', height: 18 }} />
                  </TableCell>
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

      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#475569", mb: 1, ml: 1, fontSize: '0.8rem' }}>
        Documentos Observados
      </Typography>
      <Paper sx={{ p: 0, mb: 3, borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>SECCIÓN / SERVICIO</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>DOCUMENTO</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>OBSERVACIÓN</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>ESTADO</TableCell>
                <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.7rem' }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documentosObservados.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Chip label={row.seccion} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', height: 18 }} />
                  </TableCell>
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

      <Box sx={{ mt: 6, mb: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="contained" 
          color="error" 
          disabled={!hasRechazado}
          sx={{ fontWeight: 900, px: 4, py: 1.5, borderRadius: 3, boxShadow: hasRechazado ? '0 4px 14px 0 rgba(239, 68, 68, 0.39)' : 'none' }}
        >
          EMPLAZAR
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          disabled={!isAllValidado}
          sx={{ fontWeight: 900, px: 4, py: 1.5, borderRadius: 3, boxShadow: isAllValidado ? '0 4px 14px 0 rgba(14, 165, 233, 0.39)' : 'none' }}
        >
          INICIAR NUEVA ACTA
        </Button>
      </Box>

    </Box>
  );
};

export default RevisionActa;
