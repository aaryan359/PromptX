import { toastConfig } from '@/configs/toast-config';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import type { RootState } from '@/redux/store';
import { store } from '@/redux/store';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { Provider, useSelector } from 'react-redux';

SplashScreen.preventAutoHideAsync();

function AppRouter() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useFrameworkReady();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      {isAuthenticated ? (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      )}
      <StatusBar style="light" />
      <Toast 
        config={toastConfig}
        position="top"
        visibilityTime={4000}
        autoHide={true}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </ClerkProvider>
  );
}