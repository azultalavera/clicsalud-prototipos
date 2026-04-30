# Flujo del Proceso de Inspección y Fiscalización

Este diagrama describe los posibles estados y caminos que puede tomar un trámite durante el ciclo de inspección técnica, desde la auditoría inicial hasta la resolución final.

```mermaid
flowchart TD
    Start([Inicio: Trámite en Bandeja Inspector]) --> Sync[Sincronización Tablet: Carga Configuración]
    Sync --> Audit[Auditoría en Terreno: Relevamiento Áreas/Servicios]
    
    Audit --> Val{¿Hay Observaciones?}
    
    %% Camino: Sin Observaciones
    Val -- NO --> ResultApprove[Resultado: APROBAR]
    ResultApprove --> Close[Carga de Notas y Acta Escaneada]
    Close --> Accepted((ESTADO: ACEPTADO INSPECCIÓN))
    
    %% Camino: Con Observaciones
    Val -- SÍ --> Decision{Criterio Inspector}
    
    %% Camino: Observaciones Menores
    Decision -- Observaciones Menores --> ResultApproveObs[Resultado: APROBAR CON OBS.]
    ResultApproveObs --> Close
    
    %% Camino: Emplazamiento (Fallas Críticas)
    Decision -- Fallas Críticas --> ResultReject[Resultado: NO APROBAR / EMPLAZAR]
    ResultReject --> SendEfector[Envío a Bandeja del Efector]
    
    SendEfector --> Rectify[Efector: Carga de Documentación Rectificativa]
    Rectify --> ReturnInspector[Retorno a Bandeja Inspector]
    
    ReturnInspector --> Review[Revisión de Rectificación]
    Review --> FinalDecision{¿Subsanado?}
    
    FinalDecision -- SÍ --> ResultApprove
    
    %% Camino: Re-Inspección
    FinalDecision -- NO / Requiere Nueva Visita --> AddActa[Botón: AGREGAR ACTA N+1]
    AddActa --> Reset[Sistema crea nueva instancia de Inspección VACÍA]
    Reset --> Sync
    
    %% Estilos
    style Start fill:#f9f,stroke:#333,stroke-width:2px
    style Accepted fill:#32A430,stroke:#fff,color:#fff,stroke-width:2px
    style SendEfector fill:#0B85C4,stroke:#fff,color:#fff
    style ResultReject fill:#ef4444,stroke:#fff,color:#fff
    style AddActa fill:#FFDE59,stroke:#333
```

### Descripción de los Caminos:

1.  **Camino Feliz (Aprobación Directa)**: El inspector no encuentra inconsistencias. Cierra el acta y el trámite finaliza su ciclo de fiscalización exitosamente.
2.  **Aprobación con Observaciones**: Existen detalles menores que no impiden la habilitación. Se registran para seguimiento futuro pero se aprueba el trámite.
3.  **Emplazamiento y Rectificación**: Se encuentran fallas graves. El efector recibe el trámite, debe subir archivos y descargos que prueben la corrección de las faltas. Una vez enviado, el inspector vuelve a evaluar.
4.  **Ciclo de Re-Inspección**: Si la rectificación digital no es suficiente o se requiere una nueva visita física, el inspector genera una "Acta N+1", lo que reinicia el proceso de auditoría manteniendo el historial del acta anterior.
