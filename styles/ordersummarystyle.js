import { StyleSheet } from "react-native";
import { Header } from "react-native/Libraries/NewAppScreen";

const ordersummarystyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
  },
  Text: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: "CalibriBold",
  },
  ordercontainer: {
    padding: 15,
    backgroundColor: "#ffffff",
    elevation: 2,
    borderRadius: 20,
    marginTop: 10,
  },
  infocontainer: {
    flexDirection: "row",
    marginVertical: 15,
  },
  infocontainertext: {
    flex: 1,
  },
  infocontainertext1: {
    fontFamily: "CalibriBold",
    fontSize: 16,
    height: 40,
  },
  infocontainertext2: {
    fontFamily: "Calibri",
    width: 80,
    fontSize: 14,
  },
  quantity: {
    fontFamily: "Calibri",
    width: 80,
    fontSize: 14,
  },
  paymenttext: {
    fontFamily: "Calibri",
    width: 100,
    fontSize: 14,
  },
  orderbutton: {
    backgroundColor: "#ECA219",
    marginTop: 30,
    alignItems: "center",
    padding: 15,
    borderRadius: 25,
  },
  buttontext: {
    fontFamily: "PoppinsMedium",
    color: "white",
    fontSize: 24,
  },
  quantityText: {
    fontFamily: "Calibri",
    fontSize: 16,
    verticalAlign: "middle",
    textAlign: "center",
  },
  counterbuttonText: {
    fontFamily: "Calibri",
    backgroundColor: "#000000",
    color: "#ffffff",
    width: 20,
    fontSize: 15,
    height: 20,
    borderRadius: 360,
    alignContent: "center",
    verticalAlign: "middle",
    includeFontPadding: false,
    textAlign: "center",
  },
  counterContainer: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    width: "40%",
    left: 0,
    justifyContent: "space-between",
  },
  paymentcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
export default ordersummarystyle;
