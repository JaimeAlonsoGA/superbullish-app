import { sidebarItems } from "@/assets/sidebar-items";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";

export default function Sidebar() {
    const location = useLocation();
    const { isConnected } = useAccount();

    return (
        <aside className="fixed left-0 top-16 bottom-0 w-64 flex flex-col shrink-0 pl-8 pr-4 py-6 bg-card rounded-r-lg overflow-auto">
            <nav className="space-y-2">
                {sidebarItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const isDisabled = item.requiresWallet && !isConnected;

                    const base = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group";
                    const active = "bg-primary text-white";
                    const disabled = "text-text-subtle cursor-not-allowed opacity-50";
                    const admin = "text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20";
                    const normal = "text-text-muted hover:text-text-primary hover:bg-dark-secondary/60";

                    return (
                        <Link
                            key={item.label}
                            to={isDisabled ? "#" : item.path}
                            onClick={(e) => isDisabled && e.preventDefault()}
                            aria-disabled={isDisabled}
                            className={cn(
                                base,
                                isActive ? active : isDisabled ? disabled : item.isAdmin ? admin : normal
                            )}
                        >
                            <item.icon className="text-current" size={20} />
                            <span className="font-medium truncate">{item.label}</span>

                            {item.isAdmin ? (
                                <span className="ml-auto w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                            ) : (
                                !isDisabled && (
                                    <ChevronRightIcon
                                        size={16}
                                        className={cn(
                                            "ml-auto transition-transform",
                                            isActive ? "rotate-90" : "group-hover:translate-x-1"
                                        )}
                                    />
                                )
                            )}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}