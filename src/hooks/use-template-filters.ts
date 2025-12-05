import { useState, useMemo } from "react";
import type { Template } from "@/types";

export function useTemplateFilters(templates: Template[]) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = useMemo(() => {
        const set = new Set<string>();
        for (const t of templates) {
            if (t.category) set.add(t.category);
            if (t.category2) set.add(t.category2);
            if (t.category3) set.add(t.category3);
        }
        return Array.from(set);
    }, [templates]);

    const filteredTemplates = useMemo(() => {
        const results = templates.filter((t) => {
            const text = search.toLowerCase();

            const matchesSearch =
                t.name.toLowerCase().includes(text) ||
                t.category.toLowerCase().includes(text);

            const matchesCategory = selectedCategory
                ? t.category === selectedCategory ||
                t.category2 === selectedCategory ||
                t.category3 === selectedCategory
                : true;

            return matchesSearch && matchesCategory;
        });

        return Array.from(new Map(results.map((t) => [t.id, t])).values());
    }, [templates, search, selectedCategory]);

    return {
        search,
        setSearch,
        selectedCategory,
        setSelectedCategory,
        categories,
        filteredTemplates,
    };
}
