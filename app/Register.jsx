import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import React, { useState } from "react";
import * as SecureStore from "expo-secure-store";
import binuslogo from "../styles/binuslogo";
import login from "../styles/login";
import BASE_URL from "../utils/config";
import DropDownPicker from "react-native-dropdown-picker";

const Register = () => {
  const router = useRouter();

  const [userType, setUserType] = useState("customer");
  const [name, setName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Customer", value: "customer" },
    { label: "Vendor", value: "seller" },
  ]);

  const [loaded, error] = useFonts({
    Abel: require("../assets/fonts/Abel Regular.ttf"),
    Calibri: require("../assets/fonts/Calibri.ttf"),
    LilitaOne: require("../assets/fonts/Lilita One.ttf"),
    CalibriBold: require("../assets/fonts/Calibri Bold.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins Medium.ttf"),
    Karatina: require("../assets/fonts/Karatina.ttf"),
  });

  if (!loaded || error) return null;

  const handleRegister = async () => {
    const data = { name, email, password };
    const user = data.data.user;
    if (userType === "seller") data.storeName = storeName;

    try {
      const response = await fetch(
        `${BASE_URL}/api/auth/register/${userType}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (response.ok && result.success) {
        await SecureStore.setItemAsync("token", String(result.data.token));
        await SecureStore.setItemAsync("user", JSON.stringify(user));
        setMessage("Registration successful!");

        if (userType === "seller") {
          router.push("/(vendorside)/VendorHome");
        } else {
          router.push("/(tabs)/Home");
        }
      } else {
        setMessage("Registration failed: " + result.message);
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={login.container}>
          <Text style={[binuslogo.binus, login.binuscanteenlogo]}>
            BINUS<Text style={binuslogo.canteen}>CANTEEN</Text>
          </Text>

          <View style={login.formContainer}>
            <Text style={login.label}>User Type</Text>
            <DropDownPicker
              open={open}
              value={userType}
              items={items}
              setOpen={setOpen}
              setValue={setUserType}
              setItems={setItems}
              style={{
                fontFamily: "Calibri",
                height: 45,
                borderColor: "#ffffff",
                borderRadius: 8,
              }}
              textStyle={{ fontFamily: "Calibri", fontSize: 14, color: "#000" }}
              dropDownContainerStyle={{
                fontFamily: "Calibri",
                borderColor: "#ffffff",
                borderRadius: 8,
              }}
              showTickIcon={false}
              containerStyle={{ marginBottom: 16 }}
            />

            <Text style={login.label}>Name</Text>
            <TextInput
              style={login.input}
              placeholder="Enter your name"
              value={name}
              placeholderTextColor="#999"
              onChangeText={setName}
            />

            {userType === "seller" && (
              <>
                <Text style={login.label}>Store Name</Text>
                <TextInput
                  style={login.input}
                  placeholder="Enter your store name"
                  value={storeName}
                  placeholderTextColor="#999"
                  onChangeText={setStoreName}
                />
              </>
            )}

            <Text style={login.label}>Email</Text>
            <TextInput
              style={login.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={login.label}>Password</Text>
            <TextInput
              style={login.input}
              placeholder="Enter your password"
              autoCapitalize="none"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={[login.button, { marginBottom: "20%" }]}
              onPress={handleRegister}
            >
              <Text style={login.buttontext}>Register</Text>
            </TouchableOpacity>

            {message !== "" && <Text style={login.message}>{message}</Text>}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;
