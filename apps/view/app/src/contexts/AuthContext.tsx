import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import API from '../api/frontendAPI';

interface User {
  _id: string;
  id: string;
  card: {
    grade: 'bronze' | 'silver' | 'gold';
    sequence: number;
    color1: number;
    color2: number;
    color3: number;
  };
}

interface AuthContextType {
  user: User | null;
  login: (id: string, password: string) => Promise<void>;
  register: (id: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (updatedUser: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (API.tokenValidity()) {
        try {
          const response = await API.getUser();
          if (response.success) {
            setUser(response.data);
          }
        } catch (error) {
          console.error('Failed to get user data:', error);
          API.logout();
        }
      }
    };
    checkAuth();
  }, []);

  const login = async (id: string, password: string) => {
    try {
      const response = await API.login(id, password);
      if (response.success) {
        setUser(response.data);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (id: string, password: string) => {
    try {
      const response = await API.register(id, password);
      if (response.success) {
        // 회원가입 후 자동 로그인
        await login(id, password);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    API.logout();
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const refreshUser = async () => {
    if (API.tokenValidity()) {
      try {
        const response = await API.getUser();
        if (response.success) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 