import { useCurrentUser } from "@/queries/auth.queries";
import { Filter } from "lucide-react";
import ProjectsGrid from "@/components/project/projects-grid";
import { Project } from "@/types";
import { useState } from "react";
import ProjectFormDrawer from "@/components/project/project-form-drawer";
import { useProjectsByUser } from "@/queries/projects.queries";
import Orders from "@/components/dashboard/orders";
import OrdersSkeleton from "@/components/dashboard/order-skeleton";
import EmptyOrders from "@/components/dashboard/empty-orders";

export default function DashboardPage() {
    const { data: user, isLoading } = useCurrentUser();
    const { data: projects } = useProjectsByUser(user?.id);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const handleSelectProject = (project: Project | null) => {
        setSelectedProject(project);
        setOpenDrawer(true);
    };

    const handleCreateNewProject = () => {
        setOpenDrawer(true);
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
                    ))}
                </div>
                <OrdersSkeleton />
            </div>
        );
    }

    const userHasTransactions = user?.transactions || user?.transactions?.length !== 0;

    console.log("User Transactions:", user?.transactions);

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h2 className="title">Your Projects</h2>
                <ProjectsGrid
                    projects={projects ?? null}
                    handleSelectProject={handleSelectProject}
                    handleCreateNewProject={handleCreateNewProject}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="title">Your Orders</h2>
                    <div className="text-muted flex flex-row gap-2 items-center">
                        <Filter className="h-4 w-4" />
                        <span className="text-sm">Filter by status</span>
                    </div>
                </div>

                {userHasTransactions
                    ? <Orders transactions={user?.transactions!} />
                    : <EmptyOrders handleCreateNewProject={handleCreateNewProject} />
                }
            </div>

            <ProjectFormDrawer
                trigger={openDrawer}
                setClose={setOpenDrawer}
                project={selectedProject}
            />
        </div>
    );
}