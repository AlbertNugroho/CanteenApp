import { Dimensions, StyleSheet } from "react-native";

export const login = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#028ED5",
  },
  text: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Calibri",
    marginTop: 10,
  },
  binuscanteenlogo: {
    paddingVertical: "60%",
  },
  buttontext: {
    
    fontFamily: "Calibri",
    paddingHorizontal: 10,
    fontSize: 14,
  },
  button: {
    flexDirection: "row",
    marginTop: 10,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    paddingVertical: "5%",
    backgroundColor: "white",
    borderRadius: 5,
  },
  microsoftlogo: {
    width: 20,
    height: 20,
  },
});

export default login;
