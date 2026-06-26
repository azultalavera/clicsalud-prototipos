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
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ErrorIcon from "@mui/icons-material/Error";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Close from "@mui/icons-material/Close";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

const RevisionActaView = ({ obsGenerales = [], obsTramite = [] }) => {
  const [statuses, setStatuses] = useState({});
  const [emplazarDialog, setEmplazarDialog] = useState(false);
  const [diasEmplazamiento, setDiasEmplazamiento] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [customUnit, setCustomUnit] = useState("");
  const [comentarios, setComentarios] = useState({});
  const [commentDialog, setCommentDialog] = useState({ open: false, id: null, text: "" });
  const [isCustom, setIsCustom] = useState(false);

  const getFechaVencimiento = (plazoStr) => {
    if (!plazoStr) return null;
    const parts = plazoStr.trim().split(" ");
    if (parts.length < 2) return null;
    const amount = parseInt(parts[0], 10);
    const unit = parts[1].toLowerCase();
    
    if (isNaN(amount)) return null;

    const fecha = new Date();
    const feriados = [
      "01-01", "02-16", "02-17", "03-24", "04-02", "04-03", "05-01", "05-25", 
      "06-17", "06-20", "07-09", "08-17", "10-12", "11-20", "12-08", "12-25"
    ];

    const isFeriadoDate = (d) => {
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return feriados.includes(`${month}-${day}`);
    };

    const isWeekend = (d) => d.getDay() === 0 || d.getDay() === 6;

    if (unit.startsWith("hora")) {
      fecha.setHours(fecha.getHours() + amount);
      while (isWeekend(fecha) || isFeriadoDate(fecha)) {
        fecha.setDate(fecha.getDate() + 1);
      }
    } else if (unit.startsWith("día") || unit.startsWith("dia")) {
      let daysAdded = 0;
      while (daysAdded < amount) {
        fecha.setDate(fecha.getDate() + 1);
        if (!isWeekend(fecha) && !isFeriadoDate(fecha)) {
          daysAdded++;
        }
      }
    } else if (unit.startsWith("semana")) {
      let daysAdded = 0;
      const totalDays = amount * 5;
      while (daysAdded < totalDays) {
        fecha.setDate(fecha.getDate() + 1);
        if (!isWeekend(fecha) && !isFeriadoDate(fecha)) {
          daysAdded++;
        }
      }
    } else {
      return null;
    }

    return { fecha };
  };

  const vencimiento = getFechaVencimiento(diasEmplazamiento);

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
  const [obsDialog, setObsDialog] = useState({ open: false, text: "" });

  const renderActions = (id, response, photos = [], obs = null) => (
    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
      {obs && (
        <Tooltip title="Ver observación">
          <IconButton
            size="small"
            onClick={() => setObsDialog({ open: true, text: obs })}
            sx={{
              bgcolor: "#fffbeb",
              color: "#d97706",
              "&:hover": { bgcolor: "#fef3c7" },
            }}
          >
            <InfoIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Agregar comentario de rechazo">
        <IconButton
          size="small"
          onClick={() => setCommentDialog({ open: true, id, text: comentarios[id] || "" })}
          sx={{
            bgcolor: "#f1f5f9",
            color: "#64748b",
            "&:hover": { bgcolor: "#e2e8f0" },
            visibility: statuses[id] === "RECHAZADO" ? "visible" : "hidden"
          }}
        >
          <ChatBubbleIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Ver documento adjunto">
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

  const getSeccionGenerales = (label, service) => {
    if (service && service !== "DATOS GENERALES") return service;
    const lower = label?.toLowerCase() || "";
    if (lower.includes("radiofísica") || lower.includes("plomo") || lower.includes("dosimetría") || lower.includes("señalética")) return "RADIOFÍSICA";
    if (lower.includes("libro") || lower.includes("registro")) return "REGISTROS";
    if (lower.includes("plan") || lower.includes("habilitación") || lower.includes("bomberos") || lower.includes("evacuación")) return "REVISIÓN";
    return "DATOS GENERALES";
  };

  const displayObsGenerales = obsGenerales.length > 0
    ? obsGenerales.map((o, i) => ({ id: `gen-${i}`, seccion: getSeccionGenerales(o.label, o.service), elemento: o.label, obs: o.text }))
    : [
      { id: "Libro de Quejas", seccion: "REGISTROS", elemento: "Libro de Quejas", obs: "No se presenta libro de quejas foliado.", respuesta: "Se adjunta foto del libro foliado que estaba en administración." },
      { id: "Plan de Evacuación", seccion: "REVISIÓN", elemento: "Plan de Evacuación", obs: "Vencimiento 10/03/2026.", respuesta: "Se ha solicitado la renovación, adjuntamos comprobante de trámite." },
      { id: "Habilitación Bomberos", seccion: "REVISIÓN", elemento: "Habilitación Bomberos", obs: "Certificado vencido Enero 2026.", respuesta: "Trámite en curso en la municipalidad." },
      { id: "Blindaje Plomo", seccion: "RADIOFÍSICA", elemento: "Radiofísica: Blindaje", obs: "Falta blindaje en puerta Rayos X.", respuesta: "Se instaló la lámina de plomo el 02/05/2026." },
      { id: "Dosimetría", seccion: "RADIOFÍSICA", elemento: "Radiofísica: Dosimetría", obs: "Registros incompletos.", respuesta: "Se completaron los registros faltantes." },
      { id: "Señalética", seccion: "RADIOFÍSICA", elemento: "Radiofísica: Señalética", obs: "Falta luz roja de advertencia.", respuesta: "Se instaló nueva luz de advertencia." }
    ];

  const displayIrregularidades = obsTramite.length > 0
    ? obsTramite.map((o, i) => ({
      id: `tra-${i}`,
      elemento: o.label,
      seccion: o.service || "TRÁMITE",
      obs: o.text,
      declarado: o.declarado || 0,
      constatado: o.constatado || 0,
      respuesta: o.respuesta || "Se ha regularizado la situación según lo solicitado."
    }))
    : [
      { id: "Quirófanos", seccion: "CIRUGÍA", elemento: "Quirófanos", declarado: 11, constatado: 5, obs: "IRREGULARIDAD: No se constatan 6 quirófanos.", respuesta: "Los quirófanos estaban en mantenimiento, ya están operativos." },
      { id: "Camas Uso Transitorio", seccion: "INTERNACIÓN", elemento: "Camas Uso Transitorio", declarado: 5, constatado: 9, obs: "RECTIFICACIÓN: Excedente de 4 camas.", respuesta: "Se han retirado las camas excedentes." },
    ];

  const displayDocumentos = [
    { id: "Plano Arquitectura", seccion: "ARQUITECTURA", elemento: "Plano de Arquitectura", obs: "Falta firma de profesional interviniente.", respuesta: "Se adjunta plano firmado y legalizado." },
    { id: "Contrato Residuos", seccion: "DOCUMENTACIÓN", elemento: "Contrato Recolección Residuos", obs: "Contrato vencido.", respuesta: "Se adjunta nuevo contrato vigente." },
  ];

  const allIds = [
    ...displayObsGenerales.map(o => o.id),
    ...displayIrregularidades.map(o => o.id),
    ...displayDocumentos.map(o => o.id)
  ];
  const isAllValidado = allIds.every(id => statuses[id] === "VALIDADO");
  const hasRechazado = allIds.some(id => statuses[id] === "RECHAZADO");

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
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem', color: '#64748b' }}>ORIGEN</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem', color: '#64748b' }}>CATEGORÍA</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem', color: '#64748b' }}>OBSERVACIONES</TableCell>
                <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.7rem', color: '#64748b' }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayObsGenerales.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Chip label={row.seccion} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', height: 18, bgcolor: '#f1f5f9', color: '#475569', textTransform: 'uppercase' }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{row.elemento}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#475569' }}>{row.obs}</TableCell>
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

      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#475569", mb: 1, ml: 1, fontSize: '0.8rem' }}>
        Diferencias Constatadas
      </Typography>
      <Paper sx={{ p: 0, mb: 3, borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem', color: '#64748b' }}>ORIGEN</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem', color: '#64748b' }}>CATEGORÍA</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem', color: '#64748b' }}>OBSERVACIONES</TableCell>
                <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.7rem', color: '#64748b' }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayIrregularidades.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Chip label={row.seccion} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', height: 18, bgcolor: '#f1f5f9', color: '#475569', textTransform: 'uppercase' }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                    {row.elemento}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#475569' }}>
                    DECLARADO: {row.declarado}, OBSERVADO: {row.constatado}
                  </TableCell>
                  <TableCell align="center">
                    {renderActions(row.id, row.respuesta, [], row.obs)}
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
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem', color: '#64748b' }}>ORIGEN</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem', color: '#64748b' }}>CATEGORÍA</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem', color: '#64748b' }}>OBSERVACIONES</TableCell>
                <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.7rem', color: '#64748b' }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayDocumentos.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Chip label={row.seccion} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', height: 18, bgcolor: '#f1f5f9', color: '#475569', textTransform: 'uppercase' }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{row.elemento}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#475569' }}>{row.obs}</TableCell>
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
        open={commentDialog.open}
        onClose={() => setCommentDialog({ ...commentDialog, open: false })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Agregar comentario al rechazo
          <IconButton onClick={() => setCommentDialog({ ...commentDialog, open: false })} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Escriba aquí la aclaración del rechazo para que el efector la vea..."
            value={commentDialog.text}
            onChange={(e) => setCommentDialog({ ...commentDialog, text: e.target.value })}
            sx={{ mt: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setCommentDialog({ ...commentDialog, open: false })} sx={{ fontWeight: 800 }}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              setComentarios(prev => ({ ...prev, [commentDialog.id]: commentDialog.text }));
              setCommentDialog({ ...commentDialog, open: false });
            }}
            sx={{ fontWeight: 900, borderRadius: 2 }}
          >
            Guardar Comentario
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={obsDialog.open}
        onClose={() => setObsDialog({ ...obsDialog, open: false })}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ fontWeight: 900, bgcolor: '#fffbeb', color: '#b45309', borderBottom: '1px solid #fef3c7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Observación del Inspector
          <IconButton onClick={() => setObsDialog({ ...obsDialog, open: false })} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', lineHeight: 1.6 }}>
            {obsDialog.text}
          </Typography>
        </DialogContent>
      </Dialog>

      <Dialog
        open={reviewDialog.open}
        onClose={() => setReviewDialog({ ...reviewDialog, open: false })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ fontWeight: 900, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Documento Adjunto
          <IconButton onClick={() => setReviewDialog({ ...reviewDialog, open: false })} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, bgcolor: '#f1f5f9' }}>
          <Box sx={{ height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
             <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 800, mb: 1 }}>
                📄 Visor de PDF
             </Typography>
             <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Simulación del documento subido por el efector
             </Typography>
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

      <Dialog
        open={emplazarDialog}
        onClose={() => setEmplazarDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ bgcolor: '#d1fae5', color: '#059669', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 20 }} />
          </Box>
          Opciones de Emplazamiento
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ color: '#475569', mb: 3 }}>
            Seleccione el plazo otorgado al efector para regularizar las observaciones.
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
            {[
              { label: "24", sub: "horas", value: "24 horas" },
              { label: "48", sub: "horas", value: "48 horas" },
              { label: "5", sub: "días", value: "5 días" },
              { label: "10", sub: "días", value: "10 días" },
              { label: "15", sub: "días", value: "15 días" },
              { label: "+", sub: "manual", value: "custom" },
            ].map((option) => (
              <Button
                key={option.value}
                variant={(diasEmplazamiento === option.value && !isCustom) || (option.value === "custom" && isCustom) ? "contained" : "outlined"}
                color={option.sub === "horas" ? "warning" : "primary"}
                onClick={() => {
                  if (option.value === "custom") {
                    setIsCustom(true);
                    if (customValue && customUnit) {
                      setDiasEmplazamiento(`${customValue} ${customUnit}`);
                    } else {
                      setDiasEmplazamiento("");
                    }
                  } else {
                    setIsCustom(false);
                    setDiasEmplazamiento(option.value);
                    setCustomValue("");
                    setCustomUnit("");
                  }
                }}
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  minWidth: 0,
                  fontWeight: 900,
                  fontSize: '1.4rem',
                  lineHeight: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  textTransform: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: ((diasEmplazamiento === option.value && !isCustom) || (option.value === "custom" && isCustom)) ? '0 4px 10px rgba(0,0,0,0.15)' : 'none',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              >
                {option.label}
                <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 700, mt: 0.3 }}>
                  {option.sub}
                </Typography>
              </Button>
            ))}
          </Stack>

          {isCustom && (
            <>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                Ingrese un plazo personalizado:
              </Typography>
              <Stack direction="row" spacing={1}>
                <TextField
                  placeholder="Ej: 30"
                  size="small"
                  value={customValue}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setCustomValue(val);
                    setDiasEmplazamiento(val && customUnit ? `${val} ${customUnit}` : "");
                  }}
                  sx={{
                    width: 250,
                    "& .MuiOutlinedInput-root": { 
                      borderRadius: 3,
                      bgcolor: '#f8fafc',
                      "& fieldset": { borderColor: '#e2e8f0' },
                      "&:hover fieldset": { borderColor: '#cbd5e1' },
                      "&.Mui-focused fieldset": { borderColor: '#0ea5e9' }
                    }
                  }}
                />
                <ToggleButtonGroup
                  value={customUnit}
                  exclusive
                  onChange={(e, newUnit) => {
                    if (newUnit) {
                      setCustomUnit(newUnit);
                      if (customValue) {
                         setDiasEmplazamiento(`${customValue} ${newUnit}`);
                      }
                    }
                  }}
                  sx={{
                    bgcolor: '#f1f5f9',
                    p: 0.6,
                    borderRadius: 3,
                    "& .MuiToggleButtonGroup-grouped": {
                       border: 0,
                       borderRadius: '10px !important',
                       "&:not(:first-of-type)": {
                         borderLeft: 0,
                         ml: 0.5
                       }
                    },
                    "& .MuiToggleButton-root": {
                       fontWeight: 800,
                       px: 2.5,
                       py: 0.5,
                       textTransform: 'none',
                       color: '#64748b',
                       transition: 'all 0.2s',
                       "&.Mui-selected": {
                         bgcolor: '#0ea5e9 !important',
                         color: '#ffffff !important',
                         boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
                       },
                       "&:hover:not(.Mui-selected)": {
                         bgcolor: 'rgba(255,255,255,0.6)',
                         color: '#334155'
                       }
                    }
                  }}
                >
                  <ToggleButton value="horas">Horas</ToggleButton>
                  <ToggleButton value="días">Días</ToggleButton>
                  <ToggleButton value="semanas">Semanas</ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </>
          )}

          {vencimiento && (
            <Box sx={{ mt: 3, p: 1.5, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CheckCircleIcon sx={{ color: '#16a34a', fontSize: 24 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#16a34a', textTransform: 'capitalize' }}>
                  Vencimiento: {vencimiento.fecha.toLocaleString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })} h.
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button 
            onClick={() => setEmplazarDialog(false)} 
            sx={{ fontWeight: 800, color: '#64748b' }}
          >
            Volver
          </Button>
          <Button 
            variant="contained"
            color="success"
            disabled={!diasEmplazamiento}
            onClick={() => {
              setEmplazarDialog(false);
            }}
            sx={{ fontWeight: 900, borderRadius: 2, px: 3, py: 1, bgcolor: '#059669', '&:hover': { bgcolor: '#047857' } }}
          >
            Finalizar y Aprobar
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mt: 6, mb: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="contained" 
          color="error" 
          disabled={!hasRechazado}
          onClick={() => setEmplazarDialog(true)}
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

export default RevisionActaView;
