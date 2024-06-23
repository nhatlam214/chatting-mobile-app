import { View, Text, ActivityIndicator, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db, storage } from '../../firebaseConfig'
import Feather from 'react-native-vector-icons/Feather'
import {Button, TextInput} from 'react-native-paper'
import { signOut } from 'firebase/auth'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

export default function ProfileSreen({user, navigation}) {
  const [profile, setProfile] = useState("")
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [username, setUsername] = useState("")
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  function renderModal1() {
    return(
      <Modal
      visible={openModal1}
      animationType='slide'
      transparent={true}
      >
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: 20,
          borderRadius: 10,
        }}
        >
          <View style={{
            backgroundColor: "white",
            padding: 15,
            width: "90%",
            borderRadius: 25,
            padding: 20,
          }}>
            <Text style={{ paddingBottom: 20,fontWeight: 500, margin: 10 }}>Change your profile picture to:</Text>
            <Button
              style={{
                width: "70%",
                alignSelf: "center",
                backgroundColor: "#274c98",
                color: "true",
              }}
              mode="outlined"
              onPress={() => pickImage()}
            >
              <MaterialIcons
                name="photo"
                size={20}
                color="#fff"
                style={{ }}
              />
            </Button>
            <View style={[{flexDirection: 'row', marginTop: 20, justifyContent: "space-evenly"}]}>
              <TouchableOpacity
                style={[
                  styles.boxWithShadow,
                  {backgroundColor: "white", borderRadius: 25, paddingHorizontal: 20, paddingVertical: 10}
                ]}
                onPress={() => setOpenModal1(false)}
              >
                <Text style={{color: "#ff0000"}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.boxWithShadow,
                  {backgroundColor: "#274C77", borderRadius: 25, paddingHorizontal: 20, paddingVertical: 10}
                ]}
                onPress={() => updatePfp(image)}
              >
                <Text style={{color: "#fff"}}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  function renderModal2() {
    return(
      <Modal
      visible={openModal2}
      animationType='slide'
      transparent={true}
      >
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: 20,
          borderRadius: 10,
        }}
        >
          <View style={{
            backgroundColor: "white",
            padding: 15,
            width: "90%",
            borderRadius: 25,
            padding: 20,
          }}>
            <Text style={{ paddingBottom: 20,fontWeight: 500, margin: 10 }}>Change your username to:</Text>
            <TextInput
              onChangeText={(text) => setUsername(text)}
              mode="outlined"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              style={{backgroundColor: "white", marginBottom: 20}}
            />
            <View style={[{flexDirection: 'row', marginTop: 20, justifyContent: "space-evenly"}]}>
              <TouchableOpacity
                style={[
                  styles.boxWithShadow,
                  {backgroundColor: "white", borderRadius: 25, paddingHorizontal: 20, paddingVertical: 10}
                ]}
                onPress={() => setOpenModal2(false)}
              >
                <Text style={{color: "#ff0000"}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.boxWithShadow,
                  {backgroundColor: "#274C77", borderRadius: 25, paddingHorizontal: 20, paddingVertical: 10}
                ]}
                onPress={() => updateUsername(username)}
              >
                <Text style={{color: "#fff"}}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  useEffect(() => {
    getDoc(doc(db, "users", user.uid)).then(docSnap => {
      setProfile(docSnap.data())
    })
  }, [])

  const updateUsername = async () => {
    setLoading(true)
    if(!username) {
      alert('Please fill in the username field.')
      setLoading(false)
      return
    }
    try {
      const result = await updateDoc(doc(db, "users", profile.uid), {
        name: username,
      })
      setLoading(false)
      alert("Successfully updated the username")
      setOpenModal2(false)
    }
    catch(error) {
      console.log(error)
      setLoading(false)
      alert("Something went wrong")
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  }

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `userprofile/${Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error(error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );
  };

  const updatePfp = async () => {
    setLoading(true)
    if(!image) {
      alert('Please select an image.')
      setLoading(false)
      return
    }
    try {
      const result = await updateDoc(doc(db, "users", profile.uid), {
        pic: image,
      })
      setLoading(false)
      alert("Successfully updated the profile picture")
      setOpenModal1(false)
      setImage(null)
    }
    catch(error) {
      console.log(error)
      setLoading(false)
      alert("Something went wrong")
    }
  }

  if(!profile) {
    return <ActivityIndicator size="large" color="#24B" />
  }

  return (
    <View style={styles.container}>
      <Image source={{uri: profile.pic}} style={styles.img} />
      <View style={styles.box1}>
        <View style={{padding: 15}}>
          <Text style={{fontWeight: 600, fontSize: 15}}>{profile.name}</Text>
          <Text style={{fontWeight: 200, fontSize: 12}}>{profile.email}</Text>
        </View>
        <View style={{flexDirection: "row", width: "100%", justifyContent: "space-evenly",}}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setOpenModal1(true)}
          >
            <View style={{ }}>
              <MaterialIcons
                name="image"
                size={20}
                color="#fff"
                style={{ }}
              />
            </View>
            <Text style={{color: "white"}}>Edit Profile Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setOpenModal2(true)}
          >
            <View style={{ }}>
              <MaterialIcons
                name="edit"
                size={20}
                color="#fff"
                style={{ }}
              />
            </View>
            <Text style={{color: "white"}}>Change name</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.box2, styles.boxWithShadow]}>
        <Image source={require('../../assets/profile-1.png')} />
        <View style={styles.textBox2}>
          <Text style={{fontWeight: 600, fontSize: 20, fontFamily: "RobotoMonoSemiBold"}}>Welcome to ChatterBox</Text>
          <Text style={{fontWeight: 400, fontSize: 10, color: "#909090", textAlign: "center", padding: 20}}>Chatterbox is a place where you can upload the scenes you want to people to see, and it is also a place for you to text.</Text>
          <TouchableOpacity
            style={[{backgroundColor: "#274C77", padding: 20, borderRadius: 25, }, styles.boxWithShadow]}
            onPress={() => navigation.navigate("home")}
          >
            <Text style={{color: "#fff", fontSize: 15, fontWeight: 600, fontFamily: "RobotoMonoSemiBold"}}>Message now!</Text>
          </TouchableOpacity>
        </View>
      </View>
      {[renderModal1()]}
      {renderModal2()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: 30,
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#D9D9D9',
  },
  text: {
    fontSize: 33,
    color: 'black'
  },
  btn: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#274C77',
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    flexDirection: "row",
  },
  box1: {
    marginTop: 10,
    width: "90%",
    backgroundColor: "#D9D9D9",
    borderRadius: 25,
    padding: 20,
    flexDirection: "column"
  },
  box2: {
    marginTop: 10,
    width: "90%",
    backgroundColor: "#274C77",
    borderRadius: 25,
    padding: 20,
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  boxWithShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  },
  textBox2: {
    flexDirection: "column",
    justifyContent: "center",
    overflow: "hidden",
    gap: 10,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 25,
    width: "100%",
  }
})
