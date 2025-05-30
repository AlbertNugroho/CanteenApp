import { StyleSheet } from "react-native";

const vendordetailstyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontFamily: "CalibriBold",
    color: "#000000",
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginVertical: 5,
    shadowColor: "#000",
    padding: 15,
    elevation: 2,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(128, 128, 128, 0.5)", // semi-transparent grey
    zIndex: 1,
    borderRadius: 10, // match your container radius if needed
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontFamily: "CalibriBold",
    color: "#000000",
  },
  description: {
    fontSize: 14,
    fontFamily: "Calibri",
    color: "#757575",
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    fontFamily: "CalibriBold",
    color: "#FF5722",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#000000",
    width: "100",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  addButtontoppicks: {
    backgroundColor: "#ffffff",
    width: "100%",
    borderColor: "#000000",
    borderWidth: 2,
    padding: 10,
    position: "absolute",
    bottom: 10,
    borderRadius: 20,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  availability: {
    fontSize: 14,
    fontFamily: "Calibri",
    color: "#4CAF50",
    marginTop: 5,
  },
  bought: {
    fontSize: 14,
    fontFamily: "Calibri",
    color: "#F44336",
    marginTop: 5,
  },
  bgimage: {
    width: "100%",
    height: 200,
    marginBottom: 110,
  },
  ppimg: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  vendorname: {
    fontSize: 18,
    fontFamily: "CalibriBold",
    color: "#000000",
  },
  headercontainer: {
    position: "absolute",
    flexDirection: "row",
    top: 150,
    paddingHorizontal: 20,
    height: 150,
    width: "90%",
    elevation: 5,
    shadowColor: "#000",
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    alignSelf: "center",
  },
  header: {
    flexDirection: "column",
    marginLeft: 10,
  },
  TopPicksContainer: {
    width: 170,
    height: 290,
    marginRight: 10,
    marginBottom: 40,
  },
  FoodImg: {
    width: "100%",
    height: "100%",
    height: 150,
    borderRadius: 10,
    elevation: 2,
  },
  FoodTextContainer: {
    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "50%",
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
  },
  FoodText: {
    color: "black",
    fontFamily: "CalibriBold",
    fontSize: 14,
  },
  FoodText2: {
    color: "black",
    fontSize: 10,
    fontFamily: "Calibri",
  },
});

export default vendordetailstyle;
