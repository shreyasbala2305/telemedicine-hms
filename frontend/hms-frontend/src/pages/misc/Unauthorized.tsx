import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600">403</h1>
        <p className="text-lg mt-2">You don’t have permission to access this page.</p>
        <Link to="/login" className="text-primary mt-4 inline-block">Go to Login</Link>
      </div>
    </div>
  );
}
