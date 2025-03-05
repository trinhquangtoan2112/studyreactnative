import { Pressable, Image } from "react-native";
import React from "react";
import { IImageButtonProps } from "./type";
import { Images } from "@/themes/Images";

export default function ImageButton({ imageLink, onPress }: IImageButtonProps) {
  return (
    <Pressable onPress={onPress}>
      <Image
        source={require("@/assets/images/header/arrow-left-circle.png")}
        resizeMode="cover"
      ></Image>
    </Pressable>
  );
}
