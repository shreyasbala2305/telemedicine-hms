import React from "react";

export default function AuthLayout({ image, children, title = "CityCare Hospital", subtitle = "Trusted healthcare & modern tools" }: { image: string; children: React.ReactNode; title?: string; subtitle?: string; }) {
  return (
    <div className="flex h-screen">
      <div className="hidden md:flex md:w-1/2 relative bg-primary text-white items-center justify-center overflow-hidden">
        <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="illustration" />
        <div className="relative z-10 text-center p-8">
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="mt-3 text-blue-100 max-w-md">{subtitle}</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8">{children}</div>
      </div>
    </div>
  );
}
