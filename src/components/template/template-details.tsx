import { Badge } from "@/components/ui/badge";
import { Template } from "@/types";

const TemplateDetails = ({ template }: { template: Template }) => {
    return (
        <div className="lg:col-span-2 space-y-6">
            <div>
                {template.category && <div className="flex gap-2">
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-md border-primary/40 text-primary capitalize px-2 py-1 text-xs">
                        {template.category}
                        {template.category2 && <span className="text-muted-foreground ml-1">• {template.category2}</span>}
                    </Badge>
                </div>}

                <h1 className="title mt-2">
                    {template.name}
                </h1>
            </div>
            <div className="rounded-xl overflow-hidden bg-card backdrop-blur-lg">
                <div className="aspect-video w-full bg-black">
                    <video
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover"
                        src={template.preview_url}
                    />
                </div>
            </div>
        </div>
    );
}

export default TemplateDetails;
