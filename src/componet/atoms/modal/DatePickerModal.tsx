// import { FC, createRef, useEffect, useState } from "react"
// import { Image, StyleSheet, View } from "react-native";
// import moment from "moment";
// import { Picker } from "react-native-wheel-pick";
// import { IEsModelRefProps } from "../Types/IModal";
// import { EsModel } from "../container/ModalContainer";
// import { FlexContainer, FlexRowContainer } from "../container/FlexContainer";
// import { EsSmallText, EsTextHeader } from "../EsText";
// import { EsButton } from "../container/EsButton";



// export const DatePickerModal:FC<{modelRef:React.RefObject<IEsModelRefProps>,navigateTo:()=>void}> = (props) =>{

//     const [currentDate,setCurrentDate] = useState("")
//     const [nextSevenDays,setNextSevenDays] = useState<Array<string>>([])

//     useEffect(()=>{
//         let twoWeeksWithoutWeekend:Array<string> = []
//         for (let index = 1; index < 17; index++) {
//             let currentDate = moment().add(index,"day")
//             if(currentDate.day()!= 0 && currentDate.day()!= 6){
//                 twoWeeksWithoutWeekend.push(currentDate.format("DD ddd , MMM"))
//             }
//         }

//         let defaultDate = moment(twoWeeksWithoutWeekend[0],"DD ddd , MMM").format("DD ddd , MMM YYYY")
//         setCurrentDate(defaultDate)
//         setNextSevenDays(twoWeeksWithoutWeekend)
//     },[])

//     return(
//         <EsModel ref={props.modelRef}>
//             <FlexContainer noneBasicStyle fullWidth fullFlex style={{backgroundColor:"rgba(180,180,180,0.7)"}}>
//                 <View style={{height:"20%"}}></View>
//                 <FlexContainer fullFlex  style={{borderRadius:10,backgroundColor:ESCardColor.black}}>
//                     <FlexRowContainer noneBasicStyle style={{justifyContent:"flex-end"}}>
//                         <FlexContainer isTouchable onPress={()=>{props.modelRef.current?.close()}}><Image source={icoClose} /></FlexContainer>
//                     </FlexRowContainer>
//                     <FlexContainer noneBasicStyle style={{paddingHorizontal:20}}>
//                         <EsTextHeader 
//                             style={{textAlign:"left"}} 
//                             noneBasicStyle color={ESColor.borderColor}>
//                                 {"Select MoveIn Date"}
//                         </EsTextHeader>
//                         <EsSmallText color={ESColor.smokyWhite}>
//                             {"You’ve selected "} 
//                             <EsSmallText defaultColor="white" style={{fontWeight:"700"}}>{`${props.previous.plan?.storage_plan_name} `}</EsSmallText>
//                             {"for "} 
//                             <EsSmallText defaultColor="white" style={{fontWeight:"700"}}>{`${props.previous.unit_selection} at ${props.previous.facility}. `}</EsSmallText>
//                             {" You can now select your move-in date, up to a maximum of 14 days from now, into your storage unit."}
//                         </EsSmallText>

//                         <EsSmallText 
//                             alignCenter 
//                             style={{marginTop:30,marginBottom:20}} defaultColor="white">{currentDate}</EsSmallText>

//                         <View style={{borderBottomWidth:1,borderBottomColor:ESColor.borderColor,opacity:0.1}}></View>

//                         <Picker
//                             // style={{ backgroundColor: ESCardColor.black, height: 215 }}
//                             textColor="white"
//                             isShowSelectBackground={false}
//                             textSize={17}
//                             pickerData={nextSevenDays}
//                             itemStyle={{borderBottomWidth:1,borderBottomColor:ESColor.borderColor}}
//                             onValueChange={(value:string) => { 
//                                 setCurrentDate(value.replace("(Today)"," ")+moment().format("YYYY")) 
//                             }}
//                         />

//                         <EsButton onPress={
//                             () =>{
                               
//                             }
//                         } title="Confirm" style={{marginTop:40}} />

//                     </FlexContainer>


//                 </FlexContainer>
//             </FlexContainer>
//         </EsModel>
//     )
// }



// const styles = StyleSheet.create({
//     cycleBox: {backgroundColor:"red",justifyContent:"center",alignItems:"center"},
//     square:{
//         borderColor:Colors.white,
//         borderWidth:1,
//         padding:10,
//         borderRadius:10,
//         justifyContent:"center",
//         alignItems:"center",
//         width:56,
//         height:56
//     }
// })