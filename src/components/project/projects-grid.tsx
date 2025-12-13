import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface Props {
    projects: Project[] | null;
    handleSelectProject: (project: Project) => void;
    handleCreateNewProject?: () => void;
}

export default function ProjectsGrid({ projects, handleSelectProject, handleCreateNewProject }: Props) {
    const list = projects ?? [];
    return (
        <section className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                {handleCreateNewProject &&
                    <Card
                        onClick={handleCreateNewProject}
                        className={cn(
                            "group cursor-pointer",
                            "border border-border/50 bg-card",
                            "transition-all duration-300",
                            "hover:shadow-lg hover:border-border"
                        )}
                    >
                        <CardContent className="p-0 my-auto">
                            <div className="flex items-center gap-4 px-4">
                                <div
                                    className={cn(
                                        "relative hrink-0 w-16 h-16 rounded-xl overflow-hidden",
                                        "flex items-center justify-center shadow-sm",
                                        "transition-transform group-hover:scale-105"
                                    )}
                                >
                                    <Plus
                                        className="w-12 h-12 text-muted-foreground"
                                    />
                                </div>

                                <div className="flex-1 min-w-0 space-y-1.5">
                                    <h3 className="font-semibold text-base truncate">
                                        Create New project
                                    </h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                }

                {list.map((p) => {
                    const bg = p.background_color ?? "#f4f4f5";
                    const mainColor = p.main_color ?? "transparent";

                    return (
                        <Card
                            key={p.id}
                            onClick={() => handleSelectProject(p)}
                            className={cn(
                                "group cursor-pointer overflow-hidden rounded-2xl",
                                "border border-border/50 bg-card",
                                "transition-all duration-300",
                                "hover:shadow-lg hover:border-border"
                            )}
                        >
                            <CardContent className="p-0">
                                <div className="flex items-center gap-4 px-4 py-2">
                                    <div
                                        className={cn(
                                            "relative hrink-0 w-16 h-16 rounded-xl overflow-hidden",
                                            "flex items-center justify-center shadow-sm",
                                            "transition-transform group-hover:scale-105"
                                        )}
                                        style={{ backgroundColor: bg }}
                                    >
                                        {p.logo_url ? (
                                            <img
                                                src={p.logo_url}
                                                alt={p.name}
                                                className="w-12 h-12 object-contain"
                                            />
                                        ) : (
                                            <span className="text-xs text-muted-foreground/50">
                                                No Logo
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-1.5">
                                        <h3 className="font-semibold text-base truncate">
                                            {p.name}
                                        </h3>

                                        {p.ticker && (
                                            <Badge
                                                className="text-xs px-2 py-0.5 font-medium"
                                                style={{
                                                    backgroundColor: mainColor,
                                                    color: "white",
                                                }}
                                            >
                                                {p.ticker}
                                            </Badge>
                                        )}

                                        <div className="flex items-center gap-3 pt-1">
                                            <div className="flex items-center gap-1.5">
                                                <div
                                                    className="w-4 h-4 rounded-full border shadow-sm"
                                                    style={{ backgroundColor: mainColor }}
                                                />
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                                    Primary
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div
                                                    className="w-4 h-4 rounded-full border shadow-sm"
                                                    style={{ backgroundColor: bg }}
                                                />
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                                    BG
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section >
    );
}