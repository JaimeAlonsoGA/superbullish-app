import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import type { Project } from "@/types";
import { CartItem } from "@/types/composites";
import { useCurrentUser } from "@/queries/auth.queries";

type CartContextValue = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    getSummary: () => {
        count: number;
        totalUsd: number;
    };
    selectedProject: Project | null;
    setSelectedProject: (project: Project | null) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const user = useCurrentUser().data;

    useEffect(() => {
        if (!selectedProject && user?.projects) {
            setSelectedProject(user?.projects[0])
        }
    }, [selectedProject, user?.projects])

    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        try {
            setItems(JSON.parse(raw));
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = (item: CartItem) => {
        setItems((prev) => [...prev, item]);
    };

    const removeItem = (id: string) => {
        setItems((prev) => {
            const index = prev.findIndex((t) => t.id === id);
            if (index === -1) return prev;
            const copy = [...prev];
            copy.splice(index, 1);
            return copy;
        });
    };

    const clearCart = () => setItems([]);

    const getSummary = () => {
        const count = items.length;
        const totalUsd = items.reduce((sum, t) => sum + t.template.price, 0);
        return { count, totalUsd };
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                clearCart,
                getSummary,
                selectedProject,
                setSelectedProject,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error("useCart must be used inside <CartProvider />");
    }
    return ctx;
}
