import { StyleSheet, Dimensions, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { useAtom } from 'jotai';
import { darkModeAtom } from '../../features/jotai/model/darkMode';


export const PdfReader = ({path}:{path:string}) => {
    const source = { uri: "file:/"+path, cache: true };
    const [darkMode] = useAtom(darkModeAtom);
    const enabled = darkMode ?? false;

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
                style={styles.pdf}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    containerLight: { backgroundColor: '#fff' },
    containerDark:  { backgroundColor: '#121212' },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});