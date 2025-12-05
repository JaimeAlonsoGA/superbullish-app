import { ChevronRight, CreditCard, Package, ShoppingBag } from "lucide-react";

const CheckoutSteps: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = [
        { number: 1, name: 'Review', icon: ShoppingBag },
        { number: 2, name: 'Payment', icon: CreditCard },
        { number: 3, name: 'Complete', icon: Package }
    ];

    return (
        <div className="border-b border-muted-foreground/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <nav aria-label="Progress">
                    <ol className="flex items-center justify-center">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.number;
                            const isCompleted = currentStep > step.number;

                            return (
                                <li key={step.number} className="flex items-center">
                                    <div className="flex items-center">
                                        <div
                                            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${isActive
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : isCompleted
                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                    : 'border-muted-foreground/30 bg-background text-muted-foreground'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="ml-3 hidden sm:block">
                                            <p
                                                className={`text-sm font-medium ${isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                                                    }`}
                                            >
                                                {step.name}
                                            </p>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <ChevronRight className="w-5 h-5 text-muted-foreground mx-4" />
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </nav>
            </div>
        </div>
    );
};

export default CheckoutSteps; 