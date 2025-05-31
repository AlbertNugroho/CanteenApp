import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import activitystyle from "../../styles/activitystyle";
import { foodOrderData } from "../../data/ActivityData";
import { router } from "expo-router";
import { FlatList, Image } from "react-native";

const renderVendorItem = ({ item }) => (
  <View style={[activitystyle.AllVendors]}>
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: item.ongoing ? "../OrderOngoing" : "../VendorDetails",
          params: { id: item.food.id },
        })
      }
    >
      <Image
        style={[activitystyle.promoFoodsImg]}
        source={{ uri: item.food.image }}
      />
      <View style={[activitystyle.VendorsTextContainer]}>
        <Text style={[activitystyle.promoFoodsText]}>{item.food.name}</Text>
        <View style={[activitystyle.promoFoodsText2, { flexDirection: "row" }]}>
          <Image
            style={{ width: 10, alignSelf: "center", marginRight: 5 }}
            source={require("../../assets/images/Map Pin.png")}
          />
          <Text style={[activitystyle.promoFoodsText2]}>{item.food.place}</Text>
        </View>
        <Text style={activitystyle.indicator}>
          {item.ongoing ? `Pickup Time: ${item.pickupTime}` : "Order Again"}
        </Text>
      </View>
    </TouchableOpacity>
  </View>
);

const OngoingView = ({ data }) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderVendorItem}
      ListEmptyComponent={<Text>No ongoing orders</Text>}
    />
  );
};

const HistoryView = ({ data }) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderVendorItem}
      ListEmptyComponent={<Text>No history orders</Text>}
    />
  );
};

const Activity = () => {
  const [showSecondView, setShowSecondView] = useState(false);
  const ongoingOrders = foodOrderData.filter((order) => order.ongoing);
  const historyOrders = foodOrderData.filter((order) => !order.ongoing);
  return (
    <View style={activitystyle.container}>
      <View style={activitystyle.buttoncontainer}>
        <TouchableOpacity onPress={() => setShowSecondView(false)}>
          <Text
            style={[
              activitystyle.text,
              !showSecondView && activitystyle.underlineText,
            ]}
          >
            Ongoing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowSecondView(true)}>
          <Text
            style={[
              activitystyle.text,
              showSecondView && activitystyle.underlineText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      <View style={activitystyle.content}>
        {showSecondView ? (
          <HistoryView data={historyOrders} />
        ) : (
          <OngoingView data={ongoingOrders} />
        )}
      </View>
    </View>
  );
};

export default Activity;
