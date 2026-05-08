import React from "react";
import {
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const HardcodeDialog = ({ open, onClose, onConfirm, field, value, onChangeValue }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: 4, width: '100%', maxWidth: 450, p: 1 } }}
    >
      <DialogTitle sx={{ fontWeight: 900, color: '#1e293b' }}>
        Simular Valor (Harcodeo)
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          Ingrese el valor que desea que aparezca como <strong>Declarado (Trámite)</strong> para el campo "{field?.label}".
        </Typography>
        <TextField
          fullWidth
          autoFocus
          label="Valor Simulado"
          value={value}
          onChange={(e) => onChangeValue(e.target.value)}
          variant="outlined"
          size="large"
          placeholder={field?.type === 'number' ? "Ej: 10" : "Ej: SI"}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          sx={{ fontWeight: 700, color: '#64748b', textTransform: 'none' }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{
            fontWeight: 800,
            textTransform: 'none',
            borderRadius: 3,
            px: 3,
            bgcolor: '#f59e0b',
            "&:hover": { bgcolor: '#d97706' }
          }}
        >
          Confirmar Valor
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HardcodeDialog;
