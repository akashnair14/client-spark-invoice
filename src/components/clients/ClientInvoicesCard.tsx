
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ClientInvoiceFilters from "@/components/invoices/ClientInvoiceFilters";
import { downloadInvoicesAsExcel, downloadInvoicesAsPDF } from "@/utils/invoiceExportUtils";
import { FileText as FileTextIcon } from "lucide-react";

interface ClientInvoicesCardProps {
  client: {
    companyName: string;
    gstNumber: string;
    address: string;
    city?: string;
    state?: string;
    postalCode?: string;
    email: string;
    phoneNumber: string;
  };
  invoices: any[];
  filteredInvoices: any[];
  paginatedInvoices: any[];
  selectedMonth: string;
  setSelectedMonth: (m: string) => void;
  selectedYear: string;
  setSelectedYear: (y: string) => void;
  resetFilters: () => void;
  onCreateInvoice: () => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (n: number) => void;
  PAGE_SIZE: number;
}

const ClientInvoicesCard = ({
  client,
  invoices,
  filteredInvoices,
  paginatedInvoices,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  resetFilters,
  onCreateInvoice,
  currentPage,
  totalPages,
  setCurrentPage,
  PAGE_SIZE,
}: ClientInvoicesCardProps) => (
  <Card className="md:col-span-2">
    <CardHeader>
      <CardTitle>Invoices</CardTitle>
      <CardDescription>Client invoice history</CardDescription>
      <div className="flex flex-wrap gap-2 mt-3">
        <Button
          variant="outline"
          onClick={() =>
            downloadInvoicesAsExcel(
              filteredInvoices,
              {
                companyName: client.companyName,
                gstNumber: client.gstNumber,
                address: client.address,
                city: client.city,
                state: client.state,
                postalCode: client.postalCode,
                email: client.email,
                phoneNumber: client.phoneNumber,
              }
            )
          }
          size="sm"
          className="gap-1 bg-blue-50 border border-blue-400 dark:bg-blue-900 dark:border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-900 dark:text-blue-200"
          title="Export to Excel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M4 20h16M9 16l3 3 3-3M12 4v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Excel
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            downloadInvoicesAsPDF(
              filteredInvoices,
              {
                companyName: client.companyName,
                gstNumber: client.gstNumber,
                address: client.address,
                city: client.city,
                state: client.state,
                postalCode: client.postalCode,
                email: client.email,
                phoneNumber: client.phoneNumber,
              }
            )
          }
          size="sm"
          className="gap-1 bg-orange-50 border border-orange-400 dark:bg-orange-900 dark:border-orange-500 hover:bg-orange-100 dark:hover:bg-orange-800 text-orange-900 dark:text-orange-200"
          title="Export to PDF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M4 20h16M9 16l3 3 3-3M12 4v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          PDF
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <ClientInvoiceFilters
        invoices={invoices}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        resetFilters={resetFilters}
      />
      {filteredInvoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <FileTextIcon className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No invoices found for selected filter</p>
          <Button onClick={onCreateInvoice} variant="outline" className="mt-4">
            Create Invoice
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedInvoices.map(invoice => (
            <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <p className="font-medium">{invoice.invoiceNumber}</p>
                <p className="text-sm text-muted-foreground">{invoice.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹{invoice.total.toLocaleString()}</p>
                <p className={`text-sm ${
                  invoice.status === 'paid'
                    ? 'text-green-600'
                    : invoice.status === 'overdue'
                      ? 'text-red-600'
                      : 'text-amber-600'
                }`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </p>
              </div>
            </div>
          ))}
          {filteredInvoices.length > PAGE_SIZE && (
            <div className="flex items-center justify-between mt-2">
              <button
                className="px-3 py-1 rounded bg-muted text-foreground border hover:bg-accent disabled:opacity-50"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded bg-muted text-foreground border hover:bg-accent disabled:opacity-50"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </CardContent>
  </Card>
);

export default ClientInvoicesCard;
