import { AuthenticatedNavigation, AuthNavigation } from '@/components/Navigation';
import { toastConfig } from '@/configs/toast-config';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { checkAuth } from '@/redux/slices/authSlice';
import { store } from '@/redux/store';
import { configureGoogleSignIn } from '@/utils/GoogleSiginIn';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

SplashScreen.preventAutoHideAsync();

function AppContent() {

  useFrameworkReady();

  const dispatch = useAppDispatch();
   let { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    configureGoogleSignIn();
    dispatch(checkAuth()),
    setTimeout(()=>{
      
    },500)
  }, [dispatch]);

  

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });
  
console.log("is authenicated",isAuthenticated)

  

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (loading) {
    return null; 
  }

  return (
    <>
      {isAuthenticated ? <AuthenticatedNavigation /> : <AuthNavigation />}
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
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}