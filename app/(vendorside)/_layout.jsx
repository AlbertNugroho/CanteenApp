import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ECA219",
        tabBarInactiveTintColor: "#000000",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {
            height: 60,
            backgroundColor: "#ffffff",
          },
        }),
        tabBarIconStyle: {
          alignSelf: "center",
          justifyContent: "center",
          height: "100%",
        },
      }}
    >
      <Tabs.Screen
        name="VendorHome"
        options={{
          title: "Vendor Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="file-clock" color={color} />
          ),
          headerShown: true,
          headerStyle: {
            height: 100,
            borderBottomWidth: 2,
            backgroundColor: "#ffffff", // your desired header background color
          },
          headerTitleStyle: {
            fontFamily: "Calibri",
          },
          headerTintColor: "#000000",
        }}
      />

      <Tabs.Screen
        name="VendorActivity"
        options={{
          title: "Vendor Activity",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="file-clock" color={color} />
          ),
          headerShown: true,
          headerStyle: {
            height: 100,
            borderBottomWidth: 2,
            backgroundColor: "#ffffff", // your desired header background color
          },
          headerTitleStyle: {
            fontFamily: "Calibri",
          },
          headerTintColor: "#000000",
        }}
      />

      <Tabs.Screen
        name="VendorAccount"
        options={{
          title: "Vendor Account",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={28} name="user-large" color={color} />
          ),
          headerShown: true,
          headerStyle: {
            height: 100,
            borderBottomWidth: 2,
            backgroundColor: "#ffffff", // your desired header background color
          },
          headerTitleStyle: {
            fontFamily: "Calibri",
          },
          headerTintColor: "#000000",
        }}
      />
    </Tabs>
  );
}
