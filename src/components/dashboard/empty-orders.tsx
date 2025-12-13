import { Package, ShoppingCart, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { useNavigate } from "react-router-dom";

const EmptyOrders: React.FC<{ handleCreateNewProject: () => void }> = ({ handleCreateNewProject }) => {
    const navigate = useNavigate();

    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Package className="w-6 h-6" />
                </EmptyMedia>
                <EmptyTitle>No Orders Yet</EmptyTitle>
                <EmptyDescription>
                    You haven&apos;t placed any orders yet. Start by exploring our video templates and creating your first project.
                </EmptyDescription>
            </EmptyHeader>

            <EmptyContent>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={() => navigate("/explore")}>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Browse Templates
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleCreateNewProject}
                    >
                        <Video className="w-4 h-4 mr-2" />
                        Create Project
                    </Button>
                </div>
            </EmptyContent>

            <div className="mt-8 pt-8 border-t border-border">
                <h4 className="text-sm font-semibold mb-4 text-center">
                    How it works
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                            <span className="text-primary font-bold">1</span>
                        </div>
                        <p className="text-sm font-medium">Choose a Template</p>
                        <p className="text-xs text-muted-foreground">
                            Browse our collection of professional video templates
                        </p>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                            <span className="text-primary font-bold">2</span>
                        </div>
                        <p className="text-sm font-medium">Customize</p>
                        <p className="text-xs text-muted-foreground">
                            Add your project details, colors, and branding
                        </p>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                            <span className="text-primary font-bold">3</span>
                        </div>
                        <p className="text-sm font-medium">Get Your Video</p>
                        <p className="text-xs text-muted-foreground">
                            Download your professional video in minutes
                        </p>
                    </div>
                </div>
            </div>
        </Empty>
    );
};

export default EmptyOrders;