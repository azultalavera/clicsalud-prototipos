import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  TextField,
  MenuItem,
  Stack,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Autocomplete,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ErrorOutline as ErrorOutlineIcon,
  Domain as DomainIcon,
  People as PeopleIcon,
  MedicalServices as MedicalServicesIcon,
  Bed as BedIcon,
  LocalHospital as LocalHospitalIcon,
} from "@mui/icons-material";

const DEFAULT_TIPOLOGIA = "CLÍNICAS, SANATORIOS Y HOSPITALES";

const PantallaInspeccion = ({
  serviciosEfector: propsServicios,
  infraEfector: propsInfra,
  rrhhEfector: propsRrhh,
  equiposEfector: propsEquipos,
}) => {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);
  const [inspectorData, setInspectorData] = useState({});

  const [expandedDatosGenerales, setExpandedDatosGenerales] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ARQUITECTURA");
  const [selectedSubService, setSelectedSubService] = useState("UTI");
  const [serviciosEfector, setServiciosEfector] = useState([]);
  const [infraEfector, setInfraEfector] = useState({});
  const [rrhhEfector, setRrhhEfector] = useState([]);
  const [equiposEfector, setEquiposEfector] = useState([]);

  useEffect(() => {
    const loadFromCache = () => {
      const cachedSrv = localStorage.getItem("efector_servicios");
      const cachedInfra = localStorage.getItem("efector_infra");
      const cachedRrhh = localStorage.getItem("efector_rrhh");
      const cachedEquipos = localStorage.getItem("efector_equipos");
      if (cachedSrv) setServiciosEfector(JSON.parse(cachedSrv));
      if (cachedInfra) setInfraEfector(JSON.parse(cachedInfra));
      if (cachedRrhh) setRrhhEfector(JSON.parse(cachedRrhh));
      if (cachedEquipos) setEquiposEfector(JSON.parse(cachedEquipos));
    };

    // 1. Prioridad: Props
    if (propsServicios) {
      setServiciosEfector(propsServicios);
      setInfraEfector(propsInfra || {});
      setRrhhEfector(propsRrhh || []);
      setEquiposEfector(propsEquipos || []);
    } else {
      // 2. Fallback: LocalStorage
      loadFromCache();
    }

    // 3. Escuchar cambios en otras pestañas (Sincronización automática)
    const handleStorageChange = (e) => {
      if (e.key?.startsWith("efector_")) {
        loadFromCache();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [propsServicios, propsInfra, propsRrhh, propsEquipos]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3001/configuraciones_maestras?tipologia=${encodeURIComponent(
            DEFAULT_TIPOLOGIA,
          )}`,
        );
        const data = await res.json();
        if (data && data.length > 0) {
          setConfig(data[0]);
        }
      } catch (err) {
        console.error("Error al cargar configuración", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const SUBSERVICIOS = ["UTI", "UCO", "UTIP", "UTIN", "HEMODIALISIS"];
  const TARGET_MAPPINGS = {
    UTI: ["UTI", "TERAPIA INTENSIVA", "CUIDADOS INTENSIVOS"],
    UCO: ["UCO", "CORONARIA", "CORONARIO"],
    UTIP: ["UTIP", "PEDIATRICA"],
    UTIN: ["UTIN", "NEONATAL"],
    HEMODIALISIS: ["HEMODIALISIS", "DIALISIS"],
  };

  const activeSubServicios = SUBSERVICIOS.filter((sub) => {
    return serviciosEfector.some((srvName) => {
      const isMatch = TARGET_MAPPINGS[sub]?.some((k) =>
        srvName.toUpperCase().includes(k),
      );
      const isExcluded =
        sub === "UTI" &&
        (srvName.toUpperCase().includes("PEDIATRICA") ||
          srvName.toUpperCase().includes("NEONATAL"));
      return isMatch && !isExcluded;
    });
  });

  useEffect(() => {
    if (
      activeSubServicios.length > 0 &&
      !activeSubServicios.includes(selectedSubService)
    ) {
      setSelectedSubService(activeSubServicios[0]);
    }
  }, [activeSubServicios, selectedSubService]);

  const handleFieldChange = (fieldId, value) => {
    setInspectorData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#ffffffff",
        }}
      >
        <CircularProgress size={80} thickness={4} />
      </Box>
    );
  }

  const datosGeneralesSrv = config?.servicios?.find((s) =>
    s.name?.toUpperCase().includes("DATOS GENERALES"),
  );

  const otherServices =
    config?.servicios?.filter(
      (s) =>
        !s.name?.toUpperCase().includes("DATOS GENERALES") &&
        serviciosEfector.includes(s.name),
    ) || [];

  const allServiceNames = config?.servicios?.map((s) => s.name) || [];

  const PESTAÑAS = [
    {
      id: "ARQUITECTURA",
      label: "ARQUITECTURA",
      icon: <DomainIcon sx={{ fontSize: 28 }} />,
    },
    {
      id: "RECURSOS HUMANOS",
      label: "RRHH",
      icon: <PeopleIcon sx={{ fontSize: 28 }} />,
    },
    {
      id: "EQUIPAMIENTO",
      label: "EQUIPAMIENTO",
      icon: <MedicalServicesIcon sx={{ fontSize: 28 }} />,
    },
    {
      id: "SALAS Y CAMAS",
      label: "SALAS Y CAMAS",
      icon: <BedIcon sx={{ fontSize: 28 }} />,
    },
    {
      id: "SERVICIOS",
      label: "SERVICIOS",
      icon: <LocalHospitalIcon sx={{ fontSize: 28 }} />,
    },
  ];

  const getFlatFields = (sectionsObj) => {
    return sectionsObj?.flatMap((sec) => sec.fields || []) || [];
  };

  const getCompletionStats = (fieldsArray) => {
    if (!fieldsArray || fieldsArray.length === 0)
      return { total: 0, filled: 0, percent: 100 };
    const total = fieldsArray.length;
    const filled = fieldsArray.filter((f) => {
      const val = inspectorData[f.id];
      if (val === undefined || val === null) return false;
      if (typeof val === "object")
        return val.observado !== undefined && val.observado !== false;
      return String(val).trim() !== "";
    }).length;
    const percent = Math.round((filled / total) * 100);
    return { total, filled, percent };
  };

  const renderProgressBar = (stats) => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 1,
          mt: 1,
          width: "100%",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <LinearProgress
            variant="determinate"
            value={stats.percent}
            sx={{
              height: 8,
              borderRadius: 3,
              bgcolor: "#f1f5f9",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#b7b7b7",
                borderRadius: 3,
              },
            }}
          />
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 900,
            minWidth: 45,
            color: "#64748b",
            textAlign: "right",
          }}
        >
          {stats.percent}%
        </Typography>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 64px)",
        width: "89%",
        bgcolor: "#ffffff",
        overflowX: "hidden",
        mx: "auto",
        maxWidth: 800,
        pt: 4,
        pb: 10,
      }}
    >
      {datosGeneralesSrv && (
        <Accordion
          expanded={expandedDatosGenerales}
          onChange={() => setExpandedDatosGenerales(!expandedDatosGenerales)}
          sx={{
            mb: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            borderRadius: "16px !important",
            "&:before": { display: "none" },
            border: "1px solid #e2e8f0",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#0ea5e9" }} />}
            sx={{ px: { xs: 2, sm: 3 }, py: 1 }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                pr: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 900, color: "#1e293b" }}
              >
                DATOS GENERALES
              </Typography>
              {renderProgressBar(
                getCompletionStats(
                  datosGeneralesSrv.sections
                    ? getFlatFields(datosGeneralesSrv.sections)
                    : datosGeneralesSrv.fields,
                ),
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              px: { xs: 2, sm: 3 },
              py: 3,
              bgcolor: "#ffffffff",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {datosGeneralesSrv.sections
                ? datosGeneralesSrv.sections.map((sec) => {
                    const sectionStats = getCompletionStats(sec.fields);
                    return (
                      <Accordion
                        key={sec.id}
                        elevation={0}
                        sx={{
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px !important",
                          overflow: "hidden",
                          "&:before": { display: "none" },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <ExpandMoreIcon sx={{ color: "#0ea5e9" }} />
                          }
                          sx={{
                            bgcolor: "#f8fafc",
                            "& .MuiAccordionSummary-content": {
                              flexDirection: "column",
                            },
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 800,
                              color: "#475569",
                              textTransform: "uppercase",
                              fontSize: "0.8rem",
                            }}
                          >
                            {sec.name}
                          </Typography>
                          {renderProgressBar(sectionStats)}
                        </AccordionSummary>
                        <AccordionDetails sx={{ py: 3 }}>
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                              gap: 3,
                            }}
                          >
                            {sec.fields.map((field) => (
                              <FieldItem
                                key={field.id}
                                field={field}
                                value={inspectorData[field.id]}
                                onChange={handleFieldChange}
                              />
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })
                : datosGeneralesSrv.fields?.map((field) => (
                    <FieldItem
                      key={field.id}
                      field={field}
                      value={inspectorData[field.id]}
                      onChange={handleFieldChange}
                    />
                  ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
          px: { xs: 1, sm: 4 },
          width: "100%",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 28,
            left: { xs: 30, sm: 80 },
            right: { xs: 30, sm: 80 },
            height: 2,
            bgcolor: "#e2e8f0",
            zIndex: 0,
          }}
        />

        {PESTAÑAS.map((tab) => {
          const isSelected = selectedCategory === tab.id;
          return (
            <Box
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                zIndex: 1,
                width: "20%",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: isSelected ? "#0ea5e9" : "#ffffff",
                  color: isSelected ? "white" : "#64748b",
                  border: "2px solid",
                  borderColor: isSelected ? "#0ea5e9" : "#cbd5e1",
                  boxShadow: isSelected
                    ? "0 4px 10px rgba(14,165,233,0.3)"
                    : "none",
                  transition: "all 0.2s",
                }}
              >
                {tab.icon}
              </Box>
              <Typography
                align="center"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.8rem" },
                  color: isSelected ? "#0f172a" : "#64748b",
                  lineHeight: 1.1,
                }}
              >
                {tab.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {selectedCategory === "SERVICIOS" && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mb: 4,
            mt: 3,
            justifyContent: "center",
            p: 2,
            bgcolor: "#f8fafc",
            borderRadius: 4,
            border: "1px dashed #cbd5e1",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              width: "100%",
              textAlign: "center",
              fontWeight: 700,
              mb: 1,
              color: "#94a3b8",
            }}
          >
            SUB-ÁREAS TÉCNICAS A EVALUAR
          </Typography>
          {activeSubServicios.length === 0 && (
            <Typography
              variant="body2"
              sx={{ color: "#ef4444", fontWeight: 700 }}
            >
              El efector no ha declarado ningún servicio de este tipo.
            </Typography>
          )}
          {activeSubServicios.map((sub) => (
            <Chip
              key={sub}
              size="medium"
              label={sub}
              clickable
              onClick={() => setSelectedSubService(sub)}
              sx={{
                fontWeight: 800,
                fontSize: "0.85rem",
                px: 1,
                bgcolor: selectedSubService === sub ? "#e0f2fe" : "white",
                color: selectedSubService === sub ? "#0369a1" : "#64748b",
                border: "2px solid",
                borderColor: selectedSubService === sub ? "#0ea5e9" : "#e2e8f0",
              }}
            />
          ))}
        </Box>
      )}

      {selectedCategory !== "SERVICIOS" && <Box sx={{ mb: 4 }} />}

      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}
      >
        {otherServices.map((srv) => {
          let matchedSections = [];

          if (selectedCategory === "SERVICIOS") {
            const isTargetService = TARGET_MAPPINGS[selectedSubService]?.some(
              (k) => srv.name?.toUpperCase().includes(k),
            );
            const isExcluded =
              selectedSubService === "UTI" &&
              (srv.name?.toUpperCase().includes("PEDIATRICA") ||
                srv.name?.toUpperCase().includes("NEONATAL"));

            if (isTargetService && !isExcluded && srv.sections) {
              matchedSections = srv.sections.filter((sec) => {
                const n = sec.name.toUpperCase();
                return (
                  !n.includes("ARQUITECTURA") &&
                  !n.includes("RECURSOS") &&
                  !n.includes("EQUIPAMIENTO")
                );
              });
            }
          } else {
            if (srv.sections) {
              const keyword =
                selectedCategory === "RECURSOS HUMANOS"
                  ? "RECURSOS"
                  : selectedCategory === "SALAS Y CAMAS"
                    ? "SALA"
                    : selectedCategory;
              matchedSections = srv.sections.filter(
                (sec) =>
                  sec.name.toUpperCase().includes(keyword) ||
                  (selectedCategory === "SALAS Y CAMAS" &&
                    sec.name.toUpperCase().includes("CAMA")),
              );
            }
          }

          if (!matchedSections || matchedSections.length === 0) return null;

          const blockStats = getCompletionStats(getFlatFields(matchedSections));

          return (
            <Box key={srv.id} sx={{ mb: 2 }}>
              <Box sx={{ mb: 3, display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 32,
                      bgcolor: "#475569",
                      borderRadius: 4,
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 900,
                      color: "#1e293b",
                      letterSpacing: -0.5,
                    }}
                  >
                    {srv.name}
                  </Typography>
                </Box>
                {renderProgressBar(blockStats)}
              </Box>

              {matchedSections.map((section) => (
                <Box key={section.id} sx={{ mb: 4 }}>
                  {selectedCategory === "SERVICIOS" && (
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 800,
                        mb: 2,
                        color: "#64748b",
                        textTransform: "uppercase",
                      }}
                    >
                      {section.name}
                    </Typography>
                  )}

                  {selectedCategory === "EQUIPAMIENTO" ||
                  selectedCategory === "RECURSOS HUMANOS" ||
                  selectedCategory === "SALAS Y CAMAS" ? (
                    <VerificationTable
                      fields={section.fields.filter((f) => {
                        // FILTRO POR SALAS Y CAMAS
                        if (selectedCategory === "SALAS Y CAMAS") {
                          const name = f.label || f.name;
                          return infraEfector[name] > 0;
                        }
                        // FILTRO POR RECURSOS HUMANOS
                        if (selectedCategory === "RECURSOS HUMANOS") {
                          return rrhhEfector.some(
                            (r) =>
                              (r.especialidad === f.especialidad ||
                                r.tipoPlantel === f.tipoPlantel) &&
                              r.origen === srv.name &&
                              r.cantidadCargada > 0,
                          );
                        }
                        // FILTRO POR EQUIPAMIENTO
                        if (selectedCategory === "EQUIPAMIENTO") {
                          return equiposEfector.some(
                            (e) =>
                              e.equipamiento === f.equipamiento &&
                              e.origen === srv.name,
                          );
                        }
                        return true;
                      })}
                      inspectorData={inspectorData}
                      onChange={handleFieldChange}
                      infraEfector={infraEfector}
                      rrhhEfector={rrhhEfector}
                      equiposEfector={equiposEfector}
                      currentSrvName={srv.name}
                    />
                  ) : (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: 3,
                      }}
                    >
                      {section.fields?.map((field) => (
                        <FieldItem
                          key={field.id}
                          field={field}
                          value={inspectorData[field.id]}
                          onChange={handleFieldChange}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
              <Divider sx={{ mb: 2, mt: 4, opacity: 0.5 }} />
            </Box>
          );
        })}
      </Box>

      <Stack direction="row" spacing={3} sx={{ mt: 8 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{
            py: 2.5,
            borderRadius: 8,
            fontWeight: 900,
            fontSize: "1.2rem",
            bgcolor: "#059669",
            "&:hover": { bgcolor: "#047857" },
          }}
        >
          FINALIZAR ACTA
        </Button>
      </Stack>
    </Box>
  );
};

const FieldItem = ({ field, value, onChange }) => {
  const renderInput = () => {
    switch (field.type) {
      case "boolean":
      case "checkbox":
        return (
          <ToggleButtonGroup
            value={value === undefined ? null : value ? "si" : "no"}
            exclusive
            onChange={(e, val) => {
              if (val !== null) onChange(field.id, val === "si");
            }}
            fullWidth
            sx={{ height: 48 }}
          >
            <ToggleButton
              value="si"
              sx={{
                flex: 1,
                borderRadius: "8px 0 0 8px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                fontWeight: 700,
                color: "#64748b",
                "&.Mui-selected": {
                  bgcolor: "#dcfce7",
                  color: "#166534",
                  fontWeight: 900,
                },
              }}
            >
              SÍ
            </ToggleButton>
            <ToggleButton
              value="no"
              sx={{
                flex: 1,
                borderRadius: "0 8px 8px 0",
                border: "1px solid #cbd5e1",
                borderLeft: "none",
                fontSize: "14px",
                fontWeight: 700,
                color: "#64748b",
                "&.Mui-selected": {
                  bgcolor: "#fee2e2",
                  color: "#991b1b",
                  fontWeight: 900,
                },
              }}
            >
              NO
            </ToggleButton>
          </ToggleButtonGroup>
        );
      case "date":
        return (
          <TextField
            type="date"
            fullWidth
            variant="outlined"
            size="small"
            value={value || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              sx: {
                borderRadius: 2,
                fontSize: "14px",
                height: 48,
                fontWeight: 600,
              },
            }}
          />
        );
      case "toggle":
        return (
          <ToggleButtonGroup
            value={value}
            exclusive
            onChange={(e, val) => {
              if (val !== null) onChange(field.id, val);
            }}
            fullWidth
            sx={{ height: 48 }}
          >
            {field.options?.split(",").map((opt) => (
              <ToggleButton
                key={opt}
                value={opt.trim()}
                sx={{
                  flex: 1,
                  fontSize: "13px",
                  fontWeight: 700,
                  "&.Mui-selected": {
                    bgcolor: "#e0f2fe",
                    color: "#0369a1",
                    fontWeight: 900,
                  },
                }}
              >
                {opt.trim()}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        );
      case "select":
        return (
          <TextField
            select
            fullWidth
            variant="outlined"
            size="small"
            value={value || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            InputProps={{
              sx: {
                borderRadius: 2,
                fontSize: "14px",
                fontWeight: 500,
                height: 48,
              },
            }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    borderRadius: 2,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  },
                },
              },
            }}
          >
            {field.options?.split(",").map((opt) => (
              <MenuItem
                key={opt}
                value={opt.trim()}
                sx={{
                  py: 1,
                  fontSize: "0.9rem",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                {opt.trim()}
              </MenuItem>
            ))}
          </TextField>
        );
      case "number":
        return (
          <TextField
            type="number"
            fullWidth
            variant="outlined"
            size="small"
            placeholder="0"
            value={value || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            InputProps={{
              sx: {
                borderRadius: 2,
                fontSize: "14px",
                height: 48,
                fontWeight: 600,
              },
            }}
          />
        );
      default:
        return (
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Escriba aquí..."
            value={value || ""}
            multiline={field.type === "textarea"}
            rows={field.type === "textarea" ? 3 : 1}
            onChange={(e) => onChange(field.id, e.target.value)}
            InputProps={{
              sx: {
                borderRadius: 2,
                fontSize: "14px",
                fontWeight: 500,
                minHeight: 48,
              },
            }}
          />
        );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "flex-end",
          mb: 0.5,
          width: "100%",
          boxSizing: "border-box",
          minWidth: 0,
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            color: "#334155",
            lineHeight: 1.2,
            fontSize: "13px",
            textTransform: "uppercase",
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            maxWidth: "100%",
            display: "block",
          }}
        >
          {field.label}
        </Typography>
      </Box>
      <Box sx={{ width: "100%", boxSizing: "border-box", minWidth: 0 }}>
        {renderInput()}
      </Box>
    </Box>
  );
};

const VerificationTable = ({
  fields,
  inspectorData,
  onChange,
  infraEfector,
  rrhhEfector,
  equiposEfector,
  currentSrvName,
}) => {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: "1px solid #e2e8f0", borderRadius: 3, overflowX: "auto" }}
    >
      <Table size="small" sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: "#f1f5f9" }}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: 900, color: "#334155", width: "35%", py: 2 }}
            >
              Elemento a Inspeccionar
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: 900, color: "#334155", py: 2 }}
            >
              Valor Declarado
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: 900, color: "#334155", py: 2, width: 90 }}
            >
              Observado
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: 900, color: "#334155", py: 2, width: 140 }}
            >
              Valor Observado
            </TableCell>
            <TableCell
              sx={{ fontWeight: 900, color: "#334155", width: "30%", py: 2 }}
            >
              Observación
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields?.map((field) => {
            const currentVal = inspectorData[field.id] || {};
            const isObservado = currentVal.observado || false;
            const valorObj = currentVal.valor || "";
            const obsText = currentVal.obs || "";

            let valorDeclarado =
              field.cantidadMinima ?? field.valorDeclarado ?? 1;

            // 1. INFRAESTRUCTURA (Camas/Salas)
            const name = field.label || field.name;
            if (infraEfector && infraEfector[name] !== undefined) {
              valorDeclarado = infraEfector[name];
            }

            // 2. RECURSOS HUMANOS
            if (rrhhEfector && rrhhEfector.length > 0) {
              const rrhhMatch = rrhhEfector.find(
                (r) =>
                  (r.especialidad === field.especialidad ||
                    r.tipoPlantel === field.tipoPlantel) &&
                  r.origen === currentSrvName,
              );
              if (rrhhMatch) valorDeclarado = rrhhMatch.cantidadCargada;
            }

            // 3. EQUIPAMIENTO
            if (equiposEfector && equiposEfector.length > 0) {
              const equipoMatch = equiposEfector.filter(
                (e) =>
                  e.equipamiento === field.equipamiento &&
                  e.origen === currentSrvName,
              );
              if (equipoMatch.length > 0) valorDeclarado = equipoMatch.length;
            }

            const isNumeric = !isNaN(valorDeclarado);
            const hasError =
              isObservado &&
              valorObj !== "" &&
              isNumeric &&
              Number(valorObj) !== Number(valorDeclarado);

            const update = (key, val) =>
              onChange(field.id, { ...currentVal, [key]: val });

            return (
              <TableRow
                key={field.id}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  bgcolor: hasError ? "#fef2f2" : "inherit",
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    fontWeight: 700,
                    color: "#1e293b",
                    fontSize: "0.85rem",
                    py: 1.5,
                  }}
                >
                  {field.label ||
                    field.name ||
                    field.equipamiento ||
                    field.especialidad ||
                    "Elemento Sin Nombre"}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 800 }}>
                  <Box
                    sx={{
                      bgcolor: "#e2e8f0",
                      color: "#0f172a",
                      display: "inline-block",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1.5,
                    }}
                  >
                    {valorDeclarado}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={isObservado}
                    onChange={(e) => update("observado", e.target.checked)}
                    color="success"
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                  />
                </TableCell>
                <TableCell align="center">
                  {isObservado && (
                    <TextField
                      size="small"
                      type="number"
                      placeholder="Cant."
                      value={valorObj}
                      onChange={(e) => update("valor", e.target.value)}
                      error={hasError}
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-root": {
                          bgcolor: "white",
                          fontWeight: 800,
                          height: 38,
                        },
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {isObservado && (
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Razones, marcas, estado..."
                      value={obsText}
                      onChange={(e) => update("obs", e.target.value)}
                      sx={{
                        "& .MuiInputBase-root": {
                          bgcolor: "white",
                          minHeight: 38,
                          fontSize: "0.85rem",
                        },
                      }}
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PantallaInspeccion;
