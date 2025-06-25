import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  buttonClickCount: number;
  incrementButtonClick: () => void;
  resetButtonCount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [buttonClickCount, setButtonClickCount] = useState(0);

  const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: 'your-google-client-id',
      scopes: ['openid', 'profile', 'email'],
      redirectUri: 'http://localhost:8081',
      prompt: AuthSession.Prompt.SelectAccount,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      fetchUserInfo(authentication?.accessToken);
    }
  }, [response]);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    const storedUser = await SecureStore.getItemAsync('user');
    const storedCount = await SecureStore.getItemAsync('buttonClickCount');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedCount) {
      setButtonClickCount(parseInt(storedCount));
    }
    setIsLoading(false);
  };

  const fetchUserInfo = async (token: string | undefined) => {
    if (!token) return;

    const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const userInfo = await response.json();
    
    const userData: User = {
      id: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture,
    };
    
    setUser(userData);
    await SecureStore.setItemAsync('user', JSON.stringify(userData));
  };

  const signIn = async () => {
    await promptAsync();
  };

  const signOut = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync('user');
  };

  const incrementButtonClick = async () => {
    const newCount = buttonClickCount + 1;
    setButtonClickCount(newCount);
    await SecureStore.setItemAsync('buttonClickCount', newCount.toString());
  };

  const resetButtonCount = async () => {
    setButtonClickCount(0);
    await SecureStore.setItemAsync('buttonClickCount', '0');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signOut,
    buttonClickCount,
    incrementButtonClick,
    resetButtonCount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}