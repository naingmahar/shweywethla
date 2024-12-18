import React, { FC, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
  FlatList,
} from 'react-native';
import { ESCardColor, ESColor } from '../res/EsColor';
import { FlexContainer } from './FlexContainer';
import { EsNormalText, EsSCardHeader, EsSmallHeader, EsSmallText } from '../EsText';
import { IUnitSize, IUnitSizeDetail } from '~/model/local/EsUnitSize';

const ListButton:FC<{text:string,isActice?:boolean,onPress:()=>any}> = (props) => {
    return(
        <FlexContainer  
            centerAlign 
            fullWidth 
            isTouchable
            onPress={()=>{
              props.onPress()
            }}
            style={{backgroundColor:props.isActice?ESColor.bgButton:ESColor.textWhite,marginTop:10,borderRadius:10}}>
            <EsNormalText noneBasicStyle defaultColor={props.isActice ? "white" : "black"}>
                {props.text}
            </EsNormalText>
        </FlexContainer>
    )
}


// interface IUnitSizesGroup {
//   data:Array<IUnitSizes>,
// }

// interface IUnitSizes {
//   title:string,
//   data:string[],
// }

interface IUnitSizesAction {
  setActive:(active:IUnitSizeDetail,id:string)=>any,
  active:string
}


const ListButtonGroup:FC<{data:IUnitSize}&IUnitSizesAction> = (props) => {
    return (
        <FlexContainer noneBasicStyle style={{backgroundColor:ESCardColor.bgSecondary,margin:10,padding:10,borderRadius:10}}>
            <EsSCardHeader defaultColor='black'>{props.data.name}</EsSCardHeader>
            {/* <EsSmallText>This unit is half the size of a small closet. You can pack your items into boxes to maximize the space.</EsSmallText> */}
        {
            props.data.details.map((row)=>{
                return <ListButton key={row.parent_area} text={`${row.parent_area} sqft`} onPress={()=>props.setActive(row,row.parent_area+"")} isActice={props.active == row.parent_area+""} />
            })
        }
        </FlexContainer>
    )
}

export const EsSectionList:FC<{data:IUnitSize[]}&IUnitSizesAction> = (props) => (
   <FlatList 
    data={props.data}
    renderItem={(param)=><ListButtonGroup data={param.item} setActive={props.setActive} active={props.active} />}
    keyExtractor={(props,index)=> String(index)}  
   />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
  },
});
