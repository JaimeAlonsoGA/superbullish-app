import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const Hero = () => (
    <section className="relative min-h-screen w-full overflow-hidden">
        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
            <div className="w-full lg:w-1/2 py-16 lg:py-0">
                <div className="space-y-6 sm:space-y-8">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                        Videos for <span className="text-primary">Web3 projects</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                        Token launches, DeFi updates, partnerships and much more!
                    </p>
                    <div className="pt-2">
                        <Button asChild size="lg" className="text-base sm:text-lg">
                            <Link to="/explore" className="inline-flex items-center gap-2">
                                <Play className="w-5 h-5" />
                                <span>Get Your Crypto Video</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        {/* Video Background */}
        <div className="absolute inset-0 lg:left-1/2 w-full lg:w-1/2">
            <div className="relative w-full h-full">
                {/* Gradient overlay for mobile readability */}
                <div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-transparent lg:from-background/50" />

                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    poster="https://superbullish.s3.eu-west-2.amazonaws.com/indexsuperbullish/bannersuperbullishposter.jpg"
                >
                    <source
                        src="https://superbullish.s3.eu-west-2.amazonaws.com/indexsuperbullish/bannersuperbullishvideo.mp4"
                        type="video/mp4"
                    />
                    <track kind="captions" />
                </video>
            </div>
        </div>
    </section>
);

export default Hero;