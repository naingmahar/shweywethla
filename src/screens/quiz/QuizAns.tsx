import { FlexRowContainer } from "../../componet/atoms/container/FlexContainer"
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Icon, IconKey, IconsSize } from "../../componet/atoms/icons";
import { EsNormalText } from "../../componet/atoms/EsText";

export const QuizzAns = (props:{correctAnsIndex:string,multipleChoiceLabel:string,index:number,ans:number,getBorderColor:()=>string,chooseAns:(index:number)=>any}) => {
    return (
        <FlexRowContainer 
            shadow 
            style={{
                padding:8,
                marginVertical:10,
                borderRadius:10,
                backgroundColor:"white",
                borderWidth:1,
                borderColor:props.getBorderColor()
            }} 
            noneBasicStyle 
            isTouchable 
            fullWidth
            onPress={()=>{
                props.chooseAns(props.index+1)
            }}>
            <BouncyCheckbox 
                size={20}  
                fillColor={props.getBorderColor()}
                unFillColor={"#fff"}
                iconStyle={{ borderColor: "red",borderWidth:1 }}
                isChecked={props.index+1 == props.ans}         
                iconComponent={
                    props.correctAnsIndex !== String(props.ans) && props.ans == props.index+1
                    ? <Icon icon={IconKey.close} size={IconsSize.xs} className={{color:"white",fontWeight:"800"}} />
                    :null
                }
                onPress={(isChecked: boolean) => { props.chooseAns(props.index+1)}} />
            <EsNormalText noneBasicStyle>{props.multipleChoiceLabel}</EsNormalText>
        </FlexRowContainer>
    )
} 