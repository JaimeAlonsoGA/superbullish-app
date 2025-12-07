import EmptyOrders from "@/components/dashboard/empty-orders"
import { useCurrentUser } from "@/queries/auth.queries"
import { Filter } from "lucide-react"
import ProjectsGrid from "@/components/project/projects-grid"
import { Project } from "@/types";
import { useState } from "react";
import ProjectFormDrawer from "@/components/project/project-form-drawer";
import { useProjectsByUser } from "@/queries/projects.queries";

export default function DashboardPage() {
    const { data: user, isLoading } = useCurrentUser();
    const { data: projects } = useProjectsByUser(user?.id);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    if (isLoading) {
        return <div>Loading...</div>
    }

    const handleSelectProject = (project: Project) => {
        setSelectedProject(project);
        setOpenDrawer(true);
    }

    return (
        <div className="space-y-6">
            <ProjectsGrid projects={projects ?? null} handleSelectProject={handleSelectProject} />
            <div className="text-muted flex flex-row gap-2 items-center">
                <Filter className="h-4 w-4" />
                <h3>Filter:</h3>
            </div>
            <EmptyOrders />
            <ProjectFormDrawer
                trigger={openDrawer}
                setClose={setOpenDrawer}
                project={selectedProject}
            />
        </div>
    )
}