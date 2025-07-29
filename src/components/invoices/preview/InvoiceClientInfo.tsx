
import React from "react";
import { format } from "date-fns";
import { Client, Invoice } from "@/types";
import { 
  CheckCircle2, 
  Clock, 
  Send, 
  AlertCircle,
  FileWarning
} from "lucide-react";

interface InvoiceClientInfoProps {
  client: Client;
  date: Date | string | null;
  dueDate: Date | string | null;
  isPDF?: boolean;
  showStatus?: boolean;
  status?: Invoice['status'];
}

const InvoiceClientInfo = ({ 
  client, 
  date, 
  dueDate, 
  isPDF = false,
  showStatus = true,
  status = 'draft'
}: InvoiceClientInfoProps) => {
  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 mr-2 text-yellow-500" />;
      case 'sent':
        return <Send className="w-4 h-4 mr-2 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 mr-2 text-red-500" />;
      default:
        return <FileWarning className="w-4 h-4 mr-2 text-gray-500" />;
    }
  };
  
  const getStatusBadgeClass = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return "bg-green-100 text-green-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'sent':
        return "bg-blue-100 text-blue-800";
      case 'overdue':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Helper function to safely format dates or return a fallback
  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      // Check if date is valid before formatting
      if (isNaN(dateObj.getTime())) {
        return "Invalid date";
      }
      return format(dateObj, "dd-MMM-yy");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div>
        <h3 className={isPDF ? "text-sm font-medium mb-2 text-gray-600" : "text-sm font-medium mb-2 text-muted-foreground"}>
          Customer Name & Address:
        </h3>
        <div className={`border-l-2 ${isPDF ? "border-[#3b82f6]" : "border-primary"} pl-3`}>
          <h4 className="font-bold">{client.companyName}</h4>
          <p className="text-sm mt-1">{client.address}</p>
          <p className="text-sm mt-2">GSTIN: {client.gstNumber}</p>
          <p className="text-sm">{client.email}</p>
          <p className="text-sm">{client.phoneNumber}</p>
        </div>
      </div>
      <div className="flex flex-col justify-start gap-3 md:items-end">
        <div className="grid grid-cols-2 gap-x-2 md:text-right">
          <span className={isPDF ? "text-sm text-gray-600" : "text-sm text-muted-foreground"}>Invoice No:</span>
          <span className="font-medium">{typeof date === 'object' && date ? date.toLocaleDateString('en-IN') : 'N/A'}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-2 md:text-right">
          <span className={isPDF ? "text-sm text-gray-600" : "text-sm text-muted-foreground"}>Issue Date:</span>
          <span className="font-medium">{formatDate(date)}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-2 md:text-right">
          <span className={isPDF ? "text-sm text-gray-600" : "text-sm text-muted-foreground"}>Due Date:</span>
          <span className="font-medium">{formatDate(dueDate)}</span>
        </div>
        {showStatus && !isPDF && status && (
          <div className="grid grid-cols-2 gap-x-2 md:text-right mt-4">
            <span className="text-sm font-semibold text-muted-foreground">Status:</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(status)}`}>
              {getStatusIcon(status)}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceClientInfo;
