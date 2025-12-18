import React from "react";

export default function Button({ children, onClick, variant = "primary", type = "button" }: { children: React.ReactNode; onClick?: ()=>void; variant?: "primary"|"ghost"; type?: "button"|"submit" }) {
  const base = "px-4 py-3 rounded-lg font-semibold transition-all focus:outline-none";
  const styles = variant === "primary" ? "bg-primary text-white hover:bg-primary-600" : "bg-transparent text-primary";
  return <button type={type} onClick={onClick} className={`${base} ${styles}`}>{children}</button>;
}
