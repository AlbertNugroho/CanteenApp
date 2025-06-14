import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "@react-navigation/native";
import vendordetailstyle from "../../styles/vendordetailstyle";
import BASE_URL from "../../utils/config";
import homestyle from "@/styles/homestyle";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { router } from "expo-router";

const VendorHome = () => {
  const { colors } = useTheme();
  const [menus, setMenus] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [togglingId, setTogglingId] = useState(null); // for disabling button during toggle

  useFocusEffect(
    useCallback(() => {
      fetchMenus();
    }, [])
  );

  const fetchMenus = async () => {
    setLoadingMenus(true);
    try {
      const token = await SecureStore.getItemAsync("token");
      const userStr = await SecureStore.getItemAsync("user");

      if (!token || !userStr) return;

      const user = JSON.parse(userStr);
      const vendorId = user.id_tenant;

      const response = await fetch(
        `${BASE_URL}/api/menus/tenants/${vendorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) setMenus(data.data);
      else console.error(data.message);
    } catch (err) {
      console.error("Error fetching menus:", err);
    } finally {
      setLoadingMenus(false);
    }
  };

  const toggleAvailability = async (menuId, currentAvailability) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      setTogglingId(menuId);

      const newAvailability = currentAvailability === 1 ? 0 : 1;

      const response = await fetch(
        `${BASE_URL}/api/menus/${menuId}/availability`,
        {
          method: "PUT", // ← MATCHING your web code
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ availability: newAvailability }),
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchMenus(); // Refresh the list
      } else {
        Alert.alert("Error", data.message || "Failed to update availability.");
      }
    } catch (err) {
      console.error("Toggle error:", err);
      Alert.alert("Error", err.message);
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={homestyle.container}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: "Calibri",
            marginVertical: 16,
            marginHorizontal: 16,
          }}
        >
          Your Menu
        </Text>
        <TouchableOpacity
          style={{
            borderRadius: 360,
            backgroundColor: "#ECA219",
            position: "absolute",
            bottom: 20,
            right: 20,
            width: 50,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => router.push("../AddMenu")}
        >
          <Text
            style={{
              fontSize: 24,
              color: "white",
              textAlign: "center",
              fontFamily: "Calibri",
            }}
          >
            +
          </Text>
        </TouchableOpacity>
        {loadingMenus ? (
          <ActivityIndicator size="large" />
        ) : menus.length === 0 ? (
          <Text style={{ color: colors.text }}>
            You have not added any menu items yet.
          </Text>
        ) : (
          menus.map((menu) => {
            const isAvailable = menu.availability === 1;
            const statusText = isAvailable ? "Available" : "Out of Stock";
            const statusColor = isAvailable ? "green" : "red";
            const buttonLabel = isAvailable
              ? "Mark as Out of Stock"
              : "Mark as Available";
            const buttonColor = isAvailable ? "#E74C3C" : "#2ECC71";

            return (
              <View key={menu.id_menu} style={vendordetailstyle.menuItem}>
                <Image
                  source={
                    menu.gambar_menu && menu.gambar_menu.trim() !== ""
                      ? { uri: menu.gambar_menu }
                      : require("../../assets/images/Banner.png")
                  }
                  style={vendordetailstyle.image}
                />
                <View style={vendordetailstyle.info}>
                  <Text style={vendordetailstyle.name}>{menu.nama_menu}</Text>
                  <Text style={vendordetailstyle.price}>
                    Rp {parseFloat(menu.harga_menu).toLocaleString("id-ID")}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: statusColor,
                        fontFamily: "CalibriBold",
                      }}
                    >
                      {statusText}
                    </Text>

                    <TouchableOpacity
                      style={{
                        backgroundColor: buttonColor,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 6,
                      }}
                      disabled={togglingId === menu.id_menu}
                      onPress={() =>
                        toggleAvailability(menu.id_menu, menu.availability)
                      }
                    >
                      <Text
                        style={{
                          color: "white",
                          fontFamily: "Calibri",
                          fontSize: 12,
                        }}
                      >
                        {buttonLabel}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default VendorHome;
