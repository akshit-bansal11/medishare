import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ authStatus, children }) => {
  const location = useLocation();

  if (!authStatus.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default RequireAuth;
