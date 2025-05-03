import { FlexContainer, FlexRowContainer } from "../componet/atoms/container/FlexContainer"
import { EsTextInput } from "../componet/atoms/EsTextInput"
import { IconKey } from "../componet/atoms/icons"
import { EsNormalText, EsTextHeader } from "../componet/atoms/EsText"
import { Colors } from "../res/color"
import EsDatePicker from "../componet/atoms/EsDatePicker"
import { useEffect, useState } from "react"
import { EsButton } from "../componet/atoms/container/EsButton"
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { ESColor } from "../componet/atoms/res/EsColor"
import { useCreateUser } from "../features/query/products/createProduct"
import { deviceInfo } from "../utils/deviceInfo"
import { AuthAtom } from "../features/jotai/model/auth"
import { useAtom } from "jotai"
import { EsRadioContainer } from "../componet/atoms/container/EsRadio"
// import { useRecoilState } from "recoil"
// import { authUserState } from "../features/recoilState"

export const RegisterScreen = () => {
    const createUser = useCreateUser();
    const [name,setName] = useState("");
    const [phone,setPhone] = useState("");
    const [gender,setGender] = useState<string>("");
    const [referral,setReferral] = useState("");
    const [dob,setDob] = useState<any>();
    const [aggree,setAggree] = useState(false);


    const _onSubmit = async () => {
        const devInfo = await deviceInfo();
        createUser.mutate({
            device_id:devInfo.fstInstallTime.toString(),
            device_name:devInfo.deviceName,
            device_info:JSON.stringify(devInfo),
            name,
            dob,
            referral,
            phone,
            gender,
        })
    }

    const [getUser, setUser] = useAtom(AuthAtom)
    // const [userInfo,setUserInfo] = useRecoilState(authUserState)
    useEffect(()=>{
        console.log(createUser)
        if(createUser) setUser(createUser.data)
    },[createUser.isSuccess])

    return(
        <FlexContainer KeyboardAvoidingView noneBasicStyle fullFlex style={{backgroundColor:Colors.infoCard}}>
            <FlexContainer centerAlign style={{minHeight:200}}>
                <EsTextHeader color={ESColor.textWhite}>Register</EsTextHeader>
                <EsNormalText color={ESColor.textWhite} style={{textAlign:"center"}}>
                    အကောင့်အသစ်ပြုလုပ်ရန် အချက်အလက်ဖြည့်သွင်းခြင်း
                </EsNormalText>
            </FlexContainer>
            <FlexContainer 
                fullFlex 
                style={{
                    backgroundColor:"white",
                    borderTopLeftRadius:100,
                    paddingHorizontal:30,
                    paddingTop:100
                }}>
                <EsTextInput 
                    isError={false} 
                    label="" 
                    onChange={setName} 
                    placeHolder="အမည်" 
                    icon={IconKey.user}  />
                <EsTextInput 
                    isError={false} 
                    label="" 
                    onChange={setPhone} 
                    placeHolder="ဖုန်းနံပါတ်" 
                    icon={IconKey.phone}  />

                <EsTextInput 
                    isError={false} 
                    label="" 
                    onChange={setReferral} 
                    placeHolder="Referral Code (ကူညီသူ၏နံပါတ်)" 
                    icon={IconKey.idCard}  />

                <EsDatePicker
                    isError={false} 
                    label="" 
                    date={dob}
                    onChange={setDob} 
                    placeHolder="မွေးနေ့" 
                    icon={IconKey.dob} />

                <EsRadioContainer 
                    onChange={(val)=>{setGender(String(val))}} data={[
                            {value:"male",label:"Male",icon:IconKey.user},
                            {value:"female",label:"Female",icon:IconKey.user},
                            {value:"other",label:"Other",icon:IconKey.user},
                            ]} />
                
                <FlexRowContainer noneBasicStyle style={{width:"90%",marginBottom:20}}>
                    <BouncyCheckbox 
                         size={25}  
                         fillColor={Colors.infoCard}
                         unFillColor={"#fff"}
                         onPress={setAggree}
                    />
                    <EsNormalText noneBasicStyle>
                    အချက်အလက်များကို မှန်ကန်အောင်ဖြည့်ပြီးပါပြီ။ (ဤအချက်အလက် များသည် အကောင့် တစ်စုံတစ်ခုဖြစ်ပါက အသုံးပြုရန်ဖြစ်ပါသည်။)
                    </EsNormalText>
                </FlexRowContainer>

                <EsButton 
                    isDisible={!aggree||name.length==0||!dob||phone.length<10||!gender} 
                    loading={createUser.isPending} 
                    onPress={()=>{
                        _onSubmit()
                    }} title="ပေးပို့မည်"  />


                
            </FlexContainer>
        </FlexContainer>
    )
}

