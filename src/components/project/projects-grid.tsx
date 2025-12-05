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
            <div
                className="flex flex-wrap items-center gap-4"
            >
                {handleCreateNewProject &&
                    <button
                        className="cursor-pointer group flex flex-col items-center"
                        onClick={handleCreateNewProject}
                    >
                        <div className="rounded-xl w-20 h-20 border-2 border-dashed border-muted-foreground/40 flex items-center justify-center transition-all group-hover:border-muted-foreground/60 group-hover:bg-muted/30">
                            <Plus className="w-5 h-5 text-muted-foreground transition-all group-hover:scale-110" />
                        </div>
                        <div className="mt-2 text-center font-medium text-xs text-muted-foreground group-hover:text-foreground">
                            Create Project
                        </div>
                    </button>
                }

                {list.map((c) => {
                    const bg = c.background_color ?? "#f4f4f5";
                    const mainColor = c.main_color ?? "transparent";

                    return (
                        <Card
                            onClick={() => handleSelectProject(c)} key={c.id}
                            className={cn(
                                "cursor-pointer",
                                "group rounded-2xl overflow-hidden border border-muted-foreground/20 shadow-sm",
                                "transition-all hover:shadow-xl hover:-translate-y-1 hover:border-muted-foreground/40"
                            )}
                        >
                            <CardHeader className="flex flex-row items-center justify-between">
                                <h3 className="font-semibold text-lg truncate">{c.name}</h3>

                                {c.ticker && (
                                    <Badge
                                        variant="secondary"
                                        className="w-fit mt-1 text-xs px-2 py-0.5"
                                        style={{ backgroundColor: mainColor, color: "white" }}
                                    >
                                        {c.ticker}
                                    </Badge>
                                )}
                            </CardHeader>

                            <CardContent className="flex justify-center">
                                <div
                                    className={cn(
                                        "w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center shadow-inner",
                                        "transition-all group-hover:scale-105 group-hover:shadow-md"
                                    )}
                                    style={{ backgroundColor: bg }}
                                >
                                    {c.logo_url ? (
                                        <img
                                            src={c.logo_url}
                                            alt={c.name}
                                            className="object-contain w-20 h-20 opacity-90 transition-all group-hover:opacity-70"
                                        />
                                    ) : (
                                        <span className="text-muted-foreground text-sm opacity-70">No Logo</span>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter>
                                <div className="flex gap-3">
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-muted-foreground mr-1">Main</span>
                                        <div
                                            className="w-5 h-5 rounded-full border shadow"
                                            style={{ backgroundColor: mainColor }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-muted-foreground mr-1">Background</span>
                                        <div
                                            className="w-5 h-5 rounded-full border shadow"
                                            style={{ backgroundColor: bg }}
                                        />
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </section >
    );
}