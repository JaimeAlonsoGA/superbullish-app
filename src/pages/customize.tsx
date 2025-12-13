import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTemplates } from "@/queries/templates.queries";
import { useCurrentUser } from "@/queries/auth.queries";
import ProjectFormDrawer from "@/components/project/project-form-drawer";
import { useProjectsByUser } from "@/queries/projects.queries";
import Preview from "@/components/customization/preview";
import Customizables from "@/components/customization/customizables";
import { useCart } from "@/providers/cart-provider";
import { Project, Template } from "@/types";

export default function CustomizePage() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const projectId = params.get("project");
    const cartItemId = params.get("cart");
    const { id } = useParams();
    const { items } = useCart();
    const { data: templates } = useTemplates();
    const { data: user } = useCurrentUser();
    const { data: projects } = useProjectsByUser(user?.id);

    let template: Template | undefined;
    let project: Project | undefined;
    let initialBgColor: string;
    let initialHeadline: string | null | undefined;
    let initialSubheadline: string | null | undefined;

    if (cartItemId) {
        const cartItem = items?.find((item) => item.id === cartItemId);
        project = cartItem?.project;
        template = templates?.find((t) => t.id === cartItem?.template.id);
        initialBgColor = cartItem?.backgroundColor || "#000000";
        initialHeadline = cartItem?.headline;
        initialSubheadline = cartItem?.subheadline;
    } else {
        template = templates?.find((t) => t.id === id);
        project = projects?.find((p) => p.id === projectId);
        initialBgColor = project?.background_color || "#000000";
    }

    const [bgColor, setBgColor] = useState<string>(initialBgColor);
    const [headline, setHeadline] = useState<string>(initialHeadline ?? "Your Headline Here");
    const [subheadline, setSubheadline] = useState<string>(initialSubheadline ?? "Your subheadline goes here and explains more");
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);

    if (cartItemId) {
        if (!items || !project || !template) return null;
    } else {
        if (!templates || !user || !projects || !template || !project) return null;
    }

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="title">
                    Customize <span className="text-primary">Video</span>
                </h1>
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <Button variant="link" onClick={() => setOpenDrawer(true)}>Edit Current Project</Button>
                    <Button variant="secondary" onClick={() => navigate(`/template/${template.id}/select-project`)}>Change Project</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Preview template={template} project={project} bgColor={bgColor} headline={headline} subheadline={subheadline} />
                <Customizables initialBgColor={initialBgColor} cartItemId={cartItemId ?? undefined} template={template} project={project} bgColor={bgColor} headline={headline} setHeadline={setHeadline} subheadline={subheadline} setSubheadline={setSubheadline} setBgColor={setBgColor} />
            </div>
            <ProjectFormDrawer
                trigger={openDrawer}
                setClose={setOpenDrawer}
                project={project}
            />
        </div>
    );
}
