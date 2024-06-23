import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Camera, CameraType, CameraView } from "expo-camera";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { ActivityIndicator, TextInput } from "react-native-paper";

export default function LocketCamera({ user }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState("front");
  const [flash, setFlash] = useState("off");
  const [cap, setCap] = useState("");
  const cameraRef = useRef(null);
  const [showNext, setShowNext] = useState(false);
  const [profile, setProfile] = useState("");

  useEffect(() => {
    getDoc(doc(db, "users", user.uid)).then(docSnap => {
      setProfile(docSnap.data())
    })
  })

  function toggleCameraFacing() {
    setType((current) => (current === "front" ? "back" : "front"));
  }

  function toggleCameraFlash() {
    setFlash((current) => (current === "off" ? "on" : "off"));
  }

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setShowNext(true);
        setImage(data.uri);
        uploadImage(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `locketposts/${Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error(error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
        });
      }
    );
  };

  const savePicture = async () => {
    if (image) {
      try {
        const postsRef = await setDoc(doc(db, "posts", Date()), {
          uid: user?.uid,
          pic: image,
          date: Date(),
          cap: cap,
        });
        alert("Successfully created post: " + postsRef);
        setShowNext(false);
        setCap("");
      } catch (error) {
        console.log(error);
        alert("Something went wrong");
      }
    }
  };

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  return (
    <View style={styles.container}>
      {!showNext ? (
        <>
          <View
            style={{
              width: 375,
              height: 375,
              borderRadius: 20,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CameraView
              style={{ flex: 1, width: "100%", height: "100%" }}
              autofocus="false"
              facing={type}
              flash={flash}
              ref={cameraRef}
            ></CameraView>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              gap: "50",
            }}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity>
                <MaterialIcons
                  name="offline-bolt"
                  size={40}
                  color="#274C77"
                  onPress={toggleCameraFlash}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderWidth: 3,
                  borderColor: "#274C77",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 100,
                  height: 100,
                  backgroundColor: "#fff",
                  borderRadius: 50,
                }}
                onPress={takePicture}
              ></TouchableOpacity>
              <TouchableOpacity>
                <MaterialIcons
                  name="cached"
                  size={40}
                  color="#274C77"
                  onPress={toggleCameraFacing}
                />
              </TouchableOpacity>
            </View>
            <View>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={40}
                color="#274C77"
                onPress={() => {}}
              />
            </View>
          </View>
        </>
      ):(
        <>
          <View
            style={{
              flex: 1, 
              flexDirection: 'column', 
              gap: 3,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 375,
                height: 375,
                borderRadius: 20,
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image source={{uri: image}} style={{ flex: 1, width: "100%", height: "100%" }}/>
            </View>
            <View>
              <TextInput
                style={{
                  borderBottomLeftRadius: 30,
                  borderBottomRightRadius: 30,
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                  backgroundColor: "grey",
                  maxWidth: "80%",
                  textAlign: "center",
                }}
                textColor="#fff"
                multiline="true"
                underlineColor="transparent"
                selectionColor="#fff"
                activeUnderlineColor="transparent"
                overflow="hidden"
                keyboardAppearance="dark"
                placeholder=""
                value={cap}
                onChangeText={cap => setCap(cap)}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              gap: "50",
            }}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity>
                <MaterialIcons
                  name="close"
                  size={40}
                  color="#274C77"
                  onPress={() => setShowNext(false)}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderWidth: 3,
                  borderColor: "#275c88",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 100,
                  height: 100,
                  backgroundColor: "#275c88",
                  borderRadius: 50,
                }}
              >
                <MaterialIcons
                  name="check"
                  size={75}
                  color="#fff"
                  onPress={() => savePicture()}
                />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    position: "static",
    flex: 1,
    flexDirection: "column",
    gap: 100,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
  },
});
