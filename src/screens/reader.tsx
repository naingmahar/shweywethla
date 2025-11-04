import { Text, View } from "react-native"
import { PdfReader } from "./reader/pdfReader"
import { useEffect, useState } from "react"
import { downloadFile } from "../utils/downloadFile"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainNav, RootStackParamList } from "../nav/main.nav";
import ReaderFlatListWebView from "./reader/htmlReader";
import TextReaderPage from "./reader/textReader";
type ReaderScreenProps = NativeStackScreenProps<RootStackParamList, MainNav.Reader>;

export const Reader:React.FC<ReaderScreenProps> = ({route,navigation}) => {
    const [path,setPath] = useState<string|null>(null)
    const book = route.params
    const bookType = route.params.premium_type
    useEffect(()=>{
        downloadFile(route.params)
        .then((downloadedBook)=>{
            if(downloadedBook) setPath(downloadedBook.localFilePath)
        })
    },[])
    return(
       <>
         {path != null &&  bookType == "html" && <ReaderFlatListWebView path={path} title={book.title}/>}
         {path != null &&  bookType == "text" && <TextReaderPage path={path}/>}
         {path != null &&  bookType == undefined && <PdfReader path={path}/>}
       </>
    )
}