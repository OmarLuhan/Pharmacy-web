import React, { useEffect, useState, useCallback } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { refreshAuthToken } from "../../services/auth";
import { toast } from "sonner";

const PrivateRoute = ({ children, redirectTo = "/" }) => {
  const navigate = useNavigate();
  const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);

  const handleRefreshToken = async () => {
    try {
      const { isSuccess, token, tokenRefresh } = await refreshAuthToken();
      if (!isSuccess) {
        throw new Error("Error al actualizar la sesión");
      }
      localStorage.setItem("token", token);
      localStorage.setItem("tokenRefresh", tokenRefresh);
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenRefresh");
      toast.error(`${error}`);
      navigate(redirectTo);
    } finally {
      setIsTokenRefreshing(false);
    }
  };

  const checkTokenExpiration = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const decodedToken = jwtDecode(token);
      const currentTimeUTC = Math.floor(Date.now() / 1000);
      const willExpireSoon = decodedToken.exp - currentTimeUTC <= 300;

      if (willExpireSoon && !isTokenRefreshing) {
        setIsTokenRefreshing(true);
        await handleRefreshToken();
        return true;
      }
      return decodedToken.exp > currentTimeUTC;
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenRefresh");
      return false;
    }
  }, [isTokenRefreshing, navigate, redirectTo]);

  useEffect(() => {
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  const isTokenValid = checkTokenExpiration();

  if (!isTokenValid) {
    return <Navigate to={redirectTo} />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoute;
