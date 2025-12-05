import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, Shield, Info } from "lucide-react";

import EmptyCheckout from "@/components/checkout/checkout-empty";
import CheckoutHeader from "@/components/checkout/checkout-header";
import CheckoutItemCard from "@/components/checkout/checkout-item-card";
import CheckoutSummary from "@/components/checkout/checkout-summary";
import CheckoutPaymentModal from "@/components/checkout/checkout-payment-modal";

import { useCart } from "@/providers/cart-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items, removeItem } = useCart();
    const { isConnected, chain } = useAccount();
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const handleEdit = (itemId: string, templateId: string) => {
        navigate(`/template/${templateId}/customize?cart=${itemId}`);
    };

    const handleRemove = (itemId: string) => {
        removeItem(itemId);
    };

    const handleBrowse = () => {
        navigate("/explore");
    };

    const handleProceedToPayment = () => {
        if (!isConnected) {
            toast.error("Please connect your wallet to proceed with the payment.");
            return;
        }
        setShowPaymentModal(true);
    };

    if (items.length === 0) {
        return (
            <section>
                <CheckoutHeader items={items} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <EmptyCheckout onBrowse={handleBrowse} />
                </div>
            </section>
        );
    }

    return (
        <section>
            <CheckoutHeader items={items} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h2 className="text-xl font-bold">Review Your Order</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Make sure everything looks good before proceeding
                            </p>
                        </div>

                        {isConnected && chain && (
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertTitle>Network: {chain.name}</AlertTitle>
                                <AlertDescription>
                                    Your payment will be processed on {chain.name}. Make sure you have enough balance to cover the transaction.
                                </AlertDescription>
                            </Alert>
                        )}

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

                        <div className="rounded-lg border bg-muted/20 p-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold">Secure Payment</h3>
                            </div>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    <span>All transactions are processed directly on the blockchain</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    <span>Your funds are never held by intermediaries</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    <span>Videos delivered immediately after payment confirmation</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <CheckoutSummary
                            items={items}
                            onCheckout={handleProceedToPayment}
                        />
                    </div>
                </div>
            </div>

            <CheckoutPaymentModal
                open={showPaymentModal}
                onOpenChange={setShowPaymentModal}
            />
        </section>
    );
};

export default CheckoutPage;