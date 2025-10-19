// src/routes/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PrivateLayout from '../components/Common/layouts/PrivateLayout';


type PrivateRouteProps = {
  children: React.ReactNode;
  pageTitle: string;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, pageTitle }) => {
  const { isAuthenticated, sessionStatus } = useAuth(); 

  if (sessionStatus === 'unknown') {
    return <div className="p-8 text-center text-sm">Checking session…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  alert('si');

  return <PrivateLayout pageTitle={pageTitle}>{children}</PrivateLayout>;
};

export default PrivateRoute;
