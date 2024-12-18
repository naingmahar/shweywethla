import { ScrollView, StyleSheet, Text, View } from "react-native"
import { Icon, IconKey, IconsSize } from "../../componet/atoms/icons"
import { Colors } from "../../res/color"
import { ICategory } from "../../types/models/ICategory"
import { useGetAllCategories } from "../../features/query/products/getAllInfo"
import { useEffect } from "react"
import { FlexContainer } from "../../componet/atoms/container/FlexContainer"
import { BgPhoto } from "../../componet/atoms/Photo/BgPhoto"
import { MainNav } from "../../nav/main.nav"

type ICategories = {
    categories:ICategory[]
}

const styles = StyleSheet.create({
    container:{paddingHorizontal:10,marginTop:20},
    titleContainer:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:8},
    header:{fontSize:15,fontWeight:"500"},
    viewAll:{fontSize:11,fontWeight:"500"},
    categoriesContainer:{flexDirection:"row",paddingVertical:10},
    cotegoryContainer:{marginHorizontal:10,justifyContent:"center",alignItems:"center"},
    imageContainer:{padding:3,borderWidth:1,borderColor:Colors.infoCard,borderRadius:10,marginBottom:5}
})
export const Category = (props:{navigate:(route:string,param:{category:string})=>any}) => {

    const getAllCategories = useGetAllCategories();
    useEffect(()=>{
        getAllCategories.mutate()
    },[])

    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.header}>Quiz Categories</Text>
                <FlexContainer isTouchable noneBasicStyle onPress={()=> getAllCategories.mutate()}>
                    <Text style={styles.viewAll}>View All</Text>
                </FlexContainer>
            </View>
            <ScrollView horizontal style={styles.categoriesContainer}>
                {
                    (getAllCategories.data||[]).map((row,index)=>(
                        <FlexContainer isTouchable noneBasicStyle onPress={()=>props.navigate(MainNav.QUIZZES,{category:String(row.id)})} key={index} style={styles.cotegoryContainer}>
                            <View style={styles.imageContainer}> 
                                <BgPhoto uri={row.image} style={{width:50,height:50}} />
                                {/* <Icon icon={IconKey.english} size={IconsSize.xxxl} className={{color:Colors.progressCycle}} /> */}
                            </View>
                            <Text>{row.name}</Text>
                        </FlexContainer>
                    ))
                }
            </ScrollView>
        </View>
    )
}