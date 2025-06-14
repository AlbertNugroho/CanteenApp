import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AddMenu = () => {
  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [menuDescription, setMenuDescription] = useState("");
  const [addons, setAddons] = useState([{ name: "", price: "" }]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Add New Menu</Text>

        <TextInput
          placeholder="Enter name..."
          style={styles.input}
          value={menuName}
          onChangeText={setMenuName}
        />

        <TextInput
          placeholder="Enter price..."
          style={styles.input}
          value={menuPrice}
          onChangeText={setMenuPrice}
          keyboardType="numeric"
        />

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

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText}>Add Menu</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav Placeholder */}
      <View style={styles.bottomNav}>
        <Ionicons name="home" size={24} />
        <Ionicons name="document-text" size={24} />
        <Ionicons name="person" size={24} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 20,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
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
  addonRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  addButton: {
    alignSelf: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderRadius: 20,
    padding: 8,
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
  bottomNav: {
    height: 56,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
});

export default AddMenu;
