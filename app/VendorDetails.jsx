import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useFonts } from "expo-font";
import React, { useState, useEffect } from "react";
import { useTheme, useFocusEffect } from "@react-navigation/native";
import vendordetailstyle from "../styles/vendordetailstyle";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import BASE_URL from "../utils/config";
import { fetchMenuImage } from "../utils/fetchimages";
import { fetchTenantImage } from "../utils/fetchimages";

export default function VendorDetails() {
  const { id } = useLocalSearchParams();
  const [quantities, setQuantities] = useState({});
  const [vendorMenus, setVendorMenus] = useState([]);
  const [vendorOverview, setVendorOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tenantImage, setTenantImage] = useState(null);
  const { colors } = useTheme();

  const fetchCartFromServer = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) throw new Error("Token not found");

      const response = await fetch(`${BASE_URL}/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        const newQuantities = {};
        result.data.forEach((item) => {
          newQuantities[item.id_menu] = item.quantity;
        });
        setQuantities(newQuantities);
      }
    } catch (error) {
      console.error("Failed to fetch cart from server:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCartFromServer();
      return () => {};
    }, [id])
  );

  const updateCartItem = async (menuId, newQuantity, token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ menuId, quantity: newQuantity }),
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error updating cart:", error.message);
      return false;
    }
  };

  const increase = async (menuId) => {
    const token = await SecureStore.getItemAsync("token");
    if (!token) return;

    const currentQty = quantities[menuId] || 0;
    const newQty = currentQty + 1;
    const success = await updateCartItem(menuId, newQty, token);
    if (success) {
      setQuantities((prev) => ({ ...prev, [menuId]: newQty }));
    }
  };

  const decrease = async (menuId) => {
    const token = await SecureStore.getItemAsync("token");
    if (!token) return;

    const currentQty = quantities[menuId] || 0;
    const newQty = currentQty - 1;

    if (newQty <= 0) {
      try {
        await fetch(`${BASE_URL}/api/cart/delete/${menuId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuantities((prev) => ({ ...prev, [menuId]: 0 }));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    } else {
      const success = await updateCartItem(menuId, newQty, token);
      if (success) {
        setQuantities((prev) => ({ ...prev, [menuId]: newQty }));
      }
    }
  };

  const handleAdd = async (menuId, quantity = 1) => {
    const token = await SecureStore.getItemAsync("token");
    if (!token) return;

    try {
      await fetch(`${BASE_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ menuId, tenantId: id, quantity }),
      });

      setQuantities((prev) => ({ ...prev, [menuId]: quantity }));
    } catch (error) {
      console.error("Add failed:", error);
    }
  };

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/menus/tenants/${id}`);
        const data = await response.json();

        const menusWithImages = await Promise.all(
          data.data.map(async (menu) => {
            const imageUrl = await fetchMenuImage(menu.id_menu);
            return { ...menu, gambar_menu: imageUrl };
          })
        );

        setVendorMenus(menusWithImages);
      } catch (error) {
        console.error("Failed to fetch menus:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [id]);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/canteens`);
        const data = await response.json();
        const foundVendor = data.data.find((v) => v.id_tenant === id);
        setVendorOverview(foundVendor || null);

        if (foundVendor) {
          const image = await fetchTenantImage(foundVendor.id_tenant);
          setTenantImage(image);
        }
      } catch (error) {
        console.error("Failed to fetch vendor overview:", error);
      }
    };

    fetchVendor();
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const prices = vendorMenus.map((menu) => parseFloat(menu.harga_menu));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const topPicks = [...vendorMenus].sort((a, b) => b.b - a.b).slice(0, 3);
  const totalItems = Object.values(quantities).reduce(
    (sum, qty) => sum + qty,
    0
  );
  const totalPrice = vendorMenus.reduce((sum, item) => {
    const qty = quantities[item.id_menu] || 0;
    return sum + parseFloat(item.harga_menu) * qty;
  }, 0);

  const renderImageItem = ({ item }) => {
    const quantity = quantities[item.id_menu] || 0;

    return (
      <View style={vendordetailstyle.TopPicksContainer}>
        <Image
          style={vendordetailstyle.FoodImg}
          source={{ uri: item.gambar_menu }}
        />
        {item.availability !== 1 && (
          <View style={vendordetailstyle.unavailableOverlay} />
        )}
        <View style={vendordetailstyle.FoodTextContainer}>
          <Text style={vendordetailstyle.FoodText}>{item.nama_menu}</Text>
          <Text style={vendordetailstyle.FoodText2}>{item.deskripsi}</Text>
          <Text style={vendordetailstyle.FoodText}>
            Rp {parseFloat(item.harga_menu).toLocaleString("id-ID")}
          </Text>
          {quantity === 0 ? (
            <TouchableOpacity
              style={vendordetailstyle.addButtontoppicks}
              disabled={item.availability !== 1}
              onPress={() => handleAdd(item.id_menu, 1)}
            >
              <Text style={{ color: "#000000", fontFamily: "Calibri" }}>
                {item.availability === 1 ? "Add" : "Sold Out"}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={vendordetailstyle.counterContainer}>
              <TouchableOpacity
                style={vendordetailstyle.button}
                onPress={() => decrease(item.id_menu)}
              >
                <Text style={vendordetailstyle.counterbuttonText}>-</Text>
              </TouchableOpacity>
              <Text style={vendordetailstyle.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={vendordetailstyle.button}
                onPress={() => increase(item.id_menu)}
              >
                <Text style={vendordetailstyle.counterbuttonText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={vendordetailstyle.container}>
      {totalItems > 0 && (
        <TouchableOpacity
          style={vendordetailstyle.BuyButtonContainer}
          onPress={() =>
            router.push({ pathname: "/OrderSummary", params: { id } })
          }
        >
          <View style={vendordetailstyle.BuyButton}>
            <Text style={vendordetailstyle.BuyButtonText1}>
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </Text>
            <Text style={vendordetailstyle.BuyButtonText2}>
              Rp {totalPrice.toLocaleString("id-ID")}
            </Text>
          </View>
          <Image source={require("../assets/images/Shopping Cart.png")} />
        </TouchableOpacity>
      )}

      <ScrollView>
        <Image
          source={require("../assets/images/image 2.png")}
          style={vendordetailstyle.bgimage}
        />

        <View style={vendordetailstyle.headercontainer}>
          <Image
            style={vendordetailstyle.ppimg}
            source={{ uri: tenantImage }}
          />
          <View style={vendordetailstyle.header}>
            <Text style={vendordetailstyle.vendorname}>
              {vendorOverview?.nama_tenant || "Vendor Name"}
            </Text>
            <View style={{ flexDirection: "row", marginBottom: 30 }}>
              <Image
                style={{ height: 20, width: 20 }}
                source={require("../assets/images/location.png")}
              />
              <Text
                style={{
                  fontFamily: "Calibri",
                  fontSize: 14,
                  color: "#00000050",
                  marginLeft: 5,
                }}
              >
                {vendorOverview?.place || "Unknown Location"}
              </Text>
            </View>
            <Text style={vendordetailstyle.pricerange}>
              Rp {minPrice.toLocaleString("id-ID")} - Rp{" "}
              {maxPrice.toLocaleString("id-ID")}
            </Text>
          </View>
        </View>

        <Text style={vendordetailstyle.title}>Top Picks</Text>
        <FlatList
          data={topPicks}
          keyExtractor={(item) => item.id_menu}
          renderItem={renderImageItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />

        <Text style={vendordetailstyle.title}>All Menu</Text>
        {vendorMenus.map((menu) => {
          const quantity = quantities[menu.id_menu] || 0;

          return (
            <View key={menu.id_menu} style={vendordetailstyle.menuItem}>
              <Image
                source={{ uri: menu.gambar_menu }}
                style={vendordetailstyle.image}
              />
              {menu.availability !== 1 && (
                <View style={vendordetailstyle.unavailableOverlay} />
              )}
              <View style={vendordetailstyle.info}>
                <Text style={vendordetailstyle.name}>{menu.nama_menu}</Text>
                <Text style={vendordetailstyle.description}>
                  {menu.deskripsi}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={vendordetailstyle.price}>
                    Rp {parseFloat(menu.harga_menu).toLocaleString("id-ID")}
                  </Text>
                  {quantity === 0 ? (
                    <TouchableOpacity
                      style={vendordetailstyle.addButton}
                      disabled={menu.availability !== 1}
                      onPress={() => handleAdd(menu.id_menu, 1)}
                    >
                      <Text style={{ color: "#FFFFFF", fontFamily: "Calibri" }}>
                        {menu.availability === 1 ? "Add" : "Sold Out"}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={vendordetailstyle.smallercounterContainer}>
                      <TouchableOpacity
                        style={vendordetailstyle.button}
                        onPress={() => decrease(menu.id_menu)}
                      >
                        <Text
                          style={vendordetailstyle.smallercounterbuttonText}
                        >
                          -
                        </Text>
                      </TouchableOpacity>
                      <Text style={vendordetailstyle.smallerquantityText}>
                        {quantity}
                      </Text>
                      <TouchableOpacity
                        style={vendordetailstyle.button}
                        onPress={() => increase(menu.id_menu)}
                      >
                        <Text
                          style={vendordetailstyle.smallercounterbuttonText}
                        >
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}

        <View style={{ marginBottom: 150 }} />
      </ScrollView>
    </View>
  );
}
