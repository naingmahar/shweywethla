import { FC, ForwardedRef, forwardRef, useImperativeHandle, useState } from "react"
import { Modal, Pressable, StyleSheet, View } from "react-native"

export interface IEsModelProps{
    children:any
}

export interface IEsModelRefProps{
  open:()=>void
  close:()=>void
}

export const EsModel = forwardRef<IEsModelRefProps,IEsModelProps>((props,modalRef)=>{
    const [visible,open] = useState(false)

    useImperativeHandle(modalRef, () => {
        return {
          open() {
            open(true);
          },
          close() {
            open(false);
          },
        };
      }, []);

      
        return(
            <Modal 
                animationType="fade"
                transparent={true}
                visible={visible}
                
                >
                    <Pressable onPress={()=>{open(false)}} style={styles.base}>
                        {props.children}
                    </Pressable>
            </Modal>
        )
})


const styles = StyleSheet.create({
    base:{
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'rgba(0,0,0,0.8)'
    }
})