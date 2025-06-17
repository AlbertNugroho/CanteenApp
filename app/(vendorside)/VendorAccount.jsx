import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import accountstyle from "../../styles/accountstyle";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import BASE_URL from "../../utils/config";
import { fetchTenantImage } from "../../utils/fetchimages";

const Account = () => {
  const { colors } = useTheme();
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    userId: "",
  });

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userJson = await SecureStore.getItemAsync("user");
        if (userJson) {
          const userData = JSON.parse(userJson);

          const imageUrl = await fetchTenantImage(userData.id_tenant); // <- Fetch image

          setUser({
            name: userData.nama_tenant,
            email: userData.email_tenant,
            role: userData.role,
            userId: userData.id_tenant,
          });

          setProfileImage(imageUrl); // <- Set fetched image
        }
      } catch (error) {
        // console.error("Failed to load user data:", error);
      }
    };

    loadUserData();
  }, []);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      const pickedImage = result.assets[0];
      setProfileImage(pickedImage.uri);
      uploadImage(pickedImage);
    }
  };

  const uploadImage = async (imageAsset) => {
    const formData = new FormData();
    formData.append("image", {
      uri: imageAsset.uri,
      name: "profile.jpg",
      type: "image/jpeg",
    });

    try {
      const userStr = await SecureStore.getItemAsync("user");
      const token = await SecureStore.getItemAsync("token");
      if (!userStr || !token) return;
      const userData = JSON.parse(userStr);

      const response = await fetch(
        `${BASE_URL}/api/tenant-images/upload/${userData.id_tenant}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      const result = await response.json();
      console.log("Upload Result:", result);
    } catch (err) {
      // console.error("Upload error:", err);
    }
  };

  return (
    <View style={accountstyle.container}>
      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
        <Image
          style={accountstyle.card}
          source={require("../../assets/images/cardprofile.png")}
        />

        <TouchableOpacity
          style={accountstyle.profilecontainer}
          onPress={pickImage}
        >
          <Image
            style={accountstyle.pp}
            source={
              profileImage
                ? { uri: profileImage }
                : require("../../assets/images/PP.png")
            }
          />
          <View style={styles.pencilIconContainer}>
            <Image
              source={require("../../assets/images/pencil.png")}
              style={styles.pencilIcon}
            />
          </View>
        </TouchableOpacity>

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

const styles = StyleSheet.create({
  pencilIconContainer: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 4,
    left: 85,
    top: 15,
    borderColor: "#000000B0",
    borderWidth: 1,
  },
  pencilIcon: {
    width: 16,
    height: 16,
  },
});

export default Account;
