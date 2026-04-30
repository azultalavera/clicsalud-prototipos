import React from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Close from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ErrorIcon from "@mui/icons-material/Error";

export const FieldItem = ({ field, value, onChange, onOpenObs }) => {
  const isObject = value && typeof value === 'object' && !Array.isArray(value);
  const val = isObject ? value.value : value;
  const obsText = isObject ? value.obs : "";

  const renderInput = () => {
    switch (field.type) {
      case "boolean":
      case "checkbox":
        return (
          <Stack direction="row" spacing={1} sx={{ width: "100%", justifyContent: "center" }}>
            <Button
              variant={val === true ? "contained" : "outlined"}
              color="success"
              onClick={() => onChange(field.id, true)}
              sx={{ flex: 1, borderRadius: 2, fontWeight: 900, textTransform: "none" }}
            >
              SÍ
            </Button>
            <Button
              variant={val === false ? "contained" : "outlined"}
              color="error"
              onClick={() => onChange(field.id, false)}
              sx={{ flex: 1, borderRadius: 2, fontWeight: 900, textTransform: "none" }}
            >
              NO
            </Button>
          </Stack>
        );
      case "date":
        return (
          <TextField
            fullWidth
            type="date"
            value={val || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "white" } }}
          />
        );
      case "number":
        return (
          <TextField
            fullWidth
            type="number"
            value={val || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            variant="outlined"
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "white" } }}
          />
        );
      case "select":
        return (
          <TextField
            select
            fullWidth
            value={val || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            variant="outlined"
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "white" } }}
          >
            {Array.isArray(field.options) && field.options.map((opt) => (
              <MenuItem key={opt.id || opt.value || opt} value={opt.value || opt}>
                {opt.label || opt}
              </MenuItem>
            ))}
          </TextField>
        );
      default:
        return (
          <TextField
            fullWidth
            value={val || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            variant="outlined"
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "white" } }}
          />
        );
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 4, border: "1px solid #e2e8f0" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5, alignItems: "flex-start" }}>
        <Typography variant="body2" sx={{ fontWeight: 800, color: "#334155", fontSize: "0.85rem", flex: 1, pr: 1 }}>
          {field.label}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title={obsText ? "Editar observación" : "Agregar observación"}>
            <IconButton
              size="small"
              onClick={() => onOpenObs(field.id, field.label, obsText)}
              sx={{
                bgcolor: obsText ? "#e0f2fe" : "transparent",
                color: obsText ? "#0ea5e9" : "#94a3b8",
                "&:hover": { bgcolor: "#f1f5f9" },
              }}
            >
              {obsText ? <ChatBubbleIcon fontSize="small" /> : <ChatBubbleOutlineIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {renderInput()}
      {obsText && (
        <Typography variant="caption" sx={{ display: "block", mt: 1, fontStyle: "italic", color: "#0ea5e9", fontWeight: 700 }}>
          Obs: {obsText}
        </Typography>
      )}
    </Box>
  );
};

