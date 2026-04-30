# HU.02: Auditoría de Infraestructura (Salas y Camas)

**Como** Inspector,
**Quiero** relevar la cantidad física de salas y camas en cada área de la clínica,
**Para** verificar el cumplimiento de la capacidad instalada declarada.

### Criterios de Aceptación:

1. **Visualización Comparativa**: Por cada tipo de sala/cama, se debe mostrar el valor "Declarado" (Trámite) y un campo de entrada para el valor "Observado" (Realidad).
2. **Entrada Numérica**: El campo de observación debe permitir únicamente valores numéricos positivos.
3. **Indicador de Desvío**: Si el valor "Observado" es menor al "Declarado", el sistema debe resaltar el campo en color ámbar o rojo como advertencia.
4. **Marcación de Incumplimiento**: Se debe permitir marcar el ítem como "No Cumple" mediante un selector de estado (Cumple / No Cumple).
5. **Comentarios Obligatorios**: Si se marca como "No Cumple", el sistema debe exigir la carga de un comentario que explique la discrepancia.
