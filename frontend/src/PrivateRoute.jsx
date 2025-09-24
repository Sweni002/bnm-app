import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access_token"); // récupère le token

  if (!token) {
    return <Navigate to="/login" replace />; // redirige si pas de token
  }

  return children;
};

export default PrivateRoute;
