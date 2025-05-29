
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface InvoiceFormLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

const InvoiceFormLayout = ({ children, sidebar }: InvoiceFormLayoutProps) => {
  return (
    <div className="flex flex-col xl:flex-row gap-6 relative">
      {/* Main Form Content */}
      <div className="flex-1 space-y-6 min-w-0">
        {children}
      </div>
      
      {/* Responsive Sidebar */}
      <div className="xl:w-80 2xl:w-96">
        <div className="xl:sticky xl:top-6 space-y-4">
          {sidebar}
        </div>
      </div>
    </div>
  );
};

export default InvoiceFormLayout;
