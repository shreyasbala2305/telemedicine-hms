import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: JSX.Element;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role || "")) return <Navigate to="/unauthorized" replace />;

  return children;
}
