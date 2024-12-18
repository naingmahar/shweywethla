import { ImageBackground, StyleProp, StyleSheet, ViewStyle } from "react-native"

export const BaseUrl = "https://lclb.s3.ap-southeast-1.amazonaws.com/"
export const BgPhoto = ({uri,style}:{uri:string,style:StyleProp<ViewStyle>}) => {
    return(
        <ImageBackground resizeMode="cover" source={{uri:BaseUrl+uri}} style={style}  />
    )
}

export const ShapStyles = StyleSheet.create({
    circle:{
      width:100,
      height:100,
    //   backgroundColor:"red"
    }
  });
    