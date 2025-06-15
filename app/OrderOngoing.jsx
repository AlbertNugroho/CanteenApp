import { View, Text, ScrollView, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import ordersummarystyle from "../styles/ordersummarystyle";

const OrderSummary = () => {
  const router = useRouter();
  const { order: orderParam } = useLocalSearchParams();

  const order = orderParam ? JSON.parse(orderParam) : null;

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (order) {
      const initialQuantities = {};
      order.items?.forEach((item) => {
        initialQuantities[item.menu_id] = item.quantity;
      });
      setQuantities(initialQuantities);
    }
  }, [order]);

  const totalPrice =
    order?.items?.reduce((sum, item) => {
      const price = parseInt(item.subtotal || 0);
      return sum + price;
    }, 0) || 0;

  const afterAdmin = totalPrice + 3000;

  if (!order) {
    return (
      <View style={ordersummarystyle.container}>
        <Text style={{ padding: 16 }}>Order not found.</Text>
      </View>
    );
  }

  return (
    <View style={ordersummarystyle.container}>
      <ScrollView style={{ padding: 16 }}>
        <Text style={ordersummarystyle.Text}>Order Details</Text>
        <View style={ordersummarystyle.ordercontainer}>
          {order.items?.map((item, index) => {
            const quantity = item.quantity;
            if (quantity === 0) return null;

            return (
              <View key={index} style={ordersummarystyle.infocontainer}>
                <View style={ordersummarystyle.infocontainertext}>
                  <Text style={ordersummarystyle.infocontainertext1}>
                    {item.nama_menu}
                  </Text>
                  <Text style={ordersummarystyle.infocontainertext2}>
                    Rp {parseInt(item.subtotal).toLocaleString("id-ID")}
                  </Text>
                  <Text style={ordersummarystyle.quantity}>
                    Quantity: {quantity}
                  </Text>
                </View>
                {item.image_url && (
                  <Image
                    source={{ uri: item.image_url }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 8,
                    }}
                  />
                )}
              </View>
            );
          })}
        </View>

        <Text style={ordersummarystyle.Text}>Payment Summary</Text>
        <View style={ordersummarystyle.ordercontainer}>
          <View style={ordersummarystyle.paymentcontainer}>
            <Text style={ordersummarystyle.paymenttext}>Price</Text>
            <Text style={ordersummarystyle.infocontainertext2}>
              Rp {totalPrice.toLocaleString("id-ID")}
            </Text>
          </View>
          <View style={ordersummarystyle.paymentcontainer}>
            <Text style={ordersummarystyle.paymenttext}>Admin</Text>
            <Text style={ordersummarystyle.infocontainertext2}>Rp 3.000</Text>
          </View>
          <View style={ordersummarystyle.paymentcontainer}>
            <Text style={ordersummarystyle.paymenttext}>Total Payment</Text>
            <Text style={ordersummarystyle.infocontainertext2}>
              Rp {afterAdmin.toLocaleString("id-ID")}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderSummary;
