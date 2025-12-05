import { Template } from "@/types";
import TemplateCard from "./template-card";

interface Props {
    templates?: Template[];
}

export default function TemplatesGrid({ templates = [] }: Props) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {templates.map((tpl) => (
                <TemplateCard key={tpl.id} template={tpl} />
            ))}
        </div>
    );
}
