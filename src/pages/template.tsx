import RelatedTemplates from "@/components/template/related-templates";
import TemplateDetails from "@/components/template/template-details";
import TemplateSidebar from "@/components/template/template-sidebar";
import { useTemplates } from "@/queries/templates.queries";
import { useParams } from "react-router-dom";

export default function TemplatePage() {
    const templateId = useParams<{ id: string }>();
    const { data: templates, isLoading, isError } = useTemplates();
    if (templates === undefined) return null;
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading template</div>;

    const template = templates?.find((t) => t.id === templateId.id);
    if (!template) return <div>Template not found</div>;

    return (
        <div className="space-y-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-end">
                <TemplateDetails template={template} />
                <TemplateSidebar template={template} />
            </div>
            <RelatedTemplates templates={templates} template={template} />
        </div>
    );
}
