import { Stack } from 'expo-router';

export function AuthenticatedNavigation() {
  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
  );
}


export function AuthNavigation() {
  return (

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
      </Stack>
   

  );
}