import { StyleSheet } from "react-native";

const paymentstyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  qrcontainer: {
    backgroundColor: "#ECA219",
    padding: 20,
    alignItems: "center",
    borderRadius: 15,
  },
  aproval: {
    marginTop: 15,
  },
  timercontainer: {
    marginTop: 50,
    alignItems: "center",
    elevation: 2,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    padding: 20
  },
});
export default paymentstyle;
