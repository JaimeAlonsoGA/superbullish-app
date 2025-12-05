import TemplateFilters from "@/components/explorer/filters";
import TemplatesGrid from "@/components/template/templates-grid";
import { useTemplateFilters } from "@/hooks/use-template-filters";
import { useTemplates } from "@/queries/templates.queries";

export default function ExplorePage() {
    const { data: templates, isLoading, isError } = useTemplates();

    const {
        search,
        setSearch,
        selectedCategory,
        setSelectedCategory,
        categories,
        filteredTemplates,
    } = useTemplateFilters(templates ?? []);


    if (isLoading) return <div>Loading…</div>;
    if (isError || !templates) return <div>Error loading templates</div>;


    return (
        <section className="space-y-10">
            <div className="mx-auto max-w-2xl text-center space-y-4">
                <h2 className="text-3xl font-bold">
                    Crypto <span className="text-primary">Video</span> Collection
                </h2>
                <p className="text-lg opacity-80">
                    Browse and filter video market templates
                </p>

                <TemplateFilters
                    search={search}
                    onSearch={setSearch}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    categories={categories}
                    resultsCount={filteredTemplates.length}
                />
            </div>

            <TemplatesGrid templates={filteredTemplates} />
        </section>
    );
}
