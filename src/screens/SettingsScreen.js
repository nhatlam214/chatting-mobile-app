import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { auth, db } from '../../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'

export default function SettingsScreen({user, navigation}) {

  const [profile, setProfile] = useState("")

  useEffect(() => {
    getDoc(doc(db, "users", user.uid)).then(docSnap => {
      setProfile(docSnap.data())
    })
  }, [])

  if(!profile) {
    return <ActivityIndicator size="large" color="#24B" />
  }

  return (
    <View style={styles.container}>
      <View style={[styles.box1, styles.boxWithShadow]}>
        <View style={{flex: 1, justifyContent: "center"}}>
          <Text style={{fontWeight: 500, fontSize: 13, fontFamily: "RobotoMonoSemiBold"}}>Finish Customize Your Account</Text>
          <Text style={{fontWeight: 200, fontSize: 10, }}>If you forget your password, you’ll need a verified phone or email to log in.</Text>
        </View>
        <View>
          <Image source={require('../../assets/settings-1.png')} style={styles.imageBox1}/>
        </View>
      </View>
      <Text style={{alignSelf: "baseline", margin: 20, fontSize: 17, fontWeight: 600, fontFamily: "RobotoMonoSemiBold"}}>MY ACCOUNT</Text>
      <View style={[styles.box2, styles.boxWithShadow]}>
        <TouchableOpacity
          style={styles.touchBox2}
          onPress={() => {}}
        >
          <View style={{width: "100%", marginLeft: 10,flexDirection: 'column', gap: 5}}>
            <Text style={{fontSize: 15, fontWeight: 500,}}>Username</Text>
            <Text style={{color: "#525252",fontSize: 15, fontWeight: 300,}}>{profile.name}</Text>
          </View>
          <View style={{ }}>
            <MaterialIcons
              name="chevron-right"
              size={40}
              color="#525252"
              style={{ }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchBox2}
          onPress={() => {}}
        >
          <View style={{width: "100%", marginLeft: 10,flexDirection: 'column', gap: 5}}>
            <Text style={{fontSize: 15, fontWeight: 500,}}>Email</Text>
            <Text style={{color: "#525252",fontSize: 15, fontWeight: 300,}}>{profile.email}</Text>
          </View>
          <View style={{ }}>
            <MaterialIcons
              name="chevron-right"
              size={40}
              color="#525252"
              style={{ }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchBox2}
          onPress={() => {}}
        >
          <View style={{width: "100%", marginLeft: 10,flexDirection: 'column', gap: 5}}>
            <Text style={{fontSize: 15, fontWeight: 500,}}>Phone Number</Text>
            <Text style={{color: "#525252",fontSize: 15, fontWeight: 300,}}>{profile.phone}</Text>
          </View>
          <View style={{ }}>
            <MaterialIcons
              name="chevron-right"
              size={40}
              color="#525252"
              style={{ }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchBox2}
          onPress={() => {}}
        >
          <View style={{width: "100%", marginLeft: 10,flexDirection: 'column', gap: 5}}>
            <Text style={{fontSize: 15, fontWeight: 500,}}>UID</Text>
            <Text style={{color: "#525252",fontSize: 15, fontWeight: 300,}}>{profile.uid}</Text>
          </View>
          <View style={{ }}>
            <MaterialIcons
              name="chevron-right"
              size={40}
              color="#525252"
              style={{ }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.touchBox2, styles.noBorderWidth]}
          onPress={() => {}}
        >
          <View style={{width: "100%", marginLeft: 10, justifyContent: "center"}}>
            <Text style={{fontSize: 15, fontWeight: 500,}}>Password</Text>
          </View>
          <View style={{ }}>
            <MaterialIcons
              name="chevron-right"
              size={40}
              color="#525252"
              style={{ }}
            />
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.box3, styles.boxWithShadow]}
        onPress={() => signOut(auth)}
      >
        <Text style={{alignSelf: "baseline", fontSize: 17, fontWeight: 500, color: "#FF0000", }}>Log out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  boxWithShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  box1: {
    backgroundColor: "#fff",
    marginTop: 20,
    textAlign: "left",
    padding: 20,
    width: "90%",
    flexDirection: 'row',
    justifyContent: "space-evenly",
    borderRadius: 25,
  },
  imageBox1: {
    resizeMode: "contain",
    padding: 10,
  },
  box2: {
    backgroundColor: "#fff",
    textAlign: "left",
    width: "90%",
    flexDirection: 'column',
    justifyContent: "space-evenly",
    borderRadius: 25,
  },
  touchBox2: {
    borderColor: "#E9E9E9",
    borderBottomWidth: 1,
    width: "100%",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  noBorderWidth: {
    borderBottomWidth: 0,
  },
  box3: {
    backgroundColor: "#fff",
    marginTop: 30,
    textAlign: "left",
    padding: 20,
    width: "90%",
    borderRadius: 25,
  }
});