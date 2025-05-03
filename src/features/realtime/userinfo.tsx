import database from '@react-native-firebase/database';
import { firebase } from '@react-native-firebase/database';
import { useEffect, useState } from 'react';
import { EsNormalText } from '../../componet/atoms/EsText';
import { StyleProp } from 'react-native';
import moment from 'moment';
import { TaskCard } from '../../screens/dashboard/taskCard';

const db = firebase
  .app()
  .database('https://shweywethla-49cb4-default-rtdb.asia-southeast1.firebasedatabase.app/')

export const getCoinRD = () =>{
    return new Promise((res,rej)=>{
        db
        .ref('coin')
        .once('value')
        .then(snapshot => {
            // console.log('User data: ', snapshot.val());
            return res(snapshot.val())
        })
        .catch(error=>{
            console.log("USer data error",error)
            return rej(error)
        })
    })
}

export const RealtimeCoin = ({id,style}:{id:string,style?:StyleProp<Text>}) =>{
    const [coin,setCoin] = useState(0.0);

    const getCoin = () => {
            db
            .ref('/coin/'+id)
            .on('value', snapshot => {
                // console.log('User data: ', snapshot.val());
                setCoin(snapshot.val());
            });
    }
    useEffect(()=>{
        getCoin()
    },[])

    return <EsNormalText noneBasicStyle style={style} >{coin}</EsNormalText>
}

export const RealtimeTask = ({id,style}:{id:number,style?:StyleProp<Text>}) =>{
    const [count,setCount] = useState(0);
    const [daily,setDailyCOunt] = useState(1);

    const getCount = () => {
            db
            .ref(`${moment().format("DD-MM-YYYY")}/${id}`)
            .on('value', snapshot => {
                // console.log('User data: ', snapshot.val());
                setCount(snapshot.val());
            });
    }
    const getDailyCount = () =>{
        db
            .ref(`daliyCount`)
            .once('value')
            .then(snapshot => {
                setDailyCOunt(snapshot.val());
            })  
    }

    useEffect(()=>{
        getCount();
        getDailyCount();
    },[])

    return (
        <TaskCard 
                    current={count} 
                    header="Daily Tasks" 
                    progress={count/daily} 
                    totalQuestion={daily} 
                />
    )
}

