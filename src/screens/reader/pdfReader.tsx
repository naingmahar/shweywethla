import { StyleSheet, Dimensions, View } from 'react-native';
import Pdf from 'react-native-pdf';


export const PdfReader = ({path}:{path:string}) => {
    const source = { uri: "file:/"+path, cache: true };
    console.log("source",source)
    return (
        <View style={styles.container}>
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
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});