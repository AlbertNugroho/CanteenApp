import React from "react";
import { View } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { Text } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Register" options={{ headerShown: false }} />
        <Stack.Screen name="VendorDetails" options={{ headerShown: false }} />
        <Stack.Screen name="paymentsuccess" options={{ headerShown: false }} />
        <Stack.Screen
          name="OrderSummary"
          options={{
            header: (props) => (
              <View
                style={{
                  height: 100,
                  backgroundColor: "white",
                  borderBottomColor: "#000000",
                  borderBottomWidth: 2,
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                  padding: 16, // optional padding
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "Calibri",
                  }}
                >
                  Order Summary
                </Text>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="Payment"
          options={{
            header: (props) => (
              <View
                style={{
                  height: 100,
                  backgroundColor: "white",
                  borderBottomColor: "#000000",
                  borderBottomWidth: 2,
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                  padding: 16, // optional padding
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "Calibri",
                  }}
                >
                  Payment
                </Text>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="OrderOngoing"
          options={{
            header: (props) => (
              <View
                style={{
                  height: 100,
                  backgroundColor: "white",
                  borderBottomColor: "#000000",
                  borderBottomWidth: 2,
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                  padding: 16, // optional padding
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "Calibri",
                  }}
                >
                  Order Summary
                </Text>
              </View>
            ),
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
