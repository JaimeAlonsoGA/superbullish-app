import ChildPageLayout from "@/components/layout/child-page-layout";
import PageLayout from "@/components/layout/authenticated-page-layout";
import CartCheckoutPage from "@/pages/checkout";
import ProjectPage from "@/pages/project";
import DashboardPage from "@/pages/dashboard";
import ExplorePage from "@/pages/explore";
import TemplatePage from "@/pages/template";
import { Navigate, Route, Routes } from "react-router-dom";
import CustomizePage from "@/pages/customize";
import SelectedProjectPage from "@/pages/select-project";

const AuthenticatedApp = () => {
    return (
        <Routes>
            <Route path="*" element={<Navigate to="/explore" replace />} />

            <Route path="/dashboard" element={<PageLayout />}>
                <Route index element={<DashboardPage />} />
            </Route>

            <Route path="/explore" element={<PageLayout />}>
                <Route index element={<ExplorePage />} />
            </Route>

            <Route path="/project/:id" element={<ChildPageLayout />}>
                <Route index element={<ProjectPage />} />
            </Route>

            <Route path="/template/:id" element={<ChildPageLayout />}>
                <Route index element={<TemplatePage />} />
                <Route path="customize" element={<CustomizePage />} />
            </Route>

            <Route path="/template/:id" element={<PageLayout />}>
                <Route path="select-project" element={<SelectedProjectPage />} />
            </Route>

            <Route path="/checkout" element={<PageLayout />}>
                <Route index element={<CartCheckoutPage />} />
            </Route>
        </Routes >
    );
}

export default AuthenticatedApp;