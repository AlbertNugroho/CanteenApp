import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import activitystyle from "../../styles/activitystyle";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import BASE_URL from "../../utils/config";

const renderVendorItem = ({ item }) => (
  <View style={activitystyle.AllVendors}>
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname:
            item.status.toLowerCase() === "pending"
              ? "../OrderOngoing"
              : "../VendorDetails",
          params: {
            id:
              item.status.toLowerCase() === "pending"
                ? item.id_transaksi
                : item.id_vendor, // change `id_vendor` if your key is different
          },
        })
      }
    >
      <Image
        style={activitystyle.promoFoodsImg}
        source={{ uri: item.image || "https://via.placeholder.com/150" }}
      />
      <View style={activitystyle.VendorsTextContainer}>
        <Text style={activitystyle.promoFoodsText}>{item.nama_tenant}</Text>
        <View style={[activitystyle.promoFoodsText2, { flexDirection: "row" }]}>
          <Image
            style={{
              width: 10,
              height: 10,
              alignSelf: "center",
              marginRight: 5,
            }}
            source={require("../../assets/images/Map Pin.png")}
          />
          <Text style={activitystyle.promoFoodsText2}>
            #{item.id_transaksi.substring(0, 8)}
          </Text>
        </View>
        <Text style={activitystyle.indicator}>Status: {item.status}</Text>
      </View>
    </TouchableOpacity>
  </View>
);

const OngoingView = ({ data }) => (
  <FlatList
    data={data}
    keyExtractor={(item) => item.id_transaksi}
    renderItem={renderVendorItem}
    ListEmptyComponent={<Text>No ongoing orders</Text>}
  />
);

const HistoryView = ({ data }) => (
  <FlatList
    data={data}
    keyExtractor={(item) => item.id_transaksi}
    renderItem={renderVendorItem}
    ListEmptyComponent={<Text>No history orders</Text>}
  />
);

const Activity = () => {
  const [showSecondView, setShowSecondView] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    const token = await SecureStore.getItemAsync("token");
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      if (json.success) {
        setOrders(json.data);
      } else {
        console.log("Failed to fetch orders:", json.message);
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const ongoingOrders = orders.filter(
    (order) => order.status.trim().toLowerCase() === "pending"
  );
  const historyOrders = orders.filter(
    (order) => order.status.trim().toLowerCase() === "completed"
  );

  return (
    <View style={activitystyle.container}>
      <View style={activitystyle.buttoncontainer}>
        <TouchableOpacity onPress={() => setShowSecondView(false)}>
          <Text
            style={[
              activitystyle.text,
              !showSecondView && activitystyle.underlineText,
            ]}
          >
            Ongoing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowSecondView(true)}>
          <Text
            style={[
              activitystyle.text,
              showSecondView && activitystyle.underlineText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      <View style={activitystyle.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : showSecondView ? (
          <HistoryView data={historyOrders} />
        ) : (
          <OngoingView data={ongoingOrders} />
        )}
      </View>
    </View>
  );
};

export default Activity;
