import { StyleSheet } from "react-native";

const activitystyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 15,
  },
  text: {
    fontFamily: "Calibri",
    fontSize: 16,
    textAlign: "center",
    width: 80,
    marginRight: 30,
  },
  buttoncontainer: {
    marginTop: 15,
    flexDirection: "row",
  },
  underlineText: {
    borderBottomWidth: 2,
    borderBottomColor: "#000", // or any color
    paddingBottom: 5, // optional, for spacing
  },
  content: {
    marginBottom: 40,
    borderRadius: 20,
    marginTop: 20,
  },
  AllVendors: {
    width: "100%",
    height: 210,
    marginBottom: 20,
    marginRight: 10,
  },
  promoFoodsImg: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    elevation: 2,
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
  indicator: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontFamily: "Calibri",
    color: "#ffffff",
    backgroundColor: "#000000",
    textAlign: "center",
    width: 150,
    borderRadius: 20,
    padding: 5,
  },
});
export default activitystyle;
