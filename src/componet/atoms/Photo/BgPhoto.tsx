import { ImageBackground, StyleProp, StyleSheet, ViewStyle } from "react-native"

export const BaseUrl = "https://lclb.s3.ap-southeast-1.amazonaws.com/"
export const BgPhoto = ({uri,style,isOutsitePhoto,isNotUrl}:{uri:any,isOutsitePhoto?:boolean,style:StyleProp<ViewStyle>,isNotUrl?:boolean}) => {
  const urlObject =  isNotUrl? uri : {uri:isOutsitePhoto ? uri : BaseUrl+uri} 
  return(
        <ImageBackground resizeMode="cover"  source={urlObject} style={style}  />
    )
}

export const ShapStyles = StyleSheet.create({
    circle:{
      width:100,
      height:100,
    //   backgroundColor:"red"
    }
  });
    