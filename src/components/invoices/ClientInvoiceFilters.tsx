
import React, { useMemo } from "react";
import { Select, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface FilterProps {
  invoices: { date: string }[];
  selectedMonth: string;
  setSelectedMonth: (val: string) => void;
  selectedYear: string;
  setSelectedYear: (val: string) => void;
  resetFilters: () => void;
}

const months = [
  "All",
  "January","February","March","April","May","June","July","August","September","October","November","December"
];

const ClientInvoiceFilters: React.FC<FilterProps> = ({
  invoices,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  resetFilters
}) => {
  // Find distinct years from invoice dates
  const years = useMemo(() => {
    const yrs = Array.from(new Set(
      invoices.map(inv => new Date(inv.date).getFullYear())
    ));
    return ["All", ...yrs.sort((a, b) => b - a)];
  }, [invoices]);

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      <div>
        <label className="text-xs font-medium block mb-1">Month</label>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          {months.map(month => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div>
        <label className="text-xs font-medium block mb-1">Year</label>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          {years.map((year) => (
            <SelectItem key={year} value={String(year)}>
              {year}
            </SelectItem>
          ))}
        </Select>
      </div>
      <Button variant="ghost" size="sm" onClick={resetFilters}>
        <Calendar className="h-4 w-4 mr-2" />
        Reset Filters
      </Button>
    </div>
  );
};

export default ClientInvoiceFilters;
