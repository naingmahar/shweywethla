import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import DatePicker from 'react-native-date-picker'
import { IEsModelProps, IEsModelRefProps } from './Types/IModal'
import { IEsPickerRefProps, IEsPrickerProps } from './Types/IDatePicker'
import { EsTextInput, IEsTextInput } from './EsTextInput'
import { IconKey } from './icons'
import moment from 'moment'
import { FlexContainer } from './container/FlexContainer'
import { EsPickup } from './EsPickUp'


export const EsDatePickerComponet = ((props:IEsTextInput&{isPickup?:boolean,date?:Date})=>{
    // const [date, setDate] = useState<Date>()
    const [open, setOpen] = useState(false)

    // useEffect(()=>{
    //     if(date) props.onChange(moment(date).format("x"))
    // },[date])

    console.log("Current DATE ",props.date)

    return (
        <FlexContainer KeyboardAvoidingView noneBasicStyle isTouchable onPress={()=>{setOpen(true)}}>
            {!props.isPickup &&<EsTextInput 
                isError={false} 
                label="" 
                value={props.date?moment(props.date).format("DD / MM / YYYY"):""}
                onFocus={()=>setOpen(true)}
                onChange={()=>setOpen(true)} 
                placeHolder={props.placeHolder} 
                icon={props.icon}  />
            }
            {props.isPickup &&<EsPickup 
                label={props.placeHolder}
                val={props.date?moment(props.date).format("LL"):moment().format("LL")}
                onPress={()=>setOpen(true)} 
                icon={props.icon||IconKey.calendar}
            />}
            
            <DatePicker
                modal
                open={open}
                date={props.date ? props.date:new Date()}
                mode='date'
                onConfirm={(date) => {
                    console.log("DATE",date)
                    props.onChange(date)
                    setOpen(false)
                    // setDate(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
        </FlexContainer>
    )
  })


export default React.memo(EsDatePickerComponet)