import Svg, { Path, Circle, Rect, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { Image, StyleSheet, Text, View } from 'react-native';
import { GradientColor } from '../../../res/color';

// --- GRADIENT COLORS (Reusing the Nav Bar Colors for Consistency) ---
const GRADIENT_COLORS = {
  START: '#22B4D3', // Bright Cyan/Blue
  END: '#7B5EC9',   // Purplish-Indigo
};
interface IconProps {
  color: string;
  size: number;
}

export const TechnologyIcon: React.FC<IconProps> = ({ color, size }) => (
    <View style={[styles.container, { backgroundColor: color}]}>
        <Image source={require("../../../assets/technology.png")} resizeMode='repeat' style={{ width: size, height: size  }}/>
    </View>
);

export const LanguageIcon: React.FC<IconProps> = ({ color, size }) => (
    <View style={[styles.container, { backgroundColor: color}]}>
        <Image source={require("../../../assets/language2.png")} resizeMode='repeat' style={{ width: size, height: size  }}/>
    </View>
);

export const BusinessIcon: React.FC<IconProps> = ({ color, size }) => (
    <View style={[styles.container, { backgroundColor: color}]}>
        <Image source={require("../../../assets/business.png")} resizeMode='repeat' style={{ width: size, height: size  }}/>
    </View>
);

export const BiographyIcon: React.FC<IconProps> = ({ color, size }) => (
    <View style={[styles.container, { backgroundColor: color}]}>
        <Image source={require("../../../assets/biography.png")} resizeMode='repeat' style={{ width: size, height: size  }}/>
    </View>
);

export const FictionIcon: React.FC<IconProps> = ({ color, size }) => (
    <View style={[styles.container, { backgroundColor: color}]}>
        <Image source={require("../../../assets/fiction.png")} resizeMode='repeat' style={{ width: size, height: size  }}/>
    </View>
);

export const NovelIcon: React.FC<IconProps> = ({ color, size }) => (
    <View style={[styles.container, { backgroundColor: color}]}>
        <Image source={require("../../../assets/novel.png")} resizeMode='repeat' style={{ width: size, height: size  }}/>
    </View>
);

export const DramaIcon: React.FC<IconProps> = ({ color, size }) => (
    <View style={[styles.container, { backgroundColor: color}]}>
        <Image source={require("../../../assets/drama.png")} resizeMode='repeat' style={{ width: size, height: size  }}/>
    </View>
);

export const MysteryIcon: React.FC<IconProps> = ({ color, size }) => (
    <View style={[styles.container, { backgroundColor: color}]}>
        <Image source={require("../../../assets/mystery.png")} resizeMode='repeat' style={{ width: size, height: size  }}/>
    </View>
);

export const ComedyIcon: React.FC<IconProps> = ({ color, size }) => (
    <View style={[styles.container, { backgroundColor: color}]}>
        <Image source={require("../../../assets/comedy.png")} resizeMode='repeat' style={{ width: size, height: size  }}/>
    </View>
);

export const UnknownIcon: React.FC<IconProps> = ({ color, size }) => (
    <View style={[styles.container, { backgroundColor: color}]}>
        <Image source={require("../../../assets/unknown.png")} resizeMode='repeat' style={{ width: size, height: size  }}/>
    </View>
);


export const CategoryIcon:React.FC<IconProps & { categoryName: string }> = ({ size,categoryName }) => {
    if(categoryName.toLocaleLowerCase() === "technology") return <TechnologyIcon color={GradientColor[1]} size={size} />
    if(categoryName.toLocaleLowerCase() === "language") return <LanguageIcon color={GradientColor[2]} size={size} />
    if(categoryName.toLocaleLowerCase() === "business") return <BusinessIcon color={GradientColor[3]} size={size} />
    if(categoryName.toLocaleLowerCase() === "biography") return <BiographyIcon color={GradientColor[4]} size={size} />
    if(categoryName.toLocaleLowerCase() === "fiction") return <FictionIcon color={GradientColor[5]} size={size} />
    if(categoryName.toLocaleLowerCase() === "novel") return <NovelIcon color={GradientColor[1]} size={size} />
    if(categoryName.toLocaleLowerCase() === "drama") return <DramaIcon color={GradientColor[2]} size={size} />
    if(categoryName.toLocaleLowerCase() === "mystery") return <MysteryIcon color={GradientColor[3]} size={size} />
    if(categoryName.toLocaleLowerCase() === "comedy") return <ComedyIcon color={GradientColor[4]} size={size} />
    return <UnknownIcon color={GradientColor[5]} size={size} />
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:15,
        padding:5
    },
})