import { Project, Template } from "@/types";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ColorPicker, ColorPickerHue, ColorPickerSelection } from "../ui/shadcn-io/color-picker";
import { Textarea } from "../ui/textarea";
import { CartItem } from "@/types/composites";
import { useCart } from "@/providers/cart-provider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"
import { useCallback, useEffect, useRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";

interface CustomizationProps {
    initialBgColor: string;
    cartItemId?: string;
    template: Template;
    project: Project;
    bgColor: string;
    headline: string;
    setHeadline: React.Dispatch<React.SetStateAction<string>>;
    subheadline: string;
    setSubheadline: React.Dispatch<React.SetStateAction<string>>;
    setBgColor: React.Dispatch<React.SetStateAction<string>>;
}

const Customizables: React.FC<CustomizationProps> = ({ cartItemId, template, project, bgColor, headline, subheadline, setHeadline, setSubheadline, setBgColor }) => {
    const { addItem, removeItem } = useCart();
    const navigate = useNavigate();
    const customBgColor = project.background_color !== bgColor;

    const isInternalUpdate = useRef(false);

    useEffect(() => {
        if (project?.background_color && !cartItemId) {
            isInternalUpdate.current = true;
            setBgColor(project.background_color);
            setTimeout(() => {
                isInternalUpdate.current = false;
            }, 0);
        }
    }, [project?.background_color, cartItemId]);

    const handleColorChange = useCallback((hex: string) => {
        if (hex !== bgColor && !isInternalUpdate.current) {
            setBgColor(hex);
        }
    }, [bgColor]);

    const handleResetColor = useCallback(() => {
        if (project?.background_color) {
            isInternalUpdate.current = true;
            setBgColor(project.background_color);
            setTimeout(() => {
                isInternalUpdate.current = false;
            }, 0);
        }
    }, [project?.background_color]);

    const handleAddToCart = () => {
        const item: CartItem = {
            id: crypto.randomUUID(),
            template: template,
            project: project,
            backgroundColor: bgColor,
            headline: template.headline ? headline : null,
            subheadline: template.subheadline ? subheadline : null,
        };
        cartItemId && removeItem(cartItemId);
        addItem(item);
        toast.success(`${template.name} added to cart!`);
        navigate("/explore");
    }

    return (
        <Card className="rounded-2xl border-muted-foreground/20">
            <CardContent className="space-y-6 flex flex-col h-full justify-between">
                <ScrollArea className="h-96">
                    <div className="space-y-4">
                        {template.headline && (
                            <div className="space-y-2">
                                <Label>Headline</Label>
                                <Input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Enter headline..." />
                            </div>
                        )}

                        {template.subheadline && (
                            <div className="space-y-2">
                                <Label>Subheadline</Label>
                                <Textarea value={subheadline} onChange={(e) => setSubheadline(e.target.value)} placeholder="Enter subheadline..." />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Tooltip>
                                <Label className="text-muted pb-2">Main Color</Label>
                                <TooltipTrigger>
                                    <div className="py-4 px-8 rounded-md" style={{ backgroundColor: project.main_color }} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Inherent to project
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        {/* Color Picker */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between py-2">
                                <Label>Background Color <span className="text-primary">{customBgColor && "*"}</span></Label>
                                {customBgColor && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleResetColor}
                                        className="text-xs"
                                    >
                                        Reset to project default
                                    </Button>
                                )}
                            </div>

                            <ColorPicker
                                value={bgColor}
                                onChange={handleColorChange}
                                className="max-w-sm rounded-md border border-muted-foreground/20 bg-card p-4 shadow-sm"
                            >
                                <ColorPickerSelection />

                                <div className="flex items-center gap-4">
                                    <div className="grid w-full gap-1">
                                        <ColorPickerHue />
                                    </div>
                                </div>
                            </ColorPicker>
                        </div>
                    </div>
                </ScrollArea>

                <Button onClick={handleAddToCart} className="w-full">Add to Cart</Button>
            </CardContent>
        </Card >
    )
}

export default Customizables;