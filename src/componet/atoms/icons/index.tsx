import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import * as Icons from './icons';
import {styles} from "./styles";

export enum IconKey {
    order = "OrderIcons",
    product = "ProductIcons",
    setting = "SettingIcons",
    noti="NotiIcon",
    shoppingCart = "ShoppingCart",
    shareIcon = "ShareIcon",
    name="NameIcon",
    price="PriceIcon",
    addIcon = "AddIcon",
    cross = "CrossIcon",
    photo= "PhotoIcon",
    category = "CategoryIcon",
    back = "BackIcon",
    delete = "DeleteIcon",
    edit = "EditIcon",
    close = "CloseIcon",
    user="UserIcon",
    nav="NavBarIcon",
    info="InfoIcon",
    addDocument="AddDocumentIcon",
    success="SuccessIcon",
    fail="FailIcon",
    refresh="RefreshIcon",
    phone="PhoneIcon",
    shop="ShopIcon",
    addShoppingCart = "AddShoppingCart",
    delivery="DeliveryIcon",
    next="NextIcon",
    package="PackageIcon",
    group="GroupIcon",
    dropDown="DropDownIcon",
    clock="ClockIcon",
    calendar="CalendarIcon",
    greaterThan="GreaterIcon",
    lessThan="LessIcon",
    pending="PendingIcon",
    english="LanguageOutline",
}


interface IconProps {
    icon: IconKey,
    className?: StyleProp<TextStyle>
    active?: boolean,
    size?:IconsSize
}

export enum IconsSize {
    xs = 15,
    sm = 20,
    normal = 25,
    lg = 30,
    xl = 35,
    xxl = 40,
    xxxl = 50,
    picture = 60,
    picture_lg = 80,
} 

export const Icon = (props:IconProps) =>{
    // let style = props.active ? styles.iconColorNavActive : styles.iconColorNav
    const size = props.size ? props.size : IconsSize.normal 
    return Icons[props.icon]({className:[props.className,{width:size,height:size}],bold:props.active,})
}


