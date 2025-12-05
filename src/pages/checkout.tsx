import EmptyCheckout from "@/components/checkout/checkout-empty";
import CheckoutHeader from "@/components/checkout/checkout-header";
import CheckoutItemCard from "@/components/checkout/checkout-item-card";
import CheckoutSummary from "@/components/checkout/checkout-summary";
import { useCart } from "@/providers/cart-provider";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items, removeItem } = useCart();

    const handleEdit = (itemId: string, templateId: string) => {
        navigate(`/template/${templateId}/customize?cart=${itemId}`);
    };

    const handleRemove = (itemId: string) => {
        removeItem(itemId);
    };

    const handleBrowse = () => {
        navigate("/explore");
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <CheckoutHeader items={items} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <EmptyCheckout onBrowse={handleBrowse} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <CheckoutHeader items={items} />
            {/* <CheckoutSteps currentStep={currentStep} /> */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h2 className="text-xl font-bold">Review Your Order</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Make sure everything looks good before proceeding
                            </p>
                        </div>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <CheckoutItemCard
                                    key={item.id}
                                    item={item}
                                    onEdit={handleEdit}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <CheckoutSummary items={items} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
