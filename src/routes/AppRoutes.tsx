// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import Home from '../pages/Home';
import CampaignDetail from '../pages/CampaignDetail';
import CreateCampaign from '../pages/CreateCampaign';


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/campaigns/:id" element={<CampaignDetail />} />

      {/* Private routes */}
      <Route path="/create" element={
        <PrivateRoute pageTitle='Create campaign'>
          <CreateCampaign />
        </PrivateRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
