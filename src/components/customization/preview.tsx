import { ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Project, Template } from "@/types";
import React from "react";

interface PreviewProps {
    template: Template;
    project: Project;
    bgColor?: string;
    headline?: string;
    subheadline?: string;
}

const Preview: React.FC<PreviewProps> = ({ template, project, bgColor, headline, subheadline }) => {
    const gradient = `linear-gradient(to bottom, ${bgColor}, #000000)`;

    return (
        <Card className="xl:col-span-2 rounded-2xl border-muted-foreground/20">
            <CardHeader>
                <CardTitle>Preview: <span className="text-primary">{template.name}</span></CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    className="w-full aspect-video rounded-xl gap-4 p-8 flex flex-col items-center justify-center text-center"
                    style={{
                        background: gradient,
                    }}
                >
                    {/* Project Logo */}
                    {project.logo_url ? (
                        <img
                            src={project.logo_url}
                            alt="logo"
                            className="w-32 h-32 object-contain mb-4 drop-shadow-lg"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-xl bg-black/20 flex items-center justify-center mb-4">
                            <ImageIcon className="w-10 h-10 text-white/60" />
                        </div>
                    )}

                    {/* Ticker */}

                    {/* Headline */}
                    {template.headline && (
                        <h2
                            className="text-3xl font-bold tracking-tight"
                            style={{ color: project.main_color }}
                        >
                            {headline}
                        </h2>
                    )}

                    {/* Subheadline */}
                    {template.subheadline && (
                        <p className="text-lg max-w-xl" style={{ color: bgColor }}>
                            {subheadline}
                        </p>
                    )}

                    <Badge
                        variant={"secondary"}
                        style={{ backgroundColor: project.main_color }}
                    >
                        {project.ticker}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}

export default Preview;