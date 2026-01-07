/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
  } from "react";
  import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
  
  interface AuthContextType {
    userId: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (access: string, refresh: string) => void;
    logout: () => void;
  }
  
  const AuthContext = createContext<AuthContextType>({} as AuthContextType);
  
  export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
  
    // 🔁 Restore session on refresh
    useEffect(() => {
      const access = localStorage.getItem("access_token");
      const refresh = localStorage.getItem("refresh_token");
  
      if (access && refresh) {
        hydrateAuth(access, refresh);
      }
      setIsLoading(false);
    }, []);
  
    const hydrateAuth = (access: string, refresh: string) => {
      try {
        const decoded: any = jwtDecode(access);
        setUserId(decoded.user_id || decoded.id);
        setAccessToken(access);
        setRefreshToken(refresh);
      } catch {
        logout();
      }
    };
  
    const login = (access: string, refresh: string) => {
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      hydrateAuth(access, refresh);
    };
  
    const logout = () => {
      localStorage.clear();
      setAccessToken(null);
      setRefreshToken(null);
      setUserId(null);
      navigate("/login");
    };
  
    return (
      <AuthContext.Provider
        value={{
          userId,
          accessToken,
          refreshToken,
          isAuthenticated: !!accessToken,
          isLoading,
          login,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => useContext(AuthContext);



