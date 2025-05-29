
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar as CalendarIcon, X } from "lucide-react";
import { Invoice, Client } from "@/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface InvoiceFiltersProps {
  invoices: Invoice[];
  clients: Client[];
  onFilter: (statusFilter: string, dateFrom: string, dateTo: string, fyFilter: string, clientFilter: string) => void;
}

const InvoiceFilters = ({
  invoices,
  clients,
  onFilter,
}: InvoiceFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Invoice['status'] | 'all'>('all');
  const [clientFilter, setClientFilter] = useState("all");
  const [financialYearFilter, setFinancialYearFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const financialYears = Array.from(
    new Set(invoices.map(inv => {
      const year = new Date(inv.date).getFullYear();
      return year >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
    }))
  ).sort().reverse();

  const activeFiltersCount = [
    statusFilter !== 'all',
    clientFilter !== 'all',
    financialYearFilter !== 'all',
    dateRange.from || dateRange.to,
  ].filter(Boolean).length;

  const handleFilterChange = () => {
    const dateFrom = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : '';
    const dateTo = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : '';
    onFilter(statusFilter === 'all' ? '' : statusFilter, dateFrom, dateTo, financialYearFilter, clientFilter);
  };

  const clearAllFilters = () => {
    setStatusFilter('all');
    setClientFilter('all');
    setFinancialYearFilter('all');
    setDateRange({});
    setSearchQuery('');
    onFilter('', '', '', 'all', 'all');
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as Invoice['status'] | 'all');
    setTimeout(handleFilterChange, 0);
  };

  const handleClientChange = (value: string) => {
    setClientFilter(value);
    setTimeout(handleFilterChange, 0);
  };

  const handleFYChange = (value: string) => {
    setFinancialYearFilter(value);
    setTimeout(handleFilterChange, 0);
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date } | undefined) => {
    setDateRange(range || {});
    setTimeout(handleFilterChange, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "gap-2",
              activeFiltersCount > 0 && "border-primary"
            )}
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="gap-1"
            >
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Client</label>
            <Select value={clientFilter} onValueChange={handleClientChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Financial Year</label>
            <Select value={financialYearFilter} onValueChange={handleFYChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {financialYears.map((fy) => (
                  <SelectItem key={fy} value={fy}>
                    FY {fy}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd MMM")} - {format(dateRange.to, "dd MMM yy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd MMM yyyy")
                    )
                  ) : (
                    "Pick a date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceFilters;
