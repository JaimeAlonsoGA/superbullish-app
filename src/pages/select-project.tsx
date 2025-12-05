import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTemplates } from "@/queries/templates.queries";
import { useCurrentUser } from "@/queries/auth.queries";

import ProjectFormDrawer from "@/components/project/project-form-drawer";
import ProjectsGrid from "@/components/project/projects-grid";
import { Project } from "@/types";

export default function SelectProjectPage() {
    const { id: templateId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: templates, isLoading, isError } = useTemplates();
    const user = useCurrentUser().data;

    const [openDrawer, setOpenDrawer] = useState(false);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading template</div>;
    if (!templates) return null;

    const template = templates.find((t) => t.id === templateId);
    if (!template) return <div>Template not found</div>;

    const projects = user?.projects ?? [];

    const handleSelectProject = (project: Project) => {
        navigate(`/template/${template.id}/customize?project=${project.id}`);
    }

    const handleCreateNewProject = () => {
        setOpenDrawer(true);
    }

    return (
        <div className="space-y-10">
            <h2 className="title">
                Choose a Project and <span className="text-primary">Customize Your Web3 Template</span>
            </h2>

            <ProjectsGrid projects={projects} handleSelectProject={handleSelectProject} handleCreateNewProject={handleCreateNewProject} />

            <ProjectFormDrawer
                trigger={openDrawer}
                setClose={setOpenDrawer}
                onSuccess={(project) => {
                    navigate(`/template/${template.id}/customize?project=${project.id}`);
                }}
            />
        </div>
    );
}
