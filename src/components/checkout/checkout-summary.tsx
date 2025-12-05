import { CreditCard, Package } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { CartItem } from "@/types/composites";

const CheckoutSummary: React.FC<{ items: CartItem[] }> = ({ items }) => {
    const subtotal = items.reduce((sum, item) => sum + item.template.price, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
        <Card className="border-muted-foreground/20 sticky top-6">
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax (10%)</span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Processing Fee</span>
                        <span className="font-medium text-green-600">FREE</span>
                    </div>
                </div>

                <Separator />

                <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                        <span className="text-base font-semibold">Total</span>
                        <span className="text-2xl font-bold">${total.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">USD</p>
                </div>

                <Button className="w-full" size="lg">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Payment
                </Button>

                <div className="pt-4 border-t border-muted-foreground/20">
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Package className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>Your videos will be available for download immediately after payment confirmation.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CheckoutSummary;    