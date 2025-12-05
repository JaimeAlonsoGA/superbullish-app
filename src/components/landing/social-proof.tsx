import { MessageCircle, X, Building2, Star } from "lucide-react";

const testimonials = [
    {
        company: "MetaChain Labs",
        quote:
            "Super Bullish has been an incredible partner in showcasing our Web3 vision. Their content quality is unmatched.",
        logo: <Building2 className="w-6 h-6 text-primary" />,
        author: "Evelyn Chen, Head of Marketing",
    },
    {
        company: "Nova Finance",
        quote:
            "We’ve seen 3x higher engagement since featuring our project in their videos. Authentic and professional team!",
        logo: <Building2 className="w-6 h-6 text-secondary" />,
        author: "Alex Carter, Co-founder",
    },
    {
        company: "Orbit Protocol",
        quote:
            "Their storytelling around blockchain innovation is next level. A must-follow Web3 media powerhouse.",
        logo: <Building2 className="w-6 h-6 text-accent" />,
        author: "Rina Park, Community Lead",
    },
];

const SocialProof = () => {
    return (
        <section className="mx-auto flex flex-col items-center" aria-labelledby="social-proof-heading">
            <div className="text-center mb-12">
                <h2
                    id="social-proof-heading"
                    className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
                >
                    Trusted by Leading Web3 Innovators
                </h2>
                <p className="text-muted-foreground mx-auto">
                    See what our partners and creators are saying about working with
                    <span className="text-primary font-medium"> Super Bullish</span>.
                </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full">
                {testimonials.map((t, i) => (
                    <div
                        key={i}
                        className="bg-card border border-border rounded-2xl p-6 shadow-elevated hover:shadow-glow-primary transition-shadow"
                    >
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                                {t.logo}
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground text-sm">
                                    {t.company}
                                </h3>
                                <div className="flex text-primary">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-primary" />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-muted-foreground italic mb-3">“{t.quote}”</p>
                        <p className="text-sm text-subtle">{t.author}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col items-center mt-16">
                <h3 className="text-xl font-bold text-foreground mb-6 sm:mb-8">
                    Join Our Web3 Community
                </h3>
                <div className="flex justify-center space-x-8">
                    <a
                        href="https://twitter.com/superbullish_"
                        className="flex flex-col items-center space-y-2 group"
                        aria-label="Follow Super Bullish on Twitter for Web3 video updates"
                    >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-linear-to-r from-gray-200 to-zinc-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-electric-glow">
                            <X className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <span className="text-sm sm:text-base text-muted group-hover:text-primary transition-colors">
                            X
                        </span>
                    </a>
                    <a
                        href="https://discord.gg/superbullish"
                        className="flex flex-col items-center space-y-2 group"
                        aria-label="Join Super Bullish Discord for Web3 video community"
                    >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <span className="text-sm sm:text-base text-text-muted group-hover:text-text-primary transition-colors">
                            Discord
                        </span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
