import {
  View,
  Text,
  StyleSheet,
  Button,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";

import React from "react";
import binuslogo from "../styles/binuslogo";
import login from "../styles/login";
const App = () => {
  const router = useRouter();
  const [loaded, error] = useFonts({
    Abel: require("../assets/fonts/Abel Regular.ttf"),
    Calibri: require("../assets/fonts/Calibri.ttf"),
    LilitaOne: require("../assets/fonts/Lilita One.ttf"),
    CalibriBold: require("../assets/fonts/Calibri Bold.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins Medium.ttf"),
  });

  if (!loaded || error) {
    return null;
  }
  return (
    <View style={login.container}>
      <Text style={[binuslogo.binus, login.binuscanteenlogo]}>
        BINUS<Text style={binuslogo.canteen}>CANTEEN</Text>
      </Text>
      <Text style={login.text}>Sign in with your work or school account</Text>
      <TouchableOpacity
        style={login.button}
        onPress={() => router.push("/Home")}
      >
        <Image
          style={login.microsoftlogo}
          source={require("../assets/images/microsoftlogo.png")}
        />
        <Text style={login.buttontext}>Sign in with Microsoft</Text>
      </TouchableOpacity>
      <Text style={login.text}>Sign in for canteen tenant</Text>
      <TouchableOpacity
        style={login.button}
        //jangan lupa ganti push dengan replace nanti pas uda jadi
        onPress={() => router.push("/Home")}
      >
        <Text style={login.buttontext}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
