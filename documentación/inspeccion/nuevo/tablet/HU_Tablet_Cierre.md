# HU.06: Cierre de Inspección y Generación de Acta

**Como** Inspector,
**Quiero** finalizar la carga de datos y emitir el resultado de la fiscalización,
**Para** notificar formalmente a la clínica sobre su estado de habilitación.

### Criterios de Aceptación:

1. **Validación de Integridad**: El sistema no debe permitir el cierre si hay secciones obligatorias sin completar.
2. **Determinación del Resultado**: Basado en los hallazgos, el inspector debe seleccionar entre: Aprobado, Aprobado con Observaciones, o No Aprobado (Emplazado).
3. **Digitalización del Acta Papel**: El inspector debe poder fotografiar el acta manuscrita firmada por el director médico y subirla como documento principal.
4. **Firma Digital**: Debe incluirse un campo para la firma táctil del inspector y del auditado sobre la pantalla de la tablet (opcional según normativa).
5. **Cambio de Estado**: Al confirmar el cierre, el trámite debe actualizar su estado en el sistema central y disparar las notificaciones correspondientes al Efector.
