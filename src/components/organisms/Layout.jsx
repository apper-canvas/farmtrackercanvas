import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Desktop layout */}
      <div className="lg:pl-64">
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile layout spacing */}
      <div className="lg:hidden pb-16">
        {/* This ensures content doesn't get hidden behind mobile navigation */}
      </div>
    </div>
  );
};

export default Layout;