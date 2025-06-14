import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import ordersummarystyle from "../styles/ordersummarystyle";
import BASE_URL from "../utils/config";
import DropDownPicker from "react-native-dropdown-picker";

export default function OrderSummary() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [vendorMenus, setVendorMenus] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [timeslots, setTimeslots] = useState([]);
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownItems, setDropdownItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const [menusRes, cartRes] = await Promise.all([
          fetch(`${BASE_URL}/api/menus/tenants/${id}`),
          fetch(`${BASE_URL}/api/cart/${id}`, {
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
          initQty[String(c.id_menu)] = c.quantity;
        });
        setQuantities(initQty);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    })();
  }, [id]);
  useEffect(() => {
    (async () => {
      try {
        const t = await SecureStore.getItemAsync("token");
        setToken(t);

        const [menusRes, cartRes, slotsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/menus/tenants/${id}`),
          fetch(`${BASE_URL}/api/cart/${id}`, {
            headers: { Authorization: `Bearer ${t}` },
          }),
          fetch(
            `${BASE_URL}/api/orders/timeslots/${id}?date=${
              new Date().toISOString().split("T")[0]
            }`
          ),
        ]);

        const menus = (await menusRes.json()).data;
        const cartItems = (await cartRes.json()).data;
        const slotData = (await slotsRes.json()).data;

        const initQty = {};
        cartItems.forEach((c) => {
          initQty[String(c.id_menu)] = c.quantity;
        });

        setQuantities(initQty);
        setVendorMenus(menus);
        setTimeslots(slotData);
        setDropdownItems(
          slotData.map((slot) => ({
            label: `${slot.time} - ${slot.endTime} (Available: ${slot.available})`,
            value: slot.time,
            disabled: slot.available === 0,
          }))
        );
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    })();
  }, [id]);

  const handlePlaceOrder = async () => {
    if (!token) return alert("Please login first");
    if (!selectedTimeslot) return alert("Please select a timeslot");

    try {
      const res = await fetch(`${BASE_URL}/api/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tenantId: id, timeslot: selectedTimeslot }),
      });

      const data = await res.json();
      if (data.success) {
        router.replace({ pathname: "/Payment", params: { id } });
      }
    } catch (error) {
      console.error("Place order error:", error);
    }
  };

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
              source={
                menu.gambar_menu && menu.gambar_menu.trim() !== ""
                  ? { uri: menu.gambar_menu }
                  : require("../assets/images/Banner.png")
              }
              style={{ width: 100, height: 100, borderRadius: 8 }}
            />
          </View>
        ))}
        <Text style={ordersummarystyle.Text}>Select Timeslot</Text>
        <DropDownPicker
          open={dropdownOpen}
          value={selectedTimeslot}
          items={dropdownItems}
          setOpen={setDropdownOpen}
          setValue={setSelectedTimeslot}
          setItems={setDropdownItems}
          showTickIcon={false}
          placeholder="Choose a timeslot"
          style={{
            fontFamily: "Calibri",
            height: 45,
            borderColor: "#000",
            borderRadius: 8,
          }}
          textStyle={{ fontFamily: "Calibri", fontSize: 14, color: "#000" }}
          dropDownContainerStyle={{
            borderColor: "#000",
            borderRadius: 8,
          }}
          containerStyle={{ marginBottom: 16 }}
          zIndex={1000}
        />
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
              (total === 0 || !selectedTimeslot) && { opacity: 0.5 },
            ]}
            disabled={total === 0 || !selectedTimeslot}
            onPress={handlePlaceOrder}
          >
            <Text style={ordersummarystyle.buttontext}>Confirm Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
