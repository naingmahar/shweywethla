import { View } from "react-native"
import { InfoCard } from "./dashboard/infoCard"
import { Header } from "./dashboard/header"
import { TaskCard } from "./dashboard/taskCard"
import { Category } from "./dashboard/Category"
import { NavigationProp } from "@react-navigation/native"
import { useAtom } from "jotai"
import { AuthAtom } from "../features/jotai/model/auth"
import { RealtimeTask } from "../features/realtime/userinfo"
import { Colors } from "../res/color"
import { useEffect } from "react"
import { Persit, STORAGE_KEY } from "../features/storage/localstorage"
import TrackPlayer from "react-native-track-player"

export const DashboardScreen = (props:{navigation:NavigationProp<any>}) => {

    const [getUser] = useAtom(AuthAtom)

    useEffect(()=>{
        TrackPlayer.pause()
        // Persit.clearAll()
        // Persit.removeItem(STORAGE_KEY.quizInfo+"_"+6)
    },[])

    return(
        <View style={{flex:1,backgroundColor:Colors.transprentGreen}}> 
            <InfoCard> 
                <Header gender={getUser?.gender as any} amount={getUser?.id||0} name={getUser?.name||""} member="Gold" logo=""/>
                {/* <TaskCard 
                    current={4} 
                    header="Daily Tasks" 
                    progress={0.3} 
                    totalQuestion={10} 
                /> */}
                <RealtimeTask id={getUser?.id||0} />
            </InfoCard>
            <Category navigate={(route)=>props.navigation.navigate(route)} />

        </View>
    )
}



