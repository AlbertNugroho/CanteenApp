import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import activitystyle from "../../styles/activitystyle";
import * as SecureStore from "expo-secure-store";
import BASE_URL from "../../utils/config";
import { router } from "expo-router";

const Activity = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const token = await SecureStore.getItemAsync("token");
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/api/orders/tenant/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (transactionId, newStatus) => {
    const token = await SecureStore.getItemAsync("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${BASE_URL}/api/orders/${transactionId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const json = await res.json();
      if (json.success) {
        Alert.alert("Success", "Status updated.");
        fetchOrders();
      } else {
        Alert.alert("Failed", json.message || "Could not update status.");
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const isOngoing = (status) => status === "Pending" || status === "On Process";

  const filteredOrders = orders.filter((order) =>
    showHistory
      ? ["Completed", "Cancelled"].includes(order.status.trim())
      : isOngoing(order.status.trim())
  );

  const renderItem = ({ item }) => {
    const transactionId = item.id_transaksi;
    const status = item.status.trim();

    const renderActions = () => {
      if (status === "Pending") {
        return (
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={[
                activitystyle.actionButton,
                { backgroundColor: "#4CAF50" },
              ]}
              onPress={() => updateOrderStatus(transactionId, "On Process")}
            >
              <Text style={activitystyle.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                activitystyle.actionButton,
                { backgroundColor: "#f44336" },
              ]}
              onPress={() => updateOrderStatus(transactionId, "Cancelled")}
            >
              <Text style={activitystyle.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        );
      } else if (status === "On Process") {
        return (
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={[
                activitystyle.actionButton,
                { backgroundColor: "#2196F3" },
              ]}
              onPress={() => updateOrderStatus(transactionId, "Completed")}
            >
              <Text style={activitystyle.buttonText}>Ready</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                activitystyle.actionButton,
                { backgroundColor: "#f44336" },
              ]}
              onPress={() => updateOrderStatus(transactionId, "Cancelled")}
            >
              <Text style={activitystyle.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        );
      } else {
        return null;
      }
    };

    return (
      <View style={activitystyle.activityallcontain}>
        <Text style={activitystyle.activitycontainertext2}>
          Order #{transactionId}
        </Text>
        <Text style={activitystyle.activitycontainertext2}>
          Customer: {item.customer_name}
        </Text>
        <Text style={activitystyle.activitycontainertext2}>
          Pickup: {item.timeslot}
        </Text>
        <Text style={activitystyle.activitycontainertext2}>
          Total: Rp {parseInt(item.total_amount).toLocaleString("id-ID")}
        </Text>

        {/* 🛒 Order Items */}
        {item.items && item.items.length > 0 && (
          <View style={{ marginTop: 8 }}>
            <Text style={activitystyle.activitycontainertext2}>Items:</Text>
            {item.items.map((menuItem, idx) => (
              <Text
                key={idx}
                style={[
                  activitystyle.activitycontainertext2,
                  { marginLeft: 8 },
                ]}
              >
                • {menuItem.quantity}x {menuItem.nama_menu} - Rp{" "}
                {parseInt(menuItem.subtotal).toLocaleString("id-ID")}
              </Text>
            ))}
          </View>
        )}

        <View style={activitystyle.activitycontainer}>
          <View style={activitystyle.buttons}>{renderActions()}</View>
          <Text style={activitystyle.activityindicator}>Status: {status}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={activitystyle.container}>
      <View style={activitystyle.buttoncontainer}>
        <TouchableOpacity onPress={() => setShowHistory(false)}>
          <Text
            style={[
              activitystyle.text,
              !showHistory && activitystyle.underlineText,
            ]}
          >
            Ongoing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowHistory(true)}>
          <Text
            style={[
              activitystyle.text,
              showHistory && activitystyle.underlineText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      <View style={activitystyle.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <FlatList
            data={filteredOrders}
            keyExtractor={(item) => item.id_transaksi}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text
                style={{
                  fontFamily: "CalibriBold",
                  marginHorizontal: 16,
                  alignSelf: "center",
                  fontSize: 16,
                }}
              >
                No orders found.
              </Text>
            }
          />
        )}
      </View>
    </View>
  );
};

export default Activity;
