// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import Home from '../pages/Home';
import CampaignDetail from '../pages/CampaignDetail';
import CreateCampaign from '../pages/CreateCampaign';
import PrivateProfile from '../pages/PrivateProfile';
import EditCampaign from '../pages/EditCampaign';


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/campaigns/:id" element={<CampaignDetail />} />

      {/* Private routes */}
      <Route path="/profile" element={
          <PrivateRoute pageTitle='Profile'>
            <PrivateProfile />
          </PrivateRoute>
        }
      />
      <Route path="/campaigns/create" element={
        <PrivateRoute pageTitle='Create campaign'>
          <CreateCampaign />
        </PrivateRoute>
      } />
      <Route path="/campaigns/:id/edit" element={
          <PrivateRoute pageTitle='Edit campaign'>
            <EditCampaign />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
