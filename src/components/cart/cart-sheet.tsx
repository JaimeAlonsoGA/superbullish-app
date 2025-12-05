import { useNavigate } from "react-router-dom";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { CartItemCard } from "./cart-item-card";

const CartSheet = () => {
    const navigate = useNavigate();
    const { items, clearCart, getSummary } = useCart();

    const { count } = getSummary();

    const handleCheckout = () => {
        navigate("/checkout");
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="relative p-1 rounded-lg group cursor-pointer">
                    <ShoppingCart className="h-6 w-6 group-hover:text-primary transition" />
                    {count > 0 && (
                        <span className="animate-pulse absolute -top-1 -right-1 bg-primary text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                            {count}
                        </span>
                    )}
                </button>
            </SheetTrigger>

            <SheetContent className="flex flex-col pt-6 border-muted-foreground/20">
                <div className="flex-1 overflow-y-auto space-y-4 p-6">
                    {items.length === 0 ? (
                        <div className="text-center py-12 space-y-4">
                            <p className="text-muted-foreground">Your cart is empty</p>
                            <Button onClick={() => navigate("/explore")}>
                                Browse templates
                            </Button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <CartItemCard key={item.template.id} item={item} />
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <SheetFooter className="border-t border-muted-foreground/20 pt-4 space-y-3">
                        <Button className="w-full" onClick={handleCheckout}>
                            Checkout ({items.length})
                        </Button>

                        <SheetClose asChild>
                            <Button variant="outline" className="w-full" onClick={clearCart}>
                                Clear Cart
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet >
    );
};

export default CartSheet;
