import { COLORS } from "@/themes/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "12%",
    position: "relative",
  },

  imgContainer: {
    width: "100%",
    flex: 1,
  },
  headerContainer: {
    position: "absolute",
    bottom: "10%",
    width: "90%",
    left: "50%",
    transform: [{ translateX: "-50%" }],
    display: "flex",
    flexDirection: "row",
  },
  backButton: {
    position: "absolute",
  },
  titleText: {
    color: COLORS.white,
    fontSize: 16,
    width: "100%",
    fontWeight: "500",
    textAlign: "center",
  },
});
