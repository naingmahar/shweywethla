import React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { Circle, Path, Svg } from "react-native-svg"

interface IProps {
    className: StyleProp<ViewStyle>,
    bold?: boolean
}

type ISVGContainer = IProps & { children: React.ReactNode }



const SVGContainer = (props: ISVGContainer) => {
    return (
        <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={props.className}>
            {props.children}
        </Svg  >)
}

const OrderSolid = (props: IProps) => (
    <Svg viewBox="0 0 24 24" fill="currentColor" style={props.className}>
        <Path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM9.75 17.25a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-.75zm2.25-3a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-5.25z" clipRule="evenodd" />
        <Path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
    </Svg  >
)
const OrderOutline = (props: IProps) => (
    <SVGContainer {...props}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </SVGContainer>
)

export const OrderIcons = (props: IProps) => {
    if (props.bold) return OrderSolid(props)
    else return OrderOutline(props)
}


const ProductSolid = (props: IProps) => (
    <Svg viewBox="0 0 24 24" fill="currentColor" style={props.className}>
        <Path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" />
    </Svg  >
)


const ProductOutline = (props: IProps) => (
    <SVGContainer {...props}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </SVGContainer>
)



export const ProductIcons = (props: IProps) => {
    if (props.bold) return ProductSolid(props)
    else return ProductOutline(props)
}


const SettingSolid = (props: IProps) => (
    <Svg viewBox="0 0 24 24" fill="currentColor" style={props.className}>
        <Path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
    </Svg  >
)

const SettingOutline = (props: IProps) => (
    <SVGContainer {...props}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <Path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </SVGContainer>

)

export const LanguageOutline = (props: IProps) => (
    <SVGContainer {...props}>
       <Path stroke-linecap="round" stroke-linejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
    </SVGContainer>

)


export const SettingIcons = (props: IProps) => {
    if (props.bold) return SettingSolid(props)
    else return SettingOutline(props)
}

export const NotiIcon = (props: IProps) => {
    return (
        <Svg style={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><Path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></Svg  >
    )
}


export const ShoppingCart = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </SVGContainer>
    )
}

export const ShareIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
        </SVGContainer>

    )
}

export const NameIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
        </SVGContainer>
    )
}

export const PriceIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </SVGContainer>
    )
}

export const AddShoppingCart = (props: IProps) => {
    return(
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </SVGContainer>
    )
}

export const AddIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </SVGContainer>
    )
}

export const PendingIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
  <Path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </SVGContainer>
    )
}

export const DownloadIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />        
        </SVGContainer>
    )
}  

export const MaleIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            {/* Head */}
            <Circle 
                cx="12" cy="8" r="5" 
                strokeLinecap="round" strokeLinejoin="round" 
                strokeWidth={2} 
            />
            {/* Body/Shoulders */}
            <Path 
                d="M20 21a8 8 0 00-16 0" 
                strokeLinecap="round" strokeLinejoin="round" 
                strokeWidth={2} 
            />
        </SVGContainer>
    );
};

export const FemaleIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            {/* Head */}
            <Circle 
                cx="12" cy="7" r="5" 
                strokeLinecap="round" strokeLinejoin="round" 
                strokeWidth={2} 
            />
            {/* Body (Dress/A-line shape) */}
            <Path 
                d="M17.5 21H6.5L9 13H15L17.5 21Z" 
                strokeLinecap="round" strokeLinejoin="round" 
                strokeWidth={2} 
            />
        </SVGContainer>
    );
};        

export const ChartBarIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </SVGContainer>
    )
}

export const PresentationIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
        </SVGContainer>
    )
}

export const PhoneIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </SVGContainer>
    )
}


export const ShopIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
        </SVGContainer>
    )
}

export const IDCardIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
        </SVGContainer>
    )
}

export const DOBIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z" />
        </SVGContainer>
    )
}

export const TouchIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
        </SVGContainer>
    )
}

