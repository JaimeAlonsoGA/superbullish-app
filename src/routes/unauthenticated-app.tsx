import HomeLayout from "@/components/layout/home-layout";
import HomePage from "@/pages/home";
import { Navigate, Route, Routes } from "react-router-dom";

export const UnauthenticatedApp = () => {
    return (
        <Routes>
            <Route path="*" element={<Navigate to="/" replace />} />

            <Route path="/" element={<HomeLayout />}>
                <Route index element={<HomePage />} />
            </Route>
        </Routes>
    );
}