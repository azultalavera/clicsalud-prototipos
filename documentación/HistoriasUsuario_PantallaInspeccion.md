# Historias de Usuario - Pantalla de Inspección

Este documento detalla las funcionalidades de la `PantallaInspeccion.jsx`, organizadas por módulos funcionales para facilitar su desarrollo y validación.

---

## Módulo 1: Identificación y Datos Generales

### HU-01: Visualización de Datos del Establecimiento
**Como** Inspector de Salud  
**Quiero** visualizar de forma clara el nombre y la tipología del establecimiento  
**Para** asegurar que estoy auditando la institución correcta antes de iniciar la carga.

**Criterios de Aceptación:**
- Debe mostrar el nombre del establecimiento (ej: "SANATORIO ALLENDE") en el encabezado.
- Debe indicar la tipología oficial (ej: "Clínicas, Sanatorios y Hospitales").
- El diseño debe ser prominente y utilizar iconos descriptivos (`LocalHospitalIcon`).

### HU-02: Auditoría de Datos Generales
**Como** Inspector de Salud  
**Quiero** expandir/colapsar una sección de datos generales  
**Para** revisar y validar información base (Arquitectura base, Salas, Camas generales) sin perder el foco en secciones específicas.

**Criterios de Aceptación:**
- La sección debe ser un `Accordion` que por defecto esté expandido.
- Debe incluir sub-secciones para Arquitectura y Salas/Camas generales.
- Cada sub-sección debe mostrar su propio progreso de completitud.

---

## Módulo 2: Navegación y Clasificación de Auditoría

### HU-03: Navegación por Categorías Técnicas
**Como** Inspector de Salud  
**Quiero** alternar entre diferentes rubros (Arquitectura, RRHH, Equipamiento, Salas/Camas, Servicios)  
**Para** organizar mi recorrido físico por el establecimiento de manera lógica.

**Criterios de Aceptación:**
- Debe presentar una barra de navegación con iconos representativos.
- El estado activo debe ser visualmente distinto (cambio de color y sombra).
- Al cambiar de categoría, el contenido inferior debe filtrarse dinámicamente.

### HU-04: Gestión de Sub-Áreas Técnicas (Servicios)
**Como** Inspector de Salud  
**Quiero** seleccionar sub-servicios específicos (UTI, UCO, Quirófano, etc.) dentro de la pestaña Servicios  
**Para** aplicar checklists técnicos específicos de alta complejidad.

**Criterios de Aceptación:**
- Los botones de selección deben aparecer solo en la pestaña "SERVICIOS".
- Solo deben mostrarse los servicios que el establecimiento declaró previamente.
- Debe existir una opción de "Simulación" para entornos de demo/desarrollo.

---

## Módulo 3: Verificación y Cotejo de Datos

### HU-05: Tabla de Verificación "Declarado vs Observado"
**Como** Inspector de Salud  
**Quiero** comparar el valor declarado por el efector con lo que observo en el lugar  
**Para** registrar discrepancias y observaciones detalladas.

**Criterios de Aceptación:**
- La tabla debe mostrar: Elemento, Valor Declarado, Checkbox de "Observado", Input de "Valor Observado" y campo de "Observación".
- Si se marca como "Observado" y hay discrepancia numérica, la fila debe resaltarse en rojo para alertar sobre la inconsistencia.
- El sistema debe precargar los valores declarados desde el módulo del Efector (localStorage/API).

### HU-06: Entradas de Datos Adaptativas
**Como** Inspector de Salud  
**Quiero** utilizar diferentes tipos de controles (SÍ/NO, Fechas, Selección, Números, Texto)  
**Para** registrar la información de la manera más rápida y precisa posible según el tipo de campo.

**Criterios de Aceptación:**
- Los campos booleanos deben usar botones de estilo `Toggle` (Rojo/Verde).
- Los campos numéricos deben tener placeholders y formato de número.
- Los campos de texto largo deben soportar múltiples líneas.

---

## Módulo 4: Control de Avance y Cierre

### HU-07: Monitoreo de Progreso en Tiempo Real
**Como** Inspector de Salud  
**Quiero** ver barras de progreso por sección y globales  
**Para** saber exactamente qué campos me faltan completar antes de finalizar el acta.

**Criterios de Aceptación:**
- Cada acordeón y sección de servicio debe mostrar un `LinearProgress`.
- El porcentaje debe actualizarse automáticamente al cambiar cualquier valor.
- Los iconos de las pestañas principales deben reflejar visualmente si la sección está completa (opcional/futuro) o si está siendo editada.

### HU-08: Finalización y Generación de Acta
**Como** Inspector de Salud  
**Quiero** presionar un botón de "Finalizar Acta" al concluir la inspección  
**Para** consolidar toda la información cargada y cerrar el proceso de auditoría.

**Criterios de Aceptación:**
- El botón debe ser prominente y estar al final del formulario.
- Debe validar que los campos críticos hayan sido revisados.
- (Próxima Fase) Debe disparar la generación del documento PDF del acta de inspección.

---

## Módulo 5: Integración y Sincronización

### HU-09: Sincronización Automática con Datos de Efector
**Como** Sistema de Inspección  
**Quiero** escuchar cambios en el almacenamiento local (Storage)  
**Para** reflejar cambios realizados en otras pestañas o ventanas del navegador sin necesidad de recargar.

**Criterios de Aceptación:**
- Debe usar un event listener de `storage`.
- Debe recargar la configuración y los datos del efector al detectar cambios en las claves `efector_*`.
- Los valores declarados en las tablas de verificación deben actualizarse en tiempo real.
