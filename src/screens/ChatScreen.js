import { View, Text } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { GiftedChat, Bubble, InputToolbar, Actions, Send } from 'react-native-gifted-chat'
import { db } from '../../firebaseConfig';
import { setDoc, doc, addDoc, serverTimestamp, collection, getDoc, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default function ChatScreen({user,route}) {
  const [messages, setMessages] = useState([])
  const {uid} = route.params;

  const error = console.error;
  console.error = (...args) => { if (/defaultProps/.test(args[0])) return; error(...args); };

  const getAllMessages = async () => {
    }

  useEffect(() =>{
    const docid = uid > user.uid ? user.uid+ "-" + uid : uid + "-" + user.uid
    const messagesRef = collection(db, 'chatrooms', docid, 'messages')
    const querySnap = query(messagesRef, orderBy('createdAt', 'desc'))

    onSnapshot(querySnap, (querySnap) => {
      const allMsg = querySnap.docs.map(docSnap => {
        const data = docSnap.data()
        if(data.createdAt) {
          return {
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt.toDate()
          }
        } else {
          return {
            ...docSnap.data(),
            createdAt: new Date()
          }
        }
      })
      setMessages(allMsg)
    })
  }, [])

  const onSend = (messageArray) => {
    const msg = messageArray[0]
    const mymsg = {
      ...msg,
      sentBy: user.uid,
      sentTo: uid,
      createdAt: new Date()
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg))
    const docid = uid > user.uid ? user.uid+ "-" + uid : uid + "-" + user.uid
    addDoc(collection(db, 'chatrooms', docid, 'messages'), {...mymsg, createdAt: serverTimestamp()})
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <GiftedChat
        messages={messages}
        onSend={text => onSend(text)}
        user={{
          _id: user.uid,
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: '#000',
                  padding: 5,
                  marginRight: 20,
                  borderTopLeftRadius: 30,
                  borderBottomLeftRadius: 30,
                  borderTopRightRadius: 30,
                  borderBottomRightRadius: 30,
                },
                left: {
                  backgroundColor: '#D9D9D9',
                  padding: 5,
                  marginLeft: -20,
                  borderTopLeftRadius: 30,
                  borderBottomLeftRadius: 30,
                  borderTopRightRadius: 30,
                  borderBottomRightRadius: 30,
                }
              }}
            />
          )
        }}
        renderInputToolbar={(props) => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#EDEDED',
                marginLeft: 20,
                marginRight: 20,
                paddingTop: 10,
                paddingLeft: 10,
                marginBottom: 10,
                borderRadius: 30,
                borderTopWidth: 0,
              }}
              placeholder="Send a message"
              placeholderTextColor="#000"
            />
          )
        }}
        renderSend={(props) => {
          return (
            <Send
              {...props}
              containerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 20,
                marginBottom: 10,
                width: '30',
                height: '30',
                borderRadius: 50,
                borderWidth: 3,
                borderColor: '#000',
                backgroundColor: '#000',
              }}
            >
              <MaterialIcons
                name="arrow-upward"
                size={30}
                color="white"
              />
            </Send>
          )
        }}
      />
    </View>
  )
}