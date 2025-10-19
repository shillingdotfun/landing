// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

import PublicLayout from '../components/Common/layouts/PublicLayout';

import Home from '../pages/Home';
import CampaignDetail from '../pages/CampaignDetail';
import CreateCampaign from '../pages/CreateCampaign';


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        <PublicLayout>
          <Home />
        </PublicLayout>
      } />
      <Route path="/create" element={
        <PrivateRoute pageTitle='Create campaign'>
          <CreateCampaign />
        </PrivateRoute>
      } />
      <Route path="/campaigns/:id" element={
        <PublicLayout>
          <CampaignDetail />
        </PublicLayout>
      } />
    </Routes>
  );
};

export default AppRoutes;
