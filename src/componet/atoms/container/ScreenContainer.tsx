import { FC } from "react";
import { IContainerProps } from "../Types/IContinerProps";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import ErrorAlert from "~/express/modals/errorAlert";

export const ScreenContainer:FC<IContainerProps> = (props) => {
    return <ScrollView style={[styles.base,props.style]} >
                {/* @ts-ignore */}
                <ErrorAlert />
                {props.children}
            </ScrollView>
}
export const SafeScreenContainer:FC<IContainerProps> = (props) => {
    return <SafeAreaView style={[styles.base,props.style]} >
                {/* @ts-ignore */}
                <ErrorAlert />
                {props.children}
            </SafeAreaView>
}

const  styles = StyleSheet.create({
    base:{
        flex:1,
    }
})