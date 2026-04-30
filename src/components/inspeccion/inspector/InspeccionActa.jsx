import React, { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  TextField,
  Paper,
  Stack,
  Button
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DescriptionIcon from "@mui/icons-material/Description";

// Sub-componentes (podrían estar en archivos separados, pero por ahora los mantenemos aquí para el refactor solicitado)
import { 
  FieldItem, 
  VerificationTable, 
  PlansTable, 
  ObservationDialog, 
  FileViewerModal 
} from "./InspeccionSubComponents";

const InspeccionActa = ({
  inspectorData,
  handleFieldChange,
  handleOpenObsDialog,
  activeSubServicios,
  selectedSubService,
  setSelectedSubService,
  otherServices,
  datosGeneralesSrv,
  infraEfector,
  rrhhEfector,
  equiposEfector,
  selectedCategory,
  setSelectedCategory,
  PESTAÑAS,
  TARGET_MAPPINGS,
  normalizedMatch,
  obsDatosGenerales,
  obsDatosTramite,
  generalObs,
  setGeneralObs,
  photoInputRef,
  viewerFile,
  setViewerFile,
  obsDialog,
  setObsDialog,
  handleSaveObs,
  getFlatFields
}) => {
  const [expandedGenerales, setExpandedGenerales] = useState(true);
  const [expandedEstablecimiento, setExpandedEstablecimiento] = useState(true);

  return (
    <Box>
      {/* DATOS GENERALES */}
      <Accordion
        expanded={expandedGenerales}
        onChange={() => setExpandedGenerales(!expandedGenerales)}
        sx={{
          mb: 2,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          borderRadius: "12px !important",
          "&:before": { display: "none" },
          border: "1px solid #e2e8f0",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "#0ea5e9" }} />}
          sx={{ px: { xs: 2, sm: 3 }, py: 0.5 }}
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
              variant="h6"
              sx={{ fontWeight: 900, color: "#1e293b" }}
            >
              DATOS GENERALES
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 700 }}>
              Información básica y administrativa del establecimiento
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: { xs: 2, sm: 3 }, py: 3, bgcolor: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 3,
            }}
          >
            {datosGeneralesSrv?.sections
              ? datosGeneralesSrv.sections.map((sec) => {
                return (
                  <Accordion
                    key={sec.id}
                    defaultExpanded
                    sx={{
                      gridColumn: "1 / -1",
                      boxShadow: "none",
                      border: "1px solid #f1f5f9",
                      "&:before": { display: "none" },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ bgcolor: "#f8fafc", borderRadius: 2 }}
                    >
                      <Typography sx={{ fontWeight: 800, color: "#475569" }}>
                        {sec.name}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 3 }}>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                          },
                          gap: 3,
                        }}
                      >
                        {sec.fields.map((field) => (
                          <FieldItem
                            key={field.id}
                            field={field}
                            value={inspectorData[field.id]}
                            onChange={handleFieldChange}
                            onOpenObs={(fid, lbl, val) => handleOpenObsDialog(fid, lbl, val, "GENERAL")}
                          />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                );
              })
              : datosGeneralesSrv?.fields?.map((field) => (
                <FieldItem
                  key={field.id}
                  field={field}
                  value={inspectorData[field.id]}
                  onChange={handleFieldChange}
                  onOpenObs={(fid, lbl, val) => handleOpenObsDialog(fid, lbl, val, "GENERAL")}
                />
              ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* DATOS DEL TRÁMITE */}
      <Accordion
        expanded={expandedEstablecimiento}
        onChange={() => setExpandedEstablecimiento(!expandedEstablecimiento)}
        sx={{
          mb: 2,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          borderRadius: "12px !important",
          "&:before": { display: "none" },
          border: "1px solid #e2e8f0",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "#0ea5e9" }} />}
          sx={{ px: { xs: 2, sm: 3 }, py: 0.5 }}
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
              variant="h6"
              sx={{ fontWeight: 900, color: "#1e293b" }}
            >
              DATOS DEL TRÁMITE
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 700 }}>
              Estado de carga por áreas técnicas y servicios declarados
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: { xs: 2, sm: 3 }, py: 2, bgcolor: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
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
                top: 24,
                left: 40,
                right: 40,
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
                    flex: 1,
                    minWidth: 0,
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
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
            {/* Casos especiales globales según categoría */}
            {selectedCategory === "ARQUITECTURA" && (
              <Box sx={{ mb: 4 }}>
                <PlansTable
                  inspectorData={inspectorData}
                  onChange={handleFieldChange}
                  onOpenObs={handleOpenObsDialog}
                  infraEfector={infraEfector}
                  currentSrvName="GENERAL"
                />
              </Box>
            )}

            <FileViewerModal
              file={viewerFile}
              onClose={() => setViewerFile(null)}
            />

            {otherServices.map((srv) => {
              let matchedSections = [];

              if (selectedCategory === "SERVICIOS") {
                const isTargetService = TARGET_MAPPINGS[selectedSubService]?.some(
                  (k) => normalizedMatch(srv.name, k),
                );
                const nSrv = (srv.name || "").toUpperCase();
                const isExcluded =
                  selectedSubService === "UTI" &&
                  (nSrv.includes("PEDIAT") ||
                    nSrv.includes("NEONAT") ||
                    nSrv.includes("CORONARI") ||
                    nSrv.includes("INTERMEDIA"));

                if (
                  isTargetService &&
                  (!isExcluded || nSrv === "UNIDAD DE TERAPIA INTENSIVA") &&
                  srv.sections
                ) {
                  matchedSections = srv.sections.filter((sec) => {
                    const n = sec.name.toUpperCase();
                    const isRelevant =
                      !n.includes("ARQUITECTURA") &&
                      !n.includes("EQUIPAMIENTO") &&
                      !n.includes("RECURSOS") &&
                      !n.includes("RRHH") &&
                      !n.includes("JEFE");

                    if (!isRelevant) return false;
                    return sec.fields && sec.fields.length > 0;
                  });
                }
              } else {
                if (srv.sections) {
                  const keyword =
                    selectedCategory === "RECURSOS HUMANOS"
                      ? "RECURSOS"
                      : selectedCategory === "SALAS Y CAMAS"
                        ? "SALA"
                        : selectedCategory === "DOCUMENTACION"
                          ? "DOCUMENTO"
                          : selectedCategory;
                  matchedSections = srv.sections.filter((sec) => {
                    const isMatch =
                      sec.name.toUpperCase().includes(keyword) ||
                      (selectedCategory === "DOCUMENTACION" &&
                        sec.name.toUpperCase().includes("DOCUMENTA")) ||
                      (selectedCategory === "RECURSOS HUMANOS" &&
                        sec.name.toUpperCase().includes("JEFE")) ||
                      (selectedCategory === "SALAS Y CAMAS" &&
                        sec.name.toUpperCase().includes("CAMA"));

                    if (!isMatch) return false;

                    const validFields = (sec.fields || []).filter((f) => {
                      if (
                        sec.name.toUpperCase().includes("SALA") ||
                        sec.name.toUpperCase().includes("CAMA")
                      ) {
                        const label = f.label || f.name;
                        const uLabel = label.toUpperCase();
                        const isGenericLabel = uLabel.includes("CAMAS") || uLabel.includes("SALAS") || uLabel.includes("HABITACION") || (uLabel.includes("N") && uLabel.includes("DE"));
                        if (isGenericLabel && infraEfector && (infraEfector[srv.name] || infraEfector[srv.id])) return true;
                        return (infraEfector && (infraEfector[label] || 0) > 0);
                      }
                      return true;
                    });

                    return validFields.length > 0;
                  });
                }
              }

              if (!matchedSections || matchedSections.length === 0) return null;

              return (
                <Accordion
                  key={srv.id}
                  defaultExpanded
                  sx={{
                    mb: 1,
                    boxShadow: "none",
                    borderRadius: "12px !important",
                    border: "1px solid #e2e8f0",
                    "&:before": { display: "none" },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#475569" }} />}
                    sx={{
                      bgcolor: "#f8fafc",
                      px: 3,
                      "&.Mui-expanded": {
                        borderBottom: "1px solid #e2e8f0",
                      }
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <LocalHospitalIcon sx={{ color: "#64748b", fontSize: 20 }} />
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 900,
                          color: "#1e293b",
                          fontSize: "1rem",
                          textTransform: "uppercase"
                        }}
                      >
                        {srv.name}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 3 }}>
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
                              borderBottom: "1px solid #f1f5f9",
                              pb: 1
                            }}
                          >
                            {section.name}
                          </Typography>
                        )}

                        {(section.name.includes("EQUIPAMIENTO") ||
                          section.name.includes("RECURSOS") ||
                          section.name.includes("RRHH") ||
                          section.name.includes("SALA") ||
                          section.name.includes("CAMA")) ? (
                          <VerificationTable
                            fields={section.fields.filter((f) => {
                              if (section.name.toUpperCase().includes("SALA") || section.name.toUpperCase().includes("CAMA")) {
                                const label = f.label || f.name;
                                const uLabel = label.toUpperCase();
                                const isGenericLabel = uLabel.includes("CAMAS") || uLabel.includes("SALAS") || uLabel.includes("HABITACION") || (uLabel.includes("N") && uLabel.includes("DE"));
                                if (isGenericLabel && infraEfector && (infraEfector[srv.name] || infraEfector[srv.id])) return true;
                                return infraEfector && (infraEfector[label] > 0);
                              }
                              return true;
                            })}
                            inspectorData={inspectorData}
                            onChange={handleFieldChange}
                            onOpenObs={handleOpenObsDialog}
                            infraEfector={infraEfector}
                            rrhhEfector={rrhhEfector}
                            equiposEfector={equiposEfector}
                            currentSrvName={srv.name}
                          />
                        ) : (
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                              gap: 3
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
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        </AccordionDetails>
      </Accordion>

      <ObservationDialog
        open={obsDialog.open}
        label={obsDialog.label}
        value={obsDialog.value}
        onClose={() => setObsDialog({ ...obsDialog, open: false })}
        onSave={handleSaveObs}
      />

      {/* Resumen de Observaciones */}
      <Box sx={{ mt: 6, mb: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900, color: "#1e293b", mb: 2 }}>
            OBSERVACIONES DE DATOS GENERALES
          </Typography>
          <Paper variant="outlined" sx={{ p: 3, bgcolor: "white", borderRadius: 4, minHeight: 100, border: '2px solid #f1f5f9' }}>
            {obsDatosGenerales.length === 0 ? (
              <Typography sx={{ color: "#94a3b8", fontStyle: "italic", fontSize: "0.9rem" }}>No hay observaciones pendientes.</Typography>
            ) : (
              <Box component="ul" sx={{ m: 0, pl: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {obsDatosGenerales.map((obs, idx) => (
                  <Box component="li" key={idx} sx={{ color: obs.type === 'ERROR' ? '#ef4444' : '#475569', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', py: 0.8 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box component="span" sx={{ fontWeight: 800 }}>{obs.label}</Box>
                      <Box component="span" sx={{ fontWeight: 500 }}>: {obs.text}</Box>
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={() => photoInputRef.current.click()}
                      sx={{ ml: 1, color: '#94a3b8', '&:hover': { color: '#0ea5e9' } }}
                    >
                      <PhotoCamera sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900, color: "#1e293b", mb: 2 }}>
            OBSERVACIONES DE DATOS DEL TRÁMITE
          </Typography>
          <Paper variant="outlined" sx={{ p: 3, bgcolor: "white", borderRadius: 4, minHeight: 100, border: '2px solid #f1f5f9' }}>
             {obsDatosTramite.length === 0 ? (
               <Typography sx={{ color: "#94a3b8", fontStyle: "italic", fontSize: "0.9rem" }}>No hay observaciones pendientes.</Typography>
             ) : (
                 <Box component="ul" sx={{ m: 0, pl: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                     {obsDatosTramite.map((obs, idx) => (
                         <Box component="li" key={idx} sx={{ color: obs.type === 'ERROR' ? '#ef4444' : '#475569', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', py: 0.8 }}>
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                 <Chip 
                                     label={obs.service} 
                                     size="small" 
                                     sx={{ 
                                         fontWeight: 900, 
                                         fontSize: '0.65rem', 
                                         bgcolor: '#e0f2fe', 
                                         color: '#0369a1',
                                         height: 20,
                                         borderRadius: 1
                                     }} 
                                 />
                                 <Box component="span" sx={{ fontWeight: 800 }}>{obs.label}</Box> 
                                 <Box component="span" sx={{ fontWeight: 500 }}>: {obs.text}</Box>
                             </Box>
                             <IconButton 
                                 size="small" 
                                 onClick={() => photoInputRef.current.click()}
                                 sx={{ ml: 1, color: '#94a3b8', '&:hover': { color: '#0ea5e9' } }}
                             >
                                 <PhotoCamera sx={{ fontSize: 18 }} />
                             </IconButton>
                         </Box>
                     ))}
                 </Box>
             )}
          </Paper>
        </Box>

        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 900, color: "#1e293b", mb: 2 }}
          >
            OBSERVACIONES GENERALES
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Escriba aquí cualquier observación general sobre la inspección..."
            value={generalObs}
            onChange={(e) => setGeneralObs(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 6,
                bgcolor: "#f8fafc",
                border: "2px solid #e2e8f0",
                "&:hover": { borderColor: "#cbd5e1" },
                "&.Mui-focused": { borderColor: "#0ea5e9" },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InspeccionActa;
