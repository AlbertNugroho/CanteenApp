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
import { useTheme } from "@react-navigation/native";

import homestyle from "../../styles/homestyle";
type ImageType = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
};
const Home = () => {
  const { colors } = useTheme();
  const [topPicks, setTopPicks] = useState<ImageType[]>([]);
  const [promo, setPromo] = useState<ImageType[]>([]);
  const [vendors, setVendors] = useState<ImageType[]>([]);
  const [loadingTopPicks, setLoadingTopPicks] = useState(true);
  const [loadingPromo, setLoadingPromo] = useState(true);
  const [loadingVendors, setLoadingVendors] = useState(true);

  useEffect(() => {
    fetch("https://picsum.photos/v2/list?page=4&limit=10")
      .then((res) => res.json())
      .then((data) => {
        setTopPicks(data);
        setLoadingTopPicks(false);
      })
      .catch(() => setLoadingTopPicks(false));
  }, []);

  useEffect(() => {
    fetch("https://picsum.photos/v2/list?page=2&limit=10")
      .then((res) => res.json())
      .then((data) => {
        setPromo(data);
        setLoadingPromo(false);
      })
      .catch(() => setLoadingPromo(false));
  }, []);

  useEffect(() => {
    fetch("https://picsum.photos/v2/list?page=3&limit=10")
      .then((res) => res.json())
      .then((data) => {
        setVendors(data);
        setLoadingVendors(false);
      })
      .catch(() => setLoadingVendors(false));
  }, []);

  const renderImageItem = ({ item }: { item: ImageType }) => (
    <View style={[homestyle.promoFoods]}>
      <TouchableOpacity activeOpacity={0.9}>
        <Image
          style={[homestyle.promoFoodsImg]}
          source={{ uri: `https://picsum.photos/id/${item.id}/150/150` }}
        />
        <View style={[homestyle.promoFoodsTextContainer]}>
          <Text style={[homestyle.promoFoodsText]}>Bakmie Effata</Text>
          <View style={[homestyle.promoFoodsText2]}>
            <Image
              style={{ width: 10, alignSelf: "center" }}
              source={require("../../assets/images/Map Pin.png")}
            ></Image>
            <Text style={[homestyle.promoFoodsText2]}>FOODPARK BINUS</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderVendorItem = ({ item }: { item: ImageType }) => (
    <View style={[homestyle.AllVendors]}>
      <TouchableOpacity activeOpacity={0.9}>
        <Image
          style={[homestyle.promoFoodsImg]}
          source={{ uri: `https://picsum.photos/id/${item.id}/360/210` }}
        />
        <View style={[homestyle.VendorsTextContainer]}>
          <Text style={[homestyle.promoFoodsText]}>Bakmie Effata</Text>
          <View style={[homestyle.promoFoodsText2]}>
            <Image
              style={{ width: 10, alignSelf: "center" }}
              source={require("../../assets/images/Map Pin.png")}
            ></Image>
            <Text style={[homestyle.promoFoodsText2]}>FOODPARK BINUS</Text>
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
        <View style={homestyle.UpperContainer}>
          <View style={homestyle.header}>
            <TouchableOpacity style={[homestyle.headerbutton]}>
              <View style={homestyle.headertextcontainer}>
                <Text style={[homestyle.text]}>Student Undergraduate</Text>
                <Text style={[homestyle.text]}>Binus@Semarang</Text>
              </View>
              <View style={[homestyle.headerimg]}>
                <Image
                  style={homestyle.headerimg}
                  source={require("../../assets/images/Chevron Down.png")}
                ></Image>
              </View>
            </TouchableOpacity>
            <Image
              style={homestyle.pp}
              source={require("../../assets/images/cardprofile.png")}
            ></Image>
          </View>
          <View>
            <Image
              style={homestyle.BannerImg}
              source={require("../../assets/images/Banner.png")}
            ></Image>
          </View>
        </View>
        <View style={homestyle.searchcontainer}>
          <Image source={require("../../assets/images/Search.png")}></Image>
          <TextInput placeholder={"What food is on your mind?"} />
        </View>
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
              keyExtractor={(item) => item.id}
              renderItem={renderImageItem}
              showsHorizontalScrollIndicator={false}
              style={{ marginVertical: 10 }}
            />
          )}
        </View>
        <View style={homestyle.Promo}>
          <Text style={homestyle.TopPicksText}>Promo</Text>
          {loadingPromo ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={promo}
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={renderImageItem}
              showsHorizontalScrollIndicator={false}
              style={{ marginVertical: 10 }}
            />
          )}
        </View>
        <View style={homestyle.BrowseAll}>
          <Text style={homestyle.TopPicksText}>Browse all vendors</Text>
          {loadingVendors ? (
            <ActivityIndicator size="large" />
          ) : (
            <View style={{ marginVertical: 10 }}>
              {vendors.map((item) => (
                <React.Fragment key={item.id}>
                  {renderVendorItem({ item })}
                </React.Fragment>
              ))}
            </View>
          )}
        </View>
        <Text style={[homestyle.last]}>
          Oops, you have seen all the tenant that{"\n"}we have to offer
        </Text>
      </ScrollView>

      <TouchableOpacity style={homestyle.BuyButtonContainer}>
        <View style={homestyle.BuyButton}>
          <Text style={homestyle.BuyButtonText1}>1 item</Text>
          <Text style={homestyle.BuyButtonText2}>Rp 20.000</Text>
        </View>
        <Image
          source={require("../../assets/images/Shopping Cart.png")}
        ></Image>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
