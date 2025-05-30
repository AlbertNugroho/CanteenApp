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
import { useTheme } from "@react-navigation/native";
import vendordetailstyle from "../styles/vendordetailstyle";
import { foodOverviewData } from "../data/FoodOverview";

export default function VendorDetails() {
  const { id } = useLocalSearchParams();
  const vendor = foodDetailData.find((v) => v.id === id);
  const vendorOverview = foodOverviewData.find((v) => v.id === id);
  const { colors } = useTheme();

  const [loaded, error] = useFonts({
    Abel: require("../assets/fonts/Abel Regular.ttf"),
    Calibri: require("../assets/fonts/Calibri.ttf"),
    LilitaOne: require("../assets/fonts/Lilita One.ttf"),
    CalibriBold: require("../assets/fonts/Calibri Bold.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins Medium.ttf"),
  });

  if (!loaded || error) {
    return null;
  }

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

  const renderImageItem = ({ item }) => (
    <View style={vendordetailstyle.TopPicksContainer}>
      <Image style={vendordetailstyle.FoodImg} source={{ uri: item.image }} />
      {!item.availability && (
        <View style={vendordetailstyle.unavailableOverlay} />
      )}
      <View style={vendordetailstyle.FoodTextContainer}>
        <Text style={vendordetailstyle.FoodText}>{item.name}</Text>
        <Text style={vendordetailstyle.FoodText2}>{item.description}</Text>
        <Text style={vendordetailstyle.FoodText}>
          Rp {item.price.toLocaleString()}
        </Text>
        <TouchableOpacity
          style={vendordetailstyle.addButtontoppicks}
          disabled={!item.availability}
        >
          <Text style={{ color: "#000000", fontFamily: "Calibri" }}>
            {item.availability ? "Add" : "Sold Out"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={vendordetailstyle.container}>
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
              Rp {minPrice.toLocaleString()} - Rp {maxPrice.toLocaleString()}
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
        {vendor.menus.map((menu, index) => (
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
                }}
              >
                <Text style={vendordetailstyle.price}>
                  Rp {menu.price.toLocaleString()}
                </Text>
                <TouchableOpacity
                  style={vendordetailstyle.addButton}
                  disabled={!menu.availability}
                >
                  <Text style={{ color: "#FFFFFF", fontFamily: "Calibri" }}>
                    {menu.availability ? "Add" : "Sold Out"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
