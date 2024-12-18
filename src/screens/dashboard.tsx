import { View } from "react-native"
import { InfoCard } from "./dashboard/infoCard"
import { Header } from "./dashboard/header"
import { TaskCard } from "./dashboard/taskCard"
import { Category } from "./dashboard/Category"
import { NavigationProp } from "@react-navigation/native"


export const DashboardScreen = (props:{navigation:NavigationProp<any>}) => {

    return(
        <View style={{flex:1}}> 
            <InfoCard> 
                <Header amount={2000} name="Zin Zin" member="Gold" logo=""/>
                <TaskCard 
                    current={4} 
                    header="Daily Tasks" 
                    progress={0.3} 
                    totalQuestion={10} 
                />
            </InfoCard>
            <Category navigate={(route,param)=>props.navigation.navigate(route,param)} />

        </View>
    )
}



