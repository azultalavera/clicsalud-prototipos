import React from "react";
import {
  Box,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  Chip,
  TextField,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ErrorIcon from "@mui/icons-material/Error";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { normalize } from "./utils";

const FieldRow = ({ field, currentSrvName, inspectorData, infraEfector, equiposEfector, onChange, onOpenObs }) => {
  const currentVal = inspectorData[field.id] || {};
  const isObservado = currentVal.observado || false;
  const valorObj = currentVal.value;
  const obsText = currentVal.obs || "";

  let valorDeclarado = "0";

  const name = field.label || field.name;
  if (field.declarado !== undefined) {
    valorDeclarado = field.declarado;
  } else if (infraEfector && (infraEfector[name] !== undefined || infraEfector[currentSrvName] !== undefined)) {
    const isGeneric = normalize(name).includes("CAMA") || normalize(name).includes("SALA");
    valorDeclarado = isGeneric ? (infraEfector[currentSrvName] || 0) : (infraEfector[name] || 0);
  } else if (equiposEfector) {
    const eq = equiposEfector.find(e => (e.equipamiento === name || e.equipamiento === field.label) && e.origen === currentSrvName);
    if (eq) valorDeclarado = eq.actualQty || 1;
  }

  const displayValue = valorObj !== undefined ? valorObj : "";
  const vObs = (valorObj !== undefined && valorObj !== "") ? Number(valorObj) : Number(valorDeclarado);
  const vDec = Number(valorDeclarado);
  const isMatch = vObs === vDec;

  const getStatusIndicator = () => {
    if (isMatch) return <CheckCircleIcon sx={{ color: "#cbd5e1", fontSize: 20 }} />;
    return vObs > vDec
      ? <ErrorIcon sx={{ color: "#ef4444", fontSize: 20 }} />
      : <ReportProblemIcon sx={{ color: "#f59e0b", fontSize: 20 }} />;
  };

  return (
    <TableRow hover>
      <TableCell sx={{ py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.85rem" }}>{name}</Typography>
          <IconButton
            size="small"
            onClick={() => {
              const autoObs = true;
              if (!currentVal.observado) {
                onChange(field.id, { ...currentVal, observado: autoObs });
              }
              onOpenObs(field.id, `[${currentSrvName}] ${name}`, obsText);
            }}
            sx={{ color: (obsText || !isMatch) ? "#0ea5e9" : "#cbd5e1" }}
          >
            {(obsText || !isMatch) ? <ChatBubbleIcon sx={{ fontSize: 18 }} /> : <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Chip label={valorDeclarado} size="small" sx={{ fontWeight: 800, bgcolor: "#f1f5f9" }} />
      </TableCell>
      <TableCell align="center">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <TextField
            size="small"
            type="number"
            placeholder={String(valorDeclarado)}
            value={displayValue}
            onChange={(e) => {
              const newVal = e.target.value;
              const numericVal = newVal === "" ? Number(valorDeclarado) : Number(newVal);
              const autoObs = numericVal !== vDec || obsText !== "";

              onChange(field.id, {
                value: newVal,
                observado: autoObs,
                valorDeclarado: valorDeclarado
              });
            }}
            sx={{
              width: 60,
              "& .MuiInputBase-root": { height: 30, fontWeight: 800, fontSize: '0.8rem' },
              "& .MuiInputBase-input::placeholder": { color: "#cbd5e1", opacity: 1 }
            }}
          />
          {getStatusIndicator()}
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default FieldRow;
