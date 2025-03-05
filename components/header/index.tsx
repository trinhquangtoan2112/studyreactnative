import { Image, Text, View } from "react-native";
import React from "react";
import { styles } from "./styles";
import ImageButton from "../button/ImageButton";
import { Images } from "@/themes/Images";

export default function Header() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/header/BackGround.png")}
        resizeMode="cover"
        style={styles.imgContainer}
      ></Image>
      <View style={styles.headerContainer}>
        <View style={styles.backButton}>
          <ImageButton
            imageLink={"@/assets/images/header/arrow-left-circle.png"}
            onPress={() => {
              console.log(122);
            }}
          ></ImageButton>
        </View>

        <Text>Liên kết ví điện tử</Text>
      </View>
    </View>
  );
}
