import { useGymStore } from '@/store/useGymStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { StatusBar } from 'expo-status-bar';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { userProfile } = useGymStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // If no user profile, redirect to onboarding
    // Check if we are already in onboarding to avoid loops
    const inOnboarding = segments[0] === 'onboarding';

    // Simple protection: wait for hydration (userProfile might be null initially before MMKV loads? 
    // Zustand persist with MMKV is usually synchronous, but good to be careful.
    // However, if it's null, we assume new user.)

    if (!userProfile && !inOnboarding) {
      // Redirect to onboarding
      // Use timeout to allow navigation mount
      setTimeout(() => {
        router.replace('/onboarding');
      }, 100);
    } else if (userProfile && inOnboarding) {
      // If we have a profile but are in onboarding, go to tabs
      router.replace('/index');
    }
  }, [userProfile, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="active-mode" options={{ headerShown: false }} />
        <Stack.Screen
          name="edit-workout"
          options={{
            headerShown: false,
            presentation: 'card'
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
