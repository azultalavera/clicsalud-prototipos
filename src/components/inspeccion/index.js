// Exportación centralizada del módulo de Inspección
// Organizado por Roles: ADMINISTRADOR, EFECTOR, INSPECTOR

import ConfiguracionInspeccion from './admin/ConfiguracionInspeccion';
import CargaDatosEfector from './efector/CargaDatosEfector';
import PantallaInspeccion from './inspector/PantallaInspeccion';

export {
  ConfiguracionInspeccion,
  CargaDatosEfector,
  PantallaInspeccion
};

// Export predeterminado para facilitar el uso
export default {
  Admin: ConfiguracionInspeccion,
  Efector: CargaDatosEfector,
  Inspector: PantallaInspeccion
};
