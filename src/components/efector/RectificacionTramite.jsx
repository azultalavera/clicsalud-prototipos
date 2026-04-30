import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip, 
  Stack,
  Button,
  Chip,
  Grid,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Error as ErrorIcon,
  CloudUpload as CloudUploadIcon,
  Info as InfoIcon,
  Chat as ChatIcon,
  ArrowBack as ArrowBackIcon,
  ReportProblem as ReportProblemIcon,
  LocalHospital as LocalHospitalIcon,
  Description as DescriptionIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import PantallaInspeccion from "../inspeccion/inspector/PantallaInspeccion";
=======
>>>>>>> inspeccion

const RectificacionTramite = () => {
  const navigate = useNavigate();
  const [acta, setActa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
<<<<<<< HEAD
  const [openActaPopup, setOpenActaPopup] = useState(false);
=======
>>>>>>> inspeccion

  // Datos hardcodeados para ACTA 1 (Baseline)
  const acta1Data = {
    generales: [
      { id: "L-Quejas", elemento: "Libro de Quejas", obs: "No se presenta libro de quejas foliado." },
      { id: "P-Evac", elemento: "Plan de Evacuación", obs: "Vencimiento 10/03/2026." },
      { id: "H-Bomb", elemento: "Habilitación Bomberos", obs: "Certificado vencido Enero 2026." },
      { id: "R-Blind", elemento: "Radiofísica: Blindaje", obs: "Falta blindaje en puerta Rayos X." },
      { id: "R-Dosim", elemento: "Radiofísica: Dosimetría", obs: "Registros incompletos." },
      { id: "R-Senal", elemento: "Radiofísica: Señalética", obs: "Falta luz roja de advertencia." }
    ],
    tramite: [
      { id: "Quir", elemento: "Quirófanos", dec: 11, obs: 5, msg: "IRREGULARIDAD: No se constatan 6 quirófanos." },
      { id: "Camas", elemento: "Camas Uso Transitorio", dec: 5, obs: 9, msg: "RECTIFICACIÓN: Excedente de 4 camas." }
    ]
  };

  useEffect(() => {
    const loadData = () => {
      const storedActa = localStorage.getItem("acta_inspeccion_actual");
      if (storedActa) {
        setActa(JSON.parse(storedActa));
      } else {
        const liveData = localStorage.getItem("inspector_data");
        const liveConfig = localStorage.getItem("master_config");
        const liveGenObs = localStorage.getItem("obs_datos_generales");
        const liveTraObs = localStorage.getItem("obs_datos_tramite");
        const liveManualObs = localStorage.getItem("general_obs");

        if (liveData) {
          setActa({
            id: "BORRADOR-AUTO",
            fecha: new Date().toLocaleDateString(),
            estado: "EN PROCESO",
            inspectorData: JSON.parse(liveData),
            generalObs: liveManualObs || "",
            obsDatosGenerales: liveGenObs ? JSON.parse(liveGenObs) : [],
            obsDatosTramite: liveTraObs ? JSON.parse(liveTraObs) : [],
            config: liveConfig ? JSON.parse(liveConfig) : null,
            isDraft: true
          });
        } else {
          setActa(null);
        }
      }
      setLoading(false);
    };

    loadData();
    const handleStorageChange = (e) => {
      if (["acta_inspeccion_actual", "inspector_data", "obs_datos_generales", "obs_datos_tramite", "general_obs"].includes(e.key)) {
        loadData();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (loading) return <Typography sx={{ p: 4 }}>Cargando acta...</Typography>;

  // Lógica dinámica para ACTA 2
  const dataGroupsActa2 = {
    generales: { items: [], observations: acta?.obsDatosGenerales || [] },
    tramite: { itemsByService: {}, observations: acta?.obsDatosTramite || [] }
  };

  if (acta?.inspectorData) {
    Object.entries(acta.inspectorData).forEach(([fieldId, data]) => {
      if (data.observado) {
        let serviceName = "OTROS";
        let isGeneralField = false;
        if (acta.config?.servicios) {
          acta.config.servicios.forEach(srv => {
            const hasField = srv.sections?.some(sec => sec.fields?.some(f => f.id === fieldId)) || srv.fields?.some(f => f.id === fieldId);
            if (hasField) {
              serviceName = srv.name;
              if (srv.name.toUpperCase().includes("DATOS GENERALES")) isGeneralField = true;
            }
          });
        }
        let fieldLabel = fieldId;
        if (acta.config?.servicios) {
          acta.config.servicios.forEach(srv => {
            const field = srv.sections?.flatMap(sec => sec.fields || []).find(f => f.id === fieldId) || srv.fields?.find(f => f.id === fieldId);
            if (field) fieldLabel = field.label || field.name;
          });
        }
        const item = { id: fieldId, label: fieldLabel, valorDeclarado: data.valorDeclarado || "?", valorObservado: data.valor, obs: data.obs, serviceName };
        if (isGeneralField) dataGroupsActa2.generales.items.push(item);
        else {
          if (!dataGroupsActa2.tramite.itemsByService[serviceName]) dataGroupsActa2.tramite.itemsByService[serviceName] = [];
          dataGroupsActa2.tramite.itemsByService[serviceName].push(item);
        }
      }
    });
  }

  const renderActa1 = () => (
    <Box>
<<<<<<< HEAD
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setOpenActaPopup(true)} 
          startIcon={<AssignmentIcon />}
          sx={{ fontWeight: 900, borderRadius: 3, px: 3, textTransform: 'none', bgcolor: '#005596' }}
        >
          Ver Acta de Inspección
        </Button>
      </Box>
=======
>>>>>>> inspeccion
      <Alert severity="warning" sx={{ mb: 4, borderRadius: 3, borderLeft: '8px solid #f59e0b', fontWeight: 700 }}>
        HISTORIAL ACTA 1: Estos hallazgos corresponden a la inspección inicial. Debe adjuntar el emplazamiento para cada ítem.
      </Alert>
      
      {/* Datos Generales Acta 1 */}
      <Paper sx={{ mb: 4, borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon color="primary" /> <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>DATOS GENERALES</Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>ELEMENTO</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>OBSERVACIÓN</TableCell>
                <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.7rem' }}>RESPUESTA</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {acta1Data.generales.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{row.elemento}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#475569' }}>{row.obs}</TableCell>
                  <TableCell align="center">
                    <Button variant="outlined" size="small" startIcon={<CloudUploadIcon />} sx={{ borderRadius: 1.5, fontSize: '0.6rem', fontWeight: 900 }}>ADJUNTAR</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Datos Tramite Acta 1 */}
      <Paper sx={{ mb: 4, borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <Box sx={{ p: 2, bgcolor: '#fff5f5', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1 }}>
          <ErrorIcon color="error" /> <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>DATOS DEL TRÁMITE</Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>ÍTEM TÉCNICO</TableCell>
                <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.7rem' }}>DEC.</TableCell>
                <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.7rem' }}>OBS.</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>DETALLE</TableCell>
                <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.7rem' }}>EMPLAZAMIENTO</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {acta1Data.tramite.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{row.elemento}</TableCell>
                  <TableCell align="center"><Chip label={row.dec} size="small" sx={{ fontWeight: 800, fontSize: '0.65rem' }} /></TableCell>
                  <TableCell align="center"><Chip label={row.obs} size="small" color="error" sx={{ fontWeight: 800, fontSize: '0.65rem' }} /></TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#475569' }}>{row.msg}</TableCell>
                  <TableCell align="center">
                    <Button variant="contained" size="small" startIcon={<CloudUploadIcon />} sx={{ borderRadius: 1.5, fontSize: '0.6rem', fontWeight: 900, bgcolor: '#005596' }}>SUBIR</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );

  const renderActa2 = () => {
    const hasGenerales = dataGroupsActa2.generales.items.length > 0;
    const hasTramite = Object.keys(dataGroupsActa2.tramite.itemsByService).length > 0;

    return (
      <Box>
        <Alert severity="info" sx={{ mb: 4, borderRadius: 3, borderLeft: '8px solid #0ea5e9', fontWeight: 700 }}>
          EN TIEMPO REAL: Estas observaciones se están cargando actualmente en la tablet del inspector.
        </Alert>

        {hasGenerales && (
          <Paper sx={{ mb: 4, borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon color="primary" /> <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>DATOS GENERALES</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              {renderDynamicTable(dataGroupsActa2.generales.items)}
            </Box>
          </Paper>
        )}

        {hasTramite && (
          <Paper sx={{ mb: 4, borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <Box sx={{ p: 2, bgcolor: '#fff5f5', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1 }}>
              <ErrorIcon color="error" /> <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>DATOS DEL TRÁMITE</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              {renderDynamicTable(
                Object.values(dataGroupsActa2.tramite.itemsByService).flat(),
                true
              )}
            </Box>
          </Paper>
        )}

        {!hasGenerales && !hasTramite && (
          <Box sx={{ py: 8, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 4, border: '2px dashed #e2e8f0' }}>
             <AssignmentIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
             <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 700 }}>No hay observaciones cargadas en el Acta 2 aún.</Typography>
          </Box>
        )}
      </Box>
    );
  };

  const renderDynamicTable = (items, showService = false) => (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {showService && <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>SERVICIO</TableCell>}
            <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>ÍTEM</TableCell>
            <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.7rem' }}>VALOR</TableCell>
            <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>OBSERVACIÓN</TableCell>
            <TableCell align="center" sx={{ fontWeight: 900, fontSize: '0.7rem' }}>ESTADO</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, idx) => (
            <TableRow key={item.id || idx}>
              {showService && (
                <TableCell sx={{ fontWeight: 850, fontSize: '0.65rem', color: '#0ea5e9' }}>
                  {item.serviceName}
                </TableCell>
              )}
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{item.label}</TableCell>
              <TableCell align="center">
                <Chip label={item.valorObservado} size="small" color="warning" sx={{ fontWeight: 900, fontSize: '0.65rem' }} />
              </TableCell>
              <TableCell sx={{ fontSize: '0.75rem', color: '#475569' }}>{item.obs || "Sin detalle adicional"}</TableCell>
              <TableCell align="center">
                <Chip label="PENDIENTE" size="small" variant="outlined" sx={{ fontWeight: 900, fontSize: '0.6rem' }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ width: "100%", p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4, borderBottom: '3px solid #005596', pb: 2 }}>
        <Typography variant="h3" sx={{ color: "#005596", fontWeight: 950, letterSpacing: -2 }}>
          Emplazamientos de Inspección
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 600 }}>
          Responda a los emplazamientos de las actas registradas.
        </Typography>
      </Box>

      <Tabs 
        value={activeTab} 
        onChange={(e, v) => setActiveTab(v)} 
        sx={{ 
          mb: 4, 
          '& .MuiTabs-indicator': { height: 4, borderRadius: 2, bgcolor: '#005596' },
          '& .MuiTab-root': { fontWeight: 900, fontSize: '1rem', textTransform: 'none' }
        }}
      >
        <Tab label="ACTA 1 (Baseline)" icon={<AssignmentIcon />} iconPosition="start" />
        <Tab label="ACTA 2 (En proceso)" icon={<SettingsIcon />} iconPosition="start" />
      </Tabs>

      {activeTab === 0 ? renderActa1() : renderActa2()}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '3px solid #e2e8f0', pt: 4, mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate("/home-efector")} sx={{ fontWeight: 900, borderRadius: 3, px: 4, textTransform: 'none' }}>Volver</Button>
        <Button 
          variant="contained" 
          onClick={() => setOpenConfirm(true)}
          sx={{ bgcolor: "#059669", fontWeight: 950, px: 6, borderRadius: 3, textTransform: 'none', '&:hover': { bgcolor: '#047857' } }}
        >
          Enviar Respuestas
        </Button>
      </Box>

      {/* MODAL DE CONFIRMACIÓN - DECLARACIÓN JURADA */}
      <Dialog 
        open={openConfirm} 
        onClose={() => setOpenConfirm(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ bgcolor: '#00447a', color: 'white', fontWeight: 900, py: 2 }}>
          Confirmar envío de respuestas
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Typography sx={{ mb: 3, fontWeight: 700, color: '#334155' }}>
            Está a punto de enviar sus respuestas al inspector. Al hacerlo confirma que:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ErrorIcon sx={{ color: '#ef4444', mt: 0.5 }} />
              <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>
                Las respuestas de emplazamiento por irregularidades <b>NO modifica el trámite automáticamente</b>. Dicha evidencia será evaluada por un inspector y quedará sujeta a una próxima inspección.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <InfoIcon sx={{ color: '#f59e0b', mt: 0.5 }} />
              <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>
                Las respuestas de emplazamiento por documentos observados <b>NO modifican el trámite automáticamente</b>. Dicha evidencia será evaluada por un inspector y quedará sujeta a una próxima inspección.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <WarningIcon sx={{ color: '#eab308', mt: 0.5 }} />
              <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>
                El trámite se rectificará con los valores observados por el inspector.
              </Typography>
            </Box>
          </Box>

          <Typography sx={{ mt: 4, fontWeight: 900, color: '#1e293b' }}>
            Este formulario tiene carácter de Declaración Jurada ¿Acepta esta Declaración Jurada?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', justifyContent: 'space-between' }}>
          <Button 
            onClick={() => setOpenConfirm(false)}
            variant="contained" 
            sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' }, fontWeight: 900, px: 4 }}
          >
            CANCELAR
          </Button>
          <Button 
            onClick={() => {
              setOpenConfirm(false);
              navigate("/home-efector");
            }}
            variant="contained" 
            sx={{ bgcolor: '#0288d1', '&:hover': { bgcolor: '#01579b' }, fontWeight: 900, px: 4 }}
          >
            ACEPTAR
          </Button>
        </DialogActions>
      </Dialog>
<<<<<<< HEAD

      {/* MODAL PARA VER ACTA (COPIA DE INSPECTOR) */}
      <Dialog
        open={openActaPopup}
        onClose={() => setOpenActaPopup(false)}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: { borderRadius: 4, height: "90vh" }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#005596', color: 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 950 }}>VISTA PREVIA: ACTA DE INSPECCIÓN</Typography>
          <Button onClick={() => setOpenActaPopup(false)} color="inherit">Cerrar</Button>
        </DialogTitle>
        <DialogContent sx={{ p: 0, bgcolor: '#f8fafc' }}>
          <PantallaInspeccion 
            serviciosEfector={["GUARDIA", "QUIROFANO", "INTERNACION"]}
            infraEfector={{ "CAMAS": 12, "QUIRÓFANO": 1 }}
            rrhhEfector={[
              { especialidad: "MEDICINA GENERAL", cantidadCargada: 4, origen: "GUARDIA" },
              { especialidad: "CIRUGIA", cantidadCargada: 2, origen: "QUIROFANO" }
            ]}
            equiposEfector={[
              { equipamiento: "DESFIBRILADOR", actualQty: 1, origen: "GUARDIA" },
              { equipamiento: "MESA DE CIRUGIA", actualQty: 1, origen: "QUIROFANO" }
            ]}
            tipologia="CLÍNICAS, SANATORIOS Y HOSPITALES"
            directorTecnico={{ nombre: "JUAN", apellido: "PÉREZ", dni: "20.123.456" }}
          />
        </DialogContent>
      </Dialog>
=======
>>>>>>> inspeccion
    </Box>
  );
};

export default RectificacionTramite;