export const VerificationTable = ({ fields, inspectorData, onChange, onOpenObs, infraEfector, rrhhEfector, equiposEfector, currentSrvName }) => {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 4, border: "2px solid #f1f5f9", boxShadow: "none" }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: "#f8fafc" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 900, fontSize: "0.75rem", color: "#64748b" }}>ÍTEM</TableCell>
            <TableCell align="center" sx={{ fontWeight: 900, fontSize: "0.75rem", color: "#64748b" }}>DECLARADO</TableCell>
            <TableCell align="center" sx={{ fontWeight: 900, fontSize: "0.75rem", color: "#64748b" }}>CONSTATADO</TableCell>
            <TableCell align="center" sx={{ fontWeight: 900, fontSize: "0.75rem", color: "#64748b" }}>OBS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((f) => {
            const fieldData = inspectorData[f.id];
            const isObject = fieldData && typeof fieldData === 'object' && !Array.isArray(fieldData);
            const val = isObject ? fieldData.value : fieldData;
            const obsText = isObject ? fieldData.obs : "";

            let declarado = "-";
            if (f.label.includes("Camas") || f.label.includes("Salas")) {
              declarado = infraEfector[f.label] || infraEfector[currentSrvName] || 0;
            } else if (f.id.includes("rrhh")) {
              declarado = rrhhEfector.find((r) => r.cargo === f.label)?.cantidad || 0;
            } else if (f.id.includes("eq")) {
              declarado = equiposEfector.filter((e) => e.equipamiento === f.label && e.origen === currentSrvName).reduce((acc, curr) => acc + (curr.actualQty || 1), 0);
            }

            const isMatch = String(val) === String(declarado);

            return (
              <TableRow key={f.id} hover>
                <TableCell sx={{ fontWeight: 800, fontSize: "0.8rem", color: "#334155" }}>{f.label}</TableCell>
                <TableCell align="center">
                  <Box sx={{ fontWeight: 900, fontSize: "0.9rem", color: "#64748b", bgcolor: "#f1f5f9", py: 0.5, px: 1, borderRadius: 2, display: "inline-block", minWidth: 40 }}>
                    {declarado}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <TextField
                    size="small"
                    type="number"
                    value={val || ""}
                    onChange={(e) => onChange(f.id, e.target.value)}
                    sx={{ width: 80, "& .MuiOutlinedInput-root": { borderRadius: 2, fontWeight: 900, color: isMatch ? "#10b981" : "#ef4444" } }}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => onOpenObs(f.id, f.label, obsText)}
                    sx={{ color: obsText ? "#0ea5e9" : "#cbd5e1" }}
                  >
                    {obsText ? <ChatBubbleIcon fontSize="small" /> : <ChatBubbleOutlineIcon fontSize="small" />}
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const PlansTable = ({ inspectorData, onChange, onOpenObs, infraEfector, currentSrvName }) => {
  const planItems = [
    { id: "plano_civil", label: "Plano de Edificación / Civil" },
    { id: "plano_electrico", label: "Plano Eléctrico" },
    { id: "plano_gas", label: "Plano de Gas / Gases Medicinales" },
    { id: "plano_evacuacion", label: "Plan de Evacuación / Incendio" },
  ];

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 4, border: "2px solid #f1f5f9", boxShadow: "none" }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: "#f8fafc" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 900, fontSize: "0.75rem", color: "#64748b" }}>PLANO / DOCUMENTO TÉCNICO</TableCell>
            <TableCell align="center" sx={{ fontWeight: 900, fontSize: "0.75rem", color: "#64748b" }}>ESTADO</TableCell>
            <TableCell align="center" sx={{ fontWeight: 900, fontSize: "0.75rem", color: "#64748b" }}>OBS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {planItems.map((item) => {
            const fieldData = inspectorData[item.id];
            const isObject = fieldData && typeof fieldData === 'object' && !Array.isArray(fieldData);
            const val = isObject ? fieldData.value : fieldData;
            const obsText = isObject ? fieldData.obs : "";

            return (
              <TableRow key={item.id} hover>
                <TableCell sx={{ fontWeight: 800, fontSize: "0.8rem", color: "#334155" }}>{item.label}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button
                      variant={val === true ? "contained" : "outlined"}
                      color="success"
                      size="small"
                      onClick={() => onChange(item.id, true)}
                      sx={{ borderRadius: 2, fontWeight: 900, minWidth: 60 }}
                    >
                      OK
                    </Button>
                    <Button
                      variant={val === false ? "contained" : "outlined"}
                      color="error"
                      size="small"
                      onClick={() => onChange(item.id, false)}
                      sx={{ borderRadius: 2, fontWeight: 900, minWidth: 60 }}
                    >
                      NO
                    </Button>
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => onOpenObs(item.id, item.label, obsText)}
                    sx={{ color: obsText ? "#0ea5e9" : "#cbd5e1" }}
                  >
                    {obsText ? <ChatBubbleIcon fontSize="small" /> : <ChatBubbleOutlineIcon fontSize="small" />}
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const ObservationDialog = ({ open, label, value, onClose, onSave }) => {
  const [text, setText] = React.useState(value);

  React.useEffect(() => {
    if (open) setText(value);
  }, [open, value]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 5, p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 900, color: "#1e293b", pb: 1 }}>{label}</DialogTitle>
      <DialogContent>
        <Typography variant="caption" sx={{ color: "#64748b", mb: 2, display: "block", fontWeight: 700 }}>
          Ingrese cualquier observación o hallazgo detectado en este ítem:
        </Typography>
        <TextField
          autoFocus
          fullWidth
          multiline
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ej: Se observa falta de mantenimiento..."
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4, bgcolor: "#f8fafc" } }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} sx={{ fontWeight: 800, color: "#94a3b8" }}>CANCELAR</Button>
        <Button
          variant="contained"
          onClick={() => { onSave(text); onClose(); }}
          sx={{ borderRadius: 3, fontWeight: 900, px: 3, bgcolor: "#0ea5e9", "&:hover": { bgcolor: "#0284c7" } }}
        >
          GUARDAR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const FileViewerModal = ({ file, onClose }) => {
  if (!file) return null;
  const isImage = file.type?.startsWith("image/") || file.name?.match(/\.(jpg|jpeg|png|gif)$/i);

  return (
    <Dialog open={!!file} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 6, overflow: "hidden" } }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#f8fafc", py: 2 }}>
        <Typography sx={{ fontWeight: 900, color: "#1e293b" }}>{file.name || "Visualizador"}</Typography>
        <IconButton onClick={onClose} size="small"><Close /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, bgcolor: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        {isImage ? (
          <img src={file.url || (file instanceof File ? URL.createObjectURL(file) : "")} alt="preview" style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain" }} />
        ) : (
          <Box sx={{ color: "white", textAlign: "center", p: 4 }}>
            <VisibilityIcon sx={{ fontSize: 80, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6">Vista previa no disponible</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>Este tipo de archivo no se puede previsualizar directamente.</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const SignatureModal = ({ open, step, onClose, onSave }) => {
  const sigCanvas = React.useRef(null);
  const title = step === 1 ? "Firma del Responsable del Establecimiento" : "Firma del Inspector Actuante";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 6, p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 950, color: "#1e293b", textAlign: "center", pt: 3 }}>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ border: "2px dashed #cbd5e1", borderRadius: 4, bgcolor: "#f8fafc", height: 250, mt: 2, position: "relative", overflow: "hidden" }}>
          <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", pointerEvents: "none" }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>Firme dentro de este recuadro</Typography>
          </Box>
          <canvas ref={sigCanvas} width={600} height={250} style={{ width: "100%", height: "100%", cursor: "crosshair", position: "relative" }} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
        <Button onClick={onClose} sx={{ fontWeight: 800, color: "#94a3b8" }}>CANCELAR</Button>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => { const ctx = sigCanvas.current.getContext("2d"); ctx.clearRect(0, 0, 600, 250); }} sx={{ borderRadius: 3, fontWeight: 800 }}>LIMPIAR</Button>
          <Button variant="contained" onClick={() => onSave("data:image/png;base64,...")} sx={{ borderRadius: 3, fontWeight: 900, px: 4, bgcolor: "#0ea5e9" }}>ACEPTAR</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
