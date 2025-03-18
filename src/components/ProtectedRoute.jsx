// components/ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, status } = useSelector((state) => state.auth);



  // Si l'utilisateur n'est pas connecté, redirige vers la page de connexion
  if (!user) {
    return <Navigate to="/connexion" />;
  }

  // Si l'utilisateur n'a pas le rôle requis, redirige vers la page d'accueil
  if (requiredRole && user.role.toLowerCase() !== requiredRole) {
    return <Navigate to="/" />;
  }

  // Si tout est bon, affiche le composant enfant
  return children;
};

export default ProtectedRoute;