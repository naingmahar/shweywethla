import { EsNormalHeader, EsNormalText } from "../componet/atoms/EsText"
import { EsButton } from "../componet/atoms/container/EsButton"
import { FlexContainer } from "../componet/atoms/container/FlexContainer"

export const HelperPage = () => {
    return (
        <FlexContainer>
            <EsNormalHeader>ကူညီပေးသူ ဆိုတာဘာလဲ?</EsNormalHeader>
            <EsNormalText>Shwe Yet Hla App ကိုသုံးလာအောင်ပြောပေးသူ သို့ သုံးတတ်‌အောင်ကူညီပေးသူ ကိုဆိုလိုပါတယ်။</EsNormalText>

            <EsNormalHeader>ကျွန်တော်ရောကူညီသူ အနေနဲ့ လျောက်ထားလို့ရလား?</EsNormalHeader>
            <EsNormalText>ရပါတယ်ရှင့် သို့ပေမယ့် နေ့စဥ်ကလုပ်ရမည့် ကြော်ငြာ အကြိမ်နှစ်ဆယ် ကြည့်ခြင်းကို ရက်သုံးဆယ် ပြီးအောင်လုပ်ပေးရပါမယ်။</EsNormalText>

            <EsNormalHeader>ကူညီသူကဘာအကျိုးခံစားခွင့်ရမှာလဲ?</EsNormalHeader>
            <EsNormalText>{"သင်ကူညီလိုက်သူရဲ့ တစ်ရက်တာဝင်ငွေ၏ ၁၅ ရာခိုင်နှုန်းကို သင်ရရှိမှာပါ။ \n ဥပမာ - သင်ကူညီလိုက်သူက တစ်ရက်ဝင်ငွေ တစ်သောင်းရှိပါက သင် ၁၅၀၀ ရရှိပါမည်။"}</EsNormalText>

            <EsNormalHeader>ကူညီသူအနေနဲ့ ဘယ်လို အတည်ပြုရမလဲ?</EsNormalHeader>
            <EsNormalText>သင်ကူညီလိုက်သူ Acc စတင်ပြုလုပ်ပါက သင်၏ ကူညီသူ  Code ကို ရိုက်ထည့်ပေးလိုက်ရုံဖြစ်ပါတယ်ရှင့်။</EsNormalText>

            <EsButton onPress={()=>{}} title="လျှောက်ထားမည်။" style={{marginTop:30}} />

        </FlexContainer>
    )
}