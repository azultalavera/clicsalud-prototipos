import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DomainIcon from "@mui/icons-material/Domain";
import BedIcon from "@mui/icons-material/Bed";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import FieldRow from "./FieldRow";

const AggregatedInspectionTable = ({ category, services, inspectorData, infraEfector, equiposEfector, onChange, onOpenObs }) => {
  const isBeds = category === "SALAS Y CAMAS";

  const aggregatedFields = React.useMemo(() => {
    if (isBeds) {
      const items = [];
      const seen = new Set();
      Object.keys(infraEfector || {}).forEach(k => {
        const val = infraEfector[k];
        if (val > 0) {
          const uKey = k.toUpperCase();
          const type = (uKey.includes("CAMA") || uKey.includes("PUESTO")) ? "CAMA" : "SALA";
          items.push({
            id: `infra_literal_${k.replace(/\s+/g, "_")}`,
            name: k,
            label: k,
            _srvName: type === "SALA" ? "INFRAESTRUCTURA" : "CAPACIDAD",
            _type: type,
            declarado: val
          });
          seen.add(uKey);
        }
      });
      (services || []).forEach(srv => {
        const uSrv = srv.name.toUpperCase();
        if (!seen.has(uSrv)) {
          items.push({
            id: `srv_literal_${srv.id}`,
            name: srv.name,
            label: srv.name,
            _srvName: "SERVICIO",
            _type: "CAMA",
            declarado: infraEfector[srv.name] || 0
          });
        }
      });
      return items;
    }

    if (!services) return [];
    let fields = [];
    services.forEach(srv => {
      (srv.sections || []).forEach(sec => {
        const n = sec.name.toUpperCase();
        if (n.includes("EQUIP") || n.includes("INSTRUMENTAL")) {
          (sec.fields || []).forEach(f => {
            fields.push({ ...f, _srvName: srv.name, _type: "EQUIP" });
          });
        }
      });
    });
    return fields;
  }, [isBeds, services, infraEfector]);

  const groups = React.useMemo(() => {
    if (isBeds) {
      return [
        { label: "SALAS", fields: aggregatedFields.filter(f => f._type === "SALA"), icon: <DomainIcon /> },
        { label: "CAMAS Y PUESTOS", fields: aggregatedFields.filter(f => f._type === "CAMA"), icon: <BedIcon /> }
      ];
    }

    if (category === "EQUIPAMIENTO") {
      const grouped = {};
      aggregatedFields.forEach(f => {
        const srvName = f._srvName || "GENERAL";
        if (!grouped[srvName]) grouped[srvName] = [];
        grouped[srvName].push(f);
      });
      return Object.entries(grouped).map(([srvName, fields]) => ({
        label: srvName,
        fields,
        icon: <MedicalServicesIcon />
      }));
    }

    return [{ label: "EQUIPAMIENTO E INSTRUMENTAL", fields: aggregatedFields, icon: <MedicalServicesIcon /> }];
  }, [aggregatedFields, isBeds, category]);

  if (isBeds || category === "EQUIPAMIENTO") {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {groups.map((group) => (
          <Accordion
            key={group.label}
            defaultExpanded
            sx={{
              border: '1px solid #e2e8f0',
              borderRadius: '16px !important',
              boxShadow: 'none',
              '&:before': { display: 'none' }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#0ea5e9' }} />}
              sx={{ bgcolor: '#f8fafc', borderRadius: '16px' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {group.icon && React.cloneElement(group.icon, { sx: { color: '#64748b', fontSize: 20 } })}
                <Typography sx={{ fontWeight: 900, color: '#1e293b', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                  {group.label}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8fafc", borderTop: '1px solid #e2e8f0' }}>
                    <TableCell sx={{ fontWeight: 900, color: "#0369a1", fontSize: "0.75rem", py: 1.5, pl: 3 }}>
                      {category === "EQUIPAMIENTO" ? "EQUIPAMIENTO" : "ELEMENTO"}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 900, color: "#0369a1", fontSize: "0.75rem" }}>DECLARADO (TRÁMITE)</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 900, color: "#0369a1", fontSize: "0.75rem" }}>DECLARADO (INSPECCIÓN)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {group.fields.map((field) => (
                    <FieldRow
                      key={field.id}
                      field={field}
                      currentSrvName={field._srvName}
                      inspectorData={inspectorData}
                      infraEfector={infraEfector}
                      equiposEfector={equiposEfector}
                      onChange={onChange}
                      onOpenObs={onOpenObs}
                    />
                  ))}
                  {group.fields.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3, color: '#94a3b8', fontStyle: 'italic' }}>
                        No hay elementos declarados en esta categoría
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 4, overflow: "hidden" }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "#f8fafc" }}>
            <TableCell sx={{ fontWeight: 900, color: "#0369a1", fontSize: "0.80rem", py: 2 }}>ELEMENTO / SERVICIO</TableCell>
            <TableCell align="center" sx={{ fontWeight: 900, color: "#0369a1", fontSize: "0.80rem" }}>DECLARADO (TRÁMITE)</TableCell>
            <TableCell align="center" sx={{ fontWeight: 900, color: "#0369a1", fontSize: "0.80rem" }}>DECLARADO (INSPECCIÓN)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group) => (
            <React.Fragment key={group.label}>
              {group.fields.length > 0 && (
                <>
                  <TableRow sx={{ bgcolor: "#f1f5f9" }}>
                    <TableCell colSpan={3} sx={{ fontWeight: 900, color: "#475569", py: 1, fontSize: "0.75rem", letterSpacing: 1 }}>
                      {group.label}
                    </TableCell>
                  </TableRow>
                  {group.fields.map((field) => (
                    <FieldRow
                      key={field.id}
                      field={field}
                      currentSrvName={field._srvName}
                      inspectorData={inspectorData}
                      infraEfector={infraEfector}
                      equiposEfector={equiposEfector}
                      onChange={onChange}
                      onOpenObs={onOpenObs}
                    />
                  ))}
                </>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AggregatedInspectionTable;
