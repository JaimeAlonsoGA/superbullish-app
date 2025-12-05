import { Template } from "@/types";
import { Link } from "react-router-dom";

const RelatedTemplates = ({ templates, template }: { templates: Template[], template: Template }) => {
    const relatedTemplates = (() => {
        const candidates = templates.filter(
            (t) => t.id !== template.id && t.category === template.category
        );

        for (let i = candidates.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
        }

        return candidates.slice(0, 4);
    })();

    return (
        <section className="mt-10">
            <h2 className="text-2xl font-bold text-center mb-6">
                Related Templates
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedTemplates.map((template) => (
                    <Link
                        to={`/template/${template.id}`}
                        key={template.id}
                        className="rounded-xl overflow-hidden bg-secondary/40 hover:scale-[1.02] transition"
                    >
                        <img src={template.thumbnail_url} alt={template.name} className="aspect-video bg-black" />
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default RelatedTemplates;