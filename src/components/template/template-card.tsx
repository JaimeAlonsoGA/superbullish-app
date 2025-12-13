import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Template } from "@/types";
import { useAccount } from "wagmi";
import { useTemplatePrice } from "@/hooks/use-template-price";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAuth } from "@/providers/auth-provider";

export default function TemplateCard({ template }: { template: Template }) {
    const [hovered, setHovered] = useState(false);
    const { formattedPrice } = useTemplatePrice(template.price);
    const { openConnectModal } = useConnectModal();
    const { isAuthenticated } = useAuth();

    function handleCardClick(e: React.MouseEvent) {
        if (!isAuthenticated) {
            e.preventDefault();
            openConnectModal?.();
        }
    }

    return (
        <Link
            to={`/template/${template.id}`}
            className="group block rounded-xl overflow-hidden transition-all hover:scale-[1.02]"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleCardClick}
        >
            <div className="rounded-xl relative aspect-video w-full bg-linear-to-br from-muted/40 to-muted/10 overflow-hidden">
                {hovered ? (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        src={template.preview_url}
                    >
                        <track kind="captions" />
                    </video>
                ) : (
                    <img
                        src={template.thumbnail_url}
                        alt={template.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                )}

                <div className="absolute inset-0 bg-linear-to-t from-background/70 via-transparent to-transparent" />

                {template.category && <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-md border-primary/40 text-primary capitalize px-2 py-1 text-xs">
                        {template.category}
                        {template.category2 && <span className="text-muted-foreground ml-1">• {template.category2}</span>}
                    </Badge>
                </div>}

                <div className="absolute bottom-3 right-3">
                    <Badge className="bg-green-500/20 text-green-400 px-2 py-1 text-xs">
                        {formattedPrice}
                    </Badge>
                </div>
            </div>

            <p className="mt-2 text-center text-muted text-sm truncate">{template.name}</p>
        </Link>
    );
}