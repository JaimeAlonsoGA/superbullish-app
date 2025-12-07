import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Template } from "@/types";
import { useTemplatePrice } from "@/hooks/use-template-price";
import { useCart } from "@/providers/cart-provider";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { CartItem } from "@/types/composites";
import { SheetClose } from "../ui/sheet";

export const CartItemCard = ({ item }: { item: CartItem }) => {
    const { removeItem } = useCart();
    const { formattedPrice } = useTemplatePrice(item.template.price);
    const navigate = useNavigate();

    const handleCustomize = () => {
        navigate(`/template/${template.id}/customize?cart=${item.id}`);
    };

    const template = item.template as Template;

    return (
        <Card key={template.id} className="border-muted-foreground/20">
            <CardContent className="flex flex-col gap-2">
                <div className="flex flex-row items-start gap-4">
                    <img
                        src={template.thumbnail_url}
                        alt={template.name}
                        className="w-20 h-20 rounded-md object-cover"
                    />

                    <div className="flex-1 min-w-0">
                        <div>
                            <h4 className="font-semibold truncate">{template.name}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                                {template.category}
                            </p>

                            <p className="text-sm text-primary mt-1">{formattedPrice}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => removeItem(item.id)}
                        className="cursor-pointer text-muted-foreground hover:text-red-500 transition pt-1"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                <SheetClose asChild>
                    <Button
                        variant="link"
                        className="p-0 text-primary"
                        onClick={handleCustomize}
                    >
                        Customize
                    </Button>
                </SheetClose>
            </CardContent>


            {/* Footer subtotal */}
            <CardFooter className="flex justify-between border-t border-muted-foreground/20">
                <span className="text-sm text-muted-foreground">
                    Project
                </span>

                <span className="font-semibold">
                    {item.project.name}
                </span>
            </CardFooter>
        </Card>
    );
};
