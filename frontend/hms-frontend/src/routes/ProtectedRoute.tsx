import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: JSX.Element;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { token, role } = useAuth();

  // 🔒 Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ⏳ Token exists but role not parsed yet
  if (!role) {
    return <div className="p-6">Loading...</div>;
  }

  // 🚫 Unauthorized
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}