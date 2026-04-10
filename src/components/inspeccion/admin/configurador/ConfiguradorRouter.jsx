import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../../../ui/Layout';
import SelectoresMain from './SelectoresMain';
import ConfiguradorClinicas from './clinicas/ConfiguradorClinicas';

const ConfiguradorRouter = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<SelectoresMain />} />
        <Route path="clinicas-sanatorios-y-hospitales/*" element={<ConfiguradorClinicas />} />
        {/* Aqui agregaremos otras tipologias cuando esten listas, ej: */}
        {/* <Route path="geriatricos/*" element={<ConfiguradorGeriatricos />} /> */}
      </Routes>
    </Layout>
  );
};

export default ConfiguradorRouter;
