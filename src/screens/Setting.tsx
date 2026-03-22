import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { BgPhoto } from "../componet/atoms/Photo/BgPhoto"
import { FlexContainer, FlexRowContainer } from "../componet/atoms/container/FlexContainer"
import { EsNormalHeader, EsNormalText, EsSmallHeader, EsXsHeader } from "../componet/atoms/EsText"
import { useAtom } from "jotai"
import { AuthAtom } from "../features/jotai/model/auth"
import { MainNav, RootStackParamList } from "../nav/main.nav"
import { Icon, IconKey, IconsSize } from "../componet/atoms/icons"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { getVersion } from "react-native-device-info"
import { Colors } from "../res/color"
import { Images, getUserImage } from "../res/images"
import { useEffect, useState } from "react"
import { getStorageLimitGB, setStorageLimitGB, getCurrentStorageUsageGB } from "../services/storageManager"

// const logo = "https://lclb.s3.ap-southeast-1.amazonaws.com/operation/1737398123578.png"

interface IMenuGroup{
    title:string,
    items:IMenuItem[]
}

interface IMenuItem {name:string,nav:MainNav,icon:IconKey}

const MenuItem = (props:IMenuItem) => {
    const navigation:NavigationProp<RootStackParamList> = useNavigation();
    return(
        <FlexRowContainer noneBasicStyle style={styles.menuContainer} onPress={()=>{navigation.navigate(props.nav)}} isTouchable>
            <Icon className={{marginRight:10,color:Colors.settingIcon}} size={IconsSize.lg} icon={props.icon} />
            <EsNormalText noneBasicStyle>{props.name}</EsNormalText>
        </FlexRowContainer>
    )
}
const MenuGroup = (props:IMenuGroup) => {
    return(
        <FlexContainer fullWidth>
            <EsXsHeader noneBasicStyle style={{marginBottom:20}}>{props.title}</EsXsHeader>
            {
                props.items.map((row,index)=>{
                    return(
                        <MenuItem key={index} {...row} />
                    )
                })
            }
        </FlexContainer>
    )
}
const StorageLimitSection = () => {
    const [limitGB, setLimitGB] = useState(5);
    const [usageGB, setUsageGB] = useState(0);

    useEffect(() => {
        let isMounted = true;
        getStorageLimitGB()
            .then(v => { if (isMounted) setLimitGB(v); })
            .catch(err => console.error('getStorageLimitGB error:', err));
        getCurrentStorageUsageGB()
            .then(v => { if (isMounted) setUsageGB(v); })
            .catch(err => console.error('getCurrentStorageUsageGB error:', err));
        return () => { isMounted = false; };
    }, []);

    const change = (delta: number) => {
        const next = Math.min(10, Math.max(1, limitGB + delta));
        setLimitGB(next);
        setStorageLimitGB(next);
    };

    const limitMB = limitGB * 1024;
    const usedPercent = Math.min(100, Math.round((usageGB / limitMB) * 100));
    const usageLabel = usageGB < 1024 ? `${usageGB} MB` : `${(usageGB / 1024).toFixed(2)} GB`;

    return (
        <FlexContainer fullWidth style={{ marginBottom: 20 }}>
            <EsXsHeader noneBasicStyle style={{ marginBottom: 12 }}>Storage Limit</EsXsHeader>
            <View style={storageStyles.card}>
                <View style={storageStyles.row}>
                    <Text style={storageStyles.label}>Limit</Text>
                    <View style={storageStyles.stepper}>
                        <TouchableOpacity style={storageStyles.stepBtn} onPress={() => change(-1)}>
                            <Text style={storageStyles.stepBtnText}>−</Text>
                        </TouchableOpacity>
                        <Text style={storageStyles.value}>{limitGB} GB</Text>
                        <TouchableOpacity style={storageStyles.stepBtn} onPress={() => change(1)}>
                            <Text style={storageStyles.stepBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={storageStyles.usage}>Used: {usageLabel} / {limitGB} GB ({usedPercent}%)</Text>
                <View style={storageStyles.progressBg}>
                    <View style={[storageStyles.progressFill, { width: `${usedPercent}%` as any, backgroundColor: usedPercent > 80 ? '#e74c3c' : '#4F46E5' }]} />
                </View>
                <Text style={storageStyles.hint}>Min 1 GB · Max 10 GB · Oldest files removed when exceeded</Text>
            </View>
        </FlexContainer>
    );
};

export const Setting = () => {
    const [getUser] = useAtom(AuthAtom)
    return (
        <ScrollView >
            <FlexContainer centerAlign style={styles.container}>
                {/* <BgPhoto isNotUrl={true} isOutsitePhoto uri={Images.logo} style={styles.image}  /> */}
                <EsNormalHeader>{getUser?.name}</EsNormalHeader>
                {/* <MenuGroup 
                    title="General" 
                    items={
                        [
                            {icon:IconKey.user,name:"Profile",nav:MainNav.HOME},
                        ]
                    } 
                    /> */}
                {/* <MenuGroup 
                    title="Helper Program" 
                    items={
                        [
                            {icon:IconKey.info,name:"ကူညီသူ အစီစဥ် တွင်ပါဝင်မည်",nav:MainNav.helper},
                        ]
                    } 
                    /> */}
                <StorageLimitSection />
                <MenuGroup
                    title="Library"
                    items={
                        [
                            {icon:IconKey.calendar,name:"History",nav:MainNav.History},
                        ]
                    }
                    />
                <MenuGroup
                    title="About"
                    items={
                        [
                            {icon:IconKey.info,name:"About Us",nav:MainNav.aboutUs},
                            {icon:IconKey.document,name:"Terms and Conditions",nav:MainNav.TermsAndConditions},
                            {icon:IconKey.privacyPolicy,name:"Privacy Policy",nav:MainNav.privacypolicy},
                            {icon:IconKey.user,name:"User Data Policy",nav:MainNav.datapolicy},
                        ]
                    } 
                    />
                <MenuGroup 
                    title="User Data Management" 
                    items={
                        [
                            {icon:IconKey.info,name:"Delete Account",nav:MainNav.deleteAccount},
                        ]
                    } 
                    />
            </FlexContainer>
            <EsNormalText style={{textAlign:"center",fontWeight:"600",marginBottom:20}}>App Version {getVersion()}</EsNormalText>
        </ScrollView>
    )
}

const storageStyles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    stepper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    stepBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4F46E5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepBtnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        lineHeight: 22,
    },
    value: {
        fontSize: 18,
        fontWeight: '700',
        color: '#4F46E5',
        minWidth: 55,
        textAlign: 'center',
    },
    usage: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
    },
    progressBg: {
        height: 8,
        backgroundColor: '#eee',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressFill: {
        height: 8,
        borderRadius: 4,
    },
    hint: {
        fontSize: 11,
        color: '#aaa',
    },
});

const styles = StyleSheet.create({
    image:{
        width:80,
        height:80,
        borderRadius:40,
        overflow:"hidden",
        backgroundColor:"white",
        marginRight:10
    },
    container:{
        paddingTop:50,
        paddingBottom:20
    },
    menuContainer:{
        alignItems:"center",
        paddingVertical:10,
        paddingLeft:10,
        borderColor:"rgba(0,0,0,0.1)",
        borderWidth:1,
        borderRadius:10,
        marginBottom:10
    }
})