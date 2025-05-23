import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import accountstyle from "../../styles/accountstyle";
import { useTheme } from "@react-navigation/native";
const account = () => {
  const { colors } = useTheme();
  return (
    <View style={accountstyle.container}>
      <Image
        style={accountstyle.card}
        source={require("../../assets/images/cardprofile.png")}
      />
      <View style={accountstyle.profilecontainer}>
        <Image
          style={accountstyle.pp}
          source={require("../../assets/images/cardprofile.png")}
        />
        <View>
          <Text style={[accountstyle.text, { color: colors.text }]}>
            Okky Sudibyo Rades
          </Text>
          <Text style={[accountstyle.text, { color: colors.text }]}>2702300575</Text>
        </View>
      </View>
    </View>
  );
};

export default account;
