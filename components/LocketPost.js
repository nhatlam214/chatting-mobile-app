import { View, Text, StyleSheet, FlatList, Animated } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { db } from '../firebaseConfig'
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { ActivityIndicator } from 'react-native-paper'

import LocketPostItem from './LocketPostItem'

export default function LocketPost({user}) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [data, setData] = useState(null);
  useEffect( () => {
    const getData = async () => {
      const postsRef = collection(db,"posts");
      const querySnapshot = await getDocs(query(postsRef, orderBy("date", "desc")));
      const tempPost = []
      querySnapshot.forEach((doc) => {
        tempPost.push({id: doc.id, ...doc.data()})
      });
      console.log(tempPost)
      setData(tempPost)
    }

    getData();
  }, [])

  return (
    <View style={styles.container}>
      <View style={{flex: 1, marginTop: "10%"}}>
        <FlatList
          ItemSeparatorComponent={(
            <View style={{ paddingVertical: 175 }}/>
          )}
          contentContainerStyle={{ paddingTop: "50%", paddingBottom: "50%" }}
          data={data}
          scrollEnabled={false}
          renderItem={({ item }) => <LocketPostItem item={item} />}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})