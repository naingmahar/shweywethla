import { StyleSheet, Text, View } from "react-native"
import { BgPhoto } from "../../componet/atoms/Photo/BgPhoto"
import { Colors } from "../../res/color"

const HeaderStyle = StyleSheet.create({
    container:{
        width:"100%",
        alignItems:"center",
        flexDirection:"row",
        paddingVertical:20,
        justifyContent:"space-between"
    },
    userInfoContainer:{
        alignItems:"center",
        flexDirection:"row",
    },
    image:{
        width:60,
        height:60,
        borderRadius:30,
        overflow:"hidden",
        backgroundColor:"white",
        marginRight:10
    },
    coin:{
        width:25,
        height:25,
        borderRadius:25,
        overflow:"hidden",
        backgroundColor:"white"
    },
    pointContainer:{
        width:110,
        backgroundColor:"#fff",
        paddingHorizontal:10,
        paddingVertical:5,
        alignItems:"center",
        borderRadius:50,
        flexDirection:"row",
        justifyContent:"center"
    },
    name:{
        fontSize:16,
        fontWeight:"700",
        color:"#fafafa"
    },
    memberTag:{
        backgroundColor:Colors.progressCycle,
        borderRadius:20,
        textAlign:"center",
        fontSize:10,
        fontWeight:"600",
        marginTop:5,
        paddingVertical:3,
        color:"white",
        borderWidth:1,
        borderColor:"white",
        textShadowColor:'#585858',
        textShadowOffset:{width: 1, height: 1},
        textShadowRadius:10,
    },
    amount:{
        marginLeft:10,
        fontWeight:"600",
        fontSize:13
    }
})
type IHeader = {
    logo:string,
    name:string,
    amount:number,
    member:string
}
export const Header = (props:IHeader) => {
    const logo = "https://png.pngtree.com/png-vector/20200121/ourmid/pngtree-green-leaf-logo-vector-template-png-image_2132738.jpg"
    const coin= "https://static.vecteezy.com/system/resources/previews/012/366/544/non_2x/gold-coin-dollar-coin-cryptocurrency-crypto-coin-blockchain-technology-currency-gold-crypto-coin-vector-illustration-background-free-png.png"
    return(
        <View style={HeaderStyle.container}> 
            <View style={HeaderStyle.userInfoContainer}>
                <BgPhoto uri={logo} style={HeaderStyle.image}  />
                <View>
                    <Text style={HeaderStyle.name}>{props.name||"Zin Mar Aung"}</Text>
                    <Text style={HeaderStyle.memberTag}>{props.member||"Silver"}</Text>
                </View>
            </View>
            <View style={HeaderStyle.pointContainer}>
                <BgPhoto uri={coin} style={HeaderStyle.coin}  />
                <Text style={HeaderStyle.amount}>{props.amount||"10,000"}</Text>
            </View>
        </View>
    )
}