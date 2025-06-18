import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import paymentsuccessstyle from "../styles/paymentsuccessstyle";
import { useLocalSearchParams } from "expo-router";
import BASE_URL from "../utils/config";

// Utility to format current date & time to "07 Jun 2025  |  11 : 02 : 25 WIB"
const getFormattedDateTime = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${day} ${month} ${year}  |  ${hours} : ${minutes} : ${seconds} WIB`;
};

const paymentsuccess = () => {
  const { id } = useLocalSearchParams();
  const [vendorOverview, setVendorOverview] = useState(null);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/canteens`);
        const data = await response.json();
        const foundVendor = data.data.find((v) => v.id_tenant === id);
        setVendorOverview(foundVendor || null);
      } catch (error) {
        // console.error("Failed to fetch vendor overview:", error);
      }
    };

    fetchVendor();
  }, [id]);

  const currentDateTime = getFormattedDateTime();

  return (
    <View style={paymentsuccessstyle.container}>
      <Image
        style={paymentsuccessstyle.aproval}
        source={require("../assets/images/BigAproval.png")}
      />
      <Text
        style={{
          fontFamily: "Calibri",
          fontSize: 32,
          alignSelf: "center",
          color: "#ffffff",
          marginTop: 10,
        }}
      >
        Payment Successful!
      </Text>

      <Text
        style={{
          fontFamily: "Abel",
          fontSize: 12,
          color: "#ffffff",
          alignSelf: "center",
        }}
      >
        {currentDateTime}
      </Text>

      <View style={paymentsuccessstyle.infocontainer}>
        <Text style={{ fontFamily: "Abel", fontSize: 20 }}>
          Don’t forget to pick your food at
        </Text>
        <Text style={{ fontFamily: "Abel", fontSize: 60 }}>13.00 WIB</Text>
        <Text style={{ fontFamily: "Abel", fontSize: 18 }}>Vendor</Text>
        <Text style={{ fontFamily: "Abel", fontSize: 24 }}>
          - {vendorOverview?.nama_tenant || "Loading..."} -
        </Text>
      </View>
    </View>
  );
};

export default paymentsuccess;
