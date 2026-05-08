import React, { useState } from "react";
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
  Stack,
  Tooltip,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ErrorIcon from "@mui/icons-material/Error";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Close from "@mui/icons-material/Close";

const RevisionActaView = ({ obsGenerales = [], obsTramite = [] }) => {
  const [statuses, setStatuses] = useState({});

  const handleUpdateStatus = (id, status) => {
    setStatuses(prev => ({ ...prev, [id]: status }));
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "VALIDADO":
        return (
          <Chip
            label="VALIDADO"
            size="small"
            color="success"
            sx={{ fontWeight: 900, fontSize: "0.6rem", height: 20 }}
          />
        );
      case "RECHAZADO":
        return (
          <Chip
            label="RECHAZADO"
            size="small"
            color="error"
            sx={{ fontWeight: 900, fontSize: "0.6rem", height: 20 }}
          />
        );
      default:
        return (
          <Chip
            label="PENDIENTE"
            size="small"
            sx={{
              fontWeight: 900,
              fontSize: "0.6rem",
              bgcolor: "#fef3c7",
              color: "#b45309",
              height: 20,
            }}
          />
        );
    }
  };

  const [reviewDialog, setReviewDialog] = useState({ open: false, id: null, response: "", photos: [] });

  const renderActions = (id, response, photos = []) => (
    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
      <Tooltip title="Ver respuesta del efector">
        <IconButton
          size="small"
          onClick={() => setReviewDialog({ open: true, id, response, photos })}
          sx={{
            bgcolor: "#f1f5f9",
            color: "#64748b",
            "&:hover": { bgcolor: "#e2e8f0" },
          }}
        >
          <VisibilityIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, my: "auto" }} />
      <IconButton
        size="small"
        onClick={() => handleUpdateStatus(id, "VALIDADO")}
        sx={{
          color: statuses[id] === "VALIDADO" ? "white" : "#059669",
          bgcolor: statuses[id] === "VALIDADO" ? "#059669" : "transparent",
          border: `1px solid ${statuses[id] === "VALIDADO" ? "#059669" : "#d1fae5"}`,
          "&:hover": { bgcolor: statuses[id] === "VALIDADO" ? "#047857" : "#d1fae5" },
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => handleUpdateStatus(id, "RECHAZADO")}
        sx={{
          color: statuses[id] === "RECHAZADO" ? "white" : "#dc2626",
          bgcolor: statuses[id] === "RECHAZADO" ? "#dc2626" : "transparent",
          border: `1px solid ${statuses[id] === "RECHAZADO" ? "#dc2626" : "#fee2e2"}`,
          "&:hover": { bgcolor: statuses[id] === "RECHAZADO" ? "#b91c1c" : "#fee2e2" },
        }}
      >
        <ErrorIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Stack>
  );

  const displayObsGenerales = obsGenerales.length > 0
    ? obsGenerales.map((o, i) => ({ id: `gen-${i}`, elemento: o.label, obs: o.text }))
    : [
      { id: "Libro de Quejas", elemento: "Libro de Quejas", obs: "No se presenta libro de quejas foliado.", respuesta: "Se adjunta foto del libro foliado que estaba en administración." },
      { id: "Plan de Evacuación", elemento: "Plan de Evacuación", obs: "Vencimiento 10/03/2026.", respuesta: "Se ha solicitado la renovación, adjuntamos comprobante de trámite." },
      { id: "Habilitación Bomberos", elemento: "Habilitación Bomberos", obs: "Certificado vencido Enero 2026.", respuesta: "Trámite en curso en la municipalidad." },
      { id: "Blindaje Plomo", elemento: "Radiofísica: Blindaje", obs: "Falta blindaje en puerta Rayos X.", respuesta: "Se instaló la lámina de plomo el 02/05/2026." },
      { id: "Dosimetría", elemento: "Radiofísica: Dosimetría", obs: "Registros incompletos.", respuesta: "Se completaron los registros faltantes." },
      { id: "Señalética", elemento: "Radiofísica: Señalética", obs: "Falta luz roja de advertencia.", respuesta: "Se instaló nueva luz de advertencia." }
    ];

  const displayIrregularidades = obsTramite.length > 0
    ? obsTramite.map((o, i) => ({
      id: `tra-${i}`,
      elemento: o.label,
      servicio: o.service,
      obs: o.text,
      declarado: o.declarado || 0,
      constatado: o.constatado || 0,
      respuesta: o.respuesta || "Se ha regularizado la situación según lo solicitado."
    }))
    : [
      { id: "Quirófanos", elemento: "Quirófanos", declarado: 11, constatado: 5, obs: "IRREGULARIDAD: No se constatan 6 quirófanos.", respuesta: "Los quirófanos estaban en mantenimiento, ya están operativos." },
      { id: "Camas Uso Transitorio", elemento: "Camas Uso Transitorio", declarado: 5, constatado: 9, obs: "RECTIFICACIÓN: Excedente de 4 camas.", respuesta: "Se han retirado las camas excedentes." },
    ];

  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

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
              {displayObsGenerales.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{row.elemento}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#475569' }}>{row.obs}</TableCell>
                  <TableCell>{getStatusChip(statuses[row.id])}</TableCell>
                  <TableCell align="center">
                    {renderActions(row.id, row.respuesta)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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
              {displayIrregularidades.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                    {row.servicio && <Chip label={row.servicio} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', mr: 1, height: 18 }} />}
                    {row.elemento}
                  </TableCell>
                  <TableCell align="center"><Chip label={row.declarado} size="small" sx={{ fontWeight: 800, bgcolor: '#e2e8f0' }} /></TableCell>
                  <TableCell align="center"><Chip label={row.constatado} size="small" sx={{ fontWeight: 800, bgcolor: '#fee2e2', color: '#991b1b' }} /></TableCell>
                  <TableCell>{getStatusChip(statuses[row.id])}</TableCell>
                  <TableCell align="center">
                    {renderActions(row.id, row.respuesta)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={reviewDialog.open}
        onClose={() => setReviewDialog({ ...reviewDialog, open: false })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ fontWeight: 900, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Revisión de Respuesta
          <IconButton onClick={() => setReviewDialog({ ...reviewDialog, open: false })} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="caption" sx={{ fontWeight: 900, color: '#64748b', textTransform: 'uppercase', mb: 1, display: 'block' }}>
            Explicación del Efector
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f1f5f9', mb: 3, borderRadius: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', lineHeight: 1.6 }}>
              {reviewDialog.response || "No se proporcionó una explicación escrita."}
            </Typography>
          </Paper>

          <Typography variant="caption" sx={{ fontWeight: 900, color: '#64748b', textTransform: 'uppercase', mb: 1.5, display: 'block' }}>
            Evidencia Adjunta
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1 }}>
            {(reviewDialog.photos && reviewDialog.photos.length > 0) ? reviewDialog.photos.map((p, idx) => (
              <Box key={idx} sx={{ minWidth: 100, height: 100, borderRadius: 3, overflow: 'hidden', border: '2px solid #e2e8f0' }}>
                <img src={p} alt="evidencia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            )) : (
              <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                No se adjuntaron fotos de evidencia.
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <Button 
            onClick={() => {
              handleUpdateStatus(reviewDialog.id, "RECHAZADO");
              setReviewDialog({ ...reviewDialog, open: false });
            }}
            color="error" 
            sx={{ fontWeight: 800 }}
          >
            Rechazar
          </Button>
          <Button 
            variant="contained"
            onClick={() => {
              handleUpdateStatus(reviewDialog.id, "VALIDADO");
              setReviewDialog({ ...reviewDialog, open: false });
            }}
            color="success" 
            sx={{ fontWeight: 900, borderRadius: 2 }}
          >
            Validar Rectificación
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RevisionActaView;
