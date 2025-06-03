import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { useTheme } from "@react-navigation/native";
import homestyle from "../../styles/homestyle";

const Home = () => {
  const { colors } = useTheme();

  const [topPicks, setTopPicks] = useState([]);
  const [promo, setPromo] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [loadingTopPicks, setLoadingTopPicks] = useState(true);
  const [loadingPromo, setLoadingPromo] = useState(true);
  const [loadingVendors, setLoadingVendors] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch("http://192.168.0.101:3001/api/canteens");
        const data = await res.json();

        setVendors(data.data);
        setLoadingVendors(false);

        const sortedByBuyers = [...data].sort(
          (a, b) => (b.totalBuyer ?? 0) - (a.totalBuyer ?? 0)
        );
        const top3 = sortedByBuyers.slice(0, 3);
        const promos = data.filter((item) => item.promo);

        setTopPicks(top3);
        setPromo(promos);
        setLoadingTopPicks(false);
        setLoadingPromo(false);
      } catch (error) {
        console.error("Failed to fetch canteens:", error);
        setLoadingTopPicks(false);
        setLoadingPromo(false);
        setLoadingVendors(false);
      }
    };

    fetchVendors();
  }, []);

  const renderImageItem = ({ item }) => (
    <View style={homestyle.promoFoods}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: "../VendorDetails",
            params: { id: item.id_tenant },
          })
        }
      >
        <Image
          style={homestyle.promoFoodsImg}
          source={{ uri: item.image || "https://via.placeholder.com/100" }}
        />
        <View style={homestyle.promoFoodsTextContainer}>
          <Text style={homestyle.promoFoodsText}>{item.nama_tenant}</Text>
          <View style={[homestyle.promoFoodsText2, { flexDirection: "row" }]}>
            <Image
              style={{ width: 10, alignSelf: "center", marginRight: 5 }}
              source={require("../../assets/images/Map Pin.png")}
            />
            <Text style={homestyle.promoFoodsText2}>
              {item.place || "Unknown"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderVendorItem = ({ item }) => (
    <View style={homestyle.AllVendors}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: "../VendorDetails",
            params: { id: item.id_tenant },
          })
        }
      >
        <Image
          style={homestyle.promoFoodsImg}
          source={{ uri: item.image || "https://via.placeholder.com/100" }}
        />
        <View style={homestyle.VendorsTextContainer}>
          <Text style={homestyle.promoFoodsText}>{item.nama_tenant}</Text>
          <View style={[homestyle.promoFoodsText2, { flexDirection: "row" }]}>
            <Image
              style={{ width: 10, alignSelf: "center", marginRight: 5 }}
              source={require("../../assets/images/Map Pin.png")}
            />
            <Text style={homestyle.promoFoodsText2}>
              {item.place || "Unknown"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={homestyle.container}>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        {/* Header and Banner */}
        <View style={homestyle.UpperContainer}>
          <View style={homestyle.header}>
            <TouchableOpacity style={homestyle.headerbutton}>
              <View style={homestyle.headertextcontainer}>
                <Text style={homestyle.text}>Student Undergraduate</Text>
                <Text style={homestyle.text}>Binus@Semarang</Text>
              </View>
              <View style={homestyle.headerimg}>
                <Image
                  style={homestyle.headerimg}
                  source={require("../../assets/images/Chevron Down.png")}
                />
              </View>
            </TouchableOpacity>
            <Image
              style={homestyle.pp}
              source={require("../../assets/images/cardprofile.png")}
            />
          </View>
          <Image
            style={homestyle.BannerImg}
            source={require("../../assets/images/Banner.png")}
          />
        </View>

        {/* Search */}
        <View style={homestyle.searchcontainer}>
          <Image source={require("../../assets/images/Search.png")} />
          <TextInput placeholder="What food is on your mind?" />
        </View>

        {/* Top Picks */}
        <View style={homestyle.TopPicks}>
          <Text style={homestyle.TopPicksText}>
            Top-picked by other binusians
          </Text>
          {loadingTopPicks ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={topPicks}
              horizontal
              keyExtractor={(item) => item.id_tenant?.toString()}
              renderItem={renderImageItem}
              showsHorizontalScrollIndicator={false}
              style={{ marginVertical: 10 }}
            />
          )}
        </View>

        {/* Promo Section */}
        <View style={homestyle.Promo}>
          <Text style={homestyle.TopPicksText}>Promo</Text>
          {loadingPromo ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={promo}
              horizontal
              keyExtractor={(item) => item.id_tenant?.toString()}
              renderItem={renderImageItem}
              showsHorizontalScrollIndicator={false}
              style={{ marginVertical: 10 }}
            />
          )}
        </View>

        {/* All Vendors */}
        <View style={homestyle.BrowseAll}>
          <Text style={homestyle.TopPicksText}>Browse all vendors</Text>
          {loadingVendors ? (
            <ActivityIndicator size="large" />
          ) : (
            <View style={{ marginVertical: 10 }}>
              {vendors.map((item) => (
                <React.Fragment key={item.id_tenant}>
                  {renderVendorItem({ item })}
                </React.Fragment>
              ))}
            </View>
          )}
        </View>

        <Text style={homestyle.last}>
          Oops, you have seen all the tenant that{"\n"}we have to offer
        </Text>
      </ScrollView>
    </View>
  );
};

export default Home;
