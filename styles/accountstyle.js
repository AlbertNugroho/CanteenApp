import { StyleSheet } from "react-native";

const accountstyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
  },
  card: {
    width: "100%",
    height: "35%",
  },
  profilecontainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  pp: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 360,
    marginLeft: 30,
    margin: 10,
    elevation: 5,
    shadowColor: "#000",
  },
  text: {
    fontSize: 16,
    fontFamily: "Calibri",
  },
  infocard: {
    flexDirection: "column",
    width: "90%",
    marginTop: 10,
    alignSelf: "center",
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000000",
  },
  label: {
    fontSize: 14,
    color: "#454545",
    fontFamily: "Abel",
    marginBottom: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#000000B0",
    width: "100%",
    alignSelf: "stretch",
    marginTop: 50,
  },
  infodivider: {
    height: 1,
    backgroundColor: "#000000B0",
    marginVertical: 5,
  },
  infocontainer: {
    marginHorizontal: 20,
    width: "100%",
  },
  buttoncontainer: {
    marginHorizontal: 20,
    flexDirection: "row",
  },
  buttontext: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: "Calibri",
    alignSelf: "center",
  },
  bottominfo: {
    flexDirection: "collumn",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
  },
  bottomtext: {
    fontSize: 14,
    textDecorationLine: "underline",
    color: "#000000B0",
    fontFamily: "Abel",
  },
  info: {
    fontSize: 12,
    color: "##000000B0",
    fontFamily: "Abel",
  },
});

export default accountstyle;
