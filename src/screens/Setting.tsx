import { ScrollView, StyleSheet, Text } from "react-native"
import { BgPhoto } from "../componet/atoms/Photo/BgPhoto"
import { FlexContainer, FlexRowContainer } from "../componet/atoms/container/FlexContainer"
import { EsNormalHeader, EsNormalText, EsSmallHeader, EsXsHeader } from "../componet/atoms/EsText"
import { useAtom } from "jotai"
import { AuthAtom } from "../features/jotai/model/auth"
import { MainNav, RootStackParamList } from "../nav/main.nav"
import { Icon, IconKey, IconsSize } from "../componet/atoms/icons"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { getVersion } from "react-native-device-info"
import { Colors } from "../res/color"
import { Images, getUserImage } from "../res/images"

// const logo = "https://lclb.s3.ap-southeast-1.amazonaws.com/operation/1737398123578.png"

interface IMenuGroup{
    title:string,
    items:IMenuItem[]
}

interface IMenuItem {name:string,nav:MainNav,icon:IconKey}

const MenuItem = (props:IMenuItem) => {
    const navigation:NavigationProp<RootStackParamList> = useNavigation();
    return(
        <FlexRowContainer noneBasicStyle style={styles.menuContainer} onPress={()=>{navigation.navigate(props.nav)}} isTouchable>
            <Icon className={{marginRight:10,color:Colors.settingIcon}} size={IconsSize.lg} icon={props.icon} />
            <EsNormalText noneBasicStyle>{props.name}</EsNormalText>
        </FlexRowContainer>
    )
}
const MenuGroup = (props:IMenuGroup) => {
    return(
        <FlexContainer fullWidth>
            <EsXsHeader noneBasicStyle style={{marginBottom:20}}>{props.title}</EsXsHeader>
            {
                props.items.map((row,index)=>{
                    return(
                        <MenuItem key={index} {...row} />
                    )
                })
            }
        </FlexContainer>
    )
}
export const Setting = () => {
    const [getUser] = useAtom(AuthAtom)
    return (
        <ScrollView >
            <FlexContainer centerAlign style={styles.container}>
                {/* <BgPhoto isNotUrl={true} isOutsitePhoto uri={Images.logo} style={styles.image}  /> */}
                <EsNormalHeader>{getUser?.name}</EsNormalHeader>
                {/* <MenuGroup 
                    title="General" 
                    items={
                        [
                            {icon:IconKey.user,name:"Profile",nav:MainNav.HOME},
                        ]
                    } 
                    /> */}
                {/* <MenuGroup 
                    title="Helper Program" 
                    items={
                        [
                            {icon:IconKey.info,name:"ကူညီသူ အစီစဥ် တွင်ပါဝင်မည်",nav:MainNav.helper},
                        ]
                    } 
                    /> */}
                <MenuGroup 
                    title="About" 
                    items={
                        [
                            {icon:IconKey.info,name:"About Us",nav:MainNav.aboutUs},
                            {icon:IconKey.document,name:"Terms and Conditions",nav:MainNav.TermsAndConditions},
                            {icon:IconKey.privacyPolicy,name:"Privacy Policy",nav:MainNav.privacypolicy},
                            {icon:IconKey.user,name:"User Data Policy",nav:MainNav.datapolicy},
                        ]
                    } 
                    />
                <MenuGroup 
                    title="User Data Management" 
                    items={
                        [
                            {icon:IconKey.info,name:"Delete Account",nav:MainNav.deleteAccount},
                        ]
                    } 
                    />
            </FlexContainer>
            <EsNormalText style={{textAlign:"center",fontWeight:"600",marginBottom:20}}>App Version {getVersion()}</EsNormalText>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    image:{
        width:80,
        height:80,
        borderRadius:40,
        overflow:"hidden",
        backgroundColor:"white",
        marginRight:10
    },
    container:{
        paddingTop:50,
        paddingBottom:20
    },
    menuContainer:{
        alignItems:"center",
        paddingVertical:10,
        paddingLeft:10,
        borderColor:"rgba(0,0,0,0.1)",
        borderWidth:1,
        borderRadius:10,
        marginBottom:10
    }
})