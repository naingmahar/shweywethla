import { useEffect, useRef } from 'react';
import { AppState, View } from 'react-native';
import TrackPlayer, { AppKilledPlaybackBehavior, RepeatMode } from 'react-native-track-player';

const track1 = {
    url: require('../../assets/track1.mp3'), // Load media from the app bundle
};

const track2 = {
    url: require('../../assets/track2.mp3'), // Load media from the app bundle
};

export const BackgroundMusic = () => {
    useEffect(()=>{
            TrackPlayer.setupPlayer().then(()=>{
                TrackPlayer.updateOptions({
                    android: {
                        alwaysPauseOnInterruption: true,
                        stopForegroundGracePeriod:0,
                        // This is the default behavior
                        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification
                    },
                });
                TrackPlayer.setRepeatMode(RepeatMode.Queue)
                TrackPlayer.add([track1,track2]).then(()=>{
                    TrackPlayer.play()
                })
            })

            

            return(()=>{
                TrackPlayer.stop()
            })
    },[])

    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
          if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!');
            TrackPlayer.play();
          } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
            console.log('App has gone to the background!');
            TrackPlayer.pause();
          }
    
          appState.current = nextAppState;
        });
    
        return () => {
          subscription.remove();
        };
      }, []);
      
    return(<View />)
}
