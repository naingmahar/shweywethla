import { ScrollView, StyleSheet, Text, View } from "react-native"
import { Icon, IconKey, IconsSize } from "../../componet/atoms/icons"
import { Colors } from "../../res/color"
import { ICategory } from "../../types/models/ICategory"
import { useGetAllCategories } from "../../features/query/products/getAllInfo"
import { useEffect } from "react"
import { FlexContainer } from "../../componet/atoms/container/FlexContainer"
import { BgPhoto } from "../../componet/atoms/Photo/BgPhoto"
import { MainNav } from "../../nav/main.nav"
import { useRecoilState } from "recoil"
import { quizIndexState } from "../../features/recoilState"
import { GetStoredQuizzes } from "../../features/storage/QuizStore"
import { EsNormalText, EsSmallText, EsXsText } from "../../componet/atoms/EsText"

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
export const Category = (props:{navigate:(route:string)=>any}) => {

    const getAllCategories = useGetAllCategories();
    const [currentQuizState,setNextQuizState] = useRecoilState(quizIndexState)
    useEffect(()=>{
        getAllCategories.mutate()
    },[])

    const _onPress = (category:string|number) =>{
        setNextQuizState({categoryId:parseInt(String(category)),index:0,id:0})
        props.navigate(MainNav.QUIZZES)
    }

    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <EsNormalText noneBasicStyle style={styles.header}>Quiz Categories</EsNormalText>
                <FlexContainer isTouchable noneBasicStyle onPress={()=> getAllCategories.mutate()}>
                    <EsNormalText noneBasicStyle style={styles.viewAll}>View All</EsNormalText>
                </FlexContainer>
            </View>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.categoriesContainer}>
                {
                    (getAllCategories.data||[]).map((row,index)=>(
                        <FlexContainer isTouchable noneBasicStyle onPress={()=>_onPress(row.id||0)} key={index} style={styles.cotegoryContainer}>
                            <View style={styles.imageContainer}> 
                                <BgPhoto uri={row.image} style={{width:50,height:50}} />
                                {/* <Icon icon={IconKey.english} size={IconsSize.xxxl} className={{color:Colors.progressCycle}} /> */}
                            </View>
                            <EsXsText noneBasicStyle>{row.name}</EsXsText>
                        </FlexContainer>
                    ))
                }
            </ScrollView>
        </View>
    )
}