import React from "react";
import { Outlet } from "react-router-dom";
import { PageContent } from "./page-content";
import Header from "./header";
import Sidebar from "./sidebar";
import { BackButton } from "./back-button";

const ChildPageLayout = () => {
    return (
        <React.Fragment>
            <PageContent>
                <Header />
                <Sidebar />
                <main className="md:pl-64 h-screen overflow-auto">
                    <div className="pt-24 pb-6 px-8 mx-auto max-w-7xl space-y-4">
                        <BackButton />
                        <Outlet />
                    </div>
                </main>
            </PageContent>
        </React.Fragment>
    );
};

export default ChildPageLayout;