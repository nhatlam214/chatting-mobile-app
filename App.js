import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import 'react-native-gesture-handler';
import SignupScreen from './src/screens/SignupScreen';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ChatScreen from './src/screens/ChatScreen';
import { doc, getDoc } from 'firebase/firestore';
import ProfileSreen from './src/screens/ProfileSreen';
import CameraScreen from './src/screens/CameraScreen';
import PostScreen from './src/screens/PostScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import * as Font from 'expo-font'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// SplashScreen.preventAutoHideAsync();

const theme = {
  ...DefaultTheme,
  // Specify custom property
  roundness: 50,
  // Specify custom property in nested object
  colors: {
    ...DefaultTheme.colors,
    primary: '#274C77',
  },
};


const Stack = createStackNavigator();

const Navigation = () => {
  const [user, setUser] = useState('')
  // const [profile, setProfile] = useState("")

  useEffect(() => {

    const unregister = onAuthStateChanged(auth, userExist => {
      if(userExist){
        setUser(userExist)
      }
      else setUser("")
    })

    return () => {
      unregister()
    }

  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          // headerTitle: false,
          headerStyle: {
            backgroundColor: 'transparent',
          }
        }}
      >
        {user ? (
          <>
            <Stack.Screen
              name="camera"
              options={({navigation}) => ({
                title: null,
                headerLeft: () => (
                  <View style={{flexDirection:'row'}}>
                    <MaterialIcons
                      name="account-circle"
                      size={34}
                      color="#274C77"
                      style={{ marginLeft: 20}}
                      
                      onPress={() => navigation.navigate("profile")}
                    />
                  </View>
                ),
                headerRight: () => (
                  <View style={{flexDirection:'row', borderWidth: 1, borderRadius: 20, marginRight: 20}}>
                    <MaterialIcons
                      name="chat-bubble"
                      size={15}
                      color="#274C77"
                      style={{ padding: 10}}
                      onPress={() => navigation.navigate("home")}
                    />
                  </View>
                )
              })}
            >
              {(props) => <CameraScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen
              name="chat"
              options={({route, navigation}) => ({
                title:<View><Text style={styles.chatName}>{route.params.name}</Text></View>,
                headerLeft: () => (
                  <View style={{flexDirection:'row'}}>
                    <View
                      style={[styles.boxWithShadow,{marginLeft: 20, backgroundColor: 'white', borderRadius: 21}]}
                    >
                      <MaterialIcons
                        name="chevron-left"
                        size={40}
                        color="#274C77"
                        style={{  }}
                        onPress={() => navigation.goBack()}
                      />
                    </View>
                  </View>
                ),
              })}
            >
              {props => <ChatScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen
              name="profile"
              options={({navigation}) => ({
                title: null,
                headerLeft: () => (
                  <View style={{flexDirection:'row'}}>
                    <View
                      style={[styles.boxWithShadow,{marginLeft: 20, backgroundColor: 'white', borderRadius: 21}]}
                    >
                      <MaterialIcons
                        name="chevron-left"
                        size={40}
                        color="#274C77"
                        style={{  }}
                        onPress={() => navigation.goBack()}
                      />
                    </View>
                  </View>
                ),
                headerRight: () => (
                  <View style={{flexDirection:'row'}}>
                    <TouchableOpacity
                      style={{marginRight: 20, backgroundColor: '#274C77', borderRadius: 21, flex: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 10, gap: 3}}
                      onPress={() => navigation.navigate("settings")}
                    >
                      <MaterialIcons
                        name="settings"
                        size={20}
                        color="#fff"
                        style={{  }}
                      />
                      <Text style={{color: "white"}}>Settings</Text>
                    </TouchableOpacity>
                  </View>
                )
              })}
            >
              {props => <ProfileSreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen
              name="home"
              options={({navigation}) => ({
                title: "Messages",
                headerLeft: () => (
                  <View style={{flexDirection:'row'}}>
                    <View
                      style={[styles.boxWithShadow,{marginLeft: 20, backgroundColor: 'white', borderRadius: 21}]}
                    >
                      <MaterialIcons
                        name="chevron-left"
                        size={40}
                        color="#274C77"
                        style={{  }}
                        onPress={() => navigation.goBack()}
                      />
                    </View>
                  </View>
                ),
              })}
            >
              {(props) => <HomeScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen
              name="settings"
              options={({navigation}) => ({
                title: "Settings",
                headerLeft: () => (
                  <View style={{flexDirection:'row'}}>
                    <View
                      style={[styles.boxWithShadow,{marginLeft: 20, backgroundColor: 'white', borderRadius: 21}]}
                    >
                      <MaterialIcons
                        name="chevron-left"
                        size={40}
                        color="#274C77"
                        style={{  }}
                        onPress={() => navigation.goBack()}
                      />
                    </View>
                  </View>
                ),
              })}
            >
              {props => <SettingsScreen {...props} user={user} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen
              name="login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="signup"
              component={SignupScreen}
              options={({navigation}) => ({
                title: null,
                headerLeft: () => (
                  <View style={{flexDirection:'row'}}>
                    <View
                      style={[{marginLeft: 25, backgroundColor: 'white', borderRadius: 25, borderWidth: 1, padding: 8, backgroundColor: '#EBEBE9'}]}
                    >
                      <MaterialIcons
                        name="west"
                        size={25}
                        color="#274C77"
                        style={{  }}
                        onPress={() => navigation.goBack()}
                      />
                    </View>
                  </View>
                ),
              })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const App = () => {
  const [fontsLoaded, fontError] = useFonts({
    'RobotoMonoRegular': require('./assets/fonts/RobotoMono-Regular.ttf'),
    'RobotoMonoSemiBold': require('./assets/fonts/RobotoMono-SemiBold.ttf'),
  });

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded || fontError) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" backgroundColor='green' />
        <View style={styles.container}>
          <Navigation />
        </View>
      </PaperProvider>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  boxWithShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2, 
    elevation: 5
  },
  chatName: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#274C77'
  }
});

export default App;