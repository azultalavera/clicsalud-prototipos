import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Tooltip,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Search as SearchIcon,
  Description as DescriptionIcon,
  Visibility as VisibilityIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudDownload as CloudDownloadIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ESTABLECIMIENTOS = [
  {
    id: 1,
    nSolicitud: "4408",
    expediente: "0425-382230/2026",
    nombre: "Hospital Rawson",
    cuit: "30666666661",
    fechaCreacion: "04/05/2026",
    departamento: "Capital",
    localidad: "Córdoba",
    tipologia: "CLÍNICAS, SANATORIOS y HOSPITALES",
    tipoTramite: "Modificación",
    etapa: "Documentos adjuntos",
    estado: "EN PROCESO DE MODIFICACIÓN",
    fechaFin: "-",
    color: "#8C8888",
  },
  {
    id: 2,
    nSolicitud: "4409",
    expediente: "0425-382231/2026",
    nombre: "Clínica Universitaria Reina Fabiola",
    cuit: "30555555551",
    fechaCreacion: "05/05/2026",
    departamento: "Capital",
    localidad: "Córdoba",
    tipologia: "CLÍNICAS, SANATORIOS y HOSPITALES",
    tipoTramite: "Habilitación",
    etapa: "Finalizado",
    estado: "HABILITADO",
    fechaFin: "29/4/2043",
    color: "#32A430",
  },
  {
    id: 3,
    nSolicitud: "4410",
    expediente: "0425-382232/2026",
    nombre: "Sanatorio Allende (Cerro)",
    cuit: "30444444441",
    fechaCreacion: "06/05/2026",
    departamento: "Capital",
    localidad: "Córdoba",
    tipologia: "CLÍNICAS, SANATORIOS y HOSPITALES",
    tipoTramite: "Renovación",
    etapa: "Auditoría en curso",
    estado: "PRÓXIMO A VENCER",
    fechaFin: "15/6/2026",
    color: "#F7BE2B",
  },
  {
    id: 4,
    nSolicitud: "4411",
    expediente: "0425-382233/2026",
    nombre: "Hospital Privado Universitario de Córdoba",
    cuit: "30333333331",
    fechaCreacion: "07/05/2026",
    departamento: "Capital",
    localidad: "Córdoba",
    tipologia: "CLÍNICAS, SANATORIOS y HOSPITALES",
    tipoTramite: "Renovación",
    etapa: "Abono de tasas",
    estado: "VENCIDO",
    fechaFin: "01/01/2026",
    color: "#E2464C",
  },
  {
    id: 5,
    nSolicitud: "4412",
    expediente: "0425-382234/2026",
    nombre: "Hospital de Niños de la Santísima Trinidad",
    cuit: "30222222221",
    fechaCreacion: "08/05/2026",
    departamento: "Capital",
    localidad: "Córdoba",
    tipologia: "CLÍNICAS, SANATORIOS y HOSPITALES",
    tipoTramite: "Habilitación",
    etapa: "Cancelado",
    estado: "NO VIGENTE",
    fechaFin: "-",
    color: "#004582",
  },
];

// Acciones contextuales según estado
const ACCIONES_POR_ESTADO = {
  "EN PROCESO DE MODIFICACIÓN": [
    { label: "Continuar",         icon: <EditIcon fontSize="small" />,          color: "rgb(9, 155, 227)",    primary: true },
    { label: "Visualizar",        icon: <VisibilityIcon fontSize="small" />,    color: "rgb(254, 222, 39)" },
    { label: "Historial",         icon: <HistoryIcon fontSize="small" />,       color: "rgb(46, 125, 50)" },
  ],
  "HABILITADO": [
    { label: "Visualizar",        icon: <VisibilityIcon fontSize="small" />,    color: "rgb(254, 222, 39)",   primary: true },
    { label: "Descargar",         icon: <CloudDownloadIcon fontSize="small" />, color: "rgb(9, 155, 227)" },
    { label: "Ver Resolución",    icon: <DescriptionIcon fontSize="small" />,  color: "rgb(46, 125, 50)" },
    { label: "Certificado",       icon: <AssignmentIcon fontSize="small" />,   color: "rgb(175, 65, 120)" },
    { label: "Historial",         icon: <HistoryIcon fontSize="small" />,       color: "rgb(46, 125, 50)" },
  ],
  "PRÓXIMO A VENCER": [
    { label: "Iniciar Renovación",icon: <EditIcon fontSize="small" />,          color: "rgb(9, 155, 227)",    primary: true },
    { label: "Visualizar",        icon: <VisibilityIcon fontSize="small" />,    color: "rgb(254, 222, 39)" },
    { label: "Descargar",         icon: <CloudDownloadIcon fontSize="small" />, color: "rgb(9, 155, 227)" },
    { label: "Historial",         icon: <HistoryIcon fontSize="small" />,       color: "rgb(46, 125, 50)" },
  ],
  "VENCIDO": [
    { label: "Continuar",         icon: <EditIcon fontSize="small" />,          color: "rgb(9, 155, 227)",    primary: true },
    { label: "Visualizar",        icon: <VisibilityIcon fontSize="small" />,    color: "rgb(254, 222, 39)" },
    { label: "Historial",         icon: <HistoryIcon fontSize="small" />,       color: "rgb(46, 125, 50)" },
  ],
  "NO VIGENTE": [
    { label: "Visualizar",        icon: <VisibilityIcon fontSize="small" />,    color: "rgb(254, 222, 39)",   primary: true },
    { label: "Ver Resolución",    icon: <DescriptionIcon fontSize="small" />,  color: "rgb(46, 125, 50)" },
    { label: "Historial",         icon: <HistoryIcon fontSize="small" />,       color: "rgb(46, 125, 50)" },
  ],
};

