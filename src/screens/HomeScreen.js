import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, Firestore, getDocs, doc, DocumentSnapshot, query, where } from 'firebase/firestore'
import { auth, db } from '../../firebaseConfig'
import { FAB } from 'react-native-paper'

export default function HomeScreen({user, navigation}) {
  const [users, setUsers] = useState(null)

  const getUsers = async () => {
    const usersRef = query(collection(db, 'users'), where("uid", "!=", user.uid));
    const querySnapshot = await getDocs(usersRef)
    const allUsers = querySnapshot.docs.map(doc => doc.data())
    setUsers(allUsers)
  }

  useEffect(() => {
    getUsers()
  }, [])

  const RenderCard = ({item}) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('chat',{name:item.name,uid:item.uid})}>
        <View style={styles.mycard}>
          <Image source={{ uri: item.pic }} style={styles.profilePic} />
          <View style={{ gap: 5}}>
            <Text style={[styles.text,{ fontFamily: "RobotoMonoSemiBold"}]}>{item.name}</Text>
            <Text style={{fontSize:12, marginLeft: 15, fontWeight: 200, fontFamily: "RobotoMonoRegular"}}>{item.email}</Text>
            <Text style={{fontSize:12, marginLeft: 15, fontWeight: 600, color: "#A9A9A9"}}>IN MY CONTACTS</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={({item}) => {return <RenderCard item={item} />}}
        keyExtractor={(item) => item.uid}
      />
      {/* <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => console.log("Pressed")}
      /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profilePic: {
    width:60,
    height:60,
    borderRadius:30,
    backgroundColor:"green"
  },
  text: {
    fontSize:18,
    marginLeft: 15,
  },
  mycard: {
    flexDirection: 'row',
    margin: 3,
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  }
});