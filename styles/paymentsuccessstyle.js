import { StyleSheet } from "react-native";

const paymentsuccessstyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 20,
    backgroundColor: "#ECA219",
  },
  aproval: {
    marginTop: "20%",
    marginBottom: 10,
    width: 90,
    alignSelf: "center",
    height: 90,
  },
  infocontainer: {
    backgroundColor: "#F9CA72",
    borderRadius: 20,
    padding: 20,
    elevation: 1,
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    alignSelf: "center",
    bottom: "10%",
  },
});
export default paymentsuccessstyle;
