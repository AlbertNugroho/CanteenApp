import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useFonts } from "expo-font";
import React, { useState, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import vendordetailstyle from "../styles/vendordetailstyle";
import { router } from "expo-router";

export default function VendorDetails() {
  const { id } = useLocalSearchParams();
  const [quantities, setQuantities] = useState({});
  const [vendorMenus, setVendorMenus] = useState([]);
  const [vendorOverview, setVendorOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const increase = (menuId) => {
    setQuantities((prev) => ({
      ...prev,
      [menuId]: (prev[menuId] || 0) + 1,
    }));
  };

  const decrease = (menuId) => {
    setQuantities((prev) => ({
      ...prev,
      [menuId]: prev[menuId] > 0 ? prev[menuId] - 1 : 0,
    }));
  };

  // Fetch menus
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch(
          `http://192.168.0.101:3001/api/menus/tenants/${id}`
        );
        const data = await response.json();
        setVendorMenus(data.data);
      } catch (error) {
        console.error("Failed to fetch menus:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, [id]);

  // Fetch vendor overview
  // Fetch vendor overview
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch("http://192.168.0.101:3001/api/canteens");
        const data = await response.json();
        // find vendor by comparing id_tenant with id from params
        const foundVendor = data.data.find((v) => v.id_tenant === id);
        setVendorOverview(foundVendor || null);
      } catch (error) {
        console.error("Failed to fetch vendor overview:", error);
      }
    };

    fetchVendor();
  }, [id]);

  const { colors } = useTheme();

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
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
    const quantity = quantities[item.id_menu] || 0; // separate const for quantity

    return (
      <View style={vendordetailstyle.TopPicksContainer}>
        <Image
          style={vendordetailstyle.FoodImg}
          source={{ uri: item.gambar_menu }}
        />
        {!item.availability && (
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
              onPress={() => increase(item.id_menu)}
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
            router.push({
              pathname: "/OrderSummary",
              params: { id },
            })
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
            source={
              vendorOverview?.image
                ? { uri: vendorOverview.image }
                : require("../assets/images/cardprofile.png") // a placeholder image
            }
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
          const quantity = quantities[menu.id_menu] || 0; // separate const here

          return (
            <View key={menu.id_menu} style={vendordetailstyle.menuItem}>
              <Image
                source={{
                  uri: menu.gambar_menu || "https://via.placeholder.com/150",
                }}
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
                      onPress={() => increase(menu.id_menu)}
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
