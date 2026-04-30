# HU.01: Sincronización y Carga de Configuración

**Como** Inspector,
**Quiero** que al iniciar una inspección se carguen los requisitos y servicios configurados en el sistema central,
**Para** asegurar que la auditoría se realice sobre el último padrón de datos declarado por la clínica.

### Criterios de Aceptación:

1. **Carga Inicial**: Al abrir el trámite en la Tablet, el sistema debe consultar la API de configuración y descargar el mapeo de servicios y requisitos.
2. **Estructura de Navegación**: El menú lateral (sidebar) debe reflejar las áreas y servicios técnicos definidos (ej: Guardia, Quirófano, Hemodinamia).
3. **Mapeo de Datos del Trámite**: Los campos marcados como "TRÁMITE" en el Backoffice deben mostrarse con el valor declarado inmutable (solo lectura para referencia).
4. **Persistencia Local**: En caso de pérdida de conexión, los datos cargados deben persistir en el almacenamiento local de la tablet hasta la sincronización final.
5. **Categorización Agregada**: Los requisitos globales (ej: Equipamiento Mínimo o Jefes de Servicio) deben aparecer en todas las secciones donde fueron asignados masivamente.
