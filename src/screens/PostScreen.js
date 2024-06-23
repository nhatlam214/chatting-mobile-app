import { View, Text, StyleSheet, StatusBar } from 'react-native'
import React from 'react'
import LocketPost from '../../components/LocketPost'
import { ScrollView } from 'react-native';

export default function PostScreen({user, navigation}) {
  return (
    <View style={styles.container}>
      <LocketPost />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
});