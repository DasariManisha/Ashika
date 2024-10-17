import { Input } from "@/components/ui/input";
import { IReportsFilters } from "@/lib/interfaces/report";
import { Search } from "lucide-react";

const SearchFilter: React.FC<IReportsFilters> = ({
  searchString,
  setSearchString,
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        placeholder="Search Here..."
        value={searchString}
        type="search"
        onChange={(e) => setSearchString(e.target.value)}
        className="w-30 pl-8 bg-white-500"
      />
    </div>
  );
};

export default SearchFilter;
