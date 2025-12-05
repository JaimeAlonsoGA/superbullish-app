import { useCart } from "@/providers/cart-provider";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import CartSheet from "../cart/cart-sheet";
import { useAuth } from "@/providers/auth-provider";

const Header = () => {
    const { isAuthenticated } = useAuth();
    return (
        <div className="border-b border-muted-foreground/20 fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md py-4">
            <div className="flex flex-row items-center px-8 mx-auto justify-between">
                <div className="flex flex-row items-center gap-3">
                    <img
                        src="https://b57d70dbdb37c643b0cb9d5165a92559.cdn.bubble.io/f1751236313318x764326871421802500/Super_bullish_Logo_white_small50_PNG.png"
                        alt="Super Bullish Logo"
                        className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                    />
                    <h1 className="hidden md:block text-xl font-bold">Super Bullish</h1>
                </div>
                <div className="flex flex-row items-center gap-3">
                    {isAuthenticated && <CartSheet />}
                    <ConnectWalletButton />
                </div>
            </div>
        </div>
    )
}

const ConnectWalletButton = () => {
    return (
        <ConnectButton label="Sign In" showBalance={false} accountStatus="avatar" />
    )
}

export default Header;