export const RocketIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </SVGContainer>)
}


export const DocumentIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </SVGContainer>
    )
}

export const LockIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </SVGContainer>
    )
}




export const CrossIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </SVGContainer>
    )
}

export const DeliveryIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </SVGContainer>
    )
}


export const NextIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
  <Path strokeLinecap="round" strokeLinejoin="round" d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z" />
        </SVGContainer>
    )
}

export const DropDownIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </SVGContainer>
    )
}


export const PackageIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
<Path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </SVGContainer>
    )
}

export const GroupOutlineIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
  <Path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </SVGContainer>
    )
}


const GroupSolidIcon = (props: IProps) => (
    <Svg viewBox="0 0 24 24" fill="currentColor" style={props.className}>
          <Path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
    </Svg  >
)


export const GroupIcon = (props: IProps) => {
    if (props.bold) return GroupSolidIcon(props)
    else return GroupOutlineIcon(props)
}



export const PhotoIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </SVGContainer>
    )
}

export const CategoryIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <Path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </SVGContainer>
    )
}

export const BackIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </SVGContainer>

    )
}

export const DeleteIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </SVGContainer>
    )
}


export const EditIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </SVGContainer>
    )
}

export const ClockIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </SVGContainer>
    )
}

export const CalendarIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
        </SVGContainer>
    )
}

export const GreaterIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </SVGContainer>
    )
}


export const LessIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </SVGContainer>
    )
}


export const RefreshIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </SVGContainer>
    )
}



export const CloseIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </SVGContainer>
    )
}

export const NavBarIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </SVGContainer>

    )
}

export const SuccessIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </SVGContainer>

    )
}


export const FailIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </SVGContainer>

    )
}






export const UserIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </SVGContainer>

    )
}

export const InfoIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </SVGContainer>

    )

}


export const BookIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /> 
        </SVGContainer>
    )
}

export const BookAuthorIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </SVGContainer>
    )
}

export const PdfIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </SVGContainer>
    )
}   

export const DashboardIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </SVGContainer>
    )
}


export const BookISBNIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /> 
        </SVGContainer>
    )
}

export const BookMarkIcon = (props: IProps) =>{
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </SVGContainer>
    )
}

export const LoveIcon = (props: IProps) =>{
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </SVGContainer>
    )
}

export const BookPublishedDateIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />         
        </SVGContainer>
    )
}

export const BookPagesIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />         
        </SVGContainer>
    )
}   

export const BookLanguageIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />         
        </SVGContainer>
    )
}

export const BookPublisherIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />         
        </SVGContainer>
    )
}

export const BookDescriptionIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />         
        </SVGContainer>
    )
}   


export const NumberOfPagesIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
        </SVGContainer>
    )
}


export const GenreIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </SVGContainer>
    )
}

export const AuthorIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />         
        </SVGContainer>
    )
}

export const TitleIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />         
        </SVGContainer>
    )
}   


export const LanguageIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
        </SVGContainer>
    )
}

export const PublishedDateIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />         
        </SVGContainer>
    )
}

export const ISBNIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />         
        </SVGContainer>
    )
}

export const PublisherIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />         
        </SVGContainer>
    )
}

export const DescriptionIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />         
        </SVGContainer>
    )
}

export const coverImageUrlIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />         
        </SVGContainer>
    )
}   
    




export const AddDocumentIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </SVGContainer>

    )
}


export const searchIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </SVGContainer>

    )
}

export const nightModeIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </SVGContainer>

    )
}


export const lightModeIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M6.75 12H4.5m.386-6.364L3.295 7.227M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </SVGContainer>

    )
}

export const homeIcon = (props: IProps) => {
    return (
        <SVGContainer {...props}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </SVGContainer>

    )
}





