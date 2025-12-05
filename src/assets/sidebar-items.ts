import { Home, Search } from "lucide-react";

type SidebarItem = {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string; size?: number }>;
    requiresWallet?: boolean;
    isAdmin?: boolean;
};

export const sidebarItems: SidebarItem[] = [
    {
        icon: Home,
        label: 'My Dashboard',
        path: '/dashboard',
        requiresWallet: true,
    },
    {
        icon: Search,
        label: 'Explore',
        path: '/explore'
    }
];