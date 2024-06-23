import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { Button, TextInput } from 'react-native-paper'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import { auth, db, storage } from '../../firebaseConfig'
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

export default function SignupScreen({navigation}) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [image, setImage] = useState(null)

  const [showNext, setShowNext] = useState(false)
  const [loading, setLoading] = useState(false)

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

  if(loading) {
    return <ActivityIndicator size="large" color="#24B" />
  }

  const userSignup = async () => {
    setLoading(true)
    if(!email || !password || !phone || !name || !image) {
      alert('Please fill out every sections')
      setLoading(false)
      return
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)

      const usersRef = await setDoc(doc(db, "users", result?.user?.uid), {
        uid: result?.user?.uid,
        email: result?.user?.email,
        name: name,
        phone: phone,
        pic: image,
      });
      alert("Successfully created user: " + usersRef);
      setLoading(false)
    }
    catch(error) {
      console.log(error)
      setLoading(false)
      alert("Something went wrong")
    }
  }

  return (
    <View style={{
      backgroundColor: '#fff',
      height: "100%",
      paddingTop: 50,
      flex: 1,
      flexDirection: "column",
      gap: 30,
      justifyContent: "center",
    }}>
      <View>
        <Text style={styles.text}>Create an Account</Text>
      </View>
      <View style={styles.box2}>
        {!showNext && (
          <>
            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              mode="flat"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              style={styles.textInputs}
            />
            <TextInput
              label="Phone Number"
              value={phone}
              onChangeText={(text) => setPhone(text)}
              mode="flat"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              style={styles.textInputs}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              mode="flat"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              style={styles.textInputs}
              secureTextEntry
            />
          </>
        )}
        {showNext ?
        <>
          <TextInput
            label="Username"
            value={name}
            onChangeText={(text) => setName(text)}
            mode="flat"
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            style={styles.textInputs}
          />
          <Button
            style={{
              width: "70%",
              marginTop: 50,
              alignSelf: "center",
              backgroundColor: "lightgrey",
              color: "true",
            }}
            mode="outlined"
            onPress={() => pickImage()}
          >
            SELECT PROFILE PICTURE
          </Button>
          <Button
            style={{
              width: "30%",
              marginTop: 0,
              alignSelf: "center",
              backgroundColor: "#274C77",
              color: "white",
            }}
            mode="contained"
            disabled={image?false:true}
            onPress={() => userSignup()}
          >
            Sign up
          </Button>
        </>
        :
        <Button
          style={{
            width: "30%",
            marginTop: 20,
            alignSelf: "center",
            backgroundColor: "#274C77",
            color: "white",
          }}
          mode="contained"
          onPress={() => setShowNext(true)}
        >
          Next
        </Button>
        }
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
            padding: 0,
            marginTop: 10,
          }}
        >
          <Text>Already have an account?</Text>
          <TouchableOpacity>
            <Text
              style={{
                color: "#274C77",
                fontSize: 17,
                fontWeight: 700,
              }}
              onPress={() => navigation.goBack()}
            >
              Log in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.box3}>
        <Text style={{
          fontSize: 15,
          color: "#525252",
          textAlign: "center",
        }}>
          By registering, you agree to ChatterBox’s 
        </Text>
        <Text style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#274C77",
          textAlign: "center",
        }}>
          Terms of Service
        </Text>
        <Text style={{
          fontSize: 15,
          color: "#525252",
          textAlign: "center",
        }}>
          and
        </Text>
        <Text style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#274C77",
          textAlign: "center",
        }}>
          Privacy Policy.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    paddingHorizontal: 25,
    fontSize: 50,
    fontWeight: 700,
    color: "#274C77",
    fontFamily: "RobotoMonoSemiBold"
  },
  img: {
    width: 200,
    height: 200,
  },
  textInputs: {
    backgroundColor: "#EDEDED",
    paddingLeft: 20,
    borderBottomLeftRadius: 21,
    borderBottomRightRadius: 21,
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
  },
  box1: {
    alignItems: 'center',
  },
  box2: {
    paddingHorizontal: 25,
    paddingVertical: 25,
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    gap: 10,
  },
  box3: {
    marginTop: "auto",
    justifyContent: "center",
    alignItems: "center",
  }
});