import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type BackButtonProps = {
    fallbackHref?: string;
    label?: string;
    variant?: "default" | "outline" | "ghost" | "secondary";
    className?: string;
};

export function BackButton({
    fallbackHref = "/",
    label = "",
    className,
}: BackButtonProps) {
    const navigate = useNavigate();
    const [canGoBack, setCanGoBack] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCanGoBack(window.history.length > 1);
        }
    }, []);

    const handleBack = () => {
        if (canGoBack) {
            navigate(-1);
        } else {
            navigate(fallbackHref);
        }
    };

    return (
        <button
            onClick={handleBack}
            className={cn(className, "group hover:cursor-pointer")}
            aria-label="Go back"
        >
            <ArrowLeft className="mr-2 size-4 group-hover:translate-x-[-2px] transition-transform" />
            {label}
        </button>
    );
}
