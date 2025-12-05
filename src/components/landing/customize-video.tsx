import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const CustomizeVideo = () => {
    return (
        <section aria-label="Web3 video customization features">
            <div className="mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Customize Your Web3 Videos
                </h2>
                <p className="text-muted mb-8">
                    Upload your crypto project logo, set brand colors, and customize headlines for your blockchain marketing
                    campaigns
                </p>
            </div>

            <div className="mx-auto">
                <div className="bg-dark-secondary/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden mb-6 sm:mb-8">
                    <div className="relative w-full aspect-video">
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                            aria-label="Super Bullish video examples"
                        >
                            <source
                                src="https://superbullish.s3.eu-west-2.amazonaws.com/indexsuperbullish/superbullish_examples.mp4"
                                type="video/mp4"
                            />
                            <track kind="captions" />
                        </video>
                    </div>
                </div>

                <Button asChild variant="link" className="text-xl">
                    <Link
                        to="/templates"
                        aria-label="Explore Web3 video templates"
                    >
                        <span>Explore Templates</span>
                    </Link>
                </Button>
            </div>
        </section>
    )
}

export default CustomizeVideo;