export const LogoDark = () => {
    return (
        <Svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <g clipPath="url(#clip0_426_42541)">
                <Path d="M22.6 11.4C22.6 11.0586 22.5328 10.7205 22.4021 10.4051C22.2714 10.0896 22.0799 9.803 21.8385 9.56157C21.5971 9.32014 21.3104 9.12862 20.995 8.99796C20.6796 8.8673 20.3415 8.80005 20 8.80005C19.6586 8.80005 19.3205 8.8673 19.005 8.99796C18.6896 9.12862 18.403 9.32014 18.1615 9.56157C17.9201 9.803 17.7286 10.0896 17.5979 10.4051C17.4673 10.7205 17.4 11.0586 17.4 11.4V12.5H22.6V11.4Z" fill="#272727" />
                <Path d="M25.5125 15.3999V16.8499C25.5125 17.1416 25.3966 17.4214 25.1903 17.6277C24.984 17.834 24.7042 17.9499 24.4125 17.9499H23.75C23.4592 17.9467 23.1813 17.8297 22.9757 17.6241C22.7701 17.4185 22.6532 17.1406 22.65 16.8499V15.3999H17.4V16.8499C17.3967 17.1406 17.2798 17.4185 17.0742 17.6241C16.8686 17.8297 16.5907 17.9467 16.3 17.9499H15.5875C15.2957 17.9499 15.0159 17.834 14.8096 17.6277C14.6034 17.4214 14.4875 17.1416 14.4875 16.8499V15.3999H13.8125C13.6749 15.3993 13.542 15.4504 13.4402 15.5429C13.3384 15.6355 13.275 15.7629 13.2625 15.8999L12.5 25.4874C12.493 25.5637 12.502 25.6407 12.5266 25.7133C12.5511 25.7859 12.5905 25.8526 12.6422 25.9091C12.694 25.9656 12.757 26.0106 12.8273 26.0413C12.8975 26.072 12.9733 26.0877 13.05 26.0874H26.9625C27.0385 26.0859 27.1135 26.0689 27.1828 26.0376C27.2522 26.0063 27.3145 25.9612 27.3659 25.9051C27.4173 25.849 27.4568 25.7831 27.482 25.7113C27.5072 25.6395 27.5175 25.5633 27.5125 25.4874L26.7375 15.8999C26.7249 15.7629 26.6615 15.6355 26.5597 15.5429C26.4579 15.4504 26.3251 15.3993 26.1875 15.3999H25.5125Z" fill="#272727" />
                <Path d="M27.8875 1.25H12.1C9.75949 1.25 7.51482 2.17977 5.85981 3.83478C4.2048 5.48979 3.27502 7.73447 3.27502 10.075V25.8625C3.27502 28.203 4.2048 30.4477 5.85981 32.1027C7.51482 33.7577 9.75949 34.6875 12.1 34.6875H14.8125L17.675 37.7375C17.9722 38.057 18.332 38.3119 18.732 38.4861C19.132 38.6604 19.5637 38.7503 20 38.7503C20.4364 38.7503 20.868 38.6604 21.268 38.4861C21.6681 38.3119 22.0279 38.057 22.325 37.7375L25.1875 34.6875H27.8875C29.0475 34.6891 30.1964 34.4621 31.2685 34.0193C32.3407 33.5766 33.315 32.9268 34.1358 32.1071C34.9566 31.2875 35.6078 30.3141 36.0521 29.2426C36.4963 28.1711 36.725 27.0225 36.725 25.8625V10.075C36.7217 7.73332 35.7892 5.48867 34.1322 3.83402C32.4752 2.17937 30.2292 1.25 27.8875 1.25ZM30.2 28.525C30.0653 28.6733 29.9014 28.792 29.7185 28.8738C29.5357 28.9555 29.3378 28.9985 29.1375 29H10.8625C10.6606 28.9973 10.4613 28.9538 10.2766 28.8722C10.0918 28.7905 9.92551 28.6725 9.78752 28.525C9.65189 28.3778 9.54848 28.204 9.48391 28.0146C9.41933 27.8252 9.39502 27.6244 9.41252 27.425L10.5125 13.825C10.541 13.4614 10.7067 13.1222 10.9759 12.8762C11.2452 12.6302 11.5978 12.4957 11.9625 12.5H14.4625V11.4C14.4625 10.6761 14.6051 9.95926 14.8821 9.29046C15.1592 8.62165 15.5652 8.01396 16.0771 7.50207C16.589 6.99019 17.1967 6.58414 17.8655 6.30711C18.5343 6.03008 19.2511 5.8875 19.975 5.8875C20.6989 5.8875 21.4158 6.03008 22.0846 6.30711C22.7534 6.58414 23.3611 6.99019 23.8729 7.50207C24.3848 8.01396 24.7909 8.62165 25.0679 9.29046C25.3449 9.95926 25.4875 10.6761 25.4875 11.4V12.5H27.9875C28.3534 12.4989 28.7061 12.6361 28.975 12.8842C29.2439 13.1322 29.4091 13.4728 29.4375 13.8375L30.5375 27.4375C30.5606 27.6323 30.5425 27.8298 30.4843 28.0171C30.4262 28.2045 30.3293 28.3775 30.2 28.525Z" fill="#272727" />
            </g>
            <defs>
                <clipPath id="clip0_426_42541">
                    <rect width="40" height="40" fill="white" />
                </clipPath>
            </defs>
        </Svg  >

    )
}

