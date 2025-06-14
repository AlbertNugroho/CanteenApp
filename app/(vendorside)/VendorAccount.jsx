import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import accountstyle from "../../styles/accountstyle";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import BASE_URL from "../../utils/config";

const account = () => {
  const { colors } = useTheme();
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    userId: "",
  });
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userJson = await SecureStore.getItemAsync("user");
        console.log("User object from login response:", user);
        if (userJson) {
          const userData = JSON.parse(userJson);
          setUser({
            name: userData.nama_tenant,
            email: userData.email_tenant,
            role: userData.role,
            userId: userData.id_tenant,
          });
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadUserData();
  }, []);

  return (
    <View style={accountstyle.container}>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <Image
          style={accountstyle.card}
          source={require("../../assets/images/cardprofile.png")}
        />
        <View style={accountstyle.profilecontainer}>
          <Image
            style={accountstyle.pp}
            source={require("../../assets/images/PP.png")}
          />
        </View>
        <View style={accountstyle.divider} />
        <View style={accountstyle.infocard}>
          <View style={accountstyle.infocontainer}>
            <Text style={accountstyle.label}>Store Name</Text>
            <Text style={accountstyle.text}>{user.name}</Text>
          </View>
          <View style={accountstyle.infodivider} />
          <View style={accountstyle.infocontainer}>
            <Text style={accountstyle.label}>Tenant ID</Text>
            <Text style={accountstyle.text}>{user.userId}</Text>
          </View>
          <View style={accountstyle.infodivider} />
          <View style={accountstyle.infocontainer}>
            <Text style={accountstyle.label}>Email</Text>
            <Text style={accountstyle.text}>{user.email}</Text>
          </View>
          <View style={accountstyle.infodivider} />
          <View style={accountstyle.infocontainer}>
            <Text style={accountstyle.label}>Role</Text>
            <Text style={accountstyle.text}>{user.role}</Text>
          </View>
        </View>
        <View style={accountstyle.infocard}>
          <TouchableOpacity>
            <View style={accountstyle.buttoncontainer}>
              <Image source={require("../../assets/images/lock.png")} />
              <Text style={accountstyle.buttontext}>Change Password</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={accountstyle.infocard}>
          <TouchableOpacity
            onPress={async () => {
              await SecureStore.deleteItemAsync("token");
              await SecureStore.deleteItemAsync("user");
              router.replace("/");
            }}
          >
            <View style={accountstyle.buttoncontainer}>
              <Image source={require("../../assets/images/logout.png")} />
              <Text style={accountstyle.buttontext}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={accountstyle.bottominfo}>
          <TouchableOpacity>
            <Text style={accountstyle.bottomtext}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={accountstyle.bottomtext}>Terms & Conditions</Text>
          </TouchableOpacity>
          <Text style={accountstyle.info}>Version 0.1.0</Text>
          <Text style={accountstyle.info}>
            Copyright ckcakcbaiclcooacnaouvbwovakn nnnnnnnnnnnnnnnnnnnnn
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default account;
