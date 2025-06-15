import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import BASE_URL from "../utils/config";
import { router } from "expo-router";

const AddMenu = () => {
  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [menuDescription, setMenuDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "You need to allow access to gallery."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (menuId) => {
    const uriParts = image.split(".");
    const fileType = uriParts[uriParts.length - 1];

    const formData = new FormData();
    formData.append("image", {
      uri: image,
      name: `menu-${menuId}.${fileType}`,
      type: `image/${fileType}`,
    });

    const token = await SecureStore.getItemAsync("token");

    const response = await fetch(`${BASE_URL}/api/images/upload/${menuId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    const result = await response.json();
    console.log("Menu Add Response:", result);
    if (!result.success) {
      throw new Error(result.message || "Failed to upload image.");
    }
    return result;
  };

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
      console.log("Menu Add Response:", result);

      if (result.success) {
        if (image && result.data?.id_menu) {
          await uploadImage(result.data.id_menu);
        }

        router.push("/(vendorside)/VendorHome");

        setMenuName("");
        setMenuPrice("");
        setMenuDescription("");
        setImage(null);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <Ionicons name="add" size={32} color="#999" />
          )}
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: "#ffffff",
    flexGrow: 1,
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
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
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
