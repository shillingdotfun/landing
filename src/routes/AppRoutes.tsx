// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import CampaignDetail from '../pages/CampaignDetail';
import CreateCampaign from '../pages/CreateCampaign';

//import PrivateRoute from './PrivateRoute';
//import PublicLayout from '../components/common/layouts/public/PublicLayout';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home/>} />
      <Route path="/create" element={<CreateCampaign />} />
      <Route path="/campaigns/:id" element={<CampaignDetail />} />
    </Routes>
  );
};

export default AppRoutes;
