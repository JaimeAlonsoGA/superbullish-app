import { ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";

const EmptyCheckout: React.FC<{ onBrowse: () => void }> = ({ onBrowse }) => {
    return (
        <div className="max-w-md mx-auto text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/20 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
                Add some amazing video templates to get started!
            </p>
            <Button size="lg" onClick={onBrowse}>
                Browse Templates
            </Button>
        </div>
    );
};

export default EmptyCheckout;