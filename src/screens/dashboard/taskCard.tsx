import { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native"
import * as Progress from 'react-native-progress';
import { Colors } from "../../res/color";
import { Icon, IconKey, IconsSize } from "../../componet/atoms/icons";
import { EsNormalText } from "../../componet/atoms/EsText";

const taskCardStyle = StyleSheet.create({
    container:{
        width:"100%",
        flexDirection:"row",
        alignItems:"center",
        backgroundColor:"rgba(240,240,240,0.6)",
        borderRadius:10,
        minHeight:90,
        padding:5
    },
    infoCOntainer:{
        paddingLeft:20
    },
    headerText:{
        fontSize:14,
        fontWeight:"800"
    },
    progressText:{
        fontSize:12,
        fontWeight:"600",
        color:"#585858",
        marginTop:4
    },
    progressContainer:{
        width:90,
        height:88,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"rgba(240,240,240,0.3)",
        borderRadius:15
    }

})

type ITaskCard = {
    progress:number,
    header:string,
    totalQuestion:number,
    current:number
}

export const TaskCard = (props:ITaskCard) => {
    const isComplete = props.current >= props.totalQuestion
    return(
        <View style={taskCardStyle.container}> 
            <View style={taskCardStyle.progressContainer}>
                {!isComplete && <Progress.Circle 
                    size={50} 
                    progress={props.progress} 
                    showsText={true} 
                    color={Colors.progressCycleGreen} 
                    thickness={5} 
                    formatText={() => {
                        return `${props.progress <= 100 ?(props.progress * 100).toFixed(0):100}%`
                    }}
                    textStyle={{color:"#585858",fontWeight:"800",fontSize:12}} />}
                {
                    isComplete && 
                    <Icon icon={IconKey.success} size={IconsSize.xxxl} className={{color:Colors.infoCard}} />
                }
            </View>
            <View style={taskCardStyle.infoCOntainer}>
                <EsNormalText style={taskCardStyle.headerText}>{props.header}</EsNormalText>
                {
                    !isComplete && <Text style={taskCardStyle.progressText}>Progress {props.current||0} / {props.totalQuestion} questions</Text>
                }
                {
                    isComplete && <Text style={taskCardStyle.progressText}>Completed daily task</Text>
                }
            </View>
        </View>
    )
}