export const Logo = () => {
    return (
        <Svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <g clipPath="url(#clip0_423_23892)">
                <Path d="M22.6 11.4C22.6 11.0586 22.5328 10.7205 22.4021 10.405C22.2714 10.0896 22.0799 9.80294 21.8385 9.56151C21.5971 9.32008 21.3104 9.12856 20.995 8.9979C20.6796 8.86724 20.3415 8.79999 20 8.79999C19.6586 8.79999 19.3205 8.86724 19.005 8.9979C18.6896 9.12856 18.403 9.32008 18.1615 9.56151C17.9201 9.80294 17.7286 10.0896 17.5979 10.405C17.4673 10.7205 17.4 11.0586 17.4 11.4V12.5H22.6V11.4Z" fill="white" />
                <Path d="M25.5125 15.4V16.85C25.5125 17.1417 25.3966 17.4215 25.1903 17.6278C24.984 17.8341 24.7042 17.95 24.4125 17.95H23.75C23.4592 17.9467 23.1813 17.8298 22.9757 17.6242C22.7701 17.4186 22.6532 17.1407 22.65 16.85V15.4H17.4V16.85C17.3967 17.1407 17.2798 17.4186 17.0742 17.6242C16.8686 17.8298 16.5907 17.9467 16.3 17.95H15.5875C15.2957 17.95 15.0159 17.8341 14.8096 17.6278C14.6034 17.4215 14.4875 17.1417 14.4875 16.85V15.4H13.8125C13.6749 15.3994 13.542 15.4505 13.4402 15.543C13.3384 15.6356 13.275 15.763 13.2625 15.9L12.5 25.4875C12.493 25.5638 12.502 25.6407 12.5266 25.7134C12.5511 25.786 12.5905 25.8527 12.6422 25.9092C12.694 25.9656 12.757 26.0107 12.8273 26.0414C12.8975 26.0721 12.9733 26.0878 13.05 26.0875H26.9625C27.0385 26.086 27.1135 26.069 27.1828 26.0377C27.2522 26.0064 27.3145 25.9613 27.3659 25.9052C27.4173 25.8491 27.4568 25.7832 27.482 25.7114C27.5072 25.6396 27.5175 25.5634 27.5125 25.4875L26.7375 15.9C26.7249 15.763 26.6615 15.6356 26.5597 15.543C26.4579 15.4505 26.3251 15.3994 26.1875 15.4H25.5125Z" fill="white" />
                <Path d="M27.8875 1.25H12.1C9.75949 1.25 7.51482 2.17977 5.85981 3.83478C4.2048 5.48979 3.27502 7.73447 3.27502 10.075V25.8625C3.27502 28.203 4.2048 30.4477 5.85981 32.1027C7.51482 33.7577 9.75949 34.6875 12.1 34.6875H14.8125L17.675 37.7375C17.9722 38.057 18.332 38.3119 18.732 38.4861C19.132 38.6604 19.5637 38.7503 20 38.7503C20.4364 38.7503 20.868 38.6604 21.268 38.4861C21.6681 38.3119 22.0279 38.057 22.325 37.7375L25.1875 34.6875H27.8875C29.0475 34.6891 30.1964 34.4621 31.2685 34.0193C32.3407 33.5766 33.315 32.9268 34.1358 32.1071C34.9566 31.2875 35.6078 30.3141 36.0521 29.2426C36.4963 28.1711 36.725 27.0225 36.725 25.8625V10.075C36.7217 7.73332 35.7892 5.48867 34.1322 3.83402C32.4752 2.17937 30.2292 1.25 27.8875 1.25ZM30.2 28.525C30.0653 28.6733 29.9014 28.792 29.7185 28.8738C29.5357 28.9555 29.3378 28.9985 29.1375 29H10.8625C10.6606 28.9973 10.4613 28.9538 10.2766 28.8722C10.0918 28.7905 9.92551 28.6725 9.78752 28.525C9.65189 28.3778 9.54848 28.204 9.48391 28.0146C9.41933 27.8252 9.39502 27.6244 9.41252 27.425L10.5125 13.825C10.541 13.4614 10.7067 13.1222 10.9759 12.8762C11.2452 12.6302 11.5978 12.4957 11.9625 12.5H14.4625V11.4C14.4625 10.6761 14.6051 9.95926 14.8821 9.29046C15.1592 8.62165 15.5652 8.01396 16.0771 7.50207C16.589 6.99019 17.1967 6.58414 17.8655 6.30711C18.5343 6.03008 19.2511 5.8875 19.975 5.8875C20.6989 5.8875 21.4158 6.03008 22.0846 6.30711C22.7534 6.58414 23.3611 6.99019 23.8729 7.50207C24.3848 8.01396 24.7909 8.62165 25.0679 9.29046C25.3449 9.95926 25.4875 10.6761 25.4875 11.4V12.5H27.9875C28.3534 12.4989 28.7061 12.6361 28.975 12.8842C29.2439 13.1322 29.4091 13.4728 29.4375 13.8375L30.5375 27.4375C30.5606 27.6323 30.5425 27.8298 30.4843 28.0171C30.4262 28.2045 30.3293 28.3775 30.2 28.525Z" fill="white" />
            </g>
            <defs>
                <clipPath id="clip0_423_23892">
                    <rect width="40" height="40" fill="white" />
                </clipPath>
            </defs>
        </Svg  >
    )
}

export const SgFlag = () => {
    return (
        <Svg viewBox="0 0 4320 2880"><Path fill="#ed2939" d="M0 0h4320v1440H0z"/><Path fill="#fff" d="M0 1440h4320v1440H0zm1481.678-720a541.5 541.5 0 1 1-1083 0 541.5 541.5 0 1 1 1083 0z"/><Path fill="#ed2939" d="M1651.835 720a511.735 511.735 0 1 1-1023.47 0 511.735 511.735 0 1 1 1023.47 0z"/><Path id="a" fill="#fff" d="m1007.195 733.064-73.56-56.43-73.542 56.457 28.313-90.994-73.795-56.092 91.06.193 27.934-91.123 27.964 91.113 91.06-.226-73.777 56.119 28.343 90.983z"/><use xlinkHref="#a" transform="translate(577.189)"/><use xlinkHref="#a" transform="translate(288.889 -214.211)"/><use xlinkHref="#a" transform="translate(108 342.749)"/><use xlinkHref="#a" transform="translate(469.189 342.749)"/></Svg  >
    )
}

