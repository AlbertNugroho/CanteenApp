import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import BASE_URL from "../utils/config"; // Make sure this points to your API base
import { router } from "expo-router";

const AddMenu = () => {
  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [menuDescription, setMenuDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!menuName || !menuPrice) {
      Alert.alert("Validation Error", "Menu name and price are required.");
      return;
    }

    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        Alert.alert("Session Expired", "Please log in again.");
        return;
      }

      const menuData = {
        name: menuName,
        description: menuDescription,
        price: parseFloat(menuPrice),
      };

      const response = await fetch(`${BASE_URL}/api/menus/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(menuData),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/(vendorside)/VendorHome"); // Navigate to VendorHome on success
        // Clear the form
        setMenuName("");
        setMenuPrice("");
        setMenuDescription("");
        // You can also navigate back or refresh menus
      } else {
        Alert.alert("Error", result.message || "Failed to add menu.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Menu Name</Text>
        <TextInput
          placeholder="Enter name..."
          style={styles.input}
          value={menuName}
          onChangeText={setMenuName}
        />

        <Text style={styles.label}>Menu Price</Text>
        <TextInput
          placeholder="Enter price..."
          style={styles.input}
          value={menuPrice}
          onChangeText={setMenuPrice}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Menu Description</Text>
        <TextInput
          placeholder="Enter description..."
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          multiline
          value={menuDescription}
          onChangeText={setMenuDescription}
        />

        <Text style={styles.label}>Menu Image</Text>
        <TouchableOpacity style={styles.imagePicker}>
          <Ionicons name="add" size={32} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading ? "Submitting..." : "Add Menu"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: "#ffffff",
  },
  label: {
    fontFamily: "CalibriBold",
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  imagePicker: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AddMenu;
