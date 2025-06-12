import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { OrderDatas } from "../data/orderData";
import { foodDetailData } from "../data/FoodDetail";
import ordersummarystyle from "../styles/ordersummarystyle";

const OrderSummary = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const order = OrderDatas.find((v) => v.id === (id));
  const vendor = foodDetailData.find((v) => v.id === Number(id));

  const [quantities, setQuantities] = useState(() => {
    const initialQuantities = {};
    order?.data.forEach((item) => {
      initialQuantities[item.menuid] = item.quantity;
    });
    return initialQuantities;
  });

  const increase = (menuid) => {
    setQuantities((prev) => ({
      ...prev,
      [menuid]: (prev[menuid] || 0) + 1,
    }));
  };

  const decrease = (menuid) => {
    setQuantities((prev) => ({
      ...prev,
      [menuid]: prev[menuid] > 0 ? prev[menuid] - 1 : 0,
    }));
  };

  const totalPrice = order?.data.reduce((sum, item) => {
    const menuItem = vendor?.menus.find((m) => m.id === item.menuid);
    const quantity = quantities[item.menuid] || 0;
    return sum + (menuItem?.price || 0) * quantity;
  }, 0) || 0;

  const afteradmin = totalPrice + 3000;

  // 🔁 Auto navigate back if all items are 0
  useEffect(() => {
    const allZero = Object.values(quantities).every((q) => q === 0);
    if (allZero) {
      router.back();
    }
  }, [quantities]);

  if (!order || !vendor) {
    return (
      <View style={ordersummarystyle.container}>
        <Text style={{ padding: 16 }}>Order or Vendor not found.</Text>
      </View>
    );
  }

  return (
    <View style={ordersummarystyle.container}>
      <ScrollView style={{ padding: 16 }}>
        <Text style={ordersummarystyle.Text}>Order Details</Text>
        <View style={ordersummarystyle.ordercontainer}>
          {order.data.map((item, index) => {
            const quantity = quantities[item.menuid];
            if (quantity === 0) return null; // 👈 Skip zero quantity

            const menuItem = vendor.menus.find((m) => m.id === item.menuid);
            return (
              <View key={index} style={ordersummarystyle.infocontainer}>
                <View style={ordersummarystyle.infocontainertext}>
                  <Text style={ordersummarystyle.infocontainertext1}>
                    {menuItem.name}
                  </Text>
                  <Text style={ordersummarystyle.infocontainertext2}>
                    Rp {menuItem.price.toLocaleString("id-ID")}
                  </Text>
                  <View style={ordersummarystyle.counterContainer}>
                    <TouchableOpacity
                      style={ordersummarystyle.button}
                      onPress={() => decrease(menuItem.id)}
                    >
                      <Text style={ordersummarystyle.counterbuttonText}>-</Text>
                    </TouchableOpacity>

                    <Text style={ordersummarystyle.quantityText}>
                      {quantities[menuItem.id]}
                    </Text>

                    <TouchableOpacity
                      style={ordersummarystyle.button}
                      onPress={() => increase(menuItem.id)}
                    >
                      <Text style={ordersummarystyle.counterbuttonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Image
                  source={{ uri: menuItem.image }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 8,
                  }}
                />
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
              Rp {afteradmin.toLocaleString("id-ID")}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              ordersummarystyle.orderbutton,
              totalPrice === 0 && { opacity: 0.5 },
            ]}
            disabled={totalPrice === 0}
            onPress={() => router.push("/Home")}
          >
            <Text style={ordersummarystyle.buttontext}>Confirm Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderSummary;
