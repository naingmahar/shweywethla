import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { FlexContainer, FlexRowContainer } from "../componet/atoms/container/FlexContainer"
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
// import { BarChart , CurveType, LineChart, PieChart, PopulationPyramid, RadarChart, } from "react-native-gifted-charts";

// const data=[ {value:50}, {value:80}, {value:90}, {value:70} ]

import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import moment from "moment";
import { EsNormalHeader, EsNormalText, EsSmallHeader, EsSmallText, EsTextHeader, EsXsHeader } from "../componet/atoms/EsText";
import { ESColor } from "../componet/atoms/res/EsColor";
import { useEffect, useState } from "react";
import { Colors } from "../res/color";
import EsDatePicker from "../componet/atoms/EsDatePicker";
import { Icon, IconKey, IconsSize } from "../componet/atoms/icons";
import { useGetDashboard } from "../features/query/history/createHistory";

let data = [
    {
      "value": "80",
      "label": "04-01-2025"
    },
    {
      "value": "110",
      "label": "05-01-2025"
    },
    {
      "value": "10",
      "label": "24-1-2025"
    },
    {
      "value": "20",
      "label": "25-01-2025"
    },
    {
      "value": "118",
      "label": "11-02-2025"
    },
    {
      "value": "28",
      "label": "12-02-2025"
    }
  ]
let markedDates = ():any => {
    let raw:any = {}
    data.map(row=>{
        raw[moment(row.label,"DD-MM-YYYY").format("YYYY-MM-DD")]= {selected: true,selectedColor: parseInt(row.value) >= 20 ? "green" : "red" }
    })
    return raw
}

console.log(markedDates())

const InfoBlock = (props:{label:string,val:string|number,icon:IconKey}) => {
    return(
        <FlexRowContainer style={styles.box}>
            <Icon size={IconsSize.xxl} icon={props.icon} />
           <FlexContainer>
            <EsSmallText>{props.label}</EsSmallText>
            <EsXsHeader noneBasicStyle>{props.val}</EsXsHeader>
           </FlexContainer>
        </FlexRowContainer>
    )
}
export const History = () => {
    const [clickedDateIndex,setDateIndex] = useState(0)
    const [selectedDate,setelectedDate] = useState(new Date())
    const getDashboard = useGetDashboard()

    useEffect(()=>{
        getDashboard.mutate(moment().format("DD-MM-YYYY"))
    },[])

    if(!getDashboard.data){
        return <View />
    }
    return(
        <ScrollView style={{padding:20,marginBottom:20}}>
            <EsNormalHeader>Dashboard</EsNormalHeader>
            <FlexContainer style={styles.infoCard}>
                <EsSmallText>Total Amount</EsSmallText>
                <EsTextHeader>🪙 {getDashboard.data.my.totalCoin}</EsTextHeader>
                <EsNormalText style={{textAlign:"center"}}>This day amount - {getDashboard.data.my.todayCoin} 🪙</EsNormalText>
            </FlexContainer>
            <EsDatePicker
                    isPickup
                    isError={false} 
                    label="" 
                    date={selectedDate||new Date()}
                    onChange={(date)=>{
                        console.log(date,moment(date,"x").format("DD-MM-YYYY"))
                        setelectedDate(date)
                        getDashboard.mutate(moment(date,"x").format("DD-MM-YYYY"))
                    }} 
                    placeHolder="" 
            />

            <EsXsHeader color={ESColor.darkGray}>Your Activities</EsXsHeader>
            <FlexContainer  style={[styles.infoCard,{backgroundColor:"#fff"}]}> 
                <InfoBlock label="Views Count" val={getDashboard.data.my.todayCount} icon={IconKey.chart} />
                <InfoBlock label="Income Amount" val={getDashboard.data.my.todayCoin+" 🪙"} icon={IconKey.presentation} />
                <InfoBlock label="Task Completed" val={String(getDashboard.data.my.taskCompleted)} icon={IconKey.clock} />
            </FlexContainer> 
            {/* <EsXsHeader>Referral Activities</EsXsHeader>
            <FlexContainer  style={[styles.infoCard,{backgroundColor:"#fff"}]}> 
                <InfoBlock label="Views Count" val="10" icon={IconKey.chart} />
                <InfoBlock label="Income Amount" val="10 🪙" icon={IconKey.presentation} />
                <InfoBlock label="Task Completed User" val="200" icon={IconKey.user} />
            </FlexContainer>  */}
            
        {/* <Calendar
            onDayPress={day => {
                let dateIndex =data.findIndex(row=>moment(row.label,"DD-MM-YYYY").format("YYYY-MM-DD") == day.dateString)
                setDateIndex(dateIndex)
            }}
            markedDates={markedDates()}
        />
            
        <FlexRowContainer noneBasicStyle style={styles.detailBox}>
            {clickedDateIndex != -1 && <EsNormalHeader noneBasicStyle>
                {moment(data[clickedDateIndex].label,"DD-MM-YYYY").format("LL")}
            </EsNormalHeader>}
            <EsSmallHeader noneBasicStyle style={{color:parseInt(data[clickedDateIndex].value) >= 20 ? "green" : "red"}}>
                {data[clickedDateIndex].value}
            </EsSmallHeader>
        </FlexRowContainer> */}



        </ScrollView>
    )
}


const styles = StyleSheet.create({
    infoCard:{backgroundColor:Colors.transprentGreen,borderRadius:10,marginVertical:20},
    box:{padding:8,marginRight:10,alignItems:"center"},
    detailBox:{justifyContent:"space-between",marginTop:20,backgroundColor:"white",padding:20,borderRadius:10}
})