import React from "react";
import { Check, Package, Loader2, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { RecordStatus } from "@/types/definitions";

interface OrderProgressProps {
    recordStatus: RecordStatus;
}

const OrderProgress: React.FC<OrderProgressProps> = ({ recordStatus }) => {
    const steps = [
        {
            id: "confirmed",
            label: "Confirmed",
            description: "Payment received",
            icon: CheckCircle,
        },
        {
            id: "processing",
            label: "Processing",
            description: "Rendering videos",
            icon: Package,
        },
        {
            id: "delivered",
            label: "Delivered",
            description: "Ready to download",
            icon: Check,
        },
    ];

    const getCurrentStep = (): number => {
        if (recordStatus === 'failed') return -1;
        if (recordStatus === 'delivered') return 2;
        if (recordStatus === 'processing') return 1;
        return 0; // confirmed (payment done, waiting to start processing)
    };

    const currentStepIndex = getCurrentStep();
    const hasFailed = recordStatus === 'failed';

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const Icon = step.icon;

                    return (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className={cn(
                                        "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                                        hasFailed && "bg-red-500 border-red-500",
                                        !hasFailed && isCompleted && "bg-green-500 border-green-500",
                                        !hasFailed && isCurrent && "bg-primary border-primary animate-pulse",
                                        !hasFailed && !isCompleted && !isCurrent && "border-muted-foreground/30"
                                    )}
                                >
                                    {hasFailed ? (
                                        <XCircle className="w-5 h-5 text-white" />
                                    ) : isCompleted ? (
                                        <Check className="w-5 h-5 text-white" />
                                    ) : isCurrent ? (
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                    ) : (
                                        <Icon className="w-5 h-5 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="text-center">
                                    <span
                                        className={cn(
                                            "text-xs font-medium block",
                                            hasFailed && "text-red-500",
                                            !hasFailed && (isCompleted || isCurrent) && "text-foreground",
                                            !hasFailed && !isCompleted && !isCurrent && "text-muted-foreground"
                                        )}
                                    >
                                        {step.label}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                                        {step.description}
                                    </span>
                                </div>
                            </div>

                            {index < steps.length - 1 && (
                                <div className="flex-1 h-0.5 mx-2">
                                    <div
                                        className={cn(
                                            "h-full transition-all",
                                            hasFailed && "bg-red-500",
                                            !hasFailed && isCompleted && "bg-green-500",
                                            !hasFailed && !isCompleted && "bg-muted-foreground/30"
                                        )}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {hasFailed && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-red-500 font-medium">
                        Video rendering failed. Please contact support.
                    </p>
                </div>
            )}
        </div>
    );
};

export default OrderProgress;