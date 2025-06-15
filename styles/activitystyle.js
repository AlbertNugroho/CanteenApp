import { StyleSheet } from "react-native";

const activitystyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 15,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
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
  activityallcontain: {
    width: "100%",
    marginBottom: 20,
    marginRight: 10,
    padding: 15,
    borderRadius: 20,
    backgroundColor: "white",
    elevation: 2,
  },
  activitycontainertext: {
    color: "black",
    fontFamily: "CalibriBold",
    fontSize: 14,
  },
  activitycontainertext2: {
    flexDirection: "row",
    color: "black",
    fontSize: 12,
    fontFamily: "Calibri",
  },
  activitycontainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  activityindicator: {
    fontFamily: "Calibri",
    color: "#ffffff",
    backgroundColor: "#000000",
    textAlign: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    padding: 5,
    borderRadius: 6,
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    width: "60%",
    
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
