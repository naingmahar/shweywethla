import React, { createRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { IBook } from '../types/models/IBook';
import { NavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNav, RootStackParamList } from '../nav/main.nav';
import { downloadFile } from '../utils/downloadFile';
import { getRecordAdWatch, RemoveSavedRecordAdWatch } from '../services/recordAdsWatch';
import { getDownloadedBooks, isBookDownloaded } from '../services/downloadedBooksDB';
import { Colors } from '../res/color';
import { EsModel } from '../componet/atoms/container/ModalContainer';
import { IEsModelRefProps } from '../componet/atoms/Types/IModal';
import { FlexContainer, FlexRowContainer } from '../componet/atoms/container/FlexContainer';
import { EsTextInput } from '../componet/atoms/EsTextInput';
import { EsNormalHeader } from '../componet/atoms/EsText';
import Checkbox from '@react-native-community/checkbox';
import { EsButton } from '../componet/atoms/container/EsButton';
import firestore, { addDoc, collection, or, orderBy, query } from '@react-native-firebase/firestore';
import { deviceInfo } from '../utils/deviceInfo';
import { getStoreUserInfo, StoreUserInfo } from '../features/storage/UserStorage';

interface BookDetailsProps {
  book: IBook;
}

const { width } = Dimensions.get('window');
const coverWidth = width * 0.6;
const coverHeight = coverWidth * 1.5;

type BookDetailsScreenProps = NativeStackScreenProps<RootStackParamList, MainNav.BookDeatils>;

const BookDetailsScreen: React.FC<BookDetailsScreenProps> = ({route,navigation}) => {

  const book = route.params;
  const [downloaded, setDownloaded] = React.useState(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("")
  const [gender, setGender] = useState<"Male"|"Female"|"Other"|"">("");
      const registerModalRef = createRef<IEsModelRefProps>()
  const options = ['Male', 'Female', 'Other'];

  if (!route.params || !route.params) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Book not found.</Text>
      </View>
    );
  }

  useEffect(() => {
    isBookDownloaded(book.id).then((res)=>{
        if(res){
            setDownloaded(true)
        }else{
            getRecordAdWatch().then((adWatched)=>{
                console.log('Ad Watched ',adWatched);
                // if(adWatched === true && res == undefined){
                //     downloadFile(book)
                //         .then((downloadedBook)=>{
                //             if(downloadedBook) 
                //                 navigation.navigate(MainNav.Reader,downloadedBook)
                //         })
                // }
            })
        }
        
    })
    return(()  => {
        RemoveSavedRecordAdWatch()
    })  
  },[])

  const db = firestore();

  const register = async () => {
    const registerRef = db.collection('Users') 
    const deviceInformation = await deviceInfo();
    await registerRef.add({
        name,
        gender,
        deviceInformation

      }).then((val)=>{
            // console.log("User Added!")
            StoreUserInfo({id:val.id,name,gender})
            registerModalRef.current?.close()
        }).catch((err)=>{
            console.log("Error: ",err)
            registerModalRef.current?.close()
        })
  }

    const userActivity = async (user:string,action:string,book:string) => {
      const activityRef = db.collection('activityLogs') 
      await activityRef.add({
          user,
          action,
          book,
          timestamp:firestore.FieldValue.serverTimestamp()
        }).then((val)=>{
              console.log("Added activity!")
          }).catch((err)=>{
              console.log("Error: ",err)
          })
    }

  const handleOpenPdf = async () => {
    const userData = await getStoreUserInfo();
    userActivity(userData?.id||"",downloaded? "read":"download",book.id)
    if(!userData){
        registerModalRef.current?.open()
    }else{   
      let adWatched = await getRecordAdWatch();
      if(adWatched === false){
          navigation.navigate(MainNav.ADS,book)
      }else{
          navigation.navigate(MainNav.Reader,book)
      }
    }
}

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.coverImage}
          source={{ uri: book.coverImageUrl[0] }}
          resizeMode="contain"
        />
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>by {book.author}</Text>
      </View>

      <View style={styles.detailsContainer}>
        {/* <View style={styles.priceContainer}>
          <Text style={styles.priceText}>${book.price}</Text>
        </View> */}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Genre:</Text>
          <Text style={styles.infoValue}>{book.genre}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Language:</Text>
          <Text style={styles.infoValue}>{book.language}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Published:</Text>
          <Text style={styles.infoValue}>{book.publishedDate}</Text>
        </View>

        {book.publisher && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Publisher:</Text>
            <Text style={styles.infoValue}>{book.publisher}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pages:</Text>
          <Text style={styles.infoValue}>{book.numberOfPages}</Text>
        </View>

        <Text style={styles.descriptionHeader}>Description</Text>
        <Text style={styles.descriptionText}>{book.description}</Text>
      </View>

      {book.samplePdfUrl && (
        <TouchableOpacity style={styles.pdfButton} onPress={handleOpenPdf}>
          <Text style={styles.pdfButtonText}>{downloaded ?  "Read Now" : "Download"}</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 50 }} />

      {/* {Register Modal} */}
      <EsModel ref={registerModalRef} >
        <View style={{height:"50%"}} />
        <FlexContainer fullFlex fullWidth style={{padding:20,backgroundColor:'white',borderRadius:20}}>
            <EsNormalHeader style={{textAlign:'center',marginBottom:20}}>Your Information</EsNormalHeader>
            <EsTextInput isError={false}  label='Name' onChange={(val)=>{setName(val)}} placeHolder='Please Enter Your Name' />
            {/* <EsTextInput isError={false}  label='Email' onChange={()=>{}} placeHolder='Please Enter Your Email (Optional)' /> */}
            <FlexRowContainer noneBasicStyle style={{marginTop:10,alignItems:'center'}}>
                {options.map((opt) => (
                  <TouchableOpacity
                      key={opt}
                      style={styles.item}
                      activeOpacity={0.7}
                      onPress={() => setGender(opt as any)}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: gender === opt }}
                      >
                      <Checkbox
                      value={gender === opt}
                      onValueChange={() => setGender(opt as any)}
                      tintColors={{ true: Colors.nav, false: '#8e8e93' }}
                      />
                      <Text style={styles.label}>{opt}</Text>
                      </TouchableOpacity>
                      ))}
            </FlexRowContainer>

            <EsButton title='Continue'  isDisible={name == "" || gender == ""} style={[styles.pdfButton,{marginTop:30}]} onPress={()=>{
                register()
                navigation.navigate(MainNav.ADS,book)
            }}>
                {/* <Text style={styles.pdfButtonText}>Continue</Text> */}
            </EsButton>
        </FlexContainer>
      </EsModel>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'gray',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  coverImage: {
    width: coverWidth,
    height: coverHeight,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  author: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 35,
  },
  detailsContainer: {
    padding: 20,
  },
  priceContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    width: 100,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    lineHeight: 30,
  },
  descriptionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 30,
  },
  pdfButton: {
    backgroundColor: Colors.nav,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  pdfButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  label: {
    marginLeft: 6,
    fontSize: 16,
    color: '#333',
  },
});

export default BookDetailsScreen;