import ProjectForm from "@/components/project/project-form";
import { useCurrentUser } from "@/queries/auth.queries";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function ProjectPage() {
    const { data: user, isLoading, isError } = useCurrentUser();
    const { id } = useParams<{ id?: string }>();
    const selectedProject = id ? user?.projects?.find(project => project.id === id) : null;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Link to="/dashboard" className="flex flex-row gap-2 items-center">
                <ArrowLeft className="w-5 h-5" />
            </Link>
            <ProjectForm project={selectedProject || null} />
        </div>
    );
}