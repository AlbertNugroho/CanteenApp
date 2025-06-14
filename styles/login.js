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
    paddingTop: "50%",
    paddingBottom: "20%"
  },
  buttontext: {
    fontFamily: "Calibri",
    paddingHorizontal: 10,
    textAlign: "center",
    fontSize: 14,
  },
  button: {
    flexDirection: "row",
    marginTop: 20,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: "5%",
    backgroundColor: "white",
    borderRadius: 5,
    alignSelf: "center",
  },
  microsoftlogo: {
    width: 20,
    height: 20,
  },
  formContainer: {
    width: "90%",
  },
  label: {
    fontFamily: "PoppinsMedium",
    fontSize: 14,
    marginBottom: 4,
    color: "#444",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 14,
    fontFamily: "Calibri",
    color: "#000",
  },
  message: {
    marginTop: 20,
    fontSize: 14,
    color: "#ffffff",
    fontFamily: "PoppinsMedium",
    textAlign: "center",
  },
});

export default login;
