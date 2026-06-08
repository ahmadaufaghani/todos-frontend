import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "./auth";

const ProtectedRoute = ({children}: {children : React.ReactNode}) => {
    const location = useLocation();
    const {isLoggedIn} = useAuth();

    if(isLoggedIn()) {
        return <>{children}</>;
    }
    return <Navigate to="/login" state={{from: location}} replace/>

}

export default ProtectedRoute;