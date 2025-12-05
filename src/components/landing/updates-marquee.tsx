import React from "react";
import { Link } from "react-router-dom";
import {
    Marquee,
    MarqueeContent,
    MarqueeFade,
    MarqueeItem,
} from '@/components/ui/marquee';
import { useTemplates } from "@/queries/templates.queries";
const VideoUpdatesMarquee: React.FC = () => {
    const { data: videos, isLoading, isError } = useTemplates();

    // simple skeleton placeholders that match the size of the image container (w-full h-48)
    if (isLoading) {
        const placeholders = Array.from({ length: 6 });
        return (
            <section className="flex flex-col justify-center items-center" aria-label="Latest Web3 video updates">
                <h2 className="text-primary mb-6">
                    Latest Web3 <span className="text-foreground">Video Updates</span>
                </h2>
                <p className="text-muted mb-8">
                    Stay updated with our newest blockchain video templates and crypto marketing features
                </p>

                <Marquee>
                    <MarqueeFade side="left" />
                    <MarqueeFade side="right" />
                    <MarqueeContent pauseOnHover={false}>
                        {placeholders.map((_, i) => (
                            <MarqueeItem key={`skeleton-${i}`}>
                                <article className="w-80 flex flex-col mx-4">
                                    {/* image-size skeleton */}
                                    <div className="w-full h-48 bg-white/5 rounded-t-xl overflow-hidden animate-pulse" />
                                    {/* text skeletons */}
                                    <div className="mt-3 w-full text-center">
                                        <div className="h-4 bg-white/5 rounded w-3/4 mx-auto animate-pulse mb-2" />
                                        <div className="h-3 bg-white/5 rounded w-1/3 mx-auto animate-pulse" />
                                    </div>
                                </article>
                            </MarqueeItem>
                        ))}
                    </MarqueeContent>
                </Marquee>
            </section>
        );
    }

    // fallback error / empty handling
    if (isError || !videos || videos.length === 0) {
        return (
            <section className="flex flex-col justify-center items-center py-8">
                <h2 className="text-primary mb-6">
                    Latest Web3 <span className="text-foreground">Video Updates</span>
                </h2>
                <p className="text-muted">No videos available</p>
            </section>
        );
    }

    return (
        <section className="flex flex-col justify-center items-center" aria-label="Latest Web3 video updates">
            <h2 className="text-primary mb-6">
                Latest Web3 <span className="text-foreground">Video Updates</span>
            </h2>
            <p className="text-muted mb-8">
                Stay updated with our newest blockchain video templates and crypto marketing features
            </p>

            <Marquee>
                <MarqueeFade side="left" />
                <MarqueeFade side="right" />
                <MarqueeContent pauseOnHover={false}>
                    {videos.map(video => (
                        <MarqueeItem key={`first-${video.id}`}>
                            <article className="w-80 flex flex-col hover:scale-105 transform transition-all duration-300 mx-4">
                                <Link to={`/template/${video.id}`} className="block w-full">
                                    <div className="w-full h-48 overflow-hidden rounded-t-xl">
                                        <img
                                            src={video.thumbnail_url}
                                            alt={`${video.name} - Web3 video update`}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                </Link>

                                <div className="mt-3 w-full text-center">
                                    <h3 className="text-text-primary font-semibold text-sm sm:text-base lg:text-lg line-clamp-2">
                                        {video.name}
                                    </h3>
                                    {video.category && (
                                        <span className="mt-2 inline-block px-2 py-1 bg-dark-secondary/80 text-xs text-electric-blue-400 rounded-full">
                                            {video.category ?? ""}
                                        </span>
                                    )}
                                </div>
                            </article>
                        </MarqueeItem>
                    ))}
                </MarqueeContent>
            </Marquee>
        </section>
    );
};

export default VideoUpdatesMarquee;