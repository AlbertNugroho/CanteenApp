import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { foodDetailData } from "../data/FoodDetail";
import { useFonts } from "expo-font";
import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import vendordetailstyle from "../styles/vendordetailstyle";
import { foodOverviewData } from "../data/FoodOverview";
import { router } from "expo-router";

export default function VendorDetails() {
  const { id } = useLocalSearchParams();
  const [quantities, setQuantities] = useState({});
  const increase = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const decrease = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : 0,
    }));
  };

  const vendor = foodDetailData.find((v) => v.id === id);
  const vendorOverview = foodOverviewData.find((v) => v.id === id);
  const { colors } = useTheme();

  if (!vendor) {
    return (
      <View>
        <Text>Vendor not found.</Text>
      </View>
    );
  }

  const prices = vendor.menus.map((menu) => menu.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const topPicks = [...vendor.menus]
    .sort((a, b) => b.bought - a.bought)
    .slice(0, 3);
  const totalItems = Object.values(quantities).reduce(
    (sum, qty) => sum + qty,
    0
  );

  const totalPrice = vendor.menus.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    return sum + item.price * qty;
  }, 0);
  const renderImageItem = ({ item }) => {
    const quantity = quantities[item.id] || 0;

    return (
      <View style={vendordetailstyle.TopPicksContainer}>
        <Image style={vendordetailstyle.FoodImg} source={{ uri: item.image }} />
        {!item.availability && (
          <View style={vendordetailstyle.unavailableOverlay} />
        )}
        <View style={vendordetailstyle.FoodTextContainer}>
          <Text style={vendordetailstyle.FoodText}>{item.name}</Text>
          <Text style={vendordetailstyle.FoodText2}>{item.description}</Text>
          <Text style={vendordetailstyle.FoodText}>
            Rp {item.price.toLocaleString("id-ID")}
          </Text>
          {quantity === 0 ? (
            <TouchableOpacity
              style={vendordetailstyle.addButtontoppicks}
              disabled={!item.availability}
              onPress={() => increase(item.id)}
            >
              <Text style={{ color: "#000000", fontFamily: "Calibri" }}>
                {item.availability ? "Add" : "Sold Out"}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={vendordetailstyle.counterContainer}>
              <TouchableOpacity
                style={vendordetailstyle.button}
                onPress={() => decrease(item.id)}
              >
                <Text style={vendordetailstyle.counterbuttonText}>-</Text>
              </TouchableOpacity>

              <Text style={vendordetailstyle.quantityText}>{quantity}</Text>

              <TouchableOpacity
                style={vendordetailstyle.button}
                onPress={() => increase(item.id)}
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
              params: { id: vendor.id },
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
            source={{ uri: vendorOverview?.image }}
          />
          <View style={vendordetailstyle.header}>
            <Text style={vendordetailstyle.vendorname}>
              {vendorOverview?.name}
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
                {vendorOverview?.place}
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
          keyExtractor={(item, index) => item.id ?? index.toString()}
          renderItem={renderImageItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />

        <Text style={vendordetailstyle.title}>All Menu</Text>
        {vendor.menus.map((menu, index) => {
          const quantity = quantities[menu.id] || 0;

          return (
            <View key={index} style={vendordetailstyle.menuItem}>
              <Image
                source={{ uri: menu.image }}
                style={vendordetailstyle.image}
              />
              {!menu.availability && (
                <View style={vendordetailstyle.unavailableOverlay} />
              )}
              <View style={vendordetailstyle.info}>
                <Text style={vendordetailstyle.name}>{menu.name}</Text>
                <Text style={vendordetailstyle.description}>
                  {menu.description}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={vendordetailstyle.price}>
                    Rp {menu.price.toLocaleString("id-ID")}
                  </Text>

                  {quantity === 0 ? (
                    <TouchableOpacity
                      style={vendordetailstyle.addButton}
                      disabled={!menu.availability}
                      onPress={() => increase(menu.id)}
                    >
                      <Text style={{ color: "#FFFFFF", fontFamily: "Calibri" }}>
                        {menu.availability ? "Add" : "Sold Out"}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={vendordetailstyle.smallercounterContainer}>
                      <TouchableOpacity
                        style={vendordetailstyle.button}
                        onPress={() => decrease(menu.id)}
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
                        onPress={() => increase(menu.id)}
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
