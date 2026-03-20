import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { darkModeAtom } from '../../features/jotai/model/darkMode';
import { landscapeModeAtom } from '../../features/jotai/model/landscapeMode';

// Safe wrapper — module is null until native linking (pod install / rebuild)
let Orientation: typeof import("react-native-orientation-locker").default | null = null;
try { Orientation = require("react-native-orientation-locker").default; } catch (_) {}


export const PdfReader = ({path}:{path:string}) => {
    const source = { uri: "file://"+path, cache: true };
    const [darkMode] = useAtom(darkModeAtom);
    const [pdfError, setPdfError] = useState<string|null>(null);
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

    if (pdfError) {
        return (
            <View style={[styles.container, styles.errorContainer]}>
                <Text style={styles.errorText}>Failed to load PDF.</Text>
                <Text style={styles.errorSub}>{pdfError}</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, enabled ? styles.containerDark : styles.containerLight]}>
            <Pdf
                key={path}
                source={source}
                horizontal
                fitPolicy={0}
                onLoadComplete={(numberOfPages) => {
                    console.log(`PDF loaded: ${numberOfPages} pages`);
                }}
                onPageChanged={(page) => {
                    console.log(`Page: ${page}`);
                }}
                onError={(error) => {
                    console.error('PDF error:', error);
                    setPdfError(String(error));
                }}
                onPressLink={(uri) => {
                    console.log(`Link: ${uri}`);
                }}
                style={{
                    flex: 1,
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
    },
    containerLight: { backgroundColor: '#fff' },
    containerDark:  { backgroundColor: '#121212' },
    errorContainer: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    errorText: { fontSize: 16, fontWeight: '600', color: '#e74c3c', marginBottom: 8 },
    errorSub: { fontSize: 13, color: '#888', textAlign: 'center', paddingHorizontal: 24 },
});