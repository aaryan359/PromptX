// components/AuthenticatedNavigation.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export function AuthenticatedNavigation() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>

    </>
  );
}


export function AuthNavigation() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}