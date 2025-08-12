
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, X } from "lucide-react";
import { Client } from "@/types";

interface ClientFiltersProps {
  clients: Client[];
  onFilter: (searchTerm: string, statusFilter: string, stateFilter: string, tagFilter: string) => void;
}

const availableTags = ["frequent", "delayed payer", "vip", "new", "priority"];
const availableStates = ["Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat", "Delhi", "Punjab"];

const ClientFilters = ({
  clients,
  onFilter,
}: ClientFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [tagFilters, setTagFilters] = useState<string[]>([]);

  const hasActiveFilters = statusFilter !== "all" || stateFilter !== "all" || tagFilters.length > 0;

  const handleTagToggle = (tag: string) => {
    let newTagFilters;
    if (tagFilters.includes(tag)) {
      newTagFilters = tagFilters.filter(t => t !== tag);
    } else {
      newTagFilters = [...tagFilters, tag];
    }
    setTagFilters(newTagFilters);
    onFilter(searchTerm, statusFilter, stateFilter, newTagFilters[0] || "");
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFilter(value, statusFilter, stateFilter, tagFilters[0] || "");
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    onFilter(searchTerm, value, stateFilter, tagFilters[0] || "");
  };

  const handleStateFilterChange = (value: string) => {
    setStateFilter(value);
    onFilter(searchTerm, statusFilter, value, tagFilters[0] || "");
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setStateFilter("all");
    setTagFilters([]);
    onFilter("", "all", "all", "");
  };

  return (
    <div className="space-y-4 animate-enter">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients by name or GST number..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        {/* State Filter */}
        <Select value={stateFilter} onValueChange={handleStateFilterChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {availableStates.map(state => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tag Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Tags {tagFilters.length > 0 && `(${tagFilters.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableTags.map(tag => (
              <DropdownMenuCheckboxItem
                key={tag}
                checked={tagFilters.includes(tag)}
                onCheckedChange={() => handleTagToggle(tag)}
              >
                {tag}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" onClick={handleClearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {(tagFilters.length > 0 || statusFilter !== "all" || stateFilter !== "all") && (
        <div className="flex flex-wrap gap-2">
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusFilter}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleStatusFilterChange("all")}
              />
            </Badge>
          )}
          {stateFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              State: {stateFilter}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleStateFilterChange("all")}
              />
            </Badge>
          )}
          {tagFilters.map(tag => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleTagToggle(tag)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientFilters;
