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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { useTheme, useFocusEffect } from "@react-navigation/native";
import vendordetailstyle from "../../styles/vendordetailstyle";
import homestyle from "@/styles/homestyle";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BASE_URL from "../../utils/config";
import { fetchMenuImage } from "../../utils/fetchimages";

const VendorHome = () => {
  const { colors } = useTheme();
  const [menus, setMenus] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [slotCapacity, setSlotCapacity] = useState("5");
  const [slotResponse, setSlotResponse] = useState("");
  const [menuImages, setMenuImages] = useState({});
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

      if (data.success) {
        const fetchedMenus = data.data;
        setMenus(fetchedMenus);

        // fetch menu image for each item
        const imageMap = {};
        for (const menu of fetchedMenus) {
          const img = await fetchMenuImage(menu.id_menu);
          imageMap[menu.id_menu] = img;
        }
        setMenuImages(imageMap);
      } else {
        console.error(data.message);
      }
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
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 120,
            paddingTop: 16,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Modal
            visible={modalVisible}
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.title}>Update Slot Capacity</Text>
                <Text style={styles.label}>Slot per Time:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={slotCapacity}
                  onChangeText={setSlotCapacity}
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSlotUpdate}
                  disabled={isUpdatingSlot}
                >
                  <Text style={styles.buttonText}>
                    {isUpdatingSlot ? "Updating..." : "Update"}
                  </Text>
                </TouchableOpacity>

                {slotResponse !== "" && (
                  <Text
                    style={{
                      marginTop: 10,
                      color: slotResponse.startsWith("Success")
                        ? "green"
                        : "red",
                    }}
                  >
                    {slotResponse}
                  </Text>
                )}
              </View>
            </View>
          </Modal>

          <Text
            style={{
              fontSize: 20,
              fontFamily: "Calibri",
              marginHorizontal: 16,
              marginBottom: 16,
            }}
          >
            Your Menu
          </Text>

          {loadingMenus ? (
            <ActivityIndicator size="large" />
          ) : menus.length === 0 ? (
            <Text
              style={{
                fontFamily: "CalibriBold",
                marginHorizontal: 16,
                alignSelf: "center",
                fontSize: 16,
                marginTop: 200,
              }}
            >
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
                    source={{
                      uri: menuImages[menu.id_menu],
                    }}
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

        {/* Floating Action Buttons (should be placed outside ScrollView) */}
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
            zIndex: 1,
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
            top: 10,
            right: 10,
            width: 50,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#eee",
          }}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    backgroundColor: "#ECA219",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
