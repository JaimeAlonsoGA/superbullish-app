import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type Props = {
    search: string;
    onSearch: (value: string) => void;
    categories: string[];
    selectedCategory: string | null;
    onSelectCategory: (cat: string | null) => void;
    resultsCount: number;
};

const TemplateFilters = ({
    search,
    onSearch,
    categories,
    selectedCategory,
    onSelectCategory,
    resultsCount,
}: Props) => {
    return (
        <div className="space-y-6">
            {/* Search */}
            <InputGroup>
                <InputGroupInput
                    placeholder="Search templates…"
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                />

                <InputGroupAddon>
                    <Search className="size-4 opacity-60" />
                </InputGroupAddon>

                <InputGroupAddon align="inline-end">
                    {resultsCount} results
                </InputGroupAddon>
            </InputGroup>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 justify-center">
                <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => onSelectCategory(null)}
                >
                    All
                </Button>

                {categories.map((cat) => (
                    <Button
                        key={cat}
                        variant={selectedCategory === cat ? "default" : "outline"}
                        size="sm"
                        className="rounded-full capitalize"
                        onClick={() =>
                            onSelectCategory(selectedCategory === cat ? null : cat)
                        }
                    >
                        {cat.replace(/-/g, " ")}
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default TemplateFilters;