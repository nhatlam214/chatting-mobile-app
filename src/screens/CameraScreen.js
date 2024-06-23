import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Animated,
  Button,
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Camera, CameraType, CameraView } from "expo-camera";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import LocketPost from "../../components/LocketPost";
import LocketCamera from "../../components/LocketCamera";


export default function CameraScreen({ user, navigation }) {


  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({
    viewAreaCoveragePercentageThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      <View style={{ flex: 3, marginTop: 0 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          contentContainerStyle={
            {
              rowGap: 0,
            }
          }
          pagingEnabled
          vertical={true}
          bounces={false}
          centerContent={true}
          alwaysBounceVertical={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          scrollEventThrottle={0}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        >
          <LocketCamera user={user} />
          <LocketPost user={user} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    flexDirection: "column",
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
