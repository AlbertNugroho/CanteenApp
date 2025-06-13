import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import React, { useState } from "react";
import * as SecureStore from "expo-secure-store";
import binuslogo from "../styles/binuslogo";
import login from "../styles/login";
import BASE_URL from "../utils/config";

const Register = () => {
  const router = useRouter();

  const [userType, setUserType] = useState("customer"); // "customer" or "seller"
  const [name, setName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

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
    const data = {
      name,
      email,
      password,
    };

    if (userType === "seller") {
      data.storeName = storeName;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/auth/register/${userType}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        await SecureStore.setItemAsync("token", result.data.token);
        setMessage("Registration successful!");
        router.push("/Home");
      } else {
        setMessage("Registration failed: " + result.message);
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={login.container}>
      <Text style={[binuslogo.binus, login.binuscanteenlogo]}>
        BINUS<Text style={binuslogo.canteen}>CANTEEN</Text>
      </Text>

      <View style={login.formContainer}>
        <Text style={login.label}>User Type</Text>
        <View style={login.input}>
          <Picker
            selectedValue={userType}
            onValueChange={(itemValue) => setUserType(itemValue)}
            style={{ height: 40 }}
          >
            <Picker.Item label="Customer" value="customer" />
            <Picker.Item label="Vendor" value="seller" />
          </Picker>
        </View>

        <Text style={login.label}>Name</Text>
        <TextInput
          style={login.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        {userType === "seller" && (
          <>
            <Text style={login.label}>Store Name</Text>
            <TextInput
              style={login.input}
              placeholder="Enter your store name"
              value={storeName}
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
          value={email}
          onChangeText={setEmail}
        />

        <Text style={login.label}>Password</Text>
        <TextInput
          style={login.input}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={login.button} onPress={handleRegister}>
          <Text style={login.buttontext}>Register</Text>
        </TouchableOpacity>

        {message !== "" && <Text style={login.message}>{message}</Text>}
      </View>
    </ScrollView>
  );
};

export default Register;
