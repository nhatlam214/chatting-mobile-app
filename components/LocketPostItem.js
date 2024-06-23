import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db } from '../firebaseConfig'
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { ActivityIndicator } from 'react-native-paper'

export default function LocketPostItem({ user, item }) {
  const [profile, setProfile] = useState("")

  useEffect(() => {
    getDoc(doc(db, "users", item.uid)).then(docSnap => {
      setProfile(docSnap.data())
    })
  }, [])

  const { height, width } = useWindowDimensions();

  return (
    <View style={[styles.container, {width}]}>
      <Image source={{uri: item.pic}} style={[styles.image, {resizeMode: 'stretch'}]} />

      <View style={{flex: 1, paddingTop: 10, justifyContent: "center", alignContent: "center"}}>
        <Text style={styles.description}>{item.date}</Text>
        <View style={{flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingTop: 10, }}>
          <Image source={{uri: profile.pic}} style={[styles.profilePic]} />
          <Text style={styles.title}>{profile.name}</Text>
        </View>
        <View
          style={{
            overflow: 'hidden',
            justifyContent: "center",
            alignSelf: "center",
            paddingTop: 20,
            margin: 10,
            paddingHorizontal: 30,
          }}
        >
          <Text style={{
            color: "white",
            backgroundColor: "gray",
            paddingVertical: 10,
            paddingHorizontal: 30,
            borderRadius: 19,
            overflow: "hidden",
          }}>
              {item.cap}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePic: {
    borderWidth: 1,
    borderRadius: 50,
    width: 50,
    height: 50,
    marginRight: 10,
  },
  image: {
    flex: 0.7,
    justifyContent: 'center',
    width: 300,
    height: 300,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#000',
  },
  title: {
    fontWeight: 800,
    fontSize: 20,
    color: "#000",
    textAlign: 'center',
  },
  description: {
    fontWeight: 300,
    color: "#62656b",
    textAlign: 'center',
    paddingHorizontal: 70,
  },
})