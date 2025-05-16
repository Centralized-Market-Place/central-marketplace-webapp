import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search, Mic, Camera } from "lucide-react";

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
          "max-w-4xl mx-auto my-16",
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
              className="h-14 rounded-full bg-background pl-14 pr-24 text-base hover:shadow-xl  [&::-webkit-search-cancel-button]:appearance-none"
              placeholder={placeholder}
            />
            {/* Search icon */}
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-muted-foreground">
              <Search size={22} strokeWidth={1.5} />
            </div>
            {/* Right side icons */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-5 gap-2">
              <button
                type="button"
                className="h-9 w-9 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
                aria-label="Search by voice"
              >
                <Mic size={20} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className="h-9 w-9 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
                aria-label="Search by image"
              >
                <Camera size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export { SearchBar }; 