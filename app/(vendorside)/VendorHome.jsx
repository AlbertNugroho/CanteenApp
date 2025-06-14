import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { useTheme, useFocusEffect } from "@react-navigation/native";
import vendordetailstyle from "../../styles/vendordetailstyle";
import homestyle from "@/styles/homestyle";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BASE_URL from "../../utils/config";

const VendorHome = () => {
  const { colors } = useTheme();
  const [menus, setMenus] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [slotCapacity, setSlotCapacity] = useState("5");
  const [slotResponse, setSlotResponse] = useState("");
  const [isUpdatingSlot, setIsUpdatingSlot] = useState(false);
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
          headers: { Authorization: `Bearer ${token}` },
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

  useFocusEffect(
    useCallback(() => {
      fetchMenus();
    }, [])
  );

  useEffect(() => {
    if (modalVisible) {
      (async () => {
        const userStr = await SecureStore.getItemAsync("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          setSlotCapacity((user.slot_per_time || 0).toString());
        }
      })();
    }
  }, [modalVisible]);

  const handleSlotUpdate = async () => {
    setIsUpdatingSlot(true);
    setSlotResponse("");

    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        setSlotResponse("Session expired. Please log in again.");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/tenants/slot-capacity`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slotPerTime: parseInt(slotCapacity, 10) }),
      });

      const result = await response.json();

      if (result.success) {
        const userStr = await SecureStore.getItemAsync("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          user.slot_per_time = parseInt(slotCapacity, 10);
          await SecureStore.setItemAsync("user", JSON.stringify(user));
        }

        setSlotResponse("Success: Slot capacity updated.");
        setModalVisible(false);
      } else {
        setSlotResponse("Failed: " + (result.message || "Failed to update."));
      }
    } catch (error) {
      setSlotResponse("Error: " + error.message);
    } finally {
      setIsUpdatingSlot(false);
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
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ availability: newAvailability }),
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchMenus();
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

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSlotResponse("");
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>Set Slot Capacity</Text>
            <Text style={styles.label}>Orders per Timeslot:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={slotCapacity}
              onChangeText={setSlotCapacity}
            />

            {slotResponse !== "" && (
              <Text
                style={{
                  fontSize: 12,
                  color: slotResponse.includes("Success") ? "green" : "red",
                  marginBottom: 10,
                }}
              >
                {slotResponse}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.button, { opacity: isUpdatingSlot ? 0.5 : 1 }]}
              disabled={isUpdatingSlot}
              onPress={handleSlotUpdate}
            >
              <Text style={styles.buttonText}>Update Capacity</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

        <TouchableOpacity
          style={{
            borderRadius: 360,
            position: "absolute",
            top: 5,
            right: 10,
            width: 50,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="settings-outline" size={24} color="black" />
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
                      style={{ color: statusColor, fontFamily: "CalibriBold" }}
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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "stretch",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
