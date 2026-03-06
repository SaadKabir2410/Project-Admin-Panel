import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";

export default function AuthCallback() {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.isLoading && !auth.error) {
            navigate('/', { replace: true })
        }
    }, [auth.isLoading, auth.error]);
    if (auth.error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">Auth error: {auth.error.message}</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-gray-500">Signing in...</p>
        </div>
    );
}
