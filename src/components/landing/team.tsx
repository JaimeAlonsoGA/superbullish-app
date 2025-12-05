import { X } from "lucide-react";
import { Card } from "../ui/card";

const Team = () => {
    return (
        <section className="py-12 sm:py-16 lg:py-20" aria-label="Super Bullish team">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-4">The Web3 Video Team</h2>
                </div>

                <Card className="max-w-sm mx-auto">
                    <div className="text-center">
                        <img
                            src="https://s3.amazonaws.com/appforest_uf/f1662399175671x728853439199001900/941104eXF37vCG.jpg"
                            alt="Hexxer - Founder of Super Bullish"
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 sm:mb-6 object-cover shadow-lg"
                        />
                        <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-2">Hessyz</h3>
                        <p className="text-sm sm:text-base text-text-muted mb-4">Founder & Web3 Video Director</p>
                        <a
                            href="https://x.com/hessyz_"
                            className="inline-flex items-center space-x-1 text-electric-blue-400 hover:text-electric-blue-300 transition-colors text-sm sm:text-base"
                            aria-label="Follow Hexxer on Twitter"
                        >
                            <X size={14} className="sm:w-4 sm:h-4" />
                            <span>@hessyz</span>
                        </a>
                    </div>
                </Card>
            </div>
        </section>
    )
}

export default Team;