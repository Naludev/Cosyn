import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack, router, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColors } from "@/hooks/useColors";
import { readStored } from "@/lib/storage";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
const LOGIN_KEY = "cosyn-mobile-logged-in";

function RootLayoutNav() {
  const colors = useColors();
  const pathname = usePathname();
  const [checkingLogin, setCheckingLogin] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = await readStored(LOGIN_KEY, false);

      if (!loggedIn && pathname !== "/login") {
        router.replace("/login");
      }

      if (loggedIn && pathname === "/login") {
        router.replace("/(tabs)");
      }

      setCheckingLogin(false);
    };

    checkLogin();
  }, [pathname]);

  if (checkingLogin) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
          headerBackTitle: "Back",
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />

        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="event/[id]"
          options={{ presentation: "card" }}
        />

        <Stack.Screen
          name="chat/[id]"
          options={{ presentation: "card" }}
        />

        <Stack.Screen
          name="edit-profile"
          options={{ presentation: "card" }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
