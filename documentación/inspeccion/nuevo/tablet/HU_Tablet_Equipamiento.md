# HU.03: Verificación de Equipamiento Técnico

**Como** Inspector,
**Quiero** auditar la existencia y estado de los equipos médicos mínimos requeridos por servicio,
**Para** garantizar que la clínica posea el instrumental adecuado para la atención sanitaria.

### Criterios de Aceptación:

1. **Listado por Servicio**: El equipamiento debe presentarse agrupado por el servicio técnico seleccionado (ej: Shockroom, Quirófano).
2. **Estado de Funcionamiento**: Por cada equipo, se debe poder seleccionar un estado: Operativo, No Operativo, Faltante o No Aplica.
3. **Validación de Mínimos**: Si un equipo marcado como obligatorio en el Backoffice no está presente, el sistema debe autoseleccionar "No Cumple" para ese servicio.
4. **Carga de Evidencia**: El inspector debe poder adjuntar fotos de las placas identificatorias o del estado del equipo directamente desde la cámara de la tablet.
5. **Relación con el Trámite**: Se deben distinguir claramente los equipos declarados originalmente de los requisitos adicionales impuestos por la normativa de fiscalización.
