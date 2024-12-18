import { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native"
import * as Progress from 'react-native-progress';
import { Colors } from "../../res/color";

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
    return(
        <View style={taskCardStyle.container}> 
            <View style={taskCardStyle.progressContainer}>
                <Progress.Circle 
                    size={50} 
                    progress={props.progress} 
                    showsText={true} 
                    color={Colors.progressCycle} 
                    thickness={5} 
                    formatText={() => {
                        return `${props.progress * 100}%`
                    }}
                    textStyle={{color:"#585858",fontWeight:"800",fontSize:12}} />
            </View>
            <View style={taskCardStyle.infoCOntainer}>
                <Text style={taskCardStyle.headerText}>{props.header}</Text>
                <Text style={taskCardStyle.progressText}>Progress {props.current} / {props.totalQuestion} questions</Text>
            </View>
        </View>
    )
}