import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import ordersummarystyle from "../styles/ordersummarystyle";
import BASE_URL from "../utils/config";

export default function OrderSummary() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [vendorMenus, setVendorMenus] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const [menusRes, cartRes] = await Promise.all([
          fetch(`${BASE_URL}/api/menus/tenants/${id}`),
          fetch(`${BASE_URL}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const { data: menus } = await menusRes.json();
        const { data: cartItems } = await cartRes.json();
        console.log("menus", menus);
        console.log("cartItems", cartItems);
        setVendorMenus(menus);
        const initQty = {};
        cartItems.forEach((c) => {
          initQty[c.id_menu] = c.quantity;
        });
        setQuantities(initQty);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    })();
  }, [id]);

  const updateCartItem = async (menuId, newQty) => {
    const token = await SecureStore.getItemAsync("token");
    await fetch(`${BASE_URL}/api/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ menuId, quantity: newQty }),
    });
  };

  const increase = async (menuId) => {
    const newQty = (quantities[menuId] || 0) + 1;
    await updateCartItem(menuId, newQty);
    setQuantities((q) => ({ ...q, [menuId]: newQty }));
  };

  const decrease = async (menuId) => {
    const newQty = (quantities[menuId] || 0) - 1;
    if (newQty <= 0) {
      const token = await SecureStore.getItemAsync("token");
      await fetch(`${BASE_URL}/api/cart/delete/${menuId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await updateCartItem(menuId, newQty);
    }
    setQuantities((q) => ({ ...q, [menuId]: Math.max(newQty, 0) }));
  };

  if (loading) return <Text>Loading...</Text>;

  const lineItems = Object.entries(quantities)
    .map(([menuId, qty]) => {
      const menu = vendorMenus.find((m) => m.id_menu === menuId);
      return menu && qty > 0
        ? { menu, qty, lineTotal: qty * parseFloat(menu.harga_menu) }
        : null;
    })
    .filter(Boolean);

  const total = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalWithAdmin = total + 3000;

  return (
    <View style={ordersummarystyle.container}>
      <ScrollView style={{ padding: 16 }}>
        <Text style={ordersummarystyle.Text}>Order Details</Text>
        {lineItems.map(({ menu, qty }) => (
          <View key={menu.id_menu} style={ordersummarystyle.infocontainer}>
            <View style={ordersummarystyle.infocontainertext}>
              <Text style={ordersummarystyle.infocontainertext1}>
                {menu.nama_menu}
              </Text>
              <Text style={ordersummarystyle.infocontainertext2}>
                Rp {parseFloat(menu.harga_menu).toLocaleString("id-ID")}
              </Text>
              <View style={ordersummarystyle.counterContainer}>
                <TouchableOpacity
                  onPress={() => decrease(menu.id_menu)}
                  style={ordersummarystyle.button}
                >
                  <Text style={ordersummarystyle.counterbuttonText}>-</Text>
                </TouchableOpacity>
                <Text style={ordersummarystyle.quantityText}>{qty}</Text>
                <TouchableOpacity
                  onPress={() => increase(menu.id_menu)}
                  style={ordersummarystyle.button}
                >
                  <Text style={ordersummarystyle.counterbuttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Image
              source={{ uri: menu.gambar_menu }}
              style={{ width: 80, height: 80, borderRadius: 8 }}
            />
          </View>
        ))}

        <Text style={ordersummarystyle.Text}>Payment Summary</Text>
        <View style={ordersummarystyle.ordercontainer}>
          {[
            { label: "Price", value: total },
            { label: "Admin", value: 3000 },
            { label: "Total Payment", value: totalWithAdmin },
          ].map(({ label, value }) => (
            <View key={label} style={ordersummarystyle.paymentcontainer}>
              <Text style={ordersummarystyle.paymenttext}>{label}</Text>
              <Text style={ordersummarystyle.infocontainertext2}>
                Rp {value.toLocaleString("id-ID")}
              </Text>
            </View>
          ))}

          <TouchableOpacity
            style={[
              ordersummarystyle.orderbutton,
              total === 0 && { opacity: 0.5 },
            ]}
            disabled={total === 0}
            onPress={() =>
              router.push({ pathname: "/Payment", params: { id } })
            }
          >
            <Text style={ordersummarystyle.buttontext}>Confirm Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
