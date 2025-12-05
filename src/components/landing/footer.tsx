import { MessageCircle, X, Zap } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-dark-secondary/60 backdrop-blur-md border-t border-white/5 mt-12 sm:mt-16 lg:mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-2 text-center md:text-left">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-electric-blue-400" />
                        <span className="text-xs sm:text-sm text-text-muted">
                            © 2025 Super Bullish Web3 Video Agency. All rights reserved.
                        </span>
                    </div>
                    <div className="flex space-x-4 sm:space-x-6">
                        <a
                            href="https://twitter.com/superbullish_"
                            className="text-text-subtle hover:text-electric-blue-400 transition-colors"
                            aria-label="Super Bullish Twitter"
                        >
                            <X size={18} className="sm:w-5 sm:h-5" />
                        </a>
                        <a
                            href="https://discord.gg/superbullish"
                            className="text-text-subtle hover:text-electric-blue-500 transition-colors"
                            aria-label="Super Bullish Discord"
                        >
                            <MessageCircle size={18} className="sm:w-5 sm:h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;