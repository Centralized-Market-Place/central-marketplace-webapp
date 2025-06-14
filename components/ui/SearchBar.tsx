import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface GoogleSearchBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

const SearchBar = React.forwardRef<HTMLDivElement, GoogleSearchBarProps>(
  ({ className, onSearch, placeholder = "Search ", ...props }, ref) => {
    const [query, setQuery] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (onSearch) {
        onSearch(query);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "max-w-4xl mx-auto",
          className
        )}
        {...props}
      >
        <form onSubmit={handleSubmit}>
          <div className="relative group">
            <Input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-14 rounded-full bg-background pl-14 pr-14 text-base hover:shadow-xl  [&::-webkit-search-cancel-button]:appearance-none"
              placeholder={placeholder}
            />
            {/* Search icon */}
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-muted-foreground">
              <Search size={22} strokeWidth={1.5} />
            </div>
          </div>
        </form>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export { SearchBar }; 