// Componente de acciones contextuales con menú desplegable
const AccionesCell = ({ row, onAction }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const acciones = ACCIONES_POR_ESTADO[row.estado] || [];
  const primaryAction = acciones.find((a) => a.primary);
  const secondaryActions = acciones.filter((a) => !a.primary);

  return (
    <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
      {/* Acción primaria como botón */}
      {primaryAction && (
        <Tooltip title={primaryAction.label} arrow>
          <IconButton
            size="small"
            onClick={() => onAction(row, primaryAction.label)}
            sx={{ color: primaryAction.color }}
          >
            {primaryAction.icon}
          </IconButton>
        </Tooltip>
      )}

      {/* Acciones secundarias en menú */}
      {secondaryActions.length > 0 && (
        <>
          <Tooltip title="Más acciones" arrow>
            <IconButton size="small" sx={{ color: "#888" }} onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ elevation: 3, sx: { borderRadius: "8px", minWidth: 180, mt: 0.5 } }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {secondaryActions.map((accion) => (
              <MenuItem
                key={accion.label}
                onClick={() => { setAnchorEl(null); onAction(row, accion.label); }}
                sx={{ py: 1, fontSize: "0.875rem", "&:hover": { bgcolor: "#f8fafc" } }}
              >
                <ListItemIcon sx={{ color: accion.color, minWidth: 32 }}>
                  {accion.icon}
                </ListItemIcon>
                <ListItemText primary={accion.label} />
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Stack>
  );
};

const MisEstablecimientos = () => {
  const navigate = useNavigate();
  const [generalSearch, setGeneralSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    departamento: "",
    estado: "",
    fechaDesde: "",
    tipologia: "",
  });

  const handleAction = (est) => {
    if (est.accion === "CONTINUAR" || est.accion === "MODIFICAR" || est.accion === "INICIAR RENOVACIÓN") {
      navigate("/home-efector/servicios");
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      departamento: "",
      estado: "",
      fechaDesde: "",
      tipologia: "",
    });
    setGeneralSearch("");
  };

  const filteredData = ESTABLECIMIENTOS.filter((est) => {
    if (generalSearch) {
      const matchSearch = Object.values(est).some(
        (val) => val && val.toString().toLowerCase().includes(generalSearch.toLowerCase())
      );
      if (!matchSearch) return false;
    }
    if (filters.tipologia && est.tipologia !== filters.tipologia) return false;
    if (filters.departamento && est.departamento !== filters.departamento) return false;
    if (filters.estado && est.estado !== filters.estado) return false;
    if (filters.fechaDesde) {
      const estDateStr = est.fechaCreacion.split('/').reverse().join('-');
      if (estDateStr < filters.fechaDesde) return false;
    }
    return true;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      {/* === SECCIÓN FILTROS === */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        {/* Header de filtros */}
        <Box
          sx={{
            px: 3,
            py: 2,
            bgcolor: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 4,
                height: 22,
                borderRadius: "4px",
                bgcolor: "#005596",
              }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
              Filtros de búsqueda
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              bgcolor: "#005596",
              "&:hover": { bgcolor: "#003b6b" },
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "8px",
              boxShadow: "none",
              px: 2.5,
            }}
          >
            Iniciar Nuevo Trámite
          </Button>
        </Box>

        {/* Campos de filtros */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5, alignItems: "flex-end" }}>
            <TextField
              select
              label="Tipología"
              name="tipologia"
              value={filters.tipologia}
              onChange={handleFilterChange}
              size="small"
              sx={{
                width: 280,
                "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: "#fff" },
              }}
            >
              <MenuItem value="">Todas las tipologías</MenuItem>
              <MenuItem value="CLÍNICAS, SANATORIOS y HOSPITALES">Clínicas, Sanatorios y Hospitales</MenuItem>
              <MenuItem value="ESTABLECIMIENTOS GERIÁTRICOS">Establecimientos Geriátricos</MenuItem>
              <MenuItem value="CENTRO DE SALUD AMBULATORIO">Centro de Salud Ambulatorio</MenuItem>
              <MenuItem value="CENTRO DE CIRUGÍA AMBULATORIA">Centro de Cirugía Ambulatoria</MenuItem>
            </TextField>

            <TextField
              select
              label="Departamento"
              name="departamento"
              value={filters.departamento}
              onChange={handleFilterChange}
              size="small"
              sx={{
                width: 220,
                "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: "#fff" },
              }}
            >
              <MenuItem value="">Todos los departamentos</MenuItem>
              <MenuItem value="Capital">Capital</MenuItem>
            </TextField>

            <TextField
              select
              label="Estado"
              name="estado"
              value={filters.estado}
              onChange={handleFilterChange}
              size="small"
              sx={{
                width: 260,
                "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: "#fff" },
              }}
            >
              <MenuItem value="">Todos los estados</MenuItem>
              <MenuItem value="EN PROCESO DE MODIFICACIÓN">En Proceso de Modificación</MenuItem>
              <MenuItem value="HABILITADO">Habilitado</MenuItem>
              <MenuItem value="PRÓXIMO A VENCER">Próximo a Vencer</MenuItem>
              <MenuItem value="VENCIDO">Vencido</MenuItem>
              <MenuItem value="NO VIGENTE">No Vigente</MenuItem>
            </TextField>

            <TextField
              label="Fecha desde"
              name="fechaDesde"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filters.fechaDesde}
              onChange={handleFilterChange}
              size="small"
              sx={{
                width: 190,
                "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: "#fff" },
              }}
            />
          </Box>

          {/* Botones de acción */}
          <Box display="flex" justifyContent="flex-end" gap={1.5} mt={3}>
            <Button
              variant="outlined"
              onClick={clearFilters}
              startIcon={<RefreshIcon />}
              sx={{
                borderColor: "#cbd5e1",
                color: "#64748b",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" },
              }}
            >
              Limpiar
            </Button>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              sx={{
                bgcolor: "#005596",
                "&:hover": { bgcolor: "#003b6b" },
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "8px",
                boxShadow: "none",
                px: 3,
              }}
            >
              Buscar
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Tabla Principal */}
      <Paper elevation={0} sx={{ borderRadius: "8px", border: "1px solid #e0e0e0", overflow: "hidden" }}>
        
        {/* Cabecera de la tabla con tabs falsos (Estilo de la imagen) */}
        <Box sx={{ bgcolor: "#005596", display: "flex", overflowX: 'auto' }}>
          {["TODOS", "HABILITADOS", "EN PROCESO", "VENCIDOS"].map((tab, idx) => (
            <Box 
              key={tab}
              sx={{ 
                py: 1.5, 
                px: 4, 
                color: "#fff", 
                fontWeight: "bold", 
                fontSize: "0.85rem",
                bgcolor: idx === 0 ? "rgba(255,255,255,0.15)" : "transparent",
                cursor: "pointer",
                '&:hover': { bgcolor: "rgba(255,255,255,0.1)" }
              }}
            >
              {tab}
            </Box>
          ))}
        </Box>

        {/* Búsqueda integrada en cabecera - eliminada */}

        <TableContainer>
          <Table sx={{ minWidth: 1000 }} size="medium">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell sx={{ fontWeight: "bold", color: "#444", fontSize: "0.75rem" }}>EXPEDIENTE</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#444", fontSize: "0.75rem" }}>ESTABLECIMIENTO</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#444", fontSize: "0.75rem" }}>ESTADO ACTUAL</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#444", fontSize: "0.75rem" }}>FECHA DE INGRESO</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#444", fontSize: "0.75rem" }}>TIPOLOGÍA</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#444", fontSize: "0.75rem" }}>UBICACIÓN</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", color: "#444", fontSize: "0.75rem" }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow 
                  key={row.id} 
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1a1a1a" }}>{row.expediente}</Typography>
                    <Typography variant="caption" sx={{ color: "#777" }}>Sol: {row.nSolicitud}</Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1a1a1a" }}>{row.nombre}</Typography>
                    <Typography variant="caption" sx={{ color: "#777" }}>CUIT: {row.cuit}</Typography>
                  </TableCell>

                  <TableCell>
                    <Chip 
                      label={row.estado} 
                      size="small"
                      sx={{ 
                        fontWeight: "bold", 
                        fontSize: "0.7rem",
                        bgcolor: `${row.color}15`, 
                        color: row.color,
                        borderRadius: '4px',
                        border: `1px solid ${row.color}30`
                      }} 
                    />
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: "#666" }}>
                      {row.etapa}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#333" }}>{row.fechaCreacion}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#333" }}>{row.tipologia}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#333" }}>{row.localidad}</Typography>
                    <Typography variant="caption" sx={{ color: "#777" }}>{row.departamento}</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <AccionesCell row={row} onAction={handleAction} />
                  </TableCell>
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No se encontraron resultados
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
        />
      </Paper>
    </Box>
  );
};

export default MisEstablecimientos;
