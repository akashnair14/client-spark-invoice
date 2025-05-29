
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, File } from "lucide-react";
import { Invoice } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface InvoiceExportProps {
  invoices: Invoice[];
  selectedInvoices?: string[];
}

const InvoiceExport = ({ invoices, selectedInvoices }: InvoiceExportProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const dataToExport = selectedInvoices && selectedInvoices.length > 0
    ? invoices.filter(inv => selectedInvoices.includes(inv.id))
    : invoices;

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    setIsExporting(true);
    
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Export Complete",
      description: `${dataToExport.length} invoice(s) exported to ${format.toUpperCase()}.`,
    });
    
    setIsExporting(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          Export {dataToExport.length} Invoice{dataToExport.length !== 1 ? 's' : ''}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileText className="h-4 w-4 mr-2" />
          CSV Format
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Excel Format
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <File className="h-4 w-4 mr-2" />
          PDF Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InvoiceExport;
