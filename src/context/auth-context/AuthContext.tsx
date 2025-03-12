import { createContext, useContext, useEffect, useState } from "react";
import {
  getAuthToken,
  getRefreshToken,
  setAuthToken,
  setRefreshToken,
  removeAuthToken,
  removeRefreshToken,
} from "../../services/cookie-service/CookieService";
import AxiosService from "../../services/axios-service/AxiosService";
import { GlobalService } from "../../services/global-service/GlobalService";

interface AuthContextProps {
  token: string | null;
  isValidToken: boolean | null;
  Login: (token: string, refreshToken: string) => void;
  Logout: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const axios = new AxiosService();

  useEffect(() => {
    const validateToken = async () => {
      const storedToken = getAuthToken();
      if (storedToken) {
        try {
          const response = await axios.postRequest("/validate-token", {
            authToken: storedToken,
          });
          if (response.state === 1) {
            GlobalService.userInfo.next(response?.userInfo);
            setToken(storedToken);
            setIsValidToken(true);
          } else {
            setIsValidToken(false);
            Logout();
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          setIsValidToken(false);
          Logout();
        }
      } else {
        setIsValidToken(false);
      }
    };

    validateToken();
  }, []);

  // Silent refresh logic to handle token expiry
  useEffect(() => {
    const silentRefresh = async () => {
      const storedRefreshToken = getRefreshToken();
      if (storedRefreshToken) {
        try {
          const response = await axios.postRequest("validate/refresh-token", {
            refreshToken: storedRefreshToken,
          });
          const newAuthToken = response.data.authToken;
          setToken(newAuthToken);
          setAuthToken(newAuthToken);
          setIsValidToken(true);
        } catch (error) {
          console.error("Failed to refresh token:", error);
          Logout();
        }
      }
    };

    const tokenExpiryTime = 60 * 60 * 1000;
    const refreshTimer = setInterval(silentRefresh, tokenExpiryTime - 60000);

    return () => clearInterval(refreshTimer);
  }, []);

  const Login = (newToken: string, newRefreshToken: string) => {
    setToken(newToken);
    setIsValidToken(true);
    setAuthToken(newToken);
    setRefreshToken(newRefreshToken);
  };

  const Logout = () => {
    setToken(null);
    setIsValidToken(false);
    removeAuthToken();
    removeRefreshToken();
    GlobalService.userInfo.next(false);
  };

  return (
    <AuthContext.Provider value={{ token, isValidToken, Login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
