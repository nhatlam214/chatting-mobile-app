import { View, Text, Image, StyleSheet, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator, ImageBackground, Platform } from 'react-native'
import React, { useState } from 'react'
import { Button, TextInput } from 'react-native-paper'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebaseConfig'

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  if(loading) {
    return <ActivityIndicator size="large" color="#00ff00" />
  }

  const userLogin = async () => {
    setLoading(true)
    if(!email || !password) {
      alert('Please fill out every sections')
      setLoading(false)
      return
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      setLoading(false)
      navigation.navigate("camera")
    }
    catch(error) {
      console.log(error)
      setLoading(false)
      alert("Something went wrong")
    }
  }

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <ImageBackground
        source={require("../../assets/login-bg.png")}
        resizeMode="cover"
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            marginTop: "auto",
            paddingVertical: 40,
            borderRadius: 25,
          }}
        >
          <View>
            <Text style={styles.text}>Welcome back!</Text>
          </View>
          <View style={styles.box2}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              mode="outlined"
              style={styles.textInputs}
              outlineColor="transparent"
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              mode="outlined"
              style={styles.textInputs}
              secureTextEntry
              outlineColor="transparent"
            />
            <Button
              style={{
                width: "30%",
                marginTop: 20,
                alignSelf: "center",
                backgroundColor: "#274C77",
                color: "white",
              }}
              mode="contained"
              onPress={() => userLogin()}
            >
              Log in
            </Button>
          </View>
        </View>
        <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
              padding: 0,
              marginTop: 10,
              backgroundColor: "white",
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              paddingVertical: 20,
            }}
          >
            <Text style={{
              fontFamily: "RobotoMonoSemiBold",
            }}>
              Need an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("signup")}>
              <Text style={{ color: "#274C77", fontSize: 17, fontWeight: 700, fontFamily: "RobotoMonoSemiBold" }}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    paddingHorizontal: 25,
    fontSize: 40,
    fontWeight: 700,
    color: "#274C77",
    textAlign: 'center',
    fontFamily: "RobotoMonoSemiBold",
  },
  img: {
    width: 200,
    height: 200,
  },
  textInputs: {
    backgroundColor: "#EDEDED",
    paddingLeft: 20,
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
  }
});