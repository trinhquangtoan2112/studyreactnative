/* eslint-disable @typescript-eslint/no-require-imports */
import { Pressable, Image } from "react-native";
import React from "react";
import { IImageButtonProps } from "./type";

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
