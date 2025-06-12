import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import React, { useState } from "react";
import * as SecureStore from "expo-secure-store";
import binuslogo from "../styles/binuslogo";
import login from "../styles/login";

const App = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [loaded, error] = useFonts({
    Abel: require("../assets/fonts/Abel Regular.ttf"),
    Calibri: require("../assets/fonts/Calibri.ttf"),
    LilitaOne: require("../assets/fonts/Lilita One.ttf"),
    CalibriBold: require("../assets/fonts/Calibri Bold.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins Medium.ttf"),
  });

  if (!loaded || error) return null;

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.0.118:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const token = data.data.token;
        setMessage("Login successful!");
        await SecureStore.setItemAsync("token", token);
        // Replace with replace later
        router.push("/Home");
      } else {
        setMessage("Login failed: " + data.message);
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <View style={login.container}>
      <Text style={[binuslogo.binus, login.binuscanteenlogo]}>
        BINUS<Text style={binuslogo.canteen}>CANTEEN</Text>
      </Text>

      <View style={login.formContainer}>
        <Text style={login.label}>Email</Text>
        <TextInput
          style={login.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={login.label}>Password</Text>
        <TextInput
          style={login.input}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={login.button} onPress={handleLogin}>
          <Text style={login.buttontext}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={login.button} onPress={handleLogin}>
          <Text style={login.buttontext}>Register</Text>
        </TouchableOpacity>

        {/* Response Message */}
        {message !== "" && <Text style={login.message}>{message}</Text>}
      </View>
    </View>
  );
};

export default App;
