import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const Hero = () => (
    <section className="flex min-h-screen max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row w-1/2">
            <div className="flex flex-col justify-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-left">
                    Videos for <span className="text-primary">Web3 projects</span>
                </h1>
                <p className="mt-4 text-base sm:text-lg md:text-xl text-muted leading-relaxed text-left">
                    Token launches, DeFi updates, partnerships and much more!
                </p>
                <div className="mt-6">
                    <Button asChild>
                        <Link to="/templates" className="inline-flex items-center gap-2">
                            <Play />
                            <span>Get Your Crypto Video</span>
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="absolute w-1/2 right-0 top-0 bottom-0 h-64 sm:h-96 lg:h-screen flex items-center">
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
