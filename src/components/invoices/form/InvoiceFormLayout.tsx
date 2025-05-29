
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface InvoiceFormLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

const InvoiceFormLayout = ({ children, sidebar }: InvoiceFormLayoutProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 relative">
      {/* Main Form Content */}
      <div className="flex-1 space-y-6">
        {children}
      </div>
      
      {/* Sticky Sidebar */}
      <div className="lg:w-80 xl:w-96">
        <div className="lg:sticky lg:top-6 space-y-4">
          {sidebar}
        </div>
      </div>
    </div>
  );
};

export default InvoiceFormLayout;
