import { CartItem } from "@/types/composites";
import { Package } from "lucide-react";

const CheckoutHeader: React.FC<{ items: CartItem[] }> = ({ items }) => {
    return (
        <div className="border-b border-app">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="title text-primary">Checkout</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Complete your order</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        <span className="font-semibold">{items.length} Web3 <span className="text-primary"> Videos</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutHeader;