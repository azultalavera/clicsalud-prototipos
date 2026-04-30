### Escenarios de inspecciones

## 1. Camino feliz, inspección sin observaciones.

Descripción: Una inspección donde no se encuentra ninguna irregularidad y se aprueba directamente.

1. El Inspector ingresa a pestaña Observar Trámite.
2. El Inspector no carga ninguna observación.
3. El Inspector presiona botón "Guardar".
   1. Resultado: Se habilita la pestaña Acta de Inspección.
4.  El Inspector cambia a pestaña Acta de Inspección. 
5.  El Inspector sube el archivo PDF del acta escaneada.
6.  El Inspector no carga observaciones del acta.
7.  El Inspector presiona botón "Aprobar".
8.  El Inspector escribe "Todo en orden" en el campo Notas de Cierre (Obligatorio).
9.  El Inspector confirma la acción.
    1.  Resultado Final: El trámite pasa al estado **`ACEPTADO INSPECCIÓN`**.


---


## 2: Aprobación "Con Observaciones" (Criterio del Inspector)

**Descripción:** Existen detalles menores, pero el Inspector decide aprobar igual. 

1. **El Inspector** ingresa a pestaña *Observar Trámite*.  
2. **El Inspector** carga 2 observaciones sobre los apartados.  
3. **El Inspector** presiona "Guardar".  
4. **El Inspector** pasa a *Acta de Inspección* y sube el PDF.  
5. **El Inspector** carga 1 observación sobre el acta.  
6. **El Inspector** visualiza el resumen (ve 3 observaciones en total).  
7. **El Inspector** decide presionar "Aprobar".  
   * *Validación:* El sistema permite continuar aunque haya observaciones.  
8. **El Inspector** ingresa *Notas de Cierre* y confirma.  
   * **Resultado Final:** El trámite pasa al estado **`ACEPTADO INSPECCIÓN`**.

---

## **Escenario 3: No Aprobación (Rechazo Simple)**

**Descripción:** El flujo estándar cuando se encuentran fallas graves y se envía al efector para corregir.

1. **El Inspector** carga observaciones en *Observar Trámite*.  
2. **El Inspector** presiona "Guardar" y pasa a *Acta de Inspección*.  
3. **El Inspector** sube el PDF del acta y carga observaciones del acta.  
4. **El Inspector** presiona botón "No Aprobar".  
5. **El Inspector** deja vacío el campo *Notas de Cierre*.  
   * *Validación:* El sistema permite avanzar porque es opcional en rechazo.  
6. **El Inspector** confirma.  
   * **Resultado Final:** El trámite sale de la bandeja del Inspector y se envía a la bandeja del **Efector**. 
---

## **Escenario 4: Respuesta del Efector**

**Descripción:** El Efector recibe el trámite no aprobado y responde correctamente a lo solicitado.

1. **Efector** ingresa al trámite no aprobado.  
2. **Efector** visualiza 2 observaciones de Trámite y 1 de Acta.  
3. **Efector** carga 1 PDF específico para la Observación de Trámite \#1.  
4. **Efector** carga 1 PDF específico para la Observación de Trámite \#2.  
5. **Efector** carga 1 PDF general para la Observación del Acta.  
6. **Efector** presiona "Enviar".  
   * **Resultado Final:** El trámite regresa a la bandeja del **Inspector**.

---

## **Escenario 5: Ciclo de Re-Inspección (Generación de Acta 2\)**

**Descripción:** El Inspector recibe la respuesta, valida y necesita ir a inspeccionar de nuevo (Segunda vuelta).

1. **El Inspector** abre el trámite devuelto por el Efector.  
2. **El Inspector** revisa los PDFs enviados y valida las respuestas del Acta 1\.  
3. **El Inspector** presiona "Guardar" y luego presiona "Agregar Acta".  
   * *Resultado:* Se crea la pestaña "Acta 2" y se establece como activa.  
4. **El Inspector** ingresa a *Observar Trámite* (correspondiente al Acta 2).  
   * *Validación:* La lista de observaciones está **VACÍA** (no se traen las del Acta 1).  
5. **El Inspector** comienza el proceso de carga nuevamente (como si fuera el Escenario 1 o 3).  
   * **Resultado Final:** Se inicia un nuevo ciclo de inspección sobre el mismo trámite.


---

## Diagrama de flujo

``` MERMAID
flowchart 
    A[Inicio: Obs. Trámite] --> B(Carga Obs y Guarda)
    B("Carga Observaciones y Guarda") --> C[Pestaña Acta Inspección]
    C --> D[Sube PDF Acta]
    D --> E{¿Aprueba?}
    
    E -- SI --> F[Notas Cierre OBLIGATORIO]
    F --> G(("FIN: ACEPTADO INSPECCIÓN"))
    
    E -- NO --> H[Notas Cierre OPCIONAL]
    H --> I[Enviar a Efector]
    I --> J[Efector Sube Respuestas]
    J["Efector Sube Respuestas Emplazamiento"] --> K[Inspector Revisa]
    K --> L[Botón Agregar Acta]
    L --> M[Sistema crea Acta N+1 VACIA]
    M --> A["OBSERVAR TRÁMITE"]
	style J fill:#5CE1E6
	style B color:#545454,fill:#FFDE59
	style K color:#545454,fill:#FFDE59
	style L fill:#FFDE59
	style D fill:#FFDE59
``` 

