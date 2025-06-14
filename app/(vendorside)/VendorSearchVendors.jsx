import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import BASE_URL from "../../utils/config";
import search from "../../styles/search";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const SearchVendor = () => {
  const { q } = useLocalSearchParams(); // from route
  const [query, setQuery] = useState(q || "");
  const [vendors, setVendors] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (q) {
        setQuery(q); // restore previous query from route
        filterVendors(vendors, q);
      } else {
        setQuery(""); // or set to "" if you want to clear it instead
        setFiltered([]);
      }
    }, [q, vendors])
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${BASE_URL}/api/canteens`);
      const data = await res.json();
      setVendors(data.data);
      filterVendors(data.data, q || "");
    };
    fetchData();
  }, []);

  const filterVendors = (data, searchTerm) => {
    if (searchTerm.trim() === "") {
      setFiltered(data); // show all vendors
      return;
    }
    const results = data.filter((v) =>
      v.nama_tenant.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(results);
  };

  const handleSearchSubmit = () => {
    if (query.trim().length > 0) {
      filterVendors(vendors, query.trim());
    }
  };

  const renderVendorItem = ({ item }) => (
    <View style={search.AllVendors}>
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
          style={search.promoFoodsImg}
          source={
            item.image && item.image.trim() !== ""
              ? { uri: item.image }
              : require("../../assets/images/Banner.png")
          }
        />
        <View style={search.VendorsTextContainer}>
          <Text style={search.promoFoodsText}>{item.nama_tenant}</Text>
          <View style={[search.promoFoodsText2, { flexDirection: "row" }]}>
            <Image
              style={{ width: 10, alignSelf: "center", marginRight: 5 }}
              source={require("../../assets/images/Map Pin.png")}
            />
            <Text style={search.promoFoodsText2}>
              {item.place || "Unknown"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={search.container}>
      {/* Search */}
      <View style={search.searchcontainer}>
        <Image source={require("../../assets/images/Search.png")} />
        <TextInput
          placeholder="What food is on your mind?"
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            filterVendors(vendors, text); // update as user types
          }}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
          style={{ flex: 1, marginLeft: 10 }}
        />
      </View>

      <View style={search.BrowseAll}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filtered}
          keyExtractor={(item) => item.id_tenant.toString()}
          renderItem={renderVendorItem}
          ListEmptyComponent={<Text>No vendors found</Text>}
        />
      </View>
    </View>
  );
};

export default SearchVendor;
