import { useEffect, useState } from "react"
import EsDatePicker from "../componet/atoms/EsDatePicker"
import { EsNormalHeader, EsNormalText } from "../componet/atoms/EsText"
import { EsButton } from "../componet/atoms/container/EsButton"
import { FlexContainer } from "../componet/atoms/container/FlexContainer"
import { IconKey } from "../componet/atoms/icons"
import { Persit } from "../features/storage/localstorage"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../nav/main.nav"
import { getStoreUserInfo } from "../features/storage/UserStorage"
import moment from "moment"
import { EsTextInput } from "../componet/atoms/EsTextInput"
import { fetchDeleteAccount } from "../features/apiClient/Auth"

type IProps = NativeStackScreenProps<RootStackParamList, 'Delete Account'>;

export const AccountDelete = (props:IProps) => {
    const [phone,setPhone] = useState<any>();
    const [registerPhone,setRegisterPhone] = useState<any>();
    const [id,setId] = useState<number>(0);
    useEffect(()=>{
        getStoreUserInfo().then((data)=>{
            setRegisterPhone(data?.phone)
            setId(data?.id||0)
        })
    },[])

    const _AccDelete = () => {
        fetchDeleteAccount({id,phone}).then(data=>{
            Persit.clearAll()
            props.navigation.popToTop()
            props.navigation.navigate("Register")
        })
    }


    return (
        <FlexContainer>
            <EsNormalHeader>Delete Your Account?</EsNormalHeader>
            <EsNormalText style={{lineHeight:30}}>Your activity and data will be deleted and cannot be restored.If you want to delete your account please fill your Phone Number for confirmed!</EsNormalText>
            <FlexContainer>
                <EsTextInput 
                    isError={false} 
                    label="" 
                    onChange={setPhone} 
                    placeHolder="ဖုန်းနံပါတ်" 
                    icon={IconKey.phone}  />
            </FlexContainer>

            <EsButton isDisible={phone!== registerPhone} onPress={_AccDelete} title="Delete Account" style={{marginTop:30}} />

        </FlexContainer>
    )
}