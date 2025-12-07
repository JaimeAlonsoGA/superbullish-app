import React from "react";
import { Outlet } from "react-router-dom";
import { PageContent } from "./page-content";
import Header from "./header";
import Sidebar from "./sidebar";

const PageLayout = () => {
    return (
        <React.Fragment>
            <PageContent>
                <Header />
                {/* <Sidebar /> */}
                <main className="pt-16 h-screen overflow-auto">
                    <div className="px-8 mx-auto max-w-7xl py-8">
                        <Outlet />
                    </div>
                </main>
            </PageContent>
        </React.Fragment>
    );
};

export default PageLayout;