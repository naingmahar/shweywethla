import { StyleSheet, Dimensions, View, useWindowDimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { darkModeAtom } from '../../features/jotai/model/darkMode';
import { landscapeModeAtom } from '../../features/jotai/model/landscapeMode';

// Safe wrapper — module is null until native linking (pod install / rebuild)
let Orientation: typeof import("react-native-orientation-locker").default | null = null;
try { Orientation = require("react-native-orientation-locker").default; } catch (_) {}


export const PdfReader = ({path}:{path:string}) => {
    const source = { uri: "file:/"+path, cache: true };
    const [darkMode] = useAtom(darkModeAtom);
    const enabled = darkMode ?? false;

    // Persistent landscape mode
    const [isLandscape] = useAtom(landscapeModeAtom);
    const landscape = isLandscape ?? false;

    // Reactive dimensions
    const { width, height } = useWindowDimensions();

    // Orientation locking
    useEffect(() => {
        if (!Orientation) return;
        if (landscape) {
            Orientation.lockToLandscape();
        } else {
            Orientation.lockToPortrait();
        }
        return () => Orientation?.lockToPortrait();
    }, [landscape]);

    return (
        <View style={[styles.container, enabled ? styles.containerDark : styles.containerLight]}>
            <Pdf
                source={source}
                horizontal
                fitPolicy={0}
                onLoadComplete={(numberOfPages,filePath) => {
                    console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page,numberOfPages) => {
                    console.log(`Current page: ${page}`);
                }}
                onError={(error) => {
                    console.log("Reading Error",error);
                }}
                onPressLink={(uri) => {
                    console.log(`Link pressed: ${uri}`);
                }}
                style={{
                    flex:1,
                    width: width,
                    height: height,
                    backgroundColor: enabled ? '#121212' : '#fff'
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        // removed marginTop: 25 to let it fill screen properly in landscape
    },
    containerLight: { backgroundColor: '#fff' },
    containerDark:  { backgroundColor: '#121212' },
});