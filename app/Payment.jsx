import { View, Text, Image } from "react-native";
import React, { useState, useEffect } from "react";
import paymentstyle from "../styles/paymentstyle";
import { useLocalSearchParams, router } from "expo-router";

const Payment = () => {
  const [timeLeft, setTimeLeft] = useState(60000); // 1 menit
  const { id } = useLocalSearchParams();
  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 10, 0));
    }, 10);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace({ pathname: "/paymentsuccess", params: { id } });
    }, 3000); // 5 seconds

    return () => clearTimeout(timeout);
  }, [id]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}:${String(milliseconds).padStart(2, "0")}`;
  };

  return (
    <View style={paymentstyle.container}>
      <View style={paymentstyle.qrcontainer}>
        <Image source={require("../assets/images/qrtemp.png")} />
        <Image
          style={paymentstyle.aproval}
          source={require("../assets/images/Approval.png")}
        />
      </View>
      <View style={paymentstyle.timercontainer}>
        <Text style={{ fontFamily: "Karatina", fontSize: 18 }}>
          Payment Time Limit
        </Text>
        <Text style={{ fontFamily: "Karatina", fontSize: 80 }}>
          {formatTime(timeLeft)}
        </Text>
      </View>
    </View>
  );
};

export default Payment;
