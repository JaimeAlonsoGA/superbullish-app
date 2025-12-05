import { Edit, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { CartItem } from "@/types/composites";
import { useTemplatePrice } from "@/hooks/use-template-price";

interface CartItemProps {
    item: CartItem;
    onEdit: (id: string, id2: string) => void;
    onRemove: (id: string) => void;
}

const CheckoutItemCard: React.FC<CartItemProps> = ({ item, onEdit, onRemove }) => {
    const { priceNative, formattedPrice } = useTemplatePrice(item.template.price);

    return (
        <Card className="border-app">
            <CardContent>
                <div className="flex gap-4">
                    <div className="relative shrink-0">
                        <img
                            src={item.template.thumbnail_url}
                            alt={item.template.name}
                            className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full border-2 border-background shadow-sm"
                            style={{ backgroundColor: item.project.main_color }}
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row items-start justify-between">
                            <div className="flex-1">
                                <h3 className="font-semibold truncate">
                                    {item.template.name}
                                </h3>
                                <p className="text-sm text-muted-foreground capitalize mt-0.5">
                                    {item.template.category}
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <Badge variant="secondary" style={{ backgroundColor: item.backgroundColor }}>
                                        {item.project.ticker}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground truncate">{item.project.name}</span>
                                </div>
                            </div>
                            <div className="text-right ml-4">
                                <p className="text-lg font-bold">
                                    {formattedPrice}
                                </p>
                            </div>
                        </div>

                        <Separator className="my-3" />
                        {item.headline && (
                            <div className="text-sm space-y-1">
                                <p className="font-medium">{item.headline}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">{item.subheadline}</p>
                            </div>
                        )}

                        <div className="mt-3 flex items-center gap-3">
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() => onEdit(item.id, item.template.id)}
                                className="p-0 h-auto font-medium"
                            >
                                <Edit className="w-4 h-4 mr-1" />
                                Customize
                            </Button>
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() => onRemove(item.id)}
                                className="p-0 h-auto font-medium text-destructive hover:text-destructive"
                            >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Remove
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CheckoutItemCard;