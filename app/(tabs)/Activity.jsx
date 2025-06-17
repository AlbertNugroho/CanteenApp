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
import { fetchTenantImage } from "../../utils/fetchimages";

const OngoingView = ({ data, renderItem }) => (
  <FlatList
    data={data}
    showsVerticalScrollIndicator={false}
    keyExtractor={(item) => item.id_transaksi}
    renderItem={renderItem}
    ListEmptyComponent={<Text>No ongoing orders</Text>}
  />
);

const HistoryView = ({ data, renderItem }) => (
  <FlatList
    data={data}
    showsVerticalScrollIndicator={false}
    keyExtractor={(item) => item.id_transaksi}
    renderItem={renderItem}
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
        const ordersWithImages = await Promise.all(
          json.data.map(async (item) => {
            const imageUrl = await fetchTenantImage(
              item.id_transaksi.split("-")[0]
            );
            return { ...item, image: imageUrl };
          })
        );
        setOrders(ordersWithImages);
      } else {
        console.log("Failed to fetch orders:", json.message);
      }
    } catch (error) {
      // console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const renderVendorItem = ({ item }) => {
    return (
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
                    : item.id_transaksi.split("-")[0], // gets "T009"
              },
            })
          }
        >
          <Image
            style={activitystyle.promoFoodsImg}
            source={{ uri: item.image }}
          />
          <View style={activitystyle.VendorsTextContainer}>
            <Text style={activitystyle.promoFoodsText}>{item.nama_tenant}</Text>
            <View
              style={[activitystyle.promoFoodsText2, { flexDirection: "row" }]}
            >
              <Text style={activitystyle.promoFoodsText2}>
                #{item.id_transaksi.substring(0, 8)}
              </Text>
            </View>
            <Text style={activitystyle.indicator}>Status: {item.status}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

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
          <HistoryView data={historyOrders} renderItem={renderVendorItem} />
        ) : (
          <OngoingView data={ongoingOrders} renderItem={renderVendorItem} />
        )}
      </View>
    </View>
  );
};

export default Activity;
