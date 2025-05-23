import { StyleSheet } from "react-native";

const accountstyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  card: {
    width: "100%", // Ensure the card image takes up full width
    height: "20%", // Adjust height based on your image size
  },
  profilecontainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  pp: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
  text: {
    fontSize: 16,
  },
});

export default accountstyle;
