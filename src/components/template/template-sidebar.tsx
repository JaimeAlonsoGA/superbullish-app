import { Button } from "@/components/ui/button";
import { useTemplatePrice } from "@/hooks/use-template-price";
import { useCurrentUser } from "@/queries/auth.queries";
import { Template } from "@/types";
import { DiamondPlus, FolderGit2, MousePointer2 } from "lucide-react"
import ProjectFormDrawer from "../project/project-form-drawer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ButtonLoading from "../ui/custom/button-loading";

const TemplateSidebar = ({ template }: { template: Template }) => {
    const user = useCurrentUser().data;
    const price = useTemplatePrice(template.price);
    const navigate = useNavigate();
    const [triggerCreateProject, setTriggerCreateProject] = useState(false);

    const CTA = () => {
        if (!user?.projects || user.projects.length === 0) {
            return { label: "Create New Project", icon: DiamondPlus, action: () => { setTriggerCreateProject(true) } }
        }
        if (user.projects && user.projects.length === 1) {
            return { label: "Customize", icon: FolderGit2, action: () => { navigate(`/template/${template.id}/customize?project=${user.projects![0].id}`) } }
        }
        if (template.dual_project) {
            if (user.projects.length < 2) {
                return { label: "Create New Project", icon: FolderGit2, action: () => { setTriggerCreateProject(true) } }
            }
            return { label: "Select Projects", icon: FolderGit2, action: () => { navigate(`/template/${template.id}/select-project`) } }
        }
        return { label: "Select Your Project", icon: MousePointer2, action: () => { navigate(`/template/${template.id}/select-project`) } }
    };

    const cta = CTA();
    const Icon = cta.icon;

    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-card space-y-6">
                <div className="p-4 rounded-lg border bg-primary/20 border-primary space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Final Price</span>

                        <span className="text-2xl font-bold text-primary">
                            {price.formattedPrice}
                        </span>
                    </div>
                    <ProjectFormDrawer
                        onSuccess={(project) => {
                            navigate(`/template/${template.id}/customize?project=${project.id}`);
                        }}
                        trigger={triggerCreateProject}
                        setClose={setTriggerCreateProject}
                    />
                    <div className="space-y-3">
                        {template.dual_project && (user?.projects && user.projects.length > 2) && (
                            <p className="text-sm text-muted-foreground">
                                This template requires two projects. Please create two projects to continue.
                            </p>
                        )}
                        <ButtonLoading state={Boolean(!user?.projects)} onClick={cta.action} size={"lg"} className="flex flex-row items-center gap-2 w-full bg-primary hover:bg-primary/60">
                            <Icon className="w-6 h-6" />
                            <span>{cta.label}</span>
                        </ButtonLoading>
                    </div>
                    {/* <Button onClick={() => addItem(template)} className="bg-card border border-muted/20 w-full hover:bg-muted-foreground/10">
                        <ShoppingCart size={18} />
                        Add to Cart
                    </Button> */}
                </div>
            </div>
        </div >
    );
}

export default TemplateSidebar;
