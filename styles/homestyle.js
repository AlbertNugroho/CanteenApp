import { StyleSheet } from "react-native";

const homestyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
  },
  text: {
    fontSize: 12,
    color: "white",
    fontFamily: "CalibriBold",
  },
  headerimg: {
    height: 15,
    width: 15,
    alignSelf: "center",
    justifyContent: "flex-end",
    marginRight: 15,
  },
  headertextcontainer: {
    flex: 1,
  },
  headerbutton: {
    flexDirection: "row",
    marginVertical: 10,
    paddingLeft: 20,
    backgroundColor: "rgba(0, 0, 0, 0.69)",
    borderRadius: 50,
    paddingVertical: 10,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 40,
  },
  pp: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
  BannerImg: {
    alignSelf: "center",
    width: "100%",
    height: 200,
    objectFit: "fill",
  },
  searchcontainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    alignItems: "center",
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    top: 290,
    width: "90%",
    elevation: 2,
  },
  UpperContainer: {
    backgroundColor: "#F7760D",
  },
  TopPicks: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  TopPicksText: {
    fontFamily: "CalibriBold",
    color: "black",
    fontSize: 20,
  },
  promoFoods: {
    width: 150,
    height: 150,
    marginRight: 10,
    marginBottom: 10,
  },
  promoFoodsImg: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    elevation: 2,
  },
  promoFoodsbg: {
    position: "absolute",
    height: "40%",
    width: "100%",
    bottom: 0,
  },
  promoFoodsTextContainer: {
    backgroundColor: "white",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "40%",
    padding: 10,
  },
  promoFoodsText: {
    color: "black",
    fontFamily: "CalibriBold",
    fontSize: 14,
  },
  promoFoodsText2: {
    flexDirection: "row",
    color: "black",
    fontSize: 10,
    fontFamily: "Calibri",
  },
  Promo: {
    paddingHorizontal: 20,
  },
  BrowseAll: {
    paddingHorizontal: 20,
  },
  AllVendors: {
    width: 360,
    height: 210,
    marginBottom: 10,
    marginRight: 10,
  },
  VendorsTextContainer: {
    backgroundColor: "white",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "30%",
    padding: 10,
  },
  last: {
    textAlign: "center",
    fontFamily: "CalibriBold",
    marginBottom: 100,
  },
  BuyButtonContainer: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "#ECA219",
    width: "95%",
    alignItems: "center",
    borderRadius: 50,
    marginHorizontal: 10,
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  BuyButton: {
    flex: 1,
    borderRadius: 50,
    marginVertical: 10,
  },
  BuyButtonText1: {
    fontSize: 16,
    fontFamily: "CalibriBold",
    color: "white",
  },
  BuyButtonText2: {
    fontSize: 12,
    fontFamily: "CalibriBold",
    color: "white",
  },
});

export default homestyle;
