import React from "react";
import { Outlet } from "react-router-dom";
import { PageContent } from "./page-content";
import Header from "./header";
import Hero from "../landing/hero";
import VideoUpdatesMarquee from "../landing/updates-marquee";
import Footer from "../landing/footer";

const HomeLayout = () => {
    return (
        <React.Fragment>
            <PageContent>
                <Header />
                <div className="space-y-40">
                    <Hero />
                    <VideoUpdatesMarquee />
                    <div className="space-y-20 px-8 mx-auto">
                        <Outlet />
                    </div>
                </div>
                <Footer />
            </PageContent>
        </React.Fragment>
    );
};

export default HomeLayout;